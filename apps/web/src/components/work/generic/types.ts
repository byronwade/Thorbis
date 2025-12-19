/**
 * Generic Work Components - Type Definitions
 *
 * Shared TypeScript interfaces for GenericWorkTable, GenericDetailToolbar,
 * and GenericPageContent components.
 *
 * Design principles:
 * - Configuration-driven: Entity-specific behavior via config objects
 * - Type-safe: Compile-time validation of configurations
 * - Extensible: Escape hatches for custom rendering when needed
 * - Consistent: Standardized patterns across all work entities
 */

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { RowAction } from "@stratos/ui";
import type { BulkAction, ColumnDef } from "@/components/ui/full-width-datatable";
import type { ArchivableEntity } from "@/lib/stores/archive-store";

// =============================================================================
// COMMON TYPES
// =============================================================================

/**
 * All work entity types supported by generic components
 */
export type WorkEntityType =
	| "jobs"
	| "invoices"
	| "estimates"
	| "contracts"
	| "payments"
	| "equipment"
	| "appointments"
	| "purchase-orders"
	| "service-agreements"
	| "maintenance-plans"
	| "materials"
	| "teams"
	| "price-book"
	| "vendors"
	| "properties"
	| "customers";

/**
 * Base entity interface - all work entities must have these fields
 */
export interface BaseWorkEntity {
	id: string;
	archived_at?: string | null;
	deleted_at?: string | null;
}

/**
 * Standard action result from server actions
 */
export interface ActionResult {
	success: boolean;
	error?: string;
}

/**
 * Entity label configuration for singular/plural forms
 */
export interface EntityLabel {
	singular: string;
	plural: string;
}

// =============================================================================
// GENERIC WORK TABLE TYPES
// =============================================================================

/**
 * Row action handlers passed to the rowActions function
 */
export interface RowActionHandlers {
	openArchiveDialog: (id: string) => void;
	openRestoreDialog: (id: string) => void;
	refresh: () => void;
}

/**
 * Empty state configuration
 */
export interface EmptyStateConfig {
	icon: LucideIcon;
	message: string;
	actionLabel: string;
	actionHref: string;
}

/**
 * Navigation configuration
 */
export interface NavigationConfig<T extends BaseWorkEntity> {
	getDetailUrl: (item: T) => string;
	getEditUrl?: (item: T) => string;
	createUrl: string;
}

/**
 * Search configuration
 */
export interface SearchConfig<T extends BaseWorkEntity> {
	placeholder: string;
	/** Fields to search - used for client-side filtering */
	filter: (item: T, query: string) => boolean;
}

/**
 * Archive configuration
 */
export interface ArchiveConfig {
	/** Key in archive-store.ts for filter persistence */
	storeKey: ArchivableEntity;
	/** Single item archive action */
	action: (id: string) => Promise<ActionResult>;
	/** Bulk archive action (optional - falls back to looping single action) */
	bulkAction?: (ids: string[]) => Promise<ActionResult>;
	/** Restore action */
	restoreAction?: (id: string) => Promise<ActionResult>;
}

/**
 * Row highlight configuration
 */
export interface HighlightConfig<T extends BaseWorkEntity> {
	/** Condition to determine if row should be highlighted */
	condition: (item: T) => boolean;
	/** CSS class to apply for highlighting */
	className: string;
}

/**
 * Bulk action configuration (extends base with entity-specific handler)
 */
export interface GenericBulkActionConfig<T extends BaseWorkEntity> {
	label: string;
	icon: LucideIcon;
	variant?: "default" | "destructive" | "outline" | "ghost";
	/** Handler receives selected items and IDs */
	onClick: (selectedIds: Set<string>, items: T[]) => void | Promise<void>;
	/** Show sync progress for long operations */
	showProgress?: boolean;
}

/**
 * Complete configuration for GenericWorkTable
 */
export interface GenericWorkTableConfig<T extends BaseWorkEntity> {
	/** Entity type identifier */
	entityType: WorkEntityType;
	/** Singular and plural labels */
	entityLabel: EntityLabel;
	/** Column definitions */
	columns: ColumnDef<T>[];
	/** Row actions builder function */
	rowActions: (item: T, handlers: RowActionHandlers) => RowAction[];
	/** Bulk actions configuration */
	bulkActions: GenericBulkActionConfig<T>[];
	/** Archive/restore configuration */
	archive: ArchiveConfig;
	/** Empty state configuration */
	emptyState: EmptyStateConfig;
	/** Navigation URLs */
	navigation: NavigationConfig<T>;
	/** Search configuration */
	search: SearchConfig<T>;
	/** Row highlighting (optional) */
	highlight?: HighlightConfig<T>;
	/** Enable server-side pagination */
	serverPagination?: boolean;
	/** Items per page (default: 50) */
	itemsPerPage?: number;
}

// =============================================================================
// GENERIC DETAIL TOOLBAR TYPES
// =============================================================================

