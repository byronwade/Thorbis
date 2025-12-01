"use server";

/**
 * Billing Management Actions
 *
 * Server actions for managing billing, subscriptions, and payments.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";

export interface SubscriptionDetails {
	id: string;
	company_id: string;
	company_name: string;
	stripe_subscription_id?: string;
	stripe_customer_id?: string;
	plan: string;
	status: string;
	amount?: number;
	interval?: "monthly" | "yearly";
	current_period_start?: string;
	current_period_end?: string;
	trial_ends_at?: string;
	cancel_at_period_end?: boolean;
	created_at: string;
}

/**
 * Get all subscriptions from database
 */
export async function getSubscriptions(limit: number = 100) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();

	// Get companies with subscription info
	const { data: companies, error } = await webDb
		.from("companies")
		.select("id, name, stripe_subscription_id, stripe_customer_id, subscription_tier, stripe_subscription_status, subscription_current_period_start, subscription_current_period_end, trial_ends_at, subscription_cancel_at_period_end, created_at")
		.not("stripe_subscription_id", "is", null)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) {
		return { error: "Failed to fetch subscriptions" };
	}

	const subscriptions: SubscriptionDetails[] = (companies || []).map((company) => ({
		id: company.stripe_subscription_id || company.id,
		company_id: company.id,
		company_name: company.name,
		stripe_subscription_id: company.stripe_subscription_id,
		stripe_customer_id: company.stripe_customer_id,
		plan: company.subscription_tier || "free",
		status: company.stripe_subscription_status || "active",
		current_period_start: company.subscription_current_period_start,
		current_period_end: company.subscription_current_period_end,
		trial_ends_at: company.trial_ends_at,
		cancel_at_period_end: company.subscription_cancel_at_period_end || false,
		created_at: company.created_at,
	}));

	return { data: subscriptions };
}

/**
 * Get subscription by ID
 */
export async function getSubscriptionById(subscriptionId: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();

	// Find company by subscription ID
	const { data: company, error } = await webDb
		.from("companies")
		.select("*")
		.eq("stripe_subscription_id", subscriptionId)
		.single();

	if (error || !company) {
		return { error: "Subscription not found" };
	}

	// TODO: Fetch additional details from Stripe API
	// const stripeSubscription = await getStripeSubscription(subscriptionId);

	return {
		data: {
			id: company.stripe_subscription_id || company.id,
			company_id: company.id,
			company_name: company.name,
			stripe_subscription_id: company.stripe_subscription_id,
			stripe_customer_id: company.stripe_customer_id,
			plan: company.subscription_tier || "free",
			status: company.stripe_subscription_status || "active",
			current_period_start: company.subscription_current_period_start,
			current_period_end: company.subscription_current_period_end,
			trial_ends_at: company.trial_ends_at,
			cancel_at_period_end: company.subscription_cancel_at_period_end || false,
			created_at: company.created_at,
		},
	};
}

/**
 * Get billing dashboard stats
 */
export async function getBillingDashboardStats() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();

	// Get all companies with subscriptions
	const { data: companies } = await webDb
		.from("companies")
		.select("stripe_subscription_status, subscription_tier, created_at")
		.not("stripe_subscription_id", "is", null);

	if (!companies) {
		return {
			data: {
				total_mrr: 0,
				active_count: 0,
				trial_count: 0,
				past_due_count: 0,
				churned_this_month: 0,
			},
		};
	}

	const active = companies.filter((c) => c.stripe_subscription_status === "active").length;
	const trialing = companies.filter((c) => c.stripe_subscription_status === "trialing").length;
	const pastDue = companies.filter((c) => c.stripe_subscription_status === "past_due").length;

	// Calculate MRR (simplified - would need actual subscription amounts from Stripe)
	const mrr = active * 100; // Placeholder: $100/month per active subscription

	return {
		data: {
			total_mrr: mrr,
			active_count: active,
			trial_count: trialing,
			past_due_count: pastDue,
			churned_this_month: 0, // TODO: Calculate from cancelled subscriptions this month
		},
	};
}

/**
 * Cancel subscription
 * 
 * TODO: Implement Stripe API call to cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	// TODO: Call Stripe API to cancel subscription
	// const stripe = getStripeClient();
	// await stripe.subscriptions.cancel(subscriptionId);

	return { error: "Subscription cancellation not yet implemented" };
}

/**
 * Reactivate subscription
 * 
 * TODO: Implement Stripe API call to reactivate subscription
 */
export async function reactivateSubscription(subscriptionId: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	// TODO: Call Stripe API to reactivate subscription

	return { error: "Subscription reactivation not yet implemented" };
}



