"use client";

/**
 * Active Company Hook
 *
 * Provides the current active company context for Convex-based components.
 * Syncs with the company store and Convex queries.
 */
import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import {
  useConvexCompanyStore,
  selectActiveCompanyId,
  selectCompanies,
  selectActiveCompany,
  selectIsLoading,
  selectIsInitialized,
  type ConvexCompanyInfo,
} from "../stores/company-store";

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to get and manage the active company for Convex operations.
 *
 * Usage:
 * ```tsx
 * const { activeCompanyId, activeCompany, companies, isLoading } = useActiveCompany();
 *
 * // Use activeCompanyId in Convex hooks
 * const customers = useCustomers({ companyId: activeCompanyId! });
 * ```
 */
export function useActiveCompany() {
  // Get store state with selective subscriptions
  const activeCompanyId = useConvexCompanyStore(selectActiveCompanyId);
  const companies = useConvexCompanyStore(selectCompanies);
  const activeCompany = useConvexCompanyStore(selectActiveCompany);
  const isLoading = useConvexCompanyStore(selectIsLoading);
  const isInitialized = useConvexCompanyStore(selectIsInitialized);

  // Get store actions
  const setActiveCompanyId = useConvexCompanyStore((s) => s.setActiveCompanyId);
  const setCompanies = useConvexCompanyStore((s) => s.setCompanies);
  const setLoading = useConvexCompanyStore((s) => s.setLoading);
  const setInitialized = useConvexCompanyStore((s) => s.setInitialized);

  // Fetch companies from Convex
  const convexCompanies = useQuery(api.companies.list);

  // Sync Convex data to store
  useEffect(() => {
    if (convexCompanies === undefined) {
      // Still loading
      setLoading(true);
      return;
    }

    // Update companies in store
    setCompanies(convexCompanies as ConvexCompanyInfo[]);
    setLoading(false);

    // If no active company set, use first company
    if (!activeCompanyId && convexCompanies.length > 0) {
      setActiveCompanyId(convexCompanies[0]._id as Id<"companies">);
    }

    // Validate active company still exists
    if (activeCompanyId && !convexCompanies.find((c) => c._id === activeCompanyId)) {
      // Active company no longer accessible, reset to first
      if (convexCompanies.length > 0) {
        setActiveCompanyId(convexCompanies[0]._id as Id<"companies">);
      } else {
        setActiveCompanyId(null);
      }
    }

    setInitialized(true);
  }, [
    convexCompanies,
    activeCompanyId,
    setCompanies,
    setLoading,
    setActiveCompanyId,
    setInitialized,
  ]);

  return {
    activeCompanyId,
    activeCompany,
    companies,
    isLoading,
    isInitialized,
    setActiveCompanyId,
  };
}

/**
 * Hook to require an active company.
 * Throws error if no active company is set.
 */
export function useRequireActiveCompany() {
  const { activeCompanyId, activeCompany, isLoading } = useActiveCompany();

  if (!isLoading && !activeCompanyId) {
    throw new Error("No active company selected. Please select a company.");
  }

  return {
    companyId: activeCompanyId!,
    company: activeCompany,
    isLoading,
  };
}
