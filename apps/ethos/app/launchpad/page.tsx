"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EXAMPLE_IDEAS = [
  "A tool that reminds freelancers to follow up on unpaid invoices",
  "An app that helps remote teams do async standups",
  "A habit tracker that uses AI to suggest improvements",
  "A tool that summarizes Slack channels for people returning from PTO",
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
      // Navigate to proposal editor with the generated proposal
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
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          Launch your app idea
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            in minutes, not months
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Describe your app idea and Launchpad will set up authentication,
          landing pages, feedback collection, onboarding flows, and more—all
          wired up and ready to customize.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-8">
        <form onSubmit={handleSubmit}>
          <label className="block text-white text-lg font-medium mb-3">
            What&apos;s your app idea?
          </label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your app in a sentence or two..."
            className="w-full h-32 bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none text-lg"
            disabled={isLoading}
          />

          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={!idea.trim() || isLoading}
            className="mt-4 w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-violet-500 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating proposal...
              </>
            ) : (
              <>
                <span>Generate Proposal</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Example Ideas */}
      <div className="mb-16">
        <p className="text-slate-500 text-sm mb-3 text-center">
          Or try one of these examples:
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {EXAMPLE_IDEAS.map((example, i) => (
            <button
              key={i}
              onClick={() => handleExampleClick(example)}
              className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-slate-400 text-sm hover:bg-slate-700/50 hover:text-white transition-all"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="border-t border-slate-700/50 pt-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-violet-600/20 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
              💡
            </div>
            <h3 className="text-white font-semibold mb-2">1. Describe your idea</h3>
            <p className="text-slate-400 text-sm">
              Tell us what you want to build in plain English. No technical
              details needed.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-cyan-600/20 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
              ✏️
            </div>
            <h3 className="text-white font-semibold mb-2">2. Review & customize</h3>
            <p className="text-slate-400 text-sm">
              We generate a proposal with name, landing page content, and
              infrastructure choices. Edit anything.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
              🚀
            </div>
            <h3 className="text-white font-semibold mb-2">3. Launch instantly</h3>
            <p className="text-slate-400 text-sm">
              Hit launch and watch as we generate your app, deploy it, and give
              you live URLs.
            </p>
          </div>
        </div>
      </div>

      {/* What you get */}
      <div className="border-t border-slate-700/50 pt-16 mt-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          What you get
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              icon: "🎨",
              title: "Landing Page",
              desc: "Beautiful, conversion-optimized landing page with your branding",
            },
            {
              icon: "🔐",
              title: "Authentication",
              desc: "Clerk-powered auth with social logins, ready to go",
            },
            {
              icon: "💬",
              title: "Feedback Widget",
              desc: "Collect user feedback from day one",
            },
            {
              icon: "📚",
              title: "Auto-generated Docs",
              desc: "Documentation that stays up to date",
            },
            {
              icon: "🎯",
              title: "Onboarding Flow",
              desc: "Guide users through your app with a wizard",
            },
            {
              icon: "📊",
              title: "OG Images",
              desc: "Dynamic social share images for marketing",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="text-white font-medium">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
