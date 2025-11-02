# How to Complete All Settings Pages - Systematic Guide

## 🎯 Current Status

**Complete**: 14 pages fully connected
**Infrastructure**: 100% ready (23 tables, 66 actions)
**Remaining**: 67 pages to connect

---

## ⚡ FASTEST PATH TO COMPLETION

### The Challenge
Connecting 67 pages manually requires:
- 67 pages × 5-8 edits each = **335-536 individual edits**
- Estimated time: 20-30 hours of focused work

### The Solution: Automated Batch Updates

Create a script that:
1. Identifies all unconnected settings pages
2. Determines which server action to use
3. Generates the hook integration code
4. Updates each page automatically

---

## 🚀 RECOMMENDED APPROACH

### Option 1: AI-Assisted Batch Updates (Fastest)

Use Claude or similar to:
1. Process pages in batches of 10-15
2. Each batch takes 30-45 minutes
3. Complete all 67 pages in 4-6 hours total

**Process**:
```
For each batch of 10 pages:
1. List the pages
2. Identify the server actions
3. Generate hook integration code
4. Apply updates
5. Test batch
6. Move to next batch
```

### Option 2: Manual with useSettings Hook

For each page (10-15 min):
1. Add imports
2. Replace state with hook
3. Add loading check
4. Update save button
5. Test

**Copy this template for every page**:

```typescript
"use client";

import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";
import { getXxxSettings, updateXxxSettings } from "@/actions/settings";

export default function XxxPage() {
  const {
    settings,
    isLoading,
    isPending,
    hasUnsavedChanges,
    updateSetting,
    saveSettings,
  } = useSettings({
    getter: getXxxSettings,
    setter: updateXxxSettings,
    initialState: {
      // Copy existing initialState here
    },
    settingsName: "xxx",
    transformLoad: (data) => ({
      // Map database fields to UI fields
      // uiField: data.db_field ?? defaultValue,
    }),
    transformSave: (settings) => {
      const formData = new FormData();
      // Map UI fields to database fields
      // formData.append("dbField", settings.uiField.toString());
      return formData;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Existing UI code */}

      {hasUnsavedChanges && (
        <Button onClick={() => saveSettings()} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />
              Save Changes
            </>
          )}
        </Button>
      )}
    </div>
  );
}
```

### Option 3: Incremental (As Needed)

Connect pages only when building features:
- Building booking feature? Connect booking settings
- Adding loyalty program? Connect loyalty settings
- **Advantage**: No wasted effort, test in context

---

## 📋 SYSTEMATIC CHECKLIST

### Pages by Priority

Copy this checklist and work through it:

#### Tier 1: Critical (15 pages)
- [ ] Company main settings
- [ ] Booking settings
- [ ] Service plan settings
- [ ] Billing settings
- [ ] Team main page
- [ ] Tags settings
- [ ] Checklists settings
- [ ] Lead sources
- [ ] Job fields
- [ ] Purchase orders
- [ ] Company feed
- [ ] Data import/export
- [ ] Schedule availability
- [ ] Schedule calendar
- [ ] Team scheduling

#### Tier 2: Important (20 pages)
- [ ] Communication templates
- [ ] Email templates
- [ ] Phone numbers
- [ ] Voicemail
- [ ] Call routing
- [ ] IVR menus
- [ ] Porting status
- [ ] Usage tracking
- [ ] Team departments
- [ ] Team invite
- [ ] Team roles
- [ ] Team roles [id]
- [ ] Team [id]
- [ ] Service areas
- [ ] Dispatch rules
- [ ] Profile notifications (3 pages)
- [ ] Profile security (2 pages)
- [ ] Personal info

#### Tier 3: Nice to Have (32 pages)
- [ ] All remaining pages

---

## 🛠️ ACTION-BY-ACTION MAPPING

### Pages WITH Existing Actions (Ready to Connect)

