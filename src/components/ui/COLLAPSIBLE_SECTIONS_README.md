# Collapsible Data Sections - Unified Component System

## Overview

The `CollapsibleDataSection` component provides a standardized, feature-rich collapsible section for displaying data throughout the application. It ensures consistency across all collapsible sections with built-in support for loading states, empty states, error handling, and optimistic updates.

## Key Features

✅ **Consistent Structure** - All collapsible sections use the same layout  
✅ **Loading States** - Built-in skeleton loaders  
✅ **Empty States** - Configurable empty state with icon, message, and action button  
✅ **Error Handling** - Display error messages gracefully  
✅ **Optimistic Updates** - Immediate UI feedback during async operations  
✅ **Full-Width Tables** - Seamless integration with datatables  
✅ **Standalone & Accordion Modes** - Use with or without accordion  
✅ **State Persistence** - Save open/closed state to localStorage  
✅ **Consistent Buttons** - Standardized action button components

---

## Component API

### CollapsibleDataSection Props

```typescript
{
  // Required
  value: string;                    // Unique identifier for accordion
  title: string;                    // Section title
  
  // Content
  children: ReactNode;              // Section content
  
  // Display
  icon?: ReactNode;                 // Icon component (e.g., <Briefcase />)
  badge?: ReactNode;                // Custom badge
  count?: number;                   // Item count (shows as badge)
  summary?: string;                 // Summary text when collapsed
  actions?: ReactNode;              // Action buttons (header right side)
  
  // Layout
  fullWidthContent?: boolean;       // Remove padding for full-width tables
  className?: string;               // Additional CSS classes
  
  // States
  isLoading?: boolean;              // Show loading skeleton
  error?: string | null;            // Show error message
  emptyState?: {                    // Empty state configuration
    show: boolean;
    icon?: ReactNode;
    title?: string;
    description?: string;
    action?: ReactNode;
  };
  
  // Behavior
  defaultOpen?: boolean;            // Initial open state
  storageKey?: string;              // localStorage key for persistence
  standalone?: boolean;             // Use without Accordion wrapper
  isOpen?: boolean;                 // Controlled state
  onOpenChange?: (open: boolean) => void; // State change handler
}
```

### Helper Components

#### CollapsibleActionButton
Standardized button for section headers (add, export, etc.)

```typescript
<CollapsibleActionButton 
  onClick={() => handleAction()}
  icon={<Plus className="size-4" />}
  variant="secondary"              // default | secondary | outline | ghost
  disabled={false}
  isLoading={false}
>
  Add Item
</CollapsibleActionButton>
```

#### EmptyStateActionButton
Primary action button for empty states

```typescript
<EmptyStateActionButton 
  onClick={() => handleAdd()}
  icon={<Plus className="size-4" />}
>
  Add First Item
</EmptyStateActionButton>
```

---

## Usage Patterns

### Pattern 1: Basic Accordion Mode
Multiple sections on a page:

```tsx
import { Accordion } from "@/components/ui/accordion";
import { CollapsibleDataSection, CollapsibleActionButton } from "@/components/ui/collapsible-data-section";

<Accordion type="multiple" defaultValue={["jobs"]}>
  <CollapsibleDataSection
    value="jobs"
    title="Jobs"
    icon={<Briefcase className="size-5" />}
    count={5}
    actions={
      <CollapsibleActionButton onClick={handleAddJob} icon={<Plus />}>
        Add Job
      </CollapsibleActionButton>
    }
  >
    <JobsTable jobs={jobs} />
  </CollapsibleDataSection>
</Accordion>
```

### Pattern 2: Standalone Mode
Single section or custom control:

```tsx
<CollapsibleDataSection
  value="jobs"
  title="Jobs"
  icon={<Briefcase className="size-5" />}
  count={5}
  standalone={true}                    // Key: enables standalone mode
  storageKey="jobs-section"            // Persists state
  actions={
    <CollapsibleActionButton onClick={handleAddJob} icon={<Plus />}>
      Add Job
    </CollapsibleActionButton>
  }
>
  <JobsTable jobs={jobs} />
</CollapsibleDataSection>
```

### Pattern 3: With Loading State
Show skeleton while data loads:

```tsx
const [jobs, setJobs] = useState([]);
const [isLoading, setIsLoading] = useState(true);

<CollapsibleDataSection
  value="jobs"
  title="Jobs"
  isLoading={isLoading}               // Shows skeleton
  standalone={true}
  // ... other props
>
  <JobsTable jobs={jobs} />
</CollapsibleDataSection>
```

### Pattern 4: With Empty State
Show helpful empty state:

