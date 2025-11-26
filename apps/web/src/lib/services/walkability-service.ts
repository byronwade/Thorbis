/**
 * Walkability Service
 *
 * Calculates walkability score based on nearby amenities from OpenStreetMap
 * - Nearby amenities (restaurants, shops, schools, parks)
 * - Distance to transit
 * - Walkability score (0-100)
 *
 * API: FREE, no key required (using Overpass API)
 * Data: OpenStreetMap
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

const WalkabilitySchema = z.object({
	score: z.number(), // 0-100
	category: z.string(), // Car-Dependent, Somewhat Walkable, Very Walkable, Walker's Paradise
	nearbyAmenities: z.object({
		restaurants: z.number(),
		shops: z.number(),
		schools: z.number(),
		parks: z.number(),
		transit: z.number(),
		healthcare: z.number(),
	}),
	closestTransit: z.number().optional(), // meters
	dataSource: z.string(),
	enrichedAt: z.string(),
});

export type Walkability = z.infer<typeof WalkabilitySchema>;

class WalkabilityService {
	private readonly cache: Map<
		string,
		{ data: Walkability; timestamp: number }
	> = new Map();
	private readonly cacheTTL = 1000 * 60 * 60 * 24 * 30; // 30 days

	async getWalkability(lat: number, lon: number): Promise<Walkability | null> {
		const cacheKey = `walkability:${lat.toFixed(4)},${lon.toFixed(4)}`;
		const cached = this.cache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		try {
			// Query Overpass API for amenities within 1km
			const radius = 1000; // 1km
			const query = `
        [out:json][timeout:25];
        (
          node(around:${radius},${lat},${lon})["amenity"~"restaurant|cafe|fast_food|bar|pub"];
          node(around:${radius},${lat},${lon})["shop"];
          node(around:${radius},${lat},${lon})["amenity"~"school|kindergarten|college|university"];
          node(around:${radius},${lat},${lon})["leisure"~"park|playground|garden"];
          node(around:${radius},${lat},${lon})["public_transport"];
          node(around:${radius},${lat},${lon})["amenity"~"hospital|clinic|doctors|pharmacy"];
        );
        out count;
      `.trim();

			const res = await fetch("https://overpass-api.de/api/interpreter", {
				method: "POST",
				headers: {
					"Content-Type": "text/plain",
					"User-Agent": USER_AGENT,
				},
				body: query,
			});

			if (!res.ok) {
				return null;
			}

			const data = await res.json();

			// Count amenities by type
			const amenityCounts = {
				restaurants: 0,
				shops: 0,
				schools: 0,
				parks: 0,
				transit: 0,
				healthcare: 0,
			};

			if (data.elements) {
				for (const element of data.elements) {
					const tags = element.tags || {};

					if (tags.amenity) {
						if (
							["restaurant", "cafe", "fast_food", "bar", "pub"].includes(
								tags.amenity,
							)
						) {
							amenityCounts.restaurants++;
						} else if (
							["school", "kindergarten", "college", "university"].includes(
								tags.amenity,
							)
						) {
							amenityCounts.schools++;
						} else if (
							["hospital", "clinic", "doctors", "pharmacy"].includes(
								tags.amenity,
							)
						) {
							amenityCounts.healthcare++;
						}
					}

					if (tags.shop) {
						amenityCounts.shops++;
					}

					if (
						tags.leisure &&
						["park", "playground", "garden"].includes(tags.leisure)
					) {
						amenityCounts.parks++;
					}

					if (tags.public_transport) {
						amenityCounts.transit++;
					}
				}
			}

			// Calculate walkability score (0-100)
			// Based on weighted amenity counts
			const score = Math.min(
				100,
				amenityCounts.restaurants * 2 +
					amenityCounts.shops * 2 +
					amenityCounts.schools * 5 +
					amenityCounts.parks * 3 +
					amenityCounts.transit * 10 +
					amenityCounts.healthcare * 5,
			);

			const category = this.getWalkabilityCategory(score);

			const walkability: Walkability = {
				score: Math.round(score),
				category,
				nearbyAmenities: amenityCounts,
				dataSource: "osm",
				enrichedAt: new Date().toISOString(),
			};

			this.cache.set(cacheKey, { data: walkability, timestamp: Date.now() });

			return walkability;
		} catch (_error) {
			return null;
		}
	}

	private getWalkabilityCategory(score: number): string {
		if (score >= 90) {
			return "Walker's Paradise";
		}
		if (score >= 70) {
			return "Very Walkable";
		}
		if (score >= 50) {
			return "Somewhat Walkable";
		}
		if (score >= 25) {
			return "Car-Dependent";
		}
		return "Very Car-Dependent";
	}
}

export const walkabilityService = new WalkabilityService();
