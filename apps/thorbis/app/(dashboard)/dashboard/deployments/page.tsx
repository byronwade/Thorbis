import { Suspense } from "react";
import { DeploymentsList } from "@/components/dashboard/deployments-list";

export default function DeploymentsPage() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Deployments</h1>
			<Suspense fallback={<div>Loading deployments...</div>}>
				<DeploymentsList />
			</Suspense>
		</div>
	);
}
