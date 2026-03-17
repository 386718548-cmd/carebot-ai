import type { Medicine } from '@/data/medicines';
import { detectRedFlagsEnhanced } from '@/lib/red-flag-detector';

export interface MatchResult {
  medicine: Medicine;
  score: number;
  matchedTags: string[];
  warnings: {
    en: string[];
    zh: string[];
  };
  evidenceChain: {
    symptoms: string[];
    evidenceLevel: string;
    references: string[];
    matchScore: number;
  };
  lifestyleAdvice: {
    en: string[];
    zh: string[];
  };
  comorbidityAlerts: {
    en: string[];
    zh: string[];
  };
  riskLevel: 'low' | 'moderate' | 'high';
  fdaLabel?: {
    en: string;
    zh: string;
  };
  steppedTherapyNote?: {
    en: string;
    zh: string;
  };
}

export interface RedFlagResult {
  isCritical: boolean;
  alerts: {
    en: string[];
    zh: string[];
  };
}

export function detectRedFlags(selectedTags: string[]): RedFlagResult {
  const alertsEn: string[] = [];
  const alertsZh: string[] = [];
  
  const redFlagMappings: Record<string, { en: string; zh: string }> = {
    'symptom:thunderclap': { en: 'Sudden "Thunderclap" headache: Seek immediate emergency care.', zh: '突然发作的“霹雳样”剧痛：请立即就医急诊。' },
    'symptom:stiff_neck': { en: 'Fever and Stiff Neck: Possible meningitis, seek emergency care.', zh: '发烧伴脖子僵硬：可能为脑膜炎，请立即就医。' },
    'symptom:stroke_signs': { en: 'Neurologic deficits (weakness/slurred speech): Seek emergency care.', zh: '神经系统体征（无力/言语不清）：请立即就医急诊。' },
    'symptom:saddle_anesthesia': { en: 'Saddle anesthesia: Possible Cauda Equina Syndrome, seek emergency care.', zh: '会阴部（马鞍区）麻木：可能为马尾综合征，请立即就医。' },
    'symptom:sphincter_dysfunction': { en: 'Difficulty urinating/defecating with back pain: Seek emergency care.', zh: '腰痛伴排尿或排便困难：请立即就医。' },
    'symptom:leg_weakness': { en: 'Leg weakness/foot drop: Needs urgent clinical evaluation.', zh: '下肢无力/足下垂：需要紧急临床评估，请就医。' },
    'symptom:weight_loss': { en: 'Unexplained weight loss: Needs clinical evaluation.', zh: '不明原因体重减轻：需要临床评估，请就医。' },
    'symptom:dysphagia': { en: 'Difficulty swallowing: Requires further clinical evaluation.', zh: '吞咽困难：需要进一步临床评估，请就医。' },
    'symptom:black_stool': { en: 'Black/Tarry stools: Possible GI bleeding, seek medical attention.', zh: '黑便/柏油样便：可能存在胃肠道出血，请立即就医。' },
    'symptom:persistent_vomiting': { en: 'Persistent vomiting: Requires urgent clinical evaluation.', zh: '剧烈且持续的呕吐：需要紧急临床评估，请就医。' },
    'symptom:anemia_weight_loss': { en: 'Anemia/weight loss: Needs further evaluation.', zh: '贫血/体重减轻：需要进一步评估，请就医。' },
    'symptom:breathless': { en: 'Shortness of breath: Seek medical attention immediately.', zh: '呼吸困难/气促：请立即就医。' },
    'symptom:haemoptysis': { en: 'Coughing up blood: Requires urgent clinical evaluation.', zh: '咯血：需要紧急临床评估，请就医。' },
    'symptom:chest_pain': { en: 'Severe chest pain: Seek emergency care immediately.', zh: '剧烈胸痛：请立即就医急诊。' },
    'symptom:high_fever': { en: 'Persistent high fever (>39°C): Consult a doctor.', zh: '持续高烧 (>39°C)：请咨询医生。' },
    'symptom:hoarseness': { en: 'Hoarseness >2 weeks: Needs clinical evaluation.', zh: '声音嘶哑超过 2 周：需要临床评估，请就医。' },
  };

  selectedTags.forEach(tag => {
    if (redFlagMappings[tag]) {
      alertsEn.push(redFlagMappings[tag].en);
      alertsZh.push(redFlagMappings[tag].zh);
    }
  });

  return detectRedFlagsEnhanced(selectedTags);
}

