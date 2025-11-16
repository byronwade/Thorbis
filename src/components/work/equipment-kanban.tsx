"use client";

import { ArrowUpRight, CalendarDays, User, Wrench } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EntityKanban } from "@/components/ui/entity-kanban";
import type { KanbanItemBase } from "@/components/ui/shadcn-io/kanban";
import type { Equipment } from "@/components/work/equipment-table";
import { cn } from "@/lib/utils";

type EquipmentStatus = Equipment["status"];

type EquipmentKanbanItem = KanbanItemBase & {
	equipment: Equipment;
};

const EQUIPMENT_COLUMNS: Array<{
	id: EquipmentStatus;
	name: string;
	accentColor: string;
}> = [
	{ id: "available", name: "Available", accentColor: "#22C55E" },
	{ id: "in-use", name: "In Use", accentColor: "#2563EB" },
	{ id: "maintenance", name: "Maintenance", accentColor: "#F59E0B" },
	{ id: "retired", name: "Retired", accentColor: "#6B7280" },
];

const columnLabel = new Map(
	EQUIPMENT_COLUMNS.map((column) => [column.id, column.name]),
);

export function EquipmentKanban({ equipment }: { equipment: Equipment[] }) {
	return (
		<EntityKanban<Equipment, EquipmentStatus>
			columns={EQUIPMENT_COLUMNS}
			data={equipment}
			entityName="assets"
			mapToKanbanItem={(item) => ({
				id: item.id,
				columnId: item.status,
				entity: item,
				equipment: item,
			})}
			renderCard={(item) => (
				<EquipmentCard
					item={{ ...item, equipment: item.entity } as EquipmentKanbanItem}
				/>
			)}
			renderDragOverlay={(item) => (
				<div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
					<EquipmentCard
						item={{ ...item, equipment: item.entity } as EquipmentKanbanItem}
					/>
				</div>
			)}
			updateEntityStatus={(item, newStatus) => ({
				...item,
				status: newStatus,
			})}
		/>
	);
}

function EquipmentCard({ item }: { item: EquipmentKanbanItem }) {
	const { equipment, columnId } = item;

	return (
		<div className="space-y-3">
			<div>
				<p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
					{equipment.assetId}
				</p>
				<h3 className="font-semibold text-foreground text-sm">
					{equipment.name}
				</h3>
				<div className="mt-2 flex flex-wrap items-center gap-2">
					<Badge
						className={cn(
							"text-xs",
							columnId === "retired" && "bg-destructive/10 text-destructive",
							columnId === "available" && "bg-primary/10 text-primary",
						)}
						variant={
							columnId === "available"
								? "secondary"
								: columnId === "retired"
									? "destructive"
									: "outline"
						}
					>
						{columnLabel.get(columnId as EquipmentStatus) ?? columnId}
					</Badge>
					<Badge className="text-xs" variant="outline">
						{equipment.classificationLabel}
						{equipment.typeLabel &&
							equipment.typeLabel.toLowerCase() !==
								equipment.classificationLabel.toLowerCase() && (
								<span className="text-muted-foreground/80">
									{" "}
									• {equipment.typeLabel}
								</span>
							)}
					</Badge>
				</div>
			</div>

			<div className="space-y-2 text-muted-foreground text-xs">
				<div className="flex items-center gap-2">
					<User className="size-4 text-primary" />
					<span className="font-medium text-foreground">
						{equipment.assignedTo}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Wrench className="size-4 text-primary" />
					<span>Last service {equipment.lastService}</span>
				</div>
				<div className="flex items-center gap-2">
					<CalendarDays className="size-4 text-primary" />
					<span>Next service {equipment.nextService}</span>
				</div>
			</div>

			<Button
				asChild
				className="w-full justify-between text-primary text-xs"
				size="sm"
				variant="ghost"
			>
				<Link href={`/dashboard/work/equipment/${equipment.id}`}>
					View asset
					<ArrowUpRight className="size-3.5" />
				</Link>
			</Button>
		</div>
	);
}
