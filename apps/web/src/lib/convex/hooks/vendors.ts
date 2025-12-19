"use client";

/**
 * Vendor Hooks for Convex
 *
 * Provides React hooks for vendor operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List vendors for a company
 */
export function useVendors(
  args:
    | {
        companyId: Id<"companies">;
        status?: "active" | "inactive";
        category?: "supplier" | "distributor" | "manufacturer" | "service_provider" | "other";
        limit?: number;
      }
    | "skip"
) {
  return useQuery(api.vendors.list, args === "skip" ? "skip" : args);
}

/**
 * Get a single vendor by ID
 */
export function useVendor(args: { id: Id<"vendors"> }) {
  return useQuery(api.vendors.get, args);
}

/**
 * Get complete vendor data
 */
export function useVendorComplete(args: { id: Id<"vendors"> }) {
  return useQuery(api.vendors.getComplete, args);
}

/**
 * Get vendor by vendor number
 */
export function useVendorByVendorNumber(args: {
  companyId: Id<"companies">;
  vendorNumber: string;
}) {
  return useQuery(api.vendors.getByVendorNumber, args);
}

/**
 * Get active vendors
 */
export function useActiveVendors(args: {
  companyId: Id<"companies">;
  category?: "supplier" | "distributor" | "manufacturer" | "service_provider" | "other";
}) {
  return useQuery(api.vendors.getActive, args);
}

/**
 * Get vendor statistics
 */
export function useVendorStats(
  args: { companyId: Id<"companies"> } | "skip"
) {
  return useQuery(api.vendors.getStats, args === "skip" ? "skip" : args);
}

/**
 * Search vendors
 */
export function useSearchVendors(args: {
  companyId: Id<"companies">;
  searchQuery: string;
  status?: "active" | "inactive";
  limit?: number;
}) {
  return useQuery(api.vendors.search, args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new vendor
 */
export function useCreateVendor() {
  return useMutation(api.vendors.create);
}

/**
 * Update a vendor
 */
export function useUpdateVendor() {
  return useMutation(api.vendors.update);
}

/**
 * Update vendor payment terms
 */
export function useUpdateVendorPaymentTerms() {
  return useMutation(api.vendors.updatePaymentTerms);
}

/**
 * Activate a vendor
 */
export function useActivateVendor() {
  return useMutation(api.vendors.activate);
}

/**
 * Deactivate a vendor
 */
export function useDeactivateVendor() {
  return useMutation(api.vendors.deactivate);
}

/**
 * Archive a vendor
 */
export function useArchiveVendor() {
  return useMutation(api.vendors.archive);
}

/**
 * Unarchive a vendor
 */
export function useUnarchiveVendor() {
  return useMutation(api.vendors.unarchive);
}

/**
 * Delete a vendor (soft delete)
 */
export function useDeleteVendor() {
  return useMutation(api.vendors.remove);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
