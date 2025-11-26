import { notFound } from "next/navigation";
import { EquipmentKanban } from "@/components/work/equipment-kanban";
import { EquipmentTable } from "@/components/work/equipment-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	EQUIPMENT_PAGE_SIZE,
	getEquipmentPageData,
} from "@/lib/queries/equipment";

const classificationLabelMap: Record<string, string> = {
	equipment: "Equipment",
	tool: "Tool",
	vehicle: "Vehicle",
};

const typeLabelMap: Record<string, string> = {
	hvac: "HVAC System",
	plumbing: "Plumbing",
	electrical: "Electrical",
	appliance: "Appliance",
	water_heater: "Water Heater",
	furnace: "Furnace",
	ac_unit: "A/C Unit",
	vehicle: "Vehicle",
	tool: "Tool",
	other: "Other",
};

const formatLabel = (value?: string | null) => {
	if (!value) {
		return "";
	}
	return value
		.replace(/[_-]+/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase())
		.trim();
};

const inferClassification = (type?: string | null) => {
	if (!type) {
		return "equipment";
	}
	if (["vehicle", "fleet_vehicle", "truck", "van"].includes(type)) {
		return "vehicle";
	}
	if (
		[
			"tool",
			"hand_tool",
			"power_tool",
			"equipment_tool",
			"pipe_tool",
			"jetter",
		].includes(type)
	) {
		return "tool";
	}
	return "equipment";
};

const formatDate = (dateStr?: string | null) => {
	if (!dateStr) {
		return "";
	}
	return new Date(dateStr).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

// biome-ignore lint/suspicious/noExplicitAny: Supabase query result type
const getCustomerName = (customer: any) => {
	if (!customer) {
		return "Unknown";
	}
	if (customer.display_name) {
		return customer.display_name;
	}
	const fullName =
		`${customer.first_name || ""} ${customer.last_name || ""}`.trim();
	return fullName || "Unknown";
};

// biome-ignore lint/suspicious/noExplicitAny: Supabase query result type
const getLocation = (property: any, fallbackLocation?: string | null) => {
	if (!property) {
		return fallbackLocation || "";
	}
	return `${property.address || ""}, ${property.city || ""} ${property.state || ""}`.trim();
};

// biome-ignore lint/suspicious/noExplicitAny: Supabase query result type
const transformEquipmentData = (eq: any) => {
	const customer = Array.isArray(eq.customer) ? eq.customer[0] : eq.customer;
	const property = Array.isArray(eq.property) ? eq.property[0] : eq.property;

	const classification =
		eq.classification || inferClassification(eq.type || undefined);
	const classificationLabel =
		classificationLabelMap[classification] || formatLabel(classification);
	const typeLabel = typeLabelMap[eq.type] || formatLabel(eq.type);

	return {
		id: eq.id,
		equipmentNumber: eq.equipment_number,
		name: eq.name,
		classification,
		classificationLabel,
		type: eq.type || "other",
		typeLabel,
		manufacturer: eq.manufacturer || "",
		model: eq.model || "",
		assetId: eq.equipment_number || eq.id,
		assignedTo: eq.assigned_to || "Unassigned",
		customer: getCustomerName(customer),
		location: getLocation(property, eq.location),
		status: eq.status,
		condition: eq.condition,
		installDate: formatDate(eq.install_date),
		lastService: formatDate(eq.last_service_date),
		nextService: formatDate(eq.next_service_due),
		nextServiceDue: formatDate(eq.next_service_due),
		archived_at: eq.archived_at,
		deleted_at: eq.deleted_at,
	};
};

export async function UequipmentData({
	searchParams,
}: {
	searchParams?: { page?: string };
}) {
	const activeCompanyId = await getActiveCompanyId();
	if (!activeCompanyId) {
		return notFound();
	}

	const currentPage = Number(searchParams?.page) || 1;
	const { equipment: equipmentRaw, totalCount } = await getEquipmentPageData(
		currentPage,
		EQUIPMENT_PAGE_SIZE,
		activeCompanyId,
	);

	const equipment = equipmentRaw.map((eq) => transformEquipmentData(eq));

	return (
		<WorkDataView
			kanban={<EquipmentKanban equipment={equipment} />}
			section="equipment"
			table={
				<EquipmentTable
					equipment={equipment}
					currentPage={currentPage}
					itemsPerPage={EQUIPMENT_PAGE_SIZE}
					totalCount={totalCount}
				/>
			}
		/>
	);
}
