"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EXAMPLE_IDEAS = [
  "A tool that reminds freelancers to follow up on unpaid invoices",
  "An app that helps remote teams do async standups",
  "A habit tracker that uses AI to suggest improvements",
  "A tool that summarizes Slack channels after PTO",
];

export default function LaunchpadHome() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/launchpad/api/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate proposal");
      }

      const data = await res.json();
      router.push(`/launchpad/create?id=${data.id}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setIdea(example);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-fuchsia-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-sm text-white/70">Now in beta</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Ship your app idea
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              in minutes, not months
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Describe your idea and Launchpad generates everything: landing page,
            authentication, feedback collection, onboarding — ready to customize.
          </p>
        </div>
      </section>

      {/* Input Section */}
      <section className="relative pb-16">
        <div className="max-w-2xl mx-auto px-6">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 rounded-2xl blur-lg opacity-20" />

              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <label className="block text-white/90 font-medium mb-3">
                  What&apos;s your app idea?
                </label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your app in a sentence or two..."
                  className="w-full h-28 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none text-base transition-all"
                  disabled={isLoading}
                />

                {error && (
                  <p className="text-red-400 text-sm mt-3">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={!idea.trim() || isLoading}
                  className="mt-4 w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-violet-500 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-violet-600 disabled:hover:to-fuchsia-600 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Generating proposal...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Proposal</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Example Ideas */}
          <div className="mt-8">
            <p className="text-white/40 text-sm text-center mb-4">
              Or try one of these examples
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLE_IDEAS.map((example, i) => (
                <button
                  key={i}
                  onClick={() => handleExampleClick(example)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white/60 hover:text-white/90 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            How it works
          </h2>
          <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
            From idea to deployed prototype in three simple steps
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "💡",
                title: "Describe your idea",
                desc: "Tell us what you want to build in plain English. No technical details needed.",
              },
              {
                step: "02",
                icon: "✏️",
                title: "Review & customize",
                desc: "AI generates a proposal with name, branding, and features. Edit anything you want.",
              },
              {
                step: "03",
                icon: "🚀",
                title: "Launch instantly",
                desc: "Hit launch and watch as we deploy your app with live URLs in under a minute.",
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute -inset-px bg-gradient-to-b from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-xs font-mono text-white/30">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            What you get
          </h2>
          <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
            Everything you need to validate your idea, out of the box
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🎨", title: "Landing Page", desc: "Conversion-optimized with your branding" },
              { icon: "🔐", title: "Authentication", desc: "Clerk-powered auth with social logins" },
              { icon: "💬", title: "Feedback Widget", desc: "Collect user feedback from day one" },
              { icon: "📚", title: "Auto-generated Docs", desc: "Documentation that stays current" },
              { icon: "🎯", title: "Onboarding Flow", desc: "Guide users through your app" },
              { icon: "📊", title: "OG Images", desc: "Dynamic social share images" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] hover:border-white/15 transition-all"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-medium text-white mb-1">{item.title}</h3>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
