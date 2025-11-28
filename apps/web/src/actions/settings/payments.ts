"use server";

/**
 * Payment Settings Server Actions
 *
 * Handles updates to payment processor configurations and payout settings.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface PaymentProcessorUpdate {
	adyen_enabled?: boolean;
	adyen_merchant_id?: string;
	adyen_api_key?: string;
	adyen_client_key?: string;
	plaid_enabled?: boolean;
	plaid_client_id?: string;
	plaid_secret?: string;
	profitstars_enabled?: boolean;
	profitstars_merchant_id?: string;
	profitstars_api_key?: string;
}

interface PayoutScheduleUpdate {
	payout_speed?: "standard" | "instant" | "daily";
	daily_payout_time?: string;
	minimum_payout_amount?: number;
	instant_payout_enabled?: boolean;
}

/**
 * Update payment processor settings
 */
export async function updatePaymentSettings(
	companyId: string,
	updates: PaymentProcessorUpdate,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database unavailable" };
		}

		// Verify user has access to this company
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Unauthorized" };
		}

		const { data: membership } = await supabase
			.from("company_memberships")
			.select("role")
			.eq("user_id", user.id)
			.eq("company_id", companyId)
			.eq("status", "active")
			.single();

		if (!membership || !["owner", "admin"].includes(membership.role)) {
			return { success: false, error: "Insufficient permissions" };
		}

		// Check if settings exist
		const { data: existing } = await supabase
			.from("company_payment_processors")
			.select("id")
			.eq("company_id", companyId)
			.single();

		if (existing) {
			// Update existing
			const { error } = await supabase
				.from("company_payment_processors")
				.update({
					...updates,
					updated_at: new Date().toISOString(),
				})
				.eq("company_id", companyId);

			if (error) {
				return { success: false, error: error.message };
			}
		} else {
			// Create new
			const { error } = await supabase
				.from("company_payment_processors")
				.insert({
					company_id: companyId,
					...updates,
				});

			if (error) {
				return { success: false, error: error.message };
			}
		}

		revalidatePath("/dashboard/settings/finance/payments");
		return { success: true };
	} catch (error) {
		console.error("[PaymentSettings] Update error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Update failed",
		};
	}
}

/**
 * Update payout schedule settings
 */
export async function updatePayoutSchedule(
	companyId: string,
	updates: PayoutScheduleUpdate,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database unavailable" };
		}

		// Verify user has access to this company
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Unauthorized" };
		}

		const { data: membership } = await supabase
			.from("company_memberships")
			.select("role")
			.eq("user_id", user.id)
			.eq("company_id", companyId)
			.eq("status", "active")
			.single();

		if (!membership || !["owner", "admin"].includes(membership.role)) {
			return { success: false, error: "Insufficient permissions" };
		}

		// Check if schedule exists
		const { data: existing } = await supabase
			.from("payout_schedules")
			.select("id")
			.eq("company_id", companyId)
			.single();

		if (existing) {
			// Update existing
			const { error } = await supabase
				.from("payout_schedules")
				.update({
					...updates,
					updated_at: new Date().toISOString(),
				})
				.eq("company_id", companyId);

			if (error) {
				return { success: false, error: error.message };
			}
		} else {
			// Create new
			const { error } = await supabase.from("payout_schedules").insert({
				company_id: companyId,
				...updates,
			});

			if (error) {
				return { success: false, error: error.message };
			}
		}

		revalidatePath("/dashboard/settings/finance/payments");
		return { success: true };
	} catch (error) {
		console.error("[PayoutSchedule] Update error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Update failed",
		};
	}
}

/**
 * Connect bank account via Plaid
 */
async function connectBankAccount(
	companyId: string,
	plaidPublicToken: string,
): Promise<{
	success: boolean;
	bankAccountLast4?: string;
	bankAccountName?: string;
	error?: string;
}> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database unavailable" };
		}

		// Verify user has access
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Unauthorized" };
		}

		// In production, this would:
		// 1. Exchange public token for access token via Plaid API
		// 2. Get account info from Plaid
		// 3. Store encrypted access token
		// 4. Set up ACH for payouts

		// Mock response
		const mockBankAccount = {
			last4: "4567",
			name: "Chase Checking",
		};

		// Update payout schedule with bank info
		const { error } = await supabase.from("payout_schedules").upsert({
			company_id: companyId,
			bank_account_last4: mockBankAccount.last4,
			bank_account_name: mockBankAccount.name,
		});

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath("/dashboard/settings/finance/payments");

		return {
			success: true,
			bankAccountLast4: mockBankAccount.last4,
			bankAccountName: mockBankAccount.name,
		};
	} catch (error) {
		console.error("[BankAccount] Connect error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Connection failed",
		};
	}
}

/**
 * Request instant payout
 */
async function requestInstantPayout(
	companyId: string,
	amount: number,
): Promise<{
	success: boolean;
	payoutId?: string;
	estimatedArrival?: string;
	fee?: number;
	error?: string;
}> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database unavailable" };
		}

		// Verify user has access
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Unauthorized" };
		}

		// Check payout schedule for instant payout eligibility
		const { data: schedule } = await supabase
			.from("payout_schedules")
			.select("instant_payout_enabled, bank_account_last4")
			.eq("company_id", companyId)
			.single();

		if (!schedule?.bank_account_last4) {
			return { success: false, error: "No bank account connected" };
		}

		// Calculate fee (1% max $10)
		const fee = Math.min(amount * 0.01, 10);
		const netAmount = amount - fee;

		// In production, this would call Adyen/processor to initiate instant payout

		// Create payout record
		const { data: payout, error } = await supabase
			.from("payouts")
			.insert({
				company_id: companyId,
				amount: netAmount,
				fee,
				type: "instant",
				status: "processing",
				requested_at: new Date().toISOString(),
			})
			.select("id")
			.single();

		if (error) {
			return { success: false, error: error.message };
		}

		// Estimated arrival: 30 minutes from now
		const estimatedArrival = new Date();
		estimatedArrival.setMinutes(estimatedArrival.getMinutes() + 30);

		return {
			success: true,
			payoutId: payout.id,
			estimatedArrival: estimatedArrival.toISOString(),
			fee,
		};
	} catch (error) {
		console.error("[InstantPayout] Request error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Payout request failed",
		};
	}
}
