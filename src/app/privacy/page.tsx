import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-20">
      <h1 className="text-5xl font-black text-warm-900 mb-8 tracking-tight">隐私政策 / Privacy Policy</h1>
      
      <div className="space-y-10 text-warm-800/70 font-medium leading-relaxed">
        <section>
          <h2 className="text-2xl font-black text-warm-900 mb-4">1. 信息收集 / Information Collection</h2>
          <p className="mb-4">
            <strong className="text-warm-900">中文：</strong>
            CareBot AI 采用最小化数据收集原则。我们仅在以下情况下收集数据：
            <ul className="list-disc list-inside mt-2 ml-2">
              <li>您主动填写健康问卷时（存储在本地设备）</li>
              <li>您选择使用"附近药店查找"功能时，我们会请求位置权限</li>
              <li>您同意时，我们可能收集匿名使用统计数据</li>
            </ul>
          </p>
          <p>
            <strong className="text-warm-900">English:</strong>
            CareBot AI follows a data minimization principle. We only collect data in these situations:
            <ul className="list-disc list-inside mt-2 ml-2">
              <li>When you actively fill out health questionnaires (stored on your local device)</li>
              <li>When you use the "Find Nearby Pharmacies" feature, we request location permission</li>
              <li>When you consent, we may collect anonymous usage statistics</li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-warm-900 mb-4">2. 数据存储 / Data Storage</h2>
          <p className="mb-4">
            <strong className="text-warm-900">中文：</strong>
            所有您输入的健康信息存储在您的本地设备上（浏览器的本地存储），不会被上传到任何远程服务器。您可以随时清除浏览器缓存来删除所有数据。
          </p>
          <p>
            <strong className="text-warm-900">English:</strong>
            All health information you enter is stored on your local device (browser's local storage) and is never uploaded to any remote server. You can clear your browser cache at any time to delete all data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-warm-900 mb-4">3. 位置数据 / Location Data</h2>
          <p className="mb-4">
            <strong className="text-warm-900">中文：</strong>
            如果您选择使用"附近药店"功能，我们将请求您的位置权限。该位置数据：
            <ul className="list-disc list-inside mt-2 ml-2">
              <li>仅用于计算您附近的药店</li>
              <li>不会被存储或记录在我们的服务器上</li>
              <li>不会用于任何追踪或营销目的</li>
              <li>您可以随时在设备设置中撤销权限</li>
            </ul>
          </p>
          <p>
            <strong className="text-warm-900">English:</strong>
            If you choose to use the "Find Nearby Pharmacies" feature, we will request location permission. Your location data:
            <ul className="list-disc list-inside mt-2 ml-2">
              <li>Is only used to find nearby pharmacies</li>
              <li>Is not stored or recorded on our servers</li>
              <li>Is not used for tracking or marketing purposes</li>
              <li>Can be revoked at any time in your device settings</li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-warm-900 mb-4">4. 第三方服务 / Third-Party Services</h2>
          <p className="mb-4">
            <strong className="text-warm-900">中文：</strong>
            本应用可能使用第三方地图服务（如 Google Maps）来显示附近的药店。这些服务有各自的隐私政策。使用时请阅读其隐私条款。
          </p>
          <p>
            <strong className="text-warm-900">English:</strong>
            This application may use third-party mapping services (such as Google Maps) to display nearby pharmacies. These services have their own privacy policies. Please review their privacy terms when using these features.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-warm-900 mb-4">5. 安全性 / Security</h2>
          <p className="mb-4">
            <strong className="text-warm-900">中文：</strong>
            我们努力保持本应用的安全性。由于数据存储在您的本地设备上，安全性取决于您的设备安全措施。请保持设备软件更新，使用强密码和屏幕锁定。
          </p>
          <p>
            <strong className="text-warm-900">English:</strong>
            We strive to maintain the security of this application. Since data is stored on your local device, security depends on your device's security measures. Keep your device software updated, use strong passwords, and enable screen locks.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-warm-900 mb-4">6. 用户权利 / User Rights</h2>
          <p className="mb-4">
            <strong className="text-warm-900">中文：</strong>
            您有权：
            <ul className="list-disc list-inside mt-2 ml-2">
              <li>随时删除您的数据（通过清除浏览器缓存）</li>
              <li>撤销任何已授予的权限（位置、照相机等）</li>
              <li>停止使用本应用</li>
            </ul>
          </p>
          <p>
            <strong className="text-warm-900">English:</strong>
            You have the right to:
            <ul className="list-disc list-inside mt-2 ml-2">
              <li>Delete your data at any time (by clearing browser cache)</li>
              <li>Revoke any granted permissions (location, camera, etc.)</li>
              <li>Stop using this application</li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-warm-900 mb-4">7. 政策更新 / Policy Updates</h2>
          <p className="mb-4">
            <strong className="text-warm-900">中文：</strong>
            我们可能随时更新本隐私政策。更新将在此页面发布。继续使用本应用即表示您接受更新后的隐私政策。
          </p>
          <p>
            <strong className="text-warm-900">English:</strong>
            We may update this Privacy Policy at any time. Updates will be posted on this page. Continued use of this application indicates your acceptance of the updated Privacy Policy.
          </p>
        </section>

        <section>
          <p className="text-sm text-warm-600 italic">
            最后更新 / Last Updated: 2026年3月17日 / March 17, 2026
          </p>
          <p className="text-sm text-warm-600 mt-4">
            <Link href="/terms" className="text-warm-600 hover:text-warm-700 font-bold underline">
              查看服务条款 / View Terms of Service
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

