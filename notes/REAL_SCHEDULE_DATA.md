# Real Schedule Data Implementation

## Overview
Completely rewrote the schedule view to use **real data from the database** with a visual timeline showing current time, active jobs, and available slots for all technicians.

---

## Key Features Implemented

### 1. **Real Database Integration** ✅
- Fetches actual technicians from `team_members` table
- Retrieves real jobs from `jobs` table
- Shows all assigned team members (not just leads)
- Includes job details, customer info, and property addresses

### 2. **Visual Timeline** ✅
- Hour markers (8 AM - 6 PM)
- **Blue line showing current time**
- Colored blocks for scheduled jobs
- Active jobs highlighted with pulse animation
- Available time slots visible as gaps
- Hover tooltips with full appointment details

### 3. **Multi-Technician Support** ✅
- Shows all technicians in collapsible sections
- Each tech has their own timeline
- Color-coded avatars for quick identification
- Role badges (Technician, Lead Technician, Admin)

### 4. **Team Display** ✅
- Shows **all assigned technicians** on each job
- Lead technician highlighted with badge
- Team member count indicator
- Individual team member names

### 5. **Real-Time Updates** ✅
- Current time updates every minute
- Timeline indicator moves in real-time
- Status reflects actual job state

---

## New Files Created

### 1. **`src/actions/schedule.ts`**
Server action to fetch schedule data from database.

```typescript
export interface ScheduleAppointment {
  id: string;
  job_id: string;
  job_number: string;
  customer_name: string;
  customer_id: string;
  address: string;
  city: string;
  state: string;
  job_type: string;
  scheduled_start: string;
  scheduled_end: string;
  duration_hours: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  assigned_technicians: Array<{
    id: string;
    name: string;
    avatar_url?: string;
    is_lead: boolean;
  }>;
}

export interface TechnicianSchedule {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  color: string;
  role: string;
  appointments: ScheduleAppointment[];
  working_hours: {
    start: number; // 8 for 8 AM
    end: number;   // 18 for 6 PM
  };
}

export async function getTechnicianSchedules(date: Date, companyId: string);
```

**Fetches:**
- All team members for company
- All jobs scheduled for selected date
- Job team member assignments
- Customer and property details

---

### 2. **`src/components/call-window/schedule-timeline.tsx`**
Visual timeline component showing appointments and current time.

**Features:**
- Hour markers (8 AM - 6 PM)
- Current time indicator (blue line)
- Appointment blocks (colored by status)
- Active job pulse animation
- Team member count on appointments
- Hover tooltips
- Status legend

**Timeline Colors:**
- **Blue**: Scheduled
- **Yellow/Orange**: In Progress (pulsing)
- **Green**: Completed
- **Red**: Cancelled

---

## Updated Files

### 1. **`src/components/call-window/csr-schedule-view.tsx`**

**Major Changes:**
- Removed all mock data
- Added `companyId` prop
- Integrated `getTechnicianSchedules` action
- Added loading and error states
- Integrated `ScheduleTimeline` component
- Shows all assigned technicians per job
- Real-time current time tracking
- Timeline visualization in each collapsible

**New Props:**
```typescript
interface CSRScheduleViewProps {
  className?: string;
  companyId?: string; // Required for fetching data
}
```

**State Management:**
```typescript
const [technicians, setTechnicians] = useState<TechnicianSchedule[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [currentTime, setCurrentTime] = useState(new Date());
```

**Data Fetching:**
```typescript
useEffect(() => {
  async function fetchSchedule() {
    if (!companyId) {
      setError("No company ID provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const schedules = await getTechnicianSchedules(selectedDate, companyId);
      setTechnicians(schedules);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to load schedules");
    } finally {
      setIsLoading(false);
    }
  }

  fetchSchedule();
}, [selectedDate, companyId]);
```

---

### 2. **`src/app/call-window/page.tsx`**

**Change:**
```typescript
<CSRScheduleView companyId={companyId || undefined} />
```

Passes `companyId` to schedule view for data fetching.

---

## Visual Layout

```
┌───────────────────────────────────────────────────────┐
│ [Schedule] [Transcript]                               │
├───────────────────────────────────────────────────────┤
│ < Fri, Jan 15 >  [Today]                              │
│ 👥 3 Techs  •  5 Appointments      [Show All]        │
├───────────────────────────────────────────────────────┤
│                                                       │
│ ▼ 🔵 John Martinez (2)              [Lead Tech]      │
│                                                       │
│   ┌─────────────────────────────────────────────┐   │
│   │ TIMELINE (8 AM - 6 PM)                      │   │
│   │ ├─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐                    │   │
│   │ 8 9 10 11 12 1 2 3 4 5 6                    │   │
│   │ ├─█████─────█████─────┤                     │   │
│   │      ▲                                      │   │
│   │   [Current Time: 10:30 AM]                  │   │
│   │                                             │   │
│   │ • Scheduled  • In Progress                  │   │
│   │ • Completed  • Current Time                 │   │
│   └─────────────────────────────────────────────┘   │
│                                                       │
│   ⏰ 9:00 AM - 11:00 AM  [2h]  [Scheduled]           │
│   👤 Sarah Johnson                                    │
│   📍 123 Main St, San Francisco, CA                   │
│   [HVAC Repair] #JOB-001                             │
│   ─────────────────────────────────────────────      │
│   👥 Team: [John Martinez (Lead)] [Mike Smith]       │
│                                                       │
│   ⏰ 1:00 PM - 3:00 PM  [2h]  [In Progress]          │
│   👤 Mike Davis                                       │
│   📍 456 Oak Ave, Oakland, CA                         │
│   [Installation] #JOB-002                            │
│   ─────────────────────────────────────────────      │
│   👥 Team: [John Martinez (Lead)] [Emily Chen]       │
│                                                       │
│ ▶ 🟢 Emily Chen (1)                 [Technician]     │
│ ▶ 🟣 David Wilson (2)               [Lead Tech]      │
│                                                       │
├───────────────────────────────────────────────────────┤
│ [+ Book New Appointment]                              │
└───────────────────────────────────────────────────────┘
```

---

## Timeline Component Details

### Hour Markers
```
8a  9a  10a  11a  12p  1p  2p  3p  4p  5p  6p
├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
```

### Current Time Indicator (Blue Line)
```
        ▼
    [10:30 AM]
        │
        │ (Blue line)
        │
```

### Appointment Blocks
```
├───█████───────█████───────────┤
   9-11AM     1-3PM
  (Scheduled) (In Progress)
```

### Hover Tooltip
```
┌─────────────────────────────┐
│ Sarah Johnson               │
│ 9:00 AM to 11:00 AM         │
│ HVAC Repair                 │
└─────────────────────────────┘
```

---

## Appointment Card Details

### Full Card with Team
```
┌─────────────────────────────────────────────┐
│ ⏰ 9:00 AM - 11:00 AM  [2h]  [Scheduled]    │
│                                             │
│ 👤 Sarah Johnson                            │
│ 📍 123 Main St, San Francisco, CA           │
│ [HVAC Repair] #JOB-001                      │
│                                             │
│ ─────────────────────────────────────────── │
│ 👥 Team:                                    │
│ [John Martinez (Lead)] [Mike Smith]         │
└─────────────────────────────────────────────┘
```

### Shows:
1. **Time window** with clock icon
2. **Duration** badge (2h window)
3. **Status** badge (Scheduled/In Progress/Completed/Cancelled)
4. **Customer name** with user icon
5. **Full address** with map pin icon
6. **Job type** badge
7. **Job number** (monospace)
8. **Team section** (if multiple techs):
   - Team icon
   - All assigned technicians
   - Lead badge for lead tech

---

## Database Queries

### Technicians Query
```sql
SELECT 
  tm.user_id,
  tm.role,
  u.id,
  u.email,
  u.raw_user_meta_data
FROM team_members tm
JOIN users u ON u.id = tm.user_id
WHERE tm.company_id = $1
AND tm.role IN ('technician', 'lead_technician', 'admin')
```

### Jobs Query
```sql
SELECT 
  j.id,
  j.job_number,
  j.title,
  j.status,
  j.scheduled_start,
  j.scheduled_end,
  c.id AS customer_id,
  c.first_name,
  c.last_name,
  p.address,
  p.city,
  p.state,
  jtm.user_id,
  jtm.is_lead,
  u.id,
  u.email,
  u.raw_user_meta_data
FROM jobs j
LEFT JOIN customers c ON c.id = j.customer_id
LEFT JOIN properties p ON p.id = j.property_id
LEFT JOIN job_team_members jtm ON jtm.job_id = j.id
LEFT JOIN users u ON u.id = jtm.user_id
WHERE j.company_id = $1
AND j.scheduled_start >= $2
AND j.scheduled_start <= $3
ORDER BY j.scheduled_start
```

