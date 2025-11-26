/**
 * Job Details Page - Streaming Server Component (OPTIMIZED + OPTIMISTIC)
 *
 * PERFORMANCE OPTIMIZATION (2025-11-18):
 * - Uses single RPC query with LATERAL joins
 * - Streaming Suspense boundaries for instant UI
 * - Progressive enhancement: show skeleton → show data
 * - Speed: Instant skeleton, data streams in as ready
 *
 * OPTIMISTIC UI PATTERNS:
 * 1. Instant skeleton/shell rendering
 * 2. Progressive data streaming with Suspense
 * 3. Independent section loading (header first, details stream)
 * 4. No full-page blocking
 */

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getAvailableTeamMembers } from "@/actions/team-assignments";
import { Skeleton } from "@/components/ui/skeleton";
import { JobHelpFooter } from "@/components/work/job-details/job-help-footer";
import { JobPageContent } from "@/components/work/job-details/job-page-content";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getJobComplete } from "@/lib/queries/job-details";
import { calculateJobMetrics } from "@/lib/queries/job-metrics";
import { getJob } from "@/queries/jobs";

// Skeleton for individual sections
function JobSectionSkeleton() {
	return (
		<div className="space-y-3">
			<Skeleton className="h-8 w-full" />
			<Skeleton className="h-24 w-full" />
			<Skeleton className="h-24 w-full" />
		</div>
	);
}

// Minimal skeleton for instant page shell
function JobPageSkeleton() {
	return (
		<div className="flex h-full w-full flex-col space-y-6 p-6">
			{/* Header skeleton - shows instantly */}
			<div className="space-y-4">
				<Skeleton className="h-10 w-64" />
				<div className="flex gap-4">
					<Skeleton className="h-20 w-48" />
					<Skeleton className="h-20 w-48" />
					<Skeleton className="h-20 w-48" />
				</div>
			</div>

			{/* Content sections skeleton */}
			<div className="grid gap-6 lg:grid-cols-2">
				<JobSectionSkeleton />
				<JobSectionSkeleton />
			</div>
			<div className="grid gap-6">
				<JobSectionSkeleton />
				<JobSectionSkeleton />
			</div>
		</div>
	);
}

