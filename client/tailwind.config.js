/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', '"Geist Fallback"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'ui-serif', 'serif'],
      },
      colors: {
        ink: {
          DEFAULT: 'lab(27.036 0 0)',
          soft: '#404040',
          muted: '#737373',
        },
        paper: {
          DEFAULT: '#fafafa',
          raised: '#ffffff',
          line: '#e5e5e5',
        },
        accent: {
          DEFAULT: '#0f766e',
          soft: '#ccfbf1',
          dark: '#115e59',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(10, 10, 10, 0.04), 0 12px 32px rgba(10, 10, 10, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
