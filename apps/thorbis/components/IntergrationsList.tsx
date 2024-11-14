"use client";

import { useEffect, useState } from "react";
import { Integration } from "@prisma/client";
import { Button } from "@/thorbis/components/ui/button";

export function IntegrationsList() {
	const [integrations, setIntegrations] = useState<Integration[]>([]);

	useEffect(() => {
		// Fetch integrations
		fetch("/api/integrations")
			.then((res) => res.json())
			.then((data) => setIntegrations(data));
	}, []);

	return (
		<div className="rounded-md border">
			<div className="p-4">
				<h2 className="text-xl font-semibold">Connected Services</h2>
			</div>
			<div className="divide-y">
				{integrations.map((integration) => (
					<div key={integration.id} className="flex items-center justify-between p-4">
						<div>
							<p className="font-medium">{integration.platform}</p>
							<p className="text-sm text-muted-foreground">Connected: {new Date(integration.createdAt).toLocaleDateString()}</p>
						</div>
						<Button variant="destructive" size="sm">
							Disconnect
						</Button>
					</div>
				))}
			</div>
		</div>
	);
}
