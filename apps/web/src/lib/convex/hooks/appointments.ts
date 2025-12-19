"use client";

/**
 * Appointment/Schedule Hooks for Convex
 *
 * Provides React hooks for appointment/schedule operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List schedules/appointments for a company
 */
export function useAppointments(
  args:
    | {
        companyId: Id<"companies">;
        status?: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled";
        customerId?: Id<"customers">;
        jobId?: Id<"jobs">;
        assignedTo?: Id<"users">;
        includeArchived?: boolean;
        limit?: number;
      }
    | "skip"
) {
  return useQuery(api.schedules.list, args === "skip" ? "skip" : args);
}

/**
 * Get a single schedule/appointment by ID
 */
export function useAppointment(args: { scheduleId: Id<"schedules"> }) {
  return useQuery(api.schedules.get, args);
}

/**
 * Get complete schedule data with related entities
 */
export function useAppointmentComplete(args: { scheduleId: Id<"schedules"> }) {
  return useQuery(api.schedules.getComplete, args);
}

/**
 * Get today's appointments for a user
 */
export function useTodayAppointments(args: {
  companyId: Id<"companies">;
  userId: Id<"users">;
}) {
  return useQuery(api.schedules.getTodayForUser, args);
}

/**
 * Get upcoming appointments
 */
export function useUpcomingAppointments(args: {
  companyId: Id<"companies">;
  days?: number;
  limit?: number;
}) {
  return useQuery(api.schedules.getUpcoming, args);
}

/**
 * Get appointments by date range
 */
export function useAppointmentsByDateRange(args: {
  companyId: Id<"companies">;
  startDate: number;
  endDate: number;
}) {
  return useQuery(api.schedules.getByDateRange, args);
}

/**
 * Get appointments by assignee
 */
export function useAppointmentsByAssignee(args: {
  assigneeId: Id<"users">;
  startDate?: number;
  endDate?: number;
  statuses?: ("scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled")[];
  limit?: number;
}) {
  return useQuery(api.schedules.getByAssignee, args);
}

/**
 * Get appointment statistics
 */
export function useAppointmentStats(
  args: { companyId: Id<"companies"> } | "skip"
) {
  return useQuery(api.schedules.getStats, args === "skip" ? "skip" : args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new appointment
 */
export function useCreateAppointment() {
  return useMutation(api.schedules.create);
}

/**
 * Update an appointment
 */
export function useUpdateAppointment() {
  return useMutation(api.schedules.update);
}

/**
 * Update appointment status
 */
export function useUpdateAppointmentStatus() {
  return useMutation(api.schedules.updateStatus);
}

/**
 * Confirm an appointment
 */
export function useConfirmAppointment() {
  return useMutation(api.schedules.confirm);
}

/**
 * Start job from appointment
 */
export function useStartAppointmentJob() {
  return useMutation(api.schedules.startJob);
}

/**
 * Complete an appointment
 */
export function useCompleteAppointment() {
  return useMutation(api.schedules.complete);
}

/**
 * Cancel an appointment
 */
export function useCancelAppointment() {
  return useMutation(api.schedules.cancel);
}

/**
 * Reschedule an appointment
 */
export function useRescheduleAppointment() {
  return useMutation(api.schedules.reschedule);
}

/**
 * Mark reminder as sent
 */
export function useMarkReminderSent() {
  return useMutation(api.schedules.markReminderSent);
}

/**
 * Mark as no-show
 */
export function useMarkNoShow() {
  return useMutation(api.schedules.markNoShow);
}

/**
 * Delete an appointment (soft delete)
 */
export function useDeleteAppointment() {
  return useMutation(api.schedules.remove);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
