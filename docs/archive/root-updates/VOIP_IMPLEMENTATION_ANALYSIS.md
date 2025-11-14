# Thorbis VoIP & Telnyx Implementation Analysis

## Executive Summary

The Thorbis platform has a **comprehensive Telnyx VoIP integration** with 16 UI components and a complete database schema for managing phone numbers, call routing, voicemail, and IVR menus. However, the implementation is **mostly UI-focused** with several critical gaps in team member extensions, vacation/DND modes, and full integration testing.

---

## 1. EXISTING TELNYX COMPONENTS

### A. Component Inventory (16 components in `/src/components/telnyx/`)

#### Call Management & Routing
- **`call-routing-rules-list.tsx`** (7.2 KB) - Server component displaying all routing rules with status, type, priority
- **`call-routing-rule-actions.tsx`** (6.2 KB) - Actions dropdown for managing individual rules
- **`business-hours-editor.tsx`** (16.7 KB) - Interactive visual calendar editor for business hours with timezone support
- **`ivr-menu-builder.tsx`** (26.6 KB) - Drag-and-drop IVR menu builder with keypress configuration

#### Phone Number Management
- **`phone-numbers-list.tsx`** (8.2 KB) - Displays company phone numbers with usage stats
- **`phone-numbers-toolbar.tsx`** (3.8 KB) - Actions toolbar for phone number operations
- **`phone-number-search-modal.tsx`** (10.1 KB) - Modal dialog to search available numbers from Telnyx

#### Voicemail
- **`voicemail-settings.tsx`** (21.7 KB) - Comprehensive voicemail configuration:
  - Greeting type selection (default/TTS/audio file)
  - Email & SMS notifications
  - Transcription settings
  - PIN protection
  - Max message length & storage
  
- **`voicemail-player.tsx`** (11.4 KB) - Audio playback for voicemail messages

#### Number Porting
- **`number-porting-wizard.tsx`** (37.3 KB) - Multi-step wizard for porting existing numbers
- **`porting-status-dashboard.tsx`** (18.8 KB) - Displays porting order status and details

#### Analytics & Billing
- **`usage-metrics-cards.tsx`** (2.7 KB) - Summary cards showing call/SMS usage
- **`usage-trends-chart.tsx`** (7.5 KB) - Historical usage graphs
- **`cost-breakdown-table.tsx`** (5.8 KB) - Billing breakdown by phone number
- **`budget-alerts-panel.tsx`** (3.6 KB) - Cost alert configuration
- **`export-usage-button.tsx`** (4.5 KB) - Export usage reports

---

## 2. SETTINGS PAGES

### Communications Settings Pages (13 pages)
Located at `/src/app/(dashboard)/dashboard/settings/communications/`

1. **`communications/page.tsx`** - Main communications hub (navigation)
2. **`communications/phone/page.tsx`** - Phone & Voice Settings (primary settings page)
3. **`communications/phone-numbers/page.tsx`** - Manage company phone numbers
4. **`communications/call-routing/page.tsx`** - Call routing rules & business hours
5. **`communications/voicemail/page.tsx`** - Voicemail configuration
6. **`communications/email/page.tsx`** - Email settings (SMTP)
7. **`communications/email-templates/page.tsx`** - Email template management
8. **`communications/sms/page.tsx`** - SMS settings
9. **`communications/notifications/page.tsx`** - Notification preferences
10. **`communications/ivr-menus/page.tsx`** - IVR menu management
11. **`communications/usage/page.tsx`** - Usage analytics
12. **`communications/porting-status/page.tsx`** - Number porting status
13. **`communications/templates/page.tsx`** - Communication templates

### Primary Settings Page Structure (`phone/page.tsx`)
- Business phone number configuration
- Call recording settings with disclosure requirements
- Voicemail enable/disable with custom greeting
- After-hours call forwarding
- Routing strategy selection (round_robin, skills_based, priority, simultaneous)
- Business hours configuration

---

## 3. DATABASE SCHEMA

### A. Core Telnyx Tables (5 main tables + extensions)

