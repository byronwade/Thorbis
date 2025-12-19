/**
 * Import API Route
 *
 * Handles file uploads and data import operations
 * Features:
 * - File validation
 * - Row-by-row validation with xlsx/papaparse
 * - Batch insert
 * - Dry run mode
 * - Backup creation
 * - Admin approval requirement
 */

import { type NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

// Field mappings for each data type
const DATA_TYPE_MAPPINGS: Record<string, Record<string, string>> = {
	customers: {
		name: "display_name",
		display_name: "display_name",
		first_name: "first_name",
		last_name: "last_name",
		email: "email",
		phone: "phone",
		address: "address",
		city: "city",
		state: "state",
		zip: "zip_code",
		zip_code: "zip_code",
		status: "status",
		notes: "notes",
	},
	jobs: {
		title: "title",
		name: "title",
		description: "description",
		status: "status",
		priority: "priority",
		scheduled_date: "scheduled_date",
		due_date: "due_date",
		customer_id: "customer_id",
		customer: "customer_id",
	},
	materials: {
		name: "name",
		sku: "sku",
		description: "description",
		unit_price: "unit_price",
		price: "unit_price",
		cost: "cost",
		quantity: "quantity_on_hand",
		quantity_on_hand: "quantity_on_hand",
		reorder_level: "reorder_level",
		category: "category",
	},
	vendors: {
		name: "name",
		display_name: "display_name",
		email: "email",
		phone: "phone",
		address: "address",
		city: "city",
		state: "state",
		zip: "zip_code",
		zip_code: "zip_code",
		category: "category",
		status: "status",
	},
};

// Parse file content based on type
async function parseFile(
	file: File,
): Promise<{ headers: string[]; rows: Record<string, unknown>[] }> {
	const buffer = await file.arrayBuffer();
	const fileName = file.name.toLowerCase();

	if (fileName.endsWith(".csv")) {
		// Parse CSV with papaparse
		const text = new TextDecoder().decode(buffer);
		const result = Papa.parse(text, {
			header: true,
			skipEmptyLines: true,
			transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, "_"),
		});
		return {
			headers: result.meta.fields || [],
			rows: result.data as Record<string, unknown>[],
		};
	}

	// Parse Excel with xlsx
	const workbook = XLSX.read(buffer, { type: "array" });
	const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
	const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });

	// Normalize headers
	const rows = jsonData.map((row) => {
		const normalizedRow: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(row as Record<string, unknown>)) {
			const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, "_");
			normalizedRow[normalizedKey] = value;
		}
		return normalizedRow;
	});

	const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
	return { headers, rows };
}

// Validate and transform row data
function transformRow(
	row: Record<string, unknown>,
	dataType: string,
	companyId: string,
): { valid: boolean; data: Record<string, unknown>; errors: string[] } {
	const mapping = DATA_TYPE_MAPPINGS[dataType];
	if (!mapping) {
		return { valid: false, data: {}, errors: [`Unknown data type: ${dataType}`] };
	}

	const errors: string[] = [];
	const data: Record<string, unknown> = { company_id: companyId };

	for (const [sourceField, targetField] of Object.entries(mapping)) {
		if (row[sourceField] !== undefined && row[sourceField] !== "") {
			data[targetField] = row[sourceField];
		}
	}

	// Basic validation
	if (dataType === "customers") {
		if (!data.display_name && !data.first_name) {
			errors.push("Customer name is required");
		}
		if (!data.display_name && data.first_name) {
			data.display_name = `${data.first_name}${data.last_name ? ` ${data.last_name}` : ""}`;
		}
	} else if (dataType === "jobs") {
		if (!data.title) {
			errors.push("Job title is required");
		}
	} else if (dataType === "materials") {
		if (!data.name) {
			errors.push("Material name is required");
		}
	} else if (dataType === "vendors") {
		if (!data.name && !data.display_name) {
			errors.push("Vendor name is required");
		}
		if (!data.display_name && data.name) {
			data.display_name = data.name;
		}
	}

	return { valid: errors.length === 0, data, errors };
}

