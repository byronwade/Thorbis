import {
	Archive,
	CreditCard,
	File,
	HelpCircle,
	Inbox,
	Info,
	Send,
	Star,
	TrendingUp,
} from "lucide-react";
import type { CommunicationSidebarConfig } from "@/components/communication/communication-sidebar";

/**
 * Get communication sidebar configuration for the main communication hub
 * Matches the email sidebar structure with MY INBOX and COMPANY INBOX sections
 */
export function getCommunicationReportsSidebarConfig(): CommunicationSidebarConfig {
	return {
		navGroups: [
			{
				label: "MY INBOX",
				items: [
					{
						title: "Inbox",
						url: "/dashboard/communication/email?inbox=personal&folder=inbox",
						icon: Inbox,
					},
					{
						title: "Sent",
						url: "/dashboard/communication/email?inbox=personal&folder=sent",
						icon: Send,
					},
					{
						title: "Drafts",
						url: "/dashboard/communication/email?inbox=personal&folder=drafts",
						icon: File,
					},
					{
						title: "Starred",
						url: "/dashboard/communication/email?inbox=personal&folder=starred",
						icon: Star,
					},
					{
						title: "Archive",
						url: "/dashboard/communication/email?inbox=personal&folder=archive",
						icon: Archive,
					},
				],
			},
			{
				label: "COMPANY INBOX",
				items: [
					{
						title: "Support",
						url: "/dashboard/communication/email?inbox=company&category=support",
						icon: HelpCircle,
					},
					{
						title: "Sales",
						url: "/dashboard/communication/email?inbox=company&category=sales",
						icon: TrendingUp,
					},
					{
						title: "Billing",
						url: "/dashboard/communication/email?inbox=company&category=billing",
						icon: CreditCard,
					},
					{
						title: "General",
						url: "/dashboard/communication/email?inbox=company&category=general",
						icon: Info,
					},
				],
			},
		],
		primaryAction: undefined,
		additionalSections: [
			{
				label: "Folders",
				items: [],
				scrollable: true,
				scrollHeight: "h-[200px]",
				defaultOpen: true,
			},
		],
	};
}








