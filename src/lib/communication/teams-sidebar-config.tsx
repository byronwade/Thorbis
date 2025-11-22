import {
    Hash,
    Users,
    Plus,
    MessageCircle,
} from "lucide-react";
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
                    url: "/dashboard/communication/teams/general",
                    icon: Hash,
                },
                {
                    title: "Sales",
                    url: "/dashboard/communication/teams/sales",
                    icon: Hash,
                },
                {
                    title: "Support",
                    url: "/dashboard/communication/teams/support",
                    icon: Hash,
                },
                {
                    title: "Technicians",
                    url: "/dashboard/communication/teams/technicians",
                    icon: Hash,
                },
                {
                    title: "Management",
                    url: "/dashboard/communication/teams/management",
                    icon: Hash,
                },
            ],
        },
    ],
    primaryAction: {
        label: "New channel",
        icon: Plus,
        onClick: () => {
            // TODO: Implement new channel action
            console.log("New channel clicked");
        },
    },
};

