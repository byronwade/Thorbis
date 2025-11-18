import {
	Calendar,
	CheckCircle2,
	Clock,
	DollarSign,
	FileText,
	MessageSquare,
	Phone,
	Search,
	Users,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/kpi-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/**
 * CSR (Customer Service Representative) Dashboard - Server Component
 *
 * Focus: Call handling, appointment booking, customer search, follow-ups, and estimate pipeline
 * Target User: Front desk/call center staff managing customer communications and bookings
 */

export default function CSRDashboard() {
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
					<h1 className="text-4xl font-bold tracking-tight">
						Customer Service Hub
					</h1>
					<Badge className="text-accent-foreground" variant="outline">
						CSR View
					</Badge>
					<div className="border-border bg-muted/30 flex items-center gap-2 rounded-full border px-3 py-1">
						<div className="bg-success size-2 animate-pulse rounded-full" />
						<span className="text-muted-foreground text-xs font-medium">
							Available
						</span>
					</div>
				</div>
				<p className="text-muted-foreground text-lg">{currentDate}</p>
			</div>

			{/* Quick Customer Search */}
			<Card className="border-primary bg-primary dark:border-primary dark:bg-primary/30">
				<CardContent className="pt-6">
					<div className="flex items-center gap-3">
						<Search className="text-primary size-6" />
						<div className="flex-1">
							<Input
								className="h-12"
								placeholder="Search customers by name, phone, or address..."
								type="search"
							/>
						</div>
						<Button size="lg">Search</Button>
						<Button size="lg" variant="outline">
							New Customer
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Top CSR KPIs - 4 columns */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<KPICard
					change="88 total today"
					changeType="positive"
					description="Industry avg: 60-70%"
					icon={Phone}
					title="Booking Rate"
					tooltip="Percentage of inbound calls that were converted into scheduled appointments"
					value="73.9%"
				/>
				<KPICard
					change="12 booked from calls"
					changeType="positive"
					icon={Calendar}
					title="Appointments Today"
					tooltip="Total number of appointments scheduled for today across all technicians"
					value="15"
				/>
				<KPICard
					change="Avg response: 18 sec"
					changeType="positive"
					icon={Clock}
					title="Calls Answered"
					tooltip="Number of inbound customer calls you've handled today"
					value="43"
				/>
				<KPICard
					change="12 pending follow-ups"
					changeType="neutral"
					icon={DollarSign}
					title="Estimates Sent"
					tooltip="Number of price quotes sent to customers today"
					value="8"
				/>
			</div>

			{/* Call Queue + Follow-Up Queue */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Active Call Queue */}
				<div className="space-y-3">
					<SectionHeader
						description="Customers waiting for callback"
						title="Call Queue"
						tooltip="List of customers who requested callbacks or need follow-up calls"
					/>
					<Card>
						<CardContent className="space-y-3 pt-6">
							{/* Urgent Callback */}
							<div className="border-destructive bg-destructive dark:border-destructive dark:bg-destructive/30 flex items-start gap-3 rounded-lg border-2 p-3">
								<div className="bg-destructive flex size-10 flex-shrink-0 items-center justify-center rounded-full">
									<Phone className="size-5 text-white" />
								</div>
								<div className="flex-1">
									<Badge variant="destructive">URGENT</Badge>
									<p className="mt-1 text-sm font-bold">Sarah Johnson</p>
									<p className="text-muted-foreground text-xs">
										+1 (555) 123-4567 • Requested callback 2 hours ago
									</p>
									<p className="text-muted-foreground mt-1 text-xs">
										Reason: Emergency - No hot water
									</p>
								</div>
								<Button size="sm" variant="destructive">
									Call Now
								</Button>
							</div>

							{/* Regular Callbacks */}
							{[
								{
									name: "Mike Davis",
									phone: "+1 (555) 234-5678",
									reason: "Quote ready for review",
									time: "45 min ago",
								},
								{
									name: "Lisa Chen",
									phone: "+1 (555) 345-6789",
									reason: "Schedule maintenance",
									time: "1 hour ago",
								},
								{
									name: "Tom Wilson",
									phone: "+1 (555) 456-7890",
									reason: "Parts arrived - reschedule",
									time: "2 hours ago",
								},
							].map((callback, index) => (
								<div
									className="bg-card flex items-start gap-3 rounded-lg border p-3"
									key={index}
								>
									<div className="bg-primary/10 flex size-10 flex-shrink-0 items-center justify-center rounded-full">
										<Phone className="text-primary size-5" />
									</div>
									<div className="flex-1">
										<Badge variant="outline">Pending</Badge>
										<p className="mt-1 text-sm font-bold">{callback.name}</p>
										<p className="text-muted-foreground text-xs">
											{callback.phone}
										</p>
										<p className="text-muted-foreground mt-1 text-xs">
											{callback.reason} • {callback.time}
										</p>
									</div>
									<Button size="sm" variant="outline">
										Call
									</Button>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* Estimate Pipeline */}
				<div className="space-y-3">
					<SectionHeader
						description="Quotes waiting for customer approval"
						title="Estimate Pipeline"
						tooltip="Track estimates from creation to conversion"
					/>
					<Card>
						<CardContent className="space-y-3 pt-6">
							{/* High Value Estimate */}
							<div className="border-success bg-success dark:border-success dark:bg-success/30 flex items-start gap-3 rounded-lg border p-3">
								<div className="bg-success flex size-10 flex-shrink-0 items-center justify-center rounded-full">
									<DollarSign className="size-5 text-white" />
								</div>
								<div className="flex-1">
									<Badge
										className="border-success text-success"
										variant="outline"
									>
										High Value
									</Badge>
									<p className="mt-1 text-sm font-bold">
										HVAC System Replacement
									</p>
									<p className="text-muted-foreground text-xs">
										Bob Anderson • Sent 2 days ago
									</p>
									<p className="text-success mt-1 text-sm font-bold">$8,500</p>
								</div>
								<Button size="sm" variant="outline">
									Follow Up
								</Button>
							</div>

							{/* Regular Estimates */}
							{[
								{
									service: "Water Heater Replacement",
									customer: "Emily Rogers",
									amount: "$1,200",
									age: "3 days",
								},
								{
									service: "AC Maintenance Plan",
									customer: "James Park",
									amount: "$450",
									age: "5 days",
								},
								{
									service: "Drain Line Repair",
									customer: "Maria Garcia",
									amount: "$680",
									age: "1 week",
								},
							].map((estimate, index) => (
								<div
									className="bg-card flex items-start gap-3 rounded-lg border p-3"
									key={index}
								>
									<div className="bg-primary/10 flex size-10 flex-shrink-0 items-center justify-center rounded-full">
										<FileText className="text-primary size-5" />
									</div>
									<div className="flex-1">
										<Badge variant="outline">Pending</Badge>
										<p className="mt-1 text-sm font-bold">{estimate.service}</p>
										<p className="text-muted-foreground text-xs">
											{estimate.customer} • Sent {estimate.age} ago
										</p>
										<p className="mt-1 text-sm font-bold">{estimate.amount}</p>
									</div>
									<Button size="sm" variant="outline">
										Follow Up
									</Button>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Booking Calendar + Recent Activity */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Today's Bookings */}
				<div className="space-y-3">
					<SectionHeader
						description="Appointments scheduled for today"
						title="Today's Bookings"
						tooltip="All appointments you've scheduled for today"
					/>
					<Card>
						<CardContent className="space-y-3 pt-6">
							{[
								{
									time: "9:00 AM",
									customer: "Sarah Johnson",
									service: "AC Repair",
									tech: "John Smith",
									status: "Confirmed",
								},
								{
									time: "11:00 AM",
									customer: "Mike Davis",
									service: "Water Heater",
									tech: "Dave Wilson",
									status: "Confirmed",
								},
								{
									time: "2:00 PM",
									customer: "Lisa Chen",
									service: "Furnace Check",
									tech: "Sarah Lee",
									status: "Pending",
								},
								{
									time: "4:00 PM",
									customer: "Tom Wilson",
									service: "Drain Cleaning",
									tech: "Mike Rodriguez",
									status: "Confirmed",
								},
							].map((booking, index) => (
								<div
									className="bg-card flex items-start gap-3 rounded-lg border p-3"
									key={index}
								>
									<div className="bg-primary/10 flex size-10 flex-shrink-0 items-center justify-center rounded-full">
										<Calendar className="text-primary size-5" />
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<Badge
												variant={
													booking.status === "Confirmed" ? "default" : "outline"
												}
											>
												{booking.status}
											</Badge>
											<span className="text-muted-foreground text-xs">
												{booking.time}
											</span>
										</div>
										<p className="mt-1 text-sm font-bold">{booking.customer}</p>
										<p className="text-muted-foreground text-xs">
											{booking.service} • Tech: {booking.tech}
										</p>
									</div>
									<Button size="sm" variant="ghost">
										Details
									</Button>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* My Activity Stats */}
				<div className="space-y-3">
					<SectionHeader
						description="Your performance today"
						title="My Performance"
						tooltip="Track your daily call handling and booking metrics"
					/>
					<Card>
						<CardContent className="space-y-4 pt-6">
							{/* Call Stats */}
							<div className="bg-muted/50 rounded-lg border p-4">
								<div className="flex items-center gap-2">
									<Phone className="text-primary size-5" />
									<p className="text-sm font-bold">Call Statistics</p>
								</div>
								<div className="mt-3 space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Calls Answered
										</span>
										<span className="font-bold">43</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Avg. Call Time
										</span>
										<span className="font-bold">4:32</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Missed Calls
										</span>
										<span className="font-bold">2</span>
									</div>
								</div>
							</div>

							{/* Booking Stats */}
							<div className="bg-muted/50 rounded-lg border p-4">
								<div className="flex items-center gap-2">
									<Calendar className="text-success size-5" />
									<p className="text-sm font-bold">Booking Statistics</p>
								</div>
								<div className="mt-3 space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Appointments Booked
										</span>
										<span className="font-bold">12</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Conversion Rate
										</span>
										<span className="text-success font-bold">73.9%</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Avg. Booking Value
										</span>
										<span className="font-bold">$485</span>
									</div>
								</div>
							</div>

							{/* Estimates Sent */}
							<div className="bg-muted/50 rounded-lg border p-4">
								<div className="flex items-center gap-2">
									<FileText className="text-accent-foreground size-5" />
									<p className="text-sm font-bold">Estimates</p>
								</div>
								<div className="mt-3 space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Sent Today
										</span>
										<span className="font-bold">8</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Total Value
										</span>
										<span className="font-bold">$12,400</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Pending Review
										</span>
										<span className="text-warning font-bold">12</span>
									</div>
								</div>
							</div>

							{/* Performance Badge */}
							<div className="bg-success dark:bg-success/30 rounded-lg border p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-bold">Today's Achievement</p>
										<p className="text-muted-foreground text-xs">
											You're exceeding targets!
										</p>
									</div>
									<Badge
										className="border-success text-success"
										variant="outline"
									>
										⭐ Top Performer
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Quick Actions + Call Scripts */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Quick Actions */}
				<div className="space-y-3">
					<SectionHeader
						description="Common tasks and shortcuts"
						title="Quick Actions"
						tooltip="Frequently used functions for customer service"
					/>
					<Card>
						<CardContent className="pt-6">
							<div className="grid grid-cols-2 gap-3">
								<Button variant="outline">
									<Phone className="mr-2 size-4" />
									New Call
								</Button>
								<Button variant="outline">
									<Calendar className="mr-2 size-4" />
									Book Appointment
								</Button>
								<Button variant="outline">
									<Users className="mr-2 size-4" />
									Add Customer
								</Button>
								<Button variant="outline">
									<FileText className="mr-2 size-4" />
									Create Estimate
								</Button>
								<Button variant="outline">
									<MessageSquare className="mr-2 size-4" />
									Send SMS
								</Button>
								<Button variant="outline">
									<CheckCircle2 className="mr-2 size-4" />
									Confirm Booking
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Call Scripts */}
				<div className="space-y-3">
					<SectionHeader
						description="Helpful scripts for common situations"
						title="Call Scripts"
						tooltip="Pre-written responses for consistent customer service"
					/>
					<Card>
						<CardContent className="space-y-3 pt-6">
							{[
								{
									title: "Greeting Script",
									preview: "Thank you for calling! How can I help you today?",
								},
								{
									title: "Emergency Response",
									preview:
										"I understand this is urgent. Let me get you scheduled...",
								},
								{
									title: "Pricing Questions",
									preview:
										"Our standard service call is $89, which includes...",
								},
								{
									title: "Booking Confirmation",
									preview: "I have you scheduled for [time] on [date]...",
								},
							].map((script, index) => (
								<div
									className="bg-card flex items-start gap-3 rounded-lg border p-3"
									key={index}
								>
									<MessageSquare className="text-primary mt-0.5 size-5" />
									<div className="flex-1">
										<p className="text-sm font-bold">{script.title}</p>
										<p className="text-muted-foreground text-xs">
											{script.preview}
										</p>
									</div>
									<Button size="sm" variant="ghost">
										View
									</Button>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
