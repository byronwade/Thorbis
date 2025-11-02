# Offline Functionality - Usage Guide

## Overview

This guide shows how to use the offline-first infrastructure in your components and pages. The offline system automatically handles network failures, queues operations, and syncs data when connectivity is restored.

## Quick Start

### 1. Using the Offline Supabase Client

Replace standard Supabase client calls with the offline-capable client:

```typescript
"use client";

import { createOfflineClient } from "@/lib/offline/supabase-offline";
import { useEffect, useState } from "react";

export function JobsList() {
  const [jobs, setJobs] = useState([]);
  const offlineClient = createOfflineClient();

  useEffect(() => {
    async function loadJobs() {
      // Automatically handles offline/online
      const { data, error, fromCache } = await offlineClient.select("jobs", {
        orderBy: { column: "created_at", ascending: false },
        limit: 50,
      });

      if (data) {
        setJobs(data);
        // Show indicator if data is from cache
        if (fromCache) {
          console.log("Loaded from offline cache");
        }
      }
    }

    loadJobs();
  }, []);

  return (
    <div>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
```

### 2. Creating Records Offline

```typescript
"use client";

import { createOfflineClient } from "@/lib/offline/supabase-offline";
import { Button } from "@/components/ui/button";

export function CreateJobForm({ customerId }: { customerId: string }) {
  const offlineClient = createOfflineClient();

  async function handleSubmit(formData: FormData) {
    const jobData = {
      customer_id: customerId,
      status: "scheduled",
      scheduled_date: formData.get("date") as string,
      notes: formData.get("notes") as string,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    // Works offline - creates temp ID and queues for sync
    const { data, error, queued } = await offlineClient.insert("jobs", jobData);

    if (data) {
      if (queued) {
        // Show success message with offline indicator
        console.log("Job created offline - will sync when online");
      } else {
        console.log("Job created successfully");
      }
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="date" type="date" />
      <textarea name="notes" />
      <Button type="submit">Create Job</Button>
    </form>
  );
}
```

### 3. Updating Records Offline

```typescript
"use client";

import { createOfflineClient } from "@/lib/offline/supabase-offline";

export function UpdateJobStatus({ jobId }: { jobId: string }) {
  const offlineClient = createOfflineClient();

  async function markComplete() {
    const { data, error, queued } = await offlineClient.update("jobs", jobId, {
      status: "completed",
      updated_at: Date.now(),
    });

    if (data) {
      if (queued) {
        console.log("Update queued for sync");
      } else {
        console.log("Update saved");
      }
    }
  }

  return <Button onClick={markComplete}>Mark Complete</Button>;
}
```

### 4. Showing Network Status

The offline indicator is automatically shown in the AppToolbar, but you can also use it in your components:

```typescript
"use client";

import { useNetworkStatus } from "@/lib/offline/network-status";
import { OfflineIndicator } from "@/components/offline/offline-indicator";

export function MyPage() {
  const { isOnline, pendingOperations } = useNetworkStatus();

  return (
    <div>
      {/* Automatic indicator */}
      <OfflineIndicator />

      {/* Custom offline message */}
      {!isOnline && (
        <div className="rounded-lg bg-yellow-500/10 p-4">
          <p>You are offline. Changes will sync when connection is restored.</p>
          {pendingOperations > 0 && (
            <p className="text-sm">{pendingOperations} changes pending sync</p>
          )}
        </div>
      )}

      {/* Your page content */}
    </div>
  );
}
```

### 5. Detailed Sync Status (Admin/Debug)

For settings or debug pages, show detailed sync information:

```typescript
"use client";

import { SyncStatus } from "@/components/offline/sync-status";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1>Settings</h1>

      {/* Shows all pending/failed operations with retry options */}
      <SyncStatus />
    </div>
  );
}
```

## API Reference

### createOfflineClient()

Creates an offline-capable Supabase client that automatically handles offline scenarios.

```typescript
const client = createOfflineClient();
```

#### Methods

**insert(table, data)**
- Inserts a record into the table
- Returns: `{ data, error, queued }`
- If offline: Creates temporary ID and queues for sync

**update(table, id, data)**
- Updates a record in the table
- Returns: `{ data, error, queued }`
- If offline: Updates local record and queues for sync

**select(table, options)**
- Selects records from the table
- Returns: `{ data, error, fromCache }`
- If offline: Returns from IndexedDB cache

**delete(table, id)**
- Deletes a record from the table
- Returns: `{ data, error, queued }`
- If offline: Removes locally and queues deletion

**getById(table, id)**
- Gets a single record by ID
- Returns: `{ data, error, fromCache }`
- If offline: Returns from IndexedDB cache

### useNetworkStatus()

Hook to monitor network status and pending operations.

```typescript
const { isOnline, pendingOperations, lastSync, isSyncing } = useNetworkStatus();
```

