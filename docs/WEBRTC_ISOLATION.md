# WebRTC Service Isolation Architecture

## Overview

The WebRTC/telephony system in Stratos runs in a **completely isolated process** to ensure that any failures, errors, or API issues **NEVER affect the main application**. This architecture follows the principle of **graceful degradation** - if telephony fails, the rest of the app continues working normally.

## Why Isolation?

### The Problem

Before isolation, WebRTC errors could:
- Crash the entire application
- Block page rendering
- Cause infinite loops
- Leak memory
- Create cascading failures
- Impact unrelated features

### The Solution

By running WebRTC in a separate worker thread:
- **Zero Impact**: Telephony crashes don't affect the main app
- **Graceful Degradation**: App works fine even if calls are unavailable
- **Auto-Recovery**: Service automatically restarts on failure
- **Health Monitoring**: Real-time status without blocking
- **Resource Isolation**: Memory leaks contained to worker thread

## Architecture

```
┌─────────────────────────────────────────────────┐
│                 Main Application                │
│                  (Next.js App)                  │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │         UI Components (React)             │ │
│  │  - Error Boundaries                       │ │
│  │  - Graceful Fallbacks                     │ │
│  └───────────────┬───────────────────────────┘ │
│                  │                             │
│                  │ HTTP Requests               │
│                  ▼                             │
│  ┌───────────────────────────────────────────┐ │
│  │        API Routes (Next.js)               │ │
│  │  - /api/webrtc/status                     │ │
│  │  - /api/webrtc/credential                 │ │
│  │  - /api/webrtc/call                       │ │
│  └───────────────┬───────────────────────────┘ │
│                  │                             │
│                  │ IPC Messages                │
│                  ▼                             │
│  ┌───────────────────────────────────────────┐ │
│  │      WebRTC Service Manager               │ │
│  │  - Process Management                     │ │
│  │  - Health Monitoring                      │ │
│  │  - Auto-Restart Logic                     │ │
│  └───────────────┬───────────────────────────┘ │
│                  │                             │
└──────────────────┼─────────────────────────────┘
                   │ Worker Thread
                   ▼
    ┌──────────────────────────────────────────┐
    │     WebRTC Worker (Isolated Process)     │
    │                                          │
    │  - Telnyx API Calls                     │
    │  - Credential Generation                │
    │  - Call Management                      │
    │  - Error Handling (Isolated)            │
    │  - Crash Recovery                       │
    └──────────────────────────────────────────┘
```

## Key Components

### 1. WebRTC Service Manager (`src/services/webrtc/index.ts`)

**Purpose**: Manages the isolated worker thread and handles communication.

**Features**:
- Process lifecycle management (start, stop, restart)
- IPC message routing
- Health monitoring (every 30 seconds)
- Automatic restart on failure (max 3 attempts)
- Event emission for status changes

**Usage**:
```typescript
import { getWebRTCService } from "@/services/webrtc";

const service = getWebRTCService();

// Check status (safe - won't crash)
const status = service.getStatus();

// Generate credentials (safe - returns error on failure)
const credential = await service.generateCredential("user@example.com");

// Make a call (safe - isolated from main app)
await service.makeCall("+1234567890");
```

### 2. WebRTC Worker Thread (`src/services/webrtc/worker.ts`)

**Purpose**: Runs all WebRTC operations in isolation.

**Features**:
- Telnyx API integration
- Credential management
- Call state tracking
- Error isolation
- Graceful shutdown

**Key Points**:
- Runs in separate Node.js worker thread
- Uncaught exceptions don't crash main app
- Auto-reports health status
- Can be terminated without affecting main process

### 3. React Hook (`src/hooks/use-webrtc-service.ts`)

**Purpose**: Provides safe client-side access to WebRTC service.

**Features**:
- Status polling
- Error handling
- Graceful degradation
- Active call tracking

**Usage**:
```typescript
import { useWebRTCService } from "@/hooks/use-webrtc-service";

function CallButton() {
  const { isAvailable, makeCall, status } = useWebRTCService();

  // Graceful degradation - hide button if service unavailable
  if (!isAvailable) {
    return <div className="text-muted-foreground text-sm">Calls unavailable</div>;
  }

  return (
    <button onClick={() => makeCall("+1234567890")}>
      Call Customer
    </button>
  );
}
```

### 4. Error Boundary (`src/components/webrtc/error-boundary.tsx`)

**Purpose**: Catches and isolates WebRTC component errors.

**Features**:
- Prevents crash propagation
- Custom fallback UI
- Error logging
- Error handler callbacks

**Usage**:
```typescript
import { WebRTCErrorBoundary } from "@/components/webrtc/error-boundary";

function TelephonyFeature() {
  return (
    <WebRTCErrorBoundary
      fallback={<div>Telephony temporarily unavailable</div>}
    >
      <CallControls />
      <CallHistory />
    </WebRTCErrorBoundary>
  );
}
```

### 5. Health Monitor (`src/components/webrtc/health-monitor.tsx`)

**Purpose**: Real-time service health visualization.

