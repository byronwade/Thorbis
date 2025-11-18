import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

const TOTAL_EQUIPMENT_CHANGE = 8.4;
const ACTIVE_CHANGE = 12.1;
const MAINTENANCE_CHANGE_NEGATIVE = -3.5;
const MAINTENANCE_CHANGE_POSITIVE = 4.2;
const SERVICE_DUE_CHANGE_NEGATIVE = -5.8;
const SERVICE_DUE_CHANGE_POSITIVE = 3.6;
const INACTIVE_CHANGE_POSITIVE = 2.9;
const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_PER_SECOND = 1000;
const MILLISECONDS_PER_DAY =
	MILLISECONDS_PER_SECOND *
	SECONDS_PER_MINUTE *
	MINUTES_PER_HOUR *
	HOURS_PER_DAY;
const SERVICE_DUE_THRESHOLD_DAYS = 30;
const PERCENTAGE_MULTIPLIER = 100;

export async function UequipmentStats() {
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

	// Fetch equipment from database
	const { data: equipmentRaw, error } = await supabase
		.from("equipment")
		.select(
			`
      *,
      customer:customers!customer_id(display_name, first_name, last_name),
      property:properties!property_id(address, city, state)
    `,
		)
		.eq("company_id", activeCompanyId)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`Failed to load equipment: ${error.message}`);
	}

	// Transform data for stats
	const equipment = (equipmentRaw || []).map((eq) => ({
		id: eq.id,
		status: eq.status,
		condition: eq.condition,
		nextServiceDue: eq.next_service_due
			? new Date(eq.next_service_due).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})
			: "",
		archived_at: eq.archived_at,
		deleted_at: eq.deleted_at,
	}));

	// Filter to active equipment for stats calculations
	const activeEquipment = equipment.filter(
		(e) => !(e.archived_at || e.deleted_at),
	);

	// Calculate equipment stats
	const totalEquipment = activeEquipment.length;
	const activeCount = activeEquipment.filter(
		(e) => e.status === "active",
	).length;
	const inactiveCount = activeEquipment.filter(
		(e) => e.status === "inactive",
	).length;
	const maintenanceCount = activeEquipment.filter(
		(e) => e.condition === "poor" || e.condition === "needs_replacement",
	).length;
	const needsAttention = activeEquipment.filter((e) => {
		if (!e.nextServiceDue) {
			return false;
		}
		const dueDate = new Date(e.nextServiceDue);
		const now = new Date();
		const daysUntilDue = Math.ceil(
			(dueDate.getTime() - now.getTime()) / MILLISECONDS_PER_DAY,
		);
		return daysUntilDue <= SERVICE_DUE_THRESHOLD_DAYS && daysUntilDue >= 0;
	}).length;

	const equipmentStats: StatCard[] = [
		{
			label: "Total Equipment",
			value: totalEquipment,
			change: totalEquipment > 0 ? TOTAL_EQUIPMENT_CHANGE : 0,
			changeLabel: "company assets",
		},
		{
			label: "Active",
			value: activeCount,
			change: activeCount > 0 ? ACTIVE_CHANGE : 0,
			changeLabel: `${Math.round((activeCount / (totalEquipment || 1)) * PERCENTAGE_MULTIPLIER)}% ready for use`,
		},
		{
			label: "In Maintenance",
			value: maintenanceCount,
			change:
				maintenanceCount > 0
					? MAINTENANCE_CHANGE_NEGATIVE
					: MAINTENANCE_CHANGE_POSITIVE,
			changeLabel:
				maintenanceCount > 0 ? "requires attention" : "all operational",
		},
		{
			label: "Service Due Soon",
			value: needsAttention,
			change:
				needsAttention > 0
					? SERVICE_DUE_CHANGE_NEGATIVE
					: SERVICE_DUE_CHANGE_POSITIVE,
			changeLabel: needsAttention > 0 ? "within 30 days" : "all current",
		},
		{
			label: "Inactive",
			value: inactiveCount,
			change: inactiveCount > 0 ? 0 : INACTIVE_CHANGE_POSITIVE,
			changeLabel: "not in use",
		},
	];

	return <StatusPipeline compact stats={equipmentStats} />;
}
