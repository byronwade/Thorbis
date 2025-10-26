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
  const [showSettings, setShowSettings] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [viewMode, setViewMode] = useState<"speaker" | "gallery">("gallery");
  const [chatInput, setChatInput] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  // Helper functions
  const getConnectionIcon = () => {
    if (call.connectionQuality === "excellent")
      return <SignalHigh className="size-3.5 text-emerald-500" />;
    if (call.connectionQuality === "good")
      return <SignalMedium className="size-3.5 text-amber-500" />;
    return <SignalLow className="size-3.5 text-red-500" />;
  };

  const getReactionIcon = (type: string) => {
    if (type === "thumbs-up") return <ThumbsUp className="size-6" />;
    if (type === "heart") return <Heart className="size-6 fill-current" />;
    if (type === "tada") return <PartyPopper className="size-6" />;
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
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      console.error("Failed to copy link");
    }
  };

  // Minimized floating window - Vercel-inspired
  if (isMinimized) {
    return (
      <div className="fade-in fixed right-6 bottom-6 z-50 h-48 w-80 animate-in cursor-move overflow-hidden rounded-lg border border-zinc-800/50 bg-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] duration-200 hover:shadow-[0_30px_60px_rgb(0,0,0,0.12)]">
        {/* Mini video view */}
        <div className="relative h-full w-full">
          {call.videoStatus === "connected" && call.isRemoteVideoEnabled ? (
            <div className="h-full w-full bg-gradient-to-br from-blue-950/30 via-black to-black">
              <div className="flex h-full items-center justify-center">
                <Avatar className="size-20 ring-1 ring-white/10">
                  <AvatarImage src={caller.avatar} />
                  <AvatarFallback className="bg-zinc-900 text-2xl text-zinc-500">
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
            <div className="flex h-full items-center justify-center bg-zinc-950/50">
              <Video className="size-12 text-zinc-700" />
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
                      ? "border-red-600/50 bg-red-600 hover:bg-red-700"
                      : "border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800"
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
                      ? "border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800"
                      : "border-red-600/50 bg-red-600 hover:bg-red-700"
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
                  className="flex size-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/80 transition-all hover:bg-zinc-800"
                  onClick={() => setIsMinimized(false)}
                  title="Restore"
                  type="button"
                >
                  <Maximize className="size-3.5 text-white" />
                </button>
                <button
                  className="flex size-8 items-center justify-center rounded-full border border-red-600/50 bg-red-600 transition-all hover:bg-red-700"
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
          <div className="absolute top-3 left-3 rounded-md border border-white/10 bg-black/60 px-2.5 py-1 backdrop-blur-md">
            <p className="font-medium text-white text-xs">
              {caller.name || caller.number}
            </p>
          </div>

          {/* Call duration */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/60 px-2.5 py-1 backdrop-blur-md">
            <div className="size-1.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="font-mono text-[11px] text-white tabular-nums">
              {callDuration}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Full video conference view - Vercel-inspired
  return (
    <div className="fade-in fixed inset-0 z-50 flex animate-in flex-col bg-black duration-300">
      {/* Header Bar - Pure black with subtle border */}
      <div className="flex items-center justify-between border-white/10 border-b bg-black px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="size-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="font-mono text-sm text-zinc-400 tabular-nums">
              {callDuration}
            </span>
          </div>

          {/* Recording Indicator */}
          {call.isRecording && (
            <div className="flex items-center gap-1.5 rounded-md border border-red-600/50 bg-red-600/20 px-2.5 py-1">
              <Circle className="size-2 animate-pulse fill-current text-red-500" />
              <span className="font-medium text-[11px] text-red-400">
                Recording
              </span>
            </div>
          )}

          {/* Connection Quality */}
          <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-zinc-900/50 px-2.5 py-1">
            {getConnectionIcon()}
            <span className="font-medium text-[11px] text-zinc-400 capitalize">
              {call.connectionQuality}
            </span>
          </div>

          {call.videoStatus === "connected" && (
            <div className="rounded-md border border-white/10 bg-zinc-900/50 px-2.5 py-1">
              <p className="font-medium text-[11px] text-zinc-400">
                HD Quality
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            className={cn(
              "rounded-md border px-3 py-1.5 font-medium text-xs transition-all",
              viewMode === "speaker"
                ? "border-white/10 bg-white text-black shadow-sm"
                : "border-white/10 bg-black text-zinc-400 hover:bg-zinc-900 hover:text-white"
            )}
            onClick={() => setViewMode("speaker")}
            type="button"
          >
            Speaker
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-medium text-xs transition-all",
              viewMode === "gallery"
                ? "border-white/10 bg-white text-black shadow-sm"
                : "border-white/10 bg-black text-zinc-400 hover:bg-zinc-900 hover:text-white"
            )}
            onClick={() => setViewMode("gallery")}
            type="button"
          >
            <Grid3x3 className="size-3" /> Gallery
          </button>

          {/* Share Link Button */}
          <div className="relative">
            <button
              className="rounded-md border border-white/10 bg-black p-2 transition-all hover:bg-zinc-900"
              onClick={() => setShowShareMenu(!showShareMenu)}
              title="Share meeting link"
              type="button"
            >
              <Share2 className="size-4 text-zinc-400" />
            </button>

            {showShareMenu && (
              <div className="absolute top-full right-0 mt-2 w-72 rounded-lg border border-white/10 bg-black p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-white">
                    Share Link
                  </h3>
                  <button
                    className="rounded-md p-1 transition-colors hover:bg-zinc-900"
                    onClick={() => setShowShareMenu(false)}
                    type="button"
                  >
                    <X className="size-4 text-zinc-500" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-md border border-white/10 bg-zinc-900 px-3 py-2">
                    <p className="truncate font-mono text-xs text-zinc-400">
                      {call.meetingLink}
                    </p>
                  </div>
                  <button
                    className={cn(
                      "flex size-10 items-center justify-center rounded-md border transition-all",
                      linkCopied
                        ? "border-emerald-600/50 bg-emerald-600"
                        : "border-white/10 bg-zinc-900 hover:bg-zinc-800"
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
            className="rounded-md border border-white/10 bg-black p-2 transition-all hover:bg-zinc-900"
            onClick={() => setIsMinimized(true)}
            title="Minimize"
            type="button"
          >
            <Minimize2 className="size-4 text-zinc-400" />
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
                    <div className="size-28 animate-pulse rounded-full bg-amber-500/20 shadow-[0_0_60px_rgba(245,158,11,0.3)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="size-14 animate-pulse text-amber-500" />
                    </div>
                  </div>
                </div>
                <p className="font-semibold text-2xl text-white">
                  Requesting video...
                </p>
                <p className="mt-2 font-medium text-sm text-zinc-500">
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
                    <div className="size-28 animate-ping rounded-full bg-blue-500/20 shadow-[0_0_60px_rgba(59,130,246,0.3)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="size-14 text-blue-500" />
                    </div>
                  </div>
                </div>
                <p className="font-semibold text-2xl text-white">
                  Connecting video...
                </p>
                <p className="mt-2 font-medium text-sm text-zinc-500">
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
                        <AvatarFallback className="bg-[#0070F3] font-semibold text-white text-xl">
                          You
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="absolute inset-x-2 bottom-2 rounded-md border border-white/10 bg-black/60 px-2 py-1 backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <span className="truncate font-medium text-white text-xs">
                          You
                        </span>
                        {call.isMuted && (
                          <MicOff className="size-3 text-red-400" />
                        )}
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
                            <AvatarFallback className="bg-zinc-800 font-medium text-lg text-zinc-400">
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
                            <AvatarFallback className="bg-zinc-800 font-medium text-lg text-zinc-400">
                              {participant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <VideoOff className="size-4 text-zinc-600" />
                        </div>
                      )}
                      <div className="absolute inset-x-2 bottom-2 rounded-md border border-white/10 bg-black/60 px-2 py-1 backdrop-blur-md">
                        <div className="flex items-center justify-between">
                          <span className="truncate font-medium text-white text-xs">
                            {participant.name}
                          </span>
                          {participant.isMuted && (
                            <MicOff className="size-3 text-red-400" />
                          )}
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
                        <AvatarFallback className="bg-zinc-900 text-6xl text-zinc-500">
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
                        <div className="rounded-full border border-white/20 bg-white/10 p-3 text-white shadow-lg backdrop-blur-md">
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
          <div className="w-80 border-white/10 border-l bg-zinc-950">
            {showParticipants && (
              <div className="flex h-full flex-col p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-white">
                    Participants ({call.participants.length + 1})
                  </h3>
                  <button
                    className="rounded-md p-1 transition-colors hover:bg-zinc-900"
                    onClick={() => setShowParticipants(false)}
                    type="button"
                  >
                    <X className="size-4 text-zinc-500" />
                  </button>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {/* You (current user) */}
                  <div className="flex items-center gap-3 rounded-md border border-white/10 bg-black/40 p-3 transition-colors hover:bg-black/60">
                    <Avatar className="size-8 bg-[#0070F3] ring-1 ring-white/10">
                      <AvatarFallback className="bg-[#0070F3] font-semibold text-white text-xs">
                        You
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-white">You</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
                        {call.isMuted && (
                          <MicOff className="size-3 text-red-400" />
                        )}
                        {!call.isLocalVideoEnabled && (
                          <VideoOff className="size-3" />
                        )}
                        <span>Host</span>
                      </div>
                    </div>
                  </div>

                  {/* All Participants */}
                  {call.participants.map((participant) => (
                    <div
                      className="flex items-center gap-3 rounded-md border border-white/10 bg-black/40 p-3 transition-colors hover:bg-black/60"
                      key={participant.id}
                    >
                      <Avatar className="size-8 ring-1 ring-white/10">
                        <AvatarFallback className="bg-zinc-900 text-xs text-zinc-400">
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-white">
                          {participant.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
                          {participant.isMuted && (
                            <MicOff className="size-3 text-red-400" />
                          )}
                          {!participant.isVideoEnabled && (
                            <VideoOff className="size-3" />
                          )}
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
                  <h3 className="font-semibold text-sm text-white">
                    Chat ({call.chatMessages.length})
                  </h3>
                  <button
                    className="rounded-md p-1 transition-colors hover:bg-zinc-900"
                    onClick={() => setShowChat(false)}
                    type="button"
                  >
                    <X className="size-4 text-zinc-500" />
                  </button>
                </div>

                {/* Messages */}
                <div className="mb-4 flex-1 space-y-3 overflow-y-auto">
                  {call.chatMessages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <p className="font-medium text-sm text-zinc-600">
                        No messages yet
                      </p>
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
                              : "border border-white/10 bg-zinc-900 text-zinc-200"
                          )}
                        >
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-600">
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
                    className="flex-1 rounded-md border border-white/10 bg-black px-3 py-2 font-medium text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
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
      <div className="border-white/10 border-t bg-black px-6 py-5 shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-1.5">
            <button
              className={cn(
                "group flex size-12 items-center justify-center rounded-full border transition-all",
                call.isMuted
                  ? "border-red-600/50 bg-red-600 shadow-sm hover:bg-red-700"
                  : "border-white/10 bg-zinc-900 hover:bg-zinc-800"
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
            <ChevronUp className="size-3.5 text-zinc-600" />

            <button
              className={cn(
                "group flex size-12 items-center justify-center rounded-full border transition-all",
                call.isLocalVideoEnabled
                  ? "border-white/10 bg-zinc-900 hover:bg-zinc-800"
                  : "border-red-600/50 bg-red-600 shadow-sm hover:bg-red-700"
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
            <ChevronUp className="size-3.5 text-zinc-600" />
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-2">
            {/* Screen Share */}
            <button
              className={cn(
                "flex size-12 items-center justify-center rounded-full border transition-all",
                call.isScreenSharing
                  ? "border-emerald-600/50 bg-emerald-600 shadow-sm hover:bg-emerald-700"
                  : "border-white/10 bg-zinc-900 hover:bg-zinc-800"
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
                  ? "border-red-600/50 bg-red-600 shadow-sm hover:bg-red-700"
                  : "border-white/10 bg-zinc-900 hover:bg-zinc-800"
              )}
              onClick={toggleRecording}
              title={call.isRecording ? "Stop Recording" : "Start Recording"}
              type="button"
            >
              <Circle
                className={cn(
                  "size-5",
                  call.isRecording
                    ? "animate-pulse fill-current text-white"
                    : "text-white"
                )}
              />
            </button>

            {/* Chat */}
            <button
              className={cn(
                "relative flex size-12 items-center justify-center rounded-full border transition-all",
                showChat
                  ? "border-white/20 bg-zinc-800"
                  : "border-white/10 bg-zinc-900 hover:bg-zinc-800"
              )}
              onClick={() => setShowChat(!showChat)}
              title="Chat"
              type="button"
            >
              <MessageSquare className="size-5 text-white" />
              {call.chatMessages.length > 0 && (
                <div className="-top-1 -right-1 absolute flex size-5 items-center justify-center rounded-full border border-black bg-[#0070F3] font-bold text-[10px] text-white">
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
                    ? "border-white/20 bg-zinc-800"
                    : "border-white/10 bg-zinc-900 hover:bg-zinc-800"
                )}
                onClick={() => setShowReactions(!showReactions)}
                title="Reactions"
                type="button"
              >
                <Smile className="size-5 text-white" />
              </button>

              {/* Reactions Menu */}
              {showReactions && (
                <div className="-translate-x-1/2 absolute bottom-full left-1/2 mb-2 rounded-lg border border-white/10 bg-black p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
                  <div className="flex gap-1">
                    <button
                      className="rounded-md p-2 transition-colors hover:bg-zinc-900"
                      onClick={() => {
                        addReaction("thumbs-up");
                        setShowReactions(false);
                      }}
                      type="button"
                    >
                      <ThumbsUp className="size-6 text-white" />
                    </button>
                    <button
                      className="rounded-md p-2 transition-colors hover:bg-zinc-900"
                      onClick={() => {
                        addReaction("heart");
                        setShowReactions(false);
                      }}
                      type="button"
                    >
                      <Heart className="size-6 fill-current text-red-500" />
                    </button>
                    <button
                      className="rounded-md p-2 transition-colors hover:bg-zinc-900"
                      onClick={() => {
                        addReaction("tada");
                        setShowReactions(false);
                      }}
                      type="button"
                    >
                      <PartyPopper className="size-6 text-white" />
                    </button>
                    <button
                      className="rounded-md p-2 transition-colors hover:bg-zinc-900"
                      onClick={() => {
                        addReaction("clap");
                        setShowReactions(false);
                      }}
                      type="button"
                    >
                      <Sparkles className="size-6 text-amber-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className={cn(
                "flex size-12 items-center justify-center rounded-full border transition-all",
                showParticipants
                  ? "border-white/20 bg-zinc-800"
                  : "border-white/10 bg-zinc-900 hover:bg-zinc-800"
              )}
              onClick={() => setShowParticipants(!showParticipants)}
              title="Participants"
              type="button"
            >
              <Users className="size-5 text-white" />
            </button>

            <button
              className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-zinc-900 transition-all hover:bg-zinc-800"
              title="More Options"
              type="button"
            >
              <MoreVertical className="size-5 text-white" />
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-white/10 bg-zinc-900 px-4 py-2.5 font-medium text-sm text-white transition-all hover:bg-zinc-800"
              onClick={onEndVideo}
              type="button"
            >
              End Video
            </button>
            <button
              className="rounded-md border border-red-600/50 bg-red-600 px-6 py-2.5 font-semibold text-sm text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-[0_8px_30px_rgba(239,68,68,0.3)]"
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
