/**
 * Stripe Billing & Usage Client
 *
 * Fetches transaction data and calculates processing fees from Stripe
 * Docs: https://stripe.com/docs/api
 *
 * Stripe fees are percentage-based:
 * - 2.9% + $0.30 per successful card charge (US)
 * - 0.5% additional for international cards
 * - 1% additional for currency conversion
 */

export interface StripeUsage {
	total_transactions: number;
	total_volume_cents: number;
	total_fees_cents: number;
	successful_charges: number;
	failed_charges: number;
	refunds_count: number;
	refunds_amount_cents: number;
	disputes_count: number;
}

export interface StripeMonthlyStats {
	gross_volume_cents: number;
	net_volume_cents: number;
	fees_cents: number;
	refunds_cents: number;
	transaction_count: number;
	average_transaction_cents: number;
}

interface StripeBalanceTransaction {
	id: string;
	amount: number;
	fee: number;
	net: number;
	type: string;
	created: number;
	status: string;
}

interface StripeListResponse<T> {
	object: "list";
	data: T[];
	has_more: boolean;
	url: string;
}

/**
 * Stripe Billing Client
 * Requires STRIPE_SECRET_KEY environment variable
 */
export class StripeBillingClient {
	private baseUrl = "https://api.stripe.com/v1";
	private secretKey: string;

	constructor() {
		const secretKey = process.env.STRIPE_SECRET_KEY;

		if (!secretKey) {
			console.warn(
				"STRIPE_SECRET_KEY not set - Stripe billing tracking disabled",
			);
		}

		this.secretKey = secretKey || "";
	}

