"use client";

import { useEffect } from "react";

/**
 * Keyboard Shortcuts Hook
 *
 * Provides power-user keyboard shortcuts for forms
 * - Cmd/Ctrl + S: Save form
 * - Cmd/Ctrl + K: Focus search/customer field
 * - Cmd/Ctrl + /: Show shortcuts help
 * - Escape: Cancel/go back
 * - Alt + 1-9: Quick templates
 */

type KeyboardShortcut = {
	key: string;
	ctrl?: boolean;
	cmd?: boolean;
	alt?: boolean;
	shift?: boolean;
	callback: (event: KeyboardEvent) => void;
	description: string;
	category?: string;
};

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			for (const shortcut of shortcuts) {
				const ctrlKey = shortcut.ctrl && (event.ctrlKey || event.metaKey);
				const altKey = shortcut.alt && event.altKey;
				const shiftKey = shortcut.shift && event.shiftKey;
				const key = event.key.toLowerCase() === shortcut.key.toLowerCase();

				// Check if all required modifiers are pressed
				const modifiersMatch =
					(!shortcut.ctrl || ctrlKey) &&
					(!shortcut.alt || altKey) &&
					(!shortcut.shift || shiftKey) &&
					key;

				if (modifiersMatch) {
					event.preventDefault();
					shortcut.callback(event);
					return;
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [shortcuts]);
}

export function getShortcutDisplay(shortcut: KeyboardShortcut): string {
	const keys: string[] = [];

	if (shortcut.ctrl || shortcut.cmd) {
		keys.push(navigator.platform.includes("Mac") ? "⌘" : "Ctrl");
	}
	if (shortcut.alt) {
		keys.push(navigator.platform.includes("Mac") ? "⌥" : "Alt");
	}
	if (shortcut.shift) {
		keys.push(navigator.platform.includes("Mac") ? "⇧" : "Shift");
	}

	keys.push(shortcut.key.toUpperCase());

	return keys.join(" + ");
}
