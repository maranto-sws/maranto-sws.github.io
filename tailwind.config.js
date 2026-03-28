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
        heading: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        body:    ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        plumber: '8px',
      },
    },
  },
  plugins: [],
};
