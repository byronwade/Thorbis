"use client";

/**
 * WorkPageLayout - Semantic container for work pages
 *
 * Provides proper structure with:
 * - Stats bar that hides on scroll
 * - Proper flex container for datatable
 * - Correct height calculations
 */

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type WorkPageLayoutProps = {
  stats?: ReactNode;
  children: ReactNode;
};

export function WorkPageLayout({ stats, children }: WorkPageLayoutProps) {
  const [hideStats, setHideStats] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Find the actual scrolling element inside the datatable
    const findScrollContainer = () => {
      const container = scrollContainerRef.current;
      if (!container) {
        return null;
      }

      // Look for the scroll container inside the datatable
      const scrollElement = container.querySelector(".momentum-scroll");
      return scrollElement as HTMLElement;
    };

    const scrollElement = findScrollContainer();
    if (!scrollElement) {
      return;
    }

    const handleScroll = () => {
      const currentScrollY = scrollElement.scrollTop;

      // Hide stats immediately when scrolling down
      if (currentScrollY > lastScrollY.current && currentScrollY > 0) {
        setHideStats(true);
      }
      // Show when scrolling back to top or scrolling up
      else if (currentScrollY === 0 || currentScrollY < lastScrollY.current) {
        setHideStats(false);
      }

      lastScrollY.current = currentScrollY;
    };

    scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Stats Bar - hides on scroll */}
      {stats && (
        <div
          className={`${
            hideStats
              ? "-translate-y-full h-0 opacity-0"
              : "translate-y-0 opacity-100 transition-all duration-200"
          }`}
        >
          {stats}
        </div>
      )}

      {/* Data Container - fills remaining space and handles scroll */}
      <div className="flex-1 overflow-hidden" ref={scrollContainerRef}>
        {children}
      </div>
    </>
  );
}
