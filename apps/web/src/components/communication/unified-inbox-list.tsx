/**
 * Unified Inbox List Component
 *
 * Displays emails, SMS, calls, and voicemails in a single chronological timeline
 * Features:
 * - Type filtering (All, Email, SMS, Call)
 * - Auto-link confidence indicators
 * - Internal notes count badges
 * - Customer/job association display
 * - Unread badges and status indicators
 */

"use client";

import { formatDistanceToNow } from "date-fns";
import {
	AlertCircle,
	ArrowDownLeft,
	ArrowUpRight,
	Briefcase,
	ChevronRight,
	Circle,
	CircleDot,
	Clock,
	Filter,
	Link as LinkIcon,
	Mail,
	MapPin,
	MessageSquare,
	Mic,
	Phone,
	PhoneIncoming,
	PhoneMissed,
	PhoneOff,
	PhoneOutgoing,
	RefreshCw,
	Search,
	StickyNote,
	User,
	Voicemail,
	Volume2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Communication } from "@/lib/queries/communications";
import { cn } from "@/lib/utils";

type CommunicationType = "all" | "email" | "sms" | "call" | "voicemail";

interface UnifiedInboxListProps {
	initialCommunications: Communication[];
	companyId: string;
	teamMemberId: string;
	selectedId?: string | null;
	onSelect?: (communication: Communication) => void;
}

export function UnifiedInboxList({
	initialCommunications,
	companyId,
	teamMemberId,
	selectedId,
	onSelect,
}: UnifiedInboxListProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [communications, setCommunications] = useState<Communication[]>(
		initialCommunications,
	);
	const [selectedType, setSelectedType] = useState<CommunicationType>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [isPending, startTransition] = useTransition();

	// Filter communications by type
	const filteredCommunications = communications.filter((comm) => {
		// Type filter
		if (selectedType !== "all" && comm.type !== selectedType) {
			return false;
		}

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			const matchesSubject = comm.subject?.toLowerCase().includes(query);
			const matchesBody = comm.body?.toLowerCase().includes(query);
			const matchesFrom = comm.fromAddress?.toLowerCase().includes(query);
			const matchesTo = comm.toAddress?.toLowerCase().includes(query);
			return matchesSubject || matchesBody || matchesFrom || matchesTo;
		}

		return true;
	});

	// Handle communication selection
	const handleSelect = useCallback(
		(communication: Communication) => {
			if (onSelect) {
				onSelect(communication);
			} else {
				// Navigate to detail page
				const params = new URLSearchParams(searchParams.toString());
				params.set("id", communication.id);
				router.push(`/dashboard/communication?${params.toString()}`);
			}
		},
		[onSelect, router, searchParams],
	);

	// Refresh communications list
	const handleRefresh = useCallback(async () => {
		setLoading(true);
		try {
			const { getCommunicationsAction } = await import(
				"@/actions/communications"
			);
			const result = await getCommunicationsAction({
				teamMemberId,
				companyId,
				limit: 100,
			});

			if (result.success && result.data) {
				setCommunications(result.data as Communication[]);
			}
		} catch (error) {
			console.error("Failed to refresh communications:", error);
		} finally {
			setLoading(false);
		}
	}, [teamMemberId, companyId]);

	// Type filter buttons
	const typeFilters: {
		type: CommunicationType;
		label: string;
		icon: typeof Mail;
	}[] = [
		{ type: "all", label: "All", icon: Filter },
		{ type: "email", label: "Email", icon: Mail },
		{ type: "sms", label: "SMS", icon: MessageSquare },
		{ type: "call", label: "Calls", icon: Phone },
		{ type: "voicemail", label: "Voicemail", icon: Voicemail },
	];

	return (
		<div className="flex h-full flex-col">
			{/* Header with search and filters */}
			<div className="flex flex-col gap-3 border-b p-4">
				<div className="flex items-center gap-2">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search communications..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									onClick={handleRefresh}
									disabled={loading}
								>
									<RefreshCw
										className={cn("h-4 w-4", loading && "animate-spin")}
									/>
								</Button>
							</TooltipTrigger>
							<TooltipContent>Refresh</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				{/* Type filters */}
				<div className="flex gap-2">
					{typeFilters.map(({ type, label, icon: Icon }) => {
						const count =
							type === "all"
								? communications.length
								: communications.filter((c) => c.type === type).length;

						return (
							<Button
								key={type}
								variant={selectedType === type ? "default" : "outline"}
								size="sm"
								onClick={() => setSelectedType(type)}
								className="gap-2"
							>
								<Icon className="h-4 w-4" />
								{label}
								{count > 0 && (
									<Badge
										variant={selectedType === type ? "secondary" : "outline"}
										className="ml-1"
									>
										{count}
									</Badge>
								)}
							</Button>
						);
					})}
				</div>
			</div>

			{/* Communications list */}
			<ScrollArea className="flex-1">
				{filteredCommunications.length === 0 ? (
					<div className="flex h-64 items-center justify-center text-center p-4">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								No communications found
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								{searchQuery
									? "Try adjusting your search"
									: "New messages will appear here"}
							</p>
						</div>
					</div>
				) : (
					<div className="divide-y">
						{filteredCommunications.map((communication) => (
							<CommunicationListItem
								key={communication.id}
								communication={communication}
								isSelected={selectedId === communication.id}
								onClick={() => handleSelect(communication)}
							/>
						))}
					</div>
				)}
			</ScrollArea>

			{/* Footer with count */}
			<div className="border-t p-3 text-xs text-muted-foreground text-center">
				{filteredCommunications.length} of {communications.length}{" "}
				communications
			</div>
		</div>
	);
}

