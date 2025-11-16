// @ts-nocheck
"use server";

/**
 * Customer Contacts Server Actions
 *
 * Manages additional contacts for customers:
 * - Multiple emails and phone numbers
 * - Contact titles and roles
 * - Primary/billing/emergency contact flags
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Exclude<Awaited<ReturnType<typeof createClient>>, null>;

export type CustomerContact = {
	id: string;
	company_id: string;
	customer_id: string;
	first_name: string;
	last_name: string;
	title?: string;
	email?: string;
	phone?: string;
	secondary_phone?: string;
	is_primary: boolean;
	is_billing_contact: boolean;
	is_emergency_contact: boolean;
	preferred_contact_method?: string;
	notes?: string;
	created_at: string;
	updated_at: string;
};

type UpdateCustomerContactInput = {
	firstName?: string;
	lastName?: string;
	title?: string;
	email?: string;
	phone?: string;
	secondaryPhone?: string;
	isPrimary?: boolean;
	isBillingContact?: boolean;
	isEmergencyContact?: boolean;
	preferredContactMethod?: string;
	notes?: string;
};

const getSupabaseServerClient = async (): Promise<SupabaseServerClient> => {
	const supabase = await createClient();
	if (!supabase) {
		throw new Error("Database connection failed");
	}
	return supabase as SupabaseServerClient;
};

/**
 * Get all contacts for a customer
 */
export async function getCustomerContacts(customerId: string) {
	try {
		const supabase = await getSupabaseServerClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated", data: [] };
		}

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			return { success: false, error: "No company found", data: [] };
		}

		const { data, error } = await supabase
			.from("customer_contacts")
			.select("*")
			.eq("customer_id", customerId)
			.eq("company_id", teamMember.company_id)
			.is("deleted_at", null)
			.order("is_primary", { ascending: false })
			.order("created_at", { ascending: true });

		if (error) {
			return { success: false, error: error.message, data: [] };
		}

		return { success: true, data: data || [] };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch contacts",
			data: [],
		};
	}
}

/**
 * Add a new contact
 */
export async function addCustomerContact({
	customerId,
	firstName,
	lastName,
	title,
	email,
	phone,
	secondaryPhone,
	isPrimary = false,
	isBillingContact = false,
	isEmergencyContact = false,
	preferredContactMethod,
	notes,
}: {
	customerId: string;
	firstName: string;
	lastName: string;
	title?: string;
	email?: string;
	phone?: string;
	secondaryPhone?: string;
	isPrimary?: boolean;
	isBillingContact?: boolean;
	isEmergencyContact?: boolean;
	preferredContactMethod?: string;
	notes?: string;
}) {
	try {
		const supabase = await getSupabaseServerClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			return { success: false, error: "No company found" };
		}

		const { data, error } = await supabase
			.from("customer_contacts")
			.insert({
				company_id: teamMember.company_id,
				customer_id: customerId,
				first_name: firstName,
				last_name: lastName,
				title,
				email,
				phone,
				secondary_phone: secondaryPhone,
				is_primary: isPrimary,
				is_billing_contact: isBillingContact,
				is_emergency_contact: isEmergencyContact,
				preferred_contact_method: preferredContactMethod,
				notes,
			})
			.select()
			.single();

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath(`/dashboard/customers/${customerId}`);
		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to add contact",
		};
	}
}

/**
 * Update a contact
 */
export async function updateCustomerContact({
	contactId,
	...updateData
}: { contactId: string } & UpdateCustomerContactInput) {
	try {
		const supabase = await getSupabaseServerClient();
		const updates = buildContactUpdates(updateData);

		const { data, error } = await supabase
			.from("customer_contacts")
			.update(updates)
			.eq("id", contactId)
			.select()
			.single();

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to update contact",
		};
	}
}

/**
 * Remove a contact (soft delete)
 */
export async function removeCustomerContact(contactId: string) {
	try {
		const supabase = await getSupabaseServerClient();

		const { data: contact } = await supabase
			.from("customer_contacts")
			.select("customer_id")
			.eq("id", contactId)
			.single();

		if (!contact?.customer_id) {
			return { success: false, error: "Contact not found" };
		}

		const { error } = await supabase
			.from("customer_contacts")
			.update({ deleted_at: new Date().toISOString() })
			.eq("id", contactId);

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath(`/dashboard/customers/${contact.customer_id}`);
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to remove contact",
		};
	}
}

const buildContactUpdates = (updateData: UpdateCustomerContactInput): Record<string, unknown> => {
	const mappings: Record<keyof UpdateCustomerContactInput, string> = {
		firstName: "first_name",
		lastName: "last_name",
		title: "title",
		email: "email",
		phone: "phone",
		secondaryPhone: "secondary_phone",
		isPrimary: "is_primary",
		isBillingContact: "is_billing_contact",
		isEmergencyContact: "is_emergency_contact",
		preferredContactMethod: "preferred_contact_method",
		notes: "notes",
	};

	const updates: Record<string, unknown> = {};

	for (const key of Object.keys(mappings) as Array<keyof UpdateCustomerContactInput>) {
		const value = updateData[key];
		if (value !== undefined) {
			updates[mappings[key]] = value;
		}
	}

	return updates;
};
