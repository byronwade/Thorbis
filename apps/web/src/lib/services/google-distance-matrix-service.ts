/**
 * Google Distance Matrix Service
 *
 * Calculates travel distances and times between multiple origins and destinations.
 * - Multi-origin to multi-destination calculations
 * - Real-time traffic estimates
 * - Support for different travel modes (driving, walking, bicycling, transit)
 * - Useful for dispatch planning and technician assignment
 *
 * API: Google Distance Matrix API
 * Free Tier: $200/month credit = ~40,000 elements
 * Docs: https://developers.google.com/maps/documentation/distance-matrix
 */

import { z } from "zod";

const USER_AGENT = "Stratos-FMS/1.0 (support@stratos.app)";

// Element result schema
const DistanceMatrixElementSchema = z.object({
	status: z.enum([
		"OK",
		"NOT_FOUND",
		"ZERO_RESULTS",
		"MAX_ROUTE_LENGTH_EXCEEDED",
	]),
	distance: z
		.object({
			value: z.number(), // meters
			text: z.string(), // human readable
		})
		.optional(),
	duration: z
		.object({
			value: z.number(), // seconds
			text: z.string(), // human readable
		})
		.optional(),
	durationInTraffic: z
		.object({
			value: z.number(), // seconds
			text: z.string(), // human readable
		})
		.optional(),
	fare: z
		.object({
			currency: z.string(),
			value: z.number(),
			text: z.string(),
		})
		.optional(),
});

// Row schema (one origin to all destinations)
const DistanceMatrixRowSchema = z.object({
	elements: z.array(DistanceMatrixElementSchema),
});

// Full response schema
const DistanceMatrixResponseSchema = z.object({
	status: z.enum([
		"OK",
		"INVALID_REQUEST",
		"MAX_ELEMENTS_EXCEEDED",
		"MAX_DIMENSIONS_EXCEEDED",
		"OVER_DAILY_LIMIT",
		"OVER_QUERY_LIMIT",
		"REQUEST_DENIED",
		"UNKNOWN_ERROR",
	]),
	originAddresses: z.array(z.string()),
	destinationAddresses: z.array(z.string()),
	rows: z.array(DistanceMatrixRowSchema),
});

export type DistanceMatrixElement = z.infer<typeof DistanceMatrixElementSchema>;
export type DistanceMatrixRow = z.infer<typeof DistanceMatrixRowSchema>;
export type DistanceMatrixResponse = z.infer<
	typeof DistanceMatrixResponseSchema
>;

/**
 * Travel mode options
 */
export type TravelMode = "driving" | "walking" | "bicycling" | "transit";

/**
 * Traffic model for duration_in_traffic
 */
export type TrafficModel = "best_guess" | "pessimistic" | "optimistic";

/**
 * Transit routing preference
 */
export type TransitRoutingPreference = "less_walking" | "fewer_transfers";

/**
 * Location input (can be address string or coordinates)
 */
export interface Location {
	address?: string;
	latitude?: number;
	longitude?: number;
	placeId?: string;
}

/**
 * Options for distance matrix request
 */
export interface DistanceMatrixOptions {
	mode?: TravelMode;
	departureTime?: Date | "now";
	arrivalTime?: Date;
	trafficModel?: TrafficModel;
	avoidTolls?: boolean;
	avoidHighways?: boolean;
	avoidFerries?: boolean;
	avoidIndoor?: boolean;
	units?: "metric" | "imperial";
	transitMode?: ("bus" | "subway" | "train" | "tram" | "rail")[];
	transitRoutingPreference?: TransitRoutingPreference;
	region?: string;
	language?: string;
}

/**
 * Processed distance result for a single origin-destination pair
 */
export interface DistanceResult {
	originIndex: number;
	destinationIndex: number;
	originAddress: string;
	destinationAddress: string;
	distanceMeters: number;
	distanceText: string;
	durationSeconds: number;
	durationText: string;
	durationInTrafficSeconds?: number;
	durationInTrafficText?: string;
	status: string;
}

/**
 * Full matrix result
 */
export interface DistanceMatrixResult {
	origins: string[];
	destinations: string[];
	matrix: DistanceResult[][];
	totalElements: number;
	fetchedAt: Date;
}

/**
 * Nearest destination result
 */
