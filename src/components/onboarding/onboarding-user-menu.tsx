"use client";

/**
 * Onboarding User Menu - Minimal dropdown during onboarding
 *
 * Shows:
 * - User avatar/name
 * - List of companies user belongs to (with links)
 * - Logout option
 *
 * Does NOT show:
 * - Full navigation
 * - Settings
 * - Other dashboard features
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Building2,
	ChevronDown,
	LogOut,
	Loader2,
	Check,
	Settings,
} from "lucide-react";

interface Company {
	id: string;
	name: string;
	onboarding_completed_at?: string | null;
}

interface OnboardingUserMenuProps {
	user: {
		id: string;
		email: string;
		name?: string;
		avatar_url?: string;
	};
	companies: Company[];
	activeCompanyId?: string | null;
}

export function OnboardingUserMenu({
	user,
	companies,
	activeCompanyId,
}: OnboardingUserMenuProps) {
	const router = useRouter();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [isSwitching, setIsSwitching] = useState<string | null>(null);

	const initials = user.name
		? user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: user.email?.slice(0, 2).toUpperCase() || "??";

	const handleLogout = async () => {
		setIsLoggingOut(true);
		const supabase = createClient();
		if (supabase) {
			await supabase.auth.signOut();
		}
		router.push("/login");
	};

	const handleSwitchCompany = async (companyId: string) => {
		if (companyId === activeCompanyId) return;

		setIsSwitching(companyId);

		// Set active company cookie
		document.cookie = `active_company_id=${companyId}; path=/; max-age=${60 * 60 * 24 * 365}`;

		// Find the company
		const company = companies.find((c) => c.id === companyId);

		// Redirect based on onboarding status
		if (company?.onboarding_completed_at) {
			// Use hard navigation for dashboard to avoid onboarding header intercepting
			window.location.href = "/dashboard";
		} else {
			// Stay on welcome page - just refresh to reload with new company context
			router.push("/welcome");
			router.refresh();
		}
	};

	// Get active company info
	const activeCompany = companies.find((c) => c.id === activeCompanyId);

	// All other companies (both completed and incomplete)
	const otherCompanies = companies.filter((c) => c.id !== activeCompanyId);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="flex items-center gap-2 px-2 h-10"
				>
					<Avatar className="h-8 w-8">
						<AvatarImage src={user.avatar_url} alt={user.name || user.email} />
						<AvatarFallback className="text-xs">{initials}</AvatarFallback>
					</Avatar>
					<span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
						{user.name || user.email}
					</span>
					<ChevronDown className="h-4 w-4 text-muted-foreground" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-64">
				{/* User info */}
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{user.name || "User"}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>

				{/* Current company */}
				{activeCompany && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
							Current Company
						</DropdownMenuLabel>
						<DropdownMenuItem disabled className="opacity-100">
							<Building2 className="mr-2 h-4 w-4 text-primary" />
							<span className="flex-1 truncate font-medium">{activeCompany.name}</span>
							<Check className="ml-2 h-4 w-4 text-primary" />
						</DropdownMenuItem>
					</>
				)}

				{/* All other companies user can switch to */}
				{otherCompanies.length > 0 && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
							Switch Company
						</DropdownMenuLabel>
						{otherCompanies.map((company) => (
							<DropdownMenuItem
								key={company.id}
								onClick={() => handleSwitchCompany(company.id)}
								disabled={isSwitching === company.id}
								className="cursor-pointer"
							>
								<Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
								<div className="flex-1 min-w-0">
									<span className="truncate block">{company.name}</span>
									{!company.onboarding_completed_at && (
										<span className="text-xs text-amber-500 flex items-center gap-1">
											<Settings className="h-3 w-3" />
											Needs setup
										</span>
									)}
								</div>
								{isSwitching === company.id && (
									<Loader2 className="ml-2 h-4 w-4 animate-spin" />
								)}
							</DropdownMenuItem>
						))}
					</>
				)}

				<DropdownMenuSeparator />

				{/* Logout */}
				<DropdownMenuItem
					onClick={handleLogout}
					disabled={isLoggingOut}
					className="cursor-pointer text-destructive focus:text-destructive"
				>
					{isLoggingOut ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<LogOut className="mr-2 h-4 w-4" />
					)}
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
