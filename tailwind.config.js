/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // enables dark mode via class toggle
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sanskrit: ['"Tiro Devanagari Hindi"', 'serif'],
      },
    
      keyframes: {
        hue: {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        slowspin: 'spin 20s linear infinite',
        colorCycle: 'hue 15s linear infinite',
        fadeIn: 'fadeIn 1s ease-in-out',
      },
    },
  },
  plugins: [],
};
