import { notFound } from "next/navigation";
import { ServiceAgreementsKanban } from "@/components/work/service-agreements-kanban";
import {
	type ServiceAgreement,
	ServiceAgreementsTable,
} from "@/components/work/service-agreements-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	getServiceAgreementsPageData,
	SERVICE_AGREEMENTS_PAGE_SIZE,
	type ServiceAgreementRecord,
} from "@/lib/queries/service-agreements";

export async function ServiceAgreementsData({
	searchParams,
}: {
	searchParams?: { page?: string };
}) {
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		return notFound();
	}

	const currentPage = Number(searchParams?.page) || 1;
	const { agreements: agreementsRaw, totalCount } =
		await getServiceAgreementsPageData(
			currentPage,
			SERVICE_AGREEMENTS_PAGE_SIZE,
			activeCompanyId,
		);

	// Normalize Supabase rows into the ServiceAgreement shape used by table/kanban
	const agreements: ServiceAgreement[] = (agreementsRaw || []).map(
		(agreement: ServiceAgreementRecord): ServiceAgreement => {
			const customer = Array.isArray(agreement.customer)
				? agreement.customer[0]
				: agreement.customer;

			const customerName =
				customer?.display_name ||
				`${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() ||
				"Unknown";

			const startDate =
				agreement.start_date &&
				new Date(agreement.start_date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				});

			const endDate =
				agreement.end_date &&
				new Date(agreement.end_date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				});

			// Map backend type (e.g. "contract", "sla") to UI-friendly label
			let type: ServiceAgreement["type"] = "Maintenance Contract";
			const rawType = String(
				agreement.plan_type || agreement.type || "",
			).toLowerCase();
			if (rawType.includes("sla")) {
				type = "Service Level Agreement";
			} else if (rawType.includes("warranty")) {
				type = "Extended Warranty";
			} else if (rawType.includes("support")) {
				type = "Support Contract";
			}

			return {
				id: agreement.id,
				agreementNumber: agreement.agreement_number || agreement.id,
				customer: customerName,
				type,
				startDate: startDate || "",
				endDate: endDate || "",
				value: typeof agreement.value === "number" ? agreement.value : 0,
				status: (agreement.status || "pending") as ServiceAgreement["status"],
				archived_at: agreement.archived_at ?? null,
				deleted_at: agreement.deleted_at ?? null,
			};
		},
	);

	return (
		<WorkDataView
			kanban={<ServiceAgreementsKanban agreements={agreements} />}
			section="serviceAgreements"
			table={
				<ServiceAgreementsTable
					agreements={agreements}
					currentPage={currentPage}
					itemsPerPage={SERVICE_AGREEMENTS_PAGE_SIZE}
					totalCount={totalCount}
				/>
			}
		/>
	);
}
