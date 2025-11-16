# Real Connection Quality Implementation

## Overview
The call toolbar now displays **real-time connection quality** data from the actual WebRTC call using Telnyx SDK.

---

## Changes Made

### 1. **New Hook: `use-call-quality.ts`** ✅

Created a custom hook to monitor WebRTC connection quality in real-time:

```tsx
src/hooks/use-call-quality.ts
```

#### Features:
- **Real-time monitoring** of WebRTC stats every 2 seconds
- **Quality metrics** extraction:
  - Packet loss percentage
  - Jitter (ms)
  - Round-trip time (RTT in ms)
  - Audio level
- **Quality calculation** based on industry standards:
  - **Excellent**: < 1% loss, < 30ms jitter, < 150ms RTT
  - **Good**: < 3% loss, < 50ms jitter, < 300ms RTT
  - **Poor**: Anything worse
  - **Unknown**: No data available yet

#### Usage:
```tsx
const { quality, metrics, isMonitoring } = useCallQuality({
  call: webrtc.currentCall,
  updateInterval: 2000, // Update every 2 seconds
});
```

---

### 2. **Updated Call Window Page** ✅

```tsx
src/app/call-window/page.tsx
```

#### Changes:
- Import `useCallQuality` and `useTelnyxWebRTC` hooks
- Initialize WebRTC connection to access the actual call object
- Monitor connection quality in real-time
- Pass real `connectionQuality` to `CallToolbar` instead of mock data

#### Code:
```tsx
// WebRTC hook for accessing the actual call object
const webrtc = useTelnyxWebRTC({
  username: process.env.NEXT_PUBLIC_TELNYX_SIP_USERNAME || "",
  password: process.env.NEXT_PUBLIC_TELNYX_SIP_PASSWORD || "",
  autoConnect: false,
});

// Real-time call quality monitoring
const { quality: connectionQuality, metrics: qualityMetrics } = useCallQuality({
  call: webrtc.currentCall,
  updateInterval: 2000, // Update every 2 seconds
});

// Pass to toolbar
<CallToolbar
  connectionQuality={connectionQuality || "unknown"}
  // ... other props
/>
```

---

### 3. **Updated Call Toolbar** ✅

```tsx
src/components/call-window/call-toolbar.tsx
```

#### Changes:
- Updated `connectionQuality` prop type to include `"unknown"`
- Added `getQualityVariant()` function for badge styling
- Enhanced badge with dynamic variant and tooltip

#### Quality Badge Variants:
- **Excellent**: `default` variant (green)
- **Good**: `secondary` variant (yellow)
- **Poor**: `destructive` variant (red)
- **Unknown**: `outline` variant (gray) with tooltip "Monitoring connection quality..."

#### Code:
```tsx
// Get connection quality badge variant
const getQualityVariant = () => {
  switch (connectionQuality) {
    case "excellent":
      return "default";
    case "good":
      return "secondary";
    case "poor":
      return "destructive";
    case "unknown":
    default:
      return "outline";
  }
};

// Render badge
<Badge 
  variant={getQualityVariant() as any} 
  className="font-mono text-[10px]"
  title={connectionQuality === "unknown" ? "Monitoring connection quality..." : undefined}
>
  {getConnectionIcon()}
  <span className="ml-1 capitalize">{connectionQuality}</span>
</Badge>
```

---

## How It Works

### 1. **WebRTC Stats Collection**
The `useCallQuality` hook accesses the underlying `RTCPeerConnection` from the Telnyx call object and calls `getStats()` to retrieve real-time metrics.

### 2. **Metric Extraction**
The hook processes the stats reports to extract:
- **Inbound RTP stats**: Packet loss and jitter
- **Candidate pair stats**: Round-trip time (RTT)
- **Media source stats**: Audio level

### 3. **Quality Calculation**
Based on the extracted metrics, the hook calculates the overall connection quality using industry-standard thresholds.

### 4. **Real-time Updates**
The hook updates the quality every 2 seconds (configurable) while a call is active.

### 5. **UI Display**
The `CallToolbar` component displays the quality with appropriate icon, color, and badge variant.

---

## Visual Indicators

### Connection Quality Badge:

