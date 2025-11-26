"use client";

/**
 * NotificationsInitializer
 *
 * Ensures realtime notifications and desktop permissions are ready globally.
 * - Subscribes to the notifications store as soon as the dashboard mounts
 * - Requests desktop notification permission once per browser
 * - Keeps communication toasts (SMS, calls, voicemail) in sync with desktop alerts
 */

import { useEffect, useRef } from "react";
import { useCommunicationNotificationsStore } from "@/lib/stores/communication-notifications-store";
import { useNotificationsStore } from "@/lib/stores/notifications-store";
import { createClient } from "@/lib/supabase/client";

const DESKTOP_PROMPT_KEY = "communication_desktop_prompted";

export function NotificationsInitializer() {
	const subscribe = useNotificationsStore((state) => state.subscribe);
	const unsubscribe = useNotificationsStore((state) => state.unsubscribe);

	const requestDesktopPermission = useCommunicationNotificationsStore(
		(state) => state.requestDesktopNotificationPermission,
	);
	const desktopNotificationsEnabled = useCommunicationNotificationsStore(
		(state) => state.desktopNotificationsEnabled,
	);
	const setDesktopNotificationsEnabled = useCommunicationNotificationsStore(
		(state) => state.setDesktopNotificationsEnabled,
	);

	const hasSubscribedRef = useRef(false);

	// Start realtime notifications subscription immediately
	useEffect(() => {
		if (hasSubscribedRef.current) {
			return;
		}
		hasSubscribedRef.current = true;

		let cancelled = false;
		const supabase = createClient();

		(async () => {
			if (!supabase) {
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user || cancelled) {
				return;
			}

			await subscribe(user.id);
		})();

		return () => {
			cancelled = true;
			unsubscribe();
		};
	}, [subscribe, unsubscribe]);

	// Ask for desktop notification permission once
	useEffect(() => {
		if (typeof window === "undefined" || !("Notification" in window)) {
			return;
		}

		const alreadyPrompted =
			window.localStorage.getItem(DESKTOP_PROMPT_KEY) === "true";

		const finalizePrompt = (granted: boolean) => {
			window.localStorage.setItem(DESKTOP_PROMPT_KEY, "true");
			if (!granted && desktopNotificationsEnabled) {
				setDesktopNotificationsEnabled(false);
			}
		};

		// Permission already decided
		if (Notification.permission === "granted") {
			if (!alreadyPrompted) {
				window.localStorage.setItem(DESKTOP_PROMPT_KEY, "true");
			}
			return;
		}

		if (Notification.permission === "denied") {
			if (!alreadyPrompted) {
				window.localStorage.setItem(DESKTOP_PROMPT_KEY, "true");
			}
			if (desktopNotificationsEnabled) {
				setDesktopNotificationsEnabled(false);
			}
			return;
		}

		// Only prompt once while permission is "default"
		if (alreadyPrompted) {
			return;
		}

		const timer = window.setTimeout(() => {
			requestDesktopPermission()
				.then((granted) => finalizePrompt(granted))
				.catch(() => finalizePrompt(false));
		}, 1500);

		return () => window.clearTimeout(timer);
	}, [
		desktopNotificationsEnabled,
		requestDesktopPermission,
		setDesktopNotificationsEnabled,
	]);

	return null;
}
