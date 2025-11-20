# Read Receipts Implementation

## Overview

Read receipts are now fully supported for **RCS (Rich Communication Services)** messages. This allows you to track when recipients have read your messages, just like iPhone's iMessage.

## Important: SMS vs RCS

### ❌ Standard SMS
**Read receipts are NOT supported for regular SMS messages.** This is a limitation of the SMS protocol itself, not our system. Standard SMS only supports:
- ✅ Sent confirmation
- ✅ Delivery confirmation
- ❌ Read receipts (not available)

### ✅ RCS Messages
**Read receipts ARE supported for RCS messages.** RCS is the modern replacement for SMS and includes:
- ✅ Sent confirmation
- ✅ Delivery confirmation
- ✅ Read receipts
- ✅ Typing indicators
- ✅ Rich media support
- ✅ Group messaging

## How It Works

### Message Lifecycle with Read Receipts

1. **Sending** - Message is queued for delivery
   - Status: `queued` / `sending`
   - Display: "Sending..." (gray with spinner)

2. **Sent** - Message sent to carrier
   - Status: `sent`
   - Webhook: `message.sent`
   - Display: "Sent" (blue)

3. **Delivered** - Message delivered to recipient's device
   - Status: `delivered`
   - Webhook: `message.delivered`
   - Display: "Delivered" (green)

4. **Read** - Recipient opened/read the message (RCS only)
   - Status: `read`
   - Webhook: `message.read`
   - Display: "Read" (dark green)
   - Database: `read_at` timestamp updated

5. **Failed** - Delivery or sending failed
   - Status: `failed`
   - Webhook: `message.sending_failed` or `message.delivery_failed`
   - Display: "Not Delivered" (red)

## Technical Implementation

### 1. Webhook Handler
**File**: `/src/app/api/webhooks/telnyx/route.ts`

```typescript
case "message.read": {
    const messageData = payload.data.payload as any;

    // Update communication record with read receipt (RCS only)
    await supabase
        .from("communications")
        .update({
            read_at: new Date().toISOString(),
        })
        .eq("telnyx_message_id", messageData.id);
    break;
}
```

When Telnyx receives a read receipt from the recipient's device, it sends a `message.read` webhook to our API. The handler updates the `read_at` timestamp in the database.

### 2. Status Polling Hook
**File**: `/src/hooks/use-message-status.ts`

The hook polls for message status every 3 seconds until it reaches a terminal state:
- Stops polling when status is: `delivered`, `read`, or `failed`
- Maps `"read"` status from Telnyx API
- Triggers UI updates in real-time

### 3. Status Display Component
**File**: `/src/components/communication/message-delivery-status.tsx`

Displays status as iPhone-style text below messages:
- **Read**: Dark green text "Read"
- **Delivered**: Green text "Delivered"
- **Sent**: Blue text "Sent" (with spinner if polling)
- **Sending**: Gray text "Sending..." (with spinner)
- **Not Delivered**: Red text "Not Delivered"

### 4. Database Schema
**Table**: `communications`

```sql
-- Existing columns used for read receipts
read_at TIMESTAMP            -- When message was read (RCS only)
sent_at TIMESTAMP            -- When sent to carrier
delivered_at TIMESTAMP       -- When delivered to device
failed_at TIMESTAMP          -- When delivery failed
telnyx_message_id TEXT       -- Used to match webhooks
```

## RCS vs SMS Detection

The system automatically detects whether a message is RCS or SMS based on the recipient's capabilities. Telnyx handles this detection and will:

1. Send as RCS if recipient supports it (read receipts available)
2. Fallback to SMS if recipient doesn't support RCS (no read receipts)

## UI Display

### Message List (SMS View)

Each message shows status below the preview text:

```
┌─────────────────────────────────────────────┐
│ Contact Name                                │
│ +1 234 567 8900                            │
│                                             │
│ Hey, are you available tomorrow?           │
│ Read                          <- Status     │
└─────────────────────────────────────────────┘
```

Status text is very small (10px) and color-coded:
- Gray: Sending, Received, Unknown
- Blue: Sent
- Green: Delivered
- Dark Green: Read (RCS only)
- Red: Not Delivered

### Real-Time Updates

The status updates automatically without page refresh:
1. User sends message → "Sending..." (gray, spinner)
2. Sent to carrier → "Sent" (blue, spinner while polling)
3. Delivered to device → "Delivered" (green)
4. Recipient opens message → "Read" (dark green) - **RCS only**

Polling stops once message reaches `delivered`, `read`, or `failed` state.

## Enabling RCS for Your Company

### Requirements

1. **Telnyx RCS Agent**: Your company needs an RCS agent registered with Telnyx
2. **Brand Verification**: RCS requires brand verification (similar to 10DLC)
3. **RCS-Capable Numbers**: Phone numbers must support RCS messaging

### Setup Process

