# Quick Setup Guide - AI Call Window

## Step 1: Install Dependencies

```bash
cd /Users/byronwade/Stratos
npm install ai @ai-sdk/groq @ai-sdk/anthropic
```

## Step 2: Configure AI Provider

### Option A: Groq (Recommended - Fast & Cheap)

1. Sign up at https://console.groq.com
2. Create an API key
3. Add to `.env.local`:

```bash
GROQ_API_KEY=gsk_your_api_key_here
```

### Option B: Anthropic Claude

1. Sign up at https://console.anthropic.com
2. Create an API key
3. Add to `.env.local`:

```bash
ANTHROPIC_API_KEY=sk-ant-your_api_key_here
```

## Step 3: Test the Setup

### Test AI Endpoint

```bash
# Start dev server
npm run dev

# Test in new terminal
curl -X GET http://localhost:3000/api/ai/extract-call-data
```

Should return:
```json
{
  "status": "ok",
  "providers": {
    "groq": true,
    "anthropic": false
  },
  "activeProvider": "groq"
}
```

### Test Call Window

1. Open browser: `http://localhost:3000/call-window?callId=test-123`
2. You should see:
   - Compact header with call controls
   - Left sidebar: Transcript + Notes
   - Right side: Tabbed forms (Customer | Job | Appointment)

## Step 4: Test AI Extraction (Manual)

Since the transcript is currently mock data, you can test by:

1. Opening browser console on call window page
2. Manually adding transcript entries:

```javascript
const { useTranscriptStore } = require("@/lib/stores/transcript-store");
const store = useTranscriptStore.getState();

// Add customer message
store.addEntry({
  id: "1",
  speaker: "customer",
  text: "Hi, my name is Sarah Johnson from Tech Solutions. I need HVAC repair at 456 Oak Avenue, Austin, TX 78701. Can you schedule someone for tomorrow afternoon?",
  timestamp: new Date(),
});

// Wait 2 seconds, then check if fields are auto-filled
```

3. Watch the forms auto-fill with AI-extracted data!

## Expected Behavior

### After ~2 seconds (debounce):
1. AI extraction starts (blue banner: "AI is analyzing...")
2. Fields auto-fill with extracted data:
   - **Customer tab**: Sarah Johnson, Tech Solutions, address fields
   - **Job tab**: "HVAC Repair", urgency auto-detected
   - **Appointment tab**: Tomorrow afternoon, duration suggested
3. Blue borders on high-confidence fields
4. Yellow borders on medium-confidence fields
5. Accept/Reject buttons appear on AI-filled fields

## Keyboard Shortcuts

- `Cmd+1`: Customer tab
- `Cmd+2`: Job tab
- `Cmd+3`: Appointment tab
- Click "Accept All" / "Reject All" for bulk operations

## Troubleshooting

### No AI extraction happening
- Check API key in `.env.local`
- Restart dev server after adding key
- Check browser console for errors

### Fields not auto-filling
- Wait 2 seconds after transcript update (debounce)
- Check confidence scores in browser console
- Verify transcript has enough data

### Call window not opening
- Ensure URL has `?callId=test-123` parameter
- Check browser pop-up blocker
- Try different browser

## What's Next?

1. **Integration**: Connect to real call system (Telnyx already in codebase)
2. **Testing**: Test with real call transcripts
3. **Refinement**: Adjust AI prompts based on accuracy
4. **Main App Sync**: Add `useCallWindowSync` to customer/job/appointment pages

## Cost Estimate

With Groq:
- ~1,500 tokens per call extraction
- $0.70 per 1M tokens
- **~$0.001 per call** (1/10th of a cent!)
- 1000 calls/month = ~$1/month

Very cost-effective! 🎉

