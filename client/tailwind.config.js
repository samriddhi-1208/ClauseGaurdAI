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
        dark: {
          primary: '#090D16',   // Deep Slate / Navy - main application background
          secondary: '#0B101D', // Dark Navy - secondary sections / sidebar
          card: '#111827',      // Slate - panels / cards / modals
          border: '#1E293B',    // Slate Border - card borders / dividers
        },
        accent: {
          DEFAULT: '#2563EB',   // Professional Blue - primary buttons / active nav
          hover: '#3B82F6',     // Professional Blue Hover
        },
        brand: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#3B82F6',
          subtle: '#EFF6FF',
        },
        navy: {
          950: '#090D16',
          900: '#0B101D',
          850: '#111827',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
