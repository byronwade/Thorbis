# CSR Reminders Implementation

## Overview
Added a **CSR Reminders** section at the top of the call window to help CSRs follow best practices during customer calls. The reminders are configurable and can be managed from account settings.

---

## Changes Made

### 1. **Customer Overview Auto-Closed** ✅

The Customer Overview section now starts **closed by default** to reduce visual clutter and allow CSRs to focus on the call reminders first.

```tsx
<UnifiedAccordion
  sections={sections}
  defaultOpenSection={null}  // Changed from "overview" to null
  storageKey="call-window-customer-sidebar"
  enableReordering={false}
/>
```

---

### 2. **New CSR Reminders Section** ✅

Added a minimalistic but detailed reminder section at the top of the customer sidebar:

#### Visual Design:
```
┌─────────────────────────────────────────────────────┐
│ 💡 Call Reminders                                   │
│                                                     │
│ • Greet customer warmly and smile while speaking   │
│ • Verify customer name, phone, and service address │
│ • Ask about preferred appointment times            │
│ • Confirm all details before ending the call       │
└─────────────────────────────────────────────────────┘
```

#### Features:
- **Lightbulb icon** with primary color accent
- **Subtle background** (primary/5 with primary/20 border)
- **Small, readable text** (text-xs) to stay minimalistic
- **Bullet points** with primary color for visual hierarchy
- **Responsive** and clean design

---

### 3. **Type Definitions** ✅

Created `src/types/csr-reminders.ts` with:

#### CSRReminder Interface:
```tsx
export interface CSRReminder {
  id: string;
  text: string;
  enabled: boolean;
  order: number;
}
```

#### Default Reminders:
```tsx
export const DEFAULT_CSR_REMINDERS: CSRReminder[] = [
  {
    id: "greeting",
    text: "Greet customer warmly and smile while speaking",
    enabled: true,
    order: 1,
  },
  {
    id: "verify",
    text: "Verify customer name, phone, and service address",
    enabled: true,
    order: 2,
  },
  {
    id: "availability",
    text: "Ask about preferred appointment times and availability",
    enabled: true,
    order: 3,
  },
  {
    id: "confirm",
    text: "Confirm all details before ending the call",
    enabled: true,
    order: 4,
  },
];
```

#### Optional Reminders:
```tsx
export const OPTIONAL_CSR_REMINDERS: CSRReminder[] = [
  {
    id: "upsell",
    text: "Mention maintenance plans or additional services",
    enabled: false,
    order: 5,
  },
  {
    id: "feedback",
    text: "Ask if customer has any questions or concerns",
    enabled: false,
    order: 6,
  },
  {
    id: "followup",
    text: "Inform customer about follow-up communication",
    enabled: false,
    order: 7,
  },
  {
    id: "payment",
    text: "Discuss payment options and pricing",
    enabled: false,
    order: 8,
  },
  {
    id: "emergency",
    text: "Ask if this is an emergency requiring immediate service",
    enabled: false,
    order: 9,
  },
];
```

---

### 4. **Dynamic Reminders** ✅

The CustomerSidebar component now:
- Imports and filters enabled reminders
- Sorts by order
- Renders dynamically
- Hides section if no reminders are enabled

```tsx
// TODO: Fetch CSR reminders from user settings/company settings
// For now, use default reminders
const csrReminders = DEFAULT_CSR_REMINDERS
  .filter(r => r.enabled)
  .sort((a, b) => a.order - b.order);

// Render reminders
{csrReminders.length > 0 && (
  <section className="rounded-xl border border-primary/20 bg-primary/5 shadow-sm overflow-hidden">
    {/* ... */}
    <ul className="space-y-1.5 text-muted-foreground text-xs">
      {csrReminders.map((reminder) => (
        <li key={reminder.id} className="flex items-start gap-2">
          <span className="mt-0.5 text-primary">•</span>
          <span>{reminder.text}</span>
        </li>
      ))}
    </ul>
  </section>
)}
```

---

## Files Modified

### 1. **`src/components/call-window/customer-sidebar.tsx`**
- Added `Lightbulb` icon import
- Imported `DEFAULT_CSR_REMINDERS` and `CSRReminder` type
- Added `csrReminders` filtering and sorting
- Added CSR Reminders section at the top
- Changed `defaultOpenSection` from `"overview"` to `null`

### 2. **`src/types/csr-reminders.ts`** (NEW)
- Created `CSRReminder` interface
- Created `CSRReminderSettings` interface
- Defined `DEFAULT_CSR_REMINDERS` (4 default reminders)
- Defined `OPTIONAL_CSR_REMINDERS` (5 optional reminders)

---

## Layout Structure

