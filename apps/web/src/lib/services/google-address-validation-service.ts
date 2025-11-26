/**
 * Google Address Validation Service
 *
 * Validates and standardizes addresses using Google Address Validation API
 * - Address standardization and correction
 * - USPS/postal validation (replaces USPS API - sunset Jan 2026)
 * - Geocoding with high precision
 * - Address component parsing
 * - Delivery point validation
 *
 * API: Google Address Validation API
 * Docs: https://developers.google.com/maps/documentation/address-validation
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

// ============================================================================
// Types and Schemas
// ============================================================================

const AddressComponentSchema = z.object({
	componentName: z.object({
		text: z.string(),
		languageCode: z.string().optional(),
	}),
	componentType: z.string(),
	confirmationLevel: z.enum([
		"CONFIRMATION_LEVEL_UNSPECIFIED",
		"CONFIRMED",
		"UNCONFIRMED_BUT_PLAUSIBLE",
		"UNCONFIRMED_AND_SUSPICIOUS",
	]),
	inferred: z.boolean().optional(),
	spellCorrected: z.boolean().optional(),
	replaced: z.boolean().optional(),
	unexpected: z.boolean().optional(),
});

const PostalAddressSchema = z.object({
	regionCode: z.string(),
	languageCode: z.string().optional(),
	postalCode: z.string().optional(),
	administrativeArea: z.string().optional(), // State
	locality: z.string().optional(), // City
	sublocality: z.string().optional(),
	addressLines: z.array(z.string()),
	recipients: z.array(z.string()).optional(),
	organization: z.string().optional(),
});

const GeocodingResultSchema = z.object({
	location: z.object({
		latitude: z.number(),
		longitude: z.number(),
	}),
	plusCode: z
		.object({
			globalCode: z.string().optional(),
			compoundCode: z.string().optional(),
		})
		.optional(),
	bounds: z
		.object({
			low: z.object({ latitude: z.number(), longitude: z.number() }),
			high: z.object({ latitude: z.number(), longitude: z.number() }),
		})
		.optional(),
	featureSize: z.number().optional(),
	placeId: z.string().optional(),
	placeTypes: z.array(z.string()).optional(),
});

const UspsDataSchema = z.object({
	standardizedAddress: z
		.object({
			firstAddressLine: z.string().optional(),
			secondAddressLine: z.string().optional(),
			city: z.string().optional(),
			state: z.string().optional(),
			zipCode: z.string().optional(),
			zipCodeExtension: z.string().optional(),
		})
		.optional(),
	deliveryPointCode: z.string().optional(),
	deliveryPointCheckDigit: z.string().optional(),
	dpvConfirmation: z.string().optional(),
	dpvFootnote: z.string().optional(),
	dpvCmra: z.string().optional(),
	dpvVacant: z.string().optional(),
	dpvNoStat: z.string().optional(),
	carrierRoute: z.string().optional(),
	carrierRouteIndicator: z.string().optional(),
	ewsNoMatch: z.boolean().optional(),
	postOfficeCity: z.string().optional(),
	postOfficeState: z.string().optional(),
	fipsCountyCode: z.string().optional(),
	county: z.string().optional(),
	elotNumber: z.string().optional(),
	elotFlag: z.string().optional(),
	lacsLinkReturnCode: z.string().optional(),
	lacsLinkIndicator: z.string().optional(),
	poBoxOnlyPostalCode: z.boolean().optional(),
	suitelinkFootnote: z.string().optional(),
	pmbDesignator: z.string().optional(),
	pmbNumber: z.string().optional(),
	addressRecordType: z.string().optional(),
	defaultAddress: z.boolean().optional(),
	errorMessage: z.string().optional(),
	cassProcessed: z.boolean().optional(),
});

const ValidationResultSchema = z.object({
	inputGranularity: z.enum([
		"GRANULARITY_UNSPECIFIED",
		"SUB_PREMISE",
		"PREMISE",
		"PREMISE_PROXIMITY",
		"BLOCK",
		"ROUTE",
		"OTHER",
	]),
	validationGranularity: z.enum([
		"GRANULARITY_UNSPECIFIED",
		"SUB_PREMISE",
		"PREMISE",
		"PREMISE_PROXIMITY",
		"BLOCK",
		"ROUTE",
		"OTHER",
	]),
	geocodeGranularity: z.enum([
		"GRANULARITY_UNSPECIFIED",
		"SUB_PREMISE",
		"PREMISE",
		"PREMISE_PROXIMITY",
		"BLOCK",
		"ROUTE",
		"OTHER",
	]),
	addressComplete: z.boolean(),
	hasUnconfirmedComponents: z.boolean(),
	hasInferredComponents: z.boolean(),
	hasReplacedComponents: z.boolean(),
});

const ValidatedAddressSchema = z.object({
	// Original input
	inputAddress: z.string(),

	// Formatted addresses
	formattedAddress: z.string(),
	postalAddress: PostalAddressSchema,

	// Validation metadata
	verdict: ValidationResultSchema,
	addressComponents: z.array(AddressComponentSchema),

	// Geocoding
	geocode: GeocodingResultSchema.optional(),

	// USPS-specific data (for US addresses)
	uspsData: UspsDataSchema.optional(),

	// Computed fields
	isValid: z.boolean(),
	confidence: z.enum(["high", "medium", "low"]),
	corrections: z.array(z.string()),
	warnings: z.array(z.string()),
});

export type AddressComponent = z.infer<typeof AddressComponentSchema>;
export type PostalAddress = z.infer<typeof PostalAddressSchema>;
export type GeocodingResult = z.infer<typeof GeocodingResultSchema>;
export type UspsData = z.infer<typeof UspsDataSchema>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
export type ValidatedAddress = z.infer<typeof ValidatedAddressSchema>;

// Simplified address input
export interface AddressInput {
	addressLines: string[];
	city?: string;
	state?: string;
	postalCode?: string;
	regionCode?: string; // ISO 3166-1 alpha-2 (default: "US")
}

// ============================================================================
// Cache Configuration
// ============================================================================

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours for address validation

// ============================================================================
// Google Address Validation Service
// ============================================================================

class GoogleAddressValidationService {
	private readonly apiKey: string | undefined;
	private readonly cache: Map<
		string,
		{ data: ValidatedAddress; timestamp: number }
	> = new Map();

	constructor() {
		// Use unified GOOGLE_API_KEY for all Google services
		this.apiKey =
			process.env.GOOGLE_API_KEY ||
			process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
			process.env.GOOGLE_MAPS_API_KEY;
	}

	/**
	 * Check if service is available
	 */
	isAvailable(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Validate a full address string
	 */
	async validateAddress(
		address: string,
		regionCode = "US",
	): Promise<ValidatedAddress | null> {
		if (!this.apiKey) {
			console.warn("Google Address Validation Service: No API key configured");
			return null;
		}

		const cacheKey = `address:${address}:${regionCode}`;
		const cached = this.cache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			return cached.data;
		}

		try {
			const response = await fetch(
				`https://addressvalidation.googleapis.com/v1:validateAddress?key=${this.apiKey}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"User-Agent": USER_AGENT,
					},
					body: JSON.stringify({
						address: {
							regionCode,
							addressLines: [address],
						},
						enableUspsCass: regionCode === "US",
					}),
				},
			);

			if (!response.ok) {
				console.error(
					`Google Address Validation API error: ${response.status} ${response.statusText}`,
				);
				return null;
			}

			const data = await response.json();
			const result = this.parseValidationResponse(data, address);

			this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
			this.cleanCache();

			return result;
		} catch (error) {
			console.error("Google Address Validation Service error:", error);
			return null;
		}
	}

	/**
	 * Validate structured address components
	 */
	async validateStructuredAddress(
		input: AddressInput,
	): Promise<ValidatedAddress | null> {
		if (!this.apiKey) {
			console.warn("Google Address Validation Service: No API key configured");
			return null;
		}

		const regionCode = input.regionCode || "US";

		// Build address lines
		const addressLines = [...input.addressLines];
		if (input.city || input.state || input.postalCode) {
			const cityStateZip = [input.city, input.state, input.postalCode]
				.filter(Boolean)
				.join(", ");
			if (cityStateZip && !addressLines.includes(cityStateZip)) {
				addressLines.push(cityStateZip);
			}
		}

		const inputString = addressLines.join(", ");
		const cacheKey = `structured:${inputString}:${regionCode}`;
		const cached = this.cache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			return cached.data;
		}

		try {
			const requestBody: {
				address: {
					regionCode: string;
					locality?: string;
					administrativeArea?: string;
					postalCode?: string;
					addressLines: string[];
				};
				enableUspsCass: boolean;
			} = {
				address: {
					regionCode,
					addressLines: input.addressLines,
				},
				enableUspsCass: regionCode === "US",
			};

			// Add structured components if provided
			if (input.city) {
				requestBody.address.locality = input.city;
			}
			if (input.state) {
				requestBody.address.administrativeArea = input.state;
			}
			if (input.postalCode) {
				requestBody.address.postalCode = input.postalCode;
			}

			const response = await fetch(
				`https://addressvalidation.googleapis.com/v1:validateAddress?key=${this.apiKey}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"User-Agent": USER_AGENT,
					},
					body: JSON.stringify(requestBody),
				},
			);

			if (!response.ok) {
				console.error(
					`Google Address Validation API error: ${response.status} ${response.statusText}`,
				);
				return null;
			}

			const data = await response.json();
			const result = this.parseValidationResponse(data, inputString);

			this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
			this.cleanCache();

			return result;
		} catch (error) {
			console.error("Google Address Validation Service error:", error);
			return null;
		}
	}

	/**
	 * Quick address check - returns simplified validation status
	 */
	async quickValidate(
		address: string,
		regionCode = "US",
	): Promise<{
		isValid: boolean;
		confidence: "high" | "medium" | "low";
		formattedAddress: string | null;
		lat: number | null;
		lng: number | null;
	}> {
		const result = await this.validateAddress(address, regionCode);

		if (!result) {
			return {
				isValid: false,
				confidence: "low",
				formattedAddress: null,
				lat: null,
				lng: null,
			};
		}

		return {
			isValid: result.isValid,
			confidence: result.confidence,
			formattedAddress: result.formattedAddress,
			lat: result.geocode?.location.latitude ?? null,
			lng: result.geocode?.location.longitude ?? null,
		};
	}

	/**
	 * Extract address components for form autofill
	 */
	async parseAddressComponents(
		address: string,
		regionCode = "US",
	): Promise<{
		streetNumber: string | null;
		route: string | null;
		city: string | null;
		state: string | null;
		postalCode: string | null;
		country: string | null;
		unit: string | null;
	} | null> {
		const result = await this.validateAddress(address, regionCode);

		if (!result) {
			return null;
		}

		const getComponent = (type: string): string | null => {
			const component = result.addressComponents.find(
				(c) => c.componentType === type,
			);
			return component?.componentName.text ?? null;
		};

		return {
			streetNumber: getComponent("street_number"),
			route: getComponent("route"),
			city: getComponent("locality") || getComponent("sublocality"),
			state: getComponent("administrative_area_level_1"),
			postalCode: getComponent("postal_code"),
			country: getComponent("country"),
			unit:
				getComponent("subpremise") ||
				getComponent("apartment") ||
				getComponent("suite"),
		};
	}

	/**
	 * Check if address is deliverable (US only)
	 */
	async isDeliverable(address: string): Promise<{
		deliverable: boolean;
		reason: string | null;
		dpvCode: string | null;
	}> {
		const result = await this.validateAddress(address, "US");

		if (!result || !result.uspsData) {
			return {
				deliverable: false,
				reason: "Unable to validate address",
				dpvCode: null,
			};
		}

		const dpvConfirmation = result.uspsData.dpvConfirmation;
		const dpvVacant = result.uspsData.dpvVacant;

		// DPV Confirmation codes:
		// Y = Confirmed (full match)
		// D = Primary confirmed, secondary missing
		// S = Primary confirmed, secondary unconfirmed
		// N = Not confirmed

		const isDeliverable = dpvConfirmation === "Y" || dpvConfirmation === "D";
		const isVacant = dpvVacant === "Y";

		let reason: string | null = null;
		if (dpvConfirmation === "N") {
			reason = "Address not found in USPS database";
		} else if (dpvConfirmation === "S") {
			reason = "Secondary address (apt/suite) could not be confirmed";
		} else if (dpvConfirmation === "D") {
			reason = "Secondary address (apt/suite) is missing";
		} else if (isVacant) {
			reason = "Address marked as vacant";
		}

		return {
			deliverable: isDeliverable && !isVacant,
			reason,
			dpvCode: dpvConfirmation || null,
		};
	}

	/**
	 * Get USPS-standardized address (for US addresses)
	 */
	async getUspsStandardizedAddress(address: string): Promise<{
		line1: string;
		line2: string | null;
		city: string;
		state: string;
		zip: string;
		zip4: string | null;
		carrierRoute: string | null;
		county: string | null;
	} | null> {
		const result = await this.validateAddress(address, "US");

		if (!result?.uspsData?.standardizedAddress) {
			return null;
		}

		const std = result.uspsData.standardizedAddress;

		return {
			line1: std.firstAddressLine || "",
			line2: std.secondAddressLine || null,
			city: std.city || result.postalAddress.locality || "",
			state: std.state || result.postalAddress.administrativeArea || "",
			zip: std.zipCode || result.postalAddress.postalCode || "",
			zip4: std.zipCodeExtension || null,
			carrierRoute: result.uspsData.carrierRoute || null,
			county: result.uspsData.county || null,
		};
	}

	/**
	 * Parse API response into ValidatedAddress
	 */
	private parseValidationResponse(
		data: unknown,
		inputAddress: string,
	): ValidatedAddress {
		const response = data as {
			result?: {
				verdict?: {
					inputGranularity?: string;
					validationGranularity?: string;
					geocodeGranularity?: string;
					addressComplete?: boolean;
					hasUnconfirmedComponents?: boolean;
					hasInferredComponents?: boolean;
					hasReplacedComponents?: boolean;
				};
				address?: {
					formattedAddress?: string;
					postalAddress?: {
						regionCode?: string;
						languageCode?: string;
						postalCode?: string;
						administrativeArea?: string;
						locality?: string;
						sublocality?: string;
						addressLines?: string[];
						recipients?: string[];
						organization?: string;
					};
					addressComponents?: Array<{
						componentName?: { text?: string; languageCode?: string };
						componentType?: string;
						confirmationLevel?: string;
						inferred?: boolean;
						spellCorrected?: boolean;
						replaced?: boolean;
						unexpected?: boolean;
					}>;
				};
				geocode?: {
					location?: { latitude?: number; longitude?: number };
					plusCode?: { globalCode?: string; compoundCode?: string };
					bounds?: {
						low?: { latitude?: number; longitude?: number };
						high?: { latitude?: number; longitude?: number };
					};
					featureSize?: number;
					placeId?: string;
					placeTypes?: string[];
				};
				uspsData?: UspsData;
			};
		};

		const result = response.result;
		const verdict = result?.verdict;
		const address = result?.address;
		const geocode = result?.geocode;

		// Calculate confidence
		let confidence: "high" | "medium" | "low" = "low";
		if (verdict?.addressComplete && !verdict?.hasUnconfirmedComponents) {
			confidence = "high";
		} else if (verdict?.addressComplete) {
			confidence = "medium";
		}

		// Collect corrections and warnings
		const corrections: string[] = [];
		const warnings: string[] = [];

		const components =
			address?.addressComponents?.map((c) => ({
				componentName: {
					text: c.componentName?.text || "",
					languageCode: c.componentName?.languageCode,
				},
				componentType: c.componentType || "",
				confirmationLevel: (c.confirmationLevel ||
					"CONFIRMATION_LEVEL_UNSPECIFIED") as AddressComponent["confirmationLevel"],
				inferred: c.inferred,
				spellCorrected: c.spellCorrected,
				replaced: c.replaced,
				unexpected: c.unexpected,
			})) || [];

		for (const component of components) {
			if (component.spellCorrected) {
				corrections.push(`Spelling corrected: ${component.componentName.text}`);
			}
			if (component.replaced) {
				corrections.push(`Replaced: ${component.componentName.text}`);
			}
			if (component.inferred) {
				corrections.push(`Inferred: ${component.componentName.text}`);
			}
			if (component.unexpected) {
				warnings.push(`Unexpected component: ${component.componentName.text}`);
			}
			if (component.confirmationLevel === "UNCONFIRMED_AND_SUSPICIOUS") {
				warnings.push(
					`Suspicious component: ${component.componentType} - ${component.componentName.text}`,
				);
			}
		}

		if (verdict?.hasUnconfirmedComponents) {
			warnings.push("Some address components could not be confirmed");
		}

		const postalAddress: PostalAddress = {
			regionCode: address?.postalAddress?.regionCode || "US",
			languageCode: address?.postalAddress?.languageCode,
			postalCode: address?.postalAddress?.postalCode,
			administrativeArea: address?.postalAddress?.administrativeArea,
			locality: address?.postalAddress?.locality,
			sublocality: address?.postalAddress?.sublocality,
			addressLines: address?.postalAddress?.addressLines || [],
			recipients: address?.postalAddress?.recipients,
			organization: address?.postalAddress?.organization,
		};

		const validatedAddress: ValidatedAddress = {
			inputAddress,
			formattedAddress: address?.formattedAddress || inputAddress,
			postalAddress,
			verdict: {
				inputGranularity: (verdict?.inputGranularity ||
					"GRANULARITY_UNSPECIFIED") as ValidationResult["inputGranularity"],
				validationGranularity: (verdict?.validationGranularity ||
					"GRANULARITY_UNSPECIFIED") as ValidationResult["validationGranularity"],
				geocodeGranularity: (verdict?.geocodeGranularity ||
					"GRANULARITY_UNSPECIFIED") as ValidationResult["geocodeGranularity"],
				addressComplete: verdict?.addressComplete ?? false,
				hasUnconfirmedComponents: verdict?.hasUnconfirmedComponents ?? false,
				hasInferredComponents: verdict?.hasInferredComponents ?? false,
				hasReplacedComponents: verdict?.hasReplacedComponents ?? false,
			},
			addressComponents: components,
			geocode: geocode?.location
				? {
						location: {
							latitude: geocode.location.latitude ?? 0,
							longitude: geocode.location.longitude ?? 0,
						},
						plusCode: geocode.plusCode,
						bounds: geocode.bounds
							? {
									low: {
										latitude: geocode.bounds.low?.latitude ?? 0,
										longitude: geocode.bounds.low?.longitude ?? 0,
									},
									high: {
										latitude: geocode.bounds.high?.latitude ?? 0,
										longitude: geocode.bounds.high?.longitude ?? 0,
									},
								}
							: undefined,
						featureSize: geocode.featureSize,
						placeId: geocode.placeId,
						placeTypes: geocode.placeTypes,
					}
				: undefined,
			uspsData: result?.uspsData,
			isValid: verdict?.addressComplete === true && confidence !== "low",
			confidence,
			corrections,
			warnings,
		};

		return ValidatedAddressSchema.parse(validatedAddress);
	}

	/**
	 * Clean up old cache entries
	 */
	private cleanCache(): void {
		const now = Date.now();
		for (const [key, value] of this.cache.entries()) {
			if (now - value.timestamp > CACHE_TTL * 2) {
				this.cache.delete(key);
			}
		}

		// Keep cache size reasonable
		if (this.cache.size > 1000) {
			const entries = Array.from(this.cache.entries());
			entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
			this.cache.clear();
			for (const [key, value] of entries.slice(0, 500)) {
				this.cache.set(key, value);
			}
		}
	}

	/**
	 * Clear all caches
	 */
	clearCache(): void {
		this.cache.clear();
	}
}

// Singleton instance
export const googleAddressValidationService =
	new GoogleAddressValidationService();
