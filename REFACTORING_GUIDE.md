# State Management Refactoring Guide

## 🎯 Overview

This guide documents the migration from `useState` + `useEffect` data fetching pattern to React Query for all client components that fetch data.

**Date:** 2025-11-16
**Status:** In Progress
**Completed:** 1 / ~20 components

---

## ✅ Completed Refactorings

### 1. Customer Notes Table ✅
**File:** `/src/components/customers/customer-notes-table.tsx`
**Changes:**
- ❌ Removed: `useState` for notes data
- ❌ Removed: `useEffect` for data fetching
- ✅ Added: `useQuery` for fetching notes
- ✅ Added: `useMutation` for create/delete operations
- ✅ Added: Optimistic updates for instant UI feedback
- ✅ Added: Loading skeletons
- ✅ Added: Error boundaries

**Benefits:**
- Automatic caching (5-minute fresh data)
- Background refetching on window focus
- Optimistic UI updates
- Better error handling
- Reduced code complexity (~30 lines removed)

---

## 📋 Components Pending Refactoring

### High Priority (Interactive Tables with Mutations)

1. **customer-contacts-table.tsx**
   - Similar pattern to notes table
   - Has add/delete operations
   - Good candidate for optimistic updates

2. **customer-badges.tsx**
   - Fetches badge data
   - May have mutations

3. **appointments-table.tsx**
   - Large dataset, needs caching
   - Interactive scheduling features

4. **payments-table.tsx**
   - Financial data requires careful handling
   - Has filtering and pagination

5. **jobs-kanban.tsx**
   - Drag-and-drop needs optimistic updates
   - Multiple data sources

6. **contracts/contract-page-content.tsx**
   - Complex data fetching
   - Multiple related entities

### Medium Priority (Data Display Components)

7. **dispatch-timeline.tsx**
8. **kanban-view.tsx**
9. **monthly-view.tsx**
10. **appointments-kanban.tsx**
11. **payments-kanban.tsx**
12. **add-property-dialog.tsx**
13. **team-member-selector.tsx**

### Low Priority (Simple Data Fetching)

14. **communication-page-client.tsx**
15. **incoming-call-notification.tsx**

---

## 🔧 Refactoring Template

Use this template for all React Query refactorings:

### Before (Anti-Pattern)
```typescript
"use client"
import { useEffect, useState } from "react";

export function MyComponent({ id }: { id: string }) {
  const [data, setData] = useState<MyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const result = await getData(id);
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{data.map(...)}</div>;
}
```

### After (React Query Pattern)
```typescript
"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function MyComponent({ id }: { id: string }) {
  const queryClient = useQueryClient();

  // Fetch data with React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-data', id],
    queryFn: async () => {
      const result = await getData(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch data");
      }
      return result.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  // Mutation example (if needed)
  const createMutation = useMutation({
    mutationFn: async (newItem: MyData) => {
      const result = await createData(id, newItem);
      if (!result.success) {
        throw new Error(result.error || "Failed to create");
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['my-data', id] });
    },
  });

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="font-semibold text-destructive">Failed to load data</p>
        <p className="text-muted-foreground text-sm">{error.message}</p>
      </div>
    );
  }

  return <div>{data?.map(...)}</div>;
}
```

---

## 📝 Checklist for Each Refactoring

```
Component: ____________________________
File: ____________________________

□ Read existing component implementation
□ Identify all useState for data
□ Identify all useEffect for fetching
□ Identify all mutations (create, update, delete)
□ Replace useState + useEffect with useQuery
□ Replace mutation handlers with useMutation
□ Add queryClient.invalidateQueries() after mutations
□ Implement optimistic updates if applicable
□ Add loading skeleton component
□ Add error boundary component
□ Remove manual loading/error state management
□ Test component functionality
□ Verify caching works correctly
□ Verify refetching on focus works
□ Verify mutations invalidate cache
□ Update component documentation
```

---

## 🎯 Decision Matrix

| Component Type | Strategy |
|---------------|----------|
| **Read-only data display** | `useQuery` only |
| **Form with mutations** | `useQuery` + `useMutation` |
| **Drag-and-drop / Interactive** | `useMutation` with optimistic updates |
| **Real-time updates needed** | Consider Zustand store instead |
| **Shared across many components** | Zustand store + React Query for fetching |

---

## 🚀 Performance Expectations

**Before React Query:**
- Manual cache management
- Unnecessary refetches
- Duplicate loading states
- No background updates
- ~100-150 lines per component

**After React Query:**
- Automatic caching (5-min stale time)
- Smart refetching (on focus, mount)
- Shared loading states
- Background updates
- ~70-100 lines per component

**Bundle size impact:**
- React Query library: ~13KB gzipped
- Savings from removed code: ~2-3KB per component
- Net impact: Negligible (one-time 13KB for 20+ components)

---

## 🐛 Common Pitfalls to Avoid

1. **Don't use React Query for local UI state**
   ```typescript
   // ❌ WRONG
   const { data: isOpen } = useQuery({ queryKey: ['modal-open'] });

   // ✅ CORRECT
   const [isOpen, setIsOpen] = useState(false);
   ```

2. **Don't forget query dependencies in queryKey**
   ```typescript
   // ❌ WRONG - Missing dependency
   useQuery({
     queryKey: ['notes'],
     queryFn: () => getNotes(customerId) // customerId not in key!
   });

   // ✅ CORRECT - Include all dependencies
   useQuery({
     queryKey: ['notes', customerId],
     queryFn: () => getNotes(customerId)
   });
   ```

3. **Don't mix useState and React Query for same data**
   ```typescript
   // ❌ WRONG - Mixing patterns
   const [notes, setNotes] = useState([]);
   const { data } = useQuery({ queryKey: ['notes'] });

   // ✅ CORRECT - Choose one
   const { data: notes } = useQuery({ queryKey: ['notes'] });
   ```

4. **Don't forget to invalidate queries after mutations**
   ```typescript
   // ❌ WRONG - No invalidation
   const mutation = useMutation({
     mutationFn: createNote,
     // Missing onSuccess!
   });

   // ✅ CORRECT - Invalidate cache
   const mutation = useMutation({
     mutationFn: createNote,
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['notes'] });
     }
   });
   ```

---

## 📚 Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Optimistic Updates Guide](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- [Mutations Guide](https://tanstack.com/query/latest/docs/react/guides/mutations)
- [Caching Guide](https://tanstack.com/query/latest/docs/react/guides/caching)

---

## 🔄 Next Steps

1. **Prioritize high-traffic components** (customer-contacts-table, appointments-table)
2. **Refactor one component at a time** to ensure stability
3. **Test thoroughly** after each refactoring
4. **Document any edge cases** encountered during migration
5. **Update this guide** with learnings and patterns

---

## ✅ Definition of Done

A component is considered "refactored" when:

- [ ] No `useState` for data (only UI state)
- [ ] No `useEffect` for data fetching
- [ ] Uses `useQuery` for all data fetching
- [ ] Uses `useMutation` for all data mutations
- [ ] Has loading skeleton component
- [ ] Has error boundary component
- [ ] Implements cache invalidation
- [ ] Has optimistic updates (if applicable)
- [ ] Component documentation updated
- [ ] Manually tested and verified working
- [ ] Added to "Completed Refactorings" section above

---

**Last Updated:** 2025-11-16
**Next Review:** After completing 5 components
