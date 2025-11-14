# 📞 Thorbis VoIP System - Complete Guide

**Version:** 1.0
**Last Updated:** 2025-11-11
**System Status:** Production Ready

---

## 🎯 Overview

The Thorbis VoIP system is an enterprise-grade phone management platform powered by Telnyx, featuring:

- ✅ Team member extensions with direct dial
- ✅ Advanced call routing with 6 strategies
- ✅ Vacation mode with auto-management
- ✅ Holiday scheduling with recurring patterns
- ✅ Real-time call analytics and reporting
- ✅ IVR menu builder
- ✅ Call recording and transcription
- ✅ Comprehensive call logging

---

## 🚀 Quick Start

### Step 1: Configure Business Phone Number

1. Navigate to **Settings → Communications → Phone**
2. Click the **General** tab
3. Enter your business phone number: `+1 (555) 123-4567`
4. Set your fallback number for emergencies
5. Choose default routing strategy: **Round Robin** (recommended)
6. Enable call recording if needed
7. Click **Save Changes**

### Step 2: Assign Team Extensions

1. Click the **Extensions** tab
2. Find each team member in the table
3. Click **Edit** next to their name
4. Assign a unique extension (e.g., 101, 102, 103)
5. Optionally add a Direct Inward Dial (DID) number
6. Set ring timeout (default: 30 seconds)
7. Configure voicemail PIN (6 digits)
8. Click **Save Settings**

**Best Practices:**
- Use 3-digit extensions starting from 100
- Reserve 100-199 for general staff
- Reserve 200-299 for management
- Reserve 900-999 for special services

### Step 3: Set Up Call Routing

1. Click the **Call Routing** tab
2. Click **Create Rule**
3. Enter rule details:
   - **Name:** "Sales Team"
   - **Routing Type:** Round Robin
   - **Ring Timeout:** 30 seconds
   - **Voicemail Enabled:** Yes
4. Click **Save**
5. Use ↑ ↓ arrows to adjust priority

### Step 4: Configure Business Hours

1. Click the **Hours** tab
2. Set operating hours for each day:
   - **Monday-Friday:** 9:00 AM - 5:00 PM
   - **Saturday:** 10:00 AM - 2:00 PM
   - **Sunday:** Closed
3. Select your timezone
4. Click **Save Hours**

### Step 5: Add Company Holidays

1. Click the **Holidays** tab
2. Click **Add Holiday**
3. Configure holiday:
   - **Name:** "New Year's Day"
   - **Date:** January 1, 2025
   - **Recurring:** Yes (Yearly)
   - **Special Greeting:** "Happy New Year! We're closed today..."
4. Click **Add Holiday**

---

## 📋 Feature Documentation

### Team Extensions

**Location:** Settings → Communications → Phone → Extensions

#### Extension Features:
- **Phone Extension** (Required): 2-10 digit internal extension
- **Direct Inward Dial** (Optional): Direct phone number for team member
- **Extension Enabled**: Toggle to enable/disable receiving calls
- **Voicemail PIN**: 6-digit code for remote voicemail access
- **Call Forwarding**: Forward calls to another number (e.g., mobile)
- **Simultaneous Ring**: Ring both extension and forward number
- **Ring Timeout**: Seconds to ring before forwarding to voicemail

#### Vacation Mode:
- **Enable Vacation Mode**: Stop receiving calls during vacation
- **Start Date**: First day of vacation
- **End Date**: Last day of vacation (auto-disables after)
- **Vacation Message**: Custom message played to callers

**Example Configuration:**
```
Name: Sarah Johnson
Extension: 101
Direct Dial: +1 (555) 123-4501
Voicemail PIN: 123456
Call Forwarding: +1 (555) 987-6543
Ring Timeout: 30 seconds
Vacation: Dec 24 - Jan 2 (Enabled)
Message: "I'm on vacation until January 2nd..."
```

---

### Call Routing Rules

**Location:** Settings → Communications → Phone → Call Routing

#### Routing Types:

**1. Direct Routing**
- Route calls to a specific team member
- Use for VIP customers or specialized support
- Example: "CEO Direct Line" → routes to extension 200

**2. Round Robin**
- Distribute calls evenly across team members
- Automatically tracks who received the last call
- Best for: Sales teams, general support
- Example: Sales team with extensions 101, 102, 103 receives calls in rotation

**3. Simultaneous Ring**
- Ring all available team members at once
- First to answer takes the call
- Best for: Small teams, urgent support lines
- Example: Emergency line rings all technicians

**4. IVR Menu**
- Interactive voice menu with keypad options
- "Press 1 for Sales, 2 for Support, 3 for Billing"
- Configure in the **Call Flows** tab
- Best for: Large companies with multiple departments

**5. Business Hours Routing**
- Route differently based on time of day
- Within hours: Route to team
- After hours: Voicemail or forwarding
- Best for: Companies with strict business hours

**6. Conditional Routing**
- Route based on caller ID, location, or custom rules
- Example: VIP customers → priority queue
- Best for: Advanced routing scenarios

#### Priority System:
- Rules are evaluated from **Priority 1** (highest) to lowest
- Use ↑ ↓ arrows to reorder
- First matching rule is used
- If no rule matches, use fallback number

