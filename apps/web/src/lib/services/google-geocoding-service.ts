/**
 * Google Geocoding Service
 *
 * Converts addresses to coordinates and vice versa.
 * - Forward geocoding (address → coordinates)
 * - Reverse geocoding (coordinates → address)
 * - Address component parsing
 * - Plus codes support
 *
 * API: Google Geocoding API
 * Free Tier: $200/month credit = ~40,000 requests
 * Docs: https://developers.google.com/maps/documentation/geocoding
 */

import { z } from "zod";
import { googleMapsTracker } from "@/lib/analytics/external-api-tracker";

const USER_AGENT = "Stratos-FMS/1.0 (support@stratos.app)";

/**
 * Address component schema
 */
const AddressComponentSchema = z.object({
	longName: z.string(),
	shortName: z.string(),
	types: z.array(z.string()),
});

/**
 * Geometry schema
 */
const GeometrySchema = z.object({
	location: z.object({
		lat: z.number(),
		lng: z.number(),
	}),
	locationType: z.enum([
		"ROOFTOP",
		"RANGE_INTERPOLATED",
		"GEOMETRIC_CENTER",
		"APPROXIMATE",
	]),
	viewport: z.object({
		northeast: z.object({ lat: z.number(), lng: z.number() }),
		southwest: z.object({ lat: z.number(), lng: z.number() }),
	}),
	bounds: z
		.object({
			northeast: z.object({ lat: z.number(), lng: z.number() }),
			southwest: z.object({ lat: z.number(), lng: z.number() }),
		})
		.optional(),
});

export type AddressComponent = z.infer<typeof AddressComponentSchema>;
export type Geometry = z.infer<typeof GeometrySchema>;

/**
 * Geocoding result
 */
export interface GeocodingResult {
	placeId: string;
	formattedAddress: string;
	latitude: number;
	longitude: number;
	locationType:
		| "ROOFTOP"
		| "RANGE_INTERPOLATED"
		| "GEOMETRIC_CENTER"
		| "APPROXIMATE";
	types: string[];
	addressComponents: AddressComponent[];
	viewport: {
		northeast: { lat: number; lng: number };
		southwest: { lat: number; lng: number };
	};
	plusCode?: string;
	partialMatch?: boolean;
}

/**
 * Parsed address structure
 */
export interface ParsedGeocodedAddress {
	streetNumber?: string;
	street?: string;
	neighborhood?: string;
	city?: string;
	county?: string;
	state?: string;
	stateCode?: string;
	postalCode?: string;
	postalCodeSuffix?: string;
	country?: string;
	countryCode?: string;
	formattedAddress: string;
	latitude: number;
	longitude: number;
	placeId: string;
	accuracy:
		| "ROOFTOP"
		| "RANGE_INTERPOLATED"
		| "GEOMETRIC_CENTER"
		| "APPROXIMATE";
}

/**
 * Geocoding options
 */
export interface GeocodingOptions {
	bounds?: {
		northeast: { lat: number; lng: number };
		southwest: { lat: number; lng: number };
	};
	region?: string; // ccTLD (e.g., "us", "uk")
	components?: {
		country?: string;
		postalCode?: string;
		administrativeArea?: string;
		locality?: string;
		route?: string;
	};
	language?: string;
	companyId?: string; // For usage tracking
}

/**
 * Reverse geocoding options
 */
export interface ReverseGeocodingOptions {
	resultTypes?: string[]; // Filter by address type
	locationTypes?: (
		| "ROOFTOP"
		| "RANGE_INTERPOLATED"
		| "GEOMETRIC_CENTER"
		| "APPROXIMATE"
	)[];
	language?: string;
	companyId?: string; // For usage tracking
}

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
class GoogleGeocodingService {
	private readonly apiKey: string | undefined;
	private readonly forwardCache: Map<
		string,
		{ data: GeocodingResult[]; timestamp: number }
	> = new Map();
	private readonly reverseCache: Map<
		string,
		{ data: GeocodingResult[]; timestamp: number }
	> = new Map();
	private readonly cacheTTL = CACHE_TTL_MS;

	constructor() {
		this.apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
	}

