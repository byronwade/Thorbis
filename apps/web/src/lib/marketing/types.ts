export type MarketingCTA = {
	label: string;
	href: string;
};

export type MarketingValueProp = {
	title: string;
	description: string;
	icon: string;
};

export type MarketingStat = {
	label: string;
	value: string;
	description: string;
};

export type MarketingWorkflow = {
	title: string;
	description: string;
	steps?: string[];
};

export type MarketingFAQ = {
	question: string;
	answer: string;
};

export type MarketingTestimonial = {
	quote: string;
	attribution: string;
	role?: string;
};

export type IndustryDesignVariant =
	| "thermal" // HVAC - Blue/cool gradient, temperature-focused
	| "flow" // Plumbing - Water-inspired, flowing curves
	| "circuit" // Electrical - Sharp edges, grid patterns
	| "versatile" // Handyman - Multi-tool inspired, adaptable
	| "organic" // Landscaping - Green tones, nature-inspired
	| "aquatic" // Pool & Spa - Deep blue, water ripples
	| "shield" // Pest Control - Protection-focused, bold badges
	| "technical" // Appliance Repair - Clean lines, mechanical
	| "elevated" // Roofing - Angular shapes, triangular elements
	| "pristine" // Cleaning - Minimalist, sparkle effects
	| "secure" // Locksmith - Dark tones, lock/key motifs
	| "industrial"; // Garage Door - Steel/metallic accents

export type FeatureDesignVariant =
	| "neural" // AI Assistant - Purple/violet, neural network patterns
	| "connected" // CRM - Blue, relationship nodes
	| "calendar" // Online Booking - Teal, time-focused
	| "vibrant" // Marketing - Orange/amber, bold gradients
	| "gateway" // Customer Portal - Indigo, portal-inspired
	| "grid" // Scheduling - Emerald, organized structure
	| "compact" // Mobile App - Cyan, mobile-first design
	| "path" // Routing - Rose, route lines
	| "storage" // Inventory - Amber, organized shelving
	| "collective" // Team Management - Violet, people-focused
	| "ledger" // Invoicing - Green, financial clean
	| "sync" // QuickBooks - Sky blue, data flow
	| "proposal" // Estimates - Fuchsia, presentation-focused
	| "growth" // Financing - Emerald, financial growth
	| "calculate"; // Payroll - Slate, precise numbers

export type IntegrationDesignVariant =
	| "accounting" // QuickBooks - Green, financial
	| "payments" // Stripe - Purple/violet
	| "automation"; // Zapier - Orange

export type CompetitorDesignVariant =
	| "enterprise" // ServiceTitan - Orange/amber (dominant market leader)
	| "growth" // Housecall Pro - Blue/sky (mid-market growth)
	| "field" // Jobber - Green/emerald (landscaping/cleaning)
	| "legacy" // FieldEdge - Red/rose (dated, needs modernization)
	| "starter" // ServiceM8 - Cyan/teal (solo operators)
	| "automation"; // Workiz - Purple/violet (automation focus)

export type MarketingSEO = {
	title: string;
	description: string;
	keywords: string[];
	image?: string;
};

export type MarketingFeatureContent = {
	kind: "feature";
	slug: string;
	name: string;
	designVariant: FeatureDesignVariant;
	heroEyebrow: string;
	heroTitle: string;
	heroDescription: string;
	heroImage?: string;
	summary: string;
	primaryCta: MarketingCTA;
	secondaryCta?: MarketingCTA;
	seo: MarketingSEO;
	painPoints: string[];
	valueProps: MarketingValueProp[];
	workflows: MarketingWorkflow[];
	stats: MarketingStat[];
	integrations?: string[];
	testimonial?: MarketingTestimonial;
	faq: MarketingFAQ[];
};

export type MarketingIndustryContent = {
	kind: "industry";
	slug: string;
	name: string;
	designVariant: IndustryDesignVariant;
	heroEyebrow: string;
	heroTitle: string;
	heroDescription: string;
	heroImage?: string;
	summary: string;
	primaryCta: MarketingCTA;
	secondaryCta?: MarketingCTA;
	seo: MarketingSEO;
	fieldTypes: string[];
	painPoints: string[];
	valueProps: MarketingValueProp[];
	playbook: MarketingWorkflow[];
	stats: MarketingStat[];
	testimonial?: MarketingTestimonial;
	faq: MarketingFAQ[];
};

export type MarketingContent =
	| MarketingFeatureContent
	| MarketingIndustryContent
	| MarketingIntegrationContent;

export type IntegrationPartner = {
	name: string;
	website: string;
	logo?: string;
};

export type MarketingIntegrationContent = {
	kind: "integration";
	slug: string;
	name: string;
	designVariant: IntegrationDesignVariant;
	heroEyebrow: string;
	heroTitle: string;
	heroDescription: string;
	heroImage?: string;
	summary: string;
	partner: IntegrationPartner;
	categories: string[];
	primaryCta: MarketingCTA;
	secondaryCta?: MarketingCTA;
	seo: MarketingSEO;
	valueProps: MarketingValueProp[];
	workflows: MarketingWorkflow[];
	stats?: MarketingStat[];
	requirements?: string[];
	resources?: MarketingCTA[];
	related?: string[];
	faq: MarketingFAQ[];
};
