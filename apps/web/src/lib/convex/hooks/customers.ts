"use client";

/**
 * Customer Hooks for Convex
 *
 * Provides React hooks for customer operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List customers for a company
 */
export function useCustomers(
  args:
    | {
        companyId: Id<"companies">;
        status?: "active" | "inactive" | "archived" | "blocked";
        type?: "residential" | "commercial" | "industrial";
        includeArchived?: boolean;
        limit?: number;
      }
    | "skip"
) {
  return useQuery(api.customers.list, args === "skip" ? "skip" : args);
}

/**
 * Get a single customer by ID
 */
export function useCustomer(args: { customerId: Id<"customers"> }) {
  return useQuery(api.customers.get, args);
}

/**
 * Get complete customer data with related entities
 */
export function useCustomerWithRelations(args: { customerId: Id<"customers"> }) {
  return useQuery(api.customers.getWithRelations, args);
}

/**
 * Search customers
 */
export function useSearchCustomers(args: {
  companyId: Id<"companies">;
  query: string;
  limit?: number;
}) {
  return useQuery(api.customers.search, args);
}

/**
 * Get customer statistics
 */
export function useCustomerStats(
  args: { companyId: Id<"companies"> } | "skip"
) {
  return useQuery(api.customers.getStats, args === "skip" ? "skip" : args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new customer
 */
export function useCreateCustomer() {
  return useMutation(api.customers.create);
}

/**
 * Update a customer
 */
export function useUpdateCustomer() {
  return useMutation(api.customers.update);
}

/**
 * Archive a customer
 */
export function useArchiveCustomer() {
  return useMutation(api.customers.archive);
}

/**
 * Restore an archived customer
 */
export function useRestoreCustomer() {
  return useMutation(api.customers.restore);
}

/**
 * Delete a customer (soft delete)
 */
export function useDeleteCustomer() {
  return useMutation(api.customers.remove);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
