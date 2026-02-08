"use client";

// Evaluation criteria - what makes an idea worth pursuing
const EVALUATION = {
  criteria: [
    {
      title: "Clear, specific pain point",
      description: "Not 'would be nice' but 'this is broken and I need it fixed'",
      test: "Can you name 3 people who have this problem and would pay today?",
    },
    {
      title: "AI changes what's possible",
      description: "Not just automation of existing process, but genuinely new capability",
      test: "Could this exist without recent AI advances? If yes, why hasn't it?",
    },
    {
      title: "Path to revenue without sales team",
      description: "Self-serve, product-led, or clear inbound channel",
      test: "How does someone find this, try it, and pay—all without talking to anyone?",
    },
    {
      title: "Solo-buildable and testable",
      description: "One person can ship v1 and get signal within 2-4 weeks",
      test: "What's the smallest thing you can ship that proves/disproves the thesis?",
    },
  ],
  redFlags: [
    "'Lots of people might want this' (too vague to validate)",
    "Requires marketplace dynamics or network effects to be valuable",
    "Needs enterprise sales motion to close deals",
    "Can't articulate who pays and why in one sentence",
    "Requires significant upfront investment before any signal",
    "Success depends on partnerships or platform access",
  ],
};

// Project phases and what each means
const PHASES = [
  {
    name: "Evaluating",
    color: "#8b5cf6",
    duration: "1-3 days",
    goal: "Decide whether to start",
    activities: [
      "Research existing solutions",
      "Identify potential early users",
      "Sketch minimum viable scope",
      "Estimate build effort",
    ],
    exitCriteria: "Clear thesis + scope doc, or explicit pass",
  },
  {
    name: "In Progress",
    color: "#0d9488",
    duration: "1-2 weeks",
    goal: "Ship something testable",
    activities: [
      "Build core functionality",
      "Deploy to production URL",
      "Instrument basic analytics",
      "Prepare distribution assets",
    ],
    exitCriteria: "Live product real users can try",
  },
  {
    name: "Validating",
    color: "#f59e0b",
    duration: "2-4 weeks",
    goal: "Get signal on thesis",
    activities: [
      "Drive traffic through chosen channels",
      "Monitor usage and engagement",
      "Collect qualitative feedback",
      "Test pricing if applicable",
    ],
    exitCriteria: "Clear continue or kill decision with reasoning",
  },
  {
    name: "Shipped",
    color: "#22c55e",
    duration: "Ongoing",
    goal: "Sustain and grow",
    activities: [
      "Iterate based on feedback",
      "Expand distribution",
      "Add features that retain users",
      "Consider next growth lever",
    ],
    exitCriteria: "Revenue or strong growth trajectory",
  },
];

// Kill/continue framework
const KILL_CONTINUE = {
  continue: [
    {
      signal: "Someone paid",
      strength: "Strongest",
      note: "Even $1 from a stranger is signal. Friends and family don't count.",
    },
    {
      signal: "Clear path to payment",
      strength: "Strong",
      note: "Users engaged + specific blockers identified + path to remove blockers",
    },
    {
      signal: "Learning value",
      strength: "Moderate",
      note: "Even if product fails, skills/patterns transfer to next attempt",
    },
  ],
  kill: [
    {
      signal: "No usage despite distribution",
      note: "If you can't get anyone to try it, the problem might not be acute enough",
    },
    {
      signal: "Usage but no payment intent",
      note: "Vitamin not painkiller. Nice to have but not worth paying for.",
    },
    {
      signal: "Core assumption invalidated",
      note: "The technical approach doesn't work, or the market doesn't exist",
    },
    {
      signal: "Better opportunity identified",
      note: "Opportunity cost is real. Pivot to higher-signal idea.",
    },
  ],
  principle: "Never kill just because it's hard. Kill because the thesis is wrong.",
};

// Distribution channels and testing approach
const DISTRIBUTION = {
  philosophy: "Test channels in parallel with small bets. Double down on what works, drop what doesn't.",
  channels: [
    {
      name: "Product Hunt",
      type: "Launch",
      effort: "Medium",
      notes: "Good for initial burst. One-shot—make it count.",
    },
    {
      name: "Indie Hackers",
      type: "Community",
      effort: "Low",
      notes: "Build in public. Good for feedback, moderate for traffic.",
    },
    {
      name: "Twitter/X",
      type: "Social",
      effort: "High (ongoing)",
      notes: "Requires consistent presence. Better if you already have audience.",
    },
    {
      name: "Cold outreach",
      type: "Direct",
      effort: "High",
      notes: "Low conversion but high signal. Good for B2B validation.",
    },
    {
      name: "Content/SEO",
      type: "Inbound",
      effort: "High (delayed)",
      notes: "Compounds over time. Not for quick validation.",
    },
    {
      name: "Marketplaces",
      type: "Platform",
      effort: "Medium",
      notes: "App stores, plugin directories. Built-in audience if you fit.",
    },
  ],
};

// Time and cost benchmarks
const BENCHMARKS = {
  phases: [
    { phase: "Evaluation", time: "1-3 days", cost: "$0" },
    { phase: "Build (v1)", time: "1-2 weeks", cost: "$50-200 (hosting, APIs)" },
    { phase: "Validation", time: "2-4 weeks", cost: "$100-500 (ads, tools)" },
  ],
  principles: [
    "Speed matters more than perfection. Ship fast, iterate faster.",
    "AI development is 10-20x faster than traditional estimates",
    "Most of the 'work' is deciding what to build, not building it",
    "If you're spending more than $500 before first revenue, question the thesis",
  ],
};

