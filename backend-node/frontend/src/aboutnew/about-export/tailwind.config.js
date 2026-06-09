/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./About.jsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        fazo: {
          teal: '#006F7A',
          cyan: '#2EA5B0',
          navy: '#0B2530',
          gray: '#526F7A',
          light: '#F4F8F9',
          border: '#E1EDF0',
        }
      }
    },
  },
  plugins: [],
}
