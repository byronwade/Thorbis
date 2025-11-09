"use client";

import { Briefcase, FileText } from "lucide-react";
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
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";

/**
 * Customer Data Tables - Client Component
 *
 * Wraps DataTable components with column definitions that include render functions.
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
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusBadge(status: string) {
  const statusColors: Record<string, string> = {
    draft: "bg-gray-500",
    scheduled: "bg-blue-500",
    in_progress: "bg-yellow-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
    paid: "bg-green-500",
    unpaid: "bg-yellow-500",
    overdue: "bg-red-500",
  };

  return (
    <Badge className={statusColors[status] || "bg-gray-500"}>
      {status.replace("_", " ")}
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
        <CardContent>
          <DataTable
            columns={jobColumns}
            data={jobs}
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
        <CardContent>
          <DataTable
            columns={invoiceColumns}
            data={invoices}
            emptyMessage="No invoices found for this customer."
            itemsPerPage={5}
            keyField="id"
            searchPlaceholder="Search invoices..."
          />
        </CardContent>
      </Card>
    </>
  );
}