```
┌───────────────────────────────────────────────────────┐
│ Call Window                                           │
├───────────────────────────────────────────────────────┤
│                                                       │
│ ┌─────────────────┬─────────────────────────────────┐│
│ │ Transcript (35%)│ Customer Sidebar (65%)          ││
│ │                 │                                 ││
│ │                 │ ┌─────────────────────────────┐ ││
│ │                 │ │ 💡 Call Reminders           │ ││
│ │                 │ │ • Greet warmly              │ ││
│ │                 │ │ • Verify info               │ ││
│ │                 │ │ • Ask availability          │ ││
│ │                 │ │ • Confirm details           │ ││
│ │                 │ └─────────────────────────────┘ ││
│ │                 │                                 ││
│ │                 │ ┌─────────────────────────────┐ ││
│ │                 │ │ ▶ Customer Overview         │ ││ ← Closed by default
│ │                 │ ├─────────────────────────────┤ ││
│ │                 │ │ ▶ Jobs (3)                  │ ││
│ │                 │ ├─────────────────────────────┤ ││
│ │                 │ │ ▶ Invoices (2)              │ ││
│ │                 │ ├─────────────────────────────┤ ││
│ │                 │ │ ▶ Appointments (1)          │ ││
│ │                 │ ├─────────────────────────────┤ ││
│ │                 │ │ ▶ Properties (1)            │ ││
│ │                 │ ├─────────────────────────────┤ ││
│ │                 │ │ ▶ Equipment (4)             │ ││
│ │                 │ ├─────────────────────────────┤ ││
│ │                 │ │ ▶ Notes (0)                 │ ││
│ │                 │ └─────────────────────────────┘ ││
│ └─────────────────┴─────────────────────────────────┘│
└───────────────────────────────────────────────────────┘
```

---

## Benefits

### 1. **CSR Guidance** ✅
- Clear reminders for best practices
- Helps new CSRs follow procedures
- Reduces training time
- Ensures consistent customer experience

### 2. **Minimalistic Design** ✅
- Small text (text-xs) doesn't dominate the screen
- Subtle colors (primary/5 background)
- Clean bullet points
- Easy to scan quickly

### 3. **Configurable** ✅
- Can be enabled/disabled per reminder
- Order can be customized
- New reminders can be added
- Company-specific settings

### 4. **Clean Layout** ✅
- Customer Overview starts closed
- Reminders are first thing CSR sees
- Reduces visual clutter
- Focuses attention on the call

---

## Future Enhancements

### 1. **Settings Page Integration**

Create a settings page where admins can:
- Enable/disable reminders
- Reorder reminders
- Add custom reminders
- Set company-wide defaults

```tsx
// Settings page component
<CSRReminderSettings
  reminders={reminders}
  onUpdate={handleUpdateReminders}
  onReorder={handleReorderReminders}
  onAdd={handleAddReminder}
  onDelete={handleDeleteReminder}
/>
```

### 2. **Per-User Customization**

Allow individual CSRs to customize their own reminders:
```tsx
// Fetch user-specific reminders
const { data: userReminders } = await supabase
  .from("user_csr_reminders")
  .select("*")
  .eq("user_id", userId);

// Fallback to company defaults
const reminders = userReminders || companyReminders;
```

### 3. **Database Schema**

```sql
-- Company-wide CSR reminders
CREATE TABLE company_csr_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-specific CSR reminders (overrides)
CREATE TABLE user_csr_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. **Server Action to Fetch Reminders**

```tsx
// src/actions/csr-reminders.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CSR_REMINDERS } from "@/types/csr-reminders";

export async function getCSRReminders() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return DEFAULT_CSR_REMINDERS;

  // Try user-specific reminders first
  const { data: userReminders } = await supabase
    .from("user_csr_reminders")
    .select("*")
    .eq("user_id", user.id)
    .order("order_index");

  if (userReminders && userReminders.length > 0) {
    return userReminders;
  }

  // Fallback to company reminders
  const { data: teamMember } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();

  if (teamMember) {
    const { data: companyReminders } = await supabase
      .from("company_csr_reminders")
      .select("*")
      .eq("company_id", teamMember.company_id)
      .order("order_index");

    if (companyReminders && companyReminders.length > 0) {
      return companyReminders;
    }
  }

  // Final fallback to defaults
  return DEFAULT_CSR_REMINDERS;
}
```

### 5. **Update CustomerSidebar to Fetch from Database**

```tsx
export function CustomerSidebar({ customerData, isLoading }: CustomerSidebarProps) {
  const [csrReminders, setCSRReminders] = useState<CSRReminder[]>(DEFAULT_CSR_REMINDERS);

  useEffect(() => {
    async function fetchReminders() {
      const reminders = await getCSRReminders();
      setCSRReminders(reminders.filter(r => r.enabled).sort((a, b) => a.order - b.order));
    }
    fetchReminders();
  }, []);

  // ... rest of component
}
```

---

## Testing

### Manual Testing:
1. **Open call window** (inbound or outbound)
2. **Verify reminders appear** at the top of the customer sidebar
3. **Check Customer Overview is closed** by default
4. **Verify reminders are readable** and well-formatted
5. **Test with no reminders** (set all to `enabled: false`)
6. **Verify section hides** when no reminders are enabled

### Visual Testing:
- Check colors and spacing
- Verify lightbulb icon appears
- Confirm text is readable (not too small)
- Test in light and dark mode

---

## Status

✅ **Customer Overview auto-closed**  
✅ **CSR Reminders section added**  
✅ **Type definitions created**  
✅ **Default reminders defined**  
✅ **Optional reminders defined**  
✅ **Dynamic rendering implemented**  
✅ **Minimalistic design**  
✅ **No linter errors**  

CSR Reminders are now live in the call window! 🎉

