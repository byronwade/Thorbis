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

	// Colors - CLEAN professional theme
	colors: {
		background: "#FFFFFF", // Clean white
		foreground: "#0A0A0A", // Near black text
		primary: "#4F7BF7", // Electric blue (Thorbis brand)
		accent: "#22C55E", // Success green (for pricing)
		muted: "#6B7280", // Gray text
		mutedForeground: "#9CA3AF", // Lighter gray
		border: "#E5E7EB", // Subtle border
		destructive: "#EF4444", // Red for competitor pricing
		dark: "#1F2937", // Dark elements
	},

	// Typography sizes - CLEAN & READABLE scale
	typography: {
		display: 180, // MASSIVE pricing ($200)
		hero: 72, // Main headline
		title: 48, // Secondary headline
		subtitle: 28, // Supporting text
		body: 24, // Body text
		small: 20, // Small details
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

	// Social proof - builds trust and credibility
	socialProof: {
		customers: "500+ Contractors",
		rating: "4.9★",
		savings: "Save $34,600/year avg",
		guarantee: "Money-Back Guarantee",
	},
} as const;

/**
 * Brand messaging for different page types
 */
export const OG_MESSAGING = {
	// Default/Homepage - SIMPLE & POWERFUL
	homepage: {
		headline: "Field Service Management",
		subheadline: "That Contractors Actually Use",
		pricing: "$200/mo",
		tagline: "All Features. No Per-User Fees.",
	},

	// Feature pages - PAIN-FIRST with specific numbers
	features: {
		scheduling: {
			painPoint: "Techs Waste 2+ Hours Daily on Double-Bookings",
			solution: "Smart Scheduling Saves 12 Hours/Week",
			stat: "Save 12 hrs/week",
			icon: "calendar",
			// Legacy
			title: "Smart Scheduling",
			subtitle: "Stop losing jobs to double-bookings",
		},
		invoicing: {
			painPoint: "Slow Invoicing Costs You $2,400/Month in Delays",
			solution: "One-Click Invoicing Gets You Paid 2x Faster",
			stat: "Get paid 2x faster",
			icon: "receipt",
			// Legacy
			title: "One-Click Invoicing",
			subtitle: "Get paid 2x faster with automated billing",
		},
		crm: {
			painPoint: "Lost Customer Data Kills $30K+ in Repeat Business",
			solution: "Built-in CRM Tracks Every Customer Interaction",
			stat: "+19% avg ticket",
			icon: "users",
			// Legacy
			title: "Built-in CRM",
			subtitle: "Know your customers, grow your business",
		},
		"ai-assistant": {
			painPoint: "After-Hours Calls Go Straight to Competitors",
			solution: "AI Assistant Books Jobs 24/7 While You Sleep",
			stat: "Never miss a lead",
			icon: "bot",
			// Legacy
			title: "AI Assistant",
			subtitle: "Your 24/7 virtual dispatcher",
		},
		"mobile-app": {
			painPoint: "Paperwork Eats 15% of Your Technician's Day",
			solution: "Mobile App Lets Techs Complete Jobs On-Site",
			stat: "15% more jobs/day",
			icon: "smartphone",
			// Legacy
			title: "Mobile App",
			subtitle: "Run your business from anywhere",
		},
		"customer-portal": {
			painPoint: "Phone Tag Loses You 30% of Online Inquiries",
			solution: "Customer Portal Books Jobs While You're Busy",
			stat: "+30% online bookings",
			icon: "layout",
			// Legacy
			title: "Customer Portal",
			subtitle: "Self-service booking that customers love",
		},
		quickbooks: {
			painPoint: "Manual Data Entry Costs 8 Hours/Week",
			solution: "QuickBooks Sync: Zero Data Entry, Perfect Books",
			stat: "Save 8 hrs/week",
			icon: "refresh",
			// Legacy
			title: "QuickBooks Sync",
			subtitle: "Automatic accounting, zero data entry",
		},
		marketing: {
			painPoint: "One-Time Customers Cost You 60% Profit Potential",
			solution: "Marketing Automation Turns Customers Into Repeat Revenue",
			stat: "92% renewal rate",
			icon: "megaphone",
			// Legacy
			title: "Marketing Automation",
			subtitle: "Turn happy customers into repeat business",
		},
	},

	// Industry pages - AGGRESSIVE pain with dollar amounts
	industries: {
		hvac: {
			painPoint: "HVAC Contractors Lose $50K/Year in Service Agreements",
			solution: "92% Renewal Rate • Save 12 Hours/Week on Paperwork",
			stat: "92% renewal rate",
			// Legacy
			title: "HVAC Software",
			subtitle: "Built for techs who hate paperwork",
			pain: "Stop losing $50K/year in service agreements",
		},
		plumbing: {
			painPoint: "Plumbers Lose 30% of Emergency Calls to Slow Response",
			solution: "From Leak to Paid Invoice in 45 Minutes",
			stat: "45 min response",
			// Legacy
			title: "Plumbing Software",
			subtitle: "From leak to invoice in minutes",
			pain: "Stop losing emergency calls",
		},
		electrical: {
			painPoint: "Electricians Waste $15K/Month on Forgotten Follow-Ups",
			solution: "Track Every Wire, Every Job, Every Dollar",
			stat: "+$15K/mo revenue",
			// Legacy
			title: "Electrical Contractor Software",
			subtitle: "Wire your business for growth",
			pain: "Stop losing follow-up revenue",
		},
		landscaping: {
			painPoint: "Landscapers Waste 10 Hours/Week on Route Planning",
			solution: "Route Optimization Saves 10 Hours Weekly",
			stat: "Save 10 hrs/week",
			// Legacy
			title: "Landscaping Software",
			subtitle: "Grow your business, not your headaches",
			pain: "Stop wasting time on routes",
		},
		cleaning: {
			painPoint: "Cleaning Services Lose $20K/Year to Double-Bookings",
			solution: "Spotless Scheduling, Zero Double-Books",
			stat: "Zero double-books",
			// Legacy
			title: "Cleaning Service Software",
			subtitle: "Spotless scheduling, spotless profits",
			pain: "Stop losing jobs to double-bookings",
		},
		handyman: {
			painPoint: "Handymen Juggle 5 Apps, Waste 3 Hours Daily",
			solution: "One App for Everything: Schedule to Invoice",
			stat: "Save 3 hrs/day",
			// Legacy
			title: "Handyman Software",
			subtitle: "Fix more, stress less",
			pain: "Stop juggling multiple apps",
		},
		"pest-control": {
			painPoint: "Pest Control Loses $40K/Year in Recurring Service",
			solution: "Automated Recurring Service, 95% Retention",
			stat: "95% retention",
			// Legacy
			title: "Pest Control Software",
			subtitle: "Eliminate scheduling chaos",
			pain: "Stop losing recurring revenue",
		},
		roofing: {
			painPoint: "Roofers Lose Estimates Without Photo Documentation",
			solution: "Photo-Based Estimates Close 40% More Jobs",
			stat: "+40% close rate",
			// Legacy
			title: "Roofing Software",
			subtitle: "Estimate to invoice, all covered",
			pain: "Stop losing estimates",
		},
		"pool-service": {
			painPoint: "Pool Services Forget Chemical Logs, Risk Liability",
			solution: "Automated Chemical Tracking + Route Optimization",
			stat: "100% compliant",
			// Legacy
			title: "Pool Service Software",
			subtitle: "Dive into organized operations",
			pain: "Stop risking liability",
		},
		"appliance-repair": {
			painPoint: "Appliance Techs Lose $25K/Year in Warranty Claims",
			solution: "Warranty Tracking Captures Every Covered Repair",
			stat: "+$25K/yr revenue",
			// Legacy
			title: "Appliance Repair Software",
			subtitle: "Parts, labor, profit - tracked",
			pain: "Stop missing warranty revenue",
		},
		locksmith: {
			painPoint: "Locksmiths Miss Emergency Calls, Lose $35K/Year",
			solution: "24/7 Emergency Dispatch Captures Every Call",
			stat: "Never miss calls",
			// Legacy
			title: "Locksmith Software",
			subtitle: "Unlock your business potential",
			pain: "Stop missing emergency revenue",
		},
		"garage-door": {
			painPoint: "Garage Door Services Lose Track of Spring Replacements",
			solution: "Spring Tracking Increases Replacement Revenue 50%",
			stat: "+50% replacements",
			// Legacy
			title: "Garage Door Software",
			subtitle: "Open doors to more revenue",
			pain: "Stop missing replacement opportunities",
		},
	},

	// Competitor comparison pages - AGGRESSIVE annual savings
	competitors: {
		servicetitan: {
			title: "Thorbis vs ServiceTitan",
			annualSavings: "Save $34,600/Year",
			ourPrice: "$200/mo",
			ourAnnual: "$2,400/year",
			theirPrice: "$3,100/mo",
			theirAnnual: "$37,200/year",
			subtitle: "Same Power. 93% Less Cost.",
			snark: "Enterprise features without the enterprise BS",
		},
		"housecall-pro": {
			title: "Thorbis vs Housecall Pro",
			annualSavings: "Save $4,800/Year (5 techs)",
			ourPrice: "$200/mo",
			ourAnnual: "$2,400/year",
			theirPrice: "$49/user × 5",
			theirAnnual: "$7,200/year",
			subtitle: "More Features. Zero Per-User Fees.",
			snark: "Why pay per tech when you can pay one price?",
		},
		jobber: {
			title: "Thorbis vs Jobber",
			annualSavings: "Save Up to $1,200/Year",
			ourPrice: "$200/mo",
			ourAnnual: "$2,400/year",
			theirPrice: "$300/mo",
			theirAnnual: "$3,600/year",
			subtitle: "AI-Powered. Not AI-Washed.",
			snark: "Real automation, not just buzzwords",
		},
		fieldedge: {
			title: "Thorbis vs FieldEdge",
			annualSavings: "They Hide Pricing. We Don't.",
			ourPrice: "$200/mo",
			ourAnnual: "$2,400/year",
			theirPrice: "Call for Quote",
			theirAnnual: "$25,000+ typically",
			subtitle: "Transparent Pricing. Modern UX.",
			snark: "If they won't show pricing, you can't afford it",
		},
		servicem8: {
			title: "Thorbis vs ServiceM8",
			annualSavings: "Save $1,200/Year",
			ourPrice: "$200/mo",
			ourAnnual: "$2,400/year",
			theirPrice: "$300/mo",
			theirAnnual: "$3,600/year",
			subtitle: "Built for Growth. Not Just Getting By.",
			snark: "Scale without switching platforms",
		},
		workiz: {
			title: "Thorbis vs Workiz",
			annualSavings: "Save $300/Year + No Hidden Fees",
			ourPrice: "$200/mo",
			ourAnnual: "$2,400/year",
			theirPrice: "$225/mo",
			theirAnnual: "$2,700/year",
			subtitle: "All Features Included. Always.",
			snark: "No feature gates, no surprises",
		},
	},

	// Pricing page - SAVINGS-FOCUSED
	pricing: {
		mainHeadline: "Save $34,600/Year",
		comparison: "$200/mo = $2,400/year",
		competitorPrice: "vs ServiceTitan $37,200/year",
		guarantee: "Money-Back Guarantee • No Per-User Fees • Cancel Anytime",
		// Legacy
		title: "Save $34,600/Year vs ServiceTitan",
		subtitle: "No per-user fees. No hidden costs. Ever.",
		highlight: "$200/mo = $2,400/year",
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
