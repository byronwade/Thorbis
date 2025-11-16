# Call Window Layout Flip - Complete

## ✅ Layout Restructure

Successfully **flipped the call window layout** to match your requirements:

---

## New Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         Call Toolbar                            │
│  Customer Info | Call Controls | Connection Quality | Close     │
├──────────────────────┬──────────────────────────────────────────┤
│                      │                                          │
│  LEFT (35%)          │  RIGHT (65%)                             │
│  ─────────────       │  ──────────────────────────────────────  │
│                      │                                          │
│  📝 Transcript       │  👤 Customer Sidebar (40%)               │
│  ─────────────       │  ──────────────────────────────────────  │
│                      │  • Customer Overview                     │
│  [≡] Live Transcript │  • Jobs (3)                              │
│      (12) Ctrl+1  ▼  │  • Invoices (5)                          │
│  ─────────────────── │  • Appointments (2)                      │
│  Search...           │  • Properties (1)                        │
│  ─────────────────── │  • Equipment (4)                         │
│  CSR: Hello...       │                                          │
│  Customer: Hi...     │  ──────────────────────────────────────  │
│  CSR: How can...     │                                          │
│  ...                 │  📋 Forms (60%)                          │
│                      │  ──────────────────────────────────────  │
│                      │  [Customer] [Job] [Appointment]          │
│                      │                                          │
│                      │  Form fields...                          │
│                      │                                          │
└──────────────────────┴──────────────────────────────────────────┘
```

---

## Before vs After

### Before:
```
LEFT (35%):  Customer Sidebar
RIGHT (65%): Transcript (top 40%) + Forms (bottom 60%)
```

### After:
```
LEFT (35%):  Transcript (with collapsible design)
RIGHT (65%): Customer Sidebar (top 40%) + Forms (bottom 60%)
```

---

## Changes Made

### 1. **Page Layout** (`src/app/call-window/page.tsx`)

**Old Structure:**
```tsx
<div className="flex flex-1 overflow-hidden">
  {/* Left: Customer Sidebar (35%) */}
  <div className="w-[35%] border-r bg-muted/20">
    <CustomerSidebar />
  </div>

  {/* Right: Transcript + Forms (65%) */}
  <div className="flex flex-1 flex-col overflow-hidden">
    <div className="h-[40%] border-b">
      <TranscriptPanel />
    </div>
    <div className="flex-1 overflow-hidden">
      <TabbedForms />
    </div>
  </div>
</div>
```

**New Structure:**
```tsx
<div className="flex flex-1 overflow-hidden">
  {/* Left: Transcript (35%) */}
  <div className="w-[35%] border-r bg-muted/20">
    <TranscriptPanel />
  </div>

  {/* Right: Customer Sidebar + Forms (65%) */}
  <div className="flex flex-1 flex-col overflow-hidden">
    <div className="h-[40%] border-b">
      <CustomerSidebar />
    </div>
    <div className="flex-1 overflow-hidden">
      <TabbedForms />
    </div>
  </div>
</div>
```

---

### 2. **Transcript Panel** (`src/components/communication/transcript-panel.tsx`)

**Converted to UnifiedAccordion structure:**

```tsx
const sections: UnifiedAccordionSection[] = [
  {
    id: "transcript",
    title: "Live Transcript",
    icon: <MessageSquare className="h-4 w-4" />,
    count: entries.length,
    actions: (
      <div className="flex items-center gap-2">
        {isRecording && <RecordingIndicator />}
        <CopyButton />
        <ExportButton />
      </div>
    ),
    content: (
      <div className="flex flex-col">
        {/* Search */}
        <div className="border-border border-b p-3">
          <SearchInput />
        </div>

        {/* Transcript entries */}
        <div className="h-[calc(100vh-28rem)] space-y-3 overflow-y-auto p-4">
          {entries.map(entry => <TranscriptEntry />)}
        </div>

        {/* Auto-scroll indicator */}
        {!autoScroll && <AutoScrollButton />}
      </div>
    ),
  },
];

