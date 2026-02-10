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
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
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
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
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
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-2xl"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
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
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
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

      {/* Use Cases */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Built for Developers
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Dynamic Content Generation
            </h4>
            <p className="text-sm text-gray-600">
              Generate custom illustrations for blog posts, social media, or
              user profiles on the fly
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Automation & Workflows
            </h4>
            <p className="text-sm text-gray-600">
              Integrate into CI/CD pipelines, design systems, or content
              management platforms
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Rapid Prototyping
            </h4>
            <p className="text-sm text-gray-600">
              Generate placeholder graphics for mockups, demos, and MVPs without
              waiting for designers
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-12 border border-blue-200">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Pricing Plans Coming Soon
          </h3>
          <p className="text-gray-600 mb-6">
            We're designing flexible pricing that scales with your usage. Expect
            free tiers for developers, pay-as-you-go options, and enterprise
            plans with dedicated support.
          </p>
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
              <span>Free tier included</span>
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
              <span>No hidden fees</span>
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
              <span>Volume discounts</span>
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
