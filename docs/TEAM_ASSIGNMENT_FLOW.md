# Team Member Assignment Flow

**Flexible team management for jobs and appointments**

## Overview

Team members can be managed at **two levels**:
1. **Job-level** - Overall team responsible for the job (planning, oversight, available)
2. **Appointment-level** - Specific team members scheduled for each appointment

This provides flexibility for field management while suggesting the right team members.

## How It Works

### Job-Level Team Assignments

**Primary Location**: Job Details Page → "Team Members" accordion section

**Purpose**: Define the team responsible for this job overall
- Project oversight
- Planning and coordination
- Available resources
- Suggested when creating appointments

When you add a team member to a job:
1. ✅ They are assigned to the job
2. 💡 They are **suggested** when creating new appointments
3. ✅ You can still assign anyone to appointments (not restricted)

When you remove a team member from a job:
1. ❌ They are removed from the job
2. ℹ️ They remain on any appointments they're already scheduled for
3. 💡 They won't be suggested for new appointments

### Appointment-Level Assignments

**Location**: Job Details Page → "Appointments" accordion section → Expandable rows

Each appointment can have its own team:
- Assign specific team members to specific appointments
- **Suggested members**: Job-level team members appear first
- **Flexible**: Can assign anyone, not limited to job-level team
- **Independent**: Removing from job doesn't affect existing appointments

**Use Cases**:
- Different crew for different phases of work
- Specialist only needed for specific appointments
- Schedule changes (substitute team member)
- Multi-day jobs with rotating crews

## Visual Design

### Team Members Section

```
┌─────────────────────────────────────────────────────────────────┐
│ 👥 Team Members                                              3  │
│                                                                 │
│ Team members assigned to this job are automatically added to   │
│ all appointments                                                │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ 👤 Byron Wade                                            │   │
│ │    Lead Technician                          [PRIMARY]    │ × │
│ ├─────────────────────────────────────────────────────────┤   │
│ │ 👤 Alex Rivera                                           │   │
│ │    Plumber                                    [CREW]     │ × │
│ ├─────────────────────────────────────────────────────────┤   │
│ │ 👤 Brooke Chen                                           │   │
│ │    Apprentice                             [ASSISTANT]    │ × │
│ └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                                            [+ Add Member]      │
└─────────────────────────────────────────────────────────────────┘
```

### Appointments Section (Shows Team Members)

```
┌─────────────────────────────────────────────────────────────────┐
│ ▶ Dec 20, 2024  |  Initial Sink Inspection  |  Byron Wade      │
│   [2👥] [1🔧]                                                   │
├─────────────────────────────────────────────────────────────────┤
│ ▼ Dec 21, 2024  |  Sink Repair & Installation  |  Alex Rivera  │
│   [3👥] [3🔧]                                                   │
│                                                                 │
│   👥 Team Members (3)                                           │
│   ┌───────────────────────────────────────────────────────┐   │
│   │ Byron Wade - Primary                                  │   │
│   │ Alex Rivera - Crew                                    │   │
│   │ Brooke Chen - Assistant                               │   │
│   └───────────────────────────────────────────────────────┘   │
│                                                                 │
│   🔧 Equipment (3)                                              │
│   ...                                                           │
└─────────────────────────────────────────────────────────────────┘
```

## Benefits

### For Users
- ✅ **Flexible scheduling** - Different crews for different appointments
- ✅ **Smart suggestions** - Job-level team suggested when creating appointments
- ✅ **No restrictions** - Can assign anyone to appointments
- ✅ **Real-world scenarios** - Handles substitutions, specialists, rotating crews
- ✅ **Clear separation** - Job team = responsible, Appointment team = scheduled

### For Field Management
- 📋 **Planning**: Job-level team shows who's responsible overall
- 📅 **Scheduling**: Appointment-level shows who's actually going on-site
- 🔄 **Flexibility**: Handle last-minute changes without affecting job team
- 👥 **Visibility**: See both "who should work on this" and "who is working on this"

## Implementation Details

### Database Tables

**`job_team_assignments`** - Primary table for job-level team assignments
- `job_id` → `team_member_id` (many-to-many)
- Roles: `primary`, `supervisor`, `assistant`, `crew`
- Soft delete support (`removed_at`, `removed_by`)

**`appointment_team_assignments`** - Auto-populated from job assignments
- `appointment_id` → `team_member_id` (many-to-many)
- Role inherited from job assignment
- Automatically managed by server actions

### Server Actions

#### `assignTeamMemberToJob()`

```typescript
// /src/actions/team-assignments.ts
export async function assignTeamMemberToJob(
  input: { jobId: string; teamMemberId: string; role: string }
): Promise<ActionResult<{ id: string }>>
```

