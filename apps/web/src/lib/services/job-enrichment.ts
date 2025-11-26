/**
 * Job Enrichment Service
 *
 * Orchestrates all operational intelligence services for jobs:
 * - Weather data and alerts (Google Weather + NWS fallback)
 * - Air quality and pollen data (Google APIs)
 * - Solar potential analysis (Google Solar API)
 * - Routes and ETA (Google Routes API)
 * - Water quality and upsell opportunities
 * - Address validation
 * - Location intelligence (flood zones, county)
 * - Routing and nearby suppliers
 */

import { z } from "zod";
import { addressValidationService } from "./address-validation-service";
import { airQualityService } from "./air-quality-service";
import { buildingDataService } from "./building-data-service";
import { demographicsService } from "./demographics-service";
import { elevationService } from "./elevation-service";
import { googleAirQualityService } from "./google-air-quality-service";
import { googlePlacesService } from "./google-places-service";
import { googlePollenService } from "./google-pollen-service";
// NEW: Google API services
import { googleRoutesService } from "./google-routes-service";
import { googleSolarService } from "./google-solar-service";
import { googleStreetViewService } from "./google-streetview-service";
import { googleWeatherService } from "./google-weather-service";
import { locationServices } from "./location-services";
import { propertyDataService } from "./property-data-service";
import { routingService } from "./routing-service";
import { schoolsService } from "./schools-service";
import { timeZoneService } from "./timezone-service";
import { trafficService } from "./traffic-service";
import { walkabilityService } from "./walkability-service";
import { waterQualityService } from "./water-quality-service";
import { weatherService } from "./weather-service";

// ============================================================================
// Types and Schemas
// ============================================================================

const JobEnrichmentSchema = z.object({
	jobId: z.string().uuid(),

	// Property location data
	location: z.object({
		lat: z.number(),
		lon: z.number(),
		address: z.string(),
	}),

	// Property data (characteristics, assessment, market value)
	propertyData: z.any().optional(), // PropertyData

	// Building data from OpenStreetMap
	buildingData: z.any().optional(), // BuildingData

	// Weather data (Google Weather API + fallbacks)
	weather: z.any().optional(), // WeatherData

	// Water quality (for upsells)
	waterQuality: z.any().optional(), // WaterQuality

	// Address validation
	addressValidation: z.any().optional(), // AddressValidation

	// Location intelligence
	locationIntelligence: z.any().optional(), // LocationIntelligence

	// Nearby suppliers
	nearbySuppliers: z.array(z.any()).optional(), // NearbySupplier[]

	// Demographics data
	demographics: z.any().optional(), // Demographics

	// Air quality (Google Air Quality API)
	airQuality: z.any().optional(), // AirQuality

	// Pollen data (Google Pollen API) - NEW
	pollen: z.any().optional(), // PollenData

	// Solar potential (Google Solar API) - NEW
	solar: z.any().optional(), // SolarData

	// Elevation
	elevation: z.any().optional(), // Elevation

	// Walkability
	walkability: z.any().optional(), // Walkability

	// Nearby schools
	schools: z.any().optional(), // SchoolsData

	// Google Street View
	streetView: z.any().optional(), // StreetView

	// Google Places (suppliers with reviews)
	googlePlaces: z.any().optional(), // GooglePlaces

	// Time Zone
	timeZone: z.any().optional(), // TimeZoneInfo

	// Traffic incidents
	traffic: z.any().optional(), // TrafficData

	// Recommendations
	recommendations: z.object({
		shouldReschedule: z.boolean(),
		rescheduleReason: z.string().optional(),
		upsellOpportunities: z.array(z.string()),
		safetyWarnings: z.array(z.string()),
		// NEW: Detailed recommendation objects
		hvacRecommendations: z
			.array(
				z.object({
					type: z.string(),
					reason: z.string(),
					urgency: z.enum(["low", "medium", "high"]),
					estimatedValue: z.number().optional(),
				}),
			)
			.optional(),
		solarRecommendation: z
			.object({
				suitable: z.boolean(),
				summary: z.string(),
				estimatedSavings: z.number().optional(),
				panelCount: z.number().optional(),
			})
			.optional(),
	}),

	// Metadata
	enrichmentStatus: z.enum(["pending", "in_progress", "completed", "failed"]),
	enrichedAt: z.string().optional(),
	sources: z.array(z.string()),
});

