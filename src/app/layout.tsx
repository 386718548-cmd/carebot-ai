'use client';

import { Inter, Quicksand } from 'next/font/google';
import './globals.css';
import { I18nProvider, useLocale } from '@/hooks/useI18n';
import { Languages } from 'lucide-react';
import Link from 'next/link';
import { ReminderRunner } from '@/components/ReminderRunner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand' });

function Header() {
  const { locale, setLocale } = useLocale();

  return (
    <header className="bg-white/60 backdrop-blur-xl border-b border-warm-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
        <a href="/" className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-warm-400 to-warm-600 rounded-[1.25rem] flex items-center justify-center text-white font-black shadow-lg shadow-warm-200 group-hover:rotate-12 transition-all">
            <span className="text-2xl">♥</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-warm-900 leading-none tracking-tight text-xl">CareBot AI</span>
            <span className="text-[10px] text-warm-400 font-black tracking-[0.2em] uppercase mt-1">Healing & Caring</span>
          </div>
        </a>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-bold text-warm-800/70">
          <div className="flex items-center gap-2 bg-warm-50 p-1 rounded-full border border-warm-100">
            <button 
              onClick={() => setLocale('en')}
              className={`px-4 py-1.5 rounded-full transition-all ${locale === 'en' ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-400 hover:text-warm-600'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLocale('zh')}
              className={`px-4 py-1.5 rounded-full transition-all ${locale === 'zh' ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-400 hover:text-warm-600'}`}
            >
              中文
            </button>
          </div>
          <div className="h-5 w-px bg-warm-100"></div>
          <button className="text-warm-900 hover:text-warm-600 transition-colors">Log In</button>
          <button className="bg-warm-500 text-white px-8 py-3 rounded-full hover:bg-warm-600 shadow-lg shadow-warm-200 transition-all active:scale-95">
            {locale === 'zh' ? '开启健康' : 'Get Started'}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${quicksand.variable}`}>
      <body className="font-quicksand selection:bg-warm-200 selection:text-warm-900">
        <I18nProvider>
          <div className="min-h-screen flex flex-col">
            <ReminderRunner />
            <Header />
            
            <main className="flex-1">
              {children}
            </main>
            
            <footer className="bg-cream-100 py-24 border-t border-warm-100">
              <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                  <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 bg-warm-500 rounded-xl flex items-center justify-center text-white font-black text-lg">♥</div>
                      <span className="font-black text-warm-900 tracking-tight text-lg">CareBot AI</span>
                    </div>
                    <p className="text-warm-800/60 text-sm leading-relaxed font-medium">
                      Healing with heart, powered by AI.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-black text-warm-900 mb-8 text-xs uppercase tracking-[0.2em]">Our Care</h4>
                    <ul className="space-y-5 text-sm text-warm-800/60 font-bold">
                      <li><a href="#" className="hover:text-warm-600 transition-colors text-xs uppercase tracking-widest">Symptom Checker</a></li>
                      <li><Link href="/medicines" className="hover:text-warm-600 transition-colors text-xs uppercase tracking-widest">OTC Directory</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="pt-10 border-t border-warm-200/50 text-xs font-bold text-warm-400">
                  <p>© 2026 CareBot AI. Built with love for your well-being.</p>
                </div>
              </div>
            </footer>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
