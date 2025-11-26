/**
 * ATTOM Property Data API Service
 *
 * Comprehensive property data for 158M+ properties in the US.
 *
 * Features:
 * - Property details and characteristics
 * - Automated Valuation Models (AVM)
 * - Owner information
 * - Sales history
 * - Tax assessment data
 * - Mortgage information
 * - Property comparables
 *
 * @see https://api.developer.attomdata.com/
 */

// Types
export interface PropertyAddress {
	line1?: string;
	line2?: string;
	city?: string;
	state?: string;
	zip?: string;
	zip4?: string;
	fips?: string;
	county?: string;
	country?: string;
	latitude?: number;
	longitude?: number;
}

export interface PropertyIdentifier {
	attomId?: number;
	apn?: string;
	fips?: string;
	address?: PropertyAddress;
}

export interface PropertyBasicInfo {
	identifier: PropertyIdentifier;
	address: PropertyAddress;
	lot?: {
		lotSize1?: number;
		lotSize2?: number;
		lotNum?: string;
		frontage?: number;
		depth?: number;
	};
	area?: {
		universalSize?: number;
		livingSize?: number;
		groundFloorSize?: number;
		grossSize?: number;
		adjustedGrossSize?: number;
	};
	summary?: {
		propertyType?: string;
		yearBuilt?: number;
		bedrooms?: number;
		bathrooms?: number;
		bathFull?: number;
		bathHalf?: number;
		stories?: number;
		rooms?: number;
		units?: number;
		propertyClass?: string;
	};
}

export interface PropertyDetail extends PropertyBasicInfo {
	building?: {
		construction?: {
			foundationType?: string;
			frameType?: string;
			roofCover?: string;
			roofType?: string;
			wallType?: string;
			condition?: string;
			quality?: string;
		};
		interior?: {
			floors?: string;
			fireplaces?: number;
			bsmtSize?: number;
			bsmtFinished?: number;
			bsmtType?: string;
		};
		parking?: {
			garageSize?: number;
			garageType?: string;
			prkgSpaces?: number;
			carport?: boolean;
		};
		utilities?: {
			coolingType?: string;
			heatingType?: string;
			heatingFuel?: string;
			waterSource?: string;
			sewerType?: string;
		};
		amenities?: {
			pool?: boolean;
			poolType?: string;
			spa?: boolean;
			deck?: boolean;
			patio?: boolean;
			fence?: boolean;
		};
	};
}

export interface PropertyOwner {
	owner1?: {
		firstName?: string;
		lastName?: string;
		fullName?: string;
		type?: string;
	};
	owner2?: {
		firstName?: string;
		lastName?: string;
		fullName?: string;
	};
	ownershipType?: string;
	absenteeOwner?: boolean;
	mailingAddress?: PropertyAddress;
}

export interface PropertyValuation {
	value?: {
		low?: number;
		high?: number;
		mid?: number;
	};
	confidence?: number;
	forecastStandardDeviation?: number;
	pricePerSqFt?: number;
	lastUpdateDate?: string;
	valuationDate?: string;
}

export interface PropertySale {
	saleDate?: string;
	salePrice?: number;
	pricePerSqFt?: number;
	documentType?: string;
	documentNumber?: string;
	buyerNames?: string[];
	sellerNames?: string[];
	financingType?: string;
	loanAmount?: number;
	lenderName?: string;
}

export interface PropertyTax {
	year?: number;
	taxAmount?: number;
	assessedValue?: number;
	landValue?: number;
	improvementValue?: number;
	marketValue?: number;
	exemption?: string;
	taxCodeArea?: string;
}

export interface PropertyMortgage {
	amount?: number;
	lenderName?: string;
	interestRate?: number;
	loanType?: string;
	term?: number;
	dueDate?: string;
	recordingDate?: string;
	documentNumber?: string;
}

export interface PropertyComparable {
	property: PropertyBasicInfo;
	distance?: number;
	salePrice?: number;
	saleDate?: string;
	similarity?: number;
}

export interface PropertySearchResult {
	properties: PropertyBasicInfo[];
	totalCount: number;
	page: number;
	pageSize: number;
}

export interface ExpandedProfileResponse {
	property: PropertyDetail[];
}

export interface AVMResponse {
	property: (PropertyBasicInfo & { avm: PropertyValuation })[];
}

export interface SalesHistoryResponse {
	property: (PropertyBasicInfo & { saleHistory: PropertySale[] })[];
}

export interface AssessmentResponse {
	property: (PropertyBasicInfo & { assessment: PropertyTax })[];
}

export interface OwnerResponse {
	property: (PropertyBasicInfo & { owner: PropertyOwner })[];
}

