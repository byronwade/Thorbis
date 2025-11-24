/**
 * Semantic SEO & AI-Powered Search Optimization (2025)
 *
 * Features:
 * - Semantic keyword generation
 * - E-E-A-T signal helpers
 * - Voice search optimization
 * - AI Overview optimization
 * - Natural language processing hints
 */

/**
 * Generate semantic keywords from a primary keyword
 * Uses LSI (Latent Semantic Indexing) concepts
 */
export function generateSemanticKeywords(primaryKeyword: string): string[] {
	const semanticMap: Record<string, string[]> = {
		// Field Service Management
		"field service management": [
			"service management software",
			"field service automation",
			"work order management",
			"dispatch software",
			"mobile workforce management",
			"service technician scheduling",
			"asset management platform",
			"preventive maintenance software",
		],

		// HVAC specific
		hvac: [
			"heating and cooling",
			"air conditioning service",
			"HVAC contractor software",
			"refrigeration management",
			"climate control systems",
			"commercial HVAC",
			"residential HVAC",
		],

		// Plumbing
		plumbing: [
			"plumber software",
			"pipe repair management",
			"water system maintenance",
			"drain cleaning",
			"plumbing contractor tools",
			"emergency plumbing",
		],

		// Electrical
		electrical: [
			"electrician software",
			"electrical contractor management",
			"wiring and installation",
			"electrical safety",
			"commercial electrical",
			"residential electrical",
		],

		// Business management
		"business management": [
			"business operations",
			"workflow automation",
			"customer relationship management",
			"invoice management",
			"payment processing",
			"business intelligence",
			"performance analytics",
		],

		// Scheduling
		scheduling: [
			"appointment scheduling",
			"calendar management",
			"dispatch optimization",
			"route planning",
			"technician allocation",
			"smart scheduling",
			"automated booking",
		],

		// Invoicing
		invoicing: [
			"invoice generation",
			"billing automation",
			"payment collection",
			"accounts receivable",
			"digital invoices",
			"recurring billing",
		],

		// Customer management
		crm: [
			"customer relationship management",
			"customer database",
			"client management",
			"contact management",
			"customer communication",
			"customer portal",
		],

		// Careers & Hiring
		careers: [
			"field service jobs",
			"software engineering careers",
			"remote tech jobs",
			"startup careers",
			"SaaS company jobs",
			"work from home tech",
			"customer success jobs",
		],

		// Partners & Integrations
		partners: [
			"software partner program",
			"API integration partners",
			"referral program",
			"channel partners",
			"solution partners",
			"technology ecosystem",
		],

		// Implementation & Onboarding
		implementation: [
			"software implementation",
			"customer onboarding",
			"data migration services",
			"field service migration",
			"software training",
			"go-live support",
		],

		// ROI Calculator
		"roi calculator": [
			"software ROI",
			"field service savings",
			"cost comparison calculator",
			"business case builder",
			"investment calculator",
			"efficiency gains",
		],

		// Switch & Migration
		switch: [
			"software migration",
			"platform switching",
			"data transfer",
			"servicetitan alternative",
			"change management",
			"legacy system replacement",
		],

		// Reviews & Testimonials
		reviews: [
			"customer testimonials",
			"software reviews",
			"user ratings",
			"customer success stories",
			"case studies",
			"social proof",
		],

		// Demo & Getting Started
		demo: [
			"software demo",
			"product tour",
			"free trial",
			"getting started",
			"platform walkthrough",
			"live demonstration",
		],

		// Contact & Support
		contact: [
			"customer support",
			"sales inquiry",
			"get in touch",
			"request information",
			"schedule consultation",
			"support contact",
		],

		// AI & Automation
		"ai assistant": [
			"AI automation",
			"intelligent assistant",
			"chatbot for business",
			"automated customer service",
			"AI-powered scheduling",
			"smart dispatch",
		],

		// Mobile App
		"mobile app": [
			"field service mobile",
			"technician app",
			"mobile workforce",
			"offline capable app",
			"iOS field service",
			"Android field service",
		],

		// Customer Portal
		"customer portal": [
			"client portal",
			"self-service portal",
			"customer login",
			"online booking",
			"service history access",
			"payment portal",
		],

		// Integrations
		integrations: [
			"software integrations",
			"API connections",
			"third-party integrations",
			"accounting sync",
			"payment integration",
			"CRM integration",
		],
	};

	const normalized = primaryKeyword.toLowerCase().trim();

	// Direct match
	if (semanticMap[normalized]) {
		return semanticMap[normalized];
	}

	// Partial match
	for (const [key, values] of Object.entries(semanticMap)) {
		if (normalized.includes(key) || key.includes(normalized)) {
			return values;
		}
	}

	return [];
}

