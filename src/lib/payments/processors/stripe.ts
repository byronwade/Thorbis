/**
 * Stripe Payment Processor
 *
 * Wrapper around existing Stripe integration.
 * Used ONLY for platform billing (subscriptions), NOT for contractor payments.
 *
 * Contractor payments should use Adyen to avoid Stripe's limitations
 * on high-value transactions.
 */

import { stripe } from "@/lib/stripe/server";
import type {
  PaymentChannel,
  PaymentProcessor,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  RefundPaymentRequest,
  RefundPaymentResponse,
} from "../processor";

interface StripeConfig {
  companyId: string;
  liveMode?: boolean;
}

export class StripeProcessor implements PaymentProcessor {
  private config: StripeConfig;

  constructor(config: StripeConfig) {
    this.config = config;
  }

  getSupportedChannels(): PaymentChannel[] {
    return ["online"];
  }

  async processPayment(
    request: ProcessPaymentRequest
  ): Promise<ProcessPaymentResponse> {
    if (!stripe) {
      return {
        success: false,
        status: "failed",
        error: "Stripe is not configured",
      };
    }

    try {
      // WARNING: Stripe has limitations on high-value payments
      // This should only be used for platform billing, not contractor payments
      if (request.amount > 100_000) {
        // $1,000 - warn but allow (for platform billing)
        console.warn(
          `High-value payment ($${request.amount / 100}) processed through Stripe. Consider using Adyen for amounts > $10,000.`
        );
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: request.amount,
        currency: request.currency || "usd",
        customer: request.customerId,
        payment_method: request.paymentMethodId,
        confirm: true,
        metadata: {
          company_id: this.config.companyId,
          invoice_id: request.invoiceId || "",
          channel: request.channel,
          ...request.metadata,
        },
        description: request.description,
      });

      return {
        success: paymentIntent.status === "succeeded",
        transactionId: paymentIntent.id,
        processorTransactionId: paymentIntent.id,
        status:
          paymentIntent.status === "succeeded"
            ? "succeeded"
            : paymentIntent.status === "requires_action"
              ? "requires_action"
              : "processing",
        clientSecret: paymentIntent.client_secret || undefined,
        processorMetadata: paymentIntent as unknown as Record<string, unknown>,
      };
    } catch (error: any) {
      console.error("Stripe payment processing error:", error);
      return {
        success: false,
        status: "failed",
        error: error.message || "Payment processing failed",
        failureCode: error.code,
        failureMessage: error.message,
      };
    }
  }

  async refundPayment(
    request: RefundPaymentRequest
  ): Promise<RefundPaymentResponse> {
    if (!stripe) {
      return {
        success: false,
        status: "failed",
        error: "Stripe is not configured",
      };
    }

    try {
      const refund = await stripe.refunds.create({
        payment_intent: request.transactionId,
        amount: request.amount,
        metadata: {
          reason: request.reason || "",
          ...request.metadata,
        },
      });

      return {
        success: refund.status === "succeeded",
        refundId: refund.id,
        processorRefundId: refund.id,
        status: refund.status === "succeeded" ? "succeeded" : "processing",
      };
    } catch (error: any) {
      console.error("Stripe refund error:", error);
      return {
        success: false,
        status: "failed",
        error: error.message || "Refund failed",
      };
    }
  }

  async getPaymentStatus(transactionId: string): Promise<{
    status: string;
    amount: number;
    metadata?: Record<string, unknown>;
  }> {
    if (!stripe) {
      throw new Error("Stripe is not configured");
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);

    return {
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      metadata: paymentIntent as unknown as Record<string, unknown>,
    };
  }

  verifyWebhook(payload: string, signature: string): boolean {
    if (!stripe) return false;

    try {
      // Stripe webhook signature verification
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) return false;

      // Note: This is a simplified check - in production, use Stripe's webhook.constructEvent
      // which properly verifies the signature
      return true; // Placeholder - implement proper verification
    } catch (error) {
      console.error("Stripe webhook verification error:", error);
      return false;
    }
  }
}
