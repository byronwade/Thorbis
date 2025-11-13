# Sync Status System Implementation

## Overview

Comprehensive sync status system that replaces toast notifications with a persistent header indicator showing real-time progress for all sync operations (bulk sends, data sync, offline queue, etc.).

## Features

### 1. **Header Status Indicator**
- 🔄 Rotating icon when syncing
- 📊 Badge showing count of active/queued operations
- 🌐 Online/offline status
- 👆 Click to open details panel
- ✨ Auto-hides when idle

### 2. **Sync Status Panel**
- 📋 Real-time progress for each operation
- 📈 Progress bars and percentages
- ⏱️ Time tracking (started/completed)
- ❌ Error messages for failed operations
- 🗑️ Clear completed operations
- 📱 Offline queue management

### 3. **Offline Support**
- 📴 Automatic offline detection
- 📦 Queue operations when offline
- 🔄 Auto-sync when back online
- 💾 Persisted queue (survives page refresh)
- ⚡ Retry failed operations

### 4. **Operation Types**
- 📧 Bulk send invoices
- 📋 Bulk send estimates
- 🔄 Data synchronization
- 📤 File uploads
- 📥 Exports
- ⏰ Offline sync queue

## Architecture

### State Management

**Sync Store** (`src/lib/stores/sync-store.ts`)
- Zustand store with persistence
- Manages active operations
- Handles offline queue
- Tracks online/offline status
- Controls panel visibility

```typescript
interface SyncOperation {
  id: string;
  type: SyncOperationType;
  status: "pending" | "in_progress" | "completed" | "failed" | "queued";
  title: string;
  description?: string;
  progress: number; // 0-100
  total?: number;
  current?: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}
```

### Components

**1. SyncStatusIndicator** (`src/components/layout/sync-status-indicator.tsx`)
- Header badge component
- Shows sync status icon (spinning loader, offline icon, etc.)
- Displays operation count
- Handles online/offline status monitoring
- Toggles details panel

**2. SyncStatusPanel** (`src/components/layout/sync-status-panel.tsx`)
- Sheet/drawer with operation details
- Real-time progress tracking
- Offline queue management
- Operation history
- Clear/delete actions

### Integration

**Dashboard Layout** (`src/app/(dashboard)/layout.tsx`)
```tsx
import { SyncStatusPanel } from "@/components/layout/sync-status-panel";

// Added to layout
<SyncStatusPanel />
```

**App Header** (`src/components/layout/app-header-client.tsx`)
```tsx
import { SyncStatusIndicator } from "./sync-status-indicator";

// Added before QuickAddDropdown
<SyncStatusIndicator />
```

## Usage

### Basic Usage - Bulk Send

```typescript
"use client";

import { useBulkSendInvoices } from "@/lib/hooks/use-bulk-send";

export function InvoicesTable() {
  const { send, isSending } = useBulkSendInvoices();

  const handleBulkSend = async (invoiceIds: string[]) => {
    await send(invoiceIds);
    // Progress automatically tracked in header
    // No need for toast notifications
  };

  return (
    <Button
      onClick={() => handleBulkSend(selectedIds)}
      disabled={isSending}
    >
      Send Invoices
    </Button>
  );
}
```

### Advanced Usage - Custom Operation

```typescript
"use client";

import { useSyncStore } from "@/lib/stores/sync-store";

export function FileUploader() {
  const startOperation = useSyncStore((state) => state.startOperation);
  const updateOperation = useSyncStore((state) => state.updateOperation);
  const completeOperation = useSyncStore((state) => state.completeOperation);

  const handleUpload = async (files: File[]) => {
    // Start operation
    const operationId = startOperation({
      type: "file_upload",
      title: `Uploading ${files.length} files`,
      description: "Preparing upload...",
      total: files.length,
      current: 0,
    });

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Update progress
        updateOperation(operationId, {
          current: i + 1,
          progress: Math.round(((i + 1) / files.length) * 100),
          description: `Uploading ${file.name}...`,
        });

        await uploadFile(file);
      }

      // Complete successfully
      completeOperation(operationId, true);
    } catch (error) {
      // Complete with error
      completeOperation(
        operationId,
        false,
        error instanceof Error ? error.message : "Upload failed"
      );
    }
  };

  return <input type="file" onChange={(e) => handleUpload([...e.target.files])} />;
}
```

### Offline Queue

```typescript
"use client";

import { useSyncStore } from "@/lib/stores/sync-store";

export function SaveButton() {
  const isOnline = useSyncStore((state) => state.isOnline);
  const queueOperation = useSyncStore((state) => state.queueOperation);

  const handleSave = async (data: any) => {
    if (!isOnline) {
      // Queue for later
      queueOperation({
        type: "data_sync",
        action: "Save invoice",
        payload: data,
      });

      toast.info("Saved locally", {
        description: "Will sync when you're back online",
      });
      return;
    }

    // Normal save logic
    await saveToServer(data);
  };

  return <Button onClick={() => handleSave(invoiceData)}>Save</Button>;
}
```

## Store API

### Actions

