import type { CommunicationSidebarConfig } from "@/components/communication/communication-sidebar";
import {
    Archive,
    Clock,
    File,
    Inbox,
    Plus,
    Send,
    ShieldAlert,
    Tag,
    Trash2,
} from "lucide-react";

/**
 * Email sidebar configuration
 * Defines the navigation structure and actions for the email communication page
 */
export const emailSidebarConfig: CommunicationSidebarConfig = {
    navGroups: [
        {
            label: "Core",
            items: [
                {
                    title: "Inbox",
                    url: "/dashboard/communication",
                    icon: Inbox,
                    badge: 43260,
                },
                {
                    title: "Drafts",
                    url: "/dashboard/communication/drafts",
                    icon: File,
                    badge: 16,
                },
                {
                    title: "Sent",
                    url: "/dashboard/communication/sent",
                    icon: Send,
                    badge: 1848,
                },
            ],
        },
        {
            label: "Management",
            items: [
                {
                    title: "Archive",
                    url: "/dashboard/communication/archive",
                    icon: Archive,
                    badge: 201,
                },
                {
                    title: "Snoozed",
                    url: "/dashboard/communication/snoozed",
                    icon: Clock,
                },
                {
                    title: "Spam",
                    url: "/dashboard/communication/spam",
                    icon: ShieldAlert,
                    badge: 362,
                },
                {
                    title: "Bin",
                    url: "/dashboard/communication/trash",
                    icon: Trash2,
                    badge: 124,
                },
            ],
        },
    ],
    primaryAction: {
        label: "New email",
        icon: Plus,
        onClick: () => {
            // TODO: Implement new email action
            console.log("New email clicked");
        },
    },
    additionalSections: [
        {
            label: "Labels",
            items: [
                { title: "CSLB", icon: Tag },
                { title: "Notes", icon: Tag },
                { title: "Other", icon: Tag },
            ],
            onAddClick: () => {
                // TODO: Implement add label action
                console.log("Add label clicked");
            },
            scrollable: true,
            scrollHeight: "h-[200px]",
        },
    ],
};

