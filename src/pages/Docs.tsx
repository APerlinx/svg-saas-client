import { Link } from 'react-router-dom'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'quickstart', label: 'Quick start' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'best-practices', label: 'Make the most of it' },
  { id: 'collaboration', label: 'Collaboration' },
  { id: 'faq', label: 'FAQ' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

function AnchorLink({ id, children }: { id: SectionId; children: string }) {
  return (
    <a
      href={`#${id}`}
      className="text-sm text-gray-600 hover:text-gray-900 hover:underline underline-offset-4"
    >
      {children}
    </a>
  )
}

function SectionCard({
  title,
  description,
  children,
  id,
}: {
  id: SectionId
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 bg-white/50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg"
    >
      <div className="mb-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {title}
        </h2>
        {description ? (
          <p className="text-gray-600 mt-2 max-w-3xl">{description}</p>
        ) : null}
      </div>

      {children}
    </section>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-2 h-1.5 w-1.5 rounded-full bg-wizard-orange shrink-0"
        aria-hidden="true"
      />
      <span className="text-gray-700">{children}</span>
    </li>
  )
}

export default function Docs() {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 sm:py-16 px-4">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-full px-4 py-1.5 text-xs font-medium text-gray-700">
          <span className="text-wizard-orange font-semibold">Docs</span>
          <span className="text-gray-400">•</span>
          <span>For developers & designers</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-5">
          Build better SVGs with ChatSVG
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
          Learn what ChatSVG does, how it works, and how to get consistently
          useful, editable SVG output for product UI, marketing, and prototypes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full font-semibold bg-linear-to-r from-wizard-orange to-wizard-orange/90 text-white hover:from-wizard-orange/90 hover:to-wizard-orange shadow-sm text-center"
          >
            Open Generator
          </Link>
          <Link
            to="/pricing"
            className="w-full sm:w-auto px-6 py-3 rounded-full font-semibold bg-white/70 hover:bg-white border border-gray-200 text-gray-900 text-center"
          >
            Pricing
          </Link>
        </div>
      </div>

      {/* On this page */}
      <div className="bg-white/40 backdrop-blur-sm border border-gray-200/60 rounded-3xl p-5 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-gray-900">
              On this page
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Jump to a section (no fluff).
            </div>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {SECTIONS.map((s) => (
              <AnchorLink key={s.id} id={s.id}>
                {s.label}
              </AnchorLink>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        <SectionCard
          id="overview"
          title="Overview"
          description="ChatSVG helps you turn a short prompt into editable SVG artwork you can ship. It’s built for quick iteration, consistent style, and clean output that’s easy to drop into real interfaces."
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-5">
              <div className="text-sm font-semibold text-gray-900">
                What you get
              </div>
              <ul className="mt-3 space-y-2">
                <Bullet>SVG you can edit (not just a raster image)</Bullet>
                <Bullet>Style options for different product vibes</Bullet>
                <Bullet>Output that works in web and design tools</Bullet>
              </ul>
            </div>
            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-5">
              <div className="text-sm font-semibold text-gray-900">
                What it’s good for
              </div>
              <ul className="mt-3 space-y-2">
                <Bullet>Landing-page illustrations</Bullet>
                <Bullet>App empty states and onboarding</Bullet>
                <Bullet>Icons, badges, and diagrams</Bullet>
              </ul>
            </div>
            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-5">
              <div className="text-sm font-semibold text-gray-900">
                What to expect
              </div>
              <ul className="mt-3 space-y-2">
                <Bullet>Iterate a few times to nail your style</Bullet>
                <Bullet>Keep prompts specific for repeatability</Bullet>
                <Bullet>Use design constraints to stay on-brand</Bullet>
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          id="quickstart"
          title="Quick start"
          description="Two fast paths: one for shipping to production, one for exploring in design."
        >
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-6">
              <div className="text-sm font-semibold text-gray-900">
                For developers
              </div>
              <div className="text-gray-600 text-sm mt-1">
                Generate → clean up → embed.
              </div>

              <ol className="mt-4 space-y-3">
                <li className="text-gray-700">
                  1) Generate an SVG that matches your UI (style + content).
                </li>
                <li className="text-gray-700">
                  2) Prefer simple shapes and readable strokes for small sizes.
                </li>
                <li className="text-gray-700">
                  3) Use the SVG inline for full control (CSS, aria labels).
                </li>
              </ol>

              <div className="mt-5 bg-gray-900 text-gray-100 rounded-2xl p-4 text-xs overflow-x-auto">
                <pre className="whitespace-pre">{`// React example
export function LogoMark() {
  return (
    <svg aria-label="ChatSVG mark" role="img">{/* paste SVG here */}</svg>
  )
}`}</pre>
              </div>
            </div>

            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-6">
              <div className="text-sm font-semibold text-gray-900">
                For designers
              </div>
              <div className="text-gray-600 text-sm mt-1">
                Prompt → evaluate → refine.
              </div>

              <ol className="mt-4 space-y-3">
                <li className="text-gray-700">
                  1) Start with a clear subject + composition.
                </li>
                <li className="text-gray-700">
                  2) Specify constraints (palette, stroke width, minimal
                  detail).
                </li>
                <li className="text-gray-700">
                  3) Iterate with small changes, not full rewrites.
                </li>
              </ol>

              <div className="mt-5 bg-gray-900 text-gray-100 rounded-2xl p-4 text-xs overflow-x-auto">
                <pre className="whitespace-pre">{`Prompt template
"[subject], [style], [composition].
Palette: [colors].
Constraints: flat fills, 2px stroke, no text, no gradients."`}</pre>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          id="how-it-works"
          title="How it works"
          description="A simple mental model to help you iterate faster and get consistent results."
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-5">
              <div className="text-sm font-semibold text-gray-900">
                1) Describe intent
              </div>
              <p className="text-sm text-gray-600 mt-2">
                State what the SVG should communicate, plus the vibe and
                constraints.
              </p>
              <ul className="mt-4 space-y-2">
                <Bullet>Subject + composition</Bullet>
                <Bullet>Style + mood</Bullet>
                <Bullet>Constraints (no background, no text)</Bullet>
              </ul>
            </div>

            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-5">
              <div className="text-sm font-semibold text-gray-900">
                2) Generate & check
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Look for small-size legibility and whether shapes are clean.
              </p>
              <ul className="mt-4 space-y-2">
                <Bullet>Readable silhouette</Bullet>
                <Bullet>Consistent stroke widths</Bullet>
                <Bullet>Editable layers/groups</Bullet>
              </ul>
            </div>

            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-5">
              <div className="text-sm font-semibold text-gray-900">
                3) Refine in steps
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Make one change per iteration to keep control.
              </p>
              <ul className="mt-4 space-y-2">
                <Bullet>“Make it simpler”</Bullet>
                <Bullet>“Increase contrast”</Bullet>
                <Bullet>“Remove background”</Bullet>
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          id="best-practices"
          title="Make the most of it"
          description="Small prompt and design decisions that make outputs easier to ship."
        >
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-6">
              <div className="text-sm font-semibold text-gray-900">
                Prompting guidelines
              </div>
              <ul className="mt-4 space-y-2">
                <Bullet>
                  Prefer concrete nouns (“robot mascot holding a wrench”) over
                  abstract (“techy vibe”).
                </Bullet>
                <Bullet>
                  Add constraints: “no background”, “flat fills”, “2px stroke”.
                </Bullet>
                <Bullet>
                  Specify layout: centered, left-aligned, badge, icon-only, etc.
                </Bullet>
                <Bullet>
                  Keep a reusable “prompt recipe” for consistent output.
                </Bullet>
              </ul>
            </div>

            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-6">
              <div className="text-sm font-semibold text-gray-900">
                Shipping guidelines
              </div>
              <ul className="mt-4 space-y-2">
                <Bullet>
                  For icons: minimize detail, increase negative space, avoid
                  tiny strokes.
                </Bullet>
                <Bullet>
                  For accessibility: add a title/aria label when the SVG conveys
                  meaning.
                </Bullet>
                <Bullet>
                  For performance: prefer fewer paths; avoid unnecessary groups.
                </Bullet>
                <Bullet>
                  For theming: use `currentColor` when possible and style via
                  CSS.
                </Bullet>
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          id="collaboration"
          title="Collaboration"
          description="A lightweight workflow for teams so designers and developers stay aligned."
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-5">
              <div className="text-sm font-semibold text-gray-900">
                Share a recipe
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Keep a shared “prompt recipe” + style constraints in your design
                system docs.
              </p>
            </div>
            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-5">
              <div className="text-sm font-semibold text-gray-900">
                Version your SVG
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Store the final SVG in Git so it can be reviewed like code.
              </p>
            </div>
            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-5">
              <div className="text-sm font-semibold text-gray-900">
                Agree on constraints
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Decide stroke widths, corner radius, and palette once and reuse
                everywhere.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-linear-to-r from-wizard-blue/10 to-wizard-purple/10 backdrop-blur-sm rounded-3xl p-6">
            <div className="text-sm font-semibold text-gray-900">
              Team checklist
            </div>
            <ul className="mt-3 space-y-2">
              <Bullet>Define 2–3 approved styles for your brand</Bullet>
              <Bullet>Keep a single source of truth for the final SVG</Bullet>
              <Bullet>
                Document icon sizes (16/20/24/32) and stroke rules
              </Bullet>
              <Bullet>Review small-size legibility before shipping</Bullet>
            </ul>
          </div>
        </SectionCard>

        <SectionCard
          id="faq"
          title="FAQ"
          description="Answers to common questions (and what to do if something looks off)."
        >
          <div className="space-y-4">
            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-5">
              <div className="font-semibold text-gray-900">
                Why does an SVG look different in the browser?
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Browsers apply default sizing and CSS differently than design
                tools. Try embedding inline SVG, set a viewBox, and avoid
                hard-coded fills if you want theming.
              </p>
            </div>

            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-5">
              <div className="font-semibold text-gray-900">
                How do I get cleaner icons?
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Ask for “icon-only, minimal detail, flat fills, consistent 2px
                stroke, no background, centered in a square.”
              </p>
            </div>

            <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-5">
              <div className="font-semibold text-gray-900">
                Can I use the output commercially?
              </div>
              <p className="text-sm text-gray-600 mt-2">
                See the Pricing page for the latest licensing details and what’s
                included.
              </p>
              <div className="mt-3">
                <Link
                  to="/pricing"
                  className="text-sm font-semibold text-wizard-orange hover:text-wizard-orange/90"
                >
                  View pricing
                </Link>
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="text-center text-sm text-gray-500">
          Missing something you want documented? Tell me what section to add.
        </div>
      </div>
    </div>
  )
}
