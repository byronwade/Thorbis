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

import { useEffect, useState } from "react";
import { TimelineViewV2 } from "@/components/schedule/timeline-view-v2";
// import { ListView } from "@/components/schedule/list-view"
// import { CalendarView } from "@/components/schedule/calendar-view"
// import { MapView } from "@/components/schedule/map-view"
import { GanttScheduler } from "@/components/schedule/gantt-scheduler";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { TestSchedule } from "./test-schedule";

export default function SchedulePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-muted-foreground">Loading schedule...</div>
      </div>
    );
  }

  // Only access Zustand store after component mounts (client-side only)
  // This prevents useSyncExternalStore from being called during SSR
  return <ScheduleContent />;
}

function ScheduleContent() {
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
