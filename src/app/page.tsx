'use client';

import { useTranslations, useLocale } from '@/hooks/useI18n';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Activity, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

/* ── SVG Medical Illustration Icons ── */
function Stethoscope({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* left earpiece stem — angled outward then down */}
      <path d="M38 18 L38 30 C38 42 52 50 52 62" stroke="#1a1b19" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      {/* right earpiece stem */}
      <path d="M82 18 L82 30 C82 42 68 50 68 62" stroke="#1a1b19" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      {/* tube going down from junction to chest piece */}
      <path d="M52 62 C52 72 68 72 68 62 M60 68 L60 90" stroke="#1a1b19" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* chest piece outer ring */}
      <circle cx="60" cy="103" r="14" fill="#ffd6e7" stroke="#1a1b19" strokeWidth="4"/>
      {/* chest piece inner dot */}
      <circle cx="60" cy="103" r="6" fill="#ff6eb4" stroke="#1a1b19" strokeWidth="2.5"/>
      {/* left earpiece tip */}
      <circle cx="38" cy="14" r="6" fill="#ffadd0" stroke="#1a1b19" strokeWidth="3"/>
      {/* right earpiece tip */}
      <circle cx="82" cy="14" r="6" fill="#ffadd0" stroke="#1a1b19" strokeWidth="3"/>
    </svg>
  );
}

function Pill({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* left half — hot pink */}
      <path d="M60 2 L60 52 L27 52 A27 27 0 0 1 27 2 Z" fill="#ff85b8"/>
      {/* right half — light pink */}
      <path d="M60 2 L60 52 L93 52 A27 27 0 0 0 93 2 Z" fill="#ffd6e7"/>
      {/* outline */}
      <rect x="2" y="2" width="116" height="50" rx="25" fill="none" stroke="#1a1b19" strokeWidth="4"/>
      {/* seam */}
      <line x1="60" y1="2" x2="60" y2="52" stroke="#1a1b19" strokeWidth="3.5"/>
      {/* shine */}
      <ellipse cx="32" cy="14" rx="13" ry="5" fill="white" opacity="0.4" transform="rotate(-8,32,14)"/>
    </svg>
  );
}

function Flask({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 10 L28 55 L8 95 C5 102 10 112 18 112 L62 112 C70 112 75 102 72 95 L52 55 L52 10 Z" fill="#d4f7b8" stroke="#1a1b19" strokeWidth="4" strokeLinejoin="round"/>
      <path d="M28 55 L8 95 C5 102 10 112 18 112 L62 112 C70 112 75 102 72 95 L52 55 Z" fill="#9de85c" stroke="none"/>
      <line x1="22" y1="10" x2="58" y2="10" stroke="#1a1b19" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="30" cy="85" r="5" fill="white" opacity="0.6"/>
      <circle cx="50" cy="95" r="3" fill="white" opacity="0.6"/>
    </svg>
  );
}

function Clipboard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 90 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="15" width="74" height="90" rx="8" fill="white" stroke="#1a1b19" strokeWidth="4"/>
      <rect x="28" y="5" width="34" height="20" rx="6" fill="#fcd34d" stroke="#1a1b19" strokeWidth="4"/>
      <line x1="22" y1="45" x2="68" y2="45" stroke="#1a1b19" strokeWidth="3" strokeLinecap="round"/>
      <line x1="22" y1="60" x2="68" y2="60" stroke="#1a1b19" strokeWidth="3" strokeLinecap="round"/>
      <line x1="22" y1="75" x2="50" y2="75" stroke="#1a1b19" strokeWidth="3" strokeLinecap="round"/>
      <polyline points="22,88 28,96 42,80" stroke="#9de85c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Bandage({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="110" height="50" rx="10" fill="#fef3c7" stroke="#1a1b19" strokeWidth="4"/>
      <rect x="35" y="5" width="50" height="50" fill="#fcd34d" stroke="#1a1b19" strokeWidth="2"/>
      <circle cx="60" cy="30" r="8" fill="white" stroke="#1a1b19" strokeWidth="3"/>
      <line x1="60" y1="24" x2="60" y2="36" stroke="#1a1b19" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="54" y1="30" x2="66" y2="30" stroke="#1a1b19" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="18" cy="20" r="3" fill="#1a1b19" opacity="0.2"/>
      <circle cx="18" cy="40" r="3" fill="#1a1b19" opacity="0.2"/>
      <circle cx="102" cy="20" r="3" fill="#1a1b19" opacity="0.2"/>
      <circle cx="102" cy="40" r="3" fill="#1a1b19" opacity="0.2"/>
    </svg>
  );
}

