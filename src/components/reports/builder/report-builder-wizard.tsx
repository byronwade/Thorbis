"use client";

/**
 * Report Builder Wizard - Visual Report Creation
 *
 * Step-by-step wizard for creating custom reports.
 * Designed to be so intuitive a 5th grader can use it.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DollarSign,
	Briefcase,
	Users,
	UserCheck,
	Check,
	ChevronLeft,
	ChevronRight,
	Sparkles,
	BarChart3,
	LineChart,
	PieChart,
	TrendingUp,
	Calendar,
	Clock,
	Save,
	Eye,
} from "lucide-react";
import { useReportingStore } from "@/lib/stores/reporting-store";
import {
	REPORT_BUILDER_CATEGORIES,
	AVAILABLE_METRICS,
	CHART_TYPES,
	TIME_RANGE_PRESETS,
} from "@/lib/layout/reports-sidebar-config";

type WizardStep = "category" | "metrics" | "filters" | "visualization" | "save";

const STEPS: { id: WizardStep; title: string; description: string }[] = [
	{ id: "category", title: "What do you want to see?", description: "Pick a category" },
	{ id: "metrics", title: "What numbers matter?", description: "Choose your metrics" },
	{ id: "filters", title: "Filter it down", description: "Set your date range and filters" },
	{ id: "visualization", title: "How should it look?", description: "Pick your chart type" },
	{ id: "save", title: "Name & Save", description: "Give your report a name" },
];

export function ReportBuilderWizard() {
	const router = useRouter();
	const addCustomReport = useReportingStore((state) => state.addCustomReport);

	// Wizard state
	const [currentStep, setCurrentStep] = useState<WizardStep>("category");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
	const [dateRange, setDateRange] = useState("30d");
	const [chartType, setChartType] = useState("line");
	const [reportName, setReportName] = useState("");
	const [reportDescription, setReportDescription] = useState("");
	const [addToSidebar, setAddToSidebar] = useState(true);

	const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
	const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

	const canProceed = () => {
		switch (currentStep) {
			case "category":
				return selectedCategory !== null;
			case "metrics":
				return selectedMetrics.length > 0;
			case "filters":
				return dateRange !== "";
			case "visualization":
				return chartType !== "";
			case "save":
				return reportName.trim() !== "";
			default:
				return true;
		}
	};

	const goNext = () => {
		const nextIndex = currentStepIndex + 1;
		if (nextIndex < STEPS.length) {
			setCurrentStep(STEPS[nextIndex].id);
		}
	};

	const goBack = () => {
		const prevIndex = currentStepIndex - 1;
		if (prevIndex >= 0) {
			setCurrentStep(STEPS[prevIndex].id);
		}
	};

	const handleSave = () => {
		const slug = reportName
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");

		addCustomReport({
			title: reportName,
			description: reportDescription || `Custom ${selectedCategory} report`,
			href: `/dashboard/reports/custom/${slug}`,
			filters: {
				category: selectedCategory,
				metrics: selectedMetrics,
				dateRange,
				chartType,
			},
		});

		router.push("/dashboard/reports");
	};

	const categoryIcons: Record<string, React.ElementType> = {
		financial: DollarSign,
		operations: Briefcase,
		customers: Users,
		team: UserCheck,
	};

	const chartIcons: Record<string, React.ElementType> = {
		line: LineChart,
		bar: BarChart3,
		pie: PieChart,
		area: TrendingUp,
	};

	return (
		<div className="mx-auto max-w-3xl space-y-8 p-6">
			{/* Progress Header */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold">Create Custom Report</h1>
						<p className="text-muted-foreground">
							Step {currentStepIndex + 1} of {STEPS.length}
						</p>
					</div>
					<Badge variant="outline" className="gap-1">
						<Sparkles className="h-3 w-3" />
						Report Builder
					</Badge>
				</div>
				<Progress value={progress} className="h-2" />
				<div className="flex justify-between text-xs text-muted-foreground">
					{STEPS.map((step, index) => (
						<span
							key={step.id}
							className={cn(
								"transition-colors",
								index <= currentStepIndex && "text-primary font-medium"
							)}
						>
							{step.title}
						</span>
					))}
				</div>
			</div>

			{/* Step Content */}
			<Card className="min-h-[400px]">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl">
						{currentStep === "category" && "What do you want to see?"}
						{currentStep === "metrics" && "What numbers matter?"}
						{currentStep === "filters" && "Filter it down"}
						{currentStep === "visualization" && "How should it look?"}
						{currentStep === "save" && "Name & Save"}
					</CardTitle>
					<CardDescription>
						{STEPS.find((s) => s.id === currentStep)?.description}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Step 1: Category Selection */}
					{currentStep === "category" && (
						<div className="grid gap-4 sm:grid-cols-2">
							{REPORT_BUILDER_CATEGORIES.map((category) => {
								const Icon = categoryIcons[category.id] || Briefcase;
								return (
									<button
										key={category.id}
										type="button"
										onClick={() => setSelectedCategory(category.id)}
										className={cn(
											"flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-center transition-all hover:border-primary/50 hover:bg-muted/50",
											selectedCategory === category.id
												? "border-primary bg-primary/5"
												: "border-border"
										)}
									>
										<div
											className={cn(
												"flex h-16 w-16 items-center justify-center rounded-full",
												category.color
											)}
										>
											<Icon className="h-8 w-8 text-white" />
										</div>
										<div>
											<h3 className="text-lg font-semibold">{category.label}</h3>
											<p className="text-sm text-muted-foreground">
												{category.id === "financial" && "Revenue, profit, expenses"}
												{category.id === "operations" && "Jobs, completion, efficiency"}
												{category.id === "customers" && "Retention, LTV, acquisition"}
												{category.id === "team" && "Utilization, performance, ratings"}
											</p>
										</div>
										{selectedCategory === category.id && (
											<Check className="h-5 w-5 text-primary" />
										)}
									</button>
								);
							})}
						</div>
					)}

					{/* Step 2: Metrics Selection */}
					{currentStep === "metrics" && selectedCategory && (
						<div className="space-y-4">
							<p className="text-sm text-muted-foreground">
								Click to select the metrics you want in your report. You can choose multiple.
							</p>
							<div className="grid gap-2 sm:grid-cols-2">
								{AVAILABLE_METRICS[selectedCategory as keyof typeof AVAILABLE_METRICS]?.map(
									(metric) => (
										<button
											key={metric.id}
											type="button"
											onClick={() => {
												setSelectedMetrics((prev) =>
													prev.includes(metric.id)
														? prev.filter((m) => m !== metric.id)
														: [...prev, metric.id]
												);
											}}
											className={cn(
												"flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
												selectedMetrics.includes(metric.id)
													? "border-primary bg-primary/5"
													: "border-border hover:border-primary/50"
											)}
										>
											<div
												className={cn(
													"flex h-8 w-8 items-center justify-center rounded-full",
													selectedMetrics.includes(metric.id)
														? "bg-primary text-primary-foreground"
														: "bg-muted"
												)}
											>
												{selectedMetrics.includes(metric.id) ? (
													<Check className="h-4 w-4" />
												) : (
													<span className="text-xs font-bold">
														{metric.type === "currency" && "$"}
														{metric.type === "percentage" && "%"}
														{metric.type === "number" && "#"}
														{metric.type === "duration" && "⏱"}
														{metric.type === "rating" && "★"}
													</span>
												)}
											</div>
											<div>
												<p className="font-medium">{metric.label}</p>
												<p className="text-xs text-muted-foreground capitalize">
													{metric.type}
												</p>
											</div>
										</button>
									)
								)}
							</div>
							<div className="mt-4 flex items-center gap-2 text-sm">
								<Badge variant="secondary">{selectedMetrics.length} selected</Badge>
								{selectedMetrics.length > 0 && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setSelectedMetrics([])}
									>
										Clear all
									</Button>
								)}
							</div>
						</div>
					)}

					{/* Step 3: Filters */}
					{currentStep === "filters" && (
						<div className="space-y-6">
							<div className="space-y-3">
								<Label className="text-base">Date Range</Label>
								<p className="text-sm text-muted-foreground">
									What time period should this report cover?
								</p>
								<div className="grid gap-2 sm:grid-cols-3">
									{TIME_RANGE_PRESETS.slice(0, 6).map((preset) => (
										<button
											key={preset.id}
											type="button"
											onClick={() => setDateRange(preset.id)}
											className={cn(
												"flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-all",
												dateRange === preset.id
													? "border-primary bg-primary/5"
													: "border-border hover:border-primary/50"
											)}
										>
											<Calendar className="h-4 w-4 text-muted-foreground" />
											<span className="font-medium">{preset.label}</span>
											{dateRange === preset.id && (
												<Check className="ml-auto h-4 w-4 text-primary" />
											)}
										</button>
									))}
								</div>
							</div>

							<div className="space-y-3">
								<Label className="text-base">Comparison (Optional)</Label>
								<p className="text-sm text-muted-foreground">
									Compare against a previous period?
								</p>
								<Select defaultValue="none">
									<SelectTrigger>
										<SelectValue placeholder="Select comparison" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">No comparison</SelectItem>
										<SelectItem value="previous">Previous period</SelectItem>
										<SelectItem value="last_year">Same period last year</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					)}

					{/* Step 4: Visualization */}
					{currentStep === "visualization" && (
						<div className="space-y-4">
							<p className="text-sm text-muted-foreground">
								Pick how you want your data displayed.
							</p>
							<div className="grid gap-4 sm:grid-cols-2">
								{CHART_TYPES.map((chart) => {
									const Icon = chartIcons[chart.id] || LineChart;
									return (
										<button
											key={chart.id}
											type="button"
											onClick={() => setChartType(chart.id)}
											className={cn(
												"flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all",
												chartType === chart.id
													? "border-primary bg-primary/5"
													: "border-border hover:border-primary/50"
											)}
										>
											<div
												className={cn(
													"flex h-12 w-12 items-center justify-center rounded-lg",
													chartType === chart.id
														? "bg-primary text-primary-foreground"
														: "bg-muted"
												)}
											>
												<Icon className="h-6 w-6" />
											</div>
											<div>
												<h3 className="font-semibold">{chart.label}</h3>
												<p className="text-sm text-muted-foreground">
													{chart.description}
												</p>
											</div>
											{chartType === chart.id && (
												<Check className="ml-auto h-5 w-5 text-primary" />
											)}
										</button>
									);
								})}
							</div>
						</div>
					)}

					{/* Step 5: Save */}
					{currentStep === "save" && (
						<div className="space-y-6">
							<div className="space-y-3">
								<Label htmlFor="reportName" className="text-base">
									Report Name *
								</Label>
								<Input
									id="reportName"
									placeholder="e.g., Monthly Revenue Summary"
									value={reportName}
									onChange={(e) => setReportName(e.target.value)}
									className="text-lg"
								/>
							</div>

							<div className="space-y-3">
								<Label htmlFor="reportDescription" className="text-base">
									Description (Optional)
								</Label>
								<Textarea
									id="reportDescription"
									placeholder="What does this report show?"
									value={reportDescription}
									onChange={(e) => setReportDescription(e.target.value)}
									rows={3}
								/>
							</div>

							<div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
								<Checkbox
									id="addToSidebar"
									checked={addToSidebar}
									onCheckedChange={(checked) => setAddToSidebar(checked as boolean)}
								/>
								<div>
									<Label htmlFor="addToSidebar" className="cursor-pointer font-medium">
										Add to sidebar
									</Label>
									<p className="text-sm text-muted-foreground">
										Quick access from the reports sidebar
									</p>
								</div>
							</div>

							{/* Summary */}
							<div className="rounded-lg border bg-card/50 p-4">
								<h4 className="mb-3 font-semibold">Report Summary</h4>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Category:</span>
										<span className="font-medium capitalize">{selectedCategory}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Metrics:</span>
										<span className="font-medium">{selectedMetrics.length} selected</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Date Range:</span>
										<span className="font-medium">
											{TIME_RANGE_PRESETS.find((p) => p.id === dateRange)?.label}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Chart Type:</span>
										<span className="font-medium capitalize">{chartType}</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Navigation */}
			<div className="flex items-center justify-between">
				<Button
					variant="outline"
					onClick={goBack}
					disabled={currentStepIndex === 0}
				>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back
				</Button>

				<div className="flex gap-2">
					{currentStep === "save" ? (
						<>
							<Button variant="outline">
								<Eye className="mr-2 h-4 w-4" />
								Preview
							</Button>
							<Button onClick={handleSave} disabled={!canProceed()}>
								<Save className="mr-2 h-4 w-4" />
								Save Report
							</Button>
						</>
					) : (
						<Button onClick={goNext} disabled={!canProceed()}>
							Next
							<ChevronRight className="ml-2 h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
