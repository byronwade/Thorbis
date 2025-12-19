"use client";

/**
 * Company Hooks for Convex
 *
 * Provides React hooks for company operations
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * List all companies the current user has access to
 */
export function useUserCompanies() {
  return useQuery(api.companies.list);
}

/**
 * Get a single company by ID
 */
export function useCompany(args: { companyId: Id<"companies"> }) {
  return useQuery(api.companies.get, args);
}

/**
 * Get company by slug
 */
export function useCompanyBySlug(args: { slug: string }) {
  return useQuery(api.companies.getBySlug, args);
}

/**
 * Get team members for a company
 */
export function useTeamMembers(args: {
  companyId: Id<"companies">;
  status?: string;
  role?: string;
}) {
  return useQuery(api.companies.getTeamMembers, args);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new company
 */
export function useCreateCompany() {
  return useMutation(api.companies.create);
}

/**
 * Update company details
 */
export function useUpdateCompany() {
  return useMutation(api.companies.update);
}

/**
 * Complete company onboarding
 */
export function useCompleteOnboarding() {
  return useMutation(api.companies.completeOnboarding);
}

/**
 * Update onboarding progress
 */
export function useUpdateOnboardingProgress() {
  return useMutation(api.companies.updateOnboardingProgress);
}

/**
 * Delete company (soft delete)
 */
export function useDeleteCompany() {
  return useMutation(api.companies.remove);
}

/**
 * Invite a team member
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
