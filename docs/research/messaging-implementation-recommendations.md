# Stratos Messaging Implementation Recommendations

**Based on:** Competitor Weakness Analysis (ServiceTitan & Housecall Pro)
**Date:** November 17, 2025
**Purpose:** Actionable technical recommendations to build superior messaging system

---

## 1. Architecture Recommendations

### 1.1 Multi-Channel Message Hub

**Problem Solved:** Both competitors have fragmented communication (SMS separate from email, in-app messages disconnected)

**Implementation:**
```typescript
// Unified message interface
interface Message {
  id: string;
  conversation_id: string;
  channel: 'sms' | 'email' | 'in_app' | 'voice' | 'whatsapp';
  direction: 'inbound' | 'outbound';
  sender_id: string;
  recipient_id: string;
  content: MessageContent;
  metadata: MessageMetadata;
  thread_id?: string; // For threaded replies
  parent_message_id?: string; // For nested conversations
  created_at: timestamp;
  read_at?: timestamp;
  delivered_at?: timestamp;
}

interface Conversation {
  id: string;
  customer_id: string;
  job_id?: string;
  property_id?: string;
  participants: Participant[];
  channels: Channel[];
  tags: string[];
  status: 'active' | 'archived' | 'snoozed';
  assigned_to?: string;
  last_message_at: timestamp;
  created_at: timestamp;
}
```

**Database Schema:**
- `conversations` - Parent container for all related messages
- `messages` - Individual messages across all channels
- `conversation_participants` - Who's involved (customers, techs, CSRs)
- `message_threads` - Threading/nesting support
- `message_attachments` - Photos, documents, media

---

## 2. Telnyx Integration Enhancements

### 2.1 Messaging Profile Setup (Avoiding ServiceTitan's Toll-Free MMS Issue)

**Problem Solved:** ServiceTitan can't receive photos on toll-free numbers

**Implementation Strategy:**

```typescript
// Messaging Profile Configuration
interface MessagingProfile {
  id: string;
  company_id: string;

  // Both toll-free AND local numbers for complete coverage
  sms_numbers: {
    toll_free: string[]; // For SMS only
    local: string[];     // For SMS + MMS
  };

  // Intelligent number selection
  default_outbound_sms: string;  // Toll-free (cheaper, better branding)
  default_outbound_mms: string;  // Local (MMS capability)

  // Auto-switching logic
  auto_select_number: boolean;   // True: system picks best number for message type

  // Fallback rules
  fallback_strategy: 'local' | 'toll_free' | 'any';
}

// Smart number selection function
async function selectOutboundNumber(
  messageType: 'sms' | 'mms',
  messagingProfile: MessagingProfile
): Promise<string> {
  if (messageType === 'mms') {
    // Always use local for MMS (photos, videos)
    return messagingProfile.sms_numbers.local[0];
  }

  if (messageType === 'sms') {
    // Prefer toll-free for SMS (better branding, lower cost)
    return messagingProfile.default_outbound_sms || messagingProfile.sms_numbers.toll_free[0];
  }

  // Fallback
  return messagingProfile.sms_numbers.local[0];
}
```

**User-Facing Feature:**
- Auto-provision both toll-free AND local numbers during onboarding
- System automatically uses correct number type based on message content
- Users never think about number limitations
- Display single "business number" to customers (smart routing on backend)

### 2.2 Rich Media Handling

**Problem Solved:** ServiceTitan's clunky photo upload, Housecall Pro's messy attachment emails

**Implementation:**

```typescript
// MMS attachment handling
interface MediaAttachment {
  id: string;
  message_id: string;
  type: 'image' | 'video' | 'document' | 'voice';
  url: string;
  thumbnail_url?: string;
  file_size: number;
  mime_type: string;
  original_filename?: string;
  metadata: {
    width?: number;
    height?: number;
    duration?: number; // for video/voice
    exif_data?: object; // for photos with location/timestamp
  };
}

// Bulk upload endpoint
async function uploadBulkAttachments(
  files: File[],
  conversation_id: string,
  user_id: string
): Promise<MediaAttachment[]> {
  // 1. Upload all files to Supabase Storage in parallel
  const uploads = await Promise.all(
    files.map(file => uploadToStorage(file, conversation_id))
  );

  // 2. Generate thumbnails for images/videos
  const withThumbnails = await Promise.all(
    uploads.map(async (upload) => {
      if (upload.type === 'image' || upload.type === 'video') {
        upload.thumbnail_url = await generateThumbnail(upload.url);
      }
      return upload;
    })
  );

  // 3. Store attachment records
  return await supabase
    .from('message_attachments')
    .insert(withThumbnails)
    .select();
}

// Mobile app feature: Bulk photo picker
// - Select multiple photos at once
// - Show upload progress for each
// - Generate thumbnails locally for instant preview
// - Background upload with retry logic
```

**UX Features:**
- Drag-and-drop multiple files on web
- Multi-select from camera roll on mobile
- Inline preview before sending
- Progress indicators for each upload
- Automatic thumbnail generation
- Click to expand full-size view

---

## 3. Message Threading & Conversation UX