	/**
	 * Forward geocode an address to coordinates
	 */
	async geocode(
		address: string,
		options: GeocodingOptions = {},
	): Promise<GeocodingResult[] | null> {
		if (!this.apiKey) {
			console.warn("Google Geocoding API key not configured");
			return null;
		}

		const cacheKey = `fwd:${address}:${JSON.stringify(options)}`;
		const cached = this.forwardCache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		const startTime = Date.now();
		try {
			const params = new URLSearchParams({
				address,
				key: this.apiKey,
			});

			if (options.bounds) {
				params.set(
					"bounds",
					`${options.bounds.southwest.lat},${options.bounds.southwest.lng}|${options.bounds.northeast.lat},${options.bounds.northeast.lng}`,
				);
			}

			if (options.region) {
				params.set("region", options.region);
			}

			if (options.components) {
				const componentParts: string[] = [];
				if (options.components.country)
					componentParts.push(`country:${options.components.country}`);
				if (options.components.postalCode)
					componentParts.push(`postal_code:${options.components.postalCode}`);
				if (options.components.administrativeArea)
					componentParts.push(
						`administrative_area:${options.components.administrativeArea}`,
					);
				if (options.components.locality)
					componentParts.push(`locality:${options.components.locality}`);
				if (options.components.route)
					componentParts.push(`route:${options.components.route}`);
				if (componentParts.length > 0) {
					params.set("components", componentParts.join("|"));
				}
			}

			if (options.language) {
				params.set("language", options.language);
			}

			const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("Geocoding API error:", response.status);
				if (options.companyId) {
					googleMapsTracker.track("geocode", options.companyId, {
						success: false,
						responseTimeMs: Date.now() - startTime,
						errorMessage: `HTTP ${response.status}`,
					}).catch(() => {});
				}
				return null;
			}

			const data = await response.json();

			if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
				console.error("Geocoding API status:", data.status, data.error_message);
				if (options.companyId) {
					googleMapsTracker.track("geocode", options.companyId, {
						success: false,
						responseTimeMs: Date.now() - startTime,
						errorMessage: data.status,
					}).catch(() => {});
				}
				return null;
			}

			if (!data.results || data.results.length === 0) {
				// Track successful (but empty) result
				if (options.companyId) {
					googleMapsTracker.track("geocode", options.companyId, {
						success: true,
						responseTimeMs: Date.now() - startTime,
						estimatedCostCents: 0.5, // ~$0.005 per geocode request
					}).catch(() => {});
				}
				return [];
			}

			const results: GeocodingResult[] = data.results.map(
				(result: Record<string, unknown>) => ({
					placeId: result.place_id as string,
					formattedAddress: result.formatted_address as string,
					latitude: (result.geometry as { location: { lat: number } }).location
						.lat,
					longitude: (result.geometry as { location: { lng: number } }).location
						.lng,
					locationType: (result.geometry as { location_type: string })
						.location_type,
					types: result.types as string[],
					addressComponents: (
						(result.address_components as Array<{
							long_name: string;
							short_name: string;
							types: string[];
						}>) || []
					).map((c) => ({
						longName: c.long_name,
						shortName: c.short_name,
						types: c.types,
					})),
					viewport: {
						northeast: (
							result.geometry as {
								viewport: { northeast: { lat: number; lng: number } };
							}
						).viewport.northeast,
						southwest: (
							result.geometry as {
								viewport: { southwest: { lat: number; lng: number } };
							}
						).viewport.southwest,
					},
					plusCode: (result.plus_code as { global_code?: string })?.global_code,
					partialMatch: result.partial_match as boolean | undefined,
				}),
			);

			this.forwardCache.set(cacheKey, { data: results, timestamp: Date.now() });

			// Track successful API call
			if (options.companyId) {
				googleMapsTracker.track("geocode", options.companyId, {
					success: true,
					responseTimeMs: Date.now() - startTime,
					estimatedCostCents: 0.5, // ~$0.005 per geocode request
				}).catch(() => {});
			}

