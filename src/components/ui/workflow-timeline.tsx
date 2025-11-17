/**
 * Workflow Timeline Component
 *
 * Displays the sales workflow progression: Estimate → Contract → Invoice → Payment
 * Shows completed stages with dates and links to related documents
 *
 * Server Component compatible
 */

import { Check, Circle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type WorkflowStage = {
	id: string;
	label: string;
	status: "completed" | "current" | "pending";
	date?: string;
	href?: string;
	description?: string;
};

type WorkflowTimelineProps = {
	stages: WorkflowStage[];
	className?: string;
};

export function WorkflowTimeline({ stages, className }: WorkflowTimelineProps) {
	return (
		<div className={cn("w-full", className)}>
			<div className="bg-card rounded-lg border p-6">
				<h3 className="mb-6 text-base font-semibold">Workflow Progress</h3>

				{/* Timeline */}
				<div className="relative">
					{/* Desktop view */}
					<div className="hidden md:block">
						<div className="flex items-center justify-between">
							{stages.map((stage, index) => (
								<div className="flex flex-1 items-center" key={stage.id}>
									<div className="flex flex-col items-center gap-2">
										{/* Stage Circle */}
										<div
											className={cn(
												"flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
												stage.status === "completed" && "border-success bg-success text-white",
												stage.status === "current" &&
													"border-primary bg-primary text-primary-foreground",
												stage.status === "pending" &&
													"border-muted-foreground/30 bg-muted text-muted-foreground"
											)}
										>
											{stage.status === "completed" ? (
												<Check className="h-5 w-5" />
											) : (
												<Circle className="h-4 w-4 fill-current" />
											)}
										</div>

										{/* Stage Label */}
										<div className="text-center">
											{stage.href ? (
												<Link
													className="hover:text-primary text-sm font-medium hover:underline"
													href={stage.href}
												>
													{stage.label}
												</Link>
											) : (
												<p
													className={cn(
														"text-sm font-medium",
														stage.status === "pending" && "text-muted-foreground"
													)}
												>
													{stage.label}
												</p>
											)}
											{stage.date && (
												<p className="text-muted-foreground text-xs">
													{new Date(stage.date).toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
													})}
												</p>
											)}
											{stage.description && (
												<p className="text-muted-foreground mt-1 text-xs">{stage.description}</p>
											)}
										</div>
									</div>

									{/* Connector Line */}
									{index < stages.length - 1 && (
										<div className="mx-2 flex-1">
											<div
												className={cn(
													"h-0.5 w-full transition-colors",
													stages[index + 1].status === "completed" ||
														stages[index + 1].status === "current"
														? "bg-success"
														: "bg-muted-foreground/20"
												)}
											/>
										</div>
									)}
								</div>
							))}
						</div>
					</div>

					{/* Mobile view */}
					<div className="md:hidden">
						<div className="space-y-4">
							{stages.map((stage, index) => (
								<div className="relative flex gap-4" key={stage.id}>
									{/* Vertical connector */}
									{index < stages.length - 1 && (
										<div className="bg-muted-foreground/20 absolute top-12 left-5 h-full w-0.5" />
									)}

									{/* Stage Circle */}
									<div
										className={cn(
											"flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
											stage.status === "completed" && "border-success bg-success text-white",
											stage.status === "current" &&
												"border-primary bg-primary text-primary-foreground",
											stage.status === "pending" &&
												"border-muted-foreground/30 bg-muted text-muted-foreground"
										)}
									>
										{stage.status === "completed" ? (
											<Check className="h-5 w-5" />
										) : (
											<Circle className="h-4 w-4 fill-current" />
										)}
									</div>

									{/* Stage Content */}
									<div className="flex-1 pb-8">
										{stage.href ? (
											<Link
												className="hover:text-primary font-medium hover:underline"
												href={stage.href}
											>
												{stage.label}
											</Link>
										) : (
											<p
												className={cn(
													"font-medium",
													stage.status === "pending" && "text-muted-foreground"
												)}
											>
												{stage.label}
											</p>
										)}
										{stage.date && (
											<p className="text-muted-foreground text-sm">
												{new Date(stage.date).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
												})}
											</p>
										)}
										{stage.description && (
											<p className="text-muted-foreground mt-1 text-sm">{stage.description}</p>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
