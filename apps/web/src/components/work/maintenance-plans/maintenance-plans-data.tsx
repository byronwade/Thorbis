import { notFound } from "next/navigation";
import { MaintenancePlansKanban } from "@/components/work/maintenance-plans-kanban";
import {
	type MaintenancePlan,
	MaintenancePlansTable,
} from "@/components/work/maintenance-plans-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getCurrentUser } from "@/lib/auth/session";
import {
	getMaintenancePlansPageData,
	MAINTENANCE_PLANS_PAGE_SIZE,
	type MaintenancePlanQueryResult,
} from "@/lib/queries/maintenance-plans";

const FREQUENCY_LABELS: Record<string, MaintenancePlan["frequency"]> = {
	monthly: "Monthly",
	quarterly: "Quarterly",
	"bi-annual": "Bi-Annual",
	biannual: "Bi-Annual",
	annual: "Annual",
};

const STATUS_OPTIONS: MaintenancePlan["status"][] = [
	"active",
	"pending",
	"paused",
	"cancelled",
];

const formatDate = (value?: string | null) =>
	value
		? new Date(value).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		: "";

const resolveCustomer = (customer: MaintenancePlanQueryResult["customer"]) => {
	if (!customer) {
		return null;
	}
	return Array.isArray(customer) ? (customer[0] ?? null) : customer;
};

export async function MaintenancePlansData({
	searchParams,
}: {
	searchParams?: { page?: string };
}) {
	const [user, activeCompanyId] = await Promise.all([
		getCurrentUser(),
		getActiveCompanyId(),
	]);

	if (!user) {
		return notFound();
	}

	if (!activeCompanyId) {
		return notFound();
	}

	const currentPage = Number(searchParams?.page) || 1;
	const { plans: plansRaw, totalCount } = await getMaintenancePlansPageData(
		currentPage,
		MAINTENANCE_PLANS_PAGE_SIZE,
		activeCompanyId,
	);

	const plans: MaintenancePlan[] = (plansRaw || []).map(
		(plan: MaintenancePlanQueryResult) => {
			const customer = resolveCustomer(plan.customer);

			const customerName =
				customer?.display_name ||
				`${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim() ||
				"Unknown";

			const frequencyKey = plan.frequency?.toLowerCase() ?? "monthly";
			const frequency = FREQUENCY_LABELS[frequencyKey] ?? "Monthly";

			const normalizedStatus = (
				plan.status ?? ""
			).toLowerCase() as MaintenancePlan["status"];
			const status = STATUS_OPTIONS.includes(normalizedStatus)
				? normalizedStatus
				: "pending";

			return {
				id: plan.id,
				planName: plan.name || plan.plan_number || plan.id,
				customer: customerName,
				serviceType:
					(plan as { service_type?: string | null }).service_type ||
					plan.name ||
					"Service plan",
				frequency,
				nextVisit: formatDate(plan.next_service_date),
				monthlyFee: typeof plan.amount === "number" ? plan.amount : 0,
				status,
				archived_at:
					(plan as { archived_at?: string | null }).archived_at ?? null,
				deleted_at: (plan as { deleted_at?: string | null }).deleted_at ?? null,
			};
		},
	);

	return (
		<WorkDataView
			kanban={<MaintenancePlansKanban plans={plans} />}
			section="maintenancePlans"
			table={
				<MaintenancePlansTable
					currentPage={currentPage}
					itemsPerPage={MAINTENANCE_PLANS_PAGE_SIZE}
					plans={plans}
					totalCount={totalCount}
				/>
			}
		/>
	);
}
