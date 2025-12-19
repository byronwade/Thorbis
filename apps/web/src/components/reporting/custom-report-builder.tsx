"use client";

/**
 * Custom Report Builder - Step-by-Step Wizard
 *
 * Redesigned with:
 * - Clear stepper navigation (not confusing tabs)
 * - Prominent Back/Next buttons
 * - Minimal borders (matches app UI)
 * - Visual progress indicator
 */

import {
	BarChart3,
	Briefcase,
	Calculator,
	Calendar,
	Check,
	CheckCircle2,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Clock,
	Columns3,
	CreditCard,
	Database,
	DollarSign,
	Eye,
	FileText,
	Filter,
	Hash,
	HelpCircle,
	Layers,
	LineChart,
	Percent,
	PieChart,
	Plus,
	Receipt,
	Save,
	Sparkles,
	Star,
	Table2,
	ToggleLeft,
	Trash2,
	TrendingUp,
	UserCheck,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useReportingStore } from "@/lib/stores/reporting-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	type AggregationType,
	DATA_SOURCES,
	DATA_SOURCES_MAP,
	type DataSource,
	type DataSourceField,
	type FilterOperator,
} from "@/lib/queries/data-sources";
import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

interface SelectedField {
	id: string;
	sourceId: string;
	fieldId: string;
	alias?: string;
	aggregation?: AggregationType;
}

interface ReportFilter {
	id: string;
	sourceId: string;
	fieldId: string;
	operator: FilterOperator;
	value: string;
	value2?: string;
}

interface ReportConfig {
	name: string;
	description: string;
	primarySource: string;
	selectedFields: SelectedField[];
	filters: ReportFilter[];
	chartType: string;
	limit: number;
}

type WizardStep = "source" | "fields" | "filters" | "visualization" | "save";

// =============================================================================
// CONSTANTS
// =============================================================================

const STEPS: { id: WizardStep; title: string; shortTitle: string }[] = [
	{ id: "source", title: "Choose Data Source", shortTitle: "Source" },
	{ id: "fields", title: "Select Fields", shortTitle: "Fields" },
	{ id: "filters", title: "Add Filters", shortTitle: "Filters" },
	{ id: "visualization", title: "Choose Chart", shortTitle: "Chart" },
	{ id: "save", title: "Name & Save", shortTitle: "Save" },
];

const FILTER_OPERATORS: { value: FilterOperator; label: string }[] = [
	{ value: "equals", label: "Equals" },
	{ value: "not_equals", label: "Not Equals" },
	{ value: "greater_than", label: "Greater Than" },
	{ value: "less_than", label: "Less Than" },
	{ value: "between", label: "Between" },
	{ value: "contains", label: "Contains" },
	{ value: "is_null", label: "Is Empty" },
	{ value: "is_not_null", label: "Has Value" },
];

const CHART_OPTIONS = [
	{
		value: "table",
		label: "Table",
		icon: Table2,
		description: "Raw data in rows and columns",
	},
	{
		value: "bar",
		label: "Bar Chart",
		icon: BarChart3,
		description: "Compare values across categories",
	},
	{
		value: "line",
		label: "Line Chart",
		icon: LineChart,
		description: "Show trends over time",
	},
	{
		value: "pie",
		label: "Pie Chart",
		icon: PieChart,
		description: "Show proportions of a whole",
	},
	{
		value: "area",
		label: "Area Chart",
		icon: TrendingUp,
		description: "Cumulative data over time",
	},
];

const SOURCE_ICONS: Record<string, React.ElementType> = {
	invoices: Receipt,
	payments: CreditCard,
	jobs: Briefcase,
	estimates: FileText,
	customers: Users,
	team_members: UserCheck,
};

