import { Link } from 'react-router-dom'
import { useState } from 'react'

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-900 rounded-t-xl px-4 py-2 border-b border-gray-700">
        <span className="text-xs font-mono text-gray-400">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 rounded-b-xl p-4 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default function Docs() {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 sm:py-16 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-sm font-semibold text-gray-900">
            Coming Soon
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          ChatSVG API
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
          Integrate AI-powered SVG generation directly into your applications.
          Generate custom SVGs programmatically with a simple REST API.
        </p>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          We're building a developer-first API that brings ChatSVG's generation
          capabilities to your workflow. Get notified when we launch.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-center transition-colors"
          >
            Try the Web App
          </Link>
          <a
            href="mailto:support@chatsvg.com?subject=API Beta Access"
            className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 text-center transition-colors"
          >
            Request Beta Access
          </a>
        </div>
      </div>

      {/* Quick Overview */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
          What You'll Be Able to Do
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Powerful features designed for developers who need programmatic SVG
          generation at scale
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-blue-600 rounded-t-2xl"></div>
            <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Programmatic Generation
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Send a text prompt via REST API and receive production-ready SVG
              code instantly. Perfect for automation and dynamic content.
            </p>
          </div>
          <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500 to-purple-600 rounded-t-2xl"></div>
            <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              CDN-Hosted Assets
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Get instant CDN URLs for all generated SVGs. No storage
              hassles—just fast, reliable URLs ready to use in your
              applications.
            </p>
          </div>
          <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-500 to-green-600 rounded-t-2xl"></div>
            <div className="w-14 h-14 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Enterprise Ready
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Secure API keys, rate limiting, usage analytics, and
              enterprise-grade infrastructure. Built to scale with your
              business.
            </p>
          </div>
        </div>
      </div>

      {/* API Preview */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, Powerful API
          </h2>
          <p className="text-gray-600 mb-6">
            The ChatSVG API will let you generate custom SVGs with a single HTTP
            request. Perfect for automation, dynamic content generation, and
            building SVG-powered features.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3.5 h-3.5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">RESTful API</div>
                <div className="text-sm text-gray-600">
                  Simple HTTP endpoints with JSON responses
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3.5 h-3.5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Multiple Output Formats
                </div>
                <div className="text-sm text-gray-600">
                  Get SVG code, CDN URLs, or both
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3.5 h-3.5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Comprehensive Metadata
                </div>
                <div className="text-sm text-gray-600">
                  Dimensions, colors, generation details
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3.5 h-3.5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Style Customization
                </div>
                <div className="text-sm text-gray-600">
                  Control art style, colors, and complexity
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <CodeBlock
            language="bash"
            code={`curl -X POST https://api.chatsvg.com/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Minimal line icon of a rocket ship",
    "style": "line-art",
    "model": "gpt-5.2-2025-12-11"
  }'`}
          />
        </div>
      </div>

      {/* Response Example */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          What You'll Receive
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Response Schema
            </h4>
            <CodeBlock
              language="json"
              code={`{
  "id": "gen_abc123",
  "svg_code": "<svg>...</svg>",
  "cdn_url": "https://cdn.chatsvg.com/...",
  "metadata": {
    "width": 512,
    "height": 512,
    "dominant_colors": ["#FF6B35", "#004E89"],
    "style": "line-art",
    "model": "gpt-5.2-2025-12-11"
  },
  "created_at": "2026-02-10T12:00:00Z"
}`}
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Node.js Example
            </h4>
            <CodeBlock
              language="javascript"
              code={`const response = await fetch('https://api.chatsvg.com/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Minimal line icon of a rocket ship',
    style: 'line-art',
    model: 'gpt-5.2-2025-12-11'
  })
});

const svg = await response.json();
console.log(svg.cdn_url);
// Use svg.svg_code for inline embedding`}
            />
          </div>
        </div>
      </div>

      {/* When to Use */}
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          When to Use ChatSVG API
        </h3>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          ChatSVG API is designed for <strong>one-time generation</strong> and{' '}
          <strong>dynamic user content</strong>. You generate once, save the
          SVG, and reuse it—not render on every request.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* When to Use */}
          <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <h4 className="text-lg font-bold text-green-900">
                ✅ Perfect For
              </h4>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold shrink-0">•</span>
                <span>
                  <strong>Build-time generation:</strong> Generate icons during
                  CI/CD, save to your repo
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold shrink-0">•</span>
                <span>
                  <strong>User-generated content:</strong> Custom avatars,
                  logos, profile graphics (saved once)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold shrink-0">•</span>
                <span>
                  <strong>CMS/blog automation:</strong> Auto-generate hero
                  images from article titles
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold shrink-0">•</span>
                <span>
                  <strong>Marketing campaigns:</strong> Generate unique graphics
                  per campaign, reuse them
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold shrink-0">•</span>
                <span>
                  <strong>Documentation:</strong> Generate diagrams/icons for
                  docs sites (static assets)
                </span>
              </li>
            </ul>
          </div>

          {/* When NOT to Use */}
          <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <h4 className="text-lg font-bold text-red-900">❌ NOT For</h4>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold shrink-0">•</span>
                <span>
                  <strong>Runtime rendering:</strong> Don't call on every page
                  load or component mount
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold shrink-0">•</span>
                <span>
                  <strong>Replacing static icon libraries:</strong> Use pre-made
                  icons for common UI elements
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold shrink-0">•</span>
                <span>
                  <strong>Regenerating the same icon:</strong> Generate once,
                  cache the SVG/URL forever
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold shrink-0">•</span>
                <span>
                  <strong>Chart/data visualization:</strong> Use dedicated
                  charting libraries (D3, Chart.js)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold shrink-0">•</span>
                <span>
                  <strong>High-frequency generation:</strong> You pay per
                  generation—avoid wasteful calls
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-blue-600 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h5 className="font-bold text-blue-900 mb-2">
                💡 Key Principle: Generate → Save → Reuse
              </h5>
              <p className="text-sm text-gray-700">
                Think of ChatSVG API like hiring a designer on-demand. You
                request an asset, receive it, and use that exact file forever.
                You don't re-hire the designer every time someone views your
                website. This keeps costs low and performance high.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-World Examples */}
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Real-World Examples
        </h3>
        <div className="space-y-6">
          {/* Example 1: CLI Build Script */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  Build-Time Icon Generation
                </h4>
                <p className="text-sm text-gray-600">
                  Generate icons during CI/CD and commit them to your repo
                </p>
              </div>
            </div>
            <CodeBlock
              language="bash"
              code={`# generate-icons.sh - Run this in your build pipeline
curl -X POST https://api.chatsvg.com/v1/generate \\
  -H "Authorization: Bearer $CHATSVG_API_KEY" \\
  -d '{"prompt": "home icon", "style": "line-art"}' \\
  | jq -r '.svg_code' > ./public/icons/home.svg

curl -X POST https://api.chatsvg.com/v1/generate \\
  -H "Authorization: Bearer $CHATSVG_API_KEY" \\
  -d '{"prompt": "settings gear icon", "style": "line-art"}' \\
  | jq -r '.svg_code' > ./public/icons/settings.svg

# Now commit these files - they're static assets forever
git add public/icons/*.svg`}
            />
          </div>

          {/* Example 2: User Avatar Generation */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  Custom User Avatar Generation
                </h4>
                <p className="text-sm text-gray-600">
                  Generate unique avatar when user signs up, save URL to
                  database
                </p>
              </div>
            </div>
            <CodeBlock
              language="javascript"
              code={`// Server-side endpoint (Express, Next.js API route, etc.)
app.post('/api/user/onboarding', async (req, res) => {
  const { username } = req.body;
  
  // Generate avatar ONCE during signup
  const response = await fetch('https://api.chatsvg.com/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.CHATSVG_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: \`abstract geometric avatar for \${username}\`,
      style: 'flat'
    })
  });
  
  const svg = await response.json();
  
  // Save the CDN URL to user profile (not the SVG code!)
  await db.users.update(req.user.id, {
    avatar_url: svg.cdn_url  // This URL never changes
  });
  
  // User's avatar is now permanent - no more API calls needed
  res.json({ avatar: svg.cdn_url });
});`}
            />
          </div>

          {/* Example 3: CMS Blog Post Hero */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  CMS Auto-Illustration
                </h4>
                <p className="text-sm text-gray-600">
                  Generate hero image when publishing article, store in CMS
                </p>
              </div>
            </div>
            <CodeBlock
              language="javascript"
              code={`// CMS hook when article is published
async function onArticlePublish(article) {
  if (!article.hero_image) {
    // Generate illustration from article title/summary
    const response = await fetch('https://api.chatsvg.com/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.CHATSVG_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: \`abstract illustration for article: \${article.title}\`,
        style: 'geometric'
      })
    });
    
    const svg = await response.json();
    
    // Save URL to article metadata (one-time generation!)
    await cms.articles.update(article.id, {
      hero_image: svg.cdn_url
    });
  }
  
  // Article now has permanent hero image - no regeneration needed
}`}
            />
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-12 border border-blue-200">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Pay-Per-Generation Pricing
          </h3>
          <p className="text-gray-600 mb-6">
            You only pay when you generate a new SVG. Once generated, the CDN
            URL and SVG code are yours forever—no ongoing costs for storage or
            bandwidth.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                Free Tier
              </div>
              <div className="text-sm text-gray-600">
                Perfect for testing and small projects
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                Pay-as-you-go
              </div>
              <div className="text-sm text-gray-600">
                Scale as your needs grow
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600 mb-1">
                Enterprise
              </div>
              <div className="text-sm text-gray-600">
                Custom plans with SLAs
              </div>
            </div>
          </div>
          <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No monthly minimums</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Free CDN hosting forever</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Volume discounts available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Beta Access CTA */}
      <div className="bg-gray-900 rounded-2xl p-10 text-center text-white">
        <h3 className="text-3xl font-bold mb-4">Get Early Access</h3>
        <p className="text-gray-300 max-w-2xl mx-auto mb-6">
          We're opening up beta access to developers soon. Join the waitlist to
          be notified when API keys become available and get exclusive early
          access pricing.
        </p>
        <a
          href="mailto:support@chatsvg.com?subject=API Beta Waitlist"
          className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
        >
          Join the Waitlist
        </a>
        <p className="text-sm text-gray-400 mt-4">
          Have questions?{' '}
          <a
            href="mailto:support@chatsvg.com"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Contact us
          </a>
        </p>
      </div>
    </div>
  )
}
