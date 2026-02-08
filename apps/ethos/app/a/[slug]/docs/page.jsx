import { notFound } from "next/navigation";
import { getApp } from "@/lib/launchpad-apps";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const app = getApp(params.slug);
  if (!app) return { title: "Not Found" };

  return {
    title: `${app.name} Documentation`,
    description: `Setup guide and documentation for ${app.name}`,
  };
}

export default function DocsPage({ params }) {
  const app = getApp(params.slug);

  if (!app) {
    notFound();
  }

  const { infrastructure } = app;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/a/${params.slug}`}
              className="text-slate-400 hover:text-slate-600"
            >
              ← Back
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xl">{app.icon || "📚"}</span>
              <span className="font-semibold text-slate-900">
                {app.name} Docs
              </span>
            </div>
          </div>
          <Link
            href={`/a/${params.slug}/app`}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: app.color }}
          >
            Open App
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <span
            className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-4"
            style={{ backgroundColor: `${app.color}15`, color: app.color }}
          >
            Documentation
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {app.name} Setup Guide
          </h1>
          <p className="text-lg text-slate-600">
            Everything you need to know to get started with {app.name}.
          </p>
        </div>

        {/* Quick Info */}
        <section className="mb-12 p-6 bg-slate-50 rounded-xl">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            Quick Info
          </h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500">App URL</dt>
              <dd className="font-mono text-slate-900">
                {params.slug}.theaiethos.com
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Status</dt>
              <dd>
                <span className="inline-flex items-center gap-1 text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {app.status || "Active"}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Created</dt>
              <dd className="text-slate-900">
                {app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Audience</dt>
              <dd className="text-slate-900">{app.audience || "—"}</dd>
            </div>
          </dl>
        </section>

        {/* Infrastructure */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Infrastructure
          </h2>
          <p className="text-slate-600 mb-6">
            The following components are configured and ready to use:
          </p>

          <div className="space-y-4">
            {/* Auth */}
            <div
              className={`p-4 rounded-lg border ${infrastructure?.auth ? "border-green-200 bg-green-50" : "border-slate-200 bg-slate-50"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-slate-900">
                  🔐 Authentication (Clerk)
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${infrastructure?.auth ? "bg-green-200 text-green-800" : "bg-slate-200 text-slate-600"}`}
                >
                  {infrastructure?.auth ? "Enabled" : "Disabled"}
                </span>
              </div>
              {infrastructure?.auth && (
                <p className="text-sm text-slate-600">
                  User authentication is ready. The /app route is protected and
                  requires sign-in. Clerk handles user management, sign-up, and
                  sign-in flows.
                </p>
              )}
            </div>

            {/* Feedback */}
            <div
              className={`p-4 rounded-lg border ${infrastructure?.feedback ? "border-green-200 bg-green-50" : "border-slate-200 bg-slate-50"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-slate-900">
                  💬 Feedback Widget
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${infrastructure?.feedback ? "bg-green-200 text-green-800" : "bg-slate-200 text-slate-600"}`}
                >
                  {infrastructure?.feedback ? "Enabled" : "Disabled"}
                </span>
              </div>
              {infrastructure?.feedback && (
                <p className="text-sm text-slate-600">
                  A floating feedback button appears on all pages. Users can
                  submit feedback which is collected in the shared feedback
                  dashboard.
                </p>
              )}
            </div>

            {/* Onboarding */}
            <div
              className={`p-4 rounded-lg border ${infrastructure?.onboarding ? "border-green-200 bg-green-50" : "border-slate-200 bg-slate-50"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-slate-900">
                  🚀 Onboarding Flow
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${infrastructure?.onboarding ? "bg-green-200 text-green-800" : "bg-slate-200 text-slate-600"}`}
                >
                  {infrastructure?.onboarding ? "Enabled" : "Disabled"}
                </span>
              </div>
              {infrastructure?.onboarding && (
                <p className="text-sm text-slate-600">
                  A step-by-step onboarding wizard guides new users through
                  setup. Customize the steps in the onboarding configuration.
                </p>
              )}
            </div>

            {/* Payments */}
            <div
              className={`p-4 rounded-lg border ${infrastructure?.payments ? "border-green-200 bg-green-50" : "border-slate-200 bg-slate-50"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-slate-900">
                  💳 Payments (Stripe)
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${infrastructure?.payments ? "bg-green-200 text-green-800" : "bg-slate-200 text-slate-600"}`}
                >
                  {infrastructure?.payments ? "Enabled" : "Coming Soon"}
                </span>
              </div>
              {infrastructure?.payments ? (
                <p className="text-sm text-slate-600">
                  Stripe checkout and subscription management is configured.
                  Webhooks handle payment events automatically.
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Payment integration will be available in a future update.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Next Steps
          </h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                style={{ backgroundColor: app.color }}
              >
                1
              </span>
              <div>
                <h3 className="font-medium text-slate-900">
                  Build your features
                </h3>
                <p className="text-sm text-slate-600">
                  The infrastructure is ready. Add your app-specific features to
                  the /app route.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                style={{ backgroundColor: app.color }}
              >
                2
              </span>
              <div>
                <h3 className="font-medium text-slate-900">
                  Customize onboarding
                </h3>
                <p className="text-sm text-slate-600">
                  Edit the onboarding steps to guide users through your specific
                  setup flow.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                style={{ backgroundColor: app.color }}
              >
                3
              </span>
              <div>
                <h3 className="font-medium text-slate-900">
                  Drive traffic to landing page
                </h3>
                <p className="text-sm text-slate-600">
                  Share {params.slug}.theaiethos.com to collect waitlist signups
                  and validate demand.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            Built with{" "}
            <Link href="https://theaiethos.com" className="text-slate-700 hover:underline">
              Launchpad
            </Link>{" "}
            by AI Ethos
          </p>
        </footer>
      </div>
    </div>
  );
}
