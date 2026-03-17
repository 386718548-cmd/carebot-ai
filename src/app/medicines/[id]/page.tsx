'use client';

import { useEffect, useMemo, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, CirclePlay, CircleStop, Volume2, ShieldAlert, CheckCircle2, AlertTriangle, Bell, Plus, Trash2 } from 'lucide-react';
import { medicines } from '@/data/medicines';
import { useLocale } from '@/hooks/useI18n';
import { searchMedicines } from '@/lib/medicine-search';

type FontScale = 'lg' | 'xl' | '2xl';

function getFontClass(scale: FontScale) {
  if (scale === '2xl') return 'text-2xl';
  if (scale === 'xl') return 'text-xl';
  return 'text-lg';
}

function findMaxDose(text: string) {
  const m1 = text.match(/do not exceed ([^.]+)/i);
  if (m1?.[1]) return m1[1].trim();
  const m2 = text.match(/不得超过([^。]+)/);
  if (m2?.[1]) return m2[1].trim();
  return null;
}

function buildReadAloudText(locale: 'en' | 'zh', m: (typeof medicines)[number]) {
  const lines: string[] = [];
  lines.push(m.name);
  if (m.generic_name) lines.push(locale === 'zh' ? `通用名：${m.generic_name}` : `Generic name: ${m.generic_name}`);
  lines.push(locale === 'zh' ? '用途：' + m.indications.structured.description.zh : 'Use: ' + m.indications.structured.description.en);
  lines.push(locale === 'zh' ? '用法用量：' + m.dosage.zh : 'Dosage: ' + m.dosage.en);
  const maxDose = findMaxDose(locale === 'zh' ? m.dosage.zh : m.dosage.en);
  if (maxDose) lines.push(locale === 'zh' ? `最大用量提示：${maxDose}` : `Max dose note: ${maxDose}`);
  lines.push(locale === 'zh' ? `常见副作用：${m.side_effects.zh.join('，')}` : `Common side effects: ${m.side_effects.en.join(', ')}`);
  lines.push(locale === 'zh' ? `禁忌/慎用：${m.contraindications.zh.join('，')}` : `Do not use / use with caution: ${m.contraindications.en.join(', ')}`);
  return lines.join(locale === 'zh' ? '。' : '. ');
}

function hasAlcoholWarning(m: (typeof medicines)[number]) {
  const s1 = m.contraindications.structured.interactions.some((i) => i.drugClass.toLowerCase().includes('alcohol'));
  const s2 = Object.keys(m.contraindications.severity).some((k) => k.toLowerCase() === 'alcohol');
  return s1 || s2;
}

function mealGuidance(locale: 'en' | 'zh', dosageText: string) {
  const t = dosageText.toLowerCase();
  if (t.includes('before breakfast') || t.includes('before eating')) {
    return locale === 'zh' ? '建议在饭前服用（以说明书用法用量为准）。' : 'Take before meals (follow the label dosage instructions).';
  }
  if (dosageText.includes('空腹')) return locale === 'zh' ? '建议空腹服用（以说明书为准）。' : 'Take on an empty stomach (follow the label).';
  if (dosageText.includes('随水') || t.includes('with a glass of water') || t.includes('with water')) {
    return locale === 'zh' ? '一般可随水服用；若有胃不适，可咨询药师是否可随餐。' : 'Generally take with water; if you have stomach upset, ask a pharmacist whether taking with food is appropriate.';
  }
  return locale === 'zh' ? '说明书未明确标注饭前/饭后时，请以药盒说明书或药师建议为准。' : 'If the label does not specify before/after meals, follow the package label or ask a pharmacist.';
}

type QuickQ = 'how_to_take' | 'before_or_after_meal' | 'max_per_day' | 'alcohol' | 'who_should_avoid' | 'what_if_unwell';

