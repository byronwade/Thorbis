# AI-Powered Call Window - Implementation Complete

## Overview

The call window has been completely redesigned with AI-powered auto-fill capabilities, real-time transcript analysis, and bi-directional sync with the main application.

## What Was Built

### 1. AI Infrastructure

#### API Route: `/api/ai/extract-call-data`
- Streams AI-extracted data from call transcripts
- Supports Groq (recommended for speed/cost) and Anthropic Claude Haiku
- Real-time extraction as conversation progresses
- Confidence scoring for each field

#### Extraction System
- **File**: `src/hooks/use-ai-extraction.ts`
- Replaces regex-based extraction with real AI
- Extracts:
  - Customer info: name, email, phone, company, full address
  - Job details: title, description, urgency, type, duration
  - Appointment needs: date, time, preferences, duration
- 2-second debounce for cost optimization

#### Extraction Prompts
- **File**: `src/lib/ai/extraction-prompts.ts`
- Specialized prompts for field service industry
- Structured JSON output with confidence scores
- Helper functions for job type detection

### 2. Full-Screen Call Window

#### New Layout (`src/app/call-window/page.tsx`)
```
┌─────────────────────────────────────────────────────────────┐
│  Compact Header: Customer • Controls • Timer • Close        │
├──────────────────┬──────────────────────────────────────────┤
│  Transcript (30%)│  Tabbed Forms (70%)                       │
│  ┌──────────────┐│  ┌────────────────────────────────────┐  │
│  │ Live         ││  │ [Customer] [Job] [Appointment]     │  │
│  │ Transcript   ││  │                                     │  │
│  │              ││  │  • AI-filled fields (blue border)  │  │
│  │              ││  │  • Suggested fields (yellow)       │  │
│  └──────────────┘│  │  • User-entered (green)            │  │
│  ┌──────────────┐│  │                                     │  │
│  │ Smart Notes  ││  │  [Accept All] [Reject All]         │  │
│  │ • Snippets   ││  │                                     │  │
│  │ • Auto-save  ││  │  Scrollable form content...        │  │
│  └──────────────┘│  └────────────────────────────────────┘  │
└──────────────────┴──────────────────────────────────────────┘
```

### 3. Tabbed Forms

#### Components Created
- **`src/components/call-window/tabbed-forms.tsx`**: Main tab container
- **`src/components/call-window/customer-intake-tab.tsx`**: Customer form
- **`src/components/call-window/job-creation-tab.tsx`**: Job creation form
- **`src/components/call-window/appointment-tab.tsx`**: Appointment scheduling

#### Features
- Three tabs: Customer | Job | Appointment
- Keyboard shortcuts: `Cmd+1`, `Cmd+2`, `Cmd+3` to switch tabs
- Visual indicators for AI-filled vs user-entered fields
- Bulk accept/reject AI suggestions
- Clean, simple design

### 4. Auto-Fill System

#### Data Sync Manager (`src/lib/call-window/data-sync-manager.ts`)
- Coordinates data flow between AI extraction and forms
- Tracks field sources (AI, user, synced)
- Handles conflicts intelligently
- Singleton pattern for state management

#### Auto-Fill Hook (`src/hooks/use-auto-fill.ts`)
- Confidence-based auto-fill:
  - **>80% confidence**: Auto-fills immediately (blue border)
  - **60-80% confidence**: Suggests for approval (yellow border)
  - **<60% confidence**: Skipped
- Manual override support
- Per-field approve/reject
- Bulk operations

#### Field States
1. **Empty**: No data
2. **AI-Filled**: Blue border, high confidence (>80%)
3. **AI-Suggested**: Yellow border, medium confidence (60-80%)
4. **User-Entered**: Green border, manually entered
5. **Synced**: From main app sync

### 5. Bi-Directional Sync

#### PostMessage Communication
- **File**: `src/lib/window/pop-out-manager.ts`
- New message types:
  - `FORM_DATA_UPDATE`: Call window → main app
  - `REQUEST_FORM_DATA`: Request current page data
  - `FORM_DATA_SYNC`: Main app → call window

