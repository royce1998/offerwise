/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0a0e1a",
          900: "#0f1420",
          800: "#161c2c",
          700: "#1f2739",
          600: "#2b3550",
        },
        brand: {
          50: "#eefdf5",
          100: "#d6f9e6",
          200: "#aff2ce",
          300: "#79e6ac",
          400: "#3fd183",
          500: "#18b866",
          600: "#0c9552",
          700: "#0b7644",
          800: "#0d5d39",
          900: "#0d4c31",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(24,184,102,0.25), 0 8px 40px -12px rgba(24,184,102,0.35)",
      },
    },
  },
  plugins: [],
};
