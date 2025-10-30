"use client";

import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Menu,
  Tv,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UserProfile } from "@/lib/auth/user-data";
import { HelpDropdown } from "./help-dropdown";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserMenu } from "./user-menu";

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

interface AppHeaderClientProps {
  userProfile: UserProfile;
}

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
    status: "coming-soon",
    isSpecial: true,
    mobileIcon: "T",
    mobileIconBg: "bg-gradient-to-r from-blue-500 to-cyan-400",
    mobileIconColor: "text-white",
  },
  {
    label: "Today",
    href: "/dashboard",
    mobileIcon: "T",
    mobileIconBg: "bg-primary/10",
    mobileIconColor: "text-primary",
  },
  {
    label: "Communication",
    href: "/dashboard/communication",
    mobileIcon: "C",
    mobileIconBg: "bg-green-500/10",
    mobileIconColor: "text-green-600",
  },
  {
    label: "Work",
    href: "/dashboard/work",
    status: "new",
    mobileIcon: "W",
    mobileIconBg: "bg-teal-500/10",
    mobileIconColor: "text-teal-600",
  },
  {
    label: "Finances",
    href: "/dashboard/finance",
    status: "updated",
    mobileIcon: "F",
    mobileIconBg: "bg-emerald-500/10",
    mobileIconColor: "text-emerald-600",
  },
  {
    label: "Reporting",
    href: "/dashboard/reporting",
    mobileIcon: "R",
    mobileIconBg: "bg-blue-500/10",
    mobileIconColor: "text-blue-600",
  },
  {
    label: "Marketing",
    href: "/dashboard/marketing",
    status: "coming-soon",
    mobileIcon: "M",
    mobileIconBg: "bg-pink-500/10",
    mobileIconColor: "text-pink-600",
  },
  {
    label: "Training",
    href: "/dashboard/training",
    status: "coming-soon",
    mobileIcon: "T",
    mobileIconBg: "bg-purple-500/10",
    mobileIconColor: "text-purple-600",
  },
];

