/**
 * Water Quality Service
 *
 * Provides water hardness data for upselling water softeners
 * Uses USGS Water Quality Portal (free, public data)
 *
 * Features:
 * - Water hardness measurements (mg/L as CaCO3)
 * - Softener recommendations
 * - Historical data trends
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

// ============================================================================
// Types and Schemas
// ============================================================================

export const WaterQualitySchema = z.object({
	location: z.object({
		lat: z.number(),
		lon: z.number(),
		siteName: z.string().optional(),
		organization: z.string().optional(),
	}),
	hardness: z.object({
		valueMgL: z.number(),
		classification: z.enum(["soft", "moderate", "hard", "very_hard"]),
		unit: z.string(),
		measurementDate: z.string().optional(),
	}),
	recommendations: z.object({
		shouldInstallSoftener: z.boolean(),
		reason: z.string(),
		estimatedAnnualSavings: z.number().optional(), // In cents
	}),
	enrichedAt: z.string(),
});

export type WaterQuality = z.infer<typeof WaterQualitySchema>;

// ============================================================================
// Water Quality Service
// ============================================================================

export class WaterQualityService {
	private readonly cache: Map<string, { data: WaterQuality; timestamp: number }> = new Map();
	private readonly cacheTTL = 1000 * 60 * 60 * 24 * 30; // 30 days (data changes slowly)

	/**
	 * Get water quality data for a location
	 */
	async getWaterQuality(lat: number, lon: number): Promise<WaterQuality | null> {
		const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;

		// Check cache
		const cached = this.cache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		try {
			// Query Water Quality Portal for hardness measurements
			const params = new URLSearchParams({
				mimeType: "json",
				zip: "no",
				// Search for hardness as CaCO3
				characteristicName: "Hardness, Ca, Mg as CaCO3",
				lat: lat.toFixed(6),
				long: lon.toFixed(6),
				within: "25", // 25 km radius
				sorted: "no",
				startDateLo: this.getDateYearsAgo(5), // Last 5 years
			});

			const url = `https://www.waterqualitydata.us/data/Result/search?${params}`;

			const res = await fetch(url, {
				headers: {
					"User-Agent": USER_AGENT,
					Accept: "application/json",
				},
			});

			if (!res.ok) {
				// 406 (Not Acceptable) or 404 means no data available for this location (expected)
				if (res.status === 404 || res.status === 406) {
					// TODO: Handle error case
				} else {
				}
				return null;
			}

			const data = await res.json();

			if (!(data && Array.isArray(data)) || data.length === 0) {
				// No data available - return default/unknown
				return this.getDefaultWaterQuality(lat, lon);
			}

			// Get most recent measurement
			const measurements = data
				.filter((row: any) => row.ResultMeasureValue && !Number.isNaN(Number(row.ResultMeasureValue)))
				.map((row: any) => ({
					value: Number(row.ResultMeasureValue),
					unit: row.ResultMeasure?.MeasureUnitCode || "mg/L",
					date: row.ActivityStartDate,
					site: row.MonitoringLocationName,
					org: row.OrganizationFormalName,
				}))
				.sort((a: any, b: any) => {
					const dateA = new Date(a.date || 0);
					const dateB = new Date(b.date || 0);
					return dateB.getTime() - dateA.getTime();
				});

			if (measurements.length === 0) {
				return this.getDefaultWaterQuality(lat, lon);
			}

			const latest = measurements[0];
			const hardnessValue = latest.value;

			// Classify hardness
			const classification = this.classifyHardness(hardnessValue);

			// Generate recommendations
			const recommendations = this.generateRecommendations(hardnessValue, classification);

			const waterQuality: WaterQuality = {
				location: {
					lat,
					lon,
					siteName: latest.site,
					organization: latest.org,
				},
				hardness: {
					valueMgL: hardnessValue,
					classification,
					unit: latest.unit,
					measurementDate: latest.date,
				},
				recommendations,
				enrichedAt: new Date().toISOString(),
			};

			// Cache the result
			this.cache.set(cacheKey, { data: waterQuality, timestamp: Date.now() });

			return WaterQualitySchema.parse(waterQuality);
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Classify water hardness
	 */
	private classifyHardness(mgL: number): WaterQuality["hardness"]["classification"] {
		if (mgL < 60) {
			return "soft";
		}
		if (mgL < 120) {
			return "moderate";
		}
		if (mgL < 180) {
			return "hard";
		}
		return "very_hard";
	}

	/**
	 * Generate softener recommendations
	 */
	private generateRecommendations(
		hardness: number,
		classification: WaterQuality["hardness"]["classification"]
	): WaterQuality["recommendations"] {
		const shouldInstall = hardness >= 120; // Hard or very hard

		let reason = "";
		let estimatedSavings: number | undefined;

		if (classification === "soft") {
			reason = "Your water is soft and doesn't require a softener.";
		} else if (classification === "moderate") {
			reason = "Your water hardness is moderate. A softener is optional but may extend appliance life.";
			estimatedSavings = 20_000; // $200/year
		} else if (classification === "hard") {
			reason = "Your water is hard. We recommend installing a water softener to protect your pipes and appliances.";
			estimatedSavings = 50_000; // $500/year
		} else {
			reason =
				"Your water is very hard. A water softener is highly recommended to prevent scale buildup and extend equipment life.";
			estimatedSavings = 80_000; // $800/year
		}

		return {
			shouldInstallSoftener: shouldInstall,
			reason,
			estimatedAnnualSavings: estimatedSavings,
		};
	}

	/**
	 * Get default water quality when no data available
	 */
	private getDefaultWaterQuality(lat: number, lon: number): WaterQuality {
		return {
			location: { lat, lon },
			hardness: {
				valueMgL: 100, // National average
				classification: "moderate",
				unit: "mg/L",
			},
			recommendations: {
				shouldInstallSoftener: false,
				reason: "No local water hardness data available. National average suggests moderate hardness.",
			},
			enrichedAt: new Date().toISOString(),
		};
	}

	/**
	 * Get date N years ago in YYYY-MM-DD format
	 */
	private getDateYearsAgo(years: number): string {
		const date = new Date();
		date.setFullYear(date.getFullYear() - years);
		return date.toISOString().split("T")[0];
	}

	/**
	 * Clear cache
	 */
	clearCache(): void {
		this.cache.clear();
	}
}

// Singleton instance
export const waterQualityService = new WaterQualityService();
