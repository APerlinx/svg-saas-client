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
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 rounded-b-xl p-4 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function SectionHeading({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <h2 id={id} className="text-3xl font-bold text-gray-900 mb-6 scroll-mt-20">
      {children}
    </h2>
  )
}

function SubHeading({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <h3 id={id} className="text-2xl font-bold text-gray-900 mb-4 scroll-mt-20">
      {children}
    </h3>
  )
}

const NAV_ITEMS = [
  { id: 'quickstart', label: 'Quick Start' },
  { id: 'web-app', label: 'Using Web App' },
  { id: 'api-keys', label: 'Getting API Keys' },
  { id: 'authentication', label: 'API Authentication' },
  { id: 'generate', label: 'Generate Endpoint' },
  { id: 'job-status', label: 'Job Status' },
  { id: 'examples', label: 'Code Examples' },
  { id: 'pricing', label: 'Credits & Pricing' },
  { id: 'mcp', label: 'MCP Server' },
]

export default function Docs() {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 sm:py-16 px-4">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          ChatSVG API
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
          AI-powered SVG generation for developers. Generate custom SVGs with a
          simple REST API.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 mb-12">
          <Link
            to="/api-keys"
            className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold bg-linear-to-r from-wizard-orange to-wizard-orange/90 text-white shadow-sm text-center transition-all hover:from-wizard-orange/90 hover:to-wizard-orange"
          >
            Get Your API Key
          </Link>
          <Link
            to="/pricing"
            className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 text-center transition-colors"
          >
            View Pricing
          </Link>
        </div>

        {/* Quick Code Example - Show immediately */}
        <div className="max-w-2xl mx-auto">
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-700 mb-3">
              Generate an SVG in seconds:
            </div>
            <CodeBlock
              language="bash"
              code={`curl -X POST https://api.chatsvg.com/v1/svg/generate \\
  -H "X-API-Key: sk_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "minimalist rocket icon", "style": "line-art"}'`}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-12">
        {/* Sidebar nav */}
        <nav className="hidden lg:block w-48 shrink-0 sticky top-20 self-start">
          <ul className="space-y-1 border-l border-gray-200">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block pl-4 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:border-l-2 hover:border-wizard-orange hover:pl-[14px] transition-all"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-16">
          {/* Quick Start */}
          <section>
            <SectionHeading id="quickstart">Quick Start</SectionHeading>
            <p className="text-gray-600 mb-6">
              ChatSVG offers two ways to generate SVGs: use our web app for
              quick creation, or integrate the API into your applications.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  🎨 Web App
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>
                      Sign up at{' '}
                      <Link
                        to="/"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        chatsvg.com
                      </Link>
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span>Enter your prompt and choose a style</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span>Download your SVG instantly</span>
                  </div>
                </div>
                <Link
                  to="/"
                  className="mt-4 block text-center py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Try Web App
                </Link>
              </div>

              <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-300">
                <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ API</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>
                      Create an API key in your{' '}
                      <Link
                        to="/api-keys"
                        className="text-wizard-orange hover:underline font-medium"
                      >
                        dashboard
                      </Link>
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span>POST to /v1/svg/generate with your prompt</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span>Poll /v1/svg/job/:id until ready</span>
                  </div>
                </div>
                <a
                  href="#api-keys"
                  className="mt-4 block text-center py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  View API Docs
                </a>
              </div>
            </div>
          </section>

          {/* Web App Guide */}
          <section>
            <SectionHeading id="web-app">Using the Web App</SectionHeading>
            <p className="text-gray-600 mb-6">
              The easiest way to generate SVGs is through our web interface.
              Perfect for designers, marketers, and anyone who needs quick
              custom graphics.
            </p>

            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900 mb-3">
                  How it works
                </h4>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    <div>
                      <strong>Describe what you want:</strong> Type a
                      description like "minimalist rocket icon" or "abstract
                      geometric pattern"
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    <div>
                      <strong>Choose a style:</strong> Select from flat,
                      outline, duotone, line-art, and more
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    <div>
                      <strong>Generate:</strong> AI creates your SVG in 30-60
                      seconds
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">
                      4
                    </span>
                    <div>
                      <strong>Download & use:</strong> Get SVG, PNG, or copy the
                      code directly
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
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
                  <div className="text-sm text-gray-700">
                    <strong className="text-gray-900">Credits:</strong> Each
                    generation costs 1 credit. Credits work for both web and API
                    access.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* API Keys */}
          <section>
            <SectionHeading id="api-keys">Getting API Keys</SectionHeading>
            <p className="text-gray-600 mb-6">
              API keys let you generate SVGs programmatically. They use the same
              credit balance as your web app account.
            </p>

            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Creating your first key
                </h4>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li>
                    1. Go to your{' '}
                    <Link
                      to="/api-keys"
                      className="text-wizard-orange hover:underline font-medium"
                    >
                      API Keys dashboard
                    </Link>
                  </li>
                  <li>2. Click "Create New API Key"</li>
                  <li>
                    3. Give it a descriptive name (e.g., "Production Server",
                    "Development")
                  </li>
                  <li>
                    4. Choose environment:{' '}
                    <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">
                      production
                    </code>{' '}
                    or{' '}
                    <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">
                      test
                    </code>
                  </li>
                  <li>5. Copy the key immediately — you won't see it again!</li>
                </ol>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div className="text-sm text-red-700">
                    <strong>Security best practices:</strong> Never commit API
                    keys to git, never expose them in client-side code, rotate
                    keys regularly, use test keys for development.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Authentication */}
          <section>
            <SectionHeading id="authentication">Authentication</SectionHeading>
            <p className="text-gray-600 mb-4">
              All API requests require an API key passed in the{' '}
              <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                X-API-Key
              </code>{' '}
              header.
            </p>

            <CodeBlock
              language="http"
              code={`X-API-Key: sk_live_your_key_here`}
            />

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Key formats
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <code className="bg-green-50 text-green-700 px-2 py-0.5 rounded font-mono text-xs">
                      sk_live_...
                    </code>
                    <span>Production keys — uses real credits</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded font-mono text-xs">
                      sk_test_...
                    </code>
                    <span>Test keys — for development</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span className="font-semibold">Security:</span> Never expose
                your API key in client-side code or public repositories. Keep it
                server-side only.
              </div>
            </div>
          </section>

          {/* Generate SVG */}
          <section>
            <SectionHeading id="generate">Generate SVG</SectionHeading>

            <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  POST
                </span>
                <code className="text-sm font-mono text-gray-900">
                  /v1/svg/generate
                </code>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Submit an SVG generation request. Returns a job ID that you can
                use to poll for the result.
              </p>

              <SubHeading id="generate-request">Request body</SubHeading>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">
                        Field
                      </th>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">
                        Type
                      </th>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">
                        Required
                      </th>
                      <th className="text-left py-2 font-semibold text-gray-900">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4">
                        <code className="font-mono text-xs">prompt</code>
                      </td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2 pr-4">Yes</td>
                      <td className="py-2">
                        Description of the SVG to generate
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4">
                        <code className="font-mono text-xs">style</code>
                      </td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2 pr-4">No</td>
                      <td className="py-2">
                        Art style (e.g. "outline", "duotone", "flat",
                        "line-art")
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4">
                        <code className="font-mono text-xs">model</code>
                      </td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2 pr-4">No</td>
                      <td className="py-2">
                        AI model to use (default: "gpt-4o")
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">
                        <code className="font-mono text-xs">
                          idempotencyKey
                        </code>
                      </td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2 pr-4">No</td>
                      <td className="py-2">
                        Prevent duplicate requests with a unique key
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Request</h4>
                <CodeBlock
                  language="bash"
                  code={`curl -X POST https://api.chatsvg.com/v1/svg/generate \\
  -H "X-API-Key: sk_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Minimal line icon of a rocket ship",
    "style": "line-art"
  }'`}
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Response (202)
                </h4>
                <CodeBlock
                  language="json"
                  code={`{
  "jobId": "gen_abc123def456",
  "status": "queued",
  "creditsCharged": true,
  "message": "SVG generation job created successfully",
  "estimatedCompletionTime": "30-60 seconds"
}`}
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Error responses
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <code className="shrink-0 bg-red-50 text-red-700 px-2 py-0.5 rounded font-mono text-xs">
                      402
                    </code>
                    <span>
                      Insufficient credits — purchase more to continue
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <code className="shrink-0 bg-red-50 text-red-700 px-2 py-0.5 rounded font-mono text-xs">
                      429
                    </code>
                    <span>
                      Monthly generation quota exceeded — wait for reset or
                      upgrade plan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Job Status */}
          <section>
            <SectionHeading id="job-status">Job Status</SectionHeading>

            <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  GET
                </span>
                <code className="text-sm font-mono text-gray-900">
                  /v1/svg/job/:jobId
                </code>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Check the status of a generation job. Poll this endpoint until{' '}
                <code className="bg-gray-100 px-1 rounded font-mono text-xs">
                  status
                </code>{' '}
                is{' '}
                <code className="bg-green-50 text-green-700 px-1 rounded font-mono text-xs">
                  SUCCEEDED
                </code>{' '}
                or{' '}
                <code className="bg-red-50 text-red-700 px-1 rounded font-mono text-xs">
                  FAILED
                </code>
                .
              </p>

              <h4 className="font-semibold text-gray-900 mb-2">Job statuses</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                <div className="rounded-lg bg-gray-50 px-3 py-2 text-center">
                  <code className="font-mono text-xs text-gray-700">
                    QUEUED
                  </code>
                </div>
                <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
                  <code className="font-mono text-xs text-blue-700">
                    RUNNING
                  </code>
                </div>
                <div className="rounded-lg bg-green-50 px-3 py-2 text-center">
                  <code className="font-mono text-xs text-green-700">
                    SUCCEEDED
                  </code>
                </div>
                <div className="rounded-lg bg-red-50 px-3 py-2 text-center">
                  <code className="font-mono text-xs text-red-700">FAILED</code>
                </div>
              </div>
            </div>

            <h4 className="font-semibold text-gray-900 mb-3">
              Completed job response (200)
            </h4>
            <CodeBlock
              language="json"
              code={`{
  "job": {
    "id": "gen_abc123def456",
    "status": "SUCCEEDED",
    "prompt": "Minimal line icon of a rocket ship",
    "style": "line-art",
    "model": "gpt-4o",
    "svg": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" ...>...</svg>",
    "url": "https://cdn.chatsvg.com/assets/gen_abc123.svg",
    "createdAt": "2026-02-15T10:30:00Z",
    "finishedAt": "2026-02-15T10:31:15Z",
    "creditsCharged": true
  }
}`}
            />
          </section>

          {/* Code Examples */}
          <section>
            <SectionHeading id="examples">Code Examples</SectionHeading>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Node.js</h4>
                <CodeBlock
                  language="javascript"
                  code={`const API_KEY = process.env.CHATSVG_API_KEY;
const BASE_URL = 'https://api.chatsvg.com';

async function generateSvg(prompt, style = 'outline') {
  // 1. Submit generation request
  const res = await fetch(\`\${BASE_URL}/v1/svg/generate\`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, style }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Generation failed');
  }

  const { jobId } = await res.json();

  // 2. Poll for result
  while (true) {
    const jobRes = await fetch(\`\${BASE_URL}/v1/svg/job/\${jobId}\`, {
      headers: { 'X-API-Key': API_KEY },
    });
    const { job } = await jobRes.json();

    if (job.status === 'SUCCEEDED') {
      return { svg: job.svg, url: job.url };
    }
    if (job.status === 'FAILED') {
      throw new Error(job.errorMessage || 'Generation failed');
    }

    // Wait 3 seconds before polling again
    await new Promise(r => setTimeout(r, 3000));
  }
}

const result = await generateSvg('A rocket ship icon', 'line-art');
console.log(result.url);`}
                />
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Python</h4>
                <CodeBlock
                  language="python"
                  code={`import requests
import time
import os

API_KEY = os.environ["CHATSVG_API_KEY"]
BASE_URL = "https://api.chatsvg.com"

def generate_svg(prompt: str, style: str = "outline") -> dict:
    # 1. Submit generation request
    res = requests.post(
        f"{BASE_URL}/v1/svg/generate",
        headers={
            "X-API-Key": API_KEY,
            "Content-Type": "application/json",
        },
        json={"prompt": prompt, "style": style},
    )
    res.raise_for_status()
    job_id = res.json()["jobId"]

    # 2. Poll for result
    while True:
        job_res = requests.get(
            f"{BASE_URL}/v1/svg/job/{job_id}",
            headers={"X-API-Key": API_KEY},
        )
        job = job_res.json()["job"]

        if job["status"] == "SUCCEEDED":
            return {"svg": job["svg"], "url": job["url"]}
        if job["status"] == "FAILED":
            raise Exception(job.get("errorMessage", "Generation failed"))

        time.sleep(3)

result = generate_svg("A rocket ship icon", "line-art")
print(result["url"])`}
                />
              </div>
            </div>
          </section>

          {/* Usage Guide */}
          <section>
            <SectionHeading id="usage-guide">Usage Guide</SectionHeading>
            <p className="text-gray-600 mb-8">
              ChatSVG is designed for <strong>one-time generation</strong> — you
              generate an SVG once, save it, and reuse it forever.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                <h4 className="text-lg font-bold text-green-900 mb-4">
                  Perfect for
                </h4>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold shrink-0">+</span>
                    <span>
                      <strong>Build-time generation:</strong> Generate icons
                      during CI/CD, commit to your repo
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold shrink-0">+</span>
                    <span>
                      <strong>User-generated content:</strong> Custom avatars,
                      logos, profile graphics (saved once)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold shrink-0">+</span>
                    <span>
                      <strong>CMS automation:</strong> Auto-generate hero images
                      from article titles
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold shrink-0">+</span>
                    <span>
                      <strong>Marketing campaigns:</strong> Unique graphics per
                      campaign, reused forever
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                <h4 className="text-lg font-bold text-red-900 mb-4">
                  Not designed for
                </h4>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold shrink-0">-</span>
                    <span>
                      <strong>Runtime rendering:</strong> Don't call on every
                      page load or component mount
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold shrink-0">-</span>
                    <span>
                      <strong>Replacing icon libraries:</strong> Use pre-made
                      icons for common UI elements
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold shrink-0">-</span>
                    <span>
                      <strong>Re-generating the same SVG:</strong> Generate
                      once, cache the URL forever
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold shrink-0">-</span>
                    <span>
                      <strong>Data visualization:</strong> Use dedicated
                      charting libraries instead
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
                  <h5 className="font-bold text-blue-900 mb-1">
                    Key principle: Generate, Save, Reuse
                  </h5>
                  <p className="text-sm text-gray-700">
                    Think of ChatSVG like hiring a designer on-demand. You
                    request an asset, receive it, and use that exact file
                    forever. You don't re-hire the designer every time someone
                    views your website.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Credits & Pricing */}
          <section>
            <SectionHeading id="pricing">Credits & Pricing</SectionHeading>
            <p className="text-gray-600 mb-6">
              ChatSVG uses a unified credit system — buy credits once, use them
              for web app or API. No subscriptions, no monthly fees. Credits
              never expire.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">
                    How Credits Work
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>1 credit = 1 SVG generation (web or API)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Credits never expire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Use anywhere: web app or API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Buy more anytime at volume discounts</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <h4 className="text-lg font-bold text-gray-900">
                    Example Pricing
                  </h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">50 credits</span>
                    <span className="font-semibold text-gray-900">
                      $5{' '}
                      <span className="text-xs text-gray-500">
                        ($0.10 each)
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">200 credits</span>
                    <span className="font-semibold text-gray-900">
                      $15{' '}
                      <span className="text-xs text-gray-500">
                        ($0.075 each)
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">500 credits</span>
                    <span className="font-semibold text-gray-900">
                      $30{' '}
                      <span className="text-xs text-gray-500">
                        ($0.06 each)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-green-50 to-blue-50 rounded-xl border-2 border-green-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🎉</span>
                <h4 className="text-lg font-bold text-gray-900">
                  Currently in Beta — Everything FREE!
                </h4>
              </div>
              <p className="text-sm text-gray-700">
                We're in beta and offering unlimited free generations for both
                web and API. No credit card required. Paid plans will launch
                after beta ends.
              </p>
            </div>

            <p className="text-sm text-gray-500 mt-6 text-center">
              View full pricing details on the{' '}
              <Link
                to="/pricing"
                className="text-wizard-orange hover:underline font-medium"
              >
                Pricing page
              </Link>
              .
            </p>
          </section>

          {/* MCP Server / Claude Plugin - Coming Soon */}
          <section>
            <SectionHeading id="mcp">MCP Server (Coming Soon)</SectionHeading>

            <div className="rounded-2xl border-2 border-dashed border-purple-300 bg-linear-to-br from-purple-50 to-blue-50 p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center">
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
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-bold text-gray-900">
                      ChatSVG MCP Server
                    </h4>
                    <span className="inline-flex items-center gap-1.5 bg-purple-100 border border-purple-200 rounded-full px-3 py-0.5 text-xs font-semibold text-purple-700">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
                      </span>
                      In Development
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Generate SVGs directly from Claude Desktop, Cursor,
                    Windsurf, and other MCP-compatible AI tools. No manual API
                    calls needed — just ask in natural language.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-gray-200/60 mb-6">
                <h5 className="font-bold text-gray-900 mb-3">What is MCP?</h5>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Model Context Protocol (MCP)</strong> is Anthropic's
                  open standard that allows Claude and other AI assistants to
                  securely connect to external tools and data sources.
                </p>
                <p className="text-sm text-gray-600">
                  Instead of copying API code snippets, you'll be able to simply
                  say "generate a rocket icon" and Claude will use ChatSVG's MCP
                  server to handle it automatically.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/70 rounded-lg p-4 border border-gray-200/60">
                  <h5 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                    <span className="text-purple-500">→</span>
                    How it will work
                  </h5>
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 font-bold text-purple-500">
                        1.
                      </span>
                      <span>Install ChatSVG MCP server via npm/config</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 font-bold text-purple-500">
                        2.
                      </span>
                      <span>Add your ChatSVG API key to MCP config</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 font-bold text-purple-500">
                        3.
                      </span>
                      <span>Ask Claude to generate SVGs naturally</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 font-bold text-purple-500">
                        4.
                      </span>
                      <span>Claude handles API calls and returns SVG</span>
                    </li>
                  </ol>
                </div>
                <div className="bg-white/70 rounded-lg p-4 border border-gray-200/60">
                  <h5 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Why it's better
                  </h5>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold shrink-0">
                        +
                      </span>
                      <span>No need to write API integration code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold shrink-0">
                        +
                      </span>
                      <span>API keys stay local and secure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold shrink-0">
                        +
                      </span>
                      <span>Works seamlessly in your dev workflow</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold shrink-0">
                        +
                      </span>
                      <span>Generate SVGs while coding in Cursor</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-gray-400">
                    example
                  </span>
                </div>
                <code className="text-sm text-gray-100 block">
                  <span className="text-gray-400">
                    // In Claude Desktop or Cursor:
                  </span>
                  <br />
                  <span className="text-blue-400">
                    "Generate a minimalist rocket icon in flat style"
                  </span>
                  <br />
                  <span className="text-gray-400">
                    // Claude uses MCP → calls ChatSVG API → returns SVG
                  </span>
                </code>
              </div>

              <div className="text-center">
                <a
                  href="mailto:support@chatsvg.com?subject=MCP Server Early Access"
                  className="inline-block px-6 py-2.5 rounded-lg bg-linear-to-r from-purple-600 to-blue-600 text-sm font-medium text-white shadow-sm hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Request early access
                </a>
                <p className="mt-3 text-xs text-gray-600">
                  We'll notify you when the MCP server is ready for testing
                </p>
              </div>
            </div>
          </section>

          {/* Help */}
          <section className="bg-gray-900 rounded-2xl p-10 text-center text-white">
            <h3 className="text-2xl font-bold mb-3">Need help?</h3>
            <p className="text-gray-300 max-w-xl mx-auto mb-6">
              Check out the examples above or reach out to our team. We're happy
              to help you get started.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