#### Sync Hook (`src/hooks/use-call-window-sync.ts`)
- For use in main app pages (customer/new, job/new, appointment/new)
- Detects when call window is open
- Receives auto-fill data from call window
- Handles merge conflicts with user dialog

### 6. Smart Notes

#### Component (`src/components/call-window/smart-notes.tsx`)
- Quick snippets for common phrases
- Auto-save every 5 seconds
- Visual save status indicator
- Clean, distraction-free interface

## Setup Instructions

### 1. AI Provider Setup

Choose one provider (Groq recommended):

**Option A: Groq (Fast + Cheap)**
```bash
# Sign up at https://console.groq.com
# Get API key
echo "GROQ_API_KEY=your-api-key-here" >> .env.local
```

**Option B: Anthropic Claude**
```bash
# Sign up at https://console.anthropic.com
# Get API key
echo "ANTHROPIC_API_KEY=your-api-key-here" >> .env.local
```

### 2. Install Dependencies

```bash
npm install ai @ai-sdk/groq @ai-sdk/anthropic
```

### 3. Test the Call Window

```bash
npm run dev
# Visit: http://localhost:3000/call-window?callId=test-123
```

## Usage Guide

### Opening the Call Window

The call window should be opened when a call comes in:

```typescript
import { createPopOutWindow } from "@/lib/window/pop-out-manager";

// When call is received
const callWindow = createPopOutWindow(callId);
```

### Adding Sync to Main App Pages

Add to customer/new, job/new, or appointment/new pages:

```typescript
import { useCallWindowSync } from "@/hooks/use-call-window-sync";

export function YourFormComponent() {
  const [formData, setFormData] = useState({});
  
  const {
    hasCallWindow,
    showMergeDialog,
    useCallData,
    usePageData,
    mergeData,
  } = useCallWindowSync("customer", formData, setFormData);

  return (
    <>
      {/* Your form */}
      
      {/* Merge Dialog */}
      {showMergeDialog && (
        <Dialog>
          <DialogContent>
            <h3>Call Window Data Available</h3>
            <p>Choose how to handle data:</p>
            <Button onClick={useCallData}>Use Call Data</Button>
            <Button onClick={usePageData}>Keep Page Data</Button>
            <Button onClick={mergeData}>Merge Both</Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
```

## Keyboard Shortcuts

### Call Window
- `Cmd+1` / `Ctrl+1`: Switch to Customer tab
- `Cmd+2` / `Ctrl+2`: Switch to Job tab
- `Cmd+3` / `Ctrl+3`: Switch to Appointment tab
- `Cmd+S` / `Ctrl+S`: Save notes (in notes section)

### Forms
- Individual field approve/reject buttons appear on AI-filled fields
- "Accept All" / "Reject All" buttons for bulk operations

## Architecture

### Data Flow

```
Transcript Entries
    ↓
AI Extraction API (Groq/Claude)
    ↓
AI Extracted Data (with confidence scores)
    ↓
Data Sync Manager
    ↓
Auto-Fill Hook
    ↓
Form Components (with visual indicators)
    ↓
PostMessage
    ↓
Main Application Pages
```

### File Structure

```
src/
├── app/
│   ├── api/ai/extract-call-data/route.ts  # AI extraction endpoint
│   └── call-window/page.tsx                # Redesigned call window
├── components/call-window/
│   ├── tabbed-forms.tsx                    # Tab container
│   ├── customer-intake-tab.tsx             # Customer form
│   ├── job-creation-tab.tsx                # Job form
│   ├── appointment-tab.tsx                 # Appointment form
│   └── smart-notes.tsx                     # Notes with snippets
├── hooks/
│   ├── use-ai-extraction.ts                # AI extraction hook (updated)
│   ├── use-auto-fill.ts                    # Auto-fill logic
│   └── use-call-window-sync.ts             # Main app sync
├── lib/
│   ├── ai/extraction-prompts.ts            # AI prompts
│   ├── call-window/data-sync-manager.ts    # Data coordination
│   └── window/pop-out-manager.ts           # Updated with new messages
```

