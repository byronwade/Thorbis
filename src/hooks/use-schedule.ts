import { useCallback, useEffect, useMemo, useRef } from "react";
import type { Job, Technician } from "@/components/schedule/schedule-types";
import { fetchScheduleData } from "@/lib/schedule-data";
import { filterJobs, sortJobsByStartTime } from "@/lib/schedule-utils";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import { useViewStore } from "@/lib/stores/view-store";
import { createClient } from "@/lib/supabase/client";

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
  const lastFetchedRange = useScheduleStore((state) => state.lastFetchedRange);
  const storeCompanyId = useScheduleStore((state) => state.companyId);

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
  const setLastSync = useScheduleStore((state) => state.setLastSync);
  const setCompanyId = useScheduleStore((state) => state.setCompanyId);
  const setLastFetchedRange = useScheduleStore(
    (state) => state.setLastFetchedRange
  );
  const getUnassignedJobsFromStore = useScheduleStore(
    (state) => state.getUnassignedJobs
  );
  const getJobsGroupedByTechnicianFromStore = useScheduleStore(
    (state) => state.getJobsGroupedByTechnician
  );

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

  const rangeStart = visibleTimeRange.start.getTime();
  const rangeEnd = visibleTimeRange.end.getTime();
  const companyIdRef = useRef<string | null>(
    useScheduleStore.getState().companyId
  );

  useEffect(() => {
    companyIdRef.current = storeCompanyId;
  }, [storeCompanyId]);

  const jobCount = jobs.size;

  const hasCoverage = useMemo(() => {
    if (!lastFetchedRange || jobCount === 0) {
      return false;
    }

    const fetchedStart = lastFetchedRange.start.getTime();
    const fetchedEnd = lastFetchedRange.end.getTime();

    return fetchedStart <= rangeStart && fetchedEnd >= rangeEnd;
  }, [jobCount, lastFetchedRange, rangeEnd, rangeStart]);

  useEffect(() => {
    let isMounted = true;

    if (hasCoverage && companyIdRef.current) {
      return () => {
        isMounted = false;
      };
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();

        if (!supabase) {
          throw new Error("Database connection not available");
        }

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!user) {
          throw new Error("User session not found");
        }

        let companyId = companyIdRef.current;

        if (!companyId) {
          const { data: membership, error: membershipError } = await supabase
            .from("team_members")
            .select("company_id")
            .eq("user_id", user.id)
            .eq("status", "active")
            .order("joined_at", { ascending: false, nullsFirst: false })
            .limit(1)
            .maybeSingle();

          if (membershipError) {
            throw membershipError;
          }

          if (!membership?.company_id) {
            throw new Error("No active company membership found");
          }

          companyId = membership.company_id;
          companyIdRef.current = companyId;
          setCompanyId(companyId);
        }

        if (!companyId) {
          throw new Error(
            "Unable to resolve company context for schedule data"
          );
        }

        const { jobs: convertedJobs, technicians: convertedTechnicians } =
          await fetchScheduleData({
            supabase,
            companyId,
            range: {
              start: new Date(rangeStart),
              end: new Date(rangeEnd),
            },
          });

        if (!isMounted) {
          return;
        }

        setTechnicians(convertedTechnicians);
        setJobs(convertedJobs);
        const fetchedRange = {
          start: new Date(rangeStart),
          end: new Date(rangeEnd),
        };

        setTechnicians(convertedTechnicians);
        setJobs(convertedJobs);
        setLastSync(new Date());
        setLastFetchedRange(fetchedRange);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "object" && error !== null && "message" in error
              ? String((error as { message: string }).message)
              : "Unknown error";
        setError(errorMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [
    hasCoverage,
    rangeEnd,
    rangeStart,
    setCompanyId,
    setLastFetchedRange,
    setError,
    setJobs,
    setLastSync,
    setLoading,
    setTechnicians,
  ]);

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

  // Get all jobs (unfiltered)
  const getAllJobs = useCallback(
    (): Job[] => Array.from(jobs.values()),
    [jobs]
  );

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
    getAllJobs,
    selectJob,
    selectTechnician,
    getUnassignedJobs: getUnassignedJobsFromStore,
    getJobsGroupedByTechnician: getJobsGroupedByTechnicianFromStore,

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
