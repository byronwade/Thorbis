# Activity Tracking System

Comprehensive activity tracking for jobs, customers, invoices, estimates, and all other entities in Thorbis.

## Overview

The activity tracking system logs **every single change** that happens to entities in the system:

- ✅ Status changes
- ✅ Field updates
- ✅ Notes added
- ✅ Photos uploaded
- ✅ Documents added
- ✅ AI-generated insights
- ✅ Automation workflow notifications
- ✅ Assignment changes
- ✅ Communications sent
- ✅ And more...

## Features

- **Universal Tracking**: Works with all entity types (jobs, customers, invoices, etc.)
- **Rich Timeline UI**: Beautiful timeline view with icons, colors, and attachments
- **Actor Attribution**: Tracks who/what made each change (user, system, AI, automation)
- **Attachment Support**: Display photos and documents inline
- **AI Insights**: Log AI-generated insights with model info and confidence scores
- **Automation Events**: Track automation workflow executions
- **Filtering**: Filter by category (user, system, AI, automation)
- **Type-Safe**: Full TypeScript support with comprehensive types
- **Performance**: Optimized queries and rendering

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Activity Tracking System                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Database Schema (schema.ts)                              │
│     └─ activities table with polymorphic entity references  │
│                                                               │
│  2. Types (types/activity.ts)                                │
│     └─ TypeScript definitions for all activity patterns     │
│                                                               │
│  3. Utilities (lib/utils/activity-tracker.ts)               │
│     └─ Helper functions for creating & formatting activities│
│                                                               │
│  4. Server Actions (actions/activity.ts)                     │
│     └─ Server-side functions for logging & querying         │
│                                                               │
│  5. Custom Hook (hooks/use-activity-tracker.ts)             │
│     └─ React hook for easy activity logging                 │
│                                                               │
│  6. UI Components                                            │
│     ├─ ActivityTimeline (timeline display)                  │
│     └─ JobActivityTimeline (data fetching wrapper)          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

The `activities` table in `src/lib/db/schema.ts`:

```typescript
export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Entity references (polymorphic)
  entityType: pgText("entity_type").notNull(), // 'job' | 'customer' | 'invoice' | etc.
  entityId: uuid("entity_id").notNull(),
  companyId: uuid("company_id").notNull(),

  // Activity metadata
  activityType: pgText("activity_type").notNull(), // 'status_change' | 'note_added' | etc.
  action: pgText("action").notNull(), // Human-readable description
  category: pgText("category").notNull(), // 'user' | 'system' | 'ai' | 'automation'

  // Actor (who performed the action)
  actorId: uuid("actor_id").references(() => users.id),
  actorType: pgText("actor_type").notNull().default("user"),
  actorName: pgText("actor_name"),

  // Change details
  fieldName: pgText("field_name"),
  oldValue: pgText("old_value"),
  newValue: pgText("new_value"),

  // Additional context
  description: pgText("description"),
  metadata: pgJson("metadata"),

  // File attachments
  attachmentType: pgText("attachment_type"), // 'photo' | 'document' | 'video'
  attachmentUrl: pgText("attachment_url"),
  attachmentName: pgText("attachment_name"),

  // AI/Automation specific
  aiModel: pgText("ai_model"),
  automationWorkflowId: uuid("automation_workflow_id"),
  automationWorkflowName: pgText("automation_workflow_name"),

  // Flags
  isImportant: pgBoolean("is_important").notNull().default(false),
  isSystemGenerated: pgBoolean("is_system_generated").notNull().default(false),
  isVisible: pgBoolean("is_visible").notNull().default(true),

  // Timestamps
  occurredAt: timestamp("occurred_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

## Usage

### 1. Using the Custom Hook (Recommended)

The easiest way to track activities is using the `useActivityTracker` hook:

```typescript
"use client";

import { useActivityTracker } from "@/hooks/use-activity-tracker";

export function JobDetails({ job }: { job: Job }) {
  const {
    logStatusChange,
    logNote,
    logPhoto,
    logDocument,
    logAssignment,
  } = useActivityTracker({
    entityType: "job",
    entityId: job.id,
    companyId: job.companyId,
    actorId: currentUser.id,
    actorName: currentUser.name,
  });

  // Log a status change
  async function handleStatusChange(newStatus: string) {
    await updateJobStatus(job.id, newStatus);

    await logStatusChange({
      oldStatus: job.status,
      newStatus: newStatus,
      reason: "Customer requested change",
    });
  }

  // Log a note
  async function handleAddNote(noteContent: string) {
    await logNote(noteContent);
  }

  // Log a photo upload
  async function handlePhotoUpload(url: string, name: string) {
    await logPhoto(url, name, "Installation progress photo");
  }

  // ... rest of component
}
```

### 2. Using Server Actions Directly

For server-side code, use the actions directly:

```typescript
"use server";

