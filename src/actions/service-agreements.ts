/**
 * Service Agreements Server Actions
 *
 * Handles long-term service agreement management with comprehensive CRUD operations,
 * SLA tracking, digital signatures, and contract lifecycle management.
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActiveCompanyId } from "@/lib/auth/company-context";

// Regex constants
const SA_NUMBER_REGEX = /SA-(\d+)/;
import { ActionError, ERROR_CODES } from "@/lib/errors/action-error";
import {
	type ActionResult,
	assertAuthenticated,
	assertExists,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// Validation Schemas
const createServiceAgreementSchema = z.object({
	customerId: z.string().uuid("Invalid customer ID"),
	propertyId: z.string().uuid("Invalid property ID").optional(),
	contractId: z.string().uuid("Invalid contract ID").optional(),
	title: z.string().min(1, "Agreement title is required"),
	description: z.string().optional(),
	startDate: z.string().min(1, "Start date is required"),
	endDate: z.string().min(1, "End date is required"),
	totalValue: z.number().min(0).optional(),
	currency: z.string().default("USD"),
	paymentSchedule: z.enum(["monthly", "quarterly", "semiannual", "annual", "milestone", "one_time"]).optional(),
	monthlyAmount: z.number().min(0).optional(),
	autoRenew: z.boolean().default(false),
	renewalTermMonths: z.number().int().min(1).optional(),
	terms: z.string().optional(),
	scopeOfWork: z.string().optional(),
	deliverables: z.array(z.any()).optional(),
	performanceMetrics: z.record(z.string(), z.any()).optional(),
	responseTimeHours: z.number().int().min(0).optional(),
	resolutionTimeHours: z.number().int().min(0).optional(),
	availabilityPercentage: z.number().min(0).max(100).optional(),
	penaltyTerms: z.string().optional(),
	notes: z.string().optional(),
});

const updateServiceAgreementSchema = z.object({
	title: z.string().min(1, "Agreement title is required").optional(),
	description: z.string().optional(),
	status: z.enum(["draft", "active", "pending_signature", "expired", "terminated", "cancelled"]).optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	totalValue: z.number().min(0).optional(),
	paymentSchedule: z.enum(["monthly", "quarterly", "semiannual", "annual", "milestone", "one_time"]).optional(),
	monthlyAmount: z.number().min(0).optional(),
	autoRenew: z.boolean().optional(),
	renewalTermMonths: z.number().int().min(1).optional(),
	terms: z.string().optional(),
	scopeOfWork: z.string().optional(),
	deliverables: z.array(z.any()).optional(),
	performanceMetrics: z.record(z.string(), z.any()).optional(),
	responseTimeHours: z.number().int().min(0).optional(),
	resolutionTimeHours: z.number().int().min(0).optional(),
	availabilityPercentage: z.number().min(0).max(100).optional(),
	penaltyTerms: z.string().optional(),
	notes: z.string().optional(),
	cancellationReason: z.string().optional(),
});

/**
 * Generate unique service agreement number using database function
 */
async function generateServiceAgreementNumber(supabase: any, companyId: string): Promise<string> {
	const { data, error } = await supabase.rpc("generate_service_agreement_number", {
		p_company_id: companyId,
	});

	if (error || !data) {
		// Fallback to manual generation
		const { data: latestAgreement } = await supabase
			.from("service_agreements")
			.select("agreement_number")
			.eq("company_id", companyId)
			.order("created_at", { ascending: false })
			.limit(1)
			.single();

		if (!latestAgreement) {
			return "SA-000001";
		}

		const match = latestAgreement.agreement_number.match(SA_NUMBER_REGEX);
		if (match) {
			const nextNumber = Number.parseInt(match[1], 10) + 1;
			return `SA-${nextNumber.toString().padStart(6, "0")}`;
		}

		return `SA-${Date.now().toString().slice(-6)}`;
	}

	return data;
}

/**
 * Calculate term in months from dates
 */
