"use client";

import { formatDistanceToNow } from "date-fns";
import { Package } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { togglePurchaseOrderSystem } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { trackCustomEvent } from "@/lib/analytics/client";

type POSystemToggleProps = {
	enabled: boolean;
	lastEnabledAt?: string | null;
};

export function POSystemToggle({ enabled, lastEnabledAt }: POSystemToggleProps) {
	const [isEnabled, setIsEnabled] = useState(enabled);
	const [isPending, startTransition] = useTransition();

	const handleToggle = (nextValue: boolean) => {
		setIsEnabled(nextValue);
		startTransition(async () => {
			try {
				const result = await togglePurchaseOrderSystem(nextValue);
				setIsEnabled(result.enabled);
				trackCustomEvent("settings.po_system_toggle", {
					enabled: result.enabled,
				});
				toast.success(result.enabled ? "Purchase orders enabled" : "Purchase orders disabled");
			} catch (error) {
				setIsEnabled(!nextValue);
				const message = error instanceof Error ? error.message : "Unable to update purchase orders";
				toast.error(message);
			}
		});
	};

	const lastUpdatedLabel = lastEnabledAt
		? formatDistanceToNow(new Date(lastEnabledAt), { addSuffix: true })
		: "Never enabled";

	return (
		<Card className="border-dashed">
			<CardHeader>
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="bg-muted flex size-10 items-center justify-center rounded-lg">
							<Package className="size-5" />
						</div>
						<div>
							<CardTitle className="text-base">Purchase Order System</CardTitle>
							<CardDescription className="text-sm">
								Sync vendor POs with finance + inventory in one step
							</CardDescription>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-muted-foreground text-sm">
							{isEnabled ? "Enabled" : "Disabled"}
						</span>
						<Switch checked={isEnabled} disabled={isPending} onCheckedChange={handleToggle} />
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex flex-wrap items-center justify-between gap-4 pt-0">
				<div className="text-muted-foreground text-sm">
					Last changed: <span className="font-medium">{lastUpdatedLabel}</span>
				</div>
				{isEnabled && (
					<Button asChild disabled={isPending} variant="outline">
						<Link href="/dashboard/work/purchase-orders">Manage purchase orders</Link>
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
