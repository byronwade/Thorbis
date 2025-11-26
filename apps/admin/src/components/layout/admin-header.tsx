"use client";

import { HelpCircle, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminUserMenu } from "./admin-user-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Admin Header - Client Component
 *
 * Matches the web dashboard header design with:
 * - Logo
 * - Main navigation (Ask Thorbis, Today, Schedule, Communication, Work, Marketing, Finance, Analytics)
 * - User menu
 */

type NavItemStatus = "beta" | "new" | "coming-soon" | null;

type NavItem = {
	label: string;
	href: string;
	status?: NavItemStatus;
	isSpecial?: boolean;
};

const navigationItems: NavItem[] = [
	{
		label: "Ask Thorbis",
		href: "/dashboard/ai",
		status: "beta",
		isSpecial: true,
	},
	{
		label: "Today",
		href: "/dashboard",
	},
	{
		label: "Schedule",
		href: "/dashboard/schedule",
	},
	{
		label: "Communication",
		href: "/dashboard/communication",
	},
	{
		label: "Work",
		href: "/dashboard/work",
	},
	{
		label: "Marketing",
		href: "/dashboard/marketing",
	},
	{
		label: "Finance",
		href: "/dashboard/finance",
	},
	{
		label: "Analytics",
		href: "/dashboard/analytics",
	},
];

function StatusBadge({ status }: { status?: NavItemStatus }) {
	if (!status) return null;

	const variants: Record<string, { label: string; className: string }> = {
		beta: {
			label: "Beta",
			className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
		},
		new: {
			label: "New",
			className: "bg-green-500/10 text-green-500 border-green-500/20",
		},
		"coming-soon": {
			label: "Soon",
			className: "bg-purple-500/10 text-purple-500 border-purple-500/20",
		},
	};

	const variant = variants[status];
	if (!variant) return null;

	return (
		<span
			className={cn(
				"absolute -top-1.5 right-0 rounded px-1 py-0.5 text-[0.5rem] leading-none font-semibold tracking-wide uppercase shadow-sm border",
				variant.className
			)}
		>
			{variant.label}
		</span>
	);
}

export function AdminHeader() {
	const pathname = usePathname();

	return (
		<TooltipProvider>
			<header className="sticky top-0 z-50 w-full bg-header-bg backdrop-blur supports-[backdrop-filter]:bg-header-bg/95">
				<div className="flex h-14 items-center gap-2 px-4 md:px-6">
					{/* Logo */}
					<Link
						className="flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all h-8 w-8 hover:bg-accent"
						href="/"
					>
						<Image
							alt="Thorbis Admin"
							className="h-5 w-5"
							height={20}
							src="/ThorbisLogo.webp"
							width={20}
						/>
						<span className="sr-only">Thorbis Admin</span>
					</Link>

					{/* Admin Badge */}
					<Badge
						variant="outline"
						className="hidden md:inline-flex bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20"
					>
						Admin
					</Badge>

					{/* Main Navigation */}
					<nav className="hidden items-center gap-0.5 ml-2 lg:flex">
						{navigationItems.map((item) => {
							const isActive =
								item.href === "/dashboard"
									? pathname === "/dashboard"
									: pathname?.startsWith(item.href);

							return (
								<div className="relative" key={item.href}>
									<Link
										className={cn(
											"relative inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
											isActive
												? "bg-primary/15 text-primary shadow-sm"
												: "text-muted-foreground hover:bg-accent hover:text-foreground"
										)}
										href={item.href}
									>
										{item.label}
									</Link>
									<StatusBadge status={item.status} />
								</div>
							);
						})}
					</nav>

					{/* Right side controls */}
					<div className="ml-auto flex items-center gap-1">
						{/* Settings */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8" asChild>
									<Link href="/dashboard/settings">
										<Settings className="h-4 w-4" />
										<span className="sr-only">Settings</span>
									</Link>
								</Button>
							</TooltipTrigger>
							<TooltipContent>Settings</TooltipContent>
						</Tooltip>

						{/* Help */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<HelpCircle className="h-4 w-4" />
									<span className="sr-only">Help</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent>Help</TooltipContent>
						</Tooltip>

						{/* User Menu */}
						<AdminUserMenu />
					</div>
				</div>
			</header>
		</TooltipProvider>
	);
}
