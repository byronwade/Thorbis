"use client";

import { ReactNode } from "react";
import { Activity, FileText, Paperclip, Link as LinkIcon } from "lucide-react";
import {
  UnifiedAccordion,
  UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";
import { ActivityLogSection } from "./standard-sections/activity-log-section";
import { NotesSection } from "./standard-sections/notes-section";
import { AttachmentsSection } from "./standard-sections/attachments-section";
import { RelatedItemsSection } from "./standard-sections/related-items-section";
import { cn } from "@/lib/utils";
import {
  DetailPageShell,
  DetailPageSurface,
  type DetailPageHeaderConfig,
} from "./detail-page-shell";

export type { DetailPageHeaderConfig };

interface DetailPageContentLayoutProps {
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

  /** Custom gap classes applied to stacked surfaces */
  contentGapClassName?: string;

  /** Surface customisation */
  surfacePadding?: "none" | "sm" | "md" | "lg";
  surfaceVariant?: "default" | "muted" | "subtle" | "ghost";
  surfaceClassName?: string;
}

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
  contentGapClassName,
  surfacePadding = "none",
  surfaceVariant = "default",
  surfaceClassName,
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
      className={cn("mx-auto w-full max-w-7xl", className)}
      customHeader={customHeader}
      header={header}
      beforeContent={beforeContent}
      afterContent={afterContent}
      contentGapClassName={contentGapClassName ?? "gap-6"}
    >
      <DetailPageSurface
        className={cn("overflow-hidden", surfaceClassName)}
        padding={surfacePadding}
        variant={surfaceVariant}
      >
        <UnifiedAccordion
          sections={allSections}
          defaultOpenSection={defaultOpenSection || allSections[0]?.id}
        />
      </DetailPageSurface>
    </DetailPageShell>
  );
}

