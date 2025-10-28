/**
 * Comparison Section - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static comparison table rendered on server
 * - Reduced JavaScript bundle size
 */

import { Badge } from "@/components/ui/badge";

export function ComparisonSection() {
  const features = [
    {
      feature: "Scheduling & Dispatch",
      stratos: true,
      competitors: "limited",
      description: "AI-powered smart scheduling with route optimization",
    },
    {
      feature: "Mobile App (Offline)",
      stratos: true,
      competitors: false,
      description: "Full functionality without internet connection",
    },
    {
      feature: "Customer Portal",
      stratos: true,
      competitors: "limited",
      description: "Self-service booking, quotes, and payment portal",
    },
    {
      feature: "AI Assistant",
      stratos: true,
      competitors: false,
      description: "24/7 AI handles calls, scheduling, and FAQs",
    },
    {
      feature: "Payment Processing",
      stratos: "2.3%",
      competitors: "2.9%+",
      description: "Lowest fees in the industry",
    },
    {
      feature: "QuickBooks Integration",
      stratos: true,
      competitors: "limited",
      description: "Real-time two-way sync with QuickBooks",
    },
    {
      feature: "Marketing Tools",
      stratos: true,
      competitors: "add-on",
      description: "Built-in review management and email campaigns",
    },
    {
      feature: "Customer Support",
      stratos: "24/7",
      competitors: "Business hours",
      description: "Phone, chat, and email support anytime",
    },
    {
      feature: "Onboarding & Training",
      stratos: "Free",
      competitors: "$$$",
      description: "White-glove setup and unlimited training",
    },
    {
      feature: "Contract Length",
      stratos: "None",
      competitors: "1-3 years",
      description: "Cancel anytime, no long-term commitment",
    },
  ];

  const renderValue = (value: boolean | string) => {
    if (value === true) {
      return (
        <div className="flex size-8 items-center justify-center rounded-full bg-primary/20">
          <svg
            className="size-5 text-primary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              fillRule="evenodd"
            />
          </svg>
        </div>
      );
    }
    if (value === false) {
      return (
        <div className="flex size-8 items-center justify-center rounded-full bg-red-500/10">
          <svg
            className="size-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              fillRule="evenodd"
            />
          </svg>
        </div>
      );
    }
    if (value === "limited") {
      return (
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-yellow-500/10">
            <span className="text-yellow-500">⚠</span>
          </div>
          <span className="text-foreground/60 text-sm">Limited</span>
        </div>
      );
    }
    if (value === "add-on") {
      return (
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-yellow-500/10">
            <span className="text-yellow-500">+</span>
          </div>
          <span className="text-foreground/60 text-sm">Extra Cost</span>
        </div>
      );
    }
    return (
      <span
        className={`font-semibold ${value.startsWith("2.3") || value === "24/7" || value === "Free" || value === "None" ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </span>
    );
  };

  return (
    <section className="bg-black py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <Badge
            className="mb-4 gap-1.5 bg-primary/10 text-primary"
            variant="outline"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            Why Stratos
          </Badge>
          <h2 className="mb-4 font-bold text-4xl text-white md:text-5xl">
            Better Than The
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              Competition
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-foreground text-lg">
            See how Stratos compares to other field service software. More
            features, better support, lower cost.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-hidden rounded-2xl border border-primary/20">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 border-primary/20 border-b bg-gradient-to-br from-primary/10 to-transparent p-6">
            <div className="font-semibold text-foreground/60 text-sm uppercase tracking-wider">
              Feature
            </div>
            <div className="text-center">
              <div className="mb-2 inline-flex rounded-full bg-primary px-4 py-2">
                <span className="font-bold text-white">Stratos</span>
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 inline-flex rounded-full bg-white/5 px-4 py-2">
                <span className="font-medium text-foreground/60">
                  Others
                </span>
              </div>
            </div>
          </div>

          {/* Table Rows */}
          {features.map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 gap-4 p-6 transition-colors hover:bg-white/5 ${
                index !== features.length - 1 ? "border-primary/10 border-b" : ""
              }`}
            >
              <div>
                <h3 className="mb-1 font-semibold text-white">
                  {item.feature}
                </h3>
                <p className="text-foreground/60 text-sm">{item.description}</p>
              </div>
              <div className="flex items-center justify-center">
                {renderValue(item.stratos)}
              </div>
              <div className="flex items-center justify-center">
                {renderValue(item.competitors)}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 text-center">
            <div className="mb-2 font-bold text-4xl text-primary">40%</div>
            <div className="text-foreground text-sm">
              More Features Than Competitors
            </div>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 text-center">
            <div className="mb-2 font-bold text-4xl text-primary">30%</div>
            <div className="text-foreground text-sm">Lower Total Cost</div>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 text-center">
            <div className="mb-2 font-bold text-4xl text-primary">24/7</div>
            <div className="text-foreground text-sm">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
}
