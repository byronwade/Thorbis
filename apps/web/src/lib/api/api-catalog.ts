/**
 * API Service Catalog
 *
 * Comprehensive catalog of all external APIs and services used by Stratos.
 * Includes pricing, free tiers, and usage tracking configuration.
 */

export type ServiceCategory =
	| "ai"
	| "communications"
	| "payments"
	| "google_cloud"
	| "data_enrichment"
	| "infrastructure";

export type BillingPeriod = "monthly" | "daily" | "yearly" | "per_use";

export type ServiceStatus = "active" | "inactive" | "deprecated" | "beta";

export interface FreeTier {
	limit: number;
	unit: string;
	period: BillingPeriod;
}

export interface Pricing {
	perUnit: number;
	unit: string;
	currency: "USD";
	minimumCharge?: number;
	volumeDiscounts?: { threshold: number; perUnit: number }[];
}

export interface ApiService {
	id: string;
	name: string;
	provider: string;
	category: ServiceCategory;
	description: string;
	freeTier: FreeTier | null;
	pricing: Pricing;
	envVar: string;
	docsUrl: string;
	pricingUrl: string;
	icon?: string;
	status: ServiceStatus;
	trackingEnabled: boolean;
}

/**
 * Complete catalog of all API services
 */
export const API_SERVICE_CATALOG: ApiService[] = [
	// ============================================
	// AI / LLM Services
	// ============================================
	{
		id: "openai_gpt4",
		name: "OpenAI GPT-4",
		provider: "OpenAI",
		category: "ai",
		description: "GPT-4 and GPT-4 Turbo language models",
		freeTier: null,
		pricing: { perUnit: 0.03, unit: "1K input tokens", currency: "USD" },
		envVar: "OPENAI_API_KEY",
		docsUrl: "https://platform.openai.com/docs",
		pricingUrl: "https://openai.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "openai_gpt4o",
		name: "OpenAI GPT-4o",
		provider: "OpenAI",
		category: "ai",
		description: "GPT-4o multimodal model",
		freeTier: null,
		pricing: { perUnit: 0.005, unit: "1K input tokens", currency: "USD" },
		envVar: "OPENAI_API_KEY",
		docsUrl: "https://platform.openai.com/docs",
		pricingUrl: "https://openai.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "openai_gpt4o_mini",
		name: "OpenAI GPT-4o Mini",
		provider: "OpenAI",
		category: "ai",
		description: "Cost-effective GPT-4o mini model",
		freeTier: null,
		pricing: { perUnit: 0.00015, unit: "1K input tokens", currency: "USD" },
		envVar: "OPENAI_API_KEY",
		docsUrl: "https://platform.openai.com/docs",
		pricingUrl: "https://openai.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "openai_embeddings",
		name: "OpenAI Embeddings",
		provider: "OpenAI",
		category: "ai",
		description: "Text embedding models (ada-002, text-embedding-3)",
		freeTier: null,
		pricing: { perUnit: 0.00002, unit: "1K tokens", currency: "USD" },
		envVar: "OPENAI_API_KEY",
		docsUrl: "https://platform.openai.com/docs",
		pricingUrl: "https://openai.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "anthropic_claude",
		name: "Anthropic Claude",
		provider: "Anthropic",
		category: "ai",
		description: "Claude 3.5 Sonnet and Claude 3 models",
		freeTier: null,
		pricing: { perUnit: 0.003, unit: "1K input tokens", currency: "USD" },
		envVar: "ANTHROPIC_API_KEY",
		docsUrl: "https://docs.anthropic.com",
		pricingUrl: "https://www.anthropic.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_gemini",
		name: "Google Gemini",
		provider: "Google",
		category: "ai",
		description: "Gemini 1.5 Pro and Flash models",
		freeTier: { limit: 15, unit: "requests/minute", period: "per_use" },
		pricing: { perUnit: 0.000125, unit: "1K input tokens", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://ai.google.dev/docs",
		pricingUrl: "https://ai.google.dev/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "groq",
		name: "Groq",
		provider: "Groq",
		category: "ai",
		description: "Ultra-fast LLM inference (Llama, Mixtral)",
		freeTier: { limit: 14400, unit: "requests/day", period: "daily" },
		pricing: { perUnit: 0.00005, unit: "1K tokens", currency: "USD" },
		envVar: "GROQ_API_KEY",
		docsUrl: "https://console.groq.com/docs",
		pricingUrl: "https://groq.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "assemblyai",
		name: "AssemblyAI",
		provider: "AssemblyAI",
		category: "ai",
		description: "Speech-to-text, call transcription",
		freeTier: { limit: 100, unit: "hours", period: "monthly" },
		pricing: { perUnit: 0.00025, unit: "second", currency: "USD" },
		envVar: "ASSEMBLYAI_API_KEY",
		docsUrl: "https://www.assemblyai.com/docs",
		pricingUrl: "https://www.assemblyai.com/pricing",
		status: "active",
		trackingEnabled: true,
	},

	// ============================================
	// Communication Services
	// ============================================
	{
		id: "sendgrid",
		name: "SendGrid",
		provider: "Twilio SendGrid",
		category: "communications",
		description: "Transactional and marketing email delivery",
		freeTier: { limit: 100, unit: "emails/day", period: "daily" },
		pricing: { perUnit: 0.00035, unit: "email", currency: "USD" },
		envVar: "SENDGRID_API_KEY",
		docsUrl: "https://docs.sendgrid.com",
		pricingUrl: "https://sendgrid.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "postmark",
		name: "Postmark",
		provider: "Postmark",
		category: "communications",
		description: "Transactional email (fallback)",
		freeTier: { limit: 100, unit: "emails", period: "monthly" },
		pricing: { perUnit: 0.001, unit: "email", currency: "USD" },
		envVar: "POSTMARK_API_KEY",
		docsUrl: "https://postmarkapp.com/developer",
		pricingUrl: "https://postmarkapp.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "twilio_sms",
		name: "Twilio SMS",
		provider: "Twilio",
		category: "communications",
		description: "SMS and MMS messaging",
		freeTier: null,
		pricing: { perUnit: 0.0079, unit: "message", currency: "USD" },
		envVar: "TWILIO_AUTH_TOKEN",
		docsUrl: "https://www.twilio.com/docs/sms",
		pricingUrl: "https://www.twilio.com/sms/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "twilio_voice",
		name: "Twilio Voice",
		provider: "Twilio",
		category: "communications",
		description: "Programmable voice calls and phone numbers",
		freeTier: null,
		pricing: { perUnit: 0.0085, unit: "minute", currency: "USD" },
		envVar: "TWILIO_AUTH_TOKEN",
		docsUrl: "https://www.twilio.com/docs/voice",
		pricingUrl: "https://www.twilio.com/voice/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "twilio_numbers",
		name: "Twilio Phone Numbers",
		provider: "Twilio",
		category: "communications",
		description: "Phone number rental and management",
		freeTier: null,
		pricing: { perUnit: 1.15, unit: "number/month", currency: "USD" },
		envVar: "TWILIO_AUTH_TOKEN",
		docsUrl: "https://www.twilio.com/docs/phone-numbers",
		pricingUrl: "https://www.twilio.com/phone-numbers/pricing",
		status: "active",
		trackingEnabled: true,
	},

	// ============================================
	// Payment Services
	// ============================================
	{
		id: "stripe",
		name: "Stripe",
		provider: "Stripe",
		category: "payments",
		description: "Subscription billing and payments",
		freeTier: null,
		pricing: { perUnit: 2.9, unit: "% + $0.30/txn", currency: "USD" },
		envVar: "STRIPE_SECRET_KEY",
		docsUrl: "https://stripe.com/docs",
		pricingUrl: "https://stripe.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "plaid",
		name: "Plaid",
		provider: "Plaid",
		category: "payments",
		description: "Bank account linking and verification",
		freeTier: { limit: 100, unit: "items", period: "monthly" },
		pricing: { perUnit: 0.3, unit: "item/month", currency: "USD" },
		envVar: "PLAID_SECRET",
		docsUrl: "https://plaid.com/docs",
		pricingUrl: "https://plaid.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "adyen",
		name: "Adyen",
		provider: "Adyen",
		category: "payments",
		description: "High-value payment processing",
		freeTier: null,
		pricing: { perUnit: 0.1, unit: "% + $0.12/txn", currency: "USD" },
		envVar: "ADYEN_API_KEY",
		docsUrl: "https://docs.adyen.com",
		pricingUrl: "https://www.adyen.com/pricing",
		status: "active",
		trackingEnabled: true,
	},

	// ============================================
	// Google Cloud Services
	// ============================================
	{
		id: "google_maps_geocoding",
		name: "Google Geocoding",
		provider: "Google",
		category: "google_cloud",
		description: "Address to coordinates conversion",
		freeTier: { limit: 200, unit: "requests/day", period: "daily" },
		pricing: { perUnit: 0.005, unit: "request", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://developers.google.com/maps/documentation/geocoding",
		pricingUrl: "https://developers.google.com/maps/billing-and-pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_maps_places",
		name: "Google Places",
		provider: "Google",
		category: "google_cloud",
		description: "Place search and details",
		freeTier: { limit: 200, unit: "requests/day", period: "daily" },
		pricing: { perUnit: 0.017, unit: "request", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://developers.google.com/maps/documentation/places",
		pricingUrl: "https://developers.google.com/maps/billing-and-pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_maps_directions",
		name: "Google Directions",
		provider: "Google",
		category: "google_cloud",
		description: "Route planning and directions",
		freeTier: { limit: 200, unit: "requests/day", period: "daily" },
		pricing: { perUnit: 0.005, unit: "request", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://developers.google.com/maps/documentation/directions",
		pricingUrl: "https://developers.google.com/maps/billing-and-pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_maps_distance",
		name: "Google Distance Matrix",
		provider: "Google",
		category: "google_cloud",
		description: "Travel time and distance calculations",
		freeTier: { limit: 200, unit: "elements/day", period: "daily" },
		pricing: { perUnit: 0.005, unit: "element", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://developers.google.com/maps/documentation/distance-matrix",
		pricingUrl: "https://developers.google.com/maps/billing-and-pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_maps_javascript",
		name: "Google Maps JavaScript",
		provider: "Google",
		category: "google_cloud",
		description: "Interactive maps embedding",
		freeTier: { limit: 28000, unit: "loads/month", period: "monthly" },
		pricing: { perUnit: 0.007, unit: "load", currency: "USD" },
		envVar: "NEXT_PUBLIC_GOOGLE_MAPS_KEY",
		docsUrl: "https://developers.google.com/maps/documentation/javascript",
		pricingUrl: "https://developers.google.com/maps/billing-and-pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_vision_ai",
		name: "Google Vision AI",
		provider: "Google",
		category: "google_cloud",
		description: "Image analysis, OCR, object detection",
		freeTier: { limit: 1000, unit: "requests/month", period: "monthly" },
		pricing: { perUnit: 0.0015, unit: "request", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://cloud.google.com/vision/docs",
		pricingUrl: "https://cloud.google.com/vision/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_document_ai",
		name: "Google Document AI",
		provider: "Google",
		category: "google_cloud",
		description: "Document parsing and extraction",
		freeTier: { limit: 1000, unit: "pages/month", period: "monthly" },
		pricing: { perUnit: 0.01, unit: "page", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://cloud.google.com/document-ai/docs",
		pricingUrl: "https://cloud.google.com/document-ai/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_speech_to_text",
		name: "Google Speech-to-Text",
		provider: "Google",
		category: "google_cloud",
		description: "Audio transcription",
		freeTier: { limit: 60, unit: "minutes/month", period: "monthly" },
		pricing: { perUnit: 0.006, unit: "15 seconds", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://cloud.google.com/speech-to-text/docs",
		pricingUrl: "https://cloud.google.com/speech-to-text/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_text_to_speech",
		name: "Google Text-to-Speech",
		provider: "Google",
		category: "google_cloud",
		description: "Audio synthesis from text",
		freeTier: { limit: 1000000, unit: "characters/month", period: "monthly" },
		pricing: { perUnit: 0.000004, unit: "character", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://cloud.google.com/text-to-speech/docs",
		pricingUrl: "https://cloud.google.com/text-to-speech/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_translate",
		name: "Google Translation",
		provider: "Google",
		category: "google_cloud",
		description: "Language translation",
		freeTier: { limit: 500000, unit: "characters/month", period: "monthly" },
		pricing: { perUnit: 0.00002, unit: "character", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://cloud.google.com/translate/docs",
		pricingUrl: "https://cloud.google.com/translate/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_weather",
		name: "Google Weather API",
		provider: "Google",
		category: "google_cloud",
		description: "Weather forecasts and conditions",
		freeTier: { limit: 1000, unit: "requests/day", period: "daily" },
		pricing: { perUnit: 0.002, unit: "request", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://developers.google.com/maps/documentation/environment",
		pricingUrl: "https://developers.google.com/maps/billing-and-pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_air_quality",
		name: "Google Air Quality",
		provider: "Google",
		category: "google_cloud",
		description: "Air quality index data",
		freeTier: { limit: 500, unit: "requests/day", period: "daily" },
		pricing: { perUnit: 0.005, unit: "request", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://developers.google.com/maps/documentation/air-quality",
		pricingUrl: "https://developers.google.com/maps/billing-and-pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_solar",
		name: "Google Solar API",
		provider: "Google",
		category: "google_cloud",
		description: "Solar panel potential analysis",
		freeTier: { limit: 100, unit: "requests/day", period: "daily" },
		pricing: { perUnit: 0.01, unit: "request", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://developers.google.com/maps/documentation/solar",
		pricingUrl: "https://developers.google.com/maps/billing-and-pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_route_optimization",
		name: "Google Route Optimization",
		provider: "Google",
		category: "google_cloud",
		description: "Fleet routing and scheduling",
		freeTier: null,
		pricing: { perUnit: 0.01, unit: "vehicle", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://developers.google.com/maps/documentation/route-optimization",
		pricingUrl: "https://developers.google.com/maps/billing-and-pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_address_validation",
		name: "Google Address Validation",
		provider: "Google",
		category: "google_cloud",
		description: "Address verification and standardization",
		freeTier: { limit: 100, unit: "requests/month", period: "monthly" },
		pricing: { perUnit: 0.017, unit: "request", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://developers.google.com/maps/documentation/address-validation",
		pricingUrl: "https://developers.google.com/maps/billing-and-pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "google_calendar",
		name: "Google Calendar API",
		provider: "Google",
		category: "google_cloud",
		description: "Calendar sync and management",
		freeTier: { limit: 1000000, unit: "requests/day", period: "daily" },
		pricing: { perUnit: 0, unit: "request", currency: "USD" },
		envVar: "GOOGLE_API_KEY",
		docsUrl: "https://developers.google.com/calendar",
		pricingUrl: "https://developers.google.com/calendar",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "gmail_api",
		name: "Gmail API",
		provider: "Google",
		category: "google_cloud",
		description: "Email sending via user accounts",
		freeTier: { limit: 1000000, unit: "requests/day", period: "daily" },
		pricing: { perUnit: 0, unit: "request", currency: "USD" },
		envVar: "GOOGLE_CLIENT_ID",
		docsUrl: "https://developers.google.com/gmail/api",
		pricingUrl: "https://developers.google.com/gmail/api",
		status: "active",
		trackingEnabled: true,
	},

	// ============================================
	// Data Enrichment Services
	// ============================================
	{
		id: "attom_property",
		name: "ATTOM Property Data",
		provider: "ATTOM",
		category: "data_enrichment",
		description: "Property data, valuations, sales history",
		freeTier: null,
		pricing: { perUnit: 0.05, unit: "request", currency: "USD" },
		envVar: "ATTOM_API_KEY",
		docsUrl: "https://api.gateway.attomdata.com/propertyapi/v1.0.0/docs",
		pricingUrl: "https://www.attomdata.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "shovels",
		name: "Shovels",
		provider: "Shovels",
		category: "data_enrichment",
		description: "Building permits and contractor data",
		freeTier: { limit: 100, unit: "requests/month", period: "monthly" },
		pricing: { perUnit: 0.03, unit: "request", currency: "USD" },
		envVar: "SHOVELS_API_KEY",
		docsUrl: "https://docs.shovels.ai",
		pricingUrl: "https://www.shovels.ai/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "walkscore",
		name: "Walk Score",
		provider: "Walk Score",
		category: "data_enrichment",
		description: "Walkability, transit, and bike scores",
		freeTier: { limit: 5000, unit: "requests/day", period: "daily" },
		pricing: { perUnit: 0.01, unit: "request", currency: "USD" },
		envVar: "WALKSCORE_API_KEY",
		docsUrl: "https://www.walkscore.com/professional/api.php",
		pricingUrl: "https://www.walkscore.com/professional/api.php",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "crimeometer",
		name: "CrimeoMeter",
		provider: "CrimeoMeter",
		category: "data_enrichment",
		description: "Crime data and safety scores",
		freeTier: { limit: 1000, unit: "requests/month", period: "monthly" },
		pricing: { perUnit: 0.05, unit: "request", currency: "USD" },
		envVar: "CRIMEOMETER_API_KEY",
		docsUrl: "https://www.crimeometer.com/crime-data-api",
		pricingUrl: "https://www.crimeometer.com/crime-data-api",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "rentcast",
		name: "RentCast",
		provider: "RentCast",
		category: "data_enrichment",
		description: "Rental valuations and market data",
		freeTier: { limit: 50, unit: "requests/month", period: "monthly" },
		pricing: { perUnit: 0.1, unit: "request", currency: "USD" },
		envVar: "RENTCAST_API_KEY",
		docsUrl: "https://developers.rentcast.io",
		pricingUrl: "https://www.rentcast.io/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "hunter_io",
		name: "Hunter.io",
		provider: "Hunter",
		category: "data_enrichment",
		description: "Email verification and enrichment",
		freeTier: { limit: 25, unit: "requests/month", period: "monthly" },
		pricing: { perUnit: 0.01, unit: "request", currency: "USD" },
		envVar: "HUNTER_API_KEY",
		docsUrl: "https://hunter.io/api-documentation",
		pricingUrl: "https://hunter.io/pricing",
		status: "active",
		trackingEnabled: true,
	},

	// ============================================
	// Infrastructure Services
	// ============================================
	{
		id: "supabase",
		name: "Supabase",
		provider: "Supabase",
		category: "infrastructure",
		description: "PostgreSQL database, Auth, Storage",
		freeTier: { limit: 500, unit: "MB database", period: "monthly" },
		pricing: { perUnit: 25, unit: "base/month", currency: "USD" },
		envVar: "NEXT_PUBLIC_SUPABASE_URL",
		docsUrl: "https://supabase.com/docs",
		pricingUrl: "https://supabase.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "supabase_storage",
		name: "Supabase Storage",
		provider: "Supabase",
		category: "infrastructure",
		description: "File storage and CDN",
		freeTier: { limit: 1, unit: "GB", period: "monthly" },
		pricing: { perUnit: 0.021, unit: "GB/month", currency: "USD" },
		envVar: "NEXT_PUBLIC_SUPABASE_URL",
		docsUrl: "https://supabase.com/docs/guides/storage",
		pricingUrl: "https://supabase.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "supabase_bandwidth",
		name: "Supabase Bandwidth",
		provider: "Supabase",
		category: "infrastructure",
		description: "Database and storage egress",
		freeTier: { limit: 5, unit: "GB", period: "monthly" },
		pricing: { perUnit: 0.09, unit: "GB", currency: "USD" },
		envVar: "NEXT_PUBLIC_SUPABASE_URL",
		docsUrl: "https://supabase.com/docs",
		pricingUrl: "https://supabase.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "vercel",
		name: "Vercel",
		provider: "Vercel",
		category: "infrastructure",
		description: "Hosting and edge functions",
		freeTier: { limit: 100, unit: "GB bandwidth", period: "monthly" },
		pricing: { perUnit: 20, unit: "base/month", currency: "USD" },
		envVar: "VERCEL_TOKEN",
		docsUrl: "https://vercel.com/docs",
		pricingUrl: "https://vercel.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
	{
		id: "vercel_edge_functions",
		name: "Vercel Edge Functions",
		provider: "Vercel",
		category: "infrastructure",
		description: "Serverless edge compute",
		freeTier: { limit: 100000, unit: "invocations", period: "monthly" },
		pricing: { perUnit: 0.000002, unit: "invocation", currency: "USD" },
		envVar: "VERCEL_TOKEN",
		docsUrl: "https://vercel.com/docs/functions",
		pricingUrl: "https://vercel.com/pricing",
		status: "active",
		trackingEnabled: true,
	},
];

/**
 * Get services by category
 */
export function getServicesByCategory(
	category: ServiceCategory,
): ApiService[] {
	return API_SERVICE_CATALOG.filter((s) => s.category === category);
}

/**
 * Get service by ID
 */
export function getServiceById(id: string): ApiService | undefined {
	return API_SERVICE_CATALOG.find((s) => s.id === id);
}

/**
 * Get all active services
 */
export function getActiveServices(): ApiService[] {
	return API_SERVICE_CATALOG.filter((s) => s.status === "active");
}

/**
 * Category display names and icons
 */
export const CATEGORY_META: Record<
	ServiceCategory,
	{ name: string; icon: string; color: string }
> = {
	ai: { name: "AI & LLM", icon: "Bot", color: "purple" },
	communications: { name: "Communications", icon: "MessageSquare", color: "blue" },
	payments: { name: "Payments", icon: "CreditCard", color: "green" },
	google_cloud: { name: "Google Cloud", icon: "Cloud", color: "red" },
	data_enrichment: { name: "Data Enrichment", icon: "Database", color: "orange" },
	infrastructure: { name: "Infrastructure", icon: "Server", color: "gray" },
};

/**
 * Calculate usage percentage
 */
export function calculateUsagePercentage(
	used: number,
	freeTierLimit: number | null,
): number | null {
	if (freeTierLimit === null || freeTierLimit === 0) return null;
	return Math.round((used / freeTierLimit) * 100);
}

/**
 * Calculate overage cost
 */
export function calculateOverageCost(
	used: number,
	freeTierLimit: number | null,
	perUnitCost: number,
): number {
	if (freeTierLimit === null) {
		return used * perUnitCost;
	}
	const overage = Math.max(0, used - freeTierLimit);
	return overage * perUnitCost;
}

/**
 * Get status based on usage percentage
 */
export function getUsageStatus(
	percentage: number | null,
): "ok" | "warning" | "critical" | "over" {
	if (percentage === null) return "ok";
	if (percentage >= 100) return "over";
	if (percentage >= 90) return "critical";
	if (percentage >= 70) return "warning";
	return "ok";
}

/**
 * Mapping from tracker api_name + endpoint to catalog service IDs
 * Used to connect the external-api-tracker data to the service catalog
 */
export const TRACKER_TO_CATALOG_MAP: Record<string, string | ((endpoint: string) => string)> = {
	// AI/LLM Services
	openai: (endpoint: string) => {
		if (endpoint.includes("embeddings")) return "openai_embeddings";
		if (endpoint.includes("gpt-4o-mini") || endpoint.includes("4o-mini")) return "openai_gpt4o_mini";
		if (endpoint.includes("gpt-4o") || endpoint.includes("4o")) return "openai_gpt4o";
		return "openai_gpt4"; // Default to GPT-4
	},
	anthropic: "anthropic_claude",
	google_gemini: "google_gemini",
	groq: "groq",
	assemblyai: "assemblyai",

	// Communications
	sendgrid: "sendgrid",
	postmark: "postmark",
	twilio: (endpoint: string) => {
		if (endpoint.includes("messages") || endpoint.includes("sms") || endpoint.includes("mms")) return "twilio_sms";
		if (endpoint.includes("calls") || endpoint.includes("voice")) return "twilio_voice";
		if (endpoint.includes("number")) return "twilio_numbers";
		return "twilio_sms"; // Default to SMS
	},

	// Payments
	stripe: "stripe",
	plaid: "plaid",
	adyen: "adyen",

	// Google Cloud Services
	google_maps: (endpoint: string) => {
		if (endpoint.includes("geocod")) return "google_maps_geocoding";
		if (endpoint.includes("direction")) return "google_maps_directions";
		if (endpoint.includes("distance")) return "google_maps_distance";
		return "google_maps_geocoding"; // Default
	},
	google_places: "google_maps_places",
	google_geocoding: "google_maps_geocoding",
	google_directions: "google_maps_directions",
	google_distance: "google_maps_distance",
	google_vision: "google_vision_ai",
	google_document: "google_document_ai",
	google_speech: "google_speech_to_text",
	google_text_to_speech: "google_text_to_speech",
	google_translation: "google_translation",
	google_weather: "google_weather",
	google_air_quality: "google_air_quality",
	google_solar: "google_solar",
	google_routes: "google_route_optimization",
	google_address_validation: "google_address_validation",
	google_calendar: "google_calendar",
	gmail: "gmail_api",

	// Data Enrichment
	attom: "attom_property",
	shovels: "shovels",
	walkscore: "walkscore",
	crimeometer: "crimeometer",
	rentcast: "rentcast",
	hunter: "hunter_io",

	// Infrastructure
	supabase: "supabase",
	vercel: "vercel",
};

/**
 * Get catalog service ID from tracker api_name and endpoint
 */
export function getServiceIdFromTracker(apiName: string, endpoint: string = ""): string | null {
	const mapping = TRACKER_TO_CATALOG_MAP[apiName.toLowerCase()];

	if (!mapping) {
		// Try direct match with catalog ID
		const directMatch = API_SERVICE_CATALOG.find(
			(s) => s.id === apiName || s.id === apiName.toLowerCase().replace(/-/g, "_")
		);
		return directMatch?.id ?? null;
	}

	if (typeof mapping === "function") {
		return mapping(endpoint);
	}

	return mapping;
}

/**
 * Get all tracker api_names that map to a specific catalog service ID
 */
export function getTrackerNamesForServiceId(serviceId: string): string[] {
	const names: string[] = [];

	for (const [trackerName, mapping] of Object.entries(TRACKER_TO_CATALOG_MAP)) {
		if (typeof mapping === "string" && mapping === serviceId) {
			names.push(trackerName);
		}
		// For functions, we can't know without calling, so skip
	}

	return names;
}
