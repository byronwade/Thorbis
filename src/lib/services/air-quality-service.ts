/**
 * Air Quality Service
 *
 * Fetches air quality data from AirNow API (EPA)
 * - Air Quality Index (AQI)
 * - Primary pollutant
 * - Health recommendations
 *
 * API: FREE with API key (easy to get from airnowapi.org)
 * Docs: https://docs.airnowapi.org/
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

export const AirQualitySchema = z.object({
	aqi: z.number(), // 0-500 scale
	category: z.string(), // Good, Moderate, Unhealthy, etc.
	categoryNumber: z.number(), // 1-6
	primaryPollutant: z.string(), // PM2.5, Ozone, etc.
	healthRecommendations: z.string().optional(),
	reportingArea: z.string().optional(),
	stateCode: z.string().optional(),
	dataSource: z.string(),
	enrichedAt: z.string(),
});

export type AirQuality = z.infer<typeof AirQualitySchema>;

export class AirQualityService {
	private readonly apiKey: string | undefined;
	private readonly cache: Map<string, { data: AirQuality; timestamp: number }> = new Map();
	private readonly cacheTTL = 1000 * 60 * 60; // 1 hour (AQI updates hourly)

	constructor() {
		this.apiKey = process.env.AIRNOW_API_KEY;
	}

	async getAirQuality(lat: number, lon: number): Promise<AirQuality | null> {
		if (!this.apiKey) {
			return null;
		}

		const cacheKey = `airquality:${lat.toFixed(4)},${lon.toFixed(4)}`;
		const cached = this.cache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		try {
			// AirNow Current Observations API
			const url = `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${lat}&longitude=${lon}&distance=25&API_KEY=${this.apiKey}`;

			const res = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!res.ok) {
				return null;
			}

			const text = await res.text();
			if (!text || text.trim() === "") {
				return null;
			}

			let data: unknown;
			try {
				data = JSON.parse(text);
			} catch (_e) {
				return null;
			}

			if (!Array.isArray(data) || data.length === 0) {
				return null;
			}

			// Find the observation with the highest AQI (most concerning pollutant)
			const highestAQI = data.reduce((max, current) => (current.AQI > max.AQI ? current : max), data[0]);

			const airQuality: AirQuality = {
				aqi: highestAQI.AQI,
				category: highestAQI.Category.Name,
				categoryNumber: highestAQI.Category.Number,
				primaryPollutant: highestAQI.ParameterName,
				reportingArea: highestAQI.ReportingArea,
				stateCode: highestAQI.StateCode,
				healthRecommendations: this.getHealthRecommendations(highestAQI.Category.Number),
				dataSource: "airnow",
				enrichedAt: new Date().toISOString(),
			};

			this.cache.set(cacheKey, { data: airQuality, timestamp: Date.now() });

			return airQuality;
		} catch (_error) {
			return null;
		}
	}

	private getHealthRecommendations(categoryNumber: number): string {
		switch (categoryNumber) {
			case 1: // Good
				return "Air quality is satisfactory. Enjoy outdoor activities.";
			case 2: // Moderate
				return "Air quality is acceptable. Unusually sensitive people should consider limiting prolonged outdoor exertion.";
			case 3: // Unhealthy for Sensitive Groups
				return "Members of sensitive groups may experience health effects. Consider rescheduling outdoor work if workers are sensitive.";
			case 4: // Unhealthy
				return "Everyone may begin to experience health effects. Consider rescheduling outdoor work.";
			case 5: // Very Unhealthy
				return "Health alert: everyone may experience serious health effects. Reschedule outdoor work.";
			case 6: // Hazardous
				return "Health emergency: reschedule all outdoor work immediately.";
			default:
				return "Air quality data unavailable.";
		}
	}
}

export const airQualityService = new AirQualityService();
