"use client";

/**
 * Purchase Order Detail Breadcrumbs - Left side of AppToolbar
 *
 * Shows back button to purchase orders list
 */

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PurchaseOrderDetailBreadcrumbs() {
	const router = useRouter();

	return (
		<div className="flex items-center gap-2">
			<Button
				className="h-8 gap-1.5"
				onClick={() => router.push("/dashboard/work/purchase-orders")}
				size="sm"
				variant="outline"
			>
				<ArrowLeft className="size-4" />
				Purchase Orders
			</Button>
			<span className="text-muted-foreground">/</span>
			<span className="font-medium">Details</span>
		</div>
	);
}
