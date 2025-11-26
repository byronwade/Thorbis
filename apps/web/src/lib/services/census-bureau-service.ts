/**
 * Census Bureau American Community Survey (ACS) Service
 *
 * Free government API providing demographics, income, housing, and
 * socioeconomic data at various geographic levels.
 *
 * @see https://www.census.gov/data/developers/data-sets/acs-5year.html
 * @see https://api.census.gov/data.html
 *
 * No API key required for basic usage, but recommended for higher rate limits.
 * Request key at: https://api.census.gov/data/key_signup.html
 */

const CENSUS_BASE_URL = "https://api.census.gov/data";
const GEOCODER_URL = "https://geocoding.geo.census.gov/geocoder";

// ACS 5-Year Estimates (most reliable, smallest margins of error)
const ACS_DATASET = "2022/acs/acs5"; // Update annually

export interface DemographicData {
	totalPopulation: number;
	medianAge: number;
	medianHouseholdIncome: number;
	perCapitaIncome: number;
	povertyRate: number;
	unemploymentRate: number;
	educationBachelorOrHigher: number;
	ownerOccupiedHousing: number;
	renterOccupiedHousing: number;
	vacancyRate: number;
	medianHomeValue: number;
	medianRent: number;
	averageHouseholdSize: number;
}

export interface HousingData {
	totalHousingUnits: number;
	occupiedUnits: number;
	vacantUnits: number;
	ownerOccupied: number;
	renterOccupied: number;
	medianValue: number;
	medianRent: number;
	medianYearBuilt: number;
	housesBuiltBefore1950: number;
	housesBuiltAfter2000: number;
	singleFamilyDetached: number;
	multiFamily: number;
	mobileHomes: number;
	heatingFuelGas: number;
	heatingFuelElectric: number;
	heatingFuelOil: number;
	heatingFuelOther: number;
	noAC: number;
	centralAC: number;
}

export interface IncomeData {
	medianHouseholdIncome: number;
	meanHouseholdIncome: number;
	perCapitaIncome: number;
	householdsUnder25k: number;
	households25kTo50k: number;
	households50kTo75k: number;
	households75kTo100k: number;
	households100kTo150k: number;
	householdsOver150k: number;
	giniIndex?: number;
}

export interface GeographyInfo {
	state: string;
	stateCode: string;
	county: string;
	countyCode: string;
	tract?: string;
	blockGroup?: string;
	place?: string;
	zipCode?: string;
}

export interface MarketAnalysis {
	geography: GeographyInfo;
	demographics: DemographicData;
	housing: HousingData;
	income: IncomeData;
	serviceMarketScore: number;
	marketInsights: string[];
}

export interface ServiceAreaProfile {
	zipCode: string;
	population: number;
	households: number;
	medianIncome: number;
	ownerOccupiedRate: number;
	medianHomeValue: number;
	medianHomeAge: number;
	hvacMarketPotential: "high" | "medium" | "low";
	plumbingMarketPotential: "high" | "medium" | "low";
	electricalMarketPotential: "high" | "medium" | "low";
}

class CensusBureauService {
	private apiKey?: string;
	private baseUrl = CENSUS_BASE_URL;

	constructor() {
		this.apiKey = process.env.CENSUS_API_KEY;
	}

