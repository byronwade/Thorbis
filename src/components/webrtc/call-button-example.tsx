/**
 * Example: Safe WebRTC Call Button
 *
 * This component demonstrates the proper way to integrate WebRTC features
 * with complete error isolation and graceful degradation.
 *
 * Key Patterns:
 * 1. Error boundary wrapper
 * 2. Availability check
 * 3. Graceful fallback UI
 * 4. Error toast notifications
 * 5. Loading states
 *
 * Usage:
 * ```tsx
 * <CallButtonExample phoneNumber="+1234567890" />
 * ```
 */

"use client";

import { AlertCircle, Loader2, Phone, PhoneOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWebRTCService } from "@/hooks/use-webrtc-service";
import { WebRTCErrorBoundary } from "./error-boundary";

type CallButtonProps = {
	phoneNumber: string;
	displayName?: string;
};

function CallButtonInner({ phoneNumber, displayName }: CallButtonProps) {
	const { toast } = useToast();
	const { isAvailable, makeCall, endCall, status, activeCalls } =
		useWebRTCService();
	const [isConnecting, setIsConnecting] = useState(false);

	// Find active call for this phone number
	const activeCall = activeCalls.find(
		(call) => call.phoneNumber === phoneNumber,
	);

	/**
	 * Handle call initiation
	 */
	const handleCall = async () => {
		setIsConnecting(true);

		try {
			await makeCall(phoneNumber);

			toast({
				title: "Call Started",
				description: `Calling ${displayName || phoneNumber}...`,
			});
		} catch (error) {
			// Error is already logged by service - just show user-friendly message
			toast({
				variant: "destructive",
				title: "Call Failed",
				description: "Unable to start the call. Please try again.",
			});
		} finally {
			setIsConnecting(false);
		}
	};

	/**
	 * Handle call termination
	 */
	const handleHangup = async () => {
		if (!activeCall) return;

		try {
			await endCall(activeCall.id);

			toast({
				title: "Call Ended",
				description: "The call has been disconnected.",
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to end the call.",
			});
		}
	};

	/**
	 * Render: Service Unavailable
	 */
	if (!isAvailable) {
		return (
			<div className="inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-900 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400">
				<AlertCircle className="size-4" />
				<span>Calls unavailable</span>
			</div>
		);
	}

	/**
	 * Render: Service Starting
	 */
	if (status === "starting") {
		return (
			<Button disabled variant="outline" size="sm">
				<Loader2 className="mr-2 size-4 animate-spin" />
				Connecting...
			</Button>
		);
	}

	/**
	 * Render: Active Call
	 */
	if (activeCall) {
		return (
			<Button onClick={handleHangup} variant="destructive" size="sm">
				<PhoneOff className="mr-2 size-4" />
				End Call
			</Button>
		);
	}

	/**
	 * Render: Ready to Call
	 */
	return (
		<Button
			onClick={handleCall}
			disabled={isConnecting}
			variant="default"
			size="sm"
		>
			{isConnecting ? (
				<>
					<Loader2 className="mr-2 size-4 animate-spin" />
					Calling...
				</>
			) : (
				<>
					<Phone className="mr-2 size-4" />
					Call {displayName || phoneNumber}
				</>
			)}
		</Button>
	);
}

/**
 * Exported component with error boundary
 *
 * This is the safe way to export WebRTC components - always wrapped in an error boundary.
 */
export function CallButtonExample(props: CallButtonProps) {
	return (
		<WebRTCErrorBoundary
			fallback={
				<div className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-900 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
					<AlertCircle className="size-4" />
					<span>Call feature unavailable</span>
				</div>
			}
		>
			<CallButtonInner {...props} />
		</WebRTCErrorBoundary>
	);
}
