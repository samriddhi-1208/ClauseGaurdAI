/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#0B1120',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
        },
        brand: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#3B82F6',
          subtle: '#EFF6FF',
        },
        violet: {
          accent: '#7C3AED',
          light: '#8B5CF6',
          subtle: '#F5F3FF',
        },
        legal: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#64748B',
          dark: '#0F172A',
        }
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'premium': '0 20px 40px -15px rgba(37, 99, 235, 0.15)',
      }
    },
  },
  plugins: [],
}
