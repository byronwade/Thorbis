import type { CommunicationSidebarConfig } from "@/components/communication/communication-sidebar";
import {
    Archive,
    CreditCard,
    FileText,
    HelpCircle,
    Inbox,
    Mail,
    MessageSquare,
    Phone,
    PhoneIncoming,
    PhoneOutgoing,
    PhoneMissed,
    Plus,
    Send,
    Star,
    TrendingUp,
    Users,
    Voicemail
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
	personal_email_inbox?: number; // Emails specifically sent to user's email (mailbox_owner_id)
	personal_sent?: number;
	personal_drafts?: number;
	personal_archived?: number;

	// Email-specific company inbox (single unified inbox)
	company_inbox?: number; // Company inbox count (all categories combined)
	company_sent?: number;
	company_drafts?: number;
	company_archived?: number;
	company_starred?: number;
	
	// Legacy company category counts (for backwards compatibility)
	company_support?: number;
	company_sales?: number;
	company_billing?: number;
	company_general?: number;
	
	// Company inbox sub-folder counts (for each category: general, sales, support, billing)
	company_general_inbox?: number;
	company_general_starred?: number;
	company_general_sent?: number;
	company_general_drafts?: number;
	company_general_archived?: number;
	
	company_sales_inbox?: number;
	company_sales_starred?: number;
	company_sales_sent?: number;
	company_sales_drafts?: number;
	company_sales_archived?: number;
	
	company_support_inbox?: number;
	company_support_starred?: number;
	company_support_sent?: number;
	company_support_drafts?: number;
	company_support_archived?: number;
	
	company_billing_inbox?: number;
	company_billing_starred?: number;
	company_billing_sent?: number;
	company_billing_drafts?: number;
	company_billing_archived?: number;

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
				label: "All Messages",
				collapsible: true,
				defaultOpen: true,
				badge: (counts?.email ?? 0) + (counts?.call ?? 0) + (counts?.sms ?? 0) + (counts?.voicemail ?? 0),
				items: [
					{
						title: "Emails",
						url: "/dashboard/communication?inbox=personal&type=email",
						icon: Mail,
						badge: counts?.email ?? 0,
					},
					{
						title: "Calls",
						url: "/dashboard/communication?inbox=personal&type=call",
						icon: Phone,
						badge: counts?.call ?? 0,
					},
					{
						title: "Text Messages",
						url: "/dashboard/communication?inbox=personal&type=sms",
						icon: MessageSquare,
						badge: counts?.sms ?? 0,
					},
					{
						title: "Teams",
						url: "/dashboard/communication?channel=general",
						icon: MessageSquare,
						badge: 0, // TODO: Add team message count
					},
				],
			},
			{
				label: "MY INBOX",
				collapsible: true,
				defaultOpen: true,
				badge: counts?.personal_email_inbox ?? 0, // Show unread inbox count
				items: [
					{
						title: "Inbox",
						url: "/dashboard/communication?inbox=personal&folder=inbox",
						icon: Inbox,
						badge: counts?.personal_email_inbox ?? 0,
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
					{
						title: "Draft",
						url: "/dashboard/communication?inbox=personal&folder=draft",
						icon: FileText,
						badge: counts?.personal_drafts ?? 0,
					},
					{
						title: "Archived",
						url: "/dashboard/communication?inbox=personal&folder=archived",
						icon: Archive,
						badge: counts?.personal_archived ?? 0,
					},
				],
			},
			{
				label: "COMPANY INBOX",
				collapsible: true,
				defaultOpen: false,
				badge: counts?.company_inbox ?? 0,
				items: [
					{
						title: "Inbox",
						url: "/dashboard/communication?inbox=company",
						icon: Inbox,
						badge: counts?.company_inbox ?? 0,
					},
					{
						title: "Starred",
						url: "/dashboard/communication?inbox=company&folder=starred",
						icon: Star,
						badge: counts?.company_starred ?? 0,
					},
					{
						title: "Sent",
						url: "/dashboard/communication?inbox=company&folder=sent",
						icon: Send,
						badge: counts?.company_sent ?? 0,
					},
					{
						title: "Draft",
						url: "/dashboard/communication?inbox=company&folder=draft",
						icon: FileText,
						badge: counts?.company_drafts ?? 0,
					},
					{
						title: "Archived",
						url: "/dashboard/communication?inbox=company&folder=archived",
						icon: Archive,
						badge: counts?.company_archived ?? 0,
					},
				],
			},
			{
				label: "TEAMS",
				collapsible: true,
				defaultOpen: false,
				badge: 0, // TODO: Add team unread count
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
