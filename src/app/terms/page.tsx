import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-20">
      <h1 className="text-5xl font-black text-warm-900 mb-8 tracking-tight">服务条款 / Terms of Service</h1>
      
      <div className="space-y-10 text-warm-800/70 font-medium leading-relaxed">
        <section>
          <h2 className="text-2xl font-black text-warm-900 mb-4">1. 医学免责声明 / Medical Disclaimer</h2>
          <p className="mb-4">
            <strong className="text-warm-900">中文：</strong>
            CareBot AI 提供的信息和建议仅供教育和信息之用，不构成医疗建议、诊断或治疗。本应用不能替代持证医疗专业人士的专业评估。如有任何健康问题，请咨询医生。
          </p>
          <p>
            <strong className="text-warm-900">English:</strong>
            Information and recommendations provided by CareBot AI are for educational and informational purposes only and do not constitute medical advice, diagnosis, or treatment. This application cannot substitute for professional evaluation by a licensed healthcare provider. Consult a doctor for any health concerns.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-warm-900 mb-4">2. 使用条款 / Terms of Use</h2>
          <p className="mb-4">
            <strong className="text-warm-900">中文：</strong>
            用户同意： (1) 遵守所有适用法律和本条款；(2) 不会将此应用用于任何非法或有害的目的；(3) 对使用本应用的所有后果承担全部责任。
          </p>
          <p>
            <strong className="text-warm-900">English:</strong>
            Users agree to: (1) comply with all applicable laws and these terms; (2) not use this application for any illegal or harmful purposes; (3) take full responsibility for the consequences of using this application.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-warm-900 mb-4">3. 紧急情况 / Emergency Situations</h2>
          <p className="mb-4">
            <strong className="text-warm-900">中文：</strong>
            如果您经历任何危及生命的症状（如胸痛、呼吸困难、严重出血、意识改变），请立即拨打紧急电话（中国：120，美国：911）或前往最近的医院急诊室。本应用不能替代紧急医疗护理。
          </p>
          <p>
            <strong className="text-warm-900">English:</strong>
            If you experience any life-threatening symptoms (chest pain, difficulty breathing, severe bleeding, altered consciousness), immediately call emergency services (China: 120, USA: 911) or go to the nearest emergency room. This application cannot replace emergency medical care.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-warm-900 mb-4">4. 免责声明 / Limitation of Liability</h2>
          <p className="mb-4">
            <strong className="text-warm-900">中文：</strong>
            CareBot AI 及其创作者不对任何因使用或无法使用本应用而导致的直接、间接、附带、特殊或后果性损害负责，包括但不限于身体伤害或财产损失。
          </p>
          <p>
            <strong className="text-warm-900">English:</strong>
            CareBot AI and its creators are not responsible for any direct, indirect, incidental, special, or consequential damages resulting from use or inability to use this application, including but not limited to personal injury or property damage.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-warm-900 mb-4">5. 数据隐私 / Data Privacy</h2>
          <p className="mb-4">
            <strong className="text-warm-900">中文：</strong>
            本应用遵循数据最小化原则。仅当您主动使用"找附近药店"等功能时，才会请求位置权限。所有个人健康数据仅在您的设备上存储，不会被传输或存储在服务器上。详见隐私政策。
          </p>
          <p>
            <strong className="text-warm-900">English:</strong>
            This application follows data minimization principles. Location permissions are only requested when you actively use features like "Find Nearby Pharmacies". All personal health data is stored only on your device and is not transmitted or stored on servers. See Privacy Policy for details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-warm-900 mb-4">6. 条款修改 / Modification of Terms</h2>
          <p className="mb-4">
            <strong className="text-warm-900">中文：</strong>
            CareBot AI 保留随时修改本条款的权利。继续使用本应用即表示接受任何修改后的条款。
          </p>
          <p>
            <strong className="text-warm-900">English:</strong>
            CareBot AI reserves the right to modify these terms at any time. Continued use of this application constitutes acceptance of any modified terms.
          </p>
        </section>

        <section>
          <p className="text-sm text-warm-600 italic">
            最后更新 / Last Updated: 2026年3月17日 / March 17, 2026
          </p>
          <p className="text-sm text-warm-600 mt-4">
            <Link href="/privacy" className="text-warm-600 hover:text-warm-700 font-bold underline">
              查看隐私政策 / View Privacy Policy
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

