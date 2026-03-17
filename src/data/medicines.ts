export interface Medicine {
  id: string;
  name: string;
  generic_name?: string;
  aliases?: string[];
  atc_code?: string;
  active_ingredients: string[];
  fda_otc_monograph?: boolean; // Complies with 21 CFR part 338
  snomed_ct?: {
    indications: string[];
    contraindications: string[];
  };
  indication_tags: string[];
  contraindication_tags: string[];
  suitable_causes?: string[]; // e.g., ['cause:stress', 'cause:jetlag']
  suitable_comorbidities?: string[]; // e.g., ['comorbid:anxiety']
  indications: {
    structured: {
      symptomTags: string[];
      syndromeTypes?: string[];
      durationCriteria?: string;
      severityLevel?: 'mild' | 'moderate' | 'severe';
      description: { en: string; zh: string };
    };
    originalText?: string;
  };
  contraindications: {
    structured: {
      conditions: string[];
      populations: string[];
      interactions: { drugClass: string; severity: 'mild' | 'moderate' | 'severe'; action: string }[];
    };
    severity: Record<string, 'absolute' | 'caution' | 'relative'>;
    en: string[];
    zh: string[];
  };
  dosage: {
    adult?: { dosage: string; frequency: string; route: string };
    elderly?: { dosage: string; frequency: string; caution: string };
    en: string;
    zh: string;
  };
  side_effects: {
    common: string[];
    rare?: string[];
    monitoring?: string[];
    en: string[];
    zh: string[];
  };
  evidence_level: 'A' | 'B' | 'C' | 'D';
  references: string[];
  last_updated: string;
  otc_class: 'A' | 'B';
  regulatory?: {
    country: string;
    approval_number: string;
  };
  availability: {
    region: string;
    stock: number;
    price: number;
    currency: string;
  }[];
}

