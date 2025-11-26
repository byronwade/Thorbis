/**
 * PerilPulse API Service
 *
 * Environmental and natural hazard risk assessment API.
 * Provides comprehensive risk data for earthquakes, wildfires,
 * hurricanes, tornadoes, and other natural disasters.
 *
 * @see https://perilpulse.com/api-documentation (hypothetical)
 *
 * Note: PerilPulse is a conceptual/emerging API. This implementation
 * provides a standardized interface that can be connected to actual
 * environmental risk APIs like:
 * - USGS Earthquake Hazards
 * - NOAA Storm Prediction
 * - EPA Environmental Data
 * - State Fire Marshal Data
 */

// Alternative free data sources used
const USGS_EARTHQUAKE_URL = "https://earthquake.usgs.gov/fdsnws/event/1";
const NOAA_WEATHER_URL = "https://api.weather.gov";

export type HazardType =
	| "earthquake"
	| "wildfire"
	| "hurricane"
	| "tornado"
	| "flood"
	| "hail"
	| "winter-storm"
	| "extreme-heat"
	| "drought"
	| "landslide"
	| "volcanic";

export type RiskLevel =
	| "minimal"
	| "low"
	| "moderate"
	| "high"
	| "severe"
	| "extreme";

export interface HazardRisk {
	hazardType: HazardType;
	riskLevel: RiskLevel;
	riskScore: number; // 0-100
	description: string;
	historicalFrequency?: string;
	lastMajorEvent?: string;
	mitigationRecommendations: string[];
}

export interface EnvironmentalRiskReport {
	lat: number;
	lng: number;
	address?: string;
	overallRiskScore: number; // 0-100
	overallRiskLevel: RiskLevel;
	hazards: HazardRisk[];
	climateZone: string;
	seismicZone?: string;
	windZone?: string;
	recommendations: string[];
}

export interface RecentEvent {
	id: string;
	type: HazardType;
	date: string;
	magnitude?: number;
	description: string;
	distance: number; // km from location
	impact?: string;
}

export interface SeasonalRisk {
	season: "spring" | "summer" | "fall" | "winter";
	primaryHazards: HazardType[];
	riskLevel: RiskLevel;
	notes: string[];
}

export interface PropertyHazardAssessment {
	address: string;
	overallRisk: RiskLevel;
	primaryConcerns: HazardRisk[];
	equipmentRecommendations: EquipmentRecommendation[];
	maintenanceConsiderations: string[];
	insuranceNotes: string[];
}

export interface EquipmentRecommendation {
	equipment: string;
	reason: string;
	hazardType: HazardType;
	priority: "required" | "recommended" | "optional";
}

class PerilPulseService {
	private apiKey: string;

	constructor() {
		this.apiKey = process.env.PERILPULSE_API_KEY || "";
	}

	/**
	 * Get recent earthquake activity near a location
	 * Uses USGS Earthquake API (free, no key required)
	 */
	async getRecentEarthquakes(
		lat: number,
		lng: number,
		options: {
			radiusKm?: number;
			days?: number;
			minMagnitude?: number;
		} = {},
	): Promise<RecentEvent[]> {
		const { radiusKm = 250, days = 30, minMagnitude = 2.5 } = options;

		try {
			const endDate = new Date().toISOString().split("T")[0];
			const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
				.toISOString()
				.split("T")[0];

			const url = new URL(`${USGS_EARTHQUAKE_URL}/query`);
			url.searchParams.set("format", "geojson");
			url.searchParams.set("latitude", lat.toString());
			url.searchParams.set("longitude", lng.toString());
			url.searchParams.set("maxradiuskm", radiusKm.toString());
			url.searchParams.set("starttime", startDate);
			url.searchParams.set("endtime", endDate);
			url.searchParams.set("minmagnitude", minMagnitude.toString());
			url.searchParams.set("orderby", "time");

			const response = await fetch(url.toString());

			if (!response.ok) {
				throw new Error(`USGS API error: ${response.status}`);
			}

			const data = await response.json();

			if (!data.features || !Array.isArray(data.features)) {
				return [];
			}

			return data.features.map((feature: Record<string, unknown>) => {
				const props = feature.properties as Record<string, unknown>;
				const coords = (feature.geometry as Record<string, unknown>)
					.coordinates as number[];

				// Calculate distance
				const distance = this.calculateDistance(lat, lng, coords[1], coords[0]);

				return {
					id: feature.id as string,
					type: "earthquake" as HazardType,
					date: new Date(props.time as number).toISOString(),
					magnitude: props.mag as number,
					description: props.place as string,
					distance: Math.round(distance),
					impact: this.getEarthquakeImpact(props.mag as number),
				};
			});
		} catch (error) {
			console.error("Error fetching earthquake data:", error);
			return [];
		}
	}

