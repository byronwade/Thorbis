/**
 * Property Data Service
 *
 * Fetches property information from free public data sources:
 * - Attom Property API (free tier: 100 requests/month)
 * - FCC Census API (already in use, provides demographics)
 * - County tax assessor data (varies by county)
 *
 * Note: Zillow's Zestimate API was discontinued in 2021.
 * Alternatives require paid subscriptions (Zillow API, Realtor.com, etc.)
 */

import { z } from "zod";

const _USER_AGENT = "ThorbisFieldService/1.0";

// ============================================================================
// Types and Schemas
// ============================================================================

export const PropertyDataSchema = z.object({
	// Basic property info
	address: z.object({
		full: z.string(),
		street: z.string(),
		city: z.string(),
		state: z.string(),
		zipCode: z.string(),
	}),

	// Property characteristics
	characteristics: z
		.object({
			propertyType: z.string().optional(), // Residential, Commercial, etc.
			yearBuilt: z.number().optional(),
			squareFeet: z.number().optional(),
			lotSize: z.number().optional(),
			bedrooms: z.number().optional(),
			bathrooms: z.number().optional(),
			stories: z.number().optional(),
			garage: z.boolean().optional(),
			pool: z.boolean().optional(),
		})
		.optional(),

	// Tax assessment data
	assessment: z
		.object({
			assessedValue: z.number().optional(),
			taxAmount: z.number().optional(),
			assessmentYear: z.number().optional(),
		})
		.optional(),

	// Market estimates (if available)
	market: z
		.object({
			estimatedValue: z.number().optional(),
			estimatedValueRange: z
				.object({
					low: z.number(),
					high: z.number(),
				})
				.optional(),
			pricePerSqFt: z.number().optional(),
			lastSoldDate: z.string().optional(),
			lastSoldPrice: z.number().optional(),
		})
		.optional(),

	// Demographics (from Census)
	demographics: z
		.object({
			medianHouseholdIncome: z.number().optional(),
			medianHomeValue: z.number().optional(),
			population: z.number().optional(),
		})
		.optional(),

	// Metadata
	dataSource: z.string(),
	enrichedAt: z.string(),
});

export type PropertyData = z.infer<typeof PropertyDataSchema>;

// ============================================================================
// Property Data Service
// ============================================================================

export class PropertyDataService {
	private readonly rentcastApiKey: string | undefined;
	private readonly attomApiKey: string | undefined; // Optional fallback
	private readonly cache: Map<string, { data: PropertyData; timestamp: number }> = new Map();
	private readonly cacheTTL = 1000 * 60 * 60 * 24 * 30; // 30 days (property data doesn't change often)

	constructor() {
		this.rentcastApiKey = process.env.RENTCAST_API_KEY;
		this.attomApiKey = process.env.ATTOM_API_KEY; // Optional
	}

