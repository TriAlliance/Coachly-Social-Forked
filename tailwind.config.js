/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: 'rgb(var(--color-navy))',
          light: 'rgb(var(--color-navy), 0.8)',
          dark: 'rgb(var(--color-navy), 1.2)',
        },
        pink: {
          DEFAULT: 'rgb(var(--color-pink))',
          light: 'rgb(var(--color-pink), 0.8)',
          dark: 'rgb(var(--color-pink), 1.2)',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, rgb(var(--color-navy)), rgb(var(--color-pink)))',
        'gradient-brand-reverse': 'linear-gradient(to right, rgb(var(--color-pink)), rgb(var(--color-navy)))',
      },
    },
  },
  plugins: [],
}