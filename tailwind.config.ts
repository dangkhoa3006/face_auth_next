import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#248f7d",
        "background-light": "#f9fafa",
        "background-dark": "#16181d",
      },
      fontFamily: {
        display: ["var(--font-display)", "Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      zIndex: {
        "9999": "9999",
        "10000": "10000",
      },
    },
  },
  plugins: [],
};

export default config;
