"use client";

import { signOut } from "@/actions/auth";
import { switchCompany } from "@/actions/company-context";
import { type UserStatus, updateUserStatus } from "@/actions/user-status";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
	Building2,
	Check,
	ChevronRight,
	CreditCard,
	HelpCircle,
	Keyboard,
	LogOut,
	Monitor,
	Moon,
	Plus,
	Settings,
	Sun,
	User,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

const STATUS_CONFIG: Record<
	UserStatus,
	{ label: string; color: string; description: string }
> = {
	online: {
		label: "Online",
		color: "bg-green-500",
		description: "Available for work",
	},
	available: {
		label: "Away",
		color: "bg-yellow-500",
		description: "Temporarily unavailable",
	},
	busy: {
		label: "Do not disturb",
		color: "bg-red-500",
		description: "Only urgent matters",
	},
	offline: {
		label: "Offline",
		color: "bg-gray-400",
		description: "Appear offline",
	},
};

export function UserMenu({ user, teams, activeCompanyId }: UserMenuProps) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [userStatus, setUserStatus] = useState<UserStatus>(
		user.status || "online"
	);
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const initialActiveTeam =
		teams.find((t) => t.id === activeCompanyId) || teams[0];
	const [activeTeam, setActiveTeam] = useState(initialActiveTeam);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleCompanySwitch = async (team: (typeof teams)[0]) => {
		if (activeTeam?.id === team.id) return;
		const result = await switchCompany(team.id);
		if (result.success) {
			setActiveTeam(team);
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
			}
		} finally {
			setIsUpdatingStatus(false);
		}
	};

	const getCurrentTheme = () => {
		if (!mounted) return "system";
		return theme === "light" ? "light" : theme === "dark" ? "dark" : "system";
	};

	const getInitials = (name?: string, email?: string) => {
		if (name) {
			return name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);
		}
		return email?.substring(0, 2).toUpperCase() || "U";
	};

	const statusConfig = STATUS_CONFIG[userStatus];

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<button
					className={cn(
						"flex h-8 items-center gap-2 rounded-lg px-2 transition-all duration-150",
						"hover:bg-accent/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
						"outline-none disabled:pointer-events-none disabled:opacity-50",
						isOpen && "bg-accent"
					)}
					type="button"
				>
					<div className="relative">
						<Avatar className="size-6 rounded-md ring-1 ring-border/50">
							<AvatarImage alt={user.name || user.email} src={user.avatar} />
							<AvatarFallback className="rounded-md text-[10px] font-medium bg-muted">
								{getInitials(user.name, user.email)}
							</AvatarFallback>
						</Avatar>
						<div
							className={cn(
								"absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-background",
								statusConfig.color
							)}
						/>
					</div>
					<span className="hidden text-sm font-medium md:inline-block truncate max-w-28">
						{user.name?.split(" ")[0] || user.email?.split("@")[0] || "User"}
					</span>
					<span className="sr-only">Open user menu</span>
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				sideOffset={8}
				className="w-80 p-0 overflow-hidden"
			>
				{/* Profile Header */}
				<div className="bg-muted/30 border-b border-border/50 p-4">
					<div className="flex items-start gap-3">
						<div className="relative shrink-0">
							<Avatar className="size-11 rounded-xl ring-2 ring-background shadow-sm">
								<AvatarImage alt={user.name || user.email} src={user.avatar} />
								<AvatarFallback className="rounded-xl text-sm font-semibold bg-primary/10 text-primary">
									{getInitials(user.name, user.email)}
								</AvatarFallback>
							</Avatar>
							<div
								className={cn(
									"absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-background",
									statusConfig.color
								)}
							/>
						</div>
						<div className="flex-1 min-w-0 space-y-0.5">
							<p className="text-sm font-semibold truncate">
								{user.name || user.email?.split("@")[0] || "User"}
							</p>
							<p className="text-xs text-muted-foreground truncate">
								{user.email}
							</p>
							{activeTeam && (
								<p className="text-xs text-muted-foreground truncate flex items-center gap-1">
									<Building2 className="size-3" />
									{activeTeam.name}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Status Section */}
				<div className="p-2 border-b border-border/50">
					<p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-2 py-1.5">
						Set Status
					</p>
					<div className="space-y-0.5">
						{(
							Object.entries(STATUS_CONFIG) as [
								UserStatus,
								(typeof STATUS_CONFIG)[UserStatus],
							][]
						).map(([status, config]) => (
							<button
								key={status}
								disabled={isUpdatingStatus}
								onClick={() => handleStatusChange(status)}
								className={cn(
									"flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
									"hover:bg-accent disabled:opacity-50",
									userStatus === status && "bg-accent"
								)}
								type="button"
							>
								<div
									className={cn("size-2.5 rounded-full shrink-0", config.color)}
								/>
								<div className="flex-1 text-left">
									<span className="font-medium">{config.label}</span>
								</div>
								{userStatus === status && (
									<Check className="size-4 text-primary shrink-0" />
								)}
							</button>
						))}
					</div>
				</div>

				{/* Workspace Section */}
				<div className="p-2 border-b border-border/50">
					<div className="flex items-center justify-between px-2 py-1.5">
						<p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
							Workspaces
						</p>
						<Link
							href="/welcome?new=true"
							className="text-[11px] font-medium text-primary hover:underline flex items-center gap-0.5"
							onClick={() => setIsOpen(false)}
						>
							<Plus className="size-3" />
							Add
						</Link>
					</div>
					<div className="max-h-36 overflow-y-auto space-y-0.5">
						{teams.map((team) => {
							const isActive = activeTeam?.id === team.id;
							return (
								<button
									key={team.id}
									onClick={() => handleCompanySwitch(team)}
									className={cn(
										"flex w-full items-center gap-3 rounded-md px-2 py-2 transition-colors",
										"hover:bg-accent",
										isActive && "bg-accent"
									)}
									type="button"
								>
									<div className="flex size-8 items-center justify-center rounded-lg bg-muted shrink-0">
										{team.logo ? (
											<Image
												src={team.logo}
												alt={team.name}
												width={20}
												height={20}
												className="size-5 object-contain"
											/>
										) : (
											<Building2 className="size-4 text-muted-foreground" />
										)}
									</div>
									<div className="flex-1 min-w-0 text-left">
										<p
											className={cn(
												"text-sm truncate",
												isActive && "font-medium"
											)}
										>
											{team.name}
										</p>
										<div className="flex items-center gap-1.5">
											{team.onboardingComplete === false ? (
												<span className="text-[10px] text-amber-600 dark:text-amber-400">
													Setup required
												</span>
											) : (
												<span className="text-[10px] text-muted-foreground capitalize">
													{team.plan}
												</span>
											)}
										</div>
									</div>
									{isActive && (
										<div className="size-1.5 rounded-full bg-primary shrink-0" />
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Navigation Links */}
				<div className="p-2 border-b border-border/50">
					<NavItem
						href="/dashboard/settings/profile/personal"
						icon={User}
						label="Profile & Account"
						shortcut="⇧⌘P"
						onClick={() => setIsOpen(false)}
					/>
					<NavItem
						href="/dashboard/settings/billing"
						icon={CreditCard}
						label="Plans & Billing"
						onClick={() => setIsOpen(false)}
					/>
					<NavItem
						href="/dashboard/settings"
						icon={Settings}
						label="Settings"
						shortcut="⌘,"
						onClick={() => setIsOpen(false)}
					/>
				</div>

				{/* Theme & Preferences */}
				<div className="p-2 border-b border-border/50">
					<p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-2 py-1.5">
						Appearance
					</p>
					<div className="px-2 py-1">
						<div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted/50">
							{[
								{ value: "light", icon: Sun, label: "Light" },
								{ value: "dark", icon: Moon, label: "Dark" },
								{ value: "system", icon: Monitor, label: "System" },
							].map((option) => {
								const Icon = option.icon;
								const isSelected = getCurrentTheme() === option.value;
								return (
									<button
										key={option.value}
										disabled={!mounted}
										onClick={() => setTheme(option.value)}
										className={cn(
											"flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
											isSelected
												? "bg-background text-foreground shadow-sm"
												: "text-muted-foreground hover:text-foreground"
										)}
										type="button"
									>
										<Icon className="size-3.5" />
										{option.label}
									</button>
								);
							})}
						</div>
					</div>
				</div>

				{/* Help & Support */}
				<div className="p-2 border-b border-border/50">
					<NavItem
						href="/help"
						icon={HelpCircle}
						label="Help & Support"
						external
						onClick={() => setIsOpen(false)}
					/>
					<NavItem
						href="/dashboard/settings/shortcuts"
						icon={Keyboard}
						label="Keyboard Shortcuts"
						shortcut="⌘/"
						onClick={() => setIsOpen(false)}
					/>
				</div>

				{/* Sign Out */}
				<div className="p-2">
					<button
						onClick={handleLogout}
						className={cn(
							"flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
							"text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
						)}
						type="button"
					>
						<LogOut className="size-4" />
						<span>Sign out</span>
						<kbd className="ml-auto hidden sm:inline-flex h-5 items-center rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] text-muted-foreground">
							⇧⌘Q
						</kbd>
					</button>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function NavItem({
	href,
	icon: Icon,
	label,
	shortcut,
	external,
	onClick,
}: {
	href: string;
	icon: React.ElementType;
	label: string;
	shortcut?: string;
	external?: boolean;
	onClick?: () => void;
}) {
	return (
		<Link
			href={href}
			onClick={onClick}
			className={cn(
				"flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
				"text-foreground/80 hover:bg-accent hover:text-foreground"
			)}
			{...(external && { target: "_blank", rel: "noopener noreferrer" })}
		>
			<Icon className="size-4 text-muted-foreground" />
			<span className="flex-1">{label}</span>
			{shortcut && (
				<kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] text-muted-foreground">
					{shortcut}
				</kbd>
			)}
			{external && <ChevronRight className="size-3.5 text-muted-foreground" />}
		</Link>
	);
}
