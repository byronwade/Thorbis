"use client";

/**
 * Equipment Hooks for Convex
 *
 * Provides React hooks for equipment operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List equipment for a company
 */
export function useEquipment(
  args:
    | {
        companyId: Id<"companies">;
        type?: "hvac" | "plumbing" | "electrical" | "appliance" | "water_heater" | "furnace" | "ac_unit" | "other";
        status?: "active" | "inactive" | "retired" | "replaced";
        customerId?: Id<"customers">;
        propertyId?: Id<"properties">;
        includeArchived?: boolean;
        limit?: number;
      }
    | "skip"
) {
  return useQuery(api.equipment.list, args === "skip" ? "skip" : args);
}

/**
 * Get a single equipment item by ID
 */
export function useEquipmentItem(args: { equipmentId: Id<"equipment"> }) {
  return useQuery(api.equipment.get, args);
}

/**
 * Get complete equipment data with related entities
 */
export function useEquipmentComplete(args: { equipmentId: Id<"equipment"> }) {
  return useQuery(api.equipment.getComplete, args);
}

/**
 * Get equipment for a property
 */
export function useEquipmentByProperty(args: {
  propertyId: Id<"properties">;
  limit?: number;
}) {
  return useQuery(api.equipment.getByProperty, args);
}

/**
 * Get equipment for a customer
 */
export function useEquipmentByCustomer(args: {
  customerId: Id<"customers">;
  limit?: number;
}) {
  return useQuery(api.equipment.getByCustomer, args);
}

/**
 * Get equipment due for service
 */
export function useEquipmentServiceDue(args: {
  companyId: Id<"companies">;
  daysAhead?: number;
  limit?: number;
}) {
  return useQuery(api.equipment.getServiceDue, args);
}

/**
 * Get equipment statistics
 */
export function useEquipmentStats(
  args: { companyId: Id<"companies"> } | "skip"
) {
  return useQuery(api.equipment.getStats, args === "skip" ? "skip" : args);
}

/**
 * Search equipment
 */
export function useSearchEquipment(args: {
  companyId: Id<"companies">;
  searchTerm: string;
  limit?: number;
}) {
  return useQuery(api.equipment.search, args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create new equipment
 */
export function useCreateEquipment() {
  return useMutation(api.equipment.create);
}

/**
 * Update equipment
 */
export function useUpdateEquipment() {
  return useMutation(api.equipment.update);
}

/**
 * Update equipment status
 */
export function useUpdateEquipmentStatus() {
  return useMutation(api.equipment.updateStatus);
}

/**
 * Update equipment condition
 */
export function useUpdateEquipmentCondition() {
  return useMutation(api.equipment.updateCondition);
}

/**
 * Record service for equipment
 */
export function useRecordEquipmentService() {
  return useMutation(api.equipment.recordService);
}

/**
 * Archive equipment
 */
export function useArchiveEquipment() {
  return useMutation(api.equipment.archive);
}

/**
 * Unarchive equipment
 */
export function useUnarchiveEquipment() {
  return useMutation(api.equipment.unarchive);
}

/**
 * Delete equipment (soft delete)
 */
export function useDeleteEquipment() {
  return useMutation(api.equipment.remove);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
