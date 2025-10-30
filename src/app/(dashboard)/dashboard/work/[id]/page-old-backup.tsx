/**
 * Job Details Page - Server Component
 *
 * Performance optimizations:
 * - Static content rendered on server
 * - Reduced JavaScript bundle size
 * - Better SEO and initial page load
 * - Improved performance with server-side data fetching
 */

/**
 * Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Mock data defined on server (will be replaced with real DB queries)
 * - Only interactive table/chart components are client-side
 * - Better SEO and initial page load performance
 */

import {
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Edit,
  ExternalLink,
  FileText,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Paperclip,
  Phone,
  Plus,
  TrendingDown,
  TrendingUp,
  Upload,
  User,
  UserCog,
  Users,
} from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { JobPhoto } from "@/components/work/job-details/PhotoGallery";
import { JobInvoicesTable } from "@/components/work/job-invoices-table";
import { JobLineItemsTable } from "@/components/work/job-line-items-table";
import { JobPhotoGalleryWrapper } from "@/components/work/job-photo-gallery-wrapper";
import { JobProcessIndicator } from "@/components/work/job-process-indicator";
import type { Estimate, Invoice, Job, Property } from "@/lib/db/schema";

// Line item type for invoices and estimates
interface LineItem extends Record<string, unknown> {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

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
};

// Communication type
type Communication = {
  id: string;
  type: "email" | "phone" | "sms" | "note";
  subject?: string;
  message: string;
  from: string;
  to?: string;
  sentAt: Date;
};

// Document type
type Document = {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  url: string;
};

// Job Costing type
type JobCost = {
  labor: number;
  materials: number;
  equipment: number;
  subcontractors: number;
  permits: number;
  overhead: number;
  other: number;
};

