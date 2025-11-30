"use client";

/**
 * Admin Sidebar - Using shadcn Sidebar Components
 *
 * Navigation sections for each route, matching web dashboard patterns
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Activity,
	AlertCircle,
	BarChart,
	Building2,
	Calendar,
	CreditCard,
	Database,
	DollarSign,
	FileText,
	HelpCircle,
	Home,
	LifeBuoy,
	Mail,
	Megaphone,
	MessageSquare,
	Phone,
	Settings,
	Sparkles,
	Target,
	Ticket,
	TrendingUp,
	UserPlus,
	Users,
	Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type NavItem = {
	title: string;
	url: string;
	icon: React.ComponentType<{ className?: string }>;
	badge?: string;
};

type NavGroup = {
	label?: string;
	items: NavItem[];
};

const navigationSections: Record<string, NavGroup[]> = {
	today: [],
	ai: [
		{
			label: undefined,
			items: [
				{
					title: "AI Assistant",
					url: "/dashboard/ai",
					icon: Sparkles,
				},
				{
					title: "Automation",
					url: "/dashboard/ai/automation",
					icon: Zap,
				},
			],
		},
	],
	schedule: [
		{
			label: "Thorbis Team",
			items: [
				{
					title: "Team Calendar",
					url: "/dashboard/schedule",
					icon: Calendar,
				},
				{
					title: "Team Members",
					url: "/dashboard/schedule/team",
					icon: Users,
				},
				{
					title: "Time Off",
					url: "/dashboard/schedule/time-off",
					icon: Calendar,
				},
			],
		},
	],
	communication: [
		{
			label: "Channels",
			items: [
				{
					title: "All Messages",
					url: "/dashboard/communication",
					icon: MessageSquare,
				},
				{
					title: "Email",
					url: "/dashboard/communication/email",
					icon: Mail,
				},
				{
					title: "Support Tickets",
					url: "/dashboard/communication/tickets",
					icon: Ticket,
				},
				{
					title: "Calls",
					url: "/dashboard/communication/calls",
					icon: Phone,
				},
			],
		},
	],
	work: [
		{
			label: "Company Management",
			items: [
				{
					title: "Companies",
					url: "/dashboard/work/companies",
					icon: Building2,
				},
				{
					title: "Users",
					url: "/dashboard/work/users",
					icon: Users,
				},
			],
		},
		{
			label: "Billing",
			items: [
				{
					title: "Dashboard",
					url: "/dashboard/work/billing",
					icon: DollarSign,
				},
				{
					title: "Subscriptions",
					url: "/dashboard/work/subscriptions",
					icon: CreditCard,
				},
			],
		},
		{
			label: "Monitoring",
			items: [
				{
					title: "System Health",
					url: "/dashboard/work/system-health",
					icon: Activity,
				},
				{
					title: "Error Tracking",
					url: "/dashboard/work/errors",
					icon: AlertCircle,
				},
				{
					title: "Integrations",
					url: "/dashboard/work/integrations",
					icon: Zap,
				},
				{
					title: "Webhooks",
					url: "/dashboard/work/webhooks",
					icon: Activity,
				},
				{
					title: "Communications",
					url: "/dashboard/work/communications",
					icon: Mail,
				},
			],
		},
		{
			label: "Security & Audit",
			items: [
				{
					title: "Audit Log",
					url: "/dashboard/work/audit",
					icon: FileText,
				},
				{
					title: "Security",
					url: "/dashboard/work/security",
					icon: Settings,
				},
			],
		},
		{
			label: "Platform",
			items: [
				{
					title: "Settings",
					url: "/dashboard/work/platform",
					icon: Settings,
				},
				{
					title: "Data Management",
					url: "/dashboard/work/data",
					icon: Database,
				},
			],
		},
		{
			label: "Support",
			items: [
				{
					title: "Support Tickets",
					url: "/dashboard/work/support",
					icon: LifeBuoy,
				},
				{
					title: "Onboarding",
					url: "/dashboard/work/onboarding",
					icon: UserPlus,
				},
				{
					title: "Help Center",
					url: "/dashboard/work/help-center",
					icon: HelpCircle,
				},
			],
		},
	],
	marketing: [
		{
			label: "Overview",
			items: [
				{
					title: "Dashboard",
					url: "/dashboard/marketing",
					icon: Megaphone,
				},
				{
					title: "Campaigns",
					url: "/dashboard/marketing/campaigns",
					icon: Target,
				},
			],
		},
		{
			label: "Content",
			items: [
				{
					title: "Website",
					url: "/dashboard/marketing/website",
					icon: TrendingUp,
				},
				{
					title: "Blog",
					url: "/dashboard/marketing/blog",
					icon: FileText,
				},
				{
					title: "Email Campaigns",
					url: "/dashboard/marketing/email",
					icon: Mail,
				},
			],
		},
	],
	finance: [
		{
			label: "Overview",
			items: [
				{
					title: "Dashboard",
					url: "/dashboard/finance",
					icon: DollarSign,
				},
				{
					title: "Revenue",
					url: "/dashboard/finance/revenue",
					icon: TrendingUp,
				},
			],
		},
		{
			label: "Billing",
			items: [
				{
					title: "Invoices",
					url: "/dashboard/finance/invoices",
					icon: FileText,
				},
				{
					title: "Subscriptions",
					url: "/dashboard/finance/subscriptions",
					icon: CreditCard,
				},
				{
					title: "Payments",
					url: "/dashboard/finance/payments",
					icon: CreditCard,
				},
			],
		},
	],
	analytics: [
		{
			label: "Platform",
			items: [
				{
					title: "Overview",
					url: "/dashboard/analytics",
					icon: BarChart,
				},
				{
					title: "Usage Metrics",
					url: "/dashboard/analytics/usage",
					icon: TrendingUp,
				},
				{
					title: "Performance",
					url: "/dashboard/analytics/performance",
					icon: Zap,
				},
			],
		},
		{
			label: "Companies",
			items: [
				{
					title: "Company Analytics",
					url: "/dashboard/analytics/companies",
					icon: Building2,
				},
				{
					title: "Growth",
					url: "/dashboard/analytics/growth",
					icon: TrendingUp,
				},
				{
					title: "Retention",
					url: "/dashboard/analytics/retention",
					icon: Users,
				},
			],
		},
	],
	settings: [
		{
			label: undefined,
			items: [
				{
					title: "Overview",
					url: "/dashboard/settings",
					icon: Settings,
				},
			],
		},
		{
			label: "Account",
			items: [
				{
					title: "Profile",
					url: "/dashboard/settings/profile",
					icon: Users,
				},
				{
					title: "Security",
					url: "/dashboard/settings/security",
					icon: Settings,
				},
			],
		},
		{
			label: "Platform",
			items: [
				{
					title: "General",
					url: "/dashboard/settings/general",
					icon: Settings,
				},
				{
					title: "Billing",
					url: "/dashboard/settings/billing",
					icon: CreditCard,
				},
				{
					title: "Integrations",
					url: "/dashboard/settings/integrations",
					icon: Zap,
				},
			],
		},
	],
};

function getCurrentSection(
	pathname: string
): keyof typeof navigationSections {
	if (pathname === "/dashboard") return "today";
	if (pathname.startsWith("/dashboard/ai")) return "ai";
	if (pathname.startsWith("/dashboard/schedule")) return "schedule";
	if (pathname.startsWith("/dashboard/communication")) return "communication";
	if (pathname.startsWith("/dashboard/work")) return "work";
	if (pathname.startsWith("/dashboard/marketing")) return "marketing";
	if (pathname.startsWith("/dashboard/finance")) return "finance";
	if (pathname.startsWith("/dashboard/analytics")) return "analytics";
	if (pathname.startsWith("/dashboard/settings")) return "settings";
	return "today";
}

type AdminSidebarProps = React.ComponentProps<typeof Sidebar>;

export function AdminSidebar(props: AdminSidebarProps) {
	const pathname = usePathname() ?? "/dashboard";
	const currentSection = getCurrentSection(pathname);
	const groups = navigationSections[currentSection];

	// Today page has no sidebar content
	if (currentSection === "today" || groups.length === 0) {
		return null;
	}

	return (
		<Sidebar collapsible="offcanvas" variant="inset" {...props}>
			<SidebarContent>
				{groups.map((group, groupIndex) => (
					<SidebarGroup key={groupIndex}>
						{group.label && (
							<SidebarGroupLabel>{group.label}</SidebarGroupLabel>
						)}
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => {
									const isActive =
										item.url === "/dashboard"
											? pathname === "/dashboard"
											: pathname?.startsWith(item.url);
									const Icon = item.icon;

									return (
										<SidebarMenuItem key={item.url}>
											<SidebarMenuButton
												asChild
												isActive={isActive}
												tooltip={item.title}
											>
												<Link href={item.url}>
													<Icon className="h-4 w-4" />
													<span>{item.title}</span>
													{item.badge && (
														<Badge
															variant="secondary"
															className="ml-auto text-xs bg-primary/10 text-primary"
														>
															{item.badge}
														</Badge>
													)}
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			{/* Footer */}
			<SidebarFooter>
				<div className="rounded-lg bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-4">
					<div className="flex items-center gap-2 mb-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
							<Sparkles className="h-4 w-4 text-primary" />
						</div>
						<div>
							<span className="text-sm font-semibold">Admin Panel</span>
							<p className="text-xs text-muted-foreground">v1.0.0</p>
						</div>
					</div>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
