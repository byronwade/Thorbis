"use client";

import { ChevronRight } from "lucide-react";
import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface UnifiedAccordionSection {
  id: string;
  title: string;
  icon?: ReactNode;
  count?: number;
  content: ReactNode;
  defaultOpen?: boolean;
  actions?: ReactNode;
}

interface UnifiedAccordionProps {
  sections: UnifiedAccordionSection[];
  className?: string;
  defaultOpenSection?: string | null;
}

export function UnifiedAccordion({
  sections,
  className,
  defaultOpenSection,
}: UnifiedAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>(
    defaultOpenSection ?? sections.find((s) => s.defaultOpen)?.id ?? null
  );

  return (
    <div className={cn("rounded-md bg-muted/50 shadow-sm", className)}>
      <div className="rounded-b" data-orientation="vertical">
        {sections.map((section, index) => {
          const isOpen = openSection === section.id;
          const isLast = index === sections.length - 1;

          return (
            <div
              key={section.id}
              data-state={isOpen ? "open" : "closed"}
              data-orientation="vertical"
            >
              <div
                className={cn(
                  "group flex items-center gap-3 px-4 transition-colors",
                  !isLast && "border-b border-border/60",
                  isOpen
                    ? "bg-muted/60"
                    : "bg-background/80 hover:bg-muted/40 dark:bg-muted/30",
                  isLast && !isOpen && "rounded-b-md"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  className={cn(
                    "flex h-12 w-full flex-1 items-center gap-2 bg-transparent text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group-hover:bg-muted/40",
                    section.actions && "pr-2"
                  )}
                  data-radix-collection-item=""
                >
                  <ChevronRight
                    className={cn(
                      "ease-[ease] size-4 flex-shrink-0 transition-transform duration-200",
                      isOpen && "rotate-90"
                    )}
                  />
                  {section.icon && (
                    <span className="flex flex-shrink-0 items-center text-muted-foreground">
                      {section.icon}
                    </span>
                  )}
                  <span className="flex flex-1 items-center gap-2">
                    <span className="text-sm font-medium">{section.title}</span>
                    {section.count !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {section.count}
                      </span>
                    )}
                  </span>
                </button>
                {section.actions && (
                  <div
                    className="flex items-center gap-2 py-2"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    {section.actions}
                  </div>
                )}
              </div>
              <div
                data-state={isOpen ? "open" : "closed"}
                role="region"
                hidden={!isOpen}
                className={cn(
                  "overflow-hidden will-change-[height]",
                  !isLast && "border-b border-border",
                  isLast && "rounded-b-md"
                )}
              >
                {section.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Section content wrapper for consistent padding
export function UnifiedAccordionContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-4 sm:p-6", className)}>{children}</div>;
}

