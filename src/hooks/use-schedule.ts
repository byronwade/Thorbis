import { useCallback, useEffect, useMemo } from "react";
import type { Job, Technician } from "@/components/schedule/schedule-types";
import { filterJobs, sortJobsByStartTime } from "@/lib/schedule-utils";
import { useScheduleStore } from "@/stores/schedule-store";
import { useViewStore } from "@/stores/view-store";

/**
 * Custom hook for managing schedule data
 */

// Track if we've already initiated a load to prevent multiple simultaneous loads
let loadingPromise: Promise<void> | null = null;

export function useSchedule() {
  // Use granular selectors to avoid closure issues
  const isLoading = useScheduleStore((state) => state.isLoading);
  const error = useScheduleStore((state) => state.error);
  const lastSync = useScheduleStore((state) => state.lastSync);
  const jobs = useScheduleStore((state) => state.jobs);
  const technicians = useScheduleStore((state) => state.technicians);
  const selectedJobId = useScheduleStore((state) => state.selectedJobId);
  const selectedTechnicianId = useScheduleStore(
    (state) => state.selectedTechnicianId
  );

  // Get actions
  const setLoading = useScheduleStore((state) => state.setLoading);
  const setError = useScheduleStore((state) => state.setError);
  const setJobs = useScheduleStore((state) => state.setJobs);
  const setTechnicians = useScheduleStore((state) => state.setTechnicians);
  const selectJob = useScheduleStore((state) => state.selectJob);
  const selectTechnician = useScheduleStore((state) => state.selectTechnician);
  const addJob = useScheduleStore((state) => state.addJob);
  const updateJob = useScheduleStore((state) => state.updateJob);
  const moveJob = useScheduleStore((state) => state.moveJob);
  const deleteJob = useScheduleStore((state) => state.deleteJob);
  const duplicateJob = useScheduleStore((state) => state.duplicateJob);
  const getJobById = useScheduleStore((state) => state.getJobById);
  const syncWithServer = useScheduleStore((state) => state.syncWithServer);

  // Get view store values with selectors to avoid re-renders
  const filters = useViewStore((state) => state.filters);
  const showCompletedJobs = useViewStore((state) => state.showCompletedJobs);
  const currentDate = useViewStore((state) => state.currentDate);
  const zoom = useViewStore((state) => state.zoom);

  // Calculate visible time range once
  const visibleTimeRange = useMemo(
    () => useViewStore.getState().getVisibleTimeRange(),
    [currentDate, zoom]
  );

  // Load initial data - ONLY ONCE ON MOUNT
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // If already loaded or currently loading, skip
      if (jobs.size > 0) {
        return;
      }

      // If another instance is already loading, wait for it
      if (loadingPromise) {
        await loadingPromise;
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/schedule");
        if (!isMounted) return;

        if (!response.ok) throw new Error("Failed to fetch schedule");

        const result = await response.json();
        if (!isMounted) return;

        if (result.success) {
          // Convert date strings back to Date objects recursively
          const convertedJobs = result.data.jobs.map((job: any) => {
            const convertedJob = {
              ...job,
              startTime: new Date(job.startTime),
              endTime: new Date(job.endTime),
              createdAt: new Date(job.createdAt),
              updatedAt: new Date(job.updatedAt),
              customer: {
                ...job.customer,
                createdAt: new Date(job.customer.createdAt),
                updatedAt: new Date(job.customer.updatedAt),
              },
            };

            if (convertedJob.recurrence?.endDate) {
              convertedJob.recurrence.endDate = new Date(
                convertedJob.recurrence.endDate
              );
            }

            return convertedJob;
          });

          const convertedTechnicians = result.data.technicians.map(
            (tech: any) => {
              const convertedTech = {
                ...tech,
                createdAt: new Date(tech.createdAt),
                updatedAt: new Date(tech.updatedAt),
              };

              if (convertedTech.schedule?.daysOff) {
                convertedTech.schedule.daysOff =
                  convertedTech.schedule.daysOff.map(
                    (date: any) => new Date(date)
                  );
              }

              return convertedTech;
            }
          );

          if (!isMounted) return;

          setJobs(convertedJobs);
          setTechnicians(convertedTechnicians);
        }
      } catch (error) {
        if (!isMounted) return;
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        if (!isMounted) return;
        setLoading(false);
        loadingPromise = null;
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []); // Empty array - only run once on mount!

  // Get filtered and sorted jobs - MEMOIZED
  const filteredJobs = useMemo((): Job[] => {
    const allJobs = Array.from(jobs.values());

    // Apply view filters
    const filtered = filterJobs(allJobs, {
      technicianIds: filters.technicianIds,
      statuses: filters.statuses,
      priorities: filters.priorities,
      searchQuery: filters.searchQuery,
    });

    // Filter by completed jobs visibility
    const visible = showCompletedJobs
      ? filtered
      : filtered.filter((job) => job.status !== "completed");

    // Sort by start time
    return sortJobsByStartTime(visible);
  }, [jobs, filters, showCompletedJobs]);

  // Get filtered technicians - MEMOIZED
  const filteredTechnicians = useMemo((): Technician[] => {
    const allTechnicians = Array.from(technicians.values());

    // If technician filter is active, only show filtered technicians
    if (filters.technicianIds.length > 0) {
      return allTechnicians.filter((tech) =>
        filters.technicianIds.includes(tech.id)
      );
    }

    return allTechnicians;
  }, [technicians, filters.technicianIds]);

  // Get jobs for a specific technician
  const getJobsForTechnician = useCallback(
    (technicianId: string): Job[] =>
      filteredJobs.filter((job) => job.technicianId === technicianId),
    [filteredJobs]
  );

  // Get jobs within visible time range - MEMOIZED
  const visibleJobs = useMemo((): Job[] => {
    const { start, end } = visibleTimeRange;

    return filteredJobs.filter((job) => {
      // Job overlaps with visible range
      return job.startTime <= end && job.endTime >= start;
    });
  }, [filteredJobs, visibleTimeRange]);

  return {
    // State
    isLoading,
    error,
    lastSync,

    // Data
    technicians: filteredTechnicians,
    jobs: filteredJobs,
    visibleJobs,

    // Selection
    selectedJobId,
    selectedTechnicianId,
    selectedJob: selectedJobId ? getJobById(selectedJobId) : null,

    // Actions
    getJobsForTechnician,
    selectJob,
    selectTechnician,

    // Mutations
    addJob,
    updateJob,
    moveJob,
    deleteJob,
    duplicateJob,

    // Sync
    refresh: syncWithServer,
  };
}

