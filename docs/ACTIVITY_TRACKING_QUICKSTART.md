# Activity Tracking Quick Start

Get started with activity tracking in 5 minutes.

## 1. View Activity Timeline

The activity button is already added to the job details toolbar at `/dashboard/work/[id]`:

```typescript
// Already implemented in job-details-toolbar-actions.tsx
<Button size="sm" variant="ghost" onClick={() => openActivitySheet()}>
  <ClipboardList className="mr-2 size-4" />
  Activity
</Button>
```

Click the **Activity** button to see the complete timeline.

## 2. Log Activities in Your Components

### Option A: Use the Hook (Client Components)

```typescript
"use client";

import { useActivityTracker } from "@/hooks/use-activity-tracker";

export function MyComponent({ job }) {
  const { logStatusChange, logNote, logPhoto } = useActivityTracker({
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
    });
  }

  // Log a note
  async function handleAddNote(note: string) {
    await logNote(note);
  }

  // Log a photo
  async function handlePhotoUpload(url: string, name: string) {
    await logPhoto(url, name);
  }
}
```

### Option B: Use Server Actions (Server Components)

```typescript
"use server";

import { logActivity } from "@/actions/activity";
import { createStatusChangeActivity } from "@/lib/utils/activity-tracker";

export async function updateJobStatus(jobId: string, newStatus: string) {
  // 1. Update database
  await db.update(jobs).set({ status: newStatus });

  // 2. Log activity
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

## 3. Common Activity Patterns

### Status Change
```typescript
await logStatusChange({
  oldStatus: "scheduled",
  newStatus: "in_progress",
  reason: "Started work on site",
});
```

### Note/Comment
```typescript
await logNote("Customer requested early start time");
```

### Photo Upload
```typescript
await logPhoto(
  "https://example.com/photo.jpg",
  "installation-photo.jpg",
  "Before installation"
);
```

### Document Upload
```typescript
await logDocument(
  "https://example.com/doc.pdf",
  "quote.pdf",
  "Final quote for customer"
);
```

### Assignment Change
```typescript
await logAssignment({
  oldAssignee: { id: "user-1", name: "John Smith" },
  newAssignee: { id: "user-2", name: "Mike Johnson" },
});
```

### AI Insight
```typescript
await logAIInsight({
  model: "gpt-4-vision",
  insightType: "equipment_detection",
  confidence: 0.92,
  data: { equipmentDetected: ["AC Unit", "Furnace"] },
});
```

### Automation Event
```typescript
await logAutomation({
  workflowId: "workflow-1",
  workflowName: "Customer Update Workflow",
  triggerType: "status_change",
  actionType: "send_sms",
  result: "success",
});
```

## 4. Display Activities

### In a Sheet/Modal
```typescript
import { JobActivityTimeline } from "@/components/work/job-activity-timeline";

<Sheet>
  <SheetContent>
    <JobActivityTimeline jobId={job.id} entityType="job" />
  </SheetContent>
</Sheet>
```

### In a Page
```typescript
import { getActivities } from "@/actions/activity";
import { ActivityTimeline } from "@/components/work/activity-timeline";

export default async function ActivityPage({ params }) {
  const { activities } = await getActivities({
    entityType: "job",
    entityId: params.id,
  });

  return <ActivityTimeline activities={activities || []} />;
}
```

## 5. Database Setup (TODO)

The schema is already defined in `src/lib/db/schema.ts`. To create the table:

```bash
# Generate migration
pnpm drizzle-kit generate

# Run migration (production)
pnpm drizzle-kit migrate
```

## 6. Replace Mock Data

The system currently uses mock data. To use real database:

1. Update `src/actions/activity.ts`:
   ```typescript
   // Replace mock insert with real database:
   import { db } from "@/lib/db";
   import { activities } from "@/lib/db/schema";

   export async function logActivity(data: CreateActivityData) {
     const [activity] = await db.insert(activities).values({
       ...data,
       occurredAt: data.occurredAt || new Date(),
       createdAt: new Date(),
     }).returning();

     return { success: true, activityId: activity.id };
   }
   ```

2. Update `getActivities` function similarly.

## Complete Example

Here's a complete example of adding activity tracking to a job update function:

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { logActivity } from "@/actions/activity";
import { createStatusChangeActivity } from "@/lib/utils/activity-tracker";

export async function updateJobStatus(
  jobId: string,
  newStatus: string,
  userId: string,
  userName: string
) {
  try {
    // 1. Get current job
    const job = await getJob(jobId);

    // 2. Update status
    await db.update(jobs)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(jobs.id, jobId));

    // 3. Log activity
    await logActivity(
      createStatusChangeActivity({
        entityType: "job",
        entityId: jobId,
        companyId: job.companyId,
        actorId: userId,
        actorName: userName,
        category: "user",
        metadata: {
          oldStatus: job.status,
          newStatus: newStatus,
        },
      })
    );

    // 4. Revalidate pages
    revalidatePath(`/dashboard/work/${jobId}`);

    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "Failed to update job" };
  }
}
```

## What's Already Built

✅ Database schema (`src/lib/db/schema.ts`)
✅ Type definitions (`src/types/activity.ts`)
✅ Utility functions (`src/lib/utils/activity-tracker.ts`)
✅ Server actions (`src/actions/activity.ts`)
✅ Custom hook (`src/hooks/use-activity-tracker.ts`)
✅ UI components (`src/components/work/activity-timeline.tsx`)
✅ Toolbar integration (`src/components/work/job-details-toolbar-actions.tsx`)
✅ Mock data for testing

## What You Need to Do

1. ⏳ Run database migrations to create `activities` table
2. ⏳ Replace mock data in `src/actions/activity.ts` with real DB calls
3. ⏳ Add activity tracking to your features (status changes, notes, etc.)
4. ⏳ Test the activity timeline in the job details page

## Support

- **Full Documentation**: See `docs/ACTIVITY_TRACKING.md`
- **Example Usage**: Check `src/components/work/job-details-toolbar-actions.tsx`
- **Mock Data**: Review `src/actions/activity.ts` for examples

---

Ready to track activities? Just import the hook and start logging! 🎉
