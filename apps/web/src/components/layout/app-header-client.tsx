"use client";

import { GalleryVerticalEnd, HelpCircle, Tv } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getTotalUnreadCountAction } from "@/actions/email-actions";
import { PendingActionsIndicator } from "@/components/ai/pending-actions-indicator";
import { useDialerShortcut } from "@/hooks/use-dialer-shortcut";
import type { UserProfile } from "@/lib/auth/user-data";
import type { WeatherData } from "@/lib/services/weather-service";
import { HelpDropdown } from "./help-dropdown";
import { NotificationsDropdown } from "./notifications-dropdown";
import { PhoneDropdown } from "./phone-dropdown";
import { QuickAddDropdown } from "./quick-add-dropdown";
import { UserMenu } from "./user-menu";
import { WeatherDropdown } from "./weather-dropdown";

/**
 * AppHeaderClient - Client Component (Minimal Interactivity Only)
 *
 * Performance optimizations:
 * - ONLY client-side code (mobile menu state, active nav detection)
 * - NO data fetching (userProfile passed from server component)
 * - NO loading states (data already available)
 * - Smaller JavaScript bundle
 *
 * Client-side features:
 * - Mobile menu open/close state
 * - Active navigation highlighting with usePathname
 * - Click outside to close mobile menu
 */

type AppHeaderClientProps = {
	userProfile: UserProfile;
	companies: Array<{
		id: string;
		name: string;
		plan: string;
		onboardingComplete?: boolean;
		hasPayment?: boolean;
	}>;
	activeCompanyId?: string | null;
	companyPhones?: Array<{
		id: string;
		number: string;
		label?: string;
	}>;
	hasPhoneNumbers?: boolean;
	hasPayrixAccount?: boolean;
	payrixStatus?: string | null;
	subHeader?: React.ReactNode;
	initialWeather?: WeatherData | null;
};

type NavItemStatus = "beta" | "new" | "updated" | "coming-soon" | null;

type NavItem = {
	label: string;
	href: string;
	status?: NavItemStatus;
	isSpecial?: boolean; // For Ask Thorbis gradient style
};

type NavItemWithMobile = NavItem & {
	mobileIcon?: string;
	mobileIconBg?: string;
	mobileIconColor?: string;
};

const navigationItems: NavItemWithMobile[] = [
	{
		label: "Ask Thorbis",
		href: "/dashboard/ai",
		status: "beta",
		isSpecial: true,
		mobileIcon: "AI",
		mobileIconBg: "bg-primary/10",
		mobileIconColor: "text-primary",
	},
	{
		label: "Today",
		href: "/dashboard",
		mobileIcon: "T",
		mobileIconBg: "bg-primary/10",
		mobileIconColor: "text-primary",
	},
	{
		label: "Schedule",
		href: "/dashboard/schedule",
		mobileIcon: "S",
		mobileIconBg: "bg-accent/10",
		mobileIconColor: "text-accent-foreground",
	},
	{
		label: "Communication",
		href: "/dashboard/communication",
		mobileIcon: "C",
		mobileIconBg: "bg-success/10",
		mobileIconColor: "text-success",
	},
	{
		label: "Work",
		href: "/dashboard/work",
		status: "beta",
		mobileIcon: "W",
		mobileIconBg: "bg-teal-500/10",
		mobileIconColor: "text-teal-600",
	},
	{
		label: "Finances",
		href: "/dashboard/finance",
		status: "coming-soon",
		mobileIcon: "F",
		mobileIconBg: "bg-emerald-500/10",
		mobileIconColor: "text-emerald-600",
	},
	{
		label: "Reporting",
		href: "/dashboard/reporting",
		status: "coming-soon",
		mobileIcon: "R",
		mobileIconBg: "bg-primary/10",
		mobileIconColor: "text-primary",
	},
	{
		label: "Marketing",
		href: "/dashboard/marketing",
		status: "coming-soon",
		mobileIcon: "M",
		mobileIconBg: "bg-accent/10",
		mobileIconColor: "text-accent-foreground",
	},
	{
		label: "Training",
		href: "/dashboard/training",
		status: "coming-soon",
		mobileIcon: "T",
		mobileIconBg: "bg-accent/10",
		mobileIconColor: "text-accent-foreground",
	},
];

// Default logo for all companies
const defaultLogo = GalleryVerticalEnd;

function StatusIndicator({ status }: { status?: NavItemStatus }) {
	if (!status) {
		return null;
	}

	// For beta and coming-soon, show badge
	if (status === "beta") {
		return (
			<span className="absolute -top-1.5 right-0 rounded bg-primary px-1 py-0.5 text-[0.5rem] leading-none font-semibold tracking-wide text-primary-foreground uppercase shadow-sm">
				Beta
			</span>
		);
	}

	if (status === "coming-soon") {
		return (
			<span className="absolute -top-1.5 right-0 rounded bg-purple-500 px-1 py-0.5 text-[0.5rem] leading-none font-semibold tracking-wide whitespace-nowrap text-white uppercase shadow-sm">
				Soon
			</span>
		);
	}

	// Badge for "new" and "updated"
	if (status === "new") {
		return (
			<span className="absolute -top-1.5 right-0 rounded bg-success px-1 py-0.5 text-[0.5rem] leading-none font-semibold tracking-wide text-foreground uppercase shadow-sm">
				New
			</span>
		);
	}

	return (
		<span
			className="absolute -top-1 right-0 size-2 rounded-full bg-primary shadow-sm"
			title="Updated"
		/>
	);
}

