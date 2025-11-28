/**
 * OG Image Configuration v2.0
 *
 * DARK MODE FIRST - Matching Dashboard Color Scheme
 *
 * Design Philosophy:
 * - Dark backgrounds matching dashboard dark mode
 * - Electric blue primary accent (hsl 221 73% 56%)
 * - Consistent with app's visual identity
 * - Light text on dark for eye-catching social previews
 */

export const OG_CONFIG = {
	// Image dimensions (universal social media standard)
	width: 1200,
	height: 630,

	// Generous spacing for visual breathing room
	padding: 64,

	// Design System - MATCHING DASHBOARD DARK MODE
	// Note: OG images use slightly higher contrast for social media visibility
	colors: {
		// Core palette - Dashboard dark mode colors
		background: "#0F0F0F", // hsl(0 0% 6%) - dashboard dark background
		foreground: "#FFFFFF", // Pure white for maximum contrast on social
		muted: "#1F1F1F", // hsl(0 0% 12%) - dashboard muted background
		mutedForeground: "#B3B3B3", // hsl(0 0% 70%) - lighter for OG readability
		secondaryText: "#CCCCCC", // hsl(0 0% 80%) - secondary text

		// Brand colors - Dashboard primary
		primary: "#4B7BF5", // hsl(221 73% 56%) - dashboard primary/electric blue
		primaryLight: "#6B92F7", // Lighter variant
		primaryDark: "#3A62D4", // Darker variant

		// Accent colors - Dashboard semantic colors
		accent: "#3D9B4F", // hsl(142.1 70.6% 45.3%) - dashboard success
		accentLight: "#4DB861", // Light green
		accentGlow: "#3D9B4F40", // Green with alpha

		// Semantic colors - Dashboard variants
		destructive: "#9B3D3D", // hsl(0 62.8% 30.6%) - dashboard destructive (dark)
		warning: "#F5C842", // hsl(47.9 95.8% 53.1%) - dashboard warning
		info: "#4B7BF5", // Same as primary - dashboard info

		// Chart/Gradient colors - Dashboard chart palette
		gradient1: "#4B7BF5", // hsl(221 73% 56%) - chart-1 blue
		gradient2: "#A855F7", // hsl(280 87.3% 65.3%) - chart-4 purple
		gradient3: "#E64980", // hsl(340 82.2% 52.5%) - chart-5 pink
		gradient4: "#3D9B4F", // hsl(142.1 70.6% 45.3%) - chart-2 green

		// Dark variations for cards - Dashboard card colors
		card: "#1A1A1A", // hsl(0 0% 10%) - dashboard card
		cardHover: "#242424", // hsl(0 0% 14%) - dashboard accent
		border: "#333333", // hsl(0 0% 20%) - dashboard border
	},

	// Typography - STRONG HIERARCHY
	typography: {
		// Display sizes for maximum impact
		mega: 180, // For single numbers/prices
		display: 120, // Large headlines
		hero: 72, // Main headlines
		title: 48, // Section titles
		subtitle: 32, // Supporting headlines
		body: 24, // Body copy
		caption: 20, // Small text
		micro: 16, // Fine print
	},

	// Font weights
	weights: {
		regular: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
		extrabold: 800,
		black: 900,
	},

	// Gradients - DASHBOARD COLOR SCHEME
	gradients: {
		// Primary brand gradient (dashboard blue to purple)
		primary: "linear-gradient(135deg, #4B7BF5 0%, #A855F7 50%, #E64980 100%)",
		// Success/savings gradient (dashboard success green)
		success: "linear-gradient(135deg, #3D9B4F 0%, #4DB861 50%, #5CC975 100%)",
		// Warm comparison gradient (dashboard warning to destructive)
		warm: "linear-gradient(135deg, #F5C842 0%, #9B3D3D 100%)",
		// Cool professional gradient (dashboard blue to purple)
		cool: "linear-gradient(135deg, #4B7BF5 0%, #6B92F7 50%, #A855F7 100%)",
		// Dark premium gradient (dashboard card to background)
		dark: "linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)",
		// Accent glow (dashboard primary blue)
		glow: "radial-gradient(ellipse at center, rgba(75, 123, 245, 0.3) 0%, transparent 70%)",
	},

	// Shadow effects - Dashboard primary color
	shadows: {
		glow: "0 0 60px rgba(75, 123, 245, 0.4), 0 0 120px rgba(75, 123, 245, 0.2)",
		greenGlow:
			"0 0 60px rgba(61, 155, 79, 0.4), 0 0 120px rgba(61, 155, 79, 0.2)",
		text: "0 4px 20px rgba(0, 0, 0, 0.5)",
	},
} as const;

/**
 * Rich messaging content for each page type
 */
