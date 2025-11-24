"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getTotalUnreadCountAction } from "@/actions/email-actions";
import { MobileBottomTabs } from "./mobile-bottom-tabs";

/**
 * MobileBottomTabsWrapper - Client Component
 *
 * Fetches unread count and passes it to MobileBottomTabs.
 * Separate wrapper to keep the main component clean.
 */
export function MobileBottomTabsWrapper() {
	const pathname = usePathname();
	const [unreadCount, setUnreadCount] = useState(0);

	// Fetch unread count on mount, when pathname changes, and periodically
	useEffect(() => {
		const fetchUnreadCount = async () => {
			try {
				const result = await getTotalUnreadCountAction();
				if (result.success && result.count !== undefined) {
					setUnreadCount(result.count);
				}
			} catch (error) {
				console.error("Failed to fetch unread count:", error);
			}
		};

		// Fetch immediately
		fetchUnreadCount();

		// Refresh every 30 seconds
		const interval = setInterval(fetchUnreadCount, 30000);

		return () => clearInterval(interval);
	}, [pathname]);

	return <MobileBottomTabs unreadCount={unreadCount} />;
}