			return results;
		} catch (error) {
			console.error("Geocoding error:", error);
			if (options.companyId) {
				googleMapsTracker.track("geocode", options.companyId, {
					success: false,
					responseTimeMs: Date.now() - startTime,
					errorMessage: error instanceof Error ? error.message : "Unknown error",
				}).catch(() => {});
			}
			return null;
		}
	}

	/**
	 * Reverse geocode coordinates to address
	 */
	async reverseGeocode(
		latitude: number,
		longitude: number,
		options: ReverseGeocodingOptions = {},
	): Promise<GeocodingResult[] | null> {
		if (!this.apiKey) {
			console.warn("Google Geocoding API key not configured");
			return null;
		}

		const cacheKey = `rev:${latitude.toFixed(6)},${longitude.toFixed(6)}:${JSON.stringify(options)}`;
		const cached = this.reverseCache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		const startTime = Date.now();
		try {
			const params = new URLSearchParams({
				latlng: `${latitude},${longitude}`,
				key: this.apiKey,
			});

			if (options.resultTypes && options.resultTypes.length > 0) {
				params.set("result_type", options.resultTypes.join("|"));
			}

			if (options.locationTypes && options.locationTypes.length > 0) {
				params.set("location_type", options.locationTypes.join("|"));
			}

			if (options.language) {
				params.set("language", options.language);
			}

			const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("Reverse geocoding API error:", response.status);
				if (options.companyId) {
					googleMapsTracker.track("reverse_geocode", options.companyId, {
						success: false,
						responseTimeMs: Date.now() - startTime,
						errorMessage: `HTTP ${response.status}`,
					}).catch(() => {});
				}
				return null;
			}

			const data = await response.json();

			if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
				console.error(
					"Reverse geocoding API status:",
					data.status,
					data.error_message,
				);
				if (options.companyId) {
					googleMapsTracker.track("reverse_geocode", options.companyId, {
						success: false,
						responseTimeMs: Date.now() - startTime,
						errorMessage: data.status,
					}).catch(() => {});
				}
				return null;
			}

			if (!data.results || data.results.length === 0) {
				// Track successful (but empty) result
				if (options.companyId) {
					googleMapsTracker.track("reverse_geocode", options.companyId, {
						success: true,
						responseTimeMs: Date.now() - startTime,
						estimatedCostCents: 0.5, // ~$0.005 per geocode request
					}).catch(() => {});
				}
				return [];
			}

			const results: GeocodingResult[] = data.results.map(
				(result: Record<string, unknown>) => ({
					placeId: result.place_id as string,
					formattedAddress: result.formatted_address as string,
					latitude: (result.geometry as { location: { lat: number } }).location
						.lat,
					longitude: (result.geometry as { location: { lng: number } }).location
						.lng,
					locationType: (result.geometry as { location_type: string })
						.location_type,
					types: result.types as string[],
					addressComponents: (
						(result.address_components as Array<{
							long_name: string;
							short_name: string;
							types: string[];
						}>) || []
					).map((c) => ({
						longName: c.long_name,
						shortName: c.short_name,
						types: c.types,
					})),
					viewport: {
						northeast: (
							result.geometry as {
								viewport: { northeast: { lat: number; lng: number } };
							}
						).viewport.northeast,
						southwest: (
							result.geometry as {
								viewport: { southwest: { lat: number; lng: number } };
							}
						).viewport.southwest,
					},
					plusCode: (result.plus_code as { global_code?: string })?.global_code,
				}),
			);

			this.reverseCache.set(cacheKey, { data: results, timestamp: Date.now() });

			// Track successful API call
			if (options.companyId) {
				googleMapsTracker.track("reverse_geocode", options.companyId, {
					success: true,
					responseTimeMs: Date.now() - startTime,
					estimatedCostCents: 0.5, // ~$0.005 per geocode request
				}).catch(() => {});
			}

			return results;
		} catch (error) {
			console.error("Reverse geocoding error:", error);
			if (options.companyId) {
				googleMapsTracker.track("reverse_geocode", options.companyId, {
					success: false,
					responseTimeMs: Date.now() - startTime,
					errorMessage: error instanceof Error ? error.message : "Unknown error",
				}).catch(() => {});
			}
			return null;
		}
	}

	/**
	 * Get single best geocoding result
	 */
	async geocodeSingle(
		address: string,
		options: GeocodingOptions = {},
	): Promise<GeocodingResult | null> {
		const results = await this.geocode(address, options);
		return results && results.length > 0 ? results[0] : null;
	}

	/**
	 * Get single best reverse geocoding result
	 */
	async reverseGeocodeSingle(
		latitude: number,
		longitude: number,
		options: ReverseGeocodingOptions = {},
	): Promise<GeocodingResult | null> {
		const results = await this.reverseGeocode(latitude, longitude, options);
		return results && results.length > 0 ? results[0] : null;
	}

	/**
	 * Parse geocoding result into structured address
	 */
	parseAddress(result: GeocodingResult): ParsedGeocodedAddress {
		const getComponent = (
			type: string,
			useShort = false,
		): string | undefined => {
			const component = result.addressComponents.find((c) =>
				c.types.includes(type),
			);
			return component
				? useShort
					? component.shortName
					: component.longName
				: undefined;
		};

		return {
			streetNumber: getComponent("street_number"),
			street: getComponent("route"),
			neighborhood:
				getComponent("neighborhood") || getComponent("sublocality_level_1"),
			city:
				getComponent("locality") ||
				getComponent("sublocality_level_1") ||
				getComponent("administrative_area_level_2"),
			county: getComponent("administrative_area_level_2"),
			state: getComponent("administrative_area_level_1"),
			stateCode: getComponent("administrative_area_level_1", true),
			postalCode: getComponent("postal_code"),
			postalCodeSuffix: getComponent("postal_code_suffix"),
			country: getComponent("country"),
			countryCode: getComponent("country", true),
			formattedAddress: result.formattedAddress,
			latitude: result.latitude,
			longitude: result.longitude,
			placeId: result.placeId,
			accuracy: result.locationType,
		};
	}

	/**
	 * Geocode and parse address in one call
	 */
	async geocodeAndParse(
		address: string,
		options: GeocodingOptions = {},
	): Promise<ParsedGeocodedAddress | null> {
		const result = await this.geocodeSingle(address, options);
		return result ? this.parseAddress(result) : null;
	}

	/**
	 * Reverse geocode and parse in one call
	 */
	async reverseGeocodeAndParse(
		latitude: number,
		longitude: number,
		options: ReverseGeocodingOptions = {},
	): Promise<ParsedGeocodedAddress | null> {
		const result = await this.reverseGeocodeSingle(
			latitude,
			longitude,
			options,
		);
		return result ? this.parseAddress(result) : null;
	}

	/**
	 * Batch geocode multiple addresses
	 */
	async batchGeocode(
		addresses: string[],
		options: GeocodingOptions = {},
	): Promise<Map<string, GeocodingResult | null>> {
		const results = new Map<string, GeocodingResult | null>();

		// Process in parallel with concurrency limit
		const BATCH_SIZE = 10;
		for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
			const batch = addresses.slice(i, i + BATCH_SIZE);
			const promises = batch.map(async (address) => {
				const result = await this.geocodeSingle(address, options);
				results.set(address, result);
			});
			await Promise.all(promises);
		}

		return results;
	}

	/**
	 * Get coordinates for an address (simple helper)
	 */
	async getCoordinates(
		address: string,
		options: GeocodingOptions = {},
	): Promise<{ latitude: number; longitude: number } | null> {
		const result = await this.geocodeSingle(address, options);
		if (!result) return null;
		return {
			latitude: result.latitude,
			longitude: result.longitude,
		};
	}

	/**
	 * Get address for coordinates (simple helper)
	 */
	async getAddress(
		latitude: number,
		longitude: number,
		options: ReverseGeocodingOptions = {},
	): Promise<string | null> {
		const result = await this.reverseGeocodeSingle(
			latitude,
			longitude,
			options,
		);
		return result?.formattedAddress || null;
	}

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Clear caches
	 */
	clearCache(): void {
		this.forwardCache.clear();
		this.reverseCache.clear();
	}
}

export const googleGeocodingService = new GoogleGeocodingService();
