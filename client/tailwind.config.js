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
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        // Deep muted sage green palette
        sage: {
          50: '#F6F8F6',
          100: '#EAECE4',
          200: '#D7DCD3',
          300: '#BDC7B8',
          400: '#899E84',
          500: '#52725A',
          600: '#3F6149', // Primary forest-sage
          700: '#34503C', // Hover / strong action
          800: '#273C2D',
          900: '#18231C', // Darkest green / charcoal text
        },
        // Warm off-white backgrounds & surfaces
        warm: {
          bg: '#F8F7F2',       // Warm off-white page background
          card: '#FFFFFF',     // Clean surface
          surface: '#FDFCF9',  // Warm light surface
          sidebar: '#EAE8DF',  // Sidebar background
          border: '#E2DFD5',   // Delicate border
          borderLight: '#ECEAE2',
          borderDark: '#D5D2C5',
        },
        // Typography text shades
        charcoal: {
          900: '#18231C',      // Deepest charcoal / dark green
          800: '#242C26',
          700: '#3B453E',
          600: '#5A665D',      // Supporting text
          500: '#758177',      // Muted label
          400: '#949F96',
        },
        // Accent 1: Muted Lavender
        lavender: {
          50: '#F6F4FA',
          100: '#E3DEEC',
          200: '#D2CBDF',
          700: '#5B4F73',
          800: '#463B5D',
        },
        // Accent 2: Dusty Blue
        dustyblue: {
          50: '#F2F6F9',
          100: '#D8E4EE',
          200: '#BDD2E2',
          700: '#35536D',
          800: '#263D52',
        },
        // Accent 3: Muted Peach
        peach: {
          50: '#FAF4F1',
          100: '#F5DDD3',
          200: '#EBC3B4',
          700: '#9B4F37',
          800: '#7C3A25',
        },
        // Accent 4: Warm Beige / Sand
        sand: {
          50: '#F9F8F5',
          100: '#EDE9DE',
          200: '#DDD6C5',
          700: '#685F4D',
          800: '#50483A',
        },
        // Risk indicators (restrained, muted)
        risk: {
          highBg: '#F9DFDE',
          highText: '#B5413D',
          highBorder: '#F2CAC8',
          medBg: '#FDF0DD',
          medText: '#9C6A28',
          medBorder: '#F5DFBF',
          lowBg: '#E2ECE3',
          lowText: '#2F5236',
          lowBorder: '#CADBCC',
        }
      },
      borderRadius: {
        'card': '14px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(24, 35, 28, 0.04), 0 1px 2px -1px rgba(24, 35, 28, 0.02)',
        'dropdown': '0 10px 25px -3px rgba(24, 35, 28, 0.08), 0 4px 6px -4px rgba(24, 35, 28, 0.03)',
      }
    },
  },
  plugins: [],
}
