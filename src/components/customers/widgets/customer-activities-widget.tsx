/**
 * Customer Activities Widget - Progressive Loading
 *
 * Note: Uses customer_activities table (not activity_log)
 */

"use client";

import { Activity } from "lucide-react";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { Button } from "@/components/ui/button";
import { useCustomerActivities } from "@/hooks/use-customer-360";
import { formatDate } from "@/lib/formatters";

type CustomerActivitiesWidgetProps = {
	customerId: string;
	loadImmediately?: boolean;
};

export function CustomerActivitiesWidget({
	customerId,
	loadImmediately = false,
}: CustomerActivitiesWidgetProps) {
	return (
		<ProgressiveWidget
			title="Recent Activity"
			icon={<Activity className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const { data: activities, isLoading, error } = useCustomerActivities(
					customerId,
					isVisible,
				);

				if (isLoading) return <WidgetSkeleton rows={4} />;
				if (error)
					return (
						<div className="text-center text-muted-foreground text-sm">
							Failed to load activities
						</div>
					);
				if (!activities || activities.length === 0)
					return (
						<div className="text-center text-muted-foreground text-sm">
							No recent activity
						</div>
					);

				return (
					<div className="space-y-3">
						{activities.slice(0, 10).map((activity) => (
							<div
								key={activity.id}
								className="rounded-lg border p-3"
							>
								<div className="space-y-1">
									<p className="font-medium text-sm">
										{activity.activity_type || "Activity"}
									</p>
									{activity.description && (
										<p className="text-muted-foreground text-sm line-clamp-2">
											{activity.description}
										</p>
									)}
									<p className="text-muted-foreground text-xs">
										{formatDate(activity.created_at)}
									</p>
								</div>
							</div>
						))}

						{activities.length > 10 && (
							<Button variant="outline" size="sm" className="w-full">
								View All Activity
							</Button>
						)}
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