export const OG_MESSAGING = {
	// Homepage - BOLD IMPACT
	homepage: {
		headline: "Run Your Entire Business",
		subheadline: "For $200/month",
		tagline: "No Per-User Fees. No Hidden Costs. Just Results.",
		stats: [
			{ value: "500+", label: "Contractors" },
			{ value: "$34K", label: "Avg Savings" },
			{ value: "4.9", label: "Rating" },
		],
	},

	// Pricing - SAVINGS FOCUS
	pricing: {
		headline: "Save $34,600/Year",
		price: "$200",
		period: "/mo",
		comparison: "vs $3,100/mo with ServiceTitan",
		features: [
			"All Features Included",
			"Unlimited Users",
			"No Setup Fees",
			"Cancel Anytime",
		],
	},

	// Feature pages - Using dashboard chart colors
	features: {
		scheduling: {
			title: "Smart Scheduling",
			headline: "Never Double-Book Again",
			stat: { value: "12", unit: "hrs", label: "saved weekly" },
			icon: "calendar",
			gradient: ["#4B7BF5", "#6B92F7"], // Dashboard primary blue
		},
		invoicing: {
			title: "One-Click Invoicing",
			headline: "Get Paid 2x Faster",
			stat: { value: "2x", unit: "", label: "faster payments" },
			icon: "receipt",
			gradient: ["#3D9B4F", "#4DB861"], // Dashboard success green
		},
		crm: {
			title: "Built-in CRM",
			headline: "Know Every Customer",
			stat: { value: "+19%", unit: "", label: "avg ticket size" },
			icon: "users",
			gradient: ["#A855F7", "#C084FC"], // Dashboard chart-4 purple
		},
		"ai-assistant": {
			title: "AI Assistant",
			headline: "Book Jobs 24/7",
			stat: { value: "24/7", unit: "", label: "availability" },
			icon: "bot",
			gradient: ["#E64980", "#F06292"], // Dashboard chart-5 pink
		},
		"mobile-app": {
			title: "Mobile App",
			headline: "Run Business Anywhere",
			stat: { value: "+15%", unit: "", label: "more jobs daily" },
			icon: "smartphone",
			gradient: ["#F5C842", "#F7D460"], // Dashboard warning yellow
		},
		"customer-portal": {
			title: "Customer Portal",
			headline: "Self-Service Booking",
			stat: { value: "+30%", unit: "", label: "online bookings" },
			icon: "layout",
			gradient: ["#4B7BF5", "#A855F7"], // Dashboard blue to purple
		},
		quickbooks: {
			title: "QuickBooks Sync",
			headline: "Zero Data Entry",
			stat: { value: "8", unit: "hrs", label: "saved weekly" },
			icon: "refresh",
			gradient: ["#4B7BF5", "#6B92F7"], // Dashboard primary blue
		},
		marketing: {
			title: "Marketing Automation",
			headline: "Turn Customers Into Repeat Revenue",
			stat: { value: "92%", unit: "", label: "renewal rate" },
			icon: "megaphone",
			gradient: ["#E64980", "#A855F7"], // Dashboard pink to purple
		},
	},

	// Industry pages - Using dashboard chart colors
	industries: {
		hvac: {
			title: "HVAC Software",
			headline: "Built for Techs Who Hate Paperwork",
			stat: { value: "92%", label: "renewal rate" },
			painPoint: "Stop losing $50K/year in service agreements",
			gradient: ["#4B7BF5", "#6B92F7"], // Dashboard primary blue
		},
		plumbing: {
			title: "Plumbing Software",
			headline: "From Leak to Invoice in Minutes",
			stat: { value: "45min", label: "avg response" },
			painPoint: "Stop losing emergency calls",
			gradient: ["#3D9B4F", "#4DB861"], // Dashboard success green
		},
		electrical: {
			title: "Electrical Contractor Software",
			headline: "Track Every Wire, Every Dollar",
			stat: { value: "+$15K", label: "monthly revenue" },
			painPoint: "Stop losing follow-up revenue",
			gradient: ["#F5C842", "#F7D460"], // Dashboard warning yellow
		},
		landscaping: {
			title: "Landscaping Software",
			headline: "Optimized Routes, Maximum Profits",
			stat: { value: "10hrs", label: "saved weekly" },
			painPoint: "Stop wasting time on routes",
			gradient: ["#3D9B4F", "#5CC975"], // Dashboard success green variant
		},
		cleaning: {
			title: "Cleaning Service Software",
			headline: "Spotless Scheduling",
			stat: { value: "0", label: "double-bookings" },
			painPoint: "Stop losing jobs to scheduling chaos",
			gradient: ["#A855F7", "#C084FC"], // Dashboard chart-4 purple
		},
		handyman: {
			title: "Handyman Software",
			headline: "One App for Everything",
			stat: { value: "3hrs", label: "saved daily" },
			painPoint: "Stop juggling multiple apps",
			gradient: ["#E64980", "#F06292"], // Dashboard chart-5 pink
		},
		"pest-control": {
			title: "Pest Control Software",
			headline: "Automated Recurring Service",
			stat: { value: "95%", label: "retention rate" },
			painPoint: "Stop losing recurring revenue",
			gradient: ["#9B3D3D", "#B84545"], // Dashboard destructive (muted)
		},
		roofing: {
			title: "Roofing Software",
			headline: "Photo-Based Estimates",
			stat: { value: "+40%", label: "close rate" },
			painPoint: "Stop losing estimates",
			gradient: ["#999999", "#B3B3B3"], // Dashboard muted-foreground
		},
		"pool-service": {
			title: "Pool Service Software",
			headline: "Chemical Tracking + Routes",
			stat: { value: "100%", label: "compliant" },
			painPoint: "Stop risking liability",
			gradient: ["#4B7BF5", "#6B92F7"], // Dashboard primary blue
		},
		"appliance-repair": {
			title: "Appliance Repair Software",
			headline: "Warranty Tracking Built-In",
			stat: { value: "+$25K", label: "yearly revenue" },
			painPoint: "Stop missing warranty claims",
			gradient: ["#A855F7", "#4B7BF5"], // Dashboard purple to blue
		},
		locksmith: {
			title: "Locksmith Software",
			headline: "24/7 Emergency Dispatch",
			stat: { value: "0", label: "missed calls" },
			painPoint: "Stop missing emergency revenue",
			gradient: ["#A855F7", "#C084FC"], // Dashboard chart-4 purple
		},
		"garage-door": {
			title: "Garage Door Software",
			headline: "Spring Tracking System",
			stat: { value: "+50%", label: "replacements" },
			painPoint: "Stop missing opportunities",
			gradient: ["#999999", "#666666"], // Dashboard muted tones
		},
	},

	// Competitor comparison pages - Using dashboard chart colors
	competitors: {
		servicetitan: {
			name: "ServiceTitan",
			ourPrice: "$200",
			theirPrice: "$3,100",
			savings: "$34,600",
			savingsPeriod: "/year",
			headline: "Same Features. 93% Less.",
			gradient: ["#3D9B4F", "#4DB861"], // Dashboard success green (savings)
		},
		"housecall-pro": {
			name: "Housecall Pro",
			ourPrice: "$200",
			theirPrice: "$600",
			savings: "$4,800",
			savingsPeriod: "/year",
			headline: "No Per-User Fees. Ever.",
			gradient: ["#4B7BF5", "#6B92F7"], // Dashboard primary blue
		},
		jobber: {
			name: "Jobber",
			ourPrice: "$200",
			theirPrice: "$300",
			savings: "$1,200",
			savingsPeriod: "/year",
			headline: "Real AI. Not AI-Washed.",
			gradient: ["#A855F7", "#C084FC"], // Dashboard chart-4 purple
		},
		fieldedge: {
			name: "FieldEdge",
			ourPrice: "$200",
			theirPrice: "???",
			savings: "$25,000+",
			savingsPeriod: "/year est",
			headline: "Transparent Pricing. Always.",
			gradient: ["#F5C842", "#F7D460"], // Dashboard warning yellow
		},
		servicem8: {
			name: "ServiceM8",
			ourPrice: "$200",
			theirPrice: "$300",
			savings: "$1,200",
			savingsPeriod: "/year",
			headline: "Built for Growth. Not Limits.",
			gradient: ["#E64980", "#F06292"], // Dashboard chart-5 pink
		},
		workiz: {
			name: "Workiz",
			ourPrice: "$200",
			theirPrice: "$225",
			savings: "$300+",
			savingsPeriod: "/year",
			headline: "All Features. No Gates.",
			gradient: ["#4B7BF5", "#A855F7"], // Dashboard blue to purple
		},
	},

	// Blog defaults - Dashboard chart colors
	blog: {
		defaultCategory: "Insights",
		gradient: ["#4B7BF5", "#A855F7"], // Dashboard blue to purple
	},

	// Knowledge base defaults - Dashboard chart colors
	kb: {
		defaultCategory: "Help Center",
		gradient: ["#3D9B4F", "#4DB861"], // Dashboard success green
	},

	// Generic page defaults - Dashboard primary
	generic: {
		gradient: ["#4B7BF5", "#6B92F7"], // Dashboard primary blue
	},
} as const;

/**
 * Visual element patterns for different templates
 */
const OG_PATTERNS = {
	// Geometric patterns
	dots: {
		size: 4,
		spacing: 20,
		opacity: 0.1,
	},
	grid: {
		size: 40,
		opacity: 0.05,
	},
	diagonal: {
		angle: 45,
		spacing: 30,
		opacity: 0.08,
	},
} as const;

export type OGPageType =
	| "homepage"
	| "pricing"
	| "feature"
	| "industry"
	| "competitor"
	| "blog"
	| "kb"
	| "integration"
	| "calculator"
	| "generic";

export type FeatureSlug = keyof typeof OG_MESSAGING.features;
export type IndustrySlug = keyof typeof OG_MESSAGING.industries;
export type CompetitorSlug = keyof typeof OG_MESSAGING.competitors;
