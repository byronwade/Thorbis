import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { checkSubscriptionStatus } from "@/lib/auth/subscription-status";
import { PaymentRecoveryCardClient } from "./payment-recovery-client";

// Fetch payment failure details from Stripe
const getPaymentFailureDetails = cache(async (companyId: string) => {
	const supabase = await createClient();

	// Get company payment details
	const { data: company } = await supabase
		.from("companies")
		.select(`
			stripe_customer_id,
			stripe_subscription_id,
			stripe_subscription_status,
			payment_failed_at,
			subscription_current_period_end,
			stripe_payment_method_last4,
			stripe_payment_method_brand
		`)
		.eq("id", companyId)
		.single();

	if (!company || company.stripe_subscription_status !== "past_due") {
		return null;
	}

	// Calculate grace period
	const currentPeriodEnd = company.subscription_current_period_end
		? new Date(company.subscription_current_period_end)
		: new Date();
	const gracePeriodEnds = new Date(
		currentPeriodEnd.getTime() + 7 * 24 * 60 * 60 * 1000
	);
	const now = new Date();
	const daysRemainingInGrace = Math.max(
		0,
		Math.ceil((gracePeriodEnds.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
	);

	// Get failed payment info (we don't have the exact amount without Stripe API call)
	// For now, we'll show placeholder - in production you'd fetch from Stripe
	const failedAt = company.payment_failed_at
		? new Date(company.payment_failed_at).toLocaleDateString("en-US", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
		  })
		: new Date().toLocaleDateString("en-US", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
		  });

	return {
		amountDue: "$49.00", // Base subscription fee - would get from Stripe in production
		lastFourDigits: company.stripe_payment_method_last4 || "****",
		paymentMethod: company.stripe_payment_method_brand
			? company.stripe_payment_method_brand.charAt(0).toUpperCase() +
			  company.stripe_payment_method_brand.slice(1)
			: "Card",
		failedAt,
		attemptCount: 1, // Would track in database
		gracePeriodEnds: gracePeriodEnds.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		}),
		daysRemainingInGrace,
	};
});

/**
 * Server component that renders payment recovery UI if needed
 */
export async function PaymentRecoveryData() {
	const user = await getCurrentUser();
	if (!user?.company_id) {
		return null;
	}

	const subscriptionStatus = await checkSubscriptionStatus(user.company_id);

	// Only show if subscription is past due
	if (!subscriptionStatus.isPastDue) {
		return null;
	}

	const paymentDetails = await getPaymentFailureDetails(user.company_id);
	if (!paymentDetails) {
		return null;
	}

	return (
		<PaymentRecoveryCardClient
			{...paymentDetails}
			companyId={user.company_id}
		/>
	);
}
