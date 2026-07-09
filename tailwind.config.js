/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#150e2d", deep: "#100828", card: "#1d1736", tile: "#0f0a22" },
        gold: { DEFAULT: "#fabd00", bright: "#FBBA19", soft: "#ffdf9e" },
        edge: "#2d313f",
        cloud: { DEFAULT: "#e7deff", muted: "#b8b6c8" },
        brand: { DEFAULT: "#e11b22", dark: "#b3141a", light: "#ff4d52" },
        ink: { DEFAULT: "#1c1c1c", light: "#2a2a2a" },
        mint: { DEFAULT: "#66e2c3", dark: "#3fcfae", bg: "#f4f7f6" },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        head: ["Hanken Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
