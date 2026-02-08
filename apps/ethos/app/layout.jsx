import "./globals.css";

export const metadata = {
  title: "Solo AI Product Incubator",
  description: "A system for continuously generating, testing, and scaling AI-powered tools.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
