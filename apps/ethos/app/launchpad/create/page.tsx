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
    // Navigate to the build progress page
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
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-400">Loading proposal...</p>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-red-400 mb-4">{error || "Something went wrong"}</p>
        <button
          onClick={() => router.push("/launchpad")}
          className="text-violet-400 hover:text-violet-300"
        >
          ← Back to Launchpad
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.push("/launchpad")}
            className="text-slate-400 hover:text-white text-sm mb-2 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: proposal.color + "20" }}
            >
              {proposal.icon}
            </span>
            {proposal.name}
          </h1>
          <p className="text-slate-400 mt-1">Review and customize your proposal</p>
        </div>
        <button
          onClick={handleLaunch}
          disabled={launching}
          className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-violet-500 hover:to-cyan-500 transition-all disabled:opacity-50 flex items-center gap-2"
        >
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
        </button>
      </div>

      {/* Original Idea */}
      {stored && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 mb-6">
          <p className="text-slate-500 text-sm mb-1">Original idea</p>
          <p className="text-slate-300">&ldquo;{stored.idea}&rdquo;</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["details", "landing", "infra"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? "bg-violet-600 text-white"
                : "bg-slate-800/50 text-slate-400 hover:text-white"
            }`}
          >
            {tab === "details" && "📋 App Details"}
            {tab === "landing" && "🎨 Landing Page"}
            {tab === "infra" && "⚙️ Infrastructure"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        {activeTab === "details" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  App Name
                </label>
                <input
                  type="text"
                  value={proposal.name}
                  onChange={(e) => updateProposal("name", e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  URL Slug
                </label>
                <div className="flex items-center">
                  <span className="text-slate-500 mr-1">https://</span>
                  <input
                    type="text"
                    value={proposal.slug}
                    onChange={(e) =>
                      updateProposal(
                        "slug",
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
                      )
                    }
                    className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <span className="text-slate-500 ml-1">.theaiethos.com</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={proposal.tagline}
                onChange={(e) => updateProposal("tagline", e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                maxLength={60}
              />
              <p className="text-slate-500 text-xs mt-1">
                {proposal.tagline.length}/60 characters
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Icon
                </label>
                <input
                  type="text"
                  value={proposal.icon}
                  onChange={(e) => updateProposal("icon", e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white text-2xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                  maxLength={2}
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Brand Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={proposal.color}
                    onChange={(e) => updateProposal("color", e.target.value)}
                    className="h-10 w-16 bg-slate-900/50 border border-slate-600 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={proposal.color}
                    onChange={(e) => updateProposal("color", e.target.value)}
                    className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={proposal.meta.title}
                onChange={(e) => updateProposal("meta.title", e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                maxLength={60}
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                SEO Description
              </label>
              <textarea
                value={proposal.meta.description}
                onChange={(e) => updateProposal("meta.description", e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                rows={2}
                maxLength={160}
              />
              <p className="text-slate-500 text-xs mt-1">
                {proposal.meta.description.length}/160 characters
              </p>
            </div>
          </div>
        )}

        {activeTab === "landing" && (
          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Headline
              </label>
              <input
                type="text"
                value={proposal.landing.headline}
                onChange={(e) => updateProposal("landing.headline", e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white text-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Problem Statement
              </label>
              <textarea
                value={proposal.landing.problem}
                onChange={(e) => updateProposal("landing.problem", e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Solution Statement
              </label>
              <textarea
                value={proposal.landing.solution}
                onChange={(e) => updateProposal("landing.solution", e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                rows={2}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-white text-sm font-medium">Features</label>
                <button
                  onClick={addFeature}
                  className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1"
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
                    className="flex gap-3 p-3 bg-slate-900/30 rounded-lg border border-slate-700/50"
                  >
                    <input
                      type="text"
                      value={feature.icon}
                      onChange={(e) => updateFeature(i, "icon", e.target.value)}
                      className="w-12 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      maxLength={2}
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => updateFeature(i, "title", e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Feature title"
                      />
                      <input
                        type="text"
                        value={feature.description}
                        onChange={(e) => updateFeature(i, "description", e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Feature description"
                      />
                    </div>
                    <button
                      onClick={() => removeFeature(i)}
                      className="text-slate-500 hover:text-red-400 self-start p-1"
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
              <label className="block text-white text-sm font-medium mb-2">
                Call to Action Button
              </label>
              <input
                type="text"
                value={proposal.landing.cta}
                onChange={(e) => updateProposal("landing.cta", e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        )}

        {activeTab === "infra" && (
          <div className="space-y-4">
            <p className="text-slate-400 text-sm mb-4">
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
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  item.disabled
                    ? "bg-slate-800/20 border-slate-700/30 cursor-not-allowed opacity-60"
                    : proposal.infrastructure[item.key as keyof typeof proposal.infrastructure]
                    ? "bg-violet-600/10 border-violet-500/50"
                    : "bg-slate-800/30 border-slate-700/50 hover:border-slate-600"
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
                  className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-900 text-violet-600 focus:ring-violet-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-white font-medium">{item.title}</span>
                    {item.disabled && (
                      <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">
                        {item.disabledReason}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Preview Card */}
      <div className="mt-8 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Preview</h3>
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: proposal.color + "10" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{ backgroundColor: proposal.color + "30" }}
            >
              {proposal.icon}
            </span>
            <div>
              <h4 className="text-white font-semibold">{proposal.name}</h4>
              <p className="text-slate-400 text-sm">{proposal.tagline}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
              {proposal.slug}.theaiethos.com
            </span>
            {proposal.infrastructure.auth && (
              <span className="text-xs px-2 py-1 rounded bg-violet-600/20 text-violet-300">
                🔐 Auth
              </span>
            )}
            {proposal.infrastructure.feedback && (
              <span className="text-xs px-2 py-1 rounded bg-cyan-600/20 text-cyan-300">
                💬 Feedback
              </span>
            )}
            {proposal.infrastructure.onboarding && (
              <span className="text-xs px-2 py-1 rounded bg-emerald-600/20 text-emerald-300">
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
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      }
    >
      <ProposalEditorContent />
    </Suspense>
  );
}