	/**
	 * Get weather alerts for a location
	 * Uses NOAA Weather API (free, no key required)
	 */
	async getWeatherAlerts(lat: number, lng: number): Promise<RecentEvent[]> {
		try {
			// First get the forecast zone
			const pointResponse = await fetch(
				`${NOAA_WEATHER_URL}/points/${lat},${lng}`,
			);

			if (!pointResponse.ok) {
				return [];
			}

			const pointData = await pointResponse.json();
			const forecastZone = pointData.properties?.forecastZone;

			if (!forecastZone) {
				return [];
			}

			// Get alerts for the zone
			const zoneId = forecastZone.split("/").pop();
			const alertResponse = await fetch(
				`${NOAA_WEATHER_URL}/alerts/active/zone/${zoneId}`,
			);

			if (!alertResponse.ok) {
				return [];
			}

			const alertData = await alertResponse.json();

			if (!alertData.features) {
				return [];
			}

			return alertData.features.map((feature: Record<string, unknown>) => {
				const props = feature.properties as Record<string, unknown>;

				return {
					id: props.id as string,
					type: this.mapWeatherEventType(props.event as string),
					date: props.effective as string,
					description: `${props.event}: ${props.headline}`,
					distance: 0,
					impact: props.severity as string,
				};
			});
		} catch (error) {
			console.error("Error fetching weather alerts:", error);
			return [];
		}
	}

	/**
	 * Get comprehensive environmental risk assessment
	 */
	async getEnvironmentalRiskReport(
		lat: number,
		lng: number,
		address?: string,
	): Promise<EnvironmentalRiskReport> {
		const [earthquakes, weatherAlerts] = await Promise.all([
			this.getRecentEarthquakes(lat, lng, { radiusKm: 500, days: 365 }),
			this.getWeatherAlerts(lat, lng),
		]);

		const hazards: HazardRisk[] = [];

		// Assess earthquake risk
		const earthquakeRisk = this.assessEarthquakeRisk(earthquakes, lat, lng);
		hazards.push(earthquakeRisk);

		// Assess other hazards based on location
		const locationHazards = this.assessLocationBasedHazards(lat, lng);
		hazards.push(...locationHazards);

		// Add any active weather hazards
		const activeWeatherHazards = this.assessWeatherHazards(weatherAlerts);
		hazards.push(...activeWeatherHazards);

		// Calculate overall risk
		const overallRiskScore = this.calculateOverallRisk(hazards);
		const overallRiskLevel = this.scoreToRiskLevel(overallRiskScore);

		// Generate recommendations
		const recommendations = this.generateRecommendations(hazards);

		return {
			lat,
			lng,
			address,
			overallRiskScore,
			overallRiskLevel,
			hazards,
			climateZone: this.getClimateZone(lat, lng),
			seismicZone: this.getSeismicZone(lat, lng),
			windZone: this.getWindZone(lat, lng),
			recommendations,
		};
	}

