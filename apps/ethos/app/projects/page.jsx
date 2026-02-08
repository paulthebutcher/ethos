"use client";
import { useState } from "react";
import Link from "next/link";

// Projects with detail pages
const PROJECTS_WITH_DETAILS = [
  "guildry", "launchpad", "smart-cms", "changelog", "brief",
  "intake", "drift", "handoff",
  "terms", "forecast", "audit"
];

// Projects with public landing pages (for waitlist collection)
const PROJECTS_WITH_LANDING = [
  "smart-cms", "changelog", "brief", "intake", "drift",
  "handoff", "terms", "forecast", "audit"
];

const PROJECTS = [
  // === IN PROGRESS ===
  {
    id: "guildry",
    name: "Guildry",
    tagline: "Project intelligence for agencies",
    description: "Scope, staff, deliver, and learn from every project. A system that gets smarter with each project you close.",
    status: "in-progress",
    layer: 1,
    started: "Feb 2026",
    links: {
      site: "https://guildry.paulb.pro",
      github: "https://github.com/paulthebutcher/guildry",
    },
    thesis: "Services firms have years of project data but no way to learn from it. LLMs can now extract patterns from unstructured history and use them to improve future estimates.",
    signals: [
      "Phase 1 complete - Blueprint (scoping), Bench (talent), Retro (learnings) all working",
      "Core loop functional: Scope → Staff → Deliver → Learn",
      "Built in ~3 hours across 2 sessions - validates rapid development thesis",
    ],
    icon: "📐",
    color: "#0d9488",
  },
  {
    id: "launchpad",
    name: "Launchpad",
    tagline: "Validate ideas with landing pages",
    description: "Generate polished landing pages for each product idea. Collect waitlist signups as keep/kill signals. Ship, test, learn, repeat.",
    status: "in-progress",
    layer: 1,
    started: "Feb 2026",
    links: {
      site: "https://theaiethos.com/landing/smart-cms",
    },
    thesis: "Idea validation needs real signal from real people. Landing pages with waitlist forms measure interest before building. Fast iteration beats perfect planning.",
    signals: [
      "9 landing pages live for evaluating projects",
      "Resend integration for waitlist signups + welcome emails",
      "Template-driven: new pages in seconds from data config",
    ],
    icon: "🚀",
    color: "#3b82f6",
  },

  // === EVALUATING ===
  // Anchor tool for the incubator
  {
    id: "smart-cms",
    name: "Smart CMS",
    tagline: "AI-powered website migration and generation",
    description: "Crawl any existing site, extract semantic structure, rebuild as clean Next.js with intuitive editing. Or generate new sites from learned patterns.",
    status: "evaluating",
    layer: 1,
    started: null,
    links: {},
    thesis: "Website migration is painful and expensive. AI can understand semantic structure (not just scrape HTML) and rebuild sites that clients can actually edit.",
    signals: [
      "Anchor tool for the incubator, shared infrastructure for all future tools",
      "Real client ready for pilot (pilates studio)",
      "MCP integration hub benefits entire portfolio",
    ],
    icon: "🌐",
    color: "#059669",
  },
  // Projects with implementation plans (prioritized)
  {
    id: "changelog",
    name: "Changelog",
    tagline: "Auto-generated product changelogs",
    description: "AI generates changelogs from git commits, PRs, and tickets. Ship updates without the writing overhead.",
    status: "evaluating",
    layer: 1,
    started: null,
    links: {},
    thesis: "Product changelogs are tedious to write. Fully automatable from git - freemium for public repos, paid for private.",
    signals: [],
    icon: "📋",
    color: "#6366f1",
  },
  {
    id: "brief",
    name: "Brief",
    tagline: "Vague briefs → structured requirements",
    description: "AI asks clarifying questions and generates structured creative briefs from conversation. Reduce rework from unclear requirements.",
    status: "evaluating",
    layer: 1,
    started: null,
    links: {},
    thesis: "Creative briefs are vague and cause rework. Conversational AI can extract structured requirements through guided questions.",
    signals: [],
    icon: "🎨",
    color: "#a855f7",
  },
  {
    id: "recap",
    name: "Recap",
    tagline: "Structured meeting notes with decisions & owners",
    description: "AI generates consistent recaps with decisions, owners, and next steps. Never miss an action item.",
    status: "killed",
    layer: 1,
    started: null,
    links: {},
    thesis: "Meeting notes are inconsistent or missing. Differentiate on structure: decisions, owners, deadlines extracted automatically.",
    signals: ["Killed: Market saturated (Granola, Otter, Fireflies, Fathom) with well-funded competitors"],
    icon: "📝",
    color: "#3b82f6",
  },
  // Services-adjacent tools
  {
    id: "intake",
    name: "Intake",
    tagline: "Client intake calls → structured requirements",
    description: "AI joins client calls, extracts requirements, flags gaps, and drafts SOW starters. Turn unstructured discovery into actionable specs.",
    status: "evaluating",
    layer: 1,
    started: null,
    links: {},
    thesis: "Client intake calls are unstructured and notes get lost. Transcription APIs are mature enough to extract structured requirements automatically, saving 2+ hours per client.",
    signals: [],
    icon: "🎙️",
    color: "#8b5cf6",
  },
  {
    id: "drift",
    name: "Drift",
    tagline: "Contract vs reality monitoring",
    description: "AI compares contract terms to actual communication and deliverables. Catch scope creep before it becomes a problem.",
    status: "evaluating",
    layer: 1,
    started: null,
    links: {},
    thesis: "Contracts say one thing, reality drifts another. Document parsing + email integration can surface mismatches automatically.",
    signals: [],
    icon: "📊",
    color: "#ec4899",
  },
  {
    id: "pulse",
    name: "Pulse",
    tagline: "Auto-generated project status updates",
    description: "AI synthesizes status from Slack, email, and project tools. Generate updates without chasing people.",
    status: "killed",
    layer: 1,
    started: null,
    links: {},
    thesis: "'How's the project going?' requires chasing people. AI can synthesize status from existing communication and tools.",
    signals: ["Killed: Overlaps with standup tools (Range, Lattice, Geekbot) that already do this"],
    icon: "💓",
    color: "#f43f5e",
  },
  {
    id: "handoff",
    name: "Handoff",
    tagline: "Instant project context for new team members",
    description: "AI generates comprehensive project context docs from all existing materials. New people productive in hours, not days.",
    status: "evaluating",
    layer: 1,
    started: null,
    links: {},
    thesis: "Onboarding new team members to projects is painful. Document synthesis can generate context from scattered materials instantly.",
    signals: [],
    icon: "🤝",
    color: "#06b6d4",
  },
  {
    id: "terms",
    name: "Terms",
    tagline: "Contract review that catches risks",
    description: "AI highlights unusual terms and compares to your standard templates. Read contracts in minutes, not hours.",
    status: "evaluating",
    layer: 1,
    started: null,
    links: {},
    thesis: "Reading contracts is tedious and risks get missed. Document comparison can surface unusual terms against your templates.",
    signals: [],
    icon: "📜",
    color: "#f59e0b",
  },
  {
    id: "forecast",
    name: "Forecast",
    tagline: "AI-powered revenue forecasting",
    description: "Predict cash flow from pipeline, project status, and historical close rates. Replace spreadsheet hell.",
    status: "evaluating",
    layer: 1,
    started: null,
    links: {},
    thesis: "Revenue forecasting is spreadsheet hell. The data already exists in tools - AI can predict cash flow automatically.",
    signals: [],
    icon: "📈",
    color: "#10b981",
  },
  {
    id: "audit",
    name: "Audit",
    tagline: "SOW vs deliverables verification",
    description: "AI compares SOW line items to actual deliverables and time logs. Know if you delivered everything promised.",
    status: "evaluating",
    layer: 1,
    started: null,
    links: {},
    thesis: "'Did we deliver everything in the SOW?' requires manual checking. Cross-document matching can verify automatically.",
    signals: [],
    icon: "✅",
    color: "#14b8a6",
  },
  // Adjacent verticals
  {
    id: "docs",
    name: "Docs",
    tagline: "Keep internal docs in sync with code",
    description: "AI watches codebase changes, flags stale docs, and suggests updates. Documentation that stays current.",
    status: "killed",
    layer: 1,
    started: null,
    links: {},
    thesis: "Internal docs are outdated or missing. AI can watch for changes and flag when docs need updates.",
    signals: ["Killed: Crowded market (Mintlify, GitBook, ReadMe) with strong incumbents"],
    icon: "📚",
    color: "#0ea5e9",
  },
  {
    id: "onboard",
    name: "Onboard",
    tagline: "Personalized employee onboarding plans",
    description: "AI generates onboarding plans from role requirements and existing materials. Consistent, personalized onboarding at scale.",
    status: "killed",
    layer: 1,
    started: null,
    links: {},
    thesis: "Employee onboarding is inconsistent. AI can personalize plans based on role while ensuring nothing is missed.",
    signals: ["Killed: Built into HR platforms (BambooHR, Rippling, Workday) - hard to unbundle"],
    icon: "🚀",
    color: "#84cc16",
  },
  {
    id: "standup",
    name: "Standup",
    tagline: "Async standups without the noise",
    description: "AI synthesizes team updates, surfaces blockers, and skips the noise. Get signal without the meeting.",
    status: "killed",
    layer: 1,
    started: null,
    links: {},
    thesis: "Async standups are noisy or ignored. AI can synthesize updates and surface only what matters.",
    signals: ["Killed: Saturated market (Geekbot, Range, Standuply, Lattice) - no clear differentiation"],
    icon: "🗣️",
    color: "#eab308",
  },
];

