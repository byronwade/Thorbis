import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Job, Technician } from "@/components/schedule/schedule-types";
import type { ScheduleHydrationPayload } from "@/lib/schedule-bootstrap";
import { fetchScheduleData } from "@/lib/schedule-data";
import { createClient } from "@/lib/supabase/client";

type ScheduleState = {
	// Data
	technicians: Map<string, Technician>;
	jobs: Map<string, Job>;
	companyId: string | null;
	lastFetchedRange: { start: Date; end: Date } | null;

	// Loading states
	isLoading: boolean;
	error: string | null;
	lastSync: Date | null;

	// Selection
	selectedJobId: string | null;
	selectedTechnicianId: string | null;

	// Actions - Technicians
	setTechnicians: (technicians: Technician[]) => void;
	addTechnician: (technician: Technician) => void;
	updateTechnician: (id: string, updates: Partial<Technician>) => void;
	removeTechnician: (id: string) => void;

	// Actions - Jobs
	setJobs: (jobs: Job[]) => void;
	addJob: (job: Job) => void;
	updateJob: (jobId: string, updates: Partial<Job>) => void;
	moveJob: (jobId: string, newTechnicianId: string, newStartTime: Date, newEndTime: Date) => void;
	deleteJob: (jobId: string) => void;
	duplicateJob: (jobId: string, newStartTime: Date) => void;

	// Actions - Selection
	selectJob: (jobId: string | null) => void;
	selectTechnician: (technicianId: string | null) => void;

	// Actions - Bulk operations
	bulkUpdateJobs: (updates: Array<{ jobId: string; updates: Partial<Job> }>) => void;
	bulkDeleteJobs: (jobIds: string[]) => void;

	// Actions - Sync
	syncWithServer: () => Promise<void>;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	setLastSync: (timestamp: Date | null) => void;
	setCompanyId: (companyId: string | null) => void;
	setLastFetchedRange: (range: { start: Date; end: Date } | null) => void;

	// Helpers
	getJobsByTechnician: (technicianId: string) => Job[];
	getJobsByDateRange: (startDate: Date, endDate: Date) => Job[];
	getTechnicianById: (id: string) => Technician | undefined;
	getJobById: (id: string) => Job | undefined;
	hasConflict: (
		technicianId: string,
		startTime: Date,
		endTime: Date,
		excludeJobId?: string
	) => boolean;
	getUnassignedJobs: () => Job[];
	getJobsGroupedByTechnician: () => Record<string, Job[]>;
	hydrateFromServer: (payload: ScheduleHydrationPayload) => void;
};

