/**
 * Twilio Phone Numbers API
 *
 * Functions for searching, purchasing, and managing Twilio phone numbers.
 * See: https://www.twilio.com/docs/phone-numbers
 */

import { createTwilioClient, getCompanyTwilioSettings, TWILIO_ADMIN_CONFIG } from "./client";

export type PhoneNumberSearchResult = {
	phoneNumber: string;
	locality: string;
	region: string;
	capabilities: {
		voice: boolean;
		sms: boolean;
		mms: boolean;
	};
	monthlyFee: number;
};

/**
 * Format a phone number to E.164 format
 */
export function formatPhoneNumber(phone: string): string {
	// Remove all non-digit characters
	const digits = phone.replace(/\D/g, "");

	// If 10 digits, assume US and add +1
	if (digits.length === 10) {
		return `+1${digits}`;
	}

	// If 11 digits starting with 1, add +
	if (digits.length === 11 && digits.startsWith("1")) {
		return `+${digits}`;
	}

	// Otherwise return with + if not already there
	return digits.startsWith("+") ? digits : `+${digits}`;
}

/**
 * Search for available phone numbers
 */
export async function searchPhoneNumbers(
	companyId: string,
	options: {
		areaCode?: string;
		locality?: string;
		region?: string;
		contains?: string;
		limit?: number;
	}
): Promise<PhoneNumberSearchResult[]> {
	try {
		const settings = await getCompanyTwilioSettings(companyId);
		const client = await createTwilioClient(companyId);

		if (!client || !settings) {
			console.error("[Twilio Numbers] No Twilio settings for company");
			return [];
		}

		const searchParams: Record<string, string | number | boolean> = {
			voiceEnabled: true,
			smsEnabled: true,
		};

		if (options.areaCode) searchParams.areaCode = options.areaCode;
		if (options.locality) searchParams.inLocality = options.locality;
		if (options.region) searchParams.inRegion = options.region;
		if (options.contains) searchParams.contains = options.contains;

		const numbers = await client.availablePhoneNumbers("US").local.list({
			...searchParams,
			limit: options.limit || 10,
		});

		return numbers.map((num) => ({
			phoneNumber: num.phoneNumber,
			locality: num.locality || "",
			region: num.region || "",
			capabilities: {
				voice: num.capabilities.voice,
				sms: num.capabilities.sms,
				mms: num.capabilities.mms,
			},
			monthlyFee: 1.15, // Standard Twilio local number monthly fee
		}));
	} catch (error) {
		console.error("[Twilio Numbers] Search error:", error);
		return [];
	}
}

/**
 * Initiate phone number porting
 *
 * TODO: Implement using Twilio Regulatory Bundle API
 */
export async function initiatePorting(data: {
	phoneNumbers: string[];
	accountNumber: string;
	accountPin: string;
	authorizedPerson: string;
	addressLine1: string;
	city: string;
	stateOrProvince: string;
	zipOrPostalCode: string;
	countryCode: string;
}): Promise<{ success: boolean; portingOrderId?: string; data?: { status: string }; error?: string }> {
	console.warn("[Twilio Numbers] initiatePorting not implemented");
	return {
		success: false,
		error: "Porting functionality not yet implemented for Twilio",
	};
}

/**
 * Purchase a phone number
 */
export async function purchaseNumber(
	companyId: string,
	phoneNumber: string
): Promise<{ success: boolean; sid?: string; error?: string }> {
	try {
		const client = await createTwilioClient(companyId);
		const settings = await getCompanyTwilioSettings(companyId);

		if (!client || !settings) {
			return { success: false, error: "Twilio not configured for company" };
		}

		// Construct webhook URL (single URL for all phone numbers - company resolved from phone number)
		const baseUrl = settings.webhook_url || TWILIO_ADMIN_CONFIG.webhookBaseUrl;
		const webhookUrl = `${baseUrl}/api/webhooks/twilio`;

		const purchased = await client.incomingPhoneNumbers.create({
			phoneNumber,
			voiceUrl: webhookUrl,
			smsUrl: webhookUrl,
			voiceMethod: "POST",
			smsMethod: "POST",
		});

		return {
			success: true,
			sid: purchased.sid,
		};
	} catch (error) {
		console.error("[Twilio Numbers] Purchase error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to purchase number",
		};
	}
}

/**
 * Release (delete) a phone number
 */
export async function releaseNumber(
	companyId: string,
	numberSid: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const client = await createTwilioClient(companyId);

		if (!client) {
			return { success: false, error: "Twilio not configured for company" };
		}

		await client.incomingPhoneNumbers(numberSid).remove();

		return { success: true };
	} catch (error) {
		console.error("[Twilio Numbers] Release error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to release number",
		};
	}
}

/**
 * Update webhook URLs for an existing phone number
 * Uses a single webhook URL for all numbers - company is resolved from phone number
 */
export async function updatePhoneNumberWebhooks(
	companyId: string,
	phoneNumberSid: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const client = await createTwilioClient(companyId);
		const settings = await getCompanyTwilioSettings(companyId);

		if (!client || !settings) {
			return { success: false, error: "Twilio not configured for company" };
		}

		// Single webhook URL for all phone numbers (company resolved from phone number in webhook handler)
		const baseUrl = settings.webhook_url || TWILIO_ADMIN_CONFIG.webhookBaseUrl;
		const webhookUrl = `${baseUrl}/api/webhooks/twilio`;

		// Update the phone number in Twilio
		await client.incomingPhoneNumbers(phoneNumberSid).update({
			voiceUrl: webhookUrl,
			smsUrl: webhookUrl,
			voiceMethod: "POST",
			smsMethod: "POST",
		});

		return { success: true };
	} catch (error) {
		console.error("[Twilio Numbers] Update webhooks error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to update webhook URLs",
		};
	}
}
