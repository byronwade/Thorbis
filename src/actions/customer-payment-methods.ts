"use server";

/**
 * Customer Payment Methods Server Actions
 *
 * Handles payment method management for customers:
 * - Get payment methods for a customer
 * - Set default payment method
 * - Remove payment method
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Exclude<Awaited<ReturnType<typeof createClient>>, null>;

/**
 * Get payment methods for a customer
 */
export async function getCustomerPaymentMethods(customerId: string) {
	try {
		const supabase = await getSupabaseServerClient();
		const { companyId } = await getUserAndCompany(supabase);

		const { data, error } = await supabase
			.from("payment_methods")
			.select("*")
			.eq("customer_id", customerId)
			.eq("company_id", companyId)
			.eq("is_active", true)
			.order("is_default", { ascending: false })
			.order("created_at", { ascending: false });

		if (error) {
			return { success: false, error: error.message, data: [] };
		}

		return { success: true, data: data || [] };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch payment methods",
			data: [],
		};
	}
}

/**
 * Set a payment method as default for a customer
 */
export async function setDefaultCustomerPaymentMethod(paymentMethodId: string, customerId: string) {
	try {
		const supabase = await getSupabaseServerClient();
		const { companyId } = await getUserAndCompany(supabase);

		// First, unset all default flags for this customer
		const { error: unsetError } = await supabase
			.from("payment_methods")
			.update({ is_default: false })
			.eq("customer_id", customerId)
			.eq("company_id", companyId);

		if (unsetError) {
			return { success: false, error: "Failed to update payment methods" };
		}

		// Then set the selected one as default
		const { error: setError } = await supabase
			.from("payment_methods")
			.update({ is_default: true })
			.eq("id", paymentMethodId)
			.eq("customer_id", customerId)
			.eq("company_id", companyId);

		if (setError) {
			return { success: false, error: "Failed to set default payment method" };
		}

		revalidatePath(`/dashboard/customers/${customerId}`);
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to set default",
		};
	}
}

/**
 * Remove a customer payment method
 */
export async function removeCustomerPaymentMethod(paymentMethodId: string, customerId: string) {
	try {
		const supabase = await getSupabaseServerClient();
		const { companyId } = await getUserAndCompany(supabase);

		// Get payment method details
		const { data: paymentMethod } = await supabase
			.from("payment_methods")
			.select("is_default")
			.eq("id", paymentMethodId)
			.eq("customer_id", customerId)
			.eq("company_id", companyId)
			.single();

		if (!paymentMethod) {
			return { success: false, error: "Payment method not found" };
		}

		// Check if there are other payment methods
		const { count } = await supabase
			.from("payment_methods")
			.select("*", { count: "exact", head: true })
			.eq("customer_id", customerId)
			.eq("company_id", companyId)
			.eq("is_active", true);

		if (count === 1 && paymentMethod.is_default) {
			return {
				success: false,
				error: "Cannot remove the only payment method. Add another one first.",
			};
		}

		// Soft delete (set is_active to false)
		const { error: deleteError } = await supabase
			.from("payment_methods")
			.update({ is_active: false })
			.eq("id", paymentMethodId)
			.eq("customer_id", customerId)
			.eq("company_id", companyId);

		if (deleteError) {
			return { success: false, error: "Failed to remove payment method" };
		}

		revalidatePath(`/dashboard/customers/${customerId}`);
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to remove payment method",
		};
	}
}

const getSupabaseServerClient = async (): Promise<SupabaseServerClient> => {
	const supabase = await createClient();
	if (!supabase) {
		throw new Error("Database connection failed");
	}
	return supabase as SupabaseServerClient;
};

const getUserAndCompany = async (supabase: SupabaseServerClient): Promise<{ userId: string; companyId: string }> => {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("Not authenticated");
	}

	const { data: teamMember } = await supabase.from("team_members").select("company_id").eq("user_id", user.id).single();

	if (!teamMember?.company_id) {
		throw new Error("No company found");
	}

	return { userId: user.id, companyId: teamMember.company_id };
};
