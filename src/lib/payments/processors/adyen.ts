/**
 * Adyen Payment Processor
 *
 * Handles high-value payments through Adyen for Platforms:
 * - Card-present payments (card readers)
 * - Tap-to-Pay on iPhone/Android
 * - Online payments
 * - ACH payments (via Adyen's ACH integration)
 *
 * Adyen is ideal for high-value payments because:
 * - No hard limits on payment amounts
 * - Trust-based approval system
 * - Platform model supports sub-merchant onboarding
 * - Better suited for B2B and high-ticket transactions
 */

import type {
  PaymentChannel,
  PaymentProcessor,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  RefundPaymentRequest,
  RefundPaymentResponse,
} from "../processor";

interface AdyenConfig {
  companyId: string;
  accountId: string;
  apiKey: string;
  merchantAccount: string;
  liveMode: boolean;
}

export class AdyenProcessor implements PaymentProcessor {
  private config: AdyenConfig;
  private apiUrl: string;

  constructor(config: AdyenConfig) {
    this.config = config;
    this.apiUrl = config.liveMode
      ? "https://api.adyen.com"
      : "https://api-adyen-test.adyen.com";
  }

  getSupportedChannels(): PaymentChannel[] {
    return ["online", "card_present", "tap_to_pay", "ach"];
  }

  async processPayment(
    request: ProcessPaymentRequest
  ): Promise<ProcessPaymentResponse> {
    try {
      // For Adyen, we need to create a payment request
      const paymentRequest = {
        amount: {
          value: request.amount,
          currency: request.currency || "USD",
        },
        merchantAccount: this.config.merchantAccount,
        reference: request.invoiceId || `invoice-${Date.now()}`,
        paymentMethod: request.paymentMethodId
          ? {
              type: "scheme", // Credit card
              storedPaymentMethodId: request.paymentMethodId,
            }
          : undefined,
        returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/work/invoices/${request.invoiceId}`,
        metadata: {
          company_id: this.config.companyId,
          customer_id: request.customerId,
          invoice_id: request.invoiceId,
          channel: request.channel,
          ...request.metadata,
        },
      };

      // Make API call to Adyen
      const response = await fetch(`${this.apiUrl}/v68/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.config.apiKey,
        },
        body: JSON.stringify(paymentRequest),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          status: "failed",
          error: data.message || "Payment processing failed",
          failureCode: data.errorCode,
          failureMessage: data.message,
        };
      }

      // Handle different response types
      if (data.resultCode === "Authorised" || data.resultCode === "Received") {
        return {
          success: true,
          transactionId: data.pspReference,
          processorTransactionId: data.pspReference,
          status: "succeeded",
          processorMetadata: data,
        };
      }
      if (
        data.resultCode === "Pending" ||
        data.resultCode === "RedirectShopper"
      ) {
        return {
          success: true,
          transactionId: data.pspReference,
          processorTransactionId: data.pspReference,
          status: "requires_action",
          clientSecret: data.action?.paymentData || data.pspReference,
          processorMetadata: data,
        };
      }
      return {
        success: false,
        status: "failed",
        error: data.refusalReason || "Payment was refused",
        failureCode: data.refusalReasonCode,
        failureMessage: data.refusalReason,
        processorMetadata: data,
      };
    } catch (error) {
      console.error("Adyen payment processing error:", error);
      return {
        success: false,
        status: "failed",
        error:
          error instanceof Error ? error.message : "Payment processing failed",
      };
    }
  }

  async refundPayment(
    request: RefundPaymentRequest
  ): Promise<RefundPaymentResponse> {
    try {
      const refundRequest = {
        merchantAccount: this.config.merchantAccount,
        originalReference: request.transactionId,
        amount: request.amount
          ? {
              value: request.amount,
              currency: "USD",
            }
          : undefined, // Full refund if amount not specified
        reference: `refund-${Date.now()}`,
        metadata: {
          reason: request.reason,
          ...request.metadata,
        },
      };

      const response = await fetch(
        `${this.apiUrl}/v68/payments/${request.transactionId}/refunds`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": this.config.apiKey,
          },
          body: JSON.stringify(refundRequest),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          status: "failed",
          error: data.message || "Refund failed",
        };
      }

      return {
        success: true,
        refundId: data.pspReference,
        processorRefundId: data.pspReference,
        status: data.status === "received" ? "succeeded" : "processing",
      };
    } catch (error) {
      console.error("Adyen refund error:", error);
      return {
        success: false,
        status: "failed",
        error: error instanceof Error ? error.message : "Refund failed",
      };
    }
  }

  async getPaymentStatus(transactionId: string): Promise<{
    status: string;
    amount: number;
    metadata?: Record<string, unknown>;
  }> {
    try {
      const response = await fetch(
        `${this.apiUrl}/v68/payments/${transactionId}`,
        {
          method: "GET",
          headers: {
            "X-API-Key": this.config.apiKey,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get payment status");
      }

      return {
        status: data.status || "unknown",
        amount: data.amount?.value || 0,
        metadata: data,
      };
    } catch (error) {
      console.error("Adyen get payment status error:", error);
      throw error;
    }
  }

  verifyWebhook(payload: string, signature: string): boolean {
    // Adyen webhook verification
    // In production, use Adyen's webhook signature verification
    // This is a simplified version - implement proper HMAC verification
    try {
      // TODO: Implement proper Adyen webhook signature verification
      // Adyen uses HMAC SHA256 with a webhook username/password
      return true; // Placeholder
    } catch (error) {
      console.error("Adyen webhook verification error:", error);
      return false;
    }
  }
}
