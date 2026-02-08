"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Landing page data for each project
const LANDING_DATA = {
  "smart-cms": {
    emoji: "🌐",
    name: "Smart CMS",
    tagline: "Migrate sites in minutes, not months",
    headline: "Your old website content, perfectly restructured for any platform",
    subheadline: "Smart CMS uses AI to analyze your existing site, extract content intelligently, and migrate it to your new CMS with proper structure intact.",
    problem: {
      title: "Site migrations are painful",
      points: [
        "Manual copy-paste takes weeks of tedious work",
        "Content structure gets lost in translation",
        "Media files end up scattered and broken",
        "SEO metadata disappears completely",
      ],
    },
    solution: {
      title: "AI-powered content extraction",
      description: "Smart CMS crawls your existing site, understands content relationships, and exports everything in clean, structured formats ready for import.",
    },
    features: [
      { icon: "🔍", title: "Intelligent Crawling", desc: "Automatically discovers all pages, posts, and media" },
      { icon: "🧠", title: "Content Understanding", desc: "AI identifies headers, body, metadata, and relationships" },
      { icon: "📦", title: "Clean Export", desc: "Outputs to JSON, Markdown, or direct CMS import" },
      { icon: "🔗", title: "Link Preservation", desc: "Maintains internal links and redirects" },
    ],
    preview: {
      type: "browser",
      title: "smartcms.app",
      screens: ["Paste your site URL", "AI analyzes structure", "Export to any CMS"],
    },
    faq: [
      { q: "What sites can it crawl?", a: "Any publicly accessible website. WordPress, Squarespace, Wix, custom builds - if we can see it, we can extract it." },
      { q: "What formats can it export?", a: "JSON, Markdown, and direct imports for popular CMS platforms like Contentful, Sanity, and Strapi." },
      { q: "How long does migration take?", a: "Most sites complete in under 10 minutes. Large sites with thousands of pages may take up to an hour." },
      { q: "Is there a free tier?", a: "Yes! Migrate up to 50 pages free. Paid plans start at $29 for unlimited pages." },
    ],
    cta: "Get early access",
    color: "sky",
  },
  changelog: {
    emoji: "📋",
    name: "Changelog",
    tagline: "Ship updates, skip the writing",
    headline: "Generate polished changelogs from your Git commits",
    subheadline: "Connect your repo and get beautiful, user-friendly release notes automatically. No more staring at commit logs trying to summarize what changed.",
    problem: {
      title: "Writing changelogs is a chore",
      points: [
        "Commits are cryptic and technical",
        "Summarizing changes takes forever",
        "Easy to miss important updates",
        "Formatting is inconsistent",
      ],
    },
    solution: {
      title: "From commits to content",
      description: "Changelog reads your Git history, understands what changed and why, then writes human-readable release notes your users will actually understand.",
    },
    features: [
      { icon: "🔗", title: "Git Integration", desc: "Connects to GitHub, GitLab, or Bitbucket" },
      { icon: "✍️", title: "Smart Summaries", desc: "Turns technical commits into plain English" },
      { icon: "🏷️", title: "Auto Categorization", desc: "Groups by features, fixes, and improvements" },
      { icon: "📤", title: "Publish Anywhere", desc: "Export to Notion, Markdown, or your docs" },
    ],
    preview: {
      type: "terminal",
      title: "changelog generate",
      screens: ["Analyzing 47 commits...", "Categorizing changes...", "✓ Changelog ready"],
    },
    faq: [
      { q: "Which Git providers are supported?", a: "GitHub, GitLab, and Bitbucket. Self-hosted instances coming soon." },
      { q: "Can I customize the output format?", a: "Yes! Templates let you match your existing changelog style, or use our beautiful defaults." },
      { q: "Does it work with monorepos?", a: "Absolutely. Filter by path to generate changelogs for specific packages." },
      { q: "Is there a free tier?", a: "Free for public repos, always. Private repos start at $9/month." },
    ],
    cta: "Join the waitlist",
    color: "indigo",
  },
  brief: {
    emoji: "🎨",
    name: "Brief",
    tagline: "Better briefs, better work",
    headline: "Turn vague requests into actionable creative briefs",
    subheadline: "Brief asks the right questions and structures the answers into comprehensive creative briefs that actually guide the work.",
    problem: {
      title: "Briefs are always incomplete",
      points: [
        "Stakeholders don't know what info you need",
        "Back-and-forth takes days",
        "Important details slip through cracks",
        "Every project starts with confusion",
      ],
    },
    solution: {
      title: "Guided brief creation",
      description: "Brief conducts intelligent intake interviews, asks follow-up questions, and assembles everything into structured briefs your team can actually use.",
    },
    features: [
      { icon: "💬", title: "Smart Interviews", desc: "AI-guided questions that adapt to responses" },
      { icon: "📝", title: "Structured Output", desc: "Consistent brief format every time" },
      { icon: "🎯", title: "Gap Detection", desc: "Identifies missing info before work starts" },
      { icon: "📎", title: "Asset Collection", desc: "Gathers reference files and examples" },
    ],
    preview: {
      type: "chat",
      title: "Brief Assistant",
      screens: ["What's the project goal?", "Who's the target audience?", "Brief ready for review ✓"],
    },
    faq: [
      { q: "What types of briefs can it create?", a: "Marketing campaigns, design projects, content pieces, product features - any creative work that needs requirements." },
      { q: "Can I customize the questions?", a: "Yes! Start with our templates or build your own question flows for specific project types." },
      { q: "How do stakeholders submit info?", a: "Share a link. They answer questions in a conversational interface - no login required." },
      { q: "What format is the output?", a: "PDF, Notion, Google Docs, or Markdown. Your choice." },
    ],
    cta: "Get early access",
    color: "rose",
  },
  intake: {
    emoji: "🎙️",
    name: "Intake",
    tagline: "Discovery calls that capture everything",
    headline: "Transform client conversations into structured project specs",
    subheadline: "Intake joins your discovery calls, captures the conversation, and extracts requirements, constraints, and deliverables into organized documentation.",
    problem: {
      title: "Discovery calls are messy",
      points: [
        "Note-taking distracts from listening",
        "Key requirements get forgotten",
        "Follow-up questions slip your mind",
        "Translating notes to specs takes hours",
      ],
    },
    solution: {
      title: "AI-powered discovery",
      description: "Intake captures your client conversations, identifies requirements and constraints, and generates structured project specifications automatically.",
    },
    features: [
      { icon: "🎤", title: "Meeting Capture", desc: "Records and transcribes discovery calls" },
      { icon: "📊", title: "Requirement Extraction", desc: "Pulls out goals, constraints, deliverables" },
      { icon: "❓", title: "Gap Analysis", desc: "Identifies topics you didn't cover" },
      { icon: "📄", title: "Spec Generation", desc: "Creates project specs from conversations" },
    ],
    preview: {
      type: "document",
      title: "Project Spec",
      screens: ["Goals extracted", "Requirements listed", "Gaps identified"],
    },
    faq: [
      { q: "How does it join calls?", a: "Integrates with Zoom, Google Meet, and Teams. Or upload recordings after." },
      { q: "Is it GDPR compliant?", a: "Yes. Transcripts are encrypted and you control retention. Clients can request deletion." },
      { q: "What languages are supported?", a: "English, Spanish, French, German, and Portuguese. More coming." },
      { q: "Can it suggest follow-up questions?", a: "Yes! Real-time suggestions during calls, or a list of gaps to address later." },
    ],
    cta: "Join the waitlist",
    color: "amber",
  },
  drift: {
    emoji: "📊",
    name: "Drift",
    tagline: "Catch scope creep before it catches you",
    headline: "Track every change from original scope to final delivery",
    subheadline: "Drift monitors your project communications and flags when requests drift from the original agreement, so you can address it early.",
    problem: {
      title: "Scope creep kills projects",
      points: [
        "Small asks add up invisibly",
        "Hard to remember what was agreed",
        "Awkward to push back on clients",
        "Profitability erodes silently",
      ],
    },
    solution: {
      title: "Automatic drift detection",
      description: "Drift compares incoming requests against original scope documents and alerts you when things start to wander, with data to back up the conversation.",
    },
    features: [
      { icon: "📋", title: "Scope Baseline", desc: "Upload SOW, contracts, or meeting notes" },
      { icon: "👀", title: "Request Monitoring", desc: "Watches emails, Slack, and task tools" },
      { icon: "⚠️", title: "Drift Alerts", desc: "Flags requests outside original scope" },
      { icon: "💰", title: "Impact Tracking", desc: "Shows cumulative time and cost drift" },
    ],
    preview: {
      type: "dashboard",
      title: "Drift Monitor",
      screens: ["Scope: 94% on track", "2 items flagged", "$4,200 at risk"],
    },
    faq: [
      { q: "What counts as 'drift'?", a: "Any request that wasn't in the original scope - new features, changed requirements, additional deliverables." },
      { q: "How does it monitor communications?", a: "Connects to email, Slack, and project tools. Only analyzes project-related messages." },
      { q: "Can it help with change orders?", a: "Yes! Generate change order documentation with scope delta and cost estimates." },
      { q: "What if some drift is acceptable?", a: "Mark items as approved. Drift tracks the decision and updates the baseline." },
    ],
    cta: "Get early access",
    color: "orange",
  },
  handoff: {
    emoji: "🤝",
    name: "Handoff",
    tagline: "Smooth transitions, happy clients",
    headline: "Create perfect project handoff packages automatically",
    subheadline: "Handoff assembles everything your client needs: credentials, documentation, training materials, and next steps in one organized package.",
    problem: {
      title: "Handoffs are always chaotic",
      points: [
        "Scrambling to gather credentials",
        "Documentation is scattered everywhere",
        "Clients don't know how to use what you built",
        "Support requests flood in after launch",
      ],
    },
    solution: {
      title: "Automated handoff packages",
      description: "Handoff pulls together project artifacts, generates documentation, and creates client-ready packages that reduce post-launch support.",
    },
    features: [
      { icon: "🔐", title: "Credential Vault", desc: "Secure collection of all access info" },
      { icon: "📚", title: "Auto Documentation", desc: "Generates guides from project files" },
      { icon: "🎓", title: "Training Materials", desc: "Creates walkthroughs and tutorials" },
      { icon: "✅", title: "Launch Checklist", desc: "Ensures nothing gets missed" },
    ],
    preview: {
      type: "package",
      title: "Client Package",
      screens: ["12 credentials secured", "Documentation ready", "Training video generated"],
    },
    faq: [
      { q: "What's included in a handoff package?", a: "Credentials, documentation, training materials, support contacts, and a customizable checklist." },
      { q: "How are credentials secured?", a: "Encrypted vault with client-specific access links that expire. No passwords in email." },
      { q: "Can it generate training videos?", a: "Yes! Auto-generated walkthroughs from screen recordings with AI narration." },
      { q: "Does it integrate with project tools?", a: "Pulls from Notion, Figma, GitHub, and more. One click to assemble everything." },
    ],
    cta: "Join the waitlist",
    color: "emerald",
  },
  terms: {
    emoji: "📜",
    name: "Terms",
    tagline: "Contracts in plain English",
    headline: "Generate clear, fair contracts from simple conversations",
    subheadline: "Terms asks about your project, explains legal concepts in plain language, and generates contracts that protect both parties without the legalese.",
    problem: {
      title: "Contracts are intimidating",
      points: [
        "Legal jargon is impossible to parse",
        "Templates don't fit your situation",
        "Lawyers are expensive for small projects",
        "DIY contracts miss important clauses",
      ],
    },
    solution: {
      title: "Conversational contract creation",
      description: "Terms guides you through what matters, explains the tradeoffs, and generates professional contracts tailored to your specific project.",
    },
    features: [
      { icon: "💬", title: "Plain Language", desc: "Explains clauses in terms you understand" },
      { icon: "⚖️", title: "Fair Balance", desc: "Protects both you and your client" },
      { icon: "🎯", title: "Project Specific", desc: "Adapts to your actual scope and terms" },
      { icon: "📝", title: "Easy Edits", desc: "Modify sections with natural language" },
    ],
    preview: {
      type: "document",
      title: "Service Agreement",
      screens: ["Scope defined", "Payment terms set", "Ready to sign"],
    },
    faq: [
      { q: "Is this legal advice?", a: "No. Terms generates contracts based on best practices, but we recommend lawyer review for high-stakes agreements." },
      { q: "What contract types are supported?", a: "Service agreements, NDAs, SOWs, freelance contracts, and partnership agreements." },
      { q: "Can I use my own templates?", a: "Yes! Upload your templates and Terms will help customize them for each project." },
      { q: "How do clients sign?", a: "Built-in e-signature or export to DocuSign, HelloSign, or PDF." },
    ],
    cta: "Get early access",
    color: "violet",
  },
  forecast: {
    emoji: "📈",
    name: "Forecast",
    tagline: "Predict project outcomes with confidence",
    headline: "Know which projects will succeed before you start",
    subheadline: "Forecast analyzes your historical project data to predict timelines, profitability, and risk factors for new opportunities.",
    problem: {
      title: "Estimation is guesswork",
      points: [
        "Every project feels unique",
        "Historical data sits unused",
        "Gut feelings aren't reliable",
        "Bad estimates hurt profitability",
      ],
    },
    solution: {
      title: "Data-driven predictions",
      description: "Forecast learns from your past projects to predict outcomes for new ones, giving you confidence before you commit.",
    },
    features: [
      { icon: "📊", title: "Pattern Learning", desc: "Analyzes your historical project data" },
      { icon: "⏱️", title: "Timeline Prediction", desc: "Estimates realistic completion dates" },
      { icon: "💵", title: "Profitability Score", desc: "Predicts margin based on similar projects" },
      { icon: "🚨", title: "Risk Flagging", desc: "Identifies potential problem patterns" },
    ],
    preview: {
      type: "dashboard",
      title: "Project Forecast",
      screens: ["87% likely to profit", "Est. 6-8 weeks", "2 risk factors"],
    },
    faq: [
      { q: "How much data do I need?", a: "Start seeing patterns after 10 projects. Accuracy improves with more history." },
      { q: "What data does it analyze?", a: "Project type, team size, client industry, scope details, and actual outcomes from past work." },
      { q: "Can it predict specific risks?", a: "Yes! Flags patterns like 'similar projects ran 30% over timeline' or 'this client type has high revision rates.'" },
      { q: "Does it integrate with my tools?", a: "Pulls from time tracking, invoicing, and project management tools automatically." },
    ],
    cta: "Join the waitlist",
    color: "cyan",
  },
  audit: {
    emoji: "🔍",
    name: "Audit",
    tagline: "Learn from every project",
    headline: "Automatic retrospectives that actually improve your process",
    subheadline: "Audit reviews your completed projects, identifies what worked and what didn't, and suggests concrete process improvements.",
    problem: {
      title: "Retros don't happen",
      points: [
        "Team moves on to next project immediately",
        "Same mistakes keep repeating",
        "No time to analyze what worked",
        "Learnings don't translate to changes",
      ],
    },
    solution: {
      title: "Automated project analysis",
      description: "Audit examines your project history, communication patterns, and outcomes to surface insights and recommend improvements you can actually implement.",
    },
    features: [
      { icon: "🔬", title: "Deep Analysis", desc: "Reviews timelines, comms, and outcomes" },
      { icon: "💡", title: "Pattern Detection", desc: "Finds recurring issues across projects" },
      { icon: "📋", title: "Actionable Insights", desc: "Specific recommendations, not vague advice" },
      { icon: "📈", title: "Progress Tracking", desc: "Measures improvement over time" },
    ],
    preview: {
      type: "report",
      title: "Project Audit",
      screens: ["3 patterns identified", "5 recommendations", "Est. 12hrs saved/project"],
    },
    faq: [
      { q: "How does it access project data?", a: "Connects to your project management, communication, and time tracking tools." },
      { q: "What kind of insights does it surface?", a: "Timeline accuracy, communication patterns, scope changes, team utilization, and client satisfaction signals." },
      { q: "Can I run audits on old projects?", a: "Yes! Analyze your entire project history to find patterns you never noticed." },
      { q: "How are recommendations generated?", a: "AI compares your patterns against best practices and your own successful projects." },
    ],
    cta: "Get early access",
    color: "teal",
  },
};

