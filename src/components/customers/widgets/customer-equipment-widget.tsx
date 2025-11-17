/**
 * Customer Equipment Widget - Progressive Loading
 */

"use client";

import { Package } from "lucide-react";
import Link from "next/link";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { Button } from "@/components/ui/button";
import { useCustomerEquipment } from "@/hooks/use-customer-360";
import { formatDate } from "@/lib/formatters";

type CustomerEquipmentWidgetProps = {
	customerId: string;
	loadImmediately?: boolean;
};

export function CustomerEquipmentWidget({
	customerId,
	loadImmediately = false,
}: CustomerEquipmentWidgetProps) {
	return (
		<ProgressiveWidget
			title="Equipment"
			icon={<Package className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const { data: equipment, isLoading, error } = useCustomerEquipment(customerId, isVisible);

				if (isLoading) return <WidgetSkeleton rows={3} />;
				if (error)
					return (
						<div className="text-muted-foreground text-center text-sm">
							Failed to load equipment
						</div>
					);
				if (!equipment || equipment.length === 0)
					return (
						<div className="text-muted-foreground text-center text-sm">No equipment found</div>
					);

				return (
					<div className="space-y-3">
						{equipment.map((item) => (
							<Link
								key={item.id}
								href={`/dashboard/work/equipment/${item.id}`}
								className="hover:bg-accent block rounded-lg border p-3 transition-colors"
							>
								<div className="space-y-1">
									<p className="text-sm font-medium">
										{item.name || item.equipment_number || "Unnamed Equipment"}
									</p>
									{item.type && <p className="text-muted-foreground text-xs">Type: {item.type}</p>}
									{item.manufacturer && item.model && (
										<p className="text-muted-foreground text-xs">
											{item.manufacturer} {item.model}
										</p>
									)}
									{item.serial_number && (
										<p className="text-muted-foreground text-xs">S/N: {item.serial_number}</p>
									)}
									<p className="text-muted-foreground text-xs">
										Added: {formatDate(item.created_at)}
									</p>
								</div>
							</Link>
						))}

						{equipment.length >= 10 && (
							<Button variant="outline" size="sm" className="w-full" asChild>
								<Link href={`/dashboard/work/equipment?customer=${customerId}`}>
									View All Equipment
								</Link>
							</Button>
						)}
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
