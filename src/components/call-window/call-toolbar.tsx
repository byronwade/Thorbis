"use client";

/**
 * Call Toolbar Component
 *
 * Top toolbar for call window with all call controls, customer info, and actions.
 * Follows the minimalistic design pattern from the existing call window.
 */

import {
	ArrowRightLeft,
	Circle,
	Mic,
	MicOff,
	Pause,
	PhoneOff,
	Play,
	Signal,
	Square,
	Video,
	VideoOff,
	Wifi,
	WifiOff,
	X,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
}: CallToolbarProps) {
	const [_showMoreMenu, _setShowMoreMenu] = useState(false);

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
			? ((customerData.customer as { avatar_url?: string }).avatar_url ?? undefined)
			: undefined;

	return (
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
									: "bg-muted text-muted-foreground"
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
						<span className="text-foreground text-sm font-semibold">{callerName}</span>
						{isActive && (
							<div className="flex items-center gap-1.5">
								<span className="text-muted-foreground font-mono text-xs tabular-nums">
									{callDuration}
								</span>
								{isRecording && (
									<Circle className="size-1.5 animate-pulse fill-red-500 text-red-500" />
								)}
							</div>
						)}
					</div>
					<div className="flex items-center gap-2">
						<span className="text-muted-foreground font-mono text-xs">{callerNumber}</span>
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
				<Button
					className={cn(
						"h-10 w-10 rounded-full transition-all hover:scale-105",
						!isMuted && "hover:bg-muted"
					)}
					onClick={onMuteToggle}
					size="icon"
					title={isMuted ? "Unmute" : "Mute"}
					variant={isMuted ? "destructive" : "ghost"}
				>
					{isMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
				</Button>

				{/* Hold */}
				<Button
					className="hover:bg-muted h-10 w-10 rounded-full transition-all hover:scale-105"
					onClick={onHoldToggle}
					size="icon"
					title={isOnHold ? "Resume" : "Hold"}
					variant={isOnHold ? "secondary" : "ghost"}
				>
					{isOnHold ? <Play className="size-4" /> : <Pause className="size-4" />}
				</Button>

				{/* Record */}
				<Button
					className={cn(
						"h-10 w-10 rounded-full transition-all hover:scale-105",
						!isRecording && "hover:bg-muted"
					)}
					onClick={onRecordToggle}
					size="icon"
					title={isRecording ? "Stop Recording" : "Record"}
					variant={isRecording ? "destructive" : "ghost"}
				>
					{isRecording ? <Circle className="size-4 fill-current" /> : <Square className="size-4" />}
				</Button>

				<div className="bg-border mx-2 h-6 w-px" />

				{/* Video */}
				<Button
					className={cn(
						"h-10 w-10 rounded-full transition-all hover:scale-105",
						videoStatus === "off" && "hover:bg-muted"
					)}
					onClick={onVideoToggle}
					size="icon"
					title={videoStatus === "connected" ? "End Video" : "Start Video"}
					variant={videoStatus === "connected" ? "default" : "ghost"}
				>
					{videoStatus === "connected" ? (
						<Video className="size-4" />
					) : (
						<VideoOff className="size-4" />
					)}
				</Button>

				{/* Transfer */}
				<Button
					className="hover:bg-muted h-10 w-10 rounded-full transition-all hover:scale-105"
					onClick={onTransfer}
					size="icon"
					title="Transfer"
					variant="ghost"
				>
					<ArrowRightLeft className="size-4" />
				</Button>

				<div className="bg-border mx-2 h-6 w-px" />

				{/* End Call */}
				<Button
					className="text-destructive-foreground h-12 w-12 rounded-full transition-all hover:scale-105"
					onClick={onEndCall}
					size="icon"
					title="End Call"
					variant="destructive"
				>
					<PhoneOff className="size-5" />
				</Button>
			</div>

			{/* Right: Connection Quality & Close */}
			<div className="flex items-center gap-1.5">
				<Badge
					className="font-mono text-[10px]"
					title={connectionQuality === "unknown" ? "Monitoring connection quality..." : undefined}
					variant={getQualityVariant() as any}
				>
					{getConnectionIcon()}
					<span className="ml-1 capitalize">{connectionQuality}</span>
				</Badge>

				<Button className="h-8 w-8" onClick={onClose} size="icon" variant="ghost">
					<X className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
