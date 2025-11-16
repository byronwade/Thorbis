# Schedule View Redesign

## Overview
Completely redesigned the schedule view to show all technicians' appointments with clear 2-hour windows, matching the dashboard's collapsible design pattern.

---

## Key Changes

### 1. **Schedule Shows First** ✅
Changed default view from "transcript" to "schedule" so CSRs see availability immediately when opening the call window.

### 2. **Multi-Technician View** ✅
Shows all technicians and their appointments, not just one person's schedule.

### 3. **2-Hour Windows** ✅
All appointments clearly show 2-hour time windows (e.g., "9:00 AM - 11:00 AM" with "2h window" badge).

### 4. **Collapsible Design** ✅
Uses `UnifiedAccordion` component to match the dashboard design - same as customer sidebar and job details pages.

### 5. **Visual Tech Sorting** ✅
Each technician has:
- **Color-coded avatar** for quick identification
- **Collapsible section** with their name
- **Appointment count** badge
- **"Full Day" button** to view complete schedule

---

## Visual Design

```
┌───────────────────────────────────────────────────────┐
│ [Schedule] [Transcript]                               │
├───────────────────────────────────────────────────────┤
│                                                       │
│ < Fri, Jan 15 >                                       │
│    [Today]                                            │
│                                                       │
│ 👥 3 Techs  •  5 Appointments      [Show All]        │
│                                                       │
├───────────────────────────────────────────────────────┤
│                                                       │
│ ▼ 🔵 John Martinez (2)              [📅 Full Day]    │
│                                                       │
│   ┌─────────────────────────────────────────────┐   │
│   │ ⏰ 9:00 AM - 11:00 AM  [2h]  [Scheduled]    │   │
│   │                                             │   │
│   │ 👤 Sarah Johnson                            │   │
│   │ 📍 123 Main St, San Francisco               │   │
│   │ [HVAC Repair]                               │   │
│   └─────────────────────────────────────────────┘   │
│                                                       │
│   ┌─────────────────────────────────────────────┐   │
│   │ ⏰ 1:00 PM - 3:00 PM  [2h]  [In Progress]   │   │
│   │                                             │   │
│   │ 👤 Mike Davis                               │   │
│   │ 📍 456 Oak Ave, Oakland                     │   │
│   │ [Installation]                              │   │
│   └─────────────────────────────────────────────┘   │
│                                                       │
│ ▶ 🟢 Emily Chen (1)                 [📅 Full Day]    │
│                                                       │
│ ▶ 🟣 David Wilson (2)               [📅 Full Day]    │
│                                                       │
├───────────────────────────────────────────────────────┤
│ [+ Book New Appointment]                              │
└───────────────────────────────────────────────────────┘
```

---

## Components

### 1. **Header Section**

#### Date Navigation:
```
< Fri, Jan 15 >
   [Today]
```
- Previous/Next day arrows
- Current date with calendar icon
- "Today" badge when viewing today

#### Stats Bar:
```
👥 3 Techs  •  5 Appointments    [Show All]
```
- Technician count
- Total appointments
- Filter toggle button

---

### 2. **Technician Sections (Collapsible)**

Each technician has a collapsible section with:

#### Header:
```
▼ 🔵 John Martinez (2)    [📅 Full Day]
```
- **Expand/collapse arrow**
- **Color-coded avatar** (blue, green, purple, etc.)
- **Technician name**
- **Appointment count** badge
- **"Full Day" button** to view complete schedule

#### Content (Appointments):
```
┌─────────────────────────────────────────────┐
│ ⏰ 9:00 AM - 11:00 AM  [2h]  [Scheduled]    │
│                                             │
│ 👤 Sarah Johnson                            │
│ 📍 123 Main St, San Francisco               │
│ [HVAC Repair]                               │
└─────────────────────────────────────────────┘
```

Each appointment shows:
- **Time window** (start - end) with clock icon
- **Duration badge** ("2h window")
- **Status badge** (Scheduled/In Progress/Completed)
- **Customer name** with user icon
- **Address** with map pin icon
- **Job type** badge

---

### 3. **Appointment Cards**

#### Scheduled:
```
⏰ 9:00 AM - 11:00 AM  [2h]  [Scheduled]

👤 Sarah Johnson
📍 123 Main St, San Francisco
[HVAC Repair]
```
- Gray status badge
- Circle icon

#### In Progress:
```
⏰ 1:00 PM - 3:00 PM  [2h]  [In Progress]

👤 Mike Davis
📍 456 Oak Ave, Oakland
[Installation]
```
- Yellow/warning status badge
- Play icon

#### Completed:
```
⏰ 10:00 AM - 12:00 PM  [2h]  [Completed]

👤 Robert Smith
📍 789 Pine Rd, Berkeley
[Maintenance]
```
- Green/success status badge
- Check icon

---

### 4. **Empty State**

When a technician has no appointments:
```
┌─────────────────────────────────────────────┐
│            📅                               │
│                                             │
│      No appointments today                  │
│      This technician is available           │
└─────────────────────────────────────────────┘
```

---

### 5. **Quick Actions**

```
┌─────────────────────────────────────────────┐
│ [+ Book New Appointment]                    │
└─────────────────────────────────────────────┘
```
- Full-width button
- Plus icon
- Primary action

---

## Technician Color Coding

Each technician gets a unique color for their avatar:

```tsx
const technicianColors = [
  "bg-blue-500",    // John Martinez
  "bg-green-500",   // Emily Chen
  "bg-purple-500",  // David Wilson
  "bg-orange-500",  // Next tech
  "bg-pink-500",    // Next tech
  "bg-cyan-500",    // Next tech
  "bg-red-500",     // Next tech
  "bg-yellow-500",  // Next tech
];
```

