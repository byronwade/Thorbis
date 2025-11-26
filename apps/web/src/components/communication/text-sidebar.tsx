"use client";

import type { ComponentProps } from "react";
import { useCallback, useEffect, useState } from "react";
import { getSmsFolderCountsAction } from "@/actions/sms-actions";
import { CommunicationSidebar } from "@/components/communication/communication-sidebar";
import { RecipientSelector } from "@/components/communication/recipient-selector";
import type { Sidebar } from "@/components/ui/sidebar";
import { getSmsSidebarConfig } from "@/lib/communication/text-sidebar-config";

/**
 * TextSidebar - Text/SMS communication sidebar
 *
 * Fetches SMS folder counts and uses the shared CommunicationSidebar component.
 */
export function TextSidebar(props: ComponentProps<typeof Sidebar>) {
	const [config, setConfig] = useState(() => getSmsSidebarConfig({}));

	// Fetch folder counts and update config
	const fetchData = useCallback(async () => {
		try {
			const countsResult = await getSmsFolderCountsAction();

			if (countsResult.success && countsResult.counts) {
				setConfig(getSmsSidebarConfig(countsResult.counts));
			} else {
				console.error(
					"❌ Failed to fetch SMS folder counts:",
					countsResult.error,
				);
			}
		} catch (error) {
			console.error("Failed to fetch SMS folder data:", error);
		}
	}, []);

	useEffect(() => {
		fetchData();
		// Refresh counts every 30 seconds
		const interval = setInterval(fetchData, 30000);

		// Listen for SMS read events to refresh counts
		const handleSmsRead = () => {
			fetchData();
		};
		window.addEventListener("sms-read", handleSmsRead);

		return () => {
			clearInterval(interval);
			window.removeEventListener("sms-read", handleSmsRead);
		};
	}, [fetchData]);

	const [showRecipientSelector, setShowRecipientSelector] = useState(false);

	// Listen for open recipient selector event
	useEffect(() => {
		const handleOpenSelector = (event: CustomEvent) => {
			if (event.detail?.type === "sms") {
				setShowRecipientSelector(true);
			}
		};

		window.addEventListener(
			"open-recipient-selector",
			handleOpenSelector as EventListener,
		);
		return () => {
			window.removeEventListener(
				"open-recipient-selector",
				handleOpenSelector as EventListener,
			);
		};
	}, []);

	return (
		<>
			<CommunicationSidebar config={config} {...props} />
			<RecipientSelector
				open={showRecipientSelector}
				onOpenChange={setShowRecipientSelector}
				recipientType="sms"
			/>
		</>
	);
}
