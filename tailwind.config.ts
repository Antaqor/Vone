// tailwind.config.js

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Adjust based on your project structure
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#000000',
        backgroundDark: '#000000',
        surface: '#FFFFFF',
        textPrimary: '#000000',
        accent: '#000000',
        premium: '#000000',
        link: '#000000',
        supportBorder: '#000000',
        primary: '#000000',
        secondary: '#000000',
        inputBg: '#FFFFFF',
        inputText: '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'], // Minimalistic and clean font stack
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    // other plugins...
  ],
};
