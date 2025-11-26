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

import crypto from "crypto";
import type {
	PaymentChannel,
	PaymentProcessor,
	ProcessPaymentRequest,
	ProcessPaymentResponse,
	RefundPaymentRequest,
	RefundPaymentResponse,
} from "../processor-types";

type ProfitStarsConfig = {
	companyId: string;
	merchantId: string;
	apiKey: string;
	routingNumber: string;
	webhookSecret?: string; // Secret key for webhook HMAC verification
};

export class ProfitStarsProcessor implements PaymentProcessor {
	private readonly config: ProfitStarsConfig;
	private readonly apiUrl = "https://api.profitstars.com"; // Update with actual API URL

	constructor(config: ProfitStarsConfig) {
		this.config = config;
	}

	getSupportedChannels(): PaymentChannel[] {
		return ["ach", "check"];
	}

	async processPayment(
		request: ProcessPaymentRequest,
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
			return {
				success: false,
				status: "failed",
				error:
					error instanceof Error ? error.message : "Payment processing failed",
			};
		}
	}

	async refundPayment(
		request: RefundPaymentRequest,
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
		const response = await fetch(
			`${this.apiUrl}/v1/payments/${transactionId}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${this.config.apiKey}`,
					"X-Merchant-ID": this.config.merchantId,
				},
			},
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
	}

	/**
	 * Verify ProfitStars/Jack Henry webhook signature using HMAC SHA256
	 *
	 * ProfitStars typically signs webhooks using HMAC SHA256 with a shared secret.
	 * The signature is sent in the X-Signature header.
	 *
	 * @param payload - The raw webhook body
	 * @param signature - The X-Signature header value
	 * @returns true if signature is valid
	 */
	verifyWebhook(payload: string, signature: string): boolean {
		if (!this.config.webhookSecret) {
			console.warn(
				"[ProfitStars] No webhook secret configured - skipping verification",
			);
			return false;
		}

		if (!signature) {
			console.error("[ProfitStars] No webhook signature provided");
			return false;
		}

		try {
			// Calculate expected HMAC SHA256 signature
			const expectedSignature = crypto
				.createHmac("sha256", this.config.webhookSecret)
				.update(payload, "utf8")
				.digest("hex");

			// Compare signatures using timing-safe comparison
			// Signature may be prefixed with "sha256=" depending on their format
			const receivedSignature = signature.startsWith("sha256=")
				? signature.slice(7)
				: signature;

			// Ensure both signatures are same length for timing-safe comparison
			const expectedBuffer = Buffer.from(expectedSignature, "hex");
			const receivedBuffer = Buffer.from(receivedSignature, "hex");

			if (expectedBuffer.length !== receivedBuffer.length) {
				console.error("[ProfitStars] Webhook signature length mismatch");
				return false;
			}

			const isValid = crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

			if (!isValid) {
				console.error("[ProfitStars] Webhook signature verification failed");
				return false;
			}

			// Optionally verify timestamp to prevent replay attacks
			try {
				const webhookData = JSON.parse(payload);
				if (webhookData.timestamp) {
					const webhookTime = new Date(webhookData.timestamp).getTime();
					const now = Date.now();
					// Reject webhooks older than 5 minutes
					if (Math.abs(now - webhookTime) > 300000) {
						console.error("[ProfitStars] Webhook timestamp too old");
						return false;
					}
				}
			} catch {
				// If no timestamp, skip this check
			}

			return true;
		} catch (error) {
			console.error("[ProfitStars] Webhook verification error:", error);
			return false;
		}
	}
}