const COLOR_SCHEMES = {
  sky: {
    gradient: "from-sky-400 to-blue-500",
    gradientLight: "from-sky-400/20 to-blue-500/20",
    light: "bg-sky-50",
    lighter: "bg-sky-50/50",
    border: "border-sky-200",
    text: "text-sky-600",
    textDark: "text-sky-700",
    button: "bg-sky-500 hover:bg-sky-600",
    ring: "ring-sky-500/20",
    glow: "sky",
  },
  indigo: {
    gradient: "from-indigo-400 to-purple-500",
    gradientLight: "from-indigo-400/20 to-purple-500/20",
    light: "bg-indigo-50",
    lighter: "bg-indigo-50/50",
    border: "border-indigo-200",
    text: "text-indigo-600",
    textDark: "text-indigo-700",
    button: "bg-indigo-500 hover:bg-indigo-600",
    ring: "ring-indigo-500/20",
    glow: "indigo",
  },
  rose: {
    gradient: "from-rose-400 to-pink-500",
    gradientLight: "from-rose-400/20 to-pink-500/20",
    light: "bg-rose-50",
    lighter: "bg-rose-50/50",
    border: "border-rose-200",
    text: "text-rose-600",
    textDark: "text-rose-700",
    button: "bg-rose-500 hover:bg-rose-600",
    ring: "ring-rose-500/20",
    glow: "rose",
  },
  amber: {
    gradient: "from-amber-400 to-orange-500",
    gradientLight: "from-amber-400/20 to-orange-500/20",
    light: "bg-amber-50",
    lighter: "bg-amber-50/50",
    border: "border-amber-200",
    text: "text-amber-600",
    textDark: "text-amber-700",
    button: "bg-amber-500 hover:bg-amber-600",
    ring: "ring-amber-500/20",
    glow: "amber",
  },
  orange: {
    gradient: "from-orange-400 to-red-500",
    gradientLight: "from-orange-400/20 to-red-500/20",
    light: "bg-orange-50",
    lighter: "bg-orange-50/50",
    border: "border-orange-200",
    text: "text-orange-600",
    textDark: "text-orange-700",
    button: "bg-orange-500 hover:bg-orange-600",
    ring: "ring-orange-500/20",
    glow: "orange",
  },
  emerald: {
    gradient: "from-emerald-400 to-green-500",
    gradientLight: "from-emerald-400/20 to-green-500/20",
    light: "bg-emerald-50",
    lighter: "bg-emerald-50/50",
    border: "border-emerald-200",
    text: "text-emerald-600",
    textDark: "text-emerald-700",
    button: "bg-emerald-500 hover:bg-emerald-600",
    ring: "ring-emerald-500/20",
    glow: "emerald",
  },
  violet: {
    gradient: "from-violet-400 to-purple-500",
    gradientLight: "from-violet-400/20 to-purple-500/20",
    light: "bg-violet-50",
    lighter: "bg-violet-50/50",
    border: "border-violet-200",
    text: "text-violet-600",
    textDark: "text-violet-700",
    button: "bg-violet-500 hover:bg-violet-600",
    ring: "ring-violet-500/20",
    glow: "violet",
  },
  cyan: {
    gradient: "from-cyan-400 to-teal-500",
    gradientLight: "from-cyan-400/20 to-teal-500/20",
    light: "bg-cyan-50",
    lighter: "bg-cyan-50/50",
    border: "border-cyan-200",
    text: "text-cyan-600",
    textDark: "text-cyan-700",
    button: "bg-cyan-500 hover:bg-cyan-600",
    ring: "ring-cyan-500/20",
    glow: "cyan",
  },
  teal: {
    gradient: "from-teal-400 to-emerald-500",
    gradientLight: "from-teal-400/20 to-emerald-500/20",
    light: "bg-teal-50",
    lighter: "bg-teal-50/50",
    border: "border-teal-200",
    text: "text-teal-600",
    textDark: "text-teal-700",
    button: "bg-teal-500 hover:bg-teal-600",
    ring: "ring-teal-500/20",
    glow: "teal",
  },
};

