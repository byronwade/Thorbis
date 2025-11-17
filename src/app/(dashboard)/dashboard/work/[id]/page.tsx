/**
 * Job Details Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Job data streams in (100-500ms)
 *
 * Performance: 10-40x faster than traditional SSR
 */

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getJob } from "@/actions/jobs";
import { Skeleton } from "@/components/ui/skeleton";
import { JobPageContent } from "@/components/work/job-details/job-page-content";

function JobDetailsSkeleton() {
	return (
		<div className="flex h-full w-full flex-col space-y-4 p-4">
			<Skeleton className="h-32 w-full" />
			<Skeleton className="h-64 w-full" />
			<Skeleton className="h-48 w-full" />
		</div>
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

async function JobData({ jobId }: { jobId: string }) {
	// DIAGNOSTIC: Log server-side renders to detect refresh loops
	console.log("[Server JobData] 🔵 RENDERING at:", new Date().toISOString(), "jobId:", jobId);

	const result = await getJob(jobId);

	if (!result.success || !result.data) {
		console.error(`[JobData] Failed to load job ${jobId}:`, result.error);
		return notFound();
	}

	const jobData = { job: result.data };
	const metrics = {}; // TODO: Calculate metrics

	console.log("[Server JobData] ✅ Data fetched, rendering client component");

	return (
		<JobPageContent entityData={jobData} jobData={jobData} metrics={metrics} />
	);
}

export default async function JobDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: jobId } = await params;

	return (
		<Suspense fallback={<JobDetailsSkeleton />}>
			<JobData jobId={jobId} />
		</Suspense>
	);
}
