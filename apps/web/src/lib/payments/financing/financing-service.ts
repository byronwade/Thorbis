/**
 * Consumer Financing Service
 *
 * Integrates with multiple financing providers for BNPL (Buy Now, Pay Later).
 * Supports Affirm, Klarna, and WiseTack (home services specialty).
 *
 * Flow:
 * 1. Customer selects financing option at checkout
 * 2. We create a financing offer with selected provider
 * 3. Customer completes application (provider handles underwriting)
 * 4. On approval, provider pays contractor instantly
 * 5. Customer repays provider over time
 */

import { createClient } from "@/lib/supabase/server";

export type FinancingProvider = "affirm" | "klarna" | "wisetack";

export type FinancingStatus =
	| "pending"
	| "application_started"
	| "approved"
	| "declined"
	| "expired"
	| "funded"
	| "cancelled"
	| "refunded";

export interface FinancingOffer {
	id: string;
	companyId: string;
	customerId?: string;
	invoiceId?: string;
	jobId?: string;

	// Provider info
	provider: FinancingProvider;
	providerOfferId?: string;
	providerApplicationUrl?: string;

	// Offer details
	amount: number;
	currency: string;
	term?: number; // Months
	apr?: number; // Annual percentage rate
	monthlyPayment?: number;

	// Status
	status: FinancingStatus;
	expiresAt?: string;
	fundedAt?: string;

	// Customer info (for pre-qualification)
	customerEmail?: string;
	customerPhone?: string;
	customerName?: string;

	// Metadata
	createdAt: string;
	updatedAt: string;
	metadata?: Record<string, unknown>;
}

export interface CreateOfferInput {
	companyId: string;
	customerId?: string;
	invoiceId?: string;
	jobId?: string;
	amount: number;
	currency?: string;
	provider: FinancingProvider;
	customerEmail?: string;
	customerPhone?: string;
	customerName?: string;
	returnUrl?: string;
	cancelUrl?: string;
	metadata?: Record<string, unknown>;
}

export interface OfferResult {
	success: boolean;
	offerId?: string;
	applicationUrl?: string;
	expiresAt?: string;
	preQualified?: boolean;
	offers?: FinancingTermOption[];
	error?: string;
}

export interface FinancingTermOption {
	term: number; // Months
	apr: number;
	monthlyPayment: number;
	totalPayment: number;
	financingFee: number;
}

/**
 * Provider-specific configuration
 */
interface ProviderConfig {
	apiKey: string;
	publicKey?: string;
	merchantId?: string;
	environment: "sandbox" | "production";
}

/**
 * Get provider configuration for a company
 */
async function getProviderConfig(
	companyId: string,
	provider: FinancingProvider,
): Promise<ProviderConfig | null> {
	const supabase = await createClient();
	if (!supabase) return null;

	const { data } = await supabase
		.from("company_payment_processors")
		.select("financing_providers")
		.eq("company_id", companyId)
		.single();

	if (!data?.financing_providers?.[provider]) {
		return null;
	}

	return data.financing_providers[provider] as ProviderConfig;
}

/**
 * Check if financing is available for a company
 */
export async function isFinancingEnabled(
	companyId: string,
): Promise<{ enabled: boolean; providers: FinancingProvider[] }> {
	const supabase = await createClient();
	if (!supabase) {
		return { enabled: false, providers: [] };
	}

	const { data } = await supabase
		.from("company_payment_processors")
		.select("financing_providers")
		.eq("company_id", companyId)
		.single();

	if (!data?.financing_providers) {
		return { enabled: false, providers: [] };
	}

	const providers = Object.keys(data.financing_providers).filter(
		(key) => data.financing_providers[key]?.apiKey,
	) as FinancingProvider[];

	return {
		enabled: providers.length > 0,
		providers,
	};
}

/**
 * Get financing term options for an amount
 */
export async function getFinancingOptions(
	companyId: string,
	amount: number,
	provider: FinancingProvider,
): Promise<FinancingTermOption[]> {
	const config = await getProviderConfig(companyId, provider);
	if (!config) {
		return [];
	}

	// In production, this would call the provider's API
	// Each provider has different available terms

	switch (provider) {
		case "affirm":
			return getAffirmOptions(amount);
		case "klarna":
			return getKlarnaOptions(amount);
		case "wisetack":
			return getWiseTackOptions(amount);
		default:
			return [];
	}
}

/**
 * Affirm financing options
 * Note: Actual rates come from Affirm's API based on customer pre-qualification
 */
