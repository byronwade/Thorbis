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
		extend: {
			fontSize: {
				xxs: ["0.625rem", { letterSpacing: "0.025em", lineHeight: "1rem" }], // 10px with tracking
				xs: ["0.75rem", { letterSpacing: "0.025em", lineHeight: "1rem" }], // 12px
				sm: ["0.875rem", { letterSpacing: "0.01em", lineHeight: "1.25rem" }], // 14px
				base: ["1rem", { letterSpacing: "0", lineHeight: "1.5rem" }], // 16px
				lg: ["1.125rem", { letterSpacing: "-0.01em", lineHeight: "1.75rem" }], // 18px
				xl: ["1.25rem", { letterSpacing: "-0.015em", lineHeight: "1.75rem" }], // 20px
				"2xl": ["1.5rem", { letterSpacing: "-0.02em", lineHeight: "2rem" }], // 24px
				"3xl": [
					"1.875rem",
					{ letterSpacing: "-0.02em", lineHeight: "2.25rem" },
				], // 30px
				"4xl": ["2.25rem", { letterSpacing: "-0.025em", lineHeight: "2.5rem" }], // 36px
				"5xl": ["3rem", { letterSpacing: "-0.025em", lineHeight: "1" }], // 48px
			},
			fontWeight: {
				extralight: "200",
				light: "300",
				normal: "400",
				medium: "500",
				semibold: "600",
				bold: "700",
				extrabold: "800",
			},
			lineHeight: {
				tighter: "1.125",
				tight: "1.25",
				snug: "1.375",
				normal: "1.5",
				relaxed: "1.625",
				loose: "2",
			},
			letterSpacing: {
				tighter: "-0.05em",
				tight: "-0.025em",
				normal: "0",
				wide: "0.025em",
				wider: "0.05em",
				widest: "0.1em",
			},
			colors: {
				"background-subtle": "hsl(var(--background-subtle) / <alpha-value>)",
				"border-subtle": "hsl(var(--border-subtle) / <alpha-value>)",
				"border-strong": "hsl(var(--border-strong) / <alpha-value>)",
			},
			animation: {
				"spring-in": "spring-in 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
				"slide-in-bottom": "slide-in-bottom 150ms cubic-bezier(0.4, 0, 0.2, 1)",
			},
			keyframes: {
				"spring-in": {
					"0%": { transform: "scale(0.95)", opacity: "0" },
					"50%": { transform: "scale(1.02)" },
					"100%": { transform: "scale(1)", opacity: "1" },
				},
				"slide-in-bottom": {
					from: { transform: "translateY(8px)", opacity: "0" },
					to: { transform: "translateY(0)", opacity: "1" },
				},
			},
			transitionDuration: {
				"150": "150ms",
			},
			transitionTimingFunction: {
				spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
				smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
			},
		},
	},
	plugins: [],
} satisfies Config;

export default config;