function answerQuickQuestion(locale: 'en' | 'zh', m: (typeof medicines)[number], q: QuickQ) {
  const dosageText = locale === 'zh' ? m.dosage.zh : m.dosage.en;
  const maxDose = findMaxDose(dosageText);

  if (q === 'how_to_take') return dosageText;
  if (q === 'before_or_after_meal') return mealGuidance(locale, dosageText);
  if (q === 'max_per_day') {
    if (maxDose) return locale === 'zh' ? `最大用量提示：${maxDose}。请勿超量。` : `Max dose note: ${maxDose}. Do not exceed.`;
    return locale === 'zh' ? '说明书中未提取到明确“最大用量”字样，请以药盒说明书为准。' : 'No explicit max dose note found here; follow the package label.';
  }
  if (q === 'alcohol') {
    if (hasAlcoholWarning(m)) return locale === 'zh' ? '不建议饮酒或需严格限制饮酒；酒精可能增加不良反应风险。' : 'Avoid or strictly limit alcohol; it may increase adverse effect risk.';
    return locale === 'zh' ? '说明书未显示明确酒精相互作用，但饮酒可能加重不适；有基础病或合并用药时请先咨询。' : 'No explicit alcohol interaction shown here, but alcohol can worsen symptoms; ask a clinician if you have comorbidities or take other meds.';
  }
  if (q === 'who_should_avoid') {
    const items = locale === 'zh' ? m.contraindications.zh : m.contraindications.en;
    return items.length ? items.join(locale === 'zh' ? '；' : '; ') : (locale === 'zh' ? '未提供禁忌信息。' : 'No contraindications listed.');
  }
  const sfx = locale === 'zh' ? m.side_effects.zh : m.side_effects.en;
  return locale === 'zh'
    ? `可能出现：${sfx.join('，')}。若出现严重过敏（呼吸困难、全身皮疹、面唇舌咽肿胀）或症状加重，请立即停用并就医。`
    : `Possible: ${sfx.join(', ')}. Stop use and seek care immediately for severe allergy (breathing difficulty, generalized rash, swelling) or worsening symptoms.`;
}

type Reminder = {
  id: string;
  medicineId: string;
  medicineName: string;
  time: string;
  label: string;
  enabled: boolean;
  voice: boolean;
  lastFiredDate?: string;
};

const REMINDERS_KEY = 'medassist_reminders_v1';

function safeParseReminders(raw: string | null): Reminder[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter((r) => typeof r?.id === 'string' && typeof r?.time === 'string');
  } catch {
    return [];
  }
}

function loadReminders(): Reminder[] {
  if (typeof window === 'undefined') return [];
  return safeParseReminders(window.localStorage.getItem(REMINDERS_KEY));
}

