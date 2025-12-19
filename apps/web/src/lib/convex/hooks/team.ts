"use client";

/**
 * Team Hooks for Convex
 *
 * Provides React hooks for team member operations
 * Note: Team operations are part of the companies module in Convex
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List team members for a company
 */
export function useTeamMembers(
  args:
    | {
        companyId: Id<"companies">;
        status?: string;
        role?: string;
      }
    | "skip"
) {
  return useQuery(api.companies.getTeamMembers, args === "skip" ? "skip" : args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Invite team member
 */
export function useInviteTeamMember() {
  return useMutation(api.companies.inviteTeamMember);
}

/**
 * Update team member role
 */
export function useUpdateTeamMemberRole() {
  return useMutation(api.companies.updateTeamMemberRole);
}

/**
 * Remove team member
 */
export function useRemoveTeamMember() {
  return useMutation(api.companies.removeTeamMember);
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Id };
