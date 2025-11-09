/**
 * Invoices Table Block - Custom Tiptap Node
 *
 * Displays customer's invoices using InvoicesTable component
 * - Same design as main invoices page
 * - Searchable, sortable, filterable
 * - Click to view invoice details
 */

import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { FileText, Plus } from "lucide-react";
import { CustomerInvoicesTable } from "@/components/customers/customer-invoices-table";
import {
  CollapsibleActionButton,
  CollapsibleDataSection,
  EmptyStateActionButton,
} from "@/components/ui/collapsible-data-section";

// React component that renders the block
export function InvoicesTableBlockComponent({ node, editor }: any) {
  const { invoices, customerId } = node.attrs;

  const handleAddInvoice = () => {
    // Navigate to create invoice page with customer pre-selected
    window.location.href = `/dashboard/work/invoices/create?customerId=${customerId}`;
  };

  // Calculate invoice summary
  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);

  const pastDueInvoices = (invoices || []).filter(
    (inv: any) => inv.status === "overdue"
  );
  const pastDueTotal = pastDueInvoices.reduce(
    (sum: number, inv: any) => sum + (inv.balance_due || 0),
    0
  );
  const unpaidInvoices = (invoices || []).filter(
    (inv: any) => inv.status !== "paid" && inv.status !== "cancelled"
  );
  const unpaidTotal = unpaidInvoices.reduce(
    (sum: number, inv: any) => sum + (inv.balance_due || 0),
    0
  );

  let summary = "";
  if (invoices.length === 0) {
    summary = "No invoices yet";
  } else if (pastDueTotal > 0) {
    summary = `${pastDueInvoices.length} past due totaling ${formatCurrency(pastDueTotal)}`;
  } else if (unpaidTotal > 0) {
    summary = `${unpaidInvoices.length} unpaid totaling ${formatCurrency(unpaidTotal)}`;
  } else {
    summary = "All invoices paid";
  }

  // No transformation needed - CustomerInvoicesTable handles raw data

  return (
    <NodeViewWrapper className="invoices-table-block">
      <CollapsibleDataSection
        actions={
          <CollapsibleActionButton
            icon={<Plus className="size-4" />}
            onClick={handleAddInvoice}
          >
            Add Invoice
          </CollapsibleActionButton>
        }
        count={invoices.length}
        defaultOpen={false}
        emptyState={
          !invoices || invoices.length === 0
            ? {
                show: true,
                icon: <FileText className="h-8 w-8 text-muted-foreground" />,
                title: "No invoices found",
                description: "Get started by creating your first invoice.",
                action: (
                  <EmptyStateActionButton
                    icon={<Plus className="size-4" />}
                    onClick={handleAddInvoice}
                  >
                    Add Invoice
                  </EmptyStateActionButton>
                ),
              }
            : undefined
        }
        fullWidthContent={true}
        icon={<FileText className="size-5" />}
        standalone={true}
        storageKey="customer-invoices-section"
        summary={summary}
        title={`Invoices (${invoices.length})`}
        value="customer-invoices"
      >
        {/* Customer invoices table with quick actions - uses FullWidthDatatable */}
        <CustomerInvoicesTable invoices={invoices || []} />
      </CollapsibleDataSection>
    </NodeViewWrapper>
  );
}

// Tiptap Node Extension
export const InvoicesTableBlock = Node.create({
  name: "invoicesTableBlock",

  group: "block",

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      invoices: {
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
        tag: 'div[data-type="invoices-table-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "invoices-table-block" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(InvoicesTableBlockComponent);
  },

  addCommands() {
    return {
      insertInvoicesTableBlock:
        (attributes: any) =>
        ({ commands }: any) =>
          commands.insertContent({
            type: this.name,
            attrs: attributes,
          }),
    } as any;
  },
});
