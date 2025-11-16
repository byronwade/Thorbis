# CSR Schedule Visualization

## Overview
Added a schedule visualization for CSRs in the call window to help them see their appointments and availability while on a call, making it easy to book new appointments.

---

## Implementation

### 1. **New Component: `CSRScheduleView`** ✅

Created `src/components/call-window/csr-schedule-view.tsx` with:

#### Features:
- **Date navigation** (previous/next day)
- **Today indicator** badge
- **Availability summary** (available slots / total slots)
- **Time slot list** (8 AM - 6 PM)
- **Booked appointments** with customer details
- **Available slots** highlighted
- **Book appointment** button

---

### 2. **Toggle Between Transcript and Schedule** ✅

Updated `src/app/call-window/page.tsx` to add:
- **Toggle buttons** at the top of the left panel
- **Transcript** view (default)
- **Schedule** view (new)
- **Smooth switching** between views

---

## Visual Design

### Layout:

```
┌───────────────────────────────────────────────────────┐
│ Call Toolbar                                          │
├───────────────────────────────────────────────────────┤
│                                                       │
│ ┌─────────────────┬─────────────────────────────────┐│
│ │ [Transcript] [Schedule]  │ Customer Sidebar       ││
│ ├─────────────────┤                                 ││
│ │                 │ 💡 Call Reminders               ││
│ │ < Fri, Jan 15 > │                                 ││
│ │    [Today]      │ 🏷️ Stats & Tags                 ││
│ │                 │                                 ││
│ │ Available: 8/11 │ ▶ Customer Overview             ││
│ │                 │ ▶ Jobs (3)                      ││
│ │ ⏰ 8:00 AM      │ ▶ Invoices (2)                  ││
│ │   Available     │                                 ││
│ │                 │                                 ││
│ │ ⏰ 9:00 AM      │                                 ││
│ │   John Smith    │                                 ││
│ │   📍 123 Main   │                                 ││
│ │   [Service]     │                                 ││
│ │                 │                                 ││
│ │ ⏰ 10:00 AM     │                                 ││
│ │   Available     │                                 ││
│ │                 │                                 ││
│ │ [Book Appt]     │                                 ││
│ └─────────────────┴─────────────────────────────────┘│
└───────────────────────────────────────────────────────┘
```

---

## Schedule View Components

### 1. **Header Section**

#### Date Navigation:
```tsx
< Fri, Jan 15 >
   [Today]
```

- **Left arrow**: Previous day
- **Center**: Current date with calendar icon
- **Right arrow**: Next day
- **Today badge**: Shows when viewing today

#### Availability Summary:
```
⏰ Available Slots    8 / 11
```

- Shows number of available slots
- Total slots for the day
- Quick glance at availability

---

### 2. **Time Slots List**

#### Available Slot:
```
┌─────────────────────────────┐
│ ⏰ 8:00 AM     [Available]  │
└─────────────────────────────┘
```

- Clock icon
- Time (12-hour format)
- "Available" badge
- Hover effect
- Clickable to book

#### Booked Slot:
```
┌─────────────────────────────┐
│ ⏰ 9:00 AM          [2h]    │
│                             │
│   👤 John Smith             │
│   📍 123 Main St            │
│   [Service Call]            │
└─────────────────────────────┘
```

- Clock icon (primary color)
- Time (bold)
- Duration badge
- Customer name
- Address
- Appointment type badge

---

### 3. **Quick Actions**

```
┌─────────────────────────────┐
│   📅 Book Appointment       │
└─────────────────────────────┘
```

- Full-width button
- Calendar icon
- Primary action

---

## Time Slot Details

### Time Range:
- **Start**: 8:00 AM
- **End**: 6:00 PM
- **Slots**: 11 total (8 AM - 6 PM)

### Slot Information:

#### Available Slot:
```tsx
{
  time: "8:00 AM",
  hour: 8,
  isAvailable: true,
  appointment: undefined
}
```

#### Booked Slot:
```tsx
{
  time: "9:00 AM",
  hour: 9,
  isAvailable: false,
  appointment: {
    id: "1",
    customerName: "John Smith",
    address: "123 Main St",
    type: "Service Call",
    duration: 2
  }
}
```

---

## Toggle Buttons

### Design:
```
┌──────────────┬──────────────┐
│ 💬 Transcript│ 📅 Schedule  │
└──────────────┴──────────────┘
```

- **Two buttons**: Transcript and Schedule
- **Icons**: MessageSquare and CalendarDays
- **Active state**: Secondary variant (highlighted)
- **Inactive state**: Ghost variant (subtle)
- **Full width**: Each button takes 50%
- **Border**: Right border between buttons

---

## Styling Details

### Colors:
- **Available slots**: `bg-card` with `border-border/50`
- **Booked slots**: `bg-primary/5` with `border-primary/30`
- **Hover**: `hover:bg-muted/50` on available slots
- **Icons**: `text-muted-foreground` for available, `text-primary` for booked

### Typography:
- **Time**: `text-xs font-medium` (available), `text-xs font-semibold` (booked)
- **Customer name**: `text-xs font-medium`
- **Address**: `text-xs text-muted-foreground`
- **Badges**: `text-[10px]`

