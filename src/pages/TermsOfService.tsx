export default function TermsOfService() {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 sm:py-14 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-600">Last updated: February 11, 2026</p>
      </div>

      <div className="prose prose-gray max-w-none">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using ChatSVG ("Service"), you agree to be bound
              by these Terms of Service ("Terms"). If you do not agree to these
              Terms, you may not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 leading-relaxed">
              ChatSVG is an AI-powered platform that generates custom SVG
              graphics based on text prompts. The Service includes web-based
              generation tools, a public gallery, user history management, and
              (coming soon) a REST API for programmatic access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Beta Program
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                <strong>Current Status:</strong> ChatSVG is currently in beta.
                During the beta period:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All features are free to use</li>
                <li>Unlimited SVG generations are provided</li>
                <li>
                  The Service may be modified, updated, or discontinued at any
                  time
                </li>
                <li>
                  We reserve the right to introduce paid plans after beta ends
                </li>
                <li>Data may be reset or migrated during beta testing</li>
              </ul>
              <p className="leading-relaxed mt-3">
                We will provide advance notice before transitioning to paid
                plans or making breaking changes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. User Accounts
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                <strong>Account Creation:</strong> You must provide accurate
                information when creating an account. You are responsible for
                maintaining the security of your account credentials.
              </p>
              <p className="leading-relaxed">
                <strong>Eligibility:</strong> You must be at least 13 years old
                to use ChatSVG. If you are under 18, you must have parental
                consent.
              </p>
              <p className="leading-relaxed">
                <strong>Account Security:</strong> You are responsible for all
                activity under your account. Notify us immediately of any
                unauthorized use.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Acceptable Use
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                <strong>You agree NOT to:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Generate content that is illegal, harmful, threatening,
                  abusive, harassing, defamatory, or hateful
                </li>
                <li>
                  Create SVGs that infringe on intellectual property rights or
                  contain copyrighted material without permission
                </li>
                <li>
                  Attempt to circumvent rate limits, abuse the API, or engage in
                  automated scraping
                </li>
                <li>Use the Service to spam, phish, or distribute malware</li>
                <li>
                  Reverse engineer, decompile, or attempt to extract the source
                  code of our AI models
                </li>
                <li>
                  Resell, redistribute, or sublicense access to ChatSVG without
                  written permission
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Intellectual Property
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                <strong>Your Content:</strong> You retain ownership of the text
                prompts you submit. By using ChatSVG, you grant us a license to
                process your prompts to generate SVGs.
              </p>
              <p className="leading-relaxed">
                <strong>Generated SVGs:</strong> You own the SVGs you generate
                through ChatSVG. You may use them for personal or commercial
                purposes. However:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Public SVGs may be displayed in our gallery and used for
                  promotional purposes
                </li>
                <li>
                  We may use aggregated, anonymized generation data to improve
                  our models
                </li>
                <li>
                  You are responsible for ensuring your prompts don't request
                  infringing content
                </li>
              </ul>
              <p className="leading-relaxed mt-3">
                <strong>ChatSVG Platform:</strong> All rights to the ChatSVG
                platform, including our website, branding, and underlying
                technology, are owned by us.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Credits and Payments (Post-Beta)
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                After the beta period ends, ChatSVG will introduce paid plans:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Web App Credits:</strong> Pay-as-you-go credits for
                  the web interface (credits never expire)
                </li>
                <li>
                  <strong>API Credits:</strong> Pay-per-generation for
                  programmatic access
                </li>
              </ul>
              <p className="leading-relaxed mt-3">
                <strong>Pricing:</strong> Prices will be clearly displayed on
                our Pricing page. All payments are non-refundable except as
                required by law.
              </p>
              <p className="leading-relaxed">
                <strong>Taxes:</strong> Prices are exclusive of taxes. You are
                responsible for applicable taxes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Service Availability
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                <strong>No Guarantee:</strong> We strive for high uptime but do
                not guarantee uninterrupted service. ChatSVG may be temporarily
                unavailable due to maintenance, updates, or technical issues.
              </p>
              <p className="leading-relaxed">
                <strong>Rate Limits:</strong> We may impose rate limits to
                ensure fair usage. Excessive use may result in temporary
                restrictions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Disclaimer of Warranties
            </h2>
            <p className="text-gray-700 leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE
              DO NOT GUARANTEE THE ACCURACY, QUALITY, OR SUITABILITY OF
              GENERATED SVGS. YOU USE CHATSVG AT YOUR OWN RISK.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CHATSVG SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL
              DAMAGES ARISING FROM YOUR USE OF THE SERVICE, INCLUDING LOST
              PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Termination
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                <strong>By You:</strong> You may delete your account at any time
                by contacting support@chatsvg.com.
              </p>
              <p className="leading-relaxed">
                <strong>By Us:</strong> We may suspend or terminate your account
                if you violate these Terms, engage in abusive behavior, or for
                any reason with 30 days' notice.
              </p>
              <p className="leading-relaxed">
                <strong>Effect:</strong> Upon termination, you lose access to
                your account and generated SVGs. We may retain data as required
                by law.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms from time to time. We will notify you of
              material changes via email or a prominent notice on our website.
              Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of [Your Jurisdiction],
              without regard to conflict of law principles. Any disputes shall
              be resolved in the courts of [Your Jurisdiction].
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              14. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms, contact us at:
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
