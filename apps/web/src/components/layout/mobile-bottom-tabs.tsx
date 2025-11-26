"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
	BarChart3,
	Briefcase,
	Calendar,
	ChevronRight,
	DollarSign,
	GraduationCap,
	HelpCircle,
	Home,
	Megaphone,
	MessageSquare,
	MoreHorizontal,
	Settings,
	Sparkles,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type NavItemStatus = "beta" | "new" | "updated" | "coming-soon" | null;

type MoreNavItem = {
	label: string;
	href: string;
	icon: React.ElementType;
	status?: NavItemStatus;
	iconBg: string;
	iconColor: string;
	description?: string;
};

const moreNavigationItems: MoreNavItem[] = [
	{
		label: "Ask Thorbis",
		href: "/dashboard/ai",
		icon: Sparkles,
		status: "beta",
		iconBg: "bg-primary/10",
		iconColor: "text-primary",
		description: "AI-powered assistant",
	},
	{
		label: "Finances",
		href: "/dashboard/finance",
		icon: DollarSign,
		status: "coming-soon",
		iconBg: "bg-emerald-500/10",
		iconColor: "text-emerald-600",
		description: "Financial management",
	},
	{
		label: "Reporting",
		href: "/dashboard/reporting",
		icon: BarChart3,
		status: "coming-soon",
		iconBg: "bg-primary/10",
		iconColor: "text-primary",
		description: "Analytics and reports",
	},
	{
		label: "Marketing",
		href: "/dashboard/marketing",
		icon: Megaphone,
		status: "coming-soon",
		iconBg: "bg-accent/10",
		iconColor: "text-accent-foreground",
		description: "Marketing campaigns",
	},
	{
		label: "Training",
		href: "/dashboard/training",
		icon: GraduationCap,
		status: "coming-soon",
		iconBg: "bg-accent/10",
		iconColor: "text-accent-foreground",
		description: "Learning center",
	},
	{
		label: "Settings",
		href: "/dashboard/settings",
		icon: Settings,
		iconBg: "bg-muted/50",
		iconColor: "text-muted-foreground",
		description: "App preferences",
	},
	{
		label: "Help",
		href: "/help",
		icon: HelpCircle,
		iconBg: "bg-muted/50",
		iconColor: "text-muted-foreground",
		description: "Get support",
	},
];

