# Multi-Phone Number Support Guide

## Overview

The Stratos platform is **fully configured to support multiple phone numbers per company** for both calling and texting. Each company can own and manage unlimited phone numbers, with each number having independent SMS, MMS, and Voice capabilities.

---

## ✅ Database Architecture (Already Configured)

### `phone_numbers` Table

**Schema:**
- ✅ `id` (UUID) - Primary key
- ✅ `company_id` (UUID) - Foreign key to companies table
- ✅ `phone_number` (text) - E.164 format (+1XXXXXXXXXX)
- ✅ `telnyx_phone_number_id` (text) - Telnyx ID (unique globally)
- ✅ `telnyx_messaging_profile_id` (text) - Associated messaging profile
- ✅ `telnyx_connection_id` (text) - Associated call control app
- ✅ `features` (jsonb) - Array of enabled features (sms, mms, voice)
- ✅ `status` (text) - active, suspended, deleted
- ✅ Usage counters: incoming/outgoing calls, SMS sent/received

**Key Constraints:**
- ✅ **Multiple numbers per company** - NO unique constraint on (company_id, phone_number)
- ✅ **Unique Telnyx ID** - Unique constraint on telnyx_phone_number_id (prevents duplicate Telnyx numbers)

### `company_telnyx_settings` Table

**Stores company-level Telnyx configuration:**
- `messaging_profile_id` - Shared across all company numbers
- `call_control_application_id` - Shared across all company numbers
- `default_outbound_number` - Default number for outbound calls/SMS
- `default_outbound_phone_number_id` - Telnyx ID of default number

---

## 🚀 Provisioning Flow

### Initial Setup (First Number)

```typescript
import { provisionCompanyTelnyx } from "@/actions/telnyx-provisioning";

// Provision company with first number
const result = await provisionCompanyTelnyx(companyId);
```

**What happens:**
1. ✅ Creates company-specific messaging profile
2. ✅ Creates company-specific call control application
3. ✅ Purchases 1 phone number with SMS/MMS/Voice enabled
4. ✅ **Automatically enables messaging** via Telnyx API
5. ✅ Inserts number into `phone_numbers` table
6. ✅ Stores configuration in `company_telnyx_settings`

### Purchasing Additional Numbers

```typescript
import { purchaseCompanyPhoneNumbers } from "@/actions/telnyx-provisioning";

// Purchase 3 additional numbers in 415 area code
const result = await purchaseCompanyPhoneNumbers(
  companyId,
  3,           // quantity
  "415"        // area code (optional)
);
```

**What happens:**
1. ✅ Fetches existing company Telnyx settings
2. ✅ Searches for available numbers matching criteria
3. ✅ Purchases numbers from Telnyx
4. ✅ **Automatically enables SMS/MMS** on each number
5. ✅ Associates numbers with company's messaging profile
6. ✅ Associates numbers with company's call control app
7. ✅ Inserts all numbers into `phone_numbers` table

---

## 📱 Using Multiple Numbers

### Sending SMS from Specific Number

```typescript
import { sendTextMessage } from "@/actions/telnyx";

// Send SMS from a specific company phone number
const result = await sendTextMessage({
  to: "+14155551234",
  message: "Hello from our sales line!",
  from: "+18314280176"  // Specify which number to send from
});
```

### Making Calls from Specific Number

```typescript
import { makeCall } from "@/actions/telnyx";

// Make call from a specific company phone number
const result = await makeCall({
  to: "+14155551234",
  from: "+18314280176"  // Specify which number to call from
});
```

### Listing Company Phone Numbers

```typescript
const supabase = await createClient();
const { data: phoneNumbers } = await supabase
  .from("phone_numbers")
  .select("*")
  .eq("company_id", companyId)
  .eq("status", "active")
  .order("created_at", { ascending: false });
```

### Setting Default Outbound Number

```typescript
const supabase = await createClient();

// Update default number in company settings
await supabase
  .from("company_telnyx_settings")
  .update({
    default_outbound_number: "+14155551234",
    default_outbound_phone_number_id: "telnyx_id_here"
  })
  .eq("company_id", companyId);
```

---