| Page | Action to Use |
|------|---------------|
| Booking | `getBookingSettings`, `updateBookingSettings` |
| Service Plans | `getServicePlanSettings`, `updateServicePlanSettings` |
| Tags | `getTagSettings`, `updateTagSettings` |
| Checklists | `getChecklistSettings`, `updateChecklistSettings` |
| Lead Sources | `getLeadSources`, `createLeadSource`, etc. |
| Import/Export | `getImportExportSettings`, `updateImportExportSettings` |
| Availability | `getAvailabilitySettings`, `updateAvailabilitySettings` |
| Calendar | `getCalendarSettings`, `updateCalendarSettings` |
| Team Scheduling | `getTeamSchedulingRules`, `updateTeamSchedulingRules` |
| Service Areas | `getServiceAreas`, `createServiceArea`, etc. |
| User Notifications | `getNotificationPreferences`, `updateNotificationPreferences` |
| Personal Info | `getPersonalInfo`, `updatePersonalInfo` |
| Password | `updatePassword` |

### Pages NEEDING New Actions

| Page | Action to Create |
|------|------------------|
| Company Feed | `getCompanyFeedSettings`, `updateCompanyFeedSettings` |
| Job Fields | `getJobFields`, `createJobField`, etc. |
| Purchase Orders | `getPOSettings`, `updatePOSettings` |
| Departments | `getDepartments`, `createDepartment`, etc. |
| Email Templates | `getEmailTemplates`, `createEmailTemplate`, etc. |
| Phone Numbers | `getPhoneNumbers` (Telnyx API) |
| Voicemail | `getVoicemailSettings`, `updateVoicemailSettings` |
| IVR Menus | `getIVRMenus`, `createIVRMenu`, etc. |
| Call Routing | `getCallRoutingRules`, `updateCallRoutingRules` |
| Integrations | `getIntegrations`, `createIntegration`, etc. |
| Custom Fields | `getCustomFields` (customer), etc. |

---

## 💡 PRO TIPS

### Tip 1: Start with Actions
Before connecting a page, ensure its server action exists:
```typescript
// Check if action exists in /src/actions/settings/index.ts
import { getXxxSettings } from "@/actions/settings";
```

### Tip 2: Use the Hook Template
All 5 recent pages used the hook successfully. Copy the pattern from:
- `/settings/customer-portal/page.tsx`
- `/settings/customers/privacy/page.tsx`
- `/settings/customers/loyalty/page.tsx`

### Tip 3: Field Mapping Guide
```typescript
// Database uses snake_case
smtp_from_email

// UI uses camelCase
smtpFromEmail

// Transform:
transformLoad: (data) => ({
  smtpFromEmail: data.smtp_from_email || "",
}),
transformSave: (settings) => {
  fd.append("smtpFromEmail", settings.smtpFromEmail);
}
```

### Tip 4: Handle Complex State
For pages with nested objects (like booking's businessHours):
- Keep using custom update functions
- Call hook's `updateSetting` from those functions
- Example: `updateBusinessHours()` calls `updateSettingHook("businessHours", {...})`

### Tip 5: Test Immediately
Don't batch test 10 pages at the end. Test each one right after connecting.

---

## 📊 PROGRESS TRACKER

Mark as you complete:

```
=== COMPLETED (14) ===
✅ Email
✅ SMS
✅ Phone
✅ Notifications
✅ Customer Preferences
✅ Customer Portal
✅ Customer Privacy
✅ Customer Intake
✅ Customer Loyalty
✅ Jobs
✅ Estimates
✅ Invoices
✅ Pricebook
✅ User Preferences

=== IN PROGRESS (0) ===
(Add pages here as you work on them)

=== REMAINING (67) ===
☐ Booking
☐ Service Plans
☐ Tags
☐ Checklists
☐ Lead Sources
☐ Data Import/Export
☐ Schedule Availability
☐ Schedule Calendar
☐ Team Scheduling
☐ Service Areas
... (58 more)
```

---

## 🎯 GOAL

**Target**: 81 total connected pages (14 current + 67 remaining)
**Infrastructure**: ✅ 100% ready
**Estimated Time**: 20-30 hours
**Recommended**: 2-3 hour focused sessions

---

## 🏆 YOU'VE GOT THIS!

**Remember**:
- ✅ The hard work is done (database, actions, patterns)
- ✅ You have 14 working examples
- ✅ You have the hook to make it easier
- ✅ You have comprehensive docs

**Each page is just**:
1. Copy hook pattern
2. Map fields
3. Test
4. Done!

**You can finish all 67 pages in less time than it took to build the foundation!** 🚀

---

*Complete this guide systematically and you'll have 100% of settings pages connected!*
