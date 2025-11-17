/**
 * Job Equipment Section
 * Displays equipment serviced or used on this job
 */

"use client";

import { Wrench } from "lucide-react";
import { updateEntityTags } from "@/actions/entity-tags";
import { EntityTags } from "@/components/shared/tags/entity-tags";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type JobEquipmentProps = {
	equipment: any[];
};

export function JobEquipment({ equipment }: JobEquipmentProps) {
	if (equipment.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Wrench className="text-muted-foreground mb-4 size-12" />
				<h3 className="mb-2 text-lg font-semibold">No Equipment</h3>
				<p className="text-muted-foreground text-sm">
					No equipment has been added to this job yet.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="overflow-x-auto rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Equipment</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Manufacturer</TableHead>
							<TableHead>Model</TableHead>
							<TableHead>Serial #</TableHead>
							<TableHead>Tags</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{equipment.map((item) => (
							<TableRow key={item.id}>
								<TableCell className="font-medium">
									{item.name || item.equipment_name || "—"}
								</TableCell>
								<TableCell>{item.type || item.equipment_type || "—"}</TableCell>
								<TableCell>{item.manufacturer || "—"}</TableCell>
								<TableCell>{item.model || item.model_number || "—"}</TableCell>
								<TableCell className="font-mono text-xs">{item.serial_number || "—"}</TableCell>
								<TableCell className="max-w-[240px] align-top">
									<EntityTags
										entityId={item.id}
										entityType="equipment"
										onUpdateTags={(id, tags) => updateEntityTags("equipment", id, tags)}
										tags={Array.isArray(item?.metadata?.tags) ? (item.metadata.tags as any[]) : []}
									/>
								</TableCell>
								<TableCell>
									{item.status && (
										<Badge className="capitalize" variant="outline">
											{item.status}
										</Badge>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Summary */}
			<div className="bg-muted/50 rounded-md p-4">
				<p className="text-sm font-medium">Total Equipment</p>
				<p className="text-muted-foreground text-xs">
					{equipment.length} item{equipment.length !== 1 ? "s" : ""}
				</p>
			</div>
		</div>
	);
}
