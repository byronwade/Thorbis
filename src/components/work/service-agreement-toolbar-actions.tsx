"use client";

/**
 * Service Agreement Toolbar Actions - Client Component
 *
 * Provides service agreement-specific toolbar actions
 * - New agreement button
 * - Import/Export actions
 */

import { Plus } from "lucide-react";
import Link from "next/link";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";

export function ServiceAgreementToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="default">
        <Link href="/dashboard/work/service-agreements/new">
          <Plus className="mr-2 size-4" />
          New Agreement
        </Link>
      </Button>
      <ImportExportDropdown dataType="service-agreements" />
    </div>
  );
}
