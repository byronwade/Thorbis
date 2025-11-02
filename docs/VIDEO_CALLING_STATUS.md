# Video Calling - Current Status & Implementation Guide

**Date**: January 31, 2025
**Status**: 🎨 UI Complete, Backend Pending
**Complexity**: High
**Estimated Time**: 12-16 hours

---

## ✅ What Already Exists

### 1. Complete Video Conference UI (`/src/components/layout/video-conference.tsx`)

**Massive Component**: 920+ lines of fully-designed video conferencing interface

**Features Implemented (UI Only)**:

#### View Modes
- **Gallery View**: 10-participant grid layout
- **Speaker View**: Focused on active speaker with thumbnails
- **Picture-in-Picture**: Minimized floating window

#### Controls
- ✅ Camera on/off toggle
- ✅ Microphone mute/unmute
- ✅ Screen sharing toggle
- ✅ Recording start/stop
- ✅ Virtual background toggle
- ✅ Grid/speaker view switch
- ✅ End video button
- ✅ Settings panel

#### Visual Elements
- ✅ Remote video placeholder
- ✅ Local video preview (pip)
- ✅ Participant avatars when video off
- ✅ Speaking indicators
- ✅ Muted indicators
- ✅ Connection quality badge
- ✅ HD Quality indicator
- ✅ Participant count badge

#### Advanced Features
- ✅ Reactions (👍, ❤️, 😂, etc.)
- ✅ Live chat panel
- ✅ Participants list
- ✅ Screen share view
- ✅ Meeting info display
- ✅ Virtual background indicator

#### Design
- Vercel-inspired aesthetic
- Dark mode optimized
- Smooth animations
- Professional gradients
- Hover effects
- Responsive layout

---

### 2. Video State Management (`/src/lib/store.ts` - useUIStore)

**Video State**:
```typescript
{
  videoStatus: "off" | "requesting" | "ringing" | "connected" | "declined";
  isLocalVideoEnabled: boolean;
  isRemoteVideoEnabled: boolean;
  isScreenSharing: boolean;
  connectionQuality: "excellent" | "good" | "poor";
}
```

**Actions Available**:
- `requestVideo()` - Start video call request
- `endVideo()` - End video call
- `toggleLocalVideo()` - Toggle camera
- `toggleScreenShare()` - Toggle screen sharing
- `toggleVirtualBackground()` - Toggle virtual background
- `addReaction(emoji)` - Send reaction
- `sendChatMessage(message)` - Send chat message

---

### 3. Integration Points

**Active Call View** (`/src/components/layout/incoming-call-notification.tsx`):
- Lines 1738-1758: Shows VideoConferenceView when video status is active
- Lines 1814: onRequestVideo handler
- Lines 1811: onEndVideo handler

**Props Wired**:
```typescript
<VideoConferenceView
  caller={call.caller}
  callDuration={callDuration}
  call={call}
  onEndCall={handleEndCall}
  onEndVideo={endVideo}
  onToggleLocalVideo={useUIStore.getState().toggleLocalVideo}
  toggleMute={handleToggleMute}
  toggleRecording={handleToggleRecording}
  toggleScreenShare={useUIStore.getState().toggleScreenShare}
  toggleVirtualBackground={useUIStore.getState().toggleVirtualBackground}
  addReaction={useUIStore.getState().addReaction}
  sendChatMessage={useUIStore.getState().sendChatMessage}
/>
```

---

## 🚧 What's Missing (Backend Implementation)

### 1. Video Capture & Streaming

**Not Implemented**:
- Actual camera access via `getUserMedia()`
- Video stream capture
- Video encoding/decoding
- Peer-to-peer connection establishment
- STUN/TURN server configuration
- Video quality adaptation
- Bandwidth management

### 2. WebRTC Infrastructure

**Required Components**:

#### A. Media Stream Handling
```typescript
// NOT IMPLEMENTED - Needs to be added
async function captureLocalVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      frameRate: { ideal: 30 }
    },
    audio: true
  });
  return stream;
}
```

#### B. WebRTC Peer Connection
```typescript
// NOT IMPLEMENTED - Needs to be added
const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:turn.example.com:3478', username: 'user', credential: 'pass' }
  ]
});
```

#### C. Signaling Server
- No signaling mechanism implemented
- Need WebSocket server for SDP offer/answer exchange
- Need ICE candidate exchange
- Need connection state management

### 3. Screen Sharing

**Not Implemented**:
```typescript
// Needs to be added
async function captureScreen() {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { cursor: 'always' },
    audio: false
  });
  return stream;
}
```

### 4. Virtual Background

**Not Implemented**:
- Requires ML model (TensorFlow.js or MediaPipe)
- Background segmentation
- Real-time video processing
- Performance optimization

---

## 🎯 Implementation Options

### Option 1: Telnyx Video API (Recommended)

**Telnyx provides a Video API** for WebRTC video calling:

