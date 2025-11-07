"use client";

/**
 * Customer Detail Breadcrumbs - Left side of AppToolbar
 *
 * Shows back button and customer name
 */

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CustomerDetailBreadcrumbs() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => router.push("/dashboard/customers")}
        className="gap-2"
      >
        <ArrowLeft className="size-4" />
        Customers
      </Button>
      <span className="text-muted-foreground">/</span>
      <span className="font-medium">Details</span>
    </div>
  );
}
