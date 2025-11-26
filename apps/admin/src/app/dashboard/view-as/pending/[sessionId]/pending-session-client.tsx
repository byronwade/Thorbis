"use client";

/**
 * Pending Session Client Component
 *
 * Polls for session approval/rejection and auto-redirects when status changes.
 * Shows animated waiting screen with session details.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, Shield, Ticket, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin-client";

interface PendingSessionClientProps {
	sessionId: string;
	companyId: string;
	companyName: string;
	ticketId: string | null;
	reason: string;
	requestedAt: string;
}

const POLL_INTERVAL = 5000; // 5 seconds

export function PendingSessionClient({ sessionId, companyId, companyName, ticketId, reason, requestedAt }: PendingSessionClientProps) {
	const router = useRouter();
	const [status, setStatus] = useState<"pending" | "active" | "rejected">("pending");
	const [timeWaiting, setTimeWaiting] = useState("");
	const [pollCount, setPollCount] = useState(0);

	// Calculate time waiting
	useEffect(() => {
		const updateTimer = () => {
			const now = new Date();
			const requested = new Date(requestedAt);
			const diffMs = now.getTime() - requested.getTime();

			const minutes = Math.floor(diffMs / 1000 / 60);
			const seconds = Math.floor((diffMs / 1000) % 60);

			if (minutes > 0) {
				setTimeWaiting(`${minutes}m ${seconds}s`);
			} else {
				setTimeWaiting(`${seconds}s`);
			}
		};

		updateTimer();
		const interval = setInterval(updateTimer, 1000);
		return () => clearInterval(interval);
	}, [requestedAt]);

	// Poll for status changes
	useEffect(() => {
		const checkStatus = async () => {
			try {
				const supabase = createAdminClient();
				const { data: session, error } = await supabase.from("support_sessions").select("status, rejection_reason").eq("id", sessionId).single();

				if (error) {
					console.error("Error checking session status:", error);
					return;
				}

				if (!session) return;

				setPollCount((prev) => prev + 1);

				// Session approved - redirect to view-as interface
				if (session.status === "active") {
					setStatus("active");
					// Small delay to show success animation
					setTimeout(() => {
						router.push(`/admin/dashboard/view-as/${companyId}/work/jobs`);
					}, 1500);
				}

				// Session rejected - refresh page to show rejection message
				if (session.status === "rejected") {
					setStatus("rejected");
					// Small delay to show rejection animation
					setTimeout(() => {
						router.refresh();
					}, 1500);
				}
			} catch (error) {
				console.error("Error polling session status:", error);
			}
		};

		// Initial check
		checkStatus();

		// Set up polling
		const interval = setInterval(checkStatus, POLL_INTERVAL);

		return () => clearInterval(interval);
	}, [sessionId, companyId, router]);

	// Show success animation when approved
	if (status === "active") {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center space-y-4 animate-in fade-in zoom-in">
					<div className="rounded-full bg-green-100 dark:bg-green-900/20 w-20 h-20 flex items-center justify-center mx-auto">
						<CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
					</div>
					<h1 className="text-2xl font-bold">Access Approved!</h1>
					<p className="text-muted-foreground">Redirecting to customer view...</p>
				</div>
			</div>
		);
	}

	// Show rejection animation when denied
	if (status === "rejected") {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center space-y-4 animate-in fade-in zoom-in">
					<div className="rounded-full bg-red-100 dark:bg-red-900/20 w-20 h-20 flex items-center justify-center mx-auto">
						<XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
					</div>
					<h1 className="text-2xl font-bold">Access Denied</h1>
					<p className="text-muted-foreground">Customer declined the request...</p>
				</div>
			</div>
		);
	}

	// Pending - show waiting screen
	return (
		<div className="flex h-screen items-center justify-center p-6 bg-gradient-to-br from-background to-muted/20">
			<Card className="max-w-2xl w-full shadow-lg">
				<CardHeader className="text-center space-y-4">
					<div className="mx-auto rounded-full bg-orange-100 dark:bg-orange-900/20 w-20 h-20 flex items-center justify-center relative">
						<Shield className="h-10 w-10 text-orange-600 dark:text-orange-400" />
						{/* Animated pulse rings */}
						<div className="absolute inset-0 rounded-full border-2 border-orange-300 dark:border-orange-700 animate-ping" />
						<div className="absolute inset-0 rounded-full border-2 border-orange-400 dark:border-orange-600 animate-pulse" />
					</div>
					<div className="space-y-2">
						<CardTitle className="text-3xl">Waiting for Customer Approval</CardTitle>
						<CardDescription className="text-base">The customer will see a notification in their account to approve or deny your access request.</CardDescription>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Session Details */}
					<div className="rounded-lg border bg-muted/50 p-6 space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							{/* Company */}
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">Company</p>
								<p className="text-lg font-semibold">{companyName}</p>
							</div>

							{/* Time Waiting */}
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">Time Waiting</p>
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<p className="text-lg font-semibold font-mono">{timeWaiting}</p>
								</div>
							</div>
						</div>

						{/* Ticket ID */}
						{ticketId && (
							<div className="flex items-center gap-2 pt-4 border-t">
								<Ticket className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm text-muted-foreground">Support Ticket:</span>
								<Badge variant="outline" className="font-mono">
									{ticketId}
								</Badge>
							</div>
						)}

						{/* Reason */}
						<div className="space-y-2 pt-4 border-t">
							<p className="text-sm font-medium text-muted-foreground">Reason for Access</p>
							<p className="text-sm rounded-md border bg-background p-3">{reason}</p>
						</div>
					</div>

					{/* Polling Status */}
					<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>
							Checking for approval... ({pollCount} {pollCount === 1 ? "check" : "checks"})
						</span>
					</div>

					{/* What Happens Next */}
					<div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-4 space-y-2">
						<h3 className="font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
							<Shield className="h-4 w-4" />
							What Happens Next
						</h3>
						<ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
							<li>The customer will see an approval modal in their dashboard</li>
							<li>They can approve access for 30 minutes to 4 hours</li>
							<li>Once approved, you'll be redirected automatically</li>
							<li>If denied, you'll see the rejection reason</li>
							<li>The session will expire if not approved within 24 hours</li>
						</ul>
					</div>

					{/* Cancel Button */}
					<div className="flex justify-center pt-4">
						<Button variant="outline" onClick={() => router.push("/admin/dashboard/view-as")} className="w-full sm:w-auto">
							Cancel &amp; Return to Companies
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
