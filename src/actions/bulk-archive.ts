"use server";

import { revalidatePath } from "next/cache";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	ActionError,
	assertAuthenticated,
	assertSupabase,
	ERROR_CODES,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/action-result";

const HTTP_STATUS = {
	forbidden: 403,
} as const;

const PERMANENT_DELETE_BUFFER_DAYS = 90;
const MILLISECONDS_IN_DAY = 86_400_000;

type BulkArchiveResult = {
	successful: number;
	failed: number;
	skipped: number;
	errors: Array<{ id: string; error: string }>;
};

type InvoiceRecord = {
	id: string;
	status: string;
	company_id: string;
};

type InvoiceAudit = {
	archivableIds: string[];
	failed: number;
	skipped: number;
	errors: BulkArchiveResult["errors"];
};

/**
 * Bulk archive multiple invoices at once
 * - Filters out paid invoices automatically
 * - Uses a single database transaction for performance
 * - Returns detailed results
 */
export async function bulkArchiveInvoices(
	invoiceIds: string[]
): Promise<ActionResult<BulkArchiveResult>> {
	const actionResult = await withErrorHandling(async () => {
		const supabase = await createClient();
		assertSupabase(supabase);

		// Authenticate user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get active company ID
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				HTTP_STATUS.forbidden
			);
		}

		// Fetch all invoices to verify ownership and status
		const { data: invoices, error: fetchError } = await supabase
			.from("invoices")
			.select("id, status, company_id")
			.in("id", invoiceIds)
			.returns<InvoiceRecord[]>();

		if (fetchError) {
			throw new ActionError("Failed to fetch invoices", ERROR_CODES.DB_QUERY_ERROR);
		}

		const { archivableIds, failed, skipped, errors } = evaluateInvoices(invoices ?? [], companyId);

		// Bulk archive in single query
		let successful = 0;
		if (archivableIds.length > 0) {
			const now = new Date().toISOString();
			const scheduledDeletion = new Date(
				Date.now() + PERMANENT_DELETE_BUFFER_DAYS * MILLISECONDS_IN_DAY
			).toISOString();

			const { error: archiveError } = await supabase
				.from("invoices")
				.update({
					deleted_at: now,
					deleted_by: user.id,
					archived_at: now,
					permanent_delete_scheduled_at: scheduledDeletion,
				})
				.in("id", archivableIds);

			if (archiveError) {
				throw new ActionError("Failed to archive invoices", ERROR_CODES.DB_QUERY_ERROR);
			}

			successful = archivableIds.length;
		}

		// Revalidate the page
		revalidatePath("/dashboard/work/invoices");

		return {
			successful,
			failed,
			skipped,
			errors,
		};
	});

	if (actionResult.success) {
		return {
			...actionResult,
			message: generateSummaryMessage(actionResult.data),
		};
	}

	return actionResult;
}

/**
 * Generate a user-friendly summary message
 */
function generateSummaryMessage(result: BulkArchiveResult): string {
	const parts: string[] = [];

	if (result.successful > 0) {
		parts.push(`${result.successful} invoice${result.successful !== 1 ? "s" : ""} archived`);
	}

	if (result.skipped > 0) {
		parts.push(`${result.skipped} paid invoice${result.skipped !== 1 ? "s" : ""} skipped`);
	}

	if (result.failed > 0) {
		parts.push(`${result.failed} invoice${result.failed !== 1 ? "s" : ""} failed`);
	}

	return parts.join(", ");
}

function evaluateInvoices(invoices: InvoiceRecord[], companyId: string): InvoiceAudit {
	return invoices.reduce<InvoiceAudit>(
		(audit, invoice) => {
			if (invoice.company_id !== companyId) {
				audit.failed++;
				audit.errors.push({ id: invoice.id, error: "Access denied" });
				return audit;
			}

			if (invoice.status === "paid") {
				audit.skipped++;
				return audit;
			}

			audit.archivableIds.push(invoice.id);
			return audit;
		},
		{
			archivableIds: [],
			failed: 0,
			skipped: 0,
			errors: [],
		}
	);
}
