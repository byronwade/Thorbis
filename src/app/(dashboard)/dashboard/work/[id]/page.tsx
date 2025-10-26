"use client";

import { useParams } from "next/navigation";
import { usePageLayout } from "@/hooks/use-page-layout";
import { JobProcessIndicator } from "@/components/work/job-process-indicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, MoreVertical, DollarSign, FileText, Home } from "lucide-react";
import Link from "next/link";
import type { Job, Invoice, Estimate, Property } from "@/lib/db/schema";

// Line item type for invoices and estimates
interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

// Mock data - replace with real database queries
const mockJob: Job = {
  id: "1",
  companyId: "company-1",
  propertyId: "property-1",
  customerId: "customer-1",
  assignedTo: "user-1",
  jobNumber: "JOB-2025-001",
  title: "HVAC Installation - Main Street Office",
  description: "Install new HVAC system for commercial office space including ductwork, units, and controls",
  status: "in_progress",
  priority: "high",
  jobType: "installation",
  scheduledStart: new Date("2025-02-01"),
  scheduledEnd: new Date("2025-02-05"),
  actualStart: new Date("2025-02-01"),
  actualEnd: null,
  totalAmount: 1250000,
  paidAmount: 625000,
  notes: "Customer requested early start time. Building access code: 1234#",
  metadata: null,
  createdAt: new Date("2025-01-15"),
  updatedAt: new Date("2025-01-20"),
};

const mockProperty: Property = {
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
};

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
    subtotal: 625000,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 625000,
    paidAmount: 625000,
    balanceAmount: 0,
    dueDate: new Date("2025-01-20"),
    lineItems: JSON.stringify([
      { description: "HVAC System - Deposit", quantity: 1, unitPrice: 625000, amount: 625000 },
    ]),
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
    jobId: "1",
    customerId: "customer-1",
    invoiceNumber: "INV-2025-0124",
    title: "HVAC Installation - Final Payment",
    description: "Final 50% payment upon completion",
    status: "draft",
    subtotal: 625000,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 625000,
    paidAmount: 0,
    balanceAmount: 625000,
    dueDate: new Date("2025-02-10"),
    lineItems: JSON.stringify([
      { description: "HVAC System - Final Payment", quantity: 1, unitPrice: 625000, amount: 625000 },
    ]),
    terms: "Net 30",
    notes: "Due upon project completion",
    sentAt: null,
    viewedAt: null,
    paidAt: null,
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
  },
];

const mockEstimate: Estimate = {
  id: "est-1",
  companyId: "company-1",
  jobId: "1",
  propertyId: "property-1",
  customerId: "customer-1",
  estimateNumber: "EST-2025-0045",
  title: "HVAC Installation Estimate",
  description: "Complete HVAC system installation including materials and labor",
  status: "accepted",
  subtotal: 1250000,
  taxAmount: 0,
  discountAmount: 0,
  totalAmount: 1250000,
  validUntil: new Date("2025-02-28"),
  lineItems: JSON.stringify([
    { description: "HVAC Unit (5-ton)", quantity: 2, unitPrice: 400000, amount: 800000 },
    { description: "Ductwork Installation", quantity: 1, unitPrice: 300000, amount: 300000 },
    { description: "Control System", quantity: 1, unitPrice: 100000, amount: 100000 },
    { description: "Labor", quantity: 1, unitPrice: 50000, amount: 50000 },
  ]),
  terms: "50% deposit, 50% upon completion",
  notes: "Includes 2-year warranty on parts and labor",
  sentAt: new Date("2025-01-10"),
  viewedAt: new Date("2025-01-11"),
  respondedAt: new Date("2025-01-14"),
  createdAt: new Date("2025-01-10"),
  updatedAt: new Date("2025-01-14"),
};

