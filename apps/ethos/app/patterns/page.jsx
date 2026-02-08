// Patterns page - reusable build patterns as they accumulate
// This page will grow as patterns emerge from projects

const SEED_PATTERNS = [
  {
    name: "Target Schema Extraction",
    category: "AI",
    status: "emerging",
    description:
      "Use Claude function calling to extract structured data from natural language. Define a target schema, let AI populate it from conversation.",
    from: "guildry",
    example: `// Define what you want to extract
const targetSchema = {
  clientName: "string",
  industry: "string",
  painPoints: "string[]",
  budget: "number | null"
};

// AI extracts from conversation
const extracted = await claude.extract(conversation, targetSchema);`,
  },
  {
    name: "Discovery-First Schema",
    category: "Architecture",
    status: "emerging",
    description:
      "Don't lock data models upfront. Start with flexible JSONB columns, let real usage reveal what structure you need. Migrate to typed columns once patterns stabilize.",
    from: "guildry",
    example: `// Start flexible
CREATE TABLE clients (
  id UUID PRIMARY KEY,
  data JSONB NOT NULL  -- Store anything
);

// Later, extract columns that matter
ALTER TABLE clients ADD COLUMN industry TEXT;
UPDATE clients SET industry = data->>'industry';`,
  },
];

const PLANNED_CATEGORIES = [
  {
    name: "AI Patterns",
    examples: ["Prompt templates", "Function calling schemas", "Context management", "Error handling"],
  },
  {
    name: "Architecture Patterns",
    examples: ["Data modeling", "Auth flows", "API design", "State management"],
  },
  {
    name: "Distribution Patterns",
    examples: ["Launch sequences", "Content templates", "Feedback collection", "Pricing experiments"],
  },
  {
    name: "Development Patterns",
    examples: ["AI collaboration", "Code review", "Testing strategies", "Documentation"],
  },
];

function PatternCard({ pattern }) {
  const statusColors = {
    emerging: "bg-amber-100 text-amber-700",
    proven: "bg-green-100 text-green-700",
    experimental: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-800 m-0">{pattern.name}</h3>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-slate-400">{pattern.category}</span>
            <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${statusColors[pattern.status]}`}>
              {pattern.status}
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-600 m-0">{pattern.description}</p>
        {pattern.from && (
          <p className="text-xs text-slate-400 mt-2 m-0">
            From: <span className="text-indigo-500">{pattern.from}</span>
          </p>
        )}
      </div>
      {pattern.example && (
        <div className="bg-slate-900 p-4 overflow-x-auto">
          <pre className="text-xs text-slate-300 m-0 font-mono whitespace-pre">{pattern.example}</pre>
        </div>
      )}
    </div>
  );
}

export default function PatternsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-600">
          Reusable Knowledge
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 mb-4 text-gradient">
          Patterns
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
          Build patterns that keep working across projects. This page grows as patterns emerge and prove themselves.
        </p>
      </div>

      {/* Status Note */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 mb-12">
        <div className="flex items-start gap-3">
          <span className="text-amber-500 text-lg">🌱</span>
          <div>
            <h3 className="font-semibold text-amber-800 m-0 mb-1">Early Days</h3>
            <p className="text-sm text-amber-700 m-0">
              This page is intentionally sparse. Patterns are added only after they've been used in 2+ projects
              and proven to work. The goal is signal, not volume.
            </p>
          </div>
        </div>
      </div>

      {/* Emerging Patterns */}
      <section className="mb-12">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-4">
          Emerging Patterns
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Patterns that have shown promise but need more validation.
        </p>
        <div className="space-y-4">
          {SEED_PATTERNS.map((pattern, i) => (
            <PatternCard key={i} pattern={pattern} />
          ))}
        </div>
      </section>

      {/* Planned Categories */}
      <section className="mb-12">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-4">
          Categories to Fill
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Areas where patterns will accumulate as projects progress.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLANNED_CATEGORIES.map((cat, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-700 m-0 mb-3 text-sm">{cat.name}</h3>
              <ul className="text-xs text-slate-500 m-0 p-0 list-none space-y-1">
                {cat.examples.map((ex, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How Patterns Graduate */}
      <section className="mb-12">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-4">
          Pattern Lifecycle
        </h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] px-2 py-1 rounded bg-purple-100 text-purple-700">
              experimental
            </span>
            <span className="text-xs text-slate-500">Used once, promising</span>
          </div>
          <span className="hidden md:block text-slate-300">→</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] px-2 py-1 rounded bg-amber-100 text-amber-700">
              emerging
            </span>
            <span className="text-xs text-slate-500">Used 2+ times, still evolving</span>
          </div>
          <span className="hidden md:block text-slate-300">→</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] px-2 py-1 rounded bg-green-100 text-green-700">
              proven
            </span>
            <span className="text-xs text-slate-500">Works reliably, stable</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-slate-200 flex justify-between items-center">
        <a href="/stack" className="font-mono text-[10px] text-slate-500 no-underline hover:text-slate-700">
          ← Stack
        </a>
        <a href="/log" className="font-mono text-[10px] text-slate-500 no-underline hover:text-slate-700">
          Log →
        </a>
      </footer>
    </div>
  );
}