## Design Principles

1. **Simple & Clean**: Minimal clutter, focus on essential actions
2. **Fast Feedback**: Immediate visual indicators for all states
3. **Non-Disruptive**: Auto-fill doesn't interrupt user typing
4. **Confidence-Based**: Only auto-fills when AI is confident
5. **User Control**: Always allows manual override
6. **Cost-Conscious**: 2-second debounce, optimized prompts

## Visual Indicators

### Field Colors
- **Blue border + sparkle**: AI-filled (>80% confidence)
- **Yellow border + sparkle**: AI-suggested (60-80% confidence)
- **Green border**: User-entered
- **Standard**: Empty or synced from main app

### Status Indicators
- **Sparkles icon**: AI extraction in progress
- **Confidence badge**: Shows AI confidence percentage
- **Check/X buttons**: Appear on AI-filled fields for quick approval

## Cost Optimization

### Token Usage
- Groq pricing: ~$0.70 per 1M tokens
- Average call extraction: ~1,500 tokens = $0.001 per call
- With 1000 calls/month: ~$1/month

### Optimization Features
- 2-second debounce (only extracts after pause in conversation)
- Incremental extraction (only new transcript portions)
- Efficient prompts (focused instructions)
- Streaming for faster feedback

## Testing

### Manual Testing
1. Open call window: `/call-window?callId=test-123`
2. Add mock transcript entries (for now, use browser console)
3. Watch AI extraction populate fields
4. Test approve/reject functionality
5. Test tab switching with keyboard shortcuts

### Mock Transcript for Testing
```javascript
// In browser console on call window page
const { addEntry } = useTranscriptStore.getState();

addEntry({
  id: "1",
  speaker: "customer",
  text: "Hi, my name is John Smith from ABC Company. I need help with my HVAC system.",
  timestamp: new Date(),
});

addEntry({
  id: "2",
  speaker: "csr",
  text: "I can help with that. What seems to be the issue?",
  timestamp: new Date(),
});

addEntry({
  id: "3",
  speaker: "customer",
  text: "The AC stopped working. I'm at 123 Main Street, San Francisco, CA 94102. Can someone come tomorrow afternoon?",
  timestamp: new Date(),
});
```

## Next Steps

### Future Enhancements
1. **Transcript Highlighting**: Click names/dates in transcript to apply to forms
2. **AI Suggestions**: Template-based note suggestions based on call type
3. **Voice Commands**: "Save customer" voice command
4. **Historical Context**: Show previous calls/jobs for existing customers
5. **Smart Scheduling**: AI suggests best appointment times based on availability

### Integration Points
- Customer pages: Use `useCallWindowSync` to receive customer data
- Job pages: Auto-create jobs with AI-extracted data
- Appointment pages: Pre-fill scheduling with AI suggestions
- CRM sync: Push completed forms to external CRMs

## Troubleshooting

### AI Not Extracting
- Check API key is set in `.env.local`
- Check browser console for errors
- Verify API route is accessible: `/api/ai/extract-call-data`
- Test with `curl`:
  ```bash
  curl -X GET http://localhost:3000/api/ai/extract-call-data
  # Should return: {"status":"ok","activeProvider":"groq"}
  ```

### Fields Not Auto-Filling
- Check confidence scores in browser console
- Lower confidence threshold in `useAutoFill.ts` for testing
- Verify Data Sync Manager is initializing
- Check browser console for sync manager logs

### Call Window Not Opening
- Verify URL has `callId` parameter
- Check browser pop-up blocker settings
- Verify `pop-out-manager.ts` is configured correctly

## Support

For issues or questions:
1. Check browser console for errors
2. Review implementation files in `/src/components/call-window`
3. Test with mock data first
4. Verify AI provider API keys are valid

---

**Implementation Status**: ✅ Complete (All 17 todos finished)

**Files Created**: 10 new files, 3 modified files

**Lines of Code**: ~2,500 lines

**Ready for**: Testing and refinement

