"use client";

import {
	BadgeCheck,
	CheckCircle2,
	CreditCard,
	LogOut,
	type LucideIcon,
	Moon,
	Plus,
	Settings,
	ShoppingCart,
	Sun,
	Wrench,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { signOut } from "@/actions/auth";
import { switchCompany } from "@/actions/company-context";
import { type UserStatus, updateUserStatus } from "@/actions/user-status";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Switch } from "@/components/ui/switch";

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
		logo: LucideIcon;
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
	const [userStatus, setUserStatus] = useState<UserStatus>(user.status || "online");
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
	// Find the active team based on activeCompanyId, fallback to first team
	const initialActiveTeam = teams.find((t) => t.id === activeCompanyId) || teams[0];
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
			router.refresh();
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
				router.refresh();
			}
		} catch (_error) {
    console.error("Error:", _error);
		} finally {
			setIsUpdatingStatus(false);
		}
	};

	const isDark =
		mounted && (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches));

	const toggleTheme = () => {
		setTheme(isDark ? "light" : "dark");
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className="flex h-8 items-center gap-2 rounded-md px-2 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
					suppressHydrationWarning
					type="button"
				>
					<div className="relative">
						<Avatar className="size-6 rounded-md">
							<AvatarImage alt={user.name} src={user.avatar} />
							<AvatarFallback className="rounded-md text-[10px]">
								{user.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div className="-bottom-0.5 -right-0.5 absolute">
							<StatusIndicator size="sm" status={userStatus} />
						</div>
					</div>
					<span className="hidden font-medium text-sm md:inline-block">{user.name.split(" ")[0]}</span>
					<span className="sr-only">User menu</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-64 rounded-lg">
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<div className="relative">
							<Avatar className="size-8 rounded-lg">
								<AvatarImage alt={user.name} src={user.avatar} />
								<AvatarFallback className="rounded-lg">
									{user.name
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
							<div className="-bottom-0.5 -right-0.5 absolute">
								<StatusIndicator size="md" status={userStatus} />
							</div>
						</div>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">{user.name}</span>
							<span className="truncate text-xs">{user.email}</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{/* Status Selector */}
				<DropdownMenuLabel className="text-muted-foreground text-xs">Status</DropdownMenuLabel>
				<div className="px-2 pb-2">
					<div className="space-y-1">
						<button
							className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent ${
								userStatus === "online" ? "bg-accent" : ""
							}`}
							disabled={isUpdatingStatus}
							onClick={() => handleStatusChange("online")}
							type="button"
						>
							<StatusIndicator size="md" status="online" />
							<span>Online</span>
							{userStatus === "online" && <div className="ml-auto size-2 rounded-full bg-primary" />}
						</button>
						<button
							className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent ${
								userStatus === "available" ? "bg-accent" : ""
							}`}
							disabled={isUpdatingStatus}
							onClick={() => handleStatusChange("available")}
							type="button"
						>
							<StatusIndicator size="md" status="available" />
							<span>Available</span>
							{userStatus === "available" && <div className="ml-auto size-2 rounded-full bg-primary" />}
						</button>
						<button
							className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent ${
								userStatus === "busy" ? "bg-accent" : ""
							}`}
							disabled={isUpdatingStatus}
							onClick={() => handleStatusChange("busy")}
							type="button"
						>
							<StatusIndicator size="md" status="busy" />
							<span>Busy</span>
							{userStatus === "busy" && <div className="ml-auto size-2 rounded-full bg-primary" />}
						</button>
					</div>
				</div>
				<DropdownMenuSeparator />

				{/* Teams */}
				<DropdownMenuLabel className="text-muted-foreground text-xs">Organizations</DropdownMenuLabel>
				{teams.map((team, index) => {
					const isActive = activeTeam?.id === team.id;
					return (
						<DropdownMenuItem
							className={`gap-2 p-2 ${isActive ? "bg-accent" : ""}`}
							key={team.id}
							onClick={() => handleCompanySwitch(team)}
						>
							<div className="flex size-6 items-center justify-center rounded-sm border">
								<team.logo className="size-4 shrink-0" />
							</div>
							<div className="flex flex-1 flex-col">
								<span className="font-medium text-sm">{team.name}</span>
								<div className="flex items-center gap-2">
									{team.onboardingComplete !== undefined ? (
										team.onboardingComplete ? (
											<Badge className="h-4 px-1.5 text-[10px]" variant="default">
												<CheckCircle2 className="mr-1 size-3" />
												Complete
											</Badge>
										) : (
											<Badge className="h-4 px-1.5 text-[10px]" variant="secondary">
												<XCircle className="mr-1 size-3" />
												{team.plan === "Incomplete Onboarding" ? "Incomplete Onboarding" : "Not Complete"}
											</Badge>
										)
									) : (
										<span className="text-muted-foreground text-xs">{team.plan}</span>
									)}
								</div>
							</div>
							{isActive && <div className="ml-auto size-2 rounded-full bg-primary" />}
							<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
						</DropdownMenuItem>
					);
				})}
				<DropdownMenuItem asChild className="gap-2 p-2">
					<Link href="/dashboard/welcome?new=true">
						<div className="flex size-6 items-center justify-center rounded-md border">
							<Plus className="size-4" />
						</div>
						<span className="font-medium text-muted-foreground">Add new business</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />

				{/* User Actions */}
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/dashboard/settings/profile/personal">
							<BadgeCheck />
							Account
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/dashboard/settings/billing">
							<CreditCard />
							Billing
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/dashboard/shop">
							<ShoppingCart />
							Shop
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/tools">
							<Wrench />
							Tools
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/dashboard/settings">
							<Settings />
							Settings
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<div className="flex items-center justify-between px-2 py-2">
					<div className="flex items-center gap-2">
						<Sun className="size-4 text-muted-foreground" />
						<span className="text-sm">Theme</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-muted-foreground text-xs">{mounted ? (isDark ? "Dark" : "Light") : "..."}</span>
						<Switch aria-label="Toggle theme" checked={isDark} disabled={!mounted} onCheckedChange={toggleTheme} />
						<Moon className="size-4 text-muted-foreground" />
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
					onClick={handleLogout}
				>
					<LogOut className="text-destructive" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