export type JobEnrichment = z.infer<typeof JobEnrichmentSchema>;

// ============================================================================
// Job Enrichment Service
// ============================================================================

// Cache for enrichment results (5 minute TTL)
const enrichmentCache = new Map<
	string,
	{ data: JobEnrichment; expires: number }
>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

class JobEnrichmentService {
	/**
	 * Get cache key for job enrichment
	 */
	private getCacheKey(job: { id: string; lat?: number; lon?: number }): string {
		return `enrichment:${job.id}:${job.lat || 0}:${job.lon || 0}`;
	}

	/**
	 * Enrich a job with all available operational intelligence
	 * Optimized for speed with caching and parallel execution
	 */
	async enrichJob(job: {
		id: string;
		address: string;
		address2?: string;
		city: string;
		state: string;
		zipCode: string;
		lat?: number;
		lon?: number;
	}): Promise<JobEnrichment> {
		// Check cache first for instant response
		const cacheKey = this.getCacheKey(job);
		const cached = enrichmentCache.get(cacheKey);
		if (cached && cached.expires > Date.now()) {
			return cached.data;
		}

		const sources: string[] = [];
		const upsellOpportunities: string[] = [];
		const safetyWarnings: string[] = [];
		let shouldReschedule = false;
		let rescheduleReason: string | undefined;

		try {
			// Step 1: Get or validate coordinates
			let lat = job.lat;
			let lon = job.lon;

			if (lat && lon) {
				// Coordinates already available from property - no geocoding needed
				sources.push("property_coordinates");
			} else {
				const fullAddress = `${job.address}, ${job.city}, ${job.state} ${job.zipCode}`;

				const geocoded = await locationServices.geocode(fullAddress);

				if (geocoded) {
					lat = geocoded.lat;
					lon = geocoded.lon;
					sources.push("nominatim");
				} else {
					return {
						jobId: job.id,
						location: {
							lat: 0,
							lon: 0,
							address: fullAddress,
						},
						recommendations: {
							shouldReschedule: false,
							upsellOpportunities: [],
							safetyWarnings: [
								"Unable to geocode address - enrichment unavailable",
								"Nominatim geocoding service may be rate-limited or unavailable",
								"To fix: Add latitude/longitude coordinates to the property, or try again in a few minutes",
							],
						},
						enrichmentStatus: "failed",
						sources: [],
					};
				}
			}

			const [
				propertyData,
				buildingData,
				weather,
				waterQuality,
				addressValidation,
				locationIntelligence,
				nearbySuppliers,
				demographics,
				airQuality,
				pollen,
				solar,
				elevation,
				walkability,
				schools,
				streetView,
				googlePlaces,
				timeZone,
				traffic,
			] = await Promise.all([
				propertyDataService
					.getPropertyData(
						job.address,
						job.city,
						job.state,
						job.zipCode,
						lat,
						lon,
					)
					.catch((_e) => null),
				buildingDataService.getBuildingData(lat, lon).catch((_e) => null),
				// Use Google Weather Service (with Open-Meteo/NWS fallback)
				googleWeatherService
					.getWeatherData(lat, lon)
					.catch((_e) => null),
				waterQualityService.getWaterQuality(lat, lon).catch((_e) => null),
				addressValidationService
					.validateAddress({
						address2: job.address,
						address1: job.address2,
						city: job.city,
						state: job.state,
						zip5: job.zipCode,
					})
					.catch((_e) => null),
				locationServices.getLocationIntelligence(lat, lon).catch((_e) => null),
				routingService.findNearbySuppliers(lat, lon, 8000).catch((_e) => []),
				// Demographics
				demographicsService
					.getDemographics(lat, lon)
					.catch((_e) => null),
				// Google Air Quality API (with fallback)
				googleAirQualityService
					.getAirQuality(lat, lon)
					.catch((_e) => null),
				// Google Pollen API - NEW
				googlePollenService
					.getPollenData(lat, lon)
					.catch((_e) => null),
				// Google Solar API - NEW
				googleSolarService
					.getSolarData(lat, lon)
					.catch((_e) => null),
				elevationService.getElevation(lat, lon).catch((_e) => null),
				walkabilityService.getWalkability(lat, lon).catch((_e) => null),
				schoolsService.getNearbySchools(lat, lon).catch((_e) => null),
				// GOOGLE SERVICES
				googleStreetViewService
					.getStreetView(lat, lon, `${job.address}, ${job.city}, ${job.state}`)
					.catch((_e) => null),
				googlePlacesService
					.findNearbySuppliers(lat, lon, 8000)
					.catch((_e) => null),
				timeZoneService.getTimeZone(lat, lon).catch((_e) => null),
				trafficService.getTrafficIncidents(lat, lon).catch((_e) => null),
			]);

			if (propertyData) {
				// Track sources
				sources.push(propertyData.dataSource);
			}
			if (buildingData) {
				sources.push("osm");
			}
			if (weather) {
				sources.push("google-weather");
			}
			if (waterQuality) {
				sources.push("usgs");
			}
			if (addressValidation?.isValid) {
				sources.push("usps");
			}
			if (locationIntelligence) {
				sources.push("fcc", "fema");
			}
			if (nearbySuppliers.length > 0) {
				sources.push("overpass");
			}
			if (demographics) {
				sources.push("census");
			}
			if (airQuality) {
				sources.push("google-air-quality");
			}
			if (pollen) {
				sources.push("google-pollen");
			}
			if (solar) {
				sources.push("google-solar");
			}
			if (elevation) {
				sources.push("usgs-elevation");
			}
			if (walkability) {
				sources.push("osm-walkability");
			}
			if (schools) {
				sources.push("osm-schools");
			}
			if (streetView?.available) {
				sources.push("google-streetview");
			}
			if (googlePlaces) {
				sources.push("google-places");
			}
			if (timeZone) {
				sources.push("google-timezone");
			}
			if (traffic) {
				sources.push("google-traffic");
			}

			// Initialize detailed recommendations
			const hvacRecommendations: Array<{
				type: string;
				reason: string;
				urgency: "low" | "medium" | "high";
				estimatedValue?: number;
			}> = [];
			let solarRecommendation:
				| {
						suitable: boolean;
						summary: string;
						estimatedSavings?: number;
						panelCount?: number;
				  }
				| undefined;

			if (weather && weather.alerts && weather.alerts.length > 0) {
				// Weather-based recommendations
				const highestAlert = weather.alerts[0];
				if (
					weather.highestSeverity === "Extreme" ||
					weather.highestSeverity === "Severe"
				) {
					shouldReschedule = true;
					rescheduleReason = `Severe weather alert: ${highestAlert.headline}`;
					safetyWarnings.push(highestAlert.headline);
				} else {
					safetyWarnings.push(`Weather advisory: ${highestAlert.headline}`);
				}
			}

			if (weather) {
				// Check outdoor work suitability using Google Weather Service
				const suitability =
					googleWeatherService.isSuitableForOutdoorWork(weather);
				if (!suitability.suitable) {
					safetyWarnings.push(
						suitability.reason || "Weather may impact outdoor work",
					);
				}
			}

			// Air Quality recommendations (Google Air Quality API)
			if (airQuality) {
				const aqSuitability =
					googleAirQualityService.isSuitableForOutdoorWork(airQuality);
				if (!aqSuitability.suitable) {
					safetyWarnings.push(
						aqSuitability.reason || "Poor air quality may impact outdoor work",
					);
				}

				// HVAC filter recommendation based on air quality
				const filterRec =
					googleAirQualityService.getHVACFilterRecommendation(airQuality);
				if (filterRec.recommendation !== "Standard filters are adequate") {
					hvacRecommendations.push({
						type: "Air Filter Upgrade",
						reason: filterRec.recommendation,
						urgency:
							filterRec.upgradeUrgency === "high"
								? "high"
								: filterRec.upgradeUrgency === "medium"
									? "medium"
									: "low",
						estimatedValue: filterRec.suggestedFilter === "HEPA" ? 150 : 75,
					});
					upsellOpportunities.push(
						`Air Filter: ${filterRec.recommendation} (Suggested: ${filterRec.suggestedFilter})`,
					);
				}
			}

			// Pollen-based HVAC recommendations (Google Pollen API)
			if (pollen) {
				const pollenUpsell =
					googlePollenService.getHVACUpsellRecommendation(pollen);
				if (pollenUpsell.shouldRecommend) {
					hvacRecommendations.push({
						type: "Air Filtration",
						reason: pollenUpsell.reason,
						urgency: pollenUpsell.urgency,
						estimatedValue: pollenUpsell.estimatedValue,
					});
					upsellOpportunities.push(
						`${pollenUpsell.productType}: ${pollenUpsell.reason} (Est. value: $${pollenUpsell.estimatedValue})`,
					);
				}

				// Check if pollen is too high for outdoor work
				const todaysSummary = googlePollenService.getTodaysSummary(pollen);
				if (todaysSummary.overallLevel === "very_high") {
					safetyWarnings.push(
						`Very high pollen levels: ${todaysSummary.description}`,
					);
				}
			}

			// Solar potential analysis (Google Solar API)
			if (solar && googleSolarService.isSuitableForSolar(solar)) {
				const solarSummary = googleSolarService.getSolarSummary(solar);
				const financialAnalysis =
					googleSolarService.getFinancialAnalysis(solar);

				solarRecommendation = {
					suitable: true,
					summary: solarSummary,
					estimatedSavings: financialAnalysis?.twentyYearSavings,
					panelCount:
						solar.buildingInsights?.solarPotential?.maxArrayPanelsCount,
				};

				if (financialAnalysis && financialAnalysis.twentyYearSavings > 5000) {
					upsellOpportunities.push(
						`Solar Installation: ${solarSummary} (Est. 20-year savings: $${financialAnalysis.twentyYearSavings.toLocaleString()})`,
					);
				}
			} else if (solar) {
				solarRecommendation = {
					suitable: false,
					summary:
						"Property may not be ideal for solar installation based on roof characteristics",
				};
			}

			if (waterQuality?.recommendations?.shouldInstallSoftener) {
				// Water quality upsell
				upsellOpportunities.push(
					`Water Softener: ${waterQuality.recommendations.reason} (Save $${(waterQuality.recommendations.estimatedAnnualSavings || 0) / 100}/year)`,
				);
			}

			if (locationIntelligence?.floodZone?.inFloodZone) {
				// Flood zone warning
				const zone = locationIntelligence.floodZone;
				if (zone.riskLevel === "high") {
					safetyWarnings.push(`Flood Zone ${zone.zone}: ${zone.description}`);
				}
			}

			if (addressValidation && !addressValidation.isValid) {
				// Address validation warning
				safetyWarnings.push(
					`Address validation failed: ${addressValidation.error || "Invalid address"}`,
				);
			}

			if (propertyData) {
				// Property data-based upsells
				const estimates =
					propertyDataService.estimateCharacteristics(propertyData);

				if (
					estimates.recommendMaintenance &&
					estimates.recommendMaintenance.length > 0
				) {
					// Add maintenance recommendations as upsell opportunities
					for (const maintenance of estimates.recommendMaintenance) {
						upsellOpportunities.push(maintenance);
					}
				}
			}

			const enrichment: JobEnrichment = JobEnrichmentSchema.parse({
				jobId: job.id,
				location: {
					lat,
					lon,
					address: `${job.address}, ${job.city}, ${job.state}`,
				},
				propertyData,
				buildingData,
				weather,
				waterQuality,
				addressValidation,
				locationIntelligence,
				nearbySuppliers,
				demographics,
				airQuality,
				pollen,
				solar,
				elevation,
				walkability,
				schools,
				streetView,
				googlePlaces,
				timeZone,
				traffic,
				recommendations: {
					shouldReschedule,
					rescheduleReason,
					upsellOpportunities,
					safetyWarnings,
					hvacRecommendations:
						hvacRecommendations.length > 0 ? hvacRecommendations : undefined,
					solarRecommendation,
				},
				enrichmentStatus: "completed",
				enrichedAt: new Date().toISOString(),
				sources,
			});

			// Cache the result for 5 minutes
			enrichmentCache.set(cacheKey, {
				data: enrichment,
				expires: Date.now() + CACHE_TTL_MS,
			});

			return enrichment;
		} catch (_error) {
			return {
				jobId: job.id,
				location: {
					lat: job.lat || 0,
					lon: job.lon || 0,
					address: `${job.address}, ${job.city}, ${job.state}`,
				},
				recommendations: {
					shouldReschedule: false,
					upsellOpportunities: [],
					safetyWarnings: ["Enrichment failed"],
				},
				enrichmentStatus: "failed",
				sources: [],
			};
		}
	}

