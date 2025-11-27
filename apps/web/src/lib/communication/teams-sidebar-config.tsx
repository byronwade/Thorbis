import { Hash, MessageCircle, Plus, Users } from "lucide-react";
import type { CommunicationSidebarConfig } from "@/components/communication/communication-sidebar";

/**
 * Teams sidebar configuration
 * Defines the navigation structure and actions for the teams communication page
 */
export const teamsSidebarConfig: CommunicationSidebarConfig = {
	navGroups: [
		{
			label: "Channels",
			items: [
				{
					title: "General",
					url: "/dashboard/communication/teams?channel=general",
					icon: Hash,
				},
				{
					title: "Sales",
					url: "/dashboard/communication/teams?channel=sales",
					icon: Hash,
				},
				{
					title: "Support",
					url: "/dashboard/communication/teams?channel=support",
					icon: Hash,
				},
				{
					title: "Technicians",
					url: "/dashboard/communication/teams?channel=technicians",
					icon: Hash,
				},
				{
					title: "Management",
					url: "/dashboard/communication/teams?channel=management",
					icon: Hash,
				},
			],
		},
	],
	primaryAction: {
		label: "New channel",
		icon: Plus,
		onClick: () => {
			// TODO: Implement new channel creation modal
		},
	},
};
