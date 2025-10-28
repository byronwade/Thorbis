"use client";

import { Plus, GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Slide } from "./slide-types";

type SlideSidebarProps = {
  slides: Slide[];
  currentSlide: number;
  onSlideClick: (index: number) => void;
  onAddSlide?: () => void;
  className?: string;
};

export function SlideSidebar({
  slides,
  currentSlide,
  onSlideClick,
  onAddSlide,
  className,
}: SlideSidebarProps) {
  return (
    <div className={cn("flex h-full w-64 flex-col border-r border-primary/20 bg-background/50 backdrop-blur-sm", className)}>
      {/* Header */}
      <div className="border-b border-primary/20 p-4">
        <h3 className="font-semibold text-lg">Slides</h3>
        <p className="text-muted-foreground text-xs">{slides.length} slide{slides.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Slide list */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <motion.button
                animate={{
                  scale: isActive ? 1 : 0.98,
                  borderColor: isActive ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.2)",
                }}
                className={cn(
                  "group relative w-full overflow-hidden rounded-lg border-2 p-3 text-left transition-all",
                  isActive
                    ? "bg-primary/10 shadow-lg"
                    : "bg-background/80 hover:bg-primary/5"
                )}
                key={slide.id}
                onClick={() => {
                  onSlideClick(index);
                }}
                transition={{ duration: 0.2 }}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Drag handle */}
                <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <GripVertical className="size-4 text-muted-foreground" />
                </div>

                {/* Slide info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      Slide {index + 1}
                    </span>
                    {isActive && (
                      <span className="rounded-full bg-primary px-2 py-0.5 font-medium text-[10px] text-primary-foreground">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {slide.widgets.length} widget{slide.widgets.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Mini preview */}
                <div className="mt-2 grid grid-cols-4 gap-1">
                  {slide.widgets.slice(0, 8).map((widget, idx) => (
                    <div
                      className="aspect-square rounded-sm bg-primary/20"
                      key={widget.id}
                    />
                  ))}
                  {slide.widgets.length > 8 && (
                    <div className="flex aspect-square items-center justify-center rounded-sm bg-primary/10 text-[10px] text-muted-foreground">
                      +{slide.widgets.length - 8}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Add slide button */}
      {onAddSlide && (
        <div className="border-t border-primary/20 p-2">
          <Button
            className="w-full"
            onClick={onAddSlide}
            size="sm"
            variant="outline"
          >
            <Plus className="mr-2 size-4" />
            New Slide
          </Button>
        </div>
      )}
    </div>
  );
}
