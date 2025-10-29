/**
 * Dashboard Testimonials - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static testimonials rendered on server
 * - Reduced JavaScript bundle size
 */

import { TrendingUp, Clock, DollarSign, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function DashboardTestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Thorbis transformed our operations. We went from chaos to complete visibility in 30 days.",
      author: "Michael Rodriguez",
      role: "Owner",
      company: "Rodriguez HVAC",
      location: "Phoenix, AZ",
      initials: "MR",
      metrics: [
        { label: "Revenue", value: "+3.1X", icon: TrendingUp },
        { label: "Efficiency", value: "+65%", icon: Clock },
      ],
    },
    {
      quote:
        "The ROI was immediate. Our average job value increased 42% in the first month with smart upselling.",
      author: "Sarah Chen",
      role: "CEO",
      company: "Elite Plumbing",
      location: "Austin, TX",
      initials: "SC",
      metrics: [
        { label: "Job Value", value: "+42%", icon: DollarSign },
        { label: "Rating", value: "4.9★", icon: Star },
      ],
    },
    {
      quote:
        "Our technicians love the offline mobile app. No more lost data or manual paperwork.",
      author: "David Martinez",
      role: "Operations Manager",
      company: "Martinez Electrical",
      location: "Denver, CO",
      initials: "DM",
      metrics: [
        { label: "Time Saved", value: "12 hrs", icon: Clock },
        { label: "Paperwork", value: "-100%", icon: TrendingUp },
      ],
    },
  ];

  const overallMetrics = [
    { label: "Avg Revenue Growth", value: "40%", change: "+18.2% vs industry" },
    { label: "Time Saved Weekly", value: "8+ hrs", change: "per technician" },
    { label: "Customer Rating", value: "4.8★", change: "10,000+ reviews" },
    { label: "Job Completion", value: "98%", change: "on-time rate" },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Customer Success</Badge>
          </div>
          <h2 className="font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl">
            Real Results
            <br />
            <span className="text-muted-foreground">From Real Businesses</span>
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            See the metrics that matter from field service pros using Thorbis
          </p>
        </div>

        {/* Overall Metrics - Dashboard KPI Style */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {overallMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="space-y-0 pb-2">
                <p className="font-medium text-muted-foreground text-sm">
                  {metric.label}
                </p>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="font-bold text-3xl">{metric.value}</div>
                <p className="text-green-600 text-xs dark:text-green-400">
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonial Cards - Dashboard Style */}
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <div className="mb-4 flex items-center gap-4">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Mini Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  {testimonial.metrics.map((metric, idx) => {
                    const Icon = metric.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-lg bg-muted p-2"
                      >
                        <Icon className="size-4 text-primary" />
                        <div>
                          <div className="font-bold text-sm">{metric.value}</div>
                          <div className="text-muted-foreground text-xs">
                            {metric.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-muted-foreground leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
              </CardContent>

              <div className="border-t p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Badge variant="outline">{testimonial.company}</Badge>
                  <span>•</span>
                  <span>{testimonial.location}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