export const medicines: Medicine[] = [
  {
    id: 'acetaminophen-500mg',
    name: 'Acetaminophen (Tylenol)',
    generic_name: 'Acetaminophen',
    aliases: ['Tylenol', '对乙酰氨基酚', '扑热息痛', 'APAP'],
    atc_code: 'N02BE01',
    active_ingredients: ['Acetaminophen'],
    indication_tags: ['symptom:headache', 'symptom:tension_type', 'symptom:migraine_type', 'symptom:fever'],
    contraindication_tags: ['exclusion:liver_disease'],
    indications: {
      structured: {
        symptomTags: ['headache', 'fever'],
        description: {
          en: 'Pain reliever and fever reducer. First-line for tension headaches and migraine.',
          zh: '止痛退烧药。紧张型头痛和偏头痛的一线用药。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: ['liver_disease'],
        populations: [],
        interactions: [{ drugClass: 'Alcohol', severity: 'moderate', action: 'Increased liver risk' }]
      },
      severity: { 'liver_disease': 'absolute', 'alcohol': 'caution' },
      en: ['Liver disease', 'Severe liver impairment'],
      zh: ['肝脏疾病', '严重肝功能受损']
    },
    dosage: {
      adult: { dosage: '500-1000mg', frequency: 'Every 4-6 hours', route: 'Oral' },
      en: 'Adults: 1000mg per dose (2x 500mg) is commonly used for tension-type headache. Take 500-1000mg every 4-6 hours as needed.',
      zh: '成人紧张型头痛常用单次 1000mg（500mg×2）。按需每 4-6 小时 500-1000mg。'
    },
    side_effects: {
      common: ['Nausea'],
      rare: ['Liver toxicity (Overdose)'],
      en: ['Nausea'],
      zh: ['恶心']
    },
    evidence_level: 'A',
    references: ['AHS Guidelines 2025', 'VA/DoD Headache Guide'],
    last_updated: '2026-01-10',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 2000, price: 9.99, currency: 'USD' }]
  },
  {
    id: 'excedrin-migraine',
    name: 'Excedrin Migraine',
    generic_name: 'Acetaminophen/Aspirin/Caffeine',
    aliases: ['Excedrin', '阿司匹林 对乙酰氨基酚 咖啡因', '复方止痛', '偏头痛复方'],
    atc_code: 'N02BA51',
    active_ingredients: ['Acetaminophen 250mg', 'Aspirin 250mg', 'Caffeine 65mg'],
    indication_tags: ['symptom:migraine_type'],
    contraindication_tags: ['exclusion:stomach_ulcer', 'exclusion:warfarin', 'exclusion:pregnant'],
    indications: {
      structured: {
        symptomTags: ['migraine_type'],
        description: {
          en: 'Combination pain reliever specifically for migraine headaches. Recommended by VA/DoD guidelines.',
          zh: '专门针对偏头痛的复合镇痛药。VA/DoD 指南推荐。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: ['stomach_ulcer', 'asthma'],
        populations: ['pregnant', 'pediatric'],
        interactions: [{ drugClass: 'Anticoagulants', severity: 'severe', action: 'Avoid' }]
      },
      severity: { 'stomach_ulcer': 'absolute', 'pregnant': 'absolute', 'warfarin': 'absolute' },
      en: ['Stomach ulcers', 'Pregnancy', 'Bleeding disorders'],
      zh: ['胃溃疡', '孕妇', '凝血功能障碍']
    },
    dosage: {
      adult: { dosage: '2 caplets', frequency: 'Once daily (Do not exceed 2 caplets in 24h)', route: 'Oral' },
      en: 'Take 2 caplets with a full glass of water. Do not exceed 2 caplets in 24 hours.',
      zh: '随一大杯水服用 2 粒。24 小时内不得超过 2 粒。'
    },
    side_effects: {
      common: ['Nervousness', 'Insomnia'],
      en: ['Nervousness', 'Insomnia (due to caffeine)'],
      zh: ['紧张', '失眠（因咖啡因导致）']
    },
    evidence_level: 'A',
    references: ['VA/DoD Headache Management Guideline 2023'],
    last_updated: '2026-02-01',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 800, price: 15.99, currency: 'USD' }]
  },
  {
    id: 'naproxen-220mg',
    name: 'Naproxen Sodium (Aleve)',
    generic_name: 'Naproxen',
    aliases: ['Aleve', '萘普生', '萘普生钠', 'Naproxen Sodium'],
    atc_code: 'M01AE02',
    active_ingredients: ['Naproxen Sodium'],
    indication_tags: ['symptom:acute_back_pain', 'symptom:subacute_back_pain', 'symptom:chronic_back_pain', 'symptom:headache'],
    contraindication_tags: ['exclusion:stomach_ulcer', 'exclusion:kidney_disease', 'exclusion:pregnant'],
    indications: {
      structured: {
        symptomTags: ['acute_back_pain', 'chronic_back_pain'],
        description: {
          en: 'NSAID with 12-hour duration. First-line for acute and chronic low back pain.',
          zh: '长效非甾体抗炎药（12小时）。急性及慢性腰痛的一线选择。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: ['stomach_ulcer', 'kidney_disease'],
        populations: ['pregnant'],
        interactions: [{ drugClass: 'Anticoagulants', severity: 'severe', action: 'Avoid' }]
      },
      severity: { 'stomach_ulcer': 'absolute', 'pregnant': 'absolute', 'kidney_disease': 'caution' },
      en: ['Stomach ulcers', 'Kidney disease', 'Third trimester of pregnancy'],
      zh: ['胃溃疡', '肾脏疾病', '孕晚期']
    },
    dosage: {
      adult: { dosage: '220mg', frequency: 'Every 8-12 hours', route: 'Oral' },
      en: 'Take 1 tablet every 8-12 hours while symptoms persist.',
      zh: '症状持续时，每 8-12 小时服用 1 片。'
    },
    side_effects: {
      common: ['Stomach upset', 'Heartburn'],
      en: ['Stomach upset', 'Heartburn'],
      zh: ['胃部不适', '烧心']
    },
    evidence_level: 'A',
    references: ['Low Back Pain Review 2024'],
    last_updated: '2026-02-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 1500, price: 14.50, currency: 'USD' }]
  },
  {
    id: 'omeprazole-20mg',
    name: 'Omeprazole (Prilosec OTC)',
    generic_name: 'Omeprazole',
    aliases: ['Prilosec', '奥美拉唑', 'PPI'],
    atc_code: 'A02BC01',
    active_ingredients: ['Omeprazole'],
    indication_tags: ['symptom:heartburn', 'symptom:stomach_pain'],
    contraindication_tags: ['exclusion:allergy'],
    indications: {
      structured: {
        symptomTags: ['heartburn'],
        description: {
          en: 'Proton Pump Inhibitor (PPI) for frequent heartburn (2 or more days a week).',
          zh: '质子泵抑制剂 (PPI)，用于频繁发作的烧心（每周 2 天或以上）。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: ['allergy'],
        populations: [],
        interactions: [{ drugClass: 'Clopidogrel', severity: 'moderate', action: 'Reduced effectiveness' }]
      },
      severity: { 'allergy': 'absolute' },
      en: ['Hypersensitivity to Omeprazole'],
      zh: ['对奥美拉唑过敏']
    },
    dosage: {
      adult: { dosage: '20mg', frequency: 'Once daily before breakfast', route: 'Oral' },
      en: 'Take 1 tablet daily before eating in the morning for 14 days.',
      zh: '连续 14 天，每天晨起空腹服用 1 片。'
    },
    side_effects: {
      common: ['Headache', 'Abdominal pain'],
      en: ['Headache', 'Abdominal pain'],
      zh: ['头痛', '腹痛']
    },
    evidence_level: 'A',
    references: ['GERD Guidelines Consensus 2023'],
    last_updated: '2025-11-20',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 1200, price: 18.99, currency: 'USD' }]
  },
  {
    id: 'famotidine-20mg',
    name: 'Famotidine (Pepcid AC)',
    generic_name: 'Famotidine',
    aliases: ['Pepcid', '法莫替丁', 'H2RA'],
    atc_code: 'A02BA03',
    active_ingredients: ['Famotidine'],
    indication_tags: ['symptom:heartburn', 'symptom:stomach_pain'],
    contraindication_tags: ['exclusion:kidney_disease'],
    indications: {
      structured: {
        symptomTags: ['heartburn'],
        description: {
          en: 'H2-Receptor Antagonist (H2RA) for prevention and relief of heartburn.',
          zh: 'H2受体拮抗剂 (H2RA)，用于预防和缓解烧心。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: ['kidney_disease'],
        populations: [],
        interactions: []
      },
      severity: { 'kidney_disease': 'caution' },
      en: ['Severe renal impairment'],
      zh: ['严重肾功能受损']
    },
    dosage: {
      adult: { dosage: '10-20mg', frequency: 'Once or twice daily', route: 'Oral' },
      en: 'Take 1 tablet with a glass of water. Can be taken 15-60 minutes before eating food that causes heartburn.',
      zh: '随水服用 1 片。可在进食引起烧心的食物前 15-60 分钟服用。'
    },
    side_effects: {
      common: ['Dizziness', 'Constipation'],
      en: ['Dizziness', 'Constipation'],
      zh: ['头晕', '便秘']
    },
    evidence_level: 'A',
    references: ['GERD Guidelines Consensus 2023'],
    last_updated: '2025-12-10',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 2000, price: 10.99, currency: 'USD' }]
  },
  {
    id: 'calcium-carbonate',
    name: 'Calcium Carbonate (Antacid)',
    generic_name: 'Calcium Carbonate',
    aliases: ['Tums', '碳酸钙', '抗酸剂', 'Antacid'],
    atc_code: 'A02AA04',
    active_ingredients: ['Calcium Carbonate'],
    indication_tags: ['symptom:stomach_pain', 'symptom:heartburn'],
    contraindication_tags: ['exclusion:kidney_disease'],
    indications: {
      structured: {
        symptomTags: ['stomach_pain', 'heartburn'],
        description: {
          en: 'Antacid for quick, short-term relief of heartburn and indigestion.',
          zh: '抗酸剂，用于快速、短期缓解烧心与消化不良。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: ['kidney_disease'],
        populations: [],
        interactions: [{ drugClass: 'Tetracyclines/Quinolones', severity: 'moderate', action: 'Separate dosing by 2-4 hours' }]
      },
      severity: { 'kidney_disease': 'caution' },
      en: ['Severe renal impairment'],
      zh: ['严重肾功能受损']
    },
    dosage: {
      adult: { dosage: '500-1000mg', frequency: 'As needed', route: 'Oral' },
      en: 'Chew 1-2 tablets as needed. Follow the product label; do not exceed the maximum daily dose.',
      zh: '按需嚼服 1-2 片。请遵循说明书，勿超过每日最大剂量。'
    },
    side_effects: {
      common: ['Constipation', 'Bloating'],
      en: ['Constipation', 'Bloating'],
      zh: ['便秘', '腹胀']
    },
    evidence_level: 'B',
    references: ['APAC FD Guideline 2023'],
    last_updated: '2026-03-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 1500, price: 6.99, currency: 'USD' }]
  },
  {
    id: 'domperidone-10mg',
    name: 'Domperidone',
    generic_name: 'Domperidone',
    aliases: ['多潘立酮'],
    atc_code: 'A03FA03',
    active_ingredients: ['Domperidone'],
    indication_tags: ['symptom:fullness', 'symptom:early_satiety'],
    contraindication_tags: ['exclusion:elderly'],
    indications: {
      structured: {
        symptomTags: ['fullness', 'early_satiety'],
        description: {
          en: 'Prokinetic option for functional dyspepsia symptoms such as postprandial fullness and early satiety.',
          zh: '促动力药选项，用于餐后饱胀、早饱等功能性消化不良相关症状。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: ['qt_prolongation', 'arrhythmia'],
        populations: ['elderly'],
        interactions: [{ drugClass: 'QT-prolonging drugs', severity: 'severe', action: 'Avoid or specialist guidance' }]
      },
      severity: { 'elderly': 'caution' },
      en: ['Risk of QT prolongation; caution in older adults'],
      zh: ['可能延长 QT 间期；老年人慎用']
    },
    dosage: {
      adult: { dosage: '10mg', frequency: 'Up to 3 times daily before meals', route: 'Oral' },
      en: '10mg before meals, up to 3 times daily. Availability may differ by region; follow local guidance.',
      zh: '餐前 10mg，每日最多 3 次。各地区可及性不同，请遵循当地用药指导。'
    },
    side_effects: {
      common: ['Dry mouth', 'Abdominal cramps'],
      rare: ['Arrhythmia (QT prolongation)'],
      en: ['Dry mouth', 'Abdominal cramps', 'Rare: QT prolongation'],
      zh: ['口干', '腹部痉挛', '罕见：QT 间期延长']
    },
    evidence_level: 'B',
    references: ['APAC FD Guideline 2023'],
    last_updated: '2026-03-15',
    otc_class: 'B',
    availability: [{ region: 'Selected Regions', stock: 300, price: 8.50, currency: 'USD' }]
  },
  {
    id: 'cetirizine-10mg',
    name: 'Cetirizine (Zyrtec)',
    generic_name: 'Cetirizine',
    aliases: ['Zyrtec', '西替利嗪', '西替利嗪盐酸盐'],
    atc_code: 'R06AE07',
    active_ingredients: ['Cetirizine HCI'],
    indication_tags: ['symptom:rhinitis', 'symptom:urticaria', 'symptom:acute_urticaria', 'symptom:chronic_urticaria'],
    contraindication_tags: ['exclusion:kidney_disease'],
    indications: {
      structured: {
        symptomTags: ['rhinitis', 'urticaria'],
        description: {
          en: 'Second-generation antihistamine for allergies and hives. Fast-acting.',
          zh: '第二代抗组胺药，用于过敏性鼻炎和荨麻疹。起效快。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: ['kidney_disease'],
        populations: [],
        interactions: [{ drugClass: 'Alcohol', severity: 'moderate', action: 'Increased drowsiness' }]
      },
      severity: { 'kidney_disease': 'caution' },
      en: ['Severe renal impairment'],
      zh: ['严重肾功能受损']
    },
    dosage: {
      adult: { dosage: '10mg', frequency: 'Once daily', route: 'Oral' },
      en: 'Take 1 tablet (10mg) once daily.',
      zh: '每天服用 1 片 (10mg)。'
    },
    side_effects: {
      common: ['Drowsiness (Mild)', 'Dry mouth'],
      en: ['Mild drowsiness', 'Dry mouth'],
      zh: ['轻度嗜睡', '口干']
    },
    evidence_level: 'A',
    references: ['SIAIP Rhinitis Consensus 2024', 'Urticaria Guide 2025'],
    last_updated: '2026-03-05',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 2500, price: 12.99, currency: 'USD' }]
  },
  {
    id: 'loratadine-10mg',
    name: 'Loratadine (Claritin)',
    generic_name: 'Loratadine',
    aliases: ['Claritin', '氯雷他定', 'Loratadine'],
    atc_code: 'R06AX13',
    active_ingredients: ['Loratadine'],
    indication_tags: ['symptom:rhinitis', 'symptom:urticaria', 'symptom:acute_urticaria', 'symptom:chronic_urticaria'],
    contraindication_tags: ['exclusion:allergy'],
    indications: {
      structured: {
        symptomTags: ['rhinitis', 'urticaria'],
        description: {
          en: 'Second-generation, typically non-sedating antihistamine for allergic rhinitis and urticaria.',
          zh: '第二代抗组胺药（一般不嗜睡），用于过敏性鼻炎与荨麻疹。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: ['allergy'],
        populations: [],
        interactions: []
      },
      severity: { 'allergy': 'absolute' },
      en: ['Hypersensitivity to loratadine'],
      zh: ['对氯雷他定过敏']
    },
    dosage: {
      adult: { dosage: '10mg', frequency: 'Once daily', route: 'Oral' },
      en: 'Take 10mg once daily.',
      zh: '每天 10mg 服用 1 次。'
    },
    side_effects: {
      common: ['Headache', 'Dry mouth'],
      en: ['Headache', 'Dry mouth'],
      zh: ['头痛', '口干']
    },
    evidence_level: 'A',
    references: ['SIAIP Rhinitis Consensus 2024', 'Urticaria Guide 2025'],
    last_updated: '2026-03-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 2200, price: 11.99, currency: 'USD' }]
  },
  {
    id: 'fluticasone-nasal',
    name: 'Fluticasone Propionate (Flonase)',
    generic_name: 'Fluticasone',
    aliases: ['Flonase', '氟替卡松', '氟替卡松鼻喷雾', '鼻用激素'],
    atc_code: 'R01AD08',
    active_ingredients: ['Fluticasone Propionate'],
    indication_tags: ['symptom:rhinitis', 'symptom:severe_rhinitis'],
    contraindication_tags: ['exclusion:allergy'],
    indications: {
      structured: {
        symptomTags: ['rhinitis'],
        description: {
          en: 'Intranasal corticosteroid. First-line for moderate to severe persistent allergic rhinitis.',
          zh: '鼻用糖皮质激素。中重度持续性过敏性鼻炎的一线选择。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: ['nasal_injury'],
        populations: [],
        interactions: []
      },
      severity: { 'nasal_injury': 'absolute' },
      en: ['Recent nasal surgery or injury'],
      zh: ['近期鼻部手术或损伤']
    },
    dosage: {
      adult: { dosage: '2 sprays in each nostril', frequency: 'Once daily', route: 'Nasal' },
      en: 'Shake gently before each use. Use 2 sprays in each nostril once daily for the first week, then 1-2 sprays daily as needed.',
      zh: '使用前轻轻摇匀。第一周每天每个鼻孔喷 2 次，之后根据需要每天喷 1-2 次。'
    },
    side_effects: {
      common: ['Nosebleed', 'Headache'],
      en: ['Nosebleed', 'Headache'],
      zh: ['鼻出血', '头痛']
    },
    evidence_level: 'A',
    references: ['SIAIP Rhinitis Consensus 2024'],
    last_updated: '2026-02-10',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 1000, price: 22.50, currency: 'USD' }]
  },
  {
    id: 'dextromethorphan-15mg',
    name: 'Dextromethorphan (Robitussin)',
    generic_name: 'Dextromethorphan',
    aliases: ['Robitussin', '右美沙芬', '镇咳'],
    atc_code: 'R05DA09',
    active_ingredients: ['Dextromethorphan HBr'],
    indication_tags: ['symptom:dry_cough'],
    contraindication_tags: ['exclusion:asthma'],
    indications: {
      structured: {
        symptomTags: ['dry_cough'],
        description: {
          en: 'Cough suppressant for non-productive (dry) cough.',
          zh: '镇咳药，用于无痰干咳。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: ['asthma', 'copd'],
        populations: [],
        interactions: [{ drugClass: 'MAOIs', severity: 'severe', action: 'Dangerous reaction' }]
      },
      severity: { 'asthma': 'caution', 'maois': 'absolute' },
      en: ['Asthma', 'Chronic bronchitis'],
      zh: ['哮喘', '慢性支气管炎']
    },
    dosage: {
      adult: { dosage: '15-30mg', frequency: 'Every 6-8 hours', route: 'Oral' },
      en: 'Take 1-2 tablets every 6-8 hours as needed.',
      zh: '根据需要每 6-8 小时服用 1-2 片。'
    },
    side_effects: {
      common: ['Dizziness', 'Drowsiness'],
      en: ['Dizziness', 'Drowsiness'],
      zh: ['头晕', '嗜睡']
    },
    evidence_level: 'B',
    references: ['ACCP Cough Guidelines'],
    last_updated: '2025-10-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 1000, price: 11.50, currency: 'USD' }]
  },
  {
    id: 'guaifenesin-600mg',
    name: 'Guaifenesin (Mucinex)',
    generic_name: 'Guaifenesin',
    aliases: ['Mucinex', '愈创木酚甘油醚', '祛痰'],
    atc_code: 'R05CA03',
    active_ingredients: ['Guaifenesin'],
    indication_tags: ['symptom:wet_cough'],
    contraindication_tags: ['exclusion:allergy'],
    indications: {
      structured: {
        symptomTags: ['wet_cough'],
        description: {
          en: 'Expectorant that helps loosen phlegm (mucus) and thin bronchial secretions.',
          zh: '祛痰药，帮助松动痰液（粘液）并稀释支气管分泌物。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: ['allergy'],
        populations: [],
        interactions: []
      },
      severity: { 'allergy': 'absolute' },
      en: ['Hypersensitivity to Guaifenesin'],
      zh: ['对愈创木酚甘油醚过敏']
    },
    dosage: {
      adult: { dosage: '600-1200mg', frequency: 'Every 12 hours', route: 'Oral' },
      en: 'Take 1 tablet every 12 hours with a full glass of water. Do not exceed 2 tablets in 24 hours.',
      zh: '随一大杯水每 12 小时服用 1 片。24 小时内不得超过 2 片。'
    },
    side_effects: {
      common: ['Nausea', 'Vomiting'],
      en: ['Nausea', 'Vomiting'],
      zh: ['恶心', '呕吐']
    },
    evidence_level: 'B',
    references: ['ACCP Cough Guidelines'],
    last_updated: '2025-09-20',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 1200, price: 13.99, currency: 'USD' }]
  },
  {
    id: 'diphenhydramine-25mg',
    name: 'Diphenhydramine (ZzzQuil)',
    generic_name: 'Diphenhydramine HCI',
    aliases: ['ZzzQuil', '苯海拉明', '助眠抗组胺'],
    atc_code: 'R06AA02',
    active_ingredients: ['Diphenhydramine HCI'],
    fda_otc_monograph: true,
    indication_tags: ['symptom:falling_asleep'],
    contraindication_tags: ['exclusion:glaucoma', 'exclusion:hypertension', 'exclusion:elderly'],
    suitable_causes: ['cause:stress', 'cause:lifestyle', 'cause:jetlag'],
    indications: {
      structured: {
        symptomTags: ['falling_asleep'],
        severityLevel: 'mild',
        description: {
          en: 'Strong sedating antihistamine that helps falling asleep faster.',
          zh: '强效镇静类抗组胺药，帮助更快入睡。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: ['glaucoma', 'hypertension', 'asthma'],
        populations: ['pediatric', 'elderly'],
        interactions: [{ drugClass: 'Alcohol', severity: 'severe', action: 'Avoid completely' }]
      },
      severity: { 'glaucoma': 'absolute', 'hypertension': 'caution', 'alcohol': 'absolute', 'elderly': 'caution' },
      en: ['Glaucoma', 'High blood pressure', 'Severe asthma', 'Elderly (Risk of falls/confusion)'],
      zh: ['青光眼', '高血压', '严重哮喘', '老年人 (有跌倒/神志不清风险)']
    },
    dosage: {
      adult: { dosage: '25-50mg', frequency: 'Once daily before bedtime', route: 'Oral' },
      en: 'Take 25-50mg 30 minutes before bedtime.',
      zh: '睡前 30 分钟服用 25-50mg。'
    },
    side_effects: {
      common: ['Morning grogginess', 'Dry mouth'],
      en: ['Morning grogginess', 'Dry mouth'],
      zh: ['晨起昏沉', '口干']
    },
    evidence_level: 'A',
    references: ['FDA Approved Drug Label'],
    last_updated: '2025-12-01',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 500, price: 8.99, currency: 'USD' }]
  },
  {
    id: 'ibuprofen-200mg',
    name: 'Ibuprofen (Advil/Motrin)',
    generic_name: 'Ibuprofen',
    aliases: ['Advil', 'Motrin', '布洛芬', '布洛分', 'NSAID'],
    atc_code: 'M01AE01',
    active_ingredients: ['Ibuprofen'],
    indication_tags: ['symptom:headache', 'symptom:muscle_pain', 'symptom:fever', 'symptom:acute_back_pain'],
    contraindication_tags: ['exclusion:stomach_ulcer', 'exclusion:pregnant', 'exclusion:kidney_disease'],
    indications: {
      structured: {
        symptomTags: ['headache', 'muscle_pain', 'fever'],
        description: {
          en: 'Nonsteroidal anti-inflammatory drug (NSAID) used for pain relief and fever reduction.',
          zh: '非甾体抗炎药 (NSAID)，用于缓解疼痛和退热。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: ['stomach_ulcer', 'kidney_disease', 'asthma'],
        populations: ['pregnant', 'geriatric_caution'],
        interactions: [
          { drugClass: 'Anticoagulants', severity: 'severe', action: 'Avoid or extreme caution' },
          { drugClass: 'NSAIDs', severity: 'moderate', action: 'Avoid duplication' }
        ]
      },
      severity: { 'stomach_ulcer': 'absolute', 'pregnant': 'absolute', 'kidney_disease': 'caution', 'warfarin': 'absolute' },
      en: ['Stomach ulcers', 'Severe kidney disease', 'Pregnancy (especially 3rd trimester)', 'Current use of blood thinners'],
      zh: ['胃溃疡', '严重肾病', '孕妇（尤其是孕晚期）', '正在服用抗凝药']
    },
    dosage: {
      adult: { dosage: '200mg', frequency: 'Every 4-6 hours', route: 'Oral' },
      en: 'For acute headache, adults commonly take 400mg per dose (2x 200mg). Take 200-400mg every 4-6 hours as needed.',
      zh: '急性头痛成人常用单次 400mg（200mg×2）。按需每 4-6 小时 200-400mg。'
    },
    side_effects: {
      common: ['Stomach pain', 'Heartburn', 'Nausea'],
      en: ['Stomach pain', 'Heartburn', 'Nausea'],
      zh: ['胃痛', '烧心', '恶心']
    },
    evidence_level: 'A',
    references: ['WHO Model List of Essential Medicines', 'FDA Approved Label'],
    last_updated: '2026-02-10',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 1000, price: 12.50, currency: 'USD' }]
  },
  {
    id: 'melatonin-sr',
    name: 'Melatonin (Sustained Release)',
    generic_name: 'Melatonin',
    aliases: ['褪黑素缓释', 'Melatonin SR'],
    atc_code: 'N05CH01',
    active_ingredients: ['Melatonin'],
    indication_tags: ['symptom:frequent_waking', 'symptom:poor_quality'],
    contraindication_tags: ['exclusion:pregnant'],
    indications: {
      structured: {
        symptomTags: ['frequent_waking', 'poor_quality'],
        description: {
          en: 'Sustained-release melatonin may help with sleep maintenance issues.',
          zh: '褪黑素缓释剂型可用于睡眠维持困难。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: [],
        populations: ['pregnant'],
        interactions: [{ drugClass: 'Sedatives', severity: 'moderate', action: 'Additive sedation' }]
      },
      severity: { 'pregnant': 'caution', 'sedatives': 'caution' },
      en: ['Pregnancy/breastfeeding: consult clinician', 'Additive sedation with other CNS depressants'],
      zh: ['孕期/哺乳期：建议咨询医生', '与其他中枢抑制剂同用可能增加嗜睡']
    },
    dosage: {
      adult: { dosage: '2mg', frequency: 'Once nightly', route: 'Oral' },
      en: 'Take 2mg 30-60 minutes before bedtime.',
      zh: '睡前 30-60 分钟服用 2mg。'
    },
    side_effects: {
      common: ['Drowsiness', 'Vivid dreams'],
      en: ['Drowsiness', 'Vivid dreams'],
      zh: ['嗜睡', '梦境变得生动']
    },
    evidence_level: 'B',
    references: ['INSOMNIA_2025'],
    last_updated: '2026-03-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 900, price: 9.50, currency: 'USD' }]
  },
  {
    id: 'bailemian-capsule',
    name: 'Bailemian Capsule (百乐眠胶囊)',
    generic_name: '百乐眠胶囊',
    atc_code: 'N05C',
    active_ingredients: ['Lily', 'Eleuthero', 'Shou Wu Teng', 'Albizia Flower', 'Pearl Mother', 'Gypsum', 'Ziziphi Spinosae', 'Poria', 'Polygala', 'Scrophularia', 'Rehmannia', 'Ophiopogon', 'Schisandra', 'Juncus Effusus', 'Danshen'],
    indication_tags: ['symptom:falling_asleep', 'symptom:frequent_waking', 'symptom:irritability', 'symptom:dizziness', 'symptom:palpitations'],
    contraindication_tags: ['exclusion:liver_disease', 'exclusion:allergy', 'exclusion:pregnant'],
    suitable_causes: ['cause:stress', 'cause:emotions'],
    suitable_comorbidities: ['comorbid:anxiety'],
    indications: {
      structured: {
        symptomTags: ['falling_asleep', 'frequent_waking', 'irritability', 'dizziness', 'palpitations'],
        syndromeTypes: ['Liver-Qi Stagnation and Yin Deficiency (肝郁阴虚证)'],
        durationCriteria: '≥1 week',
        severityLevel: 'mild',
        description: {
          en: 'Used for insomnia caused by liver-qi stagnation and yin deficiency, symptoms including difficulty falling asleep, frequent waking, dizziness, fatigue, and irritability.',
          zh: '用于肝郁阴虚型失眠症，症见入睡困难、多梦易醒、醒后不眠、头晕乏力、烦躁易怒、心悸不安等。'
        }
      }
    },
    contraindications: {
      structured: {
        conditions: ['liver_disease', 'allergy'],
        populations: ['pregnant', 'breastfeeding'],
        interactions: [{ drugClass: 'CNS Depressants', severity: 'moderate', action: 'Dose adjustment needed' }]
      },
      severity: { 'liver_disease': 'absolute', 'pregnant': 'absolute', 'allergy': 'absolute', 'sedatives': 'caution' },
      en: ['Liver dysfunction', 'Hypersensitivity to ingredients', 'Pregnancy', 'Breastfeeding'],
      zh: ['肝功能不全', '对本品过敏者', '孕妇', '哺乳期妇女']
    },
    dosage: {
      adult: { dosage: '4 capsules', frequency: 'Twice daily', route: 'Oral' },
      en: 'Take 4 capsules orally, twice a day.',
      zh: '口服，一次4粒，一日2次。'
    },
    side_effects: {
      common: ['Nausea', 'Rash'],
      rare: ['Rare cases of liver injury'],
      en: ['Nausea', 'Rash', 'Rare cases of liver injury'],
      zh: ['恶心', '皮疹', '肝损伤个案报告']
    },
    evidence_level: 'A',
    references: ['Clinical Guidelines for TCM Treatment of Insomnia'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'China', stock: 500, price: 45.00, currency: 'CNY' }]
  },
  // Additional medicines for insomnia
  {
    id: 'valerian-extract',
    name: 'Valerian Root Extract',
    generic_name: 'Valeriana officinalis extract',
    aliases: ['缬草', 'Valerian'],
    atc_code: 'N06CA',
    active_ingredients: ['Valerian root extract'],
    indication_tags: ['symptom:insomnia', 'symptom:falling_asleep'],
    contraindication_tags: [],
    indications: {
      structured: {
        symptomTags: ['insomnia', 'falling_asleep'],
        description: { en: 'Natural herbal remedy for mild insomnia and sleep anxiety.', zh: '缬草提取物，用于轻度失眠和入睡困难。' }
      }
    },
    contraindications: {
      structured: { conditions: [], populations: [], interactions: [] },
      severity: {},
      en: [],
      zh: []
    },
    dosage: {
      en: 'Typical dose: 400-900mg daily, usually taken 30 minutes to 2 hours before bedtime.',
      zh: '常用剂量：400-900mg/日，睡前 30 分钟至 2 小时服用。'
    },
    side_effects: { common: [], en: ['Mild headache (rare)', 'Nausea (rare)'], zh: ['头痛(少见)', '恶心(少见)'] },
    evidence_level: 'B',
    references: ['European Herbal Pharmacopoeia'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 300, price: 15.00, currency: 'USD' }]
  },
  {
    id: 'magnesium-supplement',
    name: 'Magnesium Glycinate',
    generic_name: 'Magnesium glycinate',
    aliases: ['镁补充剂', 'Mag glycinate'],
    atc_code: 'A12CC',
    active_ingredients: ['Magnesium glycinate'],
    indication_tags: ['symptom:insomnia', 'symptom:frequent_waking'],
    contraindication_tags: [],
    indications: {
      structured: {
        symptomTags: ['insomnia'],
        description: { en: 'Mineral supplement to support sleep quality and reduce nighttime awakenings.', zh: '矿物质补充，改善睡眠质量，减少夜间醒来。' }
      }
    },
    contraindications: {
      structured: { conditions: ['kidney_disease'], populations: [], interactions: [] },
      severity: { 'kidney_disease': 'caution' },
      en: ['Severe renal impairment'],
      zh: ['严重肾功能不全']
    },
    dosage: {
      en: 'Adults: 200-400mg daily, preferably in the evening.',
      zh: '成人：200-400mg/日，最好在晚上服用。'
    },
    side_effects: { common: [], en: ['Mild laxative effect'], zh: ['轻微泻药效果'] },
    evidence_level: 'B',
    references: ['Magnesium and Sleep Review 2023'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 400, price: 12.00, currency: 'USD' }]
  },
  {
    id: 'chamomile-extract',
    name: 'Chamomile Extract Tea',
    generic_name: 'Chamomilla recutita extract',
    aliases: ['洋甘菊', 'Chamomile'],
    atc_code: 'N06CA',
    active_ingredients: ['Chamomile flower extract'],
    indication_tags: ['symptom:insomnia', 'symptom:falling_asleep'],
    contraindication_tags: ['exclusion:aller'],
    indications: {
      structured: {
        symptomTags: ['insomnia'],
        description: { en: 'Mild herbal tea for relaxation and gentle sleep support.', zh: '草本茶，用于放松和温和的睡眠支持。' }
      }
    },
    contraindications: {
      structured: { conditions: [], populations: [], interactions: [] },
      severity: {},
      en: ['Known allergy to Asteraceae family'],
      zh: ['对菊科植物过敏']
    },
    dosage: {
      en: 'Brew 1 tea bag in hot water for 5-10 minutes. Drink 1-3 cups daily, especially before bedtime.',
      zh: '用热水冲泡 5-10 分钟。每日 1-3 杯，尤其是睡前。'
    },
    side_effects: { common: [], en: [], zh: [] },
    evidence_level: 'B',
    references: ['Sleep Medicine Reviews'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 500, price: 8.00, currency: 'USD' }]
  },
  {
    id: 'ltheanine-supplement',
    name: 'L-Theanine',
    generic_name: 'L-Theanine',
    aliases: ['茶氨酸', 'Suntheanine'],
    atc_code: 'N06AX',
    active_ingredients: ['L-Theanine'],
    indication_tags: ['symptom:insomnia', 'symptom:falling_asleep'],
    contraindication_tags: [],
    indications: {
      structured: {
        symptomTags: ['insomnia'],
        description: { en: 'Amino acid that promotes relaxation without drowsiness, supports sleep onset.', zh: '促进放松和睡眠的氨基酸，不引起昏昏欲睡。' }
      }
    },
    contraindications: {
      structured: { conditions: [], populations: [], interactions: [] },
      severity: {},
      en: [],
      zh: []
    },
    dosage: {
      en: 'Adults: 100-200mg once or twice daily, preferably in the afternoon/evening.',
      zh: '成人：100-200mg，一日 1-2 次，最好在下午或晚上。'
    },
    side_effects: { common: [], en: [], zh: [] },
    evidence_level: 'B',
    references: ['L-Theanine and Sleep Quality 2024'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 300, price: 18.00, currency: 'USD' }]
  },
  // Additional medicines for headache
  {
    id: 'ibuprofen-200mg',
    name: 'Ibuprofen 200mg',
    generic_name: 'Ibuprofen',
    aliases: ['布洛芬', 'Advil', 'Motrin'],
    atc_code: 'M01AE01',
    active_ingredients: ['Ibuprofen'],
    indication_tags: ['symptom:headache', 'symptom:tension_type', 'symptom:mild_moderate'],
    contraindication_tags: ['exclusion:stomach_ulcer', 'exclusion:asthma'],
    indications: {
      structured: {
        symptomTags: ['headache'],
        description: { en: 'NSAID for tension and mild-to-moderate headaches. Fast relief.', zh: '非甾体抗炎药，用于紧张型和轻中度头痛，见效快。' }
      }
    },
    contraindications: {
      structured: {
        conditions: ['stomach_ulcer', 'asthma'],
        populations: [],
        interactions: [{ drugClass: 'Anticoagulants', severity: 'moderate', action: 'Increased bleeding risk' }]
      },
      severity: { 'stomach_ulcer': 'absolute', 'asthma': 'caution' },
      en: ['Active peptic ulcer disease', 'Severe asthma'],
      zh: ['活跃性消化性溃疡', '严重哮喘']
    },
    dosage: {
      adult: { dosage: '200-400mg', frequency: 'Every 4-6 hours', route: 'Oral' },
      en: 'Adults: 200-400mg every 4-6 hours. Maximum 1200mg per day for occasional use.',
      zh: '成人：200-400mg，每 4-6 小时一次。偶尔使用不超过 1200mg/日。'
    },
    side_effects: {
      common: ['Stomach upset', 'Heartburn'],
      en: ['Gastrointestinal upset', 'Heartburn', 'Dizziness (rare)'],
      zh: ['胃部不适', '烧心', '头晕(少见)']
    },
    evidence_level: 'A',
    references: ['Headache Guidelines 2023'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 1000, price: 5.00, currency: 'USD' }]
  },
  {
    id: 'naproxen-220mg',
    name: 'Naproxen Sodium 220mg',
    generic_name: 'Naproxen sodium',
    aliases: ['萘普生', 'Aleve', '那普生'],
    atc_code: 'M01AE02',
    active_ingredients: ['Naproxen sodium'],
    indication_tags: ['symptom:headache', 'symptom:tension_type', 'symptom:migraine_type'],
    contraindication_tags: ['exclusion:stomach_ulcer', 'exclusion:asthma'],
    indications: {
      structured: {
        symptomTags: ['headache'],
        description: { en: 'Long-acting NSAID for moderate headache and migraine relief. Lasts up to 12 hours.', zh: '长效非甾体抗炎药，用于中度头痛和偏头痛，可维持 12 小时。' }
      }
    },
    contraindications: {
      structured: {
        conditions: ['stomach_ulcer'],
        populations: [],
        interactions: [{ drugClass: 'Anticoagulants', severity: 'severe', action: 'Avoid concurrent use' }]
      },
      severity: { 'stomach_ulcer': 'absolute' },
      en: ['Peptic ulcer disease', 'Asthma'],
      zh: ['消化性溃疡', '哮喘']
    },
    dosage: {
      adult: { dosage: '220-440mg', frequency: 'Every 8-12 hours', route: 'Oral' },
      en: 'Adults: 220mg initially, then 220mg every 8-12 hours as needed. Max 660mg per day.',
      zh: '成人：初始 220mg，然后每 8-12 小时 220mg。每日最多 660mg。'
    },
    side_effects: {
      common: ['Stomach discomfort'],
      en: ['Gastrointestinal upset', 'Dizziness', 'Allergic reactions (rare)'],
      zh: ['胃部不适', '头晕', '过敏反应(少见)']
    },
    evidence_level: 'A',
    references: ['NSAID Efficacy Comparison 2023'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 800, price: 8.00, currency: 'USD' }]
  },
  {
    id: 'aspirin-325mg',
    name: 'Aspirin 325mg',
    generic_name: 'Acetylsalicylic acid',
    aliases: ['阿司匹林', 'ASA'],
    atc_code: 'N02BA01',
    active_ingredients: ['Acetylsalicylic acid'],
    indication_tags: ['symptom:headache', 'symptom:mild_moderate'],
    contraindication_tags: ['exclusion:stomach_ulcer'],
    indications: {
      structured: {
        symptomTags: ['headache'],
        description: { en: 'Anti-inflammatory and mild pain reliever for tension headaches. Also has anticlotting benefits.', zh: '抗炎和轻度止痛，用于紧张型头痛。同时有抗凝作用。' }
      }
    },
    contraindications: {
      structured: {
        conditions: ['stomach_ulcer'],
        populations: [],
        interactions: []
      },
      severity: { 'stomach_ulcer': 'caution' },
      en: ['Ulcer disease', 'Bleeding disorders'],
      zh: ['溃疡病', '出血性疾病']
    },
    dosage: {
      en: 'Adults: 325-650mg every 4-6 hours as needed. Maximum 3000mg per day.',
      zh: '成人：325-650mg，每 4-6 小时一次。每日最多 3000mg。'
    },
    side_effects: {
      common: ['Stomach upset', 'Heartburn'],
      en: ['GI upset', 'Heartburn', 'Allergic skin rash (rare)'],
      zh: ['胃部不适', '烧心', '皮疹(少见)']
    },
    evidence_level: 'A',
    references: ['Pain Management Guidelines'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 1200, price: 4.00, currency: 'USD' }]
  },
  // Additional medicines for cough
  {
    id: 'honey-lozenge',
    name: 'Honey Cough Lozenge',
    generic_name: 'Honey lozenges',
    aliases: ['蜂蜜止咳糖', '蜂蜜'],
    atc_code: 'R05CA',
    active_ingredients: ['Honey', 'Lemon extract'],
    indication_tags: ['symptom:cough', 'symptom:dry_cough'],
    contraindication_tags: [],
    indications: {
      structured: {
        symptomTags: ['cough', 'dry_cough'],
        description: { en: 'Natural honey-based cough relief. Soothing for throat irritation and dry cough.', zh: '天然蜂蜜止咳糖，舒缓咽喉刺激和干咳。' }
      }
    },
    contraindications: {
      structured: { conditions: [], populations: ['infants'], interactions: [] },
      severity: {},
      en: ['Honey allergy', 'Infants under 1 year'],
      zh: ['蜂蜜过敏', '1 岁以下婴幼儿']
    },
    dosage: {
      en: 'Adults: 1 lozenge every 2-3 hours as needed. Children (over 3 years): same dosage.',
      zh: '成人：每 2-3 小时含 1 粒，根据需要。3 岁以上儿童：同成人。'
    },
    side_effects: { common: [], en: [], zh: [] },
    evidence_level: 'B',
    references: ['Honey in Cough Management'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 600, price: 6.00, currency: 'USD' }]
  },
  {
    id: 'nac-supplement',
    name: 'N-Acetylcysteine (NAC)',
    generic_name: 'N-Acetylcysteine',
    aliases: ['NAC', 'N-乙酰半胱氨酸'],
    atc_code: 'R05CB',
    active_ingredients: ['N-Acetylcysteine'],
    indication_tags: ['symptom:cough', 'symptom:wet_cough'],
    contraindication_tags: [],
    indications: {
      structured: {
        symptomTags: ['cough', 'wet_cough'],
        description: { en: 'Mucolytic agent that thins mucus and aids expectorant action. Good for wet cough.', zh: '粘液稀释剂，能稀释痰液，有利于咳嗽排痰。用于湿咳。' }
      }
    },
    contraindications: {
      structured: { conditions: [], populations: [], interactions: [] },
      severity: {},
      en: [],
      zh: []
    },
    dosage: {
      en: 'Adults: 200-600mg two to three times daily.',
      zh: '成人：200-600mg，一日 2-3 次。'
    },
    side_effects: { common: [], en: ['Nausea', 'Vomiting (rare)'], zh: ['恶心', '呕吐(少见)'] },
    evidence_level: 'B',
    references: ['Expectorant Efficacy Studies'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 400, price: 14.00, currency: 'USD' }]
  },
  {
    id: 'peppermint-oil',
    name: 'Peppermint Oil Inhalation',
    generic_name: 'Mentha piperita oil',
    aliases: ['薄荷油', '薄荷精油'],
    atc_code: 'R01AX',
    active_ingredients: ['Peppermint oil'],
    indication_tags: ['symptom:cough', 'symptom:dry_cough'],
    contraindication_tags: [],
    indications: {
      structured: {
        symptomTags: ['cough'],
        description: { en: 'Inhalation therapy for cough relief and nasal/throat soothing.', zh: '吸入疗法，缓解咳嗽，舒缓咽喉和鼻腔。' }
      }
    },
    contraindications: {
      structured: { conditions: [], populations: [], interactions: [] },
      severity: {},
      en: ['Not for ingestion; inhalation use only'],
      zh: ['仅供吸入使用，不可内服']
    },
    dosage: {
      en: 'Inhale vapors from a few drops in hot water or use commercial inhalation product as directed.',
      zh: '在热水中加入几滴，吸入蒸气；或按照商品说明使用。'
    },
    side_effects: { common: [], en: [], zh: [] },
    evidence_level: 'B',
    references: ['Aromatherapy Uses'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 200, price: 10.00, currency: 'USD' }]
  },
  // Additional medicines for GERD
  {
    id: 'omeprazole-20mg',
    name: 'Omeprazole 20mg',
    generic_name: 'Omeprazole',
    aliases: ['奥美拉唑', 'Prilosec'],
    atc_code: 'A02BC01',
    active_ingredients: ['Omeprazole'],
    indication_tags: ['symptom:gerd', 'symptom:heartburn'],
    contraindication_tags: [],
    indications: {
      structured: {
        symptomTags: ['gerd', 'heartburn'],
        description: { en: 'Proton pump inhibitor for typical GERD and heartburn. Reduces stomach acid production.', zh: '质子泵抑制剂，用于典型胃灼热和反流。减少胃酸分泌。' }
      }
    },
    contraindications: {
      structured: { conditions: [], populations: [], interactions: [] },
      severity: {},
      en: [],
      zh: []
    },
    dosage: {
      en: 'Adults: 20mg once daily for 4-8 weeks. Can extend to maintenance therapy.',
      zh: '成人：20mg，一日一次，4-8 周为一疗程。可继续维持治疗。'
    },
    side_effects: {
      common: ['Headache', 'Diarrhea'],
      en: ['Headache', 'Diarrhea', 'Dizziness'],
      zh: ['头痛', '腹泻', '头晕']
    },
    evidence_level: 'A',
    references: ['GERD Management Guidelines 2023'],
    last_updated: '2026-01-15',
    otc_class: 'B',
    availability: [{ region: 'Global', stock: 600, price: 20.00, currency: 'USD' }]
  },
  {
    id: 'pantoprazole-40mg',
    name: 'Pantoprazole 40mg',
    generic_name: 'Pantoprazole',
    aliases: ['泛酸', 'Protonix'],
    atc_code: 'A02BC02',
    active_ingredients: ['Pantoprazole'],
    indication_tags: ['symptom:gerd', 'symptom:heartburn'],
    contraindication_tags: [],
    indications: {
      structured: {
        symptomTags: ['gerd', 'heartburn'],
        description: { en: 'Long-acting PPI for GERD symptoms and frequent heartburn relief.', zh: '长效质子泵抑制剂，用于胃灼热和频繁反流症状。' }
      }
    },
    contraindications: {
      structured: { conditions: [], populations: [], interactions: [] },
      severity: {},
      en: [],
      zh: []
    },
    dosage: {
      en: 'Adults: 40mg once daily in the morning for 4-8 weeks.',
      zh: '成人：40mg，早晨一日一次，4-8 周为一疗程。'
    },
    side_effects: {
      common: [],
      en: ['Headache (rare)', 'Diarrhea (rare)'],
      zh: ['头痛(少见)', '腹泻(少见)']
    },
    evidence_level: 'A',
    references: ['PPI Efficacy Studies'],
    last_updated: '2026-01-15',
    otc_class: 'B',
    availability: [{ region: 'Global', stock: 500, price: 22.00, currency: 'USD' }]
  },
  {
    id: 'aluminum-hydroxide-gel',
    name: 'Aluminum Hydroxide-Magnesium Hydroxide Gel',
    generic_name: 'Aluminum hydroxide + Magnesium hydroxide',
    aliases: ['氢和铝镁合剂', 'Antacid gel'],
    atc_code: 'A02AD',
    active_ingredients: ['Aluminum hydroxide', 'Magnesium hydroxide'],
    indication_tags: ['symptom:gerd', 'symptom:heartburn', 'symptom:stomach_pain'],
    contraindication_tags: ['exclusion:kidney_disease'],
    indications: {
      structured: {
        symptomTags: ['gerd', 'heartburn'],
        description: { en: 'Fast-acting antacid for immediate heartburn relief and acid neutralization.', zh: '速效抗酸剂，立即缓解烧心和中和胃酸。' }
      }
    },
    contraindications: {
      structured: { conditions: ['kidney_disease'], populations: [], interactions: [] },
      severity: { 'kidney_disease': 'caution' },
      en: ['Severe kidney disease'],
      zh: ['严重肾病']
    },
    dosage: {
      en: 'Adults: 5-10 mL (1-2 teaspoons) every 3-4 hours as needed, or after meals and at bedtime.',
      zh: '成人：5-10mL（1-2 茶匙），每 3-4 小时一次；或饭后和睡前服用。'
    },
    side_effects: {
      common: ['Constipation', 'Diarrhea'],
      en: ['Constipation or diarrhea', 'Nausea'],
      zh: ['便秘或腹泻', '恶心']
    },
    evidence_level: 'A',
    references: ['Antacid Use Guidelines'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 700, price: 7.00, currency: 'USD' }]
  },
  // Additional medicines for allergic rhinitis
  {
    id: 'loratadine-10mg',
    name: 'Loratadine 10mg',
    generic_name: 'Loratadine',
    aliases: ['氯雷他定', 'Claritin'],
    atc_code: 'R06AX13',
    active_ingredients: ['Loratadine'],
    indication_tags: ['symptom:rhinitis', 'symptom:mild_rhinitis'],
    contraindication_tags: [],
    indications: {
      structured: {
        symptomTags: ['rhinitis'],
        description: { en: 'Non-drowsy antihistamine for allergic rhinitis relief. Second-generation antihistamine.', zh: '非镇静类抗组胺药，用于过敏性鼻炎。第二代抗组胺药。' }
      }
    },
    contraindications: {
      structured: { conditions: [], populations: [], interactions: [] },
      severity: {},
      en: [],
      zh: []
    },
    dosage: {
      en: 'Adults: 10mg once daily, preferably in the morning.',
      zh: '成人：10mg，一日一次，最好在早上。'
    },
    side_effects: {
      common: [],
      en: ['Headache (rare)', 'Dry mouth'],
      zh: ['头痛(少见)', '口干']
    },
    evidence_level: 'A',
    references: ['Allergic Rhinitis Management 2023'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 800, price: 8.00, currency: 'USD' }]
  },
  {
    id: 'mometasone-nasal',
    name: 'Mometasone Furoate Nasal Spray',
    generic_name: 'Mometasone furoate',
    aliases: ['糠酸莫美他松', 'Nasonex'],
    atc_code: 'R01AD',
    active_ingredients: ['Mometasone furoate'],
    indication_tags: ['symptom:rhinitis', 'symptom:severe_rhinitis'],
    contraindication_tags: [],
    indications: {
      structured: {
        symptomTags: ['rhinitis'],
        description: { en: 'Intranasal corticosteroid spray for moderate-severe allergic rhinitis. Local action with minimal systemic absorption.', zh: '鼻喷糖皮质激素，用于中重度过敏性鼻炎。局部作用，全身吸收少。' }
      }
    },
    contraindications: {
      structured: { conditions: [], populations: [], interactions: [] },
      severity: {},
      en: [],
      zh: []
    },
    dosage: {
      en: 'Adults: 2 sprays per nostril once daily (50 mcg per spray). Can increase to twice daily if needed.',
      zh: '成人：每个鼻孔 2 次喷雾，一日一次（每次 50 微克）。必要时可增至一日两次。'
    },
    side_effects: {
      common: [],
      en: ['Nasal irritation', 'Headache (rare)'],
      zh: ['鼻腔刺激', '头痛(少见)']
    },
    evidence_level: 'A',
    references: ['Intranasal Corticosteroid Guidelines'],
    last_updated: '2026-01-15',
    otc_class: 'B',
    availability: [{ region: 'Global', stock: 400, price: 25.00, currency: 'USD' }]
  },
  // Additional medicines for urticaria
  {
    id: 'cetirizine-10mg',
    name: 'Cetirizine 10mg',
    generic_name: 'Cetirizine HCl',
    aliases: ['西替利嗪', 'Zyrtec'],
    atc_code: 'R06AE07',
    active_ingredients: ['Cetirizine'],
    indication_tags: ['symptom:urticaria', 'symptom:acute_urticaria'],
    contraindication_tags: [],
    indications: {
      structured: {
        symptomTags: ['urticaria'],
        description: { en: 'Fast-acting antihistamine for acute urticaria and hives relief.', zh: '抗组胺药，快速缓解急性荨麻疹和皮疹瘙痒。' }
      }
    },
    contraindications: {
      structured: { conditions: [], populations: [], interactions: [] },
      severity: {},
      en: [],
      zh: []
    },
    dosage: {
      en: 'Adults: 10mg once daily. For severe cases, can increase to 20mg per day.',
      zh: '成人：10mg，一日一次。严重病例可增至 20mg/日。'
    },
    side_effects: {
      common: ['Drowsiness (minimal)'],
      en: ['Mild drowsiness', 'Headache'],
      zh: ['轻微嗜睡', '头痛']
    },
    evidence_level: 'A',
    references: ['Urticaria Treatment Guidelines 2023'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 900, price: 9.00, currency: 'USD' }]
  },
  {
    id: 'calamine-lotion',
    name: 'Calamine Lotion',
    generic_name: 'Calamine + Zinc oxide',
    aliases: ['炉甘石', '炉甘石洗剂'],
    atc_code: 'D02AX',
    active_ingredients: ['Calamine', 'Zinc oxide'],
    indication_tags: ['symptom:urticaria'],
    contraindication_tags: [],
    indications: {
      structured: {
        symptomTags: ['urticaria'],
        description: { en: 'Topical lotion for itching relief and skin soothing in urticaria and hives.', zh: '外用洗剂，缓解荨麻疹和皮疹瘙痒。' }
      }
    },
    contraindications: {
      structured: { conditions: [], populations: [], interactions: [] },
      severity: {},
      en: [],
      zh: []
    },
    dosage: {
      en: 'Apply topically to affected areas 2-3 times daily or as needed for itch relief.',
      zh: '涂抹在患处，一日 2-3 次或根据需要以缓解瘙痒。'
    },
    side_effects: { common: [], en: [], zh: [] },
    evidence_level: 'B',
    references: ['Topical Pruritus Relief'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 500, price: 6.00, currency: 'USD' }]
  },
  {
    id: 'diphenhydramine-itch-cream',
    name: 'Diphenhydramine Itch Cream',
    generic_name: 'Diphenhydramine topical',
    aliases: ['苯海拉明膏', 'Anti-itch cream'],
    atc_code: 'D04AB',
    active_ingredients: ['Diphenhydramine'],
    indication_tags: ['symptom:urticaria'],
    contraindication_tags: [],
    indications: {
      structured: {
        symptomTags: ['urticaria'],
        description: { en: 'Topical antihistamine cream for fast local relief of urticaria itching.', zh: '外用抗组胺膏，快速缓解荨麻疹瘙痒。' }
      }
    },
    contraindications: {
      structured: { conditions: [], populations: [], interactions: [] },
      severity: {},
      en: [],
      zh: []
    },
    dosage: {
      en: 'Apply thin layer to affected skin 2-3 times daily as needed.',
      zh: '薄涂患处皮肤，一日 2-3 次，根据需要。'
    },
    side_effects: { common: [], en: ['Mild skin irritation (rare)'], zh: ['皮肤刺激(少见)'] },
    evidence_level: 'B',
    references: ['Topical Antihistamines'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 300, price: 12.00, currency: 'USD' }]
  },
  // Additional medicines for back pain
  {
    id: 'diclofenac-50mg',
    name: 'Diclofenac 50mg',
    generic_name: 'Diclofenac sodium',
    aliases: ['双氯芬酸', 'Voltaren'],
    atc_code: 'M01AB05',
    active_ingredients: ['Diclofenac'],
    indication_tags: ['symptom:back_pain', 'symptom:acute_back_pain'],
    contraindication_tags: ['exclusion:stomach_ulcer'],
    indications: {
      structured: {
        symptomTags: ['back_pain'],
        description: { en: 'Potent NSAID with strong anti-inflammatory action for acute back pain relief.', zh: '强效非甾体抗炎药，抗炎作用强，用于急性腰痛。' }
      }
    },
    contraindications: {
      structured: {
        conditions: ['stomach_ulcer'],
        populations: [],
        interactions: [{ drugClass: 'Anticoagulants', severity: 'moderate', action: 'Increased bleeding risk' }]
      },
      severity: { 'stomach_ulcer': 'caution' },
      en: ['Peptic ulcer disease', 'Severe asthma'],
      zh: ['消化性溃疡', '严重哮喘']
    },
    dosage: {
      en: 'Adults: 50mg two to three times daily with meals. Do not exceed 150mg per day.',
      zh: '成人：50mg，一日 2-3 次，随餐服用。每日不超过 150mg。'
    },
    side_effects: {
      common: ['Stomach discomfort', 'Nausea'],
      en: ['GI upset', 'Nausea', 'Dizziness'],
      zh: ['胃部不适', '恶心', '头晕']
    },
    evidence_level: 'A',
    references: ['Back Pain Management Guidelines 2023'],
    last_updated: '2026-01-15',
    otc_class: 'B',
    availability: [{ region: 'Global', stock: 600, price: 15.00, currency: 'USD' }]
  },
  {
    id: 'topical-nsaid-patch',
    name: 'Topical NSAID Patch (Diclofenac)',
    generic_name: 'Diclofenac transdermal patch',
    aliases: ['双氯芬酸贴剂', '止痛贴'],
    atc_code: 'M02AA15',
    active_ingredients: ['Diclofenac'],
    indication_tags: ['symptom:back_pain', 'symptom:acute_back_pain'],
    contraindication_tags: [],
    indications: {
      structured: {
        symptomTags: ['back_pain'],
        description: { en: 'Topical NSAID patch for localized back pain relief without systemic effects.', zh: '外用非甾体抗炎药贴，用于局部腰痛，无全身副作用。' }
      }
    },
    contraindications: {
      structured: { conditions: [], populations: [], interactions: [] },
      severity: {},
      en: [],
      zh: []
    },
    dosage: {
      en: 'Apply one patch to affected back area, once or twice daily for up to 8 hours at a time.',
      zh: '贴于患处，一日 1-2 次，每次最多 8 小时。'
    },
    side_effects: { common: [], en: ['Skin irritation at application site'], zh: ['贴膜处皮肤刺激'] },
    evidence_level: 'A',
    references: ['Topical NSAID Efficacy'],
    last_updated: '2026-01-15',
    otc_class: 'B',
    availability: [{ region: 'Global', stock: 400, price: 20.00, currency: 'USD' }]
  },
  {
    id: 'muscle-relaxant-cream',
    name: 'Muscle Relaxant Topical Cream',
    generic_name: 'Menthol + Camphor + Salicylate',
    aliases: ['肌肉放松膏', '万金油'],
    atc_code: 'M02AX',
    active_ingredients: ['Menthol', 'Camphor', 'Salicylate'],
    indication_tags: ['symptom:back_pain', 'symptom:acute_back_pain'],
    contraindication_tags: [],
    indications: {
      structured: {
        symptomTags: ['back_pain'],
        description: { en: 'Warming topical cream to relax muscles and ease back pain discomfort.', zh: '温暖外用膏，放松肌肉，缓解腰痛不适。' }
      }
    },
    contraindications: {
      structured: { conditions: [], populations: [], interactions: [] },
      severity: {},
      en: [],
      zh: []
    },
    dosage: {
      en: 'Apply generously to affected back area 2-3 times daily. Massage gently until absorbed.',
      zh: '充分涂抹患处，一日 2-3 次。轻轻按摩至吸收。'
    },
    side_effects: { common: [], en: ['Warm sensation', 'Mild skin irritation (rare)'], zh: ['温热感', '皮肤刺激(少见)'] },
    evidence_level: 'B',
    references: ['Topical Muscle Relaxants'],
    last_updated: '2026-01-15',
    otc_class: 'A',
    availability: [{ region: 'Global', stock: 500, price: 10.00, currency: 'USD' }]
  }
];
