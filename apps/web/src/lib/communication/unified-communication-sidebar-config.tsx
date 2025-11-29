import type { CommunicationSidebarConfig } from "@/components/communication/communication-sidebar";
import {
    CreditCard,
    HelpCircle,
    Inbox,
    MessageSquare,
    Plus,
    Send,
    Star,
    TrendingUp,
    Users
} from "lucide-react";

/**
 * Unified Communication Counts
 * Combines email and SMS folder counts for the unified view
 */
export type UnifiedCommunicationCounts = {
	// Type counts (all communications)
	all?: number;
	email?: number;
	sms?: number;
	call?: number;
	voicemail?: number;

	// Folder counts
	inbox?: number;
	sent?: number;
	archive?: number;
	trash?: number;
	starred?: number;

	// Email-specific personal inbox
	personal_inbox?: number;
	personal_sent?: number;
	personal_drafts?: number;

	// Email-specific company inbox
	company_support?: number;
	company_sales?: number;
	company_billing?: number;
	company_general?: number;

	// SMS-specific
	sms_inbox?: number;
	sms_sent?: number;
	sms_archive?: number;

	// Assigned
	assignedToMe?: number;
};

/**
 * Get unified communication sidebar configuration
 * Combines email and SMS navigation into a single sidebar
 *
 * @param counts - Folder and type counts for badges
 * @param activeType - Currently active type filter ('all', 'email', 'sms', 'call', 'voicemail')
 */
export function getUnifiedCommunicationSidebarConfig(
	counts?: UnifiedCommunicationCounts,
	activeType?: string,
): CommunicationSidebarConfig {
	return {
		navGroups: [
			{
				label: "MY INBOX",
				items: [
					{
						title: "All Messages",
						url: "/dashboard/communication?inbox=personal",
						icon: Inbox,
						badge: counts?.personal_inbox ?? 0,
					},
					{
						title: "Assigned to Me",
						url: "/dashboard/communication?inbox=personal&assigned=me",
						icon: Users,
						badge: counts?.assignedToMe ?? 0,
					},
					{
						title: "Starred",
						url: "/dashboard/communication?inbox=personal&folder=starred",
						icon: Star,
						badge: counts?.starred ?? 0,
					},
					{
						title: "Sent",
						url: "/dashboard/communication?inbox=personal&folder=sent",
						icon: Send,
						badge: counts?.personal_sent ?? 0,
					},
				],
			},
			{
				label: "COMPANY INBOXES",
				items: [
					{
						title: "General",
						url: "/dashboard/communication?inbox=company&category=general",
						icon: Inbox,
						badge: counts?.company_general ?? 0,
					},
					{
						title: "Sales",
						url: "/dashboard/communication?inbox=company&category=sales",
						icon: TrendingUp,
						badge: counts?.company_sales ?? 0,
					},
					{
						title: "Support",
						url: "/dashboard/communication?inbox=company&category=support",
						icon: HelpCircle,
						badge: counts?.company_support ?? 0,
					},
					{
						title: "Billing",
						url: "/dashboard/communication?inbox=company&category=billing",
						icon: CreditCard,
						badge: counts?.company_billing ?? 0,
					},
				],
			},
			{
				label: "TEAMS",
				items: [
					{
						title: "General",
						url: "/dashboard/communication?channel=general",
						icon: MessageSquare,
					},
					{
						title: "Sales",
						url: "/dashboard/communication?channel=sales",
						icon: MessageSquare,
					},
					{
						title: "Support",
						url: "/dashboard/communication?channel=support",
						icon: MessageSquare,
					},
					{
						title: "Technicians",
						url: "/dashboard/communication?channel=technicians",
						icon: MessageSquare,
					},
					{
						title: "Management",
						url: "/dashboard/communication?channel=management",
						icon: MessageSquare,
					},
				],
			},
		],
		primaryAction: {
			label: "New message",
			icon: Plus,
			onClick: () => {
				// Open message type selector
				if (typeof window !== "undefined") {
					window.dispatchEvent(
						new CustomEvent("open-unified-compose", {
							detail: { type: "selector" },
						}),
					);
				}
			},
		},
	};
}