### 3.1 Thread Support (Fixing Housecall Pro's Flat Structure)

**Problem Solved:** Housecall Pro doesn't support threaded replies or nested conversations

**Implementation:**

```typescript
interface MessageThread {
  id: string;
  conversation_id: string;
  parent_message_id: string;
  thread_messages: Message[];
  participants: Participant[];
  created_at: timestamp;
  last_reply_at: timestamp;
}

// Thread creation
async function createThread(
  parentMessageId: string,
  replyContent: string,
  userId: string
): Promise<MessageThread> {
  // Create thread if doesn't exist
  let thread = await getOrCreateThread(parentMessageId);

  // Add reply to thread
  const reply = await createMessage({
    conversation_id: thread.conversation_id,
    thread_id: thread.id,
    parent_message_id: parentMessageId,
    content: replyContent,
    sender_id: userId,
  });

  // Update thread last_reply_at
  await supabase
    .from('message_threads')
    .update({ last_reply_at: new Date() })
    .eq('id', thread.id);

  return thread;
}
```

**UX Implementation:**
- Hover over message → "Reply to this message" option appears
- Threads collapse/expand (show 3 latest replies + "View X more")
- Visual indentation for threaded replies
- Click thread to see full conversation in side panel
- Mobile: Swipe right on message to reply in thread

### 3.2 Modern Chat Features

**Problem Solved:** Housecall Pro lacks emoji reactions, read receipts, typing indicators

**Implementation:**

```typescript
// Message reactions
interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction_type: '👍' | '❤️' | '😂' | '🎉' | '✅' | '❌'; // extendable
  created_at: timestamp;
}

// Real-time presence with Supabase Realtime
const channel = supabase.channel(`conversation:${conversationId}`)
  .on('presence', { event: 'sync' }, () => {
    const newState = channel.presenceState();
    updateOnlineUsers(newState);
  })
  .on('broadcast', { event: 'typing' }, ({ payload }) => {
    showTypingIndicator(payload.user_id, payload.is_typing);
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        user_id: currentUser.id,
        online_at: new Date().toISOString(),
      });
    }
  });

// Typing indicator throttling
let typingTimeout: NodeJS.Timeout;
function handleTyping() {
  clearTimeout(typingTimeout);

  channel.send({
    type: 'broadcast',
    event: 'typing',
    payload: { user_id: currentUser.id, is_typing: true }
  });

  typingTimeout = setTimeout(() => {
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { user_id: currentUser.id, is_typing: false }
    });
  }, 3000);
}

// Read receipts
async function markAsRead(messageId: string, userId: string) {
  await supabase
    .from('message_reads')
    .upsert({
      message_id: messageId,
      user_id: userId,
      read_at: new Date(),
    });

  // Broadcast read status to other participants
  channel.send({
    type: 'broadcast',
    event: 'message_read',
    payload: { message_id: messageId, user_id: userId }
  });
}
```

**UX Features:**
- Click emoji icon next to message → select reaction
- See who reacted (hover/click on reaction count)
- "Alice is typing..." indicator
- Double checkmark (✓✓) when read by all recipients
- Gray checkmark when delivered but unread
- Desktop notifications for new messages (with permission)

---

## 4. Smart Automation & Sequences

### 4.1 Automated Follow-up System (ServiceTitan's Missing Feature)

**Problem Solved:** ServiceTitan doesn't auto-follow-up on quotes or unpaid invoices

**Implementation:**

```typescript
interface MessageSequence {
  id: string;
  name: string;
  trigger_event: 'estimate_sent' | 'invoice_unpaid' | 'job_completed' | 'appointment_scheduled';
  trigger_conditions?: object; // e.g., { days_overdue: 7 }

  steps: SequenceStep[];

  active: boolean;
  company_id: string;
}

interface SequenceStep {
  id: string;
  sequence_id: string;
  order: number;
  delay_value: number;
  delay_unit: 'minutes' | 'hours' | 'days';

  channel: 'sms' | 'email' | 'both';
  template_id: string;

  conditions?: object; // e.g., skip if customer replied
  stop_on_reply?: boolean;
  stop_on_booking?: boolean;
}

// Example: Estimate follow-up sequence
const estimateFollowUp: MessageSequence = {
  name: "Estimate Follow-up",
  trigger_event: "estimate_sent",
  steps: [
    {
      order: 1,
      delay_value: 1,
      delay_unit: 'days',
      channel: 'sms',
      template: "Hi {{customer_name}}, just checking in on your estimate for {{service_name}}. Any questions?",
      stop_on_reply: true,
    },
    {
      order: 2,
      delay_value: 3,
      delay_unit: 'days',
      channel: 'email',
      template: "Reminder: Your estimate expires in 4 days...",
      conditions: { no_reply_to_step: 1 },
      stop_on_reply: true,
    },
    {
      order: 3,
      delay_value: 7,
      delay_unit: 'days',
      channel: 'both',
      template: "Last chance! We'd love to work with you...",
      conditions: { no_reply_to_step: [1, 2] },
      stop_on_booking: true,
    }
  ]
};

// Sequence execution engine
async function processSequences() {
  // Run every 5 minutes
  const pendingSteps = await supabase
    .from('sequence_step_executions')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_at', new Date());

  for (const step of pendingSteps) {
    try {
      // Check conditions
      if (shouldSkipStep(step)) {
        await markStepSkipped(step.id);
        continue;
      }

      // Send message
      await sendSequenceMessage(step);

      // Schedule next step
      await scheduleNextStep(step);

      // Mark completed
      await markStepCompleted(step.id);
    } catch (error) {
      await markStepFailed(step.id, error);
    }
  }
}
```