export interface NearestDestination {
	destinationIndex: number;
	destinationAddress: string;
	distanceMeters: number;
	distanceText: string;
	durationSeconds: number;
	durationText: string;
	durationInTrafficSeconds?: number;
}

const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes (traffic changes frequently)
const MAX_ELEMENTS_PER_REQUEST = 100; // Google limit: 25 origins * 25 destinations max, total elements max 100

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
class GoogleDistanceMatrixService {
	private readonly apiKey: string | undefined;
	private readonly cache: Map<
		string,
		{ data: DistanceMatrixResult; timestamp: number }
	> = new Map();
	private readonly cacheTTL = CACHE_TTL_MS;

	constructor() {
		this.apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
	}

	/**
	 * Format a location for the API request
	 */
	private formatLocation(location: Location): string {
		if (location.placeId) {
			return `place_id:${location.placeId}`;
		}
		if (location.latitude !== undefined && location.longitude !== undefined) {
			return `${location.latitude},${location.longitude}`;
		}
		if (location.address) {
			return location.address;
		}
		throw new Error("Location must have address, coordinates, or placeId");
	}

	/**
	 * Generate cache key from request parameters
	 */
	private generateCacheKey(
		origins: Location[],
		destinations: Location[],
		options: DistanceMatrixOptions = {},
	): string {
		const originStr = origins.map((o) => this.formatLocation(o)).join("|");
		const destStr = destinations.map((d) => this.formatLocation(d)).join("|");
		return `dm:${originStr}:${destStr}:${options.mode || "driving"}:${options.trafficModel || ""}`;
	}

