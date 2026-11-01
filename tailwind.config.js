/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F17",
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E0BE72",
        },
        muted: "#9CA3AF",
      },
      fontFamily: {
        heading: ["Sora", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};