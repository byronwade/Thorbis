# Minimal Call Popup - Implementation Plan

## Overview

Replace the current full-screen call window approach with a **minimalistic bottom-right popup** that appears for ALL calls (incoming and outbound), giving CSRs the option to expand to full customer intake when needed.

---

## Current Flow (Problems)

### Incoming Calls:
1. Call comes in → Large notification appears (bottom-right)
2. User clicks "Answer" → Opens FULL call window in new tab
3. **Problem**: CSR is forced into customer intake even if they don't need it

### Outbound Calls:
1. User clicks call → Opens FULL call window in new tab immediately
2. **Problem**: CSR is forced into customer intake even if it's just a quick call

---

## New Flow (Solution)

### ALL Calls (Incoming & Outbound):
1. Call starts → **Minimal popup appears** (bottom-right corner)
2. Popup shows:
   - ✅ Caller ID & customer info
   - ✅ Core controls (accept, end, mute, transfer, video)
   - ✅ **Expand button** (optional)
3. User can:
   - **Handle call** directly from popup (most common)
   - **Expand** to full customer intake (when needed)

---

## Benefits

### For CSRs:
✅ **Less intrusive** - Small popup doesn't block workflow  
✅ **Faster** - No tab switching for quick calls  
✅ **Flexible** - Expand only when needed  
✅ **Consistent** - Same UI for incoming and outgoing  

### For System:
✅ **Better performance** - No heavy page loads for simple calls  
✅ **Cleaner UX** - Minimalistic design  
✅ **Reduced complexity** - Single popup component  

---

## Component Design

### Minimal Popup (`CallPopupMinimal`)

**Location**: Fixed bottom-right corner  
**Size**: 320px wide, auto height  
**Animation**: Slide up with fade in  

**Sections**:

1. **Header** (compact)
   - Status indicator (incoming/active/ended)
   - Call duration
   - Close button

2. **Caller Info** (minimal)
   - Avatar (48px)
   - Name + "Customer" badge (if known)
   - Phone number
   - Email (if available)

3. **Controls** (single row)
   - Left side:
     - Accept (incoming only) - Green
     - Mute/Unmute
     - Video on/off
     - Transfer
   - Right side:
     - **Expand** button (opens full intake)
     - End call - Red

---

## Implementation Steps

### 1. ✅ Create `CallPopupMinimal` Component
**File**: `src/components/call-window/call-popup-minimal.tsx`
- [x] Minimalistic design
- [x] All core controls
- [x] Expand button
- [x] Caller info display

### 2. Update `IncomingCallNotification`
**File**: `src/components/layout/incoming-call-notification.tsx`

**Changes**:
- Replace `IncomingCallView` with `CallPopupMinimal` for incoming calls
- Replace `ActiveCallView` with `CallPopupMinimal` for active calls
- Keep `VideoConferenceView` for video calls (full screen)
- Remove auto-open of call window on answer

**New behavior**:
```tsx
// Incoming call
if (call.status === "incoming") {
  return (
    <CallPopupMinimal
      status="incoming"
      onAnswer={handleAnswerCall}
      onExpand={handleExpandToIntake}
      // ... other props
    />
  );
}

// Active call
if (call.status === "active") {
  return (
    <CallPopupMinimal
      status="active"
      onExpand={handleExpandToIntake}
      // ... other props
    />
  );
}
```

### 3. Add `handleExpandToIntake` Function

Opens the full customer intake page in a new tab:

```tsx
const handleExpandToIntake = () => {
  const params = new URLSearchParams({
    callId,
    ...(companyId && { companyId }),
    ...(customerId && { customerId }),
    ...(call.caller?.number && { from: call.caller.number }),
    direction: webrtc.currentCall?.direction || "inbound",
  });
  
  window.open(
    `/call-window?${params.toString()}`,
    "_blank",
    "noopener,noreferrer"
  );
};
```

### 4. Update Outbound Call Flow
**File**: `src/components/layout/phone-dropdown.tsx`

**Changes**:
- Remove auto-open of call window
- Let `IncomingCallNotification` show the minimal popup
- Popup will automatically appear when call starts

**Before**:
```tsx
const call = await webrtc.makeCall(normalizedTo, fromNumber);
window.open(`/call-window?callId=${call.id}`, "_blank"); // ❌ Remove this
```

**After**:
```tsx
const call = await webrtc.makeCall(normalizedTo, fromNumber);
// ✅ Popup will appear automatically via IncomingCallNotification
```

### 5. Handle Video Calls
**Keep existing behavior**:
- When video is activated → Show full `VideoConferenceView`
- When video ends → Return to minimal popup

### 6. Remove Unused Components
**Optional cleanup**:
- `ActiveCallView` - Replace with `CallPopupMinimal`
- `IncomingCallView` - Replace with `CallPopupMinimal`
- Keep `MinimizedCallWidget` for now (different use case)

---

## UI/UX Details

### Popup Appearance

