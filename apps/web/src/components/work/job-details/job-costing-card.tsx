"use client";

import {
	AlertCircle,
	Calculator,
	Clock,
	DollarSign,
	Edit,
	Package,
	Save,
	TrendingDown,
	TrendingUp,
	Users,
	Wrench,
	X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	StandardFormField,
	StandardFormRow,
} from "@/components/ui/standard-form-field";
import { formatCurrency } from "@/lib/formatters";

interface JobCostingData {
	// Labor
	labor_hours_estimated?: number;
	labor_hours_actual?: number;
	labor_rate?: number;
	labor_burden_percent?: number;
	labor_cost_total?: number;

	// Materials
	materials_cost_actual?: number;
	materials_markup_percent?: number;
	materials_revenue?: number;

	// Other Costs
	equipment_cost?: number;
	subcontractor_cost?: number;
	overhead_allocation?: number;

	// Totals
	total_cost_actual?: number;
	total_revenue?: number;
	profit_margin_actual?: number;
	profit_margin_target?: number;
}

interface JobCostingCardProps {
	jobId: string;
	costing: JobCostingData;
	editable?: boolean;
	onSave?: (data: JobCostingData) => Promise<void>;
}

export function JobCostingCard({
	jobId,
	costing,
	editable = false,
	onSave,
}: JobCostingCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [formData, setFormData] = useState<JobCostingData>(costing);

	// Calculate derived values
	const laborCost =
		(formData.labor_hours_actual || 0) *
		(formData.labor_rate || 0) *
		(1 + (formData.labor_burden_percent || 30) / 100);

	const totalCost =
		laborCost +
		(formData.materials_cost_actual || 0) +
		(formData.equipment_cost || 0) +
		(formData.subcontractor_cost || 0) +
		(formData.overhead_allocation || 0);

	const materialsRevenue =
		(formData.materials_cost_actual || 0) *
		(1 + (formData.materials_markup_percent || 50) / 100);

	const totalRevenue = formData.total_revenue || 0 || materialsRevenue;
	const profit = totalRevenue - totalCost;
	const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
	const targetMargin = formData.profit_margin_target || 40;

	const marginStatus =
		profitMargin >= targetMargin
			? "success"
			: profitMargin >= targetMargin * 0.8
				? "warning"
				: "danger";

	const handleSave = async () => {
		if (!onSave) return;

		setIsSaving(true);
		try {
			const updatedData = {
				...formData,
				labor_cost_total: laborCost,
				materials_revenue: materialsRevenue,
				total_cost_actual: totalCost,
				total_revenue: totalRevenue,
				profit_margin_actual: profitMargin,
			};

			await onSave(updatedData);
			setIsEditing(false);
		} catch (error) {
			console.error("Failed to save costing data:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setFormData(costing);
		setIsEditing(false);
	};

	const updateField = (field: keyof JobCostingData, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value === "" ? undefined : parseFloat(value),
		}));
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Calculator className="h-5 w-5 text-primary" />
						<div>
							<CardTitle>Job Costing & Profitability</CardTitle>
							<CardDescription>
								Track costs, revenue, and profit margin
							</CardDescription>
						</div>
					</div>
					{editable && !isEditing && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsEditing(true)}
						>
							<Edit className="mr-2 h-4 w-4" />
							Edit Costing
						</Button>
					)}
					{isEditing && (
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={handleCancel}
								disabled={isSaving}
							>
								<X className="mr-2 h-4 w-4" />
								Cancel
							</Button>
							<Button size="sm" onClick={handleSave} disabled={isSaving}>
								<Save className="mr-2 h-4 w-4" />
								{isSaving ? "Saving..." : "Save"}
							</Button>
						</div>
					)}
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* Summary Cards */}
				<div className="grid gap-4 md:grid-cols-4">
					<div className="rounded-lg border bg-card p-4">
						<div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs font-medium uppercase">
							<DollarSign className="h-3 w-3" />
							Total Cost
						</div>
						<div className="text-2xl font-bold">
							{formatCurrency(totalCost)}
						</div>
					</div>

					<div className="rounded-lg border bg-card p-4">
						<div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs font-medium uppercase">
							<DollarSign className="h-3 w-3" />
							Total Revenue
						</div>
						<div className="text-2xl font-bold">
							{formatCurrency(totalRevenue)}
						</div>
					</div>

					<div className="rounded-lg border bg-card p-4">
						<div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs font-medium uppercase">
							<TrendingUp className="h-3 w-3" />
							Profit
						</div>
						<div
							className={`text-2xl font-bold ${profit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
						>
							{formatCurrency(profit)}
						</div>
					</div>

					<div className="rounded-lg border bg-card p-4">
						<div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs font-medium uppercase">
							{profitMargin >= targetMargin ? (
								<TrendingUp className="h-3 w-3" />
							) : (
								<TrendingDown className="h-3 w-3" />
							)}
							Margin
						</div>
						<div className="flex items-center gap-2">
							<div className="text-2xl font-bold">
								{profitMargin.toFixed(1)}%
							</div>
							<Badge
								variant={
									marginStatus === "success"
										? "default"
										: marginStatus === "warning"
											? "secondary"
											: "destructive"
								}
							>
								Target: {targetMargin}%
							</Badge>
						</div>
					</div>
				</div>

				<Separator />

				{/* Labor Costs */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<Clock className="h-4 w-4 text-primary" />
						<h4 className="font-semibold">Labor Costs</h4>
					</div>

					<StandardFormRow cols={2}>
						<StandardFormField
							label="Estimated Hours"
							htmlFor="labor_hours_estimated"
						>
							<Input
								id="labor_hours_estimated"
								type="number"
								step="0.25"
								value={formData.labor_hours_estimated || ""}
								onChange={(e) =>
									updateField("labor_hours_estimated", e.target.value)
								}
								disabled={!isEditing}
								placeholder="8.0"
							/>
						</StandardFormField>

						<StandardFormField
							label="Actual Hours"
							htmlFor="labor_hours_actual"
						>
							<Input
								id="labor_hours_actual"
								type="number"
								step="0.25"
								value={formData.labor_hours_actual || ""}
								onChange={(e) =>
									updateField("labor_hours_actual", e.target.value)
								}
								disabled={!isEditing}
								placeholder="7.5"
							/>
						</StandardFormField>

						<StandardFormField label="Hourly Rate ($)" htmlFor="labor_rate">
							<Input
								id="labor_rate"
								type="number"
								step="0.01"
								value={formData.labor_rate || ""}
								onChange={(e) => updateField("labor_rate", e.target.value)}
								disabled={!isEditing}
								placeholder="50.00"
							/>
						</StandardFormField>

						<StandardFormField
							label="Labor Burden (%)"
							htmlFor="labor_burden_percent"
						>
							<Input
								id="labor_burden_percent"
								type="number"
								step="0.1"
								value={formData.labor_burden_percent || 30}
								onChange={(e) =>
									updateField("labor_burden_percent", e.target.value)
								}
								disabled={!isEditing}
								placeholder="30.0"
							/>
							<p className="text-muted-foreground text-xs">
								Benefits, taxes, insurance (default: 30%)
							</p>
						</StandardFormField>
					</StandardFormRow>

					<div className="bg-muted/50 rounded-lg p-3">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Total Labor Cost</span>
							<span className="text-lg font-bold">
								{formatCurrency(laborCost)}
							</span>
						</div>
						<p className="text-muted-foreground mt-1 text-xs">
							{formData.labor_hours_actual || 0} hours × $
							{formData.labor_rate || 0}/hr ×{" "}
							{(1 + (formData.labor_burden_percent || 30) / 100).toFixed(2)}{" "}
							burden
						</p>
					</div>
				</div>

				<Separator />

				{/* Materials Costs */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<Package className="h-4 w-4 text-primary" />
						<h4 className="font-semibold">Materials & Parts</h4>
					</div>

					<StandardFormRow cols={2}>
						<StandardFormField label="Cost ($)" htmlFor="materials_cost_actual">
							<Input
								id="materials_cost_actual"
								type="number"
								step="0.01"
								value={formData.materials_cost_actual || ""}
								onChange={(e) =>
									updateField("materials_cost_actual", e.target.value)
								}
								disabled={!isEditing}
								placeholder="800.00"
							/>
						</StandardFormField>

						<StandardFormField
							label="Markup (%)"
							htmlFor="materials_markup_percent"
						>
							<Input
								id="materials_markup_percent"
								type="number"
								step="0.1"
								value={formData.materials_markup_percent || 50}
								onChange={(e) =>
									updateField("materials_markup_percent", e.target.value)
								}
								disabled={!isEditing}
								placeholder="50.0"
							/>
							<p className="text-muted-foreground text-xs">
								Typical markup: 40-60%
							</p>
						</StandardFormField>
					</StandardFormRow>

					<div className="bg-muted/50 rounded-lg p-3">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Materials Revenue</span>
							<span className="text-lg font-bold">
								{formatCurrency(materialsRevenue)}
							</span>
						</div>
						<p className="text-muted-foreground mt-1 text-xs">
							${formData.materials_cost_actual || 0} cost ×{" "}
							{(1 + (formData.materials_markup_percent || 50) / 100).toFixed(2)}{" "}
							markup
						</p>
					</div>
				</div>

				<Separator />

				{/* Other Costs */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<Wrench className="h-4 w-4 text-primary" />
						<h4 className="font-semibold">Other Costs</h4>
					</div>

					<StandardFormRow cols={2}>
						<StandardFormField
							label="Equipment/Tools ($)"
							htmlFor="equipment_cost"
						>
							<Input
								id="equipment_cost"
								type="number"
								step="0.01"
								value={formData.equipment_cost || ""}
								onChange={(e) => updateField("equipment_cost", e.target.value)}
								disabled={!isEditing}
								placeholder="100.00"
							/>
						</StandardFormField>

						<StandardFormField
							label="Subcontractors ($)"
							htmlFor="subcontractor_cost"
						>
							<Input
								id="subcontractor_cost"
								type="number"
								step="0.01"
								value={formData.subcontractor_cost || ""}
								onChange={(e) =>
									updateField("subcontractor_cost", e.target.value)
								}
								disabled={!isEditing}
								placeholder="0.00"
							/>
						</StandardFormField>

						<StandardFormField
							label="Overhead ($)"
							htmlFor="overhead_allocation"
						>
							<Input
								id="overhead_allocation"
								type="number"
								step="0.01"
								value={formData.overhead_allocation || ""}
								onChange={(e) =>
									updateField("overhead_allocation", e.target.value)
								}
								disabled={!isEditing}
								placeholder="150.00"
							/>
							<p className="text-muted-foreground text-xs">
								Allocated overhead (admin, insurance, etc.)
							</p>
						</StandardFormField>

						<StandardFormField
							label="Target Margin (%)"
							htmlFor="profit_margin_target"
						>
							<Input
								id="profit_margin_target"
								type="number"
								step="0.1"
								value={formData.profit_margin_target || 40}
								onChange={(e) =>
									updateField("profit_margin_target", e.target.value)
								}
								disabled={!isEditing}
								placeholder="40.0"
							/>
						</StandardFormField>
					</StandardFormRow>
				</div>

				{/* Alert for below-target margins */}
				{profitMargin < targetMargin && totalRevenue > 0 && (
					<div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950">
						<AlertCircle className="mt-0.5 h-4 w-4 text-yellow-600 dark:text-yellow-400" />
						<div className="text-sm">
							<p className="font-medium text-yellow-900 dark:text-yellow-100">
								Below Target Margin
							</p>
							<p className="text-muted-foreground mt-1">
								Current margin ({profitMargin.toFixed(1)}%) is below target (
								{targetMargin}%). Consider adjusting pricing or reducing costs.
							</p>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
