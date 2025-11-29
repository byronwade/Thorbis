"use client";

import type { ComponentProps } from "react";
import { useCallback, useEffect, useState } from "react";
import { CommunicationSidebar } from "@/components/communication/communication-sidebar";
import { ComposeTypeSelector } from "@/components/communication/compose-type-selector";
import { CreateTeamChannelDialog } from "@/components/communication/create-team-channel-dialog";
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
	const [showCreateChannelDialog, setShowCreateChannelDialog] = useState(false);

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
			const { getCommunicationCountsAction, getUnifiedCommunicationCountsAction } = await import(
				"@/actions/communication-stats-actions"
			);

			const [emailResult, smsResult, commCountsResult, unifiedCountsResult] = await Promise.all([
				getEmailFolderCountsAction(),
				getSmsFolderCountsAction(),
				getCommunicationCountsAction(),
				getUnifiedCommunicationCountsAction().catch(() => ({ success: false, counts: undefined })),
			]);

			// Get actual counts from communications table
			const commCounts = commCountsResult.counts;
			const unifiedCounts = unifiedCountsResult.counts;

			// Combine counts
			const counts: UnifiedCommunicationCounts = {
				// Email counts - use actual counts from communications table
				email: commCounts?.email ?? 0,
				// Use unified count for personal_inbox (all communication types)
				personal_inbox: unifiedCounts?.personal_inbox ?? emailResult.counts?.personal_inbox ?? 0,
				// Personal email inbox - emails specifically sent to user's email
				personal_email_inbox: unifiedCounts?.personal_email_inbox ?? 0,
				personal_sent: emailResult.counts?.personal_sent ?? 0,
				// Use unified counts for drafts and archived (all communication types)
				personal_drafts: unifiedCounts?.personal_drafts ?? emailResult.counts?.drafts ?? 0,
				personal_archived: unifiedCounts?.personal_archived ?? emailResult.counts?.archive ?? 0,
				// Company inbox (unified - all categories combined)
				company_inbox: unifiedCounts?.company_inbox ?? 0,
				company_starred: unifiedCounts?.company_starred ?? 0,
				company_sent: unifiedCounts?.company_sent ?? 0,
				company_drafts: unifiedCounts?.company_drafts ?? 0,
				company_archived: unifiedCounts?.company_archived ?? 0,
				// Legacy company category counts (for backwards compatibility)
				company_support: emailResult.counts?.company_support ?? 0,
				company_sales: emailResult.counts?.company_sales ?? 0,
				company_billing: emailResult.counts?.company_billing ?? 0,
				company_general: emailResult.counts?.company_general ?? 0,

				// Company inbox sub-folder counts
				company_general_inbox: unifiedCounts?.company_general_inbox ?? emailResult.counts?.company_general ?? 0,
				company_general_starred: unifiedCounts?.company_general_starred ?? 0,
				company_general_sent: unifiedCounts?.company_general_sent ?? 0,
				company_general_drafts: unifiedCounts?.company_general_drafts ?? 0,
				company_general_archived: unifiedCounts?.company_general_archived ?? 0,
				
				company_sales_inbox: unifiedCounts?.company_sales_inbox ?? emailResult.counts?.company_sales ?? 0,
				company_sales_starred: unifiedCounts?.company_sales_starred ?? 0,
				company_sales_sent: unifiedCounts?.company_sales_sent ?? 0,
				company_sales_drafts: unifiedCounts?.company_sales_drafts ?? 0,
				company_sales_archived: unifiedCounts?.company_sales_archived ?? 0,
				
				company_support_inbox: unifiedCounts?.company_support_inbox ?? emailResult.counts?.company_support ?? 0,
				company_support_starred: unifiedCounts?.company_support_starred ?? 0,
				company_support_sent: unifiedCounts?.company_support_sent ?? 0,
				company_support_drafts: unifiedCounts?.company_support_drafts ?? 0,
				company_support_archived: unifiedCounts?.company_support_archived ?? 0,
				
				company_billing_inbox: unifiedCounts?.company_billing_inbox ?? emailResult.counts?.company_billing ?? 0,
				company_billing_starred: unifiedCounts?.company_billing_starred ?? 0,
				company_billing_sent: unifiedCounts?.company_billing_sent ?? 0,
				company_billing_drafts: unifiedCounts?.company_billing_drafts ?? 0,
				company_billing_archived: unifiedCounts?.company_billing_archived ?? 0,

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
					(unifiedCounts?.personal_archived || emailResult.counts?.archive || 0) +
					(smsResult.counts?.archive || 0),
				starred: emailResult.counts?.personal_starred ?? 0,

				// Call/voicemail counts from communications table
				call: commCounts?.call ?? 0,
				voicemail: commCounts?.voicemail ?? 0,

				// Team channel unread counts
				team_general: unifiedCounts?.team_general ?? 0,
				team_sales: unifiedCounts?.team_sales ?? 0,
				team_support: unifiedCounts?.team_support ?? 0,
				team_technicians: unifiedCounts?.team_technicians ?? 0,
				team_management: unifiedCounts?.team_management ?? 0,
			};

			// Use actual total from communications table
			counts.all = commCounts?.all ?? 0;

			const sidebarConfig = getUnifiedCommunicationSidebarConfig(counts);
			
			// Add onAddClick handler to Teams group
			const teamsGroupIndex = sidebarConfig.navGroups.findIndex(
				(group) => group.label === "Teams",
			);
			if (teamsGroupIndex !== -1) {
				sidebarConfig.navGroups[teamsGroupIndex].onAddClick = () => {
					setShowCreateChannelDialog(true);
				};
			}

			setConfig(sidebarConfig);
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
			<CreateTeamChannelDialog
				open={showCreateChannelDialog}
				onOpenChange={setShowCreateChannelDialog}
				onChannelCreated={() => {
					// Refresh counts after channel creation
					fetchCounts();
				}}
			/>
		</>
	);
}
