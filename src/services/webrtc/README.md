# WebRTC Service - Isolated Process

## Quick Start

### 1. Start the Service

The service is automatically started when the Next.js app boots, but you can also start it manually:

```typescript
import { startWebRTCService } from "@/services/webrtc";

await startWebRTCService();
```

### 2. Use in Components

```typescript
import { useWebRTCService } from "@/hooks/use-webrtc-service";
import { WebRTCErrorBoundary } from "@/components/webrtc/error-boundary";

function CallButton() {
  const { isAvailable, makeCall } = useWebRTCService();

  if (!isAvailable) {
    return <div>Calls unavailable</div>;
  }

  return (
    <button onClick={() => makeCall("+1234567890")}>
      Call Customer
    </button>
  );
}

// Wrap in error boundary
<WebRTCErrorBoundary>
  <CallButton />
</WebRTCErrorBoundary>
```

### 3. Use in API Routes

```typescript
import { getWebRTCService } from "@/services/webrtc";

export async function POST(request: NextRequest) {
  const service = getWebRTCService();

  if (service.getStatus() !== "ready") {
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 503 }
    );
  }

  const credential = await service.generateCredential(username);
  return NextResponse.json({ credential });
}
```

## Architecture

```
Main App → API Routes → Service Manager → Worker Thread → Telnyx API
```

- **Main App**: Next.js application (never crashes from WebRTC issues)
- **API Routes**: HTTP endpoints for client communication
- **Service Manager**: Process lifecycle and health monitoring
- **Worker Thread**: Isolated Node.js worker (runs WebRTC logic)
- **Telnyx API**: External telephony provider

## Key Files

- `index.ts`: Service manager and public API
- `worker.ts`: Isolated worker thread implementation
- `../hooks/use-webrtc-service.ts`: React hook for client-side usage
- `../components/webrtc/error-boundary.tsx`: Error isolation component
- `../app/api/webrtc/*`: API routes for service access

## Safety Guarantees

✅ **Worker crashes don't affect main app**
✅ **API errors return gracefully**
✅ **Components degrade gracefully**
✅ **Auto-restart on failure**
✅ **Health monitoring**
✅ **Error boundaries prevent UI crashes**

## Common Errors

### "WebRTC service not running"

**Cause**: Service hasn't started or crashed

**Solution**:
```typescript
const service = getWebRTCService();
await service.start();
```

### "Account Level Limit Reached"

**Cause**: Telnyx free tier limit (5 credentials max)

**Solution**: Clean up old credentials:
```bash
node scripts/cleanup-telnyx-connections.ts
```

### "Worker timeout"

**Cause**: Worker hung or network issue

**Solution**: Service auto-restarts (max 3 attempts)

## Monitoring

### Check Health

```bash
curl http://localhost:3000/api/webrtc/status
```

### View Logs

```bash
# Worker logs
[WebRTC Worker] Started
[WebRTC Worker] Initialized successfully

# Service logs
[WebRTC Service] Status: ready
[WebRTC Service] Health check passed
```

### Dashboard

Add health monitor to admin dashboard:

```typescript
import { WebRTCHealthMonitor } from "@/components/webrtc/health-monitor";

<WebRTCHealthMonitor />
```

## See Also

- Full documentation: `/docs/WEBRTC_ISOLATION.md`
- Telnyx setup: `/notes/TELNYX_WEBRTC_SETUP_GUIDE.md`
- Troubleshooting: `/docs/WEBRTC_ISOLATION.md#troubleshooting`
