/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Оновлено для підтримки всіх можливих типів файлів
    "./node_modules/flowbite/**/*.js"
  ],

  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '10p': '10%', // Відступ 10%
      },
      width: {
        '80p': '80%', // Ширина 80%
      },
    },

    screens: {
      xs: '320px',
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },

    container: {
      center: true,
      padding: '10%',
      screens: {
        DEFAULT: '80%', // Встановлення ширини контейнера на 80% для всіх розмірів екрана
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
};