#### 1. **phone_numbers** Table
```sql
Columns:
- id (UUID, primary key)
- company_id (FK to companies)
- telnyx_phone_number_id (TEXT, unique)
- telnyx_connection_id (TEXT)
- phone_number (TEXT)
- formatted_number (TEXT)
- country_code (TEXT, default 'US')
- area_code (TEXT)
- number_type (TEXT): local, toll-free, mobile, national, shared_cost
- features (JSONB array): voice, sms, fax, mms
- status (TEXT): active, pending, suspended, porting, deleted
- call_routing_rule_id (FK to call_routing_rules)
- forward_to_number (TEXT)
- voicemail_enabled (BOOLEAN)
- voicemail_greeting_url (TEXT)
- incoming_calls_count (INTEGER)
- outgoing_calls_count (INTEGER)
- sms_sent_count (INTEGER)
- sms_received_count (INTEGER)
- monthly_cost (DECIMAL)
- setup_cost (DECIMAL)
- billing_group_id (TEXT)
- customer_reference (TEXT)
- tags (TEXT array)
- metadata (JSONB)
- ported_from (TEXT)
- ported_at (TIMESTAMP)
- created_at, updated_at, deleted_at (TIMESTAMP)
- deleted_by (FK to users)

Indexes: company_id, telnyx_id, phone_number, status, country_code
```

#### 2. **call_routing_rules** Table
```sql
Columns:
- id (UUID, primary key)
- company_id (FK to companies)
- name (TEXT)
- description (TEXT)
- priority (INTEGER, 0+)
- routing_type (TEXT): direct, round_robin, ivr, business_hours, conditional
- business_hours (JSONB): { "monday": [...], "tuesday": [...], ... }
- timezone (TEXT, default 'America/Los_Angeles')
- after_hours_action (TEXT): voicemail, forward, hangup
- after_hours_forward_to (TEXT)
- team_members (UUID array) ** KEY FIELD - stores array of user IDs **
- current_index (INTEGER) ** For round-robin tracking **
- ring_timeout (INTEGER, seconds)
- ivr_menu (JSONB)
- ivr_greeting_url (TEXT)
- ivr_invalid_retry_count (INTEGER)
- ivr_timeout (INTEGER, seconds)
- forward_to_number (TEXT)
- forward_to_user_id (FK to users)
- conditions (JSONB) ** For conditional routing **
- enable_voicemail (BOOLEAN)
- voicemail_greeting_url (TEXT)
- voicemail_transcription_enabled (BOOLEAN)
- voicemail_email_notifications (BOOLEAN)
- voicemail_sms_notifications (BOOLEAN)
- voicemail_notification_recipients (UUID array)
- record_calls (BOOLEAN)
- recording_channels (TEXT): single, dual
- is_active (BOOLEAN)
- created_at, updated_at, deleted_at (TIMESTAMP)
- deleted_by, created_by (FK to users)

Indexes: company_id, priority (DESC when active), routing_type
```

#### 3. **voicemails** Table
```sql
Columns:
- id (UUID, primary key)
- company_id (FK to companies)
- communication_id (FK to communications)
- phone_number_id (FK to phone_numbers)
- customer_id (FK to customers)
- from_number (TEXT)
- to_number (TEXT)
- duration (INTEGER, seconds)
- audio_url (TEXT) ** Supabase Storage or Telnyx URL **
- audio_format (TEXT, default 'mp3')
- transcription (TEXT)
- transcription_confidence (DECIMAL 0.00-1.00)
- telnyx_call_control_id (TEXT)
- telnyx_recording_id (TEXT)
- is_read (BOOLEAN)
- is_urgent (BOOLEAN)
- notification_sent_at (TIMESTAMP)
- email_sent (BOOLEAN)
- sms_sent (BOOLEAN)
- metadata (JSONB)
- received_at (TIMESTAMP)
- read_at (TIMESTAMP)
- read_by (FK to users)
- created_at, updated_at, deleted_at (TIMESTAMP)
- deleted_by (FK to users)

Indexes: company_id, customer_id, phone_number_id, is_read, received_at DESC
```

#### 4. **ivr_menus** Table
```sql
Columns:
- id (UUID, primary key)
- company_id (FK to companies)
- call_routing_rule_id (FK to call_routing_rules)
- name (TEXT)
- description (TEXT)
- greeting_text (TEXT)
- greeting_audio_url (TEXT)
- use_text_to_speech (BOOLEAN)
- voice (TEXT): male, female
- language (TEXT, default 'en-US')
- options (JSONB array) ** Menu item configuration **
- max_retries (INTEGER)
- retry_message (TEXT)
- invalid_option_message (TEXT)
- timeout_seconds (INTEGER)
- timeout_action (TEXT): repeat, voicemail, hangup, transfer
- parent_menu_id (FK to ivr_menus) ** For nested IVRs **
- is_active (BOOLEAN)
- created_at, updated_at, deleted_at (TIMESTAMP)
- created_by (FK to users)

Indexes: company_id, routing_rule_id, parent_menu_id
```

