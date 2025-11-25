"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";

/**
 * Keyboard shortcuts for the schedule view:
 * - T: Go to today
 * - N: New job (navigates to /dashboard/work/new)
 * - [: Previous period
 * - ]: Next period
 * - 1: Timeline/Day view
 * - 2: Monthly view
 * - 3: Kanban/Status board view
 */
export function useScheduleKeyboardShortcuts() {
	const router = useRouter();
	const { goToToday, navigatePrevious, navigateNext, setViewMode } =
		useScheduleViewStore();

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Ignore if user is typing in an input, textarea, or contenteditable
			const target = event.target as HTMLElement;
			if (
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.isContentEditable
			) {
				return;
			}

			// Ignore if any modifier keys are pressed (except shift for some cases)
			if (event.ctrlKey || event.metaKey || event.altKey) {
				return;
			}

			switch (event.key.toLowerCase()) {
				case "t":
					event.preventDefault();
					goToToday();
					break;

				case "n":
					event.preventDefault();
					router.push("/dashboard/work/new");
					break;

				case "[":
					event.preventDefault();
					navigatePrevious();
					break;

				case "]":
					event.preventDefault();
					navigateNext();
					break;

				case "1":
					event.preventDefault();
					setViewMode("day");
					break;

				case "2":
					event.preventDefault();
					setViewMode("month");
					break;

				case "3":
					event.preventDefault();
					setViewMode("week"); // week = kanban view
					break;

				default:
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [goToToday, navigatePrevious, navigateNext, setViewMode, router]);
}
