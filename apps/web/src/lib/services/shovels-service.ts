/**
 * Shovels API Service
 *
 * Building permit data and contractor intelligence.
 *
 * Features:
 * - Building permit history
 * - Contractor information
 * - Permit timeline tracking
 * - Market activity analysis
 * - Contractor performance data
 *
 * @see https://docs.shovels.ai/
 */

// Types
export interface Permit {
	id: string;
	permit_number?: string;
	permit_type?: string;
	permit_type_description?: string;
	status?: string;
	status_description?: string;
	work_description?: string;
	issue_date?: string;
	final_date?: string;
	expiration_date?: string;
	valuation?: number;
	fee?: number;
	address?: PermitAddress;
	contractor?: PermitContractor;
	parcel?: PermitParcel;
	jurisdiction?: PermitJurisdiction;
	inspections?: PermitInspection[];
}

export interface PermitAddress {
	street?: string;
	city?: string;
	state?: string;
	zip?: string;
	county?: string;
	latitude?: number;
	longitude?: number;
}

export interface PermitContractor {
	id?: string;
	name?: string;
	license_number?: string;
	license_type?: string;
	phone?: string;
	email?: string;
	address?: PermitAddress;
}

export interface PermitParcel {
	apn?: string;
	owner_name?: string;
	owner_address?: PermitAddress;
	land_use?: string;
	zoning?: string;
	lot_size_sqft?: number;
	year_built?: number;
}

export interface PermitJurisdiction {
	name?: string;
	state?: string;
	county?: string;
	type?: string;
}

export interface PermitInspection {
	id?: string;
	type?: string;
	status?: string;
	scheduled_date?: string;
	completed_date?: string;
	result?: string;
	inspector?: string;
	notes?: string;
}

export interface Contractor {
	id: string;
	name: string;
	license_number?: string;
	license_type?: string;
	license_status?: string;
	license_expiration?: string;
	business_name?: string;
	phone?: string;
	email?: string;
	website?: string;
	address?: PermitAddress;
	specialties?: string[];
	metrics?: ContractorMetrics;
}

export interface ContractorMetrics {
	total_permits?: number;
	permits_last_year?: number;
	average_project_value?: number;
	average_completion_time_days?: number;
	inspection_pass_rate?: number;
	active_projects?: number;
	jurisdictions_worked?: number;
	years_active?: number;
	rating?: number;
}

export interface PermitSearchOptions {
	address?: string;
	latitude?: number;
	longitude?: number;
	radius_miles?: number;
	city?: string;
	state?: string;
	county?: string;
	zip?: string;
	permit_type?: string;
	status?: string;
	contractor_name?: string;
	contractor_license?: string;
	issue_date_start?: string;
	issue_date_end?: string;
	valuation_min?: number;
	valuation_max?: number;
	page?: number;
	page_size?: number;
	sort_by?: "issue_date" | "valuation" | "final_date";
	sort_order?: "asc" | "desc";
}

export interface ContractorSearchOptions {
	name?: string;
	license_number?: string;
	license_type?: string;
	city?: string;
	state?: string;
	specialty?: string;
	min_permits?: number;
	min_rating?: number;
	page?: number;
	page_size?: number;
}

export interface SearchResponse<T> {
	data: T[];
	total: number;
	page: number;
	page_size: number;
	has_more: boolean;
}

export interface PropertyPermitHistory {
	address: PermitAddress;
	parcel?: PermitParcel;
	permits: Permit[];
	total_permits: number;
	total_valuation: number;
	permit_types: Record<string, number>;
	contractors_used: { name: string; permit_count: number }[];
	last_permit_date?: string;
}

export interface MarketActivity {
	jurisdiction: string;
	period: string;
	total_permits: number;
	total_valuation: number;
	permit_types: Record<string, number>;
	average_valuation: number;
	top_contractors: { name: string; permit_count: number }[];
	month_over_month_change?: number;
	year_over_year_change?: number;
}

