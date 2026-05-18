/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        emerald: {
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      }
    },
  },
  plugins: [],
}