**Advantages**:
- Already using Telnyx for voice
- Built-in signaling
- TURN servers included
- Simple integration
- No separate video infrastructure needed

**Setup**:
```typescript
import { TelnyxRTC } from "@telnyx/webrtc";

const client = new TelnyxRTC({
  login_token: TELNYX_VIDEO_TOKEN
});

// Start video call
const call = client.newCall({
  destination: "+15551234567",
  video: true  // Enable video
});

// Access local video stream
const localStream = call.localStream;

// Access remote video stream
const remoteStream = call.remoteStream;
```

**Pricing**:
- Video calls: ~$0.02/minute
- TURN server: Included
- Recording: ~$0.01/minute

### Option 2: Daily.co (Easy Integration)

**Fully managed video platform**:

**Advantages**:
- Turnkey solution
- Handles all infrastructure
- Excellent quality
- React SDK available

**Setup**:
```typescript
import Daily from "@daily-co/daily-js";

const callFrame = Daily.createFrame({
  showLeaveButton: true,
  iframeStyle: {
    position: 'fixed',
    width: '100%',
    height: '100%',
  },
});

callFrame.join({ url: 'https://your-domain.daily.co/room-name' });
```

**Pricing**:
- Free tier: 10,000 minutes/month
- Pro: $99/month for 50,000 minutes
- Enterprise: Custom pricing

### Option 3: Agora.io (High Quality)

**Enterprise-grade video SDK**:

**Advantages**:
- Ultra-low latency
- High quality
- Global infrastructure
- React SDK

**Pricing**:
- First 10,000 minutes/month: Free
- After: $0.99/1,000 minutes

### Option 4: Custom WebRTC (Complex)

**Build from scratch**:

**Advantages**:
- Full control
- No monthly fees
- Custom features

**Disadvantages**:
- Complex implementation
- Need signaling server
- Need TURN servers
- Quality issues
- Time-consuming (40+ hours)

---

## 🚀 Recommended Implementation: Telnyx Video

Since you're already using Telnyx for voice calls, extending to video is the most natural choice.

### Phase 1: Enable Video in WebRTC Hook

**File**: `/src/hooks/use-telnyx-webrtc.ts`

**Add Video Support**:

```typescript
import { TelnyxRTC } from "@telnyx/webrtc";

export function useTelnyxWebRTC(params: {
  username: string;
  password: string;
  autoConnect: boolean;
  debug?: boolean;
  onIncomingCall?: (call: Call) => void;
  onCallEnded?: (call: Call) => void;
}) {
  const [localVideoStream, setLocalVideoStream] = useState<MediaStream | null>(null);
  const [remoteVideoStream, setRemoteVideoStream] = useState<MediaStream | null>(null);

  // Initialize video when call starts
  const startVideo = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: false  // Audio already handled by voice call
      });

      setLocalVideoStream(stream);

      // Add video track to existing call
      if (currentCallRef.current) {
        const videoTrack = stream.getVideoTracks()[0];
        await currentCallRef.current.enableVideo(videoTrack);
      }

    } catch (error) {
      console.error("Failed to start video:", error);
    }
  };

  const stopVideo = () => {
    if (localVideoStream) {
      localVideoStream.getTracks().forEach(track => track.stop());
      setLocalVideoStream(null);
    }

    if (currentCallRef.current) {
      currentCallRef.current.disableVideo();
    }
  };

  // Listen for remote video stream
  useEffect(() => {
    if (!client) return;

    client.on('remoteTrackAdded', (track, stream) => {
      if (track.kind === 'video') {
        setRemoteVideoStream(stream);
      }
    });

    client.on('remoteTrackRemoved', (track) => {
      if (track.kind === 'video') {
        setRemoteVideoStream(null);
      }
    });
  }, [client]);

  return {
    // ... existing returns
    localVideoStream,
    remoteVideoStream,
    startVideo,
    stopVideo,
  };
}
```

### Phase 2: Wire Up Video Streams to UI

**File**: `/src/components/layout/video-conference.tsx`

**Add Video Elements**:

```typescript
export function VideoConferenceView({ ... }) {
  const webrtc = useTelnyxWebRTC(/* ... */);

  return (
    <div className="video-conference">
      {/* Remote Video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="remote-video"
        srcObject={webrtc.remoteVideoStream}
      />

      {/* Local Video (Picture-in-Picture) */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="local-video pip"
        srcObject={webrtc.localVideoStream}
      />

      {/* Controls */}
      <button onClick={webrtc.startVideo}>Start Video</button>
      <button onClick={webrtc.stopVideo}>Stop Video</button>
    </div>
  );
}
```

### Phase 3: Screen Sharing

**Add to WebRTC Hook**:

