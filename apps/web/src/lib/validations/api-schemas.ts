/**
 * API Request/Response Validation Schemas
 *
 * Zod schemas for validating API route requests and responses.
 * These are used in API route handlers to ensure type safety.
 */

import { z } from "zod";
import { uuidSchema } from "./form-schemas";

// ============================================================================
// Common API Schemas
// ============================================================================

import { PAGINATION } from "@stratos/shared/constants";

export const paginationSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(PAGINATION.minPageSize).max(PAGINATION.maxPageSize).default(PAGINATION.defaultPageSize),
});

export const searchSchema = z.object({
	query: z.string().min(1).max(200).optional(),
});

export const dateRangeSchema = z.object({
	startDate: z.string().datetime().optional(),
	endDate: z.string().datetime().optional(),
});

// ============================================================================
// API Request Schemas
// ============================================================================

export const apiActionSchema = z.object({
	action: z.string().min(1),
});

export const idParamSchema = z.object({
	id: uuidSchema,
});

export const companyIdParamSchema = z.object({
	companyId: uuidSchema,
});

// ============================================================================
// Export Types
// ============================================================================

export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
export type ApiActionInput = z.infer<typeof apiActionSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
export type CompanyIdParamInput = z.infer<typeof companyIdParamSchema>;