	/**
	 * Get comprehensive demographic data for a location
	 */
	async getDemographics(
		lat: number,
		lng: number,
	): Promise<DemographicData | null> {
		const geo = await this.getGeographyFromCoordinates(lat, lng);
		if (!geo) return null;

		const variables = [
			"B01003_001E", // Total population
			"B01002_001E", // Median age
			"B19013_001E", // Median household income
			"B19301_001E", // Per capita income
			"B17001_002E", // Population below poverty
			"B17001_001E", // Population for poverty status
			"B23025_005E", // Unemployed
			"B23025_003E", // Labor force
			"B15003_022E", // Bachelor's degree
			"B15003_023E", // Master's degree
			"B15003_024E", // Professional degree
			"B15003_025E", // Doctorate
			"B15003_001E", // Population 25+ (for education calc)
			"B25003_002E", // Owner occupied
			"B25003_003E", // Renter occupied
			"B25002_001E", // Total housing units
			"B25002_003E", // Vacant units
			"B25077_001E", // Median home value
			"B25064_001E", // Median rent
			"B25010_001E", // Average household size
		];

		const data = await this.fetchTractData(
			geo.stateCode,
			geo.countyCode,
			geo.tract!,
			variables,
		);
		if (!data) return null;

		const totalPop = this.parseNum(data["B01003_001E"]);
		const povertyPop = this.parseNum(data["B17001_002E"]);
		const povertyUniverse = this.parseNum(data["B17001_001E"]);
		const unemployed = this.parseNum(data["B23025_005E"]);
		const laborForce = this.parseNum(data["B23025_003E"]);
		const bachelors = this.parseNum(data["B15003_022E"]);
		const masters = this.parseNum(data["B15003_023E"]);
		const professional = this.parseNum(data["B15003_024E"]);
		const doctorate = this.parseNum(data["B15003_025E"]);
		const pop25Plus = this.parseNum(data["B15003_001E"]);
		const ownerOcc = this.parseNum(data["B25003_002E"]);
		const renterOcc = this.parseNum(data["B25003_003E"]);
		const totalUnits = this.parseNum(data["B25002_001E"]);
		const vacantUnits = this.parseNum(data["B25002_003E"]);

		return {
			totalPopulation: totalPop,
			medianAge: this.parseNum(data["B01002_001E"]),
			medianHouseholdIncome: this.parseNum(data["B19013_001E"]),
			perCapitaIncome: this.parseNum(data["B19301_001E"]),
			povertyRate:
				povertyUniverse > 0 ? (povertyPop / povertyUniverse) * 100 : 0,
			unemploymentRate: laborForce > 0 ? (unemployed / laborForce) * 100 : 0,
			educationBachelorOrHigher:
				pop25Plus > 0
					? ((bachelors + masters + professional + doctorate) / pop25Plus) * 100
					: 0,
			ownerOccupiedHousing: ownerOcc,
			renterOccupiedHousing: renterOcc,
			vacancyRate: totalUnits > 0 ? (vacantUnits / totalUnits) * 100 : 0,
			medianHomeValue: this.parseNum(data["B25077_001E"]),
			medianRent: this.parseNum(data["B25064_001E"]),
			averageHouseholdSize: this.parseNum(data["B25010_001E"]),
		};
	}

