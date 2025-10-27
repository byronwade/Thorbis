"use client";

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
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { usePageLayout } from "@/hooks/use-page-layout";
import type { Invoice, Job, Property } from "@/lib/db/schema";

// Customer type
type Customer = {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  address2?: string | null;
  city: string;
  state: string;
  zipCode: string;
  customerType: "residential" | "commercial";
  company?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Mock data
const mockCustomer: Customer = {
  id: "customer-1",
  companyId: "company-1",
  name: "John Smith",
  email: "john.smith@mainstreetoffice.com",
  phone: "(555) 123-4567",
  address: "123 Main Street",
  address2: "Suite 100",
  city: "San Francisco",
  state: "CA",
  zipCode: "94102",
  customerType: "commercial",
  company: "Main Street Office Building LLC",
  notes:
    "Preferred communication via email. Available for site visits M-F 9am-5pm. Long-term client since 2020.",
  createdAt: new Date("2024-06-15"),
  updatedAt: new Date("2025-01-20"),
};

const mockJobs: Job[] = [
  {
    id: "1",
    companyId: "company-1",
    propertyId: "property-1",
    customerId: "customer-1",
    assignedTo: "user-1",
    jobNumber: "JOB-2025-001",
    title: "HVAC Installation - Main Street Office",
    description: "Install new HVAC system for commercial office space",
    status: "in_progress",
    priority: "high",
    jobType: "installation",
    scheduledStart: new Date("2025-01-31"),
    scheduledEnd: new Date("2025-02-04"),
    actualStart: new Date("2025-02-01"),
    actualEnd: null,
    totalAmount: 1_250_000,
    paidAmount: 625_000,
    notes: null,
    metadata: null,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-20"),
  },
  {
    id: "2",
    companyId: "company-1",
    propertyId: "property-1",
    customerId: "customer-1",
    assignedTo: "user-2",
    jobNumber: "JOB-2024-089",
    title: "Annual HVAC Maintenance",
    description: "Routine maintenance and inspection",
    status: "completed",
    priority: "medium",
    jobType: "maintenance",
    scheduledStart: new Date("2024-12-01"),
    scheduledEnd: new Date("2024-12-01"),
    actualStart: new Date("2024-12-01"),
    actualEnd: new Date("2024-12-01"),
    totalAmount: 35_000,
    paidAmount: 35_000,
    notes: null,
    metadata: null,
    createdAt: new Date("2024-11-15"),
    updatedAt: new Date("2024-12-02"),
  },
];

const mockProperties: Property[] = [
  {
    id: "property-1",
    companyId: "company-1",
    customerId: "customer-1",
    name: "Main Street Office Building",
    address: "123 Main Street",
    address2: "Suite 100",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "USA",
    propertyType: "commercial",
    squareFootage: 5000,
    yearBuilt: 1995,
    notes: "Three-story office building with basement",
    metadata: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

const mockInvoices: Invoice[] = [
  {
    id: "inv-1",
    companyId: "company-1",
    jobId: "1",
    customerId: "customer-1",
    invoiceNumber: "INV-2025-0123",
    title: "HVAC Installation - Initial Payment",
    description: "50% deposit for HVAC installation project",
    status: "paid",
    subtotal: 625_000,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 625_000,
    paidAmount: 625_000,
    balanceAmount: 0,
    dueDate: new Date("2025-01-20"),
    lineItems: null,
    terms: "Net 30",
    notes: "Initial deposit payment",
    sentAt: new Date("2025-01-15"),
    viewedAt: new Date("2025-01-15"),
    paidAt: new Date("2025-01-18"),
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-18"),
  },
  {
    id: "inv-2",
    companyId: "company-1",
    jobId: "2",
    customerId: "customer-1",
    invoiceNumber: "INV-2024-0589",
    title: "Annual HVAC Maintenance",
    description: "Maintenance service",
    status: "paid",
    subtotal: 35_000,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 35_000,
    paidAmount: 35_000,
    balanceAmount: 0,
    dueDate: new Date("2024-12-15"),
    lineItems: null,
    terms: "Net 30",
    notes: null,
    sentAt: new Date("2024-12-01"),
    viewedAt: new Date("2024-12-01"),
    paidAt: new Date("2024-12-10"),
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-10"),
  },
];

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

function getStatusBadge(status: string) {
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

export default function CustomerDetailsPage() {
  const params = useParams();
  const customerId = params?.id as string;

  usePageLayout({
    maxWidth: "7xl",
    padding: "lg",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  // Calculate customer stats
  const totalRevenue = mockInvoices.reduce(
    (sum, inv) => sum + (inv.totalAmount || 0),
    0
  );
  const totalJobs = mockJobs.length;
  const activeJobs = mockJobs.filter(
    (j) => j.status === "in_progress" || j.status === "scheduled"
  ).length;

  // Job columns for DataTable
  const jobColumns: DataTableColumn<Job>[] = [
    {
      key: "jobNumber",
      header: "Job Number",
      sortable: true,
      filterable: true,
      render: (job) => <span className="font-medium">{job.jobNumber}</span>,
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      filterable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      render: (job) => getStatusBadge(job.status),
    },
    {
      key: "totalAmount",
      header: "Amount",
      sortable: true,
      render: (job) => formatCurrency(job.totalAmount),
    },
    {
      key: "scheduledStart",
      header: "Scheduled",
      sortable: true,
      render: (job) => formatDate(job.scheduledStart),
    },
  ];

  // Invoice columns
  const invoiceColumns: DataTableColumn<Invoice>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice Number",
      sortable: true,
      filterable: true,
      render: (invoice) => (
        <span className="font-medium">{invoice.invoiceNumber}</span>
      ),
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      filterable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      render: (invoice) => getStatusBadge(invoice.status),
    },
    {
      key: "totalAmount",
      header: "Amount",
      sortable: true,
      render: (invoice) => formatCurrency(invoice.totalAmount),
    },
    {
      key: "dueDate",
      header: "Due Date",
      sortable: true,
      render: (invoice) => formatDate(invoice.dueDate),
    },
  ];

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
                {mockCustomer.name}
              </h1>
              <Badge className="capitalize" variant="outline">
                {mockCustomer.customerType}
              </Badge>
            </div>
            {mockCustomer.company ? (
              <p className="text-muted-foreground">{mockCustomer.company}</p>
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
            <div className="font-bold text-2xl">{mockProperties.length}</div>
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
              {mockCustomer.createdAt.getFullYear()}
            </div>
            <p className="text-muted-foreground text-xs">
              {formatDate(mockCustomer.createdAt)}
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
                    <div className="font-medium">{mockCustomer.name}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">Email</div>
                    <Link
                      className="font-medium hover:underline"
                      href={`mailto:${mockCustomer.email}`}
                    >
                      {mockCustomer.email}
                    </Link>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">Phone</div>
                    <Link
                      className="font-medium hover:underline"
                      href={`tel:${mockCustomer.phone}`}
                    >
                      {mockCustomer.phone}
                    </Link>
                  </div>
                  {mockCustomer.company ? (
                    <div>
                      <div className="text-muted-foreground text-sm">
                        Company
                      </div>
                      <div className="font-medium">{mockCustomer.company}</div>
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
                    {mockCustomer.address}
                    {mockCustomer.address2 ? `, ${mockCustomer.address2}` : ""}
                  </div>
                  <div className="text-muted-foreground">
                    {mockCustomer.city}, {mockCustomer.state}{" "}
                    {mockCustomer.zipCode}
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
                  {mockCustomer.customerType}
                </Badge>
              </div>

              {mockCustomer.notes ? (
                <>
                  <Separator />
                  <div>
                    <div className="mb-2 text-muted-foreground text-sm">
                      Customer Notes
                    </div>
                    <div className="rounded-md bg-muted p-3 text-sm">
                      {mockCustomer.notes}
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
                    {formatDate(mockCustomer.createdAt)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">
                    Last Updated
                  </div>
                  <div className="font-medium">
                    {formatDate(mockCustomer.updatedAt)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Jobs Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Jobs ({mockJobs.length})</CardTitle>
                  <CardDescription>All jobs for this customer</CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/work/new?customer=${customerId}`}>
                    <Briefcase className="mr-2 size-4" />
                    New Job
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={jobColumns}
                data={mockJobs}
                emptyMessage="No jobs found for this customer."
                itemsPerPage={5}
                keyField="id"
                searchPlaceholder="Search jobs..."
              />
            </CardContent>
          </Card>

          {/* Invoices Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invoices ({mockInvoices.length})</CardTitle>
                  <CardDescription>
                    All invoices for this customer
                  </CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={`/dashboard/work/invoices/new?customer=${customerId}`}
                  >
                    <FileText className="mr-2 size-4" />
                    New Invoice
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={invoiceColumns}
                data={mockInvoices}
                emptyMessage="No invoices found for this customer."
                itemsPerPage={5}
                keyField="id"
                searchPlaceholder="Search invoices..."
              />
            </CardContent>
          </Card>

          {/* Properties Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-2xl tracking-tight">
                  Properties ({mockProperties.length})
                </h2>
                <p className="text-muted-foreground text-sm">
                  Service locations for this customer
                </p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href={`/dashboard/properties/new?customer=${customerId}`}>
                  <Building2 className="mr-2 size-4" />
                  Add Property
                </Link>
              </Button>
            </div>

            {mockProperties.map((property) => (
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
                      <Link href={`/dashboard/properties/${property.id}`}>
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
                <Link href={`mailto:${mockCustomer.email}`}>
                  <Mail className="mr-2 size-4" />
                  Send Email
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href={`tel:${mockCustomer.phone}`}>
                  <Phone className="mr-2 size-4" />
                  Call Customer
                </Link>
              </Button>
              <Separator className="my-4" />
              <Button asChild className="w-full" variant="outline">
                <Link href={`/dashboard/properties/new?customer=${customerId}`}>
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
                <span className="font-bold">{mockProperties.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Customer Since
                </span>
                <span className="font-medium text-sm">
                  {formatDate(mockCustomer.createdAt)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
