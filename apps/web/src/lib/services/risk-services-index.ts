/**
 * Risk Assessment Services Index
 *
 * Central export file for all risk assessment and safety API services.
 * Includes government data (free) and specialized risk APIs.
 *
 * Services included:
 *
 * GOVERNMENT DATA (FREE):
 * - FEMA Flood - Flood zone and risk data from NFHL
 * - Census Bureau - Demographics, income, housing data
 * - FBI Crime - Crime statistics and safety data
 *
 * SPECIALIZED RISK APIS:
 * - Walk Score - Walkability, transit, and bike scores
 * - CrimeoMeter - Real-time crime incidents and safety scores
 * - PerilPulse - Environmental hazards and natural disaster risk
 *
 * Usage:
 * ```typescript
 * import {
 *   femaFloodService,
 *   censusBureauService,
 *   fbiCrimeService,
 *   walkScoreService,
 *   crimeoMeterService,
 *   perilPulseService,
 * } from "@/lib/services/risk-services-index";
 *
 * // Check flood zone for equipment placement
 * const floodData = await femaFloodService.getPropertyFloodData("123 Main St, Sacramento, CA");
 *
 * // Analyze service area market potential
 * const marketAnalysis = await censusBureauService.analyzeServiceMarket("123 Main St");
 *
 * // Check if evening appointments are safe
 * const eveningSafe = await fbiCrimeService.isEveningServiceSafe("CA");
 *
 * // Get parking recommendations
 * const parking = await walkScoreService.getParkingRecommendations("123 Main St");
 *
 * // Get real-time safety assessment
 * const safety = await crimeoMeterService.getServiceCallSafety("123 Main St", 38.5816, -121.4944);
 *
 * // Check for weather hazards before dispatch
 * const dispatch = await perilPulseService.checkDispatchSafety(38.5816, -121.4944);
 * ```
 */

// ============================================
// FEMA Flood Data (FREE)
// ============================================

export type {
	CommunityInfo,
	FloodEvent,
	FloodMapPanel,
	FloodRiskReport,
	FloodZoneCategory,
	FloodZoneInfo,
	PropertyFloodData,
	RiskAssessment as FloodRiskAssessment,
	WaterFeature,
} from "./fema-flood-service";
export { femaFloodService } from "./fema-flood-service";

// ============================================
// Census Bureau Data (FREE)
// ============================================

export type {
	DemographicData,
	GeographyInfo,
	HousingData,
	IncomeData,
	MarketAnalysis,
	ServiceAreaProfile,
} from "./census-bureau-service";
export { censusBureauService } from "./census-bureau-service";

// ============================================
// FBI Crime Data (FREE)
// ============================================

export type {
	AgencyInfo,
	CrimeCategory,
	CrimeStats,
	CrimeTrend,
	FieldServiceImplication,
	SafetyScore as FBISafetyScore,
	ServiceAreaSafetyReport,
	StateStats,
} from "./fbi-crime-service";
export { fbiCrimeService } from "./fbi-crime-service";

// ============================================
// Walk Score (API Key Required)
// ============================================

export type {
	BikeDetails,
	DetailedScore,
	LocationScores,
	PropertyAccessibility,
	TransitDetails,
	TransitLine,
	WalkScoreResult,
} from "./walk-score-service";
export { walkScoreService } from "./walk-score-service";

// ============================================
// CrimeoMeter (API Key Required)
// ============================================

export type {
	CrimeCategory as CrimeoMeterCategory,
	CrimeIncident,
	CrimeStats as CrimeoMeterCrimeStats,
	LocationSafetyReport,
	RiskAssessment as CrimeRiskAssessment,
	SafetyScore as CrimeoMeterSafetyScore,
	ServiceCallSafety,
} from "./crimeometer-service";
export { crimeoMeterService } from "./crimeometer-service";

// ============================================
// PerilPulse Environmental Risk (Mixed - Uses Free USGS/NOAA)
// ============================================

export type {
	EnvironmentalRiskReport,
	EquipmentRecommendation,
	HazardRisk,
	HazardType,
	PropertyHazardAssessment,
	RecentEvent,
	RiskLevel,
	SeasonalRisk,
} from "./perilpulse-service";
export { perilPulseService } from "./perilpulse-service";

// ============================================
// Configuration Checker
// ============================================

/**
 * Check if risk services are configured
 */
