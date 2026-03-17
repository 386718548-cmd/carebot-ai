'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/hooks/useI18n';
import { X, AlertTriangle } from 'lucide-react';

const DISCLAIMER_KEY = 'carebot_disclaimer_accepted_v1';

export function DisclaimerModal() {
  const { locale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const accepted = localStorage.getItem(DISCLAIMER_KEY);
    if (!accepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DISCLAIMER_KEY, 'true');
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-ink/50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-ink rounded-3xl shadow-neo-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-yellow-100 border-b-2 border-ink p-6 flex items-start gap-4 rounded-t-3xl">
          <AlertTriangle className="text-ink flex-shrink-0 w-7 h-7 mt-1" />
          <div className="flex-1">
            <h2 className="text-2xl font-black text-ink mb-1">
              {locale === 'zh' ? '⚠️ 重要免责声明' : '⚠️ Important Disclaimer'}
            </h2>
            <p className="text-sm text-ink/60 font-bold">
              {locale === 'zh'
                ? '请在使用本应用前仔细阅读此声明'
                : 'Please read this carefully before using this application'}
            </p>
          </div>
          <button onClick={handleAccept} className="text-ink/40 hover:text-ink transition-colors flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6 text-sm leading-relaxed">
          {locale === 'zh' ? (
            <>
              <section>
                <h3 className="font-black text-ink mb-3 text-base">1. 法律地位</h3>
                <p className="text-ink/70">
                  本应用提供的所有信息、推荐和建议<strong>不构成医疗诊断、医疗治疗或医疗建议</strong>。本应用不能替代专业医疗人士的诊察、诊断或治疗。
                </p>
              </section>
              <section>
                <h3 className="font-black text-ink mb-3 text-base">2. 使用责任</h3>
                <p className="text-ink/70">
                  使用者自行承担使用本应用的所有风险。<strong>任何健康问题应该由合格的医疗专业人士评估和治疗</strong>。
                </p>
              </section>
              <section>
                <h3 className="font-black text-ink mb-3 text-base">3. 红旗警告</h3>
                <p className="text-ink/70 mb-3"><strong>如果您经历以下任何症状，请立即就医：</strong></p>
                <ul className="list-disc list-inside space-y-1 text-ink/70">
                  <li>胸痛或呼吸困难</li>
                  <li>突然发作的严重头痛</li>
                  <li>神经系统症状（昏迷、抽搐、麻痹）</li>
                  <li>严重出血症状</li>
                  <li>持续高烧（&gt;39°C）</li>
                </ul>
              </section>
              <section>
                <h3 className="font-black text-ink mb-3 text-base">4. 仅限成人使用</h3>
                <p className="text-ink/70">本应用仅供成人使用。如果您为儿童或正在照顾儿童，请咨询儿科医生。</p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h3 className="font-black text-ink mb-3 text-base">1. Legal Status</h3>
                <p className="text-ink/70">
                  All information provided <strong>does not constitute medical diagnosis, treatment, or advice</strong>. This app cannot replace professional medical evaluation.
                </p>
              </section>
              <section>
                <h3 className="font-black text-ink mb-3 text-base">2. User Responsibility</h3>
                <p className="text-ink/70">
                  Users assume all risk. <strong>Any health condition should be evaluated by a qualified healthcare professional</strong>.
                </p>
              </section>
              <section>
                <h3 className="font-black text-ink mb-3 text-base">3. Red Flag Warnings</h3>
                <p className="text-ink/70 mb-3"><strong>Seek immediate medical attention if you experience:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-ink/70">
                  <li>Chest pain or difficulty breathing</li>
                  <li>Sudden severe headache</li>
                  <li>Neurological symptoms (loss of consciousness, seizures)</li>
                  <li>Severe bleeding</li>
                  <li>Persistent fever &gt;39°C</li>
                </ul>
              </section>
              <section>
                <h3 className="font-black text-ink mb-3 text-base">4. Adults Only</h3>
                <p className="text-ink/70">This application is intended for adults. Consult a pediatrician for children.</p>
              </section>
            </>
          )}
        </div>

        <div className="bg-mint-50 border-t-2 border-ink p-6 flex justify-end rounded-b-3xl">
          <button
            onClick={handleAccept}
            className="btn-mint"
          >
            {locale === 'zh' ? '✓ 我已阅读并同意' : '✓ I Agree & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
