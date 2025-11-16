import { notFound } from "next/navigation";
import { EstimatesKanban } from "@/components/work/estimates-kanban";
import {
	type Estimate,
	EstimatesTable,
} from "@/components/work/estimates-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * EstimatesData - Async Server Component
 *
 * Fetches and displays estimates data.
 * This streams in after the stats render.
 */
export async function EstimatesData() {
	const supabase = await createClient();

	if (!supabase) {
		return notFound();
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return notFound();
	}

	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		return notFound();
	}

	// Fetch estimates from database
	const { data: estimatesRaw, error } = await supabase
		.from("estimates")
		.select(
			`
      id,
      estimate_number,
      title,
      status,
      total_amount,
      created_at,
      valid_until,
      archived_at,
      deleted_at,
      customers!customer_id(display_name, first_name, last_name)
    `,
		)
		.eq("company_id", activeCompanyId)
		.order("created_at", { ascending: false });

	if (error) {
		// TODO: Handle error case
	}

	// Transform data for table component
	const estimates: Estimate[] = (estimatesRaw || []).map((est: any) => {
		const customer = Array.isArray(est.customers)
			? est.customers[0]
			: est.customers;

		return {
			id: est.id,
			estimateNumber: est.estimate_number,
			customer:
				customer?.display_name ||
				`${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() ||
				"Unknown Customer",
			project: est.title,
			date: new Date(est.created_at).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			}),
			validUntil: est.valid_until
				? new Date(est.valid_until).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})
				: "",
			amount: est.total_amount || 0,
			status: est.status as "accepted" | "sent" | "draft" | "declined",
			archived_at: est.archived_at,
			deleted_at: est.deleted_at,
		};
	});

	return (
		<WorkDataView
			kanban={<EstimatesKanban estimates={estimates} />}
			section="estimates"
			table={<EstimatesTable estimates={estimates} itemsPerPage={50} />}
		/>
	);
}