**Returns:**
- `isOnline: boolean` - Current network status
- `pendingOperations: number` - Count of unsynced operations
- `lastSync: Date | null` - Timestamp of last successful sync
- `isSyncing: boolean` - Whether sync is currently in progress

### Components

**OfflineIndicator**
- Shows current offline status in toolbar
- Automatically hidden when online with no pending operations
- Shows pending count and sync status

**SyncStatus**
- Detailed view of sync queue
- Shows pending and failed operations
- Allows manual retry and clear actions

**SyncStatusDetail**
- Compact sync status for settings pages
- Shows network status, pending count, and last sync time

## Supported Tables

Currently supported for offline use:
- `jobs` - Job records
- `invoices` - Invoice records
- `customers` - Customer data (read-only cache)

To add more tables, update:
1. `/src/lib/offline/indexed-db.ts` - Add store definition
2. `/src/lib/offline/supabase-offline.ts` - Add to `getStoreNameFromTable()`
3. `/src/lib/offline/sync-queue.ts` - Add to `getStoreNameFromTable()`

## Caching Strategy

The service worker automatically caches:

1. **Supabase API** (NetworkFirst)
   - Tries network first
   - Falls back to cache if network fails
   - 1 hour cache expiration
   - Max 100 entries

2. **Auth Requests** (NetworkOnly)
   - Never cached for security
   - Always requires network

3. **Images** (CacheFirst)
   - Served from cache first
   - 30 day expiration
   - Max 50 entries

4. **Static Resources** (StaleWhileRevalidate)
   - Served from cache immediately
   - Updated in background
   - 1 day expiration

## Conflict Resolution

Currently uses **last-write-wins** strategy:
- Most recent `updated_at` timestamp wins
- No conflict UI (can be added later)
- Works well for most field service scenarios

To handle conflicts manually, check failed operations in SyncStatus component.

## Performance Considerations

1. **IndexedDB Operations** - All async, non-blocking
2. **Sync Queue Processing** - Sequential to maintain order
3. **Network Status Polling** - Every 10 seconds
4. **Cache Size Limits** - Max 50MB total

## Testing Offline Mode

### Chrome DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Select "Offline" from throttling dropdown
4. Test creating/updating records
5. Go back online to see sync

### Firefox DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Offline" checkbox
4. Test operations
5. Uncheck to sync

### Real Device Testing
1. Enable airplane mode
2. Test critical workflows
3. Disable airplane mode
4. Verify sync completes

## Common Patterns

### Optimistic UI Updates

```typescript
const offlineClient = createOfflineClient();

async function toggleStatus(job) {
  // Update UI immediately
  setJob({ ...job, status: "completed" });

  // Save in background
  const { error, queued } = await offlineClient.update("jobs", job.id, {
    status: "completed",
  });

  if (error && !queued) {
    // Revert on error (not queued means real error)
    setJob(job);
  }
}
```

### Loading from Cache with Refresh

```typescript
const offlineClient = createOfflineClient();

async function loadJobs() {
  // Load from cache first (instant)
  const cached = await offlineClient.select("jobs");
  if (cached.fromCache) {
    setJobs(cached.data);
  }

  // Try to fetch fresh data
  if (navigator.onLine) {
    const fresh = await offlineClient.select("jobs");
    if (!fresh.fromCache) {
      setJobs(fresh.data);
    }
  }
}
```

### Showing Unsaved Changes

```typescript
const { pendingOperations } = useNetworkStatus();

function Header() {
  return (
    <div>
      <h1>Dashboard</h1>
      {pendingOperations > 0 && (
        <Badge variant="warning">
          {pendingOperations} unsaved change{pendingOperations > 1 ? "s" : ""}
        </Badge>
      )}
    </div>
  );
}
```

## Troubleshooting

### "Table not cached for offline use"
- Add the table to IndexedDB schema in `indexed-db.ts`
- Add mapping in `supabase-offline.ts`

### Operations not syncing
- Check SyncStatus component for errors
- Verify Supabase connection works when online
- Check browser console for sync errors

### Cache not updating
- Check service worker is registered: `navigator.serviceWorker.ready`
- Clear cache: DevTools > Application > Clear storage

### Sync queue growing
- Check for failed operations in SyncStatus
- Retry failed operations manually
- Clear failed operations if unrecoverable

## Security Notes

1. **Auth Tokens**: Never cached, stored in memory only
2. **Sensitive Data**: Should be encrypted before storing
3. **RLS Policies**: Respected even in offline mode
4. **Cache Expiration**: 7 days for customers, 1 hour for API

## Next Steps

- Add conflict resolution UI for critical data
- Implement selective sync (user chooses what to cache)
- Add Background Sync API for reliable syncing
- Add periodic background sync to refresh cache
- Add push notifications for sync completion
