"use client";

/**
 * Tag Hooks for Convex
 *
 * Provides React hooks for tag operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List tags for a company
 */
export function useTags(args: {
  companyId: Id<"companies">;
  category?: "customer" | "job" | "equipment" | "general" | "status" | "priority";
  isActive?: boolean;
  limit?: number;
}) {
  return useQuery(api.tags.list, args);
}

/**
 * Get a single tag by ID
 */
export function useTag(args: { id: Id<"tags"> }) {
  return useQuery(api.tags.get, args);
}

/**
 * Get tag by slug
 */
export function useTagBySlug(args: {
  companyId: Id<"companies">;
  slug: string;
}) {
  return useQuery(api.tags.getBySlug, args);
}

/**
 * Get tags by category
 */
export function useTagsByCategory(args: {
  companyId: Id<"companies">;
  category: "customer" | "job" | "equipment" | "general" | "status" | "priority";
}) {
  return useQuery(api.tags.getByCategory, args);
}

/**
 * Get popular tags
 */
export function usePopularTags(args: {
  companyId: Id<"companies">;
  category?: "customer" | "job" | "equipment" | "general" | "status" | "priority";
  limit?: number;
}) {
  return useQuery(api.tags.getPopular, args);
}

/**
 * Get recently used tags
 */
export function useRecentlyUsedTags(args: {
  companyId: Id<"companies">;
  category?: "customer" | "job" | "equipment" | "general" | "status" | "priority";
  limit?: number;
}) {
  return useQuery(api.tags.getRecentlyUsed, args);
}

/**
 * Get tag statistics
 */
export function useTagStats(args: { companyId: Id<"companies"> }) {
  return useQuery(api.tags.getStats, args);
}

/**
 * Search tags
 */
export function useSearchTags(args: {
  companyId: Id<"companies">;
  searchQuery: string;
  category?: "customer" | "job" | "equipment" | "general" | "status" | "priority";
  limit?: number;
}) {
  return useQuery(api.tags.search, args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new tag
 */
export function useCreateTag() {
  return useMutation(api.tags.create);
}

/**
 * Update a tag
 */
export function useUpdateTag() {
  return useMutation(api.tags.update);
}

/**
 * Record tag usage
 */
export function useRecordTagUsage() {
  return useMutation(api.tags.recordUsage);
}

/**
 * Decrement tag usage
 */
export function useDecrementTagUsage() {
  return useMutation(api.tags.decrementUsage);
}

/**
 * Activate a tag
 */
export function useActivateTag() {
  return useMutation(api.tags.activate);
}

/**
 * Deactivate a tag
 */
export function useDeactivateTag() {
  return useMutation(api.tags.deactivate);
}

/**
 * Merge tags
 */
export function useMergeTags() {
  return useMutation(api.tags.merge);
}

/**
 * Delete a tag (soft delete)
 */
export function useDeleteTag() {
  return useMutation(api.tags.remove);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
