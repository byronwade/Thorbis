/**
 * Export API Route
 *
 * Handles data export operations
 * Features:
 * - Filter application
 * - Field selection
 * - Multiple format support (xlsx, csv)
 * - Pagination for large datasets
 * - Audit logging
 */

import { type NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

// Field definitions for each data type
const DATA_TYPE_FIELDS: Record<string, { field: string; header: string }[]> = {
	customers: [
		{ field: "display_name", header: "Name" },
		{ field: "first_name", header: "First Name" },
		{ field: "last_name", header: "Last Name" },
		{ field: "email", header: "Email" },
		{ field: "phone", header: "Phone" },
		{ field: "address", header: "Address" },
		{ field: "city", header: "City" },
		{ field: "state", header: "State" },
		{ field: "zip_code", header: "Zip Code" },
		{ field: "status", header: "Status" },
		{ field: "notes", header: "Notes" },
		{ field: "created_at", header: "Created At" },
	],
	jobs: [
		{ field: "job_number", header: "Job Number" },
		{ field: "title", header: "Title" },
		{ field: "description", header: "Description" },
		{ field: "status", header: "Status" },
		{ field: "priority", header: "Priority" },
		{ field: "scheduled_date", header: "Scheduled Date" },
		{ field: "due_date", header: "Due Date" },
		{ field: "total", header: "Total" },
		{ field: "created_at", header: "Created At" },
	],
	materials: [
		{ field: "name", header: "Name" },
		{ field: "sku", header: "SKU" },
		{ field: "description", header: "Description" },
		{ field: "unit_price", header: "Unit Price" },
		{ field: "cost", header: "Cost" },
		{ field: "quantity_on_hand", header: "Quantity" },
		{ field: "reorder_level", header: "Reorder Level" },
		{ field: "category", header: "Category" },
		{ field: "created_at", header: "Created At" },
	],
	vendors: [
		{ field: "vendor_number", header: "Vendor Number" },
		{ field: "display_name", header: "Name" },
		{ field: "email", header: "Email" },
		{ field: "phone", header: "Phone" },
		{ field: "address", header: "Address" },
		{ field: "city", header: "City" },
		{ field: "state", header: "State" },
		{ field: "zip_code", header: "Zip Code" },
		{ field: "category", header: "Category" },
		{ field: "status", header: "Status" },
		{ field: "created_at", header: "Created At" },
	],
	invoices: [
		{ field: "invoice_number", header: "Invoice Number" },
		{ field: "status", header: "Status" },
		{ field: "subtotal", header: "Subtotal" },
		{ field: "tax", header: "Tax" },
		{ field: "total", header: "Total" },
		{ field: "amount_paid", header: "Amount Paid" },
		{ field: "balance_due", header: "Balance Due" },
		{ field: "due_date", header: "Due Date" },
		{ field: "created_at", header: "Created At" },
	],
	estimates: [
		{ field: "estimate_number", header: "Estimate Number" },
		{ field: "status", header: "Status" },
		{ field: "subtotal", header: "Subtotal" },
		{ field: "tax", header: "Tax" },
		{ field: "total", header: "Total" },
		{ field: "valid_until", header: "Valid Until" },
		{ field: "created_at", header: "Created At" },
	],
};

// Table names for each data type
const TABLE_MAP: Record<string, string> = {
	customers: "customers",
	jobs: "jobs",
	materials: "materials",
	vendors: "vendors",
	invoices: "invoices",
	estimates: "estimates",
};

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

		// Parse request body
		const body = await request.json();
		const { dataType, format, filters, fields: requestedFields } = body;

		if (!(dataType && format)) {
			return NextResponse.json(
				{ error: "dataType and format are required" },
				{ status: 400 },
			);
		}

		// Validate data type
		if (!DATA_TYPE_FIELDS[dataType]) {
			return NextResponse.json(
				{ error: `Unsupported data type: ${dataType}. Supported: ${Object.keys(DATA_TYPE_FIELDS).join(", ")}` },
				{ status: 400 },
			);
		}

		// Validate format
		const allowedFormats = ["xlsx", "csv"];
		if (!allowedFormats.includes(format)) {
			return NextResponse.json(
				{ error: "Invalid format. Allowed: xlsx, csv" },
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

		// Get field definitions
		const allFields = DATA_TYPE_FIELDS[dataType];
		const fieldsToExport = requestedFields?.length
			? allFields.filter((f) => requestedFields.includes(f.field))
			: allFields;

		// Build select query
		const selectFields = fieldsToExport.map((f) => f.field).join(", ");
		const tableName = TABLE_MAP[dataType];

		// Fetch data with filters
		let query = supabase
			.from(tableName)
			.select(selectFields)
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(10000); // Max 10k records per export

		// Apply filters
		if (filters) {
			if (filters.status) {
				query = query.eq("status", filters.status);
			}
			if (filters.category) {
				query = query.eq("category", filters.category);
			}
			if (filters.dateFrom) {
				query = query.gte("created_at", filters.dateFrom);
			}
			if (filters.dateTo) {
				query = query.lte("created_at", filters.dateTo);
			}
			if (filters.search) {
				// Apply text search based on data type
				const searchField = dataType === "customers" ? "display_name" : "name";
				query = query.ilike(searchField, `%${filters.search}%`);
			}
		}

		const { data: records, error: fetchError } = await query;

		if (fetchError) {
			console.error("Export fetch error:", fetchError);
			return NextResponse.json(
				{ error: "Failed to fetch data for export" },
				{ status: 500 },
			);
		}

		const recordCount = records?.length || 0;

		if (recordCount === 0) {
			return NextResponse.json(
				{ error: "No records found matching the criteria" },
				{ status: 404 },
			);
		}

		// Transform data for export (use friendly headers)
		const exportData = (records || []).map((record) => {
			const row: Record<string, unknown> = {};
			for (const field of fieldsToExport) {
				const value = record[field.field];
				// Format dates
				if (field.field.includes("_at") || field.field.includes("date")) {
					row[field.header] = value ? new Date(value as string).toLocaleDateString() : "";
				} else {
					row[field.header] = value ?? "";
				}
			}
			return row;
		});

		// Generate file content
		let fileContent: string | ArrayBuffer;
		let contentType: string;
		let fileExtension: string;

		if (format === "csv") {
			const csv = Papa.unparse(exportData);
			fileContent = csv;
			contentType = "text/csv";
			fileExtension = "csv";
		} else {
			// xlsx format
			const worksheet = XLSX.utils.json_to_sheet(exportData);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, dataType);

			// Auto-size columns
			const colWidths = fieldsToExport.map((f) => ({ wch: Math.max(f.header.length, 15) }));
			worksheet["!cols"] = colWidths;

			fileContent = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
			contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
			fileExtension = "xlsx";
		}

		// Upload file to storage
		const timestamp = Date.now();
		const fileName = `${dataType}-export-${timestamp}.${fileExtension}`;
		const filePath = `${companyId}/exports/${fileName}`;

		const { error: uploadError } = await supabase.storage
			.from("company-files")
			.upload(filePath, fileContent, {
				contentType,
				upsert: true,
			});

		if (uploadError) {
			console.error("Export upload error:", uploadError);
			// Return file directly as fallback
			return new NextResponse(fileContent, {
				headers: {
					"Content-Type": contentType,
					"Content-Disposition": `attachment; filename="${fileName}"`,
				},
			});
		}

		// Get signed URL for download
		const { data: urlData } = await supabase.storage
			.from("company-files")
			.createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days

		const fileUrl = urlData?.signedUrl || `/api/data/download/${timestamp}`;

		// Create export record for audit trail
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

		const { data: exportRecord, error: insertError } = await supabase
			.from("data_exports")
			.insert({
				company_id: companyId,
				user_id: user.id,
				data_type: dataType,
				format,
				filters: filters || {},
				fields_exported: fieldsToExport.map((f) => f.field),
				file_url: fileUrl,
				file_path: filePath,
				record_count: recordCount,
				expires_at: expiresAt.toISOString(),
			})
			.select()
			.single();

		if (insertError) {
			console.error("Export record error:", insertError);
			// Still return success since file was created
		}

		return NextResponse.json({
			success: true,
			exportId: exportRecord?.id,
			downloadUrl: fileUrl,
			recordCount,
			format,
			fileName,
			expiresAt: expiresAt.toISOString(),
		});
	} catch (error) {
		console.error("Export error:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Internal server error" },
			{ status: 500 },
		);
	}
}
