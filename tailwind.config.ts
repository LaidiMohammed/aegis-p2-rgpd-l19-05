import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#111d33",
        cream: "#f7f4ec",
        gold: "#c9a227",
        ink: "#1c2536",
        muted: "#6b7280",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
