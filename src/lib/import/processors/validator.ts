/**
 * Data Validator
 *
 * Validates import data before processing using:
 * - Zod schemas for type safety
 * - Custom validation rules
 * - Field-level and record-level validation
 * - Business logic validation
 */

import { z } from "zod";
import type {
	EntityType,
	FieldMapping,
	ImportError,
	ValidationResult,
} from "@/types/import";

// ============================================================================
// Zod Schemas for Entity Validation
// ============================================================================

const CustomerSchema = z.object({
	first_name: z.string().min(1).optional(),
	last_name: z.string().min(1).optional(),
	display_name: z.string().min(1, "Display name is required"),
	email: z.string().email("Invalid email format"),
	phone: z
		.string()
		.regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number (use E.164 format)"),
	address: z.string().optional(),
	city: z.string().optional(),
	state: z.string().length(2, "State must be 2 characters").optional(),
	zip: z
		.string()
		.regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code")
		.optional(),
	type: z
		.enum(["residential", "commercial", "industrial"])
		.default("residential"),
	company_name: z.string().optional(),
	notes: z.string().optional(),
	tags: z.array(z.string()).default([]),
});

const JobSchema = z.object({
	customer_id: z.string().uuid("Invalid customer ID"),
	property_id: z.string().uuid().optional(),
	title: z.string().min(1, "Job title is required"),
	description: z.string().optional(),
	status: z
		.enum(["scheduled", "in_progress", "completed", "cancelled"])
		.default("scheduled"),
	priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
	scheduled_date: z.string().datetime().optional(),
	completed_date: z.string().datetime().optional(),
	total_amount: z.number().min(0).optional(),
});

const InvoiceSchema = z.object({
	customer_id: z.string().uuid("Invalid customer ID"),
	job_id: z.string().uuid().optional(),
	invoice_number: z.string().min(1, "Invoice number is required"),
	status: z
		.enum(["draft", "sent", "paid", "overdue", "cancelled"])
		.default("draft"),
	total: z.number().min(0, "Total must be non-negative"),
	subtotal: z.number().min(0).optional(),
	tax: z.number().min(0).default(0),
	due_date: z.string().date().optional(),
	paid_date: z.string().date().optional(),
});

// Schema map for all entity types
const EntitySchemas: Partial<Record<EntityType, z.ZodSchema>> = {
	customers: CustomerSchema,
	jobs: JobSchema,
	invoices: InvoiceSchema,
	// Add more as needed
};

// ============================================================================
// Validator Class
// ============================================================================

export class DataValidator {
	private validationResults: ValidationResult[] = [];
	private errors: ImportError[] = [];

	/**
	 * Validate a batch of records
	 */
	async validateBatch(
		records: Record<string, unknown>[],
		entityType: EntityType,
		mappings?: FieldMapping[],
	): Promise<{
		valid: boolean;
		validRecords: Record<string, unknown>[];
		invalidRecords: Array<{
			record: Record<string, unknown>;
			errors: string[];
		}>;
		validationResults: ValidationResult[];
		errors: ImportError[];
	}> {
		this.validationResults = [];
		this.errors = [];

		const validRecords: Record<string, unknown>[] = [];
		const invalidRecords: Array<{
			record: Record<string, unknown>;
			errors: string[];
		}> = [];

		const schema = EntitySchemas[entityType];

		for (let i = 0; i < records.length; i++) {
			const record = records[i];
			const recordErrors: string[] = [];

			// Schema validation
			if (schema) {
				const result = schema.safeParse(record);

				if (!result.success) {
					result.error.errors.forEach((err) => {
						const field = err.path.join(".");
						const message = err.message;

						recordErrors.push(`${field}: ${message}`);

						this.errors.push({
							recordIndex: i,
							recordData: record,
							field,
							error: message,
							code: "VALIDATION_ERROR",
							severity: "error",
							canRetry: false,
						});

						this.validationResults.push({
							field,
							rule: "schema_validation",
							passed: false,
							message,
							recordIndices: [i],
						});
					});
				}
			}

			// Field mapping validation
			if (mappings) {
				for (const mapping of mappings) {
					if (mapping.required && !record[mapping.sourceField]) {
						const message = `Required field "${mapping.sourceField}" is missing`;
						recordErrors.push(message);

						this.errors.push({
							recordIndex: i,
							recordData: record,
							field: mapping.sourceField,
							error: message,
							code: "MISSING_REQUIRED_FIELD",
							severity: "error",
							canRetry: false,
						});
					}

					// Custom validation rules
					if (mapping.validationRules) {
						const value = record[mapping.sourceField];

						for (const rule of mapping.validationRules) {
							const ruleResult = this.applyValidationRule(value, rule);

							if (!ruleResult.passed) {
								recordErrors.push(ruleResult.message || "Validation failed");

								this.errors.push({
									recordIndex: i,
									recordData: record,
									field: mapping.sourceField,
									error: ruleResult.message || "Validation failed",
									code: "VALIDATION_RULE_FAILED",
									severity: "error",
									canRetry: false,
								});
							}
						}
					}
				}
			}

			// Custom business logic validation
			const businessValidation = this.validateBusinessLogic(record, entityType);
			if (!businessValidation.valid) {
				recordErrors.push(...businessValidation.errors);
			}

			// Categorize record
			if (recordErrors.length === 0) {
				validRecords.push(record);
			} else {
				invalidRecords.push({ record, errors: recordErrors });
			}
		}

		return {
			valid: invalidRecords.length === 0,
			validRecords,
			invalidRecords,
			validationResults: this.validationResults,
			errors: this.errors,
		};
	}