import { logActivity } from "@/actions/activity";
import { createStatusChangeActivity } from "@/lib/utils/activity-tracker";

export async function updateJobStatus(jobId: string, newStatus: string) {
  // Update the job in the database
  await db.update(jobs).set({ status: newStatus }).where(eq(jobs.id, jobId));

  // Log the activity
  await logActivity(
    createStatusChangeActivity({
      entityType: "job",
      entityId: jobId,
      companyId: "company-1",
      actorId: "user-1",
      actorName: "John Smith",
      category: "user",
      metadata: {
        oldStatus: "scheduled",
        newStatus: newStatus,
      },
    })
  );
}
```

### 3. Logging AI Insights

When AI generates insights, log them:

```typescript
import { logActivity } from "@/actions/activity";
import { createAIInsightActivity } from "@/lib/utils/activity-tracker";

// After AI analysis
await logActivity(
  createAIInsightActivity({
    entityType: "job",
    entityId: job.id,
    companyId: job.companyId,
    category: "ai",
    metadata: {
      model: "gpt-4-vision",
      insightType: "equipment_detection",
      confidence: 0.92,
      data: {
        equipmentDetected: ["AC Unit", "Furnace"],
      },
    },
  })
);
```

### 4. Logging Automation Events

When automation workflows execute:

```typescript
import { logActivity } from "@/actions/activity";
import { createAutomationActivity } from "@/lib/utils/activity-tracker";

await logActivity(
  createAutomationActivity({
    entityType: "job",
    entityId: job.id,
    companyId: job.companyId,
    category: "automation",
    metadata: {
      workflowId: "workflow-1",
      workflowName: "Customer Update Workflow",
      triggerType: "status_change",
      actionType: "send_sms",
      result: "success",
      details: {
        recipientPhone: "+1234567890",
        message: "Your job status has been updated",
      },
    },
  })
);
```

## UI Components

### Activity Timeline

Display activities in a timeline view:

```typescript
import { ActivityTimeline } from "@/components/work/activity-timeline";

export function MyComponent() {
  const activities = await getActivities({
    entityType: "job",
    entityId: "job-123",
  });

  return <ActivityTimeline activities={activities.activities || []} />;
}
```

### Job Activity Timeline (with data fetching)

```typescript
import { JobActivityTimeline } from "@/components/work/job-activity-timeline";

export function MyComponent({ jobId }: { jobId: string }) {
  return <JobActivityTimeline jobId={jobId} entityType="job" />;
}
```

## Activity Types

| Type | Description | Example |
|------|-------------|---------|
| `created` | Entity was created | "created job" |
| `deleted` | Entity was deleted | "deleted job" |
| `status_change` | Status field changed | "changed status from Scheduled to In Progress" |
| `field_update` | Any field updated | "updated due date" |
| `note_added` | Note/comment added | "added a note" |
| `photo_added` | Photo uploaded | "uploaded a photo" |
| `document_added` | Document uploaded | "uploaded a document" |
| `ai_insight` | AI-generated insight | "generated equipment detection insight" |
| `automation` | Automation workflow executed | "sent customer update notification (success)" |
| `assignment_change` | Assigned user changed | "assigned to Mike Johnson" |
| `communication` | Communication sent | "sent an email" |
| `payment` | Payment processed | "received payment of $500" |
| `scheduled` | Entity scheduled | "scheduled for tomorrow" |
| `completed` | Entity completed | "marked as completed" |
| `cancelled` | Entity cancelled | "cancelled job" |

## Activity Categories

| Category | Description | Icon Color |
|----------|-------------|------------|
| `user` | User-initiated action | Green |
| `system` | System-generated event | Blue |
| `ai` | AI-generated insight | Purple |
| `automation` | Automation workflow | Orange |

## Filtering Activities

Filter activities by type or category:

```typescript
import { getActivities } from "@/actions/activity";

// Get only status changes
const statusChanges = await getActivities({
  entityType: "job",
  entityId: "job-123",
  activityType: "status_change",
});

