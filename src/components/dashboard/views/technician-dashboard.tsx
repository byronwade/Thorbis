import {
	AlertCircle,
	CheckCircle2,
	Clock,
	DollarSign,
	MapPin,
	Navigation,
	Package,
	Star,
	TrendingUp,
	Wrench,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/kpi-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Technician Dashboard - Server Component
 *
 * Focus: Personal schedule, active jobs, earnings, performance metrics, and parts inventory
 * Target User: Field technician who needs to see their daily schedule and track their work
 */

export default function TechnicianDashboard() {
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
					<h1 className="font-bold text-4xl tracking-tight">My Dashboard</h1>
					<Badge className="text-warning" variant="outline">
						Technician View
					</Badge>
					<div className="flex items-center gap-2 rounded-full border border-border bg-success/10 px-3 py-1">
						<div className="size-2 rounded-full bg-success" />
						<span className="font-medium text-success text-xs dark:text-success">
							Clocked In
						</span>
					</div>
				</div>
				<p className="text-lg text-muted-foreground">{currentDate}</p>
			</div>

			{/* Active Job Alert */}
			<Card className="border-primary bg-primary dark:border-primary dark:bg-primary/30">
				<CardContent className="pt-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex size-12 items-center justify-center rounded-full bg-primary">
								<Wrench className="size-6 text-white" />
							</div>
							<div>
								<p className="font-bold text-lg">Current Job in Progress</p>
								<p className="text-muted-foreground text-sm">
									AC Repair - Sarah Johnson - 123 Main St
								</p>
								<p className="text-muted-foreground text-xs">
									Started 45 minutes ago
								</p>
							</div>
						</div>
						<div className="flex gap-2">
							<Button size="sm" variant="outline">
								Update Status
							</Button>
							<Button size="sm" variant="default">
								Complete Job
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Top Personal KPIs - 4 columns */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<KPICard
					change="+$240 vs yesterday"
					changeType="positive"
					description="Today's earnings"
					icon={DollarSign}
					title="My Revenue Today"
					tooltip="Total revenue you've generated from completed jobs today. This affects your commission."
					value="$3,240"
				/>
				<KPICard
					change="1 in progress, 3 remaining"
					changeType="positive"
					icon={CheckCircle2}
					title="Jobs Completed"
					tooltip="Number of jobs you've finished today out of your total scheduled jobs"
					value="2 of 6"
				/>
				<KPICard
					change="You're #2 on team"
					changeType="positive"
					icon={TrendingUp}
					title="Avg. Ticket Value"
					tooltip="Your average revenue per job. Higher values mean better upselling."
					value="$540"
				/>
				<KPICard
					change="100% perfect score!"
					changeType="positive"
					icon={Star}
					title="Customer Rating"
					tooltip="Your average customer satisfaction rating from post-job surveys"
					value="5.0 ⭐"
				/>
			</div>

			{/* My Schedule + Navigation */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Today's Schedule */}
				<div className="space-y-3">
					<SectionHeader
						description="Your appointments for today"
						title="My Schedule"
						tooltip="Upcoming jobs assigned to you. Click on a job to view details or navigate."
					/>
					<Card>
						<CardContent className="space-y-3 pt-6">
							{/* Current Job - In Progress */}
							<div className="flex items-start gap-3 rounded-lg border-2 border-primary bg-primary p-3 dark:border-primary dark:bg-primary/30">
								<div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
									<Wrench className="size-5 text-white" />
								</div>
								<div className="flex-1">
									<Badge variant="default">IN PROGRESS</Badge>
									<p className="mt-1 font-bold text-sm">
										9:00 AM - AC Not Cooling
									</p>
									<p className="text-muted-foreground text-xs">
										Sarah Johnson • 123 Main St, Suite 200
									</p>
									<p className="mt-1 text-muted-foreground text-xs">
										Est. value: $420 • Started 45 min ago
									</p>
								</div>
								<Button size="sm" variant="default">
									<Navigation className="mr-2 size-4" />
									Navigate
								</Button>
							</div>

							{/* Next Jobs */}
							{[
								{
									time: "11:30 AM",
									type: "Water Heater Replacement",
									customer: "Mike Davis",
									address: "456 Oak Ave",
									value: "$890",
									status: "Next",
								},
								{
									time: "2:00 PM",
									type: "Furnace Inspection",
									customer: "Lisa Chen",
									address: "789 Pine St",
									value: "$180",
									status: "Scheduled",
								},
								{
									time: "4:00 PM",
									type: "Drain Cleaning",
									customer: "Tom Wilson",
									address: "321 Elm Dr",
									value: "$240",
									status: "Scheduled",
								},
							].map((job, index) => (
								<div
									className="flex items-start gap-3 rounded-lg border bg-card p-3"
									key={index}
								>
									<div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
										<Clock className="size-5 text-muted-foreground" />
									</div>
									<div className="flex-1">
										<Badge variant="outline">{job.status}</Badge>
										<p className="mt-1 font-bold text-sm">
											{job.time} - {job.type}
										</p>
										<p className="text-muted-foreground text-xs">
											{job.customer} • {job.address}
										</p>
										<p className="mt-1 text-muted-foreground text-xs">
											Est. value: {job.value}
										</p>
									</div>
									<Button size="sm" variant="outline">
										<Navigation className="mr-2 size-4" />
										Navigate
									</Button>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* My Performance */}
				<div className="space-y-3">
					<SectionHeader
						description="How you're doing vs. the team"
						title="My Performance"
						tooltip="Your performance metrics compared to team averages"
					/>
					<Card>
						<CardContent className="space-y-4 pt-6">
							{/* This Week Stats */}
							<div className="rounded-lg border bg-muted/50 p-4">
								<p className="font-bold text-sm">This Week</p>
								<div className="mt-3 space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Total Revenue
										</span>
										<span className="font-bold text-success">$12,840</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Jobs Completed
										</span>
										<span className="font-bold">24 jobs</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Avg. per Day
										</span>
										<span className="font-bold">4.8 jobs</span>
									</div>
								</div>
							</div>

							{/* Performance Badges */}
							<div className="space-y-2">
								<p className="font-medium text-sm">Achievements</p>
								<div className="flex flex-wrap gap-2">
									<Badge
										className="border-success text-success"
										variant="outline"
									>
										⭐ Top Performer
									</Badge>
									<Badge
										className="border-primary text-primary"
										variant="outline"
									>
										🎯 Target Met
									</Badge>
									<Badge
										className="border-border text-accent-foreground"
										variant="outline"
									>
										💰 Highest Revenue
									</Badge>
								</div>
							</div>

							{/* Team Ranking */}
							<div className="rounded-lg border bg-success p-4 dark:bg-success/30">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-bold text-sm">Team Ranking</p>
										<p className="text-muted-foreground text-xs">
											Out of 12 technicians
										</p>
									</div>
									<div className="text-right">
										<p className="font-bold text-3xl text-success">#2</p>
										<p className="text-success text-xs">This week</p>
									</div>
								</div>
							</div>

							{/* Commission Estimate */}
							<div className="rounded-lg border bg-primary p-4 dark:bg-primary/30">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-bold text-sm">Estimated Commission</p>
										<p className="text-muted-foreground text-xs">
											Based on this week
										</p>
									</div>
									<div className="text-right">
										<p className="font-bold text-2xl text-primary">$1,284</p>
										<p className="text-primary text-xs">10% of revenue</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* My Truck Inventory + Quick Actions */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Truck Inventory */}
				<div className="space-y-3">
					<SectionHeader
						description="Parts and materials on your truck"
						title="My Truck Inventory"
						tooltip="Track what's in your truck to know what jobs you can complete"
					/>
					<Card>
						<CardContent className="space-y-3 pt-6">
							{/* Low Stock Warning */}
							<div className="flex items-start gap-3 rounded-lg border border-destructive bg-destructive p-3 dark:border-destructive dark:bg-destructive/30">
								<AlertCircle className="mt-0.5 size-5 text-destructive" />
								<div className="flex-1">
									<Badge variant="destructive">LOW STOCK</Badge>
									<p className="mt-1 font-bold text-sm">PEX Fittings - 1/2"</p>
									<p className="text-muted-foreground text-xs">
										Only 3 left • Restock needed
									</p>
								</div>
								<Button size="sm" variant="outline">
									Request
								</Button>
							</div>

							{/* Good Stock Items */}
							{[
								{
									item: "Water Heater - 40 gal",
									quantity: "2 units",
									status: "Good",
								},
								{
									item: 'Copper Pipe - 3/4"',
									quantity: "50 ft",
									status: "Good",
								},
								{ item: "Drain Snake", quantity: "1 unit", status: "Good" },
							].map((item, index) => (
								<div
									className="flex items-center justify-between rounded-lg border bg-card p-3"
									key={index}
								>
									<div className="flex items-center gap-3">
										<Package className="size-5 text-muted-foreground" />
										<div>
											<p className="font-medium text-sm">{item.item}</p>
											<p className="text-muted-foreground text-xs">
												{item.quantity}
											</p>
										</div>
									</div>
									<Badge className="text-success" variant="outline">
										{item.status}
									</Badge>
								</div>
							))}

							<Button className="w-full" variant="outline">
								View Full Inventory
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions + Time Tracking */}
				<div className="space-y-3">
					<SectionHeader
						description="Common actions and time tracking"
						title="Quick Actions"
						tooltip="Frequently used functions for field work"
					/>
					<Card>
						<CardContent className="space-y-4 pt-6">
							{/* Time Tracking */}
							<div className="rounded-lg border bg-muted/50 p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-bold text-sm">Time Tracking</p>
										<p className="text-muted-foreground text-xs">
											Clocked in at 7:30 AM
										</p>
									</div>
									<div className="text-right">
										<p className="font-bold text-2xl">4h 15m</p>
										<p className="text-muted-foreground text-xs">Today</p>
									</div>
								</div>
								<div className="mt-3 flex gap-2">
									<Button className="flex-1" size="sm" variant="outline">
										Start Break
									</Button>
									<Button className="flex-1" size="sm" variant="outline">
										Clock Out
									</Button>
								</div>
							</div>

							{/* Quick Action Buttons */}
							<div className="grid grid-cols-2 gap-2">
								<Button size="sm" variant="outline">
									<Wrench className="mr-2 size-4" />
									Update Job
								</Button>
								<Button size="sm" variant="outline">
									<MapPin className="mr-2 size-4" />
									Next Job
								</Button>
								<Button size="sm" variant="outline">
									<Package className="mr-2 size-4" />
									Order Parts
								</Button>
								<Button size="sm" variant="outline">
									<DollarSign className="mr-2 size-4" />
									Create Invoice
								</Button>
							</div>

							{/* Notes Section */}
							<div className="rounded-lg border bg-muted/50 p-4">
								<p className="font-bold text-sm">Today's Notes</p>
								<p className="mt-2 text-muted-foreground text-sm">
									• Pick up parts from warehouse before 3 PM
									<br />• Mike Davis job may need water heater replacement
									<br />• Team meeting tomorrow at 8 AM
								</p>
							</div>

							{/* Support */}
							<Button className="w-full" variant="outline">
								Contact Dispatcher
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Recent Feedback */}
			<div className="space-y-3">
				<SectionHeader
					description="What customers are saying about you"
					title="Recent Customer Feedback"
					tooltip="Customer reviews and ratings from your completed jobs"
				/>
				<Card>
					<CardContent className="grid grid-cols-1 gap-3 pt-6 md:grid-cols-2 lg:grid-cols-3">
						{[
							{
								customer: "Sarah Johnson",
								rating: 5,
								comment: "Excellent work! Very professional and thorough.",
								job: "AC Repair",
							},
							{
								customer: "Mike Davis",
								rating: 5,
								comment: "Quick service and fair pricing. Highly recommend!",
								job: "Water Heater",
							},
							{
								customer: "Lisa Chen",
								rating: 5,
								comment: "Great technician. Explained everything clearly.",
								job: "Furnace Check",
							},
						].map((review, index) => (
							<div
								className="rounded-lg border bg-success p-3 dark:bg-success/30"
								key={index}
							>
								<div className="flex items-center gap-2">
									<Star className="size-4 text-warning" />
									<span className="font-bold text-sm">
										{review.rating}.0 ⭐
									</span>
									<Badge className="ml-auto text-xs" variant="outline">
										{review.job}
									</Badge>
								</div>
								<p className="mt-2 font-medium text-sm">{review.customer}</p>
								<p className="mt-1 text-muted-foreground text-xs">
									"{review.comment}"
								</p>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
