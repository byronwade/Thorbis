"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function MarketingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const ANIMATION_DURATION = 300;

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
            <svg
              className="size-6"
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
            <span>Stratos</span>
          </Link>

          {/* Desktop Navigation with Mega Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:border-primary/20 hover:bg-primary/5 hover:text-primary">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent className="border-none bg-transparent shadow-none">
                  <div className="grid w-[600px] grid-cols-2 gap-3 p-6">
                    <NavigationMenuLink className="group grid gap-2 rounded-lg bg-transparent p-4 transition-colors hover:border-primary/10 hover:bg-primary/5 hover:text-primary">
                      <div className="font-semibold text-base">
                        Field Operations
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Job management, scheduling, and dispatch tools
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink className="group grid gap-2 rounded-lg bg-transparent p-4 transition-colors hover:border-primary/10 hover:bg-primary/5 hover:text-primary">
                      <div className="font-semibold text-base">CRM & Sales</div>
                      <div className="text-muted-foreground text-sm">
                        Customer management and sales pipeline
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink className="group grid gap-2 rounded-lg bg-transparent p-4 transition-colors hover:border-primary/10 hover:bg-primary/5 hover:text-primary">
                      <div className="font-semibold text-base">
                        Financial Tools
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Invoicing, payments, and accounting
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink className="group grid gap-2 rounded-lg bg-transparent p-4 transition-colors hover:border-primary/10 hover:bg-primary/5 hover:text-primary">
                      <div className="font-semibold text-base">
                        AI Assistant
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Smart automation and intelligent insights
                      </div>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:border-primary/20 hover:bg-primary/5 hover:text-primary">
                  Pricing
                </NavigationMenuTrigger>
                <NavigationMenuContent className="border-none bg-transparent shadow-none">
                  <div className="grid w-[500px] grid-cols-1 gap-3 p-6">
                    <NavigationMenuLink className="group grid gap-2 rounded-lg bg-transparent p-4 transition-colors hover:border-primary/10 hover:bg-primary/5 hover:text-primary">
                      <div className="font-semibold text-base">Starter</div>
                      <div className="text-muted-foreground text-sm">
                        $49/month - Perfect for small teams
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink className="group grid gap-2 rounded-lg bg-transparent p-4 transition-colors hover:border-primary/10 hover:bg-primary/5 hover:text-primary">
                      <div className="font-semibold text-base">
                        Professional
                      </div>
                      <div className="text-muted-foreground text-sm">
                        $149/month - For growing businesses
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink className="group grid gap-2 rounded-lg bg-transparent p-4 transition-colors hover:border-primary/10 hover:bg-primary/5 hover:text-primary">
                      <div className="font-semibold text-base">Enterprise</div>
                      <div className="text-muted-foreground text-sm">
                        Custom pricing - Advanced features included
                      </div>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:border-primary/20 hover:bg-primary/5 hover:text-primary">
                  About
                </NavigationMenuTrigger>
                <NavigationMenuContent className="border-none bg-transparent shadow-none">
                  <div className="grid w-[400px] grid-cols-1 gap-3 p-6">
                    <NavigationMenuLink className="group grid gap-2 rounded-lg bg-transparent p-4 transition-colors hover:border-primary/10 hover:bg-primary/5 hover:text-primary">
                      <div className="font-semibold text-base">Our Story</div>
                      <div className="text-muted-foreground text-sm">
                        Building the future of field service
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink className="group grid gap-2 rounded-lg bg-transparent p-4 transition-colors hover:border-primary/10 hover:bg-primary/5 hover:text-primary">
                      <div className="font-semibold text-base">Careers</div>
                      <div className="text-muted-foreground text-sm">
                        Join our mission-driven team
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink className="group grid gap-2 rounded-lg bg-transparent p-4 transition-colors hover:border-primary/10 hover:bg-primary/5 hover:text-primary">
                      <div className="font-semibold text-base">Contact</div>
                      <div className="text-muted-foreground text-sm">
                        Get in touch with our team
                      </div>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-2">
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
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:hidden"
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
            className={`fixed inset-x-0 top-16 z-50 bg-background shadow-2xl duration-300 md:hidden ${
              isClosing
                ? "slide-out-to-top animate-out"
                : "slide-in-from-top animate-in"
            }`}
            ref={mobileMenuRef}
          >
            <div className="space-y-1 border-b p-4">
              <Link
                className="block rounded-md px-3 py-2 font-medium hover:bg-accent"
                href="#features"
                onClick={closeMobileMenu}
              >
                Features
              </Link>
              <Link
                className="block rounded-md px-3 py-2 font-medium hover:bg-accent"
                href="#pricing"
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>
              <Link
                className="block rounded-md px-3 py-2 font-medium hover:bg-accent"
                href="#about"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link
                className="block rounded-md px-3 py-2 font-medium hover:bg-accent"
                href="/dashboard"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
            </div>
            {/* Bottom CTA buttons */}
            <div className="absolute inset-x-0 bottom-0 border-t bg-background p-4">
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
