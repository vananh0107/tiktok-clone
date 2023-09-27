/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      screens: {
        phone: {'max': '450px'},
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require("tw-elements/dist/plugin.cjs")
  ],
};
