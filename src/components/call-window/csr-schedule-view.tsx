"use client";

/**
 * CSR Schedule View Component
 *
 * Displays all technicians' schedules for the day with real data from database.
 * Features:
 * - Timeline visualization with current time indicator
 * - All assigned technicians (not just leads)
 * - Available time slots
 * - Active jobs highlighted
 * - 2-hour appointment windows
 */

import {
	AlertCircle,
	Calendar,
	ChevronLeft,
	ChevronRight,
	Clock,
	Loader2,
	MapPin,
	Plus,
	User,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
	getTechnicianSchedules,
	type ScheduleAppointment,
	type TechnicianSchedule,
} from "@/actions/schedule";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	UnifiedAccordion,
	type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";
import { cn } from "@/lib/utils";
import { ScheduleTimeline } from "./schedule-timeline";

type CSRScheduleViewProps = {
	className?: string;
	companyId?: string;
};

export function CSRScheduleView({
	className,
	companyId,
}: CSRScheduleViewProps) {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedTechFilter, setSelectedTechFilter] = useState<string | null>(
		null,
	);
	const [technicians, setTechnicians] = useState<TechnicianSchedule[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentTime, setCurrentTime] = useState(new Date());

	// Update current time every minute
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 60_000); // Update every minute

		return () => clearInterval(interval);
	}, []);

	// Fetch schedule data
	useEffect(() => {
		async function fetchSchedule() {
			if (!companyId) {
				setError("No company ID provided");
				setIsLoading(false);
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const schedules = await getTechnicianSchedules(selectedDate, companyId);
				setTechnicians(schedules);
			} catch (_err) {
				setError("Failed to load schedules");
			} finally {
				setIsLoading(false);
			}
		}

		fetchSchedule();
	}, [selectedDate, companyId]);

	// If loading, show spinner
	if (isLoading) {
		return (
			<div className={cn("flex h-full items-center justify-center", className)}>
				<div className="text-center">
					<Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
					<p className="text-muted-foreground text-sm">Loading schedules...</p>
				</div>
			</div>
		);
	}

	// If error, show message
	if (error) {
		return (
			<div className={cn("flex h-full items-center justify-center", className)}>
				<div className="text-center">
					<AlertCircle className="mx-auto mb-4 h-8 w-8 text-destructive" />
					<p className="font-medium text-sm">{error}</p>
					<Button
						className="mt-4"
						onClick={() => window.location.reload()}
						size="sm"
						variant="outline"
					>
						Retry
					</Button>
				</div>
			</div>
		);
	}

	// Format time from ISO string
	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	const formatDate = (date: Date): string =>
		date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});

	const changeDate = (days: number) => {
		const newDate = new Date(selectedDate);
		newDate.setDate(newDate.getDate() + days);
		setSelectedDate(newDate);
	};

	const isToday = (date: Date): boolean => {
		const today = new Date();
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	};

	const getStatusBadge = (status: ScheduleAppointment["status"]) => {
		switch (status) {
			case "completed":
				return (
					<Badge
						className="border-success/50 bg-success/10 text-[10px] text-success"
						variant="outline"
					>
						Completed
					</Badge>
				);
			case "in_progress":
				return (
					<Badge
						className="border-warning/50 bg-warning/10 text-[10px] text-warning"
						variant="outline"
					>
						In Progress
					</Badge>
				);
			case "cancelled":
				return (
					<Badge
						className="border-destructive/50 bg-destructive/10 text-[10px] text-destructive"
						variant="outline"
					>
						Cancelled
					</Badge>
				);
			default:
				return (
					<Badge className="text-[10px]" variant="outline">
						Scheduled
					</Badge>
				);
		}
	};

	const getInitials = (name: string) =>
		name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);

	// Filter technicians if a specific one is selected
	const filteredTechnicians = selectedTechFilter
		? technicians.filter((tech) => tech.id === selectedTechFilter)
		: technicians;

	// Calculate total appointments
	const totalAppointments = technicians.reduce(
		(sum, tech) => sum + tech.appointments.length,
		0,
	);

	// Build accordion sections for each technician
	const sections: UnifiedAccordionSection[] = filteredTechnicians.map(
		(tech) => ({
			id: tech.id,
			title: tech.name,
			icon: (
				<Avatar className="h-5 w-5">
					<AvatarImage src={tech.avatar_url} />
					<AvatarFallback className={cn("text-[10px] text-white", tech.color)}>
						{getInitials(tech.name)}
					</AvatarFallback>
				</Avatar>
			),
			count: tech.appointments.length,
			actions: (
				<Badge className="text-[10px]" variant="secondary">
					{tech.role.replace("_", " ")}
				</Badge>
			),
			content: (
				<div className="space-y-4 p-4">
					{/* Timeline */}
					<ScheduleTimeline
						appointments={tech.appointments}
						currentTime={currentTime}
						technicianColor={tech.color}
						workingHours={tech.working_hours}
					/>

					{/* Appointments List */}
					{tech.appointments.length > 0 ? (
						<div className="space-y-3">
							{tech.appointments.map((appointment) => (
								<div
									className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
									key={appointment.id}
								>
									{/* Time & Status */}
									<div className="mb-3 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<span className="font-semibold text-sm">
												{formatTime(appointment.scheduled_start)} -{" "}
												{formatTime(appointment.scheduled_end)}
											</span>
											<Badge className="text-[10px]" variant="secondary">
												{appointment.duration_hours}h window
											</Badge>
										</div>
										{getStatusBadge(appointment.status)}
									</div>

									{/* Job Info */}
									<div className="mb-3 space-y-1">
										<div className="flex items-center gap-2">
											<User className="h-3.5 w-3.5 text-muted-foreground" />
											<span className="font-medium text-sm">
												{appointment.customer_name}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<MapPin className="h-3.5 w-3.5 text-muted-foreground" />
											<span className="text-muted-foreground text-xs">
												{appointment.address}, {appointment.city},{" "}
												{appointment.state}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Badge className="text-xs" variant="outline">
												{appointment.job_type}
											</Badge>
											<span className="font-mono text-muted-foreground text-xs">
												#{appointment.job_number}
											</span>
										</div>
									</div>

									{/* Assigned Technicians */}
									{appointment.assigned_technicians.length > 1 && (
										<div className="border-t pt-3">
											<div className="flex items-center gap-2">
												<Users className="h-3.5 w-3.5 text-muted-foreground" />
												<span className="text-muted-foreground text-xs">
													Team:
												</span>
												<div className="flex flex-wrap gap-1">
													{appointment.assigned_technicians.map(
														(assignedTech) => (
															<Badge
																className="text-[10px]"
																key={assignedTech.id}
																variant={
																	assignedTech.is_lead ? "default" : "secondary"
																}
															>
																{assignedTech.name}
																{assignedTech.is_lead && " (Lead)"}
															</Badge>
														),
													)}
												</div>
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-8 text-center">
							<Calendar className="mb-3 h-10 w-10 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">
								No appointments today
							</p>
							<p className="text-muted-foreground text-xs">
								This technician is available
							</p>
						</div>
					)}
				</div>
			),
		}),
	);

	return (
		<div className={cn("flex h-full flex-col", className)}>
			{/* Header */}
			<div className="space-y-3 border-b bg-card/50 p-4">
				{/* Date Navigation */}
				<div className="flex items-center justify-between">
					<Button
						className="h-8 w-8"
						onClick={() => changeDate(-1)}
						size="icon"
						variant="ghost"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>

					<div className="flex flex-col items-center">
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<span className="font-semibold text-sm">
								{formatDate(selectedDate)}
							</span>
						</div>
						{isToday(selectedDate) && (
							<Badge className="mt-1 text-[10px]" variant="secondary">
								Today
							</Badge>
						)}
					</div>

					<Button
						className="h-8 w-8"
						onClick={() => changeDate(1)}
						size="icon"
						variant="ghost"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>

				{/* Stats & Filter */}
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-1.5">
						<Users className="h-3.5 w-3.5 text-muted-foreground" />
						<span className="text-muted-foreground text-xs">
							{filteredTechnicians.length} Techs
						</span>
						<span className="text-muted-foreground">•</span>
						<span className="font-medium text-xs">
							{totalAppointments} Appointments
						</span>
					</div>

					<Button
						className="h-7 gap-1.5 px-2 text-xs"
						onClick={() => setSelectedTechFilter(null)}
						size="sm"
						variant="outline"
					>
						{selectedTechFilter ? "Show All" : "All Techs"}
					</Button>
				</div>
			</div>

			{/* Technicians List */}
			<ScrollArea className="flex-1">
				<div className="p-4">
					<section className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
						<div className="flex flex-col gap-4 p-0">
							<UnifiedAccordion
								defaultOpenSection={sections[0]?.id}
								enableReordering={false}
								sections={sections}
								storageKey="csr-schedule-technicians"
							/>
						</div>
					</section>
				</div>
			</ScrollArea>

			{/* Quick Actions */}
			<div className="border-t bg-card/50 p-3">
				<Button
					className="w-full gap-2 text-xs"
					onClick={() => {}}
					size="sm"
					variant="default"
				>
					<Plus className="h-3.5 w-3.5" />
					Book New Appointment
				</Button>
			</div>
		</div>
	);
}
