"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type ImportProgressDashboardProps = {
	companyId: string;
	limit?: number;
};

export function ImportProgressDashboard({
	companyId,
	limit = 20,
}: ImportProgressDashboardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Import History</CardTitle>
				<CardDescription>View your recent import activities</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
					<p className="text-sm">No import history yet.</p>
				</div>
			</CardContent>
		</Card>
	);
}
