
import {
	Calendar,
	CheckCircle2,
	Clock,
	MapPin,
	Route,
	TrendingUp,
	Truck,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { RelatedContent } from "@/components/seo/related-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getRelatedFeatures } from "@/lib/seo/content-recommendations";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	generateServiceStructuredData,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";
import {
	createFAQSchema,
	createItemListSchema,
} from "@/lib/seo/structured-data";

// Note: Caching is controlled by next.config.ts cacheLife configuration

// Semantic keywords for scheduling
const schedulingKeywords = generateSemanticKeywords("scheduling");

export const metadata = generateSEOMetadata({
	title: "AI Scheduling & Dispatch Software - Route Optimization",
	section: "Features",
	description:
		"AI-powered scheduling and dispatch with automatic route optimization. Drag-and-drop scheduling, real-time updates, and smart technician allocation. Increase efficiency by 40%.",
	path: "/features/scheduling",
	keywords: [
		"field service scheduling software",
		"dispatch automation",
		"route optimization software",
		"technician scheduling app",
		"smart dispatch",
		...schedulingKeywords.slice(0, 5),
	],
});

export default function SchedulingPage() {
	const serviceStructuredData = generateServiceStructuredData({
		name: "AI-Powered Scheduling & Dispatch",
		description:
			"Intelligent field service scheduling with automatic route optimization, drag-and-drop scheduling boards, real-time GPS tracking, and smart technician allocation. Reduce drive time by 30% and increase daily jobs by 40%.",
		offers: [
			{
				price: "200",
				currency: "USD",
				description: "Included in Thorbis base platform - no additional cost",
			},
		],
	});

	// FAQ Schema for common scheduling questions
	const faqSchema = createFAQSchema([
		{
			question: "How does AI scheduling work?",
			answer:
				"Thorbis AI analyzes technician locations, skills, availability, job priorities, and traffic patterns to automatically assign jobs and optimize routes. The system continuously learns from your business patterns to improve scheduling efficiency.",
		},
		{
			question: "Can I manually adjust the schedule?",
			answer:
				"Yes, you have full control. Use the drag-and-drop scheduling board to manually adjust appointments, reassign technicians, or override AI suggestions. All changes update in real-time on technician mobile apps.",
		},
		{
			question: "Does scheduling include route optimization?",
			answer:
				"Yes, automatic route optimization is included. The system calculates the most efficient routes considering traffic, job priorities, technician locations, and appointment windows. Reduces drive time by an average of 30%.",
		},
		{
			question: "How do technicians receive their schedules?",
			answer:
				"Technicians see their schedules instantly on the mobile app with real-time updates. They receive push notifications for new jobs, changes, or cancellations. GPS navigation is integrated for one-tap directions.",
		},
	]);

	// ItemList for scheduling features
	const featuresSchema = createItemListSchema({
		name: "Scheduling & Dispatch Features",
		description: "Complete scheduling capabilities",
		items: [
			{
				name: "Drag-and-Drop Scheduling Board",
				url: `${siteUrl}/features/scheduling#scheduling-board`,
				description: "Visual scheduling with drag-and-drop job assignment",
			},
			{
				name: "Automatic Route Optimization",
				url: `${siteUrl}/features/scheduling#route-optimization`,
				description: "AI-powered route planning to minimize drive time",
			},
			{
				name: "Real-Time GPS Tracking",
				url: `${siteUrl}/features/scheduling#gps-tracking`,
				description: "Live technician locations and ETAs",
			},
			{
				name: "Smart Technician Matching",
				url: `${siteUrl}/features/scheduling#smart-matching`,
				description:
					"Auto-assign jobs based on skills, location, and availability",
			},
		],
	});

	return (
		<>
			{/* Breadcrumb Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Features", url: `${siteUrl}/features` },
							{
								name: "Scheduling & Dispatch",
								url: `${siteUrl}/features/scheduling`,
							},
						]),
					),
				}}
				id="scheduling-breadcrumb-ld"
				type="application/ld+json"
			/>

			{/* Service Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(serviceStructuredData),
				}}
				id="scheduling-service-ld"
				type="application/ld+json"
			/>

			{/* FAQ Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqSchema),
				}}
				id="scheduling-faq-ld"
				type="application/ld+json"
			/>

			{/* ItemList Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(featuresSchema),
				}}
				id="scheduling-features-ld"
				type="application/ld+json"
			/>

			{/* Hero Section with Board Visualization */}
			<section className="relative overflow-hidden py-20 sm:py-32">
				<div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl text-center">
						<Badge className="mb-6 gap-1.5 px-3 py-1.5" variant="secondary">
							<Calendar className="size-3.5" />
							Intelligent Scheduling
						</Badge>
						<h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
							Schedule smarter, dispatch faster
						</h1>
						<p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg sm:text-xl">
							Drag-and-drop scheduling boards with AI-powered route
							optimization. Keep every truck profitable and every customer
							happy.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-4">
							<Button asChild className="shadow-primary/20 shadow-lg" size="lg">
								<Link href="/waitlist">
									Join Waitlist
									<Zap className="ml-2 size-4" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/demo">Watch Demo</Link>
							</Button>
						</div>
					</div>

					{/* Interactive Dispatch Board Preview */}
					<div className="relative mx-auto mt-16 max-w-6xl">
						<div className="border-border/50 bg-background overflow-hidden rounded-2xl border shadow-2xl">
							{/* Board Header */}
							<div className="border-border/50 bg-muted/30 flex items-center justify-between border-b px-6 py-4">
								<div className="flex items-center gap-4">
									<h3 className="text-lg font-semibold">Today's Schedule</h3>
									<Badge variant="secondary">12 Jobs • 4 Techs</Badge>
								</div>
								<div className="flex items-center gap-2">
									<Button size="sm" variant="outline">
										<MapPin className="mr-2 size-3.5" />
										Map View
									</Button>
									<Button size="sm" variant="outline">
										<Route className="mr-2 size-3.5" />
										Optimize Routes
									</Button>
								</div>
							</div>

							{/* Dispatch Board */}
							<div className="grid grid-cols-4 gap-4 p-6">
								{/* Tech Column 1 */}
								<div className="space-y-3">
									<div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
										<div className="flex size-8 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
											MJ
										</div>
										<div className="flex-1">
											<div className="text-sm font-semibold">Mike Johnson</div>
											<div className="text-muted-foreground text-xs">
												3 jobs • 85% util
											</div>
										</div>
									</div>
									<div className="space-y-2">
										<div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
											<div className="mb-1 flex items-center gap-2">
												<Clock className="size-3 text-green-600" />
												<span className="text-xs font-semibold">
													8:00 AM - 10:00 AM
												</span>
											</div>
											<div className="text-sm font-medium">AC Repair</div>
											<div className="text-muted-foreground text-xs">
												123 Oak St
											</div>
										</div>
										<div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
											<div className="mb-1 flex items-center gap-2">
												<Clock className="size-3 text-yellow-600" />
												<span className="text-xs font-semibold">
													11:00 AM - 1:00 PM
												</span>
											</div>
											<div className="text-sm font-medium">Maintenance</div>
											<div className="text-muted-foreground text-xs">
												456 Elm St
											</div>
										</div>
										<div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
											<div className="mb-1 flex items-center gap-2">
												<Clock className="size-3 text-blue-600" />
												<span className="text-xs font-semibold">
													2:00 PM - 4:00 PM
												</span>
											</div>
											<div className="text-sm font-medium">Installation</div>
											<div className="text-muted-foreground text-xs">
												789 Pine St
											</div>
										</div>
									</div>
								</div>

								{/* Tech Column 2 */}
								<div className="space-y-3">
									<div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
										<div className="flex size-8 items-center justify-center rounded-full bg-purple-500 text-xs font-semibold text-white">
											SR
										</div>
										<div className="flex-1">
											<div className="text-sm font-semibold">
												Sarah Rodriguez
											</div>
											<div className="text-muted-foreground text-xs">
												4 jobs • 92% util
											</div>
										</div>
									</div>
									<div className="space-y-2">
										<div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
											<div className="mb-1 flex items-center gap-2">
												<Clock className="size-3 text-green-600" />
												<span className="text-xs font-semibold">
													8:30 AM - 10:30 AM
												</span>
											</div>
											<div className="text-sm font-medium">Inspection</div>
											<div className="text-muted-foreground text-xs">
												321 Maple Ave
											</div>
										</div>
										<div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
											<div className="mb-1 flex items-center gap-2">
												<Clock className="size-3 text-yellow-600" />
												<span className="text-xs font-semibold">
													11:30 AM - 12:30 PM
												</span>
											</div>
											<div className="text-sm font-medium">Quick Fix</div>
											<div className="text-muted-foreground text-xs">
												654 Cedar Ln
											</div>
										</div>
									</div>
								</div>

								{/* Tech Column 3 */}
								<div className="space-y-3">
									<div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
										<div className="flex size-8 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white">
											TC
										</div>
										<div className="flex-1">
											<div className="text-sm font-semibold">Tom Chen</div>
											<div className="text-muted-foreground text-xs">
												2 jobs • 68% util
											</div>
										</div>
									</div>
									<div className="space-y-2">
										<div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
											<div className="mb-1 flex items-center gap-2">
												<Clock className="size-3 text-green-600" />
												<span className="text-xs font-semibold">
													9:00 AM - 12:00 PM
												</span>
											</div>
											<div className="text-sm font-medium">System Install</div>
											<div className="text-muted-foreground text-xs">
												987 Birch Dr
											</div>
										</div>
									</div>
								</div>

								{/* Unassigned Column */}
								<div className="space-y-3">
									<div className="bg-muted/50 rounded-lg p-3">
										<div className="text-sm font-semibold">Unassigned</div>
										<div className="text-muted-foreground text-xs">
											3 jobs pending
										</div>
									</div>
									<div className="space-y-2">
										<div className="border-border hover:border-primary hover:bg-primary/5 cursor-move rounded-lg border-2 border-dashed p-3 transition-colors">
											<div className="mb-1 flex items-center gap-2">
												<Badge
													className="h-5 text-[10px]"
													variant="destructive"
												>
													URGENT
												</Badge>
											</div>
											<div className="text-sm font-medium">Emergency Call</div>
											<div className="text-muted-foreground text-xs">
												147 Walnut St
											</div>
										</div>
										<div className="border-border hover:border-primary hover:bg-primary/5 cursor-move rounded-lg border-2 border-dashed p-3 transition-colors">
											<div className="text-sm font-medium">Estimate</div>
											<div className="text-muted-foreground text-xs">
												258 Spruce Ct
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Floating Stats */}
						<div className="border-border/50 bg-background absolute top-1/4 -left-4 hidden rounded-xl border p-4 shadow-xl lg:block">
							<div className="text-muted-foreground mb-2 text-xs font-semibold">
								Today's Metrics
							</div>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<TrendingUp className="size-4 text-green-500" />
									<span className="text-sm">85% Utilization</span>
								</div>
								<div className="flex items-center gap-2">
									<Route className="size-4 text-blue-500" />
									<span className="text-sm">124 mi saved</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="bg-muted/30 border-y py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">35%</div>
							<div className="text-muted-foreground text-sm font-medium">
								More Jobs Per Day
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">
								2.5 hrs
							</div>
							<div className="text-muted-foreground text-sm font-medium">
								Saved Per Tech Daily
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">90%</div>
							<div className="text-muted-foreground text-sm font-medium">
								On-Time Arrival Rate
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">$18K</div>
							<div className="text-muted-foreground text-sm font-medium">
								Avg. Monthly Savings
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
							Built for modern dispatch teams
						</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
							Everything you need to run a profitable, efficient service
							operation
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Route className="text-primary size-6" />
								</div>
								<CardTitle>AI Route Optimization</CardTitle>
								<CardDescription>
									Automatically plan the most efficient routes based on traffic,
									job duration, and tech skills
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Real-time traffic integration</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Multi-stop optimization</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Fuel cost calculations</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Calendar className="text-primary size-6" />
								</div>
								<CardTitle>Drag-and-Drop Boards</CardTitle>
								<CardDescription>
									Intuitive visual scheduling with real-time updates and
									conflict detection
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Color-coded job types</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Capacity warnings</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Quick reassignment</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Users className="text-primary size-6" />
								</div>
								<CardTitle>Smart Tech Matching</CardTitle>
								<CardDescription>
									Assign jobs based on skills, certifications, location, and
									availability
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Skill-based routing</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Certification tracking</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Performance scoring</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<MapPin className="text-primary size-6" />
								</div>
								<CardTitle>Live GPS Tracking</CardTitle>
								<CardDescription>
									See exactly where every tech is in real-time with ETA updates
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Real-time location updates</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Automatic ETA notifications</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Geofence alerts</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Clock className="text-primary size-6" />
								</div>
								<CardTitle>Automated Reminders</CardTitle>
								<CardDescription>
									Keep customers informed with automatic SMS and email
									notifications
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>24-hour advance reminders</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>"On the way" notifications</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Completion confirmations</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Truck className="text-primary size-6" />
								</div>
								<CardTitle>Capacity Planning</CardTitle>
								<CardDescription>
									Forecast demand and optimize crew size for maximum
									profitability
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Utilization analytics</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Demand forecasting</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Overtime alerts</span>
									</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Related Features Section */}
			<section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<RelatedContent
					title="Explore Related Features"
					description="Discover how these features work together to power your field service business"
					items={getRelatedFeatures("scheduling", 3)}
					variant="grid"
					showDescription={true}
				/>
			</section>

			{/* CTA Section */}
			<section className="from-primary via-primary to-primary/90 text-primary-foreground bg-gradient-to-br py-20">
				<div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
					<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
						Ready to optimize your dispatch?
					</h2>
					<p className="text-primary-foreground/90 mx-auto mb-8 max-w-2xl text-lg">
						Join service businesses running 35% more jobs per day with Thorbis
						scheduling.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-4">
						<Button
							asChild
							className="bg-background text-foreground hover:bg-background/90 shadow-lg"
							size="lg"
						>
							<Link href="/waitlist">
								Join Waitlist
								<Zap className="ml-2 size-4" />
							</Link>
						</Button>
						<Button
							asChild
							className="border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20"
							size="lg"
							variant="outline"
						>
							<Link href="/demo">Watch Demo</Link>
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}
