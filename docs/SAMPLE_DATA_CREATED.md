# Sample Appointments with Nested Data

**Created on**: 2024-11-18

## Summary

Created 3 appointments for the "Kitchen Sink Repair" job with team members and equipment assignments to demonstrate the new expandable row visualization pattern.

## Database Changes

### New Tables Created

1. **`appointment_team_assignments`** - Junction table linking appointments to team members
   - Fields: appointment_id, team_member_id, role, assigned_by, notes
   - RLS policies: Company-scoped access
   - Unique constraint: (appointment_id, team_member_id)

2. **`appointment_equipment`** - Junction table linking appointments to equipment
   - Fields: appointment_id, equipment_id, added_by, notes
   - RLS policies: Company-scoped access
   - Unique constraint: (appointment_id, equipment_id)

## Sample Data Created

### Job Context
- **Job**: Kitchen Sink Repair (ID: `8f9c77ea-311f-42de-b6cd-8091a0aabf32`)
- **Customer**: Ronald Miller
- **Property**: Associated property

### Appointment 1: Initial Sink Inspection
- **Date**: Dec 20, 2024 @ 9:00 AM - 10:00 AM
- **Status**: Scheduled
- **Type**: Inspection
- **Assigned To**: Byron Wade
- **Team Members** (2):
  - Byron Wade (Lead)
  - Alex Rivera (Assistant)
- **Equipment** (1):
  - Lennox furnace #SN-828282523
- **Notes**: "Check under-sink plumbing for leaks. May need parts."
- **Access**: "Gate code: 5678. Dog friendly, just knock."

### Appointment 2: Sink Repair & Installation
- **Date**: Dec 21, 2024 @ 1:00 PM - 4:00 PM (3 hours)
- **Status**: Scheduled
- **Type**: Repair
- **Assigned To**: Alex Rivera
- **Team Members** (3):
  - Alex Rivera (Lead)
  - Brooke Chen (Technician)
  - Carter James (Technician)
- **Equipment** (3):
  - York air_conditioner #SN-636491333 - P-trap replacement
  - Goodman hvac #SN-363990751 - Drain assembly installation
  - Rheem hvac #SN-482848195 - Garbage disposal check
- **Notes**: "Bring new P-trap, drain assembly, and plumbers putty"
- **Access**: "Park in driveway. Use side door entrance."

### Appointment 3: Follow-up Inspection
- **Date**: Dec 22, 2024 @ 10:00 AM - 10:30 AM (30 min)
- **Status**: Scheduled
- **Type**: Follow-up
- **Assigned To**: Brooke Chen
- **Team Members** (1):
  - Brooke Chen (Lead)
- **Equipment** (1):
  - Rheem water_heater #SN-225599961 - Final leak check
- **Notes**: "Quick check - just test water flow and look for drips"
- **Access**: "Same access as before. Gate code: 5678."

## How to View the Data

1. Navigate to the job details page:
   ```
   /dashboard/work/8f9c77ea-311f-42de-b6cd-8091a0aabf32
   ```

2. Open the "Appointments" accordion section

3. You'll see the expandable rows:
   - **Collapsed**: Shows summary (date, title, status, team count badges)
   - **Expanded**: Shows full details (team members, equipment, notes, time tracking)

## Expected UI Behavior

### Collapsed Row View
```
▶ Dec 20, 2024  |  Initial Sink Inspection  |  Byron Wade  |  [2👥] [1🔧]
▶ Dec 21, 2024  |  Sink Repair & Installation  |  Alex Rivera  |  [3👥] [3🔧]
▶ Dec 22, 2024  |  Follow-up Inspection  |  Brooke Chen  |  [1👥] [1🔧]
```

### Expanded Row View (Example: Appointment 2)
```
▼ Dec 21, 2024  |  Sink Repair & Installation  |  Alex Rivera  |  [3👥] [3🔧]
├─────────────────────────────────────────────────────────────────
│ 👥 Team Members (3)
│ ┌────────────────────────────────────────────────────────────┐
│ │ Alex Rivera - Lead                                         │
│ │ Brooke Chen - Technician                                   │
│ │ Carter James - Technician                                  │
│ └────────────────────────────────────────────────────────────┘
│
│ 🔧 Equipment (3)
│ ┌────────────────────────────────────────────────────────────┐
│ │ York air_conditioner #SN-636491333                         │
│ │ P-trap replacement                                         │
│ │                                                             │
│ │ Goodman hvac #SN-363990751                                 │
│ │ Drain assembly installation                                │
│ │                                                             │
│ │ Rheem hvac #SN-482848195                                   │
│ │ Garbage disposal check                                     │
│ └────────────────────────────────────────────────────────────┘
│
│ 📝 Notes & Instructions
│ Internal: Bring new P-trap, drain assembly, and plumbers putty
│ Access: Park in driveway. Use side door entrance.
└─────────────────────────────────────────────────────────────────
```

## Features Demonstrated

✅ **Multiple Team Members** - Shows how to assign 1-3 team members to appointments
✅ **Team Member Roles** - Lead, Assistant, Technician roles displayed
✅ **Equipment Tracking** - Multiple equipment items per appointment
✅ **Equipment Notes** - Specific notes for each equipment item
✅ **Access Instructions** - Customer-specific access details
✅ **Internal Notes** - Team-facing notes and instructions
✅ **Expandable UI** - Clean collapsed view, detailed expanded view
✅ **Badge Indicators** - Quick visual count of team members and equipment

## Database Queries

### Fetch Appointment with Nested Data
```typescript
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

This query returns all nested data in a single request, perfect for the expandable row pattern.

## Next Steps

You can extend this pattern to:
1. **Invoices** - Show line items, payments, documents when expanded
2. **Estimates** - Show estimate options, line items, approval status
3. **Equipment** - Show service history, parts replaced, warranties
4. **Contracts** - Show milestones, documents, signatures

See `/docs/NESTED_DATA_VISUALIZATION.md` for the complete implementation guide.
