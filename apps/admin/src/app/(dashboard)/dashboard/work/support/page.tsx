import { LifeBuoy, Search } from "lucide-react";

/**
 * Support Tickets Page
 */
export default function SupportPage() {
	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
					<p className="text-muted-foreground">
						Handle customer support requests
					</p>
				</div>
			</div>

			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-4 mb-6">
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">Open Tickets</p>
					<p className="text-2xl font-bold">--</p>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">Pending</p>
					<p className="text-2xl font-bold">--</p>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">Resolved Today</p>
					<p className="text-2xl font-bold">--</p>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">Avg Response Time</p>
					<p className="text-2xl font-bold">-- min</p>
				</div>
			</div>

			<div className="flex items-center gap-4 mb-6">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search tickets..."
						className="w-full rounded-md border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>
				<select className="rounded-md border bg-background px-4 py-2 text-sm">
					<option>All Status</option>
					<option>Open</option>
					<option>Pending</option>
					<option>Resolved</option>
					<option>Closed</option>
				</select>
				<select className="rounded-md border bg-background px-4 py-2 text-sm">
					<option>All Priority</option>
					<option>Critical</option>
					<option>High</option>
					<option>Medium</option>
					<option>Low</option>
				</select>
			</div>

			<div className="rounded-lg border bg-card">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b bg-muted/50">
								<th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
									Ticket
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
									Company
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
									Priority
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
									Status
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
									Created
								</th>
								<th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td colSpan={6} className="px-4 py-12 text-center">
									<LifeBuoy className="size-12 mx-auto mb-4 text-muted-foreground/20" />
									<p className="text-muted-foreground">
										Support ticket data will be loaded here
									</p>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
