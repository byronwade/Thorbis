"use client";

/**
 * TV Display Page - Client Component
 *
 * TV-optimized display with D-pad navigation
 * Edit features moved to /dashboard/settings/tv
 *
 * Client-side features:
 * - D-pad navigation (arrow keys, Enter, ESC)
 * - Auto-rotation with visual progress
 * - Settings access (button + keyboard shortcut)
 */

import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAutoRotation } from "@/components/tv-leaderboard/hooks/use-auto-rotation";
import { useSlideDistribution } from "@/components/tv-leaderboard/hooks/use-slide-distribution";
import { useSlideNavigation } from "@/components/tv-leaderboard/hooks/use-slide-navigation";
import { ProgressRing } from "@/components/tv-leaderboard/progress-ring";
import { SlideCarousel } from "@/components/tv-leaderboard/slide-carousel";
import { SlideIndicators } from "@/components/tv-leaderboard/slide-indicators";
import { DEFAULT_SLIDE_SETTINGS } from "@/components/tv-leaderboard/slide-types";
import type { Widget } from "@/components/tv-leaderboard/widget-types";
import { Button } from "@/components/ui/button";

type Technician = {
  id: string;
  name: string;
  avatar: string;
  stats: {
    revenue: number;
    revenueChange: number;
    jobsCompleted: number;
    jobsChange: number;
    avgTicket: number;
    avgTicketChange: number;
    customerRating: number;
    ratingChange: number;
  };
};

const mockTechnicians: Technician[] = [
  {
    id: "1",
    name: "John Smith",
    avatar: "JS",
    stats: {
      revenue: 45_280,
      revenueChange: 12.5,
      jobsCompleted: 97,
      jobsChange: 8.2,
      avgTicket: 467,
      avgTicketChange: 5.3,
      customerRating: 4.9,
      ratingChange: 2.1,
    },
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "SJ",
    stats: {
      revenue: 42_150,
      revenueChange: 15.3,
      jobsCompleted: 92,
      jobsChange: 12.1,
      avgTicket: 458,
      avgTicketChange: 3.2,
      customerRating: 4.8,
      ratingChange: 1.5,
    },
  },
  {
    id: "3",
    name: "Mike Davis",
    avatar: "MD",
    stats: {
      revenue: 39_800,
      revenueChange: -3.2,
      jobsCompleted: 88,
      jobsChange: -1.5,
      avgTicket: 452,
      avgTicketChange: -2.1,
      customerRating: 4.7,
      ratingChange: 0.8,
    },
  },
  {
    id: "4",
    name: "Emily Brown",
    avatar: "EB",
    stats: {
      revenue: 38_200,
      revenueChange: 8.7,
      jobsCompleted: 85,
      jobsChange: 5.4,
      avgTicket: 449,
      avgTicketChange: 4.1,
      customerRating: 4.9,
      ratingChange: 3.2,
    },
  },
  {
    id: "5",
    name: "David Wilson",
    avatar: "DW",
    stats: {
      revenue: 36_500,
      revenueChange: -5.8,
      jobsCompleted: 82,
      jobsChange: -4.2,
      avgTicket: 445,
      avgTicketChange: -1.8,
      customerRating: 4.6,
      ratingChange: -0.5,
    },
  },
];

const DEFAULT_WIDGETS: Widget[] = [
  { id: "leaderboard-1", type: "leaderboard", size: "full", position: 0 },
  { id: "company-goals-1", type: "company-goals", size: "medium", position: 1 },
  { id: "top-performer-1", type: "top-performer", size: "medium", position: 2 },
  { id: "revenue-chart-1", type: "revenue-chart", size: "medium", position: 3 },
  {
    id: "jobs-completed-1",
    type: "jobs-completed",
    size: "small",
    position: 4,
  },
  { id: "avg-ticket-1", type: "avg-ticket", size: "small", position: 5 },
  {
    id: "customer-rating-1",
    type: "customer-rating",
    size: "small",
    position: 6,
  },
];

const STORAGE_KEY = "tv-leaderboard-widgets";

