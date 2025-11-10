"use client";

import { ChevronRight, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { UnifiedAccordionContent } from "@/components/ui/unified-accordion";
import { Badge } from "@/components/ui/badge";

interface RelatedItem {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  href: string;
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
}

interface RelatedItemsSectionProps {
  relatedItems: RelatedItem[];
}

export function RelatedItemsSection({
  relatedItems,
}: RelatedItemsSectionProps) {
  if (!relatedItems || relatedItems.length === 0) {
    return (
      <UnifiedAccordionContent>
        <div className="flex h-32 items-center justify-center">
          <div className="text-center">
            <LinkIcon className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              No related items
            </p>
          </div>
        </div>
      </UnifiedAccordionContent>
    );
  }

  return (
    <UnifiedAccordionContent>
      <div className="space-y-2">
        {relatedItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{item.title}</p>
                {item.badge && (
                  <Badge variant={item.badge.variant || "default"} className="flex-shrink-0">
                    {item.badge.label}
                  </Badge>
                )}
              </div>
              {item.subtitle && (
                <p className="text-xs text-muted-foreground truncate">
                  {item.subtitle}
                </p>
              )}
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </Link>
        ))}
      </div>
    </UnifiedAccordionContent>
  );
}

