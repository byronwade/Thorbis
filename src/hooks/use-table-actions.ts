"use client";

/**
 * Table Actions Hook
 * Consolidated utilities for common table operations
 *
 * Provides:
 * - Bulk selection management
 * - Archive/restore handlers
 * - Row click navigation
 * - Search filtering
 * - Refresh actions
 *
 * Usage:
 * ```tsx
 * const {
 *   handleRowClick,
 *   handleArchive,
 *   handleBulkArchive,
 *   createSearchFilter
 * } = useTableActions({ entityType: "jobs" });
 * ```
 */

import { useRouter } from "next/navigation";
import { toast } from "sonner";

type EntityType =
	| "jobs"
	| "invoices"
	| "estimates"
	| "payments"
	| "contracts"
	| "appointments"
	| "equipment"
	| "maintenance-plans"
	| "service-agreements"
	| "purchase-orders"
	| "properties"
	| "customers";

type TableActionsOptions = {
	/** Entity type for routing and messages */
	entityType: EntityType;
	/** Base path for navigation (default: /dashboard/work/{entityType}) */
	basePath?: string;
};

export function useTableActions({ entityType, basePath }: TableActionsOptions) {
	const router = useRouter();

	// Get entity-specific labels
	const entityLabels = {
		jobs: "job",
		invoices: "invoice",
		estimates: "estimate",
		payments: "payment",
		contracts: "contract",
		appointments: "appointment",
		equipment: "equipment",
		"maintenance-plans": "maintenance plan",
		"service-agreements": "service agreement",
		"purchase-orders": "purchase order",
		properties: "property",
		customers: "customer",
	};

	const entityLabel = entityLabels[entityType] || entityType;
	const defaultPath = basePath || `/dashboard/work/${entityType}`;

	/**
	 * Handle row click navigation
	 */
	const handleRowClick = (itemId: string) => {
		router.push(`${defaultPath}/${itemId}`);
	};

	/**
	 * Handle single item archive
	 */
	const handleArchive = async (
		itemId: string,
		archiveAction: (id: string) => Promise<void>,
	): Promise<boolean> => {
		try {
			await archiveAction(itemId);
			toast.success(`${entityLabel} archived successfully`);
			router.refresh();
			return true;
		} catch (error) {
			console.error(`Failed to archive ${entityLabel}:`, error);
			toast.error(`Failed to archive ${entityLabel}`);
			return false;
		}
	};

	/**
	 * Handle bulk archive
	 */
	const handleBulkArchive = async (
		itemIds: string[],
		archiveAction: (ids: string[]) => Promise<void>,
	): Promise<boolean> => {
		try {
			await archiveAction(itemIds);
			toast.success(`${itemIds.length} ${entityLabel}s archived successfully`);
			router.refresh();
			return true;
		} catch (error) {
			console.error(`Failed to archive ${entityLabel}s:`, error);
			toast.error(`Failed to archive ${entityLabel}s`);
			return false;
		}
	};

	/**
	 * Handle single item restore
	 */
	const handleRestore = async (
		itemId: string,
		restoreAction: (id: string) => Promise<void>,
	): Promise<boolean> => {
		try {
			await restoreAction(itemId);
			toast.success(`${entityLabel} restored successfully`);
			router.refresh();
			return true;
		} catch (error) {
			console.error(`Failed to restore ${entityLabel}:`, error);
			toast.error(`Failed to restore ${entityLabel}`);
			return false;
		}
	};

	/**
	 * Handle refresh
	 */
	const handleRefresh = () => {
		router.refresh();
		toast.success("Refreshed");
	};

	/**
	 * Create search filter function
	 * Returns a function that filters items based on searchable fields
	 */
	const createSearchFilter = <T extends Record<string, any>>(
		searchableFields: (keyof T)[],
	) => {
		return (item: T, query: string): boolean => {
			const searchStr = query.toLowerCase().trim();
			if (!searchStr) return true;

			return searchableFields.some((field) => {
				const value = item[field];
				if (value == null) return false;
				return String(value).toLowerCase().includes(searchStr);
			});
		};
	};

	/**
	 * Create bulk action handlers
	 */
	const createBulkActions = (handlers: {
		archive?: (ids: string[]) => Promise<void>;
		export?: (ids: string[]) => Promise<void>;
		delete?: (ids: string[]) => Promise<void>;
	}) => {
		const bulkActions: Array<{
			label: string;
			onClick: (ids: string[]) => Promise<void>;
		}> = [];

		if (handlers.archive) {
			bulkActions.push({
				label: "Archive Selected",
				onClick: (ids) => handleBulkArchive(ids, handlers.archive!),
			});
		}

		if (handlers.export) {
			bulkActions.push({
				label: "Export Selected",
				onClick: async (ids) => {
					try {
						await handlers.export!(ids);
						toast.success(`Exported ${ids.length} ${entityLabel}s`);
					} catch (error) {
						toast.error("Failed to export");
					}
				},
			});
		}

		if (handlers.delete) {
			bulkActions.push({
				label: "Delete Selected",
				onClick: async (ids) => {
					try {
						await handlers.delete!(ids);
						toast.success(`Deleted ${ids.length} ${entityLabel}s`);
						router.refresh();
					} catch (error) {
						toast.error("Failed to delete");
					}
				},
			});
		}

		return bulkActions;
	};

	return {
		handleRowClick,
		handleArchive,
		handleBulkArchive,
		handleRestore,
		handleRefresh,
		createSearchFilter,
		createBulkActions,
		entityLabel,
	};
}
