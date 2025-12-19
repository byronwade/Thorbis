"use client";

/**
 * GenericPageContent - Universal Detail Page Content Layout
 *
 * Configuration-driven detail page content that wraps DetailPageContentLayout.
 * Uses builder functions for maximum flexibility while maintaining consistency.
 *
 * Features:
 * - Consistent header building (title, subtitle, badges, breadcrumbs)
 * - Quick info grid (4-column layout with icons)
 * - Custom sections via builder function
 * - Standard sections auto-included (activities, notes, attachments)
 * - Workflow timeline support
 * - Related items sidebar
 * - Entity tags support
 *
 * @example
 * ```tsx
 * import { GenericPageContent } from "@/components/work/generic/generic-page-content";
 * import { contractPageConfig } from "@/components/work/generic/configs/contracts-page";
 *
 * export function ContractPageContent({ entityData }: Props) {
 *   return <GenericPageContent config={contractPageConfig} entity={entityData} />;
 * }
 * ```
 */

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
	DetailPageContentLayout,
	type DetailPageHeaderConfig,
} from "@/components/layout/detail-page-content-layout";
import type { UnifiedAccordionSection } from "@/components/ui/unified-accordion";
import { WorkflowTimeline } from "@/components/ui/workflow-timeline";
import type {
	GenericPageContentConfig,
	QuickInfoItem,
	RelatedItem,
	WorkflowStage,
} from "./types";

// =============================================================================
// COMPONENT PROPS
// =============================================================================

interface GenericPageContentProps<T, R = unknown> {
	/** Page content configuration */
	config: GenericPageContentConfig<T, R>;
	/** Entity data */
	entity: T;
	/** Related data (optional) */
	related?: R;
	/** Activities for standard section */
	activities?: Array<{
		id: string;
		type: string;
		description: string;
		timestamp: string;
		user?: { name: string; avatar?: string };
	}>;
	/** Notes for standard section */
	notes?: Array<{
		id: string;
		content: string;
		createdAt: string;
		author?: { name: string };
	}>;
	/** Attachments for standard section */
	attachments?: Array<{
		id: string;
		name: string;
		type: string;
		size: number;
		url: string;
	}>;
}

// =============================================================================
// QUICK INFO GRID COMPONENT
// =============================================================================

function QuickInfoGrid({ items }: { items: QuickInfoItem[] }) {
	if (items.length === 0) return null;

	return (
		<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
			{items.map((item, index) => (
				<div
					key={`${item.label}-${index}`}
					className="flex items-start gap-3 rounded-lg border p-3"
				>
					{item.icon && (
						<div className="bg-muted flex size-8 items-center justify-center rounded">
							<item.icon className="text-muted-foreground size-4" />
						</div>
					)}
					<div className="min-w-0 flex-1">
						<p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
							{item.label}
						</p>
						<p className="text-sm font-medium truncate">
							{typeof item.value === "string" || typeof item.value === "number"
								? item.value
								: item.value}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}

// =============================================================================
// RELATED ITEMS COMPONENT
// =============================================================================

function RelatedItemsList({ items }: { items: RelatedItem[] }) {
	if (items.length === 0) return null;

	return (
		<div className="space-y-2">
			{items.map((item) => (
				<a
					key={item.id}
					href={item.href}
					className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-3 transition-colors"
				>
					{item.icon && (
						<div className="bg-muted flex size-8 items-center justify-center rounded">
							<item.icon className="text-muted-foreground size-4" />
						</div>
					)}
					<div className="min-w-0 flex-1">
						<p className="text-sm font-medium truncate">{item.label}</p>
						{item.badge && (
							<span className="text-muted-foreground text-xs">{item.badge}</span>
						)}
					</div>
				</a>
			))}
		</div>
	);
}

// =============================================================================
// WORKFLOW TIMELINE SECTION
// =============================================================================

function WorkflowTimelineSection({ stages }: { stages: WorkflowStage[] }) {
	if (stages.length === 0) return null;

	// Convert to WorkflowTimeline format
	const timelineStages = stages.map((stage) => ({
		id: stage.id,
		label: stage.label,
		status: stage.status as "completed" | "current" | "pending",
		date: stage.date,
		description: stage.description,
	}));

	return (
		<div className="border-border/60 rounded-lg border p-4">
			<WorkflowTimeline stages={timelineStages} />
		</div>
	);
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function GenericPageContent<T, R = unknown>({
	config,
	entity,
	related,
	activities,
	notes,
	attachments,
}: GenericPageContentProps<T, R>) {
	const router = useRouter();
	const {
		entityType,
		buildHeader,
		buildQuickInfo,
		buildSections,
		buildRelatedItems,
		workflowTimeline,
		storageKey,
		showStandardSections = true,
	} = config;

	// ---------------------------------------------------------------------------
	// Build Header
	// ---------------------------------------------------------------------------

	const header: DetailPageHeaderConfig = useMemo(() => {
		return buildHeader(entity, related as R);
	}, [entity, related, buildHeader]);

	// ---------------------------------------------------------------------------
	// Build Quick Info
	// ---------------------------------------------------------------------------

	const quickInfo = useMemo(() => {
		return buildQuickInfo(entity, related as R);
	}, [entity, related, buildQuickInfo]);

	// ---------------------------------------------------------------------------
	// Build Sections
	// ---------------------------------------------------------------------------

	const customSections: UnifiedAccordionSection[] = useMemo(() => {
		const sections = buildSections(entity, related as R);

		// Add quick info as first section if we have items
		if (quickInfo.length > 0) {
			sections.unshift({
				id: "quick-info",
				title: "Quick Info",
				defaultOpen: true,
				content: <QuickInfoGrid items={quickInfo} />,
			});
		}

		// Add workflow timeline section if configured
		if (workflowTimeline && workflowTimeline.show(entity, related as R)) {
			const stages = workflowTimeline.buildStages(entity, related as R);
			if (stages.length > 0) {
				sections.push({
					id: "workflow-timeline",
					title: "Workflow Progress",
					defaultOpen: true,
					content: <WorkflowTimelineSection stages={stages} />,
				});
			}
		}

		return sections;
	}, [entity, related, buildSections, quickInfo, workflowTimeline]);

	// ---------------------------------------------------------------------------
	// Build Related Items
	// ---------------------------------------------------------------------------

	const relatedItems = useMemo(() => {
		if (!buildRelatedItems) return [];
		return buildRelatedItems(entity, related as R);
	}, [entity, related, buildRelatedItems]);

	// ---------------------------------------------------------------------------
	// Render
	// ---------------------------------------------------------------------------

	return (
		<DetailPageContentLayout
			header={header}
			customSections={customSections}
			activities={activities}
			notes={notes}
			attachments={attachments}
			relatedItems={
				relatedItems.length > 0 ? (
					<RelatedItemsList items={relatedItems} />
				) : undefined
			}
			showStandardSections={showStandardSections}
			storageKey={storageKey}
			enableReordering
		/>
	);
}
