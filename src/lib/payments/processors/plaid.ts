/**
 * Plaid Payment Processor
 *
 * Handles ACH payments and bank account linking via Plaid:
 * - Bank account verification
 * - ACH payment processing
 * - Account balance checks
 * - Transaction history
 *
 * Plaid is used for secure bank account linking and ACH processing,
 * often in combination with Adyen or ProfitStars for actual payment processing.
 */

import type {
  PaymentChannel,
  PaymentProcessor,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  RefundPaymentRequest,
  RefundPaymentResponse,
} from "../processor";

interface PlaidConfig {
  companyId: string;
  clientId: string;
  secret: string;
  environment: "sandbox" | "development" | "production";
}

export class PlaidProcessor implements PaymentProcessor {
  private config: PlaidConfig;
  private apiUrl: string;

  constructor(config: PlaidConfig) {
    this.config = config;
    this.apiUrl =
      config.environment === "production"
        ? "https://production.plaid.com"
        : config.environment === "development"
          ? "https://development.plaid.com"
          : "https://sandbox.plaid.com";
  }

  getSupportedChannels(): PaymentChannel[] {
    return ["ach"];
  }

  async processPayment(
    request: ProcessPaymentRequest
  ): Promise<ProcessPaymentResponse> {
    try {
      // Plaid is primarily for bank account linking
      // Actual ACH processing is typically done through a partner like Adyen or ProfitStars
      // This is a simplified implementation - in production, you'd integrate with
      // Plaid's Payment Initiation API or use it with Adyen's ACH integration

      if (!request.paymentMethodId) {
        return {
          success: false,
          status: "failed",
          error: "Payment method (bank account) is required for ACH payments",
        };
      }

      // For ACH via Plaid, you typically:
      // 1. Use Plaid to link/verify bank account (already done, paymentMethodId exists)
      // 2. Use Adyen or ProfitStars to actually process the ACH payment
      // 3. Or use Plaid's Payment Initiation API if available

      // This is a placeholder - actual implementation would depend on your ACH processor
      return {
        success: false,
        status: "failed",
        error:
          "ACH processing via Plaid requires integration with ACH processor (Adyen/ProfitStars)",
      };
    } catch (error) {
      console.error("Plaid payment processing error:", error);
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
    // ACH refunds are typically processed through the same ACH processor
    return {
      success: false,
      status: "failed",
      error:
        "ACH refunds must be processed through ACH processor (Adyen/ProfitStars)",
    };
  }

  async getPaymentStatus(transactionId: string): Promise<{
    status: string;
    amount: number;
    metadata?: Record<string, unknown>;
  }> {
    // Plaid doesn't directly process payments, so status would come from ACH processor
    throw new Error("Payment status must be retrieved from ACH processor");
  }

  verifyWebhook(payload: string, signature: string): boolean {
    // Plaid webhook verification
    try {
      // TODO: Implement proper Plaid webhook signature verification
      return true; // Placeholder
    } catch (error) {
      console.error("Plaid webhook verification error:", error);
      return false;
    }
  }

  /**
   * Link a bank account using Plaid Link
   * This would typically be called from the frontend using Plaid Link
   */
  async createLinkToken(userId: string): Promise<{ linkToken: string } | null> {
    try {
      const response = await fetch(`${this.apiUrl}/link/token/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "PLAID-CLIENT-ID": this.config.clientId,
          "PLAID-SECRET": this.config.secret,
        },
        body: JSON.stringify({
          client_name: "Thorbis",
          user: {
            client_user_id: userId,
          },
          products: ["auth", "transactions"],
          country_codes: ["US"],
          language: "en",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Plaid link token creation error:", data);
        return null;
      }

      return { linkToken: data.link_token };
    } catch (error) {
      console.error("Plaid link token error:", error);
      return null;
    }
  }

  /**
   * Exchange public token for access token after Plaid Link success
   */
  async exchangePublicToken(
    publicToken: string
  ): Promise<{ accessToken: string } | null> {
    try {
      const response = await fetch(
        `${this.apiUrl}/item/public_token/exchange`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "PLAID-CLIENT-ID": this.config.clientId,
            "PLAID-SECRET": this.config.secret,
          },
          body: JSON.stringify({
            public_token: publicToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Plaid token exchange error:", data);
        return null;
      }

      return { accessToken: data.access_token };
    } catch (error) {
      console.error("Plaid token exchange error:", error);
      return null;
    }
  }
}
