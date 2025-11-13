/**
 * Payment Processor Types
 *
 * Shared type definitions for payment processor abstraction.
 * Extracted to prevent circular dependencies.
 */

export type PaymentProcessorType =
  | "stripe"
  | "adyen"
  | "plaid"
  | "profitstars"
  | "manual";

export type PaymentChannel =
  | "online"
  | "card_present"
  | "tap_to_pay"
  | "ach"
  | "wire"
  | "check";

export interface PaymentProcessorConfig {
  companyId: string;
  processorType: PaymentProcessorType;
  liveMode?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ProcessPaymentRequest {
  amount: number; // In cents
  currency?: string;
  invoiceId?: string;
  customerId: string;
  paymentMethodId?: string;
  channel: PaymentChannel;
  metadata?: Record<string, unknown>;
  description?: string;
}

export interface ProcessPaymentResponse {
  success: boolean;
  transactionId?: string;
  processorTransactionId?: string;
  status: "pending" | "processing" | "succeeded" | "failed" | "requires_action";
  clientSecret?: string; // For 3D Secure or additional authentication
  error?: string;
  failureCode?: string;
  failureMessage?: string;
  processorMetadata?: Record<string, unknown>;
}

export interface RefundPaymentRequest {
  transactionId: string;
  amount?: number; // Partial refund if specified
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface RefundPaymentResponse {
  success: boolean;
  refundId?: string;
  processorRefundId?: string;
  status: "pending" | "processing" | "succeeded" | "failed";
  error?: string;
}

export interface PaymentProcessor {
  /**
   * Process a payment
   */
  processPayment(
    request: ProcessPaymentRequest
  ): Promise<ProcessPaymentResponse>;

  /**
   * Refund a payment
   */
  refundPayment(request: RefundPaymentRequest): Promise<RefundPaymentResponse>;

  /**
   * Get payment status
   */
  getPaymentStatus(transactionId: string): Promise<{
    status: string;
    amount: number;
    metadata?: Record<string, unknown>;
  }>;

  /**
   * Verify webhook signature
   */
  verifyWebhook(payload: string, signature: string): boolean;

  /**
   * Get supported payment channels
   */
  getSupportedChannels(): PaymentChannel[];
}