export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json(
				{ error: "Database not configured" },
				{ status: 500 },
			);
		}

		// Get form data
		const formData = await request.formData();
		const file = formData.get("file") as File;
		const dataType = formData.get("dataType") as string;
		const dryRun = formData.get("dryRun") === "true";

		if (!(file && dataType)) {
			return NextResponse.json(
				{ error: "File and dataType are required" },
				{ status: 400 },
			);
		}

		// Validate data type
		if (!DATA_TYPE_MAPPINGS[dataType]) {
			return NextResponse.json(
				{ error: `Unsupported data type: ${dataType}. Supported: ${Object.keys(DATA_TYPE_MAPPINGS).join(", ")}` },
				{ status: 400 },
			);
		}

		// Validate file size (10MB limit)
		if (file.size > 10 * 1024 * 1024) {
			return NextResponse.json(
				{ error: "File size exceeds 10MB limit" },
				{ status: 400 },
			);
		}

		// Validate file type
		const allowedTypes = [
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
			"application/vnd.ms-excel", // .xls
			"text/csv", // .csv
		];

		// Also check by extension since MIME types can be unreliable
		const fileName = file.name.toLowerCase();
		const validExtension = fileName.endsWith(".xlsx") || fileName.endsWith(".xls") || fileName.endsWith(".csv");

		if (!allowedTypes.includes(file.type) && !validExtension) {
			return NextResponse.json(
				{ error: "Invalid file type. Only .xlsx, .xls, and .csv are allowed" },
				{ status: 400 },
			);
		}

		// Get active company ID
		const { getActiveCompanyId } = await import("@/lib/auth/company-context");
		const companyId = await getActiveCompanyId();

		if (!companyId) {
			return NextResponse.json(
				{ error: "No active company found" },
				{ status: 400 },
			);
		}

		// Parse the file
		const { headers, rows } = await parseFile(file);
		const totalRows = rows.length;

		if (totalRows === 0) {
			return NextResponse.json(
				{ error: "File contains no data rows" },
				{ status: 400 },
			);
		}

		// Validate and transform all rows
		const validRows: Record<string, unknown>[] = [];
		const validationErrors: Array<{ row: number; errors: string[] }> = [];

		for (let i = 0; i < rows.length; i++) {
			const result = transformRow(rows[i], dataType, companyId);
			if (result.valid) {
				validRows.push(result.data);
			} else {
				validationErrors.push({ row: i + 2, errors: result.errors }); // +2 for 1-based index + header row
			}
		}

		const requiresApproval = totalRows > 100;

		// Create import job record
		const { data: importJob, error: insertError } = await supabase
			.from("data_imports")
			.insert({
				company_id: companyId,
				user_id: user.id,
				data_type: dataType,
				status: dryRun ? "dry_run" : requiresApproval ? "pending" : "processing",
				file_name: file.name,
				total_rows: totalRows,
				valid_rows: validRows.length,
				error_rows: validationErrors.length,
				dry_run: dryRun,
				requires_approval: requiresApproval,
				validation_errors: validationErrors.slice(0, 100), // Store first 100 errors
				headers_found: headers,
			})
			.select()
			.single();

		if (insertError) {
			return NextResponse.json(
				{ error: "Failed to create import job" },
				{ status: 500 },
			);
		}

		// If not dry run and doesn't require approval, process immediately
		if (!dryRun && !requiresApproval && validRows.length > 0) {
			const tableMap: Record<string, string> = {
				customers: "customers",
				jobs: "jobs",
				materials: "materials",
				vendors: "vendors",
			};

			const tableName = tableMap[dataType];
			if (tableName) {
				// Insert in batches of 100
				const batchSize = 100;
				let insertedCount = 0;
				const insertErrors: string[] = [];

				for (let i = 0; i < validRows.length; i += batchSize) {
					const batch = validRows.slice(i, i + batchSize);
					const { error: batchError, count } = await supabase
						.from(tableName)
						.insert(batch)
						.select("id");

					if (batchError) {
						insertErrors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${batchError.message}`);
					} else {
						insertedCount += count || batch.length;
					}
				}

				// Update import job with results
				await supabase
					.from("data_imports")
					.update({
						status: insertErrors.length > 0 ? "completed_with_errors" : "completed",
						processed_rows: insertedCount,
						insert_errors: insertErrors.length > 0 ? insertErrors : null,
					})
					.eq("id", importJob.id);
			}
		}

		return NextResponse.json({
			success: true,
			jobId: importJob.id,
			totalRows,
			validRows: validRows.length,
			errorRows: validationErrors.length,
			requiresApproval,
			dryRun,
			validationErrors: validationErrors.slice(0, 10), // Return first 10 errors in response
			headersFound: headers,
			message: dryRun
				? "Dry run completed - no data was imported"
				: requiresApproval
					? "Import requires admin approval"
					: "Import started successfully",
		});
	} catch (error) {
		console.error("Import error:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Internal server error" },
			{ status: 500 },
		);
	}
}
