import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./emails/**/*.{ts,tsx}",
    "./docs/**/*.{md,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    colors: {
      ...colors,
      white: "hsl(var(--surface-light) / <alpha-value>)",
      black: "hsl(var(--surface-inverse) / <alpha-value>)",
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;

export default config;
