"use client";

import type { ComponentProps } from "react";
import { useCallback, useEffect, useState } from "react";
import { CommunicationSidebar } from "@/components/communication/communication-sidebar";
import { ComposeTypeSelector } from "@/components/communication/compose-type-selector";
import type { Sidebar } from "@/components/ui/sidebar";
import {
	getUnifiedCommunicationSidebarConfig,
	type UnifiedCommunicationCounts,
} from "@/lib/communication/unified-communication-sidebar-config";

/**
 * UnifiedCommunicationSidebar - Unified communication hub sidebar
 *
 * Combines email and SMS navigation into a single sidebar for the main
 * /dashboard/communication page. Shows counts for all communication types
 * and provides quick access to compose new messages.
 */
export function UnifiedCommunicationSidebar(
	props: ComponentProps<typeof Sidebar>,
) {
	const [config, setConfig] = useState(() =>
		getUnifiedCommunicationSidebarConfig(),
	);
	const [showComposeSelector, setShowComposeSelector] = useState(false);

	// Fetch communication counts
	const fetchCounts = useCallback(async () => {
		try {
			// Import actions dynamically to avoid server/client issues
			const { getEmailFolderCountsAction } = await import(
				"@/actions/email-actions"
			);
			const { getSmsFolderCountsAction } = await import(
				"@/actions/sms-actions"
			);
			const { getCommunicationCountsAction } = await import(
				"@/actions/communication-stats-actions"
			);

			const [emailResult, smsResult, commCountsResult] = await Promise.all([
				getEmailFolderCountsAction(),
				getSmsFolderCountsAction(),
				getCommunicationCountsAction(),
			]);

			// Get actual counts from communications table
			const commCounts = commCountsResult.counts;

			// Combine counts
			const counts: UnifiedCommunicationCounts = {
				// Email counts - use actual counts from communications table
				email: commCounts?.email ?? 0,
				personal_inbox: emailResult.counts?.personal_inbox ?? 0,
				personal_sent: emailResult.counts?.personal_sent ?? 0,
				personal_drafts: emailResult.counts?.personal_drafts ?? 0,
				company_support: emailResult.counts?.company_support ?? 0,
				company_sales: emailResult.counts?.company_sales ?? 0,
				company_billing: emailResult.counts?.company_billing ?? 0,
				company_general: emailResult.counts?.company_general ?? 0,

				// SMS counts - use actual counts from communications table
				sms: commCounts?.sms ?? 0,
				sms_inbox: smsResult.counts?.inbox ?? 0,
				sms_sent: smsResult.counts?.sent ?? 0,
				sms_archive: smsResult.counts?.archive ?? 0,

				// Combined folder counts
				inbox:
					(emailResult.counts?.personal_inbox || 0) +
					(smsResult.counts?.inbox || 0),
				sent:
					(emailResult.counts?.personal_sent || 0) +
					(smsResult.counts?.sent || 0),
				archive:
					(emailResult.counts?.personal_archive || 0) +
					(smsResult.counts?.archive || 0),
				starred: emailResult.counts?.personal_starred ?? 0,

				// Call/voicemail counts from communications table
				call: commCounts?.call ?? 0,
				voicemail: commCounts?.voicemail ?? 0,
			};

			// Use actual total from communications table
			counts.all = commCounts?.all ?? 0;

			setConfig(getUnifiedCommunicationSidebarConfig(counts));
		} catch (error) {
			console.error("Failed to fetch unified communication counts:", error);
		}
	}, []);

	// Fetch counts on mount and periodically
	useEffect(() => {
		fetchCounts();
		const interval = setInterval(fetchCounts, 30000); // Refresh every 30 seconds

		// Listen for communication events to refresh counts
		const handleRefresh = () => {
			setTimeout(fetchCounts, 1000); // Debounce
		};

		window.addEventListener("email-read", handleRefresh);
		window.addEventListener("email-archived", handleRefresh);
		window.addEventListener("sms-read", handleRefresh);
		window.addEventListener("communication-updated", handleRefresh);

		return () => {
			clearInterval(interval);
			window.removeEventListener("email-read", handleRefresh);
			window.removeEventListener("email-archived", handleRefresh);
			window.removeEventListener("sms-read", handleRefresh);
			window.removeEventListener("communication-updated", handleRefresh);
		};
	}, [fetchCounts]);

	// Listen for compose selector open event
	useEffect(() => {
		const handleOpenCompose = () => {
			setShowComposeSelector(true);
		};

		window.addEventListener(
			"open-unified-compose",
			handleOpenCompose as EventListener,
		);
		return () => {
			window.removeEventListener(
				"open-unified-compose",
				handleOpenCompose as EventListener,
			);
		};
	}, []);

	return (
		<>
			<CommunicationSidebar config={config} {...props} />
			<ComposeTypeSelector
				open={showComposeSelector}
				onOpenChange={setShowComposeSelector}
			/>
		</>
	);
}
