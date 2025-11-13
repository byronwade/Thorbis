/**
 * ProfitStars (Jack Henry) Payment Processor
 *
 * Handles ACH and check processing through ProfitStars/Jack Henry:
 * - ACH payments
 * - Check processing
 * - Bank account verification
 * - High-volume ACH processing
 *
 * ProfitStars is ideal for:
 * - Large ACH transactions
 * - Check processing
 * - Businesses that need bank-rail specialists
 * - Reduced ACH returns and better compliance
 */

import type {
  PaymentChannel,
  PaymentProcessor,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  RefundPaymentRequest,
  RefundPaymentResponse,
} from "../processor-types";

interface ProfitStarsConfig {
  companyId: string;
  merchantId: string;
  apiKey: string;
  routingNumber: string;
}

export class ProfitStarsProcessor implements PaymentProcessor {
  private config: ProfitStarsConfig;
  private apiUrl = "https://api.profitstars.com"; // Update with actual API URL

  constructor(config: ProfitStarsConfig) {
    this.config = config;
  }

  getSupportedChannels(): PaymentChannel[] {
    return ["ach", "check"];
  }

  async processPayment(
    request: ProcessPaymentRequest
  ): Promise<ProcessPaymentResponse> {
    try {
      if (!request.paymentMethodId) {
        return {
          success: false,
          status: "failed",
          error: "Payment method (bank account) is required for ACH payments",
        };
      }

      // ProfitStars ACH payment request
      const achRequest = {
        merchant_id: this.config.merchantId,
        transaction_type: "ACH_DEBIT",
        amount: request.amount / 100, // Convert cents to dollars
        account_number: request.paymentMethodId, // Bank account identifier
        routing_number: this.config.routingNumber,
        reference_number: request.invoiceId || `invoice-${Date.now()}`,
        description: request.description || "Invoice payment",
        metadata: {
          company_id: this.config.companyId,
          customer_id: request.customerId,
          invoice_id: request.invoiceId,
          ...request.metadata,
        },
      };

      // Make API call to ProfitStars
      const response = await fetch(`${this.apiUrl}/v1/payments/ach`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
          "X-Merchant-ID": this.config.merchantId,
        },
        body: JSON.stringify(achRequest),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          status: "failed",
          error: data.message || "ACH payment processing failed",
          failureCode: data.error_code,
          failureMessage: data.message,
        };
      }

      return {
        success: true,
        transactionId: data.transaction_id,
        processorTransactionId: data.transaction_id,
        status: data.status === "processed" ? "succeeded" : "processing",
        processorMetadata: data,
      };
    } catch (error) {
      console.error("ProfitStars payment processing error:", error);
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
        merchant_id: this.config.merchantId,
        original_transaction_id: request.transactionId,
        amount: request.amount ? request.amount / 100 : undefined, // Convert cents to dollars
        reason: request.reason,
      };

      const response = await fetch(`${this.apiUrl}/v1/payments/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
          "X-Merchant-ID": this.config.merchantId,
        },
        body: JSON.stringify(refundRequest),
      });

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
        refundId: data.refund_id,
        processorRefundId: data.refund_id,
        status: data.status === "processed" ? "succeeded" : "processing",
      };
    } catch (error) {
      console.error("ProfitStars refund error:", error);
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
        `${this.apiUrl}/v1/payments/${transactionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            "X-Merchant-ID": this.config.merchantId,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get payment status");
      }

      return {
        status: data.status || "unknown",
        amount: (data.amount || 0) * 100, // Convert dollars to cents
        metadata: data,
      };
    } catch (error) {
      console.error("ProfitStars get payment status error:", error);
      throw error;
    }
  }

  verifyWebhook(payload: string, signature: string): boolean {
    // ProfitStars webhook verification
    try {
      // TODO: Implement proper ProfitStars webhook signature verification
      return true; // Placeholder
    } catch (error) {
      console.error("ProfitStars webhook verification error:", error);
      return false;
    }
  }
}
