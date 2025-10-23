/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./apps/*/src/**/*.{html,ts}', './libs/*/src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta de marca Genius Soft
        brand: {
          orange: '#F57C00',
          'orange-light': '#FF9800',
          'orange-dark': '#E65100',
          dark: '#4A4A4A',
          light: '#B0B0B0',
          white: '#FFFFFF',
        },
        // Colores primarios (basados en el naranja corporativo)
        primary: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#F57C00', // Color principal
          600: '#FB8C00',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
        },
        // Colores secundarios (grises del sistema)
        secondary: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#4A4A4A', // Gris oscuro corporativo
          900: '#212121',
        },
      },
    },
  },
  plugins: [],
};