**What it does:**
1. Validates job and team member belong to company
2. Creates/updates `job_team_assignments` record
3. Revalidates paths
4. **Does NOT auto-assign to appointments** (suggestion system instead)

**Usage:**
```typescript
const result = await assignTeamMemberToJob({
  jobId: "job-uuid",
  teamMemberId: "member-uuid",
  role: "crew",
});

if (result.success) {
  // Team member now on job (will be suggested for appointments)
  router.refresh();
}
```

#### `removeTeamMemberFromJob()`

```typescript
// /src/actions/team-assignments.ts
export async function removeTeamMemberFromJob(
  input: { jobId: string; teamMemberId: string }
): Promise<ActionResult<void>>
```

**What it does:**
1. Soft deletes `job_team_assignments` record
2. Revalidates paths
3. **Does NOT remove from appointments** (they remain scheduled)

**Usage:**
```typescript
const result = await removeTeamMemberFromJob({
  jobId: "job-uuid",
  teamMemberId: "member-uuid",
});

if (result.success) {
  // Team member removed from job (still on any scheduled appointments)
  router.refresh();
}
```

### Components

#### `JobTeamMembersSection`

**Location**: `/src/components/work/job-details/job-team-members-section.tsx`

**Props:**
```typescript
type JobTeamMembersSectionProps = {
  jobId: string;
  teamAssignments: TeamMemberAssignment[];
  onAddMember: () => void;
  onRemoveMember: (memberId: string) => void;
};
```

**Features:**
- Card-based layout with clear description
- Info tooltip explaining auto-assignment behavior
- Role badges with color coding
- Empty state with call-to-action
- Remove button with confirmation

#### `JobAppointmentsExpandable`

**Location**: `/src/components/work/job-details/job-appointments-expandable.tsx`

**Features:**
- Shows team members in expanded view
- Read-only display (managed at job level)
- Badge indicators for team count `[3👥]`

## User Workflow

### Adding a Team Member to a Job

1. Navigate to job details page
2. Open "Team Members" accordion section
3. Click "Add Team Member" button
4. Select team member and role from dialog *(TODO)*
5. Team member appears on job AND all appointments

### Removing a Team Member from a Job

1. Navigate to job details page
2. Open "Team Members" accordion section
3. Click the × button next to team member
4. Confirm removal
5. Team member removed from job AND all appointments

### Viewing Team Members on an Appointment

1. Navigate to job details page
2. Open "Appointments" accordion section
3. Click to expand an appointment row
4. View "Team Members" subsection
5. See all team members automatically assigned from job

## Future Enhancements

### Phase 2 (Coming Soon)
- [ ] Team member selector dialog (replacing toast.info)
- [ ] Bulk assignment UI
- [ ] Role management inline editing
- [ ] Appointment-specific overrides (if needed)

### Phase 3 (Planned)
- [ ] Team availability checking
- [ ] Conflict detection (double-booking)
- [ ] Skill matching suggestions
- [ ] Workload balancing view

## Migration Notes

### Before (Confusing)
- Team members could be assigned at job level OR appointment level
- No sync between job and appointments
- Users had to manually add to each appointment
- Inconsistent data (team member on appointment but not job)

### After (Clear)
- Team members assigned at job level only
- Automatic sync to all appointments
- Single action updates everything
- Consistent data guaranteed

## Questions & Answers

**Q: Can I assign different team members to different appointments?**
A: Yes! Job-level assignments are for planning/oversight, but you can assign anyone to specific appointments.

**Q: What happens when I add a team member to the job?**
A: They're added to the job-level team and will be suggested when creating new appointments. They are NOT automatically added to existing appointments.

**Q: Can I see which appointments a team member is assigned to?**
A: Yes, open the "Appointments" accordion and expand each row to see team members.

**Q: What if I remove a team member from the job after appointments are created?**
A: They're removed from the job-level team but remain on any appointments they're already scheduled for.

**Q: Can I assign someone to an appointment who's not on the job-level team?**
A: Yes! You can assign anyone to appointments. Job-level team members are just suggested first for convenience.

**Q: Should every appointment have team members assigned?**
A: It depends on your workflow. You might have appointments for inspection/planning that don't need specific team assignments yet.

## Related Documentation

- `/docs/SAMPLE_DATA_CREATED.md` - Sample appointments with team assignments
- `/docs/NESTED_DATA_VISUALIZATION.md` - Expandable row pattern for appointments
- `/src/lib/stores/README.md` - State management patterns
- `/docs/AGENTS.md` - Complete linting rules

---

**Version**: 1.0
**Last Updated**: 2025-11-18
**Author**: Claude Code
