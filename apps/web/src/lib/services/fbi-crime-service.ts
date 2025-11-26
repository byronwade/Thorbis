/**
 * FBI Crime Data API Service
 *
 * Free government API providing crime statistics from the FBI's
 * Uniform Crime Reporting (UCR) Program and National Incident-Based
 * Reporting System (NIBRS).
 *
 * @see https://crime-data-explorer.fr.cloud.gov/pages/docApi
 * @see https://crime-data-explorer.fr.cloud.gov/api
 *
 * No API key required - completely free public data
 */

const FBI_CRIME_BASE_URL = "https://api.usa.gov/crime/fbi/cde";

export type CrimeCategory =
	| "violent-crime"
	| "homicide"
	| "rape-legacy"
	| "rape-revised"
	| "robbery"
	| "aggravated-assault"
	| "property-crime"
	| "burglary"
	| "larceny"
	| "motor-vehicle-theft"
	| "arson";

export interface CrimeStats {
	year: number;
	population: number;
	violentCrime: number;
	violentCrimeRate: number;
	homicide: number;
	homicideRate: number;
	rape: number;
	rapeRate: number;
	robbery: number;
	robberyRate: number;
	aggravatedAssault: number;
	aggravatedAssaultRate: number;
	propertyCrime: number;
	propertyCrimeRate: number;
	burglary: number;
	burglaryRate: number;
	larceny: number;
	larcenyRate: number;
	motorVehicleTheft: number;
	motorVehicleTheftRate: number;
	arson?: number;
}

export interface CrimeTrend {
	startYear: number;
	endYear: number;
	category: CrimeCategory;
	percentChange: number;
	direction: "increasing" | "decreasing" | "stable";
	yearlyData: { year: number; count: number; rate: number }[];
}

export interface AgencyInfo {
	ori: string;
	agencyName: string;
	agencyType: string;
	state: string;
	stateName: string;
	city?: string;
	county?: string;
	population?: number;
	nibrsParticipation: boolean;
}

export interface StateStats {
	stateAbbr: string;
	stateName: string;
	population: number;
	stats: CrimeStats;
	ranking: {
		violentCrimeRank: number;
		propertyCrimeRank: number;
		overallSafetyRank: number;
	};
}

export interface SafetyScore {
	score: number; // 0-100, higher is safer
	grade: "A" | "B" | "C" | "D" | "F";
	violentCrimeRisk: "low" | "moderate" | "high" | "very-high";
	propertyCrimeRisk: "low" | "moderate" | "high" | "very-high";
	comparison: {
		vsNational: string;
		vsState: string;
	};
	recommendations: string[];
}

export interface ServiceAreaSafetyReport {
	location: string;
	stateAbbr: string;
	safetyScore: SafetyScore;
	recentStats: CrimeStats;
	trends: CrimeTrend[];
	fieldServiceImplications: FieldServiceImplication[];
}

export interface FieldServiceImplication {
	category: "scheduling" | "safety" | "insurance" | "equipment";
	risk: "low" | "medium" | "high";
	recommendation: string;
}

// US state abbreviations mapping
const STATE_ABBREV: Record<string, string> = {
	alabama: "AL",
	alaska: "AK",
	arizona: "AZ",
	arkansas: "AR",
	california: "CA",
	colorado: "CO",
	connecticut: "CT",
	delaware: "DE",
	florida: "FL",
	georgia: "GA",
	hawaii: "HI",
	idaho: "ID",
	illinois: "IL",
	indiana: "IN",
	iowa: "IA",
	kansas: "KS",
	kentucky: "KY",
	louisiana: "LA",
	maine: "ME",
	maryland: "MD",
	massachusetts: "MA",
	michigan: "MI",
	minnesota: "MN",
	mississippi: "MS",
	missouri: "MO",
	montana: "MT",
	nebraska: "NE",
	nevada: "NV",
	"new hampshire": "NH",
	"new jersey": "NJ",
	"new mexico": "NM",
	"new york": "NY",
	"north carolina": "NC",
	"north dakota": "ND",
	ohio: "OH",
	oklahoma: "OK",
	oregon: "OR",
	pennsylvania: "PA",
	"rhode island": "RI",
	"south carolina": "SC",
	"south dakota": "SD",
	tennessee: "TN",
	texas: "TX",
	utah: "UT",
	vermont: "VT",
	virginia: "VA",
	washington: "WA",
	"west virginia": "WV",
	wisconsin: "WI",
	wyoming: "WY",
	"district of columbia": "DC",
};

