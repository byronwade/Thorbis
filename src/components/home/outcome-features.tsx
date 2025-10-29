"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function OutcomeFeaturesSection() {
  const [activeCategory, setActiveCategory] = useState("grow");

  const categories = {
    grow: {
      title: "Grow Revenue",
      icon: "📈",
      color: "from-green-500 to-emerald-500",
      features: [
        {
          title: "Online Booking",
          description:
            "Let customers book jobs 24/7 with your custom booking page",
          icon: "🌐",
        },
        {
          title: "Marketing & Reviews",
          description:
            "Automate review requests and boost your online reputation",
          icon: "⭐",
        },
        {
          title: "Customer Portal",
          description: "Self-service portal for quotes, invoices, and history",
          icon: "👤",
        },
        {
          title: "AI-Powered Upsells",
          description:
            "Smart recommendations to increase average job value by 30%",
          icon: "🤖",
        },
      ],
    },
    manage: {
      title: "Manage Jobs",
      icon: "📋",
      color: "from-blue-500 to-cyan-500",
      features: [
        {
          title: "Smart Scheduling",
          description:
            "AI-powered scheduling that optimizes routes and maximizes efficiency",
          icon: "📅",
        },
        {
          title: "Real-Time Dispatch",
          description: "Drag-and-drop dispatch board with live GPS tracking",
          icon: "🚚",
        },
        {
          title: "Digital Quotes",
          description:
            "Create and send professional quotes in minutes from any device",
          icon: "💼",
        },
        {
          title: "Job Management",
          description:
            "Track every job from first call to completion with full history",
          icon: "✓",
        },
      ],
    },
    paid: {
      title: "Get Paid",
      icon: "💰",
      color: "from-yellow-500 to-orange-500",
      features: [
        {
          title: "Instant Payments",
          description:
            "Accept credit cards, ACH, and digital wallets on-site or online",
          icon: "💳",
        },
        {
          title: "Smart Invoicing",
          description:
            "Auto-generate invoices with photos and get paid 2x faster",
          icon: "📄",
        },
        {
          title: "Customer Financing",
          description:
            "Offer payment plans to close more high-ticket jobs",
          icon: "🏦",
        },
        {
          title: "Automated Follow-ups",
          description: "Automatic payment reminders reduce overdue by 65%",
          icon: "🔔",
        },
      ],
    },
    run: {
      title: "Run Your Business",
      icon: "🎯",
      color: "from-purple-500 to-pink-500",
      features: [
        {
          title: "AI Team Assistant",
          description:
            "24/7 AI assistant handles calls, scheduling, and customer questions",
          icon: "🤖",
        },
        {
          title: "Live Reporting",
          description:
            "Real-time dashboards show revenue, profit, and performance metrics",
          icon: "📊",
        },
        {
          title: "Payroll & Team",
          description:
            "Track hours, manage commissions, and run payroll seamlessly",
          icon: "👥",
        },
        {
          title: "QuickBooks Sync",
          description:
            "Two-way sync keeps your accounting perfectly up to date",
          icon: "🔗",
        },
      ],
    },
  };

  return (
    <section className="bg-gradient-to-b from-black via-primary/5 to-black py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <Badge
            className="mb-4 gap-1.5 bg-primary/10 text-primary"
            variant="outline"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            All-In-One Platform
          </Badge>
          <h2 className="mb-4 font-bold text-4xl text-white md:text-5xl">
            Everything You Need to Succeed
          </h2>
          <p className="mx-auto max-w-2xl text-foreground text-lg">
            Choose your goal. We&apos;ll show you how Thorbis helps you achieve
            it.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              className={`group flex items-center gap-3 rounded-xl border px-6 py-4 transition-all duration-300 ${
                activeCategory === key
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                  : "border-border bg-white/5 hover:border-primary/50 hover:bg-white/10"
              }`}
              onClick={() => setActiveCategory(key)}
              type="button"
            >
              <span className="text-3xl">{category.icon}</span>
              <span
                className={`font-semibold text-lg ${
                  activeCategory === key ? "text-white" : "text-foreground"
                }`}
              >
                {category.title}
              </span>
            </button>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories[activeCategory as keyof typeof categories].features.map(
            (feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-white/5 to-transparent p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Icon */}
                <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-primary/10 text-3xl transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="mb-2 font-semibold text-white text-xl">
                  {feature.title}
                </h3>
                <p className="text-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${categories[activeCategory as keyof typeof categories].color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                />
              </div>
            )
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-foreground text-lg">
            See all features in action
          </p>
          <Button
            asChild
            className="group rounded-lg border border-primary bg-primary/10 px-8 py-6 font-semibold text-lg text-white transition-all duration-200 hover:bg-primary hover:shadow-lg hover:shadow-primary/30"
            size="lg"
          >
            <Link href="/features">
              View All Features
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