	/**
	 * Quick weather check for a job (faster, only gets alerts)
	 */
	async getWeatherAlerts(lat: number, lon: number) {
		try {
			const weather = await googleWeatherService.getWeatherData(lat, lon);
			return weather?.alerts || [];
		} catch (_error) {
			return [];
		}
	}

	/**
	 * Get full weather data for a location
	 */
	async getWeatherData(lat: number, lon: number) {
		try {
			return await googleWeatherService.getWeatherData(lat, lon);
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Calculate travel time from tech location to job using Google Routes API
	 */
	async getTravelTime(
		from: { lat: number; lon: number },
		to: { lat: number; lon: number },
	) {
		try {
			return await googleRoutesService.getRoute(from, to);
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Get ETA from tech location to job with traffic consideration
	 */
	async getETA(
		from: { lat: number; lon: number },
		to: { lat: number; lon: number },
	) {
		try {
			return await googleRoutesService.getETA(from, to);
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Rank technicians by ETA to a job location
	 */
	async rankTechniciansByETA(
		technicianLocations: Array<{
			id: string;
			name: string;
			lat: number;
			lon: number;
		}>,
		jobLocation: { lat: number; lon: number },
	) {
		try {
			return await googleRoutesService.rankTechniciansByETA(
				technicianLocations,
				jobLocation,
			);
		} catch (_error) {
			return [];
		}
	}

	/**
	 * Get optimized multi-stop route for a technician
	 */
	async getOptimizedRoute(
		stops: Array<{
			lat: number;
			lon: number;
			address?: string;
			jobId?: string;
		}>,
		optimizeOrder = true,
	) {
		try {
			return await googleRoutesService.getMultiStopRoute(stops, optimizeOrder);
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Get air quality data for a location
	 */
	async getAirQuality(lat: number, lon: number) {
		try {
			return await googleAirQualityService.getAirQuality(lat, lon);
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Get pollen data for a location
	 */
	async getPollenData(lat: number, lon: number) {
		try {
			return await googlePollenService.getPollenData(lat, lon);
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Get solar potential for a location
	 */
	async getSolarPotential(lat: number, lon: number) {
		try {
			return await googleSolarService.getSolarData(lat, lon);
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Generate a solar proposal summary for a property
	 */
	async getSolarProposal(lat: number, lon: number) {
		try {
			const solarData = await googleSolarService.getSolarData(lat, lon);
			if (!solarData) return null;
			return googleSolarService.generateProposalSummary(solarData);
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Get weather summary for display
	 */
	getWeatherSummary(weather: NonNullable<JobEnrichment["weather"]>) {
		return googleWeatherService.getWeatherSummary(weather);
	}

	/**
	 * Check if weather is suitable for outdoor work
	 */
	isWeatherSuitableForWork(weather: NonNullable<JobEnrichment["weather"]>) {
		return googleWeatherService.isSuitableForOutdoorWork(weather);
	}

	/**
	 * Get HVAC filter recommendations based on air quality
	 */
	getHVACFilterRecommendation(
		airQuality: NonNullable<JobEnrichment["airQuality"]>,
	) {
		return googleAirQualityService.getHVACFilterRecommendation(airQuality);
	}

	/**
	 * Get HVAC upsell recommendations based on pollen levels
	 */
	getPollenUpsellRecommendation(pollen: NonNullable<JobEnrichment["pollen"]>) {
		return googlePollenService.getHVACUpsellRecommendation(pollen);
	}
}

// Singleton instance
export const jobEnrichmentService = new JobEnrichmentService();
