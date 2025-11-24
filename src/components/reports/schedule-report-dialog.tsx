"use client";

/**
 * Schedule Report Dialog - Automated Report Delivery
 *
 * Configure recurring report delivery via email with
 * flexible scheduling options and recipient management.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Calendar,
	Clock,
	Mail,
	Plus,
	X,
	Loader2,
	Check,
	Bell,
} from "lucide-react";
import { toast } from "sonner";

interface ScheduleReportDialogProps {
	reportTitle: string;
	reportType: string;
	trigger?: React.ReactNode;
	onScheduled?: (schedule: ScheduleConfig) => void;
}

interface ScheduleConfig {
	frequency: "daily" | "weekly" | "monthly" | "quarterly";
	dayOfWeek?: number;
	dayOfMonth?: number;
	time: string;
	timezone: string;
	recipients: string[];
	format: "pdf" | "csv" | "excel";
	includeCharts: boolean;
	isActive: boolean;
}

const DAYS_OF_WEEK = [
	{ value: 0, label: "Sunday" },
	{ value: 1, label: "Monday" },
	{ value: 2, label: "Tuesday" },
	{ value: 3, label: "Wednesday" },
	{ value: 4, label: "Thursday" },
	{ value: 5, label: "Friday" },
	{ value: 6, label: "Saturday" },
];

const TIMES = [
	"06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
	"13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

export function ScheduleReportDialog({
	reportTitle,
	reportType,
	trigger,
	onScheduled,
}: ScheduleReportDialogProps) {
	const [open, setOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	// Form state
	const [frequency, setFrequency] = useState<ScheduleConfig["frequency"]>("weekly");
	const [dayOfWeek, setDayOfWeek] = useState(1); // Monday
	const [dayOfMonth, setDayOfMonth] = useState(1);
	const [time, setTime] = useState("08:00");
	const [format, setFormat] = useState<ScheduleConfig["format"]>("pdf");
	const [includeCharts, setIncludeCharts] = useState(true);
	const [recipients, setRecipients] = useState<string[]>([]);
	const [newRecipient, setNewRecipient] = useState("");
	const [isActive, setIsActive] = useState(true);

	const addRecipient = () => {
		if (newRecipient && newRecipient.includes("@")) {
			if (!recipients.includes(newRecipient)) {
				setRecipients([...recipients, newRecipient]);
			}
			setNewRecipient("");
		} else {
			toast.error("Please enter a valid email address");
		}
	};

	const removeRecipient = (email: string) => {
		setRecipients(recipients.filter((r) => r !== email));
	};

	const handleSave = async () => {
		if (recipients.length === 0) {
			toast.error("Please add at least one recipient");
			return;
		}

		setIsSaving(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const config: ScheduleConfig = {
				frequency,
				dayOfWeek: frequency === "weekly" ? dayOfWeek : undefined,
				dayOfMonth: frequency === "monthly" || frequency === "quarterly" ? dayOfMonth : undefined,
				time,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				recipients,
				format,
				includeCharts,
				isActive,
			};

			onScheduled?.(config);
			toast.success("Report schedule saved successfully");
			setOpen(false);
		} catch (error) {
			toast.error("Failed to save schedule");
		} finally {
			setIsSaving(false);
		}
	};

	const getScheduleDescription = () => {
		let desc = "";
		switch (frequency) {
			case "daily":
				desc = `Daily at ${time}`;
				break;
			case "weekly":
				desc = `Every ${DAYS_OF_WEEK.find((d) => d.value === dayOfWeek)?.label} at ${time}`;
				break;
			case "monthly":
				desc = `Monthly on the ${dayOfMonth}${getDayOrdinal(dayOfMonth)} at ${time}`;
				break;
			case "quarterly":
				desc = `Quarterly on the ${dayOfMonth}${getDayOrdinal(dayOfMonth)} at ${time}`;
				break;
		}
		return desc;
	};

	const getDayOrdinal = (day: number) => {
		if (day > 3 && day < 21) return "th";
		switch (day % 10) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button variant="outline" size="sm">
						<Calendar className="mr-2 h-4 w-4" />
						Schedule
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Schedule Report
					</DialogTitle>
					<DialogDescription>
						Set up automatic delivery for "{reportTitle}"
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Frequency */}
					<div className="space-y-3">
						<Label>Delivery Frequency</Label>
						<Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="daily">Daily</SelectItem>
								<SelectItem value="weekly">Weekly</SelectItem>
								<SelectItem value="monthly">Monthly</SelectItem>
								<SelectItem value="quarterly">Quarterly</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Day Selection */}
					{frequency === "weekly" && (
						<div className="space-y-3">
							<Label>Day of Week</Label>
							<Select value={dayOfWeek.toString()} onValueChange={(v) => setDayOfWeek(parseInt(v))}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{DAYS_OF_WEEK.map((day) => (
										<SelectItem key={day.value} value={day.value.toString()}>
											{day.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					{(frequency === "monthly" || frequency === "quarterly") && (
						<div className="space-y-3">
							<Label>Day of Month</Label>
							<Select value={dayOfMonth.toString()} onValueChange={(v) => setDayOfMonth(parseInt(v))}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
										<SelectItem key={day} value={day.toString()}>
											{day}
											{getDayOrdinal(day)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					{/* Time */}
					<div className="space-y-3">
						<Label>Delivery Time</Label>
						<Select value={time} onValueChange={setTime}>
							<SelectTrigger>
								<Clock className="mr-2 h-4 w-4" />
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{TIMES.map((t) => (
									<SelectItem key={t} value={t}>
										{t}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className="text-xs text-muted-foreground">
							Times are in your local timezone ({Intl.DateTimeFormat().resolvedOptions().timeZone})
						</p>
					</div>

					{/* Recipients */}
					<div className="space-y-3">
						<Label>Recipients</Label>
						<div className="flex gap-2">
							<Input
								type="email"
								placeholder="email@example.com"
								value={newRecipient}
								onChange={(e) => setNewRecipient(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRecipient())}
							/>
							<Button type="button" variant="outline" onClick={addRecipient}>
								<Plus className="h-4 w-4" />
							</Button>
						</div>
						{recipients.length > 0 && (
							<div className="flex flex-wrap gap-2 mt-2">
								{recipients.map((email) => (
									<Badge key={email} variant="secondary" className="gap-1 pr-1">
										<Mail className="h-3 w-3" />
										{email}
										<button
											type="button"
											onClick={() => removeRecipient(email)}
											className="ml-1 rounded-full hover:bg-muted p-0.5"
										>
											<X className="h-3 w-3" />
										</button>
									</Badge>
								))}
							</div>
						)}
					</div>

					{/* Format */}
					<div className="space-y-3">
						<Label>Report Format</Label>
						<Select value={format} onValueChange={(v) => setFormat(v as any)}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="pdf">PDF Document</SelectItem>
								<SelectItem value="csv">CSV Spreadsheet</SelectItem>
								<SelectItem value="excel">Excel Spreadsheet</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Options */}
					<div className="space-y-4 rounded-lg border p-4">
						<div className="flex items-center justify-between">
							<div>
								<Label>Include Charts</Label>
								<p className="text-xs text-muted-foreground">Add visualizations to the report</p>
							</div>
							<Switch checked={includeCharts} onCheckedChange={setIncludeCharts} />
						</div>
						<div className="flex items-center justify-between">
							<div>
								<Label>Schedule Active</Label>
								<p className="text-xs text-muted-foreground">Enable automatic delivery</p>
							</div>
							<Switch checked={isActive} onCheckedChange={setIsActive} />
						</div>
					</div>

					{/* Preview */}
					<div className="rounded-lg bg-muted/50 p-3">
						<div className="flex items-center gap-2 text-sm">
							<Check className="h-4 w-4 text-green-500" />
							<span className="font-medium">{getScheduleDescription()}</span>
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							to {recipients.length} recipient{recipients.length !== 1 ? "s" : ""} as {format.toUpperCase()}
						</p>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={isSaving || recipients.length === 0}>
						{isSaving ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Check className="mr-2 h-4 w-4" />
								Save Schedule
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
