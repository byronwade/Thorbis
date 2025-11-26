"use client";

/**
 * Find a Time Panel
 *
 * Smart time slot finder that:
 * - Shows available slots across technicians
 * - Ranks slots by efficiency (travel time, workload)
 * - Supports duration-based filtering
 * - Highlights optimal scheduling windows
 */

import { addDays, endOfDay, format, isSameDay, startOfDay } from "date-fns";
import {
	Calendar,
	Check,
	ChevronLeft,
	ChevronRight,
	Clock,
	MapPin,
	Sparkles,
	Star,
	User,
	Users,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSchedule } from "@/hooks/use-schedule";
import {
	findAvailableTimeSlots,
	type TimeSlot,
} from "@/lib/schedule/route-optimization";
import { cn } from "@/lib/utils";
import type { Job, Location, Technician } from "./schedule-types";

// ============================================================================
// Types
// ============================================================================

type FindTimePanelProps = {
	duration?: number; // minutes
	location?: Location;
	preferredTechnicianId?: string;
	onSelectSlot?: (slot: TimeSlot) => void;
	className?: string;
};

type TimeSlotCardProps = {
	slot: TimeSlot;
	isSelected: boolean;
	onSelect: () => void;
	isBest?: boolean;
};

// ============================================================================
// Duration Options
// ============================================================================

const DURATION_OPTIONS = [
	{ value: "30", label: "30 minutes" },
	{ value: "60", label: "1 hour" },
	{ value: "90", label: "1.5 hours" },
	{ value: "120", label: "2 hours" },
	{ value: "180", label: "3 hours" },
	{ value: "240", label: "4 hours" },
	{ value: "480", label: "Full day" },
];

// ============================================================================
// Helper Components
// ============================================================================