export function checkRiskServicesConfig(): {
	freeServices: string[];
	configuredPaidServices: string[];
	notConfiguredPaidServices: string[];
	summary: string;
} {
	const walkScoreKey = process.env.WALK_SCORE_API_KEY;
	const crimeoMeterKey = process.env.CRIMEOMETER_API_KEY;
	const perilPulseKey = process.env.PERILPULSE_API_KEY;

	const freeServices = [
		"FEMA Flood Maps",
		"Census Bureau ACS",
		"FBI Crime Data",
	];

	const paidServices = [
		{ name: "Walk Score", check: () => !!walkScoreKey },
		{ name: "CrimeoMeter", check: () => !!crimeoMeterKey },
		{ name: "PerilPulse", check: () => !!perilPulseKey },
	];

	const configuredPaidServices: string[] = [];
	const notConfiguredPaidServices: string[] = [];

	for (const service of paidServices) {
		if (service.check()) {
			configuredPaidServices.push(service.name);
		} else {
			notConfiguredPaidServices.push(service.name);
		}
	}

	const totalConfigured = freeServices.length + configuredPaidServices.length;
	const total = freeServices.length + paidServices.length;

	return {
		freeServices,
		configuredPaidServices,
		notConfiguredPaidServices,
		summary: `${totalConfigured}/${total} risk services available (${freeServices.length} free, ${configuredPaidServices.length} paid configured)`,
	};
}

/**
 * Get a summary of risk assessment services
 */
export function getRiskServicesSummary(): {
	total: number;
	categories: {
		name: string;
		free: boolean;
		services: {
			name: string;
			description: string;
			features: string[];
		}[];
	}[];
} {
	return {
		total: 6,
		categories: [
			{
				name: "Government Data (Free)",
				free: true,
				services: [
					{
						name: "FEMA Flood Maps",
						description: "National Flood Hazard Layer data",
						features: [
							"Flood zone determination",
							"Base flood elevation",
							"NFIP community status",
							"Equipment placement compliance",
							"Insurance requirements",
						],
					},
					{
						name: "Census Bureau ACS",
						description: "American Community Survey demographics",
						features: [
							"Income and demographics",
							"Housing characteristics",
							"Service area market analysis",
							"Customer income estimates",
							"Expansion opportunity analysis",
						],
					},
					{
						name: "FBI Crime Data",
						description: "Uniform Crime Reporting statistics",
						features: [
							"State crime statistics",
							"Crime trends over time",
							"Safety assessments",
							"Evening service safety",
							"Equipment theft risk",
						],
					},
				],
			},
			{
				name: "Specialized Risk APIs",
				free: false,
				services: [
					{
						name: "Walk Score",
						description: "Walkability and transit analysis",
						features: [
							"Walk/Transit/Bike scores",
							"Property accessibility",
							"Parking recommendations",
							"Travel difficulty estimates",
							"Neighborhood character",
						],
					},
					{
						name: "CrimeoMeter",
						description: "Real-time crime data and safety",
						features: [
							"Live crime incidents",
							"Safety scores and grades",
							"Service call safety checks",
							"Evening appointment safety",
							"Security upsell opportunities",
						],
					},
					{
						name: "PerilPulse",
						description: "Environmental hazards and disasters",
						features: [
							"Earthquake activity",
							"Weather alerts",
							"Property hazard assessment",
							"Seasonal service planning",
							"Dispatch safety checks",
						],
					},
				],
			},
		],
	};
}

/**
 * Get comprehensive risk assessment for a property
 * Combines data from multiple services
 */
export async function getComprehensiveRiskAssessment(
	address: string,
	lat: number,
	lng: number,
): Promise<{
	flood: Awaited<
		ReturnType<typeof femaFloodService.getPropertyFloodData>
	> | null;
	demographics: Awaited<
		ReturnType<typeof censusBureauService.getDemographics>
	> | null;
	environmental: Awaited<
		ReturnType<typeof perilPulseService.getEnvironmentalRiskReport>
	> | null;
	walkScore: Awaited<ReturnType<typeof walkScoreService.getWalkScore>> | null;
	crimeRealtime: Awaited<
		ReturnType<typeof crimeoMeterService.getSafetyScore>
	> | null;
}> {
	// Import services
	const { femaFloodService } = await import("./fema-flood-service");
	const { censusBureauService } = await import("./census-bureau-service");
	const { perilPulseService } = await import("./perilpulse-service");
	const { walkScoreService } = await import("./walk-score-service");
	const { crimeoMeterService } = await import("./crimeometer-service");

	// Fetch all data in parallel
	const [flood, demographics, environmental, walkScore, crimeRealtime] =
		await Promise.all([
			femaFloodService.getPropertyFloodData(address).catch(() => null),
			censusBureauService.getDemographics(lat, lng).catch(() => null),
			perilPulseService
				.getEnvironmentalRiskReport(lat, lng, address)
				.catch(() => null),
			walkScoreService.getWalkScore(address, lat, lng).catch(() => null),
			crimeoMeterService.getSafetyScore(lat, lng).catch(() => null),
		]);

	return {
		flood,
		demographics,
		environmental,
		walkScore,
		crimeRealtime,
	};
}
