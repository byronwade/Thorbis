import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmail } from "@/lib/email/email-sender";
import { EmailTemplate } from "@/lib/email/email-types";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import TrialEndingEmail from "@/emails/templates/subscription/trial-ending";
import PaymentFailedEmail from "@/emails/templates/subscription/payment-failed";

// Lazily initialize Stripe to avoid build-time errors
function getStripe() {
	if (!process.env.STRIPE_SECRET_KEY) {
		throw new Error("STRIPE_SECRET_KEY is not set");
	}
	return new Stripe(process.env.STRIPE_SECRET_KEY, {
		apiVersion: "2024-11-20.acacia",
	});
}

function getWebhookSecret() {
	if (!process.env.STRIPE_WEBHOOK_SECRET) {
		throw new Error("STRIPE_WEBHOOK_SECRET is not set");
	}
	return process.env.STRIPE_WEBHOOK_SECRET;
}

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
		const stripe = getStripe();
		const webhookSecret = getWebhookSecret();
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
	const stripe = getStripe();

	if (!companyId) {
		console.error("Missing company_id in subscription metadata");
		return;
	}

	console.log(`[Stripe Webhook] Trial will end soon for company ${companyId}`);

	// Get company and owner details
	const { data: company } = await supabase
		.from("companies")
		.select("id, name")
		.eq("id", companyId)
		.single();

	if (!company) {
		console.error(`Company not found: ${companyId}`);
		return;
	}

	// Get company owner (first active member with owner role)
	const { data: owner } = await supabase
		.from("company_memberships")
		.select("user_id, users!inner(email, raw_user_meta_data)")
		.eq("company_id", companyId)
		.eq("status", "active")
		.eq("role", "owner")
		.limit(1)
		.single();

	if (!owner?.users) {
		console.error(`Owner not found for company ${companyId}`);
		return;
	}

	const userMeta = owner.users.raw_user_meta_data as Record<string, unknown> | null;
	const ownerName = (userMeta?.full_name as string) || (userMeta?.name as string) || "there";
	const ownerEmail = owner.users.email;

	if (!ownerEmail) {
		console.error(`Owner email not found for company ${companyId}`);
		return;
	}

	// Calculate trial end date and days remaining
	const trialEndDate = subscription.trial_end
		? new Date(subscription.trial_end * 1000)
		: new Date();
	const daysRemaining = Math.max(
		0,
		Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
	);

	// Get plan details from subscription
	const planItem = subscription.items?.data?.[0];
	const planName = planItem?.plan?.nickname || "Professional";
	const monthlyPrice = planItem?.plan?.amount
		? `$${(planItem.plan.amount / 100).toFixed(2)}`
		: "$49.00";

	// Send trial ending email
	try {
		const result = await sendEmail({
			to: ownerEmail,
			subject: `Your Stratos trial ends in ${daysRemaining} days`,
			template: TrialEndingEmail({
				companyName: company.name,
				ownerName,
				daysRemaining,
				trialEndDate: trialEndDate.toLocaleDateString("en-US", {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				}),
				planName,
				monthlyPrice,
				billingUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://app.stratos.app"}/dashboard/settings/billing`,
			}),
			templateType: EmailTemplate.TRIAL_ENDING,
			skipPreSendChecks: true, // System email - must go out
		});

		if (result.success) {
			console.log(`[Stripe Webhook] Trial ending email sent to ${ownerEmail}`);
		} else {
			console.error(
				`[Stripe Webhook] Failed to send trial ending email: ${result.error}`,
			);
		}
	} catch (emailError) {
		console.error("[Stripe Webhook] Error sending trial ending email:", emailError);
	}
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
 * Records failed payment and notifies company
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
	const supabase = createServiceSupabaseClient();
	const stripe = getStripe();

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
		.select("id, name")
		.eq("stripe_customer_id", customerId)
		.single();

	if (!company) {
		console.error(`Company not found for customer ${customerId}`);
		return;
	}

	console.error(
		`[Stripe Webhook] Payment FAILED for company ${company.id}: ${invoice.amount_due / 100} ${invoice.currency}`,
	);

	// Update company with payment failure timestamp
	await supabase
		.from("companies")
		.update({
			payment_failed_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})
		.eq("id", company.id);

	// Get company owner for notification
	const { data: owner } = await supabase
		.from("company_memberships")
		.select("user_id, users!inner(email, raw_user_meta_data)")
		.eq("company_id", company.id)
		.eq("status", "active")
		.eq("role", "owner")
		.limit(1)
		.single();

	if (!owner?.users?.email) {
		console.error(`Owner email not found for company ${company.id}`);
		return;
	}

	const userMeta = owner.users.raw_user_meta_data as Record<string, unknown> | null;
	const ownerName = (userMeta?.full_name as string) || (userMeta?.name as string) || "there";
	const ownerEmail = owner.users.email;

	// Get payment method details
	let lastFourDigits = "****";
	let paymentMethod = "Card";

	try {
		// Get the payment method from the invoice
		const paymentMethodId =
			typeof invoice.payment_intent === "string"
				? invoice.payment_intent
				: invoice.payment_intent?.payment_method;

		if (paymentMethodId && typeof paymentMethodId === "string") {
			const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
			if (pm.card) {
				lastFourDigits = pm.card.last4;
				paymentMethod = pm.card.brand
					? pm.card.brand.charAt(0).toUpperCase() + pm.card.brand.slice(1)
					: "Card";
			} else if (pm.us_bank_account) {
				lastFourDigits = pm.us_bank_account.last4 || "****";
				paymentMethod = "Bank Account";
			}
		}
	} catch (pmError) {
		console.warn("[Stripe Webhook] Could not retrieve payment method:", pmError);
	}

	// Calculate grace period (7 days from now)
	const gracePeriodEnds = new Date();
	gracePeriodEnds.setDate(gracePeriodEnds.getDate() + 7);

	// Get attempt count from invoice
	const attemptCount = invoice.attempt_count || 1;

	// Send payment failed email
	try {
		const result = await sendEmail({
			to: ownerEmail,
			subject: `Action required: Payment failed for ${company.name}`,
			template: PaymentFailedEmail({
				companyName: company.name,
				ownerName,
				failedAt: new Date().toLocaleDateString("en-US", {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				}),
				attemptCount,
				lastFourDigits,
				paymentMethod,
				amountDue: `$${(invoice.amount_due / 100).toFixed(2)}`,
				gracePeriodEnds: gracePeriodEnds.toLocaleDateString("en-US", {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				}),
				daysRemainingInGrace: 7,
				updatePaymentUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://app.stratos.app"}/dashboard/settings/billing`,
			}),
			templateType: EmailTemplate.SUBSCRIPTION_PAYMENT_FAILED,
			skipPreSendChecks: true, // System email - must go out
		});

		if (result.success) {
			console.log(`[Stripe Webhook] Payment failed email sent to ${ownerEmail}`);
		} else {
			console.error(
				`[Stripe Webhook] Failed to send payment failed email: ${result.error}`,
			);
		}
	} catch (emailError) {
		console.error("[Stripe Webhook] Error sending payment failed email:", emailError);
	}
}
