/**
 * FEMA Flood Map Service
 *
 * Free government API providing flood zone risk data for US properties.
 * Uses the National Flood Hazard Layer (NFHL) and Risk MAP data.
 *
 * @see https://www.fema.gov/flood-maps/tools-resources/flood-map-products/national-flood-hazard-layer
 * @see https://hazards.fema.gov/gis/nfhl/rest/services
 *
 * No API key required - completely free public data
 */

// FEMA NFHL REST Service base URLs
const NFHL_BASE_URL = "https://hazards.fema.gov/gis/nfhl/rest/services";
const FEMA_API_BASE =
	"https://hazards.fema.gov/femaportal/wps/portal/NFHLWMSkmz498";

// Flood zone risk levels
export type FloodZoneCategory =
	| "A" // High risk - 1% annual chance
	| "AE" // High risk with BFE
	| "AH" // High risk shallow flooding
	| "AO" // High risk sheet flow
	| "AR" // High risk restoration
	| "A99" // High risk levee
	| "V" // Coastal high risk
	| "VE" // Coastal high risk with BFE
	| "X" // Moderate to low risk
	| "D" // Undetermined
	| "OPEN WATER";

export interface FloodZoneInfo {
	zoneCode: FloodZoneCategory | string;
	zoneName: string;
	riskLevel: "high" | "moderate" | "low" | "undetermined";
	description: string;
	insuranceRequired: boolean;
	baseFloodElevation?: number;
	staticBFE?: number;
}

export interface FloodMapPanel {
	panelNumber: string;
	suffix: string;
	effectiveDate: string;
	communityName: string;
	countyName: string;
	stateName: string;
}

export interface CommunityInfo {
	communityId: string;
	communityName: string;
	countyName: string;
	stateName: string;
	participatingNFIP: boolean;
	crsClass?: number;
	crsDiscount?: number;
}

export interface FloodRiskReport {
	address: string;
	coordinates: { lat: number; lng: number };
	floodZone: FloodZoneInfo;
	mapPanel?: FloodMapPanel;
	community?: CommunityInfo;
	nearbyWaterFeatures?: WaterFeature[];
	historicalFlooding?: FloodEvent[];
	riskAssessment: RiskAssessment;
}

export interface WaterFeature {
	name: string;
	type: "river" | "stream" | "lake" | "ocean" | "canal" | "other";
	distanceFeet: number;
}

export interface FloodEvent {
	date: string;
	type: string;
	severity: string;
	damageEstimate?: number;
}

export interface RiskAssessment {
	overallRisk: "high" | "moderate" | "low" | "undetermined";
	annualFloodProbability: string;
	insuranceRecommendation: string;
	mitigationSuggestions: string[];
}

export interface PropertyFloodData {
	address: string;
	lat: number;
	lng: number;
	floodZone: string;
	riskLevel: string;
	insuranceRequired: boolean;
	baseFloodElevation?: number;
	communityParticipatesNFIP: boolean;
	panelNumber?: string;
	effectiveDate?: string;
}

class FEMAFloodService {
	private readonly nfhlBaseUrl = NFHL_BASE_URL;

	/**
	 * Get flood zone information for coordinates
	 */
	async getFloodZoneByCoordinates(
		lat: number,
		lng: number,
	): Promise<FloodZoneInfo | null> {
		try {
			// Query NFHL Flood Hazard Zones layer
			const url = new URL(`${this.nfhlBaseUrl}/public/NFHL/MapServer/28/query`);
			url.searchParams.set("geometry", `${lng},${lat}`);
			url.searchParams.set("geometryType", "esriGeometryPoint");
			url.searchParams.set("inSR", "4326");
			url.searchParams.set("spatialRel", "esriSpatialRelIntersects");
			url.searchParams.set("outFields", "*");
			url.searchParams.set("returnGeometry", "false");
			url.searchParams.set("f", "json");

			const response = await fetch(url.toString());
			if (!response.ok) {
				throw new Error(`FEMA API error: ${response.status}`);
			}

			const data = await response.json();

			if (!data.features || data.features.length === 0) {
				return null;
			}

			const feature = data.features[0].attributes;
			const zoneCode = feature.FLD_ZONE || feature.ZONE_SUBTY || "X";

			return this.parseFloodZone(zoneCode, feature.STATIC_BFE);
		} catch (error) {
			console.error("Error fetching flood zone:", error);
			throw error;
		}
	}

