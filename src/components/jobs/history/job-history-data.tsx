/**
 * Job History Data - Async Server Component
 *
 * Displays job history content.
 * This component is wrapped in Suspense for PPR pattern.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function JobHistoryData() {
	// Future: Fetch real job history
	// const jobs = await fetchCompletedJobs();

	const sampleJobs = [
		{
			jobId: "JOB-001",
			customer: "ABC Corporation",
			service: "HVAC Maintenance",
			technician: "John Smith",
			completed: "2024-01-25 2:30 PM",
			duration: "2.5 hours",
			rating: "5.0",
			revenue: "$150",
		},
		{
			jobId: "JOB-002",
			customer: "XYZ Industries",
			service: "Plumbing Repair",
			technician: "Sarah Johnson",
			completed: "2024-01-25 1:45 PM",
			duration: "1.5 hours",
			rating: "4.8",
			revenue: "$120",
		},
		{
			jobId: "JOB-003",
			customer: "TechStart Inc",
			service: "Electrical Service",
			technician: "Mike Davis",
			completed: "2024-01-24 4:15 PM",
			duration: "3.0 hours",
			rating: "5.0",
			revenue: "$200",
		},
		{
			jobId: "JOB-004",
			customer: "Global Systems",
			service: "AC Maintenance",
			technician: "Lisa Wilson",
			completed: "2024-01-24 2:45 PM",
			duration: "2.0 hours",
			rating: "4.9",
			revenue: "$150",
		},
		{
			jobId: "JOB-005",
			customer: "123 Manufacturing",
			service: "Heater Repair",
			technician: "Tom Brown",
			completed: "2024-01-23 3:30 PM",
			duration: "2.5 hours",
			rating: "4.7",
			revenue: "$180",
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
			<Card className="col-span-4">
				<CardHeader>
					<CardTitle>Recent Job History</CardTitle>
					<CardDescription>Latest completed jobs and service records</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{sampleJobs.map((job, index) => (
							<div className="flex items-center gap-4 rounded-lg border p-4" key={index}>
								<div className="bg-accent flex size-12 items-center justify-center rounded-full">
									<span className="text-sm font-medium">{job.jobId}</span>
								</div>
								<div className="flex-1 space-y-1">
									<div className="flex items-center gap-2">
										<p className="text-sm leading-none font-medium">{job.customer}</p>
										<span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
											⭐ {job.rating}
										</span>
									</div>
									<p className="text-muted-foreground text-sm">
										{job.service} • {job.technician}
									</p>
									<p className="text-muted-foreground text-sm">
										Completed: {job.completed} • Duration: {job.duration}
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-medium">{job.revenue}</p>
									<p className="text-muted-foreground text-xs">Revenue</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card className="col-span-3">
				<CardHeader>
					<CardTitle>History Analytics</CardTitle>
					<CardDescription>Job performance and trends</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="bg-accent flex items-center justify-between rounded-lg p-3">
							<div>
								<p className="text-sm font-medium">Most Common Service</p>
								<p className="text-muted-foreground text-xs">HVAC Maintenance</p>
							</div>
							<div className="text-right">
								<p className="text-sm font-bold">45%</p>
								<p className="text-muted-foreground text-xs">of all jobs</p>
							</div>
						</div>
						<div className="bg-accent flex items-center justify-between rounded-lg p-3">
							<div>
								<p className="text-sm font-medium">Average Job Value</p>
								<p className="text-muted-foreground text-xs">Per completed job</p>
							</div>
							<div className="text-right">
								<p className="text-sm font-bold">$180</p>
								<p className="text-muted-foreground text-xs">+$15 from last month</p>
							</div>
						</div>
						<div className="bg-accent flex items-center justify-between rounded-lg p-3">
							<div>
								<p className="text-sm font-medium">Top Technician</p>
								<p className="text-muted-foreground text-xs">By completion rate</p>
							</div>
							<div className="text-right">
								<p className="text-sm font-bold">John Smith</p>
								<p className="text-muted-foreground text-xs">98% completion</p>
							</div>
						</div>
						<div className="bg-accent flex items-center justify-between rounded-lg p-3">
							<div>
								<p className="text-sm font-medium">Customer Retention</p>
								<p className="text-muted-foreground text-xs">Repeat customers</p>
							</div>
							<div className="text-right">
								<p className="text-sm font-bold">78%</p>
								<p className="text-muted-foreground text-xs">+3% from last quarter</p>
							</div>
						</div>
						<div className="bg-accent flex items-center justify-between rounded-lg p-3">
							<div>
								<p className="text-sm font-medium">Revenue Growth</p>
								<p className="text-muted-foreground text-xs">This month</p>
							</div>
							<div className="text-right">
								<p className="text-sm font-bold">+12%</p>
								<p className="text-muted-foreground text-xs">vs last month</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
