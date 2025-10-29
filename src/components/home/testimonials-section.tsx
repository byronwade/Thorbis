/**
 * Testimonials Section - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static testimonials rendered on server
 * - Reduced JavaScript bundle size
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Thorbis helped us grow from 8 to 25 technicians in just one year. The scheduling and dispatch features alone save us 15 hours every week.",
      author: "Michael Rodriguez",
      role: "Owner",
      company: "Rodriguez HVAC",
      location: "Phoenix, AZ",
      stats: {
        metric: "3.1X",
        label: "Revenue Growth",
      },
      industry: "HVAC",
      logo: "⚡",
    },
    {
      quote:
        "We increased our average job value by 42% using Thorbis' smart pricing and upsell features. The customer portal has been a game-changer for our reputation.",
      author: "Sarah Chen",
      role: "CEO",
      company: "Elite Plumbing Solutions",
      location: "Austin, TX",
      stats: {
        metric: "42%",
        label: "Higher Job Value",
      },
      industry: "Plumbing",
      logo: "🔧",
    },
    {
      quote:
        "The mobile app works perfectly offline, which is crucial for our team. Payment processing is instant, and our cash flow has never been better.",
      author: "David Martinez",
      role: "Operations Manager",
      company: "Martinez Electrical",
      location: "Denver, CO",
      stats: {
        metric: "2.5X",
        label: "Faster Payments",
      },
      industry: "Electrical",
      logo: "💡",
    },
  ];

  const metrics = [
    { value: "40%", label: "Avg. Revenue Increase" },
    { value: "8+ hrs", label: "Saved Per Week" },
    { value: "98%", label: "Customer Satisfaction" },
    { value: "10,000+", label: "Happy Customers" },
  ];

  return (
    <section className="relative overflow-hidden bg-black py-32">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <Badge
            className="mb-4 gap-1.5 bg-primary/10 text-primary"
            variant="outline"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            Customer Success
          </Badge>
          <h2 className="mb-4 font-bold text-4xl text-white md:text-5xl">
            Trusted by Field Service
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              Pros Like You
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-foreground text-lg">
            Real businesses achieving remarkable results with Thorbis
          </p>
        </div>

        {/* Metrics Bar */}
        <div className="mb-16 grid gap-6 md:grid-cols-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 text-center"
            >
              <div className="mb-2 font-bold text-4xl text-primary">
                {metric.value}
              </div>
              <div className="text-foreground text-sm">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonial Cards */}
        <div className="mb-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-white/5 to-transparent p-8 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              {/* Industry Badge */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary text-sm">
                  <span>{testimonial.logo}</span>
                  <span>{testimonial.industry}</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary text-xl">
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Highlight */}
              <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 p-4">
                <div className="mb-1 font-bold text-3xl text-primary">
                  {testimonial.stats.metric}
                </div>
                <div className="text-foreground text-sm">
                  {testimonial.stats.label}
                </div>
              </div>

              {/* Quote */}
              <p className="mb-6 text-foreground leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Author */}
              <div className="border-primary/20 border-t pt-4">
                <p className="mb-1 font-semibold text-white">
                  {testimonial.author}
                </p>
                <p className="text-foreground/80 text-sm">
                  {testimonial.role}, {testimonial.company}
                </p>
                <p className="text-foreground/60 text-xs">
                  {testimonial.location}
                </p>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-12 text-center">
          <h3 className="mb-4 font-bold text-3xl text-white">
            Ready to Grow Your Business?
          </h3>
          <p className="mx-auto mb-8 max-w-2xl text-foreground text-lg">
            Join thousands of field service professionals who have transformed
            their operations with Thorbis
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="group rounded-lg bg-primary px-8 py-6 font-semibold text-lg text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-105 hover:bg-primary/90"
              size="lg"
            >
              <Link href="/dashboard">
                Start Free Trial
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
              <Link href="/case-studies">
                Read Case Studies
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-foreground/60 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