	/**
	 * Get distance matrix between multiple origins and destinations
	 */
	async getDistanceMatrix(
		origins: Location[],
		destinations: Location[],
		options: DistanceMatrixOptions = {},
	): Promise<DistanceMatrixResult | null> {
		if (!this.apiKey) {
			console.warn("Google Distance Matrix API key not configured");
			return null;
		}

		if (origins.length === 0 || destinations.length === 0) {
			return null;
		}

		// Check element limit
		const totalElements = origins.length * destinations.length;
		if (totalElements > MAX_ELEMENTS_PER_REQUEST) {
			console.warn(
				`Distance matrix request exceeds ${MAX_ELEMENTS_PER_REQUEST} elements. Consider batching.`,
			);
			// Could implement batching here, but for now just warn
		}

		// Check cache
		const cacheKey = this.generateCacheKey(origins, destinations, options);
		const cached = this.cache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		try {
			const params = new URLSearchParams({
				key: this.apiKey,
				origins: origins.map((o) => this.formatLocation(o)).join("|"),
				destinations: destinations.map((d) => this.formatLocation(d)).join("|"),
			});

			// Travel mode
			if (options.mode) {
				params.set("mode", options.mode);
			}

			// Departure time (required for traffic info)
			if (options.departureTime) {
				const timestamp =
					options.departureTime === "now"
						? Math.floor(Date.now() / 1000)
						: Math.floor(options.departureTime.getTime() / 1000);
				params.set("departure_time", String(timestamp));
			}

			// Arrival time (for transit)
			if (options.arrivalTime) {
				params.set(
					"arrival_time",
					String(Math.floor(options.arrivalTime.getTime() / 1000)),
				);
			}

			// Traffic model
			if (options.trafficModel) {
				params.set("traffic_model", options.trafficModel);
			}

			// Avoidances
			const avoid: string[] = [];
			if (options.avoidTolls) avoid.push("tolls");
			if (options.avoidHighways) avoid.push("highways");
			if (options.avoidFerries) avoid.push("ferries");
			if (options.avoidIndoor) avoid.push("indoor");
			if (avoid.length > 0) {
				params.set("avoid", avoid.join("|"));
			}

			// Units
			if (options.units) {
				params.set("units", options.units);
			}

			// Transit options
			if (options.transitMode && options.transitMode.length > 0) {
				params.set("transit_mode", options.transitMode.join("|"));
			}
			if (options.transitRoutingPreference) {
				params.set(
					"transit_routing_preference",
					options.transitRoutingPreference,
				);
			}

			// Region bias
			if (options.region) {
				params.set("region", options.region);
			}

			// Language
			if (options.language) {
				params.set("language", options.language);
			}

			const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("Distance Matrix API error:", response.status);
				return null;
			}

			const data = await response.json();

			if (data.status !== "OK") {
				console.error(
					"Distance Matrix API status:",
					data.status,
					data.error_message,
				);
				return null;
			}

			// Process response into structured format
			const matrix: DistanceResult[][] = [];

			for (let i = 0; i < data.rows.length; i++) {
				const row: DistanceResult[] = [];
				for (let j = 0; j < data.rows[i].elements.length; j++) {
					const element = data.rows[i].elements[j];
					row.push({
						originIndex: i,
						destinationIndex: j,
						originAddress: data.origin_addresses[i],
						destinationAddress: data.destination_addresses[j],
						distanceMeters: element.distance?.value || 0,
						distanceText: element.distance?.text || "",
						durationSeconds: element.duration?.value || 0,
						durationText: element.duration?.text || "",
						durationInTrafficSeconds: element.duration_in_traffic?.value,
						durationInTrafficText: element.duration_in_traffic?.text,
						status: element.status,
					});
				}
				matrix.push(row);
			}

			const result: DistanceMatrixResult = {
				origins: data.origin_addresses,
				destinations: data.destination_addresses,
				matrix,
				totalElements: origins.length * destinations.length,
				fetchedAt: new Date(),
			};

			// Cache result
			this.cache.set(cacheKey, { data: result, timestamp: Date.now() });

			return result;
		} catch (error) {
			console.error("Distance Matrix API error:", error);
			return null;
		}
	}

	/**
	 * Get distance between two points (single origin, single destination)
	 */
	async getDistance(
		origin: Location,
		destination: Location,
		options: DistanceMatrixOptions = {},
	): Promise<DistanceResult | null> {
		const result = await this.getDistanceMatrix(
			[origin],
			[destination],
			options,
		);
		if (
			!result ||
			result.matrix.length === 0 ||
			result.matrix[0].length === 0
		) {
			return null;
		}
		return result.matrix[0][0];
	}

	/**
	 * Get travel time between two points with traffic
	 */
	async getTravelTime(
		origin: Location,
		destination: Location,
		departureTime: Date | "now" = "now",
	): Promise<{
		seconds: number;
		text: string;
		withTrafficSeconds?: number;
		withTrafficText?: string;
	} | null> {
		const result = await this.getDistance(origin, destination, {
			mode: "driving",
			departureTime,
			trafficModel: "best_guess",
		});

		if (!result || result.status !== "OK") {
			return null;
		}

		return {
			seconds: result.durationSeconds,
			text: result.durationText,
			withTrafficSeconds: result.durationInTrafficSeconds,
			withTrafficText: result.durationInTrafficText,
		};
	}

	/**
	 * Find the nearest destination from an origin
	 */
	async findNearestDestination(
		origin: Location,
		destinations: Location[],
		options: DistanceMatrixOptions = {},
	): Promise<NearestDestination | null> {
		if (destinations.length === 0) {
			return null;
		}

		const result = await this.getDistanceMatrix(
			[origin],
			destinations,
			options,
		);
		if (!result || result.matrix.length === 0) {
			return null;
		}

		const row = result.matrix[0];
		let nearest: NearestDestination | null = null;

		for (const element of row) {
			if (element.status !== "OK") continue;

			if (!nearest || element.durationSeconds < nearest.durationSeconds) {
				nearest = {
					destinationIndex: element.destinationIndex,
					destinationAddress: element.destinationAddress,
					distanceMeters: element.distanceMeters,
					distanceText: element.distanceText,
					durationSeconds: element.durationSeconds,
					durationText: element.durationText,
					durationInTrafficSeconds: element.durationInTrafficSeconds,
				};
			}
		}

		return nearest;
	}

	/**
	 * Find the nearest origin to a destination (useful for finding closest technician)
	 */
	async findNearestOrigin(
		origins: Location[],
		destination: Location,
		options: DistanceMatrixOptions = {},
	): Promise<{
		originIndex: number;
		originAddress: string;
		distanceMeters: number;
		durationSeconds: number;
	} | null> {
		if (origins.length === 0) {
			return null;
		}

		const result = await this.getDistanceMatrix(
			origins,
			[destination],
			options,
		);
		if (!result || result.matrix.length === 0) {
			return null;
		}

		let nearestIndex = -1;
		let nearestDuration = Number.POSITIVE_INFINITY;
		let nearestDistance = 0;
		let nearestAddress = "";

		for (let i = 0; i < result.matrix.length; i++) {
			const element = result.matrix[i][0];
			if (element.status !== "OK") continue;

			const duration =
				element.durationInTrafficSeconds || element.durationSeconds;
			if (duration < nearestDuration) {
				nearestIndex = i;
				nearestDuration = duration;
				nearestDistance = element.distanceMeters;
				nearestAddress = element.originAddress;
			}
		}

		if (nearestIndex === -1) {
			return null;
		}

		return {
			originIndex: nearestIndex,
			originAddress: nearestAddress,
			distanceMeters: nearestDistance,
			durationSeconds: nearestDuration,
		};
	}

	/**
	 * Calculate ETA from current location to destination
	 */
	async calculateETA(
		currentLocation: Location,
		destination: Location,
		options: Omit<DistanceMatrixOptions, "departureTime"> = {},
	): Promise<{
		eta: Date;
		durationSeconds: number;
		durationText: string;
		distanceText: string;
	} | null> {
		const result = await this.getDistance(currentLocation, destination, {
			...options,
			mode: options.mode || "driving",
			departureTime: "now",
			trafficModel: "best_guess",
		});

		if (!result || result.status !== "OK") {
			return null;
		}

		const durationSeconds =
			result.durationInTrafficSeconds || result.durationSeconds;
		const eta = new Date(Date.now() + durationSeconds * 1000);

		return {
			eta,
			durationSeconds,
			durationText: result.durationInTrafficText || result.durationText,
			distanceText: result.distanceText,
		};
	}

	/**
	 * Rank destinations by travel time from origin
	 */
	async rankDestinationsByTime(
		origin: Location,
		destinations: Location[],
		options: DistanceMatrixOptions = {},
	): Promise<
		Array<{
			index: number;
			address: string;
			durationSeconds: number;
			distanceMeters: number;
		}>
	> {
		if (destinations.length === 0) {
			return [];
		}

		const result = await this.getDistanceMatrix(
			[origin],
			destinations,
			options,
		);
		if (!result || result.matrix.length === 0) {
			return [];
		}

		const ranked = result.matrix[0]
			.filter((e) => e.status === "OK")
			.map((e) => ({
				index: e.destinationIndex,
				address: e.destinationAddress,
				durationSeconds: e.durationInTrafficSeconds || e.durationSeconds,
				distanceMeters: e.distanceMeters,
			}))
			.sort((a, b) => a.durationSeconds - b.durationSeconds);

		return ranked;
	}

	/**
	 * Get full distance matrix for technician-to-job assignment
	 * Useful for dispatch planning
	 */
	async getTechnicianJobMatrix(
		technicians: Array<{ id: string; location: Location }>,
		jobs: Array<{ id: string; location: Location }>,
		options: DistanceMatrixOptions = {},
	): Promise<{
		technicianIds: string[];
		jobIds: string[];
		matrix: number[][];
		durations: number[][];
	} | null> {
		if (technicians.length === 0 || jobs.length === 0) {
			return null;
		}

		const result = await this.getDistanceMatrix(
			technicians.map((t) => t.location),
			jobs.map((j) => j.location),
			{
				...options,
				mode: options.mode || "driving",
				departureTime: options.departureTime || "now",
			},
		);

		if (!result) {
			return null;
		}

		const distances: number[][] = [];
		const durations: number[][] = [];

		for (const row of result.matrix) {
			distances.push(row.map((e) => e.distanceMeters));
			durations.push(
				row.map((e) => e.durationInTrafficSeconds || e.durationSeconds),
			);
		}

		return {
			technicianIds: technicians.map((t) => t.id),
			jobIds: jobs.map((j) => j.id),
			matrix: distances,
			durations,
		};
	}

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Clear cache
	 */
	clearCache(): void {
		this.cache.clear();
	}

	/**
	 * Get cache statistics
	 */
	getCacheStats(): { size: number; ttlMs: number } {
		return {
			size: this.cache.size,
			ttlMs: this.cacheTTL,
		};
	}
}

export const googleDistanceMatrixService = new GoogleDistanceMatrixService();