/**
 * E-E-A-T Signal Metadata Generator
 * Experience, Expertise, Authoritativeness, Trustworthiness
 */
export type EEATSignals = {
	author?: {
		name: string;
		expertise: string[];
		credentials?: string;
		bio?: string;
	};
	reviewedBy?: {
		name: string;
		credentials: string;
	};
	publishedDate?: string;
	lastReviewed?: string;
	citations?: string[];
	medicalReviewRequired?: boolean;
};

function generateEEATMetadata(signals: EEATSignals) {
	const metadata: Record<string, string> = {};

	if (signals.author) {
		metadata["article:author"] = signals.author.name;
		if (signals.author.credentials) {
			metadata["article:author:credentials"] = signals.author.credentials;
		}
	}

	if (signals.reviewedBy) {
		metadata["article:reviewed_by"] = signals.reviewedBy.name;
		metadata["article:reviewer:credentials"] = signals.reviewedBy.credentials;
	}

	if (signals.publishedDate) {
		metadata["article:published_time"] = signals.publishedDate;
	}

	if (signals.lastReviewed) {
		metadata["article:modified_time"] = signals.lastReviewed;
		metadata["article:last_reviewed"] = signals.lastReviewed;
	}

	return metadata;
}

/**
 * Voice Search Optimization
 * Generates question-based variants for voice queries
 */
function generateVoiceSearchVariants(topic: string): string[] {
	const questionWords = ["what", "how", "why", "when", "where", "who"];
	const variants: string[] = [];

	// Generate question patterns
	variants.push(`what is ${topic}`);
	variants.push(`how does ${topic} work`);
	variants.push(`why use ${topic}`);
	variants.push(`when to use ${topic}`);
	variants.push(`where to find ${topic}`);
	variants.push(`how to ${topic}`);
	variants.push(`best ${topic}`);
	variants.push(`${topic} near me`);
	variants.push(`${topic} cost`);
	variants.push(`${topic} benefits`);

	return variants;
}

/**
 * AI Overview Optimization
 * Structures content for Google AI Overviews (SGE)
 */
export type AIOverviewOptimization = {
	quickAnswer: string; // 40-60 character quick answer
	detailedAnswer: string; // 2-3 sentence detailed answer
	bulletPoints?: string[]; // Key points for AI to extract
	relatedQuestions?: string[]; // Related queries users might ask
	factualClaims?: Array<{
		claim: string;
		source?: string;
		date?: string;
	}>;
};

function generateAIOverviewMetadata(
	optimization: AIOverviewOptimization,
) {
	return {
		"og:description": optimization.quickAnswer,
		"twitter:description": optimization.quickAnswer,
		"article:summary": optimization.detailedAnswer,
		...(optimization.relatedQuestions && {
			"article:related_queries": optimization.relatedQuestions.join(" | "),
		}),
	};
}

/**
 * Semantic HTML hints for better AI understanding
 */
const semanticElements = {
	// Main content structure
	MAIN_CONTENT: "main",
	ARTICLE: "article",
	SECTION: "section",
	ASIDE: "aside",

	// Navigation
	NAV: "nav",
	HEADER: "header",
	FOOTER: "footer",

	// Content organization
	HEADING_1: "h1",
	HEADING_2: "h2",
	HEADING_3: "h3",
	PARAGRAPH: "p",
	LIST: "ul",
	LIST_ORDERED: "ol",
	LIST_ITEM: "li",

	// Emphasis and importance
	STRONG: "strong", // Important text
	EM: "em", // Emphasized text
	MARK: "mark", // Highlighted text
	TIME: "time", // Temporal data

	// Data and figures
	FIGURE: "figure",
	FIGCAPTION: "figcaption",
	DATA: "data",
	OUTPUT: "output",

	// Quotes and citations
	BLOCKQUOTE: "blockquote",
	CITE: "cite",
	Q: "q",

	// Forms and inputs (for accessibility)
	LABEL: "label",
	FIELDSET: "fieldset",
	LEGEND: "legend",
} as const;