---

## Status Mapping

### Job Status → Appointment Status
```typescript
const statusMap = {
  "scheduled": "scheduled",
  "in_progress": "in_progress",
  "active": "in_progress",
  "completed": "completed",
  "done": "completed",
  "cancelled": "cancelled",
  "canceled": "cancelled",
};
```

### Status Colors
- **Scheduled**: Gray/Muted
- **In Progress**: Yellow/Warning (pulsing)
- **Completed**: Green/Success
- **Cancelled**: Red/Destructive

---

## Timeline Calculations

### Current Time Position (0-100%)
```typescript
const getCurrentTimePosition = (): number => {
  const now = currentTime;
  const currentHour = now.getHours() + now.getMinutes() / 60;
  
  if (currentHour < workStart) return 0;
  if (currentHour > workEnd) return 100;
  
  return ((currentHour - workStart) / totalHours) * 100;
};
```

### Appointment Position
```typescript
const getAppointmentStyle = (appointment: ScheduleAppointment) => {
  const start = new Date(appointment.scheduled_start);
  const end = new Date(appointment.scheduled_end);
  
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  
  const left = ((startHour - workStart) / totalHours) * 100;
  const width = ((endHour - startHour) / totalHours) * 100;
  
  return {
    left: `${Math.max(0, left)}%`,
    width: `${Math.min(100 - Math.max(0, left), width)}%`,
  };
};
```

---

## Features Breakdown

### 1. **Real Technicians** ✅
- Fetched from `team_members` table
- Includes all roles (technician, lead_technician, admin)
- Shows real names, emails, avatars
- Color-coded for visual identification

### 2. **Real Jobs** ✅
- Fetched from `jobs` table
- Includes customer and property details
- Shows job number, type, status
- Scheduled start/end times

### 3. **All Team Members** ✅
- Shows **all assigned technicians** per job
- Not just the lead technician
- Lead badge for lead tech
- Team member count indicator

### 4. **Timeline Visualization** ✅
- Hour markers (8 AM - 6 PM)
- Current time indicator (blue line)
- Appointment blocks (colored by status)
- Active jobs pulse animation
- Hover tooltips

### 5. **Available Slots** ✅
- Visible as gaps in timeline
- Easy to identify open time slots
- Can see when techs are free

### 6. **Current Time Tracking** ✅
- Blue line shows current time
- Updates every minute
- Only shows if within working hours

### 7. **Active Job Highlighting** ✅
- In-progress jobs have yellow/orange color
- Pulse animation for active jobs
- Easy to spot ongoing work

---

## Loading States

### Loading Spinner
```
┌───────────────────────────────────────┐
│                                       │
│         ⟳ (spinning)                  │
│                                       │
│     Loading schedules...              │
│                                       │
└───────────────────────────────────────┘
```

### Error State
```
┌───────────────────────────────────────┐
│                                       │
│         ⚠️                            │
│                                       │
│     Failed to load schedules          │
│                                       │
│         [Retry]                       │
│                                       │
└───────────────────────────────────────┘
```

---

## Real-Time Updates

### Current Time
```typescript
// Update current time every minute
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 60000); // Update every minute

  return () => clearInterval(interval);
}, []);
```

### Timeline Indicator
- Blue line position updates automatically
- Shows current time badge
- Only visible during working hours (8 AM - 6 PM)

---

## Benefits

### 1. **Real Data** ✅
- No mock data
- Actual technicians from database
- Real jobs and appointments
- Accurate customer information

### 2. **Visual Timeline** ✅
- See entire day at a glance
- Current time indicator
- Available slots visible
- Active jobs highlighted

### 3. **Team Visibility** ✅
- All assigned technicians shown
- Lead technician identified
- Team composition clear
- Multi-tech jobs visible

### 4. **Easy Booking** ✅
- See availability while on call
- Identify open time slots
- Check tech schedules
- Book efficiently

### 5. **Real-Time Awareness** ✅
- Current time always visible
- Active jobs highlighted
- Status updates reflected
- Timeline moves in real-time

---

## Example Data Flow

### 1. Component Mounts
```
CSRScheduleView
  ↓
  companyId prop received
  ↓
  useEffect triggered
  ↓
  getTechnicianSchedules(date, companyId)
```

### 2. Server Action
```
getTechnicianSchedules
  ↓
  Fetch team_members
  ↓
  Fetch jobs with team assignments
  ↓
  Map and format data
  ↓
  Return TechnicianSchedule[]
```

### 3. Render
```
TechnicianSchedule[]
  ↓
  Map to UnifiedAccordionSection[]
  ↓
  Each section contains:
    - ScheduleTimeline
    - Appointment cards
    - Team member badges
```

---

## Status

✅ **Real database integration**  
✅ **Visual timeline with current time**  
✅ **All assigned technicians shown**  
✅ **Available time slots visible**  
✅ **Active jobs highlighted**  
✅ **2-hour windows displayed**  
✅ **Loading and error states**  
✅ **Real-time current time updates**  
✅ **Team member badges (lead/member)**  
✅ **Job numbers and details**  
✅ **Customer and property info**  
✅ **Status color coding**  
✅ **Hover tooltips on timeline**  
✅ **No linter errors**  

Schedule view now uses real data with visual timeline! 🎉


## Overview
Completely rewrote the schedule view to use **real data from the database** with a visual timeline showing current time, active jobs, and available slots for all technicians.

---

## Key Features Implemented

### 1. **Real Database Integration** ✅
- Fetches actual technicians from `team_members` table
- Retrieves real jobs from `jobs` table
- Shows all assigned team members (not just leads)
- Includes job details, customer info, and property addresses

### 2. **Visual Timeline** ✅
- Hour markers (8 AM - 6 PM)
- **Blue line showing current time**
- Colored blocks for scheduled jobs
- Active jobs highlighted with pulse animation
- Available time slots visible as gaps
- Hover tooltips with full appointment details

### 3. **Multi-Technician Support** ✅
- Shows all technicians in collapsible sections
- Each tech has their own timeline
- Color-coded avatars for quick identification
- Role badges (Technician, Lead Technician, Admin)

### 4. **Team Display** ✅
- Shows **all assigned technicians** on each job
- Lead technician highlighted with badge
- Team member count indicator
- Individual team member names

### 5. **Real-Time Updates** ✅
- Current time updates every minute
- Timeline indicator moves in real-time
- Status reflects actual job state

---

## New Files Created

### 1. **`src/actions/schedule.ts`**
Server action to fetch schedule data from database.

```typescript
export interface ScheduleAppointment {
  id: string;
  job_id: string;
  job_number: string;
  customer_name: string;
  customer_id: string;
  address: string;
  city: string;
  state: string;
  job_type: string;
  scheduled_start: string;
  scheduled_end: string;
  duration_hours: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  assigned_technicians: Array<{
    id: string;
    name: string;
    avatar_url?: string;
    is_lead: boolean;
  }>;
}

export interface TechnicianSchedule {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  color: string;
  role: string;
  appointments: ScheduleAppointment[];
  working_hours: {
    start: number; // 8 for 8 AM
    end: number;   // 18 for 6 PM
  };
}

export async function getTechnicianSchedules(date: Date, companyId: string);
```

**Fetches:**
- All team members for company
- All jobs scheduled for selected date
- Job team member assignments
- Customer and property details

---

### 2. **`src/components/call-window/schedule-timeline.tsx`**
Visual timeline component showing appointments and current time.

**Features:**
- Hour markers (8 AM - 6 PM)
- Current time indicator (blue line)
- Appointment blocks (colored by status)
- Active job pulse animation
- Team member count on appointments
- Hover tooltips
- Status legend

**Timeline Colors:**
- **Blue**: Scheduled
- **Yellow/Orange**: In Progress (pulsing)
- **Green**: Completed
- **Red**: Cancelled

---

## Updated Files

### 1. **`src/components/call-window/csr-schedule-view.tsx`**

**Major Changes:**
- Removed all mock data
- Added `companyId` prop
- Integrated `getTechnicianSchedules` action
- Added loading and error states
- Integrated `ScheduleTimeline` component
- Shows all assigned technicians per job
- Real-time current time tracking
- Timeline visualization in each collapsible

**New Props:**
```typescript
interface CSRScheduleViewProps {
  className?: string;
  companyId?: string; // Required for fetching data
}
```

**State Management:**
```typescript
const [technicians, setTechnicians] = useState<TechnicianSchedule[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [currentTime, setCurrentTime] = useState(new Date());
```

