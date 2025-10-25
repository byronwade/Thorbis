"use client";

import { Building2, ChevronDownIcon, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useHoverGradient } from "@/hooks/use-mouse-position";
import { useUIStore, useUserStore } from "@/lib/store";

export function AppHeader() {
  const pathname = usePathname();
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);
  const user = useUserStore((state) => state.user);

  // Mouse tracking refs for each button
  const todayRef = useHoverGradient();
  const communicationRef = useHoverGradient();
  const scheduleRef = useHoverGradient();
  const customersRef = useHoverGradient();
  const financeRef = useHoverGradient();
  const reportsRef = useHoverGradient();
  const marketingRef = useHoverGradient();
  const stratosRef = useHoverGradient();
  const settingsRef = useHoverGradient();
  const businessRef = useHoverGradient();
  const themeRef = useHoverGradient();
  const notificationsRef = useHoverGradient();
  const profileRef = useHoverGradient();
  const logoutRef = useHoverGradient();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <div className="container-wrapper 3xl:fixed:px-0 px-6">
      <div className="**:data-[slot=separator]:!h-4 3xl:fixed:container flex h-(--header-height) items-center gap-2">
        {/* Mobile menu button */}
        <button
          aria-controls="mobile-menu"
          aria-expanded="false"
          aria-haspopup="dialog"
          className="extend-touch-target !p-0 flex h-8 shrink-0 touch-manipulation items-center justify-start gap-2.5 whitespace-nowrap rounded-md px-4 py-2 font-medium text-sm outline-none transition-all hover:bg-transparent hover:text-accent-foreground focus-visible:border-ring focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-ring/50 active:bg-transparent disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 aria-invalid:border-destructive aria-invalid:ring-destructive/20 lg:hidden dark:aria-invalid:ring-destructive/40 dark:hover:bg-transparent [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
          data-slot="popover-trigger"
          data-state="closed"
          type="button"
        >
          <div className="relative flex h-8 w-4 items-center justify-center">
            <div className="relative size-4">
              <span className="absolute top-1 left-0 block h-0.5 w-4 bg-foreground transition-all duration-100" />
              <span className="absolute top-2.5 left-0 block h-0.5 w-4 bg-foreground transition-all duration-100" />
            </div>
            <span className="sr-only">Toggle Menu</span>
          </div>
          <span className="flex h-8 items-center font-medium text-lg leading-none">
            Menu
          </span>
        </button>

        {/* Logo */}
        <Link
          className="hidden size-8 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 lg:flex dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
          data-slot="button"
          href="/"
        >
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Stratos</title>
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="sr-only">Stratos</span>
        </Link>

        {/* Main Navigation */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          <Link
            className={`hover-gradient inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 font-medium text-sm outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${pathname === "/dashboard" ? "text-primary" : ""}`}
            data-slot="button"
            href="/dashboard"
            ref={todayRef}
          >
            Today
          </Link>
          <Link
            className={`hover-gradient inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 font-medium text-sm outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${pathname.startsWith("/dashboard/communication") ? "text-primary" : ""}`}
            data-slot="button"
            href="/dashboard/communication"
            ref={communicationRef}
          >
            Communication
          </Link>
          <Link
            className={`hover-gradient inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 font-medium text-sm outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${pathname.startsWith("/dashboard/schedule") ? "text-primary" : ""}`}
            data-slot="button"
            href="/dashboard/schedule"
            ref={scheduleRef}
          >
            Schedule
          </Link>
          <Link
            className={`hover-gradient inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 font-medium text-sm outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${pathname.startsWith("/dashboard/customers") ? "text-primary" : ""}`}
            data-slot="button"
            href="/dashboard/customers"
            ref={customersRef}
          >
            Customers
          </Link>
          <Link
            className={`hover-gradient inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 font-medium text-sm outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${pathname.startsWith("/dashboard/finance") ? "text-primary" : ""}`}
            data-slot="button"
            href="/dashboard/finance"
            ref={financeRef}
          >
            Finances
          </Link>
          <Link
            className={`hover-gradient inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 font-medium text-sm outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${pathname.startsWith("/dashboard/reports") ? "text-primary" : ""}`}
            data-slot="button"
            href="/dashboard/reports"
            ref={reportsRef}
          >
            Reporting
          </Link>
          <Link
            className={`hover-gradient inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 font-medium text-sm outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${pathname.startsWith("/dashboard/marketing") ? "text-primary" : ""}`}
            data-slot="button"
            href="/dashboard/marketing"
            ref={marketingRef}
          >
            Marketing
          </Link>
          <Link
            className={`hover-gradient relative inline-flex h-8 shrink-0 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-md px-3 font-medium text-sm outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${pathname.startsWith("/dashboard/ai") ? "text-white shadow-lg" : "text-foreground"}`}
            data-slot="button"
            href="/dashboard/ai"
            ref={stratosRef}
          >
            {pathname.startsWith("/dashboard/ai") && (
              <div className="absolute inset-0 animate-gradient-x bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 opacity-80" />
            )}
            {!pathname.startsWith("/dashboard/ai") && (
              <div className="absolute inset-0 animate-gradient-x bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-blue-600/20 opacity-60" />
            )}
            <span className="relative z-10">Stratos</span>
          </Link>
          <Link
            className={`hover-gradient inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 font-medium text-sm outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${pathname.startsWith("/dashboard/settings") ? "text-primary" : ""}`}
            data-slot="button"
            href="/dashboard/settings"
            ref={settingsRef}
          >
            Settings
          </Link>
        </nav>

        {/* Right side controls */}
        <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
          {/* Business Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="hover-gradient inline-flex h-8 shrink-0 items-center justify-center gap-1.5 gap-2 whitespace-nowrap rounded-md rounded-md px-3 font-medium text-sm outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
                data-slot="button"
                ref={businessRef}
                type="button"
              >
                <Building2 className="size-4" />
                <span className="hidden sm:inline">Business</span>
                <ChevronDownIcon className="size-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Switch Business</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Building2 className="mr-2 size-4" />
                <span>Acme Corporation</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Building2 className="mr-2 size-4" />
                <span>TechStart Inc</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Create new business</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Manage businesses</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator
            className="h-4"
            data-orientation="vertical"
            data-slot="separator"
            orientation="vertical"
          />

          {/* Theme Toggle */}
          <button
            className="hover-gradient group/toggle extend-touch-target inline-flex size-8 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
            data-slot="button"
            onClick={toggleTheme}
            ref={themeRef}
            title="Toggle theme"
            type="button"
          >
            <svg
              className="size-4.5"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Theme</title>
              <path d="M0 0h24v24H0z" fill="none" stroke="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M12 3l0 18" />
              <path d="M12 9l4.65 -4.65" />
              <path d="M12 14.3l7.37 -7.37" />
              <path d="M12 19.6l8.85 -8.85" />
            </svg>
            <span className="sr-only">Toggle theme</span>
          </button>

          {/* Notifications */}
          <button
            className="hover-gradient flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
            ref={notificationsRef}
            title="Notifications"
            type="button"
          >
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="sr-only">Notifications</span>
          </button>

          <Separator
            className="h-4"
            data-orientation="vertical"
            data-slot="separator"
            orientation="vertical"
          />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="hover-gradient inline-flex h-8 shrink-0 items-center justify-center gap-1.5 gap-2 whitespace-nowrap rounded-md rounded-md px-3 font-medium text-sm outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
                data-slot="button"
                ref={profileRef}
                type="button"
              >
                <User className="size-4" />
                <span className="hidden sm:inline">
                  {user?.name || "Guest"}
                </span>
                <ChevronDownIcon className="size-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="font-medium text-sm leading-none">
                    {user?.name || "Guest"}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {user?.email || "Not logged in"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="logout-gradient" ref={logoutRef}>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
