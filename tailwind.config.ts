// tailwind.config.js

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Adjust based on your project structure
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#1400FF',
        backgroundDark: '#000000',
        surface: '#000000',
        textPrimary: '#FFFFFF',
        accent: '#1400FF',
        premium: '#1400FF',
        link: '#1400FF',
        supportBorder: '#1400FF',
        primary: '#1400FF',
        secondary: '#000000',
        inputBg: '#000000',
        inputText: '#FFFFFF',
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