// Simulated waitlist counts (in production, fetch from API)
const WAITLIST_COUNTS = {
  "smart-cms": 47,
  changelog: 89,
  brief: 34,
  intake: 56,
  drift: 23,
  handoff: 41,
  terms: 67,
  forecast: 52,
  audit: 38,
};

function WaitlistCounter({ projectId, scheme }) {
  const [count, setCount] = useState(WAITLIST_COUNTS[projectId] || 0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Simulate occasional new signups for visual interest
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsAnimating(true);
        setCount(c => c + 1);
        setTimeout(() => setIsAnimating(false), 500);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border ${scheme.border} shadow-sm`}>
      <div className="flex -space-x-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br ${scheme.gradient} flex items-center justify-center text-[10px] text-white font-medium`}
          >
            {["P", "S", "M"][i]}
          </div>
        ))}
      </div>
      <span className="text-sm text-slate-600">
        <span className={`font-semibold ${scheme.textDark} transition-transform ${isAnimating ? 'scale-110' : ''}`}>
          {count}
        </span>
        {" "}people on the waitlist
      </span>
    </div>
  );
}

function WaitlistForm({ projectName, projectId, color, cta }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const scheme = COLOR_SCHEMES[color];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, project: projectName }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        // Update count
        WAITLIST_COUNTS[projectId] = (WAITLIST_COUNTS[projectId] || 0) + 1;
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`p-6 rounded-2xl bg-white/80 backdrop-blur-sm ${scheme.border} border text-center shadow-lg`}>
        <div className="text-4xl mb-3">🎉</div>
        <p className="font-semibold text-slate-900 text-lg">You're on the list!</p>
        <p className="text-sm text-slate-600 mt-1">We'll reach out when {projectName} is ready.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className={`w-full px-5 py-4 rounded-xl bg-white/80 backdrop-blur-sm border ${scheme.border} focus:outline-none focus:ring-4 ${scheme.ring} text-slate-900 shadow-lg transition-all placeholder:text-slate-400`}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className={`px-8 py-4 rounded-xl font-semibold text-white ${scheme.button} transition-all disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0`}
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Joining...
            </span>
          ) : cta}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-500 text-sm mt-2">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

