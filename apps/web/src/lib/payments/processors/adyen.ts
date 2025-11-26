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

import crypto from "crypto";
import type {
	PaymentChannel,
	PaymentProcessor,
	ProcessPaymentRequest,
	ProcessPaymentResponse,
	RefundPaymentRequest,
	RefundPaymentResponse,
} from "../processor-types";

type AdyenConfig = {
	companyId: string;
	accountId: string;
	apiKey: string;
	merchantAccount: string;
	liveMode: boolean;
	webhookHmacKey?: string; // HMAC key for webhook signature verification
};

export class AdyenProcessor implements PaymentProcessor {
	private readonly config: AdyenConfig;
	private readonly apiUrl: string;

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
		request: ProcessPaymentRequest,
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
				},
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
			`${this.apiUrl}/v68/payments/${transactionId}`,
			{
				method: "GET",
				headers: {
					"X-API-Key": this.config.apiKey,
				},
			},
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
	}

	/**
	 * Verify Adyen webhook signature using HMAC SHA256
	 *
	 * Adyen signs webhooks using HMAC SHA256 with a key from the Customer Area.
	 * The signature is sent in the "HmacSignature" field of the notification.
	 *
	 * @param payload - The raw webhook payload
	 * @param signature - The HMAC signature from the webhook header
	 * @returns true if signature is valid
	 */
	verifyWebhook(payload: string, signature: string): boolean {
		if (!this.config.webhookHmacKey) {
			console.warn(
				"[Adyen] No webhook HMAC key configured - skipping verification",
			);
			return false;
		}

		try {
			// Parse the notification to get the fields for HMAC calculation
			const notification = JSON.parse(payload);
			const notificationItems = notification.notificationItems || [];

			if (notificationItems.length === 0) {
				console.error("[Adyen] No notification items in webhook");
				return false;
			}

			// For each notification item, verify the HMAC
			for (const item of notificationItems) {
				const notificationRequestItem = item.NotificationRequestItem;

				// Build the HMAC data string in Adyen's specific format
				// Format: pspReference:originalReference:merchantAccountCode:merchantReference:amount.value:amount.currency:eventCode:success
				const hmacData = [
					notificationRequestItem.pspReference || "",
					notificationRequestItem.originalReference || "",
					notificationRequestItem.merchantAccountCode || "",
					notificationRequestItem.merchantReference || "",
					notificationRequestItem.amount?.value?.toString() || "",
					notificationRequestItem.amount?.currency || "",
					notificationRequestItem.eventCode || "",
					notificationRequestItem.success || "",
				].join(":");

				// Calculate HMAC SHA256
				const hmacKey = Buffer.from(this.config.webhookHmacKey, "hex");
				const calculatedHmac = crypto
					.createHmac("sha256", hmacKey)
					.update(hmacData, "utf8")
					.digest("base64");

				// Get the provided HMAC from the notification
				const providedHmac =
					notificationRequestItem.additionalData?.hmacSignature || signature;

				// Compare using timing-safe comparison to prevent timing attacks
				if (
					!providedHmac ||
					!crypto.timingSafeEqual(
						Buffer.from(calculatedHmac),
						Buffer.from(providedHmac),
					)
				) {
					console.error("[Adyen] HMAC signature verification failed");
					return false;
				}
			}

			return true;
		} catch (error) {
			console.error("[Adyen] Webhook verification error:", error);
			return false;
		}
	}
}
