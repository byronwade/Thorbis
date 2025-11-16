"use client";

/**
 * Job Details Toolbar Actions - Client Component
 *
 * Minimalistic toolbar actions for job details page:
 * - Edit Mode toggle
 * - Layout customization (Presets, Add Widget)
 *
 * Uses Zustand store for edit mode state (no React Context)
 */

import {
	ClipboardList,
	Edit3,
	Eye,
	LayoutGrid,
	Plus,
	RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { JobActivityTimeline } from "@/components/work/job-activity-timeline";
import { ALL_PRESETS } from "@/lib/presets/job-layout-presets";
import { useEditModeStore } from "@/lib/stores/edit-mode-store";
import {
	type JobWidgetType,
	useJobDetailsLayoutStore,
	WIDGET_METADATA,
} from "@/lib/stores/job-details-layout-store";

type JobDetailsToolbarActionsProps = {
	jobId?: string;
};

export function JobDetailsToolbarActions({
	jobId = "job-123",
}: JobDetailsToolbarActionsProps = {}) {
	const isEditMode = useEditModeStore((state) => state.isEditMode);
	const setIsEditMode = useEditModeStore((state) => state.setIsEditMode);
	const [isPresetsOpen, setIsPresetsOpen] = useState(false);
	const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
	const [isActivityOpen, setIsActivityOpen] = useState(false);

	const widgets = useJobDetailsLayoutStore((state) => state.widgets);
	const addWidget = useJobDetailsLayoutStore((state) => state.addWidget);
	const loadPreset = useJobDetailsLayoutStore((state) => state.loadPreset);
	const resetToDefault = useJobDetailsLayoutStore(
		(state) => state.resetToDefault,
	);
	const industry = useJobDetailsLayoutStore((state) => state.industry);

	// Get available widgets (not already added)
	const availableWidgets = Object.entries(WIDGET_METADATA).filter(
		([widgetType]) => !widgets.some((w) => w.type === widgetType),
	);

	// Group by category
	const widgetsByCategory = availableWidgets.reduce(
		(acc, [widgetType, metadata]) => {
			if (!acc[metadata.category]) {
				acc[metadata.category] = [];
			}
			acc[metadata.category].push([widgetType, metadata]);
			return acc;
		},
		{} as Record<string, [string, (typeof WIDGET_METADATA)[JobWidgetType]][]>,
	);

	function handleLoadPreset(presetId: string) {
		const preset = ALL_PRESETS.find((p) => p.id === presetId);
		if (preset) {
			loadPreset(preset);
			setIsPresetsOpen(false);
		}
	}

	function handleAddWidget(widgetType: JobWidgetType) {
		addWidget(widgetType);
		setIsAddWidgetOpen(false);
	}

	function handleReset() {
		if (confirm("Reset layout to default?")) {
			resetToDefault();
		}
	}

	return (
		<div className="flex items-center gap-1.5">
			{/* Edit Mode Toggle */}
			<div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-1.5">
				{isEditMode ? (
					<Edit3 className="size-4 text-primary" />
				) : (
					<Eye className="size-4 text-muted-foreground" />
				)}
				<span className="font-medium text-sm">
					{isEditMode ? "Edit" : "View"}
				</span>
				<Switch checked={isEditMode} onCheckedChange={setIsEditMode} />
			</div>

			<Separator className="h-6" orientation="vertical" />

			{/* Layout Actions Group */}
			<div className="flex items-center gap-1 rounded-lg border bg-muted/30 p-1">
				{/* Presets */}
				<Dialog onOpenChange={setIsPresetsOpen} open={isPresetsOpen}>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<DialogTrigger asChild>
									<Button
										className="gap-2 hover:bg-background"
										size="sm"
										variant="ghost"
									>
										<LayoutGrid className="size-4" />
										<span className="hidden sm:inline">Presets</span>
									</Button>
								</DialogTrigger>
							</TooltipTrigger>
							<TooltipContent>
								<p>Choose a layout preset</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<DialogContent className="max-w-3xl">
						<DialogHeader>
							<DialogTitle>Layout Presets</DialogTitle>
							<DialogDescription>
								Choose a pre-configured layout for your industry
							</DialogDescription>
						</DialogHeader>
						<ScrollArea className="h-[500px] pr-4">
							<div className="grid gap-4 md:grid-cols-2">
								{ALL_PRESETS.map((preset) => (
									<button
										className="group relative overflow-hidden rounded-lg border p-4 text-left transition-all hover:border-primary hover:shadow-md"
										key={preset.id}
										onClick={() => handleLoadPreset(preset.id)}
										type="button"
									>
										{industry === preset.industry && (
											<div className="absolute top-2 right-2 rounded-full bg-primary px-2 py-0.5 text-primary-foreground text-xs">
												Current
											</div>
										)}
										<h3 className="mb-1 font-semibold">{preset.name}</h3>
										<p className="text-muted-foreground text-sm">
											{preset.description}
										</p>
										<p className="mt-2 text-muted-foreground text-xs">
											{preset.widgets.length} widgets
										</p>
									</button>
								))}
							</div>
						</ScrollArea>
					</DialogContent>
				</Dialog>

				{/* Add Widget */}
				<Sheet onOpenChange={setIsAddWidgetOpen} open={isAddWidgetOpen}>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<SheetTrigger asChild>
									<Button
										className="gap-2 hover:bg-background"
										size="sm"
										variant="ghost"
									>
										<Plus className="size-4" />
										<span className="hidden sm:inline">Widget</span>
									</Button>
								</SheetTrigger>
							</TooltipTrigger>
							<TooltipContent>
								<p>Add a widget to the layout</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<SheetContent className="w-full sm:max-w-xl">
						<SheetHeader>
							<SheetTitle>Add Widget</SheetTitle>
							<SheetDescription>
								Add widgets to customize your view
							</SheetDescription>
						</SheetHeader>
						<ScrollArea className="h-[calc(100vh-120px)] pr-4">
							<div className="space-y-6 py-4">
								{Object.entries(widgetsByCategory).map(
									([category, widgets]) => (
										<div key={category}>
											<h3 className="mb-3 font-semibold text-sm capitalize">
												{category}
											</h3>
											<div className="space-y-2">
												{widgets.map(([widgetType, metadata]) => (
													<button
														className="flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all hover:border-primary"
														key={widgetType}
														onClick={() =>
															handleAddWidget(widgetType as JobWidgetType)
														}
														type="button"
													>
														<div className="flex-1">
															<div className="font-medium text-sm">
																{metadata.title}
															</div>
															<div className="text-muted-foreground text-xs">
																{metadata.description}
															</div>
														</div>
														<Plus className="size-4 text-muted-foreground" />
													</button>
												))}
											</div>
										</div>
									),
								)}
							</div>
						</ScrollArea>
					</SheetContent>
				</Sheet>

				{/* Reset */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="gap-2 hover:bg-background"
								onClick={handleReset}
								size="sm"
								variant="ghost"
							>
								<RotateCcw className="size-4" />
								<span className="hidden sm:inline">Reset</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Reset layout to default</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<Separator className="h-6" orientation="vertical" />

			{/* Activity Timeline */}
			<Sheet onOpenChange={setIsActivityOpen} open={isActivityOpen}>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<SheetTrigger asChild>
								<Button
									className="gap-2 border-primary/20 bg-primary/5 hover:border-primary/30 hover:bg-primary/10"
									size="sm"
									variant="outline"
								>
									<ClipboardList className="size-4 text-primary" />
									<span className="hidden font-medium sm:inline">Activity</span>
								</Button>
							</SheetTrigger>
						</TooltipTrigger>
						<TooltipContent>
							<p>View activity timeline</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<SheetContent className="flex w-full flex-col p-0 sm:max-w-2xl">
					<SheetHeader className="shrink-0 p-4">
						<SheetTitle>Activity Timeline</SheetTitle>
						<SheetDescription>
							Complete history of all changes, updates, and events for this job
						</SheetDescription>
					</SheetHeader>
					<JobActivityTimeline entityType="job" jobId={jobId} />
				</SheetContent>
			</Sheet>

			{/* Ellipsis Menu - Export/Import & More */}
			<Separator className="h-6" orientation="vertical" />
			<ImportExportDropdown dataType="jobs" />
		</div>
	);
}
