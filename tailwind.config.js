/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F2',
          100: '#F8F5EA',
          200: '#F0EAD6',
          300: '#E6DCC4',
        },
        ecogreen: {
          50: '#F2F8F4',
          100: '#DDEBD8',
          200: '#B8DBAF',
          500: '#3F7655',
          700: '#244936',
          900: '#14291E',
        },
        ecoyellow: {
          400: '#F2C94C',
          500: '#E2B83B',
        },
        ecobrown: {
          500: '#8B6B4A',
          700: '#6B4F34',
        },
        ecotext: {
          dark: '#203128',
          muted: '#718078',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        'large': '28px',
      },
      boxShadow: {
        'soft': '0 6px 24px -4px rgba(32, 49, 40, 0.06), 0 2px 8px -2px rgba(32, 49, 40, 0.03)',
        'soft-hover': '0 12px 32px -6px rgba(32, 49, 40, 0.12), 0 4px 12px -2px rgba(32, 49, 40, 0.04)',
      }
    },
  },
  plugins: [],
};