	/**
	 * Get flood zone by address using geocoding
	 */
	async getFloodZoneByAddress(address: string): Promise<FloodZoneInfo | null> {
		// Use Census geocoder (free)
		const coords = await this.geocodeAddress(address);
		if (!coords) {
			return null;
		}
		return this.getFloodZoneByCoordinates(coords.lat, coords.lng);
	}

	/**
	 * Get flood map panel information
	 */
	async getFloodMapPanel(
		lat: number,
		lng: number,
	): Promise<FloodMapPanel | null> {
		try {
			// Query FIRM Panels layer
			const url = new URL(`${this.nfhlBaseUrl}/public/NFHL/MapServer/3/query`);
			url.searchParams.set("geometry", `${lng},${lat}`);
			url.searchParams.set("geometryType", "esriGeometryPoint");
			url.searchParams.set("inSR", "4326");
			url.searchParams.set("spatialRel", "esriSpatialRelIntersects");
			url.searchParams.set(
				"outFields",
				"FIRM_PAN,PANEL,SUFFIX,EFF_DATE,PCOMM,CO_NAME,ST_NAME",
			);
			url.searchParams.set("returnGeometry", "false");
			url.searchParams.set("f", "json");

			const response = await fetch(url.toString());
			if (!response.ok) {
				throw new Error(`FEMA API error: ${response.status}`);
			}

			const data = await response.json();

			if (!data.features || data.features.length === 0) {
				return null;
			}

			const attrs = data.features[0].attributes;
			return {
				panelNumber: attrs.FIRM_PAN || attrs.PANEL,
				suffix: attrs.SUFFIX || "",
				effectiveDate: this.formatDate(attrs.EFF_DATE),
				communityName: attrs.PCOMM || "",
				countyName: attrs.CO_NAME || "",
				stateName: attrs.ST_NAME || "",
			};
		} catch (error) {
			console.error("Error fetching flood map panel:", error);
			throw error;
		}
	}

	/**
	 * Get community NFIP participation status
	 */
	async getCommunityInfo(
		lat: number,
		lng: number,
	): Promise<CommunityInfo | null> {
		try {
			// Query Political Areas layer for community info
			const url = new URL(`${this.nfhlBaseUrl}/public/NFHL/MapServer/14/query`);
			url.searchParams.set("geometry", `${lng},${lat}`);
			url.searchParams.set("geometryType", "esriGeometryPoint");
			url.searchParams.set("inSR", "4326");
			url.searchParams.set("spatialRel", "esriSpatialRelIntersects");
			url.searchParams.set(
				"outFields",
				"COMM_NO,COMM_NAME,CID,CO_NAME,ST_NAME",
			);
			url.searchParams.set("returnGeometry", "false");
			url.searchParams.set("f", "json");

			const response = await fetch(url.toString());
			if (!response.ok) {
				throw new Error(`FEMA API error: ${response.status}`);
			}

			const data = await response.json();

			if (!data.features || data.features.length === 0) {
				return null;
			}

			const attrs = data.features[0].attributes;
			return {
				communityId: attrs.CID || attrs.COMM_NO,
				communityName: attrs.COMM_NAME || "",
				countyName: attrs.CO_NAME || "",
				stateName: attrs.ST_NAME || "",
				participatingNFIP: true, // If in NFHL, community participates
			};
		} catch (error) {
			console.error("Error fetching community info:", error);
			throw error;
		}
	}

	/**
	 * Get base flood elevation for a location
	 */
	async getBaseFloodElevation(
		lat: number,
		lng: number,
	): Promise<number | null> {
		try {
			// Query BFE Lines layer
			const url = new URL(`${this.nfhlBaseUrl}/public/NFHL/MapServer/20/query`);
			url.searchParams.set("geometry", `${lng},${lat}`);
			url.searchParams.set("geometryType", "esriGeometryPoint");
			url.searchParams.set("inSR", "4326");
			url.searchParams.set("spatialRel", "esriSpatialRelIntersects");
			url.searchParams.set("distance", "100"); // Search within 100 units
			url.searchParams.set("units", "esriFeet");
			url.searchParams.set("outFields", "ELEV,BFE_LN_TYP");
			url.searchParams.set("returnGeometry", "false");
			url.searchParams.set("f", "json");

			const response = await fetch(url.toString());
			if (!response.ok) {
				throw new Error(`FEMA API error: ${response.status}`);
			}

			const data = await response.json();

			if (!data.features || data.features.length === 0) {
				return null;
			}

			return data.features[0].attributes.ELEV || null;
		} catch (error) {
			console.error("Error fetching BFE:", error);
			return null;
		}
	}

