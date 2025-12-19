"use client";

/**
 * Property Hooks for Convex
 *
 * Provides React hooks for property operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List properties for a company
 */
export function useProperties(
  args:
    | {
        companyId: Id<"companies">;
        customerId?: Id<"customers">;
        activeOnly?: boolean;
        includeArchived?: boolean;
        limit?: number;
      }
    | "skip"
) {
  return useQuery(api.properties.list, args === "skip" ? "skip" : args);
}

/**
 * Get a single property by ID
 */
export function useProperty(args: { propertyId: Id<"properties"> }) {
  return useQuery(api.properties.get, args);
}

/**
 * Get complete property data with related entities
 */
export function usePropertyComplete(args: { propertyId: Id<"properties"> }) {
  return useQuery(api.properties.getComplete, args);
}

/**
 * Get properties for a customer
 */
export function usePropertiesByCustomer(args: {
  customerId: Id<"customers">;
  includeInactive?: boolean;
}) {
  return useQuery(api.properties.getByCustomer, args);
}

/**
 * Search properties
 */
export function useSearchProperties(args: {
  companyId: Id<"companies">;
  searchTerm: string;
  limit?: number;
}) {
  return useQuery(api.properties.search, args);
}

/**
 * Get property statistics
 */
export function usePropertyStats(
  args: { companyId: Id<"companies"> } | "skip"
) {
  return useQuery(api.properties.getStats, args === "skip" ? "skip" : args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new property
 */
export function useCreateProperty() {
  return useMutation(api.properties.create);
}

/**
 * Update a property
 */
export function useUpdateProperty() {
  return useMutation(api.properties.update);
}

/**
 * Set a property as primary for its customer
 */
export function useSetPropertyAsPrimary() {
  return useMutation(api.properties.setAsPrimary);
}

/**
 * Archive a property
 */
export function useArchiveProperty() {
  return useMutation(api.properties.archive);
}

/**
 * Unarchive a property
 */
export function useUnarchiveProperty() {
  return useMutation(api.properties.unarchive);
}

/**
 * Delete a property (soft delete)
 */
export function useDeleteProperty() {
  return useMutation(api.properties.remove);
}

/**
 * Update property location (lat/lng)
 */
export function useUpdatePropertyLocation() {
  return useMutation(api.properties.updateLocation);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
