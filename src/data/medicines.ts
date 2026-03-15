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
      en: 'Take 1-2 tablets (500-1000mg) every 4-6 hours.',
      zh: '每 4-6 小时服用 1-2 片 (500-1000mg)。'
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
      en: 'Take 1 tablet (200mg) every 4-6 hours while symptoms persist.',
      zh: '症状持续时，每 4-6 小时服用 1 片 (200mg)。'
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
  }
];