function SectionHeader({ label, title, description }) {
  return (
    <div className="mb-8">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-600">{label}</span>
      <h2 className="text-2xl font-bold tracking-tight mt-2 mb-3 text-slate-800">{title}</h2>
      {description && <p className="text-slate-600 max-w-2xl">{description}</p>}
    </div>
  );
}

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-16">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-600">
          Frameworks
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 mb-4 text-gradient">
          Methodology
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
          Decision frameworks for evaluating ideas, building products, and knowing when to kill or continue.
          These aren't rules. They're defaults that can be overridden with good reason.
        </p>
      </div>

      {/* Evaluation Section */}
      <section className="mb-16">
        <SectionHeader
          label="Starting"
          title="Idea Evaluation"
          description="What makes an idea worth pursuing? Run through these criteria before committing time."
        />

        <div className="space-y-4 mb-8">
          {EVALUATION.criteria.map((c, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <span className="font-mono text-lg text-teal-500 mt-0.5">✓</span>
                <div>
                  <h4 className="font-semibold text-slate-800 m-0 mb-1">{c.title}</h4>
                  <p className="text-sm text-slate-600 m-0 mb-2">{c.description}</p>
                  <p className="text-xs text-slate-500 m-0 italic">Test: {c.test}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h4 className="font-mono text-[11px] uppercase text-red-700 mb-3 m-0">Red Flags</h4>
          <ul className="text-sm text-slate-700 m-0 p-0 list-none space-y-2">
            {EVALUATION.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✗</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Phases Section */}
      <section className="mb-16">
        <SectionHeader
          label="Building"
          title="Project Phases"
          description="Every project moves through these phases. Each has a clear goal and exit criteria."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PHASES.map((phase, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-5"
              style={{ borderLeftColor: phase.color, borderLeftWidth: 4 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-800 m-0">{phase.name}</h4>
                <span className="font-mono text-[10px] text-slate-400">{phase.duration}</span>
              </div>
              <p className="text-sm text-slate-600 mb-3 m-0">
                <strong>Goal:</strong> {phase.goal}
              </p>
              <ul className="text-xs text-slate-500 m-0 p-0 list-none space-y-1 mb-3">
                {phase.activities.map((a, j) => (
                  <li key={j}>• {a}</li>
                ))}
              </ul>
              <p className="text-xs text-slate-500 m-0 pt-2 border-t border-slate-100">
                <span className="font-medium">Exit:</span> {phase.exitCriteria}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Kill/Continue Section */}
      <section className="mb-16">
        <SectionHeader
          label="Deciding"
          title="Kill / Continue Framework"
          description="The hardest part isn't building. It's knowing when to stop. Use these signals."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Continue signals */}
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-5">
            <h4 className="font-mono text-[11px] uppercase text-teal-700 mb-4 m-0">Continue If</h4>
            <div className="space-y-4">
              {KILL_CONTINUE.continue.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-teal-600 font-medium text-sm">{item.signal}</span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded">
                      {item.strength}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 m-0">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Kill signals */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="font-mono text-[11px] uppercase text-slate-700 mb-4 m-0">Kill If</h4>
            <div className="space-y-4">
              {KILL_CONTINUE.kill.map((item, i) => (
                <div key={i}>
                  <span className="text-slate-700 font-medium text-sm block mb-1">{item.signal}</span>
                  <p className="text-xs text-slate-500 m-0">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm text-amber-800 m-0 font-medium text-center">
            "{KILL_CONTINUE.principle}"
          </p>
        </div>
      </section>

      {/* Distribution Section */}
      <section className="mb-16">
        <SectionHeader
          label="Validating"
          title="Distribution Channels"
          description={DISTRIBUTION.philosophy}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 font-mono text-[10px] uppercase text-slate-500">Channel</th>
                <th className="text-left py-3 font-mono text-[10px] uppercase text-slate-500">Type</th>
                <th className="text-left py-3 font-mono text-[10px] uppercase text-slate-500">Effort</th>
                <th className="text-left py-3 font-mono text-[10px] uppercase text-slate-500">Notes</th>
              </tr>
            </thead>
            <tbody>
              {DISTRIBUTION.channels.map((ch, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-3 font-medium text-slate-800">{ch.name}</td>
                  <td className="py-3 text-slate-600">{ch.type}</td>
                  <td className="py-3">
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                        ch.effort === "Low"
                          ? "bg-green-100 text-green-700"
                          : ch.effort === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {ch.effort}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 text-xs">{ch.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Benchmarks Section */}
      <section className="mb-16">
        <SectionHeader
          label="Expectations"
          title="Time & Cost Benchmarks"
          description="Rough targets for how long things should take and cost. If you're way over, question assumptions."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {BENCHMARKS.phases.map((b, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <h4 className="font-mono text-[11px] uppercase text-slate-500 mb-2 m-0">{b.phase}</h4>
              <p className="text-2xl font-bold text-slate-800 m-0 mb-1">{b.time}</p>
              <p className="text-sm text-slate-500 m-0">{b.cost}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h4 className="font-mono text-[11px] uppercase text-slate-500 mb-3 m-0">Principles</h4>
          <ul className="text-sm text-slate-600 m-0 p-0 list-none space-y-2">
            {BENCHMARKS.principles.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">→</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-slate-200 flex justify-between items-center">
        <a href="/" className="font-mono text-[10px] text-slate-500 no-underline hover:text-slate-700">
          ← Back to Ethos
        </a>
        <a href="/projects" className="font-mono text-[10px] text-slate-500 no-underline hover:text-slate-700">
          View Projects →
        </a>
      </footer>
    </div>
  );
}
