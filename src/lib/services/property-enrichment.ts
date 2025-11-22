/**
 * Property Data Enrichment Service
 *
 * Integrates with property data APIs to provide comprehensive property information
 * for contractors. This service enriches job property data with:
 * - Property details (square footage, year built, lot size, etc.)
 * - Ownership information
 * - Tax assessments and valuations
 * - Permit history
 * - Comparable properties
 * - Neighborhood data
 *
 * Supported APIs:
 * - Attom Data Solutions (property data aggregator)
 * - CoreLogic (property information and analytics)
 * - Zillow API (property valuations)
 * - Google Places API (location context)
 * - OpenStreetMap/Mapbox (mapping and geocoding)
 */

import { z } from "zod";

// ============================================================================
// Types and Schemas
// ============================================================================

/**
 * Property enrichment data from external APIs
 */
const PropertyEnrichmentSchema = z.object({
	// Basic property details
	propertyId: z.string(),
	address: z.object({
		street: z.string(),
		city: z.string(),
		state: z.string(),
		zipCode: z.string(),
		county: z.string().optional(),
		latitude: z.number().optional(),
		longitude: z.number().optional(),
	}),

	// Property characteristics
	details: z.object({
		propertyType: z.enum([
			"single_family",
			"multi_family",
			"condo",
			"townhouse",
			"commercial",
			"industrial",
			"land",
			"other",
		]),
		squareFootage: z.number().optional(),
		lotSizeSquareFeet: z.number().optional(),
		yearBuilt: z.number().optional(),
		bedrooms: z.number().optional(),
		bathrooms: z.number().optional(),
		stories: z.number().optional(),
		garageSpaces: z.number().optional(),
		hasPool: z.boolean().optional(),
		hasBasement: z.boolean().optional(),
		roofType: z.string().optional(),
		exteriorWalls: z.string().optional(),
		heatingType: z.string().optional(),
		coolingType: z.string().optional(),
	}),

	// Ownership and valuation
	ownership: z.object({
		ownerName: z.string().optional(),
		ownerOccupied: z.boolean().optional(),
		lastSaleDate: z.string().optional(), // ISO date
		lastSalePrice: z.number().optional(), // in cents
		assessedValue: z.number().optional(), // in cents
		marketValue: z.number().optional(), // in cents
	}),

	// Tax information
	taxes: z.object({
		annualAmount: z.number().optional(), // in cents
		taxYear: z.number().optional(),
		assessedLandValue: z.number().optional(), // in cents
		assessedImprovementValue: z.number().optional(), // in cents
	}),

	// Permit history
	permits: z.array(
		z.object({
			permitNumber: z.string(),
			type: z.string(),
			description: z.string(),
			issuedDate: z.string(), // ISO date
			status: z.enum(["issued", "completed", "expired", "cancelled"]),
			contractor: z.string().optional(),
			value: z.number().optional(), // in cents
		}),
	),

	// Utilities and services
	utilities: z.object({
		electricProvider: z.string().optional(),
		gasProvider: z.string().optional(),
		waterProvider: z.string().optional(),
		sewerType: z.enum(["public", "septic", "unknown"]).optional(),
	}),

	// Risk factors (for insurance and planning)
	riskFactors: z.object({
		floodZone: z.string().optional(),
		earthquakeZone: z.string().optional(),
		fireZone: z.string().optional(),
		hurricaneZone: z.string().optional(),
	}),

	// Metadata
	enrichedAt: z.string(), // ISO timestamp
	source: z.enum(["attom", "corelogic", "zillow", "manual"]),
	confidence: z.number().min(0).max(100), // Data confidence score
});

export type PropertyEnrichment = z.infer<typeof PropertyEnrichmentSchema>;

/**
 * API configuration for property data providers
 */
type PropertyDataProvider = {
	name: string;
	apiKey: string;
	baseUrl: string;
	rateLimit: {
		requestsPerSecond: number;
		requestsPerDay: number;
	};
};

// ============================================================================
// Property Enrichment Service
// ============================================================================

class PropertyEnrichmentService {
	private readonly providers: Map<string, PropertyDataProvider> = new Map();
	private readonly cache: Map<string, PropertyEnrichment> = new Map();
	private readonly cacheTTL = 1000 * 60 * 60 * 24 * 7; // 7 days

	constructor() {
		this.initializeProviders();
	}

	/**
	 * Initialize property data providers from environment variables
	 */
	private initializeProviders(): void {
		// Attom Data Solutions
		if (process.env.ATTOM_API_KEY) {
			this.providers.set("attom", {
				name: "Attom Data Solutions",
				apiKey: process.env.ATTOM_API_KEY,
				baseUrl: "https://api.gateway.attomdata.com/propertyapi/v1.0.0",
				rateLimit: {
					requestsPerSecond: 10,
					requestsPerDay: 10_000,
				},
			});
		}

		// CoreLogic (placeholder - requires enterprise account)
		if (process.env.CORELOGIC_API_KEY) {
			this.providers.set("corelogic", {
				name: "CoreLogic",
				apiKey: process.env.CORELOGIC_API_KEY,
				baseUrl: "https://api.corelogic.com/v1",
				rateLimit: {
					requestsPerSecond: 5,
					requestsPerDay: 5000,
				},
			});
		}

		// Zillow (note: Zillow API is deprecated, but keeping for reference)
		if (process.env.ZILLOW_API_KEY) {
			this.providers.set("zillow", {
				name: "Zillow",
				apiKey: process.env.ZILLOW_API_KEY,
				baseUrl: "https://www.zillow.com/webservice",
				rateLimit: {
					requestsPerSecond: 1,
					requestsPerDay: 1000,
				},
			});
		}
	}

