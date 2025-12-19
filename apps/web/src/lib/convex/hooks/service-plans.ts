"use client";

/**
 * Service Plan Hooks for Convex
 *
 * Provides React hooks for service plan operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List service plans for a company
 */
export function useServicePlans(
  args:
    | {
        companyId: Id<"companies">;
        status?: "draft" | "active" | "paused" | "cancelled" | "expired" | "completed";
        customerId?: Id<"customers">;
        type?: "preventive" | "warranty" | "subscription" | "contract";
        includeArchived?: boolean;
        limit?: number;
      }
    | "skip"
) {
  return useQuery(api.servicePlans.list, args === "skip" ? "skip" : args);
}

/**
 * Get a single service plan by ID
 */
export function useServicePlan(args: { planId: Id<"servicePlans"> }) {
  return useQuery(api.servicePlans.get, args);
}

/**
 * Get complete service plan data
 */
export function useServicePlanComplete(args: { planId: Id<"servicePlans"> }) {
  return useQuery(api.servicePlans.getComplete, args);
}

/**
 * Get service plans for a customer
 */
export function useServicePlansByCustomer(args: {
  customerId: Id<"customers">;
  activeOnly?: boolean;
}) {
  return useQuery(api.servicePlans.getByCustomer, args);
}

/**
 * Get service plans due for service
 */
export function useServicePlansDueForService(args: {
  companyId: Id<"companies">;
  daysAhead?: number;
  includeOverdue?: boolean;
  limit?: number;
}) {
  return useQuery(api.servicePlans.getDueForService, args);
}

/**
 * Get service plan statistics
 */
export function useServicePlanStats(
  args: { companyId: Id<"companies"> } | "skip"
) {
  return useQuery(api.servicePlans.getStats, args === "skip" ? "skip" : args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new service plan
 */
export function useCreateServicePlan() {
  return useMutation(api.servicePlans.create);
}

/**
 * Update a service plan
 */
export function useUpdateServicePlan() {
  return useMutation(api.servicePlans.update);
}

/**
 * Activate a service plan
 */
export function useActivateServicePlan() {
  return useMutation(api.servicePlans.activate);
}

/**
 * Pause a service plan
 */
export function usePauseServicePlan() {
  return useMutation(api.servicePlans.pause);
}

/**
 * Resume a paused service plan
 */
export function useResumeServicePlan() {
  return useMutation(api.servicePlans.resume);
}

/**
 * Cancel a service plan
 */
export function useCancelServicePlan() {
  return useMutation(api.servicePlans.cancel);
}

/**
 * Complete a service plan
 */
export function useCompleteServicePlan() {
  return useMutation(api.servicePlans.complete);
}

/**
 * Renew a service plan
 */
export function useRenewServicePlan() {
  return useMutation(api.servicePlans.renew);
}

/**
 * Record a service visit
 */
export function useRecordServiceVisit() {
  return useMutation(api.servicePlans.recordVisit);
}

/**
 * Archive a service plan
 */
export function useArchiveServicePlan() {
  return useMutation(api.servicePlans.archive);
}

/**
 * Unarchive a service plan
 */
export function useUnarchiveServicePlan() {
  return useMutation(api.servicePlans.unarchive);
}

/**
 * Delete a service plan (soft delete)
 */
export function useDeleteServicePlan() {
  return useMutation(api.servicePlans.remove);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
