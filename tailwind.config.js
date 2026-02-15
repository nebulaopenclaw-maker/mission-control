/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0e27',
          card: '#141829',
          border: '#242d45',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