### Spacing:
- **Slot padding**: `p-2`
- **Slot gap**: `space-y-1`
- **Header padding**: `p-4`
- **Footer padding**: `p-3`

---

## Benefits

### 1. **Appointment Booking** ✅
- CSR can see availability while on call
- Easy to find open slots
- Quick booking without leaving call window

### 2. **Schedule Awareness** ✅
- Know what's coming up
- Prepare for next appointment
- Manage time effectively

### 3. **Customer Context** ✅
- See existing appointments
- Avoid double-booking
- Reference previous appointments

### 4. **Efficient Workflow** ✅
- Toggle between transcript and schedule
- No need to open separate calendar
- Everything in one place

---

## Future Enhancements

### 1. **Real Data Integration**

```tsx
// Fetch CSR's appointments from database
const { data: appointments } = await supabase
  .from("appointments")
  .select(`
    *,
    customer:customers(first_name, last_name),
    property:properties(address)
  `)
  .eq("assigned_to", userId)
  .gte("scheduled_at", startOfDay)
  .lte("scheduled_at", endOfDay)
  .order("scheduled_at");
```

### 2. **Click to Book**

```tsx
// Click on available slot to book appointment
const handleSlotClick = (slot: TimeSlot) => {
  if (slot.isAvailable) {
    openBookingModal({
      customerId: call.customerData?.customer?.id,
      startTime: slot.hour,
      date: selectedDate,
    });
  }
};
```

### 3. **Drag and Drop**

```tsx
// Drag appointment to reschedule
<div
  draggable
  onDragStart={(e) => handleDragStart(e, appointment)}
  onDrop={(e) => handleDrop(e, slot)}
>
  {/* Appointment card */}
</div>
```

### 4. **Multi-Day View**

```tsx
// Show multiple days at once
const [viewMode, setViewMode] = useState<"day" | "week">("day");

{viewMode === "week" ? (
  <WeekView appointments={appointments} />
) : (
  <DayView appointments={appointments} />
)}
```

### 5. **Appointment Details Modal**

```tsx
// Click on booked slot to see details
const handleAppointmentClick = (appointment: Appointment) => {
  openAppointmentModal(appointment);
};
```

### 6. **Color-Coded Appointments**

```tsx
// Different colors for different appointment types
const getAppointmentColor = (type: string) => {
  switch (type) {
    case "Service Call":
      return "bg-blue-500/10 border-blue-500/30";
    case "Installation":
      return "bg-green-500/10 border-green-500/30";
    case "Maintenance":
      return "bg-yellow-500/10 border-yellow-500/30";
    default:
      return "bg-primary/5 border-primary/30";
  }
};
```

### 7. **Time Zone Support**

```tsx
// Show appointments in CSR's time zone
const formatTimeInTimeZone = (date: Date, timeZone: string) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(date);
};
```

### 8. **Availability Rules**

```tsx
// Respect CSR's working hours and breaks
const workingHours = {
  start: 8,
  end: 18,
  lunchBreak: { start: 12, end: 13 },
};

const isSlotAvailable = (hour: number) => {
  if (hour < workingHours.start || hour >= workingHours.end) {
    return false;
  }
  if (hour >= workingHours.lunchBreak.start && hour < workingHours.lunchBreak.end) {
    return false;
  }
  return !hasAppointment(hour);
};
```

---

## Database Schema

```sql
-- Appointments table (if not exists)
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id),
  assigned_to UUID REFERENCES users(id), -- CSR/Technician
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_hours INTEGER NOT NULL DEFAULT 1,
  type TEXT NOT NULL, -- Service Call, Installation, Maintenance, etc.
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, confirmed, in_progress, completed, cancelled
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_appointments_assigned_to_date ON appointments(assigned_to, scheduled_at);
CREATE INDEX idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX idx_appointments_status ON appointments(status);
```

---

## Server Action

```tsx
// src/actions/csr-schedule.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCSRSchedule(date: Date) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get start and end of day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch appointments
  const { data: appointments, error } = await supabase
    .from("appointments")
    .select(`
      *,
      customer:customers(first_name, last_name),
      property:properties(address, city, state)
    `)
    .eq("assigned_to", user.id)
    .gte("scheduled_at", startOfDay.toISOString())
    .lte("scheduled_at", endOfDay.toISOString())
    .order("scheduled_at");

  if (error) throw error;
  return appointments;
}
```

---

## Usage in CustomerSidebar

```tsx
// Update CustomerSidebar to fetch schedule
const [schedule, setSchedule] = useState<Appointment[]>([]);

useEffect(() => {
  async function fetchSchedule() {
    const appointments = await getCSRSchedule(new Date());
    setSchedule(appointments);
  }
  fetchSchedule();
}, []);
```

---

## Status

✅ **CSRScheduleView component created**  
✅ **Toggle buttons added to left panel**  
✅ **Date navigation implemented**  
✅ **Time slot list (8 AM - 6 PM)**  
✅ **Available slots highlighted**  
✅ **Booked appointments displayed**  
✅ **Customer details shown**  
✅ **Availability summary**  
✅ **Book appointment button**  
✅ **No linter errors**  

CSR Schedule Visualization is now live! 🎉

