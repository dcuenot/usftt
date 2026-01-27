/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d6efd',
          dark: '#003087',
        },
        victory: '#198754',
        defeat: '#dc3545',
        draw: '#6c757d',
      },
    },
  },
  plugins: [],
}
