"use client";

/**
 * GenericWorkTable - Universal Table Component for Work Entities
 *
 * Configuration-driven table that replaces 20+ individual table components.
 * Uses TypeScript generics and configuration objects for entity-specific behavior.
 *
 * Features:
 * - Wraps FullWidthDataTable with standardized patterns
 * - Consistent archive dialogs via useArchiveDialog
 * - Standardized row actions via RowActionsDropdown
 * - Archive filtering via useArchiveStore
 *
 * @example
 * ```tsx
 * import { GenericWorkTable } from "@/components/work/generic/generic-work-table";
 * import { paymentsTableConfig } from "@/components/work/generic/configs/payments";
 *
 * export function PaymentsTable({ payments }: { payments: Payment[] }) {
 *   return <GenericWorkTable config={paymentsTableConfig} data={payments} />;
 * }
 * ```
 */

import { useArchiveDialog, RowActionsDropdown } from "@stratos/ui";
import { Archive, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import {
	type BulkAction,
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { useArchiveStore } from "@/lib/stores/archive-store";
import type {
	BaseWorkEntity,
	GenericWorkTableConfig,
	RowActionHandlers,
} from "./types";

// =============================================================================
// COMPONENT PROPS
// =============================================================================

interface GenericWorkTableProps<T extends BaseWorkEntity> {
	/** Table configuration */
	config: GenericWorkTableConfig<T>;
	/** Data array */
	data: T[];
	/** Total count for server pagination */
	totalCount?: number;
	/** Current page for server pagination */
	currentPage?: number;
	/** Items per page override */
	itemsPerPage?: number;
	/** Custom row click handler */
	onRowClick?: (item: T) => void;
	/** Show refresh button */
	showRefresh?: boolean;
	/** Additional toolbar actions */
	toolbarActions?: React.ReactNode;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function GenericWorkTable<T extends BaseWorkEntity>({
	config,
	data,
	totalCount,
	currentPage = 1,
	itemsPerPage,
	onRowClick,
	showRefresh = false,
	toolbarActions,
}: GenericWorkTableProps<T>) {
	const {
		entityType,
		entityLabel,
		columns: baseColumns,
		rowActions: buildRowActions,
		bulkActions: bulkActionConfigs,
		archive,
		emptyState,
		navigation,
		search,
		highlight,
		serverPagination = false,
	} = config;

	// ---------------------------------------------------------------------------
	// State
	// ---------------------------------------------------------------------------

	// Archive filter from global store
	const archiveFilter = useArchiveStore((state) => state.filters[archive.storeKey]);

	// Bulk archive dialog state
	const [isBulkArchiveOpen, setIsBulkArchiveOpen] = useState(false);
	const [bulkArchiveIds, setBulkArchiveIds] = useState<Set<string>>(new Set());
	const [isBulkArchiving, setIsBulkArchiving] = useState(false);

	// ---------------------------------------------------------------------------
	// Single Item Archive Dialog (using shared hook)
	// ---------------------------------------------------------------------------

	const { openArchiveDialog, ArchiveDialogComponent } = useArchiveDialog({
		onConfirm: async (id) => {
			const result = await archive.action(id);
			if (result.success) {
				toast.success(`${entityLabel.singular} archived successfully`);
				handleRefresh();
			} else {
				toast.error(result.error || `Failed to archive ${entityLabel.singular.toLowerCase()}`);
			}
		},
		title: `Archive ${entityLabel.singular}?`,
		description: `This ${entityLabel.singular.toLowerCase()} will be archived and can be restored within 90 days.`,
	});

	// ---------------------------------------------------------------------------
	// Restore Dialog (using shared hook)
	// ---------------------------------------------------------------------------

	const { openArchiveDialog: openRestoreDialog, ArchiveDialogComponent: RestoreDialogComponent } =
		useArchiveDialog({
			onConfirm: async (id) => {
				if (archive.restoreAction) {
					const result = await archive.restoreAction(id);
					if (result.success) {
						toast.success(`${entityLabel.singular} restored successfully`);
						handleRefresh();
					} else {
						toast.error(result.error || `Failed to restore ${entityLabel.singular.toLowerCase()}`);
					}
				}
			},
			title: `Restore ${entityLabel.singular}?`,
			description: `This ${entityLabel.singular.toLowerCase()} will be restored and become active again.`,
			isRestore: true,
		});

	// ---------------------------------------------------------------------------
	// Handlers
	// ---------------------------------------------------------------------------

	const handleRefresh = useCallback(() => {
		window.location.reload();
	}, []);

	const handleRowClick = useCallback(
		(item: T) => {
			if (onRowClick) {
				onRowClick(item);
			} else {
				window.location.href = navigation.getDetailUrl(item);
			}
		},
		[onRowClick, navigation]
	);

	// Row action handlers passed to config
	const rowActionHandlers: RowActionHandlers = useMemo(
		() => ({
			openArchiveDialog,
			openRestoreDialog,
			refresh: handleRefresh,
		}),
		[openArchiveDialog, openRestoreDialog, handleRefresh]
	);

	// ---------------------------------------------------------------------------
	// Bulk Archive Handler
	// ---------------------------------------------------------------------------

	const handleBulkArchive = useCallback(
		async (selectedIds: Set<string>) => {
			setBulkArchiveIds(selectedIds);
			setIsBulkArchiveOpen(true);
		},
		[]
	);

	const confirmBulkArchive = useCallback(async () => {
		setIsBulkArchiving(true);

		const count = bulkArchiveIds.size;
		let successCount = 0;
		let errorCount = 0;

		// Use bulk action if available, otherwise loop
		if (archive.bulkAction) {
			const result = await archive.bulkAction(Array.from(bulkArchiveIds));
			if (result.success) {
				successCount = count;
			} else {
				errorCount = count;
			}
		} else {
			for (const id of bulkArchiveIds) {
				const result = await archive.action(id);
				if (result.success) {
					successCount++;
				} else {
					errorCount++;
				}
			}
		}

		if (successCount > 0) {
			toast.success(
				`Archived ${successCount} ${successCount === 1 ? entityLabel.singular.toLowerCase() : entityLabel.plural.toLowerCase()}`
			);
		}
		if (errorCount > 0) {
			toast.error(
				`Failed to archive ${errorCount} ${errorCount === 1 ? entityLabel.singular.toLowerCase() : entityLabel.plural.toLowerCase()}`
			);
		}

		setIsBulkArchiving(false);
		setIsBulkArchiveOpen(false);
		setBulkArchiveIds(new Set());
		handleRefresh();
	}, [
		bulkArchiveIds,
		archive,
		entityLabel,
		handleRefresh,
	]);

	// ---------------------------------------------------------------------------
	// Filter Data
	// ---------------------------------------------------------------------------

	const filteredData = useMemo(() => {
		return data.filter((item) => {
			const isArchived = Boolean(item.archived_at || item.deleted_at);
			if (archiveFilter === "active") return !isArchived;
			if (archiveFilter === "archived") return isArchived;
			return true; // "all"
		});
	}, [data, archiveFilter]);

	// ---------------------------------------------------------------------------
	// Build Columns with Actions
	// ---------------------------------------------------------------------------

	const columns: ColumnDef<T>[] = useMemo(() => {
		// Add actions column
		const actionsColumn: ColumnDef<T> = {
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (item) => {
				const actions = buildRowActions(item, rowActionHandlers);
				return <RowActionsDropdown actions={actions} />;
			},
		};

		return [...baseColumns, actionsColumn];
	}, [baseColumns, buildRowActions, rowActionHandlers]);

	// ---------------------------------------------------------------------------
	// Build Bulk Actions
	// ---------------------------------------------------------------------------

	const bulkActions: BulkAction[] = useMemo(() => {
		const actions: BulkAction[] = bulkActionConfigs.map((actionConfig) => ({
			label: actionConfig.label,
			icon: <actionConfig.icon className="h-4 w-4" />,
			variant: actionConfig.variant,
			onClick: async (selectedIds) => {
				const selectedItems = data.filter((item) => selectedIds.has(item.id));
				await actionConfig.onClick(selectedIds, selectedItems);
			},
		}));

		// Always add archive as last bulk action
		actions.push({
			label: "Archive",
			icon: <Archive className="h-4 w-4" />,
			variant: "destructive",
			onClick: handleBulkArchive,
		});

		return actions;
	}, [bulkActionConfigs, data, handleBulkArchive]);

	// ---------------------------------------------------------------------------
	// Render
	// ---------------------------------------------------------------------------

	return (
		<>
			<FullWidthDataTable
				bulkActions={bulkActions}
				columns={columns}
				currentPageFromServer={currentPage}
				data={filteredData}
				emptyAction={
					<Button asChild size="sm">
						<Link href={navigation.createUrl}>
							<Plus className="mr-2 size-4" />
							{emptyState.actionLabel}
						</Link>
					</Button>
				}
				emptyIcon={<emptyState.icon className="text-muted-foreground h-8 w-8" />}
				emptyMessage={emptyState.message}
				enableSelection
				entity={entityType}
				getHighlightClass={highlight ? (item) => (highlight.condition(item) ? highlight.className : "") : undefined}
				getItemId={(item) => item.id}
				isArchived={(item) => Boolean(item.archived_at || item.deleted_at)}
				isHighlighted={highlight ? highlight.condition : undefined}
				itemsPerPage={itemsPerPage ?? config.itemsPerPage ?? 50}
				onRefresh={handleRefresh}
				onRowClick={handleRowClick}
				searchFilter={search.filter}
				searchPlaceholder={search.placeholder}
				serverPagination={serverPagination}
				showArchived={archiveFilter !== "active"}
				showRefresh={showRefresh}
				toolbarActions={toolbarActions}
				totalCount={totalCount ?? filteredData.length}
			/>

			{/* Single Archive Dialog */}
			<ArchiveDialogComponent />

			{/* Restore Dialog */}
			<RestoreDialogComponent />

			{/* Bulk Archive Dialog */}
			<AlertDialog open={isBulkArchiveOpen} onOpenChange={setIsBulkArchiveOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Archive {bulkArchiveIds.size} {bulkArchiveIds.size === 1 ? entityLabel.singular : entityLabel.plural}?
						</AlertDialogTitle>
						<AlertDialogDescription>
							{bulkArchiveIds.size === 1
								? `This ${entityLabel.singular.toLowerCase()} will be archived and can be restored within 90 days.`
								: `These ${entityLabel.plural.toLowerCase()} will be archived and can be restored within 90 days.`}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isBulkArchiving}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							disabled={isBulkArchiving}
							onClick={confirmBulkArchive}
						>
							{isBulkArchiving ? "Archiving..." : "Archive"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
