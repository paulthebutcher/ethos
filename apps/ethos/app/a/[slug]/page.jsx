import { notFound } from "next/navigation";
import { getApp } from "@/lib/launchpad-apps";
import Link from "next/link";

// Dynamic metadata generation
export async function generateMetadata({ params }) {
  const app = getApp(params.slug);
  if (!app) return { title: "Not Found" };

  return {
    title: app.meta?.title || `${app.name} - ${app.tagline}`,
    description: app.meta?.description || app.description,
    openGraph: {
      title: app.meta?.title || app.name,
      description: app.meta?.description || app.description,
      images: app.meta?.ogImage ? [{ url: app.meta.ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: app.meta?.title || app.name,
      description: app.meta?.description || app.description,
    },
  };
}

export default function AppLandingPage({ params }) {
  const app = getApp(params.slug);

  if (!app) {
    notFound();
  }

  const { landing, infrastructure } = app;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{app.icon || "🚀"}</span>
            <span className="font-semibold text-slate-900">{app.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/a/${params.slug}/app`}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Sign In
            </Link>
            <a
              href="#waitlist"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: app.color }}
            >
              {landing?.cta || "Get Started"}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span
            className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-6"
            style={{ backgroundColor: `${app.color}15`, color: app.color }}
          >
            {app.audience || "For everyone"}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {landing?.headline || app.tagline}
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            {app.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#waitlist"
              className="px-8 py-3 text-white font-medium rounded-lg transition-colors text-center"
              style={{ backgroundColor: app.color }}
            >
              {landing?.cta || "Join the Waitlist"}
            </a>
            <Link
              href={`/a/${params.slug}/docs`}
              className="px-8 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      {(landing?.problem || landing?.solution) && (
        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            {landing?.problem && (
              <div>
                <h2 className="text-sm font-medium text-red-600 uppercase tracking-wide mb-3">
                  The Problem
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {landing.problem}
                </p>
              </div>
            )}
            {landing?.solution && (
              <div>
                <h2
                  className="text-sm font-medium uppercase tracking-wide mb-3"
                  style={{ color: app.color }}
                >
                  The Solution
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {landing.solution}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features */}
      {landing?.features && landing.features.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
              How it works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {landing.features.map((feature, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4"
                    style={{ backgroundColor: `${app.color}15` }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Waitlist CTA */}
      <section id="waitlist" className="py-20 px-6 bg-slate-900">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get early access
          </h2>
          <p className="text-slate-400 mb-8">
            Join the waitlist to be first in line when we launch.
          </p>
          <form
            action={`/api/waitlist?app=${params.slug}`}
            method="POST"
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              className="flex-1 px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-slate-500"
            />
            <button
              type="submit"
              className="px-6 py-3 font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: app.color }}
            >
              {landing?.cta || "Join Waitlist"}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-100">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span>{app.icon || "🚀"}</span>
            <span>{app.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="https://theaiethos.com" className="hover:text-slate-700">
              An AI Ethos Project
            </Link>
          </div>
        </div>
      </footer>

      {/* Feedback Widget Placeholder */}
      {infrastructure?.feedback && (
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
