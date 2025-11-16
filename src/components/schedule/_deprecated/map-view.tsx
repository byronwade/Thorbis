"use client";

import { Clock, MapPin, Navigation, User, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Job, mockTechnicians } from "./schedule-types";

const statusColors = {
	scheduled: "bg-primary",
	"in-progress": "bg-warning",
	completed: "bg-success",
	cancelled: "bg-destructive",
};

const priorityColors = {
	low: "bg-accent",
	medium: "bg-primary",
	high: "bg-warning",
	urgent: "bg-destructive",
};

export function MapView() {
	const [selectedJob, setSelectedJob] = useState<
		(Job & { technician: (typeof mockTechnicians)[0] }) | null
	>(null);

	// Flatten all jobs with technician info
	const allJobs = mockTechnicians.flatMap((tech) =>
		tech.jobs.map((job) => ({
			...job,
			technician: tech,
		})),
	);

	return (
		<div className="flex h-full w-full overflow-hidden">
			{/* Map Container */}
			<div className="relative flex-1 bg-muted/20">
				{/* Mock Map Background */}
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />

				{/* Map Controls */}
				<div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
					<button
						className="flex size-10 items-center justify-center rounded-lg border bg-background shadow-md transition-colors hover:bg-accent"
						type="button"
					>
						<span className="text-lg">+</span>
					</button>
					<button
						className="flex size-10 items-center justify-center rounded-lg border bg-background shadow-md transition-colors hover:bg-accent"
						type="button"
					>
						<span className="text-lg">−</span>
					</button>
					<button
						className="flex size-10 items-center justify-center rounded-lg border bg-background shadow-md transition-colors hover:bg-accent"
						type="button"
					>
						<Navigation className="size-4" />
					</button>
				</div>

				{/* Map Legend */}
				<div className="absolute bottom-4 left-4 z-10 rounded-lg border bg-background p-3 shadow-md">
					<h4 className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
						Job Status
					</h4>
					<div className="space-y-1.5">
						<div className="flex items-center gap-2 text-xs">
							<div className="size-3 rounded-full bg-warning" />
							<span>In Progress</span>
						</div>
						<div className="flex items-center gap-2 text-xs">
							<div className="size-3 rounded-full bg-primary" />
							<span>Scheduled</span>
						</div>
						<div className="flex items-center gap-2 text-xs">
							<div className="size-3 rounded-full bg-success" />
							<span>Completed</span>
						</div>
					</div>
				</div>

				{/* Job Markers */}
				<div className="absolute inset-0 p-8">
					{allJobs.map((job, index) => {
						// Distribute markers across the map (mock positioning)
						const x = 10 + ((index * 17) % 80);
						const y = 15 + ((index * 23) % 70);

						return (
							<button
								className={cn(
									"-translate-x-1/2 -translate-y-1/2 absolute size-12 transition-transform hover:scale-110",
									selectedJob?.id === job.id && "z-20 scale-125",
								)}
								key={job.id}
								onClick={() => setSelectedJob(job)}
								style={{ left: `${x}%`, top: `${y}%` }}
								type="button"
							>
								{/* Pin */}
								<div className="relative">
									<div
										className={cn(
											"flex size-10 items-center justify-center rounded-full border-4 border-background shadow-lg",
											statusColors[job.status],
										)}
									>
										<span className="font-bold text-white text-xs">
											{job.technician.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</span>
									</div>
									{/* Pin point */}
									<div
										className={cn(
											"-translate-x-1/2 absolute top-full left-1/2 size-0 border-8 border-transparent",
											`border-t-${job.status === "in-progress" ? "amber" : job.status === "completed" ? "green" : "blue"}-500`,
										)}
									/>
								</div>

								{/* Hover Label */}
								<div className="-top-2 -translate-x-1/2 -translate-y-full pointer-events-none absolute left-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-background text-xs opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
									{job.title}
								</div>
							</button>
						);
					})}
				</div>

				{/* Selected Job Info Card */}
				{selectedJob && (
					<div className="absolute right-4 bottom-4 z-20 w-96">
						<Card className="relative overflow-hidden shadow-xl">
							{/* Priority Indicator */}
							<div
								className={cn(
									"absolute top-0 bottom-0 left-0 w-1",
									priorityColors[selectedJob.priority],
								)}
							/>

							<div className="p-4 pl-5">
								<div className="mb-3 flex items-start justify-between">
									<div className="flex items-center gap-3">
										<div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
											{selectedJob.technician.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</div>
										<div>
											<h4 className="font-semibold text-base">
												{selectedJob.title}
											</h4>
											<p className="text-muted-foreground text-sm">
												{selectedJob.customer}
											</p>
										</div>
									</div>
									<button
										className="rounded-md p-1 transition-colors hover:bg-accent"
										onClick={() => setSelectedJob(null)}
										type="button"
									>
										<X className="size-4" />
									</button>
								</div>

								{selectedJob.description && (
									<p className="mb-3 text-muted-foreground text-sm">
										{selectedJob.description}
									</p>
								)}

								<div className="space-y-2 text-sm">
									<div className="flex items-center gap-2 text-muted-foreground">
										<User className="size-4" />
										<span>{selectedJob.technician.name}</span>
										<Badge className="ml-auto" variant="outline">
											{selectedJob.technician.role}
										</Badge>
									</div>
									<div className="flex items-center gap-2 text-muted-foreground">
										<Clock className="size-4" />
										<span className="font-medium">
											{selectedJob.startTime} - {selectedJob.endTime}
										</span>
										{selectedJob.estimatedDuration && (
											<span className="text-xs">
												({selectedJob.estimatedDuration})
											</span>
										)}
									</div>
									<div className="flex items-start gap-2 text-muted-foreground">
										<MapPin className="size-4 shrink-0" />
										<span>{selectedJob.address}</span>
									</div>
								</div>

								<div className="mt-3 flex items-center gap-2">
									<Badge
										className={cn(
											"border",
											selectedJob.status === "scheduled" &&
												"border-primary/20 bg-primary/10 text-primary dark:text-primary",
											selectedJob.status === "in-progress" &&
												"border-warning/20 bg-warning/10 text-warning dark:text-warning",
											selectedJob.status === "completed" &&
												"border-success/20 bg-success/10 text-success dark:text-success",
										)}
										variant="secondary"
									>
										{selectedJob.status === "in-progress"
											? "In Progress"
											: selectedJob.status.charAt(0).toUpperCase() +
												selectedJob.status.slice(1)}
									</Badge>
									<Badge className="text-xs" variant="outline">
										<div
											className={cn(
												"mr-1.5 size-1.5 rounded-full",
												priorityColors[selectedJob.priority],
											)}
										/>
										{selectedJob.priority.charAt(0).toUpperCase() +
											selectedJob.priority.slice(1)}{" "}
										Priority
									</Badge>
								</div>

								<button
									className="mt-3 w-full rounded-md bg-foreground py-2 font-medium text-background text-sm transition-opacity hover:opacity-90"
									type="button"
								>
									Get Directions
								</button>
							</div>
						</Card>
					</div>
				)}
			</div>

			{/* Sidebar - Jobs List */}
			<div className="w-80 border-l bg-background">
				<div className="border-b p-4">
					<h3 className="font-semibold text-lg">Jobs Today</h3>
					<p className="text-muted-foreground text-sm">
						{allJobs.length} locations
					</p>
				</div>
				<div
					className="divide-y overflow-auto"
					style={{ height: "calc(100% - 73px)" }}
				>
					{allJobs.map((job) => (
						<button
							className={cn(
								"w-full p-4 text-left transition-colors hover:bg-accent",
								selectedJob?.id === job.id && "bg-accent",
							)}
							key={job.id}
							onClick={() => setSelectedJob(job)}
							type="button"
						>
							<div className="mb-2 flex items-start justify-between gap-2">
								<h4 className="font-semibold text-sm">{job.title}</h4>
								<div
									className={cn(
										"size-2 shrink-0 rounded-full",
										statusColors[job.status],
									)}
								/>
							</div>
							<p className="mb-1 text-muted-foreground text-xs">
								{job.customer}
							</p>
							<div className="flex items-center gap-1 text-muted-foreground text-xs">
								<Clock className="size-3" />
								<span>
									{job.startTime} - {job.endTime}
								</span>
							</div>
							<div className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
								<User className="size-3" />
								<span>{job.technician.name}</span>
							</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
