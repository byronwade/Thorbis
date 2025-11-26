"use client";

import { useEffect } from "react";
import { useDialerStore } from "@/lib/stores/dialer-store";

/**
 * Global keyboard shortcut hook for the phone dialer
 *
 * Listens for Ctrl+Shift+D (or Cmd+Shift+D on Mac) to toggle the dialer
 *
 * Usage: Call this hook once in a layout component
 */
export function useDialerShortcut() {
	const openDialer = useDialerStore((state) => state.openDialer);
	const closeDialer = useDialerStore((state) => state.closeDialer);
	const isOpen = useDialerStore((state) => state.isOpen);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Check for Ctrl+Shift+D (Windows/Linux) or Cmd+Shift+D (Mac)
			if (
				(event.ctrlKey || event.metaKey) &&
				event.shiftKey &&
				event.key === "D"
			) {
				event.preventDefault();

				// Toggle dialer
				if (isOpen) {
					closeDialer();
				} else {
					openDialer();
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [openDialer, closeDialer, isOpen]);
}
