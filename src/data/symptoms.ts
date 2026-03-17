export interface Symptom {
  id: string;
  icd10?: string;
  icd11?: string;
  icd11_label?: {
    en: string;
    zh: string;
  };
  snomed_ct?: string;
  name: {
    en: string;
    zh: string;
  };
  description?: {
    en: string;
    zh: string;
  };
  icon?: 'bed' | 'brain' | 'bone' | 'lungs' | 'flame' | 'flower' | 'hives' | 'droplets' | 'eye' | 'ear' | 'leaf' | 'heart' | 'mic';
  group?: 'sleep' | 'neurology' | 'musculoskeletal' | 'respiratory' | 'digestive' | 'allergy' | 'women' | 'oral_throat' | 'eye' | 'ear' | 'urinary' | 'skin';
  popular?: boolean;
  search_keywords?: string[];
  questions: Question[];
}

export interface Question {
  id: string;
  category?: 'screening' | 'comorbidity' | 'lifestyle' | 'diagnosis' | 'history';
  text: {
    en: string;
    zh: string;
  };
  type: 'choice' | 'multi-choice' | 'range' | 'text' | 'risk';
  next_question_id?: string; // Linear next question
  options?: {
    label: {
      en: string;
      zh: string;
    };
    value: string;
    tag?: string;
    is_critical?: boolean;
    severity_weight?: number;
    next_question_id?: string; // Branching next question
    snomed?: string;
  }[];
}

