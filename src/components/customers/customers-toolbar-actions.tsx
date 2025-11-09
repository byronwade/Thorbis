"use client";

/**
 * CustomersToolbarActions Component
 *
 * Toolbar actions for the customers page
 * - Add New Customer button
 * - Import Customers
 * - Export Customers
 */

import { UserPlus } from "lucide-react";
import Link from "next/link";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";

export function CustomersToolbarActions() {
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
