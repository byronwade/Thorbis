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
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className={cn(
                  "ease flex h-12 w-full items-center justify-between border-0 bg-transparent px-4 transition-all duration-200 hover:bg-muted/50 cursor-pointer disabled:text-muted-foreground",
                  !isLast && "border-b border-border",
                  isLast && !isOpen && "rounded-b-md"
                )}
                data-radix-collection-item=""
              >
                <span className="flex items-center gap-2 w-full">
                  <ChevronRight
                    className={cn(
                      "ease-[ease] size-4 transition-transform duration-200",
                      isOpen && "rotate-90"
                    )}
                  />
                  <span className="flex items-center gap-2 w-full">
                    {section.icon && (
                      <span className="text-muted-foreground">{section.icon}</span>
                    )}
                    <span className="text-sm font-medium">{section.title}</span>
                    {section.count !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {section.count}
                      </span>
                    )}
                  </span>
                </span>
              </button>
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
  return <div className={cn("p-4", className)}>{children}</div>;
}

