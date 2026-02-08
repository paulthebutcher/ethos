// Stack page - current tooling and infrastructure choices

const STACK = {
  development: {
    title: "Development",
    description: "Tools for building and shipping",
    tools: [
      {
        name: "Cowork",
        category: "AI Assistant",
        why: "Desktop AI agent that can read/write files, run code, browse web. Primary development interface.",
        link: "https://claude.ai",
      },
      {
        name: "Claude Code",
        category: "AI Assistant",
        why: "Terminal-based alternative for when Cowork is too heavy. Good for focused coding sessions.",
        link: "https://claude.ai/code",
      },
      {
        name: "Cursor",
        category: "Editor",
        why: "VS Code fork with AI built in. Useful for exploring codebases and quick edits.",
        link: "https://cursor.sh",
      },
      {
        name: "Git + GitHub",
        category: "Version Control",
        why: "Standard. GitHub for hosting, Actions for CI/CD where needed.",
        link: "https://github.com",
      },
    ],
  },
  frontend: {
    title: "Frontend",
    description: "Default choices for web apps",
    tools: [
      {
        name: "Next.js 14",
        category: "Framework",
        why: "App Router, server components, good defaults. Vercel makes deployment trivial.",
        link: "https://nextjs.org",
      },
      {
        name: "React",
        category: "UI",
        why: "Comes with Next.js. Component model works well with AI-assisted development.",
        link: "https://react.dev",
      },
      {
        name: "Tailwind CSS",
        category: "Styling",
        why: "Utility classes are AI-friendly. No context-switching between files.",
        link: "https://tailwindcss.com",
      },
      {
        name: "Vercel",
        category: "Hosting",
        why: "Zero-config deployment for Next.js. Free tier covers early-stage projects.",
        link: "https://vercel.com",
      },
    ],
  },
  backend: {
    title: "Backend",
    description: "Data and authentication",
    tools: [
      {
        name: "Supabase",
        category: "Database",
        why: "Postgres with auth, real-time, and storage built in. Generous free tier.",
        link: "https://supabase.com",
      },
      {
        name: "Clerk",
        category: "Auth",
        why: "Drop-in auth with good UX. Handles the hard parts (MFA, social login, org management).",
        link: "https://clerk.com",
      },
      {
        name: "Anthropic API",
        category: "AI",
        why: "Claude for natural language processing, function calling, structured extraction.",
        link: "https://anthropic.com",
      },
    ],
  },
  operations: {
    title: "Operations",
    description: "Running and monitoring",
    tools: [
      {
        name: "Vercel Analytics",
        category: "Analytics",
        why: "Basic web analytics included with Vercel hosting. Good enough for early stage.",
        link: "https://vercel.com/analytics",
      },
      {
        name: "Sentry",
        category: "Error Tracking",
        why: "Add before production launch with real users. Skip during validation.",
        link: "https://sentry.io",
        status: "add-later",
      },
      {
        name: "Stripe",
        category: "Payments",
        why: "Standard for online payments. Checkout handles most use cases.",
        link: "https://stripe.com",
        status: "when-needed",
      },
    ],
  },
};

const PRINCIPLES = [
  {
    title: "Optimize for AI-assisted development",
    description:
      "Choose tools that work well with AI coding assistants. Utility classes > separate CSS files. Convention over configuration. Strong TypeScript types.",
  },
  {
    title: "Minimize moving parts",
    description:
      "Every tool is a thing that can break. Start with the smallest stack that works. Add complexity only when the pain of not having it exceeds the pain of maintaining it.",
  },
  {
    title: "Free tiers for validation",
    description:
      "Don't pay for infrastructure until you have paying users. Most tools have generous free tiers. The goal is signal, not scale.",
  },
  {
    title: "Standard > clever",
    description:
      "Use boring technology. The goal is shipping products, not learning new frameworks. Save experiments for the product, not the infrastructure.",
  },
];

