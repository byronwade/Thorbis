# Live Call Transcription - Implementation Guide

**Date**: January 31, 2025
**Status**: 🏗️ Ready for Implementation
**Complexity**: High
**Estimated Time**: 8-12 hours

---

## 📋 Current State

### ✅ What Already Exists

#### 1. Transcript Store (`/src/lib/stores/transcript-store.ts`)

**Full-Featured Zustand Store**:
```typescript
export type TranscriptEntry = {
  id: string;
  speaker: "csr" | "customer";
  text: string;
  timestamp: number;
  isAnalyzing: boolean;
  aiExtracted?: {
    customerInfo?: { name, email, phone, company };
    issueCategories?: string[];
    actionItems?: string[];
    sentiment?: "positive" | "neutral" | "negative";
    confidence?: number; // 0-100
  };
};
```

**Features**:
- Add/update transcript entries
- AI analysis tracking
- Search and filter
- Export functionality
- Speaker identification
- Full transcript compilation

#### 2. Transcript UI Panel (`/src/components/communication/transcript-panel.tsx`)

**Visual Components**:
- Real-time transcript display
- Scrollable chat-like interface
- Speaker differentiation (CSR vs Customer)
- Timestamp display
- AI analysis indicators
- Search functionality

#### 3. Active Call Integration

**Already Wired**:
- Transcript panel shown in ActiveCallView dashboard
- Start/stop recording triggers
- Mock entries for demo (lines 1578-1620 in incoming-call-notification.tsx)

---

## 🚧 What Needs to Be Implemented

### Architecture Overview

```
┌─────────────────┐
│   Browser Call  │
│    (WebRTC)     │
└────────┬────────┘
         │ Audio Stream
         ↓
┌─────────────────┐
│ Audio Capture   │
│  & Processing   │
└────────┬────────┘
         │ PCM/WAV Chunks
         ↓
┌─────────────────┐
│  Transcription  │
│     Service     │
│ (AssemblyAI/    │
│  Deepgram)      │
└────────┬────────┘
         │ Text + Speaker
         ↓
┌─────────────────┐
│ Transcript Store│
│   (Zustand)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Transcript UI   │
│     Panel       │
└─────────────────┘
```

---

## 🔧 Recommended Implementation

### Option 1: AssemblyAI (Recommended)