#### 5. **team_availability** Table
```sql
Columns:
- id (UUID, primary key)
- company_id (FK to companies)
- user_id (FK to users)
- status (TEXT): available, busy, away, do_not_disturb, offline
- can_receive_calls (BOOLEAN)
- max_concurrent_calls (INTEGER, default 1)
- current_calls_count (INTEGER)
- schedule (JSONB) ** Custom availability schedule **
- status_changed_at (TIMESTAMP)
- last_call_at (TIMESTAMP)
- created_at, updated_at (TIMESTAMP)
- UNIQUE(company_id, user_id)

Indexes: company_id, user_id, status (where can_receive_calls = true)
```

### B. Communications Table Extensions
Extensions added to existing `communications` table:
```sql
- telnyx_call_control_id (TEXT)
- telnyx_call_session_id (TEXT)
- telnyx_message_id (TEXT)
- call_answered_at (TIMESTAMP)
- call_ended_at (TIMESTAMP)
- hangup_cause (TEXT)
- hangup_source (TEXT)
- recording_channels (TEXT): single, dual
- answering_machine_detected (BOOLEAN)
- phone_number_id (FK to phone_numbers)

Indexes: telnyx_call_control_id, telnyx_message_id, phone_number_id
```

### C. Company-Level Phone Settings
**communication_phone_settings** Table
```sql
Columns:
- id (UUID, primary key)
- company_id (UUID, FK, UNIQUE)
- routing_strategy (TEXT): round_robin, skills_based, priority, simultaneous
- fallback_number (VARCHAR 20)
- business_hours_only (BOOLEAN)
- voicemail_enabled (BOOLEAN)
- voicemail_greeting_url (TEXT)
- voicemail_email_notifications (BOOLEAN)
- voicemail_transcription_enabled (BOOLEAN)
- recording_enabled (BOOLEAN)
- recording_announcement (TEXT)
- recording_consent_required (BOOLEAN)
- ivr_enabled (BOOLEAN)
- ivr_menu (JSONB)
- created_at, updated_at (TIMESTAMP)
```

### D. Row Level Security (RLS) Policies
All tables have RLS enabled:
- **phone_numbers**: View for company users, manage for admins
- **call_routing_rules**: View for all, manage for owner/admin/manager
- **voicemails**: View and update for company users, webhooks can insert
- **ivr_menus**: View for all, manage for owner/admin/manager
- **team_availability**: View for all, users can update own, admins manage all

---

## 4. SERVER ACTIONS & LOGIC

### A. Telnyx Actions (`/src/actions/telnyx.ts`)
**Phone Number Management:**
- `searchPhoneNumbers(areaCode, numberType, features, limit)`
- `purchasePhoneNumber(phoneNumber, companyId, billingGroupId)`
- `getCompanyPhoneNumbers(companyId)`
- `releasePhoneNumber(phoneNumberId)`

**Call Operations:**
- `initiateCall(to, from, connectionId)`
- `answerCall(callControlId)`
- `rejectCall(callControlId)`
- `hangupCall(callControlId)`
- `transferCall(callControlId, transferTo)`
- `muteCall(callControlId)`
- `unmuteCall(callControlId)`
- `holdCall(callControlId)`
- `resumeCall(callControlId)`

**Voicemail Operations:**
- `getVoicemails(companyId, limit, offset)`
- `markVoicemailAsRead(voicemailId)`
- `transcribeVoicemail(voicemailId)`
- `deleteVoicemail(voicemailId)`

**Call Routing:**
- `getCallRoutingRules(companyId)`
- `createCallRoutingRule(rule)`
- `updateCallRoutingRule(ruleId, updates)`
- `deleteCallRoutingRule(ruleId)`

### B. Settings Actions (`/src/actions/settings/communications.ts`)
- `getPhoneSettings()` - Load company phone settings
- `updatePhoneSettings(formData)` - Save phone settings including:
  - routingStrategy
  - fallbackNumber
  - businessHoursOnly
  - voicemailEnabled
  - voicemailGreetingUrl
  - voicemailEmailNotifications
  - voicemailTranscriptionEnabled
  - recordingEnabled
  - recordingConsentRequired

---

## 5. TELNYX LIBRARY (`/src/lib/telnyx/`)

