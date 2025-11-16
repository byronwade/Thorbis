# Customer Stats & Tags Update

## Overview
Moved customer stats above the collapsibles (below CSR reminders) and added customer tags section for a cleaner, more accessible layout.

---

## Changes Made

### 1. **Removed Stats from Customer Overview** ✅

Customer stats are no longer embedded within the Customer Overview collapsible section. This makes the overview form cleaner and focused on editable customer data.

---

### 2. **New Stats & Tags Section** ✅

Created a new dedicated section above the collapsibles with:
- **Customer Tags** (top)
- **Customer Stats** (bottom)

#### Visual Layout:

```
┌─────────────────────────────────────────────────────┐
│ 💡 Call Reminders                                   │
│ • Greet customer warmly...                          │
│ • Verify customer info...                           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ CUSTOMER TAGS                              [+ Add]  │
│ [VIP] [Recurring] [+ Add Tag]                       │
│                                                     │
│ CUSTOMER STATS                                      │
│ ┌────────┬────────┬────────┬────────┐              │
│ │REVENUE │ ACTIVE │INVOICES│ SINCE  │              │
│ │ $0.00  │   3    │   0    │  2025  │              │
│ └────────┴────────┴────────┴────────┘              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ▶ Customer Overview                                 │
│ ▶ Jobs (3)                                          │
│ ▶ Invoices (2)                                      │
│ ▶ Appointments (1)                                  │
│ ▶ Properties (1)                                    │
│ ▶ Equipment (4)                                     │
│ ▶ Notes (0)                                         │
└─────────────────────────────────────────────────────┘
```

---

## Customer Tags Section

### Features:
- **Header** with "Add" button
- **Tag badges** with secondary variant
- **Add Tag button** as a badge (clickable)
- **Flexible layout** - wraps tags to multiple lines if needed

### Design:
```tsx
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
      Customer Tags
    </h4>
    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
      <Plus className="mr-1 h-3 w-3" />
      Add
    </Button>
  </div>
  <div className="flex flex-wrap gap-1.5">
    <Badge variant="secondary" className="text-xs">VIP</Badge>
    <Badge variant="secondary" className="text-xs">Recurring</Badge>
    <Badge variant="outline" className="cursor-pointer text-xs hover:bg-muted">
      <Plus className="mr-1 h-3 w-3" />
      Add Tag
    </Badge>
  </div>
</div>
```

### Tag Examples:
- VIP
- Recurring
- High Priority
- Commercial
- Residential
- Emergency Contact
- Payment Plan
- Warranty Customer

---

## Customer Stats Section

### Features:
- **4-column grid** layout
- **Minimalistic design** with small text
- **Centered content** for easy scanning
- **Important data** at a glance

### Stats Displayed:

#### 1. **Total Revenue**
- Label: "REVENUE"
- Value: `$0.00` (formatted currency)
- Shows total amount spent by customer

#### 2. **Active Jobs**
- Label: "ACTIVE"
- Value: `3` (number)
- Shows number of jobs currently in progress

#### 3. **Open Invoices**
- Label: "INVOICES"
- Value: `0` (number)
- Shows number of unpaid invoices

#### 4. **Customer Since**
- Label: "SINCE"
- Value: `2025` (year)
- Shows year customer was created

### Design:
```tsx
<div className="space-y-2">
  <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
    Customer Stats
  </h4>
  <div className="grid grid-cols-4 gap-2">
    <div className="rounded-lg border bg-muted/20 p-2.5 text-center">
      <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Revenue</p>
      <p className="mt-0.5 font-bold text-foreground text-sm">$0.00</p>
    </div>
    {/* ... other stats ... */}
  </div>
</div>
```

---

## Styling Details

### Minimalistic Approach:
- **Small headers**: `text-xs uppercase tracking-wide`
- **Compact padding**: `p-2.5` for stat cards
- **Tiny labels**: `text-[10px]` for stat labels
- **Bold values**: `font-bold text-sm` for stat values
- **Subtle backgrounds**: `bg-muted/20` for stat cards
- **Clean borders**: `border border-border/60`

### Color Scheme:
- **Headers**: `text-muted-foreground` (subtle)
- **Values**: `text-foreground` (prominent)
- **Backgrounds**: `bg-muted/20` (very subtle)
- **Borders**: `border-border/60` (light)

---

## Benefits

