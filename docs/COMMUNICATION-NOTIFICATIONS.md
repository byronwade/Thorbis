# Communication Notifications System

## Overview

The communication notifications system provides **automatic toast notifications** and **notification center integration** for all incoming communications:

- **📞 Phone Calls** (incoming, missed, completed)
- **🎙️ Voicemails** (new messages)
- **💬 Text Messages/SMS** (incoming)
- **📧 Emails** (incoming)

## Architecture

### Database Layer

#### Tables
- **`communications`** - Stores all communication records (calls, SMS, emails)
- **`voicemails`** - Stores voicemail recordings and metadata
- **`notifications`** - Stores all app notifications including communication alerts

#### Triggers
- **`trigger_create_communication_notification`** - Automatically creates notifications when new communications are inserted
- **`trigger_create_voicemail_notification`** - Automatically creates notifications when new voicemails are inserted

### Application Layer

#### Stores (Zustand)
1. **`notifications-store.ts`** - Main notification center state management
   - Handles notification CRUD operations
   - Manages Supabase Realtime subscriptions
   - Integrates with communication toast display

2. **`communication-notifications-store.ts`** - Communication-specific toast management
   - Displays styled toast notifications
   - Plays notification sounds
   - Shows desktop notifications
   - Configurable settings (sound, desktop, duration)

#### Components
1. **`communication-notifications-handler.tsx`** - Client component for initialization
   - Requests desktop notification permissions
   - Provides settings UI component

2. **`notifications-dropdown.tsx`** - Notification center dropdown
   - Displays all notifications (including communications)
   - Mark as read/unread
   - Delete notifications

## How It Works

### 1. Communication Event Occurs
When a new communication is received (call, SMS, email, voicemail):

```sql
INSERT INTO communications (
  company_id,
  type,
  direction,
  from_address,
  to_address,
  body,
  ...
) VALUES (...);
```

### 2. Database Trigger Fires
The `trigger_create_communication_notification` trigger automatically:
1. Checks if the communication is incoming (`direction = 'inbound'`)
2. Skips internal/archived communications
3. Gets customer name from `customers` table
4. Creates a notification for each team member with communication permissions

### 3. Realtime Subscription Receives Event
The `notifications-store.ts` listens for new notification inserts via Supabase Realtime:

```typescript
.on('postgres_changes', { event: 'INSERT', table: 'notifications' }, (payload) => {
  // Add notification to store
  addNotification(payload.new);

  // Show toast if it's a communication notification
  if (payload.new.metadata?.communication_id) {
    showCommunicationToast(payload.new);
  }
})
```

### 4. Toast Notification Displays
The `communication-notifications-store.ts` displays a styled toast:
- **Icon** based on communication type (📞 📧 💬 🎙️)
- **Title** with customer name
- **Message** with relevant details
- **Action button** to view/reply
- **Sound notification** (if enabled)
- **Desktop notification** (if enabled)

### 5. Notification Center Updated
The notification appears in the notification center dropdown:
- Shows unread badge count
- Can be marked as read
- Can be deleted
- Includes action button to navigate to communication

## Installation

### 1. Apply Database Migration

The migration has already been applied:
```bash
# Migration: add_communication_notifications
# Creates trigger functions and triggers
```

### 2. Add to Root Layout

Add the `CommunicationNotificationsHandler` to your root layout:

```typescript
// src/app/layout.tsx
import { CommunicationNotificationsHandler } from "@/components/layout/communication-notifications-handler";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <CommunicationNotificationsHandler />
      </body>
    </html>
  );
}
```

### 3. Add Settings UI (Optional)

Add the settings component to your settings page:

```typescript
// src/app/(dashboard)/dashboard/settings/notifications/page.tsx
import { CommunicationNotificationsSettings } from "@/components/layout/communication-notifications-handler";

export default function NotificationsSettingsPage() {
  return (
    <div>
      <CommunicationNotificationsSettings />
    </div>
  );
}
```

## Usage

### Automatic Notifications
Notifications are **automatically created** when:
- A new communication is inserted into the `communications` table
- A new voicemail is inserted into the `voicemails` table

No manual action required! The database triggers handle everything.

### Manual Notifications (Advanced)
If you need to create custom notifications:

```typescript
import { useCommunicationNotificationsStore } from "@/lib/stores/communication-notifications-store";

// Show a call toast
useCommunicationNotificationsStore.getState().showCallToast(
  "John Smith",
  "(555) 123-4567",
  "incoming"
);

// Show an SMS toast
useCommunicationNotificationsStore.getState().showSMSToast(
  "Jane Doe",
  "(555) 987-6543",
  "Hey, can you help with my order?"
);

// Show an email toast
useCommunicationNotificationsStore.getState().showEmailToast(
  "Mike Johnson",
  "mike@example.com",
  "Question about invoice"
);

// Show a voicemail toast
useCommunicationNotificationsStore.getState().showVoicemailToast(
  "Sarah Williams",
  "(555) 456-7890",
  45 // duration in seconds
);
```

## Configuration

### User Settings
Users can configure notification preferences:
- **Sound notifications** - Play sound on new communications
- **Desktop notifications** - Show native browser notifications
- **Toast duration** - How long toasts remain visible (3-10 seconds)

Settings are stored in `localStorage`:
- `communication_sound_enabled`
- `communication_desktop_enabled`
- `communication_toast_duration`

