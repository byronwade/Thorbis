"use client";

import { LayoutDashboard, Menu, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { UserProfile } from "@/lib/auth/user-data";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const PRIMARY_LINKS = [
  { label: "Platform", href: "/features" },
  { label: "Integrations", href: "/integrations" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/free-tools" },
  { label: "Company", href: "/about" },
] as const;

const DISCOVER_LINKS = [
  { label: "Switch to Thorbis", href: "/switch" },
  { label: "Implementation", href: "/implementation" },
  { label: "Reviews", href: "/reviews" },
  { label: "ROI Calculator", href: "/roi" },
] as const;

const SUPPORT_LINKS = [
  { label: "Help Center", href: "/kb" },
  { label: "Integrations", href: "/integrations" },
  { label: "Community", href: "/community" },
  { label: "Blog", href: "/blog" },
] as const;

const CTA_LINK = { label: "Create account", href: "/register" } as const;

export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (!cancelled) {
            setUserProfile(null);
            setLoading(false);
          }
          return;
        }

        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (cancelled) return;

        const fallbackName =
          user.user_metadata?.name || user.email?.split("@")[0] || "User";
        const fallbackEmail = user.email || profile?.email || "";
        const fallbackAvatar =
          profile?.avatar ||
          user.user_metadata?.avatar_url ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            fallbackEmail || fallbackName
          )}&backgroundColor=0ea5e9&textColor=ffffff`;

        setUserProfile({
          id: user.id,
          name: profile?.name || fallbackName,
          email: fallbackEmail,
          avatar: fallbackAvatar,
          bio: profile?.bio || undefined,
          phone: profile?.phone || undefined,
          emailVerified: !!user.email_confirmed_at || profile?.emailVerified,
          createdAt: new Date(profile?.createdAt || user.created_at),
        });
        setLoading(false);
      } catch (error) {
        console.error("Error loading profile", error);
        if (!cancelled) {
          setUserProfile(null);
          setLoading(false);
        }
      }
    };

    loadProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile();
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const desktopNav = useMemo(
    () =>
      PRIMARY_LINKS.map((item) => (
        <Link
          className="text-sm text-muted-foreground transition hover:text-foreground"
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      )),
    []
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled
          ? "bg-background/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur"
          : "bg-background/60 backdrop-blur supports-[backdrop-filter]:backdrop-blur-0"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground transition hover:text-primary"
          href="/"
        >
          <Image
            alt="Thorbis"
            className="size-6 rounded-sm"
            height={24}
            src="/ThorbisLogo.webp"
            width={24}
          />
          <span>Thorbis</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">{desktopNav}</nav>

        <div className="hidden items-center gap-2 md:flex">
          {!loading && userProfile ? (
            <>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 size-4" />
                  Dashboard
                </Link>
              </Button>
              <UserMenu
                activeCompanyId={null}
                teams={[
                  {
                    id: "thorbis-default",
                    name: "Thorbis",
                    logo: Wrench,
                    plan: "growth",
                  },
                ]}
                user={{
                  name: userProfile.name,
                  email: userProfile.email ?? "",
                  avatar: userProfile.avatar ?? "",
                }}
              />
            </>
          ) : (
            <>
              <Link
                className="text-sm text-muted-foreground transition hover:text-foreground"
                href="/login"
              >
                Sign in
              </Link>
              <Button asChild size="sm">
                <Link href={CTA_LINK.href}>{CTA_LINK.label}</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              aria-label="Open navigation"
              className="md:hidden"
              size="icon"
              variant="ghost"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-xs overflow-y-auto px-0 pb-0">
            <SheetHeader className="border-b px-4 pb-4">
              <Link
                className="flex items-center gap-2 text-base font-semibold"
                href="/"
              >
                <Image
                  alt="Thorbis"
                  className="size-6 rounded-sm"
                  height={24}
                  src="/ThorbisLogo.webp"
                  width={24}
                />
                Thorbis
              </Link>
            </SheetHeader>
            <div className="space-y-6 px-4 py-6">
              <div className="space-y-2">
                {PRIMARY_LINKS.map((item) => (
                  <Link
                    className="block text-base font-medium text-foreground transition hover:text-primary"
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Discover
                </p>
                <div className="mt-2 space-y-2">
                  {DISCOVER_LINKS.map((item) => (
                    <Link
                      className="block rounded-md border border-transparent px-3 py-2 text-sm text-muted-foreground transition hover:border-border hover:text-foreground"
                      href={item.href}
                      key={item.href}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Support
                </p>
                <div className="mt-2 space-y-2">
                  {SUPPORT_LINKS.map((item) => (
                    <Link
                      className="block rounded-md border border-transparent px-3 py-2 text-sm text-muted-foreground transition hover:border-border hover:text-foreground"
                      href={item.href}
                      key={item.href}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {!loading && userProfile ? (
                  <div className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-sm">
                    <p className="font-medium text-foreground">
                      {userProfile.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {userProfile.email}
                    </p>
                    <Link
                      className="mt-2 inline-flex text-xs font-medium text-primary underline underline-offset-4"
                      href="/dashboard"
                    >
                      Go to dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      className="block rounded-md border border-transparent px-3 py-2 text-sm text-muted-foreground transition hover:border-border hover:text-foreground"
                      href="/login"
                    >
                      Sign in
                    </Link>
                    <Link
                      className="block rounded-md border border-transparent px-3 py-2 text-sm text-muted-foreground transition hover:border-border hover:text-foreground"
                      href="/register"
                    >
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            </div>
            {!loading && !userProfile && (
              <SheetFooter className="border-t bg-muted/30">
                <Button asChild className="w-full" size="lg">
                  <Link href={CTA_LINK.href}>{CTA_LINK.label}</Link>
                </Button>
              </SheetFooter>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

