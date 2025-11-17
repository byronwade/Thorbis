/**
 * Notes Collapsible Block - Custom Tiptap Node
 *
 * Collapsible section containing rich text notes
 * - Customer notes (visible to all)
 * - Internal notes (team only)
 * - Both editable inline with full Tiptap formatting
 */

import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { FileText, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
	CollapsibleActionButton,
	CollapsibleDataSection,
} from "@/components/ui/collapsible-data-section";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import to avoid SSR issues
const CustomerNotesTable = dynamic(
	() =>
		import("@/components/customers/customer-notes-table").then((mod) => ({
			default: mod.CustomerNotesTable,
		})),
	{
		ssr: false,
		loading: () => <Skeleton className="h-[400px] w-full" />,
	}
);

// React component that renders the block
export function NotesCollapsibleBlockComponent({ node, editor }: any) {
	const { customerId, notesCount = 0 } = node.attrs;
	const [triggerAddNote, setTriggerAddNote] = useState(0);

	const summary =
		notesCount === 0 ? "No notes yet" : `${notesCount} note${notesCount === 1 ? "" : "s"}`;

	const handleAddNote = () => {
		setTriggerAddNote((prev) => prev + 1);
	};

	return (
		<NodeViewWrapper className="notes-collapsible-block" data-drag-handle>
			<CollapsibleDataSection
				actions={
					<CollapsibleActionButton icon={<Plus className="h-3.5 w-3.5" />} onClick={handleAddNote}>
						Add Note
					</CollapsibleActionButton>
				}
				count={notesCount}
				defaultOpen={false}
				fullWidthContent={true}
				icon={<FileText className="size-5" />}
				standalone={true}
				storageKey="customer-notes-section"
				summary={summary}
				title="Notes & Documentation"
				value="customer-notes"
			>
				<CustomerNotesTable customerId={customerId} triggerAdd={triggerAddNote} />
			</CollapsibleDataSection>
		</NodeViewWrapper>
	);
}

// Tiptap Node Extension
export const NotesCollapsibleBlock = Node.create({
	name: "notesCollapsibleBlock",

	group: "block",

	atom: true,

	draggable: true,

	addAttributes() {
		return {
			customerId: {
				default: null,
			},
			notesCount: {
				default: 0,
			},
		} as any;
	},

	parseHTML() {
		return [
			{
				tag: 'div[data-type="notes-collapsible-block"]',
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"div",
			mergeAttributes(HTMLAttributes, {
				"data-type": "notes-collapsible-block",
			}),
			0,
		];
	},

	addNodeView() {
		return ReactNodeViewRenderer(NotesCollapsibleBlockComponent);
	},

	addCommands() {
		return {
			insertNotesCollapsibleBlock:
				(attributes: any) =>
				({ commands }: any) =>
					commands.insertContent({
						type: this.name,
						attrs: attributes,
					}),
		} as any;
	},
});
