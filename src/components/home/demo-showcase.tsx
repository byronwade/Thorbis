/**
 * Demo Showcase Section - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static marketing content rendered on server
 * - Reduced JavaScript bundle size
 */

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DemoShowcaseSection() {
  const highlights = [
    {
      icon: "📱",
      title: "Mobile-First Design",
      description: "Works offline for technicians in the field",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Complete jobs 40% faster with smart workflows",
    },
    {
      icon: "🔒",
      title: "Bank-Level Security",
      description: "SOC 2 certified with end-to-end encryption",
    },
    {
      icon: "🎯",
      title: "Easy to Use",
      description: "Your team will be up and running in 24 hours",
    },
  ];

  return (
    <section className="bg-black py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div>
            <Badge
              className="mb-4 gap-1.5 bg-primary/10 text-primary"
              variant="outline"
            >
              <span className="size-1.5 rounded-full bg-primary" />
              See It In Action
            </Badge>
            <h2 className="mb-6 font-bold text-4xl text-white md:text-5xl">
              Watch Thorbis
              <br />
              <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                Transform Your Business
              </span>
            </h2>
            <p className="mb-8 text-foreground text-lg leading-relaxed">
              See how easy it is to schedule jobs, dispatch technicians, collect
              payments, and grow your business—all from one powerful platform.
            </p>

            {/* Highlights */}
            <div className="mb-8 space-y-4">
              {highlights.map((highlight, index) => (
                <div
                  className="flex items-start gap-4 rounded-xl border border-primary/20 bg-white/5 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
                  key={index}
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                    {highlight.icon}
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">
                      {highlight.title}
                    </h3>
                    <p className="text-foreground/80 text-sm">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              asChild
              className="group rounded-lg bg-primary px-8 py-6 font-semibold text-lg text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-105 hover:bg-primary/90"
              size="lg"
            >
              <Link href="/features">
                Explore the product
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Button>
            <p className="text-foreground/70 text-sm">
              Thorbis is $100/month with pay-as-you-go usage. Unlimited users, no contracts, no lock-in.
            </p>
          </div>

          {/* Right - Video/Demo Mockup */}
          <div className="relative">
            {/* Video Container with Play Button */}
            <div className="group relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 shadow-2xl shadow-primary/20">
              <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-transparent">
                {/* Placeholder for video */}
                <div className="flex size-full flex-col items-center justify-center gap-4 p-8">
                  {/* Play Button */}
                  <button
                    className="flex size-24 items-center justify-center rounded-full border-4 border-white bg-primary shadow-2xl shadow-primary/50 transition-all duration-300 hover:scale-110 hover:bg-primary/90"
                    type="button"
                  >
                    <svg
                      className="ml-1 size-10 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <p className="font-semibold text-white text-xl">
                    Watch a quick tour
                  </p>
                  <p className="text-center text-foreground text-sm">
                    See how Thorbis helps field service businesses
                    <br />
                    save time and increase revenue
                  </p>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute top-4 right-4 rounded-lg border border-primary/30 bg-black/50 p-3 backdrop-blur-sm">
                <div className="font-bold text-2xl text-primary">2:15</div>
                <div className="text-foreground/80 text-xs">Duration</div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-6 flex items-center justify-center gap-6 text-foreground/60 text-sm">
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
                <span>No credit card required</span>
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
                <span>Setup in 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
