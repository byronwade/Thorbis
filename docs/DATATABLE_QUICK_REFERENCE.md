# DataTable Quick Reference

**One-page cheat sheet for choosing and implementing the right data table**

---

## 🎯 Decision Tree (30 seconds)

```
How many rows?
├─ < 5,000 rows
│  └─ Use: OptimizedDataTable ✅
│     • Simple, fast
│     • Instant search/filter
│     • Client-side pagination
│
├─ 5,000 - 50,000 rows
│  └─ Use: VirtualizedDataTable ✅
│     • Smooth 60fps scrolling
│     • Low memory usage
│     • Handles up to 50K rows
│
└─ > 50,000 rows
   └─ Use: ServerDataTable ✅
      • Unlimited scalability
      • Fast database queries
      • Always fresh data
```

---

## 📋 Copy-Paste Templates

### Template 1: Optimized (1K-5K rows)

```tsx
import { OptimizedDataTable, type ColumnDef } from "@/components/ui/optimized-datatable";

type Item = { id: string; name: string; status: string };

const columns: ColumnDef<Item>[] = [
  {
    key: "name",
    header: "Name",
    render: (item) => <span>{item.name}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (item) => <Badge>{item.status}</Badge>,
  },
];

<OptimizedDataTable
  data={items}
  columns={columns}
  getItemId={(item) => item.id}
  searchFilter={(item, q) => item.name.toLowerCase().includes(q)}
  itemsPerPage={50}
/>
```

### Template 2: Virtualized (5K-50K rows)

```tsx
import { VirtualizedDataTable, type ColumnDef } from "@/components/ui/virtualized-datatable";

type Item = { id: string; name: string; status: string };

const columns: ColumnDef<Item>[] = [
  {
    key: "name",
    header: "Name",
    render: (item) => <span>{item.name}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (item) => <Badge>{item.status}</Badge>,
  },
];

<VirtualizedDataTable
  data={items}
  columns={columns}
  getItemId={(item) => item.id}
  searchFilter={(item, q) => item.name.toLowerCase().includes(q)}
  rowHeight={50}
  overscan={5}
/>
```

### Template 3: Server-Side (50K+ rows)

**Step 1:** Create fetch function (server)

```tsx
// lib/data/items.ts
import { createClient } from "@/lib/supabase/server";
import { buildPaginatedQuery } from "@/lib/supabase/pagination-utils";
import type { PaginationParams } from "@/lib/hooks/use-server-pagination";

export async function fetchItems(params: PaginationParams) {
  const supabase = await createClient();
  const query = supabase.from("items").select("*", { count: "exact" });
  
  return buildPaginatedQuery(query, params, ["name", "description"]);
}
```

**Step 2:** Use in component (client)

```tsx
"use client";
import { ServerDataTable, type ServerColumnDef } from "@/components/ui/server-datatable";
import { useServerPagination } from "@/lib/hooks/use-server-pagination";
import { fetchItems } from "@/lib/data/items";

type Item = { id: string; name: string; status: string };

export function ItemsTable() {
  const pagination = useServerPagination({
    fetchFn: fetchItems,
    pageSize: 50,
  });

  const columns: ServerColumnDef<Item>[] = [
    {
      key: "name",
      header: "Name",
      render: (item) => <span>{item.name}</span>,
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <Badge>{item.status}</Badge>,
      sortable: true,
    },
  ];

  return (
    <ServerDataTable
      pagination={pagination}
      columns={columns}
      getItemId={(item) => item.id}
      showPageSizeSelector
    />
  );
}
```

---

## ⚡ Performance at a Glance

| Rows | Strategy | Initial Load | Memory | Best Feature |
|------|----------|--------------|--------|--------------|
| **1,000** | Optimized | 200ms | 2MB | Instant search |
| **10,000** | Virtualized | 50ms | 5MB | Smooth scrolling |
| **100,000** | Server-Side | 400ms | 0.5MB | Unlimited scale |

---

## 🔧 Common Modifications

### Add Bulk Actions

```tsx
const bulkActions = [
  {
    label: "Delete",
    icon: <Trash className="size-4" />,
    onClick: async (ids: Set<string>) => {
      await deleteItems(Array.from(ids));
    },
    variant: "destructive" as const,
  },
];

<DataTable bulkActions={bulkActions} ... />
```

### Add Row Click Handler

```tsx
<DataTable
  onRowClick={(item) => {
    router.push(`/items/${item.id}`);
  }}
  ...
/>
```

### Add Filters (Server-Side Only)

```tsx
const pagination = useServerPagination({ ... });

// In JSX:
<Button
  onClick={() => pagination.filters.setFilter("status", "active")}
>
  Active Only
</Button>

<Button onClick={pagination.filters.clearAllFilters}>
  Clear
</Button>

<ServerDataTable pagination={pagination} ... />
```

### Add Row Highlighting

```tsx
<DataTable
  isHighlighted={(item) => item.priority === "high"}
  getHighlightClass={() => "bg-red-50 dark:bg-red-950"}
  ...
/>
```

### Custom Empty State

```tsx
<DataTable
  emptyMessage="No items found"
  emptyIcon={<Package className="size-12 text-muted-foreground" />}
  emptyAction={
    <Button onClick={handleCreate}>
      <Plus className="mr-2 size-4" />
      Create Item
    </Button>
  }
  ...
/>
```

---

## 🐛 Troubleshooting

### Table is Slow

**Problem:** Table takes > 1 second to load

**Solutions:**
1. Check dataset size - if > 5K rows, use Virtualized or Server-Side
2. Memoize columns with `useMemo`
3. Check for unnecessary re-renders in parent
4. Use React DevTools Profiler

### Virtual Scrolling Jumpy

**Problem:** Rows jump around while scrolling

**Solutions:**
1. Set accurate `rowHeight` (measure your actual row height)
2. Use fixed heights (avoid dynamic content)
3. Increase `overscan` (default: 5)

### Server Pagination Slow

**Problem:** Page changes take > 1 second

**Solutions:**
1. Add database indexes to sorted/filtered columns
2. Use `select` to fetch only needed columns
3. Check network latency
4. Use `estimated` count for very large tables

### Search Not Working

**Problem:** Search returns no results

**Solutions:**
1. Check `searchFilter` function is correct
2. For server-side, ensure `searchColumns` is set
3. Verify case-insensitive matching (use `.toLowerCase()`)
4. Check database column names match

---

## 📚 Full Documentation

See `docs/LARGE_DATASET_OPTIMIZATION.md` for:
- Detailed performance benchmarks
- Migration guides
- Database optimization
- Advanced patterns
- API reference
- FAQ

---

## 🎓 Examples

Visit `/dashboard/examples/large-data-tables` to see:
1. Optimized table with 5,000 rows
2. Virtualized table with 25,000 rows
3. Server-side table with 100,000 rows

**Interactive demos with:**
- Performance metrics
- Memory usage graphs
- FPS counters
- Live code examples

---

**Need help?** Check the main docs or examples!

