import { z } from 'zod';
import { medicines } from '@/data/medicines';
import { detectRedFlags, matchDrugs } from '@/lib/decision-engine';
import { evaluateHeadacheRules } from '@/lib/rules/headache';

const stringArray = z.array(z.string()).default([]);

export const ClinicalDecisionRequestSchema = z.object({
  symptoms: z
    .object({
      primary: z.string(),
      details: z.record(z.string(), z.any()).optional()
    })
    .optional(),
  tags: z
    .object({
      symptomTags: stringArray,
      exclusionTags: stringArray,
      causeTags: stringArray,
      comorbidityTags: stringArray,
      historyTags: stringArray
    })
    .optional(),
  patient: z
    .object({
      age: z.number().int().nonnegative().optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      pregnancy: z.enum(['yes', 'no', 'unknown']).optional(),
      conditions: stringArray,
      medications: stringArray
    })
    .optional()
});

export type ClinicalDecisionRequest = z.infer<typeof ClinicalDecisionRequestSchema>;

export interface ClinicalDecisionResponse {
  red_flags: { system?: string; message: string }[];
  recommendations: {
    drugId: string;
    drugName: string;
    match_score: number;
    dosing: { en: string; zh: string };
    evidence: { level: string; references: string[] };
    risk_level: 'low' | 'moderate' | 'high';
    warnings: { en: string[]; zh: string[] };
    stepped_therapy_note?: { en: string; zh: string };
    audit?: {
      triggered_rules: {
        ruleId: string;
        system: string;
        type: string;
        name: string;
        guidelineId: string;
        evidence: string;
      }[];
    };
  }[];
  referral: string | null;
  disclaimer: string;
}

function normalizeDrugClasses(medications: string[]): string[] {
  const mapped: string[] = [];
  medications.forEach(m => {
    const x = m.trim().toLowerCase();
    if (!x) return;
    if (x.includes('warfarin') || x.includes('aspirin') || x.includes('anticoagul')) mapped.push('Anticoagulants');
    if (x.includes('sedative') || x.includes('cns') || x.includes('benzodia')) mapped.push('CNS Depressants');
    if (x.includes('clopidogrel')) mapped.push('Clopidogrel');
    if (x.includes('maoi') || x.includes('mao inhibitor')) mapped.push('MAOIs');
    if (x.includes('alcohol')) mapped.push('Alcohol');
  });
  return Array.from(new Set(mapped));
}

function mapPatientToExclusions(conditions: string[], pregnancy?: 'yes' | 'no' | 'unknown', age?: number): string[] {
  const exclusions: string[] = [];
  const c = conditions.map(x => x.trim().toLowerCase());
  if (c.some(x => x.includes('ulcer') || x.includes('peptic'))) exclusions.push('exclusion:stomach_ulcer');
  if (c.some(x => x.includes('liver'))) exclusions.push('exclusion:liver_disease');
  if (c.some(x => x.includes('kidney') || x.includes('renal'))) exclusions.push('exclusion:kidney_disease');
  if (c.some(x => x.includes('glaucoma'))) exclusions.push('exclusion:glaucoma');
  if (c.some(x => x.includes('hypertension') || x.includes('high blood pressure'))) exclusions.push('exclusion:hypertension');
  if (c.some(x => x.includes('asthma'))) exclusions.push('exclusion:asthma');
  if (pregnancy === 'yes') exclusions.push('exclusion:pregnant');
  if (typeof age === 'number' && age > 65) exclusions.push('exclusion:elderly');
  if (typeof age === 'number' && age < 18) exclusions.push('exclusion:pediatric');
  return Array.from(new Set(exclusions));
}

