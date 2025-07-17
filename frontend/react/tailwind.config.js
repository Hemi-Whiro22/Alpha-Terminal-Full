/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can define cloak colors here
        cloak: "#0f0f1f",
      },
    },
  },
  plugins: [],
};