// Sample teams data - TODO: Fetch from getUserCompanies() in server component
const sampleTeams = [
  {
    name: "Thorbis FSM",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
  {
    name: "Demo Company",
    logo: AudioWaveform,
    plan: "Pro",
  },
  {
    name: "Test Business",
    logo: Command,
    plan: "Free",
  },
];

function StatusIndicator({ status }: { status?: NavItemStatus }) {
  if (!status) {
    return null;
  }

  // For beta and coming-soon, show badge
  if (status === "beta") {
    return (
      <span className="-top-1.5 absolute right-0 rounded border border-blue-600 bg-blue-500 px-1 py-0.5 font-semibold text-[0.5rem] text-white uppercase leading-none tracking-wide">
        Beta
      </span>
    );
  }

  if (status === "coming-soon") {
    return (
      <span className="-top-1.5 absolute right-0 whitespace-nowrap rounded border border-purple-600 bg-purple-500 px-1 py-0.5 font-semibold text-[0.5rem] text-white uppercase leading-none tracking-wide">
        Soon
      </span>
    );
  }

  // Small blue circle for "new" and "updated"
  return (
    <span
      className="-top-1 absolute right-0 size-2 rounded-full bg-blue-500"
      title={status === "new" ? "New" : "Updated"}
    />
  );
}

function MobileStatusBadge({ status }: { status?: NavItemStatus }) {
  if (!status) {
    return null;
  }

  const styles = {
    beta: "bg-blue-500 text-white",
    new: "bg-green-500 text-white",
    updated: "bg-orange-500 text-white",
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
      className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold text-[0.65rem] uppercase tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export function AppHeaderClient({ userProfile }: AppHeaderClientProps) {
  const pathname = usePathname();

  // Hide header completely on TV display route (not settings)
  // Check this early to avoid hooks issues
  const isTVRoute = pathname === "/dashboard/tv";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 z-50 w-full bg-header-bg">
      <div className="flex h-14 items-center gap-2 px-4">
        {/* Mobile menu button */}
        <button
          className="hover-gradient flex h-8 w-8 items-center justify-center rounded-md border border-transparent outline-none transition-all hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 lg:hidden"
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
          className="hidden size-8 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 lg:flex dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
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
                : pathname.startsWith(item.href);

            if (item.isSpecial) {
              return (
                <div className="relative" key={item.href}>
                  <Link
                    className={`hover-gradient group relative inline-flex h-8 shrink-0 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-md px-3 font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${
                      isActive
                        ? "text-white dark:text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-slot="button"
                    href={item.href}
                  >
                    {/* Active state - gradient background */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary via-primary/90 to-primary/80 opacity-100 dark:from-primary dark:via-primary/80 dark:to-primary/60" />
                    )}
                    {/* Hover state - gradient background (only when not active) */}
                    {!isActive && (
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/60 via-primary/50 to-primary/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:from-primary/50 dark:via-primary/40 dark:to-primary/30" />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                  <StatusIndicator status={item.status} />
                </div>
              );
            }

            return (
              <div className="relative" key={item.href}>
                <Link
                  className={`hover-gradient relative inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-white/10 dark:text-white"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground dark:hover:bg-white/5"
                  }`}
                  data-slot="button"
                  href={item.href}
                >
                  {item.label}
                </Link>
                <StatusIndicator status={item.status} />
              </div>
            );
          })}
        </nav>

        {/* Mobile Navigation Sheet */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <button
              aria-label="Close mobile menu"
              className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm duration-300 lg:hidden ${
                isClosing ? "fade-out animate-out" : "fade-in animate-in"
              }`}
              onClick={closeMobileMenu}
              type="button"
            />

            {/* Sidebar Sheet */}
            <div
              className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-background shadow-2xl duration-300 lg:hidden ${
                isClosing
                  ? "slide-out-to-left animate-out"
                  : "slide-in-from-left animate-in"
              }`}
              ref={mobileMenuRef}
            >
              {/* Header with close button */}
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="font-semibold text-lg">Navigation</h2>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
                  onClick={closeMobileMenu}
                  type="button"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col space-y-1 p-4">
                  {/* AI Section */}
                  <div className="mb-4">
                    <h3 className="mb-2 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                      AI Assistant
                    </h3>
                    {navigationItems
                      .filter((item) => item.isSpecial)
                      .map((item) => {
                        const isActive =
                          item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href);
                        return (
                          <Link
                            className={`group flex items-center justify-between rounded-lg px-4 py-3 font-medium text-sm transition-all duration-200 hover:border-primary/20 hover:bg-primary/10 hover:text-primary hover:shadow-sm ${isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-foreground"}`}
                            href={item.href}
                            key={item.href}
                            onClick={closeMobileMenu}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-md ${item.mobileIconBg}`}
                              >
                                <span
                                  className={`font-bold text-xs ${item.mobileIconColor}`}
                                >
                                  {item.mobileIcon}
                                </span>
                              </div>
                              <span>{item.label}</span>
                            </div>
                            <MobileStatusBadge status={item.status} />
                          </Link>
                        );
                      })}
                  </div>

                  {/* Main Navigation */}
                  <div className="mb-4">
                    <h3 className="mb-2 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                      Main Navigation
                    </h3>
                    {navigationItems
                      .filter((item) => !item.isSpecial)
                      .map((item) => {
                        const isActive =
                          item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href);
                        return (
                          <Link
                            className={`group flex items-center justify-between rounded-lg px-4 py-3 font-medium text-sm transition-all duration-200 hover:border-primary/20 hover:bg-primary/10 hover:text-primary hover:shadow-sm ${isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-foreground"}`}
                            href={item.href}
                            key={item.href}
                            onClick={closeMobileMenu}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-md ${item.mobileIconBg}`}
                              >
                                <span
                                  className={`font-bold text-xs ${item.mobileIconColor}`}
                                >
                                  {item.mobileIcon}
                                </span>
                              </div>
                              <span>{item.label}</span>
                            </div>
                            <MobileStatusBadge status={item.status} />
                          </Link>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Right side controls */}
        <div className="ml-auto flex items-center gap-2 overflow-visible md:flex-1 md:justify-end">
          {/* TV Display */}
          <Link
            className="hover-gradient flex h-8 w-8 items-center justify-center rounded-md border border-transparent outline-none transition-all hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
            href="/dashboard/tv"
            title="TV Display"
          >
            <Tv className="size-4" />
            <span className="sr-only">TV Display</span>
          </Link>

          {/* Notifications */}
          <NotificationsDropdown />

          {/* Help */}
          <HelpDropdown />

          {/* User Menu - Data passed from server, no loading state needed */}
          <UserMenu
            teams={sampleTeams}
            user={{
              name: userProfile.name,
              email: userProfile.email,
              avatar: userProfile.avatar,
            }}
          />
        </div>
      </div>
    </header>
  );
}
