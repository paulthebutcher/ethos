"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

// Product synergies - which products work well together
const SYNERGIES = {
  guildry: [
    { id: "intake", reason: "Intake feeds structured requirements into Guildry's scoping engine" },
    { id: "forecast", reason: "Guildry's project data powers Forecast's prediction models" },
    { id: "audit", reason: "Audit insights feed back into Guildry to improve future estimates" },
  ],
  launchpad: [
    { id: "smart-cms", reason: "Landing pages can be built on the same infrastructure" },
  ],
  "smart-cms": [
    { id: "launchpad", reason: "Share hosting and deployment infrastructure" },
    { id: "changelog", reason: "Both serve developer and agency audiences" },
  ],
  intake: [
    { id: "guildry", reason: "Captured requirements flow directly into project scoping" },
    { id: "brief", reason: "Both extract structure from unstructured conversations" },
    { id: "drift", reason: "Intake captures initial scope that Drift monitors against" },
  ],
  brief: [
    { id: "intake", reason: "Both solve the 'vague requirements' problem from different angles" },
  ],
  drift: [
    { id: "intake", reason: "Uses Intake's captured scope as the baseline for drift detection" },
    { id: "terms", reason: "Terms creates contracts, Drift monitors compliance" },
  ],
  handoff: [
    { id: "audit", reason: "Both focus on project completion and knowledge transfer" },
    { id: "guildry", reason: "Handoff packages can include Guildry project summaries" },
  ],
  terms: [
    { id: "drift", reason: "Drift monitors the contracts Terms helps create" },
  ],
  forecast: [
    { id: "guildry", reason: "Learns from Guildry's historical project data" },
    { id: "audit", reason: "Audit findings improve Forecast's accuracy over time" },
  ],
  audit: [
    { id: "guildry", reason: "Audit insights improve Guildry's scoping recommendations" },
    { id: "forecast", reason: "Post-project analysis improves prediction accuracy" },
    { id: "handoff", reason: "Both close out projects and capture learnings" },
  ],
  changelog: [
    { id: "smart-cms", reason: "Both serve technical audiences with dev tools" },
  ],
};

// Quick lookup for project names and icons
const PROJECT_META = {
  guildry: { name: "Guildry", icon: "📐" },
  launchpad: { name: "Launchpad", icon: "🚀" },
  "smart-cms": { name: "Smart CMS", icon: "🌐" },
  intake: { name: "Intake", icon: "🎙️" },
  brief: { name: "Brief", icon: "🎨" },
  drift: { name: "Drift", icon: "📊" },
  handoff: { name: "Handoff", icon: "🤝" },
  terms: { name: "Terms", icon: "📜" },
  forecast: { name: "Forecast", icon: "📈" },
  audit: { name: "Audit", icon: "🔍" },
  changelog: { name: "Changelog", icon: "📋" },
};

