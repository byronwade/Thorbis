import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

/**
 * Jobs Data - Async Server Component
 *
 * Currently uses static mock data, but split out so we can:
 * - Add real Supabase queries later without touching the PPR shell
 * - Stream this section independently under PPR
 */
export async function JobsData() {
	return (
		<>
			{/* Job Stats */}
			<div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
						<svg
							className="text-muted-foreground size-4"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Briefcase</title>
							<rect height="13" rx="2" width="20" x="2" y="6" />
							<path d="M12 6V2M6 6V2M18 6V2" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">24</div>
						<p className="text-muted-foreground text-xs">+3 from yesterday</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">In Progress</CardTitle>
						<svg
							className="text-muted-foreground size-4"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Clock</title>
							<circle cx="12" cy="12" r="10" />
							<path d="M12 6v6l4 2" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">12</div>
						<p className="text-muted-foreground text-xs">
							Average duration: 2.5h
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Completed Today
						</CardTitle>
						<svg
							className="text-muted-foreground size-4"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>CheckCircle</title>
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
							<path d="M22 4 12 14.01l-3-3" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">18</div>
						<p className="text-muted-foreground text-xs">94% completion rate</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Overdue</CardTitle>
						<svg
							className="text-muted-foreground size-4"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>AlertTriangle</title>
							<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
							<path d="M12 9v4M12 17h.01" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">2</div>
						<p className="text-muted-foreground text-xs">Need attention</p>
					</CardContent>
				</Card>
			</div>

			{/* Job Management */}
			<div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
				<Card className="lg:col-span-4">
					<CardHeader>
						<CardTitle>Active Jobs</CardTitle>
						<CardDescription>
							Current work orders and job assignments
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{[
								{
									jobId: "JOB-001",
									customer: "ABC Corporation",
									service: "HVAC Maintenance",
									technician: "John Smith",
									status: "In Progress",
									priority: "High",
									scheduled: "2024-01-25 2:00 PM",
									location: "123 Business Ave",
								},
								{
									jobId: "JOB-002",
									customer: "XYZ Industries",
									service: "Plumbing Repair",
									technician: "Sarah Johnson",
									status: "Assigned",
									priority: "Medium",
									scheduled: "2024-01-25 3:30 PM",
									location: "456 Industrial Blvd",
								},
								{
									jobId: "JOB-003",
									customer: "TechStart Inc",
									service: "Electrical Service",
									technician: "Mike Davis",
									status: "Pending",
									priority: "Low",
									scheduled: "2024-01-25 4:15 PM",
									location: "789 Tech Park",
								},
								{
									jobId: "JOB-004",
									customer: "Global Systems",
									service: "AC Maintenance",
									technician: "Lisa Wilson",
									status: "In Progress",
									priority: "Medium",
									scheduled: "2024-01-25 1:45 PM",
									location: "321 Corporate Dr",
								},
								{
									jobId: "JOB-005",
									customer: "123 Manufacturing",
									service: "Heater Repair",
									technician: "Tom Brown",
									status: "Overdue",
									priority: "High",
									scheduled: "2024-01-24 2:00 PM",
									location: "654 Factory St",
								},
							].map((job, index) => (
								<div
									className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 rounded-lg border p-3 md:p-4"
									key={index}
								>
									<div className="bg-accent flex size-10 md:size-12 items-center justify-center rounded-full shrink-0">
										<span className="text-xs md:text-sm font-medium">
											{job.jobId}
										</span>
									</div>
									<div className="flex-1 space-y-1 min-w-0">
										<div className="flex items-center gap-2 flex-wrap">
											<p className="text-sm leading-none font-medium truncate">
												{job.customer}
											</p>
											<span
												className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
													job.status === "In Progress"
														? "bg-primary text-primary"
														: job.status === "Assigned"
															? "bg-success text-success"
															: job.status === "Pending"
																? "bg-warning text-warning"
																: "bg-destructive text-destructive"
												}`}
											>
												{job.status}
											</span>
											<span
												className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
													job.priority === "High"
														? "bg-destructive text-destructive"
														: job.priority === "Medium"
															? "bg-warning text-warning"
															: "bg-success text-success"
												}`}
											>
												{job.priority}
											</span>
										</div>
										<p className="text-muted-foreground text-sm">
											{job.service} • {job.technician}
										</p>
										<p className="text-muted-foreground text-sm">
											{job.location}
										</p>
									</div>
									<div className="text-left sm:text-right mt-2 sm:mt-0 shrink-0">
										<p className="text-xs md:text-sm font-medium">
											{job.scheduled}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle>Job Summary</CardTitle>
						<CardDescription>
							Work order analytics and performance
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="bg-accent flex items-center justify-between rounded-lg p-3">
								<div>
									<p className="text-sm font-medium">Completion Rate</p>
									<p className="text-muted-foreground text-xs">This week</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-bold">94%</p>
									<p className="text-muted-foreground text-xs">
										+2% from last week
									</p>
								</div>
							</div>
							<div className="bg-accent flex items-center justify-between rounded-lg p-3">
								<div>
									<p className="text-sm font-medium">Average Duration</p>
									<p className="text-muted-foreground text-xs">Per job</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-bold">2.3h</p>
									<p className="text-muted-foreground text-xs">
										-0.2h from last month
									</p>
								</div>
							</div>
							<div className="bg-accent flex items-center justify-between rounded-lg p-3">
								<div>
									<p className="text-sm font-medium">On-Time Rate</p>
									<p className="text-muted-foreground text-xs">
										Scheduled vs actual
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-bold">89%</p>
									<p className="text-muted-foreground text-xs">
										+3% from last month
									</p>
								</div>
							</div>
							<div className="bg-accent flex items-center justify-between rounded-lg p-3">
								<div>
									<p className="text-sm font-medium">Customer Satisfaction</p>
									<p className="text-muted-foreground text-xs">
										Average rating
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-bold">4.8</p>
									<p className="text-muted-foreground text-xs">out of 5.0</p>
								</div>
							</div>
							<div className="bg-accent flex items-center justify-between rounded-lg p-3">
								<div>
									<p className="text-sm font-medium">Revenue This Week</p>
									<p className="text-muted-foreground text-xs">
										From completed jobs
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-bold">$24,500</p>
									<p className="text-muted-foreground text-xs">
										+$2,100 from last week
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
