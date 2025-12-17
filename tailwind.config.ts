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
        display: ["Cinzel", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Dark Blue / Navy scale
        navy: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#102a43",
          950: "#081623", // Deepest Navy
        },
        // Silver / White scale for highlights
        silver: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        // Mystic can be a crisp white or ice blue glow
        mystic: {
          DEFAULT: "#e0f2fe", // Ice blue
          glow: "#bae6fd",
        }
      },
      boxShadow: {
        card: "0 0 0 1px rgba(148, 163, 184, 0.1), 0 8px 16px -4px rgba(0, 0, 0, 0.5)",
        "card-hover": "0 0 0 1px rgba(148, 163, 184, 0.3), 0 12px 24px -4px rgba(0, 0, 0, 0.3)",
        glow: "0 0 20px -5px rgba(186, 230, 253, 0.3)",
      },
      backgroundImage: {
        "card-gradient": "linear-gradient(to bottom right, rgba(16, 42, 67, 0.9), rgba(8, 22, 35, 0.95))",
        "foil": "linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.05) 30%, transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
