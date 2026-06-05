/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design system tokens matching the screenshot (Warm Brown / Chocolate / Amber theme)
        brand: {
          dark: '#1E1A17',       // Sidebar background & dark-mode cards
          darker: '#15110F',     // Dark mode page background
          light: '#F8F6F4',      // Light mode page background
          sidebar: '#201b17',    // Sidebar background color
          active: '#3A3029',     // Active menu background in sidebar
          gold: '#D97706',       // Amber-600 gold accent
          goldHover: '#B45309',  // Amber-700
          teal: '#059669',       // Teal-600 success action
          tealHover: '#047857',
          blue: '#0284C7',       // Sky-600 info action
          blueHover: '#0369a1',
        },
        // 12+ custom semantic color tokens
        primary: {
          DEFAULT: '#D97706',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#F59E0B',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
          800: '#78350F',
          900: '#451A03',
        },
        success: '#059669',
        warning: '#D97706',
        danger: '#DC2626',
        info: '#0284C7',
        neutral: {
          dark: '#1E1A17',
          light: '#F8F6F4',
          gray: '#6B7280',
          border: '#E5E7EB',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(30, 26, 23, 0.08), 0 2px 8px -1px rgba(30, 26, 23, 0.04)',
        'premium-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 1px 3px 0 rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
