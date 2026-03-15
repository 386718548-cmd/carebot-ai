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
      id: 'HEADACHE_2026',
      name: '住院患者头痛管理共识',
      source: '美国区域麻醉与疼痛医学学会',
      year: 2026,
      scope: { symptomSystem: 'headache', population: 'general' },
      keyPoints: { statements: 12, recommendations: 17 }
    },
    {
      id: 'LBP_2024',
      name: '下背痛指南',
      source: 'KNGF',
      year: 2024,
      scope: { symptomSystem: 'low_back_pain', population: 'general' },
      notes: '按低/中/高风险预后分层，强调尽量活动，避免阿片类。'
    },
    {
      id: 'GERD_2023',
      name: '中国老年人 GERD 专家共识',
      source: '中华医学会老年医学分会',
      year: 2023,
      scope: { symptomSystem: 'gerd', population: 'elderly' },
      notes: '关注老年人症状不典型与多药联用风险。'
    },
    {
      id: 'AR_2024',
      name: '国际中医临床实践指南：变应性鼻炎',
      source: '世界中医药学会联合会',
      year: 2024,
      scope: { symptomSystem: 'allergic_rhinitis', population: 'general' },
      notes: '中西医结合框架，可作为偏好选项。'
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

