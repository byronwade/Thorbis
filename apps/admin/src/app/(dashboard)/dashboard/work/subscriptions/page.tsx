import { Suspense } from "react";
import { SubscriptionsTable } from "@/components/work/subscriptions-table";
import { getSubscriptions } from "@/actions/billing";
import { SubscriptionsTableSkeleton } from "@/components/work/subscriptions-table-skeleton";
import type { Subscription } from "@/types/entities";

// Plan pricing in cents (matches Stripe configuration)
const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
	free: { monthly: 0, yearly: 0 },
	starter: { monthly: 4900, yearly: 47000 }, // $49/mo or $470/yr
	professional: { monthly: 9900, yearly: 95000 }, // $99/mo or $950/yr
	enterprise: { monthly: 19900, yearly: 191000 }, // $199/mo or $1910/yr
};

function getPlanAmount(plan: string, interval: string): number {
	const planPrices = PLAN_PRICES[plan.toLowerCase()] || PLAN_PRICES.free;
	return interval === "yearly" || interval === "year"
		? planPrices.yearly
		: planPrices.monthly;
}

/**
 * Subscriptions Management Page
 *
 * Displays all subscriptions on the platform.
 */
async function SubscriptionsData() {
	const result = await getSubscriptions(100);

	if (result.error || !result.data) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{result.error || "Failed to load subscriptions"}
				</p>
			</div>
		);
	}

	// Transform to Subscription type
	const subscriptions: Subscription[] = result.data.map((sub) => {
		const interval = sub.interval || "monthly";
		return {
			id: sub.stripe_subscription_id || sub.id,
			companyId: sub.company_id,
			companyName: sub.company_name,
			plan: sub.plan as "starter" | "professional" | "enterprise",
			status: sub.status as "active" | "trialing" | "past_due" | "cancelled" | "paused",
			amount: getPlanAmount(sub.plan || "free", interval),
			interval: interval,
			currentPeriodStart: sub.current_period_start || sub.created_at,
			currentPeriodEnd: sub.current_period_end || sub.created_at,
			cancelAtPeriodEnd: sub.cancel_at_period_end,
			createdAt: sub.created_at,
		};
	});

	return (
		<SubscriptionsTable
			subscriptions={subscriptions}
			totalCount={subscriptions.length}
			showRefresh
		/>
	);
}

export default function SubscriptionsPage() {
	return (
		<div className="flex flex-col">
			<Suspense fallback={<SubscriptionsTableSkeleton />}>
				<SubscriptionsData />
			</Suspense>
		</div>
	);
}
