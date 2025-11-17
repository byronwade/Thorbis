import { FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EstimatesWidget({ estimates, jobId }: { estimates: unknown[]; jobId: string }) {
	return (
		<div className="space-y-3">
			<p className="text-sm">
				{estimates.length} estimate{estimates.length !== 1 ? "s" : ""}
			</p>
			<Button asChild className="w-full" size="sm" variant="outline">
				<Link href={`/dashboard/work/${jobId}#estimates`}>
					<FileText className="mr-2 size-4" />
					View All Estimates
				</Link>
			</Button>
		</div>
	);
}
