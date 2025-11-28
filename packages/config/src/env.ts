/**
 * Centralized Environment Variable Configuration
 *
 * Single source of truth for all environment variables with type safety and validation.
 * This ensures consistent access patterns and catches missing variables at startup.
 *
 * Usage:
 * ```typescript
 * import { env } from "@stratos/config/env";
 *
 * // Access grouped configs
 * const supabaseUrl = env.supabase.url;
 * const stripeKey = env.stripe.secretKey;
 *
 * // Or access individual vars
 * const nodeEnv = env.nodeEnv;
 * ```
 */

import { z } from "zod";

// Helper to allow optional URL fields to be blank in env files
const optionalUrl = z.preprocess(
	(value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
	z.string().url().optional(),
);

// ============================================================================
// Validation Schema
// ============================================================================

const envSchema = z.object({
	// Application
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	NEXT_PUBLIC_APP_ENV: z.string().optional(),
	NEXT_PUBLIC_SITE_URL: optionalUrl,

	// Supabase
	NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
	NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
	SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
	SUPABASE_JWT_SECRET: z.string().optional(),
	SUPABASE_POOLER_URL: optionalUrl,
	WEB_SUPABASE_URL: optionalUrl,
	WEB_SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
	WEB_SUPABASE_ANON_KEY: z.string().optional(),
	ADMIN_SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
	ADMIN_JWT_SECRET: z.string().optional(),
	DATABASE_URL: z.string().optional(),
	POSTGRES_URL: z.string().optional(),
	POSTGRES_URL_NON_POOLING: z.string().optional(),
	POSTGRES_PRISMA_URL: z.string().optional(),
	POSTGRES_HOST: z.string().optional(),
	POSTGRES_USER: z.string().optional(),
	POSTGRES_PASSWORD: z.string().optional(),
	POSTGRES_DATABASE: z.string().optional(),

	// Stripe
	STRIPE_SECRET_KEY: z.string().optional(),
	NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
	STRIPE_WEBHOOK_SECRET: z.string().optional(),
	STRIPE_PRICE_ID_BASE_PLAN: z.string().optional(),
	STRIPE_PRICE_ID_ADDITIONAL_ORG: z.string().optional(),
	STRIPE_PRICE_ID_TEAM_MEMBERS: z.string().optional(),
	STRIPE_PRICE_ID_STORAGE: z.string().optional(),
	STRIPE_PRICE_ID_API_CALLS: z.string().optional(),
	STRIPE_PRICE_ID_WORKFLOWS: z.string().optional(),
	STRIPE_PRICE_ID_PAYMENTS: z.string().optional(),
	STRIPE_PRICE_ID_PHONE_MINUTES: z.string().optional(),
	STRIPE_PRICE_ID_VIDEO_MINUTES: z.string().optional(),
	STRIPE_PRICE_ID_SMS: z.string().optional(),
	STRIPE_PRICE_ID_EMAILS: z.string().optional(),
	STRIPE_PRICE_ID_ESTIMATES: z.string().optional(),
	STRIPE_PRICE_ID_INVOICES: z.string().optional(),

	// Telnyx
	TELNYX_API_KEY: z.string().optional(),
	TELNYX_PUBLIC_KEY: z.string().optional(),
	TELNYX_WEBHOOK_SECRET: z.string().optional(),
	TELNYX_SKIP_SIGNATURE_VERIFICATION: z.string().optional(),
	NEXT_PUBLIC_TELNYX_CONNECTION_ID: z.string().optional(),

	// Resend
	RESEND_API_KEY: z.string().optional(),
	RESEND_FROM_EMAIL: z.string().email().optional(),
	RESEND_FROM_NAME: z.string().optional(),
	RESEND_WEBHOOK_SECRET: z.string().optional(),
	RESEND_WAITLIST_AUDIENCE_ID: z.string().optional(),

	// Plaid
	PLAID_CLIENT_ID: z.string().optional(),
	PLAID_SECRET: z.string().optional(),
	PLAID_ENV: z.enum(["sandbox", "development", "production"]).optional(),

	// AI Providers
	AI_GATEWAY_URL: optionalUrl,
	AI_GATEWAY_TOKEN: z.string().optional(),
	AI_PROVIDER: z.string().optional(),
	AI_MODEL: z.string().optional(),
	OPENAI_API_KEY: z.string().optional(),
	ANTHROPIC_API_KEY: z.string().optional(),
	GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),

	// Google Services
	NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
	NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: z.string().optional(),
	GOOGLE_CLIENT_ID: z.string().optional(),
	GOOGLE_CLIENT_SECRET: z.string().optional(),
	GOOGLE_SEARCH_ENGINE_ID: z.string().optional(),

	// Data Enrichment
	HUNTER_API_KEY: z.string().optional(),
	RENTCAST_API_KEY: z.string().optional(),

	// Security
	CRON_SECRET: z.string().optional(),
	INVITATION_SECRET: z.string().optional(),
	TOKEN_ENCRYPTION_KEY: z.string().optional(),

	// Redis
	REDIS_ENABLE_WEBHOOK_DEDUP: z.string().optional(),
	REDIS_ENABLE_RATE_LIMITING: z.string().optional(),
	REDIS_ENABLE_SESSION_CACHE: z.string().optional(),

	// Twilio
	TWILIO_ACCOUNT_SID: z.string().optional(),
	TWILIO_AUTH_TOKEN: z.string().optional(),
	TWILIO_PHONE_NUMBER: z.string().optional(),
	TWILIO_MESSAGING_SERVICE_SID: z.string().optional(),
	TWILIO_WEBHOOK_URL: optionalUrl,

	// Platform
	PLATFORM_EMAIL_DOMAIN: z.string().optional(),
	NEXT_PUBLIC_ADMIN_URL: optionalUrl,

	// Spam Filter
	ENABLE_SPAM_FILTER: z.string().optional(),
	AI_SPAM_CONFIDENCE_THRESHOLD: z.string().optional(),
	SPAM_FILTER_THRESHOLD: z.string().optional(),
	SPAM_FILTER_UNCERTAIN_THRESHOLD: z.string().optional(),

	// Build
	SKIP_ENV_VALIDATION: z.string().optional(),
});

