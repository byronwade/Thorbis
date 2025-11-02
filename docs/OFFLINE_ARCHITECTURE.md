# Offline Architecture - Supabase + Vercel

## Overview
Field workers need to create jobs, invoices, and update work orders even with spotty internet. This document outlines our offline-first architecture.

## Stack-Specific Considerations

### Supabase
- PostgreSQL database with RLS
- REST API endpoints for CRUD operations
- Realtime subscriptions (won't work offline - needs fallback)
- Authentication with JWT tokens
- API URL: `https://<project>.supabase.co/rest/v1/`

### Vercel
- Static deployment with edge functions
- Service worker needs proper configuration in `next.config.js`
- Works with Next.js App Router
- Automatic HTTPS

### Next.js 16
- App Router (Server Components + Client Components)
- Server Actions for mutations
- Dynamic routes with async params

## Architecture Components

### 1. Service Worker (Workbox)
**File**: `public/sw.js`
**Purpose**: Cache Supabase API responses, static assets, and app shell

**Caching Strategy**:
- **App Shell**: Cache-first (HTML, CSS, JS bundles)
- **Supabase REST API**: Network-first with cache fallback
- **Supabase Auth**: Network-only (critical for security)
- **Static Assets**: Cache-first with stale-while-revalidate
- **Images**: Cache-first with 30-day expiration

```js
// Example Workbox config
workbox.routing.registerRoute(
  ({url}) => url.origin === 'https://<project>.supabase.co' && url.pathname.startsWith('/rest/v1/'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'supabase-api-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60, // 1 hour
      }),
    ],
  })
);
```

### 2. IndexedDB Storage
**File**: `src/lib/offline/indexed-db.ts`
**Purpose**: Local storage for critical business data

**Schema**:
```typescript
// Database: stratos-offline
// Version: 1

// Store: jobs
interface OfflineJob {
  id: string;
  customer_id: string;
  status: string;
  scheduled_date: string;
  notes: string;
  created_at: number;
  updated_at: number;
  synced: boolean;
}

// Store: invoices
interface OfflineInvoice {
  id: string;
  customer_id: string;
  amount: number;
  status: string;
  line_items: LineItem[];
  created_at: number;
  synced: boolean;
}

// Store: sync-queue
interface SyncOperation {
  id: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  data: any;
  timestamp: number;
  retry_count: number;
  error?: string;
}

// Store: customers (read-only cache)
interface OfflineCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cached_at: number;
}
```

### 3. Sync Queue
**File**: `src/lib/offline/sync-queue.ts`
**Purpose**: Queue offline operations and sync to Supabase when online

**Flow**:
1. User performs action offline (create job, update invoice)
2. Operation added to IndexedDB sync-queue
3. Background sync registers task
4. When online, process queue operations sequentially
5. Update local records with server IDs
6. Handle conflicts (last-write-wins for now, can add resolution UI later)

**Conflict Resolution**:
- **Strategy**: Last-write-wins (simple, works for most cases)
- **Future**: Add conflict resolution UI for critical data
- **Version tracking**: Use `updated_at` timestamp

### 4. Supabase Integration Layer
**File**: `src/lib/offline/supabase-offline.ts`
**Purpose**: Wrapper around Supabase client that handles offline scenarios

```typescript
export class OfflineSupabaseClient {
  // Check if online before making request
  // If offline, queue operation and return optimistic response
  // If online, make request and cache response

  async insert(table: string, data: any) {
    if (navigator.onLine) {
      // Normal Supabase insert
      const result = await supabase.from(table).insert(data);
      await cacheInIndexedDB(table, result.data);
      return result;
    } else {
      // Queue for sync
      const tempId = generateTempId();
      await addToSyncQueue('INSERT', table, {...data, id: tempId});
      await addToIndexedDB(table, {...data, id: tempId, synced: false});
      return { data: {...data, id: tempId}, error: null };
    }
  }

  async update(table: string, id: string, data: any) {
    if (navigator.onLine) {
      const result = await supabase.from(table).update(data).eq('id', id);
      await updateInIndexedDB(table, id, result.data);
      return result;
    } else {
      await addToSyncQueue('UPDATE', table, {id, ...data});
      await updateInIndexedDB(table, id, {...data, synced: false});
      return { data: {...data, id}, error: null };
    }
  }

  async select(table: string, query: any) {
    if (navigator.onLine) {
      const result = await supabase.from(table).select(query);
      await cacheInIndexedDB(table, result.data);
      return result;
    } else {
      // Return from IndexedDB cache
      const cached = await getFromIndexedDB(table, query);
      return { data: cached, error: null, fromCache: true };
    }
  }
}
```

### 5. Network Status Detection
**File**: `src/lib/offline/network-status.ts`
**Purpose**: Monitor online/offline state and trigger sync

```typescript
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      // Trigger sync queue processing
      await processSyncQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

### 6. UI Components
**Files**:
- `src/components/offline/offline-indicator.tsx` - Shows offline status
- `src/components/offline/sync-status.tsx` - Shows pending sync operations

```typescript
// Offline Indicator (shows in AppToolbar)
export function OfflineIndicator() {
  const isOnline = useNetworkStatus();
  const pendingOps = useSyncQueueCount();

  if (isOnline && pendingOps === 0) return null;

  return (
    <div className="flex items-center gap-2 rounded-md bg-yellow-500/10 px-3 py-1 text-yellow-700 text-sm dark:text-yellow-400">
      {!isOnline && (
        <>
          <WifiOff className="size-4" />
          <span className="hidden sm:inline">Offline Mode</span>
        </>
      )}
      {pendingOps > 0 && (
        <>
          <RefreshCw className="size-4 animate-spin" />
          <span className="hidden sm:inline">{pendingOps} pending</span>
        </>
      )}
    </div>
  );
}
```

## Implementation Plan

### Phase 1: Foundation (1-2 hours)
- [ ] Configure Workbox in `next.config.js`
- [ ] Create service worker registration
- [ ] Set up IndexedDB wrapper
- [ ] Create network status hook

### Phase 2: Offline Data Layer (2-3 hours)
- [ ] Implement OfflineSupabaseClient wrapper
- [ ] Create sync queue system
- [ ] Add IndexedDB caching for critical tables
- [ ] Test offline CRUD operations

### Phase 3: UI Integration (1-2 hours)
- [ ] Add OfflineIndicator to AppToolbar
- [ ] Add SyncStatus component
- [ ] Update forms to use OfflineSupabaseClient
- [ ] Add optimistic UI updates

### Phase 4: Testing & Refinement (2-3 hours)
- [ ] Test offline job creation
- [ ] Test offline invoice updates
- [ ] Test sync queue processing
- [ ] Test conflict scenarios
- [ ] Test on mobile devices with airplane mode

## Critical Tables to Cache
1. **jobs** - Most frequently accessed in field
2. **customers** - Needed for job creation
3. **invoices** - Created in field
4. **estimates** - Created in field
5. **pricebook** - Reference data for pricing

## Security Considerations
1. **Auth Tokens**: Store in memory, not IndexedDB (security)
2. **Sensitive Data**: Encrypt before storing in IndexedDB
3. **Row Level Security**: Respect RLS even in offline mode
4. **Data Expiration**: Clear old cached data after 7 days

## Performance Targets
- [ ] Service worker activation: < 2s
- [ ] IndexedDB read: < 50ms
- [ ] Sync queue processing: < 100ms per operation
- [ ] Cache size limit: 50MB max

## Monitoring
- Track offline usage with analytics
- Monitor sync queue size
- Alert if sync queue > 100 operations
- Track sync success/failure rates

## Future Enhancements
1. **Conflict Resolution UI**: Show user when conflicts detected
2. **Selective Sync**: Let user choose what to cache
3. **Background Sync API**: Use for reliable syncing
4. **Periodic Background Sync**: Refresh cache periodically
5. **Push Notifications**: Notify when sync completes
