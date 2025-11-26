# Detail Page Layout System

## Overview

This directory contains a unified layout system for all entity detail pages (Jobs, Customers, Appointments, Team Members, Purchase Orders). The system provides:

- **Standardized collapsible sections** (Activity Log, Notes, Attachments, Related Items)
- **Configurable headers** per page
- **Reusable components** with consistent UX
- **Responsive design** out of the box

## Components

### DetailPageContentLayout

The main layout component that accepts custom headers and sections.

**Location:** `src/components/layout/detail-page-content-layout.tsx`

**Usage:**

```typescript
import { DetailPageContentLayout } from "@/components/layout/detail-page-content-layout";
import { UnifiedAccordionSection, UnifiedAccordionContent } from "@/components/ui/unified-accordion";

export function MyDetailPage({ data }: Props) {
  // Define custom sections specific to this page
  const customSections: UnifiedAccordionSection[] = [
    {
      id: "line-items",
      title: "Line Items",
      count: data.lineItems.length,
      content: (
        <UnifiedAccordionContent>
          <LineItemsTable items={data.lineItems} />
        </UnifiedAccordionContent>
      ),
    },
    // ... more custom sections
  ];

  return (
    <DetailPageContentLayout
      // Optional: Use simple header config
      header={{
        title: "My Entity",
        subtitle: "Entity #123",
        badges: [<Badge>Active</Badge>],
        actions: [
          <Button>Edit</Button>,
          <Button>Delete</Button>,
        ],
        metadata: [
          {
            icon: <User className="size-4" />,
            label: "Created By",
            value: "John Doe",
          },
        ],
      }}
      // Or use a custom header component
      customHeader={<MyCustomHeader />}
      // Pass custom sections
      customSections={customSections}
      // Pass data for standard sections
      activities={data.activities}
      notes={data.notes}
      attachments={data.attachments}
      relatedItems={data.relatedItems}
      // Control which standard sections to show
      showStandardSections={{
        activities: true,
        notes: true,
        attachments: true,
        relatedItems: true,
      }}
      defaultOpenSection="line-items"
    />
  );
}
```

### Standard Sections

Reusable section components for common functionality across all detail pages:

#### ActivityLogSection

**Location:** `src/components/layout/standard-sections/activity-log-section.tsx`

Displays a timeline of activity with user avatars and timestamps.

```typescript
import { ActivityLogSection } from "@/components/layout/standard-sections/activity-log-section";

<ActivityLogSection activities={activities} />
```

**Props:**
- `activities: any[]` - Array of activity objects with `id`, `description`, `user`, `created_at`

#### NotesSection

**Location:** `src/components/layout/standard-sections/notes-section.tsx`

Displays notes with ability to add new ones.

```typescript
import { NotesSection } from "@/components/layout/standard-sections/notes-section";

<NotesSection 
  notes={notes}
  entityType="job"
  entityId={jobId}
  onAddNote={async (content) => {
    // Handle note creation
  }}
/>
```

**Props:**
- `notes: any[]` - Array of note objects
- `entityType?: string` - Type of entity (for context)
- `entityId?: string` - Entity ID (for context)
- `onAddNote?: (content: string) => Promise<void>` - Optional handler for adding notes

#### AttachmentsSection

**Location:** `src/components/layout/standard-sections/attachments-section.tsx`

Displays file attachments with upload capability.

```typescript
import { AttachmentsSection } from "@/components/layout/standard-sections/attachments-section";

<AttachmentsSection 
  attachments={attachments}
  entityType="customer"
  entityId={customerId}
  onUpload={async (files) => {
    // Handle file upload
  }}
/>
```

**Props:**
- `attachments: any[]` - Array of attachment objects
- `entityType?: string` - Type of entity
- `entityId?: string` - Entity ID
- `onUpload?: (files: FileList) => Promise<void>` - Optional upload handler

#### RelatedItemsSection

**Location:** `src/components/layout/standard-sections/related-items-section.tsx`

Displays links to related entities.

```typescript
import { RelatedItemsSection } from "@/components/layout/standard-sections/related-items-section";

<RelatedItemsSection 
  relatedItems={[
    {
      id: "cust-123",
      type: "customer",
      title: "John Doe",
      subtitle: "john@example.com",
      href: "/dashboard/customers/cust-123",
      badge: {
        label: "VIP",
        variant: "default",
      },
    },
  ]}
/>
```

**Props:**
- `relatedItems: RelatedItem[]` - Array of related item objects

## UnifiedAccordion

The accordion component that ensures only one section is open at a time.

**Location:** `src/components/ui/unified-accordion.tsx`

**Usage:**

```typescript
import { 
  UnifiedAccordion, 
  UnifiedAccordionSection,
  UnifiedAccordionContent 
} from "@/components/ui/unified-accordion";

const sections: UnifiedAccordionSection[] = [
  {
    id: "details",
    title: "Details",
    icon: <FileText className="size-4" />,
    count: 5,
    content: (
      <UnifiedAccordionContent>
        {/* Your content here */}
      </UnifiedAccordionContent>
    ),
  },
];

<UnifiedAccordion 
  sections={sections} 
  defaultOpenSection="details" 
/>
```

## Migration Guide

### For Existing Pages

1. **Identify custom sections** - What data/functionality is specific to this page?
2. **Map to UnifiedAccordionSection** - Convert each section to the standard format
3. **Use standard sections** - Replace custom implementations of Activity, Notes, Attachments with standard components
4. **Choose header approach** - Use simple config or custom header based on complexity
5. **Test responsiveness** - Verify layout works on mobile/tablet/desktop

### Example: Converting a Custom Section

**Before:**
```typescript
<CollapsibleDataSection title="Line Items" count={lineItems.length}>
  <div className="p-4">
    <LineItemsTable items={lineItems} />
  </div>
</CollapsibleDataSection>
```

**After:**
```typescript
const customSections: UnifiedAccordionSection[] = [
  {
    id: "line-items",
    title: "Line Items",
    count: lineItems.length,
    content: (
      <UnifiedAccordionContent>
        <LineItemsTable items={lineItems} />
      </UnifiedAccordionContent>
    ),
  },
];
```

## Design Principles

1. **Server-First** - Components are server components by default, client components only when needed
2. **Consistent Spacing** - `mx-auto max-w-7xl px-4 py-6 sm:px-6` for container, `gap-4 sm:gap-6` for spacing
3. **Mobile-First** - Responsive classes start with mobile and use `sm:`, `md:`, `lg:` breakpoints
4. **Accessible** - All components follow WCAG AA guidelines
5. **Performance** - Minimal JavaScript, optimized for streaming

## Current Status

### Fully Migrated
- ✅ Purchase Orders - Uses standard Activity and Attachments sections

### Partially Migrated
- 🔄 Jobs - Uses mix of Accordion and CollapsibleDataSection, candidates for standard sections
- 🔄 Customers - Uses CollapsibleDataSection, candidates for standard sections  
- 🔄 Appointments - Already uses DetailPageLayout wrapper
- 🔄 Team Members - Already uses DetailPageLayout wrapper

### Next Steps
- Gradually migrate remaining pages to use standard sections
- Add Notes section where applicable
- Standardize Related Items sections across pages

