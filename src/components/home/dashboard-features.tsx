"use client";

import {
  ArrowRight,
  BarChart3,
  Bell,
  Calendar,
  CreditCard,
  DollarSign,
  Smartphone,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DashboardFeaturesSection() {
  const [activeCategory, setActiveCategory] = useState("grow");

  const categories = {
    grow: {
      title: "Grow Revenue",
      icon: TrendingUp,
      features: [
        {
          icon: TrendingUp,
          title: "Online Booking",
          description: "24/7 customer self-service portal",
          metric: "+35%",
          metricLabel: "more bookings",
        },
        {
          icon: Bell,
          title: "Marketing & Reviews",
          description: "Automated review requests",
          metric: "4.8★",
          metricLabel: "avg rating",
        },
        {
          icon: DollarSign,
          title: "AI-Powered Upsells",
          description: "Smart recommendations engine",
          metric: "+30%",
          metricLabel: "job value",
        },
        {
          icon: Users,
          title: "Customer Portal",
          description: "Self-service for quotes & payments",
          metric: "98%",
          metricLabel: "satisfaction",
        },
      ],
    },
    manage: {
      title: "Manage Jobs",
      icon: Calendar,
      features: [
        {
          icon: Calendar,
          title: "Smart Scheduling",
          description: "AI-optimized route planning",
          metric: "8+ hrs",
          metricLabel: "saved weekly",
        },
        {
          icon: BarChart3,
          title: "Real-Time Dispatch",
          description: "Live GPS tracking",
          metric: "100%",
          metricLabel: "visibility",
        },
        {
          icon: DollarSign,
          title: "Digital Quotes",
          description: "Create quotes in minutes",
          metric: "3x",
          metricLabel: "faster",
        },
        {
          icon: Calendar,
          title: "Job Management",
          description: "End-to-end workflow tracking",
          metric: "40%",
          metricLabel: "more jobs",
        },
      ],
    },
    paid: {
      title: "Get Paid",
      icon: DollarSign,
      features: [
        {
          icon: CreditCard,
          title: "Instant Payments",
          description: "Accept all payment methods",
          metric: "2.3%",
          metricLabel: "processing",
        },
        {
          icon: DollarSign,
          title: "Smart Invoicing",
          description: "Auto-generated invoices",
          metric: "2x",
          metricLabel: "faster pay",
        },
        {
          icon: TrendingUp,
          title: "Customer Financing",
          description: "Offer payment plans",
          metric: "+45%",
          metricLabel: "close rate",
        },
        {
          icon: Bell,
          title: "Auto Follow-ups",
          description: "Payment reminders",
          metric: "-65%",
          metricLabel: "overdue",
        },
      ],
    },
    run: {
      title: "Run Business",
      icon: BarChart3,
      features: [
        {
          icon: Smartphone,
          title: "AI Assistant",
          description: "24/7 automated support",
          metric: "90%",
          metricLabel: "calls handled",
        },
        {
          icon: BarChart3,
          title: "Live Reporting",
          description: "Real-time dashboards",
          metric: "100+",
          metricLabel: "metrics",
        },
        {
          icon: Users,
          title: "Payroll & Team",
          description: "Automated time tracking",
          metric: "5 hrs",
          metricLabel: "saved monthly",
        },
        {
          icon: DollarSign,
          title: "QuickBooks Sync",
          description: "Two-way accounting sync",
          metric: "100%",
          metricLabel: "accuracy",
        },
      ],
    },
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header - Dashboard Style */}
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Complete Platform</Badge>
          </div>
          <h2 className="font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl">
            Everything You Need
            <br />
            <span className="text-muted-foreground">In One Dashboard</span>
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Choose your goal and see the tools that help you achieve it
          </p>
        </div>

        {/* Category Tabs - Dashboard Style Pills */}
        <div className="mb-8 flex flex-wrap gap-3">
          {Object.entries(categories).map(([key, category]) => {
            const Icon = category.icon;
            return (
              <Button
                className={cn(
                  "h-auto gap-2 px-6 py-3",
                  activeCategory !== key && "bg-transparent hover:bg-accent"
                )}
                key={key}
                onClick={() => setActiveCategory(key)}
                variant={activeCategory === key ? "default" : "outline"}
              >
                <Icon className="size-4" />
                <span className="font-medium">{category.title}</span>
              </Button>
            );
          })}
        </div>

        {/* Feature Cards Grid - Dashboard KPI Style */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories[activeCategory as keyof typeof categories].features.map(
            (feature, index) => {
              const Icon = feature.icon;
              return (
                <Card className="transition-all hover:shadow-lg" key={index}>
                  <CardHeader className="space-y-0 pb-4">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-2xl text-primary">
                          {feature.metric}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {feature.metricLabel}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>

        {/* CTA - Dashboard Style */}
        <div className="flex items-center justify-center gap-4">
          <Button asChild className="group" size="lg">
            <Link href="/features">
              View All Features
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
