/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind scans these files to generate only the classes we use.
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F17", // main canvas color
      },
    },
  },
  plugins: [],
};