/**
 * Generate breadcrumb navigation for better site structure understanding
 */
export type BreadcrumbItem = {
	name: string;
	path: string;
};

function generateBreadcrumbPath(
	items: BreadcrumbItem[],
): Array<{ name: string; url: string }> {
	return items.map((item, index) => ({
		name: item.name,
		url:
			index === items.length - 1
				? item.path
				: items
						.slice(0, index + 1)
						.map((i) => i.path)
						.join("/"),
	}));
}

/**
 * Content Quality Signals for AI understanding
 */
export type ContentQualitySignals = {
	wordCount: number;
	readingTime: number; // minutes
	lastUpdated: string;
	freshness: "current" | "recent" | "outdated";
	citations: number;
	multimedia: {
		images: number;
		videos: number;
		infographics: number;
	};
	interactivity: {
		forms: number;
		calculators: number;
		demos: number;
	};
};

function calculateContentQualityScore(
	signals: ContentQualitySignals,
): number {
	let score = 0;

	// Word count (optimal: 1500-2500 words for comprehensive content)
	if (signals.wordCount >= 1500 && signals.wordCount <= 2500) {
		score += 20;
	} else if (signals.wordCount >= 1000) {
		score += 15;
	} else if (signals.wordCount >= 500) {
		score += 10;
	}

	// Freshness
	if (signals.freshness === "current") score += 20;
	else if (signals.freshness === "recent") score += 15;
	else if (signals.freshness === "outdated") score += 5;

	// Citations (shows research and authority)
	score += Math.min(signals.citations * 5, 20);

	// Multimedia (enhances engagement)
	const multimediaScore =
		signals.multimedia.images * 2 +
		signals.multimedia.videos * 5 +
		signals.multimedia.infographics * 3;
	score += Math.min(multimediaScore, 20);

	// Interactivity (demonstrates expertise and helpfulness)
	const interactivityScore =
		signals.interactivity.forms * 5 +
		signals.interactivity.calculators * 10 +
		signals.interactivity.demos * 8;
	score += Math.min(interactivityScore, 20);

	return Math.min(score, 100);
}

/**
 * Generate meta description optimized for AI Overviews
 * Target: 150-160 characters with semantic keywords
 */
function generateAIOptimizedMetaDescription(
	topic: string,
	benefit: string,
	cta?: string,
): string {
	const semanticKeywords = generateSemanticKeywords(topic);
	const primaryKeyword = semanticKeywords[0] || topic;

	let description = `${benefit} with ${topic}.`;

	// Add semantic context
	if (semanticKeywords.length > 1) {
		description += ` Includes ${semanticKeywords[1]}.`;
	}

	// Add CTA if provided and space allows
	if (cta && description.length + cta.length < 155) {
		description += ` ${cta}`;
	}

	// Ensure under 160 characters
	return description.slice(0, 160);
}

/**
 * Featured Snippet Optimization
 * Structures content for featured snippet capture
 */
export type FeaturedSnippetType =
	| "paragraph"
	| "list"
	| "table"
	| "video"
	| "accordion";

export type FeaturedSnippetContent = {
	question: string;
	type: FeaturedSnippetType;
	answer: string | string[] | Record<string, string>;
	context?: string;
};

function formatForFeaturedSnippet(
	content: FeaturedSnippetContent,
): string {
	switch (content.type) {
		case "paragraph":
			return `<p>${content.answer}</p>`;

		case "list":
			if (!Array.isArray(content.answer)) return "";
			return `<ul>${content.answer.map((item) => `<li>${item}</li>`).join("")}</ul>`;

		case "table":
			if (typeof content.answer !== "object") return "";
			return `<table>${Object.entries(content.answer)
				.map(([key, value]) => `<tr><th>${key}</th><td>${value}</td></tr>`)
				.join("")}</table>`;

		default:
			return String(content.answer);
	}
}