### 1. **Better Visibility** ✅
- Stats are always visible (not hidden in collapsible)
- CSR can see key metrics at a glance
- No need to expand Customer Overview

### 2. **Cleaner Organization** ✅
- Customer Overview is now focused on editable data
- Stats are separate from form fields
- Tags are easily accessible

### 3. **Minimalistic Design** ✅
- Small text sizes (text-xs, text-[10px])
- Compact layout (4 columns)
- Subtle colors and backgrounds
- Doesn't dominate the screen

### 4. **Important Data First** ✅
- Revenue, active jobs, invoices, and customer tenure
- Helps CSR understand customer value
- Quick context for the call

### 5. **Tag Management** ✅
- Easy to add/remove tags
- Visual categorization
- Quick customer identification
- Similar to job details page

---

## Layout Order (Top to Bottom)

1. **CSR Reminders** (primary/5 background)
   - Lightbulb icon
   - 4 default reminders

2. **Customer Stats & Tags** (card background)
   - Customer Tags (with Add button)
   - Customer Stats (4-column grid)

3. **Collapsible Sections** (accordion)
   - Customer Overview (closed by default)
   - Jobs
   - Invoices
   - Appointments
   - Properties
   - Equipment
   - Notes

---

## Future Enhancements

### 1. **Real Tags from Database**

```tsx
// Fetch tags from customer data
const tags = customer?.tags || [];

// Render tags
{tags.map((tag) => (
  <Badge key={tag.id} variant="secondary" className="text-xs">
    {tag.name}
  </Badge>
))}
```

### 2. **Tag Management Modal**

```tsx
<TagManagementModal
  customerId={customer.id}
  existingTags={tags}
  onAddTag={handleAddTag}
  onRemoveTag={handleRemoveTag}
/>
```

### 3. **Tag Colors**

```tsx
// Different colors for different tag types
<Badge 
  variant="secondary" 
  className={cn(
    "text-xs",
    tag.type === "priority" && "bg-red-100 text-red-700",
    tag.type === "status" && "bg-blue-100 text-blue-700",
    tag.type === "category" && "bg-green-100 text-green-700"
  )}
>
  {tag.name}
</Badge>
```

### 4. **Stat Tooltips**

```tsx
<Tooltip>
  <TooltipTrigger>
    <div className="rounded-lg border bg-muted/20 p-2.5 text-center">
      <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Revenue</p>
      <p className="mt-0.5 font-bold text-foreground text-sm">$12,450.00</p>
    </div>
  </TooltipTrigger>
  <TooltipContent>
    <p>Total revenue from this customer</p>
    <p className="text-xs text-muted-foreground">Last updated: Jan 15, 2025</p>
  </TooltipContent>
</Tooltip>
```

### 5. **Interactive Stats**

```tsx
// Click on stat to see details
<div 
  className="rounded-lg border bg-muted/20 p-2.5 text-center cursor-pointer hover:bg-muted/30"
  onClick={() => openJobsList()}
>
  <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Active</p>
  <p className="mt-0.5 font-bold text-foreground text-sm">3</p>
</div>
```

---

## Database Schema for Tags

```sql
-- Customer tags table
CREATE TABLE customer_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  type TEXT, -- priority, status, category, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  UNIQUE(customer_id, name)
);

-- Index for fast lookups
CREATE INDEX idx_customer_tags_customer_id ON customer_tags(customer_id);
CREATE INDEX idx_customer_tags_name ON customer_tags(name);
```

---

## Server Action for Tags

```tsx
// src/actions/customer-tags.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCustomerTags(customerId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("customer_tags")
    .select("*")
    .eq("customer_id", customerId)
    .order("name");

  if (error) throw error;
  return data;
}

export async function addCustomerTag(customerId: string, tagName: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("customer_tags")
    .insert({
      customer_id: customerId,
      name: tagName,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeCustomerTag(tagId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("customer_tags")
    .delete()
    .eq("id", tagId);

  if (error) throw error;
}
```

---

## Status

✅ **Customer stats removed from overview**  
✅ **New stats & tags section created**  
✅ **Positioned above collapsibles**  
✅ **Minimalistic design (small text, compact)**  
✅ **4-column grid for stats**  
✅ **Tag management UI**  
✅ **Add tag button**  
✅ **No linter errors**  

Customer Stats & Tags are now prominently displayed! 🎉

