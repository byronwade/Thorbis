/**
 * API Service Configuration
 *
 * Comprehensive configuration for all external API services including:
 * - Free tier limits and thresholds
 * - Pricing after free tier
 * - Health check endpoints
 * - Provider API availability
 */

export type ServiceCategory =
	| "ai"
	| "google_maps"
	| "infrastructure"
	| "communication"
	| "data"
	| "payments";
export type FreeTierPeriod = "daily" | "monthly" | "yearly";
export type SyncSource =
	| "provider_api"
	| "internal_tracking"
	| "manual"
	| "estimated";

export interface FreeTierConfig {
	limit: number;
	period: FreeTierPeriod;
	unit: string;
}

export interface CostConfig {
	/** Cost in cents */
	cents?: number;
	/** Cost applies per this many units */
	perUnits?: number;
	/** Unit type (request, page, minute, etc) */
	unit?: string;
	/** For percentage-based pricing (e.g., Stripe) */
	percentage?: number;
	/** Fixed fee in cents per transaction */
	fixedCents?: number;
}

export interface ApiServiceConfig {
	serviceName: string;
	displayName: string;
	category: ServiceCategory;
	provider: string;
	/** Free tier configuration, null if no free tier */
	freeTier: FreeTierConfig | null;
	/** Cost after free tier is exhausted */
	costAfterFree: CostConfig | null;
	/** Base monthly cost in cents (for subscription services) */
	baseCostCents: number;
	/** Whether this service has an external API for fetching usage */
	hasExternalApi: boolean;
	/** Endpoint to check for health status */
	healthCheckEndpoint?: string;
	/** Alert thresholds */
	warningThresholdPct: number;
	criticalThresholdPct: number;
	/** Description of what this service is used for */
	description?: string;
}

/**
 * All API service configurations
 * Organized by category for easy access
 */
