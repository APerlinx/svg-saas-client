export default function PrivacyPolicy() {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 sm:py-14 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600">Last updated: February 11, 2026</p>
      </div>

      <div className="prose prose-gray max-w-none">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              ChatSVG ("we", "our", or "us") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our web
              application and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Information We Collect
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  2.1 Account Information
                </h3>
                <p className="leading-relaxed">
                  When you create an account, we collect your email address,
                  name, and password (encrypted). If you sign up via OAuth
                  (Google, GitHub), we receive your email and profile
                  information from those providers.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  2.2 Usage Data
                </h3>
                <p className="leading-relaxed">
                  We collect information about your interactions with ChatSVG,
                  including: prompts you submit, SVGs you generate, generation
                  settings (style, model, privacy), and credit usage history.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  2.3 Technical Data
                </h3>
                <p className="leading-relaxed">
                  We automatically collect device information, browser type, IP
                  address, cookies, and session data to improve our service and
                  detect issues.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Provide and maintain the ChatSVG service</li>
              <li>Process SVG generation requests and manage your credits</li>
              <li>
                Send service-related notifications (job completion, errors)
              </li>
              <li>Respond to support requests and contact messages</li>
              <li>Improve our AI models and user experience</li>
              <li>Detect and prevent fraud, abuse, and security issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Data Sharing and Disclosure
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                <strong>We do not sell your personal data.</strong> We may share
                your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>AI Providers:</strong> Your prompts are sent to
                  OpenAI's API to generate SVGs
                </li>
                <li>
                  <strong>Cloud Services:</strong> AWS S3 for SVG storage, Redis
                  for caching
                </li>
                <li>
                  <strong>Analytics Tools:</strong> Sentry for error monitoring
                </li>
                <li>
                  <strong>Legal Requirements:</strong> If required by law or to
                  protect our rights
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Your Privacy Choices
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                <strong>Public vs. Private SVGs:</strong> You control whether
                your generated SVGs appear in our public gallery. Private SVGs
                are only visible to you.
              </p>
              <p className="leading-relaxed">
                <strong>Account Deletion:</strong> You can request account
                deletion by contacting support@chatsvg.com. We will delete your
                data within 30 days, except where required by law.
              </p>
              <p className="leading-relaxed">
                <strong>Data Export:</strong> Request a copy of your data by
                emailing support@chatsvg.com.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement industry-standard security measures including HTTPS
              encryption, secure password hashing (bcrypt), CSRF protection, and
              regular security audits. However, no method of transmission over
              the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Cookies and Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use essential cookies for authentication and session
              management. We do not use third-party advertising cookies. You can
              disable cookies in your browser, but this may affect
              functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              ChatSVG is not intended for users under 13 years old. We do not
              knowingly collect data from children. If you believe a child has
              provided us with personal information, contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically. We will notify you
              of significant changes via email or a prominent notice on our
              website. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              For privacy-related questions or concerns, contact us at:
            </p>
            <div className="mt-3 text-gray-700">
              <p className="font-semibold">ChatSVG Support</p>
              <p>Email: support@chatsvg.com</p>
              <p>Website: https://chatsvg.dev</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
