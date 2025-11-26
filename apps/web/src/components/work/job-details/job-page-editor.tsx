/**
 * Job Page Editor - Client Component
 *
 * Tabbed interface for comprehensive job management
 *
 * Performance optimizations:
 * - Client Component only (uses "use client")
 * - Lazy-loaded tab content
 * - Zustand state management for optimal re-renders
 * - Suspense boundaries for loading states
 *
 * Features:
 * - 7 tabs: Overview, Team & Schedule, Financials, Materials, Photos & Docs, Activity, Equipment
 * - Inline editing with auto-save
 * - Keyboard shortcuts (Cmd+E for edit mode, Cmd+K for command palette)
 * - Mobile-responsive design
 * - Right sidebar for quick actions
 */

"use client";

import {
	Activity,
	Building2,
	Camera,
	ChevronRight,
	DollarSign,
	Edit3,
	Package,
	Save,
	Users,
	Wrench,
	X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { updateJobData } from "@/actions/jobs";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useActiveTab,
	useHasUnsavedChanges,
	useIsEditMode,
	useJobEditorStore,
	useSetActiveTab,
	useToggleEditMode,
} from "@/lib/stores/job-editor-store";
import { JobCommandPalette } from "./job-command-palette";

// Lazy load heavy tab components
const OverviewTab = dynamic(
	() =>
		import("./tabs/overview-tab").then((mod) => ({ default: mod.OverviewTab })),
	{
		loading: () => <Skeleton className="h-[400px] w-full" />,
	},
);

const TeamScheduleTab = dynamic(
	() =>
		import("./tabs/team-schedule-tab").then((mod) => ({
			default: mod.TeamScheduleTab,
		})),
	{
		loading: () => <Skeleton className="h-[400px] w-full" />,
	},
);

const FinancialsTab = dynamic(
	() =>
		import("./tabs/financials-tab").then((mod) => ({
			default: mod.FinancialsTab,
		})),
	{
		loading: () => <Skeleton className="h-[400px] w-full" />,
	},
);

const MaterialsTab = dynamic(
	() =>
		import("./tabs/materials-tab").then((mod) => ({
			default: mod.MaterialsTab,
		})),
	{
		loading: () => <Skeleton className="h-[400px] w-full" />,
	},
);

const PhotosDocsTab = dynamic(
	() =>
		import("./tabs/photos-docs-tab").then((mod) => ({
			default: mod.PhotosDocsTab,
		})),
	{
		loading: () => <Skeleton className="h-[400px] w-full" />,
	},
);

const ActivityTab = dynamic(
	() =>
		import("./tabs/activity-tab").then((mod) => ({
			default: mod.ActivityTab,
		})),
	{
		loading: () => <Skeleton className="h-[400px] w-full" />,
	},
);

const EquipmentTab = dynamic(
	() =>
		import("./tabs/equipment-tab").then((mod) => ({
			default: mod.EquipmentTab,
		})),
	{
		loading: () => <Skeleton className="h-[400px] w-full" />,
	},
);

// ============================================================================
// Types
// ============================================================================

export type JobPageEditorProps = {
	job: any;
	customer: any;
	customers: any[];
	property: any;
	properties: any[];
	propertyEnrichment: any;
	assignedUser: any;
	teamAssignments: any[];
	availableTeamMembers?: any[];
	timeEntries: any[];
	invoices: any[];
	estimates: any[];
	materials: any[];
	photos: any[];
	photosByCategory: Record<string, any[]>;
	documents: any[];
	signatures: any[];
	customerSignature: any;
	technicianSignature: any;
	activities: any[];
	communications: any[];
	equipment: any[];
	workflowStages: any[];
	metrics: any;
};

// ============================================================================
// Component
// ============================================================================

