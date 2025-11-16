/**
 * Inventory > Vendors > [Id] Page - Server Component
 */

import {
  ChevronLeft,
  Edit,
  Globe,
  Mail,
  MoreVertical,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  // Fetch vendor
  const { data: vendor, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", id)
    .eq("company_id", activeCompanyId)
    .is("deleted_at", null)
    .single();

  if (error || !vendor) {
    return notFound();
  }

  // Fetch purchase orders for this vendor
  const { data: purchaseOrders } = await supabase
    .from("purchase_orders")
    .select("id, po_number, title, status, total_amount, created_at")
    .eq("vendor_id", id)
    .order("created_at", { ascending: false })
    .limit(10);

  const statusConfig: Record<string, { label: string; color: string }> = {
    active: { label: "Active", color: "bg-success text-success" },
    inactive: { label: "Inactive", color: "bg-muted text-foreground" },
  };

  const categoryConfig: Record<string, { label: string; color: string }> = {
    supplier: { label: "Supplier", color: "bg-primary text-primary" },
    distributor: {
      label: "Distributor",
      color: "bg-accent text-accent-foreground",
    },
    manufacturer: {
      label: "Manufacturer",
      color: "bg-warning text-warning",
    },
    service_provider: {
      label: "Service Provider",
      color: "bg-teal-100 text-teal-800",
    },
    other: { label: "Other", color: "bg-muted text-foreground" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild size="icon" variant="ghost">
            <Link href="/dashboard/inventory/vendors">
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-bold text-2xl tracking-tight">
                {vendor.display_name || vendor.name}
              </h1>
              <Badge
                className={
                  statusConfig[vendor.status || "inactive"]?.color ||
                  statusConfig.inactive.color
                }
              >
                {statusConfig[vendor.status || "inactive"]?.label || "Inactive"}
              </Badge>
              {vendor.category && (
                <Badge
                  className={
                    categoryConfig[vendor.category]?.color ||
                    categoryConfig.other.color
                  }
                >
                  {categoryConfig[vendor.category]?.label || vendor.category}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-muted-foreground text-sm">
              {vendor.vendor_number}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/inventory/vendors/${id}/edit`}>
              <Edit className="mr-2 size-4" />
              Edit
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {vendor.email && (
                <>
                  <DropdownMenuItem asChild>
                    <a href={`mailto:${vendor.email}`}>Send Email</a>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/work/purchase-orders?vendorId=${id}`}>
                  View Purchase Orders
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vendor.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    className="text-primary text-sm hover:underline"
                    href={`mailto:${vendor.email}`}
                  >
                    {vendor.email}
                  </a>
                </div>
              )}
              {vendor.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    className="text-primary text-sm hover:underline"
                    href={`tel:${vendor.phone}`}
                  >
                    {vendor.phone}
                  </a>
                </div>
              )}
              {vendor.secondary_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    className="text-primary text-sm hover:underline"
                    href={`tel:${vendor.secondary_phone}`}
                  >
                    {vendor.secondary_phone}
                  </a>
                </div>
              )}
              {vendor.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    className="text-primary text-sm hover:underline"
                    href={vendor.website}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {vendor.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Address */}
          {(vendor.address ||
            vendor.city ||
            vendor.state ||
            vendor.zip_code) && (
            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {vendor.address && <div>{vendor.address}</div>}
                  {vendor.address2 && <div>{vendor.address2}</div>}
                  {(vendor.city || vendor.state || vendor.zip_code) && (
                    <div>
                      {[vendor.city, vendor.state, vendor.zip_code]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                  {vendor.country && vendor.country !== "USA" && (
                    <div>{vendor.country}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vendor.tax_id && (
                <div>
                  <p className="mb-1 text-muted-foreground text-xs">Tax ID</p>
                  <p className="text-sm">{vendor.tax_id}</p>
                </div>
              )}
              {vendor.payment_terms && (
                <div>
                  <p className="mb-1 text-muted-foreground text-xs">
                    Payment Terms
                  </p>
                  <p className="text-sm">
                    {vendor.payment_terms
                      .replace("_", " ")
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </p>
                </div>
              )}
              {vendor.credit_limit !== null && vendor.credit_limit > 0 && (
                <div>
                  <p className="mb-1 text-muted-foreground text-xs">
                    Credit Limit
                  </p>
                  <p className="text-sm">
                    {formatCurrency(vendor.credit_limit)}
                  </p>
                </div>
              )}
              {vendor.preferred_payment_method && (
                <div>
                  <p className="mb-1 text-muted-foreground text-xs">
                    Preferred Payment Method
                  </p>
                  <p className="text-sm">
                    {vendor.preferred_payment_method
                      .replace("_", " ")
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {(vendor.notes || vendor.internal_notes) && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vendor.notes && (
                  <div>
                    <p className="mb-1 font-medium text-sm">Public Notes</p>
                    <p className="whitespace-pre-wrap text-muted-foreground text-sm">
                      {vendor.notes}
                    </p>
                  </div>
                )}
                {vendor.internal_notes && (
                  <>
                    {vendor.notes && <Separator />}
                    <div>
                      <p className="mb-1 font-medium text-sm">Internal Notes</p>
                      <p className="whitespace-pre-wrap text-muted-foreground text-sm">
                        {vendor.internal_notes}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Purchase Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchase Orders</CardTitle>
              <CardDescription>
                {purchaseOrders?.length || 0} recent orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {purchaseOrders && purchaseOrders.length > 0 ? (
                <div className="space-y-3">
                  {purchaseOrders.map((po: any) => (
                    <Link
                      className="block rounded-lg border p-3 transition-colors hover:bg-muted"
                      href={`/dashboard/work/purchase-orders/${po.id}`}
                      key={po.id}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{po.po_number}</p>
                          <p className="text-muted-foreground text-xs">
                            {po.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            {formatCurrency(po.total_amount)}
                          </p>
                          <Badge className="mt-1" variant="outline">
                            {po.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No purchase orders yet
                </p>
              )}
              <Button
                asChild
                className="mt-4 w-full"
                size="sm"
                variant="outline"
              >
                <Link href={`/dashboard/work/purchase-orders?vendorId=${id}`}>
                  View All Orders
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
