'use client';

import { useState, useEffect } from 'react';
import { Phone, MapPin, X, AlertTriangle, ChevronDown } from 'lucide-react';
import { openNearbyInMaps } from '@/lib/nearby';
import { useLocale } from '@/hooks/useI18n';

/* ── Emergency number by country code ── */
const EMERGENCY_NUMBERS: Record<string, { number: string; label: string }> = {
  CN: { number: '120', label: '急救' },
  US: { number: '911', label: 'Emergency' },
  GB: { number: '999', label: 'Emergency' },
  AU: { number: '000', label: 'Emergency' },
  CA: { number: '911', label: 'Emergency' },
  DE: { number: '112', label: 'Notruf' },
  FR: { number: '15',  label: 'SAMU' },
  JP: { number: '119', label: '救急' },
  KR: { number: '119', label: '응급' },
  SG: { number: '995', label: 'Emergency' },
  HK: { number: '999', label: '緊急' },
  TW: { number: '119', label: '緊急' },
};
const DEFAULT_EMERGENCY = { number: '112', label: 'Emergency' };

/* Detect country via IP (best-effort, no API key needed) */
async function detectCountry(): Promise<string> {
  try {
    const res = await fetch('https://ipapi.co/country/', { signal: AbortSignal.timeout(3000) });
    if (res.ok) return (await res.text()).trim().toUpperCase();
  } catch { /* ignore */ }
  return 'US';
}

export function EmergencyButton() {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [country, setCountry] = useState('US');
  const [isOpeningMap, setIsOpeningMap] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  useEffect(() => {
    detectCountry().then(setCountry);
  }, []);

  const emergency = EMERGENCY_NUMBERS[country] ?? DEFAULT_EMERGENCY;

  const handleCall = () => {
    if (!confirmed) { setConfirmed(true); return; }
    window.location.href = `tel:${emergency.number}`;
    setConfirmed(false);
  };

  const handleHospital = async () => {
    if (isOpeningMap) return;
    setIsOpeningMap(true);
    try {
      await openNearbyInMaps({ type: 'hospital', locale, prefer: 'google' });
    } finally {
      setIsOpeningMap(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[998] bg-ink/20 backdrop-blur-sm"
          onClick={() => { setOpen(false); setConfirmed(false); }}
        />
      )}

      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3">

        {/* Expanded panel */}
        {open && (
          <div className="card-playful !p-6 w-72 shadow-neo-xl animate-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center shadow-neo-sm">
                  <AlertTriangle size={16} className="text-white" />
                </div>
                <span className="font-black text-ink text-sm uppercase tracking-widest">
                  {locale === 'zh' ? '紧急帮助' : 'Emergency Help'}
                </span>
              </div>
              <button
                onClick={() => { setOpen(false); setConfirmed(false); }}
                className="w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center hover:bg-ink/5 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-ink/50 font-bold leading-relaxed mb-5 bg-pink-50 rounded-xl p-3 border border-pink-100">
              {locale === 'zh'
                ? '本工具仅提供紧急情况指引。急救服务由当地医疗机构提供，请自行拨打。'
                : 'This tool provides emergency guidance only. Emergency services are provided by local authorities.'}
            </p>

            {/* Country selector */}
            <div className="mb-4">
              <div className="text-[10px] font-black text-ink/40 uppercase tracking-widest mb-2">
                {locale === 'zh' ? '所在地区' : 'Your Region'}
              </div>
              <button
                onClick={() => setShowCountryPicker(v => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-ink/20 bg-white text-sm font-black text-ink hover:border-ink/40 transition-colors"
              >
                <span>{country} — {emergency.label} {emergency.number}</span>
                <ChevronDown size={14} className={`transition-transform ${showCountryPicker ? 'rotate-180' : ''}`} />
              </button>
              {showCountryPicker && (
                <div className="mt-1 rounded-xl border-2 border-ink/20 bg-white overflow-hidden shadow-neo-sm max-h-40 overflow-y-auto">
                  {Object.entries(EMERGENCY_NUMBERS).map(([code, info]) => (
                    <button
                      key={code}
                      onClick={() => { setCountry(code); setShowCountryPicker(false); setConfirmed(false); }}
                      className={`w-full text-left px-4 py-2 text-sm font-black hover:bg-pink-50 transition-colors ${country === code ? 'bg-pink-50 text-pink-500' : 'text-ink'}`}
                    >
                      {code} — {info.label} {info.number}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Call button */}
            <a
              href={`tel:${emergency.number}`}
              onClick={(e) => {
                if (!confirmed) {
                  e.preventDefault();
                  setConfirmed(true);
                }
              }}
              className={`w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl border-2 border-ink font-black text-base shadow-neo-sm transition-all mb-3 ${
                confirmed
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              <Phone size={18} />
              {confirmed
                ? (locale === 'zh' ? `确认拨打 ${emergency.number}` : `Confirm call ${emergency.number}`)
                : (locale === 'zh' ? `拨打急救 ${emergency.number}` : `Call ${emergency.label} ${emergency.number}`)}
            </a>

            {confirmed && (
              <p className="text-[11px] text-red-600 font-black text-center mb-3">
                {locale === 'zh' ? '再次点击确认拨打，或点击其他地方取消' : 'Click again to confirm, or tap elsewhere to cancel'}
              </p>
            )}

            {/* Hospital map button */}
            <button
              onClick={handleHospital}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl border-2 border-ink bg-yellow-50 text-ink font-black text-sm shadow-neo-sm hover:bg-yellow-100 transition-colors"
            >
              <MapPin size={18} />
              {isOpeningMap
                ? (locale === 'zh' ? '正在打开地图...' : 'Opening map...')
                : (locale === 'zh' ? '导航到最近医院' : 'Navigate to Hospital')}
            </button>
          </div>
        )}

        {/* FAB trigger */}
        <button
          onClick={() => { setOpen(v => !v); setConfirmed(false); }}
          aria-label={locale === 'zh' ? '紧急帮助' : 'Emergency Help'}
          className="relative w-14 h-14 rounded-full bg-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          style={{ boxShadow: '0 4px 20px rgba(239,68,68,0.35), 0 1px 4px rgba(0,0,0,0.12)' }}
        >
          {/* pulse ring — only when closed */}
          {!open && (
            <span className="absolute inset-0 rounded-full bg-red-400 opacity-30 animate-ping" />
          )}
          <span className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-ink' : 'bg-red-500'}`}>
            {open ? (
              <X size={18} className="text-white" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" fill="white" opacity="0.15"/>
                <rect x="11" y="5" width="2.2" height="14" rx="1.1" fill="white"/>
                <rect x="5" y="11" width="14" height="2.2" rx="1.1" fill="white"/>
              </svg>
            )}
          </span>
        </button>
      </div>
    </>
  );
}
