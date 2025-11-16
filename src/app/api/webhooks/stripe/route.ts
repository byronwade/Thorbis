/**
 * Stripe Webhook Handler - Subscription Event Processing
 *
 * This endpoint receives and processes webhook events from Stripe
 * Handles subscription lifecycle events and updates database accordingly
 *
 * Events handled:
 * - checkout.session.completed - New subscription created
 * - customer.subscription.updated - Subscription status changed
 * - customer.subscription.deleted - Subscription canceled
 * - invoice.payment_succeeded - Payment successful
 * - invoice.payment_failed - Payment failed
 *
 * SECURITY: Verifies webhook signature to ensure requests come from Stripe
 */

import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/webhooks/stripe
 *
 * Stripe webhook endpoint
 * Must be configured in Stripe Dashboard: https://dashboard.stripe.com/webhooks
 */
export async function POST(request: NextRequest) {
  if (!stripe) {
    console.error("Stripe not configured");
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    console.error("No Stripe signature found");
    return NextResponse.json({ error: "No signature found" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Webhook secret not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  if (!stripe) {
    return NextResponse.json(
      { error: "Payment service unavailable" },
      { status: 503 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Signature verification failed",
      },
      { status: 400 }
    );
  }

  // Process the event
  try {
    // Validate event structure
    if (!(event.data && event.data.object)) {
      console.error("Invalid event structure: missing data or object");
      return NextResponse.json(
        { error: "Invalid event structure" },
        { status: 400 }
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (!session) {
          console.error("checkout.session.completed: session is undefined");
          break;
        }
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        if (!subscription) {
          console.error(
            "customer.subscription.updated: subscription is undefined"
          );
          break;
        }
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        if (!subscription) {
          console.error(
            "customer.subscription.deleted: subscription is undefined"
          );
          break;
        }
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice) {
          console.error("invoice.payment_succeeded: invoice is undefined");
          break;
        }
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice) {
          console.error("invoice.payment_failed: invoice is undefined");
          break;
        }
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout session
 *
 * Creates or updates subscription record in database
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  if (!supabase) {
    console.error("Supabase not configured");
    return;
  }

  if (!session) {
    console.error("handleCheckoutSessionCompleted: session is undefined");
    return;
  }

  const subscriptionId = session.subscription as string;
  const companyId = session.metadata?.company_id;
  const phoneNumber = session.metadata?.phone_number;

  if (!(companyId && subscriptionId)) {
    console.error("Missing company_id or subscription_id in session metadata");
    return;
  }

  // Get subscription details from Stripe
  if (!stripe) return;
  const subscriptionData: any =
    await stripe.subscriptions.retrieve(subscriptionId);

  // Update company with subscription details
  await supabase
    .from("companies")
    .update({
      stripe_subscription_id: subscriptionData.id,
      stripe_subscription_status: subscriptionData.status,
      subscription_current_period_start: new Date(
        subscriptionData.current_period_start * 1000
      ).toISOString(),
      subscription_current_period_end: new Date(
        subscriptionData.current_period_end * 1000
      ).toISOString(),
      subscription_cancel_at_period_end: subscriptionData.cancel_at_period_end,
      trial_ends_at: subscriptionData.trial_end
        ? new Date(subscriptionData.trial_end * 1000).toISOString()
        : null,
    })
    .eq("id", companyId);

  // Purchase phone number if one was selected during onboarding
  if (phoneNumber) {
    try {
      const { purchasePhoneNumber } = await import("@/actions/telnyx");
      const purchaseResult = await purchasePhoneNumber({
        phoneNumber,
        companyId,
      });

      if (purchaseResult.success) {
        console.log(
          `Phone number ${phoneNumber} purchased for company ${companyId}`
        );
      } else if ("error" in purchaseResult) {
        console.error(
          `Failed to purchase phone number: ${purchaseResult.error}`
        );
      }
    } catch (error) {
      console.error("Error purchasing phone number after payment:", error);
    }
  }

  // Send team member invitations after payment is complete
  try {
    const { sendTeamMemberInvitations } = await import(
      "@/actions/team-invitations"
    );
    const invitationResult = await sendTeamMemberInvitations(companyId);

    if (invitationResult.success && invitationResult.data) {
      console.log(
        `Sent ${invitationResult.data.sent} team invitations for company ${companyId}`
      );
      if (invitationResult.data.failed > 0) {
        console.error(
          `Failed to send ${invitationResult.data.failed} team invitations`
        );
      }
    } else {
      console.error(
        `Failed to send team invitations: ${invitationResult.success ? "Unknown error" : invitationResult.error || "Unknown error"}`
      );
    }
  } catch (error) {
    console.error("Error sending team invitations after payment:", error);
  }

  console.log(
    `Subscription ${subscriptionId} created for company ${companyId}`
  );
}

/**
 * Handle subscription update
 *
 * Updates subscription status, period dates, and cancellation status
 */
async function handleSubscriptionUpdated(subscription: any) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  if (!supabase) {
    console.error("Supabase not configured");
    return;
  }

  if (!subscription) {
    console.error("handleSubscriptionUpdated: subscription is undefined");
    return;
  }

  const companyId = subscription.metadata?.company_id;

  if (!companyId) {
    console.error("Missing company_id in subscription metadata");
    return;
  }

  // Update company subscription details
  await supabase
    .from("companies")
    .update({
      stripe_subscription_status: subscription.status,
      subscription_current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      subscription_current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      subscription_cancel_at_period_end: subscription.cancel_at_period_end,
      trial_ends_at: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
    })
    .eq("stripe_subscription_id", subscription.id);

  console.log(
    `Subscription ${subscription.id} updated for company ${companyId}`
  );
}

/**
 * Handle subscription deletion
 *
 * Marks subscription as canceled in database
 */
async function handleSubscriptionDeleted(subscription: any) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  if (!supabase) {
    console.error("Supabase not configured");
    return;
  }

  if (!subscription) {
    console.error("handleSubscriptionDeleted: subscription is undefined");
    return;
  }

  // Update company subscription status to canceled
  await supabase
    .from("companies")
    .update({
      stripe_subscription_status: "canceled",
      subscription_cancel_at_period_end: false,
    })
    .eq("stripe_subscription_id", subscription.id);

  console.log(`Subscription ${subscription.id} deleted`);
}

/**
 * Handle successful invoice payment
 *
 * Updates subscription status to active if it was past_due
 */
async function handleInvoicePaymentSucceeded(invoice: any) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  if (!supabase) {
    console.error("Supabase not configured");
    return;
  }

  if (!invoice) {
    console.error("handleInvoicePaymentSucceeded: invoice is undefined");
    return;
  }

  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    return; // Not a subscription invoice
  }

  // Update subscription status to active
  await supabase
    .from("companies")
    .update({
      stripe_subscription_status: "active",
    })
    .eq("stripe_subscription_id", subscriptionId);

  console.log(`Invoice payment succeeded for subscription ${subscriptionId}`);
}

/**
 * Handle failed invoice payment
 *
 * Updates subscription status to past_due
 */
async function handleInvoicePaymentFailed(invoice: any) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  if (!supabase) {
    console.error("Supabase not configured");
    return;
  }

  if (!invoice) {
    console.error("handleInvoicePaymentFailed: invoice is undefined");
    return;
  }

  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    return; // Not a subscription invoice
  }

  // Update subscription status to past_due
  await supabase
    .from("companies")
    .update({
      stripe_subscription_status: "past_due",
    })
    .eq("stripe_subscription_id", subscriptionId);

  console.log(`Invoice payment failed for subscription ${subscriptionId}`);
}
