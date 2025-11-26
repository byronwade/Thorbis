"use client";

import {
	Calendar,
	CheckCircle2,
	Clock,
	FileText,
	MapPin,
	User,
	Users,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	ExpandableRow,
	ExpandableRowSection,
} from "@/components/ui/expandable-row";
import { cn } from "@/lib/utils";

/**
 * Appointment Expandable Row
 *
 * Shows appointment summary in collapsed state.
 * Expands to show:
 * - Team members assigned
 * - Equipment used
 * - Time tracking details
 * - Notes and instructions
 */

type TeamMember = {
	id: string;
	name: string;
	email?: string;
	avatar?: string;
	role?: string;
};

type Equipment = {
	id: string;
	name: string;
	serial_number?: string;
	type?: string;
};

type AppointmentData = {
	id: string;
	title?: string;
	description?: string;
	start_time: string;
	end_time: string;
	duration?: number | null;
	actual_duration?: number | null;
	actual_start_time?: string | null;
	actual_end_time?: string | null;
	status?: string | null;
	type?: string | null;
	notes?: string | null;
	access_instructions?: string | null;
	// Nested associations
	team_members?: TeamMember[];
	equipment?: Equipment[];
	assigned_user?:
		| {
				id: string;
				name: string;
				email?: string;
				avatar?: string;
		  }
		| null
		| Array<{
				id: string;
				name: string;
				email?: string;
				avatar?: string;
		  }>;
};

type AppointmentExpandableRowProps = {
	appointment: AppointmentData;
	showExpanded?: boolean;
};