function TimeSlotCard({
	slot,
	isSelected,
	onSelect,
	isBest,
}: TimeSlotCardProps) {
	const formatTime = (date: Date) => format(date, "h:mm a");
	const formatDay = (date: Date) => format(date, "EEE, MMM d");

	return (
		<Card
			className={cn(
				"cursor-pointer transition-all hover:border-primary/50",
				isSelected && "border-primary ring-1 ring-primary",
				isBest && "relative overflow-hidden",
			)}
			onClick={onSelect}
		>
			{isBest && (
				<div className="absolute right-0 top-0 rounded-bl-lg bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
					<Star className="mr-1 inline h-3 w-3" />
					Best
				</div>
			)}
			<CardContent className="p-4">
				<div className="flex items-start justify-between">
					{/* Time Info */}
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 text-muted-foreground" />
							<span className="font-medium">
								{formatTime(slot.start)} - {formatTime(slot.end)}
							</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Calendar className="h-4 w-4" />
							<span>{formatDay(slot.start)}</span>
						</div>
					</div>

					{/* Technician Info */}
					<div className="flex items-center gap-2">
						<Avatar className="h-8 w-8">
							{slot.technician.avatar && (
								<AvatarImage src={slot.technician.avatar} />
							)}
							<AvatarFallback className="text-xs">
								{slot.technician.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div className="text-right">
							<div className="text-sm font-medium">{slot.technician.name}</div>
							<div className="text-xs text-muted-foreground">
								{slot.technician.role}
							</div>
						</div>
					</div>
				</div>

				{/* Reasons */}
				{slot.reasons.length > 0 && (
					<div className="mt-3 flex flex-wrap gap-1">
						{slot.reasons.map((reason, index) => (
							<Badge key={index} variant="secondary" className="text-xs">
								<Check className="mr-1 h-3 w-3" />
								{reason}
							</Badge>
						))}
					</div>
				)}

				{/* Travel Times */}
				{(slot.travelFromPrevious || slot.travelToNext) && (
					<div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
						{slot.travelFromPrevious && (
							<span>
								<MapPin className="mr-1 inline h-3 w-3" />
								{Math.round(slot.travelFromPrevious / 60)} min from previous
							</span>
						)}
						{slot.travelToNext && (
							<span>
								<MapPin className="mr-1 inline h-3 w-3" />
								{Math.round(slot.travelToNext / 60)} min to next
							</span>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function DaySelector({
	selectedDate,
	onDateChange,
}: {
	selectedDate: Date;
	onDateChange: (date: Date) => void;
}) {
	const days = useMemo(() => {
		const result = [];
		const today = startOfDay(new Date());
		for (let i = 0; i < 7; i++) {
			result.push(addDays(today, i));
		}
		return result;
	}, []);

	return (
		<div className="flex items-center gap-1 overflow-x-auto py-2">
			{days.map((day) => {
				const isSelected = isSameDay(day, selectedDate);
				const isToday = isSameDay(day, new Date());

				return (
					<Button
						key={day.toISOString()}
						variant={isSelected ? "default" : "outline"}
						size="sm"
						className={cn(
							"flex min-w-[60px] flex-col gap-0 py-2",
							isToday && !isSelected && "border-primary",
						)}
						onClick={() => onDateChange(day)}
					>
						<span className="text-xs font-normal opacity-70">
							{format(day, "EEE")}
						</span>
						<span className="text-sm font-medium">{format(day, "d")}</span>
					</Button>
				);
			})}
		</div>
	);
}

// ============================================================================
// Main Component
// ============================================================================

export function FindTimePanel({
	duration: initialDuration = 60,
	location,
	preferredTechnicianId,
	onSelectSlot,
	className,
}: FindTimePanelProps) {
	const [duration, setDuration] = useState(initialDuration);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
		null,
	);

	const { jobs, technicians } = useSchedule();

	// Find available slots
	const slots = useMemo(() => {
		const techsArray = Array.from(technicians.values());
		const jobsByTech = new Map<string, Job[]>();

		// Group existing jobs by technician
		for (const job of jobs.values()) {
			for (const assignment of job.assignments) {
				if (assignment.technicianId) {
					const existing = jobsByTech.get(assignment.technicianId) || [];
					existing.push(job);
					jobsByTech.set(assignment.technicianId, existing);
				}
			}
		}

		const dateStart = startOfDay(selectedDate);
		const dateEnd = endOfDay(addDays(selectedDate, 6)); // Look ahead 7 days

		return findAvailableTimeSlots(
			techsArray,
			jobsByTech,
			duration,
			{
				start: dateStart,
				end: dateEnd,
			},
			{
				preferredTechnicianId,
				jobLocation: location,
				maxSlots: 20,
			},
		);
	}, [
		technicians,
		jobs,
		duration,
		selectedDate,
		preferredTechnicianId,
		location,
	]);

	// Filter slots for selected date
	const slotsForDay = useMemo(() => {
		return slots.filter((slot) => isSameDay(slot.start, selectedDate));
	}, [slots, selectedDate]);

	// Count slots per day
	const slotCountByDay = useMemo(() => {
		const counts = new Map<string, number>();
		for (const slot of slots) {
			const dayKey = format(slot.start, "yyyy-MM-dd");
			counts.set(dayKey, (counts.get(dayKey) || 0) + 1);
		}
		return counts;
	}, [slots]);

	const handleSelectSlot = useCallback(
		(index: number) => {
			setSelectedSlotIndex(index);
			const slot = slotsForDay[index];
			if (slot) {
				onSelectSlot?.(slot);
			}
		},
		[slotsForDay, onSelectSlot],
	);

	return (
		<div className={cn("flex flex-col", className)}>
			{/* Header */}
			<div className="space-y-2 pb-4">
				<div className="flex items-center gap-2">
					<Sparkles className="h-5 w-5 text-primary" />
					<h3 className="text-lg font-semibold">Find a Time</h3>
				</div>
				<p className="text-sm text-muted-foreground">
					Find available slots across all technicians
				</p>
			</div>

			{/* Duration Selector */}
			<div className="mb-4 flex items-center gap-4">
				<div className="flex items-center gap-2">
					<Clock className="h-4 w-4 text-muted-foreground" />
					<span className="text-sm font-medium">Duration</span>
				</div>
				<Select
					value={duration.toString()}
					onValueChange={(v) => setDuration(parseInt(v))}
				>
					<SelectTrigger className="w-40">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{DURATION_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Day Selector */}
			<div className="mb-4">
				<DaySelector
					selectedDate={selectedDate}
					onDateChange={setSelectedDate}
				/>
			</div>

			{/* Slots Summary */}
			<div className="mb-4 flex items-center justify-between">
				<span className="text-sm font-medium">
					Available Slots - {format(selectedDate, "EEEE, MMM d")}
				</span>
				<Badge variant="secondary">{slotsForDay.length} slots</Badge>
			</div>

			{/* Slots List */}
			<ScrollArea className="flex-1">
				{slotsForDay.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center p-8 text-center">
							<Calendar className="mb-4 h-12 w-12 text-muted-foreground/50" />
							<p className="font-medium">No available slots</p>
							<p className="text-sm text-muted-foreground">
								Try selecting a different day or duration
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-2 pr-4">
						{slotsForDay.map((slot, index) => (
							<TimeSlotCard
								key={`${slot.technicianId}-${slot.start.toISOString()}`}
								slot={slot}
								isSelected={selectedSlotIndex === index}
								onSelect={() => handleSelectSlot(index)}
								isBest={index === 0 && slot.score >= 70}
							/>
						))}
					</div>
				)}
			</ScrollArea>

			{/* Selected Slot Actions */}
			{selectedSlotIndex !== null && slotsForDay[selectedSlotIndex] && (
				<div className="mt-4 border-t pt-4">
					<Button className="w-full" size="lg">
						<Check className="mr-2 h-4 w-4" />
						Schedule for{" "}
						{format(slotsForDay[selectedSlotIndex].start, "h:mm a")} with{" "}
						{slotsForDay[selectedSlotIndex].technician.name}
					</Button>
				</div>
			)}
		</div>
	);
}

// ============================================================================
// Sheet Wrapper
// ============================================================================

type FindTimeSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	duration?: number;
	location?: Location;
	preferredTechnicianId?: string;
	onSelectSlot?: (slot: TimeSlot) => void;
};

export function FindTimeSheet({
	open,
	onOpenChange,
	duration,
	location,
	preferredTechnicianId,
	onSelectSlot,
}: FindTimeSheetProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="flex w-full flex-col sm:max-w-lg">
				<SheetHeader className="sr-only">
					<SheetTitle>Find a Time</SheetTitle>
					<SheetDescription>Find available scheduling slots</SheetDescription>
				</SheetHeader>
				<FindTimePanel
					duration={duration}
					location={location}
					preferredTechnicianId={preferredTechnicianId}
					onSelectSlot={(slot) => {
						onSelectSlot?.(slot);
						onOpenChange(false);
					}}
					className="h-full"
				/>
			</SheetContent>
		</Sheet>
	);
}

export default FindTimePanel;
