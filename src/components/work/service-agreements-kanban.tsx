"use client";

import { ArrowUpRight, CalendarDays, FileText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ColumnMeta, EntityKanban } from "@/components/ui/entity-kanban";
import type { KanbanItemBase } from "@/components/ui/shadcn-io/kanban";
import type { ServiceAgreement } from "@/components/work/service-agreements-table";
import { cn } from "@/lib/utils";

type AgreementStatus = ServiceAgreement["status"];

type ServiceAgreementKanbanItem = KanbanItemBase & {
	agreement: ServiceAgreement;
};

const AGREEMENT_COLUMNS: Array<{
	id: AgreementStatus;
	name: string;
	accentColor: string;
}> = [
	{ id: "active", name: "Active", accentColor: "#22C55E" },
	{ id: "pending", name: "Pending", accentColor: "#F59E0B" },
	{ id: "expired", name: "Expired", accentColor: "#EF4444" },
	{ id: "cancelled", name: "Cancelled", accentColor: "#6B7280" },
];

const columnLabel = new Map(AGREEMENT_COLUMNS.map((column) => [column.id, column.name]));

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

export function ServiceAgreementsKanban({ agreements }: { agreements: ServiceAgreement[] }) {
	return (
		<EntityKanban<ServiceAgreement, AgreementStatus>
			calculateColumnMeta={(columnId, items): ColumnMeta => {
				const columnItems = items.filter((item) => item.columnId === columnId);
				const total = columnItems.reduce((sum, item) => sum + (item.entity as ServiceAgreement).value, 0);
				return { count: columnItems.length, total };
			}}
			columns={AGREEMENT_COLUMNS}
			data={agreements}
			entityName="agreements"
			formatTotal={(total) => currencyFormatter.format(total / 100)}
			mapToKanbanItem={(agreement) => ({
				id: agreement.id,
				columnId: agreement.status,
				entity: agreement,
				agreement,
			})}
			renderCard={(item) => (
				<ServiceAgreementCard item={{ ...item, agreement: item.entity } as ServiceAgreementKanbanItem} />
			)}
			renderDragOverlay={(item) => (
				<div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
					<ServiceAgreementCard item={{ ...item, agreement: item.entity } as ServiceAgreementKanbanItem} />
				</div>
			)}
			showTotals={true}
			updateEntityStatus={(agreement, newStatus) => ({
				...agreement,
				status: newStatus,
			})}
		/>
	);
}

function ServiceAgreementCard({ item }: { item: ServiceAgreementKanbanItem }) {
	const { agreement, columnId } = item;

	return (
		<div className="space-y-3">
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-1">
					<p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
						{agreement.agreementNumber}
					</p>
					<h3 className="font-semibold text-foreground text-sm">{agreement.customer}</h3>
					<div className="flex flex-wrap items-center gap-2">
						<Badge
							className={cn(
								"text-xs",
								(columnId === "expired" || columnId === "cancelled") && "bg-destructive/10 text-destructive",
								columnId === "active" && "bg-primary/10 text-primary"
							)}
							variant={
								columnId === "active"
									? "secondary"
									: columnId === "expired" || columnId === "cancelled"
										? "destructive"
										: "outline"
							}
						>
							{columnLabel.get(columnId as AgreementStatus) ?? columnId}
						</Badge>
						<Badge className="text-xs" variant="outline">
							{agreement.type}
						</Badge>
						<Badge className="text-xs" variant="outline">
							{currencyFormatter.format(agreement.value / 100)}
						</Badge>
					</div>
				</div>
			</div>

			<div className="space-y-2 text-muted-foreground text-xs">
				<div className="flex items-center gap-2">
					<CalendarDays className="size-4 text-primary" />
					<span>
						{agreement.startDate} → {agreement.endDate}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<FileText className="size-4 text-primary" />
					<span>{agreement.type}</span>
				</div>
			</div>

			<Button asChild className="w-full justify-between text-primary text-xs" size="sm" variant="ghost">
				<Link href={`/dashboard/work/service-agreements/${agreement.id}`}>
					View agreement
					<ArrowUpRight className="size-3.5" />
				</Link>
			</Button>
		</div>
	);
}
