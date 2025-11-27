/**
 * Porting Status Page
 *
 * Dedicated page for tracking phone number porting requests:
 * - View all active porting requests
 * - Track progress with visual timeline
 * - Receive real-time status updates
 * - Access troubleshooting help
 */

import { Suspense } from "react";
import { AppToolbar } from "@/components/layout/app-toolbar";
import {
	PortingStatusDashboard,
	type PortingRequest,
	type TimelineStage,
} from "@/components/telephony/porting-status-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
	title: "Number Porting Status | Communications Settings",
	description: "Track the progress of your phone number porting requests",
};

/**
 * Transform database porting request to dashboard format
 */
function transformPortingRequest(dbRequest: any): PortingRequest {
	// Build timeline stages based on status history or current status
	const statusHistory = dbRequest.status_history || [];
	const currentStatus = dbRequest.status || "submitted";

	// Default stages for porting workflow
	const stageDefinitions = [
		{
			id: "submitted",
			label: "Request Submitted",
			description: "Your porting request has been received and is being processed",
		},
		{
			id: "validation",
			label: "Validation",
			description: "Account details being verified with your current carrier",
		},
		{
			id: "foc",
			label: "FOC Pending",
			description: "Awaiting Firm Order Commitment from carrier",
		},
		{
			id: "porting",
			label: "Porting in Progress",
			description: "Number is being transferred",
		},
		{
			id: "complete",
			label: "Port Complete",
			description: "Your number is now active",
		},
	];

	// Determine current stage index
	const statusToStageMap: Record<string, number> = {
		submitted: 0,
		pending_validation: 1,
		validation_failed: 1,
		foc_pending: 2,
		foc_received: 3,
		in_progress: 3,
		porting_complete: 4,
		completed: 4,
		cancelled: -1,
		failed: -1,
	};

	const currentStageIndex = statusToStageMap[currentStatus] ?? 0;

	// Build stages array with status
	const stages: TimelineStage[] = stageDefinitions.map((def, index) => {
		let status: TimelineStage["status"] = "pending";

		if (currentStatus === "validation_failed" && index === 1) {
			status = "failed";
		} else if (currentStatus === "failed" || currentStatus === "cancelled") {
			status = index <= currentStageIndex ? "failed" : "pending";
		} else if (index < currentStageIndex) {
			status = "completed";
		} else if (index === currentStageIndex) {
			status = "current";
		}

		// Try to get completion date from history
		const historyEntry = statusHistory.find(
			(h: any) => h.stage === def.id || h.status === def.id,
		);

		return {
			...def,
			status,
			completedAt: historyEntry?.timestamp || (status === "completed" ? dbRequest.created_at : undefined),
			estimatedDate: index > currentStageIndex ? dbRequest.estimated_completion_date : undefined,
		};
	});

	return {
		id: dbRequest.id,
		phoneNumber: dbRequest.current_phone_number,
		currentCarrier: dbRequest.current_carrier || "Unknown Carrier",
		accountNumber: dbRequest.account_number || "",
		status: currentStatus as PortingRequest["status"],
		createdAt: dbRequest.created_at,
		estimatedCompletionDate: dbRequest.estimated_completion_date || dbRequest.foc_date || "",
		focDate: dbRequest.foc_date,
		actualCompletionDate: dbRequest.actual_port_date,
		failureReason: dbRequest.error_message,
		currentStage: Math.max(0, currentStageIndex),
		stages,
	};
}

async function PortingStatusData() {
	const supabase = await createClient();
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		return <PortingStatusDashboard requests={[]} />;
	}

	// Fetch porting requests from database
	const { data: dbRequests } = await supabase
		.from("phone_porting_requests")
		.select("*")
		.eq("company_id", activeCompanyId)
		.order("created_at", { ascending: false })
		.limit(20);

	// Transform database records to dashboard format
	const requests = (dbRequests || []).map(transformPortingRequest);

	return <PortingStatusDashboard requests={requests} />;
}

export default function PortingStatusPage() {
	return (
		<div className="flex h-full flex-col">
			{/* Page Header */}
			<AppToolbar config={{ show: true, title: "Number Porting Status" }} />

			{/* Porting Status Dashboard */}
			<div className="flex-1 overflow-auto">
				<Suspense fallback={<PortingStatusSkeleton />}>
					<PortingStatusData />
				</Suspense>
			</div>
		</div>
	);
}

function PortingStatusSkeleton() {
	return (
		<div className="space-y-4 p-6">
			<Skeleton className="h-8 w-64" />
			<Skeleton className="h-4 w-96" />
			{[...new Array(3)].map((_, i) => (
				<Skeleton className="h-40 w-full" key={i} />
			))}
		</div>
	);
}
