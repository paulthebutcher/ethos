"use client";

import { notFound } from "next/navigation";
import { getApp } from "@/lib/launchpad-apps";
import Link from "next/link";
import { useState, useEffect } from "react";

// This is the auth-gated app shell
// In production, wrap with Clerk's SignedIn/SignedOut components

export default function AppShell({ params }) {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Client-side app lookup (in production, this would come from auth context)
    const appConfig = getApp(params.slug);
    setApp(appConfig);
    setLoading(false);
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full" />
      </div>
    );
  }

  if (!app) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* App Header */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">{app.icon || "🚀"}</span>
            <span className="font-semibold text-slate-900">{app.name}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-white"
              style={{ backgroundColor: app.color }}
            >
              <span>🏠</span>
              Dashboard
            </a>
            {/* Placeholder nav items - actual features would be built per-app */}
            <a
              href="#"
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <span>📊</span>
              Analytics
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <span>⚙️</span>
              Settings
            </a>
          </div>
        </nav>

        {/* User / Sign Out */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                User Name
              </p>
              <p className="text-xs text-slate-500 truncate">user@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
            <div className="flex items-center gap-3">
              <Link
                href={`/a/${params.slug}/docs`}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Docs
              </Link>
              <Link
                href={`/a/${params.slug}`}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                ← Back to site
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {/* Onboarding Card (shown when app.infrastructure.onboarding is true) */}
          {app.infrastructure?.onboarding && (
            <div
              className="mb-6 rounded-xl p-6 text-white"
              style={{ backgroundColor: app.color }}
            >
              <h2 className="text-xl font-semibold mb-2">
                Welcome to {app.name}! 👋
              </h2>
              <p className="text-white/80 mb-4">
                Let&apos;s get you set up in just a few steps.
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
                  Start Setup →
                </button>
                <button className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="text-4xl mb-4">🛠️</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              App Shell Ready
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              This is the authenticated app area for {app.name}. The
              infrastructure is wired up — now build your features!
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              {app.infrastructure?.auth && (
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                  ✓ Auth Ready
                </span>
              )}
              {app.infrastructure?.feedback && (
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                  ✓ Feedback Widget
                </span>
              )}
              {app.infrastructure?.onboarding && (
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                  ✓ Onboarding Flow
                </span>
              )}
              {app.infrastructure?.payments && (
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                  ✓ Payments
                </span>
              )}
            </div>
          </div>

          {/* Quick Stats Placeholder */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "Total Users", value: "—", icon: "👥" },
              { label: "This Week", value: "—", icon: "📈" },
              { label: "Feedback", value: "—", icon: "💬" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <span>{stat.icon}</span>
                  {stat.label}
                </div>
                <div className="text-2xl font-semibold text-slate-900">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Feedback Widget */}
      {app.infrastructure?.feedback && (
        <div className="fixed bottom-4 right-4">
          <button
            className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110"
            style={{ backgroundColor: app.color }}
            title="Send Feedback"
          >
            💬
          </button>
        </div>
      )}
    </div>
  );
}
