"use client";

/**
 * Admin View-As Banner
 *
 * Persistent banner shown at the top when admin is in view-as mode.
 * Shows session info, timer, and exit button.
 * Features collapsible notes section for session documentation.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X, Clock, MessageSquare, ExternalLink, ChevronDown, ChevronUp, Save, FileText } from "lucide-react";
import { endSupportSession, updateSessionNotes } from "@/actions/support-sessions";
import { toast } from "sonner";

interface AdminViewAsBannerProps {
	session: {
		id: string;
		company_id: string;
		ticket_id?: string;
		expires_at?: string;
		notes?: string;
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
	const [notes, setNotes] = useState(session.notes || "");
	const [isEnding, setIsEnding] = useState(false);
	const [isNotesExpanded, setIsNotesExpanded] = useState(false);
	const [isSavingNotes, setIsSavingNotes] = useState(false);
	const [hasUnsavedNotes, setHasUnsavedNotes] = useState(false);
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastSavedNotesRef = useRef(session.notes || "");

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

	// Save notes to session
	const saveNotes = useCallback(async () => {
		if (notes === lastSavedNotesRef.current) return;

		setIsSavingNotes(true);
		try {
			const result = await updateSessionNotes(session.id, notes);
			if (result.error) {
				toast.error("Failed to save notes");
			} else {
				lastSavedNotesRef.current = notes;
				setHasUnsavedNotes(false);
			}
		} catch (error) {
			toast.error("Failed to save notes");
		} finally {
			setIsSavingNotes(false);
		}
	}, [session.id, notes]);

	// Handle notes change with auto-save debounce
	const handleNotesChange = (value: string) => {
		setNotes(value);
		setHasUnsavedNotes(value !== lastSavedNotesRef.current);

		// Clear existing timeout
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
		}

		// Auto-save after 2 seconds of inactivity
		saveTimeoutRef.current = setTimeout(() => {
			saveNotes();
		}, 2000);
	};

	// Clean up timeout on unmount
	useEffect(() => {
		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, []);

	// Save notes before ending session
	const handleEndSessionWithNotes = async () => {
		// Save any unsaved notes first
		if (hasUnsavedNotes) {
			await saveNotes();
		}
		handleEndSession();
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
						{/* Notes toggle button */}
						<Button
							variant="ghost"
							size="sm"
							className="text-white hover:bg-white/20"
							onClick={() => setIsNotesExpanded(!isNotesExpanded)}
						>
							<FileText className="h-4 w-4 mr-1" />
							Notes
							{hasUnsavedNotes && <span className="ml-1 text-yellow-200">•</span>}
							{isNotesExpanded ? (
								<ChevronUp className="h-3 w-3 ml-1" />
							) : (
								<ChevronDown className="h-3 w-3 ml-1" />
							)}
						</Button>

						<Button
							variant="ghost"
							size="sm"
							className="text-white hover:bg-white/20"
							onClick={handleEndSessionWithNotes}
							disabled={isEnding}
						>
							<X className="h-4 w-4 mr-1" />
							End Session
						</Button>
					</div>
				</div>

				{/* Collapsible Notes Section */}
				{isNotesExpanded && (
					<div className="pb-4 border-t border-white/20 mt-2 pt-3">
						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<label className="text-sm font-medium text-white/90">
									Session Notes
								</label>
								<div className="flex items-center gap-2">
									{hasUnsavedNotes && (
										<span className="text-xs text-yellow-200">Unsaved changes</span>
									)}
									{isSavingNotes && (
										<span className="text-xs text-white/70">Saving...</span>
									)}
									<Button
										variant="ghost"
										size="sm"
										className="h-7 px-2 text-white hover:bg-white/20"
										onClick={saveNotes}
										disabled={isSavingNotes || !hasUnsavedNotes}
									>
										<Save className="h-3 w-3 mr-1" />
										Save
									</Button>
								</div>
							</div>
							<Textarea
								value={notes}
								onChange={(e) => handleNotesChange(e.target.value)}
								placeholder="Add notes about this support session (actions taken, issues found, etc.)..."
								className="min-h-[80px] bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 resize-none"
								rows={3}
							/>
							<p className="text-xs text-white/60">
								Notes are saved automatically and will be attached to the session audit log.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
