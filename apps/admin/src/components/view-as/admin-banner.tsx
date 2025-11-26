"use client";

/**
 * Admin View-As Banner
 *
 * Persistent banner shown at the top when admin is in view-as mode.
 * Shows session info, timer, and exit button.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X, Clock, MessageSquare, ExternalLink } from "lucide-react";
import { endSupportSession } from "@/actions/support-sessions";
import { toast } from "sonner";

interface AdminViewAsBannerProps {
	session: {
		id: string;
		company_id: string;
		ticket_id?: string;
		expires_at?: string;
		admin_users?: {
			email?: string;
			full_name?: string;
		};
	};
	companyId: string;
}

export function AdminViewAsBanner({ session, companyId }: AdminViewAsBannerProps) {
	const router = useRouter();
	const [timeRemaining, setTimeRemaining] = useState<number>(0);
	const [notes, setNotes] = useState("");
	const [isEnding, setIsEnding] = useState(false);

	// Calculate time remaining
	useEffect(() => {
		if (!session.expires_at) return;

		const calculateTimeRemaining = () => {
			const expiresAt = new Date(session.expires_at!).getTime();
			const now = Date.now();
			const remaining = Math.max(0, expiresAt - now);
			setTimeRemaining(remaining);

			// Auto-redirect when session expires
			if (remaining === 0) {
				toast.error("Support session has expired");
				router.push("/admin/dashboard/work/companies");
			}
		};

		calculateTimeRemaining();
		const interval = setInterval(calculateTimeRemaining, 1000);

		return () => clearInterval(interval);
	}, [session.expires_at, router]);

	// Format time remaining
	const formatTimeRemaining = (ms: number): string => {
		const minutes = Math.floor(ms / 1000 / 60);
		const seconds = Math.floor((ms / 1000) % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	// Handle end session
	const handleEndSession = async () => {
		setIsEnding(true);
		try {
			const result = await endSupportSession(session.id, "admin");
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Support session ended");
				router.push("/admin/dashboard/work/companies");
			}
		} catch (error) {
			toast.error("Failed to end session");
		} finally {
			setIsEnding(false);
		}
	};

	// Get warning color based on time remaining
	const getTimerColor = () => {
		const minutes = timeRemaining / 1000 / 60;
		if (minutes <= 5) return "text-red-600";
		if (minutes <= 15) return "text-yellow-600";
		return "text-green-600";
	};

	return (
		<div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16 gap-4">
					{/* Left: Session info */}
					<div className="flex items-center gap-4">
						<Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
							View-As Mode
						</Badge>

						<div className="hidden md:flex items-center gap-2 text-sm">
							<span className="font-medium">Company:</span>
							<span className="font-mono">{companyId.slice(0, 8)}...</span>
						</div>

						{session.ticket_id && (
							<div className="hidden lg:flex items-center gap-2 text-sm">
								<MessageSquare className="h-4 w-4" />
								<span>Ticket #{session.ticket_id.slice(0, 8)}</span>
								<Button variant="ghost" size="sm" className="h-6 px-2 text-white hover:bg-white/20" asChild>
									<a href={`/admin/dashboard/work/support/${session.ticket_id}`} target="_blank">
										<ExternalLink className="h-3 w-3" />
									</a>
								</Button>
							</div>
						)}
					</div>

					{/* Center: Timer */}
					<div className={`flex items-center gap-2 text-sm font-mono ${getTimerColor()}`}>
						<Clock className="h-4 w-4" />
						<span className="font-bold">{formatTimeRemaining(timeRemaining)}</span>
					</div>

					{/* Right: Actions */}
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleEndSession} disabled={isEnding}>
							<X className="h-4 w-4 mr-1" />
							End Session
						</Button>
					</div>
				</div>

				{/* Optional: Notes field (expandable) */}
				{/* TODO: Implement collapsible notes section */}
			</div>
		</div>
	);
}
