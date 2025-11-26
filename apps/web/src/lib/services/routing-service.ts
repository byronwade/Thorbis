/**
 * Routing Service
 *
 * Provides travel time calculations and nearby supplier lookups
 * - OpenRouteService for drive times and distances
 * - Overpass API (OSM) for nearby hardware/plumbing suppliers
 *
 * Use cases:
 * - Tech-to-job ETA calculation
 * - Batch job routing optimization
 * - Emergency parts run planning
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

// Overpass API instances (fallback if one is rate-limited)
const OVERPASS_INSTANCES = [
	"https://overpass-api.de/api/interpreter",
	"https://overpass.kumi.systems/api/interpreter",
	"https://overpass.openstreetmap.ru/api/interpreter",
] as const;

// Rate limiting configuration for Overpass API
const OVERPASS_RATE_LIMIT = {
	maxRequests: 2, // Conservative limit per window
	windowMs: 60 * 1000, // 1 minute window
};

// Cache configuration
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache for supplier data

// ============================================================================
// Types and Schemas
// ============================================================================

const RouteSchema = z.object({
	distance: z.number(), // meters
	duration: z.number(), // seconds
	from: z.object({
		lat: z.number(),
		lon: z.number(),
	}),
	to: z.object({
		lat: z.number(),
		lon: z.number(),
	}),
});

const NearbySupplierSchema = z.object({
	id: z.number(),
	name: z.string().optional(),
	lat: z.number(),
	lon: z.number(),
	type: z.string(),
	distance: z.number().optional(), // meters from reference point
});

export type Route = z.infer<typeof RouteSchema>;
export type NearbySupplier = z.infer<typeof NearbySupplierSchema>;

// ============================================================================
// Routing Service
// ============================================================================

class RoutingService {
	private readonly orsApiKey: string | undefined;
	private overpassCache: Map<
		string,
		{ data: NearbySupplier[]; timestamp: number }
	>;
	private overpassRequestTimestamps: number[] = [];
	private currentOverpassInstanceIndex = 0;

	constructor() {
		this.orsApiKey = process.env.ORS_API_KEY;
		this.overpassCache = new Map();
	}

	/**
	 * Calculate route between two points
	 */
	async getRoute(
		from: { lat: number; lon: number },
		to: { lat: number; lon: number },
	): Promise<Route | null> {
		if (!this.orsApiKey) {
			return this.getStraightLineRoute(from, to);
		}

		try {
			const res = await fetch(
				"https://api.openrouteservice.org/v2/directions/driving-car",
				{
					method: "POST",
					headers: {
						Authorization: this.orsApiKey,
						"Content-Type": "application/json",
						"User-Agent": USER_AGENT,
					},
					body: JSON.stringify({
						coordinates: [
							[from.lon, from.lat],
							[to.lon, to.lat],
						],
						preference: "fastest",
					}),
				},
			);

			if (!res.ok) {
				return this.getStraightLineRoute(from, to);
			}

			const data = await res.json();
			const route = data.routes?.[0];

			if (!route) {
				return this.getStraightLineRoute(from, to);
			}

			return {
				distance: route.summary.distance,
				duration: route.summary.duration,
				from,
				to,
			};
		} catch (_error) {
			return this.getStraightLineRoute(from, to);
		}
	}

	/**
	 * Calculate routes from one point to multiple destinations (matrix)
	 */
	async getRouteMatrix(
		origins: Array<{ lat: number; lon: number }>,
		destinations: Array<{ lat: number; lon: number }>,
	): Promise<{
		durations: number[][]; // seconds
		distances: number[][]; // meters
	} | null> {
		if (!this.orsApiKey) {
			return null;
		}

		try {
			// Convert to ORS format [lon, lat]
			const locations = [
				...origins.map((p) => [p.lon, p.lat]),
				...destinations.map((p) => [p.lon, p.lat]),
			];

			const sources = origins.map((_, i) => i);
			const dests = destinations.map((_, i) => origins.length + i);

			const res = await fetch(
				"https://api.openrouteservice.org/v2/matrix/driving-car",
				{
					method: "POST",
					headers: {
						Authorization: this.orsApiKey,
						"Content-Type": "application/json",
						"User-Agent": USER_AGENT,
					},
					body: JSON.stringify({
						locations,
						sources,
						destinations: dests,
						metrics: ["duration", "distance"],
					}),
				},
			);

			if (!res.ok) {
				return null;
			}

			const data = await res.json();

			return {
				durations: data.durations || [],
				distances: data.distances || [],
			};
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Check if we can make an Overpass API request (rate limiting)
	 */
	private canMakeOverpassRequest(): boolean {
		const now = Date.now();
		// Remove timestamps outside the window
		this.overpassRequestTimestamps = this.overpassRequestTimestamps.filter(
			(timestamp) => timestamp > now - OVERPASS_RATE_LIMIT.windowMs,
		);

		// Check if we're within the rate limit
		return (
			this.overpassRequestTimestamps.length < OVERPASS_RATE_LIMIT.maxRequests
		);
	}

	/**
	 * Record an Overpass API request
	 */
	private recordOverpassRequest(): void {
		this.overpassRequestTimestamps.push(Date.now());
	}

	/**
	 * Wait until we can make a request (rate limiting)
	 */
	private async waitForRateLimit(): Promise<void> {
		if (this.canMakeOverpassRequest()) {
			return;
		}

		// Calculate wait time based on oldest request in window
		if (this.overpassRequestTimestamps.length === 0) {
			return; // No requests recorded, safe to proceed
		}

		const oldestRequest = Math.min(...this.overpassRequestTimestamps);
		const waitTime =
			oldestRequest + OVERPASS_RATE_LIMIT.windowMs - Date.now() + 1000; // Add 1s buffer

		if (waitTime > 0) {
			await new Promise((resolve) => setTimeout(resolve, waitTime));
		}
	}

	/**
	 * Make Overpass API request with retry logic
	 */
	private async makeOverpassRequest(
		query: string,
		maxRetries = 3,
	): Promise<Response> {
		let lastError: Error | undefined;

		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			// Wait for rate limit before each attempt
			await this.waitForRateLimit();

			// Try each instance in round-robin fashion
			const instanceIndex =
				(this.currentOverpassInstanceIndex + attempt) %
				OVERPASS_INSTANCES.length;
			const instanceUrl = OVERPASS_INSTANCES[instanceIndex];

			try {
				// Record the request attempt
				this.recordOverpassRequest();

				const res = await fetch(instanceUrl, {
					method: "POST",
					headers: {
						"Content-Type": "text/plain",
						"User-Agent": USER_AGENT,
					},
					body: query,
				});

				// Handle rate limiting (429)
				if (res.status === 429) {
					const retryAfter = res.headers.get("Retry-After");
					const waitTime = retryAfter
						? Number.parseInt(retryAfter, 10) * 1000
						: 2 ** attempt * 1000; // Exponential backoff

					if (attempt < maxRetries) {
						await new Promise((resolve) => setTimeout(resolve, waitTime));
						// Switch to next instance for next attempt
						this.currentOverpassInstanceIndex =
							(instanceIndex + 1) % OVERPASS_INSTANCES.length;
						continue;
					}
				}

				// Handle other errors
				if (!res.ok) {
					throw new Error(
						`Overpass API returned ${res.status} from ${instanceUrl}`,
					);
				}

				// Success - update instance index for next request
				this.currentOverpassInstanceIndex =
					(instanceIndex + 1) % OVERPASS_INSTANCES.length;
				return res;
			} catch (error) {
				lastError = error instanceof Error ? error : new Error(String(error));

				if (attempt < maxRetries) {
					// Exponential backoff for other errors
					const waitTime = 2 ** attempt * 1000;
					await new Promise((resolve) => setTimeout(resolve, waitTime));
					// Try next instance
					this.currentOverpassInstanceIndex =
						(instanceIndex + 1) % OVERPASS_INSTANCES.length;
				}
			}
		}

		throw lastError || new Error("Max retries exceeded for Overpass API");
	}

	/**
	 * Find nearby hardware/plumbing suppliers
	 */
	async findNearbySuppliers(
		lat: number,
		lon: number,
		radiusMeters = 8000,
	): Promise<NearbySupplier[]> {
		// Create cache key based on location and radius
		const cacheKey = `${lat.toFixed(4)}_${lon.toFixed(4)}_${radiusMeters}`;

		// Check cache first
		const cached = this.overpassCache.get(cacheKey);
		if (cached) {
			const age = Date.now() - cached.timestamp;
			if (age < CACHE_TTL) {
				return cached.data;
			}
		}

		try {
			// Overpass query for hardware stores, DIY stores, and plumbing suppliers
			const query = `
        [out:json][timeout:25];
        (
          node(around:${radiusMeters},${lat},${lon})["shop"="hardware"];
          node(around:${radiusMeters},${lat},${lon})["shop"="doityourself"];
          node(around:${radiusMeters},${lat},${lon})["shop"="trade"]["trade"="plumbing"];
          way(around:${radiusMeters},${lat},${lon})["shop"="hardware"];
          way(around:${radiusMeters},${lat},${lon})["shop"="doityourself"];
        );
        out center 30;
      `.trim();

			const res = await this.makeOverpassRequest(query);

			const data = await res.json();
			const elements = data.elements || [];

			const suppliers: NearbySupplier[] = elements
				.map((e: any) => {
					const supplierLat = e.lat ?? e.center?.lat;
					const supplierLon = e.lon ?? e.center?.lon;

					if (!(supplierLat && supplierLon)) {
						return null;
					}

					const distance = this.calculateDistance(
						lat,
						lon,
						supplierLat,
						supplierLon,
					);

					return {
						id: e.id,
						name: e.tags?.name || "Unknown Supplier",
						lat: supplierLat,
						lon: supplierLon,
						type: e.tags?.shop || e.tags?.trade || "hardware",
						distance,
					};
				})
				.filter((s: any) => s !== null)
				.sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0))
				.slice(0, 10); // Top 10 closest

			const parsedSuppliers = suppliers.map((s) =>
				NearbySupplierSchema.parse(s),
			);

			// Cache the result
			this.overpassCache.set(cacheKey, {
				data: parsedSuppliers,
				timestamp: Date.now(),
			});

			// Clean up old cache entries (keep last 100)
			if (this.overpassCache.size > 100) {
				const entries = Array.from(this.overpassCache.entries());
				entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
				this.overpassCache = new Map(entries.slice(0, 100));
			}

			return parsedSuppliers;
		} catch (_error) {
			// Return cached data if available, even if expired
			if (cached) {
				return cached.data;
			}

			return [];
		}
	}

	/**
	 * Calculate straight-line distance (fallback when routing not available)
	 */
	private getStraightLineRoute(
		from: { lat: number; lon: number },
		to: { lat: number; lon: number },
	): Route {
		const distance = this.calculateDistance(from.lat, from.lon, to.lat, to.lon);
		// Rough estimate: 40 km/h average speed in city
		const duration = (distance / 40_000) * 3600;

		return {
			distance,
			duration,
			from,
			to,
		};
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
		const R = 6371e3; // Earth radius in meters
		const φ1 = (lat1 * Math.PI) / 180;
		const φ2 = (lat2 * Math.PI) / 180;
		const Δφ = ((lat2 - lat1) * Math.PI) / 180;
		const Δλ = ((lon2 - lon1) * Math.PI) / 180;

		const a =
			Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
			Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c; // Distance in meters
	}

	/**
	 * Format duration in human-readable form
	 */
	formatDuration(seconds: number): string {
		if (seconds < 60) {
			return `${Math.round(seconds)}s`;
		}
		if (seconds < 3600) {
			return `${Math.round(seconds / 60)}min`;
		}
		const hours = Math.floor(seconds / 3600);
		const mins = Math.round((seconds % 3600) / 60);
		return `${hours}h ${mins}min`;
	}

	/**
	 * Format distance in human-readable form
	 */
	formatDistance(meters: number): string {
		if (meters < 1000) {
			return `${Math.round(meters)}m`;
		}
		return `${(meters / 1000).toFixed(1)}km`;
	}
}

// Singleton instance
export const routingService = new RoutingService();
