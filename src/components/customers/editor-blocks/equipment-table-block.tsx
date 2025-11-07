/**
 * Equipment Table Block - Custom Tiptap Node
 *
 * Displays customer's equipment using EquipmentTable component
 * - Shows property location for each equipment
 * - Shows assigned user
 * - Same datatable design as Jobs/Invoices
 */

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { Wrench, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleSectionWrapper } from "./collapsible-section-wrapper";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import to avoid SSR issues
const EquipmentTable = dynamic(
  () => import("@/components/work/equipment-table").then((mod) => ({ default: mod.EquipmentTable })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[200px] w-full" />,
  }
);

// React component that renders the block
export function EquipmentTableBlockComponent({ node, editor }: any) {
  const { equipment, customerId } = node.attrs;

  const handleAddEquipment = () => {
    // Navigate to add equipment page with customer pre-selected
    window.location.href = `/dashboard/work/equipment/new?customerId=${customerId}`;
  };

  // Calculate equipment summary
  const activeEquipment = (equipment || []).filter((eq: any) => eq.status === "active");
  const inServiceEquipment = (equipment || []).filter((eq: any) => eq.status === "in_service");
  const retiredEquipment = (equipment || []).filter((eq: any) => eq.status === "retired");

  let summary = "";
  if (equipment.length === 0) {
    summary = "No equipment registered";
  } else if (activeEquipment.length > 0) {
    summary = `${activeEquipment.length} active`;
    if (inServiceEquipment.length > 0) {
      summary += `, ${inServiceEquipment.length} in service`;
    }
  } else if (retiredEquipment.length > 0) {
    summary = `${retiredEquipment.length} retired`;
  } else {
    summary = `${equipment.length} total`;
  }

  // Transform equipment to match expected type
  const transformedEquipment = (equipment || []).map((eq: any) => {
    const property = Array.isArray(eq.property) ? eq.property[0] : eq.property;

    return {
      id: eq.id,
      companyId: eq.company_id,
      customerId: eq.customer_id,
      propertyId: eq.property_id,
      equipmentNumber: eq.equipment_number,
      assetId: eq.equipment_number, // Alias for table compatibility
      name: eq.name,
      type: eq.type,
      category: eq.category,
      manufacturer: eq.manufacturer,
      model: eq.model,
      serialNumber: eq.serial_number,
      modelYear: eq.model_year,
      status: eq.status,
      condition: eq.condition,
      location: eq.location,
      assignedTo: eq.assigned_to,
      property: property ? {
        address: property.address,
        city: property.city,
        state: property.state,
      } : null,
      installDate: eq.install_date ? new Date(eq.install_date) : null,
      lastServiceDate: eq.last_service_date ? new Date(eq.last_service_date) : null,
      nextServiceDue: eq.next_service_due ? new Date(eq.next_service_due) : null,
      warrantyExpiration: eq.warranty_expiration ? new Date(eq.warranty_expiration) : null,
      notes: eq.notes,
      createdAt: new Date(eq.created_at),
      updatedAt: new Date(eq.updated_at),
    } as any;
  });

  if (!equipment || equipment.length === 0) {
    return (
      <NodeViewWrapper className="equipment-table-block">
        <CollapsibleSectionWrapper
          title="Equipment (0)"
          icon={<Wrench className="size-5" />}
          defaultOpen={false}
          storageKey="customer-equipment-section"
          summary="No equipment registered"
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddEquipment}
              className="gap-1"
            >
              <Plus className="size-4" />
              Add Equipment
            </Button>
          }
        >
          <div className="rounded-lg border bg-muted/30 p-8 text-center">
            <Wrench className="mx-auto mb-3 size-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No equipment registered</p>
          </div>
        </CollapsibleSectionWrapper>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="equipment-table-block">
      <CollapsibleSectionWrapper
        title={`Equipment (${equipment.length})`}
        icon={<Wrench className="size-5" />}
        defaultOpen={false}
        storageKey="customer-equipment-section"
        summary={summary}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddEquipment}
            className="gap-1"
          >
            <Plus className="size-4" />
            Add Equipment
          </Button>
        }
      >
        {/* Use EquipmentTable component */}
        <div className="-mx-6 -mt-6 -mb-6">
          <EquipmentTable equipment={transformedEquipment} itemsPerPage={10} />
        </div>
      </CollapsibleSectionWrapper>
    </NodeViewWrapper>
  );
}

// Tiptap Node Extension
export const EquipmentTableBlock = Node.create({
  name: "equipmentTableBlock",

  group: "block",

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      equipment: {
        default: [],
      },
      customerId: {
        default: null,
      },
    } as any;
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="equipment-table-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "equipment-table-block" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EquipmentTableBlockComponent);
  },

  addCommands() {
    return {
      insertEquipmentTableBlock:
        (attributes: any) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    } as any;
  },
});
