/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0B0A',
          soft: '#141412',
          raised: '#1B1A17',
        },
        bone: '#EDEAE3',
        silver: '#9C978C',
        brass: {
          DEFAULT: '#B08D57',
          deep: '#8A6D42',
          soft: '#C7A876',
        },
        line: 'rgba(237,234,227,0.12)',
      },
      fontFamily: {
        serif: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        condensed: ['Oswald', 'ui-sans-serif', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
