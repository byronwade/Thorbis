"use client";

/**
 * useCallShortcuts Hook
 *
 * Handles all keyboard shortcuts for the call window.
 * CSRs need fast access to call controls without using the mouse.
 *
 * Shortcuts:
 * - M: Toggle mute
 * - H: Toggle hold
 * - R: Toggle recording
 * - T: Transfer call
 * - Shift+E: End call (requires shift to prevent accidents)
 * - J: Create new job
 * - A: Schedule appointment
 * - N: Focus notes
 * - S: Send SMS
 * - E: Send email
 * - 1: View transcript
 * - 2: View schedule
 * - ?: Show help
 * - Esc: Close dialogs
 */

import { useCallback, useEffect, useRef } from "react";

type CallShortcutActions = {
	onToggleMute?: () => void;
	onToggleHold?: () => void;
	onToggleRecording?: () => void;
	onTransfer?: () => void;
	onEndCall?: () => void;
	onCreateJob?: () => void;
	onScheduleAppointment?: () => void;
	onFocusNotes?: () => void;
	onSendSMS?: () => void;
	onSendEmail?: () => void;
	onViewTranscript?: () => void;
	onViewSchedule?: () => void;
	onShowHelp?: () => void;
	onEscape?: () => void;
};

type UseCallShortcutsOptions = {
	/**
	 * Whether shortcuts are enabled (disable during text input)
	 */
	enabled?: boolean;

	/**
	 * Callback when any shortcut is triggered (for analytics/feedback)
	 */
	onShortcutTriggered?: (shortcut: string) => void;
};

export function useCallShortcuts(
	actions: CallShortcutActions,
	options: UseCallShortcutsOptions = {},
) {
	const { enabled = true, onShortcutTriggered } = options;

	// Track if user is typing in an input field
	const isTypingRef = useRef(false);

	// Check if the active element is an input or textarea
	const isInputActive = useCallback(() => {
		const activeElement = document.activeElement;
		if (!activeElement) return false;

		const tagName = activeElement.tagName.toLowerCase();
		const isInput = tagName === "input" || tagName === "textarea";
		const isContentEditable =
			activeElement.getAttribute("contenteditable") === "true";

		return isInput || isContentEditable;
	}, []);

	// Handle keydown events
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			// Skip if shortcuts are disabled
			if (!enabled) return;

			// Skip if typing in an input (except for specific shortcuts)
			if (isInputActive()) {
				// Only allow Escape and Ctrl combinations when typing
				if (event.key === "Escape") {
					event.preventDefault();
					actions.onEscape?.();
					onShortcutTriggered?.("escape");
					return;
				}
				return;
			}

			// Normalize key for comparison
			const key = event.key.toLowerCase();
			const hasCtrl = event.ctrlKey || event.metaKey;
			const hasShift = event.shiftKey;
			const hasAlt = event.altKey;

			// Skip if Alt is pressed (browser shortcuts)
			if (hasAlt) return;

			// Handle Ctrl combinations
			if (hasCtrl) {
				switch (key) {
					case "s":
						// Save notes - handled elsewhere
						return;
				}
				return;
			}

			// Handle Shift combinations
			if (hasShift) {
				switch (key) {
					case "e":
						// End call (Shift+E to prevent accidents)
						event.preventDefault();
						actions.onEndCall?.();
						onShortcutTriggered?.("end_call");
						return;
				}
			}

			// Handle single key shortcuts
			switch (key) {
				case "m":
					event.preventDefault();
					actions.onToggleMute?.();
					onShortcutTriggered?.("toggle_mute");
					break;

				case "h":
					event.preventDefault();
					actions.onToggleHold?.();
					onShortcutTriggered?.("toggle_hold");
					break;

				case "r":
					event.preventDefault();
					actions.onToggleRecording?.();
					onShortcutTriggered?.("toggle_recording");
					break;

				case "t":
					event.preventDefault();
					actions.onTransfer?.();
					onShortcutTriggered?.("transfer");
					break;

				case "j":
					event.preventDefault();
					actions.onCreateJob?.();
					onShortcutTriggered?.("create_job");
					break;

				case "a":
					event.preventDefault();
					actions.onScheduleAppointment?.();
					onShortcutTriggered?.("schedule_appointment");
					break;

				case "n":
					event.preventDefault();
					actions.onFocusNotes?.();
					onShortcutTriggered?.("focus_notes");
					break;

				case "s":
					event.preventDefault();
					actions.onSendSMS?.();
					onShortcutTriggered?.("send_sms");
					break;

				case "e":
					// Only send email if Shift is not pressed (Shift+E = end call)
					if (!hasShift) {
						event.preventDefault();
						actions.onSendEmail?.();
						onShortcutTriggered?.("send_email");
					}
					break;

				case "1":
					event.preventDefault();
					actions.onViewTranscript?.();
					onShortcutTriggered?.("view_transcript");
					break;

				case "2":
					event.preventDefault();
					actions.onViewSchedule?.();
					onShortcutTriggered?.("view_schedule");
					break;

				case "?":
				case "/":
					// ? key (with or without shift)
					event.preventDefault();
					actions.onShowHelp?.();
					onShortcutTriggered?.("show_help");
					break;

				case "escape":
					event.preventDefault();
					actions.onEscape?.();
					onShortcutTriggered?.("escape");
					break;
			}
		},
		[enabled, isInputActive, actions, onShortcutTriggered],
	);

	// Attach event listener
	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	// Return helpers for the component
	return {
		/**
		 * Check if shortcuts are currently enabled
		 */
		isEnabled: enabled,

		/**
		 * Manually trigger a shortcut action
		 */
		trigger: (action: keyof CallShortcutActions) => {
			const fn = actions[action];
			if (typeof fn === "function") {
				fn();
				onShortcutTriggered?.(action);
			}
		},
	};
}

/**
 * Shortcut descriptions for UI display
 */
export const SHORTCUT_DESCRIPTIONS: Record<string, string> = {
	toggle_mute: "M",
	toggle_hold: "H",
	toggle_recording: "R",
	transfer: "T",
	end_call: "Shift+E",
	create_job: "J",
	schedule_appointment: "A",
	focus_notes: "N",
	send_sms: "S",
	send_email: "E",
	view_transcript: "1",
	view_schedule: "2",
	show_help: "?",
	escape: "Esc",
};

/**
 * Get shortcut hint for a specific action
 */
export function getShortcutHint(
	action: keyof typeof SHORTCUT_DESCRIPTIONS,
): string {
	return SHORTCUT_DESCRIPTIONS[action] || "";
}