function getAffirmOptions(amount: number): FinancingTermOption[] {
	const options: FinancingTermOption[] = [];

	// Affirm typically offers 3, 6, 12 month terms
	const terms = [3, 6, 12];
	const baseApr = 15; // Varies by customer creditworthiness

	for (const term of terms) {
		const apr = baseApr;
		const monthlyRate = apr / 100 / 12;
		const monthlyPayment =
			(amount * monthlyRate * (1 + monthlyRate) ** term) /
			((1 + monthlyRate) ** term - 1);
		const totalPayment = monthlyPayment * term;
		const financingFee = totalPayment - amount;

		options.push({
			term,
			apr,
			monthlyPayment: Math.round(monthlyPayment * 100) / 100,
			totalPayment: Math.round(totalPayment * 100) / 100,
			financingFee: Math.round(financingFee * 100) / 100,
		});
	}

	// 0% APR if available (promotional)
	if (amount >= 500) {
		options.unshift({
			term: 3,
			apr: 0,
			monthlyPayment: Math.round((amount / 3) * 100) / 100,
			totalPayment: amount,
			financingFee: 0,
		});
	}

	return options;
}

/**
 * Klarna financing options (Pay in 4, Monthly financing)
 */
function getKlarnaOptions(amount: number): FinancingTermOption[] {
	const options: FinancingTermOption[] = [];

	// Pay in 4 (interest-free)
	if (amount >= 35 && amount <= 1500) {
		options.push({
			term: 1.5, // 6 weeks effectively (bi-weekly payments)
			apr: 0,
			monthlyPayment: Math.round((amount / 4) * 100) / 100,
			totalPayment: amount,
			financingFee: 0,
		});
	}

	// Monthly financing
	if (amount >= 250) {
		const terms = [6, 12, 24, 36];
		const baseApr = 19.99;

		for (const term of terms) {
			if (amount < term * 25) continue; // Min $25/month

			const apr = baseApr;
			const monthlyRate = apr / 100 / 12;
			const monthlyPayment =
				(amount * monthlyRate * (1 + monthlyRate) ** term) /
				((1 + monthlyRate) ** term - 1);
			const totalPayment = monthlyPayment * term;
			const financingFee = totalPayment - amount;

			options.push({
				term,
				apr,
				monthlyPayment: Math.round(monthlyPayment * 100) / 100,
				totalPayment: Math.round(totalPayment * 100) / 100,
				financingFee: Math.round(financingFee * 100) / 100,
			});
		}
	}

	return options;
}

/**
 * WiseTack financing options (home services specialty)
 * WiseTack specializes in larger ticket items (HVAC, plumbing, etc.)
 */
function getWiseTackOptions(amount: number): FinancingTermOption[] {
	const options: FinancingTermOption[] = [];

	// WiseTack supports $500-$25,000+
	if (amount < 500) return [];

	// Same-as-cash options (0% if paid within term)
	const sameasCashTerms = [6, 12];
	for (const term of sameasCashTerms) {
		options.push({
			term,
			apr: 0,
			monthlyPayment: Math.round((amount / term) * 100) / 100,
			totalPayment: amount,
			financingFee: 0,
		});
	}

	// Extended terms
	const terms = [24, 36, 48, 60];
	const baseApr = 8.99; // WiseTack typically has lower rates

	for (const term of terms) {
		const apr = baseApr;
		const monthlyRate = apr / 100 / 12;
		const monthlyPayment =
			(amount * monthlyRate * (1 + monthlyRate) ** term) /
			((1 + monthlyRate) ** term - 1);
		const totalPayment = monthlyPayment * term;
		const financingFee = totalPayment - amount;

		options.push({
			term,
			apr,
			monthlyPayment: Math.round(monthlyPayment * 100) / 100,
			totalPayment: Math.round(totalPayment * 100) / 100,
			financingFee: Math.round(financingFee * 100) / 100,
		});
	}

	return options;
}

/**
 * Create a financing offer
 */
