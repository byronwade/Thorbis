"use client";

/**
 * Job Pricing Calculator - Client Component
 *
 * Client-side features:
 * - Dynamic line item management
 * - Real-time price calculations
 * - Markup and margin calculations
 */

import { AlertCircle, Calculator, DollarSign, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LineItem = {
	id: string;
	description: string;
	quantity: string;
	unitCost: string;
};

export default function JobPricingCalculator() {
	const [materials, setMaterials] = useState<LineItem[]>([{ id: "1", description: "", quantity: "1", unitCost: "0" }]);
	const [laborHours, setLaborHours] = useState<string>("8");
	const [laborRate, setLaborRate] = useState<string>("75");
	const [equipmentCost, setEquipmentCost] = useState<string>("0");
	const [overheadPercent, setOverheadPercent] = useState<string>("15");
	const [profitPercent, setProfitPercent] = useState<string>("20");

	const addMaterial = () => {
		setMaterials([
			...materials,
			{
				id: Date.now().toString(),
				description: "",
				quantity: "1",
				unitCost: "0",
			},
		]);
	};

	const removeMaterial = (id: string) => {
		if (materials.length > 1) {
			setMaterials(materials.filter((m) => m.id !== id));
		}
	};

	const updateMaterial = (id: string, field: keyof LineItem, value: string) => {
		setMaterials(materials.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
	};

	// Calculations
	const materialsCost = materials.reduce((sum, item) => {
		const qty = Number.parseFloat(item.quantity) || 0;
		const cost = Number.parseFloat(item.unitCost) || 0;
		return sum + qty * cost;
	}, 0);

	const laborCost = (Number.parseFloat(laborHours) || 0) * (Number.parseFloat(laborRate) || 0);
	const equipmentNum = Number.parseFloat(equipmentCost) || 0;
	const directCosts = materialsCost + laborCost + equipmentNum;

	const overheadAmount = directCosts * ((Number.parseFloat(overheadPercent) || 0) / 100);
	const totalCosts = directCosts + overheadAmount;

	const profitAmount = totalCosts * ((Number.parseFloat(profitPercent) || 0) / 100);
	const totalPrice = totalCosts + profitAmount;

	const profitMargin = totalPrice > 0 ? (profitAmount / totalPrice) * 100 : 0;

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5">
						<Calculator className="size-6 text-primary" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h1 className="font-bold text-3xl tracking-tight">Job Pricing Calculator</h1>
							<Badge variant="secondary">Essential</Badge>
						</div>
						<p className="mt-1 text-muted-foreground">Price jobs accurately with material, labor, and overhead costs</p>
					</div>
				</div>
			</div>

			{/* Info Card */}
			<Card className="border-primary/20 bg-gradient-to-br from-blue-500/5 to-transparent">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<AlertCircle className="size-5" />
						How to Price a Job
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm">
					<p>Build accurate job quotes by calculating all costs:</p>
					<ul className="ml-4 list-disc space-y-1">
						<li>
							<strong>Materials:</strong> All parts, supplies, and consumables
						</li>
						<li>
							<strong>Labor:</strong> Total hours × your hourly rate
						</li>
						<li>
							<strong>Equipment:</strong> Tools, vehicle costs, specialized equipment
						</li>
						<li>
							<strong>Overhead:</strong> Insurance, office, admin (typically 10-20%)
						</li>
						<li>
							<strong>Profit:</strong> Your desired profit margin (typically 15-30%)
						</li>
					</ul>
				</CardContent>
			</Card>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Input Form */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<span className="flex items-center gap-2">
									<Calculator className="size-5" />
									Materials
								</span>
								<Button onClick={addMaterial} size="sm" variant="outline">
									<Plus className="mr-2 size-4" />
									Add Item
								</Button>
							</CardTitle>
							<CardDescription>List all materials needed for the job</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{materials.map((material, index) => (
								<div className="space-y-2 rounded-lg border p-3" key={material.id}>
									<div className="flex items-center justify-between">
										<Label className="text-sm">Item {index + 1}</Label>
										{materials.length > 1 && (
											<Button onClick={() => removeMaterial(material.id)} size="sm" variant="ghost">
												<Trash2 className="size-4 text-destructive" />
											</Button>
										)}
									</div>
									<Input
										onChange={(e) => updateMaterial(material.id, "description", e.target.value)}
										placeholder="Material description"
										value={material.description}
									/>
									<div className="grid grid-cols-2 gap-2">
										<div>
											<Label className="text-xs">Quantity</Label>
											<Input
												onChange={(e) => updateMaterial(material.id, "quantity", e.target.value)}
												type="number"
												value={material.quantity}
											/>
										</div>
										<div>
											<Label className="text-xs">Unit Cost ($)</Label>
											<Input
												onChange={(e) => updateMaterial(material.id, "unitCost", e.target.value)}
												type="number"
												value={material.unitCost}
											/>
										</div>
									</div>
									<div className="flex justify-between border-t pt-2 text-sm">
										<span className="text-muted-foreground">Item Total:</span>
										<span className="font-semibold">
											$
											{(
												(Number.parseFloat(material.quantity) || 0) * (Number.parseFloat(material.unitCost) || 0)
											).toFixed(2)}
										</span>
									</div>
								</div>
							))}
							<div className="flex justify-between border-t pt-3">
								<span className="font-semibold">Total Materials:</span>
								<span className="font-bold text-lg">${materialsCost.toFixed(2)}</span>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<DollarSign className="size-5" />
								Labor & Other Costs
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="hours">Labor Hours</Label>
									<Input id="hours" onChange={(e) => setLaborHours(e.target.value)} type="number" value={laborHours} />
								</div>
								<div className="space-y-2">
									<Label htmlFor="rate">Hourly Rate ($)</Label>
									<Input id="rate" onChange={(e) => setLaborRate(e.target.value)} type="number" value={laborRate} />
								</div>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Labor Cost:</span>
								<span className="font-semibold">${laborCost.toFixed(2)}</span>
							</div>

							<div className="space-y-2">
								<Label htmlFor="equipment">Equipment/Vehicle Cost ($)</Label>
								<Input
									id="equipment"
									onChange={(e) => setEquipmentCost(e.target.value)}
									type="number"
									value={equipmentCost}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="overhead">Overhead (%)</Label>
								<Input
									id="overhead"
									onChange={(e) => setOverheadPercent(e.target.value)}
									type="number"
									value={overheadPercent}
								/>
								<p className="text-muted-foreground text-xs">Applied to all direct costs (typically 10-20%)</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="profit">Profit Margin (%)</Label>
								<Input
									id="profit"
									onChange={(e) => setProfitPercent(e.target.value)}
									type="number"
									value={profitPercent}
								/>
								<p className="text-muted-foreground text-xs">Your desired profit (typically 15-30%)</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Results */}
				<div className="space-y-4">
					<Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
						<CardHeader>
							<CardTitle>Job Quote Price</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<p className="text-muted-foreground text-sm">Total Quote</p>
									<p className="font-bold text-5xl">${totalPrice.toFixed(2)}</p>
								</div>
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<p className="text-muted-foreground">Profit Amount</p>
										<p className="font-semibold text-lg">${profitAmount.toFixed(2)}</p>
									</div>
									<div>
										<p className="text-muted-foreground">Profit Margin</p>
										<p className="font-semibold text-lg">{profitMargin.toFixed(1)}%</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Cost Breakdown</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Materials</span>
									<span className="font-semibold">${materialsCost.toFixed(2)}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Labor</span>
									<span className="font-semibold">${laborCost.toFixed(2)}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Equipment</span>
									<span className="font-semibold">${equipmentNum.toFixed(2)}</span>
								</div>
								<div className="flex justify-between border-t pt-2 text-sm">
									<span className="font-medium">Direct Costs</span>
									<span className="font-semibold">${directCosts.toFixed(2)}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Overhead ({overheadPercent}%)</span>
									<span className="font-semibold">${overheadAmount.toFixed(2)}</span>
								</div>
								<div className="flex justify-between border-t pt-2">
									<span className="font-medium">Total Costs</span>
									<span className="font-bold">${totalCosts.toFixed(2)}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Profit ({profitPercent}%)</span>
									<span className="font-semibold text-success">${profitAmount.toFixed(2)}</span>
								</div>
								<div className="flex justify-between border-t-2 pt-2">
									<span className="font-bold">Total Quote</span>
									<span className="font-bold text-xl">${totalPrice.toFixed(2)}</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border-warning/20 bg-gradient-to-br from-amber-500/5 to-transparent">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<AlertCircle className="size-4" />
								Pricing Tips
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm">
							<p>• Always include a buffer for unexpected costs (5-10%)</p>
							<p>• Track actual vs estimated costs to improve future quotes</p>
							<p>• Consider payment terms (deposits, progress payments)</p>
							<p>• Review competitor pricing in your market</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