export function JobPageEditor({
	job,
	customer,
	customers,
	property,
	properties,
	propertyEnrichment,
	assignedUser,
	teamAssignments,
	availableTeamMembers = [],
	timeEntries,
	invoices,
	estimates,
	materials,
	photos,
	photosByCategory,
	documents,
	signatures,
	customerSignature,
	technicianSignature,
	activities,
	communications,
	equipment,
	workflowStages,
	metrics,
}: JobPageEditorProps) {
	const router = useRouter();

	// Zustand store selectors
	const activeTab = useActiveTab();
	const setActiveTab = useSetActiveTab();
	const isEditMode = useIsEditMode();
	const toggleEditMode = useToggleEditMode();
	const hasUnsavedChanges = useHasUnsavedChanges();

	const {
		saveStatus,
		setSaveStatus,
		saveError,
		setSaveError,
		isRightSidebarOpen,
		toggleRightSidebar,
		setCommandPaletteOpen,
		editorContent,
		setEditorContent,
		originalContent,
		setOriginalContent,
		setHasUnsavedChanges,
	} = useJobEditorStore();

	// Local state for save feedback
	const [showSaveSuccess, setShowSaveSuccess] = useState(false);
	const [isUnsavedChangesDialogOpen, setIsUnsavedChangesDialogOpen] =
		useState(false);

	// Initialize editor content on mount
	useEffect(() => {
		if (job && !editorContent) {
			const initialContent = {
				...job,
				// Normalize field names for consistency
				title: job.title || "",
				description: job.description || "",
				status: job.status || "quoted",
				priority: job.priority || "medium",
				job_type: job.job_type || job.jobType || "",
				notes: job.notes || "",
				scheduled_start: job.scheduled_start || job.scheduledStart || null,
				scheduled_end: job.scheduled_end || job.scheduledEnd || null,
				assigned_to: job.assigned_to || job.assignedTo || null,
				customer_id: job.customer_id || job.customerId || null,
				property_id: job.property_id || job.propertyId || null,
			};
			setEditorContent(initialContent);
			setOriginalContent(initialContent);
		}
	}, [job, editorContent, setEditorContent, setOriginalContent]);

	// ============================================================================
	// Keyboard Shortcuts
	// ============================================================================

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Cmd+E or Ctrl+E: Toggle edit mode
			if ((e.metaKey || e.ctrlKey) && e.key === "e") {
				e.preventDefault();
				toggleEditMode();
			}

			// Cmd+S or Ctrl+S: Save (if in edit mode)
			if ((e.metaKey || e.ctrlKey) && e.key === "s" && isEditMode) {
				e.preventDefault();
				handleSave();
			}

			// Escape: Cancel edit mode (if unsaved changes, show confirmation)
			if (e.key === "Escape" && isEditMode) {
				if (hasUnsavedChanges) {
					e.preventDefault();
					setIsUnsavedChangesDialogOpen(true);
				} else {
					toggleEditMode();
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isEditMode, hasUnsavedChanges, toggleEditMode, handleSave]);

	// ============================================================================
	// Save Handler
	// ============================================================================

	const handleSave = useCallback(async () => {
		if (!hasUnsavedChanges || !editorContent) {
			return;
		}

		setSaveStatus("saving");

		try {
			// Extract only changed fields from editorContent
			const changes: any = {};

			// Compare editorContent with originalContent to find what changed
			if (editorContent.title !== originalContent?.title) {
				changes.title = editorContent.title;
			}
			if (editorContent.description !== originalContent?.description) {
				changes.description = editorContent.description;
			}
			if (editorContent.status !== originalContent?.status) {
				changes.status = editorContent.status;
			}
			if (editorContent.priority !== originalContent?.priority) {
				changes.priority = editorContent.priority;
			}
			if (editorContent.job_type !== originalContent?.job_type) {
				changes.jobType = editorContent.job_type;
			}
			if (editorContent.notes !== originalContent?.notes) {
				changes.notes = editorContent.notes;
			}
			if (editorContent.scheduled_start !== originalContent?.scheduled_start) {
				changes.scheduledStart = editorContent.scheduled_start;
			}
			if (editorContent.scheduled_end !== originalContent?.scheduled_end) {
				changes.scheduledEnd = editorContent.scheduled_end;
			}
			if (editorContent.assigned_to !== originalContent?.assigned_to) {
				changes.assignedTo = editorContent.assigned_to;
			}
			if (editorContent.customer_id !== originalContent?.customer_id) {
				changes.customerId = editorContent.customer_id;
			}
			if (editorContent.property_id !== originalContent?.property_id) {
				changes.propertyId = editorContent.property_id;
			}

			// Call Server Action with changes
			const result = await updateJobData(job.id, changes);

			if (result.success) {
				setSaveStatus("saved");
				setShowSaveSuccess(true);
				setHasUnsavedChanges(false);

				// Update originalContent to match saved content
				setOriginalContent(editorContent);

				// Refresh the page data
				router.refresh();

				// Reset status after 2 seconds
				setTimeout(() => {
					setSaveStatus("idle");
					setShowSaveSuccess(false);
				}, 2000);
			} else {
				setSaveStatus("error");
				setSaveError(result.error || "Failed to save changes");
				console.error("Save failed:", result.error);

				// Reset error after 3 seconds
				setTimeout(() => {
					setSaveStatus("idle");
					setSaveError(null);
				}, 3000);
			}
		} catch (error) {
			setSaveStatus("error");
			setSaveError(error instanceof Error ? error.message : "Unknown error");
			console.error("Save error:", error);

			// Reset error after 3 seconds
			setTimeout(() => {
				setSaveStatus("idle");
				setSaveError(null);
			}, 3000);
		}
	}, [
		hasUnsavedChanges,
		editorContent,
		originalContent,
		job.id,
		setSaveStatus,
		setHasUnsavedChanges,
		setOriginalContent,
		setSaveError,
		router,
	]);

	// ============================================================================
	// Tab Configuration
	// ============================================================================

	const tabs = [
		{
			id: "overview",
			label: "Overview",
			icon: Building2,
			count: undefined,
		},
		{
			id: "team-schedule",
			label: "Team & Schedule",
			icon: Users,
			count: teamAssignments.length,
		},
		{
			id: "financials",
			label: "Financials",
			icon: DollarSign,
			count: invoices.length + estimates.length,
		},
		{
			id: "materials",
			label: "Materials",
			icon: Package,
			count: materials.length,
		},
		{
			id: "photos-docs",
			label: "Photos & Docs",
			icon: Camera,
			count: photos.length + documents.length,
		},
		{
			id: "activity",
			label: "Activity",
			icon: Activity,
			count: activities.length,
		},
		{
			id: "equipment",
			label: "Equipment",
			icon: Wrench,
			count: equipment.length,
		},
	];

	// ============================================================================
	// Render
	// ============================================================================

	return (
		<div className="flex h-full w-full flex-col">
			{/* Top Bar - Edit Mode Toggle & Save */}
			<div className="bg-background flex items-center justify-between border-b px-4 py-2">
				<div className="flex items-center gap-2">
					<Button
						onClick={toggleEditMode}
						size="sm"
						variant={isEditMode ? "default" : "outline"}
					>
						<Edit3 className="mr-2 h-4 w-4" />
						{isEditMode ? "Editing" : "Edit Mode"}
					</Button>

					{hasUnsavedChanges && (
						<Badge className="ml-2" variant="secondary">
							Unsaved Changes
						</Badge>
					)}

					{saveStatus === "saving" && (
						<span className="text-muted-foreground text-sm">Saving...</span>
					)}

					{showSaveSuccess && (
						<Badge className="bg-success" variant="default">
							Saved!
						</Badge>
					)}
				</div>

				<div className="flex items-center gap-2">
					{isEditMode && hasUnsavedChanges && (
						<>
							<Button
								onClick={() => toggleEditMode()}
								size="sm"
								variant="outline"
							>
								<X className="mr-2 h-4 w-4" />
								Cancel
							</Button>
							<Button onClick={handleSave} size="sm">
								<Save className="mr-2 h-4 w-4" />
								Save Changes
							</Button>
						</>
					)}

					{/* Command Palette Trigger */}
					<Button
						className="text-muted-foreground"
						onClick={() => setCommandPaletteOpen(true)}
						size="sm"
						variant="ghost"
					>
						<span className="text-xs">Press</span>
						<kbd className="bg-muted text-muted-foreground pointer-events-none mx-1 inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
							<span className="text-xs">⌘</span>K
						</kbd>
						<span className="text-xs">for commands</span>
					</Button>

					{/* Right Sidebar Toggle */}
					<Button onClick={toggleRightSidebar} size="sm" variant="outline">
						Quick Actions
						<ChevronRight className="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Main Content - Tabs */}
			<Tabs
				className="flex h-full w-full flex-col"
				onValueChange={(value) => setActiveTab(value as any)}
				value={activeTab}
			>
				{/* Tab Navigation */}
				<TabsList className="bg-background w-full justify-start rounded-none border-b px-4">
					{tabs.map((tab) => (
						<TabsTrigger className="relative" key={tab.id} value={tab.id}>
							<tab.icon className="mr-2 h-4 w-4" />
							{tab.label}
							{tab.count !== undefined && tab.count > 0 && (
								<Badge
									className="ml-2 h-5 min-w-5 px-1.5 text-xs"
									variant="secondary"
								>
									{tab.count}
								</Badge>
							)}
						</TabsTrigger>
					))}
				</TabsList>

				{/* Tab Content */}
				<div className="flex-1 overflow-auto">
					<TabsContent className="m-0 h-full p-6" value="overview">
						<OverviewTab
							availableTeamMembers={availableTeamMembers}
							customer={customer}
							customers={customers}
							isEditMode={isEditMode}
							job={job}
							properties={properties}
							teamAssignments={teamAssignments}
							property={property}
							propertyEnrichment={propertyEnrichment}
						/>
					</TabsContent>

					<TabsContent className="m-0 h-full p-6" value="team-schedule">
						<TeamScheduleTab
							assignedUser={assignedUser}
							isEditMode={isEditMode}
							job={job}
							teamAssignments={teamAssignments}
							timeEntries={timeEntries}
						/>
					</TabsContent>

					<TabsContent className="m-0 h-full p-6" value="financials">
						<FinancialsTab
							estimates={estimates}
							invoices={invoices}
							isEditMode={isEditMode}
							job={job}
							metrics={metrics}
						/>
					</TabsContent>

					<TabsContent className="m-0 h-full p-6" value="materials">
						<MaterialsTab
							isEditMode={isEditMode}
							job={job}
							materials={materials}
						/>
					</TabsContent>

					<TabsContent className="m-0 h-full p-6" value="photos-docs">
						<PhotosDocsTab
							customerSignature={customerSignature}
							documents={documents}
							isEditMode={isEditMode}
							job={job}
							photos={photos}
							photosByCategory={photosByCategory}
							signatures={signatures}
							technicianSignature={technicianSignature}
						/>
					</TabsContent>

					<TabsContent className="m-0 h-full p-6" value="activity">
						<ActivityTab
							activities={activities}
							communications={communications}
							customer={customer}
							job={job}
						/>
					</TabsContent>

					<TabsContent className="m-0 h-full p-6" value="equipment">
						<EquipmentTab
							equipment={equipment}
							isEditMode={isEditMode}
							job={job}
							property={property}
						/>
					</TabsContent>
				</div>
			</Tabs>

			{/* Right Sidebar (Sheet) */}
			<Sheet onOpenChange={toggleRightSidebar} open={isRightSidebarOpen}>
				<SheetContent className="w-[400px] sm:w-[540px]" side="right">
					<div className="flex h-full flex-col">
						<h2 className="text-lg font-semibold">Quick Actions</h2>
						<div className="mt-4 space-y-4">
							{/* TODO: Add quick action buttons */}
							<Button className="w-full" variant="outline">
								Call Customer
							</Button>
							<Button className="w-full" variant="outline">
								Email Customer
							</Button>
							<Button className="w-full" variant="outline">
								Navigate to Property
							</Button>
							<Button className="w-full" variant="outline">
								Create Invoice
							</Button>
							<Button className="w-full" variant="outline">
								Schedule Follow-up
							</Button>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			{/* Command Palette (Cmd+K) */}
			<JobCommandPalette customer={customer} jobId={job.id} />

			{/* Unsaved Changes Confirmation Dialog */}
			<AlertDialog
				onOpenChange={setIsUnsavedChangesDialogOpen}
				open={isUnsavedChangesDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
						<AlertDialogDescription>
							You have unsaved changes. Are you sure you want to cancel? All
							unsaved changes will be lost.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Continue Editing</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								toggleEditMode();
								setIsUnsavedChangesDialogOpen(false);
							}}
						>
							Discard Changes
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
