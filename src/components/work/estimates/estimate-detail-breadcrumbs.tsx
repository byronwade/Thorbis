"use client";

/**
 * Estimate Detail Breadcrumbs - Left side of AppToolbar
 *
 * Shows back button to estimates list
 */

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function EstimateDetailBreadcrumbs() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        className="h-8 gap-1.5"
        onClick={() => router.push("/dashboard/work/estimates")}
        size="sm"
        variant="outline"
      >
        <ArrowLeft className="size-4" />
        Estimates
      </Button>
      <span className="text-muted-foreground">/</span>
      <span className="font-medium">Details</span>
    </div>
  );
}
