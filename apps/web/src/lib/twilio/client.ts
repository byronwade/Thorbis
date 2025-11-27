/**
 * Twilio Client Configuration
 *
 * Multi-tenant Twilio client that retrieves credentials per-company.
 * Uses API Key SID + Secret (preferred) or Account SID + Auth Token.
 *
 * Environment variables are only used for global admin operations.
 * Per-company credentials are stored in company_twilio_settings table.
 */

import { createClient } from "@/lib/supabase/server";
import Twilio from "twilio";

// Global Twilio config (for admin operations only)
export const TWILIO_ADMIN_CONFIG = {
	accountSid: process.env.TWILIO_ACCOUNT_SID,
	authToken: process.env.TWILIO_AUTH_TOKEN,
	webhookBaseUrl: process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000",
};

// Twilio client cache (keyed by company ID)
const clientCache = new Map<string, Twilio.Twilio>();

/**
 * Company Twilio settings from database
 */
export type CompanyTwilioSettings = {
	company_id: string;
	account_sid: string;
	auth_token: string | null;
	api_key_sid: string | null;
	api_key_secret: string | null;
	twiml_app_sid: string | null;
	messaging_service_sid: string | null;
	verify_service_sid: string | null;
	default_from_number: string | null;
	sendgrid_api_key: string | null;
	sendgrid_from_email: string | null;
	sendgrid_from_name: string | null;
	ten_dlc_brand_sid: string | null;
	ten_dlc_campaign_sid: string | null;
	ten_dlc_status: string | null;
	webhook_url: string | null;
	webhook_secret: string | null;
	status: string | null;
	metadata: Record<string, unknown> | null;
	last_provisioned_at: string | null;
	is_active: boolean;
	created_at: string;
	updated_at: string;
};

/**
 * Get Twilio settings for a company
 * Falls back to environment variables if company settings are not found
 * 
 * This function will:
 * 1. Try to get settings from company_twilio_settings table
 * 2. If not found, fall back to environment variables (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
 * 3. Return null only if neither database nor environment variables are configured
 */
export async function getCompanyTwilioSettings(
	companyId: string,
): Promise<CompanyTwilioSettings | null> {
	const supabase = await createClient();
	
	// Try database first
	if (supabase) {
		const { data, error } = await supabase
			.from("company_twilio_settings")
			.select("*")
			.eq("company_id", companyId)
			.eq("is_active", true)
			.single();

		if (!error && data) {
			return data as CompanyTwilioSettings;
		}
		
		// If table doesn't exist or no record found, fall through to environment variables
		if (error && error.code !== "PGRST116") {
			// PGRST116 = no rows returned (expected if no settings exist)
			// Other errors might indicate table doesn't exist yet
			// Debug: console.warn(`Twilio settings query error for company ${companyId}:`, error.message);
		}
	}

	// Fallback to environment variables
	const envSettings = getEnvironmentTwilioSettings(companyId);

	if (envSettings) {
		return envSettings;
	}
	return null;
}

/**
 * Get Twilio settings from environment variables
 * This is a fallback when company_twilio_settings table is not available
 * 
 * Required environment variables:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * 
 * Optional environment variables:
 * - TWILIO_PHONE_NUMBER (default from number)
 * - TWILIO_MESSAGING_SERVICE_SID
 * - TWILIO_WEBHOOK_URL
 */
function getEnvironmentTwilioSettings(companyId: string): CompanyTwilioSettings | null {
	const accountSid = process.env.TWILIO_ACCOUNT_SID;
	const authToken = process.env.TWILIO_AUTH_TOKEN;
	const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

	if (!accountSid || !authToken) {
		return null;
	}

	// Return a mock settings object using environment variables
	return {
		company_id: companyId,
		account_sid: accountSid,
		auth_token: authToken,
		api_key_sid: null,
		api_key_secret: null,
		twiml_app_sid: null,
		messaging_service_sid: process.env.TWILIO_MESSAGING_SERVICE_SID || null,
		verify_service_sid: null,
		default_from_number: phoneNumber || null,
		sendgrid_api_key: process.env.SENDGRID_API_KEY || null,
		sendgrid_from_email: process.env.SENDGRID_FROM_EMAIL || null,
		sendgrid_from_name: process.env.SENDGRID_FROM_NAME || null,
		ten_dlc_brand_sid: null,
		ten_dlc_campaign_sid: null,
		ten_dlc_status: null,
		webhook_url: process.env.TWILIO_WEBHOOK_URL || null,
		webhook_secret: null,
		status: "active",
		metadata: null,
		last_provisioned_at: null,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	};
}


/**
 * Create Twilio client for a company
 *
 * Uses API Key authentication if available (recommended),
 * otherwise falls back to Auth Token.
 */
export async function createTwilioClient(
	companyId: string,
): Promise<Twilio.Twilio | null> {
	// Check cache first
	const cached = clientCache.get(companyId);
	if (cached) return cached;

	const settings = await getCompanyTwilioSettings(companyId);
	if (!settings) {
		console.error(`No Twilio settings found for company ${companyId}`);
		return null;
	}

	let client: Twilio.Twilio;

	// Prefer API Key authentication (more secure, can be revoked)
	if (settings.api_key_sid && settings.api_key_secret) {
		client = Twilio(settings.api_key_sid, settings.api_key_secret, {
			accountSid: settings.account_sid,
		});
	} else if (settings.auth_token) {
		// Fallback to Auth Token
		client = Twilio(settings.account_sid, settings.auth_token);
	} else {
		console.error(`No valid credentials for company ${companyId}`);
		return null;
	}

	// Cache the client
	clientCache.set(companyId, client);

	return client;
}

/**
 * Clear cached client for a company (use when credentials change)
 */
export function clearTwilioClientCache(companyId: string): void {
	clientCache.delete(companyId);
}

/**
 * Create admin Twilio client (uses environment variables)
 * Only use for global operations, not per-company
 */
export function createAdminTwilioClient(): Twilio.Twilio | null {
	if (!TWILIO_ADMIN_CONFIG.accountSid || !TWILIO_ADMIN_CONFIG.authToken) {
		console.error("Admin Twilio credentials not configured");
		return null;
	}

	return Twilio(TWILIO_ADMIN_CONFIG.accountSid, TWILIO_ADMIN_CONFIG.authToken);
}

/**
 * Verify Twilio webhook signature
 */
export function verifyTwilioWebhookSignature(
	signature: string,
	url: string,
	params: Record<string, string>,
	authToken: string,
): boolean {
	return Twilio.validateRequest(authToken, signature, url, params);
}

/**
 * Format phone number to E.164 format
 */
export function formatE164(phone: string): string {
	const digits = phone.replace(/\D/g, "");

	if (digits.length === 11 && digits.startsWith("1")) {
		return `+${digits}`;
	}
	if (digits.length === 10) {
		return `+1${digits}`;
	}
	if (digits.length > 10 && !phone.startsWith("+")) {
		return `+${digits}`;
	}
	return phone.startsWith("+") ? phone : `+${digits}`;
}
