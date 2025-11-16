"use client";

import { ArrowUpRight, Mail, Phone, Users } from "lucide-react";
import Link from "next/link";
import type { Customer } from "@/components/customers/customers-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ColumnMeta, EntityKanban } from "@/components/ui/entity-kanban";
import type { KanbanItemBase } from "@/components/ui/shadcn-io/kanban";
import { cn } from "@/lib/utils";

type CustomerStatus = Customer["status"];

type CustomersKanbanItem = KanbanItemBase & {
	customer: Customer;
};

const CUSTOMER_COLUMNS: Array<{
	id: CustomerStatus;
	name: string;
	accentColor: string;
}> = [
	{ id: "active", name: "Active", accentColor: "#22C55E" },
	{ id: "prospect", name: "Prospect", accentColor: "#3B82F6" },
	{ id: "inactive", name: "Inactive", accentColor: "#6B7280" },
];

const columnLabel = new Map(
	CUSTOMER_COLUMNS.map((column) => [column.id, column.name]),
);

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

export function CustomersKanban({ customers }: { customers: Customer[] }) {
	return (
		<EntityKanban<Customer, CustomerStatus>
			calculateColumnMeta={(columnId, items): ColumnMeta => {
				const columnItems = items.filter((item) => item.columnId === columnId);
				const total = columnItems.reduce(
					(sum, item) => sum + (item.entity as Customer).totalValue,
					0,
				);
				return { count: columnItems.length, total };
			}}
			columns={CUSTOMER_COLUMNS}
			data={customers}
			entityName="customers"
			formatTotal={(total) => currencyFormatter.format(total / 100)}
			mapToKanbanItem={(customer) => ({
				id: customer.id,
				columnId: customer.status,
				entity: customer,
				customer,
			})}
			renderCard={(item) => (
				<CustomerCard
					item={{ ...item, customer: item.entity } as CustomersKanbanItem}
				/>
			)}
			renderDragOverlay={(item) => (
				<div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
					<CustomerCard
						item={{ ...item, customer: item.entity } as CustomersKanbanItem}
					/>
				</div>
			)}
			showTotals={true}
			updateEntityStatus={(customer, newStatus) => ({
				...customer,
				status: newStatus,
			})}
		/>
	);
}

function CustomerCard({ item }: { item: CustomersKanbanItem }) {
	const { customer, columnId } = item;
	return (
		<div className="space-y-3">
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-1">
					<h3 className="font-semibold text-foreground text-sm">
						{customer.name}
					</h3>
					<p className="text-muted-foreground text-xs">{customer.contact}</p>
					<div className="flex flex-wrap items-center gap-2">
						<Badge
							className={cn(
								"text-xs",
								columnId === "active" && "bg-primary/10 text-primary",
								columnId === "prospect" && "bg-primary/10 text-primary",
							)}
							variant={
								columnId === "active"
									? "secondary"
									: columnId === "prospect"
										? "outline"
										: "outline"
							}
						>
							{columnLabel.get(columnId as CustomerStatus) ?? columnId}
						</Badge>
						{customer.totalValue > 0 && (
							<Badge
								className="bg-muted/60 text-muted-foreground"
								variant="outline"
							>
								{currencyFormatter.format(customer.totalValue / 100)}
							</Badge>
						)}
					</div>
				</div>
			</div>

			<div className="space-y-2 text-muted-foreground text-xs">
				{customer.email && (
					<div className="flex items-center gap-2">
						<Mail className="size-4 text-primary" />
						<span className="truncate">{customer.email}</span>
					</div>
				)}
				{customer.phone && (
					<div className="flex items-center gap-2">
						<Phone className="size-4 text-primary" />
						<span>{customer.phone}</span>
					</div>
				)}
				{customer.address && (
					<div className="flex items-center gap-2">
						<Users className="size-4 text-primary" />
						<span className="truncate">
							{[customer.address, customer.city, customer.state]
								.filter(Boolean)
								.join(", ")}
						</span>
					</div>
				)}
			</div>

			<div className="flex items-center justify-between pt-2 text-muted-foreground text-xs">
				<span>
					{customer.lastService !== "None"
						? `Last: ${customer.lastService}`
						: "No services"}
				</span>
				<Button
					asChild
					className="gap-1 text-primary text-xs"
					size="sm"
					variant="ghost"
				>
					<Link href={`/dashboard/customers/${customer.id}`}>
						View
						<ArrowUpRight className="size-3.5" />
					</Link>
				</Button>
			</div>
		</div>
	);
}