function calculateTermMonths(startDate: string, endDate: string): number {
	const start = new Date(startDate);
	const end = new Date(endDate);

	const yearDiff = end.getFullYear() - start.getFullYear();
	const monthDiff = end.getMonth() - start.getMonth();

	return yearDiff * 12 + monthDiff;
}

/**
 * Validate service agreement dates
 */
function validateServiceAgreementDates(startDate: string, endDate: string): void {
	const start = new Date(startDate);
	const end = new Date(endDate);

	if (end <= start) {
		throw new ActionError("End date must be after start date", ERROR_CODES.VALIDATION_FAILED);
	}

	const termMonths = calculateTermMonths(startDate, endDate);
	if (termMonths < 1) {
		throw new ActionError("Agreement must be at least 1 month long", ERROR_CODES.VALIDATION_FAILED);
	}
}

/**
 * Validate SLA times
 */
function validateSLATimes(responseTimeHours?: number, resolutionTimeHours?: number): void {
	if (responseTimeHours !== undefined && resolutionTimeHours !== undefined && resolutionTimeHours < responseTimeHours) {
		throw new ActionError(
			"Resolution time must be greater than or equal to response time",
			ERROR_CODES.VALIDATION_FAILED
		);
	}
}

/**
 * Create a new service agreement
 */
export async function createServiceAgreement(formData: FormData): Promise<ActionResult<string>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const companyId = await getActiveCompanyId();
		assertExists(companyId, "Company not found for user");

		// Parse complex fields
		let deliverables: any[] = [];
		const deliverablesStr = formData.get("deliverables") as string;
		if (deliverablesStr) {
			try {
				deliverables = JSON.parse(deliverablesStr);
			} catch {
				// Ignore parse errors
			}
		}

		let performanceMetrics: Record<string, any> = {};
		const metricsStr = formData.get("performanceMetrics") as string;
		if (metricsStr) {
			try {
				performanceMetrics = JSON.parse(metricsStr);
			} catch {
				// Ignore parse errors
			}
		}

		// Parse and validate form data
		const rawData = {
			customerId: formData.get("customerId") as string,
			propertyId: (formData.get("propertyId") as string) || undefined,
			contractId: (formData.get("contractId") as string) || undefined,
			title: formData.get("title") as string,
			description: (formData.get("description") as string) || undefined,
			startDate: formData.get("startDate") as string,
			endDate: formData.get("endDate") as string,
			totalValue: formData.get("totalValue") ? Number.parseFloat(formData.get("totalValue") as string) : undefined,
			currency: (formData.get("currency") as string) || "USD",
			paymentSchedule: (formData.get("paymentSchedule") as string) || undefined,
			monthlyAmount: formData.get("monthlyAmount")
				? Number.parseFloat(formData.get("monthlyAmount") as string)
				: undefined,
			autoRenew: formData.get("autoRenew") === "true",
			renewalTermMonths: formData.get("renewalTermMonths")
				? Number.parseInt(formData.get("renewalTermMonths") as string, 10)
				: undefined,
			terms: (formData.get("terms") as string) || undefined,
			scopeOfWork: (formData.get("scopeOfWork") as string) || undefined,
			deliverables,
			performanceMetrics,
			responseTimeHours: formData.get("responseTimeHours")
				? Number.parseInt(formData.get("responseTimeHours") as string, 10)
				: undefined,
			resolutionTimeHours: formData.get("resolutionTimeHours")
				? Number.parseInt(formData.get("resolutionTimeHours") as string, 10)
				: undefined,
			availabilityPercentage: formData.get("availabilityPercentage")
				? Number.parseFloat(formData.get("availabilityPercentage") as string)
				: undefined,
			penaltyTerms: (formData.get("penaltyTerms") as string) || undefined,
			notes: (formData.get("notes") as string) || undefined,
		};

		const validatedData = createServiceAgreementSchema.parse(rawData);

		// Validate dates
		validateServiceAgreementDates(validatedData.startDate, validatedData.endDate);

		// Validate SLA times
		validateSLATimes(validatedData.responseTimeHours, validatedData.resolutionTimeHours);

		// Calculate term months
		const termMonths = calculateTermMonths(validatedData.startDate, validatedData.endDate);

		// Generate agreement number
		const agreementNumber = await generateServiceAgreementNumber(supabase, companyId);

		// Create service agreement
		const { data: agreement, error } = await supabase
			.from("service_agreements")
			.insert({
				company_id: companyId,
				customer_id: validatedData.customerId,
				property_id: validatedData.propertyId,
				contract_id: validatedData.contractId,
				agreement_number: agreementNumber,
				title: validatedData.title,
				description: validatedData.description,
				start_date: validatedData.startDate,
				end_date: validatedData.endDate,
				term_months: termMonths,
				total_value: validatedData.totalValue,
				currency: validatedData.currency,
				payment_schedule: validatedData.paymentSchedule,
				monthly_amount: validatedData.monthlyAmount,
				auto_renew: validatedData.autoRenew,
				renewal_term_months: validatedData.renewalTermMonths,
				terms: validatedData.terms,
				scope_of_work: validatedData.scopeOfWork,
				deliverables: validatedData.deliverables,
				performance_metrics: validatedData.performanceMetrics,
				response_time_hours: validatedData.responseTimeHours,
				resolution_time_hours: validatedData.resolutionTimeHours,
				availability_percentage: validatedData.availabilityPercentage,
				penalty_terms: validatedData.penaltyTerms,
				notes: validatedData.notes,
				status: "draft",
				created_by: user.id,
			})
			.select("id")
			.single();

		if (error) {
			throw new ActionError(`Failed to create service agreement: ${error.message}`, ERROR_CODES.DB_QUERY_ERROR);
		}

		// Revalidate relevant paths
		revalidatePath("/dashboard/work/service-agreements");
		revalidatePath("/dashboard/customers");

		return agreement.id;
	});
}

