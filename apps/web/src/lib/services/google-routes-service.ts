/**
 * Google Routes Service
 *
 * Provides routing, distance matrix, and ETA calculations using Google Routes API
 * - Real-time traffic-aware routing
 * - Multi-destination distance matrix
 * - Polyline encoding for map display
 * - ETA calculations with traffic
 *
 * API: Google Routes API (requires API key with Routes API enabled)
 * Docs: https://developers.google.com/maps/documentation/routes
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

// ============================================================================
// Types and Schemas
// ============================================================================

const LatLngSchema = z.object({
	lat: z.number(),
	lng: z.number(),
});

const RouteSchema = z.object({
	distance: z.number(), // meters
	duration: z.number(), // seconds (without traffic)
	durationInTraffic: z.number(), // seconds (with traffic)
	from: LatLngSchema,
	to: LatLngSchema,
	polyline: z.string().optional(), // Encoded polyline for map display
	summary: z.string().optional(), // Route summary (e.g., "via I-95 N")
	warnings: z.array(z.string()).optional(),
	trafficDelay: z.number(), // Additional seconds due to traffic
});

const RouteMatrixElementSchema = z.object({
	originIndex: z.number(),
	destinationIndex: z.number(),
	distance: z.number(), // meters
	duration: z.number(), // seconds
	durationInTraffic: z.number(), // seconds with traffic
	status: z.enum(["OK", "NOT_FOUND", "ZERO_RESULTS"]),
});

const RouteMatrixSchema = z.object({
	elements: z.array(RouteMatrixElementSchema),
	originAddresses: z.array(z.string()).optional(),
	destinationAddresses: z.array(z.string()).optional(),
});

const OptimizedRouteSchema = z.object({
	totalDistance: z.number(), // meters
	totalDuration: z.number(), // seconds
	totalDurationInTraffic: z.number(), // seconds with traffic
	optimizedOrder: z.array(z.number()), // Original indices in optimized order
	legs: z.array(
		z.object({
			from: LatLngSchema,
			to: LatLngSchema,
			distance: z.number(),
			duration: z.number(),
			durationInTraffic: z.number(),
			polyline: z.string().optional(),
		}),
	),
	polyline: z.string().optional(), // Full route polyline
});

export type LatLng = z.infer<typeof LatLngSchema>;
export type Route = z.infer<typeof RouteSchema>;
export type RouteMatrixElement = z.infer<typeof RouteMatrixElementSchema>;
export type RouteMatrix = z.infer<typeof RouteMatrixSchema>;
export type OptimizedRoute = z.infer<typeof OptimizedRouteSchema>;

// ============================================================================
// Cache Configuration
// ============================================================================

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes for route calculations
const MATRIX_CACHE_TTL = 10 * 60 * 1000; // 10 minutes for matrix calculations

// ============================================================================
// Google Routes Service
// ============================================================================

class GoogleRoutesService {
	private readonly apiKey: string | undefined;
	private readonly routeCache: Map<string, { data: Route; timestamp: number }> =
		new Map();
	private readonly matrixCache: Map<
		string,
		{ data: RouteMatrix; timestamp: number }
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
	 * Calculate route between two points with real-time traffic
	 */
	async getRoute(from: LatLng, to: LatLng): Promise<Route | null> {
		if (!this.apiKey) {
			console.warn("Google Routes Service: No API key configured");
			return this.getFallbackRoute(from, to);
		}

		const cacheKey = `route:${from.lat.toFixed(5)},${from.lng.toFixed(5)}-${to.lat.toFixed(5)},${to.lng.toFixed(5)}`;
		const cached = this.routeCache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			return cached.data;
		}

		try {
			// Use Google Directions API with traffic
			const url = new URL(
				"https://maps.googleapis.com/maps/api/directions/json",
			);
			url.searchParams.set("origin", `${from.lat},${from.lng}`);
			url.searchParams.set("destination", `${to.lat},${to.lng}`);
			url.searchParams.set("departure_time", "now");
			url.searchParams.set("traffic_model", "best_guess");
			url.searchParams.set("key", this.apiKey);

			const response = await fetch(url.toString(), {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error(
					`Google Routes API error: ${response.status} ${response.statusText}`,
				);
				return this.getFallbackRoute(from, to);
			}

			const data = await response.json();

			if (data.status !== "OK" || !data.routes?.[0]) {
				console.warn(`Google Routes API returned status: ${data.status}`);
				return this.getFallbackRoute(from, to);
			}

			const googleRoute = data.routes[0];
			const leg = googleRoute.legs[0];

			const duration = leg.duration?.value || 0;
			const durationInTraffic = leg.duration_in_traffic?.value || duration;

			const route: Route = {
				distance: leg.distance?.value || 0,
				duration,
				durationInTraffic,
				from,
				to,
				polyline: googleRoute.overview_polyline?.points,
				summary: googleRoute.summary,
				warnings: googleRoute.warnings || [],
				trafficDelay: Math.max(0, durationInTraffic - duration),
			};

			const validated = RouteSchema.parse(route);
			this.routeCache.set(cacheKey, { data: validated, timestamp: Date.now() });

			// Clean up old cache entries
			this.cleanCache(this.routeCache, CACHE_TTL);

			return validated;
		} catch (error) {
			console.error("Google Routes Service error:", error);
			return this.getFallbackRoute(from, to);
		}
	}

	/**
	 * Calculate routes from multiple origins to multiple destinations (matrix)
	 * More efficient than individual route requests when dealing with many points
	 */
	async getRouteMatrix(
		origins: LatLng[],
		destinations: LatLng[],
	): Promise<RouteMatrix | null> {
		if (!this.apiKey) {
			console.warn("Google Routes Service: No API key configured for matrix");
			return null;
		}

		if (origins.length === 0 || destinations.length === 0) {
			return null;
		}

		// Limit to avoid API limits (max 25 origins or 25 destinations)
		const limitedOrigins = origins.slice(0, 25);
		const limitedDestinations = destinations.slice(0, 25);

		const cacheKey = `matrix:${limitedOrigins.map((o) => `${o.lat.toFixed(4)},${o.lng.toFixed(4)}`).join("|")}-${limitedDestinations.map((d) => `${d.lat.toFixed(4)},${d.lng.toFixed(4)}`).join("|")}`;

		const cached = this.matrixCache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < MATRIX_CACHE_TTL) {
			return cached.data;
		}

		try {
			const url = new URL(
				"https://maps.googleapis.com/maps/api/distancematrix/json",
			);
			url.searchParams.set(
				"origins",
				limitedOrigins.map((o) => `${o.lat},${o.lng}`).join("|"),
			);
			url.searchParams.set(
				"destinations",
				limitedDestinations.map((d) => `${d.lat},${d.lng}`).join("|"),
			);
			url.searchParams.set("departure_time", "now");
			url.searchParams.set("traffic_model", "best_guess");
			url.searchParams.set("key", this.apiKey);

			const response = await fetch(url.toString(), {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error(
					`Google Distance Matrix API error: ${response.status} ${response.statusText}`,
				);
				return null;
			}

			const data = await response.json();

			if (data.status !== "OK") {
				console.warn(`Google Distance Matrix API status: ${data.status}`);
				return null;
			}

			const elements: RouteMatrixElement[] = [];

			for (let i = 0; i < data.rows.length; i++) {
				for (let j = 0; j < data.rows[i].elements.length; j++) {
					const element = data.rows[i].elements[j];
					const duration = element.duration?.value || 0;
					const durationInTraffic =
						element.duration_in_traffic?.value || duration;

					elements.push({
						originIndex: i,
						destinationIndex: j,
						distance: element.distance?.value || 0,
						duration,
						durationInTraffic,
						status:
							element.status === "OK"
								? "OK"
								: element.status === "ZERO_RESULTS"
									? "ZERO_RESULTS"
									: "NOT_FOUND",
					});
				}
			}

			const matrix: RouteMatrix = {
				elements,
				originAddresses: data.origin_addresses,
				destinationAddresses: data.destination_addresses,
			};

			const validated = RouteMatrixSchema.parse(matrix);
			this.matrixCache.set(cacheKey, {
				data: validated,
				timestamp: Date.now(),
			});

			// Clean up old cache entries
			this.cleanCache(this.matrixCache, MATRIX_CACHE_TTL);

			return validated;
		} catch (error) {
			console.error("Google Distance Matrix error:", error);
			return null;
		}
	}

	/**
	 * Get ETA from one location to another with traffic
	 */
	async getETA(
		from: LatLng,
		to: LatLng,
	): Promise<{
		eta: Date;
		durationMinutes: number;
		durationText: string;
		trafficDelayMinutes: number;
	} | null> {
		const route = await this.getRoute(from, to);
		if (!route) return null;

		const now = new Date();
		const eta = new Date(now.getTime() + route.durationInTraffic * 1000);
		const durationMinutes = Math.ceil(route.durationInTraffic / 60);
		const trafficDelayMinutes = Math.ceil(route.trafficDelay / 60);

		return {
			eta,
			durationMinutes,
			durationText: this.formatDuration(route.durationInTraffic),
			trafficDelayMinutes,
		};
	}

	/**
	 * Get optimal technician assignment based on current location and traffic
	 * Returns technicians sorted by ETA to the job location
	 */
	async rankTechniciansByETA(
		technicianLocations: Array<{ id: string; location: LatLng; name?: string }>,
		jobLocation: LatLng,
	): Promise<
		Array<{
			id: string;
			name?: string;
			etaMinutes: number;
			distanceKm: number;
			trafficDelayMinutes: number;
		}>
	> {
		if (technicianLocations.length === 0) {
			return [];
		}

		// Use matrix API for efficiency
		const origins = technicianLocations.map((t) => t.location);
		const destinations = [jobLocation];

		const matrix = await this.getRouteMatrix(origins, destinations);

		if (!matrix) {
			// Fallback: use individual routes
			const results = await Promise.all(
				technicianLocations.map(async (tech) => {
					const route = await this.getRoute(tech.location, jobLocation);
					return {
						id: tech.id,
						name: tech.name,
						etaMinutes: route
							? Math.ceil(route.durationInTraffic / 60)
							: Number.POSITIVE_INFINITY,
						distanceKm: route ? route.distance / 1000 : 0,
						trafficDelayMinutes: route ? Math.ceil(route.trafficDelay / 60) : 0,
					};
				}),
			);

			return results.sort((a, b) => a.etaMinutes - b.etaMinutes);
		}

		// Process matrix results
		const results = technicianLocations.map((tech, index) => {
			const element = matrix.elements.find(
				(e) => e.originIndex === index && e.destinationIndex === 0,
			);

			if (!element || element.status !== "OK") {
				return {
					id: tech.id,
					name: tech.name,
					etaMinutes: Number.POSITIVE_INFINITY,
					distanceKm: 0,
					trafficDelayMinutes: 0,
				};
			}

			return {
				id: tech.id,
				name: tech.name,
				etaMinutes: Math.ceil(element.durationInTraffic / 60),
				distanceKm: element.distance / 1000,
				trafficDelayMinutes: Math.ceil(
					(element.durationInTraffic - element.duration) / 60,
				),
			};
		});

		return results.sort((a, b) => a.etaMinutes - b.etaMinutes);
	}

	/**
	 * Calculate optimal route visiting multiple stops (simple greedy nearest neighbor)
	 * For more complex optimization, use RouteOptimizationService
	 */
	async getMultiStopRoute(
		origin: LatLng,
		stops: LatLng[],
		returnToOrigin = false,
	): Promise<OptimizedRoute | null> {
		if (stops.length === 0) {
			return null;
		}

		if (stops.length === 1) {
			const route = await this.getRoute(origin, stops[0]);
			if (!route) return null;

			return {
				totalDistance: route.distance,
				totalDuration: route.duration,
				totalDurationInTraffic: route.durationInTraffic,
				optimizedOrder: [0],
				legs: [
					{
						from: origin,
						to: stops[0],
						distance: route.distance,
						duration: route.duration,
						durationInTraffic: route.durationInTraffic,
						polyline: route.polyline,
					},
				],
				polyline: route.polyline,
			};
		}

		// Get distance matrix from origin to all stops
		const allPoints = [origin, ...stops];
		const matrix = await this.getRouteMatrix(allPoints, allPoints);

		if (!matrix) {
			// Fallback: sequential route
			return this.getSequentialRoute(origin, stops, returnToOrigin);
		}

		// Greedy nearest neighbor algorithm
		const visited = new Set<number>();
		const order: number[] = [];
		let currentIndex = 0; // Start at origin

		while (order.length < stops.length) {
			let nearestIndex = -1;
			let nearestDuration = Number.POSITIVE_INFINITY;

			for (let i = 1; i <= stops.length; i++) {
				if (visited.has(i)) continue;

				const element = matrix.elements.find(
					(e) => e.originIndex === currentIndex && e.destinationIndex === i,
				);

				if (element && element.status === "OK") {
					if (element.durationInTraffic < nearestDuration) {
						nearestDuration = element.durationInTraffic;
						nearestIndex = i;
					}
				}
			}

			if (nearestIndex === -1) break;

			visited.add(nearestIndex);
			order.push(nearestIndex - 1); // Convert back to stops index (0-based)
			currentIndex = nearestIndex;
		}

		// Build the optimized route
		const legs: OptimizedRoute["legs"] = [];
		let totalDistance = 0;
		let totalDuration = 0;
		let totalDurationInTraffic = 0;
		let currentPoint = origin;

		for (const stopIndex of order) {
			const targetPoint = stops[stopIndex];
			const route = await this.getRoute(currentPoint, targetPoint);

			if (route) {
				legs.push({
					from: currentPoint,
					to: targetPoint,
					distance: route.distance,
					duration: route.duration,
					durationInTraffic: route.durationInTraffic,
					polyline: route.polyline,
				});
				totalDistance += route.distance;
				totalDuration += route.duration;
				totalDurationInTraffic += route.durationInTraffic;
			}

			currentPoint = targetPoint;
		}

		// Optionally add return leg
		if (returnToOrigin && legs.length > 0) {
			const returnRoute = await this.getRoute(currentPoint, origin);
			if (returnRoute) {
				legs.push({
					from: currentPoint,
					to: origin,
					distance: returnRoute.distance,
					duration: returnRoute.duration,
					durationInTraffic: returnRoute.durationInTraffic,
					polyline: returnRoute.polyline,
				});
				totalDistance += returnRoute.distance;
				totalDuration += returnRoute.duration;
				totalDurationInTraffic += returnRoute.durationInTraffic;
			}
		}

		return OptimizedRouteSchema.parse({
			totalDistance,
			totalDuration,
			totalDurationInTraffic,
			optimizedOrder: order,
			legs,
		});
	}

	/**
	 * Sequential route (fallback when matrix unavailable)
	 */
	private async getSequentialRoute(
		origin: LatLng,
		stops: LatLng[],
		returnToOrigin: boolean,
	): Promise<OptimizedRoute | null> {
		const legs: OptimizedRoute["legs"] = [];
		let totalDistance = 0;
		let totalDuration = 0;
		let totalDurationInTraffic = 0;
		let currentPoint = origin;

		for (let i = 0; i < stops.length; i++) {
			const route = await this.getRoute(currentPoint, stops[i]);
			if (route) {
				legs.push({
					from: currentPoint,
					to: stops[i],
					distance: route.distance,
					duration: route.duration,
					durationInTraffic: route.durationInTraffic,
					polyline: route.polyline,
				});
				totalDistance += route.distance;
				totalDuration += route.duration;
				totalDurationInTraffic += route.durationInTraffic;
			}
			currentPoint = stops[i];
		}

		if (returnToOrigin) {
			const returnRoute = await this.getRoute(currentPoint, origin);
			if (returnRoute) {
				legs.push({
					from: currentPoint,
					to: origin,
					distance: returnRoute.distance,
					duration: returnRoute.duration,
					durationInTraffic: returnRoute.durationInTraffic,
					polyline: returnRoute.polyline,
				});
				totalDistance += returnRoute.distance;
				totalDuration += returnRoute.duration;
				totalDurationInTraffic += returnRoute.durationInTraffic;
			}
		}

		return {
			totalDistance,
			totalDuration,
			totalDurationInTraffic,
			optimizedOrder: stops.map((_, i) => i),
			legs,
		};
	}

	/**
	 * Fallback route using Haversine distance (when API unavailable)
	 */
	private getFallbackRoute(from: LatLng, to: LatLng): Route {
		const distance = this.calculateHaversineDistance(from, to);
		// Estimate duration: 40 km/h average city speed
		const duration = Math.round((distance / 40000) * 3600);

		return {
			distance: Math.round(distance),
			duration,
			durationInTraffic: duration, // No traffic data available
			from,
			to,
			trafficDelay: 0,
			warnings: ["Using estimated route - Google API unavailable"],
		};
	}

	/**
	 * Calculate Haversine distance between two points (meters)
	 */
	private calculateHaversineDistance(from: LatLng, to: LatLng): number {
		const R = 6371e3; // Earth radius in meters
		const φ1 = (from.lat * Math.PI) / 180;
		const φ2 = (to.lat * Math.PI) / 180;
		const Δφ = ((to.lat - from.lat) * Math.PI) / 180;
		const Δλ = ((to.lng - from.lng) * Math.PI) / 180;

		const a =
			Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
			Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c;
	}

	/**
	 * Format duration in human-readable form
	 */
	formatDuration(seconds: number): string {
		if (seconds < 60) {
			return `${Math.round(seconds)} sec`;
		}
		if (seconds < 3600) {
			return `${Math.round(seconds / 60)} min`;
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
			return `${Math.round(meters)} m`;
		}
		const km = meters / 1000;
		const miles = km * 0.621371;
		return `${miles.toFixed(1)} mi`;
	}

	/**
	 * Clean up old cache entries
	 */
	private cleanCache(
		cache: Map<string, { data: unknown; timestamp: number }>,
		ttl: number,
	): void {
		const now = Date.now();
		for (const [key, value] of cache.entries()) {
			if (now - value.timestamp > ttl * 2) {
				cache.delete(key);
			}
		}

		// Keep cache size reasonable
		if (cache.size > 500) {
			const entries = Array.from(cache.entries());
			entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
			cache.clear();
			for (const [key, value] of entries.slice(0, 250)) {
				cache.set(key, value);
			}
		}
	}

	/**
	 * Clear all caches
	 */
	clearCache(): void {
		this.routeCache.clear();
		this.matrixCache.clear();
	}
}

// Singleton instance
export const googleRoutesService = new GoogleRoutesService();
