"use server";

/**
 * Invoice Payment Server Actions
 *
 * Handles invoice payment processing with Stripe:
 * - Create payment intent
 * - Process payment with saved card
 * - Process payment with new card
 * - Update invoice status after successful payment
 * - Record payment transactions
 */

import { revalidatePath } from "next/cache";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Create a Stripe Payment Intent for an invoice
 */
export async function createInvoicePaymentIntent(invoiceId: string) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    if (!stripe) {
      return { success: false, error: "Payment service unavailable" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*, customer:customers!customer_id(*)")
      .eq("id", invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return { success: false, error: "Invoice not found" };
    }

    if (invoice.balance_amount <= 0) {
      return { success: false, error: "Invoice is already paid" };
    }

    // Get or create Stripe customer
    let stripeCustomerId = invoice.customer?.stripe_customer_id;

    if (!stripeCustomerId) {
      // Create Stripe customer
      const stripeCustomer = await stripe.customers.create({
        email: invoice.customer.email,
        name: `${invoice.customer.first_name} ${invoice.customer.last_name}`,
        metadata: {
          customer_id: invoice.customer_id,
          company_id: invoice.company_id,
        },
      });

      stripeCustomerId = stripeCustomer.id;

      // Save Stripe customer ID
      await supabase
        .from("customers")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", invoice.customer_id);
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: invoice.balance_amount, // Amount in cents
      currency: "usd",
      customer: stripeCustomerId,
      metadata: {
        invoice_id: invoiceId,
        invoice_number: invoice.invoice_number,
        customer_id: invoice.customer_id,
        company_id: invoice.company_id,
      },
      description: `Invoice ${invoice.invoice_number}${invoice.title ? ` - ${invoice.title}` : ""}`,
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: invoice.balance_amount,
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create payment intent",
    };
  }
}

/**
 * Process payment with a saved payment method
 */
export async function payInvoiceWithSavedCard({
  invoiceId,
  paymentMethodId,
}: {
  invoiceId: string;
  paymentMethodId: string;
}) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    if (!stripe) {
      return { success: false, error: "Payment service unavailable" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get invoice and payment method
    const { data: invoice } = await supabase
      .from("invoices")
      .select("*, customer:customers!customer_id(*)")
      .eq("id", invoiceId)
      .single();

    const { data: paymentMethod } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("id", paymentMethodId)
      .single();

    if (!(invoice && paymentMethod)) {
      return { success: false, error: "Invoice or payment method not found" };
    }

    if (invoice.balance_amount <= 0) {
      return { success: false, error: "Invoice is already paid" };
    }

    // Create payment intent with saved payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: invoice.balance_amount,
      currency: "usd",
      customer: invoice.customer.stripe_customer_id,
      payment_method: paymentMethod.stripe_payment_method_id,
      confirm: true, // Immediately confirm the payment
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/work/invoices/${invoiceId}`,
      metadata: {
        invoice_id: invoiceId,
        invoice_number: invoice.invoice_number,
        customer_id: invoice.customer_id,
        company_id: invoice.company_id,
      },
      description: `Invoice ${invoice.invoice_number}${invoice.title ? ` - ${invoice.title}` : ""}`,
    });

    // Check payment status
    if (paymentIntent.status === "succeeded") {
      // Update invoice as paid
      await supabase
        .from("invoices")
        .update({
          status: "paid",
          paid_amount: invoice.total_amount,
          balance_amount: 0,
        })
        .eq("id", invoiceId);

      // Update payment method last used
      await supabase
        .from("payment_methods")
        .update({ last_used_at: new Date().toISOString() })
        .eq("id", paymentMethodId);

      revalidatePath(`/dashboard/work/invoices/${invoiceId}`);
      revalidatePath(`/dashboard/customers/${invoice.customer_id}`);

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        status: "succeeded",
      };
    }
    if (paymentIntent.status === "requires_action") {
      // 3D Secure or other authentication required
      return {
        success: false,
        error: "Payment requires additional authentication",
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
      };
    }
    return {
      success: false,
      error: "Payment failed",
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error("Error processing payment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment failed",
    };
  }
}

/**
 * Confirm a payment intent (after 3D Secure or manual confirmation)
 */
export async function confirmInvoicePayment({
  invoiceId,
  paymentIntentId,
}: {
  invoiceId: string;
  paymentIntentId: string;
}) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    if (!stripe) {
      return { success: false, error: "Payment service unavailable" };
    }

    // Retrieve payment intent to check status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Update invoice as paid
      const { data: invoice } = await supabase
        .from("invoices")
        .select("total_amount, customer_id")
        .eq("id", invoiceId)
        .single();

      if (invoice) {
        await supabase
          .from("invoices")
          .update({
            status: "paid",
            paid_amount: invoice.total_amount,
            balance_amount: 0,
          })
          .eq("id", invoiceId);

        revalidatePath(`/dashboard/work/invoices/${invoiceId}`);
        revalidatePath(`/dashboard/customers/${invoice.customer_id}`);
      }

      return { success: true, status: "succeeded" };
    }

    return {
      success: false,
      error: "Payment not completed",
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error("Error confirming payment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to confirm payment",
    };
  }
}

/**
 * Get invoice payment details (for display in payment dialog)
 */
export async function getInvoicePaymentDetails(invoiceId: string) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const { data: invoice, error } = await supabase
      .from("invoices")
      .select(`
        *,
        customer:customers!customer_id(
          id,
          first_name,
          last_name,
          email,
          stripe_customer_id
        )
      `)
      .eq("id", invoiceId)
      .single();

    if (error || !invoice) {
      return { success: false, error: "Invoice not found" };
    }

    // Get customer's payment methods
    const { data: paymentMethods } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("customer_id", invoice.customer_id)
      .eq("is_active", true)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    return {
      success: true,
      invoice,
      paymentMethods: paymentMethods || [],
    };
  } catch (error) {
    console.error("Error getting invoice payment details:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load payment details",
    };
  }
}
