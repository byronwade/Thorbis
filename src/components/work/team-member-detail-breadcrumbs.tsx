"use client";

/**
 * Team Member Detail Breadcrumbs - Left side of AppToolbar
 *
 * Shows back button to team members list
 */

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function TeamMemberDetailBreadcrumbs() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        className="gap-2"
        onClick={() => router.push("/dashboard/work/team")}
        size="sm"
        variant="ghost"
      >
        <ArrowLeft className="size-4" />
        Team Members
      </Button>
      <span className="text-muted-foreground">/</span>
      <span className="font-medium">Details</span>
    </div>
  );
}