class FBICrimeService {
	private readonly baseUrl = FBI_CRIME_BASE_URL;

	/**
	 * Get crime statistics for a state
	 */
	async getStateCrimeStats(
		stateAbbr: string,
		year?: number,
	): Promise<CrimeStats | null> {
		const targetYear = year || new Date().getFullYear() - 1;

		try {
			const response = await fetch(
				`${this.baseUrl}/estimate/state/${stateAbbr}?year=${targetYear}`,
			);

			if (!response.ok) {
				throw new Error(`FBI API error: ${response.status}`);
			}

			const data = await response.json();

			if (!data.results || data.results.length === 0) {
				return null;
			}

			const stats = data.results[0];
			const pop = stats.population || 1;

			return {
				year: stats.year,
				population: pop,
				violentCrime: stats.violent_crime || 0,
				violentCrimeRate: ((stats.violent_crime || 0) / pop) * 100000,
				homicide: stats.homicide || 0,
				homicideRate: ((stats.homicide || 0) / pop) * 100000,
				rape: stats.rape_revised || stats.rape_legacy || 0,
				rapeRate:
					((stats.rape_revised || stats.rape_legacy || 0) / pop) * 100000,
				robbery: stats.robbery || 0,
				robberyRate: ((stats.robbery || 0) / pop) * 100000,
				aggravatedAssault: stats.aggravated_assault || 0,
				aggravatedAssaultRate: ((stats.aggravated_assault || 0) / pop) * 100000,
				propertyCrime: stats.property_crime || 0,
				propertyCrimeRate: ((stats.property_crime || 0) / pop) * 100000,
				burglary: stats.burglary || 0,
				burglaryRate: ((stats.burglary || 0) / pop) * 100000,
				larceny: stats.larceny || 0,
				larcenyRate: ((stats.larceny || 0) / pop) * 100000,
				motorVehicleTheft: stats.motor_vehicle_theft || 0,
				motorVehicleTheftRate:
					((stats.motor_vehicle_theft || 0) / pop) * 100000,
				arson: stats.arson,
			};
		} catch (error) {
			console.error("Error fetching state crime stats:", error);
			return null;
		}
	}

	/**
	 * Get national crime statistics
	 */
	async getNationalCrimeStats(year?: number): Promise<CrimeStats | null> {
		const targetYear = year || new Date().getFullYear() - 1;

		try {
			const response = await fetch(
				`${this.baseUrl}/estimate/national?year=${targetYear}`,
			);

			if (!response.ok) {
				throw new Error(`FBI API error: ${response.status}`);
			}

			const data = await response.json();

			if (!data.results || data.results.length === 0) {
				return null;
			}

			const stats = data.results[0];
			const pop = stats.population || 1;

			return {
				year: stats.year,
				population: pop,
				violentCrime: stats.violent_crime || 0,
				violentCrimeRate: ((stats.violent_crime || 0) / pop) * 100000,
				homicide: stats.homicide || 0,
				homicideRate: ((stats.homicide || 0) / pop) * 100000,
				rape: stats.rape_revised || stats.rape_legacy || 0,
				rapeRate:
					((stats.rape_revised || stats.rape_legacy || 0) / pop) * 100000,
				robbery: stats.robbery || 0,
				robberyRate: ((stats.robbery || 0) / pop) * 100000,
				aggravatedAssault: stats.aggravated_assault || 0,
				aggravatedAssaultRate: ((stats.aggravated_assault || 0) / pop) * 100000,
				propertyCrime: stats.property_crime || 0,
				propertyCrimeRate: ((stats.property_crime || 0) / pop) * 100000,
				burglary: stats.burglary || 0,
				burglaryRate: ((stats.burglary || 0) / pop) * 100000,
				larceny: stats.larceny || 0,
				larcenyRate: ((stats.larceny || 0) / pop) * 100000,
				motorVehicleTheft: stats.motor_vehicle_theft || 0,
				motorVehicleTheftRate:
					((stats.motor_vehicle_theft || 0) / pop) * 100000,
				arson: stats.arson,
			};
		} catch (error) {
			console.error("Error fetching national crime stats:", error);
			return null;
		}
	}

