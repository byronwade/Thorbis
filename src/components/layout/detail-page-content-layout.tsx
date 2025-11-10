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

interface DetailPageHeaderConfig {
  title: string;
  subtitle?: string;
  badges?: ReactNode[];
  actions?: ReactNode[];
  metadata?: Array<{
    icon?: ReactNode;
    label: string;
    value: ReactNode;
  }>;
}

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
    <div className={cn("flex flex-col", className)}>
      {/* Header Section */}
      {customHeader ? (
        customHeader
      ) : header ? (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-6">
            {/* Title and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold">{header.title}</h1>
                {header.subtitle && (
                  <p className="text-sm text-muted-foreground">{header.subtitle}</p>
                )}
                {header.badges && header.badges.length > 0 && (
                  <div className="flex gap-2 flex-wrap">{header.badges}</div>
                )}
              </div>
              {header.actions && header.actions.length > 0 && (
                <div className="flex gap-2 flex-wrap">{header.actions}</div>
              )}
            </div>

            {/* Metadata Grid */}
            {header.metadata && header.metadata.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {header.metadata.map((item, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>
                    <div className="text-sm font-medium">{item.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Unified Accordion Section */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6">
        <UnifiedAccordion
          sections={allSections}
          defaultOpenSection={defaultOpenSection || allSections[0]?.id}
        />
      </div>
    </div>
  );
}

