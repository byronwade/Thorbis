/**
 * Equipment Table Block - Custom Tiptap Node
 *
 * Displays customer's equipment using EquipmentTable component
 * - Shows property location for each equipment
 * - Shows assigned user
 * - Same datatable design as Jobs/Invoices
 */

import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { Plus, Wrench } from "lucide-react";
import dynamic from "next/dynamic";
import {
	CollapsibleActionButton,
	CollapsibleDataSection,
	EmptyStateActionButton,
} from "@/components/ui/collapsible-data-section";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import to avoid SSR issues
const EquipmentTable = dynamic(
	() =>
		import("@/components/work/equipment-table").then((mod) => ({
			default: mod.EquipmentTable,
		})),
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
			property: property
				? {
						address: property.address,
						city: property.city,
						state: property.state,
					}
				: null,
			installDate: eq.install_date ? new Date(eq.install_date) : null,
			lastServiceDate: eq.last_service_date ? new Date(eq.last_service_date) : null,
			nextServiceDue: eq.next_service_due ? new Date(eq.next_service_due) : null,
			warrantyExpiration: eq.warranty_expiration ? new Date(eq.warranty_expiration) : null,
			notes: eq.notes,
			createdAt: new Date(eq.created_at),
			updatedAt: new Date(eq.updated_at),
		} as any;
	});

	return (
		<NodeViewWrapper className="equipment-table-block">
			<CollapsibleDataSection
				actions={
					<CollapsibleActionButton icon={<Plus className="size-4" />} onClick={handleAddEquipment}>
						Add Equipment
					</CollapsibleActionButton>
				}
				count={equipment.length}
				defaultOpen={false}
				emptyState={
					!equipment || equipment.length === 0
						? {
								show: true,
								icon: <Wrench className="text-muted-foreground h-8 w-8" />,
								title: "No equipment registered",
								description: "Get started by adding your first equipment.",
								action: (
									<EmptyStateActionButton
										icon={<Plus className="size-4" />}
										onClick={handleAddEquipment}
									>
										Add Equipment
									</EmptyStateActionButton>
								),
							}
						: undefined
				}
				fullWidthContent={true}
				icon={<Wrench className="size-5" />}
				standalone={true}
				storageKey="customer-equipment-section"
				summary={summary}
				title={`Equipment (${equipment.length})`}
				value="customer-equipment"
			>
				{/* Use EquipmentTable component */}
				<EquipmentTable equipment={transformedEquipment} itemsPerPage={10} />
			</CollapsibleDataSection>
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
				({ commands }: any) =>
					commands.insertContent({
						type: this.name,
						attrs: attributes,
					}),
		} as any;
	},
});