export function AppointmentExpandableRow({
	appointment,
	showExpanded = false,
}: AppointmentExpandableRowProps) {
	const startDate = new Date(appointment.start_time);
	const endDate = new Date(appointment.end_time);

	// Format time
	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
		});
	};

	// Format date
	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	// Get status color
	const getStatusColor = (status?: string | null) => {
		switch (status?.toLowerCase()) {
			case "completed":
				return "bg-green-500/10 text-green-700 dark:text-green-400";
			case "in_progress":
				return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
			case "scheduled":
				return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
			case "cancelled":
				return "bg-red-500/10 text-red-700 dark:text-red-400";
			default:
				return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
		}
	};

	// Extract assigned user
	const assignedUser = Array.isArray(appointment.assigned_user)
		? appointment.assigned_user[0]
		: appointment.assigned_user;

	// Check if there are nested associations to show
	const hasTeamMembers =
		appointment.team_members && appointment.team_members.length > 0;
	const hasEquipment =
		appointment.equipment && appointment.equipment.length > 0;
	const hasNotes = appointment.notes || appointment.access_instructions;
	const hasTimeTracking =
		appointment.actual_start_time || appointment.actual_end_time;

	const hasNestedData =
		hasTeamMembers || hasEquipment || hasNotes || hasTimeTracking;

	return (
		<ExpandableRow
			defaultExpanded={showExpanded}
			details={
				hasNestedData ? (
					<div className="divide-y">
						{/* Team Members */}
						{hasTeamMembers && (
							<ExpandableRowSection
								icon={<Users className="size-4" />}
								title="Team Members"
							>
								<div className="space-y-2">
									{appointment.team_members?.map((member) => (
										<div
											className="flex items-center gap-3 rounded-md border p-2"
											key={member.id}
										>
											<Avatar className="size-8">
												<AvatarImage src={member.avatar} />
												<AvatarFallback className="text-xs">
													{member.name.substring(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<div className="text-foreground text-sm font-medium">
													{member.name}
												</div>
												{member.role && (
													<div className="text-muted-foreground text-xs">
														{member.role}
													</div>
												)}
											</div>
											{member.email && (
												<Link
													className="text-primary text-xs hover:underline"
													href={`mailto:${member.email}`}
												>
													{member.email}
												</Link>
											)}
										</div>
									))}
								</div>
							</ExpandableRowSection>
						)}

						{/* Equipment */}
						{hasEquipment && (
							<ExpandableRowSection
								icon={<Wrench className="size-4" />}
								title="Equipment"
							>
								<div className="space-y-2">
									{appointment.equipment?.map((equip) => (
										<div
											className="flex items-center justify-between rounded-md border p-2"
											key={equip.id}
										>
											<div className="flex items-center gap-2">
												<Wrench className="text-muted-foreground size-4" />
												<div>
													<div className="text-foreground text-sm font-medium">
														{equip.name}
													</div>
													{equip.serial_number && (
														<div className="text-muted-foreground font-mono text-xs">
															SN: {equip.serial_number}
														</div>
													)}
												</div>
											</div>
											{equip.type && (
												<Badge variant="outline">{equip.type}</Badge>
											)}
										</div>
									))}
								</div>
							</ExpandableRowSection>
						)}

						{/* Time Tracking */}
						{hasTimeTracking && (
							<ExpandableRowSection
								icon={<Clock className="size-4" />}
								title="Time Tracking"
							>
								<div className="grid gap-2 text-sm sm:grid-cols-2">
									{appointment.actual_start_time && (
										<div>
											<span className="text-muted-foreground">
												Actual Start:
											</span>{" "}
											<span className="font-medium">
												{new Date(
													appointment.actual_start_time,
												).toLocaleString()}
											</span>
										</div>
									)}
									{appointment.actual_end_time && (
										<div>
											<span className="text-muted-foreground">Actual End:</span>{" "}
											<span className="font-medium">
												{new Date(appointment.actual_end_time).toLocaleString()}
											</span>
										</div>
									)}
									{appointment.actual_duration && (
										<div>
											<span className="text-muted-foreground">
												Actual Duration:
											</span>{" "}
											<span className="font-medium">
												{appointment.actual_duration} min
											</span>
										</div>
									)}
									{appointment.duration && (
										<div>
											<span className="text-muted-foreground">
												Estimated Duration:
											</span>{" "}
											<span className="font-medium">
												{appointment.duration} min
											</span>
										</div>
									)}
								</div>
							</ExpandableRowSection>
						)}

						{/* Notes & Instructions */}
						{hasNotes && (
							<ExpandableRowSection
								icon={<FileText className="size-4" />}
								title="Notes & Instructions"
							>
								{appointment.access_instructions && (
									<div className="mb-3">
										<div className="mb-1 flex items-center gap-2 text-xs font-medium">
											<MapPin className="size-3" />
											Access Instructions
										</div>
										<p className="bg-muted/50 rounded-md border p-2 text-xs whitespace-pre-wrap">
											{appointment.access_instructions}
										</p>
									</div>
								)}
								{appointment.notes && (
									<div>
										<div className="mb-1 text-xs font-medium">
											Internal Notes
										</div>
										<p className="bg-muted/50 rounded-md border p-2 text-xs whitespace-pre-wrap">
											{appointment.notes}
										</p>
									</div>
								)}
							</ExpandableRowSection>
						)}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<FileText className="text-muted-foreground mb-2 size-8" />
						<p className="text-muted-foreground text-sm">
							No additional details available
						</p>
					</div>
				)
			}
			disabled={!hasNestedData}
			showIndicator={hasNestedData}
			summary={
				<div className="flex flex-1 items-center gap-4 py-3 pr-4">
					{/* Date/Time */}
					<div className="flex w-32 shrink-0 flex-col">
						<div className="text-sm font-medium">{formatDate(startDate)}</div>
						<div className="text-muted-foreground text-xs">
							{formatTime(startDate)} - {formatTime(endDate)}
						</div>
					</div>

					{/* Title & Type */}
					<div className="flex min-w-0 flex-1 flex-col">
						<div className="truncate text-sm font-medium">
							{appointment.title || "Untitled Appointment"}
						</div>
						{appointment.type && (
							<div className="text-muted-foreground truncate text-xs">
								{appointment.type}
							</div>
						)}
					</div>

					{/* Assigned User */}
					{assignedUser && (
						<div className="flex items-center gap-2">
							<Avatar className="size-6">
								<AvatarImage src={assignedUser.avatar} />
								<AvatarFallback className="text-[10px]">
									{assignedUser.name.substring(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<span className="text-muted-foreground hidden text-xs sm:inline">
								{assignedUser.name}
							</span>
						</div>
					)}

					{/* Status */}
					{appointment.status && (
						<Badge
							className={cn(
								"h-6 shrink-0 rounded-full px-3 text-xs capitalize",
								getStatusColor(appointment.status),
							)}
							variant="secondary"
						>
							{appointment.status.replace(/_/g, " ")}
						</Badge>
					)}

					{/* Nested data indicator */}
					{hasNestedData && (
						<div className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
							{hasTeamMembers && (
								<Badge className="h-5 px-1.5" variant="outline">
									<Users className="mr-1 size-3" />
									{appointment.team_members?.length}
								</Badge>
							)}
							{hasEquipment && (
								<Badge className="h-5 px-1.5" variant="outline">
									<Wrench className="mr-1 size-3" />
									{appointment.equipment?.length}
								</Badge>
							)}
						</div>
					)}
				</div>
			}
		/>
	);
}
