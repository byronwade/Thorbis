import { Suspense } from "react";
import { getSupportTickets, getSupportTicketStats } from "@/actions/support-tickets";
import { SupportTicketsManager } from "@/components/work/support-tickets-manager";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Support Tickets Page
 *
 * Manage customer support tickets across the platform.
 */
async function SupportTicketsData() {
	const [ticketsResult, statsResult] = await Promise.all([
		getSupportTickets(50),
		getSupportTicketStats(),
	]);

	if (ticketsResult.error || statsResult.error) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{ticketsResult.error || statsResult.error || "Failed to load support tickets"}
				</p>
			</div>
		);
	}

	return (
		<SupportTicketsManager
			initialTickets={ticketsResult.data || []}
			initialStats={statsResult.data || {
				total_tickets: 0,
				open_tickets: 0,
				in_progress: 0,
				resolved_today: 0,
				avg_response_time_minutes: 0,
			}}
		/>
	);
}

export default function SupportPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
				<p className="text-muted-foreground text-sm">
					Manage customer support requests and track response times
				</p>
			</div>
			<Suspense fallback={<SupportTicketsSkeleton />}>
				<SupportTicketsData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton
 */
function SupportTicketsSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<Skeleton className="h-4 w-24 mb-2" />
							<Skeleton className="h-8 w-16 mb-1" />
							<Skeleton className="h-3 w-20" />
						</CardContent>
					</Card>
				))}
			</div>
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-10 w-full mb-4" />
					<div className="space-y-2">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-16 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
