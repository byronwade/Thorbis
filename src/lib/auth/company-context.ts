/**
 * Company Context Management
 *
 * Handles multi-tenancy by tracking and switching between companies
 * for users who may be members of multiple companies.
 *
 * Features:
 * - Active company stored in HTTP-only cookie
 * - Falls back to first available company
 * - Validates access before switching
 * - Server-side only (no client-side state)
 */

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "./session";

const ACTIVE_COMPANY_COOKIE = "active_company_id";

/**
 * Company Info
 */
export type CompanyInfo = {
  id: string;
  name: string;
  logo?: string | null;
};

/**
 * Get Active Company ID
 *
 * Returns the currently active company for the user.
 * Falls back to first company if no active company is set.
 *
 * @returns Company ID string or null if user has no companies
 */
export async function getActiveCompanyId(): Promise<string | null> {
  const cookieStore = await cookies();
  const activeCompanyId = cookieStore.get(ACTIVE_COMPANY_COOKIE)?.value;

  if (activeCompanyId) {
    // Verify user still has access to this company
    const hasAccess = await verifyCompanyAccess(activeCompanyId);
    if (hasAccess) {
      return activeCompanyId;
    }
  }

  // Fall back to first available company
  const companies = await getUserCompanies();
  return companies[0]?.id || null;
}

/**
 * Get Active Company Info
 *
 * Returns the full company object for the active company.
 *
 * @returns CompanyInfo object or null
 */
export async function getActiveCompany(): Promise<CompanyInfo | null> {
  const companyId = await getActiveCompanyId();
  if (!companyId) return null;

  const supabase = await createClient();
  if (!supabase) return null;

  const { data: company } = await supabase
    .from("companies")
    .select("id, name, logo")
    .eq("id", companyId)
    .is("deleted_at", null) // Exclude archived companies
    .single();

  return company;
}

/**
 * Set Active Company
 *
 * Switches the user's active company context.
 * Validates access before switching.
 *
 * @param companyId - Company ID to switch to
 * @throws Error if user doesn't have access to this company
 */
export async function setActiveCompany(companyId: string): Promise<void> {
  // Verify access before switching
  const hasAccess = await verifyCompanyAccess(companyId);

  if (!hasAccess) {
    throw new Error("You don't have access to this company");
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_COMPANY_COOKIE, companyId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

/**
 * Clear Active Company
 *
 * Removes the active company cookie.
 */
export async function clearActiveCompany(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACTIVE_COMPANY_COOKIE);
}

/**
 * Get User Companies
 *
 * Returns all companies the user has access to.
 *
 * @returns Array of CompanyInfo objects
 */
export async function getUserCompanies(): Promise<CompanyInfo[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  if (!supabase) return [];

  const { data: memberships } = await supabase
    .from("team_members")
    .select(
      `
      company_id,
      companies!inner (
        id,
        name,
        logo,
        deleted_at
      )
    `
    )
    .eq("user_id", user.id)
    .eq("status", "active")
    .is("companies.deleted_at", null); // Exclude archived companies

  if (!memberships) return [];

  return memberships.map((m: any) => ({
    id: m.companies.id,
    name: m.companies.name,
    logo: m.companies.logo,
  }));
}

/**
 * Verify Company Access
 *
 * Checks if user has access to a company.
 *
 * @param companyId - Company ID to verify
 * @returns true if user has access, false otherwise
 */
async function verifyCompanyAccess(companyId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const supabase = await createClient();
  if (!supabase) return false;

  // Check if company exists and is not archived
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("id", companyId)
    .is("deleted_at", null) // Exclude archived companies
    .single();

  if (!company) return false;

  // Check if user has active membership
  const { data } = await supabase
    .from("team_members")
    .select("id")
    .eq("user_id", user.id)
    .eq("company_id", companyId)
    .eq("status", "active")
    .single();

  return !!data;
}

/**
 * Require Active Company
 *
 * Throws error if no active company is set.
 * Useful for actions that require a company context.
 *
 * @returns Company ID string
 * @throws Error if no active company
 */
export async function requireActiveCompany(): Promise<string> {
  const companyId = await getActiveCompanyId();

  if (!companyId) {
    throw new Error("No active company selected. Please select a company.");
  }

  return companyId;
}

/**
 * Check if User Has Multiple Companies
 *
 * Useful for conditionally showing company switcher UI.
 *
 * @returns true if user has 2+ companies, false otherwise
 */
export async function hasMultipleCompanies(): Promise<boolean> {
  const companies = await getUserCompanies();
  return companies.length > 1;
}
