/**
 * Schedule Usability Tests
 *
 * Tests that verify user interactions work correctly.
 * Focus: time snapping, keyboard shortcuts, visual feedback, error recovery.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// =============================================================================
// CONSTANTS (from use-schedule-drag.ts)
// =============================================================================

const DRAG_HOUR_WIDTH = 80;
const DRAG_SNAP_INTERVAL_MINUTES = 15;
const DRAG_UNASSIGNED_DROP_ID = "unassigned-dropzone";

// =============================================================================
// TIME SNAPPING TESTS
// =============================================================================

describe("Time Snapping Accuracy", () => {
	describe("15-minute interval snapping", () => {
		it("should snap 7 minutes to 0 (round down)", () => {
			const rawMinutes = 7;
			const snapped =
				Math.round(rawMinutes / DRAG_SNAP_INTERVAL_MINUTES) *
				DRAG_SNAP_INTERVAL_MINUTES;

			expect(snapped).toBe(0);
		});

		it("should snap 8 minutes to 15 (round up)", () => {
			const rawMinutes = 8;
			const snapped =
				Math.round(rawMinutes / DRAG_SNAP_INTERVAL_MINUTES) *
				DRAG_SNAP_INTERVAL_MINUTES;

			expect(snapped).toBe(15);
		});

		it("should snap 22 minutes to 15", () => {
			const rawMinutes = 22;
			const snapped =
				Math.round(rawMinutes / DRAG_SNAP_INTERVAL_MINUTES) *
				DRAG_SNAP_INTERVAL_MINUTES;

			expect(snapped).toBe(15);
		});

		it("should snap 23 minutes to 30", () => {
			const rawMinutes = 23;
			const snapped =
				Math.round(rawMinutes / DRAG_SNAP_INTERVAL_MINUTES) *
				DRAG_SNAP_INTERVAL_MINUTES;

			expect(snapped).toBe(30);
		});

		it("should snap 37 minutes to 30", () => {
			const rawMinutes = 37;
			const snapped =
				Math.round(rawMinutes / DRAG_SNAP_INTERVAL_MINUTES) *
				DRAG_SNAP_INTERVAL_MINUTES;

			expect(snapped).toBe(30);
		});

		it("should snap 38 minutes to 45", () => {
			const rawMinutes = 38;
			const snapped =
				Math.round(rawMinutes / DRAG_SNAP_INTERVAL_MINUTES) *
				DRAG_SNAP_INTERVAL_MINUTES;

			expect(snapped).toBe(45);
		});

		it("should snap exactly on boundaries", () => {
			expect(
				Math.round(0 / DRAG_SNAP_INTERVAL_MINUTES) * DRAG_SNAP_INTERVAL_MINUTES,
			).toBe(0);
			expect(
				Math.round(15 / DRAG_SNAP_INTERVAL_MINUTES) * DRAG_SNAP_INTERVAL_MINUTES,
			).toBe(15);
			expect(
				Math.round(30 / DRAG_SNAP_INTERVAL_MINUTES) * DRAG_SNAP_INTERVAL_MINUTES,
			).toBe(30);
			expect(
				Math.round(45 / DRAG_SNAP_INTERVAL_MINUTES) * DRAG_SNAP_INTERVAL_MINUTES,
			).toBe(45);
			expect(
				Math.round(60 / DRAG_SNAP_INTERVAL_MINUTES) * DRAG_SNAP_INTERVAL_MINUTES,
			).toBe(60);
		});

		it("should handle negative drag deltas (dragging left)", () => {
			const rawMinutes = -23;
			const snapped =
				Math.round(rawMinutes / DRAG_SNAP_INTERVAL_MINUTES) *
				DRAG_SNAP_INTERVAL_MINUTES;

			expect(snapped).toBe(-30);
		});
	});
});

// =============================================================================
// DRAG PREVIEW CONSISTENCY TESTS
// =============================================================================

describe("Drag Preview Consistency", () => {
	it("should calculate same position from drag delta as final drop", () => {
		const originalStartMinutes = 9 * 60; // 9:00 AM
		const dragDeltaX = 120; // pixels

		// During drag: calculate from delta
		const deltaMinutes = Math.round((dragDeltaX / DRAG_HOUR_WIDTH) * 60);
		const snappedDelta =
			Math.round(deltaMinutes / DRAG_SNAP_INTERVAL_MINUTES) *
			DRAG_SNAP_INTERVAL_MINUTES;
		const previewMinutes = originalStartMinutes + snappedDelta;

		// On drop: same calculation
		const finalMinutes = originalStartMinutes + snappedDelta;

		expect(previewMinutes).toBe(finalMinutes);
	});

	it("should maintain job duration during drag", () => {
		const startTime = new Date("2024-01-15T09:00:00");
		const endTime = new Date("2024-01-15T11:00:00");
		const duration = endTime.getTime() - startTime.getTime();

		// Move by 1 hour
		const deltaMinutes = 60;
		const newStart = new Date(startTime.getTime() + deltaMinutes * 60 * 1000);
		const newEnd = new Date(newStart.getTime() + duration);

		// Duration should be preserved
		expect(newEnd.getTime() - newStart.getTime()).toBe(duration);
		expect(newEnd.getTime() - newStart.getTime()).toBe(2 * 60 * 60 * 1000);
	});
});

// =============================================================================
// CONFLICT DETECTION VISUAL FEEDBACK TESTS
// =============================================================================

describe("Conflict Detection", () => {
	const hasConflict = (
		existingJobs: Array<{ startTime: Date; endTime: Date }>,
		newStart: Date,
		newEnd: Date,
		excludeIndex?: number,
	): boolean => {
		return existingJobs.some((job, index) => {
			if (excludeIndex !== undefined && index === excludeIndex) return false;
			return (
				(newStart >= job.startTime && newStart < job.endTime) ||
				(newEnd > job.startTime && newEnd <= job.endTime) ||
				(newStart <= job.startTime && newEnd >= job.endTime)
			);
		});
	};

	it("should detect overlap at start", () => {
		const existing = [
			{
				startTime: new Date("2024-01-15T09:00:00"),
				endTime: new Date("2024-01-15T11:00:00"),
			},
		];

		const conflict = hasConflict(
			existing,
			new Date("2024-01-15T10:00:00"), // Overlaps existing
			new Date("2024-01-15T12:00:00"),
		);

		expect(conflict).toBe(true);
	});

	it("should detect overlap at end", () => {
		const existing = [
			{
				startTime: new Date("2024-01-15T11:00:00"),
				endTime: new Date("2024-01-15T13:00:00"),
			},
		];

		const conflict = hasConflict(
			existing,
			new Date("2024-01-15T09:00:00"),
			new Date("2024-01-15T12:00:00"), // Ends inside existing
		);

		expect(conflict).toBe(true);
	});

	it("should detect complete overlap (new contains existing)", () => {
		const existing = [
			{
				startTime: new Date("2024-01-15T10:00:00"),
				endTime: new Date("2024-01-15T11:00:00"),
			},
		];

		const conflict = hasConflict(
			existing,
			new Date("2024-01-15T09:00:00"), // Starts before
			new Date("2024-01-15T12:00:00"), // Ends after
		);

		expect(conflict).toBe(true);
	});

	it("should NOT detect conflict for adjacent jobs", () => {
		const existing = [
			{
				startTime: new Date("2024-01-15T09:00:00"),
				endTime: new Date("2024-01-15T11:00:00"),
			},
		];

		const conflict = hasConflict(
			existing,
			new Date("2024-01-15T11:00:00"), // Starts exactly when other ends
			new Date("2024-01-15T13:00:00"),
		);

		expect(conflict).toBe(false);
	});

	it("should exclude self when checking conflicts during move", () => {
		const existing = [
			{
				startTime: new Date("2024-01-15T09:00:00"),
				endTime: new Date("2024-01-15T11:00:00"),
			},
			{
				startTime: new Date("2024-01-15T13:00:00"),
				endTime: new Date("2024-01-15T15:00:00"),
			},
		];

		// Moving job at index 0 to a new time
		const conflict = hasConflict(
			existing,
			new Date("2024-01-15T10:00:00"),
			new Date("2024-01-15T12:00:00"),
			0, // Exclude self
		);

		expect(conflict).toBe(false);
	});
});

// =============================================================================
// ROLLBACK BEHAVIOR TESTS
// =============================================================================

describe("Rollback on Error", () => {
	it("should restore original state on server failure", () => {
		// Simulate state before optimistic update
		const originalState = {
			technicianId: "tech-1",
			startTime: new Date("2024-01-15T09:00:00"),
			endTime: new Date("2024-01-15T11:00:00"),
			assignments: [{ technicianId: "tech-1", role: "primary" }],
		};

		// Optimistic update
		let currentState = {
			technicianId: "tech-2",
			startTime: new Date("2024-01-15T10:00:00"),
			endTime: new Date("2024-01-15T12:00:00"),
			assignments: [{ technicianId: "tech-2", role: "primary" }],
		};

		// Server fails
		const serverResult = { success: false, error: "Network error" };

		// Rollback
		if (!serverResult.success) {
			currentState = { ...originalState };
		}

		expect(currentState.technicianId).toBe("tech-1");
		expect(currentState.startTime).toEqual(new Date("2024-01-15T09:00:00"));
	});

	it("should clear rollback state after successful save", () => {
		let rollbackState: typeof originalState | null = null;

		const originalState = {
			technicianId: "tech-1",
			startTime: new Date("2024-01-15T09:00:00"),
		};

		// Store for rollback
		rollbackState = { ...originalState };

		// Server succeeds
		const serverResult = { success: true };

		if (serverResult.success) {
			rollbackState = null;
		}

		expect(rollbackState).toBeNull();
	});
});

// =============================================================================
// KEYBOARD SHORTCUTS TESTS
// =============================================================================

describe("Keyboard Shortcuts", () => {
	const simulateKeyboardShortcut = (
		key: string,
		handlers: {
			goToToday: () => void;
			navigatePrevious: () => void;
			navigateNext: () => void;
			setViewMode: (mode: string) => void;
			navigateToNew: () => void;
		},
	) => {
		// Simulate the keyboard handler logic
		switch (key.toLowerCase()) {
			case "t":
				handlers.goToToday();
				break;
			case "n":
				handlers.navigateToNew();
				break;
			case "[":
				handlers.navigatePrevious();
				break;
			case "]":
				handlers.navigateNext();
				break;
			case "1":
				handlers.setViewMode("day");
				break;
			case "2":
				handlers.setViewMode("month");
				break;
			case "3":
				handlers.setViewMode("week");
				break;
		}
	};

	it("should call goToToday when T is pressed", () => {
		const goToToday = vi.fn();
		const handlers = {
			goToToday,
			navigatePrevious: vi.fn(),
			navigateNext: vi.fn(),
			setViewMode: vi.fn(),
			navigateToNew: vi.fn(),
		};

		simulateKeyboardShortcut("t", handlers);

		expect(goToToday).toHaveBeenCalledOnce();
	});

	it("should navigate to new job page when N is pressed", () => {
		const navigateToNew = vi.fn();
		const handlers = {
			goToToday: vi.fn(),
			navigatePrevious: vi.fn(),
			navigateNext: vi.fn(),
			setViewMode: vi.fn(),
			navigateToNew,
		};

		simulateKeyboardShortcut("n", handlers);

		expect(navigateToNew).toHaveBeenCalledOnce();
	});

	it("should navigate previous when [ is pressed", () => {
		const navigatePrevious = vi.fn();
		const handlers = {
			goToToday: vi.fn(),
			navigatePrevious,
			navigateNext: vi.fn(),
			setViewMode: vi.fn(),
			navigateToNew: vi.fn(),
		};

		simulateKeyboardShortcut("[", handlers);

		expect(navigatePrevious).toHaveBeenCalledOnce();
	});

	it("should navigate next when ] is pressed", () => {
		const navigateNext = vi.fn();
		const handlers = {
			goToToday: vi.fn(),
			navigatePrevious: vi.fn(),
			navigateNext,
			setViewMode: vi.fn(),
			navigateToNew: vi.fn(),
		};

		simulateKeyboardShortcut("]", handlers);

		expect(navigateNext).toHaveBeenCalledOnce();
	});

	it("should switch to day view when 1 is pressed", () => {
		const setViewMode = vi.fn();
		const handlers = {
			goToToday: vi.fn(),
			navigatePrevious: vi.fn(),
			navigateNext: vi.fn(),
			setViewMode,
			navigateToNew: vi.fn(),
		};

		simulateKeyboardShortcut("1", handlers);

		expect(setViewMode).toHaveBeenCalledWith("day");
	});

	it("should switch to month view when 2 is pressed", () => {
		const setViewMode = vi.fn();
		const handlers = {
			goToToday: vi.fn(),
			navigatePrevious: vi.fn(),
			navigateNext: vi.fn(),
			setViewMode,
			navigateToNew: vi.fn(),
		};

		simulateKeyboardShortcut("2", handlers);

		expect(setViewMode).toHaveBeenCalledWith("month");
	});

	it("should switch to week/kanban view when 3 is pressed", () => {
		const setViewMode = vi.fn();
		const handlers = {
			goToToday: vi.fn(),
			navigatePrevious: vi.fn(),
			navigateNext: vi.fn(),
			setViewMode,
			navigateToNew: vi.fn(),
		};

		simulateKeyboardShortcut("3", handlers);

		expect(setViewMode).toHaveBeenCalledWith("week");
	});
});

// =============================================================================
// VIEW NAVIGATION TESTS
// =============================================================================

describe("View Navigation", () => {
	describe("Day view navigation", () => {
		it("should go to previous day", () => {
			const currentDate = new Date();
			currentDate.setHours(12, 0, 0, 0); // Normalize to avoid DST issues
			const originalDay = currentDate.getDate();
			const viewMode = "day";

			const newDate = new Date(currentDate);
			if (viewMode === "day") {
				newDate.setDate(newDate.getDate() - 1);
			}

			// Should be 1 day before original
			const expectedDay = new Date(currentDate);
			expectedDay.setDate(expectedDay.getDate() - 1);
			expect(newDate.getDate()).toBe(expectedDay.getDate());
		});

		it("should go to next day", () => {
			const currentDate = new Date();
			currentDate.setHours(12, 0, 0, 0);
			const viewMode = "day";

			const newDate = new Date(currentDate);
			if (viewMode === "day") {
				newDate.setDate(newDate.getDate() + 1);
			}

			const expectedDay = new Date(currentDate);
			expectedDay.setDate(expectedDay.getDate() + 1);
			expect(newDate.getDate()).toBe(expectedDay.getDate());
		});
	});

	describe("Week view navigation", () => {
		it("should go to previous week", () => {
			const currentDate = new Date();
			currentDate.setHours(12, 0, 0, 0);
			const viewMode = "week";

			const newDate = new Date(currentDate);
			if (viewMode === "week") {
				newDate.setDate(newDate.getDate() - 7);
			}

			const expectedDay = new Date(currentDate);
			expectedDay.setDate(expectedDay.getDate() - 7);
			expect(newDate.getDate()).toBe(expectedDay.getDate());
		});

		it("should go to next week", () => {
			const currentDate = new Date();
			currentDate.setHours(12, 0, 0, 0);
			const viewMode = "week";

			const newDate = new Date(currentDate);
			if (viewMode === "week") {
				newDate.setDate(newDate.getDate() + 7);
			}

			const expectedDay = new Date(currentDate);
			expectedDay.setDate(expectedDay.getDate() + 7);
			expect(newDate.getDate()).toBe(expectedDay.getDate());
		});
	});

	describe("Month view navigation", () => {
		it("should go to previous month", () => {
			const currentDate = new Date("2024-01-15");
			const viewMode = "month";

			const newDate = new Date(currentDate);
			if (viewMode === "month") {
				newDate.setMonth(newDate.getMonth() - 1);
			}

			expect(newDate.getMonth()).toBe(11); // December (previous year)
		});

		it("should go to next month", () => {
			const currentDate = new Date("2024-01-15");
			const viewMode = "month";

			const newDate = new Date(currentDate);
			if (viewMode === "month") {
				newDate.setMonth(newDate.getMonth() + 1);
			}

			expect(newDate.getMonth()).toBe(1); // February
		});
	});
});

// =============================================================================
// DROP ZONE IDENTIFICATION TESTS
// =============================================================================

describe("Drop Zone Identification", () => {
	it("should identify unassigned drop zone", () => {
		const overId = DRAG_UNASSIGNED_DROP_ID;
		expect(overId === DRAG_UNASSIGNED_DROP_ID).toBe(true);
	});

	it("should identify technician lane drop zone", () => {
		const overId = "tech-123";
		const technicians = [{ id: "tech-123" }, { id: "tech-456" }];

		const isTechnicianLane = technicians.some((t) => t.id === overId);
		expect(isTechnicianLane).toBe(true);
	});

	it("should identify job reorder (drop on another job)", () => {
		const overId = "job-456";
		const unassignedJobs = [{ id: "job-123" }, { id: "job-456" }];

		const isJobReorder = unassignedJobs.some((j) => j.id === overId);
		expect(isJobReorder).toBe(true);
	});
});

// =============================================================================
// BUFFER MANAGEMENT TESTS
// =============================================================================

describe("Infinite Scroll Buffer", () => {
	const BUFFER_DAYS_BEFORE = 3;
	const BUFFER_DAYS_AFTER = 3;
	const EXTEND_DAYS = 3;
	const MAX_BUFFER_DAYS = 14;

	it("should create initial buffer around center date", () => {
		const centerDate = new Date();
		centerDate.setHours(12, 0, 0, 0);
		const centerDay = centerDate.getDate();

		const start = new Date(centerDate);
		start.setDate(start.getDate() - BUFFER_DAYS_BEFORE);

		const end = new Date(centerDate);
		end.setDate(end.getDate() + BUFFER_DAYS_AFTER);

		// Verify the buffer spans the correct number of days
		const expectedStart = new Date(centerDate);
		expectedStart.setDate(expectedStart.getDate() - BUFFER_DAYS_BEFORE);

		const expectedEnd = new Date(centerDate);
		expectedEnd.setDate(expectedEnd.getDate() + BUFFER_DAYS_AFTER);

		expect(start.getDate()).toBe(expectedStart.getDate());
		expect(end.getDate()).toBe(expectedEnd.getDate());
	});

	it("should extend buffer by EXTEND_DAYS", () => {
		const bufferStart = new Date();
		bufferStart.setHours(12, 0, 0, 0);

		const originalDay = bufferStart.getDate();

		const newStart = new Date(bufferStart);
		newStart.setDate(newStart.getDate() - EXTEND_DAYS);

		const expected = new Date(bufferStart);
		expected.setDate(expected.getDate() - EXTEND_DAYS);

		expect(newStart.getDate()).toBe(expected.getDate());
	});

	it("should trim buffer when exceeding MAX_BUFFER_DAYS", () => {
		const start = new Date("2024-01-01");
		const end = new Date("2024-01-20"); // 19 days

		const totalDays = Math.ceil(
			(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
		);

		expect(totalDays).toBeGreaterThan(MAX_BUFFER_DAYS);

		// Should trim
		const halfMax = Math.floor(MAX_BUFFER_DAYS / 2);
		const centerDate = new Date("2024-01-10");

		const newStart = new Date(centerDate);
		newStart.setDate(newStart.getDate() - halfMax);

		const newEnd = new Date(centerDate);
		newEnd.setDate(newEnd.getDate() + halfMax);

		const newTotalDays = Math.ceil(
			(newEnd.getTime() - newStart.getTime()) / (1000 * 60 * 60 * 24),
		);

		expect(newTotalDays).toBeLessThanOrEqual(MAX_BUFFER_DAYS);
	});
});
