/**
 * Approve Import API Route
 *
 * Admin endpoint to approve large imports and trigger processing
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

export async function POST(request: NextRequest, context: RouteContext) {
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
		const body = await request.json();
		const { approved } = body;

		// Get active company ID
		const { getActiveCompanyId } = await import("@/lib/auth/company-context");
		const companyId = await getActiveCompanyId();

		if (!companyId) {
			return NextResponse.json(
				{ error: "No active company found" },
				{ status: 400 },
			);
		}

		// Check if user is admin/owner
		const { data: membership } = await supabase
			.from("company_memberships")
			.select("role")
			.eq("user_id", user.id)
			.eq("company_id", companyId)
			.single();

		if (!membership || !["owner", "admin"].includes(membership.role || "")) {
			return NextResponse.json(
				{ error: "Only admins can approve imports" },
				{ status: 403 },
			);
		}

		// Get import record
		const { data: importRecord, error: fetchError } = await supabase
			.from("data_imports")
			.select("*")
			.eq("id", importId)
			.eq("company_id", companyId)
			.single();

		if (fetchError || !importRecord) {
			return NextResponse.json({ error: "Import not found" }, { status: 404 });
		}

		if (!importRecord.requires_approval) {
			return NextResponse.json(
				{ error: "This import does not require approval" },
				{ status: 400 },
			);
		}

		if (importRecord.status !== "pending") {
			return NextResponse.json(
				{ error: "Import is not pending approval" },
				{ status: 400 },
			);
		}

		if (!approved) {
			// Reject the import
			const { error: updateError } = await supabase
				.from("data_imports")
				.update({
					status: "rejected",
					approved_by: user.id,
					approved_at: new Date().toISOString(),
				})
				.eq("id", importId);

			if (updateError) {
				return NextResponse.json(
					{ error: "Failed to reject import" },
					{ status: 500 },
				);
			}

			return NextResponse.json({
				success: true,
				message: "Import rejected",
				importId,
				status: "rejected",
			});
		}

		// Approve and process the import
		// First update status to processing
		await supabase
			.from("data_imports")
			.update({
				status: "processing",
				approved_by: user.id,
				approved_at: new Date().toISOString(),
			})
			.eq("id", importId);

		// Get the stored import data
		const { data: importData } = await supabase
			.from("data_import_rows")
			.select("row_data")
			.eq("import_id", importId)
			.eq("is_valid", true);

		let insertedCount = 0;
		const insertErrors: string[] = [];

		if (importData && importData.length > 0) {
			const tableName = TABLE_MAP[importRecord.data_type];

			if (tableName) {
				// Process in batches of 100
				const batchSize = 100;
				const rows = importData.map((r) => r.row_data);

				for (let i = 0; i < rows.length; i += batchSize) {
					const batch = rows.slice(i, i + batchSize);
					const { error: batchError, count } = await supabase
						.from(tableName)
						.insert(batch)
						.select("id");

					if (batchError) {
						insertErrors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${batchError.message}`);
					} else {
						insertedCount += count || batch.length;
					}
				}
			}
		}

		// Update import record with final status
		const finalStatus = insertErrors.length > 0 ? "completed_with_errors" : "completed";
		await supabase
			.from("data_imports")
			.update({
				status: finalStatus,
				processed_rows: insertedCount,
				insert_errors: insertErrors.length > 0 ? insertErrors : null,
			})
			.eq("id", importId);

		return NextResponse.json({
			success: true,
			message: "Import approved and processed",
			importId,
			status: finalStatus,
			processedRows: insertedCount,
			errors: insertErrors.length > 0 ? insertErrors : undefined,
		});
	} catch (error) {
		console.error("Import approval error:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Internal server error" },
			{ status: 500 },
		);
	}
}