// Service implementation
class ATTOMPropertyService {
	private readonly baseUrl =
		"https://api.gateway.attomdata.com/propertyapi/v1.0.0";
	private readonly apiKey = process.env.ATTOM_API_KEY;

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!this.apiKey;
	}

	private async request<T>(
		endpoint: string,
		params?: Record<string, string | number>,
	): Promise<T | null> {
		try {
			const url = new URL(`${this.baseUrl}${endpoint}`);
			if (params) {
				Object.entries(params).forEach(([key, value]) => {
					if (value !== undefined && value !== null) {
						url.searchParams.set(key, String(value));
					}
				});
			}

			const response = await fetch(url.toString(), {
				headers: {
					apikey: this.apiKey!,
					Accept: "application/json",
				},
			});

			if (!response.ok) {
				console.error(
					"ATTOM API error:",
					response.status,
					await response.text(),
				);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("ATTOM API error:", error);
			return null;
		}
	}

	// ============================================
	// Property Lookup
	// ============================================

	/**
	 * Get property by address
	 */
	async getPropertyByAddress(
		address1: string,
		address2: string,
	): Promise<PropertyBasicInfo | null> {
		const result = await this.request<{ property: PropertyBasicInfo[] }>(
			"/property/basicprofile",
			{
				address1,
				address2,
			},
		);

		return result?.property?.[0] || null;
	}

	/**
	 * Get property by ATTOM ID
	 */
	async getPropertyById(attomId: number): Promise<PropertyBasicInfo | null> {
		const result = await this.request<{ property: PropertyBasicInfo[] }>(
			"/property/basicprofile",
			{
				attomid: attomId,
			},
		);

		return result?.property?.[0] || null;
	}

	/**
	 * Get property by APN (Assessor Parcel Number)
	 */
	async getPropertyByAPN(
		apn: string,
		fips: string,
	): Promise<PropertyBasicInfo | null> {
		const result = await this.request<{ property: PropertyBasicInfo[] }>(
			"/property/basicprofile",
			{
				apn,
				fips,
			},
		);

		return result?.property?.[0] || null;
	}

	// ============================================
	// Detailed Property Information
	// ============================================

	/**
	 * Get expanded property profile
	 */
	async getExpandedProfile(
		address1: string,
		address2: string,
	): Promise<PropertyDetail | null> {
		const result = await this.request<ExpandedProfileResponse>(
			"/property/expandedprofile",
			{
				address1,
				address2,
			},
		);

		return result?.property?.[0] || null;
	}

	/**
	 * Get property details with all available info
	 */
	async getPropertyDetails(
		address1: string,
		address2: string,
	): Promise<PropertyDetail | null> {
		const result = await this.request<{ property: PropertyDetail[] }>(
			"/property/detail",
			{
				address1,
				address2,
			},
		);

		return result?.property?.[0] || null;
	}

	// ============================================
	// Valuation
	// ============================================

	/**
	 * Get automated valuation (AVM)
	 */
	async getValuation(
		address1: string,
		address2: string,
	): Promise<PropertyValuation | null> {
		const result = await this.request<AVMResponse>("/valuation/homevalue", {
			address1,
			address2,
		});

		return result?.property?.[0]?.avm || null;
	}

	/**
	 * Get AVM detail with confidence
	 */
	async getAVMDetail(
		address1: string,
		address2: string,
	): Promise<{
		property: PropertyBasicInfo;
		valuation: PropertyValuation;
	} | null> {
		const result = await this.request<AVMResponse>("/avm/detail", {
			address1,
			address2,
		});

		const prop = result?.property?.[0];
		if (!prop) return null;

		return {
			property: prop,
			valuation: prop.avm,
		};
	}

	// ============================================
	// Sales History
	// ============================================

	/**
	 * Get sales history for property
	 */
	async getSalesHistory(
		address1: string,
		address2: string,
	): Promise<PropertySale[] | null> {
		const result = await this.request<SalesHistoryResponse>(
			"/saleshistory/detail",
			{
				address1,
				address2,
			},
		);

		return result?.property?.[0]?.saleHistory || null;
	}

	/**
	 * Get last sale information
	 */
	async getLastSale(
		address1: string,
		address2: string,
	): Promise<PropertySale | null> {
		const history = await this.getSalesHistory(address1, address2);
		return history?.[0] || null;
	}

	// ============================================
	// Tax Assessment
	// ============================================

	/**
	 * Get tax assessment
	 */
	async getTaxAssessment(
		address1: string,
		address2: string,
	): Promise<PropertyTax | null> {
		const result = await this.request<AssessmentResponse>(
			"/assessment/detail",
			{
				address1,
				address2,
			},
		);

		return result?.property?.[0]?.assessment || null;
	}

	/**
	 * Get assessment history
	 */
	async getAssessmentHistory(
		address1: string,
		address2: string,
	): Promise<PropertyTax[] | null> {
		const result = await this.request<{
			property: { assessmentHistory: PropertyTax[] }[];
		}>("/assessment/history", {
			address1,
			address2,
		});

		return result?.property?.[0]?.assessmentHistory || null;
	}

	// ============================================
	// Owner Information
	// ============================================

	/**
	 * Get owner information
	 */
	async getOwner(
		address1: string,
		address2: string,
	): Promise<PropertyOwner | null> {
		const result = await this.request<OwnerResponse>("/property/owner", {
			address1,
			address2,
		});

		return result?.property?.[0]?.owner || null;
	}

	// ============================================
	// Mortgage Information
	// ============================================

	/**
	 * Get current mortgage
	 */
	async getMortgage(
		address1: string,
		address2: string,
	): Promise<PropertyMortgage | null> {
		const result = await this.request<{
			property: { mortgage: PropertyMortgage }[];
		}>("/mortgage/detail", {
			address1,
			address2,
		});

		return result?.property?.[0]?.mortgage || null;
	}

	// ============================================
	// Property Search
	// ============================================

	/**
	 * Search properties by geography
	 */
	async searchByArea(options: {
		geoid?: string;
		geoType?: "ZI" | "CS" | "ST" | "CO";
		radius?: number;
		latitude?: number;
		longitude?: number;
		page?: number;
		pageSize?: number;
		propertyType?: string;
		minBeds?: number;
		maxBeds?: number;
		minBaths?: number;
		maxBaths?: number;
		minSqFt?: number;
		maxSqFt?: number;
		minYearBuilt?: number;
		maxYearBuilt?: number;
	}): Promise<PropertySearchResult | null> {
		const params: Record<string, string | number> = {};
		if (options.geoid) params.geoid = options.geoid;
		if (options.geoType) params.geoType = options.geoType;
		if (options.radius) params.radius = options.radius;
		if (options.latitude) params.latitude = options.latitude;
		if (options.longitude) params.longitude = options.longitude;
		if (options.page) params.page = options.page;
		if (options.pageSize) params.pageSize = options.pageSize;
		if (options.propertyType) params.propertyType = options.propertyType;
		if (options.minBeds) params.minBeds = options.minBeds;
		if (options.maxBeds) params.maxBeds = options.maxBeds;
		if (options.minBaths) params.minBaths = options.minBaths;
		if (options.maxBaths) params.maxBaths = options.maxBaths;
		if (options.minSqFt) params.minSqFt = options.minSqFt;
		if (options.maxSqFt) params.maxSqFt = options.maxSqFt;
		if (options.minYearBuilt) params.minYearBuilt = options.minYearBuilt;
		if (options.maxYearBuilt) params.maxYearBuilt = options.maxYearBuilt;

		const result = await this.request<{
			property: PropertyBasicInfo[];
			status: { total: number; page: number; pagesize: number };
		}>("/property/snapshot", params);

		if (!result) return null;

		return {
			properties: result.property || [],
			totalCount: result.status?.total || 0,
			page: result.status?.page || 1,
			pageSize: result.status?.pagesize || 25,
		};
	}

	/**
	 * Search properties by radius
	 */
	async searchByRadius(
		latitude: number,
		longitude: number,
		radiusMiles: number,
		options?: {
			page?: number;
			pageSize?: number;
		},
	): Promise<PropertySearchResult | null> {
		return this.searchByArea({
			latitude,
			longitude,
			radius: radiusMiles,
			page: options?.page,
			pageSize: options?.pageSize,
		});
	}

	// ============================================
	// Comparables
	// ============================================

	/**
	 * Get comparable properties
	 */
	async getComparables(
		address1: string,
		address2: string,
		options?: {
			searchType?: "Radius" | "Polygon";
			radius?: number;
			maxComps?: number;
		},
	): Promise<PropertyComparable[] | null> {
		const params: Record<string, string | number> = {
			address1,
			address2,
		};

		if (options?.searchType) params.searchType = options.searchType;
		if (options?.radius) params.radius = options.radius;
		if (options?.maxComps) params.maxComps = options.maxComps;

		const result = await this.request<{
			property: { comps: PropertyComparable[] }[];
		}>("/sale/comparables", params);

		return result?.property?.[0]?.comps || null;
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Get comprehensive property report for service call
	 */
	async getServiceCallPropertyReport(
		address1: string,
		address2: string,
	): Promise<{
		basic: PropertyBasicInfo | null;
		details: PropertyDetail | null;
		owner: PropertyOwner | null;
		valuation: PropertyValuation | null;
		lastSale: PropertySale | null;
		tax: PropertyTax | null;
	}> {
		// Execute all requests in parallel for speed
		const [basic, details, owner, valuation, lastSale, tax] = await Promise.all(
			[
				this.getPropertyByAddress(address1, address2),
				this.getExpandedProfile(address1, address2),
				this.getOwner(address1, address2),
				this.getValuation(address1, address2),
				this.getLastSale(address1, address2),
				this.getTaxAssessment(address1, address2),
			],
		);

		return { basic, details, owner, valuation, lastSale, tax };
	}

	/**
	 * Get equipment-relevant property info (HVAC sizing, etc.)
	 */
	async getEquipmentRelevantInfo(
		address1: string,
		address2: string,
	): Promise<{
		squareFootage: number | null;
		yearBuilt: number | null;
		stories: number | null;
		coolingType: string | null;
		heatingType: string | null;
		heatingFuel: string | null;
		basementSize: number | null;
		garageSize: number | null;
	} | null> {
		const details = await this.getExpandedProfile(address1, address2);
		if (!details) return null;

		return {
			squareFootage:
				details.area?.livingSize || details.area?.universalSize || null,
			yearBuilt: details.summary?.yearBuilt || null,
			stories: details.summary?.stories || null,
			coolingType: details.building?.utilities?.coolingType || null,
			heatingType: details.building?.utilities?.heatingType || null,
			heatingFuel: details.building?.utilities?.heatingFuel || null,
			basementSize: details.building?.interior?.bsmtSize || null,
			garageSize: details.building?.parking?.garageSize || null,
		};
	}

	/**
	 * Get property age and condition for maintenance recommendations
	 */
	async getMaintenanceRelevantInfo(
		address1: string,
		address2: string,
	): Promise<{
		yearBuilt: number | null;
		propertyAge: number | null;
		condition: string | null;
		roofType: string | null;
		foundationType: string | null;
		waterSource: string | null;
		sewerType: string | null;
	} | null> {
		const details = await this.getExpandedProfile(address1, address2);
		if (!details) return null;

		const yearBuilt = details.summary?.yearBuilt;
		const propertyAge = yearBuilt ? new Date().getFullYear() - yearBuilt : null;

		return {
			yearBuilt: yearBuilt || null,
			propertyAge,
			condition: details.building?.construction?.condition || null,
			roofType: details.building?.construction?.roofType || null,
			foundationType: details.building?.construction?.foundationType || null,
			waterSource: details.building?.utilities?.waterSource || null,
			sewerType: details.building?.utilities?.sewerType || null,
		};
	}

	/**
	 * Verify owner information for service authorization
	 */
	async verifyPropertyOwner(
		address1: string,
		address2: string,
		ownerName: string,
	): Promise<{
		verified: boolean;
		ownerOnRecord: string | null;
		isAbsentee: boolean;
	}> {
		const owner = await this.getOwner(address1, address2);

		if (!owner) {
			return { verified: false, ownerOnRecord: null, isAbsentee: false };
		}

		const ownerOnRecord =
			owner.owner1?.fullName ||
			`${owner.owner1?.firstName} ${owner.owner1?.lastName}`;
		const normalizedInput = ownerName.toLowerCase().replace(/\s+/g, " ").trim();
		const normalizedRecord =
			ownerOnRecord?.toLowerCase().replace(/\s+/g, " ").trim() || "";

		// Simple name matching (could be enhanced with fuzzy matching)
		const verified =
			normalizedRecord.includes(normalizedInput) ||
			normalizedInput.includes(normalizedRecord);

		return {
			verified,
			ownerOnRecord,
			isAbsentee: owner.absenteeOwner || false,
		};
	}

	/**
	 * Get neighborhood property values for pricing context
	 */
	async getNeighborhoodContext(
		latitude: number,
		longitude: number,
	): Promise<{
		averageValue: number;
		medianValue: number;
		propertyCount: number;
		priceRange: { low: number; high: number };
	} | null> {
		// Search properties within 0.5 mile radius
		const result = await this.searchByRadius(latitude, longitude, 0.5, {
			pageSize: 50,
		});

		if (!result || result.properties.length === 0) return null;

		// This would need AVM data for each property - simplified for demonstration
		// In production, you'd batch request valuations
		return {
			averageValue: 0, // Would calculate from AVM data
			medianValue: 0,
			propertyCount: result.totalCount,
			priceRange: { low: 0, high: 0 },
		};
	}
}

// Export singleton instance
export const attomPropertyService = new ATTOMPropertyService();