// ============================================================================
// Parse and Validate
// ============================================================================

const parseEnv = () => {
	// Get process.env safely (works in Node.js environments)
	const env = typeof process !== "undefined" && process.env ? process.env : {};

	// Skip validation if explicitly requested (useful for build time)
	if (env.SKIP_ENV_VALIDATION === "true") {
		return env as z.infer<typeof envSchema>;
	}

	try {
		return envSchema.parse(env);
	} catch (err: unknown) {
		if (err instanceof z.ZodError) {
			const zodError = err as z.ZodError;
			const missing = zodError.errors
				.filter((e: z.ZodIssue) => e.code === "invalid_type" && e.received === "undefined")
				.map((e: z.ZodIssue) => e.path.join("."));

			if (missing.length > 0) {
				console.warn(
					`[Env Config] Missing optional environment variables: ${missing.join(", ")}`,
				);
			}

			// In development, show all errors
			if (env.NODE_ENV === "development") {
				console.error("[Env Config] Validation errors:", zodError.errors);
			}
		}
		// Return parsed env anyway (non-blocking validation)
		return env as z.infer<typeof envSchema>;
	}
};

const parsedEnv = parseEnv();

// ============================================================================
// Typed Environment Access
// ============================================================================

/**
 * Centralized environment variable configuration
 * Grouped by service for easy access
 */
