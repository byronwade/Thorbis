"use client";

import { signOut } from "@/actions/auth";
import { switchCompany } from "@/actions/company-context";
import { type UserStatus, updateUserStatus } from "@/actions/user-status";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { StatusIndicator } from "@/components/ui/status-indicator";
import {
	BadgeCheck,
	CreditCard,
	GalleryVerticalEnd,
	LogOut,
	Monitor,
	Moon,
	Plus,
	Settings,
	ShoppingCart,
	Sun
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * UserMenu - Client Component
 *
 * Client-side features:
 * - User profile dropdown with account management
 * - Organization switcher (list view with active indicator)
 * - Theme toggle (Light/Dark with clear visual indicator)
 * - Settings navigation
 * - Account and billing links
 */

type UserMenuProps = {
	user: {
		name: string;
		email: string;
		avatar: string;
		status?: UserStatus;
	};
	teams: {
		id: string;
		name: string;
		logo?: string | null;
		plan: string;
		onboardingComplete?: boolean;
		hasPayment?: boolean;
	}[];
	activeCompanyId?: string | null;
};

export function UserMenu({ user, teams, activeCompanyId }: UserMenuProps) {
	const { theme, setTheme } = useTheme();
	const router = useRouter();
	const _pathname = usePathname();
	const [mounted, setMounted] = useState(false);
	const [userStatus, setUserStatus] = useState<UserStatus>(
		user.status || "online",
	);
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
	// Find the active team based on activeCompanyId, fallback to first team
	const initialActiveTeam =
		teams.find((t) => t.id === activeCompanyId) || teams[0];
	const [activeTeam, setActiveTeam] = useState(initialActiveTeam);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleCompanySwitch = async (team: (typeof teams)[0]) => {
		// Don't switch if already active
		if (activeTeam?.id === team.id) {
			return;
		}

		const result = await switchCompany(team.id);
		if (result.success) {
			setActiveTeam(team);
			// Stay on current page and refresh data
			// Server Action handles revalidation automatically
		}
	};

	const handleLogout = async () => {
		await signOut();
	};

	const handleStatusChange = async (status: UserStatus) => {
		setIsUpdatingStatus(true);
		try {
			const result = await updateUserStatus(status);
			if (result.success) {
				setUserStatus(status);
				// Server Action handles revalidation automatically
			}
		} catch (_error) {
		} finally {
			setIsUpdatingStatus(false);
		}
	};

	const getCurrentTheme = () => {
		if (!mounted) return "system";
		if (theme === "light") return "light";
		if (theme === "dark") return "dark";
		return "system";
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex h-8 items-center gap-2 rounded-md px-2 transition-colors outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
					suppressHydrationWarning
					type="button"
				>
					<div className="relative">
						<Avatar className="size-6 rounded-md">
							<AvatarImage alt={user.name || user.email} src={user.avatar} />
							<AvatarFallback className="rounded-md text-[10px]">
								{user.name
									? user.name
											.split(" ")
											.map((n) => n[0])
											.join("")
									: user.email?.substring(0, 2).toUpperCase() || "U"}
							</AvatarFallback>
						</Avatar>
						<div className="absolute -right-0.5 -bottom-0.5">
							<StatusIndicator size="sm" status={userStatus} />
						</div>
					</div>
					<span className="hidden text-sm font-medium md:inline-block truncate max-w-32">
						{user.name
							? user.name.split(" ")[0]
							: user.email?.split("@")[0] || "User"}
					</span>
					<span className="sr-only">User menu</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-72 rounded-lg p-0">
				{/* User Profile Section */}
				<div className="p-4 pb-3">
					<div className="flex items-center gap-3">
						<div className="relative">
							<Avatar className="size-12 rounded-lg">
								<AvatarImage alt={user.name || user.email} src={user.avatar} />
								<AvatarFallback className="rounded-lg text-sm">
									{user.name
										? user.name
												.split(" ")
												.map((n) => n[0])
												.join("")
										: user.email?.substring(0, 2).toUpperCase() || "U"}
								</AvatarFallback>
							</Avatar>
							<div className="absolute -right-0.5 -bottom-0.5">
								<StatusIndicator size="md" status={userStatus} />
							</div>
						</div>
						<div className="grid flex-1 text-left leading-tight">
							<span className="truncate text-sm font-semibold">
								{user.name || user.email?.split("@")[0] || "User"}
							</span>
							<span className="truncate text-xs text-muted-foreground">{user.email}</span>
							<span className="text-xs text-muted-foreground capitalize">{userStatus}</span>
						</div>
					</div>
				</div>
				<DropdownMenuSeparator />

				{/* Status Selector */}
				<div className="p-2">
					<div className="px-2 py-1">
						<p className="text-xs font-medium text-muted-foreground mb-2">Status</p>
						<div className="grid grid-cols-3 gap-1">
							<button
								className={`flex flex-col items-center gap-2 rounded-md px-2 py-2 text-xs transition-colors hover:bg-accent ${
									userStatus === "online" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
								}`}
								disabled={isUpdatingStatus}
								onClick={() => handleStatusChange("online")}
								type="button"
							>
								<div className="size-2 rounded-full bg-green-500" />
								<span>Online</span>
							</button>
							<button
								className={`flex flex-col items-center gap-2 rounded-md px-2 py-2 text-xs transition-colors hover:bg-accent ${
									userStatus === "available" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
								}`}
								disabled={isUpdatingStatus}
								onClick={() => handleStatusChange("available")}
								type="button"
							>
								<div className="size-2 rounded-full bg-yellow-500" />
								<span>Available</span>
							</button>
							<button
								className={`flex flex-col items-center gap-2 rounded-md px-2 py-2 text-xs transition-colors hover:bg-accent ${
									userStatus === "busy" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
								}`}
								disabled={isUpdatingStatus}
								onClick={() => handleStatusChange("busy")}
								type="button"
							>
								<div className="size-2 rounded-full bg-red-500" />
								<span>Busy</span>
							</button>
						</div>
					</div>
				</div>
				<DropdownMenuSeparator />

				{/* Organizations */}
				<div className="p-2">
					<div className="px-2 py-1">
						<p className="text-xs font-medium text-muted-foreground mb-2">Organizations</p>
						<div className="space-y-1">
							{/* Add business button at top */}
							<Link href="/dashboard/welcome?new=true">
								<button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground h-10" type="button">
									<div className="flex size-6 items-center justify-center rounded-md border border-border/50">
										<Plus className="size-4" />
									</div>
									<span className="text-sm">Add new business</span>
								</button>
							</Link>

							{/* Scrollable company list */}
							<div className="max-h-32 overflow-y-auto space-y-1">
								{teams.map((team, index) => {
									const isActive = activeTeam?.id === team.id;
									return (
										<button
											className={`flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent h-10 ${
												isActive ? "bg-accent" : ""
											}`}
											key={team.id}
											onClick={() => handleCompanySwitch(team)}
											type="button"
										>
											<div className="flex size-6 items-center justify-center rounded-md border border-border/50 bg-muted">
												{team.logo ? (
													<Image
														src={team.logo}
														alt={`${team.name} logo`}
														width={16}
														height={16}
														className="size-4 shrink-0 object-contain"
													/>
												) : (
													<GalleryVerticalEnd className="size-4 shrink-0" />
												)}
											</div>
											<div className="flex flex-1 flex-col items-start text-left min-w-0">
												<span className="text-sm font-medium truncate">{team.name}</span>
												<div className="flex items-center gap-1">
													{team.onboardingComplete !== undefined ? (
														team.onboardingComplete ? (
															<div className="inline-flex items-center rounded-full bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
																<div className="mr-1 size-1 rounded-full bg-green-500" />
																<span className="text-[10px]">Complete</span>
															</div>
														) : (
															<div className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
																<div className="mr-1 size-1 rounded-full bg-amber-500" />
																<span className="text-[10px]">Setup</span>
															</div>
														)
													) : (
														<span className="text-muted-foreground text-xs">
															{team.plan}
														</span>
													)}
												</div>
											</div>
											{isActive && (
												<div className="bg-primary ml-auto size-2 rounded-full" />
											)}
										</button>
									);
								})}
							</div>
						</div>
					</div>
				</div>
				<DropdownMenuSeparator />

				{/* Quick Actions */}
				<div className="p-2">
					<div className="flex gap-1">
						<Link href="/dashboard/settings/profile/personal" className="flex-1">
							<button className="flex w-full flex-col items-center justify-center gap-1.5 rounded-md px-1.5 py-2 text-xs transition-colors hover:bg-accent h-14" type="button">
								<BadgeCheck className="size-5" />
								<span>Account</span>
							</button>
						</Link>
						<Link href="/dashboard/settings/billing" className="flex-1">
							<button className="flex w-full flex-col items-center justify-center gap-1.5 rounded-md px-1.5 py-2 text-xs transition-colors hover:bg-accent h-14" type="button">
								<CreditCard className="size-5" />
								<span>Billing</span>
							</button>
						</Link>
						<Link href="/dashboard/shop" className="flex-1">
							<button className="flex w-full flex-col items-center justify-center gap-1.5 rounded-md px-1.5 py-2 text-xs transition-colors hover:bg-accent h-14" type="button">
								<ShoppingCart className="size-5" />
								<span>Shop</span>
							</button>
						</Link>
						<Link href="/dashboard/settings" className="flex-1">
							<button className="flex w-full flex-col items-center justify-center gap-1.5 rounded-md px-1.5 py-2 text-xs transition-colors hover:bg-accent h-14" type="button">
								<Settings className="size-5" />
								<span>Settings</span>
							</button>
						</Link>
					</div>
				</div>
				<DropdownMenuSeparator />

				{/* Theme Toggle */}
				<div className="p-2">
					<div className="px-2 py-1">
						<p className="text-xs font-medium text-muted-foreground mb-2">Theme</p>
						<div className="flex gap-1">
							<button
								className={`flex flex-1 flex-col items-center justify-center gap-1.5 rounded-md px-1.5 py-2 text-xs transition-colors hover:bg-accent h-14 ${
									getCurrentTheme() === "light" ? "bg-accent" : ""
								}`}
								disabled={!mounted}
								onClick={() => setTheme("light")}
								type="button"
							>
								<Sun className="size-5" />
								<span>Light</span>
							</button>
							<button
								className={`flex flex-1 flex-col items-center justify-center gap-1.5 rounded-md px-1.5 py-2 text-xs transition-colors hover:bg-accent h-14 ${
									getCurrentTheme() === "dark" ? "bg-accent" : ""
								}`}
								disabled={!mounted}
								onClick={() => setTheme("dark")}
								type="button"
							>
								<Moon className="size-5" />
								<span>Dark</span>
							</button>
							<button
								className={`flex flex-1 flex-col items-center justify-center gap-1.5 rounded-md px-1.5 py-2 text-xs transition-colors hover:bg-accent h-14 ${
									getCurrentTheme() === "system" ? "bg-accent" : ""
								}`}
								disabled={!mounted}
								onClick={() => setTheme("system")}
								type="button"
							>
								<Monitor className="size-5" />
								<span>System</span>
							</button>
						</div>
					</div>
				</div>

				<DropdownMenuSeparator />

				{/* Logout */}
				<div className="p-1">
					<button
						className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 focus:bg-destructive/10"
						onClick={handleLogout}
						type="button"
					>
						<LogOut className="size-4" />
						Log out
					</button>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