	/**
	 * Get detailed housing characteristics
	 */
	async getHousingData(lat: number, lng: number): Promise<HousingData | null> {
		const geo = await this.getGeographyFromCoordinates(lat, lng);
		if (!geo) return null;

		const variables = [
			"B25002_001E", // Total units
			"B25002_002E", // Occupied
			"B25002_003E", // Vacant
			"B25003_002E", // Owner occupied
			"B25003_003E", // Renter occupied
			"B25077_001E", // Median value
			"B25064_001E", // Median rent
			"B25035_001E", // Median year built
			"B25034_010E", // Built 1940-1949
			"B25034_011E", // Built 1939 or earlier
			"B25034_002E", // Built 2020 or later
			"B25034_003E", // Built 2010-2019
			"B25034_004E", // Built 2000-2009
			"B25024_002E", // Single family detached
			"B25024_003E", // Single family attached
			"B25024_004E", // 2 units
			"B25024_005E", // 3-4 units
			"B25024_006E", // 5-9 units
			"B25024_007E", // 10-19 units
			"B25024_008E", // 20-49 units
			"B25024_009E", // 50+ units
			"B25024_010E", // Mobile homes
			"B25040_002E", // Heating: utility gas
			"B25040_003E", // Heating: bottled gas
			"B25040_004E", // Heating: electricity
			"B25040_005E", // Heating: fuel oil
			"B25040_006E", // Heating: coal/coke
			"B25040_007E", // Heating: wood
			"B25040_008E", // Heating: solar
			"B25040_009E", // Heating: other
			"B25040_010E", // No fuel used
		];

		const data = await this.fetchTractData(
			geo.stateCode,
			geo.countyCode,
			geo.tract!,
			variables,
		);
		if (!data) return null;

		const pre1950 =
			this.parseNum(data["B25034_010E"]) + this.parseNum(data["B25034_011E"]);
		const post2000 =
			this.parseNum(data["B25034_002E"]) +
			this.parseNum(data["B25034_003E"]) +
			this.parseNum(data["B25034_004E"]);

		const multiFamily =
			this.parseNum(data["B25024_003E"]) +
			this.parseNum(data["B25024_004E"]) +
			this.parseNum(data["B25024_005E"]) +
			this.parseNum(data["B25024_006E"]) +
			this.parseNum(data["B25024_007E"]) +
			this.parseNum(data["B25024_008E"]) +
			this.parseNum(data["B25024_009E"]);

		const gasHeating =
			this.parseNum(data["B25040_002E"]) + this.parseNum(data["B25040_003E"]);
		const otherHeating =
			this.parseNum(data["B25040_006E"]) +
			this.parseNum(data["B25040_007E"]) +
			this.parseNum(data["B25040_008E"]) +
			this.parseNum(data["B25040_009E"]) +
			this.parseNum(data["B25040_010E"]);

		return {
			totalHousingUnits: this.parseNum(data["B25002_001E"]),
			occupiedUnits: this.parseNum(data["B25002_002E"]),
			vacantUnits: this.parseNum(data["B25002_003E"]),
			ownerOccupied: this.parseNum(data["B25003_002E"]),
			renterOccupied: this.parseNum(data["B25003_003E"]),
			medianValue: this.parseNum(data["B25077_001E"]),
			medianRent: this.parseNum(data["B25064_001E"]),
			medianYearBuilt: this.parseNum(data["B25035_001E"]),
			housesBuiltBefore1950: pre1950,
			housesBuiltAfter2000: post2000,
			singleFamilyDetached: this.parseNum(data["B25024_002E"]),
			multiFamily,
			mobileHomes: this.parseNum(data["B25024_010E"]),
			heatingFuelGas: gasHeating,
			heatingFuelElectric: this.parseNum(data["B25040_004E"]),
			heatingFuelOil: this.parseNum(data["B25040_005E"]),
			heatingFuelOther: otherHeating,
			noAC: 0, // ACS doesn't track AC directly
			centralAC: 0,
		};
	}

	/**
	 * Get income distribution data
	 */
	async getIncomeData(lat: number, lng: number): Promise<IncomeData | null> {
		const geo = await this.getGeographyFromCoordinates(lat, lng);
		if (!geo) return null;

		const variables = [
			"B19013_001E", // Median household income
			"B19025_001E", // Mean household income (aggregate)
			"B19301_001E", // Per capita income
			"B19001_002E", // Less than $10,000
			"B19001_003E", // $10,000-$14,999
			"B19001_004E", // $15,000-$19,999
			"B19001_005E", // $20,000-$24,999
			"B19001_006E", // $25,000-$29,999
			"B19001_007E", // $30,000-$34,999
			"B19001_008E", // $35,000-$39,999
			"B19001_009E", // $40,000-$44,999
			"B19001_010E", // $45,000-$49,999
			"B19001_011E", // $50,000-$59,999
			"B19001_012E", // $60,000-$74,999
			"B19001_013E", // $75,000-$99,999
			"B19001_014E", // $100,000-$124,999
			"B19001_015E", // $125,000-$149,999
			"B19001_016E", // $150,000-$199,999
			"B19001_017E", // $200,000+
			"B19083_001E", // Gini index
		];

		const data = await this.fetchTractData(
			geo.stateCode,
			geo.countyCode,
			geo.tract!,
			variables,
		);
		if (!data) return null;

		const under25k =
			this.parseNum(data["B19001_002E"]) +
			this.parseNum(data["B19001_003E"]) +
			this.parseNum(data["B19001_004E"]) +
			this.parseNum(data["B19001_005E"]);

		const income25to50 =
			this.parseNum(data["B19001_006E"]) +
			this.parseNum(data["B19001_007E"]) +
			this.parseNum(data["B19001_008E"]) +
			this.parseNum(data["B19001_009E"]) +
			this.parseNum(data["B19001_010E"]);

		const income50to75 =
			this.parseNum(data["B19001_011E"]) + this.parseNum(data["B19001_012E"]);

		const income75to100 = this.parseNum(data["B19001_013E"]);

		const income100to150 =
			this.parseNum(data["B19001_014E"]) + this.parseNum(data["B19001_015E"]);

		const over150 =
			this.parseNum(data["B19001_016E"]) + this.parseNum(data["B19001_017E"]);

		return {
			medianHouseholdIncome: this.parseNum(data["B19013_001E"]),
			meanHouseholdIncome: this.parseNum(data["B19025_001E"]),
			perCapitaIncome: this.parseNum(data["B19301_001E"]),
			householdsUnder25k: under25k,
			households25kTo50k: income25to50,
			households50kTo75k: income50to75,
			households75kTo100k: income75to100,
			households100kTo150k: income100to150,
			householdsOver150k: over150,
			giniIndex: this.parseNum(data["B19083_001E"]),
		};
	}

