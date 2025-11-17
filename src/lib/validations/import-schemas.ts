/**
 * Import Validation Schemas
 *
 * Zod schemas for validating import data for each data type
 */

import { z } from "zod";
import { dateSchema, emailSchema, phoneSchema, uuidSchema } from "./shared-schemas";

// Customer Import Schema
export const customerImportSchema = z.object({
	name: z.string().min(1, "Name is required").max(200, "Name is too long"),
	email: emailSchema.optional(),
	phone: phoneSchema.optional(),
	address: z.string().max(500, "Address is too long").optional(),
	city: z.string().max(100, "City is too long").optional(),
	state: z.string().max(50, "State is too long").optional(),
	zip: z.string().max(20, "ZIP code is too long").optional(),
	country: z.string().max(100, "Country is too long").optional(),
	notes: z.string().max(1000, "Notes are too long").optional(),
	tags: z.array(z.string()).optional(),
});

// Job Import Schema
export const jobImportSchema = z.object({
	customer_id: uuidSchema.optional(),
	customer_name: z.string().min(1, "Customer name is required").optional(),
	title: z.string().min(1, "Job title is required").max(200, "Title is too long"),
	description: z.string().max(2000, "Description is too long").optional(),
	status: z.enum(["pending", "scheduled", "in_progress", "completed", "cancelled"]).optional(),
	priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
	scheduled_date: dateSchema.optional(),
	address: z.string().max(500, "Address is too long").optional(),
	estimated_duration: z.number().positive("Duration must be positive").optional(),
	notes: z.string().max(1000, "Notes are too long").optional(),
});

// Invoice Import Schema
export const invoiceImportSchema = z.object({
	customer_id: uuidSchema.optional(),
	customer_name: z.string().min(1, "Customer name is required").optional(),
	invoice_number: z
		.string()
		.min(1, "Invoice number is required")
		.max(50, "Invoice number is too long"),
	date: dateSchema,
	due_date: dateSchema,
	amount: z.number().positive("Amount must be positive"),
	tax: z.number().nonnegative("Tax cannot be negative").optional(),
	status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).optional(),
	payment_method: z.string().max(50, "Payment method is too long").optional(),
	notes: z.string().max(1000, "Notes are too long").optional(),
});

// Estimate Import Schema
export const estimateImportSchema = z.object({
	customer_id: uuidSchema.optional(),
	customer_name: z.string().min(1, "Customer name is required").optional(),
	estimate_number: z
		.string()
		.min(1, "Estimate number is required")
		.max(50, "Estimate number is too long"),
	date: dateSchema,
	valid_until: dateSchema,
	total: z.number().positive("Total must be positive"),
	status: z.enum(["draft", "sent", "accepted", "declined", "expired"]).optional(),
	notes: z.string().max(1000, "Notes are too long").optional(),
});

// Contract Import Schema
export const contractImportSchema = z.object({
	customer_id: uuidSchema.optional(),
	customer_name: z.string().min(1, "Customer name is required").optional(),
	contract_number: z
		.string()
		.min(1, "Contract number is required")
		.max(50, "Contract number is too long"),
	title: z.string().min(1, "Title is required").max(200, "Title is too long"),
	start_date: dateSchema,
	end_date: dateSchema,
	value: z.number().positive("Value must be positive"),
	status: z.enum(["draft", "active", "completed", "cancelled"]).optional(),
	terms: z.string().max(5000, "Terms are too long").optional(),
});

// Purchase Order Import Schema
export const purchaseOrderImportSchema = z.object({
	vendor_name: z.string().min(1, "Vendor name is required").max(200, "Vendor name is too long"),
	po_number: z.string().min(1, "PO number is required").max(50, "PO number is too long"),
	date: dateSchema,
	expected_delivery: dateSchema.optional(),
	total: z.number().positive("Total must be positive"),
	status: z.enum(["draft", "sent", "confirmed", "delivered", "cancelled"]).optional(),
	notes: z.string().max(1000, "Notes are too long").optional(),
});

// Price Book Import Schema
export const priceBookImportSchema = z.object({
	sku: z.string().min(1, "SKU is required").max(50, "SKU is too long"),
	name: z.string().min(1, "Name is required").max(200, "Name is too long"),
	category: z.string().max(100, "Category is too long").optional(),
	description: z.string().max(1000, "Description is too long").optional(),
	price: z.number().positive("Price must be positive"),
	cost: z.number().nonnegative("Cost cannot be negative").optional(),
	unit: z.string().max(20, "Unit is too long").optional(),
	in_stock: z.number().nonnegative("Stock cannot be negative").optional(),
});

// Materials Import Schema
export const materialsImportSchema = z.object({
	item_name: z.string().min(1, "Item name is required").max(200, "Item name is too long"),
	sku: z.string().max(50, "SKU is too long").optional(),
	quantity: z.number().nonnegative("Quantity cannot be negative"),
	location: z.string().max(100, "Location is too long").optional(),
	reorder_point: z.number().nonnegative("Reorder point cannot be negative").optional(),
	supplier: z.string().max(200, "Supplier name is too long").optional(),
	cost: z.number().nonnegative("Cost cannot be negative").optional(),
});

// Equipment Import Schema
export const equipmentImportSchema = z.object({
	equipment_name: z
		.string()
		.min(1, "Equipment name is required")
		.max(200, "Equipment name is too long"),
	serial_number: z.string().max(100, "Serial number is too long").optional(),
	model: z.string().max(100, "Model is too long").optional(),
	manufacturer: z.string().max(100, "Manufacturer is too long").optional(),
	purchase_date: dateSchema.optional(),
	location: z.string().max(100, "Location is too long").optional(),
	status: z.enum(["available", "in_use", "maintenance", "retired"]).optional(),
});

// Schema Map
export const importSchemas = {
	customers: customerImportSchema,
	jobs: jobImportSchema,
	invoices: invoiceImportSchema,
	estimates: estimateImportSchema,
	contracts: contractImportSchema,
	"purchase-orders": purchaseOrderImportSchema,
	pricebook: priceBookImportSchema,
	materials: materialsImportSchema,
	equipment: equipmentImportSchema,
} as const;

export type DataType = keyof typeof importSchemas;

/**
 * Validate a single row of import data
 */
export function validateImportRow(dataType: DataType, row: unknown, rowNumber: number) {
	const schema = importSchemas[dataType];
	if (!schema) {
		return {
			valid: false,
			errors: [{ row: rowNumber, field: "dataType", error: "Invalid data type" }],
		};
	}

	const result = schema.safeParse(row);
	if (result.success) {
		return { valid: true, data: result.data, errors: [] };
	}

	const errors = result.error.issues.map((err) => ({
		row: rowNumber,
		field: err.path.join("."),
		error: err.message,
	}));

	return { valid: false, errors };
}

/**
 * Validate all rows in an import
 */
export function validateImportData(dataType: DataType, rows: unknown[]) {
	const results = rows.map((row, index) => validateImportRow(dataType, row, index + 1));

	const validRows = results.filter((r) => r.valid).map((r) => r.data);
	const errors = results.flatMap((r) => r.errors);

	return {
		totalRows: rows.length,
		validRows: validRows.length,
		invalidRows: errors.length,
		validData: validRows,
		errors,
	};
}
