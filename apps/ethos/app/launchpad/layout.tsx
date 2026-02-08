import type { Metadata } from "next";
import "./launchpad.css";

export const metadata: Metadata = {
  title: "Launchpad | Ship Your App Idea in Minutes",
  description:
    "Turn your app idea into a fully-configured prototype in minutes. Launchpad sets up authentication, landing pages, feedback collection, onboarding, and more.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://launchpad.theaiethos.com",
    title: "Launchpad | Ship Your App Idea in Minutes",
    description:
      "Turn your app idea into a fully-configured prototype in minutes.",
    siteName: "Launchpad",
  },
};

export default function LaunchpadLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="launchpad-app">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/launchpad" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
              <span className="text-lg">🚀</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">Launchpad</span>
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <span className="text-sm">🚀</span>
              </div>
              <div>
                <div className="font-medium text-white/90">Launchpad</div>
                <div className="text-sm text-white/50">Ship ideas faster</div>
              </div>
            </div>
            <a
              href="https://theaiethos.com"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Part of The AI Ethos →
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