	/**
	 * Get geography codes from coordinates
	 */
	async getGeographyFromCoordinates(
		lat: number,
		lng: number,
	): Promise<GeographyInfo | null> {
		try {
			const url = new URL(`${GEOCODER_URL}/geographies/coordinates`);
			url.searchParams.set("x", lng.toString());
			url.searchParams.set("y", lat.toString());
			url.searchParams.set("benchmark", "Public_AR_Current");
			url.searchParams.set("vintage", "Census2020_Current");
			url.searchParams.set("layers", "all");
			url.searchParams.set("format", "json");

			const response = await fetch(url.toString());
			if (!response.ok) throw new Error(`Geocoder error: ${response.status}`);

			const data = await response.json();
			const geographies = data.result?.geographies;

			if (!geographies) return null;

			const state = geographies["States"]?.[0];
			const county = geographies["Counties"]?.[0];
			const tract = geographies["Census Tracts"]?.[0];
			const blockGroup = geographies["Census Block Groups"]?.[0];
			const place =
				geographies["Incorporated Places"]?.[0] ||
				geographies["Census Designated Places"]?.[0];

			return {
				state: state?.NAME || "",
				stateCode: state?.STATE || "",
				county: county?.NAME || "",
				countyCode: county?.COUNTY || "",
				tract: tract?.TRACT,
				blockGroup: blockGroup?.BLKGRP,
				place: place?.NAME,
			};
		} catch (error) {
			console.error("Error getting geography:", error);
			return null;
		}
	}

	/**
	 * Geocode address to coordinates
	 */
	async geocodeAddress(
		address: string,
	): Promise<{ lat: number; lng: number; geography: GeographyInfo } | null> {
		try {
			const url = new URL(`${GEOCODER_URL}/locations/onelineaddress`);
			url.searchParams.set("address", address);
			url.searchParams.set("benchmark", "Public_AR_Current");
			url.searchParams.set("format", "json");

			const response = await fetch(url.toString());
			if (!response.ok) throw new Error(`Geocoder error: ${response.status}`);

			const data = await response.json();
			const match = data.result?.addressMatches?.[0];

			if (!match) return null;

			const lat = match.coordinates.y;
			const lng = match.coordinates.x;
			const geography = await this.getGeographyFromCoordinates(lat, lng);

			if (!geography) return null;

			return { lat, lng, geography };
		} catch (error) {
			console.error("Geocoding error:", error);
			return null;
		}
	}