/**
 * Update an existing service agreement
 */
export async function updateServiceAgreement(agreementId: string, formData: FormData): Promise<ActionResult<boolean>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const companyId = await getActiveCompanyId();
		assertExists(companyId, "Company not found for user");

		// Verify agreement exists and belongs to company
		const { data: existingAgreement, error: fetchError } = await supabase
			.from("service_agreements")
			.select("id, company_id, start_date, end_date")
			.eq("id", agreementId)
			.eq("company_id", companyId)
			.single();

		if (fetchError || !existingAgreement) {
			throw new ActionError("Service agreement not found", ERROR_CODES.DB_RECORD_NOT_FOUND);
		}

		// Parse and validate form data
		const rawData: any = {};
		const numericFields = [
			"totalValue",
			"monthlyAmount",
			"renewalTermMonths",
			"responseTimeHours",
			"resolutionTimeHours",
			"availabilityPercentage",
		];
		const jsonFields = ["deliverables", "performanceMetrics"];
		const booleanFields = ["autoRenew"];

		// Get all form data
		formData.forEach((value, key) => {
			if (value !== null && value !== "" && value !== undefined) {
				if (numericFields.includes(key)) {
					rawData[key] =
						key.includes("Months") || key.includes("Hours")
							? Number.parseInt(value as string, 10)
							: Number.parseFloat(value as string);
				} else if (jsonFields.includes(key)) {
					try {
						rawData[key] = JSON.parse(value as string);
					} catch {
						// Ignore parse errors
					}
				} else if (booleanFields.includes(key)) {
					rawData[key] = value === "true";
				} else {
					rawData[key] = value;
				}
			}
		});

		const validatedData = updateServiceAgreementSchema.parse(rawData);

		// Validate dates if both are provided
		if (validatedData.startDate && validatedData.endDate) {
			validateServiceAgreementDates(validatedData.startDate, validatedData.endDate);
		}

		// Validate SLA times if provided
		if (validatedData.responseTimeHours !== undefined || validatedData.resolutionTimeHours !== undefined) {
			validateSLATimes(validatedData.responseTimeHours, validatedData.resolutionTimeHours);
		}

		// Calculate term months if dates changed
		let termMonths: number | undefined;
		if (validatedData.startDate && validatedData.endDate) {
			termMonths = calculateTermMonths(validatedData.startDate, validatedData.endDate);
		}

		// Convert camelCase to snake_case for database
		const dbUpdateData: any = {};
		Object.entries(validatedData).forEach(([key, value]) => {
			const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
			dbUpdateData[snakeKey] = value;
		});

		if (termMonths) {
			dbUpdateData.term_months = termMonths;
		}

		// Update service agreement
		const { error } = await supabase
			.from("service_agreements")
			.update(dbUpdateData)
			.eq("id", agreementId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(`Failed to update service agreement: ${error.message}`, ERROR_CODES.DB_QUERY_ERROR);
		}

		// Revalidate relevant paths
		revalidatePath("/dashboard/work/service-agreements");
		revalidatePath(`/dashboard/work/service-agreements/${agreementId}`);

		return true;
	});
}

