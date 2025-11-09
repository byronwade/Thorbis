/**
 * Notes Collapsible Block - Custom Tiptap Node
 *
 * Collapsible section containing rich text notes
 * - Customer notes (visible to all)
 * - Internal notes (team only)
 * - Both editable inline with full Tiptap formatting
 */

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleSectionWrapper } from "./collapsible-section-wrapper";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

// Dynamically import to avoid SSR issues
const CustomerNotesTable = dynamic(
  () => import("@/components/customers/customer-notes-table").then((mod) => ({ default: mod.CustomerNotesTable })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />,
  }
);

// React component that renders the block
export function NotesCollapsibleBlockComponent({ node, editor }: any) {
  const { customerId, notesCount = 0 } = node.attrs;
  const [triggerAddNote, setTriggerAddNote] = useState(0);

  const summary = notesCount === 0
    ? "No notes yet"
    : `${notesCount} note${notesCount === 1 ? "" : "s"}`;

  const handleAddNote = () => {
    setTriggerAddNote(prev => prev + 1);
  };

  return (
    <NodeViewWrapper className="notes-collapsible-block" data-drag-handle>
      <CollapsibleSectionWrapper
        title="Notes & Documentation"
        icon={<FileText className="size-5" />}
        defaultOpen={false}
        storageKey="customer-notes-section"
        summary={summary}
        actions={
          <Button
            size="sm"
            variant="ghost"
            onClick={handleAddNote}
            className="h-8 px-3 text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Note
          </Button>
        }
      >
        <div className="-mx-6 -mt-6 -mb-6">
          <CustomerNotesTable customerId={customerId} triggerAdd={triggerAddNote} />
        </div>
      </CollapsibleSectionWrapper>
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
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "notes-collapsible-block" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(NotesCollapsibleBlockComponent);
  },

  addCommands() {
    return {
      insertNotesCollapsibleBlock:
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
