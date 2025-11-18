"use client";

/**
 * Desktop Notifications Hook
 *
 * Addresses ServiceTitan & Housecall Pro weakness: Easy to miss messages
 * Provides browser notifications and sound alerts
 */

import { useCallback, useEffect, useState } from "react";

interface NotificationOptions {
	title: string;
	body: string;
	icon?: string;
	tag?: string;
	onClick?: () => void;
}

export function useDesktopNotifications() {
	const isBrowser = typeof window !== "undefined";
	const [permission, setPermission] = useState<NotificationPermission>(() =>
		isBrowser && "Notification" in window ? Notification.permission : "default",
	);
	const [soundEnabled, setSoundEnabled] = useState(true);

	// Initialize notification permission
	useEffect(() => {
		if (isBrowser && "Notification" in window) {
			setPermission(Notification.permission);

			// Load sound preference from localStorage
			const savedSoundPref = localStorage.getItem(
				"notifications-sound-enabled",
			);
			if (savedSoundPref !== null) {
				setSoundEnabled(savedSoundPref === "true");
			}
		}
	}, []);

	// Request notification permission
	const requestPermission = useCallback(async () => {
		if (!isBrowser || !("Notification" in window)) {
			console.warn("This browser does not support desktop notifications");
			return false;
		}

		if (permission === "granted") {
			return true;
		}

		try {
			const result = await Notification.requestPermission();
			setPermission(result);
			return result === "granted";
		} catch (error) {
			console.error("Error requesting notification permission:", error);
			return false;
		}
	}, [permission]);

	// Play notification sound
	const playSound = useCallback(() => {
		if (!soundEnabled || !isBrowser) return;

		try {
			// Simple notification sound using Web Audio API
			const audioContext = new (
				window.AudioContext || (window as any).webkitAudioContext
			)();
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.frequency.value = 800;
			oscillator.type = "sine";

			gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(
				0.01,
				audioContext.currentTime + 0.5,
			);

			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + 0.5);
		} catch (error) {
			console.error("Error playing notification sound:", error);
		}
	}, [soundEnabled]);

	// Show desktop notification
	const showNotification = useCallback(
		async (options: NotificationOptions) => {
			// Request permission if needed
			if (permission !== "granted") {
				const granted = await requestPermission();
				if (!granted) return;
			}

			try {
				// Play sound
				playSound();

				// Show notification
				if (!isBrowser || !("Notification" in window)) {
					return;
				}
				const notification = new Notification(options.title, {
					body: options.body,
					icon: options.icon || "/icon-192.png",
					badge: "/icon-192.png",
					tag: options.tag,
					requireInteraction: false,
					silent: !soundEnabled,
				});

				// Handle click
				if (options.onClick) {
					notification.onclick = () => {
						window.focus();
						options.onClick?.();
						notification.close();
					};
				}

				// Auto-close after 5 seconds
				setTimeout(() => notification.close(), 5000);
			} catch (error) {
				console.error("Error showing notification:", error);
			}
		},
		[permission, requestPermission, playSound, soundEnabled, isBrowser],
	);

	// Toggle sound
	const toggleSound = useCallback(() => {
		setSoundEnabled((prev) => {
			const newValue = !prev;
			if (isBrowser) {
				localStorage.setItem("notifications-sound-enabled", String(newValue));
			}
			return newValue;
		});
	}, []);

	return {
		permission,
		soundEnabled,
		requestPermission,
		showNotification,
		toggleSound,
		isSupported: isBrowser && "Notification" in window,
	};
}

// Hook for updating browser tab title with unread count
export function useUnreadBadge() {
	const isBrowser = typeof window !== "undefined";
	const [originalTitle] = useState(() => (isBrowser ? document.title : ""));

	const updateBadge = useCallback(
		(unreadCount: number) => {
			if (!isBrowser) {
				return;
			}
			if (unreadCount > 0) {
				document.title = `(${unreadCount}) ${originalTitle}`;
			} else {
				document.title = originalTitle;
			}
		},
		[originalTitle, isBrowser],
	);

	// Clean up on unmount
	useEffect(() => {
		if (!isBrowser) {
			return;
		}
		return () => {
			document.title = originalTitle;
		};
	}, [originalTitle, isBrowser]);

	return { updateBadge };
}