**Pre-Built Sequences:**
1. **Estimate Follow-up** - Day 1, Day 3, Day 7
2. **Invoice Reminder** - Day 3 overdue, Day 7, Day 14, Day 30
3. **Appointment Reminder** - 3 days before, 1 day before, 2 hours before
4. **Post-Job Review Request** - 1 day after completion, 3 days if no review
5. **Maintenance Reminder** - 30 days before due, 2 weeks, 1 week
6. **Seasonal Campaign** - Annual furnace check, spring AC tune-up

**Admin UI:**
- Visual sequence builder (drag-and-drop steps)
- Template variable picker
- Preview mode (see what customer receives)
- A/B testing support (test different messages)
- Analytics dashboard (open rates, reply rates, conversion rates)

### 4.2 Smart Scheduling (Fixing Housecall Pro's 9 AM Limitation)

**Problem Solved:** Housecall Pro forces all reminders at 9 AM, no customization

**Implementation:**

```typescript
interface CustomerPreferences {
  customer_id: string;

  // Preferred contact times
  contact_time_preference: 'morning' | 'afternoon' | 'evening' | 'anytime';
  specific_hours?: { start: string; end: string }; // e.g., "14:00" - "18:00"

  // Timezone (auto-detected or manually set)
  timezone: string; // "America/Los_Angeles"

  // Frequency preferences
  reminder_frequency: 'all' | 'important_only' | 'minimal';

  // Channel preferences
  preferred_channel: 'sms' | 'email' | 'both';
  do_not_disturb: {
    start_time?: string; // "22:00"
    end_time?: string;   // "08:00"
  };
}

// Smart send time calculation
function calculateOptimalSendTime(
  customer: Customer,
  messageType: string,
  scheduledDate: Date
): Date {
  const prefs = customer.communication_preferences;
  const timezone = prefs.timezone || 'America/Los_Angeles';

  let sendTime = scheduledDate;

  // Apply customer time preference
  if (prefs.contact_time_preference === 'morning') {
    sendTime = setTimeInTimezone(sendTime, '09:00', timezone);
  } else if (prefs.contact_time_preference === 'afternoon') {
    sendTime = setTimeInTimezone(sendTime, '14:00', timezone);
  } else if (prefs.contact_time_preference === 'evening') {
    sendTime = setTimeInTimezone(sendTime, '18:00', timezone);
  } else if (prefs.specific_hours) {
    sendTime = setTimeInTimezone(sendTime, prefs.specific_hours.start, timezone);
  }

  // Respect do-not-disturb
  if (prefs.do_not_disturb.start_time && prefs.do_not_disturb.end_time) {
    if (isDuringDoNotDisturb(sendTime, prefs.do_not_disturb, timezone)) {
      // Shift to end of DND period
      sendTime = setTimeInTimezone(sendTime, prefs.do_not_disturb.end_time, timezone);
    }
  }

  // Avoid weekends for business messages (optional)
  if (isWeekend(sendTime) && messageType === 'invoice_reminder') {
    sendTime = nextBusinessDay(sendTime);
  }

  return sendTime;
}
```

**Admin Configuration:**
- Company-wide defaults (e.g., "Send all reminders at 10 AM")
- Per-message-type overrides (e.g., "Urgent messages: send immediately")
- Customer-level preferences (captured during onboarding or profile update)
- AI learning (track when customers respond, optimize future sends)

**Customer-Facing Feature:**
- Text reply "LATER 3PM" to reschedule reminder to 3 PM
- Text "MORNING" to set preference for morning messages
- Settings page: "When should we contact you?"

---

## 5. Desktop + Mobile Unified Experience

### 5.1 Web Interface (Solving Housecall Pro's Mobile-Only Problem)

**Problem Solved:** Housecall Pro texting limited to mobile, office staff can't text from desktop

**Tech Stack:**
- Next.js 16 with React 19
- Supabase Realtime for instant sync
- shadcn/ui components for messaging UI
- Telnyx Web SDK for WebRTC (future voice/video)

**Implementation:**

```typescript
// Web messaging component
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useMessagingStore } from "@/lib/stores/messaging-store";

export function MessagingInbox() {
  const supabase = createClient();
  const { conversations, addMessage, updateConversation } = useMessagingStore();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to real-time message updates
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          addMessage(payload.new as Message);

          // Desktop notification
          if (document.hidden && Notification.permission === 'granted') {
            new Notification('New message', {
              body: payload.new.content,
              icon: '/logo.png',
              badge: '/badge.png'
            });
          }

          // Play sound
          playNotificationSound();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex h-screen">
      {/* Conversation list */}
      <ConversationList
        conversations={conversations}
        selectedId={selectedConversation}
        onSelect={setSelectedConversation}
      />

      {/* Message thread */}
      <MessageThread
        conversationId={selectedConversation}
      />

      {/* Customer sidebar */}
      <CustomerSidebar
        conversationId={selectedConversation}
      />
    </div>
  );
}
```

