import type { CommunicationSidebarConfig } from "@/components/communication/communication-sidebar";
import {
    MessageSquare,
    Send,
    Archive,
    Plus,
    Users,
} from "lucide-react";

/**
 * Text/SMS sidebar configuration
 * Defines the navigation structure and actions for the text communication page
 */
export const textSidebarConfig: CommunicationSidebarConfig = {
    navGroups: [
        {
            label: "Core",
            items: [
                {
                    title: "Inbox",
                    url: "/dashboard/communication/text",
                    icon: MessageSquare,
                    badge: 3,
                },
                {
                    title: "Sent",
                    url: "/dashboard/communication/text/sent",
                    icon: Send,
                },
                {
                    title: "Archive",
                    url: "/dashboard/communication/text/archive",
                    icon: Archive,
                },
            ],
        },
        {
            label: "Groups",
            items: [
                {
                    title: "All Groups",
                    url: "/dashboard/communication/text/groups",
                    icon: Users,
                },
            ],
        },
    ],
    primaryAction: {
        label: "New text",
        icon: Plus,
        onClick: () => {
            // TODO: Implement new text action
            console.log("New text clicked");
        },
    },
};

