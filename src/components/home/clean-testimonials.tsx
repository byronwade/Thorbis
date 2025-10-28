/**
 * Clean Testimonials Section - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static testimonials and metrics rendered on server
 * - Reduced JavaScript bundle size
 */

import { Badge } from "@/components/ui/badge";

export function CleanTestimonialsSection() {
  const overallMetrics = [
    { label: "Avg Revenue Growth", value: "40%", change: "+18.2% vs industry" },
    { label: "Time Saved Weekly", value: "8+ hrs", change: "per technician" },
    { label: "Customer Rating", value: "4.8★", change: "10,000+ reviews" },
    { label: "Job Completion", value: "98%", change: "on-time rate" },
  ];

  const testimonials = [
    {
      quote:
        "Stratos transformed our operations. We went from chaos to complete visibility in 30 days.",
      author: "Michael Rodriguez",
      role: "Owner",
      company: "Rodriguez HVAC",
      location: "Phoenix, AZ",
      metrics: [
        { label: "Revenue", value: "+3.1X" },
        { label: "Efficiency", value: "+65%" },
      ],
    },
    {
      quote:
        "The ROI was immediate. Our average job value increased 42% in the first month.",
      author: "Sarah Chen",
      role: "CEO",
      company: "Elite Plumbing",
      location: "Austin, TX",
      metrics: [
        { label: "Job Value", value: "+42%" },
        { label: "Rating", value: "4.9★" },
      ],
    },
    {
      quote:
        "Our technicians love the offline mobile app. No more lost data or manual paperwork.",
      author: "David Martinez",
      role: "Operations Manager",
      company: "Martinez Electrical",
      location: "Denver, CO",
      metrics: [
        { label: "Time Saved", value: "12 hrs" },
        { label: "Paperwork", value: "-100%" },
      ],
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="space-y-1">
        <div className="mb-4">
          <Badge variant="secondary">Customer Success</Badge>
        </div>
        <h2 className="font-bold text-3xl tracking-tight">Real Results</h2>
        <p className="text-lg text-muted-foreground">
          From real businesses using Stratos
        </p>
      </div>

      {/* Overall Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {overallMetrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
          >
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">
                {metric.label}
              </p>
              <div className="font-bold text-2xl">{metric.value}</div>
              <p className="font-medium text-green-600 text-xs dark:text-green-400">
                {metric.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <div className="space-y-4 p-6">
              <div className="space-y-2">
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-muted-foreground text-sm">
                  {testimonial.role}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {testimonial.metrics.map((metric, idx) => (
                  <div key={idx} className="rounded-md bg-muted p-2">
                    <div className="font-bold text-sm">{metric.value}</div>
                    <div className="text-muted-foreground text-xs">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-4 p-6">
              <p className="text-muted-foreground">
                &quot;{testimonial.quote}&quot;
              </p>
            </div>

            <div className="border-t p-6">
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
                <Badge variant="outline">{testimonial.company}</Badge>
                <span>•</span>
                <span>{testimonial.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
