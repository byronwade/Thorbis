/**
 * Google Sheets API Service
 *
 * Spreadsheet operations for data management.
 * Requires OAuth 2.0 for user-specific operations.
 *
 * Features:
 * - Read and write cell values
 * - Create and manage spreadsheets
 * - Format cells and ranges
 * - Batch operations
 * - Named ranges
 *
 * @see https://developers.google.com/sheets/api/reference/rest
 */

// Types
export interface Spreadsheet {
	spreadsheetId: string;
	properties: SpreadsheetProperties;
	sheets: Sheet[];
	spreadsheetUrl: string;
}

export interface SpreadsheetProperties {
	title: string;
	locale?: string;
	autoRecalc?: "ON_CHANGE" | "MINUTE" | "HOUR";
	timeZone?: string;
}

export interface Sheet {
	properties: SheetProperties;
	data?: GridData[];
}

export interface SheetProperties {
	sheetId: number;
	title: string;
	index: number;
	sheetType?: "GRID" | "OBJECT" | "DATA_SOURCE";
	gridProperties?: GridProperties;
}

export interface GridProperties {
	rowCount: number;
	columnCount: number;
	frozenRowCount?: number;
	frozenColumnCount?: number;
}

export interface GridData {
	startRow?: number;
	startColumn?: number;
	rowData: RowData[];
}

export interface RowData {
	values: CellData[];
}

export interface CellData {
	userEnteredValue?: ExtendedValue;
	effectiveValue?: ExtendedValue;
	formattedValue?: string;
	userEnteredFormat?: CellFormat;
}

export interface ExtendedValue {
	numberValue?: number;
	stringValue?: string;
	boolValue?: boolean;
	formulaValue?: string;
	errorValue?: { type: string; message: string };
}

export interface CellFormat {
	backgroundColor?: Color;
	textFormat?: TextFormat;
	horizontalAlignment?: "LEFT" | "CENTER" | "RIGHT";
	verticalAlignment?: "TOP" | "MIDDLE" | "BOTTOM";
	numberFormat?: { type: string; pattern?: string };
}

export interface Color {
	red?: number;
	green?: number;
	blue?: number;
	alpha?: number;
}

export interface TextFormat {
	foregroundColor?: Color;
	fontFamily?: string;
	fontSize?: number;
	bold?: boolean;
	italic?: boolean;
	strikethrough?: boolean;
	underline?: boolean;
}

export interface ValueRange {
	range: string;
	majorDimension?: "ROWS" | "COLUMNS";
	values: unknown[][];
}

export interface BatchGetResponse {
	spreadsheetId: string;
	valueRanges: ValueRange[];
}

export interface BatchUpdateResponse {
	spreadsheetId: string;
	totalUpdatedRows: number;
	totalUpdatedColumns: number;
	totalUpdatedCells: number;
	totalUpdatedSheets: number;
}

export interface AppendResponse {
	spreadsheetId: string;
	tableRange: string;
	updates: {
		spreadsheetId: string;
		updatedRange: string;
		updatedRows: number;
		updatedColumns: number;
		updatedCells: number;
	};
}