```tsx
<CollapsibleDataSection
  value="jobs"
  title="Jobs"
  count={0}
  standalone={true}
  fullWidthContent={true}
  emptyState={{
    show: jobs.length === 0,
    icon: <Briefcase className="h-8 w-8 text-muted-foreground" />,
    title: "No jobs found",
    description: "Get started by creating your first job.",
    action: (
      <EmptyStateActionButton onClick={handleAdd} icon={<Plus />}>
        Add Job
      </EmptyStateActionButton>
    ),
  }}
  actions={
    <CollapsibleActionButton onClick={handleAdd} icon={<Plus />}>
      Add Job
    </CollapsibleActionButton>
  }
>
  <JobsTable jobs={jobs} />
</CollapsibleDataSection>
```

### Pattern 5: With Error Handling
Display errors gracefully:

```tsx
const [error, setError] = useState<string | null>(null);

<CollapsibleDataSection
  value="jobs"
  title="Jobs"
  error={error}                       // Shows error message
  standalone={true}
  actions={
    <CollapsibleActionButton onClick={handleRetry} icon={<RefreshCw />}>
      Retry
    </CollapsibleActionButton>
  }
>
  <JobsTable jobs={jobs} />
</CollapsibleDataSection>
```

### Pattern 6: Optimistic Updates
Immediate feedback during async operations:

```tsx
const [jobs, setJobs] = useState([]);
const [isLoading, setIsLoading] = useState(false);

const handleAddJob = async () => {
  // Optimistic update
  const tempJob = { id: Date.now(), title: "New Job" };
  setJobs(prev => [...prev, tempJob]);
  setIsLoading(true);

  try {
    const result = await createJob();
    setJobs(prev => prev.map(j => j.id === tempJob.id ? result : j));
  } catch (error) {
    // Rollback on error
    setJobs(prev => prev.filter(j => j.id !== tempJob.id));
    toast.error("Failed to create job");
  } finally {
    setIsLoading(false);
  }
};

<CollapsibleDataSection
  value="jobs"
  title="Jobs"
  count={jobs.length}
  isLoading={isLoading}
  standalone={true}
  actions={
    <CollapsibleActionButton 
      onClick={handleAddJob}
      icon={<Plus />}
      disabled={isLoading}
      isLoading={isLoading}
    >
      Add Job
    </CollapsibleActionButton>
  }
>
  <JobsTable jobs={jobs} />
</CollapsibleDataSection>
```

### Pattern 7: Full-Width Datatables
For tables that need to extend to edges:

```tsx
<CollapsibleDataSection
  value="jobs"
  title="Jobs"
  count={10}
  standalone={true}
  fullWidthContent={true}             // Key: removes padding
  actions={
    <CollapsibleActionButton onClick={handleAdd} icon={<Plus />}>
      Add Job
    </CollapsibleActionButton>
  }
>
  {/* Table extends to edges */}
  <JobsTable jobs={jobs} />
</CollapsibleDataSection>
```

---

## Migration Guide

### From CollapsibleSectionWrapper (Editor Blocks)

**Before:**
```tsx
<CollapsibleSectionWrapper
  title="Jobs (5)"
  icon={<Briefcase className="size-5" />}
  defaultOpen={false}
  storageKey="customer-jobs-section"
  summary="5 active jobs"
  actions={
    <Button size="sm" variant="secondary" onClick={handleAdd}>
      <Plus className="size-4" />
      Add Job
    </Button>
  }
>
  <div className="-mx-6 -mt-6 -mb-6">
    <JobsTable jobs={jobs} />
  </div>
</CollapsibleSectionWrapper>
```

**After:**
```tsx
<CollapsibleDataSection
  value="customer-jobs"
  title="Jobs"
  icon={<Briefcase className="size-5" />}
  count={5}
  summary="5 active jobs"
  defaultOpen={false}
  storageKey="customer-jobs-section"
  standalone={true}
  fullWidthContent={true}
  emptyState={
    jobs.length === 0 ? {
      show: true,
      icon: <Briefcase className="h-8 w-8 text-muted-foreground" />,
      title: "No jobs found",
      description: "Get started by creating your first job.",
      action: (
        <EmptyStateActionButton onClick={handleAdd} icon={<Plus />}>
          Add Job
        </EmptyStateActionButton>
      ),
    } : undefined
  }
  actions={
    <CollapsibleActionButton onClick={handleAdd} icon={<Plus />}>
      Add Job
    </CollapsibleActionButton>
  }
>
  <JobsTable jobs={jobs} />
</CollapsibleDataSection>
```

### From CollapsibleSection (Job Details)

