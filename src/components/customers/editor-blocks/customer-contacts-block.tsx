/**
 * Customer Contacts Block - Custom Tiptap Node
 *
 * Manages multiple contacts for a customer:
 * - Additional emails and phone numbers
 * - Contact titles and roles
 * - Primary/billing/emergency contact flags
 */

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleSectionWrapper } from "./collapsible-section-wrapper";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

// Dynamically import to avoid SSR issues
const CustomerContactsTable = dynamic(
  () => import("@/components/customers/customer-contacts-table").then((mod) => ({ default: mod.CustomerContactsTable })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full" />,
  }
);

// React component that renders the block
export function CustomerContactsBlockComponent({ node, editor }: any) {
  const { customerId, contactsCount = 0 } = node.attrs;
  const [triggerAddContact, setTriggerAddContact] = useState(0);

  const summary = contactsCount === 0
    ? "No additional contacts"
    : `${contactsCount} contact${contactsCount === 1 ? "" : "s"}`;

  const handleAddContact = () => {
    setTriggerAddContact(prev => prev + 1);
  };

  return (
    <NodeViewWrapper className="customer-contacts-block" data-drag-handle>
      <CollapsibleSectionWrapper
        title="Additional Contacts"
        icon={<Users className="size-5" />}
        defaultOpen={false}
        storageKey="customer-contacts-section"
        summary={summary}
        actions={
          <Button
            size="sm"
            variant="ghost"
            onClick={handleAddContact}
            className="h-8 px-3 text-xs gap-1.5"
          >
            <Plus className="size-4" />
            Add Contact
          </Button>
        }
      >
        <div className="-mx-6 -mt-6 -mb-6">
          <CustomerContactsTable customerId={customerId} triggerAdd={triggerAddContact} />
        </div>
      </CollapsibleSectionWrapper>
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
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "customer-contacts-block" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomerContactsBlockComponent);
  },

  addCommands() {
    return {
      insertCustomerContactsBlock:
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
