/**
 * WebRTC Error Boundary Component
 *
 * Catches and handles all errors from WebRTC/telephony components.
 * Ensures that telephony failures never crash the main application.
 *
 * Usage:
 * ```tsx
 * <WebRTCErrorBoundary fallback={<div>Calls unavailable</div>}>
 *   <CallButton />
 * </WebRTCErrorBoundary>
 * ```
 */

"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

type WebRTCErrorBoundaryProps = {
	children: React.ReactNode;
	fallback?: React.ReactNode;
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
};

type WebRTCErrorBoundaryState = {
	hasError: boolean;
	error: Error | null;
};

/**
 * Error boundary for WebRTC/telephony components
 *
 * Prevents telephony errors from crashing the main app
 */
export class WebRTCErrorBoundary extends React.Component<
	WebRTCErrorBoundaryProps,
	WebRTCErrorBoundaryState
> {
	constructor(props: WebRTCErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): WebRTCErrorBoundaryState {
		// Update state so the next render will show the fallback UI
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		// Log error to console (safe - won't crash app)
		console.error("[WebRTC Error Boundary] Caught error:", error, errorInfo);

		// Call optional error handler
		if (this.props.onError) {
			try {
				this.props.onError(error, errorInfo);
			} catch (handlerError) {
				console.error("[WebRTC Error Boundary] Error handler failed:", handlerError);
			}
		}
	}

	render(): React.ReactNode {
		if (this.state.hasError) {
			// Render fallback UI
			if (this.props.fallback) {
				return this.props.fallback;
			}

			// Default fallback UI
			return (
				<div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400">
					<AlertCircle className="size-4 shrink-0" />
					<div className="flex-1 text-sm">
						<p className="font-medium">Telephony Service Unavailable</p>
						<p className="text-xs opacity-80">
							The calling service is temporarily unavailable. Other features continue to work
							normally.
						</p>
					</div>
				</div>
			);
		}

		// Render children normally
		return this.props.children;
	}
}

/**
 * Functional wrapper for simpler usage
 */
export function withWebRTCErrorBoundary<P extends object>(
	Component: React.ComponentType<P>,
	fallback?: React.ReactNode
): React.ComponentType<P> {
	return function WebRTCBoundaryWrapper(props: P) {
		return (
			<WebRTCErrorBoundary fallback={fallback}>
				<Component {...props} />
			</WebRTCErrorBoundary>
		);
	};
}
