import { useCallback, useEffect, useMemo, useRef } from "react";
import type { Job, Technician } from "@/components/schedule/schedule-types";
import { filterJobs, sortJobsByStartTime } from "@/lib/schedule-utils";
import { createClient } from "@/lib/supabase/client";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import { useViewStore } from "@/lib/stores/view-store";

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

  // Track if we've loaded to prevent infinite loops
  const hasLoadedRef = useRef(false);

  // Load initial data - ONLY ONCE ON MOUNT
  useEffect(() => {
    // Prevent multiple loads
    if (hasLoadedRef.current) {
      return;
    }

    let isMounted = true;

    const loadData = async () => {
      // If already loaded, skip
      const currentJobs = useScheduleStore.getState().jobs;
      if (currentJobs.size > 0) {
        hasLoadedRef.current = true;
        setLoading(false);
        return;
      }

      // If another instance is already loading, wait for it
      if (loadingPromise) {
        await loadingPromise;
        hasLoadedRef.current = true;
        setLoading(false);
        return;
      }

      // Mark as loading to prevent duplicate loads
      hasLoadedRef.current = true;

      // Create and store the loading promise
      loadingPromise = (async () => {
        try {
          setLoading(true);
          setError(null);

          const supabase = createClient();

          if (!supabase) {
            throw new Error("Database connection not available");
          }

          // Fetch schedules from Supabase
          const { data: schedules, error: schedulesError } = await supabase
            .from("schedules")
            .select(`
              *,
              customer:customers(first_name, last_name, email, phone),
              job:jobs(job_number, title)
            `)
            .is("deleted_at", null)
            .order("start_time", { ascending: true });

          if (!isMounted) {
            setLoading(false);
            return;
          }

          if (schedulesError) throw schedulesError;

          // Try to load team members, but don't fail if it doesn't work
          // This is wrapped in try-catch so schedule loading can continue even if team members fail
          try {
            const {
              data: { user },
            } = await supabase.auth.getUser();

            if (user) {
              // Get user's company - use maybeSingle() to avoid error if no record exists
              const { data: userTeamMember } = await supabase
                .from("team_members")
                .select("company_id")
                .eq("user_id", user.id)
                .eq("status", "active")
                .maybeSingle();

              if (userTeamMember?.company_id) {
                // Fetch team members (technicians) for the user's company
                const { data: teamMembers } = await supabase
                  .from("team_members")
                  .select(`
                    *,
                    users!team_members_user_id_fkey (
                      id,
                      name,
                      email,
                      avatar_url,
                      phone
                    )
                  `)
                  .eq("company_id", userTeamMember.company_id)
                  .eq("status", "active");

              if (teamMembers && teamMembers.length > 0) {
                // Convert team members to Technician format
                const convertedTechnicians = teamMembers.map((member: any) => ({
                  id: member.user_id,
                  name: member.users?.name || member.job_title || "Team Member",
                  email: member.users?.email || "",
                  phone: member.users?.phone || member.phone || "",
                  avatar: member.users?.avatar_url || member.avatar_url,
                  color: "#3B82F6",
                  role: member.job_title || "Team Member",
                  isActive: member.status === "active",
                  status: "available" as const,
                  schedule: {
                    workingHours: { start: "08:00", end: "17:00" },
                    daysOff: [],
                    availableHours: { start: 0, end: 40 },
                  },
                  createdAt: new Date(member.created_at),
                  updatedAt: new Date(member.updated_at),
                }));

                if (isMounted) {
                  setTechnicians(convertedTechnicians);
                }
              } else if (isMounted) {
                setTechnicians([]);
              }
            } else if (isMounted) {
              setTechnicians([]);
            }
          } else if (isMounted) {
            setTechnicians([]);
          }
        } catch (teamError) {
          // Silently fail - team members are optional for schedule display
          console.warn("Failed to load team members (non-critical):", teamError);
          if (isMounted) {
            setTechnicians([]);
          }
        }

        // Convert schedules to Job format (filter out jobs without customers)
        const convertedJobs = (schedules || [])
          .filter((schedule: any) => schedule.customer)
          .map((schedule: any) => ({
            id: schedule.id,
            technicianId: schedule.assigned_to || "",
            customerId: schedule.customer_id || "",
            customer: {
              id: schedule.customer_id,
              name: `${schedule.customer.first_name || ""} ${schedule.customer.last_name || ""}`.trim(),
              email: schedule.customer.email,
              phone: schedule.customer.phone,
              location: {
                address: {
                  street: "",
                  city: "",
                  state: "",
                  zip: "",
                  country: "",
                },
                coordinates: {
                  lat: 0,
                  lng: 0,
                },
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            location: {
              address: {
                street: "",
                city: "",
                state: "",
                zip: "",
                country: "",
              },
              coordinates: {
                lat: 0,
                lng: 0,
              },
            },
            title: schedule.title || "",
            description: schedule.description || "",
            status: schedule.status || "scheduled",
            priority: schedule.priority || "normal",
            startTime: new Date(schedule.start_time),
            endTime: new Date(schedule.end_time),
            notes: schedule.notes || "",
            metadata: {},
            createdAt: new Date(schedule.created_at),
            updatedAt: new Date(schedule.updated_at),
          }));

          if (!isMounted) {
            setLoading(false);
            return;
          }

          setJobs(convertedJobs);
        } catch (error) {
          if (!isMounted) {
            setLoading(false);
            return;
          }
          let errorMessage = "Unknown error";
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === "object" && error !== null && "message" in error) {
            errorMessage = String(error.message);
          }
          console.error("Schedule loading error:", error);
          setError(errorMessage);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
          loadingPromise = null;
        }
      })();

      await loadingPromise;
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