**UX Features:**
- Gmail-style 3-column layout (conversations | messages | customer info)
- Keyboard shortcuts (J/K to navigate, R to reply, E to archive)
- Drag-and-drop attachments
- Inline emoji picker
- Rich text formatting (bold, italic, links)
- Message templates dropdown
- Quick replies (pre-defined common responses)
- Search across all conversations (instant results)

### 5.2 Mobile App Parity

**Implementation:**
- React Native app (iOS + Android)
- Identical feature set to web (no compromises)
- Offline mode with sync queue
- Push notifications
- Biometric authentication

**Mobile-Specific Features:**
- Quick reply from notification (no app open required)
- Voice-to-text for message composition
- Share from camera roll directly into conversation
- Location sharing (send address for directions)
- Barcode/QR scanner (for equipment IDs)

### 5.3 Real-Time Sync Architecture

**Implementation:**

```typescript
// Zustand store with Supabase Realtime sync
import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

interface MessagingState {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // conversation_id -> messages[]
  typingUsers: Record<string, string[]>; // conversation_id -> user_ids[]

  // Actions
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
}

export const useMessagingStore = create<MessagingState>((set, get) => ({
  conversations: [],
  messages: {},
  typingUsers: {},

  loadConversations: async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('conversations')
      .select(`
        *,
        last_message:messages(content, created_at),
        customer:customers(name, phone, email)
      `)
      .order('last_message_at', { ascending: false })
      .limit(50);

    set({ conversations: data || [] });
  },

  loadMessages: async (conversationId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users(name, avatar_url),
        attachments:message_attachments(*)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: data || []
      }
    }));
  },

  sendMessage: async (conversationId: string, content: string) => {
    const supabase = createClient();

    // Optimistic update
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId,
      content,
      created_at: new Date().toISOString(),
      status: 'sending',
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), tempMessage]
      }
    }));

    // Send to Telnyx
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, content })
      .select()
      .single();

    if (error) {
      // Update temp message with error status
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: state.messages[conversationId].map(msg =>
            msg.id === tempMessage.id ? { ...msg, status: 'failed' } : msg
          )
        }
      }));
    } else {
      // Replace temp message with real message
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: state.messages[conversationId].map(msg =>
            msg.id === tempMessage.id ? data : msg
          )
        }
      }));
    }
  },

  markAsRead: async (conversationId: string) => {
    const supabase = createClient();
    const messageIds = get().messages[conversationId]
      ?.filter(msg => !msg.read_at)
      .map(msg => msg.id) || [];

    if (messageIds.length === 0) return;

    await supabase
      .from('message_reads')
      .upsert(
        messageIds.map(id => ({
          message_id: id,
          user_id: supabase.auth.getUser().id,
          read_at: new Date()
        }))
      );
  },
}));
```

---

## 6. Search & Organization Features

### 6.1 Full-Text Search (Both Platforms Lack This)

**Implementation:**

```sql
-- PostgreSQL full-text search setup
ALTER TABLE messages ADD COLUMN search_vector tsvector;

CREATE INDEX messages_search_idx ON messages USING GIN(search_vector);

CREATE OR REPLACE FUNCTION messages_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.subject, '')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER messages_search_update BEFORE INSERT OR UPDATE
ON messages FOR EACH ROW EXECUTE FUNCTION messages_search_trigger();

-- Search function
CREATE OR REPLACE FUNCTION search_messages(
  p_company_id uuid,
  p_query text,
  p_limit int DEFAULT 50
)
RETURNS TABLE (
  message_id uuid,
  conversation_id uuid,
  content text,
  created_at timestamp,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.conversation_id,
    m.content,
    m.created_at,
    ts_rank(m.search_vector, websearch_to_tsquery('english', p_query)) AS rank
  FROM messages m
  JOIN conversations c ON c.id = m.conversation_id
  WHERE c.company_id = p_company_id
    AND m.search_vector @@ websearch_to_tsquery('english', p_query)
  ORDER BY rank DESC, m.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
```

**UI Implementation:**

```typescript
// Search component
export function MessageSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useDebouncedCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) return;

    setLoading(true);
    const { data } = await supabase.rpc('search_messages', {
      p_company_id: currentUser.company_id,
      p_query: searchQuery,
      p_limit: 50
    });

    setResults(data || []);
    setLoading(false);
  }, 300);

  return (
    <Command>
      <CommandInput
        placeholder="Search messages..."
        value={query}
        onValueChange={(value) => {
          setQuery(value);
          handleSearch(value);
        }}
      />
      <CommandList>
        {loading && <CommandLoading>Searching...</CommandLoading>}
        {results.map((result) => (
          <CommandItem
            key={result.message_id}
            onSelect={() => openConversation(result.conversation_id, result.message_id)}
          >
            <MessageSearchResult result={result} query={query} />
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}
```