function StatusBadge({ status }: { status?: NavItemStatus }) {
	if (!status) {
		return null;
	}

	const styles = {
		beta: "bg-blue-500 text-white",
		new: "bg-green-500 text-white",
		updated: "bg-purple-500 text-white",
		"coming-soon": "bg-purple-500 text-white",
	};

	const labels = {
		beta: "Beta",
		new: "New",
		updated: "Updated",
		"coming-soon": "Soon",
	};

	return (
		<span
			className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide uppercase ${styles[status]}`}
		>
			{labels[status]}
		</span>
	);
}

function formatBadgeCount(count: number): string {
	if (count <= 9) {
		return count.toString();
	}
	if (count <= 99) {
		return "99+";
	}
	if (count <= 999) {
		return "999+";
	}
	return "1K+";
}

type MobileBottomTabsProps = {
	unreadCount?: number;
};

export function MobileBottomTabs({ unreadCount = 0 }: MobileBottomTabsProps) {
	const pathname = usePathname();
	const [isMoreOpen, setIsMoreOpen] = useState(false);

	// Hide bottom tabs on TV route and welcome route
	const isTVRoute = pathname === "/dashboard/tv";
	const isWelcomeRoute = pathname === "/welcome";

	// Don't render on TV or welcome routes
	if (isTVRoute || isWelcomeRoute) {
		return null;
	}

	// Define primary tabs (always visible at bottom)
	// Use mobile-optimized dashboard pages for Work and Communication tabs
	const tabs = [
		{
			label: "Today",
			href: "/dashboard",
			icon: Home,
		},
		{
			label: "Messages",
			href: "/dashboard/communication/mobile",
			icon: MessageSquare,
			badge: unreadCount,
		},
		{
			label: "Work",
			href: "/dashboard/work/mobile",
			icon: Briefcase,
		},
		{
			label: "Schedule",
			href: "/dashboard/schedule",
			icon: Calendar,
		},
		{
			label: "More",
			icon: MoreHorizontal,
			onClick: () => setIsMoreOpen(true),
		},
	];

	return (
		<>
			{/* Mobile Bottom Tab Bar - iOS/Android style */}
			<nav className="safe-bottom bg-background fixed bottom-0 left-0 right-0 z-40 border-t border-border lg:hidden">
				<div className="grid h-16 grid-cols-5">
					{tabs.map((tab) => {
						// Determine if tab is active
						let isActive = false;
						if (tab.href) {
							if (tab.href === "/dashboard") {
								// Today tab - exact match only
								isActive = pathname === "/dashboard";
							} else if (tab.href === "/dashboard/communication/mobile") {
								// Communication tab - match /dashboard/communication/* (including /mobile)
								isActive = pathname?.startsWith("/dashboard/communication");
							} else if (tab.href === "/dashboard/work/mobile") {
								// Work tab - match /dashboard/work/* (including /mobile) or /dashboard/customers
								isActive =
									pathname?.startsWith("/dashboard/work") ||
									pathname?.startsWith("/dashboard/customers");
							} else {
								// Other tabs - standard prefix match
								isActive = pathname?.startsWith(tab.href);
							}
						}

						const Icon = tab.icon;

						// If tab has onClick (More button), render as button
						if (tab.onClick) {
							return (
								<button
									className={`flex flex-col items-center justify-center gap-1 transition-colors ${
										isMoreOpen
											? "text-primary"
											: "text-muted-foreground hover:text-foreground active:text-primary"
									}`}
									key={tab.label}
									onClick={tab.onClick}
									type="button"
									aria-label="Open more menu"
									aria-expanded={isMoreOpen}
								>
									<div className="relative">
										<Icon className="h-6 w-6" />
									</div>
									<span className="text-[0.65rem] font-medium leading-tight">
										{tab.label}
									</span>
								</button>
							);
						}

						// Regular tab with link
						return (
							<Link
								className={`flex flex-col items-center justify-center gap-1 transition-colors ${
									isActive
										? "text-primary"
										: "text-muted-foreground hover:text-foreground active:text-primary"
								}`}
								href={tab.href!}
								key={tab.label}
							>
								<div className="relative">
									<Icon className="h-6 w-6" />
									{typeof tab.badge === "number" && tab.badge > 0 && (
										<>
											<span className="absolute top-0 right-0 flex h-2 w-2">
												<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
												<span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
											</span>
											<span className="sr-only">
												{tab.badge} unread{" "}
												{tab.badge === 1 ? "message" : "messages"}
											</span>
										</>
									)}
									{isActive && (
										<div className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
									)}
								</div>
								<span className="text-[0.65rem] font-medium leading-tight">
									{tab.label}
								</span>
							</Link>
						);
					})}
				</div>
			</nav>

			{/* More Menu - Full Screen Overlay with Dialog (includes focus trap) */}
			<Dialog.Root open={isMoreOpen} onOpenChange={setIsMoreOpen}>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 lg:hidden" />
					<Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
						{/* Header with Close Button */}
						<div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
							<div className="flex items-center justify-between px-4 h-14">
								<Dialog.Title className="text-lg font-bold tracking-tight">
									More
								</Dialog.Title>
								<Dialog.Close
									className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent/80 transition-colors active:scale-95"
									aria-label="Close menu"
								>
									<X className="h-6 w-6" />
								</Dialog.Close>
							</div>
						</div>

						{/* Scrollable Content */}
						<div className="h-[calc(100vh-3.5rem)] overflow-y-auto px-4 py-6">
							<div className="space-y-3 pb-safe">
								{moreNavigationItems.map((item) => {
									const isActive = pathname?.startsWith(item.href);
									const Icon = item.icon;

									return (
										<Link
											className={`group flex items-center gap-4 rounded-2xl border-2 p-5 transition-all duration-200 active:scale-[0.98] ${
												isActive
													? "border-primary/40 bg-primary/10 text-primary shadow-lg shadow-primary/20"
													: "border-border bg-card text-card-foreground hover:border-primary/30 hover:bg-primary/5 hover:shadow-md"
											}`}
											href={item.href}
											key={item.href}
											onClick={() => setIsMoreOpen(false)}
										>
											<div
												className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${item.iconBg} ${
													isActive ? "scale-105" : "group-hover:scale-105"
												}`}
											>
												<Icon className={`h-7 w-7 ${item.iconColor}`} />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<span className="font-semibold text-base">
														{item.label}
													</span>
													{item.status && <StatusBadge status={item.status} />}
												</div>
												{item.description && (
													<p className="text-muted-foreground text-sm leading-snug">
														{item.description}
													</p>
												)}
											</div>
											<ChevronRight
												className={`h-5 w-5 text-muted-foreground/50 transition-all ${
													isActive
														? "text-primary"
														: "group-hover:translate-x-1"
												}`}
											/>
										</Link>
									);
								})}
							</div>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	);
}