### Module Structure
```
├── client.ts          - Singleton Telnyx API client
├── calls.ts           - Call control functions (answer, hangup, transfer, recording)
├── messaging.ts       - SMS/MMS operations
├── numbers.ts         - Phone number management (purchase, release, search)
├── webhooks.ts        - Webhook signature verification & parsing
├── webrtc.ts          - WebRTC client for browser-based calling
└── index.ts           - Module exports
```

### Key Capabilities
- **Call Control**: Answer, reject, hangup, mute, hold, transfer, bridge, DTMF
- **Call Recording**: Start/stop recording with dual-channel support
- **Message Operations**: Send/receive SMS and MMS
- **Number Management**: Search, purchase, release numbers
- **Webhook Handling**: Signature verification, timestamp validation, event parsing
- **WebRTC**: Browser-based phone for technicians

---

## 6. WEBHOOK INTEGRATION

**API Route:** `/api/webhooks/telnyx`

### Webhook Events Handled
1. **Call Events**
   - `call.initiated` - Incoming/outgoing call starts
   - `call.answered` - Call connected
   - `call.hangup` - Call ended
   - `call.recording.saved` - Recording completed

2. **Message Events**
   - `message.sent` - SMS/MMS sent
   - `message.delivered` - Message delivered
   - `message.received` - Inbound message
   - `message.failed` - Send failure

3. **Number Events**
   - `phone_number.purchased` - Number acquired
   - `phone_number.ported` - Number ported in

### Security
- ✅ Signature verification (ED25519)
- ✅ Timestamp validation (5-minute replay protection)
- ✅ Develops can skip verification with `TELNYX_SKIP_SIGNATURE_VERIFICATION=true`

---

## 7. WHAT CURRENTLY EXISTS (WORKING)

### ✅ Infrastructure Complete
- [x] Telnyx API client setup with proper authentication
- [x] Database schema for phone numbers, routing, voicemail, IVR
- [x] RLS policies on all tables
- [x] Webhook endpoint for receiving events
- [x] UI components for all major features
- [x] Settings pages for configuration
- [x] Business hours editor with timezone support
- [x] Voicemail settings and audio management
- [x] IVR menu builder UI
- [x] Call routing rules management
- [x] Number porting wizard
- [x] Usage analytics and billing tracking
- [x] Team availability status tracking (do_not_disturb, away, etc.)

### ✅ Partially Implemented
- [x] Team member routing (stored as UUID array in call_routing_rules.team_members)
- [x] Round-robin call distribution logic (basic structure)
- [x] Business hours-based routing (schema ready)

---

## 8. CRITICAL GAPS FOR FULL IMPLEMENTATION

### 🔴 Missing: Team Member Extensions System
**Problem:** No extension/DID (Direct Inward Dial) fields on team members

**What's Needed:**
1. **Database Migration** - Add to `users` or create `user_extensions` table:
   ```sql
   ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_extension VARCHAR(10);
   ALTER TABLE users ADD COLUMN IF NOT EXISTS direct_inward_dial VARCHAR(20);
   ALTER TABLE users ADD COLUMN IF NOT EXISTS telnyx_endpoint_id TEXT;
   ```

2. **Team Member Profile Updates** - UI to assign extensions during:
   - Team member creation
   - Team member editing
   - Phone system setup

3. **Routing Logic** - Use extensions in call routing:
   - Direct dial extension transfers
   - IVR to extension mapping
   - Outbound caller ID selection

### 🔴 Missing: Vacation/Holiday Modes
**Problem:** `team_availability.status` has 'do_not_disturb' but NO vacation/holiday mode

**What's Needed:**
1. **Extend team_availability table:**
   ```sql
   ALTER TABLE team_availability ADD COLUMN vacation_mode BOOLEAN DEFAULT false;
   ALTER TABLE team_availability ADD COLUMN vacation_start_date DATE;
   ALTER TABLE team_availability ADD COLUMN vacation_end_date DATE;
   ALTER TABLE team_availability ADD COLUMN vacation_auto_reply TEXT;
   ALTER TABLE team_availability ADD COLUMN vacation_forward_to UUID REFERENCES users(id);
   ```

2. **Vacation Settings UI** - Let team members set:
   - Date range for vacation
   - Auto-reply message for calls
   - Call forwarding to designated colleague
   - Out-of-office voicemail greeting

3. **Routing Logic** - Exclude on-vacation members from:
   - Round-robin rotation
   - Skill-based routing
   - Time-based scheduling