// Job details with all nested data
async function JobDetails({ jobId }: { jobId: string }) {
	const companyId = await getActiveCompanyId();
	if (!companyId) return notFound();

	// This is the slow RPC query - wrapped in its own Suspense
	const [jobCompleteResult, jobResult, availableMembersResult] =
		await Promise.all([
			getJobComplete(jobId, companyId),
			getJob(jobId),
			getAvailableTeamMembers(),
		]);

	if (!jobCompleteResult.success) {
		console.error("Failed to load job complete data:", jobCompleteResult.error);
		if (!jobResult.success || !jobResult.data) {
			return notFound();
		}
	}

	if (!jobResult.success || !jobResult.data) {
		return notFound();
	}

	const availableTeamMembers =
		availableMembersResult.success && Array.isArray(availableMembersResult.data)
			? availableMembersResult.data
			: [];

	if (!availableMembersResult.success) {
		console.error(
			"Failed to load available team members:",
			availableMembersResult.error,
		);
	}

	// Process team assignments from RPC result
	const teamAssignments = (jobCompleteResult.data?.teamAssignments || []).map(
		(assignment: any) => {
			const member = assignment.team_member;
			const memberUser = member?.user;

			const snakeCaseUser = memberUser
				? {
						id: memberUser.id,
						email: memberUser.email,
						first_name: memberUser.name?.split(" ")[0] || "",
						last_name: memberUser.name?.split(" ").slice(1).join(" ") || "",
						avatar_url: memberUser.avatar,
						phone: memberUser.phone,
						name: memberUser.name || memberUser.email,
						raw_user_meta_data: {
							first_name: memberUser.name?.split(" ")[0] || "",
							last_name: memberUser.name?.split(" ").slice(1).join(" ") || "",
							avatar_url: memberUser.avatar,
						},
					}
				: null;

			const teamMemberSnake = member
				? {
						id: member.id,
						user_id: member.user_id,
						job_title: member.job_title,
						company_id: companyId,
						status: member.status ?? "active",
						user: snakeCaseUser,
						users: snakeCaseUser ? [snakeCaseUser] : [],
					}
				: null;

			return {
				...assignment,
				jobId: assignment.job_id,
				job_id: assignment.job_id,
				team_member_id: assignment.team_member_id,
				assigned_at: assignment.assigned_at,
				assigned_by: assignment.assigned_by,
				team_member: teamMemberSnake,
			};
		},
	);

	console.log("✅ Optimized job data loaded:", {
		invoices: jobCompleteResult.data?.invoices?.length || 0,
		estimates: jobCompleteResult.data?.estimates?.length || 0,
		payments: jobCompleteResult.data?.payments?.length || 0,
		appointments: jobCompleteResult.data?.appointments?.length || 0,
		teamAssignments: teamAssignments.length,
	});

	const jobData = {
		job: jobResult.data,
		customer:
			jobCompleteResult.data?.customer ?? jobResult.data.customer ?? null,
		property:
			jobCompleteResult.data?.property ?? jobResult.data.property ?? null,
		schedules: jobCompleteResult.data?.appointments || [],
		invoices: jobCompleteResult.data?.invoices || [],
		estimates: jobCompleteResult.data?.estimates || [],
		payments: jobCompleteResult.data?.payments || [],
		purchaseOrders: jobCompleteResult.data?.purchaseOrders || [],
		activities: [],
		customerNotes: jobCompleteResult.data?.customerNotes || [],
		jobNotes: jobCompleteResult.data?.jobNotes || [],
		jobEquipment: jobCompleteResult.data?.jobEquipment || [],
		teamAssignments,
		availableTeamMembers,
	};

	// Calculate comprehensive job metrics
	const metrics = calculateJobMetrics({
		job: jobResult.data,
		invoices: jobCompleteResult.data?.invoices || [],
		estimates: jobCompleteResult.data?.estimates || [],
		payments: jobCompleteResult.data?.payments || [],
		purchaseOrders: jobCompleteResult.data?.purchaseOrders || [],
		timeEntries: jobCompleteResult.data?.timeEntries || [],
		tasks: jobCompleteResult.data?.tasks || [],
	});

	console.log("✅ Job metrics calculated:", {
		totalRevenue: metrics.financial.totalRevenue / 100,
		netProfit: metrics.financial.netProfit / 100,
		profitMargin: metrics.financial.profitMargin.toFixed(1) + "%",
		totalHours: metrics.time.totalHoursLogged,
		overallProgress: metrics.completion.overallProgress.toFixed(1) + "%",
		health: metrics.summary.health,
		healthScore: metrics.summary.healthScore,
	});

	return (
		<JobPageContent entityData={jobData} jobData={jobData} metrics={metrics} />
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: _id } = await params;
	return {
		title: "Job Details",
	};
}

export default async function JobDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: jobId } = await params;

	return (
		<div className="flex h-full w-full flex-col">
			{/* Main Content */}
			<div className="flex-1">
				{/* Job details with streaming data */}
				<Suspense
					fallback={
						<div className="space-y-6 p-6">
							<div className="space-y-4">
								<Skeleton className="h-10 w-64" />
								<div className="flex gap-4">
									<Skeleton className="h-20 w-48" />
									<Skeleton className="h-20 w-48" />
									<Skeleton className="h-20 w-48" />
								</div>
							</div>
							<div className="grid gap-6 lg:grid-cols-2">
								<JobSectionSkeleton />
								<JobSectionSkeleton />
							</div>
							<div className="grid gap-6">
								<JobSectionSkeleton />
								<JobSectionSkeleton />
							</div>
						</div>
					}
				>
					<JobDetails jobId={jobId} />
				</Suspense>
			</div>

			{/* Help Footer - Below the fold, full width, distinct styling */}
			<JobHelpFooter />
		</div>
	);
}
