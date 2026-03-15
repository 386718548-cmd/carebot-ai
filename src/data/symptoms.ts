export interface Symptom {
  id: string;
  icd10?: string;
  icd11?: string;
  snomed_ct?: string;
  name: {
    en: string;
    zh: string;
  };
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
    snomed_ct: '248218005',
    name: { en: 'Insomnia', zh: '失眠症' },
    questions: [
      {
        id: 'primary_complaint',
        category: 'diagnosis',
        text: { en: 'What is your primary sleep concern?', zh: '您最主要的困扰是？' },
        type: 'choice',
        options: [
          { label: { en: 'Difficulty falling asleep', zh: '难以入睡' }, value: 'falling', tag: 'symptom:falling_asleep', next_question_id: 'falling_latency' },
          { label: { en: 'Difficulty maintaining sleep', zh: '睡眠维持困难' }, value: 'maintaining', tag: 'symptom:frequent_waking', next_question_id: 'waking_frequency' },
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
          { label: { en: 'Palpitations / Anxiety', zh: '心悸不安' }, value: 'heart', tag: 'symptom:palpitations' }
        ]
      }
    ]
  },
  {
    id: 'headache',
    icd11: '8A80',
    snomed_ct: '25064002',
    name: { en: 'Headache', zh: '头痛' },
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
    icd11: 'ME84.2',
    snomed_ct: '161891005',
    name: { en: 'Low Back Pain', zh: '腰背痛' },
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
    icd11: 'DD90',
    snomed_ct: '60731008',
    name: { en: 'Digestive Issues', zh: '消化系统问题' },
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
    id: 'allergy',
    icd11: '4A80',
    snomed_ct: '418634005',
    name: { en: 'Allergy & Skin', zh: '过敏与皮肤' },
    questions: [
      {
        id: 'allergy_type',
        category: 'diagnosis',
        text: { en: 'What are you experiencing?', zh: '您的主要困扰是？' },
        type: 'choice',
        options: [
          { label: { en: 'Sneezing / Runny Nose / Itchy Eyes', zh: '打喷嚏 / 流鼻涕 / 眼睛痒' }, value: 'rhinitis', tag: 'symptom:rhinitis', next_question_id: 'rhinitis_severity' },
          { label: { en: 'Raised Red Welts / Itchy Skin', zh: '红色风团 / 皮肤剧痒' }, value: 'urticaria', tag: 'symptom:urticaria', next_question_id: 'urticaria_duration' }
        ]
      },
      {
        id: 'rhinitis_severity',
        category: 'diagnosis',
        text: { en: 'Symptom severity and persistence:', zh: '症状严重度及持续性：' },
        type: 'choice',
        options: [
          { label: { en: 'Mild / Intermittent', zh: '轻中度 / 间歇性' }, value: 'mild_intermittent', tag: 'symptom:mild_rhinitis' },
          { label: { en: 'Moderate-Severe / Persistent', zh: '中重度 / 持续性' }, value: 'severe_persistent', tag: 'symptom:severe_rhinitis' }
        ],
        next_question_id: 'previous_treatment'
      },
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
    id: 'cold',
    icd11: '1B70',
    snomed_ct: '82272006',
    name: { en: 'Common Cold & Cough', zh: '感冒与咳嗽' },
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
      { label: { en: 'Glaucoma', zh: '青光眼' }, value: 'glaucoma', tag: 'exclusion:glaucoma' },
      { label: { en: 'High Blood Pressure', zh: '高血压' }, value: 'hypertension', tag: 'exclusion:hypertension' },
      { label: { en: 'Pregnancy / Breastfeeding', zh: '孕期 / 哺乳期' }, value: 'pregnant', tag: 'exclusion:pregnant' },
      { label: { en: 'Elderly (Age > 65)', zh: '老年人 (65岁以上)' }, value: 'elderly', tag: 'exclusion:elderly' },
      { label: { en: 'Child / Adolescent (Age < 18)', zh: '儿童 / 青少年 (18岁以下)' }, value: 'pediatric', tag: 'exclusion:pediatric' },
      { label: { en: 'Asthma', zh: '哮喘' }, value: 'asthma', tag: 'exclusion:asthma' },
      { label: { en: 'Taking Warfarin / Aspirin (Anticoagulants)', zh: '正在服用华法林/阿司匹林（抗凝药）' }, value: 'anticoagulants', tag: 'exclusion:warfarin' },
      { label: { en: 'Taking Sedatives / CNS Depressants', zh: '正在服用镇静剂/中枢神经抑制药' }, value: 'sedatives', tag: 'exclusion:sedatives' },
      { label: { en: 'Allergy to Medication', zh: '药物过敏史' }, value: 'allergy', tag: 'exclusion:allergy' },
      { label: { en: 'None of the above', zh: '以上均无' }, value: 'none' }
    ]
  }
];
