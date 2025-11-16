/**
 * Team Member Bulk Upload Utilities
 *
 * Handles parsing and validation of Excel/CSV files for bulk team member import
 */

import Papa from "papaparse";
import * as XLSX from "xlsx";

export type TeamMemberRow = {
	firstName: string;
	lastName: string;
	email: string;
	role: "owner" | "admin" | "manager" | "technician" | "dispatcher";
	phone?: string;
};

export type ParseResult = {
	success: boolean;
	data?: TeamMemberRow[];
	errors?: string[];
};

/**
 * Parse CSV file
 */
export async function parseCSV(file: File): Promise<ParseResult> {
	return new Promise((resolve) => {
		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				const { data, errors: parseErrors } = results;

				if (parseErrors.length > 0) {
					resolve({
						success: false,
						errors: parseErrors.map((e) => e.message),
					});
					return;
				}

				const { validData, errors } = validateAndTransform(data as any[]);

				if (errors.length > 0) {
					resolve({ success: false, errors });
				} else {
					resolve({ success: true, data: validData });
				}
			},
			error: (error) => {
				resolve({ success: false, errors: [error.message] });
			},
		});
	});
}

/**
 * Parse Excel file
 */
export async function parseExcel(file: File): Promise<ParseResult> {
	return new Promise((resolve) => {
		const reader = new FileReader();

		reader.onload = (e) => {
			try {
				const data = e.target?.result;
				const workbook = XLSX.read(data, { type: "binary" });

				// Get first sheet
				const sheetName = workbook.SheetNames[0];
				const sheet = workbook.Sheets[sheetName];

				// Convert to JSON
				const jsonData = XLSX.utils.sheet_to_json(sheet);

				const { validData, errors } = validateAndTransform(jsonData);

				if (errors.length > 0) {
					resolve({ success: false, errors });
				} else {
					resolve({ success: true, data: validData });
				}
			} catch (error) {
				resolve({
					success: false,
					errors: [error instanceof Error ? error.message : "Failed to parse Excel file"],
				});
			}
		};

		reader.onerror = () => {
			resolve({ success: false, errors: ["Failed to read file"] });
		};

		reader.readAsBinaryString(file);
	});
}

/**
 * Validate and transform parsed data
 */
function validateAndTransform(data: any[]): {
	validData: TeamMemberRow[];
	errors: string[];
} {
	const validData: TeamMemberRow[] = [];
	const errors: string[] = [];

	const validRoles = ["owner", "admin", "manager", "technician", "dispatcher"];

	data.forEach((row, index) => {
		const rowNumber = index + 2; // +2 because index starts at 0 and header is row 1

		// Check required fields
		const firstName = String(row.firstName || row.FirstName || row.first_name || "").trim();
		const lastName = String(row.lastName || row.LastName || row.last_name || "").trim();
		const email = String(row.email || row.Email || "")
			.trim()
			.toLowerCase();
		const role = String(row.role || row.Role || "")
			.trim()
			.toLowerCase();
		const phone = String(row.phone || row.Phone || row.phone_number || "").trim();

		if (!firstName) {
			errors.push(`Row ${rowNumber}: First name is required`);
			return;
		}

		if (!lastName) {
			errors.push(`Row ${rowNumber}: Last name is required`);
			return;
		}

		if (!email) {
			errors.push(`Row ${rowNumber}: Email is required`);
			return;
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			errors.push(`Row ${rowNumber}: Invalid email format (${email})`);
			return;
		}

		if (!role) {
			errors.push(`Row ${rowNumber}: Role is required`);
			return;
		}

		if (!validRoles.includes(role)) {
			errors.push(`Row ${rowNumber}: Invalid role "${role}". Must be one of: ${validRoles.join(", ")}`);
			return;
		}

		validData.push({
			firstName,
			lastName,
			email,
			role: role as TeamMemberRow["role"],
			phone: phone || undefined,
		});
	});

	// Check for duplicate emails
	const emailSet = new Set<string>();
	validData.forEach((member, _index) => {
		if (emailSet.has(member.email)) {
			errors.push(`Duplicate email found: ${member.email}`);
		}
		emailSet.add(member.email);
	});

	return { validData, errors };
}

/**
 * Generate a sample Excel template
 */
export function generateTemplate(): void {
	const template = [
		{
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@example.com",
			role: "technician",
			phone: "+1 (555) 123-4567",
		},
		{
			firstName: "Jane",
			lastName: "Smith",
			email: "jane.smith@example.com",
			role: "manager",
			phone: "+1 (555) 987-6543",
		},
	];

	const worksheet = XLSX.utils.json_to_sheet(template);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Team Members");

	// Set column widths
	worksheet["!cols"] = [
		{ wch: 15 }, // firstName
		{ wch: 15 }, // lastName
		{ wch: 30 }, // email
		{ wch: 15 }, // role
		{ wch: 20 }, // phone
	];

	XLSX.writeFile(workbook, "team-members-template.xlsx");
}

/**
 * Generate a sample CSV template
 */
export function generateCSVTemplate(): void {
	const template = `firstName,lastName,email,role,phone
John,Doe,john.doe@example.com,technician,+1 (555) 123-4567
Jane,Smith,jane.smith@example.com,manager,+1 (555) 987-6543`;

	const blob = new Blob([template], { type: "text/csv" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "team-members-template.csv";
	a.click();
	URL.revokeObjectURL(url);
}
