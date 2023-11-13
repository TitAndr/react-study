/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js"
  ],
  theme: {
    extend: {},
    screens: {
      'small': '250px',
      'mobile': '490px',
      'tablet': '640px',
      'smd': '860px',
      'laptop': '1090px',
      'desktop': '1300px'
    },
    fontSize: {
      'title': '3rem'
    }
  },
  darkMode: "class",
  plugins: [nextui()],
};