function formatCurrency(cents: number | null): string {
  if (cents === null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(date: Date | number | null): string {
  if (!date) return "—";
  const d = typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function getStatusBadge(status: string) {
  const variants: Record<string, string> = {
    draft: "outline",
    sent: "secondary",
    viewed: "secondary",
    accepted: "default",
    rejected: "destructive",
    expired: "destructive",
    paid: "default",
    partial: "secondary",
    overdue: "destructive",
  };

  return <Badge variant={variants[status] as never}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
}

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params?.id as string;

  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/work">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-3xl tracking-tight">{mockJob.jobNumber}</h1>
              <Badge variant="outline">{mockJob.jobType}</Badge>
            </div>
            <p className="text-muted-foreground">{mockJob.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <MoreVertical className="size-4" />
          </Button>
          <Button asChild>
            <Link href={`/dashboard/work/${jobId}/edit`}>
              <Edit className="mr-2 size-4" />
              Edit Job
            </Link>
          </Button>
        </div>
      </div>

      <JobProcessIndicator currentStatus={mockJob.status as never} />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Amount</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{formatCurrency(mockJob.totalAmount)}</div>
            <p className="text-muted-foreground text-xs">
              {formatCurrency(mockJob.paidAmount)} paid • {formatCurrency((mockJob.totalAmount || 0) - (mockJob.paidAmount || 0))} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Scheduled Dates</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{formatDate(mockJob.scheduledStart)}</div>
            <p className="text-muted-foreground text-xs">to {formatDate(mockJob.scheduledEnd)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Priority</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl capitalize">{mockJob.priority}</div>
            <p className="text-muted-foreground text-xs">Current priority level</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices ({mockInvoices.length})</TabsTrigger>
          <TabsTrigger value="estimates">Estimates (1)</TabsTrigger>
          <TabsTrigger value="property">Property Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Complete information about this job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-muted-foreground text-sm">Job Number</div>
                  <div className="font-medium">{mockJob.jobNumber}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Status</div>
                  <div className="font-medium capitalize">{mockJob.status.replace("_", " ")}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Priority</div>
                  <div className="font-medium capitalize">{mockJob.priority}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Job Type</div>
                  <div className="font-medium capitalize">{mockJob.jobType}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Created Date</div>
                  <div className="font-medium">{formatDate(mockJob.createdAt)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Last Updated</div>
                  <div className="font-medium">{formatDate(mockJob.updatedAt)}</div>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Description</div>
                <div className="mt-1">{mockJob.description}</div>
              </div>
              {mockJob.notes && (
                <div>
                  <div className="text-muted-foreground text-sm">Notes</div>
                  <div className="mt-1">{mockJob.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>All invoices related to this job</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.title}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estimates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estimate Details</CardTitle>
              <CardDescription>{mockEstimate.estimateNumber} - {getStatusBadge(mockEstimate.status)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-muted-foreground text-sm">Estimate Number</div>
                  <div className="font-medium">{mockEstimate.estimateNumber}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Total Amount</div>
                  <div className="font-medium">{formatCurrency(mockEstimate.totalAmount)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Valid Until</div>
                  <div className="font-medium">{formatDate(mockEstimate.validUntil)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Sent Date</div>
                  <div className="font-medium">{formatDate(mockEstimate.sentAt)}</div>
                </div>
              </div>
              <div>
                <div className="mb-2 text-muted-foreground text-sm">Line Items</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(JSON.parse(String(mockEstimate.lineItems)) as LineItem[]).map((item: LineItem, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell>{formatCurrency(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="property" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Home className="size-5" />
                <div>
                  <CardTitle>Property Details</CardTitle>
                  <CardDescription>{mockProperty.name}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-muted-foreground text-sm">Address</div>
                  <div className="font-medium">
                    {mockProperty.address}
                    {mockProperty.address2 && <>, {mockProperty.address2}</>}
                    <br />
                    {mockProperty.city}, {mockProperty.state} {mockProperty.zipCode}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Property Type</div>
                  <div className="font-medium capitalize">{mockProperty.propertyType}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Square Footage</div>
                  <div className="font-medium">{mockProperty.squareFootage?.toLocaleString()} sq ft</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Year Built</div>
                  <div className="font-medium">{mockProperty.yearBuilt}</div>
                </div>
              </div>
              {mockProperty.notes && (
                <div>
                  <div className="text-muted-foreground text-sm">Property Notes</div>
                  <div className="mt-1">{mockProperty.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