	/**
	 * Get comprehensive flood risk report for a property
	 */
	async getFloodRiskReport(address: string): Promise<FloodRiskReport | null> {
		const coords = await this.geocodeAddress(address);
		if (!coords) {
			return null;
		}

		const [floodZone, mapPanel, community, bfe] = await Promise.all([
			this.getFloodZoneByCoordinates(coords.lat, coords.lng),
			this.getFloodMapPanel(coords.lat, coords.lng),
			this.getCommunityInfo(coords.lat, coords.lng),
			this.getBaseFloodElevation(coords.lat, coords.lng),
		]);

		if (!floodZone) {
			return null;
		}

		// Add BFE if found
		if (bfe !== null) {
			floodZone.baseFloodElevation = bfe;
		}

		return {
			address,
			coordinates: coords,
			floodZone,
			mapPanel: mapPanel || undefined,
			community: community || undefined,
			riskAssessment: this.generateRiskAssessment(floodZone),
		};
	}

	/**
	 * Parse flood zone code into detailed info
	 */
	private parseFloodZone(zoneCode: string, staticBFE?: number): FloodZoneInfo {
		const zoneDescriptions: Record<
			string,
			{
				name: string;
				desc: string;
				risk: FloodZoneInfo["riskLevel"];
				insurance: boolean;
			}
		> = {
			A: {
				name: "Zone A - High Risk",
				desc: "Areas with 1% annual chance of flooding and 26% chance over 30-year mortgage",
				risk: "high",
				insurance: true,
			},
			AE: {
				name: "Zone AE - High Risk (BFE Determined)",
				desc: "High risk area with base flood elevations determined",
				risk: "high",
				insurance: true,
			},
			AH: {
				name: "Zone AH - High Risk Shallow Flooding",
				desc: "Areas with 1% annual chance of shallow flooding (1-3 feet)",
				risk: "high",
				insurance: true,
			},
			AO: {
				name: "Zone AO - High Risk Sheet Flow",
				desc: "Areas with 1% annual chance of shallow flooding with sheet flow",
				risk: "high",
				insurance: true,
			},
			AR: {
				name: "Zone AR - High Risk Restoration",
				desc: "Areas where flood protection system is being restored",
				risk: "high",
				insurance: true,
			},
			A99: {
				name: "Zone A99 - High Risk (Federal Levee)",
				desc: "Areas with 1% annual chance protected by federal levee system under construction",
				risk: "high",
				insurance: true,
			},
			V: {
				name: "Zone V - Coastal High Risk",
				desc: "Coastal areas with 1% annual chance of flooding and additional wave action hazard",
				risk: "high",
				insurance: true,
			},
			VE: {
				name: "Zone VE - Coastal High Risk (BFE Determined)",
				desc: "Coastal high risk area with base flood elevations determined",
				risk: "high",
				insurance: true,
			},
			X: {
				name: "Zone X - Moderate to Low Risk",
				desc: "Areas of moderate or minimal flood risk, outside 1% annual chance floodplain",
				risk: "low",
				insurance: false,
			},
			D: {
				name: "Zone D - Undetermined",
				desc: "Areas where flood hazard has not been determined",
				risk: "undetermined",
				insurance: false,
			},
			"OPEN WATER": {
				name: "Open Water",
				desc: "Lake, river, or other body of water",
				risk: "high",
				insurance: false,
			},
		};

		// Handle zone variations (AE, A1-A30, etc.)
		let baseZone = zoneCode;
		if (zoneCode.match(/^A\d+$/)) {
			baseZone = "AE"; // A1-A30 are equivalent to AE
		} else if (zoneCode.match(/^V\d+$/)) {
			baseZone = "VE"; // V1-V30 are equivalent to VE
		} else if (
			zoneCode.startsWith("X") ||
			zoneCode === "B" ||
			zoneCode === "C"
		) {
			baseZone = "X"; // B, C, X are all moderate-to-low risk
		}

		const info = zoneDescriptions[baseZone] || {
			name: `Zone ${zoneCode}`,
			desc: "Flood zone information",
			risk: "undetermined" as const,
			insurance: false,
		};

		return {
			zoneCode: zoneCode as FloodZoneCategory,
			zoneName: info.name,
			riskLevel: info.risk,
			description: info.desc,
			insuranceRequired: info.insurance,
			staticBFE: staticBFE,
		};
	}

