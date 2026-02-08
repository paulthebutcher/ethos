import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Launchpad | AI Ethos",
  description:
    "Turn your app idea into a fully-configured prototype in minutes. Launchpad sets up authentication, payments, feedback, onboarding, and more.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://launchpad.theaiethos.com",
    title: "Launchpad | AI Ethos",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="text-xl font-bold text-white">Launchpad</span>
          </a>
          <nav className="flex items-center gap-6">
            <a
              href="https://theaiethos.com"
              className="text-slate-400 hover:text-white transition-colors"
            >
              AI Ethos
            </a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-500 text-sm">
          <p>Built with Launchpad by AI Ethos</p>
        </div>
      </footer>
    </div>
  );
}
