"use client";

/**
 * TV Mode Sidebar - Client Component
 *
 * Dashboard-style sidebar for TV mode editing
 * Matches the design of the main dashboard sidebar
 */

import { Eye, Grid3x3, LayoutGrid, Plus, Settings, X } from "lucide-react";
import {
  LazyAnimatePresence as AnimatePresence,
  LazyMotionButton as motion_button,
  LazyMotionDiv as motion_div,
} from "@/components/lazy/framer-motion";

// Alias for backward compatibility
const motion = {
  div: motion_div,
  button: motion_button,
};

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { View } from "./hooks/use-view-pagination";

type TVModeSidebarProps = {
  views: View[];
  currentView: number;
  onViewClick: (index: number) => void;
  onAddWidget?: () => void;
  onSettingsClick?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
};

export function TVModeSidebar({
  views,
  currentView,
  onViewClick,
  onAddWidget,
  onSettingsClick,
  isOpen = true,
  onClose,
}: TVModeSidebarProps) {
  const [hoveredView, setHoveredView] = useState<number | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ x: 0 }}
          className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-border border-r bg-background shadow-lg"
          exit={{ x: -256 }}
          initial={{ x: -256 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-border border-b p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <LayoutGrid className="size-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">TV Mode</h2>
                <p className="text-muted-foreground text-xs">
                  {views.length} {views.length === 1 ? "view" : "views"}
                </p>
              </div>
            </div>
            {onClose && (
              <Button onClick={onClose} size="icon" variant="ghost">
                <X className="size-4" />
              </Button>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 border-border border-b p-3">
            {onAddWidget && (
              <Button
                className="flex-1"
                onClick={onAddWidget}
                size="sm"
                variant="outline"
              >
                <Plus className="mr-2 size-4" />
                Add Widget
              </Button>
            )}
            {onSettingsClick && (
              <Button onClick={onSettingsClick} size="sm" variant="outline">
                <Settings className="size-4" />
              </Button>
            )}
          </div>

          {/* Views list */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2">
              <div className="mb-2 flex items-center gap-2 px-2">
                <Eye className="size-4 text-muted-foreground" />
                <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Views
                </span>
              </div>

              {views.map((view, index) => {
                const isActive = index === currentView;
                const isHovered = index === hoveredView;
                const capacityPercent =
                  (view.usedCells / (view.usedCells + view.availableCells)) *
                  100;

                return (
                  <motion.button
                    className={cn(
                      "group relative w-full overflow-hidden rounded-lg border text-left transition-all",
                      isActive
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/50 hover:bg-accent"
                    )}
                    key={view.id}
                    onClick={() => onViewClick(index)}
                    onMouseEnter={() => setHoveredView(index)}
                    onMouseLeave={() => setHoveredView(null)}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-3">
                      {/* View header */}
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Grid3x3
                            className={cn(
                              "size-4",
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                          <span
                            className={cn(
                              "font-semibold text-sm",
                              isActive ? "text-primary" : "text-foreground"
                            )}
                          >
                            View {index + 1}
                          </span>
                        </div>
                        {isActive && (
                          <Badge
                            className="h-5 px-2 text-[10px]"
                            variant="default"
                          >
                            Active
                          </Badge>
                        )}
                      </div>

                      {/* Widget count */}
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {view.widgets.length}{" "}
                          {view.widgets.length === 1 ? "widget" : "widgets"}
                        </span>
                        <span
                          className={cn(
                            "font-medium",
                            view.isFull ? "text-warning" : "text-success"
                          )}
                        >
                          {view.availableCells} cells free
                        </span>
                      </div>

                      {/* Capacity bar */}
                      <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          animate={{ width: `${capacityPercent}%` }}
                          className={cn(
                            "h-full rounded-full",
                            isActive ? "bg-primary" : "bg-primary/50"
                          )}
                          initial={{ width: 0 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>

                      {/* Widget grid preview */}
                      <AnimatePresence>
                        {(isActive || isHovered) && (
                          <motion.div
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 grid grid-cols-4 gap-1"
                            exit={{ opacity: 0, height: 0 }}
                            initial={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {view.widgets.slice(0, 12).map((widget) => (
                              <div
                                className={cn(
                                  "aspect-square rounded-sm",
                                  isActive ? "bg-primary/20" : "bg-muted"
                                )}
                                key={widget.id}
                              />
                            ))}
                            {view.widgets.length > 12 && (
                              <div className="flex aspect-square items-center justify-center rounded-sm bg-muted text-[10px] text-muted-foreground">
                                +{view.widgets.length - 12}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-border border-t p-3">
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-muted-foreground text-xs">
                Press{" "}
                <kbd className="rounded bg-background px-1.5 py-0.5 font-mono text-[10px]">
                  ESC
                </kbd>{" "}
                to exit
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
