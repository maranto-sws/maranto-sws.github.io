/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy:   '#002147',
          orange: '#FF8C00',
          clean:  '#F8F9FA',
        },
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        plumber: '8px',
      },
    },
  },
  plugins: [],
};