function MobileStatusBadge({ status }: { status?: NavItemStatus }) {
	if (!status) {
		return null;
	}

	const styles = {
		beta: "bg-primary text-primary-foreground shadow-sm",
		new: "bg-success text-foreground shadow-sm",
		updated: "bg-primary/80 text-primary-foreground shadow-sm",
		"coming-soon": "bg-purple-500 text-white shadow-sm",
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

function UnreadBadge({ count }: { count: number }) {
	if (count === 0) {
		return null;
	}
	return (
		<span className="absolute -top-1.5 right-0 rounded bg-destructive px-1 py-0.5 text-[0.5rem] leading-none font-semibold tracking-wide text-destructive-foreground shadow-sm whitespace-nowrap">
			{formatBadgeCount(count)}
		</span>
	);
}

export function AppHeaderClient({
	userProfile,
	companies,
	activeCompanyId,
	companyPhones = [],
	hasPhoneNumbers = false,
	hasPayrixAccount = false,
	payrixStatus = null,
	subHeader: _subHeader, // Ignore the server-passed subHeader
	initialWeather,
}: AppHeaderClientProps) {
	const pathname = usePathname();

	// Hide header completely on TV display route (not settings)
	// Check this early to avoid hooks issues
	const isTVRoute = pathname === "/dashboard/tv";

	// Enable global keyboard shortcut for dialer (Ctrl+Shift+D or Cmd+Shift+D)
	useDialerShortcut();

	const [unreadCount, setUnreadCount] = useState(0);

	// Fetch unread count on mount, when pathname changes, and periodically
	useEffect(() => {
		const fetchUnreadCount = async () => {
			try {
				const result = await getTotalUnreadCountAction();
				if (result.success && result.count !== undefined) {
					setUnreadCount(result.count);
				}
			} catch (error) {
				console.error("Failed to fetch unread count:", error);
			}
		};

		// Fetch immediately
		fetchUnreadCount();

		// Refresh every 30 seconds
		const interval = setInterval(fetchUnreadCount, 30000);

		return () => clearInterval(interval);
	}, [pathname]); // Refresh when pathname changes (e.g., navigating to/from communication page)

	// Return null for TV route AFTER all hooks have been called
	if (isTVRoute) {
		return null;
	}

	return (
		<>
			<header className="safe-top bg-header-bg sticky top-0 z-50 w-full">
				<div className="flex h-14 items-center gap-2 px-4 md:px-6">
					{/* Logo */}
					<Link
						className="hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 size-10 md:size-8"
						data-slot="button"
						href="/"
					>
						<Image
							alt="Thorbis"
							className="size-5"
							height={20}
							src="/ThorbisLogo.webp"
							width={20}
						/>
						<span className="sr-only">Thorbis</span>
					</Link>

					{/* Main Navigation - Desktop only, mobile uses bottom tabs */}
					<nav className="hidden items-center gap-0.5 ml-2 lg:flex">
						{navigationItems.map((item) => {
							const isActive =
								item.href === "/dashboard"
									? pathname === "/dashboard"
									: pathname?.startsWith(item.href);

							if (item.isSpecial) {
								return (
									<div className="relative" key={item.href}>
										<Link
											className={`focus-visible:ring-ring/50 relative inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${
												isActive
													? "bg-primary/15 text-primary dark:bg-primary/25 shadow-sm"
													: "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
											}`}
											data-slot="button"
											href={item.href}
										>
											{item.label}
										</Link>
										<StatusIndicator status={item.status} />
									</div>
								);
							}

							return (
								<div className="relative" key={item.href}>
									<Link
										className={`focus-visible:ring-ring/50 relative inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${
											isActive
												? "bg-primary/15 text-primary dark:bg-primary/25 shadow-sm"
												: "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
										}`}
										data-slot="button"
										href={item.href}
									>
										{item.label}
									</Link>
									<StatusIndicator status={item.status} />
									{item.href === "/dashboard/communication" && (
										<UnreadBadge count={unreadCount} />
									)}
								</div>
							);
						})}
					</nav>

					{/* Right side controls */}
					<div className="ml-auto flex items-center gap-2 overflow-visible md:flex-1 md:justify-end">
						{/* Quick Add Menu */}
						<QuickAddDropdown />

						{/* Phone/Calls */}
						<PhoneDropdown
							companyId={activeCompanyId || ""}
							companyPhones={companyPhones}
						/>

						{/* Weather */}
						<WeatherDropdown initialWeather={initialWeather} />

						{/* TV Display */}
						<Link href="/dashboard/tv" title="TV Display">
							<button
								className="focus-visible:ring-ring/50 relative inline-flex h-8 shrink-0 w-8 items-center justify-center rounded-md transition-all duration-150 outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
								type="button"
							>
								<Tv className="size-4" />
								<span className="sr-only">TV Display</span>
							</button>
						</Link>

						{/* AI Pending Actions (Owner Approval) */}
						<PendingActionsIndicator />

						{/* Notifications */}
						<NotificationsDropdown
							hasPhoneNumbers={hasPhoneNumbers}
							hasPayrixAccount={hasPayrixAccount}
							payrixStatus={payrixStatus}
						/>

						{/* Help */}
						<HelpDropdown />

						{/* User Menu - Data passed from server, no loading state needed */}
						{/* Deduplicate companies by ID to prevent duplicates */}
						<UserMenu
							activeCompanyId={activeCompanyId}
							teams={Array.from(
								new Map(
									companies.map((company) => [
										company.id,
										{
											id: company.id,
											name: company.name,
											logo: company.logo,
											plan: company.plan,
											onboardingComplete: company.onboardingComplete,
											hasPayment: company.hasPayment,
										},
									]),
								).values(),
							)}
							user={{
								name: userProfile.name,
								email: userProfile.email,
								avatar: userProfile.avatar,
								status: userProfile.status,
							}}
						/>
					</div>
				</div>
			</header>
		</>
	);
}
