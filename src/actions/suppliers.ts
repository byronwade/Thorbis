"use server";

import {
	ActionError,
	ERROR_CODES,
	ERROR_MESSAGES,
} from "@/lib/errors/action-error";
import {
	type ActionResult,
	assertAuthenticated,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

/**
 * Get all supplier integrations for current user's company
 */
export async function getSupplierIntegrations(): Promise<ActionResult<any[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.eq("status", "active")
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Fetch supplier integrations
		const { data: suppliers, error } = await supabase
			.from("supplier_integrations")
			.select("*")
			.eq("company_id", teamMember.company_id)
			.order("created_at", { ascending: false });

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch supplier integrations"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		return suppliers || [];
	});
}