/* ── Nature / Herb decorative SVGs ── */
function Daisy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* petals */}
      {[0,40,80,120,160,200,240,280,320].map((deg, i) => (
        <ellipse key={i}
          cx="50" cy="50"
          rx="7" ry="20"
          fill="white"
          stroke="#1a1b19" strokeWidth="1.5"
          transform={`rotate(${deg} 50 50) translate(0 -22)`}
        />
      ))}
      {/* center */}
      <circle cx="50" cy="50" r="14" fill="#fbbf24" stroke="#1a1b19" strokeWidth="2"/>
      <circle cx="50" cy="50" r="8" fill="#f59e0b"/>
      {/* center dots */}
      {[0,60,120,180,240,300].map((deg, i) => (
        <circle key={i} cx={50 + 5 * Math.cos(deg * Math.PI / 180)} cy={50 + 5 * Math.sin(deg * Math.PI / 180)} r="1.5" fill="#1a1b19" opacity="0.5"/>
      ))}
    </svg>
  );
}

function HerbLeaf({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* stem */}
      <path d="M30 95 Q28 70 30 50 Q32 30 30 10" stroke="#4aaa10" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* left leaf */}
      <path d="M30 60 Q10 50 8 35 Q20 30 30 45" fill="#9de85c" stroke="#4aaa10" strokeWidth="1.5"/>
      {/* right leaf */}
      <path d="M30 45 Q50 35 52 20 Q40 15 30 30" fill="#b8f08a" stroke="#4aaa10" strokeWidth="1.5"/>
      {/* top leaf */}
      <path d="M30 30 Q20 15 22 5 Q35 8 30 25" fill="#9de85c" stroke="#4aaa10" strokeWidth="1.5"/>
    </svg>
  );
}

function Dropper({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 50 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* bottle body */}
      <rect x="12" y="30" width="26" height="70" rx="8" fill="#d4f7b8" stroke="#1a1b19" strokeWidth="2.5"/>
      {/* bottle neck */}
      <rect x="18" y="18" width="14" height="16" rx="3" fill="#b8f08a" stroke="#1a1b19" strokeWidth="2"/>
      {/* dropper cap */}
      <rect x="16" y="8" width="18" height="12" rx="4" fill="#1a1b19"/>
      {/* dropper tip */}
      <path d="M25 100 Q22 108 25 115 Q28 108 25 100" fill="#9de85c" stroke="#4aaa10" strokeWidth="1"/>
      {/* liquid level */}
      <rect x="14" y="70" width="22" height="28" rx="0 0 6 6" fill="#9de85c" opacity="0.6"/>
      {/* label line */}
      <line x1="16" y1="55" x2="34" y2="55" stroke="#1a1b19" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <line x1="16" y1="62" x2="28" y2="62" stroke="#1a1b19" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

function Capsule({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 88 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* left half: hot pink — left semicircle + rect to center */}
      <path d="M44 2 L44 38 L22 38 A20 20 0 0 1 22 2 Z" fill="#ff6eb4"/>
      {/* right half: light pink — right semicircle + rect from center */}
      <path d="M44 2 L44 38 L66 38 A20 20 0 0 0 66 2 Z" fill="#ffc2dc"/>
      {/* outline */}
      <rect x="2" y="2" width="84" height="36" rx="18" fill="none" stroke="#1a1b19" strokeWidth="2.8"/>
      {/* seam */}
      <line x1="44" y1="2" x2="44" y2="38" stroke="#1a1b19" strokeWidth="2"/>
      {/* shine */}
      <ellipse cx="24" cy="12" rx="10" ry="4" fill="white" opacity="0.45" transform="rotate(-8,24,12)"/>
    </svg>
  );
}