	/**
	 * Assess earthquake risk based on historical data
	 */
	private assessEarthquakeRisk(
		earthquakes: RecentEvent[],
		lat: number,
		lng: number,
	): HazardRisk {
		// Count significant earthquakes
		const significant = earthquakes.filter((e) => (e.magnitude || 0) >= 4.0);
		const moderate = earthquakes.filter(
			(e) => (e.magnitude || 0) >= 3.0 && (e.magnitude || 0) < 4.0,
		);

		let riskScore = 0;
		let riskLevel: RiskLevel;

		// Base risk from seismic zone
		const seismicZone = this.getSeismicZone(lat, lng);
		if (seismicZone === "high") riskScore += 40;
		else if (seismicZone === "moderate") riskScore += 20;
		else if (seismicZone === "low") riskScore += 5;

		// Add risk from recent activity
		riskScore += significant.length * 10;
		riskScore += moderate.length * 3;

		riskScore = Math.min(100, riskScore);
		riskLevel = this.scoreToRiskLevel(riskScore);

		const mitigations: string[] = [];
		if (riskScore >= 50) {
			mitigations.push(
				"Secure water heaters and HVAC equipment to prevent gas leaks",
			);
			mitigations.push("Install flexible gas connectors");
			mitigations.push("Ensure equipment has seismic bracing");
		}
		if (riskScore >= 30) {
			mitigations.push("Check for seismic strapping on water heater");
			mitigations.push("Consider earthquake shutoff valve for gas line");
		}

		return {
			hazardType: "earthquake",
			riskLevel,
			riskScore,
			description: `Seismic zone: ${seismicZone}. ${significant.length} significant earthquakes (M4.0+) in past year within 500km.`,
			historicalFrequency:
				significant.length > 0 ? "Active seismic area" : "Low seismic activity",
			lastMajorEvent: earthquakes[0]?.date,
			mitigationRecommendations: mitigations,
		};
	}

	/**
	 * Assess hazards based on geographic location
	 */
	private assessLocationBasedHazards(lat: number, lng: number): HazardRisk[] {
		const hazards: HazardRisk[] = [];

		// Wildfire risk (Western US primarily)
		if (lng < -100 && lat > 32 && lat < 49) {
			const wildfireScore = lng < -115 ? 70 : 40;
			hazards.push({
				hazardType: "wildfire",
				riskLevel: this.scoreToRiskLevel(wildfireScore),
				riskScore: wildfireScore,
				description: "Western US wildfire zone",
				historicalFrequency: "Annual fire season (May-October)",
				mitigationRecommendations: [
					"Ensure outdoor HVAC units have defensible space",
					"Use fire-resistant materials for exposed ductwork",
					"Install high-efficiency air filtration for smoke events",
					"Check that attic vents have ember-resistant screens",
				],
			});
		}

		// Hurricane risk (Gulf Coast, Atlantic Coast)
		if (
			(lat > 25 && lat < 35 && lng > -98 && lng < -75) ||
			(lat > 35 && lat < 45 && lng > -82 && lng < -65)
		) {
			const hurricaneScore = lat < 30 && lng > -90 ? 80 : 50;
			hazards.push({
				hazardType: "hurricane",
				riskLevel: this.scoreToRiskLevel(hurricaneScore),
				riskScore: hurricaneScore,
				description: "Hurricane-prone coastal region",
				historicalFrequency: "June-November hurricane season",
				mitigationRecommendations: [
					"Secure outdoor equipment with hurricane straps",
					"Install surge protectors on HVAC systems",
					"Consider elevated equipment platforms",
					"Ensure condensate drains can handle heavy rain",
				],
			});
		}

		// Tornado risk (Tornado Alley)
		if (lat > 30 && lat < 45 && lng > -105 && lng < -85) {
			const tornadoScore =
				lat > 33 && lat < 40 && lng > -100 && lng < -90 ? 70 : 40;
			hazards.push({
				hazardType: "tornado",
				riskLevel: this.scoreToRiskLevel(tornadoScore),
				riskScore: tornadoScore,
				description: "Tornado-prone region",
				historicalFrequency: "Peak season March-June",
				mitigationRecommendations: [
					"Secure outdoor units with proper anchoring",
					"Consider hail guards for condenser units",
					"Install whole-house surge protection",
					"Discuss storm shelter ventilation options",
				],
			});
		}

		// Extreme heat risk (Southwest)
		if (lat > 30 && lat < 38 && lng > -120 && lng < -100) {
			hazards.push({
				hazardType: "extreme-heat",
				riskLevel: "high",
				riskScore: 65,
				description: "Extreme heat region",
				historicalFrequency: "Summer temperatures regularly exceed 100°F",
				mitigationRecommendations: [
					"Size AC systems for extreme heat conditions",
					"Recommend high SEER efficiency units",
					"Ensure proper shade/protection for outdoor units",
					"Discuss whole-house fans for evening cooling",
				],
			});
		}

		// Winter storm risk (Northern US)
		if (lat > 40) {
			const winterScore = lat > 45 ? 60 : 40;
			hazards.push({
				hazardType: "winter-storm",
				riskLevel: this.scoreToRiskLevel(winterScore),
				riskScore: winterScore,
				description: "Cold climate with winter storms",
				historicalFrequency: "November-March winter season",
				mitigationRecommendations: [
					"Ensure proper heating system capacity",
					"Recommend backup heat source",
					"Insulate exposed pipes and equipment",
					"Install freeze protection on heat pumps",
				],
			});
		}

		return hazards;
	}

