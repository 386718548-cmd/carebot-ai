'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from '@/hooks/useI18n';
import type { MatchResult } from '@/lib/decision-engine';
import { openNearbyInMaps } from '@/lib/nearby';
import { AlertTriangle, Hospital, Info, MapPin, Pill, ShieldCheck, Sparkles } from 'lucide-react';

type StoredResults = {
  symptomId?: string;
  createdAt: number;
  results: MatchResult[];
};

function loadStoredResults(): StoredResults | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem('carebot_last_results');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredResults;
    if (!parsed || !Array.isArray(parsed.results)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function ResultsPage() {
  const { locale } = useLocale();
  const mt = useTranslations('Medicines');
  const st = useTranslations('Survey');
  const [stored, setStored] = useState<StoredResults | null>(null);
  const [isOpeningMap, setIsOpeningMap] = useState(false);

  useEffect(() => {
    setStored(loadStoredResults());
  }, []);

  const results = stored?.results || null;

  const firstRes = useMemo(() => {
    if (!results || results.length === 0) return null;
    return results[0];
  }, [results]);

  const hasAdvice = !!firstRes && firstRes.lifestyleAdvice[locale].length > 0;
  const hasAlerts = !!firstRes && firstRes.comorbidityAlerts[locale].length > 0;

  if (!results) {
    return (
      <div className="max-w-3xl mx-auto px-8 py-24">
        <div className="card-playful text-center">
          <div className="text-3xl font-black text-ink mb-4">{locale === 'zh' ? '暂无结果' : 'No results yet'}</div>
          <div className="text-ink/60 font-bold mb-10">
            {locale === 'zh' ? '请先完成问卷，我们会在这里展示推荐与购买指引。' : 'Finish a questionnaire to see recommendations here.'}
          </div>
          <Link href="/symptoms" className="btn-pink w-fit mx-auto inline-flex items-center gap-3">
            <Sparkles size={20} />
            {locale === 'zh' ? '开始症状自查' : 'Start Symptom Check'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-black text-ink tracking-tight leading-[1.1]">
            {results.length > 0
              ? locale === 'zh'
                ? <>匹配到 <span style={{ color: '#f03384' }}>{results.length}</span> 款建议</>
                : <>Found <span style={{ color: '#f03384' }}>{results.length}</span> matches</>
              : locale === 'zh'
                ? '未找到完全匹配的药品'
                : 'No direct matches found'}
          </h1>
          <p className="mt-6 text-xl text-ink/50 font-medium">
            {locale === 'zh'
              ? '以下推荐基于临床指南与药品说明书，按匹配度与证据等级排序。'
              : 'Recommendations are based on clinical guidance and labels, sorted by match and evidence.'}
          </p>
        </div>
        <Link href="/symptoms" className="btn-mint flex items-center gap-3 w-fit">
          {locale === 'zh' ? '← 重新开始' : '← Start over'}
        </Link>
      </div>

      {(hasAdvice || hasAlerts) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {hasAdvice && firstRes ? (
            <div className="card-mint !p-10">
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-3 text-ink">
                <Sparkles size={20} />
                {locale === 'zh' ? '生活方式建议' : 'Lifestyle advice'}
              </h4>
              <ul className="space-y-4">
                {firstRes.lifestyleAdvice[locale].map((adv, i) => (
                  <li key={i} className="text-base text-ink/70 font-bold flex gap-3">
                    <span className="text-mint-500">•</span> {adv}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {hasAlerts && firstRes ? (
            <div className="card-yellow !p-10">
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-3 text-ink">
                <AlertTriangle size={20} />
                {locale === 'zh' ? '共病风险提示' : 'Comorbidity alerts'}
              </h4>
              <ul className="space-y-4">
                {firstRes.comorbidityAlerts[locale].map((alt, i) => (
                  <li key={i} className="text-base text-ink/70 font-bold flex gap-3">
                    <span style={{ color: '#f59e0b' }}>!</span> {alt}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {results.map((res) => (
            <div key={res.medicine.id} className="card-playful relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-10">
                <div className="flex gap-6">
                  <div className="w-20 h-20 border-2 border-ink rounded-2xl flex items-center justify-center shadow-neo-sm shrink-0" style={{ backgroundColor: '#ffd6e7' }}>
                    <Pill size={36} className="text-ink" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-ink mb-1 tracking-tight">{res.medicine.name}</h3>
                    <p className="text-sm text-ink/40 font-bold mb-3 uppercase tracking-wider">{res.medicine.generic_name}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="badge-playful">{locale === 'zh' ? '匹配度' : 'Match'}: {res.score.toFixed(1)}</span>
                      <span className="badge-yellow">{locale === 'zh' ? '证据' : 'Evidence'}: {res.medicine.evidence_level}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="font-black text-ink/60 uppercase text-[10px] tracking-[0.3em] mb-4 flex items-center gap-3">
                      <Info size={18} /> {mt('dosage')}
                    </h4>
                    <p className="text-sm text-ink/70 font-bold leading-relaxed">{res.medicine.dosage[locale]}</p>
                  </div>
                  <div>
                    <h4 className="font-black text-ink/60 uppercase text-[10px] tracking-[0.3em] mb-4 flex items-center gap-3">
                      <AlertTriangle size={18} /> {mt('warnings')}
                    </h4>
                    <ul className="text-sm text-ink/60 space-y-3 font-bold">
                      {res.warnings[locale].map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <Link
                    href={`/medicines/${encodeURIComponent(res.medicine.id)}`}
                    className="btn-warm w-full flex items-center justify-center gap-2"
                  >
                    <Pill size={20} />
                    {locale === 'zh' ? '打开大字版说明书' : 'Open Large-Print Guide'}
                  </Link>
                  <a
                    href={`https://www.amazon.com/s?k=${encodeURIComponent(res.medicine.generic_name ?? res.medicine.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-yellow w-full flex items-center justify-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    {locale === 'zh' ? '在亚马逊查看价格' : 'View on Amazon'}
                  </a>
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
                      {locale === 'zh' ? (isOpeningMap ? '正在打开...' : '附近药店') : isOpeningMap ? 'Opening...' : 'Nearby pharmacies'}
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
                      {locale === 'zh' ? (isOpeningMap ? '正在打开...' : '附近医院') : isOpeningMap ? 'Opening...' : 'Nearby hospitals'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-12">
          <div className="card-playful !bg-ink text-white !p-10">
            <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-3 text-white/60">
              <ShieldCheck size={20} />
              {locale === 'zh' ? '安全提示' : 'Safety'}
            </h4>
            <p className="text-base text-white/70 font-medium mb-10 italic leading-relaxed">"{st('safety_warning')}"</p>
            <div className="p-5 rounded-2xl border border-white/10 text-white/50 text-xs leading-relaxed font-bold" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              {locale === 'zh'
                ? '如症状严重、持续或出现红旗征，请立即就医。'
                : 'Seek urgent care for severe, persistent, or red-flag symptoms.'}
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-center mt-12 font-bold" style={{ color: 'rgba(26,27,25,0.35)' }}>
        {locale === 'zh'
          ? '本工具信息仅供参考，不替代医生诊断。部分药品链接为赞助链接，我们可能获得佣金。'
          : 'Information is for reference only and does not replace medical advice. Some links are sponsored and we may earn a commission.'}
      </p>
    </div>
  );
}
