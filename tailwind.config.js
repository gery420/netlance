/**
 * @type {import('tailwindcss').Config}
 */
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Nunito: ["Nunito", "sans-serif"],
        NunitoSans: ["Nunito Sans", "sans-serif"],
        Montserrat: ["Montserrat", "sans-serif"],
        Times: ["Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

