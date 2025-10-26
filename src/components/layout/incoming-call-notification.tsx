"use client";

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit2,
  FileText,
  Headphones,
  HelpCircle,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  Pause,
  Phone,
  PhoneForwarded,
  PhoneOff,
  Play,
  Save,
  Send,
  Shield,
  Square,
  SquareStack,
  Tag,
  User,
  Users,
  Video,
  VideoOff,
  Voicemail,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { VideoConferenceView } from "./video-conference";

type CallDisposition =
  | "resolved"
  | "escalated"
  | "callback"
  | "voicemail"
  | "no_answer"
  | "";

type CallerAIData = {
  isKnownCustomer: boolean;
  isSpam: boolean;
  spamConfidence: number; // 0-100
  recognitionSource: "crm" | "ai" | "community" | "manual" | "unknown";
  trustScore: number; // 0-100
  callHistory: Array<{ date: string; duration: string; outcome: string }>;
  similarCallers: number;
  riskLevel: "low" | "medium" | "high";
  aiNotes: string[];
};

type CustomerData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  accountStatus: string;
  lastContact: string;
  totalCalls: number;
  openTickets: number;
  priority: "low" | "medium" | "high";
  tags: string[];
  recentIssues: Array<{ id: string; text: string }>;
  aiData: CallerAIData;
};

// AI Constants
const AI_SPAM_THRESHOLD = 75;
const AI_MAX_SCORE = 100;
const AI_LOW_SPAM_SCORE = 15;
const AI_HIGH_TRUST_SCORE = 95;
const AI_LOW_TRUST_SCORE = 20;
const AI_MEDIUM_TRUST_SCORE = 60;
const AI_SPAM_SIMILAR_CALLERS = 47;
const AI_TRUST_HIGH_THRESHOLD = 80;
const AI_TRUST_MEDIUM_THRESHOLD = 50;
const AI_MAX_CALL_HISTORY_DISPLAY = 3;

// Helper function to get priority color class
const getPriorityColorClass = (priority: "low" | "medium" | "high"): string => {
  if (priority === "high") return "bg-red-600 text-white";
  if (priority === "medium") return "bg-amber-600 text-white";
  return "bg-green-600 text-white";
};

// Helper function to get priority text color class
const getPriorityTextColorClass = (
  priority: "low" | "medium" | "high"
): string => {
  if (priority === "high") return "text-red-400";
  if (priority === "medium") return "text-amber-400";
  return "text-green-400";
};

// Helper function to get trust score color class
const getTrustScoreColorClass = (score: number): string => {
  if (score >= AI_TRUST_HIGH_THRESHOLD) return "bg-green-500";
  if (score >= AI_TRUST_MEDIUM_THRESHOLD) return "bg-amber-500";
  return "bg-red-500";
};

// Helper function to get risk level color class
const getRiskLevelColorClass = (
  riskLevel: "low" | "medium" | "high"
): string => {
  if (riskLevel === "high") return "bg-red-900 text-red-400";
  if (riskLevel === "medium") return "bg-amber-900 text-amber-400";
  return "bg-green-900 text-green-400";
};

// Helper function to get AI note indicator color
const getAINoteDotColor = (aiData: CallerAIData): string => {
  if (aiData.isSpam) return "bg-red-500";
  if (aiData.isKnownCustomer) return "bg-green-500";
  return "bg-amber-500";
};

// Helper function to get video button class
const getVideoButtonClass = (
  videoStatus: "off" | "requesting" | "ringing" | "connected" | "declined"
): string => {
  if (videoStatus === "connected") {
    return "bg-blue-600 hover:bg-blue-700";
  }
  if (videoStatus === "requesting" || videoStatus === "ringing") {
    return "animate-pulse bg-amber-600 hover:bg-amber-700";
  }
  return "bg-zinc-900 hover:bg-zinc-800";
};

