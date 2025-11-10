/**
 * Inventory > Vendors Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

import { Building2, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePageHeader } from "@/components/ui/datatable-page-header";
import { VendorTable, type Vendor } from "@/components/inventory/vendor-table";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600; // Revalidate every 1 hour

export default async function VendorManagementPage() {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  // Get active company ID
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    return notFound();
  }

  // Fetch vendors from database
  const { data: vendorsRaw, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("company_id", activeCompanyId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching vendors:", error);
  }

  // Transform data for table component
  const vendors: Vendor[] = (vendorsRaw || []).map((vendor: any) => ({
    id: vendor.id,
    name: vendor.name,
    display_name: vendor.display_name,
    vendor_number: vendor.vendor_number,
    email: vendor.email,
    phone: vendor.phone,
    category: vendor.category,
    status: vendor.status,
    created_at: vendor.created_at,
  }));

  // Calculate stats
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter((v) => v.status === "active").length;
  const inactiveVendors = vendors.filter((v) => v.status === "inactive").length;

  // Calculate total PO value for vendors (would need to join with purchase_orders)
  // For now, just show vendor count stats

  return (
    <div className="flex h-full flex-col">
      <DataTablePageHeader
        actions={
          <Button asChild size="sm">
            <Link href="/dashboard/inventory/vendors/new">
              <Plus className="mr-2 size-4" />
              <span className="hidden sm:inline">Add Vendor</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </Button>
        }
        description="Manage vendor relationships and supplier information"
        stats={
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Total Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{totalVendors}</div>
                <p className="text-muted-foreground text-xs">All vendors</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl text-green-600">
                  {activeVendors}
                </div>
                <p className="text-muted-foreground text-xs">Currently active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Inactive</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl text-gray-600">
                  {inactiveVendors}
                </div>
                <p className="text-muted-foreground text-xs">Inactive vendors</p>
              </CardContent>
            </Card>
          </div>
        }
        title="Vendors"
      />

      <div className="flex-1 overflow-auto">
        <VendorTable itemsPerPage={50} vendors={vendors} />
      </div>
    </div>
  );
}