### 🔴 Missing: Extension Dialing
**Problem:** No component to dial extensions directly

**What's Needed:**
1. **Extension Directory** - Component to browse team extensions
2. **Direct Call** - Action to call extension via Telnyx
3. **Transfer UI** - During active call, transfer to extension

### 🔴 Missing: Call Queue Management
**Problem:** `ring_timeout` exists but no queue depth/wait handling

**What's Needed:**
1. **Caller Queue Tracking**
2. **Queue Position Announcements**
3. **Queue Abandonment Tracking**
4. **Estimated Wait Time**

### 🔴 Missing: Skill-Based Routing
**Problem:** Schema has `routing_strategy: 'skills_based'` but no skills table

**What's Needed:**
1. **Skills Table:** Store technician skills (HVAC, Plumbing, etc.)
2. **Skills Matcher:** Route calls based on job type → required skills
3. **Competency Tracking:** Skills with certification expiry

### 🔴 Missing: Call Recording Storage & Retrieval
**Problem:** Schema exists but no S3/Supabase Storage integration

**What's Needed:**
1. **Storage Configuration** - Upload recordings to Supabase Storage
2. **Access Control** - Who can download recordings
3. **Retention Policy** - Auto-delete old recordings
4. **Compliance** - Audit trail for recording downloads

### 🔴 Missing: Advanced IVR Features
**Problem:** IVR builder is UI-only, no actual IVR execution

**What's Needed:**
1. **IVR Execution Engine** - Play greetings, collect input, route
2. **DTMF Handling** - Keypress detection and routing
3. **Voicemail Fallback** - After timeout/invalid input
4. **IVR Recording** - Track which options selected

### 🔴 Missing: Call History & Analytics
**Problem:** Voicemail table exists but basic call logs are incomplete

**What's Needed:**
1. **Call Log Table** - Track all call events (initiated, answered, hangup, duration)
2. **Detailed Analytics Dashboard** - Call volume, missed calls, average handling time
3. **Cost Analytics** - Per-number costs, cost trends
4. **Performance Metrics** - Team member performance tracking

### 🔴 Missing: SMS/MMS Integration
**Problem:** Schema partially exists but UI/actions incomplete

**What's Needed:**
1. **Inbound SMS Handler** - Route incoming SMS to team/customer
2. **SMS Templates** - Quick-reply templates for technicians
3. **Two-Way Messaging** - Send/receive with persistence

### 🔴 Missing: Error Handling & Recovery
**Problem:** Limited error handling in webhook processor

**What's Needed:**
1. **Failed Event Queue** - Retry failed webhook processing
2. **Idempotency Keys** - Prevent duplicate processing
3. **Dead Letter Queue** - Unprocessable events

### 🔴 Missing: Integration Tests
**Problem:** No tests for Telnyx integration

**What's Needed:**
1. **Webhook Signature Verification Tests**
2. **Call Routing Logic Tests**
3. **Round-Robin Distribution Tests**
4. **Business Hours Calculation Tests**

---

## 9. IMPLEMENTATION ROADMAP

### Phase 1: Extensions & Team Availability (Foundation)
1. Add extension fields to users table
2. Update team member UI to manage extensions
3. Create extension directory component
4. Add vacation mode to team_availability table
5. Build vacation settings UI

### Phase 2: Smart Call Routing (Core)
1. Implement round-robin call distribution logic
2. Add business hours-based routing (check time, route accordingly)
3. Build extension transfer functionality
4. Create direct call-to-extension feature
5. Implement vacation mode filtering in routing

### Phase 3: Skills-Based Routing (Advanced)
1. Create skills table and assignment UI
2. Build job-type to skills matcher
3. Implement skills-based routing logic
4. Add competency tracking

### Phase 4: Advanced Features (Polish)
1. Call queue management
2. Call recording storage integration
3. IVR execution engine
4. SMS/MMS bidirectional messaging
5. Comprehensive call analytics dashboard

---

## 10. FILE STRUCTURE REFERENCE

