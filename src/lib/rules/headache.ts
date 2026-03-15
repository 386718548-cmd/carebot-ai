export type RuleSystem = 'headache';
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

export interface HeadacheRuleEvalInput {
  symptomTags: string[];
}

export interface HeadacheRuleEvalOutput {
  redFlags: { hit: RuleHit; action: RuleActionBlockAll }[];
  recommendations: { hit: RuleHit; action: RuleActionRecommend }[];
}

const headacheRules: AuditableRule[] = [
  {
    ruleId: 'HEADACHE_REDFLAG_001',
    system: 'headache',
    type: 'redflag',
    priority: 1000,
    name: '霹雳样头痛红旗征阻断',
    when: { anyOf: ['symptom:thunderclap'] },
    actions: [
      {
        kind: 'block_all',
        message: {
          en: 'Sudden thunderclap headache: seek emergency care immediately.',
          zh: '突然发作的“霹雳样”剧痛：请立即就医急诊。'
        }
      }
    ],
    evidence: {
      guidelineId: 'HEADACHE_2026',
      description: 'Sudden severe headache is a critical red flag requiring urgent evaluation.'
    }
  },
  {
    ruleId: 'HEADACHE_REDFLAG_002',
    system: 'headache',
    type: 'redflag',
    priority: 1000,
    name: '发热伴颈强直红旗征阻断',
    when: { anyOf: ['symptom:stiff_neck'] },
    actions: [
      {
        kind: 'block_all',
        message: {
          en: 'Fever with stiff neck: possible meningitis—seek emergency care.',
          zh: '发热伴颈强直：可能为脑膜炎，请立即就医。'
        }
      }
    ],
    evidence: {
      guidelineId: 'HEADACHE_2026',
      description: 'Fever with meningeal signs requires urgent evaluation.'
    }
  },
  {
    ruleId: 'HEADACHE_REDFLAG_003',
    system: 'headache',
    type: 'redflag',
    priority: 1000,
    name: '神经系统体征红旗征阻断',
    when: { anyOf: ['symptom:stroke_signs'] },
    actions: [
      {
        kind: 'block_all',
        message: {
          en: 'Neurologic deficits (weakness/slurred speech): seek emergency care.',
          zh: '出现神经系统体征（无力/言语不清）：请立即就医急诊。'
        }
      }
    ],
    evidence: {
      guidelineId: 'HEADACHE_2026',
      description: 'Neurologic deficits with headache may indicate serious intracranial pathology.'
    }
  },
  {
    ruleId: 'HEADACHE_IND_001',
    system: 'headache',
    type: 'indication',
    priority: 100,
    name: '紧张型头痛一线：布洛芬',
    when: {
      allOf: ['symptom:headache', 'symptom:tension_type', 'symptom:bilateral', 'symptom:mild_moderate']
    },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'ibuprofen-200mg',
        baseScore: 0.95
      }
    ],
    evidence: {
      guidelineId: 'HEADACHE_2026',
      description: 'NSAIDs are first-line options for tension-type headache.'
    }
  },
  {
    ruleId: 'HEADACHE_IND_002',
    system: 'headache',
    type: 'indication',
    priority: 90,
    name: '紧张型头痛一线：对乙酰氨基酚',
    when: {
      allOf: ['symptom:headache', 'symptom:tension_type', 'symptom:bilateral', 'symptom:mild_moderate']
    },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'acetaminophen-500mg',
        baseScore: 0.9
      }
    ],
    evidence: {
      guidelineId: 'HEADACHE_2026',
      description: 'Acetaminophen is a first-line option for tension-type headache.'
    }
  },
  {
    ruleId: 'HEADACHE_IND_003',
    system: 'headache',
    type: 'indication',
    priority: 100,
    name: '偏头痛急性期一线：布洛芬',
    when: {
      allOf: ['symptom:headache', 'symptom:migraine_type'],
      anyOf: ['symptom:nausea', 'symptom:sensitivity', 'symptom:aura']
    },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'ibuprofen-200mg',
        baseScore: 0.85
      }
    ],
    evidence: {
      guidelineId: 'HEADACHE_2026',
      description: 'NSAIDs are first-line for acute migraine in appropriate patients.'
    }
  },
  {
    ruleId: 'HEADACHE_IND_004',
    system: 'headache',
    type: 'indication',
    priority: 90,
    name: '偏头痛急性期一线：对乙酰氨基酚',
    when: {
      allOf: ['symptom:headache', 'symptom:migraine_type'],
      anyOf: ['symptom:nausea', 'symptom:sensitivity', 'symptom:aura']
    },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'acetaminophen-500mg',
        baseScore: 0.8
      }
    ],
    evidence: {
      guidelineId: 'HEADACHE_2026',
      description: 'Acetaminophen is an option for acute migraine pain relief.'
    }
  },
  {
    ruleId: 'HEADACHE_IND_005',
    system: 'headache',
    type: 'indication',
    priority: 80,
    name: '偏头痛复方选择：阿司匹林+对乙酰氨基酚+咖啡因',
    when: { allOf: ['symptom:headache', 'symptom:migraine_type'] },
    actions: [
      {
        kind: 'recommend',
        medicineId: 'excedrin-migraine',
        baseScore: 0.8,
        note: {
          en: 'Combination analgesic option for acute migraine. Avoid if anticoagulants/ulcer/pregnancy risks.',
          zh: '偏头痛急性期复方止痛选项；如有抗凝药/溃疡/妊娠风险应避免。'
        }
      }
    ],
    evidence: {
      guidelineId: 'HEADACHE_2026',
      description: 'Combination analgesics may be used in selected acute migraine cases.'
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

export function evaluateHeadacheRules(input: HeadacheRuleEvalInput): HeadacheRuleEvalOutput {
  const sorted = [...headacheRules].sort((a, b) => b.priority - a.priority);
  const redFlags: HeadacheRuleEvalOutput['redFlags'] = [];
  const recommendations: HeadacheRuleEvalOutput['recommendations'] = [];

  for (const rule of sorted) {
    if (!matchesWhen(input.symptomTags, rule.when)) continue;

    const baseHit: RuleHit = {
      ruleId: rule.ruleId,
      system: rule.system,
      type: rule.type,
      name: rule.name,
      evidence: rule.evidence
    };

    for (const action of rule.actions) {
      if (action.kind === 'block_all') {
        redFlags.push({ hit: baseHit, action });
      }
      if (action.kind === 'recommend') {
        recommendations.push({ hit: baseHit, action });
      }
    }
  }

  return { redFlags, recommendations };
}