/**
 * Sign a service agreement
 */
export async function signServiceAgreement(
	agreementId: string,
	signedByCustomerName: string,
	signedByCompanyName: string,
	signedDocumentUrl?: string
): Promise<ActionResult<boolean>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const companyId = await getActiveCompanyId();
		assertExists(companyId, "Company not found for user");

		// Update agreement with signature info
		const { error } = await supabase
			.from("service_agreements")
			.update({
				status: "active",
				signed_at: new Date().toISOString(),
				signed_by_customer_name: signedByCustomerName,
				signed_by_company_name: signedByCompanyName,
				signed_document_url: signedDocumentUrl,
			})
			.eq("id", agreementId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(`Failed to sign service agreement: ${error.message}`, ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/work/service-agreements");
		revalidatePath(`/dashboard/work/service-agreements/${agreementId}`);

		return true;
	});
}

/**
 * Terminate a service agreement
 */
export async function terminateServiceAgreement(
	agreementId: string,
	terminationReason: string
): Promise<ActionResult<boolean>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const companyId = await getActiveCompanyId();
		assertExists(companyId, "Company not found for user");

		// Update agreement status to terminated
		const { error } = await supabase
			.from("service_agreements")
			.update({
				status: "terminated",
				cancellation_reason: terminationReason,
				termination_date: new Date().toISOString().split("T")[0],
			})
			.eq("id", agreementId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(`Failed to terminate service agreement: ${error.message}`, ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/work/service-agreements");
		revalidatePath(`/dashboard/work/service-agreements/${agreementId}`);

		return true;
	});
}

/**
 * Delete a service agreement
 */
export async function deleteServiceAgreement(agreementId: string): Promise<ActionResult<boolean>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const companyId = await getActiveCompanyId();
		assertExists(companyId, "Company not found for user");

		// Delete service agreement
		const { error } = await supabase
			.from("service_agreements")
			.delete()
			.eq("id", agreementId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(`Failed to delete service agreement: ${error.message}`, ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/work/service-agreements");

		return true;
	});
}

/**
 * Search service agreements
 */
export async function searchServiceAgreements(
	searchQuery: string,
	options?: {
		limit?: number;
		offset?: number;
	}
): Promise<ActionResult<any[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const companyId = await getActiveCompanyId();
		assertExists(companyId, "Company not found for user");

		// Use the RPC function for ranked search
		const { data, error } = await supabase.rpc("search_service_agreements_ranked", {
			p_company_id: companyId,
			p_search_query: searchQuery,
			p_limit: options?.limit || 50,
			p_offset: options?.offset || 0,
		});

		if (error) {
			throw new ActionError(`Search failed: ${error.message}`, ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || [];
	});
}

/**
 * Archive a service agreement (soft delete)
 */
export async function archiveServiceAgreement(agreementId: string): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Unauthorized" };
		}

		const { error } = await supabase
			.from("service_agreements")
			.update({
				deleted_at: new Date().toISOString(),
			})
			.eq("id", agreementId);

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath("/dashboard/work/service-agreements");
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