// Helper function to format call duration
function formatDuration(seconds: number | null | undefined): string {
	if (!seconds) return "0:00";
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Individual communication list item component
function CommunicationListItem({
	communication,
	isSelected,
	onClick,
}: {
	communication: Communication;
	isSelected: boolean;
	onClick: () => void;
}) {
	const isCall = communication.type === "call";
	const isVoicemail = communication.type === "voicemail";
	const isPhoneComm = isCall || isVoicemail;

	// Get call status for calls
	const getCallStatus = () => {
		if (!isCall) return null;

		const { status, hangupCause, callDuration, answeringMachineDetected } =
			communication;

		if (answeringMachineDetected) {
			return {
				label: "Voicemail",
				icon: Volume2,
				color: "text-orange-500",
			};
		}

		if (hangupCause === "no_answer" || status === "missed") {
			return {
				label: "Missed",
				icon: PhoneMissed,
				color: "text-red-500",
			};
		}

		if (callDuration && callDuration > 0) {
			return {
				label: formatDuration(callDuration),
				icon: Phone,
				color: "text-green-500",
			};
		}

		if (status === "in_progress") {
			return {
				label: "In Progress",
				icon: Phone,
				color: "text-blue-500",
			};
		}

		return {
			label: "Call",
			icon: Phone,
			color: "text-muted-foreground",
		};
	};

	const callStatus = getCallStatus();

	// Get type-specific icon and color
	const getTypeConfig = () => {
		switch (communication.type) {
			case "email":
				return { icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" };
			case "sms":
				return {
					icon: MessageSquare,
					color: "text-green-500",
					bg: "bg-green-500/10",
				};
			case "call":
				// Use direction-specific icon for calls
				const isInbound = communication.direction === "inbound";
				const isMissed =
					communication.hangupCause === "no_answer" ||
					communication.status === "missed";
				if (isMissed) {
					return {
						icon: PhoneMissed,
						color: "text-red-500",
						bg: "bg-red-500/10",
					};
				}
				return {
					icon: isInbound ? PhoneIncoming : PhoneOutgoing,
					color: isInbound ? "text-purple-500" : "text-indigo-500",
					bg: isInbound ? "bg-purple-500/10" : "bg-indigo-500/10",
				};
			case "voicemail":
				return {
					icon: Voicemail,
					color: "text-orange-500",
					bg: "bg-orange-500/10",
				};
			default:
				return { icon: Mail, color: "text-gray-500", bg: "bg-gray-500/10" };
		}
	};

	const { icon: TypeIcon, color, bg } = getTypeConfig();

	// Get sender/recipient display
	const displayAddress =
		communication.direction === "inbound"
			? communication.fromAddress
			: communication.toAddress;

	// Get contact name if available
	const contactName =
		communication.fromName ||
		(communication.customer?.firstName
			? `${communication.customer.firstName} ${communication.customer.lastName || ""}`.trim()
			: null);

	// Check if unread
	const isUnread =
		communication.status === "unread" || communication.status === "new";

	// Get first letter for avatar
	const avatarLetter =
		(contactName || displayAddress)?.charAt(0).toUpperCase() || "?";

	// Format timestamp
	const timestamp = formatDistanceToNow(new Date(communication.createdAt), {
		addSuffix: true,
	});

	// Auto-link confidence (if exists)
	const linkConfidence = communication.linkConfidence;
	const autoLinked = communication.autoLinked;

	// Get preview text for calls/voicemails
	const getPreviewText = () => {
		// For calls with transcription, show transcription preview
		if (isPhoneComm && communication.callTranscript) {
			return communication.callTranscript.slice(0, 100) + (communication.callTranscript.length > 100 ? "..." : "");
		}

		// For calls, show a descriptive status
		if (isCall) {
			const { callDuration, answeringMachineDetected, hangupCause, status } =
				communication;
			if (answeringMachineDetected) {
				return "Left a voicemail";
			}
			if (hangupCause === "no_answer" || status === "missed") {
				return "No answer";
			}
			if (callDuration && callDuration > 0) {
				return `Call lasted ${formatDuration(callDuration)}`;
			}
			return "Call ended";
		}

		// For voicemails without transcription
		if (isVoicemail && !communication.callTranscript) {
			return communication.callDuration
				? `${formatDuration(communication.callDuration)} voicemail`
				: "Voicemail message";
		}

		// Default to body for email/sms
		return communication.body;
	};

	const previewText = getPreviewText();

	return (
		<button
			onClick={onClick}
			className={cn(
				"w-full text-left p-4 hover:bg-accent/50 transition-colors",
				isSelected && "bg-accent",
				isUnread && "bg-blue-50/50 dark:bg-blue-950/20",
			)}
		>
			<div className="flex items-start gap-3">
				{/* Avatar with type indicator */}
				<div className="relative">
					<Avatar className="h-10 w-10">
						<AvatarFallback className={cn(bg, color)}>
							{avatarLetter}
						</AvatarFallback>
					</Avatar>
					<div
						className={cn("absolute -bottom-1 -right-1 rounded-full p-1", bg)}
					>
						<TypeIcon className={cn("h-3 w-3", color)} />
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 min-w-0">
					{/* Header row */}
					<div className="flex items-center gap-2 mb-1">
						<span
							className={cn(
								"font-medium truncate",
								isUnread && "font-semibold",
							)}
						>
							{contactName || displayAddress || "Unknown"}
						</span>
						{/* Show phone number if we have a contact name */}
						{contactName && displayAddress && (
							<span className="text-xs text-muted-foreground truncate">
								{displayAddress}
							</span>
						)}
						<span className="text-xs text-muted-foreground whitespace-nowrap ml-auto">
							{timestamp}
						</span>
						{isUnread && (
							<CircleDot className="h-3 w-3 text-blue-500 flex-shrink-0" />
						)}
					</div>

					{/* Subject/preview - special handling for calls */}
					<div className="space-y-1">
						{/* Call-specific header */}
						{isCall && callStatus && (
							<div className="flex items-center gap-2">
								<callStatus.icon className={cn("h-4 w-4", callStatus.color)} />
								<span
									className={cn(
										"text-sm font-medium",
										callStatus.color,
									)}
								>
									{communication.direction === "inbound"
										? "Incoming Call"
										: "Outgoing Call"}
								</span>
								{communication.callDuration && communication.callDuration > 0 && (
									<span className="text-xs text-muted-foreground">
										{formatDuration(communication.callDuration)}
									</span>
								)}
							</div>
						)}

						{/* Voicemail-specific header */}
						{isVoicemail && (
							<div className="flex items-center gap-2">
								<Voicemail className="h-4 w-4 text-orange-500" />
								<span className="text-sm font-medium text-orange-500">
									Voicemail
								</span>
								{communication.callDuration && (
									<span className="text-xs text-muted-foreground">
										{formatDuration(communication.callDuration)}
									</span>
								)}
							</div>
						)}

						{/* Email/SMS subject */}
						{!isPhoneComm && communication.subject && (
							<p
								className={cn(
									"text-sm truncate",
									isUnread ? "font-medium" : "text-muted-foreground",
								)}
							>
								{communication.subject}
							</p>
						)}

						{/* Preview text */}
						{previewText && (
							<p className="text-xs text-muted-foreground truncate line-clamp-2">
								{previewText}
							</p>
						)}
					</div>

					{/* Metadata badges */}
					<div className="flex items-center gap-2 mt-2 flex-wrap">
						{/* Customer link */}
						{communication.customerId && (
							<Badge variant="outline" className="gap-1 text-xs">
								<User className="h-3 w-3" />
								Customer
							</Badge>
						)}

						{/* Job link */}
						{communication.jobId && (
							<Badge variant="outline" className="gap-1 text-xs">
								<Briefcase className="h-3 w-3" />
								Job
							</Badge>
						)}

						{/* Property link */}
						{communication.propertyId && (
							<Badge variant="outline" className="gap-1 text-xs">
								<MapPin className="h-3 w-3" />
								Property
							</Badge>
						)}

						{/* Call-specific badges */}
						{isCall && (
							<>
								{/* Recording available */}
								{communication.callRecordingUrl && (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Badge variant="secondary" className="gap-1 text-xs">
													<Mic className="h-3 w-3" />
													Recording
												</Badge>
											</TooltipTrigger>
											<TooltipContent>Call recording available</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}

								{/* Transcription available */}
								{communication.callTranscript && (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Badge variant="secondary" className="gap-1 text-xs">
													<MessageSquare className="h-3 w-3" />
													Transcript
												</Badge>
											</TooltipTrigger>
											<TooltipContent>Transcription available</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}

								{/* Voicemail detected */}
								{communication.answeringMachineDetected && (
									<Badge variant="outline" className="gap-1 text-xs text-orange-500 border-orange-500/50">
										<Voicemail className="h-3 w-3" />
										VM
									</Badge>
								)}

								{/* Missed call */}
								{(communication.hangupCause === "no_answer" ||
									communication.status === "missed") && (
									<Badge variant="destructive" className="gap-1 text-xs">
										<PhoneMissed className="h-3 w-3" />
										Missed
									</Badge>
								)}
							</>
						)}

						{/* Voicemail-specific badges */}
						{isVoicemail && (
							<>
								{/* Recording available */}
								{communication.callRecordingUrl && (
									<Badge variant="secondary" className="gap-1 text-xs">
										<Volume2 className="h-3 w-3" />
										Audio
									</Badge>
								)}

								{/* Transcription available */}
								{communication.callTranscript && (
									<Badge variant="secondary" className="gap-1 text-xs">
										<MessageSquare className="h-3 w-3" />
										Transcript
									</Badge>
								)}
							</>
						)}

						{/* Auto-link indicator with confidence */}
						{autoLinked && linkConfidence !== undefined && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Badge
											variant={linkConfidence >= 0.8 ? "default" : "secondary"}
											className="gap-1 text-xs"
										>
											<LinkIcon className="h-3 w-3" />
											{Math.round(linkConfidence * 100)}%
										</Badge>
									</TooltipTrigger>
									<TooltipContent>
										Auto-linked with {Math.round(linkConfidence * 100)}%
										confidence
										{communication.linkMethod &&
											` (${communication.linkMethod})`}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}

						{/* Internal notes indicator */}
						{communication.internalNotes && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Badge variant="outline" className="gap-1 text-xs">
											<StickyNote className="h-3 w-3" />
											Notes
										</Badge>
									</TooltipTrigger>
									<TooltipContent>Has internal notes</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}

						{/* Direction indicator - only for non-phone communications */}
						{!isPhoneComm && (
							<Badge variant="outline" className="text-xs">
								{communication.direction === "inbound" ? "Received" : "Sent"}
							</Badge>
						)}

						{/* Status badges */}
						{communication.status === "failed" && (
							<Badge variant="destructive" className="gap-1 text-xs">
								<AlertCircle className="h-3 w-3" />
								Failed
							</Badge>
						)}
					</div>
				</div>

				{/* Chevron indicator */}
				<ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 self-center" />
			</div>
		</button>
	);
}
