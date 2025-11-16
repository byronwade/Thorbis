"use client";

import { GalleryVerticalEnd, Menu, Tv, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UserProfile } from "@/lib/auth/user-data";
import { HelpDropdown } from "./help-dropdown";
import { NotificationsDropdown } from "./notifications-dropdown";
import { PhoneDropdown } from "./phone-dropdown";
import { QuickAddDropdown } from "./quick-add-dropdown";
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
  customers?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company_name?: string;
  }>;
  companyPhones?: Array<{
    id: string;
    number: string;
    label?: string;
  }>;
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
    status: "coming-soon",
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
    status: "new",
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
      <span className="-top-1.5 absolute right-0 rounded bg-blue-500 px-1 py-0.5 font-semibold text-[0.5rem] text-white uppercase leading-none tracking-wide shadow-sm">
        Beta
      </span>
    );
  }

  if (status === "coming-soon") {
    return (
      <span className="-top-1.5 absolute right-0 whitespace-nowrap rounded bg-purple-500 px-1 py-0.5 font-semibold text-[0.5rem] text-white uppercase leading-none tracking-wide shadow-sm">
        Soon
      </span>
    );
  }

  // Badge for "new" and "updated"
  if (status === "new") {
    return (
      <span className="-top-1.5 absolute right-0 rounded bg-green-500 px-1 py-0.5 font-semibold text-[0.5rem] text-white uppercase leading-none tracking-wide shadow-sm">
        New
      </span>
    );
  }

  return (
    <span
      className="-top-1 absolute right-0 size-2 rounded-full bg-blue-500 shadow-sm"
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
      className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold text-[0.65rem] uppercase tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export function AppHeaderClient({
  userProfile,
  companies,
  activeCompanyId,
  customers = [],
  companyPhones = [],
}: AppHeaderClientProps) {
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
    <header className="safe-top sticky top-0 z-50 w-full bg-header-bg">
      <div className="flex h-14 items-center gap-2 px-4 md:px-6">
        {/* Mobile menu button */}
        <button
          className="touch-target no-select native-transition hover-gradient flex items-center justify-center rounded-md border border-transparent outline-none hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-95 disabled:pointer-events-none disabled:opacity-50 lg:hidden"
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
                : pathname?.startsWith(item.href);

            if (item.isSpecial) {
              return (
                <div className="relative" key={item.href}>
                  <Link
                    className={`relative inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 font-medium text-sm outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ${
                      isActive
                        ? "bg-primary/15 text-primary shadow-sm dark:bg-primary/25"
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
                  className={`relative inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 font-medium text-sm outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ${
                    isActive
                      ? "bg-primary/15 text-primary shadow-sm dark:bg-primary/25"
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
          })}
        </nav>

        {/* Mobile Navigation Sheet */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <button
              aria-label="Close mobile menu"
              className={`fixed inset-0 z-40 bg-foreground/60 backdrop-blur-sm duration-300 lg:hidden dark:bg-background/80 ${
                isClosing ? "fade-out animate-out" : "fade-in animate-in"
              }`}
              onClick={closeMobileMenu}
              type="button"
            />

            {/* Sidebar Sheet */}
            <div
              className={`safe-top safe-bottom safe-left fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-background shadow-2xl duration-300 lg:hidden ${
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
                  className="touch-target no-select native-transition flex items-center justify-center rounded-md hover:bg-accent active:scale-95"
                  onClick={closeMobileMenu}
                  type="button"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="momentum-scroll flex-1 overflow-y-auto">
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
                            : pathname?.startsWith(item.href);
                        return (
                          <Link
                            className={`group flex items-center justify-between rounded-lg px-4 py-3 font-medium text-sm transition-all duration-200 ${
                              isActive
                                ? "bg-primary/15 text-primary shadow-sm"
                                : "text-foreground hover:bg-muted/70 hover:text-foreground hover:shadow-sm"
                            }`}
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
                            : pathname?.startsWith(item.href);
                        return (
                          <Link
                            className={`group flex items-center justify-between rounded-lg px-4 py-3 font-medium text-sm transition-all duration-200 ${
                              isActive
                                ? "bg-primary/15 text-primary shadow-sm"
                                : "text-foreground hover:bg-muted/70 hover:text-foreground hover:shadow-sm"
                            }`}
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
          {/* Quick Add Menu */}
          <QuickAddDropdown />

          {/* Phone/Calls */}
          <PhoneDropdown
            companyId={activeCompanyId || ""}
            companyPhones={companyPhones}
            customers={customers}
          />

          {/* TV Display */}
          <Link href="/dashboard/tv" title="TV Display">
            <button
              className="hover-gradient flex h-8 w-8 items-center justify-center rounded-md border border-transparent outline-none transition-all hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
              type="button"
            >
              <Tv className="size-4" />
              <span className="sr-only">TV Display</span>
            </button>
          </Link>

          {/* Notifications */}
          <NotificationsDropdown />

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
                    logo: defaultLogo,
                    plan: company.plan,
                    onboardingComplete: company.onboardingComplete,
                    hasPayment: company.hasPayment,
                  },
                ])
              ).values()
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
  );
}
