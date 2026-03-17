'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useLocale } from '@/hooks/useI18n';
import { medicines } from '@/data/medicines';
import { symptoms, Symptom } from '@/data/symptoms';
import { Activity, AlertTriangle, Brain, CheckCircle2, Droplets, Ear, Eye, Flame, Flower2, Heart, Info, Leaf, Mic, Sparkles, Stethoscope, Wind, BedDouble, Bone } from 'lucide-react';

export default function SymptomsPage() {
  const { locale } = useLocale();
  const [symptomQuery, setSymptomQuery] = useState('');
  const [showAllSymptoms, setShowAllSymptoms] = useState(false);
  const [showNotSure, setShowNotSure] = useState(false);
  const [groupFilter, setGroupFilter] = useState<Symptom['group'] | null>(null);

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

  const medicineSuggestions = useMemo(() => {
    const q = symptomQuery.trim().toLowerCase();
    if (!q) return [];
    const matches = medicines.filter((m) => {
      const hay = [m.name, m.generic_name, ...(m.aliases || [])].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
    return matches.slice(0, 3);
  }, [symptomQuery]);

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fce8f0' }}>
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <span className="badge-pink inline-block mb-4">🩺 {locale === 'zh' ? '症状选择' : 'Symptoms'}</span>
        <h1 className="mt-2 text-5xl md:text-6xl font-black text-ink tracking-tight">
          {locale === 'zh' ? '选择你的主要症状' : 'Select your primary symptom'}
        </h1>
        <p className="mt-4 text-lg text-ink/60 font-bold max-w-3xl">
          {locale === 'zh'
            ? '我们将基于结构化问卷与安全规则为你提供 OTC 推荐与就医指引。'
            : 'We use structured questionnaires and safety rules to provide OTC guidance and when-to-see-a-doctor advice.'}
        </p>
      </div>

      <div className="space-y-10">
        <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          <div className="relative flex-1">
            <input
              value={symptomQuery}
              onChange={(e) => setSymptomQuery(e.target.value)}
              placeholder={locale === 'zh' ? '搜索症状/ICD/药品名（如：喉咙痛、GA34.3、布洛芬）' : 'Search symptoms / ICD / medicine name'}
              className="w-full rounded-2xl border-2 border-ink bg-white px-6 py-4 text-lg font-bold text-ink placeholder:text-ink/30 focus:outline-none focus:ring-4 focus:ring-mint-200 shadow-neo"
            />
          </div>
          <button
            onClick={() => setShowNotSure(true)}
            className="px-6 py-4 rounded-2xl border-2 border-ink bg-white text-ink font-black hover:bg-mint-100 transition-all shadow-neo"
          >
            {locale === 'zh' ? '不确定选哪个？' : 'Not sure?'}
          </button>
        </div>

        {medicineSuggestions.length > 0 ? (
          <div className="card-mint !rounded-2xl">
            <div className="text-xs font-black text-ink/40 uppercase tracking-[0.3em] mb-4">
              {locale === 'zh' ? '你是不是在找药品？' : 'Looking for a medicine?'}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {medicineSuggestions.map((m) => (
                <Link
                  key={m.id}
                  href={`/medicines/${encodeURIComponent(m.id)}`}
                  className="px-5 py-3 rounded-xl bg-white border-2 border-ink font-black text-ink hover:bg-mint-100 transition-all shadow-neo-sm"
                >
                  {m.name}
                </Link>
              ))}
              <Link
                href="/medicines"
                className="px-5 py-3 rounded-xl bg-white border-2 border-ink font-black text-ink hover:bg-pink-100 transition-all shadow-neo-sm"
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
                  className="symptom-card p-8"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-mint-100 border-2 border-ink text-ink shadow-neo-sm">
                      <SymptomIcon symptom={s} />
                    </div>
                    {s.icd11 ? (
                      <div className="flex items-center gap-2 text-[10px] font-black text-ink/40 uppercase tracking-widest">
                        <span>ICD-11: {s.icd11}</span>
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-ink/20 text-ink/40"
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
                    <h4 className="font-black text-xl text-ink">{s.name[locale]}</h4>
                    {s.description ? <p className="text-ink/60 font-medium leading-relaxed text-sm">{s.description[locale]}</p> : null}
                  </div>
                  {s.popular ? (
                    <div className="inline-flex items-center gap-2 text-xs font-black text-ink bg-yellow-200 border-2 border-ink rounded-full px-4 py-1.5 w-fit shadow-neo-sm">
                      <Activity size={14} />
                      {locale === 'zh' ? '常见症状' : 'Popular'}
                    </div>
                  ) : null}
                </Link>
              ))
            ) : (
              <div className="lg:col-span-3 card-playful text-center">
                <div className="text-2xl font-black text-ink mb-3">{locale === 'zh' ? '未找到匹配的症状' : 'No symptoms found'}</div>
                <div className="text-ink/60 font-bold">{locale === 'zh' ? '试试中文/英文/拼音首字母/ICD 编码/药品名。' : 'Try name, initials, ICD-11 code, or medicine name.'}</div>
              </div>
            )
          ) : (
            groupedSymptoms.flatMap((g) => {
              if (groupFilter && g.key !== groupFilter) return [];
              const items = showAllSymptoms ? g.items : g.items.filter((x) => x.popular);
              if (items.length === 0) return [];
              return [
                <div key={`h_${g.key}`} className="md:col-span-2 lg:col-span-3 flex items-center justify-between mt-4">
                  <div className="text-sm font-black text-ink/50 uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-6 h-0.5 bg-ink/20 inline-block"></span>
                    {g.label[locale]}
                  </div>
                </div>,
                ...items.map((s) => (
                  <Link
                    key={s.id}
                    href={`/questionnaire/${s.id}`}
                    className="symptom-card p-6"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-mint-100 border-2 border-ink text-ink shadow-neo-sm">
                        <SymptomIcon symptom={s} />
                      </div>
                      {s.icd11 ? (
                        <div className="flex items-center gap-2 text-[10px] font-black text-ink/40 uppercase tracking-widest">
                          <span>ICD-11: {s.icd11}</span>
                          <span
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-ink/20 text-ink/40"
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
                      <h4 className="font-black text-xl text-ink">{s.name[locale]}</h4>
                      {s.description ? <p className="text-ink/60 font-medium leading-relaxed text-sm">{s.description[locale]}</p> : null}
                    </div>
                    {s.popular ? (
                      <div className="inline-flex items-center gap-2 text-xs font-black text-ink bg-yellow-200 border-2 border-ink rounded-full px-4 py-1.5 w-fit shadow-neo-sm">
                        <Activity size={14} />
                        {locale === 'zh' ? '常见症状' : 'Popular'}
                      </div>
                    ) : null}
                    <CheckCircle2 className="absolute top-6 right-6 text-mint-300" size={24} />
                  </Link>
                ))
              ];
            })
          )}

          {!symptomQuery.trim().length ? (
            <div className="md:col-span-2 lg:col-span-3 flex justify-center gap-4">
              <button
                onClick={() => setShowAllSymptoms((v) => !v)}
                className="btn-mint !py-3 !px-8 !text-sm"
              >
                {showAllSymptoms ? (locale === 'zh' ? '收起' : 'Show less') : (locale === 'zh' ? '查看更多症状' : 'Show more symptoms')}
              </button>
              {groupFilter ? (
                <button
                  onClick={() => setGroupFilter(null)}
                  className="btn-yellow !py-3 !px-8 !text-sm"
                >
                  {locale === 'zh' ? '显示全部分类' : 'Show all categories'}
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="md:col-span-2 lg:col-span-3 text-sm text-ink/50 font-bold leading-relaxed flex items-start gap-3 bg-yellow-50 border-2 border-ink/10 rounded-2xl p-5">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-yellow-500" />
            <span>
              {locale === 'zh'
                ? '重要提示：本工具提供的信息仅供参考，不能替代专业医疗建议、诊断或治疗。如有紧急情况，请立即就医。ICD-11 编码仅用于医学参考。'
                : 'Important: For informational purposes only. Not a substitute for professional medical advice, diagnosis, or treatment. Seek urgent care for emergencies. ICD-11 codes are for medical reference only.'}
            </span>
          </div>
        </div>
      </div>
    </div>

      {showNotSure ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/30">
          <div className="card-playful w-full max-w-2xl relative overflow-hidden shadow-neo-xl">
            <div className="flex items-start justify-between gap-6 mb-8">
              <div>
                <span className="badge-playful inline-block mb-3">🔍 {locale === 'zh' ? '快速定位' : 'Quick Triage'}</span>
                <div className="text-2xl font-black text-ink">{locale === 'zh' ? '你不确定选哪个？' : 'Not sure what to pick?'}</div>
                <div className="mt-2 text-ink/60 font-bold text-sm">
                  {locale === 'zh' ? '先选一个大类，我们会帮你筛出来。' : 'Pick a category and we will narrow it down.'}
                </div>
              </div>
              <button
                onClick={() => setShowNotSure(false)}
                className="px-4 py-2 rounded-xl border-2 border-ink bg-white font-black text-ink hover:bg-pink-100 transition-all shadow-neo-sm"
              >
                {locale === 'zh' ? '关闭' : 'Close'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  { key: 'respiratory', zh: '🫁 呼吸（咳嗽/感冒）', en: '🫁 Respiratory (cough/cold)' },
                  { key: 'digestive', zh: '🫃 消化（反流/腹泻/便秘）', en: '🫃 Digestive (reflux/diarrhea)' },
                  { key: 'neurology', zh: '🧠 头部/神经（头痛/焦虑）', en: '🧠 Head & Neuro (headache)' },
                  { key: 'sleep', zh: '😴 睡眠（失眠）', en: '😴 Sleep (insomnia)' },
                  { key: 'allergy', zh: '🌸 过敏（鼻炎/荨麻疹）', en: '🌸 Allergy (rhinitis/hives)' },
                  { key: 'skin', zh: '🩹 皮肤（湿疹/痤疮）', en: '🩹 Skin (eczema/acne)' },
                  { key: 'eye', zh: '👁️ 眼部（干涩/红眼）', en: '👁️ Eye (dry eye/pink eye)' },
                  { key: 'ear', zh: '👂 耳部（耳痛/耳鸣）', en: '👂 Ear (ear pain/tinnitus)' },
                  { key: 'women', zh: '🌺 女性健康（痛经/周期）', en: "🌺 Women's Health" },
                  { key: 'urinary', zh: '💧 泌尿（尿路感染）', en: '💧 Urinary (UTI)' },
                  { key: 'oral_throat', zh: '🦷 口腔/咽喉（溃疡/咽痛）', en: '🦷 Oral & Throat' }
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
                  className="p-4 rounded-2xl border-2 border-ink bg-mint-50 hover:bg-mint-100 transition-all text-left shadow-neo-sm hover:shadow-neo-none hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  <div className="font-black text-ink text-sm">{locale === 'zh' ? c.zh : c.en}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

