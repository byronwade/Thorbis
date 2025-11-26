import { Search, UserPlus } from "lucide-react";

/**
 * Onboarding Page
 */
export default function OnboardingPage() {
	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Onboarding</h1>
					<p className="text-muted-foreground">
						Track new company onboarding progress
					</p>
				</div>
			</div>

			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-4 mb-6">
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">In Progress</p>
					<p className="text-2xl font-bold">--</p>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">Completed This Week</p>
					<p className="text-2xl font-bold">--</p>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">Avg. Completion Time</p>
					<p className="text-2xl font-bold">-- days</p>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">Completion Rate</p>
					<p className="text-2xl font-bold">--%</p>
				</div>
			</div>

			<div className="flex items-center gap-4 mb-6">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search companies..."
						className="w-full rounded-md border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>
				<select className="rounded-md border bg-background px-4 py-2 text-sm">
					<option>All Status</option>
					<option>Not Started</option>
					<option>In Progress</option>
					<option>Completed</option>
					<option>Stalled</option>
				</select>
			</div>

			<div className="rounded-lg border bg-card">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b bg-muted/50">
								<th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
									Company
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
									Progress
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
									Current Step
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
									Started
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
									Assigned To
								</th>
								<th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td colSpan={6} className="px-4 py-12 text-center">
									<UserPlus className="size-12 mx-auto mb-4 text-muted-foreground/20" />
									<p className="text-muted-foreground">
										Onboarding data will be loaded here
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