/**
 * Status entity type (from status-update-dropdown.tsx)
 */
export type StatusEntityType =
	| "job"
	| "invoice"
	| "estimate"
	| "contract"
	| "payment"
	| "appointment"
	| "purchase_order"
	| "service_agreement"
	| "maintenance_plan"
	| "equipment"
	| "material";

/**
 * Button variant types
 */
export type ButtonVariant =
	| "default"
	| "destructive"
	| "outline"
	| "secondary"
	| "ghost"
	| "link";

/**
 * Toolbar action configuration
 */
export interface ToolbarActionConfig<T> {
	/** Unique identifier for the action */
	id: string;
	/** Display label */
	label: string;
	/** Icon from lucide-react */
	icon: LucideIcon;
	/** Action type */
	type: "button" | "link" | "dialog";
	/** For link type: URL or function returning URL */
	href?: string | ((entity: T) => string);
	/** For button type: click handler */
	onClick?: (entity: T) => void | Promise<void>;
	/** For dialog type: dialog component to render */
	DialogComponent?: React.ComponentType<{
		entity: T;
		trigger: ReactNode;
		onSuccess?: () => void;
	}>;
	/** Button variant */
	variant?: ButtonVariant;
	/** Condition to show/hide action */
	showWhen?: (entity: T) => boolean;
	/** Show label on mobile (default: false for icon-only) */
	showLabelOnMobile?: boolean;
	/** Tooltip text (defaults to label) */
	tooltip?: string;
}

/**
 * Complete configuration for GenericDetailToolbar
 */
export interface GenericDetailToolbarConfig<T extends { id: string; status?: string }> {
	/** Entity type for status dropdown */
	entityType: StatusEntityType;
	/** Show status dropdown (default: true) */
	showStatusDropdown?: boolean;
	/** Primary action buttons (always visible) */
	primaryActions: ToolbarActionConfig<T>[];
	/** Secondary actions (in "More" dropdown) */
	moreActions?: ToolbarActionConfig<T>[];
	/** Archive configuration */
	archive: {
		action: (id: string) => Promise<ActionResult>;
		redirectUrl: string;
	};
	/** Show import/export dropdown */
	showImportExport?: boolean;
	/** Data type for import/export (e.g., "invoices") */
	importExportDataType?: string;
}

// =============================================================================
// GENERIC PAGE CONTENT TYPES
// =============================================================================

/**
 * Badge configuration for header
 */
export interface HeaderBadge {
	label: string;
	variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
	icon?: LucideIcon;
}

/**
 * Quick info item (displayed in grid at top of detail page)
 */
export interface QuickInfoItem {
	label: string;
	value: string | number | ReactNode;
	icon?: LucideIcon;
	href?: string;
}

/**
 * Related item for sidebar
 */
export interface RelatedItem {
	id: string;
	label: string;
	href: string;
	icon?: LucideIcon;
	badge?: string;
}

/**
 * Workflow stage for timeline
 */
export interface WorkflowStage {
	id: string;
	label: string;
	status: "completed" | "current" | "pending" | "skipped";
	date?: string;
	description?: string;
}

/**
 * Accordion section configuration
 */
export interface SectionConfig {
	id: string;
	title: string;
	icon?: LucideIcon;
	defaultOpen?: boolean;
	render: () => ReactNode;
}

/**
 * Header configuration for detail page
 */
export interface DetailHeaderConfig {
	title: string;
	subtitle?: string;
	description?: string;
	badges?: HeaderBadge[];
	breadcrumbs?: Array<{ label: string; href?: string }>;
}

/**
 * Workflow timeline configuration
 */
export interface WorkflowTimelineConfig<T, R = unknown> {
	show: (entity: T, related: R) => boolean;
	buildStages: (entity: T, related: R) => WorkflowStage[];
}

/**
 * Complete configuration for GenericPageContent
 */
export interface GenericPageContentConfig<T, R = unknown> {
	/** Entity type identifier */
	entityType: string;
	/** Build header from entity data */
	buildHeader: (entity: T, related: R) => DetailHeaderConfig;
	/** Build quick info items */
	buildQuickInfo: (entity: T, related: R) => QuickInfoItem[];
	/** Build custom sections */
	buildSections: (entity: T, related: R) => SectionConfig[];
	/** Build related items for sidebar (optional) */
	buildRelatedItems?: (entity: T, related: R) => RelatedItem[];
	/** Workflow timeline configuration (optional) */
	workflowTimeline?: WorkflowTimelineConfig<T, R>;
	/** Storage key for section ordering */
	storageKey: string;
	/** Show standard sections (activities, notes, attachments) */
	showStandardSections?: boolean;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Extract entity type from config
 */
export type ExtractEntity<C> = C extends GenericWorkTableConfig<infer T> ? T : never;

/**
 * Make certain fields required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Partial config for overrides
 */
export type PartialConfig<T> = {
	[P in keyof T]?: T[P] extends object ? Partial<T[P]> : T[P];
};
