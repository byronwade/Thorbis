/**
 * Voicemail Player Component
 *
 * Audio player for voicemail messages with:
 * - Play/pause controls
 * - Visual waveform display
 * - Playback speed control
 * - Progress scrubbing
 * - Download option
 * - Transcription display
 * - Mark as read/unread
 */

"use client";

import {
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Mail,
  MailOpen,
  MoreVertical,
  Pause,
  Play,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Voicemail type
type Voicemail = {
  id: string;
  from: string;
  fromNumber: string;
  to: string;
  toNumber: string;
  timestamp: string;
  duration: number; // seconds
  audioUrl: string;
  transcription?: string;
  transcriptionConfidence?: number;
  isRead: boolean;
  fileSize?: number;
};

interface VoicemailPlayerProps {
  voicemail: Voicemail;
  onMarkRead?: (id: string, isRead: boolean) => void;
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
}

export function VoicemailPlayer({
  voicemail,
  onMarkRead,
  onDelete,
  onDownload,
}: VoicemailPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showTranscription, setShowTranscription] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio(voicemail.audioUrl);

    const audio = audioRef.current;

    // Update current time as audio plays
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    // Handle playback end
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [voicemail.audioUrl]);

  // Update playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Toggle play/pause
  const togglePlayback = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);

      // Mark as read when played
      if (!voicemail.isRead && onMarkRead) {
        onMarkRead(voicemail.id, true);
      }
    }
  };

  // Seek to position
  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!(audioRef.current && progressRef.current)) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * voicemail.duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Calculate progress percentage
  const progress = (currentTime / voicemail.duration) * 100;

  return (
    <Card className={cn(!voicemail.isRead && "border-l-4 border-l-primary")}>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="font-medium">{voicemail.from}</div>
                {!voicemail.isRead && <Badge variant="default">New</Badge>}
                {voicemail.transcription && (
                  <Badge className="gap-1" variant="secondary">
                    <FileText className="size-3" />
                    Transcribed
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span>{voicemail.fromNumber}</span>
                <span>•</span>
                <span>{formatTimestamp(voicemail.timestamp)}</span>
                <span>•</span>
                <span>{formatDuration(voicemail.duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Mark Read/Unread */}
              <Button
                onClick={() => onMarkRead?.(voicemail.id, !voicemail.isRead)}
                size="icon"
                variant="ghost"
              >
                {voicemail.isRead ? (
                  <Mail className="size-4" />
                ) : (
                  <MailOpen className="size-4" />
                )}
              </Button>

              {/* More Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onDownload?.(voicemail.id)}>
                    <Download className="mr-2 size-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete?.(voicemail.id)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <Button
              className="size-10 shrink-0"
              onClick={togglePlayback}
              size="icon"
              variant="outline"
            >
              {isPlaying ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
            </Button>

            {/* Progress Bar & Time */}
            <div className="flex-1 space-y-2">
              {/* Progress Bar with Waveform */}
              <div
                className="relative h-12 cursor-pointer overflow-hidden rounded-md bg-muted"
                onClick={handleSeek}
                ref={progressRef}
              >
                {/* Simplified Waveform Visualization */}
                <div className="absolute inset-0 flex items-center justify-around px-1">
                  {Array.from({ length: 50 }).map((_, i) => {
                    const height = Math.random() * 80 + 20; // Random heights for demo
                    const isPast = (i / 50) * 100 < progress;
                    return (
                      <div
                        className={cn(
                          "w-0.5 rounded-full transition-colors",
                          isPast ? "bg-primary" : "bg-muted-foreground/30"
                        )}
                        key={i}
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>

                {/* Progress Overlay */}
                <div
                  className="absolute inset-y-0 left-0 bg-primary/10"
                  style={{ width: `${progress}%` }}
                />

                {/* Playhead */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-primary"
                  style={{ left: `${progress}%` }}
                />
              </div>

              {/* Time Display */}
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(voicemail.duration)}</span>
              </div>
            </div>

            {/* Playback Speed */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="shrink-0" size="sm" variant="outline">
                  {playbackSpeed}x
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
                  <DropdownMenuItem
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                  >
                    {speed}x {speed === 1.0 && "(Normal)"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Transcription */}
          {voicemail.transcription && (
            <div className="space-y-2">
              <Button
                className="w-full justify-between"
                onClick={() => setShowTranscription(!showTranscription)}
                size="sm"
                variant="ghost"
              >
                <span className="flex items-center gap-2">
                  <FileText className="size-4" />
                  Transcription
                  {voicemail.transcriptionConfidence && (
                    <Badge className="text-xs" variant="secondary">
                      {Math.round(voicemail.transcriptionConfidence * 100)}%
                      confidence
                    </Badge>
                  )}
                </span>
                {showTranscription ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </Button>

              {showTranscription && (
                <div className="rounded-lg bg-muted p-4 text-sm">
                  <p>{voicemail.transcription}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper functions

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
