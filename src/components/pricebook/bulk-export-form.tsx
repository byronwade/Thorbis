"use client";

/**
 * Bulk Export Form - Client Component
 *
 * Export configuration and generation:
 * - Filter selection
 * - Format selection (CSV, Excel, PDF)
 * - Column customization
 * - Download functionality
 */

import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ExportFormat = "csv" | "excel" | "pdf";

type ExportFilters = {
	itemType: "all" | "service" | "material" | "equipment";
	category: string | null;
	supplier: string | null;
	isActive: "all" | "active" | "inactive";
	priceMin: number | null;
	priceMax: number | null;
};

type ColumnConfig = {
	name: boolean;
	sku: boolean;
	itemType: boolean;
	category: boolean;
	subcategory: boolean;
	description: boolean;
	cost: boolean;
	price: boolean;
	markupPercent: boolean;
	laborHours: boolean;
	unit: boolean;
	supplierName: boolean;
	isActive: boolean;
	lastUpdated: boolean;
};

const categories = ["HVAC", "Plumbing", "Electrical", "General"];
const suppliers = ["Ferguson", "Grainger", "HD Supply", "None"];

const defaultColumns: ColumnConfig = {
	name: true,
	sku: true,
	itemType: true,
	category: true,
	subcategory: true,
	description: true,
	cost: true,
	price: true,
	markupPercent: true,
	laborHours: false,
	unit: true,
	supplierName: false,
	isActive: true,
	lastUpdated: false,
};

const columnLabels: Record<keyof ColumnConfig, string> = {
	name: "Name",
	sku: "SKU",
	itemType: "Item Type",
	category: "Category",
	subcategory: "Subcategory",
	description: "Description",
	cost: "Cost",
	price: "Price",
	markupPercent: "Markup %",
	laborHours: "Labor Hours",
	unit: "Unit",
	supplierName: "Supplier",
	isActive: "Status",
	lastUpdated: "Last Updated",
};

