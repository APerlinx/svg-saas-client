import { Link } from 'react-router-dom'
import { useState } from 'react'
import { AI_MODELS, DEFAULT_MODEL } from '../constants/models'
import { SVG_STYLES, DEFAULT_STYLE } from '../constants/svgStyles'

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

function TabbedCodeBlock({
  tabs,
}: {
  tabs: Array<{ id: string; label: string; language: string; code: string }>
}) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? '')
  const [copied, setCopied] = useState(false)

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0]

  if (!activeTab) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800">
      <div className="flex items-center justify-between bg-gray-900 px-3 py-2 border-b border-gray-700">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-gray-100'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="bg-gray-900 px-4 pt-2 pb-1 border-b border-gray-800">
        <span className="text-[11px] font-mono text-gray-500">
          {activeTab.language}
        </span>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto">
        <code>{activeTab.code}</code>
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
  { id: 'mcp', label: 'MCP Server' },
  { id: 'mcp-quick-connect', label: 'Quick Connect' },
  { id: 'mcp-claude', label: 'Claude Setup' },
  { id: 'mcp-vscode', label: 'VS Code / Copilot Setup' },
  { id: 'mcp-tools', label: 'Use The Tools' },
  { id: 'mcp-errors', label: 'Troubleshooting' },
  { id: 'mcp-local-note', label: 'Local Dev (Optional)' },
  { id: 'mcp-last-updated', label: 'Last Updated' },
  { id: 'quickstart', label: 'API Quick Start' },
  { id: 'api-keys', label: 'Getting API Keys' },
  { id: 'authentication', label: 'API Authentication' },
  { id: 'generate', label: 'Generate Endpoint' },
  { id: 'options', label: 'Model & Style options' },
  { id: 'job-status', label: 'Job Status' },
  { id: 'examples', label: 'Code Examples' },
  { id: 'pricing', label: 'Credits & Pricing' },
  { id: 'web-app', label: 'Using Web App' },
]

const AVAILABLE_MODELS = AI_MODELS.filter((m) => m.section !== 'coming-soon')
const COMING_SOON_MODELS = AI_MODELS.filter((m) => m.section === 'coming-soon')

const MCP_CLAUDE_CONFIG_EXAMPLE = `{
  "mcpServers": {
    "chatsvg-mcp": {
      "type": "http",
      "url": "https://api.chatsvg.dev/mcp"
    }
  }
}`

const MCP_VSCODE_CONFIG_EXAMPLE = `{
  "mcpServers": {
    "chatsvg-mcp": {
      "type": "http",
      "url": "https://api.chatsvg.dev/mcp"
    }
  }
}

Save as .mcp.json in your workspace root,
then authenticate in MCP Servers.`

const NODE_CODE_EXAMPLE = `/**
 * Node.js example (Node 18+)
 * Run: CHATSVG_API_KEY=sk_live_xxx node generate.mjs
 */

const API_KEY = process.env.CHATSVG_API_KEY
const BASE_URL = 'https://api.chatsvg.com'

async function generateSvg({ prompt, style = 'line-art' }) {
  const payload = {
    prompt,
    style,
    // model: 'your-preferred-model', // optional
    // idempotencyKey: 'your-unique-key', // optional
  }

  const submitRes = await fetch(\`\${BASE_URL}/v1/svg/generate\`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!submitRes.ok) {
    const errText = await submitRes.text()
    throw new Error(\`Generate request failed: \${submitRes.status} \${errText}\`)
  }

  const { jobId } = await submitRes.json()
  if (!jobId) {
    throw new Error('Missing jobId in generate response')
  }

  // Implement polling using GET /v1/svg/job/:jobId
  // Example:
  // const jobRes = await fetch(\`\${BASE_URL}/v1/svg/job/\${jobId}\`, {
  //   headers: { 'X-API-Key': API_KEY },
  // })

  return { jobId }
}

const result = await generateSvg({
  prompt: 'Minimal line icon of a rocket ship',
  style: 'line-art',
})

console.log('Job ID:', result.jobId)
// After implementing polling, you'll also have result.url / result.svg`