**Data Fetching:**
```typescript
useEffect(() => {
  async function fetchSchedule() {
    if (!companyId) {
      setError("No company ID provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const schedules = await getTechnicianSchedules(selectedDate, companyId);
      setTechnicians(schedules);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to load schedules");
    } finally {
      setIsLoading(false);
    }
  }

  fetchSchedule();
}, [selectedDate, companyId]);
```

---

### 2. **`src/app/call-window/page.tsx`**

**Change:**
```typescript
<CSRScheduleView companyId={companyId || undefined} />
```

Passes `companyId` to schedule view for data fetching.

---

## Visual Layout

```
┌───────────────────────────────────────────────────────┐
│ [Schedule] [Transcript]                               │
├───────────────────────────────────────────────────────┤
│ < Fri, Jan 15 >  [Today]                              │
│ 👥 3 Techs  •  5 Appointments      [Show All]        │
├───────────────────────────────────────────────────────┤
│                                                       │
│ ▼ 🔵 John Martinez (2)              [Lead Tech]      │
│                                                       │
│   ┌─────────────────────────────────────────────┐   │
│   │ TIMELINE (8 AM - 6 PM)                      │   │
│   │ ├─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐                    │   │
│   │ 8 9 10 11 12 1 2 3 4 5 6                    │   │
│   │ ├─█████─────█████─────┤                     │   │
│   │      ▲                                      │   │
│   │   [Current Time: 10:30 AM]                  │   │
│   │                                             │   │
│   │ • Scheduled  • In Progress                  │   │
│   │ • Completed  • Current Time                 │   │
│   └─────────────────────────────────────────────┘   │
│                                                       │
│   ⏰ 9:00 AM - 11:00 AM  [2h]  [Scheduled]           │
│   👤 Sarah Johnson                                    │
│   📍 123 Main St, San Francisco, CA                   │
│   [HVAC Repair] #JOB-001                             │
│   ─────────────────────────────────────────────      │
│   👥 Team: [John Martinez (Lead)] [Mike Smith]       │
│                                                       │
│   ⏰ 1:00 PM - 3:00 PM  [2h]  [In Progress]          │
│   👤 Mike Davis                                       │
│   📍 456 Oak Ave, Oakland, CA                         │
│   [Installation] #JOB-002                            │
│   ─────────────────────────────────────────────      │
│   👥 Team: [John Martinez (Lead)] [Emily Chen]       │
│                                                       │
│ ▶ 🟢 Emily Chen (1)                 [Technician]     │
│ ▶ 🟣 David Wilson (2)               [Lead Tech]      │
│                                                       │
├───────────────────────────────────────────────────────┤
│ [+ Book New Appointment]                              │
└───────────────────────────────────────────────────────┘
```

---

## Timeline Component Details

### Hour Markers
```
8a  9a  10a  11a  12p  1p  2p  3p  4p  5p  6p
├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
```

### Current Time Indicator (Blue Line)
```
        ▼
    [10:30 AM]
        │
        │ (Blue line)
        │
```

### Appointment Blocks
```
├───█████───────█████───────────┤
   9-11AM     1-3PM
  (Scheduled) (In Progress)
```

### Hover Tooltip
```
┌─────────────────────────────┐
│ Sarah Johnson               │
│ 9:00 AM to 11:00 AM         │
│ HVAC Repair                 │
└─────────────────────────────┘
```

---

## Appointment Card Details

### Full Card with Team
```
┌─────────────────────────────────────────────┐
│ ⏰ 9:00 AM - 11:00 AM  [2h]  [Scheduled]    │
│                                             │
│ 👤 Sarah Johnson                            │
│ 📍 123 Main St, San Francisco, CA           │
│ [HVAC Repair] #JOB-001                      │
│                                             │
│ ─────────────────────────────────────────── │
│ 👥 Team:                                    │
│ [John Martinez (Lead)] [Mike Smith]         │
└─────────────────────────────────────────────┘
```

### Shows:
1. **Time window** with clock icon
2. **Duration** badge (2h window)
3. **Status** badge (Scheduled/In Progress/Completed/Cancelled)
4. **Customer name** with user icon
5. **Full address** with map pin icon
6. **Job type** badge
7. **Job number** (monospace)
8. **Team section** (if multiple techs):
   - Team icon
   - All assigned technicians
   - Lead badge for lead tech

---

## Database Queries

### Technicians Query
```sql
SELECT 
  tm.user_id,
  tm.role,
  u.id,
  u.email,
  u.raw_user_meta_data
FROM team_members tm
JOIN users u ON u.id = tm.user_id
WHERE tm.company_id = $1
AND tm.role IN ('technician', 'lead_technician', 'admin')
```

### Jobs Query
```sql
SELECT 
  j.id,
  j.job_number,
  j.title,
  j.status,
  j.scheduled_start,
  j.scheduled_end,
  c.id AS customer_id,
  c.first_name,
  c.last_name,
  p.address,
  p.city,
  p.state,
  jtm.user_id,
  jtm.is_lead,
  u.id,
  u.email,
  u.raw_user_meta_data
FROM jobs j
LEFT JOIN customers c ON c.id = j.customer_id
LEFT JOIN properties p ON p.id = j.property_id
LEFT JOIN job_team_members jtm ON jtm.job_id = j.id
LEFT JOIN users u ON u.id = jtm.user_id
WHERE j.company_id = $1
AND j.scheduled_start >= $2
AND j.scheduled_start <= $3
ORDER BY j.scheduled_start
```

---

## Status Mapping

### Job Status → Appointment Status
```typescript
const statusMap = {
  "scheduled": "scheduled",
  "in_progress": "in_progress",
  "active": "in_progress",
  "completed": "completed",
  "done": "completed",
  "cancelled": "cancelled",
  "canceled": "cancelled",
};
```

### Status Colors
- **Scheduled**: Gray/Muted
- **In Progress**: Yellow/Warning (pulsing)
- **Completed**: Green/Success
- **Cancelled**: Red/Destructive

---

## Timeline Calculations

### Current Time Position (0-100%)
```typescript
const getCurrentTimePosition = (): number => {
  const now = currentTime;
  const currentHour = now.getHours() + now.getMinutes() / 60;
  
  if (currentHour < workStart) return 0;
  if (currentHour > workEnd) return 100;
  
  return ((currentHour - workStart) / totalHours) * 100;
};
```

### Appointment Position
```typescript
const getAppointmentStyle = (appointment: ScheduleAppointment) => {
  const start = new Date(appointment.scheduled_start);
  const end = new Date(appointment.scheduled_end);
  
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  
  const left = ((startHour - workStart) / totalHours) * 100;
  const width = ((endHour - startHour) / totalHours) * 100;
  
  return {
    left: `${Math.max(0, left)}%`,
    width: `${Math.min(100 - Math.max(0, left), width)}%`,
  };
};
```

---

## Features Breakdown

### 1. **Real Technicians** ✅
- Fetched from `team_members` table
- Includes all roles (technician, lead_technician, admin)
- Shows real names, emails, avatars
- Color-coded for visual identification

### 2. **Real Jobs** ✅
- Fetched from `jobs` table
- Includes customer and property details
- Shows job number, type, status
- Scheduled start/end times

### 3. **All Team Members** ✅
- Shows **all assigned technicians** per job
- Not just the lead technician
- Lead badge for lead tech
- Team member count indicator

### 4. **Timeline Visualization** ✅
- Hour markers (8 AM - 6 PM)
- Current time indicator (blue line)
- Appointment blocks (colored by status)
- Active jobs pulse animation
- Hover tooltips

### 5. **Available Slots** ✅
- Visible as gaps in timeline
- Easy to identify open time slots
- Can see when techs are free

### 6. **Current Time Tracking** ✅
- Blue line shows current time
- Updates every minute
- Only shows if within working hours

### 7. **Active Job Highlighting** ✅
- In-progress jobs have yellow/orange color
- Pulse animation for active jobs
- Easy to spot ongoing work

---

## Loading States

### Loading Spinner
```
┌───────────────────────────────────────┐
│                                       │
│         ⟳ (spinning)                  │
│                                       │
│     Loading schedules...              │
│                                       │
└───────────────────────────────────────┘
```

### Error State
```
┌───────────────────────────────────────┐
│                                       │
│         ⚠️                            │
│                                       │
│     Failed to load schedules          │
│                                       │
│         [Retry]                       │
│                                       │
└───────────────────────────────────────┘
```

---

## Real-Time Updates

### Current Time
```typescript
// Update current time every minute
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 60000); // Update every minute

  return () => clearInterval(interval);
}, []);
```

### Timeline Indicator
- Blue line position updates automatically
- Shows current time badge
- Only visible during working hours (8 AM - 6 PM)

---

## Benefits

### 1. **Real Data** ✅
- No mock data
- Actual technicians from database
- Real jobs and appointments
- Accurate customer information