```typescript
const startScreenShare = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { cursor: 'always' },
      audio: false
    });

    setScreenShareStream(stream);

    // Replace video track with screen share
    if (currentCallRef.current) {
      const screenTrack = stream.getVideoTracks()[0];
      await currentCallRef.current.replaceTrack('video', screenTrack);
    }

    // Stop screen share when user clicks "Stop Sharing" in browser
    stream.getVideoTracks()[0].onended = () => {
      stopScreenShare();
    };

  } catch (error) {
    console.error("Failed to start screen share:", error);
  }
};
```

---

## 📊 Estimated Costs

### Telnyx Video

**Pricing**:
- Video minutes: $0.02/minute
- Recording: $0.01/minute
- TURN servers: Included

**Example Usage**:
- 100 video calls/month @ 15 minutes each = 1,500 minutes
- **Cost**: 1,500 × $0.02 = **$30/month**

### Alternative: Daily.co

**Free Tier**: 10,000 minutes/month
- 100 calls @ 15 minutes = 1,500 minutes
- **Cost**: **$0/month** (within free tier)

---

## ✅ Testing Checklist

### Video Capture
- [ ] Camera permission requested correctly
- [ ] Local video stream displays in preview
- [ ] Camera toggle works (on/off)
- [ ] Video quality settings work
- [ ] Multiple cameras can be selected

### Video Call
- [ ] Video call request sends correctly
- [ ] Remote video stream displays
- [ ] Audio and video sync properly
- [ ] Connection indicators accurate
- [ ] Quality adapts to bandwidth
- [ ] Call can be muted (audio only)
- [ ] Call can be video-only (mute audio)

### Screen Sharing
- [ ] Screen share permission requested
- [ ] Screen content displays remotely
- [ ] Can share entire screen
- [ ] Can share specific window
- [ ] Can share browser tab
- [ ] Browser "Stop Sharing" button works
- [ ] Switches back to camera after stop

### Virtual Background (Advanced)
- [ ] Background segmentation works
- [ ] Performance is acceptable (>24fps)
- [ ] No CPU overload
- [ ] Works on various backgrounds
- [ ] Can upload custom backgrounds

### UI/UX
- [ ] All buttons functional
- [ ] View modes switch correctly
- [ ] Minimized view works
- [ ] Reactions appear
- [ ] Chat messages send
- [ ] Participants list accurate
- [ ] Recording indicator shows
- [ ] End call confirms before disconnecting

---

## 🐛 Known Challenges

### 1. Browser Permissions
- HTTPS required for camera access
- Users may deny permissions
- Different permission flows per browser

### 2. Network Conditions
- Poor connectivity affects quality
- Packet loss causes pixelation
- Bandwidth limits video resolution
- Firewall/NAT issues

### 3. Device Compatibility
- Not all cameras support HD
- Some browsers lack WebRTC support
- Mobile devices have limited resources
- iOS Safari has WebRTC quirks

### 4. Performance
- Video encoding is CPU-intensive
- Multiple participants increase load
- Virtual backgrounds require ML processing
- Battery drain on mobile devices

---

## 📝 Current Implementation Status

### What Works Now (UI Only)
1. ✅ Complete video conference interface
2. ✅ All UI controls and buttons
3. ✅ State management for video status
4. ✅ View mode switching (gallery/speaker)
5. ✅ Minimized picture-in-picture view
6. ✅ Reactions and chat UI
7. ✅ Participant list
8. ✅ Connection quality indicators

### What Doesn't Work (No Backend)
1. ❌ Actual camera capture
2. ❌ Video streaming
3. ❌ Screen sharing
4. ❌ Virtual backgrounds
5. ❌ Multi-participant support
6. ❌ Connection quality detection
7. ❌ Bandwidth adaptation
8. ❌ Recording video calls

---

## 🎯 Next Steps to Make Video Work

### Quick Start (4-6 hours)

**Using Telnyx Video SDK**:

1. **Install Telnyx SDK** (if not already):
```bash
npm install @telnyx/webrtc
```

2. **Enable video in WebRTC hook** (~2 hours)
3. **Wire video streams to UI** (~1 hour)
4. **Test camera permissions** (~1 hour)
5. **Implement screen sharing** (~1 hour)
6. **Polish and bug fixes** (~1 hour)

### Full Implementation (12-16 hours)

1. Video capture and streaming (4 hours)
2. Screen sharing (2 hours)
3. Multi-participant support (3 hours)
4. Virtual backgrounds (4 hours)
5. Quality optimization (2 hours)
6. Testing and bug fixes (3 hours)

---

## 💡 Recommendation

### For MVP: Audio-Only First
- Focus on perfecting voice calling
- Video adds significant complexity
- Test thoroughly with real calls
- Defer video to Phase 2

### For Full Feature: Use Telnyx Video
- Extends existing Telnyx integration
- Simple to implement
- Good quality
- Reasonable cost

### For Enterprise: Consider Daily.co
- Best quality
- Easiest integration
- Free tier generous
- Production-ready immediately

---

**Status**: Beautiful UI complete and ready. Backend video capture and streaming needs 4-16 hours of implementation depending on approach chosen.
