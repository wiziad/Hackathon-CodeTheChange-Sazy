import type { Config } from "tailwindcss";

const config: Config = {
  // No dark mode anywhere
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#e6f3ec",
          100: "#d3ecdf",
          200: "#a7dbc0",
          300: "#7bcaa1",
          400: "#4fb982",
          500: "#1da862",
          600: "#008542", // primary
          700: "#006e36",
          800: "#035c2e",
          900: "#024a25",
          950: "#0c2a1b",
        },
      },
      boxShadow: { brand: "0 10px 25px -5px rgba(0,133,66,0.25)" },
      borderRadius: { xl: "0.75rem", "2xl": "1rem" },
    },
  },
  plugins: [],
};

export default config;