export function matchDrugs(
  symptomTags: string[],
  exclusionTags: string[],
  causeTags: string[],
  comorbidityTags: string[],
  currentMeds: string[],
  historyTags: string[],
  medicines: Medicine[],
  severityWeights: Record<string, number> = {}
): MatchResult[] {
  const results: MatchResult[] = [];

  // 1. Generate Global Lifestyle Advice
  const lifestyleAdviceEn: string[] = [];
  const lifestyleAdviceZh: string[] = [];
  const alertsEn: string[] = [];
  const alertsZh: string[] = [];

  // Insomnia specific
  if (causeTags.includes('cause:stress')) {
    lifestyleAdviceEn.push('Practice relaxation techniques (deep breathing, dCBT-I) before bed.');
    lifestyleAdviceZh.push('睡前进行放松训练（深呼吸、数字化认知行为治疗 dCBT-I）。');
  }
  if (causeTags.includes('cause:diet')) {
    lifestyleAdviceEn.push('Avoid caffeine (tea/coffee) after 2 PM.');
    lifestyleAdviceZh.push('下午 2 点后避免摄入咖啡因（茶、咖啡）。');
  }
  if (causeTags.includes('cause:lifestyle') || causeTags.includes('cause:jetlag')) {
    lifestyleAdviceEn.push('Maintain a regular sleep-wake schedule, even on weekends. For jetlag, try sunlight exposure during the day.');
    lifestyleAdviceZh.push('保持规律的作息时间，即使是周末也要按时起居。对于时差，尝试白天的日光照射。');
  }
  if (causeTags.includes('cause:environment')) {
    lifestyleAdviceEn.push('Improve your sleep environment: keep it dark, quiet, and cool (18-22°C).');
    lifestyleAdviceZh.push('改善睡眠环境：保持黑暗、安静和凉爽（18-22°C）。');
  }

  // Back pain specific
  if (symptomTags.includes('symptom:acute_back_pain') || symptomTags.includes('symptom:subacute_back_pain')) {
    lifestyleAdviceEn.push('Avoid bed rest for more than 2 days; stay active as much as possible.');
    lifestyleAdviceZh.push('避免卧床休息超过 2 天；尽可能保持活动。');
  }

  // GERD specific
  if (symptomTags.includes('symptom:heartburn')) {
    lifestyleAdviceEn.push('Avoid eating 2-3 hours before bedtime; elevate the head of your bed.');
    lifestyleAdviceZh.push('睡前 2-3 小时避免进食；抬高床头。');
  }

  if (comorbidityTags.includes('comorbid:mental')) {
    alertsEn.push('Condition may be comorbid with anxiety/depression. Consult a specialist for evaluation.');
    alertsZh.push('可能与焦虑/抑郁共病。建议咨询专科医生进行评估，单纯药物效果可能有限。');
  }
  if (comorbidityTags.includes('comorbid:osa')) {
    alertsEn.push('Snoring may indicate sleep apnea. Use of sedatives may be dangerous. Consult a doctor.');
    alertsZh.push('打鼾可能提示睡眠呼吸暂停。使用镇静助眠药可能存在风险，请务必咨询医生。');
  }

  for (const med of medicines) {
    let isBlocked = false;
    const currentWarningsEn: string[] = [];
    const currentWarningsZh: string[] = [];
    let riskLevel: 'low' | 'moderate' | 'high' = 'low';

    // 2. Absolute Contraindication Check
    for (const tag of exclusionTags) {
      const tagKey = tag.replace('exclusion:', '');
      
      if (med.contraindication_tags.includes(tag)) {
        const severity = med.contraindications.severity[tagKey] || 'absolute';
        
        if (severity === 'absolute') {
          isBlocked = true;
          break;
        } else if (severity === 'caution' || severity === 'relative') {
          riskLevel = 'moderate';
          const idx = med.contraindications.structured.conditions.indexOf(tagKey);
          if (idx !== -1) {
            currentWarningsEn.push(`Caution: ${med.contraindications.en[idx]}`);
            currentWarningsZh.push(`慎用：${med.contraindications.zh[idx]}`);
          } else {
            const pIdx = med.contraindications.structured.populations.indexOf(tagKey);
            if (pIdx !== -1) {
              currentWarningsEn.push(`Caution for ${tagKey}: ${med.contraindications.en[pIdx] || 'Special caution needed'}`);
              currentWarningsZh.push(`${tagKey}慎用：${med.contraindications.zh[pIdx] || '需特别注意'}`);
            }
          }
        }
      }
    }

    if (isBlocked) continue;

    // 3. Drug-Drug Interaction (DDI) Check
    for (const patientMed of currentMeds) {
      const interaction = med.contraindications.structured.interactions.find(
        i => i.drugClass.toLowerCase() === patientMed.toLowerCase()
      );
      
      if (interaction) {
        if (interaction.severity === 'severe') {
          isBlocked = true;
          break;
        } else {
          riskLevel = riskLevel === 'low' ? 'moderate' : 'high';
          currentWarningsEn.push(`DDI Warning (${interaction.drugClass}): ${interaction.action}`);
          currentWarningsZh.push(`相互作用警告 (${interaction.drugClass}): ${interaction.action}`);
        }
      }
    }

    if (isBlocked) continue;
    let steppedTherapyNote: MatchResult['steppedTherapyNote'] | undefined;

    // 4. Stepped Therapy Logic
    if (symptomTags.includes('symptom:urticaria') && historyTags.includes('history:antihistamine_resistant')) {
      if (med.indication_tags.includes('symptom:urticaria')) {
        riskLevel = 'high';
        steppedTherapyNote = {
          en: 'Standard antihistamine dose failed. 4x dose may be needed under medical supervision.',
          zh: '标准剂量抗组胺药无效。可能需要四倍剂量（需在医生指导下进行）。'
        };
      }
    }

    if (symptomTags.includes('symptom:chronic_back_pain') && med.indication_tags.includes('symptom:chronic_back_pain')) {
      if (med.generic_name === 'Naproxen') {
        steppedTherapyNote = {
          en: 'Naproxen is the only first-line NSAID recommended for chronic low back pain.',
          zh: '萘普生是唯一被推荐用于慢性腰痛的一线非甾体抗炎药。'
        };
      }
    }

    // 5. Weighted Scoring Logic
    const matchedTags = symptomTags.filter(tag => 
      med.indication_tags.includes(tag)
    );

    if (matchedTags.length > 0) {
      let score = 0;
      matchedTags.forEach(tag => {
        const weight = severityWeights[tag] || 1;
        score += weight;
      });

      // Duration Matching (Stepped Therapy)
      if (symptomTags.includes('symptom:chronic_urticaria') && med.indication_tags.includes('symptom:chronic_urticaria')) {
        score += 1.5; // High priority for chronic condition matching
      }

      // Cause Matching Bonus
      const causeMatches = causeTags.filter(tag => med.suitable_causes?.includes(tag));
      score += causeMatches.length * 0.5;

      // Comorbidity Matching Bonus
      const comorbidMatches = comorbidityTags.filter(tag => med.suitable_comorbidities?.includes(tag));
      score += comorbidMatches.length * 0.5;

      // Evidence Level Bonus
      if (med.evidence_level === 'A') score += 1.0;
      if (med.evidence_level === 'B') score += 0.5;

      // Risk Penalty
      if (riskLevel === 'moderate') score -= 0.5;
      if (riskLevel === 'high') score -= 1.0;

      // FDA Label
      let fdaLabel: MatchResult['fdaLabel'] | undefined;
      if (med.fda_otc_monograph) {
        fdaLabel = {
          en: 'FDA OTC Compliant. May cause drowsiness; avoid driving or operating machinery after use.',
          zh: '符合 FDA OTC 标准。可能导致嗜睡；服药后请勿驾驶机动车或操作机械。'
        };
      }

      results.push({
        medicine: med,
        score: Math.max(0, score),
        matchedTags,
        warnings: {
          en: currentWarningsEn,
          zh: currentWarningsZh
        },
        evidenceChain: {
          symptoms: matchedTags.map(t => t.replace('symptom:', '')),
          evidenceLevel: med.evidence_level,
          references: med.references,
          matchScore: score
        },
        lifestyleAdvice: {
          en: lifestyleAdviceEn,
          zh: lifestyleAdviceZh
        },
        comorbidityAlerts: {
          en: alertsEn,
          zh: alertsZh
        },
        riskLevel,
        fdaLabel,
        steppedTherapyNote
      });
    }
  }

  return results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.medicine.evidence_level.localeCompare(a.medicine.evidence_level);
  });
}

export function checkSafetyNet(selectedOptions: any[]): boolean {
  // Returns true if any selected option is marked as critical
  return selectedOptions.some(opt => opt.is_critical === true);
}
