/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      Inter: ["Inter"],
    },
  },
  plugins: ["prettier-plugin-tailwindcss"],
  darkMode: "class",
};
