"use client";

/**
 * Estimate Hooks for Convex
 *
 * Provides React hooks for estimate operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List estimates for a company
 */
export function useEstimates(
  args:
    | {
        companyId: Id<"companies">;
        status?: "draft" | "sent" | "viewed" | "accepted" | "declined" | "expired";
        customerId?: Id<"customers">;
        jobId?: Id<"jobs">;
        includeArchived?: boolean;
        limit?: number;
      }
    | "skip"
) {
  return useQuery(api.estimates.list, args === "skip" ? "skip" : args);
}

/**
 * Get a single estimate by ID
 */
export function useEstimate(args: { estimateId: Id<"estimates"> }) {
  return useQuery(api.estimates.get, args);
}

/**
 * Get complete estimate data with related entities
 */
export function useEstimateComplete(args: { estimateId: Id<"estimates"> }) {
  return useQuery(api.estimates.getComplete, args);
}

/**
 * Get pending estimates
 */
export function usePendingEstimates(args: {
  companyId: Id<"companies">;
  limit?: number;
}) {
  return useQuery(api.estimates.getPending, args);
}

/**
 * Get estimate statistics
 */
export function useEstimateStats(
  args: { companyId: Id<"companies"> } | "skip"
) {
  return useQuery(api.estimates.getStats, args === "skip" ? "skip" : args);
}

/**
 * Search estimates
 */
export function useSearchEstimates(args: {
  companyId: Id<"companies">;
  searchTerm: string;
  limit?: number;
}) {
  return useQuery(api.estimates.search, args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new estimate
 */
export function useCreateEstimate() {
  return useMutation(api.estimates.create);
}

/**
 * Update an estimate
 */
export function useUpdateEstimate() {
  return useMutation(api.estimates.update);
}

/**
 * Send estimate for approval
 */
export function useSendEstimate() {
  return useMutation(api.estimates.send);
}

/**
 * Mark estimate as viewed
 */
export function useMarkEstimateViewed() {
  return useMutation(api.estimates.markViewed);
}

/**
 * Accept an estimate
 */
export function useAcceptEstimate() {
  return useMutation(api.estimates.accept);
}

/**
 * Decline an estimate
 */
export function useDeclineEstimate() {
  return useMutation(api.estimates.decline);
}

/**
 * Expire an estimate
 */
export function useExpireEstimate() {
  return useMutation(api.estimates.expire);
}

/**
 * Convert estimate to invoice
 */
export function useConvertEstimateToInvoice() {
  return useMutation(api.estimates.convertToInvoice);
}

/**
 * Duplicate an estimate
 */
export function useDuplicateEstimate() {
  return useMutation(api.estimates.duplicate);
}

/**
 * Archive an estimate
 */
export function useArchiveEstimate() {
  return useMutation(api.estimates.archive);
}

/**
 * Unarchive an estimate
 */
export function useUnarchiveEstimate() {
  return useMutation(api.estimates.unarchive);
}

/**
 * Delete an estimate (soft delete)
 */
export function useDeleteEstimate() {
  return useMutation(api.estimates.remove);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