### 2. **Visual Timeline** ✅
- See entire day at a glance
- Current time indicator
- Available slots visible
- Active jobs highlighted

### 3. **Team Visibility** ✅
- All assigned technicians shown
- Lead technician identified
- Team composition clear
- Multi-tech jobs visible

### 4. **Easy Booking** ✅
- See availability while on call
- Identify open time slots
- Check tech schedules
- Book efficiently

### 5. **Real-Time Awareness** ✅
- Current time always visible
- Active jobs highlighted
- Status updates reflected
- Timeline moves in real-time

---

## Example Data Flow

### 1. Component Mounts
```
CSRScheduleView
  ↓
  companyId prop received
  ↓
  useEffect triggered
  ↓
  getTechnicianSchedules(date, companyId)
```

### 2. Server Action
```
getTechnicianSchedules
  ↓
  Fetch team_members
  ↓
  Fetch jobs with team assignments
  ↓
  Map and format data
  ↓
  Return TechnicianSchedule[]
```

### 3. Render
```
TechnicianSchedule[]
  ↓
  Map to UnifiedAccordionSection[]
  ↓
  Each section contains:
    - ScheduleTimeline
    - Appointment cards
    - Team member badges
```

---

## Status

✅ **Real database integration**  
✅ **Visual timeline with current time**  
✅ **All assigned technicians shown**  
✅ **Available time slots visible**  
✅ **Active jobs highlighted**  
✅ **2-hour windows displayed**  
✅ **Loading and error states**  
✅ **Real-time current time updates**  
✅ **Team member badges (lead/member)**  
✅ **Job numbers and details**  
✅ **Customer and property info**  
✅ **Status color coding**  
✅ **Hover tooltips on timeline**  
✅ **No linter errors**  

Schedule view now uses real data with visual timeline! 🎉


## Overview
Completely rewrote the schedule view to use **real data from the database** with a visual timeline showing current time, active jobs, and available slots for all technicians.

---

## Key Features Implemented

### 1. **Real Database Integration** ✅
- Fetches actual technicians from `team_members` table
- Retrieves real jobs from `jobs` table
- Shows all assigned team members (not just leads)
- Includes job details, customer info, and property addresses

### 2. **Visual Timeline** ✅
- Hour markers (8 AM - 6 PM)
- **Blue line showing current time**
- Colored blocks for scheduled jobs
- Active jobs highlighted with pulse animation
- Available time slots visible as gaps
- Hover tooltips with full appointment details

### 3. **Multi-Technician Support** ✅
- Shows all technicians in collapsible sections
- Each tech has their own timeline
- Color-coded avatars for quick identification
- Role badges (Technician, Lead Technician, Admin)

### 4. **Team Display** ✅
- Shows **all assigned technicians** on each job
- Lead technician highlighted with badge
- Team member count indicator
- Individual team member names

### 5. **Real-Time Updates** ✅
- Current time updates every minute
- Timeline indicator moves in real-time
- Status reflects actual job state

---

## New Files Created

### 1. **`src/actions/schedule.ts`**
Server action to fetch schedule data from database.

```typescript
export interface ScheduleAppointment {
  id: string;
  job_id: string;
  job_number: string;
  customer_name: string;
  customer_id: string;
  address: string;
  city: string;
  state: string;
  job_type: string;
  scheduled_start: string;
  scheduled_end: string;
  duration_hours: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  assigned_technicians: Array<{
    id: string;
    name: string;
    avatar_url?: string;
    is_lead: boolean;
  }>;
}

export interface TechnicianSchedule {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  color: string;
  role: string;
  appointments: ScheduleAppointment[];
  working_hours: {
    start: number; // 8 for 8 AM
    end: number;   // 18 for 6 PM
  };
}

export async function getTechnicianSchedules(date: Date, companyId: string);
```

**Fetches:**
- All team members for company
- All jobs scheduled for selected date
- Job team member assignments
- Customer and property details

---

### 2. **`src/components/call-window/schedule-timeline.tsx`**
Visual timeline component showing appointments and current time.

**Features:**
- Hour markers (8 AM - 6 PM)
- Current time indicator (blue line)
- Appointment blocks (colored by status)
- Active job pulse animation
- Team member count on appointments
- Hover tooltips
- Status legend

**Timeline Colors:**
- **Blue**: Scheduled
- **Yellow/Orange**: In Progress (pulsing)
- **Green**: Completed
- **Red**: Cancelled

---

## Updated Files

### 1. **`src/components/call-window/csr-schedule-view.tsx`**

**Major Changes:**
- Removed all mock data
- Added `companyId` prop
- Integrated `getTechnicianSchedules` action
- Added loading and error states
- Integrated `ScheduleTimeline` component
- Shows all assigned technicians per job
- Real-time current time tracking
- Timeline visualization in each collapsible

**New Props:**
```typescript
interface CSRScheduleViewProps {
  className?: string;
  companyId?: string; // Required for fetching data
}
```

**State Management:**
```typescript
const [technicians, setTechnicians] = useState<TechnicianSchedule[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [currentTime, setCurrentTime] = useState(new Date());
```

**Data Fetching:**
```typescript
useEffect(() => {
  async function fetchSchedule() {
    if (!companyId) {
      setError("No company ID provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const schedules = await getTechnicianSchedules(selectedDate, companyId);
      setTechnicians(schedules);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to load schedules");
    } finally {
      setIsLoading(false);
    }
  }

  fetchSchedule();
}, [selectedDate, companyId]);
```

---

### 2. **`src/app/call-window/page.tsx`**

**Change:**
```typescript
<CSRScheduleView companyId={companyId || undefined} />
```

Passes `companyId` to schedule view for data fetching.

---

## Visual Layout

```
┌───────────────────────────────────────────────────────┐
│ [Schedule] [Transcript]                               │
├───────────────────────────────────────────────────────┤
│ < Fri, Jan 15 >  [Today]                              │
│ 👥 3 Techs  •  5 Appointments      [Show All]        │
├───────────────────────────────────────────────────────┤
│                                                       │
│ ▼ 🔵 John Martinez (2)              [Lead Tech]      │
│                                                       │
│   ┌─────────────────────────────────────────────┐   │
│   │ TIMELINE (8 AM - 6 PM)                      │   │
│   │ ├─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐                    │   │
│   │ 8 9 10 11 12 1 2 3 4 5 6                    │   │
│   │ ├─█████─────█████─────┤                     │   │
│   │      ▲                                      │   │
│   │   [Current Time: 10:30 AM]                  │   │
│   │                                             │   │
│   │ • Scheduled  • In Progress                  │   │
│   │ • Completed  • Current Time                 │   │
│   └─────────────────────────────────────────────┘   │
│                                                       │
│   ⏰ 9:00 AM - 11:00 AM  [2h]  [Scheduled]           │
│   👤 Sarah Johnson                                    │
│   📍 123 Main St, San Francisco, CA                   │
│   [HVAC Repair] #JOB-001                             │
│   ─────────────────────────────────────────────      │
│   👥 Team: [John Martinez (Lead)] [Mike Smith]       │
│                                                       │
│   ⏰ 1:00 PM - 3:00 PM  [2h]  [In Progress]          │
│   👤 Mike Davis                                       │
│   📍 456 Oak Ave, Oakland, CA                         │
│   [Installation] #JOB-002                            │
│   ─────────────────────────────────────────────      │
│   👥 Team: [John Martinez (Lead)] [Emily Chen]       │
│                                                       │
│ ▶ 🟢 Emily Chen (1)                 [Technician]     │
│ ▶ 🟣 David Wilson (2)               [Lead Tech]      │
│                                                       │
├───────────────────────────────────────────────────────┤
│ [+ Book New Appointment]                              │
└───────────────────────────────────────────────────────┘
```

---

## Timeline Component Details

### Hour Markers
```
8a  9a  10a  11a  12p  1p  2p  3p  4p  5p  6p
├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
```

### Current Time Indicator (Blue Line)
```
        ▼
    [10:30 AM]
        │
        │ (Blue line)
        │
```

### Appointment Blocks
```
├───█████───────█████───────────┤
   9-11AM     1-3PM
  (Scheduled) (In Progress)
```

### Hover Tooltip
```
┌─────────────────────────────┐
│ Sarah Johnson               │
│ 9:00 AM to 11:00 AM         │
│ HVAC Repair                 │
└─────────────────────────────┘
```

---

## Appointment Card Details

### Full Card with Team
```
┌─────────────────────────────────────────────┐
│ ⏰ 9:00 AM - 11:00 AM  [2h]  [Scheduled]    │
│                                             │
│ 👤 Sarah Johnson                            │
│ 📍 123 Main St, San Francisco, CA           │
│ [HVAC Repair] #JOB-001                      │
│                                             │
│ ─────────────────────────────────────────── │
│ 👥 Team:                                    │
│ [John Martinez (Lead)] [Mike Smith]         │
└─────────────────────────────────────────────┘
```

