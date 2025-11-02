"use client";

import {
  BadgeCheck,
  CreditCard,
  LogOut,
  type LucideIcon,
  Moon,
  Plus,
  Settings,
  ShoppingCart,
  Sun,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { signOut } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  teams: {
    name: string;
    logo: LucideIcon;
    plan: string;
  }[];
}

export function UserMenu({ user, teams }: UserMenuProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTeam, setActiveTeam] = useState(teams[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut();
  };

  const isDark =
    mounted &&
    (theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches));

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="hover-gradient flex h-8 items-center gap-2 rounded-md border border-border bg-background px-2 shadow-sm outline-none transition-all hover:border-primary/50 hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
          suppressHydrationWarning
          type="button"
        >
          <Avatar className="size-6 rounded-md">
            <AvatarImage alt={user.name} src={user.avatar} />
            <AvatarFallback className="rounded-md text-[10px]">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="hidden font-medium text-sm md:inline-block">
            {user.name.split(" ")[0]}
          </span>
          <span className="sr-only">User menu</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-lg">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage alt={user.name} src={user.avatar} />
              <AvatarFallback className="rounded-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Teams */}
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Organizations
        </DropdownMenuLabel>
        {teams.map((team, index) => {
          const isActive = team === activeTeam;
          return (
            <DropdownMenuItem
              className={`gap-2 p-2 ${isActive ? "bg-accent" : ""}`}
              key={team.name}
              onClick={() => setActiveTeam(team)}
            >
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <team.logo className="size-4 shrink-0" />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="font-medium text-sm">{team.name}</span>
                <span className="text-muted-foreground text-xs">
                  {team.plan}
                </span>
              </div>
              {isActive && (
                <div className="ml-auto size-2 rounded-full bg-primary" />
              )}
              <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuItem asChild className="gap-2 p-2">
          <Link href="/dashboard/settings/organizations/new">
            <div className="flex size-6 items-center justify-center rounded-md border">
              <Plus className="size-4" />
            </div>
            <span className="font-medium text-muted-foreground">
              Add new business
            </span>
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
            <span className="text-muted-foreground text-xs">
              {mounted ? (isDark ? "Dark" : "Light") : "..."}
            </span>
            <Switch
              aria-label="Toggle theme"
              checked={isDark}
              disabled={!mounted}
              onCheckedChange={toggleTheme}
            />
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
