"use client";

import {
	Briefcase,
	DollarSign,
	Download,
	FileJson,
	FileSpreadsheet,
	FileText,
	History,
	Package,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ExportPageContentProps = {
	companyId: string;
	userId: string;
};

type EntityType = "customers" | "jobs" | "invoices" | "estimates" | "equipment";
type ExportFormat = "csv" | "excel" | "json" | "pdf";

export function ExportPageContent({
	companyId,
	userId,
}: ExportPageContentProps) {
	const [selectedEntityType, setSelectedEntityType] =
		useState<EntityType>("customers");
	const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
	const [isExporting, setIsExporting] = useState(false);

	const entityTypes: Array<{
		value: EntityType;
		label: string;
		description: string;
		icon: React.ElementType;
		color: string;
	}> = [
		{
			value: "customers",
			label: "Customers",
			description: "Export customer contacts and company details",
			icon: Users,
			color: "text-blue-600",
		},
		{
			value: "jobs",
			label: "Jobs",
			description: "Export job history and work orders",
			icon: Briefcase,
			color: "text-green-600",
		},
		{
			value: "invoices",
			label: "Invoices",
			description: "Export invoices and billing records",
			icon: DollarSign,
			color: "text-purple-600",
		},
		{
			value: "estimates",
			label: "Estimates",
			description: "Export quotes and proposals",
			icon: FileText,
			color: "text-orange-600",
		},
		{
			value: "equipment",
			label: "Equipment",
			description: "Export equipment and asset inventory",
			icon: Package,
			color: "text-indigo-600",
		},
	];

	const formatOptions = [
		{ value: "csv", label: "CSV", icon: FileSpreadsheet },
		{ value: "excel", label: "Excel (XLSX)", icon: FileSpreadsheet },
		{ value: "json", label: "JSON", icon: FileJson },
		{ value: "pdf", label: "PDF", icon: FileText },
	];

	const handleExport = async (entityType: EntityType) => {
		setSelectedEntityType(entityType);
		setIsExporting(true);

		try {
			// TODO: Implement actual export logic
			console.log(`Exporting ${entityType} as ${exportFormat}`);
			await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate export
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className="flex h-full flex-col">
			<div className="flex-1 overflow-auto">
				<div className="container max-w-7xl mx-auto py-6 space-y-6">
					{/* Page Header */}
					<div className="space-y-2">
						<h1 className="text-3xl font-bold tracking-tight">Export Data</h1>
						<p className="text-muted-foreground">
							Export your business data to CSV, Excel, JSON, or PDF formats.
						</p>
					</div>

					{/* Format Selection */}
					<Card>
						<CardHeader>
							<CardTitle>Export Format</CardTitle>
							<CardDescription>
								Choose the format for your exported data
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Select
								value={exportFormat}
								onValueChange={(value) =>
									setExportFormat(value as ExportFormat)
								}
							>
								<SelectTrigger className="w-full max-w-xs">
									<SelectValue placeholder="Select format" />
								</SelectTrigger>
								<SelectContent>
									{formatOptions.map((format) => (
										<SelectItem key={format.value} value={format.value}>
											<div className="flex items-center gap-2">
												<format.icon className="h-4 w-4" />
												{format.label}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</CardContent>
					</Card>

					{/* Entity Type Cards */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{entityTypes.map((entity) => (
							<Card
								key={entity.value}
								className="hover:border-primary cursor-pointer transition-all"
							>
								<CardHeader>
									<div className="flex items-start gap-4">
										<div className="p-2 rounded-lg bg-muted">
											<entity.icon className={`h-6 w-6 ${entity.color}`} />
										</div>
										<div className="flex-1">
											<CardTitle className="text-lg">{entity.label}</CardTitle>
											<CardDescription>{entity.description}</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<Button
										variant="outline"
										className="w-full"
										onClick={() => handleExport(entity.value)}
										disabled={isExporting}
									>
										<Download className="mr-2 h-4 w-4" />
										{isExporting && selectedEntityType === entity.value
											? "Exporting..."
											: `Export ${entity.label}`}
									</Button>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Export Info with Tabs */}
					<Tabs defaultValue="info" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="info">
								<Download className="mr-2 h-4 w-4" />
								Export Info
							</TabsTrigger>
							<TabsTrigger value="history">
								<History className="mr-2 h-4 w-4" />
								Export History
							</TabsTrigger>
						</TabsList>

						<TabsContent value="info" className="mt-6">
							<Card>
								<CardHeader>
									<CardTitle>Export Capabilities</CardTitle>
									<CardDescription>
										What you can export from Stratos
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid gap-6 md:grid-cols-2">
										<div className="space-y-4">
											<div className="space-y-2">
												<h4 className="font-semibold text-sm">
													Supported Formats
												</h4>
												<ul className="text-sm text-muted-foreground space-y-1">
													<li>• CSV files (.csv)</li>
													<li>• Excel files (.xlsx)</li>
													<li>• JSON format (.json)</li>
													<li>• PDF documents (.pdf)</li>
												</ul>
											</div>

											<div className="space-y-2">
												<h4 className="font-semibold text-sm">
													Export Options
												</h4>
												<ul className="text-sm text-muted-foreground space-y-1">
													<li>• Select specific fields</li>
													<li>• Filter by date range</li>
													<li>• Include relationships</li>
													<li>• Bulk export all data</li>
												</ul>
											</div>
										</div>

										<div className="space-y-4">
											<div className="space-y-2">
												<h4 className="font-semibold text-sm">Data Types</h4>
												<ul className="text-sm text-muted-foreground space-y-1">
													<li>• Customer data & contacts</li>
													<li>• Job history & work orders</li>
													<li>• Invoices & payments</li>
													<li>• Equipment & inventory</li>
													<li>• Estimates & proposals</li>
												</ul>
											</div>

											<div className="space-y-2">
												<h4 className="font-semibold text-sm">
													Security & Privacy
												</h4>
												<ul className="text-sm text-muted-foreground space-y-1">
													<li>• Encrypted downloads</li>
													<li>• Audit trail logging</li>
													<li>• Role-based access</li>
													<li>• Data retention policies</li>
												</ul>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="history" className="mt-6">
							<Card>
								<CardHeader>
									<CardTitle>Export History</CardTitle>
									<CardDescription>Recent data exports</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-center py-12 text-muted-foreground">
										<p>No export history available</p>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
