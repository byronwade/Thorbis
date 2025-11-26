"use client";

/**
 * AppHeaderErrorBoundary - Error boundary for AppHeader
 *
 * Catches runtime errors in AppHeader and displays a fallback UI
 * that matches the header design, preventing the entire page from crashing.
 *
 * Features:
 * - Catches all errors in AppHeader component tree
 * - Displays user-friendly error message
 * - Provides retry button to attempt recovery
 * - Logs errors for monitoring
 * - Matches header styling for visual consistency
 */

import { AlertCircle, RefreshCw } from "lucide-react";
import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ErrorBoundaryProps = {
	children: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
	error: Error | null;
};

export class AppHeaderErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Log error to monitoring service (e.g., Sentry)
		console.error("AppHeader Error:", error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null });
		// Force page reload to attempt recovery
		window.location.reload();
	};

	render() {
		if (this.state.hasError) {
			return <HeaderErrorFallback onReset={this.handleReset} />;
		}

		return this.props.children;
	}
}

/**
 * HeaderErrorFallback - Error state UI for AppHeader
 *
 * Displays when AppHeader encounters a runtime error.
 * Styled to match the header design for visual consistency.
 */
function HeaderErrorFallback({ onReset }: { onReset: () => void }) {
	return (
		<header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
			<div className="flex h-14 items-center justify-between px-4">
				<div className="flex items-center gap-3">
					<div className="bg-destructive/10 flex h-8 w-8 items-center justify-center rounded-md">
						<AlertCircle
							className="text-destructive h-4 w-4"
							aria-hidden="true"
						/>
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-medium">Unable to load header</span>
						<span className="text-muted-foreground text-xs hidden sm:inline">
							An error occurred while loading the navigation
						</span>
					</div>
				</div>

				<Button
					variant="outline"
					size="sm"
					onClick={onReset}
					className="gap-2"
					aria-label="Retry loading header"
				>
					<RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
					<span className="hidden sm:inline">Retry</span>
				</Button>
			</div>
		</header>
	);
}
