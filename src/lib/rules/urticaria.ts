export type RuleSystem = 'urticaria';
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

export interface UrticariaRuleEvalInput {
  tags: string[];
}

export interface UrticariaRuleEvalOutput {
  recommendations: { hit: RuleHit; action: RuleActionRecommend }[];
}

const rules: AuditableRule[] = [
  // Generic urticaria fallback rule
  {
    ruleId: 'URTICARIA_GEN',
    system: 'urticaria',
    type: 'indication',
    priority: 80,
    name: '通用荨麻疹推荐：抗组胺多选项',
    when: { anyOf: ['symptom:urticaria'] },
    actions: [
      { kind: 'recommend', medicineId: 'cetirizine-10mg', baseScore: 0.9 },
      { kind: 'recommend', medicineId: 'loratadine-10mg', baseScore: 0.85 },
      { kind: 'recommend', medicineId: 'calamine-lotion', baseScore: 0.7 },
      { kind: 'recommend', medicineId: 'diphenhydramine-itch-cream', baseScore: 0.75 }
    ],
    evidence: { guidelineId: 'CSU_2025', description: 'Multiple OTC antihistamine and topical options for urticaria relief.' }
  },
  {
    ruleId: 'URTICARIA_001',
    system: 'urticaria',
    type: 'indication',
    priority: 110,
    name: '荨麻疹一线：二代抗组胺药（西替利嗪）',
    when: { allOf: ['symptom:urticaria'], anyOf: ['symptom:acute_urticaria', 'symptom:chronic_urticaria'] },
    actions: [{ kind: 'recommend', medicineId: 'cetirizine-10mg', baseScore: 0.95 }],
    evidence: { guidelineId: 'CSU_2025', description: 'Second-generation H1 antihistamines are first-line for urticaria.' }
  },
  {
    ruleId: 'URTICARIA_002',
    system: 'urticaria',
    type: 'indication',
    priority: 100,
    name: '荨麻疹一线：二代抗组胺药（氯雷他定）',
    when: { allOf: ['symptom:urticaria'], anyOf: ['symptom:acute_urticaria', 'symptom:chronic_urticaria'] },
    actions: [{ kind: 'recommend', medicineId: 'loratadine-10mg', baseScore: 0.9 }],
    evidence: { guidelineId: 'CSU_2025', description: 'Second-generation H1 antihistamines are first-line for urticaria.' }
  },
  {
    ruleId: 'URTICARIA_003',
    system: 'urticaria',
    type: 'indication',
    priority: 120,
    name: '慢性荨麻疹：标准剂量无效提示阶梯升级',
    when: { allOf: ['symptom:urticaria', 'symptom:chronic_urticaria', 'history:antihistamine_resistant'] },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'cetirizine-10mg',
        baseScore: 0.8,
        note: {
          en: 'If standard dose fails, up-dosing may be needed under medical supervision.',
          zh: '标准剂量无效时，可能需要加量（需在医生指导下进行）。'
        }
      }
    ],
    evidence: { guidelineId: 'CSU_2025', description: 'Up-dosing is a recommended step when standard doses fail; many patients remain refractory.' }
  }
];

function matchesWhen(tags: string[], when: AuditableRule['when']): boolean {
  const tagSet = new Set(tags);
  if (when.allOf && !when.allOf.every(t => tagSet.has(t))) return false;
  if (when.anyOf && !when.anyOf.some(t => tagSet.has(t))) return false;
  if (when.noneOf && when.noneOf.some(t => tagSet.has(t))) return false;
  return true;
}

export function evaluateUrticariaRules(input: UrticariaRuleEvalInput): UrticariaRuleEvalOutput {
  const sorted = [...rules].sort((a, b) => b.priority - a.priority);
  const recommendations: UrticariaRuleEvalOutput['recommendations'] = [];

  for (const rule of sorted) {
    if (!matchesWhen(input.tags, rule.when)) continue;
    const baseHit: RuleHit = { ruleId: rule.ruleId, system: rule.system, type: rule.type, name: rule.name, evidence: rule.evidence };
    for (const action of rule.actions) recommendations.push({ hit: baseHit, action });
  }

  return { recommendations };
}

