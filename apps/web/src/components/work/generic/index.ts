/**
 * Generic Work Components - Public API
 *
 * Export all generic components and configurations for work pages.
 */

// Main components
export { GenericWorkTable } from "./generic-work-table";
export { GenericDetailToolbar } from "./generic-detail-toolbar";
export { GenericPageContent } from "./generic-page-content";

// Types
export type {
	// Common types
	ActionResult,
	BaseWorkEntity,
	EntityLabel,
	WorkEntityType,
	// Table types
	ArchiveConfig,
	EmptyStateConfig,
	GenericBulkActionConfig,
	GenericWorkTableConfig,
	HighlightConfig,
	NavigationConfig,
	RowActionHandlers,
	SearchConfig,
	// Toolbar types
	ButtonVariant,
	GenericDetailToolbarConfig,
	StatusEntityType,
	ToolbarActionConfig,
	// Page content types
	DetailHeaderConfig,
	GenericPageContentConfig,
	HeaderBadge,
	QuickInfoItem,
	RelatedItem,
	SectionConfig,
	WorkflowStage,
	WorkflowTimelineConfig,
} from "./types";

// Table configurations
export { paymentsTableConfig, type Payment } from "./configs/payments";
export { contractsTableConfig, type Contract } from "./configs/contracts";

// Toolbar configurations
export { contractsToolbarConfig, type ContractForToolbar } from "./configs/contracts-toolbar";
