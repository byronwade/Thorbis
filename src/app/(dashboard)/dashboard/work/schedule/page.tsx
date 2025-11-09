"use client";

/**
 * Schedule Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 * - Uses Zustand for schedule view state (no Context Provider needed)
 */

/**
 * Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Mock data defined on server (will be replaced with real DB queries)
 * - Only interactive table/chart components are client-side
 * - Better SEO and initial page load performance
 */

import { TimelineViewV2 } from "@/components/schedule/timeline-view-v2";
// import { ListView } from "@/components/schedule/list-view"
// import { CalendarView } from "@/components/schedule/calendar-view"
// import { MapView } from "@/components/schedule/map-view"
import { GanttScheduler } from "@/components/schedule/gantt-scheduler";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { TestSchedule } from "./test-schedule";

export default function SchedulePage() {
  const view = useScheduleViewStore((state) => state.view);

  return (
    <div className="h-full w-full overflow-hidden">
      {view === "gantt" && <GanttScheduler />}
      {view === "timeline" && <TimelineViewV2 />}
      {view === "test" && <TestSchedule />}
      {/* Temporarily disabled old views that use deprecated data model */}
      {/* {view === "list" && <ListView />} */}
      {/* {view === "calendar" && <CalendarView />} */}
      {/* {view === "map" && <MapView />} */}
    </div>
  );
}