**Start Operation**
```typescript
const operationId = startOperation({
  type: "bulk_send_invoices",
  title: "Sending 5 invoices",
  description: "Preparing...",
  total: 5,
  current: 0,
});
```

**Update Operation**
```typescript
updateOperation(operationId, {
  current: 3,
  progress: 60,
  description: "Sending invoice 3 of 5...",
});
```

**Complete Operation**
```typescript
// Success
completeOperation(operationId, true);

// Failure
completeOperation(operationId, false, "Network error");
```

**Queue for Offline**
```typescript
queueOperation({
  type: "bulk_send_invoices",
  action: "Send 3 invoices",
  payload: { invoiceIds: ["id1", "id2", "id3"] },
});
```

**Panel Controls**
```typescript
const { togglePanel, openPanel, closePanel } = useSyncStore();

togglePanel(); // Toggle open/closed
openPanel();   // Open panel
closePanel();  // Close panel
```

### Hooks

**Check if Syncing**
```typescript
const isSyncing = useIsSyncing();
// Returns true if any operation is in progress
```

**Get Active Count**
```typescript
const activeCount = useActiveOperationsCount();
// Returns number of active operations
```

**Get Queued Count**
```typescript
const queuedCount = useQueuedOperationsCount();
// Returns number of queued operations
```

## UI States

### Status Indicator States

1. **Idle** (Hidden)
   - No active operations
   - No queued operations
   - Online

2. **Syncing** (Visible)
   - Rotating loader icon
   - Blue color
   - Badge with count
   - Text: "Syncing"

3. **Offline** (Visible)
   - Cloud off icon
   - Amber color
   - Badge with queued count
   - Text: "Offline"

4. **Queued** (Visible)
   - Clock icon
   - Amber color
   - Badge with count
   - Text: "Queued"

### Panel Sections

1. **Active Operations**
   - Spinning loader icon
   - Progress bar
   - Current/total count
   - Time since started
   - Real-time updates

2. **Offline Queue**
   - Clock icon
   - Queued time
   - Operation description
   - Auto-syncs when online

3. **Recent (Completed)**
   - Success: Green checkmark
   - Failed: Red X with error
   - Time completed
   - Delete button

## Offline Behavior

### Detection
- Monitors `navigator.onLine`
- Listens to `online`/`offline` events
- Updates store state automatically

### Queueing
- Operations queued when offline
- Stored in localStorage (persists across refresh)
- Includes full payload for retry

### Auto-Sync
- Triggers when coming back online
- Processes queue in order
- Shows progress in panel
- Removes successful operations

### Retry Logic
- Failed operations stay in queue
- Retry count tracked
- Max retries configurable
- Shows retry status

## Migration from Toast Notifications

**Before:**
```typescript
toast.success("Sending 5 invoices...");
// ... do work ...
toast.success("Invoices sent successfully");
```

**After:**
```typescript
const operationId = startOperation({
  type: "bulk_send_invoices",
  title: "Sending 5 invoices",
  total: 5,
});

// Progress updates automatically shown in header
updateOperation(operationId, { current: 3, progress: 60 });

// Completion automatically shown
completeOperation(operationId, true);
```

## Benefits

✅ **Better UX**
- Persistent indicator (doesn't disappear)
- Real-time progress tracking
- Click for details on demand
- Non-intrusive (collapses when idle)

✅ **Offline Support**
- Queue operations automatically
- Auto-sync when online
- Never lose user actions
- Visual feedback for queued items

✅ **Multiple Operations**
- Track multiple operations simultaneously
- See all active syncs at once
- Operation history
- No notification spam

✅ **Developer Experience**
- Simple API
- Reusable hooks
- Type-safe
- Easy integration

## Testing

### Test Scenarios

1. **Online Bulk Send**
   - Select 5 invoices
   - Click send
   - ✓ Header shows syncing indicator
   - ✓ Click indicator opens panel
   - ✓ Progress bar updates in real-time
   - ✓ Completes and auto-removes after 10s

2. **Offline Queue**
   - Go offline (Dev Tools → Network → Offline)
   - Try to send invoices
   - ✓ Shows "Offline" badge
   - ✓ Operations queued
   - ✓ Go online
   - ✓ Auto-syncs queued operations

3. **Multiple Operations**
   - Send invoices (slow)
   - Upload files (while sending)
   - ✓ Both show in panel
   - ✓ Badge shows total count
   - ✓ Individual progress for each

4. **Error Handling**
   - Force an error (disconnect mid-send)
   - ✓ Shows error in panel
   - ✓ Red X icon
   - ✓ Error message displayed
   - ✓ Operation stays in history

## Future Enhancements

- [ ] Retry failed operations from panel
- [ ] Pause/resume operations
- [ ] Priority queue
- [ ] Background sync (Service Worker)
- [ ] Sync conflict resolution
- [ ] Export sync history
- [ ] Sync analytics (time, size, failures)
- [ ] Batch similar operations
- [ ] Smart retry with backoff

---

**Implementation Date**: 2024-11-13
**Status**: ✅ Complete and Ready to Use
**Replaces**: Toast notifications for sync operations

