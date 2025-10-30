/**
 * Widget Renderer - Server Component
 *
 * Maps widget types to their corresponding components and passes data.
 * This component can be a Server Component since it just routes to other components.
 */

import type { Job, Property, User } from "@/lib/db/schema";
import type { PropertyEnrichment } from "@/lib/services/property-enrichment";
import type { JobWidget } from "@/lib/stores/job-details-layout-store";
// New Priority 1 widgets
import { ActivityLogWidget } from "./widgets/activity-log-widget";
// Core widgets
import { CommunicationsWidget } from "./widgets/communications-widget";
import {
  type CustomerData,
  CustomerInfoWidgetClient,
} from "./widgets/customer-info-widget-client";
import { DocumentsWidget } from "./widgets/documents-widget";
import { EstimatesWidget } from "./widgets/estimates-widget";
import { InvoicesWidget } from "./widgets/invoices-widget";
import { JobCostingWidget } from "./widgets/job-costing-widget";
import { JobDetailsWidget } from "./widgets/job-details-widget";
import { JobFinancialsWidget } from "./widgets/job-financials-widget";
import { JobTimelineWidget } from "./widgets/job-timeline-widget";
import { LocationMapWidget } from "./widgets/location-map-widget";
import { MaterialsListWidget } from "./widgets/materials-list-widget";
import { PaymentTrackerWidget } from "./widgets/payment-tracker-widget";
import { PermitsWidget } from "./widgets/permits-widget";
import { PhotoGalleryWidget } from "./widgets/photo-gallery-widget";
import { ProfitabilityWidget } from "./widgets/profitability-widget";
import { PropertyDetailsWidget } from "./widgets/property-details-widget";
import { PropertyIntelligenceWidget } from "./widgets/property-intelligence-widget";
import { PurchaseOrdersWidget } from "./widgets/purchase-orders-widget";
import { ScheduleWidget } from "./widgets/schedule-widget";
import { TeamAssignmentsWidget } from "./widgets/team-assignments-widget";

// Placeholder component for widgets not yet implemented
function PlaceholderWidget({ title }: { title: string }) {
  return (
    <div className="flex h-full min-h-[150px] items-center justify-center">
      <div className="text-center">
        <p className="font-medium text-muted-foreground text-sm">{title}</p>
        <p className="text-muted-foreground/60 text-xs">Coming soon</p>
      </div>
    </div>
  );
}

// Helper to convert User to CustomerData
function userToCustomerData(user: User): CustomerData {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    company: undefined, // User type doesn't have company field
    address: undefined, // User type doesn't have address fields
    city: undefined,
    state: undefined,
    zipCode: undefined,
  };
}

// ============================================================================
// Props Types
// ============================================================================

interface WidgetRendererProps {
  widget: JobWidget;
  job: Job;
  property?: Property;
  customer?: User;
  propertyEnrichment?: PropertyEnrichment | null;
  invoices?: unknown[];
  estimates?: unknown[];
  photos?: unknown[];
  documents?: unknown[];
  communications?: unknown[];
}

// ============================================================================
// Widget Renderer Component
// ============================================================================

export function WidgetRenderer({
  widget,
  job,
  property,
  customer,
  propertyEnrichment,
  invoices = [],
  estimates = [],
  photos = [],
  documents = [],
  communications = [],
}: WidgetRendererProps) {
  // Map widget types to components
  switch (widget.type) {
    // Core widgets
    case "job-header":
      // This is handled separately in the main page
      return <PlaceholderWidget title="Job Header" />;

    case "job-timeline":
      return <JobTimelineWidget job={job} />;

    case "job-financials":
      return <JobFinancialsWidget job={job} />;

    case "job-details":
      return <JobDetailsWidget job={job} />;

    // Property and customer
    case "property-details":
      return <PropertyDetailsWidget property={property} />;

    case "property-enrichment":
      return (
        <PropertyIntelligenceWidget
          enrichment={propertyEnrichment}
          property={property}
        />
      );

    case "customer-info":
      return customer ? (
        <CustomerInfoWidgetClient
          customer={userToCustomerData(customer)}
          jobId={job.id}
        />
      ) : (
        <div className="text-muted-foreground text-sm">No customer data</div>
      );

    case "location-map":
      return <LocationMapWidget job={job} property={property} />;

    // Financial
    case "invoices":
      return <InvoicesWidget invoices={invoices} jobId={job.id} />;

    case "estimates":
      return <EstimatesWidget estimates={estimates} jobId={job.id} />;

    case "job-costing":
      return <JobCostingWidget job={job} />;

    case "profitability":
      return <ProfitabilityWidget job={job} />;

    case "payment-tracker":
      return <PaymentTrackerWidget job={job} />;

    // Project management
    case "schedule":
      return <ScheduleWidget job={job} />;

    case "team-assignments":
      return <TeamAssignmentsWidget job={job} />;

    case "materials-list":
      return <MaterialsListWidget job={job} />;

    case "equipment-list":
      return <PlaceholderWidget title="Equipment List" />;

    case "purchase-orders":
      return <PurchaseOrdersWidget job={job} />;

    // Documentation
    case "photos":
      return <PhotoGalleryWidget jobId={job.id} photos={photos} />;

    case "documents":
      return <DocumentsWidget documents={documents} jobId={job.id} />;

    case "permits":
      return <PermitsWidget job={job} />;

    case "communications":
      return (
        <CommunicationsWidget communications={communications} jobId={job.id} />
      );

    case "activity-log":
      return <ActivityLogWidget job={job} />;

    // Industry-specific
    case "hvac-equipment":
      return <PlaceholderWidget title="HVAC Equipment" />;

    case "plumbing-fixtures":
      return <PlaceholderWidget title="Plumbing Fixtures" />;

    case "electrical-panels":
      return <PlaceholderWidget title="Electrical Panels" />;

    case "roofing-materials":
      return <PlaceholderWidget title="Roofing Materials" />;

    case "landscape-zones":
      return <PlaceholderWidget title="Landscape Zones" />;

    // Analytics
    case "time-tracking":
      return <PlaceholderWidget title="Time Tracking" />;

    case "labor-hours":
      return <PlaceholderWidget title="Labor Hours" />;

    case "material-costs":
      return <PlaceholderWidget title="Material Costs" />;

    case "change-orders":
      return <PlaceholderWidget title="Change Orders" />;

    default:
      return <PlaceholderWidget title={widget.title} />;
  }
}
