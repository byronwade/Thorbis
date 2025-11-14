# Analytics Tracking System

Comprehensive event tracking using Vercel Analytics for dashboard, marketing, and user engagement events.

## Overview

The analytics system provides type-safe event tracking across the entire application:

- **Dashboard Events**: Job creation, customer management, invoice tracking, etc.
- **Marketing Events**: Tool usage, signups, conversions, content engagement
- **User Engagement**: Feature usage, navigation, form interactions, errors

## Quick Start

### Basic Usage

```typescript
import { trackEvent } from "@/lib/analytics";

// Track a simple event
trackEvent({
  name: "job.created",
  properties: {
    jobId: "job-123",
    customerId: "cust-456",
    estimatedValue: 5000
  }
});
```

### Using React Hooks

```typescript
"use client";

import { useAnalytics } from "@/lib/analytics";

function MyComponent() {
  const { track } = useAnalytics();

  const handleCreateJob = async () => {
    // ... create job logic
    
    track({
      name: "job.created",
      properties: { jobId: "123" }
    });
  };

  return <button onClick={handleCreateJob}>Create Job</button>;
}
```

### Form Tracking

```typescript
"use client";

import { useFormTracking } from "@/lib/analytics";

function SignupForm() {
  const { trackFormStart, trackFormSubmit, trackFormAbandon } = 
    useFormTracking("signup");

  useEffect(() => {
    trackFormStart();
    return () => trackFormAbandon();
  }, []);

  const handleSubmit = async () => {
    // ... submit logic
    trackFormSubmit({ success: true });
  };

  return <form>...</form>;
}
```

### Automatic Page View Tracking

Page views are automatically tracked via the `AnalyticsProvider` in the root layout. No additional code needed!

## Event Categories

### Dashboard Events

Track core business operations:

```typescript
// Job Events
trackEvent({ name: "job.created", properties: { jobId: "123" } });
trackEvent({ name: "job.status_changed", properties: { 
  jobId: "123", 
  oldStatus: "scheduled", 
  newStatus: "in_progress" 
}});
trackEvent({ name: "job.completed", properties: { 
  jobId: "123", 
  duration: 120,
  revenue: 5000
}});

// Customer Events
trackEvent({ name: "customer.created", properties: { 
  customerId: "123",
  source: "manual"
}});
trackEvent({ name: "customer.contacted", properties: {
  customerId: "123",
  method: "email"
}});

// Invoice Events
trackEvent({ name: "invoice.created", properties: {
  invoiceId: "123",
  amount: 5000,
  currency: "USD"
}});
trackEvent({ name: "invoice.paid", properties: {
  invoiceId: "123",
  amount: 5000,
  paymentMethod: "credit_card"
}});
```

### Marketing Events

Track user acquisition and engagement:

```typescript
// Tool Usage
trackEvent({ name: "tool.opened", properties: {
  toolName: "hourly-rate-calculator",
  toolCategory: "calculator"
}});
trackEvent({ name: "tool.completed", properties: {
  toolName: "hourly-rate-calculator",
  duration: 300,
  result: "calculated"
}});

// Calculator Usage
trackEvent({ name: "calculator.used", properties: {
  calculatorType: "hourly-rate",
  inputs: { workDaysPerWeek: 5 },
  result: { hourlyRate: 150 }
}});

// Signup Flow
trackEvent({ name: "signup.started", properties: {
  source: "marketing-page"
}});
trackEvent({ name: "signup.completed", properties: {
  userId: "user-123",
  plan: "pro"
}});
```

### User Engagement Events

Track feature usage and interactions:

```typescript
// Feature Usage
trackEvent({ name: "feature.used", properties: {
  featureName: "bulk_edit",
  firstTime: true
}});

// UI Interactions
trackEvent({ name: "ui.modal_opened", properties: {
  modalType: "job-details",
  trigger: "button-click"
}});

// Search
trackEvent({ name: "search.performed", properties: {
  query: "plumbing",
  category: "jobs",
  resultsCount: 15
}});
```

## Settings Telemetry

The settings overview page emits analytics so we can understand which clusters admins
touch most frequently and when sensitive toggles change.

### Quick Actions

Client-side buttons across each section emit `settings.quick_action` with the
cluster slug and action identifier:

```typescript
trackEvent({
  name: "settings.quick_action",
  properties: {
    section: "finance",
    action: "settings.quick_action.gift_cards"
  }
});
```

### Purchase Order System Toggle

