/**
 * Customer Lookup Utilities
 *
 * Shared utilities for looking up customers by phone number or email.
 * Used by both incoming webhooks and outbound communication actions.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

type TypedSupabaseClient = SupabaseClient<Database>;

export type CustomerLookupResult = {
	customerId: string | null;
	duplicateCustomerIds?: string[];
	hasDuplicates: boolean;
};

/**
 * Extract comparable digits from a phone number.
 * Strips all non-digits and returns the last 10 digits for US numbers.
 */
export function extractComparableDigits(phoneNumber: string): string {
	const digits = phoneNumber.replace(/\D/g, "");
	if (digits.length > 10) {
		return digits.slice(-10);
	}
	return digits;
}

/**
 * Find a customer by phone number.
 * Looks up customers by matching phone or secondary_phone fields.
 * Returns the most recently updated customer if duplicates exist.
 *
 * @param supabase - Supabase client
 * @param companyId - Company ID to scope the search
 * @param phoneNumber - Phone number to search for
 * @returns CustomerLookupResult with customerId and duplicate info
 */
export async function findCustomerByPhone(
	supabase: TypedSupabaseClient,
	companyId: string,
	phoneNumber: string,
): Promise<CustomerLookupResult> {
	const digits = extractComparableDigits(phoneNumber);
	if (!digits) {
		return { customerId: null, hasDuplicates: false };
	}

	// Find ALL matching customers, ordered by most recently updated
	const { data: customers } = await supabase
		.from("customers")
		.select("id, updated_at")
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.or(`phone.ilike.%${digits}%,secondary_phone.ilike.%${digits}%`)
		.order("updated_at", { ascending: false });

	if (!customers || customers.length === 0) {
		return { customerId: null, hasDuplicates: false };
	}

	// If only one match, return it
	if (customers.length === 1) {
		return { customerId: customers[0].id, hasDuplicates: false };
	}

	// Multiple matches - return most recently active and flag duplicates
	return {
		customerId: customers[0].id, // Most recently updated
		duplicateCustomerIds: customers.slice(1).map((c) => c.id),
		hasDuplicates: true,
	};
}

/**
 * Find a customer by email address.
 * Looks up customers by matching email field (case-insensitive).
 * Returns the most recently updated customer if duplicates exist.
 *
 * @param supabase - Supabase client
 * @param companyId - Company ID to scope the search
 * @param email - Email address to search for
 * @returns CustomerLookupResult with customerId and duplicate info
 */
export async function findCustomerByEmail(
	supabase: TypedSupabaseClient,
	companyId: string,
	email: string,
): Promise<CustomerLookupResult> {
	if (!email || !email.includes("@")) {
		return { customerId: null, hasDuplicates: false };
	}

	const normalizedEmail = email.toLowerCase().trim();

	// Find ALL matching customers, ordered by most recently updated
	const { data: customers } = await supabase
		.from("customers")
		.select("id, updated_at")
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.ilike("email", normalizedEmail)
		.order("updated_at", { ascending: false });

	if (!customers || customers.length === 0) {
		return { customerId: null, hasDuplicates: false };
	}

	// If only one match, return it
	if (customers.length === 1) {
		return { customerId: customers[0].id, hasDuplicates: false };
	}

	// Multiple matches - return most recently active and flag duplicates
	return {
		customerId: customers[0].id, // Most recently updated
		duplicateCustomerIds: customers.slice(1).map((c) => c.id),
		hasDuplicates: true,
	};
}

/**
 * Find a customer by phone OR email (tries phone first, then email).
 * Useful for communication linking where you have both identifiers.
 *
 * @param supabase - Supabase client
 * @param companyId - Company ID to scope the search
 * @param phoneNumber - Phone number to search for (optional)
 * @param email - Email address to search for (optional)
 * @returns CustomerLookupResult with customerId and duplicate info
 */
export async function findCustomerByPhoneOrEmail(
	supabase: TypedSupabaseClient,
	companyId: string,
	phoneNumber?: string | null,
	email?: string | null,
): Promise<CustomerLookupResult> {
	// Try phone first (more unique identifier)
	if (phoneNumber) {
		const phoneResult = await findCustomerByPhone(
			supabase,
			companyId,
			phoneNumber,
		);
		if (phoneResult.customerId) {
			return phoneResult;
		}
	}

	// Fall back to email
	if (email) {
		return findCustomerByEmail(supabase, companyId, email);
	}

	return { customerId: null, hasDuplicates: false };
}
