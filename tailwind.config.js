/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': '#26BBFF',
        'dark-10': '#121214',
        'dark-20': '#17171A',
        'dark-30': '#202024',
        'dark-40': '#252529',
        'dark-50': '#AFABB6',
        'dark-60': '#FFFFFF',

      },
    },
  },
  plugins: [],
}