export const useScheduleStore = create<ScheduleState>()(
	devtools(
		persist(
			(set, get) => ({
				// Initial state
				technicians: new Map(),
				jobs: new Map(),
				companyId: null,
				lastFetchedRange: null,
				isLoading: false,
				error: null,
				lastSync: null,
				selectedJobId: null,
				selectedTechnicianId: null,

				// Technician actions
				setTechnicians: (technicians) => {
					const techMap = new Map(technicians.map((t) => [t.id, t]));
					set({ technicians: techMap });
				},

				addTechnician: (technician) => {
					set((state) => {
						const newTechnicians = new Map(state.technicians);
						newTechnicians.set(technician.id, technician);
						return { technicians: newTechnicians };
					});
				},

				updateTechnician: (id, updates) => {
					set((state) => {
						const newTechnicians = new Map(state.technicians);
						const existing = newTechnicians.get(id);
						if (existing) {
							newTechnicians.set(id, { ...existing, ...updates });
						}
						return { technicians: newTechnicians };
					});
				},

				removeTechnician: (id) => {
					set((state) => {
						const newTechnicians = new Map(state.technicians);
						newTechnicians.delete(id);

						const newJobs = new Map(state.jobs);
						for (const [jobId, job] of newJobs) {
							const filteredAssignments = job.assignments.filter(
								(assignment) => assignment.technicianId !== id
							);

							if (filteredAssignments.length !== job.assignments.length) {
								newJobs.set(jobId, {
									...job,
									assignments: filteredAssignments,
									technicianId:
										filteredAssignments.find((assignment) => assignment.role === "primary")
											?.technicianId ?? "",
									isUnassigned: filteredAssignments.length === 0,
								});
							}
						}

						return {
							technicians: newTechnicians,
							jobs: newJobs,
							selectedTechnicianId:
								state.selectedTechnicianId === id ? null : state.selectedTechnicianId,
						};
					});
				},

				// Job actions
				setJobs: (jobs) => {
					const jobMap = new Map(jobs.map((j) => [j.id, j]));
					set({ jobs: jobMap });
				},

				addJob: (job) => {
					set((state) => {
						const newJobs = new Map(state.jobs);
						newJobs.set(job.id, job);
						return { jobs: newJobs };
					});
				},

				updateJob: (jobId, updates) => {
					set((state) => {
						const newJobs = new Map(state.jobs);
						const existing = newJobs.get(jobId);
						if (existing) {
							newJobs.set(jobId, { ...existing, ...updates });
						}
						return { jobs: newJobs };
					});
				},

				moveJob: (jobId, newTechnicianId, newStartTime, newEndTime) => {
					set((state) => {
						const newJobs = new Map(state.jobs);
						const existing = newJobs.get(jobId);
						if (existing) {
							const technician = state.technicians.get(newTechnicianId);
							const updatedAssignments =
								existing.assignments.length > 0
									? existing.assignments.map((assignment) =>
											assignment.role === "primary"
												? {
														...assignment,
														technicianId: newTechnicianId,
														teamMemberId: technician?.teamMemberId,
														displayName: technician?.name || assignment.displayName,
														avatar: technician?.avatar ?? assignment.avatar ?? null,
														status: technician?.status ?? assignment.status,
														isActive: technician?.isActive ?? true,
													}
												: assignment
										)
									: [
											{
												technicianId: newTechnicianId,
												teamMemberId: technician?.teamMemberId,
												displayName: technician?.name || "Primary Technician",
												avatar: technician?.avatar ?? null,
												role: "primary" as const,
												status: technician?.status ?? "available",
												isActive: true,
											},
										];

							newJobs.set(jobId, {
								...existing,
								technicianId: newTechnicianId,
								assignments: updatedAssignments,
								isUnassigned: updatedAssignments.length === 0,
								startTime: newStartTime,
								endTime: newEndTime,
							});
						}
						return { jobs: newJobs };
					});
				},

				deleteJob: (jobId) => {
					set((state) => {
						const newJobs = new Map(state.jobs);
						newJobs.delete(jobId);
						return {
							jobs: newJobs,
							selectedJobId: state.selectedJobId === jobId ? null : state.selectedJobId,
						};
					});
				},

				duplicateJob: (jobId, newStartTime) => {
					const job = get().jobs.get(jobId);
					if (!job) {
						return;
					}

					const duration = job.endTime.getTime() - job.startTime.getTime();
					const newEndTime = new Date(newStartTime.getTime() + duration);

					const newJob: Job = {
						...job,
						id: `${job.id}-copy-${Date.now()}`,
						startTime: newStartTime,
						endTime: newEndTime,
						status: "scheduled",
						assignments: job.assignments.map((assignment) => ({
							...assignment,
						})),
						createdAt: new Date(),
						updatedAt: new Date(),
					};

					get().addJob(newJob);
				},

				// Selection actions
				selectJob: (jobId) => set({ selectedJobId: jobId }),
				selectTechnician: (technicianId) => set({ selectedTechnicianId: technicianId }),

				// Bulk operations
				bulkUpdateJobs: (updates) => {
					set((state) => {
						const newJobs = new Map(state.jobs);
						updates.forEach(({ jobId, updates: jobUpdates }) => {
							const existing = newJobs.get(jobId);
							if (existing) {
								newJobs.set(jobId, { ...existing, ...jobUpdates });
							}
						});
						return { jobs: newJobs };
					});
				},

				bulkDeleteJobs: (jobIds) => {
					set((state) => {
						const newJobs = new Map(state.jobs);
						jobIds.forEach((id) => newJobs.delete(id));
						return {
							jobs: newJobs,
							selectedJobId: jobIds.includes(state.selectedJobId || "")
								? null
								: state.selectedJobId,
						};
					});
				},

				hydrateFromServer: (payload) => {
					set((state) => {
						const jobMap = new Map(payload.jobs.map((job) => [job.id, job]));
						const technicianMap = new Map(payload.technicians.map((tech) => [tech.id, tech]));

						return {
							...state,
							companyId: payload.companyId,
							jobs: jobMap,
							technicians: technicianMap,
							lastFetchedRange: {
								start: payload.range.start,
								end: payload.range.end,
							},
							lastSync: payload.lastSync,
							isLoading: false,
							error: null,
							selectedTechnicianId: null,
							selectedJobId: null,
						};
					});
				},

				// Sync
				syncWithServer: async () => {
					set({ isLoading: true, error: null });
					try {
						const supabase = createClient();

						if (!supabase) {
							throw new Error("Database connection not available");
						}

						const companyId = get().companyId;

						if (!companyId) {
							throw new Error("Company context is missing");
						}

						const range =
							get().lastFetchedRange ??
							({
								start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
								end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
							} as { start: Date; end: Date });

						const { jobs, technicians } = await fetchScheduleData({
							supabase,
							companyId,
							range,
						});

						get().setTechnicians(technicians);
						get().setJobs(jobs);
						set({
							lastSync: new Date(),
							lastFetchedRange: {
								start: new Date(range.start),
								end: new Date(range.end),
							},
						});
					} catch (error) {
						set({
							error: error instanceof Error ? error.message : "Unknown error",
						});
					} finally {
						set({ isLoading: false });
					}
				},

				setLoading: (loading) => set({ isLoading: loading }),
				setError: (error) => set({ error }),
				setLastSync: (timestamp) => set({ lastSync: timestamp }),
				setCompanyId: (companyId) => set({ companyId }),
				setLastFetchedRange: (range) => set({ lastFetchedRange: range }),

				// Helpers
				getJobsByTechnician: (technicianId) =>
					Array.from(get().jobs.values()).filter((job) =>
						job.assignments.some((assignment) => assignment.technicianId === technicianId)
					),

				getJobsByDateRange: (startDate, endDate) =>
					Array.from(get().jobs.values()).filter(
						(job) => job.startTime <= endDate && job.endTime >= startDate
					),

				getTechnicianById: (id) => get().technicians.get(id),

				getJobById: (id) => get().jobs.get(id),

				hasConflict: (technicianId, startTime, endTime, excludeJobId) => {
					const techJobs = get().getJobsByTechnician(technicianId);

					return techJobs.some((job) => {
						if (excludeJobId && job.id === excludeJobId) {
							return false;
						}

						// Check for overlap
						return (
							(startTime >= job.startTime && startTime < job.endTime) ||
							(endTime > job.startTime && endTime <= job.endTime) ||
							(startTime <= job.startTime && endTime >= job.endTime)
						);
					});
				},

				getUnassignedJobs: () => Array.from(get().jobs.values()).filter((job) => job.isUnassigned),

				getJobsGroupedByTechnician: () => {
					const grouped: Record<string, Job[]> = {};
					for (const job of get().jobs.values()) {
						job.assignments.forEach((assignment) => {
							if (!assignment.technicianId) {
								return;
							}
							if (!grouped[assignment.technicianId]) {
								grouped[assignment.technicianId] = [];
							}
							grouped[assignment.technicianId].push(job);
						});
					}
					return grouped;
				},
			}),
			{
				name: "schedule-storage",
				skipHydration: true, // CRITICAL: Prevents hydration mismatch with Next.js 16
				// Don't persist the Maps directly, convert to arrays
				partialize: (state) => ({
					technicians: Array.from(state.technicians.values()),
					jobs: Array.from(state.jobs.values()),
					lastSync: state.lastSync,
				}),
				// Rehydrate arrays back to Maps
				merge: (persistedState: any, currentState) => {
					const technicians = persistedState?.technicians
						? new Map(persistedState.technicians.map((t: Technician) => [t.id, t]))
						: currentState.technicians;

					const jobs = persistedState?.jobs
						? new Map(persistedState.jobs.map((j: Job) => [j.id, j]))
						: currentState.jobs;

					return {
						...currentState,
						...persistedState,
						technicians,
						jobs,
					};
				},
			}
		)
	)
);
