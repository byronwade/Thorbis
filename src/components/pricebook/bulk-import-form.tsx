"use client";

/**
 * Bulk Import Form - Client Component
 *
 * Multi-step import process:
 * - Step 1: File upload
 * - Step 2: Column mapping
 * - Step 3: Validation & preview
 * - Step 4: Import with duplicate handling
 */

import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Upload, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ImportStep = "upload" | "mapping" | "validation" | "importing" | "complete";

type ColumnMapping = {
	name: string | null;
	sku: string | null;
	itemType: string | null;
	category: string | null;
	subcategory: string | null;
	cost: string | null;
	price: string | null;
	description: string | null;
	unit: string | null;
	supplierName: string | null;
	laborHours: string | null;
};

type ValidationIssue = {
	row: number;
	field: string;
	message: string;
	severity: "error" | "warning";
};

const requiredFields = ["name", "sku", "itemType", "category", "cost", "price"];

const priceBookFields = [
	{ value: "name", label: "Name" },
	{ value: "sku", label: "SKU" },
	{ value: "itemType", label: "Item Type" },
	{ value: "category", label: "Category" },
	{ value: "subcategory", label: "Subcategory" },
	{ value: "cost", label: "Cost" },
	{ value: "price", label: "Price" },
	{ value: "description", label: "Description" },
	{ value: "unit", label: "Unit" },
	{ value: "supplierName", label: "Supplier" },
	{ value: "laborHours", label: "Labor Hours" },
];

