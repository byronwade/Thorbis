import {
	Archive,
	Clock,
	File,
	Inbox,
	Mail,
	Plus,
	Send,
	ShieldAlert,
	Star,
	Tag,
} from "lucide-react";
import type { CommunicationSidebarConfig } from "@/components/communication/communication-sidebar";
import { CreateFolderDialog } from "@/components/communication/create-folder-dialog";

type FolderCounts = {
	all?: number;
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
				const count = counts?.[folder.slug];
				labelItems.push({
					title: folder.name,
					icon: Tag,
					badge: count && count > 0 ? count : undefined,
					url: `/dashboard/communication/folder/${encodeURIComponent(folder.slug)}`,
					folderId: folder.id, // Include ID for delete functionality
				});
			});
	}

	// Add any additional labels from counts (legacy support)
	if (counts) {
		Object.keys(counts).forEach((key) => {
			if (
				!["all", "inbox", "drafts", "sent", "archive", "snoozed", "spam", "trash", "starred"].includes(key) &&
				!labelItems.some((item) => item.url.includes(key))
			) {
				const count = counts[key];
				labelItems.push({
					title: key,
					icon: Tag,
					badge: count && count > 0 ? count : undefined,
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
						title: "All Mail",
						url: "/dashboard/communication/email?folder=all",
						icon: Mail,
						badge: counts?.all && counts.all > 0 ? counts.all : undefined,
					},
					{
						title: "Inbox",
						url: "/dashboard/communication/email?folder=inbox",
						icon: Inbox,
						badge: counts?.inbox && counts.inbox > 0 ? counts.inbox : undefined,
					},
					{
						title: "Drafts",
						url: "/dashboard/communication/email?folder=drafts",
						icon: File,
						badge: counts?.drafts && counts.drafts > 0 ? counts.drafts : undefined,
					},
					{
						title: "Sent",
						url: "/dashboard/communication/email?folder=sent",
						icon: Send,
						badge: counts?.sent && counts.sent > 0 ? counts.sent : undefined,
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
						badge: counts?.starred && counts.starred > 0 ? counts.starred : undefined,
					},
					{
						title: "Snoozed",
						url: "/dashboard/communication/email?folder=snoozed",
						icon: Clock,
						badge: counts?.snoozed && counts.snoozed > 0 ? counts.snoozed : undefined,
					},
					{
						title: "Spam",
						url: "/dashboard/communication/email?folder=spam",
						icon: ShieldAlert,
						badge: counts?.spam && counts.spam > 0 ? counts.spam : undefined,
					},
					{
						title: "Archive",
						url: "/dashboard/communication/email?folder=archive",
						icon: Archive,
						badge: counts?.archive && counts.archive > 0 ? counts.archive : undefined,
					},
				],
			},
		],
		primaryAction: {
			label: "New email",
			icon: Plus,
			href: "/dashboard/communication/email?compose=true",
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
				defaultOpen: true, // Keep Folders section open by default
			},
		],
	};
}

/**
 * Default email sidebar configuration (for backwards compatibility)
 * @deprecated Use getEmailSidebarConfig() directly instead
 */
const emailSidebarConfig = getEmailSidebarConfig();