	/**
	 * Generate risk assessment based on flood zone
	 */
	private generateRiskAssessment(floodZone: FloodZoneInfo): RiskAssessment {
		const mitigations: Record<string, string[]> = {
			high: [
				"Elevate HVAC equipment above base flood elevation",
				"Install flood vents in foundation",
				"Use flood-resistant building materials below BFE",
				"Secure fuel tanks and water heaters",
				"Install backflow valves on sewer lines",
				"Consider flood barriers or shields for openings",
			],
			moderate: [
				"Consider elevating critical equipment",
				"Ensure proper drainage around foundation",
				"Keep valuable items above potential flood level",
				"Consider flood insurance despite not being required",
			],
			low: [
				"Maintain proper drainage",
				"Be aware that low risk doesn't mean no risk",
				"Consider flood insurance for peace of mind",
			],
			undetermined: [
				"Conduct detailed flood study",
				"Consult local floodplain administrator",
				"Consider flood insurance regardless of determination",
			],
		};

		const probabilities: Record<string, string> = {
			high: "1% annual chance (1 in 100 year flood), 26% chance over 30-year mortgage",
			moderate: "0.2% to 1% annual chance (100 to 500 year flood)",
			low: "Less than 0.2% annual chance (greater than 500 year flood)",
			undetermined: "Unknown - flood study not completed",
		};

		const recommendations: Record<string, string> = {
			high: "Flood insurance is REQUIRED if you have a federally-backed mortgage. Standard homeowners insurance does NOT cover flood damage.",
			moderate:
				"Flood insurance is recommended. Properties in moderate risk zones account for over 20% of flood claims.",
			low: "Flood insurance is optional but recommended. About 25% of flood claims come from low-risk areas.",
			undetermined:
				"Strongly recommend flood insurance until flood risk can be determined.",
		};

		return {
			overallRisk: floodZone.riskLevel,
			annualFloodProbability: probabilities[floodZone.riskLevel],
			insuranceRecommendation: recommendations[floodZone.riskLevel],
			mitigationSuggestions: mitigations[floodZone.riskLevel],
		};
	}

	/**
	 * Geocode address using Census Bureau geocoder (free)
	 */
	private async geocodeAddress(
		address: string,
	): Promise<{ lat: number; lng: number } | null> {
		try {
			const url = new URL(
				"https://geocoding.geo.census.gov/geocoder/locations/onelineaddress",
			);
			url.searchParams.set("address", address);
			url.searchParams.set("benchmark", "Public_AR_Current");
			url.searchParams.set("format", "json");

			const response = await fetch(url.toString());
			if (!response.ok) {
				throw new Error(`Geocoding error: ${response.status}`);
			}

			const data = await response.json();
			const match = data.result?.addressMatches?.[0];

			if (!match) {
				return null;
			}

			return {
				lat: match.coordinates.y,
				lng: match.coordinates.x,
			};
		} catch (error) {
			console.error("Geocoding error:", error);
			return null;
		}
	}

