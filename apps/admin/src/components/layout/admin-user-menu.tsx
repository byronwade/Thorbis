"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
	HelpCircle,
	Keyboard,
	LogOut,
	Monitor,
	Moon,
	Settings,
	Shield,
	Sun,
	User,
	Users,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function AdminUserMenu() {
	const router = useRouter();
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [user, setUser] = useState<{
		email?: string;
		name?: string;
		avatar?: string;
	} | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const supabase = createClient();

		async function getUser() {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				setUser({
					email: user.email,
					name: user.user_metadata?.full_name || user.email?.split("@")[0],
					avatar: user.user_metadata?.avatar_url,
				});
			}
		}

		getUser();
	}, []);

	const handleSignOut = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/login");
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
		return email?.substring(0, 2).toUpperCase() || "A";
	};

	const getCurrentTheme = () => {
		if (!mounted) return "system";
		return theme === "light" ? "light" : theme === "dark" ? "dark" : "system";
	};

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
							<AvatarImage
								alt={user?.name || user?.email}
								src={user?.avatar}
							/>
							<AvatarFallback className="rounded-md text-[10px] font-medium bg-muted">
								{getInitials(user?.name, user?.email)}
							</AvatarFallback>
						</Avatar>
						<div
							className={cn(
								"absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-background",
								"bg-green-500"
							)}
						/>
					</div>
					<span className="hidden text-sm font-medium md:inline-block truncate max-w-28">
						{user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Admin"}
					</span>
					<span className="sr-only">Open user menu</span>
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				sideOffset={8}
				className="w-72 p-0 overflow-hidden"
			>
				{/* Profile Header */}
				<div className="bg-muted/30 border-b border-border/50 p-4">
					<div className="flex items-start gap-3">
						<div className="relative shrink-0">
							<Avatar className="size-11 rounded-xl ring-2 ring-background shadow-sm">
								<AvatarImage
									alt={user?.name || user?.email}
									src={user?.avatar}
								/>
								<AvatarFallback className="rounded-xl text-sm font-semibold bg-primary/10 text-primary">
									{getInitials(user?.name, user?.email)}
								</AvatarFallback>
							</Avatar>
							<div
								className={cn(
									"absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-background",
									"bg-green-500"
								)}
							/>
						</div>
						<div className="flex-1 min-w-0 space-y-0.5">
							<p className="text-sm font-semibold truncate">
								{user?.name || user?.email?.split("@")[0] || "Admin User"}
							</p>
							<p className="text-xs text-muted-foreground truncate">
								{user?.email}
							</p>
							<p className="text-xs text-muted-foreground truncate flex items-center gap-1">
								<Shield className="size-3" />
								Administrator
							</p>
						</div>
					</div>
				</div>

				{/* Navigation Links */}
				<div className="p-2 border-b border-border/50">
					<NavItem
						href="/dashboard/settings/profile"
						icon={User}
						label="Profile & Account"
						shortcut="⇧⌘P"
						onClick={() => setIsOpen(false)}
					/>
					<NavItem
						href="/dashboard/work/users"
						icon={Users}
						label="Manage Users"
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
						onClick={handleSignOut}
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
	onClick,
}: {
	href: string;
	icon: React.ElementType;
	label: string;
	shortcut?: string;
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
		>
			<Icon className="size-4 text-muted-foreground" />
			<span className="flex-1">{label}</span>
			{shortcut && (
				<kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] text-muted-foreground">
					{shortcut}
				</kbd>
			)}
		</Link>
	);
}
