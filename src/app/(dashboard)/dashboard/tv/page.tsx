"use client";

/**
 * TV Display Page - Complete Redesign with shadcn/ui
 *
 * Large-format dashboard optimized for wall-mounted TVs
 * - Clean, modern design using shadcn components
 * - High contrast for TV readability
 * - D-pad navigation (arrows, OK, Menu, Back)
 * - Auto-rotating slides
 * - Live weather for company location
 */

import {
	Activity,
	AlertCircle,
	Calendar,
	Clock,
	Cloud,
	CloudDrizzle,
	CloudRain,
	CloudSnow,
	Crown,
	DollarSign,
	Headphones,
	LayoutDashboard,
	Pause,
	Play,
	Star,
	Sun,
	TrendingUp,
	UserCog,
	Users,
	X,
	Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAutoRotation } from "@/components/tv-leaderboard/hooks/use-auto-rotation";
import { useSlideDistribution } from "@/components/tv-leaderboard/hooks/use-slide-distribution";
import { useSlideNavigation } from "@/components/tv-leaderboard/hooks/use-slide-navigation";
import { SlideCarousel } from "@/components/tv-leaderboard/slide-carousel";
import { DEFAULT_SLIDE_SETTINGS } from "@/components/tv-leaderboard/slide-types";
import type { Widget } from "@/components/tv-leaderboard/widget-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { WeatherData } from "@/lib/services/weather-service";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 0,
});

const TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
	hour: "numeric",
	minute: "2-digit",
});

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
	weekday: "long",
	month: "long",
	day: "numeric",
});

type Technician = {
	id: string;
	name: string;
	avatar: string;
	stats: {
		revenue: number;
		revenueChange: number;
		jobsCompleted: number;
		customerRating: number;
	};
};

const mockTechnicians: Technician[] = [
	{
		id: "1",
		name: "John Smith",
		avatar: "JS",
		stats: {
			revenue: 45_280,
			revenueChange: 12.5,
			jobsCompleted: 97,
			customerRating: 4.9,
		},
	},
	{
		id: "2",
		name: "Sarah Johnson",
		avatar: "SJ",
		stats: {
			revenue: 42_150,
			revenueChange: 15.3,
			jobsCompleted: 92,
			customerRating: 4.8,
		},
	},
	{
		id: "3",
		name: "Mike Davis",
		avatar: "MD",
		stats: {
			revenue: 39_800,
			revenueChange: -3.2,
			jobsCompleted: 88,
			customerRating: 4.7,
		},
	},
	{
		id: "4",
		name: "Emily Brown",
		avatar: "EB",
		stats: {
			revenue: 38_200,
			revenueChange: 8.7,
			jobsCompleted: 85,
			customerRating: 4.9,
		},
	},
	{
		id: "5",
		name: "David Wilson",
		avatar: "DW",
		stats: {
			revenue: 36_500,
			revenueChange: -5.8,
			jobsCompleted: 82,
			customerRating: 4.6,
		},
	},
];

const DEFAULT_WIDGETS: Widget[] = [
	{ id: "leaderboard-1", type: "leaderboard", size: "full", position: 0 },
	{ id: "company-goals-1", type: "company-goals", size: "medium", position: 1 },
	{ id: "revenue-chart-1", type: "revenue-chart", size: "medium", position: 2 },
];

const STORAGE_KEY = "tv-leaderboard-widgets";
const WEATHER_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
const WEATHER_API_PATH = "/api/weather";

type TVView = "daily" | "csr" | "manager" | "owner";

