/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: '#ffffff',
          1: '#f8fafc',
          2: '#f1f5f9',
          3: '#e2e8f0',
          4: '#cbd5e1',
        },
        accent: {
          incubator: '#0d9488',   // teal-600
          workflow: '#4f46e5',    // indigo-600
          ecosystem: '#d97706',   // amber-600
          primary: '#0d9488',
          secondary: '#4f46e5',
        },
        text: {
          primary: '#0f172a',
          secondary: '#334155',
          muted: '#64748b',
          faint: '#94a3b8',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
