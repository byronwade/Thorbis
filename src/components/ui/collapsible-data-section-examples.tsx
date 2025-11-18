/**
 * CollapsibleDataSection - Usage Examples
 *
 * Demonstrates all features and patterns for using the unified collapsible component
 */

"use client";

import { Briefcase, FileText, Plus } from "lucide-react";
import { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import {
	CollapsibleActionButton,
	CollapsibleDataSection,
	EmptyStateActionButton,
} from "@/components/ui/collapsible-data-section";

/**
 * Example 1: Basic Usage (Accordion Mode)
 * Use this pattern when you have multiple collapsible sections in a page
 */
export function BasicAccordionExample() {
	return (
		<Accordion defaultValue={["jobs", "invoices"]} type="multiple">
			<CollapsibleDataSection
				actions={
					<CollapsibleActionButton
						icon={<Plus className="size-4" />}
						onClick={() => {}}
					>
						Add Job
					</CollapsibleActionButton>
				}
				count={5}
				icon={<Briefcase className="size-5" />}
				title="Jobs"
				value="jobs"
			>
				<div>Job content here...</div>
			</CollapsibleDataSection>

			<CollapsibleDataSection
				actions={
					<CollapsibleActionButton
						icon={<Plus className="size-4" />}
						onClick={() => {}}
					>
						Add Invoice
					</CollapsibleActionButton>
				}
				count={3}
				icon={<FileText className="size-5" />}
				title="Invoices"
				value="invoices"
			>
				<div>Invoice content here...</div>
			</CollapsibleDataSection>
		</Accordion>
	);
}

/**
 * Example 2: Standalone Mode
 * Use this pattern when you have a single collapsible section
 * or need custom open/close control
 */
export function StandaloneExample() {
	return (
		<CollapsibleDataSection
			actions={
				<CollapsibleActionButton
					icon={<Plus className="size-4" />}
					onClick={() => {}}
				>
					Add Job
				</CollapsibleActionButton>
			}
			count={5}
			defaultOpen={true}
			icon={<Briefcase className="size-5" />}
			standalone={true}
			storageKey="my-jobs-section" // This enables standalone mode
			title="Jobs" // Persists state to localStorage
			value="jobs"
		>
			<div>Job content here...</div>
		</CollapsibleDataSection>
	);
}

/**
 * Example 3: Loading State
 * Show a skeleton loader while data is being fetched
 */
export function LoadingStateExample() {
	const [isLoading, _setIsLoading] = useState(true);

	return (
		<CollapsibleDataSection
			actions={
				<CollapsibleActionButton
					icon={<Plus className="size-4" />}
					onClick={() => {}}
				>
					Add Job
				</CollapsibleActionButton>
			}
			icon={<Briefcase className="size-5" />}
			isLoading={isLoading}
			standalone={true} // Shows skeleton when true
			title="Jobs"
			value="jobs"
		>
			<div>Job content here...</div>
		</CollapsibleDataSection>
	);
}

/**
 * Example 4: Error State
 * Display an error message when data fetch fails
 */
export function ErrorStateExample() {
	const error = "Failed to load jobs. Please try again.";

	return (
		<CollapsibleDataSection
			actions={
				<CollapsibleActionButton
					icon={<Plus className="size-4" />}
					onClick={() => {}}
				>
					Retry
				</CollapsibleActionButton>
			}
			error={error}
			icon={<Briefcase className="size-5" />}
			standalone={true} // Shows error message
			title="Jobs"
			value="jobs"
		>
			<div>Job content here...</div>
		</CollapsibleDataSection>
	);
}

/**
 * Example 5: Empty State
 * Show a helpful empty state when there's no data
 */
export function EmptyStateExample() {
	const handleAddJob = () => {};

	return (
		<CollapsibleDataSection
			actions={
				<CollapsibleActionButton
					icon={<Plus className="size-4" />}
					onClick={handleAddJob}
				>
					Add Job
				</CollapsibleActionButton>
			}
			count={0}
			emptyState={{
				show: true,
				icon: <Briefcase className="text-muted-foreground h-8 w-8" />,
				title: "No jobs found",
				description: "Get started by creating your first job.",
				action: (
					<EmptyStateActionButton
						icon={<Plus className="size-4" />}
						onClick={handleAddJob}
					>
						Add Job
					</EmptyStateActionButton>
				),
			}}
			fullWidthContent={true}
			icon={<Briefcase className="size-5" />}
			standalone={true}
			title="Jobs"
			value="jobs"
		>
			<div>This content is hidden when empty state is shown</div>
		</CollapsibleDataSection>
	);
}

/**
 * Example 6: Full-Width Content (for datatables)
 * Use fullWidthContent for tables that need to extend to edges
 */
export function FullWidthContentExample() {
	return (
		<CollapsibleDataSection
			actions={
				<CollapsibleActionButton
					icon={<Plus className="size-4" />}
					onClick={() => {}}
				>
					Add Job
				</CollapsibleActionButton>
			}
			count={10}
			fullWidthContent={true}
			icon={<Briefcase className="size-5" />}
			standalone={true}
			title="Jobs" // Removes padding for full-width tables
			value="jobs"
		>
			{/* Your full-width datatable here */}
			<div className="border-t">Full-width table content...</div>
		</CollapsibleDataSection>
	);
}

/**
 * Example 7: Optimistic Updates
 * Show immediate feedback while waiting for server response
 */
export function OptimisticUpdateExample() {
	const [isLoading, setIsLoading] = useState(false);
	const [count, setCount] = useState(5);

	const handleAddJob = async () => {
		// Optimistic update - increment count immediately
		setCount((prev) => prev + 1);
		setIsLoading(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			// Success - count is already updated
		} catch (_error) {
			// Rollback on error
			setCount((prev) => prev - 1);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<CollapsibleDataSection
			actions={
				<CollapsibleActionButton
					disabled={isLoading}
					icon={<Plus className="size-4" />}
					isLoading={isLoading}
					onClick={handleAddJob}
				>
					Add Job
				</CollapsibleActionButton>
			}
			count={count}
			icon={<Briefcase className="size-5" />}
			isLoading={isLoading}
			standalone={true}
			title="Jobs"
			value="jobs"
		>
			<div>Job list with {count} items...</div>
		</CollapsibleDataSection>
	);
}

/**
 * Example 8: Controlled State
 * Manually control the open/closed state
 */
export function ControlledStateExample() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="space-y-4">
			<button onClick={() => setIsOpen(!isOpen)}>
				Toggle Section (Currently: {isOpen ? "Open" : "Closed"})
			</button>

			<CollapsibleDataSection
				actions={
					<CollapsibleActionButton
						icon={<Plus className="size-4" />}
						onClick={() => {}}
					>
						Add Job
					</CollapsibleActionButton>
				}
				count={5}
				icon={<Briefcase className="size-5" />}
				isOpen={isOpen}
				onOpenChange={setIsOpen}
				standalone={true} // Controlled state
				title="Jobs" // State handler
				value="jobs"
			>
				<div>Job content here...</div>
			</CollapsibleDataSection>
		</div>
	);
}