---

## Status System

### Scheduled:
- **Badge**: Outline, gray
- **Icon**: Circle (empty)
- **Color**: Muted

### In Progress:
- **Badge**: Warning background
- **Icon**: PlayCircle
- **Color**: Yellow/Orange

### Completed:
- **Badge**: Success background
- **Icon**: CheckCircle2
- **Color**: Green

---

## Features

### 1. **Collapsible Sections** ✅
- Each technician is a collapsible section
- Matches dashboard design
- Keyboard shortcuts (Ctrl+1, Ctrl+2, etc.)
- Drag handles for reordering (disabled)

### 2. **2-Hour Windows** ✅
- All appointments show clear time ranges
- "2h window" badge on each appointment
- Standard 2-hour booking windows

### 3. **Visual Sorting** ✅
- Color-coded avatars
- Technician name in header
- Appointment count badge
- Easy to distinguish between techs

### 4. **Filter Option** ✅
- "Show All" button to toggle filter
- Can filter to single technician
- Shows filtered count

### 5. **Status Indicators** ✅
- Color-coded badges
- Icons for each status
- Clear visual distinction

---

## Benefits

### 1. **Clear Availability** ✅
- See all techs at once
- Identify available time slots
- Book appointments efficiently

### 2. **2-Hour Standard** ✅
- Industry standard window
- Clear expectations
- Easy scheduling

### 3. **Visual Organization** ✅
- Color-coded technicians
- Collapsible sections
- Clean, organized layout

### 4. **Consistent Design** ✅
- Matches dashboard
- Uses UnifiedAccordion
- Familiar UI patterns

### 5. **Quick Booking** ✅
- See availability while on call
- Book without leaving window
- Efficient workflow

---

## Mock Data Structure

```tsx
interface Technician {
  id: string;
  name: string;
  avatar?: string;
  color: string; // "bg-blue-500", "bg-green-500", etc.
  appointments: Appointment[];
}

interface Appointment {
  id: string;
  customerName: string;
  address: string;
  city: string;
  type: string;
  startTime: string;  // "9:00 AM"
  endTime: string;    // "11:00 AM"
  duration: number;   // 2 (hours)
  status: "scheduled" | "in_progress" | "completed";
}
```

---

## Future Enhancements

### 1. **Real Data Integration**

```tsx
// Fetch all technicians and their appointments
const { data: technicians } = await supabase
  .from("users")
  .select(`
    *,
    appointments:appointments(
      *,
      customer:customers(first_name, last_name),
      property:properties(address, city)
    )
  `)
  .eq("role", "technician")
  .gte("appointments.scheduled_at", startOfDay)
  .lte("appointments.scheduled_at", endOfDay);
```

### 2. **Click to Book**

```tsx
// Click on time gap to book appointment
const handleBookAppointment = (techId: string, startTime: string) => {
  openBookingModal({
    technicianId: techId,
    startTime,
    duration: 2, // 2-hour window
    customerId: call.customerData?.customer?.id,
  });
};
```

### 3. **Drag and Drop**

```tsx
// Drag appointment to different tech or time
<div
  draggable
  onDragStart={(e) => handleDragStart(e, appointment)}
  onDrop={(e) => handleDrop(e, technician, timeSlot)}
>
  {/* Appointment card */}
</div>
```

### 4. **Route Optimization**

```tsx
// Show route map for each technician
<Button onClick={() => showRouteMap(technician)}>
  <MapPin className="mr-2 h-4 w-4" />
  View Route
</Button>
```

### 5. **Availability Gaps**

```tsx
// Highlight available time slots
const availableSlots = findAvailableSlots(technician.appointments);

{availableSlots.map((slot) => (
  <div className="rounded-lg border-2 border-dashed border-success/50 bg-success/5 p-3">
    <Clock className="h-4 w-4 text-success" />
    <span className="text-success text-sm">
      Available: {slot.startTime} - {slot.endTime}
    </span>
    <Button size="sm" variant="outline">Book</Button>
  </div>
))}
```

### 6. **Tech Filtering**

```tsx
// Filter dropdown
<Select value={selectedTechFilter} onValueChange={setSelectedTechFilter}>
  <SelectTrigger>
    <SelectValue placeholder="All Technicians" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Technicians</SelectItem>
    {technicians.map((tech) => (
      <SelectItem key={tech.id} value={tech.id}>
        {tech.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

### 7. **Status Filters**

```tsx
// Filter by appointment status
const [statusFilter, setStatusFilter] = useState<string | null>(null);

<ToggleGroup type="single" value={statusFilter} onValueChange={setStatusFilter}>
  <ToggleGroupItem value="scheduled">Scheduled</ToggleGroupItem>
  <ToggleGroupItem value="in_progress">In Progress</ToggleGroupItem>
  <ToggleGroupItem value="completed">Completed</ToggleGroupItem>
</ToggleGroup>
```

---

## Status

✅ **Schedule shows first (default)**  
✅ **Multi-technician view**  
✅ **2-hour windows clearly shown**  
✅ **Collapsible design (UnifiedAccordion)**  
✅ **Color-coded avatars**  
✅ **Appointment count badges**  
✅ **Status indicators (scheduled/in progress/completed)**  
✅ **Date navigation**  
✅ **Stats summary**  
✅ **Filter toggle**  
✅ **Empty states**  
✅ **Book appointment button**  
✅ **No linter errors**  

Schedule view redesigned to match dashboard! 🎉