**Features**:
- Live status updates (every 10 seconds)
- Visual health indicators
- Last check timestamp
- Graceful degradation message

**Usage**:
```typescript
import { WebRTCHealthMonitor } from "@/components/webrtc/health-monitor";

// In admin dashboard
<WebRTCHealthMonitor />
```

## API Routes

### GET /api/webrtc/status

Returns current service status and health.

**Response**:
```json
{
  "status": "ready",
  "healthy": true,
  "timestamp": 1703001234567
}
```

**Status Values**:
- `idle`: Service not started
- `starting`: Service initializing
- `ready`: Service operational
- `error`: Service failed
- `stopped`: Service shut down

### POST /api/webrtc/credential

Generates WebRTC credentials for a user.

**Request**:
```json
{
  "username": "user@example.com",
  "ttl": 86400
}
```

**Response**:
```json
{
  "success": true,
  "credential": {
    "username": "user1234",
    "password": "...",
    "expires_at": 1703087634567,
    "realm": "sip.telnyx.com",
    "sip_uri": "sip:user1234@sip.telnyx.com",
    "stun_servers": ["stun:stun.telnyx.com:3478"],
    "turn_servers": [...]
  }
}
```

### POST /api/webrtc/call

Manages call operations.

**Actions**:

**Make Call**:
```json
{
  "action": "make",
  "phoneNumber": "+1234567890"
}
```

**End Call**:
```json
{
  "action": "end",
  "callId": "call-1234567890"
}
```

**Answer Call**:
```json
{
  "action": "answer",
  "callId": "call-1234567890"
}
```

## Error Handling Strategy

### 1. Service-Level Errors

**Errors in Worker Thread**:
- Caught by worker error handlers
- Logged to console
- Status set to `error`
- Auto-restart attempted (max 3 times)
- Main app continues unaffected

**Example**:
```typescript
// Worker crashes - main app keeps running
worker.on("error", (error) => {
  console.error("[WebRTC Service] Worker error:", error);
  this.setStatus("error");
  this.attemptRestart(); // Auto-recovery
});
```

### 2. API-Level Errors

**API Route Failures**:
- Return 503 Service Unavailable
- Include error message
- Don't throw exceptions
- Client handles gracefully

**Example**:
```typescript
try {
  const credential = await service.generateCredential(username);
  return NextResponse.json({ success: true, credential });
} catch (error) {
  // Graceful error response - doesn't crash server
  return NextResponse.json(
    { success: false, error: error.message },
    { status: 500 }
  );
}
```

### 3. Client-Level Errors

**React Component Failures**:
- Caught by `WebRTCErrorBoundary`
- Fallback UI rendered
- Rest of page renders normally
- Error logged for debugging

**Example**:
```typescript
<WebRTCErrorBoundary fallback={<TelephonyUnavailable />}>
  <CallFeatures />
</WebRTCErrorBoundary>

// If CallFeatures crashes, TelephonyUnavailable renders instead
// Rest of the page remains functional
```

### 4. Hook-Level Errors

**Hook Call Failures**:
- Return `isAvailable: false`
- Expose error in hook state
- Components adapt to unavailability
- No crashes or blocking

**Example**:
```typescript
const { isAvailable, error } = useWebRTCService();

if (!isAvailable) {
  // Graceful degradation
  return <div>Voice features temporarily unavailable</div>;
}
```

## Auto-Recovery Mechanism

### Restart Logic

1. **Detection**: Health check fails or worker crashes
2. **Attempt**: Restart worker (max 3 attempts)
3. **Backoff**: 5-second delay between attempts
4. **Recovery**: Reset attempt counter on success
5. **Fatal**: Emit `fatal_error` event after max attempts

### Health Monitoring

- **Frequency**: Every 30 seconds
- **Method**: Send health check command to worker
- **Timeout**: 5 seconds
- **Action**: Auto-restart if unhealthy

## Performance Characteristics

### Resource Usage

- **Memory**: Isolated - leaks contained to worker
- **CPU**: Minimal overhead for IPC
- **Network**: Telnyx API calls isolated to worker
- **Startup Time**: ~1-2 seconds for worker initialization

### Response Times

- **Health Check**: < 100ms
- **Credential Generation**: 500-1500ms (Telnyx API)
- **Call Initiation**: < 200ms
- **Status Query**: < 50ms

## Best Practices

### DO ✅

```typescript
// ✅ Use error boundary for telephony UI
<WebRTCErrorBoundary>
  <CallControls />
</WebRTCErrorBoundary>

// ✅ Check availability before rendering
const { isAvailable } = useWebRTCService();
if (!isAvailable) return null;

// ✅ Handle errors gracefully
try {
  await makeCall(phoneNumber);
} catch (error) {
  toast.error("Call failed - please try again");
}

// ✅ Show fallback UI
{isAvailable ? <CallButton /> : <div>Calls unavailable</div>}
```

### DON'T ❌

