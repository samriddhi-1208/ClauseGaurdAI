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
      },
      colors: {
        sage: {
          50: '#F5F7F5',
          100: '#E7ECE7',
          200: '#D2DDD2',
          300: '#B4C6B5',
          400: '#91AB93',
          500: '#5B8266', // Primary soft sage green
          600: '#4D6F57',
          700: '#3D5745',
          800: '#2F4335',
          900: '#1C2D24', // Deep green text
        },
        warm: {
          bg: '#FAF9F6',       // Warm off-white
          sidebar: '#F5F4EE',  // Warm light sidebar
          card: '#FFFFFF',     // Clean white / light cream
          subtle: '#F6F5F0',   // Very light cream surface
          border: '#E8E7E0',   // Delicate warm border
          borderLight: '#F0EFE8',
        },
        charcoal: {
          900: '#1F2421',      // Dark charcoal text
          800: '#2E3430',
          700: '#47504A',
          600: '#606963',
          500: '#7B847E',      // Muted gray
          400: '#9BA39E',
        },
        lavender: {
          50: '#F7F6FA',
          100: '#EDEAF3',
          200: '#DDD8E7',
          500: '#8E84A3',      // Muted lavender
        },
        softblue: {
          50: '#F4F7FA',
          100: '#E4ECF3',
          200: '#C9DBE8',
          500: '#6B8BA4',      // Soft blue
        },
        palepeach: {
          50: '#FDF7F4',
          100: '#FAEDE7',
          200: '#F5D5C9',
          500: '#DF8F75',      // Pale peach
        },
        risk: {
          bg: '#FDF3F2',
          border: '#F8D1CE',
          text: '#C25450',     // Muted red only for important risk
        }
      },
      borderRadius: {
        'card': '12px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(31, 36, 33, 0.03), 0 1px 2px -1px rgba(31, 36, 33, 0.02)',
        'soft': '0 4px 14px -2px rgba(31, 36, 33, 0.04)',
      }
    },
  },
  plugins: [],
}
