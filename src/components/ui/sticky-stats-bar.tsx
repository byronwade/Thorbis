"use client";

/**
 * StickyStatsBar - Wrapper for stats that makes them sticky and compact on scroll
 * 
 * Features:
 * - Becomes sticky when scrolling down
 * - Compacts into a smaller row on scroll
 * - Smooth transitions
 * - Works with any stats component
 * - Uses Intersection Observer for reliable scroll detection
 */

import { useEffect, useState, useRef, cloneElement, isValidElement } from "react";
import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

interface StickyStatsBarProps {
  children: ReactElement;
  className?: string;
}

export function StickyStatsBar({ 
  children, 
  className
}: StickyStatsBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // Find the scrollable parent container
    const findScrollableParent = (element: HTMLElement): HTMLElement | null => {
      let parent = element.parentElement;
      
      while (parent) {
        const { overflow, overflowY } = window.getComputedStyle(parent);
        const isScrollable = 
          overflow === "auto" || 
          overflow === "scroll" || 
          overflowY === "auto" || 
          overflowY === "scroll";
        
        if (isScrollable && parent.scrollHeight > parent.clientHeight) {
          return parent;
        }
        
        parent = parent.parentElement;
      }
      
      return null;
    };

    const scrollContainer = findScrollableParent(sentinel);

    // Use Intersection Observer to detect when the sentinel leaves the visible area
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only set scrolled to true if we're actually at the top edge
        // entry.boundingClientRect.top < 0 means the sentinel has scrolled above the container
        if (entry.isIntersecting) {
          // Sentinel is visible, we're at the top
          setIsScrolled(false);
        } else if (entry.boundingClientRect.top < 0) {
          // Sentinel has scrolled above the viewport, we've scrolled down
          setIsScrolled(true);
        }
      },
      {
        root: scrollContainer, // Use the scroll container as root instead of viewport
        threshold: 0, // Trigger as soon as any part is visible/hidden
        rootMargin: "0px", // No margin adjustment
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Clone the child element and pass the compact prop if it's a valid React element
  const childWithProps = isValidElement(children)
    ? cloneElement(children, { compact: isScrolled } as any)
    : children;

  return (
    <>
      {/* Sentinel element - minimal height, used to detect scroll */}
      <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
      
      {/* Stats bar container - no margins or padding */}
      <div
        ref={containerRef}
        className={cn(
          "top-0 z-40 w-full bg-background transition-all duration-300 ease-in-out",
          isScrolled && "sticky shadow-md",
          className
        )}
      >
        {childWithProps}
      </div>
    </>
  );
}

