/**
 * Demographics Service
 *
 * Fetches demographic data from US Census Bureau API
 * - Population density
 * - Median household income
 * - Age distribution
 * - Education levels
 *
 * API: FREE, no key required
 * Docs: https://www.census.gov/data/developers/data-sets.html
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

export const DemographicsSchema = z.object({
	population: z.number().optional(),
	populationDensity: z.number().optional(), // per sq mile
	medianHouseholdIncome: z.number().optional(),
	medianAge: z.number().optional(),
	educationBachelorsOrHigher: z.number().optional(), // percentage
	housingUnits: z.number().optional(),
	medianHomeValue: z.number().optional(),
	povertyRate: z.number().optional(), // percentage
	unemploymentRate: z.number().optional(), // percentage
	dataSource: z.string(),
	enrichedAt: z.string(),
});

export type Demographics = z.infer<typeof DemographicsSchema>;

export class DemographicsService {
	private readonly cache: Map<
		string,
		{ data: Demographics; timestamp: number }
	> = new Map();
	private readonly cacheTTL = 1000 * 60 * 60 * 24 * 90; // 90 days (census data updates quarterly)

	async getDemographics(
		lat: number,
		lon: number,
	): Promise<Demographics | null> {
		const cacheKey = `demographics:${lat.toFixed(4)},${lon.toFixed(4)}`;
		const cached = this.cache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		try {
			// First, get the census tract for this location using FCC API
			const geoUrl = `https://geo.fcc.gov/api/census/block/find?latitude=${lat}&longitude=${lon}&format=json`;

			const geoRes = await fetch(geoUrl, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!geoRes.ok) {
				return null;
			}

			const geoData = await geoRes.json();
			const stateFips = geoData.State?.FIPS;
			const countyFips = geoData.County?.FIPS;
			const tractCode = geoData.Block?.FIPS?.substring(0, 11); // First 11 digits = tract

			if (!(stateFips && countyFips && tractCode)) {
				return null;
			}

			// Get ACS 5-year data (most comprehensive, updated annually)
			// Using ACS because it has more detailed demographic data than decennial census
			const year = 2022; // Latest available ACS data
			const variables = [
				"B01003_001E", // Total population
				"B19013_001E", // Median household income
				"B01002_001E", // Median age
				"B15003_022E", // Bachelor's degree
				"B15003_023E", // Master's degree
				"B15003_024E", // Professional degree
				"B15003_025E", // Doctorate degree
				"B15003_001E", // Total population for education calc
				"B25077_001E", // Median home value
				"B17001_002E", // Poverty count
				"B17001_001E", // Total for poverty rate
				"B23025_005E", // Unemployed
				"B23025_003E", // Total in labor force
			].join(",");

			const censusUrl = `https://api.census.gov/data/${year}/acs/acs5?get=${variables}&for=tract:${tractCode.substring(5)}&in=state:${stateFips}%20county:${countyFips}`;

			const censusRes = await fetch(censusUrl, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!censusRes.ok) {
				return null;
			}

			// Check if response has content
			const text = await censusRes.text();
			if (!text || text.trim() === "") {
				return null;
			}

			// Parse JSON safely
			let censusData: unknown;
			try {
				censusData = JSON.parse(text);
			} catch (_e) {
				return null;
			}

			if (!Array.isArray(censusData) || censusData.length < 2) {
				return null;
			}

			// Census API returns [headers, data]
			const values = censusData[1];
			const population = Number.parseInt(values[0], 10) || 0;
			const medianIncome = Number.parseInt(values[1], 10) || 0;
			const medianAge = Number.parseFloat(values[2]) || 0;
			const bachelors = Number.parseInt(values[3], 10) || 0;
			const masters = Number.parseInt(values[4], 10) || 0;
			const professional = Number.parseInt(values[5], 10) || 0;
			const doctorate = Number.parseInt(values[6], 10) || 0;
			const totalEducation = Number.parseInt(values[7], 10) || 1;
			const medianHomeValue = Number.parseInt(values[8], 10) || 0;
			const povertyCount = Number.parseInt(values[9], 10) || 0;
			const povertyTotal = Number.parseInt(values[10], 10) || 1;
			const unemployed = Number.parseInt(values[11], 10) || 0;
			const laborForce = Number.parseInt(values[12], 10) || 1;

			const educationPercent =
				((bachelors + masters + professional + doctorate) / totalEducation) *
				100;
			const povertyRate = (povertyCount / povertyTotal) * 100;
			const unemploymentRate = (unemployed / laborForce) * 100;

			const demographics: Demographics = {
				population,
				medianHouseholdIncome: medianIncome,
				medianAge,
				educationBachelorsOrHigher: Math.round(educationPercent * 10) / 10,
				medianHomeValue,
				povertyRate: Math.round(povertyRate * 10) / 10,
				unemploymentRate: Math.round(unemploymentRate * 10) / 10,
				dataSource: "census",
				enrichedAt: new Date().toISOString(),
			};

			this.cache.set(cacheKey, { data: demographics, timestamp: Date.now() });

			return demographics;
		} catch (_error) {
			return null;
		}
	}
}

export const demographicsService = new DemographicsService();