	/**
	 * Apply a single validation rule
	 */
	private applyValidationRule(
		value: unknown,
		rule: any,
	): { passed: boolean; message?: string } {
		switch (rule.type) {
			case "regex":
				if (typeof value === "string") {
					const regex = new RegExp(rule.value);
					return {
						passed: regex.test(value),
						message: rule.message,
					};
				}
				return { passed: false, message: "Value must be a string" };

			case "min":
				if (typeof value === "number") {
					return {
						passed: value >= rule.value,
						message: rule.message || `Value must be >= ${rule.value}`,
					};
				}
				return { passed: false, message: "Value must be a number" };

			case "max":
				if (typeof value === "number") {
					return {
						passed: value <= rule.value,
						message: rule.message || `Value must be <= ${rule.value}`,
					};
				}
				return { passed: false, message: "Value must be a number" };

			case "enum":
				return {
					passed: rule.value.includes(value),
					message:
						rule.message || `Value must be one of: ${rule.value.join(", ")}`,
				};

			case "custom":
				if (typeof rule.value === "function") {
					try {
						const result = rule.value(value);
						return {
							passed: !!result,
							message: rule.message,
						};
					} catch (error) {
						return {
							passed: false,
							message:
								error instanceof Error
									? error.message
									: "Custom validation failed",
						};
					}
				}
				return { passed: false, message: "Invalid custom validation function" };

			default:
				return { passed: true };
		}
	}

	/**
	 * Validate business logic rules
	 */
	private validateBusinessLogic(
		record: Record<string, unknown>,
		entityType: EntityType,
	): { valid: boolean; errors: string[] } {
		const errors: string[] = [];

		switch (entityType) {
			case "customers":
				// Must have either (first_name + last_name) OR display_name OR company_name
				if (
					!record.display_name &&
					!record.company_name &&
					(!record.first_name || !record.last_name)
				) {
					errors.push(
						"Customer must have display_name, company_name, or both first_name and last_name",
					);
				}

				// If type is commercial, should have company_name
				if (record.type === "commercial" && !record.company_name) {
					errors.push("Commercial customers should have a company_name");
				}
				break;

			case "invoices":
				// Due date should be in the future (if provided)
				if (record.due_date) {
					const dueDate = new Date(record.due_date as string);
					const today = new Date();
					today.setHours(0, 0, 0, 0);

					if (
						dueDate < today &&
						record.status !== "paid" &&
						record.status !== "cancelled"
					) {
						errors.push("Due date cannot be in the past for unpaid invoices");
					}
				}

				// Paid date should not be set for non-paid invoices
				if (record.paid_date && record.status !== "paid") {
					errors.push("Paid date should only be set for paid invoices");
				}
				break;

			case "jobs":
				// Completed date should be set for completed jobs
				if (record.status === "completed" && !record.completed_date) {
					errors.push("Completed jobs must have a completed_date");
				}

				// Scheduled date required for scheduled jobs
				if (record.status === "scheduled" && !record.scheduled_date) {
					errors.push("Scheduled jobs must have a scheduled_date");
				}
				break;
		}

		return {
			valid: errors.length === 0,
			errors,
		};
	}

	/**
	 * Validate a single record
	 */
	async validateRecord(
		record: Record<string, unknown>,
		entityType: EntityType,
	): Promise<{ valid: boolean; errors: string[] }> {
		const result = await this.validateBatch([record], entityType);
		return {
			valid: result.valid,
			errors: result.invalidRecords[0]?.errors || [],
		};
	}

	/**
	 * Get validation statistics
	 */
	getStats() {
		return {
			totalErrors: this.errors.length,
			criticalErrors: this.errors.filter((e) => e.severity === "error").length,
			warnings: this.errors.filter((e) => e.severity === "warning").length,
			validationResults: this.validationResults.length,
		};
	}
}

/**
 * Quick validation helper for common patterns
 */
const ValidationHelpers = {
	isValidEmail: (email: string): boolean => {
		return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(email);
	},

	isValidPhone: (phone: string): boolean => {
		// E.164 format: +[1-9]\d{1,14}
		return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/\D/g, ""));
	},

	isValidZip: (zip: string): boolean => {
		return /^\d{5}(-\d{4})?$/.test(zip);
	},

	isValidState: (state: string): boolean => {
		const states = [
			"AL",
			"AK",
			"AZ",
			"AR",
			"CA",
			"CO",
			"CT",
			"DE",
			"FL",
			"GA",
			"HI",
			"ID",
			"IL",
			"IN",
			"IA",
			"KS",
			"KY",
			"LA",
			"ME",
			"MD",
			"MA",
			"MI",
			"MN",
			"MS",
			"MO",
			"MT",
			"NE",
			"NV",
			"NH",
			"NJ",
			"NM",
			"NY",
			"NC",
			"ND",
			"OH",
			"OK",
			"OR",
			"PA",
			"RI",
			"SC",
			"SD",
			"TN",
			"TX",
			"UT",
			"VT",
			"VA",
			"WA",
			"WV",
			"WI",
			"WY",
		];
		return states.includes(state.toUpperCase());
	},

	isValidUUID: (uuid: string): boolean => {
		return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
			uuid,
		);
	},
};