export const API_SERVICES: Record<string, ApiServiceConfig> = {
	// ==========================================
	// Google AI Services
	// ==========================================
	google_gemini: {
		serviceName: "google_gemini",
		displayName: "Google Gemini AI",
		category: "ai",
		provider: "google",
		freeTier: { limit: 1500, period: "daily", unit: "requests" },
		costAfterFree: { cents: 7.5, perUnits: 1000000, unit: "tokens" },
		baseCostCents: 0,
		hasExternalApi: true,
		healthCheckEndpoint: "https://generativelanguage.googleapis.com/v1/models",
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Gemini AI for text generation, chat, and multimodal tasks",
	},
	google_document_ai: {
		serviceName: "google_document_ai",
		displayName: "Document AI",
		category: "ai",
		provider: "google",
		freeTier: { limit: 1000, period: "monthly", unit: "pages" },
		costAfterFree: { cents: 1, perUnits: 1, unit: "page" },
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Document parsing, OCR, and form extraction",
	},
	google_vision: {
		serviceName: "google_vision",
		displayName: "Vision AI",
		category: "ai",
		provider: "google",
		freeTier: { limit: 1000, period: "monthly", unit: "requests" },
		costAfterFree: { cents: 150, perUnits: 1000, unit: "request" },
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Image analysis, OCR, and object detection",
	},
	google_speech_to_text: {
		serviceName: "google_speech_to_text",
		displayName: "Speech-to-Text",
		category: "ai",
		provider: "google",
		freeTier: { limit: 60, period: "monthly", unit: "minutes" },
		costAfterFree: { cents: 60, perUnits: 1, unit: "minute" },
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Audio transcription and speech recognition",
	},
	google_text_to_speech: {
		serviceName: "google_text_to_speech",
		displayName: "Text-to-Speech",
		category: "ai",
		provider: "google",
		freeTier: { limit: 4000000, period: "monthly", unit: "characters" },
		costAfterFree: { cents: 400, perUnits: 1000000, unit: "characters" },
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Text to natural speech synthesis",
	},
	google_translation: {
		serviceName: "google_translation",
		displayName: "Translation",
		category: "ai",
		provider: "google",
		freeTier: { limit: 500000, period: "monthly", unit: "characters" },
		costAfterFree: { cents: 2000, perUnits: 1000000, unit: "characters" },
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Language translation services",
	},

	// ==========================================
	// Google Maps Services
	// ==========================================
	google_geocoding: {
		serviceName: "google_geocoding",
		displayName: "Geocoding",
		category: "google_maps",
		provider: "google",
		freeTier: { limit: 10000, period: "monthly", unit: "requests" },
		costAfterFree: { cents: 50, perUnits: 100, unit: "request" }, // $5/1000 = $0.50/100
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Address to coordinates conversion",
	},
	google_directions: {
		serviceName: "google_directions",
		displayName: "Directions",
		category: "google_maps",
		provider: "google",
		freeTier: { limit: 10000, period: "monthly", unit: "requests" },
		costAfterFree: { cents: 50, perUnits: 100, unit: "request" },
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Route planning and navigation",
	},
	google_places: {
		serviceName: "google_places",
		displayName: "Places",
		category: "google_maps",
		provider: "google",
		freeTier: { limit: 10000, period: "monthly", unit: "requests" },
		costAfterFree: { cents: 170, perUnits: 100, unit: "request" }, // $17/1000
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Place search, details, and autocomplete",
	},
	google_distance_matrix: {
		serviceName: "google_distance_matrix",
		displayName: "Distance Matrix",
		category: "google_maps",
		provider: "google",
		freeTier: { limit: 10000, period: "monthly", unit: "requests" },
		costAfterFree: { cents: 50, perUnits: 100, unit: "request" },
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Travel distance and time calculations",
	},
	google_maps_static: {
		serviceName: "google_maps_static",
		displayName: "Maps Static",
		category: "google_maps",
		provider: "google",
		freeTier: { limit: 25000, period: "monthly", unit: "requests" },
		costAfterFree: { cents: 20, perUnits: 100, unit: "request" }, // $2/1000
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Static map image generation",
	},
	google_street_view: {
		serviceName: "google_street_view",
		displayName: "Street View",
		category: "google_maps",
		provider: "google",
		freeTier: { limit: 25000, period: "monthly", unit: "requests" },
		costAfterFree: { cents: 70, perUnits: 100, unit: "request" }, // $7/1000
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Street-level imagery",
	},
	google_routes: {
		serviceName: "google_routes",
		displayName: "Routes API",
		category: "google_maps",
		provider: "google",
		freeTier: { limit: 10000, period: "monthly", unit: "requests" },
		costAfterFree: { cents: 50, perUnits: 100, unit: "request" },
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Advanced routing with traffic awareness",
	},
	google_elevation: {
		serviceName: "google_elevation",
		displayName: "Elevation",
		category: "google_maps",
		provider: "google",
		freeTier: null,
		costAfterFree: { cents: 50, perUnits: 100, unit: "request" },
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Terrain elevation data",
	},
	google_timezone: {
		serviceName: "google_timezone",
		displayName: "Time Zone",
		category: "google_maps",
		provider: "google",
		freeTier: null,
		costAfterFree: { cents: 50, perUnits: 100, unit: "request" },
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Time zone lookups by location",
	},

	// ==========================================
	// Infrastructure Services
	// ==========================================
	supabase: {
		serviceName: "supabase",
		displayName: "Supabase",
		category: "infrastructure",
		provider: "supabase",
		freeTier: null, // Pro plan, usage-based after base
		costAfterFree: null,
		baseCostCents: 2500, // $25/month
		hasExternalApi: true,
		healthCheckEndpoint: "https://api.supabase.com/v1/projects",
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Database, Auth, Storage, Edge Functions",
	},
	vercel: {
		serviceName: "vercel",
		displayName: "Vercel",
		category: "infrastructure",
		provider: "vercel",
		freeTier: { limit: 1000, period: "monthly", unit: "GB" }, // 1TB bandwidth included
		costAfterFree: { cents: 15, perUnits: 1, unit: "GB" }, // $0.15/GB
		baseCostCents: 2000, // $20/month Pro plan
		hasExternalApi: false, // Limited API, track internally
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Hosting, Edge Functions, Analytics",
	},

	// ==========================================
	// Communication Services
	// ==========================================
	twilio_voice: {
		serviceName: "twilio_voice",
		displayName: "Twilio Voice",
		category: "communication",
		provider: "twilio",
		freeTier: null, // No free tier
		costAfterFree: { cents: 130, perUnits: 100, unit: "minute" }, // $0.013/min
		baseCostCents: 0,
		hasExternalApi: true,
		healthCheckEndpoint: "https://api.twilio.com/2010-04-01",
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "VoIP calls and call control",
	},
	twilio_sms: {
		serviceName: "twilio_sms",
		displayName: "Twilio SMS",
		category: "communication",
		provider: "twilio",
		freeTier: null, // No free tier
		costAfterFree: { cents: 79, perUnits: 100, unit: "message" }, // $0.0079/msg
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "SMS and MMS messaging",
	},
	sendgrid: {
		serviceName: "sendgrid",
		displayName: "SendGrid Email",
		category: "communication",
		provider: "sendgrid",
		freeTier: { limit: 100, period: "daily", unit: "emails" },
		costAfterFree: { cents: 8, perUnits: 100, unit: "email" }, // ~$0.0008/email
		baseCostCents: 0,
		hasExternalApi: false, // Track internally
		healthCheckEndpoint: "https://api.sendgrid.com/v3/mail/send",
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Transactional email delivery",
	},
	assemblyai: {
		serviceName: "assemblyai",
		displayName: "AssemblyAI",
		category: "communication",
		provider: "assemblyai",
		freeTier: { limit: 500, period: "monthly", unit: "credits" }, // $50 in credits
		costAfterFree: { cents: 15, perUnits: 1, unit: "hour" }, // $0.15/hour
		baseCostCents: 0,
		hasExternalApi: true,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Call transcription and audio intelligence",
	},

	// ==========================================
	// Data APIs
	// ==========================================
	attom: {
		serviceName: "attom",
		displayName: "ATTOM Property",
		category: "data",
		provider: "attom",
		freeTier: null, // No free tier
		costAfterFree: { cents: 500, perUnits: 100, unit: "request" }, // ~$0.05/request
		baseCostCents: 0,
		hasExternalApi: false,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Property data, valuations, sales history",
	},
	shovels: {
		serviceName: "shovels",
		displayName: "Shovels Permits",
		category: "data",
		provider: "shovels",
		freeTier: null,
		costAfterFree: { cents: 300, perUnits: 100, unit: "request" }, // ~$0.03/request
		baseCostCents: 0,
		hasExternalApi: false,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Building permits and contractor data",
	},
	walk_score: {
		serviceName: "walk_score",
		displayName: "Walk Score",
		category: "data",
		provider: "walkscore",
		freeTier: { limit: 5000, period: "daily", unit: "requests" },
		costAfterFree: { cents: 10, perUnits: 100, unit: "request" },
		baseCostCents: 0,
		hasExternalApi: false,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Walkability, transit, and bike scores",
	},
	crimeometer: {
		serviceName: "crimeometer",
		displayName: "CrimeoMeter",
		category: "data",
		provider: "crimeometer",
		freeTier: null,
		costAfterFree: { cents: 500, perUnits: 100, unit: "request" }, // ~$0.05/request
		baseCostCents: 0,
		hasExternalApi: false,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Real-time crime data and safety scores",
	},
	fema_flood: {
		serviceName: "fema_flood",
		displayName: "FEMA Flood",
		category: "data",
		provider: "fema",
		freeTier: null, // Free government API
		costAfterFree: { cents: 0, perUnits: 1, unit: "request" },
		baseCostCents: 0,
		hasExternalApi: false,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Flood zone and risk data (free)",
	},
	census_bureau: {
		serviceName: "census_bureau",
		displayName: "Census Bureau",
		category: "data",
		provider: "census",
		freeTier: null, // Free government API
		costAfterFree: { cents: 0, perUnits: 1, unit: "request" },
		baseCostCents: 0,
		hasExternalApi: false,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Demographics and housing data (free)",
	},
	fbi_crime: {
		serviceName: "fbi_crime",
		displayName: "FBI Crime Data",
		category: "data",
		provider: "fbi",
		freeTier: null, // Free government API
		costAfterFree: { cents: 0, perUnits: 1, unit: "request" },
		baseCostCents: 0,
		hasExternalApi: false,
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Crime statistics by state (free)",
	},

	// ==========================================
	// Payment Services
	// ==========================================
	stripe: {
		serviceName: "stripe",
		displayName: "Stripe",
		category: "payments",
		provider: "stripe",
		freeTier: null,
		costAfterFree: { percentage: 2.9, fixedCents: 30, unit: "transaction" },
		baseCostCents: 0,
		hasExternalApi: true,
		healthCheckEndpoint: "https://api.stripe.com/v1/balance",
		warningThresholdPct: 80,
		criticalThresholdPct: 95,
		description: "Payment processing (2.9% + $0.30)",
	},
};

