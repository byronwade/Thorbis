# Nested Data Visualization Pattern

**Solution for showing deeply nested relationships in a clean, editable way**

## Problem

Jobs have deeply nested associations:
- **Appointments** → team members, equipment, notes, time tracking
- **Invoices** → line items, payments, documents
- **Estimates** → options, line items, approvals
- **Equipment** → service history, parts, warranties

Traditional datatables hide this depth. Users can't see associations without clicking through multiple pages.

## Solution: Expandable Rows

Instead of hiding nested data, we use **expandable rows** that reveal associations on demand.

### Visual Design

```
┌─────────────────────────────────────────────────────┐
│ ▶ Dec 15, 2024  |  HVAC Repair  |  John Smith  |  ✓ │  ← Collapsed (summary)
└─────────────────────────────────────────────────────┘

Click to expand ↓

┌─────────────────────────────────────────────────────┐
│ ▼ Dec 15, 2024  |  HVAC Repair  |  John Smith  |  ✓ │  ← Expanded (summary)
├─────────────────────────────────────────────────────┤
│   Team Members (2)                                   │
│   ┌───────────────────────────────────────┐         │
│   │ 👤 John Smith - Lead Technician       │         │
│   │ 👤 Sarah Jones - Assistant            │         │
│   └───────────────────────────────────────┘         │
│                                                      │
│   Equipment (3)                                      │
│   ┌───────────────────────────────────────┐         │
│   │ 🔧 HVAC Unit #AC-2024 - Compressor    │         │
│   │ 🔧 Thermostat #TH-5678 - Control      │         │
│   │ 🔧 Filter #F-9012 - Air Filter        │         │
│   └───────────────────────────────────────┘         │
│                                                      │
│   Time Tracking                                      │
│   Actual Start: 9:00 AM | Actual End: 12:30 PM     │
│   Duration: 3.5 hours                               │
│                                                      │
│   Notes & Instructions                               │
│   Gate code: 1234 | Check furnace filter           │
└─────────────────────────────────────────────────────┘
```

## Implementation

### 1. Core Components

**`src/components/ui/expandable-row.tsx`**
- Reusable expandable row component
- Smooth animations
- Chevron indicator
- Controlled/uncontrolled state

**`src/components/ui/expandable-row-section.tsx`**
- Organizes nested data into sections
- Icons and titles
- Clean borders

### 2. Domain-Specific Components

**`src/components/work/job-details/appointment-expandable-row.tsx`**
- Appointment-specific layout
- Shows: team members, equipment, time tracking, notes
- Status badges, avatars
- Formatted dates/times

**`src/components/work/job-details/job-appointments-expandable.tsx`**
- List container for appointments
- Search and filter
- Handles empty states

### 3. Data Fetching

Update your queries to include nested data:

```typescript
// Before (flat data)
supabase
  .from("appointments")
  .select("*")
  .eq("job_id", jobId)

// After (nested data)
supabase
  .from("appointments")
  .select(`
    *,
    assigned_user:assigned_to (
      id,
      raw_user_meta_data
    ),
    team_members:appointment_team_assignments (
      id,
      team_member:team_member_id (
        id,
        user_id,
        role,
        user:user_id (
          id,
          raw_user_meta_data
        )
      )
    ),
    equipment:appointment_equipment (
      id,
      equipment:equipment_id (
        id,
        name,
        serial_number,
        type
      )
    )
  `)
  .eq("job_id", jobId)
```

### 4. Integration

Replace datatable with expandable view:

```tsx
// Before
<JobAppointmentsTable appointments={schedules} />

// After
<JobAppointmentsExpandable appointments={schedules} />
```

## Benefits

✅ **All data visible** - No need to click through multiple pages
✅ **Clean design** - Collapsed by default, expand on demand
✅ **Fast scanning** - See counts at a glance (e.g., "2 team members", "3 equipment")
✅ **Easy editing** - Can add inline edit buttons within expanded sections
✅ **Searchable** - Search across all visible and nested data
✅ **Filterable** - Filter by status, date, team member, etc.
✅ **Performant** - Only renders visible rows, lazy loads details

## Usage Patterns

### Pattern 1: Simple Expansion (Most Common)

```tsx
<ExpandableRow
  summary={<div>Appointment #123</div>}
  details={<div>Team members, notes, etc.</div>}
/>
```

### Pattern 2: Organized Sections

```tsx
<ExpandableRow
  summary={<AppointmentSummary />}
  details={
    <>
      <ExpandableRowSection title="Team Members" icon={<Users />}>
        {teamMembers.map(member => <MemberCard />)}
      </ExpandableRowSection>

      <ExpandableRowSection title="Equipment" icon={<Wrench />}>
        {equipment.map(item => <EquipmentCard />)}
      </ExpandableRowSection>
    </>
  }
/>
```

### Pattern 3: Conditional Display

```tsx
<ExpandableRow
  summary={<AppointmentSummary />}
  details={
    hasNestedData ? (
      <NestedDetails />
    ) : (
      <EmptyState message="No additional details" />
    )
  }
  disabled={!hasNestedData}
  showIndicator={hasNestedData}
/>
```

## Creating Similar Patterns

### For Invoices (Line Items)

1. Create `invoice-expandable-row.tsx`
2. Show: line items, payments, documents
3. Add edit/delete actions in expanded view

### For Estimates (Options)

1. Create `estimate-expandable-row.tsx`
2. Show: estimate options, line items, approvals
3. Add approval actions in expanded view

### For Equipment (Service History)

1. Create `equipment-expandable-row.tsx`
2. Show: service history, parts replaced, warranties
3. Add service schedule actions

## Best Practices

1. **Keep summaries concise** - 1 line, key info only
2. **Group related data** - Use `ExpandableRowSection` for organization
3. **Show counts** - Badge indicators (e.g., "2 team members")
4. **Enable search** - Search across both summary and details
5. **Add empty states** - Show helpful messages when no nested data
6. **Disable when empty** - Don't allow expansion if no details
7. **Smooth animations** - Use `animate-in` classes
8. **Mobile responsive** - Stack sections vertically on mobile

## Performance

- **Virtualization**: Only render visible rows
- **Lazy loading**: Load nested data on expand (optional)
- **Pagination**: Limit initial results, load more on scroll
- **Search debouncing**: 300ms delay on search input
- **Memoization**: Use `useMemo` for filtered results

## Migration Checklist

When migrating a datatable to expandable rows:

- [ ] Identify nested relationships to display
- [ ] Update database query to fetch nested data
- [ ] Create expandable row component for entity
- [ ] Add search and filter functionality
- [ ] Handle empty states
- [ ] Test with large datasets (100+ rows)
- [ ] Verify mobile responsiveness
- [ ] Add loading states
- [ ] Document pattern for team

## Examples in Codebase

1. **Appointments** - `/src/components/work/job-details/job-appointments-expandable.tsx`
   - Shows: team members, equipment, time tracking, notes

2. **Coming Soon**:
   - Invoices with line items
   - Estimates with options
   - Equipment with service history

## Questions?

See existing implementation in:
- `src/components/ui/expandable-row.tsx`
- `src/components/work/job-details/appointment-expandable-row.tsx`
- `src/components/work/job-details/job-appointments-expandable.tsx`
