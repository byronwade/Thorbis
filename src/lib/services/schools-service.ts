/**
 * Schools Service
 *
 * Fetches nearby schools from OpenStreetMap
 * - Elementary, Middle, High Schools
 * - Distance from property
 * - School type (public, private, charter)
 *
 * API: FREE, no key required (using Overpass API)
 * Data: OpenStreetMap
 *
 * Note: For US school ratings, would need GreatSchools API (requires paid subscription)
 * This provides basic school locations and types only
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

export const SchoolSchema = z.object({
	name: z.string(),
	type: z.string().optional(), // elementary, middle, high, university
	operator: z.string().optional(), // public, private, charter
	distance: z.number(), // meters
	lat: z.number(),
	lon: z.number(),
});

export const SchoolsDataSchema = z.object({
	schools: z.array(SchoolSchema),
	closestSchool: z.number().optional(), // meters
	totalSchools: z.number(),
	dataSource: z.string(),
	enrichedAt: z.string(),
});

export type School = z.infer<typeof SchoolSchema>;
export type SchoolsData = z.infer<typeof SchoolsDataSchema>;

export class SchoolsService {
	private readonly cache: Map<string, { data: SchoolsData; timestamp: number }> = new Map();
	private readonly cacheTTL = 1000 * 60 * 60 * 24 * 90; // 90 days

	async getNearbySchools(lat: number, lon: number, radius = 5000): Promise<SchoolsData | null> {
		const cacheKey = `schools:${lat.toFixed(4)},${lon.toFixed(4)}`;
		const cached = this.cache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		try {
			// Query Overpass API for schools within radius
			const query = `
        [out:json][timeout:25];
        (
          node(around:${radius},${lat},${lon})["amenity"="school"];
          way(around:${radius},${lat},${lon})["amenity"="school"];
          node(around:${radius},${lat},${lon})["amenity"="kindergarten"];
          node(around:${radius},${lat},${lon})["amenity"="college"];
          node(around:${radius},${lat},${lon})["amenity"="university"];
        );
        out center tags;
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

			if (!data.elements || data.elements.length === 0) {
				return {
					schools: [],
					totalSchools: 0,
					dataSource: "osm",
					enrichedAt: new Date().toISOString(),
				};
			}

			const schools: School[] = data.elements.map((element: any) => {
				const tags = element.tags || {};
				const schoolLat = element.center?.lat || element.lat;
				const schoolLon = element.center?.lon || element.lon;

				const distance = this.calculateDistance(lat, lon, schoolLat, schoolLon);

				return {
					name: tags.name || "Unnamed School",
					type: this.getSchoolType(tags),
					operator: tags.operator || tags["operator:type"],
					distance: Math.round(distance),
					lat: schoolLat,
					lon: schoolLon,
				};
			});

			// Sort by distance
			schools.sort((a, b) => a.distance - b.distance);

			const schoolsData: SchoolsData = {
				schools: schools.slice(0, 10), // Top 10 closest
				closestSchool: schools[0]?.distance,
				totalSchools: schools.length,
				dataSource: "osm",
				enrichedAt: new Date().toISOString(),
			};

			this.cache.set(cacheKey, { data: schoolsData, timestamp: Date.now() });

			return schoolsData;
		} catch (_error) {
    console.error("Error:", _error);
			return null;
		}
	}

	private getSchoolType(tags: any): string {
		if (tags.amenity === "kindergarten") {
			return "Preschool";
		}
		if (tags.amenity === "university") {
			return "University";
		}
		if (tags.amenity === "college") {
			return "College";
		}

		// Check for grade levels
		if (tags["isced:level"]) {
			const level = tags["isced:level"];
			if (level.includes("0") || level.includes("1")) {
				return "Elementary";
			}
			if (level.includes("2")) {
				return "Middle School";
			}
			if (level.includes("3")) {
				return "High School";
			}
		}

		return "School";
	}

	private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
		const R = 6_371_000; // Earth's radius in meters
		const φ1 = (lat1 * Math.PI) / 180;
		const φ2 = (lat2 * Math.PI) / 180;
		const Δφ = ((lat2 - lat1) * Math.PI) / 180;
		const Δλ = ((lon2 - lon1) * Math.PI) / 180;

		const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c;
	}
}

export const schoolsService = new SchoolsService();