1. **Contact Telnyx Support** to enable RCS for your account
2. **Create RCS Agent** via Telnyx Portal or API
3. **Configure Branding**:
   - Company name
   - Logo
   - Brand color
   - Description
4. **Verify Brand** with The Campaign Registry
5. **Test RCS Messages** with RCS-capable devices

### Testing Read Receipts

To test read receipts, you need:
1. ✅ RCS enabled on your Telnyx account
2. ✅ Send message to Android device with RCS enabled
3. ✅ Recipient must have RCS enabled in their messaging app
4. ✅ Both devices must be on RCS-compatible carriers

**Note**: iPhone doesn't support RCS read receipts (as of 2024). Use Android devices for testing.

## Monitoring Read Receipts

### Database Queries

```sql
-- Get read rate for outbound messages
SELECT
    COUNT(*) FILTER (WHERE read_at IS NOT NULL) * 100.0 / COUNT(*) as read_rate
FROM communications
WHERE direction = 'outbound'
  AND type = 'sms'
  AND sent_at > NOW() - INTERVAL '30 days';

-- Get average time to read
SELECT
    AVG(EXTRACT(EPOCH FROM (read_at - sent_at))) as avg_seconds_to_read
FROM communications
WHERE read_at IS NOT NULL
  AND sent_at IS NOT NULL;

-- Messages delivered but not read (follow-up opportunities)
SELECT *
FROM communications
WHERE delivered_at IS NOT NULL
  AND read_at IS NULL
  AND sent_at > NOW() - INTERVAL '7 days'
  AND direction = 'outbound'
ORDER BY delivered_at DESC;
```

### Analytics Dashboard (Future)

Potential metrics to track:
- **Read Rate**: % of delivered messages that are read
- **Time to Read**: Average time from delivery to read
- **Engagement by Time**: Best times for message engagement
- **RCS vs SMS**: Comparison of engagement rates
- **Follow-up Opportunities**: Delivered but unread messages

## Limitations

### Protocol Limitations

1. **SMS**: No read receipts (protocol limitation)
2. **RCS**: Requires recipient RCS support
3. **iPhone**: Apple doesn't support RCS read receipts yet
4. **Carrier Support**: Not all carriers support RCS

### Privacy Considerations

1. **User Control**: Recipients can disable read receipts in their messaging app
2. **No Guarantee**: Read receipt delivery is best-effort
3. **Network Issues**: May not receive read receipt even if message was read

### Best Practices

1. **Don't Rely Solely on Read Receipts**: Use delivery status as primary indicator
2. **Combine with Other Signals**: Track responses, clicks, conversions
3. **Respect Privacy**: Don't pressure users about read receipts
4. **Fallback to SMS**: System automatically falls back if RCS unavailable

## Webhook Configuration

Ensure your Telnyx webhooks are configured to send to:

```
https://yourdomain.com/api/webhooks/telnyx
```

Required webhook events:
- ✅ `message.sent`
- ✅ `message.delivered`
- ✅ `message.read` (for RCS)
- ✅ `message.sending_failed`
- ✅ `message.delivery_failed`
- ✅ `message.received`

## Troubleshooting

### Read Receipts Not Working

**Check:**
1. Is the message RCS? (SMS doesn't support read receipts)
2. Does recipient have RCS enabled?
3. Is the carrier RCS-compatible?
4. Are webhooks configured correctly?
5. Check Telnyx webhook logs for `message.read` events

**Verify Webhook Handler:**
```bash
# Check if webhook received
tail -f /var/log/application.log | grep "message.read"

# Test webhook locally
curl -X POST http://localhost:3000/api/webhooks/telnyx \
  -H "Content-Type: application/json" \
  -d '{"data": {"event_type": "message.read", "payload": {"id": "test-message-id"}}}'
```

### Status Not Updating in UI

**Check:**
1. Is polling enabled? (outbound messages only)
2. Check browser console for errors
3. Verify `telnyx_message_id` is set in database
4. Check `/api/telnyx/message-status` endpoint works

## Future Enhancements

### Planned Features

1. **Typing Indicators** (RCS)
   - Show when recipient is typing
   - Real-time UI updates

2. **Read Receipt Analytics**
   - Dashboard with read rates
   - Best time to send analysis
   - Engagement tracking

3. **Push Notifications**
   - Notify sender when message is read
   - Real-time browser notifications

4. **Group Message Read Receipts**
   - Track who read group messages
   - Per-participant read status

## Summary

✅ **Read receipts fully implemented for RCS messages**
✅ **Webhook handler processes `message.read` events**
✅ **Real-time status updates in UI**
✅ **iPhone-style status display**
✅ **Database tracking with `read_at` column**
✅ **Automatic polling until terminal state**

❌ **Not available for standard SMS** (protocol limitation)
⚠️ **Requires RCS-enabled devices and carriers**
⚠️ **Recipient can disable read receipts**

For questions or issues, check the Telnyx documentation or contact support.
