import { Paperclip } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DocumentsWidget({ documents, jobId }: { documents: unknown[]; jobId: string }) {
	return (
		<div className="space-y-3">
			<p className="text-sm">
				{documents.length} document{documents.length !== 1 ? "s" : ""}
			</p>
			<Button asChild className="w-full" size="sm" variant="outline">
				<Link href={`/dashboard/work/${jobId}#documents`}>
					<Paperclip className="mr-2 size-4" />
					View All Documents
				</Link>
			</Button>
		</div>
	);
}
