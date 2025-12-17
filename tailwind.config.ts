import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          50: "#f6f7fb",
          100: "#e2e7f3",
          200: "#c5d0e6",
          300: "#a2b2d5",
          400: "#748ac0",
          500: "#4f68ae",
          600: "#3c529c",
          700: "#334684",
          800: "#2d3b6c",
          900: "#263153",
        },
        highlight: "#d5ff80",
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(79, 104, 174, 0.35)",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(79, 104, 174, 0.2) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
