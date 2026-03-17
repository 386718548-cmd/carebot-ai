'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { I18nProvider, useLocale } from '@/hooks/useI18n';
import Link from 'next/link';
import { ReminderRunner } from '@/components/ReminderRunner';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { EmergencyButton } from '@/components/EmergencyButton';
import { PageTransition } from '@/components/PageTransition';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

function PillBottle({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* cap */}
      <rect x="13" y="1" width="22" height="10" rx="4" fill="#e2e8f0" stroke="#1a1b19" strokeWidth="2"/>
      <rect x="10" y="8" width="28" height="5" rx="2" fill="#cbd5e1" stroke="#1a1b19" strokeWidth="1.5"/>
      {/* bottle body */}
      <rect x="9" y="13" width="30" height="38" rx="7" fill="white" stroke="#1a1b19" strokeWidth="2.2"/>
      {/* blue label band */}
      <rect x="9" y="20" width="30" height="14" rx="0" fill="#7dd3fc"/>
      <rect x="9" y="20" width="30" height="14" rx="0" fill="url(#label-grad)"/>
      {/* label text line */}
      <rect x="13" y="24" width="18" height="2.5" rx="1.2" fill="white" opacity="0.9"/>
      <rect x="13" y="28.5" width="12" height="2" rx="1" fill="white" opacity="0.6"/>
      {/* bottle shine */}
      <rect x="12" y="14" width="4" height="20" rx="2" fill="white" opacity="0.25"/>
      <defs>
        <linearGradient id="label-grad" x1="9" y1="20" x2="39" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8"/>
          <stop offset="100%" stopColor="#7dd3fc"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function Header() {
  const { locale, setLocale } = useLocale();

  return (
    <header className="border-b-2 border-ink sticky top-0 z-50" style={{ backgroundColor: '#fce8f0' }}>
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-11 h-11 bg-pink-300 border-2 border-ink rounded-2xl flex items-center justify-center shadow-neo group-hover:rotate-6 transition-transform">
            <PillBottle size={26} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-ink text-lg tracking-tight">CareBot AI</span>
            <span className="text-[9px] text-ink/50 font-black tracking-[0.2em] uppercase">Lab & Medicine</span>
          </div>
        </a>

        {/* Nav right */}
        <div className="flex items-center gap-4">
          {/* Lang toggle */}
          <div className="flex items-center gap-1 bg-white border-2 border-ink rounded-xl p-1 shadow-neo-sm">
            <button
              onClick={() => setLocale('en')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${locale === 'en' ? 'bg-mint-300 text-ink' : 'text-ink/40 hover:text-ink'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLocale('zh')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${locale === 'zh' ? 'bg-mint-300 text-ink' : 'text-ink/40 hover:text-ink'}`}
            >
              中文
            </button>
          </div>

          <Link
            href="/symptoms"
            className="hidden md:flex btn-pink !py-2.5 !px-6 !text-sm items-center gap-2"
          >
            {locale === 'zh' ? '开始检查症状 →' : 'Check Symptoms →'}
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  const { locale } = useLocale();
  return (
    <footer className="border-t-2 border-ink py-16" style={{ backgroundColor: '#fce8f0' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-pink-300 border-2 border-ink rounded-xl flex items-center justify-center shadow-neo-sm">
                <PillBottle size={24} />
              </div>
              <span className="font-black text-ink text-lg">CareBot AI</span>
            </div>
            <p className="text-ink/60 text-sm font-bold max-w-xs leading-relaxed">
              {locale === 'zh' ? '活泼、安全、专业的 OTC 用药指引。' : 'Playful, safe, and professional OTC guidance.'}
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="font-black text-ink mb-4 text-xs uppercase tracking-widest">
                {locale === 'zh' ? '功能' : 'Features'}
              </h4>
              <ul className="space-y-3 text-sm font-bold text-ink/60">
                <li><Link href="/symptoms" className="hover:text-pink-500 transition-colors">{locale === 'zh' ? '症状检查' : 'Symptom Check'}</Link></li>
                <li><Link href="/medicines" className="hover:text-pink-500 transition-colors">{locale === 'zh' ? '药品目录' : 'OTC Directory'}</Link></li>
                <li><Link href="/survey" className="hover:text-pink-500 transition-colors">{locale === 'zh' ? '问卷调查' : 'Survey'}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-ink mb-4 text-xs uppercase tracking-widest">
                {locale === 'zh' ? '法律' : 'Legal'}
              </h4>
              <ul className="space-y-3 text-sm font-bold text-ink/60">
                <li><Link href="/privacy" className="hover:text-pink-500 transition-colors">{locale === 'zh' ? '隐私政策' : 'Privacy'}</Link></li>
                <li><Link href="/terms" className="hover:text-pink-500 transition-colors">{locale === 'zh' ? '使用条款' : 'Terms'}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t-2 border-ink/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-black text-ink/40">© 2026 CareBot AI. Built with 💊 for your well-being.</p>
          <div className="flex gap-3">
            {['🧪', '💉', '🩺', '🩹'].map((e, i) => (
              <span key={i} className="text-xl opacity-30">{e}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans selection:bg-mint-200 selection:text-ink">
        <I18nProvider>
          <div className="min-h-screen flex flex-col">
            <ReminderRunner />
            <Header />
            <DisclaimerModal />
            <main className="flex-1">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <EmergencyButton />
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