const FIELD_TYPE_ICONS: Record<string, React.ElementType> = {
	currency: DollarSign,
	percentage: Percent,
	number: Hash,
	date: Calendar,
	boolean: ToggleLeft,
	rating: Star,
	string: Columns3,
	duration: Clock,
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function FieldTypeIcon({ type }: { type: DataSourceField["type"] }) {
	const Icon = FIELD_TYPE_ICONS[type] || Columns3;
	return <Icon className="h-3.5 w-3.5" />;
}

// =============================================================================
// STEP COMPONENTS
// =============================================================================

function StepDataSource({
	selectedSource,
	onSelect,
}: {
	selectedSource: string | null;
	onSelect: (sourceId: string) => void;
}) {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-semibold">
					What data do you want to analyze?
				</h2>
				<p className="text-sm text-muted-foreground">
					Choose a data source to get started. This determines what fields are
					available.
				</p>
			</div>

			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{DATA_SOURCES.map((source) => {
					const Icon = SOURCE_ICONS[source.id] || Database;
					const isSelected = selectedSource === source.id;
					return (
						<button
							key={source.id}
							type="button"
							onClick={() => onSelect(source.id)}
							className={cn(
								"group relative flex flex-col items-center gap-3 rounded-xl p-6 text-center transition-all",
								isSelected
									? "bg-primary/10 ring-2 ring-primary"
									: "bg-muted/30 hover:bg-muted/50",
							)}
						>
							{isSelected && (
								<div className="absolute top-3 right-3">
									<CheckCircle2 className="h-5 w-5 text-primary" />
								</div>
							)}
							<div
								className={cn(
									"flex h-14 w-14 items-center justify-center rounded-full transition-colors",
									isSelected
										? "bg-primary text-primary-foreground"
										: "bg-muted group-hover:bg-muted/80",
								)}
							>
								<Icon className="h-7 w-7" />
							</div>
							<div>
								<p className="font-semibold">{source.name}</p>
								<p className="text-xs text-muted-foreground line-clamp-2">
									{source.description}
								</p>
							</div>
							<Badge variant="secondary" className="text-xs">
								{source.fields.length} fields
							</Badge>
						</button>
					);
				})}
			</div>
		</div>
	);
}

