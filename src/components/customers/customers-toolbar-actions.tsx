"use client";

/**
 * CustomersToolbarActions Component
 *
 * Toolbar actions for the customers page
 * - Add New Customer button
 * - Import Customers
 * - Export Customers
 */

import { Download, Upload, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CustomersToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline">
        <Upload className="mr-2 size-4" />
        Import
      </Button>
      <Button size="sm" variant="outline">
        <Download className="mr-2 size-4" />
        Export
      </Button>
      <Button asChild size="sm">
        <Link href="/dashboard/customers/new">
          <UserPlus className="mr-2 size-4" />
          Add Customer
        </Link>
      </Button>
    </div>
  );
}
