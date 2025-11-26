/**
 * Job Environment API Route
 *
 * Fetches weather, air quality, and pollen data for a job location
 * using Google APIs via the job enrichment service
 */

import { type NextRequest, NextResponse } from "next/server";
import { googleAirQualityService } from "@/lib/services/google-air-quality-service";
import { googlePollenService } from "@/lib/services/google-pollen-service";
import { googleWeatherService } from "@/lib/services/google-weather-service";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const lat = searchParams.get("lat");
	const lon = searchParams.get("lon");

	if (!lat || !lon) {
		return NextResponse.json(
			{ error: "Missing lat or lon parameters" },
			{ status: 400 },
		);
	}

	const latitude = parseFloat(lat);
	const longitude = parseFloat(lon);

	if (isNaN(latitude) || isNaN(longitude)) {
		return NextResponse.json(
			{ error: "Invalid lat or lon values" },
			{ status: 400 },
		);
	}

	try {
		// Fetch all data in parallel
		const [weather, airQuality, pollen] = await Promise.all([
			googleWeatherService
				.getWeatherData(latitude, longitude)
				.catch(() => null),
			googleAirQualityService
				.getAirQuality(latitude, longitude)
				.catch(() => null),
			googlePollenService.getPollenData(latitude, longitude).catch(() => null),
		]);

		// Build response
		const response: {
			weather?: {
				temperature: number;
				feelsLike: number;
				humidity: number;
				windSpeed: number;
				conditions: string;
				icon: string;
				alerts: Array<{ headline: string; severity: string }>;
			};
			airQuality?: {
				aqi: number;
				category: string;
				dominantPollutant: string;
				healthRecommendation?: string;
			};
			pollen?: {
				tree: { level: string; index: number };
				grass: { level: string; index: number };
				weed: { level: string; index: number };
				overallLevel: string;
			};
			recommendations: {
				safetyWarnings: string[];
				hvacRecommendations: Array<{
					type: string;
					reason: string;
					urgency: "low" | "medium" | "high";
				}>;
			};
		} = {
			recommendations: {
				safetyWarnings: [],
				hvacRecommendations: [],
			},
		};

		// Format weather data
		if (weather) {
			response.weather = {
				temperature: weather.current.temperature,
				feelsLike: weather.current.feelsLike,
				humidity: weather.current.humidity,
				windSpeed: weather.current.windSpeed,
				conditions: weather.current.conditions,
				icon: weather.current.icon,
				alerts: weather.alerts,
			};

			// Check weather suitability
			const suitability =
				googleWeatherService.isSuitableForOutdoorWork(weather);
			if (!suitability.suitable && suitability.reason) {
				response.recommendations.safetyWarnings.push(suitability.reason);
			}

			// Add weather alerts
			if (weather.alerts.length > 0) {
				for (const alert of weather.alerts.slice(0, 2)) {
					response.recommendations.safetyWarnings.push(
						`Weather: ${alert.headline}`,
					);
				}
			}
		}

		// Format air quality data
		if (airQuality) {
			response.airQuality = {
				aqi: airQuality.indexes[0]?.aqi || 0,
				category: airQuality.indexes[0]?.category || "Unknown",
				dominantPollutant:
					airQuality.indexes[0]?.dominantPollutant || "Unknown",
				healthRecommendation:
					airQuality.healthRecommendations?.generalPopulation,
			};

			// Check air quality suitability
			const aqSuitability =
				googleAirQualityService.isSuitableForOutdoorWork(airQuality);
			if (!aqSuitability.suitable && aqSuitability.reason) {
				response.recommendations.safetyWarnings.push(aqSuitability.reason);
			}

			// Get HVAC filter recommendation
			const filterRec =
				googleAirQualityService.getHVACFilterRecommendation(airQuality);
			if (filterRec.recommendation !== "Standard filters are adequate") {
				response.recommendations.hvacRecommendations.push({
					type: "Air Filter Upgrade",
					reason: filterRec.recommendation,
					urgency: filterRec.upgradeUrgency as "low" | "medium" | "high",
				});
			}
		}

		// Format pollen data
		if (pollen) {
			const todaySummary = googlePollenService.getTodaysSummary(pollen);
			response.pollen = {
				tree: {
					level:
						pollen.dailyInfo[0]?.pollenTypeInfo?.find(
							(p: { code: string }) => p.code === "TREE",
						)?.indexInfo?.category || "none",
					index:
						pollen.dailyInfo[0]?.pollenTypeInfo?.find(
							(p: { code: string }) => p.code === "TREE",
						)?.indexInfo?.value || 0,
				},
				grass: {
					level:
						pollen.dailyInfo[0]?.pollenTypeInfo?.find(
							(p: { code: string }) => p.code === "GRASS",
						)?.indexInfo?.category || "none",
					index:
						pollen.dailyInfo[0]?.pollenTypeInfo?.find(
							(p: { code: string }) => p.code === "GRASS",
						)?.indexInfo?.value || 0,
				},
				weed: {
					level:
						pollen.dailyInfo[0]?.pollenTypeInfo?.find(
							(p: { code: string }) => p.code === "WEED",
						)?.indexInfo?.category || "none",
					index:
						pollen.dailyInfo[0]?.pollenTypeInfo?.find(
							(p: { code: string }) => p.code === "WEED",
						)?.indexInfo?.value || 0,
				},
				overallLevel: todaySummary.overallLevel,
			};

			// Get HVAC upsell recommendation
			const pollenUpsell =
				googlePollenService.getHVACUpsellRecommendation(pollen);
			if (pollenUpsell.shouldRecommend) {
				response.recommendations.hvacRecommendations.push({
					type: pollenUpsell.productType,
					reason: pollenUpsell.reason,
					urgency: pollenUpsell.urgency,
				});
			}

			// Add very high pollen warning
			if (todaySummary.overallLevel === "very_high") {
				response.recommendations.safetyWarnings.push(
					`Very high pollen levels: ${todaySummary.description}`,
				);
			}
		}

		return NextResponse.json(response);
	} catch (error) {
		console.error("Error fetching environment data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch environment data" },
			{ status: 500 },
		);
	}
}
