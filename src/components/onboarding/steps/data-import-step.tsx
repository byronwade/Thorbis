"use client";

/**
 * Data Import Step - Import from Previous Software
 *
 * Based on competitor research (Housecall Pro, FieldPulse, ServiceTitan):
 * - Software migration selector with competitor-specific templates
 * - Customer data import (CSV/Excel)
 * - Price book/service catalog import
 * - Job history import (optional)
 * - Equipment/asset import
 *
 * Key insight: This dramatically reduces onboarding friction and
 * support calls - competitors offer dedicated data teams for this.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	Upload,
	FileSpreadsheet,
	Users,
	DollarSign,
	Wrench,
	Clock,
	CheckCircle2,
	ArrowRight,
	Download,
	ExternalLink,
	Sparkles,
	AlertCircle,
	HelpCircle,
	Calendar,
	Phone,
} from "lucide-react";

// Competitor software options with export guides
const PREVIOUS_SOFTWARE = [
	{
		value: "none",
		label: "Starting Fresh",
		description: "I don't have existing data to import",
		icon: Sparkles,
	},
	{
		value: "housecall-pro",
		label: "Housecall Pro",
		description: "Export via Settings > Data Export",
		exportGuide: "https://help.housecallpro.com/en/articles/export-data",
		templates: ["customers", "jobs", "invoices", "price-book"],
	},
	{
		value: "jobber",
		label: "Jobber",
		description: "Export via Reports > Export Data",
		exportGuide: "https://help.getjobber.com/hc/en-us/articles/export",
		templates: ["customers", "jobs", "invoices", "quotes"],
	},
	{
		value: "servicetitan",
		label: "ServiceTitan",
		description: "Contact support for data export",
		exportGuide: "https://help.servicetitan.com/data-export",
		templates: ["customers", "jobs", "invoices", "price-book", "equipment"],
	},
	{
		value: "fieldedge",
		label: "FieldEdge",
		description: "Export via Admin > Data Management",
		exportGuide: "https://help.fieldedge.com/export",
		templates: ["customers", "jobs", "invoices"],
	},
	{
		value: "workiz",
		label: "Workiz",
		description: "Export via Settings > Data Export",
		exportGuide: "https://help.workiz.com/en/articles/export",
		templates: ["customers", "jobs", "invoices", "price-book"],
	},
	{
		value: "servicem8",
		label: "ServiceM8",
		description: "Export via Settings > Account > Export",
		exportGuide: "https://support.servicem8.com/hc/export",
		templates: ["customers", "jobs", "invoices"],
	},
	{
		value: "quickbooks",
		label: "QuickBooks",
		description: "Export customer list and items",
		exportGuide: "https://quickbooks.intuit.com/learn-support/export",
		templates: ["customers", "invoices", "price-book"],
	},
	{
		value: "spreadsheet",
		label: "Spreadsheets (Excel/Google Sheets)",
		description: "I have data in spreadsheets",
		templates: ["customers", "price-book", "equipment"],
	},
	{
		value: "other",
		label: "Other Software",
		description: "Another field service software",
		templates: ["customers", "price-book"],
	},
];

// Import types with descriptions
const IMPORT_TYPES = [
	{
		id: "customers",
		label: "Customer Data",
		description: "Names, addresses, phone numbers, emails, service history notes",
		icon: Users,
		fields: ["name", "email", "phone", "address", "city", "state", "zip", "notes"],
		priority: "high",
		estimatedTime: "2-5 min",
	},
	{
		id: "price-book",
		label: "Price Book / Services",
		description: "Your service catalog with pricing, labor rates, materials",
		icon: DollarSign,
		fields: ["service_name", "description", "price", "duration", "category"],
		priority: "high",
		estimatedTime: "2-5 min",
	},
	{
		id: "equipment",
		label: "Equipment / Assets",
		description: "Installed equipment at customer locations (HVAC units, water heaters, etc.)",
		icon: Wrench,
		fields: ["type", "brand", "model", "serial", "install_date", "customer_id"],
		priority: "medium",
		estimatedTime: "3-10 min",
	},
	{
		id: "jobs",
		label: "Job History",
		description: "Past jobs, service records, and notes (optional but valuable)",
		icon: Calendar,
		fields: ["customer", "date", "service", "technician", "notes", "amount"],
		priority: "low",
		estimatedTime: "5-15 min",
	},
];

// Template download links (these would be real files)
const TEMPLATE_URLS: Record<string, string> = {
	customers: "/templates/customer-import-template.xlsx",
	"price-book": "/templates/pricebook-import-template.xlsx",
	equipment: "/templates/equipment-import-template.xlsx",
	jobs: "/templates/job-history-import-template.xlsx",
};

interface ImportStatus {
	type: string;
	status: "pending" | "uploading" | "processing" | "complete" | "error";
	progress: number;
	recordCount?: number;
	errorMessage?: string;
}

export function DataImportStep() {
	const { data, updateData } = useOnboardingStore();
	const [importStatuses, setImportStatuses] = useState<Record<string, ImportStatus>>({});
	const [showExportGuide, setShowExportGuide] = useState(false);

	const selectedSoftware = PREVIOUS_SOFTWARE.find((s) => s.value === data.previousSoftware);
	const availableTemplates = selectedSoftware?.templates || [];

	// Handle software selection
	const handleSoftwareSelect = (value: string) => {
		updateData({ previousSoftware: value });
		setShowExportGuide(value !== "none" && value !== "spreadsheet");
	};

	// Simulate file upload (in production, this would call an API)
	const handleFileUpload = async (importType: string, file: File) => {
		setImportStatuses((prev) => ({
			...prev,
			[importType]: { type: importType, status: "uploading", progress: 0 },
		}));

		// Simulate upload progress
		for (let i = 0; i <= 100; i += 10) {
			await new Promise((r) => setTimeout(r, 200));
			setImportStatuses((prev) => ({
				...prev,
				[importType]: { ...prev[importType], progress: i },
			}));
		}

		// Simulate processing
		setImportStatuses((prev) => ({
			...prev,
			[importType]: { ...prev[importType], status: "processing", progress: 100 },
		}));

		await new Promise((r) => setTimeout(r, 1500));

		// Complete with mock record count
		const mockRecordCount = Math.floor(Math.random() * 200) + 20;
		setImportStatuses((prev) => ({
			...prev,
			[importType]: {
				...prev[importType],
				status: "complete",
				recordCount: mockRecordCount,
			},
		}));

		// Update store with import status
		updateData({
			dataImportCompleted: {
				...(data.dataImportCompleted || {}),
				[importType]: { recordCount: mockRecordCount, importedAt: new Date().toISOString() },
			},
		});
	};

	// File input handler
	const handleFileChange = (importType: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleFileUpload(importType, file);
		}
	};

	const completedImports = Object.values(importStatuses).filter(
		(s) => s.status === "complete"
	).length;

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="text-center space-y-3">
				<h1 className="text-3xl font-semibold tracking-tight">
					Import Your Existing Data
				</h1>
				<p className="text-muted-foreground text-lg max-w-lg mx-auto">
					Bring your customers, price book, and equipment with you.
					Don't start from scratch.
				</p>
			</div>

			{/* Previous Software Selection */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<FileSpreadsheet className="h-5 w-5 text-primary" />
						Where is your data coming from?
					</CardTitle>
					<CardDescription>
						Select your previous software and we'll provide export instructions and templates.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Select
						value={data.previousSoftware || ""}
						onValueChange={handleSoftwareSelect}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select your previous software..." />
						</SelectTrigger>
						<SelectContent>
							{PREVIOUS_SOFTWARE.map((software) => {
								const Icon = software.icon || FileSpreadsheet;
								return (
									<SelectItem key={software.value} value={software.value}>
										<div className="flex items-center gap-2">
											<Icon className="h-4 w-4 text-muted-foreground" />
											<span>{software.label}</span>
										</div>
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>

					{/* Export Guide for selected software */}
					{selectedSoftware && selectedSoftware.value !== "none" && selectedSoftware.exportGuide && (
						<div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
							<div className="flex items-start gap-3">
								<div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
									<HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
								</div>
								<div className="space-y-2">
									<p className="font-medium text-blue-900 dark:text-blue-100">
										How to export from {selectedSoftware.label}
									</p>
									<p className="text-sm text-blue-700 dark:text-blue-300">
										{selectedSoftware.description}
									</p>
									<Button variant="link" className="h-auto p-0 text-blue-600" asChild>
										<a
											href={selectedSoftware.exportGuide}
											target="_blank"
											rel="noopener noreferrer"
										>
											View export guide
											<ExternalLink className="ml-1 h-3 w-3" />
										</a>
									</Button>
								</div>
							</div>
						</div>
					)}

					{/* Starting fresh message */}
					{data.previousSoftware === "none" && (
						<div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
							<div className="flex items-start gap-3">
								<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
								<div>
									<p className="font-medium text-green-900 dark:text-green-100">
										Great! Starting fresh
									</p>
									<p className="text-sm text-green-700 dark:text-green-300">
										No worries - you can add customers and services manually, or import data later
										from Settings &gt; Data Import.
									</p>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Import Options - Only show if not starting fresh */}
			{data.previousSoftware && data.previousSoftware !== "none" && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-medium">Choose what to import</h2>
						{completedImports > 0 && (
							<Badge variant="secondary" className="bg-green-100 text-green-800">
								{completedImports} import{completedImports !== 1 && "s"} complete
							</Badge>
						)}
					</div>

					<div className="grid gap-4">
						{IMPORT_TYPES.map((importType) => {
							const Icon = importType.icon;
							const isAvailable = availableTemplates.includes(importType.id);
							const status = importStatuses[importType.id];

							return (
								<Card
									key={importType.id}
									className={cn(
										"transition-all",
										!isAvailable && "opacity-50",
										status?.status === "complete" && "border-green-500 bg-green-50/50 dark:bg-green-950/20"
									)}
								>
									<CardContent className="p-4">
										<div className="flex items-start gap-4">
											<div
												className={cn(
													"p-2 rounded-lg",
													status?.status === "complete"
														? "bg-green-100 dark:bg-green-900"
														: "bg-muted"
												)}
											>
												{status?.status === "complete" ? (
													<CheckCircle2 className="h-5 w-5 text-green-600" />
												) : (
													<Icon className="h-5 w-5" />
												)}
											</div>

											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<h3 className="font-medium">{importType.label}</h3>
													<Badge
														variant="outline"
														className={cn(
															"text-xs",
															importType.priority === "high"
																? "border-orange-300 text-orange-700"
																: importType.priority === "medium"
																? "border-blue-300 text-blue-700"
																: "border-gray-300 text-gray-600"
														)}
													>
														{importType.priority === "high" ? "Recommended" : "Optional"}
													</Badge>
												</div>
												<p className="text-sm text-muted-foreground mt-1">
													{importType.description}
												</p>

												{/* Upload progress */}
												{status && status.status !== "complete" && (
													<div className="mt-3 space-y-2">
														<Progress value={status.progress} className="h-2" />
														<p className="text-xs text-muted-foreground">
															{status.status === "uploading"
																? `Uploading... ${status.progress}%`
																: "Processing your data..."}
														</p>
													</div>
												)}

												{/* Success message */}
												{status?.status === "complete" && (
													<div className="mt-2 flex items-center gap-2 text-sm text-green-600">
														<CheckCircle2 className="h-4 w-4" />
														<span>{status.recordCount} records imported successfully</span>
													</div>
												)}
											</div>

											<div className="flex flex-col gap-2">
												{/* Download template */}
												<Button variant="outline" size="sm" asChild disabled={!isAvailable}>
													<a href={TEMPLATE_URLS[importType.id]} download>
														<Download className="h-3.5 w-3.5 mr-1" />
														Template
													</a>
												</Button>

												{/* Upload file */}
												{isAvailable && status?.status !== "complete" && (
													<div className="relative">
														<input
															type="file"
															accept=".csv,.xlsx,.xls"
															onChange={handleFileChange(importType.id)}
															className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
															disabled={status?.status === "uploading" || status?.status === "processing"}
														/>
														<Button
															size="sm"
															disabled={status?.status === "uploading" || status?.status === "processing"}
														>
															<Upload className="h-3.5 w-3.5 mr-1" />
															Upload
														</Button>
													</div>
												)}
											</div>
										</div>

										{/* Field reference */}
										<Accordion type="single" collapsible className="mt-3">
											<AccordionItem value="fields" className="border-0">
												<AccordionTrigger className="text-xs text-muted-foreground py-2 hover:no-underline">
													View expected fields
												</AccordionTrigger>
												<AccordionContent>
													<div className="flex flex-wrap gap-1.5 pt-1">
														{importType.fields.map((field) => (
															<Badge key={field} variant="secondary" className="text-xs font-mono">
																{field}
															</Badge>
														))}
													</div>
												</AccordionContent>
											</AccordionItem>
										</Accordion>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			)}

			{/* Need Help CTA */}
			<Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
				<CardContent className="p-6">
					<div className="flex items-center gap-4">
						<div className="p-3 rounded-full bg-primary/10">
							<Phone className="h-6 w-6 text-primary" />
						</div>
						<div className="flex-1">
							<h3 className="font-semibold">Need help migrating your data?</h3>
							<p className="text-sm text-muted-foreground">
								Our team can help you export and import your data from any system.
								Schedule a free 30-minute data migration call.
							</p>
						</div>
						<Button variant="outline">
							Schedule Call
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Time estimate */}
			<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
				<Clock className="h-4 w-4" />
				<span>
					{data.previousSoftware === "none"
						? "You can skip this step and import data later"
						: "Most imports complete in under 5 minutes"}
				</span>
			</div>
		</div>
	);
}
