"use client";

/**
 * Communication Hooks for Convex
 *
 * Provides React hooks for communication operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List communications for a company
 */
export function useCommunications(args: {
  companyId: Id<"companies">;
  type?: "email" | "sms" | "phone" | "chat" | "note";
  status?: "draft" | "sent" | "failed" | "queued" | "sending" | "delivered" | "read";
  customerId?: Id<"customers">;
  jobId?: Id<"jobs">;
  direction?: "inbound" | "outbound";
  includeArchived?: boolean;
  limit?: number;
}) {
  return useQuery(api.communications.list, args);
}

/**
 * Get a single communication by ID
 */
export function useCommunication(args: { communicationId: Id<"communications"> }) {
  return useQuery(api.communications.get, args);
}

/**
 * Get complete communication data with related entities
 */
export function useCommunicationComplete(args: { communicationId: Id<"communications"> }) {
  return useQuery(api.communications.getComplete, args);
}

/**
 * Get communications by thread
 */
export function useCommunicationsByThread(args: {
  companyId: Id<"companies">;
  threadId: string;
  limit?: number;
}) {
  return useQuery(api.communications.getByThread, args);
}

/**
 * Get communications for a customer
 */
export function useCommunicationsByCustomer(args: {
  customerId: Id<"customers">;
  limit?: number;
}) {
  return useQuery(api.communications.getByCustomer, args);
}

/**
 * Get communications for a job
 */
export function useCommunicationsByJob(args: {
  jobId: Id<"jobs">;
  limit?: number;
}) {
  return useQuery(api.communications.getByJob, args);
}

/**
 * Get unread communications
 */
export function useUnreadCommunications(args: {
  companyId: Id<"companies">;
  limit?: number;
}) {
  return useQuery(api.communications.getUnread, args);
}

/**
 * Get communication statistics
 */
export function useCommunicationStats(args: { companyId: Id<"companies"> }) {
  return useQuery(api.communications.getStats, args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new communication
 */
export function useCreateCommunication() {
  return useMutation(api.communications.create);
}

/**
 * Send a communication
 */
export function useSendCommunication() {
  return useMutation(api.communications.send);
}

/**
 * Reply to a communication
 */
export function useReplyCommunication() {
  return useMutation(api.communications.reply);
}

/**
 * Forward a communication
 */
export function useForwardCommunication() {
  return useMutation(api.communications.forward);
}

/**
 * Mark communication as read
 */
export function useMarkCommunicationRead() {
  return useMutation(api.communications.markAsRead);
}

/**
 * Mark communication as unread
 */
export function useMarkCommunicationUnread() {
  return useMutation(api.communications.markAsUnread);
}

/**
 * Update communication status
 */
export function useUpdateCommunicationStatus() {
  return useMutation(api.communications.updateStatus);
}

/**
 * Assign communication
 */
export function useAssignCommunication() {
  return useMutation(api.communications.assign);
}

/**
 * Archive a communication
 */
export function useArchiveCommunication() {
  return useMutation(api.communications.archive);
}

/**
 * Unarchive a communication
 */
export function useUnarchiveCommunication() {
  return useMutation(api.communications.unarchive);
}

/**
 * Delete a communication (soft delete)
 */
export function useDeleteCommunication() {
  return useMutation(api.communications.remove);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