	/**
	 * Enrich property data with external API information
	 */
	async enrichProperty(
		address: string,
		city: string,
		state: string,
		zipCode: string,
	): Promise<PropertyEnrichment | null> {
		const cacheKey = `${address}-${city}-${state}-${zipCode}`.toLowerCase();

		// Check cache first
		const cached = this.cache.get(cacheKey);
		if (cached) {
			const age = Date.now() - new Date(cached.enrichedAt).getTime();
			if (age < this.cacheTTL) {
				return cached;
			}
		}

		// Try each provider in order of preference
		const providers = ["attom", "corelogic", "zillow"];

		for (const providerName of providers) {
			const provider = this.providers.get(providerName);
			if (!provider) {
				continue;
			}

			try {
				const enrichment = await this.fetchFromProvider(
					provider,
					address,
					city,
					state,
					zipCode,
				);

				if (enrichment) {
					// Cache the result
					this.cache.set(cacheKey, enrichment);
					return enrichment;
				}
			} catch (_error) {
				// Continue to next provider
			}
		}

		return null;
	}

	/**
	 * Fetch property data from a specific provider
	 */
	private async fetchFromProvider(
		provider: PropertyDataProvider,
		address: string,
		city: string,
		state: string,
		zipCode: string,
	): Promise<PropertyEnrichment | null> {
		// This is a placeholder implementation
		// In production, you would implement actual API calls to each provider

		if (provider.name === "Attom Data Solutions") {
			return this.fetchFromAttom(provider, address, city, state, zipCode);
		}

		// Add other providers as needed
		return null;
	}

	/**
	 * Fetch from Attom Data Solutions API
	 */
	private async fetchFromAttom(
		provider: PropertyDataProvider,
		address: string,
		city: string,
		state: string,
		zipCode: string,
	): Promise<PropertyEnrichment | null> {
		// Example Attom API call
		// Note: This is a simplified example - actual implementation would be more complex

		const url = `${provider.baseUrl}/property/basicprofile?address1=${encodeURIComponent(address)}&address2=${encodeURIComponent(`${city}, ${state} ${zipCode}`)}`;

		const response = await fetch(url, {
			headers: {
				Accept: "application/json",
				apikey: provider.apiKey,
			},
		});

		if (!response.ok) {
			throw new Error(`Attom API error: ${response.statusText}`);
		}

		const data = await response.json();

		// Transform Attom data to our schema
		// This is a simplified transformation - actual implementation would be more comprehensive
		return PropertyEnrichmentSchema.parse({
			propertyId: data.property?.id || `${address}-${zipCode}`,
			address: {
				street: address,
				city,
				state,
				zipCode,
				county: data.property?.address?.countrySecSubd,
				latitude: data.property?.address?.latitude,
				longitude: data.property?.address?.longitude,
			},
			details: {
				propertyType:
					this.mapPropertyType(data.property?.summary?.proptype) ||
					"single_family",
				squareFootage: data.building?.size?.bldgsize,
				lotSizeSquareFeet: data.lot?.lotsize1,
				yearBuilt: data.building?.summary?.yearbuilt,
				bedrooms: data.building?.rooms?.beds,
				bathrooms: data.building?.rooms?.bathstotal,
				stories: data.building?.summary?.stories,
				hasPool: data.building?.interior?.ftrpool === "Y",
				roofType: data.building?.construction?.roofcover,
				exteriorWalls: data.building?.construction?.walltype,
				heatingType: data.building?.interior?.heating,
				coolingType: data.building?.interior?.cooling,
			},
			ownership: {
				ownerName: data.owner?.owner1?.lastname1,
				lastSaleDate: data.sale?.saleTransDate,
				lastSalePrice: data.sale?.amount?.saleamt
					? data.sale.amount.saleamt * 100
					: undefined,
				assessedValue: data.assessment?.assessed?.assdttlvalue
					? data.assessment.assessed.assdttlvalue * 100
					: undefined,
				marketValue: data.assessment?.market?.mktttlvalue
					? data.assessment.market.mktttlvalue * 100
					: undefined,
			},
			taxes: {
				annualAmount: data.assessment?.tax?.taxamt
					? data.assessment.tax.taxamt * 100
					: undefined,
				taxYear: data.assessment?.tax?.taxyear,
			},
			permits: [], // Permits would require a separate API call
			utilities: {},
			riskFactors: {},
			enrichedAt: new Date().toISOString(),
			source: "attom",
			confidence: 85,
		});
	}

	/**
	 * Map provider-specific property types to our enum
	 */
	private mapPropertyType(
		providerType: string | undefined,
	): PropertyEnrichment["details"]["propertyType"] | undefined {
		if (!providerType) {
			return;
		}

		const typeMap: Record<
			string,
			PropertyEnrichment["details"]["propertyType"]
		> = {
			SFR: "single_family",
			MFR: "multi_family",
			CONDO: "condo",
			TOWNHOUSE: "townhouse",
			COMMERCIAL: "commercial",
			INDUSTRIAL: "industrial",
			LAND: "land",
		};

		return typeMap[providerType.toUpperCase()] || "other";
	}

	/**
	 * Get permit history for a property
	 */
	async getPermitHistory(
		_address: string,
		_city: string,
		_state: string,
		_zipCode: string,
	): Promise<PropertyEnrichment["permits"]> {
		// This would integrate with local permit systems or aggregators
		// Implementation depends on availability of permit data APIs
		return [];
	}

	/**
	 * Clear cache (useful for testing or manual refresh)
	 */
	clearCache(): void {
		this.cache.clear();
	}
}

// ============================================================================
// Singleton instance
// ============================================================================

export const propertyEnrichmentService = new PropertyEnrichmentService();
