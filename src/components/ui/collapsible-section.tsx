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
      className={cn("rounded-lg border bg-card shadow-sm", className)}
      value={value}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-3.5">
        <AccordionTrigger className="flex-1 hover:no-underline">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <span className="text-primary [&>svg]:h-4 [&>svg]:w-4">
                  {icon}
                </span>
              </div>
            )}
            <span className="font-medium text-sm">{title}</span>
            {count !== undefined && (
              <Badge className="ml-1 text-xs" variant="secondary">
                {count}
              </Badge>
            )}
            {badge}
          </div>
        </AccordionTrigger>
        {actions && (
          <div
            className="flex shrink-0 items-center gap-2"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {actions}
          </div>
        )}
      </div>
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