/**
 * Hook for real-time schedule updates
 * TODO: Implement WebSocket connection
 */
export function useScheduleRealtime() {
  const scheduleStore = useScheduleStore();

  useEffect(() => {
    // TODO: Setup WebSocket connection
    // const ws = new WebSocket('wss://api.example.com/schedule')
    // ws.onmessage = (event) => {
    //   const update = JSON.parse(event.data)
    //   handleScheduleUpdate(update)
    // }
    // return () => ws.close()
  }, []);

  return {
    isConnected: false,
    lastUpdate: scheduleStore.lastSync,
  };
}

/**
 * Hook for schedule statistics
 */
export function useScheduleStats() {
  const { technicians, jobs, visibleJobs } = useSchedule();

  const stats = {
    totalTechnicians: technicians.length,
    totalJobs: jobs.length,
    visibleJobs: visibleJobs.length,
    scheduledJobs: jobs.filter((j) => j.status === "scheduled").length,
    inProgressJobs: jobs.filter((j) => j.status === "in-progress").length,
    completedJobs: jobs.filter((j) => j.status === "completed").length,
    cancelledJobs: jobs.filter((j) => j.status === "cancelled").length,
    urgentJobs: jobs.filter((j) => j.priority === "urgent").length,
  };

  return stats;
}