**Incoming Call**:
```
┌────────────────────────────────┐
│ 🔵 Incoming    00:05      ✕   │
├────────────────────────────────┤
│  👤  John Doe         Customer │
│      +1 (555) 123-4567         │
│      john@example.com          │
├────────────────────────────────┤
│ [📞] [🎤] [📹] [↔️]  [⤢] [☎️] │
└────────────────────────────────┘
```

**Active Call**:
```
┌────────────────────────────────┐
│ 🟢 Active      02:34      ✕   │
├────────────────────────────────┤
│  👤  John Doe         Customer │
│      +1 (555) 123-4567         │
│      john@example.com          │
├────────────────────────────────┤
│ [🎤] [📹] [↔️]         [⤢] [☎️] │
└────────────────────────────────┘
```

### Button Sizes
- All buttons: `h-9 w-9` (36px)
- Rounded: `rounded-full`
- Gap: `gap-1` (4px)

### Colors
- Accept: `bg-emerald-500`
- Mute (active): `variant="destructive"`
- Video (active): `variant="default"`
- Others: `variant="ghost"`
- Expand: `variant="outline"`
- End: `variant="destructive"`

### Animations
- Slide up: `translate-y-4 → translate-y-0`
- Fade in: `opacity-0 → opacity-100`
- Duration: `300ms`
- Easing: `ease-out`

---

## Customer Intake Page

### When Expanded
The full call window (`/call-window`) opens in a new tab with:
- ✅ Full toolbar with all controls
- ✅ Customer sidebar with all data
- ✅ Tabbed forms (Customer/Job/Appointment)
- ✅ Transcript panel
- ✅ Smart notes
- ✅ AI auto-fill

### Sync Between Popup and Tab
- **Popup** remains visible in main window
- **Tab** shows full intake form
- **Both** control the same call
- **State** synced via PostMessage API

---

## Edge Cases

### 1. Multiple Calls
- Show multiple popups stacked vertically
- Each popup independent
- Offset by 10px

### 2. Popup Closed
- Call continues in background
- Can reopen via call indicator badge
- Or expand to full intake

### 3. Video Activated
- Popup disappears
- Full `VideoConferenceView` takes over
- When video ends, popup returns

### 4. Call Ends
- Popup fades out after 2 seconds
- Or user clicks close immediately

---

## Testing Checklist

### Incoming Calls
- [ ] Popup appears bottom-right
- [ ] Shows caller info correctly
- [ ] Accept button works
- [ ] Mute/unmute works
- [ ] Video toggle works
- [ ] Transfer opens modal
- [ ] Expand opens full intake in new tab
- [ ] End call works
- [ ] Close button hides popup

### Outbound Calls
- [ ] Popup appears when call starts
- [ ] No auto-open of full window
- [ ] All controls work
- [ ] Expand opens full intake
- [ ] Call duration updates

### Video Calls
- [ ] Video toggle switches to full view
- [ ] Ending video returns to popup
- [ ] All controls still work

### Edge Cases
- [ ] Multiple calls show multiple popups
- [ ] Closing popup doesn't end call
- [ ] Reopening popup shows correct state
- [ ] Sync works between popup and tab

---

## Migration Path

### Phase 1: Create Component ✅
- [x] Build `CallPopupMinimal` component
- [x] Add all controls and styling
- [x] Test in isolation

### Phase 2: Integrate (Next)
- [ ] Update `IncomingCallNotification`
- [ ] Replace incoming call view
- [ ] Replace active call view
- [ ] Add expand handler

### Phase 3: Update Outbound
- [ ] Remove auto-open from phone dropdown
- [ ] Test outbound call flow
- [ ] Verify popup appears

### Phase 4: Polish
- [ ] Add animations
- [ ] Test all edge cases
- [ ] Update documentation
- [ ] Remove old components

---

## Files to Modify

### New Files:
- ✅ `src/components/call-window/call-popup-minimal.tsx`

### Modified Files:
- [ ] `src/components/layout/incoming-call-notification.tsx`
- [ ] `src/components/layout/phone-dropdown.tsx`

### Optional Cleanup:
- [ ] Remove `ActiveCallView` (if fully replaced)
- [ ] Remove `IncomingCallView` (if fully replaced)

---

## Success Criteria

✅ **Minimal popup appears for ALL calls**  
✅ **CSRs can handle calls without opening full intake**  
✅ **Expand button opens full intake when needed**  
✅ **All call controls work from popup**  
✅ **No auto-opening of tabs**  
✅ **Smooth animations and transitions**  
✅ **Consistent experience for incoming and outgoing**  

---

## Next Steps

1. **Test `CallPopupMinimal` component** in browser
2. **Integrate into `IncomingCallNotification`**
3. **Update outbound call flow**
4. **Test end-to-end**
5. **Get CSR feedback**

---

**Status**: Phase 1 Complete ✅  
**Next**: Phase 2 - Integration  
**Timeline**: Ready for testing