// Project detail data with approaches and test plans
const PROJECT_DETAILS = {
  guildry: {
    id: "guildry",
    name: "Guildry",
    tagline: "Project intelligence for agencies",
    icon: "📐",
    color: "#0d9488",
    description: "Scope, staff, deliver, and learn from every project. A system that gets smarter with each project you close.",
    thesis: "Services firms have years of project data but no way to learn from it. LLMs can now extract patterns from unstructured history and use them to improve future estimates.",
    problem: `
Agency project management is broken:

Scoping is guesswork. You pull numbers from memory or copy the last similar project. When you're wrong, you eat the margin or burn the client relationship.

Staffing is reactive. You don't know who's available until they're already overbooked. Skills and preferences live in spreadsheets or people's heads.

Learnings disappear. Every retro generates insights that get filed and forgotten. The same mistakes repeat across projects, teams, even years.

The data exists. It's in old SOWs, time logs, retro notes, Slack threads. But nobody has time to mine it, so each project starts from scratch.
    `.trim(),
    approaches: [
      {
        name: "Modular Suite (Current)",
        description: "Three focused tools that work independently but share data",
        buildTime: "3-4 weeks total",
        complexity: "Medium",
        details: [
          "Blueprint: AI-assisted scoping from conversation and historical patterns",
          "Bench: Skills database with availability and preference tracking",
          "Retro: Structured post-mortems that feed back into scoping",
          "Shared data layer lets each module improve the others",
          "Can launch modules separately to test value",
        ],
        pros: [
          "Each module can stand alone if others don't work",
          "Faster time to first value",
          "Clear upgrade path as modules prove out",
          "Matches how agencies actually buy software",
        ],
        cons: [
          "Integration complexity across modules",
          "Users might not see the full vision from one piece",
          "Need to nail onboarding for each module",
        ],
      },
      {
        name: "Full Platform",
        description: "Integrated project lifecycle tool from intake to retro",
        buildTime: "6-8 weeks",
        complexity: "High",
        details: [
          "Single application covering entire project lifecycle",
          "Tighter integration between phases",
          "Unified data model from the start",
          "More coherent user experience",
        ],
        pros: [
          "Stronger product story",
          "Deeper data integration",
          "Higher switching cost once adopted",
          "Clearer competitive moat",
        ],
        cons: [
          "Much longer to first feedback",
          "Harder to pivot if assumptions wrong",
          "Bigger lift for agencies to adopt",
          "More features to maintain",
        ],
      },
      {
        name: "Retro-First",
        description: "Start with retrospectives, expand backward into planning",
        buildTime: "2 weeks",
        complexity: "Low",
        details: [
          "Focus entirely on capturing project learnings",
          "AI extracts patterns from retro data",
          "Use patterns to inform future scoping (manual at first)",
          "Add scoping and staffing as retro data accumulates",
        ],
        pros: [
          "Fastest to value",
          "Low commitment ask for agencies",
          "Data flywheel starts immediately",
          "Clear proof point for AI value",
        ],
        cons: [
          "Requires completed projects to generate data",
          "Delayed path to scoping (the bigger pain point)",
          "May feel like 'just another retro tool'",
        ],
      },
    ],
    testPlan: {
      hypothesis: "Agencies will pay $199/mo for AI-powered scoping that learns from their project history",
      validation: [
        {
          phase: "Module Launch",
          duration: "2-3 weeks",
          actions: [
            "Ship Blueprint, Bench, and Retro as working tools",
            "Onboard 3 pilot agencies for real project scoping",
            "Track: time to create scope, accuracy vs final",
            "Gather feedback on AI suggestions",
          ],
          successMetric: "Agencies complete 5+ real scopes, find AI suggestions useful",
        },
        {
          phase: "Data Flywheel",
          duration: "4-6 weeks",
          actions: [
            "Pilot agencies run 2-3 projects through full cycle",
            "Retro data starts feeding Blueprint suggestions",
            "Measure: do scopes improve with more data?",
            "Document case studies from pilot results",
          ],
          successMetric: "Visible improvement in scope accuracy over time",
        },
        {
          phase: "Pricing Validation",
          duration: "2 weeks",
          actions: [
            "Propose $199/mo to pilot agencies",
            "Gauge reaction, test price sensitivity",
            "Create public landing page and waitlist",
            "Run targeted outreach to agency networks",
          ],
          successMetric: "2/3 pilots convert to paid, 50+ waitlist signups",
        },
      ],
      killCriteria: [
        "AI suggestions aren't meaningfully better than gut feel",
        "Agencies won't enter historical data to train the model",
        "Onboarding friction is too high for busy agencies",
        "Price sensitivity below $99/mo makes unit economics impossible",
      ],
    },
  },

  launchpad: {
    id: "launchpad",
    name: "Launchpad",
    tagline: "Validate ideas with landing pages",
    icon: "🚀",
    color: "#3b82f6",
    description: "Generate polished landing pages for each product idea. Collect waitlist signups as keep/kill signals. Ship, test, learn, repeat.",
    thesis: "Idea validation needs real signal from real people. Landing pages with waitlist forms measure interest before building. Fast iteration beats perfect planning.",
    problem: `
Validating product ideas is slow and expensive:

Building MVPs takes weeks or months. By the time you have something to show, you've already committed significant resources. If the idea doesn't resonate, you've wasted time that could have validated something else.

Surveys and interviews are biased. People say they want things they'll never pay for. The gap between stated interest and actual behavior is huge.

There's no middle ground. Either you build the whole thing or you're guessing. What's missing is a cheap, fast way to measure real interest before committing.

Email signups are an honest signal. Getting someone to give you their email for a waitlist takes 30 seconds but indicates real intent. If people won't even sign up, they definitely won't pay.
    `.trim(),
    approaches: [
      {
        name: "Template System (Current)",
        description: "Data-driven landing pages with shared components and individual configs",
        buildTime: "1 day",
        complexity: "Low",
        details: [
          "Single template component renders any landing page from data",
          "Each project gets a config object: headline, features, problem, solution",
          "Resend integration sends welcome emails and tracks signups",
          "Unique color scheme per project for brand differentiation",
          "All pages share nav, footer, and waitlist form logic",
        ],
        pros: [
          "New landing pages in minutes, just add data",
          "Consistent quality across all pages",
          "Easy A/B testing by swapping configs",
          "Single codebase to maintain",
        ],
        cons: [
          "Less flexibility for unique page layouts",
          "All pages have same structure",
          "Custom sections require template changes",
        ],
      },
      {
        name: "AI Generation",
        description: "Generate landing page content from project thesis using AI",
        buildTime: "2 weeks",
        complexity: "Medium",
        details: [
          "Feed project thesis into Claude to generate headlines, features, etc.",
          "Auto-generate problem/solution sections from description",
          "Suggest color schemes based on project category",
          "Human review before publish",
        ],
        pros: [
          "Even faster page creation",
          "Consistent messaging quality",
          "Could generate variations for testing",
        ],
        cons: [
          "Adds dependency on AI quality",
          "May lose nuance from manual copywriting",
          "Still needs human review",
        ],
      },
      {
        name: "Visual Builder",
        description: "Drag-and-drop builder for custom landing pages",
        buildTime: "4 weeks",
        complexity: "High",
        details: [
          "Component library: heroes, features, testimonials, CTAs",
          "WYSIWYG editing for each page",
          "Save as config for version control",
          "More flexibility per page",
        ],
        pros: [
          "Maximum flexibility",
          "Non-technical users can edit",
          "Each page can be unique",
        ],
        cons: [
          "Much longer build time",
          "Maintenance overhead",
          "Overkill for current needs",
        ],
      },
    ],
    testPlan: {
      hypothesis: "Landing pages with waitlist signups will generate enough signal to make keep/kill decisions in 2 weeks",
      validation: [
        {
          phase: "Launch All Pages",
          duration: "1 day",
          actions: [
            "Deploy landing pages for all 9 evaluating projects",
            "Configure Resend for email collection",
            "Set up basic analytics (page views, signup rate)",
            "Share pages on relevant channels",
          ],
          successMetric: "All pages live and collecting signups",
        },
        {
          phase: "Traffic Experiment",
          duration: "2 weeks",
          actions: [
            "Drive traffic to pages via Twitter, Reddit, LinkedIn",
            "Test different messaging for same products",
            "Track: visits, signup rate, email open rate",
            "Identify top 2-3 performers",
          ],
          successMetric: "Clear signal on which ideas resonate (10+ signups vs <2)",
        },
        {
          phase: "Signal Analysis",
          duration: "1 week",
          actions: [
            "Rank projects by signup rate and volume",
            "Survey waitlist for deeper interest validation",
            "Kill projects with <2 signups after 2 weeks",
            "Prioritize building top performers",
          ],
          successMetric: "At least one project gets 20+ signups, ready to build",
        },
      ],
      killCriteria: [
        "Zero projects get >5 signups after 2 weeks of promotion",
        "Signup-to-survey response rate below 10%",
        "Traffic acquisition cost makes testing unsustainable",
        "No clear winner emerges, all projects have similar low interest",
      ],
    },
  },

  "smart-cms": {
    id: "smart-cms",
    name: "Smart CMS",
    tagline: "AI-powered website migration and generation",
    icon: "🌐",
    color: "#059669",
    description: "Crawl any existing site, extract semantic structure, rebuild as clean Next.js with intuitive editing. Or generate new sites from learned patterns.",
    thesis: "Website migration is painful and expensive. AI can understand semantic structure (not just scrape HTML) and rebuild sites that clients can actually edit.",
    problem: `
Website migration and creation is broken for small businesses:

Agencies charge $5-15k to rebuild a site that already exists somewhere else. DIY tools like Squarespace and Wix produce cookie-cutter results. Custom builds are expensive and leave clients dependent on developers for every text change.

The real problem? Existing tools either scrape HTML (garbage in, garbage out) or start from blank templates. Nobody's teaching AI to understand what a nav, hero section, testimonial block, or pricing table actually is.
    `.trim(),
    approaches: [
      {
        name: "Migration-First MVP (Recommended)",
        description: "Start with crawling and rebuilding existing sites, add generation later",
        buildTime: "2-3 weeks",
        complexity: "High",
        details: [
          "AI crawler extracts semantic structure, not raw HTML",
          "Outputs component JSON model (nav, hero, testimonials, etc.)",
          "Auto-generates scoped visual editor for that specific site",
          "Next.js build pipeline deployed to Vercel",
          "One MCP integration (scheduling) to prove the hub concept",
        ],
        pros: [
          "Immediate value, clients have a site to migrate",
          "Real pilot client ready (pilates studio)",
          "Every crawl feeds the generation model later",
          "Proves the hard part (semantic understanding) first",
        ],
        cons: [
          "High complexity, lots of edge cases in real sites",
          "Need to decide how opinionated to be about fixing messy designs",
          "Migration is one-time revenue, need subscription upsell",
        ],
      },
      {
        name: "Generation-First",
        description: "Build vertical-specific site generators, add migration later",
        buildTime: "2 weeks",
        complexity: "Medium",
        details: [
          "Start with one vertical (fitness/wellness)",
          "Curated component library based on best practices",
          "AI generates sites from business description + preferences",
          "Same editing layer and build pipeline",
          "Migration comes later as crawl data accumulates",
        ],
        pros: [
          "Cleaner output, no messy source sites to deal with",
          "Subscription model from day one",
          "Can target specific verticals with tailored components",
          "Faster to MVP",
        ],
        cons: [
          "Another website builder in a crowded market",
          "No data flywheel until migration is added",
          "Harder to differentiate without the migration angle",
        ],
      },
      {
        name: "MCP Hub First",
        description: "Build the integration layer, let sites come later",
        buildTime: "1-2 weeks",
        complexity: "Medium",
        details: [
          "Standardized MCP servers for scheduling, payments, CRM, reviews",
          "Works with any frontend initially",
          "Position as integration infrastructure for the incubator",
          "Sites become the delivery mechanism for integrations",
        ],
        pros: [
          "Integrations are reusable across all incubator tools",
          "Lower risk, integrations are well-defined",
          "Guildry and other tools benefit immediately",
          "Can validate integration demand without full CMS",
        ],
        cons: [
          "Doesn't prove the core thesis (semantic understanding)",
          "Integration-only business is harder to monetize",
          "Need a frontend eventually anyway",
        ],
      },
    ],
    testPlan: {
      hypothesis: "Small businesses will pay $99/mo for a site they can actually edit, migrated from their existing mess in under a week",
      validation: [
        {
          phase: "Pilot Migration",
          duration: "2-3 weeks",
          actions: [
            "Crawl the pilates studio client's existing site",
            "Build the semantic extraction pipeline",
            "Generate Next.js site with editing layer",
            "Deploy and get client feedback on editing experience",
          ],
          successMetric: "Client can edit headlines, images, and schedule without developer help",
        },
        {
          phase: "Expand to 3 Sites",
          duration: "2 weeks",
          actions: [
            "Find 2 more pilot clients in fitness/wellness vertical",
            "Run same pipeline, track time and edge cases",
            "Document patterns: what components repeat, what breaks",
            "Add scheduling MCP integration to all three",
          ],
          successMetric: "Migration time under 1 week per site, clients actively using editor",
        },
        {
          phase: "Pricing Validation",
          duration: "2 weeks",
          actions: [
            "Propose pricing to pilot clients: $500 migration + $99/mo hosting",
            "Gauge reaction, adjust based on feedback",
            "Create landing page for waitlist",
            "Run small ad test targeting local businesses with ugly sites",
          ],
          successMetric: "2/3 pilots convert to paid, 20+ waitlist signups",
        },
      ],
      killCriteria: [
        "Semantic extraction quality is too inconsistent across real sites",
        "Clients don't actually use the editing layer",
        "Migration takes more than 2 weeks per site",
        "No willingness to pay at target price point",
      ],
    },
  },

  changelog: {
    id: "changelog",
    name: "Changelog",
    tagline: "Auto-generated product changelogs",
    icon: "📋",
    color: "#6366f1",
    description: "AI generates changelogs from git commits, PRs, and tickets. Ship updates without the writing overhead.",
    thesis: "Product changelogs are tedious to write. This is fully automatable from git. Free for public repos, paid for private.",
    problem: `
Most teams skip changelogs because writing them is tedious:

Digging through PRs and commits takes forever. Translating technical changes to user-facing language is surprisingly hard. Nobody owns it, so it just... doesn't happen. Users get surprised by changes or miss new features entirely.

The result? Frustrated users, repeated support questions, and missed adoption of new features.
    `.trim(),
    approaches: [
      {
        name: "GitHub App (Recommended)",
        description: "Native GitHub integration that generates changelogs automatically on release",
        buildTime: "1 week",
        complexity: "Medium",
        details: [
          "GitHub App installed at org or repo level",
          "Watches for release events or tagged commits",
          "Reads PR titles, descriptions, and linked issues",
          "Uses Claude to generate friendly changelog copy",
          "Creates release notes or updates CHANGELOG.md via PR",
        ],
        pros: [
          "Native GitHub experience, users stay in their workflow",
          "GitHub Marketplace gives you built-in discovery",
          "Freemium model: free for public, paid for private repos",
          "Gets smarter over time by learning from edited changelogs",
        ],
        cons: [
          "GitHub-only at first (GitLab, Bitbucket come later)",
          "Competitive space, need strong differentiation",
          "GitHub API rate limits on free tier",
        ],
      },
      {
        name: "CLI Tool",
        description: "Command-line tool that generates changelogs from local git history",
        buildTime: "3-4 days",
        complexity: "Low",
        details: [
          "npm package: `npx changelog-ai generate`",
          "Reads git log between tags/dates",
          "Outputs markdown or integrates with existing CHANGELOG.md",
          "Configurable via .changelogrc file",
          "Works offline, runs locally",
        ],
        pros: [
          "Fastest to build, just a CLI wrapper around Claude",
          "Platform agnostic, works with any git host",
          "Privacy-focused since code stays local",
          "Can be part of CI/CD pipelines",
        ],
        cons: [
          "Requires user action, not automatic",
          "Harder to monetize CLI tools",
          "Less viral distribution than marketplace",
        ],
      },
      {
        name: "Web App + Webhooks",
        description: "Dashboard that connects to repos and generates changelogs via webhooks",
        buildTime: "2 weeks",
        complexity: "High",
        details: [
          "OAuth with GitHub/GitLab/Bitbucket",
          "Dashboard to configure repos and preferences",
          "Webhook-based changelog generation",
          "Hosted changelog pages (like changelog.yourapp.com)",
          "Widget embeds for marketing sites",
        ],
        pros: [
          "Full control over user experience",
          "Can offer hosted changelog pages as a differentiator",
          "Multiple VCS support from day one",
          "More features means higher price point",
        ],
        cons: [
          "More infrastructure to maintain",
          "Longer to build, more to go wrong",
          "Users have to leave their workflow to configure",
        ],
      },
    ],
    testPlan: {
      hypothesis: "Developers will pay $9/mo to auto-generate changelogs for private repos",
      validation: [
        {
          phase: "Landing Page Test",
          duration: "1 week",
          actions: [
            "Create landing page with value prop and pricing",
            "Add waitlist signup with 'which repos?' question",
            "Run $100 in GitHub-targeted ads",
            "Target: 50+ signups, 10+ provide repo names",
          ],
          successMetric: "50+ waitlist signups with repo context",
        },
        {
          phase: "Manual MVP",
          duration: "1 week",
          actions: [
            "Reach out to top 10 waitlist signups",
            "Manually generate changelogs for their repos",
            "Gather feedback on quality and usefulness",
            "Ask: 'Would you pay $9/mo for this?'",
          ],
          successMetric: "5+ say they would pay",
        },
        {
          phase: "Beta Launch",
          duration: "2 weeks",
          actions: [
            "Build GitHub App MVP",
            "Launch on Product Hunt and GitHub Marketplace",
            "Offer free tier for public repos",
            "Track: installs, generations, upgrades to paid",
          ],
          successMetric: "100+ installs, 5+ paid conversions",
        },
      ],
      killCriteria: [
        "Fewer than 20 waitlist signups after $100 ad spend",
        "Quality feedback is consistently negative",
        "No interest in paying even after seeing value",
        "Competitive products already nail this",
      ],
    },
  },

  brief: {
    id: "brief",
    name: "Brief",
    tagline: "Vague briefs into structured requirements",
    icon: "🎨",
    color: "#a855f7",
    description: "AI asks clarifying questions and generates structured creative briefs from conversation. Reduce rework from unclear requirements.",
    thesis: "Creative briefs are vague and cause rework. Conversational AI can extract structured requirements through guided questions.",
    problem: `
Creative and agency work suffers from vague briefs:

Clients say "make it pop" or "I'll know it when I see it." Requirements are buried in email threads. Missing info isn't discovered until review rounds. Rework eats into margins (studies show 30-50% of agency time goes here).

The brief is basically the contract. When it's unclear, everyone loses.
    `.trim(),
    approaches: [
      {
        name: "Conversational Web App (Recommended)",
        description: "Chat interface that guides clients through brief creation",
        buildTime: "1 week",
        complexity: "Medium",
        details: [
          "Client-facing chat interface",
          "AI asks clarifying questions based on project type",
          "Extracts structured data: goals, audience, constraints, references",
          "Generates polished brief document (PDF/Notion/Google Doc)",
          "Agency gets notification when brief is complete",
        ],
        pros: [
          "Reuses Guildry's conversation engine patterns",
          "Client-facing means agencies can white-label it",
          "Clear value prop: fewer revision rounds",
          "Can charge per-brief or subscription",
        ],
        cons: [
          "Requires client adoption, they have to actually use the tool",
          "Brief quality depends on client engagement",
          "Competitive with existing brief templates",
        ],
      },
      {
        name: "Email/Slack Parser",
        description: "Parse existing communication to extract brief elements",
        buildTime: "2 weeks",
        complexity: "High",
        details: [
          "Forward client emails or connect Slack channel",
          "AI extracts requirements from unstructured conversation",
          "Highlights gaps: 'Budget not specified', 'Timeline unclear'",
          "Agency fills gaps, generates consolidated brief",
          "Integrates with project management tools",
        ],
        pros: [
          "No client behavior change required",
          "Works with existing communication",
          "Catches requirements that would be missed",
          "Higher value means higher price point",
        ],
        cons: [
          "More complex integration requirements",
          "Privacy concerns with email/Slack access",
          "Quality depends on how complete the communication is",
        ],
      },
      {
        name: "Figma/Notion Plugin",
        description: "Brief creation embedded in tools designers already use",
        buildTime: "1-2 weeks",
        complexity: "Medium",
        details: [
          "Figma plugin: attach brief to design file",
          "Notion template: guided brief creation with AI assist",
          "AI suggests missing sections based on project type",
          "Version history and change tracking",
          "Share link for client review/approval",
        ],
        pros: [
          "Meets users where they already work",
          "Plugin marketplaces for distribution",
          "Natural workflow integration",
          "Can expand to multiple platforms",
        ],
        cons: [
          "Platform-specific builds required",
          "Plugin review/approval delays",
          "More limited than a standalone app",
        ],
      },
    ],
    testPlan: {
      hypothesis: "Agencies will pay $49/mo to reduce brief-related rework by 50%",
      validation: [
        {
          phase: "Problem Validation",
          duration: "1 week",
          actions: [
            "Interview 10 agency owners/project managers",
            "Ask: 'What % of rework is due to unclear briefs?'",
            "Understand current brief process and pain points",
            "Validate willingness to pay for a solution",
          ],
          successMetric: "8/10 confirm significant brief-related rework",
        },
        {
          phase: "Concierge MVP",
          duration: "2 weeks",
          actions: [
            "Partner with 3 agencies for pilot",
            "Manually run brief conversations with their clients",
            "Generate briefs using Claude + templates",
            "Measure: time saved, revision rounds reduced",
          ],
          successMetric: "Demonstrable reduction in revisions or time",
        },
        {
          phase: "Product MVP",
          duration: "2 weeks",
          actions: [
            "Build conversational brief creator",
            "Launch to pilot agencies + waitlist",
            "Track: briefs created, completion rate, agency feedback",
            "Introduce pricing: $49/mo for unlimited briefs",
          ],
          successMetric: "3+ paying agencies, 80%+ brief completion",
        },
      ],
      killCriteria: [
        "Agencies don't see briefs as a significant pain point",
        "Clients refuse to use the tool",
        "Generated briefs aren't better than templates",
        "No willingness to pay at target price",
      ],
    },
  },

  recap: {
    id: "recap",
    name: "Recap",
    tagline: "Structured meeting notes with decisions and owners",
    icon: "📝",
    color: "#3b82f6",
    description: "AI generates consistent recaps with decisions, owners, and next steps. Never miss an action item.",
    thesis: "Meeting notes are inconsistent or missing. Differentiate on structure: decisions, owners, deadlines extracted automatically.",
    problem: `
Meeting notes are broken:

90% of meetings have no notes or terrible notes. Action items get lost in paragraph summaries. There's no accountability ("who said they'd do that?"). Same discussions repeat because decisions aren't recorded.

Existing tools transcribe but don't structure. Transcripts are just more text to read.
    `.trim(),
    approaches: [
      {
        name: "Zoom/Meet/Teams Integration (Recommended)",
        description: "Native integrations that join meetings and generate structured recaps",
        buildTime: "2 weeks",
        complexity: "High",
        details: [
          "Bot joins scheduled meetings automatically",
          "Real-time transcription via existing APIs",
          "Claude extracts: decisions, action items, owners, deadlines",
          "Pushes recap to Slack/email/Notion within minutes",
          "Follow-up reminders for action items",
        ],
        pros: [
          "Validated market, people already pay for meeting tools",
          "Clear differentiation: structure beats raw transcription",
          "High retention potential with team workflows",
          "Obvious upgrade path: analytics, search, etc.",
        ],
        cons: [
          "Competitive market (Otter, Fireflies, tl;dv)",
          "Platform integrations are complex",
          "Privacy concerns with recording",
          "Higher infrastructure costs",
        ],
      },
      {
        name: "Upload + Process",
        description: "Upload existing transcripts or recordings for structured processing",
        buildTime: "1 week",
        complexity: "Low",
        details: [
          "Upload audio/video or paste transcript",
          "AI processes and extracts structured data",
          "Output: decisions, actions, owners in clean format",
          "Export to Notion, email, Slack, etc.",
          "No bot needed, works with any source",
        ],
        pros: [
          "Fastest to build, no integrations needed",
          "Works with any meeting platform",
          "Lower privacy concerns since user controls upload",
          "Can process historical meetings",
        ],
        cons: [
          "Extra step for users, must upload/paste",
          "Not automatic, requires action",
          "Harder to build habit/retention",
        ],
      },
      {
        name: "Slack-First",
        description: "Slack app that creates structured recaps from meeting discussions",
        buildTime: "1 week",
        complexity: "Medium",
        details: [
          "Slack command: /recap #meeting-channel",
          "AI reads channel history and extracts structure",
          "Also works with huddle transcripts",
          "Posts recap directly to channel",
          "Integrates with Slack's native meeting features",
        ],
        pros: [
          "Many teams already discuss in Slack",
          "Slack App Directory distribution",
          "Low friction, no new tool to adopt",
          "Can expand to async decisions too",
        ],
        cons: [
          "Limited to Slack-first teams",
          "Quality depends on how complete the Slack discussion is",
          "Slack's meeting features are limited",
        ],
      },
    ],
    testPlan: {
      hypothesis: "Teams will pay $12/user/mo for structured meeting recaps vs raw transcription",
      validation: [
        {
          phase: "Differentiation Test",
          duration: "1 week",
          actions: [
            "Get 5 meeting transcripts from target users",
            "Generate structured recaps manually",
            "Show users: raw transcript vs structured recap",
            "Ask: 'Which would you pay for? How much more?'",
          ],
          successMetric: "Strong preference for structured, 2x+ willingness to pay",
        },
        {
          phase: "Upload MVP",
          duration: "1 week",
          actions: [
            "Build simple upload, process, output flow",
            "Launch to Product Hunt / Twitter",
            "Offer 10 free recaps, then $10/mo",
            "Track: uploads, conversions, feedback",
          ],
          successMetric: "100+ uploads, 10+ paid conversions",
        },
        {
          phase: "Integration Beta",
          duration: "2 weeks",
          actions: [
            "Build Zoom or Slack integration (pick one)",
            "Partner with 5 teams for beta",
            "Measure: meetings processed, feature requests",
            "Validate team pricing at $12/user/mo",
          ],
          successMetric: "3+ teams willing to pay team pricing",
        },
      ],
      killCriteria: [
        "Users don't see value over raw transcription",
        "Structure extraction quality is inconsistent",
        "Existing players already do this well",
        "Price sensitivity below $8/user/mo",
      ],
    },
  },

  intake: {
    id: "intake",
    name: "Intake",
    tagline: "Client intake calls to structured requirements",
    icon: "🎙️",
    color: "#8b5cf6",
    description: "AI joins client calls, extracts requirements, flags gaps, and drafts SOW starters. Turn unstructured discovery into actionable specs.",
    thesis: "Client intake calls are unstructured and notes get lost. Transcription APIs are mature enough to extract structured requirements automatically, saving 2+ hours per client.",
    problem: `
Discovery calls are where projects go wrong before they start:

Someone takes notes (maybe). Requirements get scattered across emails, docs, and memory. By the time you write the SOW, you've forgotten half of what was discussed. Gaps don't surface until the project is underway.

The irony? The client told you everything you needed. You just didn't capture it in a usable way.
    `.trim(),
    approaches: [
      {
        name: "Meeting Bot + Extraction (Recommended)",
        description: "Bot joins calls, transcribes, and extracts structured requirements",
        buildTime: "2 weeks",
        complexity: "High",
        details: [
          "Zoom/Meet/Teams bot joins scheduled intake calls",
          "Real-time transcription via Deepgram or Assembly",
          "Claude extracts: goals, requirements, constraints, timeline, budget signals",
          "Flags gaps: 'Budget not discussed', 'Timeline unclear'",
          "Outputs draft SOW sections ready for review",
        ],
        pros: [
          "Captures everything, not just what someone remembers to write",
          "Flywheel: learns what good intake questions look like over time",
          "Connects to Guildry's scoping module directly",
          "High value per call justifies premium pricing",
        ],
        cons: [
          "Meeting integrations are complex",
          "Privacy concerns, some clients won't want recording",
          "Depends on call quality and clear discussion",
        ],
      },
      {
        name: "Post-Call Upload",
        description: "Upload recordings after the fact for processing",
        buildTime: "1 week",
        complexity: "Low",
        details: [
          "Upload audio/video from any source",
          "Same extraction pipeline, no live integration needed",
          "Works with existing recording workflows",
          "Can process historical calls to build training data",
        ],
        pros: [
          "Fastest to build, no meeting integrations",
          "Works with any recording tool or phone call",
          "Lower privacy friction, user controls what gets uploaded",
          "Can process backlog of past calls",
        ],
        cons: [
          "Extra step, users might not bother",
          "No real-time value during the call",
          "Harder to build habit",
        ],
      },
      {
        name: "Guided Interview Tool",
        description: "AI-guided intake form that asks the right questions",
        buildTime: "1 week",
        complexity: "Medium",
        details: [
          "Send client a link before/after the call",
          "AI asks clarifying questions based on project type",
          "Combines with call notes for complete picture",
          "Generates structured brief automatically",
        ],
        pros: [
          "No recording needed, pure async",
          "Client does some of the work",
          "Can use before call to prep, or after to fill gaps",
          "Reuses Brief's conversation patterns",
        ],
        cons: [
          "Requires client participation",
          "Doesn't capture the nuance of live conversation",
          "May feel redundant if call happened",
        ],
      },
    ],
    testPlan: {
      hypothesis: "Agencies will pay $29/mo to turn intake calls into structured SOW drafts automatically",
      validation: [
        {
          phase: "Manual Extraction",
          duration: "1 week",
          actions: [
            "Get 5 intake call recordings from agency contacts",
            "Manually extract requirements using Claude",
            "Generate draft SOW sections",
            "Show output to agencies, gauge reaction",
          ],
          successMetric: "Strong positive reaction, 'this would save us hours'",
        },
        {
          phase: "Upload MVP",
          duration: "1 week",
          actions: [
            "Build simple upload and extraction flow",
            "Partner with 3 agencies for pilot",
            "Process their real intake calls",
            "Measure: time saved, quality of extraction",
          ],
          successMetric: "2+ hours saved per call, agencies want to keep using it",
        },
        {
          phase: "Pricing + Integration",
          duration: "2 weeks",
          actions: [
            "Add meeting bot integration for one platform",
            "Propose pricing: $29/mo for 10 calls, $79/mo unlimited",
            "Connect output to Guildry's project creation",
            "Track: calls processed, conversion to paid",
          ],
          successMetric: "3+ paying agencies, clean handoff to Guildry",
        },
      ],
      killCriteria: [
        "Extraction quality too inconsistent for real use",
        "Agencies don't actually process enough calls to justify subscription",
        "Privacy concerns kill adoption",
        "Existing transcription tools are 'good enough'",
      ],
    },
  },

  drift: {
    id: "drift",
    name: "Drift",
    tagline: "Contract vs reality monitoring",
    icon: "📊",
    color: "#ec4899",
    description: "AI compares contract terms to actual communication and deliverables. Catch scope creep before it becomes a problem.",
    thesis: "Contracts say one thing, reality drifts another. Document parsing + email integration can surface mismatches automatically.",
    problem: `
Scope creep is a silent killer:

The contract says 5 pages, you're on page 12. The timeline said 6 weeks, you're in month 3. The client asks for "one small change" for the 47th time. By the time you notice, you've already eaten the margin.

Nobody tracks this in real-time because it's tedious. You only realize how bad it got during the post-mortem.
    `.trim(),
    approaches: [
      {
        name: "Email + Document Monitor (Recommended)",
        description: "Watch communication channels and flag drift automatically",
        buildTime: "2-3 weeks",
        complexity: "High",
        details: [
          "Connect email, Slack, and project tools",
          "Parse original contract/SOW for scope boundaries",
          "AI monitors communication for scope expansion signals",
          "Alerts: 'Client requested X which is outside original scope'",
          "Weekly drift report with quantified impact",
        ],
        pros: [
          "Catches drift as it happens, not after",
          "Quantifies the problem for client conversations",
          "Flywheel: learns what 'drift signals' look like across projects",
          "High value, directly protects margin",
        ],
        cons: [
          "Requires broad data access (email, Slack, docs)",
          "Privacy and security concerns",
          "False positives could be annoying",
          "Complex integration requirements",
        ],
      },
      {
        name: "Manual Check-In Tool",
        description: "Periodic scope review with AI assistance",
        buildTime: "1 week",
        complexity: "Low",
        details: [
          "Upload contract + current deliverables list",
          "AI compares and highlights mismatches",
          "Manual trigger, not continuous monitoring",
          "Generates scope change documentation",
        ],
        pros: [
          "Much simpler to build",
          "No ongoing integration maintenance",
          "User controls when to check",
          "Lower privacy concerns",
        ],
        cons: [
          "Reactive, not proactive",
          "Depends on user remembering to check",
          "Misses real-time drift signals",
        ],
      },
      {
        name: "Time Tracking Integration",
        description: "Compare hours logged vs hours scoped",
        buildTime: "1-2 weeks",
        complexity: "Medium",
        details: [
          "Connect to Harvest, Toggl, Clockify, etc.",
          "Map time entries to contract line items",
          "Alert when actuals exceed estimates by threshold",
          "Show burn rate and projected overrun",
        ],
        pros: [
          "Concrete, quantifiable signal",
          "Time tracking data already exists",
          "Clear ROI story",
          "Simpler than full communication monitoring",
        ],
        cons: [
          "Only catches time drift, not scope drift",
          "Depends on accurate time tracking",
          "Lagging indicator, damage already done",
        ],
      },
    ],
    testPlan: {
      hypothesis: "Agencies will pay $99/mo to catch scope creep before it kills their margins",
      validation: [
        {
          phase: "Retrospective Analysis",
          duration: "1 week",
          actions: [
            "Get 3 completed projects with known scope creep",
            "Analyze: contract vs final deliverables vs communication",
            "Identify: when did drift signals first appear?",
            "Show agencies: 'here's where you could have caught it'",
          ],
          successMetric: "Clear pattern of early warning signals that were missed",
        },
        {
          phase: "Time-Based MVP",
          duration: "2 weeks",
          actions: [
            "Build time tracking integration (Harvest first)",
            "Compare actuals to contract estimates",
            "Alert on overruns with context",
            "Pilot with 3 agencies on active projects",
          ],
          successMetric: "At least one 'caught it early' moment per pilot",
        },
        {
          phase: "Full Monitoring Beta",
          duration: "3 weeks",
          actions: [
            "Add email/Slack monitoring for one pilot",
            "Test drift detection accuracy",
            "Refine alert thresholds to minimize noise",
            "Validate $99/mo pricing",
          ],
          successMetric: "Pilot agency renews, false positive rate under 20%",
        },
      ],
      killCriteria: [
        "Agencies don't grant needed data access",
        "Too many false positives make it noisy",
        "Drift detection isn't accurate enough to be useful",
        "Problem isn't painful enough to justify $99/mo",
      ],
    },
  },

  pulse: {
    id: "pulse",
    name: "Pulse",
    tagline: "Auto-generated project status updates",
    icon: "💓",
    color: "#f43f5e",
    description: "AI synthesizes status from Slack, email, and project tools. Generate updates without chasing people.",
    thesis: "'How's the project going?' requires chasing people. AI can synthesize status from existing communication and tools.",
    problem: `
Status updates are broken:

PMs spend hours chasing people for updates. By the time the report is compiled, it's already stale. Nobody reads the 2-page update anyway. Stakeholders just want to know: on track or not?

The information exists. It's in Slack threads, email chains, and ticket comments. It just takes forever to synthesize.
    `.trim(),
    approaches: [
      {
        name: "Multi-Source Synthesis (Recommended)",
        description: "Pull from Slack, email, tickets, and time logs to generate status",
        buildTime: "2-3 weeks",
        complexity: "High",
        details: [
          "Connect Slack, email, Jira/Linear/Asana, time tracking",
          "AI synthesizes activity into structured status",
          "Output: what happened, blockers, risks, next steps",
          "Scheduled delivery (weekly) or on-demand",
          "Stakeholder-appropriate summaries (exec vs team)",
        ],
        pros: [
          "Eliminates status meeting prep entirely",
          "Always current, based on real activity",
          "Flywheel: learns what 'good status' looks like",
          "Connects naturally to Guildry's project view",
        ],
        cons: [
          "Lots of integrations to build and maintain",
          "Quality depends on team actually using those tools",
          "Privacy concerns with broad access",
          "Synthesis accuracy is critical",
        ],
      },
      {
        name: "Slack-Only",
        description: "Generate status from Slack activity in project channels",
        buildTime: "1 week",
        complexity: "Medium",
        details: [
          "Slack bot watches project channels",
          "Summarizes: key updates, decisions, blockers mentioned",
          "Weekly digest or on-demand /pulse command",
          "Highlights threads that need attention",
        ],
        pros: [
          "Single integration, faster to build",
          "Many teams already discuss in Slack",
          "Lower privacy scope",
          "Can expand to other sources later",
        ],
        cons: [
          "Misses work that happens outside Slack",
          "Quality depends on Slack communication culture",
          "Some teams don't use Slack for project work",
        ],
      },
      {
        name: "Template + AI Fill",
        description: "AI helps fill standard status template from prompts",
        buildTime: "3-4 days",
        complexity: "Low",
        details: [
          "Standard status template with sections",
          "AI prompts user with smart questions",
          "Suggests content based on last update + time passed",
          "User reviews and sends",
        ],
        pros: [
          "Fastest to build, no integrations",
          "Works for any team/tool setup",
          "User stays in control of content",
          "Good starting point to learn what works",
        ],
        cons: [
          "Still requires user effort",
          "Not truly automated",
          "Doesn't solve the 'chasing people' problem",
        ],
      },
    ],
    testPlan: {
      hypothesis: "PMs will pay $19/user/mo to generate project status updates automatically",
      validation: [
        {
          phase: "Manual Synthesis",
          duration: "1 week",
          actions: [
            "Get Slack export from 2 active projects",
            "Manually synthesize weekly status using Claude",
            "Show to PMs: 'Is this accurate? Would you send this?'",
            "Understand: what's missing, what's wrong",
          ],
          successMetric: "Status is 80%+ accurate, PMs would send with minor edits",
        },
        {
          phase: "Slack Bot MVP",
          duration: "2 weeks",
          actions: [
            "Build Slack bot with /pulse command",
            "Summarize last 7 days of channel activity",
            "Test with 5 project channels across 2 teams",
            "Iterate on summary quality",
          ],
          successMetric: "Teams actually use /pulse weekly, find it useful",
        },
        {
          phase: "Multi-Source Beta",
          duration: "2 weeks",
          actions: [
            "Add one more source (Jira or Linear)",
            "Combine for richer status",
            "Test scheduled delivery vs on-demand",
            "Validate pricing at $19/user/mo",
          ],
          successMetric: "3+ teams on paid pilot, weekly active usage",
        },
      ],
      killCriteria: [
        "Synthesis quality too inconsistent",
        "Teams don't communicate enough in connected tools",
        "PMs prefer manual control over automated status",
        "Price sensitivity below $10/user/mo",
      ],
    },
  },

  handoff: {
    id: "handoff",
    name: "Handoff",
    tagline: "Instant project context for new team members",
    icon: "🤝",
    color: "#06b6d4",
    description: "AI generates comprehensive project context docs from all existing materials. New people productive in hours, not days.",
    thesis: "Onboarding new team members to projects is painful. Document synthesis can generate context from scattered materials instantly.",
    problem: `
Onboarding someone to an active project is chaos:

Where's the brief? Which Slack channel? Who's the client contact? What decisions were already made? The new person asks questions for a week. The existing team gets interrupted constantly.

All this information exists somewhere. It's just scattered across 47 places and nobody has time to compile it.
    `.trim(),
    approaches: [
      {
        name: "Auto-Generated Context Doc (Recommended)",
        description: "AI compiles project context from all sources into a single doc",
        buildTime: "2 weeks",
        complexity: "High",
        details: [
          "Pull from: brief, contract, Slack, email, tickets, drive",
          "Generate: project overview, key people, decisions made, current status",
          "Include: links to important docs and threads",
          "Update automatically as project evolves",
          "Role-specific views (designer vs developer vs PM)",
        ],
        pros: [
          "Massive time saver, measured in days not hours",
          "Always current, not a stale wiki page",
          "Flywheel: learns what new team members actually need",
          "Natural extension of Guildry's project model",
        ],
        cons: [
          "Requires broad data access",
          "Quality depends on information existing in connected tools",
          "Complex to get right, lots of edge cases",
        ],
      },
      {
        name: "Q&A Bot",
        description: "Chatbot that answers questions about the project",
        buildTime: "1-2 weeks",
        complexity: "Medium",
        details: [
          "Index all project materials",
          "New team member asks questions in natural language",
          "Bot answers with sources and links",
          "Learns what questions are common",
        ],
        pros: [
          "Interactive, surfaces what's actually needed",
          "Doesn't require perfect pre-generation",
          "Can handle edge case questions",
          "Usage data shows gaps in documentation",
        ],
        cons: [
          "Requires new person to know what to ask",
          "Doesn't provide proactive overview",
          "RAG quality can be inconsistent",
        ],
      },
      {
        name: "Guided Onboarding Flow",
        description: "Step-by-step onboarding checklist with AI-populated content",
        buildTime: "1 week",
        complexity: "Low",
        details: [
          "Standard onboarding checklist template",
          "AI populates with project-specific info",
          "New person works through steps",
          "Tracks completion, flags gaps",
        ],
        pros: [
          "Structured, ensures nothing missed",
          "Simpler to build than full synthesis",
          "Clear progress visibility",
          "Can work with partial information",
        ],
        cons: [
          "Less comprehensive than full context doc",
          "Template might not fit all project types",
          "Still some manual work required",
        ],
      },
    ],
    testPlan: {
      hypothesis: "Teams will pay $49/mo per project to onboard new members in hours instead of days",
      validation: [
        {
          phase: "Manual Context Doc",
          duration: "1 week",
          actions: [
            "Pick 2 active projects with recent additions",
            "Manually compile context doc using Claude",
            "Have new team member review: 'What's missing?'",
            "Time: how long to create, how much time saved",
          ],
          successMetric: "Context doc rated 'very useful', time to productivity cut by 50%+",
        },
        {
          phase: "Automated Generation",
          duration: "2 weeks",
          actions: [
            "Build multi-source context generation",
            "Test on 3 different project types",
            "Compare: auto-generated vs manual quality",
            "Iterate on what to include/exclude",
          ],
          successMetric: "Auto-generated docs are 80%+ as good as manual",
        },
        {
          phase: "Live Onboarding Test",
          duration: "2 weeks",
          actions: [
            "Use tool for actual new team member onboarding",
            "Measure: time to first contribution, questions asked",
            "Gather feedback from both new person and team",
            "Validate $49/mo per project pricing",
          ],
          successMetric: "Measurable reduction in onboarding time, team wants to keep using",
        },
      ],
      killCriteria: [
        "Generated context docs are too inaccurate or incomplete",
        "Teams don't have enough in connected tools to work with",
        "Problem isn't painful enough (onboarding is 'fine')",
        "Per-project pricing doesn't work for teams with many projects",
      ],
    },
  },

  terms: {
    id: "terms",
    name: "Terms",
    tagline: "Contract review that catches risks",
    icon: "📜",
    color: "#f59e0b",
    description: "AI highlights unusual terms and compares to your standard templates. Read contracts in minutes, not hours.",
    thesis: "Reading contracts is tedious and risks get missed. Document comparison can surface unusual terms against your templates.",
    problem: `
Nobody actually reads contracts:

You skim, you sign, you hope for the best. That one weird clause about IP assignment? Missed it. The unlimited revisions language? Didn't notice. The payment terms that net 90 instead of 30? Surprise.

Lawyers are expensive. Reading carefully takes forever. So you don't, and sometimes you pay for it.
    `.trim(),
    approaches: [
      {
        name: "Template Comparison (Recommended)",
        description: "Compare incoming contracts to your known-good templates",
        buildTime: "1-2 weeks",
        complexity: "Medium",
        details: [
          "Upload your standard contract templates",
          "Upload incoming contract for review",
          "AI highlights: what's different, what's missing, what's risky",
          "Risk scoring: green/yellow/red by clause",
          "Suggested negotiation points",
        ],
        pros: [
          "Clear value: compare to what you know is safe",
          "Builds library of 'your terms' over time",
          "Fast, review in minutes not hours",
          "Can flag specific red flags (unlimited revisions, IP traps)",
        ],
        cons: [
          "Need template library to compare against",
          "Can't catch risks not in your templates",
          "Legal nuance might be missed",
        ],
      },
      {
        name: "Risk Pattern Detection",
        description: "AI trained on common contract risks across industries",
        buildTime: "2 weeks",
        complexity: "High",
        details: [
          "Pre-trained on common contract pitfalls",
          "Scans for: payment terms, IP clauses, liability caps, termination",
          "Industry-specific risk patterns",
          "No template needed, works standalone",
        ],
        pros: [
          "Works without your templates",
          "Broader risk coverage",
          "Can learn from community patterns",
          "Higher value, more comprehensive",
        ],
        cons: [
          "More complex to build and train",
          "Generic patterns might miss your specific concerns",
          "Higher bar for accuracy",
        ],
      },
      {
        name: "Clause Library",
        description: "Searchable library of good vs bad clause examples",
        buildTime: "1 week",
        complexity: "Low",
        details: [
          "Curated examples of risky vs safe clauses",
          "Search by clause type (IP, payment, termination)",
          "Side-by-side: what you should push for vs accept",
          "Community contributed over time",
        ],
        pros: [
          "Simpler to build, curated content",
          "Educational, helps users learn",
          "Can be free/freemium entry point",
          "Builds audience for full product",
        ],
        cons: [
          "Passive, user has to search",
          "Doesn't analyze their specific contract",
          "Less immediate value",
        ],
      },
    ],
    testPlan: {
      hypothesis: "Small agencies will pay $29/mo to review contracts 10x faster and catch risks",
      validation: [
        {
          phase: "Manual Comparison",
          duration: "1 week",
          actions: [
            "Get 5 real contracts from agency contacts",
            "Get their standard templates",
            "Manually do comparison using Claude",
            "Show output: 'Would this have helped?'",
          ],
          successMetric: "Identify at least 2 risks per contract that user missed",
        },
        {
          phase: "Template MVP",
          duration: "2 weeks",
          actions: [
            "Build upload + comparison flow",
            "Support 3 contract types (MSA, SOW, NDA)",
            "Test with 5 agencies on real contracts",
            "Measure: time saved, risks caught",
          ],
          successMetric: "Review time under 10 minutes, risk detection accuracy 80%+",
        },
        {
          phase: "Paid Pilot",
          duration: "2 weeks",
          actions: [
            "Add risk pattern detection",
            "Launch to waitlist with $29/mo pricing",
            "Track: contracts reviewed, conversion rate",
            "Gather feedback on what risks matter most",
          ],
          successMetric: "10+ paying users, weekly active usage",
        },
      ],
      killCriteria: [
        "Risk detection has too many false positives/negatives",
        "Users don't have standard templates to compare against",
        "Legal concerns about AI contract advice",
        "Price sensitivity below $15/mo",
      ],
    },
  },

  forecast: {
    id: "forecast",
    name: "Forecast",
    tagline: "AI-powered revenue forecasting",
    icon: "📈",
    color: "#10b981",
    description: "Predict cash flow from pipeline, project status, and historical close rates. Replace spreadsheet hell.",
    thesis: "Revenue forecasting is spreadsheet hell. The data already exists in tools, AI can predict cash flow automatically.",
    problem: `
Revenue forecasting is a mess:

Half the data is in your CRM, half in spreadsheets, half in someone's head. Close rates are guesses. Project end dates slip. You're surprised when cash gets tight.

Agencies need to know: what's coming in, when, and how confident should we be? The data exists. The synthesis doesn't.
    `.trim(),
    approaches: [
      {
        name: "Pipeline + Project Integration (Recommended)",
        description: "Combine CRM pipeline with active project data for full picture",
        buildTime: "2-3 weeks",
        complexity: "High",
        details: [
          "Connect CRM (HubSpot, Pipedrive) for pipeline",
          "Connect project tools for active work",
          "AI adjusts close rates based on historical patterns",
          "Predict: revenue by month with confidence intervals",
          "Scenario modeling: what if this deal slips?",
        ],
        pros: [
          "Complete picture: pipeline + in-progress + renewals",
          "Learns from your actual close rates, not guesses",
          "Directly actionable for capacity planning",
          "High value, directly affects business decisions",
        ],
        cons: [
          "Requires clean data in CRM and project tools",
          "Complex integrations to build",
          "Accuracy depends on data quality",
        ],
      },
      {
        name: "Spreadsheet Enhancer",
        description: "AI layer on top of existing forecasting spreadsheets",
        buildTime: "1-2 weeks",
        complexity: "Medium",
        details: [
          "Import existing forecast spreadsheet",
          "AI suggests adjustments based on patterns",
          "Highlights: overconfident deals, missing renewals",
          "Generates scenarios automatically",
          "Export back to spreadsheet or visualize",
        ],
        pros: [
          "Works with existing workflow",
          "No need to change tools",
          "Lower adoption friction",
          "Can show value quickly",
        ],
        cons: [
          "Depends on spreadsheet quality",
          "Doesn't fix underlying data problems",
          "Less automated than full integration",
        ],
      },
      {
        name: "Invoice-Based Projection",
        description: "Forecast from invoicing patterns and payment history",
        buildTime: "1 week",
        complexity: "Medium",
        details: [
          "Connect invoicing tool (Stripe, QuickBooks, FreshBooks)",
          "Analyze: when do clients actually pay?",
          "Project cash flow based on historical patterns",
          "Flag: at-risk invoices, slow payers",
        ],
        pros: [
          "Based on actual money, not projections",
          "Simpler data source",
          "Clear, concrete output",
          "Helps with collections too",
        ],
        cons: [
          "Backward-looking, misses new pipeline",
          "Doesn't help with sales forecasting",
          "Limited strategic value",
        ],
      },
    ],
    testPlan: {
      hypothesis: "Agency owners will pay $79/mo for accurate revenue forecasting that updates automatically",
      validation: [
        {
          phase: "Historical Analysis",
          duration: "1 week",
          actions: [
            "Get 12 months of actual revenue data from 3 agencies",
            "Get their forecast spreadsheets from same period",
            "Compare: how accurate were their forecasts?",
            "Show: where AI could have improved predictions",
          ],
          successMetric: "Demonstrate 20%+ improvement in forecast accuracy",
        },
        {
          phase: "Spreadsheet MVP",
          duration: "2 weeks",
          actions: [
            "Build spreadsheet import and analysis",
            "Add AI suggestions and scenario modeling",
            "Test with 3 agencies on current forecasts",
            "Measure: do suggestions improve accuracy?",
          ],
          successMetric: "Users adopt at least 50% of AI suggestions",
        },
        {
          phase: "Integration Beta",
          duration: "3 weeks",
          actions: [
            "Add CRM integration (HubSpot first)",
            "Automate pipeline to forecast flow",
            "Test accuracy over 2-week period",
            "Validate $79/mo pricing",
          ],
          successMetric: "Forecast within 15% of actuals, 3+ paying users",
        },
      ],
      killCriteria: [
        "Forecast accuracy not meaningfully better than spreadsheets",
        "Agencies don't have clean enough data to work with",
        "Too much manual work to set up and maintain",
        "Price sensitivity below $50/mo",
      ],
    },
  },

  audit: {
    id: "audit",
    name: "Audit",
    tagline: "SOW vs deliverables verification",
    icon: "✅",
    color: "#14b8a6",
    description: "AI compares SOW line items to actual deliverables and time logs. Know if you delivered everything promised.",
    thesis: "'Did we deliver everything in the SOW?' requires manual checking. Cross-document matching can verify automatically.",
    problem: `
Project closeout is a mess:

Did we deliver everything in the SOW? Someone has to manually check. What about change orders? Were those completed? Any scope that got dropped? By project end, nobody remembers what was promised.

This matters for renewals, referrals, and not getting burned. But checking is tedious, so it doesn't happen.
    `.trim(),
    approaches: [
      {
        name: "SOW to Deliverables Matcher (Recommended)",
        description: "AI compares SOW line items to completed work",
        buildTime: "2 weeks",
        complexity: "Medium",
        details: [
          "Parse SOW into discrete deliverables",
          "Connect to file storage, tickets, time logs",
          "AI matches: what was promised vs what exists",
          "Report: delivered, missing, modified, added",
          "Change order tracking built in",
        ],
        pros: [
          "Clear, actionable closeout checklist",
          "Catches things before final invoice",
          "Protects against client 'we never got X' claims",
          "Flywheel: learns what deliverables look like across projects",
        ],
        cons: [
          "Needs clean SOW parsing (messy contracts are hard)",
          "Deliverable 'matching' is fuzzy",
          "Requires files/tickets to be organized enough",
        ],
      },
      {
        name: "Time Log Verification",
        description: "Compare hours scoped vs hours logged by category",
        buildTime: "1 week",
        complexity: "Low",
        details: [
          "Parse SOW for hour estimates by category",
          "Pull actual time from tracking tools",
          "Report: over/under by category",
          "Flag categories with no logged time",
        ],
        pros: [
          "Simpler matching (hours are numbers)",
          "Clear signal for what got attention",
          "Easy integration with existing time tools",
          "Can run throughout project, not just at end",
        ],
        cons: [
          "Hours don't equal deliverables",
          "Time might be logged but work not delivered",
          "Depends on accurate time categorization",
        ],
      },
      {
        name: "Client Sign-Off Tool",
        description: "Structured closeout workflow with client verification",
        buildTime: "1 week",
        complexity: "Low",
        details: [
          "Generate checklist from SOW",
          "Client marks each item as received/approved",
          "Track sign-off status",
          "Generate acceptance documentation",
        ],
        pros: [
          "Gets client on record confirming delivery",
          "Clear paper trail",
          "Simple to build",
          "Can be part of final invoice flow",
        ],
        cons: [
          "Requires client participation",
          "Doesn't verify delivery itself",
          "Manual checklist creation",
        ],
      },
    ],
    testPlan: {
      hypothesis: "Agencies will pay $19/mo to verify project delivery against contracts automatically",
      validation: [
        {
          phase: "Retrospective Audit",
          duration: "1 week",
          actions: [
            "Get 3 recently completed projects with SOW + deliverables",
            "Manually audit: did delivery match SOW?",
            "Find gaps: what was missed, what was added",
            "Show agencies: 'Here's what you might have missed'",
          ],
          successMetric: "Find at least one issue per project that wasn't caught",
        },
        {
          phase: "Parser MVP",
          duration: "2 weeks",
          actions: [
            "Build SOW parser for common formats",
            "Build deliverable matcher (files, tickets)",
            "Test on 5 real projects",
            "Measure: matching accuracy, false positives",
          ],
          successMetric: "90%+ matching accuracy, useful for real closeout",
        },
        {
          phase: "Workflow Integration",
          duration: "2 weeks",
          actions: [
            "Integrate with Guildry's project completion flow",
            "Add client sign-off component",
            "Test full closeout workflow",
            "Validate $19/mo pricing",
          ],
          successMetric: "3+ agencies using for real project closeouts",
        },
      ],
      killCriteria: [
        "SOW parsing too unreliable for messy contracts",
        "Deliverable matching has too many false positives",
        "Agencies don't care enough about formal closeout",
        "Too much manual work to get value",
      ],
    },
  },

  docs: {
    id: "docs",
    name: "Docs",
    tagline: "Keep internal docs in sync with code",
    icon: "📚",
    color: "#0ea5e9",
    description: "AI watches codebase changes, flags stale docs, and suggests updates. Documentation that stays current.",
    thesis: "Internal docs are outdated or missing. AI can watch for changes and flag when docs need updates.",
    problem: `
Documentation is always out of date:

Someone writes a README. The code changes. The README doesn't. Six months later, new developer follows the docs and everything breaks. "Oh yeah, we don't do it that way anymore."

Nobody has time to update docs. So they rot. And onboarding suffers, bugs happen, knowledge lives only in people's heads.
    `.trim(),
    approaches: [
      {
        name: "Git Watcher + Flag System (Recommended)",
        description: "Monitor code changes and flag docs that might be stale",
        buildTime: "2 weeks",
        complexity: "Medium",
        details: [
          "GitHub/GitLab integration watches commits",
          "Map docs to code sections they describe",
          "AI detects: did this change affect related docs?",
          "Flag docs for review with context",
          "Suggest specific updates when possible",
        ],
        pros: [
          "Proactive, catches staleness as it happens",
          "Works with existing doc structure",
          "Clear action items for doc updates",
          "Flywheel: learns what changes matter for docs",
        ],
        cons: [
          "Mapping docs to code is imperfect",
          "May generate false positives",
          "Requires docs to exist in the first place",
        ],
      },
      {
        name: "Doc Generator from Code",
        description: "Auto-generate documentation from codebase",
        buildTime: "2 weeks",
        complexity: "High",
        details: [
          "Analyze codebase structure and patterns",
          "Generate: architecture overview, API docs, setup guides",
          "Keep in sync via regeneration on changes",
          "Diff-based updates to preserve manual additions",
        ],
        pros: [
          "Docs always match code by definition",
          "Reduces manual documentation burden",
          "Consistent format across projects",
          "Can generate from scratch for undocumented code",
        ],
        cons: [
          "Generated docs often lack context/reasoning",
          "Quality depends on code quality",
          "May overwrite valuable manual content",
        ],
      },
      {
        name: "Knowledge Q&A Layer",
        description: "Chatbot that answers code questions from docs + code",
        buildTime: "1 week",
        complexity: "Low",
        details: [
          "Index docs and codebase",
          "Developers ask questions in natural language",
          "AI answers with sources",
          "Track: what questions aren't covered?",
        ],
        pros: [
          "Works even with incomplete docs",
          "Surfaces what's actually needed",
          "Lower bar than full doc maintenance",
          "Shows gaps via unanswered questions",
        ],
        cons: [
          "Doesn't fix underlying doc problem",
          "RAG quality can be inconsistent",
          "Developers might not ask",
        ],
      },
    ],
    testPlan: {
      hypothesis: "Dev teams will pay $29/mo to keep docs in sync with code automatically",
      validation: [
        {
          phase: "Staleness Audit",
          duration: "1 week",
          actions: [
            "Audit docs in 3 active repos",
            "Compare doc content to current code",
            "Find: what's stale, what's missing",
            "Estimate: how much time to fix manually",
          ],
          successMetric: "Find significant staleness in 3/3 repos",
        },
        {
          phase: "Watcher MVP",
          duration: "2 weeks",
          actions: [
            "Build GitHub integration",
            "Implement doc-to-code mapping",
            "Test staleness detection on real repos",
            "Measure: true positive rate",
          ],
          successMetric: "Catch 80%+ of doc-affecting changes with < 20% false positives",
        },
        {
          phase: "Team Beta",
          duration: "2 weeks",
          actions: [
            "Deploy to 3 dev teams",
            "Integrate with their doc workflow (Notion, Confluence)",
            "Track: flags generated, flags acted on",
            "Validate $29/mo pricing",
          ],
          successMetric: "Teams act on 50%+ of flags, want to continue",
        },
      ],
      killCriteria: [
        "Too many false positives make it noisy",
        "Doc-to-code mapping is too unreliable",
        "Teams ignore flags, don't value doc currency",
        "Competitive tools already do this well",
      ],
    },
  },

  onboard: {
    id: "onboard",
    name: "Onboard",
    tagline: "Personalized employee onboarding plans",
    icon: "🚀",
    color: "#84cc16",
    description: "AI generates onboarding plans from role requirements and existing materials. Consistent, personalized onboarding at scale.",
    thesis: "Employee onboarding is inconsistent. AI can personalize plans based on role while ensuring nothing is missed.",
    problem: `
Employee onboarding is chaos:

HR has a checklist. The manager has different expectations. The new hire doesn't know who to ask what. Some people get great onboarding, some get thrown in. It takes months to feel productive.

The information exists. The personalization doesn't. Everyone gets the same generic checklist regardless of role.
    `.trim(),
    approaches: [
      {
        name: "Role-Based Plan Generator (Recommended)",
        description: "Generate personalized onboarding from role + company materials",
        buildTime: "2 weeks",
        complexity: "Medium",
        details: [
          "Input: job description, team info, company docs",
          "AI generates: week-by-week onboarding plan",
          "Mix of: company-wide + team-specific + role-specific",
          "Track progress, surface blockers",
          "Adapt plan based on new hire feedback",
        ],
        pros: [
          "Personalized without manual work",
          "Consistent baseline with role customization",
          "Measurable: track onboarding metrics",
          "Flywheel: learns what makes good onboarding",
        ],
        cons: [
          "Quality depends on source materials",
          "Role-specific content needs to exist",
          "May miss company culture nuances",
        ],
      },
      {
        name: "Buddy + AI Assist",
        description: "AI supports assigned onboarding buddy",
        buildTime: "1 week",
        complexity: "Low",
        details: [
          "Buddy assigned as usual",
          "AI provides: suggested topics, reminders, check-in prompts",
          "New hire can ask AI questions first",
          "Escalate to buddy when AI can't help",
        ],
        pros: [
          "Keeps human connection central",
          "Reduces buddy burden",
          "AI handles repetitive questions",
          "Works alongside existing programs",
        ],
        cons: [
          "Still depends on buddy quality",
          "Doesn't fix broken programs",
          "Limited impact compared to full solution",
        ],
      },
      {
        name: "Self-Service Knowledge Base",
        description: "Searchable onboarding knowledge base with AI chat",
        buildTime: "1 week",
        complexity: "Low",
        details: [
          "Centralize all onboarding materials",
          "AI chat for questions",
          "Suggested reading paths by role",
          "Track: what do people search for?",
        ],
        pros: [
          "New hires can self-serve",
          "Scales without adding headcount",
          "Shows gaps via search patterns",
          "Foundation for more advanced features",
        ],
        cons: [
          "Passive, requires self-motivation",
          "Doesn't replace structured program",
          "Knowledge base must be created first",
        ],
      },
    ],
    testPlan: {
      hypothesis: "Companies will pay $99/mo for AI-generated personalized onboarding plans",
      validation: [
        {
          phase: "Manual Plan Generation",
          duration: "1 week",
          actions: [
            "Get job descriptions and onboarding materials from 2 companies",
            "Manually generate personalized plans using Claude",
            "Compare to their existing onboarding",
            "Get feedback: better, worse, what's missing?",
          ],
          successMetric: "Generated plans rated better than existing",
        },
        {
          phase: "Generator MVP",
          duration: "2 weeks",
          actions: [
            "Build role-based plan generator",
            "Support 3 common role types",
            "Test with 5 upcoming hires across 2 companies",
            "Gather feedback from new hires and managers",
          ],
          successMetric: "New hires and managers prefer generated plans",
        },
        {
          phase: "Full Program Pilot",
          duration: "4 weeks",
          actions: [
            "Run full onboarding program for 10 new hires",
            "Track: time to productivity, satisfaction scores",
            "Compare to control group with standard onboarding",
            "Validate $99/mo pricing",
          ],
          successMetric: "Measurable improvement in time to productivity",
        },
      ],
      killCriteria: [
        "Generated plans are too generic to be useful",
        "Companies don't have source materials to work with",
        "New hires prefer human-led onboarding regardless",
        "Too hard to measure ROI",
      ],
    },
  },

  standup: {
    id: "standup",
    name: "Standup",
    tagline: "Async standups without the noise",
    icon: "🗣️",
    color: "#eab308",
    description: "AI synthesizes team updates, surfaces blockers, and skips the noise. Get signal without the meeting.",
    thesis: "Async standups are noisy or ignored. AI can synthesize updates and surface only what matters.",
    problem: `
Daily standups are broken:

Sync standups interrupt deep work. Async standups become walls of text nobody reads. Blockers get buried. Half the team doesn't update consistently.

You want to know: what's happening, who's stuck, what needs attention? You don't want to read 15 updates to find one blocker.
    `.trim(),
    approaches: [
      {
        name: "Smart Digest (Recommended)",
        description: "AI synthesizes async updates into actionable digest",
        buildTime: "1-2 weeks",
        complexity: "Medium",
        details: [
          "Team submits updates (Slack, form, or bot prompt)",
          "AI synthesizes: key progress, blockers, attention needed",
          "Personalized digest: show me what I care about",
          "Highlight: related work, dependencies, conflicts",
          "Skip the noise, surface the signal",
        ],
        pros: [
          "Solves the 'wall of text' problem",
          "Personalized, everyone sees what matters to them",
          "Catches blockers and dependencies automatically",
          "Flywheel: learns what's important per team",
        ],
        cons: [
          "Still requires people to submit updates",
          "Synthesis quality depends on update quality",
          "May miss nuance in brief updates",
        ],
      },
      {
        name: "Activity-Based Status",
        description: "Generate status from tool activity, no manual input",
        buildTime: "2 weeks",
        complexity: "High",
        details: [
          "Connect: GitHub, Jira, Slack, Calendar",
          "AI infers: what did each person work on?",
          "Synthesize into team digest",
          "Highlight: stalled work, missing activity",
        ],
        pros: [
          "Zero input required from team",
          "Based on actual work, not self-reports",
          "Catches silent blockers (no activity = problem)",
          "More accurate than manual updates",
        ],
        cons: [
          "Lots of integrations to build",
          "May feel like surveillance",
          "Misses work not in connected tools",
        ],
      },
      {
        name: "Intelligent Prompts",
        description: "AI asks better standup questions based on context",
        buildTime: "1 week",
        complexity: "Low",
        details: [
          "Instead of generic 'what did you do?'",
          "AI asks: 'How's the payment integration going?'",
          "Based on: tickets assigned, recent commits, calendar",
          "Gets more useful updates with less effort",
        ],
        pros: [
          "Better input = better output",
          "Shows team their work is visible",
          "Reduces cognitive load of 'what should I report?'",
          "Works with existing standup tools",
        ],
        cons: [
          "Still requires manual response",
          "Prompt quality depends on data access",
          "Incremental improvement, not transformation",
        ],
      },
    ],
    testPlan: {
      hypothesis: "Teams will pay $8/user/mo for AI-synthesized async standups that surface blockers",
      validation: [
        {
          phase: "Manual Synthesis",
          duration: "1 week",
          actions: [
            "Get 5 days of async standup updates from 2 teams",
            "Manually synthesize into daily digests using Claude",
            "Show to team leads: 'Is this useful?'",
            "Compare: time to read digest vs all updates",
          ],
          successMetric: "Digest preferred over reading all updates, catches blockers",
        },
        {
          phase: "Slack Bot MVP",
          duration: "2 weeks",
          actions: [
            "Build Slack bot for standup collection",
            "Auto-synthesize into digest",
            "Test with 3 teams for 2 weeks",
            "Measure: engagement, blocker detection, usefulness",
          ],
          successMetric: "80%+ update rate, leads find digests actionable",
        },
        {
          phase: "Full Product Launch",
          duration: "2 weeks",
          actions: [
            "Add personalization (what I care about)",
            "Add activity-based signals",
            "Launch publicly with $8/user/mo pricing",
            "Track: signup, retention, feature usage",
          ],
          successMetric: "50+ users, 70%+ weekly retention",
        },
      ],
      killCriteria: [
        "Teams don't submit updates consistently",
        "Synthesis misses important blockers",
        "Digest becomes another thing to ignore",
        "Competitive tools already do this well",
      ],
    },
  },
};

