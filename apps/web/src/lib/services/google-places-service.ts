/**
 * Google Places Service
 *
 * Fetches nearby businesses with reviews, ratings, and photos
 * - Nearby suppliers (Home Depot, Lowe's, etc.)
 * - Business ratings and reviews
 * - Operating hours
 * - Photos
 * - Contact information
 * - Address autocomplete
 * - Place details
 *
 * API: Google Places API (Nearby Search + Place Details + Autocomplete)
 * Free Tier: $200/month credit = ~8,000 requests
 * Docs: https://developers.google.com/maps/documentation/places/web-service
 */

import { z } from "zod";

const USER_AGENT = "Stratos-FMS/1.0 (support@stratos.app)";

const PlaceSchema = z.object({
	name: z.string(),
	placeId: z.string(),
	rating: z.number().optional(), // 1.0 to 5.0
	userRatingsTotal: z.number().optional(),
	vicinity: z.string(), // Address
	distance: z.number(), // meters
	lat: z.number(),
	lon: z.number(),
	types: z.array(z.string()).optional(), // Business types
	openNow: z.boolean().optional(),
	businessStatus: z.string().optional(), // OPERATIONAL, CLOSED_TEMPORARILY, CLOSED_PERMANENTLY
	priceLevel: z.number().optional(), // 0-4 (free to very expensive)
	photoUrl: z.string().optional(), // URL to main photo
	phoneNumber: z.string().optional(),
	website: z.string().optional(),
});

const GooglePlacesSchema = z.object({
	places: z.array(PlaceSchema),
	totalResults: z.number(),
	dataSource: z.string(),
	enrichedAt: z.string(),
});

export type Place = z.infer<typeof PlaceSchema>;
export type GooglePlaces = z.infer<typeof GooglePlacesSchema>;

/**
 * Autocomplete prediction result
 */
export interface AutocompletePrediction {
	placeId: string;
	description: string;
	mainText: string;
	secondaryText: string;
	types: string[];
}

/**
 * Parsed address from place details
 */
export interface ParsedAddress {
	streetNumber?: string;
	street?: string;
	city?: string;
	state?: string;
	stateCode?: string;
	postalCode?: string;
	country?: string;
	countryCode?: string;
	formattedAddress: string;
	latitude: number;
	longitude: number;
	placeId: string;
}

/**
 * Full place details
 */
export interface PlaceDetails {
	placeId: string;
	name: string;
	formattedAddress: string;
	formattedPhoneNumber?: string;
	website?: string;
	geometry: {
		location: { lat: number; lng: number };
	};
	types: string[];
	openingHours?: {
		openNow?: boolean;
		weekdayText?: string[];
	};
	rating?: number;
	userRatingsTotal?: number;
	addressComponents?: Array<{
		longName: string;
		shortName: string;
		types: string[];
	}>;
}

const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const _EARTH_RADIUS_METERS = 6_371_000;

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
class GooglePlacesService {
	private readonly apiKey: string | undefined;
	private readonly cache: Map<
		string,
		{ data: GooglePlaces; timestamp: number }
	> = new Map();
	private readonly cacheTTL = CACHE_TTL_MS;

	// Cache for autocomplete results
	private readonly autocompleteCache: Map<
		string,
		{ data: AutocompletePrediction[]; timestamp: number }
	> = new Map();
	private readonly autocompleteCacheTTL = 1000 * 60 * 5; // 5 minutes

	constructor() {
		// Use unified GOOGLE_API_KEY for all Google services
		this.apiKey =
			process.env.GOOGLE_API_KEY ||
			process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
			process.env.GOOGLE_MAPS_API_KEY;
	}