function mapSymptomToTags(primary?: string, details?: Record<string, any>): { symptomTags: string[]; historyTags: string[]; severityWeights: Record<string, number> } {
  const symptomTags: string[] = [];
  const historyTags: string[] = [];
  const severityWeights: Record<string, number> = {};
  const p = (primary || '').trim().toLowerCase();
  const d = details || {};

  if (p === 'headache') {
    symptomTags.push('symptom:headache');
    if (d.type === 'tension') symptomTags.push('symptom:tension_type');
    if (d.type === 'migraine') symptomTags.push('symptom:migraine_type');
    if (d.bilateral === true || d.location === 'bilateral') symptomTags.push('symptom:bilateral');
    if (d.intensity === 'mild' || d.intensity === 'moderate') symptomTags.push('symptom:mild_moderate');
    if (d.thunderclap === true) symptomTags.push('symptom:thunderclap');
    if (d.fever_stiff_neck === true) symptomTags.push('symptom:stiff_neck');
    if (d.stroke_signs === true) symptomTags.push('symptom:stroke_signs');
  }

  if (p === 'low_back_pain' || p === 'back_pain') {
    const days = typeof d.duration_days === 'number' ? d.duration_days : undefined;
    if (typeof days === 'number') {
      if (days < 28) symptomTags.push('symptom:acute_back_pain');
      else if (days < 84) symptomTags.push('symptom:subacute_back_pain');
      else symptomTags.push('symptom:chronic_back_pain');
    }
    if (d.saddle_anesthesia === true) symptomTags.push('symptom:saddle_anesthesia');
    if (d.sphincter_dysfunction === true) symptomTags.push('symptom:sphincter_dysfunction');
    if (d.leg_weakness === true) symptomTags.push('symptom:leg_weakness');
  }

  if (p === 'cough' || p === 'cold') {
    if (d.cough_type === 'dry') symptomTags.push('symptom:dry_cough');
    if (d.cough_type === 'productive') symptomTags.push('symptom:wet_cough');
    if (d.breathless === true) symptomTags.push('symptom:breathless');
    if (d.haemoptysis === true) symptomTags.push('symptom:haemoptysis');
    if (d.chest_pain === true) symptomTags.push('symptom:chest_pain');
    if (d.high_fever === true) symptomTags.push('symptom:high_fever');
    if (d.dysphagia === true) symptomTags.push('symptom:dysphagia');
    if (d.hoarseness_2w === true) symptomTags.push('symptom:hoarseness');
  }

  if (p === 'gerd' || p === 'digestive') {
    if (d.heartburn === true) symptomTags.push('symptom:heartburn');
    if (d.stomach_pain === true) symptomTags.push('symptom:stomach_pain');
    if (d.fullness === true) symptomTags.push('symptom:fullness');
    if (d.early_satiety === true) symptomTags.push('symptom:early_satiety');
    if (d.dysphagia === true) symptomTags.push('symptom:dysphagia');
    if (d.black_stool === true) symptomTags.push('symptom:black_stool');
    if (d.persistent_vomiting === true) symptomTags.push('symptom:persistent_vomiting');
    if (d.anemia_weight_loss === true) symptomTags.push('symptom:anemia_weight_loss');
  }

  if (p === 'allergic_rhinitis' || p === 'rhinitis') {
    symptomTags.push('symptom:rhinitis');
    if (d.severity === 'mild_intermittent') symptomTags.push('symptom:mild_rhinitis');
    if (d.severity === 'severe_persistent') symptomTags.push('symptom:severe_rhinitis');
  }

  if (p === 'urticaria') {
    symptomTags.push('symptom:urticaria');
    const weeks = typeof d.duration_weeks === 'number' ? d.duration_weeks : undefined;
    if (typeof weeks === 'number') {
      if (weeks < 6) symptomTags.push('symptom:acute_urticaria');
      else symptomTags.push('symptom:chronic_urticaria');
    }
    if (d.previous_treatment === 'none') historyTags.push('history:no_treatment');
    if (d.previous_treatment === 'sgAH_standard_failed') historyTags.push('history:antihistamine_resistant');
  }

  return { symptomTags: Array.from(new Set(symptomTags)), historyTags: Array.from(new Set(historyTags)), severityWeights };
}