### Shows:
1. **Time window** with clock icon
2. **Duration** badge (2h window)
3. **Status** badge (Scheduled/In Progress/Completed/Cancelled)
4. **Customer name** with user icon
5. **Full address** with map pin icon
6. **Job type** badge
7. **Job number** (monospace)
8. **Team section** (if multiple techs):
   - Team icon
   - All assigned technicians
   - Lead badge for lead tech

---

## Database Queries

### Technicians Query
```sql
SELECT 
  tm.user_id,
  tm.role,
  u.id,
  u.email,
  u.raw_user_meta_data
FROM team_members tm
JOIN users u ON u.id = tm.user_id
WHERE tm.company_id = $1
AND tm.role IN ('technician', 'lead_technician', 'admin')
```

### Jobs Query
```sql
SELECT 
  j.id,
  j.job_number,
  j.title,
  j.status,
  j.scheduled_start,
  j.scheduled_end,
  c.id AS customer_id,
  c.first_name,
  c.last_name,
  p.address,
  p.city,
  p.state,
  jtm.user_id,
  jtm.is_lead,
  u.id,
  u.email,
  u.raw_user_meta_data
FROM jobs j
LEFT JOIN customers c ON c.id = j.customer_id
LEFT JOIN properties p ON p.id = j.property_id
LEFT JOIN job_team_members jtm ON jtm.job_id = j.id
LEFT JOIN users u ON u.id = jtm.user_id
WHERE j.company_id = $1
AND j.scheduled_start >= $2
AND j.scheduled_start <= $3
ORDER BY j.scheduled_start
```

---

## Status Mapping

### Job Status → Appointment Status
```typescript
const statusMap = {
  "scheduled": "scheduled",
  "in_progress": "in_progress",
  "active": "in_progress",
  "completed": "completed",
  "done": "completed",
  "cancelled": "cancelled",
  "canceled": "cancelled",
};
```

### Status Colors
- **Scheduled**: Gray/Muted
- **In Progress**: Yellow/Warning (pulsing)
- **Completed**: Green/Success
- **Cancelled**: Red/Destructive

---

## Timeline Calculations

### Current Time Position (0-100%)
```typescript
const getCurrentTimePosition = (): number => {
  const now = currentTime;
  const currentHour = now.getHours() + now.getMinutes() / 60;
  
  if (currentHour < workStart) return 0;
  if (currentHour > workEnd) return 100;
  
  return ((currentHour - workStart) / totalHours) * 100;
};
```

### Appointment Position
```typescript
const getAppointmentStyle = (appointment: ScheduleAppointment) => {
  const start = new Date(appointment.scheduled_start);
  const end = new Date(appointment.scheduled_end);
  
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  
  const left = ((startHour - workStart) / totalHours) * 100;
  const width = ((endHour - startHour) / totalHours) * 100;
  
  return {
    left: `${Math.max(0, left)}%`,
    width: `${Math.min(100 - Math.max(0, left), width)}%`,
  };
};
```

---

## Features Breakdown

### 1. **Real Technicians** ✅
- Fetched from `team_members` table
- Includes all roles (technician, lead_technician, admin)
- Shows real names, emails, avatars
- Color-coded for visual identification

### 2. **Real Jobs** ✅
- Fetched from `jobs` table
- Includes customer and property details
- Shows job number, type, status
- Scheduled start/end times

### 3. **All Team Members** ✅
- Shows **all assigned technicians** per job
- Not just the lead technician
- Lead badge for lead tech
- Team member count indicator

### 4. **Timeline Visualization** ✅
- Hour markers (8 AM - 6 PM)
- Current time indicator (blue line)
- Appointment blocks (colored by status)
- Active jobs pulse animation
- Hover tooltips

### 5. **Available Slots** ✅
- Visible as gaps in timeline
- Easy to identify open time slots
- Can see when techs are free

### 6. **Current Time Tracking** ✅
- Blue line shows current time
- Updates every minute
- Only shows if within working hours

### 7. **Active Job Highlighting** ✅
- In-progress jobs have yellow/orange color
- Pulse animation for active jobs
- Easy to spot ongoing work

---

## Loading States

### Loading Spinner
```
┌───────────────────────────────────────┐
│                                       │
│         ⟳ (spinning)                  │
│                                       │
│     Loading schedules...              │
│                                       │
└───────────────────────────────────────┘
```

### Error State
```
┌───────────────────────────────────────┐
│                                       │
│         ⚠️                            │
│                                       │
│     Failed to load schedules          │
│                                       │
│         [Retry]                       │
│                                       │
└───────────────────────────────────────┘
```

---

## Real-Time Updates

### Current Time
```typescript
// Update current time every minute
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 60000); // Update every minute

  return () => clearInterval(interval);
}, []);
```

### Timeline Indicator
- Blue line position updates automatically
- Shows current time badge
- Only visible during working hours (8 AM - 6 PM)

---

## Benefits

### 1. **Real Data** ✅
- No mock data
- Actual technicians from database
- Real jobs and appointments
- Accurate customer information

### 2. **Visual Timeline** ✅
- See entire day at a glance
- Current time indicator
- Available slots visible
- Active jobs highlighted

### 3. **Team Visibility** ✅
- All assigned technicians shown
- Lead technician identified
- Team composition clear
- Multi-tech jobs visible

### 4. **Easy Booking** ✅
- See availability while on call
- Identify open time slots
- Check tech schedules
- Book efficiently

### 5. **Real-Time Awareness** ✅
- Current time always visible
- Active jobs highlighted
- Status updates reflected
- Timeline moves in real-time

---

## Example Data Flow

### 1. Component Mounts
```
CSRScheduleView
  ↓
  companyId prop received
  ↓
  useEffect triggered
  ↓
  getTechnicianSchedules(date, companyId)
```

### 2. Server Action
```
getTechnicianSchedules
  ↓
  Fetch team_members
  ↓
  Fetch jobs with team assignments
  ↓
  Map and format data
  ↓
  Return TechnicianSchedule[]
```

### 3. Render
```
TechnicianSchedule[]
  ↓
  Map to UnifiedAccordionSection[]
  ↓
  Each section contains:
    - ScheduleTimeline
    - Appointment cards
    - Team member badges
```

---

## Status

✅ **Real database integration**  
✅ **Visual timeline with current time**  
✅ **All assigned technicians shown**  
✅ **Available time slots visible**  
✅ **Active jobs highlighted**  
✅ **2-hour windows displayed**  
✅ **Loading and error states**  
✅ **Real-time current time updates**  
✅ **Team member badges (lead/member)**  
✅ **Job numbers and details**  
✅ **Customer and property info**  
✅ **Status color coding**  
✅ **Hover tooltips on timeline**  
✅ **No linter errors**  

Schedule view now uses real data with visual timeline! 🎉


## Overview
Completely rewrote the schedule view to use **real data from the database** with a visual timeline showing current time, active jobs, and available slots for all technicians.

---

## Key Features Implemented

### 1. **Real Database Integration** ✅
- Fetches actual technicians from `team_members` table
- Retrieves real jobs from `jobs` table
- Shows all assigned team members (not just leads)
- Includes job details, customer info, and property addresses

### 2. **Visual Timeline** ✅
- Hour markers (8 AM - 6 PM)
- **Blue line showing current time**
- Colored blocks for scheduled jobs
- Active jobs highlighted with pulse animation
- Available time slots visible as gaps
- Hover tooltips with full appointment details

### 3. **Multi-Technician Support** ✅
- Shows all technicians in collapsible sections
- Each tech has their own timeline
- Color-coded avatars for quick identification
- Role badges (Technician, Lead Technician, Admin)

### 4. **Team Display** ✅
- Shows **all assigned technicians** on each job
- Lead technician highlighted with badge
- Team member count indicator
- Individual team member names

### 5. **Real-Time Updates** ✅
- Current time updates every minute
- Timeline indicator moves in real-time
- Status reflects actual job state

---

## New Files Created

### 1. **`src/actions/schedule.ts`**
Server action to fetch schedule data from database.

```typescript
export interface ScheduleAppointment {
  id: string;
  job_id: string;
  job_number: string;
  customer_name: string;
  customer_id: string;
  address: string;
  city: string;
  state: string;
  job_type: string;
  scheduled_start: string;
  scheduled_end: string;
  duration_hours: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  assigned_technicians: Array<{
    id: string;
    name: string;
    avatar_url?: string;
    is_lead: boolean;
  }>;
}

export interface TechnicianSchedule {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  color: string;
  role: string;
  appointments: ScheduleAppointment[];
  working_hours: {
    start: number; // 8 for 8 AM
    end: number;   // 18 for 6 PM
  };
}

export async function getTechnicianSchedules(date: Date, companyId: string);
```

