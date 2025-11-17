"use client";

import { Clock, Users } from "lucide-react";
import type { ScheduleAppointment } from "@/actions/schedule";
import { cn } from "@/lib/utils";

type ScheduleTimelineProps = {
	appointments: ScheduleAppointment[];
	workingHours: {
		start: number;
		end: number;
	};
	technicianColor: string;
	currentTime?: Date;
};

export function ScheduleTimeline({
	appointments,
	workingHours,
	technicianColor,
	currentTime = new Date(),
}: ScheduleTimelineProps) {
	const { start: workStart, end: workEnd } = workingHours;
	const totalHours = workEnd - workStart;

	const getCurrentTimePosition = (): number => {
		const now = currentTime;
		const currentHour = now.getHours() + now.getMinutes() / 60;

		if (currentHour < workStart) {
			return 0;
		}
		if (currentHour > workEnd) {
			return 100;
		}

		return ((currentHour - workStart) / totalHours) * 100;
	};

	const getAppointmentStyle = (appointment: ScheduleAppointment) => {
		const startTime = new Date(appointment.scheduled_start);
		const endTime = new Date(appointment.scheduled_end);

		const startHour = startTime.getHours() + startTime.getMinutes() / 60;
		const endHour = endTime.getHours() + endTime.getMinutes() / 60;

		const left = ((startHour - workStart) / totalHours) * 100;
		const width = ((endHour - startHour) / totalHours) * 100;

		return {
			left: `${Math.max(0, left)}%`,
			width: `${Math.min(100 - Math.max(0, left), width)}%`,
		};
	};

	const getStatusColor = (status: ScheduleAppointment["status"]) => {
		switch (status) {
			case "in_progress":
				return "bg-warning/80 border-warning";
			case "completed":
				return "bg-success/80 border-success";
			case "cancelled":
				return "bg-destructive/80 border-destructive";
			default:
				return `${technicianColor}/80 border-${technicianColor.replace("bg-", "")}`;
		}
	};

	const formatTime = (value: string) => {
		const date = new Date(value);
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	const hourMarkers = Array.from({ length: totalHours + 1 }, (_, i) => workStart + i);
	const currentTimePosition = getCurrentTimePosition();
	const isWithinWorkingHours = currentTimePosition > 0 && currentTimePosition < 100;

	return (
		<div className="space-y-3">
			<div className="bg-muted/20 relative h-24 rounded-lg border p-2">
				<div className="absolute inset-x-2 top-1 flex justify-between">
					{hourMarkers.map((hour) => (
						<div className="flex flex-col items-center" key={hour}>
							<span className="text-muted-foreground text-[9px]">
								{hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}
								{hour >= 12 ? "p" : "a"}
							</span>
						</div>
					))}
				</div>

				<div className="bg-card relative mt-6 h-12 rounded border">
					{appointments.map((appointment) => {
						const style = getAppointmentStyle(appointment);
						const statusColor = getStatusColor(appointment.status);

						return (
							<div
								className={cn(
									"absolute top-1 h-10 rounded border-2 p-1 transition-all hover:z-10 hover:scale-105",
									statusColor,
									appointment.status === "in_progress" && "animate-pulse"
								)}
								key={appointment.id}
								style={style}
								title={`${appointment.customer_name} • ${formatTime(appointment.scheduled_start)} - ${formatTime(appointment.scheduled_end)}`}
							>
								<div className="flex h-full flex-col justify-center overflow-hidden px-1">
									<p className="truncate text-[10px] leading-tight font-medium text-white">
										{appointment.customer_name}
									</p>
									{appointment.assigned_technicians.length > 1 && (
										<div className="flex items-center gap-0.5 text-white/80">
											<Users className="h-2.5 w-2.5" />
											<span className="text-[8px]">{appointment.assigned_technicians.length}</span>
										</div>
									)}
								</div>
							</div>
						);
					})}

					{isWithinWorkingHours && (
						<div
							className="absolute top-0 h-full w-0.5 bg-blue-500 shadow-lg"
							style={{ left: `${currentTimePosition}%` }}
						>
							<div className="absolute -top-1 left-1/2 -translate-x-1/2">
								<div className="flex items-center gap-1 rounded bg-blue-500 px-1.5 py-0.5 text-white shadow-lg">
									<Clock className="h-2.5 w-2.5" />
									<span className="text-[9px] font-medium">
										{currentTime.toLocaleTimeString("en-US", {
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
										})}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-2 text-[10px]">
				<div className="flex items-center gap-1">
					<div className={cn("h-2 w-2 rounded", technicianColor)} />
					<span className="text-muted-foreground">Scheduled</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="bg-warning h-2 w-2 rounded" />
					<span className="text-muted-foreground">In Progress</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="bg-success h-2 w-2 rounded" />
					<span className="text-muted-foreground">Completed</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="h-2 w-2 rounded border-2 border-blue-500 bg-blue-500" />
					<span className="text-muted-foreground">Current Time</span>
				</div>
			</div>
		</div>
	);
}
