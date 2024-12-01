import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#86A789",
          hover: "#739276",
        },
        sage: {
          50: "#f6f7f6",
          100: "#e3e7e3",
          200: "#c5cdc5",
          300: "#a3afa3",
          400: "#86A789",
          500: "#739276",
          600: "#5c735e",
          700: "#445445",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F3F3F3",
          200: "#E5E5E5",
          300: "#D4D4D4",
          800: "#2C3333",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["SF Pro Display", "Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }) {
      addUtilities({
        '.page-break-before-always': {
          'page-break-before': 'always',
        },
      });
    },
  ],
} satisfies Config;