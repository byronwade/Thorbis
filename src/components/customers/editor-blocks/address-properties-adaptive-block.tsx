/**
 * Address/Properties Adaptive Block - Custom Tiptap Node
 *
 * Smart block that adapts based on number of properties:
 * - 0-1 properties: Shows as "Address" (simple address editor)
 * - 2+ properties: Shows as "Properties" (list of property cards)
 *
 * This creates a cleaner UX - users don't see confusing "Properties"
 * section when there's only one address.
 */

import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { MapPin, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import {
	CollapsibleActionButton,
	CollapsibleDataSection,
} from "@/components/ui/collapsible-data-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import PropertiesTable to avoid SSR issues with Tiptap
const PropertiesTable = dynamic(
	() =>
		import("@/components/customers/properties-table").then((mod) => ({
			default: mod.PropertiesTable,
		})),
	{
		ssr: false,
		loading: () => <Skeleton className="h-[200px] w-full" />,
	}
);

// React component that renders the block
export function AddressPropertiesAdaptiveBlockComponent({ node, updateAttributes, editor }: any) {
	const {
		// Primary address from customer record
		address,
		address2,
		city,
		state,
		zipCode,
		country,
		// Properties array
		properties,
		customerId,
	} = node.attrs;

	const _isEditable = editor.isEditable;
	const propertyCount = properties?.length || 0;

	const handleAddProperty = () => {
		// Navigate to add property page with customer pre-selected
		window.location.href = `/dashboard/work/properties/new?customerId=${customerId}`;
	};

	// CASE 1: Single Address (0-1 properties)
	// Show simple address editor/display
	if (propertyCount <= 1) {
		const _fullAddress = [
			address,
			address2,
			[city, state].filter(Boolean).join(", "),
			zipCode,
			country !== "USA" ? country : null,
		]
			.filter(Boolean)
			.join("\n");

		return (
			<NodeViewWrapper className="address-properties-block">
				<CollapsibleDataSection
					defaultOpen={true}
					icon={<MapPin className="size-5" />}
					standalone={true}
					storageKey="customer-address-section"
					title="Address"
					value="customer-address"
				>
					<div className="space-y-4">
						{/* Address Line 1 */}
						<div className="space-y-2">
							<Label htmlFor={`address-${node.attrs.id}`}>Street Address</Label>
							<Input
								id={`address-${node.attrs.id}`}
								onChange={(e) => updateAttributes({ address: e.target.value })}
								placeholder="123 Main Street"
								value={address || ""}
							/>
						</div>

						{/* Address Line 2 */}
						<div className="space-y-2">
							<Label htmlFor={`address2-${node.attrs.id}`}>Apartment, suite, etc. (optional)</Label>
							<Input
								id={`address2-${node.attrs.id}`}
								onChange={(e) => updateAttributes({ address2: e.target.value })}
								placeholder="Suite 100"
								value={address2 || ""}
							/>
						</div>

						{/* City, State, ZIP */}
						<div className="grid gap-4 md:grid-cols-3">
							<div className="space-y-2">
								<Label htmlFor={`city-${node.attrs.id}`}>City</Label>
								<Input
									id={`city-${node.attrs.id}`}
									onChange={(e) => updateAttributes({ city: e.target.value })}
									placeholder="San Francisco"
									value={city || ""}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor={`state-${node.attrs.id}`}>State</Label>
								<Input
									id={`state-${node.attrs.id}`}
									maxLength={2}
									onChange={(e) => updateAttributes({ state: e.target.value })}
									placeholder="CA"
									value={state || ""}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor={`zipCode-${node.attrs.id}`}>ZIP Code</Label>
								<Input
									id={`zipCode-${node.attrs.id}`}
									onChange={(e) => updateAttributes({ zipCode: e.target.value })}
									placeholder="94102"
									value={zipCode || ""}
								/>
							</div>
						</div>

						{/* Country */}
						<div className="space-y-2">
							<Label htmlFor={`country-${node.attrs.id}`}>Country</Label>
							<Input
								id={`country-${node.attrs.id}`}
								onChange={(e) => updateAttributes({ country: e.target.value })}
								placeholder="USA"
								value={country || "USA"}
							/>
						</div>
					</div>
				</CollapsibleDataSection>
			</NodeViewWrapper>
		);
	}

	// CASE 2: Multiple Properties (2+)
	// Show datatable with enriched API data
	const formatCurrency = (cents: number | undefined) => {
		if (!cents) {
			return "—";
		}
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(cents / 100);
	};

	// Calculate total property value
	const totalValue = properties.reduce(
		(sum: number, p: any) => sum + (p.enrichment?.ownership?.marketValue || 0),
		0
	);

	return (
		<NodeViewWrapper className="address-properties-block">
			<CollapsibleDataSection
				actions={
					<CollapsibleActionButton icon={<Plus className="size-4" />} onClick={handleAddProperty}>
						Add Property
					</CollapsibleActionButton>
				}
				count={properties.length}
				defaultOpen={false}
				fullWidthContent={true}
				icon={<MapPin className="size-5" />}
				standalone={true}
				storageKey="customer-properties-section"
				summary={
					totalValue > 0
						? `Total value: ${formatCurrency(totalValue)}`
						: `${properties.length} locations`
				}
				title={`Properties (${properties.length})`}
				value="customer-properties"
			>
				{/* Full-width datatable with search/sort/pagination and hover maps */}
				<PropertiesTable customerId={customerId} itemsPerPage={10} properties={properties} />
			</CollapsibleDataSection>
		</NodeViewWrapper>
	);
}

// Tiptap Node Extension
export const AddressPropertiesAdaptiveBlock = Node.create({
	name: "addressPropertiesAdaptiveBlock",

	group: "block",

	atom: true,

	draggable: true,

	addAttributes() {
		return {
			id: {
				default: null,
			},
			// Primary address fields from customer record
			address: {
				default: "",
			},
			address2: {
				default: "",
			},
			city: {
				default: "",
			},
			state: {
				default: "",
			},
			zipCode: {
				default: "",
			},
			country: {
				default: "USA",
			},
			// Properties array
			properties: {
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
				tag: 'div[data-type="address-properties-adaptive-block"]',
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"div",
			mergeAttributes(HTMLAttributes, {
				"data-type": "address-properties-adaptive-block",
			}),
			0,
		];
	},

	addNodeView() {
		return ReactNodeViewRenderer(AddressPropertiesAdaptiveBlockComponent);
	},

	addCommands() {
		return {
			insertAddressPropertiesAdaptiveBlock:
				(attributes: any) =>
				({ commands }: any) =>
					commands.insertContent({
						type: this.name,
						attrs: attributes,
					}),
		} as any;
	},
});