	/**
	 * Assess active weather hazards
	 */
	private assessWeatherHazards(alerts: RecentEvent[]): HazardRisk[] {
		const hazards: HazardRisk[] = [];

		alerts.forEach((alert) => {
			if (alert.type !== "earthquake") {
				// Don't duplicate
				hazards.push({
					hazardType: alert.type,
					riskLevel: "high", // Active alerts are high risk
					riskScore: 80,
					description: alert.description,
					mitigationRecommendations: [
						"Active weather alert - postpone non-emergency outdoor work if unsafe",
					],
				});
			}
		});

		return hazards;
	}

	/**
	 * Map weather event type to hazard type
	 */
	private mapWeatherEventType(event: string): HazardType {
		const normalized = event.toLowerCase();
		if (normalized.includes("tornado")) return "tornado";
		if (normalized.includes("hurricane") || normalized.includes("tropical"))
			return "hurricane";
		if (normalized.includes("flood")) return "flood";
		if (normalized.includes("fire") || normalized.includes("smoke"))
			return "wildfire";
		if (
			normalized.includes("winter") ||
			normalized.includes("snow") ||
			normalized.includes("ice") ||
			normalized.includes("blizzard")
		)
			return "winter-storm";
		if (normalized.includes("heat")) return "extreme-heat";
		if (normalized.includes("hail")) return "hail";
		return "tornado"; // Default for severe weather
	}

	/**
	 * Calculate overall risk score
	 */
	private calculateOverallRisk(hazards: HazardRisk[]): number {
		if (hazards.length === 0) return 20;

		// Weighted average with higher risks weighted more
		let weightedSum = 0;
		let weights = 0;

		hazards.forEach((hazard) => {
			const weight = hazard.riskScore >= 50 ? 2 : 1;
			weightedSum += hazard.riskScore * weight;
			weights += weight;
		});

		return Math.round(weightedSum / weights);
	}

	/**
	 * Convert score to risk level
	 */
	private scoreToRiskLevel(score: number): RiskLevel {
		if (score >= 90) return "extreme";
		if (score >= 75) return "severe";
		if (score >= 55) return "high";
		if (score >= 35) return "moderate";
		if (score >= 15) return "low";
		return "minimal";
	}

	/**
	 * Get earthquake impact description
	 */
	private getEarthquakeImpact(magnitude: number): string {
		if (magnitude >= 7.0) return "Major - Serious damage possible";
		if (magnitude >= 6.0) return "Strong - Can cause damage to buildings";
		if (magnitude >= 5.0) return "Moderate - Can cause minor damage";
		if (magnitude >= 4.0) return "Light - Noticeable shaking, minimal damage";
		return "Minor - Often not felt";
	}

	/**
	 * Get seismic zone for location
	 */
	private getSeismicZone(lat: number, lng: number): string {
		// Simplified seismic zone determination
		// California, Pacific Northwest, Alaska
		if (
			(lat > 32 && lat < 42 && lng > -125 && lng < -114) ||
			(lat > 42 && lat < 49 && lng > -125 && lng < -116) ||
			(lat > 51 && lng < -130)
		) {
			return "high";
		}
		// Intermountain West, New Madrid zone
		if (
			(lat > 35 && lat < 45 && lng > -115 && lng < -105) ||
			(lat > 35 && lat < 40 && lng > -92 && lng < -87)
		) {
			return "moderate";
		}
		// Most of Eastern US
		if (lng > -100) {
			return "low";
		}
		return "moderate";
	}