**Search Features:**
- Instant search as you type (debounced)
- Highlight matching terms in results
- Filter by date range, channel, customer, tag
- Save searches for quick access
- Search operators: "exact phrase", -exclude, from:john, has:attachment

### 6.2 Tags & Organization

**Implementation:**

```typescript
interface ConversationTag {
  id: string;
  name: string;
  color: string;
  company_id: string;
}

interface ConversationTagAssignment {
  conversation_id: string;
  tag_id: string;
  assigned_by: string;
  assigned_at: timestamp;
}

// Auto-tagging rules
interface AutoTagRule {
  id: string;
  company_id: string;
  tag_id: string;

  conditions: {
    message_contains?: string[];
    customer_segment?: string;
    job_type?: string;
    message_count_threshold?: number;
  };

  active: boolean;
}

// Apply auto-tags on new messages
async function applyAutoTags(message: Message) {
  const rules = await getActiveAutoTagRules(message.company_id);

  for (const rule of rules) {
    if (shouldApplyTag(message, rule.conditions)) {
      await supabase
        .from('conversation_tag_assignments')
        .insert({
          conversation_id: message.conversation_id,
          tag_id: rule.tag_id,
          assigned_by: 'system'
        });
    }
  }
}
```

**Tag Examples:**
- 🔴 Urgent
- 💰 Payment Issue
- 📅 Needs Scheduling
- ⭐ VIP Customer
- 🔧 Technical Question
- 📝 Quote Request
- ✅ Resolved
- 🔄 Follow-up Required

