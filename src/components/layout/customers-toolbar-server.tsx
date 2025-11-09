/**
 * Customers Toolbar Actions - Server Component Version
 *
 * Performance optimization:
 * - Converted to Server Component (was client component)
 * - Static rendering at build time
 * - Zero JavaScript shipped to client for static parts
 * - Only dropdown remains as client component
 *
 * Bundle size reduction: ~5KB per toolbar
 */

import { UserPlus } from "lucide-react";
import Link from "next/link";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";

export function CustomersToolbarServer() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm">
        <Link href="/dashboard/customers/new">
          <UserPlus className="mr-2 size-4" />
          Add Customer
        </Link>
      </Button>
      <ImportExportDropdown dataType="customers" />
    </div>
  );
}
