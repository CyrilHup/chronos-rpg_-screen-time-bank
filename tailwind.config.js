/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zen: {
          background: '#F0FDF4', // Green-50 (Very light green)
          paper: '#FFFFFF',      // White
          primary: '#16A34A',    // Green-600 (Natural Green)
          secondary: '#0D9488',  // Teal-600
          accent: '#F59E0B',     // Amber-500
          text: {
            main: '#14532D',     // Green-900 (Dark Green text)
            muted: '#64748B',    // Slate-500
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      }
    },
  },
  plugins: [],
}
