/**
 * Traffic Service
 *
 * Fetches real-time traffic incidents using Google Maps APIs
 * Includes: crashes, construction, road closures, police activity
 */

import { z } from "zod";

// ============================================================================
// Types and Schemas
// ============================================================================

export const TrafficIncidentSchema = z.object({
	type: z.enum(["crash", "construction", "road_closed", "police", "congestion", "other"]),
	severity: z.enum(["minor", "moderate", "major"]),
	description: z.string(),
	location: z.object({
		lat: z.number(),
		lon: z.number(),
		address: z.string().optional(),
	}),
	distance: z.number(), // Distance from job location in miles
	affectsRoute: z.boolean(), // Whether this affects the route to the job
	startTime: z.string().optional(), // ISO timestamp
	endTime: z.string().optional(), // ISO timestamp (for construction)
	enrichedAt: z.string(), // ISO timestamp
});

export const TrafficDataSchema = z.object({
	incidents: z.array(TrafficIncidentSchema),
	totalIncidents: z.number(),
	nearbyIncidents: z.number(), // Within 5 miles
	routeAffectingIncidents: z.number(),
	dataSource: z.string(),
	enrichedAt: z.string(),
});

export type TrafficIncident = z.infer<typeof TrafficIncidentSchema>;
export type TrafficData = z.infer<typeof TrafficDataSchema>;

// ============================================================================
// Traffic Service
// ============================================================================

class TrafficService {
	/**
	 * Get traffic incidents near a location
	 */
	async getTrafficIncidents(
		lat: number,
		lon: number,
		shopLat?: number,
		shopLon?: number
	): Promise<TrafficData | null> {
		try {
			// For now, we'll use Google Maps Directions API with traffic model
			// to detect incidents along the route
			const apiKey =
				process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
				process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

			if (!apiKey) {
				return null;
			}

			const incidents: TrafficIncident[] = [];

			// If we have shop coordinates, check for incidents on the route
			if (shopLat && shopLon) {
				const routeIncidents = await this.getRouteIncidents(shopLat, shopLon, lat, lon, apiKey);
				incidents.push(...routeIncidents);
			}

			// Get nearby incidents using Google Maps Places API
			const nearbyIncidents = await this.getNearbyIncidents(lat, lon, apiKey);
			incidents.push(...nearbyIncidents);

			const nearbyCount = incidents.filter((i) => i.distance <= 5).length;
			const routeAffectingCount = incidents.filter((i) => i.affectsRoute).length;

			const trafficData: TrafficData = {
				incidents,
				totalIncidents: incidents.length,
				nearbyIncidents: nearbyCount,
				routeAffectingIncidents: routeAffectingCount,
				dataSource: "google-maps",
				enrichedAt: new Date().toISOString(),
			};

			return TrafficDataSchema.parse(trafficData);
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Get incidents along the route from shop to job
	 */
	private async getRouteIncidents(
		originLat: number,
		originLon: number,
		destLat: number,
		destLon: number,
		apiKey: string
	): Promise<TrafficIncident[]> {
		try {
			const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
			url.searchParams.set("origin", `${originLat},${originLon}`);
			url.searchParams.set("destination", `${destLat},${destLon}`);
			url.searchParams.set("departure_time", "now");
			url.searchParams.set("traffic_model", "best_guess");
			url.searchParams.set("key", apiKey);

			const response = await fetch(url.toString());
			if (!response.ok) {
				return [];
			}

			const data = await response.json();

			if (data.status !== "OK" || !data.routes?.[0]) {
				return [];
			}

			const route = data.routes[0];
			const incidents: TrafficIncident[] = [];

			// Check for warnings (construction, closures, etc.)
			if (route.warnings) {
				for (const warning of route.warnings) {
					incidents.push({
						type: this.categorizeWarning(warning),
						severity: "moderate",
						description: warning,
						location: {
							lat: destLat,
							lon: destLon,
						},
						distance: 0, // On route
						affectsRoute: true,
						enrichedAt: new Date().toISOString(),
					});
				}
			}

			// Analyze traffic conditions
			const leg = route.legs[0];
			if (leg.duration_in_traffic && leg.duration) {
				const trafficDelay = leg.duration_in_traffic.value - leg.duration.value;
				const delayMinutes = Math.floor(trafficDelay / 60);

				if (delayMinutes > 10) {
					incidents.push({
						type: "congestion",
						severity: delayMinutes > 30 ? "major" : "moderate",
						description: `Heavy traffic causing ${delayMinutes} minute delay`,
						location: {
							lat: destLat,
							lon: destLon,
						},
						distance: 0,
						affectsRoute: true,
						enrichedAt: new Date().toISOString(),
					});
				}
			}

			return incidents;
		} catch (_error) {
			return [];
		}
	}

	/**
	 * Search for incidents using Google Places API
	 */
	private async getNearbyIncidents(
		_lat: number,
		_lon: number,
		_apiKey: string
	): Promise<TrafficIncident[]> {
		// Note: Google Places API doesn't directly provide traffic incidents
		// In production, you'd want to use a dedicated traffic API like:
		// - TomTom Traffic API
		// - HERE Traffic API
		// - Waze Traffic API
		// For now, we'll return empty array
		return [];
	}

	/**
	 * Categorize a warning string into incident type
	 */
	private categorizeWarning(warning: string): TrafficIncident["type"] {
		const lower = warning.toLowerCase();
		if (lower.includes("construction") || lower.includes("work")) {
			return "construction";
		}
		if (lower.includes("closed") || lower.includes("closure")) {
			return "road_closed";
		}
		if (lower.includes("accident") || lower.includes("crash")) {
			return "crash";
		}
		return "other";
	}
}

export const trafficService = new TrafficService();
