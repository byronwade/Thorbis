"use client";

/**
 * Invoice Hooks for Convex
 *
 * Provides React hooks for invoice operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List invoices for a company
 */
export function useInvoices(
  args:
    | {
        companyId: Id<"companies">;
        status?: "draft" | "sent" | "viewed" | "partial" | "paid" | "overdue" | "cancelled";
        customerId?: Id<"customers">;
        jobId?: Id<"jobs">;
        includeArchived?: boolean;
        limit?: number;
      }
    | "skip"
) {
  return useQuery(api.invoices.list, args === "skip" ? "skip" : args);
}

/**
 * Get a single invoice by ID
 */
export function useInvoice(args: { invoiceId: Id<"invoices"> }) {
  return useQuery(api.invoices.get, args);
}

/**
 * Get complete invoice data with related entities
 */
export function useInvoiceComplete(args: { invoiceId: Id<"invoices"> }) {
  return useQuery(api.invoices.getComplete, args);
}

/**
 * Get overdue invoices
 */
export function useOverdueInvoices(args: {
  companyId: Id<"companies">;
  limit?: number;
}) {
  return useQuery(api.invoices.getOverdue, args);
}

/**
 * Get invoice statistics
 */
export function useInvoiceStats(
  args: { companyId: Id<"companies"> } | "skip"
) {
  return useQuery(api.invoices.getStats, args === "skip" ? "skip" : args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new invoice
 */
export function useCreateInvoice() {
  return useMutation(api.invoices.create);
}

/**
 * Update an invoice
 */
export function useUpdateInvoice() {
  return useMutation(api.invoices.update);
}

/**
 * Send invoice
 */
export function useSendInvoice() {
  return useMutation(api.invoices.send);
}

/**
 * Mark invoice as viewed
 */
export function useMarkInvoiceViewed() {
  return useMutation(api.invoices.markViewed);
}

/**
 * Record a payment on an invoice
 */
export function useRecordPayment() {
  return useMutation(api.invoices.recordPayment);
}

/**
 * Cancel an invoice
 */
export function useCancelInvoice() {
  return useMutation(api.invoices.cancel);
}

/**
 * Delete an invoice (soft delete)
 */
export function useDeleteInvoice() {
  return useMutation(api.invoices.remove);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