**UX:**
- Color-coded tags in conversation list
- Filter by tag (multi-select)
- Bulk tag operations
- Tag shortcuts (keyboard: #urgent)
- Auto-suggest tags based on content

---

## 7. Compliance & Security

### 7.1 Opt-In/Opt-Out Management (Fixing ServiceTitan's Complexity)

**Problem Solved:** ServiceTitan has complex opt-out triggers causing delivery failures

**Implementation:**

```typescript
interface ConsentRecord {
  id: string;
  customer_id: string;
  channel: 'sms' | 'email' | 'phone';

  status: 'opted_in' | 'opted_out' | 'pending';
  opted_in_at?: timestamp;
  opted_out_at?: timestamp;

  source: 'explicit' | 'implicit' | 'imported';
  ip_address?: string;
  user_agent?: string;

  // Audit trail
  history: ConsentEvent[];
}

interface ConsentEvent {
  event: 'opt_in' | 'opt_out' | 'reconfirm';
  timestamp: timestamp;
  source: string;
  metadata?: object;
}

// Automatic opt-out handling
async function handleInboundMessage(message: InboundMessage) {
  const keywords = ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'];
  const content = message.content.toUpperCase().trim();

  if (keywords.includes(content)) {
    // Record opt-out
    await supabase
      .from('consent_records')
      .update({
        status: 'opted_out',
        opted_out_at: new Date()
      })
      .eq('customer_id', message.customer_id)
      .eq('channel', 'sms');

    // Send confirmation
    await sendMessage({
      to: message.from,
      content: "You've been unsubscribed from text messages. Reply START to opt back in.",
    });

    // Flag in UI for staff awareness
    await createNotification({
      type: 'customer_opted_out',
      customer_id: message.customer_id,
      message: `${message.customer_name} opted out of SMS`
    });
  }

  if (content === 'START' || content === 'UNSTOP') {
    // Re-opt-in
    await supabase
      .from('consent_records')
      .update({
        status: 'opted_in',
        opted_in_at: new Date()
      })
      .eq('customer_id', message.customer_id)
      .eq('channel', 'sms');

    await sendMessage({
      to: message.from,
      content: "You're re-subscribed! We'll keep you updated.",
    });
  }
}

// Pre-send consent check
async function canSendMessage(
  customerId: string,
  channel: 'sms' | 'email'
): Promise<{ allowed: boolean; reason?: string }> {
  const consent = await supabase
    .from('consent_records')
    .select('*')
    .eq('customer_id', customerId)
    .eq('channel', channel)
    .single();

  if (!consent || consent.status === 'opted_out') {
    return {
      allowed: false,
      reason: `Customer opted out of ${channel} on ${consent?.opted_out_at}`
    };
  }

  if (consent.status === 'pending') {
    return {
      allowed: false,
      reason: `Waiting for ${channel} opt-in confirmation`
    };
  }

  return { allowed: true };
}
```

**Admin Features:**
- Dashboard showing consent status for all customers
- Bulk import consent records from previous system
- Export consent audit trail for compliance
- Automatic TCPA compliance documentation

### 7.2 Message Archiving & Retention

**Implementation:**

```typescript
// Retention policy
interface RetentionPolicy {
  company_id: string;

  retention_period_days: number; // e.g., 2555 (7 years for financial records)

  archive_after_days: number; // Move to cold storage after 1 year

  delete_after_retention: boolean; // Auto-delete or keep indefinitely
}

// Scheduled archiving job (runs daily)
async function archiveOldMessages() {
  const policy = await getCompanyRetentionPolicy();

  const archiveDate = new Date();
  archiveDate.setDate(archiveDate.getDate() - policy.archive_after_days);

  const oldMessages = await supabase
    .from('messages')
    .select('*')
    .lt('created_at', archiveDate.toISOString())
    .eq('archived', false);

  for (const message of oldMessages) {
    // Move to archive storage (Supabase Storage or S3 Glacier)
    await archiveMessage(message);

    // Update message record
    await supabase
      .from('messages')
      .update({ archived: true, archived_at: new Date() })
      .eq('id', message.id);
  }
}

// Search includes archived messages with note
async function searchMessagesIncludingArchive(query: string) {
  const results = await searchMessages(query);

  // Mark archived results
  return results.map(result => ({
    ...result,
    is_archived: result.archived,
    note: result.archived ? 'Archived - may take longer to load' : null
  }));
}
```

---

## 8. Analytics & Insights

### 8.1 Message Performance Dashboard

**Metrics to Track:**

```typescript
interface MessageAnalytics {
  // Volume metrics
  total_sent: number;
  total_received: number;
  by_channel: Record<'sms' | 'email' | 'in_app', number>;

  // Engagement metrics
  delivery_rate: number; // delivered / sent
  open_rate: number; // read / delivered
  reply_rate: number; // replied / delivered
  avg_response_time_minutes: number;

  // Conversion metrics
  conversations_to_bookings: number;
  conversations_to_estimates: number;
  revenue_influenced: number;

  // Team metrics
  avg_first_response_time: number;
  avg_resolution_time: number;
  customer_satisfaction_score?: number;

  // Time periods
  period: 'today' | 'week' | 'month' | 'quarter' | 'year';
  compared_to_previous: {
    change_percent: number;
    trend: 'up' | 'down' | 'flat';
  };
}

// Real-time dashboard query
CREATE OR REPLACE FUNCTION get_messaging_analytics(
  p_company_id uuid,
  p_start_date timestamp,
  p_end_date timestamp
)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_sent', (
      SELECT COUNT(*) FROM messages
      WHERE company_id = p_company_id
        AND direction = 'outbound'
        AND created_at BETWEEN p_start_date AND p_end_date
    ),
    'total_received', (
      SELECT COUNT(*) FROM messages
      WHERE company_id = p_company_id
        AND direction = 'inbound'
        AND created_at BETWEEN p_start_date AND p_end_date
    ),
    'reply_rate', (
      SELECT ROUND(
        COUNT(DISTINCT conversation_id) FILTER (WHERE direction = 'inbound')::numeric /
        NULLIF(COUNT(DISTINCT conversation_id) FILTER (WHERE direction = 'outbound'), 0) * 100,
        2
      )
      FROM messages
      WHERE company_id = p_company_id
        AND created_at BETWEEN p_start_date AND p_end_date
    ),
    'avg_response_time_minutes', (
      SELECT ROUND(AVG(EXTRACT(EPOCH FROM (response_time)) / 60))
      FROM (
        SELECT
          m1.conversation_id,
          MIN(m2.created_at) - m1.created_at AS response_time
        FROM messages m1
        JOIN messages m2 ON m2.conversation_id = m1.conversation_id
        WHERE m1.company_id = p_company_id
          AND m1.direction = 'inbound'
          AND m2.direction = 'outbound'
          AND m2.created_at > m1.created_at
          AND m1.created_at BETWEEN p_start_date AND p_end_date
        GROUP BY m1.id, m1.created_at, m1.conversation_id
      ) response_times
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

**Dashboard Visualizations:**
- Line chart: Message volume over time
- Pie chart: Messages by channel (SMS vs Email vs In-App)
- Bar chart: Response times by team member
- Gauge: Current reply rate vs goal
- Heatmap: Busiest hours/days for messages
- Funnel: Conversation → Booking → Revenue

### 8.2 Individual Performance Tracking

**Team Member Scorecard:**

```typescript
interface TeamMemberPerformance {
  user_id: string;
  period: DateRange;

  metrics: {
    conversations_handled: number;
    avg_first_response_minutes: number;
    avg_messages_per_conversation: number;
    customer_satisfaction_avg: number;

    // Efficiency
    conversations_resolved: number;
    resolution_rate: number;

    // Revenue impact
    bookings_influenced: number;
    revenue_generated: number;
  };

  // Benchmarks
  team_average: metrics;
  ranking: number; // 1 = best performer
}
```

**Gamification:**
- Leaderboard for fastest response times
- Badges for milestones (100 conversations handled, 5-star reviews)
- Team goals with progress bars
- Personal improvement tracking

---

## 9. Integration Architecture

### 9.1 Webhook System for External Tools

**Implementation:**

```typescript
interface Webhook {
  id: string;
  company_id: string;

  event_types: string[]; // ['message.received', 'conversation.created', 'message.sent']
  url: string;
  secret: string;

  active: boolean;
  retry_policy: {
    max_attempts: number;
    backoff_strategy: 'linear' | 'exponential';
  };
}

// Send webhook
async function sendWebhook(
  webhook: Webhook,
  event: WebhookEvent
) {
  const signature = createHmacSignature(webhook.secret, event);

  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Stratos-Signature': signature,
        'X-Stratos-Event': event.type,
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }

    await logWebhookSuccess(webhook.id, event.id);
  } catch (error) {
    await logWebhookFailure(webhook.id, event.id, error);
    await scheduleWebhookRetry(webhook, event);
  }
}
```

**Webhook Events:**
- `message.received` - Inbound message from customer
- `message.sent` - Outbound message sent
- `message.delivered` - Carrier confirmed delivery
- `message.failed` - Send failed (invalid number, blocked, etc.)
- `conversation.created` - New conversation started
- `conversation.assigned` - Conversation assigned to team member
- `customer.opted_out` - Customer unsubscribed

### 9.2 API for Third-Party Access

**REST API Endpoints:**

```typescript
// GET /api/v1/conversations
// List all conversations with pagination, filtering
GET /api/v1/conversations?customer_id={id}&status=active&limit=50

