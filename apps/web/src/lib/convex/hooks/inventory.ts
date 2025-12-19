"use client";

/**
 * Inventory Hooks for Convex
 *
 * Provides React hooks for inventory operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List inventory items for a company
 */
export function useInventory(
  args:
    | {
        companyId: Id<"companies">;
        status?: "active" | "discontinued" | "on_order";
        isLowStock?: boolean;
        limit?: number;
      }
    | "skip"
) {
  return useQuery(api.inventory.list, args === "skip" ? "skip" : args);
}

/**
 * Get a single inventory item by ID
 */
export function useInventoryItem(args: { id: Id<"inventory"> }) {
  return useQuery(api.inventory.get, args);
}

/**
 * Get complete inventory item data
 */
export function useInventoryItemComplete(args: { id: Id<"inventory"> }) {
  return useQuery(api.inventory.getComplete, args);
}

/**
 * Get inventory by price book item
 */
export function useInventoryByPriceBookItem(args: {
  priceBookItemId: Id<"priceBookItems">;
}) {
  return useQuery(api.inventory.getByPriceBookItem, args);
}

/**
 * Get low stock inventory
 */
export function useLowStockInventory(args: {
  companyId: Id<"companies">;
  limit?: number;
}) {
  return useQuery(api.inventory.getLowStock, args);
}

/**
 * Get inventory needing reorder
 */
export function useInventoryNeedingReorder(args: {
  companyId: Id<"companies">;
  limit?: number;
}) {
  return useQuery(api.inventory.getNeedingReorder, args);
}

/**
 * Get inventory by location
 */
export function useInventoryByLocation(args: {
  companyId: Id<"companies">;
  location: string;
}) {
  return useQuery(api.inventory.getByLocation, args);
}

/**
 * Get inventory statistics
 */
export function useInventoryStats(
  args: { companyId: Id<"companies"> } | "skip"
) {
  return useQuery(api.inventory.getStats, args === "skip" ? "skip" : args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new inventory item
 */
export function useCreateInventoryItem() {
  return useMutation(api.inventory.create);
}

/**
 * Update an inventory item
 */
export function useUpdateInventoryItem() {
  return useMutation(api.inventory.update);
}

/**
 * Adjust stock quantity
 */
export function useAdjustStock() {
  return useMutation(api.inventory.adjustStock);
}

/**
 * Reserve stock
 */
export function useReserveStock() {
  return useMutation(api.inventory.reserveStock);
}

/**
 * Release reserved stock
 */
export function useReleaseReservedStock() {
  return useMutation(api.inventory.releaseReservedStock);
}

/**
 * Consume reserved stock
 */
export function useConsumeReservedStock() {
  return useMutation(api.inventory.consumeReservedStock);
}

/**
 * Perform stock check
 */
export function usePerformStockCheck() {
  return useMutation(api.inventory.performStockCheck);
}

/**
 * Mark low stock alert as sent
 */
export function useMarkLowStockAlertSent() {
  return useMutation(api.inventory.markLowStockAlertSent);
}

/**
 * Update inventory status
 */
export function useUpdateInventoryStatus() {
  return useMutation(api.inventory.updateStatus);
}

/**
 * Delete inventory item (soft delete)
 */
export function useDeleteInventoryItem() {
  return useMutation(api.inventory.remove);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