	/**
	 * Fetch data for census tract
	 */
	private async fetchTractData(
		stateCode: string,
		countyCode: string,
		tract: string,
		variables: string[],
	): Promise<Record<string, string> | null> {
		try {
			const url = new URL(`${this.baseUrl}/${ACS_DATASET}`);
			url.searchParams.set("get", variables.join(","));
			url.searchParams.set("for", `tract:${tract}`);
			url.searchParams.set("in", `state:${stateCode}%20county:${countyCode}`);

			if (this.apiKey) {
				url.searchParams.set("key", this.apiKey);
			}

			const response = await fetch(url.toString());
			if (!response.ok) throw new Error(`Census API error: ${response.status}`);

			const data = await response.json();

			if (!data || data.length < 2) return null;

			// First row is headers, second row is data
			const headers = data[0] as string[];
			const values = data[1] as string[];

			const result: Record<string, string> = {};
			headers.forEach((header, i) => {
				result[header] = values[i];
			});

			return result;
		} catch (error) {
			console.error("Error fetching tract data:", error);
			return null;
		}
	}

	/**
	 * Parse numeric value from Census data
	 */
	private parseNum(value: string | undefined): number {
		if (!value || value === "null" || value === "-666666666") return 0;
		const parsed = parseFloat(value);
		return isNaN(parsed) ? 0 : parsed;
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Analyze service area market potential
	 * Helps field service companies identify high-value markets
	 */
	async analyzeServiceMarket(address: string): Promise<MarketAnalysis | null> {
		const location = await this.geocodeAddress(address);
		if (!location) return null;

		const [demographics, housing, income] = await Promise.all([
			this.getDemographics(location.lat, location.lng),
			this.getHousingData(location.lat, location.lng),
			this.getIncomeData(location.lat, location.lng),
		]);

		if (!demographics || !housing || !income) return null;

		const score = this.calculateServiceMarketScore(
			demographics,
			housing,
			income,
		);
		const insights = this.generateMarketInsights(demographics, housing, income);

		return {
			geography: location.geography,
			demographics,
			housing,
			income,
			serviceMarketScore: score,
			marketInsights: insights,
		};
	}

	/**
	 * Calculate service market score (0-100)
	 * Higher score = better market for field services
	 */
	private calculateServiceMarketScore(
		demographics: DemographicData,
		housing: HousingData,
		income: IncomeData,
	): number {
		let score = 0;

		// Income factor (higher income = more service spending) - 30 points max
		if (income.medianHouseholdIncome > 100000) score += 30;
		else if (income.medianHouseholdIncome > 75000) score += 25;
		else if (income.medianHouseholdIncome > 50000) score += 15;
		else if (income.medianHouseholdIncome > 35000) score += 5;

		// Home ownership (owners invest more in maintenance) - 25 points max
		const ownerRate =
			demographics.ownerOccupiedHousing /
			(demographics.ownerOccupiedHousing + demographics.renterOccupiedHousing);
		score += Math.min(25, ownerRate * 30);

		// Home value (higher value = more service investment) - 20 points max
		if (housing.medianValue > 500000) score += 20;
		else if (housing.medianValue > 300000) score += 15;
		else if (housing.medianValue > 200000) score += 10;
		else if (housing.medianValue > 100000) score += 5;

		// Housing age (older homes need more service) - 15 points max
		const totalUnits = housing.totalHousingUnits || 1;
		const oldHomeRate = housing.housesBuiltBefore1950 / totalUnits;
		score += Math.min(15, oldHomeRate * 20);

		// Population density (more customers per mile) - 10 points max
		if (demographics.totalPopulation > 5000) score += 10;
		else if (demographics.totalPopulation > 2000) score += 7;
		else if (demographics.totalPopulation > 1000) score += 4;

		return Math.min(100, Math.round(score));
	}

	/**
	 * Generate market insights from data
	 */
	private generateMarketInsights(
		demographics: DemographicData,
		housing: HousingData,
		income: IncomeData,
	): string[] {
		const insights: string[] = [];

		// Income insights
		if (income.medianHouseholdIncome > 100000) {
			insights.push(
				"High-income area with strong purchasing power for premium services",
			);
		} else if (income.medianHouseholdIncome < 40000) {
			insights.push(
				"Budget-conscious market - consider financing options and value packages",
			);
		}

		// Home ownership insights
		const ownerRate =
			(demographics.ownerOccupiedHousing /
				(demographics.ownerOccupiedHousing +
					demographics.renterOccupiedHousing)) *
			100;
		if (ownerRate > 70) {
			insights.push(
				"High homeownership rate indicates strong maintenance service demand",
			);
		} else if (ownerRate < 40) {
			insights.push(
				"High renter population - consider property management partnerships",
			);
		}

		// Housing age insights
		const totalUnits = housing.totalHousingUnits || 1;
		const oldHomeRate = (housing.housesBuiltBefore1950 / totalUnits) * 100;
		if (oldHomeRate > 30) {
			insights.push(
				"Many older homes likely need system upgrades and replacements",
			);
		}

		const newHomeRate = (housing.housesBuiltAfter2000 / totalUnits) * 100;
		if (newHomeRate > 40) {
			insights.push(
				"Newer construction - focus on maintenance agreements and warranty work",
			);
		}

		// Heating fuel insights (for HVAC)
		if (housing.heatingFuelGas > housing.heatingFuelElectric) {
			insights.push(
				"Gas heating prevalent - ensure gas certification for technicians",
			);
		} else if (housing.heatingFuelElectric > housing.heatingFuelGas) {
			insights.push("Electric heating dominant - heat pump expertise valuable");
		}
		if (housing.heatingFuelOil > totalUnits * 0.1) {
			insights.push(
				"Significant oil heating market - oil-to-gas/heat pump conversions opportunity",
			);
		}

		return insights;
	}

	/**
	 * Get service area profile for zip code analysis
	 */
	async getServiceAreaProfile(
		zipCode: string,
	): Promise<ServiceAreaProfile | null> {
		try {
			// Get ZCTA (Zip Code Tabulation Area) data
			const variables = [
				"B01003_001E", // Population
				"B25002_002E", // Occupied units (households)
				"B19013_001E", // Median income
				"B25003_002E", // Owner occupied
				"B25003_003E", // Renter occupied
				"B25077_001E", // Median home value
				"B25035_001E", // Median year built
				"B25034_010E", // Built 1940-49
				"B25034_011E", // Built pre-1940
			];

			const url = new URL(`${this.baseUrl}/${ACS_DATASET}`);
			url.searchParams.set("get", variables.join(","));
			url.searchParams.set("for", `zip code tabulation area:${zipCode}`);

			if (this.apiKey) {
				url.searchParams.set("key", this.apiKey);
			}

			const response = await fetch(url.toString());
			if (!response.ok) return null;

			const data = await response.json();
			if (!data || data.length < 2) return null;

			const headers = data[0] as string[];
			const values = data[1] as string[];
			const result: Record<string, string> = {};
			headers.forEach((h, i) => (result[h] = values[i]));

			const population = this.parseNum(result["B01003_001E"]);
			const households = this.parseNum(result["B25002_002E"]);
			const medianIncome = this.parseNum(result["B19013_001E"]);
			const ownerOcc = this.parseNum(result["B25003_002E"]);
			const renterOcc = this.parseNum(result["B25003_003E"]);
			const medianValue = this.parseNum(result["B25077_001E"]);
			const medianYear = this.parseNum(result["B25035_001E"]);
			const homeAge = 2024 - medianYear;

			// Calculate market potentials
			const hvacPotential = this.calculateHVACPotential(
				medianIncome,
				medianValue,
				homeAge,
			);
			const plumbingPotential = this.calculatePlumbingPotential(
				medianIncome,
				homeAge,
				ownerOcc / (ownerOcc + renterOcc),
			);
			const electricalPotential = this.calculateElectricalPotential(
				medianIncome,
				medianValue,
				homeAge,
			);

			return {
				zipCode,
				population,
				households,
				medianIncome,
				ownerOccupiedRate: ownerOcc / (ownerOcc + renterOcc),
				medianHomeValue: medianValue,
				medianHomeAge: homeAge,
				hvacMarketPotential: hvacPotential,
				plumbingMarketPotential: plumbingPotential,
				electricalMarketPotential: electricalPotential,
			};
		} catch (error) {
			console.error("Error getting ZIP profile:", error);
			return null;
		}
	}

	private calculateHVACPotential(
		income: number,
		homeValue: number,
		homeAge: number,
	): "high" | "medium" | "low" {
		let score = 0;
		if (income > 75000) score += 2;
		else if (income > 50000) score += 1;
		if (homeValue > 300000) score += 2;
		else if (homeValue > 150000) score += 1;
		if (homeAge > 25) score += 2;
		else if (homeAge > 15) score += 1;

		if (score >= 5) return "high";
		if (score >= 3) return "medium";
		return "low";
	}

	private calculatePlumbingPotential(
		income: number,
		homeAge: number,
		ownerRate: number,
	): "high" | "medium" | "low" {
		let score = 0;
		if (income > 60000) score += 2;
		else if (income > 40000) score += 1;
		if (homeAge > 40) score += 2;
		else if (homeAge > 25) score += 1;
		if (ownerRate > 0.6) score += 2;
		else if (ownerRate > 0.4) score += 1;

		if (score >= 5) return "high";
		if (score >= 3) return "medium";
		return "low";
	}

	private calculateElectricalPotential(
		income: number,
		homeValue: number,
		homeAge: number,
	): "high" | "medium" | "low" {
		let score = 0;
		if (income > 80000) score += 2;
		else if (income > 55000) score += 1;
		if (homeValue > 350000) score += 2;
		else if (homeValue > 200000) score += 1;
		if (homeAge > 30) score += 2;
		else if (homeAge > 20) score += 1;

		if (score >= 5) return "high";
		if (score >= 3) return "medium";
		return "low";
	}

	/**
	 * Get customer income estimate for pricing decisions
	 */
	async getCustomerIncomeEstimate(address: string): Promise<{
		medianAreaIncome: number;
		incomeLevel: "high" | "middle" | "low";
		pricingSuggestion: string;
	} | null> {
		const location = await this.geocodeAddress(address);
		if (!location) return null;

		const income = await this.getIncomeData(location.lat, location.lng);
		if (!income) return null;

		let level: "high" | "middle" | "low";
		let suggestion: string;

		if (income.medianHouseholdIncome > 100000) {
			level = "high";
			suggestion =
				"Premium pricing appropriate. Emphasize quality, warranties, and convenience.";
		} else if (income.medianHouseholdIncome > 50000) {
			level = "middle";
			suggestion =
				"Standard pricing. Offer good-better-best options and financing.";
		} else {
			level = "low";
			suggestion =
				"Value-focused pricing. Emphasize financing options and payment plans.";
		}

		return {
			medianAreaIncome: income.medianHouseholdIncome,
			incomeLevel: level,
			pricingSuggestion: suggestion,
		};
	}

	/**
	 * Analyze multiple zip codes for service area expansion
	 */
	async analyzeExpansionOpportunities(
		zipCodes: string[],
	): Promise<ServiceAreaProfile[]> {
		const profiles = await Promise.all(
			zipCodes.map((zip) => this.getServiceAreaProfile(zip)),
		);

		return profiles
			.filter((p): p is ServiceAreaProfile => p !== null)
			.sort((a, b) => {
				// Sort by combined market potential
				const scoreA =
					this.getPotentialScore(a.hvacMarketPotential) +
					this.getPotentialScore(a.plumbingMarketPotential);
				const scoreB =
					this.getPotentialScore(b.hvacMarketPotential) +
					this.getPotentialScore(b.plumbingMarketPotential);
				return scoreB - scoreA;
			});
	}

	private getPotentialScore(potential: "high" | "medium" | "low"): number {
		switch (potential) {
			case "high":
				return 3;
			case "medium":
				return 2;
			case "low":
				return 1;
		}
	}
}

// Export singleton instance
export const censusBureauService = new CensusBureauService();
