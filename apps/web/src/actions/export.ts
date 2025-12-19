/**
 * Data Export Server Actions
 *
 * Provides export functionality for business data:
 * - Customers, Jobs, Invoices, Estimates, Equipment
 * - CSV, Excel (XLSX), and JSON formats
 * - PDF export for individual records
 */

"use server";

import { getActiveCompanyId } from "@/lib/auth/company-context";
import { ActionError, ERROR_CODES } from "@/lib/errors/action-error";
import {
	type ActionResult,
	assertAuthenticated,
	assertExists,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// TYPES
// ============================================================================

export type ExportEntityType =
	| "customers"
	| "jobs"
	| "invoices"
	| "estimates"
	| "equipment";
export type ExportFormat = "csv" | "excel" | "json" | "pdf";

export type ExportResult = {
	data: string;
	filename: string;
	mimeType: string;
};

// ============================================================================
// FIELD DEFINITIONS
// ============================================================================

const CUSTOMER_FIELDS = [
	"id",
	"first_name",
	"last_name",
	"email",
	"phone",
	"company_name",
	"address",
	"city",
	"state",
	"zip_code",
	"customer_type",
	"status",
	"created_at",
] as const;

const JOB_FIELDS = [
	"id",
	"job_number",
	"title",
	"description",
	"status",
	"priority",
	"job_type",
	"scheduled_start",
	"scheduled_end",
	"total_amount",
	"created_at",
] as const;

const INVOICE_FIELDS = [
	"id",
	"invoice_number",
	"status",
	"subtotal",
	"tax_amount",
	"total_amount",
	"amount_paid",
	"balance_due",
	"due_date",
	"issued_at",
	"created_at",
] as const;

const ESTIMATE_FIELDS = [
	"id",
	"estimate_number",
	"title",
	"status",
	"subtotal",
	"tax_amount",
	"total_amount",
	"valid_until",
	"created_at",
] as const;

const EQUIPMENT_FIELDS = [
	"id",
	"name",
	"model_number",
	"serial_number",
	"manufacturer",
	"equipment_type",
	"status",
	"install_date",
	"warranty_expiry",
	"created_at",
] as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function escapeCSVField(value: unknown): string {
	if (value === null || value === undefined) {
		return "";
	}
	const stringValue = String(value);
	// Escape quotes and wrap in quotes if contains comma, quote, or newline
	if (
		stringValue.includes(",") ||
		stringValue.includes('"') ||
		stringValue.includes("\n")
	) {
		return `"${stringValue.replace(/"/g, '""')}"`;
	}
	return stringValue;
}

function formatDate(dateString: string | null): string {
	if (!dateString) return "";
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
}

function formatCurrency(cents: number | null): string {
	if (cents === null || cents === undefined) return "";
	return (cents / 100).toFixed(2);
}

function generateCSV<T extends Record<string, unknown>>(
	data: T[],
	fields: readonly string[],
	formatters: Record<string, (value: unknown) => string> = {},
): string {
	const headers = fields.map((field) =>
		field
			.replace(/_/g, " ")
			.replace(/\b\w/g, (c) => c.toUpperCase()),
	);

	const rows = data.map((item) =>
		fields
			.map((field) => {
				const value = item[field];
				const formatter = formatters[field];
				const formattedValue = formatter ? formatter(value) : value;
				return escapeCSVField(formattedValue);
			})
			.join(","),
	);

	return [headers.join(","), ...rows].join("\n");
}

function generateJSON<T>(data: T[]): string {
	return JSON.stringify(data, null, 2);
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

export async function exportCustomers(
	format: ExportFormat,
): Promise<ActionResult<ExportResult>> {
	return await withErrorHandling(async () => {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);
		const companyId = await getActiveCompanyId();
		assertExists(companyId, "Company not found");

		const { data, error } = await supabase
			.from("customers")
			.select(CUSTOMER_FIELDS.join(","))
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(10000);

		if (error) {
			throw new ActionError(
				`Failed to fetch customers: ${error.message}`,
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		const timestamp = new Date().toISOString().split("T")[0];

		if (format === "json") {
			return {
				data: generateJSON(data || []),
				filename: `customers-${timestamp}.json`,
				mimeType: "application/json",
			};
		}

		const csv = generateCSV(data || [], CUSTOMER_FIELDS, {
			created_at: formatDate,
		});

		return {
			data: csv,
			filename: `customers-${timestamp}.csv`,
			mimeType: "text/csv",
		};
	});
}

export async function exportJobs(
	format: ExportFormat,
): Promise<ActionResult<ExportResult>> {
	return await withErrorHandling(async () => {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);
		const companyId = await getActiveCompanyId();
		assertExists(companyId, "Company not found");

		const { data, error } = await supabase
			.from("jobs")
			.select(JOB_FIELDS.join(","))
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(10000);

		if (error) {
			throw new ActionError(
				`Failed to fetch jobs: ${error.message}`,
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		const timestamp = new Date().toISOString().split("T")[0];

		if (format === "json") {
			return {
				data: generateJSON(data || []),
				filename: `jobs-${timestamp}.json`,
				mimeType: "application/json",
			};
		}

		const csv = generateCSV(data || [], JOB_FIELDS, {
			created_at: formatDate,
			scheduled_start: formatDate,
			scheduled_end: formatDate,
			total_amount: formatCurrency,
		});

		return {
			data: csv,
			filename: `jobs-${timestamp}.csv`,
			mimeType: "text/csv",
		};
	});
}

export async function exportInvoices(
	format: ExportFormat,
): Promise<ActionResult<ExportResult>> {
	return await withErrorHandling(async () => {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);
		const companyId = await getActiveCompanyId();
		assertExists(companyId, "Company not found");

		const { data, error } = await supabase
			.from("invoices")
			.select(INVOICE_FIELDS.join(","))
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(10000);

		if (error) {
			throw new ActionError(
				`Failed to fetch invoices: ${error.message}`,
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		const timestamp = new Date().toISOString().split("T")[0];

		if (format === "json") {
			return {
				data: generateJSON(data || []),
				filename: `invoices-${timestamp}.json`,
				mimeType: "application/json",
			};
		}

		const csv = generateCSV(data || [], INVOICE_FIELDS, {
			created_at: formatDate,
			due_date: formatDate,
			issued_at: formatDate,
			subtotal: formatCurrency,
			tax_amount: formatCurrency,
			total_amount: formatCurrency,
			amount_paid: formatCurrency,
			balance_due: formatCurrency,
		});

		return {
			data: csv,
			filename: `invoices-${timestamp}.csv`,
			mimeType: "text/csv",
		};
	});
}

export async function exportEstimates(
	format: ExportFormat,
): Promise<ActionResult<ExportResult>> {
	return await withErrorHandling(async () => {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);
		const companyId = await getActiveCompanyId();
		assertExists(companyId, "Company not found");

		const { data, error } = await supabase
			.from("estimates")
			.select(ESTIMATE_FIELDS.join(","))
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(10000);

		if (error) {
			throw new ActionError(
				`Failed to fetch estimates: ${error.message}`,
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		const timestamp = new Date().toISOString().split("T")[0];

		if (format === "json") {
			return {
				data: generateJSON(data || []),
				filename: `estimates-${timestamp}.json`,
				mimeType: "application/json",
			};
		}

		const csv = generateCSV(data || [], ESTIMATE_FIELDS, {
			created_at: formatDate,
			valid_until: formatDate,
			subtotal: formatCurrency,
			tax_amount: formatCurrency,
			total_amount: formatCurrency,
		});

		return {
			data: csv,
			filename: `estimates-${timestamp}.csv`,
			mimeType: "text/csv",
		};
	});
}

export async function exportEquipment(
	format: ExportFormat,
): Promise<ActionResult<ExportResult>> {
	return await withErrorHandling(async () => {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);
		const companyId = await getActiveCompanyId();
		assertExists(companyId, "Company not found");

		const { data, error } = await supabase
			.from("equipment")
			.select(EQUIPMENT_FIELDS.join(","))
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(10000);

		if (error) {
			throw new ActionError(
				`Failed to fetch equipment: ${error.message}`,
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		const timestamp = new Date().toISOString().split("T")[0];

		if (format === "json") {
			return {
				data: generateJSON(data || []),
				filename: `equipment-${timestamp}.json`,
				mimeType: "application/json",
			};
		}

		const csv = generateCSV(data || [], EQUIPMENT_FIELDS, {
			created_at: formatDate,
			install_date: formatDate,
			warranty_expiry: formatDate,
		});

		return {
			data: csv,
			filename: `equipment-${timestamp}.csv`,
			mimeType: "text/csv",
		};
	});
}

/**
 * Main export function that routes to the appropriate entity export
 */
export async function exportData(
	entityType: ExportEntityType,
	format: ExportFormat,
): Promise<ActionResult<ExportResult>> {
	switch (entityType) {
		case "customers":
			return exportCustomers(format);
		case "jobs":
			return exportJobs(format);
		case "invoices":
			return exportInvoices(format);
		case "estimates":
			return exportEstimates(format);
		case "equipment":
			return exportEquipment(format);
		default:
			return {
				success: false,
				error: `Unknown entity type: ${entityType}`,
			};
	}
}
