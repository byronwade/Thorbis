/**
 * Customer Linking Utility
 * 
 * Links communications (emails, SMS) to customers based on email/phone matching
 */

"use server";

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import type { Database } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

type TypedSupabaseClient = SupabaseClient<Database>;

/**
 * Find customer ID by email address
 */
export async function findCustomerByEmail(
	email: string,
	companyId: string,
): Promise<string | null> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) {
			return null;
		}

		// Normalize email (lowercase, trim)
		const normalizedEmail = email.toLowerCase().trim();

		// Search for customer by email
		const { data: customer, error } = await supabase
			.from("customers")
			.select("id")
			.eq("company_id", companyId)
			.eq("email", normalizedEmail)
			.maybeSingle();

		if (error || !customer) {
			return null;
		}

		return customer.id;
	} catch (error) {
		console.error("Error finding customer by email:", error);
		return null;
	}
}

/**
 * Find customer ID by phone number
 */
export async function findCustomerByPhone(
	phone: string,
	companyId: string,
): Promise<string | null> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) {
			return null;
		}

		// Normalize phone number (remove formatting)
		const normalizedPhone = phone.replace(/\D/g, "");

		// Search for customer by primary phone or secondary phone
		const { data: customer, error } = await supabase
			.from("customers")
			.select("id")
			.eq("company_id", companyId)
			.or(
				`phone.eq.${phone},phone.eq.${normalizedPhone},secondary_phone.eq.${phone},secondary_phone.eq.${normalizedPhone}`,
			)
			.maybeSingle();

		if (error || !customer) {
			return null;
		}

		return customer.id;
	} catch (error) {
		console.error("Error finding customer by phone:", error);
		return null;
	}
}

/**
 * Link a communication to a customer
 * Updates the communication record with customer_id
 */
export async function linkCommunicationToCustomer(
	communicationId: string,
	customerId: string,
): Promise<boolean> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) {
			return false;
		}

		const { error } = await supabase
			.from("communications")
			.update({ customer_id: customerId })
			.eq("id", communicationId);

		if (error) {
			console.error("Error linking communication to customer:", error);
			return false;
		}

		return true;
	} catch (error) {
		console.error("Error linking communication to customer:", error);
		return false;
	}
}

