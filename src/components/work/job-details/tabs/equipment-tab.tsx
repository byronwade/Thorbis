/**
 * Equipment Tab - Equipment & Service History
 */

"use client";

import { Calendar, Plus, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type EquipmentTabProps = {
	job: any;
	equipment: any[];
	property: any;
	isEditMode: boolean;
};

export function EquipmentTab({
	job,
	equipment,
	property,
	isEditMode,
}: EquipmentTabProps) {
	const formatDate = (date: string | null) => {
		if (!date) {
			return "N/A";
		}
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(new Date(date));
	};

	return (
		<div className="mx-auto max-w-6xl space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Wrench className="text-muted-foreground h-5 w-5" />
							<CardTitle>Equipment at Property</CardTitle>
							<Badge variant="secondary">{equipment.length}</Badge>
						</div>
						{isEditMode && (
							<Button size="sm">
								<Plus className="mr-2 h-4 w-4" />
								Add Equipment
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{equipment && equipment.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Equipment</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Manufacturer</TableHead>
									<TableHead>Model</TableHead>
									<TableHead>Serial #</TableHead>
									<TableHead>Last Service</TableHead>
									{isEditMode && <TableHead />}
								</TableRow>
							</TableHeader>
							<TableBody>
								{equipment.map((item) => (
									<TableRow key={item.id}>
										<TableCell className="font-medium">{item.name}</TableCell>
										<TableCell>{item.type}</TableCell>
										<TableCell>{item.manufacturer || "N/A"}</TableCell>
										<TableCell>{item.model || "N/A"}</TableCell>
										<TableCell className="font-mono text-sm">
											{item.serial_number || "N/A"}
										</TableCell>
										<TableCell>{formatDate(item.last_service_date)}</TableCell>
										{isEditMode && (
											<TableCell>
												<Button size="sm" variant="ghost">
													Service
												</Button>
											</TableCell>
										)}
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="text-muted-foreground text-center text-sm">
							No equipment recorded at this property
							{isEditMode && (
								<Button className="mt-2 ml-2" size="sm" variant="outline">
									Add First Equipment
								</Button>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Equipment Serviced on This Job */}
			{job.equipment_serviced && job.equipment_serviced.length > 0 && (
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Calendar className="text-muted-foreground h-5 w-5" />
							<CardTitle>Serviced on This Job</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{job.equipment_serviced.map((item: any, index: number) => (
								<div className="rounded-lg border p-3" key={index}>
									<p className="font-medium">{item.name}</p>
									<p className="text-muted-foreground text-sm">
										{item.service_performed}
									</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
