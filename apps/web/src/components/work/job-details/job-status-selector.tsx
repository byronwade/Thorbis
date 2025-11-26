/**
 * Job Status Selector with Transition Validation
 *
 * Smart status selector that:
 * - Shows only valid next statuses based on current status
 * - Displays warnings for transitions with missing requirements
 * - Provides clear feedback on blocked transitions
 * - Integrates with job editor state
 */

"use client";

import {
	AlertCircle,
	ArrowRight,
	CheckCircle2,
	HelpCircle,
	Info,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	getAllowedNextStatuses,
	getRecommendedNextStatus,
	getStatusLabel,
	getStatusVariant,
	type JobStatus,
	type JobStatusTransitionContext,
	validateStatusTransition,
} from "@/lib/validations/job-status-transitions";

interface JobStatusSelectorProps {
	currentStatus: JobStatus;
	onStatusChange: (newStatus: JobStatus) => void;
	job: {
		id: string;
		scheduled_start?: string | null;
		scheduled_end?: string | null;
		assigned_to?: string | null;
		customer_id?: string | null;
		property_id?: string | null;
		total_amount?: number | null;
		invoices?: Array<{ status: string; total_amount: number }>;
		estimates?: Array<{ status: string }>;
		teamAssignments?: Array<{ team_member_id: string }>;
	};
	disabled?: boolean;
	showAllStatuses?: boolean;
}

