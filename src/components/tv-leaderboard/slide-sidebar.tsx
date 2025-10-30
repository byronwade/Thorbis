"use client";

import { Copy, MonitorPlay, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Slide } from "./slide-types";

type SlideSidebarProps = {
  slides: Slide[];
  currentSlide: number;
  onSlideClick: (index: number) => void;
  onAddSlide?: () => void;
  onRemoveSlide?: (index: number) => void;
  onDuplicateSlide?: (index: number) => void;
  className?: string;
};

export function SlideSidebar({
  slides,
  currentSlide,
  onSlideClick,
  onAddSlide,
  onRemoveSlide,
  onDuplicateSlide,
  className,
}: SlideSidebarProps) {
  return (
    <div
      className={cn("flex h-full w-64 flex-col border-r bg-sidebar", className)}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div>
          <h3 className="font-semibold text-sm">Views</h3>
          <p className="text-muted-foreground text-xs">
            {slides.length} {slides.length !== 1 ? "views" : "view"}
          </p>
        </div>
      </div>

      {/* Slide list */}
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                className={cn(
                  "group relative rounded-md transition-all",
                  isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
                )}
                key={slide.id}
              >
                <button
                  className="flex w-full items-start gap-3 p-2 text-left"
                  onClick={() => {
                    onSlideClick(index);
                  }}
                  type="button"
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-sidebar-accent"
                    )}
                  >
                    <MonitorPlay className="size-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "font-medium text-sm",
                          isActive
                            ? "text-sidebar-accent-foreground"
                            : "text-sidebar-foreground"
                        )}
                      >
                        View {index + 1}
                      </span>
                      {isActive && (
                        <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {slide.widgets.length}{" "}
                      {slide.widgets.length !== 1 ? "widgets" : "widget"}
                    </p>

                    {/* Mini widget preview grid */}
                    <div className="mt-2 grid grid-cols-4 gap-0.5">
                      {slide.widgets.slice(0, 8).map((widget) => (
                        <div
                          className={cn(
                            "aspect-square rounded-sm",
                            isActive ? "bg-primary/20" : "bg-sidebar-accent"
                          )}
                          key={widget.id}
                        />
                      ))}
                      {slide.widgets.length > 8 && (
                        <div className="flex aspect-square items-center justify-center rounded-sm bg-muted text-[9px] text-muted-foreground">
                          +{slide.widgets.length - 8}
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {/* Action buttons - show on hover */}
                <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {onDuplicateSlide && (
                    <Button
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateSlide(index);
                      }}
                      size="sm"
                      title="Duplicate view"
                      variant="ghost"
                    >
                      <Copy className="size-3" />
                    </Button>
                  )}
                  {onRemoveSlide && slides.length > 1 && (
                    <Button
                      className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSlide(index);
                      }}
                      size="sm"
                      title="Delete view"
                      variant="ghost"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer info */}
      <div className="border-t p-3">
        <p className="text-center text-muted-foreground text-xs">
          Views are created automatically when you add more widgets
        </p>
      </div>
    </div>
  );
}