/**
 * Example 9: Multiple Action Buttons
 * Show multiple actions in the header
 */
export function MultipleActionsExample() {
	return (
		<CollapsibleDataSection
			actions={
				<>
					<CollapsibleActionButton onClick={() => {}} variant="outline">
						Export
					</CollapsibleActionButton>
					<CollapsibleActionButton
						icon={<Plus className="size-4" />}
						onClick={() => {}}
					>
						Add Job
					</CollapsibleActionButton>
				</>
			}
			count={5}
			icon={<Briefcase className="size-5" />}
			standalone={true}
			title="Jobs"
			value="jobs"
		>
			<div>Job content here...</div>
		</CollapsibleDataSection>
	);
}

/**
 * Example 10: Complex Real-World Example
 * Combines multiple features for a production-ready implementation
 */
export function ComplexRealWorldExample() {
	const [jobs, setJobs] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Simulate data fetch
	useState(() => {
		setTimeout(() => {
			setJobs([
				{ id: 1, title: "Job 1" },
				{ id: 2, title: "Job 2" },
			]);
			setIsLoading(false);
		}, 1000);
	});

	const handleAddJob = async () => {
		// Optimistic update
		const tempId = Date.now();
		const newJob = { id: tempId, title: "New Job" };
		setJobs((prev) => [...prev, newJob]);

		try {
			// Simulate API call
			await new Promise((resolve, reject) =>
				setTimeout(
					() => (Math.random() > 0.5 ? resolve(true) : reject("Error")),
					1000,
				),
			);
		} catch (_err) {
			// Rollback on error
			setJobs((prev) => prev.filter((j) => j.id !== tempId));
			setError("Failed to add job");
			setTimeout(() => setError(null), 3000);
		}
	};

	return (
		<CollapsibleDataSection
			actions={
				<CollapsibleActionButton
					icon={<Plus className="size-4" />}
					onClick={handleAddJob}
				>
					Add Job
				</CollapsibleActionButton>
			}
			count={jobs.length}
			defaultOpen={true}
			emptyState={
				jobs.length === 0 && !isLoading && !error
					? {
							show: true,
							icon: <Briefcase className="text-muted-foreground h-8 w-8" />,
							title: "No jobs found",
							description: "Get started by creating your first job.",
							action: (
								<EmptyStateActionButton
									icon={<Plus className="size-4" />}
									onClick={handleAddJob}
								>
									Add Job
								</EmptyStateActionButton>
							),
						}
					: undefined
			}
			error={error}
			fullWidthContent={true}
			icon={<Briefcase className="size-5" />}
			isLoading={isLoading}
			standalone={true}
			storageKey="jobs-section-state"
			summary={jobs.length > 0 ? `${jobs.length} active jobs` : "No jobs yet"}
			title="Jobs"
			value="jobs"
		>
			<div className="space-y-2">
				{jobs.map((job) => (
					<div className="rounded border p-3" key={job.id}>
						{job.title}
					</div>
				))}
			</div>
		</CollapsibleDataSection>
	);
}
