"use server";

/**
 * Customer Badges Server Actions
 *
 * Manages customer profile badges including:
 * - Custom badges
 * - Premade badges (DO NOT SERVICE, VIP, etc.)
 * - Auto-generated badges (payment status, past due, etc.)
 *
 * NOTE: Types and constants moved to @/types/customer-badges
 * to comply with Next.js 16 "use server" file restrictions.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Exclude<Awaited<ReturnType<typeof createClient>>, null>;

type AutoBadgeVariant = "default" | "destructive" | "warning" | "success" | "secondary" | "outline";

type BadgeMetadata = Record<string, unknown>;

type AutoBadgeDefinition = {
	label: string;
	variant: AutoBadgeVariant;
	auto_generated_key: string;
	metadata?: BadgeMetadata;
};

type CustomerInvoice = {
	status: string | null;
	is_overdue: boolean | null;
};

type CustomerRecord = {
	id: string;
	outstanding_balance: number | null;
	total_revenue: number | null;
	invoices: CustomerInvoice[] | null;
};

const DOLLAR_CENTS = 100;
const ALWAYS_PAYS_THRESHOLD = 5;
const HIGH_VALUE_REVENUE_CENTS = 1_000_000;
const AUTO_BADGE_DISPLAY_OFFSET = 1000;

const getSupabaseServerClient = async (): Promise<SupabaseServerClient> => {
	const supabase = await createClient();
	if (!supabase) {
		throw new Error("Database connection failed");
	}
	return supabase as SupabaseServerClient;
};

/**
 * Get customer badges
 */
export async function getCustomerBadges(customerId: string) {
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
			.from("customer_badges")
			.select("*")
			.eq("customer_id", customerId)
			.eq("company_id", teamMember.company_id)
			.eq("is_active", true)
			.is("deleted_at", null)
			.order("display_order", { ascending: true })
			.order("created_at", { ascending: false });

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, data: data || [] };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch badges",
		};
	}
}

/**
 * Generate auto-badges based on customer data
 */
export async function generateAutoBadges(customerId: string) {
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

		// Get customer data
		const { data: customer } = await supabase
			.from("customers")
			.select(
				`
        id,
        outstanding_balance,
        total_revenue,
        invoices:invoices!customer_id(status,is_overdue)
      `
			)
			.eq("id", customerId)
			.single();

		if (!customer) {
			return { success: false, error: "Customer not found" };
		}

		const autoBadges = buildAutoBadges(customer);
		await replaceAutoBadges(supabase, customerId, teamMember.company_id, autoBadges);

		revalidatePath(`/dashboard/customers/${customerId}`);
		return { success: true, data: autoBadges };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to generate badges",
		};
	}
}

/**
 * Add a badge to a customer
 */
export async function addCustomerBadge({
	customerId,
	label,
	variant = "default",
	badgeType = "custom",
	icon,
}: {
	customerId: string;
	label: string;
	variant?: "default" | "destructive" | "warning" | "success" | "secondary" | "outline";
	badgeType?: "custom" | "premade";
	icon?: string;
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
			.from("customer_badges")
			.insert({
				customer_id: customerId,
				company_id: teamMember.company_id,
				badge_type: badgeType,
				label,
				variant,
				icon,
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
			error: error instanceof Error ? error.message : "Failed to add badge",
		};
	}
}

/**
 * Remove a badge
 */
export async function removeCustomerBadge(badgeId: string, customerId: string) {
	try {
		const supabase = await getSupabaseServerClient();

		const { error } = await supabase
			.from("customer_badges")
			.update({ deleted_at: new Date().toISOString() })
			.eq("id", badgeId);

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath(`/dashboard/customers/${customerId}`);
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to remove badge",
		};
	}
}

const buildAutoBadges = (customer: CustomerRecord): AutoBadgeDefinition[] => {
	const badges: AutoBadgeDefinition[] = [];

	if (customer.outstanding_balance && customer.outstanding_balance > 0) {
		badges.push({
			label: `Past Due $${formatCurrency(customer.outstanding_balance)}`,
			variant: "destructive",
			auto_generated_key: "past_due",
			metadata: { amount: customer.outstanding_balance },
		});
	}

	if (qualifiesForOnTimeBadge(customer.invoices ?? [])) {
		badges.push({
			label: "Always Pays On Time",
			variant: "success",
			auto_generated_key: "always_pays_on_time",
		});
	}

	if (customer.total_revenue && customer.total_revenue > HIGH_VALUE_REVENUE_CENTS) {
		badges.push({
			label: `High Value $${formatWholeCurrency(customer.total_revenue)}`,
			variant: "success",
			auto_generated_key: "high_value",
			metadata: { revenue: customer.total_revenue },
		});
	}

	return badges;
};

const qualifiesForOnTimeBadge = (invoices: CustomerInvoice[]): boolean => {
	if (invoices.length === 0) {
		return false;
	}

	const hasLatePayments = invoices.some((invoice) => Boolean(invoice.is_overdue));
	const paidInvoicesCount = invoices.filter((invoice) => invoice.status === "paid").length;

	return paidInvoicesCount >= ALWAYS_PAYS_THRESHOLD && !hasLatePayments;
};

const replaceAutoBadges = async (
	supabase: SupabaseServerClient,
	customerId: string,
	companyId: string,
	badges: AutoBadgeDefinition[]
) => {
	await supabase
		.from("customer_badges")
		.delete()
		.eq("customer_id", customerId)
		.eq("company_id", companyId)
		.eq("badge_type", "auto_generated");

	if (badges.length === 0) {
		return;
	}

	await supabase.from("customer_badges").insert(
		badges.map((badge, index) => ({
			customer_id: customerId,
			company_id: companyId,
			badge_type: "auto_generated" as const,
			label: badge.label,
			variant: badge.variant,
			auto_generated_key: badge.auto_generated_key,
			metadata: badge.metadata,
			display_order: AUTO_BADGE_DISPLAY_OFFSET + index,
		}))
	);
};

const formatCurrency = (amountInCents: number): string => (amountInCents / DOLLAR_CENTS).toFixed(2);

const formatWholeCurrency = (amountInCents: number): string => (amountInCents / DOLLAR_CENTS).toFixed(0);
