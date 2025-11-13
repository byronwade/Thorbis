"use client";

/**
 * Customer Detail Breadcrumbs - Left side of AppToolbar
 *
 * Shows back button and customer name
 */

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CustomerDetailBreadcrumbs() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        className="h-8 gap-1.5"
        onClick={() => router.push("/dashboard/customers")}
        size="sm"
        variant="outline"
      >
        <ArrowLeft className="size-4" />
        Customers
      </Button>
      <span className="text-muted-foreground">/</span>
      <span className="font-medium">Details</span>
    </div>
  );
}
