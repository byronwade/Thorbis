"use client";

/**
 * Support Action Notifier
 *
 * Polls for new support actions during active sessions and shows toast notifications.
 * Keeps customers informed of what support is doing in real-time.
 */

import {
	Briefcase,
	DollarSign,
	Edit,
	FileText,
	Shield,
	Users,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface SupportAction {
	id: string;
	action: string;
	resource_type: string;
	resource_id: string;
	reason: string | null;
	created_at: string;
	session_id: string;
}

const POLL_INTERVAL = 10000; // 10 seconds

export function SupportActionNotifier() {
	const lastCheckedRef = useRef<string | null>(null);
	const isCheckingRef = useRef(false);

	useEffect(() => {
		const checkForNewActions = async () => {
			// Prevent concurrent checks
			if (isCheckingRef.current) return;
			isCheckingRef.current = true;

			try {
				const supabase = createClient();

				// Get current user's company
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (!user) return;

				const { data: teamMember } = await supabase
					.from("team_members")
					.select("company_id")
					.eq("user_id", user.id)
					.single();
				if (!teamMember) return;

				// Get active sessions for this company
				const { data: activeSessions } = await supabase
					.from("support_sessions")
					.select("id")
					.eq("company_id", teamMember.company_id)
					.eq("status", "active");

				if (!activeSessions || activeSessions.length === 0) return;

				const sessionIds = activeSessions.map((s) => s.id);

				// Query for new actions since last check
				let query = supabase
					.from("support_session_actions")
					.select(
						"id, action, resource_type, resource_id, reason, created_at, session_id",
					)
					.in("session_id", sessionIds)
					.order("created_at", { ascending: false })
					.limit(10);

				// If we've checked before, only get actions after the last check
				if (lastCheckedRef.current) {
					query = query.gt("created_at", lastCheckedRef.current);
				}

				const { data: newActions } = await query;

				if (newActions && newActions.length > 0) {
					// Update last checked timestamp
					lastCheckedRef.current = newActions[0].created_at;

					// Show toast for each new action (most recent first)
					newActions.reverse().forEach((action) => {
						showActionNotification(action);
					});
				}
			} catch (error) {
				console.error("Error checking for support actions:", error);
			} finally {
				isCheckingRef.current = false;
			}
		};

		// Initial check
		checkForNewActions();

		// Set up polling
		const interval = setInterval(checkForNewActions, POLL_INTERVAL);

		return () => clearInterval(interval);
	}, []);

	return null; // This component doesn't render anything
}

function showActionNotification(action: SupportAction) {
	const icon = getActionIcon(action.resource_type);
	const message = getActionMessage(action);

	toast.info(message, {
		description: action.reason || "Support action performed",
		icon: icon,
		duration: 8000, // 8 seconds
		action: {
			label: "View Activity",
			onClick: () => {
				window.location.href = "/dashboard/settings/support-activity";
			},
		},
	});
}

function getActionIcon(resourceType: string) {
	switch (resourceType) {
		case "payment":
			return <DollarSign className="h-4 w-4" />;
		case "invoice":
			return <FileText className="h-4 w-4" />;
		case "job":
			return <Briefcase className="h-4 w-4" />;
		case "team":
			return <Users className="h-4 w-4" />;
		default:
			return <Shield className="h-4 w-4" />;
	}
}

function getActionMessage(action: SupportAction): string {
	const resourceLabel =
		action.resource_type.charAt(0).toUpperCase() +
		action.resource_type.slice(1);
	const actionLabel = action.action.replace(/_/g, " ").toLowerCase();
	const resourceId = action.resource_id.slice(0, 8);

	return `Support ${actionLabel} on ${resourceLabel} (${resourceId}...)`;
}
