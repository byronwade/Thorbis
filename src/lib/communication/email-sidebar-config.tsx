import {
	Archive,
	Clock,
	File,
	Inbox,
	Plus,
	Send,
	ShieldAlert,
	Star,
	Tag,
} from "lucide-react";
import type { CommunicationSidebarConfig } from "@/components/communication/communication-sidebar";
import { CreateFolderDialog } from "@/components/communication/create-folder-dialog";

type FolderCounts = {
	inbox?: number;
	drafts?: number;
	sent?: number;
	archive?: number;
	snoozed?: number;
	spam?: number;
	trash?: number;
	starred?: number;
	[label: string]: number | undefined;
};

type CustomFolder = {
	id: string;
	name: string;
	slug: string;
	color?: string | null;
	icon?: string | null;
	sort_order: number;
};

type FolderItem = {
	title: string;
	icon: typeof Tag;
	badge?: number;
	url: string;
	folderId?: string; // For delete functionality
};

/**
 * Get email sidebar configuration with dynamic counts
 * @param counts - Optional folder counts to display as badges
 * @param customFolders - Optional custom folders from database
 */
export function getEmailSidebarConfig(
	counts?: FolderCounts,
	customFolders?: CustomFolder[]
): CommunicationSidebarConfig {
	// Build label items from custom folders
	const labelItems: FolderItem[] = [];

	// Add custom folders from database
	if (customFolders && customFolders.length > 0) {
		customFolders
			.sort((a, b) => a.sort_order - b.sort_order)
			.forEach((folder) => {
				labelItems.push({
					title: folder.name,
					icon: Tag,
					badge: counts?.[folder.slug],
					url: `/dashboard/communication/folder/${encodeURIComponent(folder.slug)}`,
					folderId: folder.id, // Include ID for delete functionality
				});
			});
	}

	// Add any additional labels from counts (legacy support)
	if (counts) {
		Object.keys(counts).forEach((key) => {
			if (
				!["inbox", "drafts", "sent", "archive", "snoozed", "spam", "trash", "starred"].includes(key) &&
				!labelItems.some((item) => item.url.includes(key))
			) {
				labelItems.push({
					title: key,
					icon: Tag,
					badge: counts[key],
					url: `/dashboard/communication/label/${encodeURIComponent(key.toLowerCase())}`,
				});
			}
		});
	}

	return {
		navGroups: [
			{
				label: "Core",
				items: [
					{
						title: "Inbox",
						url: "/dashboard/communication/email?folder=inbox",
						icon: Inbox,
						badge: counts?.inbox ?? 0,
					},
					{
						title: "Drafts",
						url: "/dashboard/communication/email?folder=drafts",
						icon: File,
						badge: counts?.drafts ?? 0,
					},
					{
						title: "Sent",
						url: "/dashboard/communication/email?folder=sent",
						icon: Send,
						badge: counts?.sent ?? 0,
					},
				],
			},
			{
				label: "Management",
				items: [
					{
						title: "Starred",
						url: "/dashboard/communication/email?folder=starred",
						icon: Star,
						badge: counts?.starred ?? 0,
					},
					{
						title: "Snoozed",
						url: "/dashboard/communication/email?folder=snoozed",
						icon: Clock,
						badge: counts?.snoozed ?? 0,
					},
					{
						title: "Spam",
						url: "/dashboard/communication/email?folder=spam",
						icon: ShieldAlert,
						badge: counts?.spam ?? 0,
					},
					{
						title: "Archive",
						url: "/dashboard/communication/email?folder=archive",
						icon: Archive,
						badge: counts?.archive ?? 0,
					},
				],
			},
		],
		primaryAction: {
			label: "New email",
			icon: Plus,
			onClick: () => {
				// This will be handled by the EmailSidebar component
				// which will open the RecipientSelector
				if (typeof window !== "undefined") {
					window.dispatchEvent(new CustomEvent("open-recipient-selector", { 
						detail: { type: "email" } 
					}));
				}
			},
		},
		additionalSections: [
			{
				label: "Folders",
				items: labelItems.map((item) => ({
					...item,
					url: item.url,
					folderId: item.folderId,
					// onDelete will be added by EmailSidebar component
				})),
				addButton: (
					<CreateFolderDialog
						onFolderCreated={() => {
							// Trigger sidebar refresh
							window.dispatchEvent(new Event("folder-created"));
						}}
					/>
				),
				scrollable: true,
				scrollHeight: "h-[200px]",
			},
		],
	};
}

/**
 * Default email sidebar configuration (for backwards compatibility)
 * @deprecated Use getEmailSidebarConfig() directly instead
 */
const emailSidebarConfig = getEmailSidebarConfig();
