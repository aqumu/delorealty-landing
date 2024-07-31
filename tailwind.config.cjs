/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{html,css}'],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#ea580c",
          "primary-content": "#fff",
          "secondary": "#dc2626",
          "accent": "#075985",
          "neutral": "#d5d5d5",
          "base-100": "#fff",
          "info": "#ea580c",
          "success": "#FF3f02",
          "warning": "#fbbd23",
          "error": "#FCA700",
        },
      },
    ],
  },
  theme: {
    extend:
        {
          fontFamily: {
            'roboto': ['Roboto', 'sans-serif']
          },
        },
    container: {
      center: true,
      padding: '1rem'
    },
  },
  plugins: [require('daisyui')],
};