const PYTHON_CODE_EXAMPLE = `"""
Python example
Run: CHATSVG_API_KEY=sk_live_xxx python generate.py
"""

import os
import time
import requests

API_KEY = os.environ.get("CHATSVG_API_KEY")
BASE_URL = "https://api.chatsvg.com"


def generate_svg(prompt: str, style: str = "line-art") -> dict:
  payload = {
    "prompt": prompt,
    "style": style,
    # "model": "your-preferred-model",  # optional
    # "idempotencyKey": "your-unique-key",  # optional
  }

    submit_res = requests.post(
        f"{BASE_URL}/v1/svg/generate",
        headers={
            "X-API-Key": API_KEY,
            "Content-Type": "application/json",
        },
    json=payload,
        timeout=30,
    )
    submit_res.raise_for_status()

    body = submit_res.json()
    job_id = body.get("jobId")
    if not job_id:
        raise RuntimeError("Missing jobId in generate response")

    # Implement polling using GET /v1/svg/job/:jobId
    # Example:
    # job_res = requests.get(
    #     f"{BASE_URL}/v1/svg/job/{job_id}",
    #     headers={"X-API-Key": API_KEY},
    #     timeout=30,
    # )

    return {"job_id": job_id}


result = generate_svg(
    prompt="Minimal line icon of a rocket ship",
    style="line-art",
)

print("Job ID:", result["job_id"])
# After implementing polling, you'll also have result["url"] / result["svg"]`