export default function TVDisplayPage() {
  const router = useRouter();
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  const [showSettingsHint, setShowSettingsHint] = useState(false);

  // Auto-distribute widgets into slides
  const slides = useSlideDistribution(widgets);

  // Slide navigation with keyboard support
  const { currentSlide, goToSlide, setCurrentSlide } = useSlideNavigation({
    slideCount: slides.length,
    onInteraction: () => {},
  });

  // Auto-rotation with progress
  const { isPaused, progress, handleInteraction } = useAutoRotation({
    slideCount: slides.length,
    currentSlide,
    onSlideChange: setCurrentSlide,
    settings: DEFAULT_SLIDE_SETTINGS,
    isEditMode: false, // Always in display mode
  });

  // Load saved widgets only once
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWidgets(parsed);
      } catch (e) {
        // Failed to load saved widgets - using defaults
      }
    }
  }, []);

  // Memoized interaction handler (no ESC reminder on click)
  const handleUserInteraction = useCallback(() => {
    handleInteraction();
  }, [handleInteraction]);

  // Keyboard navigation handler
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // ESC - exit to dashboard
      if (event.key === "Escape") {
        router.push("/dashboard");
        return;
      }

      // S key or Menu key - open settings
      if (
        event.key === "s" ||
        event.key === "S" ||
        event.key === "ContextMenu"
      ) {
        event.preventDefault();
        router.push("/dashboard/settings/tv");
        return;
      }

      // Arrow keys - navigate slides
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToSlide(currentSlide > 0 ? currentSlide - 1 : slides.length - 1);
        handleInteraction();
      } else if (event.key === "ArrowRight" || event.key === "Enter") {
        event.preventDefault();
        goToSlide(currentSlide < slides.length - 1 ? currentSlide + 1 : 0);
        handleInteraction();
      }

      // Show settings hint on any non-navigation key
      if (
        !event.key.startsWith("Arrow") &&
        event.key !== "Enter" &&
        event.key !== "Escape" &&
        event.key !== "s" &&
        event.key !== "S" &&
        !event.key.startsWith("F") &&
        event.key !== "Tab"
      ) {
        setShowSettingsHint(true);
        setTimeout(() => setShowSettingsHint(false), 3000);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, slides.length, goToSlide, handleInteraction, router]);

  // Navigate to settings
  const handleSettingsClick = useCallback(() => {
    router.push("/dashboard/settings/tv");
  }, [router]);

  const widgetData = useMemo(
    () => ({
      technicians: mockTechnicians,
      companyGoals: {
        monthlyRevenue: 500_000,
        currentRevenue: 387_450,
        avgTicketGoal: 475,
        currentAvgTicket: 454,
        customerRatingGoal: 4.8,
        currentRating: 4.78,
      },
      topPerformer: {
        name: mockTechnicians[0].name,
        avatar: mockTechnicians[0].avatar,
        revenue: mockTechnicians[0].stats.revenue,
        revenueChange: mockTechnicians[0].stats.revenueChange,
        jobsCompleted: mockTechnicians[0].stats.jobsCompleted,
        customerRating: mockTechnicians[0].stats.customerRating,
      },
      revenueTrend: {
        trend: [
          { day: "Mon", revenue: 8200 },
          { day: "Tue", revenue: 9500 },
          { day: "Wed", revenue: 7800 },
          { day: "Thu", revenue: 10_200 },
          { day: "Fri", revenue: 11_500 },
          { day: "Sat", revenue: 9800 },
          { day: "Sun", revenue: 8300 },
        ],
      },
      jobsCompleted: {
        total: mockTechnicians.reduce(
          (sum, tech) => sum + tech.stats.jobsCompleted,
          0
        ),
        change: 8.5,
      },
      avgTicket: {
        value: Math.round(
          mockTechnicians.reduce((sum, tech) => sum + tech.stats.avgTicket, 0) /
            mockTechnicians.length
        ),
        change: 4.2,
      },
      customerRating: {
        rating:
          Math.round(
            (mockTechnicians.reduce(
              (sum, tech) => sum + tech.stats.customerRating,
              0
            ) /
              mockTechnicians.length) *
              10
          ) / 10,
        change: 2.1,
      },
      dailyStats: {
        revenue: 12_500,
        jobs: 28,
        avgTicket: 446,
        rating: 4.8,
      },
      weeklyStats: {
        revenue: 65_300,
        jobs: 142,
        avgTicket: 460,
        rating: 4.8,
      },
      monthlyStats: {
        revenue: 387_450,
        jobs: 444,
        avgTicket: 872,
        rating: 4.78,
      },
    }),
    []
  );

  return (
    <div
      className="fixed inset-0 z-40 flex overflow-hidden bg-background"
      onClick={handleUserInteraction}
    >
      {/* Main content area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Settings button - dashboard style */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            className="opacity-40 transition-opacity hover:opacity-100"
            onClick={handleSettingsClick}
            size="sm"
            title="Settings (Press S)"
            variant="outline"
          >
            <Settings className="mr-2 size-4" />
            Settings
          </Button>
        </div>

        {/* Carousel */}
        <div className="relative flex-1 overflow-hidden pb-20">
          <div className="h-full">
            <SlideCarousel
              currentSlide={currentSlide}
              data={widgetData}
              isEditMode={false}
              onSlideChange={setCurrentSlide}
              onWidgetsChange={() => {}}
              slides={slides}
            />
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute right-0 bottom-6 left-0">
          <SlideIndicators
            currentSlide={currentSlide}
            onSlideClick={goToSlide}
            slideCount={slides.length}
          />
        </div>

        {/* Progress ring */}
        <ProgressRing isPaused={isPaused} progress={progress} />
      </div>

      {/* Settings hint */}
      {showSettingsHint && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-8">
          <div className="fade-in slide-in-from-top-4 flex animate-in items-center gap-3 rounded-full border border-primary/30 bg-gradient-to-r from-background/95 to-background/90 px-6 py-3 shadow-2xl backdrop-blur-md duration-200">
            <kbd className="flex size-10 items-center justify-center rounded-lg border border-primary/40 bg-primary/20 font-bold font-mono text-primary text-sm shadow-inner">
              S
            </kbd>
            <span className="font-medium text-sm">
              Press S to open settings
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
