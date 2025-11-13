# Stratos VoIP System - Quick Reference Guide

## What Exists (Ready to Use)

### Components (16 total in `/src/components/telnyx/`)
- Call Routing Rules Manager
- Business Hours Calendar Editor  
- IVR Menu Builder
- Voicemail Settings (greeting, notifications, transcription)
- Phone Number Management (purchase, release)
- Number Porting Wizard
- Usage Analytics & Billing Tracking
- Voicemail Audio Player

### Settings Pages (13 total)
- Phone & Voice Settings (main hub)
- Call Routing Configuration
- Voicemail Settings
- Business Hours Setup
- IVR Menu Management
- Usage Analytics
- Email, SMS, Notifications, Porting Status

### Database Tables (Complete)
1. **phone_numbers** - Company phone numbers with usage tracking
2. **call_routing_rules** - Routing configuration (direct, round_robin, ivr, business_hours)
3. **voicemails** - Voicemail storage with transcription
4. **ivr_menus** - IVR menu structures
5. **team_availability** - Team member status (available, busy, away, do_not_disturb, offline)
6. **communication_phone_settings** - Company-wide phone settings
7. **communications** (extended) - Call tracking fields

### Telnyx Integration
- ✅ Authenticated API client
- ✅ Call control (answer, hangup, transfer, recording, mute, hold)
- ✅ Phone number operations (search, purchase, release)
- ✅ SMS/MMS infrastructure
- ✅ Webhook signature verification & processing
- ✅ WebRTC for browser-based calling

---

## What's Missing (Need to Build)

### 🔴 HIGH PRIORITY - Phase 1
1. **Team Member Extensions**
   - Add `phone_extension` and `direct_inward_dial` fields to users table
   - Extension assignment UI in team member profiles
   - **Impact**: Required for any direct dialing or transfer system
   - **Effort**: 2-3 hours

2. **Vacation/Holiday Mode**
   - Extend team_availability with vacation date range fields
   - Vacation settings UI (date range, auto-reply, forwarding)
   - Filter out on-vacation members from routing
   - **Impact**: Team management, availability planning
   - **Effort**: 3-4 hours

3. **Round-Robin Logic**
   - Implement actual distribution algorithm
   - Track current_index in routing rules
   - Handle unavailable members
   - **Impact**: Core routing functionality
   - **Effort**: 3-4 hours

### 🟡 MEDIUM PRIORITY - Phase 2
4. **Call Queue Management**
   - Queue depth tracking
   - Position announcements
   - Abandonment tracking
   - Estimated wait time

5. **Call History & Analytics**
   - Call log table with all events
   - Analytics dashboard (volume, missed calls, duration, cost)
   - Team member performance metrics

6. **Business Hours Routing**
   - Timezone-aware current time checking
   - Route based on business hours status
   - After-hours fallback handling

7. **Extension Transfers**
   - Direct transfer to extension during call
   - Extension directory component
   - IVR to extension mapping

### 🔵 LOWER PRIORITY - Phase 3
8. **Skill-Based Routing**
   - Skills table for technicians
   - Job-to-skills matcher
   - Competency tracking with expiry

9. **Call Recording Storage**
   - Supabase Storage integration
   - Access control & download audit
   - Retention policy automation

10. **IVR Execution Engine**
    - DTMF detection & routing
    - Greeting playback
    - Voicemail fallback

11. **SMS/MMS Integration**
    - Inbound SMS routing
    - SMS templates
    - Two-way messaging persistence

---

## Quick Implementation Path (2-3 weeks)

### Week 1: Foundation
- Day 1-2: Add extension fields to users + team member UI
- Day 3-4: Add vacation mode to team_availability + UI
- Day 5: Implement round-robin routing logic

### Week 2: Core Functionality  
- Day 1-2: Build extension dialing & transfer
- Day 3-4: Implement business hours routing
- Day 5: Add call history tracking table

### Week 3: Polish
- Day 1-2: Basic call analytics dashboard
- Day 3: Call queue management (position, wait time)
- Day 4-5: Testing & refinement

---

## Key Tables & Fields Reference

### users Table (needs additions)
```
ADD: phone_extension VARCHAR(10)
ADD: direct_inward_dial VARCHAR(20)  
ADD: telnyx_endpoint_id TEXT
```

### team_availability Table (needs additions)
```
ADD: vacation_mode BOOLEAN
ADD: vacation_start_date DATE
ADD: vacation_end_date DATE
ADD: vacation_auto_reply TEXT
ADD: vacation_forward_to UUID (FK to users)
```

### call_routing_rules Table (key fields)
```
- routing_type: direct | round_robin | ivr | business_hours | conditional
- team_members: UUID[] (array of user IDs to route to)
- current_index: INTEGER (for round-robin tracking)
- ring_timeout: INTEGER (seconds)
- business_hours: JSONB (day -> time ranges)
- enable_voicemail: BOOLEAN
- record_calls: BOOLEAN
```

---

## Where to Make Changes

### For Extensions:
1. Migration: Add fields to users table
2. Component: `/src/components/settings/team/[id]/page.tsx` → add extension input
3. Action: Update team member save action

### For Vacation Mode:
1. Migration: Extend team_availability table
2. Component: Create `/src/components/team-availability/vacation-settings.tsx`
3. Action: Create `setVacationMode()` server action

### For Round-Robin Routing:
1. Action: Create `/src/actions/routing/round-robin.ts` with distribution logic
2. Webhook: Update `/src/app/api/webhooks/telnyx/route.ts` to use routing logic
3. Update: call_routing_rules current_index in real-time

### For Call History:
1. Migration: Create call_logs table
2. Webhook: Update all call events to log to call_logs
3. Component: Create `/src/components/telnyx/call-history.tsx`

---

## Testing Checklist

- [ ] Extensions can be assigned to team members
- [ ] Extensions appear in directory
- [ ] Vacation mode blocks calls to that team member
- [ ] Round-robin distributes calls fairly
- [ ] Business hours correctly determine current status
- [ ] Calls route to fallback after hours
- [ ] Call history logs all events
- [ ] Voicemail notifications work
- [ ] Call recordings save to storage
- [ ] IVR options route correctly

---

## Environment Variables (Already Set)
```
TELNYX_API_KEY
TELNYX_WEBHOOK_SECRET
TELNYX_PUBLIC_KEY
NEXT_PUBLIC_TELNYX_CONNECTION_ID
```

---

## Support Files
- Full analysis: `VOIP_IMPLEMENTATION_ANALYSIS.md`
- This guide: `VOIP_QUICK_REFERENCE.md`

