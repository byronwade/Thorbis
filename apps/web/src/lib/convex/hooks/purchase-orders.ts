"use client";

/**
 * Purchase Order Hooks for Convex
 *
 * Provides React hooks for purchase order operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List purchase orders for a company
 */
export function usePurchaseOrders(
  args:
    | {
        companyId: Id<"companies">;
        status?: "draft" | "pending_approval" | "approved" | "ordered" | "partially_received" | "received" | "cancelled";
        vendorId?: Id<"vendors">;
        jobId?: Id<"jobs">;
        limit?: number;
      }
    | "skip"
) {
  return useQuery(api.purchaseOrders.list, args === "skip" ? "skip" : args);
}

/**
 * Get a single purchase order by ID
 */
export function usePurchaseOrder(args: { id: Id<"purchaseOrders"> }) {
  return useQuery(api.purchaseOrders.get, args);
}

/**
 * Get complete purchase order data
 */
export function usePurchaseOrderComplete(args: { id: Id<"purchaseOrders"> }) {
  return useQuery(api.purchaseOrders.getComplete, args);
}

/**
 * Get purchase order by PO number
 */
export function usePurchaseOrderByPoNumber(args: {
  companyId: Id<"companies">;
  poNumber: string;
}) {
  return useQuery(api.purchaseOrders.getByPoNumber, args);
}

/**
 * Get purchase orders pending approval
 */
export function usePurchaseOrdersPendingApproval(args: {
  companyId: Id<"companies">;
  limit?: number;
}) {
  return useQuery(api.purchaseOrders.getPendingApproval, args);
}

/**
 * Get purchase orders awaiting delivery
 */
export function usePurchaseOrdersAwaitingDelivery(args: {
  companyId: Id<"companies">;
  limit?: number;
}) {
  return useQuery(api.purchaseOrders.getAwaitingDelivery, args);
}

/**
 * Get purchase orders by vendor
 */
export function usePurchaseOrdersByVendor(args: {
  vendorId: Id<"vendors">;
  limit?: number;
}) {
  return useQuery(api.purchaseOrders.getByVendor, args);
}

/**
 * Get purchase order statistics
 */
export function usePurchaseOrderStats(
  args: { companyId: Id<"companies"> } | "skip"
) {
  return useQuery(api.purchaseOrders.getStats, args === "skip" ? "skip" : args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new purchase order
 */
export function useCreatePurchaseOrder() {
  return useMutation(api.purchaseOrders.create);
}

/**
 * Update a purchase order
 */
export function useUpdatePurchaseOrder() {
  return useMutation(api.purchaseOrders.update);
}

/**
 * Submit purchase order for approval
 */
export function useSubmitPurchaseOrderForApproval() {
  return useMutation(api.purchaseOrders.submitForApproval);
}

/**
 * Approve a purchase order
 */
export function useApprovePurchaseOrder() {
  return useMutation(api.purchaseOrders.approve);
}

/**
 * Reject a purchase order
 */
export function useRejectPurchaseOrder() {
  return useMutation(api.purchaseOrders.reject);
}

/**
 * Mark purchase order as ordered
 */
export function useMarkPurchaseOrderOrdered() {
  return useMutation(api.purchaseOrders.markOrdered);
}

/**
 * Mark purchase order as partially received
 */
export function useMarkPurchaseOrderPartiallyReceived() {
  return useMutation(api.purchaseOrders.markPartiallyReceived);
}

/**
 * Mark purchase order as received
 */
export function useMarkPurchaseOrderReceived() {
  return useMutation(api.purchaseOrders.markReceived);
}

/**
 * Cancel a purchase order
 */
export function useCancelPurchaseOrder() {
  return useMutation(api.purchaseOrders.cancel);
}

/**
 * Update expected delivery date
 */
export function useUpdateExpectedDelivery() {
  return useMutation(api.purchaseOrders.updateExpectedDelivery);
}

/**
 * Archive a purchase order
 */
export function useArchivePurchaseOrder() {
  return useMutation(api.purchaseOrders.archive);
}

/**
 * Unarchive a purchase order
 */
export function useUnarchivePurchaseOrder() {
  return useMutation(api.purchaseOrders.unarchive);
}

/**
 * Delete a purchase order (soft delete)
 */
export function useDeletePurchaseOrder() {
  return useMutation(api.purchaseOrders.remove);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
