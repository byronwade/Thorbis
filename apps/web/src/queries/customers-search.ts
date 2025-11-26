/**
 * Customer Search Queries
 *
 * Server-side search functions for customers and properties
 * Uses full-text search with PostgreSQL ranking
 */

"use server";

import { getActiveCompanyId } from "@/lib/auth/company-context";
import { searchCustomersFullText } from "@/lib/search/full-text-search";
import { createClient } from "@/lib/supabase/server";

export type Customer = {
	id: string;
	first_name: string;
	last_name: string;
	display_name: string;
	email: string;
	phone: string;
	company_name?: string;
	type: "residential" | "commercial" | "industrial";
	address?: string;
	city?: string;
	state?: string;
	zip?: string;
};

export type Property = {
	id: string;
	customer_id: string;
	address: string;
	address_line2?: string;
	city: string;
	state: string;
	zip: string;
	property_type?: string;
};

/**
 * Search customers using full-text search
 *
 * @param query - Search query (name, email, phone, company, address)
 * @returns Array of matching customers ranked by relevance
 */
export async function searchCustomersForJob(
	query: string,
): Promise<Customer[]> {
	if (!query || query.trim().length < 2) {
		return [];
	}

	const supabase = await createClient();
	if (!supabase) {
		return [];
	}

	const companyId = await getActiveCompanyId();
	if (!companyId) {
		return [];
	}

	try {
		const results = await searchCustomersFullText(supabase, companyId, query, {
			limit: 50,
		});

		return results as Customer[];
	} catch (error) {
		console.error("Error searching customers:", error);
		return [];
	}
}

/**
 * Get all properties for a customer
 *
 * @param customerId - Customer ID
 * @returns Array of properties belonging to the customer
 */
export async function getCustomerProperties(
	customerId: string,
): Promise<Property[]> {
	const supabase = await createClient();
	if (!supabase) {
		return [];
	}

	const companyId = await getActiveCompanyId();
	if (!companyId) {
		return [];
	}

	try {
		const { data, error } = await supabase
			.from("properties")
			.select("*")
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching properties:", error);
			return [];
		}

		return (data || []) as Property[];
	} catch (error) {
		console.error("Error fetching properties:", error);
		return [];
	}
}
