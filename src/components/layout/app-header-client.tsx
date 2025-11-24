"use client";

import { GalleryVerticalEnd, HelpCircle, Menu, Settings, Tv, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDialerShortcut } from "@/hooks/use-dialer-shortcut";
import type { UserProfile } from "@/lib/auth/user-data";
import { HelpDropdown } from "./help-dropdown";
import { NotificationsDropdown } from "./notifications-dropdown";
import { PhoneDropdown } from "./phone-dropdown";
import { QuickAddDropdown } from "./quick-add-dropdown";
import { UserMenu } from "./user-menu";
import { getTotalUnreadCountAction } from "@/actions/email-actions";
import { PendingActionsIndicator } from "@/components/ai/pending-actions-indicator";

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
			<span className="absolute -top-1.5 right-0 rounded bg-blue-500 px-1 py-0.5 text-[0.5rem] leading-none font-semibold tracking-wide text-white uppercase shadow-sm">
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
			<span className="absolute -top-1.5 right-0 rounded bg-green-500 px-1 py-0.5 text-[0.5rem] leading-none font-semibold tracking-wide text-white uppercase shadow-sm">
				New
			</span>
		);
	}

	return (
		<span
			className="absolute -top-1 right-0 size-2 rounded-full bg-blue-500 shadow-sm"
			title="Updated"
		/>
	);
}

function MobileStatusBadge({ status }: { status?: NavItemStatus }) {
	if (!status) {
		return null;
	}

	const styles = {
		beta: "bg-blue-500 text-white shadow-sm",
		new: "bg-green-500 text-white shadow-sm",
		updated: "bg-purple-500 text-white shadow-sm",
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
		<span className="absolute -top-1.5 right-0 rounded bg-red-500 px-1 py-0.5 text-[0.5rem] leading-none font-semibold tracking-wide text-white shadow-sm whitespace-nowrap">
			{formatBadgeCount(count)}
		</span>
	);
}

