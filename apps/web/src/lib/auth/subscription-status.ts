/**
 * Subscription Status Utility
 *
 * Provides functions to check subscription status for route protection.
 * Implements 7-day grace period for past_due subscriptions.
 *
 * @see /docs/billing/subscription-lifecycle.md
 */

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Grace period configuration
const GRACE_PERIOD_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type SubscriptionStatusType =
	| "active"
	| "trialing"
	| "past_due"
	| "canceled"
	| "incomplete"
	| "incomplete_expired"
	| "unpaid"
	| "paused";

export type SubscriptionStatus = {
	/** Is the subscription valid for full access? */
	isValid: boolean;
	/** Current Stripe subscription status */
	status: SubscriptionStatusType | null;
	/** Is the subscription currently in trial period? */
	isTrialing: boolean;
	/** When does the trial end? */
	trialEndsAt: Date | null;
	/** Days remaining in trial */
	daysRemainingInTrial: number;
	/** Is the subscription past due? */
	isPastDue: boolean;
	/** Is the account in grace period? */
	isInGracePeriod: boolean;
	/** When does the grace period end? */
	gracePeriodEndsAt: Date | null;
	/** Days remaining in grace period */
	daysRemainingInGrace: number;
	/** When does the current billing period end? */
	currentPeriodEnd: Date | null;
	/** Should show warning banner? */
	shouldShowWarning: boolean;
	/** Warning message to display */
	warningMessage: string | null;
};

/**
 * Check subscription status for a company
 *
 * Uses React.cache() for request deduplication.
 * Multiple components calling this function will share the same result.
 *
 * @param companyId - The company ID to check
 * @returns Subscription status details
 */
export const checkSubscriptionStatus = cache(
	async (companyId: string): Promise<SubscriptionStatus> => {
		const supabase = await createClient();

		const { data: company, error } = await supabase
			.from("companies")
			.select(
				`
				stripe_subscription_status,
				subscription_current_period_end,
				trial_ends_at
			`
			)
			.eq("id", companyId)
			.single();

		if (error || !company) {
			// Default to invalid if company not found
			return {
				isValid: false,
				status: null,
				isTrialing: false,
				trialEndsAt: null,
				daysRemainingInTrial: 0,
				isPastDue: false,
				isInGracePeriod: false,
				gracePeriodEndsAt: null,
				daysRemainingInGrace: 0,
				currentPeriodEnd: null,
				shouldShowWarning: true,
				warningMessage: "Unable to verify subscription status",
			};
		}

		const now = new Date();
		const status = company.stripe_subscription_status as SubscriptionStatusType | null;
		const validStatuses: SubscriptionStatusType[] = ["active", "trialing"];

		// Parse dates
		const trialEndsAt = company.trial_ends_at ? new Date(company.trial_ends_at) : null;
		const currentPeriodEnd = company.subscription_current_period_end
			? new Date(company.subscription_current_period_end)
			: null;

		// Calculate trial remaining
		const daysRemainingInTrial =
			trialEndsAt && trialEndsAt > now
				? Math.ceil((trialEndsAt.getTime() - now.getTime()) / MS_PER_DAY)
				: 0;

		// Calculate grace period (7 days after billing period end)
		const gracePeriodEndsAt =
			status === "past_due" && currentPeriodEnd
				? new Date(currentPeriodEnd.getTime() + GRACE_PERIOD_DAYS * MS_PER_DAY)
				: null;

		const isInGracePeriod =
			status === "past_due" && gracePeriodEndsAt && gracePeriodEndsAt > now;

		const daysRemainingInGrace = isInGracePeriod
			? Math.ceil((gracePeriodEndsAt!.getTime() - now.getTime()) / MS_PER_DAY)
			: 0;

		// Determine if subscription is valid
		const isValid =
			status !== null &&
			(validStatuses.includes(status) || (isInGracePeriod === true));

		// Determine warning message
		let warningMessage: string | null = null;
		let shouldShowWarning = false;

		if (status === "trialing" && daysRemainingInTrial <= 3) {
			shouldShowWarning = true;
			warningMessage = `Your trial ends in ${daysRemainingInTrial} day${daysRemainingInTrial !== 1 ? "s" : ""}. Add a payment method to continue.`;
		} else if (status === "past_due" && isInGracePeriod) {
			shouldShowWarning = true;
			warningMessage = `Payment failed. Update your payment method within ${daysRemainingInGrace} day${daysRemainingInGrace !== 1 ? "s" : ""} to avoid service interruption.`;
		} else if (status === "past_due" && !isInGracePeriod) {
			shouldShowWarning = true;
			warningMessage =
				"Your subscription is suspended. Update your payment method to restore access.";
		} else if (status === "canceled") {
			shouldShowWarning = true;
			warningMessage = "Your subscription has been canceled.";
		} else if (status === "unpaid") {
			shouldShowWarning = true;
			warningMessage = "Your subscription is unpaid.";
		}

		return {
			isValid,
			status,
			isTrialing: status === "trialing",
			trialEndsAt,
			daysRemainingInTrial,
			isPastDue: status === "past_due",
			isInGracePeriod: isInGracePeriod === true,
			gracePeriodEndsAt,
			daysRemainingInGrace,
			currentPeriodEnd,
			shouldShowWarning,
			warningMessage,
		};
	}
);

/**
 * Check if user should be redirected to billing
 *
 * Returns true if the subscription is invalid and grace period has expired.
 * Used in middleware/layouts to protect routes.
 */
export async function shouldRedirectToBilling(
	companyId: string
): Promise<boolean> {
	const status = await checkSubscriptionStatus(companyId);

	// Allow access if valid or in grace period
	if (status.isValid) {
		return false;
	}

	// Redirect if subscription is truly invalid
	return true;
}

/**
 * Get readable subscription status label
 */
export function getStatusLabel(status: SubscriptionStatusType | null): string {
	switch (status) {
		case "active":
			return "Active";
		case "trialing":
			return "Trial";
		case "past_due":
			return "Past Due";
		case "canceled":
			return "Canceled";
		case "incomplete":
			return "Incomplete";
		case "incomplete_expired":
			return "Expired";
		case "unpaid":
			return "Unpaid";
		case "paused":
			return "Paused";
		default:
			return "Unknown";
	}
}

/**
 * Get status badge color classes
 */
export function getStatusBadgeColor(
	status: SubscriptionStatusType | null
): string {
	switch (status) {
		case "active":
			return "bg-green-100 text-green-800";
		case "trialing":
			return "bg-blue-100 text-blue-800";
		case "past_due":
			return "bg-yellow-100 text-yellow-800";
		case "canceled":
		case "unpaid":
		case "incomplete_expired":
			return "bg-red-100 text-red-800";
		case "incomplete":
		case "paused":
			return "bg-gray-100 text-gray-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}
