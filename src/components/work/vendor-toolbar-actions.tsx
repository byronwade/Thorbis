"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function VendorToolbarActions() {
	return (
		<div className="flex items-center gap-2">
			<Button asChild size="sm">
				<Link href="/dashboard/work/vendors/new">
					<Plus className="mr-2 h-4 w-4" />
					Add Vendor
				</Link>
			</Button>
		</div>
	);
}
