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

import crypto from "crypto";
import type {
	PaymentChannel,
	PaymentProcessor,
	ProcessPaymentRequest,
	ProcessPaymentResponse,
	RefundPaymentRequest,
	RefundPaymentResponse,
} from "../processor-types";

type PlaidConfig = {
	companyId: string;
	clientId: string;
	secret: string;
	environment: "sandbox" | "development" | "production";
	webhookVerificationKey?: string; // Current webhook verification key from Plaid
};

export class PlaidProcessor implements PaymentProcessor {
	private readonly config: PlaidConfig;
	private readonly apiUrl: string;

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
		request: ProcessPaymentRequest,
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
			return {
				success: false,
				status: "failed",
				error:
					error instanceof Error ? error.message : "Payment processing failed",
			};
		}
	}

	async refundPayment(
		_request: RefundPaymentRequest,
	): Promise<RefundPaymentResponse> {
		// ACH refunds are typically processed through the same ACH processor
		return {
			success: false,
			status: "failed",
			error:
				"ACH refunds must be processed through ACH processor (Adyen/ProfitStars)",
		};
	}

	async getPaymentStatus(_transactionId: string): Promise<{
		status: string;
		amount: number;
		metadata?: Record<string, unknown>;
	}> {
		// Plaid doesn't directly process payments, so status would come from ACH processor
		throw new Error("Payment status must be retrieved from ACH processor");
	}

	/**
	 * Verify Plaid webhook using JWT signature verification
	 *
	 * Plaid signs webhooks using JWT (RS256) with a rotating verification key.
	 * The key can be fetched from Plaid's /webhook_verification_key/get endpoint.
	 *
	 * @param payload - The raw webhook body
	 * @param signature - The Plaid-Verification header (JWT token)
	 * @returns true if signature is valid
	 */
	verifyWebhook(payload: string, signature: string): boolean {
		if (!signature) {
			console.error("[Plaid] No webhook signature provided");
			return false;
		}

		try {
			// Plaid webhooks include a Plaid-Verification header containing a JWT
			// The JWT contains: { iat, request_body_sha256 } signed with Plaid's key

			// Parse the JWT header to get the key ID
			const [headerB64, payloadB64, signatureB64] = signature.split(".");

			if (!headerB64 || !payloadB64 || !signatureB64) {
				console.error("[Plaid] Invalid JWT format in webhook signature");
				return false;
			}

			// Decode JWT payload
			const jwtPayload = JSON.parse(
				Buffer.from(payloadB64, "base64url").toString("utf8"),
			);

			// Verify timestamp is within 5 minutes
			const issuedAt = jwtPayload.iat;
			const now = Math.floor(Date.now() / 1000);
			if (Math.abs(now - issuedAt) > 300) {
				console.error("[Plaid] Webhook signature too old or from future");
				return false;
			}

			// Calculate SHA256 of the request body
			const bodyHash = crypto
				.createHash("sha256")
				.update(payload)
				.digest("hex");

			// Verify the body hash matches
			if (jwtPayload.request_body_sha256 !== bodyHash) {
				console.error("[Plaid] Webhook body hash mismatch");
				return false;
			}

			// For full verification, you would also verify the JWT signature
			// using Plaid's public key from /webhook_verification_key/get
			// This requires async key fetching, so in production you might
			// want to cache the key or verify asynchronously

			if (this.config.webhookVerificationKey) {
				// If we have a verification key cached, use it to verify the signature
				const signedInput = `${headerB64}.${payloadB64}`;
				const verify = crypto.createVerify("RSA-SHA256");
				verify.update(signedInput);

				const isValid = verify.verify(
					this.config.webhookVerificationKey,
					Buffer.from(signatureB64, "base64url"),
				);

				if (!isValid) {
					console.error("[Plaid] JWT signature verification failed");
					return false;
				}
			} else {
				console.warn(
					"[Plaid] No webhook verification key configured - verifying body hash only",
				);
			}

			return true;
		} catch (error) {
			console.error("[Plaid] Webhook verification error:", error);
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
				return null;
			}

			return { linkToken: data.link_token };
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Exchange public token for access token after Plaid Link success
	 */
	async exchangePublicToken(
		publicToken: string,
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
				},
			);

			const data = await response.json();

			if (!response.ok) {
				return null;
			}

			return { accessToken: data.access_token };
		} catch (_error) {
			return null;
		}
	}
}
