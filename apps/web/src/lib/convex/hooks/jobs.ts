"use client";

/**
 * Job Hooks for Convex
 *
 * Provides React hooks for job operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List jobs for a company with optional filters
 */
export function useJobs(args: {
  companyId: Id<"companies">;
  status?: "quoted" | "scheduled" | "in_progress" | "on_hold" | "completed" | "cancelled" | "invoiced" | "paid" | "archived";
  priority?: "low" | "medium" | "high" | "urgent";
  customerId?: Id<"customers">;
  assignedTo?: Id<"users">;
  includeArchived?: boolean;
  limit?: number;
}) {
  return useQuery(api.jobs.list, args);
}

/**
 * Get a single job by ID
 */
export function useJob(args: { jobId: Id<"jobs"> }) {
  return useQuery(api.jobs.get, args);
}

/**
 * Get complete job data with related entities
 */
export function useJobComplete(args: { jobId: Id<"jobs"> }) {
  return useQuery(api.jobs.getComplete, args);
}

/**
 * Get dashboard data for jobs
 */
export function useJobsDashboard(
  args: { companyId: Id<"companies"> } | "skip"
) {
  return useQuery(api.jobs.getDashboard, args === "skip" ? "skip" : args);
}

/**
 * Search jobs
 */
export function useSearchJobs(args: {
  companyId: Id<"companies">;
  query: string;
  limit?: number;
}) {
  return useQuery(api.jobs.search, args);
}

/**
 * Get job statistics
 */
export function useJobStats(args: { companyId: Id<"companies"> } | "skip") {
  return useQuery(api.jobs.getStats, args === "skip" ? "skip" : args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new job
 */
export function useCreateJob() {
  return useMutation(api.jobs.create);
}

/**
 * Update a job
 */
export function useUpdateJob() {
  return useMutation(api.jobs.update);
}

/**
 * Update job status
 */
export function useUpdateJobStatus() {
  return useMutation(api.jobs.updateStatus);
}

/**
 * Archive a job
 */
export function useArchiveJob() {
  return useMutation(api.jobs.archive);
}

/**
 * Delete a job (soft delete)
 */
export function useDeleteJob() {
  return useMutation(api.jobs.remove);
}

/**
 * Add team member to job
 */
export function useAddJobTeamMember() {
  return useMutation(api.jobs.addTeamMember);
}

/**
 * Remove team member from job
 */
export function useRemoveJobTeamMember() {
  return useMutation(api.jobs.removeTeamMember);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