	/**
	 * Get crime trends over multiple years for a state
	 */
	async getCrimeTrends(
		stateAbbr: string,
		category: CrimeCategory = "violent-crime",
		years: number = 5,
	): Promise<CrimeTrend | null> {
		const currentYear = new Date().getFullYear() - 1;
		const startYear = currentYear - years + 1;

		try {
			const response = await fetch(
				`${this.baseUrl}/trend/state/${stateAbbr}/${category}?from=${startYear}&to=${currentYear}`,
			);

			if (!response.ok) {
				throw new Error(`FBI API error: ${response.status}`);
			}

			const data = await response.json();

			if (!data.results || data.results.length === 0) {
				return null;
			}

			const yearlyData = data.results.map((r: Record<string, unknown>) => ({
				year: r.year as number,
				count: (r.value as number) || 0,
				rate: (r.rate as number) || 0,
			}));

			// Calculate percent change
			const firstYear = yearlyData[0];
			const lastYear = yearlyData[yearlyData.length - 1];
			const percentChange =
				firstYear.count > 0
					? ((lastYear.count - firstYear.count) / firstYear.count) * 100
					: 0;

			let direction: CrimeTrend["direction"];
			if (percentChange > 5) direction = "increasing";
			else if (percentChange < -5) direction = "decreasing";
			else direction = "stable";

			return {
				startYear,
				endYear: currentYear,
				category,
				percentChange: Math.round(percentChange * 10) / 10,
				direction,
				yearlyData,
			};
		} catch (error) {
			console.error("Error fetching crime trends:", error);
			return null;
		}
	}

	/**
	 * Get agencies in a state
	 */
	async getAgenciesInState(stateAbbr: string): Promise<AgencyInfo[]> {
		try {
			const response = await fetch(
				`${this.baseUrl}/agency/byStateAbbr/${stateAbbr}`,
			);

			if (!response.ok) {
				throw new Error(`FBI API error: ${response.status}`);
			}

			const data = await response.json();

			if (!data.results) return [];

			return data.results.map((a: Record<string, unknown>) => ({
				ori: a.ori as string,
				agencyName: a.agency_name as string,
				agencyType: a.agency_type_name as string,
				state: a.state_abbr as string,
				stateName: a.state_name as string,
				city: a.city_name as string | undefined,
				county: a.county_name as string | undefined,
				population: a.population as number | undefined,
				nibrsParticipation: a.nibrs_participation === "Y",
			}));
		} catch (error) {
			console.error("Error fetching agencies:", error);
			return [];
		}
	}

