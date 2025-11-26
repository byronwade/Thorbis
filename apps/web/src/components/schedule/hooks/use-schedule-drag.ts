"use client";

import type {
	DragEndEvent,
	DragMoveEvent,
	DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { format } from "date-fns";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import {
	assignNewAppointment,
	moveAppointment,
	unassignAppointment,
} from "@/actions/schedule-assignments";
import type { Job, Technician } from "@/components/schedule/schedule-types";
import { useScheduleStore } from "@/lib/stores/schedule-store";

// Constants - exported for use in dispatch-timeline
export const DRAG_HOUR_WIDTH = 80; // Must match dispatch-timeline HOUR_WIDTH
export const DRAG_SNAP_INTERVAL_MINUTES = 15;
export const DRAG_UNASSIGNED_DROP_ID = "unassigned-dropzone";

// Type guard for pointer events
function hasClientCoordinates(
	event: Event | null | undefined,
): event is PointerEvent | MouseEvent | TouchEvent {
	if (!event) return false;
	return "clientX" in event && "clientY" in event;
}

export type DragJobCache = {
	job: Job;
	startTime: Date;
	endTime: Date;
	duration: number;
	isFromUnassigned: boolean;
};

export type DragPreview = {
	label: string;
	technician: string;
};

export type UseScheduleDragConfig = {
	technicians: Technician[];
	unassignedJobs: Job[];
	technicianLanes: Array<{ technicianId: string; jobs: Array<{ job: Job }> }>;
	timeRange: { start: Date; end: Date };
	totalWidth: number;
	timelineRef: React.RefObject<HTMLDivElement | null>;
	setUnassignedOrder: React.Dispatch<React.SetStateAction<string[]>>;
	setActiveJobId: (id: string | null) => void;
	setDragPreview: (preview: DragPreview | null) => void;
};

export type UseScheduleDragReturn = {
	handleDragStart: (event: DragStartEvent) => void;
	handleDragMove: (event: DragMoveEvent) => void;
	handleDragEnd: (event: DragEndEvent) => Promise<void>;
	handleDragCancel: () => void;
	dragJobCacheRef: React.RefObject<DragJobCache | null>;
	dragPointerRef: React.RefObject<{ x: number; y: number }>;
	rafIdRef: React.RefObject<number | null>;
	pendingDragMoveRef: React.RefObject<DragMoveEvent | null>;
	lastDragPreviewRef: React.RefObject<string>;
};

/**
 * Custom hook for handling schedule drag and drop operations
 * Separates "move existing appointment" from "assign unassigned job" operations
 * Uses batched server actions for performance
 */
export function useScheduleDrag(
	config: UseScheduleDragConfig,
): UseScheduleDragReturn {
	const {
		technicians,
		unassignedJobs,
		technicianLanes,
		timeRange,
		totalWidth,
		timelineRef,
		setUnassignedOrder,
		setActiveJobId,
		setDragPreview,
	} = config;

	// Store actions
	const moveJob = useScheduleStore((state) => state.moveJob);
	const updateJob = useScheduleStore((state) => state.updateJob);

	// Refs for performance optimization
	const dragJobCacheRef = useRef<DragJobCache | null>(null);
	const dragPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const rafIdRef = useRef<number | null>(null);
	const pendingDragMoveRef = useRef<DragMoveEvent | null>(null);
	const lastDragPreviewRef = useRef<string>("");

	// Rollback state for optimistic updates
	const rollbackStateRef = useRef<{
		jobId: string;
		previousState: Partial<Job>;
	} | null>(null);

	/**
	 * Handle drag start - cache job data for performance
	 */
	const handleDragStart = useCallback(
		(event: DragStartEvent) => {
			const jobId = event.active.id as string;
			setActiveJobId(jobId);
			setDragPreview(null);

			// Check if dragging from unassigned panel first (faster check)
			const unassignedJob = unassignedJobs.find((j) => j.id === jobId);
			const isFromUnassigned = !!unassignedJob;

			if (isFromUnassigned && unassignedJob) {
				// Cache unassigned job data
				const startTime =
					unassignedJob.startTime instanceof Date
						? unassignedJob.startTime
						: new Date(unassignedJob.startTime || Date.now());
				const endTime =
					unassignedJob.endTime instanceof Date
						? unassignedJob.endTime
						: new Date(
								unassignedJob.endTime || Date.now() + 2 * 60 * 60 * 1000,
							);

				dragJobCacheRef.current = {
					job: unassignedJob,
					startTime,
					endTime,
					duration: endTime.getTime() - startTime.getTime(),
					isFromUnassigned: true,
				};
			} else {
				// Search technician lanes for existing job
				const jobData = technicianLanes
					.flatMap((lane) => lane.jobs)
					.find((j) => j.job.id === jobId);

				if (jobData) {
					const job = jobData.job;
					const startTime =
						job.startTime instanceof Date
							? job.startTime
							: new Date(job.startTime);
					const endTime =
						job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

					dragJobCacheRef.current = {
						job,
						startTime,
						endTime,
						duration: endTime.getTime() - startTime.getTime(),
						isFromUnassigned: false,
					};
				} else {
					dragJobCacheRef.current = null;
				}
			}

			// Capture pointer position for drop time calculation
			const activator = event.activatorEvent;
			if (hasClientCoordinates(activator)) {
				dragPointerRef.current = {
					x: activator.clientX,
					y: activator.clientY,
				};
			}
		},
		[technicianLanes, unassignedJobs, setActiveJobId, setDragPreview],
	);

	/**
	 * Process drag move updates (throttled via RAF)
	 */
	const processDragMove = useCallback(() => {
		const event = pendingDragMoveRef.current;
		if (!event) return;

		const cached = dragJobCacheRef.current;
		if (!cached) {
			setDragPreview(null);
			return;
		}

		const { job, startTime, duration, isFromUnassigned } = cached;
		const targetTechnicianId =
			(event.over?.id as string | undefined) ?? job.technicianId;
		const targetTech = technicians.find(
			(tech) => tech.id === targetTechnicianId,
		);

		let newStart: Date;
		let newEnd: Date;

		if (isFromUnassigned) {
			// For unassigned jobs, calculate drop time from current pointer position
			const timelineRect = timelineRef.current?.getBoundingClientRect();
			if (timelineRect) {
				const currentX = dragPointerRef.current.x + event.delta.x;
				const relativeX = currentX - timelineRect.left;
				const minutesFromStart = (relativeX / totalWidth) * (24 * 60);
				const snappedMinutes =
					Math.round(minutesFromStart / DRAG_SNAP_INTERVAL_MINUTES) *
					DRAG_SNAP_INTERVAL_MINUTES;

				newStart = new Date(timeRange.start);
				newStart.setMinutes(newStart.getMinutes() + snappedMinutes);
				newEnd = new Date(newStart.getTime() + duration);
			} else {
				newStart = startTime;
				newEnd = new Date(startTime.getTime() + duration);
			}
		} else {
			// For existing jobs, calculate time change from horizontal drag delta
			const deltaMinutes = Math.round((event.delta.x / DRAG_HOUR_WIDTH) * 60);
			const snappedMinutes =
				Math.round(deltaMinutes / DRAG_SNAP_INTERVAL_MINUTES) *
				DRAG_SNAP_INTERVAL_MINUTES;
			newStart = new Date(startTime.getTime() + snappedMinutes * 60 * 1000);
			newEnd = new Date(newStart.getTime() + duration);
		}

		// Only update state if the label actually changed
		const newLabel = `${format(newStart, "h:mm a")} – ${format(newEnd, "h:mm a")}`;
		const newTechnician = targetTech?.name ?? "Unassigned";
		const previewKey = `${newLabel}|${newTechnician}`;

		if (previewKey !== lastDragPreviewRef.current) {
			lastDragPreviewRef.current = previewKey;
			setDragPreview({
				label: newLabel,
				technician: newTechnician,
			});
		}

		rafIdRef.current = null;
	}, [technicians, timeRange, totalWidth, timelineRef, setDragPreview]);

	/**
	 * Handle drag move - throttle updates to 60fps using RAF
	 */
	const handleDragMove = useCallback(
		(event: DragMoveEvent) => {
			pendingDragMoveRef.current = event;

			// Update pointer position for accurate drop calculations
			const activator = event.activatorEvent;
			if (hasClientCoordinates(activator)) {
				dragPointerRef.current = {
					x: activator.clientX,
					y: activator.clientY,
				};
			}

			if (rafIdRef.current === null) {
				rafIdRef.current = requestAnimationFrame(processDragMove);
			}
		},
		[processDragMove],
	);

	/**
	 * Handle moving an existing appointment to a new time/technician
	 */
	const handleMoveExistingAppointment = useCallback(
		async (
			job: Job,
			targetTechnicianId: string,
			delta: { x: number; y: number },
		): Promise<boolean> => {
			const targetTech = technicians.find((t) => t.id === targetTechnicianId);
			const techIdForDb = targetTech?.userId || targetTechnicianId;

			// Calculate new times from drag delta
			const deltaMinutes = Math.round((delta.x / DRAG_HOUR_WIDTH) * 60);
			const snappedMinutes =
				Math.round(deltaMinutes / DRAG_SNAP_INTERVAL_MINUTES) *
				DRAG_SNAP_INTERVAL_MINUTES;

			const oldStart =
				job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
			const oldEnd =
				job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
			const duration = oldEnd.getTime() - oldStart.getTime();

			const newStart = new Date(
				oldStart.getTime() + snappedMinutes * 60 * 1000,
			);
			const newEnd = new Date(newStart.getTime() + duration);

			// Store previous state for rollback
			rollbackStateRef.current = {
				jobId: job.id,
				previousState: {
					technicianId: job.technicianId,
					startTime: oldStart,
					endTime: oldEnd,
					assignments: [...job.assignments],
					isUnassigned: job.isUnassigned,
				},
			};

			// Optimistic update
			moveJob(job.id, targetTechnicianId, newStart, newEnd);

			const toastId = toast.loading(
				`Moving to ${targetTech?.name} at ${format(newStart, "h:mm a")}...`,
			);

			// Single batched server call
			const result = await moveAppointment(
				job.id,
				techIdForDb,
				newStart,
				newEnd,
			);

			if (!result.success) {
				// Rollback on failure
				if (rollbackStateRef.current) {
					const { previousState } = rollbackStateRef.current;
					updateJob(job.id, previousState);
				}
				toast.error(result.error || "Failed to move appointment", {
					id: toastId,
				});
				rollbackStateRef.current = null;
				return false;
			}

			toast.success(
				`Moved to ${targetTech?.name} at ${format(newStart, "h:mm a")}`,
				{
					id: toastId,
				},
			);
			rollbackStateRef.current = null;
			return true;
		},
		[technicians, moveJob, updateJob],
	);

	/**
	 * Handle assigning an unassigned job to a technician
	 */
	const handleAssignUnassignedJob = useCallback(
		async (job: Job, targetTechnicianId: string): Promise<boolean> => {
			const targetTech = technicians.find((t) => t.id === targetTechnicianId);
			const techIdForDb = targetTech?.userId || targetTechnicianId;

			// Calculate drop time from cursor position
			const dropX = dragPointerRef.current.x;
			const timelineRect = timelineRef.current?.getBoundingClientRect();

			let newStart: Date;
			let newEnd: Date;

			if (timelineRect) {
				const relativeX = dropX - timelineRect.left;
				const minutesFromStart = (relativeX / totalWidth) * (24 * 60);
				const snappedMinutes =
					Math.round(minutesFromStart / DRAG_SNAP_INTERVAL_MINUTES) *
					DRAG_SNAP_INTERVAL_MINUTES;

				newStart = new Date(timeRange.start);
				newStart.setMinutes(newStart.getMinutes() + snappedMinutes);

				// Use job's existing duration or default to 2 hours
				const existingDuration =
					job.endTime && job.startTime
						? new Date(job.endTime).getTime() -
							new Date(job.startTime).getTime()
						: 2 * 60 * 60 * 1000;
				newEnd = new Date(newStart.getTime() + existingDuration);
			} else {
				// Fallback to current time
				newStart = new Date();
				newStart.setMinutes(
					Math.round(newStart.getMinutes() / DRAG_SNAP_INTERVAL_MINUTES) *
						DRAG_SNAP_INTERVAL_MINUTES,
				);
				newEnd = new Date(newStart.getTime() + 2 * 60 * 60 * 1000);
			}

			// Store previous state for rollback
			rollbackStateRef.current = {
				jobId: job.id,
				previousState: {
					technicianId: job.technicianId,
					startTime: job.startTime,
					endTime: job.endTime,
					assignments: [...job.assignments],
					isUnassigned: true,
				},
			};

			// Optimistic update
			moveJob(job.id, targetTechnicianId, newStart, newEnd);

			const toastId = toast.loading(
				`Scheduling for ${targetTech?.name} at ${format(newStart, "h:mm a")}...`,
			);

			// Single batched server call
			const result = await assignNewAppointment(
				job.id,
				techIdForDb,
				newStart,
				newEnd,
			);

			if (!result.success) {
				// Rollback on failure
				if (rollbackStateRef.current) {
					const { previousState } = rollbackStateRef.current;
					updateJob(job.id, previousState);
				}
				toast.error(result.error || "Failed to assign appointment", {
					id: toastId,
				});
				rollbackStateRef.current = null;
				return false;
			}

			toast.success(
				`Scheduled for ${targetTech?.name} at ${format(newStart, "h:mm a")}`,
				{ id: toastId },
			);
			rollbackStateRef.current = null;
			return true;
		},
		[technicians, moveJob, updateJob, timeRange, totalWidth, timelineRef],
	);

	/**
	 * Handle drag cancel - cleanup all state
	 */
	const handleDragCancel = useCallback(() => {
		setActiveJobId(null);
		setDragPreview(null);

		// Cleanup RAF
		if (rafIdRef.current !== null) {
			cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		}
		pendingDragMoveRef.current = null;
		dragJobCacheRef.current = null;
		lastDragPreviewRef.current = "";
	}, [setActiveJobId, setDragPreview]);

	/**
	 * Handle drag end - determine operation type and execute
	 */
	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			const { active, over, delta } = event;

			// Reset UI state
			setActiveJobId(null);
			setDragPreview(null);

			// Cleanup RAF
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
			pendingDragMoveRef.current = null;
			lastDragPreviewRef.current = "";

			if (!over) {
				dragJobCacheRef.current = null;
				return;
			}

			const jobId = active.id as string;
			const overId = over.id as string;

			// Use cached data instead of re-searching (O(1) vs O(n))
			const cached = dragJobCacheRef.current;
			if (!cached || cached.job.id !== jobId) {
				dragJobCacheRef.current = null;
				return;
			}

			const { job, isFromUnassigned } = cached;
			const droppedOnUnassigned = overId === DRAG_UNASSIGNED_DROP_ID;
			const overIsUnassignedJob = unassignedJobs.some((j) => j.id === overId);

			// Clean up cache
			dragJobCacheRef.current = null;

			// CASE 1: Reordering within unassigned panel
			if (isFromUnassigned && overIsUnassignedJob && jobId !== overId) {
				setUnassignedOrder((prev) => {
					const fromIndex = prev.indexOf(jobId);
					const toIndex = prev.indexOf(overId);
					if (fromIndex === -1 || toIndex === -1) return prev;
					return arrayMove(prev, fromIndex, toIndex);
				});
				return;
			}

			// CASE 2: Moving to unassigned panel (unscheduling)
			if (droppedOnUnassigned) {
				if (isFromUnassigned) {
					// Already unassigned, just reorder to end
					setUnassignedOrder((prev) => {
						const fromIndex = prev.indexOf(jobId);
						if (fromIndex === -1) return prev;
						return arrayMove(prev, fromIndex, prev.length - 1);
					});
					return;
				}

				// Unassign existing appointment
				const startTime =
					job.startTime instanceof Date
						? job.startTime
						: new Date(job.startTime);
				const endTime =
					job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

				updateJob(jobId, {
					technicianId: "",
					assignments: [],
					isUnassigned: true,
					startTime,
					endTime,
				});

				const toastId = toast.loading("Moving appointment to Unscheduled...");
				const result = await unassignAppointment(jobId);

				if (result.success) {
					toast.success("Appointment moved to Unscheduled", { id: toastId });
				} else {
					toast.error(result.error || "Failed to unschedule appointment", {
						id: toastId,
					});
				}
				return;
			}

			// CASE 3: Assigning unassigned job to technician (CREATE operation)
			if (isFromUnassigned) {
				await handleAssignUnassignedJob(job, overId);
				return;
			}

			// CASE 4: Moving existing appointment (MOVE operation)
			await handleMoveExistingAppointment(job, overId, delta);
		},
		[
			unassignedJobs,
			updateJob,
			setUnassignedOrder,
			handleAssignUnassignedJob,
			handleMoveExistingAppointment,
			setActiveJobId,
			setDragPreview,
		],
	);

	return {
		handleDragStart,
		handleDragMove,
		handleDragEnd,
		handleDragCancel,
		// Expose refs for any external cleanup needs
		dragJobCacheRef,
		dragPointerRef,
		rafIdRef,
		pendingDragMoveRef,
		lastDragPreviewRef,
	};
}
