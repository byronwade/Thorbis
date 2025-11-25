"use client";

/**
 * Call Toolbar Component - Enhanced for CSR Efficiency
 *
 * Top toolbar for call window with all call controls, customer info, and actions.
 *
 * Enhanced features:
 * - Prominent mute indicator (full-width banner when muted)
 * - Hold timer display
 * - Recording duration and indicator
 * - Keyboard shortcut hints on hover
 * - Visual pulse animations for active states
 */

import {
	ArrowRightLeft,
	Circle,
	Keyboard,
	Mic,
	MicOff,
	Pause,
	PhoneOff,
	Play,
	Signal,
	Square,
	Timer,
	Video,
	VideoOff,
	Wifi,
	WifiOff,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { CustomerCallData } from "@/types/call-window";

type CallToolbarProps = {
	// Call state
	callId: string;
	isActive: boolean;
	isMuted: boolean;
	isOnHold: boolean;
	isRecording: boolean;
	videoStatus: "off" | "requesting" | "ringing" | "connected" | "declined";
	connectionQuality: "excellent" | "good" | "poor" | "unknown";
	callDuration: string;

	// Enhanced state tracking
	holdStartTime?: number; // Timestamp when hold started
	recordingStartTime?: number; // Timestamp when recording started

	// Customer data
	customerData: CustomerCallData | null;
	callerName: string;
	callerNumber: string;

	// Actions
	onMuteToggle: () => void;
	onHoldToggle: () => void;
	onRecordToggle: () => void;
	onVideoToggle: () => void;
	onTransfer: () => void;
	onEndCall: () => void;
	onClose: () => void;
	onShowShortcuts?: () => void;
};

export function CallToolbar({
	callId,
	isActive,
	isMuted,
	isOnHold,
	isRecording,
	videoStatus,
	connectionQuality,
	callDuration,
	holdStartTime,
	recordingStartTime,
	customerData,
	callerName,
	callerNumber,
	onMuteToggle,
	onHoldToggle,
	onRecordToggle,
	onVideoToggle,
	onTransfer,
	onEndCall,
	onClose,
	onShowShortcuts,
}: CallToolbarProps) {
	const [_showMoreMenu, _setShowMoreMenu] = useState(false);

	// Track hold duration
	const [holdDuration, setHoldDuration] = useState(0);
	useEffect(() => {
		if (!isOnHold || !holdStartTime) {
			setHoldDuration(0);
			return;
		}

		const interval = setInterval(() => {
			setHoldDuration(Math.floor((Date.now() - holdStartTime) / 1000));
		}, 1000);

		return () => clearInterval(interval);
	}, [isOnHold, holdStartTime]);

	// Track recording duration
	const [recordingDuration, setRecordingDuration] = useState(0);
	useEffect(() => {
		if (!isRecording || !recordingStartTime) {
			setRecordingDuration(0);
			return;
		}

		const interval = setInterval(() => {
			setRecordingDuration(Math.floor((Date.now() - recordingStartTime) / 1000));
		}, 1000);

		return () => clearInterval(interval);
	}, [isRecording, recordingStartTime]);

	// Format duration helper
	const formatTimerDuration = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Get initials for avatar
	const getInitials = (name: string) => {
		if (!name || name === "Unknown Caller") {
			return "?";
		}
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	// Get connection quality icon and color
	const getConnectionIcon = () => {
		switch (connectionQuality) {
			case "excellent":
				return <Signal className="text-success h-3 w-3" />;
			case "good":
				return <Wifi className="text-warning h-3 w-3" />;
			case "poor":
				return <WifiOff className="text-destructive h-3 w-3" />;
			default:
				return <Signal className="text-muted-foreground h-3 w-3" />;
		}
	};

	// Get connection quality badge variant
	const getQualityVariant = () => {
		switch (connectionQuality) {
			case "excellent":
				return "default";
			case "good":
				return "secondary";
			case "poor":
				return "destructive";
			default:
				return "outline";
		}
	};

	const customerAvatar =
		customerData?.customer &&
		typeof customerData.customer === "object" &&
		"avatar_url" in customerData.customer
			? ((customerData.customer as { avatar_url?: string }).avatar_url ??
				undefined)
			: undefined;

	return (
		<TooltipProvider delayDuration={300}>
			<div className="relative">
				{/* Mute Banner - Full width when muted */}
				{isMuted && (
					<div className="bg-destructive/10 border-destructive/30 flex items-center justify-center gap-2 border-b px-4 py-2">
						<MicOff className="text-destructive h-4 w-4 animate-pulse" />
						<span className="text-destructive text-sm font-medium">
							You are muted
						</span>
						<span className="text-destructive/70 text-xs">
							Press M to unmute
						</span>
					</div>
				)}

				{/* Hold Banner - Full width when on hold */}
				{isOnHold && (
					<div className="bg-warning/10 border-warning/30 flex items-center justify-center gap-2 border-b px-4 py-2">
						<Timer className="text-warning h-4 w-4" />
						<span className="text-warning text-sm font-medium">
							Call on hold
						</span>
						<Badge variant="outline" className="text-warning border-warning/50 font-mono text-xs">
							{formatTimerDuration(holdDuration)}
						</Badge>
						<span className="text-warning/70 text-xs">
							Press H to resume
						</span>
					</div>
				)}

				<div className="bg-card/50 flex items-center justify-between px-6 py-3 backdrop-blur-sm">
					{/* Left: Customer Info */}
					<div className="flex items-center gap-3">
						<div className="relative">
							<Avatar className="h-11 w-11">
								<AvatarImage src={customerAvatar} />
								<AvatarFallback
									className={cn(
										"text-base font-semibold transition-all",
										isActive
											? "bg-emerald-500/20 text-emerald-600 ring-2 ring-emerald-500/30"
											: "bg-muted text-muted-foreground",
									)}
								>
									{getInitials(callerName)}
								</AvatarFallback>
							</Avatar>
							{isActive && (
								<div className="ring-background absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2" />
							)}
						</div>

						<div className="space-y-0.5">
							<div className="flex items-center gap-2">
								<span className="text-foreground text-sm font-semibold">
									{callerName}
								</span>
								{isActive && (
									<div className="flex items-center gap-1.5">
										<span className="text-muted-foreground font-mono text-xs tabular-nums">
											{callDuration}
										</span>
										{isRecording && (
											<div className="flex items-center gap-1">
												<Circle className="size-2 animate-pulse fill-red-500 text-red-500" />
												<span className="text-destructive font-mono text-xs">
													REC {formatTimerDuration(recordingDuration)}
												</span>
											</div>
										)}
									</div>
								)}
							</div>
							<div className="flex items-center gap-2">
								<span className="text-muted-foreground font-mono text-xs">
									{callerNumber}
								</span>
								{customerData?.isKnownCustomer && (
									<Badge className="h-4 px-1.5 text-[10px]" variant="outline">
										Customer
									</Badge>
								)}
							</div>
						</div>
					</div>

					{/* Center: Call Controls */}
					<div className="flex items-center justify-center gap-2">
						{/* Mute */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className={cn(
										"h-10 w-10 rounded-full transition-all hover:scale-105",
										isMuted && "ring-destructive/50 ring-2 ring-offset-2",
										!isMuted && "hover:bg-muted",
									)}
									onClick={onMuteToggle}
									size="icon"
									variant={isMuted ? "destructive" : "ghost"}
								>
									{isMuted ? (
										<MicOff className="size-4 animate-pulse" />
									) : (
										<Mic className="size-4" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>{isMuted ? "Unmute" : "Mute"}</p>
								<p className="text-muted-foreground text-xs">Press M</p>
							</TooltipContent>
						</Tooltip>

						{/* Hold */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className={cn(
										"h-10 w-10 rounded-full transition-all hover:scale-105",
										isOnHold && "ring-warning/50 ring-2 ring-offset-2",
										!isOnHold && "hover:bg-muted",
									)}
									onClick={onHoldToggle}
									size="icon"
									variant={isOnHold ? "secondary" : "ghost"}
								>
									{isOnHold ? (
										<Play className="size-4" />
									) : (
										<Pause className="size-4" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>{isOnHold ? "Resume" : "Hold"}</p>
								<p className="text-muted-foreground text-xs">Press H</p>
							</TooltipContent>
						</Tooltip>

						{/* Record */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className={cn(
										"h-10 w-10 rounded-full transition-all hover:scale-105",
										isRecording && "ring-destructive/50 ring-2 ring-offset-2",
										!isRecording && "hover:bg-muted",
									)}
									onClick={onRecordToggle}
									size="icon"
									variant={isRecording ? "destructive" : "ghost"}
								>
									{isRecording ? (
										<Circle className="size-4 animate-pulse fill-current" />
									) : (
										<Square className="size-4" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>{isRecording ? "Stop Recording" : "Record"}</p>
								<p className="text-muted-foreground text-xs">Press R</p>
							</TooltipContent>
						</Tooltip>

						<div className="bg-border mx-2 h-6 w-px" />

						{/* Video */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className={cn(
										"h-10 w-10 rounded-full transition-all hover:scale-105",
										videoStatus === "off" && "hover:bg-muted",
									)}
									onClick={onVideoToggle}
									size="icon"
									variant={videoStatus === "connected" ? "default" : "ghost"}
								>
									{videoStatus === "connected" ? (
										<Video className="size-4" />
									) : (
										<VideoOff className="size-4" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>{videoStatus === "connected" ? "End Video" : "Start Video"}</p>
							</TooltipContent>
						</Tooltip>

						{/* Transfer */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className="hover:bg-muted h-10 w-10 rounded-full transition-all hover:scale-105"
									onClick={onTransfer}
									size="icon"
									variant="ghost"
								>
									<ArrowRightLeft className="size-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>Transfer Call</p>
								<p className="text-muted-foreground text-xs">Press T</p>
							</TooltipContent>
						</Tooltip>

						<div className="bg-border mx-2 h-6 w-px" />

						{/* End Call */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className="text-destructive-foreground h-12 w-12 rounded-full transition-all hover:scale-105"
									onClick={onEndCall}
									size="icon"
									variant="destructive"
								>
									<PhoneOff className="size-5" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>End Call</p>
								<p className="text-muted-foreground text-xs">Press Shift+E</p>
							</TooltipContent>
						</Tooltip>
					</div>

					{/* Right: Connection Quality, Shortcuts & Close */}
					<div className="flex items-center gap-1.5">
						<Badge
							className="font-mono text-[10px]"
							title={
								connectionQuality === "unknown"
									? "Monitoring connection quality..."
									: undefined
							}
							variant={getQualityVariant() as any}
						>
							{getConnectionIcon()}
							<span className="ml-1 capitalize">{connectionQuality}</span>
						</Badge>

						{/* Keyboard Shortcuts Button */}
						{onShowShortcuts && (
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										className="h-8 w-8"
										onClick={onShowShortcuts}
										size="icon"
										variant="ghost"
									>
										<Keyboard className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent side="bottom">
									<p>Keyboard Shortcuts</p>
									<p className="text-muted-foreground text-xs">Press ?</p>
								</TooltipContent>
							</Tooltip>
						)}

						<Button
							className="h-8 w-8"
							onClick={onClose}
							size="icon"
							variant="ghost"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