	/**
	 * Calculate safety score based on crime stats
	 */
	calculateSafetyScore(
		stats: CrimeStats,
		nationalStats: CrimeStats,
	): SafetyScore {
		// National averages (approximate baseline)
		const nationalViolentRate = nationalStats.violentCrimeRate || 380;
		const nationalPropertyRate = nationalStats.propertyCrimeRate || 2100;

		// Calculate relative risk
		const violentRatio = stats.violentCrimeRate / nationalViolentRate;
		const propertyRatio = stats.propertyCrimeRate / nationalPropertyRate;

		// Weighted score (violent crime weighted more heavily)
		const rawScore = 100 - (violentRatio * 40 + propertyRatio * 20);
		const score = Math.max(0, Math.min(100, Math.round(rawScore)));

		// Determine grade
		let grade: SafetyScore["grade"];
		if (score >= 80) grade = "A";
		else if (score >= 65) grade = "B";
		else if (score >= 50) grade = "C";
		else if (score >= 35) grade = "D";
		else grade = "F";

		// Determine risk levels
		const getViolentRisk = (): SafetyScore["violentCrimeRisk"] => {
			if (stats.violentCrimeRate < 200) return "low";
			if (stats.violentCrimeRate < 400) return "moderate";
			if (stats.violentCrimeRate < 700) return "high";
			return "very-high";
		};

		const getPropertyRisk = (): SafetyScore["propertyCrimeRisk"] => {
			if (stats.propertyCrimeRate < 1500) return "low";
			if (stats.propertyCrimeRate < 2500) return "moderate";
			if (stats.propertyCrimeRate < 4000) return "high";
			return "very-high";
		};

		// Generate comparison text
		const violentDiff = Math.round((violentRatio - 1) * 100);
		const vsNational =
			violentDiff > 0
				? `${violentDiff}% higher violent crime than national average`
				: violentDiff < 0
					? `${Math.abs(violentDiff)}% lower violent crime than national average`
					: "At national average for violent crime";

		// Generate recommendations
		const recommendations: string[] = [];
		const violentRisk = getViolentRisk();
		const propertyRisk = getPropertyRisk();

		if (violentRisk === "high" || violentRisk === "very-high") {
			recommendations.push(
				"Schedule appointments during daylight hours when possible",
			);
			recommendations.push("Consider technician safety training and protocols");
			recommendations.push("Use GPS tracking for service vehicles");
		}

		if (propertyRisk === "high" || propertyRisk === "very-high") {
			recommendations.push(
				"Secure tools and equipment in locked vehicle compartments",
			);
			recommendations.push("Consider increased insurance coverage");
			recommendations.push(
				"Avoid leaving vehicle unattended with visible equipment",
			);
			recommendations.push(
				"Document equipment with photos before/after service calls",
			);
		}

		if (stats.burglaryRate > 500) {
			recommendations.push(
				"High burglary area - recommend security system upsells to customers",
			);
		}

		if (stats.motorVehicleTheftRate > 300) {
			recommendations.push(
				"High vehicle theft area - use steering wheel locks on service vehicles",
			);
		}

		return {
			score,
			grade,
			violentCrimeRisk: violentRisk,
			propertyCrimeRisk: propertyRisk,
			comparison: {
				vsNational,
				vsState: "", // Would need state-specific comparison
			},
			recommendations,
		};
	}

