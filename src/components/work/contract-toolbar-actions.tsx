"use client";

/**
 * Contract Toolbar Actions - Client Component
 *
 * Provides contract-specific toolbar actions
 * - New contract button
 * - Import/Export actions
 */

import { Plus } from "lucide-react";
import Link from "next/link";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";

export function ContractToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="default">
        <Link href="/dashboard/work/contracts/new">
          <Plus className="mr-2 size-4" />
          New Contract
        </Link>
      </Button>
      <ImportExportDropdown dataType="contracts" />
    </div>
  );
}
