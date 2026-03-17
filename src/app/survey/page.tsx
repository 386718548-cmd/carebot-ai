'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations, useLocale } from '../../hooks/useI18n';
import { symptoms, Symptom, riskFactors } from '../../data/symptoms';
import { medicines } from '../../data/medicines';
import { matchDrugs, checkSafetyNet, detectRedFlags, MatchResult, RedFlagResult } from '../../lib/decision-engine';
import { openNearbyInMaps } from '@/lib/nearby';
import { useRouter } from 'next/navigation';
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
  BedDouble,
  Brain,
  Bone,
  Wind,
  Flame,
  Flower2,
  Droplets,
  Eye,
  Ear,
  Leaf,
  Heart,
  Mic,
  AlertCircle,
  MapPin,
  Hospital
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/* ── Reference URL lookup ── */
const REFERENCE_URLS: Record<string, string> = {
  'AHS Guidelines 2025': 'https://americanheadachesociety.org/resources/guidelines/',
  'VA/DoD Headache Guide': 'https://www.healthquality.va.gov/guidelines/Pain/headache/',
  'VA/DoD Headache Management Guideline 2023': 'https://www.healthquality.va.gov/guidelines/Pain/headache/',
  'Low Back Pain Review 2024': 'https://www.ncbi.nlm.nih.gov/books/NBK279468/',
  'GERD Guidelines Consensus 2023': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9840072/',
  'GERD Management Guidelines 2023': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9840072/',
  'APAC FD Guideline 2023': 'https://www.worldgastroenterology.org/guidelines/functional-dyspepsia',
  'SIAIP Rhinitis Consensus 2024': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10960128/',
  'Urticaria Guide 2025': 'https://www.eaaci.org/resources/guidelines/urticaria/',
  'Urticaria Treatment Guidelines 2023': 'https://www.eaaci.org/resources/guidelines/urticaria/',
  'ACCP Cough Guidelines': 'https://www.chestnet.org/Guidelines-and-Resources/Guidelines-and-Consensus-Statements/Cough',
  'FDA Approved Drug Label': 'https://www.accessdata.fda.gov/scripts/cder/daf/',
  'FDA Approved Label': 'https://www.accessdata.fda.gov/scripts/cder/daf/',
  'WHO Model List of Essential Medicines': 'https://www.who.int/publications/i/item/WHO-MHP-HPS-EML-2023.02',
  'INSOMNIA_2025': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10503965/',
  'Clinical Guidelines for TCM Treatment of Insomnia': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8521272/',
  'European Herbal Pharmacopoeia': 'https://www.edqm.eu/en/european-pharmacopoeia-ph-eur-11th-edition',
  'Magnesium and Sleep Review 2023': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9542499/',
  'Sleep Medicine Reviews': 'https://www.sciencedirect.com/journal/sleep-medicine-reviews',
  'L-Theanine and Sleep Quality 2024': 'https://pubmed.ncbi.nlm.nih.gov/37832496/',
  'Headache Guidelines 2023': 'https://americanheadachesociety.org/resources/guidelines/',
  'NSAID Efficacy Comparison 2023': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9840072/',
  'Pain Management Guidelines': 'https://www.who.int/publications/i/item/9789241548397',
  'Allergic Rhinitis Management 2023': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10960128/',
  'Intranasal Corticosteroid Guidelines': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10960128/',
  'Back Pain Management Guidelines 2023': 'https://www.ncbi.nlm.nih.gov/books/NBK279468/',
  'PPI Efficacy Studies': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9840072/',
  'Antacid Use Guidelines': 'https://www.worldgastroenterology.org/guidelines/functional-dyspepsia',
};

