/**
 * SMS Service - Stub
 *
 * Placeholder for SMS conversation service.
 * TODO: Implement actual SMS service when needed.
 */

import type { Database } from "@stratos/database/types";

type CompanySms = Database["public"]["Tables"]["company_sms"]["Row"];

/**
 * Get SMS conversation for a phone number
 */
export async function getSmsConversation(
	_companyId: string,
	_phoneNumber: string,
): Promise<CompanySms[]> {
	console.warn("SMS service not configured - returning empty conversation");
	return [];
}