export const symptoms: Symptom[] = [
  {
    id: 'insomnia',
    icd11: '7A00',
    icd11_label: { en: 'Chronic insomnia disorder', zh: '慢性失眠障碍' },
    snomed_ct: '248218005',
    name: { en: 'Insomnia', zh: '失眠症' },
    description: { en: 'Difficulty falling asleep, staying asleep, or early awakening.', zh: '入睡困难、睡眠维持困难或早醒。' },
    icon: 'bed',
    group: 'sleep',
    popular: true,
    search_keywords: ['insomnia', 'sleep', '失眠', 'sm', '7a00'],
    questions: [
      {
        id: 'primary_complaint',
        category: 'diagnosis',
        text: { en: 'What is your primary sleep concern?', zh: '您最主要的困扰是？' },
        type: 'choice',
        options: [
          { label: { en: 'Difficulty falling asleep', zh: '难以入睡' }, value: 'falling', tag: 'symptom:falling_asleep', next_question_id: 'falling_latency' },
          { label: { en: 'Difficulty maintaining sleep', zh: '睡眠维持困难' }, value: 'maintaining', tag: 'symptom:frequent_waking', next_question_id: 'waking_frequency' },
          { label: { en: 'Waking up too early', zh: '早醒' }, value: 'early', tag: 'symptom:early_awakening', next_question_id: 'cause_screening' },
          { label: { en: 'Poor sleep quality / Dreaming', zh: '多梦、睡眠质量差' }, value: 'quality', tag: 'symptom:poor_quality', next_question_id: 'cause_screening' }
        ]
      },
      {
        id: 'falling_latency',
        category: 'diagnosis',
        text: { en: 'How long does it usually take to fall asleep?', zh: '躺下后大概多久能睡着？' },
        type: 'choice',
        options: [
          { label: { en: 'Within 30 mins', zh: '30分钟内' }, value: 'normal', next_question_id: 'cause_screening' },
          { label: { en: '30-60 mins', zh: '30-60分钟' }, value: 'mild', severity_weight: 0.5, next_question_id: 'cause_screening' },
          { label: { en: 'Over 60 mins', zh: '超过1小时' }, value: 'severe', severity_weight: 1.0, tag: 'symptom:severe_falling_asleep', next_question_id: 'cause_screening' }
        ]
      },
      {
        id: 'waking_frequency',
        category: 'diagnosis',
        text: { en: 'How many times do you wake up at night?', zh: '夜间通常醒来几次？' },
        type: 'choice',
        options: [
          { label: { en: '0-1 time', zh: '0-1 次' }, value: 'normal', next_question_id: 'cause_screening' },
          { label: { en: '2-3 times', zh: '2-3 次' }, value: 'moderate', severity_weight: 0.5, tag: 'symptom:frequent_waking', next_question_id: 'cause_screening' },
          { label: { en: 'More than 3 times', zh: '超过 3 次' }, value: 'severe', severity_weight: 1.0, tag: 'symptom:severe_frequent_waking', next_question_id: 'cause_screening' }
        ]
      },
      {
        id: 'cause_screening',
        category: 'screening',
        text: { en: 'Possible causes of your insomnia?', zh: '您认为失眠的可能原因是？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'High stress / Anxiety', zh: '压力过大 / 焦虑紧张' }, value: 'stress', tag: 'cause:stress' },
          { label: { en: 'Irregular schedule / Jetlag', zh: '作息紊乱 / 时差' }, value: 'lifestyle', tag: 'cause:jetlag' },
          { label: { en: 'Environment (Noise / Light)', zh: '环境因素 (噪音/光线)' }, value: 'environment', tag: 'cause:environment' },
          { label: { en: 'Coffee / Tea late at night', zh: '睡前喝茶 / 咖啡' }, value: 'diet', tag: 'cause:diet' },
          { label: { en: 'Menopause symptoms (Hot flashes)', zh: '更年期症状 (潮热盗汗)' }, value: 'menopause', tag: 'cause:menopause' },
          { label: { en: 'Medications (Thyroxine, etc.)', zh: '正在服用可能影响睡眠的药物' }, value: 'meds', tag: 'cause:meds' }
        ],
        next_question_id: 'comorbidity_screening'
      },
      {
        id: 'comorbidity_screening',
        category: 'comorbidity',
        text: { en: 'Do you have any of these comorbid conditions?', zh: '您是否伴有以下疾病或症状？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Severe Anxiety / Depression', zh: '严重的焦虑或抑郁情绪' }, value: 'mental', tag: 'comorbid:mental' },
          { label: { en: 'Snoring / Sleep Apnea', zh: '打鼾 / 睡眠呼吸暂停' }, value: 'osa', tag: 'comorbid:osa' },
          { label: { en: 'Chronic Pain', zh: '慢性疼痛' }, value: 'pain', tag: 'comorbid:pain' },
          { label: { en: 'Frequent Urination at night', zh: '夜尿频繁' }, value: 'nocturia', tag: 'comorbid:nocturia' }
        ],
        next_question_id: 'duration'
      },
      {
        id: 'duration',
        category: 'diagnosis',
        text: { en: 'How long has this been happening?', zh: '以上症状持续多久了？' },
        type: 'choice',
        options: [
          { label: { en: 'Less than 1 week', zh: '少于1周' }, value: 'acute' },
          { label: { en: '1-4 weeks', zh: '1-4周' }, value: 'subacute' },
          { label: { en: '1-3 months', zh: '1-3个月' }, value: 'chronic_short' },
          { label: { en: 'More than 3 months', zh: '超过3个月' }, is_critical: true, value: 'chronic_long' }
        ],
        next_question_id: 'accompaniment'
      },
      {
        id: 'accompaniment',
        category: 'diagnosis',
        text: { en: 'Are you experiencing any of these?', zh: '是否伴有以下情况？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Irritability / Anger', zh: '烦躁、易怒、口苦' }, value: 'angry', tag: 'symptom:irritability' },
          { label: { en: 'Dizziness / Fatigue', zh: '头晕乏力' }, value: 'dizzy', tag: 'symptom:dizziness' },
          { label: { en: 'Palpitations / Anxiety', zh: '心悸不安' }, value: 'heart', tag: 'symptom:palpitations' },
          { label: { en: 'Low back / knee soreness', zh: '腰膝酸软' }, value: 'lumbarknee', tag: 'symptom:lumbarknee_soreness' }
        ]
      }
    ]
  },
  {
    id: 'headache',
    icd11: '8A80',
    icd11_label: { en: 'Primary headache disorders', zh: '原发性头痛障碍' },
    snomed_ct: '25064002',
    name: { en: 'Headache', zh: '头痛' },
    description: { en: 'Migraine-like or tension-type headache patterns.', zh: '偏头痛或紧张型头痛等常见头痛模式。' },
    icon: 'brain',
    group: 'neurology',
    popular: true,
    search_keywords: ['headache', 'migraine', '头痛', 'tt', 'ptt', '8a80'],
    questions: [
      {
        id: 'headache_type',
        category: 'diagnosis',
        text: { en: 'What does the pain feel like?', zh: '头痛的感觉是怎样的？' },
        type: 'choice',
        options: [
          { label: { en: 'Pulsating / Throbbing (One-sided)', zh: '搏动性/跳痛（通常单侧）' }, value: 'migraine', tag: 'symptom:migraine_type', next_question_id: 'migraine_features' },
          { label: { en: 'Pressing / Tightening (Band-like)', zh: '压迫感/紧箍感（像戴了紧箍咒）' }, value: 'tension', tag: 'symptom:tension_type', next_question_id: 'tension_features' },
          { label: { en: 'Severe stabbing (Around one eye)', zh: '剧烈刺痛（眼周区域）' }, value: 'cluster', is_critical: true, next_question_id: 'headache_red_flags' }
        ]
      },
      {
        id: 'migraine_features',
        category: 'diagnosis',
        text: { en: 'Accompanied by any of these?', zh: '是否伴有以下任何特征？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Nausea / Vomiting', zh: '恶心 / 呕吐' }, value: 'nausea', tag: 'symptom:nausea' },
          { label: { en: 'Sensitivity to Light / Sound', zh: '畏光 / 畏声' }, value: 'sensitivity', tag: 'symptom:sensitivity' },
          { label: { en: 'Visual aura (flashing lights)', zh: '视觉先兆（如闪光）' }, value: 'aura', tag: 'symptom:aura' }
        ],
        next_question_id: 'headache_red_flags'
      },
      {
        id: 'tension_features',
        category: 'diagnosis',
        text: { en: 'Headache characteristics:', zh: '头痛特征：' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Both sides of head', zh: '双侧头痛' }, value: 'bilateral', tag: 'symptom:bilateral' },
          { label: { en: 'Mild to moderate intensity', zh: '轻中度疼痛强度' }, value: 'mild_moderate', tag: 'symptom:mild_moderate' }
        ],
        next_question_id: 'headache_red_flags'
      },
      {
        id: 'headache_red_flags',
        category: 'screening',
        text: { en: 'Are you experiencing any of these?', zh: '是否伴有以下任何紧急情况？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Sudden "Thunderclap" pain', zh: '突然发作的“霹雳样”剧痛' }, value: 'thunderclap', is_critical: true, tag: 'symptom:thunderclap' },
          { label: { en: 'Fever + Stiff Neck', zh: '发烧 + 脖子僵硬' }, value: 'meningitis', is_critical: true, tag: 'symptom:stiff_neck' },
          { label: { en: 'Weakness / Slurred Speech', zh: '肢体无力 / 言语不清' }, value: 'stroke', is_critical: true, tag: 'symptom:stroke_signs' }
        ]
      }
    ]
  },
  {
    id: 'back_pain',
    icd11: 'ME84',
    icd11_label: { en: 'Low back pain', zh: '下背痛' },
    snomed_ct: '161891005',
    name: { en: 'Low Back Pain', zh: '腰背痛' },
    description: { en: 'Non-specific low back pain and duration-based triage.', zh: '非特异性下背痛，按病程分流与排除红旗征。' },
    icon: 'bone',
    group: 'musculoskeletal',
    popular: true,
    search_keywords: ['back', 'low back pain', '腰痛', '腰背痛', 'ybt', 'me84'],
    questions: [
      {
        id: 'back_pain_duration',
        category: 'diagnosis',
        text: { en: 'How long has the pain lasted?', zh: '腰痛持续了多久？' },
        type: 'choice',
        options: [
          { label: { en: 'Less than 4 weeks (Acute)', zh: '少于 4 周（急性）' }, value: 'acute', tag: 'symptom:acute_back_pain' },
          { label: { en: '4-12 weeks (Subacute)', zh: '4-12 周（亚急性）' }, value: 'subacute', tag: 'symptom:subacute_back_pain' },
          { label: { en: 'More than 12 weeks (Chronic)', zh: '超过 12 周（慢性）' }, value: 'chronic', tag: 'symptom:chronic_back_pain' }
        ],
        next_question_id: 'back_pain_red_flags'
      },
      {
        id: 'back_pain_red_flags',
        category: 'screening',
        text: { en: 'Do you have any of these concerning symptoms?', zh: '是否有以下任何严重症状？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Numbness in "saddle" area', zh: '会阴部（马鞍区）麻木' }, value: 'saddle', is_critical: true, tag: 'symptom:saddle_anesthesia' },
          { label: { en: 'Difficulty urinating/defecating', zh: '排尿或排便困难' }, value: 'sphincter', is_critical: true, tag: 'symptom:sphincter_dysfunction' },
          { label: { en: 'Leg weakness / Foot drop', zh: '下肢无力 / 足下垂' }, value: 'weakness', is_critical: true, tag: 'symptom:leg_weakness' },
          { label: { en: 'Unexplained weight loss', zh: '不明原因的体重减轻' }, value: 'weight_loss', is_critical: true, tag: 'symptom:weight_loss' }
        ]
      }
    ]
  },
  {
    id: 'digestive',
    icd11: 'DA22',
    icd11_label: { en: 'Gastro-oesophageal reflux disease', zh: '胃食管反流病（烧心/反酸）' },
    snomed_ct: '60731008',
    name: { en: 'Heartburn / Reflux', zh: '胃灼热/反流' },
    description: { en: 'Heartburn, reflux, dyspepsia-like symptoms.', zh: '烧心、反酸与功能性消化不良相关症状。' },
    icon: 'flame',
    group: 'digestive',
    popular: true,
    search_keywords: ['heartburn', 'reflux', 'gerd', '烧心', '反酸', 'sx', 'da22'],
    questions: [
      {
        id: 'digestive_pattern',
        category: 'diagnosis',
        text: { en: 'What is your primary symptom?', zh: '您最主要的症状是？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Heartburn / Acid Reflux', zh: '烧心 / 反酸' }, value: 'gerd', tag: 'symptom:heartburn' },
          { label: { en: 'Postprandial fullness', zh: '餐后饱胀感' }, value: 'fullness', tag: 'symptom:fullness' },
          { label: { en: 'Early satiation', zh: '早饱感' }, value: 'early_satiety', tag: 'symptom:early_satiety' },
          { label: { en: 'Upper abdominal pain', zh: '上腹部疼痛' }, value: 'stomach_pain', tag: 'symptom:stomach_pain' }
        ],
        next_question_id: 'digestive_red_flags'
      },
      {
        id: 'digestive_red_flags',
        category: 'screening',
        text: { en: 'Any of these concerning symptoms?', zh: '是否有以下令人担忧的症状？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Difficulty swallowing', zh: '吞咽困难' }, value: 'dysphagia', is_critical: true, tag: 'symptom:dysphagia' },
          { label: { en: 'Black / Tarry stools', zh: '黑便 / 柏油样便' }, value: 'black_stool', is_critical: true, tag: 'symptom:black_stool' },
          { label: { en: 'Persistent vomiting', zh: '剧烈且持续的呕吐' }, value: 'vomiting', is_critical: true, tag: 'symptom:persistent_vomiting' },
          { label: { en: 'Anemia / Weight loss', zh: '贫血 / 体重减轻' }, value: 'anemia', is_critical: true, tag: 'symptom:anemia_weight_loss' }
        ]
      }
    ]
  },
  {
    id: 'rhinitis',
    icd11: 'CA08',
    icd11_label: { en: 'Allergic rhinitis', zh: '过敏性鼻炎' },
    snomed_ct: '61582004',
    name: { en: 'Allergic Rhinitis', zh: '过敏性鼻炎' },
    description: { en: 'Sneezing, runny nose, itchy eyes; severity-based options.', zh: '打喷嚏、流鼻涕、眼痒；按严重度选择方案。' },
    icon: 'flower',
    group: 'allergy',
    popular: true,
    search_keywords: ['rhinitis', 'allergic rhinitis', '过敏性鼻炎', 'biyan', 'gmb', 'ca08'],
    questions: [
      {
        id: 'rhinitis_severity',
        category: 'diagnosis',
        text: { en: 'Symptom severity and persistence:', zh: '症状严重度及持续性：' },
        type: 'choice',
        options: [
          { label: { en: 'Mild / Intermittent', zh: '轻中度 / 间歇性' }, value: 'mild_intermittent', tag: 'symptom:mild_rhinitis' },
          { label: { en: 'Moderate-Severe / Persistent', zh: '中重度 / 持续性' }, value: 'severe_persistent', tag: 'symptom:severe_rhinitis' }
        ]
      }
    ]
  },
  {
    id: 'urticaria',
    icd11: 'EB02',
    icd11_label: { en: 'Urticaria', zh: '荨麻疹' },
    snomed_ct: '126485001',
    name: { en: 'Urticaria (Hives)', zh: '荨麻疹（风团）' },
    description: { en: 'Raised itchy welts; acute vs chronic and step-up guidance.', zh: '瘙痒风团；急性/慢性分型与阶梯建议。' },
    icon: 'hives',
    group: 'allergy',
    popular: false,
    search_keywords: ['urticaria', 'hives', '荨麻疹', 'xunzhen', 'xmz', 'eb02'],
    questions: [
      {
        id: 'urticaria_duration',
        category: 'diagnosis',
        text: { en: 'How long has the skin rash lasted?', zh: '皮疹持续了多久？' },
        type: 'choice',
        options: [
          { label: { en: 'Less than 6 weeks (Acute)', zh: '少于 6 周（急性）' }, value: 'acute', tag: 'symptom:acute_urticaria' },
          { label: { en: 'More than 6 weeks (Chronic)', zh: '超过 6 周（慢性）' }, value: 'chronic', tag: 'symptom:chronic_urticaria' }
        ],
        next_question_id: 'previous_treatment'
      },
      {
        id: 'previous_treatment',
        category: 'history',
        text: { en: 'Have you tried any antihistamines?', zh: '您是否尝试过抗组胺药？' },
        type: 'choice',
        options: [
          { label: { en: 'No treatment yet', zh: '尚未尝试任何治疗' }, value: 'none', tag: 'history:no_treatment' },
          { label: { en: 'Standard dose (No relief)', zh: '标准剂量（无缓解）' }, value: 'resistant', tag: 'history:antihistamine_resistant' }
        ]
      }
    ]
  },
  {
    id: 'cough',
    icd11: 'CA07',
    icd11_label: { en: 'Cough', zh: '咳嗽' },
    snomed_ct: '82272006',
    name: { en: 'Cough', zh: '咳嗽' },
    description: { en: 'Acute/subacute/chronic cough classification and red flags.', zh: '按病程分为急性/亚急性/慢性，并筛查红旗征。' },
    icon: 'lungs',
    group: 'respiratory',
    popular: true,
    search_keywords: ['cough', '咳嗽', 'ks', 'ca07'],
    questions: [
      {
        id: 'cough_duration',
        category: 'diagnosis',
        text: { en: 'How long has the cough lasted?', zh: '咳嗽持续多久了？' },
        type: 'choice',
        options: [
          { label: { en: '< 3 weeks (Acute)', zh: '< 3 周（急性）' }, value: 'acute', tag: 'symptom:acute_cough' },
          { label: { en: '3-8 weeks (Subacute)', zh: '3-8 周（亚急性）' }, value: 'subacute', tag: 'symptom:subacute_cough' },
          { label: { en: '> 8 weeks (Chronic)', zh: '> 8 周（慢性）' }, value: 'chronic', tag: 'symptom:chronic_cough' }
        ],
        next_question_id: 'cold_symptoms'
      },
      {
        id: 'cold_symptoms',
        category: 'diagnosis',
        text: { en: 'What are your primary symptoms?', zh: '您的主要症状是？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Dry Cough', zh: '干咳' }, value: 'dry_cough', tag: 'symptom:dry_cough' },
          { label: { en: 'Cough with Phlegm', zh: '咳痰' }, value: 'wet_cough', tag: 'symptom:wet_cough' },
          { label: { en: 'Nasal Congestion', zh: '鼻塞' }, value: 'congestion', tag: 'symptom:nasal_congestion' },
          { label: { en: 'Sore Throat', zh: '咽喉疼痛' }, value: 'sore_throat', tag: 'symptom:sore_throat' }
        ],
        next_question_id: 'cold_red_flags'
      },
      {
        id: 'cold_red_flags',
        category: 'screening',
        text: { en: 'Are you experiencing any "Red Flags"?', zh: '是否有以下任何“红旗征”？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Shortness of breath', zh: '呼吸困难 / 气促' }, value: 'breathless', is_critical: true, tag: 'symptom:breathless' },
          { label: { en: 'Coughing up blood', zh: '咯血' }, value: 'haemoptysis', is_critical: true, tag: 'symptom:haemoptysis' },
          { label: { en: 'Severe Chest Pain', zh: '剧烈胸痛' }, value: 'chest_pain', is_critical: true, tag: 'symptom:chest_pain' },
          { label: { en: 'High fever (>39°C)', zh: '持续高烧 (>39°C)' }, value: 'high_fever', is_critical: true, tag: 'symptom:high_fever' },
          { label: { en: 'Difficulty swallowing', zh: '吞咽困难' }, value: 'dysphagia', is_critical: true, tag: 'symptom:dysphagia' },
          { label: { en: 'Hoarseness > 2 weeks', zh: '声音嘶哑 > 2 周' }, value: 'hoarseness', is_critical: true, tag: 'symptom:hoarseness' }
        ]
      }
    ]
  }
  ,
  {
    id: 'cold_flu',
    icd11: 'CA00',
    icd11_label: { en: 'Acute upper respiratory infections', zh: '急性上呼吸道感染（感冒/流感样）' },
    name: { en: 'Cold / Flu-like', zh: '感冒/流感样' },
    description: { en: 'Fever, aches, sore throat, runny nose; screen for red flags.', zh: '发热、乏力肌痛、咽痛、流涕等；先筛查红旗征。' },
    icon: 'lungs',
    group: 'respiratory',
    popular: true,
    search_keywords: ['cold', 'flu', '感冒', '流感', 'gm', 'lg', 'ca00'],
    questions: [
      {
        id: 'uri_symptoms',
        category: 'diagnosis',
        text: { en: 'What symptoms do you have?', zh: '您有哪些症状？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Fever', zh: '发热' }, value: 'fever', tag: 'symptom:high_fever' },
          { label: { en: 'Body aches', zh: '全身酸痛' }, value: 'aches', tag: 'symptom:myalgia' },
          { label: { en: 'Sore throat', zh: '咽喉痛' }, value: 'sore_throat', tag: 'symptom:sore_throat' },
          { label: { en: 'Runny nose', zh: '流鼻涕' }, value: 'runny_nose', tag: 'symptom:runny_nose' }
        ]
      }
    ]
  },
  {
    id: 'diarrhea',
    icd11: 'ME05',
    icd11_label: { en: 'Diarrhoea', zh: '腹泻' },
    name: { en: 'Diarrhea', zh: '腹泻' },
    description: { en: 'Acute diarrhea triage and hydration guidance; red flag screening.', zh: '急性腹泻分流与补液提示，并筛查红旗征。' },
    icon: 'flame',
    group: 'digestive',
    popular: false,
    search_keywords: ['diarrhea', 'diarrhoea', '腹泻', 'fx', 'me05'],
    questions: [
      {
        id: 'diarrhea_duration',
        category: 'diagnosis',
        text: { en: 'How long has it lasted?', zh: '持续多久了？' },
        type: 'choice',
        options: [
          { label: { en: 'Less than 48 hours', zh: '少于 48 小时' }, value: 'lt48', tag: 'symptom:acute_diarrhea' },
          { label: { en: '2-7 days', zh: '2-7 天' }, value: '2_7', tag: 'symptom:subacute_diarrhea' },
          { label: { en: 'More than 7 days', zh: '超过 7 天' }, value: 'gt7', is_critical: true, tag: 'symptom:chronic_diarrhea' }
        ],
        next_question_id: 'diarrhea_red_flags'
      },
      {
        id: 'diarrhea_red_flags',
        category: 'screening',
        text: { en: 'Any of these concerning symptoms?', zh: '是否有以下任何危险信号？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Blood in stool', zh: '便血' }, value: 'blood', is_critical: true, tag: 'symptom:blood_in_stool' },
          { label: { en: 'Severe dehydration', zh: '明显脱水（头晕/尿少）' }, value: 'dehydration', is_critical: true, tag: 'symptom:dehydration' },
          { label: { en: 'High fever', zh: '持续高烧' }, value: 'fever', is_critical: true, tag: 'symptom:high_fever' }
        ]
      }
    ]
  },
  {
    id: 'constipation',
    icd11: 'ME06',
    icd11_label: { en: 'Constipation', zh: '便秘' },
    name: { en: 'Constipation', zh: '便秘' },
    description: { en: 'Bowel movement difficulty; screen for alarm features.', zh: '排便困难或次数减少；筛查报警症状。' },
    icon: 'flame',
    group: 'digestive',
    popular: false,
    search_keywords: ['constipation', '便秘', 'bm', 'me06'],
    questions: [
      {
        id: 'constipation_duration',
        category: 'diagnosis',
        text: { en: 'How long has it been an issue?', zh: '持续多久了？' },
        type: 'choice',
        options: [
          { label: { en: 'Less than 1 week', zh: '少于 1 周' }, value: 'lt1w', tag: 'symptom:acute_constipation' },
          { label: { en: '1-4 weeks', zh: '1-4 周' }, value: '1_4w', tag: 'symptom:subacute_constipation' },
          { label: { en: 'More than 4 weeks', zh: '超过 4 周' }, value: 'gt4w', tag: 'symptom:chronic_constipation' }
        ]
      }
    ]
  },
  {
    id: 'muscle_soreness',
    icd11: 'FB56.2',
    icd11_label: { en: 'Myalgia', zh: '肌肉酸痛' },
    name: { en: 'Muscle soreness', zh: '肌肉酸痛' },
    description: { en: 'Post-exercise or strain-related soreness; self-care and red flags.', zh: '运动后或劳损相关酸痛；自我护理与红旗征提示。' },
    icon: 'bone',
    group: 'musculoskeletal',
    popular: false,
    search_keywords: ['myalgia', 'muscle pain', '肌肉酸痛', 'jjst', 'fb56.2'],
    questions: [
      {
        id: 'myalgia_onset',
        category: 'diagnosis',
        text: { en: 'What best describes it?', zh: '更符合哪种情况？' },
        type: 'choice',
        options: [
          { label: { en: 'After exercise', zh: '运动后出现' }, value: 'post_exercise', tag: 'symptom:post_exercise' },
          { label: { en: 'After strain / overuse', zh: '劳损/过度使用' }, value: 'strain', tag: 'symptom:strain' },
          { label: { en: 'With fever', zh: '伴发热' }, value: 'fever', is_critical: true, tag: 'symptom:high_fever' }
        ]
      }
    ]
  },
  {
    id: 'anxiety',
    icd11: '6B23',
    icd11_label: { en: 'Generalized anxiety disorder', zh: '广泛性焦虑障碍' },
    name: { en: 'Anxiety / Tension', zh: '焦虑/紧张' },
    description: { en: 'Tension, worry, sleep impact; can direct to mental health resources.', zh: '紧张担忧影响睡眠与日常；可引导到心理资源。' },
    icon: 'brain',
    group: 'neurology',
    popular: false,
    search_keywords: ['anxiety', 'stress', '焦虑', '紧张', 'jl', '6b23'],
    questions: [
      {
        id: 'anxiety_screen',
        category: 'screening',
        text: { en: 'Are you experiencing any of these?', zh: '是否有以下情况？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Panic / chest tightness', zh: '惊恐发作/胸闷' }, value: 'panic', is_critical: true, tag: 'symptom:chest_pain' },
          { label: { en: 'Sleep disruption', zh: '影响睡眠' }, value: 'sleep', tag: 'comorbid:mental' },
          { label: { en: 'Persistent worry', zh: '持续担忧紧张' }, value: 'worry', tag: 'comorbid:mental' }
        ]
      }
    ]
  }
  ,
  {
    id: 'dysmenorrhea',
    icd11: 'GA34.3',
    icd11_label: { en: 'Dysmenorrhoea', zh: '痛经' },
    name: { en: 'Menstrual cramps', zh: '痛经' },
    description: { en: 'Period cramps and pain relief triage; screen for red flags.', zh: '经期腹痛与镇痛分流；先筛查红旗征。' },
    icon: 'heart',
    group: 'women',
    popular: false,
    search_keywords: ['dysmenorrhea', 'menstrual cramps', 'period pain', '痛经', 'tj', 'ga34.3'],
    questions: [
      {
        id: 'dysmenorrhea_red_flags',
        category: 'screening',
        text: { en: 'Any of these red flags?', zh: '是否有以下任何危险信号？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Severe pain with fainting', zh: '剧痛伴晕厥' }, value: 'syncope', is_critical: true, tag: 'symptom:syncope' },
          { label: { en: 'Heavy bleeding', zh: '出血量明显增多' }, value: 'heavy', is_critical: true, tag: 'symptom:heavy_bleeding' },
          { label: { en: 'Fever', zh: '发热' }, value: 'fever', is_critical: true, tag: 'symptom:high_fever' }
        ]
      }
    ]
  },
  {
    id: 'menstrual_irregularity',
    icd11: 'GA20',
    icd11_label: { en: 'Menstrual irregularity', zh: '月经不调' },
    name: { en: 'Irregular periods', zh: '月经不调' },
    description: { en: 'Cycle irregularity triage; often needs clinician evaluation.', zh: '月经周期紊乱分流；多数情况建议评估。' },
    icon: 'heart',
    group: 'women',
    popular: false,
    search_keywords: ['irregular period', 'menstrual irregularity', '月经不调', 'yjbd', 'ga20'],
    questions: [
      {
        id: 'menstrual_irregularity_flags',
        category: 'screening',
        text: { en: 'Any of these red flags?', zh: '是否有以下任何危险信号？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Possible pregnancy', zh: '可能怀孕' }, value: 'preg', is_critical: true, tag: 'exclusion:pregnant' },
          { label: { en: 'Very heavy bleeding', zh: '大量出血' }, value: 'heavy', is_critical: true, tag: 'symptom:heavy_bleeding' },
          { label: { en: 'Severe lower abdominal pain', zh: '明显下腹痛' }, value: 'pain', is_critical: true, tag: 'symptom:severe_abdominal_pain' }
        ]
      }
    ]
  },
  {
    id: 'mouth_ulcer',
    icd11: 'DA01.0',
    icd11_label: { en: 'Aphthous ulcer', zh: '口腔溃疡' },
    name: { en: 'Mouth ulcer', zh: '口腔溃疡' },
    description: { en: 'Painful mouth sores; self-care and when to seek care.', zh: '口腔黏膜溃疡疼痛；自我护理与就医时机。' },
    icon: 'leaf',
    group: 'oral_throat',
    popular: false,
    search_keywords: ['mouth ulcer', 'aphthous', 'canker sore', '口腔溃疡', 'kqky', 'da01.0'],
    questions: [
      {
        id: 'mouth_ulcer_flags',
        category: 'screening',
        text: { en: 'Any of these red flags?', zh: '是否有以下任何危险信号？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Lasts more than 2 weeks', zh: '持续超过 2 周' }, value: 'gt2w', is_critical: true, tag: 'symptom:persistent' },
          { label: { en: 'High fever', zh: '高热' }, value: 'fever', is_critical: true, tag: 'symptom:high_fever' },
          { label: { en: 'Difficulty swallowing', zh: '吞咽困难' }, value: 'dysphagia', is_critical: true, tag: 'symptom:dysphagia' }
        ]
      }
    ]
  },
  {
    id: 'sore_throat',
    icd11: 'CA02',
    icd11_label: { en: 'Acute pharyngitis', zh: '急性咽炎（喉咙痛）' },
    name: { en: 'Sore throat', zh: '喉咙痛' },
    description: { en: 'Sore throat triage and red flags.', zh: '咽痛分流与红旗征筛查。' },
    icon: 'mic',
    group: 'oral_throat',
    popular: true,
    search_keywords: ['sore throat', 'pharyngitis', '喉咙痛', 'hlt', 'ca02'],
    questions: [
      {
        id: 'throat_red_flags',
        category: 'screening',
        text: { en: 'Any of these red flags?', zh: '是否有以下任何危险信号？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Difficulty breathing', zh: '呼吸困难' }, value: 'breath', is_critical: true, tag: 'symptom:breathless' },
          { label: { en: 'Drooling / cannot swallow', zh: '流涎/无法吞咽' }, value: 'swallow', is_critical: true, tag: 'symptom:dysphagia' },
          { label: { en: 'High fever', zh: '高热' }, value: 'fever', is_critical: true, tag: 'symptom:high_fever' }
        ]
      }
    ]
  },
  {
    id: 'dry_eyes',
    icd11: '9A79',
    icd11_label: { en: 'Dry eye', zh: '眼睛干涩/疲劳' },
    name: { en: 'Dry eyes / eye strain', zh: '眼睛干涩/疲劳' },
    description: { en: 'Dryness, burning, screen-related eye strain guidance.', zh: '干涩刺痛、用眼疲劳；屏幕相关护理建议。' },
    icon: 'eye',
    group: 'eye',
    popular: false,
    search_keywords: ['dry eye', 'eye strain', '眼干', '眼疲劳', 'yg', '9a79'],
    questions: [
      {
        id: 'eye_red_flags',
        category: 'screening',
        text: { en: 'Any of these red flags?', zh: '是否有以下任何危险信号？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Sudden vision loss', zh: '视力突然下降' }, value: 'vision', is_critical: true, tag: 'symptom:vision_loss' },
          { label: { en: 'Severe eye pain', zh: '剧烈眼痛' }, value: 'pain', is_critical: true, tag: 'symptom:severe_eye_pain' },
          { label: { en: 'Eye injury / chemical exposure', zh: '眼外伤/化学品接触' }, value: 'injury', is_critical: true, tag: 'symptom:eye_injury' }
        ]
      }
    ]
  },
  {
    id: 'conjunctivitis',
    icd11: '9A61',
    icd11_label: { en: 'Conjunctivitis', zh: '结膜炎' },
    name: { en: 'Conjunctivitis (pink eye)', zh: '结膜炎（红眼）' },
    description: { en: 'Red eye with discharge or itch; triage and care guidance.', zh: '红眼分泌物或瘙痒；分流与护理建议。' },
    icon: 'eye',
    group: 'eye',
    popular: false,
    search_keywords: ['conjunctivitis', 'pink eye', '结膜炎', 'jmy', '9a61'],
    questions: [
      {
        id: 'conjunctivitis_flags',
        category: 'screening',
        text: { en: 'Any of these red flags?', zh: '是否有以下任何危险信号？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Contact lens wearer', zh: '佩戴隐形眼镜' }, value: 'lens', is_critical: true, tag: 'symptom:contact_lens' },
          { label: { en: 'Severe pain or light sensitivity', zh: '剧痛或畏光' }, value: 'pain', is_critical: true, tag: 'symptom:severe_eye_pain' },
          { label: { en: 'Vision changes', zh: '视物模糊/视力变化' }, value: 'vision', is_critical: true, tag: 'symptom:vision_change' }
        ]
      }
    ]
  },
  {
    id: 'ear_pain',
    icd11: 'AA80',
    icd11_label: { en: 'Otalgia', zh: '耳痛' },
    name: { en: 'Ear pain', zh: '耳痛' },
    description: { en: 'Ear pain triage; often needs clinical assessment.', zh: '耳痛分流；多需临床评估。' },
    icon: 'ear',
    group: 'ear',
    popular: false,
    search_keywords: ['ear pain', 'otalgia', '耳痛', 'et', 'aa80'],
    questions: [
      {
        id: 'ear_pain_flags',
        category: 'screening',
        text: { en: 'Any of these red flags?', zh: '是否有以下任何危险信号？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'High fever', zh: '高热' }, value: 'fever', is_critical: true, tag: 'symptom:high_fever' },
          { label: { en: 'Ear discharge', zh: '流脓/流液' }, value: 'discharge', is_critical: true, tag: 'symptom:ear_discharge' },
          { label: { en: 'Severe dizziness', zh: '严重眩晕' }, value: 'vertigo', is_critical: true, tag: 'symptom:vertigo' }
        ]
      }
    ]
  },
  {
    id: 'tinnitus',
    icd11: 'MC25',
    icd11_label: { en: 'Tinnitus', zh: '耳鸣' },
    name: { en: 'Tinnitus', zh: '耳鸣' },
    description: { en: 'Ringing in ears; triage and when to seek care.', zh: '耳内鸣响；分流与就医时机。' },
    icon: 'ear',
    group: 'ear',
    popular: false,
    search_keywords: ['tinnitus', 'ear ringing', '耳鸣', 'em', 'mc25'],
    questions: [
      {
        id: 'tinnitus_flags',
        category: 'screening',
        text: { en: 'Any of these red flags?', zh: '是否有以下任何危险信号？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Sudden hearing loss', zh: '听力突然下降' }, value: 'hearing_loss', is_critical: true, tag: 'symptom:hearing_loss' },
          { label: { en: 'One-sided tinnitus with dizziness', zh: '单侧耳鸣伴眩晕' }, value: 'one_side', is_critical: true, tag: 'symptom:vertigo' },
          { label: { en: 'Pulsatile tinnitus', zh: '搏动性耳鸣' }, value: 'pulsatile', is_critical: true, tag: 'symptom:pulsatile_tinnitus' }
        ]
      }
    ]
  },
  {
    id: 'uti_symptoms',
    icd11: 'GC08',
    icd11_label: { en: 'Urinary tract infection', zh: '尿路感染相关症状' },
    name: { en: 'UTI symptoms', zh: '尿路感染症状' },
    description: { en: 'Burning urination, frequency; strong care guidance and red flags.', zh: '尿痛、尿频尿急；强提示就医并筛查红旗征。' },
    icon: 'droplets',
    group: 'urinary',
    popular: false,
    search_keywords: ['uti', 'urinary', 'cystitis', '尿路感染', 'nlg', 'gc08'],
    questions: [
      {
        id: 'uti_flags',
        category: 'screening',
        text: { en: 'Any of these red flags?', zh: '是否有以下任何危险信号？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Fever or chills', zh: '发热/寒战' }, value: 'fever', is_critical: true, tag: 'symptom:high_fever' },
          { label: { en: 'Flank pain', zh: '腰部/肋脊角疼痛' }, value: 'flank', is_critical: true, tag: 'symptom:flank_pain' },
          { label: { en: 'Pregnancy', zh: '孕期' }, value: 'pregnant', is_critical: true, tag: 'exclusion:pregnant' }
        ]
      }
    ]
  },
  {
    id: 'eczema_dry_skin',
    icd11: 'EA80',
    icd11_label: { en: 'Atopic dermatitis', zh: '湿疹/皮肤干燥' },
    name: { en: 'Eczema / dry skin', zh: '湿疹/皮肤干燥' },
    description: { en: 'Itchy dry patches; skin care and red flags.', zh: '干燥瘙痒皮疹；皮肤护理与红旗征。' },
    icon: 'flower',
    group: 'skin',
    popular: false,
    search_keywords: ['eczema', 'dermatitis', 'dry skin', '湿疹', 'pfgy', 'ea80'],
    questions: [
      {
        id: 'eczema_flags',
        category: 'screening',
        text: { en: 'Any of these red flags?', zh: '是否有以下任何危险信号？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Spreading rapidly', zh: '迅速扩散' }, value: 'spreading', is_critical: true, tag: 'symptom:rapid_spread' },
          { label: { en: 'Fever with rash', zh: '皮疹伴发热' }, value: 'fever', is_critical: true, tag: 'symptom:high_fever' },
          { label: { en: 'Facial swelling', zh: '面部肿胀' }, value: 'swelling', is_critical: true, tag: 'symptom:facial_swelling' }
        ]
      }
    ]
  },
  {
    id: 'acne',
    icd11: 'ED80',
    icd11_label: { en: 'Acne', zh: '痤疮' },
    name: { en: 'Acne', zh: '痤疮' },
    description: { en: 'Acne guidance and when to seek dermatology care.', zh: '痤疮护理建议与何时就医。' },
    icon: 'flower',
    group: 'skin',
    popular: false,
    search_keywords: ['acne', 'pimples', '痤疮', 'cc', 'ed80'],
    questions: [
      {
        id: 'acne_flags',
        category: 'screening',
        text: { en: 'Any of these red flags?', zh: '是否有以下任何危险信号？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Severe painful nodules', zh: '疼痛性结节/囊肿' }, value: 'nodules', is_critical: true, tag: 'symptom:severe_acne' },
          { label: { en: 'Scarring', zh: '出现瘢痕' }, value: 'scarring', is_critical: true, tag: 'symptom:scarring' },
          { label: { en: 'Eye involvement', zh: '累及眼部' }, value: 'eye', is_critical: true, tag: 'symptom:eye_involvement' }
        ]
      }
    ]
  },
  {
    id: 'nausea_vomiting',
    icd11: 'ME24',
    icd11_label: { en: 'Nausea and vomiting', zh: '恶心/呕吐' },
    name: { en: 'Nausea / vomiting', zh: '恶心/呕吐' },
    description: { en: 'Nausea/vomiting triage; hydration and red flags.', zh: '恶心呕吐分流；补液建议与红旗征筛查。' },
    icon: 'droplets',
    group: 'digestive',
    popular: true,
    search_keywords: ['nausea', 'vomiting', '恶心', '呕吐', 'ex', 'ot', 'me24'],
    questions: [
      {
        id: 'nv_duration',
        category: 'diagnosis',
        text: { en: 'How long has it been going on?', zh: '持续多久了？' },
        type: 'choice',
        options: [
          { label: { en: 'Less than 24 hours', zh: '少于 24 小时' }, value: 'lt24', tag: 'symptom:acute_nv' },
          { label: { en: '1-2 days', zh: '1-2 天' }, value: '1_2d', tag: 'symptom:subacute_nv' },
          { label: { en: 'More than 2 days', zh: '超过 2 天' }, value: 'gt2d', is_critical: true, tag: 'symptom:persistent_vomiting' }
        ],
        next_question_id: 'nv_red_flags'
      },
      {
        id: 'nv_red_flags',
        category: 'screening',
        text: { en: 'Any of these red flags?', zh: '是否有以下任何危险信号？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Blood in vomit', zh: '呕血/咖啡渣样' }, value: 'blood', is_critical: true, tag: 'symptom:hematemesis' },
          { label: { en: 'Severe dehydration', zh: '明显脱水（头晕/尿少）' }, value: 'dehydration', is_critical: true, tag: 'symptom:dehydration' },
          { label: { en: 'Severe abdominal pain', zh: '剧烈腹痛' }, value: 'pain', is_critical: true, tag: 'symptom:severe_abdominal_pain' }
        ]
      }
    ]
  },
  {
    id: 'bloating_indigestion',
    icd11: 'ME07',
    icd11_label: { en: 'Bloating / indigestion', zh: '胀气/消化不良' },
    name: { en: 'Bloating / indigestion', zh: '胀气/消化不良' },
    description: { en: 'Gas, fullness, dyspepsia-like symptoms; screen red flags.', zh: '胀气、饱胀、消化不良相关症状；筛查红旗征。' },
    icon: 'flame',
    group: 'digestive',
    popular: false,
    search_keywords: ['bloating', 'indigestion', 'gas', 'dyspepsia', '胀气', '消化不良', 'zq', 'xhbl', 'me07'],
    questions: [
      {
        id: 'bloating_pattern',
        category: 'diagnosis',
        text: { en: 'Which best describes your main issue?', zh: '哪项最符合你的主要困扰？' },
        type: 'choice',
        options: [
          { label: { en: 'Bloating / gas', zh: '胀气/打嗝放屁增多' }, value: 'gas', tag: 'symptom:bloating' },
          { label: { en: 'Upper abdominal fullness', zh: '上腹部饱胀' }, value: 'fullness', tag: 'symptom:fullness' },
          { label: { en: 'Nausea', zh: '恶心' }, value: 'nausea', tag: 'symptom:nausea' }
        ],
        next_question_id: 'bloating_red_flags'
      },
      {
        id: 'bloating_red_flags',
        category: 'screening',
        text: { en: 'Any of these red flags?', zh: '是否有以下任何危险信号？' },
        type: 'multi-choice',
        options: [
          { label: { en: 'Black / tarry stools', zh: '黑便/柏油样便' }, value: 'black', is_critical: true, tag: 'symptom:black_stool' },
          { label: { en: 'Unintentional weight loss', zh: '不明原因体重下降' }, value: 'weight', is_critical: true, tag: 'symptom:weight_loss' },
          { label: { en: 'Persistent vomiting', zh: '持续呕吐' }, value: 'vomit', is_critical: true, tag: 'symptom:persistent_vomiting' }
        ]
      }
    ]
  }
];

