"use client";

import { ArrowUpRight, CalendarDays, FileText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ColumnMeta, EntityKanban } from "@/components/ui/entity-kanban";
import type { KanbanItemBase } from "@/components/ui/shadcn-io/kanban";
import type { Invoice } from "@/components/work/invoices-table";
import { cn } from "@/lib/utils";

type InvoiceStatus = Invoice["status"];

type InvoicesKanbanItem = KanbanItemBase & {
	invoice: Invoice;
};

const INVOICE_COLUMNS: Array<{
	id: InvoiceStatus;
	name: string;
	accentColor: string;
}> = [
	{ id: "draft", name: "Draft", accentColor: "#6B7280" },
	{ id: "pending", name: "Pending", accentColor: "#F59E0B" },
	{ id: "paid", name: "Paid", accentColor: "#22C55E" },
	{ id: "overdue", name: "Overdue", accentColor: "#EF4444" },
];

const columnLabel = new Map(
	INVOICE_COLUMNS.map((column) => [column.id, column.name]),
);

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

export function InvoicesKanban({ invoices }: { invoices: Invoice[] }) {
	return (
		<EntityKanban<Invoice, InvoiceStatus>
			calculateColumnMeta={(columnId, items): ColumnMeta => {
				const columnItems = items.filter((item) => item.columnId === columnId);
				const total = columnItems.reduce(
					(sum, item) => sum + (item.entity as Invoice).amount,
					0,
				);
				return { count: columnItems.length, total };
			}}
			columns={INVOICE_COLUMNS}
			data={invoices}
			entityName="invoices"
			formatTotal={(total) => currencyFormatter.format(total / 100)}
			mapToKanbanItem={(invoice) => ({
				id: invoice.id,
				columnId: invoice.status,
				entity: invoice,
				invoice,
			})}
			renderCard={(item) => (
				<InvoiceCard
					item={{ ...item, invoice: item.entity } as InvoicesKanbanItem}
				/>
			)}
			renderDragOverlay={(item) => (
				<div className="border-border/70 bg-background/95 w-[280px] rounded-xl border p-4 shadow-lg">
					<InvoiceCard
						item={{ ...item, invoice: item.entity } as InvoicesKanbanItem}
					/>
				</div>
			)}
			showTotals={true}
			updateEntityStatus={(invoice, newStatus) => ({
				...invoice,
				status: newStatus,
			})}
		/>
	);
}

function InvoiceCard({ item }: { item: InvoicesKanbanItem }) {
	const { invoice, columnId } = item;
	return (
		<div className="space-y-3">
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-1">
					<p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
						{invoice.invoiceNumber}
					</p>
					<h3 className="text-foreground text-sm font-semibold">
						{invoice.customer}
					</h3>
					<div className="flex flex-wrap items-center gap-2">
						<Badge
							className={cn(
								"text-xs",
								columnId === "overdue" && "bg-destructive/10 text-destructive",
								columnId === "paid" && "bg-primary/10 text-primary",
							)}
							variant={
								columnId === "overdue"
									? "destructive"
									: columnId === "paid"
										? "secondary"
										: "outline"
							}
						>
							{columnLabel.get(columnId as InvoiceStatus) ?? columnId}
						</Badge>
						<Badge
							className="bg-muted/60 text-muted-foreground"
							variant="outline"
						>
							{currencyFormatter.format(invoice.amount / 100)}
						</Badge>
					</div>
				</div>
			</div>

			<div className="text-muted-foreground space-y-2 text-xs">
				<div className="flex items-center gap-2">
					<FileText className="text-primary size-4" />
					<span>Issued {invoice.date}</span>
				</div>
				<div className="flex items-center gap-2">
					<CalendarDays className="text-primary size-4" />
					<span
						className={cn(
							"font-medium",
							columnId === "overdue" ? "text-destructive" : "text-foreground",
						)}
					>
						Due {invoice.dueDate}
					</span>
				</div>
			</div>

			<div className="text-muted-foreground flex items-center justify-between pt-2 text-xs">
				<span>Total {currencyFormatter.format(invoice.amount / 100)}</span>
				<Button
					asChild
					className="text-primary gap-1 text-xs"
					size="sm"
					variant="ghost"
				>
					<Link href={`/dashboard/work/invoices/${invoice.id}`}>
						View
						<ArrowUpRight className="size-3.5" />
					</Link>
				</Button>
			</div>
		</div>
	);
}