export function BulkImportForm() {
	const [step, setStep] = useState<ImportStep>("upload");
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [fileColumns, setFileColumns] = useState<string[]>([]);
	const [mapping, setMapping] = useState<ColumnMapping>({
		name: null,
		sku: null,
		itemType: null,
		category: null,
		subcategory: null,
		cost: null,
		price: null,
		description: null,
		unit: null,
		supplierName: null,
		laborHours: null,
	});
	const [duplicateHandling, setDuplicateHandling] = useState<"skip" | "update" | "create">("skip");
	const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
	const [importProgress, setImportProgress] = useState(0);

	const handleFileUpload = (uploadedFile: File) => {
		setFile(uploadedFile);

		// Mock: Parse file and extract columns
		const mockColumns = [
			"Item Name",
			"SKU Code",
			"Type",
			"Category Name",
			"Cost Price",
			"Sell Price",
			"Description",
			"Unit of Measure",
		];

		setFileColumns(mockColumns);

		// Auto-map obvious columns
		const autoMapping: ColumnMapping = {
			name: "Item Name",
			sku: "SKU Code",
			itemType: "Type",
			category: "Category Name",
			subcategory: null,
			cost: "Cost Price",
			price: "Sell Price",
			description: "Description",
			unit: "Unit of Measure",
			supplierName: null,
			laborHours: null,
		};

		setMapping(autoMapping);
		setStep("mapping");
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		const droppedFile = e.dataTransfer.files[0];
		if (droppedFile) {
			handleFileUpload(droppedFile);
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			handleFileUpload(selectedFile);
		}
	};

	const validateMapping = () => {
		const issues: ValidationIssue[] = [];

		// Check required fields
		requiredFields.forEach((field) => {
			if (!mapping[field as keyof ColumnMapping]) {
				issues.push({
					row: 0,
					field,
					message: `Required field "${field}" is not mapped`,
					severity: "error",
				});
			}
		});

		// Mock: Add some validation issues for demo
		if (issues.length === 0) {
			issues.push(
				{
					row: 5,
					field: "price",
					message: "Price is lower than cost (possible error)",
					severity: "warning",
				},
				{
					row: 12,
					field: "itemType",
					message: 'Invalid item type "services" (should be "service")',
					severity: "error",
				},
				{
					row: 18,
					field: "sku",
					message: "Duplicate SKU found in existing items",
					severity: "warning",
				}
			);
		}

		setValidationIssues(issues);
		setStep("validation");
	};

	const startImport = async () => {
		setStep("importing");
		setImportProgress(0);

		// Mock: Simulate import progress
		for (let i = 0; i <= 100; i += 10) {
			await new Promise((resolve) => setTimeout(resolve, 300));
			setImportProgress(i);
		}

		setStep("complete");
	};

	const downloadTemplate = () => {};

	// Step 1: Upload
	if (step === "upload") {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Upload File</CardTitle>
					<CardDescription>Select a CSV or Excel file containing your price book items</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div
						className={`flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
							isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
						}`}
						onDragLeave={handleDragLeave}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
					>
						<input
							accept=".csv,.xlsx,.xls"
							className="hidden"
							id="file-upload"
							onChange={handleFileSelect}
							type="file"
						/>
						<label className="flex cursor-pointer flex-col items-center" htmlFor="file-upload">
							<Upload className="mb-4 h-12 w-12 text-muted-foreground" />
							<p className="mb-2 font-medium">Drop your file here or click to browse</p>
							<p className="text-muted-foreground text-sm">Supports CSV, Excel (.xlsx, .xls)</p>
							<p className="mt-2 text-muted-foreground text-xs">Maximum file size: 10MB</p>
						</label>
					</div>

					<div className="flex items-center justify-center">
						<Button onClick={downloadTemplate} size="sm" variant="outline">
							<Download className="mr-2 h-4 w-4" />
							Download Template
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Step 2: Column Mapping
	if (step === "mapping") {
		const requiredMapped = requiredFields.every((field) => mapping[field as keyof ColumnMapping]);

		return (
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Column Mapping</CardTitle>
							<CardDescription>Match columns from your file to price book fields</CardDescription>
						</div>
						{file && (
							<div className="flex items-center gap-2">
								<FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{file.name}</span>
								<Button
									onClick={() => {
										setFile(null);
										setStep("upload");
									}}
									size="sm"
									variant="ghost"
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						)}
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="rounded-lg border bg-muted/30 p-3">
						<p className="font-medium text-sm">
							{requiredMapped ? "All required fields mapped" : "Some required fields are missing"}
						</p>
						<p className="text-muted-foreground text-xs">Required: Name, SKU, Item Type, Category, Cost, Price</p>
					</div>

					<div className="space-y-3">
						{priceBookFields.map((field) => {
							const isRequired = requiredFields.includes(field.value);

							return (
								<div className="grid grid-cols-2 gap-4" key={field.value}>
									<div className="flex items-center gap-2">
										<Label className="font-normal">{field.label}</Label>
										{isRequired && (
											<Badge className="text-xs" variant="secondary">
												Required
											</Badge>
										)}
									</div>
									<Select
										onValueChange={(value) =>
											setMapping({
												...mapping,
												[field.value]: value === "none" ? null : value,
											})
										}
										value={mapping[field.value as keyof ColumnMapping] || "none"}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select column" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="none">
												<span className="text-muted-foreground">Do not import</span>
											</SelectItem>
											{fileColumns.map((col) => (
												<SelectItem key={col} value={col}>
													{col}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							);
						})}
					</div>

					<div className="flex justify-end gap-2 pt-4">
						<Button onClick={() => setStep("upload")} size="sm" variant="outline">
							Back
						</Button>
						<Button disabled={!requiredMapped} onClick={validateMapping} size="sm">
							Continue to Validation
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Step 3: Validation
	if (step === "validation") {
		const errorCount = validationIssues.filter((i) => i.severity === "error").length;
		const warningCount = validationIssues.filter((i) => i.severity === "warning").length;

		return (
			<Card>
				<CardHeader>
					<CardTitle>Validation Results</CardTitle>
					<CardDescription>Review issues before importing {errorCount > 0 && "(errors must be fixed)"}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-2 gap-3">
						<div className="rounded-lg border bg-muted/30 p-3">
							<p className="text-muted-foreground text-xs">Errors</p>
							<p className="font-semibold text-2xl text-destructive">{errorCount}</p>
						</div>
						<div className="rounded-lg border bg-muted/30 p-3">
							<p className="text-muted-foreground text-xs">Warnings</p>
							<p className="font-semibold text-2xl text-warning">{warningCount}</p>
						</div>
					</div>

					{validationIssues.length > 0 && (
						<div className="space-y-2">
							{validationIssues.map((issue, index) => (
								<div
									className={`flex items-start gap-2 rounded-lg border p-3 ${
										issue.severity === "error"
											? "border-destructive bg-destructive dark:border-destructive/50 dark:bg-destructive/30"
											: "border-warning bg-warning dark:border-warning/50 dark:bg-warning/30"
									}`}
									key={index}
								>
									<AlertCircle
										className={`mt-0.5 h-4 w-4 ${
											issue.severity === "error"
												? "text-destructive dark:text-destructive"
												: "text-warning dark:text-warning"
										}`}
									/>
									<div className="flex-1">
										<p
											className={`font-medium text-sm ${
												issue.severity === "error"
													? "text-destructive dark:text-destructive"
													: "text-warning dark:text-warning"
											}`}
										>
											Row {issue.row} - {issue.field}
										</p>
										<p
											className={`text-xs ${
												issue.severity === "error"
													? "text-destructive dark:text-destructive"
													: "text-warning dark:text-warning"
											}`}
										>
											{issue.message}
										</p>
									</div>
								</div>
							))}
						</div>
					)}

					<div className="space-y-2">
						<Label>Duplicate Handling</Label>
						<RadioGroup onValueChange={(value: any) => setDuplicateHandling(value)} value={duplicateHandling}>
							<div className="flex items-center space-x-2">
								<RadioGroupItem id="skip" value="skip" />
								<Label className="font-normal" htmlFor="skip">
									Skip duplicates (keep existing)
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem id="update" value="update" />
								<Label className="font-normal" htmlFor="update">
									Update existing items
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem id="create" value="create" />
								<Label className="font-normal" htmlFor="create">
									Create new items (may create duplicates)
								</Label>
							</div>
						</RadioGroup>
					</div>

					<div className="flex justify-end gap-2 pt-4">
						<Button onClick={() => setStep("mapping")} size="sm" variant="outline">
							Back
						</Button>
						<Button disabled={errorCount > 0} onClick={startImport} size="sm">
							Start Import
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Step 4: Importing
	if (step === "importing") {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Importing Items</CardTitle>
					<CardDescription>Please wait while we import your data</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Progress</span>
							<span className="font-medium">{importProgress}%</span>
						</div>
						<Progress value={importProgress} />
					</div>

					<div className="flex min-h-[200px] items-center justify-center">
						<div className="text-center">
							<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
							<p className="font-medium">Importing items...</p>
							<p className="text-muted-foreground text-sm">This may take a few moments</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Step 5: Complete
	return (
		<Card>
			<CardHeader>
				<CardTitle>Import Complete</CardTitle>
				<CardDescription>Your items have been successfully imported</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex min-h-[200px] items-center justify-center">
					<div className="text-center">
						<CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-success" />
						<p className="mb-2 font-medium text-lg">Import Successful</p>
						<p className="text-muted-foreground text-sm">All items have been added to your price book</p>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-3">
					<div className="rounded-lg border bg-muted/30 p-3 text-center">
						<p className="text-muted-foreground text-xs">Total Imported</p>
						<p className="font-semibold text-2xl">127</p>
					</div>
					<div className="rounded-lg border bg-muted/30 p-3 text-center">
						<p className="text-muted-foreground text-xs">Updated</p>
						<p className="font-semibold text-2xl">12</p>
					</div>
					<div className="rounded-lg border bg-muted/30 p-3 text-center">
						<p className="text-muted-foreground text-xs">Skipped</p>
						<p className="font-semibold text-2xl">3</p>
					</div>
				</div>

				<div className="flex justify-end gap-2 pt-4">
					<Button asChild size="sm" variant="outline">
						<a href="/dashboard/work/pricebook/import">Import More</a>
					</Button>
					<Button asChild size="sm">
						<a href="/dashboard/work/pricebook">View Price Book</a>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
