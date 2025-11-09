"use client";

/**
 * Service Ticket Toolbar Actions - Client Component
 *
 * Provides service ticket-specific toolbar actions
 * - New ticket button
 * - Import/Export actions
 */

import { Plus } from "lucide-react";
import Link from "next/link";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";

export function ServiceTicketToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="default">
        <Link href="/dashboard/work/service-tickets/new">
          <Plus className="mr-2 size-4" />
          New Ticket
        </Link>
      </Button>
      <ImportExportDropdown dataType="service-tickets" />
    </div>
  );
}
