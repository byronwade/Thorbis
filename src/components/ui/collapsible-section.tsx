/**
 * Standardized Collapsible Section Component
 *
 * Used across customer details, job details, and other pages for consistent design.
 * - Inline action buttons with title
 * - Full-width data tables support
 * - Consistent styling and spacing
 */

"use client";

import type { ReactNode } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CollapsibleSectionProps = {
  value: string;
  title: string;
  icon?: ReactNode;
  badge?: ReactNode;
  count?: number;
  actions?: ReactNode; // Action buttons (e.g., "Create Invoice", "Add Note")
  children: ReactNode;
  fullWidthContent?: boolean; // If true, removes padding for full-width tables
  className?: string;
};

export function CollapsibleSection({
  value,
  title,
  icon,
  badge,
  count,
  actions,
  children,
  fullWidthContent = false,
  className,
}: CollapsibleSectionProps) {
  return (
    <AccordionItem
      className={cn("rounded-lg border bg-card", className)}
      value={value}
    >
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <div className="flex w-full items-center justify-between gap-4 pr-4">
          <div className="flex flex-1 items-center gap-2">
            {icon && <span className="text-primary">{icon}</span>}
            <span className="font-semibold text-lg">{title}</span>
            {count !== undefined && <Badge variant="secondary">{count}</Badge>}
            {badge}
          </div>
          {actions && (
            // biome-ignore lint/a11y/noNoninteractiveElementInteractions lint/a11y/noStaticElementInteractions: Container to prevent accordion toggle when clicking action buttons
            <div
              className="flex shrink-0 items-center gap-2"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {actions}
            </div>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent
        className={cn("px-6 pb-6", fullWidthContent && "-mx-6 -mt-6 -mb-6")}
      >
        {fullWidthContent ? (
          <div>{children}</div>
        ) : (
          <div className="space-y-4">{children}</div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
