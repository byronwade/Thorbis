"use client";

/**
 * Operations Step - Consolidated schedule, reports, and settings
 *
 * This step handles all operational setup in one place:
 * - Section 1: Business Hours (schedule)
 * - Section 2: Dashboard & Reports
 * - Section 3: Key Settings
 */

import {
	AlertTriangle,
	ArrowRight,
	BarChart3,
	Calendar,
	CalendarCheck,
	Check,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Clock,
	DollarSign,
	FileText,
	Mail,
	Moon,
	Percent,
	Settings,
	SkipForward,
	Star,
	Target,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { cn } from "@/lib/utils";

type SectionId = "schedule" | "reports" | "settings";

interface SectionState {
	expanded: boolean;
	completed: boolean;
}

const DAYS_OF_WEEK = [
	{ id: "monday", label: "Mon" },
	{ id: "tuesday", label: "Tue" },
	{ id: "wednesday", label: "Wed" },
	{ id: "thursday", label: "Thu" },
	{ id: "friday", label: "Fri" },
	{ id: "saturday", label: "Sat" },
	{ id: "sunday", label: "Sun" },
];

const TIME_SLOTS = [
	"06:00", "07:00", "08:00", "09:00", "10:00",
	"11:00", "12:00", "13:00", "14:00", "15:00",
	"16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
];

const BUFFER_OPTIONS = [
	{ value: "0", label: "No buffer" },
	{ value: "15", label: "15 min" },
	{ value: "30", label: "30 min" },
	{ value: "60", label: "1 hour" },
];

const DASHBOARD_WIDGETS = [
	{ id: "revenue", title: "Revenue", icon: DollarSign },
	{ id: "jobs_today", title: "Today's Jobs", icon: Calendar },
	{ id: "outstanding_invoices", title: "Invoices Due", icon: FileText },
	{ id: "customer_satisfaction", title: "Satisfaction", icon: Star },
];

const PAYMENT_TERMS = [
	{ value: "0", label: "Due on receipt" },
	{ value: "15", label: "Net 15" },
	{ value: "30", label: "Net 30" },
];

interface DaySchedule {
	enabled: boolean;
	start: string;
	end: string;
}

type WeekSchedule = Record<string, DaySchedule>;

const DEFAULT_SCHEDULE: WeekSchedule = {
	monday: { enabled: true, start: "08:00", end: "17:00" },
	tuesday: { enabled: true, start: "08:00", end: "17:00" },
	wednesday: { enabled: true, start: "08:00", end: "17:00" },
	thursday: { enabled: true, start: "08:00", end: "17:00" },
	friday: { enabled: true, start: "08:00", end: "17:00" },
	saturday: { enabled: false, start: "09:00", end: "14:00" },
	sunday: { enabled: false, start: "09:00", end: "14:00" },
};

export function OperationsStep() {
	const { data, updateData } = useOnboardingStore();

	// Track which sections are expanded
	const [sections, setSections] = useState<Record<SectionId, SectionState>>({
		schedule: {
			expanded: true,
			completed: !!data.businessHours,
		},
		reports: {
			expanded: false,
			completed: (data.dashboardWidgets?.length || 0) > 0,
		},
		settings: {
			expanded: false,
			completed: !!data.taxRate || !!data.paymentTerms,
		},
	});

	// Schedule state
	const [schedule, setSchedule] = useState<WeekSchedule>(
		data.businessHours || DEFAULT_SCHEDULE
	);
	const [bufferTime, setBufferTime] = useState(data.bufferTime || "15");
	const [emergencyService, setEmergencyService] = useState(
		data.emergencyService || false
	);

	// Reports state
	const [selectedWidgets, setSelectedWidgets] = useState<string[]>(
		data.dashboardWidgets || ["revenue", "jobs_today", "outstanding_invoices"]
	);
	const [dailySummary, setDailySummary] = useState(
		data.scheduledReports?.includes("daily_summary") ?? true
	);

	// Settings state
	const [taxRate, setTaxRate] = useState(data.taxRate || "");
	const [paymentTerms, setPaymentTerms] = useState(data.paymentTerms || "30");
	const [onlineBooking, setOnlineBooking] = useState(
		data.onlineBookingEnabled || false
	);
	const [autoReminders, setAutoReminders] = useState(
		data.autoReminders !== false
	);

	const toggleSection = (id: SectionId) => {
		setSections((prev) => ({
			...prev,
			[id]: { ...prev[id], expanded: !prev[id].expanded },
		}));
	};

	const markSectionComplete = (id: SectionId) => {
		setSections((prev) => ({
			...prev,
			[id]: { ...prev[id], completed: true, expanded: false },
		}));
		// Auto-expand next section
		const order: SectionId[] = ["schedule", "reports", "settings"];
		const currentIndex = order.indexOf(id);
		if (currentIndex < order.length - 1) {
			const nextSection = order[currentIndex + 1];
			setSections((prev) => ({
				...prev,
				[nextSection]: { ...prev[nextSection], expanded: true },
			}));
		}
	};

	// Schedule helpers
	const updateDaySchedule = (day: string, updates: Partial<DaySchedule>) => {
		const updated = {
			...schedule,
			[day]: { ...schedule[day], ...updates },
		};
		setSchedule(updated);
		updateData({ businessHours: updated });
	};

	const formatTime = (time: string) => {
		const [hours] = time.split(":");
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? "PM" : "AM";
		const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
		return `${displayHour}${ampm}`;
	};

	// Reports helpers
	const toggleWidget = (widgetId: string) => {
		const updated = selectedWidgets.includes(widgetId)
			? selectedWidgets.filter((w) => w !== widgetId)
			: [...selectedWidgets, widgetId];
		setSelectedWidgets(updated);
		updateData({ dashboardWidgets: updated });
	};

	// Settings helpers
	const handleTaxRateChange = (value: string) => {
		setTaxRate(value);
		updateData({ taxRate: value });
	};

	const handlePaymentTermsChange = (value: string) => {
		setPaymentTerms(value);
		updateData({ paymentTerms: value });
	};

	const handleOnlineBookingChange = (enabled: boolean) => {
		setOnlineBooking(enabled);
		updateData({ onlineBookingEnabled: enabled });
	};

	const handleAutoRemindersChange = (enabled: boolean) => {
		setAutoReminders(enabled);
		updateData({ autoReminders: enabled });
	};

	const completedCount = Object.values(sections).filter((s) => s.completed).length;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Operations Setup</h2>
				<p className="text-muted-foreground">
					Configure your schedule, reports, and key settings. You can always
					change these later.
				</p>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<CheckCircle2 className="h-4 w-4 text-green-500" />
					<span>{completedCount} of 3 sections complete</span>
				</div>
			</div>

			{/* Section 1: Schedule */}
			<Card
				className={cn(
					sections.schedule.completed && "border-green-200 bg-green-50/50"
				)}
			>
				<CardHeader
					className="cursor-pointer"
					onClick={() => toggleSection("schedule")}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div
								className={cn(
									"p-2 rounded-lg",
									sections.schedule.completed
										? "bg-green-100 text-green-600"
										: "bg-muted text-muted-foreground"
								)}
							>
								<Clock className="h-5 w-5" />
							</div>
							<div>
								<CardTitle className="text-lg flex items-center gap-2">
									Business Hours
									{sections.schedule.completed && (
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-700"
										>
											Done
										</Badge>
									)}
								</CardTitle>
								<CardDescription>When you're available</CardDescription>
							</div>
						</div>
						{sections.schedule.expanded ? (
							<ChevronUp className="h-5 w-5 text-muted-foreground" />
						) : (
							<ChevronDown className="h-5 w-5 text-muted-foreground" />
						)}
					</div>
				</CardHeader>
				{sections.schedule.expanded && (
					<CardContent className="space-y-4 pt-0">
						{/* Days Grid */}
						<div className="space-y-2">
							{DAYS_OF_WEEK.map((day) => {
								const daySchedule = schedule[day.id];
								return (
									<div
										key={day.id}
										className={cn(
											"flex items-center gap-3 rounded-lg p-2",
											daySchedule?.enabled ? "bg-muted/40" : "bg-muted/20"
										)}
									>
										<Switch
											checked={daySchedule?.enabled}
											onCheckedChange={(v) =>
												updateDaySchedule(day.id, { enabled: v })
											}
										/>
										<span
											className={cn(
												"w-10 text-sm font-medium",
												!daySchedule?.enabled && "text-muted-foreground"
											)}
										>
											{day.label}
										</span>

										{daySchedule?.enabled ? (
											<div className="flex items-center gap-2 flex-1">
												<Select
													value={daySchedule.start}
													onValueChange={(v) =>
														updateDaySchedule(day.id, { start: v })
													}
												>
													<SelectTrigger className="w-[80px] h-8">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{TIME_SLOTS.map((time) => (
															<SelectItem key={time} value={time}>
																{formatTime(time)}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<span className="text-xs text-muted-foreground">to</span>
												<Select
													value={daySchedule.end}
													onValueChange={(v) =>
														updateDaySchedule(day.id, { end: v })
													}
												>
													<SelectTrigger className="w-[80px] h-8">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{TIME_SLOTS.map((time) => (
															<SelectItem key={time} value={time}>
																{formatTime(time)}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										) : (
											<span className="text-xs text-muted-foreground">
												Closed
											</span>
										)}
									</div>
								);
							})}
						</div>

						{/* Buffer & Emergency */}
						<div className="flex items-center gap-4 pt-2">
							<div className="flex items-center gap-2">
								<span className="text-sm">Buffer:</span>
								<Select
									value={bufferTime}
									onValueChange={(v) => {
										setBufferTime(v);
										updateData({ bufferTime: v });
									}}
								>
									<SelectTrigger className="w-[90px] h-8">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{BUFFER_OPTIONS.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex items-center gap-2">
								<AlertTriangle className="h-4 w-4 text-amber-500" />
								<span className="text-sm">24/7 Emergency</span>
								<Switch
									checked={emergencyService}
									onCheckedChange={(v) => {
										setEmergencyService(v);
										updateData({ emergencyService: v });
									}}
								/>
							</div>
						</div>

						<div className="flex justify-end gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => markSectionComplete("schedule")}
							>
								<SkipForward className="h-4 w-4 mr-1" />
								Use Defaults
							</Button>
							<Button size="sm" onClick={() => markSectionComplete("schedule")}>
								Continue
								<ArrowRight className="h-4 w-4 ml-1" />
							</Button>
						</div>
					</CardContent>
				)}
			</Card>

			{/* Section 2: Reports */}
			<Card
				className={cn(
					sections.reports.completed && "border-green-200 bg-green-50/50"
				)}
			>
				<CardHeader
					className="cursor-pointer"
					onClick={() => toggleSection("reports")}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div
								className={cn(
									"p-2 rounded-lg",
									sections.reports.completed
										? "bg-green-100 text-green-600"
										: "bg-muted text-muted-foreground"
								)}
							>
								<BarChart3 className="h-5 w-5" />
							</div>
							<div>
								<CardTitle className="text-lg flex items-center gap-2">
									Dashboard & Reports
									{sections.reports.completed && (
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-700"
										>
											Done
										</Badge>
									)}
								</CardTitle>
								<CardDescription>What metrics matter to you</CardDescription>
							</div>
						</div>
						{sections.reports.expanded ? (
							<ChevronUp className="h-5 w-5 text-muted-foreground" />
						) : (
							<ChevronDown className="h-5 w-5 text-muted-foreground" />
						)}
					</div>
				</CardHeader>
				{sections.reports.expanded && (
					<CardContent className="space-y-4 pt-0">
						{/* Dashboard Widgets */}
						<div className="grid grid-cols-2 gap-2">
							{DASHBOARD_WIDGETS.map((widget) => {
								const Icon = widget.icon;
								const selected = selectedWidgets.includes(widget.id);
								return (
									<button
										key={widget.id}
										type="button"
										onClick={() => toggleWidget(widget.id)}
										className={cn(
											"flex items-center gap-2 rounded-lg p-3 text-left transition-colors",
											selected ? "bg-primary/10" : "bg-muted/40"
										)}
									>
										<Icon
											className={cn(
												"h-4 w-4 flex-shrink-0",
												selected ? "text-primary" : "text-muted-foreground"
											)}
										/>
										<span className="text-sm font-medium">{widget.title}</span>
										{selected && (
											<Check className="h-3 w-3 text-primary ml-auto" />
										)}
									</button>
								);
							})}
						</div>

						{/* Daily Summary Email */}
						<div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
							<div className="flex items-center gap-2">
								<Mail className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">Daily summary email</span>
							</div>
							<Switch
								checked={dailySummary}
								onCheckedChange={(v) => {
									setDailySummary(v);
									const reports = v ? ["daily_summary"] : [];
									updateData({ scheduledReports: reports });
								}}
							/>
						</div>

						<div className="flex justify-end gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => markSectionComplete("reports")}
							>
								<SkipForward className="h-4 w-4 mr-1" />
								Use Defaults
							</Button>
							<Button size="sm" onClick={() => markSectionComplete("reports")}>
								Continue
								<ArrowRight className="h-4 w-4 ml-1" />
							</Button>
						</div>
					</CardContent>
				)}
			</Card>

			{/* Section 3: Settings */}
			<Card
				className={cn(
					sections.settings.completed && "border-green-200 bg-green-50/50"
				)}
			>
				<CardHeader
					className="cursor-pointer"
					onClick={() => toggleSection("settings")}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div
								className={cn(
									"p-2 rounded-lg",
									sections.settings.completed
										? "bg-green-100 text-green-600"
										: "bg-muted text-muted-foreground"
								)}
							>
								<Settings className="h-5 w-5" />
							</div>
							<div>
								<CardTitle className="text-lg flex items-center gap-2">
									Key Settings
									{sections.settings.completed && (
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-700"
										>
											Done
										</Badge>
									)}
								</CardTitle>
								<CardDescription>
									Tax, payment terms & preferences
								</CardDescription>
							</div>
						</div>
						{sections.settings.expanded ? (
							<ChevronUp className="h-5 w-5 text-muted-foreground" />
						) : (
							<ChevronDown className="h-5 w-5 text-muted-foreground" />
						)}
					</div>
				</CardHeader>
				{sections.settings.expanded && (
					<CardContent className="space-y-4 pt-0">
						{/* Tax Rate */}
						<div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
							<div className="flex items-center gap-2">
								<Percent className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">Tax Rate</span>
							</div>
							<div className="flex items-center gap-2">
								<Input
									type="number"
									step="0.01"
									min="0"
									max="100"
									placeholder="8.25"
									value={taxRate}
									onChange={(e) => handleTaxRateChange(e.target.value)}
									className="w-[80px] h-8"
								/>
								<span className="text-sm text-muted-foreground">%</span>
							</div>
						</div>

						{/* Payment Terms */}
						<div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
							<div className="flex items-center gap-2">
								<FileText className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">Payment Terms</span>
							</div>
							<Select
								value={paymentTerms}
								onValueChange={handlePaymentTermsChange}
							>
								<SelectTrigger className="w-[120px] h-8">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{PAYMENT_TERMS.map((term) => (
										<SelectItem key={term.value} value={term.value}>
											{term.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Auto Reminders */}
						<div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
							<div className="flex items-center gap-2">
								<Mail className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">Auto Payment Reminders</span>
							</div>
							<Switch
								checked={autoReminders}
								onCheckedChange={handleAutoRemindersChange}
							/>
						</div>

						{/* Online Booking */}
						<div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
							<div className="flex items-center gap-2">
								<CalendarCheck className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">Online Booking</span>
							</div>
							<Switch
								checked={onlineBooking}
								onCheckedChange={handleOnlineBookingChange}
							/>
						</div>

						<div className="flex justify-end gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => markSectionComplete("settings")}
							>
								<SkipForward className="h-4 w-4 mr-1" />
								Use Defaults
							</Button>
							<Button size="sm" onClick={() => markSectionComplete("settings")}>
								Save Settings
								<ArrowRight className="h-4 w-4 ml-1" />
							</Button>
						</div>
					</CardContent>
				)}
			</Card>
		</div>
	);
}