export function BulkExportForm() {
	const [format, setFormat] = useState<ExportFormat>("excel");
	const [filters, setFilters] = useState<ExportFilters>({
		itemType: "all",
		category: null,
		supplier: null,
		isActive: "all",
		priceMin: null,
		priceMax: null,
	});
	const [columns, setColumns] = useState<ColumnConfig>(defaultColumns);
	const [isExporting, setIsExporting] = useState(false);

	const toggleColumn = (column: keyof ColumnConfig) => {
		setColumns({ ...columns, [column]: !columns[column] });
	};

	const selectAllColumns = () => {
		const allSelected = Object.fromEntries(Object.keys(columns).map((key) => [key, true])) as ColumnConfig;
		setColumns(allSelected);
	};

	const deselectAllColumns = () => {
		const allDeselected = Object.fromEntries(Object.keys(columns).map((key) => [key, false])) as ColumnConfig;
		setColumns(allDeselected);
	};

	const handleExport = async () => {
		setIsExporting(true);
		// TODO: Call API to generate export
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setIsExporting(false);
		// TODO: Trigger file download
	};

	const activeFiltersCount = [
		filters.itemType !== "all",
		filters.category !== null,
		filters.supplier !== null,
		filters.isActive !== "all",
		filters.priceMin !== null || filters.priceMax !== null,
	].filter(Boolean).length;

	const selectedColumnsCount = Object.values(columns).filter(Boolean).length;

	// Mock: Calculate estimated item count based on filters
	const estimatedItemCount = 127; // This would come from actual filter query

	return (
		<div className="grid gap-6 md:grid-cols-2">
			{/* Left Column - Filters & Format */}
			<div className="space-y-6">
				{/* Format Selection */}
				<Card>
					<CardHeader>
						<CardTitle>Export Format</CardTitle>
						<CardDescription>Choose the file format for export</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<RadioGroup onValueChange={(value: ExportFormat) => setFormat(value)} value={format}>
							<div className="flex items-center justify-between space-x-2 rounded-lg border p-3 hover:bg-accent">
								<div className="flex items-center space-x-3">
									<RadioGroupItem id="csv" value="csv" />
									<FileText className="h-5 w-5 text-muted-foreground" />
									<div>
										<Label className="font-normal" htmlFor="csv">
											CSV
										</Label>
										<p className="text-muted-foreground text-xs">Comma-separated values</p>
									</div>
								</div>
								<Badge variant="outline">Universal</Badge>
							</div>

							<div className="flex items-center justify-between space-x-2 rounded-lg border p-3 hover:bg-accent">
								<div className="flex items-center space-x-3">
									<RadioGroupItem id="excel" value="excel" />
									<FileSpreadsheet className="h-5 w-5 text-success" />
									<div>
										<Label className="font-normal" htmlFor="excel">
											Excel
										</Label>
										<p className="text-muted-foreground text-xs">Microsoft Excel (.xlsx)</p>
									</div>
								</div>
								<Badge variant="outline">Formatted</Badge>
							</div>

							<div className="flex items-center justify-between space-x-2 rounded-lg border p-3 hover:bg-accent">
								<div className="flex items-center space-x-3">
									<RadioGroupItem id="pdf" value="pdf" />
									<FileText className="h-5 w-5 text-destructive" />
									<div>
										<Label className="font-normal" htmlFor="pdf">
											PDF
										</Label>
										<p className="text-muted-foreground text-xs">Printable document</p>
									</div>
								</div>
								<Badge variant="outline">Print-ready</Badge>
							</div>
						</RadioGroup>
					</CardContent>
				</Card>

				{/* Filter Selection */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Data Filters</CardTitle>
								<CardDescription>Select which items to include</CardDescription>
							</div>
							{activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount} filters</Badge>}
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
							<Label>Status</Label>
							<Select
								onValueChange={(value: any) => setFilters({ ...filters, isActive: value })}
								value={filters.isActive}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Items</SelectItem>
									<SelectItem value="active">Active Only</SelectItem>
									<SelectItem value="inactive">Inactive Only</SelectItem>
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
			</div>

			{/* Right Column - Columns & Preview */}
			<div className="space-y-6">
				{/* Column Selection */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Export Columns</CardTitle>
								<CardDescription>Choose which fields to include</CardDescription>
							</div>
							<Badge variant="secondary">{selectedColumnsCount} selected</Badge>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-2">
							<Button onClick={selectAllColumns} size="sm" variant="outline">
								Select All
							</Button>
							<Button onClick={deselectAllColumns} size="sm" variant="outline">
								Deselect All
							</Button>
						</div>

						<div className="grid grid-cols-2 gap-2">
							{(Object.keys(columns) as Array<keyof ColumnConfig>).map((column) => (
								<div className="flex items-center space-x-2" key={column}>
									<Checkbox checked={columns[column]} id={column} onCheckedChange={() => toggleColumn(column)} />
									<Label className="font-normal" htmlFor={column}>
										{columnLabels[column]}
									</Label>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Export Summary */}
				<Card>
					<CardHeader>
						<CardTitle>Export Summary</CardTitle>
						<CardDescription>Review your export configuration</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-3">
							<div className="rounded-lg border bg-muted/30 p-3">
								<p className="text-muted-foreground text-xs">Estimated Items</p>
								<p className="font-semibold text-2xl">{estimatedItemCount.toLocaleString()}</p>
							</div>
							<div className="rounded-lg border bg-muted/30 p-3">
								<p className="text-muted-foreground text-xs">Columns</p>
								<p className="font-semibold text-2xl">{selectedColumnsCount}</p>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Format</span>
								<span className="font-medium uppercase">{format}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Filters Applied</span>
								<span className="font-medium">{activeFiltersCount}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Estimated Size</span>
								<span className="font-medium">{format === "pdf" ? "~2 MB" : "~150 KB"}</span>
							</div>
						</div>

						<Button className="w-full" disabled={isExporting || selectedColumnsCount === 0} onClick={handleExport}>
							{isExporting ? (
								<>Generating Export...</>
							) : (
								<>
									<Download className="mr-2 h-4 w-4" />
									Export {estimatedItemCount} Items
								</>
							)}
						</Button>
					</CardContent>
				</Card>

				{/* Recent Exports */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Exports</CardTitle>
						<CardDescription>Your last 3 export files</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{[
								{
									name: "All_Items_2025-01-31.xlsx",
									date: "2 hours ago",
									items: 206,
								},
								{
									name: "HVAC_Services_2025-01-30.csv",
									date: "Yesterday",
									items: 45,
								},
								{
									name: "Price_Book_2025-01-28.pdf",
									date: "3 days ago",
									items: 206,
								},
							].map((export_) => (
								<div className="flex items-center justify-between rounded-lg border p-3" key={export_.name}>
									<div className="flex items-center gap-3">
										<FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
										<div>
											<p className="font-medium text-sm">{export_.name}</p>
											<p className="text-muted-foreground text-xs">
												{export_.items} items • {export_.date}
											</p>
										</div>
									</div>
									<Button size="sm" variant="ghost">
										<Download className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
