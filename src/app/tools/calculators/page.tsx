/**
 * Business Calculators Overview Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR with 1 hour revalidation
 */

import {
  BarChart,
  Calculator,
  ChevronRight,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const revalidate = 3600; // Revalidate every hour

type CalculatorTool = {
  title: string;
  description: string;
  detailedDescription: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  popular?: boolean;
  features: string[];
};

const calculators: CalculatorTool[] = [
  {
    title: "Hourly Rate Calculator",
    description:
      "Calculate what to charge per hour based on your costs and target profit",
    detailedDescription:
      "Determine your ideal hourly rate by factoring in labor costs, overhead expenses, materials, and desired profit margin. Perfect for service-based businesses.",
    href: "/tools/calculators/hourly-rate",
    icon: DollarSign,
    badge: "Popular",
    popular: true,
    features: [
      "Calculate based on annual revenue goals",
      "Factor in billable hours vs total hours",
      "Include overhead and operating costs",
      "Adjust for profit margin targets",
    ],
  },
  {
    title: "Job Pricing Calculator",
    description:
      "Price jobs accurately with material, labor, and overhead costs",
    detailedDescription:
      "Build accurate job quotes by calculating material costs, labor hours, equipment usage, and overhead. Ensure profitable pricing on every project.",
    href: "/tools/calculators/job-pricing",
    icon: Calculator,
    badge: "Essential",
    popular: true,
    features: [
      "Material cost tracking",
      "Labor hour estimation",
      "Equipment and overhead allocation",
      "Markup and margin calculations",
    ],
  },
  {
    title: "Profit & Loss Calculator",
    description:
      "Track revenue, expenses, and calculate your net profit margins",
    detailedDescription:
      "Monitor your business financial health with detailed P&L tracking. Calculate gross profit, operating profit, and net profit margins to understand your bottom line.",
    href: "/tools/calculators/profit-loss",
    icon: TrendingUp,
    badge: "Popular",
    popular: true,
    features: [
      "Revenue and expense tracking",
      "Gross profit margin calculation",
      "Operating profit analysis",
      "Net profit and EBITDA",
    ],
  },
  {
    title: "Commission Calculator",
    description: "Calculate sales commissions and technician incentive pay",
    detailedDescription:
      "Design fair and motivating commission structures for your sales team and technicians. Calculate tiered commissions, bonuses, and performance-based pay.",
    href: "/tools/calculators/commission",
    icon: DollarSign,
    features: [
      "Tiered commission structures",
      "Sales performance bonuses",
      "Technician incentive pay",
      "Team vs individual metrics",
    ],
  },
  {
    title: "Break-Even Calculator",
    description: "Find out how much revenue you need to cover your costs",
    detailedDescription:
      "Determine your break-even point to understand the minimum revenue needed to cover all fixed and variable costs. Plan for profitability and growth.",
    href: "/tools/calculators/break-even",
    icon: TrendingUp,
    features: [
      "Fixed cost analysis",
      "Variable cost per unit",
      "Break-even point in units and dollars",
      "Target profit planning",
    ],
  },
  {
    title: "Industry Pricing Standards",
    description:
      "Compare your pricing against industry benchmarks and averages",
    detailedDescription:
      "Access industry-specific pricing data and benchmarks. Compare your rates to regional and national averages to ensure competitive pricing.",
    href: "/tools/calculators/industry-pricing",
    icon: BarChart,
    badge: "Premium",
    features: [
      "Trade-specific pricing data (HVAC, Plumbing, Electrical)",
      "Regional market comparisons",
      "Service call and labor rate benchmarks",
      "Material markup standards",
    ],
  },
];

export default function CalculatorsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5">
            <Calculator className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-4xl tracking-tight">
              Business Calculators
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">
              Essential tools for pricing, profit analysis, and growth planning
            </p>
          </div>
        </div>

        <p className="max-w-3xl text-muted-foreground">
          Make data-driven decisions with our suite of business calculators.
          From pricing jobs and calculating hourly rates to analyzing profit
          margins and planning commissions, these tools help you run a more
          profitable trade business.
        </p>
      </div>

      {/* Why Use Calculators Section */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            Why Use Business Calculators?
          </CardTitle>
          <CardDescription className="text-base">
            Professional calculators help you:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">✓</span>
              <span>Price jobs accurately and competitively</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">✓</span>
              <span>Ensure every job is profitable</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">✓</span>
              <span>Track and improve profit margins</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">✓</span>
              <span>Make data-driven business decisions</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Calculator Tools Grid */}
      <div className="space-y-4">
        <h2 className="font-semibold text-2xl tracking-tight">
          Available Calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {calculators.map((calculator) => {
            const Icon = calculator.icon;
            return (
              <Link href={calculator.href} key={calculator.href}>
                <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-lg">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted/50 transition-colors group-hover:bg-primary/10">
                        <Icon className="size-6 text-muted-foreground transition-colors group-hover:text-primary" />
                      </div>
                      <div className="flex items-center gap-2">
                        {calculator.badge && (
                          <Badge className="text-xs" variant="secondary">
                            {calculator.badge}
                          </Badge>
                        )}
                        {calculator.popular && (
                          <Badge className="text-xs" variant="default">
                            Popular
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="flex items-center justify-between text-lg">
                        {calculator.title}
                        <ChevronRight className="size-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {calculator.detailedDescription}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                        Key Features:
                      </p>
                      <ul className="space-y-1">
                        {calculator.features.slice(0, 3).map((feature, idx) => (
                          <li
                            className="flex items-start gap-2 text-sm"
                            key={idx}
                          >
                            <span className="mt-0.5 text-primary">•</span>
                            <span className="text-muted-foreground">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Help Section */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-5" />
            Need Help Using These Calculators?
          </CardTitle>
          <CardDescription>
            Our team can help you understand your numbers and make the right
            pricing decisions for your business
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/contact">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 font-medium text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              type="button"
            >
              Contact Support
              <ChevronRight className="size-4" />
            </button>
          </Link>
          <Link href="/tools">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 font-medium text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              type="button"
            >
              Browse All Tools
              <ChevronRight className="size-4" />
            </button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
