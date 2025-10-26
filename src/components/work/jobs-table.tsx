"use client";

import Link from "next/link";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import type { Job } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";

interface JobsTableProps {
  jobs: Job[];
  itemsPerPage?: number;
}

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
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    quoted: { variant: "outline", label: "Quoted" },
    scheduled: { variant: "secondary", label: "Scheduled" },
    in_progress: { variant: "default", label: "In Progress" },
    completed: { variant: "default", label: "Completed" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  };

  const config = variants[status] || { variant: "outline" as const, label: status };

  return (
    <Badge variant={config.variant} className={cn(status === "completed" && "bg-green-500 hover:bg-green-600")}>
      {config.label}
    </Badge>
  );
}

function getPriorityBadge(priority: string) {
  const variants: Record<string, { className: string; label: string }> = {
    low: { className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20", label: "Low" },
    medium: { className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20", label: "Medium" },
    high: { className: "bg-orange-500/10 text-orange-700 dark:text-orange-400 hover:bg-orange-500/20", label: "High" },
    urgent: { className: "bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20", label: "Urgent" },
  };

  const config = variants[priority] || { className: "", label: priority };

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

export function JobsTable({ jobs, itemsPerPage = 10 }: JobsTableProps) {
  const columns: DataTableColumn<Job>[] = [
    {
      key: "jobNumber",
      header: "Job Number",
      sortable: true,
      filterable: true,
      render: (job) => (
        <Link href={`/dashboard/work/${job.id}`} className="font-medium hover:underline">
          {job.jobNumber}
        </Link>
      ),
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      filterable: true,
      render: (job) => (
        <Link href={`/dashboard/work/${job.id}`} className="hover:underline">
          {job.title}
        </Link>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      render: (job) => getStatusBadge(job.status),
    },
    {
      key: "priority",
      header: "Priority",
      sortable: true,
      filterable: true,
      render: (job) => getPriorityBadge(job.priority),
    },
    {
      key: "scheduledStart",
      header: "Scheduled Date",
      sortable: true,
      render: (job) => formatDate(job.scheduledStart),
    },
    {
      key: "totalAmount",
      header: "Total Amount",
      sortable: true,
      render: (job) => <span className="font-medium">{formatCurrency(job.totalAmount)}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (job) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/work/${job.id}`}>
                <Eye className="mr-2 size-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/work/${job.id}/edit`}>
                <Edit className="mr-2 size-4" />
                Edit Job
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 size-4" />
              Delete Job
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={jobs}
      columns={columns}
      keyField="id"
      itemsPerPage={itemsPerPage}
      searchPlaceholder="Search jobs by number, title, status, or priority..."
      emptyMessage="No jobs found."
    />
  );
}
