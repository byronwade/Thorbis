/**
 * Job Time Tracking Section
 * Displays time entries for this job
 */

"use client";

import { Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type JobTimeTrackingProps = {
	timeEntries: any[];
};

export function JobTimeTracking({ timeEntries }: JobTimeTrackingProps) {
	const formatDate = (dateString: string | null) => {
		if (!dateString) {
			return "—";
		}
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatTime = (dateString: string | null) => {
		if (!dateString) {
			return "—";
		}
		return new Date(dateString).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const calculateDuration = (startTime: string | null, endTime: string | null) => {
		if (!(startTime && endTime)) {
			return "—";
		}
		const start = new Date(startTime);
		const end = new Date(endTime);
		const durationMs = end.getTime() - start.getTime();
		const hours = Math.floor(durationMs / (1000 * 60 * 60));
		const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
		return `${hours}h ${minutes}m`;
	};

	if (timeEntries.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Clock className="text-muted-foreground mb-4 size-12" />
				<h3 className="mb-2 text-lg font-semibold">No Time Entries</h3>
				<p className="text-muted-foreground text-sm">No time has been tracked for this job yet.</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="overflow-x-auto rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Team Member</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Start Time</TableHead>
							<TableHead>End Time</TableHead>
							<TableHead>Duration</TableHead>
							<TableHead>Notes</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{timeEntries.map((entry) => {
							const user = entry.user || entry.team_member;
							return (
								<TableRow key={entry.id}>
									<TableCell>
										<div className="flex items-center gap-2">
											{user && (
												<>
													<Avatar className="size-6">
														<AvatarImage
															alt={`${user.first_name} ${user.last_name}`}
															src={user.avatar_url}
														/>
														<AvatarFallback className="text-xs">
															{user.first_name?.[0]}
															{user.last_name?.[0]}
														</AvatarFallback>
													</Avatar>
													<span className="text-sm">
														{user.first_name} {user.last_name}
													</span>
												</>
											)}
										</div>
									</TableCell>
									<TableCell>{formatDate(entry.start_time)}</TableCell>
									<TableCell>{formatTime(entry.start_time)}</TableCell>
									<TableCell>{formatTime(entry.end_time)}</TableCell>
									<TableCell className="font-medium">
										{calculateDuration(entry.start_time, entry.end_time)}
									</TableCell>
									<TableCell className="text-muted-foreground text-sm">
										{entry.notes || "—"}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>

			{/* Summary */}
			<div className="bg-muted/50 rounded-md p-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium">Total Entries</p>
						<p className="text-muted-foreground text-xs">
							{timeEntries.length} entry
							{timeEntries.length !== 1 ? "ies" : ""}
						</p>
					</div>
					<div className="text-right">
						<p className="text-2xl font-bold">
							{timeEntries
								.reduce((total, entry) => {
									if (!(entry.start_time && entry.end_time)) {
										return total;
									}
									const start = new Date(entry.start_time);
									const end = new Date(entry.end_time);
									const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
									return total + hours;
								}, 0)
								.toFixed(1)}
							h
						</p>
						<p className="text-muted-foreground text-xs">Total Time</p>
					</div>
				</div>
			</div>
		</div>
	);
}
