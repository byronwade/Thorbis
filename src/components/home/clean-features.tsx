"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CleanFeaturesSection() {
  const [activeCategory, setActiveCategory] = useState("grow");

  const categories = {
    grow: {
      title: "Grow Revenue",
      features: [
        {
          title: "Online Booking",
          description: "24/7 customer self-service portal",
          metric: "+35%",
          metricLabel: "more bookings",
        },
        {
          title: "Marketing & Reviews",
          description: "Automated review requests",
          metric: "4.8★",
          metricLabel: "avg rating",
        },
        {
          title: "AI-Powered Upsells",
          description: "Smart recommendations engine",
          metric: "+30%",
          metricLabel: "job value",
        },
        {
          title: "Customer Portal",
          description: "Self-service for quotes & payments",
          metric: "98%",
          metricLabel: "satisfaction",
        },
      ],
    },
    manage: {
      title: "Manage Jobs",
      features: [
        {
          title: "Smart Scheduling",
          description: "AI-optimized route planning",
          metric: "8+ hrs",
          metricLabel: "saved weekly",
        },
        {
          title: "Real-Time Dispatch",
          description: "Live GPS tracking",
          metric: "100%",
          metricLabel: "visibility",
        },
        {
          title: "Digital Quotes",
          description: "Create quotes in minutes",
          metric: "3x",
          metricLabel: "faster",
        },
        {
          title: "Job Management",
          description: "End-to-end workflow tracking",
          metric: "40%",
          metricLabel: "more jobs",
        },
      ],
    },
    paid: {
      title: "Get Paid",
      features: [
        {
          title: "Instant Payments",
          description: "Accept all payment methods",
          metric: "2.3%",
          metricLabel: "processing",
        },
        {
          title: "Smart Invoicing",
          description: "Auto-generated invoices",
          metric: "2x",
          metricLabel: "faster pay",
        },
        {
          title: "Customer Financing",
          description: "Offer payment plans",
          metric: "+45%",
          metricLabel: "close rate",
        },
        {
          title: "Auto Follow-ups",
          description: "Payment reminders",
          metric: "-65%",
          metricLabel: "overdue",
        },
      ],
    },
    run: {
      title: "Run Business",
      features: [
        {
          title: "AI Assistant",
          description: "24/7 automated support",
          metric: "90%",
          metricLabel: "calls handled",
        },
        {
          title: "Live Reporting",
          description: "Real-time dashboards",
          metric: "100+",
          metricLabel: "metrics",
        },
        {
          title: "Payroll & Team",
          description: "Automated time tracking",
          metric: "5 hrs",
          metricLabel: "saved monthly",
        },
        {
          title: "QuickBooks Sync",
          description: "Two-way accounting sync",
          metric: "100%",
          metricLabel: "accuracy",
        },
      ],
    },
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="space-y-1">
        <div className="mb-4">
          <Badge variant="secondary">Complete Platform</Badge>
        </div>
        <h2 className="font-bold text-3xl tracking-tight">
          Everything You Need
        </h2>
        <p className="text-lg text-muted-foreground">
          Choose your goal and see the tools that help you achieve it
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(categories).map(([key, category]) => (
          <Button
            className={
              activeCategory !== key ? "bg-transparent hover:bg-accent" : ""
            }
            key={key}
            onClick={() => setActiveCategory(key)}
            size="sm"
            variant={activeCategory === key ? "default" : "outline"}
          >
            {category.title}
          </Button>
        ))}
      </div>

      {/* Feature Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories[activeCategory as keyof typeof categories].features.map(
          (feature, index) => (
            <div
              className="space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
              key={index}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{feature.title}</h3>
                <div className="text-right">
                  <div className="font-bold text-primary text-xl">
                    {feature.metric}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {feature.metricLabel}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          )
        )}
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <Button asChild className="group">
          <Link href="/features">
            View All Features
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
