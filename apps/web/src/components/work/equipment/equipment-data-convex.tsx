"use client";

/**
 * Equipment Data (Convex Version)
 *
 * Client component that fetches equipment data from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: equipment-data.tsx (Supabase Server Component)
 */
import { EquipmentKanban } from "@/components/work/equipment-kanban";
import { EquipmentTable } from "@/components/work/equipment-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { useEquipment } from "@/lib/convex/hooks/equipment";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";
import { Skeleton } from "@/components/ui/skeleton";

const EQUIPMENT_PAGE_SIZE = 50;

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
  if (["tool", "hand_tool", "power_tool", "equipment_tool", "pipe_tool", "jetter"].includes(type)) {
    return "tool";
  }
  return "equipment";
};

const formatDate = (timestamp?: number | null) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Loading skeleton for equipment view
 */
function EquipmentLoadingSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

/**
 * Error state component
 */
function EquipmentError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-destructive">Error Loading Equipment</h3>
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function EquipmentEmpty() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold">No Equipment Yet</h3>
        <p className="text-muted-foreground mt-2">
          Add your first piece of equipment to get started.
        </p>
      </div>
    </div>
  );
}

/**
 * Props for EquipmentDataConvex
 */
interface EquipmentDataConvexProps {
  searchParams?: { page?: string };
}

/**
 * Equipment Data - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live data updates
 * - No manual refresh needed
 * - Optimistic UI updates via mutations
 */
export function EquipmentDataConvex({ searchParams }: EquipmentDataConvexProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch equipment from Convex
  const equipmentResult = useEquipment(
    activeCompanyId
      ? {
          companyId: activeCompanyId,
          limit: EQUIPMENT_PAGE_SIZE,
        }
      : "skip"
  );

  // Loading state
  if (companyLoading || equipmentResult === undefined) {
    return <EquipmentLoadingSkeleton />;
  }

  // No company selected
  if (!activeCompanyId) {
    return <EquipmentError message="Please select a company to view equipment." />;
  }

  // Error state
  if (equipmentResult === null) {
    return <EquipmentError message="Failed to load equipment. Please try again." />;
  }

  const { equipment: convexEquipment, total, hasMore } = equipmentResult;

  // Empty state
  if (convexEquipment.length === 0) {
    return <EquipmentEmpty />;
  }

  // Transform Convex records to table format
  const equipment = convexEquipment.map((eq) => {
    const classification = inferClassification(eq.type);
    const classificationLabel = classificationLabelMap[classification] || formatLabel(classification);
    const typeLabel = typeLabelMap[eq.type || "other"] || formatLabel(eq.type);

    return {
      id: eq._id,
      equipmentNumber: eq.equipmentNumber,
      name: eq.name,
      classification,
      classificationLabel,
      type: eq.type || "other",
      typeLabel,
      manufacturer: eq.manufacturer || "",
      model: eq.model || "",
      assetId: eq.equipmentNumber || eq._id,
      assignedTo: "Unassigned", // Assigned user not included in list query
      customer: "Customer", // Customer name not included in list query
      location: eq.location || "",
      status: eq.status,
      condition: eq.condition,
      installDate: formatDate(eq.installDate),
      lastService: formatDate(eq.lastServiceDate),
      nextService: formatDate(eq.nextServiceDue),
      nextServiceDue: formatDate(eq.nextServiceDue),
      archived_at: eq.archivedAt ? new Date(eq.archivedAt).toISOString() : undefined,
      deleted_at: eq.deletedAt ? new Date(eq.deletedAt).toISOString() : undefined,
    };
  });

  return (
    <WorkDataView
      kanban={<EquipmentKanban equipment={equipment} />}
      section="equipment"
      table={
        <EquipmentTable
          equipment={equipment}
          currentPage={currentPage}
          itemsPerPage={EQUIPMENT_PAGE_SIZE}
          totalCount={total}
        />
      }
    />
  );
}

/**
 * Re-export original component for gradual migration
 */
export { UequipmentData as EquipmentData } from "./equipment-data";