export function clinicalDecision(input: ClinicalDecisionRequest): ClinicalDecisionResponse {
  const patientAge = input.patient?.age;
  const exclusions = input.tags?.exclusionTags?.length
    ? input.tags.exclusionTags
    : mapPatientToExclusions(input.patient?.conditions || [], input.patient?.pregnancy, patientAge);

  const mapped = mapSymptomToTags(input.symptoms?.primary, input.symptoms?.details);

  const symptomTags = input.tags?.symptomTags?.length ? input.tags.symptomTags : mapped.symptomTags;
  const causeTags = input.tags?.causeTags?.length ? input.tags.causeTags : [];
  const comorbidityTags = input.tags?.comorbidityTags?.length ? input.tags.comorbidityTags : [];
  const historyTags = input.tags?.historyTags?.length ? input.tags.historyTags : mapped.historyTags;
  const currentMeds = normalizeDrugClasses(input.patient?.medications || []);

  const isHeadacheCase =
    (input.symptoms?.primary || '').trim().toLowerCase() === 'headache' || symptomTags.includes('symptom:headache');
  if (isHeadacheCase) {
    const evalOut = evaluateHeadacheRules({ symptomTags });
    if (evalOut.redFlags.length > 0) {
      return {
        red_flags: evalOut.redFlags.map(x => ({
          system: x.hit.system,
          message: x.action.message.zh
        })),
        recommendations: [],
        referral: 'emergency',
        disclaimer: '本推荐基于临床指南生成，仅供参考，不替代医生诊断。'
      };
    }

    const candidateIds = Array.from(new Set(evalOut.recommendations.map(x => x.action.medicineId)));
    const candidateMeds = medicines.filter(m => candidateIds.includes(m.id));
    const safetyFiltered = matchDrugs(
      symptomTags,
      exclusions,
      causeTags,
      comorbidityTags,
      currentMeds,
      historyTags,
      candidateMeds,
      mapped.severityWeights
    );

    const hitByMedId = new Map<string, typeof evalOut.recommendations>();
    for (const r of evalOut.recommendations) {
      const list = hitByMedId.get(r.action.medicineId) || [];
      list.push(r);
      hitByMedId.set(r.action.medicineId, list);
    }

    return {
      red_flags: [],
      recommendations: safetyFiltered.map(r => {
        const hits = (hitByMedId.get(r.medicine.id) || []).map(h => ({
          ruleId: h.hit.ruleId,
          system: h.hit.system,
          type: h.hit.type,
          name: h.hit.name,
          guidelineId: h.hit.evidence.guidelineId,
          evidence: h.hit.evidence.description
        }));

        const baseScore = Math.max(
          0,
          ...(hitByMedId.get(r.medicine.id) || []).map(h => h.action.baseScore)
        );

        return {
          drugId: r.medicine.id,
          drugName: r.medicine.name,
          match_score: Number(baseScore.toFixed(2)),
          dosing: { en: r.medicine.dosage.en, zh: r.medicine.dosage.zh },
          evidence: { level: r.medicine.evidence_level, references: r.medicine.references },
          risk_level: r.riskLevel,
          warnings: { en: r.warnings.en, zh: r.warnings.zh },
          stepped_therapy_note: r.steppedTherapyNote,
          audit: { triggered_rules: hits }
        };
      }),
      referral: null,
      disclaimer: '本推荐基于临床指南生成，仅供参考，不替代医生诊断。'
    };
  }

  const redFlags = detectRedFlags(symptomTags);
  if (redFlags.isCritical) {
    return {
      red_flags: redFlags.alerts.zh.map(message => ({ message })),
      recommendations: [],
      referral: 'emergency',
      disclaimer: '本推荐基于临床指南生成，仅供参考，不替代医生诊断。'
    };
  }

  const matched = matchDrugs(
    symptomTags,
    exclusions,
    causeTags,
    comorbidityTags,
    currentMeds,
    historyTags,
    medicines,
    mapped.severityWeights
  );

  return {
    red_flags: [],
    recommendations: matched.map(r => ({
      drugId: r.medicine.id,
      drugName: r.medicine.name,
      match_score: Number(r.score.toFixed(2)),
      dosing: { en: r.medicine.dosage.en, zh: r.medicine.dosage.zh },
      evidence: { level: r.medicine.evidence_level, references: r.medicine.references },
      risk_level: r.riskLevel,
      warnings: { en: r.warnings.en, zh: r.warnings.zh },
      stepped_therapy_note: r.steppedTherapyNote
    })),
    referral: null,
    disclaimer: '本推荐基于临床指南生成，仅供参考，不替代医生诊断。'
  };
}
