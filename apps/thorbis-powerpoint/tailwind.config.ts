import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
const config: Config = {
	darkMode: ["class"],
	content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "hsl(210, 100%, 50%)",
					foreground: "hsl(0, 0%, 100%)",
				},
				background: "hsl(222, 47%, 11%)",
				foreground: "hsl(213, 31%, 91%)",
				card: {
					DEFAULT: "hsl(222, 47%, 13%)",
					foreground: "hsl(213, 31%, 91%)",
				},
				popover: {
					DEFAULT: "hsl(222, 47%, 13%)",
					foreground: "hsl(213, 31%, 91%)",
				},
				secondary: {
					DEFAULT: "hsl(222, 47%, 15%)",
					foreground: "hsl(213, 31%, 91%)",
				},
				muted: {
					DEFAULT: "hsl(222, 47%, 15%)",
					foreground: "hsl(215, 20%, 65%)",
				},
				accent: {
					DEFAULT: "hsl(210, 100%, 50%)",
					foreground: "hsl(213, 31%, 91%)",
				},
				destructive: {
					DEFAULT: "hsl(0, 84%, 60%)",
					foreground: "hsl(213, 31%, 91%)",
				},
				border: "hsl(222, 47%, 20%)",
				input: "hsl(222, 47%, 20%)",
				ring: "hsl(210, 100%, 50%)",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: {
						height: "0",
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: "0",
					},
				},
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideInFromRight: {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0)" },
				},
				zoomIn: {
					"0%": { transform: "scale(0)" },
					"100%": { transform: "scale(1)" },
				},
				flip: {
					"0%": { transform: "rotateX(180deg)" },
					"100%": { transform: "rotateX(0)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fadeIn 0.5s ease-in-out",
				"slide-in-from-right": "slideInFromRight 0.5s ease-in-out",
				"zoom-in": "zoomIn 0.5s ease-in-out",
				bounce: "bounce 1s infinite",
				flip: "flip 0.5s ease-in-out",
			},
		},
	},
	plugins: [animate],
};
export default config;
