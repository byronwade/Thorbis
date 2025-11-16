/**
 * Building Data Service
 *
 * Fetches building information from OpenStreetMap via Overpass API
 * - Building footprints, height, type
 * - Construction details
 * - 100% free, no API key needed
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

// ============================================================================
// Types and Schemas
// ============================================================================

export const BuildingDataSchema = z.object({
	// Building geometry
	footprint: z
		.object({
			area: z.number().optional(), // square meters
			perimeter: z.number().optional(), // meters
			coordinates: z.array(z.array(z.number())).optional(), // [[lon, lat], ...]
		})
		.optional(),

	// Building characteristics
	buildingType: z.string().optional(), // residential, commercial, industrial, etc.
	height: z.number().optional(), // meters
	levels: z.number().optional(), // number of floors
	roofShape: z.string().optional(), // flat, gabled, hipped, etc.
	roofMaterial: z.string().optional(), // concrete, metal, tiles, etc.
	wallMaterial: z.string().optional(), // brick, wood, concrete, etc.
	constructionDate: z.string().optional(), // YYYY or YYYY-MM-DD

	// Address data
	addressFromOSM: z
		.object({
			houseNumber: z.string().optional(),
			street: z.string().optional(),
			city: z.string().optional(),
			state: z.string().optional(),
			postcode: z.string().optional(),
		})
		.optional(),

	// Metadata
	dataSource: z.literal("osm"),
	osmId: z.number().optional(),
	osmType: z.enum(["node", "way", "relation"]).optional(),
	enrichedAt: z.string(),
});

export type BuildingData = z.infer<typeof BuildingDataSchema>;

// ============================================================================
// Building Data Service
// ============================================================================

export class BuildingDataService {
	private readonly cache: Map<string, { data: BuildingData; timestamp: number }> = new Map();
	// biome-ignore lint: Cache TTL calculation with standard time units
	private readonly cacheTTL = 1000 * 60 * 60 * 24 * 30; // 30 days

	/**
	 * Get building data from OpenStreetMap for a specific location
	 */
	async getBuildingData(lat: number, lon: number): Promise<BuildingData | null> {
		const cacheKey = `building:${lat.toFixed(6)},${lon.toFixed(6)}`;
		const cached = this.cache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		try {
			// Query Overpass API for building at this location
			// Search within 25m radius to account for GPS accuracy
			const query = `
        [out:json][timeout:25];
        (
          way(around:25,${lat},${lon})["building"];
          relation(around:25,${lat},${lon})["building"];
        );
        out tags geom;
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
			const elements = data.elements || [];

			if (elements.length === 0) {
				return null;
			}

			// Take the first (closest) building
			const building = elements[0];

			// Extract building data
			const tags = building.tags || {};
			const buildingData: BuildingData = {
				buildingType: this.normalizeBuildingType(tags.building),
				height: tags.height ? Number.parseFloat(tags.height) : undefined,
				levels: tags["building:levels"] ? Number.parseInt(tags["building:levels"], 10) : undefined,
				roofShape: tags["roof:shape"],
				roofMaterial: tags["roof:material"],
				wallMaterial: tags["wall:material"] || tags["building:material"],
				constructionDate: tags.start_date || tags.construction_date,
				addressFromOSM: {
					houseNumber: tags["addr:housenumber"],
					street: tags["addr:street"],
					city: tags["addr:city"],
					state: tags["addr:state"],
					postcode: tags["addr:postcode"],
				},
				osmId: building.id,
				osmType: building.type as "node" | "way" | "relation",
				dataSource: "osm",
				enrichedAt: new Date().toISOString(),
			};

			// Calculate footprint if geometry is available
			if (building.geometry && building.geometry.length > 0) {
				const coords = building.geometry.map((point: any) => [point.lon, point.lat]);
				const area = this.calculatePolygonArea(coords);
				const perimeter = this.calculatePolygonPerimeter(coords);

				buildingData.footprint = {
					area: Math.round(area),
					perimeter: Math.round(perimeter),
					coordinates: coords,
				};
			}

			const parsedData = BuildingDataSchema.parse(buildingData);
			this.cache.set(cacheKey, {
				data: parsedData,
				timestamp: Date.now(),
			});
			return parsedData;
		} catch (_error) {
    console.error("Error:", _error);
			return null;
		}
	}

	/**
	 * Normalize building type from OSM tags
	 */
	private normalizeBuildingType(buildingTag: string | undefined): string | undefined {
		if (!buildingTag || buildingTag === "yes") {
			return;
		}

		const typeMap: Record<string, string> = {
			house: "residential",
			detached: "residential",
			semidetached_house: "residential",
			terrace: "residential",
			apartments: "residential",
			residential: "residential",
			commercial: "commercial",
			retail: "commercial",
			office: "commercial",
			industrial: "industrial",
			warehouse: "industrial",
			shed: "storage",
			garage: "storage",
			garages: "storage",
			church: "religious",
			school: "educational",
			hospital: "healthcare",
			hotel: "hospitality",
		};

		return typeMap[buildingTag.toLowerCase()] || buildingTag;
	}

	/**
	 * Calculate area of a polygon using the Shoelace formula
	 * Coordinates: [[lon, lat], ...]
	 * Returns area in square meters
	 */
	// biome-ignore lint: Mathematical formulas with well-known constants
	private calculatePolygonArea(coords: number[][]): number {
		if (coords.length < 3) {
			return 0;
		}

		let area = 0;
		for (let i = 0; i < coords.length; i++) {
			const j = (i + 1) % coords.length;
			area += coords[i][0] * coords[j][1];
			area -= coords[j][0] * coords[i][1];
		}

		area = Math.abs(area / 2);

		// Convert from degrees² to meters² (rough approximation at mid-latitudes)
		// 1 degree latitude ≈ 111,000 meters
		// 1 degree longitude varies by latitude
		const lat = coords[0][1];
		const metersPerDegreeLat = 111_000;
		const metersPerDegreeLon = 111_000 * Math.cos((lat * Math.PI) / 180);

		return area * metersPerDegreeLat * metersPerDegreeLon;
	}

	/**
	 * Calculate perimeter of a polygon
	 * Returns perimeter in meters
	 */
	// biome-ignore lint: Mathematical formulas with well-known constants (Haversine)
	private calculatePolygonPerimeter(coords: number[][]): number {
		if (coords.length < 2) {
			return 0;
		}

		let perimeter = 0;
		for (let i = 0; i < coords.length; i++) {
			const j = (i + 1) % coords.length;
			const lat1 = coords[i][1];
			const lon1 = coords[i][0];
			const lat2 = coords[j][1];
			const lon2 = coords[j][0];

			// Haversine formula for distance between two points
			const R = 6_371_000; // Earth's radius in meters
			const dLat = ((lat2 - lat1) * Math.PI) / 180;
			const dLon = ((lon2 - lon1) * Math.PI) / 180;
			const a =
				Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			perimeter += R * c;
		}

		return perimeter;
	}
}

// Singleton instance
export const buildingDataService = new BuildingDataService();