```typescript
// ❌ Don't access worker directly
import { Worker } from "worker_threads";
const worker = new Worker(...); // Use service manager instead

// ❌ Don't assume service is always available
const service = getWebRTCService();
await service.makeCall(...); // Check status first!

// ❌ Don't block main app on telephony
if (!webrtcAvailable) {
  throw new Error("Can't continue"); // Main app should work anyway!
}

// ❌ Don't render telephony without error boundary
<CallControls /> // Wrap in WebRTCErrorBoundary!
```

## Migration Guide

### From Integrated WebRTC

**Before**:
```typescript
import { generateWebRTCToken } from "@/lib/telnyx/webrtc";

// Directly in API route - can crash server
const credential = await generateWebRTCToken({ username });
```

**After**:
```typescript
import { getWebRTCService } from "@/services/webrtc";

// Isolated - won't crash server
const service = getWebRTCService();
if (service.getStatus() !== "ready") {
  return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
}

const credential = await service.generateCredential(username);
```

### From Client-Side WebRTC

**Before**:
```typescript
"use client";
import { TelnyxRTC } from "@telnyx/webrtc";

// Can crash entire page
const client = new TelnyxRTC({ ... });
await client.connect();
```

**After**:
```typescript
"use client";
import { useWebRTCService } from "@/hooks/use-webrtc-service";
import { WebRTCErrorBoundary } from "@/components/webrtc/error-boundary";

function CallComponent() {
  const { isAvailable, makeCall } = useWebRTCService();

  if (!isAvailable) {
    return <div>Calling unavailable</div>;
  }

  return <button onClick={() => makeCall("+1234567890")}>Call</button>;
}

// Wrap in error boundary
<WebRTCErrorBoundary>
  <CallComponent />
</WebRTCErrorBoundary>
```

## Troubleshooting

### Service Won't Start

**Symptoms**: Status stays `idle` or `error`

**Solutions**:
1. Check `TELNYX_API_KEY` environment variable
2. Review worker logs in console
3. Verify Node.js worker_threads support
4. Check for port conflicts

### Calls Not Connecting

**Symptoms**: Credentials generated but calls fail

**Solutions**:
1. Verify Telnyx account has calling enabled
2. Check credential connection limit (5 max per account)
3. Review browser WebRTC support
4. Check firewall/STUN/TURN connectivity

### Auto-Restart Loop

**Symptoms**: Service constantly restarting

**Solutions**:
1. Check Telnyx API key validity
2. Review worker error logs
3. Verify network connectivity
4. Check for environment variable issues

### Memory Leaks

**Symptoms**: Worker memory grows over time

**Solutions**:
1. Monitor active calls map
2. Ensure calls are properly cleaned up
3. Check for event listener leaks
4. Restart worker periodically (if needed)

## Security Considerations

### Credential Security

- **API Key**: Stored server-side only (never exposed to client)
- **Passwords**: Generated randomly (32 chars, high entropy)
- **TTL**: Credentials expire after 24 hours
- **Cleanup**: Old credentials auto-deleted

### Authorization

- **API Routes**: Require Supabase authentication
- **Session Validation**: Every request validates user session
- **RLS**: Database operations respect Row Level Security

### Network Security

- **HTTPS**: All API calls use HTTPS
- **TLS**: WebRTC uses DTLS encryption
- **TURN**: Authenticated TURN servers for NAT traversal

## Monitoring

### Health Endpoints

```bash
# Check service health
curl http://localhost:3000/api/webrtc/status

# Expected response
{
  "status": "ready",
  "healthy": true,
  "timestamp": 1703001234567
}
```

### Logs

**Worker Logs**:
```
[WebRTC Worker] Started
[WebRTC Worker] Initialized successfully
[WebRTC Worker] Making call to +1234567890
[WebRTC Worker] Ending call call-1234567890
```

**Service Manager Logs**:
```
[WebRTC Service] Started successfully
[WebRTC Service] Status: ready
[WebRTC Service] Health check passed
[WebRTC Service] Worker error: ...
[WebRTC Service] Attempting restart (1/3)
```

### Metrics to Track

- Service uptime
- Restart count
- Health check success rate
- API response times
- Active call count
- Credential generation rate

## Future Enhancements

### Planned Features

1. **Redis Pub/Sub**: For multi-instance coordination
2. **Call Recording**: Isolated recording service
3. **Advanced Analytics**: Call metrics and reporting
4. **Load Balancing**: Multiple worker instances
5. **Failover**: Automatic failover to backup service

### Considerations

- **Scalability**: Current design supports single worker - can extend to pool
- **Persistence**: Call state not persisted - can add Redis for durability
- **HA**: Single point of failure - can add redundancy
- **Monitoring**: Basic health checks - can add APM integration

## Conclusion

The isolated WebRTC architecture ensures that:
- **Telephony failures never crash the main app**
- **Users can continue working even if calls are unavailable**
- **Service auto-recovers from errors**
- **Health monitoring provides visibility**
- **Error boundaries prevent UI crashes**

This architecture follows the **fail-safe** principle: when telephony fails, it fails gracefully without affecting the core business operations.
