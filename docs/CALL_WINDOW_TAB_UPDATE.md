# Call Window - New Tab Implementation

## Summary of Changes

The call window now opens as a **new browser tab** instead of a popup window, providing a better user experience and avoiding popup blockers.

## How It Works Now

### 1. Outbound Calls (From Header Dialer)

**User Action**: Enters phone number → Clicks "Call"

**What Happens**:
1. Makes WebRTC call
2. Shows success toast: "Calling [Customer Name]"
3. **Immediately opens call window in new tab** ✨
4. User can switch between tabs (Cmd+Tab)

**File Updated**: `src/components/layout/phone-dropdown.tsx`

### 2. Incoming Calls (Bottom-Right Notification)

**User Action**: Receives call → Sees notification in bottom-right → Clicks "Answer"

**What Happens**:
1. ✨ **Notification appears first** in bottom-right corner
2. Shows caller info, customer data, AI insights
3. User can: Answer | Decline | Voicemail
4. **Only when user clicks "Answer"** → Opens call window in new tab
5. User stays on current page until they explicitly accept

**File Updated**: `src/components/layout/incoming-call-notification.tsx`

### 3. Resume Call (From Communications Page)

**User Action**: Clicks "Resume" on an ongoing call

**What Happens**:
1. Opens call window in new tab with existing call data

**File Updated**: `src/components/communication/communication-page-client.tsx`

### 4. Drag-to-Popup (Legacy Feature)

**User Action**: Drags active call notification beyond screen bounds

**What Happens**:
1. Opens call window in new tab

**File Updated**: `src/hooks/use-pop-out-drag.ts`

## Key Benefits

### ✅ New Tab Approach
- **No popup blockers** - Browsers don't block `_blank` tabs
- **Full screen** - Uses entire browser window automatically
- **Better UX** - Users can manage tabs normally
- **Simpler code** - No window sizing/positioning complexity
- **More reliable** - Works across all browsers

### ✅ Incoming Call Flow
- **Non-intrusive** - Shows notification first
- **User control** - Opens tab only on explicit accept
- **Stay in context** - User doesn't lose current page until ready

## Testing

### Test Outbound Call:
1. Click phone icon in header
2. Enter number: `+15551234567`
3. Click "Call" button
4. ✨ Should open call window in **new tab**

### Test Incoming Call:
1. Trigger incoming call (bottom-right notification appears)
2. Notification shows with Answer/Decline buttons
3. Click "Answer"
4. ✨ Opens call window in **new tab**
5. Original tab remains open underneath

### Test Resume Call:
1. Go to Communications page
2. Find an ongoing call
3. Click "Resume"
4. ✨ Opens call window in **new tab**

## Call Window Features (In New Tab)

When the tab opens, users see:

```
┌────────────────────────────────────────────────────────────┐
│ 🟢 Customer • [Mute] [Hold] [End] • ⏱️ 03:45 • [X]         │
├─────────────────────┬──────────────────────────────────────┤
│ 📝 Live Transcript  │ 📋 [Customer] [Job] [Appointment]    │
│ (scrollable)        │ (AI auto-fill with approve/reject)   │
│                     │                                       │
│ 📓 Smart Notes      │ Forms with visual indicators:        │
│ (auto-save)         │ 🔵 AI-filled (>80% confidence)       │
│                     │ 🟡 AI-suggested (60-80%)             │
│                     │ 🟢 User-entered                      │
└─────────────────────┴──────────────────────────────────────┘
```

## Code Changes

### Before (Popup Window):
```javascript
window.open(url, windowName, "width=420,height=720,left=100,top=100...")
```

### After (New Tab):
```javascript
window.open(url, "_blank", "noopener,noreferrer")
```

## Files Updated (5 files):

1. ✅ `src/lib/window/pop-out-manager.ts` - Core popup function
2. ✅ `src/hooks/use-pop-out-drag.ts` - Drag-to-tab
3. ✅ `src/components/layout/phone-dropdown.tsx` - Outbound calls
4. ✅ `src/components/layout/incoming-call-notification.tsx` - Incoming calls
5. ✅ `src/components/communication/communication-page-client.tsx` - Resume calls

## User Experience Flow

### Incoming Call Scenario:

```
1. Phone rings
   ↓
2. 🔔 Notification appears (bottom-right)
   • Shows caller info
   • Answer | Decline | Voicemail buttons
   ↓
3. User clicks "Answer"
   ↓
4. ✨ New tab opens with full call window
   • Live transcript starts
   • AI begins extracting data
   • Forms auto-fill as conversation progresses
   ↓
5. User works in call window tab
   • Customer tab auto-fills
   • Job tab auto-fills  
   • Appointment tab auto-fills
   • Can switch between tabs (Cmd+1/2/3)
   ↓
6. When done, clicks "End Call"
   • Can close tab (Cmd+W)
   • Or leave open for notes
```

**Status**: ✅ Complete and tested
**No linter errors**: All files clean

