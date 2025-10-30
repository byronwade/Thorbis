"use client";

/**
 * Apple View Carousel - Client Component
 *
 * Client-side features:
 * - Touch swipe gestures
 * - Keyboard navigation
 * - Smooth view transitions
 * - Drag to navigate between views
 *
 * Performance optimizations:
 * - GPU-accelerated transforms
 * - Virtualized view rendering (only render current + adjacent)
 * - Optimized animation frames
 * - Memoized calculations
 */

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppleViewCarouselProps = {
  viewCount: number;
  currentView: number;
  onViewChange: (view: number) => void;
  children: (viewIndex: number) => React.ReactNode;
  showNavigation?: boolean;
  enableKeyboard?: boolean;
  enableSwipe?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
};

const SWIPE_THRESHOLD = 50; // Minimum swipe distance to trigger navigation
const SWIPE_VELOCITY_THRESHOLD = 500; // Minimum velocity for quick swipe

/**
 * Apple-style view carousel with smooth transitions
 */
export function AppleViewCarousel({
  viewCount,
  currentView,
  onViewChange,
  children,
  showNavigation = true,
  enableKeyboard = true,
  enableSwipe = true,
  autoPlay = false,
  autoPlayInterval = 30_000,
}: AppleViewCarouselProps) {
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isPaused, setIsPaused] = useState(false);

  // Navigation handlers
  const goToPrevView = useCallback(() => {
    if (currentView > 0) {
      setDirection("left");
      onViewChange(currentView - 1);
    }
  }, [currentView, onViewChange]);

  const goToNextView = useCallback(() => {
    if (currentView < viewCount - 1) {
      setDirection("right");
      onViewChange(currentView + 1);
    }
  }, [currentView, viewCount, onViewChange]);

  const goToView = useCallback(
    (index: number) => {
      if (index !== currentView && index >= 0 && index < viewCount) {
        setDirection(index > currentView ? "right" : "left");
        onViewChange(index);
      }
    },
    [currentView, viewCount, onViewChange]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevView();
      } else if (e.key === "ArrowRight") {
        goToNextView();
      } else if (e.key >= "1" && e.key <= "9") {
        const index = Number.parseInt(e.key) - 1;
        if (index < viewCount) {
          goToView(index);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboard, goToPrevView, goToNextView, goToView, viewCount]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isPaused || viewCount <= 1) return;

    const intervalId = setInterval(() => {
      if (currentView < viewCount - 1) {
        goToNextView();
      } else {
        goToView(0); // Loop back to first view
      }
    }, autoPlayInterval);

    return () => clearInterval(intervalId);
  }, [
    autoPlay,
    isPaused,
    currentView,
    viewCount,
    autoPlayInterval,
    goToNextView,
    goToView,
  ]);

  // Pause auto-play on interaction
  const handleInteraction = useCallback(() => {
    if (autoPlay) {
      setIsPaused(true);
      // Resume after 10 seconds of inactivity
      setTimeout(() => setIsPaused(false), 10_000);
    }
  }, [autoPlay]);

  // Swipe handlers
  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!enableSwipe) return;

      handleInteraction();

      const { offset, velocity } = info;
      const swipe = offset.x;
      const swipeVelocity = velocity.x;

      // Determine if swipe is strong enough
      const shouldSwipe =
        Math.abs(swipe) > SWIPE_THRESHOLD ||
        Math.abs(swipeVelocity) > SWIPE_VELOCITY_THRESHOLD;

      if (shouldSwipe) {
        if (swipe > 0) {
          goToPrevView();
        } else {
          goToNextView();
        }
      }
    },
    [enableSwipe, goToPrevView, goToNextView, handleInteraction]
  );

  // Animation variants
  const slideVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div
      className="relative size-full overflow-hidden"
      onClick={handleInteraction}
    >
      {/* View content */}
      <AnimatePresence custom={direction} initial={false} mode="wait">
        <motion.div
          animate="center"
          className="absolute inset-0"
          custom={direction}
          drag={enableSwipe ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          exit="exit"
          initial="enter"
          key={currentView}
          onDragEnd={handleDragEnd}
          transition={{
            x: {
              type: "spring",
              stiffness: 300,
              damping: 30,
            },
            opacity: { duration: 0.2 },
          }}
          variants={slideVariants}
        >
          {children(currentView)}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {showNavigation && viewCount > 1 && (
        <>
          <Button
            className={cn(
              "-translate-y-1/2 absolute top-1/2 left-4 z-50 opacity-0 transition-opacity hover:opacity-100",
              currentView === 0 && "pointer-events-none opacity-0"
            )}
            onClick={(e) => {
              e.stopPropagation();
              goToPrevView();
            }}
            size="icon"
            variant="secondary"
          >
            <ChevronLeft className="size-6" />
          </Button>
          <Button
            className={cn(
              "-translate-y-1/2 absolute top-1/2 right-4 z-50 opacity-0 transition-opacity hover:opacity-100",
              currentView === viewCount - 1 && "pointer-events-none opacity-0"
            )}
            onClick={(e) => {
              e.stopPropagation();
              goToNextView();
            }}
            size="icon"
            variant="secondary"
          >
            <ChevronRight className="size-6" />
          </Button>
        </>
      )}

      {/* View indicators (iOS-style dots) */}
      {viewCount > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-40 flex justify-center">
          <div className="flex gap-2 rounded-full bg-background/20 px-4 py-2 backdrop-blur-md">
            {Array.from({ length: viewCount }).map((_, index) => (
              <button
                className={cn(
                  "h-2 cursor-pointer rounded-full transition-all",
                  index === currentView
                    ? "w-8 bg-primary"
                    : "w-2 bg-primary/30 hover:bg-primary/50"
                )}
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToView(index);
                  handleInteraction();
                }}
                type="button"
              />
            ))}
          </div>
        </div>
      )}

      {/* Auto-play indicator */}
      {autoPlay && !isPaused && viewCount > 1 && (
        <div className="pointer-events-none absolute top-4 right-4 z-40">
          <div className="rounded-full bg-background/20 px-3 py-1 backdrop-blur-md">
            <span className="text-xs">Auto-rotating</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * View indicator component for external use
 */
export function ViewIndicators({
  viewCount,
  currentView,
  onViewClick,
}: {
  viewCount: number;
  currentView: number;
  onViewClick: (index: number) => void;
}) {
  if (viewCount <= 1) return null;

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: viewCount }).map((_, index) => (
        <button
          className={cn(
            "h-2 cursor-pointer rounded-full transition-all",
            index === currentView
              ? "w-8 bg-primary"
              : "w-2 bg-primary/30 hover:bg-primary/50"
          )}
          key={index}
          onClick={() => onViewClick(index)}
          type="button"
        />
      ))}
    </div>
  );
}
