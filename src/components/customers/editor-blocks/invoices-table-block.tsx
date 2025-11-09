/**
 * Invoices Table Block - Custom Tiptap Node
 *
 * Displays customer's invoices using InvoicesTable component
 * - Same design as main invoices page
 * - Searchable, sortable, filterable
 * - Click to view invoice details
 */

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleSectionWrapper } from "./collapsible-section-wrapper";
import { CustomerInvoicesTable } from "@/components/customers/customer-invoices-table";

// React component that renders the block
export function InvoicesTableBlockComponent({ node, editor }: any) {
  const { invoices, customerId } = node.attrs;

  const handleAddInvoice = () => {
    // Navigate to create invoice page with customer pre-selected
    window.location.href = `/dashboard/work/invoices/create?customerId=${customerId}`;
  };

  // Calculate invoice summary
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  const pastDueInvoices = (invoices || []).filter((inv: any) => inv.status === "overdue");
  const pastDueTotal = pastDueInvoices.reduce((sum: number, inv: any) => sum + (inv.balance_due || 0), 0);
  const unpaidInvoices = (invoices || []).filter((inv: any) =>
    inv.status !== "paid" && inv.status !== "cancelled"
  );
  const unpaidTotal = unpaidInvoices.reduce((sum: number, inv: any) => sum + (inv.balance_due || 0), 0);

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

  if (!invoices || invoices.length === 0) {
    return (
      <NodeViewWrapper className="invoices-table-block">
        <CollapsibleSectionWrapper
          title="Invoices (0)"
          icon={<FileText className="size-5" />}
          defaultOpen={false}
          storageKey="customer-invoices-section"
          actions={
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAddInvoice}
              className="h-8 px-3 text-xs gap-1.5"
            >
              <Plus className="size-4" />
              Add Invoice
            </Button>
          }
        >
          <div className="rounded-lg border bg-muted/30 p-8 text-center">
            <FileText className="mx-auto mb-3 size-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No invoices yet</p>
          </div>
        </CollapsibleSectionWrapper>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="invoices-table-block">
      <CollapsibleSectionWrapper
        title={`Invoices (${invoices.length})`}
        icon={<FileText className="size-5" />}
        defaultOpen={false}
        storageKey="customer-invoices-section"
        summary={summary}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddInvoice}
            className="gap-1"
          >
            <Plus className="size-4" />
            Add Invoice
          </Button>
        }
      >
        {/* Customer invoices table with quick actions - uses FullWidthDatatable */}
        <div className="-mx-6 -mt-6 -mb-6">
          <CustomerInvoicesTable invoices={invoices || []} />
        </div>
      </CollapsibleSectionWrapper>
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
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "invoices-table-block" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(InvoicesTableBlockComponent);
  },

  addCommands() {
    return {
      insertInvoicesTableBlock:
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
