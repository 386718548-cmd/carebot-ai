export type RuleSystem = 'low_back_pain';
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

export interface LowBackPainRuleEvalInput {
  tags: string[];
}

export interface LowBackPainRuleEvalOutput {
  redFlags: { hit: RuleHit; action: RuleActionBlockAll }[];
  recommendations: { hit: RuleHit; action: RuleActionRecommend }[];
}

const rules: AuditableRule[] = [
  {
    ruleId: 'LBP_REDFLAG_001',
    system: 'low_back_pain',
    type: 'redflag',
    priority: 1000,
    name: '下背痛红旗征：疑似马尾综合征/严重病变',
    when: { anyOf: ['symptom:saddle_anesthesia', 'symptom:sphincter_dysfunction', 'symptom:leg_weakness', 'symptom:weight_loss'] },
    actions: [
      {
        kind: 'block_all',
        message: {
          en: 'Red flags with low back pain: seek urgent medical evaluation.',
          zh: '下背痛伴红旗征：建议立即就医评估。'
        }
      }
    ],
    evidence: {
      guidelineId: 'LBP_2024',
      description: 'Low back pain red flags require urgent evaluation.'
    }
  },
  // Generic back pain fallback rule
  {
    ruleId: 'LBP_GEN',
    system: 'low_back_pain',
    type: 'indication',
    priority: 80,
    name: '通用腰背痛推荐：NSAIDs和局部疗法',
    when: { anyOf: ['symptom:back_pain'] },
    actions: [
      { kind: 'recommend', medicineId: 'diclofenac-50mg', baseScore: 0.9 },
      { kind: 'recommend', medicineId: 'topical-nsaid-patch', baseScore: 0.8 },
      { kind: 'recommend', medicineId: 'muscle-relaxant-cream', baseScore: 0.75 }
    ],
    evidence: {
      guidelineId: 'LBP_2024',
      description: 'OTC NSAIDs and topical options for back pain relief.'
    }
  },
  {
    ruleId: 'LBP_001',
    system: 'low_back_pain',
    type: 'indication',
    priority: 110,
    name: '急性下背痛：NSAIDs 首选（萘普生）',
    when: {
      allOf: ['symptom:acute_back_pain'],
      noneOf: ['exclusion:stomach_ulcer', 'exclusion:kidney_disease', 'exclusion:pregnant']
    },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'naproxen-220mg',
        baseScore: 0.95,
        note: {
          en: 'Use the lowest effective dose for the shortest duration; if pain persists, seek care.',
          zh: '尽量使用最低有效剂量、最短疗程；若疼痛持续请就医。'
        }
      }
    ],
    evidence: {
      guidelineId: 'LBP_2024',
      description: 'NSAIDs are first-line for acute/subacute low back pain; avoid opioids.'
    }
  },
  {
    ruleId: 'LBP_002',
    system: 'low_back_pain',
    type: 'indication',
    priority: 100,
    name: '急性下背痛：NSAIDs 备选（布洛芬）',
    when: {
      allOf: ['symptom:acute_back_pain'],
      noneOf: ['exclusion:stomach_ulcer', 'exclusion:kidney_disease', 'exclusion:pregnant']
    },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'ibuprofen-200mg',
        baseScore: 0.9
      }
    ],
    evidence: {
      guidelineId: 'LBP_2024',
      description: 'NSAIDs are first-line for acute low back pain.'
    }
  },
  {
    ruleId: 'LBP_003',
    system: 'low_back_pain',
    type: 'indication',
    priority: 110,
    name: '亚急性下背痛：优选萘普生（减轻服药负担）',
    when: {
      allOf: ['symptom:subacute_back_pain'],
      noneOf: ['exclusion:stomach_ulcer', 'exclusion:kidney_disease', 'exclusion:pregnant']
    },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'naproxen-220mg',
        baseScore: 0.9,
        note: {
          en: 'Longer duration NSAID may reduce dosing burden.',
          zh: '长效 NSAID 可减少服药次数，降低依从性负担。'
        }
      }
    ],
    evidence: {
      guidelineId: 'LBP_2024',
      description: 'NSAIDs are first-line for subacute low back pain.'
    }
  },
  {
    ruleId: 'LBP_004',
    system: 'low_back_pain',
    type: 'indication',
    priority: 120,
    name: '慢性下背痛：唯一一线 NSAID（萘普生）',
    when: {
      allOf: ['symptom:chronic_back_pain'],
      noneOf: ['exclusion:stomach_ulcer', 'exclusion:kidney_disease', 'exclusion:pregnant']
    },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'naproxen-220mg',
        baseScore: 0.85,
        note: {
          en: 'Chronic low back pain: NSAIDs remain first-line; avoid opioids.',
          zh: '慢性下背痛：NSAIDs 仍为一线，避免阿片类。'
        }
      }
    ],
    evidence: {
      guidelineId: 'LBP_2024',
      description: 'For chronic low back pain, NSAIDs are the only first-line medication option; avoid opioids.'
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

export function evaluateLowBackPainRules(input: LowBackPainRuleEvalInput): LowBackPainRuleEvalOutput {
  const sorted = [...rules].sort((a, b) => b.priority - a.priority);
  const redFlags: LowBackPainRuleEvalOutput['redFlags'] = [];
  const recommendations: LowBackPainRuleEvalOutput['recommendations'] = [];

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

