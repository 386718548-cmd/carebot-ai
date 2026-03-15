'use client';

import { useTranslations, useLocale } from '@/hooks/useI18n';
import Link from 'next/link';
import { ShieldCheck, Stethoscope, Search, ShoppingBag, ArrowRight, Activity, Heart, Sparkles, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const t = useTranslations('Index');
  const { locale } = useLocale();

  return (
    <div className="flex flex-col bg-warm-50/30">
      {/* Healing Hero Section */}
      <section className="relative pt-24 pb-40 overflow-hidden">
        {/* Warm Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-warm-100/60 rounded-full blur-[140px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-sage-50/60 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex flex-col gap-10"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-md text-warm-600 rounded-full text-sm font-black tracking-wide w-fit border border-warm-100 shadow-sm">
                <Heart size={18} className="fill-warm-500 text-warm-500 animate-bounce" />
                <span>{locale === 'zh' ? '您的健康，我们最温馨的守护' : 'Your Health, Our Warmest Care'}</span>
              </div>
              
              <h1 className="text-7xl md:text-8xl font-black text-warm-900 leading-[1] tracking-tight">
                {locale === 'zh' ? (
                  <>从此<span className="text-warm-500 underline decoration-warm-200 decoration-8 underline-offset-8 italic">舒适</span><br />生活。</>
                ) : (
                  <>Feel <span className="text-warm-500 underline decoration-warm-200 decoration-8 underline-offset-8 italic">Better</span> <br />Starting Today.</>
                )}
              </h1>
              
              <p className="text-2xl text-warm-800/60 leading-relaxed max-w-xl font-medium">
                {t('description')} {locale === 'zh' ? '没有冰冷的诊疗，只有为您健康而生的智能引导。' : 'No clinical coldness here—just smart, gentle guidance for your well-being.'}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
                <Link
                  href="/survey"
                  className="w-full sm:w-auto btn-warm flex items-center justify-center gap-3 text-xl group shadow-2xl"
                >
                  {t('start_survey')}
                  <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto text-warm-900 font-black text-lg border-b-4 border-warm-200 hover:border-warm-500 transition-all pb-1 flex items-center gap-2">
                  {locale === 'zh' ? '了解工作流程' : 'Learn How it Works'}
                  <ArrowRight size={20} />
                </a>
              </div>

              <div className="flex items-center gap-12 mt-10">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-warm-100 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-14 h-14 rounded-full border-4 border-white bg-warm-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
                    +10k
                  </div>
                </div>
                <p className="text-sm font-black text-warm-800/40 uppercase tracking-[0.2em]">
                  {locale === 'zh' ? <>万千家庭的<br />暖心之选</> : <>Trusted by thousands <br /> of caring families</>}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 bg-white p-12 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(255,138,101,0.15)] border border-warm-50 overflow-hidden animate-float">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-warm-50 rounded-full -z-10 opacity-50"></div>
                
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-20 h-20 bg-warm-100 rounded-3xl flex items-center justify-center text-warm-500">
                    <Coffee size={40} />
                  </div>
                  <div>
                    <h3 className="font-black text-warm-900 text-2xl tracking-tight">{locale === 'zh' ? '温馨问候' : 'Gentle Check-in'}</h3>
                    <p className="text-lg text-warm-400 font-bold italic">{locale === 'zh' ? '"亲爱的朋友，感觉好些了吗？"' : '"How are you feeling, friend?"'}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-8 bg-warm-50/50 rounded-[3rem] border border-warm-100/50">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-black text-warm-400 uppercase tracking-widest">{locale === 'zh' ? '个性化建议' : 'Personalized Recommendation'}</span>
                      <div className="w-3 h-3 bg-warm-500 rounded-full animate-ping"></div>
                    </div>
                    <div className="text-4xl font-black text-warm-900 mb-4 tracking-tight">{locale === 'zh' ? '助眠建议' : 'Sleep Support'}</div>
                    <p className="text-lg text-warm-800/70 font-medium leading-relaxed mb-6">
                      {locale === 'zh' 
                        ? '针对您的轻度失眠，我们建议您在休息前喝一杯暖暖的草本茶，并配合 3mg 褪黑素。' 
                        : 'Based on your mild insomnia, we suggest a warm cup of herbal tea and 3mg Melatonin before rest.'}
                    </p>
                    <div className="h-2 w-full bg-warm-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        className="h-full bg-warm-500"
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gentle Process Section */}
      <section id="how-it-works" className="py-40 bg-white relative">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="max-w-3xl mx-auto mb-24">
            <h2 className="text-warm-500 font-black uppercase tracking-[0.3em] text-sm mb-6">{locale === 'zh' ? '我们的关怀之路' : 'Our Gentle Path'}</h2>
            <h3 className="text-5xl md:text-6xl font-black text-warm-900 mb-8 tracking-tight">{t('how_it_works')}</h3>
            <p className="text-2xl text-warm-800/50 font-medium leading-relaxed">
              {locale === 'zh' ? '我们将复杂的医疗流程简化为三个温馨的步骤，旨在为您提供全方位的支持。' : "We've simplified the medical process into three caring steps designed to make you feel supported."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { 
                icon: <Stethoscope size={48} />, 
                title: t('step1'), 
                desc: locale === 'zh' ? "在友好、无压力的问卷中告诉我们您的不适。" : "Tell us about your discomfort in our friendly, no-pressure questionnaire.",
                color: "bg-warm-100 text-warm-500"
              },
              { 
                icon: <Search size={48} />, 
                title: t('step2'), 
                desc: locale === 'zh' ? "我们的 AI 会以深刻的临床共情分析您的独特情况。" : "Our caring AI analyzes your unique situation with deep clinical empathy.",
                color: "bg-sage-100 text-sage-600"
              },
              { 
                icon: <ShoppingBag size={48} />, 
                title: t('step3'), 
                desc: locale === 'zh' ? "获得精确的、经过验证的药品选择及本地价格指导。" : "Receive safe, verified medicine choices with local price guidance.",
                color: "bg-orange-100 text-orange-500"
              }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -15 }}
                className="group p-12 rounded-[4rem] bg-warm-50/30 border border-warm-100/50 hover:bg-white hover:shadow-3xl hover:shadow-warm-200/30 transition-all duration-500"
              >
                <div className={`w-28 h-28 ${step.color} rounded-[2.5rem] flex items-center justify-center mb-10 mx-auto group-hover:scale-110 transition-transform shadow-inner`}>
                  {step.icon}
                </div>
                <h4 className="text-3xl font-black text-warm-900 mb-6 tracking-tight">{step.title}</h4>
                <p className="text-lg text-warm-800/50 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Comfort Section */}
      <section className="py-40 bg-warm-900 text-white relative overflow-hidden rounded-t-[5rem]">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-warm-500 rounded-full blur-[180px] animate-pulse-slow"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-8 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-12 border border-white/10">
            <ShieldCheck size={20} className="text-warm-400" />
            {locale === 'zh' ? '您的避风港' : 'Your Safe Harbor'}
          </div>
          <h3 className="text-5xl md:text-7xl font-black mb-10 leading-[1.1] tracking-tight">
            {locale === 'zh' ? (
              <>安全是<span className="text-warm-400 italic underline decoration-warm-400/30 decoration-8 underline-offset-8">核心</span></>
            ) : (
              <>Safety is <span className="text-warm-400 italic underline decoration-warm-400/30 decoration-8 underline-offset-8">Everything</span></>
            )}
          </h3>
          <p className="text-2xl text-warm-100/60 leading-relaxed mb-16 max-w-3xl mx-auto font-medium">
            {t('safety_warning')} {locale === 'zh' ? '我们使用军用级加密来保护您最私密的健康对话。' : 'We use military-grade encryption to protect your most private health conversations.'}
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 hover:opacity-100 transition-opacity duration-1000">
            {['HIPAA SAFE', 'GDPR READY', 'ISO CERTIFIED', 'CLINICALLY VERIFIED'].map(badge => (
              <span key={badge} className="font-black text-sm tracking-[0.4em] uppercase border-2 border-white/20 px-6 py-2 rounded-xl">{badge}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
