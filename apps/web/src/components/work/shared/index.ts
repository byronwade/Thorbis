/**
 * Shared Work Components
 *
 * Reusable components for consistent UX across all work detail pages.
 */

// Related Entity Card - Prominent clickable cards for entity navigation
export {
	RelatedEntityCard,
	RelatedEntityCardGrid,
	RelatedEntityCardSkeleton,
	type EntityType,
	type RelatedEntityCardProps,
	type StatusConfig,
} from "./related-entity-card";

// Entity Quick Links - Inline and dropdown navigation helpers
export {
	EntityQuickLink,
	EntityQuickLinksBar,
	EntityQuickLinksDropdown,
	EntityNavigationBreadcrumb,
	buildQuickLinkGroups,
	type QuickLinkItem,
	type QuickLinkGroup,
} from "./entity-quick-links";