When an admin enables or disables the purchase order system we log the state with
`settings.po_system_toggle`:

```typescript
trackEvent({
  name: "settings.po_system_toggle",
  properties: {
    enabled: true
  }
});
```

These events complement the Supabase-backed health metrics rendered on the page so the
telemetry cards always reflect reality while still letting Product measure feature
adoption without querying production tables.

## Integration Patterns

### Server Actions

For server actions, return tracking events that client components can track:

```typescript
// Server Action
"use server";

import { trackJobCreated } from "@/lib/analytics/server";

export async function createJob(formData: FormData) {
  // ... create job logic
  const jobId = "job-123";
  
  // Return tracking event
  return {
    success: true,
    jobId,
    trackingEvent: trackJobCreated(jobId, {
      customerId: "cust-456",
      jobType: "service"
    })
  };
}

// Client Component
"use client";

import { trackEvent } from "@/lib/analytics";

async function handleCreateJob() {
  const result = await createJob(formData);
  
  if (result.success && result.trackingEvent) {
    trackEvent(result.trackingEvent);
  }
}
```

### Component Lifecycle

```typescript
"use client";

import { useEffect } from "react";
import { useAnalytics, useFeatureTracking } from "@/lib/analytics";

function JobList() {
  const { track } = useAnalytics();
  const { trackFeatureUse } = useFeatureTracking();

  useEffect(() => {
    // Track feature usage on mount
    trackFeatureUse("job_list", { firstTime: false });
  }, []);

  const handleJobClick = (jobId: string) => {
    track({
      name: "job.viewed",
      properties: { jobId, viewType: "detail" }
    });
  };

  return <div>...</div>;
}
```

## Event Reference

### Dashboard Events

- `job.created` - Job created
- `job.updated` - Job updated
- `job.status_changed` - Job status changed
- `job.deleted` - Job deleted
- `job.viewed` - Job viewed
- `job.assigned` - Job assigned to technician
- `job.completed` - Job completed
- `customer.created` - Customer created
- `customer.updated` - Customer updated
- `customer.viewed` - Customer viewed
- `customer.deleted` - Customer deleted
- `customer.contacted` - Customer contacted
- `invoice.created` - Invoice created
- `invoice.sent` - Invoice sent
- `invoice.paid` - Invoice paid
- `invoice.viewed` - Invoice viewed
- `estimate.created` - Estimate created
- `estimate.sent` - Estimate sent
- `estimate.accepted` - Estimate accepted
- `estimate.declined` - Estimate declined

### Marketing Events

- `page.viewed` - Page viewed (automatic)
- `tool.opened` - Tool opened
- `tool.completed` - Tool completed
- `tool.shared` - Tool shared
- `calculator.used` - Calculator used
- `signup.started` - Signup started
- `signup.completed` - Signup completed
- `signup.abandoned` - Signup abandoned
- `auth.login` - User logged in
- `auth.logout` - User logged out
- `auth.signup` - User signed up
- `onboarding.started` - Onboarding started
- `onboarding.completed` - Onboarding completed
- `cta.clicked` - CTA clicked
- `cta.converted` - CTA converted

### User Engagement Events

- `navigation.page_viewed` - Page navigation (automatic)
- `feature.used` - Feature used
- `feature.discovered` - Feature discovered
- `ui.modal_opened` - Modal opened
- `ui.modal_closed` - Modal closed
- `form.started` - Form started
- `form.submitted` - Form submitted
- `form.abandoned` - Form abandoned
- `search.performed` - Search performed
- `export.started` - Export started
- `export.completed` - Export completed

## Best Practices

1. **Track Important Actions**: Focus on business-critical events (job creation, payments, signups)
2. **Include Context**: Always include relevant IDs and metadata
3. **Don't Track Sensitive Data**: Never track passwords, tokens, or PII
4. **Use Type Safety**: Leverage TypeScript types for event names and properties
5. **Track Errors**: Use error events to identify issues
6. **Track Performance**: Monitor slow operations and timeouts

## Viewing Analytics

Analytics data is available in your Vercel dashboard:

1. Go to your project in Vercel
2. Navigate to the "Analytics" tab
3. View events, page views, and custom events
4. Filter by event name, date range, and properties

## Adding New Events

To add a new event type:

1. Add the event definition to `src/lib/analytics/types.ts`
2. Use the event in your components
3. Update this documentation

Example:

```typescript
// In types.ts
| {
    name: "my.new.event";
    properties?: {
      myProperty?: string;
    };
  }
```

