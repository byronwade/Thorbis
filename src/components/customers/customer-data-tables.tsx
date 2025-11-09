"use client";

import { Briefcase, FileText, Plus } from "lucide-react";
import Link from "next/link";
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
  type ColumnDef,
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";

/**
 * Customer Data Tables - Client Component
 *
 * Uses FullWidthDataTable for consistent Gmail-style table layout
 * Must be a Client Component because render functions can't be serialized.
 */

type Job = {
  id: string;
  jobNumber: string;
  title: string;
  status: string;
  totalAmount: number;
  scheduledStart: string | null;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  title: string;
  status: string;
  totalAmount: number;
  dueDate: string | null;
};

// Utility functions
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusBadge(status: string) {
  const variants: Record<
    string,
    {
      className: string;
      label: string;
    }
  > = {
    draft: {
      className:
        "border-border/50 bg-background text-muted-foreground hover:bg-muted/50",
      label: "Draft",
    },
    scheduled: {
      className:
        "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400",
      label: "Scheduled",
    },
    in_progress: {
      className: "border-blue-500/50 bg-blue-500 text-white hover:bg-blue-600",
      label: "In Progress",
    },
    completed: {
      className:
        "border-green-500/50 bg-green-500 text-white hover:bg-green-600",
      label: "Completed",
    },
    cancelled: {
      className: "border-red-500/50 bg-red-500 text-white hover:bg-red-600",
      label: "Cancelled",
    },
    paid: {
      className:
        "border-green-500/50 bg-green-500 text-white hover:bg-green-600",
      label: "Paid",
    },
    unpaid: {
      className:
        "border-yellow-200/50 bg-yellow-50/50 text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-400",
      label: "Unpaid",
    },
    overdue: {
      className: "border-red-500/50 bg-red-500 text-white hover:bg-red-600",
      label: "Overdue",
    },
  };

  const config = variants[status] || {
    className: "border-border/50 bg-background text-muted-foreground",
    label: status.replace("_", " "),
  };

  return (
    <Badge className={`font-medium text-xs ${config.className}`} variant="outline">
      {config.label}
    </Badge>
  );
}

type CustomerDataTablesProps = {
  customerId: string;
  jobs: Job[];
  invoices: Invoice[];
};

export function CustomerDataTables({
  customerId,
  jobs,
  invoices,
}: CustomerDataTablesProps) {
  // Job columns for FullWidthDataTable
  const jobColumns: ColumnDef<Job>[] = [
    {
      key: "jobNumber",
      header: "Job Number",
      width: "w-36",
      shrink: true,
      render: (job) => (
        <Link
          className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
          href={`/dashboard/work/${job.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {job.jobNumber}
        </Link>
      ),
    },
    {
      key: "title",
      header: "Title",
      width: "flex-1",
      render: (job) => (
        <span className="font-medium text-sm">{job.title}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-32",
      shrink: true,
      render: (job) => getStatusBadge(job.status),
    },
    {
      key: "totalAmount",
      header: "Amount",
      width: "w-32",
      shrink: true,
      align: "right",
      render: (job) => (
        <span className="font-semibold tabular-nums text-sm">
          {formatCurrency(job.totalAmount)}
        </span>
      ),
    },
    {
      key: "scheduledStart",
      header: "Scheduled",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (job) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatDate(job.scheduledStart)}
        </span>
      ),
    },
  ];

  // Invoice columns
  const invoiceColumns: ColumnDef<Invoice>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice Number",
      width: "w-36",
      shrink: true,
      render: (invoice) => (
        <Link
          className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
          href={`/dashboard/work/invoices/${invoice.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {invoice.invoiceNumber}
        </Link>
      ),
    },
    {
      key: "title",
      header: "Title",
      width: "flex-1",
      render: (invoice) => (
        <span className="font-medium text-sm">{invoice.title}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-32",
      shrink: true,
      render: (invoice) => getStatusBadge(invoice.status),
    },
    {
      key: "totalAmount",
      header: "Amount",
      width: "w-32",
      shrink: true,
      align: "right",
      render: (invoice) => (
        <span className="font-semibold tabular-nums text-sm">
          {formatCurrency(invoice.totalAmount)}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (invoice) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatDate(invoice.dueDate)}
        </span>
      ),
    },
  ];

  // Search filter functions
  const jobSearchFilter = (job: Job, query: string) => {
    const searchStr = query.toLowerCase();
    return (
      job.jobNumber.toLowerCase().includes(searchStr) ||
      job.title.toLowerCase().includes(searchStr) ||
      job.status.toLowerCase().includes(searchStr)
    );
  };

  const invoiceSearchFilter = (invoice: Invoice, query: string) => {
    const searchStr = query.toLowerCase();
    return (
      invoice.invoiceNumber.toLowerCase().includes(searchStr) ||
      invoice.title.toLowerCase().includes(searchStr) ||
      invoice.status.toLowerCase().includes(searchStr)
    );
  };

  const handleJobRowClick = (job: Job) => {
    window.location.href = `/dashboard/work/${job.id}`;
  };

  const handleInvoiceRowClick = (invoice: Invoice) => {
    window.location.href = `/dashboard/work/invoices/${invoice.id}`;
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      {/* Jobs Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Jobs ({jobs.length})</CardTitle>
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
        <CardContent className="p-0">
          <FullWidthDataTable
            columns={jobColumns}
            data={jobs}
            emptyAction={
              <Button asChild size="sm">
                <Link href={`/dashboard/work/new?customer=${customerId}`}>
                  <Plus className="mr-2 size-4" />
                  Add Job
                </Link>
              </Button>
            }
            emptyIcon={<Briefcase className="h-8 w-8 text-muted-foreground" />}
            emptyMessage="No jobs found for this customer"
            enableSelection={false}
            getItemId={(job) => job.id}
            itemsPerPage={10}
            onRefresh={handleRefresh}
            onRowClick={handleJobRowClick}
            searchFilter={jobSearchFilter}
            searchPlaceholder="Search jobs by number, title, or status..."
          />
        </CardContent>
      </Card>

      {/* Invoices Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoices ({invoices.length})</CardTitle>
              <CardDescription>All invoices for this customer</CardDescription>
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
        <CardContent className="p-0">
          <FullWidthDataTable
            columns={invoiceColumns}
            data={invoices}
            emptyAction={
              <Button asChild size="sm">
                <Link
                  href={`/dashboard/work/invoices/new?customer=${customerId}`}
                >
                  <Plus className="mr-2 size-4" />
                  Add Invoice
                </Link>
              </Button>
            }
            emptyIcon={<FileText className="h-8 w-8 text-muted-foreground" />}
            emptyMessage="No invoices found for this customer"
            enableSelection={false}
            getItemId={(invoice) => invoice.id}
            itemsPerPage={10}
            onRefresh={handleRefresh}
            onRowClick={handleInvoiceRowClick}
            searchFilter={invoiceSearchFilter}
            searchPlaceholder="Search invoices by number, title, or status..."
          />
        </CardContent>
      </Card>
    </>
  );
}
