import { Archive, MessageSquare, Plus, Send, Users } from "lucide-react";
import type { CommunicationSidebarConfig } from "@/components/communication/communication-sidebar";

type SmsFolderCounts = {
	inbox?: number;
	sent?: number;
	archive?: number;
	trash?: number;
	[label: string]: number | undefined;
};

/**
 * Get SMS sidebar configuration with dynamic folder counts
 * Similar to getEmailSidebarConfig but for SMS
 */
export function getSmsSidebarConfig(counts?: SmsFolderCounts): CommunicationSidebarConfig {
	return {
		navGroups: [
			{
				label: "Core",
				items: [
					{
						title: "Inbox",
						url: "/dashboard/communication/sms?folder=inbox",
						icon: MessageSquare,
						badge: counts?.inbox ?? 0,
					},
					{
						title: "Sent",
						url: "/dashboard/communication/sms?folder=sent",
						icon: Send,
						badge: counts?.sent ?? 0,
					},
					{
						title: "Archive",
						url: "/dashboard/communication/sms?folder=archive",
						icon: Archive,
						badge: counts?.archive ?? 0,
					},
				],
			},
			{
				label: "Groups",
				items: [
					{
						title: "All Groups",
						url: "/dashboard/communication/sms?folder=groups",
						icon: Users,
					},
				],
			},
		],
		primaryAction: {
			label: "New text",
			icon: Plus,
			onClick: () => {
				// This will be handled by the TextSidebar component
				// which will open the RecipientSelector
				if (typeof window !== "undefined") {
					window.dispatchEvent(new CustomEvent("open-recipient-selector", { 
						detail: { type: "sms" } 
					}));
				}
			},
		},
		additionalSections: [
			{
				label: "Folders",
				items: [],
				scrollable: true,
				scrollHeight: "h-[200px]",
				defaultOpen: true, // Keep Folders section open by default (matching email page)
			},
		],
	};
}



