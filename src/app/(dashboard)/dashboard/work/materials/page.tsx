"use client";

/**
 * Materials Page - Seamless Datatable Layout
 */

import { Download, Package, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePageHeader } from "@/components/ui/datatable-page-header";
import { MaterialsTable, type Material } from "@/components/work/materials-table";

// Mock data - replace with real data from database
const mockMaterials: Material[] = [
	{
		id: "1",
		itemCode: "MAT-001",
		description: 'Copper Pipe 3/4"',
		category: "Plumbing",
		quantity: 250,
		unit: "ft",
		unitCost: 250,
		totalValue: 62500,
		status: "in-stock",
	},
	{
		id: "2",
		itemCode: "MAT-002",
		description: "Circuit Breaker 20A",
		category: "Electrical",
		quantity: 45,
		unit: "units",
		unitCost: 1250,
		totalValue: 56250,
		status: "in-stock",
	},
	{
		id: "3",
		itemCode: "MAT-003",
		description: "HVAC Filter 20x25x1",
		category: "HVAC",
		quantity: 8,
		unit: "units",
		unitCost: 1500,
		totalValue: 12000,
		status: "low-stock",
	},
	{
		id: "4",
		itemCode: "MAT-004",
		description: 'PVC Pipe 2"',
		category: "Plumbing",
		quantity: 0,
		unit: "ft",
		unitCost: 175,
		totalValue: 0,
		status: "out-of-stock",
	},
	{
		id: "5",
		itemCode: "MAT-005",
		description: "Wire Nuts (Pack of 100)",
		category: "Electrical",
		quantity: 120,
		unit: "packs",
		unitCost: 850,
		totalValue: 102000,
		status: "in-stock",
	},
	{
		id: "6",
		itemCode: "MAT-006",
		description: "Refrigerant R-410A",
		category: "HVAC",
		quantity: 15,
		unit: "lbs",
		unitCost: 4500,
		totalValue: 67500,
		status: "low-stock",
	},
	{
		id: "7",
		itemCode: "MAT-007",
		description: "Ball Valve 1/2\"",
		category: "Plumbing",
		quantity: 75,
		unit: "units",
		unitCost: 850,
		totalValue: 63750,
		status: "in-stock",
	},
];

function formatCurrency(cents: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(cents / 100);
}

export default function MaterialsPage() {
	// Calculate stats from data
	const totalItems = mockMaterials.length;
	const inStock = mockMaterials.filter((m) => m.status === "in-stock").length;
	const lowStock = mockMaterials.filter((m) => m.status === "low-stock").length;
	const outOfStock = mockMaterials.filter((m) => m.status === "out-of-stock").length;
	const totalValue = mockMaterials.reduce((sum, m) => sum + m.totalValue, 0);

	return (
		<div className="flex h-full flex-col">
			<DataTablePageHeader
				title="Materials Inventory"
				description="Track and manage company materials, parts, and supplies"
				actions={
					<>
						<Button size="sm" variant="outline">
							<Upload className="mr-2 size-4" />
							Import
						</Button>
						<Button size="sm" variant="outline">
							<Download className="mr-2 size-4" />
							Export
						</Button>
						<Button asChild size="sm">
							<Link href="/dashboard/work/materials/new">
								<Plus className="mr-2 size-4" />
								Add Material
							</Link>
						</Button>
					</>
				}
				stats={
					<div className="mt-4 grid gap-3 md:grid-cols-4">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">Total Items</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{totalItems}</div>
								<p className="text-xs text-muted-foreground">Across all categories</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">In Stock</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{inStock}</div>
								<p className="text-xs text-muted-foreground">
									{Math.round((inStock / totalItems) * 100)}% availability
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">Low Stock</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{lowStock}</div>
								<p className="text-xs text-muted-foreground">
									{outOfStock} out of stock
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
								<p className="text-xs text-muted-foreground">Current stock value</p>
							</CardContent>
						</Card>
					</div>
				}
			/>

			<div className="flex-1 overflow-hidden">
				<MaterialsTable materials={mockMaterials} itemsPerPage={50} />
			</div>
		</div>
	);
}
