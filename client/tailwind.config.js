/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: {
        primary: { DEFAULT: '#4468F3', dark: '#2A3C9E', light: '#DCDFFB', soft: '#EAF0FF' },
        danger: { soft: '#FFE3E3', DEFAULT: '#E5484D' },
      },
    },
  },
  plugins: [],
};
