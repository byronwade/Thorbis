"use client";

/**
 * Profit & Loss Calculator - Client Component
 *
 * Client-side features:
 * - Revenue and expense tracking
 * - Real-time P&L calculations
 * - Margin analysis
 */

import {
	AlertCircle,
	DollarSign,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfitLossCalculator() {
	// Revenue
	const [revenue, setRevenue] = useState<string>("250000");

	// Cost of Goods Sold
	const [materials, setMaterials] = useState<string>("50000");
	const [directLabor, setDirectLabor] = useState<string>("60000");
	const [equipmentCosts, setEquipmentCosts] = useState<string>("10000");

	// Operating Expenses
	const [rent, setRent] = useState<string>("24000");
	const [insurance, setInsurance] = useState<string>("12000");
	const [utilities, setUtilities] = useState<string>("6000");
	const [marketing, setMarketing] = useState<string>("8000");
	const [adminSalaries, setAdminSalaries] = useState<string>("40000");
	const [officeSupplies, setOfficeSupplies] = useState<string>("3000");
	const [vehicleMaintenance, setVehicleMaintenance] = useState<string>("8000");
	const [otherExpenses, setOtherExpenses] = useState<string>("5000");

	// Calculations
	const revenueNum = Number.parseFloat(revenue) || 0;

	const materialsNum = Number.parseFloat(materials) || 0;
	const laborNum = Number.parseFloat(directLabor) || 0;
	const equipmentNum = Number.parseFloat(equipmentCosts) || 0;
	const cogs = materialsNum + laborNum + equipmentNum;

	const grossProfit = revenueNum - cogs;
	const grossMargin = revenueNum > 0 ? (grossProfit / revenueNum) * 100 : 0;

	const rentNum = Number.parseFloat(rent) || 0;
	const insuranceNum = Number.parseFloat(insurance) || 0;
	const utilitiesNum = Number.parseFloat(utilities) || 0;
	const marketingNum = Number.parseFloat(marketing) || 0;
	const adminNum = Number.parseFloat(adminSalaries) || 0;
	const suppliesNum = Number.parseFloat(officeSupplies) || 0;
	const vehicleNum = Number.parseFloat(vehicleMaintenance) || 0;
	const otherNum = Number.parseFloat(otherExpenses) || 0;

	const totalOperatingExpenses =
		rentNum +
		insuranceNum +
		utilitiesNum +
		marketingNum +
		adminNum +
		suppliesNum +
		vehicleNum +
		otherNum;

	const operatingProfit = grossProfit - totalOperatingExpenses;
	const operatingMargin =
		revenueNum > 0 ? (operatingProfit / revenueNum) * 100 : 0;

	const netProfit = operatingProfit;
	const netMargin = revenueNum > 0 ? (netProfit / revenueNum) * 100 : 0;

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<div className="from-primary/15 to-primary/5 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br">
						<TrendingUp className="text-primary size-6" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h1 className="text-3xl font-bold tracking-tight">
								Profit & Loss Calculator
							</h1>
							<Badge variant="secondary">Popular</Badge>
						</div>
						<p className="text-muted-foreground mt-1">
							Track revenue, expenses, and calculate your net profit margins
						</p>
					</div>
				</div>
			</div>

			{/* Info Card */}
			<Card className="border-primary/20 bg-gradient-to-br from-blue-500/5 to-transparent">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<AlertCircle className="size-5" />
						Understanding Your P&L Statement
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm">
					<p>A P&L statement shows:</p>
					<ul className="ml-4 list-disc space-y-1">
						<li>
							<strong>Gross Profit:</strong> Revenue minus direct costs
							(materials, labor)
						</li>
						<li>
							<strong>Operating Profit:</strong> Gross profit minus operating
							expenses
						</li>
						<li>
							<strong>Net Profit:</strong> Your bottom line after all expenses
						</li>
						<li>
							<strong>Profit Margins:</strong> Profitability as percentage of
							revenue
						</li>
					</ul>
				</CardContent>
			</Card>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Input Form */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TrendingUp className="size-5" />
								Revenue
							</CardTitle>
							<CardDescription>
								Total income from sales and services
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Label htmlFor="revenue">Total Revenue ($)</Label>
								<Input
									id="revenue"
									onChange={(e) => setRevenue(e.target.value)}
									placeholder="250000"
									type="number"
									value={revenue}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TrendingDown className="size-5" />
								Cost of Goods Sold (COGS)
							</CardTitle>
							<CardDescription>
								Direct costs to deliver services
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="materials">Materials & Supplies ($)</Label>
								<Input
									id="materials"
									onChange={(e) => setMaterials(e.target.value)}
									type="number"
									value={materials}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="labor">Direct Labor Costs ($)</Label>
								<Input
									id="labor"
									onChange={(e) => setDirectLabor(e.target.value)}
									type="number"
									value={directLabor}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="equipment">Equipment & Fleet ($)</Label>
								<Input
									id="equipment"
									onChange={(e) => setEquipmentCosts(e.target.value)}
									type="number"
									value={equipmentCosts}
								/>
							</div>
							<div className="flex justify-between border-t pt-2">
								<span className="text-sm font-semibold">Total COGS:</span>
								<span className="font-bold">${cogs.toLocaleString()}</span>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<DollarSign className="size-5" />
								Operating Expenses
							</CardTitle>
							<CardDescription>
								Overhead and administrative costs
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className="text-sm" htmlFor="rent">
										Rent/Lease ($)
									</Label>
									<Input
										id="rent"
										onChange={(e) => setRent(e.target.value)}
										type="number"
										value={rent}
									/>
								</div>
								<div className="space-y-2">
									<Label className="text-sm" htmlFor="insurance">
										Insurance ($)
									</Label>
									<Input
										id="insurance"
										onChange={(e) => setInsurance(e.target.value)}
										type="number"
										value={insurance}
									/>
								</div>
								<div className="space-y-2">
									<Label className="text-sm" htmlFor="utilities">
										Utilities ($)
									</Label>
									<Input
										id="utilities"
										onChange={(e) => setUtilities(e.target.value)}
										type="number"
										value={utilities}
									/>
								</div>
								<div className="space-y-2">
									<Label className="text-sm" htmlFor="marketing">
										Marketing ($)
									</Label>
									<Input
										id="marketing"
										onChange={(e) => setMarketing(e.target.value)}
										type="number"
										value={marketing}
									/>
								</div>
								<div className="space-y-2">
									<Label className="text-sm" htmlFor="admin">
										Admin Salaries ($)
									</Label>
									<Input
										id="admin"
										onChange={(e) => setAdminSalaries(e.target.value)}
										type="number"
										value={adminSalaries}
									/>
								</div>
								<div className="space-y-2">
									<Label className="text-sm" htmlFor="supplies">
										Office Supplies ($)
									</Label>
									<Input
										id="supplies"
										onChange={(e) => setOfficeSupplies(e.target.value)}
										type="number"
										value={officeSupplies}
									/>
								</div>
								<div className="space-y-2">
									<Label className="text-sm" htmlFor="vehicle">
										Vehicle Maint. ($)
									</Label>
									<Input
										id="vehicle"
										onChange={(e) => setVehicleMaintenance(e.target.value)}
										type="number"
										value={vehicleMaintenance}
									/>
								</div>
								<div className="space-y-2">
									<Label className="text-sm" htmlFor="other">
										Other Expenses ($)
									</Label>
									<Input
										id="other"
										onChange={(e) => setOtherExpenses(e.target.value)}
										type="number"
										value={otherExpenses}
									/>
								</div>
							</div>
							<div className="flex justify-between border-t pt-2">
								<span className="text-sm font-semibold">
									Total Operating Expenses:
								</span>
								<span className="font-bold">
									${totalOperatingExpenses.toLocaleString()}
								</span>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Results */}
				<div className="space-y-4">
					<Card
						className={`border-2 ${netProfit >= 0 ? "border-success/20 bg-gradient-to-br from-green-500/10" : "border-destructive/20 bg-gradient-to-br from-red-500/10"} to-transparent`}
					>
						<CardHeader>
							<CardTitle>Net Profit</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<p className="text-muted-foreground text-sm">
										Your Bottom Line
									</p>
									<p
										className={`text-5xl font-bold ${netProfit >= 0 ? "text-success" : "text-destructive"}`}
									>
										${netProfit.toLocaleString()}
									</p>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-muted-foreground text-xs">Net Margin</p>
										<p
											className={`text-2xl font-semibold ${netMargin >= 0 ? "text-success" : "text-destructive"}`}
										>
											{netMargin.toFixed(1)}%
										</p>
									</div>
									<div>
										<p className="text-muted-foreground text-xs">
											Total Revenue
										</p>
										<p className="text-2xl font-semibold">
											${revenueNum.toLocaleString()}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Profit & Loss Statement</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-2">
								<div className="flex justify-between font-bold">
									<span>Revenue</span>
									<span>${revenueNum.toLocaleString()}</span>
								</div>

								<div className="ml-4 space-y-1 text-sm">
									<div className="text-muted-foreground flex justify-between">
										<span>Materials</span>
										<span>-${materialsNum.toLocaleString()}</span>
									</div>
									<div className="text-muted-foreground flex justify-between">
										<span>Direct Labor</span>
										<span>-${laborNum.toLocaleString()}</span>
									</div>
									<div className="text-muted-foreground flex justify-between">
										<span>Equipment</span>
										<span>-${equipmentNum.toLocaleString()}</span>
									</div>
								</div>

								<div className="flex justify-between border-y py-2 font-semibold">
									<span>Gross Profit</span>
									<div className="text-right">
										<div>${grossProfit.toLocaleString()}</div>
										<div className="text-muted-foreground text-xs">
											{grossMargin.toFixed(1)}% margin
										</div>
									</div>
								</div>

								<div className="ml-4 space-y-1 text-sm">
									<div className="text-muted-foreground flex justify-between">
										<span>Rent/Lease</span>
										<span>-${rentNum.toLocaleString()}</span>
									</div>
									<div className="text-muted-foreground flex justify-between">
										<span>Insurance</span>
										<span>-${insuranceNum.toLocaleString()}</span>
									</div>
									<div className="text-muted-foreground flex justify-between">
										<span>Admin Salaries</span>
										<span>-${adminNum.toLocaleString()}</span>
									</div>
									<div className="text-muted-foreground flex justify-between">
										<span>Marketing</span>
										<span>-${marketingNum.toLocaleString()}</span>
									</div>
									<div className="text-muted-foreground flex justify-between">
										<span>Other Operating</span>
										<span>
											-$
											{(
												utilitiesNum +
												suppliesNum +
												vehicleNum +
												otherNum
											).toLocaleString()}
										</span>
									</div>
								</div>

								<div className="flex justify-between border-y py-2 font-semibold">
									<span>Operating Profit</span>
									<div className="text-right">
										<div>${operatingProfit.toLocaleString()}</div>
										<div className="text-muted-foreground text-xs">
											{operatingMargin.toFixed(1)}% margin
										</div>
									</div>
								</div>

								<div
									className={`flex justify-between border-t-2 pt-2 text-lg font-bold ${netProfit >= 0 ? "text-success" : "text-destructive"}`}
								>
									<span>Net Profit</span>
									<div className="text-right">
										<div>${netProfit.toLocaleString()}</div>
										<div className="text-muted-foreground text-xs">
											{netMargin.toFixed(1)}% margin
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border-warning/20 bg-gradient-to-br from-amber-500/5 to-transparent">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<AlertCircle className="size-4" />
								Industry Benchmarks
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm">
							<p>Healthy trade businesses typically have:</p>
							<ul className="ml-4 list-disc space-y-1">
								<li>Gross Margin: 40-60%</li>
								<li>Operating Margin: 15-25%</li>
								<li>Net Margin: 10-20%</li>
								<li>COGS: 40-60% of revenue</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
