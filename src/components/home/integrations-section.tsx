/**
 * Integrations Section - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static integration list rendered on server
 * - Reduced JavaScript bundle size
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function IntegrationsSection() {
  const integrations = [
    {
      name: "QuickBooks",
      logo: "💚",
      category: "Accounting",
      description: "Two-way sync with QuickBooks Online & Desktop",
    },
    {
      name: "Stripe",
      logo: "💳",
      category: "Payments",
      description: "Accept payments with the lowest processing fees",
    },
    {
      name: "Google Calendar",
      logo: "📅",
      category: "Scheduling",
      description: "Sync your schedule across all devices",
    },
    {
      name: "Zapier",
      logo: "⚡",
      category: "Automation",
      description: "Connect to 5,000+ apps with no code",
    },
    {
      name: "Mailchimp",
      logo: "📧",
      category: "Marketing",
      description: "Automated email campaigns and newsletters",
    },
    {
      name: "Google Maps",
      logo: "🗺️",
      category: "Navigation",
      description: "Route optimization and GPS tracking",
    },
    {
      name: "Twilio",
      logo: "📱",
      category: "Communication",
      description: "SMS notifications and two-way texting",
    },
    {
      name: "Shopify",
      logo: "🛒",
      category: "E-commerce",
      description: "Sell parts and services online",
    },
  ];

  const categories = [
    { icon: "💰", label: "Accounting" },
    { icon: "💳", label: "Payments" },
    { icon: "📧", label: "Marketing" },
    { icon: "⚡", label: "Automation" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-primary/5 to-black py-32">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <Badge
            className="mb-4 gap-1.5 bg-primary/10 text-primary"
            variant="outline"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            Integrations
          </Badge>
          <h2 className="mb-4 font-bold text-4xl text-white md:text-5xl">
            Works With Your
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              Favorite Tools
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-foreground text-lg">
            Thorbis integrates seamlessly with the tools you already use. No
            migration headaches, just better workflow.
          </p>
        </div>

        {/* Quick Categories */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-6 py-3 text-foreground"
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="font-medium">{category.label}</span>
            </div>
          ))}
        </div>

        {/* Integration Grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-white/5 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              {/* Logo */}
              <div className="mb-4 flex size-16 items-center justify-center rounded-xl bg-primary/10 text-4xl transition-transform duration-300 group-hover:scale-110">
                {integration.logo}
              </div>

              {/* Content */}
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-white text-xl">
                  {integration.name}
                </h3>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-primary text-xs">
                  {integration.category}
                </span>
              </div>
              <p className="text-foreground/80 text-sm">
                {integration.description}
              </p>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-12 text-center">
          <h3 className="mb-4 font-bold text-3xl text-white">
            Connect Everything You Need
          </h3>
          <p className="mx-auto mb-8 max-w-2xl text-foreground text-lg">
            Browse our marketplace of 50+ integrations or use our API to build
            custom connections
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="group rounded-lg border border-primary bg-primary px-8 py-6 font-semibold text-lg text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-105 hover:bg-primary/90"
              size="lg"
            >
              <Link href="/integrations">
                View All Integrations
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Button>
            <Button
              asChild
              className="group rounded-lg border border-border bg-white/5 px-8 py-6 font-semibold text-lg text-white backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/10"
              size="lg"
              variant="outline"
            >
              <Link href="/api">
                API Documentation
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-foreground/60 text-sm">
            <div className="flex items-center gap-2">
              <svg
                className="size-5 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  fillRule="evenodd"
                />
              </svg>
              <span>Enterprise-grade security</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="size-5 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  fillRule="evenodd"
                />
              </svg>
              <span>Real-time sync</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="size-5 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  fillRule="evenodd"
                />
              </svg>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