function MortarPestle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* bowl */}
      <path d="M10 35 Q10 80 50 80 Q90 80 90 35 Z" fill="#ffd6e7" stroke="#1a1b19" strokeWidth="3"/>
      {/* rim */}
      <ellipse cx="50" cy="35" rx="40" ry="10" fill="#ffadd0" stroke="#1a1b19" strokeWidth="3"/>
      {/* pestle */}
      <path d="M65 10 Q70 30 60 50" stroke="#1a1b19" strokeWidth="5" strokeLinecap="round"/>
      <ellipse cx="62" cy="52" rx="7" ry="4" fill="#ff85b8" stroke="#1a1b19" strokeWidth="2"/>
      {/* herbs inside */}
      <circle cx="35" cy="55" r="4" fill="#9de85c" opacity="0.7"/>
      <circle cx="45" cy="60" r="3" fill="#b8f08a" opacity="0.7"/>
      <circle cx="55" cy="55" r="3.5" fill="#9de85c" opacity="0.7"/>
    </svg>
  );
}

export default function Home() {
  const t = useTranslations('Index');
  const { locale } = useLocale();

  return (
    <div className="flex flex-col">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b-2 border-ink" style={{ backgroundColor: '#fce8f0' }}>

        {/* Subtle dot pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle, #1a1b19 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />

        {/* SVG Medical Illustrations — scattered */}
        <motion.div animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-8 right-[5%] hidden lg:block pointer-events-none">
          <Stethoscope className="w-32 h-32 drop-shadow-md" />
        </motion.div>

        <motion.div initial={{ rotate: -25 }} animate={{ y: [0, 10, 0], rotate: [-25, -15, -25] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute bottom-16 right-[16%] hidden lg:block pointer-events-none">
          <Pill className="w-28 h-14 drop-shadow-md" />
        </motion.div>

        <motion.div animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute top-[15%] right-[22%] hidden lg:block pointer-events-none">
          <Flask className="w-16 h-24 drop-shadow-md" />
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0], rotate: [0, -4, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          className="absolute bottom-8 right-[4%] hidden lg:block pointer-events-none">
          <Clipboard className="w-20 h-24 drop-shadow-md" />
        </motion.div>

        <motion.div animate={{ y: [0, -10, 0], rotate: [-6, 0, -6] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[40%] left-[2%] hidden lg:block pointer-events-none">
          <Bandage className="w-24 h-12 drop-shadow-md" />
        </motion.div>

        {/* Small pill top-left */}
        <motion.div initial={{ rotate: -30 }} animate={{ y: [0, 6, 0], rotate: [-30, -20, -30] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-10 left-[8%] hidden lg:block pointer-events-none">
          <Pill className="w-16 h-8 drop-shadow-sm opacity-70" />
        </motion.div>

        {/* ── Nature / Herb decorations ── */}
        {/* Daisy top-left corner */}
        <motion.div animate={{ rotate: [0, 8, 0], y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-4 left-[1%] hidden lg:block pointer-events-none opacity-90">
          <Daisy className="w-20 h-20 drop-shadow-md" />
        </motion.div>

        {/* Daisy bottom-right */}
        <motion.div animate={{ rotate: [0, -10, 0], y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="absolute bottom-4 right-[1%] hidden lg:block pointer-events-none opacity-80">
          <Daisy className="w-28 h-28 drop-shadow-md" />
        </motion.div>

        {/* Small daisy mid-left */}
        <motion.div animate={{ rotate: [5, -5, 5], scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
          className="absolute top-[60%] left-[5%] hidden lg:block pointer-events-none opacity-70">
          <Daisy className="w-14 h-14" />
        </motion.div>

        {/* Herb leaf left */}
        <motion.div animate={{ rotate: [-5, 5, -5], y: [0, -8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-[20%] left-[12%] hidden lg:block pointer-events-none opacity-80">
          <HerbLeaf className="w-10 h-16 drop-shadow-sm" />
        </motion.div>

        {/* Herb leaf right */}
        <motion.div animate={{ rotate: [5, -5, 5], y: [0, 6, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
          className="absolute bottom-[20%] right-[10%] hidden lg:block pointer-events-none opacity-70">
          <HerbLeaf className="w-8 h-14 drop-shadow-sm" />
        </motion.div>

        {/* Dropper bottle */}
        <motion.div animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
          className="absolute top-[8%] left-[18%] hidden lg:block pointer-events-none">
          <Dropper className="w-10 h-24 drop-shadow-md" />
        </motion.div>

        {/* Capsules scattered */}
        <motion.div initial={{ rotate: -30 }} animate={{ y: [0, 7, 0], rotate: [-30, -20, -30] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          className="absolute top-[75%] left-[15%] hidden lg:block pointer-events-none">
          <Capsule className="w-20 h-10 drop-shadow-sm" />
        </motion.div>

        <motion.div initial={{ rotate: -35 }} animate={{ y: [0, -5, 0], rotate: [-35, -25, -35] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
          className="absolute top-[30%] right-[3%] hidden lg:block pointer-events-none">
          <Capsule className="w-16 h-8 drop-shadow-sm opacity-80" />
        </motion.div>

        {/* Mortar & Pestle */}
        <motion.div animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute bottom-[5%] left-[28%] hidden lg:block pointer-events-none">
          <MortarPestle className="w-20 h-18 drop-shadow-md" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: text */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="flex flex-col gap-8">

              <div className="flex flex-wrap gap-3">
                <span className="badge-pink">🔬 {locale === 'zh' ? '安全优先' : 'Safety-first'}</span>
                <span className="badge-playful">✦ {locale === 'zh' ? 'OTC 用药指引' : 'OTC Medicine Guide'}</span>
              </div>

              <h1 className="text-6xl md:text-7xl font-black leading-[1.05] tracking-tight" style={{ color: '#2d3a8c' }}>
                {locale === 'zh' ? (
                  <>
                    从此
                    <span className="relative inline-block mx-2">
                      <span className="relative z-10">舒适</span>
                      <span className="absolute inset-x-0 bottom-1 h-4 bg-yellow-300 -z-0 rounded-sm"></span>
                    </span>
                    生活。
                  </>
                ) : (
                  <>
                    Feel{' '}
                    <span className="relative inline-block">
                      <span className="relative z-10">Better</span>
                      <span className="absolute inset-x-0 bottom-1 h-4 bg-yellow-300 -z-0 rounded-sm"></span>
                    </span>{' '}
                    Today.
                  </>
                )}
              </h1>

              <p className="text-xl text-ink/60 leading-relaxed max-w-lg font-medium">
                {locale === 'zh'
                  ? '没有冰冷的诊疗，只有为您健康而生的智能引导。安全、活泼、专业。'
                  : 'No clinical coldness here — just smart, playful guidance for your well-being.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Link href="/survey" className="btn-pink flex items-center justify-center gap-2 text-lg">
                  <span>🩺</span>{t('start_survey')}
                </Link>
                <Link href="/symptoms" className="btn-mint flex items-center justify-center gap-2 text-lg">
                  {locale === 'zh' ? '直接选症状' : 'Browse Symptoms'}<ArrowRight size={18} />
                </Link>
              </div>

              <div className="flex flex-wrap gap-3 mt-2">
                {[
                  { icon: '🔒', label: locale === 'zh' ? '数据安全' : 'Data Safe' },
                  { icon: '📋', label: locale === 'zh' ? '临床验证' : 'Clinically Verified' },
                  { icon: '⚡', label: locale === 'zh' ? '即时结果' : 'Instant Results' },
                ].map((p) => (
                  <span key={p.label} className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-ink rounded-xl text-sm font-black shadow-neo-sm">
                    {p.icon} {p.label}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right: mock card */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block">
              <div className="relative">
                <div className="card-playful relative overflow-hidden shadow-neo-xl" style={{ backgroundColor: 'white' }}>
                  <div className="absolute top-4 right-4 opacity-20">
                    <Flask className="w-12 h-16" />
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 border-2 border-ink rounded-2xl flex items-center justify-center shadow-neo overflow-hidden" style={{ backgroundColor: '#fce8f0' }}>
                      <Stethoscope className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="font-black text-ink text-xl">{locale === 'zh' ? '个性化建议' : 'Personalized Rec'}</h3>
                      <p className="text-sm text-ink/50 font-bold">{locale === 'zh' ? '基于您的症状' : 'Based on your symptoms'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { bg: '#ffd6e7', label: locale === 'zh' ? '助眠建议' : 'Sleep Support', icon: '😴', score: 95 },
                      { bg: '#fef3c7', label: locale === 'zh' ? '头痛缓解' : 'Headache Relief', icon: '🤕', score: 82 },
                      { bg: '#d4f7b8', label: locale === 'zh' ? '过敏控制' : 'Allergy Control', icon: '🌸', score: 78 },
                    ].map((item) => (
                      <div key={item.label} className="border-2 border-ink rounded-2xl p-4 flex items-center justify-between shadow-neo" style={{ backgroundColor: item.bg }}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="font-black text-ink">{item.label}</span>
                        </div>
                        <span className="font-black text-ink text-sm bg-white border border-ink rounded-lg px-2 py-1">{item.score}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t-2 border-ink/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-ink/40 uppercase tracking-widest">{locale === 'zh' ? '匹配进度' : 'Match Progress'}</span>
                      <span className="text-xs font-black text-ink">100%</span>
                    </div>
                    <div className="h-3 bg-gray-100 border-2 border-ink rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2, delay: 0.5 }}
                        className="h-full rounded-full" style={{ backgroundColor: '#9de85c' }} />
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 -left-5 border-2 border-ink rounded-2xl px-5 py-3 shadow-neo-md font-black text-ink text-sm" style={{ backgroundColor: '#fcd34d' }}>
                  🏥 {locale === 'zh' ? '10,000+ 用户信赖' : '10,000+ Users Trust Us'}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-white border-b-2 border-ink">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="badge-playful mb-4 inline-block">🔬 {locale === 'zh' ? '使用流程' : 'How It Works'}</span>
            <h2 className="text-5xl font-black text-ink mt-4 tracking-tight">{t('how_it_works')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                svg: <Stethoscope className="w-16 h-16" />,
                bg: 'card-pink',
                step: '01',
                title: t('step1'),
                desc: locale === 'zh' ? '在友好、无压力的问卷中告诉我们您的不适。' : 'Tell us about your discomfort in our friendly questionnaire.',
              },
              {
                svg: <Flask className="w-12 h-16" />,
                bg: 'card-mint',
                step: '02',
                title: t('step2'),
                desc: locale === 'zh' ? '我们的 AI 以深刻的临床共情分析您的独特情况。' : 'Our AI analyzes your unique situation with clinical empathy.',
              },
              {
                svg: <Pill className="w-20 h-10" />,
                bg: 'card-yellow',
                step: '03',
                title: t('step3'),
                desc: locale === 'zh' ? '获得精确的、经过验证的药品选择及本地价格指导。' : 'Receive safe, verified medicine choices with local price guidance.',
              },
            ].map((step, idx) => (
              <motion.div key={idx} whileHover={{ y: -6, rotate: idx % 2 === 0 ? 1 : -1 }} className={`${step.bg} relative`}>
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-ink text-paper rounded-xl flex items-center justify-center font-black text-sm shadow-neo-sm">
                  {step.step}
                </div>
                <div className="mb-6">{step.svg}</div>
                <h3 className="text-2xl font-black text-ink mb-3">{step.title}</h3>
                <p className="text-ink/60 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALERT LEVELS ── */}
      <section className="py-24 border-b-2 border-ink" style={{ backgroundColor: '#fce8f0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <span className="badge-yellow inline-block mb-4">⚠️ {locale === 'zh' ? '临床提示机制' : 'Clinical Alerting'}</span>
            <h2 className="text-4xl font-black tracking-tight mt-4" style={{ color: '#2d3a8c' }}>
              {locale === 'zh' ? '提醒分级，避免"警报疲劳"' : 'Stepped Alerts, Less Fatigue'}
            </h2>
            <p className="mt-4 text-ink/60 font-medium leading-relaxed">
              {locale === 'zh' ? '我们只在关键时刻提醒你，并解释"为什么"。' : 'We alert only when it matters, and always explain why.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-mint">
              <div className="flex items-center gap-2 mb-4">
                <Info size={20} className="text-ink" />
                <span className="font-black text-xs uppercase tracking-widest text-ink/60">{locale === 'zh' ? '1级 · 一般提示' : 'Level 1 · Info'}</span>
              </div>
              <div className="text-2xl font-black text-ink mb-2">{locale === 'zh' ? '小窗提示' : 'Small Nudge'}</div>
              <p className="text-sm font-bold text-ink/60 leading-relaxed">{locale === 'zh' ? '生活方式建议、用药注意事项。' : 'Lifestyle tips, minor cautions, and reminders.'}</p>
            </div>
            <div className="card-yellow">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={20} className="text-ink" />
                <span className="font-black text-xs uppercase tracking-widest text-ink/60">{locale === 'zh' ? '2级 · 重点问题' : 'Level 2 · Important'}</span>
              </div>
              <div className="text-2xl font-black text-ink mb-2">{locale === 'zh' ? '弹窗说明原因' : 'Explain the Reason'}</div>
              <p className="text-sm font-bold text-ink/60 leading-relaxed">{locale === 'zh' ? '你有某风险因素，不建议某类药。' : 'When a risk factor makes a medicine a bad idea.'}</p>
            </div>
            <div className="card-pink">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={20} className="text-ink" />
                <span className="font-black text-xs uppercase tracking-widest text-ink/60">{locale === 'zh' ? '红旗 · 立即就医' : 'Red-flag · Urgent'}</span>
              </div>
              <div className="text-2xl font-black text-ink mb-2">{locale === 'zh' ? '严肃提示' : 'Serious Warning'}</div>
              <p className="text-sm font-bold text-ink/60 leading-relaxed">{locale === 'zh' ? '出现高危症状时，优先安全，不推荐OTC。' : 'Safety first: we pause OTC advice and guide urgent care.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST / CTA ── */}
      <section className="py-24 bg-ink text-paper relative overflow-hidden">
        {/* Faint SVG decorations */}
        <div className="absolute top-8 right-12 opacity-5 pointer-events-none hidden lg:block">
          <Stethoscope className="w-48 h-48" />
        </div>
        <div className="absolute bottom-8 left-12 opacity-5 pointer-events-none hidden lg:block">
          <Flask className="w-32 h-48" />
        </div>
        {/* Herb & daisy accents */}
        <div className="absolute top-6 left-6 opacity-10 pointer-events-none hidden lg:block">
          <Daisy className="w-24 h-24" />
        </div>
        <div className="absolute bottom-6 right-6 opacity-10 pointer-events-none hidden lg:block">
          <Daisy className="w-20 h-20" />
        </div>
        <div className="absolute top-1/2 left-4 opacity-10 pointer-events-none hidden lg:block -translate-y-1/2">
          <HerbLeaf className="w-10 h-16" />
        </div>
        <div className="absolute top-1/2 right-4 opacity-10 pointer-events-none hidden lg:block -translate-y-1/2">
          <HerbLeaf className="w-10 h-16" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 border border-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-10">
            <ShieldCheck size={16} />
            {locale === 'zh' ? '您的避风港' : 'Your Safe Harbor'}
          </span>

          <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
            {locale === 'zh' ? (
              <>安全是<span className="relative inline-block mx-3"><span className="relative z-10">核心</span><span className="absolute inset-x-0 bottom-1 h-4 rounded-sm" style={{ backgroundColor: 'rgba(255,133,184,0.4)', zIndex: -1 }}></span></span></>
            ) : (
              <>Safety is{' '}<span className="relative inline-block"><span className="relative z-10">Everything</span><span className="absolute inset-x-0 bottom-1 h-4 rounded-sm" style={{ backgroundColor: 'rgba(157,232,92,0.3)', zIndex: -1 }}></span></span></>
            )}
          </h2>

          <p className="text-xl text-paper/60 leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
            {t('safety_warning')}{' '}
            {locale === 'zh' ? '我们使用加密技术保护您最私密的健康对话。' : 'We use encryption to protect your most private health conversations.'}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-14">
            {['HIPAA SAFE', 'GDPR READY', 'ISO CERTIFIED', 'CLINICALLY VERIFIED'].map((badge) => (
              <span key={badge} className="font-black text-xs tracking-widest uppercase border-2 border-white/20 px-5 py-2 rounded-xl text-paper/60">{badge}</span>
            ))}
          </div>

          <Link href="/survey" className="btn-mint inline-flex items-center gap-3 text-lg">
            <span>🚀</span>
            {locale === 'zh' ? '立即开始' : 'Start Now'}
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