### Key Files
```
src/
├── actions/
│   ├── telnyx.ts (phone numbers, calls, voicemail, routing)
│   └── settings/
│       └── communications.ts (phone settings actions)
├── app/
│   └── (dashboard)/dashboard/settings/communications/
│       ├── page.tsx (hub)
│       ├── phone/page.tsx (primary settings)
│       ├── phone-numbers/page.tsx
│       ├── call-routing/page.tsx
│       ├── voicemail/page.tsx
│       ├── ivr-menus/page.tsx
│       ├── email/, sms/, notifications/, porting-status/, usage/
├── components/telnyx/
│   ├── call-routing-rules-list.tsx
│   ├── call-routing-rule-actions.tsx
│   ├── business-hours-editor.tsx
│   ├── ivr-menu-builder.tsx
│   ├── phone-numbers-list.tsx
│   ├── phone-number-search-modal.tsx
│   ├── voicemail-settings.tsx
│   ├── voicemail-player.tsx
│   ├── number-porting-wizard.tsx
│   ├── porting-status-dashboard.tsx
│   ├── usage-metrics-cards.tsx
│   ├── usage-trends-chart.tsx
│   ├── cost-breakdown-table.tsx
│   ├── budget-alerts-panel.tsx
│   └── export-usage-button.tsx
├── lib/telnyx/
│   ├── client.ts (API client)
│   ├── calls.ts (call control)
│   ├── messaging.ts (SMS/MMS)
│   ├── numbers.ts (number management)
│   ├── webhooks.ts (signature verification)
│   ├── webrtc.ts (browser calling)
│   └── index.ts
└── app/api/webhooks/telnyx/
    └── route.ts (webhook handler)

supabase/migrations/
├── 20251101140000_add_telnyx_communication_system.sql
│   (phone_numbers, call_routing_rules, voicemails, ivr_menus, team_availability)
└── 20251102000000_comprehensive_settings_tables.sql
    (communication_phone_settings, templates, notification settings)
```

---

## 11. CONFIGURATION REQUIRED

### Environment Variables (Already Set)
```
TELNYX_API_KEY=xxx (private)
TELNYX_WEBHOOK_SECRET=xxx
TELNYX_PUBLIC_KEY=xxx
NEXT_PUBLIC_TELNYX_CONNECTION_ID=xxx
TELNYX_SKIP_SIGNATURE_VERIFICATION=true (dev only)
```

### Database Tables Ready
- ✅ phone_numbers
- ✅ call_routing_rules
- ✅ voicemails
- ✅ ivr_menus
- ✅ team_availability
- ✅ communications (extended)
- ✅ communication_phone_settings

---

## 12. CURRENT STATE ASSESSMENT

| Feature | Status | Notes |
|---------|--------|-------|
| Telnyx Client Setup | ✅ Complete | Authenticated API client |
| Phone Number Purchase | ✅ Complete | Can buy numbers from Telnyx |
| Basic Call Routing | 🟡 Partial | Schema ready, logic incomplete |
| Business Hours Routing | 🟡 Partial | UI complete, routing logic missing |
| Round-Robin Distribution | 🟡 Partial | Data structure exists, algorithm missing |
| Voicemail System | ✅ Complete | Settings, transcription, notifications ready |
| IVR Menus | 🟡 Partial | Builder UI exists, execution engine missing |
| Team Extensions | ❌ Missing | No extension assignment on users |
| Vacation Mode | ❌ Missing | Status exists, vacation fields missing |
| Call Queue Management | ❌ Missing | No queue depth tracking |
| Skill-Based Routing | ❌ Missing | No skills table/logic |
| Call Recording Storage | 🟡 Partial | Schema exists, S3 integration missing |
| SMS/MMS | 🟡 Partial | Infrastructure exists, UI incomplete |
| Call Analytics | 🟡 Partial | Basic tracking, dashboard incomplete |
| Webhook Processing | ✅ Complete | Signature verification, event parsing |

---

## 13. NEXT IMMEDIATE STEPS

To build a **functional call routing system with extensions and vacation modes**, prioritize:

1. **Add Extension Fields** (1-2 hours)
   - Migration to add `phone_extension` and `direct_inward_dial` to users
   - Update team member edit UI

2. **Add Vacation Mode** (2-3 hours)
   - Migration to extend team_availability table
   - UI component for vacation setup
   - Routing logic to skip on-vacation members

3. **Implement Round-Robin Logic** (3-4 hours)
   - Create function to distribute calls to available team members
   - Track current_index in call_routing_rules
   - Handle unavailable members (on vacation, do_not_disturb)

4. **Build Extension Dialing** (2-3 hours)
   - Direct transfer to extension via Telnyx
   - IVR integration with extension mapping

5. **Call History Tracking** (3-4 hours)
   - Log all call events
   - Create call history table/component
   - Basic analytics dashboard

Total: **2-3 weeks** for a production-ready system with all features.

