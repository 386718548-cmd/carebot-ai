// Enhanced red flag detection module
export interface RedFlagResult {
  isCritical: boolean;
  alerts: {
    en: string[];
    zh: string[];
  };
}

export function detectRedFlagsEnhanced(selectedTags: string[]): RedFlagResult {
  const alertsEn: string[] = [];
  const alertsZh: string[] = [];
  const tagSet = new Set(selectedTags);
  
  // Single symptom red flags
  const redFlagMappings: Record<string, { en: string; zh: string }> = {
    'symptom:thunderclap': { en: '🚨 CRITICAL: Sudden "Thunderclap" headache - Seek immediate emergency care.', zh: '🚨 严重警告：突然发作的"霹雳样"剧痛 - 请立即就医急诊。' },
    'symptom:stiff_neck': { en: '🚨 WARNING: Fever with stiff neck - Possible meningitis, seek emergency care.', zh: '🚨 警告：发烧伴脖子僵硬 - 可能为脑膜炎，请立即就医。' },
    'symptom:stroke_signs': { en: '🚨 CRITICAL: Neurologic deficits (weakness/slurred speech) - Seek emergency care.', zh: '🚨 严重警告：神经系统体征（无力/言语不清）- 请立即就医急诊。' },
    'symptom:saddle_anesthesia': { en: '🚨 CRITICAL: Saddle anesthesia - Possible Cauda Equina Syndrome, seek emergency care.', zh: '🚨 严重警告：会阴部（马鞍区）麻木 - 可能为马尾综合征，请立即就医。' },
    'symptom:sphincter_dysfunction': { en: '🚨 CRITICAL: Difficulty urinating/defecating with back pain - Seek emergency care.', zh: '🚨 严重警告：腰痛伴排尿或排便困难 - 请立即就医。' },
    'symptom:leg_weakness': { en: '⚠️ WARNING: Leg weakness/foot drop requires urgent clinical evaluation.', zh: '⚠️ 警告：下肢无力/足下垂 - 需要紧急临床评估，请就医。' },
    'symptom:weight_loss': { en: '⚠️ WARNING: Unexplained weight loss needs clinical evaluation.', zh: '⚠️ 警告：不明原因体重减轻 - 需要临床评估，请就医。' },
    'symptom:dysphagia': { en: '⚠️ WARNING: Difficulty swallowing requires clinical evaluation.', zh: '⚠️ 警告：吞咽困难 - 需要临床评估，请就医。' },
    'symptom:black_stool': { en: '🚨 CRITICAL: Black/tarry stools - Possible GI bleeding, seek medical attention immediately.', zh: '🚨 严重警告：黑便/柏油样便 - 可能胃肠道出血，请立即就医。' },
    'symptom:persistent_vomiting': { en: '⚠️ WARNING: Persistent vomiting requires urgent clinical evaluation.', zh: '⚠️ 警告：持续呕吐 - 需要紧急临床评估，请就医。' },
    'symptom:anemia_weight_loss': { en: '⚠️ WARNING: Anemia/weight loss needs further evaluation.', zh: '⚠️ 警告：贫血/体重减轻 - 需要进一步评估，请就医。' },
    'symptom:breathless': { en: '🚨 CRITICAL: Shortness of breath - Seek medical attention immediately.', zh: '🚨 严重警告：呼吸困难 - 请立即就医。' },
    'symptom:haemoptysis': { en: '🚨 CRITICAL: Coughing up blood requires urgent clinical evaluation.', zh: '🚨 严重警告：咯血 - 需要紧急临床评估，请就医。' },
    'symptom:chest_pain': { en: '🚨 CRITICAL: Severe chest pain - Seek emergency care immediately.', zh: '🚨 严重警告：剧烈胸痛 - 请立即就医急诊。' },
    'symptom:high_fever': { en: '⚠️ WARNING: Persistent high fever (>39°C) - Consult a doctor.', zh: '⚠️ 警告：持续高烧 (>39°C) - 请咨询医生。' },
    'symptom:hoarseness': { en: '⚠️ WARNING: Hoarseness >2 weeks needs clinical evaluation.', zh: '⚠️ 警告：声音嘶哑超过 2 周 - 需要临床评估，请就医。' },
  };

  // Single tag checks
  selectedTags.forEach(tag => {
    if (redFlagMappings[tag]) {
      const alert = redFlagMappings[tag];
      alertsEn.push(alert.en);
      alertsZh.push(alert.zh);
    }
  });

  // CRITICAL combined symptom checks with highest priority
  // Meningitis triad: headache + fever + stiff neck
  if (tagSet.has('symptom:headache') && tagSet.has('symptom:high_fever') && tagSet.has('symptom:stiff_neck')) {
    if (!alertsEn.some(a => a.includes('meningitis'))) {
      alertsEn.unshift('🚨 CRITICAL: Headache + high fever + stiff neck = POSSIBLE MENINGITIS. GO TO EMERGENCY ROOM NOW. This is life-threatening.');
      alertsZh.unshift('🚨 严重警告：头痛 + 高烧 + 脖子僵硬 = 可能脑膜炎。请立即前往急诊室。这是生命威胁性疾病。');
    }
  }

  // Cauda Equina Syndrome: back pain + leg weakness + sphincter problems
  if (tagSet.has('symptom:back_pain') && tagSet.has('symptom:leg_weakness') && tagSet.has('symptom:sphincter_dysfunction')) {
    if (!alertsEn.some(a => a.includes('Cauda Equina'))) {
      alertsEn.unshift('🚨 CRITICAL: Back pain + leg weakness + urinary/bowel dysfunction = SUSPECTED CAUDA EQUINA SYNDROME. SEEK EMERGENCY CARE IMMEDIATELY. Delayed treatment can cause permanent paralysis.');
      alertsZh.unshift('🚨 严重警告：腰痛 + 下肢无力 + 排尿/排便困难 = 疑似马尾综合征。请立即就医。延迟治疗可导致永久瘫痪。');
    }
  }

  // Acute coronary syndrome: chest pain + shortness of breath
  if (tagSet.has('symptom:chest_pain') && tagSet.has('symptom:breathless')) {
    alertsEn.unshift('🚨 CRITICAL: Chest pain with shortness of breath = POSSIBLE HEART ATTACK OR ACUTE CORONARY SYNDROME. CALL EMERGENCY 911 (or 120 in China) IMMEDIATELY.');
    alertsZh.unshift('🚨 严重警告：胸痛伴呼吸困难 = 可能心脏病发作或急性冠脉综合征。请立即拨打999/120。');
  }

  // Severe respiratory infection: cough + hemoptysis + dyspnea
  if (tagSet.has('symptom:cough') && tagSet.has('symptom:haemoptysis') && (tagSet.has('symptom:breathless') || tagSet.has('symptom:chest_pain'))) {
    alertsEn.push('🚨 WARNING: Cough + coughing blood + breathing difficulty = SERIOUS. Requires urgent evaluation for pneumonia, tuberculosis, or lung disease.');
    alertsZh.push('🚨 警告：咳嗽 + 咯血 + 呼吸困难 = 严重情况。需紧急评估排除肺炎、结核或肺病。');
  }

  // Acute GI bleed: GI symptoms + bloody stools + vomiting
  if (tagSet.has('symptom:gerd') || tagSet.has('symptom:digestive')) {
    if ((tagSet.has('symptom:black_stool') || tagSet.has('symptom:persistent_vomiting'))) {
      alertsEn.push('🚨 WARNING: GI symptoms with severe bleeding signs = POSSIBLE ACUTE BLEEDING. Seek emergency medical care.');
      alertsZh.push('🚨 警告：消化道症状伴严重出血表现 = 可能急性出血。请立即就医。');
    }
  }

  // Neurological emergency: multiple neuro deficits
  if ((tagSet.has('symptom:stroke_signs') && tagSet.has('symptom:unconscious')) || 
      (tagSet.has('symptom:stroke_signs') && tagSet.has('symptom:thunderclap'))) {
    alertsEn.unshift('🚨 CRITICAL: Multiple neurologic deficits indicate POSSIBLE STROKE OR INTRACRANIAL EVENT. CALL EMERGENCY 911 (or 120 in China) IMMEDIATELY.');
    alertsZh.unshift('🚨 严重警告：多个神经学体征提示可能脑卒中或颅内事件。请立即拨打999/120。');
  }

  // High fever + altered mental status
  if (tagSet.has('symptom:high_fever') && (tagSet.has('symptom:stroke_signs') || tagSet.has('symptom:confusion'))) {
    alertsEn.push('🚨 WARNING: High fever with altered mental status = SERIOUS SYSTEMIC INFECTION. Urgent hospitalization may be needed.');
    alertsZh.push('🚨 警告：高烧伴意识改变 = 严重全身感染。可能需要住院治疗。');
  }

  // Remove exact duplicates but keep variant wordings
  const seen = new Set<string>();
  const uniqueAlertsEn = alertsEn.filter(alert => {
    const key = alert.substring(0, 50); // Use first 50 chars as key
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  seen.clear();
  const uniqueAlertsZh = alertsZh.filter(alert => {
    const key = alert.substring(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    isCritical: uniqueAlertsEn.length > 0,
    alerts: {
      en: uniqueAlertsEn,
      zh: uniqueAlertsZh
    }
  };
}
