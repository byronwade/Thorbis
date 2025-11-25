import {
	Archive,
	Building2,
	Clock,
	File,
	Inbox,
	Info,
	Mail,
	Plus,
	Send,
	ShieldAlert,
	Star,
	Tag,
	User,
	CreditCard,
	TrendingUp,
	HelpCircle,
} from "lucide-react";
import type { CommunicationSidebarConfig } from "@/components/communication/communication-sidebar";
import { CreateFolderDialog } from "@/components/communication/create-folder-dialog";

type FolderCounts = {
	// Personal inbox counts
	personal_inbox?: number;
	personal_drafts?: number;
	personal_sent?: number;
	personal_archive?: number;
	personal_starred?: number;

	// Company inbox counts (by category)
	company_support?: number;
	company_sales?: number;
	company_billing?: number;
	company_general?: number;

	// Legacy counts (deprecated, for backwards compatibility)
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
				label: "MY INBOX",
				items: [
					{
						title: "Inbox",
						url: "/dashboard/communication/email?inbox=personal&folder=inbox",
						icon: Inbox,
						badge: counts?.personal_inbox && counts.personal_inbox > 0 ? counts.personal_inbox : undefined,
					},
					{
						title: "Sent",
						url: "/dashboard/communication/email?inbox=personal&folder=sent",
						icon: Send,
						badge: counts?.personal_sent && counts.personal_sent > 0 ? counts.personal_sent : undefined,
					},
					{
						title: "Drafts",
						url: "/dashboard/communication/email?inbox=personal&folder=drafts",
						icon: File,
						badge: counts?.personal_drafts && counts.personal_drafts > 0 ? counts.personal_drafts : undefined,
					},
					{
						title: "Starred",
						url: "/dashboard/communication/email?inbox=personal&folder=starred",
						icon: Star,
						badge: counts?.personal_starred && counts.personal_starred > 0 ? counts.personal_starred : undefined,
					},
					{
						title: "Archive",
						url: "/dashboard/communication/email?inbox=personal&folder=archive",
						icon: Archive,
						badge: counts?.personal_archive && counts.personal_archive > 0 ? counts.personal_archive : undefined,
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
						badge: counts?.company_support && counts.company_support > 0 ? counts.company_support : undefined,
					},
					{
						title: "Sales",
						url: "/dashboard/communication/email?inbox=company&category=sales",
						icon: TrendingUp,
						badge: counts?.company_sales && counts.company_sales > 0 ? counts.company_sales : undefined,
					},
					{
						title: "Billing",
						url: "/dashboard/communication/email?inbox=company&category=billing",
						icon: CreditCard,
						badge: counts?.company_billing && counts.company_billing > 0 ? counts.company_billing : undefined,
					},
					{
						title: "General",
						url: "/dashboard/communication/email?inbox=company&category=general",
						icon: Info,
						badge: counts?.company_general && counts.company_general > 0 ? counts.company_general : undefined,
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
