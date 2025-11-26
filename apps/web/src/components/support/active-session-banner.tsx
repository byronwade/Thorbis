"use client";

/**
 * Active Support Session Banner
 *
 * Displays at the top of the page when support is viewing the account.
 * Shows who's viewing, time remaining, and option to end access.
 */

import { Clock, ExternalLink, Shield, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { endActiveSupportSession } from "@/actions/support-sessions";
import { Button } from "@/components/ui/button";

interface ActiveSession {
	id: string;
	admin_user_id: string;
	ticket_id: string | null;
	reason: string;
	approved_at: string;
	expires_at: string;
	admin_name?: string;
	admin_email?: string;
}

interface ActiveSessionBannerProps {
	session: ActiveSession;
	onSessionEnded?: () => void;
}

export function ActiveSessionBanner({
	session,
	onSessionEnded,
}: ActiveSessionBannerProps) {
	const [timeRemaining, setTimeRemaining] = useState("");
	const [isEnding, setIsEnding] = useState(false);
	const [isExpired, setIsExpired] = useState(false);

	// Calculate time remaining
	useEffect(() => {
		const updateTimer = () => {
			const now = new Date();
			const expiresAt = new Date(session.expires_at);
			const diff = expiresAt.getTime() - now.getTime();

			if (diff <= 0) {
				setTimeRemaining("Expired");
				setIsExpired(true);
				return;
			}

			const minutes = Math.floor(diff / 1000 / 60);
			const seconds = Math.floor((diff / 1000) % 60);

			if (minutes > 0) {
				setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
			} else {
				setTimeRemaining(`${seconds}s`);
			}
		};

		updateTimer();
		const interval = setInterval(updateTimer, 1000);

		return () => clearInterval(interval);
	}, [session.expires_at]);

	const handleEndSession = async () => {
		if (!confirm("Are you sure you want to end support access?")) {
			return;
		}

		setIsEnding(true);
		try {
			const result = await endActiveSupportSession(session.id);

			if (result.success) {
				toast.success("Support access ended");
				onSessionEnded?.();
			} else {
				toast.error("Failed to end access", {
					description: result.error,
				});
			}
		} catch (error) {
			toast.error("Error ending support access");
			console.error(error);
		} finally {
			setIsEnding(false);
		}
	};

	// Don't show if expired
	if (isExpired) {
		return null;
	}

	// Get timer color based on time remaining
	const getTimerColor = () => {
		const now = new Date();
		const expiresAt = new Date(session.expires_at);
		const minutesLeft = (expiresAt.getTime() - now.getTime()) / 1000 / 60;

		if (minutesLeft <= 5) return "text-red-600 dark:text-red-400";
		if (minutesLeft <= 10) return "text-yellow-600 dark:text-yellow-400";
		return "text-green-600 dark:text-green-400";
	};

	return (
		<div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white shadow-lg">
			<div className="container mx-auto px-4 py-2">
				<div className="flex items-center justify-between gap-4">
					{/* Left: Support viewing info */}
					<div className="flex items-center gap-3">
						<div className="rounded-full bg-white/20 p-1.5">
							<Shield className="h-4 w-4" />
						</div>
						<div className="flex items-center gap-2 text-sm">
							<span className="font-medium">Support Access Active</span>
							<span className="opacity-90">•</span>
							<span className="opacity-90">
								{session.admin_name || session.admin_email || "Support Team"}
							</span>
							{session.ticket_id && (
								<>
									<span className="opacity-90">•</span>
									<span className="opacity-90">
										Ticket: {session.ticket_id}
									</span>
								</>
							)}
						</div>
					</div>

					{/* Right: Timer and actions */}
					<div className="flex items-center gap-3">
						{/* Timer */}
						<div className="flex items-center gap-1.5 text-sm">
							<Clock className="h-3.5 w-3.5" />
							<span className={`font-mono font-medium ${getTimerColor()}`}>
								{timeRemaining}
							</span>
							<span className="opacity-90 text-xs">remaining</span>
						</div>

						{/* View Activity Link */}
						<Link
							href="/dashboard/settings/support-activity"
							className="hidden sm:flex"
						>
							<Button
								variant="ghost"
								size="sm"
								className="h-7 gap-1.5 text-white hover:bg-white/20"
							>
								<ExternalLink className="h-3.5 w-3.5" />
								<span className="text-xs">View Activity</span>
							</Button>
						</Link>

						{/* End Access Button */}
						<Button
							variant="ghost"
							size="sm"
							onClick={handleEndSession}
							disabled={isEnding}
							className="h-7 gap-1.5 text-white hover:bg-white/20 border border-white/30"
						>
							<X className="h-3.5 w-3.5" />
							<span className="text-xs">
								{isEnding ? "Ending..." : "End Access"}
							</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
