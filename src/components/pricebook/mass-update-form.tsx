"use client";

/**
 * Mass Update Form - Client Component
 *
 * Interactive form for bulk price updates:
 * - Filter selection
 * - Price adjustment settings
 * - Preview table
 * - Apply changes
 */

import { AlertCircle, CheckCircle2, Percent, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type UpdateFilter = {
	itemType: "all" | "service" | "material" | "equipment";
	category: string | null;
	supplier: string | null;
	priceMin: number | null;
	priceMax: number | null;
};

type AdjustmentType = "percentage" | "fixed";

type PreviewItem = {
	id: string;
	name: string;
	currentPrice: number;
	newPrice: number;
	change: number;
	changePercent: number;
};

const categories = ["HVAC", "Plumbing", "Electrical", "General"];
const suppliers = ["Ferguson", "Grainger", "HD Supply", "None"];

export function MassUpdateForm() {
	const [filters, setFilters] = useState<UpdateFilter>({
		itemType: "all",
		category: null,
		supplier: null,
		priceMin: null,
		priceMax: null,
	});

	const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>("percentage");
	const [adjustmentValue, setAdjustmentValue] = useState<string>("");
	const [isIncrease, setIsIncrease] = useState(true);
	const [maintainMarkup, setMaintainMarkup] = useState(true);
	const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);
	const [showPreview, setShowPreview] = useState(false);
	const [isApplying, setIsApplying] = useState(false);

	// Mock data for preview
	const generatePreview = () => {
		const mockItems: PreviewItem[] = [
			{
				id: "1",
				name: "Complete HVAC System Inspection",
				currentPrice: 199.0,
				newPrice: 0,
				change: 0,
				changePercent: 0,
			},
			{
				id: "2",
				name: "Furnace Tune-Up - Good",
				currentPrice: 149.0,
				newPrice: 0,
				change: 0,
				changePercent: 0,
			},
			{
				id: "3",
				name: "AC Installation (3-Ton)",
				currentPrice: 4200.0,
				newPrice: 0,
				change: 0,
				changePercent: 0,
			},
		];

		const value = Number.parseFloat(adjustmentValue) || 0;

		mockItems.forEach((item) => {
			if (adjustmentType === "percentage") {
				const change = isIncrease
					? item.currentPrice * (value / 100)
					: -(item.currentPrice * (value / 100));
				item.newPrice = item.currentPrice + change;
				item.change = change;
				item.changePercent = isIncrease ? value : -value;
			} else {
				const change = isIncrease ? value : -value;
				item.newPrice = item.currentPrice + change;
				item.change = change;
				item.changePercent = (change / item.currentPrice) * 100;
			}
		});

		setPreviewItems(mockItems);
		setShowPreview(true);
	};

	const handleApply = async () => {
		setIsApplying(true);
		// TODO: Call API to apply changes
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setIsApplying(false);
		// TODO: Show success message and redirect
	};

	const activeFiltersCount = [
		filters.itemType !== "all",
		filters.category !== null,
		filters.supplier !== null,
		filters.priceMin !== null || filters.priceMax !== null,
	].filter(Boolean).length;

	return (
		<div className="grid gap-6 md:grid-cols-2">
			{/* Left Column - Filters & Settings */}
			<div className="space-y-6">
				{/* Filter Selection */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Item Filters</CardTitle>
								<CardDescription>Select which items to update</CardDescription>
							</div>
							{activeFiltersCount > 0 && (
								<Badge variant="secondary">{activeFiltersCount} filters</Badge>
							)}
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label>Item Type</Label>
							<Select
								onValueChange={(value: any) => setFilters({ ...filters, itemType: value })}
								value={filters.itemType}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Items</SelectItem>
									<SelectItem value="service">Services</SelectItem>
									<SelectItem value="material">Materials</SelectItem>
									<SelectItem value="equipment">Equipment</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>Category</Label>
							<Select
								onValueChange={(value) =>
									setFilters({
										...filters,
										category: value === "all" ? null : value,
									})
								}
								value={filters.category || "all"}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Categories</SelectItem>
									{categories.map((cat) => (
										<SelectItem key={cat} value={cat}>
											{cat}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>Supplier</Label>
							<Select
								onValueChange={(value) =>
									setFilters({
										...filters,
										supplier: value === "all" ? null : value,
									})
								}
								value={filters.supplier || "all"}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Suppliers</SelectItem>
									{suppliers.map((sup) => (
										<SelectItem key={sup} value={sup}>
											{sup}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>Price Range</Label>
							<div className="flex gap-2">
								<Input
									onChange={(e) =>
										setFilters({
											...filters,
											priceMin: e.target.value ? Number.parseFloat(e.target.value) : null,
										})
									}
									placeholder="Min"
									type="number"
									value={filters.priceMin || ""}
								/>
								<Input
									onChange={(e) =>
										setFilters({
											...filters,
											priceMax: e.target.value ? Number.parseFloat(e.target.value) : null,
										})
									}
									placeholder="Max"
									type="number"
									value={filters.priceMax || ""}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Adjustment Settings */}
				<Card>
					<CardHeader>
						<CardTitle>Price Adjustment</CardTitle>
						<CardDescription>Configure how prices will change</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label>Adjustment Type</Label>
							<RadioGroup
								onValueChange={(value: AdjustmentType) => setAdjustmentType(value)}
								value={adjustmentType}
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem id="percentage" value="percentage" />
									<Label className="font-normal" htmlFor="percentage">
										Percentage
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem id="fixed" value="fixed" />
									<Label className="font-normal" htmlFor="fixed">
										Fixed Amount
									</Label>
								</div>
							</RadioGroup>
						</div>

						<div className="space-y-2">
							<Label>Direction</Label>
							<RadioGroup
								onValueChange={(value) => setIsIncrease(value === "increase")}
								value={isIncrease ? "increase" : "decrease"}
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem id="increase" value="increase" />
									<Label className="font-normal" htmlFor="increase">
										<Plus className="mr-1 inline h-4 w-4" />
										Increase
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem id="decrease" value="decrease" />
									<Label className="font-normal" htmlFor="decrease">
										<Trash2 className="mr-1 inline h-4 w-4" />
										Decrease
									</Label>
								</div>
							</RadioGroup>
						</div>

						<div className="space-y-2">
							<Label>{adjustmentType === "percentage" ? "Percentage" : "Amount"}</Label>
							<div className="relative">
								<Input
									onChange={(e) => setAdjustmentValue(e.target.value)}
									placeholder={adjustmentType === "percentage" ? "10" : "5.00"}
									type="number"
									value={adjustmentValue}
								/>
								{adjustmentType === "percentage" && (
									<Percent className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
								)}
							</div>
						</div>

						<Separator />

						<div className="flex items-center space-x-2">
							<Checkbox
								checked={maintainMarkup}
								id="maintain-markup"
								onCheckedChange={(checked) => setMaintainMarkup(checked as boolean)}
							/>
							<Label className="font-normal" htmlFor="maintain-markup">
								Maintain markup ratios
							</Label>
						</div>

						<Button className="w-full" disabled={!adjustmentValue} onClick={generatePreview}>
							Generate Preview
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Right Column - Preview */}
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Preview Changes</CardTitle>
						<CardDescription>
							{showPreview
								? `${previewItems.length} items will be updated`
								: "Configure filters and adjustment to preview"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{showPreview ? (
							<div className="space-y-4">
								{/* Summary Stats */}
								<div className="bg-muted/30 grid grid-cols-2 gap-3 rounded-lg border p-3">
									<div>
										<p className="text-muted-foreground text-xs">Items Affected</p>
										<p className="text-lg font-semibold">{previewItems.length}</p>
									</div>
									<div>
										<p className="text-muted-foreground text-xs">Avg. Change</p>
										<p className="text-lg font-semibold">
											{isIncrease ? "+" : "-"}
											{adjustmentType === "percentage"
												? `${adjustmentValue}%`
												: `$${adjustmentValue}`}
										</p>
									</div>
								</div>

								{/* Preview Items */}
								<div className="space-y-2">
									{previewItems.map((item) => (
										<div className="bg-card rounded-lg border p-3 text-sm" key={item.id}>
											<div className="mb-2 flex items-start justify-between">
												<p className="font-medium">{item.name}</p>
												<Badge
													className={
														item.change > 0
															? "bg-success/10 text-success dark:text-success"
															: "bg-destructive/10 text-destructive dark:text-destructive"
													}
													variant="outline"
												>
													{item.change > 0 ? "+" : ""}${item.change.toFixed(2)}
												</Badge>
											</div>
											<div className="text-muted-foreground flex items-center justify-between text-xs">
												<span>
													${item.currentPrice.toFixed(2)} → ${item.newPrice.toFixed(2)}
												</span>
												<span>
													{item.changePercent > 0 ? "+" : ""}
													{item.changePercent.toFixed(1)}%
												</span>
											</div>
										</div>
									))}
								</div>

								{/* Apply Button */}
								<div className="space-y-3 pt-4">
									<div className="border-warning bg-warning dark:border-warning/50 dark:bg-warning/30 flex items-start gap-2 rounded-lg border p-3">
										<AlertCircle className="text-warning dark:text-warning mt-0.5 h-4 w-4" />
										<div className="flex-1">
											<p className="text-warning dark:text-warning text-sm font-medium">Warning</p>
											<p className="text-warning dark:text-warning text-xs">
												This action will update {previewItems.length} items. This cannot be undone.
											</p>
										</div>
									</div>

									<Button className="w-full" disabled={isApplying} onClick={handleApply}>
										{isApplying ? (
											<>Applying Changes...</>
										) : (
											<>
												<CheckCircle2 className="mr-2 h-4 w-4" />
												Apply Changes
											</>
										)}
									</Button>
								</div>
							</div>
						) : (
							<div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
								<div className="text-center">
									<AlertCircle className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
									<p className="text-muted-foreground text-sm">No preview available</p>
									<p className="text-muted-foreground text-xs">Generate a preview to see changes</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