	/**
	 * Get state abbreviation from state name
	 */
	getStateAbbreviation(stateName: string): string | null {
		const normalized = stateName.toLowerCase().trim();
		return (
			STATE_ABBREV[normalized] ||
			(stateName.length === 2 ? stateName.toUpperCase() : null)
		);
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Get comprehensive safety report for a service area
	 * Helps field service companies assess risk for different areas
	 */
	async getServiceAreaSafetyReport(
		stateOrCity: string,
	): Promise<ServiceAreaSafetyReport | null> {
		// Parse state from input
		const stateAbbr = this.getStateAbbreviation(stateOrCity);
		if (!stateAbbr) {
			console.error("Could not determine state from:", stateOrCity);
			return null;
		}

		const [
			stateStats,
			nationalStats,
			violentTrend,
			propertyTrend,
			burglaryTrend,
		] = await Promise.all([
			this.getStateCrimeStats(stateAbbr),
			this.getNationalCrimeStats(),
			this.getCrimeTrends(stateAbbr, "violent-crime", 5),
			this.getCrimeTrends(stateAbbr, "property-crime", 5),
			this.getCrimeTrends(stateAbbr, "burglary", 5),
		]);

		if (!stateStats || !nationalStats) {
			return null;
		}

		const safetyScore = this.calculateSafetyScore(stateStats, nationalStats);
		const trends = [violentTrend, propertyTrend, burglaryTrend].filter(
			(t): t is CrimeTrend => t !== null,
		);

		const implications = this.generateFieldServiceImplications(
			stateStats,
			safetyScore,
			trends,
		);

		return {
			location: stateOrCity,
			stateAbbr,
			safetyScore,
			recentStats: stateStats,
			trends,
			fieldServiceImplications: implications,
		};
	}

	/**
	 * Generate field service specific implications from crime data
	 */
	private generateFieldServiceImplications(
		stats: CrimeStats,
		safety: SafetyScore,
		trends: CrimeTrend[],
	): FieldServiceImplication[] {
		const implications: FieldServiceImplication[] = [];

		// Scheduling implications
		if (
			safety.violentCrimeRisk === "high" ||
			safety.violentCrimeRisk === "very-high"
		) {
			implications.push({
				category: "scheduling",
				risk: "high",
				recommendation:
					"Prefer daytime appointments (7AM-5PM). Avoid scheduling after dark in high-risk areas.",
			});
		} else if (safety.violentCrimeRisk === "moderate") {
			implications.push({
				category: "scheduling",
				risk: "medium",
				recommendation:
					"Evening appointments acceptable but notify dispatch of completion.",
			});
		} else {
			implications.push({
				category: "scheduling",
				risk: "low",
				recommendation:
					"Standard scheduling practices acceptable for this area.",
			});
		}

		// Equipment security implications
		if (
			safety.propertyCrimeRisk === "high" ||
			safety.propertyCrimeRisk === "very-high"
		) {
			implications.push({
				category: "equipment",
				risk: "high",
				recommendation:
					"High theft risk - use locked tool boxes, avoid visible equipment, never leave vehicle unlocked.",
			});
		} else if (stats.motorVehicleTheftRate > 300) {
			implications.push({
				category: "equipment",
				risk: "medium",
				recommendation:
					"Elevated vehicle theft risk - consider GPS tracking and steering wheel locks.",
			});
		}

		// Safety protocol implications
		if (safety.violentCrimeRisk !== "low") {
			implications.push({
				category: "safety",
				risk: safety.violentCrimeRisk === "very-high" ? "high" : "medium",
				recommendation:
					"Implement buddy system for first visits. Share customer info with dispatch before arrival.",
			});
		}

		// Insurance implications
		const burglaryTrend = trends.find((t) => t.category === "burglary");
		if (
			stats.burglaryRate > 600 ||
			(burglaryTrend && burglaryTrend.direction === "increasing")
		) {
			implications.push({
				category: "insurance",
				risk: "high",
				recommendation:
					"Review tool and equipment insurance coverage. Consider higher deductible theft policy.",
			});
		}

		return implications;
	}

	/**
	 * Check if an area is safe for evening/night service calls
	 */
	async isEveningServiceSafe(stateAbbr: string): Promise<{
		safe: boolean;
		recommendation: string;
		violentCrimeRate: number;
	}> {
		const stats = await this.getStateCrimeStats(stateAbbr);

		if (!stats) {
			return {
				safe: false,
				recommendation:
					"Unable to determine crime data. Use caution for evening appointments.",
				violentCrimeRate: 0,
			};
		}

		// Threshold for "safe" evening service (violent crime rate per 100k)
		const EVENING_SAFE_THRESHOLD = 350;
		const EVENING_CAUTION_THRESHOLD = 500;

		if (stats.violentCrimeRate < EVENING_SAFE_THRESHOLD) {
			return {
				safe: true,
				recommendation:
					"Area is relatively safe for evening service calls. Standard precautions apply.",
				violentCrimeRate: Math.round(stats.violentCrimeRate),
			};
		} else if (stats.violentCrimeRate < EVENING_CAUTION_THRESHOLD) {
			return {
				safe: true,
				recommendation:
					"Exercise caution for evening calls. Notify dispatch of arrival and departure.",
				violentCrimeRate: Math.round(stats.violentCrimeRate),
			};
		} else {
			return {
				safe: false,
				recommendation:
					"Avoid evening appointments when possible. If necessary, use two-person teams.",
				violentCrimeRate: Math.round(stats.violentCrimeRate),
			};
		}
	}

	/**
	 * Get tool/equipment theft risk for a service area
	 * Helps determine security measures for service vehicles
	 */
	async getEquipmentTheftRisk(stateAbbr: string): Promise<{
		riskLevel: "low" | "medium" | "high" | "very-high";
		larcenyRate: number;
		vehicleTheftRate: number;
		burglaryRate: number;
		recommendations: string[];
	}> {
		const stats = await this.getStateCrimeStats(stateAbbr);

		if (!stats) {
			return {
				riskLevel: "medium",
				larcenyRate: 0,
				vehicleTheftRate: 0,
				burglaryRate: 0,
				recommendations: [
					"Unable to determine theft risk. Use standard security measures.",
				],
			};
		}

		// Calculate combined theft risk score
		const larcenyScore =
			stats.larcenyRate > 2500
				? 3
				: stats.larcenyRate > 1500
					? 2
					: stats.larcenyRate > 800
						? 1
						: 0;
		const vehicleScore =
			stats.motorVehicleTheftRate > 400
				? 3
				: stats.motorVehicleTheftRate > 250
					? 2
					: stats.motorVehicleTheftRate > 150
						? 1
						: 0;
		const burglaryScore =
			stats.burglaryRate > 600
				? 3
				: stats.burglaryRate > 400
					? 2
					: stats.burglaryRate > 200
						? 1
						: 0;

		const totalScore = larcenyScore + vehicleScore + burglaryScore;

		let riskLevel: "low" | "medium" | "high" | "very-high";
		const recommendations: string[] = [];

		if (totalScore <= 2) {
			riskLevel = "low";
			recommendations.push("Standard vehicle security is sufficient");
			recommendations.push("Lock vehicle and keep tools out of sight");
		} else if (totalScore <= 4) {
			riskLevel = "medium";
			recommendations.push("Use locked tool boxes and cargo areas");
			recommendations.push(
				"Avoid leaving vehicle unattended for extended periods",
			);
			recommendations.push("Park in visible, well-lit areas");
		} else if (totalScore <= 6) {
			riskLevel = "high";
			recommendations.push("Install vehicle alarm system and GPS tracker");
			recommendations.push("Use cable locks for large tools");
			recommendations.push("Consider insurance coverage for tools");
			recommendations.push("Take high-value tools inside when possible");
		} else {
			riskLevel = "very-high";
			recommendations.push("Use enclosed, secured cargo area with alarm");
			recommendations.push("GPS tracking essential for recovery");
			recommendations.push("Consider hiring security for high-value jobs");
			recommendations.push("Document all tools with serial numbers and photos");
			recommendations.push("Review insurance policy for adequate coverage");
		}

		return {
			riskLevel,
			larcenyRate: Math.round(stats.larcenyRate),
			vehicleTheftRate: Math.round(stats.motorVehicleTheftRate),
			burglaryRate: Math.round(stats.burglaryRate),
			recommendations,
		};
	}

	/**
	 * Compare safety across multiple service areas
	 * Helps prioritize expansion or resource allocation
	 */
	async compareServiceAreas(stateAbbrs: string[]): Promise<
		{
			state: string;
			safetyScore: number;
			violentCrimeRate: number;
			propertyCrimeRate: number;
			recommendation: string;
		}[]
	> {
		const nationalStats = await this.getNationalCrimeStats();
		if (!nationalStats) return [];

		const results = await Promise.all(
			stateAbbrs.map(async (abbr) => {
				const stats = await this.getStateCrimeStats(abbr);
				if (!stats) return null;

				const safety = this.calculateSafetyScore(stats, nationalStats);

				let recommendation: string;
				if (safety.score >= 70) {
					recommendation = "Low risk area - standard operations";
				} else if (safety.score >= 50) {
					recommendation = "Moderate risk - implement safety protocols";
				} else {
					recommendation = "High risk - enhanced security measures required";
				}

				return {
					state: abbr,
					safetyScore: safety.score,
					violentCrimeRate: Math.round(stats.violentCrimeRate),
					propertyCrimeRate: Math.round(stats.propertyCrimeRate),
					recommendation,
				};
			}),
		);

		return results
			.filter((r): r is NonNullable<typeof r> => r !== null)
			.sort((a, b) => b.safetyScore - a.safetyScore);
	}
}

// Export singleton instance
export const fbiCrimeService = new FBICrimeService();
