export interface GuidelineMeta {
  id: string;
  name: string;
  source: string;
  year: number;
  scope: {
    symptomSystem: 'insomnia' | 'cough' | 'headache' | 'low_back_pain' | 'gerd' | 'allergic_rhinitis' | 'urticaria';
    population?: 'general' | 'pediatric' | 'elderly';
  };
  keyPoints?: {
    recommendations?: number;
    keyQuestions?: number;
    statements?: number;
  };
  redFlags?: string[];
  specialPopulations?: string[];
  notes?: string;
}

export interface KnowledgeBaseMeta {
  version: string;
  lastUpdated: string;
  guidelines: GuidelineMeta[];
}

export const knowledgeBase: KnowledgeBaseMeta = {
  version: '2026.03',
  lastUpdated: '2026-03-15',
  guidelines: [
    {
      id: 'INSOMNIA_2025',
      name: '失眠症诊断和治疗指南（2025版）',
      source: '中国睡眠研究会',
      year: 2025,
      scope: { symptomSystem: 'insomnia', population: 'general' },
      keyPoints: { recommendations: 32 },
      specialPopulations: ['儿童/青少年', '女性', '老年人']
    },
    {
      id: 'COUGH_2025',
      name: '德国呼吸学会咳嗽指南（第4版）',
      source: '德国呼吸学会',
      year: 2025,
      scope: { symptomSystem: 'cough', population: 'general' },
      keyPoints: { keyQuestions: 12 },
      redFlags: ['呼吸困难', '咯血', '胸痛', '发热>39℃', '吞咽困难', '声音嘶哑>2周']
    },
    {
      id: 'ACCP_COUGH_2006',
      name: 'ACCP 感冒咳嗽临床实践指南（经典）',
      source: 'ACCP',
      year: 2006,
      scope: { symptomSystem: 'cough', population: 'general' },
      notes: '急性咳嗽多与普通感冒相关，强调对症治疗与病程分型。'
    },
    {
      id: 'HEADACHE_2026',
      name: 'AHS 急诊偏头痛指南（急性期）',
      source: 'American Headache Society (AHS)',
      year: 2026,
      scope: { symptomSystem: 'headache', population: 'general' },
      notes: '偏头痛急性期治疗分层与阶梯策略。'
    },
    {
      id: 'VADOD_HEADACHE_2024',
      name: 'VA/DoD 头痛管理指南',
      source: 'VA/DoD',
      year: 2024,
      scope: { symptomSystem: 'headache', population: 'general' },
      notes: '紧张型头痛与偏头痛的一线非处方药与复方选项。'
    },
    {
      id: 'PEDS_MIGRAINE_2026',
      name: '儿童偏头痛管理系统综述',
      source: 'Pediatric Headache Guideline Review',
      year: 2026,
      scope: { symptomSystem: 'headache', population: 'pediatric' },
      notes: '强调对乙酰氨基酚与布洛芬为儿童急性偏头痛一线选择。'
    },
    {
      id: 'LBP_2024',
      name: '下背痛治疗综述（非特异性下背痛）',
      source: 'Low Back Pain Review',
      year: 2024,
      scope: { symptomSystem: 'low_back_pain', population: 'general' },
      notes: '按低/中/高风险预后分层，强调尽量活动，避免阿片类。'
    },
    {
      id: 'GERD_2023',
      name: 'GERD 指南一致性综述',
      source: 'Guideline Concordance Review',
      year: 2023,
      scope: { symptomSystem: 'gerd', population: 'general' },
      notes: '多部指南一致推荐 PPI/H2RA；吞咽困难、消化道出血等应立即就医。'
    },
    {
      id: 'APAC_FD_2023',
      name: '亚太功能性消化不良指南',
      source: 'APAC FD Guideline',
      year: 2023,
      scope: { symptomSystem: 'gerd', population: 'general' },
      notes: '强调 FD 与 GERD/IBS 重叠综合征管理；餐后饱胀/早饱等分型。'
    },
    {
      id: 'AR_2024',
      name: '意大利 SIAIP 变应性鼻炎德尔菲共识',
      source: 'SIAIP',
      year: 2024,
      scope: { symptomSystem: 'allergic_rhinitis', population: 'general' },
      notes: '中重度持续性优先鼻用激素；轻中度可用二代抗组胺药；可联合治疗。'
    },
    {
      id: 'CSU_2025',
      name: 'H1 抗组胺药抵抗性慢性自发性荨麻疹指南',
      source: '亚太过敏与免疫学杂志',
      year: 2025,
      scope: { symptomSystem: 'urticaria', population: 'general' },
      notes: '约 50% 患者对标准剂量无效，需阶梯升级。'
    }
  ]
};