// Get only AI insights
const aiInsights = await getActivities({
  entityType: "job",
  entityId: "job-123",
  category: "ai",
});

// Get activities in date range
const recentActivities = await getActivities({
  entityType: "job",
  entityId: "job-123",
  startDate: new Date("2025-01-01"),
  endDate: new Date("2025-01-31"),
});
```

## Best Practices

### 1. Log Activities Immediately After Changes

```typescript
// ✅ GOOD
async function updateJob(jobId: string, data: JobUpdate) {
  await db.update(jobs).set(data).where(eq(jobs.id, jobId));
  await logActivity({ ... }); // Log immediately after
}

// ❌ BAD
async function updateJob(jobId: string, data: JobUpdate) {
  await db.update(jobs).set(data).where(eq(jobs.id, jobId));
  // Forgot to log activity!
}
```

### 2. Use Helper Functions for Common Patterns

```typescript
// ✅ GOOD - Use helper functions
await logActivity(createStatusChangeActivity({ ... }));

// ❌ BAD - Manual construction
await logActivity({
  entityType: "job",
  entityId: jobId,
  activityType: "status_change",
  action: "changed status from ...",
  // ... lots of manual fields
});
```

### 3. Provide Context in Descriptions

```typescript
// ✅ GOOD - Clear description
await logNote("Confirmed installation date with customer. They're available all week.");

// ❌ BAD - Vague description
await logNote("Updated");
```

### 4. Mark Important Activities

```typescript
await logActivity({
  ...data,
  isImportant: true, // Highlight critical events
});
```

### 5. Use Metadata for Structured Data

```typescript
await logActivity({
  ...data,
  metadata: {
    confidence: 0.92,
    equipmentDetected: ["AC Unit", "Furnace"],
    analysisTime: "1.2s",
  },
});
```

## Integration Points

### Jobs (`/dashboard/work/[id]`)
- Status changes
- Assignment changes
- Notes and photos
- Process indicator updates

### Customers (`/dashboard/customers/[id]`)
- Profile updates
- Communication history
- Property additions
- Payment processing

### Invoices (`/dashboard/invoices/[id]`)
- Status changes (draft → sent → paid)
- Payment received
- Email notifications

### Estimates (`/dashboard/work/estimates/[id]`)
- Status changes (draft → sent → accepted/rejected)
- Modifications
- Customer interactions

### Automation Workflows
- Workflow executions
- Success/failure status
- Trigger events

### AI Systems
- Equipment detection
- Priority scoring
- Category tagging
- Sentiment analysis

## Performance Considerations

1. **Indexes**: Add indexes on `entityType`, `entityId`, and `occurredAt` for fast queries
2. **Pagination**: Load activities in batches (50-100 at a time)
3. **Filtering**: Filter on the server, not in the UI
4. **Caching**: Cache recent activities for 30-60 seconds
5. **Background Processing**: Log activities asynchronously when possible

## Database Migration

Run migrations to create the activities table:

```bash
# Generate migration
pnpm drizzle-kit generate

# Run migration
pnpm drizzle-kit migrate
```

## Testing

Example tests for activity tracking:

```typescript
import { logActivity } from "@/actions/activity";
import { getActivities } from "@/actions/activity";

describe("Activity Tracking", () => {
  it("should log a status change", async () => {
    const result = await logActivity({
      entityType: "job",
      entityId: "test-job-1",
      companyId: "test-company",
      activityType: "status_change",
      action: "changed status",
      category: "user",
    });

    expect(result.success).toBe(true);
  });

  it("should retrieve activities for an entity", async () => {
    const result = await getActivities({
      entityType: "job",
      entityId: "test-job-1",
    });

    expect(result.success).toBe(true);
    expect(result.activities).toHaveLength(1);
  });
});
```

## Future Enhancements

- [ ] Real-time activity updates via WebSockets/Supabase Realtime
- [ ] Activity export (PDF, CSV)
- [ ] Advanced filtering (multi-select, date ranges)
- [ ] Activity analytics dashboard
- [ ] Activity digest emails
- [ ] Undo/redo functionality based on activity log
- [ ] Activity-based audit reports
- [ ] Integration with external systems (Slack, Teams, etc.)

## Support

For questions or issues with the activity tracking system:
1. Check this documentation
2. Review the code examples in `/src/components/work/activity-timeline.tsx`
3. Examine the mock data in `/src/actions/activity.ts`
4. Open an issue on GitHub

---

**Last Updated**: January 29, 2025
**Version**: 1.0.0
