import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CommunicationsWidget({
  communications,
  jobId,
}: {
  communications: unknown[];
  jobId: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm">
        {communications.length} message{communications.length !== 1 ? "s" : ""}
      </p>
      <Button asChild className="w-full" size="sm" variant="outline">
        <Link href={`/dashboard/work/${jobId}#communications`}>
          <MessageSquare className="mr-2 size-4" />
          View All Messages
        </Link>
      </Button>
    </div>
  );
}
