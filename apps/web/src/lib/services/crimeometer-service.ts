/**
 * CrimeoMeter API Service
 *
 * Real-time crime data and safety scoring for any location.
 * Provides incident-level crime data and safety grades.
 *
 * @see https://www.crimeometer.com/crime-data-api
 *
 * Requires API key from CrimeoMeter (free tier: 100 requests/month).
 * Get key at: https://www.crimeometer.com/pricing
 */

const CRIMEOMETER_BASE_URL = "https://api.crimeometer.com/v2";

export type CrimeCategory =
	| "assault"
	| "burglary"
	| "homicide"
	| "motor-vehicle-theft"
	| "robbery"
	| "sexual-assault"
	| "theft"
	| "vandalism"
	| "arson"
	| "drugs"
	| "fraud"
	| "other";

export interface CrimeIncident {
	id: string;
	source: string;
	incidentDate: string;
	reportDate?: string;
	category: CrimeCategory;
	type: string;
	description?: string;
	address?: string;
	lat: number;
	lng: number;
	distance?: number; // meters from query point
}

export interface SafetyScore {
	score: number; // 0-100
	grade:
		| "A+"
		| "A"
		| "A-"
		| "B+"
		| "B"
		| "B-"
		| "C+"
		| "C"
		| "C-"
		| "D+"
		| "D"
		| "D-"
		| "F";
	level: "very-safe" | "safe" | "moderate" | "unsafe" | "very-unsafe";
	comparison?: {
		city?: number;
		state?: number;
		national?: number;
	};
}

export interface CrimeStats {
	totalIncidents: number;
	incidentsByCategory: Record<CrimeCategory, number>;
	recentTrend: "increasing" | "decreasing" | "stable";
	mostCommonCrime: CrimeCategory;
	violentCrimeCount: number;
	propertyCrimeCount: number;
}

export interface LocationSafetyReport {
	lat: number;
	lng: number;
	radius: number;
	safetyScore: SafetyScore;
	crimeStats: CrimeStats;
	recentIncidents: CrimeIncident[];
	riskAssessment: RiskAssessment;
}

export interface RiskAssessment {
	overallRisk: "low" | "moderate" | "high" | "very-high";
	violentCrimeRisk: "low" | "moderate" | "high" | "very-high";
	propertyCrimeRisk: "low" | "moderate" | "high" | "very-high";
	timeBasedRisk: {
		daytime: "low" | "moderate" | "high";
		evening: "low" | "moderate" | "high";
		night: "low" | "moderate" | "high";
	};
	recommendations: string[];
}

export interface ServiceCallSafety {
	address: string;
	safetyGrade: string;
	riskLevel: "low" | "moderate" | "high" | "very-high";
	recentCrimesNearby: number;
	schedulingRecommendation: string;
	technicianSafetyNotes: string[];
	equipmentSecurityNotes: string[];
}

// Violent crime categories
const VIOLENT_CRIMES: CrimeCategory[] = [
	"assault",
	"homicide",
	"robbery",
	"sexual-assault",
];

// Property crime categories
const PROPERTY_CRIMES: CrimeCategory[] = [
	"burglary",
	"motor-vehicle-theft",
	"theft",
	"vandalism",
	"arson",
];

class CrimeoMeterService {
	private apiKey: string;
	private baseUrl = CRIMEOMETER_BASE_URL;

	constructor() {
		this.apiKey = process.env.CRIMEOMETER_API_KEY || "";
	}