	/**
	 * Get wind zone for location
	 */
	private getWindZone(lat: number, lng: number): string {
		// Hurricane zones (coastal)
		if (lat < 35 && lng > -98 && lng < -75) return "high";
		// Tornado alley
		if (lat > 30 && lat < 45 && lng > -105 && lng < -85) return "high";
		// Northern plains
		if (lat > 40 && lat < 49 && lng > -110 && lng < -95) return "moderate";
		return "low";
	}

	/**
	 * Get climate zone
	 */
	private getClimateZone(lat: number, lng: number): string {
		if (lat > 45) return "Cold";
		if (lat < 30) return "Hot-Humid";
		if (lng < -100) return "Mixed-Dry";
		if (lng > -85) return "Mixed-Humid";
		return "Mixed";
	}

	/**
	 * Generate overall recommendations
	 */
	private generateRecommendations(hazards: HazardRisk[]): string[] {
		const recommendations: string[] = [];

		// Aggregate high-priority recommendations
		hazards
			.filter((h) => h.riskScore >= 50)
			.forEach((hazard) => {
				if (hazard.mitigationRecommendations.length > 0) {
					recommendations.push(...hazard.mitigationRecommendations.slice(0, 2));
				}
			});

		// Deduplicate
		return [...new Set(recommendations)];
	}

	/**
	 * Calculate distance between two points (km)
	 */
	private calculateDistance(
		lat1: number,
		lng1: number,
		lat2: number,
		lng2: number,
	): number {
		const R = 6371; // Earth's radius in km
		const dLat = this.toRad(lat2 - lat1);
		const dLng = this.toRad(lng2 - lng1);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.toRad(lat1)) *
				Math.cos(this.toRad(lat2)) *
				Math.sin(dLng / 2) *
				Math.sin(dLng / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}

