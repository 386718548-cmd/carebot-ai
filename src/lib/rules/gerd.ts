export type RuleSystem = 'gerd';
export type RuleType = 'redflag' | 'indication';

export interface RuleEvidence {
  guidelineId: string;
  description: string;
}

export interface RuleHit {
  ruleId: string;
  system: RuleSystem;
  type: RuleType;
  name: string;
  evidence: RuleEvidence;
}

export interface RuleActionBlockAll {
  kind: 'block_all';
  message: { en: string; zh: string };
}

export interface RuleActionRecommend {
  kind: 'recommend';
  medicineId: string;
  baseScore: number;
  note?: { en: string; zh: string };
}

export type RuleAction = RuleActionBlockAll | RuleActionRecommend;

export interface AuditableRule {
  ruleId: string;
  system: RuleSystem;
  type: RuleType;
  priority: number;
  name: string;
  when: {
    allOf?: string[];
    anyOf?: string[];
    noneOf?: string[];
  };
  actions: RuleAction[];
  evidence: RuleEvidence;
}

export interface GerdRuleEvalInput {
  tags: string[];
}

export interface GerdRuleEvalOutput {
  redFlags: { hit: RuleHit; action: RuleActionBlockAll }[];
  recommendations: { hit: RuleHit; action: RuleActionRecommend }[];
}

const rules: AuditableRule[] = [
  {
    ruleId: 'GERD_REDFLAG_001',
    system: 'gerd',
    type: 'redflag',
    priority: 1000,
    name: '消化系统红旗征阻断',
    when: { anyOf: ['symptom:dysphagia', 'symptom:black_stool', 'symptom:persistent_vomiting', 'symptom:anemia_weight_loss'] },
    actions: [
      {
        kind: 'block_all',
        message: {
          en: 'GI red flags: seek urgent medical evaluation.',
          zh: '消化系统红旗征：建议立即就医评估。'
        }
      }
    ],
    evidence: {
      guidelineId: 'GERD_2023',
      description: 'Alarm features (dysphagia, bleeding, weight loss) warrant evaluation.'
    }
  },
  {
    ruleId: 'GERD_001',
    system: 'gerd',
    type: 'indication',
    priority: 120,
    name: '典型反流：PPI 一线（奥美拉唑）',
    when: { allOf: ['symptom:heartburn'] },
    actions: [
      { kind: 'recommend', medicineId: 'omeprazole-20mg', baseScore: 0.95 }
    ],
    evidence: {
      guidelineId: 'GERD_2023',
      description: 'PPI is recommended for typical reflux symptoms.'
    }
  },
  {
    ruleId: 'GERD_002',
    system: 'gerd',
    type: 'indication',
    priority: 100,
    name: '典型反流：H2RA 备选（法莫替丁）',
    when: { allOf: ['symptom:heartburn'] },
    actions: [
      { kind: 'recommend', medicineId: 'famotidine-20mg', baseScore: 0.8 }
    ],
    evidence: {
      guidelineId: 'GERD_2023',
      description: 'H2RA can be an alternative or on-demand option.'
    }
  },
  {
    ruleId: 'FD_001',
    system: 'gerd',
    type: 'indication',
    priority: 90,
    name: '功能性消化不良（餐后饱胀/早饱）：促动力药',
    when: { anyOf: ['symptom:fullness', 'symptom:early_satiety'] },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'domperidone-10mg',
        baseScore: 0.85,
        note: {
          en: 'May be prescription-only in some regions; consider clinician/pharmacist guidance.',
          zh: '部分地区可能为处方药，建议在医生/药师指导下使用。'
        }
      }
    ],
    evidence: {
      guidelineId: 'APAC_FD_2023',
      description: 'Prokinetics may be considered for postprandial distress syndrome.'
    }
  },
  {
    ruleId: 'FD_002',
    system: 'gerd',
    type: 'indication',
    priority: 80,
    name: '上腹痛：抗酸剂按需',
    when: { allOf: ['symptom:stomach_pain'] },
    actions: [
      { kind: 'recommend', medicineId: 'calcium-carbonate', baseScore: 0.7 }
    ],
    evidence: {
      guidelineId: 'APAC_FD_2023',
      description: 'Antacids may be used on-demand for symptom relief.'
    }
  }
];

function matchesWhen(tags: string[], when: AuditableRule['when']): boolean {
  const tagSet = new Set(tags);
  if (when.allOf && !when.allOf.every(t => tagSet.has(t))) return false;
  if (when.anyOf && !when.anyOf.some(t => tagSet.has(t))) return false;
  if (when.noneOf && when.noneOf.some(t => tagSet.has(t))) return false;
  return true;
}

export function evaluateGerdRules(input: GerdRuleEvalInput): GerdRuleEvalOutput {
  const sorted = [...rules].sort((a, b) => b.priority - a.priority);
  const redFlags: GerdRuleEvalOutput['redFlags'] = [];
  const recommendations: GerdRuleEvalOutput['recommendations'] = [];

  for (const rule of sorted) {
    if (!matchesWhen(input.tags, rule.when)) continue;

    const baseHit: RuleHit = {
      ruleId: rule.ruleId,
      system: rule.system,
      type: rule.type,
      name: rule.name,
      evidence: rule.evidence
    };

    for (const action of rule.actions) {
      if (action.kind === 'block_all') redFlags.push({ hit: baseHit, action });
      if (action.kind === 'recommend') recommendations.push({ hit: baseHit, action });
    }
  }

  return { redFlags, recommendations };
}

