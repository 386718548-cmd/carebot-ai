export type RuleSystem = 'cough';
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

export interface CoughRuleEvalInput {
  tags: string[];
}

export interface CoughRuleEvalOutput {
  redFlags: { hit: RuleHit; action: RuleActionBlockAll }[];
  recommendations: { hit: RuleHit; action: RuleActionRecommend }[];
}

const rules: AuditableRule[] = [
  {
    ruleId: 'COUGH_REDFLAG_001',
    system: 'cough',
    type: 'redflag',
    priority: 1000,
    name: '咳嗽红旗征阻断',
    when: { anyOf: ['symptom:breathless', 'symptom:haemoptysis', 'symptom:chest_pain', 'symptom:high_fever', 'symptom:dysphagia', 'symptom:hoarseness'] },
    actions: [
      {
        kind: 'block_all',
        message: {
          en: 'Cough with red flags: seek urgent medical evaluation.',
          zh: '咳嗽伴红旗征：建议立即就医检查。'
        }
      }
    ],
    evidence: {
      guidelineId: 'COUGH_2025',
      description: 'Red flags in cough require urgent evaluation.'
    }
  },
  // Generic cough fallback rule
  {
    ruleId: 'COUGH_GEN',
    system: 'cough',
    type: 'indication',
    priority: 80,
    name: '通用咳嗽推荐：天然止咳和祛痰',
    when: { anyOf: ['symptom:cough'] },
    actions: [
      { kind: 'recommend', medicineId: 'honey-lozenge', baseScore: 0.85 },
      { kind: 'recommend', medicineId: 'nac-supplement', baseScore: 0.8 },
      { kind: 'recommend', medicineId: 'peppermint-oil', baseScore: 0.75 }
    ],
    evidence: {
      guidelineId: 'COUGH_2025',
      description: 'Natural and OTC options for mild cough relief.'
    }
  },
  {
    ruleId: 'COUGH_001',
    system: 'cough',
    type: 'indication',
    priority: 100,
    name: '急性干咳：右美沙芬对症治疗',
    when: { allOf: ['symptom:dry_cough'] },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'dextromethorphan-15mg',
        baseScore: 0.9,
        note: {
          en: 'Acute cough is often self-limited; use symptomatic relief.',
          zh: '急性咳嗽多为自限性疾病，以对症缓解为主。'
        }
      }
    ],
    evidence: {
      guidelineId: 'COUGH_2025',
      description: 'Symptomatic treatment for acute cough; cough suppressants may be used in selected cases.'
    }
  },
  {
    ruleId: 'COUGH_002',
    system: 'cough',
    type: 'indication',
    priority: 90,
    name: '咳痰：愈创木酚甘油醚祛痰',
    when: { allOf: ['symptom:wet_cough'] },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'guaifenesin-600mg',
        baseScore: 0.8
      }
    ],
    evidence: {
      guidelineId: 'COUGH_2025',
      description: 'Expectorants can be used for productive cough symptom relief.'
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

export function evaluateCoughRules(input: CoughRuleEvalInput): CoughRuleEvalOutput {
  const sorted = [...rules].sort((a, b) => b.priority - a.priority);
  const redFlags: CoughRuleEvalOutput['redFlags'] = [];
  const recommendations: CoughRuleEvalOutput['recommendations'] = [];

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

