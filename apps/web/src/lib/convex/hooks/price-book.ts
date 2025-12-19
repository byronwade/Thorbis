"use client";

/**
 * Price Book Hooks for Convex
 *
 * Provides React hooks for price book item operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List price book items for a company
 */
export function usePriceBookItems(
  args:
    | {
        companyId: Id<"companies">;
        type?: "service" | "material" | "labor" | "equipment" | "flat_rate";
        category?: string;
        isActive?: boolean;
        trackInventory?: boolean;
        limit?: number;
        cursor?: string;
      }
    | "skip"
) {
  return useQuery(api.priceBook.list, args === "skip" ? "skip" : args);
}

/**
 * Get a single price book item by ID
 */
export function usePriceBookItem(args: { id: Id<"priceBookItems"> }) {
  return useQuery(api.priceBook.get, args);
}

/**
 * Get complete price book item data
 */
export function usePriceBookItemComplete(args: { id: Id<"priceBookItems"> }) {
  return useQuery(api.priceBook.getComplete, args);
}

/**
 * Get price book item by SKU
 */
export function usePriceBookItemBySku(args: {
  companyId: Id<"companies">;
  sku: string;
}) {
  return useQuery(api.priceBook.getBySku, args);
}

/**
 * Get price book items by type
 */
export function usePriceBookItemsByType(args: {
  companyId: Id<"companies">;
  type: "service" | "material" | "labor" | "equipment" | "flat_rate";
  activeOnly?: boolean;
  limit?: number;
}) {
  return useQuery(api.priceBook.getByType, args);
}

/**
 * Get price book item categories
 */
export function usePriceBookCategories(args: { companyId: Id<"companies"> }) {
  return useQuery(api.priceBook.getCategories, args);
}

/**
 * Get price book statistics
 */
export function usePriceBookStats(
  args: { companyId: Id<"companies"> } | "skip"
) {
  return useQuery(api.priceBook.getStats, args === "skip" ? "skip" : args);
}

/**
 * Search price book items
 */
export function useSearchPriceBookItems(args: {
  companyId: Id<"companies">;
  searchQuery: string;
  type?: "service" | "material" | "labor" | "equipment" | "flat_rate";
  category?: string;
  isActive?: boolean;
  limit?: number;
}) {
  return useQuery(api.priceBook.search, args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new price book item
 */
export function useCreatePriceBookItem() {
  return useMutation(api.priceBook.create);
}

/**
 * Update a price book item
 */
export function useUpdatePriceBookItem() {
  return useMutation(api.priceBook.update);
}

/**
 * Update price book item price
 */
export function useUpdatePriceBookItemPrice() {
  return useMutation(api.priceBook.updatePrice);
}

/**
 * Bulk price adjustment
 */
export function useBulkPriceAdjust() {
  return useMutation(api.priceBook.bulkPriceAdjust);
}

/**
 * Activate a price book item
 */
export function useActivatePriceBookItem() {
  return useMutation(api.priceBook.activate);
}

/**
 * Deactivate a price book item
 */
export function useDeactivatePriceBookItem() {
  return useMutation(api.priceBook.deactivate);
}

/**
 * Duplicate a price book item
 */
export function useDuplicatePriceBookItem() {
  return useMutation(api.priceBook.duplicate);
}

/**
 * Archive a price book item
 */
export function useArchivePriceBookItem() {
  return useMutation(api.priceBook.archive);
}

/**
 * Unarchive a price book item
 */
export function useUnarchivePriceBookItem() {
  return useMutation(api.priceBook.unarchive);
}

/**
 * Delete a price book item (soft delete)
 */
export function useDeletePriceBookItem() {
  return useMutation(api.priceBook.remove);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