// GET /api/v1/conversations/:id/messages
// Get all messages in a conversation
GET /api/v1/conversations/abc-123/messages

// POST /api/v1/messages
// Send a new message
POST /api/v1/messages
{
  "conversation_id": "abc-123",
  "content": "Hello!",
  "channel": "sms",
  "attachments": ["https://..."]
}

// PUT /api/v1/conversations/:id
// Update conversation (assign, tag, archive)
PUT /api/v1/conversations/abc-123
{
  "assigned_to": "user-456",
  "tags": ["urgent", "payment-issue"],
  "status": "in_progress"
}

// POST /api/v1/conversations/:id/notes
// Add internal note to conversation
POST /api/v1/conversations/abc-123/notes
{
  "content": "Customer said they'll pay next week",
  "private": true
}
```

**Authentication:**
- API keys (for server-to-server)
- OAuth 2.0 (for user-scoped access)
- JWT tokens (for mobile apps)

**Rate Limiting:**
- 100 requests/minute for read operations
- 60 requests/minute for write operations
- Burst allowance for legitimate spikes
- 429 response with Retry-After header

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

**Week 1-2:**
- ✅ Database schema (conversations, messages, attachments)
- ✅ Telnyx integration (SMS/MMS send/receive)
- ✅ Basic web UI (conversation list, message thread)
- ✅ Real-time sync with Supabase Realtime

**Week 3-4:**
- ✅ Mobile app (React Native)
- ✅ Push notifications
- ✅ File upload (photos, documents)
- ✅ Opt-in/opt-out handling

### Phase 2: Advanced Features (Weeks 5-8)

**Week 5-6:**
- ✅ Message threading
- ✅ Emoji reactions
- ✅ Typing indicators & read receipts
- ✅ Search (full-text)

**Week 7-8:**
- ✅ Message templates
- ✅ Quick replies
- ✅ Tags & organization
- ✅ Filters & saved searches

### Phase 3: Automation (Weeks 9-12)

**Week 9-10:**
- ✅ Sequence builder UI
- ✅ Automated follow-ups (estimates, invoices)
- ✅ Smart scheduling
- ✅ Customer preferences

**Week 11-12:**
- ✅ Analytics dashboard
- ✅ Team performance tracking
- ✅ A/B testing for sequences
- ✅ Conversion tracking

### Phase 4: Integrations (Weeks 13-16)

**Week 13-14:**
- ✅ REST API
- ✅ Webhook system
- ✅ API documentation
- ✅ Rate limiting & auth

**Week 15-16:**
- ✅ Zapier integration
- ✅ Native integrations (QuickBooks, Google Calendar)
- ✅ CSV import/export
- ✅ Migration tools (from ServiceTitan/Housecall Pro)

---

## 11. Success Metrics

### Key Performance Indicators (KPIs)

**User Adoption:**
- % of team using messaging daily
- Messages sent per user per day
- Desktop vs mobile usage ratio

**Efficiency Gains:**
- Reduction in time spent on manual follow-ups
- Increase in reply rate (vs email)
- Decrease in average response time

**Revenue Impact:**
- Estimate acceptance rate (with vs without automated follow-ups)
- Days to payment (for invoices)
- Customer retention rate

**Customer Satisfaction:**
- Response time satisfaction score
- Communication channel preference (track shifts to SMS)
- NPS impact from improved communication

### Competitive Benchmarks

**vs ServiceTitan:**
- ✅ 50% faster photo sharing (bulk upload vs one-at-a-time)
- ✅ 100% desktop accessibility (no mobile-only limitations)
- ✅ 30%+ increase in estimate conversions (automated follow-ups)
- ✅ Zero toll-free MMS issues (smart number routing)

**vs Housecall Pro:**
- ✅ Unlimited customization (vs fixed 9 AM reminders)
- ✅ Advanced threading (vs flat messages)
- ✅ Modern chat UX (reactions, typing indicators, etc.)
- ✅ No tier restrictions (all features in base plan)

---

## 12. Technical Considerations

### 12.1 Scalability

**Message Volume Handling:**
- Telnyx handles carrier routing (99.9% uptime SLA)
- Supabase Postgres can handle 100K+ messages/day
- Realtime subscriptions: 500 concurrent connections per project (upgrade if needed)
- CDN for media attachments (Supabase Storage + Cloudflare)

**Database Optimization:**
- Partitioning for messages table (by month)
- Archived messages in cold storage
- Composite indexes on (conversation_id, created_at)
- Materialized views for analytics queries

### 12.2 Security

**Data Protection:**
- End-to-end encryption for sensitive messages (optional feature)
- PII redaction in logs
- RBAC for team access (admin, manager, agent)
- Audit logs for all message access

**Compliance:**
- TCPA compliant opt-in/opt-out
- GDPR right to deletion (purge customer data)
- HIPAA compliance (if handling health info)
- SOC 2 Type II certification (Supabase + Telnyx both certified)

### 12.3 Monitoring & Observability

**Metrics to Track:**
- Message send latency (p50, p95, p99)
- Delivery success rate
- Telnyx webhook processing time
- Realtime connection drops
- Database query performance

**Alerting:**
- Delivery rate drops below 95%
- Response time exceeds 5 seconds
- Webhook failures exceed 10% of events
- Disk usage above 80%

**Tools:**
- Supabase Dashboard (database metrics)
- Telnyx Portal (carrier analytics)
- Sentry (error tracking)
- Datadog or New Relic (APM)

---

## 13. Migration Strategy (for Customers Switching from Competitors)

### 13.1 Data Import

**From ServiceTitan:**
```typescript
// CSV import format
interface ServiceTitanMessageExport {
  customer_id: string;
  customer_name: string;
  phone_number: string;
  message_date: string;
  message_time: string;
  direction: 'inbound' | 'outbound';
  message_content: string;
  technician_name?: string;
}