**Fetches:**
- All team members for company
- All jobs scheduled for selected date
- Job team member assignments
- Customer and property details

---

### 2. **`src/components/call-window/schedule-timeline.tsx`**
Visual timeline component showing appointments and current time.

**Features:**
- Hour markers (8 AM - 6 PM)
- Current time indicator (blue line)
- Appointment blocks (colored by status)
- Active job pulse animation
- Team member count on appointments
- Hover tooltips
- Status legend

**Timeline Colors:**
- **Blue**: Scheduled
- **Yellow/Orange**: In Progress (pulsing)
- **Green**: Completed
- **Red**: Cancelled

---

## Updated Files

### 1. **`src/components/call-window/csr-schedule-view.tsx`**

**Major Changes:**
- Removed all mock data
- Added `companyId` prop
- Integrated `getTechnicianSchedules` action
- Added loading and error states
- Integrated `ScheduleTimeline` component
- Shows all assigned technicians per job
- Real-time current time tracking
- Timeline visualization in each collapsible

**New Props:**
```typescript
interface CSRScheduleViewProps {
  className?: string;
  companyId?: string; // Required for fetching data
}
```

**State Management:**
```typescript
const [technicians, setTechnicians] = useState<TechnicianSchedule[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [currentTime, setCurrentTime] = useState(new Date());
```

**Data Fetching:**
```typescript
useEffect(() => {
  async function fetchSchedule() {
    if (!companyId) {
      setError("No company ID provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const schedules = await getTechnicianSchedules(selectedDate, companyId);
      setTechnicians(schedules);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to load schedules");
    } finally {
      setIsLoading(false);
    }
  }

  fetchSchedule();
}, [selectedDate, companyId]);
```

---

### 2. **`src/app/call-window/page.tsx`**

**Change:**
```typescript
<CSRScheduleView companyId={companyId || undefined} />
```

Passes `companyId` to schedule view for data fetching.

---

## Visual Layout

```
┌───────────────────────────────────────────────────────┐
│ [Schedule] [Transcript]                               │
├───────────────────────────────────────────────────────┤
│ < Fri, Jan 15 >  [Today]                              │
│ 👥 3 Techs  •  5 Appointments      [Show All]        │
├───────────────────────────────────────────────────────┤
│                                                       │
│ ▼ 🔵 John Martinez (2)              [Lead Tech]      │
│                                                       │
│   ┌─────────────────────────────────────────────┐   │
│   │ TIMELINE (8 AM - 6 PM)                      │   │
│   │ ├─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐                    │   │
│   │ 8 9 10 11 12 1 2 3 4 5 6                    │   │
│   │ ├─█████─────█████─────┤                     │   │
│   │      ▲                                      │   │
│   │   [Current Time: 10:30 AM]                  │   │
│   │                                             │   │
│   │ • Scheduled  • In Progress                  │   │
│   │ • Completed  • Current Time                 │   │
│   └─────────────────────────────────────────────┘   │
│                                                       │
│   ⏰ 9:00 AM - 11:00 AM  [2h]  [Scheduled]           │
│   👤 Sarah Johnson                                    │
│   📍 123 Main St, San Francisco, CA                   │
│   [HVAC Repair] #JOB-001                             │
│   ─────────────────────────────────────────────      │
│   👥 Team: [John Martinez (Lead)] [Mike Smith]       │
│                                                       │
│   ⏰ 1:00 PM - 3:00 PM  [2h]  [In Progress]          │
│   👤 Mike Davis                                       │
│   📍 456 Oak Ave, Oakland, CA                         │
│   [Installation] #JOB-002                            │
│   ─────────────────────────────────────────────      │
│   👥 Team: [John Martinez (Lead)] [Emily Chen]       │
│                                                       │
│ ▶ 🟢 Emily Chen (1)                 [Technician]     │
│ ▶ 🟣 David Wilson (2)               [Lead Tech]      │
│                                                       │
├───────────────────────────────────────────────────────┤
│ [+ Book New Appointment]                              │
└───────────────────────────────────────────────────────┘
```

---

## Timeline Component Details

### Hour Markers
```
8a  9a  10a  11a  12p  1p  2p  3p  4p  5p  6p
├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
```

### Current Time Indicator (Blue Line)
```
        ▼
    [10:30 AM]
        │
        │ (Blue line)
        │
```

### Appointment Blocks
```
├───█████───────█████───────────┤
   9-11AM     1-3PM
  (Scheduled) (In Progress)
```

### Hover Tooltip
```
┌─────────────────────────────┐
│ Sarah Johnson               │
│ 9:00 AM to 11:00 AM         │
│ HVAC Repair                 │
└─────────────────────────────┘
```

---

## Appointment Card Details

### Full Card with Team
```
┌─────────────────────────────────────────────┐
│ ⏰ 9:00 AM - 11:00 AM  [2h]  [Scheduled]    │
│                                             │
│ 👤 Sarah Johnson                            │
│ 📍 123 Main St, San Francisco, CA           │
│ [HVAC Repair] #JOB-001                      │
│                                             │
│ ─────────────────────────────────────────── │
│ 👥 Team:                                    │
│ [John Martinez (Lead)] [Mike Smith]         │
└─────────────────────────────────────────────┘
```

### Shows:
1. **Time window** with clock icon
2. **Duration** badge (2h window)
3. **Status** badge (Scheduled/In Progress/Completed/Cancelled)
4. **Customer name** with user icon
5. **Full address** with map pin icon
6. **Job type** badge
7. **Job number** (monospace)
8. **Team section** (if multiple techs):
   - Team icon
   - All assigned technicians
   - Lead badge for lead tech

---

## Database Queries

### Technicians Query
```sql
SELECT 
  tm.user_id,
  tm.role,
  u.id,
  u.email,
  u.raw_user_meta_data
FROM team_members tm
JOIN users u ON u.id = tm.user_id
WHERE tm.company_id = $1
AND tm.role IN ('technician', 'lead_technician', 'admin')
```

### Jobs Query
```sql
SELECT 
  j.id,
  j.job_number,
  j.title,
  j.status,
  j.scheduled_start,
  j.scheduled_end,
  c.id AS customer_id,
  c.first_name,
  c.last_name,
  p.address,
  p.city,
  p.state,
  jtm.user_id,
  jtm.is_lead,
  u.id,
  u.email,
  u.raw_user_meta_data
FROM jobs j
LEFT JOIN customers c ON c.id = j.customer_id
LEFT JOIN properties p ON p.id = j.property_id
LEFT JOIN job_team_members jtm ON jtm.job_id = j.id
LEFT JOIN users u ON u.id = jtm.user_id
WHERE j.company_id = $1
AND j.scheduled_start >= $2
AND j.scheduled_start <= $3
ORDER BY j.scheduled_start
```

---

## Status Mapping

### Job Status → Appointment Status
```typescript
const statusMap = {
  "scheduled": "scheduled",
  "in_progress": "in_progress",
  "active": "in_progress",
  "completed": "completed",
  "done": "completed",
  "cancelled": "cancelled",
  "canceled": "cancelled",
};
```

### Status Colors
- **Scheduled**: Gray/Muted
- **In Progress**: Yellow/Warning (pulsing)
- **Completed**: Green/Success
- **Cancelled**: Red/Destructive

---

## Timeline Calculations

### Current Time Position (0-100%)
```typescript
const getCurrentTimePosition = (): number => {
  const now = currentTime;
  const currentHour = now.getHours() + now.getMinutes() / 60;
  
  if (currentHour < workStart) return 0;
  if (currentHour > workEnd) return 100;
  
  return ((currentHour - workStart) / totalHours) * 100;
};
```

### Appointment Position
```typescript
const getAppointmentStyle = (appointment: ScheduleAppointment) => {
  const start = new Date(appointment.scheduled_start);
  const end = new Date(appointment.scheduled_end);
  
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  
  const left = ((startHour - workStart) / totalHours) * 100;
  const width = ((endHour - startHour) / totalHours) * 100;
  
  return {
    left: `${Math.max(0, left)}%`,
    width: `${Math.min(100 - Math.max(0, left), width)}%`,
  };
};
```

---

## Features Breakdown

### 1. **Real Technicians** ✅
- Fetched from `team_members` table
- Includes all roles (technician, lead_technician, admin)
- Shows real names, emails, avatars
- Color-coded for visual identification

### 2. **Real Jobs** ✅
- Fetched from `jobs` table
- Includes customer and property details
- Shows job number, type, status
- Scheduled start/end times

