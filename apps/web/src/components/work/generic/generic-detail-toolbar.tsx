"use client";

/**
 * GenericDetailToolbar - Universal Detail Page Toolbar
 *
 * Configuration-driven toolbar for detail pages that replaces 15+ individual
 * toolbar-actions components. Uses TypeScript generics and configuration objects.
 *
 * Features:
 * - Status update dropdown (via StatusUpdateDropdown)
 * - Configurable action buttons (Preview, Download, Send, etc.)
 * - Consistent archive button with dialog
 * - "More" dropdown for secondary actions
 * - Import/Export dropdown
 *
 * @example
 * ```tsx
 * import { GenericDetailToolbar } from "@/components/work/generic/generic-detail-toolbar";
 * import { contractToolbarConfig } from "@/components/work/generic/configs/contracts-toolbar";
 *
 * export function ContractToolbar({ contract }: { contract: Contract }) {
 *   return <GenericDetailToolbar config={contractToolbarConfig} entity={contract} />;
 * }
 * ```
 */

import { Archive } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ImportExportDropdownLazy as ImportExportDropdown } from "@/components/data/import-export-dropdown-lazy";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { StatusUpdateDropdown } from "@/components/work/shared/quick-actions/status-update-dropdown";
import type { GenericDetailToolbarConfig, ToolbarActionConfig } from "./types";

// =============================================================================
// COMPONENT PROPS
// =============================================================================

interface GenericDetailToolbarProps<T extends { id: string; status?: string }> {
	/** Toolbar configuration */
	config: GenericDetailToolbarConfig<T>;
	/** Entity data */
	entity: T;
	/** Custom status change handler (optional - uses default if not provided) */
	onStatusChange?: (
		entityId: string,
		newStatus: string
	) => Promise<{ success: boolean; error?: string }>;
}

// =============================================================================
// ACTION BUTTON COMPONENT
// =============================================================================