function saveReminders(reminders: Reminder[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
}

export default function MedicineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { locale } = useLocale();
  const { id } = use(params);
  const decodedId = decodeURIComponent(id || '');
  const normalizedQuery = decodedId.trim();
  const hasMeaningfulQuery = normalizedQuery.length > 0 && !['undefined', 'null'].includes(normalizedQuery.toLowerCase());
  const displayQuery = hasMeaningfulQuery ? normalizedQuery : locale === 'zh' ? '该药品' : 'this medicine';
  const medicine = medicines.find((m) => m.id === normalizedQuery) || null;
  const suggestionMedicines = useMemo(
    () => (hasMeaningfulQuery ? searchMedicines(normalizedQuery, medicines, locale).suggestions : []),
    [hasMeaningfulQuery, normalizedQuery, locale]
  );

  const [fontScale, setFontScale] = useState<FontScale>('xl');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeQ, setActiveQ] = useState<QuickQ>('how_to_take');
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderTime, setReminderTime] = useState('');
  const [reminderLabel, setReminderLabel] = useState('');
  const [reminderVoice, setReminderVoice] = useState(true);
  const [reportStatus, setReportStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [reportQuery, setReportQuery] = useState(hasMeaningfulQuery ? normalizedQuery : '');

  useEffect(() => {
    setReminders(loadReminders());
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const readAloudText = useMemo(() => {
    if (!medicine) return '';
    return buildReadAloudText(locale, medicine);
  }, [locale, medicine]);

  const speak = () => {
    if (!medicine) return;
    if (locale === 'en') return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(readAloudText);
    utter.lang = 'zh-CN';
    utter.rate = 0.88;
    utter.pitch = 1.05;
    utter.volume = 1.0;

    // Pick the best available zh-CN voice
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred = [
        'Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)',
        'Microsoft Xiaoyi Online (Natural) - Chinese (Mainland)',
        'Microsoft Yunxi Online (Natural) - Chinese (Mainland)',
        'Google 普通话（中国大陆）',
        'Ting-Ting',
      ];
      let chosen = voices.find(v => preferred.some(p => v.name.includes(p.split(' ')[1] ?? p)));
      if (!chosen) chosen = voices.find(v => v.lang === 'zh-CN' || v.lang === 'zh_CN');
      if (!chosen) chosen = voices.find(v => v.lang.startsWith('zh'));
      if (chosen) utter.voice = chosen;
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utter);
    };

    // Voices may not be loaded yet on first call
    if (window.speechSynthesis.getVoices().length > 0) {
      trySpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        trySpeak();
      };
    }
  };

  const stop = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const persistReminders = (next: Reminder[]) => {
    setReminders(next);
    saveReminders(next);
  };

  const addReminder = () => {
    if (!medicine) return;
    if (!reminderTime) return;
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const next: Reminder = {
      id,
      medicineId: medicine.id,
      medicineName: medicine.name,
      time: reminderTime,
      label: reminderLabel.trim(),
      enabled: true,
      voice: reminderVoice
    };
    persistReminders([next, ...reminders]);
    setReminderLabel('');
  };

  const toggleReminder = (id: string) => {
    persistReminders(reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const removeReminder = (id: string) => {
    persistReminders(reminders.filter((r) => r.id !== id));
  };

  const updateReminderVoice = (id: string, voice: boolean) => {
    persistReminders(reminders.map((r) => (r.id === id ? { ...r, voice } : r)));
  };

  if (!medicine) {
    return (
      <div className="max-w-5xl mx-auto px-8 py-20 min-h-[85vh]">
        <div className="card-warm !p-16 text-center">
          <div className="w-20 h-20 bg-warm-100 text-warm-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10">
            <ShieldAlert size={42} />
          </div>
          <h1 className="text-4xl font-black text-warm-900 tracking-tight mb-4">{locale === 'zh' ? '未找到该药品' : 'Medicine Not Found'}</h1>
          <div className="text-lg text-warm-800/60 font-medium mb-10 max-w-2xl mx-auto space-y-4">
            <p>
              {locale === 'zh'
                ? hasMeaningfulQuery
                  ? `未找到“${displayQuery}”。可能是名称输入差异（商品名/通用名）、拼写问题，或该药尚未收录。`
                  : '未找到你要查看的药品。可能是链接不完整，或该药尚未收录。'
                : hasMeaningfulQuery
                  ? `We could not find “${displayQuery}”. This may be due to brand/generic differences, typos, or the medicine not being included yet.`
                  : 'We could not find the medicine you were trying to open. The link may be incomplete, or it is not included yet.'}
            </p>
            <div className="pt-2">
              <div className="text-xs font-black text-warm-400 uppercase tracking-[0.2em] mb-3">
                {locale === 'zh' ? '提交药品名称（帮助我们补充）' : 'Submit the medicine name (helps us improve)'}
              </div>
              <input
                value={reportQuery}
                onChange={(e) => {
                  setReportStatus('idle');
                  setReportQuery(e.target.value);
                }}
                placeholder={locale === 'zh' ? '例如：布洛芬 / ZzzQuil / Pepcid' : 'e.g., Ibuprofen / ZzzQuil / Pepcid'}
                className="w-full rounded-[2.5rem] border-2 border-warm-100 bg-white px-8 py-5 text-base font-bold text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-4 focus:ring-warm-200/50"
              />
              <div className="mt-4 text-sm text-warm-800/60 font-bold leading-relaxed">
                {locale === 'zh'
                  ? '可能原因：拼写差异、商品名/通用名不同，或该药为处方药暂未收录。'
                  : 'Possible reasons: typos, brand/generic differences, or it is prescription-only and not in the OTC catalog.'}
              </div>
            </div>
            {suggestionMedicines.length > 0 && (
              <div className="pt-4">
                <div className="text-xs font-black text-warm-400 uppercase tracking-[0.2em] mb-4">
                  {locale === 'zh' ? '你是不是想找' : 'Did you mean'}
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {suggestionMedicines.map((m) => (
                    <Link
                      key={m.id}
                      href={`/medicines/${encodeURIComponent(m.id)}`}
                      className="px-5 py-3 rounded-full bg-warm-50 text-warm-700 border border-warm-100 hover:border-warm-200 font-black text-sm"
                    >
                      {m.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Link href={`/medicines`} className="btn-warm inline-flex items-center gap-3 text-lg">
              <ArrowLeft size={20} />
              {locale === 'zh' ? '返回药品目录' : 'Back to Directory'}
            </Link>
            <button
              onClick={async () => {
                if (reportStatus === 'sending' || reportStatus === 'sent') return;
                const q = reportQuery.trim();
                if (!q) return;
                setReportStatus('sending');
                try {
                  const res = await fetch('/api/medicines/missing', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ query: q, context: { path: `/medicines/${id}`, locale } })
                  });
                  if (!res.ok) throw new Error('report failed');
                  setReportStatus('sent');
                } catch {
                  setReportStatus('error');
                }
              }}
              disabled={!reportQuery.trim()}
              className="px-8 py-4 rounded-[2rem] border-2 font-black text-lg transition-all bg-white text-warm-700 border-warm-100 hover:border-warm-200 disabled:opacity-50 disabled:hover:border-warm-100"
            >
              {locale === 'zh'
                ? reportStatus === 'sent'
                  ? '已记录，感谢'
                  : reportStatus === 'sending'
                    ? '正在提交...'
                    : reportStatus === 'error'
                      ? '提交失败，重试'
                      : '提交该药品名称'
                : reportStatus === 'sent'
                  ? 'Reported. Thank you'
                  : reportStatus === 'sending'
                    ? 'Submitting...'
                    : reportStatus === 'error'
                      ? 'Failed. Retry'
                      : 'Report this medicine'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const dosageText = locale === 'zh' ? medicine.dosage.zh : medicine.dosage.en;
  const contraindications = locale === 'zh' ? medicine.contraindications.zh : medicine.contraindications.en;
  const sideEffects = locale === 'zh' ? medicine.side_effects.zh : medicine.side_effects.en;
  const maxDose = findMaxDose(dosageText);

  return (
    <div className="max-w-6xl mx-auto px-8 py-16 min-h-[85vh]">
      <div className="mb-10 flex items-center justify-between gap-6">
        <Link href="/medicines" className="inline-flex items-center gap-2 text-warm-700 font-black hover:text-warm-900 transition-colors">
          <ArrowLeft size={20} />
          {locale === 'zh' ? '药品目录' : 'Directory'}
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFontScale('lg')}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
              fontScale === 'lg' ? 'bg-warm-900 text-white border-warm-900' : 'bg-white text-warm-600 border-warm-100 hover:border-warm-200'
            }`}
          >
            A
          </button>
          <button
            onClick={() => setFontScale('xl')}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
              fontScale === 'xl' ? 'bg-warm-900 text-white border-warm-900' : 'bg-white text-warm-600 border-warm-100 hover:border-warm-200'
            }`}
          >
            A+
          </button>
          <button
            onClick={() => setFontScale('2xl')}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
              fontScale === '2xl' ? 'bg-warm-900 text-white border-warm-900' : 'bg-white text-warm-600 border-warm-100 hover:border-warm-200'
            }`}
          >
            A++
          </button>
        </div>
      </div>

      <div className="card-warm !p-12 md:!p-16 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-72 h-72 bg-warm-50/70 rounded-full -z-10"></div>

        <div className="flex flex-col gap-4 mb-10">
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-warm-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
              {medicine.atc_code ? `ATC: ${medicine.atc_code}` : 'ATC'}
            </span>
            <span className="px-3 py-1 bg-warm-50 text-warm-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-warm-100">
              {locale === 'zh' ? `证据等级：${medicine.evidence_level}` : `Evidence: ${medicine.evidence_level}`}
            </span>
            {medicine.fda_otc_monograph && (
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                FDA OTC Monograph
              </span>
            )}
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-warm-900 tracking-tight">{medicine.name}</h1>
          <div className="text-sm text-warm-400 font-black uppercase tracking-wider">
            {medicine.generic_name ? medicine.generic_name : (locale === 'zh' ? '通用名未标注' : 'Generic not listed')}
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:items-center mt-4">
            {locale === 'zh' && (
              <>
                <button
                  onClick={isSpeaking ? stop : speak}
                  className="btn-warm inline-flex items-center justify-center gap-3 text-lg"
                >
                  {isSpeaking ? <CircleStop size={22} /> : <CirclePlay size={22} />}
                  {isSpeaking ? '停止朗读' : '朗读说明书'}
                  <Volume2 size={20} />
                </button>
                <div className="text-sm text-warm-800/60 font-bold">
                  提示：朗读依赖浏览器语音能力；在部分设备上可能不可用。
                </div>
              </>
            )}
            {locale === 'en' && (
              <div className="text-sm text-warm-800/60 font-bold">
                Note: read-aloud feature is available in Chinese version.
              </div>
            )}
          </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 ${getFontClass(fontScale)} leading-relaxed`}>
          <div className="space-y-10">
            <div className="bg-warm-50/50 p-10 rounded-[3rem] border border-warm-100/50">
              <h2 className="font-black text-warm-900 uppercase text-xs tracking-[0.3em] mb-6 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-sage-600" />
                {locale === 'zh' ? '用途' : 'What it helps'}
              </h2>
              <div className="text-warm-900/70 font-bold">{medicine.indications.structured.description[locale]}</div>
            </div>

            <div className="bg-warm-50/50 p-10 rounded-[3rem] border border-warm-100/50">
              <h2 className="font-black text-warm-900 uppercase text-xs tracking-[0.3em] mb-6 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-warm-500" />
                {locale === 'zh' ? '怎么吃' : 'How to take'}
              </h2>
              <div className="text-warm-900/70 font-bold">{dosageText}</div>
              {maxDose && (
                <div className="mt-6 p-6 bg-orange-50/60 border border-orange-100 rounded-[2rem] text-orange-900/70 font-black flex items-start gap-3">
                  <AlertTriangle size={20} className="text-orange-600 mt-1" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-orange-700">{locale === 'zh' ? '最大用量' : 'Max dose'}</div>
                    <div className="mt-2">{locale === 'zh' ? maxDose : maxDose}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-warm-50/50 p-10 rounded-[3rem] border border-warm-100/50">
              <h2 className="font-black text-warm-900 uppercase text-xs tracking-[0.3em] mb-6 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-warm-500" />
                {locale === 'zh' ? '有效成分' : 'Active ingredients'}
              </h2>
              <div className="text-warm-900/70 font-bold">{medicine.active_ingredients.join(locale === 'zh' ? '，' : ', ')}</div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="bg-orange-50/50 p-10 rounded-[3rem] border border-orange-100/60">
              <h2 className="font-black text-orange-800 uppercase text-xs tracking-[0.3em] mb-6 flex items-center gap-3">
                <AlertTriangle size={18} />
                {locale === 'zh' ? '哪些人不要用/慎用' : 'Do not use / use with caution'}
              </h2>
              <ul className="space-y-4 text-orange-900/70 font-black">
                {contraindications.map((c, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-orange-500">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-6 bg-white/60 rounded-[2rem] border border-orange-100 text-orange-900/60 font-bold">
                {locale === 'zh'
                  ? '如正在服用多种药物、孕期/哺乳期、或有慢病史，请优先咨询医生/药师。'
                  : 'If you take multiple medicines, are pregnant/breastfeeding, or have chronic disease, consult a clinician or pharmacist first.'}
              </div>
            </div>

            <div className="bg-warm-50/50 p-10 rounded-[3rem] border border-warm-100/50">
              <h2 className="font-black text-warm-900 uppercase text-xs tracking-[0.3em] mb-6 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-warm-500" />
                {locale === 'zh' ? '可能的不适（副作用）' : 'Possible side effects'}
              </h2>
              <ul className="space-y-4 text-warm-900/70 font-bold">
                {sideEffects.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-warm-400">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-warm-900 text-white p-10 rounded-[3rem] border border-warm-800/50">
              <h2 className="font-black uppercase text-xs tracking-[0.3em] mb-6 flex items-center gap-3">
                <ShieldAlert size={18} className="text-warm-300" />
                {locale === 'zh' ? '重要提示' : 'Important'}
              </h2>
              <div className="text-warm-100/80 font-bold leading-relaxed">
                {locale === 'zh'
                  ? '本页面为简明说明书，不能替代药盒原说明书、医生或药师建议。出现严重过敏、呼吸困难、意识改变、持续高热或症状加重时请立即就医。'
                  : 'This is a simplified guide and does not replace the package label or clinical advice. Seek care immediately for severe allergy, breathing difficulty, altered mental status, persistent high fever, or worsening symptoms.'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-10 border-t border-warm-100">
          <h2 className="text-2xl font-black text-warm-900 tracking-tight mb-6">{locale === 'zh' ? '常见问题（快捷问答）' : 'Quick Q&A'}</h2>
          <div className="flex flex-wrap gap-3 mb-8">
            {([
              ['how_to_take', locale === 'zh' ? '怎么吃' : 'How to take'],
              ['before_or_after_meal', locale === 'zh' ? '饭前还是饭后' : 'Before/after meals'],
              ['max_per_day', locale === 'zh' ? '一天最多多少' : 'Max per day'],
              ['alcohol', locale === 'zh' ? '能不能喝酒' : 'Alcohol'],
              ['who_should_avoid', locale === 'zh' ? '哪些人不适合' : 'Who should avoid'],
              ['what_if_unwell', locale === 'zh' ? '不舒服怎么办' : 'If I feel unwell']
            ] as [QuickQ, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveQ(key)}
                className={`px-6 py-3 rounded-full text-sm font-black border transition-all ${
                  activeQ === key ? 'bg-warm-900 text-white border-warm-900' : 'bg-white text-warm-600 border-warm-100 hover:border-warm-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className={`bg-warm-50/60 border border-warm-100 rounded-[3rem] p-10 ${getFontClass(fontScale)} text-warm-900/70 font-bold leading-relaxed`}>
            {answerQuickQuestion(locale, medicine, activeQ)}
          </div>
        </div>

        <div className="mt-14 pt-10 border-t border-warm-100">
          <h2 className="text-2xl font-black text-warm-900 tracking-tight mb-6 flex items-center gap-3">
            <Bell size={22} className="text-warm-500" />
            {locale === 'zh' ? '用药提醒（本机）' : 'Local Reminders'}
          </h2>
          <div className="text-sm text-warm-800/60 font-bold mb-8">
            {locale === 'zh'
              ? '提醒保存在当前设备浏览器中。关闭页面后再次打开仍会生效（需浏览器保持运行）。'
              : 'Reminders are stored in this browser on this device. They persist across visits (requires the browser to stay running).'}
          </div>

          <div className="bg-warm-50/60 border border-warm-100 rounded-[3rem] p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <div className="text-xs font-black text-warm-400 uppercase tracking-[0.2em] mb-3">
                  {locale === 'zh' ? '时间' : 'Time'}
                </div>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full bg-white border border-warm-100 rounded-[1.5rem] px-6 py-4 text-lg font-black text-warm-900 outline-none focus:border-warm-200"
                />
              </div>
              <div>
                <div className="text-xs font-black text-warm-400 uppercase tracking-[0.2em] mb-3">
                  {locale === 'zh' ? '备注（可选）' : 'Label (optional)'}
                </div>
                <input
                  value={reminderLabel}
                  onChange={(e) => setReminderLabel(e.target.value)}
                  placeholder={locale === 'zh' ? '例如：饭后 1 片' : 'e.g., 1 tablet after meal'}
                  className="w-full bg-white border border-warm-100 rounded-[1.5rem] px-6 py-4 text-lg font-bold text-warm-900 outline-none focus:border-warm-200 placeholder:text-warm-400"
                />
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setReminderVoice((v) => !v)}
                  className={`px-6 py-4 rounded-[1.5rem] text-sm font-black border transition-all ${
                    reminderVoice ? 'bg-warm-900 text-white border-warm-900' : 'bg-white text-warm-600 border-warm-100 hover:border-warm-200'
                  }`}
                >
                  {locale === 'zh' ? (reminderVoice ? '语音提醒：开' : '语音提醒：关') : reminderVoice ? 'Voice: On' : 'Voice: Off'}
                </button>
                <button
                  onClick={addReminder}
                  className="btn-warm inline-flex items-center justify-center gap-3 text-lg"
                >
                  <Plus size={22} />
                  {locale === 'zh' ? '添加提醒' : 'Add Reminder'}
                </button>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              {reminders.filter((r) => r.medicineId === medicine.id).length === 0 ? (
                <div className="text-sm text-warm-800/60 font-bold">
                  {locale === 'zh' ? '还没有为这个药添加提醒。' : 'No reminders for this medicine yet.'}
                </div>
              ) : (
                reminders
                  .filter((r) => r.medicineId === medicine.id)
                  .map((r) => (
                    <div key={r.id} className="bg-white border border-warm-100 rounded-[2rem] px-8 py-6 flex flex-col md:flex-row md:items-center gap-6 justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="text-2xl font-black text-warm-900">{r.time}</div>
                          <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${
                            r.enabled ? 'bg-sage-50 text-sage-700' : 'bg-warm-50 text-warm-400'
                          }`}>
                            {locale === 'zh' ? (r.enabled ? '启用' : '暂停') : r.enabled ? 'Enabled' : 'Paused'}
                          </span>
                          <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${
                            r.voice ? 'bg-blue-50 text-blue-700' : 'bg-warm-50 text-warm-400'
                          }`}>
                            {locale === 'zh' ? (r.voice ? '语音' : '静音') : r.voice ? 'Voice' : 'Silent'}
                          </span>
                        </div>
                        {r.label ? <div className="mt-2 text-sm text-warm-800/60 font-bold break-words">{r.label}</div> : null}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateReminderVoice(r.id, !r.voice)}
                          className={`px-5 py-3 rounded-full text-xs font-black border transition-all ${
                            r.voice ? 'bg-warm-900 text-white border-warm-900' : 'bg-white text-warm-600 border-warm-100 hover:border-warm-200'
                          }`}
                        >
                          {locale === 'zh' ? (r.voice ? '语音开' : '语音关') : r.voice ? 'Voice On' : 'Voice Off'}
                        </button>
                        <button
                          onClick={() => toggleReminder(r.id)}
                          className={`px-5 py-3 rounded-full text-xs font-black border transition-all ${
                            r.enabled ? 'bg-white text-warm-600 border-warm-100 hover:border-warm-200' : 'bg-warm-900 text-white border-warm-900'
                          }`}
                        >
                          {locale === 'zh' ? (r.enabled ? '暂停' : '启用') : r.enabled ? 'Pause' : 'Enable'}
                        </button>
                        <button
                          onClick={() => removeReminder(r.id)}
                          className="px-5 py-3 rounded-full text-xs font-black border bg-white text-red-600 border-red-100 hover:border-red-200 transition-all inline-flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          {locale === 'zh' ? '删除' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-10 border-t border-warm-100">
          <h2 className="text-xl font-black text-warm-900 tracking-tight mb-6">{locale === 'zh' ? '参考资料' : 'References'}</h2>
          <ul className="text-sm text-warm-600 font-bold space-y-2">
            {medicine.references.map((r, i) => (
              <li key={i}>[{i + 1}] {r}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