### 3. **All Team Members** ✅
- Shows **all assigned technicians** per job
- Not just the lead technician
- Lead badge for lead tech
- Team member count indicator

### 4. **Timeline Visualization** ✅
- Hour markers (8 AM - 6 PM)
- Current time indicator (blue line)
- Appointment blocks (colored by status)
- Active jobs pulse animation
- Hover tooltips

### 5. **Available Slots** ✅
- Visible as gaps in timeline
- Easy to identify open time slots
- Can see when techs are free

### 6. **Current Time Tracking** ✅
- Blue line shows current time
- Updates every minute
- Only shows if within working hours

### 7. **Active Job Highlighting** ✅
- In-progress jobs have yellow/orange color
- Pulse animation for active jobs
- Easy to spot ongoing work

---

## Loading States

### Loading Spinner
```
┌───────────────────────────────────────┐
│                                       │
│         ⟳ (spinning)                  │
│                                       │
│     Loading schedules...              │
│                                       │
└───────────────────────────────────────┘
```

### Error State
```
┌───────────────────────────────────────┐
│                                       │
│         ⚠️                            │
│                                       │
│     Failed to load schedules          │
│                                       │
│         [Retry]                       │
│                                       │
└───────────────────────────────────────┘
```

---

## Real-Time Updates

### Current Time
```typescript
// Update current time every minute
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 60000); // Update every minute

  return () => clearInterval(interval);
}, []);
```

### Timeline Indicator
- Blue line position updates automatically
- Shows current time badge
- Only visible during working hours (8 AM - 6 PM)

---

## Benefits

### 1. **Real Data** ✅
- No mock data
- Actual technicians from database
- Real jobs and appointments
- Accurate customer information

### 2. **Visual Timeline** ✅
- See entire day at a glance
- Current time indicator
- Available slots visible
- Active jobs highlighted

### 3. **Team Visibility** ✅
- All assigned technicians shown
- Lead technician identified
- Team composition clear
- Multi-tech jobs visible

### 4. **Easy Booking** ✅
- See availability while on call
- Identify open time slots
- Check tech schedules
- Book efficiently

### 5. **Real-Time Awareness** ✅
- Current time always visible
- Active jobs highlighted
- Status updates reflected
- Timeline moves in real-time

---

## Example Data Flow

### 1. Component Mounts
```
CSRScheduleView
  ↓
  companyId prop received
  ↓
  useEffect triggered
  ↓
  getTechnicianSchedules(date, companyId)
```

### 2. Server Action
```
getTechnicianSchedules
  ↓
  Fetch team_members
  ↓
  Fetch jobs with team assignments
  ↓
  Map and format data
  ↓
  Return TechnicianSchedule[]
```

### 3. Render
```
TechnicianSchedule[]
  ↓
  Map to UnifiedAccordionSection[]
  ↓
  Each section contains:
    - ScheduleTimeline
    - Appointment cards
    - Team member badges
```

---

## Status

✅ **Real database integration**  
✅ **Visual timeline with current time**  
✅ **All assigned technicians shown**  
✅ **Available time slots visible**  
✅ **Active jobs highlighted**  
✅ **2-hour windows displayed**  
✅ **Loading and error states**  
✅ **Real-time current time updates**  
✅ **Team member badges (lead/member)**  
✅ **Job numbers and details**  
✅ **Customer and property info**  
✅ **Status color coding**  
✅ **Hover tooltips on timeline**  
✅ **No linter errors**  

Schedule view now uses real data with visual timeline! 🎉


## Overview
Completely rewrote the schedule view to use **real data from the database** with a visual timeline showing current time, active jobs, and available slots for all technicians.

---

## Key Features Implemented

### 1. **Real Database Integration** ✅
- Fetches actual technicians from `team_members` table
- Retrieves real jobs from `jobs` table
- Shows all assigned team members (not just leads)
- Includes job details, customer info, and property addresses

### 2. **Visual Timeline** ✅
- Hour markers (8 AM - 6 PM)
- **Blue line showing current time**
- Colored blocks for scheduled jobs
- Active jobs highlighted with pulse animation
- Available time slots visible as gaps
- Hover tooltips with full appointment details

### 3. **Multi-Technician Support** ✅
- Shows all technicians in collapsible sections
- Each tech has their own timeline
- Color-coded avatars for quick identification
- Role badges (Technician, Lead Technician, Admin)

### 4. **Team Display** ✅
- Shows **all assigned technicians** on each job
- Lead technician highlighted with badge
- Team member count indicator
- Individual team member names

### 5. **Real-Time Updates** ✅
- Current time updates every minute
- Timeline indicator moves in real-time
- Status reflects actual job state

---

## New Files Created

### 1. **`src/actions/schedule.ts`**
Server action to fetch schedule data from database.

```typescript
export interface ScheduleAppointment {
  id: string;
  job_id: string;
  job_number: string;
  customer_name: string;
  customer_id: string;
  address: string;
  city: string;
  state: string;
  job_type: string;
  scheduled_start: string;
  scheduled_end: string;
  duration_hours: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  assigned_technicians: Array<{
    id: string;
    name: string;
    avatar_url?: string;
    is_lead: boolean;
  }>;
}

export interface TechnicianSchedule {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  color: string;
  role: string;
  appointments: ScheduleAppointment[];
  working_hours: {
    start: number; // 8 for 8 AM
    end: number;   // 18 for 6 PM
  };
}

export async function getTechnicianSchedules(date: Date, companyId: string);
```

**Fetches:**
- All team members for company
- All jobs scheduled for selected date
- Job team member assignments
- Customer and property details

---

### 2. **`src/components/call-window/schedule-timeline.tsx`**
Visual timeline component showing appointments and current time.

**Features:**
- Hour markers (8 AM - 6 PM)
- Current time indicator (blue line)
- Appointment blocks (colored by status)
- Active job pulse animation
- Team member count on appointments
- Hover tooltips
- Status legend

**Timeline Colors:**
- **Blue**: Scheduled
- **Yellow/Orange**: In Progress (pulsing)
- **Green**: Completed
- **Red**: Cancelled

---

## Updated Files

### 1. **`src/components/call-window/csr-schedule-view.tsx`**

**Major Changes:**
- Removed all mock data
- Added `companyId` prop
- Integrated `getTechnicianSchedules` action
- Added loading and error states
- Integrated `ScheduleTimeline` component
- Shows all assigned technicians per job
- Real-time current time tracking
- Timeline visualization in each collapsible

**New Props:**
```typescript
interface CSRScheduleViewProps {
  className?: string;
  companyId?: string; // Required for fetching data
}
```

**State Management:**
```typescript
const [technicians, setTechnicians] = useState<TechnicianSchedule[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [currentTime, setCurrentTime] = useState(new Date());
```

**Data Fetching:**
```typescript
useEffect(() => {
  async function fetchSchedule() {
    if (!companyId) {
      setError("No company ID provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const schedules = await getTechnicianSchedules(selectedDate, companyId);
      setTechnicians(schedules);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to load schedules");
    } finally {
      setIsLoading(false);
    }
  }

  fetchSchedule();
}, [selectedDate, companyId]);
```

---

### 2. **`src/app/call-window/page.tsx`**

**Change:**
```typescript
<CSRScheduleView companyId={companyId || undefined} />
```

Passes `companyId` to schedule view for data fetching.

---

## Visual Layout

```
┌───────────────────────────────────────────────────────┐
│ [Schedule] [Transcript]                               │
├───────────────────────────────────────────────────────┤
│ < Fri, Jan 15 >  [Today]                              │
│ 👥 3 Techs  •  5 Appointments      [Show All]        │
├───────────────────────────────────────────────────────┤
│                                                       │
│ ▼ 🔵 John Martinez (2)              [Lead Tech]      │
│                                                       │
│   ┌─────────────────────────────────────────────┐   │
│   │ TIMELINE (8 AM - 6 PM)                      │   │
│   │ ├─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐                    │   │
│   │ 8 9 10 11 12 1 2 3 4 5 6                    │   │
│   │ ├─█████─────█████─────┤                     │   │
│   │      ▲                                      │   │
│   │   [Current Time: 10:30 AM]                  │   │
│   │                                             │   │
│   │ • Scheduled  • In Progress                  │   │
│   │ • Completed  • Current Time                 │   │
│   └─────────────────────────────────────────────┘   │
│                                                       │
│   ⏰ 9:00 AM - 11:00 AM  [2h]  [Scheduled]           │
│   👤 Sarah Johnson                                    │
│   📍 123 Main St, San Francisco, CA                   │
│   [HVAC Repair] #JOB-001                             │
│   ─────────────────────────────────────────────      │
│   👥 Team: [John Martinez (Lead)] [Mike Smith]       │
│                                                       │
│   ⏰ 1:00 PM - 3:00 PM  [2h]  [In Progress]          │
│   👤 Mike Davis                                       │
│   📍 456 Oak Ave, Oakland, CA                         │
│   [Installation] #JOB-002                            │
│   ─────────────────────────────────────────────      │
│   👥 Team: [John Martinez (Lead)] [Emily Chen]       │
│                                                       │
│ ▶ 🟢 Emily Chen (1)                 [Technician]     │
│ ▶ 🟣 David Wilson (2)               [Lead Tech]      │
│                                                       │
├───────────────────────────────────────────────────────┤
│ [+ Book New Appointment]                              │
└───────────────────────────────────────────────────────┘
```

