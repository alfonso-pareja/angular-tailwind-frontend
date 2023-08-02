/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js", "./node_modules/daisyui/**/*.js"],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      primary: "#4E3277",
      secondary: "#785AA5",
      gray:"#4E3277"
    }
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#4E3277",
          secondary: "#F4B846",
          accent: "#b8b8b8",
          neutral: "#ebebeb",
          "base-100": "#ffffff",
          info: "#4287C0",
          success: "#86efac",
          warning: "#fde047",
          error: "#fda4af"
        }
      }
    ]
  },
  plugins: [require("daisyui"), require('flowbite/plugin')]
};
