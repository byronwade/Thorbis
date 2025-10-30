/**
 * Job Details Page - Server Component (New Widget-Based Version)
 *
 * Performance optimizations:
 * - Server Component (no "use client" - uses params prop)
 * - Static content rendered on server
 * - Reduced JavaScript bundle size
 * - Better SEO and initial page load
 * - Improved performance with server-side data fetching
 *
 * Features:
 * - Widget-based customizable layout
 * - Industry-specific presets
 * - Property data enrichment
 * - Drag-and-drop widget repositioning
 */

import { WidgetGrid } from "@/components/work/job-details/widget-grid";
import { JobProcessIndicatorEditable } from "@/components/work/job-process-indicator-editable";
import type { Job, Property } from "@/lib/db/schema";
import { propertyEnrichmentService } from "@/lib/services/property-enrichment";

// ============================================================================
// Mock Data (Replace with real database queries)
// ============================================================================

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
  aiCategories: null,
  aiEquipment: null,
  aiServiceType: null,
  aiPriorityScore: null,
  aiTags: null,
  aiProcessedAt: null,
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

// Mock customer data matching User type from schema
const mockCustomer = {
  id: "customer-1",
  name: "John Smith",
  email: "john.smith@mainstreetoffice.com",
  phone: "(555) 123-4567",
  avatar: null,
  bio: null,
  emailVerified: true,
  lastLoginAt: new Date("2024-06-15"),
  isActive: true,
  createdAt: new Date("2024-06-15"),
  updatedAt: new Date("2024-06-15"),
};

// ============================================================================
// Page Component
// ============================================================================

export default async function JobDetailsPageNew({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: jobId } = await params;

  // ============================================================================
  // Data Fetching (Server-side)
  // ============================================================================

  // In production, replace these with real database queries
  const job = mockJob;
  const property = mockProperty;
  const customer = mockCustomer;

  // Fetch enriched property data
  const propertyEnrichment = await propertyEnrichmentService.enrichProperty(
    property.address,
    property.city,
    property.state,
    property.zipCode
  );

  // Mock additional data
  const invoices: unknown[] = [];
  const estimates: unknown[] = [];
  const photos: unknown[] = [];
  const documents: unknown[] = [];
  const communications: unknown[] = [];

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Process Timeline - Editable */}
      <div className="rounded-lg border bg-card p-4">
        <JobProcessIndicatorEditable
          currentStatus={job.status as never}
          dates={{
            quoted: job.createdAt,
            scheduled: job.scheduledStart,
            inProgress: job.actualStart,
            completed: job.actualEnd,
          }}
          jobId={job.id}
        />
      </div>

      {/* Widget Grid */}
      <WidgetGrid
        communications={communications}
        customer={customer}
        documents={documents}
        estimates={estimates}
        invoices={invoices}
        job={job}
        photos={photos}
        property={property}
        propertyEnrichment={propertyEnrichment}
      />

      {/* Property Enrichment Debug (Remove in production) */}
      {propertyEnrichment ? (
        <details className="rounded-lg border p-4">
          <summary className="cursor-pointer font-medium text-sm">
            Property Enrichment Data (Debug)
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-muted p-4 text-xs">
            {JSON.stringify(propertyEnrichment, null, 2)}
          </pre>
        </details>
      ) : null}
    </div>
  );
}
