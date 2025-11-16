/**
 * Scheduling Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export default function SchedulingPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-semibold text-2xl text-foreground">Scheduling</h1>
				<p className="text-muted-foreground">Manage schedules, dispatch, and job assignments.</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg border bg-card p-6">
					<h3 className="font-semibold">Calendar View</h3>
					<p className="text-muted-foreground text-sm">Visual calendar for scheduling and planning.</p>
				</div>

				<div className="rounded-lg border bg-card p-6">
					<h3 className="font-semibold">Dispatch Board</h3>
					<p className="text-muted-foreground text-sm">Real-time dispatch and job assignment management.</p>
				</div>

				<div className="rounded-lg border bg-card p-6">
					<h3 className="font-semibold">Technician Schedule</h3>
					<p className="text-muted-foreground text-sm">Manage individual technician schedules and availability.</p>
				</div>
			</div>
		</div>
	);
}
