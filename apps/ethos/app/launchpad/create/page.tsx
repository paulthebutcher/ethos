"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Proposal {
  slug: string;
  name: string;
  tagline: string;
  color: string;
  icon: string;
  landing: {
    headline: string;
    problem: string;
    solution: string;
    features: Feature[];
    cta: string;
  };
  infrastructure: {
    auth: boolean;
    feedback: boolean;
    onboarding: boolean;
    payments: boolean;
    analytics: boolean;
  };
  meta: {
    title: string;
    description: string;
  };
}

interface StoredProposal {
  id: string;
  idea: string;
  proposal: Proposal;
  createdAt: string;
  status: string;
}

function ProposalEditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stored, setStored] = useState<StoredProposal | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [launching, setLaunching] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "landing" | "infra">(
    "details"
  );

  useEffect(() => {
    if (!id) {
      router.push("/launchpad");
      return;
    }

    fetch(`/launchpad/api/generate-proposal?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Proposal not found");
        return res.json();
      })
      .then((data) => {
        setStored(data);
        setProposal(data.proposal);
        setLoading(false);
      })
      .catch(() => {
        setError("Proposal not found. Please try again.");
        setLoading(false);
      });
  }, [id, router]);

  const handleLaunch = async () => {
    if (!proposal || !id) return;

    setLaunching(true);
    router.push(`/launchpad/create/build?id=${id}`);
  };

  const updateProposal = (path: string, value: any) => {
    if (!proposal) return;

    const updated = { ...proposal };
    const parts = path.split(".");
    let current: any = updated;

    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
    setProposal(updated);
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    if (!proposal) return;

    const updated = { ...proposal };
    updated.landing.features = [...updated.landing.features];
    updated.landing.features[index] = {
      ...updated.landing.features[index],
      [field]: value,
    };
    setProposal(updated);
  };

  const addFeature = () => {
    if (!proposal) return;

    const updated = { ...proposal };
    updated.landing.features = [
      ...updated.landing.features,
      { icon: "✨", title: "New Feature", description: "Describe this feature" },
    ];
    setProposal(updated);
  };

  const removeFeature = (index: number) => {
    if (!proposal) return;

    const updated = { ...proposal };
    updated.landing.features = updated.landing.features.filter(
      (_, i) => i !== index
    );
    setProposal(updated);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-violet-500/30 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-white/60 mt-6">Loading proposal...</p>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
          <span className="text-3xl">😕</span>
        </div>
        <p className="text-red-400 text-lg mb-2">{error || "Something went wrong"}</p>
        <p className="text-white/40 mb-6">The proposal you&apos;re looking for couldn&apos;t be found.</p>
        <button
          onClick={() => router.push("/launchpad")}
          className="text-violet-400 hover:text-violet-300 font-medium flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Launchpad
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
        <div>
          <button
            onClick={() => router.push("/launchpad")}
            className="text-white/40 hover:text-white text-sm mb-4 flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
              style={{
                backgroundColor: proposal.color + "20",
                boxShadow: `0 8px 32px ${proposal.color}20`
              }}
            >
              {proposal.icon}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {proposal.name}
              </h1>
              <p className="text-white/50 mt-1">Review and customize your proposal</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLaunch}
          disabled={launching}
          className="group relative bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold py-3.5 px-8 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex items-center gap-2">
            {launching ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Launching...
              </>
            ) : (
              <>
                <span>🚀</span>
                Launch App
              </>
            )}
          </span>
        </button>
      </div>

      {/* Original Idea */}
      {stored && (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 mb-8 backdrop-blur-sm">
          <p className="text-white/40 text-sm mb-1.5 font-medium">Original idea</p>
          <p className="text-white/80 leading-relaxed">&ldquo;{stored.idea}&rdquo;</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(["details", "landing", "infra"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === tab
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25"
                : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab === "details" && "📋 App Details"}
            {tab === "landing" && "🎨 Landing Page"}
            {tab === "infra" && "⚙️ Infrastructure"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        {activeTab === "details" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2.5">
                  App Name
                </label>
                <input
                  type="text"
                  value={proposal.name}
                  onChange={(e) => updateProposal("name", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2.5">
                  URL Slug
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-white/30 text-sm">https://</span>
                  <input
                    type="text"
                    value={proposal.slug}
                    onChange={(e) =>
                      updateProposal(
                        "slug",
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
                      )
                    }
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                  <span className="text-white/30 text-sm">.theaiethos.com</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2.5">
                Tagline
              </label>
              <input
                type="text"
                value={proposal.tagline}
                onChange={(e) => updateProposal("tagline", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                maxLength={60}
              />
              <p className="text-white/30 text-xs mt-2">
                {proposal.tagline.length}/60 characters
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2.5">
                  Icon
                </label>
                <input
                  type="text"
                  value={proposal.icon}
                  onChange={(e) => updateProposal("icon", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-2xl text-center focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  maxLength={2}
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2.5">
                  Brand Color
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={proposal.color}
                    onChange={(e) => updateProposal("color", e.target.value)}
                    className="h-12 w-16 bg-white/5 border border-white/10 rounded-xl cursor-pointer"
                  />
                  <input
                    type="text"
                    value={proposal.color}
                    onChange={(e) => updateProposal("color", e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2.5">
                SEO Title
              </label>
              <input
                type="text"
                value={proposal.meta.title}
                onChange={(e) => updateProposal("meta.title", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                maxLength={60}
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2.5">
                SEO Description
              </label>
              <textarea
                value={proposal.meta.description}
                onChange={(e) => updateProposal("meta.description", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                rows={3}
                maxLength={160}
              />
              <p className="text-white/30 text-xs mt-2">
                {proposal.meta.description.length}/160 characters
              </p>
            </div>
          </div>
        )}

        {activeTab === "landing" && (
          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2.5">
                Headline
              </label>
              <input
                type="text"
                value={proposal.landing.headline}
                onChange={(e) => updateProposal("landing.headline", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2.5">
                Problem Statement
              </label>
              <textarea
                value={proposal.landing.problem}
                onChange={(e) => updateProposal("landing.problem", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2.5">
                Solution Statement
              </label>
              <textarea
                value={proposal.landing.solution}
                onChange={(e) => updateProposal("landing.solution", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                rows={3}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-white text-sm font-medium">Features</label>
                <button
                  onClick={addFeature}
                  className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1.5 font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Feature
                </button>
              </div>
              <div className="space-y-3">
                {proposal.landing.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/5"
                  >
                    <input
                      type="text"
                      value={feature.icon}
                      onChange={(e) => updateFeature(i, "icon", e.target.value)}
                      className="w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                      maxLength={2}
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => updateFeature(i, "title", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                        placeholder="Feature title"
                      />
                      <input
                        type="text"
                        value={feature.description}
                        onChange={(e) => updateFeature(i, "description", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                        placeholder="Feature description"
                      />
                    </div>
                    <button
                      onClick={() => removeFeature(i)}
                      className="text-white/30 hover:text-red-400 self-start p-2 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2.5">
                Call to Action Button
              </label>
              <input
                type="text"
                value={proposal.landing.cta}
                onChange={(e) => updateProposal("landing.cta", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        )}

        {activeTab === "infra" && (
          <div className="space-y-4">
            <p className="text-white/50 text-sm mb-6">
              Choose which infrastructure components to include in your app.
            </p>
            {[
              {
                key: "auth",
                title: "Authentication",
                desc: "User accounts, login, and session management with Clerk",
                icon: "🔐",
              },
              {
                key: "feedback",
                title: "Feedback Widget",
                desc: "Floating button for users to submit feedback and bug reports",
                icon: "💬",
              },
              {
                key: "onboarding",
                title: "Onboarding Flow",
                desc: "Step-by-step wizard to guide new users through your app",
                icon: "🎯",
              },
              {
                key: "payments",
                title: "Payments",
                desc: "Stripe integration for subscriptions and one-time payments",
                icon: "💳",
                disabled: true,
                disabledReason: "Coming soon",
              },
              {
                key: "analytics",
                title: "Analytics",
                desc: "Track user behavior and app usage patterns",
                icon: "📊",
                disabled: true,
                disabledReason: "Coming soon",
              },
            ].map((item) => (
              <label
                key={item.key}
                className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all ${
                  item.disabled
                    ? "bg-white/[0.01] border-white/5 cursor-not-allowed opacity-50"
                    : proposal.infrastructure[item.key as keyof typeof proposal.infrastructure]
                    ? "bg-violet-500/10 border-violet-500/30 shadow-lg shadow-violet-500/5"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    proposal.infrastructure[
                      item.key as keyof typeof proposal.infrastructure
                    ]
                  }
                  onChange={(e) =>
                    updateProposal(`infrastructure.${item.key}`, e.target.checked)
                  }
                  disabled={item.disabled}
                  className="mt-1 h-5 w-5 rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500 focus:ring-offset-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-white font-medium">{item.title}</span>
                    {item.disabled && (
                      <span className="text-xs bg-white/10 text-white/40 px-2 py-0.5 rounded-full">
                        {item.disabledReason}
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-sm mt-1.5 ml-8">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Preview Card */}
      <div className="mt-8 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
          <span className="text-lg">👁️</span>
          Preview
        </h3>
        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: proposal.color + "08",
            borderColor: proposal.color + "20"
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: proposal.color + "25" }}
            >
              {proposal.icon}
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg">{proposal.name}</h4>
              <p className="text-white/50">{proposal.tagline}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-white/60 font-medium">
              {proposal.slug}.theaiethos.com
            </span>
            {proposal.infrastructure.auth && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-violet-500/20 text-violet-300 font-medium">
                🔐 Auth
              </span>
            )}
            {proposal.infrastructure.feedback && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 font-medium">
                💬 Feedback
              </span>
            )}
            {proposal.infrastructure.onboarding && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                🎯 Onboarding
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProposalEditor() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-violet-500/30 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-white/60 mt-6">Loading...</p>
        </div>
      }
    >
      <ProposalEditorContent />
    </Suspense>
  );
}
