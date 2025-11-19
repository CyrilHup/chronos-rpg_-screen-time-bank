/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zen: {
          background: '#0B1120', // Deep Dark Blue
          paper: '#151F32',      // Lighter Dark Blue
          primary: '#10B981',    // Verdatre (Emerald Green)
          secondary: '#0F766E',  // Teal
          accent: '#34D399',     // Soft Emerald
          text: {
            main: '#E2E8F0',     // Light Slate
            muted: '#94A3B8',    // Slate Gray
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
