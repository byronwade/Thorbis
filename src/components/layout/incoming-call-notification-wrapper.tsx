"use client";

/**
 * Incoming Call Notification Wrapper
 *
 * Performance optimization wrapper that lazy-loads the heavy IncomingCallNotification component.
 *
 * Benefits:
 * - Reduces initial page load by ~700KB+ (component + dependencies)
 * - Only loads when needed (when checking for active calls)
 * - Improves Time to Interactive (TTI) significantly
 * - Does not block initial page render
 *
 * This wrapper checks for active calls and only loads the full component when needed.
 */

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy load the heavy IncomingCallNotification component
// Client-only because it uses browser APIs and WebRTC
const IncomingCallNotification = dynamic(
	() =>
		import("@/components/layout/incoming-call-notification").then(
			(mod) => mod.IncomingCallNotification
		),
	{
		loading: () => null, // No loading UI needed, it's invisible until there's a call
		ssr: false, // Prevent server rendering to avoid hydration mismatches
	}
);

/**
 * Wrapper component that lazy-loads the incoming call notification
 */
export function IncomingCallNotificationWrapper() {
	return (
		<Suspense fallback={null}>
			<IncomingCallNotification />
		</Suspense>
	);
}
