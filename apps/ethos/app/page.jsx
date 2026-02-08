"use client";

import Link from "next/link";

const STATS = [
  { value: 2, label: "Building", color: "#0ea5e9" },
  { value: 9, label: "Evaluating", color: "#6366f1" },
  { value: 0, label: "Shipped", color: "#22c55e" },
  { value: 5, label: "Killed", color: "#ef4444" },
];

const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/methodology", label: "Method" },
  { href: "/log", label: "Log" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-sky-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-slate-900 no-underline tracking-tight text-sm sm:text-base">
            the ai ethos
          </Link>
          <div className="flex items-center gap-4 sm:gap-8">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs sm:text-sm text-slate-500 hover:text-slate-900 no-underline transition-colors hidden sm:block"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/projects"
              className="text-xs sm:text-sm text-slate-500 hover:text-slate-900 no-underline transition-colors sm:hidden"
            >
              Projects
            </Link>
            <a
              href="https://guildry.paulb.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-sky-500 text-white no-underline hover:bg-sky-600 transition-colors shadow-sm shadow-sky-200"
            >
              Guildry ↗
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-sky-100/80 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-40 left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute top-60 right-20 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sky-200 shadow-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span className="text-sm text-slate-600">Building Guildry + Launchpad</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6">
              Ship fast.
              <br />
              <span className="text-gradient">Learn faster.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto px-2">
              A one-person AI product incubator. Build tools that solve real problems,
              kill what doesn't work, double down on what does.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold no-underline bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
              >
                View Projects
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/methodology"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold no-underline bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-8 sm:py-12 border-y border-sky-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-3xl sm:text-4xl font-bold mb-1"
                  style={{ color: stat.value > 0 ? stat.color : '#cbd5e1' }}
                >
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Projects */}
      <section className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3">Currently Building</h2>
            <p className="text-sm sm:text-base text-slate-600">What's getting attention right now</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Guildry Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-35 transition-opacity" />
              <div className="relative bg-white rounded-2xl border border-teal-200 p-5 sm:p-6 shadow-xl shadow-teal-100/50 h-full flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-lg shadow-lg shadow-teal-200 flex-shrink-0">
                      📐
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Guildry</h3>
                      <p className="text-xs text-slate-500">Project intelligence</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-100 text-teal-700 border border-teal-200">
                    Phase 1
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed flex-1">
                  Scope, staff, deliver, and learn from every project. A system that gets smarter with each project you close.
                </p>
                <div className="flex gap-2">
                  <Link href="/projects/guildry" className="flex-1 text-center px-4 py-2.5 rounded-lg text-xs font-semibold no-underline bg-slate-900 text-white hover:bg-slate-800 transition-colors">
                    View Plan
                  </Link>
                  <a href="https://guildry.paulb.pro" target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-4 py-2.5 rounded-lg text-xs font-semibold no-underline bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors">
                    Open ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Launchpad Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-35 transition-opacity" />
              <div className="relative bg-white rounded-2xl border border-blue-200 p-5 sm:p-6 shadow-xl shadow-blue-100/50 h-full flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-lg shadow-lg shadow-blue-200 flex-shrink-0">
                      🚀
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Launchpad</h3>
                      <p className="text-xs text-slate-500">Idea validation</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700 border border-blue-200">
                    Live
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed flex-1">
                  Landing pages for each idea. Collect waitlist signups as keep/kill signals. Ship, test, learn, repeat.
                </p>
                <div className="flex gap-2">
                  <Link href="/projects/launchpad" className="flex-1 text-center px-4 py-2.5 rounded-lg text-xs font-semibold no-underline bg-slate-900 text-white hover:bg-slate-800 transition-colors">
                    View Plan
                  </Link>
                  <Link href="/landing/smart-cms" className="flex-1 text-center px-4 py-2.5 rounded-lg text-xs font-semibold no-underline bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors">
                    See Example
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline Preview */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-white to-sky-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3">The Pipeline</h2>
            <p className="text-sm sm:text-base text-slate-600">9 ideas in evaluation, ready to test</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              { icon: "🌐", name: "Smart CMS", desc: "Site migration" },
              { icon: "📋", name: "Changelog", desc: "Auto changelogs" },
              { icon: "🎨", name: "Brief", desc: "Creative briefs" },
              { icon: "🎙️", name: "Intake", desc: "Client discovery" },
            ].map((project, i) => (
              <Link
                key={i}
                href={`/projects/${project.name.toLowerCase().replace(' ', '-')}`}
                className="group p-4 sm:p-5 rounded-xl bg-white border border-slate-200 no-underline hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100/50 transition-all"
              >
                <div className="text-xl sm:text-2xl mb-2">{project.icon}</div>
                <div className="font-semibold text-sm sm:text-base text-slate-900 group-hover:text-sky-600 transition-colors">{project.name}</div>
                <div className="text-xs sm:text-sm text-slate-500">{project.desc}</div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700 no-underline"
            >
              View all projects
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { href: "/methodology", icon: "⚙️", title: "Methodology", desc: "Frameworks for evaluating, building, and killing projects" },
              { href: "/log", icon: "📓", title: "Log", desc: "Decisions, learnings, and notes from the journey" },
              { href: "/stack", icon: "🔧", title: "Stack", desc: "Tools and technologies powering the incubator" },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="group p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 no-underline hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100/50 transition-all"
              >
                <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">{link.icon}</div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1 sm:mb-2 group-hover:text-sky-600 transition-colors">
                  {link.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 border-t border-sky-100 bg-sky-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">theaiethos.com</div>
              <div className="text-xs sm:text-sm text-slate-500">Solo AI Product Incubator</div>
            </div>
            <div className="text-xs sm:text-sm text-slate-400">Feb 2026</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