**Example Priority Setup:**
```
Priority 1: VIP Customers (Conditional)
Priority 2: Business Hours (Business Hours Routing)
Priority 3: Sales Team (Round Robin)
Priority 4: After Hours (Direct to Voicemail)
```

---

### Holiday Management

**Location:** Settings → Communications → Phone → Holidays

#### Holiday Types:

**1. One-Time Holiday**
- Specific date, non-recurring
- Example: Company anniversary event

**2. Yearly Recurring**
- Repeats every year on the same date
- Example: Christmas, New Year's Day
- Date: December 25 (repeats every year)

**3. Monthly Recurring**
- Same day each month
- Example: Monthly maintenance window
- Date: First Monday of every month

**4. Weekly Recurring**
- Same day each week
- Example: Weekly team meetings (closed to calls)

#### Special Greeting Messages:
- Custom message played to callers on holidays
- Text-to-Speech (TTS) conversion
- Example: "Thank you for calling. Our offices are closed for Independence Day and will reopen on July 5th."

---

### Voicemail Configuration

**Location:** Settings → Communications → Phone → Voicemail

#### Greeting Options:

**1. Default System Greeting**
- Professional pre-recorded greeting
- "You've reached [Company Name]. Please leave a message..."

**2. Text-to-Speech (TTS)**
- Type your greeting text
- System converts to natural-sounding voice
- Can include company name, hours, expected callback time

**3. Custom Upload**
- Upload your own audio file (MP3, WAV, M4A)
- Professional recording recommended
- Max file size: 5MB

#### Notification Settings:
- **Email Notifications**: Receive voicemail audio via email
- **SMS Notifications**: Text alert when voicemail received
- **Transcription**: Auto-transcribe voicemail to text (AI-powered)

#### Storage & Retention:
- **30 days**: Suitable for quick-response teams
- **90 days**: Standard for most businesses
- **180 days**: Compliance requirements
- **1 year**: Legal/archival purposes
- **Forever**: Never auto-delete (storage costs apply)

---

### Call Analytics

**Location:** Settings → Communications → Phone → Analytics

#### Metrics Tracked:

**Call Volume Metrics:**
- Total calls (inbound/outbound)
- Calls by hour, day, week, month
- Peak calling times
- Average calls per agent

**Performance Metrics:**
- Answer rate percentage
- Average call duration
- Missed call count
- Queue wait times
- First call resolution rate

**Team Performance:**
- Calls handled per team member
- Average call duration per agent
- Individual answer rates
- Performance rankings

**Cost Analysis:**
- Total call costs
- Cost per call
- Cost per minute
- Billable minutes
- Budget tracking

#### Exporting Reports:
- Export to CSV, Excel, or PDF
- Date range selection
- Filter by team member, call type, outcome
- Schedule automatic reports (email delivery)

---

## 🔧 Advanced Configuration

### Setting Up IVR Menus

**Location:** Settings → Communications → Phone → Call Flows

#### IVR Best Practices:
1. **Keep it simple**: Max 4-5 options
2. **Always include "0 for operator"**
3. **Repeat menu after timeout**
4. **Test extensively before going live**

#### Example IVR Structure:
```
Main Menu:
├─ 1: Sales Department → Round Robin (Ext 101-105)
├─ 2: Technical Support → Skills-Based Routing
├─ 3: Billing/Accounts → Direct to Ext 201
├─ 4: Company Directory → Name Directory
└─ 0: Operator → Ext 100

Sales Department:
├─ 1: New Customers → Sales Queue A
├─ 2: Existing Customers → Sales Queue B
└─ 0: Return to Main Menu
```

### Webhook Integration

**Endpoint:** `https://yourdomain.com/api/telnyx/webhooks`

#### Events Handled:
- `call.initiated` - Incoming call started
- `call.answered` - Call was answered
- `call.hangup` - Call ended
- `call.machine.detection` - Voicemail detected
- `call.recording.saved` - Recording available

#### Security:
- Webhook signature verification (ED25519)
- Timestamp validation (prevents replay attacks)
- IP whitelist (Telnyx IPs only)

---

## 🎓 Common Scenarios

### Scenario 1: Small Office (1-5 People)

**Setup:**
- **Routing Strategy:** Simultaneous Ring
- **Business Hours:** Strict (voicemail after hours)
- **Extensions:** 101-105
- **Holidays:** 10 US federal holidays

**Why this works:**
- Everyone hears every call
- Quick response time
- Simple to manage

---

### Scenario 2: Growing Business (5-20 People)

**Setup:**
- **Routing Strategy:** Round Robin + IVR
- **Departments:** Sales, Support, Billing
- **Extensions:** 101-120
- **Call Queue:** Max wait 3 minutes

**IVR Menu:**
```
Press 1 for Sales
Press 2 for Support
Press 3 for Billing
Press 9 to repeat this menu
Press 0 for operator
```

---

### Scenario 3: Enterprise (20+ People)

