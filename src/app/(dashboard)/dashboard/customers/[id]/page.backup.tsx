/**
 * Customer Details Page - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client" - uses params prop)
 * - Static content rendered on server
 * - Reduced JavaScript bundle size
 * - Better SEO and initial page load
 * - Improved performance with server-side data fetching
 */

import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  Edit,
  FileText,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomerAddressesManager } from "@/components/customers/customer-addresses-manager";
import { CustomerContactsManager } from "@/components/customers/customer-contacts-manager";
import { CustomerDataTables } from "@/components/customers/customer-data-tables";
import { InvitePortalButton } from "@/components/customers/invite-portal-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";

const CENTS_DIVISOR = 100;

function formatCurrency(cents: number | null): string {
  if (cents === null) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / CENTS_DIVISOR);
}

function formatDate(date: Date | number | null): string {
  if (!date) {
    return "—";
  }
  const d = typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function _getStatusBadge(status: string) {
  const statusVariants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    draft: "outline",
    sent: "secondary",
    viewed: "secondary",
    accepted: "default",
    rejected: "destructive",
    expired: "destructive",
    paid: "default",
    partial: "secondary",
    overdue: "destructive",
    quoted: "outline",
    scheduled: "secondary",
    in_progress: "default",
    completed: "default",
  };

  return (
    <Badge variant={statusVariants[status] || "outline"}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
    </Badge>
  );
}

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: customerId } = await params;

  // Fetch customer data from database
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .is("deleted_at", null)
    .single();

  if (!customer) {
    notFound();
  }

  // Fetch related data
  const [
    { data: jobs },
    { data: properties },
    { data: invoices },
    { data: contacts },
    { data: addresses },
    { data: paymentPlans },
  ] = await Promise.all([
    supabase
      .from("jobs")
      .select("*")
      .eq("customer_id", customerId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("properties")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false }),
    supabase
      .from("invoices")
      .select("*")
      .eq("customer_id", customerId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("customer_contacts")
      .select("*")
      .eq("customer_id", customerId)
      .is("deleted_at", null)
      .order("is_primary", { ascending: false }),
    supabase
      .from("customer_addresses")
      .select("*")
      .eq("customer_id", customerId)
      .is("deleted_at", null)
      .order("is_default", { ascending: false }),
    supabase
      .from("payment_plans")
      .select("*")
      .eq("customer_id", customerId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  // Calculate stats from real data
  const totalRevenue = customer.total_revenue || 0;
  const totalJobs = jobs?.length || 0;
  const activeJobs =
    jobs?.filter((j) => j.status === "in_progress" || j.status === "scheduled")
      .length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild size="icon" variant="outline">
            <Link href="/dashboard/customers">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-3xl tracking-tight">
                {customer.display_name}
              </h1>
              <Badge className="capitalize" variant="outline">
                {customer.type}
              </Badge>
            </div>
            {customer.company_name ? (
              <p className="text-muted-foreground">{customer.company_name}</p>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline">
            <MoreVertical className="size-4" />
          </Button>
          <Button asChild>
            <Link href={`/dashboard/customers/${customerId}/edit`}>
              <Edit className="mr-2 size-4" />
              Edit Customer
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-muted-foreground text-xs">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Jobs</CardTitle>
            <Briefcase className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalJobs}</div>
            <p className="text-muted-foreground text-xs">
              {activeJobs} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Properties</CardTitle>
            <MapPin className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{properties?.length || 0}</div>
            <p className="text-muted-foreground text-xs">Service locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Customer Since
            </CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {new Date(customer.created_at).getFullYear()}
            </div>
            <p className="text-muted-foreground text-xs">
              {formatDate(new Date(customer.created_at))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>
                Complete contact and business details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-sm">
                  <User className="size-4" />
                  Contact Details
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-muted-foreground text-sm">Name</div>
                    <div className="font-medium">{customer.display_name}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">Email</div>
                    <Link
                      className="font-medium hover:underline"
                      href={`mailto:${customer.email}`}
                    >
                      {customer.email}
                    </Link>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">Phone</div>
                    <Link
                      className="font-medium hover:underline"
                      href={`tel:${customer.phone}`}
                    >
                      {customer.phone}
                    </Link>
                  </div>
                  {customer.company_name ? (
                    <div>
                      <div className="text-muted-foreground text-sm">
                        Company
                      </div>
                      <div className="font-medium">{customer.company_name}</div>
                    </div>
                  ) : null}
                </div>
              </div>

              <Separator />

              {/* Address */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-sm">
                  <MapPin className="size-4" />
                  Billing Address
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="font-medium">
                    {customer.address}
                    {customer.address2 ? `, ${customer.address2}` : ""}
                  </div>
                  <div className="text-muted-foreground">
                    {customer.city}, {customer.state} {customer.zip_code}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer Type */}
              <div>
                <div className="text-muted-foreground text-sm">
                  Customer Type
                </div>
                <Badge className="capitalize" variant="outline">
                  {customer.type}
                </Badge>
              </div>

              {customer.notes ? (
                <>
                  <Separator />
                  <div>
                    <div className="mb-2 text-muted-foreground text-sm">
                      Customer Notes
                    </div>
                    <div className="rounded-md bg-muted p-3 text-sm">
                      {customer.notes || "No notes available"}
                    </div>
                  </div>
                </>
              ) : null}

              <Separator />

              {/* Timestamps */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-muted-foreground text-sm">Created</div>
                  <div className="font-medium">
                    {formatDate(new Date(customer.created_at))}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">
                    Last Updated
                  </div>
                  <div className="font-medium">
                    {formatDate(new Date(customer.updated_at))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Customer Contacts (Only for Business Customers) */}
          {customer.is_business && (
            <CustomerContactsManager
              customerId={customerId}
              initialContacts={contacts || []}
            />
          )}

          {/* Customer Addresses */}
          <CustomerAddressesManager
            customerId={customerId}
            initialAddresses={addresses || []}
          />

          {/* Payment Plans */}
          {paymentPlans && paymentPlans.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-5 text-primary" />
                    <CardTitle>Payment Plans</CardTitle>
                  </div>
                  <Badge variant="secondary">
                    {paymentPlans.length} active
                  </Badge>
                </div>
                <CardDescription>
                  Active payment plans and schedules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentPlans.map((plan: any) => (
                  <div className="rounded-lg border p-4" key={plan.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">
                          {plan.plan_name || plan.plan_number}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {formatCurrency(plan.total_amount)} •{" "}
                          {plan.number_of_payments} {plan.payment_frequency}{" "}
                          payments
                        </p>
                        <p className="mt-1 text-xs">
                          <span className="text-muted-foreground">
                            Next Due:
                          </span>{" "}
                          {plan.next_payment_due_date || "N/A"}
                        </p>
                      </div>
                      <Badge
                        variant={
                          plan.status === "active" ? "default" : "outline"
                        }
                      >
                        {plan.status}
                      </Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Paid</p>
                        <p className="font-medium">
                          {formatCurrency(plan.amount_paid)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Remaining
                        </p>
                        <p className="font-medium">
                          {formatCurrency(plan.amount_remaining)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Payments Made
                        </p>
                        <p className="font-medium">
                          {plan.payments_made}/{plan.number_of_payments}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Jobs and Invoices Tables */}
          <CustomerDataTables
            customerId={customerId}
            invoices={invoices || []}
            jobs={jobs || []}
          />

          {/* Properties Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-2xl tracking-tight">
                  Properties ({properties?.length || 0})
                </h2>
                <p className="text-muted-foreground text-sm">
                  Service locations for this customer
                </p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link
                  href={`/dashboard/work/properties/new?customer=${customerId}`}
                >
                  <Building2 className="mr-2 size-4" />
                  Add Property
                </Link>
              </Button>
            </div>

            {properties?.map((property) => (
              <Card key={property.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="size-5" />
                    {property.name}
                  </CardTitle>
                  <CardDescription>
                    {property.address}, {property.city}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold text-sm">Location</h3>
                    <div className="space-y-1 text-sm">
                      <div className="font-medium">
                        {property.address}
                        {property.address2 ? `, ${property.address2}` : ""}
                      </div>
                      <div className="text-muted-foreground">
                        {property.city}, {property.state} {property.zipCode}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <div className="text-muted-foreground text-sm">
                        Property Type
                      </div>
                      <div className="font-medium capitalize">
                        {property.propertyType}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm">
                        Square Footage
                      </div>
                      <div className="font-medium">
                        {property.squareFootage?.toLocaleString()} sq ft
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm">
                        Year Built
                      </div>
                      <div className="font-medium">{property.yearBuilt}</div>
                    </div>
                  </div>

                  {property.notes ? (
                    <>
                      <Separator />
                      <div>
                        <div className="mb-2 text-muted-foreground text-sm">
                          Property Notes
                        </div>
                        <div className="rounded-md bg-muted p-3 text-sm">
                          {property.notes}
                        </div>
                      </div>
                    </>
                  ) : null}

                  <Separator />

                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/work/properties/${property.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link
                        href={`/dashboard/work/new?property=${property.id}`}
                      >
                        Create Job
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common customer actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full" variant="outline">
                <Link href={`/dashboard/work/new?customer=${customerId}`}>
                  <Briefcase className="mr-2 size-4" />
                  Create New Job
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link
                  href={`/dashboard/work/invoices/new?customer=${customerId}`}
                >
                  <FileText className="mr-2 size-4" />
                  Create Invoice
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href={`mailto:${customer.email}`}>
                  <Mail className="mr-2 size-4" />
                  Send Email
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href={`tel:${customer.phone}`}>
                  <Phone className="mr-2 size-4" />
                  Call Customer
                </Link>
              </Button>
              <Separator className="my-4" />
              <InvitePortalButton
                customerId={customerId}
                customerName={customer.display_name}
                portalEnabled={customer.portal_enabled}
                portalInvitedAt={customer.portal_invited_at}
              />
              <Button asChild className="w-full" variant="outline">
                <Link
                  href={`/dashboard/work/properties/new?customer=${customerId}`}
                >
                  <Building2 className="mr-2 size-4" />
                  Add Property
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Customer Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>Key metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Lifetime Value
                </span>
                <span className="font-bold">
                  {formatCurrency(totalRevenue)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Total Jobs
                </span>
                <span className="font-bold">{totalJobs}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Active Jobs
                </span>
                <span className="font-bold">{activeJobs}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Properties
                </span>
                <span className="font-bold">{properties?.length || 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Customer Since
                </span>
                <span className="font-medium text-sm">
                  {formatDate(new Date(customer.created_at))}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
