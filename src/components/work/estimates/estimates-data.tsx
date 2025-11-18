import { notFound } from "next/navigation";
import { EstimatesKanban } from "@/components/work/estimates-kanban";
import {
	type Estimate,
	EstimatesTable,
} from "@/components/work/estimates-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	ESTIMATES_PAGE_SIZE,
	getEstimatesPageData,
} from "@/lib/queries/estimates";

/**
 * EstimatesData - Async Server Component
 *
 * Fetches and displays estimates data.
 * This streams in after the stats render.
 */
export async function EstimatesData({
	searchParams,
}: {
	searchParams?: { page?: string };
}) {
	const activeCompanyId = await getActiveCompanyId();
	if (!activeCompanyId) {
		return notFound();
	}

	const currentPage = Number(searchParams?.page) || 1;
	const { estimates: estimatesRaw, totalCount } = await getEstimatesPageData(
		currentPage,
		ESTIMATES_PAGE_SIZE,
	);

	if (!estimatesRaw) {
		return notFound();
	}

	// Transform data for table component
	const estimates: Estimate[] = estimatesRaw.map((est: any) => {
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
			table={
				<EstimatesTable
					estimates={estimates}
					itemsPerPage={ESTIMATES_PAGE_SIZE}
					totalCount={totalCount}
					currentPage={currentPage}
				/>
			}
		/>
	);
}
