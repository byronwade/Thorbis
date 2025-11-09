/**
 * Customer Badges Block - Custom Tiptap Node
 *
 * Displays customer badges at the top of the profile:
 * - Custom badges
 * - Premade badges (DO NOT SERVICE, VIP, etc.)
 * - Auto-generated badges (past due, payment status)
 */

import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import to avoid SSR issues
const CustomerBadges = dynamic(
  () =>
    import("@/components/customers/customer-badges").then((mod) => ({
      default: mod.CustomerBadges,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-16 w-full" />,
  }
);

// React component that renders the block
export function CustomerBadgesBlockComponent({ node }: any) {
  const { customerId } = node.attrs;

  return (
    <NodeViewWrapper className="customer-badges-block">
      <CustomerBadges customerId={customerId} />
    </NodeViewWrapper>
  );
}

// Tiptap Node Extension
export const CustomerBadgesBlock = Node.create({
  name: "customerBadgesBlock",

  group: "block",

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      customerId: {
        default: null,
      },
    } as any;
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="customer-badges-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "customer-badges-block" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomerBadgesBlockComponent);
  },

  addCommands() {
    return {
      insertCustomerBadgesBlock:
        (attributes: any) =>
        ({ commands }: any) =>
          commands.insertContent({
            type: this.name,
            attrs: attributes,
          }),
    } as any;
  },
});