// Service implementation
class ShovelsService {
	private readonly baseUrl = "https://api.shovels.ai/v1";
	private readonly apiKey = process.env.SHOVELS_API_KEY;

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!this.apiKey;
	}

	private async request<T>(
		endpoint: string,
		params?: Record<string, string | number | boolean>,
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
					Authorization: `Bearer ${this.apiKey}`,
					Accept: "application/json",
				},
			});

			if (!response.ok) {
				console.error(
					"Shovels API error:",
					response.status,
					await response.text(),
				);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Shovels API error:", error);
			return null;
		}
	}

	// ============================================
	// Permit Operations
	// ============================================

	/**
	 * Search permits
	 */
	async searchPermits(
		options: PermitSearchOptions,
	): Promise<SearchResponse<Permit> | null> {
		const params: Record<string, string | number> = {};

		if (options.address) params.address = options.address;
		if (options.latitude) params.latitude = options.latitude;
		if (options.longitude) params.longitude = options.longitude;
		if (options.radius_miles) params.radius_miles = options.radius_miles;
		if (options.city) params.city = options.city;
		if (options.state) params.state = options.state;
		if (options.county) params.county = options.county;
		if (options.zip) params.zip = options.zip;
		if (options.permit_type) params.permit_type = options.permit_type;
		if (options.status) params.status = options.status;
		if (options.contractor_name)
			params.contractor_name = options.contractor_name;
		if (options.contractor_license)
			params.contractor_license = options.contractor_license;
		if (options.issue_date_start)
			params.issue_date_start = options.issue_date_start;
		if (options.issue_date_end) params.issue_date_end = options.issue_date_end;
		if (options.valuation_min) params.valuation_min = options.valuation_min;
		if (options.valuation_max) params.valuation_max = options.valuation_max;
		if (options.page) params.page = options.page;
		if (options.page_size) params.page_size = options.page_size;
		if (options.sort_by) params.sort_by = options.sort_by;
		if (options.sort_order) params.sort_order = options.sort_order;

		return this.request<SearchResponse<Permit>>("/permits/search", params);
	}

	/**
	 * Get permit by ID
	 */
	async getPermit(permitId: string): Promise<Permit | null> {
		return this.request<Permit>(`/permits/${permitId}`);
	}

	/**
	 * Get permits by address
	 */
	async getPermitsByAddress(address: string): Promise<Permit[] | null> {
		const result = await this.searchPermits({ address, page_size: 100 });
		return result?.data || null;
	}

	/**
	 * Get permits by location (radius search)
	 */
	async getPermitsByLocation(
		latitude: number,
		longitude: number,
		radiusMiles: number = 1,
		options?: Partial<PermitSearchOptions>,
	): Promise<SearchResponse<Permit> | null> {
		return this.searchPermits({
			latitude,
			longitude,
			radius_miles: radiusMiles,
			...options,
		});
	}

	/**
	 * Get permit history for a property
	 */
	async getPropertyPermitHistory(
		address: string,
	): Promise<PropertyPermitHistory | null> {
		const permits = await this.getPermitsByAddress(address);
		if (!permits || permits.length === 0) return null;

		const permitTypes: Record<string, number> = {};
		const contractorCounts: Record<string, number> = {};
		let totalValuation = 0;

		for (const permit of permits) {
			// Count permit types
			const type = permit.permit_type || "Unknown";
			permitTypes[type] = (permitTypes[type] || 0) + 1;

			// Count contractors
			if (permit.contractor?.name) {
				contractorCounts[permit.contractor.name] =
					(contractorCounts[permit.contractor.name] || 0) + 1;
			}

			// Sum valuation
			if (permit.valuation) {
				totalValuation += permit.valuation;
			}
		}

		// Sort contractors by permit count
		const contractorsUsed = Object.entries(contractorCounts)
			.map(([name, permit_count]) => ({ name, permit_count }))
			.sort((a, b) => b.permit_count - a.permit_count);

		// Find last permit date
		const sortedByDate = [...permits].sort((a, b) => {
			const dateA = a.issue_date ? new Date(a.issue_date).getTime() : 0;
			const dateB = b.issue_date ? new Date(b.issue_date).getTime() : 0;
			return dateB - dateA;
		});

		return {
			address: permits[0].address || {},
			parcel: permits[0].parcel,
			permits,
			total_permits: permits.length,
			total_valuation: totalValuation,
			permit_types: permitTypes,
			contractors_used: contractorsUsed,
			last_permit_date: sortedByDate[0]?.issue_date,
		};
	}

	// ============================================
	// Contractor Operations
	// ============================================

	/**
	 * Search contractors
	 */
	async searchContractors(
		options: ContractorSearchOptions,
	): Promise<SearchResponse<Contractor> | null> {
		const params: Record<string, string | number> = {};

		if (options.name) params.name = options.name;
		if (options.license_number) params.license_number = options.license_number;
		if (options.license_type) params.license_type = options.license_type;
		if (options.city) params.city = options.city;
		if (options.state) params.state = options.state;
		if (options.specialty) params.specialty = options.specialty;
		if (options.min_permits) params.min_permits = options.min_permits;
		if (options.min_rating) params.min_rating = options.min_rating;
		if (options.page) params.page = options.page;
		if (options.page_size) params.page_size = options.page_size;

		return this.request<SearchResponse<Contractor>>(
			"/contractors/search",
			params,
		);
	}

	/**
	 * Get contractor by ID
	 */
	async getContractor(contractorId: string): Promise<Contractor | null> {
		return this.request<Contractor>(`/contractors/${contractorId}`);
	}

	/**
	 * Get contractor by license number
	 */
	async getContractorByLicense(
		licenseNumber: string,
		state?: string,
	): Promise<Contractor | null> {
		const result = await this.searchContractors({
			license_number: licenseNumber,
			state,
			page_size: 1,
		});
		return result?.data?.[0] || null;
	}

	/**
	 * Get contractor's permit history
	 */
	async getContractorPermits(
		contractorName: string,
		options?: {
			state?: string;
			issue_date_start?: string;
			issue_date_end?: string;
			page?: number;
			page_size?: number;
		},
	): Promise<SearchResponse<Permit> | null> {
		return this.searchPermits({
			contractor_name: contractorName,
			...options,
		});
	}

	// ============================================
	// Market Analysis
	// ============================================

	/**
	 * Get market activity for an area
	 */
	async getMarketActivity(
		city: string,
		state: string,
		options?: {
			start_date?: string;
			end_date?: string;
			permit_type?: string;
		},
	): Promise<MarketActivity | null> {
		const endDate = options?.end_date || new Date().toISOString().split("T")[0];
		const startDate =
			options?.start_date ||
			new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
				.toISOString()
				.split("T")[0];

		const result = await this.searchPermits({
			city,
			state,
			issue_date_start: startDate,
			issue_date_end: endDate,
			permit_type: options?.permit_type,
			page_size: 1000,
		});

		if (!result || result.data.length === 0) return null;

		const permits = result.data;
		const permitTypes: Record<string, number> = {};
		const contractorCounts: Record<string, number> = {};
		let totalValuation = 0;

		for (const permit of permits) {
			const type = permit.permit_type || "Unknown";
			permitTypes[type] = (permitTypes[type] || 0) + 1;

			if (permit.contractor?.name) {
				contractorCounts[permit.contractor.name] =
					(contractorCounts[permit.contractor.name] || 0) + 1;
			}

			if (permit.valuation) {
				totalValuation += permit.valuation;
			}
		}

		const topContractors = Object.entries(contractorCounts)
			.map(([name, permit_count]) => ({ name, permit_count }))
			.sort((a, b) => b.permit_count - a.permit_count)
			.slice(0, 10);

		return {
			jurisdiction: `${city}, ${state}`,
			period: `${startDate} to ${endDate}`,
			total_permits: permits.length,
			total_valuation: totalValuation,
			permit_types: permitTypes,
			average_valuation:
				permits.length > 0 ? totalValuation / permits.length : 0,
			top_contractors: topContractors,
		};
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Get HVAC permit history for a property
	 */
	async getHVACPermitHistory(address: string): Promise<Permit[] | null> {
		const result = await this.searchPermits({
			address,
			permit_type: "HVAC",
			page_size: 50,
		});

		// Also search for mechanical permits which often include HVAC
		const mechanicalResult = await this.searchPermits({
			address,
			permit_type: "Mechanical",
			page_size: 50,
		});

		const allPermits = [
			...(result?.data || []),
			...(mechanicalResult?.data || []),
		];

		// Deduplicate by permit ID
		const uniquePermits = Array.from(
			new Map(allPermits.map((p) => [p.id, p])).values(),
		);

		return uniquePermits.length > 0 ? uniquePermits : null;
	}

	/**
	 * Get plumbing permit history for a property
	 */
	async getPlumbingPermitHistory(address: string): Promise<Permit[] | null> {
		const result = await this.searchPermits({
			address,
			permit_type: "Plumbing",
			page_size: 50,
		});
		return result?.data || null;
	}

	/**
	 * Get electrical permit history for a property
	 */
	async getElectricalPermitHistory(address: string): Promise<Permit[] | null> {
		const result = await this.searchPermits({
			address,
			permit_type: "Electrical",
			page_size: 50,
		});
		return result?.data || null;
	}

	/**
	 * Get recent renovation activity (indicates potential service needs)
	 */
	async getRecentRenovationActivity(
		address: string,
		months: number = 24,
	): Promise<{
		hasRecentActivity: boolean;
		permits: Permit[];
		renovationTypes: string[];
		totalInvestment: number;
	}> {
		const startDate = new Date();
		startDate.setMonth(startDate.getMonth() - months);

		const result = await this.searchPermits({
			address,
			issue_date_start: startDate.toISOString().split("T")[0],
			page_size: 100,
		});

		const permits = result?.data || [];
		const renovationTypes = [
			...new Set(permits.map((p) => p.permit_type).filter(Boolean) as string[]),
		];
		const totalInvestment = permits.reduce(
			(sum, p) => sum + (p.valuation || 0),
			0,
		);

		return {
			hasRecentActivity: permits.length > 0,
			permits,
			renovationTypes,
			totalInvestment,
		};
	}

	/**
	 * Find competitor contractors in area
	 */
	async findCompetitorContractors(
		city: string,
		state: string,
		specialty: string,
	): Promise<Contractor[] | null> {
		const result = await this.searchContractors({
			city,
			state,
			specialty,
			min_permits: 5, // Active contractors
			page_size: 50,
		});

		return result?.data || null;
	}

	/**
	 * Verify contractor license
	 */
	async verifyContractorLicense(
		licenseNumber: string,
		state: string,
	): Promise<{
		valid: boolean;
		contractor: Contractor | null;
		status: string;
		expiration: string | null;
	}> {
		const contractor = await this.getContractorByLicense(licenseNumber, state);

		if (!contractor) {
			return {
				valid: false,
				contractor: null,
				status: "Not Found",
				expiration: null,
			};
		}

		const isExpired = contractor.license_expiration
			? new Date(contractor.license_expiration) < new Date()
			: false;

		return {
			valid: contractor.license_status === "Active" && !isExpired,
			contractor,
			status: contractor.license_status || "Unknown",
			expiration: contractor.license_expiration || null,
		};
	}

	/**
	 * Get equipment installation timeline (for warranty/service records)
	 */
	async getEquipmentInstallationTimeline(address: string): Promise<{
		hvac: { lastInstall: string | null; age: number | null };
		plumbing: { lastInstall: string | null; age: number | null };
		electrical: { lastInstall: string | null; age: number | null };
		waterHeater: { lastInstall: string | null; age: number | null };
	}> {
		const [hvac, plumbing, electrical] = await Promise.all([
			this.getHVACPermitHistory(address),
			this.getPlumbingPermitHistory(address),
			this.getElectricalPermitHistory(address),
		]);

		const getLastInstallAndAge = (
			permits: Permit[] | null,
			keywords: string[],
		) => {
			if (!permits) return { lastInstall: null, age: null };

			const installPermits = permits.filter((p) =>
				keywords.some(
					(k) =>
						(p.work_description?.toLowerCase() || "").includes(k) ||
						(p.permit_type_description?.toLowerCase() || "").includes(k),
				),
			);

			if (installPermits.length === 0) return { lastInstall: null, age: null };

			const sorted = installPermits.sort((a, b) => {
				const dateA = a.issue_date ? new Date(a.issue_date).getTime() : 0;
				const dateB = b.issue_date ? new Date(b.issue_date).getTime() : 0;
				return dateB - dateA;
			});

			const lastInstall = sorted[0].issue_date || null;
			const age = lastInstall
				? Math.floor(
						(Date.now() - new Date(lastInstall).getTime()) /
							(365.25 * 24 * 60 * 60 * 1000),
					)
				: null;

			return { lastInstall, age };
		};

		return {
			hvac: getLastInstallAndAge(hvac, [
				"install",
				"replace",
				"new unit",
				"furnace",
				"air condition",
			]),
			plumbing: getLastInstallAndAge(plumbing, [
				"install",
				"replace",
				"new",
				"repipe",
			]),
			electrical: getLastInstallAndAge(electrical, [
				"install",
				"panel",
				"upgrade",
				"rewire",
			]),
			waterHeater: getLastInstallAndAge(plumbing, [
				"water heater",
				"hot water",
				"tankless",
			]),
		};
	}

	/**
	 * Get service opportunity leads (properties with aging equipment)
	 */
	async getServiceOpportunityLeads(
		city: string,
		state: string,
		options?: {
			minEquipmentAge?: number;
			permitType?: string;
			radiusMiles?: number;
			latitude?: number;
			longitude?: number;
		},
	): Promise<
		{
			address: string;
			lastPermitDate: string;
			equipmentAge: number;
			permitType: string;
			contractor: string | null;
		}[]
	> {
		const minAge = options?.minEquipmentAge || 10; // Default: equipment over 10 years old
		const cutoffDate = new Date();
		cutoffDate.setFullYear(cutoffDate.getFullYear() - minAge);

		const searchOptions: PermitSearchOptions = {
			city,
			state,
			permit_type: options?.permitType || "HVAC",
			issue_date_end: cutoffDate.toISOString().split("T")[0],
			page_size: 100,
			sort_by: "issue_date",
			sort_order: "asc",
		};

		if (options?.latitude && options?.longitude && options?.radiusMiles) {
			searchOptions.latitude = options.latitude;
			searchOptions.longitude = options.longitude;
			searchOptions.radius_miles = options.radiusMiles;
		}

		const result = await this.searchPermits(searchOptions);
		if (!result?.data) return [];

		return result.data.map((permit) => ({
			address: permit.address?.street
				? `${permit.address.street}, ${permit.address.city}, ${permit.address.state} ${permit.address.zip}`
				: "Unknown",
			lastPermitDate: permit.issue_date || "Unknown",
			equipmentAge: permit.issue_date
				? Math.floor(
						(Date.now() - new Date(permit.issue_date).getTime()) /
							(365.25 * 24 * 60 * 60 * 1000),
					)
				: 0,
			permitType: permit.permit_type || "Unknown",
			contractor: permit.contractor?.name || null,
		}));
	}
}

// Export singleton instance
export const shovelsService = new ShovelsService();
