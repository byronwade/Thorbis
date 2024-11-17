import { Suspense } from "react";
import { DashboardMetrics } from "@/components/dashboard";

export default function DashboardPage() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Dashboard</h1>
			<Suspense fallback={<div>Loading metrics...</div>}>
				<DashboardMetrics />
			</Suspense>
		</div>
	);
}
