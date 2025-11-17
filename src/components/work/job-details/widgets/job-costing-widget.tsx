import { Separator } from "@/components/ui/separator";
import type { Job } from "@/lib/db/schema";

const mockCosts = {
	labor: 450_000,
	materials: 600_000,
	equipment: 75_000,
	subcontractors: 150_000,
	permits: 25_000,
	overhead: 50_000,
	other: 10_000,
};

import { formatCurrency } from "@/lib/formatters";

export function JobCostingWidget({ job }: { job: Job }) {
	const totalCost = Object.values(mockCosts).reduce((a, b) => a + b, 0);

	return (
		<div className="space-y-3">
			<div className="space-y-2 text-xs">
				<div className="flex justify-between">
					<span className="text-muted-foreground">Labor</span>
					<span className="font-medium">{formatCurrency(mockCosts.labor)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Materials</span>
					<span className="font-medium">{formatCurrency(mockCosts.materials)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Equipment</span>
					<span className="font-medium">{formatCurrency(mockCosts.equipment)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Subcontractors</span>
					<span className="font-medium">{formatCurrency(mockCosts.subcontractors)}</span>
				</div>
			</div>
			<Separator />
			<div className="flex justify-between text-sm font-bold">
				<span>Total Cost</span>
				<span>{formatCurrency(totalCost)}</span>
			</div>
		</div>
	);
}
