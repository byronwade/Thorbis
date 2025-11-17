/**
 * Customer Contacts Block - Custom Tiptap Node
 *
 * Manages multiple contacts for a customer:
 * - Additional emails and phone numbers
 * - Contact titles and roles
 * - Primary/billing/emergency contact flags
 */

import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { Plus, Users } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
	CollapsibleActionButton,
	CollapsibleDataSection,
} from "@/components/ui/collapsible-data-section";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import to avoid SSR issues
const CustomerContactsTable = dynamic(
	() =>
		import("@/components/customers/customer-contacts-table").then((mod) => ({
			default: mod.CustomerContactsTable,
		})),
	{
		ssr: false,
		loading: () => <Skeleton className="h-[300px] w-full" />,
	}
);

// React component that renders the block
export function CustomerContactsBlockComponent({ node, editor }: any) {
	const { customerId, contactsCount = 0 } = node.attrs;
	const [triggerAddContact, setTriggerAddContact] = useState(0);

	const summary =
		contactsCount === 0
			? "No additional contacts"
			: `${contactsCount} contact${contactsCount === 1 ? "" : "s"}`;

	const handleAddContact = () => {
		setTriggerAddContact((prev) => prev + 1);
	};

	return (
		<NodeViewWrapper className="customer-contacts-block" data-drag-handle>
			<CollapsibleDataSection
				actions={
					<CollapsibleActionButton icon={<Plus className="size-4" />} onClick={handleAddContact}>
						Add Contact
					</CollapsibleActionButton>
				}
				count={contactsCount}
				defaultOpen={false}
				fullWidthContent={true}
				icon={<Users className="size-5" />}
				standalone={true}
				storageKey="customer-contacts-section"
				summary={summary}
				title="Additional Contacts"
				value="customer-contacts"
			>
				<CustomerContactsTable customerId={customerId} triggerAdd={triggerAddContact} />
			</CollapsibleDataSection>
		</NodeViewWrapper>
	);
}

// Tiptap Node Extension
export const CustomerContactsBlock = Node.create({
	name: "customerContactsBlock",

	group: "block",

	atom: true,

	draggable: true,

	addAttributes() {
		return {
			customerId: {
				default: null,
			},
			contactsCount: {
				default: 0,
			},
		} as any;
	},

	parseHTML() {
		return [
			{
				tag: 'div[data-type="customer-contacts-block"]',
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"div",
			mergeAttributes(HTMLAttributes, {
				"data-type": "customer-contacts-block",
			}),
			0,
		];
	},

	addNodeView() {
		return ReactNodeViewRenderer(CustomerContactsBlockComponent);
	},

	addCommands() {
		return {
			insertCustomerContactsBlock:
				(attributes: any) =>
				({ commands }: any) =>
					commands.insertContent({
						type: this.name,
						attrs: attributes,
					}),
		} as any;
	},
});
