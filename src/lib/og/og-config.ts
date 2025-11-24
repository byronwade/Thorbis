/**
 * OG Image Configuration
 *
 * Design system for programmatic OG image generation.
 * Dark mode first, bold & minimalistic.
 */

export const OG_CONFIG = {
	// Image dimensions (universal social media standard)
	width: 1200,
	height: 630,

	// Margins and spacing
	padding: 48,
	innerPadding: 32,

	// Colors - Dark theme with electric blue accent
	colors: {
		background: "#0F0F0F", // Near black
		foreground: "#F2F2F2", // Near white
		primary: "#4F7BF7", // Electric blue (Thorbis brand)
		accent: "#22C55E", // Success green (for pricing badge)
		muted: "#737373", // Gray text
		mutedForeground: "#A3A3A3", // Lighter gray
		border: "#262626", // Subtle border
		destructive: "#EF4444", // Red for competitor pricing
	},

	// Typography sizes
	typography: {
		hero: 72, // Main hero text
		title: 56, // Page titles
		subtitle: 32, // Subtitles/descriptions
		badge: 24, // Badge text
		small: 20, // Small details
		micro: 16, // Very small text
	},

	// Font weights
	weights: {
		regular: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
		extrabold: 800,
	},

	// Logo dimensions
	logo: {
		width: 160,
		height: 40,
	},

	// Pricing badge
	pricingBadge: {
		text: "$200/mo",
		subtitle: "All features included",
	},
} as const;

/**
 * Brand messaging for different page types
 */
export const OG_MESSAGING = {
	// Default/Homepage
	homepage: {
		title: "Field Service Management",
		subtitle: "That Actually Works",
		tagline: "AI-powered scheduling, invoicing & CRM for contractors",
	},

	// Feature pages - benefits focused
	features: {
		scheduling: {
			title: "Smart Scheduling",
			subtitle: "Stop losing jobs to double-bookings",
			icon: "calendar",
		},
		invoicing: {
			title: "One-Click Invoicing",
			subtitle: "Get paid 2x faster with automated billing",
			icon: "receipt",
		},
		crm: {
			title: "Built-in CRM",
			subtitle: "Know your customers, grow your business",
			icon: "users",
		},
		"ai-assistant": {
			title: "AI Assistant",
			subtitle: "Your 24/7 virtual dispatcher",
			icon: "bot",
		},
		"mobile-app": {
			title: "Mobile App",
			subtitle: "Run your business from anywhere",
			icon: "smartphone",
		},
		"customer-portal": {
			title: "Customer Portal",
			subtitle: "Self-service booking that customers love",
			icon: "layout",
		},
		quickbooks: {
			title: "QuickBooks Sync",
			subtitle: "Automatic accounting, zero data entry",
			icon: "refresh",
		},
		marketing: {
			title: "Marketing Automation",
			subtitle: "Turn happy customers into repeat business",
			icon: "megaphone",
		},
	},

	// Industry pages - pain point focused
	industries: {
		hvac: {
			title: "HVAC Software",
			subtitle: "Built for techs who hate paperwork",
			pain: "Stop losing service agreements",
		},
		plumbing: {
			title: "Plumbing Software",
			subtitle: "From leak to invoice in minutes",
			pain: "No more forgotten callbacks",
		},
		electrical: {
			title: "Electrical Contractor Software",
			subtitle: "Wire your business for growth",
			pain: "Track every job, every wire",
		},
		landscaping: {
			title: "Landscaping Software",
			subtitle: "Grow your business, not your headaches",
			pain: "Route optimization that saves hours",
		},
		cleaning: {
			title: "Cleaning Service Software",
			subtitle: "Spotless scheduling, spotless profits",
			pain: "Never double-book again",
		},
		handyman: {
			title: "Handyman Software",
			subtitle: "Fix more, stress less",
			pain: "One app for everything",
		},
		"pest-control": {
			title: "Pest Control Software",
			subtitle: "Eliminate scheduling chaos",
			pain: "Recurring service made simple",
		},
		roofing: {
			title: "Roofing Software",
			subtitle: "Estimate to invoice, all covered",
			pain: "Photo documentation built-in",
		},
		"pool-service": {
			title: "Pool Service Software",
			subtitle: "Dive into organized operations",
			pain: "Chemical logs & route tracking",
		},
		"appliance-repair": {
			title: "Appliance Repair Software",
			subtitle: "Parts, labor, profit - tracked",
			pain: "Warranty tracking made easy",
		},
		locksmith: {
			title: "Locksmith Software",
			subtitle: "Unlock your business potential",
			pain: "Emergency dispatch ready",
		},
		"garage-door": {
			title: "Garage Door Software",
			subtitle: "Open doors to more revenue",
			pain: "Spring replacement tracking",
		},
	},

	// Competitor comparison pages - SNARKY
	competitors: {
		servicetitan: {
			title: "Thorbis vs ServiceTitan",
			subtitle: "Same power. 75% less cost.",
			ourPrice: "$200/mo",
			theirPrice: "$500+/mo",
			snark: "Enterprise features without the enterprise BS",
		},
		"housecall-pro": {
			title: "Thorbis vs Housecall Pro",
			subtitle: "More features. Less per-user fees.",
			ourPrice: "$200/mo",
			theirPrice: "$49/user/mo",
			snark: "Why pay per tech when you can pay one price?",
		},
		jobber: {
			title: "Thorbis vs Jobber",
			subtitle: "AI-powered. Not AI-washed.",
			ourPrice: "$200/mo",
			theirPrice: "$69-$349/mo",
			snark: "Real automation, not just buzzwords",
		},
		fieldedge: {
			title: "Thorbis vs FieldEdge",
			subtitle: "Modern UX. Actual support.",
			ourPrice: "$200/mo",
			theirPrice: "Call for pricing",
			snark: "If they won't show pricing, you can't afford it",
		},
		servicem8: {
			title: "Thorbis vs ServiceM8",
			subtitle: "Built for growth, not just getting by.",
			ourPrice: "$200/mo",
			theirPrice: "$29-$349/mo",
			snark: "Scale without switching platforms",
		},
		workiz: {
			title: "Thorbis vs Workiz",
			subtitle: "All features included. Always.",
			ourPrice: "$200/mo",
			theirPrice: "$65-$225/mo",
			snark: "No feature gates, no surprises",
		},
	},

	// Pricing page
	pricing: {
		title: "Transparent Pricing",
		subtitle: "No per-user fees. No hidden costs. Ever.",
		highlight: "$200/mo - All Features Included",
	},

	// Blog
	blog: {
		defaultSubtitle: "Insights for field service professionals",
	},

	// Knowledge base
	kb: {
		defaultSubtitle: "Learn how to get the most from Thorbis",
	},
} as const;

/**
 * Social media specific configurations
 */
export const SOCIAL_CONFIGS = {
	// OpenGraph (Facebook, LinkedIn, etc.)
	opengraph: {
		width: 1200,
		height: 630,
	},
	// Twitter/X
	twitter: {
		width: 1200,
		height: 630,
		cardType: "summary_large_image" as const,
	},
} as const;

export type OGPageType =
	| "homepage"
	| "feature"
	| "industry"
	| "competitor"
	| "pricing"
	| "blog"
	| "kb"
	| "integration"
	| "calculator"
	| "default";
