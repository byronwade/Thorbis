/**
 * Collapsible Section Wrapper for Tiptap Blocks
 *
 * Wraps custom blocks to make them collapsible
 * - Click to expand/collapse
 * - Default open/closed state
 * - Saves state to localStorage
 * - Smooth animations
 */

"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionWrapperProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  storageKey?: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
  summary?: string; // Smart summary text shown in header
  actions?: React.ReactNode; // Action buttons (e.g., "Add Property", "Add Document") - always visible
}

export function CollapsibleSectionWrapper({
  title,
  icon,
  defaultOpen = true,
  storageKey,
  children,
  badge,
  summary,
  actions,
}: CollapsibleSectionWrapperProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Load state from localStorage
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        setIsOpen(saved === "true");
      }
    }
  }, [storageKey]);

  // Save state to localStorage
  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (storageKey) {
      localStorage.setItem(storageKey, String(newState));
    }
  };

  return (
    <div className="not-prose my-6 rounded-lg border bg-card shadow-sm">
      {/* Header - Clickable to toggle */}
      <div className="flex w-full items-center justify-between gap-4 px-6 py-3.5">
        <button
          type="button"
          onClick={toggleOpen}
          className="flex flex-1 items-center gap-3 text-left transition-colors hover:bg-muted/50 rounded-md"
        >
          {/* Icon with Background */}
          {icon && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <span className="text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm">{title}</h3>
              {badge}
            </div>
            {summary && !isOpen && (
              <p className="mt-0.5 text-muted-foreground text-xs">{summary}</p>
            )}
          </div>

          {/* Collapse/Expand Chevron */}
          {isOpen ? (
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform" />
          ) : (
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform" />
          )}
        </button>

        {/* Action Buttons - Always visible on far right */}
        {actions && (
          <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
            {actions}
          </div>
        )}
      </div>

      {/* Content - Collapsible */}
      {isOpen && (
        <div className="border-t p-6 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
