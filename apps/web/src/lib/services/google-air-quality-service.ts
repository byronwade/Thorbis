/**
 * Google Air Quality Service
 *
 * Provides air quality data using Google Air Quality API
 * - Current air quality index (AQI)
 * - Pollutant concentrations (PM2.5, PM10, O3, NO2, SO2, CO)
 * - Health recommendations
 * - 500m resolution data
 *
 * API: Google Air Quality API
 * Docs: https://developers.google.com/maps/documentation/air-quality
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

// ============================================================================
// Types and Schemas
// ============================================================================

const PollutantSchema = z.object({
	code: z.string(), // PM25, PM10, O3, NO2, SO2, CO
	displayName: z.string(),
	concentration: z.object({
		value: z.number(),
		units: z.string(), // μg/m³ or ppb
	}),
	additionalInfo: z
		.object({
			sources: z.string().optional(),
			effects: z.string().optional(),
		})
		.optional(),
});

const AirQualityIndexSchema = z.object({
	code: z.string(), // us-epa, who, etc.
	displayName: z.string(),
	aqi: z.number(), // 0-500 scale
	category: z.string(), // Good, Moderate, Unhealthy, etc.
	color: z
		.object({
			red: z.number(),
			green: z.number(),
			blue: z.number(),
		})
		.optional(),
	dominantPollutant: z.string().optional(),
});

const HealthRecommendationsSchema = z.object({
	generalPopulation: z.string().optional(),
	elderly: z.string().optional(),
	lungDiseasePopulation: z.string().optional(),
	heartDiseasePopulation: z.string().optional(),
	athletes: z.string().optional(),
	pregnantWomen: z.string().optional(),
	children: z.string().optional(),
});

const AirQualityDataSchema = z.object({
	location: z.object({
		lat: z.number(),
		lng: z.number(),
	}),
	dateTime: z.string(),
	regionCode: z.string().optional(),
	indexes: z.array(AirQualityIndexSchema),
	pollutants: z.array(PollutantSchema),
	healthRecommendations: HealthRecommendationsSchema.optional(),
	source: z.enum(["google", "airnow", "openaq"]),
	enrichedAt: z.string(),
});

const AirQualityForecastSchema = z.object({
	dateTime: z.string(),
	indexes: z.array(AirQualityIndexSchema),
	pollutants: z.array(PollutantSchema).optional(),
});

export type Pollutant = z.infer<typeof PollutantSchema>;
export type AirQualityIndex = z.infer<typeof AirQualityIndexSchema>;
export type HealthRecommendations = z.infer<typeof HealthRecommendationsSchema>;
export type AirQualityData = z.infer<typeof AirQualityDataSchema>;
export type AirQualityForecast = z.infer<typeof AirQualityForecastSchema>;

// ============================================================================
// Cache Configuration
// ============================================================================

const CACHE_TTL = 60 * 60 * 1000; // 1 hour (AQI updates hourly)

// ============================================================================
// Google Air Quality Service
// ============================================================================

class GoogleAirQualityService {
	private readonly apiKey: string | undefined;
	private readonly cache: Map<
		string,
		{ data: AirQualityData; timestamp: number }
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
	 * Get current air quality data for a location
	 */
	async getAirQuality(
		lat: number,
		lng: number,
	): Promise<AirQualityData | null> {
		const cacheKey = `aq:${lat.toFixed(4)},${lng.toFixed(4)}`;
		const cached = this.cache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			return cached.data;
		}

		// Try Google Air Quality API first
		if (this.apiKey) {
			const googleData = await this.fetchFromGoogle(lat, lng);
			if (googleData) {
				this.cache.set(cacheKey, { data: googleData, timestamp: Date.now() });
				this.cleanCache();
				return googleData;
			}
		}

		// Fallback to Open-Meteo Air Quality (free)
		const openMeteoData = await this.fetchFromOpenMeteo(lat, lng);
		if (openMeteoData) {
			this.cache.set(cacheKey, { data: openMeteoData, timestamp: Date.now() });
			this.cleanCache();
			return openMeteoData;
		}

		return null;
	}

	/**
	 * Fetch from Google Air Quality API
	 */
	private async fetchFromGoogle(
		lat: number,
		lng: number,
	): Promise<AirQualityData | null> {
		try {
			const url = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${this.apiKey}`;

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"User-Agent": USER_AGENT,
				},
				body: JSON.stringify({
					location: { latitude: lat, longitude: lng },
					extraComputations: [
						"HEALTH_RECOMMENDATIONS",
						"DOMINANT_POLLUTANT_CONCENTRATION",
						"POLLUTANT_CONCENTRATION",
						"LOCAL_AQI",
						"POLLUTANT_ADDITIONAL_INFO",
					],
					languageCode: "en",
				}),
			});

			if (!response.ok) {
				console.error(`Google Air Quality API error: ${response.status}`);
				return null;
			}

			const data = await response.json();

			// Parse indexes
			const indexes: AirQualityIndex[] = (data.indexes || []).map(
				(idx: any) => ({
					code: idx.code || "unknown",
					displayName: idx.displayName || "Air Quality Index",
					aqi: idx.aqi || 0,
					category: idx.category || "Unknown",
					color: idx.color,
					dominantPollutant: idx.dominantPollutant,
				}),
			);

			// Parse pollutants
			const pollutants: Pollutant[] = (data.pollutants || []).map((p: any) => ({
				code: p.code || "unknown",
				displayName: p.displayName || p.code,
				concentration: {
					value: p.concentration?.value || 0,
					units: p.concentration?.units || "μg/m³",
				},
				additionalInfo: p.additionalInfo,
			}));

			// Parse health recommendations
			const healthRecs = data.healthRecommendations;
			const healthRecommendations: HealthRecommendations | undefined =
				healthRecs
					? {
							generalPopulation: healthRecs.generalPopulation,
							elderly: healthRecs.elderly,
							lungDiseasePopulation: healthRecs.lungDiseasePopulation,
							heartDiseasePopulation: healthRecs.heartDiseasePopulation,
							athletes: healthRecs.athletes,
							pregnantWomen: healthRecs.pregnantWomen,
							children: healthRecs.children,
						}
					: undefined;

			return {
				location: { lat, lng },
				dateTime: data.dateTime || new Date().toISOString(),
				regionCode: data.regionCode,
				indexes,
				pollutants,
				healthRecommendations,
				source: "google",
				enrichedAt: new Date().toISOString(),
			};
		} catch (error) {
			console.error("Google Air Quality fetch error:", error);
			return null;
		}
	}

	/**
	 * Fetch from Open-Meteo Air Quality API (free fallback)
	 */
	private async fetchFromOpenMeteo(
		lat: number,
		lng: number,
	): Promise<AirQualityData | null> {
		try {
			const url = new URL(
				"https://air-quality-api.open-meteo.com/v1/air-quality",
			);
			url.searchParams.set("latitude", lat.toString());
			url.searchParams.set("longitude", lng.toString());
			url.searchParams.set(
				"current",
				"us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone",
			);

			const response = await fetch(url.toString(), {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error(`Open-Meteo Air Quality API error: ${response.status}`);
				return null;
			}

			const data = await response.json();
			const current = data.current;

			if (!current) {
				return null;
			}

			// Map US AQI to category
			const aqi = current.us_aqi || 0;
			const category = this.getAQICategory(aqi);

			const indexes: AirQualityIndex[] = [
				{
					code: "us-epa",
					displayName: "US EPA AQI",
					aqi,
					category: category.name,
					color: category.color,
					dominantPollutant: this.getDominantPollutant(current),
				},
			];

			const pollutants: Pollutant[] = [
				{
					code: "PM25",
					displayName: "PM2.5",
					concentration: { value: current.pm2_5 || 0, units: "μg/m³" },
				},
				{
					code: "PM10",
					displayName: "PM10",
					concentration: { value: current.pm10 || 0, units: "μg/m³" },
				},
				{
					code: "O3",
					displayName: "Ozone",
					concentration: { value: current.ozone || 0, units: "μg/m³" },
				},
				{
					code: "NO2",
					displayName: "Nitrogen Dioxide",
					concentration: {
						value: current.nitrogen_dioxide || 0,
						units: "μg/m³",
					},
				},
				{
					code: "SO2",
					displayName: "Sulfur Dioxide",
					concentration: {
						value: current.sulphur_dioxide || 0,
						units: "μg/m³",
					},
				},
				{
					code: "CO",
					displayName: "Carbon Monoxide",
					concentration: {
						value: current.carbon_monoxide || 0,
						units: "μg/m³",
					},
				},
			].filter((p) => p.concentration.value > 0);

			return {
				location: { lat, lng },
				dateTime: current.time || new Date().toISOString(),
				indexes,
				pollutants,
				healthRecommendations: {
					generalPopulation: category.recommendation,
				},
				source: "openaq",
				enrichedAt: new Date().toISOString(),
			};
		} catch (error) {
			console.error("Open-Meteo Air Quality fetch error:", error);
			return null;
		}
	}

	/**
	 * Get air quality forecast for the next 5 days
	 */
	async getAirQualityForecast(
		lat: number,
		lng: number,
	): Promise<AirQualityForecast[] | null> {
		try {
			const url = new URL(
				"https://air-quality-api.open-meteo.com/v1/air-quality",
			);
			url.searchParams.set("latitude", lat.toString());
			url.searchParams.set("longitude", lng.toString());
			url.searchParams.set(
				"hourly",
				"us_aqi,pm10,pm2_5,ozone,nitrogen_dioxide",
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

			const forecasts: AirQualityForecast[] = [];

			for (let i = 0; i < hourly.time.length; i++) {
				const aqi = hourly.us_aqi?.[i] || 0;
				const category = this.getAQICategory(aqi);

				forecasts.push({
					dateTime: hourly.time[i],
					indexes: [
						{
							code: "us-epa",
							displayName: "US EPA AQI",
							aqi,
							category: category.name,
							color: category.color,
						},
					],
					pollutants: [
						{
							code: "PM25",
							displayName: "PM2.5",
							concentration: {
								value: hourly.pm2_5?.[i] || 0,
								units: "μg/m³",
							},
						},
						{
							code: "PM10",
							displayName: "PM10",
							concentration: {
								value: hourly.pm10?.[i] || 0,
								units: "μg/m³",
							},
						},
						{
							code: "O3",
							displayName: "Ozone",
							concentration: {
								value: hourly.ozone?.[i] || 0,
								units: "μg/m³",
							},
						},
					],
				});
			}

			return forecasts;
		} catch (error) {
			console.error("Air quality forecast fetch error:", error);
			return null;
		}
	}

	/**
	 * Get AQI category from numeric value
	 */
	private getAQICategory(aqi: number): {
		name: string;
		color: { red: number; green: number; blue: number };
		recommendation: string;
	} {
		if (aqi <= 50) {
			return {
				name: "Good",
				color: { red: 0, green: 228, blue: 0 },
				recommendation:
					"Air quality is satisfactory. Enjoy outdoor activities.",
			};
		}
		if (aqi <= 100) {
			return {
				name: "Moderate",
				color: { red: 255, green: 255, blue: 0 },
				recommendation:
					"Air quality is acceptable. Unusually sensitive individuals should consider limiting prolonged outdoor exertion.",
			};
		}
		if (aqi <= 150) {
			return {
				name: "Unhealthy for Sensitive Groups",
				color: { red: 255, green: 126, blue: 0 },
				recommendation:
					"Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
			};
		}
		if (aqi <= 200) {
			return {
				name: "Unhealthy",
				color: { red: 255, green: 0, blue: 0 },
				recommendation:
					"Everyone may begin to experience health effects. Members of sensitive groups may experience more serious health effects.",
			};
		}
		if (aqi <= 300) {
			return {
				name: "Very Unhealthy",
				color: { red: 143, green: 63, blue: 151 },
				recommendation:
					"Health alert: everyone may experience more serious health effects. Consider rescheduling outdoor work.",
			};
		}
		return {
			name: "Hazardous",
			color: { red: 126, green: 0, blue: 35 },
			recommendation:
				"Health emergency: reschedule all outdoor work immediately.",
		};
	}

	/**
	 * Determine dominant pollutant
	 */
	private getDominantPollutant(current: Record<string, number>): string {
		// Simple heuristic based on typical threshold exceedances
		const pollutants = [
			{ code: "PM25", value: current.pm2_5 || 0, threshold: 12 },
			{ code: "PM10", value: current.pm10 || 0, threshold: 54 },
			{ code: "O3", value: current.ozone || 0, threshold: 100 },
			{ code: "NO2", value: current.nitrogen_dioxide || 0, threshold: 100 },
		];

		let dominant = pollutants[0];
		let maxRatio = 0;

		for (const p of pollutants) {
			const ratio = p.value / p.threshold;
			if (ratio > maxRatio) {
				maxRatio = ratio;
				dominant = p;
			}
		}

		return dominant.code;
	}

	/**
	 * Check if air quality is suitable for outdoor work
	 */
	isSuitableForOutdoorWork(data: AirQualityData): {
		suitable: boolean;
		reason?: string;
		severity: "none" | "low" | "medium" | "high";
	} {
		const usEpaIndex = data.indexes.find((i) => i.code === "us-epa");
		const aqi = usEpaIndex?.aqi || 0;

		if (aqi > 200) {
			return {
				suitable: false,
				reason: `Very Unhealthy air quality (AQI: ${aqi})`,
				severity: "high",
			};
		}
		if (aqi > 150) {
			return {
				suitable: false,
				reason: `Unhealthy air quality (AQI: ${aqi})`,
				severity: "medium",
			};
		}
		if (aqi > 100) {
			return {
				suitable: true,
				reason: `Unhealthy for sensitive groups (AQI: ${aqi})`,
				severity: "low",
			};
		}

		return { suitable: true, severity: "none" };
	}

	/**
	 * Get air quality summary for display
	 */
	getAirQualitySummary(data: AirQualityData): {
		aqi: number;
		category: string;
		color: string;
		dominantPollutant: string;
		pm25: number;
		recommendation: string;
		suitableForWork: boolean;
	} {
		const usEpaIndex =
			data.indexes.find((i) => i.code === "us-epa") || data.indexes[0];
		const pm25 = data.pollutants.find((p) => p.code === "PM25");
		const workSuitability = this.isSuitableForOutdoorWork(data);

		return {
			aqi: usEpaIndex?.aqi || 0,
			category: usEpaIndex?.category || "Unknown",
			color: usEpaIndex?.color
				? `rgb(${usEpaIndex.color.red},${usEpaIndex.color.green},${usEpaIndex.color.blue})`
				: "#808080",
			dominantPollutant: usEpaIndex?.dominantPollutant || "PM2.5",
			pm25: pm25?.concentration.value || 0,
			recommendation:
				data.healthRecommendations?.generalPopulation || "No recommendations",
			suitableForWork: workSuitability.suitable,
		};
	}

	/**
	 * Get HVAC filter replacement recommendation based on air quality
	 */
	getHVACFilterRecommendation(data: AirQualityData): {
		shouldReplace: boolean;
		urgency: "normal" | "soon" | "urgent";
		reason: string;
		upsellMessage?: string;
	} {
		const pm25 = data.pollutants.find((p) => p.code === "PM25");
		const pm25Value = pm25?.concentration.value || 0;
		const usEpaIndex = data.indexes.find((i) => i.code === "us-epa");
		const aqi = usEpaIndex?.aqi || 0;

		if (aqi > 150 || pm25Value > 35) {
			return {
				shouldReplace: true,
				urgency: "urgent",
				reason: "Poor air quality detected in area",
				upsellMessage:
					"Consider upgrading to a HEPA filter for better protection against high PM2.5 levels.",
			};
		}

		if (aqi > 100 || pm25Value > 25) {
			return {
				shouldReplace: true,
				urgency: "soon",
				reason: "Moderate air quality - filters working harder",
				upsellMessage:
					"Air quality in this area is moderate. A higher-rated filter (MERV 11+) can provide better filtration.",
			};
		}

		if (aqi > 50 || pm25Value > 12) {
			return {
				shouldReplace: false,
				urgency: "normal",
				reason: "Air quality is acceptable",
			};
		}

		return {
			shouldReplace: false,
			urgency: "normal",
			reason: "Air quality is good",
		};
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
export const googleAirQualityService = new GoogleAirQualityService();
