"use client";

/**
 * Job Detail Breadcrumbs - Left side of AppToolbar
 *
 * Shows back button to jobs list
 */

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JobDetailBreadcrumbs() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => router.push("/dashboard/work")}
        className="gap-2"
      >
        <ArrowLeft className="size-4" />
        Jobs
      </Button>
      <span className="text-muted-foreground">/</span>
      <span className="font-medium">Details</span>
    </div>
  );
}

