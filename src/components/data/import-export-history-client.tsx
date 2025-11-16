"use client";

/**
 * Import/Export History Client Component
 *
 * Displays history of imports and exports with undo capability
 */

import { CheckCircle, Clock, Download, FileSpreadsheet, RotateCcw, Upload, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ImportExportHistoryClient() {
	// Mock data for demonstration
	const imports = [
		{
			id: "1",
			type: "Customers",
			status: "completed",
			recordCount: 1247,
			successCount: 1200,
			errorCount: 47,
			date: "2 hours ago",
			fileName: "customers_import.xlsx",
			canUndo: true,
		},
		{
			id: "2",
			type: "Jobs",
			status: "completed",
			recordCount: 500,
			successCount: 500,
			errorCount: 0,
			date: "Yesterday",
			fileName: "jobs_data.csv",
			canUndo: true,
		},
		{
			id: "3",
			type: "Invoices",
			status: "failed",
			recordCount: 100,
			successCount: 0,
			errorCount: 100,
			date: "2 days ago",
			fileName: "invoices.xlsx",
			canUndo: false,
		},
	];

	const exports = [
		{
			id: "1",
			type: "Customers",
			format: "xlsx",
			recordCount: 1247,
			date: "1 hour ago",
			fileName: "customers_export.xlsx",
		},
		{
			id: "2",
			type: "Invoices",
			format: "pdf",
			recordCount: 856,
			date: "Yesterday",
			fileName: "invoices_report.pdf",
		},
		{
			id: "3",
			type: "Price Book",
			format: "csv",
			recordCount: 342,
			date: "3 days ago",
			fileName: "pricebook_export.csv",
		},
	];

	return (
		<div className="container mx-auto max-w-6xl space-y-6 py-8">
			<div>
				<h1 className="font-bold text-3xl tracking-tight">Import/Export History</h1>
				<p className="mt-2 text-muted-foreground">View and manage your data import and export operations</p>
			</div>

			<Tabs defaultValue="imports">
				<TabsList>
					<TabsTrigger value="imports">
						<Upload className="mr-2 size-4" />
						Imports
					</TabsTrigger>
					<TabsTrigger value="exports">
						<Download className="mr-2 size-4" />
						Exports
					</TabsTrigger>
				</TabsList>

				<TabsContent className="space-y-4" value="imports">
					{imports.map((item) => (
						<Card key={item.id}>
							<CardContent className="pt-6">
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-4">
										<div
											className={`flex size-12 items-center justify-center rounded-lg ${
												item.status === "completed"
													? "bg-success/10"
													: item.status === "failed"
														? "bg-destructive/10"
														: "bg-primary/10"
											}`}
										>
											{item.status === "completed" ? (
												<CheckCircle className="size-6 text-success" />
											) : item.status === "failed" ? (
												<XCircle className="size-6 text-destructive" />
											) : (
												<Clock className="size-6 text-primary" />
											)}
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<h3 className="font-semibold">{item.type} Import</h3>
												<Badge
													className={
														item.status === "completed"
															? "bg-success"
															: item.status === "failed"
																? "bg-destructive"
																: "bg-primary"
													}
												>
													{item.status}
												</Badge>
											</div>
											<p className="mt-1 text-muted-foreground text-sm">
												{item.fileName} • {item.date}
											</p>
											<div className="mt-2 flex gap-4 text-sm">
												<span>
													Total: <strong>{item.recordCount}</strong>
												</span>
												<span className="text-success">
													Success: <strong>{item.successCount}</strong>
												</span>
												{item.errorCount > 0 && (
													<span className="text-destructive">
														Errors: <strong>{item.errorCount}</strong>
													</span>
												)}
											</div>
										</div>
									</div>
									<div className="flex gap-2">
										{item.canUndo && (
											<Button size="sm" variant="outline">
												<RotateCcw className="mr-2 size-4" />
												Undo
											</Button>
										)}
										<Button size="sm" variant="ghost">
											View Details
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</TabsContent>

				<TabsContent className="space-y-4" value="exports">
					{exports.map((item) => (
						<Card key={item.id}>
							<CardContent className="pt-6">
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-4">
										<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
											<FileSpreadsheet className="size-6 text-primary" />
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<h3 className="font-semibold">{item.type} Export</h3>
												<Badge>{item.format.toUpperCase()}</Badge>
											</div>
											<p className="mt-1 text-muted-foreground text-sm">
												{item.fileName} • {item.date}
											</p>
											<p className="mt-2 text-sm">
												Records: <strong>{item.recordCount}</strong>
											</p>
										</div>
									</div>
									<div className="flex gap-2">
										<Button size="sm" variant="outline">
											<Download className="mr-2 size-4" />
											Re-download
										</Button>
										<Button size="sm" variant="ghost">
											View Details
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</TabsContent>
			</Tabs>
		</div>
	);
}