const STATUS_LABELS = {
  "in-progress": { label: "In Progress", color: "#0d9488", bg: "bg-teal-50", border: "border-teal-200" },
  "evaluating": { label: "Evaluating", color: "#6366f1", bg: "bg-indigo-50", border: "border-indigo-200" },
  "validating": { label: "Validating", color: "#d97706", bg: "bg-amber-50", border: "border-amber-200" },
  "killed": { label: "Killed", color: "#dc2626", bg: "bg-red-50", border: "border-red-200" },
  "shipped": { label: "Shipped", color: "#059669", bg: "bg-emerald-50", border: "border-emerald-200" },
  "paused": { label: "Paused", color: "#64748b", bg: "bg-slate-50", border: "border-slate-200" },
};

function ProjectCard({ project }) {
  const status = STATUS_LABELS[project.status];
  const hasDetail = PROJECTS_WITH_DETAILS.includes(project.id);
  const hasLanding = PROJECTS_WITH_LANDING.includes(project.id);

  const CardWrapper = hasDetail ? Link : "div";
  const wrapperProps = hasDetail
    ? { href: `/projects/${project.id}`, className: "rounded-xl border-2 overflow-hidden block no-underline hover:shadow-lg transition-shadow cursor-pointer" }
    : { className: "rounded-xl border-2 overflow-hidden" };

  return (
    <CardWrapper {...wrapperProps} style={{ borderColor: `${project.color}40` }}>
      {/* Header */}
      <div className="p-5 border-b" style={{ backgroundColor: `${project.color}08`, borderColor: `${project.color}20` }}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{project.icon}</span>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 m-0">{project.name}</h2>
              <p className="text-sm text-slate-500 m-0">{project.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-[10px] px-2 py-1 rounded-full ${status.bg} ${status.border} border`}
              style={{ color: status.color }}
            >
              {status.label}
            </span>
            <span className="font-mono text-[10px] px-2 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500">
              Layer {project.layer}
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-2">
          {project.links.site && (
            <a
              href={project.links.site}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium no-underline transition-all border"
              style={{
                color: project.color,
                borderColor: `${project.color}40`,
                backgroundColor: 'white'
              }}
            >
              <span>↗</span> Site
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium no-underline transition-all border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          )}
          {hasLanding && (
            <Link
              href={`/landing/${project.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium no-underline transition-all border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            >
              <span>📄</span> Landing Page
            </Link>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 bg-white">
        <p className="text-sm text-slate-600 mb-4 m-0">{project.description}</p>

        {/* Thesis */}
        <div className="rounded-lg p-4 border border-slate-200 bg-slate-50 mb-4">
          <h4 className="font-mono text-[10px] uppercase text-slate-500 mb-2 m-0">Thesis</h4>
          <p className="text-xs text-slate-600 m-0 leading-relaxed">{project.thesis}</p>
        </div>

        {/* Signals (if any) */}
        {project.signals && project.signals.length > 0 && (
          <div className="rounded-lg p-4 border border-slate-200 bg-slate-50">
            <h4 className="font-mono text-[10px] uppercase text-slate-500 mb-2 m-0">Signals</h4>
            <ul className="text-xs text-slate-600 m-0 p-0 list-none space-y-1">
              {project.signals.map((signal, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Meta */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="font-mono text-[10px] text-slate-400">Started {project.started}</span>
          {hasDetail && (
            <span className="font-mono text-[10px] text-slate-400">View details →</span>
          )}
        </div>
      </div>
    </CardWrapper>
  );
}

const FILTER_CONFIG = [
  { key: "all", label: "All", color: "#475569" },
  { key: "in-progress", label: "In Progress", color: "#0d9488", emptyIcon: "🚀", emptyText: "No projects in progress yet" },
  { key: "evaluating", label: "Evaluating", color: "#6366f1", emptyIcon: "🔍", emptyText: "No projects being evaluated" },
  { key: "validating", label: "Validating", color: "#d97706", emptyIcon: "🧪", emptyText: "No projects in validation" },
  { key: "shipped", label: "Shipped", color: "#059669", emptyIcon: "🎉", emptyText: "No shipped projects yet — keep building!" },
  { key: "killed", label: "Killed", color: "#dc2626", emptyIcon: "💀", emptyText: "No killed projects yet — failures are learnings" },
  { key: "paused", label: "Paused", color: "#64748b", emptyIcon: "⏸️", emptyText: "No paused projects" },
];

function CompactProjectCard({ project }) {
  const hasDetail = PROJECTS_WITH_DETAILS.includes(project.id);
  const hasLanding = PROJECTS_WITH_LANDING.includes(project.id);

  const cardContent = (
    <>
      <div className="flex items-start gap-3 mb-2">
        <span className="text-2xl">{project.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-mono text-sm font-semibold text-slate-800 m-0">{project.name}</h3>
          <p className="text-xs text-slate-500 m-0 truncate">{project.tagline}</p>
        </div>
        {hasDetail && (
          <span className="text-slate-400 text-xs">→</span>
        )}
      </div>
      <p className="text-xs text-slate-600 mb-3 m-0 line-clamp-2">{project.thesis}</p>
      <div className="flex items-center flex-wrap gap-2">
        {hasDetail && (
          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-600">
            View Plan
          </span>
        )}
        {hasLanding && (
          <Link
            href={`/landing/${project.id}`}
            onClick={(e) => e.stopPropagation()}
            className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-600 no-underline hover:bg-sky-100"
          >
            Landing →
          </Link>
        )}
      </div>
    </>
  );

  if (hasDetail) {
    return (
      <Link
        href={`/projects/${project.id}`}
        className="rounded-xl border border-slate-200 p-4 bg-white hover:border-slate-300 hover:shadow-sm transition-all block no-underline"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4 bg-white hover:border-slate-300 transition-colors">
      {cardContent}
    </div>
  );
}

function EmptyState({ icon, text, color }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <p className="text-sm text-slate-500 m-0">{text}</p>
    </div>
  );
}

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const counts = {
    "all": PROJECTS.length,
    "in-progress": PROJECTS.filter(p => p.status === "in-progress").length,
    "evaluating": PROJECTS.filter(p => p.status === "evaluating").length,
    "validating": PROJECTS.filter(p => p.status === "validating").length,
    "shipped": PROJECTS.filter(p => p.status === "shipped").length,
    "killed": PROJECTS.filter(p => p.status === "killed").length,
    "paused": PROJECTS.filter(p => p.status === "paused").length,
  };

  const filteredProjects = activeFilter === "all"
    ? PROJECTS
    : PROJECTS.filter(p => p.status === activeFilter);

  const activeFilterConfig = FILTER_CONFIG.find(f => f.key === activeFilter);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-600">
          Portfolio
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 mb-4 text-gradient">
          Projects
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
          Active experiments from the incubator. Each project tests a thesis about
          AI-powered tools that solve real process problems.
        </p>
      </div>

      {/* Clickable Filter Stats */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-12">
        {FILTER_CONFIG.map((filter) => {
          const isActive = activeFilter === filter.key;
          const count = counts[filter.key];
          return (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`rounded-lg p-3 border text-center transition-all cursor-pointer ${
                isActive
                  ? "border-slate-400 bg-white shadow-sm ring-2 ring-offset-1"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
              }`}
              style={{
                ringColor: isActive ? filter.color : undefined,
              }}
            >
              <div
                className="text-xl font-bold transition-colors"
                style={{ color: isActive ? filter.color : count > 0 ? filter.color : "#cbd5e1" }}
              >
                {count}
              </div>
              <div className={`font-mono text-[9px] uppercase transition-colors ${
                isActive ? "text-slate-700" : "text-slate-500"
              }`}>
                {filter.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filtered Results */}
      {filteredProjects.length > 0 ? (
        <section className="mb-12">
          {activeFilter !== "all" && (
            <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-6">
              {activeFilterConfig?.label} ({filteredProjects.length})
            </h2>
          )}

          {/* Use compact grid for evaluating, full cards for others */}
          {activeFilter === "evaluating" || (activeFilter === "all" && filteredProjects.length > 3) ? (
            <div className="space-y-8">
              {/* In Progress - full cards */}
              {(activeFilter === "all" ? PROJECTS.filter(p => p.status === "in-progress") : []).length > 0 && activeFilter === "all" && (
                <div>
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-4">
                    In Progress
                  </h2>
                  <div className="space-y-4">
                    {PROJECTS.filter(p => p.status === "in-progress").map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              )}

              {/* Evaluating - compact grid */}
              {(activeFilter === "all" || activeFilter === "evaluating") && (
                <>
                  {activeFilter === "all" && PROJECTS.filter(p => p.status === "evaluating").length > 0 && (
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-4">
                      Evaluating ({PROJECTS.filter(p => p.status === "evaluating").length})
                    </h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(activeFilter === "evaluating" ? filteredProjects : PROJECTS.filter(p => p.status === "evaluating")).map((project) => (
                      <CompactProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </>
              )}

              {/* Other statuses - full cards */}
              {activeFilter === "all" && ["validating", "shipped", "killed", "paused"].map(status => {
                const projects = PROJECTS.filter(p => p.status === status);
                if (projects.length === 0) return null;
                const config = FILTER_CONFIG.find(f => f.key === status);
                return (
                  <div key={status}>
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-4">
                      {config?.label}
                    </h2>
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <EmptyState
          icon={activeFilterConfig?.emptyIcon || "📭"}
          text={activeFilterConfig?.emptyText || "No projects found"}
          color={activeFilterConfig?.color}
        />
      )}

      {/* Global empty state */}
      {PROJECTS.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <div className="text-4xl mb-4">🏭</div>
          <h3 className="font-mono text-sm font-semibold text-slate-600 mb-2">No projects yet</h3>
          <p className="text-xs text-slate-500">Projects will appear here as they're started.</p>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-slate-200 flex justify-between items-center">
        <a href="/" className="font-mono text-[10px] text-slate-500 no-underline hover:text-slate-700">
          ← Back to Ethos
        </a>
        <span className="font-mono text-[10px] text-slate-500">
          {PROJECTS.length} project{PROJECTS.length !== 1 ? 's' : ''} total
        </span>
      </footer>
    </div>
  );
}
