/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{html,css}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