// Mock customer data with AI analysis
const getCustomerData = (
  callerName?: string,
  callerNumber?: string
): CustomerData => {
  // Simulate AI caller recognition
  const isKnown = Boolean(callerName && callerName !== "Unknown Caller");
  const randomSpamScore = Math.random() * AI_MAX_SCORE;
  const isSpam = randomSpamScore > AI_SPAM_THRESHOLD;

  // Calculate trust score
  let trustScore = AI_MEDIUM_TRUST_SCORE;
  if (isKnown) {
    trustScore = AI_HIGH_TRUST_SCORE;
  } else if (isSpam) {
    trustScore = AI_LOW_TRUST_SCORE;
  }

  // Calculate risk level
  let riskLevel: "low" | "medium" | "high" = "medium";
  if (isSpam) {
    riskLevel = "high";
  } else if (isKnown) {
    riskLevel = "low";
  }

  // Get AI notes based on caller type
  let aiNotes: string[] = [];
  if (isSpam) {
    aiNotes = [
      "Multiple reports from other users",
      "Suspicious calling pattern detected",
      "Number flagged by community",
    ];
  } else if (isKnown) {
    aiNotes = [
      "Verified customer since 2023",
      "Consistent positive interactions",
      "High engagement score",
    ];
  } else {
    aiNotes = [
      "First-time caller",
      "No prior history",
      "Standard verification recommended",
    ];
  }

  return {
    name: callerName || "Unknown Customer",
    email: "customer@example.com",
    phone: callerNumber || "Unknown",
    company: "Acme Corporation",
    accountStatus: "Active",
    lastContact: "2 days ago",
    totalCalls: 12,
    openTickets: 2,
    priority: "medium",
    tags: ["VIP", "Enterprise"],
    recentIssues: [
      { id: "1", text: "Billing inquiry - Resolved" },
      { id: "2", text: "Product question - Pending" },
      { id: "3", text: "Account access - Resolved" },
    ],
    aiData: {
      isKnownCustomer: isKnown,
      isSpam,
      spamConfidence: isSpam ? randomSpamScore : AI_LOW_SPAM_SCORE,
      recognitionSource: isKnown ? "crm" : "ai",
      trustScore,
      callHistory: [
        { date: "2024-01-15", duration: "12:34", outcome: "Resolved" },
        { date: "2024-01-10", duration: "8:22", outcome: "Escalated" },
        { date: "2023-12-28", duration: "5:11", outcome: "Resolved" },
      ],
      similarCallers: isSpam ? AI_SPAM_SIMILAR_CALLERS : 0,
      riskLevel,
      aiNotes,
    },
  };
};

// Quick action handlers
const createQuickAction = (label: string, handler: () => void) => ({
  id: label.toLowerCase().replace(" ", "-"),
  label,
  action: handler,
});

// Call scripts for CSRs
const callScripts = [
  {
    id: "greeting",
    label: "Greeting",
    text: "Thank you for calling. How may I assist you today?",
  },
  {
    id: "verification",
    label: "Verification",
    text: "For security purposes, can you verify your account email?",
  },
  {
    id: "hold",
    label: "Hold Message",
    text: "Thank you for holding. I appreciate your patience.",
  },
  {
    id: "closing",
    label: "Closing",
    text: "Is there anything else I can help you with today?",
  },
];

// Incoming Call View Component
function IncomingCallView({
  caller,
  customerData,
  onAnswer,
  onDecline,
  onVoicemail,
}: {
  caller: { name?: string; number: string; avatar?: string };
  customerData: CustomerData;
  onAnswer: () => void;
  onDecline: () => void;
  onVoicemail: () => void;
}) {
  const { aiData } = customerData;

  return (
    <div className="fade-in slide-in-from-bottom-2 fixed right-6 bottom-6 z-50 w-96 animate-in duration-300">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* AI Status Banner */}
        {aiData.isSpam && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-800 bg-red-950/50 p-3">
            <AlertTriangle className="size-4 shrink-0 text-red-400" />
            <div className="flex-1">
              <p className="font-semibold text-red-400 text-xs">
                Potential Spam Detected
              </p>
              <p className="text-[11px] text-red-500">
                {Math.round(aiData.spamConfidence)}% confidence •{" "}
                {aiData.similarCallers} similar reports
              </p>
            </div>
          </div>
        )}

        {aiData.isKnownCustomer && !aiData.isSpam && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-800 bg-green-950/50 p-3">
            <CheckCircle2 className="size-4 shrink-0 text-green-400" />
            <div className="flex-1">
              <p className="font-semibold text-green-400 text-xs">
                Verified Customer
              </p>
              <p className="text-[11px] text-green-500">
                Trust score: {aiData.trustScore}% •{" "}
                {aiData.recognitionSource.toUpperCase()}
              </p>
            </div>
          </div>
        )}

        {!(aiData.isKnownCustomer || aiData.isSpam) && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-800 bg-amber-950/50 p-3">
            <HelpCircle className="size-4 shrink-0 text-amber-400" />
            <div className="flex-1">
              <p className="font-semibold text-amber-400 text-xs">
                Unknown Caller
              </p>
              <p className="text-[11px] text-amber-500">
                First-time caller • Verification recommended
              </p>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center gap-4">
          <Avatar className="size-16 ring-2 ring-zinc-800">
            <AvatarImage src={caller.avatar} />
            <AvatarFallback className="bg-zinc-900 text-lg text-zinc-400">
              {caller.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <p className="truncate font-semibold text-base text-white">
                {caller.name || "Unknown Caller"}
              </p>
              {aiData.isKnownCustomer && (
                <Shield className="size-3.5 text-green-400" />
              )}
            </div>
            <p className="truncate text-sm text-zinc-500">{caller.number}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="size-2 animate-pulse rounded-full bg-green-500" />
              <p className="text-xs text-zinc-600">Incoming call...</p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center gap-2">
            {customerData.tags.map((tag) => (
              <span
                className="rounded-full bg-blue-600 px-2 py-0.5 font-medium text-[10px] text-white"
                key={tag}
              >
                {tag}
              </span>
            ))}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-medium text-[10px]",
                getPriorityColorClass(customerData.priority)
              )}
            >
              {customerData.priority.toUpperCase()}
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-zinc-400">
              <Building2 className="size-3.5" />
              <span>{customerData.company}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Clock className="size-3.5" />
              <span>Last contact: {customerData.lastContact}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <FileText className="size-3.5" />
              <span>{customerData.openTickets} open tickets</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            className="flex h-12 flex-col items-center justify-center gap-1 rounded-xl bg-red-600 font-medium text-white transition-colors hover:bg-red-700"
            onClick={onDecline}
            type="button"
          >
            <PhoneOff className="size-4" />
            <span className="text-[11px]">Decline</span>
          </button>
          <button
            className="flex h-12 flex-col items-center justify-center gap-1 rounded-xl bg-blue-600 font-medium text-white transition-colors hover:bg-blue-700"
            onClick={onVoicemail}
            type="button"
          >
            <Voicemail className="size-4" />
            <span className="text-[11px]">Voicemail</span>
          </button>
          <button
            className="flex h-12 flex-col items-center justify-center gap-1 rounded-xl bg-green-700 font-medium text-white transition-colors hover:bg-green-600"
            onClick={onAnswer}
            type="button"
          >
            <Phone className="size-4" />
            <span className="text-[11px]">Answer</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Minimized Call Widget Component
