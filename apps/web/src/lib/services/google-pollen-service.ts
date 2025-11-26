/**
 * Google Pollen Service
 *
 * Provides pollen data using Google Pollen API
 * - Tree pollen levels
 * - Grass pollen levels
 * - Weed pollen levels
 * - Daily forecasts
 * - 1km resolution data
 *
 * API: Google Pollen API
 * Docs: https://developers.google.com/maps/documentation/pollen
 *
 * Use Cases for Field Service:
 * - HVAC filter upsells during high pollen seasons
 * - Air quality recommendations
 * - Scheduling outdoor work
 * - Customer health notifications
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

// ============================================================================
// Types and Schemas
// ============================================================================

const PollenTypeSchema = z.object({
	code: z.string(), // TREE, GRASS, WEED
	displayName: z.string(),
	indexInfo: z.object({
		code: z.string(), // UPI (Universal Pollen Index)
		displayName: z.string(),
		value: z.number(), // 0-5 scale
		category: z.string(), // None, Very Low, Low, Moderate, High, Very High
		indexDescription: z.string().optional(),
		color: z
			.object({
				red: z.number(),
				green: z.number(),
				blue: z.number(),
			})
			.optional(),
	}),
	healthRecommendations: z.array(z.string()).optional(),
	inSeason: z.boolean(),
});

const PlantInfoSchema = z.object({
	code: z.string(), // e.g., OAK, BIRCH, RAGWEED
	displayName: z.string(),
	indexInfo: z.object({
		value: z.number(),
		category: z.string(),
	}),
	plantDescription: z
		.object({
			type: z.string(),
			family: z.string().optional(),
			season: z.string().optional(),
			crossReaction: z.string().optional(),
		})
		.optional(),
	inSeason: z.boolean(),
});

const DailyPollenForecastSchema = z.object({
	date: z.string(), // YYYY-MM-DD
	pollenTypes: z.array(PollenTypeSchema),
	plants: z.array(PlantInfoSchema).optional(),
});

const PollenDataSchema = z.object({
	location: z.object({
		lat: z.number(),
		lng: z.number(),
	}),
	regionCode: z.string().optional(),
	dailyInfo: z.array(DailyPollenForecastSchema),
	source: z.enum(["google", "openmeteo"]),
	enrichedAt: z.string(),
});

export type PollenType = z.infer<typeof PollenTypeSchema>;
export type PlantInfo = z.infer<typeof PlantInfoSchema>;
export type DailyPollenForecast = z.infer<typeof DailyPollenForecastSchema>;
export type PollenData = z.infer<typeof PollenDataSchema>;

// ============================================================================
// Cache Configuration
// ============================================================================

const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours (pollen doesn't change quickly)

// ============================================================================
// Google Pollen Service
// ============================================================================

class GooglePollenService {
	private readonly apiKey: string | undefined;
	private readonly cache: Map<string, { data: PollenData; timestamp: number }> =
		new Map();

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
	 * Get pollen data for a location (5-day forecast)
	 */
	async getPollenData(lat: number, lng: number): Promise<PollenData | null> {
		const cacheKey = `pollen:${lat.toFixed(3)},${lng.toFixed(3)}`;
		const cached = this.cache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			return cached.data;
		}

		// Try Google Pollen API first
		if (this.apiKey) {
			const googleData = await this.fetchFromGoogle(lat, lng);
			if (googleData) {
				this.cache.set(cacheKey, { data: googleData, timestamp: Date.now() });
				this.cleanCache();
				return googleData;
			}
		}

		// Fallback to Open-Meteo (limited pollen data)
		const openMeteoData = await this.fetchFromOpenMeteo(lat, lng);
		if (openMeteoData) {
			this.cache.set(cacheKey, {
				data: openMeteoData,
				timestamp: Date.now(),
			});
			this.cleanCache();
			return openMeteoData;
		}

		return null;
	}

	/**
	 * Fetch from Google Pollen API
	 */
	private async fetchFromGoogle(
		lat: number,
		lng: number,
	): Promise<PollenData | null> {
		try {
			const url = `https://pollen.googleapis.com/v1/forecast:lookup?key=${this.apiKey}`;

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"User-Agent": USER_AGENT,
				},
				body: JSON.stringify({
					location: { latitude: lat, longitude: lng },
					days: 5,
					languageCode: "en",
					plantsDescription: true,
				}),
			});

			if (!response.ok) {
				console.error(`Google Pollen API error: ${response.status}`);
				return null;
			}

			const data = await response.json();

			if (!data.dailyInfo) {
				return null;
			}

			const dailyInfo: DailyPollenForecast[] = data.dailyInfo.map(
				(day: any) => {
					const pollenTypes: PollenType[] = (day.pollenTypeInfo || []).map(
						(pt: any) => ({
							code: pt.code || "UNKNOWN",
							displayName: pt.displayName || pt.code,
							indexInfo: {
								code: pt.indexInfo?.code || "UPI",
								displayName:
									pt.indexInfo?.displayName || "Universal Pollen Index",
								value: pt.indexInfo?.value || 0,
								category: pt.indexInfo?.category || "None",
								indexDescription: pt.indexInfo?.indexDescription,
								color: pt.indexInfo?.color,
							},
							healthRecommendations: pt.healthRecommendations,
							inSeason: pt.inSeason || false,
						}),
					);

					const plants: PlantInfo[] = (day.plantInfo || []).map((p: any) => ({
						code: p.code || "UNKNOWN",
						displayName: p.displayName || p.code,
						indexInfo: {
							value: p.indexInfo?.value || 0,
							category: p.indexInfo?.category || "None",
						},
						plantDescription: p.plantDescription,
						inSeason: p.inSeason || false,
					}));

					return {
						date: day.date?.year
							? `${day.date.year}-${String(day.date.month).padStart(2, "0")}-${String(day.date.day).padStart(2, "0")}`
							: new Date().toISOString().split("T")[0],
						pollenTypes,
						plants: plants.length > 0 ? plants : undefined,
					};
				},
			);

			return {
				location: { lat, lng },
				regionCode: data.regionCode,
				dailyInfo,
				source: "google",
				enrichedAt: new Date().toISOString(),
			};
		} catch (error) {
			console.error("Google Pollen fetch error:", error);
			return null;
		}
	}

	/**
	 * Fetch from Open-Meteo (limited pollen data as fallback)
	 */
	private async fetchFromOpenMeteo(
		lat: number,
		lng: number,
	): Promise<PollenData | null> {
		try {
			const url = new URL(
				"https://air-quality-api.open-meteo.com/v1/air-quality",
			);
			url.searchParams.set("latitude", lat.toString());
			url.searchParams.set("longitude", lng.toString());
			url.searchParams.set(
				"hourly",
				"alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen",
			);
			url.searchParams.set("forecast_days", "5");

			const response = await fetch(url.toString(), {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				return null;
			}

			const data = await response.json();
			const hourly = data.hourly;

			if (!hourly?.time) {
				return null;
			}

			// Group by day and aggregate
			const dayMap = new Map<
				string,
				{ tree: number[]; grass: number[]; weed: number[] }
			>();

			for (let i = 0; i < hourly.time.length; i++) {
				const date = hourly.time[i].split("T")[0];
				if (!dayMap.has(date)) {
					dayMap.set(date, { tree: [], grass: [], weed: [] });
				}

				const day = dayMap.get(date)!;

				// Tree pollen (alder, birch, olive)
				const treePollen =
					(hourly.alder_pollen?.[i] || 0) +
					(hourly.birch_pollen?.[i] || 0) +
					(hourly.olive_pollen?.[i] || 0);
				day.tree.push(treePollen);

				// Grass pollen
				day.grass.push(hourly.grass_pollen?.[i] || 0);

				// Weed pollen (mugwort, ragweed)
				const weedPollen =
					(hourly.mugwort_pollen?.[i] || 0) + (hourly.ragweed_pollen?.[i] || 0);
				day.weed.push(weedPollen);
			}

			const dailyInfo: DailyPollenForecast[] = Array.from(dayMap.entries())
				.slice(0, 5)
				.map(([date, values]) => {
					const avgTree = this.average(values.tree);
					const avgGrass = this.average(values.grass);
					const avgWeed = this.average(values.weed);

					return {
						date,
						pollenTypes: [
							this.createPollenType("TREE", "Tree Pollen", avgTree),
							this.createPollenType("GRASS", "Grass Pollen", avgGrass),
							this.createPollenType("WEED", "Weed Pollen", avgWeed),
						],
					};
				});

			return {
				location: { lat, lng },
				dailyInfo,
				source: "openmeteo",
				enrichedAt: new Date().toISOString(),
			};
		} catch (error) {
			console.error("Open-Meteo pollen fetch error:", error);
			return null;
		}
	}

	/**
	 * Create a PollenType object from concentration
	 */
	private createPollenType(
		code: string,
		displayName: string,
		concentration: number,
	): PollenType {
		const { value, category, color } = this.concentrationToIndex(concentration);

		return {
			code,
			displayName,
			indexInfo: {
				code: "UPI",
				displayName: "Universal Pollen Index",
				value,
				category,
				color,
			},
			inSeason: value > 0,
		};
	}

	/**
	 * Convert concentration to pollen index (0-5)
	 */
	private concentrationToIndex(concentration: number): {
		value: number;
		category: string;
		color: { red: number; green: number; blue: number };
	} {
		// Rough mapping based on typical thresholds (grains/m³)
		if (concentration < 10) {
			return {
				value: 0,
				category: "None",
				color: { red: 128, green: 128, blue: 128 },
			};
		}
		if (concentration < 30) {
			return {
				value: 1,
				category: "Very Low",
				color: { red: 144, green: 238, blue: 144 },
			};
		}
		if (concentration < 60) {
			return {
				value: 2,
				category: "Low",
				color: { red: 255, green: 255, blue: 0 },
			};
		}
		if (concentration < 100) {
			return {
				value: 3,
				category: "Moderate",
				color: { red: 255, green: 165, blue: 0 },
			};
		}
		if (concentration < 200) {
			return {
				value: 4,
				category: "High",
				color: { red: 255, green: 0, blue: 0 },
			};
		}
		return {
			value: 5,
			category: "Very High",
			color: { red: 128, green: 0, blue: 128 },
		};
	}

	private average(arr: number[]): number {
		if (arr.length === 0) return 0;
		return arr.reduce((a, b) => a + b, 0) / arr.length;
	}

	/**
	 * Get today's pollen summary
	 */
	getTodaysSummary(data: PollenData): {
		overallLevel: string;
		overallValue: number;
		color: string;
		tree: { level: string; value: number };
		grass: { level: string; value: number };
		weed: { level: string; value: number };
		highestType: string;
		isHighPollenDay: boolean;
	} | null {
		const today = data.dailyInfo[0];
		if (!today) return null;

		const tree = today.pollenTypes.find((p) => p.code === "TREE");
		const grass = today.pollenTypes.find((p) => p.code === "GRASS");
		const weed = today.pollenTypes.find((p) => p.code === "WEED");

		const maxValue = Math.max(
			tree?.indexInfo.value || 0,
			grass?.indexInfo.value || 0,
			weed?.indexInfo.value || 0,
		);

		const highestType =
			maxValue === (tree?.indexInfo.value || 0)
				? "Tree"
				: maxValue === (grass?.indexInfo.value || 0)
					? "Grass"
					: "Weed";

		const { category: overallLevel, color } = this.valueToCategory(maxValue);

		return {
			overallLevel,
			overallValue: maxValue,
			color: `rgb(${color.red},${color.green},${color.blue})`,
			tree: {
				level: tree?.indexInfo.category || "None",
				value: tree?.indexInfo.value || 0,
			},
			grass: {
				level: grass?.indexInfo.category || "None",
				value: grass?.indexInfo.value || 0,
			},
			weed: {
				level: weed?.indexInfo.category || "None",
				value: weed?.indexInfo.value || 0,
			},
			highestType,
			isHighPollenDay: maxValue >= 4,
		};
	}

	private valueToCategory(value: number): {
		category: string;
		color: { red: number; green: number; blue: number };
	} {
		const categories = [
			{ category: "None", color: { red: 128, green: 128, blue: 128 } },
			{ category: "Very Low", color: { red: 144, green: 238, blue: 144 } },
			{ category: "Low", color: { red: 255, green: 255, blue: 0 } },
			{ category: "Moderate", color: { red: 255, green: 165, blue: 0 } },
			{ category: "High", color: { red: 255, green: 0, blue: 0 } },
			{ category: "Very High", color: { red: 128, green: 0, blue: 128 } },
		];
		return categories[Math.min(value, 5)];
	}

	/**
	 * Check if pollen levels warrant HVAC filter upsell
	 */
	getHVACUpsellRecommendation(data: PollenData): {
		shouldUpsell: boolean;
		urgency: "none" | "low" | "medium" | "high";
		message: string;
		filterRecommendation?: string;
		highestPollenType?: string;
	} {
		const summary = this.getTodaysSummary(data);
		if (!summary) {
			return {
				shouldUpsell: false,
				urgency: "none",
				message: "Pollen data unavailable",
			};
		}

		if (summary.overallValue >= 4) {
			return {
				shouldUpsell: true,
				urgency: "high",
				message: `Very high ${summary.highestType.toLowerCase()} pollen levels in this area.`,
				filterRecommendation:
					"Recommend HEPA filter or MERV 13+ for optimal allergen filtration.",
				highestPollenType: summary.highestType,
			};
		}

		if (summary.overallValue >= 3) {
			return {
				shouldUpsell: true,
				urgency: "medium",
				message: `Moderate to high ${summary.highestType.toLowerCase()} pollen detected.`,
				filterRecommendation:
					"Consider upgrading to MERV 11+ filter for better pollen filtration.",
				highestPollenType: summary.highestType,
			};
		}

		if (summary.overallValue >= 2) {
			return {
				shouldUpsell: false,
				urgency: "low",
				message: `Low ${summary.highestType.toLowerCase()} pollen levels.`,
			};
		}

		return {
			shouldUpsell: false,
			urgency: "none",
			message: "Pollen levels are minimal.",
		};
	}

	/**
	 * Get 5-day pollen forecast for scheduling
	 */
	get5DayForecast(data: PollenData): Array<{
		date: string;
		dayName: string;
		overall: { level: string; value: number; color: string };
		tree: number;
		grass: number;
		weed: number;
		isBadDay: boolean;
	}> {
		const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

		return data.dailyInfo.map((day) => {
			const tree =
				day.pollenTypes.find((p) => p.code === "TREE")?.indexInfo.value || 0;
			const grass =
				day.pollenTypes.find((p) => p.code === "GRASS")?.indexInfo.value || 0;
			const weed =
				day.pollenTypes.find((p) => p.code === "WEED")?.indexInfo.value || 0;

			const maxValue = Math.max(tree, grass, weed);
			const { category, color } = this.valueToCategory(maxValue);
			const date = new Date(day.date);

			return {
				date: day.date,
				dayName: days[date.getDay()],
				overall: {
					level: category,
					value: maxValue,
					color: `rgb(${color.red},${color.green},${color.blue})`,
				},
				tree,
				grass,
				weed,
				isBadDay: maxValue >= 4,
			};
		});
	}

	/**
	 * Clean up old cache entries
	 */
	private cleanCache(): void {
		const now = Date.now();
		for (const [key, value] of this.cache.entries()) {
			if (now - value.timestamp > CACHE_TTL * 2) {
				this.cache.delete(key);
			}
		}
	}

	/**
	 * Clear cache
	 */
	clearCache(): void {
		this.cache.clear();
	}
}

// Singleton instance
export const googlePollenService = new GooglePollenService();