	/**
	 * Format ESRI date timestamp
	 */
	private formatDate(timestamp: number | null): string {
		if (!timestamp) return "Unknown";
		return new Date(timestamp).toISOString().split("T")[0];
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Get flood risk data for a service call property
	 * Useful for determining equipment placement and insurance requirements
	 */
	async getPropertyFloodData(
		address: string,
	): Promise<PropertyFloodData | null> {
		const coords = await this.geocodeAddress(address);
		if (!coords) {
			return null;
		}

		const [floodZone, mapPanel, community] = await Promise.all([
			this.getFloodZoneByCoordinates(coords.lat, coords.lng),
			this.getFloodMapPanel(coords.lat, coords.lng),
			this.getCommunityInfo(coords.lat, coords.lng),
		]);

		if (!floodZone) {
			return null;
		}

		return {
			address,
			lat: coords.lat,
			lng: coords.lng,
			floodZone: floodZone.zoneCode,
			riskLevel: floodZone.riskLevel,
			insuranceRequired: floodZone.insuranceRequired,
			baseFloodElevation: floodZone.baseFloodElevation,
			communityParticipatesNFIP: community?.participatingNFIP ?? false,
			panelNumber: mapPanel?.panelNumber,
			effectiveDate: mapPanel?.effectiveDate,
		};
	}

	/**
	 * Check if HVAC equipment placement meets flood requirements
	 * Equipment in flood zones should be elevated above BFE
	 */
	async checkEquipmentPlacementCompliance(
		address: string,
		equipmentElevation: number, // feet above ground
	): Promise<{
		compliant: boolean;
		recommendation: string;
		floodZone: string;
		requiredElevation?: number;
	}> {
		const floodData = await this.getPropertyFloodData(address);

		if (!floodData) {
			return {
				compliant: true,
				recommendation:
					"Unable to determine flood zone. Standard placement should be acceptable.",
				floodZone: "Unknown",
			};
		}

		if (
			floodData.riskLevel === "low" ||
			floodData.riskLevel === "undetermined"
		) {
			return {
				compliant: true,
				recommendation:
					"Property is in low/moderate flood risk area. Standard equipment placement is acceptable.",
				floodZone: floodData.floodZone,
			};
		}

		// High risk zones
		const bfe = floodData.baseFloodElevation;
		if (bfe && equipmentElevation < bfe) {
			return {
				compliant: false,
				recommendation: `Equipment should be elevated to at least ${bfe} feet above ground level (Base Flood Elevation). Consider elevated equipment stands or rooftop installation.`,
				floodZone: floodData.floodZone,
				requiredElevation: bfe,
			};
		}

		return {
			compliant: true,
			recommendation: `Equipment placement meets flood zone requirements. Zone: ${floodData.floodZone}`,
			floodZone: floodData.floodZone,
			requiredElevation: bfe || undefined,
		};
	}

	/**
	 * Get flood risk considerations for job estimate
	 * Adds relevant notes about flood mitigation requirements
	 */
	async getEstimateFloodConsiderations(address: string): Promise<{
		hasFloodRisk: boolean;
		zone: string;
		considerations: string[];
		additionalCosts: { item: string; reason: string }[];
	}> {
		const floodData = await this.getPropertyFloodData(address);

		if (!floodData || floodData.riskLevel === "low") {
			return {
				hasFloodRisk: false,
				zone: floodData?.floodZone || "X",
				considerations: [],
				additionalCosts: [],
			};
		}

		const considerations: string[] = [];
		const additionalCosts: { item: string; reason: string }[] = [];

		if (floodData.riskLevel === "high") {
			considerations.push(
				`Property is in high-risk flood zone ${floodData.floodZone}`,
			);
			considerations.push("Equipment elevation may be required by local code");
			considerations.push(
				"Flood-resistant materials recommended for ground-level components",
			);

			additionalCosts.push({
				item: "Equipment elevation stand",
				reason: "Required to meet flood zone regulations",
			});
			additionalCosts.push({
				item: "Flood-resistant electrical connections",
				reason: "Prevents flood damage to system",
			});

			if (floodData.baseFloodElevation) {
				considerations.push(
					`Base Flood Elevation: ${floodData.baseFloodElevation} feet`,
				);
			}
		}

		return {
			hasFloodRisk: true,
			zone: floodData.floodZone,
			considerations,
			additionalCosts,
		};
	}

	/**
	 * Check if property qualifies for flood insurance discount
	 * Based on CRS (Community Rating System) participation
	 */
	async checkFloodInsuranceDiscount(address: string): Promise<{
		discountAvailable: boolean;
		discountPercent?: number;
		crsClass?: number;
		communityName?: string;
	}> {
		const coords = await this.geocodeAddress(address);
		if (!coords) {
			return { discountAvailable: false };
		}

		const community = await this.getCommunityInfo(coords.lat, coords.lng);

		if (!community || !community.crsClass) {
			return {
				discountAvailable: false,
				communityName: community?.communityName,
			};
		}

		// CRS class discounts (Class 1 = 45% discount, Class 10 = 0%)
		const crsDiscounts: Record<number, number> = {
			1: 45,
			2: 40,
			3: 35,
			4: 30,
			5: 25,
			6: 20,
			7: 15,
			8: 10,
			9: 5,
			10: 0,
		};

		const discount = crsDiscounts[community.crsClass] || 0;

		return {
			discountAvailable: discount > 0,
			discountPercent: discount,
			crsClass: community.crsClass,
			communityName: community.communityName,
		};
	}
}

// Export singleton instance
export const femaFloodService = new FEMAFloodService();