function MinimizedCallWidget({
  caller,
  callDuration,
  call,
  onMaximize,
  onEndCall,
  toggleMute,
}: {
  caller: { name?: string; number: string; avatar?: string };
  callDuration: string;
  call: {
    isMuted: boolean;
    isOnHold: boolean;
    isRecording: boolean;
  };
  onMaximize: () => void;
  onEndCall: () => void;
  toggleMute: () => void;
}) {
  return (
    <div className="fade-in slide-in-from-bottom-2 fixed right-6 bottom-6 z-50 w-80 animate-in duration-300">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 ring-2 ring-zinc-800">
            <AvatarImage src={caller.avatar} />
            <AvatarFallback className="bg-zinc-900 text-xs text-zinc-400">
              {caller.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="truncate font-medium text-sm text-white">
              {caller.name || "Unknown"}
            </p>
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 animate-pulse rounded-full bg-green-500" />
              <p className="font-mono text-[11px] text-zinc-600">
                {callDuration}
              </p>
              {call.isRecording && (
                <>
                  <span className="text-zinc-700">•</span>
                  <Square className="size-2 fill-red-500 text-red-500" />
                </>
              )}
            </div>
          </div>
          <div className="flex gap-1.5">
            <button
              className={cn(
                "flex size-8 items-center justify-center rounded-lg transition-colors",
                call.isMuted
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-zinc-900 hover:bg-zinc-800"
              )}
              onClick={toggleMute}
              type="button"
            >
              {call.isMuted ? (
                <MicOff className="size-3.5 text-white" />
              ) : (
                <Mic className="size-3.5 text-zinc-400" />
              )}
            </button>
            <button
              className="flex size-8 items-center justify-center rounded-lg bg-zinc-900 transition-colors hover:bg-zinc-800"
              onClick={onMaximize}
              type="button"
            >
              <Maximize2 className="size-3.5 text-zinc-400" />
            </button>
            <button
              className="flex size-8 items-center justify-center rounded-lg bg-red-600 transition-colors hover:bg-red-700"
              onClick={onEndCall}
              type="button"
            >
              <PhoneOff className="size-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Editable Customer Info Section
function EditableCustomerInfo({
  customerData,
  isEditing,
  setIsEditing,
  onSave,
}: {
  customerData: CustomerData;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onSave: (data: Partial<CustomerData>) => void;
}) {
  const [editedData, setEditedData] = useState(customerData);

  const handleSave = () => {
    onSave(editedData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-3 border-zinc-800 border-t px-5 py-4">
      <div className="flex items-center justify-between">
        <span className="font-medium text-[10px] text-zinc-500">
          Customer Details
        </span>
        {isEditing ? (
          <div className="flex gap-1">
            <button
              className="flex items-center gap-1 rounded bg-green-700 px-2 py-1 text-[10px] text-white hover:bg-green-600"
              onClick={handleSave}
              type="button"
            >
              <Check className="size-3" />
              Save
            </button>
            <button
              className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-400 hover:bg-zinc-700"
              onClick={() => {
                setEditedData(customerData);
                setIsEditing(false);
              }}
              type="button"
            >
              <X className="size-3" />
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="flex items-center gap-1 rounded px-2 py-1 text-[10px] text-zinc-500 hover:bg-zinc-900 hover:text-zinc-400"
            onClick={() => setIsEditing(true)}
            type="button"
          >
            <Edit2 className="size-3" />
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[10px] text-zinc-600">Email</span>
          {isEditing ? (
            <Input
              className="mt-1 h-7 border-zinc-800 bg-zinc-900 text-white text-xs"
              onChange={(e) =>
                setEditedData({ ...editedData, email: e.target.value })
              }
              value={editedData.email}
            />
          ) : (
            <p className="text-xs text-zinc-400">{customerData.email}</p>
          )}
        </div>
        <div>
          <span className="text-[10px] text-zinc-600">Company</span>
          {isEditing ? (
            <Input
              className="mt-1 h-7 border-zinc-800 bg-zinc-900 text-white text-xs"
              onChange={(e) =>
                setEditedData({ ...editedData, company: e.target.value })
              }
              value={editedData.company}
            />
          ) : (
            <p className="text-xs text-zinc-400">{customerData.company}</p>
          )}
        </div>
        <div>
          <span className="text-[10px] text-zinc-600">Status</span>
          {isEditing ? (
            <select
              className="mt-1 h-7 w-full rounded border border-zinc-800 bg-zinc-900 px-2 text-white text-xs"
              onChange={(e) =>
                setEditedData({ ...editedData, accountStatus: e.target.value })
              }
              value={editedData.accountStatus}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          ) : (
            <p className="text-green-400 text-xs">
              {customerData.accountStatus}
            </p>
          )}
        </div>
        <div>
          <span className="text-[10px] text-zinc-600">Priority</span>
          {isEditing ? (
            <select
              className="mt-1 h-7 w-full rounded border border-zinc-800 bg-zinc-900 px-2 text-white text-xs"
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  priority: e.target.value as "low" | "medium" | "high",
                })
              }
              value={editedData.priority}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          ) : (
            <p
              className={cn(
                "text-xs",
                getPriorityTextColorClass(customerData.priority)
              )}
            >
              {customerData.priority.charAt(0).toUpperCase() +
                customerData.priority.slice(1)}
            </p>
          )}
        </div>
      </div>

      <div>
        <span className="text-[10px] text-zinc-600">Tags</span>
        <div className="mt-1 flex flex-wrap gap-1">
          {customerData.tags.map((tag) => (
            <span
              className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] text-white"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div>
        <span className="text-[10px] text-zinc-600">Recent Issues</span>
        <div className="mt-1 space-y-1">
          {customerData.recentIssues.map((issue) => (
            <p className="text-xs text-zinc-500" key={issue.id}>
              • {issue.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// Active Call View Component - Enhanced
function ActiveCallView({
  call,
  caller,
  callDuration,
  customerData,
  callNotes,
  setCallNotes,
  transferNumber,
  setTransferNumber,
  disposition,
  setDisposition,
  onEndCall,
  onTransfer,
  onConference,
  onSaveAndEnd,
  onMinimize,
  onRequestVideo,
  onEndVideo,
  onToggleLocalVideo,
  toggleMute,
  toggleHold,
  toggleRecording,
  quickActions,
}: {
  call: {
    isMuted: boolean;
    isOnHold: boolean;
    isRecording: boolean;
    videoStatus: "off" | "requesting" | "ringing" | "connected" | "declined";
    isLocalVideoEnabled: boolean;
    isRemoteVideoEnabled: boolean;
  };
  caller: { name?: string; number: string; avatar?: string };
  callDuration: string;
  customerData: CustomerData;
  callNotes: string;
  setCallNotes: (value: string) => void;
  transferNumber: string;
  setTransferNumber: (value: string) => void;
  disposition: CallDisposition;
  setDisposition: (value: CallDisposition) => void;
  onEndCall: () => void;
  onTransfer: () => void;
  onConference: () => void;
  onSaveAndEnd: () => void;
  onMinimize: () => void;
  onRequestVideo: () => void;
  onEndVideo: () => void;
  onToggleLocalVideo: () => void;
  toggleMute: () => void;
  toggleHold: () => void;
  toggleRecording: () => void;
  quickActions: Array<{ id: string; label: string; action: () => void }>;
}) {
  const [showCustomerInfo, setShowCustomerInfo] = useState(true);
  const [showCallNotes, setShowCallNotes] = useState(true);
  const [showScripts, setShowScripts] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showAIAnalysis, setShowAIAnalysis] = useState(true);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [selectedScript, setSelectedScript] = useState("");

  const handleCustomerSave = (data: Partial<CustomerData>) => {
    // Save to backend
  };

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setSelectedScript(text);
  };

  return (
    <div className="fade-in slide-in-from-bottom-2 fixed top-6 right-6 bottom-6 z-50 w-[420px] animate-in duration-300">
      <div className="flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        {/* Header */}
        <div className="border-zinc-800 border-b p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-12 ring-2 ring-zinc-800">
                <AvatarImage src={caller.avatar} />
                <AvatarFallback className="bg-zinc-900 text-zinc-400">
                  {caller.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-white">
                    {caller.name || "Unknown"}
                  </p>
                  {customerData.priority === "high" && (
                    <AlertCircle className="size-3.5 text-red-400" />
                  )}
                </div>
                <p className="text-xs text-zinc-500">{caller.number}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <div className="size-1.5 animate-pulse rounded-full bg-green-500" />
                  <p className="font-mono text-[11px] text-zinc-600">
                    {callDuration}
                  </p>
                  {call.isRecording && (
                    <>
                      <span className="text-zinc-700">•</span>
                      <Square className="size-2.5 fill-red-500 text-red-500" />
                      <span className="text-[11px] text-red-400">REC</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              className="flex size-8 items-center justify-center rounded-lg bg-zinc-900 transition-colors hover:bg-zinc-800"
              onClick={onMinimize}
              title="Minimize"
              type="button"
            >
              <Minimize2 className="size-4 text-zinc-400" />
            </button>
          </div>

          {/* Call Controls */}
          <div className="mt-4 grid grid-cols-5 gap-2">
            <button
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg p-2 transition-colors",
                call.isMuted
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-zinc-900 hover:bg-zinc-800"
              )}
              onClick={toggleMute}
              type="button"
            >
              {call.isMuted ? (
                <MicOff className="size-4 text-white" />
              ) : (
                <Mic className="size-4 text-zinc-400" />
              )}
              <span className="text-[9px] text-zinc-500">Mute</span>
            </button>

            <button
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg p-2 transition-colors",
                call.isOnHold
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-zinc-900 hover:bg-zinc-800"
              )}
              onClick={toggleHold}
              type="button"
            >
              {call.isOnHold ? (
                <Play className="size-4 text-white" />
              ) : (
                <Pause className="size-4 text-zinc-400" />
              )}
              <span className="text-[9px] text-zinc-500">Hold</span>
            </button>

            <button
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg p-2 transition-colors",
                call.isRecording
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-zinc-900 hover:bg-zinc-800"
              )}
              onClick={toggleRecording}
              type="button"
            >
              <Square className="size-4 text-zinc-400" />
              <span className="text-[9px] text-zinc-500">Record</span>
            </button>

            <button
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg p-2 transition-colors",
                getVideoButtonClass(call.videoStatus)
              )}
              onClick={() => {
                if (call.videoStatus === "off") {
                  onRequestVideo();
                } else if (call.videoStatus === "connected") {
                  onEndVideo();
                }
              }}
              type="button"
            >
              {call.videoStatus === "connected" ? (
                <Video className="size-4 text-white" />
              ) : (
                <VideoOff className="size-4 text-zinc-400" />
              )}
              <span className="text-[9px] text-zinc-500">Video</span>
            </button>

            <button
              className="flex flex-col items-center gap-1 rounded-lg bg-red-600 p-2 transition-colors hover:bg-red-700"
              onClick={onEndCall}
              type="button"
            >
              <PhoneOff className="size-4 text-white" />
              <span className="text-[9px] text-white">End</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {/* Customer Information - Editable */}
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
            <button
              className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-zinc-900"
              onClick={() => setShowCustomerInfo(!showCustomerInfo)}
              type="button"
            >
              <div className="flex items-center gap-2">
                <User className="size-4 text-zinc-500" />
                <span className="font-medium text-sm text-white">
                  Customer Information
                </span>
                {isEditingCustomer && (
                  <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[9px] text-white">
                    EDITING
                  </span>
                )}
              </div>
              {showCustomerInfo ? (
                <ChevronUp className="size-4 text-zinc-500" />
              ) : (
                <ChevronDown className="size-4 text-zinc-500" />
              )}
            </button>

            {showCustomerInfo && (
              <EditableCustomerInfo
                customerData={customerData}
                isEditing={isEditingCustomer}
                onSave={handleCustomerSave}
                setIsEditing={setIsEditingCustomer}
              />
            )}
          </div>

          {/* AI Analysis Section */}
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
            <button
              className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-zinc-900"
              onClick={() => setShowAIAnalysis(!showAIAnalysis)}
              type="button"
            >
              <div className="flex items-center gap-2">
                <Brain className="size-4 text-zinc-500" />
                <span className="font-medium text-sm text-white">
                  AI Analysis
                </span>
                {customerData.aiData.isSpam && (
                  <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] text-white">
                    SPAM
                  </span>
                )}
                {customerData.aiData.isKnownCustomer && (
                  <span className="rounded bg-green-600 px-1.5 py-0.5 text-[9px] text-white">
                    VERIFIED
                  </span>
                )}
              </div>
              {showAIAnalysis ? (
                <ChevronUp className="size-4 text-zinc-500" />
              ) : (
                <ChevronDown className="size-4 text-zinc-500" />
              )}
            </button>

            {showAIAnalysis && (
              <div className="space-y-3 border-zinc-800 border-t px-5 py-4">
                {/* Trust Score */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-600">
                      Trust Score
                    </span>
                    <span className="font-mono font-semibold text-white text-xs">
                      {customerData.aiData.trustScore}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900">
                    <div
                      className={cn(
                        "h-full transition-all",
                        getTrustScoreColorClass(customerData.aiData.trustScore)
                      )}
                      style={{ width: `${customerData.aiData.trustScore}%` }}
                    />
                  </div>
                </div>

                {/* Recognition Source */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-600">Recognition</span>
                  <span className="rounded bg-zinc-900 px-2 py-1 font-mono text-[10px] text-zinc-400">
                    {customerData.aiData.recognitionSource.toUpperCase()}
                  </span>
                </div>

                {/* Risk Level */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-600">Risk Level</span>
                  <span
                    className={cn(
                      "rounded px-2 py-1 font-medium text-[10px]",
                      getRiskLevelColorClass(customerData.aiData.riskLevel)
                    )}
                  >
                    {customerData.aiData.riskLevel.toUpperCase()}
                  </span>
                </div>

                {/* Spam Confidence (if spam detected) */}
                {customerData.aiData.isSpam && (
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-600">
                        Spam Confidence
                      </span>
                      <span className="font-mono font-semibold text-red-400 text-xs">
                        {Math.round(customerData.aiData.spamConfidence)}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900">
                      <div
                        className="h-full bg-red-500 transition-all"
                        style={{
                          width: `${customerData.aiData.spamConfidence}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Similar Callers (if spam) */}
                {customerData.aiData.similarCallers > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-600">
                      Similar Reports
                    </span>
                    <span className="font-mono text-red-400 text-xs">
                      {customerData.aiData.similarCallers} users
                    </span>
                  </div>
                )}

                {/* AI Notes */}
                <div>
                  <span className="mb-2 block text-[10px] text-zinc-600">
                    AI Insights
                  </span>
                  <div className="space-y-1.5">
                    {customerData.aiData.aiNotes.map((note, index) => (
                      <div
                        className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-2"
                        key={index}
                      >
                        <div
                          className={cn(
                            "mt-0.5 size-1.5 shrink-0 rounded-full",
                            getAINoteDotColor(customerData.aiData)
                          )}
                        />
                        <p className="flex-1 text-[11px] text-zinc-400 leading-relaxed">
                          {note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call History (if available) */}
                {customerData.aiData.callHistory.length > 0 && (
                  <div>
                    <span className="mb-2 block text-[10px] text-zinc-600">
                      Recent Call History
                    </span>
                    <div className="space-y-1">
                      {customerData.aiData.callHistory
                        .slice(0, AI_MAX_CALL_HISTORY_DISPLAY)
                        .map((call, index) => (
                          <div
                            className="flex items-center justify-between text-[10px]"
                            key={index}
                          >
                            <span className="text-zinc-500">{call.date}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="font-mono text-zinc-500">
                              {call.duration}
                            </span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-400">
                              {call.outcome}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Call Scripts */}
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
            <button
              className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-zinc-900"
              onClick={() => setShowScripts(!showScripts)}
              type="button"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-zinc-500" />
                <span className="font-medium text-sm text-white">
                  Call Scripts
                </span>
              </div>
              {showScripts ? (
                <ChevronUp className="size-4 text-zinc-500" />
              ) : (
                <ChevronDown className="size-4 text-zinc-500" />
              )}
            </button>

            {showScripts && (
              <div className="space-y-2 border-zinc-800 border-t px-5 py-4">
                {callScripts.map((script) => (
                  <button
                    className="flex w-full items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-left transition-colors hover:bg-zinc-800"
                    key={script.id}
                    onClick={() => handleCopyScript(script.text)}
                    type="button"
                  >
                    <Headphones className="mt-0.5 size-3.5 shrink-0 text-zinc-500" />
                    <div className="flex-1">
                      <p className="font-medium text-white text-xs">
                        {script.label}
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                        {script.text}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
            <button
              className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-zinc-900"
              onClick={() => setShowQuickActions(!showQuickActions)}
              type="button"
            >
              <div className="flex items-center gap-2">
                <SquareStack className="size-4 text-zinc-500" />
                <span className="font-medium text-sm text-white">
                  Quick Actions
                </span>
              </div>
              {showQuickActions ? (
                <ChevronUp className="size-4 text-zinc-500" />
              ) : (
                <ChevronDown className="size-4 text-zinc-500" />
              )}
            </button>

            {showQuickActions && (
              <div className="border-zinc-800 border-t px-5 py-4">
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <button
                      className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400 transition-colors hover:bg-zinc-800"
                      key={action.id}
                      onClick={action.action}
                      type="button"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Transfer & Conference */}
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
            <button
              className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-zinc-900"
              onClick={() => setShowTransfer(!showTransfer)}
              type="button"
            >
              <div className="flex items-center gap-2">
                <PhoneForwarded className="size-4 text-zinc-500" />
                <span className="font-medium text-sm text-white">
                  Transfer & Conference
                </span>
              </div>
              {showTransfer ? (
                <ChevronUp className="size-4 text-zinc-500" />
              ) : (
                <ChevronDown className="size-4 text-zinc-500" />
              )}
            </button>

            {showTransfer && (
              <div className="border-zinc-800 border-t px-5 py-4">
                <div className="flex gap-2">
                  <Input
                    className="h-9 flex-1 border-zinc-800 bg-zinc-900 text-white text-xs placeholder:text-zinc-600"
                    onChange={(e) => setTransferNumber(e.target.value)}
                    placeholder="Extension or name"
                    value={transferNumber}
                  />
                  <Button
                    className="h-9 bg-zinc-800 px-3 hover:bg-zinc-700"
                    onClick={onTransfer}
                    size="sm"
                  >
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
                <button
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400 transition-colors hover:bg-zinc-800"
                  onClick={onConference}
                  type="button"
                >
                  <Users className="size-3.5" />
                  Add to Conference
                </button>
              </div>
            )}
          </div>

          {/* Call Notes */}
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
            <button
              className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-zinc-900"
              onClick={() => setShowCallNotes(!showCallNotes)}
              type="button"
            >
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-zinc-500" />
                <span className="font-medium text-sm text-white">
                  Call Notes
                </span>
              </div>
              {showCallNotes ? (
                <ChevronUp className="size-4 text-zinc-500" />
              ) : (
                <ChevronDown className="size-4 text-zinc-500" />
              )}
            </button>

            {showCallNotes && (
              <div className="border-zinc-800 border-t px-5 py-4">
                <Textarea
                  className="min-h-24 border-zinc-800 bg-zinc-900 text-white text-xs placeholder:text-zinc-600"
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Enter call notes and customer concerns..."
                  value={callNotes}
                />
              </div>
            )}
          </div>

          {/* Call Disposition */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-5 py-4">
            <span className="mb-3 flex items-center gap-2 text-xs text-zinc-500">
              <Tag className="size-3.5" />
              Call Disposition
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "resolved", label: "Resolved", color: "green" },
                { value: "escalated", label: "Escalated", color: "red" },
                { value: "callback", label: "Callback", color: "amber" },
                { value: "voicemail", label: "Voicemail", color: "blue" },
              ].map((disp) => (
                <button
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs transition-colors",
                    disposition === disp.value
                      ? disp.color === "green"
                        ? "border-green-600 bg-green-600 text-white"
                        : disp.color === "red"
                          ? "border-red-600 bg-red-600 text-white"
                          : disp.color === "amber"
                            ? "border-amber-600 bg-amber-600 text-white"
                            : "border-blue-600 bg-blue-600 text-white"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                  )}
                  key={disp.value}
                  onClick={() => setDisposition(disp.value as CallDisposition)}
                  type="button"
                >
                  {disp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        {(callNotes || disposition) && (
          <div className="border-zinc-800 border-t p-4">
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-zinc-800 hover:bg-zinc-700"
                onClick={onSaveAndEnd}
                size="sm"
              >
                <Save className="mr-2 size-4" />
                Save & End
              </Button>
              <Button
                className="flex-1 bg-green-700 hover:bg-green-600"
                onClick={onSaveAndEnd}
                size="sm"
              >
                <Send className="mr-2 size-4" />
                Complete
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function IncomingCallNotification() {
  const {
    call,
    answerCall,
    endCall,
    toggleMute,
    toggleHold,
    toggleRecording,
    requestVideo,
    endVideo,
    toggleLocalVideo,
    toggleScreenShare,
    toggleVirtualBackground,
    addReaction,
    sendChatMessage,
  } = useUIStore();
  const [callDuration, setCallDuration] = useState("00:00");
  const [callNotes, setCallNotes] = useState("");
  const [transferNumber, setTransferNumber] = useState("");
  const [disposition, setDisposition] = useState<CallDisposition>("");
  const [isMinimized, setIsMinimized] = useState(false);

  const customerData = getCustomerData(call.caller?.name, call.caller?.number);

  const quickActions = [
    createQuickAction("Check Balance", () => {
      /* Implement */
    }),
    createQuickAction("Reset Password", () => {
      /* Implement */
    }),
    createQuickAction("Open Ticket", () => {
      /* Implement */
    }),
    createQuickAction("Send Email", () => {
      /* Implement */
    }),
  ];

  useEffect(() => {
    if (call.status === "active" && call.startTime) {
      const UPDATE_INTERVAL = 1000;
      const SECONDS_PER_MINUTE = 60;

      const interval = setInterval(() => {
        const now = Date.now();
        const duration = Math.floor(
          (now - (call.startTime || now)) / UPDATE_INTERVAL
        );
        const minutes = Math.floor(duration / SECONDS_PER_MINUTE);
        const seconds = duration % SECONDS_PER_MINUTE;
        setCallDuration(
          `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        );
      }, UPDATE_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [call.status, call.startTime]);

  if (call.status === "idle" || call.status === "ended" || !call.caller) {
    return null;
  }

  const handleEndCall = () => {
    endCall();
  };

  const handleSaveAndEnd = () => {
    endCall();
  };

  const handleTransfer = () => {
    if (transferNumber.trim()) {
      // Implement transfer
    }
  };

  const handleConference = () => {
    // Implement conference
  };

  const handleVoicemail = () => {
    // Send to voicemail and end call
    setDisposition("voicemail");
    endCall();
  };

  // Show video conference view when video is active
  if (
    call.status === "active" &&
    (call.videoStatus === "requesting" ||
      call.videoStatus === "ringing" ||
      call.videoStatus === "connected")
  ) {
    return (
      <VideoConferenceView
        addReaction={addReaction}
        call={call}
        callDuration={callDuration}
        caller={call.caller}
        onEndCall={handleEndCall}
        onEndVideo={endVideo}
        onToggleLocalVideo={toggleLocalVideo}
        sendChatMessage={sendChatMessage}
        toggleMute={toggleMute}
        toggleRecording={toggleRecording}
        toggleScreenShare={toggleScreenShare}
        toggleVirtualBackground={toggleVirtualBackground}
      />
    );
  }

  if (call.status === "incoming") {
    return (
      <IncomingCallView
        caller={call.caller}
        customerData={customerData}
        onAnswer={answerCall}
        onDecline={endCall}
        onVoicemail={handleVoicemail}
      />
    );
  }

  if (isMinimized) {
    return (
      <MinimizedCallWidget
        call={call}
        callDuration={callDuration}
        caller={call.caller}
        onEndCall={handleEndCall}
        onMaximize={() => setIsMinimized(false)}
        toggleMute={toggleMute}
      />
    );
  }

  return (
    <ActiveCallView
      call={call}
      callDuration={callDuration}
      caller={call.caller}
      callNotes={callNotes}
      customerData={customerData}
      disposition={disposition}
      onConference={handleConference}
      onEndCall={handleEndCall}
      onEndVideo={endVideo}
      onMinimize={() => setIsMinimized(true)}
      onRequestVideo={requestVideo}
      onSaveAndEnd={handleSaveAndEnd}
      onToggleLocalVideo={toggleLocalVideo}
      onTransfer={handleTransfer}
      quickActions={quickActions}
      setCallNotes={setCallNotes}
      setDisposition={setDisposition}
      setTransferNumber={setTransferNumber}
      toggleHold={toggleHold}
      toggleMute={toggleMute}
      toggleRecording={toggleRecording}
      transferNumber={transferNumber}
    />
  );
}