**Setup:**
- **Routing Strategy:** Skills-Based + Conditional
- **Departments:** 5+ departments
- **Extensions:** 100-999
- **Advanced Features:**
  - VIP customer recognition
  - Call recording for compliance
  - Real-time analytics dashboard
  - Supervisor monitoring

**Routing Logic:**
1. Check caller ID against VIP database
2. VIP → Priority queue with senior agents
3. Regular → Skills-based routing by issue type
4. After business hours → Escalation to on-call manager

---

## 🛠️ Troubleshooting

### Issue: Extension not receiving calls

**Check:**
1. Is "Extension Enabled" toggled on?
2. Is vacation mode active?
3. Is Do Not Disturb enabled?
4. Is the extension included in any routing rules?
5. Check `team_availability` table: `can_receive_calls` = true?

**Fix:**
```sql
-- Check availability status
SELECT * FROM team_availability
WHERE team_member_id = 'uuid-here';

-- Reset availability if needed
UPDATE team_availability
SET can_receive_calls = true,
    status = 'available',
    vacation_mode_enabled = false
WHERE team_member_id = 'uuid-here';
```

---

### Issue: Calls going to voicemail immediately

**Check:**
1. Business hours configured correctly?
2. All team members on vacation?
3. Ring timeout too short?
4. Routing rule enabled?

**Fix:**
- Increase ring timeout to 45-60 seconds
- Verify at least one team member is available
- Check business hours match your timezone

---

### Issue: No calls reaching specific routing rule

**Check:**
1. Rule priority order
2. Higher priority rule matching first?
3. Rule enabled status

**Fix:**
- Reorder rules using priority arrows
- Disable conflicting higher-priority rules
- Review rule conditions

---

## 📊 Database Schema Reference

### Key Tables:

**`team_members`**
- Extensions, DID numbers, voicemail settings
- Call forwarding configuration
- Ring timeout preferences

**`team_availability`**
- Real-time status (available, busy, away, DND)
- Vacation mode with date ranges
- Current call count tracking

**`call_routing_rules`**
- Routing type, priority, timeout
- Team member assignments
- Voicemail and recording settings

**`call_logs`**
- Complete call history
- Duration, cost, recording URLs
- Customer/job associations

**`call_queue`**
- Queued calls waiting for agents
- Position, wait time, abandonment tracking

**`company_holidays`**
- Holiday schedule with recurrence
- Special greetings per holiday

### Helper Functions:

**`get_available_team_members(company_id, rule_id)`**
- Returns available agents with availability scores
- Filters vacation mode, DND, max concurrent calls
- Orders by availability score (0-100)

**`update_vacation_mode_status()`**
- Auto-trigger on team_availability updates
- Manages vacation start/end dates
- Auto-disables vacation mode after end date

---

## 🔐 Security Considerations

1. **Row Level Security (RLS)** - All tables have RLS policies
2. **Company Isolation** - Users only see their company data
3. **Function Security** - `SET search_path = ''` prevents SQL injection
4. **Webhook Verification** - Cryptographic signature validation
5. **Voicemail Encryption** - Audio files encrypted at rest
6. **Call Recording Consent** - Disclosure played when recording enabled

---

## 📈 Performance Optimization

1. **Indexes** - All foreign keys and frequently queried columns indexed
2. **Caching** - Team availability cached for 30 seconds
3. **Connection Pooling** - Supabase connection pooler enabled
4. **CDN** - Voicemail files served via CDN
5. **Lazy Loading** - Components load on-demand

---

## 🎯 Roadmap

### Phase 1: Core Features ✅ (Completed)
- ✅ Team extensions
- ✅ Call routing (6 types)
- ✅ Vacation mode
- ✅ Holiday scheduling
- ✅ Analytics dashboard
- ✅ Voicemail system

### Phase 2: Advanced Features (Next)
- ⏳ Real-time call monitoring dashboard
- ⏳ WebSocket live updates
- ⏳ Call queue management UI
- ⏳ Supervisor whisper/barge-in
- ⏳ Skills-based routing algorithm
- ⏳ AI-powered call summarization

### Phase 3: Integrations (Future)
- 📋 CRM integration (sync call logs)
- 📋 Calendar integration (auto-DND during meetings)
- 📋 Slack notifications for missed calls
- 📋 SMS fallback when calls fail
- 📋 Video calling (Telnyx WebRTC)

---

## 📞 Support

### Documentation:
- Telnyx Docs: https://developers.telnyx.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

### Monitoring:
- Call Logs: Check `call_logs` table for debugging
- Error Tracking: Settings → Development → Logs
- Advisor Checks: Run `mcp__supabase__get_advisors` for security/performance warnings

---

## 🎉 Congratulations!

You now have a **world-class VoIP system** powering your business communications. This system handles:

- 📞 **Unlimited concurrent calls** (hardware limited only)
- 🌍 **Global coverage** via Telnyx network
- 📊 **Real-time analytics** with actionable insights
- 🤖 **Intelligent routing** with 6 routing strategies
- 🔐 **Enterprise security** with RLS and encryption
- 📈 **Scalable architecture** from 1 to 1000+ agents

**Need help?** Check the troubleshooting section or contact support.

---

**Built with ❤️ for Thorbis by the Engineering Team**