function ApproachCard({ approach, index, color }) {
  const isRecommended = approach.name.includes("Recommended");

  return (
    <div
      className={`rounded-xl border-2 overflow-hidden ${
        isRecommended ? "ring-2 ring-offset-2" : ""
      }`}
      style={{
        borderColor: isRecommended ? color : "#e2e8f0",
        ringColor: isRecommended ? color : undefined,
      }}
    >
      <div
        className="p-4 border-b"
        style={{
          backgroundColor: isRecommended ? `${color}10` : "#f8fafc",
          borderColor: isRecommended ? `${color}30` : "#e2e8f0",
        }}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="font-mono text-[10px] text-slate-500">
              Approach {index + 1}
            </span>
            <h3 className="text-lg font-semibold text-slate-800 m-0">
              {approach.name}
            </h3>
          </div>
          {isRecommended && (
            <span
              className="font-mono text-[10px] px-2 py-1 rounded-full"
              style={{ backgroundColor: `${color}20`, color: color }}
            >
              Recommended
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600 m-0">{approach.description}</p>
      </div>

      <div className="p-4 bg-white">
        {/* Build time and complexity */}
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">⏱️</span>
            <span className="font-mono text-xs text-slate-600">
              {approach.buildTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">📊</span>
            <span className="font-mono text-xs text-slate-600">
              {approach.complexity} complexity
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="mb-4">
          <h4 className="font-mono text-[10px] uppercase text-slate-500 mb-2 m-0">
            Implementation
          </h4>
          <ul className="text-xs text-slate-600 m-0 p-0 list-none space-y-1">
            {approach.details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-slate-400 mt-0.5">→</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-mono text-[10px] uppercase text-green-600 mb-2 m-0">
              Pros
            </h4>
            <ul className="text-xs text-slate-600 m-0 p-0 list-none space-y-1">
              {approach.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">+</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] uppercase text-red-600 mb-2 m-0">
              Cons
            </h4>
            <ul className="text-xs text-slate-600 m-0 p-0 list-none space-y-1">
              {approach.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">−</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ValidationPhase({ phase, index, color }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-mono text-sm font-bold"
          style={{ backgroundColor: color }}
        >
          {index + 1}
        </div>
        {index < 2 && <div className="w-0.5 flex-1 bg-slate-200 mt-2" />}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="font-semibold text-slate-800 m-0">{phase.phase}</h4>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500">
            {phase.duration}
          </span>
        </div>
        <ul className="text-sm text-slate-600 m-0 p-0 list-none space-y-1 mb-3">
          {phase.actions.map((action, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-slate-400">•</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          <span>✓</span>
          <span>{phase.successMetric}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const project = PROJECT_DETAILS[params.id];

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-4">
          Project not found
        </h1>
        <p className="text-slate-600 mb-8">
          This project doesn't have a detail page yet.
        </p>
        <Link
          href="/projects"
          className="font-mono text-sm text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/projects"
          className="font-mono text-[11px] text-slate-500 hover:text-slate-700 no-underline mb-4 inline-block"
        >
          ← Back to Projects
        </Link>
        <div className="flex items-start gap-4 mb-4">
          <span className="text-5xl">{project.icon}</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-gradient m-0">
              {project.name}
            </h1>
            <p className="text-lg text-slate-600 m-0">{project.tagline}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3">
          {["smart-cms", "changelog", "brief", "intake", "drift", "handoff", "terms", "forecast", "audit"].includes(params.id) && (
            <Link
              href={`/landing/${params.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium no-underline bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              <span>📄</span> View Landing Page
            </Link>
          )}
          {project.id === "guildry" && (
            <a
              href="https://guildry.paulb.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium no-underline bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors"
            >
              <span>↗</span> Open App
            </a>
          )}
        </div>
      </div>

      {/* Thesis & Problem */}
      <section className="mb-12">
        <div
          className="rounded-xl border-2 p-6 mb-6"
          style={{
            borderColor: `${project.color}40`,
            backgroundColor: `${project.color}05`,
          }}
        >
          <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] mb-3 m-0" style={{ color: project.color }}>
            Thesis
          </h2>
          <p className="text-lg text-slate-700 m-0 leading-relaxed">
            {project.thesis}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 p-6 bg-white">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-3 m-0">
            The Problem
          </h2>
          <p className="text-sm text-slate-600 whitespace-pre-line m-0 leading-relaxed">
            {project.problem}
          </p>
        </div>
      </section>

      {/* Implementation Approaches */}
      <section className="mb-12">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-6">
          Implementation Approaches
        </h2>
        <div className="space-y-6">
          {project.approaches.map((approach, i) => (
            <ApproachCard
              key={i}
              approach={approach}
              index={i}
              color={project.color}
            />
          ))}
        </div>
      </section>

      {/* Test Plan */}
      <section className="mb-12">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-6">
          Validation Plan
        </h2>

        {/* Hypothesis */}
        <div
          className="rounded-xl border-2 p-6 mb-6"
          style={{
            borderColor: `${project.color}40`,
            backgroundColor: `${project.color}05`,
          }}
        >
          <h3 className="font-mono text-[11px] uppercase mb-2 m-0" style={{ color: project.color }}>
            Hypothesis to Test
          </h3>
          <p className="text-lg text-slate-700 m-0 font-medium">
            {project.testPlan.hypothesis}
          </p>
        </div>

        {/* Validation Phases */}
        <div className="rounded-xl border border-slate-200 p-6 bg-white mb-6">
          <h3 className="font-mono text-[11px] uppercase text-slate-500 mb-6 m-0">
            Validation Phases
          </h3>
          <div>
            {project.testPlan.validation.map((phase, i) => (
              <ValidationPhase
                key={i}
                phase={phase}
                index={i}
                color={project.color}
              />
            ))}
          </div>
        </div>

        {/* Kill Criteria */}
        <div className="rounded-xl border border-red-200 p-6 bg-red-50">
          <h3 className="font-mono text-[11px] uppercase text-red-600 mb-4 m-0">
            Kill Criteria
          </h3>
          <p className="text-xs text-slate-600 mb-4 m-0">
            Stop and move on if any of these become true:
          </p>
          <ul className="text-sm text-slate-700 m-0 p-0 list-none space-y-2">
            {project.testPlan.killCriteria.map((criteria, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">✕</span>
                <span>{criteria}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Works Well With */}
      {SYNERGIES[project.id] && SYNERGIES[project.id].length > 0 && (
        <section className="mb-12">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-6">
            Works Well With
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {SYNERGIES[project.id].map((synergy) => {
              const meta = PROJECT_META[synergy.id];
              return (
                <Link
                  key={synergy.id}
                  href={`/projects/${synergy.id}`}
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all no-underline group"
                >
                  <span className="text-2xl">{meta?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {meta?.name}
                    </div>
                    <p className="text-xs text-slate-500 m-0 leading-relaxed">
                      {synergy.reason}
                    </p>
                  </div>
                  <span className="text-slate-400 group-hover:text-indigo-400 transition-colors">→</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-slate-200 flex justify-between items-center">
        <Link
          href="/projects"
          className="font-mono text-[10px] text-slate-500 no-underline hover:text-slate-700"
        >
          ← Back to Projects
        </Link>
        <Link
          href="/methodology"
          className="font-mono text-[10px] text-slate-500 no-underline hover:text-slate-700"
        >
          View Methodology →
        </Link>
      </footer>
    </div>
  );
}