export const env = {
	// Application
	nodeEnv: parsedEnv.NODE_ENV || "development",
	appEnv: parsedEnv.NEXT_PUBLIC_APP_ENV,
	siteUrl: parsedEnv.NEXT_PUBLIC_SITE_URL,
	skipValidation: parsedEnv.SKIP_ENV_VALIDATION === "true",

	// Supabase
	supabase: {
		url: parsedEnv.NEXT_PUBLIC_SUPABASE_URL,
		anonKey: parsedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		serviceRoleKey:
			parsedEnv.SUPABASE_SERVICE_ROLE_KEY ||
			parsedEnv.WEB_SUPABASE_SERVICE_ROLE_KEY,
		jwtSecret: parsedEnv.SUPABASE_JWT_SECRET,
		poolerUrl: parsedEnv.SUPABASE_POOLER_URL,
		webUrl: parsedEnv.WEB_SUPABASE_URL,
		webServiceRoleKey: parsedEnv.WEB_SUPABASE_SERVICE_ROLE_KEY,
		webAnonKey: parsedEnv.WEB_SUPABASE_ANON_KEY,
		adminServiceRoleKey: parsedEnv.ADMIN_SUPABASE_SERVICE_ROLE_KEY,
		adminJwtSecret: parsedEnv.ADMIN_JWT_SECRET,
		databaseUrl: parsedEnv.DATABASE_URL,
		postgresUrl: parsedEnv.POSTGRES_URL,
		postgresUrlNonPooling: parsedEnv.POSTGRES_URL_NON_POOLING,
		postgresPrismaUrl: parsedEnv.POSTGRES_PRISMA_URL,
		postgresHost: parsedEnv.POSTGRES_HOST,
		postgresUser: parsedEnv.POSTGRES_USER,
		postgresPassword: parsedEnv.POSTGRES_PASSWORD,
		postgresDatabase: parsedEnv.POSTGRES_DATABASE,
	},

	// Stripe
	stripe: {
		secretKey: parsedEnv.STRIPE_SECRET_KEY,
		publishableKey: parsedEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
		webhookSecret: parsedEnv.STRIPE_WEBHOOK_SECRET,
		priceIds: {
			basePlan: parsedEnv.STRIPE_PRICE_ID_BASE_PLAN,
			additionalOrg: parsedEnv.STRIPE_PRICE_ID_ADDITIONAL_ORG,
			teamMembers: parsedEnv.STRIPE_PRICE_ID_TEAM_MEMBERS,
			storage: parsedEnv.STRIPE_PRICE_ID_STORAGE,
			apiCalls: parsedEnv.STRIPE_PRICE_ID_API_CALLS,
			workflows: parsedEnv.STRIPE_PRICE_ID_WORKFLOWS,
			payments: parsedEnv.STRIPE_PRICE_ID_PAYMENTS,
			phoneMinutes: parsedEnv.STRIPE_PRICE_ID_PHONE_MINUTES,
			videoMinutes: parsedEnv.STRIPE_PRICE_ID_VIDEO_MINUTES,
			sms: parsedEnv.STRIPE_PRICE_ID_SMS,
			emails: parsedEnv.STRIPE_PRICE_ID_EMAILS,
			estimates: parsedEnv.STRIPE_PRICE_ID_ESTIMATES,
			invoices: parsedEnv.STRIPE_PRICE_ID_INVOICES,
		},
	},

	// Telnyx
	telnyx: {
		apiKey: parsedEnv.TELNYX_API_KEY,
		publicKey: parsedEnv.TELNYX_PUBLIC_KEY,
		webhookSecret: parsedEnv.TELNYX_WEBHOOK_SECRET,
		skipSignatureVerification:
			parsedEnv.TELNYX_SKIP_SIGNATURE_VERIFICATION === "true",
		connectionId: parsedEnv.NEXT_PUBLIC_TELNYX_CONNECTION_ID,
	},

	// Resend
	resend: {
		apiKey: parsedEnv.RESEND_API_KEY,
		fromEmail: parsedEnv.RESEND_FROM_EMAIL,
		fromName: parsedEnv.RESEND_FROM_NAME,
		webhookSecret: parsedEnv.RESEND_WEBHOOK_SECRET,
		waitlistAudienceId: parsedEnv.RESEND_WAITLIST_AUDIENCE_ID,
	},

	// Plaid
	plaid: {
		clientId: parsedEnv.PLAID_CLIENT_ID,
		secret: parsedEnv.PLAID_SECRET,
		env: parsedEnv.PLAID_ENV || "sandbox",
	},

	// AI Providers
	ai: {
		gatewayUrl: parsedEnv.AI_GATEWAY_URL,
		gatewayToken: parsedEnv.AI_GATEWAY_TOKEN,
		provider: parsedEnv.AI_PROVIDER,
		model: parsedEnv.AI_MODEL,
		openaiApiKey: parsedEnv.OPENAI_API_KEY,
		anthropicApiKey: parsedEnv.ANTHROPIC_API_KEY,
		googleGenerativeAiApiKey: parsedEnv.GOOGLE_GENERATIVE_AI_API_KEY,
	},

	// Google Services
	google: {
		mapsApiKey: parsedEnv.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
		placesApiKey: parsedEnv.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
		clientId: parsedEnv.GOOGLE_CLIENT_ID,
		clientSecret: parsedEnv.GOOGLE_CLIENT_SECRET,
		searchEngineId: parsedEnv.GOOGLE_SEARCH_ENGINE_ID,
	},

	// Data Enrichment
	enrichment: {
		hunterApiKey: parsedEnv.HUNTER_API_KEY,
		rentcastApiKey: parsedEnv.RENTCAST_API_KEY,
	},

	// Security
	security: {
		cronSecret: parsedEnv.CRON_SECRET,
		invitationSecret: parsedEnv.INVITATION_SECRET,
		tokenEncryptionKey: parsedEnv.TOKEN_ENCRYPTION_KEY,
	},

	// Redis
	redis: {
		enableWebhookDedup: parsedEnv.REDIS_ENABLE_WEBHOOK_DEDUP === "true",
		enableRateLimiting: parsedEnv.REDIS_ENABLE_RATE_LIMITING === "true",
		enableSessionCache: parsedEnv.REDIS_ENABLE_SESSION_CACHE === "true",
	},

	// Twilio
	twilio: {
		accountSid: parsedEnv.TWILIO_ACCOUNT_SID,
		authToken: parsedEnv.TWILIO_AUTH_TOKEN,
		phoneNumber: parsedEnv.TWILIO_PHONE_NUMBER,
		messagingServiceSid: parsedEnv.TWILIO_MESSAGING_SERVICE_SID,
		webhookUrl: parsedEnv.TWILIO_WEBHOOK_URL,
	},

	// Platform
	platform: {
		emailDomain: parsedEnv.PLATFORM_EMAIL_DOMAIN,
		adminUrl: parsedEnv.NEXT_PUBLIC_ADMIN_URL,
	},

	// Spam Filter
	spamFilter: {
		enabled: parsedEnv.ENABLE_SPAM_FILTER === "true",
		aiConfidenceThreshold: parsedEnv.AI_SPAM_CONFIDENCE_THRESHOLD
			? parseFloat(parsedEnv.AI_SPAM_CONFIDENCE_THRESHOLD)
			: undefined,
		threshold: parsedEnv.SPAM_FILTER_THRESHOLD
			? parseFloat(parsedEnv.SPAM_FILTER_THRESHOLD)
			: undefined,
		uncertainThreshold: parsedEnv.SPAM_FILTER_UNCERTAIN_THRESHOLD
			? parseFloat(parsedEnv.SPAM_FILTER_UNCERTAIN_THRESHOLD)
			: undefined,
	},
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get required environment variable or throw error
 */
export function requireEnv(key: string): string {
	const value = parsedEnv[key as keyof typeof parsedEnv];
	if (!value || typeof value !== "string") {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return value;
}

/**
 * Check if environment variable is set
 */
export function hasEnv(key: keyof typeof parsedEnv): boolean {
	return !!parsedEnv[key];
}

/**
 * Get environment variable with default value
 */
export function getEnv(
	key: keyof typeof parsedEnv,
	defaultValue: string,
): string {
	return parsedEnv[key] || defaultValue;
}

// Export type for use in other files
export type EnvConfig = typeof env;