	/**
	 * Get comprehensive property data
	 */
	async getPropertyData(
		address: string,
		city: string,
		state: string,
		zipCode: string,
		_lat?: number,
		_lon?: number
	): Promise<PropertyData | null> {
		const cacheKey = `${address}-${city}-${state}-${zipCode}`;
		const cached = this.cache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		try {
			const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;

			// Try RentCast first (free tier: 50/month)
			let propertyData = await this.getRentCastData(address, city, state, zipCode);

			// Fallback to Attom if available
			if (!propertyData && this.attomApiKey) {
				propertyData = await this.getAttomData(address, city, state, zipCode);
			}

			// Final fallback to basic data
			if (!propertyData) {
				propertyData = {
					address: {
						full: fullAddress,
						street: address,
						city,
						state,
						zipCode,
					},
					dataSource: "none",
					enrichedAt: new Date().toISOString(),
				};
			}

			// Cache the result
			this.cache.set(cacheKey, {
				data: propertyData,
				timestamp: Date.now(),
			});

			return propertyData;
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Get property data from RentCast API (formerly Realty Mole)
	 * Free tier: 50 requests/month (FOREVER - no trial)
	 * Paid: $99/month for 1,000 requests
	 * https://rentcast.io/api
	 */
	private async getRentCastData(
		address: string,
		city: string,
		state: string,
		zipCode: string
	): Promise<PropertyData | null> {
		if (!this.rentcastApiKey) {
			return null;
		}

		try {
			// RentCast Property Records API
			const url = `https://api.rentcast.io/v1/properties?address=${encodeURIComponent(address)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&zipCode=${encodeURIComponent(zipCode)}`;

			const res = await fetch(url, {
				headers: {
					"X-Api-Key": this.rentcastApiKey,
					Accept: "application/json",
				},
			});

			if (!res.ok) {
				return null;
			}

			const data = await res.json();

			if (!data?.id) {
				return null;
			}

			// Parse RentCast response
			return {
				address: {
					full: `${address}, ${city}, ${state} ${zipCode}`,
					street: address,
					city,
					state,
					zipCode,
				},
				characteristics: {
					propertyType: data.propertyType,
					yearBuilt: data.yearBuilt,
					squareFeet: data.squareFootage,
					lotSize: data.lotSize,
					bedrooms: data.bedrooms,
					bathrooms: data.bathrooms,
					stories: data.stories,
					garage: data.garage ? true : undefined,
					pool: data.pool ? true : undefined,
				},
				assessment: data.assessedValue
					? {
							assessedValue: data.assessedValue,
							taxAmount: data.propertyTaxes,
							assessmentYear: data.assessedYear,
						}
					: undefined,
				market: {
					estimatedValue: data.price || data.addressedValue,
					lastSoldDate: data.lastSaleDate,
					lastSoldPrice: data.lastSalePrice,
					pricePerSqFt:
						data.price && data.squareFootage
							? Math.round(data.price / data.squareFootage)
							: undefined,
				},
				dataSource: "rentcast",
				enrichedAt: new Date().toISOString(),
			};
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Get property data from Attom Data API (OPTIONAL FALLBACK)
	 * Free tier: 30 days trial only
	 * Paid: $500+/month
	 * https://api.developer.attomdata.com/
	 */
	private async getAttomData(
		address: string,
		city: string,
		state: string,
		zipCode: string
	): Promise<PropertyData | null> {
		if (!this.attomApiKey) {
			return null;
		}

		try {
			// Attom Property API - Basic Profile
			const url = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/basicprofile?address1=${encodeURIComponent(address)}&address2=${encodeURIComponent(`${city}, ${state} ${zipCode}`)}`;

			const res = await fetch(url, {
				headers: {
					apikey: this.attomApiKey,
					Accept: "application/json",
				},
			});

			if (!res.ok) {
				return null;
			}

			const data = await res.json();
			const property = data.property?.[0];

			if (!property) {
				return null;
			}

			// Parse Attom response
			const building = property.building;
			const summary = property.summary;
			const assessment = property.assessment;
			const sale = property.sale;

			return {
				address: {
					full: `${address}, ${city}, ${state} ${zipCode}`,
					street: address,
					city,
					state,
					zipCode,
				},
				characteristics: {
					propertyType: building?.propertyType || summary?.proptype,
					yearBuilt: building?.yearBuilt ? Number.parseInt(building.yearBuilt, 10) : undefined,
					squareFeet: building?.size?.livingSize
						? Number.parseInt(building.size.livingSize, 10)
						: undefined,
					lotSize: summary?.lotSize ? Number.parseInt(summary.lotSize, 10) : undefined,
					bedrooms: building?.rooms?.beds ? Number.parseInt(building.rooms.beds, 10) : undefined,
					bathrooms: building?.rooms?.bathstotal
						? Number.parseInt(building.rooms.bathstotal, 10)
						: undefined,
					stories: building?.stories ? Number.parseInt(building.stories, 10) : undefined,
					garage: building?.parking?.garagetype ? true : undefined,
					pool: building?.pool ? true : undefined,
				},
				assessment: assessment
					? {
							assessedValue: assessment.assessed?.assdTtlValue
								? Number.parseInt(assessment.assessed.assdTtlValue, 10)
								: undefined,
							taxAmount: assessment.tax?.taxAmt
								? Number.parseInt(assessment.tax.taxAmt, 10)
								: undefined,
							assessmentYear: assessment.assessed?.assdYear
								? Number.parseInt(assessment.assessed.assdYear, 10)
								: undefined,
						}
					: undefined,
				market: sale
					? {
							lastSoldDate: sale.saleTransDate,
							lastSoldPrice: sale.amount?.saleAmt
								? Number.parseInt(sale.amount.saleAmt, 10)
								: undefined,
						}
					: undefined,
				dataSource: "attom",
				enrichedAt: new Date().toISOString(),
			};
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Calculate estimated property characteristics based on available data
	 */
	estimateCharacteristics(propertyData: PropertyData): {
		ageYears?: number;
		propertyCondition?: "new" | "good" | "average" | "fair" | "poor";
		recommendMaintenance?: string[];
	} {
		const result: {
			ageYears?: number;
			propertyCondition?: "new" | "good" | "average" | "fair" | "poor";
			recommendMaintenance?: string[];
		} = {};

		if (propertyData.characteristics?.yearBuilt) {
			const currentYear = new Date().getFullYear();
			result.ageYears = currentYear - propertyData.characteristics.yearBuilt;

			// Estimate condition based on age
			if (result.ageYears < 5) {
				result.propertyCondition = "new";
			} else if (result.ageYears < 15) {
				result.propertyCondition = "good";
			} else if (result.ageYears < 30) {
				result.propertyCondition = "average";
			} else if (result.ageYears < 50) {
				result.propertyCondition = "fair";
			} else {
				result.propertyCondition = "poor";
			}

			// Maintenance recommendations based on age
			const maintenance: string[] = [];

			if (result.ageYears > 15) {
				maintenance.push("Water heater likely needs replacement (15-20 year lifespan)");
			}
			if (result.ageYears > 20) {
				maintenance.push("HVAC system may need replacement (15-25 year lifespan)");
			}
			if (result.ageYears > 25) {
				maintenance.push("Plumbing systems should be inspected for corrosion");
			}
			if (result.ageYears > 30) {
				maintenance.push("Electrical panel upgrade may be needed");
			}

			result.recommendMaintenance = maintenance;
		}

		return result;
	}
}

// Singleton instance
export const propertyDataService = new PropertyDataService();