export function AppHeaderClient({
	userProfile,
	companies,
	activeCompanyId,
	customers = [],
	companyPhones = [],
	hasPhoneNumbers = false,
	hasPayrixAccount = false,
	payrixStatus = null,
	subHeader: _subHeader, // Ignore the server-passed subHeader
}: AppHeaderClientProps) {
	const pathname = usePathname();

	// Hide header completely on TV display route (not settings)
	// Check this early to avoid hooks issues
	const isTVRoute = pathname === "/dashboard/tv";

	// Enable global keyboard shortcut for dialer (Ctrl+Shift+D or Cmd+Shift+D)
	useDialerShortcut();

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const mobileMenuRef = useRef<HTMLDivElement>(null);
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

	// Handle closing animation
	const ANIMATION_DURATION = 300; // Match the duration of the animation
	const closeMobileMenu = useCallback(() => {
		setIsClosing(true);
		setTimeout(() => {
			setIsMobileMenuOpen(false);
			setIsClosing(false);
		}, ANIMATION_DURATION);
	}, []);

	// Close mobile menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				mobileMenuRef.current &&
				!mobileMenuRef.current.contains(event.target as Node)
			) {
				closeMobileMenu();
			}
		};

		if (isMobileMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isMobileMenuOpen, closeMobileMenu]);

	// Return null for TV route AFTER all hooks have been called
	if (isTVRoute) {
		return null;
	}

	return (
		<>
			<header className="safe-top bg-header-bg sticky top-0 z-50 w-full">
				<div className="flex h-14 items-center gap-2 px-4 md:px-6">
				{/* Mobile menu button */}
				<button
					className="hover-gradient hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-ring/50 flex h-8 w-8 items-center justify-center rounded-md border border-transparent transition-all outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 lg:hidden"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					type="button"
				>
					{isMobileMenuOpen ? (
						<X className="size-4" />
					) : (
						<Menu className="size-4" />
					)}
					<span className="sr-only">Toggle Menu</span>
				</button>

				{/* Logo */}
				<Link
					className="hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 hidden size-8 shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 lg:flex [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
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

				{/* Main Navigation */}
				<nav className="hidden items-center gap-0.5 lg:flex">
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

				{/* Modern Mobile Navigation Bottom Sheet */}
				{isMobileMenuOpen && (
					<>
						{/* Backdrop */}
						<button
							aria-label="Close mobile menu"
							className={`bg-foreground/50 dark:bg-background/90 fixed inset-0 z-40 backdrop-blur-md duration-300 lg:hidden ${
								isClosing ? "fade-out animate-out" : "fade-in animate-in"
							}`}
							onClick={closeMobileMenu}
							type="button"
						/>

						{/* Bottom Sheet */}
						<div
							className={`safe-bottom bg-background fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-border-subtle shadow-2xl duration-300 lg:hidden ${
								isClosing
									? "slide-out-to-bottom animate-out"
									: "slide-in-from-bottom animate-in"
							}`}
							ref={mobileMenuRef}
						>
							{/* Handle indicator */}
							<div className="flex justify-center py-4">
								<div className="bg-border-subtle h-1.5 w-10 rounded-full" />
							</div>

							{/* Header */}
							<div className="flex items-center justify-between px-6 pb-6">
								<div className="flex flex-col">
									<h2 className="text-xl font-bold tracking-tight">Navigation</h2>
									<p className="text-muted-foreground text-sm mt-1">
										Access your workspace features
									</p>
								</div>
								<button
									className="hover:bg-accent/80 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
									onClick={closeMobileMenu}
									type="button"
								>
									<X className="h-5 w-5" />
									<span className="sr-only">Close menu</span>
								</button>
							</div>

							{/* Scrollable content */}
							<div className="max-h-[50vh] overflow-y-auto px-4 pb-4">
								{/* AI Assistant Section */}
								<div className="mb-6">
									<h3 className="text-muted-foreground mb-3 px-1 text-xs font-bold uppercase tracking-wider">
										AI Assistant
									</h3>
									<div className="grid grid-cols-1 gap-2">
										{navigationItems
											.filter((item) => item.isSpecial)
											.map((item) => {
												const isActive =
													item.href === "/dashboard"
														? pathname === "/dashboard"
														: pathname?.startsWith(item.href);
												return (
													<Link
														className={`group relative flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
															isActive
																? "border-primary/30 bg-primary/8 text-primary shadow-md shadow-primary/10"
																: "border-border-subtle bg-card text-card-foreground hover:border-primary/20 hover:bg-primary/5"
														}`}
														href={item.href}
														key={item.href}
														onClick={closeMobileMenu}
													>
														<div
															className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ${item.mobileIconBg} ${
																isActive ? "scale-105" : "group-hover:scale-102"
															}`}
														>
															<span
																className={`text-sm font-bold ${item.mobileIconColor}`}
															>
																{item.mobileIcon}
															</span>
														</div>
														<div className="flex-1">
															<span className="font-medium text-sm">{item.label}</span>
															{item.status && (
																<div className="mt-1">
																	<MobileStatusBadge status={item.status} />
																</div>
															)}
														</div>
														{isActive && (
															<div className="ml-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
														)}
													</Link>
												);
											})}
									</div>
								</div>

								{/* Main Navigation Grid */}
								<div className="mb-4">
									<h3 className="text-muted-foreground mb-3 px-1 text-xs font-bold uppercase tracking-wider">
										Navigate
									</h3>
									<div className="grid grid-cols-2 gap-3">
										{navigationItems
											.filter((item) => !item.isSpecial)
											.map((item) => {
												const isActive =
													item.href === "/dashboard"
														? pathname === "/dashboard"
														: pathname?.startsWith(item.href);
												return (
													<Link
														className={`group relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
															isActive
																? "border-primary/30 bg-primary/8 text-primary shadow-md shadow-primary/10"
																: "border-border-subtle bg-card text-card-foreground hover:border-primary/20 hover:bg-primary/5"
														}`}
														href={item.href}
														key={item.href}
														onClick={closeMobileMenu}
													>
														<div
															className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ${item.mobileIconBg} ${
																isActive ? "scale-105" : "group-hover:scale-102"
															}`}
														>
															<span
																className={`text-sm font-bold ${item.mobileIconColor}`}
															>
																{item.mobileIcon}
															</span>
														</div>
														<span className="text-xs font-medium leading-tight">
															{item.label}
														</span>
														{item.status && (
															<div className="mt-1">
																<MobileStatusBadge status={item.status} />
															</div>
														)}
														{item.href === "/dashboard/communication" && unreadCount > 0 && (
															<div className="absolute top-2 right-2">
																<UnreadBadge count={unreadCount} />
															</div>
														)}
														{isActive && unreadCount === 0 && (
															<div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
														)}
													</Link>
												);
											})}
									</div>
								</div>

								{/* User Actions */}
								<div className="border-t border-border-subtle pt-4">
									<div className="grid grid-cols-2 gap-3">
										<Link
											className="group flex flex-col items-center gap-2 rounded-xl border border-border-subtle bg-card p-4 text-center transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] hover:border-primary/20 hover:bg-primary/5"
											href="/dashboard/settings"
											onClick={closeMobileMenu}
										>
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
												<Settings className="h-4 w-4 text-muted-foreground" />
											</div>
											<span className="text-xs font-medium">Settings</span>
										</Link>
										<Link
											className="group flex flex-col items-center gap-2 rounded-xl border border-border-subtle bg-card p-4 text-center transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] hover:border-primary/20 hover:bg-primary/5"
											href="/help"
											onClick={closeMobileMenu}
										>
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
												<HelpCircle className="h-4 w-4 text-muted-foreground" />
											</div>
											<span className="text-xs font-medium">Help</span>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</>
				)}

				{/* Right side controls */}
				<div className="ml-auto flex items-center gap-2 overflow-visible md:flex-1 md:justify-end">
					{/* Quick Add Menu */}
					<QuickAddDropdown />

					{/* Phone/Calls */}
					<PhoneDropdown
						companyId={activeCompanyId || ""}
						companyPhones={companyPhones}
					/>

					{/* TV Display */}
					<Link href="/dashboard/tv" title="TV Display">
						<button
							className="hover-gradient hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-ring/50 flex h-8 w-8 items-center justify-center rounded-md border border-transparent transition-all outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
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
