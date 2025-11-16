"use client";

/**
 * Export Workflow Client Component
 *
 * Manages multi-step export process
 */

import {
	Calendar,
	CheckCircle,
	Download,
	FileSpreadsheet,
	Filter,
	Layout,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type ExportStep = "filters" | "fields" | "format" | "schedule" | "preview";

type ExportWorkflowClientProps = {
	dataType: string;
};

export function ExportWorkflowClient({ dataType }: ExportWorkflowClientProps) {
	const [currentStep, setCurrentStep] = useState<ExportStep>("filters");
	const [selectedFormat, setSelectedFormat] = useState("xlsx");

	const steps: { id: ExportStep; label: string; icon: React.ReactNode }[] = [
		{ id: "filters", label: "Filters", icon: <Filter className="size-4" /> },
		{ id: "fields", label: "Fields", icon: <Layout className="size-4" /> },
		{
			id: "format",
			label: "Format",
			icon: <FileSpreadsheet className="size-4" />,
		},
		{
			id: "schedule",
			label: "Schedule",
			icon: <Calendar className="size-4" />,
		},
		{ id: "preview", label: "Preview", icon: <Download className="size-4" /> },
	];

	const getStepIndex = (step: ExportStep) =>
		steps.findIndex((s) => s.id === step);
	const currentStepIndex = getStepIndex(currentStep);

	const formatDataType = (type: string) =>
		type
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

	// Sample fields for demonstration
	const availableFields = [
		{ id: "id", label: "ID", selected: true },
		{ id: "name", label: "Name", selected: true },
		{ id: "email", label: "Email", selected: true },
		{ id: "phone", label: "Phone", selected: true },
		{ id: "address", label: "Address", selected: true },
		{ id: "city", label: "City", selected: false },
		{ id: "state", label: "State", selected: false },
		{ id: "zip", label: "ZIP Code", selected: false },
		{ id: "created_at", label: "Created Date", selected: true },
		{ id: "updated_at", label: "Updated Date", selected: false },
	];

	return (
		<div className="container mx-auto max-w-5xl space-y-6 py-8">
			{/* Header */}
			<div>
				<h1 className="font-bold text-3xl tracking-tight">
					Export {formatDataType(dataType)}
				</h1>
				<p className="mt-2 text-muted-foreground">
					Configure your export settings and download your data
				</p>
			</div>

			{/* Progress Steps */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center justify-between">
						{steps.map((step, index) => (
							<div className="flex flex-1 items-center" key={step.id}>
								<div className="flex flex-col items-center">
									<div
										className={`flex size-10 items-center justify-center rounded-full border-2 ${
											index <= currentStepIndex
												? "border-primary bg-primary text-primary-foreground"
												: "border-muted bg-muted text-muted-foreground"
										}`}
									>
										{index < currentStepIndex ? (
											<CheckCircle className="size-5" />
										) : (
											step.icon
										)}
									</div>
									<span
										className={`mt-2 text-xs ${
											index <= currentStepIndex
												? "font-medium text-foreground"
												: "text-muted-foreground"
										}`}
									>
										{step.label}
									</span>
								</div>
								{index < steps.length - 1 && (
									<div
										className={`mx-2 h-0.5 flex-1 ${index < currentStepIndex ? "bg-primary" : "bg-muted"}`}
									/>
								)}
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Step Content */}
			{currentStep === "filters" && (
				<Card>
					<CardHeader>
						<CardTitle>Apply Filters</CardTitle>
						<CardDescription>
							Filter the data you want to export (optional)
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Date Range</Label>
								<Select defaultValue="all">
									<SelectTrigger className="mt-2">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Time</SelectItem>
										<SelectItem value="ytd">Year to Date</SelectItem>
										<SelectItem value="last-year">Last Year</SelectItem>
										<SelectItem value="last-90">Last 90 Days</SelectItem>
										<SelectItem value="last-30">Last 30 Days</SelectItem>
										<SelectItem value="custom">Custom Range...</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label>Status</Label>
								<Select defaultValue="all">
									<SelectTrigger className="mt-2">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Statuses</SelectItem>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="pending">Pending</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
										<SelectItem value="cancelled">Cancelled</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox id="archived" />
							<Label className="text-sm" htmlFor="archived">
								Include archived records
							</Label>
						</div>

						<div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
							<p className="text-muted-foreground text-sm">
								Estimated records: <strong>1,247</strong>
							</p>
						</div>

						<div className="flex justify-end gap-2">
							<Button
								onClick={() => setCurrentStep("fields")}
								variant="default"
							>
								Next: Select Fields
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{currentStep === "fields" && (
				<Card>
					<CardHeader>
						<CardTitle>Select Fields</CardTitle>
						<CardDescription>
							Choose which fields to include in the export
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<Label>Available Fields</Label>
							<Button size="sm" variant="outline">
								Select All
							</Button>
						</div>

						<div className="grid gap-3 md:grid-cols-2">
							{availableFields.map((field) => (
								<div
									className="flex items-center space-x-2 rounded-lg border p-3"
									key={field.id}
								>
									<Checkbox defaultChecked={field.selected} id={field.id} />
									<Label className="text-sm" htmlFor={field.id}>
										{field.label}
									</Label>
								</div>
							))}
						</div>

						<div className="flex justify-between gap-2">
							<Button
								onClick={() => setCurrentStep("filters")}
								variant="outline"
							>
								Back
							</Button>
							<Button
								onClick={() => setCurrentStep("format")}
								variant="default"
							>
								Next: Choose Format
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{currentStep === "format" && (
				<Card>
					<CardHeader>
						<CardTitle>Export Format</CardTitle>
						<CardDescription>
							Choose the file format for your export
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-3">
							<button
								className={`flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-colors ${
									selectedFormat === "xlsx"
										? "border-primary bg-primary/5"
										: "border-border hover:border-primary/50"
								}`}
								onClick={() => setSelectedFormat("xlsx")}
								type="button"
							>
								<FileSpreadsheet className="size-8 text-success" />
								<div className="flex-1">
									<p className="font-medium">Excel (.xlsx)</p>
									<p className="text-muted-foreground text-sm">
										Modern Excel format with formatting support
									</p>
								</div>
								{selectedFormat === "xlsx" && (
									<Badge className="bg-primary">Selected</Badge>
								)}
							</button>

							<button
								className={`flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-colors ${
									selectedFormat === "csv"
										? "border-primary bg-primary/5"
										: "border-border hover:border-primary/50"
								}`}
								onClick={() => setSelectedFormat("csv")}
								type="button"
							>
								<FileSpreadsheet className="size-8 text-primary" />
								<div className="flex-1">
									<p className="font-medium">CSV (.csv)</p>
									<p className="text-muted-foreground text-sm">
										Universal format compatible with all software
									</p>
								</div>
								{selectedFormat === "csv" && (
									<Badge className="bg-primary">Selected</Badge>
								)}
							</button>

							<button
								className={`flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-colors ${
									selectedFormat === "pdf"
										? "border-primary bg-primary/5"
										: "border-border hover:border-primary/50"
								}`}
								onClick={() => setSelectedFormat("pdf")}
								type="button"
							>
								<FileSpreadsheet className="size-8 text-destructive" />
								<div className="flex-1">
									<p className="font-medium">PDF (.pdf)</p>
									<p className="text-muted-foreground text-sm">
										Print-ready format with charts and formatting
									</p>
								</div>
								{selectedFormat === "pdf" && (
									<Badge className="bg-primary">Selected</Badge>
								)}
							</button>
						</div>

						<div className="flex justify-between gap-2">
							<Button
								onClick={() => setCurrentStep("fields")}
								variant="outline"
							>
								Back
							</Button>
							<Button
								onClick={() => setCurrentStep("schedule")}
								variant="default"
							>
								Next: Schedule Options
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{currentStep === "schedule" && (
				<Card>
					<CardHeader>
						<CardTitle>Schedule Export</CardTitle>
						<CardDescription>
							Optionally schedule recurring exports (skip for one-time export)
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label>Export Frequency</Label>
							<Select defaultValue="once">
								<SelectTrigger className="mt-2">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="once">One-time Export</SelectItem>
									<SelectItem value="daily">Daily</SelectItem>
									<SelectItem value="weekly">Weekly</SelectItem>
									<SelectItem value="monthly">Monthly</SelectItem>
									<SelectItem value="quarterly">Quarterly</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label>Email To (comma-separated)</Label>
							<input
								className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
								placeholder="email@example.com"
								type="email"
							/>
							<p className="mt-1 text-muted-foreground text-xs">
								Leave empty to skip email delivery
							</p>
						</div>

						<div className="flex justify-between gap-2">
							<Button
								onClick={() => setCurrentStep("format")}
								variant="outline"
							>
								Back
							</Button>
							<Button
								onClick={() => setCurrentStep("preview")}
								variant="default"
							>
								Next: Preview & Download
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{currentStep === "preview" && (
				<Card>
					<CardHeader>
						<CardTitle>Preview & Download</CardTitle>
						<CardDescription>
							Review your export settings and download the file
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="flex items-center justify-between rounded-lg border p-3">
								<div>
									<p className="font-medium text-sm">Total Records</p>
									<p className="text-muted-foreground text-xs">
										1,247 records will be exported
									</p>
								</div>
								<Badge>1,247</Badge>
							</div>

							<div className="flex items-center justify-between rounded-lg border p-3">
								<div>
									<p className="font-medium text-sm">File Format</p>
									<p className="text-muted-foreground text-xs">
										{selectedFormat.toUpperCase()}
									</p>
								</div>
								<Badge>{selectedFormat}</Badge>
							</div>

							<div className="flex items-center justify-between rounded-lg border p-3">
								<div>
									<p className="font-medium text-sm">Selected Fields</p>
									<p className="text-muted-foreground text-xs">
										6 of 10 fields selected
									</p>
								</div>
								<Badge>6 Fields</Badge>
							</div>
						</div>

						<div className="rounded-lg border p-4">
							<p className="mb-2 font-medium text-sm">
								Preview (First 10 Rows)
							</p>
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b">
											<th className="px-2 py-1 text-left">ID</th>
											<th className="px-2 py-1 text-left">Name</th>
											<th className="px-2 py-1 text-left">Email</th>
											<th className="px-2 py-1 text-left">Phone</th>
										</tr>
									</thead>
									<tbody>
										{[1, 2, 3].map((i) => (
											<tr className="border-b" key={i}>
												<td className="px-2 py-1">{i}</td>
												<td className="px-2 py-1">Customer {i}</td>
												<td className="px-2 py-1">email{i}@example.com</td>
												<td className="px-2 py-1">(555) 123-456{i}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						<div className="flex justify-between gap-2">
							<Button
								onClick={() => setCurrentStep("schedule")}
								variant="outline"
							>
								Back
							</Button>
							<Button variant="default">
								<Download className="mr-2 size-4" />
								Download Export
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
