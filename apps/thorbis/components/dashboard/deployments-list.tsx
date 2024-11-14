"use client";

import { useMemoizedValue } from "@/lib/utils/memoization";
import { useCallback } from "react";

export function DeploymentsList() {
	const getDeployments = useCallback(() => [] as Deployment[], []);
	const deployments = useMemoizedValue(getDeployments, [getDeployments]);

	if (deployments.length === 0) {
		return (
			<div className="text-center p-6">
				<p>No deployments found.</p>
			</div>
		);
	}

	return (
		<div className="divide-y">
			{deployments.map((deployment) => (
				<div key={deployment.id} className="py-4">
					{deployment.name}
				</div>
			))}
		</div>
	);
}