	/**
	 * Get crime incidents near a location
	 */
	async getCrimeIncidents(
		lat: number,
		lng: number,
		options: {
			radius?: number; // meters (default 500)
			startDate?: string; // YYYY-MM-DD
			endDate?: string; // YYYY-MM-DD
			limit?: number;
		} = {},
	): Promise<CrimeIncident[]> {
		if (!this.apiKey) {
			console.error("CrimeoMeter API key not configured");
			return [];
		}

		const { radius = 500, startDate, endDate, limit = 50 } = options;

		try {
			const url = new URL(`${this.baseUrl}/incidents/raw-data`);
			url.searchParams.set("lat", lat.toString());
			url.searchParams.set("lon", lng.toString());
			url.searchParams.set("distance", (radius / 1000).toString()); // API uses km
			url.searchParams.set("limit", limit.toString());

			// Default to last 90 days if no dates specified
			const end = endDate || new Date().toISOString().split("T")[0];
			const start =
				startDate ||
				new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
					.toISOString()
					.split("T")[0];
			url.searchParams.set("datetime_ini", start);
			url.searchParams.set("datetime_end", end);

			const response = await fetch(url.toString(), {
				headers: {
					"x-api-key": this.apiKey,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`CrimeoMeter API error: ${response.status}`);
			}

			const data = await response.json();

			if (!data.incidents || !Array.isArray(data.incidents)) {
				return [];
			}

			return data.incidents.map((incident: Record<string, unknown>) => ({
				id: incident.incident_id as string,
				source: incident.source as string,
				incidentDate: incident.incident_date as string,
				reportDate: incident.report_date as string | undefined,
				category: this.normalizeCategory(incident.incident_offense as string),
				type: incident.incident_offense as string,
				description: incident.incident_offense_description as
					| string
					| undefined,
				address: incident.incident_address as string | undefined,
				lat: incident.incident_latitude as number,
				lng: incident.incident_longitude as number,
				distance: incident.distance
					? (incident.distance as number) * 1000
					: undefined, // Convert km to meters
			}));
		} catch (error) {
			console.error("Error fetching crime incidents:", error);
			return [];
		}
	}

	/**
	 * Get safety score for a location
	 */
	async getSafetyScore(lat: number, lng: number): Promise<SafetyScore | null> {
		if (!this.apiKey) {
			console.error("CrimeoMeter API key not configured");
			return null;
		}

		try {
			const url = new URL(`${this.baseUrl}/city-safety-score`);
			url.searchParams.set("lat", lat.toString());
			url.searchParams.set("lon", lng.toString());

			const response = await fetch(url.toString(), {
				headers: {
					"x-api-key": this.apiKey,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				// If safety score endpoint fails, calculate from incidents
				return this.calculateSafetyScoreFromIncidents(lat, lng);
			}

			const data = await response.json();

			if (!data.safety_score) {
				return this.calculateSafetyScoreFromIncidents(lat, lng);
			}

			return {
				score: data.safety_score,
				grade: this.scoreToGrade(data.safety_score),
				level: this.scoreToLevel(data.safety_score),
				comparison: data.comparison,
			};
		} catch (error) {
			console.error("Error fetching safety score:", error);
			return this.calculateSafetyScoreFromIncidents(lat, lng);
		}
	}

	/**
	 * Calculate safety score from incident data
	 */
	private async calculateSafetyScoreFromIncidents(
		lat: number,
		lng: number,
	): Promise<SafetyScore | null> {
		const incidents = await this.getCrimeIncidents(lat, lng, {
			radius: 1000, // 1km radius
			limit: 100,
		});

		if (incidents.length === 0) {
			// No crime data could mean very safe or no data
			return {
				score: 75,
				grade: "B",
				level: "safe",
			};
		}

		// Calculate score based on incident count and severity
		let violentCount = 0;
		let propertyCount = 0;

		incidents.forEach((incident) => {
			if (VIOLENT_CRIMES.includes(incident.category)) {
				violentCount++;
			} else if (PROPERTY_CRIMES.includes(incident.category)) {
				propertyCount++;
			}
		});

		// Scoring formula (higher = safer)
		// Violent crimes weighted 3x more than property crimes
		const weightedScore = violentCount * 3 + propertyCount;

		let score: number;
		if (weightedScore <= 5) score = 90;
		else if (weightedScore <= 10) score = 80;
		else if (weightedScore <= 20) score = 70;
		else if (weightedScore <= 35) score = 60;
		else if (weightedScore <= 50) score = 50;
		else if (weightedScore <= 75) score = 40;
		else if (weightedScore <= 100) score = 30;
		else score = 20;

		return {
			score,
			grade: this.scoreToGrade(score),
			level: this.scoreToLevel(score),
		};
	}

	/**
	 * Get comprehensive location safety report
	 */
	async getLocationSafetyReport(
		lat: number,
		lng: number,
		radiusMeters: number = 500,
	): Promise<LocationSafetyReport | null> {
		const [safetyScore, incidents] = await Promise.all([
			this.getSafetyScore(lat, lng),
			this.getCrimeIncidents(lat, lng, {
				radius: radiusMeters,
				limit: 100,
			}),
		]);

		if (!safetyScore) {
			return null;
		}

		const crimeStats = this.calculateCrimeStats(incidents);
		const riskAssessment = this.calculateRiskAssessment(
			safetyScore,
			crimeStats,
		);

		return {
			lat,
			lng,
			radius: radiusMeters,
			safetyScore,
			crimeStats,
			recentIncidents: incidents.slice(0, 10), // Top 10 most recent
			riskAssessment,
		};
	}

	/**
	 * Calculate crime statistics from incidents
	 */
	private calculateCrimeStats(incidents: CrimeIncident[]): CrimeStats {
		const byCategory: Record<CrimeCategory, number> = {
			assault: 0,
			burglary: 0,
			homicide: 0,
			"motor-vehicle-theft": 0,
			robbery: 0,
			"sexual-assault": 0,
			theft: 0,
			vandalism: 0,
			arson: 0,
			drugs: 0,
			fraud: 0,
			other: 0,
		};

		let violentCount = 0;
		let propertyCount = 0;

		incidents.forEach((incident) => {
			byCategory[incident.category]++;
			if (VIOLENT_CRIMES.includes(incident.category)) {
				violentCount++;
			}
			if (PROPERTY_CRIMES.includes(incident.category)) {
				propertyCount++;
			}
		});

		// Find most common crime
		let mostCommon: CrimeCategory = "other";
		let maxCount = 0;
		(Object.keys(byCategory) as CrimeCategory[]).forEach((category) => {
			if (byCategory[category] > maxCount) {
				maxCount = byCategory[category];
				mostCommon = category;
			}
		});

		return {
			totalIncidents: incidents.length,
			incidentsByCategory: byCategory,
			recentTrend: "stable", // Would need historical data to calculate
			mostCommonCrime: mostCommon,
			violentCrimeCount: violentCount,
			propertyCrimeCount: propertyCount,
		};
	}

	/**
	 * Calculate risk assessment
	 */
	private calculateRiskAssessment(
		safetyScore: SafetyScore,
		stats: CrimeStats,
	): RiskAssessment {
		const recommendations: string[] = [];

		// Overall risk
		const overallRisk = this.levelToRisk(safetyScore.level);

		// Violent crime risk
		let violentRisk: RiskAssessment["violentCrimeRisk"];
		if (stats.violentCrimeCount === 0) violentRisk = "low";
		else if (stats.violentCrimeCount <= 3) violentRisk = "moderate";
		else if (stats.violentCrimeCount <= 10) violentRisk = "high";
		else violentRisk = "very-high";

		// Property crime risk
		let propertyRisk: RiskAssessment["propertyCrimeRisk"];
		if (stats.propertyCrimeCount <= 5) propertyRisk = "low";
		else if (stats.propertyCrimeCount <= 15) propertyRisk = "moderate";
		else if (stats.propertyCrimeCount <= 30) propertyRisk = "high";
		else propertyRisk = "very-high";

		// Time-based risk (general estimates)
		const timeBasedRisk: RiskAssessment["timeBasedRisk"] = {
			daytime:
				overallRisk === "very-high"
					? "high"
					: overallRisk === "high"
						? "moderate"
						: "low",
			evening:
				overallRisk === "low"
					? "low"
					: overallRisk === "moderate"
						? "moderate"
						: "high",
			night: overallRisk === "low" ? "moderate" : "high",
		};

		// Generate recommendations
		if (violentRisk === "high" || violentRisk === "very-high") {
			recommendations.push("Schedule appointments during daylight hours only");
			recommendations.push("Use two-person teams when possible");
			recommendations.push("Share arrival/departure times with dispatch");
		}

		if (propertyRisk === "high" || propertyRisk === "very-high") {
			recommendations.push("Never leave vehicle unlocked or tools visible");
			recommendations.push("Use locking toolboxes and cable locks");
			recommendations.push("Park in visible, well-lit locations");
		}

		if (stats.incidentsByCategory.burglary > 5) {
			recommendations.push(
				"Good opportunity to discuss security system upgrades with customer",
			);
		}

		if (stats.incidentsByCategory["motor-vehicle-theft"] > 3) {
			recommendations.push(
				"Consider using vehicle tracking and steering wheel lock",
			);
		}

		return {
			overallRisk,
			violentCrimeRisk: violentRisk,
			propertyCrimeRisk: propertyRisk,
			timeBasedRisk,
			recommendations,
		};
	}

	/**
	 * Normalize crime category
	 */
	private normalizeCategory(offense: string): CrimeCategory {
		const normalized = offense.toLowerCase();

		if (normalized.includes("assault") || normalized.includes("battery"))
			return "assault";
		if (normalized.includes("burglar")) return "burglary";
		if (
			normalized.includes("murder") ||
			normalized.includes("homicide") ||
			normalized.includes("manslaughter")
		)
			return "homicide";
		if (
			normalized.includes("vehicle") ||
			normalized.includes("auto") ||
			normalized.includes("car theft")
		)
			return "motor-vehicle-theft";
		if (normalized.includes("robbery")) return "robbery";
		if (normalized.includes("rape") || normalized.includes("sexual"))
			return "sexual-assault";
		if (
			normalized.includes("theft") ||
			normalized.includes("larceny") ||
			normalized.includes("shoplifting")
		)
			return "theft";
		if (
			normalized.includes("vandal") ||
			normalized.includes("criminal mischief") ||
			normalized.includes("damage")
		)
			return "vandalism";
		if (normalized.includes("arson")) return "arson";
		if (normalized.includes("drug") || normalized.includes("narcotic"))
			return "drugs";
		if (
			normalized.includes("fraud") ||
			normalized.includes("forgery") ||
			normalized.includes("identity")
		)
			return "fraud";

		return "other";
	}

	/**
	 * Convert score to letter grade
	 */
	private scoreToGrade(score: number): SafetyScore["grade"] {
		if (score >= 97) return "A+";
		if (score >= 93) return "A";
		if (score >= 90) return "A-";
		if (score >= 87) return "B+";
		if (score >= 83) return "B";
		if (score >= 80) return "B-";
		if (score >= 77) return "C+";
		if (score >= 73) return "C";
		if (score >= 70) return "C-";
		if (score >= 67) return "D+";
		if (score >= 63) return "D";
		if (score >= 60) return "D-";
		return "F";
	}

	/**
	 * Convert score to safety level
	 */
	private scoreToLevel(score: number): SafetyScore["level"] {
		if (score >= 85) return "very-safe";
		if (score >= 70) return "safe";
		if (score >= 50) return "moderate";
		if (score >= 30) return "unsafe";
		return "very-unsafe";
	}

	/**
	 * Convert safety level to risk level
	 */
	private levelToRisk(
		level: SafetyScore["level"],
	): RiskAssessment["overallRisk"] {
		switch (level) {
			case "very-safe":
				return "low";
			case "safe":
				return "low";
			case "moderate":
				return "moderate";
			case "unsafe":
				return "high";
			case "very-unsafe":
				return "very-high";
		}
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Get service call safety assessment
	 * Provides actionable safety info for technicians
	 */
	async getServiceCallSafety(
		address: string,
		lat: number,
		lng: number,
	): Promise<ServiceCallSafety> {
		const report = await this.getLocationSafetyReport(lat, lng, 500);

		const technicianNotes: string[] = [];
		const equipmentNotes: string[] = [];
		let schedulingRecommendation: string;

		if (!report) {
			return {
				address,
				safetyGrade: "N/A",
				riskLevel: "moderate",
				recentCrimesNearby: 0,
				schedulingRecommendation:
					"Standard scheduling - unable to retrieve crime data",
				technicianSafetyNotes: [
					"Unable to assess area - use standard safety protocols",
				],
				equipmentSecurityNotes: ["Use standard equipment security measures"],
			};
		}

		const riskLevel = report.riskAssessment.overallRisk;

		// Scheduling recommendation
		switch (riskLevel) {
			case "low":
				schedulingRecommendation =
					"No scheduling restrictions - area is relatively safe";
				technicianNotes.push("Standard safety awareness appropriate");
				equipmentNotes.push("Standard vehicle security sufficient");
				break;
			case "moderate":
				schedulingRecommendation = "Prefer daytime appointments when possible";
				technicianNotes.push("Be aware of surroundings");
				technicianNotes.push("Notify dispatch of arrival/departure");
				equipmentNotes.push("Keep vehicle locked");
				equipmentNotes.push("Don't leave tools visible");
				break;
			case "high":
				schedulingRecommendation =
					"Schedule during daylight hours only (8AM-5PM)";
				technicianNotes.push("Stay alert and aware at all times");
				technicianNotes.push("Park in visible location");
				technicianNotes.push("Keep phone accessible");
				technicianNotes.push("Check in with dispatch hourly");
				equipmentNotes.push("Use locked toolboxes only");
				equipmentNotes.push(
					"Never leave vehicle unattended with tools visible",
				);
				equipmentNotes.push("Consider bringing only necessary tools");
				break;
			case "very-high":
				schedulingRecommendation =
					"CAUTION: High-risk area. Two-person team recommended. Daytime only.";
				technicianNotes.push("Two-person team strongly recommended");
				technicianNotes.push("Check in with dispatch every 30 minutes");
				technicianNotes.push("Have exit strategy planned");
				technicianNotes.push("Trust instincts - leave if uncomfortable");
				equipmentNotes.push("Bring only essential tools");
				equipmentNotes.push("One person stays with vehicle at all times");
				equipmentNotes.push("GPS tracking enabled on vehicle and phone");
				break;
		}

		// Add specific crime-based notes
		if (report.crimeStats.incidentsByCategory.burglary > 5) {
			technicianNotes.push(
				`High burglary area (${report.crimeStats.incidentsByCategory.burglary} recent incidents) - good security upsell opportunity`,
			);
		}

		if (report.crimeStats.incidentsByCategory["motor-vehicle-theft"] > 2) {
			equipmentNotes.push(
				`Elevated vehicle theft risk (${report.crimeStats.incidentsByCategory["motor-vehicle-theft"]} recent incidents) - use steering wheel lock`,
			);
		}

		if (report.crimeStats.incidentsByCategory.theft > 10) {
			equipmentNotes.push(
				"High theft area - document tools with photos before/after",
			);
		}

		return {
			address,
			safetyGrade: report.safetyScore.grade,
			riskLevel,
			recentCrimesNearby: report.crimeStats.totalIncidents,
			schedulingRecommendation,
			technicianSafetyNotes: technicianNotes,
			equipmentSecurityNotes: equipmentNotes,
		};
	}

	/**
	 * Check if evening appointment is advisable
	 */
	async isEveningAppointmentSafe(
		lat: number,
		lng: number,
	): Promise<{
		safe: boolean;
		recommendation: string;
		alternativeTimeSlots?: string[];
	}> {
		const safety = await this.getSafetyScore(lat, lng);

		if (!safety) {
			return {
				safe: false,
				recommendation:
					"Unable to determine safety - recommend daytime appointment",
				alternativeTimeSlots: ["9:00 AM - 11:00 AM", "1:00 PM - 3:00 PM"],
			};
		}

		if (safety.level === "very-safe" || safety.level === "safe") {
			return {
				safe: true,
				recommendation: "Evening appointment acceptable in this area",
			};
		} else if (safety.level === "moderate") {
			return {
				safe: false,
				recommendation: "Daytime appointment recommended for this area",
				alternativeTimeSlots: ["8:00 AM - 12:00 PM", "12:00 PM - 4:00 PM"],
			};
		} else {
			return {
				safe: false,
				recommendation:
					"Daytime only - two-person team recommended for this area",
				alternativeTimeSlots: ["9:00 AM - 12:00 PM", "1:00 PM - 3:00 PM"],
			};
		}
	}

	/**
	 * Compare safety across multiple addresses
	 * Useful for route planning - tackle safer areas later in day
	 */
	async rankLocationsBySafety(
		locations: { address: string; lat: number; lng: number }[],
	): Promise<
		{
			address: string;
			safetyScore: number;
			grade: string;
			suggestedTimeSlot: "any" | "daytime" | "morning-only";
		}[]
	> {
		const results = await Promise.all(
			locations.map(async (loc) => {
				const safety = await this.getSafetyScore(loc.lat, loc.lng);
				return {
					...loc,
					safety,
				};
			}),
		);

		return results
			.map((result) => {
				let suggestedTimeSlot: "any" | "daytime" | "morning-only";

				if (!result.safety || result.safety.score >= 70) {
					suggestedTimeSlot = "any";
				} else if (result.safety.score >= 50) {
					suggestedTimeSlot = "daytime";
				} else {
					suggestedTimeSlot = "morning-only";
				}

				return {
					address: result.address,
					safetyScore: result.safety?.score || 50,
					grade: result.safety?.grade || "N/A",
					suggestedTimeSlot,
				};
			})
			.sort((a, b) => b.safetyScore - a.safetyScore);
	}

	/**
	 * Get security upsell opportunities based on local crime
	 * Helps identify customers who might benefit from security services
	 */
	async getSecurityUpsellOpportunities(
		lat: number,
		lng: number,
	): Promise<{
		hasOpportunity: boolean;
		opportunityStrength: "low" | "medium" | "high";
		relevantCrimes: { type: string; count: number }[];
		suggestedProducts: string[];
		talkingPoints: string[];
	}> {
		const report = await this.getLocationSafetyReport(lat, lng, 1000);

		if (!report) {
			return {
				hasOpportunity: false,
				opportunityStrength: "low",
				relevantCrimes: [],
				suggestedProducts: [],
				talkingPoints: [],
			};
		}

		const relevantCrimes: { type: string; count: number }[] = [];
		const suggestedProducts: string[] = [];
		const talkingPoints: string[] = [];

		// Check burglary for security system upsell
		if (report.crimeStats.incidentsByCategory.burglary > 3) {
			relevantCrimes.push({
				type: "Burglary",
				count: report.crimeStats.incidentsByCategory.burglary,
			});
			suggestedProducts.push("Smart home security system");
			suggestedProducts.push("Video doorbell");
			suggestedProducts.push("Motion-activated cameras");
			talkingPoints.push(
				`There have been ${report.crimeStats.incidentsByCategory.burglary} burglaries reported in this area recently`,
			);
		}

		// Check vehicle theft for garage door/driveway cameras
		if (report.crimeStats.incidentsByCategory["motor-vehicle-theft"] > 2) {
			relevantCrimes.push({
				type: "Vehicle Theft",
				count: report.crimeStats.incidentsByCategory["motor-vehicle-theft"],
			});
			suggestedProducts.push("Driveway security camera");
			suggestedProducts.push("Smart garage door opener");
			talkingPoints.push(
				"Vehicle thefts have been reported nearby - driveway cameras can help",
			);
		}

		// Check package theft for doorbell cameras
		if (report.crimeStats.incidentsByCategory.theft > 10) {
			relevantCrimes.push({
				type: "Theft/Larceny",
				count: report.crimeStats.incidentsByCategory.theft,
			});
			suggestedProducts.push("Package lockbox");
			suggestedProducts.push("Video doorbell with package detection");
			talkingPoints.push(
				"High theft area - package protection is valuable for online shoppers",
			);
		}

		// Check vandalism for lighting
		if (report.crimeStats.incidentsByCategory.vandalism > 5) {
			relevantCrimes.push({
				type: "Vandalism",
				count: report.crimeStats.incidentsByCategory.vandalism,
			});
			suggestedProducts.push("Motion-activated flood lights");
			suggestedProducts.push("Smart exterior lighting");
			talkingPoints.push(
				"Good lighting deters vandalism and improves camera footage quality",
			);
		}

		const hasOpportunity = relevantCrimes.length > 0;
		let opportunityStrength: "low" | "medium" | "high" = "low";

		if (relevantCrimes.reduce((sum, c) => sum + c.count, 0) > 20) {
			opportunityStrength = "high";
		} else if (relevantCrimes.reduce((sum, c) => sum + c.count, 0) > 10) {
			opportunityStrength = "medium";
		}

		return {
			hasOpportunity,
			opportunityStrength,
			relevantCrimes,
			suggestedProducts,
			talkingPoints,
		};
	}
}

// Export singleton instance
export const crimeoMeterService = new CrimeoMeterService();