function StepFields({
	source,
	selectedFields,
	onToggleField,
}: {
	source: DataSource;
	selectedFields: SelectedField[];
	onToggleField: (field: DataSourceField) => void;
}) {
	const [searchTerm, setSearchTerm] = useState("");

	const metrics = source.fields.filter((f) => f.category === "metric");
	const dimensions = source.fields.filter(
		(f) => f.category === "dimension" || f.category === "attribute",
	);

	const filteredMetrics = metrics.filter((f) =>
		f.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);
	const filteredDimensions = dimensions.filter((f) =>
		f.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const isFieldSelected = (fieldId: string) =>
		selectedFields.some((sf) => sf.fieldId === fieldId);

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-semibold">What data do you want to see?</h2>
				<p className="text-sm text-muted-foreground">
					Select the fields to include in your report. Click to toggle.
				</p>
			</div>

			<Input
				placeholder="Search fields..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="max-w-md"
			/>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Metrics */}
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<Calculator className="h-4 w-4 text-blue-500" />
						<span className="font-medium">Metrics</span>
						<span className="text-xs text-muted-foreground">
							(Numbers you can sum, average, etc.)
						</span>
					</div>
					<div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-2">
						{filteredMetrics.map((field) => {
							const selected = isFieldSelected(field.id);
							return (
								<button
									key={field.id}
									type="button"
									onClick={() => onToggleField(field)}
									className={cn(
										"w-full flex items-center gap-3 rounded-lg p-3 text-left transition-all",
										selected
											? "bg-primary/10 ring-1 ring-primary/30"
											: "bg-muted/30 hover:bg-muted/50",
									)}
								>
									<div
										className={cn(
											"flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
											selected
												? "bg-primary text-primary-foreground"
												: "bg-muted",
										)}
									>
										<FieldTypeIcon type={field.type} />
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-medium truncate">{field.name}</p>
										<p className="text-xs text-muted-foreground truncate">
											{field.description}
										</p>
									</div>
									{selected && (
										<Check className="h-4 w-4 text-primary flex-shrink-0" />
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Dimensions */}
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<Layers className="h-4 w-4 text-purple-500" />
						<span className="font-medium">Dimensions</span>
						<span className="text-xs text-muted-foreground">
							(Categories to group by)
						</span>
					</div>
					<div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-2">
						{filteredDimensions.map((field) => {
							const selected = isFieldSelected(field.id);
							return (
								<button
									key={field.id}
									type="button"
									onClick={() => onToggleField(field)}
									className={cn(
										"w-full flex items-center gap-3 rounded-lg p-3 text-left transition-all",
										selected
											? "bg-primary/10 ring-1 ring-primary/30"
											: "bg-muted/30 hover:bg-muted/50",
									)}
								>
									<div
										className={cn(
											"flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
											selected
												? "bg-primary text-primary-foreground"
												: "bg-muted",
										)}
									>
										<FieldTypeIcon type={field.type} />
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-medium truncate">{field.name}</p>
										<p className="text-xs text-muted-foreground truncate">
											{field.description}
										</p>
									</div>
									{selected && (
										<Check className="h-4 w-4 text-primary flex-shrink-0" />
									)}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{selectedFields.length > 0 && (
				<div className="rounded-xl bg-muted/30 p-4">
					<div className="flex items-center justify-between mb-3">
						<span className="text-sm font-medium">
							{selectedFields.length} fields selected
						</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{selectedFields.map((sf) => {
							const field = source.fields.find((f) => f.id === sf.fieldId);
							return (
								<Badge
									key={sf.id}
									variant="secondary"
									className="gap-1.5 py-1.5"
								>
									{field?.name}
								</Badge>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

function StepFilters({
	source,
	filters,
	onAddFilter,
	onUpdateFilter,
	onRemoveFilter,
}: {
	source: DataSource;
	filters: ReportFilter[];
	onAddFilter: () => void;
	onUpdateFilter: (id: string, updates: Partial<ReportFilter>) => void;
	onRemoveFilter: (id: string) => void;
}) {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-semibold">Filter your data (optional)</h2>
				<p className="text-sm text-muted-foreground">
					Add conditions to narrow down your results. Skip this step if you want
					all data.
				</p>
			</div>

			{filters.length === 0 ? (
				<div className="rounded-xl bg-muted/30 p-8 text-center">
					<Filter className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
					<p className="font-medium mb-1">No filters yet</p>
					<p className="text-sm text-muted-foreground mb-4">
						Your report will include all data. Add filters to focus on specific
						records.
					</p>
					<Button variant="outline" onClick={onAddFilter}>
						<Plus className="mr-2 h-4 w-4" />
						Add Filter
					</Button>
				</div>
			) : (
				<div className="space-y-3">
					{filters.map((filter, index) => (
						<div
							key={filter.id}
							className="flex items-center gap-3 rounded-xl bg-muted/30 p-4"
						>
							{index > 0 && (
								<Badge variant="secondary" className="text-xs">
									AND
								</Badge>
							)}

							<Select
								value={filter.fieldId}
								onValueChange={(v) => onUpdateFilter(filter.id, { fieldId: v })}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Select field" />
								</SelectTrigger>
								<SelectContent>
									{source.fields.map((f) => (
										<SelectItem key={f.id} value={f.id}>
											{f.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select
								value={filter.operator}
								onValueChange={(v) =>
									onUpdateFilter(filter.id, { operator: v as FilterOperator })
								}
							>
								<SelectTrigger className="w-[150px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{FILTER_OPERATORS.map((op) => (
										<SelectItem key={op.value} value={op.value}>
											{op.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{filter.operator !== "is_null" &&
								filter.operator !== "is_not_null" && (
									<Input
										placeholder="Value"
										value={filter.value}
										onChange={(e) =>
											onUpdateFilter(filter.id, { value: e.target.value })
										}
										className="w-[150px]"
									/>
								)}

							<Button
								variant="ghost"
								size="icon"
								className="h-9 w-9 text-muted-foreground hover:text-destructive"
								onClick={() => onRemoveFilter(filter.id)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}

					<Button variant="outline" size="sm" onClick={onAddFilter}>
						<Plus className="mr-2 h-4 w-4" />
						Add Another Filter
					</Button>
				</div>
			)}
		</div>
	);
}

function StepVisualization({
	chartType,
	onSelect,
}: {
	chartType: string;
	onSelect: (type: string) => void;
}) {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-semibold">How should your data look?</h2>
				<p className="text-sm text-muted-foreground">
					Choose a visualization that best represents your data.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{CHART_OPTIONS.map((option) => {
					const Icon = option.icon;
					const isSelected = chartType === option.value;
					return (
						<button
							key={option.value}
							type="button"
							onClick={() => onSelect(option.value)}
							className={cn(
								"group relative flex flex-col items-center gap-3 rounded-xl p-6 text-center transition-all",
								isSelected
									? "bg-primary/10 ring-2 ring-primary"
									: "bg-muted/30 hover:bg-muted/50",
							)}
						>
							{isSelected && (
								<div className="absolute top-3 right-3">
									<CheckCircle2 className="h-5 w-5 text-primary" />
								</div>
							)}
							<div
								className={cn(
									"flex h-14 w-14 items-center justify-center rounded-full transition-colors",
									isSelected
										? "bg-primary text-primary-foreground"
										: "bg-muted group-hover:bg-muted/80",
								)}
							>
								<Icon className="h-7 w-7" />
							</div>
							<div>
								<p className="font-semibold">{option.label}</p>
								<p className="text-xs text-muted-foreground">
									{option.description}
								</p>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}

function StepSave({
	config,
	selectedSource,
	onUpdateConfig,
}: {
	config: ReportConfig;
	selectedSource: DataSource | null;
	onUpdateConfig: (updates: Partial<ReportConfig>) => void;
}) {
	return (
		<div className="space-y-6 max-w-xl">
			<div>
				<h2 className="text-lg font-semibold">Name your report</h2>
				<p className="text-sm text-muted-foreground">
					Give your report a descriptive name so you can find it later.
				</p>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="name">Report Name *</Label>
					<Input
						id="name"
						placeholder="e.g., Monthly Revenue by Customer"
						value={config.name}
						onChange={(e) => onUpdateConfig({ name: e.target.value })}
						className="text-lg"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">Description (optional)</Label>
					<Textarea
						id="description"
						placeholder="What does this report show?"
						value={config.description}
						onChange={(e) => onUpdateConfig({ description: e.target.value })}
						rows={3}
					/>
				</div>
			</div>

			{/* Summary */}
			<div className="rounded-xl bg-muted/30 p-5 space-y-3">
				<h4 className="font-semibold flex items-center gap-2">
					<Sparkles className="h-4 w-4" />
					Report Summary
				</h4>
				<div className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-muted-foreground">Data Source</span>
						<span className="font-medium">{selectedSource?.name || "—"}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Fields</span>
						<span className="font-medium">
							{config.selectedFields.length} selected
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Filters</span>
						<span className="font-medium">
							{config.filters.length || "None"}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Visualization</span>
						<span className="font-medium capitalize">{config.chartType}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function CustomReportBuilder() {
	const router = useRouter();
	const { toast } = useToast();
	const addCustomReport = useReportingStore((state) => state.addCustomReport);

	const [currentStep, setCurrentStep] = useState<WizardStep>("source");
	const [isSaving, setIsSaving] = useState(false);
	const [config, setConfig] = useState<ReportConfig>({
		name: "",
		description: "",
		primarySource: "",
		selectedFields: [],
		filters: [],
		chartType: "table",
		limit: 100,
	});

	const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
	const progress = ((currentStepIndex + 1) / STEPS.length) * 100;
	const selectedSource = config.primarySource
		? DATA_SOURCES_MAP[config.primarySource]
		: null;

	// Navigation validation
	const canProceed = useMemo(() => {
		switch (currentStep) {
			case "source":
				return !!config.primarySource;
			case "fields":
				return config.selectedFields.length > 0;
			case "filters":
				return true; // Filters are optional
			case "visualization":
				return !!config.chartType;
			case "save":
				return config.name.trim().length > 0;
			default:
				return true;
		}
	}, [currentStep, config]);

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

	// Handlers
	const handleSourceSelect = useCallback((sourceId: string) => {
		setConfig((prev) => ({
			...prev,
			primarySource: sourceId,
			selectedFields: [],
			filters: [],
		}));
	}, []);

	const handleToggleField = useCallback((field: DataSourceField) => {
		setConfig((prev) => {
			const exists = prev.selectedFields.some((sf) => sf.fieldId === field.id);
			if (exists) {
				return {
					...prev,
					selectedFields: prev.selectedFields.filter(
						(sf) => sf.fieldId !== field.id,
					),
				};
			}
			return {
				...prev,
				selectedFields: [
					...prev.selectedFields,
					{
						id: `${field.id}-${Date.now()}`,
						sourceId: prev.primarySource,
						fieldId: field.id,
						aggregation: field.aggregations?.[0],
					},
				],
			};
		});
	}, []);

	const handleAddFilter = useCallback(() => {
		if (!selectedSource) return;
		const firstField = selectedSource.fields[0];
		setConfig((prev) => ({
			...prev,
			filters: [
				...prev.filters,
				{
					id: `filter-${Date.now()}`,
					sourceId: prev.primarySource,
					fieldId: firstField.id,
					operator: "equals",
					value: "",
				},
			],
		}));
	}, [selectedSource]);

	const handleUpdateFilter = useCallback(
		(id: string, updates: Partial<ReportFilter>) => {
			setConfig((prev) => ({
				...prev,
				filters: prev.filters.map((f) =>
					f.id === id ? { ...f, ...updates } : f,
				),
			}));
		},
		[],
	);

	const handleRemoveFilter = useCallback((id: string) => {
		setConfig((prev) => ({
			...prev,
			filters: prev.filters.filter((f) => f.id !== id),
		}));
	}, []);

	const handleSave = async () => {
		if (!config.name.trim()) {
			toast.error("Please enter a report name");
			return;
		}

		setIsSaving(true);
		try {
			// Generate a URL-friendly slug from the report name
			const slug = config.name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "");

			// Save to Zustand store (persisted to localStorage)
			addCustomReport({
				title: config.name,
				description: config.description,
				href: `/dashboard/reporting/custom/${slug}`,
				filters: {
					primarySource: config.primarySource,
					selectedFields: config.selectedFields,
					filters: config.filters,
					chartType: config.chartType,
					limit: config.limit,
				},
			});

			toast.success("Report saved successfully");
			router.push("/dashboard/reporting");
		} catch (error) {
			toast.error("Failed to save report. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<TooltipProvider delayDuration={200}>
			<div className="flex h-full flex-col">
				{/* Header with Progress */}
				<div className="bg-background/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4">
					<div className="flex items-center gap-4 mb-4">
						<SidebarTrigger className="-ml-1" />
						<div className="flex-1">
							<h1 className="text-lg font-semibold">Create Custom Report</h1>
							<p className="text-sm text-muted-foreground">
								Step {currentStepIndex + 1} of {STEPS.length}:{" "}
								{STEPS[currentStepIndex].title}
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => router.push("/dashboard/reporting")}
						>
							Cancel
						</Button>
					</div>

					{/* Progress Bar */}
					<div className="space-y-2">
						<Progress value={progress} className="h-1.5" />
						<div className="flex justify-between">
							{STEPS.map((step, index) => {
								const isActive = index === currentStepIndex;
								const isCompleted = index < currentStepIndex;
								return (
									<button
										key={step.id}
										type="button"
										onClick={() => {
											// Only allow going back to completed steps
											if (index < currentStepIndex) {
												setCurrentStep(step.id);
											}
										}}
										disabled={index > currentStepIndex}
										className={cn(
											"text-xs transition-colors",
											isActive && "text-primary font-semibold",
											isCompleted &&
												"text-primary cursor-pointer hover:underline",
											!isActive && !isCompleted && "text-muted-foreground",
										)}
									>
										<span className="hidden sm:inline">{step.shortTitle}</span>
										<span className="sm:hidden">{index + 1}</span>
										{isCompleted && <Check className="inline h-3 w-3 ml-1" />}
									</button>
								);
							})}
						</div>
					</div>
				</div>

				{/* Step Content */}
				<div className="flex-1 overflow-y-auto">
					<div className="p-6 max-w-5xl mx-auto">
						{currentStep === "source" && (
							<StepDataSource
								selectedSource={config.primarySource}
								onSelect={handleSourceSelect}
							/>
						)}

						{currentStep === "fields" && selectedSource && (
							<StepFields
								source={selectedSource}
								selectedFields={config.selectedFields}
								onToggleField={handleToggleField}
							/>
						)}

						{currentStep === "filters" && selectedSource && (
							<StepFilters
								source={selectedSource}
								filters={config.filters}
								onAddFilter={handleAddFilter}
								onUpdateFilter={handleUpdateFilter}
								onRemoveFilter={handleRemoveFilter}
							/>
						)}

						{currentStep === "visualization" && (
							<StepVisualization
								chartType={config.chartType}
								onSelect={(type) =>
									setConfig((prev) => ({ ...prev, chartType: type }))
								}
							/>
						)}

						{currentStep === "save" && (
							<StepSave
								config={config}
								selectedSource={selectedSource}
								onUpdateConfig={(updates) =>
									setConfig((prev) => ({ ...prev, ...updates }))
								}
							/>
						)}
					</div>
				</div>

				{/* Footer Navigation */}
				<div className="bg-background/80 backdrop-blur-xl sticky bottom-0 z-40 px-6 py-4">
					<div className="flex items-center justify-between max-w-5xl mx-auto">
						<Button
							variant="outline"
							onClick={goBack}
							disabled={currentStepIndex === 0}
						>
							<ChevronLeft className="mr-2 h-4 w-4" />
							Back
						</Button>

						<div className="flex gap-3">
							{currentStep === "save" ? (
								<>
									<Button variant="outline" disabled={isSaving}>
										<Eye className="mr-2 h-4 w-4" />
										Preview
									</Button>
									<Button
										onClick={handleSave}
										disabled={!canProceed || isSaving}
									>
										<Save className="mr-2 h-4 w-4" />
										{isSaving ? "Saving..." : "Save Report"}
									</Button>
								</>
							) : (
								<Button onClick={goNext} disabled={!canProceed}>
									Continue
									<ChevronRight className="ml-2 h-4 w-4" />
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
