"use server";

/**
 * Company Context Server Actions
 *
 * Server Actions for managing active company context.
 * Used by company switcher UI components.
 */

import { revalidatePath } from "next/cache";
import { clearActiveCompany, getActiveCompany, getUserCompanies, setActiveCompany } from "@/lib/auth/company-context";

/**
 * Action Result Type
 */
type ActionResult<T = void> =
	| {
			success: true;
			data?: T;
			message?: string;
	  }
	| {
			success: false;
			error: string;
	  };

/**
 * Switch Company
 *
 * Changes the user's active company context.
 * Revalidates the entire layout to update company-scoped data.
 *
 * @param companyId - Company ID to switch to
 * @returns ActionResult indicating success or failure
 */
export async function switchCompany(companyId: string): Promise<ActionResult<void>> {
	try {
		await setActiveCompany(companyId);

		// Revalidate everything to ensure all company-scoped data is refreshed
		revalidatePath("/", "layout");

		return {
			success: true,
			message: "Company switched successfully",
		};
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to switch company",
		};
	}
}

/**
 * Clear Active Company
 *
 * Removes the active company context.
 * Useful for logout or company removal flows.
 *
 * @returns ActionResult indicating success or failure
 */
export async function clearCompany(): Promise<ActionResult<void>> {
	try {
		await clearActiveCompany();
		revalidatePath("/", "layout");

		return {
			success: true,
			message: "Company context cleared",
		};
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to clear company context",
		};
	}
}

/**
 * Get User's Companies
 *
 * Returns all companies the user has access to.
 * Useful for populating company switcher dropdowns.
 *
 * @returns ActionResult with array of companies
 */
export async function getCompanies(): Promise<ActionResult<Array<{ id: string; name: string; logo?: string | null }>>> {
	try {
		const companies = await getUserCompanies();

		return {
			success: true,
			data: companies,
		};
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to get companies",
		};
	}
}

/**
 * Get Active Company Details
 *
 * Returns details about the currently active company.
 *
 * @returns ActionResult with company details or null
 */
export async function getActiveCompanyDetails(): Promise<
	ActionResult<{ id: string; name: string; logo?: string | null } | null>
> {
	try {
		const company = await getActiveCompany();

		return {
			success: true,
			data: company,
		};
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to get active company",
		};
	}
}
