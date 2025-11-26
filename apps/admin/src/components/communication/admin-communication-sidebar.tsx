"use client";

/**
 * AdminCommunicationSidebar - Navigation sidebar for communication section
 *
 * Provides navigation for the admin communication hub matching web dashboard patterns
 */

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	BarChart3,
	Building2,
	Inbox,
	Mail,
	MessageSquare,
	Phone,
	Ticket,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type NavItem = {
	title: string;
	url: string;
	icon: React.ElementType;
	badge?: number | string;
	description?: string;
};

type NavGroup = {
	label: string;
	items: NavItem[];
};

const navigationGroups: NavGroup[] = [
	{
		label: "Overview",
		items: [
			{
				title: "All Communications",
				url: "/dashboard/communication",
				icon: Building2,
				description: "Platform-wide communications hub",
			},
		],
	},
	{
		label: "Channels",
		items: [
			{
				title: "Email",
				url: "/dashboard/communication/email",
				icon: Mail,
				description: "Email communications",
			},
			{
				title: "SMS",
				url: "/dashboard/communication/sms",
				icon: MessageSquare,
				description: "Text messages",
			},
			{
				title: "Calls",
				url: "/dashboard/communication/calls",
				icon: Phone,
				description: "Phone call history",
			},
		],
	},
	{
		label: "Support",
		items: [
			{
				title: "Support Tickets",
				url: "/dashboard/communication/tickets",
				icon: Ticket,
				description: "Customer support queue",
			},
		],
	},
	{
		label: "Analytics",
		items: [
			{
				title: "Statistics",
				url: "/dashboard/communication/stats",
				icon: BarChart3,
				description: "Communication metrics",
			},
		],
	},
];

export function AdminCommunicationSidebar() {
	const pathname = usePathname() ?? "";

	const isActive = (url: string) => {
		if (url === "/dashboard/communication") {
			return pathname === url;
		}
		return pathname.startsWith(url);
	};

	return (
		<Sidebar collapsible="offcanvas" variant="inset">
			<SidebarHeader className="gap-3 px-3 pt-4 md:pt-0 pb-2">
				<div className="flex items-center gap-2 px-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
						<Inbox className="size-4 text-primary" />
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-semibold">Communications</span>
						<span className="text-xs text-muted-foreground">Admin Hub</span>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent>
				{navigationGroups.map((group) => (
					<SidebarGroup key={group.label}>
						<SidebarGroupLabel>{group.label}</SidebarGroupLabel>
						<SidebarMenu>
							{group.items.map((item) => {
								const Icon = item.icon;
								const active = isActive(item.url);

								return (
									<SidebarMenuItem key={item.url}>
										<SidebarMenuButton
											asChild
											isActive={active}
											tooltip={item.description}
										>
											<Link href={item.url}>
												<Icon className="size-4" />
												<span>{item.title}</span>
												{item.badge !== undefined && (
													<SidebarMenuBadge>
														{typeof item.badge === "number"
															? item.badge.toLocaleString()
															: item.badge}
													</SidebarMenuBadge>
												)}
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
