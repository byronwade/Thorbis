"use client";

/**
 * Tv Leaderboard Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { useEffect, useState, useCallback } from "react";
import { Edit3, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlideCarousel } from "@/components/tv-leaderboard/slide-carousel";
import { SlideIndicators } from "@/components/tv-leaderboard/slide-indicators";
import { ProgressRing } from "@/components/tv-leaderboard/progress-ring";
import { SlideSidebar } from "@/components/tv-leaderboard/slide-sidebar";
import { WidgetManager } from "@/components/tv-leaderboard/widget-manager";
import { useSlideDistribution } from "@/components/tv-leaderboard/hooks/use-slide-distribution";
import { useSlideNavigation } from "@/components/tv-leaderboard/hooks/use-slide-navigation";
import { useAutoRotation } from "@/components/tv-leaderboard/hooks/use-auto-rotation";
import type { Widget } from "@/components/tv-leaderboard/widget-types";
import { DEFAULT_SLIDE_SETTINGS, STORAGE_KEY_SLIDES } from "@/components/tv-leaderboard/slide-types";

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
      revenue: 45280,
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
      revenue: 42150,
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
      revenue: 39800,
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
      revenue: 38200,
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
      revenue: 36500,
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
  { id: "jobs-completed-1", type: "jobs-completed", size: "small", position: 4 },
  { id: "avg-ticket-1", type: "avg-ticket", size: "small", position: 5 },
  { id: "customer-rating-1", type: "customer-rating", size: "small", position: 6 },
];

const STORAGE_KEY = "tv-leaderboard-widgets";

export default function TVLeaderboardPage() {  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showEscReminder, setShowEscReminder] = useState(false);

  // Auto-distribute widgets into slides
  const slides = useSlideDistribution(widgets);

  // Slide navigation with keyboard support
  const { currentSlide, goToSlide, setCurrentSlide } = useSlideNavigation({
    slideCount: slides.length,
    onInteraction: handleUserInteraction,
  });

  // Auto-rotation with progress
  const { isPaused, progress, handleInteraction } = useAutoRotation({
    slideCount: slides.length,
    currentSlide,
    onSlideChange: setCurrentSlide,
    settings: DEFAULT_SLIDE_SETTINGS,
    isEditMode,
  });

  // Load saved widgets
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setWidgets(JSON.parse(saved));
      } catch (e) {
        // Failed to load saved widgets - using defaults
      }
    }
  }, []);

  function handleUserInteraction() {
    setShowEscReminder(true);
    handleInteraction();
    setTimeout(() => {
      setShowEscReminder(false);
    }, 2000);
  }

  // ESC key handler
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        window.history.back();
      } else if (!event.key.startsWith("Arrow")) {
        // Show reminder on any key press except ESC and arrow keys
        handleUserInteraction();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSlideWidgetsChange = useCallback(
    (slideId: string, updatedWidgets: Widget[]) => {
      // Find the slide and update its widgets
      const slideIndex = slides.findIndex((s) => s.id === slideId);
      if (slideIndex === -1) {
        return;
      }

      // Rebuild the full widget list
      const newWidgets = slides.flatMap((slide, idx) =>
        idx === slideIndex ? updatedWidgets : slide.widgets
      );

      setWidgets(newWidgets);
      setHasUnsavedChanges(true);
    },
    [slides]
  );

  function handleSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    localStorage.setItem(STORAGE_KEY_SLIDES, JSON.stringify(slides));
    setHasUnsavedChanges(false);
    setIsEditMode(false);
  }

  function handleAddWidget(widget: Widget) {
    setWidgets([...widgets, widget]);
    setHasUnsavedChanges(true);
  }

  const widgetData = {
    technicians: mockTechnicians,
    companyGoals: {
      monthlyRevenue: 500000,
      currentRevenue: 387450,
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
        { day: "Thu", revenue: 10200 },
        { day: "Fri", revenue: 11500 },
        { day: "Sat", revenue: 9800 },
        { day: "Sun", revenue: 8300 },
      ],
    },
    jobsCompleted: {
      total: mockTechnicians.reduce((sum, tech) => sum + tech.stats.jobsCompleted, 0),
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
          (mockTechnicians.reduce((sum, tech) => sum + tech.stats.customerRating, 0) /
            mockTechnicians.length) *
            10
        ) / 10,
      change: 2.1,
    },
    dailyStats: {
      revenue: 12500,
      jobs: 28,
      avgTicket: 446,
      rating: 4.8,
    },
    weeklyStats: {
      revenue: 65300,
      jobs: 142,
      avgTicket: 460,
      rating: 4.8,
    },
    monthlyStats: {
      revenue: 387450,
      jobs: 444,
      avgTicket: 872,
      rating: 4.78,
    },
  };

  return (
    <div
      className="fixed inset-0 flex overflow-hidden bg-background"
      onClick={handleUserInteraction}
    >
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Edit mode: Show slide sidebar */}
      {isEditMode && (
        <SlideSidebar
          currentSlide={currentSlide}
          onSlideClick={(index) => {
            goToSlide(index);
          }}
          slides={slides}
        />
      )}

      {/* Main content area */}
      <div className="relative flex flex-1 flex-col">
        {/* Floating controls */}
        {!isEditMode ? (
          <div className="absolute top-4 right-4 z-50">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditMode(true);
              }}
              size="lg"
              variant="outline"
            >
              <Edit3 className="mr-2 size-4" />
              Edit Layout
            </Button>
          </div>
        ) : (
          <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
            <WidgetManager onAddWidget={handleAddWidget} />
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              size="lg"
              variant="default"
            >
              <Save className="mr-2 size-4" />
              Save Layout
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditMode(false);
                setHasUnsavedChanges(false);
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                  setWidgets(JSON.parse(saved));
                }
              }}
              size="lg"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Carousel */}
        <div className="relative flex-1">
          <SlideCarousel
            currentSlide={currentSlide}
            data={widgetData}
            isEditMode={isEditMode}
            onSlideChange={setCurrentSlide}
            onWidgetsChange={handleSlideWidgetsChange}
            slides={slides}
          />
        </div>

        {/* Slide indicators */}
        {!isEditMode && (
          <SlideIndicators
            currentSlide={currentSlide}
            onSlideClick={goToSlide}
            slideCount={slides.length}
          />
        )}

        {/* Progress ring */}
        {!isEditMode && <ProgressRing isPaused={isPaused} progress={progress} />}
      </div>

      {/* ESC reminder */}
      {showEscReminder && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-8">
          <div className="animate-in fade-in slide-in-from-top-4 flex items-center gap-3 rounded-full border border-primary/30 bg-gradient-to-r from-background/95 to-background/90 px-6 py-3 shadow-2xl backdrop-blur-md duration-200">
            <kbd className="flex size-10 items-center justify-center rounded-lg border border-primary/40 bg-primary/20 font-mono font-bold text-primary text-sm shadow-inner">
              ESC
            </kbd>
            <span className="font-medium text-sm">Press ESC to exit full-screen</span>
          </div>
        </div>
      )}

      {/* Unsaved changes indicator */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-8 left-8 z-40">
          <Badge className="bg-yellow-500/90 text-white" variant="secondary">
            Unsaved changes
          </Badge>
        </div>
      )}
    </div>
  );
}
