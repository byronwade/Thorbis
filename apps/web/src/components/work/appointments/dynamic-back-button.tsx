"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Dynamic Back Button
 *
 * Goes back to the referring page (e.g., job details) or falls back to appointments list
 * Shows job number when navigating back to a specific job
 */
export function DynamicBackButton() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const jobId = searchParams.get("jobId");
	const [jobNumber, setJobNumber] = useState<string | null>(null);

	// Fetch job number from localStorage cache if available
	useEffect(() => {
		if (jobId) {
			// Try to get from localStorage first (cached from job detail page)
			const cachedJob = localStorage.getItem(`job_${jobId}`);
			if (cachedJob) {
				try {
					const job = JSON.parse(cachedJob);
					setJobNumber(job.job_number);
				} catch (e) {
					// If parsing fails, ignore
				}
			}
		}
	}, [jobId]);

	const handleBack = () => {
		// If we have a jobId, go back to that job
		if (jobId) {
			router.push(`/dashboard/work/${jobId}`);
		} else {
			// Otherwise go back in history or to appointments list
			if (window.history.length > 1) {
				router.back();
			} else {
				router.push("/dashboard/work/appointments");
			}
		}
	};

	// Determine button text
	const buttonText = jobNumber ? `Job #${jobNumber}` : jobId ? "Job" : "Back";

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={handleBack}
			className="h-8 gap-1.5"
		>
			<ArrowLeft className="size-4" />
			{buttonText}
		</Button>
	);
}