return (
  <ScrollArea className="h-full">
    <div className="flex flex-col gap-4 p-4">
      <section className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="flex flex-col gap-4 p-0">
          <UnifiedAccordion
            sections={sections}
            defaultOpenSection="transcript"
            storageKey="call-window-transcript-panel"
            enableReordering={false}
          />
        </div>
      </section>
    </div>
  </ScrollArea>
);
```

---

## New Features

### Transcript Panel (Left Side):

1. **✅ UnifiedAccordion Structure**
   - Matches customer sidebar design
   - Same border, background, and styling
   - Collapsible (Ctrl+1 shortcut)

2. **✅ Header with Actions**
   - Live Transcript title
   - Entry count badge
   - Recording indicator (when active)
   - Copy button
   - Export button

3. **✅ Integrated Search**
   - Search bar inside the collapsible
   - Filters transcript entries
   - Persistent search state

4. **✅ Scrollable Content**
   - Fixed height with overflow
   - Auto-scroll to latest
   - Manual scroll detection
   - "New messages below" indicator

5. **✅ Keyboard Shortcut**
   - `Ctrl+1` - Toggle transcript panel

---

### Customer Sidebar (Right Top):

1. **✅ All Collapsible Sections**
   - Customer Overview (Ctrl+1)
   - Jobs (Ctrl+2)
   - Invoices (Ctrl+3)
   - Appointments (Ctrl+4)
   - Properties (Ctrl+5)
   - Equipment (Ctrl+6)

2. **✅ Scrollable**
   - ScrollArea wrapper
   - Smooth scrolling
   - Fixed height (40% of right panel)

---

### Forms (Right Bottom):

- **✅ Tabbed Interface**
  - Customer tab
  - Job tab
  - Appointment tab
- **✅ Full width**
  - 60% of right panel height
  - Scrollable content

---

## Visual Hierarchy

### Left Side (Transcript):
```
┌─────────────────────────────┐
│ [≡] Live Transcript (12) ▼ │ ← Collapsible header
│     Copy | Export          │ ← Actions
├─────────────────────────────┤
│ Search...                   │ ← Search bar
├─────────────────────────────┤
│ CSR: Hello, how can I...    │
│ Customer: Hi, I need...     │ ← Transcript entries
│ CSR: I can help with...     │
│ ...                         │
├─────────────────────────────┤
│ ↓ New messages below        │ ← Auto-scroll indicator
└─────────────────────────────┘
```

### Right Side (Customer + Forms):
```
┌─────────────────────────────┐
│ [≡] Customer Overview ▼     │
│ [≡] Jobs (3) ▶              │ ← Customer sidebar
│ [≡] Invoices (5) ▶          │   (40% height)
│ [≡] Appointments (2) ▶      │
│ ...                         │
├─────────────────────────────┤
│ [Customer] [Job] [Appt]     │ ← Tabbed forms
│                             │   (60% height)
│ Form fields...              │
│                             │
└─────────────────────────────┘
```

---

## Benefits

### 1. **Better Information Flow**
✅ Transcript on left (natural reading flow)  
✅ Customer data on right (reference while filling forms)  
✅ Forms below customer data (context-aware)  

### 2. **Consistent Design**
✅ Both transcript and customer sidebar use UnifiedAccordion  
✅ Same styling, borders, backgrounds  
✅ Same keyboard shortcuts pattern  
✅ Same collapsible behavior  

### 3. **Improved UX**
✅ Transcript always visible (left side)  
✅ Customer data easily accessible (top right)  
✅ Forms have more horizontal space  
✅ Natural workflow: Read transcript → Check customer → Fill form  

### 4. **Keyboard Navigation**
✅ `Ctrl+1` - Toggle transcript  
✅ `Ctrl+1-6` - Toggle customer sections (when focused on right)  
✅ Tab switching for forms  

---

## Files Modified

1. ✅ `src/app/call-window/page.tsx` - Layout structure flipped
2. ✅ `src/components/communication/transcript-panel.tsx` - Converted to UnifiedAccordion

---

## Testing Checklist

### Layout:
- [ ] Transcript appears on left (35% width)
- [ ] Customer sidebar appears on top right (40% height)
- [ ] Forms appear on bottom right (60% height)
- [ ] All sections are scrollable independently

### Transcript Panel:
- [ ] Collapsible header works
- [ ] Copy button copies transcript
- [ ] Export button downloads JSON
- [ ] Search filters entries
- [ ] Auto-scroll works
- [ ] Manual scroll disables auto-scroll
- [ ] "New messages below" button appears
- [ ] Recording indicator shows when recording
- [ ] Entry count badge updates
- [ ] Keyboard shortcut (Ctrl+1) works

### Customer Sidebar:
- [ ] All 6 sections collapsible
- [ ] Keyboard shortcuts (Ctrl+1-6) work
- [ ] Count badges show correct numbers
- [ ] Empty states display when no data
- [ ] Data displays correctly in each section

### Forms:
- [ ] Tab switching works
- [ ] Forms are scrollable
- [ ] Forms have full width

---

## Status

✅ **Complete** - No linter errors  
✅ **Layout Flipped** - Transcript left, Customer right  
✅ **Consistent Design** - Both use UnifiedAccordion  
✅ **Ready** - For testing  

---

**Last Updated:** 2025-01-15  
**Layout:** Transcript (Left 35%) | Customer + Forms (Right 65%)  
**Design Pattern:** UnifiedAccordion for both panels  
**Keyboard Shortcuts:** ✅ Enabled  