function ActionButton<T>({
	action,
	entity,
}: {
	action: ToolbarActionConfig<T>;
	entity: T;
}) {
	const [isLoading, setIsLoading] = useState(false);

	// Check visibility condition
	if (action.showWhen && !action.showWhen(entity)) {
		return null;
	}

	const handleClick = async () => {
		if (action.type !== "button" || !action.onClick) return;

		setIsLoading(true);
		try {
			await action.onClick(entity);
		} catch (error) {
			console.error(`Action ${action.id} failed:`, error);
			toast.error(`Failed to ${action.label.toLowerCase()}`);
		} finally {
			setIsLoading(false);
		}
	};

	const Icon = action.icon;
	const buttonContent = (
		<>
			<Icon className="size-3.5" />
			<span className={action.showLabelOnMobile ? "" : "hidden md:inline"}>
				{action.label}
			</span>
		</>
	);

	const buttonElement =
		action.type === "link" ? (
			<Button
				asChild
				className="h-8 gap-1.5"
				disabled={isLoading}
				size="sm"
				variant={action.variant || "outline"}
			>
				<Link
					href={
						typeof action.href === "function"
							? action.href(entity)
							: action.href || "#"
					}
				>
					{buttonContent}
				</Link>
			</Button>
		) : action.type === "dialog" && action.DialogComponent ? (
			<action.DialogComponent
				entity={entity}
				trigger={
					<Button
						className="h-8 gap-1.5"
						disabled={isLoading}
						size="sm"
						variant={action.variant || "outline"}
					>
						{buttonContent}
					</Button>
				}
			/>
		) : (
			<Button
				className="h-8 gap-1.5"
				disabled={isLoading}
				onClick={handleClick}
				size="sm"
				variant={action.variant || "outline"}
			>
				{isLoading ? (
					<>
						<div className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
						<span className="hidden md:inline">Loading...</span>
					</>
				) : (
					buttonContent
				)}
			</Button>
		);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
				<TooltipContent>
					<p>{action.tooltip || action.label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function GenericDetailToolbar<T extends { id: string; status?: string }>({
	config,
	entity,
	onStatusChange,
}: GenericDetailToolbarProps<T>) {
	const {
		entityType,
		showStatusDropdown = true,
		primaryActions,
		moreActions,
		archive,
		showImportExport = false,
		importExportDataType,
	} = config;

	const router = useRouter();
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);

	// ---------------------------------------------------------------------------
	// Archive Handler
	// ---------------------------------------------------------------------------

	const handleArchive = async () => {
		setIsArchiving(true);
		try {
			const result = await archive.action(entity.id);
			if (result.success) {
				toast.success("Archived successfully");
				setIsArchiveDialogOpen(false);
				router.push(archive.redirectUrl);
			} else {
				toast.error(result.error || "Failed to archive");
			}
		} catch (error) {
			console.error("Archive failed:", error);
			toast.error("Failed to archive");
		} finally {
			setIsArchiving(false);
		}
	};

	// ---------------------------------------------------------------------------
	// Default Status Change Handler
	// ---------------------------------------------------------------------------

	const defaultStatusChangeHandler = async (
		entityId: string,
		newStatus: string
	): Promise<{ success: boolean; error?: string }> => {
		// This should be provided by the consumer or configured per entity
		console.warn("Status change handler not provided");
		return { success: false, error: "Status change not implemented" };
	};

	// ---------------------------------------------------------------------------
	// Filter Visible Actions
	// ---------------------------------------------------------------------------

	const visiblePrimaryActions = primaryActions.filter(
		(action) => !action.showWhen || action.showWhen(entity)
	);

	const visibleMoreActions = moreActions?.filter(
		(action) => !action.showWhen || action.showWhen(entity)
	);

	// ---------------------------------------------------------------------------
	// Render
	// ---------------------------------------------------------------------------

	return (
		<>
			<div className="flex items-center gap-1.5">
				{/* Status Update Dropdown - First Position */}
				{showStatusDropdown && entity.status && (
					<StatusUpdateDropdown
						currentStatus={entity.status}
						entityId={entity.id}
						entityType={entityType}
						onStatusChange={onStatusChange || defaultStatusChangeHandler}
						size="sm"
					/>
				)}

				{/* Primary Action Buttons */}
				{visiblePrimaryActions.map((action) => (
					<ActionButton key={action.id} action={action} entity={entity} />
				))}

				{/* More Actions Dropdown */}
				{visibleMoreActions && visibleMoreActions.length > 0 && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className="h-8" size="sm" variant="outline">
								More
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{visibleMoreActions.map((action, index) => {
								const Icon = action.icon;

								if (action.type === "link") {
									return (
										<DropdownMenuItem asChild key={action.id}>
											<Link
												href={
													typeof action.href === "function"
														? action.href(entity)
														: action.href || "#"
												}
											>
												<Icon className="mr-2 size-4" />
												{action.label}
											</Link>
										</DropdownMenuItem>
									);
								}

								return (
									<DropdownMenuItem
										key={action.id}
										onClick={() => action.onClick?.(entity)}
									>
										<Icon className="mr-2 size-4" />
										{action.label}
									</DropdownMenuItem>
								);
							})}
						</DropdownMenuContent>
					</DropdownMenu>
				)}

				{/* Import/Export Dropdown */}
				{showImportExport && importExportDataType && (
					<>
						<Separator className="h-6" orientation="vertical" />
						<ImportExportDropdown dataType={importExportDataType} />
					</>
				)}

				{/* Archive Button */}
				<Separator className="h-6" orientation="vertical" />
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="border-destructive/40 text-destructive hover:bg-destructive/10 h-8 gap-1.5"
								onClick={() => setIsArchiveDialogOpen(true)}
								size="sm"
								variant="outline"
							>
								<Archive className="size-3.5" />
								<span className="hidden lg:inline">Archive</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Archive</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			{/* Archive Confirmation Dialog */}
			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive?</DialogTitle>
						<DialogDescription>
							Are you sure you want to archive this? Archived items can be
							restored within 90 days.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							disabled={isArchiving}
							onClick={() => setIsArchiveDialogOpen(false)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isArchiving}
							onClick={handleArchive}
							variant="destructive"
						>
							{isArchiving ? "Archiving..." : "Archive"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