```
┌─────────────────────────────────────────────────┐
│ [📶 Excellent]  ← Green badge, signal icon     │
│ [📡 Good]       ← Yellow badge, wifi icon      │
│ [📴 Poor]       ← Red badge, wifi-off icon     │
│ [📶 Unknown]    ← Gray badge, signal icon      │
└─────────────────────────────────────────────────┘
```

### Icons by Quality:
- **Excellent**: `<Signal />` in green
- **Good**: `<Wifi />` in yellow
- **Poor**: `<WifiOff />` in red
- **Unknown**: `<Signal />` in gray

---

## Benefits

### 1. **Real Data** ✅
- No more mock/hardcoded quality values
- Actual WebRTC metrics from Telnyx SDK
- Accurate representation of call quality

### 2. **Real-time Monitoring** ✅
- Updates every 2 seconds
- Reflects current connection state
- Helps CSRs identify call issues

### 3. **Industry Standards** ✅
- Quality thresholds based on VoIP best practices
- Packet loss, jitter, and RTT are standard metrics
- Reliable quality assessment

### 4. **User Experience** ✅
- Visual feedback on call quality
- Color-coded for quick recognition
- Tooltip for "unknown" state

---

## Quality Thresholds

### Excellent Quality:
- **Packet Loss**: < 1%
- **Jitter**: < 30ms
- **RTT**: < 150ms
- **User Experience**: Crystal clear audio, no issues

### Good Quality:
- **Packet Loss**: < 3%
- **Jitter**: < 50ms
- **RTT**: < 300ms
- **User Experience**: Minor issues, still acceptable

### Poor Quality:
- **Packet Loss**: ≥ 3%
- **Jitter**: ≥ 50ms
- **RTT**: ≥ 300ms
- **User Experience**: Noticeable audio issues, choppy

---

## Future Enhancements

### 1. **Detailed Metrics Display**
Add a popover or tooltip showing the actual metrics:
```tsx
<Popover>
  <PopoverTrigger>
    <Badge>Excellent</Badge>
  </PopoverTrigger>
  <PopoverContent>
    <div>
      <p>Packet Loss: 0.5%</p>
      <p>Jitter: 15ms</p>
      <p>RTT: 120ms</p>
      <p>Audio Level: 0.8</p>
    </div>
  </PopoverContent>
</Popover>
```

### 2. **Quality History**
Track quality over time and show a mini graph:
```tsx
const [qualityHistory, setQualityHistory] = useState<ConnectionQuality[]>([]);

useEffect(() => {
  setQualityHistory(prev => [...prev.slice(-20), quality]);
}, [quality]);
```

### 3. **Automatic Issue Detection**
Alert CSRs when quality degrades:
```tsx
useEffect(() => {
  if (quality === "poor") {
    toast.warning("Call quality is poor. Consider reconnecting.");
  }
}, [quality]);
```

### 4. **Quality Logs**
Save quality metrics to database for analytics:
```tsx
await supabase.from("call_quality_logs").insert({
  call_id: callId,
  quality,
  packet_loss: metrics.packetLoss,
  jitter: metrics.jitter,
  rtt: metrics.rtt,
  timestamp: new Date().toISOString(),
});
```

---

## Testing

### Manual Testing:
1. **Start a call** (inbound or outbound)
2. **Observe the badge** in the top-right corner of the call toolbar
3. **Watch for updates** every 2 seconds
4. **Simulate poor connection** (throttle network in DevTools)
5. **Verify badge changes** from "excellent" → "good" → "poor"

### Network Throttling in Chrome DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Select "Slow 3G" or "Fast 3G" from throttling dropdown
4. Observe quality badge change to "poor" or "good"

---

## Status

✅ **Hook created** (`use-call-quality.ts`)  
✅ **Call window updated** (real quality monitoring)  
✅ **Toolbar updated** (dynamic badge styling)  
✅ **Quality thresholds defined** (industry standards)  
✅ **Real-time updates** (every 2 seconds)  
✅ **Visual indicators** (icons and colors)  
✅ **No linter errors**  

The connection quality indicator now uses **real data** from the Telnyx WebRTC SDK! 🎉

