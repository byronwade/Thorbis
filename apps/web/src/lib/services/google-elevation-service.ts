/**
 * Google Elevation Service
 *
 * Gets elevation data for locations and paths.
 * - Point elevation lookup
 * - Path elevation profiles
 * - Useful for roofing, drainage, solar panel planning
 *
 * API: Google Elevation API
 * Free Tier: $200/month credit = ~40,000 requests
 * Docs: https://developers.google.com/maps/documentation/elevation
 */

import { z } from "zod";

const USER_AGENT = "Stratos-FMS/1.0 (support@stratos.app)";

/**
 * Elevation result schema
 */
const ElevationResultSchema = z.object({
	elevation: z.number(), // meters above sea level
	location: z.object({
		lat: z.number(),
		lng: z.number(),
	}),
	resolution: z.number(), // meters (data resolution)
});

export type ElevationResult = z.infer<typeof ElevationResultSchema>;

/**
 * Location input
 */
export interface ElevationLocation {
	latitude: number;
	longitude: number;
}

/**
 * Elevation point with additional context
 */
export interface ElevationPoint {
	latitude: number;
	longitude: number;
	elevationMeters: number;
	elevationFeet: number;
	resolutionMeters: number;
}

/**
 * Path elevation profile
 */
export interface ElevationProfile {
	points: ElevationPoint[];
	minElevation: ElevationPoint;
	maxElevation: ElevationPoint;
	totalAscentMeters: number;
	totalDescentMeters: number;
	elevationGainMeters: number;
	averageElevationMeters: number;
	distanceMeters?: number;
}

/**
 * Property elevation analysis
 */
export interface PropertyElevationAnalysis {
	propertyElevation: ElevationPoint;
	surroundingElevations: ElevationPoint[];
	averageSurroundingElevation: number;
	relativeElevation: number; // difference from surrounding average
	isHighPoint: boolean;
	isLowPoint: boolean;
	drainageDirection?: "north" | "south" | "east" | "west" | "flat";
	slopePercent?: number;
}

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 365; // 1 year (elevation rarely changes)
const MAX_LOCATIONS_PER_REQUEST = 512;

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
class GoogleElevationService {
	private readonly apiKey: string | undefined;
	private readonly cache: Map<
		string,
		{ data: ElevationPoint; timestamp: number }
	> = new Map();
	private readonly cacheTTL = CACHE_TTL_MS;

	constructor() {
		this.apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
	}

	/**
	 * Generate cache key for a location
	 */
	private generateCacheKey(lat: number, lng: number): string {
		// Round to 5 decimal places (~1m precision)
		return `elev:${lat.toFixed(5)},${lng.toFixed(5)}`;
	}

	/**
	 * Convert meters to feet
	 */
	private metersToFeet(meters: number): number {
		return meters * 3.28084;
	}