export async function createFinancingOffer(
	input: CreateOfferInput,
): Promise<OfferResult> {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Database unavailable" };
	}

	const config = await getProviderConfig(input.companyId, input.provider);
	if (!config) {
		return {
			success: false,
			error: `${input.provider} is not configured for this company`,
		};
	}

	try {
		// Get financing options
		const options = await getFinancingOptions(
			input.companyId,
			input.amount,
			input.provider,
		);

		// Create offer in database
		const expiresAt = new Date();
		expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration

		const { data: offer, error: insertError } = await supabase
			.from("consumer_financing_offers")
			.insert({
				company_id: input.companyId,
				customer_id: input.customerId,
				invoice_id: input.invoiceId,
				job_id: input.jobId,
				provider: input.provider,
				amount: input.amount,
				currency: input.currency || "USD",
				status: "pending",
				expires_at: expiresAt.toISOString(),
				customer_email: input.customerEmail,
				customer_phone: input.customerPhone,
				customer_name: input.customerName,
				metadata: input.metadata,
			})
			.select("id")
			.single();

		if (insertError || !offer) {
			return {
				success: false,
				error: insertError?.message || "Failed to create offer",
			};
		}

		// In production, call provider API to create checkout session
		// const providerResult = await createProviderCheckout(config, input, offer.id);

		// Mock application URL for now
		const applicationUrl = `https://${input.provider}.com/checkout?offer=${offer.id}`;

		// Update offer with provider reference
		await supabase
			.from("consumer_financing_offers")
			.update({
				provider_application_url: applicationUrl,
				provider_offer_id: `${input.provider}-${offer.id}`,
			})
			.eq("id", offer.id);

		return {
			success: true,
			offerId: offer.id,
			applicationUrl,
			expiresAt: expiresAt.toISOString(),
			offers: options,
		};
	} catch (error) {
		console.error("[Financing] Error creating offer:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Handle financing webhook (approval, decline, funding)
 */
export async function handleFinancingWebhook(
	provider: FinancingProvider,
	event: {
		type: string;
		offerId: string;
		providerOfferId?: string;
		status?: FinancingStatus;
		fundedAmount?: number;
		term?: number;
		apr?: number;
		metadata?: Record<string, unknown>;
	},
): Promise<{ success: boolean; error?: string }> {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Database unavailable" };
	}

	try {
		// Find the offer
		const { data: offer } = await supabase
			.from("consumer_financing_offers")
			.select("*")
			.eq("provider_offer_id", event.providerOfferId)
			.single();

		if (!offer) {
			// Try by our ID
			const { data: offerById } = await supabase
				.from("consumer_financing_offers")
				.select("*")
				.eq("id", event.offerId)
				.single();

			if (!offerById) {
				return { success: false, error: "Offer not found" };
			}
		}

		const offerId = offer?.id || event.offerId;

		// Update based on event type
		switch (event.type) {
			case "application_started":
				await supabase
					.from("consumer_financing_offers")
					.update({ status: "application_started" })
					.eq("id", offerId);
				break;

			case "approved":
				await supabase
					.from("consumer_financing_offers")
					.update({
						status: "approved",
						term: event.term,
						apr: event.apr,
					})
					.eq("id", offerId);
				break;

			case "declined":
				await supabase
					.from("consumer_financing_offers")
					.update({ status: "declined" })
					.eq("id", offerId);
				break;

			case "funded": {
				const fundedAt = new Date().toISOString();
				await supabase
					.from("consumer_financing_offers")
					.update({
						status: "funded",
						funded_at: fundedAt,
					})
					.eq("id", offerId);

				// Create payment record
				if (offer) {
					await supabase.from("payments").insert({
						company_id: offer.company_id,
						customer_id: offer.customer_id,
						invoice_id: offer.invoice_id,
						job_id: offer.job_id,
						amount: event.fundedAmount || offer.amount,
						payment_method: "financing",
						status: "completed",
						processor_id: `${provider}-${event.providerOfferId}`,
						notes: `${provider.charAt(0).toUpperCase() + provider.slice(1)} financing - ${event.term} months`,
						metadata: {
							financing_provider: provider,
							financing_offer_id: offerId,
							term: event.term,
							apr: event.apr,
						},
					});
				}
				break;
			}

			case "cancelled":
				await supabase
					.from("consumer_financing_offers")
					.update({ status: "cancelled" })
					.eq("id", offerId);
				break;

			case "refunded":
				await supabase
					.from("consumer_financing_offers")
					.update({ status: "refunded" })
					.eq("id", offerId);
				break;
		}

		return { success: true };
	} catch (error) {
		console.error("[Financing] Webhook error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Get offer status
 */
async function getFinancingOfferStatus(
	offerId: string,
): Promise<FinancingOffer | null> {
	const supabase = await createClient();
	if (!supabase) return null;

	const { data } = await supabase
		.from("consumer_financing_offers")
		.select("*")
		.eq("id", offerId)
		.single();

	return data as unknown as FinancingOffer;
}

/**
 * Get all offers for a company
 */
async function getCompanyFinancingOffers(
	companyId: string,
	options: {
		status?: FinancingStatus;
		provider?: FinancingProvider;
		limit?: number;
	} = {},
): Promise<FinancingOffer[]> {
	const supabase = await createClient();
	if (!supabase) return [];

	let query = supabase
		.from("consumer_financing_offers")
		.select("*")
		.eq("company_id", companyId)
		.order("created_at", { ascending: false });

	if (options.status) {
		query = query.eq("status", options.status);
	}

	if (options.provider) {
		query = query.eq("provider", options.provider);
	}

	if (options.limit) {
		query = query.limit(options.limit);
	}

	const { data } = await query;
	return (data || []) as unknown as FinancingOffer[];
}

/**
 * Cancel a pending offer
 */
async function cancelFinancingOffer(
	offerId: string,
): Promise<{ success: boolean; error?: string }> {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Database unavailable" };
	}

	const { data: offer } = await supabase
		.from("consumer_financing_offers")
		.select("status")
		.eq("id", offerId)
		.single();

	if (!offer) {
		return { success: false, error: "Offer not found" };
	}

	if (!["pending", "application_started"].includes(offer.status)) {
		return {
			success: false,
			error: `Cannot cancel offer with status: ${offer.status}`,
		};
	}

	const { error } = await supabase
		.from("consumer_financing_offers")
		.update({ status: "cancelled" })
		.eq("id", offerId);

	if (error) {
		return { success: false, error: error.message };
	}

	return { success: true };
}