export const riskFactors: Question[] = [
  {
    id: 'risk_factors',
    text: { en: 'Do you have any of these conditions or situations?', zh: '您是否有以下任何情况或疾病？' },
    type: 'multi-choice',
    options: [
      { label: { en: 'Stomach Ulcers', zh: '胃溃疡' }, value: 'stomach_ulcer', tag: 'exclusion:stomach_ulcer' },
      { label: { en: 'Liver Disease', zh: '肝脏疾病' }, value: 'liver_disease', tag: 'exclusion:liver_disease' },
      { label: { en: 'Kidney Disease', zh: '肾脏疾病' }, value: 'kidney_disease', tag: 'exclusion:kidney_disease' },
      { label: { en: 'Heart Disease', zh: '心脏病' }, value: 'heart_disease', is_critical: true, tag: 'exclusion:heart_disease' },
      { label: { en: 'Glaucoma', zh: '青光眼' }, value: 'glaucoma', tag: 'exclusion:glaucoma' },
      { label: { en: 'Prostate enlargement (BPH)', zh: '前列腺肥大' }, value: 'bph', tag: 'exclusion:bph' },
      { label: { en: 'High Blood Pressure', zh: '高血压' }, value: 'hypertension', tag: 'exclusion:hypertension' },
      { label: { en: 'Pregnancy', zh: '孕期' }, value: 'pregnant', is_critical: true, tag: 'exclusion:pregnant' },
      { label: { en: 'Breastfeeding', zh: '哺乳期' }, value: 'breastfeeding', is_critical: true, tag: 'exclusion:breastfeeding' },
      { label: { en: 'Elderly (Age > 65)', zh: '老年人 (65岁以上)' }, value: 'elderly', tag: 'exclusion:elderly' },
      { label: { en: 'Child / Adolescent (Age < 18)', zh: '儿童 / 青少年 (18岁以下)' }, value: 'pediatric', is_critical: true, tag: 'exclusion:pediatric' },
      { label: { en: 'Asthma', zh: '哮喘' }, value: 'asthma', tag: 'exclusion:asthma' },
      { label: { en: 'Taking Warfarin / Aspirin (Anticoagulants)', zh: '正在服用华法林/阿司匹林（抗凝药）' }, value: 'anticoagulants', is_critical: true, tag: 'exclusion:warfarin' },
      { label: { en: 'Taking Sedatives / CNS Depressants', zh: '正在服用镇静剂/中枢神经抑制药' }, value: 'sedatives', is_critical: true, tag: 'exclusion:sedatives' },
      { label: { en: 'Allergy to Medication', zh: '药物过敏史' }, value: 'allergy', tag: 'exclusion:allergy' },
      { label: { en: 'None of the above', zh: '以上均无' }, value: 'none' }
    ]
  }
];