const ALTERNATIVES = [
  {
    instead: "Next.js",
    consider: "Astro (content-heavy), Remix (complex data), Svelte (smaller bundle)",
    when: "Project has specific needs that Next.js handles poorly",
  },
  {
    instead: "Supabase",
    consider: "PlanetScale (MySQL), Neon (serverless Postgres), Firebase (real-time first)",
    when: "Need specific database features or existing preference",
  },
  {
    instead: "Clerk",
    consider: "Auth.js (self-hosted), Supabase Auth (simpler), Auth0 (enterprise)",
    when: "Don't need Clerk's advanced features or want to self-host",
  },
  {
    instead: "Vercel",
    consider: "Netlify, Cloudflare Pages, Railway",
    when: "Cost concerns at scale or non-Next.js project",
  },
];

function ToolCard({ tool }) {
  const statusColors = {
    "add-later": "bg-amber-100 text-amber-700",
    "when-needed": "bg-slate-100 text-slate-600",
  };

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-100 bg-white">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <a
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-800 hover:text-indigo-600 no-underline"
          >
            {tool.name}
          </a>
          <span className="font-mono text-[9px] text-slate-400">{tool.category}</span>
          {tool.status && (
            <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${statusColors[tool.status]}`}>
              {tool.status.replace("-", " ")}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 m-0">{tool.why}</p>
      </div>
      <a
        href={tool.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-300 hover:text-slate-500"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}

export default function StackPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-600">
          Infrastructure
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 mb-4 text-gradient">
          Stack
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
          Current tooling choices and why. These are defaults—override with reason.
        </p>
      </div>

      {/* Principles */}
      <section className="mb-12">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-4">
          Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRINCIPLES.map((p, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-800 m-0 mb-2 text-sm">{p.title}</h3>
              <p className="text-xs text-slate-600 m-0">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack Sections */}
      {Object.values(STACK).map((section, i) => (
        <section key={i} className="mb-10">
          <div className="mb-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-1">
              {section.title}
            </h2>
            <p className="text-sm text-slate-500 m-0">{section.description}</p>
          </div>
          <div className="space-y-2">
            {section.tools.map((tool, j) => (
              <ToolCard key={j} tool={tool} />
            ))}
          </div>
        </section>
      ))}

      {/* Alternatives */}
      <section className="mb-12">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-4">
          Alternatives to Consider
        </h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-3 font-mono text-[10px] uppercase text-slate-500">Instead of</th>
                <th className="text-left p-3 font-mono text-[10px] uppercase text-slate-500">Consider</th>
                <th className="text-left p-3 font-mono text-[10px] uppercase text-slate-500">When</th>
              </tr>
            </thead>
            <tbody>
              {ALTERNATIVES.map((alt, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="p-3 font-medium text-slate-800">{alt.instead}</td>
                  <td className="p-3 text-slate-600">{alt.consider}</td>
                  <td className="p-3 text-slate-500 text-xs">{alt.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cost Estimate */}
      <section className="mb-12">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-4">
          Monthly Cost (Validation Phase)
        </h2>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
            <div>
              <p className="font-mono text-[10px] text-slate-400 mb-1">Hosting</p>
              <p className="text-lg font-bold text-slate-800 m-0">$0</p>
              <p className="text-[10px] text-slate-400">Vercel free tier</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-slate-400 mb-1">Database</p>
              <p className="text-lg font-bold text-slate-800 m-0">$0</p>
              <p className="text-[10px] text-slate-400">Supabase free tier</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-slate-400 mb-1">Auth</p>
              <p className="text-lg font-bold text-slate-800 m-0">$0</p>
              <p className="text-[10px] text-slate-400">Clerk free tier</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-slate-400 mb-1">AI API</p>
              <p className="text-lg font-bold text-slate-800 m-0">$20-50</p>
              <p className="text-[10px] text-slate-400">Usage-based</p>
            </div>
          </div>
          <div className="text-center pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-600 m-0">
              Total: <span className="font-bold text-slate-800">~$20-50/month</span> until you have real traffic
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-slate-200 flex justify-between items-center">
        <a href="/" className="font-mono text-[10px] text-slate-500 no-underline hover:text-slate-700">
          ← Back to Ethos
        </a>
        <a href="/patterns" className="font-mono text-[10px] text-slate-500 no-underline hover:text-slate-700">
          Patterns →
        </a>
      </footer>
    </div>
  );
}
