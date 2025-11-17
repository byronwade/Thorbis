import { notFound } from "next/navigation";
import { MaintenancePlansKanban } from "@/components/work/maintenance-plans-kanban";
import {
	type MaintenancePlan,
	MaintenancePlansTable,
} from "@/components/work/maintenance-plans-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function MaintenancePlansData() {
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

	const { data: plansRaw, error } = await supabase
		.from("maintenance_plans")
		.select(
			`
      *,
      customer:customers!customer_id(display_name, first_name, last_name)
    `
		)
		.eq("company_id", activeCompanyId)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`Failed to fetch maintenance plans: ${error.message}`);
	}

	// Normalize Supabase rows into the MaintenancePlan shape used by table/kanban
	const plans: MaintenancePlan[] =
		// biome-ignore lint/suspicious/noExplicitAny: Supabase query result type
		(plansRaw || []).map((plan: any): MaintenancePlan => {
			const customer = Array.isArray(plan.customer) ? plan.customer[0] : plan.customer;

			const customerName =
				customer?.display_name ||
				`${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() ||
				"Unknown";

			const nextVisit =
				plan.next_service_date &&
				new Date(plan.next_service_date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				});

			return {
				id: plan.id,
				planName: plan.name || plan.plan_number || plan.id,
				customer: customerName,
				serviceType: plan.service_type || plan.name || "Service plan",
				frequency: (plan.frequency || "Monthly") as MaintenancePlan["frequency"],
				nextVisit: nextVisit || "",
				monthlyFee:
					typeof plan.monthly_fee === "number"
						? plan.monthly_fee
						: typeof plan.value === "number"
							? plan.value
							: 0,
				status: (plan.status || "pending") as MaintenancePlan["status"],
				archived_at: plan.archived_at ?? null,
				deleted_at: plan.deleted_at ?? null,
			};
		});

	return (
		<WorkDataView
			kanban={<MaintenancePlansKanban plans={plans} />}
			section="maintenancePlans"
			table={<MaintenancePlansTable itemsPerPage={50} plans={plans} />}
		/>
	);
}