export default function Docs() {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 sm:py-16 px-4">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          ChatSVG MCP + API Docs
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
          Connect ChatSVG MCP Server to Claude or VS Code in minutes, then use
          API and web app docs for deeper integration.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 mb-12">
          <Link
            to="/api-keys"
            className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold bg-linear-to-r from-wizard-orange to-wizard-orange/90 text-white shadow-sm text-center transition-all hover:from-wizard-orange/90 hover:to-wizard-orange"
          >
            Create API Key
          </Link>
          <Link
            to="/pricing"
            className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 text-center transition-colors"
          >
            Plans & Credits
          </Link>
        </div>

        {/* Quick Code Example - Show immediately */}
        <div className="max-w-2xl mx-auto">
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-700 mb-3">
              MCP quick connect:
            </div>
            <TabbedCodeBlock
              tabs={[
                {
                  id: 'claude',
                  label: 'Claude',
                  language: 'json',
                  code: MCP_CLAUDE_CONFIG_EXAMPLE,
                },
                {
                  id: 'vscode',
                  label: 'VS Code',
                  language: 'json',
                  code: MCP_VSCODE_CONFIG_EXAMPLE,
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-12">
        {/* Content */}
        <div className="min-w-0 flex-1 space-y-16">
          {/* MCP Server */}
          <section>
            <SectionHeading id="mcp">MCP Server</SectionHeading>
            <p className="text-gray-600 mb-6">
              Use ChatSVG MCP Server to generate SVGs directly from Claude, VS
              Code, and other MCP-compatible clients using OAuth Bearer
              authentication.
            </p>

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 mb-6">
              <div className="text-sm text-amber-900">
                <strong>Important:</strong> MCP uses
                <strong> OAuth Bearer token</strong> with
                <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs mx-1">
                  Authorization: Bearer &lt;access_token&gt;
                </code>
                . Do not use
                <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs mx-1">
                  X-API-Key
                </code>
                on
                <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs mx-1">
                  /mcp
                </code>
                .
              </div>
            </div>

            <SubHeading id="mcp-quick-connect">
              Quick connect in 2 minutes
            </SubHeading>
            <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
              <ol className="space-y-3 text-sm text-gray-700">
                <li>
                  1. Add ChatSVG MCP server URL in your client config:
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs ml-1">
                    https://api.chatsvg.dev/mcp
                  </code>
                </li>
                <li>
                  2. Reload the client and click Authenticate for the MCP
                  server.
                </li>
                <li>3. Complete OAuth in the browser.</li>
                <li>
                  4. Call tools:
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs mx-1">
                    list_styles
                  </code>
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs mr-1">
                    generate_svg
                  </code>
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">
                    get_job_status
                  </code>
                  .
                </li>
              </ol>
            </div>

            <SubHeading id="mcp-claude">Claude setup</SubHeading>
            <p className="text-gray-600 mb-3 text-sm">
              Add ChatSVG as an HTTP MCP server in Claude settings, then
              authenticate.
            </p>
            <CodeBlock
              language="json"
              code={`{
  "mcpServers": {
    "chatsvg-mcp": {
      "type": "http",
      "url": "https://api.chatsvg.dev/mcp"
    }
  }
}`}
            />

            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 mt-4 mb-8">
              <div className="text-sm text-blue-900">
                <strong>Tip:</strong> After saving config, reopen Claude MCP
                Servers, click Authenticate, finish browser OAuth, and return to
                Claude to start generating.
              </div>
            </div>

            <SubHeading id="mcp-vscode">VS Code / Copilot setup</SubHeading>
            <p className="text-gray-600 mb-3 text-sm">
              In your workspace root, add a
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs mx-1">
                .mcp.json
              </code>
              file:
            </p>
            <CodeBlock
              language="json"
              code={`{
  "mcpServers": {
    "chatsvg-mcp": {
      "type": "http",
      "url": "https://api.chatsvg.dev/mcp"
    }
  }
}`}
            />

            <div className="rounded-xl border border-gray-200 bg-white p-5 mt-4 mb-8">
              <ol className="space-y-2 text-sm text-gray-700">
                <li>1. Save .mcp.json in workspace root.</li>
                <li>2. Reload VS Code if needed.</li>
                <li>3. Open MCP Servers in VS Code/Copilot.</li>
                <li>4. Click Authenticate for chatsvg-mcp.</li>
                <li>
                  5. Finish browser OAuth and start calling ChatSVG tools.
                </li>
              </ol>
            </div>

            <SubHeading id="mcp-tools">Use the tools</SubHeading>
            <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
              <ol className="space-y-2 text-sm text-gray-700">
                <li>
                  1. Call
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs mx-1">
                    list_styles
                  </code>
                  to get available styles.
                </li>
                <li>
                  2. Call
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs mx-1">
                    generate_svg
                  </code>
                  with prompt and style.
                </li>
                <li>
                  3. Poll
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs mx-1">
                    get_job_status
                  </code>
                  until completed.
                </li>
              </ol>
            </div>

            <CodeBlock
              language="http"
              code={`POST /mcp
Authorization: Bearer <access_token>
Content-Type: application/json
MCP-Session-Id: <session_id>`}
            />

            <SubHeading id="mcp-errors">Troubleshooting</SubHeading>
            <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 my-4">
              <div className="text-sm text-orange-900">
                <strong>Troubleshooting:</strong> most setup issues are token
                scope/expiry, missing
                <code className="bg-orange-100 px-1.5 py-0.5 rounded font-mono text-xs mx-1">
                  MCP-Session-Id
                </code>
                , or rate limits.
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 mb-8">
              <ul className="space-y-3 text-sm text-gray-700">
                <li>
                  <strong>401 invalid/missing token:</strong> re-authenticate
                  and ensure Authorization Bearer header is present.
                </li>
                <li>
                  <strong>404 session not found:</strong> missing/expired
                  MCP-Session-Id.
                </li>
                <li>
                  <strong>429 rate limit:</strong> retry with backoff.
                </li>
                <li>
                  <strong>Insufficient credits:</strong> generation tool calls
                  fail until credits are available.
                </li>
              </ul>
            </div>

            <SubHeading id="mcp-local-note">Local dev (optional)</SubHeading>
            <p className="text-sm text-gray-600 mb-3">
              Most users should use the hosted MCP URL above. Local backend run
              is mainly for ChatSVG backend development.
            </p>
            <CodeBlock
              language="text"
              code={`Local MCP URL: http://localhost:3001/mcp
Health: GET /mcp/health

For local generation to complete, run all 3 processes:
- API server
- worker
- MCP server`}
            />

            <div
              id="mcp-last-updated"
              className="text-sm text-gray-500 border-t border-gray-200 pt-4 mt-8"
            >
              Last updated: March 27, 2026
            </div>
          </section>

          {/* Quick Start */}
          <section>
            <SectionHeading id="quickstart">API Quick Start</SectionHeading>
            <p className="text-gray-600 mb-6">
              Use REST API when you want to call ChatSVG from your own backend
              or product workflow.
            </p>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <ol className="space-y-3 text-sm text-gray-700">
                <li>
                  1. Create an API key in your{' '}
                  <Link
                    to="/api-keys"
                    className="text-wizard-orange hover:underline font-medium"
                  >
                    dashboard
                  </Link>
                  .
                </li>
                <li>2. POST to /v1/svg/generate with prompt and style.</li>
                <li>3. Poll /v1/svg/job/:jobId until SUCCEEDED or FAILED.</li>
              </ol>
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
                        AI model to use (default:{' '}
                        <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">
                          {DEFAULT_MODEL}
                        </code>
                        )
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

          {/* Model & Style Options */}
          <section>
            <SectionHeading id="options">Model & Style options</SectionHeading>

            <p className="text-gray-600 mb-6">
              Use these exact allow-list values for request body fields{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">
                model
              </code>{' '}
              and{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">
                style
              </code>
              . Both fields are optional.
            </p>

            <div className="grid lg:grid-cols-2 gap-6 mb-4">
              <div>
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">Models</h4>
                  <div className="text-xs text-gray-600 mb-3">
                    Default model:{' '}
                    <code className="bg-gray-100 text-gray-900 px-2 py-0.5 rounded font-mono">
                      {DEFAULT_MODEL}
                    </code>
                  </div>
                  <div className="space-y-2">
                    {AVAILABLE_MODELS.map((model) => (
                      <div
                        key={model.value}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-lg border border-gray-100 px-3 py-2"
                      >
                        <span className="text-sm text-gray-800">
                          {model.label}
                        </span>
                        <code className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          {model.value}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>

                {COMING_SOON_MODELS.length > 0 && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Model variants coming soon
                    </h4>
                    <div className="space-y-2">
                      {COMING_SOON_MODELS.map((model) => (
                        <div
                          key={model.value}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-lg border border-gray-200 px-3 py-2"
                        >
                          <span className="text-sm text-gray-700">
                            {model.label}
                          </span>
                          <code className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded">
                            {model.value}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h4 className="font-semibold text-gray-900 mb-3">Styles</h4>
                <div className="text-xs text-gray-600 mb-3">
                  Default style:{' '}
                  <code className="bg-gray-100 text-gray-900 px-2 py-0.5 rounded font-mono">
                    {DEFAULT_STYLE}
                  </code>
                </div>
                <div className="space-y-2">
                  {SVG_STYLES.map((style) => (
                    <div
                      key={style.value}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-lg border border-gray-100 px-3 py-2"
                    >
                      <span className="text-sm text-gray-800">
                        {style.label}
                      </span>
                      <code className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {style.value}
                      </code>
                    </div>
                  ))}
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
    "model": "${DEFAULT_MODEL}",
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

            <p className="text-gray-600 mb-6">
              Both examples follow the same flow: submit a generation request,
              then poll until the job reaches{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">
                SUCCEEDED
              </code>{' '}
              or{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">
                FAILED
              </code>
              .
            </p>

            <TabbedCodeBlock
              tabs={[
                {
                  id: 'node-example',
                  label: 'Node',
                  language: 'javascript',
                  code: NODE_CODE_EXAMPLE,
                },
                {
                  id: 'python-example',
                  label: 'Python',
                  language: 'python',
                  code: PYTHON_CODE_EXAMPLE,
                },
              ]}
            />
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
                      <strong>Content pipelines:</strong> Generate SVG assets as
                      part of publishing or build automation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold shrink-0">+</span>
                    <span>
                      <strong>Internal tools:</strong> Produce custom visuals
                      for dashboards, docs, and operations flows
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
                    Treat generated SVGs as build artifacts. Generate once,
                    store them in your own storage/CDN, and serve them without
                    regenerating on every request.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Credits & Pricing */}
          <section>
            <SectionHeading id="pricing">Credits & Pricing</SectionHeading>
            <p className="text-gray-600 mb-6">
              Credits are shared across the web app and API. Plan limits define
              your initial credit allocation, recurring refill, generation
              limits, and API limits.
            </p>

            <div className="rounded-xl border border-gray-200 bg-white p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Credit model at a glance
              </h4>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 font-bold">•</span>
                  <span>
                    <strong>Initial allocation:</strong> credits granted when a
                    plan becomes active.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 font-bold">•</span>
                  <span>
                    <strong>Recurring refill:</strong> credits added on the
                    plan's refill cadence.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 font-bold">•</span>
                  <span>
                    <strong>Unified usage:</strong> web app and API consume the
                    same credit pool.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 font-bold">•</span>
                  <span>
                    <strong>Rate limits and key limits:</strong> enforced per
                    active plan.
                  </span>
                </li>
              </ul>
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

          {/* Web App Guide */}
          <section>
            <SectionHeading id="web-app">Using the Web App</SectionHeading>
            <p className="text-gray-600 mb-6">
              Use the web app when you want to iterate quickly on prompts,
              styles, and outputs before integrating in code.
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
                      <strong>Describe what you want:</strong> enter your SVG
                      prompt.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    <div>
                      <strong>Choose a style:</strong> pick flat, outline,
                      duotone, line-art, and more.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    <div>
                      <strong>Generate and download:</strong> export SVG or PNG.
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                <div className="text-sm text-gray-700">
                  <strong className="text-gray-900">Credits:</strong> Each
                  generation costs 1 credit. Credits are shared across web app,
                  API, and MCP usage.
                </div>
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

        {/* Right-side table of contents */}
        <nav className="hidden xl:block w-56 shrink-0 sticky top-20 self-start">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            On this page
          </div>
          <ul className="space-y-1 border-l border-gray-200">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block pl-4 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:border-l-2 hover:border-wizard-orange hover:pl-3.5 transition-all"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