// Service implementation
class GoogleSheetsService {
	private readonly baseUrl = "https://sheets.googleapis.com/v4/spreadsheets";

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return true; // Requires OAuth at runtime
	}

	/**
	 * Create a new spreadsheet
	 */
	async createSpreadsheet(
		accessToken: string,
		title: string,
		sheetTitles?: string[],
	): Promise<Spreadsheet | null> {
		try {
			const body: Record<string, unknown> = {
				properties: { title },
			};

			if (sheetTitles && sheetTitles.length > 0) {
				body.sheets = sheetTitles.map((sheetTitle, index) => ({
					properties: { title: sheetTitle, index },
				}));
			}

			const response = await fetch(this.baseUrl, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				console.error("Sheets create error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Sheets create error:", error);
			return null;
		}
	}

	/**
	 * Get spreadsheet metadata
	 */
	async getSpreadsheet(
		accessToken: string,
		spreadsheetId: string,
		includeData = false,
	): Promise<Spreadsheet | null> {
		try {
			const params = new URLSearchParams();
			if (includeData) {
				params.set("includeGridData", "true");
			}

			const url = `${this.baseUrl}/${spreadsheetId}${params.toString() ? `?${params.toString()}` : ""}`;
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				console.error("Sheets get error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Sheets get error:", error);
			return null;
		}
	}

	/**
	 * Read values from a range
	 */
	async getValues(
		accessToken: string,
		spreadsheetId: string,
		range: string,
	): Promise<unknown[][] | null> {
		try {
			const response = await fetch(
				`${this.baseUrl}/${spreadsheetId}/values/${encodeURIComponent(range)}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Sheets get values error:", await response.text());
				return null;
			}

			const data = await response.json();
			return data.values || [];
		} catch (error) {
			console.error("Sheets get values error:", error);
			return null;
		}
	}

	/**
	 * Write values to a range
	 */
	async updateValues(
		accessToken: string,
		spreadsheetId: string,
		range: string,
		values: unknown[][],
		inputOption: "RAW" | "USER_ENTERED" = "USER_ENTERED",
	): Promise<{ updatedCells: number; updatedRange: string } | null> {
		try {
			const response = await fetch(
				`${this.baseUrl}/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=${inputOption}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ values }),
				},
			);

			if (!response.ok) {
				console.error("Sheets update error:", await response.text());
				return null;
			}

			const data = await response.json();
			return {
				updatedCells: data.updatedCells,
				updatedRange: data.updatedRange,
			};
		} catch (error) {
			console.error("Sheets update error:", error);
			return null;
		}
	}

	/**
	 * Append values to a sheet
	 */
	async appendValues(
		accessToken: string,
		spreadsheetId: string,
		range: string,
		values: unknown[][],
		inputOption: "RAW" | "USER_ENTERED" = "USER_ENTERED",
	): Promise<AppendResponse | null> {
		try {
			const response = await fetch(
				`${this.baseUrl}/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=${inputOption}&insertDataOption=INSERT_ROWS`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ values }),
				},
			);

			if (!response.ok) {
				console.error("Sheets append error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Sheets append error:", error);
			return null;
		}
	}

	/**
	 * Clear values from a range
	 */
	async clearValues(
		accessToken: string,
		spreadsheetId: string,
		range: string,
	): Promise<boolean> {
		try {
			const response = await fetch(
				`${this.baseUrl}/${spreadsheetId}/values/${encodeURIComponent(range)}:clear`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({}),
				},
			);

			return response.ok;
		} catch (error) {
			console.error("Sheets clear error:", error);
			return false;
		}
	}

	/**
	 * Batch get multiple ranges
	 */
	async batchGetValues(
		accessToken: string,
		spreadsheetId: string,
		ranges: string[],
	): Promise<BatchGetResponse | null> {
		try {
			const params = new URLSearchParams();
			ranges.forEach((range) => params.append("ranges", range));

			const response = await fetch(
				`${this.baseUrl}/${spreadsheetId}/values:batchGet?${params.toString()}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Sheets batch get error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Sheets batch get error:", error);
			return null;
		}
	}

	/**
	 * Batch update multiple ranges
	 */
	async batchUpdateValues(
		accessToken: string,
		spreadsheetId: string,
		data: { range: string; values: unknown[][] }[],
		inputOption: "RAW" | "USER_ENTERED" = "USER_ENTERED",
	): Promise<BatchUpdateResponse | null> {
		try {
			const response = await fetch(
				`${this.baseUrl}/${spreadsheetId}/values:batchUpdate`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						valueInputOption: inputOption,
						data,
					}),
				},
			);

			if (!response.ok) {
				console.error("Sheets batch update error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Sheets batch update error:", error);
			return null;
		}
	}

	/**
	 * Add a new sheet to spreadsheet
	 */
	async addSheet(
		accessToken: string,
		spreadsheetId: string,
		title: string,
	): Promise<Sheet | null> {
		try {
			const response = await fetch(
				`${this.baseUrl}/${spreadsheetId}:batchUpdate`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						requests: [
							{
								addSheet: {
									properties: { title },
								},
							},
						],
					}),
				},
			);

			if (!response.ok) {
				console.error("Sheets add sheet error:", await response.text());
				return null;
			}

			const data = await response.json();
			return data.replies?.[0]?.addSheet || null;
		} catch (error) {
			console.error("Sheets add sheet error:", error);
			return null;
		}
	}

	/**
	 * Delete a sheet
	 */
	async deleteSheet(
		accessToken: string,
		spreadsheetId: string,
		sheetId: number,
	): Promise<boolean> {
		try {
			const response = await fetch(
				`${this.baseUrl}/${spreadsheetId}:batchUpdate`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						requests: [
							{
								deleteSheet: { sheetId },
							},
						],
					}),
				},
			);

			return response.ok;
		} catch (error) {
			console.error("Sheets delete sheet error:", error);
			return false;
		}
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Create a job tracking spreadsheet
	 */
	async createJobTracker(
		accessToken: string,
		companyName: string,
	): Promise<Spreadsheet | null> {
		const spreadsheet = await this.createSpreadsheet(
			accessToken,
			`${companyName} - Job Tracker`,
			["Active Jobs", "Completed Jobs", "Inventory", "Technicians"],
		);

		if (!spreadsheet) return null;

		// Add headers to Active Jobs sheet
		await this.updateValues(
			accessToken,
			spreadsheet.spreadsheetId,
			"Active Jobs!A1:J1",
			[
				[
					"Job #",
					"Customer",
					"Address",
					"Service Type",
					"Technician",
					"Scheduled Date",
					"Status",
					"Estimate",
					"Notes",
					"Created",
				],
			],
		);

		// Add headers to Completed Jobs sheet
		await this.updateValues(
			accessToken,
			spreadsheet.spreadsheetId,
			"Completed Jobs!A1:K1",
			[
				[
					"Job #",
					"Customer",
					"Address",
					"Service Type",
					"Technician",
					"Completed Date",
					"Duration",
					"Parts Used",
					"Labor Hours",
					"Total",
					"Invoice #",
				],
			],
		);

		// Add headers to Inventory sheet
		await this.updateValues(
			accessToken,
			spreadsheet.spreadsheetId,
			"Inventory!A1:F1",
			[
				[
					"Part #",
					"Description",
					"Quantity",
					"Unit Cost",
					"Reorder Level",
					"Supplier",
				],
			],
		);

		// Add headers to Technicians sheet
		await this.updateValues(
			accessToken,
			spreadsheet.spreadsheetId,
			"Technicians!A1:F1",
			[["Name", "Phone", "Email", "Skills", "Active Jobs", "Status"]],
		);

		return spreadsheet;
	}

	/**
	 * Add a job to the tracker
	 */
	async addJobToTracker(
		accessToken: string,
		spreadsheetId: string,
		job: {
			jobNumber: string;
			customer: string;
			address: string;
			serviceType: string;
			technician: string;
			scheduledDate: string;
			status: string;
			estimate: number;
			notes?: string;
		},
	): Promise<boolean> {
		const result = await this.appendValues(
			accessToken,
			spreadsheetId,
			"Active Jobs!A:J",
			[
				[
					job.jobNumber,
					job.customer,
					job.address,
					job.serviceType,
					job.technician,
					job.scheduledDate,
					job.status,
					job.estimate,
					job.notes || "",
					new Date().toISOString(),
				],
			],
		);

		return result !== null;
	}

	/**
	 * Export jobs to spreadsheet format
	 */
	async exportJobsToSheet(
		accessToken: string,
		spreadsheetId: string,
		sheetName: string,
		jobs: Record<string, unknown>[],
	): Promise<boolean> {
		if (jobs.length === 0) return true;

		// Get headers from first job
		const headers = Object.keys(jobs[0]);
		const rows = jobs.map((job) => headers.map((header) => job[header] ?? ""));

		// Write headers and data
		const result = await this.updateValues(
			accessToken,
			spreadsheetId,
			`${sheetName}!A1`,
			[headers, ...rows],
		);

		return result !== null;
	}

	/**
	 * Generate daily report spreadsheet
	 */
	async generateDailyReport(
		accessToken: string,
		date: string,
		data: {
			completedJobs: number;
			revenue: number;
			newCustomers: number;
			technicianStats: { name: string; jobs: number; hours: number }[];
		},
	): Promise<Spreadsheet | null> {
		const spreadsheet = await this.createSpreadsheet(
			accessToken,
			`Daily Report - ${date}`,
			["Summary", "Technician Stats"],
		);

		if (!spreadsheet) return null;

		// Summary sheet
		await this.updateValues(
			accessToken,
			spreadsheet.spreadsheetId,
			"Summary!A1:B5",
			[
				["Daily Report", date],
				["Completed Jobs", data.completedJobs],
				["Revenue", data.revenue],
				["New Customers", data.newCustomers],
				["Generated At", new Date().toISOString()],
			],
		);

		// Technician stats
		const techRows = data.technicianStats.map((tech) => [
			tech.name,
			tech.jobs,
			tech.hours,
		]);
		await this.updateValues(
			accessToken,
			spreadsheet.spreadsheetId,
			"Technician Stats!A1",
			[["Technician", "Jobs Completed", "Hours Worked"], ...techRows],
		);

		return spreadsheet;
	}
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();
