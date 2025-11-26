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
			"Comprehensive calculator to determine your honest hourly rate for trades businesses",
		detailedDescription:
			"Calculate your honest hourly rate by factoring in all expenses, capacity constraints, and profit margins. Includes work schedule, operating expenses, growth investments, and daily break-even analysis. Perfect for plumbers, HVAC technicians, electricians, and all service trades.",
		href: "/tools/calculators/hourly-rate",
		icon: DollarSign,
		badge: "Popular",
		popular: true,
		features: [
			"Work schedule & capacity planning",
			"Comprehensive expense tracking (personnel, vehicles, insurance, etc.)",
			"Growth expense calculations",
			"Daily break-even analysis",
			"Profit margin projections",
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
					<div className="from-primary/15 to-primary/5 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br">
						<Calculator className="text-primary size-6" />
					</div>
					<div>
						<h1 className="text-4xl font-bold tracking-tight">
							Business Calculators
						</h1>
						<p className="text-muted-foreground mt-1 text-lg">
							Essential tools for pricing, profit analysis, and growth planning
						</p>
					</div>
				</div>

				<p className="text-muted-foreground max-w-3xl">
					Make data-driven decisions with our suite of business calculators.
					From pricing jobs and calculating hourly rates to analyzing profit
					margins and planning commissions, these tools help you run a more
					profitable trade business.
				</p>
			</div>

			{/* Why Use Calculators Section */}
			<Card className="border-primary/20 from-primary/5 bg-gradient-to-br to-transparent">
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
							<span className="text-primary mt-0.5">✓</span>
							<span>Price jobs accurately and competitively</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5">✓</span>
							<span>Ensure every job is profitable</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5">✓</span>
							<span>Track and improve profit margins</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5">✓</span>
							<span>Make data-driven business decisions</span>
						</li>
					</ul>
				</CardContent>
			</Card>

			{/* Calculator Tools Grid */}
			<div className="space-y-4">
				<h2 className="text-2xl font-semibold tracking-tight">
					Available Calculators
				</h2>
				<div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
					{calculators.map((calculator) => {
						const Icon = calculator.icon;
						return (
							<Link href={calculator.href} key={calculator.href}>
								<Card className="group hover:border-primary/50 h-full transition-all hover:shadow-lg">
									<CardHeader className="space-y-3">
										<div className="flex items-start justify-between gap-3">
											<div className="bg-muted/50 group-hover:bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-lg transition-colors">
												<Icon className="text-muted-foreground group-hover:text-primary size-6 transition-colors" />
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
												<ChevronRight className="text-muted-foreground size-5 opacity-0 transition-opacity group-hover:opacity-100" />
											</CardTitle>
											<CardDescription className="text-sm leading-relaxed">
												{calculator.detailedDescription}
											</CardDescription>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											<p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
												Key Features:
											</p>
											<ul className="space-y-1">
												{calculator.features.slice(0, 3).map((feature, idx) => (
													<li
														className="flex items-start gap-2 text-sm"
														key={idx}
													>
														<span className="text-primary mt-0.5">•</span>
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
							className="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
							type="button"
						>
							Contact Support
							<ChevronRight className="size-4" />
						</button>
					</Link>
					<Link href="/tools">
						<button
							className="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
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
