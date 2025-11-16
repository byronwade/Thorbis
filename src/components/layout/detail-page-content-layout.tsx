"use client";

import { Activity, FileText, Link as LinkIcon, Paperclip } from "lucide-react";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { UnifiedAccordionSection } from "@/components/ui/unified-accordion";
import { cn } from "@/lib/utils";
import {
	type DetailPageHeaderConfig,
	DetailPageShell,
	DetailPageSurface,
} from "./detail-page-shell";
import { ActivityLogSection } from "./standard-sections/activity-log-section";
import { AttachmentsSection } from "./standard-sections/attachments-section";
import { NotesSection } from "./standard-sections/notes-section";
import { RelatedItemsSection } from "./standard-sections/related-items-section";

export type { DetailPageHeaderConfig };

const UnifiedAccordion = dynamic(
	() =>
		import("@/components/ui/unified-accordion").then(
			(mod) => mod.UnifiedAccordion,
		),
	{ ssr: false },
);

type DetailPageContentLayoutProps = {
	/** Header configuration */
	header?: DetailPageHeaderConfig;

	/** Custom header component (overrides header config if provided) */
	customHeader?: ReactNode;

	/** Page-specific sections (e.g., Line Items for PO, Services for Jobs) */
	customSections: UnifiedAccordionSection[];

	/** Standard sections data */
	activities?: any[];
	notes?: any[];
	attachments?: any[];
	relatedItems?: any[];

	/** Section visibility control */
	showStandardSections?: {
		activities?: boolean;
		notes?: boolean;
		attachments?: boolean;
		relatedItems?: boolean;
	};

	/** Optional container className */
	className?: string;

	/** Default open section ID */
	defaultOpenSection?: string;

	/** Content rendered between header and main sections */
	beforeContent?: ReactNode;

	/** Content rendered after main sections */
	afterContent?: ReactNode;

	/** Stats bar component to render inside the container (before header) */
	statsBar?: ReactNode;

	/** Custom gap classes applied to stacked surfaces */
	contentGapClassName?: string;

	/** Surface customisation */
	surfacePadding?: "none" | "sm" | "md" | "lg";
	surfaceVariant?: "default" | "muted" | "subtle" | "ghost";
	surfaceClassName?: string;

	/** Unique key for storing user's section order (e.g., "job-details", "customer-details") */
	storageKey?: string;

	/** Enable drag-and-drop reordering of sections (default: true) */
	enableReordering?: boolean;
};

export function DetailPageContentLayout({
	header,
	customHeader,
	customSections,
	activities = [],
	notes = [],
	attachments = [],
	relatedItems = [],
	showStandardSections = {
		activities: true,
		notes: true,
		attachments: true,
		relatedItems: true,
	},
	className,
	defaultOpenSection,
	beforeContent,
	afterContent,
	statsBar,
	contentGapClassName,
	surfacePadding = "none",
	surfaceVariant = "default",
	surfaceClassName,
	storageKey,
	enableReordering = true,
}: DetailPageContentLayoutProps) {
	// Build standard sections based on provided data and visibility settings
	const standardSections: UnifiedAccordionSection[] = [];

	// Add Activity Log section if enabled
	if (showStandardSections.activities !== false) {
		standardSections.push({
			id: "activity-log",
			title: "Activity Log",
			icon: <Activity className="size-4" />,
			count: activities.length,
			content: <ActivityLogSection activities={activities} />,
		});
	}

	// Add Notes section if enabled
	if (showStandardSections.notes !== false) {
		standardSections.push({
			id: "notes",
			title: "Notes",
			icon: <FileText className="size-4" />,
			count: notes.length,
			content: <NotesSection notes={notes} />,
		});
	}

	// Add Attachments section if enabled
	if (showStandardSections.attachments !== false) {
		standardSections.push({
			id: "attachments",
			title: "Attachments",
			icon: <Paperclip className="size-4" />,
			count: attachments.length,
			content: <AttachmentsSection attachments={attachments} />,
		});
	}

	// Add Related Items section if enabled and has data
	if (showStandardSections.relatedItems !== false && relatedItems.length > 0) {
		standardSections.push({
			id: "related-items",
			title: "Related Items",
			icon: <LinkIcon className="size-4" />,
			count: relatedItems.length,
			content: <RelatedItemsSection relatedItems={relatedItems} />,
		});
	}

	// Combine custom and standard sections
	const allSections = [...customSections, ...standardSections];

	return (
		<DetailPageShell
			afterContent={afterContent}
			beforeContent={beforeContent}
			className={cn("w-full", className)}
			contentGapClassName={contentGapClassName ?? "gap-4"}
			customHeader={customHeader}
			header={header}
			statsBar={statsBar}
		>
			<DetailPageSurface
				className={cn("overflow-hidden", surfaceClassName)}
				padding={surfacePadding}
				variant={surfaceVariant}
			>
				<UnifiedAccordion
					defaultOpenSection={defaultOpenSection || allSections[0]?.id}
					enableReordering={enableReordering}
					sections={allSections}
					storageKey={storageKey}
				/>
			</DetailPageSurface>
		</DetailPageShell>
	);
}
