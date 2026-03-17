export type RuleSystem = 'insomnia';
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

export interface InsomniaRuleEvalInput {
  tags: string[];
}

export interface InsomniaRuleEvalOutput {
  recommendations: { hit: RuleHit; action: RuleActionRecommend }[];
}

const rules: AuditableRule[] = [
  // Primary insomnia - simple case, recommend multiple first-line options
  {
    ruleId: 'INSOMNIA_GEN',
    system: 'insomnia',
    type: 'indication',
    priority: 150,
    name: '通用失眠推荐：多种选择',
    when: { anyOf: ['symptom:insomnia'] },
    actions: [
      { kind: 'recommend', medicineId: 'valerian-extract', baseScore: 0.8 },
      { kind: 'recommend', medicineId: 'magnesium-supplement', baseScore: 0.8 },
      { kind: 'recommend', medicineId: 'chamomile-extract', baseScore: 0.7 },
      { kind: 'recommend', medicineId: 'ltheanine-supplement', baseScore: 0.75 },
      { kind: 'recommend', medicineId: 'melatonin-sr', baseScore: 0.8 }
    ],
    evidence: { guidelineId: 'INSOMNIA_2025', description: 'Multiple OTC options for mild to moderate insomnia' }
  },
  {
    ruleId: 'INSOMNIA_001',
    system: 'insomnia',
    type: 'indication',
    priority: 110,
    name: '入睡困难：偶发性助眠（苯海拉明）',
    when: { anyOf: ['symptom:falling_asleep'], noneOf: ['exclusion:elderly'] },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'diphenhydramine-tablets',
        baseScore: 0.7,
        note: {
          en: 'Use short-term only. Avoid alcohol and other sedatives.',
          zh: '仅短期使用；避免饮酒及与其他镇静药同用。'
        }
      }
    ],
    evidence: { guidelineId: 'INSOMNIA_2025', description: 'Short-term symptomatic relief may be considered for transient insomnia with caution.' }
  },
  {
    ruleId: 'INSOMNIA_002',
    system: 'insomnia',
    type: 'indication',
    priority: 120,
    name: '入睡困难+烦躁/头晕/心悸：中成药辨证参考（百乐眠）',
    when: { anyOf: ['symptom:irritability', 'symptom:dizziness', 'symptom:palpitations'] },
    actions: [{ kind: 'recommend', medicineId: 'bailemian-capsule', baseScore: 0.9 }],
    evidence: { guidelineId: 'INSOMNIA_2025', description: 'Symptom-pattern based options may be considered where applicable, with safety screening.' }
  },
  {
    ruleId: 'INSOMNIA_003',
    system: 'insomnia',
    type: 'indication',
    priority: 100,
    name: '睡眠维持困难：褪黑素缓释',
    when: { anyOf: ['symptom:frequent_waking'] },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'melatonin-sr',
        baseScore: 0.8,
        note: {
          en: 'Consider for sleep maintenance issues.',
          zh: '可用于睡眠维持困难。'
        }
      }
    ],
    evidence: { guidelineId: 'INSOMNIA_2025', description: 'Special population management favors lower fall-risk options where possible.' }
  }
];

function decodeInsomniaTag(tag: string): string[] {
  if (tag === 'symptom:falling_asleep' || tag === 'symptom:frequent_waking' || tag === 'symptom:poor_quality') {
    return [tag, 'symptom:insomnia'];
  }
  if (tag === 'symptom:insomnia') {
    return ['symptom:insomnia'];
  }
  return [tag];
}

function matchesWhen(tags: string[], when: AuditableRule['when']): boolean {
  const tagSet = new Set(tags);

  const hasTag = (tag: string) => {
    const candidates = decodeInsomniaTag(tag);
    return candidates.some((c) => tagSet.has(c));
  };

  if (when.allOf && !when.allOf.every((t) => hasTag(t))) return false;
  if (when.anyOf && !when.anyOf.some((t) => hasTag(t))) return false;
  if (when.noneOf && when.noneOf.some((t) => hasTag(t))) return false;
  return true;
}

export function evaluateInsomniaRules(input: InsomniaRuleEvalInput): InsomniaRuleEvalOutput {
  const sorted = [...rules].sort((a, b) => b.priority - a.priority);
  const recommendations: InsomniaRuleEvalOutput['recommendations'] = [];

  for (const rule of sorted) {
    if (!matchesWhen(input.tags, rule.when)) continue;
    const baseHit: RuleHit = { ruleId: rule.ruleId, system: rule.system, type: rule.type, name: rule.name, evidence: rule.evidence };
    for (const action of rule.actions) recommendations.push({ hit: baseHit, action });
  }

  return { recommendations };
}