**Why AssemblyAI?**
- Real-time streaming transcription
- Speaker diarization (identifies who's speaking)
- High accuracy (95%+)
- Websocket-based streaming
- Sentiment analysis built-in
- $0.00025/second ($0.015/minute)

**Features**:
- Real-time streaming
- Speaker labels
- Word-level timestamps
- Confidence scores
- Entity detection
- Sentiment analysis

**Pricing**:
- Streaming: $0.00025/second
- Storage: Free
- 100 hours/month: $90

### Option 2: Deepgram

**Features**:
- Ultra-low latency (<300ms)
- Speaker diarization
- Real-time streaming
- $0.0125/minute

**Pros**:
- Fastest latency
- Good accuracy
- Simple API

**Cons**:
- Slightly more expensive than AssemblyAI
- Less built-in AI features

### Option 3: Google Speech-to-Text

**Features**:
- Multi-language support
- Speaker diarization
- Real-time streaming
- $0.024/minute

**Pros**:
- Google quality
- Multi-language

**Cons**:
- More expensive
- Complex setup
- Requires GCP account

---

## 📝 Implementation Steps

### Phase 1: Audio Capture (WebRTC)

**File**: `/src/hooks/use-audio-stream.ts`

```typescript
import { useEffect, useState, useRef } from "react";

export function useAudioStream(active: boolean) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    if (!active) return;

    async function setupAudioCapture() {
      try {
        // Get microphone stream
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 16000, // Required by most transcription services
          }
        });

        setStream(mediaStream);

        // Create audio context for processing
        const audioContext = new AudioContext({ sampleRate: 16000 });
        const source = audioContext.createMediaStreamSource(mediaStream);

        // Create processor for audio chunks
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          // Convert Float32Array to Int16Array
          const pcmData = convertToPCM(inputData);
          // Send to transcription service
          sendAudioChunk(pcmData);
        };

        source.connect(processor);
        processor.connect(audioContext.destination);

        audioContextRef.current = audioContext;
        processorRef.current = processor;

      } catch (error) {
        console.error("Failed to capture audio:", error);
      }
    }

    setupAudioCapture();

    return () => {
      // Cleanup
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (processorRef.current) {
        processorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [active]);

  return { stream };
}

function convertToPCM(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return int16Array;
}
```

---

### Phase 2: Transcription Service Integration (AssemblyAI)

**File**: `/src/lib/transcription/assemblyai.ts`

```typescript
import { useTranscriptStore } from "@/lib/stores/transcript-store";

const ASSEMBLYAI_API_KEY = process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY;
const ASSEMBLYAI_REALTIME_URL = "wss://api.assemblyai.com/v2/realtime/ws";

export class AssemblyAITranscription {
  private ws: WebSocket | null = null;
  private isConnected = false;

  async connect(sampleRate: number = 16000) {
    return new Promise((resolve, reject) => {
      const url = `${ASSEMBLYAI_REALTIME_URL}?sample_rate=${sampleRate}`;

      this.ws = new WebSocket(url, {
        headers: {
          "Authorization": ASSEMBLYAI_API_KEY,
        }
      });

      this.ws.onopen = () => {
        console.log("✅ Connected to AssemblyAI");
        this.isConnected = true;
        resolve(true);
      };

      this.ws.onerror = (error) => {
        console.error("❌ AssemblyAI connection error:", error);
        reject(error);
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data));
      };

      this.ws.onclose = () => {
        console.log("AssemblyAI connection closed");
        this.isConnected = false;
      };
    });
  }

  sendAudio(audioChunk: Int16Array) {
    if (!this.ws || !this.isConnected) {
      console.warn("Not connected to AssemblyAI");
      return;
    }

    // Convert Int16Array to base64
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioChunk.buffer))
    );

    this.ws.send(JSON.stringify({
      audio_data: base64Audio
    }));
  }

  private handleMessage(message: any) {
    if (message.message_type === "PartialTranscript") {
      // Partial results (not final)
      console.log("Partial:", message.text);
    }

    if (message.message_type === "FinalTranscript") {
      // Final transcription result
      const { addEntry } = useTranscriptStore.getState();

      addEntry({
        speaker: this.detectSpeaker(message), // Implement speaker detection
        text: message.text,
      });

      console.log("Final:", message.text);
      console.log("Confidence:", message.confidence);
      console.log("Words:", message.words); // Word-level timestamps
    }

    if (message.message_type === "SessionBegins") {
      console.log("Session ID:", message.session_id);
      console.log("Expires at:", message.expires_at);
    }
  }

  private detectSpeaker(message: any): "csr" | "customer" {
    // Logic to determine speaker based on audio channel or other metadata
    // For now, alternate or use speaker diarization
    return "customer"; // Placeholder
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }
}
```

---

### Phase 3: React Hook Integration

**File**: `/src/hooks/use-live-transcription.ts`

```typescript
import { useEffect, useRef } from "react";
import { useAudioStream } from "./use-audio-stream";
import { AssemblyAITranscription } from "@/lib/transcription/assemblyai";

export function useLiveTranscription(active: boolean) {
  const { stream } = useAudioStream(active);
  const transcriptionRef = useRef<AssemblyAITranscription | null>(null);

  useEffect(() => {
    if (!active || !stream) return;

    async function startTranscription() {
      const transcription = new AssemblyAITranscription();
      transcriptionRef.current = transcription;

      try {
        await transcription.connect(16000);
        console.log("✅ Live transcription started");
      } catch (error) {
        console.error("Failed to start transcription:", error);
      }
    }

    startTranscription();

    return () => {
      if (transcriptionRef.current) {
        transcriptionRef.current.disconnect();
        console.log("Live transcription stopped");
      }
    };
  }, [active, stream]);

  const sendAudioChunk = (chunk: Int16Array) => {
    if (transcriptionRef.current) {
      transcriptionRef.current.sendAudio(chunk);
    }
  };

  return { sendAudioChunk };
}
```

---

### Phase 4: Wire Up to Call Component

**File**: `/src/components/layout/incoming-call-notification.tsx`

```typescript
import { useLiveTranscription } from "@/hooks/use-live-transcription";

export function IncomingCallNotification() {
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(false);

  // Initialize live transcription when call is active
  const { sendAudioChunk } = useLiveTranscription(
    call.status === "active" && transcriptionEnabled
  );

  // Add toggle button in UI
  const handleToggleTranscription = () => {
    setTranscriptionEnabled(!transcriptionEnabled);
  };

  // Add button to ActiveCallView controls
  return (
    <ActiveCallView
      {...props}
      onToggleTranscription={handleToggleTranscription}
      transcriptionEnabled={transcriptionEnabled}
    />
  );
}
```

---

## 🎨 UI Additions Needed

### Transcription Toggle Button

Add to call controls in ActiveCallView:

```typescript
<button
  className={cn(
    "flex flex-col items-center gap-1.5 rounded-lg p-3 transition-colors",
    transcriptionEnabled
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-zinc-800 hover:bg-zinc-700"
  )}
  onClick={onToggleTranscription}
  type="button"
  title="Live Transcription"
>
  <MessageSquare className="size-5 text-zinc-300" />
  <span className="text-[10px] text-zinc-400">
    {transcriptionEnabled ? "Live" : "Transcript"}
  </span>
</button>
```

### Transcription Indicator

Add to call header when active:

```typescript
{transcriptionEnabled && (
  <div className="flex items-center gap-1.5">
    <div className="size-2 animate-pulse rounded-full bg-blue-500" />
    <span className="text-xs text-blue-400">LIVE TRANSCRIPT</span>
  </div>
)}
```

---

## 🔐 Environment Variables

**Add to `.env.local`**:

```bash
# AssemblyAI
NEXT_PUBLIC_ASSEMBLYAI_API_KEY=your_api_key_here

# Alternative: Deepgram
NEXT_PUBLIC_DEEPGRAM_API_KEY=your_api_key_here
```

---

## ✅ Testing Checklist

- [ ] Audio capture works in browser
- [ ] Audio is converted to correct format (16kHz PCM)
- [ ] WebSocket connects to AssemblyAI
- [ ] Audio chunks are sent successfully
- [ ] Partial transcripts appear in real-time
- [ ] Final transcripts are saved to store
- [ ] Transcript panel updates live
- [ ] Speaker detection works correctly
- [ ] Transcription stops when call ends
- [ ] No memory leaks from audio processing
- [ ] Works in Chrome, Firefox, Safari

---

## 💰 Cost Estimation

### AssemblyAI Pricing

**Streaming Transcription**: $0.00025/second = $0.015/minute = $0.90/hour

**Example Usage**:
- 100 calls/month @ 10 minutes each = 1,000 minutes
- **Cost**: 1,000 × $0.015 = **$15/month**

### Deepgram Pricing

**Streaming Transcription**: $0.0125/minute = $0.75/hour

**Example Usage**:
- 100 calls/month @ 10 minutes each = 1,000 minutes
- **Cost**: 1,000 × $0.0125 = **$12.50/month**

---

## 🐛 Known Challenges

### 1. Browser Audio Capture
- Requires HTTPS (won't work on HTTP)
- Needs microphone permissions
- Different browsers have different APIs

**Solution**: Use WebRTC's `getUserMedia()` with proper permission handling

### 2. Speaker Diarization
- Difficult to distinguish CSR vs Customer in single audio stream
- Requires separate audio channels or speaker diarization

**Solutions**:
- Use AssemblyAI's speaker diarization feature
- Capture separate tracks for CSR and customer
- Manual speaker labeling UI

### 3. Real-time Performance
- Audio processing can be CPU-intensive
- Network latency affects transcription speed
- Buffer management is critical

**Solutions**:
- Use Web Workers for audio processing
- Implement efficient buffering strategy
- Monitor performance and adjust chunk sizes

### 4. Cost Control
- Transcription costs can add up quickly
- Need to stop transcription when not needed

**Solutions**:
- Add toggle button to enable/disable
- Auto-stop after certain duration
- Set monthly budget limits
- Only transcribe important calls

---

## 🎯 Alternative: Post-Call Transcription

**Simpler Approach** (Recommended for MVP):

Instead of real-time transcription, transcribe call recordings after the call ends:

### Advantages
- Much simpler to implement
- Lower cost (batch processing cheaper than streaming)
- No browser audio capture needed
- Works with existing recording infrastructure

### Implementation

**Step 1**: Enable recording transcription in Telnyx

**Step 2**: Add webhook handler for transcription completion

```typescript
// /src/app/api/webhooks/telnyx/route.ts
case "call.recording.saved": {
  // Request transcription from AssemblyAI
  const transcriptionId = await requestTranscription(recordingUrl);

  // Store transcription ID
  await supabase
    .from("communications")
    .update({
      transcription_id: transcriptionId,
      transcription_status: "processing"
    })
    .eq("telnyx_call_control_id", callControlId);
}

case "transcription.completed": {
  // Receive transcription result
  await supabase
    .from("communications")
    .update({
      transcript_text: transcriptionData.text,
      transcript_words: transcriptionData.words,
      transcription_status: "completed"
    })
    .eq("transcription_id", transcriptionId);
}
```

**Step 3**: Display transcript in call history

```typescript
// /src/components/communication/call-transcript-viewer.tsx
export function CallTranscriptViewer({ callId }) {
  const { data: call } = useSWR(`/api/calls/${callId}`);

  if (call.transcription_status === "processing") {
    return <Spinner>Transcribing...</Spinner>;
  }

  if (!call.transcript_text) {
    return <p>No transcript available</p>;
  }

  return (
    <div className="transcript">
      {call.transcript_words.map((word, i) => (
        <span key={i} className="word">
          {word.text}
        </span>
      ))}
    </div>
  );
}
```

**Cost**: $0.25/hour (cheaper than streaming)

---

## 🚀 Recommended Approach

### For MVP: Post-Call Transcription
1. Enable call recording (✅ Already implemented)
2. Send recording to AssemblyAI for transcription
3. Store transcript in database
4. Display in call history view

**Estimated Time**: 4-6 hours
**Cost**: $0.25/hour of calls

### For Full Feature: Live Transcription
1. Implement audio capture with WebRTC
2. Stream audio to AssemblyAI
3. Display real-time transcript
4. Add speaker diarization

**Estimated Time**: 8-12 hours
**Cost**: $0.90/hour of calls

---

## 📚 Resources

### AssemblyAI Documentation
- [Real-time Streaming](https://www.assemblyai.com/docs/walkthroughs#realtime-streaming-transcription)
- [Speaker Diarization](https://www.assemblyai.com/docs/models/speaker-diarization)
- [Sentiment Analysis](https://www.assemblyai.com/docs/models/sentiment-analysis)

### Deepgram Documentation
- [Streaming API](https://developers.deepgram.com/docs/streaming)
- [Speaker Diarization](https://developers.deepgram.com/docs/diarization)

### WebRTC Audio
- [getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Audio Processing](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode)

---

**Status**: Ready for implementation. Transcript store, UI, and AI analysis already complete. Just need to add audio capture and transcription service integration.
