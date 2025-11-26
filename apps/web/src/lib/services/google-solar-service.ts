/**
 * Google Solar Service
 *
 * Provides solar potential analysis using Google Solar API
 * - Building insights (roof area, pitch, azimuth)
 * - Solar potential calculations
 * - Financial analysis (savings, payback period)
 * - Panel configuration recommendations
 *
 * API: Google Solar API
 * Docs: https://developers.google.com/maps/documentation/solar
 *
 * Use Cases for Field Service:
 * - Solar installation proposals
 * - HVAC + Solar bundle offers
 * - Property assessment for roofing contractors
 * - Energy efficiency consultations
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

// ============================================================================
// Types and Schemas
// ============================================================================

const LatLngBoxSchema = z.object({
	sw: z.object({ lat: z.number(), lng: z.number() }),
	ne: z.object({ lat: z.number(), lng: z.number() }),
});

const RoofSegmentSchema = z.object({
	pitchDegrees: z.number(), // Roof pitch in degrees
	azimuthDegrees: z.number(), // Direction roof faces (0=N, 90=E, 180=S, 270=W)
	stats: z.object({
		areaMeters2: z.number(), // Roof segment area
		sunshineQuantiles: z.array(z.number()).optional(), // Sunshine distribution
		groundAreaMeters2: z.number().optional(),
	}),
	center: z.object({ lat: z.number(), lng: z.number() }).optional(),
	boundingBox: LatLngBoxSchema.optional(),
	planeHeightAtCenterMeters: z.number().optional(),
});

const SolarPanelConfigSchema = z.object({
	panelsCount: z.number(),
	yearlyEnergyDcKwh: z.number(), // DC energy production per year
	roofSegmentSummaries: z
		.array(
			z.object({
				pitchDegrees: z.number(),
				azimuthDegrees: z.number(),
				panelsCount: z.number(),
				yearlyEnergyDcKwh: z.number(),
				segmentIndex: z.number(),
			}),
		)
		.optional(),
});

const FinancialAnalysisSchema = z.object({
	monthlyBill: z.object({
		currencyCode: z.string(),
		units: z.string(),
		nanos: z.number().optional(),
	}),
	panelConfigIndex: z.number(),
	financialDetails: z
		.object({
			initialAcKwhPerYear: z.number(), // First year production
			remainingLifetimeUtilityBill: z.object({
				currencyCode: z.string(),
				units: z.string(),
			}),
			federalIncentive: z
				.object({
					currencyCode: z.string(),
					units: z.string(),
				})
				.optional(),
			stateIncentive: z
				.object({
					currencyCode: z.string(),
					units: z.string(),
				})
				.optional(),
			utilityIncentive: z
				.object({
					currencyCode: z.string(),
					units: z.string(),
				})
				.optional(),
			lifetimeSrecTotal: z
				.object({
					currencyCode: z.string(),
					units: z.string(),
				})
				.optional(),
			costOfElectricityWithoutSolar: z
				.object({
					currencyCode: z.string(),
					units: z.string(),
				})
				.optional(),
			netMeteringAllowed: z.boolean().optional(),
			solarPercentage: z.number().optional(), // % of energy from solar
			percentageExportedToGrid: z.number().optional(),
		})
		.optional(),
	leasingSavings: z
		.object({
			leasesAllowed: z.boolean(),
			leasesSupported: z.boolean(),
			annualLeasingCost: z
				.object({
					currencyCode: z.string(),
					units: z.string(),
				})
				.optional(),
			savings: z
				.object({
					savingsYear1: z.object({
						currencyCode: z.string(),
						units: z.string(),
					}),
					savingsYear20: z.object({
						currencyCode: z.string(),
						units: z.string(),
					}),
					savingsLifetime: z.object({
						currencyCode: z.string(),
						units: z.string(),
					}),
				})
				.optional(),
		})
		.optional(),
	cashPurchaseSavings: z
		.object({
			outOfPocketCost: z.object({
				currencyCode: z.string(),
				units: z.string(),
			}),
			upfrontCost: z.object({
				currencyCode: z.string(),
				units: z.string(),
			}),
			rebateValue: z
				.object({
					currencyCode: z.string(),
					units: z.string(),
				})
				.optional(),
			paybackYears: z.number().optional(),
			savings: z.object({
				savingsYear1: z.object({
					currencyCode: z.string(),
					units: z.string(),
				}),
				savingsYear20: z.object({
					currencyCode: z.string(),
					units: z.string(),
				}),
				savingsLifetime: z.object({
					currencyCode: z.string(),
					units: z.string(),
				}),
			}),
		})
		.optional(),
	financedPurchaseSavings: z
		.object({
			annualLoanPayment: z.object({
				currencyCode: z.string(),
				units: z.string(),
			}),
			loanInterestRate: z.number(),
			savings: z
				.object({
					savingsYear1: z.object({
						currencyCode: z.string(),
						units: z.string(),
					}),
					savingsYear20: z.object({
						currencyCode: z.string(),
						units: z.string(),
					}),
					savingsLifetime: z.object({
						currencyCode: z.string(),
						units: z.string(),
					}),
				})
				.optional(),
		})
		.optional(),
});

const BuildingInsightsSchema = z.object({
	name: z.string().optional(),
	center: z.object({ lat: z.number(), lng: z.number() }),
	boundingBox: LatLngBoxSchema.optional(),
	imageryDate: z
		.object({
			year: z.number(),
			month: z.number(),
			day: z.number(),
		})
		.optional(),
	imageryProcessedDate: z
		.object({
			year: z.number(),
			month: z.number(),
			day: z.number(),
		})
		.optional(),
	postalCode: z.string().optional(),
	administrativeArea: z.string().optional(),
	statisticalArea: z.string().optional(),
	regionCode: z.string().optional(),
	solarPotential: z.object({
		maxArrayPanelsCount: z.number(),
		maxArrayAreaMeters2: z.number(),
		maxSunshineHoursPerYear: z.number(),
		carbonOffsetFactorKgPerMwh: z.number(),
		wholeRoofStats: z
			.object({
				areaMeters2: z.number(),
				sunshineQuantiles: z.array(z.number()).optional(),
				groundAreaMeters2: z.number().optional(),
			})
			.optional(),
		roofSegmentStats: z.array(RoofSegmentSchema).optional(),
		solarPanelConfigs: z.array(SolarPanelConfigSchema).optional(),
		financialAnalyses: z.array(FinancialAnalysisSchema).optional(),
		panelCapacityWatts: z.number().optional(),
		panelHeightMeters: z.number().optional(),
		panelWidthMeters: z.number().optional(),
		panelLifetimeYears: z.number().optional(),
	}),
});

const SolarDataSchema = z.object({
	location: z.object({
		lat: z.number(),
		lng: z.number(),
	}),
	buildingInsights: BuildingInsightsSchema.optional(),
	dataQuality: z.enum(["HIGH", "MEDIUM", "LOW", "IMAGERY_UNAVAILABLE"]),
	source: z.enum(["google"]),
	enrichedAt: z.string(),
});

export type RoofSegment = z.infer<typeof RoofSegmentSchema>;
export type SolarPanelConfig = z.infer<typeof SolarPanelConfigSchema>;
export type FinancialAnalysis = z.infer<typeof FinancialAnalysisSchema>;
export type BuildingInsights = z.infer<typeof BuildingInsightsSchema>;
export type SolarData = z.infer<typeof SolarDataSchema>;

// ============================================================================
// Cache Configuration
// ============================================================================

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours (building data doesn't change often)

// ============================================================================
// Google Solar Service
// ============================================================================

class GoogleSolarService {
	private readonly apiKey: string | undefined;
	private readonly cache: Map<string, { data: SolarData; timestamp: number }> =
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
	 * Get solar potential data for a building
	 */
	async getSolarData(lat: number, lng: number): Promise<SolarData | null> {
		const cacheKey = `solar:${lat.toFixed(6)},${lng.toFixed(6)}`;
		const cached = this.cache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			return cached.data;
		}

		if (!this.apiKey) {
			console.warn("Google Solar Service: No API key configured");
			return null;
		}

		try {
			const url = new URL(
				"https://solar.googleapis.com/v1/buildingInsights:findClosest",
			);
			url.searchParams.set("location.latitude", lat.toString());
			url.searchParams.set("location.longitude", lng.toString());
			url.searchParams.set("requiredQuality", "LOW"); // Get data even if quality isn't perfect
			url.searchParams.set("key", this.apiKey);

			const response = await fetch(url.toString(), {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				if (response.status === 404) {
					// No building data available
					return {
						location: { lat, lng },
						dataQuality: "IMAGERY_UNAVAILABLE",
						source: "google",
						enrichedAt: new Date().toISOString(),
					};
				}
				console.error(`Google Solar API error: ${response.status}`);
				return null;
			}

			const data = await response.json();

			const solarData: SolarData = {
				location: { lat, lng },
				buildingInsights: data,
				dataQuality: data.imageryQuality || "MEDIUM",
				source: "google",
				enrichedAt: new Date().toISOString(),
			};

			const validated = SolarDataSchema.parse(solarData);
			this.cache.set(cacheKey, { data: validated, timestamp: Date.now() });
			this.cleanCache();

			return validated;
		} catch (error) {
			console.error("Google Solar fetch error:", error);
			return null;
		}
	}

	/**
	 * Get solar potential summary for a property
	 */
	getSolarSummary(data: SolarData): {
		hasData: boolean;
		maxPanels: number;
		maxAreaSqFt: number;
		yearlyEnergyKwh: number;
		carbonOffsetLbs: number;
		sunshineHoursPerYear: number;
		roofSegments: number;
		bestRoofPitch: number;
		bestRoofDirection: string;
		dataQuality: string;
	} | null {
		if (!data.buildingInsights?.solarPotential) {
			return {
				hasData: false,
				maxPanels: 0,
				maxAreaSqFt: 0,
				yearlyEnergyKwh: 0,
				carbonOffsetLbs: 0,
				sunshineHoursPerYear: 0,
				roofSegments: 0,
				bestRoofPitch: 0,
				bestRoofDirection: "Unknown",
				dataQuality: data.dataQuality,
			};
		}

		const sp = data.buildingInsights.solarPotential;
		const configs = sp.solarPanelConfigs || [];
		const segments = sp.roofSegmentStats || [];

		// Find best configuration (most panels)
		const bestConfig = configs.reduce(
			(best, config) =>
				config.panelsCount > (best?.panelsCount || 0) ? config : best,
			configs[0],
		);

		// Find best roof segment (most sunshine, south-facing preferred)
		const bestSegment = segments.reduce((best, seg) => {
			if (!best) return seg;
			// Prefer south-facing (180°) roofs
			const bestSouthScore = 180 - Math.abs(180 - best.azimuthDegrees);
			const segSouthScore = 180 - Math.abs(180 - seg.azimuthDegrees);
			return segSouthScore > bestSouthScore ? seg : best;
		}, segments[0]);

		const directionFromAzimuth = (az: number): string => {
			const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
			const index = Math.round(az / 45) % 8;
			return dirs[index];
		};

		return {
			hasData: true,
			maxPanels: sp.maxArrayPanelsCount,
			maxAreaSqFt: Math.round(sp.maxArrayAreaMeters2 * 10.764), // m² to ft²
			yearlyEnergyKwh: Math.round(bestConfig?.yearlyEnergyDcKwh || 0),
			carbonOffsetLbs: Math.round(
				(sp.carbonOffsetFactorKgPerMwh *
					((bestConfig?.yearlyEnergyDcKwh || 0) / 1000) *
					2.205) /
					1, // kg to lbs
			),
			sunshineHoursPerYear: Math.round(sp.maxSunshineHoursPerYear),
			roofSegments: segments.length,
			bestRoofPitch: Math.round(bestSegment?.pitchDegrees || 0),
			bestRoofDirection: bestSegment
				? directionFromAzimuth(bestSegment.azimuthDegrees)
				: "Unknown",
			dataQuality: data.dataQuality,
		};
	}

	/**
	 * Get financial analysis for solar installation
	 */
	getFinancialAnalysis(
		data: SolarData,
		monthlyBill: number,
	): {
		hasData: boolean;
		recommendedPanels: number;
		estimatedCost: number;
		yearlyProduction: number;
		yearlyValueGenerated: number;
		monthlyBillReduction: number;
		paybackYears: number;
		twentyYearSavings: number;
		federalTaxCredit: number;
		solarPercentage: number;
	} | null {
		if (!data.buildingInsights?.solarPotential) {
			return null;
		}

		const sp = data.buildingInsights.solarPotential;
		const analyses = sp.financialAnalyses || [];

		// Find analysis closest to the given monthly bill
		const analysis = analyses.reduce((closest, current) => {
			if (!closest) return current;
			const closestBill = parseFloat(closest.monthlyBill.units);
			const currentBill = parseFloat(current.monthlyBill.units);
			return Math.abs(currentBill - monthlyBill) <
				Math.abs(closestBill - monthlyBill)
				? current
				: closest;
		}, analyses[0]);

		if (!analysis) {
			return null;
		}

		const configs = sp.solarPanelConfigs || [];
		const config = configs[analysis.panelConfigIndex] || configs[0];
		const cash = analysis.cashPurchaseSavings;
		const details = analysis.financialDetails;

		// Calculate estimated values
		const panelWatts = sp.panelCapacityWatts || 400;
		const costPerWatt = 2.75; // Average installed cost per watt in 2024
		const estimatedCost = config
			? config.panelsCount * panelWatts * costPerWatt
			: 0;
		const federalCredit = estimatedCost * 0.3; // 30% federal ITC

		// Estimate electricity rate from production and savings
		const yearlyProduction = config?.yearlyEnergyDcKwh || 0;
		const avgElectricityRate = 0.15; // $0.15/kWh average
		const yearlyValue = yearlyProduction * avgElectricityRate;

		return {
			hasData: true,
			recommendedPanels: config?.panelsCount || 0,
			estimatedCost: Math.round(estimatedCost),
			yearlyProduction: Math.round(yearlyProduction),
			yearlyValueGenerated: Math.round(yearlyValue),
			monthlyBillReduction: Math.round(yearlyValue / 12),
			paybackYears:
				cash?.paybackYears || Math.round(estimatedCost / yearlyValue),
			twentyYearSavings: cash?.savings?.savingsYear20
				? parseFloat(cash.savings.savingsYear20.units)
				: Math.round(yearlyValue * 20 - estimatedCost + federalCredit),
			federalTaxCredit: Math.round(federalCredit),
			solarPercentage: details?.solarPercentage || 0,
		};
	}

	/**
	 * Check if property is suitable for solar
	 */
	isSuitableForSolar(data: SolarData): {
		suitable: boolean;
		score: number; // 0-100
		reasons: string[];
		concerns: string[];
	} {
		if (!data.buildingInsights?.solarPotential) {
			return {
				suitable: false,
				score: 0,
				reasons: [],
				concerns: ["No solar data available for this location"],
			};
		}

		const sp = data.buildingInsights.solarPotential;
		const reasons: string[] = [];
		const concerns: string[] = [];
		let score = 50; // Base score

		// Check sunshine hours
		if (sp.maxSunshineHoursPerYear > 1500) {
			reasons.push(
				`Excellent sunshine: ${Math.round(sp.maxSunshineHoursPerYear)} hours/year`,
			);
			score += 20;
		} else if (sp.maxSunshineHoursPerYear > 1200) {
			reasons.push(
				`Good sunshine: ${Math.round(sp.maxSunshineHoursPerYear)} hours/year`,
			);
			score += 10;
		} else {
			concerns.push(
				`Limited sunshine: ${Math.round(sp.maxSunshineHoursPerYear)} hours/year`,
			);
			score -= 10;
		}

		// Check roof area
		if (sp.maxArrayAreaMeters2 > 50) {
			reasons.push(
				`Large roof area: ${Math.round(sp.maxArrayAreaMeters2 * 10.764)} sq ft available`,
			);
			score += 15;
		} else if (sp.maxArrayAreaMeters2 > 25) {
			reasons.push(
				`Adequate roof area: ${Math.round(sp.maxArrayAreaMeters2 * 10.764)} sq ft`,
			);
			score += 5;
		} else {
			concerns.push(
				`Limited roof area: ${Math.round(sp.maxArrayAreaMeters2 * 10.764)} sq ft`,
			);
			score -= 15;
		}

		// Check panel capacity
		if (sp.maxArrayPanelsCount > 30) {
			reasons.push(`Can fit ${sp.maxArrayPanelsCount} panels`);
			score += 10;
		} else if (sp.maxArrayPanelsCount > 15) {
			reasons.push(`Can fit ${sp.maxArrayPanelsCount} panels`);
			score += 5;
		} else if (sp.maxArrayPanelsCount < 10) {
			concerns.push(`Limited panel capacity: ${sp.maxArrayPanelsCount} panels`);
			score -= 10;
		}

		// Check roof segments for south-facing sections
		const segments = sp.roofSegmentStats || [];
		const southFacing = segments.filter(
			(s) => s.azimuthDegrees >= 135 && s.azimuthDegrees <= 225,
		);
		if (southFacing.length > 0) {
			reasons.push(`${southFacing.length} south-facing roof section(s)`);
			score += 10;
		} else {
			concerns.push("No south-facing roof sections");
			score -= 5;
		}

		// Data quality
		if (data.dataQuality === "HIGH") {
			score += 5;
		} else if (data.dataQuality === "LOW") {
			concerns.push("Limited imagery quality - estimates may be less accurate");
			score -= 5;
		}

		// Clamp score
		score = Math.max(0, Math.min(100, score));

		return {
			suitable: score >= 50,
			score,
			reasons,
			concerns,
		};
	}

	/**
	 * Generate solar proposal summary for customer
	 */
	generateProposalSummary(
		data: SolarData,
		monthlyBill: number,
	): {
		headline: string;
		systemSize: string;
		panelCount: number;
		estimatedCost: string;
		federalCredit: string;
		netCost: string;
		yearlyProduction: string;
		monthlyOffset: string;
		paybackPeriod: string;
		twentyYearSavings: string;
		carbonOffset: string;
		suitable: boolean;
		concerns: string[];
	} {
		const summary = this.getSolarSummary(data);
		const financial = this.getFinancialAnalysis(data, monthlyBill);
		const suitability = this.isSuitableForSolar(data);

		if (!summary?.hasData || !financial?.hasData) {
			return {
				headline: "Solar assessment unavailable",
				systemSize: "N/A",
				panelCount: 0,
				estimatedCost: "N/A",
				federalCredit: "N/A",
				netCost: "N/A",
				yearlyProduction: "N/A",
				monthlyOffset: "N/A",
				paybackPeriod: "N/A",
				twentyYearSavings: "N/A",
				carbonOffset: "N/A",
				suitable: false,
				concerns: ["Solar data not available for this location"],
			};
		}

		const systemKw = (
			(financial.recommendedPanels *
				(data.buildingInsights?.solarPotential?.panelCapacityWatts || 400)) /
			1000
		).toFixed(1);

		return {
			headline: suitability.suitable
				? `Great solar potential! Save up to $${financial.twentyYearSavings.toLocaleString()} over 20 years`
				: `Solar may be limited at this property`,
			systemSize: `${systemKw} kW system`,
			panelCount: financial.recommendedPanels,
			estimatedCost: `$${financial.estimatedCost.toLocaleString()}`,
			federalCredit: `$${financial.federalTaxCredit.toLocaleString()} (30% ITC)`,
			netCost: `$${(financial.estimatedCost - financial.federalTaxCredit).toLocaleString()}`,
			yearlyProduction: `${financial.yearlyProduction.toLocaleString()} kWh/year`,
			monthlyOffset: `$${financial.monthlyBillReduction}/month`,
			paybackPeriod: `${financial.paybackYears} years`,
			twentyYearSavings: `$${financial.twentyYearSavings.toLocaleString()}`,
			carbonOffset: `${summary.carbonOffsetLbs.toLocaleString()} lbs CO₂/year`,
			suitable: suitability.suitable,
			concerns: suitability.concerns,
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

		if (this.cache.size > 200) {
			const entries = Array.from(this.cache.entries());
			entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
			this.cache.clear();
			for (const [key, value] of entries.slice(0, 100)) {
				this.cache.set(key, value);
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
export const googleSolarService = new GoogleSolarService();
