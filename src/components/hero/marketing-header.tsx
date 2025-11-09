"use client";

import { Menu, Wrench, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { UserProfile } from "@/lib/auth/user-data";
import { createClient } from "@/lib/supabase/client";

/**
 * MarketingHeader - Client Component
 *
 * Performance optimizations:
 * - Uses Supabase Auth state change listener for real-time updates
 * - Fetches user profile from server with RLS security
 * - Lightweight bundle with code splitting
 * - Cached profile data with React cache()
 */

export function MarketingHeader() {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const ANIMATION_DURATION = 300;

  // Check authentication status and fetch user profile
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      setError("Supabase client not configured");
      return;
    }

    // Fetch user profile from server
    async function fetchUserProfile() {
      if (!supabase) return;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setUserProfile(null);
          setLoading(false);
          return;
        }

        // Fetch profile from public.users table with RLS
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.warn("Error fetching user profile:", profileError);
          // Fallback to auth user data
          setUserProfile({
            id: user.id,
            name:
              user.user_metadata?.name || user.email?.split("@")[0] || "User",
            email: user.email || "",
            avatar:
              user.user_metadata?.avatar_url ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.email || "User")}&backgroundColor=0ea5e9&textColor=ffffff`,
            emailVerified: !!user.email_confirmed_at,
            createdAt: new Date(user.created_at),
          });
        } else {
          // Merge auth data with profile data
          setUserProfile({
            id: user.id,
            name:
              profile?.name ||
              user.user_metadata?.name ||
              user.email?.split("@")[0] ||
              "User",
            email: user.email || profile?.email || "",
            avatar:
              profile?.avatar ||
              user.user_metadata?.avatar_url ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.email || profile?.email || "User")}&backgroundColor=0ea5e9&textColor=ffffff`,
            bio: profile?.bio || undefined,
            phone: profile?.phone || undefined,
            emailVerified: !!user.email_confirmed_at || profile?.emailVerified,
            createdAt: new Date(profile?.createdAt || user.created_at),
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Unexpected error fetching user profile:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    }

    fetchUserProfile();

    // Listen for auth changes
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchUserProfile();
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
    }, ANIMATION_DURATION);
  }, []);

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

  // Scroll detection
  useEffect(() => {
    const SCROLL_THRESHOLD = 20;

    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse tracking for hover gradient effect
  useEffect(() => {
    const PERCENTAGE_MULTIPLIER = 100;

    const handleMouseMove = (e: MouseEvent) => {
      const gradientElements = document.querySelectorAll(".hover-gradient");
      for (const el of gradientElements) {
        const rect = (el as HTMLElement).getBoundingClientRect();
        const x =
          ((e.clientX - rect.left) / rect.width) * PERCENTAGE_MULTIPLIER;
        const y =
          ((e.clientY - rect.top) / rect.height) * PERCENTAGE_MULTIPLIER;
        (el as HTMLElement).style.setProperty("--mouse-x", `${x}%`);
        (el as HTMLElement).style.setProperty("--mouse-y", `${y}%`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-border/40 border-b bg-background/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            className="hover-gradient flex items-center gap-2 font-bold text-foreground text-xl transition-colors hover:text-primary"
            href="/"
          >
            <Image
              alt="Thorbis"
              className="size-6"
              height={24}
              src="/ThorbisLogo.webp"
              width={24}
            />
            <span>Thorbis</span>
          </Link>

          {/* Desktop Navigation with Mega Menu */}
          {mounted && (
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {/* Solutions Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover-gradient h-8 gap-1.5 rounded-md bg-transparent px-3 font-medium text-sm transition-all hover:bg-muted/50 hover:text-foreground focus:bg-muted/50 focus:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground">
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="!border !bg-background !shadow-lg">
                    <div className="grid w-[750px] grid-cols-3 gap-4 p-5">
                      {/* Column 1: Grow Your Business */}
                      <div className="space-y-1">
                        <div className="mb-2 px-2 font-semibold text-muted-foreground/70 text-xs uppercase tracking-wider">
                          Grow Your Business
                        </div>
                        <Link
                          className="group block rounded-lg border border-transparent p-2.5 transition-all hover:bg-muted/60"
                          href="/features/ai-assistant"
                        >
                          <div className="font-medium text-foreground text-sm group-hover:text-primary">
                            AI Assistant 24/7
                          </div>
                          <div className="text-muted-foreground text-xs leading-snug">
                            Calls, books, answers questions
                          </div>
                        </Link>
                        <Link
                          className="group block rounded-lg border border-transparent p-2.5 transition-all hover:bg-muted/60"
                          href="/features/crm"
                        >
                          <div className="font-medium text-foreground text-sm group-hover:text-primary">
                            Lead Management & CRM
                          </div>
                          <div className="text-muted-foreground text-xs leading-snug">
                            Convert more leads to customers
                          </div>
                        </Link>
                        <Link
                          className="group block rounded-lg border border-transparent p-2.5 transition-all hover:bg-muted/60"
                          href="/features/online-booking"
                        >
                          <div className="font-medium text-foreground text-sm group-hover:text-primary">
                            Online Booking Portal
                          </div>
                          <div className="text-muted-foreground text-xs leading-snug">
                            24/7 customer self-scheduling
                          </div>
                        </Link>
                        <Link
                          className="group block rounded-lg border border-transparent p-2.5 transition-all hover:bg-muted/60"
                          href="/features/marketing"
                        >
                          <div className="font-medium text-foreground text-sm group-hover:text-primary">
                            Marketing Automation
                          </div>
                          <div className="text-muted-foreground text-xs leading-snug">
                            Email, SMS & follow-up campaigns
                          </div>
                        </Link>
                        <Link
                          className="group block rounded-lg border border-transparent p-2.5 transition-all hover:bg-muted/60"
                          href="/features/customer-portal"
                        >
                          <div className="font-medium text-foreground text-sm group-hover:text-primary">
                            Customer Portal
                          </div>
                          <div className="text-muted-foreground text-xs leading-snug">
                            Self-service history & payments
                          </div>
                        </Link>
                      </div>

                      {/* Column 2: Manage Operations */}
                      <div className="space-y-1">
                        <div className="mb-2 px-2 font-semibold text-muted-foreground/70 text-xs uppercase tracking-wider">
                          Manage Operations
                        </div>

                        <Link
                          className="group block rounded-lg border border-transparent bg-transparent p-2.5 transition-all hover:bg-muted/60"
                          href="/features/scheduling"
                        >
                          <div className="font-medium text-foreground text-sm group-hover:text-primary">
                            Smart Scheduling & Dispatch
                          </div>
                          <div className="text-muted-foreground text-xs leading-snug">
                            4 views, drag-and-drop board
                          </div>
                        </Link>

                        <Link
                          className="group block rounded-lg border border-transparent bg-transparent p-2.5 transition-all hover:bg-muted/60"
                          href="/features/mobile-app"
                        >
                          <div className="font-medium text-foreground text-sm group-hover:text-primary">
                            Mobile Field App
                          </div>
                          <div className="text-muted-foreground text-xs leading-snug">
                            Complete technician toolkit
                          </div>
                        </Link>

                        <Link
                          className="group block rounded-lg border border-transparent bg-transparent p-2.5 transition-all hover:bg-muted/60"
                          href="/features/routing"
                        >
                          <div className="font-medium text-foreground text-sm group-hover:text-primary">
                            Route Optimization
                          </div>
                          <div className="text-muted-foreground text-xs leading-snug">
                            GPS tracking & intelligent routing
                          </div>
                        </Link>

                        <Link
                          className="group block rounded-lg border border-transparent bg-transparent p-2.5 transition-all hover:bg-muted/60"
                          href="/features/inventory"
                        >
                          <div className="font-medium text-foreground text-sm group-hover:text-primary">
                            Inventory & Equipment
                          </div>
                          <div className="text-muted-foreground text-xs leading-snug">
                            Track materials & truck stock
                          </div>
                        </Link>

                        <Link
                          className="group block rounded-lg border border-transparent bg-transparent p-2.5 transition-all hover:bg-muted/60"
                          href="/features/team-management"
                        >
                          <div className="font-medium text-foreground text-sm group-hover:text-primary">
                            Team Management
                          </div>
                          <div className="text-muted-foreground text-xs leading-snug">
                            Time tracking, skills & training
                          </div>
                        </Link>
                      </div>

                      {/* Column 3: Financial Management */}
                      <div className="space-y-1">
                        <div className="mb-2 px-2 font-semibold text-muted-foreground/70 text-xs uppercase tracking-wider">
                          Financial Management
                        </div>

                        <Link
                          className="group block rounded-lg border border-transparent bg-transparent p-2.5 transition-all hover:bg-muted/60"
                          href="/features/invoicing"
                        >
                          <div className="font-medium text-foreground text-sm group-hover:text-primary">
                            Invoicing & Payments
                          </div>
                          <div className="text-muted-foreground text-xs leading-snug">
                            Get paid faster with 0% fees
                          </div>
                        </Link>

                        <Link
                          className="group block rounded-lg border border-transparent bg-transparent p-2.5 transition-all hover:bg-muted/60"
                          href="/features/quickbooks"
                        >
                          <div className="font-medium text-foreground text-sm group-hover:text-primary">
                            QuickBooks Integration
                          </div>
                          <div className="text-muted-foreground text-xs leading-snug">
                            2-way sync with accounting
                          </div>
                        </Link>

                        <Link
                          className="group block rounded-lg border border-transparent bg-transparent p-2.5 transition-all hover:bg-muted/60"
                          href="/features/estimates"
                        >
                          <div className="font-medium text-foreground text-sm group-hover:text-primary">
                            Estimates & Proposals
                          </div>
                          <div className="text-muted-foreground text-xs leading-snug">
                            Good/better/best pricing options
                          </div>
                        </Link>

                        <Link
                          className="group block rounded-lg border border-transparent bg-transparent p-2.5 transition-all hover:bg-muted/60"
                          href="/features/financing"
                        >
                          <div className="font-medium text-foreground text-sm group-hover:text-primary">
                            Customer Financing
                          </div>
                          <div className="text-muted-foreground text-xs leading-snug">
                            Instant approval, higher tickets
                          </div>
                        </Link>

                        <Link
                          className="group block rounded-lg border border-transparent bg-transparent p-2.5 transition-all hover:bg-muted/60"
                          href="/features/payroll"
                        >
                          <div className="font-medium text-foreground text-sm group-hover:text-primary">
                            Payroll & Commission
                          </div>
                          <div className="text-muted-foreground text-xs leading-snug">
                            Auto-calculate tech earnings
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="border-t bg-muted/20 px-5 py-3.5">
                      <Link
                        className="inline-flex items-center gap-1 font-medium text-primary text-sm transition-colors hover:text-primary/80"
                        href="/features"
                      >
                        See All 50+ Features →
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Industries Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover-gradient h-8 gap-1.5 rounded-md bg-transparent px-3 font-medium text-sm transition-all hover:bg-muted/50 hover:text-foreground focus:bg-muted/50 focus:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground">
                    Industries
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="border bg-background shadow-lg">
                    <div className="grid w-[600px] grid-cols-3 gap-2 p-4">
                      {/* Column 1 */}
                      <div className="space-y-0.5">
                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/industries/hvac"
                        >
                          HVAC Contractors
                        </Link>

                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/industries/plumbing"
                        >
                          Plumbing Services
                        </Link>

                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/industries/electrical"
                        >
                          Electrical Contractors
                        </Link>

                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/industries/handyman"
                        >
                          Handyman Services
                        </Link>
                      </div>
                      {/* Column 2 */}
                      <div className="space-y-0.5">
                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/industries/landscaping"
                        >
                          Landscaping & Lawn
                        </Link>

                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/industries/pool-service"
                        >
                          Pool & Spa Service
                        </Link>

                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/industries/pest-control"
                        >
                          Pest Control
                        </Link>

                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/industries/appliance-repair"
                        >
                          Appliance Repair
                        </Link>
                      </div>
                      {/* Column 3 */}
                      <div className="space-y-0.5">
                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/industries/roofing"
                        >
                          Roofing Contractors
                        </Link>

                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/industries/cleaning"
                        >
                          Cleaning Services
                        </Link>

                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/industries/locksmith"
                        >
                          Locksmith Services
                        </Link>

                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/industries/garage-door"
                        >
                          Garage Door Services
                        </Link>
                      </div>
                    </div>
                    <div className="border-t bg-muted/20 px-4 py-3">
                      <Link
                        className="inline-flex items-center gap-1 font-medium text-primary text-sm transition-colors hover:text-primary/80"
                        href="/industries"
                      >
                        View All Industries (25+) →
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Pricing - Direct Link */}
                <NavigationMenuItem>
                  <Link
                    className="hover-gradient inline-flex h-8 items-center gap-1.5 rounded-md bg-transparent px-3 font-medium text-sm transition-all hover:bg-accent hover:text-accent-foreground"
                    href="/pricing"
                  >
                    Pricing
                  </Link>
                </NavigationMenuItem>

                {/* Resources Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover-gradient h-8 gap-1.5 rounded-md bg-transparent px-3 font-medium text-sm transition-all hover:bg-muted/50 hover:text-foreground focus:bg-muted/50 focus:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="border bg-background shadow-lg">
                    <div className="grid w-[420px] grid-cols-2 gap-4 p-4">
                      {/* Column 1 */}
                      <div className="space-y-1">
                        <div className="mb-2 px-2 font-semibold text-muted-foreground/70 text-xs uppercase tracking-wider">
                          Learn
                        </div>

                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/blog"
                        >
                          Blog
                        </Link>

                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/case-studies"
                        >
                          Case Studies
                        </Link>

                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/webinars"
                        >
                          Webinars
                        </Link>
                      </div>
                      {/* Column 2 */}
                      <div className="space-y-1">
                        <div className="mb-2 px-2 font-semibold text-muted-foreground/70 text-xs uppercase tracking-wider">
                          Support
                        </div>

                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/help"
                        >
                          Help Center
                        </Link>

                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/community"
                        >
                          Community
                        </Link>

                        <Link
                          className="block rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all hover:bg-muted/60 hover:text-primary"
                          href="/contact"
                        >
                          Contact Support
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-2">
            {!loading && userProfile ? (
              // Show user menu when logged in with secure profile data
              <UserMenu
                teams={[
                  {
                    id: "temp",
                    name: "My Company", // TODO: Fetch from getUserCompanies()
                    logo: Wrench,
                    plan: "free", // TODO: Fetch from company data
                  },
                ]}
                user={{
                  name: userProfile.name,
                  email: userProfile.email,
                  avatar: userProfile.avatar,
                }}
              />
            ) : loading ? (
              // Show loading state
              <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
            ) : error ? (
              // Show error state (still show login buttons)
              <>
                <Button
                  asChild
                  className="hover-gradient hidden sm:flex"
                  size="sm"
                  variant="ghost"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="hover-gradient bg-primary text-primary-foreground hover:bg-primary/90"
                  size="sm"
                >
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </>
            ) : (
              // Show login/register buttons when not logged in
              <>
                <Button
                  asChild
                  className="hover-gradient hidden sm:flex"
                  size="sm"
                  variant="ghost"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="hover-gradient bg-primary text-primary-foreground hover:bg-primary/90"
                  size="sm"
                >
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
          >
            {isMobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <button
            aria-label="Close mobile menu"
            className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm duration-300 ${
              isClosing ? "fade-out animate-out" : "fade-in animate-in"
            }`}
            onClick={closeMobileMenu}
            type="button"
          />

          {/* Mobile Menu */}
          <div
            className={`fixed inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto bg-background shadow-2xl duration-300 lg:hidden ${
              isClosing
                ? "slide-out-to-top animate-out"
                : "slide-in-from-top animate-in"
            }`}
            ref={mobileMenuRef}
          >
            <div className="space-y-1 p-4 pb-24">
              {/* Solutions */}
              <div className="space-y-1">
                <div className="px-3 py-2 font-semibold text-sm">Solutions</div>
                <Link
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  href="/features/ai-assistant"
                  onClick={closeMobileMenu}
                >
                  AI Assistant 24/7
                </Link>
                <Link
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  href="/features/scheduling"
                  onClick={closeMobileMenu}
                >
                  Smart Scheduling & Dispatch
                </Link>
                <Link
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  href="/features/mobile-app"
                  onClick={closeMobileMenu}
                >
                  Mobile Field App
                </Link>
                <Link
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  href="/features/invoicing"
                  onClick={closeMobileMenu}
                >
                  Invoicing & Payments
                </Link>
                <Link
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  href="/features/payroll"
                  onClick={closeMobileMenu}
                >
                  Payroll & Commission
                </Link>
                <Link
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  href="/features"
                  onClick={closeMobileMenu}
                >
                  View All 50+ Features →
                </Link>
              </div>

              {/* Industries */}
              <div className="space-y-1 pt-4">
                <div className="px-3 py-2 font-semibold text-sm">
                  Industries
                </div>
                <Link
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  href="/industries/hvac"
                  onClick={closeMobileMenu}
                >
                  HVAC Contractors
                </Link>
                <Link
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  href="/industries/plumbing"
                  onClick={closeMobileMenu}
                >
                  Plumbing Services
                </Link>
                <Link
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  href="/industries/electrical"
                  onClick={closeMobileMenu}
                >
                  Electrical Contractors
                </Link>
                <Link
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  href="/industries"
                  onClick={closeMobileMenu}
                >
                  View All Industries →
                </Link>
              </div>

              {/* Pricing */}
              <div className="pt-4">
                <Link
                  className="block rounded-md px-3 py-2 font-semibold text-sm hover:bg-accent"
                  href="/pricing"
                  onClick={closeMobileMenu}
                >
                  Pricing
                </Link>
              </div>

              {/* Resources */}
              <div className="space-y-1 pt-4">
                <div className="px-3 py-2 font-semibold text-sm">Resources</div>
                <Link
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  href="/blog"
                  onClick={closeMobileMenu}
                >
                  Blog
                </Link>
                <Link
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  href="/case-studies"
                  onClick={closeMobileMenu}
                >
                  Case Studies
                </Link>
                <Link
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  href="/help"
                  onClick={closeMobileMenu}
                >
                  Help Center
                </Link>
              </div>
            </div>

            {/* Bottom CTA buttons - Sticky */}
            <div className="fixed inset-x-0 bottom-0 border-t bg-background p-4">
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  className="opacity-100"
                  size="sm"
                  variant="ghost"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary text-primary-foreground opacity-100 hover:bg-primary/90"
                  size="sm"
                >
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