---

## Timeline Component Details

### Hour Markers
```
8a  9a  10a  11a  12p  1p  2p  3p  4p  5p  6p
├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
```

### Current Time Indicator (Blue Line)
```
        ▼
    [10:30 AM]
        │
        │ (Blue line)
        │
```

### Appointment Blocks
```
├───█████───────█████───────────┤
   9-11AM     1-3PM
  (Scheduled) (In Progress)
```

### Hover Tooltip
```
┌─────────────────────────────┐
│ Sarah Johnson               │
│ 9:00 AM to 11:00 AM         │
│ HVAC Repair                 │
└─────────────────────────────┘
```

---

## Appointment Card Details

### Full Card with Team
```
┌─────────────────────────────────────────────┐
│ ⏰ 9:00 AM - 11:00 AM  [2h]  [Scheduled]    │
│                                             │
│ 👤 Sarah Johnson                            │
│ 📍 123 Main St, San Francisco, CA           │
│ [HVAC Repair] #JOB-001                      │
│                                             │
│ ─────────────────────────────────────────── │
│ 👥 Team:                                    │
│ [John Martinez (Lead)] [Mike Smith]         │
└─────────────────────────────────────────────┘
```

### Shows:
1. **Time window** with clock icon
2. **Duration** badge (2h window)
3. **Status** badge (Scheduled/In Progress/Completed/Cancelled)
4. **Customer name** with user icon
5. **Full address** with map pin icon
6. **Job type** badge
7. **Job number** (monospace)
8. **Team section** (if multiple techs):
   - Team icon
   - All assigned technicians
   - Lead badge for lead tech

---

## Database Queries

### Technicians Query
```sql
SELECT 
  tm.user_id,
  tm.role,
  u.id,
  u.email,
  u.raw_user_meta_data
FROM team_members tm
JOIN users u ON u.id = tm.user_id
WHERE tm.company_id = $1
AND tm.role IN ('technician', 'lead_technician', 'admin')
```

### Jobs Query
```sql
SELECT 
  j.id,
  j.job_number,
  j.title,
  j.status,
  j.scheduled_start,
  j.scheduled_end,
  c.id AS customer_id,
  c.first_name,
  c.last_name,
  p.address,
  p.city,
  p.state,
  jtm.user_id,
  jtm.is_lead,
  u.id,
  u.email,
  u.raw_user_meta_data
FROM jobs j
LEFT JOIN customers c ON c.id = j.customer_id
LEFT JOIN properties p ON p.id = j.property_id
LEFT JOIN job_team_members jtm ON jtm.job_id = j.id
LEFT JOIN users u ON u.id = jtm.user_id
WHERE j.company_id = $1
AND j.scheduled_start >= $2
AND j.scheduled_start <= $3
ORDER BY j.scheduled_start
```

---

## Status Mapping

### Job Status → Appointment Status
```typescript
const statusMap = {
  "scheduled": "scheduled",
  "in_progress": "in_progress",
  "active": "in_progress",
  "completed": "completed",
  "done": "completed",
  "cancelled": "cancelled",
  "canceled": "cancelled",
};
```

### Status Colors
- **Scheduled**: Gray/Muted
- **In Progress**: Yellow/Warning (pulsing)
- **Completed**: Green/Success
- **Cancelled**: Red/Destructive

---

## Timeline Calculations

### Current Time Position (0-100%)
```typescript
const getCurrentTimePosition = (): number => {
  const now = currentTime;
  const currentHour = now.getHours() + now.getMinutes() / 60;
  
  if (currentHour < workStart) return 0;
  if (currentHour > workEnd) return 100;
  
  return ((currentHour - workStart) / totalHours) * 100;
};
```

### Appointment Position
```typescript
const getAppointmentStyle = (appointment: ScheduleAppointment) => {
  const start = new Date(appointment.scheduled_start);
  const end = new Date(appointment.scheduled_end);
  
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  
  const left = ((startHour - workStart) / totalHours) * 100;
  const width = ((endHour - startHour) / totalHours) * 100;
  
  return {
    left: `${Math.max(0, left)}%`,
    width: `${Math.min(100 - Math.max(0, left), width)}%`,
  };
};
```

---

## Features Breakdown

### 1. **Real Technicians** ✅
- Fetched from `team_members` table
- Includes all roles (technician, lead_technician, admin)
- Shows real names, emails, avatars
- Color-coded for visual identification

### 2. **Real Jobs** ✅
- Fetched from `jobs` table
- Includes customer and property details
- Shows job number, type, status
- Scheduled start/end times

### 3. **All Team Members** ✅
- Shows **all assigned technicians** per job
- Not just the lead technician
- Lead badge for lead tech
- Team member count indicator

### 4. **Timeline Visualization** ✅
- Hour markers (8 AM - 6 PM)
- Current time indicator (blue line)
- Appointment blocks (colored by status)
- Active jobs pulse animation
- Hover tooltips

### 5. **Available Slots** ✅
- Visible as gaps in timeline
- Easy to identify open time slots
- Can see when techs are free

### 6. **Current Time Tracking** ✅
- Blue line shows current time
- Updates every minute
- Only shows if within working hours

### 7. **Active Job Highlighting** ✅
- In-progress jobs have yellow/orange color
- Pulse animation for active jobs
- Easy to spot ongoing work

---

## Loading States

### Loading Spinner
```
┌───────────────────────────────────────┐
│                                       │
│         ⟳ (spinning)                  │
│                                       │
│     Loading schedules...              │
│                                       │
└───────────────────────────────────────┘
```

### Error State
```
┌───────────────────────────────────────┐
│                                       │
│         ⚠️                            │
│                                       │
│     Failed to load schedules          │
│                                       │
│         [Retry]                       │
│                                       │
└───────────────────────────────────────┘
```

---

## Real-Time Updates

### Current Time
```typescript
// Update current time every minute
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 60000); // Update every minute

  return () => clearInterval(interval);
}, []);
```

### Timeline Indicator
- Blue line position updates automatically
- Shows current time badge
- Only visible during working hours (8 AM - 6 PM)

---

## Benefits

### 1. **Real Data** ✅
- No mock data
- Actual technicians from database
- Real jobs and appointments
- Accurate customer information

### 2. **Visual Timeline** ✅
- See entire day at a glance
- Current time indicator
- Available slots visible
- Active jobs highlighted

### 3. **Team Visibility** ✅
- All assigned technicians shown
- Lead technician identified
- Team composition clear
- Multi-tech jobs visible

### 4. **Easy Booking** ✅
- See availability while on call
- Identify open time slots
- Check tech schedules
- Book efficiently

### 5. **Real-Time Awareness** ✅
- Current time always visible
- Active jobs highlighted
- Status updates reflected
- Timeline moves in real-time

---

## Example Data Flow

### 1. Component Mounts
```
CSRScheduleView
  ↓
  companyId prop received
  ↓
  useEffect triggered
  ↓
  getTechnicianSchedules(date, companyId)
```

### 2. Server Action
```
getTechnicianSchedules
  ↓
  Fetch team_members
  ↓
  Fetch jobs with team assignments
  ↓
  Map and format data
  ↓
  Return TechnicianSchedule[]
```

### 3. Render
```
TechnicianSchedule[]
  ↓
  Map to UnifiedAccordionSection[]
  ↓
  Each section contains:
    - ScheduleTimeline
    - Appointment cards
    - Team member badges
```

---

## Status

✅ **Real database integration**  
✅ **Visual timeline with current time**  
✅ **All assigned technicians shown**  
✅ **Available time slots visible**  
✅ **Active jobs highlighted**  
✅ **2-hour windows displayed**  
✅ **Loading and error states**  
✅ **Real-time current time updates**  
✅ **Team member badges (lead/member)**  
✅ **Job numbers and details**  
✅ **Customer and property info**  
✅ **Status color coding**  
✅ **Hover tooltips on timeline**  
✅ **No linter errors**  

Schedule view now uses real data with visual timeline! 🎉

