"use client";

import { ArrowUpRight, CalendarDays, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EntityKanban } from "@/components/ui/entity-kanban";
import type { KanbanItemBase } from "@/components/ui/shadcn-io/kanban";
import type { Contract } from "@/components/work/contracts-table";
import { cn } from "@/lib/utils";

type ContractStatus = Contract["status"];

type ContractsKanbanItem = KanbanItemBase & {
	contract: Contract;
};

const CONTRACT_COLUMNS: Array<{
	id: ContractStatus;
	name: string;
	accentColor: string;
}> = [
	{ id: "draft", name: "Draft", accentColor: "#6B7280" },
	{ id: "sent", name: "Sent", accentColor: "#2563EB" },
	{ id: "viewed", name: "Viewed", accentColor: "#9333EA" },
	{ id: "signed", name: "Signed", accentColor: "#22C55E" },
	{ id: "rejected", name: "Rejected", accentColor: "#EF4444" },
	{ id: "expired", name: "Expired", accentColor: "#F97316" },
];

const columnLabel = new Map(CONTRACT_COLUMNS.map((column) => [column.id, column.name]));

export function ContractsKanban({ contracts }: { contracts: Contract[] }) {
	return (
		<EntityKanban<Contract, ContractStatus>
			columns={CONTRACT_COLUMNS}
			data={contracts}
			entityName="contracts"
			mapToKanbanItem={(contract) => ({
				id: contract.id,
				columnId: contract.status,
				entity: contract,
				contract,
			})}
			renderCard={(item) => (
				<ContractCard item={{ ...item, contract: item.entity } as ContractsKanbanItem} />
			)}
			renderDragOverlay={(item) => (
				<div className="border-border/70 bg-background/95 w-[280px] rounded-xl border p-4 shadow-lg">
					<ContractCard item={{ ...item, contract: item.entity } as ContractsKanbanItem} />
				</div>
			)}
			updateEntityStatus={(contract, newStatus) => ({
				...contract,
				status: newStatus,
			})}
		/>
	);
}

function ContractCard({ item }: { item: ContractsKanbanItem }) {
	const { contract, columnId } = item;

	return (
		<div className="space-y-3">
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-1">
					<p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
						{contract.contractNumber}
					</p>
					<h3 className="text-foreground text-sm leading-snug font-semibold">{contract.title}</h3>
					<div className="flex flex-wrap items-center gap-2">
						<Badge
							className={cn(
								"text-xs",
								columnId === "rejected" && "bg-destructive/10 text-destructive",
								columnId === "signed" && "bg-primary/10 text-primary"
							)}
							variant={
								columnId === "signed"
									? "secondary"
									: columnId === "rejected"
										? "destructive"
										: "outline"
							}
						>
							{columnLabel.get(columnId as ContractStatus) ?? columnId}
						</Badge>
						<Badge className="text-xs" variant="outline">
							{contract.contractType}
						</Badge>
					</div>
				</div>
			</div>

			<div className="text-muted-foreground space-y-2 text-xs">
				<div className="flex items-center gap-2">
					<Users className="text-primary size-4" />
					<span className="text-foreground font-medium">{contract.customer}</span>
				</div>
				<div className="flex items-center gap-2">
					<CalendarDays className="text-primary size-4" />
					<span>
						{contract.date} → {contract.validUntil}
					</span>
				</div>
				<p>
					Signer:{" "}
					<span className="text-foreground font-medium">{contract.signerName ?? "Unassigned"}</span>
				</p>
			</div>

			<div className="text-muted-foreground flex items-center justify-between pt-2 text-xs">
				<span>Status: {columnLabel.get(columnId as ContractStatus)}</span>
				<Button asChild className="text-primary gap-1 text-xs" size="sm" variant="ghost">
					<Link href={`/dashboard/work/contracts/${contract.id}`}>
						View
						<ArrowUpRight className="size-3.5" />
					</Link>
				</Button>
			</div>
		</div>
	);
}
