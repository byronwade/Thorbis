"use client";

/**
 * Payment Hooks for Convex
 *
 * Provides React hooks for payment operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List payments for a company
 */
export function usePayments(
  args:
    | {
        companyId: Id<"companies">;
        status?: "pending" | "processing" | "completed" | "failed" | "refunded" | "partially_refunded" | "cancelled";
        customerId?: Id<"customers">;
        invoiceId?: Id<"invoices">;
        paymentMethod?: "cash" | "check" | "credit_card" | "debit_card" | "ach" | "wire" | "venmo" | "paypal" | "other";
        limit?: number;
      }
    | "skip"
) {
  return useQuery(api.payments.list, args === "skip" ? "skip" : args);
}

/**
 * Get a single payment by ID
 */
export function usePayment(args: { paymentId: Id<"payments"> }) {
  return useQuery(api.payments.get, args);
}

/**
 * Get complete payment data with related entities
 */
export function usePaymentComplete(args: { paymentId: Id<"payments"> }) {
  return useQuery(api.payments.getComplete, args);
}

/**
 * Get payment statistics
 */
export function usePaymentStats(
  args:
    | {
        companyId: Id<"companies">;
        since?: number;
      }
    | "skip"
) {
  return useQuery(api.payments.getStats, args === "skip" ? "skip" : args);
}

/**
 * Get recent payments
 */
export function useRecentPayments(args: {
  companyId: Id<"companies">;
  limit?: number;
}) {
  return useQuery(api.payments.getRecent, args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new payment
 */
export function useCreatePayment() {
  return useMutation(api.payments.create);
}

/**
 * Process/complete a payment
 */
export function useProcessPayment() {
  return useMutation(api.payments.process);
}

/**
 * Mark payment as failed
 */
export function useFailPayment() {
  return useMutation(api.payments.fail);
}

/**
 * Refund a payment
 */
export function useRefundPayment() {
  return useMutation(api.payments.refund);
}

/**
 * Send receipt email
 */
export function useSendPaymentReceipt() {
  return useMutation(api.payments.sendReceipt);
}

/**
 * Delete a payment (soft delete)
 */
export function useDeletePayment() {
  return useMutation(api.payments.remove);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
