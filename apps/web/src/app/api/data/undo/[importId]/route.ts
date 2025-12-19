/**
 * Undo Import API Route
 *
 * Reverses an import operation within 24 hours
 * Deletes imported records and marks import as reverted
 */

import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
	params: Promise<{
		importId: string;
	}>;
};

// Table names for each data type
const TABLE_MAP: Record<string, string> = {
	customers: "customers",
	jobs: "jobs",
	materials: "materials",
	vendors: "vendors",
};

export async function POST(_request: NextRequest, context: RouteContext) {
	try {
		// Check authentication
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json(
				{ error: "Database not configured" },
				{ status: 500 },
			);
		}

		const { importId } = await context.params;

		// Get active company ID
		const { getActiveCompanyId } = await import("@/lib/auth/company-context");
		const companyId = await getActiveCompanyId();

		if (!companyId) {
			return NextResponse.json(
				{ error: "No active company found" },
				{ status: 400 },
			);
		}

		// Get import record - allow owner or admin to undo
		const { data: importRecord, error: fetchError } = await supabase
			.from("data_imports")
			.select("*")
			.eq("id", importId)
			.eq("company_id", companyId)
			.single();

		if (fetchError || !importRecord) {
			return NextResponse.json({ error: "Import not found" }, { status: 404 });
		}

		// Check if user can undo (owner of import or admin)
		const isOwner = importRecord.user_id === user.id;
		if (!isOwner) {
			const { data: membership } = await supabase
				.from("company_memberships")
				.select("role")
				.eq("user_id", user.id)
				.eq("company_id", companyId)
				.single();

			if (!membership || !["owner", "admin"].includes(membership.role || "")) {
				return NextResponse.json(
					{ error: "Only the import owner or admins can undo imports" },
					{ status: 403 },
				);
			}
		}

		// Check if import can be undone (within 24 hours)
		const importDate = new Date(importRecord.created_at);
		const now = new Date();
		const hoursSinceImport =
			(now.getTime() - importDate.getTime()) / (1000 * 60 * 60);

		if (hoursSinceImport > 24) {
			return NextResponse.json(
				{ error: "Import can only be undone within 24 hours" },
				{ status: 400 },
			);
		}

		if (!["completed", "completed_with_errors"].includes(importRecord.status)) {
			return NextResponse.json(
				{ error: "Only completed imports can be undone" },
				{ status: 400 },
			);
		}

		// Get the IDs of records that were imported
		const { data: importedRecords } = await supabase
			.from("data_import_records")
			.select("record_id")
			.eq("import_id", importId);

		let deletedCount = 0;
		const deleteErrors: string[] = [];

		if (importedRecords && importedRecords.length > 0) {
			const tableName = TABLE_MAP[importRecord.data_type];

			if (tableName) {
				const recordIds = importedRecords.map((r) => r.record_id);

				// Delete in batches of 100
				const batchSize = 100;
				for (let i = 0; i < recordIds.length; i += batchSize) {
					const batch = recordIds.slice(i, i + batchSize);
					const { error: deleteError, count } = await supabase
						.from(tableName)
						.delete()
						.in("id", batch)
						.eq("company_id", companyId);

					if (deleteError) {
						deleteErrors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${deleteError.message}`);
					} else {
						deletedCount += count || batch.length;
					}
				}

				// Clean up the import records tracking table
				await supabase
					.from("data_import_records")
					.delete()
					.eq("import_id", importId);
			}
		}

		// Update import status
		const { error: updateError } = await supabase
			.from("data_imports")
			.update({
				status: "reverted",
				reverted_at: new Date().toISOString(),
				reverted_by: user.id,
				records_deleted: deletedCount,
			})
			.eq("id", importId);

		if (updateError) {
			return NextResponse.json(
				{ error: "Failed to update import status" },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			success: true,
			message: deleteErrors.length > 0
				? "Import partially undone with some errors"
				: "Import successfully undone",
			importId,
			deletedRecords: deletedCount,
			errors: deleteErrors.length > 0 ? deleteErrors : undefined,
		});
	} catch (error) {
		console.error("Import undo error:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Internal server error" },
			{ status: 500 },
		);
	}
}
