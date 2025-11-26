import { Calendar, Users } from "lucide-react";
import Link from "next/link";

/**
 * Schedule Page - Thorbis Team Schedule
 */
export default function SchedulePage() {
	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
					<p className="text-muted-foreground">
						Thorbis team calendar and scheduling
					</p>
				</div>
			</div>

			{/* Quick Links */}
			<div className="grid gap-6 md:grid-cols-3 mb-8">
				<Link
					href="/dashboard/schedule/team"
					className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Users className="size-5 text-primary" />
					</div>
					<div>
						<h3 className="font-medium">Team Members</h3>
						<p className="text-sm text-muted-foreground">
							View and manage team schedules
						</p>
					</div>
				</Link>
				<Link
					href="/dashboard/schedule/time-off"
					className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Calendar className="size-5 text-primary" />
					</div>
					<div>
						<h3 className="font-medium">Time Off</h3>
						<p className="text-sm text-muted-foreground">
							Manage time off requests
						</p>
					</div>
				</Link>
			</div>

			{/* Calendar Placeholder */}
			<div className="rounded-lg border bg-card">
				<div className="p-6 border-b">
					<h2 className="font-semibold">Team Calendar</h2>
				</div>
				<div className="p-6">
					<div className="h-96 flex items-center justify-center border-2 border-dashed rounded-lg">
						<div className="text-center">
							<Calendar className="size-12 mx-auto mb-4 text-muted-foreground/20" />
							<p className="text-muted-foreground">
								Calendar view coming soon
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
