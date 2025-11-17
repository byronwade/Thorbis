import { DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function InvoicesWidget({ invoices, jobId }: { invoices: unknown[]; jobId: string }) {
	return (
		<div className="space-y-3">
			<p className="text-sm">
				{invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
			</p>
			<Button asChild className="w-full" size="sm" variant="outline">
				<Link href={`/dashboard/work/${jobId}#invoices`}>
					<DollarSign className="mr-2 size-4" />
					View All Invoices
				</Link>
			</Button>
		</div>
	);
}