export function JobStatusSelector({
	currentStatus,
	onStatusChange,
	job,
	disabled = false,
	showAllStatuses = false,
}: JobStatusSelectorProps) {
	// Get allowed next statuses
	const allowedStatuses = useMemo(() => {
		const allowed = getAllowedNextStatuses(currentStatus);
		return [currentStatus, ...allowed]; // Include current status
	}, [currentStatus]);

	// Get recommended next status
	const recommendedStatus = useMemo(
		() => getRecommendedNextStatus(currentStatus),
		[currentStatus],
	);

	// All possible statuses (for admin mode)
	const allStatuses: JobStatus[] = [
		"quoted",
		"scheduled",
		"in_progress",
		"on_hold",
		"completed",
		"cancelled",
		"invoiced",
		"paid",
	];

	const statusesToShow = showAllStatuses ? allStatuses : allowedStatuses;

	// Validate a specific status transition
	const getTransitionValidation = useCallback(
		(newStatus: JobStatus) => {
			if (newStatus === currentStatus) {
				return { allowed: true };
			}

			const context: JobStatusTransitionContext = {
				currentStatus,
				newStatus,
				job,
			};

			return validateStatusTransition(context);
		},
		[currentStatus, job],
	);

	// Handle status change
	const handleStatusChange = useCallback(
		(value: string) => {
			const newStatus = value as JobStatus;
			const validation = getTransitionValidation(newStatus);

			if (validation.allowed) {
				onStatusChange(newStatus);
			}
		},
		[getTransitionValidation, onStatusChange],
	);

	// Get validation info for current selected status (if different from current)
	const selectedValidation = useMemo(() => {
		return getTransitionValidation(currentStatus);
	}, [currentStatus, getTransitionValidation]);

	// Get workflow info for current status
	const workflowInfo = useMemo(() => {
		const nextSteps = allowedStatuses.filter((s) => s !== currentStatus);
		return {
			current: getStatusLabel(currentStatus),
			nextSteps: nextSteps.map((s) => getStatusLabel(s)),
			recommended: recommendedStatus ? getStatusLabel(recommendedStatus) : null,
		};
	}, [currentStatus, allowedStatuses, recommendedStatus]);

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<div className="flex-1">
					<Select
						value={currentStatus}
						onValueChange={handleStatusChange}
						disabled={disabled}
					>
						<SelectTrigger className="w-full">
							<SelectValue>
								<div className="flex items-center gap-2">
									<Badge variant={getStatusVariant(currentStatus)}>
										{getStatusLabel(currentStatus)}
									</Badge>
									{recommendedStatus && currentStatus !== recommendedStatus && (
										<span className="text-muted-foreground text-xs">
											→ Next: {getStatusLabel(recommendedStatus)}
										</span>
									)}
								</div>
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{statusesToShow.map((status) => {
								const validation = getTransitionValidation(status);
								const isBlocked = !validation.allowed;
								const isCurrent = status === currentStatus;
								const isRecommended = status === recommendedStatus;

								return (
									<SelectItem
										key={status}
										value={status}
										disabled={isBlocked && !isCurrent}
										className="flex items-center gap-2"
									>
										<div className="flex items-center gap-2">
											<Badge
												variant={getStatusVariant(status)}
												className="text-xs"
											>
												{getStatusLabel(status)}
											</Badge>

											{isCurrent && (
												<span className="text-muted-foreground text-xs">
													(current)
												</span>
											)}

											{isRecommended && !isCurrent && (
												<span className="text-primary text-xs">
													(recommended)
												</span>
											)}

											{isBlocked && !isCurrent && (
												<span className="text-destructive text-xs">
													<AlertCircle className="inline h-3 w-3" />
												</span>
											)}

											{validation.warnings &&
												validation.warnings.length > 0 && (
													<span className="text-yellow-600 text-xs">
														<Info className="inline h-3 w-3" />
													</span>
												)}
										</div>

										{/* Show reason for blocked transitions */}
										{isBlocked && !isCurrent && validation.reason && (
											<div className="text-destructive mt-1 text-xs">
												{validation.reason}
											</div>
										)}

										{/* Show required fields */}
										{isBlocked &&
											!isCurrent &&
											validation.requiredFields &&
											validation.requiredFields.length > 0 && (
												<div className="text-destructive mt-1 text-xs">
													Missing: {validation.requiredFields.join(", ")}
												</div>
											)}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>

				{/* Subtle workflow info popover */}
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
						>
							<HelpCircle className="h-4 w-4" />
							<span className="sr-only">View workflow information</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-80" align="start">
						<div className="space-y-3">
							<div>
								<h4 className="mb-2 font-semibold text-sm">
									Current Status: {workflowInfo.current}
								</h4>
								<p className="text-muted-foreground text-xs">
									This job is currently in the{" "}
									{workflowInfo.current.toLowerCase()} stage.
								</p>
							</div>

							{workflowInfo.nextSteps.length > 0 && (
								<div>
									<h4 className="mb-2 flex items-center gap-1 font-semibold text-sm">
										<ArrowRight className="h-3 w-3" />
										Available Next Steps
									</h4>
									<ul className="space-y-1">
										{workflowInfo.nextSteps.map((step, idx) => (
											<li
												key={idx}
												className={`flex items-center gap-2 text-xs ${step === workflowInfo.recommended ? "text-primary font-medium" : "text-muted-foreground"}`}
											>
												<CheckCircle2 className="h-3 w-3" />
												{step}
												{step === workflowInfo.recommended && (
													<Badge variant="default" className="ml-auto text-xs">
														Recommended
													</Badge>
												)}
											</li>
										))}
									</ul>
								</div>
							)}

							{workflowInfo.nextSteps.length === 0 &&
								currentStatus !== "paid" && (
									<div>
										<p className="text-muted-foreground text-xs">
											This status cannot be changed further. Job is complete.
										</p>
									</div>
								)}

							{currentStatus === "paid" && (
								<div className="rounded-md border-green-600 bg-green-50 p-2 dark:bg-green-950">
									<p className="text-green-900 text-xs dark:text-green-100">
										✓ Job is fully paid. No further status changes allowed.
									</p>
								</div>
							)}

							<div className="border-t pt-2">
								<p className="text-muted-foreground text-xs italic">
									Status changes follow your workflow rules. Some transitions
									may require additional information like dates, assignments, or
									invoices.
								</p>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>

			{/* Show warnings for current status */}
			{selectedValidation.warnings &&
				selectedValidation.warnings.length > 0 && (
					<Alert variant="default" className="border-yellow-600">
						<Info className="h-4 w-4 text-yellow-600" />
						<AlertDescription>
							<ul className="list-disc space-y-1 pl-4">
								{selectedValidation.warnings.map((warning, idx) => (
									<li key={idx} className="text-sm">
										{warning}
									</li>
								))}
							</ul>
						</AlertDescription>
					</Alert>
				)}

			{/* Show success message if status is paid */}
			{currentStatus === "paid" && (
				<Alert variant="default" className="border-green-600">
					<CheckCircle2 className="h-4 w-4 text-green-600" />
					<AlertDescription>
						This job is marked as paid. No further status changes are allowed.
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
