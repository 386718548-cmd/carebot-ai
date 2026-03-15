'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Pill, ArrowRight } from 'lucide-react';
import { medicines } from '@/data/medicines';
import { useLocale } from '@/hooks/useI18n';
import { searchMedicines } from '@/lib/medicine-search';

function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

export default function MedicinesPage() {
  const { locale } = useLocale();
  const [query, setQuery] = useState('');

  const { results: filtered, suggestions } = useMemo(() => {
    return searchMedicines(query, medicines, locale);
  }, [query, locale]);

  return (
    <div className="max-w-7xl mx-auto px-8 py-20 min-h-[85vh]">
      <div className="mb-14 flex flex-col gap-4">
        <div className="badge-warm">{locale === 'zh' ? 'OTC 目录' : 'OTC Directory'}</div>
        <h1 className="text-5xl md:text-6xl font-black text-warm-900 tracking-tight">
          {locale === 'zh' ? '药品说明书（大字版）' : 'Medicine Guides (Large Print)'}
        </h1>
        <p className="text-lg text-warm-800/60 font-medium max-w-3xl">
          {locale === 'zh'
            ? '按药名、通用名、成分或关键词搜索。每个药品都提供简明要点与语音朗读。'
            : 'Search by brand, generic name, ingredients, or keywords. Each medicine includes a concise guide and read-aloud.'}
        </p>
      </div>

      <div className="card-warm !p-10 mb-12">
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <div className="flex items-center gap-4 flex-1 bg-warm-50/70 border border-warm-100 rounded-[2rem] px-6 py-5">
            <Search size={22} className="text-warm-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={locale === 'zh' ? '搜索：例如 Tylenol / 对乙酰氨基酚 / 失眠 / 胃溃疡' : 'Search: Tylenol / acetaminophen / insomnia / ulcer'}
              className="w-full bg-transparent outline-none text-lg font-bold text-warm-900 placeholder:text-warm-400"
              inputMode="search"
            />
          </div>
          <div className="text-sm font-black text-warm-400 uppercase tracking-[0.2em]">
            {locale === 'zh' ? `结果：${filtered.length}` : `Results: ${filtered.length}`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {filtered.map((m) => (
          <Link
            key={m.id}
            href={`/medicines/${encodeURIComponent(m.id)}`}
            className="card-warm !p-10 group hover:shadow-3xl hover:shadow-warm-200/30 transition-all"
          >
            <div className="flex items-start justify-between gap-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-warm-100 text-warm-600 rounded-[2rem] flex items-center justify-center shrink-0">
                  <Pill size={30} />
                </div>
                <div className="min-w-0">
                  <div className="text-2xl font-black text-warm-900 tracking-tight truncate">{m.name}</div>
                  <div className="text-xs text-warm-400 font-black uppercase tracking-wider mt-2 truncate">
                    {m.generic_name ? m.generic_name : (locale === 'zh' ? '通用名未标注' : 'Generic not listed')}
                  </div>
                  <div className="mt-5 text-sm text-warm-800/60 font-bold leading-relaxed line-clamp-2">
                    {m.indications.structured.description[locale]}
                  </div>
                </div>
              </div>
              <ArrowRight size={22} className="text-warm-300 group-hover:text-warm-600 transition-colors mt-2 shrink-0" />
            </div>

            <div className="mt-8 pt-6 border-t border-warm-100 flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-warm-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                {m.atc_code ? `ATC: ${m.atc_code}` : 'ATC'}
              </span>
              <span className="px-3 py-1 bg-warm-50 text-warm-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-warm-100">
                {locale === 'zh' ? `证据等级：${m.evidence_level}` : `Evidence: ${m.evidence_level}`}
              </span>
              <span className="px-3 py-1 bg-sage-50 text-sage-700 text-[10px] font-black rounded-full uppercase tracking-widest">
                {locale === 'zh' ? '大字版' : 'Large Print'}
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-widest">
                {locale === 'zh' ? '可朗读' : 'Read-aloud'}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && query.trim() && (
        <div className="mt-12 card-warm !p-12">
          <h2 className="text-2xl font-black text-warm-900 tracking-tight">
            {locale === 'zh' ? '未找到完全匹配' : 'No exact matches'}
          </h2>
          <p className="mt-3 text-warm-800/60 font-bold">
            {locale === 'zh'
              ? '可能是商品名/通用名差异、拼写问题，或该药尚未收录。'
              : 'This may be due to brand/generic differences, typos, or the medicine not being included yet.'}
          </p>

          {suggestions.length > 0 && (
            <div className="mt-8">
              <div className="text-xs font-black text-warm-400 uppercase tracking-[0.2em] mb-4">
                {locale === 'zh' ? '你是不是想找' : 'Did you mean'}
              </div>
              <div className="flex flex-wrap gap-3">
                {suggestions.map((m) => (
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
      )}
    </div>
  );
}
