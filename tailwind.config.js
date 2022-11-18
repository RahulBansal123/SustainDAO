module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './containers/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'className'
  theme: {
    fontFamilt: {
      serif: ['Montserrat'],
    },
    extend: {
      colors: {
        green: {
          300: '#2e8555',
          400: '#25c19f',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
