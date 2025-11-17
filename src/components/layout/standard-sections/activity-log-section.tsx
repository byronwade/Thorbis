"use client";

import { formatDistance } from "date-fns";
import { Activity } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UnifiedAccordionContent } from "@/components/ui/unified-accordion";

type ActivityLogSectionProps = {
	activities: any[];
};

export function ActivityLogSection({ activities }: ActivityLogSectionProps) {
	if (!activities || activities.length === 0) {
		return (
			<UnifiedAccordionContent>
				<div className="flex h-32 items-center justify-center">
					<div className="text-center">
						<Activity className="text-muted-foreground/50 mx-auto size-8" />
						<p className="text-muted-foreground mt-2 text-sm">No activity yet</p>
					</div>
				</div>
			</UnifiedAccordionContent>
		);
	}

	return (
		<UnifiedAccordionContent>
			<div className="max-h-96 space-y-3 overflow-y-auto">
				{activities.map((activity: any) => (
					<div
						className="hover:bg-muted/50 flex gap-3 rounded-lg border p-3 transition-colors"
						key={activity.id}
					>
						<Avatar className="size-8 flex-shrink-0">
							<AvatarImage src={activity.user?.avatar} />
							<AvatarFallback>{activity.user?.name?.charAt(0) || "?"}</AvatarFallback>
						</Avatar>
						<div className="min-w-0 flex-1">
							<p className="text-sm break-words">{activity.description}</p>
							<p className="text-muted-foreground mt-1 text-xs">
								{activity.user?.name} •{" "}
								{formatDistance(new Date(activity.created_at), new Date(), {
									addSuffix: true,
								})}
							</p>
						</div>
					</div>
				))}
			</div>
		</UnifiedAccordionContent>
	);
}
