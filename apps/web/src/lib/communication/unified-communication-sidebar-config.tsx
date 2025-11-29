import type { CommunicationSidebarConfig } from "@/components/communication/communication-sidebar";
import {
    Archive,
    CreditCard,
    FileText,
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
	personal_archived?: number;

	// Email-specific company inbox
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
				label: "COMPANY INBOXES",
				items: [
					{
						title: "General",
						url: "/dashboard/communication?inbox=company&category=general",
						icon: Inbox,
						badge: counts?.company_general_inbox ?? counts?.company_general ?? 0,
						items: [
							{
								title: "Inbox",
								url: "/dashboard/communication?inbox=company&category=general",
								badge: counts?.company_general_inbox ?? 0,
							},
							{
								title: "Starred",
								url: "/dashboard/communication?inbox=company&category=general&folder=starred",
								badge: counts?.company_general_starred ?? 0,
							},
							{
								title: "Sent",
								url: "/dashboard/communication?inbox=company&category=general&folder=sent",
								badge: counts?.company_general_sent ?? 0,
							},
							{
								title: "Draft",
								url: "/dashboard/communication?inbox=company&category=general&folder=draft",
								badge: counts?.company_general_drafts ?? 0,
							},
							{
								title: "Archived",
								url: "/dashboard/communication?inbox=company&category=general&folder=archived",
								badge: counts?.company_general_archived ?? 0,
							},
						],
					},
					{
						title: "Sales",
						url: "/dashboard/communication?inbox=company&category=sales",
						icon: TrendingUp,
						badge: counts?.company_sales_inbox ?? counts?.company_sales ?? 0,
						items: [
							{
								title: "Inbox",
								url: "/dashboard/communication?inbox=company&category=sales",
								badge: counts?.company_sales_inbox ?? 0,
							},
							{
								title: "Starred",
								url: "/dashboard/communication?inbox=company&category=sales&folder=starred",
								badge: counts?.company_sales_starred ?? 0,
							},
							{
								title: "Sent",
								url: "/dashboard/communication?inbox=company&category=sales&folder=sent",
								badge: counts?.company_sales_sent ?? 0,
							},
							{
								title: "Draft",
								url: "/dashboard/communication?inbox=company&category=sales&folder=draft",
								badge: counts?.company_sales_drafts ?? 0,
							},
							{
								title: "Archived",
								url: "/dashboard/communication?inbox=company&category=sales&folder=archived",
								badge: counts?.company_sales_archived ?? 0,
							},
						],
					},
					{
						title: "Support",
						url: "/dashboard/communication?inbox=company&category=support",
						icon: HelpCircle,
						badge: counts?.company_support_inbox ?? counts?.company_support ?? 0,
						items: [
							{
								title: "Inbox",
								url: "/dashboard/communication?inbox=company&category=support",
								badge: counts?.company_support_inbox ?? 0,
							},
							{
								title: "Starred",
								url: "/dashboard/communication?inbox=company&category=support&folder=starred",
								badge: counts?.company_support_starred ?? 0,
							},
							{
								title: "Sent",
								url: "/dashboard/communication?inbox=company&category=support&folder=sent",
								badge: counts?.company_support_sent ?? 0,
							},
							{
								title: "Draft",
								url: "/dashboard/communication?inbox=company&category=support&folder=draft",
								badge: counts?.company_support_drafts ?? 0,
							},
							{
								title: "Archived",
								url: "/dashboard/communication?inbox=company&category=support&folder=archived",
								badge: counts?.company_support_archived ?? 0,
							},
						],
					},
					{
						title: "Billing",
						url: "/dashboard/communication?inbox=company&category=billing",
						icon: CreditCard,
						badge: counts?.company_billing_inbox ?? counts?.company_billing ?? 0,
						items: [
							{
								title: "Inbox",
								url: "/dashboard/communication?inbox=company&category=billing",
								badge: counts?.company_billing_inbox ?? 0,
							},
							{
								title: "Starred",
								url: "/dashboard/communication?inbox=company&category=billing&folder=starred",
								badge: counts?.company_billing_starred ?? 0,
							},
							{
								title: "Sent",
								url: "/dashboard/communication?inbox=company&category=billing&folder=sent",
								badge: counts?.company_billing_sent ?? 0,
							},
							{
								title: "Draft",
								url: "/dashboard/communication?inbox=company&category=billing&folder=draft",
								badge: counts?.company_billing_drafts ?? 0,
							},
							{
								title: "Archived",
								url: "/dashboard/communication?inbox=company&category=billing&folder=archived",
								badge: counts?.company_billing_archived ?? 0,
							},
						],
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