	/**
	 * Get elevation for a single point
	 */
	async getElevation(
		location: ElevationLocation,
	): Promise<ElevationPoint | null> {
		if (!this.apiKey) {
			console.warn("Google Elevation API key not configured");
			return null;
		}

		const cacheKey = this.generateCacheKey(
			location.latitude,
			location.longitude,
		);
		const cached = this.cache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		try {
			const params = new URLSearchParams({
				locations: `${location.latitude},${location.longitude}`,
				key: this.apiKey,
			});

			const url = `https://maps.googleapis.com/maps/api/elevation/json?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("Elevation API error:", response.status);
				return null;
			}

			const data = await response.json();

			if (data.status !== "OK") {
				console.error("Elevation API status:", data.status, data.error_message);
				return null;
			}

			if (!data.results || data.results.length === 0) {
				return null;
			}

			const result = data.results[0];
			const point: ElevationPoint = {
				latitude: result.location.lat,
				longitude: result.location.lng,
				elevationMeters: result.elevation,
				elevationFeet: this.metersToFeet(result.elevation),
				resolutionMeters: result.resolution,
			};

			this.cache.set(cacheKey, { data: point, timestamp: Date.now() });

			return point;
		} catch (error) {
			console.error("Elevation API error:", error);
			return null;
		}
	}

	/**
	 * Get elevations for multiple points
	 */
	async getElevations(
		locations: ElevationLocation[],
	): Promise<ElevationPoint[] | null> {
		if (!this.apiKey) {
			console.warn("Google Elevation API key not configured");
			return null;
		}

		if (locations.length === 0) {
			return [];
		}

		if (locations.length > MAX_LOCATIONS_PER_REQUEST) {
			// Batch the requests
			const results: ElevationPoint[] = [];
			for (let i = 0; i < locations.length; i += MAX_LOCATIONS_PER_REQUEST) {
				const batch = locations.slice(i, i + MAX_LOCATIONS_PER_REQUEST);
				const batchResults = await this.getElevations(batch);
				if (batchResults) {
					results.push(...batchResults);
				}
			}
			return results;
		}

		// Check cache for all locations
		const cachedResults: (ElevationPoint | null)[] = [];
		const uncachedLocations: { index: number; location: ElevationLocation }[] =
			[];

		for (let i = 0; i < locations.length; i++) {
			const cacheKey = this.generateCacheKey(
				locations[i].latitude,
				locations[i].longitude,
			);
			const cached = this.cache.get(cacheKey);
			if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
				cachedResults[i] = cached.data;
			} else {
				cachedResults[i] = null;
				uncachedLocations.push({ index: i, location: locations[i] });
			}
		}

		// If all cached, return cached results
		if (uncachedLocations.length === 0) {
			return cachedResults as ElevationPoint[];
		}

		try {
			const locationsStr = uncachedLocations
				.map(({ location }) => `${location.latitude},${location.longitude}`)
				.join("|");

			const params = new URLSearchParams({
				locations: locationsStr,
				key: this.apiKey,
			});

			const url = `https://maps.googleapis.com/maps/api/elevation/json?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("Elevation API error:", response.status);
				return null;
			}

			const data = await response.json();

			if (data.status !== "OK") {
				console.error("Elevation API status:", data.status, data.error_message);
				return null;
			}

			// Merge results
			for (let i = 0; i < data.results.length; i++) {
				const result = data.results[i];
				const originalIndex = uncachedLocations[i].index;
				const point: ElevationPoint = {
					latitude: result.location.lat,
					longitude: result.location.lng,
					elevationMeters: result.elevation,
					elevationFeet: this.metersToFeet(result.elevation),
					resolutionMeters: result.resolution,
				};
				cachedResults[originalIndex] = point;

				// Cache the result
				const cacheKey = this.generateCacheKey(point.latitude, point.longitude);
				this.cache.set(cacheKey, { data: point, timestamp: Date.now() });
			}

			return cachedResults as ElevationPoint[];
		} catch (error) {
			console.error("Elevation API error:", error);
			return null;
		}
	}

	/**
	 * Get elevation profile along a path
	 */
	async getElevationProfile(
		path: ElevationLocation[],
		samples?: number,
	): Promise<ElevationProfile | null> {
		if (!this.apiKey || path.length < 2) {
			return null;
		}

		try {
			const pathStr = path
				.map((loc) => `${loc.latitude},${loc.longitude}`)
				.join("|");

			const params = new URLSearchParams({
				path: pathStr,
				key: this.apiKey,
			});

			if (samples) {
				params.set("samples", String(Math.min(samples, 512)));
			}

			const url = `https://maps.googleapis.com/maps/api/elevation/json?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("Elevation API error:", response.status);
				return null;
			}

			const data = await response.json();

			if (data.status !== "OK") {
				console.error("Elevation API status:", data.status, data.error_message);
				return null;
			}

			const points: ElevationPoint[] = data.results.map(
				(result: {
					location: { lat: number; lng: number };
					elevation: number;
					resolution: number;
				}) => ({
					latitude: result.location.lat,
					longitude: result.location.lng,
					elevationMeters: result.elevation,
					elevationFeet: this.metersToFeet(result.elevation),
					resolutionMeters: result.resolution,
				}),
			);

			// Calculate profile statistics
			let minPoint = points[0];
			let maxPoint = points[0];
			let totalAscent = 0;
			let totalDescent = 0;
			let totalElevation = 0;

			for (let i = 0; i < points.length; i++) {
				const point = points[i];
				totalElevation += point.elevationMeters;

				if (point.elevationMeters < minPoint.elevationMeters) {
					minPoint = point;
				}
				if (point.elevationMeters > maxPoint.elevationMeters) {
					maxPoint = point;
				}

				if (i > 0) {
					const diff = point.elevationMeters - points[i - 1].elevationMeters;
					if (diff > 0) {
						totalAscent += diff;
					} else {
						totalDescent += Math.abs(diff);
					}
				}
			}

			return {
				points,
				minElevation: minPoint,
				maxElevation: maxPoint,
				totalAscentMeters: totalAscent,
				totalDescentMeters: totalDescent,
				elevationGainMeters:
					maxPoint.elevationMeters - minPoint.elevationMeters,
				averageElevationMeters: totalElevation / points.length,
			};
		} catch (error) {
			console.error("Elevation profile error:", error);
			return null;
		}
	}

	/**
	 * Analyze property elevation relative to surroundings
	 * Useful for drainage assessment
	 */
	async analyzePropertyElevation(
		propertyLocation: ElevationLocation,
		radiusMeters: number = 50,
	): Promise<PropertyElevationAnalysis | null> {
		// Get property elevation
		const propertyElevation = await this.getElevation(propertyLocation);
		if (!propertyElevation) {
			return null;
		}

		// Generate surrounding points (8 cardinal/ordinal directions)
		const surroundingLocations: ElevationLocation[] = [];
		const latOffset = radiusMeters / 111000; // ~111km per degree latitude
		const lngOffset =
			radiusMeters /
			(111000 * Math.cos((propertyLocation.latitude * Math.PI) / 180));

		const directions = [
			{ lat: latOffset, lng: 0, name: "north" },
			{ lat: -latOffset, lng: 0, name: "south" },
			{ lat: 0, lng: lngOffset, name: "east" },
			{ lat: 0, lng: -lngOffset, name: "west" },
			{ lat: latOffset, lng: lngOffset, name: "northeast" },
			{ lat: latOffset, lng: -lngOffset, name: "northwest" },
			{ lat: -latOffset, lng: lngOffset, name: "southeast" },
			{ lat: -latOffset, lng: -lngOffset, name: "southwest" },
		];

		for (const dir of directions) {
			surroundingLocations.push({
				latitude: propertyLocation.latitude + dir.lat,
				longitude: propertyLocation.longitude + dir.lng,
			});
		}

		const surroundingElevations =
			await this.getElevations(surroundingLocations);
		if (!surroundingElevations) {
			return null;
		}

		// Calculate statistics
		const avgSurrounding =
			surroundingElevations.reduce((sum, e) => sum + e.elevationMeters, 0) /
			surroundingElevations.length;
		const relativeElevation =
			propertyElevation.elevationMeters - avgSurrounding;
		const isHighPoint = relativeElevation > 1; // More than 1m above average
		const isLowPoint = relativeElevation < -1; // More than 1m below average

		// Determine drainage direction (direction of steepest descent)
		let lowestDirection: string | undefined;
		let lowestElevation = propertyElevation.elevationMeters;

		for (let i = 0; i < surroundingElevations.length; i++) {
			if (surroundingElevations[i].elevationMeters < lowestElevation) {
				lowestElevation = surroundingElevations[i].elevationMeters;
				lowestDirection = directions[i].name;
			}
		}

		// Calculate slope (using north-south and east-west differences)
		const northElevation = surroundingElevations[0].elevationMeters;
		const southElevation = surroundingElevations[1].elevationMeters;
		const maxDiff = Math.max(
			Math.abs(northElevation - southElevation),
			Math.abs(
				surroundingElevations[2].elevationMeters -
					surroundingElevations[3].elevationMeters,
			),
		);
		const slopePercent = (maxDiff / (radiusMeters * 2)) * 100;

		return {
			propertyElevation,
			surroundingElevations,
			averageSurroundingElevation: avgSurrounding,
			relativeElevation,
			isHighPoint,
			isLowPoint,
			drainageDirection:
				Math.abs(relativeElevation) < 0.5
					? "flat"
					: (lowestDirection as
							| "north"
							| "south"
							| "east"
							| "west"
							| "flat"
							| undefined),
			slopePercent,
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
}

export const googleElevationService = new GoogleElevationService();
