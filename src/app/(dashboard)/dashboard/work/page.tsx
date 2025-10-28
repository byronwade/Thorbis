/**
 * Work Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { Filter, Plus } from "lucide-react";
import Link from "next/link";
import { JobStatusPipeline } from "@/components/dashboard/job-status-pipeline";
import { Button } from "@/components/ui/button";
import { JobsTable } from "@/components/work/jobs-table";
import type { Job } from "@/lib/db/schema";

export const revalidate = 300; // Revalidate every 5 minutes

// Extended mock data for demonstration - replace with real data from database
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
    scheduledStart: new Date("2025-02-01"),
    scheduledEnd: new Date("2025-02-05"),
    actualStart: new Date("2025-02-01"),
    actualEnd: null,
    totalAmount: 1_250_000,
    paidAmount: 625_000,
    notes: "Customer requested early start time",
    metadata: null,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-20"),
  },
  {
    id: "2",
    companyId: "company-1",
    propertyId: "property-2",
    customerId: "customer-2",
    assignedTo: "user-2",
    jobNumber: "JOB-2025-002",
    title: "Electrical Repair - Residential Complex",
    description: "Fix electrical issues in residential building",
    status: "scheduled",
    priority: "urgent",
    jobType: "repair",
    scheduledStart: new Date("2025-02-10"),
    scheduledEnd: new Date("2025-02-10"),
    actualStart: null,
    actualEnd: null,
    totalAmount: 450_000,
    paidAmount: 0,
    notes: "Emergency repair needed",
    metadata: null,
    createdAt: new Date("2025-01-18"),
    updatedAt: new Date("2025-01-18"),
  },
  {
    id: "3",
    companyId: "company-1",
    propertyId: "property-3",
    customerId: "customer-3",
    assignedTo: null,
    jobNumber: "JOB-2025-003",
    title: "Plumbing Maintenance - Restaurant",
    description: "Quarterly maintenance check for commercial kitchen",
    status: "quoted",
    priority: "medium",
    jobType: "maintenance",
    scheduledStart: null,
    scheduledEnd: null,
    actualStart: null,
    actualEnd: null,
    totalAmount: 325_000,
    paidAmount: 0,
    notes: "Waiting for customer approval",
    metadata: null,
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
  },
  {
    id: "4",
    companyId: "company-1",
    propertyId: "property-4",
    customerId: "customer-4",
    assignedTo: "user-3",
    jobNumber: "JOB-2025-004",
    title: "Roof Inspection - Warehouse",
    description: "Annual roof inspection and minor repairs",
    status: "completed",
    priority: "low",
    jobType: "service",
    scheduledStart: new Date("2025-01-25"),
    scheduledEnd: new Date("2025-01-25"),
    actualStart: new Date("2025-01-25"),
    actualEnd: new Date("2025-01-25"),
    totalAmount: 175_000,
    paidAmount: 175_000,
    notes: "Job completed successfully",
    metadata: null,
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-25"),
  },
  {
    id: "5",
    companyId: "company-1",
    propertyId: "property-5",
    customerId: "customer-5",
    assignedTo: "user-1",
    jobNumber: "JOB-2025-005",
    title: "Furnace Replacement - Apartment Building",
    description: "Replace old furnace system with new energy-efficient model",
    status: "scheduled",
    priority: "high",
    jobType: "installation",
    scheduledStart: new Date("2025-02-08"),
    scheduledEnd: new Date("2025-02-12"),
    actualStart: null,
    actualEnd: null,
    totalAmount: 875_000,
    paidAmount: 437_500,
    notes: "Customer provided 50% deposit",
    metadata: null,
    createdAt: new Date("2025-01-22"),
    updatedAt: new Date("2025-01-22"),
  },
];

export default function JobsPage() {  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">
            View and manage all work orders and projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Filter className="mr-2 size-4" />
            Filter
          </Button>
          <Button asChild>
            <Link href="/dashboard/work/new">
              <Plus className="mr-2 size-4" />
              New Job
            </Link>
          </Button>
        </div>
      </div>

      <JobStatusPipeline />

      <div>
        <div className="mb-4">
          <h2 className="font-semibold text-xl">All Jobs</h2>
          <p className="text-muted-foreground text-sm">
            Complete list of work orders and projects
          </p>
        </div>
        <JobsTable itemsPerPage={10} jobs={mockJobs} />
      </div>
    </div>
  );
}