	private toRad(deg: number): number {
		return deg * (Math.PI / 180);
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Get property hazard assessment for service work
	 * Helps determine equipment recommendations and installation considerations
	 */
	async getPropertyHazardAssessment(
		address: string,
		lat: number,
		lng: number,
	): Promise<PropertyHazardAssessment> {
		const report = await this.getEnvironmentalRiskReport(lat, lng, address);

		const primaryConcerns = report.hazards
			.filter((h) => h.riskScore >= 40)
			.sort((a, b) => b.riskScore - a.riskScore);

		const equipmentRecommendations: EquipmentRecommendation[] = [];
		const maintenanceConsiderations: string[] = [];
		const insuranceNotes: string[] = [];

		// Generate equipment recommendations based on hazards
		primaryConcerns.forEach((hazard) => {
			switch (hazard.hazardType) {
				case "earthquake":
					equipmentRecommendations.push({
						equipment: "Seismic strapping for water heater",
						reason: "Prevents gas leaks and water damage during earthquakes",
						hazardType: "earthquake",
						priority: hazard.riskScore >= 60 ? "required" : "recommended",
					});
					equipmentRecommendations.push({
						equipment: "Flexible gas connectors",
						reason: "Allows equipment movement without breaking gas lines",
						hazardType: "earthquake",
						priority: "recommended",
					});
					if (hazard.riskScore >= 70) {
						equipmentRecommendations.push({
							equipment: "Automatic gas shutoff valve",
							reason: "Cuts gas supply during significant seismic event",
							hazardType: "earthquake",
							priority: "recommended",
						});
					}
					maintenanceConsiderations.push(
						"Annual inspection of seismic straps and flexible connections",
					);
					break;

				case "wildfire":
					equipmentRecommendations.push({
						equipment: "High-efficiency particulate air filter (MERV 13+)",
						reason: "Filters smoke particles during fire events",
						hazardType: "wildfire",
						priority: "recommended",
					});
					equipmentRecommendations.push({
						equipment: "Fire-resistant conduit for outdoor wiring",
						reason: "Protects electrical connections from ember damage",
						hazardType: "wildfire",
						priority: "recommended",
					});
					maintenanceConsiderations.push(
						"Clear vegetation 5+ feet around outdoor equipment",
					);
					maintenanceConsiderations.push(
						"Replace air filters immediately after smoke events",
					);
					insuranceNotes.push(
						"Document defensible space around equipment for insurance",
					);
					break;

				case "hurricane":
					equipmentRecommendations.push({
						equipment: "Hurricane straps/tie-downs for outdoor units",
						reason: "Prevents equipment from becoming projectile",
						hazardType: "hurricane",
						priority: "required",
					});
					equipmentRecommendations.push({
						equipment: "Surge protection for HVAC",
						reason: "Protects equipment from power surge damage",
						hazardType: "hurricane",
						priority: "required",
					});
					if (hazard.riskScore >= 70) {
						equipmentRecommendations.push({
							equipment: "Elevated equipment platform",
							reason: "Protects from flood damage during storm surge",
							hazardType: "hurricane",
							priority: "recommended",
						});
					}
					maintenanceConsiderations.push(
						"Pre-hurricane inspection and securing protocol",
					);
					maintenanceConsiderations.push(
						"Post-hurricane system check for debris/damage",
					);
					insuranceNotes.push(
						"Ensure wind/flood coverage adequate for replacement",
					);
					break;

				case "tornado":
					equipmentRecommendations.push({
						equipment: "Hail guards for condenser",
						reason: "Protects fins from hail damage",
						hazardType: "tornado",
						priority: "recommended",
					});
					equipmentRecommendations.push({
						equipment: "Whole-house surge protector",
						reason: "Protects all systems from lightning/power surges",
						hazardType: "tornado",
						priority: "recommended",
					});
					maintenanceConsiderations.push(
						"Post-storm inspection for hail/debris damage",
					);
					maintenanceConsiderations.push(
						"Check refrigerant charge after severe storms",
					);
					break;

				case "extreme-heat":
					equipmentRecommendations.push({
						equipment: "High-SEER AC unit (18+ SEER)",
						reason: "Maintains efficiency in extreme temperatures",
						hazardType: "extreme-heat",
						priority: "recommended",
					});
					equipmentRecommendations.push({
						equipment: "Shade structure for condenser",
						reason: "Improves efficiency by reducing condenser temperature",
						hazardType: "extreme-heat",
						priority: "optional",
					});
					maintenanceConsiderations.push(
						"Bi-annual coil cleaning for optimal heat transfer",
					);
					maintenanceConsiderations.push(
						"Check refrigerant charge before peak summer",
					);
					break;

				case "winter-storm":
					equipmentRecommendations.push({
						equipment: "Heat pump with cold climate rating",
						reason: "Maintains efficiency in sub-freezing temperatures",
						hazardType: "winter-storm",
						priority: "recommended",
					});
					equipmentRecommendations.push({
						equipment: "Pipe insulation and heat tape",
						reason: "Prevents freeze damage to condensate lines",
						hazardType: "winter-storm",
						priority: "required",
					});
					maintenanceConsiderations.push(
						"Fall heating system tune-up before winter",
					);
					maintenanceConsiderations.push(
						"Clear snow/ice from outdoor equipment",
					);
					break;
			}
		});

		// General insurance note
		if (report.overallRiskScore >= 50) {
			insuranceNotes.push(
				"Higher risk area - review equipment coverage limits",
			);
			insuranceNotes.push(
				"Consider extended warranty for weather-related failures",
			);
		}

		return {
			address,
			overallRisk: report.overallRiskLevel,
			primaryConcerns,
			equipmentRecommendations,
			maintenanceConsiderations: [...new Set(maintenanceConsiderations)],
			insuranceNotes: [...new Set(insuranceNotes)],
		};
	}

	/**
	 * Get seasonal service recommendations
	 * Helps plan maintenance schedules around hazard seasons
	 */
	async getSeasonalServicePlan(
		lat: number,
		lng: number,
	): Promise<SeasonalRisk[]> {
		const report = await this.getEnvironmentalRiskReport(lat, lng);
		const seasonalRisks: SeasonalRisk[] = [];

		// Spring
		const springHazards: HazardType[] = [];
		const springNotes: string[] = [];

		if (
			report.hazards.find((h) => h.hazardType === "tornado")?.riskScore ||
			0 >= 40
		) {
			springHazards.push("tornado");
			springNotes.push("Peak tornado season - offer pre-storm system checks");
			springNotes.push("Verify surge protection before storm season");
		}
		if (
			report.hazards.find((h) => h.hazardType === "flood")?.riskScore ||
			0 >= 40
		) {
			springHazards.push("flood");
			springNotes.push("Spring flooding risk - check sump pump systems");
		}
		springNotes.push("Transition to cooling season - AC tune-ups");

		seasonalRisks.push({
			season: "spring",
			primaryHazards: springHazards,
			riskLevel: springHazards.length > 0 ? "moderate" : "low",
			notes: springNotes,
		});

		// Summer
		const summerHazards: HazardType[] = [];
		const summerNotes: string[] = [];

		if (
			report.hazards.find((h) => h.hazardType === "hurricane")?.riskScore ||
			0 >= 40
		) {
			summerHazards.push("hurricane");
			summerNotes.push("Hurricane season begins - verify tie-downs");
		}
		if (
			report.hazards.find((h) => h.hazardType === "wildfire")?.riskScore ||
			0 >= 40
		) {
			summerHazards.push("wildfire");
			summerNotes.push("Wildfire season - check air filtration");
			summerNotes.push("Clear vegetation around outdoor equipment");
		}
		if (
			report.hazards.find((h) => h.hazardType === "extreme-heat")?.riskScore ||
			0 >= 40
		) {
			summerHazards.push("extreme-heat");
			summerNotes.push("Peak cooling demand - prioritize emergency AC repairs");
		}

		seasonalRisks.push({
			season: "summer",
			primaryHazards: summerHazards,
			riskLevel:
				summerHazards.length >= 2
					? "high"
					: summerHazards.length === 1
						? "moderate"
						: "low",
			notes: summerNotes,
		});

		// Fall
		const fallHazards: HazardType[] = [];
		const fallNotes: string[] = [];

		if (
			report.hazards.find((h) => h.hazardType === "hurricane")?.riskScore ||
			0 >= 40
		) {
			fallHazards.push("hurricane");
			fallNotes.push("Peak hurricane season continues through November");
		}
		if (
			report.hazards.find((h) => h.hazardType === "wildfire")?.riskScore ||
			0 >= 40
		) {
			fallHazards.push("wildfire");
			fallNotes.push("Fall fire risk (dry conditions)");
		}
		fallNotes.push("Heating system tune-up season");
		fallNotes.push("Winterization preparation for cold climates");

		seasonalRisks.push({
			season: "fall",
			primaryHazards: fallHazards,
			riskLevel: fallHazards.length > 0 ? "moderate" : "low",
			notes: fallNotes,
		});

		// Winter
		const winterHazards: HazardType[] = [];
		const winterNotes: string[] = [];

		if (
			report.hazards.find((h) => h.hazardType === "winter-storm")?.riskScore ||
			0 >= 40
		) {
			winterHazards.push("winter-storm");
			winterNotes.push(
				"Winter storm risk - emergency heating repairs priority",
			);
			winterNotes.push("Freeze protection checks");
		}
		winterNotes.push("Peak heating demand season");

		seasonalRisks.push({
			season: "winter",
			primaryHazards: winterHazards,
			riskLevel: winterHazards.length > 0 ? "high" : "moderate",
			notes: winterNotes,
		});

		return seasonalRisks;
	}

	/**
	 * Check for active hazard conditions before dispatching
	 * Real-time safety check for technician dispatch
	 */
	async checkDispatchSafety(
		lat: number,
		lng: number,
	): Promise<{
		safe: boolean;
		activeHazards: RecentEvent[];
		recommendation: string;
	}> {
		const alerts = await this.getWeatherAlerts(lat, lng);

		const severeAlerts = alerts.filter(
			(a) =>
				a.impact === "Severe" ||
				a.impact === "Extreme" ||
				a.type === "tornado" ||
				a.type === "hurricane",
		);

		if (severeAlerts.length > 0) {
			return {
				safe: false,
				activeHazards: severeAlerts,
				recommendation: `DELAY DISPATCH: ${severeAlerts.map((a) => a.description).join("; ")}`,
			};
		}

		if (alerts.length > 0) {
			return {
				safe: true,
				activeHazards: alerts,
				recommendation: `CAUTION: Active weather alerts. Monitor conditions: ${alerts.map((a) => a.type).join(", ")}`,
			};
		}

		return {
			safe: true,
			activeHazards: [],
			recommendation: "No active weather hazards. Normal dispatch procedures.",
		};
	}
}

// Export singleton instance
export const perilPulseService = new PerilPulseService();
