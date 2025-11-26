"use client";

/**
 * Support Session Provider
 *
 * Polls for pending/active support sessions and displays:
 * - Approval modal for pending sessions
 * - Active session banner when support is viewing
 *
 * Uses polling initially, can be upgraded to Supabase Realtime for production.
 */

import { useEffect, useState } from "react";
import {
	getActiveSupportSessions,
	getPendingSupportSessions,
} from "@/actions/support-sessions";
import { ActiveSessionBanner } from "./active-session-banner";
import { SessionApprovalModal } from "./session-approval-modal";
import { SupportActionNotifier } from "./support-action-notifier";

interface SupportSession {
	id: string;
	admin_user_id: string;
	ticket_id: string | null;
	reason: string;
	requested_at: string;
	requested_permissions: string[];
	approved_at?: string;
	expires_at?: string;
	admin_name?: string;
	admin_email?: string;
}

const POLL_INTERVAL = 10000; // 10 seconds

export function SupportSessionProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [pendingSessions, setPendingSessions] = useState<SupportSession[]>([]);
	const [activeSessions, setActiveSessions] = useState<SupportSession[]>([]);
	const [showApprovalModal, setShowApprovalModal] = useState(false);
	const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

	// Fetch pending and active sessions
	const fetchSessions = async () => {
		try {
			// Fetch pending sessions
			const pendingResult = await getPendingSupportSessions();
			if (pendingResult.success && pendingResult.sessions) {
				setPendingSessions(pendingResult.sessions);

				// Show modal if there are pending sessions and it's not already shown
				if (pendingResult.sessions.length > 0 && !showApprovalModal) {
					setShowApprovalModal(true);
					setCurrentSessionIndex(0);
				}
			}

			// Fetch active sessions
			const activeResult = await getActiveSupportSessions();
			if (activeResult.success && activeResult.sessions) {
				setActiveSessions(activeResult.sessions);
			}
		} catch (error) {
			console.error("Error fetching support sessions:", error);
		}
	};

	// Poll for sessions
	useEffect(() => {
		// Initial fetch
		fetchSessions();

		// Set up polling
		const interval = setInterval(fetchSessions, POLL_INTERVAL);

		return () => clearInterval(interval);
	}, []);

	// Handle approval/rejection
	const handleSessionApproved = () => {
		// Refresh sessions
		fetchSessions();

		// Show next pending session if any
		if (currentSessionIndex < pendingSessions.length - 1) {
			setCurrentSessionIndex(currentSessionIndex + 1);
		} else {
			setShowApprovalModal(false);
		}
	};

	const handleSessionRejected = () => {
		// Refresh sessions
		fetchSessions();

		// Show next pending session if any
		if (currentSessionIndex < pendingSessions.length - 1) {
			setCurrentSessionIndex(currentSessionIndex + 1);
		} else {
			setShowApprovalModal(false);
		}
	};

	const handleSessionEnded = () => {
		// Refresh sessions to remove ended session
		fetchSessions();
	};

	const currentPendingSession = pendingSessions[currentSessionIndex] || null;
	const currentActiveSession = activeSessions[0] || null; // Show first active session

	return (
		<>
			{/* Active Session Banner */}
			{currentActiveSession && (
				<ActiveSessionBanner
					session={currentActiveSession as any}
					onSessionEnded={handleSessionEnded}
				/>
			)}

			{/* Session Approval Modal */}
			<SessionApprovalModal
				session={currentPendingSession}
				open={showApprovalModal}
				onOpenChange={setShowApprovalModal}
				onApproved={handleSessionApproved}
				onRejected={handleSessionRejected}
			/>

			{/* Support Action Notifier - shows toast when support takes actions */}
			<SupportActionNotifier />

			{/* Add padding to content if active session banner is shown */}
			<div className={currentActiveSession ? "pt-12" : ""}>{children}</div>
		</>
	);
}
