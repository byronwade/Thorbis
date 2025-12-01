import { Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CompanyActivityTabProps = {
	companyId: string;
};

/**
 * Company Activity Tab
 * 
 * Displays recent activity for the company.
 */
export function CompanyActivityTab({ companyId }: CompanyActivityTabProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Activity</CardTitle>
				<CardDescription>Company activity and events</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center justify-center py-12">
					<Activity className="text-muted-foreground mb-4 h-12 w-12" />
					<p className="text-muted-foreground text-sm">Activity tracking coming soon</p>
				</div>
			</CardContent>
		</Card>
	);
}