**Before:**
```tsx
<CollapsibleSection
  value="invoices"
  title="Invoices"
  icon={<FileText />}
  count={invoices.length}
  fullWidthContent={true}
  actions={
    <Button size="sm" variant="outline" onClick={handleCreate}>
      Create Invoice
    </Button>
  }
>
  <InvoicesTable invoices={invoices} />
</CollapsibleSection>
```

**After:**
```tsx
<CollapsibleDataSection
  value="invoices"
  title="Invoices"
  icon={<FileText />}
  count={invoices.length}
  fullWidthContent={true}
  actions={
    <CollapsibleActionButton onClick={handleCreate}>
      Create Invoice
    </CollapsibleActionButton>
  }
>
  <InvoicesTable invoices={invoices} />
</CollapsibleDataSection>
```

---

## Best Practices

### 1. Always Provide Empty States
```tsx
// ✅ Good
emptyState={{
  show: items.length === 0,
  icon: <Icon className="h-8 w-8 text-muted-foreground" />,
  title: "No items found",
  description: "Get started by creating your first item.",
  action: <EmptyStateActionButton onClick={handleAdd}>Add Item</EmptyStateActionButton>
}}

// ❌ Bad
// No empty state configured
```

### 2. Use Loading States During Fetch
```tsx
// ✅ Good
const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
  fetchData().finally(() => setIsLoading(false));
}, []);

// ❌ Bad
// No loading state, shows empty state during fetch
```

### 3. Handle Errors Gracefully
```tsx
// ✅ Good
const [error, setError] = useState<string | null>(null);
try {
  await fetchData();
} catch (err) {
  setError(err.message);
}

// ❌ Bad
// Errors not caught, UI breaks
```

### 4. Use Optimistic Updates for Better UX
```tsx
// ✅ Good
const handleAdd = async () => {
  setItems(prev => [...prev, tempItem]); // Immediate feedback
  try {
    await api.create(tempItem);
  } catch {
    setItems(prev => prev.filter(i => i !== tempItem)); // Rollback
  }
};

// ❌ Bad
const handleAdd = async () => {
  await api.create(item); // User waits
  setItems(prev => [...prev, item]);
};
```

### 5. Use fullWidthContent for Datatables
```tsx
// ✅ Good - Table extends to edges
<CollapsibleDataSection fullWidthContent={true}>
  <DataTable />
</CollapsibleDataSection>

// ❌ Bad - Table has extra padding
<CollapsibleDataSection>
  <DataTable />
</CollapsibleDataSection>
```

### 6. Persist Important States
```tsx
// ✅ Good - State persists across page reloads
<CollapsibleDataSection
  storageKey="jobs-section"
  standalone={true}
/>

// ❌ Bad - State resets on reload
<CollapsibleDataSection standalone={true} />
```

---

## Examples Reference

See `collapsible-data-section-examples.tsx` for comprehensive examples covering:
- Basic accordion mode
- Standalone mode
- Loading states
- Error states
- Empty states
- Full-width content
- Optimistic updates
- Controlled state
- Multiple actions
- Real-world complex example

---

## Component Architecture

```
CollapsibleDataSection
├── Header (Always visible)
│   ├── Trigger Button (Icon + Title + Count/Badge)
│   ├── Summary (When collapsed)
│   ├── Chevron (Expand/Collapse indicator)
│   └── Actions (Action buttons)
│
└── Content (Collapsible)
    ├── Loading State (Skeleton)
    ├── Error State (Error message)
    ├── Empty State (Icon + Message + Action)
    └── Children (Your content)
```

---

## Testing

```tsx
import { render, screen, userEvent } from "@testing-library/react";
import { CollapsibleDataSection } from "@/components/ui/collapsible-data-section";

test("shows loading state", () => {
  render(
    <CollapsibleDataSection value="test" title="Test" isLoading={true}>
      Content
    </CollapsibleDataSection>
  );
  expect(screen.getByRole("status")).toBeInTheDocument();
});

test("shows empty state when no data", () => {
  render(
    <CollapsibleDataSection
      value="test"
      title="Test"
      emptyState={{
        show: true,
        title: "No items",
        description: "Add your first item"
      }}
    >
      Content
    </CollapsibleDataSection>
  );
  expect(screen.getByText("No items")).toBeInTheDocument();
});

test("calls action on button click", async () => {
  const handleClick = jest.fn();
  render(
    <CollapsibleDataSection
      value="test"
      title="Test"
      actions={<CollapsibleActionButton onClick={handleClick}>Add</CollapsibleActionButton>}
    >
      Content
    </CollapsibleDataSection>
  );
  
  await userEvent.click(screen.getByText("Add"));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

---

## Support

For questions or issues with this component:
1. Check the examples file
2. Review this README
3. Check existing implementations in the codebase
4. Create an issue if you find a bug

