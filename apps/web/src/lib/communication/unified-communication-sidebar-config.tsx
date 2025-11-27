import {
	Archive,
	CreditCard,
	HelpCircle,
	Inbox,
	Info,
	Mail,
	MessageSquare,
	Phone,
	Plus,
	Send,
	Star,
	TrendingUp,
	Users,
	Voicemail,
} from "lucide-react";
import type { CommunicationSidebarConfig } from "@/components/communication/communication-sidebar";

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
				label: "ALL COMMUNICATIONS",
				items: [
					{
						title: "All Messages",
						url: "/dashboard/communication",
						icon: Inbox,
						badge: counts?.all ?? 0,
					},
					{
						title: "Starred",
						url: "/dashboard/communication?folder=starred",
						icon: Star,
						badge: counts?.starred ?? 0,
					},
					{
						title: "Sent",
						url: "/dashboard/communication?folder=sent",
						icon: Send,
						badge: counts?.sent ?? 0,
					},
					{
						title: "Archive",
						url: "/dashboard/communication?folder=archive",
						icon: Archive,
						badge: counts?.archive ?? 0,
					},
				],
			},
			{
				label: "BY TYPE",
				items: [
					{
						title: "Emails",
						url: "/dashboard/communication?type=email",
						icon: Mail,
						badge: counts?.email ?? 0,
					},
					{
						title: "Text Messages",
						url: "/dashboard/communication?type=sms",
						icon: MessageSquare,
						badge: counts?.sms ?? 0,
					},
					{
						title: "Phone Calls",
						url: "/dashboard/communication?type=call",
						icon: Phone,
						badge: counts?.call ?? 0,
					},
					{
						title: "Voicemails",
						url: "/dashboard/communication?type=voicemail",
						icon: Voicemail,
						badge: counts?.voicemail ?? 0,
					},
				],
			},
			{
				label: "COMPANY INBOX",
				items: [
					{
						title: "Support",
						url: "/dashboard/communication?category=support",
						icon: HelpCircle,
						badge: counts?.company_support ?? 0,
					},
					{
						title: "Sales",
						url: "/dashboard/communication?category=sales",
						icon: TrendingUp,
						badge: counts?.company_sales ?? 0,
					},
					{
						title: "Billing",
						url: "/dashboard/communication?category=billing",
						icon: CreditCard,
						badge: counts?.company_billing ?? 0,
					},
					{
						title: "General",
						url: "/dashboard/communication?category=general",
						icon: Info,
						badge: counts?.company_general ?? 0,
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
		additionalSections: [
			{
				label: "Quick Access",
				items: [
					{
						title: "My Email",
						icon: Mail,
						url: "/dashboard/communication/email?inbox=personal&folder=inbox",
					},
					{
						title: "My SMS",
						icon: MessageSquare,
						url: "/dashboard/communication/sms?folder=inbox",
					},
					{
						title: "Team Chats",
						icon: Users,
						url: "/dashboard/communication/teams?channel=general",
					},
				],
				scrollable: false,
				defaultOpen: true,
			},
		],
	};
}