	private async fetch<T>(
		endpoint: string,
		params?: Record<string, string>,
	): Promise<T | null> {
		if (!this.secretKey) {
			return null;
		}

		const url = new URL(`${this.baseUrl}${endpoint}`);
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				url.searchParams.append(key, value);
			});
		}

		try {
			const response = await fetch(url.toString(), {
				headers: {
					Authorization: `Bearer ${this.secretKey}`,
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});

			if (!response.ok) {
				console.error(
					`Stripe API error: ${response.status} ${response.statusText}`,
				);
				return null;
			}

			return (await response.json()) as T;
		} catch (error) {
			console.error("Stripe API fetch error:", error);
			return null;
		}
	}

	/**
	 * Get the current month's date range as Unix timestamps
	 */
	private getCurrentMonthRange(): {
		startTimestamp: number;
		endTimestamp: number;
	} {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const endOfMonth = new Date(
			now.getFullYear(),
			now.getMonth() + 1,
			0,
			23,
			59,
			59,
		);

		return {
			startTimestamp: Math.floor(startOfMonth.getTime() / 1000),
			endTimestamp: Math.floor(endOfMonth.getTime() / 1000),
		};
	}

	/**
	 * Get balance transactions for the current month
	 * This includes all fees, charges, refunds, etc.
	 */
	async getBalanceTransactions(
		limit = 100,
	): Promise<StripeBalanceTransaction[] | null> {
		const { startTimestamp, endTimestamp } = this.getCurrentMonthRange();

		const response = await this.fetch<
			StripeListResponse<StripeBalanceTransaction>
		>("/balance_transactions", {
			limit: limit.toString(),
			"created[gte]": startTimestamp.toString(),
			"created[lte]": endTimestamp.toString(),
		});

		return response?.data || null;
	}

	/**
	 * Get monthly statistics including fees
	 */
	async getCurrentMonthStats(): Promise<StripeMonthlyStats | null> {
		const transactions = await this.getBalanceTransactions(100);

		if (!transactions) {
			return null;
		}

		let grossVolume = 0;
		let netVolume = 0;
		let totalFees = 0;
		let refundsAmount = 0;
		let chargeCount = 0;

		for (const txn of transactions) {
			switch (txn.type) {
				case "charge":
					grossVolume += txn.amount;
					netVolume += txn.net;
					totalFees += txn.fee;
					chargeCount++;
					break;
				case "refund":
					refundsAmount += Math.abs(txn.amount);
					netVolume += txn.net; // Negative for refunds
					break;
				case "payout":
					// Don't count payouts in volume
					break;
				default:
					// Other transaction types (adjustments, etc.)
					netVolume += txn.net;
					totalFees += txn.fee;
			}
		}

		return {
			gross_volume_cents: grossVolume,
			net_volume_cents: netVolume,
			fees_cents: totalFees,
			refunds_cents: refundsAmount,
			transaction_count: chargeCount,
			average_transaction_cents:
				chargeCount > 0 ? Math.round(grossVolume / chargeCount) : 0,
		};
	}

	/**
	 * Get detailed usage statistics
	 */
	async getUsage(): Promise<StripeUsage | null> {
		const { startTimestamp, endTimestamp } = this.getCurrentMonthRange();

		// Fetch charges for the month
		const chargesResponse = await this.fetch<
			StripeListResponse<{
				id: string;
				amount: number;
				status: string;
				refunded: boolean;
				amount_refunded: number;
			}>
		>("/charges", {
			limit: "100",
			"created[gte]": startTimestamp.toString(),
			"created[lte]": endTimestamp.toString(),
		});

		// Fetch disputes for the month
		const disputesResponse = await this.fetch<
			StripeListResponse<{
				id: string;
				amount: number;
				status: string;
			}>
		>("/disputes", {
			limit: "100",
			"created[gte]": startTimestamp.toString(),
			"created[lte]": endTimestamp.toString(),
		});

		if (!chargesResponse?.data) {
			return null;
		}

		const charges = chargesResponse.data;
		const disputes = disputesResponse?.data || [];

		let totalVolume = 0;
		let successfulCharges = 0;
		let failedCharges = 0;
		let refundsCount = 0;
		let refundsAmount = 0;

		for (const charge of charges) {
			if (charge.status === "succeeded") {
				successfulCharges++;
				totalVolume += charge.amount;
			} else if (charge.status === "failed") {
				failedCharges++;
			}

			if (charge.refunded || charge.amount_refunded > 0) {
				refundsCount++;
				refundsAmount += charge.amount_refunded;
			}
		}

		// Calculate estimated fees (2.9% + $0.30 per transaction)
		const estimatedFees = Math.round(
			totalVolume * 0.029 + successfulCharges * 30,
		);

		return {
			total_transactions: charges.length,
			total_volume_cents: totalVolume,
			total_fees_cents: estimatedFees,
			successful_charges: successfulCharges,
			failed_charges: failedCharges,
			refunds_count: refundsCount,
			refunds_amount_cents: refundsAmount,
			disputes_count: disputes.length,
		};
	}

	/**
	 * Get current Stripe balance
	 */
	async getBalance(): Promise<{
		available_cents: number;
		pending_cents: number;
		currency: string;
	} | null> {
		const response = await this.fetch<{
			available: Array<{ amount: number; currency: string }>;
			pending: Array<{ amount: number; currency: string }>;
		}>("/balance");

		if (!response) {
			return null;
		}

		// Get USD balance (or first available currency)
		const availableUsd =
			response.available.find((b) => b.currency === "usd") ||
			response.available[0];
		const pendingUsd =
			response.pending.find((b) => b.currency === "usd") || response.pending[0];

		return {
			available_cents: availableUsd?.amount || 0,
			pending_cents: pendingUsd?.amount || 0,
			currency: availableUsd?.currency || "usd",
		};
	}

	/**
	 * Calculate Stripe fee for a given amount
	 * Standard US pricing: 2.9% + $0.30
	 */
	static calculateFee(
		amountCents: number,
		options: {
			isInternational?: boolean;
			hasCurrencyConversion?: boolean;
		} = {},
	): number {
		let percentage = 0.029; // 2.9% base

		if (options.isInternational) {
			percentage += 0.005; // +0.5% for international
		}

		if (options.hasCurrencyConversion) {
			percentage += 0.01; // +1% for currency conversion
		}

		const percentageFee = Math.round(amountCents * percentage);
		const flatFee = 30; // $0.30

		return percentageFee + flatFee;
	}

	/**
	 * Calculate net amount after Stripe fees
	 */
	static calculateNetAmount(
		amountCents: number,
		options: {
			isInternational?: boolean;
			hasCurrencyConversion?: boolean;
		} = {},
	): number {
		const fee = StripeBillingClient.calculateFee(amountCents, options);
		return amountCents - fee;
	}

	/**
	 * Check if the Stripe API is healthy
	 */
	async checkHealth(): Promise<{
		healthy: boolean;
		responseTimeMs: number;
		error?: string;
	}> {
		const startTime = Date.now();

		try {
			const response = await fetch(`${this.baseUrl}/balance`, {
				headers: {
					Authorization: `Bearer ${this.secretKey}`,
				},
			});

			const responseTimeMs = Date.now() - startTime;

			if (response.ok) {
				return { healthy: true, responseTimeMs };
			}

			return {
				healthy: false,
				responseTimeMs,
				error: `HTTP ${response.status}: ${response.statusText}`,
			};
		} catch (error) {
			return {
				healthy: false,
				responseTimeMs: Date.now() - startTime,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}
}

// Export singleton instance
export const stripeBillingClient = new StripeBillingClient();
