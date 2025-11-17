"use client";

import {
	Check,
	ChevronUp,
	Circle,
	Copy,
	Grid3x3,
	Heart,
	Maximize,
	MessageSquare,
	Mic,
	MicOff,
	Minimize2,
	Monitor,
	MonitorOff,
	MoreVertical,
	PartyPopper,
	PhoneOff,
	Send,
	Share2,
	SignalHigh,
	SignalLow,
	SignalMedium,
	Smile,
	Sparkles,
	ThumbsUp,
	Users,
	Video,
	VideoOff,
	Volume2,
	X,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Participant = {
	id: string;
	name: string;
	avatar?: string;
	isMuted: boolean;
	isVideoEnabled: boolean;
	isSpeaking: boolean;
	isScreenSharing: boolean;
};

type VideoConferenceProps = {
	caller: { name?: string; number: string; avatar?: string };
	callDuration: string;
	call: {
		isMuted: boolean;
		videoStatus: "off" | "requesting" | "ringing" | "connected" | "declined";
		isLocalVideoEnabled: boolean;
		isRemoteVideoEnabled: boolean;
		isRecording: boolean;
		isScreenSharing: boolean;
		connectionQuality: "excellent" | "good" | "poor";
		hasVirtualBackground: boolean;
		reactions: Array<{
			id: string;
			type: "thumbs-up" | "clap" | "heart" | "tada";
			timestamp: number;
		}>;
		chatMessages: Array<{
			id: string;
			sender: "me" | "them";
			message: string;
			timestamp: number;
		}>;
		participants: Participant[];
		meetingLink: string;
	};
	onEndCall: () => void;
	onEndVideo: () => void;
	onToggleLocalVideo: () => void;
	toggleMute: () => void;
	toggleRecording: () => void;
	toggleScreenShare: () => void;
	toggleVirtualBackground: () => void;
	addReaction: (type: "thumbs-up" | "clap" | "heart" | "tada") => void;
	sendChatMessage: (message: string) => void;
};

export function VideoConferenceView({
	caller,
	callDuration,
	call,
	onEndCall,
	onEndVideo,
	onToggleLocalVideo,
	toggleMute,
	toggleRecording,
	toggleScreenShare,
	toggleVirtualBackground,
	addReaction,
	sendChatMessage,
}: VideoConferenceProps) {
	const [isMinimized, setIsMinimized] = useState(false);
	const [showParticipants, setShowParticipants] = useState(false);
	const [showChat, setShowChat] = useState(false);
	const [showReactions, setShowReactions] = useState(false);
	const [_showSettings, _setShowSettings] = useState(false);
	const [showShareMenu, setShowShareMenu] = useState(false);
	const [viewMode, setViewMode] = useState<"speaker" | "gallery">("gallery");
	const [chatInput, setChatInput] = useState("");
	const [linkCopied, setLinkCopied] = useState(false);

	// Helper functions
	const getConnectionIcon = () => {
		if (call.connectionQuality === "excellent") {
			return <SignalHigh className="size-3.5 text-emerald-500" />;
		}
		if (call.connectionQuality === "good") {
			return <SignalMedium className="text-warning size-3.5" />;
		}
		return <SignalLow className="text-destructive size-3.5" />;
	};

	const getReactionIcon = (type: string) => {
		if (type === "thumbs-up") {
			return <ThumbsUp className="size-6" />;
		}
		if (type === "heart") {
			return <Heart className="size-6 fill-current" />;
		}
		if (type === "tada") {
			return <PartyPopper className="size-6" />;
		}
		return <Sparkles className="size-6" />;
	};

	const handleSendMessage = () => {
		if (chatInput.trim()) {
			sendChatMessage(chatInput);
			setChatInput("");
		}
	};

	const copyMeetingLink = async () => {
		try {
			await navigator.clipboard.writeText(call.meetingLink);
			setLinkCopied(true);
			setTimeout(() => setLinkCopied(false), 2000);
		} catch (_err) {}
	};

	// Minimized floating window - Vercel-inspired
	if (isMinimized) {
		return (
			<div className="fade-in animate-in border-border/50 fixed right-6 bottom-6 z-50 h-48 w-80 cursor-move overflow-hidden rounded-lg border bg-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] duration-200 hover:shadow-[0_30px_60px_rgb(0,0,0,0.12)]">
				{/* Mini video view */}
				<div className="relative h-full w-full">
					{call.videoStatus === "connected" && call.isRemoteVideoEnabled ? (
						<div className="h-full w-full bg-gradient-to-br from-blue-950/30 via-black to-black">
							<div className="flex h-full items-center justify-center">
								<Avatar className="size-20 ring-1 ring-white/10">
									<AvatarImage src={caller.avatar} />
									<AvatarFallback className="bg-foreground text-muted-foreground text-2xl">
										{caller.name
											?.split(" ")
											.map((n) => n[0])
											.join("")
											.toUpperCase() || "?"}
									</AvatarFallback>
								</Avatar>
							</div>
						</div>
					) : (
						<div className="bg-foreground/50 flex h-full items-center justify-center">
							<Video className="text-foreground size-12" />
						</div>
					)}

					{/* Mini controls overlay */}
					<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 backdrop-blur-sm">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<button
									className={cn(
										"flex size-8 items-center justify-center rounded-full border transition-all",
										call.isMuted
											? "border-destructive/50 bg-destructive hover:bg-destructive"
											: "border-border bg-foreground/80 hover:bg-foreground"
									)}
									onClick={toggleMute}
									type="button"
								>
									{call.isMuted ? (
										<MicOff className="size-3.5 text-white" />
									) : (
										<Mic className="size-3.5 text-white" />
									)}
								</button>
								<button
									className={cn(
										"flex size-8 items-center justify-center rounded-full border transition-all",
										call.isLocalVideoEnabled
											? "border-border bg-foreground/80 hover:bg-foreground"
											: "border-destructive/50 bg-destructive hover:bg-destructive"
									)}
									onClick={onToggleLocalVideo}
									type="button"
								>
									{call.isLocalVideoEnabled ? (
										<Video className="size-3.5 text-white" />
									) : (
										<VideoOff className="size-3.5 text-white" />
									)}
								</button>
							</div>
							<div className="flex items-center gap-2">
								<button
									className="border-border bg-foreground/80 hover:bg-foreground flex size-8 items-center justify-center rounded-full border transition-all"
									onClick={() => setIsMinimized(false)}
									title="Restore"
									type="button"
								>
									<Maximize className="size-3.5 text-white" />
								</button>
								<button
									className="border-destructive/50 bg-destructive hover:bg-destructive flex size-8 items-center justify-center rounded-full border transition-all"
									onClick={onEndCall}
									title="End call"
									type="button"
								>
									<PhoneOff className="size-3 text-white" />
								</button>
							</div>
						</div>
					</div>

					{/* Name tag */}
					<div className="border-foreground/10 bg-background/80 absolute top-3 left-3 rounded-md border px-2.5 py-1 backdrop-blur-md">
						<p className="text-xs font-medium text-white">{caller.name || caller.number}</p>
					</div>

					{/* Call duration */}
					<div className="border-foreground/10 bg-background/80 absolute top-3 right-3 flex items-center gap-1.5 rounded-md border px-2.5 py-1 backdrop-blur-md">
						<div className="size-1.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
						<span className="font-mono text-[11px] text-white tabular-nums">{callDuration}</span>
					</div>
				</div>
			</div>
		);
	}

	// Full video conference view - Vercel-inspired
	return (
		<div className="fade-in animate-in fixed inset-0 z-50 flex flex-col bg-black duration-300">
			{/* Header Bar - Pure black with subtle border */}
			<div className="flex items-center justify-between border-b border-white/10 bg-black px-6 py-3 backdrop-blur-xl">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<div className="size-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
						<span className="text-muted-foreground font-mono text-sm tabular-nums">
							{callDuration}
						</span>
					</div>

					{/* Recording Indicator */}
					{call.isRecording && (
						<div className="border-destructive/50 bg-destructive/20 flex items-center gap-1.5 rounded-md border px-2.5 py-1">
							<Circle className="text-destructive size-2 animate-pulse fill-current" />
							<span className="text-destructive text-[11px] font-medium">Recording</span>
						</div>
					)}

					{/* Connection Quality */}
					<div className="bg-foreground/50 flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1">
						{getConnectionIcon()}
						<span className="text-muted-foreground text-[11px] font-medium capitalize">
							{call.connectionQuality}
						</span>
					</div>

					{call.videoStatus === "connected" && (
						<div className="bg-foreground/50 rounded-md border border-white/10 px-2.5 py-1">
							<p className="text-muted-foreground text-[11px] font-medium">HD Quality</p>
						</div>
					)}
				</div>

				<div className="flex items-center gap-2">
					<button
						className={cn(
							"rounded-md border px-3 py-1.5 text-xs font-medium transition-all",
							viewMode === "speaker"
								? "bg-card border-white/10 text-black shadow-sm"
								: "text-muted-foreground hover:bg-foreground border-white/10 bg-black hover:text-white"
						)}
						onClick={() => setViewMode("speaker")}
						type="button"
					>
						Speaker
					</button>
					<button
						className={cn(
							"flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all",
							viewMode === "gallery"
								? "bg-card border-white/10 text-black shadow-sm"
								: "text-muted-foreground hover:bg-foreground border-white/10 bg-black hover:text-white"
						)}
						onClick={() => setViewMode("gallery")}
						type="button"
					>
						<Grid3x3 className="size-3" /> Gallery
					</button>

					{/* Share Link Button */}
					<div className="relative">
						<button
							className="hover:bg-foreground rounded-md border border-white/10 bg-black p-2 transition-all"
							onClick={() => setShowShareMenu(!showShareMenu)}
							title="Share meeting link"
							type="button"
						>
							<Share2 className="text-muted-foreground size-4" />
						</button>

						{showShareMenu && (
							<div className="absolute top-full right-0 mt-2 w-72 rounded-lg border border-white/10 bg-black p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
								<div className="mb-3 flex items-center justify-between">
									<h3 className="text-sm font-semibold text-white">Share Link</h3>
									<button
										className="hover:bg-foreground rounded-md p-1 transition-colors"
										onClick={() => setShowShareMenu(false)}
										type="button"
									>
										<X className="text-muted-foreground size-4" />
									</button>
								</div>
								<div className="flex gap-2">
									<div className="bg-foreground flex-1 rounded-md border border-white/10 px-3 py-2">
										<p className="text-muted-foreground truncate font-mono text-xs">
											{call.meetingLink}
										</p>
									</div>
									<button
										className={cn(
											"flex size-10 items-center justify-center rounded-md border transition-all",
											linkCopied
												? "border-emerald-600/50 bg-emerald-600"
												: "bg-foreground hover:bg-foreground border-white/10"
										)}
										onClick={copyMeetingLink}
										title="Copy link"
										type="button"
									>
										{linkCopied ? (
											<Check className="size-4 text-white" />
										) : (
											<Copy className="size-4 text-white" />
										)}
									</button>
								</div>
							</div>
						)}
					</div>

					<button
						className="hover:bg-foreground rounded-md border border-white/10 bg-black p-2 transition-all"
						onClick={() => setIsMinimized(true)}
						title="Minimize"
						type="button"
					>
						<Minimize2 className="text-muted-foreground size-4" />
					</button>
				</div>
			</div>

			{/* Main Video Area */}
			<div className="relative flex flex-1 overflow-hidden">
				{/* Remote Video */}
				<div className="relative flex-1">
					{call.videoStatus === "requesting" && (
						<div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-950 to-black">
							<div className="text-center">
								<div className="mb-8 flex justify-center">
									<div className="relative">
										<div className="bg-warning/20 size-28 animate-pulse rounded-full shadow-[0_0_60px_rgba(245,158,11,0.3)]" />
										<div className="absolute inset-0 flex items-center justify-center">
											<Zap className="text-warning size-14 animate-pulse" />
										</div>
									</div>
								</div>
								<p className="text-2xl font-semibold text-white">Requesting video...</p>
								<p className="text-muted-foreground mt-2 text-sm font-medium">
									Waiting for {caller.name || caller.number} to accept
								</p>
							</div>
						</div>
					)}

					{call.videoStatus === "ringing" && (
						<div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-950 to-black">
							<div className="text-center">
								<div className="mb-8 flex justify-center">
									<div className="relative">
										<div className="bg-primary/20 size-28 animate-ping rounded-full shadow-[0_0_60px_rgba(59,130,246,0.3)]" />
										<div className="absolute inset-0 flex items-center justify-center">
											<Video className="text-primary size-14" />
										</div>
									</div>
								</div>
								<p className="text-2xl font-semibold text-white">Connecting video...</p>
								<p className="text-muted-foreground mt-2 text-sm font-medium">
									{caller.name || caller.number}
								</p>
							</div>
						</div>
					)}

					{call.videoStatus === "connected" && (
						<div className="relative h-full w-full bg-black p-4">
							{viewMode === "gallery" ? (
								/* Gallery View - 10 Participants Grid */
								<div className="grid h-full w-full auto-rows-fr grid-cols-4 gap-3">
									{/* You (current user) */}
									<div className="group relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-zinc-900 to-black shadow-lg transition-all hover:border-[#0070F3]/50">
										<div className="flex h-full items-center justify-center">
											<Avatar className="size-16">
												<AvatarFallback className="bg-[#0070F3] text-xl font-semibold text-white">
													You
												</AvatarFallback>
											</Avatar>
										</div>
										<div className="border-foreground/10 bg-background/80 absolute inset-x-2 bottom-2 rounded-md border px-2 py-1 backdrop-blur-md">
											<div className="flex items-center justify-between">
												<span className="truncate text-xs font-medium text-white">You</span>
												{call.isMuted && <MicOff className="text-destructive size-3" />}
											</div>
										</div>
										{call.isScreenSharing && (
											<div className="absolute top-2 left-2 rounded-md bg-emerald-600 px-1.5 py-0.5">
												<Monitor className="size-3 text-white" />
											</div>
										)}
									</div>

									{/* All Participants */}
									{call.participants.map((participant) => (
										<div
											className={cn(
												"group relative overflow-hidden rounded-lg border bg-gradient-to-br from-zinc-900 to-black shadow-lg transition-all hover:border-[#0070F3]/50",
												participant.isSpeaking
													? "border-[#0070F3] ring-2 ring-[#0070F3]/30"
													: "border-white/10"
											)}
											key={participant.id}
										>
											{participant.isVideoEnabled ? (
												<div className="flex h-full items-center justify-center">
													<Avatar className="size-16">
														<AvatarFallback className="bg-foreground text-muted-foreground text-lg font-medium">
															{participant.name
																.split(" ")
																.map((n) => n[0])
																.join("")
																.toUpperCase()}
														</AvatarFallback>
													</Avatar>
												</div>
											) : (
												<div className="flex h-full flex-col items-center justify-center gap-2">
													<Avatar className="size-16">
														<AvatarFallback className="bg-foreground text-muted-foreground text-lg font-medium">
															{participant.name
																.split(" ")
																.map((n) => n[0])
																.join("")
																.toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<VideoOff className="text-muted-foreground size-4" />
												</div>
											)}
											<div className="border-foreground/10 bg-background/80 absolute inset-x-2 bottom-2 rounded-md border px-2 py-1 backdrop-blur-md">
												<div className="flex items-center justify-between">
													<span className="truncate text-xs font-medium text-white">
														{participant.name}
													</span>
													{participant.isMuted && <MicOff className="text-destructive size-3" />}
												</div>
											</div>
											{participant.isScreenSharing && (
												<div className="absolute top-2 left-2 rounded-md bg-emerald-600 px-1.5 py-0.5">
													<Monitor className="size-3 text-white" />
												</div>
											)}
										</div>
									))}
								</div>
							) : (
								/* Speaker View - Focus on Main Speaker */
								<div className="flex h-full w-full items-center justify-center">
									<div className="relative h-full w-full max-w-5xl">
										<div className="flex h-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-950/20 via-black to-black">
											<Avatar className="size-40 shadow-[0_8px_30px_rgb(0,0,0,0.3)] ring-1 ring-white/10">
												<AvatarFallback className="bg-foreground text-muted-foreground text-6xl">
													{caller.name
														?.split(" ")
														.map((n) => n[0])
														.join("")
														.toUpperCase() || "?"}
												</AvatarFallback>
											</Avatar>
										</div>
									</div>
								</div>
							)}

							{/* Global Reactions Overlay */}
							{call.reactions.length > 0 && (
								<div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center">
									<div className="flex gap-3">
										{call.reactions.map((reaction) => (
											<div
												className="fade-in zoom-in-50 slide-in-from-bottom-4 animate-in duration-300"
												key={reaction.id}
											>
												<div className="bg-card/10 rounded-full border border-white/20 p-3 text-white shadow-lg backdrop-blur-md">
													{getReactionIcon(reaction.type)}
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Side Panels - Vercel style */}
				{(showParticipants || showChat) && (
					<div className="bg-foreground w-80 border-l border-white/10">
						{showParticipants && (
							<div className="flex h-full flex-col p-6">
								<div className="mb-6 flex items-center justify-between">
									<h3 className="text-sm font-semibold text-white">
										Participants ({call.participants.length + 1})
									</h3>
									<button
										className="hover:bg-foreground rounded-md p-1 transition-colors"
										onClick={() => setShowParticipants(false)}
										type="button"
									>
										<X className="text-muted-foreground size-4" />
									</button>
								</div>
								<div className="flex-1 space-y-2 overflow-y-auto">
									{/* You (current user) */}
									<div className="border-foreground/10 bg-background/60 hover:bg-background/70 flex items-center gap-3 rounded-md border p-3 transition-colors">
										<Avatar className="size-8 bg-[#0070F3] ring-1 ring-white/10">
											<AvatarFallback className="bg-[#0070F3] text-xs font-semibold text-white">
												You
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<p className="text-sm font-medium text-white">You</p>
											<div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
												{call.isMuted && <MicOff className="text-destructive size-3" />}
												{!call.isLocalVideoEnabled && <VideoOff className="size-3" />}
												<span>Host</span>
											</div>
										</div>
									</div>

									{/* All Participants */}
									{call.participants.map((participant) => (
										<div
											className="border-foreground/10 bg-background/60 hover:bg-background/70 flex items-center gap-3 rounded-md border p-3 transition-colors"
											key={participant.id}
										>
											<Avatar className="size-8 ring-1 ring-white/10">
												<AvatarFallback className="bg-foreground text-muted-foreground text-xs">
													{participant.name
														.split(" ")
														.map((n) => n[0])
														.join("")
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<p className="text-sm font-medium text-white">{participant.name}</p>
												<div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
													{participant.isMuted && <MicOff className="text-destructive size-3" />}
													{!participant.isVideoEnabled && <VideoOff className="size-3" />}
													{participant.isSpeaking && (
														<Volume2 className="size-3 text-emerald-400" />
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
						{showChat && (
							<div className="flex h-full flex-col p-6">
								<div className="mb-6 flex items-center justify-between">
									<h3 className="text-sm font-semibold text-white">
										Chat ({call.chatMessages.length})
									</h3>
									<button
										className="hover:bg-foreground rounded-md p-1 transition-colors"
										onClick={() => setShowChat(false)}
										type="button"
									>
										<X className="text-muted-foreground size-4" />
									</button>
								</div>

								{/* Messages */}
								<div className="mb-4 flex-1 space-y-3 overflow-y-auto">
									{call.chatMessages.length === 0 ? (
										<div className="flex h-full items-center justify-center">
											<p className="text-muted-foreground text-sm font-medium">No messages yet</p>
										</div>
									) : (
										call.chatMessages.map((msg) => (
											<div
												className={cn(
													"flex flex-col gap-1",
													msg.sender === "me" ? "items-end" : "items-start"
												)}
												key={msg.id}
											>
												<div
													className={cn(
														"max-w-[80%] rounded-lg px-3 py-2",
														msg.sender === "me"
															? "bg-[#0070F3] text-white"
															: "bg-foreground text-muted-foreground border border-white/10"
													)}
												>
													<p className="text-sm">{msg.message}</p>
												</div>
												<span className="text-muted-foreground font-mono text-[10px]">
													{new Date(msg.timestamp).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</span>
											</div>
										))
									)}
								</div>

								{/* Input */}
								<div className="flex gap-2">
									<input
										className="placeholder:text-muted-foreground flex-1 rounded-md border border-white/10 bg-black px-3 py-2 text-sm font-medium text-white focus:border-white/20 focus:outline-none"
										onChange={(e) => setChatInput(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												handleSendMessage();
											}
										}}
										placeholder="Type a message..."
										type="text"
										value={chatInput}
									/>
									<button
										className="flex size-10 items-center justify-center rounded-md border border-white/10 bg-[#0070F3] transition-all hover:bg-[#0060d3] disabled:opacity-50"
										disabled={!chatInput.trim()}
										onClick={handleSendMessage}
										type="button"
									>
										<Send className="size-4 text-white" />
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Enhanced Control Bar - Vercel-inspired */}
			<div className="border-t border-white/10 bg-black px-6 py-5 shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
				<div className="flex items-center justify-between">
					{/* Left Controls */}
					<div className="flex items-center gap-1.5">
						<button
							className={cn(
								"group flex size-12 items-center justify-center rounded-full border transition-all",
								call.isMuted
									? "border-destructive/50 bg-destructive hover:bg-destructive shadow-sm"
									: "bg-foreground hover:bg-foreground border-white/10"
							)}
							onClick={toggleMute}
							title="Mute/Unmute (Alt+A)"
							type="button"
						>
							{call.isMuted ? (
								<MicOff className="size-5 text-white" />
							) : (
								<Mic className="size-5 text-white" />
							)}
						</button>
						<ChevronUp className="text-muted-foreground size-3.5" />

						<button
							className={cn(
								"group flex size-12 items-center justify-center rounded-full border transition-all",
								call.isLocalVideoEnabled
									? "bg-foreground hover:bg-foreground border-white/10"
									: "border-destructive/50 bg-destructive hover:bg-destructive shadow-sm"
							)}
							onClick={onToggleLocalVideo}
							title="Start/Stop Video (Alt+V)"
							type="button"
						>
							{call.isLocalVideoEnabled ? (
								<Video className="size-5 text-white" />
							) : (
								<VideoOff className="size-5 text-white" />
							)}
						</button>
						<ChevronUp className="text-muted-foreground size-3.5" />
					</div>

					{/* Center Controls */}
					<div className="flex items-center gap-2">
						{/* Screen Share */}
						<button
							className={cn(
								"flex size-12 items-center justify-center rounded-full border transition-all",
								call.isScreenSharing
									? "border-emerald-600/50 bg-emerald-600 shadow-sm hover:bg-emerald-700"
									: "bg-foreground hover:bg-foreground border-white/10"
							)}
							onClick={toggleScreenShare}
							title="Screen Share (Ctrl+Shift+S)"
							type="button"
						>
							{call.isScreenSharing ? (
								<MonitorOff className="size-5 text-white" />
							) : (
								<Monitor className="size-5 text-white" />
							)}
						</button>

						{/* Recording */}
						<button
							className={cn(
								"flex size-12 items-center justify-center rounded-full border transition-all",
								call.isRecording
									? "border-destructive/50 bg-destructive hover:bg-destructive shadow-sm"
									: "bg-foreground hover:bg-foreground border-white/10"
							)}
							onClick={toggleRecording}
							title={call.isRecording ? "Stop Recording" : "Start Recording"}
							type="button"
						>
							<Circle
								className={cn(
									"size-5",
									call.isRecording ? "animate-pulse fill-current text-white" : "text-white"
								)}
							/>
						</button>

						{/* Chat */}
						<button
							className={cn(
								"relative flex size-12 items-center justify-center rounded-full border transition-all",
								showChat
									? "bg-foreground border-white/20"
									: "bg-foreground hover:bg-foreground border-white/10"
							)}
							onClick={() => setShowChat(!showChat)}
							title="Chat"
							type="button"
						>
							<MessageSquare className="size-5 text-white" />
							{call.chatMessages.length > 0 && (
								<div className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full border border-black bg-[#0070F3] text-[10px] font-bold text-white">
									{call.chatMessages.length}
								</div>
							)}
						</button>

						{/* Reactions */}
						<div className="relative">
							<button
								className={cn(
									"flex size-12 items-center justify-center rounded-full border transition-all",
									showReactions
										? "bg-foreground border-white/20"
										: "bg-foreground hover:bg-foreground border-white/10"
								)}
								onClick={() => setShowReactions(!showReactions)}
								title="Reactions"
								type="button"
							>
								<Smile className="size-5 text-white" />
							</button>

							{/* Reactions Menu */}
							{showReactions && (
								<div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg border border-white/10 bg-black p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
									<div className="flex gap-1">
										<button
											className="hover:bg-foreground rounded-md p-2 transition-colors"
											onClick={() => {
												addReaction("thumbs-up");
												setShowReactions(false);
											}}
											type="button"
										>
											<ThumbsUp className="size-6 text-white" />
										</button>
										<button
											className="hover:bg-foreground rounded-md p-2 transition-colors"
											onClick={() => {
												addReaction("heart");
												setShowReactions(false);
											}}
											type="button"
										>
											<Heart className="text-destructive size-6 fill-current" />
										</button>
										<button
											className="hover:bg-foreground rounded-md p-2 transition-colors"
											onClick={() => {
												addReaction("tada");
												setShowReactions(false);
											}}
											type="button"
										>
											<PartyPopper className="size-6 text-white" />
										</button>
										<button
											className="hover:bg-foreground rounded-md p-2 transition-colors"
											onClick={() => {
												addReaction("clap");
												setShowReactions(false);
											}}
											type="button"
										>
											<Sparkles className="text-warning size-6" />
										</button>
									</div>
								</div>
							)}
						</div>

						<button
							className={cn(
								"flex size-12 items-center justify-center rounded-full border transition-all",
								showParticipants
									? "bg-foreground border-white/20"
									: "bg-foreground hover:bg-foreground border-white/10"
							)}
							onClick={() => setShowParticipants(!showParticipants)}
							title="Participants"
							type="button"
						>
							<Users className="size-5 text-white" />
						</button>

						<button
							className="bg-foreground hover:bg-foreground flex size-12 items-center justify-center rounded-full border border-white/10 transition-all"
							title="More Options"
							type="button"
						>
							<MoreVertical className="size-5 text-white" />
						</button>
					</div>

					{/* Right Controls */}
					<div className="flex items-center gap-2">
						<button
							className="bg-foreground hover:bg-foreground rounded-md border border-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all"
							onClick={onEndVideo}
							type="button"
						>
							End Video
						</button>
						<button
							className="border-destructive/50 bg-destructive hover:bg-destructive rounded-md border px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-[0_8px_30px_rgba(239,68,68,0.3)]"
							onClick={onEndCall}
							title="Leave Call"
							type="button"
						>
							End Call
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