// Mock data - replace with real database queries
const mockJob: Job = {
  id: "1",
  companyId: "company-1",
  propertyId: "property-1",
  customerId: "customer-1",
  assignedTo: "user-1",
  jobNumber: "JOB-2025-001",
  title: "HVAC Installation - Main Street Office",
  description:
    "Install new HVAC system for commercial office space including ductwork, units, and controls",
  status: "in_progress",
  priority: "high",
  jobType: "installation",
  scheduledStart: new Date("2025-01-31"),
  scheduledEnd: new Date("2025-02-04"),
  actualStart: new Date("2025-02-01"),
  actualEnd: null,
  totalAmount: 1_250_000,
  paidAmount: 625_000,
  notes: "Customer requested early start time. Building access code: 1234#",
  metadata: null,
  createdAt: new Date("2025-01-15"),
  updatedAt: new Date("2025-01-20"),
  // AI fields
  aiCategories: null,
  aiEquipment: null,
  aiServiceType: null,
  aiPriorityScore: null,
  aiTags: null,
  aiProcessedAt: null,
};

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
    "Preferred communication via email. Available for site visits M-F 9am-5pm.",
  createdAt: new Date("2024-06-15"),
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
    subtotal: 625_000,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 625_000,
    paidAmount: 625_000,
    balanceAmount: 0,
    dueDate: new Date("2025-01-20"),
    lineItems: JSON.stringify([
      {
        description: "HVAC System - Deposit",
        quantity: 1,
        unitPrice: 625_000,
        amount: 625_000,
      },
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
    subtotal: 625_000,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 625_000,
    paidAmount: 0,
    balanceAmount: 625_000,
    dueDate: new Date("2025-02-10"),
    lineItems: JSON.stringify([
      {
        description: "HVAC System - Final Payment",
        quantity: 1,
        unitPrice: 625_000,
        amount: 625_000,
      },
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
  description:
    "Complete HVAC system installation including materials and labor",
  status: "accepted",
  subtotal: 1_250_000,
  taxAmount: 0,
  discountAmount: 0,
  totalAmount: 1_250_000,
  validUntil: new Date("2025-02-28"),
  lineItems: JSON.stringify([
    {
      description: "HVAC Unit (5-ton)",
      quantity: 2,
      unitPrice: 400_000,
      amount: 800_000,
    },
    {
      description: "Ductwork Installation",
      quantity: 1,
      unitPrice: 300_000,
      amount: 300_000,
    },
    {
      description: "Control System",
      quantity: 1,
      unitPrice: 100_000,
      amount: 100_000,
    },
    { description: "Labor", quantity: 1, unitPrice: 50_000, amount: 50_000 },
  ]),
  terms: "50% deposit, 50% upon completion",
  notes: "Includes 2-year warranty on parts and labor",
  sentAt: new Date("2025-01-10"),
  viewedAt: new Date("2025-01-11"),
  respondedAt: new Date("2025-01-14"),
  createdAt: new Date("2025-01-10"),
  updatedAt: new Date("2025-01-14"),
};

// Job Costing Mock Data
const mockJobCost: JobCost = {
  labor: 450_000, // $4,500
  materials: 600_000, // $6,000
  equipment: 75_000, // $750
  subcontractors: 150_000, // $1,500
  permits: 25_000, // $250
  overhead: 50_000, // $500
  other: 10_000, // $100
};

// Communications Mock Data
const mockCommunications: Communication[] = [
  {
    id: "comm-1",
    type: "email",
    subject: "HVAC Installation Start Date Confirmed",
    message:
      "Hi John, confirming we'll start the HVAC installation on January 31st. Our team will arrive at 8am. Please ensure building access.",
    from: "Service Team",
    to: "john.smith@mainstreetoffice.com",
    sentAt: new Date("2025-01-25T09:30:00"),
  },
  {
    id: "comm-2",
    type: "phone",
    subject: "Site Visit Discussion",
    message:
      "Discussed placement of outdoor units and confirmed ductwork routing through basement. Customer approved proposed layout.",
    from: "Mike Johnson (Technician)",
    sentAt: new Date("2025-01-20T14:15:00"),
  },
  {
    id: "comm-3",
    type: "note",
    message:
      "Customer requested access code 1234# for entry. Main contact unavailable Wednesdays.",
    from: "Admin",
    sentAt: new Date("2025-01-18T11:00:00"),
  },
  {
    id: "comm-4",
    type: "email",
    subject: "Estimate Accepted",
    message:
      "Thank you for accepting our estimate. We've scheduled your installation for late January. Deposit invoice attached.",
    from: "Sales Team",
    to: "john.smith@mainstreetoffice.com",
    sentAt: new Date("2025-01-14T16:45:00"),
  },
];

// Documents Mock Data
const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "HVAC System Specifications.pdf",
    type: "application/pdf",
    size: 2_456_789,
    uploadedBy: "Mike Johnson",
    uploadedAt: new Date("2025-01-25T10:30:00"),
    url: "#",
  },
  {
    id: "doc-2",
    name: "Building Permit - HVAC-2025-001.pdf",
    type: "application/pdf",
    size: 892_345,
    uploadedBy: "Admin",
    uploadedAt: new Date("2025-01-22T14:20:00"),
    url: "#",
  },
  {
    id: "doc-3",
    name: "Site Photos - Before Installation.zip",
    type: "application/zip",
    size: 15_678_234,
    uploadedBy: "Mike Johnson",
    uploadedAt: new Date("2025-01-20T16:00:00"),
    url: "#",
  },
  {
    id: "doc-4",
    name: "Signed Estimate EST-2025-0045.pdf",
    type: "application/pdf",
    size: 456_789,
    uploadedBy: "Customer",
    uploadedAt: new Date("2025-01-14T17:00:00"),
    url: "#",
  },
  {
    id: "doc-5",
    name: "Equipment Warranty Certificate.pdf",
    type: "application/pdf",
    size: 234_567,
    uploadedBy: "System",
    uploadedAt: new Date("2025-01-10T09:00:00"),
    url: "#",
  },
];

const mockPhotos: JobPhoto[] = [
  {
    id: "photo-1",
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200",
    category: "before",
    caption: "HVAC unit before replacement - showing age and wear",
    uploadedBy: "tech-1",
    uploadedByName: "Mike Johnson",
    uploadedAt: new Date("2025-01-15T09:30:00"),
    gpsCoords: {
      lat: 34.0522,
      lng: -118.2437,
    },
    metadata: {
      fileSize: 2_456_789,
      mimeType: "image/jpeg",
      width: 4032,
      height: 3024,
    },
  },
  {
    id: "photo-2",
    url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=200",
    category: "before",
    caption: "Ductwork inspection - visible damage",
    uploadedBy: "tech-1",
    uploadedByName: "Mike Johnson",
    uploadedAt: new Date("2025-01-15T09:45:00"),
    gpsCoords: {
      lat: 34.0522,
      lng: -118.2437,
    },
    metadata: {
      fileSize: 1_892_345,
      mimeType: "image/jpeg",
      width: 4032,
      height: 3024,
    },
  },
  {
    id: "photo-3",
    url: "https://images.unsplash.com/photo-1635274529232-3f8d9e86f585?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1635274529232-3f8d9e86f585?w=200",
    category: "during",
    caption: "Removing old HVAC unit",
    uploadedBy: "tech-1",
    uploadedByName: "Mike Johnson",
    uploadedAt: new Date("2025-01-20T10:15:00"),
    gpsCoords: {
      lat: 34.0522,
      lng: -118.2437,
    },
    metadata: {
      fileSize: 3_234_567,
      mimeType: "image/jpeg",
      width: 4032,
      height: 3024,
    },
  },
  {
    id: "photo-4",
    url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200",
    category: "during",
    caption: "Installing new unit - progress update",
    uploadedBy: "tech-1",
    uploadedByName: "Mike Johnson",
    uploadedAt: new Date("2025-01-20T14:30:00"),
    gpsCoords: {
      lat: 34.0522,
      lng: -118.2437,
    },
    metadata: {
      fileSize: 2_987_654,
      mimeType: "image/jpeg",
      width: 4032,
      height: 3024,
    },
  },
  {
    id: "photo-5",
    url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200",
    category: "during",
    caption: "Electrical connections and wiring",
    uploadedBy: "tech-2",
    uploadedByName: "Sarah Wilson",
    uploadedAt: new Date("2025-01-20T15:45:00"),
    gpsCoords: {
      lat: 34.0522,
      lng: -118.2437,
    },
    metadata: {
      fileSize: 1_765_432,
      mimeType: "image/jpeg",
      width: 4032,
      height: 3024,
    },
  },
  {
    id: "photo-6",
    url: "https://images.unsplash.com/photo-1631545806609-57f6e4e4f0cf?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1631545806609-57f6e4e4f0cf?w=200",
    category: "after",
    caption: "New HVAC system installed and operational",
    uploadedBy: "tech-1",
    uploadedByName: "Mike Johnson",
    uploadedAt: new Date("2025-01-22T16:00:00"),
    gpsCoords: {
      lat: 34.0522,
      lng: -118.2437,
    },
    metadata: {
      fileSize: 3_456_789,
      mimeType: "image/jpeg",
      width: 4032,
      height: 3024,
    },
  },
  {
    id: "photo-7",
    url: "https://images.unsplash.com/photo-1635274529232-3f8d9e86f585?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1635274529232-3f8d9e86f585?w=200",
    category: "after",
    caption: "Final thermostat installation",
    uploadedBy: "tech-1",
    uploadedByName: "Mike Johnson",
    uploadedAt: new Date("2025-01-22T16:30:00"),
    gpsCoords: {
      lat: 34.0522,
      lng: -118.2437,
    },
    metadata: {
      fileSize: 1_234_567,
      mimeType: "image/jpeg",
      width: 4032,
      height: 3024,
    },
  },
  {
    id: "photo-8",
    url: "https://images.unsplash.com/photo-1581092160607-ee67a4f2f1d2?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1581092160607-ee67a4f2f1d2?w=200",
    category: "other",
    caption: "Customer walkthrough and system demonstration",
    uploadedBy: "tech-1",
    uploadedByName: "Mike Johnson",
    uploadedAt: new Date("2025-01-22T17:00:00"),
    metadata: {
      fileSize: 2_123_456,
      mimeType: "image/jpeg",
      width: 4032,
      height: 3024,
    },
  },
];

const CENTS_DIVISOR = 100;
const PERCENTAGE_MULTIPLIER = 100;

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

function formatDateTime(date: Date | number | null): string {
  if (!date) {
    return "—";
  }
  const d = typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

function formatFileSize(bytes: number): string {
  const KB_DIVISOR = 1024;
  const MB_DIVISOR = 1_048_576;

  if (bytes < KB_DIVISOR) {
    return `${bytes} B`;
  }
  if (bytes < MB_DIVISOR) {
    return `${(bytes / KB_DIVISOR).toFixed(1)} KB`;
  }
  return `${(bytes / MB_DIVISOR).toFixed(1)} MB`;
}

function getCommunicationIcon(type: string) {
  switch (type) {
    case "email":
      return <Mail className="size-4" />;
    case "phone":
      return <Phone className="size-4" />;
    case "sms":
      return <MessageSquare className="size-4" />;
    case "note":
      return <FileText className="size-4" />;
    default:
      return <MessageSquare className="size-4" />;
  }
}

function getCommunicationBadge(type: string) {
  const variants: Record<string, "default" | "secondary" | "outline"> = {
    email: "default",
    phone: "secondary",
    sms: "secondary",
    note: "outline",
  };

  return (
    <Badge variant={variants[type] || "outline"}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
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

  return (
    <Badge variant={variants[status] as never}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: jobId } = await params;

  // Parse line items and add IDs for DataTable
  const lineItems: LineItem[] = (
    JSON.parse(String(mockEstimate.lineItems)) as LineItem[]
  ).map((item, index) => ({
    ...item,
    id: String(index),
  }));

  return (
    <div className="space-y-6">
      {/* Job Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-3xl tracking-tight">
            {mockJob.jobNumber}
          </h1>
          <Badge variant="outline">{mockJob.jobType}</Badge>
        </div>
        <p className="text-muted-foreground">{mockJob.title}</p>
      </div>

      {/* Process Indicator */}
      <div id="timeline">
        <JobProcessIndicator
          currentStatus={mockJob.status as never}
          dates={{
            quoted: mockJob.createdAt, // Using createdAt as quoted date
            scheduled: mockJob.scheduledStart,
            inProgress: mockJob.actualStart,
            completed: mockJob.actualEnd,
          }}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3" id="financials">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Amount</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {formatCurrency(mockJob.totalAmount)}
            </div>
            <p className="text-muted-foreground text-xs">
              {formatCurrency(mockJob.paidAmount)} paid •{" "}
              {formatCurrency(
                (mockJob.totalAmount || 0) - (mockJob.paidAmount || 0)
              )}{" "}
              remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Scheduled Dates
            </CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {formatDate(mockJob.scheduledStart)}
            </div>
            <p className="text-muted-foreground text-xs">
              to {formatDate(mockJob.scheduledEnd)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Priority</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl capitalize">
              {mockJob.priority}
            </div>
            <p className="text-muted-foreground text-xs">
              Current priority level
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Job Information */}
          <Card id="job-details">
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
              <CardDescription>Complete details about this job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-muted-foreground text-sm">
                    Job Number
                  </div>
                  <div className="font-medium">{mockJob.jobNumber}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Status</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {mockJob.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Job Type</div>
                  <div className="font-medium capitalize">
                    {mockJob.jobType}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Priority</div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        mockJob.priority === "high"
                          ? "destructive"
                          : mockJob.priority === "medium"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {mockJob.priority}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Schedule Information */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-sm">
                  <Clock className="size-4" />
                  Schedule
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-muted-foreground text-sm">
                      Scheduled Start
                    </div>
                    <div className="font-medium">
                      {formatDate(mockJob.scheduledStart)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">
                      Scheduled End
                    </div>
                    <div className="font-medium">
                      {formatDate(mockJob.scheduledEnd)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">
                      Actual Start
                    </div>
                    <div className="font-medium">
                      {formatDate(mockJob.actualStart)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">
                      Actual End
                    </div>
                    <div className="font-medium">
                      {mockJob.actualEnd
                        ? formatDate(mockJob.actualEnd)
                        : "In progress"}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <div className="mb-2 text-muted-foreground text-sm">
                  Description
                </div>
                <div className="text-sm">{mockJob.description}</div>
              </div>

              {/* Notes */}
              {mockJob.notes ? (
                <>
                  <Separator />
                  <div>
                    <div className="mb-2 text-muted-foreground text-sm">
                      Job Notes
                    </div>
                    <div className="rounded-md bg-muted p-3 text-sm">
                      {mockJob.notes}
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
                    {formatDate(mockJob.createdAt)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">
                    Last Updated
                  </div>
                  <div className="font-medium">
                    {formatDate(mockJob.updatedAt)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoices Section */}
          <Card id="invoices">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invoices ({mockInvoices.length})</CardTitle>
                  <CardDescription>All invoices for this job</CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/work/${jobId}/invoices/new`}>
                    <DollarSign className="mr-2 size-4" />
                    New Invoice
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <JobInvoicesTable invoices={mockInvoices} itemsPerPage={5} />
            </CardContent>
          </Card>

          {/* Estimate Section */}
          <Card id="estimates">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Estimate</CardTitle>
                  <CardDescription>
                    {mockEstimate.estimateNumber} -{" "}
                    {getStatusBadge(mockEstimate.status)}
                  </CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/work/estimates/${mockEstimate.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-muted-foreground text-sm">
                    Total Amount
                  </div>
                  <div className="font-medium">
                    {formatCurrency(mockEstimate.totalAmount)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">
                    Valid Until
                  </div>
                  <div className="font-medium">
                    {formatDate(mockEstimate.validUntil)}
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <div className="mb-2 font-medium text-sm">Line Items</div>
                <JobLineItemsTable itemsPerPage={5} lineItems={lineItems} />
              </div>
            </CardContent>
          </Card>

          {/* Job Costing & Profitability */}
          <Card id="costing">
            <CardHeader>
              <CardTitle>Job Costing & Profitability</CardTitle>
              <CardDescription>
                Detailed cost breakdown and profit analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cost Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">Labor</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="size-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Direct labor costs for technicians and crew</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(mockJobCost.labor)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      Materials
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="size-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cost of HVAC units, ductwork, and supplies</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(mockJobCost.materials)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      Equipment
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="size-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Equipment rental and tool usage costs</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(mockJobCost.equipment)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      Subcontractors
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="size-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Costs for electrical and other subcontractors</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(mockJobCost.subcontractors)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      Permits & Fees
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="size-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Building permits and inspection fees</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(mockJobCost.permits)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      Overhead
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="size-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Allocated overhead costs (admin, insurance, utilities)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(mockJobCost.overhead)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">Other</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="size-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Miscellaneous costs and contingencies</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(mockJobCost.other)}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Total Cost */}
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <span className="font-medium text-sm">Total Cost</span>
                <span className="font-bold">
                  {formatCurrency(
                    mockJobCost.labor +
                      mockJobCost.materials +
                      mockJobCost.equipment +
                      mockJobCost.subcontractors +
                      mockJobCost.permits +
                      mockJobCost.overhead +
                      mockJobCost.other
                  )}
                </span>
              </div>

              <Separator />

              {/* Profitability Analysis */}
              <div className="space-y-3" id="profitability">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      Revenue
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="size-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total amount invoiced to customer</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(mockJob.totalAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">Gross Profit</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="size-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Revenue minus total costs</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    {(mockJob.totalAmount || 0) -
                      (mockJobCost.labor +
                        mockJobCost.materials +
                        mockJobCost.equipment +
                        mockJobCost.subcontractors +
                        mockJobCost.permits +
                        mockJobCost.overhead +
                        mockJobCost.other) >
                    0 ? (
                      <TrendingUp className="size-4 text-green-600" />
                    ) : (
                      <TrendingDown className="size-4 text-red-600" />
                    )}
                    <span
                      className={`font-bold ${
                        (mockJob.totalAmount || 0) -
                          (mockJobCost.labor +
                            mockJobCost.materials +
                            mockJobCost.equipment +
                            mockJobCost.subcontractors +
                            mockJobCost.permits +
                            mockJobCost.overhead +
                            mockJobCost.other) >
                        0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(
                        (mockJob.totalAmount || 0) -
                          (mockJobCost.labor +
                            mockJobCost.materials +
                            mockJobCost.equipment +
                            mockJobCost.subcontractors +
                            mockJobCost.permits +
                            mockJobCost.overhead +
                            mockJobCost.other)
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md bg-muted p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">Profit Margin</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="size-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Gross profit as percentage of revenue</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-bold">
                    {(
                      (((mockJob.totalAmount || 0) -
                        (mockJobCost.labor +
                          mockJobCost.materials +
                          mockJobCost.equipment +
                          mockJobCost.subcontractors +
                          mockJobCost.permits +
                          mockJobCost.overhead +
                          mockJobCost.other)) /
                        (mockJob.totalAmount || 1)) *
                      PERCENTAGE_MULTIPLIER
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communications */}
          <Card id="communications">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="size-5" />
                    Communications ({mockCommunications.length})
                  </CardTitle>
                  <CardDescription>
                    All messages and notes for this job
                  </CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/work/${jobId}/communications/new`}>
                    <Plus className="mr-2 size-4" />
                    Add
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCommunications.map((comm) => (
                  <div
                    className="flex gap-3 rounded-lg border p-3"
                    key={comm.id}
                  >
                    <div className="mt-1">
                      {getCommunicationIcon(comm.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {getCommunicationBadge(comm.type)}
                        <span className="text-muted-foreground text-xs">
                          {formatDateTime(comm.sentAt)}
                        </span>
                      </div>
                      {comm.subject ? (
                        <div className="font-medium text-sm">
                          {comm.subject}
                        </div>
                      ) : null}
                      <p className="text-muted-foreground text-sm">
                        {comm.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-medium">{comm.from}</span>
                        {comm.to ? (
                          <>
                            <span className="text-muted-foreground">→</span>
                            <span className="text-muted-foreground">
                              {comm.to}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <Button asChild className="w-full" variant="secondary">
                <Link href={`/dashboard/work/${jobId}/communications`}>
                  View All Communications
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Documentation */}
          <Card id="documents">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Paperclip className="size-5" />
                    Documentation ({mockDocuments.length})
                  </CardTitle>
                  <CardDescription>
                    Files, photos, and documents
                  </CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/work/${jobId}/documents/upload`}>
                    <Upload className="mr-2 size-4" />
                    Upload
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockDocuments.map((doc) => (
                  <div
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
                    key={doc.id}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                        <FileText className="size-5 text-muted-foreground" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-medium text-sm">{doc.name}</div>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                          <span>{formatFileSize(doc.size)}</span>
                          <span>•</span>
                          <span>{doc.uploadedBy}</span>
                          <span>•</span>
                          <span>{formatDate(doc.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={doc.url}>
                        <Download className="size-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <Button asChild className="w-full" variant="secondary">
                <Link href={`/dashboard/work/${jobId}/documents`}>
                  View All Documents
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Photo Gallery */}
          <div id="photo-gallery">
            <JobPhotoGalleryWrapper photos={mockPhotos} />
          </div>

          {/* Property Details */}
          <Card id="property">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5" />
                Property Details
              </CardTitle>
              <CardDescription>{mockProperty.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 font-semibold text-sm">Location</h3>
                <div className="space-y-2 text-sm">
                  <div className="font-medium">
                    {mockProperty.address}
                    {mockProperty.address2 ? `, ${mockProperty.address2}` : ""}
                  </div>
                  <div className="text-muted-foreground">
                    {mockProperty.city}, {mockProperty.state}{" "}
                    {mockProperty.zipCode}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-muted-foreground text-sm">
                    Property Type
                  </div>
                  <div className="font-medium capitalize">
                    {mockProperty.propertyType}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">
                    Square Footage
                  </div>
                  <div className="font-medium">
                    {mockProperty.squareFootage?.toLocaleString()} sq ft
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">
                    Year Built
                  </div>
                  <div className="font-medium">{mockProperty.yearBuilt}</div>
                </div>
              </div>

              {mockProperty.notes ? (
                <>
                  <Separator />
                  <div>
                    <div className="mb-2 text-muted-foreground text-sm">
                      Property Notes
                    </div>
                    <div className="rounded-md bg-muted p-3 text-sm">
                      {mockProperty.notes}
                    </div>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Payment breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Total Amount
                  </span>
                  <span className="font-bold">
                    {formatCurrency(mockJob.totalAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Paid Amount
                  </span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(mockJob.paidAmount)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Remaining Balance</span>
                  <span className="font-bold text-orange-600">
                    {formatCurrency(
                      (mockJob.totalAmount || 0) - (mockJob.paidAmount || 0)
                    )}
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <div className="mb-2 text-muted-foreground text-sm">
                  Payment Progress
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-green-600"
                      style={{
                        width: `${((mockJob.paidAmount || 0) / (mockJob.totalAmount || 1)) * PERCENTAGE_MULTIPLIER}%`,
                      }}
                    />
                  </div>
                  <div className="text-center text-muted-foreground text-xs">
                    {Math.round(
                      ((mockJob.paidAmount || 0) / (mockJob.totalAmount || 1)) *
                        PERCENTAGE_MULTIPLIER
                    )}
                    % paid
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/dashboard/work/${jobId}/invoices/new`}>
                    <DollarSign className="mr-2 size-4" />
                    Create Invoice
                  </Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/dashboard/work/${jobId}/estimates/new`}>
                    <FileText className="mr-2 size-4" />
                    Create Estimate
                  </Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link
                    href={`/dashboard/work/purchase-orders/new?jobId=${jobId}`}
                  >
                    <Package className="mr-2 size-4" />
                    Create PO
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customer Card */}
          <Card id="customer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="size-5" />
                  <div>
                    <CardTitle>Customer</CardTitle>
                    <CardDescription className="mt-1">
                      {mockCustomer.name}
                    </CardDescription>
                  </div>
                </div>
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/dashboard/customers/${mockCustomer.id}`}>
                    <ExternalLink className="size-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-muted-foreground text-xs">Name</div>
                    <div className="font-medium text-sm">
                      {mockCustomer.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-muted-foreground text-xs">Email</div>
                    <Link
                      className="font-medium text-sm hover:underline"
                      href={`mailto:${mockCustomer.email}`}
                    >
                      {mockCustomer.email}
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-muted-foreground text-xs">Phone</div>
                    <Link
                      className="font-medium text-sm hover:underline"
                      href={`tel:${mockCustomer.phone}`}
                    >
                      {mockCustomer.phone}
                    </Link>
                  </div>
                </div>
                {mockCustomer.company ? (
                  <div className="flex items-start gap-3">
                    <Building2 className="mt-0.5 size-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-muted-foreground text-xs">
                        Company
                      </div>
                      <div className="font-medium text-sm">
                        {mockCustomer.company}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <Separator />

              {/* Address */}
              <div>
                <div className="mb-2 text-muted-foreground text-xs">
                  Billing Address
                </div>
                <div className="space-y-1 text-sm">
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

              {mockCustomer.notes ? (
                <>
                  <Separator />
                  <div>
                    <div className="mb-2 text-muted-foreground text-xs">
                      Notes
                    </div>
                    <div className="rounded-md bg-muted p-2 text-xs">
                      {mockCustomer.notes}
                    </div>
                  </div>
                </>
              ) : null}

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <Button asChild className="flex-1" size="sm" variant="outline">
                  <Link href={`/dashboard/customers/${mockCustomer.id}`}>
                    <User className="mr-2 size-3.5" />
                    View Profile
                  </Link>
                </Button>
                <Button asChild className="flex-1" size="sm" variant="outline">
                  <Link href={`/dashboard/customers/${mockCustomer.id}/edit`}>
                    <Edit className="mr-2 size-3.5" />
                    Edit
                  </Link>
                </Button>
              </div>
              <Button asChild className="w-full" size="sm" variant="secondary">
                <Link href={`/dashboard/work/${jobId}/change-customer`}>
                  <UserCog className="mr-2 size-3.5" />
                  Change Customer
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
