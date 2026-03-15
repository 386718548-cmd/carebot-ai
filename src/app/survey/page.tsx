'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from '../../hooks/useI18n';
import { symptoms, Symptom, riskFactors } from '../../data/symptoms';
import { medicines } from '../../data/medicines';
import { matchDrugs, checkSafetyNet, detectRedFlags, MatchResult, RedFlagResult } from '../../lib/decision-engine';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowLeft, 
  Pill, 
  CheckCircle, 
  Sparkles, 
  Activity, 
  ShieldCheck,
  Stethoscope,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function SurveyPage() {
  const t = useTranslations('Survey');
  const mt = useTranslations('Medicines');
  const { locale } = useLocale();
  
  // Step types: 'disclaimer' | 'symptom_selection' | 'question' | 'risk_factors' | 'results'
  const [currentStep, setCurrentStep] = useState<'disclaimer' | 'symptom_selection' | 'question' | 'risk_factors' | 'results'>('disclaimer');
  const [selectedSymptomId, setSelectedSymptomId] = useState<string | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]); // To track the path for 'Back' button
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [redFlagResult, setRedFlagResult] = useState<RedFlagResult | null>(null);

  const selectedSymptom = symptoms.find((s: Symptom) => s.id === selectedSymptomId);
  
  // Get current question object
  const currentQuestion = useMemo(() => {
    if (currentStep === 'question' && selectedSymptom && currentQuestionId) {
      return selectedSymptom.questions.find(q => q.id === currentQuestionId);
    }
    if (currentStep === 'risk_factors') {
      return riskFactors[0];
    }
    return null;
  }, [currentStep, selectedSymptom, currentQuestionId]);

  // Extract tags from answers
  const currentTags = useMemo(() => {
    const symptomTags: string[] = [];
    const exclusionTags: string[] = [];
    const causeTags: string[] = [];
    const comorbidityTags: string[] = [];
    const historyTags: string[] = [];

    // All answers
    Object.entries(answers).forEach(([questionId, value]) => {
      // Find which question this answer belongs to
      let question = selectedSymptom?.questions.find(q => q.id === questionId);
      let isRisk = false;
      if (!question) {
        question = riskFactors.find(q => q.id === questionId);
        isRisk = true;
      }

      if (question && question.options) {
        const values = Array.isArray(value) ? value : [value];
        values.forEach(val => {
          const opt = question!.options!.find(o => o.value === val);
          if (opt?.tag) {
            if (isRisk) {
              exclusionTags.push(opt.tag);
            } else if (opt.tag.startsWith('cause:')) {
              causeTags.push(opt.tag);
            } else if (opt.tag.startsWith('comorbid:')) {
              comorbidityTags.push(opt.tag);
            } else if (opt.tag.startsWith('history:')) {
              historyTags.push(opt.tag);
            } else {
              symptomTags.push(opt.tag);
            }
          }
        });
      }
    });

    if (selectedSymptomId === 'headache' && !symptomTags.includes('symptom:headache')) {
      symptomTags.push('symptom:headache');
    }

    return { symptomTags, exclusionTags, causeTags, comorbidityTags, historyTags };
  }, [answers, selectedSymptom, selectedSymptomId]);

  const selectSymptom = (id: string) => {
    setSelectedSymptomId(id);
    setAnswers({});
    setHistory([]);
    setCurrentQuestionId(null);
  };

  const handleNext = () => {
    if (currentStep === 'disclaimer') {
      setCurrentStep('symptom_selection');
      return;
    }

    if (currentStep === 'symptom_selection' && selectedSymptomId) {
      const firstQuestionId = symptoms.find(s => s.id === selectedSymptomId)?.questions[0]?.id;
      if (firstQuestionId) {
        setCurrentQuestionId(firstQuestionId);
        setCurrentStep('question');
      }
      return;
    }

    // Check for critical flags in current answer
    if (currentQuestion) {
      const currentAnswer = answers[currentQuestion.id];
      const selectedOptions = currentQuestion.options?.filter(opt => 
        Array.isArray(currentAnswer) ? currentAnswer.includes(opt.value) : opt.value === currentAnswer
      ) || [];

      if (checkSafetyNet(selectedOptions)) {
        const redFlags = detectRedFlags(currentTags.symptomTags);
        setRedFlagResult(redFlags.isCritical ? redFlags : { isCritical: true, alerts: { en: ['Severe symptoms detected. Seek medical help.'], zh: ['检测到严重症状。请立即就医。'] } });
        return;
      }

      // Logic Tree: Find next question
      if (currentStep === 'question') {
        const lastSelectedOption = selectedOptions[selectedOptions.length - 1];
        const nextId = lastSelectedOption?.next_question_id;

        if (nextId) {
          setHistory([...history, currentQuestionId!]);
          setCurrentQuestionId(nextId);
        } else {
          // No next question in logic tree, check if there's a next one in the linear array
          const currentIndex = selectedSymptom!.questions.findIndex(q => q.id === currentQuestionId);
          if (currentIndex < selectedSymptom!.questions.length - 1) {
            setHistory([...history, currentQuestionId!]);
            setCurrentQuestionId(selectedSymptom!.questions[currentIndex + 1].id);
          } else {
            // End of questions, go to risk factors
            setHistory([...history, currentQuestionId!]);
            setCurrentStep('risk_factors');
          }
        }
      } else if (currentStep === 'risk_factors') {
        // Analyze and show results
        setIsAnalyzing(true);
        setTimeout(() => {
          // Extract current medications from answers
          const currentMeds: string[] = [];
          const riskAnswers = (answers['risk_factors'] as string[]) || [];
          if (Array.isArray(riskAnswers)) {
            if (riskAnswers.includes('anticoagulants')) currentMeds.push('Anticoagulants');
            if (riskAnswers.includes('sedatives')) currentMeds.push('CNS Depressants');
          }

          // Extract severity weights from answers
          const severityWeights: Record<string, number> = {};
          Object.entries(answers).forEach(([qId, val]) => {
            const question = selectedSymptom?.questions.find(q => q.id === qId);
            if (question && question.options) {
              const opt = question.options.find(o => o.value === val);
              if (opt?.tag && opt.severity_weight !== undefined) {
                severityWeights[opt.tag] = opt.severity_weight;
              }
            }
          });

          const matched = matchDrugs(
            currentTags.symptomTags, 
            currentTags.exclusionTags, 
            currentTags.causeTags,
            currentTags.comorbidityTags,
            currentMeds,
            currentTags.historyTags,
            medicines,
            severityWeights
          );
          setResults(matched);
          setIsAnalyzing(false);
          setCurrentStep('results');
        }, 2000);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'symptom_selection') {
      setCurrentStep('disclaimer');
    } else if (currentStep === 'question') {
      if (history.length > 0) {
        const prevId = history[history.length - 1];
        setCurrentQuestionId(prevId);
        setHistory(history.slice(0, -1));
      } else {
        setCurrentStep('symptom_selection');
      }
    } else if (currentStep === 'risk_factors') {
      setCurrentStep('question');
      setCurrentQuestionId(history[history.length - 1]);
      setHistory(history.slice(0, -1));
    }
  };

  const toggleOption = (questionId: string, value: string, isMulti: boolean) => {
    if (isMulti) {
      const current = (answers[questionId] as string[]) || [];
      const updated = current.includes(value) 
        ? current.filter(v => v !== value) 
        : [...current, value];
      setAnswers({ ...answers, [questionId]: updated });
    } else {
      setAnswers({ ...answers, [questionId]: value });
    }
  };

  if (redFlagResult?.isCritical) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-24 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-warm !border-orange-200 !bg-orange-50">
          <div className="w-24 h-24 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-orange-200">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-4xl font-black text-warm-900 mb-6 tracking-tight">
            {locale === 'zh' ? '建议立即就医' : 'Medical Attention Advised'}
          </h2>
          <div className="text-xl text-warm-800/70 font-medium mb-10 leading-relaxed max-w-2xl mx-auto space-y-4">
            {redFlagResult.alerts[locale].map((alert, i) => (
              <p key={i} className="text-orange-700 font-bold">⚠️ {alert}</p>
            ))}
            <p className="mt-6">
              {locale === 'zh' 
                ? '根据您的症状描述，这可能属于高风险情况。为了您的安全，我们建议您立即联系专业医生或前往急诊室，暂不推荐任何非处方药。' 
                : 'Based on your symptoms, this may be a high-risk situation. For your safety, we advise you to contact a healthcare professional or visit an emergency room immediately. We cannot recommend any OTC medications at this time.'}
            </p>
          </div>
          <Link href="/" className="btn-warm !bg-warm-900 flex items-center gap-3 w-fit mx-auto">
            <ArrowLeft size={24} />
            {locale === 'zh' ? '返回首页' : 'Back to Home'}
          </Link>
        </motion.div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-warm-50/30">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="relative w-40 h-40 mb-12">
          <div className="absolute inset-0 bg-warm-200/50 rounded-full blur-2xl"></div>
          <div className="absolute inset-0 border-[6px] border-warm-100 rounded-full"></div>
          <div className="absolute inset-0 border-[6px] border-warm-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="text-warm-500 fill-warm-500" size={48} />
          </div>
        </motion.div>
        <h2 className="text-5xl font-black text-warm-900 mb-6 tracking-tight">
          {locale === 'zh' ? '正在匹配药品...' : 'Matching Medicines...'}
        </h2>
        <p className="text-xl text-warm-800/50 font-medium max-w-md mx-auto leading-relaxed">
          {locale === 'zh' ? 'AI 正在应用药理规则并排除禁忌风险。' : 'AI is applying pharmacological rules and excluding contraindication risks.'}
        </p>
      </div>
    );
  }

  if (results) {
    // Get common advice from any result (they are identical as they come from global tags)
    const firstRes = results[0];
    const hasAdvice = firstRes?.lifestyleAdvice[locale].length > 0;
    const hasAlerts = firstRes?.comorbidityAlerts[locale].length > 0;

    return (
      <div className="max-w-6xl mx-auto px-8 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-black text-warm-900 tracking-tight leading-[1.1]">
              {results.length > 0 
                ? (locale === 'zh' ? <>匹配到 <span className="text-warm-500">{results.length}</span> 款建议</> : <>Found <span className="text-warm-500">{results.length}</span> Matches</>)
                : (locale === 'zh' ? '未找到完全匹配的药品' : 'No Direct Matches Found')}
            </h2>
            <p className="mt-6 text-xl text-warm-800/50 font-medium">
              {locale === 'zh' 
                ? '以下推荐基于临床指南与药品说明书，按匹配度与证据等级排序。' 
                : 'The following recommendations are based on clinical guidelines and drug labels, sorted by match score and evidence level.'}
            </p>
          </div>
          <Link href="/" className="btn-warm !bg-warm-900 flex items-center gap-3 w-fit shadow-2xl">
            <ArrowLeft size={24} />
            {locale === 'zh' ? '重新开始' : 'Start Over'}
          </Link>
        </div>

        {/* Professional Insights: Lifestyle & Comorbidity */}
        {(hasAdvice || hasAlerts) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {hasAdvice && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card-warm !bg-sage-50 !border-sage-100 !p-10">
                <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-3 text-sage-800">
                  <Sparkles size={20} />
                  {locale === 'zh' ? '生活方式建议' : 'Lifestyle Advice'}
                </h4>
                <ul className="space-y-4">
                  {firstRes.lifestyleAdvice[locale].map((adv, i) => (
                    <li key={i} className="text-lg text-sage-900/70 font-bold flex gap-3">
                      <span className="text-sage-400">•</span> {adv}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
            {hasAlerts && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="card-warm !bg-orange-50 !border-orange-100 !p-10">
                <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-3 text-orange-800">
                  <AlertTriangle size={20} />
                  {locale === 'zh' ? '共病风险提示' : 'Comorbidity Alerts'}
                </h4>
                <ul className="space-y-4">
                  {firstRes.comorbidityAlerts[locale].map((alt, i) => (
                    <li key={i} className="text-lg text-orange-900/70 font-bold flex gap-3">
                      <span className="text-orange-400">!</span> {alt}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {results.map((res) => (
              <motion.div key={res.medicine.id} className="card-warm !p-12 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-warm-50/50 rounded-full -z-10"></div>
                
                {/* Evidence Level & Match Details */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="px-3 py-1 bg-warm-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                    ATC: {res.medicine.atc_code}
                  </span>
                  {res.medicine.fda_otc_monograph && (
                    <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                      FDA OTC Monograph
                    </span>
                  )}
                  <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${
                    res.medicine.evidence_level === 'A' ? 'bg-sage-500 text-white' : 'bg-warm-200 text-warm-700'
                  }`}>
                    Evidence Level: {res.medicine.evidence_level}
                  </span>
                  <span className="px-3 py-1 bg-warm-50 text-warm-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-warm-100">
                    Confidence: {(res.score * 10).toFixed(0)}%
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12">
                  <div className="flex gap-8">
                    <div className="w-24 h-24 bg-warm-100 text-warm-600 rounded-[2.5rem] flex items-center justify-center">
                      <Pill size={48} />
                    </div>
                    <div>
                      <h3 className="text-4xl font-black text-warm-900 mb-1 tracking-tight">{res.medicine.name}</h3>
                      <p className="text-sm text-warm-400 font-bold mb-3 uppercase tracking-wider">{res.medicine.generic_name}</p>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-black px-3 py-1 rounded-full ${
                          res.riskLevel === 'low' ? 'text-sage-600 bg-sage-50' : 
                          res.riskLevel === 'moderate' ? 'text-orange-600 bg-orange-50' : 
                          'text-red-600 bg-red-50'
                        }`}>
                          Risk: {res.riskLevel.toUpperCase()}
                        </span>
                        <span className="text-xs font-black text-warm-600 bg-warm-50 px-3 py-1 rounded-full">
                          Match: {res.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-warm-900 text-white px-8 py-5 rounded-[2rem] text-center shadow-xl">
                    <div className="text-[10px] font-black text-warm-400 uppercase tracking-[0.3em] mb-2">{locale === 'zh' ? '参考价格' : 'Price Ref'}</div>
                    <div className="text-2xl font-black">{res.medicine.availability[0].currency} {res.medicine.availability[0].price}</div>
                  </div>
                </div>

                {/* FDA Warning Label */}
                {res.fdaLabel && (
                  <div className="mb-10 p-6 bg-blue-50/50 border-l-4 border-blue-500 rounded-r-3xl text-blue-900/70 text-sm font-bold italic leading-relaxed">
                    "{res.fdaLabel[locale]}"
                  </div>
                )}

                {/* Stepped Therapy Note */}
                {res.steppedTherapyNote && (
                  <div className="mb-10 p-6 bg-purple-50/50 border-l-4 border-purple-500 rounded-r-3xl text-purple-900/70 text-sm font-bold italic leading-relaxed">
                    <Sparkles size={16} className="inline mr-2" />
                    "{res.steppedTherapyNote[locale]}"
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-10">
                    <div>
                      <h4 className="font-black text-warm-900 uppercase text-xs tracking-[0.3em] mb-4 flex items-center gap-2">
                        <Sparkles size={14} className="text-warm-400" />
                        {mt('ingredients')}
                      </h4>
                      <p className="text-lg text-warm-800/60 font-medium">{res.medicine.active_ingredients.join(', ')}</p>
                    </div>

                    <div>
                      <h4 className="font-black text-warm-900 uppercase text-xs tracking-[0.3em] mb-4 flex items-center gap-2">
                        <Info size={14} className="text-warm-400" />
                        {locale === 'zh' ? '匹配证据' : 'Match Evidence'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {res.matchedTags.map(tag => {
                          const tagName = tag.split(':')[1].replace('_', ' ');
                          return (
                            <span key={tag} className="px-3 py-1 bg-sage-50 text-sage-700 rounded-lg text-xs font-bold capitalize">
                              ✓ {tagName}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {res.medicine.indications.structured.syndromeTypes && (
                      <div>
                        <h4 className="font-black text-warm-900 uppercase text-xs tracking-[0.3em] mb-4 flex items-center gap-2">
                          <Stethoscope size={14} className="text-warm-400" />
                          {locale === 'zh' ? '中医证型' : 'TCM Syndrome'}
                        </h4>
                        <p className="text-sm text-warm-800/60 font-bold">{res.medicine.indications.structured.syndromeTypes.join(', ')}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-8">
                    {/* Caution Warnings */}
                    {res.warnings[locale].length > 0 && (
                      <div className="bg-orange-50/50 p-8 rounded-[3rem] border border-orange-100/50">
                        <h4 className="font-black text-orange-800 uppercase text-[10px] tracking-[0.3em] mb-6 flex items-center gap-3">
                          <AlertTriangle size={18} /> {locale === 'zh' ? '用药警示' : 'Clinical Warnings'}
                        </h4>
                        <ul className="text-sm text-orange-900/60 space-y-3 font-bold">
                          {res.warnings[locale].map((w, i) => <li key={i}>• {w}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className="bg-warm-50/50 p-8 rounded-[3rem] border border-warm-100/50">
                      <h4 className="font-black text-warm-800 uppercase text-[10px] tracking-[0.3em] mb-6 flex items-center gap-3">
                        <CheckCircle size={18} /> {mt('dosage')}
                      </h4>
                      <p className="text-sm text-warm-900/60 font-bold leading-relaxed">{res.medicine.dosage[locale]}</p>
                    </div>

                    <div className="bg-warm-50/50 p-8 rounded-[3rem] border border-warm-100/50">
                      <h4 className="font-black text-warm-800 uppercase text-[10px] tracking-[0.3em] mb-6 flex items-center gap-3">
                        <Activity size={18} /> {mt('side_effects')}
                      </h4>
                      <ul className="text-sm text-warm-900/60 space-y-3 font-bold">
                        {res.medicine.side_effects[locale].map((s, i) => <li key={i}>• {s}</li>)}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                      <Link
                        href={`/medicines/${encodeURIComponent(res.medicine.id)}`}
                        className="btn-warm w-full flex items-center justify-center gap-2"
                      >
                        <Pill size={20} />
                        {locale === 'zh' ? '打开大字版说明书' : 'Open Large-Print Guide'}
                      </Link>
                      <button className="btn-sage w-full flex items-center justify-center gap-2">
                        <ShoppingBag size={20} />
                        {locale === 'zh' ? '查找最近药店' : 'Find Nearest Pharmacy'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* References Section */}
                <div className="mt-12 pt-8 border-t border-warm-100">
                   <h4 className="font-black text-warm-900 uppercase text-[10px] tracking-[0.3em] mb-4">
                    {locale === 'zh' ? '临床依据' : 'Clinical References'}
                  </h4>
                  <ul className="text-[10px] text-warm-400 font-medium space-y-1">
                    {res.medicine.references.map((ref, i) => <li key={i}>[{i+1}] {ref}</li>)}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="space-y-12">
            <div className="card-warm !bg-warm-900 text-white !p-10">
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <ShieldCheck size={20} className="text-warm-400" />
                {locale === 'zh' ? '安全提示' : 'Safety Check'}
              </h4>
              <p className="text-lg text-warm-100/70 font-medium mb-10 italic">"{t('safety_warning')}"</p>
              <div className="p-6 bg-warm-800/50 rounded-3xl border border-warm-700/50 text-warm-300 text-xs leading-relaxed font-bold">
                {locale === 'zh' 
                  ? '本系统已集成 ICD-11 与 SNOMED CT 标准，匹配逻辑严格遵循国家药典。若出现过敏反应请立即停药。' 
                  : 'Integrated with ICD-11 & SNOMED CT standards. Logic strictly follows pharmacopoeia. Discontinue use if allergic reactions occur.'}
              </div>
            </div>

            <div className="card-warm !bg-orange-50 !border-orange-100 !p-10">
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-3 text-orange-800">
                <AlertCircle size={20} />
                {locale === 'zh' ? '何时就医' : 'When to see a Doctor'}
              </h4>
              <ul className="text-sm text-orange-900/60 space-y-4 font-bold">
                {locale === 'zh' ? (
                  <>
                    <li>• 症状持续超过一周未缓解</li>
                    <li>• 出现呼吸困难或严重皮疹</li>
                    <li>• 伴有 39°C 以上持续高热</li>
                    <li>• 出现神志不清或剧烈呕吐</li>
                  </>
                ) : (
                  <>
                    <li>• Symptoms persist for over a week</li>
                    <li>• Difficulty breathing or severe rash</li>
                    <li>• Persistent high fever over 39°C</li>
                    <li>• Confusion or severe vomiting</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-20 min-h-[85vh] flex flex-col">
      {currentStep === 'disclaimer' ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-warm !p-20 text-center">
          <div className="w-24 h-24 bg-warm-100 text-warm-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10">
            <ShieldCheck size={48} />
          </div>
          <h2 className="text-5xl font-black text-warm-900 mb-8 tracking-tight">{locale === 'zh' ? '临床决策支持系统 (CDSS)' : 'Clinical Decision Support System'}</h2>
          <p className="text-2xl text-warm-800/50 font-medium mb-12 leading-relaxed">
            {locale === 'zh' 
              ? '本系统已升级至医疗级标准，集成 ICD-11、ATC 及 SNOMED CT 国际规范。推荐结果基于权威指南，仅供自用参考，不替代医生诊断。' 
              : 'Upgraded to medical-grade standards, integrating ICD-11, ATC, and SNOMED CT. Recommendations are based on authoritative guidelines for reference only.'}
          </p>
          <button onClick={handleNext} className="btn-warm shadow-2xl min-w-[250px] text-xl">
            {locale === 'zh' ? '同意并开始' : 'Agree & Start'}
          </button>
        </motion.div>
      ) : (
        <>
          <div className="mb-16">
            <div className="flex justify-between items-end mb-10">
              <div className="flex flex-col gap-4">
                <div className="badge-warm">
                  {currentStep === 'symptom_selection' ? 'Step 1: Focus' : 
                   currentStep === 'question' ? `Step 2: Diagnosis` : 
                   'Step 3: Risk Filter'}
                </div>
                <h2 className="text-5xl font-black text-warm-900 tracking-tight">
                  {currentStep === 'symptom_selection' ? (locale === 'zh' ? '选择主诉症状' : 'Select Primary Symptom') : 
                   currentStep === 'risk_factors' ? (locale === 'zh' ? '禁忌与风险排除' : 'Risk & Exclusion') :
                   selectedSymptom?.name[locale]}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex-1 card-warm !p-12 md:!p-20 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep === 'question' ? currentQuestionId : currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="h-full flex flex-col">
                {currentStep === 'symptom_selection' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {symptoms.map((s) => (
                      <button key={s.id} onClick={() => selectSymptom(s.id)} className={`p-10 text-left rounded-[3.5rem] border-4 transition-all flex flex-col gap-6 relative ${selectedSymptomId === s.id ? 'border-warm-500 bg-warm-50 shadow-2xl' : 'border-warm-50 hover:border-warm-200'}`}>
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${selectedSymptomId === s.id ? 'bg-warm-500 text-white' : 'bg-warm-100 text-warm-300'}`}>
                          <Stethoscope size={32} />
                        </div>
                        <h4 className="font-black text-2xl text-warm-900">{s.name[locale]}</h4>
                        <div className="text-[10px] font-black text-warm-400 uppercase tracking-widest">
                          ICD-11: {s.icd11}
                        </div>
                        {selectedSymptomId === s.id && <CheckCircle2 className="absolute top-8 right-8 text-warm-500" size={36} />}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-16">
                    <div className="space-y-4">
                      <h3 className="text-5xl font-black text-warm-900 leading-tight">
                        {currentQuestion?.text[locale]}
                      </h3>
                      {currentQuestion?.type === 'multi-choice' && (
                        <p className="text-warm-400 font-bold uppercase tracking-widest text-xs">
                          {locale === 'zh' ? '(多选题)' : '(Select Multiple)'}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 max-w-2xl">
                      {currentQuestion?.options?.map((opt: any) => {
                        const isSelected = Array.isArray(answers[currentQuestion.id]) 
                          ? (answers[currentQuestion.id] as string[]).includes(opt.value)
                          : answers[currentQuestion.id] === opt.value;

                        return (
                          <button key={opt.value} onClick={() => toggleOption(currentQuestion.id, opt.value, currentQuestion.type === 'multi-choice')} className={`p-10 text-left rounded-[3rem] border-4 transition-all flex items-center justify-between ${isSelected ? 'border-warm-500 bg-warm-50 shadow-xl' : 'border-warm-50 hover:border-warm-200'}`}>
                            <span className="text-2xl font-black text-warm-800">{opt.label[locale]}</span>
                            <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center ${isSelected ? 'border-warm-500 bg-warm-500 text-white shadow-lg' : 'border-warm-100'}`}>
                              {isSelected && <CheckCircle2 size={24} />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-16 flex items-center justify-between px-6">
            <button onClick={handleBack} className="flex items-center gap-3 text-warm-300 font-black uppercase text-sm tracking-[0.3em] hover:text-warm-900 transition-all">
              <ChevronLeft size={28} /> {t('previous')}
            </button>
            <button 
              onClick={handleNext} 
              disabled={
                currentStep === 'symptom_selection' ? !selectedSymptomId : 
                (currentQuestion?.type === 'multi-choice' 
                  ? !(answers[currentQuestion.id]?.length > 0) 
                  : !answers[currentQuestion?.id || ''])
              } 
              className="btn-warm min-w-[220px] text-xl shadow-2xl"
            >
              {currentStep === 'risk_factors' ? t('finish') : t('next')} <ChevronRight size={28} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