export default function TVDisplayPage() {
	const router = useRouter();
	const [now, setNow] = useState(() => new Date());
	const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
	const [showControls, setShowControls] = useState(false);
	const [showViewDialog, setShowViewDialog] = useState(false);
	const [currentView, setCurrentView] = useState<TVView>("daily");
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Load widgets from storage
	useEffect(() => {
		const saved = window.localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length > 0) {
					setWidgets(parsed);
				}
			} catch {
				// Use defaults
			}
		}
	}, []);

	// Fetch weather data
	useEffect(() => {
		let isMounted = true;
		async function fetchWeather() {
			try {
				const response = await fetch(WEATHER_API_PATH, { cache: "no-store" });
				const payload = await response.json();
				if (!response.ok) {
					throw new Error(payload?.error ?? "Request failed");
				}
				if (isMounted) {
					setWeather(payload as WeatherData);
				}
			} catch (_error) {}
		}
		fetchWeather();
		const interval = setInterval(fetchWeather, WEATHER_REFRESH_INTERVAL);
		return () => {
			isMounted = false;
			clearInterval(interval);
		};
	}, []);

	// Update clock
	useEffect(() => {
		const interval = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	// Slide management
	const slides = useSlideDistribution(widgets);
	const { currentSlide, goToSlide, setCurrentSlide } = useSlideNavigation({
		slideCount: slides.length,
		onInteraction: () => {},
	});

	const { isPaused, progress, pauseRotation, resumeRotation, handleInteraction, isManuallyPaused } = useAutoRotation({
		slideCount: slides.length,
		currentSlide,
		onSlideChange: setCurrentSlide,
		settings: DEFAULT_SLIDE_SETTINGS,
		isEditMode: false,
	});

	const widgetData = useMemo(
		() => ({
			technicians: mockTechnicians,
			companyGoals: {
				monthlyRevenue: 500_000,
				currentRevenue: 387_450,
				avgTicketGoal: 475,
				currentAvgTicket: 454,
				customerRatingGoal: 4.8,
				currentRating: 4.78,
			},
			topPerformer: {
				name: mockTechnicians[0].name,
				avatar: mockTechnicians[0].avatar,
				revenue: mockTechnicians[0].stats.revenue,
				revenueChange: mockTechnicians[0].stats.revenueChange,
				jobsCompleted: mockTechnicians[0].stats.jobsCompleted,
				customerRating: mockTechnicians[0].stats.customerRating,
			},
			revenueTrend: {
				trend: [
					{ day: "Mon", revenue: 8200 },
					{ day: "Tue", revenue: 9500 },
					{ day: "Wed", revenue: 7800 },
					{ day: "Thu", revenue: 10_200 },
					{ day: "Fri", revenue: 11_500 },
					{ day: "Sat", revenue: 9800 },
					{ day: "Sun", revenue: 8300 },
				],
			},
			jobsCompleted: {
				total: mockTechnicians.reduce((sum, tech) => sum + tech.stats.jobsCompleted, 0),
				change: 8.5,
			},
			avgTicket: {
				value: Math.round(
					mockTechnicians.reduce((sum, tech) => sum + tech.stats.revenue, 0) /
						mockTechnicians.reduce((sum, tech) => sum + tech.stats.jobsCompleted, 0)
				),
				change: 4.2,
			},
			customerRating: {
				rating:
					Math.round(
						(mockTechnicians.reduce((sum, tech) => sum + tech.stats.customerRating, 0) / mockTechnicians.length) * 10
					) / 10,
				change: 2.1,
			},
			dailyStats: { revenue: 12_500, jobs: 28, avgTicket: 446, rating: 4.8 },
			weeklyStats: { revenue: 65_300, jobs: 142, avgTicket: 460, rating: 4.8 },
			monthlyStats: {
				revenue: 387_450,
				jobs: 444,
				avgTicket: 872,
				rating: 4.78,
			},
		}),
		[]
	);

	const goalProgress = (widgetData.companyGoals.currentRevenue / widgetData.companyGoals.monthlyRevenue) * 100;

	// Render sidebar content based on current view
	const renderSidebarContent = () => {
		switch (currentView) {
			case "csr":
				return (
					<>
						{/* Call Stats */}
						<Card className="shrink-0">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="font-medium text-sm">Calls Today</CardTitle>
								<Headphones className="size-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="font-bold text-2xl">{csrData.callsToday}</div>
								<p className="text-muted-foreground text-xs">
									{csrData.callsAnswered} answered, {csrData.missedCalls} missed
								</p>
							</CardContent>
						</Card>

						<div className="grid shrink-0 grid-cols-2 gap-2">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">Wait Time</CardTitle>
									<Clock className="size-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">{csrData.avgWaitTime}</div>
									<p className="text-muted-foreground text-xs">Average</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">Call Time</CardTitle>
									<Clock className="size-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">{csrData.avgCallDuration}</div>
									<p className="text-muted-foreground text-xs">Average</p>
								</CardContent>
							</Card>
						</div>

						<Card className="flex min-h-0 flex-1 flex-col">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="font-medium text-sm">Top Issues</CardTitle>
								<AlertCircle className="size-4 text-muted-foreground" />
							</CardHeader>
							<CardContent className="min-h-0 flex-1">
								<div className="space-y-2">
									{csrData.topIssues.map((item) => (
										<div className="flex items-center justify-between rounded bg-muted p-2" key={item.issue}>
											<span className="font-medium text-sm">{item.issue}</span>
											<Badge variant="secondary">{item.count}</Badge>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</>
				);

			case "manager":
				return (
					<>
						<Card className="shrink-0">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="font-medium text-sm">Team Status</CardTitle>
								<Users className="size-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="font-bold text-2xl">{managerData.techsOnDuty}</div>
								<p className="text-muted-foreground text-xs">{managerData.techsAvailable} available now</p>
							</CardContent>
						</Card>

						<div className="grid shrink-0 grid-cols-2 gap-2">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">Scheduled</CardTitle>
									<Calendar className="size-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">{managerData.scheduledJobs}</div>
									<p className="text-muted-foreground text-xs">Jobs today</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">Completed</CardTitle>
									<Zap className="size-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">{managerData.completedJobs}</div>
									<p className="text-muted-foreground text-xs">So far</p>
								</CardContent>
							</Card>
						</div>

						<Card className="flex min-h-0 flex-1 flex-col">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="font-medium text-sm">Alerts</CardTitle>
								<AlertCircle className="size-4 text-muted-foreground" />
							</CardHeader>
							<CardContent className="min-h-0 flex-1">
								<div className="space-y-2">
									{managerData.runningLate > 0 && (
										<div className="flex items-center justify-between rounded border border-destructive/20 bg-destructive/10 p-2">
											<span className="font-medium text-sm">Running Late</span>
											<Badge variant="destructive">{managerData.runningLate}</Badge>
										</div>
									)}
									{managerData.materialsNeeded > 0 && (
										<div className="flex items-center justify-between rounded border border-warning/20 bg-warning/10 p-2">
											<span className="font-medium text-sm">Materials Needed</span>
											<Badge className="bg-warning text-white">{managerData.materialsNeeded}</Badge>
										</div>
									)}
									{managerData.vehicleIssues > 0 && (
										<div className="flex items-center justify-between rounded border border-warning/20 bg-warning/10 p-2">
											<span className="font-medium text-sm">Vehicle Issues</span>
											<Badge className="bg-warning text-white">{managerData.vehicleIssues}</Badge>
										</div>
									)}
									{managerData.trainingDue > 0 && (
										<div className="flex items-center justify-between rounded bg-muted p-2">
											<span className="font-medium text-sm">Training Due</span>
											<Badge variant="secondary">{managerData.trainingDue}</Badge>
										</div>
									)}
									<div className="flex items-center justify-between rounded border border-success/20 bg-success/10 p-2">
										<span className="font-medium text-sm">Team Efficiency</span>
										<Badge className="bg-success text-white">{managerData.teamEfficiency}%</Badge>
									</div>
								</div>
							</CardContent>
						</Card>
					</>
				);

			case "owner":
				return (
					<>
						<Card className="shrink-0">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="font-medium text-sm">Monthly Profit</CardTitle>
								<DollarSign className="size-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="font-bold text-2xl">{CURRENCY_FORMATTER.format(ownerData.monthlyProfit)}</div>
								<p className="text-muted-foreground text-xs">{ownerData.profitMargin}% margin</p>
							</CardContent>
						</Card>

						<div className="grid shrink-0 grid-cols-2 gap-2">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">Cash Flow</CardTitle>
									<TrendingUp className="size-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">{CURRENCY_FORMATTER.format(ownerData.cashFlow)}</div>
									<p className="text-muted-foreground text-xs">Available</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">AR Aging</CardTitle>
									<AlertCircle className="size-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">{CURRENCY_FORMATTER.format(ownerData.arAging)}</div>
									<p className="text-muted-foreground text-xs">Outstanding</p>
								</CardContent>
							</Card>
						</div>

						<Card className="flex min-h-0 flex-1 flex-col">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="font-medium text-sm">Expenses</CardTitle>
								<DollarSign className="size-4 text-muted-foreground" />
							</CardHeader>
							<CardContent className="min-h-0 flex-1">
								<div className="space-y-2">
									<div className="flex items-center justify-between rounded bg-muted p-2">
										<span className="font-medium text-sm">Payroll</span>
										<span className="font-bold text-sm">{CURRENCY_FORMATTER.format(ownerData.payrollCosts)}</span>
									</div>
									<div className="flex items-center justify-between rounded bg-muted p-2">
										<span className="font-medium text-sm">Materials</span>
										<span className="font-bold text-sm">{CURRENCY_FORMATTER.format(ownerData.materialCosts)}</span>
									</div>
									<div className="flex items-center justify-between rounded bg-muted p-2">
										<span className="font-medium text-sm">Overhead</span>
										<span className="font-bold text-sm">{CURRENCY_FORMATTER.format(ownerData.overhead)}</span>
									</div>
									<Separator />
									<div className="flex items-center justify-between rounded border border-primary/20 bg-primary/10 p-2">
										<span className="font-bold text-sm">New Customers</span>
										<Badge className="bg-primary text-primary-foreground">{ownerData.newCustomers}</Badge>
									</div>
									<div className="flex items-center justify-between rounded border border-success/20 bg-success/10 p-2">
										<span className="font-bold text-sm">Retention Rate</span>
										<Badge className="bg-success text-white">{ownerData.customerRetention}%</Badge>
									</div>
								</div>
							</CardContent>
						</Card>
					</>
				);

			default: // daily view
				return (
					<>
						<Card className="shrink-0">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="font-medium text-sm">MTD Revenue</CardTitle>
								<DollarSign className="size-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="font-bold text-2xl">
									{CURRENCY_FORMATTER.format(widgetData.companyGoals.currentRevenue)}
								</div>
								<div className="mt-2 flex items-center justify-between">
									<p className="text-muted-foreground text-xs">
										Goal: {CURRENCY_FORMATTER.format(widgetData.companyGoals.monthlyRevenue)}
									</p>
									<Badge className="font-bold text-xs" variant="secondary">
										{goalProgress.toFixed(0)}%
									</Badge>
								</div>
								<Progress className="mt-2 h-2" value={goalProgress} />
							</CardContent>
						</Card>

						<div className="grid shrink-0 grid-cols-2 gap-2">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">Jobs</CardTitle>
									<Zap className="size-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">{NUMBER_FORMATTER.format(widgetData.jobsCompleted.total)}</div>
									<p className="text-muted-foreground text-xs">+{widgetData.jobsCompleted.change}% from last period</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">Rating</CardTitle>
									<Star className="size-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">{widgetData.customerRating.rating}</div>
									<p className="text-muted-foreground text-xs">+{widgetData.customerRating.change}% from last period</p>
								</CardContent>
							</Card>
						</div>

						<Card className="flex min-h-0 flex-1 flex-col">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="font-medium text-sm">Company Goals</CardTitle>
								<Activity className="size-4 text-muted-foreground" />
							</CardHeader>
							<CardContent className="flex min-h-0 flex-1 flex-col">
								<div className="space-y-4">
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="font-medium text-muted-foreground text-xs">Monthly Revenue</span>
											<span className="font-bold text-foreground text-xs">{goalProgress.toFixed(0)}%</span>
										</div>
										<Progress className="h-2" value={goalProgress} />
										<div className="text-[10px] text-muted-foreground">
											{CURRENCY_FORMATTER.format(widgetData.companyGoals.currentRevenue)} /{" "}
											{CURRENCY_FORMATTER.format(widgetData.companyGoals.monthlyRevenue)}
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="font-medium text-muted-foreground text-xs">Avg Ticket</span>
											<span className="font-bold text-foreground text-xs">
												{(
													(widgetData.companyGoals.currentAvgTicket / widgetData.companyGoals.avgTicketGoal) *
													100
												).toFixed(0)}
												%
											</span>
										</div>
										<Progress
											className="h-2"
											value={(widgetData.companyGoals.currentAvgTicket / widgetData.companyGoals.avgTicketGoal) * 100}
										/>
										<div className="text-[10px] text-muted-foreground">
											{CURRENCY_FORMATTER.format(widgetData.companyGoals.currentAvgTicket)} /{" "}
											{CURRENCY_FORMATTER.format(widgetData.companyGoals.avgTicketGoal)}
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="font-medium text-muted-foreground text-xs">Customer Rating</span>
											<span className="font-bold text-foreground text-xs">
												{(
													(widgetData.companyGoals.currentRating / widgetData.companyGoals.customerRatingGoal) *
													100
												).toFixed(0)}
												%
											</span>
										</div>
										<Progress
											className="h-2"
											value={(widgetData.companyGoals.currentRating / widgetData.companyGoals.customerRatingGoal) * 100}
										/>
										<div className="text-[10px] text-muted-foreground">
											{widgetData.companyGoals.currentRating.toFixed(2)} /{" "}
											{widgetData.companyGoals.customerRatingGoal.toFixed(1)}
										</div>
									</div>

									<div className="grid grid-cols-3 gap-2 pt-2">
										<div className="space-y-1">
											<div className="font-medium text-[10px] text-muted-foreground">Daily</div>
											<div className="font-bold text-foreground text-sm">
												{CURRENCY_FORMATTER.format(widgetData.dailyStats.revenue)}
											</div>
											<div className="text-[10px] text-muted-foreground">{widgetData.dailyStats.jobs} jobs</div>
										</div>
										<div className="space-y-1">
											<div className="font-medium text-[10px] text-muted-foreground">Weekly</div>
											<div className="font-bold text-foreground text-sm">
												{CURRENCY_FORMATTER.format(widgetData.weeklyStats.revenue)}
											</div>
											<div className="text-[10px] text-muted-foreground">{widgetData.weeklyStats.jobs} jobs</div>
										</div>
										<div className="space-y-1">
											<div className="font-medium text-[10px] text-muted-foreground">Monthly</div>
											<div className="font-bold text-foreground text-sm">
												{CURRENCY_FORMATTER.format(widgetData.monthlyStats.revenue)}
											</div>
											<div className="text-[10px] text-muted-foreground">{widgetData.monthlyStats.jobs} jobs</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</>
				);
		}
	};

	// CSR-specific data
	const csrData = useMemo(
		() => ({
			callsToday: 47,
			callsAnswered: 43,
			avgWaitTime: "1m 23s",
			avgCallDuration: "4m 12s",
			customerSatisfaction: 4.7,
			missedCalls: 4,
			callbacksScheduled: 12,
			topIssues: [
				{ issue: "Scheduling", count: 18 },
				{ issue: "Billing", count: 12 },
				{ issue: "Service Questions", count: 9 },
				{ issue: "Emergencies", count: 8 },
			],
		}),
		[]
	);

	// Manager-specific data
	const managerData = useMemo(
		() => ({
			techsOnDuty: 12,
			techsAvailable: 5,
			scheduledJobs: 28,
			completedJobs: 19,
			runningLate: 3,
			teamEfficiency: 87,
			avgJobTime: "2h 15m",
			materialsNeeded: 4,
			vehicleIssues: 1,
			trainingDue: 2,
		}),
		[]
	);

	// Owner-specific data
	const ownerData = useMemo(
		() => ({
			monthlyProfit: 127_450,
			profitMargin: 32.9,
			cashFlow: 245_800,
			arAging: 67_200,
			payrollCosts: 156_000,
			materialCosts: 89_500,
			overhead: 42_300,
			newCustomers: 23,
			customerRetention: 94.5,
			marketingROI: 4.2,
		}),
		[]
	);

	const showControlsOverlay = useCallback(() => {
		setShowControls(true);
		if (controlsTimerRef.current) {
			clearTimeout(controlsTimerRef.current);
		}
		controlsTimerRef.current = setTimeout(() => {
			setShowControls(false);
		}, 5000);
	}, []);

	const togglePause = useCallback(() => {
		if (isManuallyPaused) {
			resumeRotation();
		} else {
			pauseRotation({ manual: true });
		}
		handleInteraction();
		showControlsOverlay();
	}, [isManuallyPaused, pauseRotation, resumeRotation, handleInteraction, showControlsOverlay]);

	const goToNextSlide = useCallback(() => {
		const next = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
		goToSlide(next);
		handleInteraction();
		showControlsOverlay();
	}, [currentSlide, slides.length, goToSlide, handleInteraction, showControlsOverlay]);

	const goToPrevSlide = useCallback(() => {
		const prev = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
		goToSlide(prev);
		handleInteraction();
		showControlsOverlay();
	}, [currentSlide, slides.length, goToSlide, handleInteraction, showControlsOverlay]);

	// Keyboard navigation
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			// ESC opens view dialog
			if (event.key === "Escape") {
				event.preventDefault();
				setShowViewDialog(true);
				return;
			}

			// Back button exits to dashboard
			if (event.key === "Backspace" || event.key === "BrowserBack") {
				event.preventDefault();
				router.push("/dashboard");
				return;
			}

			if (
				event.key === "ContextMenu" ||
				event.key === "Menu" ||
				event.key === "SoftRight" ||
				event.key === "s" ||
				event.key === "S"
			) {
				event.preventDefault();
				router.push("/dashboard/settings/tv");
				return;
			}

			if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
				event.preventDefault();
				goToPrevSlide();
				return;
			}

			if (event.key === "ArrowRight" || event.key === "ArrowDown") {
				event.preventDefault();
				goToNextSlide();
				return;
			}

			if (event.key === "Enter" || event.key === "MediaPlayPause" || event.key === " ") {
				event.preventDefault();
				togglePause();
				return;
			}

			// Any other key shows controls
			if (!event.key.startsWith("F") && event.key !== "Tab") {
				showControlsOverlay();
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [router, goToNextSlide, goToPrevSlide, togglePause, showControlsOverlay]);

	return (
		<div className="fixed inset-0 overflow-hidden bg-background">
			<div className="flex h-full flex-col gap-3 p-3">
				{/* Header */}
				<header className="flex shrink-0 items-center justify-between rounded-lg border bg-card px-4 py-2">
					<div className="flex items-center gap-3">
						<div className="flex size-10 items-center justify-center rounded-lg bg-primary">
							{currentView === "daily" && <LayoutDashboard className="size-6 text-primary-foreground" />}
							{currentView === "csr" && <Headphones className="size-6 text-primary-foreground" />}
							{currentView === "manager" && <UserCog className="size-6 text-primary-foreground" />}
							{currentView === "owner" && <Crown className="size-6 text-primary-foreground" />}
						</div>
						<div>
							<Badge className="bg-primary px-2 py-0.5 font-bold text-[10px] text-primary-foreground">
								{currentView === "daily" && "DAILY OVERVIEW"}
								{currentView === "csr" && "CSR VIEW"}
								{currentView === "manager" && "MANAGER VIEW"}
								{currentView === "owner" && "OWNER VIEW"}
							</Badge>
							<h1 className="font-bold text-foreground text-xl">Live Performance Board</h1>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Card>
							<CardContent className="flex items-center gap-3 p-3">
								<Clock className="size-5 text-muted-foreground" />
								<div>
									<div className="font-bold text-foreground text-xl tabular-nums">{TIME_FORMATTER.format(now)}</div>
									<div className="text-muted-foreground text-xs">{DATE_FORMATTER.format(now)}</div>
								</div>
							</CardContent>
						</Card>

						{weather?.hourly?.periods && weather.hourly.periods.length > 0 && (
							<Card>
								<CardContent className="flex items-center gap-3 p-3">
									{weather.hourly.periods.slice(0, 4).map((period) => {
										const hour = new Date(period.startTime).getHours();
										const temp = period.temperature;
										const shortForecast = period.shortForecast.toLowerCase();

										// Determine weather icon
										let WeatherIcon = Sun;
										if (shortForecast.includes("rain") || shortForecast.includes("shower")) {
											WeatherIcon = CloudRain;
										} else if (shortForecast.includes("snow")) {
											WeatherIcon = CloudSnow;
										} else if (shortForecast.includes("drizzle")) {
											WeatherIcon = CloudDrizzle;
										} else if (shortForecast.includes("cloud") || shortForecast.includes("overcast")) {
											WeatherIcon = Cloud;
										}

										return (
											<div className="flex flex-col items-center gap-0.5" key={period.startTime}>
												<div className="font-medium text-[10px] text-muted-foreground">
													{hour === 0 ? "12AM" : hour < 12 ? `${hour}AM` : hour === 12 ? "12PM" : `${hour - 12}PM`}
												</div>
												<WeatherIcon className="size-4 text-muted-foreground" />
												<div className="font-bold text-foreground text-xs">{temp}°</div>
											</div>
										);
									})}
								</CardContent>
							</Card>
						)}
					</div>
				</header>

				{/* Main Content */}
				<div className="flex min-h-0 flex-1 gap-3">
					{/* Left Sidebar - Dynamic based on view */}
					<aside className="flex w-[320px] shrink-0 flex-col gap-3">{renderSidebarContent()}</aside>

					{/* Main Content Area */}
					<main className="flex min-h-0 flex-1 flex-col gap-3">
						{/* Rotation Widget Area */}
						<Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<div className="flex items-center gap-2">
									<CardTitle className="font-medium text-sm">
										Slide {currentSlide + 1} / {Math.max(slides.length, 1)}
									</CardTitle>
									<span className="text-muted-foreground text-xs">
										Auto-rotates every {DEFAULT_SLIDE_SETTINGS.rotationInterval / 1000}s
									</span>
								</div>
								<Badge className="gap-1.5" variant={isManuallyPaused ? "destructive" : "secondary"}>
									{isManuallyPaused ? (
										<>
											<Pause className="size-3" />
											Paused
										</>
									) : (
										<>
											<Play className="size-3 fill-current" />
											Auto Rotate
										</>
									)}
								</Badge>
							</CardHeader>
							<CardContent className="min-h-0 flex-1 overflow-hidden p-0">
								<SlideCarousel
									currentSlide={currentSlide}
									data={widgetData}
									isEditMode={false}
									onSlideChange={setCurrentSlide}
									onWidgetsChange={() => {}}
									slides={slides}
								/>
							</CardContent>
						</Card>

						{/* Bottom Stats Bar */}
						<div className="grid shrink-0 grid-cols-4 gap-3">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">Today</CardTitle>
									<Calendar className="size-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">{CURRENCY_FORMATTER.format(widgetData.dailyStats.revenue)}</div>
									<p className="text-muted-foreground text-xs">{widgetData.dailyStats.jobs} jobs completed</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">This Week</CardTitle>
									<TrendingUp className="size-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">{CURRENCY_FORMATTER.format(widgetData.weeklyStats.revenue)}</div>
									<p className="text-muted-foreground text-xs">{widgetData.weeklyStats.jobs} jobs completed</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">Avg Ticket</CardTitle>
									<DollarSign className="size-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">{CURRENCY_FORMATTER.format(widgetData.avgTicket.value)}</div>
									<p className="text-muted-foreground text-xs">+{widgetData.avgTicket.change}% from last period</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">Active Jobs</CardTitle>
									<AlertCircle className="size-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">17</div>
									<p className="text-muted-foreground text-xs">In progress</p>
								</CardContent>
							</Card>
						</div>
					</main>
				</div>

				{/* Controls Overlay */}
				{showControls && (
					<div className="-translate-x-1/2 fade-in slide-in-from-bottom-2 pointer-events-none fixed bottom-4 left-1/2 animate-in duration-300">
						<Card className="pointer-events-auto">
							<CardContent className="p-3">
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-2">
										<Badge className="bg-secondary px-2 py-1 font-mono text-secondary-foreground" variant="outline">
											← →
										</Badge>
										<span className="font-medium text-foreground text-sm">Navigate</span>
									</div>
									<Separator className="h-6" orientation="vertical" />
									<div className="flex items-center gap-2">
										<Badge className="bg-secondary px-2 py-1 font-mono text-secondary-foreground" variant="outline">
											OK
										</Badge>
										<span className="font-medium text-foreground text-sm">Pause</span>
									</div>
									<Separator className="h-6" orientation="vertical" />
									<div className="flex items-center gap-2">
										<Badge className="bg-secondary px-2 py-1 font-mono text-secondary-foreground" variant="outline">
											Menu
										</Badge>
										<span className="font-medium text-foreground text-sm">Settings</span>
									</div>
									<Separator className="h-6" orientation="vertical" />
									<div className="flex items-center gap-2">
										<Badge className="bg-secondary px-2 py-1 font-mono text-secondary-foreground" variant="outline">
											Back
										</Badge>
										<span className="font-medium text-foreground text-sm">Exit</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Progress Indicator */}
				{!isManuallyPaused && (
					<div className="pointer-events-none fixed right-4 bottom-4">
						<div className="relative size-12">
							<svg className="-rotate-90 size-full">
								<circle
									className="text-border"
									cx="24"
									cy="24"
									fill="none"
									r="20"
									stroke="currentColor"
									strokeWidth="3"
								/>
								<circle
									className="text-primary transition-all duration-100"
									cx="24"
									cy="24"
									fill="none"
									r="20"
									stroke="currentColor"
									strokeDasharray={`${2 * Math.PI * 20}`}
									strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
									strokeLinecap="round"
									strokeWidth="3"
								/>
							</svg>
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="size-2 rounded-full bg-primary" />
							</div>
						</div>
					</div>
				)}

				{/* View Selection Dialog */}
				<Dialog onOpenChange={setShowViewDialog} open={showViewDialog}>
					<DialogContent className="sm:max-w-2xl">
						<DialogHeader>
							<DialogTitle className="font-bold text-2xl">TV Display Views</DialogTitle>
							<DialogDescription>Select a view optimized for different roles or exit to dashboard</DialogDescription>
						</DialogHeader>
						<div className="grid grid-cols-2 gap-4 py-4">
							{/* Daily Overview */}
							<Button
								className="h-auto flex-col gap-3 p-6"
								onClick={() => {
									setCurrentView("daily");
									setShowViewDialog(false);
								}}
								variant={currentView === "daily" ? "default" : "outline"}
							>
								<LayoutDashboard className="size-8" />
								<div className="text-center">
									<div className="font-bold text-lg">Daily Overview</div>
									<div className="mt-1 text-muted-foreground text-xs">General performance metrics for all staff</div>
								</div>
							</Button>

							{/* CSR View */}
							<Button
								className="h-auto flex-col gap-3 p-6"
								onClick={() => {
									setCurrentView("csr");
									setShowViewDialog(false);
								}}
								variant={currentView === "csr" ? "default" : "outline"}
							>
								<Headphones className="size-8" />
								<div className="text-center">
									<div className="font-bold text-lg">CSR View</div>
									<div className="mt-1 text-muted-foreground text-xs">Call metrics, customer service stats</div>
								</div>
							</Button>

							{/* Manager View */}
							<Button
								className="h-auto flex-col gap-3 p-6"
								onClick={() => {
									setCurrentView("manager");
									setShowViewDialog(false);
								}}
								variant={currentView === "manager" ? "default" : "outline"}
							>
								<UserCog className="size-8" />
								<div className="text-center">
									<div className="font-bold text-lg">Manager View</div>
									<div className="mt-1 text-muted-foreground text-xs">Team performance, scheduling, operations</div>
								</div>
							</Button>

							{/* Owner View */}
							<Button
								className="h-auto flex-col gap-3 p-6"
								onClick={() => {
									setCurrentView("owner");
									setShowViewDialog(false);
								}}
								variant={currentView === "owner" ? "default" : "outline"}
							>
								<Crown className="size-8" />
								<div className="text-center">
									<div className="font-bold text-lg">Owner View</div>
									<div className="mt-1 text-muted-foreground text-xs">Financial overview, KPIs, growth metrics</div>
								</div>
							</Button>
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<Button onClick={() => setShowViewDialog(false)} variant="ghost">
								Cancel
							</Button>
							<Button onClick={() => router.push("/dashboard")} variant="destructive">
								<X className="mr-2 size-4" />
								Exit TV Display
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
