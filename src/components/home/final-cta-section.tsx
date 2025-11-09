/**
 * Final CTA Section - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static call-to-action rendered on server
 * - Reduced JavaScript bundle size
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTASection() {
const trustMarkers = [
  { icon: "💵", label: "$100/month base + pay-as-you-go usage" },
  { icon: "⚡", label: "Setup in 24 hours" },
  { icon: "💳", label: "No credit card required" },
  { icon: "🔒", label: "Cancel anytime" },
  { icon: "📞", label: "24/7 support" },
  ];

  return (
    <section className="relative overflow-hidden bg-black py-32">
      {/* Animated background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 size-[600px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-12 shadow-2xl shadow-primary/20 md:p-16">
          {/* Content */}
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <span className="relative flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-3 rounded-full bg-primary" />
              </span>
              <span className="font-medium text-primary text-sm">
                Limited Time: Save 20% on Annual Plans
              </span>
            </div>

            <h2 className="mb-6 font-bold text-4xl text-white md:text-5xl lg:text-6xl">
              Ready to Transform
              <br />
              <span className="bg-gradient-to-r from-primary via-primary-foreground to-primary bg-clip-text text-transparent">
                Your Field Service Business?
              </span>
            </h2>

            <p className="mx-auto mb-10 max-w-2xl text-foreground text-xl leading-relaxed">
              Join 10,000+ field service professionals who have increased
              revenue by 40% and saved 8+ hours per week with Thorbis. Start for
              just $100/month with pay-as-you-go usage—no per-user fees.
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                className="group h-auto rounded-xl bg-primary px-10 py-6 font-bold text-primary-foreground text-xl shadow-2xl shadow-primary/30 transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-primary/50"
                size="lg"
              >
                <Link href="/register">
                  Start Free Trial
                  <span className="ml-3 text-2xl transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                className="group h-auto rounded-xl border-2 border-white/20 bg-white/10 px-10 py-6 font-bold text-white text-xl backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-white/20 hover:shadow-lg hover:shadow-primary/20"
                size="lg"
                variant="outline"
              >
                <Link href="/pricing">
                  Compare plans
                  <span className="ml-3 text-2xl transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </Button>
            </div>

            {/* Trust Markers */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-6 text-foreground/70 text-sm">
              {trustMarkers.map((marker, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <span className="text-primary text-xl">{marker.icon}</span>
                  <span>{marker.label}</span>
                </div>
              ))}
            </div>

            {/* Social Proof Bar */}
            <div className="border-primary/20 border-t pt-8">
              <p className="mb-6 text-foreground/60 text-sm uppercase tracking-wider">
                Trusted by Leading Field Service Companies
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {[
                  "Rodriguez HVAC",
                  "Elite Plumbing",
                  "Martinez Electrical",
                  "Pro Handyman",
                ].map((company, index) => (
                  <div
                    className="rounded-lg border border-primary/10 bg-white/5 px-6 py-3"
                    key={index}
                  >
                    <span className="font-semibold text-foreground text-sm">
                      {company}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div className="-top-4 -right-4 pointer-events-none absolute size-24 rounded-full border border-primary/20 bg-primary/10 blur-xl" />
          <div className="-bottom-4 -left-4 pointer-events-none absolute size-32 rounded-full border border-primary/20 bg-primary/10 blur-xl" />
        </div>

        {/* Bottom guarantee */}
        <div className="mt-12 text-center">
          <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-primary/20 bg-black/50 px-6 py-3 backdrop-blur-sm">
            <svg
              className="size-6 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                fillRule="evenodd"
              />
            </svg>
            <span className="font-medium text-white">
              30-Day Money-Back Guarantee
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
