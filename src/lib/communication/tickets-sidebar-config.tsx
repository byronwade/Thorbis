import {
	AlertTriangle,
	CheckCircle,
	Clock,
	Plus,
	Ticket,
	User,
} from "lucide-react";
import type { CommunicationSidebarConfig } from "@/components/communication/communication-sidebar";

/**
 * Tickets sidebar configuration
 * Defines the navigation structure and actions for the support tickets page
 */
export const ticketsSidebarConfig: CommunicationSidebarConfig = {
	navGroups: [
		{
			label: "Status",
			items: [
				{
					title: "Open",
					url: "/dashboard/communication/tickets",
					icon: Ticket,
					badge: 12,
				},
				{
					title: "In Progress",
					url: "/dashboard/communication/tickets/in-progress",
					icon: Clock,
					badge: 5,
				},
				{
					title: "Resolved",
					url: "/dashboard/communication/tickets/resolved",
					icon: CheckCircle,
				},
				{
					title: "Priority",
					url: "/dashboard/communication/tickets/priority",
					icon: AlertTriangle,
					badge: 3,
				},
			],
		},
		{
			label: "Assignment",
			items: [
				{
					title: "Unassigned",
					url: "/dashboard/communication/tickets/unassigned",
					icon: User,
				},
				{
					title: "My Tickets",
					url: "/dashboard/communication/tickets/my-tickets",
					icon: User,
				},
			],
		},
	],
	primaryAction: {
		label: "New ticket",
		icon: Plus,
		onClick: () => {
			// TODO: Implement new ticket action
			console.log("New ticket clicked");
		},
	},
};



