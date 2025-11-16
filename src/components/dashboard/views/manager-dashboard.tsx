import {
	AlertTriangle,
	DollarSign,
	MessageSquare,
	Package,
	PhoneCall,
	Star,
	Users,
} from "lucide-react";
import { Suspense } from "react";
import { KPICard } from "@/components/dashboard/kpi-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { TechnicianPerformance } from "@/components/dashboard/technician-performance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/skeletons";

/**
 * Manager Dashboard - Server Component
 *
 * Focus: Team performance, customer satisfaction, operational oversight, and problem resolution
 * Target User: Operations manager overseeing day-to-day business and team management
 */

export default function ManagerDashboard() {
	const currentDate = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<div className="space-y-8">
			{/* Enhanced Header */}
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-3">
					<h1 className="font-bold text-4xl tracking-tight">
						Operations Management
					</h1>
					<Badge className="text-success" variant="outline">
						Manager View
					</Badge>
				</div>
				<p className="text-lg text-muted-foreground">{currentDate}</p>
			</div>

			{/* Critical Customer Issues Alert */}
			<Card className="border-destructive bg-destructive dark:border-destructive dark:bg-destructive/30">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-destructive dark:text-destructive">
						<AlertTriangle className="size-5" />
						Customer Issues Requiring Attention
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex items-start gap-3 rounded-lg border border-destructive bg-card p-3 dark:border-destructive dark:bg-destructive/50">
						<Star className="mt-0.5 size-4 text-destructive" />
						<div className="flex-1">
							<p className="font-medium text-sm">
								2-Star Review Posted (1 hour ago)
							</p>
							<p className="text-muted-foreground text-xs">
								"Technician was rude" - Jane Smith - Needs immediate response
							</p>
						</div>
						<Button size="sm" variant="destructive">
							Respond
						</Button>
					</div>
					<div className="flex items-start gap-3 rounded-lg border border-warning bg-card p-3 dark:border-warning dark:bg-warning/50">
						<PhoneCall className="mt-0.5 size-4 text-warning" />
						<div className="flex-1">
							<p className="font-medium text-sm">
								Customer Called 3 Times Today
							</p>
							<p className="text-muted-foreground text-xs">
								Bob Johnson - Job #4523 - Escalate to senior tech
							</p>
						</div>
						<Button size="sm" variant="outline">
							Call Customer
						</Button>
					</div>
					<div className="flex items-start gap-3 rounded-lg border border-warning bg-card p-3 dark:border-warning dark:bg-warning/50">
						<AlertTriangle className="mt-0.5 size-4 text-warning" />
						<div className="flex-1">
							<p className="font-medium text-sm">Callback: Parts Arrived</p>
							<p className="text-muted-foreground text-xs">
								5 customers waiting for parts to arrive - schedule follow-up
							</p>
						</div>
						<Button size="sm" variant="outline">
							Schedule Callbacks
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Top Management KPIs - 4 columns */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<KPICard
					change="Target: 4.5+"
					changeType="positive"
					description="Based on 87 reviews this month"
					icon={Star}
					title="Customer Satisfaction"
					tooltip="Average customer rating from post-job surveys and online reviews"
					value="4.8 ⭐"
				/>
				<KPICard
					change="+8% vs last month"
					changeType="positive"
					icon={Users}
					title="Team Efficiency"
					tooltip="Average jobs completed per technician per day. Higher = better productivity."
					value="5.2 jobs/day"
				/>
				<KPICard
					change="Target: < 5%"
					changeType="positive"
					icon={AlertTriangle}
					title="Callback Rate"
					tooltip="Percentage of jobs that require a return visit to fix issues. Lower is better."
					value="3.2%"
				/>
				<KPICard
					change="12 pending estimates"
					changeType="neutral"
					icon={DollarSign}
					title="Estimate Conversion"
					tooltip="Percentage of estimates that convert to paid jobs. Industry average is 60-70%."
					value="68%"
				/>
			</div>

			{/* Follow-Up Queue + Review Monitoring */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Follow-Up Queue */}
				<div className="space-y-3">
					<SectionHeader
						description="Revenue opportunities requiring action"
						title="Follow-Up Queue"
						tooltip="Pending estimates, maintenance renewals, and customer callbacks that could generate revenue"
					/>
					<Card>
						<CardContent className="space-y-3 pt-6">
							{/* Pending Estimates */}
							<div className="flex items-start gap-3 rounded-lg border border-success bg-success p-3 dark:border-success dark:bg-success/30">
								<div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-success">
									<DollarSign className="size-5 text-white" />
								</div>
								<div className="flex-1">
									<div className="flex items-center justify-between">
										<Badge
											className="border-success text-success"
											variant="outline"
										>
											High Value
										</Badge>
										<span className="font-bold text-sm text-success">
											$32,400 potential
										</span>
									</div>
									<p className="mt-1 font-bold text-sm">12 Pending Estimates</p>
									<p className="text-muted-foreground text-xs">
										Average age: 4 days • Convert now to hit monthly target
									</p>
								</div>
								<Button size="sm" variant="outline">
									Review
								</Button>
							</div>

							{/* Maintenance Renewals */}
							<div className="flex items-start gap-3 rounded-lg border bg-card p-3">
								<div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
									<Package className="size-5 text-primary" />
								</div>
								<div className="flex-1">
									<Badge variant="outline">Recurring Revenue</Badge>
									<p className="mt-1 font-bold text-sm">
										8 Maintenance Plans Expiring
									</p>
									<p className="text-muted-foreground text-xs">
										Within 7 days • Auto-generate renewal calls
									</p>
								</div>
								<Button size="sm" variant="outline">
									Send Reminders
								</Button>
							</div>

							{/* Parts Arrival Callbacks */}
							<div className="flex items-start gap-3 rounded-lg border bg-card p-3">
								<div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
									<PhoneCall className="size-5 text-accent-foreground" />
								</div>
								<div className="flex-1">
									<Badge variant="outline">Pending Callbacks</Badge>
									<p className="mt-1 font-bold text-sm">
										5 Customers Awaiting Parts
									</p>
									<p className="text-muted-foreground text-xs">
										Parts arrived • Schedule completion visits
									</p>
								</div>
								<Button size="sm" variant="outline">
									Schedule
								</Button>
							</div>

							{/* Quote Ready */}
							<div className="flex items-start gap-3 rounded-lg border bg-card p-3">
								<div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-warning/10">
									<MessageSquare className="size-5 text-warning" />
								</div>
								<div className="flex-1">
									<Badge variant="outline">Ready to Send</Badge>
									<p className="mt-1 font-bold text-sm">3 Quotes Finalized</p>
									<p className="text-muted-foreground text-xs">
										Send to customers for approval
									</p>
								</div>
								<Button size="sm" variant="outline">
									Send Quotes
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Customer Sentiment Tracker */}
				<div className="space-y-3">
					<SectionHeader
						description="Monitor and respond to customer feedback"
						title="Customer Sentiment"
						tooltip="Recent reviews and ratings from Google, Yelp, and post-job surveys"
					/>
					<Card>
						<CardContent className="space-y-3 pt-6">
							{/* Negative Review - Urgent */}
							<div className="flex items-start gap-3 rounded-lg border-2 border-destructive bg-destructive p-3 dark:border-destructive dark:bg-destructive/30">
								<div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-destructive">
									<Star className="size-5 text-white" />
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<Badge variant="destructive">⚠ URGENT</Badge>
										<span className="text-muted-foreground text-xs">
											1 hour ago
										</span>
									</div>
									<p className="mt-1 font-bold text-sm">2-Star Google Review</p>
									<p className="text-muted-foreground text-xs">
										Jane Smith - "Tech was rude and rushed" - Respond
										immediately
									</p>
								</div>
								<Button size="sm" variant="destructive">
									Respond
								</Button>
							</div>

							{/* Neutral Review */}
							<div className="flex items-start gap-3 rounded-lg border border-warning bg-warning p-3 dark:border-warning dark:bg-warning/30">
								<div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-warning">
									<Star className="size-5 text-white" />
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<Badge
											className="border-warning text-warning"
											variant="outline"
										>
											Needs Response
										</Badge>
										<span className="text-muted-foreground text-xs">
											2 days ago
										</span>
									</div>
									<p className="mt-1 font-bold text-sm">3-Star Yelp Review</p>
									<p className="text-muted-foreground text-xs">
										Tom Wilson - "Job done but expensive" - Address pricing
										concern
									</p>
								</div>
								<Button size="sm" variant="outline">
									Respond
								</Button>
							</div>

							{/* Positive Reviews */}
							{[
								{
									customer: "Sarah Johnson",
									rating: 5,
									comment: "Excellent service! Very professional",
									platform: "Google",
								},
								{
									customer: "Mike Davis",
									rating: 5,
									comment: "Quick response and fair pricing",
									platform: "Facebook",
								},
							].map((review, index) => (
								<div
									className="flex items-start gap-3 rounded-lg border bg-card p-3"
									key={index}
								>
									<div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-success/10">
										<Star className="size-5 text-success" />
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<Badge
												className="border-success text-success"
												variant="outline"
											>
												⭐ {review.rating}-Star
											</Badge>
											<span className="text-muted-foreground text-xs">
												{review.platform}
											</span>
										</div>
										<p className="mt-1 font-bold text-sm">{review.customer}</p>
										<p className="text-muted-foreground text-xs">
											"{review.comment}"
										</p>
									</div>
									<Button size="sm" variant="ghost">
										Share
									</Button>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Team Performance Leaderboard */}
			<div className="space-y-3">
				<SectionHeader
					description="Today's technician performance metrics"
					title="Team Performance"
					tooltip="Track which technicians are excelling and who needs coaching"
				/>
				<Suspense fallback={<TableSkeleton rows={5} />}>
					<TechnicianPerformance />
				</Suspense>
			</div>

			{/* Inventory Alerts + Operational Metrics */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Inventory Alerts */}
				<div className="space-y-3">
					<SectionHeader
						description="Stock levels and reorder alerts"
						title="Inventory Status"
						tooltip="Monitor parts and materials to avoid job delays"
					/>
					<Card>
						<CardContent className="space-y-3 pt-6">
							{/* Critical Low Stock */}
							<div className="flex items-start gap-3 rounded-lg border border-destructive bg-destructive p-3 dark:border-destructive dark:bg-destructive/30">
								<Package className="mt-0.5 size-5 text-destructive" />
								<div className="flex-1">
									<Badge variant="destructive">CRITICAL LOW</Badge>
									<p className="mt-1 font-bold text-sm">
										40-Gallon Water Heaters
									</p>
									<p className="text-muted-foreground text-xs">
										2 units left • 3 jobs scheduled this week
									</p>
								</div>
								<Button size="sm" variant="destructive">
									Order Now
								</Button>
							</div>

							{/* Low Stock Warning */}
							<div className="flex items-start gap-3 rounded-lg border border-warning bg-warning p-3 dark:border-warning dark:bg-warning/30">
								<Package className="mt-0.5 size-5 text-warning" />
								<div className="flex-1">
									<Badge
										className="border-warning text-warning"
										variant="outline"
									>
										Low Stock
									</Badge>
									<p className="mt-1 font-bold text-sm">PEX Fittings - 1/2"</p>
									<p className="text-muted-foreground text-xs">
										12 pieces left • Reorder soon
									</p>
								</div>
								<Button size="sm" variant="outline">
									Add to Order
								</Button>
							</div>

							{/* Truck Needs Restock */}
							<div className="flex items-start gap-3 rounded-lg border bg-card p-3">
								<Users className="mt-0.5 size-5 text-primary" />
								<div className="flex-1">
									<Badge variant="outline">Truck Inventory</Badge>
									<p className="mt-1 font-bold text-sm">
										Mike's Truck Needs Restock
									</p>
									<p className="text-muted-foreground text-xs">
										Ran out of copper fittings - restock end of day
									</p>
								</div>
								<Button size="sm" variant="outline">
									View List
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Operational Metrics */}
				<div className="space-y-3">
					<SectionHeader
						description="Key operational indicators"
						title="Operations Snapshot"
						tooltip="Track important business metrics at a glance"
					/>
					<Card>
						<CardContent className="space-y-4 pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-muted-foreground text-sm">
										First-Call Resolution
									</p>
									<p className="font-bold text-2xl">87%</p>
								</div>
								<Badge className="text-success" variant="outline">
									Above target (85%)
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-muted-foreground text-sm">
										Avg. Job Duration
									</p>
									<p className="font-bold text-2xl">2.4 hrs</p>
								</div>
								<Badge className="text-primary" variant="outline">
									On target
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-muted-foreground text-sm">Parts Markup</p>
									<p className="font-bold text-2xl">42%</p>
								</div>
								<Badge className="text-success" variant="outline">
									Healthy margin
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-muted-foreground text-sm">
										Overtime Hours
									</p>
									<p className="font-bold text-2xl">12 hrs</p>
								</div>
								<Badge className="text-warning" variant="outline">
									Monitor closely
								</Badge>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
