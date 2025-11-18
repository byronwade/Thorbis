/**
 * Job Enrichment Service
 *
 * Orchestrates all operational intelligence services for jobs:
 * - Weather data and alerts
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
import { googlePlacesService } from "./google-places-service";
import { googleStreetViewService } from "./google-streetview-service";
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

export const JobEnrichmentSchema = z.object({
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

	// Weather data
	weather: z.any().optional(), // WeatherData

	// Water quality (for upsells)
	waterQuality: z.any().optional(), // WaterQuality

	// Address validation
	addressValidation: z.any().optional(), // AddressValidation

	// Location intelligence
	locationIntelligence: z.any().optional(), // LocationIntelligence

	// Nearby suppliers
	nearbySuppliers: z.array(z.any()).optional(), // NearbySupplier[]

	// NEW: Demographics data
	demographics: z.any().optional(), // Demographics

	// NEW: Air quality
	airQuality: z.any().optional(), // AirQuality

	// NEW: Elevation
	elevation: z.any().optional(), // Elevation

	// NEW: Walkability
	walkability: z.any().optional(), // Walkability

	// NEW: Nearby schools
	schools: z.any().optional(), // SchoolsData

	// NEW: Google Street View
	streetView: z.any().optional(), // StreetView

	// NEW: Google Places (suppliers with reviews)
	googlePlaces: z.any().optional(), // GooglePlaces

	// NEW: Time Zone
	timeZone: z.any().optional(), // TimeZoneInfo

	// NEW: Traffic incidents
	traffic: z.any().optional(), // TrafficData

	// Recommendations
	recommendations: z.object({
		shouldReschedule: z.boolean(),
		rescheduleReason: z.string().optional(),
		upsellOpportunities: z.array(z.string()),
		safetyWarnings: z.array(z.string()),
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

export class JobEnrichmentService {
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
				// TODO: Handle error case
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
				weatherService.getWeatherData(lat, lon).catch((_e) => null),
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
				// NEW SERVICES
				demographicsService
					.getDemographics(lat, lon)
					.catch((_e) => null),
				airQualityService.getAirQuality(lat, lon).catch((_e) => null),
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
				sources.push("nws");
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
				sources.push("airnow");
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

			if (weather && weather.alerts.length > 0) {
				// Step 3: Generate recommendations
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
				// Check outdoor work suitability
				const suitability = weatherService.isSuitableForOutdoorWork(weather);
				if (!suitability.suitable) {
					safetyWarnings.push(
						suitability.reason || "Weather may impact outdoor work",
					);
				}
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
			return await weatherService.getActiveAlerts(lat, lon);
		} catch (_error) {
			return [];
		}
	}

	/**
	 * Calculate travel time from tech location to job
	 */
	async getTravelTime(
		from: { lat: number; lon: number },
		to: { lat: number; lon: number },
	) {
		try {
			return await routingService.getRoute(from, to);
		} catch (_error) {
			return null;
		}
	}
}

// Singleton instance
export const jobEnrichmentService = new JobEnrichmentService();
