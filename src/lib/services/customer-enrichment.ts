/**
 * Customer Data Enrichment Orchestrator
 *
 * Main service that coordinates all enrichment providers:
 * - Person enrichment (Hunter)
 * - Business enrichment (Google Places, OpenCorporates)
 * - Social enrichment (LinkedIn, Twitter, Facebook)
 * - Property enrichment (Attom, CoreLogic)
 *
 * Features:
 * - Orchestrates multiple enrichment sources
 * - Manages caching and TTL
 * - Handles errors and fallbacks
 * - Tracks usage for billing tiers
 */

import { z } from "zod";
import { businessEnrichmentService } from "./business-enrichment";
import { personEnrichmentService } from "./person-enrichment";
import { propertyEnrichmentService } from "./property-enrichment";
import { socialEnrichmentService } from "./social-enrichment";

// ============================================================================
// Types and Schemas
// ============================================================================

export const CustomerEnrichmentSchema = z.object({
	customerId: z.string().uuid(),

	// Person data
	person: z.any().optional(), // PersonEnrichmentSchema

	// Business data
	business: z.any().optional(), // BusinessEnrichmentSchema

	// Social profiles
	social: z.any().optional(), // SocialEnrichmentSchema

	// Property data (if customer has properties)
	properties: z.array(z.any()).optional(), // PropertyEnrichmentSchema[]

	// Metadata
	enrichmentStatus: z.enum(["pending", "in_progress", "completed", "failed"]),
	lastEnrichedAt: z.string().optional(),
	expiresAt: z.string().optional(),
	sources: z.array(z.string()),
	overallConfidence: z.number().min(0).max(100),
});

export type CustomerEnrichment = z.infer<typeof CustomerEnrichmentSchema>;

// ============================================================================
// Customer Enrichment Service
// ============================================================================

export class CustomerEnrichmentService {
	private cacheTTL = 1000 * 60 * 60 * 24 * 7; // 7 days

	/**
	 * Enrich all available customer data
	 */
	async enrichCustomer(customer: {
		id: string;
		email: string;
		firstName?: string;
		lastName?: string;
		companyName?: string;
		phone?: string;
		address?: string;
		city?: string;
		state?: string;
		zipCode?: string;
	}): Promise<CustomerEnrichment> {
		const sources: string[] = [];
		const enrichmentData: Partial<CustomerEnrichment> = {
			customerId: customer.id,
			enrichmentStatus: "in_progress",
		};

		const fullName = customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : undefined;

		// 1. Person enrichment
		try {
			const personData = await personEnrichmentService.enrichPerson(customer.email);
			if (personData) {
				enrichmentData.person = personData;
				sources.push(personData.source);
			}
		} catch (_error) {
			console.error("Error:", _error);
		}

		// 2. Business enrichment (if company name provided)
		if (customer.companyName) {
			try {
				const businessData = await businessEnrichmentService.enrichBusiness(
					customer.companyName,
					customer.address,
					customer.city,
					customer.state
				);
				if (businessData) {
					enrichmentData.business = businessData;
					sources.push(businessData.source);
				}
			} catch (_error) {
				console.error("Error:", _error);
			}
		}

		// 3. Social enrichment
		try {
			const socialData = await socialEnrichmentService.enrichSocial(customer.email, fullName);
			if (socialData) {
				enrichmentData.social = socialData;
				sources.push("social");
			}
		} catch (_error) {
			console.error("Error:", _error);
		}

		// 4. Property enrichment (if address provided)
		if (customer.address && customer.city && customer.state && customer.zipCode) {
			try {
				const propertyData = await propertyEnrichmentService.enrichProperty(
					customer.address,
					customer.city,
					customer.state,
					customer.zipCode
				);
				if (propertyData) {
					enrichmentData.properties = [propertyData];
					sources.push(propertyData.source);
				}
			} catch (_error) {
				console.error("Error:", _error);
			}
		}

		// Calculate overall confidence score
		const confidenceScores: number[] = [];
		if (enrichmentData.person) {
			confidenceScores.push((enrichmentData.person as any).confidence);
		}
		if (enrichmentData.business) {
			confidenceScores.push((enrichmentData.business as any).confidence);
		}
		if (enrichmentData.social) {
			confidenceScores.push((enrichmentData.social as any).confidence);
		}
		if (enrichmentData.properties?.length) {
			confidenceScores.push((enrichmentData.properties[0] as any).confidence);
		}

		const overallConfidence = confidenceScores.length
			? Math.round(confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length)
			: 0;

		const now = new Date();
		const expiresAt = new Date(now.getTime() + this.cacheTTL);

		return CustomerEnrichmentSchema.parse({
			...enrichmentData,
			enrichmentStatus: sources.length > 0 ? "completed" : "failed",
			lastEnrichedAt: now.toISOString(),
			expiresAt: expiresAt.toISOString(),
			sources,
			overallConfidence,
		});
	}

	/**
	 * Check if enrichment data is still valid (not expired)
	 */
	isEnrichmentValid(enrichment: CustomerEnrichment): boolean {
		if (!enrichment.expiresAt) {
			return false;
		}

		const expiresAt = new Date(enrichment.expiresAt);
		return expiresAt > new Date();
	}

	/**
	 * Get cache TTL in milliseconds
	 */
	getCacheTTL(): number {
		return this.cacheTTL;
	}

	/**
	 * Set custom cache TTL (useful for premium tiers)
	 */
	setCacheTTL(ttlMs: number): void {
		this.cacheTTL = ttlMs;
	}
}

// Singleton instance
export const customerEnrichmentService = new CustomerEnrichmentService();