## 🎯 Use Cases for Multiple Numbers

### 1. Department-Specific Numbers
```
Sales:        +1 (831) 428-0176
Support:      +1 (415) 555-1234
Emergency:    +1 (650) 555-5678
```

### 2. Campaign-Specific Numbers
```
Spring Sale:  +1 (510) 555-1111
Black Friday: +1 (408) 555-2222
```

### 3. Location-Based Numbers
```
San Francisco: +1 (415) 555-0001
Los Angeles:   +1 (213) 555-0002
New York:      +1 (212) 555-0003
```

### 4. Customer Assignment
```
Customer A calls → Routes to +1 (831) 428-0176
Customer B calls → Routes to +1 (415) 555-1234
```

---

## 🔧 Technical Details

### Messaging Profile Sharing

All phone numbers for a company share the **same messaging profile**. This means:
- ✅ Centralized webhook handling
- ✅ Consistent messaging settings
- ✅ Unified compliance/branding
- ✅ Per-company webhook routing: `/api/webhooks/telnyx?company={companyId}`

### Call Control App Sharing

All phone numbers for a company share the **same call control application**. This means:
- ✅ Centralized call routing
- ✅ Consistent call handling
- ✅ Unified voicemail settings
- ✅ Per-company call webhooks

### Automatic SMS/MMS Enablement

When purchasing numbers, the system automatically:
```typescript
// Called for each purchased number
await fetch(
  `https://api.telnyx.com/v2/phone_numbers/{id}/messaging`,
  {
    method: "PATCH",
    body: JSON.stringify({
      messaging_profile_id: companyMessagingProfileId
    })
  }
);
```

This enables:
- ✅ Domestic two-way SMS
- ✅ Domestic two-way MMS
- ✅ A2P (Application-to-Person) messaging
- ✅ P2P (Person-to-Person) messaging

---

## 📊 Querying Multiple Numbers

### Get All Active Numbers for Company
```sql
SELECT
  phone_number,
  formatted_number,
  features,
  status,
  incoming_calls_count,
  outgoing_calls_count,
  sms_sent_count,
  sms_received_count
FROM phone_numbers
WHERE company_id = '...'
  AND status = 'active'
ORDER BY created_at DESC;
```

### Get Default Number
```sql
SELECT
  pn.*
FROM company_telnyx_settings cts
JOIN phone_numbers pn ON pn.phone_number = cts.default_outbound_number
WHERE cts.company_id = '...';
```

### Get Numbers by Feature
```sql
SELECT *
FROM phone_numbers
WHERE company_id = '...'
  AND features @> '["sms"]'::jsonb
  AND status = 'active';
```

---

## 🛠️ Server Actions Available

### Purchase Additional Numbers
```typescript
purchaseCompanyPhoneNumbers(
  companyId: string,
  quantity: number,
  areaCode?: string
): Promise<ProvisionResult>
```

### Provision Initial Setup
```typescript
provisionCompanyTelnyx(
  companyId: string
): Promise<ProvisionResult>
```

### Send SMS (Auto-selects default or specified number)
```typescript
sendTextMessage({
  to: string,
  message: string,
  from?: string  // Optional - uses default if not specified
}): Promise<MessageResult>
```

### Make Call (Auto-selects default or specified number)
```typescript
makeCall({
  to: string,
  from?: string  // Optional - uses default if not specified
}): Promise<CallResult>
```

---

## ✅ Summary

**The system is fully configured for multi-number support:**

1. ✅ **Database** - Supports unlimited numbers per company
2. ✅ **Provisioning** - Auto-enables SMS/MMS on all numbers
3. ✅ **Messaging** - All numbers share company messaging profile
4. ✅ **Calling** - All numbers share company call control app
5. ✅ **Routing** - Company-specific webhooks for all numbers
6. ✅ **UI Ready** - Can query and display multiple numbers
7. ✅ **Server Actions** - Support specifying which number to use

**Users can:**
- Purchase additional numbers via `purchaseCompanyPhoneNumbers()`
- Send SMS from any owned number
- Make calls from any owned number
- Set a default outbound number
- View all owned numbers with usage statistics

**No additional configuration required!** 🎉
