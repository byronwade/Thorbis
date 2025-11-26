import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2024-11-20.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Stripe Platform Billing Webhook Handler
 *
 * Handles asynchronous Stripe events for platform subscription billing.
 * Events handled:
 * - checkout.session.completed
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - customer.subscription.trial_will_end
 * - invoice.payment_succeeded
 * - invoice.payment_failed
 *
 * Security: Verifies webhook signature to ensure events are from Stripe.
 */
export async function POST(req: NextRequest) {
	try {
		// Get raw body for signature verification
		const body = await req.text();
		const signature = req.headers.get("stripe-signature");

		if (!signature) {
			console.error("Missing Stripe signature");
			return NextResponse.json({ error: "Missing signature" }, { status: 400 });
		}

		// Verify webhook signature
		let event: Stripe.Event;
		try {
			event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
		} catch (err) {
			console.error("Webhook signature verification failed:", err);
			return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
		}

		// Handle the event
		console.log(`[Stripe Webhook] Received event: ${event.type}`);

		switch (event.type) {
			case "checkout.session.completed":
				await handleCheckoutSessionCompleted(
					event.data.object as Stripe.Checkout.Session,
				);
				break;

			case "customer.subscription.created":
				await handleSubscriptionCreated(
					event.data.object as Stripe.Subscription,
				);
				break;

			case "customer.subscription.updated":
				await handleSubscriptionUpdated(
					event.data.object as Stripe.Subscription,
				);
				break;

			case "customer.subscription.deleted":
				await handleSubscriptionDeleted(
					event.data.object as Stripe.Subscription,
				);
				break;

			case "customer.subscription.trial_will_end":
				await handleTrialWillEnd(event.data.object as Stripe.Subscription);
				break;

			case "invoice.payment_succeeded":
				await handleInvoicePaymentSucceeded(
					event.data.object as Stripe.Invoice,
				);
				break;

			case "invoice.payment_failed":
				await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
				break;

			default:
				console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
		}

		return NextResponse.json({ received: true }, { status: 200 });
	} catch (error) {
		console.error("[Stripe Webhook] Error processing webhook:", error);
		return NextResponse.json(
			{ error: "Webhook processing failed" },
			{ status: 500 },
		);
	}
}

/**
 * Handle checkout.session.completed
 * Updates company record with subscription details
 */
async function handleCheckoutSessionCompleted(
	session: Stripe.Checkout.Session,
) {
	const supabase = createServiceSupabaseClient();
	const companyId = session.metadata?.company_id;

	if (!companyId) {
		console.error("Missing company_id in checkout session metadata");
		return;
	}

	const subscriptionId =
		typeof session.subscription === "string"
			? session.subscription
			: session.subscription?.id;
	const customerId =
		typeof session.customer === "string"
			? session.customer
			: session.customer?.id;

	const { error } = await supabase
		.from("companies")
		.update({
			stripe_customer_id: customerId,
			stripe_subscription_id: subscriptionId,
			payment_method_collected: true,
			updated_at: new Date().toISOString(),
		})
		.eq("id", companyId);

	if (error) {
		console.error("Error updating company after checkout:", error);
	} else {
		console.log(
			`[Stripe Webhook] Updated company ${companyId} with subscription ${subscriptionId}`,
		);
	}
}

