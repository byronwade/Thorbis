# WebRTC Isolation - Implementation Checklist

Use this checklist to migrate existing WebRTC code to the isolated service architecture.

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] `TELNYX_API_KEY` environment variable set
- [ ] Clean up old Telnyx credentials (max 5 allowed on free tier)

## Step 1: Core Service Setup

- [x] Create `src/services/webrtc/index.ts` (Service Manager)
- [x] Create `src/services/webrtc/worker.ts` (Worker Thread)
- [x] Create `src/lib/webrtc-init.ts` (Auto-initialization)
- [ ] Test service starts without errors: `node -e "require('./src/lib/webrtc-init')"`

## Step 2: API Routes

- [x] Create `src/app/api/webrtc/status/route.ts`
- [x] Create `src/app/api/webrtc/credential/route.ts`
- [x] Create `src/app/api/webrtc/call/route.ts`
- [ ] Test API routes: `curl http://localhost:3000/api/webrtc/status`

## Step 3: React Integration

- [x] Create `src/hooks/use-webrtc-service.ts` (React Hook)
- [x] Create `src/components/webrtc/error-boundary.tsx` (Error Boundary)
- [x] Create `src/components/webrtc/health-monitor.tsx` (Health Dashboard)
- [x] Create `src/components/webrtc/call-button-example.tsx` (Example Component)

## Step 4: Migrate Existing Code

### 4.1: Update Server-Side Code

- [ ] Find all `import { generateWebRTCToken } from "@/lib/telnyx/webrtc"`
  ```bash
  grep -r "generateWebRTCToken" src/
  ```

- [ ] Replace with:
  ```typescript
  import { getWebRTCService } from "@/services/webrtc";

  const service = getWebRTCService();
  if (service.getStatus() !== "ready") {
    return { error: "Service unavailable" };
  }
  const credential = await service.generateCredential(username);
  ```

### 4.2: Update Client-Side Code

- [ ] Find all direct Telnyx WebRTC usage
  ```bash
  grep -r "TelnyxRTC" src/components/
  grep -r "@telnyx/webrtc" src/components/
  ```

- [ ] Replace with:
  ```typescript
  import { useWebRTCService } from "@/hooks/use-webrtc-service";
  import { WebRTCErrorBoundary } from "@/components/webrtc/error-boundary";

  function MyComponent() {
    const { isAvailable, makeCall } = useWebRTCService();

    if (!isAvailable) return <div>Calls unavailable</div>;

    return <button onClick={() => makeCall("+1234567890")}>Call</button>;
  }

  export default function SafeComponent() {
    return (
      <WebRTCErrorBoundary>
        <MyComponent />
      </WebRTCErrorBoundary>
    );
  }
  ```

### 4.3: Update Existing Components

Components to update:
- [ ] `src/components/telnyx/` (all files)
- [ ] `src/components/communication/call-composer-dialog.tsx`
- [ ] `src/components/call-window/call-popup-minimal.tsx`
- [ ] `src/components/layout/incoming-call-notification.tsx`
- [ ] Any other files using WebRTC

For each component:
1. Import `useWebRTCService` hook
2. Import `WebRTCErrorBoundary`
3. Check `isAvailable` before rendering telephony UI
4. Wrap component export in error boundary
5. Add graceful fallback UI

## Step 5: Testing

### 5.1: Service Tests

- [ ] **Test service starts**:
  ```bash
  npm run dev
  # Check logs for: [WebRTC Init] ✓ WebRTC service started successfully
  ```

- [ ] **Test status endpoint**:
  ```bash
  curl http://localhost:3000/api/webrtc/status
  # Should return: {"status":"ready","healthy":true,...}
  ```

- [ ] **Test credential generation**:
  ```bash
  curl -X POST http://localhost:3000/api/webrtc/credential \
    -H "Content-Type: application/json" \
    -d '{"username":"testuser"}'
  # Should return credential object
  ```

### 5.2: Error Handling Tests

- [ ] **Test service unavailable**: Stop worker, verify fallback UI shows
- [ ] **Test error boundary**: Throw error in component, verify boundary catches
- [ ] **Test auto-restart**: Kill worker, verify auto-restart (check logs)
- [ ] **Test health monitoring**: Add `<WebRTCHealthMonitor />` to dashboard

### 5.3: Integration Tests

- [ ] **Test call initiation**: Click call button, verify call starts
- [ ] **Test call termination**: End active call, verify cleanup
- [ ] **Test graceful degradation**: Stop service, verify app still works
- [ ] **Test error recovery**: Cause error, verify auto-recovery

## Step 6: Production Deployment

### 6.1: Environment Variables

- [ ] Set `TELNYX_API_KEY` in production environment
- [ ] Verify environment variables load correctly
- [ ] Test service starts in production mode

### 6.2: Monitoring Setup

- [ ] Add health monitor to admin dashboard
- [ ] Set up alerting for service failures
- [ ] Configure log aggregation (if applicable)
- [ ] Document restart procedures

### 6.3: Documentation

- [ ] Update project README with WebRTC info
- [ ] Document troubleshooting steps
- [ ] Create runbook for service management
- [ ] Train team on new architecture

## Step 7: Cleanup

### 7.1: Remove Old Code

- [ ] Archive old WebRTC implementation files
- [ ] Remove unused imports
- [ ] Delete deprecated utility functions
- [ ] Update TypeScript types

### 7.2: Update Dependencies

- [ ] Review `@telnyx/webrtc` dependency (keep for types)
- [ ] Update `package.json` if needed
- [ ] Run `npm audit` and fix vulnerabilities

## Step 8: Verification

### Final Checks

- [ ] All API routes return proper responses
- [ ] All components render without errors
- [ ] Error boundaries catch and display errors
- [ ] Service auto-restarts on failure
- [ ] Health monitoring works
- [ ] Logs are clean (no errors/warnings)
- [ ] Performance is acceptable (< 100ms overhead)
- [ ] Main app works when service is down

### Load Testing

- [ ] Test with 10 concurrent calls
- [ ] Test credential generation under load
- [ ] Test service recovery under stress
- [ ] Monitor memory usage over time

## Rollback Plan

If issues arise:

1. **Disable Service**:
   ```typescript
   // In src/lib/webrtc-init.ts
   export async function initializeWebRTC() {
     return false; // Disable service
   }
   ```

2. **Revert Components**: Show "Calls temporarily unavailable" message

3. **Restore Old Code**: Use git to restore previous version

4. **Investigate**: Review logs, fix issues, retry deployment

## Success Criteria

✅ Service starts automatically on server boot
✅ All API routes work correctly
✅ Components show fallback UI when service unavailable
✅ Error boundaries prevent crashes
✅ Auto-restart works after failures
✅ Health monitoring displays status
✅ Main app works when service is down
✅ No performance degradation
✅ Zero crashes from telephony issues

## Support

- **Documentation**: `docs/WEBRTC_ISOLATION.md`
- **Quick Reference**: `src/services/webrtc/README.md`
- **Examples**: `src/components/webrtc/call-button-example.tsx`
- **Troubleshooting**: `docs/WEBRTC_ISOLATION.md#troubleshooting`

---

**Note**: This is a critical infrastructure change. Test thoroughly in development before deploying to production. The main app should continue working even if the WebRTC service fails completely.