// Import function
async function importServiceTitanMessages(csvFile: File) {
  const records = await parseCSV(csvFile);

  for (const record of records) {
    // Find or create customer
    let customer = await findCustomerByPhone(record.phone_number);
    if (!customer) {
      customer = await createCustomer({
        name: record.customer_name,
        phone: record.phone_number,
      });
    }

    // Find or create conversation
    let conversation = await findConversationByCustomer(customer.id);
    if (!conversation) {
      conversation = await createConversation({
        customer_id: customer.id,
      });
    }

    // Import message
    await createMessage({
      conversation_id: conversation.id,
      content: record.message_content,
      direction: record.direction,
      created_at: parseDateTime(record.message_date, record.message_time),
      imported_from: 'servicetitan',
    });
  }
}
```

**From Housecall Pro:**
- Similar CSV import process
- Preserve conversation threads if exported in chronological order
- Map Housecall Pro customer IDs to Stratos customer IDs
- Import opt-out status from exported data

### 13.2 Onboarding Workflow

**Step 1: Data Export (from old system)**
- Provide export instructions for ServiceTitan/Housecall Pro
- Required fields: customers, phone numbers, message history

**Step 2: Telnyx Setup**
- Provision toll-free number (SMS)
- Provision local number (SMS + MMS)
- Configure messaging profile
- Test send/receive

**Step 3: Data Import**
- Upload CSV files
- Preview imported data
- Confirm customer matching
- Import messages (preserves history)

**Step 4: Team Training**
- Interactive demo of messaging inbox
- Practice sending messages
- Set up templates
- Configure automated sequences

**Step 5: Go Live**
- Update website with new SMS number
- Send announcement to customers
- Monitor delivery rates
- Adjust settings as needed

---

## Conclusion

This implementation plan addresses **every weakness identified** in the competitor analysis:

### ServiceTitan Weaknesses → Stratos Solutions:
- ❌ Toll-free MMS limitation → ✅ Smart number routing (toll-free + local)
- ❌ No automated follow-ups → ✅ Full sequence automation
- ❌ Clunky photo upload → ✅ Bulk upload, drag-and-drop
- ❌ Complex opt-out → ✅ Automatic STOP/START handling
- ❌ 1500 char limit → ✅ No artificial limits
- ❌ Poor search → ✅ Full-text search across all channels

### Housecall Pro Weaknesses → Stratos Solutions:
- ❌ Mobile-only texting → ✅ Full web + mobile parity
- ❌ No threading → ✅ Modern threaded conversations
- ❌ No reactions → ✅ Emoji reactions, typing indicators
- ❌ Fixed 9 AM reminders → ✅ Smart scheduling, customer preferences
- ❌ Email clutter → ✅ Unified inbox, clean UI
- ❌ Limited templates → ✅ Unlimited custom templates
- ❌ Tier restrictions → ✅ All features in base plan

### Unique Stratos Advantages:
- ✅ **AI-powered features** (smart replies, sentiment analysis)
- ✅ **Unified communications** (SMS + email + in-app + voice in one thread)
- ✅ **Best-in-class UX** (matches consumer messaging apps)
- ✅ **Revenue-focused** (conversion tracking, influenced revenue)
- ✅ **Zero artificial limits** (no tier gates, no time restrictions)

By implementing these features, Stratos will deliver a **messaging experience superior to both major competitors** while addressing the exact pain points their users complain about.
