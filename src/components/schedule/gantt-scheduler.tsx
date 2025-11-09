"use client";

/**
 * Gantt Scheduler Component
 * Main component for the Gantt-style scheduler view
 */

import { useMemo } from "react";
import { useSchedule } from "@/hooks/use-schedule";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { HourlyTimeGrid } from "./hourly-time-grid";
import { WeekTimeGrid } from "./week-time-grid";
import { MonthTimeGrid } from "./month-time-grid";
import { TechnicianSidebar } from "./technician-sidebar";
import { useGanttSchedulerStore } from "@/lib/stores/gantt-scheduler-store";
import type { Job } from "./schedule-types";

export function GanttScheduler() {
  const {
    technicians,
    getJobsForTechnician,
    selectJob,
    selectedJobId,
    isLoading,
    error,
  } = useSchedule();

  // Get state from store (shared with toolbar)
  const {
    currentDate,
    view,
    selectedTechnicianId,
    statusFilter,
  } = useGanttSchedulerStore();

  // Filter technicians if needed
  const filteredTechnicians = useMemo(() => {
    if (!selectedTechnicianId) return technicians;
    return technicians.filter((t) => t.id === selectedTechnicianId);
  }, [technicians, selectedTechnicianId]);

  // Get date range based on view type
  const dateRange = useMemo(() => {
    if (view === "day") {
      const start = new Date(currentDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(currentDate);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      start.setHours(0, 0, 0, 0);
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      end.setHours(23, 59, 59, 999);
      return { start, end };
    } else {
      // month
      const start = startOfMonth(currentDate);
      start.setHours(0, 0, 0, 0);
      const end = endOfMonth(currentDate);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  }, [currentDate, view]);

  // Get jobs for selected technician or all technicians, filtered by date range and status
  const getJobsForDisplay = (technicianId: string): Job[] => {
    const jobs = getJobsForTechnician(technicianId);
    
    // Filter by date range
    let filtered = jobs.filter((job) => {
      const jobStart = new Date(job.startTime);
      const jobEnd = new Date(job.endTime);
      return jobStart <= dateRange.end && jobEnd >= dateRange.start;
    });
    
    // Filter by status if set
    if (statusFilter) {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }
    
    return filtered;
  };

  // Get job count for a technician
  const getJobCount = (technicianId: string): number => {
    return getJobsForDisplay(technicianId).length;
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-muted-foreground">Loading schedule...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-destructive">Error loading schedule</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Technician Sidebar */}
        <TechnicianSidebar
          technicians={filteredTechnicians}
          selectedTechnicianId={selectedTechnicianId}
          onTechnicianSelect={setSelectedTechnicianId}
          getJobCount={getJobCount}
          multiRowMode={!selectedTechnicianId}
        />

        {/* Time Grid Area */}
        <div className="flex-1 overflow-hidden">
          {selectedTechnicianId ? (
            // Single technician view
            <>
              {view === "day" && (
                <HourlyTimeGrid
                  date={currentDate}
                  jobs={getJobsForDisplay(selectedTechnicianId)}
                  selectedJobId={selectedJobId}
                  onJobClick={selectJob}
                />
              )}
              {view === "week" && (
                <WeekTimeGrid
                  date={currentDate}
                  jobs={getJobsForDisplay(selectedTechnicianId)}
                  selectedJobId={selectedJobId}
                  onJobClick={selectJob}
                />
              )}
              {view === "month" && (
                <MonthTimeGrid
                  date={currentDate}
                  jobs={getJobsForDisplay(selectedTechnicianId)}
                  selectedJobId={selectedJobId}
                  onJobClick={selectJob}
                />
              )}
            </>
          ) : (
            // Multi-technician view - show grid for each technician
            <div className="flex h-full flex-col overflow-y-auto">
              {filteredTechnicians.map((technician) => {
                const jobs = getJobsForDisplay(technician.id);
                const rowHeight = view === "month" ? "auto" : "200px";
                return (
                  <div
                    className="flex flex-col border-b"
                    key={technician.id}
                    style={{ minHeight: rowHeight, height: rowHeight }}
                  >
                    {/* Technician Header */}
                    <div className="flex h-10 shrink-0 items-center border-b bg-muted/30 px-4">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">
                          {technician.name}
                        </h4>
                        <span className="text-muted-foreground text-xs">
                          {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
                        </span>
                      </div>
                    </div>

                    {/* Time Grid */}
                    <div className="flex-1" style={{ height: view === "month" ? "auto" : "150px" }}>
                      {view === "day" && (
                        <HourlyTimeGrid
                          date={currentDate}
                          jobs={jobs}
                          selectedJobId={selectedJobId}
                          onJobClick={selectJob}
                        />
                      )}
                      {view === "week" && (
                        <WeekTimeGrid
                          date={currentDate}
                          jobs={jobs}
                          selectedJobId={selectedJobId}
                          onJobClick={selectJob}
                        />
                      )}
                      {view === "month" && (
                        <MonthTimeGrid
                          date={currentDate}
                          jobs={jobs}
                          selectedJobId={selectedJobId}
                          onJobClick={selectJob}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

