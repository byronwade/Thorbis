"use client";

/**
 * AppointmentsToolbarActions Component - Client Component
 *
 * Toolbar actions for the appointments page
 * - View switcher
 * - Filter button
 * - New Appointment button
 * - Import/Export
 */

import { Filter } from "lucide-react";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { Button } from "@/components/ui/button";

export function AppointmentsToolbarActions() {
  return (
    <BaseToolbarActions
      viewSwitcherSection="appointments"
      beforePrimaryAction={
        <Button size="sm" variant="ghost">
          <Filter className="mr-2 size-4" />
          Filter
        </Button>
      }
      primaryAction={{
        href: "/dashboard/work/appointments/new",
        label: "New Appointment",
      }}
      importExportDataType="appointments"
    />
  );
}