export default function SurveyPage() {
  const t = useTranslations('Survey');
  const mt = useTranslations('Medicines');
  const { locale } = useLocale();
  const router = useRouter();
  
  // Step types: 'disclaimer' | 'symptom_selection' | 'question' | 'risk_factors' | 'results'
  const [currentStep, setCurrentStep] = useState<'disclaimer' | 'symptom_selection' | 'question' | 'risk_factors' | 'results'>('disclaimer');
  const [selectedSymptomId, setSelectedSymptomId] = useState<string | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]); // To track the path for 'Back' button
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [redFlagResult, setRedFlagResult] = useState<RedFlagResult | null>(null);
  const [isOpeningMap, setIsOpeningMap] = useState(false);
  const [symptomQuery, setSymptomQuery] = useState('');
  const [showAllSymptoms, setShowAllSymptoms] = useState(false);
  const [showNotSure, setShowNotSure] = useState(false);
  const [groupFilter, setGroupFilter] = useState<Symptom['group'] | null>(null);
  const appliedUrlSymptomRef = useRef<string | null>(null);
  const [urlSymptom, setUrlSymptom] = useState<string | null>(null);

  const selectedSymptom = symptoms.find((s: Symptom) => s.id === selectedSymptomId);

  useEffect(() => {
    const read = () => {
      const v = (new URLSearchParams(window.location.search).get('symptom') || '').trim();
      setUrlSymptom(v || null);
    };
    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);

  useEffect(() => {
    if (!urlSymptom) return;
    if (appliedUrlSymptomRef.current === urlSymptom) return;
    const target = symptoms.find((s) => s.id === urlSymptom);
    if (!target) return;

    appliedUrlSymptomRef.current = urlSymptom;
    setSelectedSymptomId(target.id);
    setAnswers({});
    setHistory([]);
    setResults(null);
    setRedFlagResult(null);

    const firstQuestionId = target.questions[0]?.id;
    if (firstQuestionId) {
      setCurrentQuestionId(firstQuestionId);
      setCurrentStep('question');
    } else {
      setCurrentStep('symptom_selection');
    }
  }, [urlSymptom]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasParam = (new URLSearchParams(window.location.search).get('symptom') || '').trim().length > 0;
    if (hasParam) return;
    if (selectedSymptomId) return;
    const last = window.sessionStorage.getItem('last_symptom_id') || '';
    if (!last) return;
    if (!symptoms.some((s) => s.id === last)) return;
    setSelectedSymptomId(last);
  }, [selectedSymptomId]);
  
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
    if (typeof window !== 'undefined') window.sessionStorage.setItem('last_symptom_id', id);
    setAnswers({});
    setHistory([]);
    setCurrentQuestionId(null);
  };

  const filteredSymptoms = useMemo(() => {
    const q = symptomQuery.trim().toLowerCase();
    const list = symptoms;
    if (!q) return list;
    return list.filter((s) => {
      const name = (s.name[locale] || '').toLowerCase();
      const desc = (s.description?.[locale] || '').toLowerCase();
      const icd = (s.icd11 || '').toLowerCase();
      const kw = (s.search_keywords || []).join(' ').toLowerCase();
      return name.includes(q) || desc.includes(q) || icd.includes(q) || kw.includes(q);
    });
  }, [symptomQuery, locale]);

  const medicineSuggestions = useMemo(() => {
    const q = symptomQuery.trim().toLowerCase();
    if (!q) return [];
    const matches = medicines.filter((m) => {
      const hay = [m.name, m.generic_name, ...(m.aliases || [])].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
    return matches.slice(0, 3);
  }, [symptomQuery]);

  const groupedSymptoms = useMemo(() => {
    const groupOrder: Array<{ key: Symptom['group']; label: { zh: string; en: string } }> = [
      { key: 'sleep', label: { zh: '睡眠', en: 'Sleep' } },
      { key: 'neurology', label: { zh: '头部/神经', en: 'Head & Neuro' } },
      { key: 'respiratory', label: { zh: '呼吸', en: 'Respiratory' } },
      { key: 'digestive', label: { zh: '消化', en: 'Digestive' } },
      { key: 'musculoskeletal', label: { zh: '肌肉骨骼', en: 'Musculoskeletal' } },
      { key: 'allergy', label: { zh: '过敏', en: 'Allergy' } },
      { key: 'skin', label: { zh: '皮肤', en: 'Skin' } },
      { key: 'women', label: { zh: '女性健康', en: "Women's Health" } },
      { key: 'oral_throat', label: { zh: '口腔/咽喉', en: 'Oral & Throat' } },
      { key: 'eye', label: { zh: '眼部', en: 'Eye' } },
      { key: 'ear', label: { zh: '耳部', en: 'Ear' } },
      { key: 'urinary', label: { zh: '泌尿', en: 'Urinary' } }
    ];

    const groups = new Map<string, Symptom[]>();
    for (const s of symptoms) {
      const key = s.group || 'other';
      const list = groups.get(key) || [];
      list.push(s);
      groups.set(key, list);
    }

    return groupOrder
      .map((g) => ({
        key: g.key,
        label: g.label,
        items: (groups.get(g.key || 'other') || []).slice().sort((a, b) => Number(!!b.popular) - Number(!!a.popular))
      }))
      .filter((g) => g.items.length > 0);
  }, []);

  const SymptomIcon = ({ symptom }: { symptom: Symptom }) => {
    const commonProps = { size: 32 };
    switch (symptom.icon) {
      case 'bed':
        return <BedDouble {...commonProps} />;
      case 'brain':
        return <Brain {...commonProps} />;
      case 'bone':
        return <Bone {...commonProps} />;
      case 'lungs':
        return <Wind {...commonProps} />;
      case 'flame':
        return <Flame {...commonProps} />;
      case 'flower':
        return <Flower2 {...commonProps} />;
      case 'hives':
        return <Sparkles {...commonProps} />;
      case 'droplets':
        return <Droplets {...commonProps} />;
      case 'eye':
        return <Eye {...commonProps} />;
      case 'ear':
        return <Ear {...commonProps} />;
      case 'leaf':
        return <Leaf {...commonProps} />;
      case 'heart':
        return <Heart {...commonProps} />;
      case 'mic':
        return <Mic {...commonProps} />;
      default:
        return <Stethoscope {...commonProps} />;
    }
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
          try {
            if (typeof window !== 'undefined') {
              window.sessionStorage.setItem(
                'carebot_last_results',
                JSON.stringify({ createdAt: Date.now(), symptomId: selectedSymptomId, results: matched })
              );
            }
          } finally {
            router.push('/results');
          }
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

  const advanceFromChoice = (questionId: string, opt: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: opt.value }));
    if (currentStep !== 'question') return;
    if (!selectedSymptom || !currentQuestionId) return;

    if (checkSafetyNet([opt])) {
      const redFlags = detectRedFlags([opt.tag].filter(Boolean));
      setRedFlagResult(
        redFlags.isCritical
          ? redFlags
          : { isCritical: true, alerts: { en: ['Severe symptoms detected. Seek medical help.'], zh: ['检测到严重症状。请立即就医。'] } }
      );
      return;
    }

    const question = selectedSymptom.questions.find((q) => q.id === currentQuestionId);
    const nextId = opt.next_question_id || question?.next_question_id;
    if (nextId) {
      setHistory((prev) => [...prev, currentQuestionId]);
      setCurrentQuestionId(nextId);
      return;
    }

    const currentIndex = selectedSymptom.questions.findIndex((q) => q.id === currentQuestionId);
    if (currentIndex >= 0 && currentIndex < selectedSymptom.questions.length - 1) {
      setHistory((prev) => [...prev, currentQuestionId]);
      setCurrentQuestionId(selectedSymptom.questions[currentIndex + 1].id);
      return;
    }

    setHistory((prev) => [...prev, currentQuestionId]);
    setCurrentStep('risk_factors');
  };

  const toggleOption = (questionId: string, value: string, isMulti: boolean) => {
    if (isMulti) {
      const current = (answers[questionId] as string[]) || [];
      const updated = current.includes(value) 
        ? current.filter(v => v !== value) 
        : [...current, value];
      setAnswers((prev) => ({ ...prev, [questionId]: updated }));
    } else {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  if (redFlagResult?.isCritical) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-24 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-yellow !border-orange-200 !bg-orange-50">
          <div className="w-24 h-24 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-orange-200">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-4xl font-black text-ink mb-6 tracking-tight">
            {locale === 'zh' ? '建议立即就医' : 'Medical Attention Advised'}
          </h2>
          <div className="text-xl text-ink/70 font-medium mb-10 leading-relaxed max-w-2xl mx-auto space-y-4">
            {redFlagResult.alerts[locale].map((alert, i) => (
              <p key={i} className="text-orange-700 font-bold">⚠️ {alert}</p>
            ))}
            <p className="mt-6">
              {locale === 'zh' 
                ? '根据您的症状描述，这可能属于高风险情况。为了您的安全，我们建议您立即联系专业医生或前往急诊室，暂不推荐任何非处方药。' 
                : 'Based on your symptoms, this may be a high-risk situation. For your safety, we advise you to contact a healthcare professional or visit an emergency room immediately. We cannot recommend any OTC medications at this time.'}
            </p>
          </div>
          <Link href="/" className="btn-primary flex items-center gap-3 w-fit mx-auto">
            <ArrowLeft size={24} />
            {locale === 'zh' ? '返回首页' : 'Back to Home'}
          </Link>
          <button
            onClick={async () => {
              if (isOpeningMap) return;
              setIsOpeningMap(true);
              try {
                await openNearbyInMaps({ type: 'hospital', locale, prefer: 'google' });
              } finally {
                setIsOpeningMap(false);
              }
            }}
            className="mt-6 px-8 py-4 rounded-2xl border-2 font-black text-lg transition-all bg-white text-orange-800 border-orange-200 hover:border-orange-300 inline-flex items-center gap-3 w-fit mx-auto"
          >
            <Hospital size={22} />
            {locale === 'zh' ? (isOpeningMap ? '正在打开地图...' : '打开附近医院') : isOpeningMap ? 'Opening map...' : 'Open Nearby Hospitals'}
          </button>
        </motion.div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center" style={{ backgroundColor: '#fce8f0' }}>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="relative w-40 h-40 mb-12">
          <div className="absolute inset-0 bg-pink-200/50 rounded-full blur-2xl"></div>
          <div className="absolute inset-0 border-[6px] border-pink-100 rounded-full"></div>
          <div className="absolute inset-0 border-[6px] border-pink-400 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="text-pink-400" size={48} />
          </div>
        </motion.div>
        <h2 className="text-5xl font-black text-ink mb-6 tracking-tight">
          {locale === 'zh' ? '正在匹配药品...' : 'Matching Medicines...'}
        </h2>
        <p className="text-xl text-ink/50 font-medium max-w-md mx-auto leading-relaxed">
          {locale === 'zh' ? 'AI 正在应用药理规则并排除禁忌风险。' : 'AI is applying pharmacological rules and excluding contraindication risks.'}
        </p>
      </div>
    );
  }

  if (results) {
    // Get common advice from any result (they are identical as they come from global tags)
    const firstRes = results[0];
    const hasAdvice = !!firstRes && firstRes.lifestyleAdvice[locale].length > 0;
    const hasAlerts = !!firstRes && firstRes.comorbidityAlerts[locale].length > 0;

    return (
      <div className="max-w-6xl mx-auto px-8 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-black text-ink tracking-tight leading-[1.1]">
              {results.length > 0 
                ? (locale === 'zh' ? <>匹配到 <span style={{color:'#f03384'}}>{results.length}</span> 款建议</> : <>Found <span style={{color:'#f03384'}}>{results.length}</span> Matches</>)
                : (locale === 'zh' ? '未找到完全匹配的药品' : 'No Direct Matches Found')}
            </h2>
            <p className="mt-6 text-xl text-ink/50 font-medium">
              {locale === 'zh' 
                ? '以下推荐基于临床指南与药品说明书，按匹配度与证据等级排序。' 
                : 'The following recommendations are based on clinical guidelines and drug labels, sorted by match score and evidence level.'}
            </p>
          </div>
          <Link href="/" className="btn-primary flex items-center gap-3 w-fit shadow-neo-md">
            <ArrowLeft size={24} />
            {locale === 'zh' ? '重新开始' : 'Start Over'}
          </Link>
        </div>

        {/* Professional Insights: Lifestyle & Comorbidity */}
        {(hasAdvice || hasAlerts) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {hasAdvice && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card-mint !p-10">
                <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-3 text-ink">
                  <Sparkles size={20} />
                  {locale === 'zh' ? '生活方式建议' : 'Lifestyle Advice'}
                </h4>
                <ul className="space-y-4">
                  {firstRes.lifestyleAdvice[locale].map((adv, i) => (
                    <li key={i} className="text-lg text-ink/70 font-bold flex gap-3">
                      <span className="text-mint-500">•</span> {adv}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
            {hasAlerts && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="card-yellow !border-orange-200 !bg-orange-50 !p-10">
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
              <motion.div key={res.medicine.id} className="card-playful relative overflow-hidden">

                {/* Evidence Level & Match Details */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="px-3 py-1 bg-ink text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                    ATC: {res.medicine.atc_code}
                  </span>
                  {res.medicine.fda_otc_monograph && (
                    <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                      FDA OTC Monograph
                    </span>
                  )}
                  <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${
                    res.medicine.evidence_level === 'A' ? 'bg-mint-300 text-ink' : 'bg-yellow-200 text-ink'
                  }`}>
                    Evidence Level: {res.medicine.evidence_level}
                  </span>
                  <span className="px-3 py-1 bg-pink-50 text-ink/50 text-[10px] font-black rounded-full uppercase tracking-widest border border-ink/10">
                    Confidence: {(res.score * 10).toFixed(0)}%
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12">
                  <div className="flex gap-6">
                    <div className="w-20 h-20 border-2 border-ink rounded-2xl flex items-center justify-center shadow-neo-sm shrink-0" style={{ backgroundColor: '#ffd6e7' }}>
                      <Pill size={36} className="text-ink" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-ink mb-1 tracking-tight">{res.medicine.name}</h3>
                      <p className="text-sm text-ink/40 font-bold mb-3 uppercase tracking-wider">{res.medicine.generic_name}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-xs font-black px-3 py-1 rounded-full border border-ink/20 ${
                          res.riskLevel === 'low' ? 'bg-mint-100 text-ink' :
                          res.riskLevel === 'moderate' ? 'bg-yellow-100 text-ink' :
                          'bg-pink-100 text-ink'
                        }`}>
                          Risk: {res.riskLevel.toUpperCase()}
                        </span>
                        <span className="text-xs font-black text-ink bg-pink-50 px-3 py-1 rounded-full border border-ink/10">
                          Match: {res.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-2 border-ink text-ink px-6 py-4 rounded-2xl text-center shadow-neo-sm shrink-0" style={{ backgroundColor: '#fcd34d' }}>
                    <div className="text-[10px] font-black text-ink/50 uppercase tracking-[0.3em] mb-1">{locale === 'zh' ? '参考价格' : 'Price Ref'}</div>
                    <div className="text-xl font-black">{res.medicine.availability[0].currency} {res.medicine.availability[0].price}</div>
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
                      <h4 className="font-black text-ink uppercase text-xs tracking-[0.3em] mb-4 flex items-center gap-2">
                        <Sparkles size={14} className="text-pink-400" />
                        {mt('ingredients')}
                      </h4>
                      <p className="text-lg text-ink/60 font-medium">{res.medicine.active_ingredients.join(', ')}</p>
                    </div>

                    <div>
                      <h4 className="font-black text-ink uppercase text-xs tracking-[0.3em] mb-4 flex items-center gap-2">
                        <Info size={14} className="text-pink-400" />
                        {locale === 'zh' ? '匹配证据' : 'Match Evidence'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {res.matchedTags.map(tag => {
                          const tagName = tag.split(':')[1].replace('_', ' ');
                          return (
                            <span key={tag} className="px-3 py-1 bg-mint-100 text-ink rounded-lg text-xs font-bold capitalize">
                              ✓ {tagName}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {res.medicine.indications.structured.syndromeTypes && (
                      <div>
                        <h4 className="font-black text-ink uppercase text-xs tracking-[0.3em] mb-4 flex items-center gap-2">
                          <Stethoscope size={14} className="text-pink-400" />
                          {locale === 'zh' ? '中医证型' : 'TCM Syndrome'}
                        </h4>
                        <p className="text-sm text-ink/60 font-bold">{res.medicine.indications.structured.syndromeTypes.join(', ')}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-8">
                    {/* Caution Warnings */}
                    {res.warnings[locale].length > 0 && (
                      <div className="bg-orange-50/50 p-8 rounded-3xl border border-orange-100/50">
                        <h4 className="font-black text-orange-800 uppercase text-[10px] tracking-[0.3em] mb-6 flex items-center gap-3">
                          <AlertTriangle size={18} /> {locale === 'zh' ? '用药警示' : 'Clinical Warnings'}
                        </h4>
                        <ul className="text-sm text-orange-900/60 space-y-3 font-bold">
                          {res.warnings[locale].map((w, i) => <li key={i}>• {w}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className="bg-pink-50/50 p-8 rounded-3xl border border-pink-100/50">
                      <h4 className="font-black text-ink/70 uppercase text-[10px] tracking-[0.3em] mb-6 flex items-center gap-3">
                        <CheckCircle size={18} /> {mt('dosage')}
                      </h4>
                      <p className="text-sm text-ink/60 font-bold leading-relaxed">{res.medicine.dosage[locale]}</p>
                    </div>

                    <div className="bg-pink-50/50 p-8 rounded-3xl border border-pink-100/50">
                      <h4 className="font-black text-ink/70 uppercase text-[10px] tracking-[0.3em] mb-6 flex items-center gap-3">
                        <Activity size={18} /> {mt('side_effects')}
                      </h4>
                      <ul className="text-sm text-ink/60 space-y-3 font-bold">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={async () => {
                            if (isOpeningMap) return;
                            setIsOpeningMap(true);
                            try {
                              await openNearbyInMaps({
                                type: 'pharmacy',
                                locale,
                                medicineName: res.medicine.generic_name ?? res.medicine.name,
                                prefer: 'google'
                              });
                            } finally {
                              setIsOpeningMap(false);
                            }
                          }}
                          className="btn-sage w-full flex items-center justify-center gap-2"
                        >
                          <MapPin size={20} />
                          {locale === 'zh' ? '附近药店' : 'Nearby Pharmacies'}
                        </button>
                        <button
                          onClick={async () => {
                            if (isOpeningMap) return;
                            setIsOpeningMap(true);
                            try {
                              await openNearbyInMaps({ type: 'hospital', locale, prefer: 'google' });
                            } finally {
                              setIsOpeningMap(false);
                            }
                          }}
                          className="btn-sage w-full flex items-center justify-center gap-2"
                        >
                          <Hospital size={20} />
                          {locale === 'zh' ? '附近医院' : 'Nearby Hospitals'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* References Section */}
                <div className="mt-12 pt-8 border-t border-ink/10">
                   <h4 className="font-black text-ink uppercase text-[10px] tracking-[0.3em] mb-4">
                    {locale === 'zh' ? '临床依据' : 'Clinical References'}
                  </h4>
                  <ul className="text-[10px] text-ink/40 font-medium space-y-1">
                    {res.medicine.references.map((ref, i) => {
                      const url = REFERENCE_URLS[ref];
                      return (
                        <li key={i}>
                          [{i+1}]{' '}
                          {url ? (
                            <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-pink-500 transition-colors">
                              {ref}
                            </a>
                          ) : ref}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="space-y-12">
            <div className="card-playful !bg-ink text-white !p-10">
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-3 text-white/60">
                <ShieldCheck size={20} />
                {locale === 'zh' ? '安全提示' : 'Safety Check'}
              </h4>
              <p className="text-lg text-white/70 font-medium mb-10 italic">"{t('safety_warning')}"</p>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-white/50 text-xs leading-relaxed font-bold">
                {locale === 'zh' 
                  ? '本系统已集成 ICD-11 与 SNOMED CT 标准，匹配逻辑严格遵循国家药典。若出现过敏反应请立即停药。' 
                  : 'Integrated with ICD-11 & SNOMED CT standards. Logic strictly follows pharmacopoeia. Discontinue use if allergic reactions occur.'}
              </div>
            </div>

            <div className="card-yellow !border-orange-200 !bg-orange-50 !p-10">
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-playful !p-20 text-center">
          <div className="w-24 h-24 bg-pink-100 text-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-10">
            <ShieldCheck size={48} />
          </div>
          <h2 className="text-5xl font-black text-ink mb-8 tracking-tight">{locale === 'zh' ? '临床决策支持系统 (CDSS)' : 'Clinical Decision Support System'}</h2>
          <p className="text-2xl text-ink/50 font-medium mb-12 leading-relaxed">
            {locale === 'zh' 
              ? '本系统已升级至医疗级标准，集成 ICD-11、ATC 及 SNOMED CT 国际规范。推荐结果基于权威指南，仅供自用参考，不替代医生诊断。' 
              : 'Upgraded to medical-grade standards, integrating ICD-11, ATC, and SNOMED CT. Recommendations are based on authoritative guidelines for reference only.'}
          </p>
          <button onClick={handleNext} className="btn-pink shadow-neo-md min-w-[250px] text-xl">
            {locale === 'zh' ? '同意并开始' : 'Agree & Start'}
          </button>
        </motion.div>
      ) : (
        <>
          <div className="mb-16">
            <div className="flex justify-between items-end mb-10">
              <div className="flex flex-col gap-4">
                <div className="badge-pink">
                  {currentStep === 'symptom_selection'
                    ? locale === 'zh'
                      ? '步骤 1/3 · 选择症状'
                      : 'Step 1/3 · Focus'
                    : currentStep === 'question'
                      ? locale === 'zh'
                        ? '步骤 2/3 · 详细问诊'
                        : 'Step 2/3 · Diagnosis'
                      : locale === 'zh'
                        ? '步骤 3/3 · 风险排除'
                        : 'Step 3/3 · Risk Filter'}
                </div>
                <h2 className="text-5xl font-black text-ink tracking-tight">
                  {currentStep === 'symptom_selection' ? (locale === 'zh' ? '选择主诉症状' : 'Select Primary Symptom') : 
                   currentStep === 'risk_factors' ? (locale === 'zh' ? '禁忌与风险排除' : 'Risk & Exclusion') :
                   selectedSymptom?.name[locale]}
                </h2>
              </div>

              <button
                onClick={handleBack}
                className="flex items-center gap-3 text-ink/30 font-black uppercase text-sm tracking-[0.3em] hover:text-ink transition-all"
              >
                <ChevronLeft size={28} /> {t('previous')}
              </button>
            </div>
          </div>

          <div className="flex-1 card-playful !p-12 md:!p-20 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep === 'question' ? currentQuestionId : currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="h-full flex flex-col">
                {currentStep === 'symptom_selection' ? (
                  <div className="space-y-10">
                    <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
                      <div className="relative flex-1">
                        <input
                          value={symptomQuery}
                          onChange={(e) => setSymptomQuery(e.target.value)}
                          placeholder={locale === 'zh' ? '搜索你的症状（如：偏头痛、烧心、咳嗽）' : 'Search symptoms (e.g., migraine, heartburn, cough)'}
                          className="w-full rounded-2xl border-2 border-ink/20 bg-white px-8 py-5 text-lg font-bold text-ink placeholder:text-ink/30 focus:outline-none focus:ring-4 focus:ring-pink-200/50"
                        />
                      </div>
                      <button
                        onClick={() => setShowNotSure(true)}
                        className="px-8 py-5 rounded-2xl border-2 border-ink/20 bg-white text-ink font-black hover:border-ink/40 transition-all"
                      >
                        {locale === 'zh' ? '不确定选哪个？' : 'Not sure?'}
                      </button>
                    </div>

                    {medicineSuggestions.length > 0 ? (
                      <div className="card-playful !p-8 !rounded-2xl">
                        <div className="text-xs font-black text-ink/40 uppercase tracking-[0.3em] mb-4">
                          {locale === 'zh' ? '你是不是在找药品？' : 'Looking for a medicine?'}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          {medicineSuggestions.map((m) => (
                            <Link
                              key={m.id}
                              href={`/medicines/${encodeURIComponent(m.id)}`}
                              className="px-5 py-3 rounded-2xl bg-pink-50 border border-ink/20 font-black text-ink hover:border-ink/40 transition-all"
                            >
                              {m.name}
                            </Link>
                          ))}
                          <Link
                            href="/medicines"
                            className="px-5 py-3 rounded-2xl bg-white border border-ink/20 font-black text-ink hover:border-ink/40 transition-all"
                          >
                            {locale === 'zh' ? '查看药品目录' : 'Open OTC Directory'}
                          </Link>
                        </div>
                      </div>
                    ) : null}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {symptomQuery.trim().length > 0 ? (
                        filteredSymptoms.length > 0 ? (
                          filteredSymptoms.map((s) => (
                            <Link
                              key={s.id}
                              href={`/questionnaire/${s.id}`}
                              onClick={() => selectSymptom(s.id)}
                              className={`p-10 text-left rounded-3xl border-2 transition-all flex flex-col gap-4 relative ${selectedSymptomId === s.id ? 'border-pink-500 bg-pink-50 shadow-neo-md' : 'border-ink/10 bg-white hover:border-ink/30 shadow-neo-sm'}`}
                            >
                              <div className="flex items-start justify-between gap-6">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${selectedSymptomId === s.id ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-400'}`}>
                                  <SymptomIcon symptom={s} />
                                </div>
                                {s.icd11 ? (
                                  <div className="flex items-center gap-2 text-[10px] font-black text-ink/40 uppercase tracking-widest">
                                    <span>ICD-11: {s.icd11}</span>
                                    <span
                                      className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-ink/20 text-ink/40"
                                      title={
                                        locale === 'zh'
                                          ? `ICD-11：国际疾病分类第11版，用于医学诊断与编码。${s.icd11_label?.zh ? `\n\n${s.icd11_label.zh}` : ''}`
                                          : `ICD-11: International Classification of Diseases (11th Revision).${s.icd11_label?.en ? `\n\n${s.icd11_label.en}` : ''}`
                                      }
                                    >
                                      <Info size={14} />
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-black text-2xl text-ink">{s.name[locale]}</h4>
                                {s.description ? (
                                  <p className="text-ink/60 font-bold leading-relaxed">{s.description[locale]}</p>
                                ) : null}
                              </div>
                              {s.popular ? (
                                <div className="inline-flex items-center gap-2 text-xs font-black text-ink bg-mint-100 border border-ink/10 rounded-full px-5 py-2 w-fit">
                                  <Activity size={16} />
                                  {locale === 'zh' ? '常见症状' : 'Popular'}
                                </div>
                              ) : null}
                              {selectedSymptomId === s.id ? <CheckCircle2 className="absolute top-8 right-8 text-pink-500" size={36} /> : null}
                            </Link>
                          ))
                        ) : (
                          <div className="lg:col-span-3 card-playful !p-12 text-center">
                            <div className="text-2xl font-black text-ink mb-3">{locale === 'zh' ? '未找到匹配的症状' : 'No symptoms found'}</div>
                            <div className="text-ink/60 font-bold">{locale === 'zh' ? '试试中文/英文/拼音首字母/ICD 编码。' : 'Try name, initials, or ICD-11 code.'}</div>
                          </div>
                        )
                      ) : (
                        groupedSymptoms.flatMap((g) => {
                          if (groupFilter && g.key !== groupFilter) return [];
                          const items = showAllSymptoms ? g.items : g.items.filter((x) => x.popular);
                          if (items.length === 0) return [];
                          return [
                            <div key={`h_${g.key}`} className="md:col-span-2 lg:col-span-3 flex items-center justify-between mt-4">
                              <div className="text-sm font-black text-ink/40 uppercase tracking-[0.3em]">{g.label[locale]}</div>
                            </div>,
                            ...items.map((s) => (
                              <Link
                                key={s.id}
                                href={`/questionnaire/${s.id}`}
                                onClick={() => selectSymptom(s.id)}
                                className={`p-10 text-left rounded-3xl border-2 transition-all flex flex-col gap-4 relative ${selectedSymptomId === s.id ? 'border-pink-500 bg-pink-50 shadow-neo-md' : 'border-ink/10 bg-white hover:border-ink/30 shadow-neo-sm'}`}
                              >
                                <div className="flex items-start justify-between gap-6">
                                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${selectedSymptomId === s.id ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-400'}`}>
                                    <SymptomIcon symptom={s} />
                                  </div>
                                  {s.icd11 ? (
                                    <div className="flex items-center gap-2 text-[10px] font-black text-ink/40 uppercase tracking-widest">
                                      <span>ICD-11: {s.icd11}</span>
                                      <span
                                        className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-ink/20 text-ink/40"
                                        title={
                                          locale === 'zh'
                                            ? `ICD-11：国际疾病分类第11版，用于医学诊断与编码。${s.icd11_label?.zh ? `\n\n${s.icd11_label.zh}` : ''}`
                                            : `ICD-11: International Classification of Diseases (11th Revision).${s.icd11_label?.en ? `\n\n${s.icd11_label.en}` : ''}`
                                        }
                                      >
                                        <Info size={14} />
                                      </span>
                                    </div>
                                  ) : null}
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-black text-2xl text-ink">{s.name[locale]}</h4>
                                  {s.description ? (
                                    <p className="text-ink/60 font-bold leading-relaxed">{s.description[locale]}</p>
                                  ) : null}
                                </div>
                                {s.popular ? (
                                  <div className="inline-flex items-center gap-2 text-xs font-black text-ink bg-mint-100 border border-ink/10 rounded-full px-5 py-2 w-fit">
                                    <Activity size={16} />
                                    {locale === 'zh' ? '常见症状' : 'Popular'}
                                  </div>
                                ) : null}
                                {selectedSymptomId === s.id ? <CheckCircle2 className="absolute top-8 right-8 text-pink-500" size={36} /> : null}
                              </Link>
                            ))
                          ];
                        })
                      )}

                      {!symptomQuery.trim().length ? (
                        <div className="md:col-span-2 lg:col-span-3 flex justify-center">
                          <button
                            onClick={() => setShowAllSymptoms((v) => !v)}
                            className="px-10 py-4 rounded-2xl border-2 border-ink/20 bg-white text-ink font-black hover:border-ink/40 transition-all"
                          >
                            {showAllSymptoms ? (locale === 'zh' ? '收起' : 'Show less') : (locale === 'zh' ? '查看更多症状' : 'Show more symptoms')}
                          </button>
                          {groupFilter ? (
                            <button
                              onClick={() => setGroupFilter(null)}
                              className="ml-4 px-10 py-4 rounded-2xl border-2 border-ink/20 bg-pink-50 text-ink font-black hover:border-ink/40 transition-all"
                            >
                              {locale === 'zh' ? '显示全部分类' : 'Show all categories'}
                            </button>
                          ) : null}
                        </div>
                      ) : null}

                      <div className="md:col-span-2 lg:col-span-3 text-sm text-ink/50 font-bold leading-relaxed flex items-start gap-3">
                        <AlertTriangle size={18} className="mt-0.5" />
                        <span>
                          {locale === 'zh'
                            ? '重要提示：本工具提供的信息仅供参考，不能替代专业医疗建议、诊断或治疗。如有紧急情况，请立即就医。使用本服务即表示您同意我们的使用条款和隐私政策。ICD-11 编码仅用于医学参考。'
                            : 'Important: For informational purposes only. Not a substitute for professional medical advice, diagnosis, or treatment. Seek urgent care for emergencies. By using this service you agree to our Terms and Privacy Policy. ICD-11 codes are for medical reference only.'}
                          {' '}
                          <Link href="/terms" className="underline text-pink-500 hover:text-ink">{locale === 'zh' ? '使用条款' : 'Terms'}</Link>
                          {' / '}
                          <Link href="/privacy" className="underline text-pink-500 hover:text-ink">{locale === 'zh' ? '隐私政策' : 'Privacy'}</Link>
                          {' · '}
                          <a href="mailto:support@medassist.local?subject=ICD-11%20Feedback" className="underline text-pink-500 hover:text-ink">
                            {locale === 'zh' ? '发现编码有误？告诉我们' : 'Wrong code? Tell us'}
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-16">
                    <div className="space-y-4">
                      <h3 className="text-5xl font-black text-ink leading-tight">
                        {currentQuestion?.text[locale]}
                      </h3>
                      {currentQuestion?.type === 'multi-choice' && (
                        <p className="text-ink/40 font-bold uppercase tracking-widest text-xs">
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
                          <button
                            key={opt.value}
                            onClick={() =>
                              currentQuestion.type === 'multi-choice'
                                ? toggleOption(currentQuestion.id, opt.value, true)
                                : advanceFromChoice(currentQuestion.id, opt)
                            }
                            className={`p-10 text-left rounded-3xl border-2 transition-all flex items-center justify-between ${isSelected ? 'border-pink-500 bg-pink-50 shadow-neo-md' : 'border-ink/10 bg-white hover:border-ink/30 shadow-neo-sm'}`}
                          >
                            <span className="text-2xl font-black text-ink">{opt.label[locale]}</span>
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-pink-500 bg-pink-500 text-white shadow-neo-sm' : 'border-ink/20'}`}>
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

          {showNotSure ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/20">
              <div className="card-playful !p-10 w-full max-w-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-70"></div>
                <div className="flex items-start justify-between gap-6 mb-8">
                  <div>
                    <div className="text-xs font-black text-ink/40 uppercase tracking-[0.3em] mb-2">
                      {locale === 'zh' ? '快速定位' : 'Quick Triage'}
                    </div>
                    <div className="text-3xl font-black text-ink">{locale === 'zh' ? '你不确定选哪个？' : 'Not sure what to pick?'}</div>
                    <div className="mt-3 text-ink/60 font-bold">
                      {locale === 'zh' ? '先选一个大类，我们会帮你筛出来。' : 'Pick a category and we will narrow it down.'}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNotSure(false)}
                    className="px-4 py-2 rounded-full border border-ink/20 bg-white font-black text-ink hover:border-ink/40"
                  >
                    {locale === 'zh' ? '关闭' : 'Close'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(
                    [
                      { key: 'respiratory', zh: '呼吸（咳嗽/感冒）', en: 'Respiratory (cough/cold)' },
                      { key: 'digestive', zh: '消化（反流/腹泻/便秘）', en: 'Digestive (reflux/diarrhea/constipation)' },
                      { key: 'neurology', zh: '头部/神经（头痛/焦虑）', en: 'Head & Neuro (headache/anxiety)' },
                      { key: 'sleep', zh: '睡眠（失眠）', en: 'Sleep (insomnia)' },
                      { key: 'allergy', zh: '过敏（鼻炎/荨麻疹）', en: 'Allergy (rhinitis/hives)' },
                      { key: 'skin', zh: '皮肤（湿疹/痤疮）', en: 'Skin (eczema/acne)' },
                      { key: 'eye', zh: '眼部（干涩/红眼）', en: 'Eye (dry eye/pink eye)' },
                      { key: 'ear', zh: '耳部（耳痛/耳鸣）', en: 'Ear (ear pain/tinnitus)' },
                      { key: 'women', zh: '女性健康（痛经/周期）', en: "Women's Health" },
                      { key: 'urinary', zh: '泌尿（尿路感染）', en: 'Urinary (UTI)' },
                      { key: 'oral_throat', zh: '口腔/咽喉（溃疡/咽痛）', en: 'Oral & Throat' }
                    ] as Array<{ key: Symptom['group']; zh: string; en: string }>
                  ).map((c) => (
                    <button
                      key={String(c.key)}
                      onClick={() => {
                        setGroupFilter(c.key);
                        setShowAllSymptoms(true);
                        setSymptomQuery('');
                        setShowNotSure(false);
                      }}
                      className="p-6 rounded-2xl border-2 border-ink/20 bg-white hover:border-ink/40 transition-all text-left"
                    >
                      <div className="font-black text-ink">{locale === 'zh' ? c.zh : c.en}</div>
                      <div className="mt-2 text-sm text-ink/60 font-bold">
                        {locale === 'zh' ? '筛选该分类下的症状' : 'Filter symptoms in this category'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-16 flex items-center justify-between px-6">
            <button onClick={handleBack} className="flex items-center gap-3 text-ink/30 font-black uppercase text-sm tracking-[0.3em] hover:text-ink transition-all">
              <ChevronLeft size={28} /> {t('previous')}
            </button>
            <button 
              onClick={handleNext} 
              disabled={
                currentStep === 'symptom_selection' ? !selectedSymptomId : 
                (currentQuestion?.type === 'multi-choice'
                  ? currentStep === 'risk_factors'
                    ? false
                    : !(answers[currentQuestion.id]?.length > 0)
                  : !answers[currentQuestion?.id || ''])
              } 
              className="btn-pink min-w-[220px] text-xl shadow-neo-md"
            >
              {currentStep === 'risk_factors' ? t('finish') : t('next')} <ChevronRight size={28} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
