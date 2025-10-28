"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SlideIndicatorsProps = {
  slideCount: number;
  currentSlide: number;
  onSlideClick: (index: number) => void;
  className?: string;
};

export function SlideIndicators({
  slideCount,
  currentSlide,
  onSlideClick,
  className,
}: SlideIndicatorsProps) {
  if (slideCount <= 1) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "fixed bottom-8 left-1/2 z-40 -translate-x-1/2",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-2 shadow-lg backdrop-blur-md">
        {Array.from({ length: slideCount }).map((_, index) => {
          const isActive = index === currentSlide;
          return (
            <motion.button
              animate={{
                width: isActive ? 24 : 8,
                backgroundColor: isActive
                  ? "hsl(var(--primary))"
                  : "hsl(var(--muted-foreground) / 0.4)",
              }}
              className="h-2 rounded-full transition-colors hover:bg-primary/60"
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onSlideClick(index);
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
