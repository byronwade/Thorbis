/**
 * Entity Empty State Component
 *
 * Standardized empty state wrapper for consistent empty state patterns
 * across tables, lists, and data sections.
 *
 * Uses the existing Empty component from @/components/ui/empty.tsx
 * and provides common patterns for entity-specific empty states.
 *
 * @example
 * <EntityEmptyState
 *   icon={Briefcase}
 *   title="No jobs found"
 *   description="Get started by creating your first job."
 *   action={<Button>Create Job</Button>}
 * />
 */

import type { LucideIcon } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

type EntityEmptyStateProps = {
	/** Icon to display */
	icon: LucideIcon;
	/** Title text */
	title: string;
	/** Description text */
	description?: string;
	/** Optional action button/element */
	action?: React.ReactNode;
	/** Additional className */
	className?: string;
};

/**
 * EntityEmptyState - Standardized empty state for entities
 */
export function EntityEmptyState({ icon: Icon, title, description, action, className }: EntityEmptyStateProps) {
	return (
		<Empty className={className}>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Icon className="size-8 text-muted-foreground" />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				{description && <EmptyDescription>{description}</EmptyDescription>}
			</EmptyHeader>
			{action && <EmptyContent>{action}</EmptyContent>}
		</Empty>
	);
}
