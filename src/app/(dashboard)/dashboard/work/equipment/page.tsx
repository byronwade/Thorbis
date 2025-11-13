/**
 * Equipment Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Real-time data from Supabase
 * - Only EquipmentTable component is client-side for interactivity
 * - Better SEO and initial page load performance
 * - Matches jobs/invoices page structure: stats pipeline + table/kanban views
 */

import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { EquipmentKanban } from "@/components/work/equipment-kanban";
import { EquipmentTable } from "@/components/work/equipment-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export default async function EquipmentPage() {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  // Get active company ID
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    return notFound();
  }

  // Fetch equipment from database (customer property equipment)
  // Fetch all equipment including archived (filter in UI)
  const { data: equipmentRaw, error } = await supabase
    .from("equipment")
    .select(`
      *,
      customer:customers!customer_id(display_name, first_name, last_name),
      property:properties!property_id(address, city, state)
    `)
    .eq("company_id", activeCompanyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching equipment:", error);
  }

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
    if (!value) return "";
    return value
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();
  };

  const inferClassification = (type?: string | null) => {
    if (!type) return "equipment";
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

  // Transform data for table component
  const equipment = (equipmentRaw || []).map((eq: any) => {
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
      assetId: eq.asset_id || eq.id,
      assignedTo: eq.assigned_to || "Unassigned",
      customer:
        customer?.display_name ||
        `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() ||
        "Unknown",
      location: property
        ? `${property.address || ""}, ${property.city || ""} ${property.state || ""}`.trim()
        : eq.location || "",
      status: eq.status,
      condition: eq.condition,
      installDate: eq.install_date
        ? new Date(eq.install_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "",
      lastService: eq.last_service_date
        ? new Date(eq.last_service_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "",
      nextService: eq.next_service_due
        ? new Date(eq.next_service_due).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "",
      nextServiceDue: eq.next_service_due
        ? new Date(eq.next_service_due).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "",
      archived_at: eq.archived_at,
      deleted_at: eq.deleted_at,
    };
  });

  // Filter to active equipment for stats calculations
  const activeEquipment = equipment.filter((e) => !e.archived_at && !e.deleted_at);

  // Calculate equipment stats (from active equipment only)
  const totalEquipment = activeEquipment.length;
  const activeCount = activeEquipment.filter((e) => e.status === "active").length;
  const inactiveCount = activeEquipment.filter((e) => e.status === "inactive").length;
  const maintenanceCount = activeEquipment.filter(
    (e) => e.condition === "poor" || e.condition === "needs_replacement"
  ).length;
  const needsAttention = activeEquipment.filter((e) => {
    if (!e.nextServiceDue) return false;
    const dueDate = new Date(e.nextServiceDue);
    const now = new Date();
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilDue <= 30 && daysUntilDue >= 0;
  }).length;

  const equipmentStats: StatCard[] = [
    {
      label: "Total Equipment",
      value: totalEquipment,
      change: totalEquipment > 0 ? 8.4 : 0, // Green if equipment exists
      changeLabel: "company assets",
    },
    {
      label: "Active",
      value: activeCount,
      change: activeCount > 0 ? 12.1 : 0, // Green if active equipment exists
      changeLabel: `${Math.round((activeCount / (totalEquipment || 1)) * 100)}% ready for use`,
    },
    {
      label: "In Maintenance",
      value: maintenanceCount,
      change: maintenanceCount > 0 ? -3.5 : 4.2, // Red if in maintenance, green if none
      changeLabel:
        maintenanceCount > 0 ? "requires attention" : "all operational",
    },
    {
      label: "Service Due Soon",
      value: needsAttention,
      change: needsAttention > 0 ? -5.8 : 3.6, // Red if service due, green if none
      changeLabel: needsAttention > 0 ? "within 30 days" : "all current",
    },
    {
      label: "Inactive",
      value: inactiveCount,
      change: inactiveCount > 0 ? 0 : 2.9, // Neutral if inactive, green if none
      changeLabel: "not in use",
    },
  ];

  return (
    <>
      <StatusPipeline compact stats={equipmentStats} />
      <WorkDataView
        kanban={<EquipmentKanban equipment={equipment} />}
        section="equipment"
        table={<EquipmentTable equipment={equipment} itemsPerPage={50} />}
      />
    </>
  );
}
