"use client";

/**
 * Property Detail Breadcrumbs - Left side of AppToolbar
 *
 * Shows back button to properties list
 */

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PropertyDetailBreadcrumbs() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        className="h-8 gap-1.5"
        onClick={() => router.push("/dashboard/work/properties")}
        size="sm"
        variant="outline"
      >
        <ArrowLeft className="size-4" />
        Properties
      </Button>
      <span className="text-muted-foreground">/</span>
      <span className="font-medium">Details</span>
    </div>
  );
}
