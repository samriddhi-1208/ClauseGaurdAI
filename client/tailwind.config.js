/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      colors: {
        executive: {
          navy: '#0B132B',        // Deep corporate navy
          sidebar: '#0F172A',     // Slate-900 sidebar surface
          'sidebar-border': '#1E293B',
          canvas: '#F8FAFC',      // Crisp light workspace background
          surface: '#FFFFFF',     // Pure white card & panel surface
          'surface-subtle': '#F1F5F9', // Subtle slate surface
          border: '#E2E8F0',      // Refined light border
          'border-strong': '#CBD5E1',
          primary: '#0F172A',     // Dominant slate primary
          accent: '#1D4ED8',      // Corporate blue accent (not neon)
        },
        navy: {
          950: '#0B132B',
          900: '#0F172A',
          850: '#151F38',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(15, 23, 42, 0.07), 0 4px 6px -4px rgba(15, 23, 42, 0.05)',
        'dropdown': '0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
}