/**
 * Handle customer.subscription.created
 * Records subscription start
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
	const supabase = createServiceSupabaseClient();
	const companyId = subscription.metadata?.company_id;

	if (!companyId) {
		console.error("Missing company_id in subscription metadata");
		return;
	}

	const trialEnd = subscription.trial_end
		? new Date(subscription.trial_end * 1000).toISOString()
		: null;

	const { error } = await supabase
		.from("companies")
		.update({
			stripe_subscription_id: subscription.id,
			stripe_subscription_status: subscription.status,
			trial_ends_at: trialEnd,
			updated_at: new Date().toISOString(),
		})
		.eq("id", companyId);

	if (error) {
		console.error("Error updating company subscription status:", error);
	} else {
		console.log(
			`[Stripe Webhook] Subscription created for company ${companyId}`,
		);
	}
}

/**
 * Handle customer.subscription.updated
 * Updates subscription status changes
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
	const supabase = createServiceSupabaseClient();
	const companyId = subscription.metadata?.company_id;

	if (!companyId) {
		console.error("Missing company_id in subscription metadata");
		return;
	}

	const { error } = await supabase
		.from("companies")
		.update({
			stripe_subscription_status: subscription.status,
			updated_at: new Date().toISOString(),
		})
		.eq("id", companyId);

	if (error) {
		console.error("Error updating subscription status:", error);
	} else {
		console.log(
			`[Stripe Webhook] Subscription updated for company ${companyId}: ${subscription.status}`,
		);
	}
}

/**
 * Handle customer.subscription.deleted
 * Marks subscription as cancelled
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
	const supabase = createServiceSupabaseClient();
	const companyId = subscription.metadata?.company_id;

	if (!companyId) {
		console.error("Missing company_id in subscription metadata");
		return;
	}

	const { error } = await supabase
		.from("companies")
		.update({
			stripe_subscription_status: "canceled",
			subscription_canceled_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})
		.eq("id", companyId);

	if (error) {
		console.error("Error marking subscription as canceled:", error);
	} else {
		console.log(
			`[Stripe Webhook] Subscription canceled for company ${companyId}`,
		);
	}
}

/**
 * Handle customer.subscription.trial_will_end
 * Sends notification 3 days before trial ends
 */
async function handleTrialWillEnd(subscription: Stripe.Subscription) {
	const supabase = createServiceSupabaseClient();
	const companyId = subscription.metadata?.company_id;

	if (!companyId) {
		console.error("Missing company_id in subscription metadata");
		return;
	}

	// TODO: Send trial ending notification email
	console.log(`[Stripe Webhook] Trial will end soon for company ${companyId}`);

	// Log event for potential email sending
	// In production, you'd trigger an email notification here
}

/**
 * Handle invoice.payment_succeeded
 * Records successful payment
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
	const supabase = createServiceSupabaseClient();

	// Get company ID from customer metadata
	const customerId =
		typeof invoice.customer === "string"
			? invoice.customer
			: invoice.customer?.id;

	if (!customerId) {
		console.error("Missing customer in invoice");
		return;
	}

	const { data: company } = await supabase
		.from("companies")
		.select("id")
		.eq("stripe_customer_id", customerId)
		.single();

	if (!company) {
		console.error(`Company not found for customer ${customerId}`);
		return;
	}

	console.log(
		`[Stripe Webhook] Payment succeeded for company ${company.id}: ${invoice.amount_paid / 100} ${invoice.currency}`,
	);

	// Update last payment date
	await supabase
		.from("companies")
		.update({
			last_payment_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})
		.eq("id", company.id);
}

/**
 * Handle invoice.payment_failed
 * Records failed payment and potentially notifies company
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
	const supabase = createServiceSupabaseClient();

	// Get company ID from customer metadata
	const customerId =
		typeof invoice.customer === "string"
			? invoice.customer
			: invoice.customer?.id;

	if (!customerId) {
		console.error("Missing customer in invoice");
		return;
	}

	const { data: company } = await supabase
		.from("companies")
		.select("id")
		.eq("stripe_customer_id", customerId)
		.single();

	if (!company) {
		console.error(`Company not found for customer ${customerId}`);
		return;
	}

	console.error(
		`[Stripe Webhook] Payment FAILED for company ${company.id}: ${invoice.amount_due / 100} ${invoice.currency}`,
	);

	// TODO: Send payment failure notification email
	// In production, trigger email to company about failed payment
	// Consider updating subscription status or limiting access
}
