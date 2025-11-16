/**
 * Job Estimates Section
 * Displays list of estimates linked to this job
 */

"use client";

import { ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { updateEntityTags } from "@/actions/entity-tags";
import { EntityTags } from "@/components/shared/tags/entity-tags";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type JobEstimatesProps = {
	estimates: any[];
	jobId: string;
};

export function JobEstimates({ estimates, jobId }: JobEstimatesProps) {
	const formatCurrency = (amount: number | null | undefined): string => {
		if (amount === null || amount === undefined) {
			return "$0.00";
		}
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	const formatDate = (dateString: string | null) => {
		if (!dateString) {
			return "—";
		}
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const getStatusVariant = (status: string) => {
		const statusMap: Record<
			string,
			"default" | "secondary" | "outline" | "destructive"
		> = {
			draft: "outline",
			sent: "secondary",
			accepted: "default",
			declined: "destructive",
			expired: "destructive",
		};
		return statusMap[status] || "outline";
	};

	if (estimates.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<FileText className="mb-4 size-12 text-muted-foreground" />
				<h3 className="mb-2 font-semibold text-lg">No Estimates</h3>
				<p className="mb-4 text-muted-foreground text-sm">
					Create an estimate for this job to get started.
				</p>
				<Button asChild size="sm">
					<Link href={`/dashboard/work/estimates/new?jobId=${jobId}`}>
						Create Estimate
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="overflow-x-auto rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Estimate #</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Created</TableHead>
							<TableHead>Tags</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{estimates.map((estimate) => (
							<TableRow key={estimate.id}>
								<TableCell className="font-medium">
									#{estimate.estimate_number || estimate.id.slice(0, 8)}
								</TableCell>
								<TableCell>
									<Badge variant={getStatusVariant(estimate.status)}>
										{estimate.status || "draft"}
									</Badge>
								</TableCell>
								<TableCell>
									{formatCurrency(estimate.total_amount || estimate.total)}
								</TableCell>
								<TableCell>{formatDate(estimate.created_at)}</TableCell>
								<TableCell className="max-w-[280px] align-top">
									<EntityTags
										entityId={estimate.id}
										entityType="estimate"
										onUpdateTags={(id, tags) =>
											updateEntityTags("estimate", id, tags)
										}
										tags={
											Array.isArray(estimate?.metadata?.tags)
												? (estimate.metadata.tags as any[])
												: []
										}
									/>
								</TableCell>
								<TableCell className="text-right">
									<Button asChild size="sm" variant="ghost">
										<Link href={`/dashboard/work/estimates/${estimate.id}`}>
											View
											<ChevronRight className="ml-1 size-4" />
										</Link>
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Summary */}
			<div className="flex items-center justify-between rounded-md bg-muted/50 p-4">
				<div>
					<p className="font-medium text-sm">Total Estimates</p>
					<p className="text-muted-foreground text-xs">
						{estimates.length} estimate{estimates.length !== 1 ? "s" : ""}
					</p>
				</div>
				<div className="text-right">
					<p className="font-medium text-sm">Total Value</p>
					<p className="text-muted-foreground text-xs">
						{formatCurrency(
							estimates.reduce(
								(sum, est) => sum + (est.total_amount || est.total || 0),
								0,
							),
						)}
					</p>
				</div>
			</div>

			{/* Create New Button */}
			<Button asChild className="w-full" size="sm" variant="outline">
				<Link href={`/dashboard/work/estimates/new?jobId=${jobId}`}>
					Create New Estimate
				</Link>
			</Button>
		</div>
	);
}
