"use client";

/**
 * Appointment Detail Breadcrumbs - Left side of AppToolbar
 *
 * Shows back button to appointments list
 */

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AppointmentDetailBreadcrumbs() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        className="h-8 gap-1.5"
        onClick={() => router.push("/dashboard/work/appointments")}
        size="sm"
        variant="outline"
      >
        <ArrowLeft className="size-4" />
        Appointments
      </Button>
      <span className="text-muted-foreground">/</span>
      <span className="font-medium">Details</span>
    </div>
  );
}