### Permissions
Desktop notifications require browser permission. The system:
1. Automatically requests permission when desktop notifications are enabled
2. Shows "Enable" button if permission not yet granted
3. Disables toggle if permission denied (user must enable in browser settings)

## Customization

### Toast Styling
Toast appearance is configured in `communication-notifications-store.ts`:

```typescript
// Customize icon
icon: "📞"  // Change emoji or use Lucide React icon

// Customize duration
duration: 5000  // milliseconds

// Customize action
action: {
  label: "Reply",
  onClick: () => { /* custom action */ }
}
```

### Notification Sound
Replace `/sounds/notification.mp3` with your custom sound file.

### Desktop Notification
Customize in `showDesktopNotification()`:

```typescript
new Notification(title, {
  body: message,
  icon: "/icon-192x192.svg",  // Your app icon
  badge: "/icon-192x192.svg",
  requireInteraction: true,  // Keep visible until user interacts
})
```

## Troubleshooting

### Toasts Not Appearing
1. Check browser console for errors
2. Verify Supabase Realtime is configured and connected
3. Check that user has communication permissions (RLS policies)
4. Verify the `notifications` table has Realtime enabled

### Desktop Notifications Not Working
1. Check browser permission status (`Notification.permission`)
2. Verify HTTPS connection (required for desktop notifications)
3. Check that desktop notifications are enabled in settings
4. Test with the preview buttons in settings

### Sounds Not Playing
1. Check that sound is enabled in settings
2. Verify `/sounds/notification.mp3` exists
3. Check browser autoplay policies (user must interact with page first)
4. Test with the preview buttons in settings

### Database Triggers Not Firing
1. Verify migration was applied successfully
2. Check Supabase logs for trigger errors
3. Verify RLS policies allow notification inserts
4. Test by manually inserting a communication record

## Database Schema

### notifications Table
```sql
CREATE TABLE notifications (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  company_id uuid NOT NULL REFERENCES companies(id),
  type text NOT NULL,  -- 'message', 'alert', 'payment', 'job', 'team', 'system'
  priority text NOT NULL,  -- 'low', 'medium', 'high', 'urgent'
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  read_at timestamptz,
  action_url text,
  action_label text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### communication metadata
Notifications created from communications include this metadata:
```json
{
  "communication_id": "uuid",
  "communication_type": "call|sms|email",
  "customer_id": "uuid",
  "customer_name": "John Smith",
  "from_address": "phone|email",
  "created_at": "2025-01-01T12:00:00Z"
}
```

### voicemail metadata
Notifications created from voicemails include:
```json
{
  "voicemail_id": "uuid",
  "customer_id": "uuid",
  "customer_name": "Jane Doe",
  "from_number": "(555) 123-4567",
  "duration": 45,
  "audio_url": "https://...",
  "created_at": "2025-01-01T12:00:00Z"
}
```

## Performance

### Bundle Size
- **Zustand**: ~2KB gzipped
- **Sonner (toast)**: ~5KB gzipped
- **Total overhead**: ~7KB for full notification system

### Realtime Connection
- Single Supabase Realtime connection per user
- Automatic reconnection on network issues
- Efficient payload filtering (only user's notifications)

### Storage
- Settings stored in `localStorage` (no database queries)
- Notifications cached in Zustand store
- Automatic cleanup of old notifications (configurable)

## Security

### RLS Policies
All notification access is protected by Row Level Security:
```sql
-- Users can only view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- System can create notifications (via trigger)
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);
```

### Permissions Check
Notifications are only created for team members with communication permissions:
```sql
WHERE tm.role_id IN (
  SELECT id FROM roles
  WHERE permissions->>'can_view_communications' = 'true'
  OR permissions->>'can_manage_communications' = 'true'
)
```

## Future Enhancements

- [ ] Notification grouping (collapse multiple from same customer)
- [ ] Custom notification sounds per communication type
- [ ] Do Not Disturb mode (scheduled quiet hours)
- [ ] Notification filters (only urgent, only from VIP customers)
- [ ] Push notifications (mobile app)
- [ ] Email digest (daily summary of missed communications)
- [ ] AI-powered notification prioritization
- [ ] Custom toast templates per communication type

## API Reference

### useCommunicationNotificationsStore

```typescript
// Show toast notifications
showCommunicationToast(notification, options?)
showCallToast(name, phone, status, metadata?)
showVoicemailToast(name, phone, duration?)
showSMSToast(name, phone, message)
showEmailToast(name, email, subject)

// Dismiss toasts
dismissToast(id)
dismissAllToasts()

// Settings
setSoundEnabled(enabled: boolean)
setDesktopNotificationsEnabled(enabled: boolean)
setToastDuration(duration: number)

// Utility
playNotificationSound()
requestDesktopNotificationPermission(): Promise<boolean>
showDesktopNotification(title, body, data?)
```

### useNotificationsStore

```typescript
// State
notifications: Notification[]
unreadCount: number
isLoading: boolean

// Actions
setNotifications(notifications)
addNotification(notification)
updateNotification(id, updates)
removeNotification(id)

// Optimistic updates
optimisticMarkAsRead(id)
optimisticMarkAsUnread(id)
optimisticMarkAllAsRead()
optimisticDelete(id)

// Realtime
subscribe(userId)
unsubscribe()
```

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Test with the preview buttons in settings
4. Check browser console for errors
5. Verify Supabase configuration and RLS policies

---

**Built with:**
- Zustand (state management)
- Sonner (toast notifications)
- Supabase Realtime (live updates)
- PostgreSQL triggers (automatic notification creation)
