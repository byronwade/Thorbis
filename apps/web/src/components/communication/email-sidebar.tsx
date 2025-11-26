"use client";

import type { ComponentProps } from "react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getEmailFolderCountsAction } from "@/actions/email-actions";
import {
	deleteEmailFolderAction,
	getEmailFoldersAction,
} from "@/actions/email-folders";
import { CommunicationSidebar } from "@/components/communication/communication-sidebar";
import { RecipientSelector } from "@/components/communication/recipient-selector";
import type { Sidebar } from "@/components/ui/sidebar";
import { getEmailSidebarConfig } from "@/lib/communication/email-sidebar-config";

/**
 * EmailSidebar - Email communication sidebar
 *
 * Uses the shared CommunicationSidebar component with email-specific configuration.
 * This ensures consistent layout and behavior across all communication pages.
 */
export function EmailSidebar(props: ComponentProps<typeof Sidebar>) {
	const [config, setConfig] = useState(() => getEmailSidebarConfig());

	// Fetch folder counts and custom folders - memoized to prevent recreating on every render
	const fetchData = useCallback(async () => {
		try {
			const [countsResult, foldersResult] = await Promise.all([
				getEmailFolderCountsAction(),
				getEmailFoldersAction(),
			]);

			if (countsResult.success && countsResult.counts) {
				// Merge custom folder counts with system folder counts
				const allCounts = { ...countsResult.counts };

				// Add custom folder counts
				if (foldersResult.success && foldersResult.folders) {
					foldersResult.folders.forEach((folder) => {
						// Count emails with this folder's slug in tags
						// This will be calculated by the counts action, but we can add folder metadata
						allCounts[folder.slug] = allCounts[folder.slug] || 0;
					});
				}

				// Ensure all counts are numbers (not undefined)
				const normalizedCounts = {
					inbox: allCounts.inbox ?? 0,
					drafts: allCounts.drafts ?? 0,
					sent: allCounts.sent ?? 0,
					archive: allCounts.archive ?? 0,
					snoozed: allCounts.snoozed ?? 0,
					spam: allCounts.spam ?? 0,
					trash: allCounts.trash ?? 0,
					...allCounts,
				};

				const config = getEmailSidebarConfig(
					normalizedCounts,
					foldersResult.folders,
				);

				// Add delete handlers to folder items
				if (config.additionalSections?.[0]?.items) {
					config.additionalSections[0].items =
						config.additionalSections[0].items.map((item) => ({
							...item,
							onDelete: async (folderId: string) => {
								const result = await deleteEmailFolderAction({ id: folderId });
								if (result.success) {
									toast.success("Folder deleted");
									// Refresh folder list
									fetchData();
								} else {
									toast.error("Failed to delete folder", {
										description: result.error || "Unknown error",
									});
								}
							},
						}));
				}

				setConfig(config);
			} else {
				console.error(
					"❌ Failed to fetch email folder counts:",
					countsResult.error,
				);
				// Set config with zero counts on error
				setConfig(
					getEmailSidebarConfig(
						{
							inbox: 0,
							drafts: 0,
							sent: 0,
							archive: 0,
							snoozed: 0,
							spam: 0,
							trash: 0,
						},
						foldersResult.folders,
					),
				);
			}
		} catch (error) {
			console.error("Failed to fetch email folder data:", error);
		}
	}, []);

	// Fetch folder data on mount and periodically
	useEffect(() => {
		fetchData();
		const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

		// Listen for folder creation events
		const handleFolderCreated = () => {
			fetchData();
		};
		window.addEventListener("folder-created", handleFolderCreated);

		// Listen for email read/unread events to refresh counts (debounced)
		const handleEmailRead = () => {
			// Debounce to avoid too many refreshes
			setTimeout(() => fetchData(), 1000);
		};
		window.addEventListener("email-read", handleEmailRead);
		window.addEventListener("email-unread", handleEmailRead);

		// Listen for email action events to refresh counts IMMEDIATELY (no debounce)
		const handleEmailAction = () => {
			fetchData();
		};
		window.addEventListener("email-archived", handleEmailAction);
		window.addEventListener("email-starred-toggled", handleEmailAction);
		window.addEventListener("email-spam-toggled", handleEmailAction);
		window.addEventListener("email-snoozed", handleEmailAction);

		return () => {
			clearInterval(interval);
			window.removeEventListener("folder-created", handleFolderCreated);
			window.removeEventListener("email-read", handleEmailRead);
			window.removeEventListener("email-unread", handleEmailRead);
			window.removeEventListener("email-archived", handleEmailAction);
			window.removeEventListener("email-starred-toggled", handleEmailAction);
			window.removeEventListener("email-spam-toggled", handleEmailAction);
			window.removeEventListener("email-snoozed", handleEmailAction);
		};
	}, [fetchData]);

	const [showRecipientSelector, setShowRecipientSelector] = useState(false);

	// Listen for open recipient selector event
	useEffect(() => {
		const handleOpenSelector = (event: CustomEvent) => {
			if (event.detail?.type === "email") {
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
				recipientType="email"
			/>
		</>
	);
}
