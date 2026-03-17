export type RuleSystem = 'allergic_rhinitis';
export type RuleType = 'indication';

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

export interface RuleActionRecommend {
  kind: 'recommend';
  medicineId: string;
  baseScore: number;
  note?: { en: string; zh: string };
}

export type RuleAction = RuleActionRecommend;

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

export interface RhinitisRuleEvalInput {
  tags: string[];
}

export interface RhinitisRuleEvalOutput {
  recommendations: { hit: RuleHit; action: RuleActionRecommend }[];
}

const rules: AuditableRule[] = [
  // Generic allergic rhinitis fallback rule
  {
    ruleId: 'AR_GEN',
    system: 'allergic_rhinitis',
    type: 'indication',
    priority: 80,
    name: '通用过敏性鼻炎推荐：抗组胺和鼻喷',
    when: { anyOf: ['symptom:rhinitis'] },
    actions: [
      { kind: 'recommend', medicineId: 'cetirizine-10mg', baseScore: 0.9 },
      { kind: 'recommend', medicineId: 'loratadine-10mg', baseScore: 0.85 },
      { kind: 'recommend', medicineId: 'fluticasone-nasal', baseScore: 0.85 },
      { kind: 'recommend', medicineId: 'mometasone-nasal', baseScore: 0.8 }
    ],
    evidence: { guidelineId: 'AR_2024', description: 'Multiple OTC antihistamine and nasal steroid options for allergic rhinitis.' }
  },
  {
    ruleId: 'AR_001',
    system: 'allergic_rhinitis',
    type: 'indication',
    priority: 100,
    name: '轻中度/间歇性：二代抗组胺药一线（西替利嗪）',
    when: { anyOf: ['symptom:mild_rhinitis'] },
    actions: [{ kind: 'recommend', medicineId: 'cetirizine-10mg', baseScore: 0.95 }],
    evidence: { guidelineId: 'AR_2024', description: 'Second-generation oral antihistamines are first-line for mild intermittent allergic rhinitis.' }
  },
  {
    ruleId: 'AR_002',
    system: 'allergic_rhinitis',
    type: 'indication',
    priority: 90,
    name: '轻中度/间歇性：二代抗组胺药备选（氯雷他定）',
    when: { anyOf: ['symptom:mild_rhinitis'] },
    actions: [{ kind: 'recommend', medicineId: 'loratadine-10mg', baseScore: 0.9 }],
    evidence: { guidelineId: 'AR_2024', description: 'Loratadine is a non-sedating second-generation antihistamine option.' }
  },
  {
    ruleId: 'AR_003',
    system: 'allergic_rhinitis',
    type: 'indication',
    priority: 110,
    name: '中重度/持续性：鼻用激素一线（氟替卡松）',
    when: { anyOf: ['symptom:severe_rhinitis'] },
    actions: [{ kind: 'recommend', medicineId: 'fluticasone-nasal', baseScore: 0.95 }],
    evidence: { guidelineId: 'AR_2024', description: 'Intranasal corticosteroids are first-line for moderate-severe persistent allergic rhinitis.' }
  },
  {
    ruleId: 'AR_004',
    system: 'allergic_rhinitis',
    type: 'indication',
    priority: 100,
    name: '中重度/持续性：联合治疗（加用二代抗组胺药）',
    when: { anyOf: ['symptom:severe_rhinitis'] },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'cetirizine-10mg',
        baseScore: 0.85,
        note: {
          en: 'If control is inadequate, combination therapy with antihistamine may help.',
          zh: '若控制不佳，可在鼻用激素基础上联合二代抗组胺药。'
        }
      }
    ],
    evidence: { guidelineId: 'AR_2024', description: 'Combination therapy can be considered for persistent symptoms.' }
  }
];

function matchesWhen(tags: string[], when: AuditableRule['when']): boolean {
  const tagSet = new Set(tags);
  if (when.allOf && !when.allOf.every(t => tagSet.has(t))) return false;
  if (when.anyOf && !when.anyOf.some(t => tagSet.has(t))) return false;
  if (when.noneOf && when.noneOf.some(t => tagSet.has(t))) return false;
  return true;
}

export function evaluateAllergicRhinitisRules(input: RhinitisRuleEvalInput): RhinitisRuleEvalOutput {
  const sorted = [...rules].sort((a, b) => b.priority - a.priority);
  const recommendations: RhinitisRuleEvalOutput['recommendations'] = [];

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
      recommendations.push({ hit: baseHit, action });
    }
  }

  return { recommendations };
}