	/**
	 * Find nearby home improvement stores with reviews and ratings
	 */
	async findNearbySuppliers(
		lat: number,
		lon: number,
		radius = 8000,
	): Promise<GooglePlaces | null> {
		if (!this.apiKey) {
			return null;
		}

		const cacheKey = `places:${lat.toFixed(4)},${lon.toFixed(4)}:${radius}`;
		const cached = this.cache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		try {
			// Search for home improvement stores, hardware stores
			// Using keyword search for better results
			const keywords = [
				"home depot",
				"lowes",
				"hardware store",
				"lumber yard",
				"building supplies",
			];
			const allPlaces: Place[] = [];

			for (const keyword of keywords) {
				const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&keyword=${encodeURIComponent(keyword)}&key=${this.apiKey}`;

				const res = await fetch(url, {
					headers: { "User-Agent": USER_AGENT },
				});

				if (!res.ok) {
					continue;
				}

				const data = await res.json();

				if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
					continue;
				}

				if (data.results && data.results.length > 0) {
					for (const result of data.results) {
						const distance = this.calculateDistance(
							lat,
							lon,
							result.geometry.location.lat,
							result.geometry.location.lng,
						);

						// Get photo URL if available
						let photoUrl: string | undefined;
						if (result.photos && result.photos.length > 0) {
							const photoReference = result.photos[0].photo_reference;
							photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${this.apiKey}`;
						}

						const place: Place = {
							name: result.name,
							placeId: result.place_id,
							rating: result.rating,
							userRatingsTotal: result.user_ratings_total,
							vicinity: result.vicinity,
							distance: Math.round(distance),
							lat: result.geometry.location.lat,
							lon: result.geometry.location.lng,
							types: result.types,
							openNow: result.opening_hours?.open_now,
							businessStatus: result.business_status,
							priceLevel: result.price_level,
							photoUrl,
						};

						// Avoid duplicates
						if (!allPlaces.find((p) => p.placeId === place.placeId)) {
							allPlaces.push(place);
						}
					}
				}
			}

			// Sort by distance
			allPlaces.sort((a, b) => a.distance - b.distance);

			// Get additional details for top 5 places (phone, website, etc.)
			const topPlaces = allPlaces.slice(0, 5);
			const enrichedPlaces = await Promise.all(
				topPlaces.map((place) => this.enrichPlaceDetails(place)),
			);

			const googlePlaces: GooglePlaces = {
				places: enrichedPlaces,
				totalResults: allPlaces.length,
				dataSource: "google-places",
				enrichedAt: new Date().toISOString(),
			};

			this.cache.set(cacheKey, { data: googlePlaces, timestamp: Date.now() });

			return googlePlaces;
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Enrich place with additional details (phone, website, etc.)
	 */
	private async enrichPlaceDetails(place: Place): Promise<Place> {
		try {
			const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.placeId}&fields=formatted_phone_number,website&key=${this.apiKey}`;

			const res = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!res.ok) {
				return place;
			}

			const data = await res.json();

			if (data.status === "OK" && data.result) {
				return {
					...place,
					phoneNumber: data.result.formatted_phone_number,
					website: data.result.website,
				};
			}

			return place;
		} catch (_error) {
			return place;
		}
	}

	/**
	 * Calculate distance between two points using Haversine formula
	 */
	private calculateDistance(
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number,
	): number {
		const R = 6_371_000; // Earth's radius in meters
		const φ1 = (lat1 * Math.PI) / 180;
		const φ2 = (lat2 * Math.PI) / 180;
		const Δφ = ((lat2 - lat1) * Math.PI) / 180;
		const Δλ = ((lon2 - lon1) * Math.PI) / 180;

		const a =
			Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
			Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c;
	}

	/**
	 * Get Google Maps link for a place
	 */
	getPlaceMapUrl(placeId: string): string {
		return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
	}

	/**
	 * Get directions to a place
	 */
	getDirectionsUrl(lat: number, lon: number): string {
		return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
	}

	/**
	 * Get autocomplete predictions for an address input
	 */
	async getAutocomplete(
		input: string,
		options: {
			types?: string[];
			locationBias?: { lat: number; lon: number; radius?: number };
			components?: string;
		} = {},
	): Promise<AutocompletePrediction[]> {
		if (!this.apiKey || !input || input.trim().length < 2) {
			return [];
		}

		const cacheKey = `autocomplete:${input}:${JSON.stringify(options)}`;
		const cached = this.autocompleteCache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < this.autocompleteCacheTTL) {
			return cached.data;
		}

		try {
			const params = new URLSearchParams({
				input: input.trim(),
				key: this.apiKey,
			});

			if (options.types && options.types.length > 0) {
				params.set("types", options.types.join("|"));
			}

			if (options.locationBias) {
				params.set(
					"location",
					`${options.locationBias.lat},${options.locationBias.lon}`,
				);
				if (options.locationBias.radius) {
					params.set("radius", String(options.locationBias.radius));
				}
			}

			if (options.components) {
				params.set("components", options.components);
			}

			const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`;
			const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });

			if (!res.ok) {
				return [];
			}

			const data = await res.json();

			if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
				return [];
			}

			const predictions: AutocompletePrediction[] = (
				data.predictions || []
			).map((p: Record<string, unknown>) => ({
				placeId: p.place_id as string,
				description: p.description as string,
				mainText:
					(p.structured_formatting as Record<string, string>)?.main_text || "",
				secondaryText:
					(p.structured_formatting as Record<string, string>)?.secondary_text ||
					"",
				types: (p.types as string[]) || [],
			}));

			this.autocompleteCache.set(cacheKey, {
				data: predictions,
				timestamp: Date.now(),
			});
			return predictions;
		} catch (_error) {
			return [];
		}
	}

	/**
	 * Get full place details by place ID
	 */
	async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
		if (!this.apiKey) {
			return null;
		}

		try {
			const fields = [
				"place_id",
				"name",
				"formatted_address",
				"formatted_phone_number",
				"website",
				"geometry",
				"types",
				"opening_hours",
				"rating",
				"user_ratings_total",
				"address_components",
			].join(",");

			const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${this.apiKey}`;
			const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });

			if (!res.ok) {
				return null;
			}

			const data = await res.json();

			if (data.status !== "OK" || !data.result) {
				return null;
			}

			const r = data.result;
			return {
				placeId: r.place_id,
				name: r.name || "",
				formattedAddress: r.formatted_address || "",
				formattedPhoneNumber: r.formatted_phone_number,
				website: r.website,
				geometry: {
					location: r.geometry?.location || { lat: 0, lng: 0 },
				},
				types: r.types || [],
				openingHours: r.opening_hours
					? {
							openNow: r.opening_hours.open_now,
							weekdayText: r.opening_hours.weekday_text,
						}
					: undefined,
				rating: r.rating,
				userRatingsTotal: r.user_ratings_total,
				addressComponents: r.address_components?.map(
					(c: Record<string, unknown>) => ({
						longName: c.long_name as string,
						shortName: c.short_name as string,
						types: c.types as string[],
					}),
				),
			};
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Parse place details into a structured address
	 */
	parseAddress(place: PlaceDetails): ParsedAddress {
		const components = place.addressComponents || [];

		const getComponent = (type: string): string | undefined => {
			const component = components.find((c) => c.types.includes(type));
			return component?.longName;
		};

		const getShortComponent = (type: string): string | undefined => {
			const component = components.find((c) => c.types.includes(type));
			return component?.shortName;
		};

		return {
			streetNumber: getComponent("street_number"),
			street: getComponent("route"),
			city: getComponent("locality") || getComponent("sublocality_level_1"),
			state: getComponent("administrative_area_level_1"),
			stateCode: getShortComponent("administrative_area_level_1"),
			postalCode: getComponent("postal_code"),
			country: getComponent("country"),
			countryCode: getShortComponent("country"),
			formattedAddress: place.formattedAddress,
			latitude: place.geometry.location.lat,
			longitude: place.geometry.location.lng,
			placeId: place.placeId,
		};
	}

	/**
	 * Get full address from input string (autocomplete + details)
	 */
	async getAddressFromInput(
		input: string,
		options: {
			types?: string[];
			locationBias?: { lat: number; lon: number; radius?: number };
			components?: string;
		} = {},
	): Promise<ParsedAddress | null> {
		const predictions = await this.getAutocomplete(input, {
			...options,
			types: options.types || ["address"],
		});

		if (predictions.length === 0) {
			return null;
		}

		const details = await this.getPlaceDetails(predictions[0].placeId);
		if (!details) {
			return null;
		}

		return this.parseAddress(details);
	}

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Clear all caches
	 */
	clearCache(): void {
		this.cache.clear();
		this.autocompleteCache.clear();
	}
}

export const googlePlacesService = new GooglePlacesService();