/**
 * Get services by category
 */
function getServicesByCategory(
	category: ServiceCategory,
): ApiServiceConfig[] {
	return Object.values(API_SERVICES).filter((s) => s.category === category);
}

/**
 * Get services by provider
 */
function getServicesByProvider(provider: string): ApiServiceConfig[] {
	return Object.values(API_SERVICES).filter((s) => s.provider === provider);
}

/**
 * Get all services with free tiers
 */
function getServicesWithFreeTier(): ApiServiceConfig[] {
	return Object.values(API_SERVICES).filter((s) => s.freeTier !== null);
}

/**
 * Get all services that have external APIs for usage data
 */
function getServicesWithExternalApi(): ApiServiceConfig[] {
	return Object.values(API_SERVICES).filter((s) => s.hasExternalApi);
}

/**
 * Calculate cost for usage
 */
function calculateCost(
	serviceName: string,
	usage: number,
	transactionAmount?: number,
): number {
	const service = API_SERVICES[serviceName];
	if (!service || !service.costAfterFree) return 0;

	const { cents, perUnits, percentage, fixedCents } = service.costAfterFree;

	// For percentage-based pricing (Stripe)
	if (percentage !== undefined && transactionAmount !== undefined) {
		const percentageCost = (transactionAmount * percentage) / 100;
		const fixedCost = (fixedCents || 0) / 100;
		return percentageCost + fixedCost;
	}

	// For unit-based pricing
	if (cents !== undefined && perUnits !== undefined) {
		return (usage / perUnits) * cents;
	}

	return 0;
}

/**
 * Calculate free tier percentage used
 */
export function calculateFreeTierPercentage(
	serviceName: string,
	used: number,
): number | null {
	const service = API_SERVICES[serviceName];
	if (!service || !service.freeTier) return null;

	return Math.min(100, (used / service.freeTier.limit) * 100);
}

/**
 * Get alert level based on usage
 */
export function getAlertLevel(
	serviceName: string,
	percentUsed: number,
): "ok" | "warning" | "critical" {
	const service = API_SERVICES[serviceName];
	if (!service) return "ok";

	if (percentUsed >= service.criticalThresholdPct) return "critical";
	if (percentUsed >= service.warningThresholdPct) return "warning";
	return "ok";
}

/**
 * Service categories with display names
 */
const SERVICE_CATEGORIES: Record<
	ServiceCategory,
	{ displayName: string; icon: string }
> = {
	ai: { displayName: "AI Services", icon: "brain" },
	google_maps: { displayName: "Google Maps", icon: "map" },
	infrastructure: { displayName: "Infrastructure", icon: "server" },
	communication: { displayName: "Communication", icon: "message-square" },
	data: { displayName: "Data APIs", icon: "database" },
	payments: { displayName: "Payments", icon: "credit-card" },
};
