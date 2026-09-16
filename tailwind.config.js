/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dex: {
          950: '#0b0f19',
          900: '#111827',
          800: '#1f293d',
          700: '#374151',
          accent: '#6366f1',
          cyan: '#06b6d4'
        }
      }
    },
  },
  plugins: [],
}