function ProductPreview({ preview, scheme, name }) {
  return (
    <div className="relative">
      {/* Glow effect */}
      <div className={`absolute -inset-4 bg-gradient-to-r ${scheme.gradientLight} rounded-3xl blur-2xl`} />

      {/* Browser/App chrome */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className={`px-4 py-1 rounded-full ${scheme.light} text-xs ${scheme.text} font-medium`}>
              {preview.title}
            </div>
          </div>
          <div className="w-12" />
        </div>

        {/* Content area */}
        <div className="p-8 bg-gradient-to-br from-slate-50 to-white min-h-[200px]">
          <div className="space-y-4">
            {preview.screens.map((screen, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-4 rounded-xl ${i === preview.screens.length - 1 ? scheme.light : 'bg-white'} border ${i === preview.screens.length - 1 ? scheme.border : 'border-slate-200'} transition-all`}
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${scheme.gradient} flex items-center justify-center text-white text-sm font-bold`}>
                  {i + 1}
                </div>
                <span className={`text-sm ${i === preview.screens.length - 1 ? scheme.textDark + ' font-medium' : 'text-slate-600'}`}>
                  {screen}
                </span>
                {i === preview.screens.length - 1 && (
                  <svg className={`w-5 h-5 ${scheme.text} ml-auto`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQSection({ faq, scheme }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-3">
      {faq.map((item, i) => (
        <div
          key={i}
          className={`rounded-xl border ${openIndex === i ? scheme.border : 'border-slate-200'} bg-white overflow-hidden transition-all`}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <span className="font-medium text-slate-900">{item.q}</span>
            <svg
              className={`w-5 h-5 text-slate-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === i && (
            <div className="px-6 pb-4">
              <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function LandingPage({ params }) {
  const data = LANDING_DATA[params.id];

  if (!data) {
    notFound();
  }

  const scheme = COLOR_SCHEMES[data.color];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br ${scheme.gradientLight} rounded-full blur-3xl animate-pulse`} style={{ animationDuration: '8s' }} />
        <div className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br ${scheme.gradientLight} rounded-full blur-3xl animate-pulse`} style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-slate-900 no-underline tracking-tight text-sm sm:text-base">
            the ai ethos
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/projects/${params.id}`}
              className="text-xs sm:text-sm text-slate-500 hover:text-slate-900 no-underline transition-colors hidden sm:block"
            >
              View Full Plan
            </Link>
            <Link
              href="/projects"
              className="text-xs sm:text-sm text-slate-500 hover:text-slate-900 no-underline transition-colors"
            >
              All Projects
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Badge + Counter */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${scheme.light} ${scheme.border} border`}>
              <span className="text-xl">{data.emoji}</span>
              <span className={`text-sm font-medium ${scheme.text}`}>{data.tagline}</span>
            </div>
            <WaitlistCounter projectId={params.id} scheme={scheme} />
          </div>

          {/* Headline */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              {data.headline}
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
              {data.subheadline}
            </p>
          </div>

          {/* Waitlist Form */}
          <div className="max-w-xl mx-auto mb-8">
            <WaitlistForm projectName={data.name} projectId={params.id} color={data.color} cta={data.cta} />
          </div>

          {/* Trust signal */}
          <p className="text-center text-sm text-slate-500">
            Join the waitlist for early access. No spam, unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Product Preview */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              See it in action
            </h2>
            <p className="text-slate-600">
              A glimpse of what's coming
            </p>
          </div>
          <ProductPreview preview={data.preview} scheme={scheme} name={data.name} />
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              {data.problem.title}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {data.problem.points.map((point, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-slate-700">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative">
            <div className={`absolute -inset-4 bg-gradient-to-r ${scheme.gradientLight} rounded-3xl blur-2xl`} />
            <div className={`relative p-8 sm:p-12 rounded-2xl bg-white border ${scheme.border} shadow-xl`}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${scheme.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                  {data.emoji}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    {data.solution.title}
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {data.solution.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {data.features.map((feature, i) => (
              <div
                key={i}
                className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${scheme.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Questions? Answers.
            </h2>
          </div>
          <FAQSection faq={data.faq} scheme={scheme} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative">
            <div className={`absolute -inset-4 bg-gradient-to-r ${scheme.gradientLight} rounded-3xl blur-2xl`} />
            <div className={`relative p-8 sm:p-12 rounded-2xl bg-white border ${scheme.border} shadow-xl text-center`}>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Ready to try {data.name}?
              </h2>
              <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                Join the waitlist to get early access when we launch. Be the first to know.
              </p>
              <div className="max-w-md mx-auto">
                <WaitlistForm projectName={data.name} projectId={params.id} color={data.color} cta={data.cta} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-100 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link href="/" className="font-semibold text-slate-900 no-underline">
                the ai ethos
              </Link>
              <p className="text-sm text-slate-500">Solo AI Product Incubator</p>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <Link href={`/projects/${params.id}`} className="text-sm text-slate-500 hover:text-slate-900 no-underline transition-colors">
                View Full Plan →
              </Link>
              <Link href="/projects" className="text-sm text-slate-500 hover:text-slate-900 no-underline transition-colors">
                All Projects
              </Link>
              <Link href="/methodology" className="text-sm text-slate-500 hover:text-slate-900 no-underline transition-colors">
                Methodology
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
