"use client";

/**
 * PhoneDropdown - Enterprise Phone Dialer
 *
 * Full-featured dialer with:
 * - WebRTC primary mode (browser audio)
 * - Call Control API fallback (opens call window)
 * - Connection status monitoring
 * - Automatic reconnection
 * - Customer search
 *
 * References:
 * - https://developers.telnyx.com/docs/voice/webrtc/js-sdk/quickstart
 * - https://developers.telnyx.com/docs/voice/webrtc/js-sdk/error-handling
 */

import type { Call as TelnyxCall } from "@telnyx/webrtc";
import {
	AlertCircle,
	Check,
	ChevronDown,
	Clock,
	ExternalLink,
	Headphones,
	Loader2,
	MessageSquare,
	Mic,
	MicOff,
	Pause,
	Phone,
	PhoneCall,
	PhoneIncoming,
	PhoneMissed,
	PhoneOff,
	PhoneOutgoing,
	Play,
	RefreshCw,
	Server,
	User,
	Wifi,
	WifiOff,
	X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { makeCall } from "@/actions/telnyx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDialerCustomers } from "@/hooks/use-dialer-customers";
import { useTelnyxWebRTC, type WebRTCCall, type CallState } from "@/hooks/use-telnyx-webrtc";
import { useToast } from "@/hooks/use-toast";
import { useDialerStore } from "@/lib/stores/dialer-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { fetchWebRTCCredentialsOnce, resetWebRTCCredentialsCache } from "@/lib/telnyx/web-credentials-client";
import { cn } from "@/lib/utils";

type Customer = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	display_name: string | null;
	email: string | null;
	phone: string | null;
	secondary_phone?: string | null;
	company_name?: string | null;
};

type CompanyPhone = {
	id: string;
	number: string;
	label?: string;
};

type PhoneDropdownProps = {
	companyId: string;
	companyPhones?: CompanyPhone[];
	incomingCallsCount?: number;
};

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";
type CallMode = "webrtc" | "api";

// Constants
const WEBRTC_CONNECTION_TIMEOUT = 15000; // 15 seconds
const WEBRTC_RETRY_DELAY = 3000; // 3 seconds

// Helper functions
const cleanValue = (v?: string | null) => (v ?? "").trim();

const getCustomerName = (c: Customer) => {
	if (c.display_name?.trim()) return c.display_name.trim();
	const name = [c.first_name, c.last_name].map(cleanValue).filter(Boolean).join(" ");
	return name || c.email?.trim() || "Unknown";
};

const formatPhone = (phone: string) => {
	const d = phone.replace(/\D/g, "");
	if (d.length === 11 && d[0] === "1") {
		return `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
	}
	if (d.length === 10) {
		return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
	}
	return phone;
};

/**
 * Connection Status Badge
 */
function ConnectionStatusBadge({
	status,
	mode,
	onRetry,
	className,
}: {
	status: ConnectionStatus;
	mode: CallMode;
	onRetry?: () => void;
	className?: string;
}) {
	if (mode === "api") {
		return (
			<Badge variant="outline" className={cn("gap-1 text-[10px]", className)}>
				<Server className="h-3 w-3" />
				API Mode
			</Badge>
		);
	}

	const statusConfig: Record<ConnectionStatus, {
		icon: typeof WifiOff;
		label: string;
		variant: "outline" | "destructive";
		className: string;
		animate?: boolean;
	}> = {
		disconnected: {
			icon: WifiOff,
			label: "Disconnected",
			variant: "outline",
			className: "text-muted-foreground",
		},
		connecting: {
			icon: Loader2,
			label: "Connecting...",
			variant: "outline",
			className: "text-warning",
			animate: true,
		},
		connected: {
			icon: Wifi,
			label: "WebRTC Ready",
			variant: "outline",
			className: "text-success border-success/30",
		},
		error: {
			icon: AlertCircle,
			label: "Connection Error",
			variant: "destructive",
			className: "",
		},
	};

	const config = statusConfig[status];
	const Icon = config.icon;

	return (
		<div className={cn("flex items-center gap-1", className)}>
			<Badge variant={config.variant} className={cn("gap-1 text-[10px]", config.className)}>
				<Icon className={cn("h-3 w-3", config.animate === true && "animate-spin")} />
				{config.label}
			</Badge>
			{(status === "error" || status === "disconnected") && onRetry && (
				<Button
					variant="ghost"
					size="icon"
					className="h-5 w-5"
					onClick={onRetry}
				>
					<RefreshCw className="h-3 w-3" />
				</Button>
			)}
		</div>
	);
}

/**
 * Active Call Card - Shows when a call is in progress
 */
function ActiveCallCard({
	call,
	onMute,
	onHold,
	onEnd,
	className,
}: {
	call: WebRTCCall;
	onMute: () => void;
	onHold: () => void;
	onEnd: () => void;
	className?: string;
}) {
	const [duration, setDuration] = useState(0);

	// Update duration timer
	useEffect(() => {
		if (call.state !== "active") {
			setDuration(0);
			return;
		}

		const startTime = call.startTime?.getTime() || Date.now();
		const interval = setInterval(() => {
			setDuration(Math.floor((Date.now() - startTime) / 1000));
		}, 1000);

		return () => clearInterval(interval);
	}, [call.state, call.startTime]);

	const formatDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const stateConfig: Record<CallState, { label: string; color: string; icon: typeof Phone }> = {
		idle: { label: "Idle", color: "text-muted-foreground", icon: Phone },
		connecting: { label: "Connecting...", color: "text-warning", icon: PhoneOutgoing },
		ringing: { label: "Ringing...", color: "text-primary", icon: PhoneOutgoing },
		active: { label: "Active", color: "text-success", icon: PhoneCall },
		held: { label: "On Hold", color: "text-warning", icon: Pause },
		ended: { label: "Call Ended", color: "text-muted-foreground", icon: PhoneOff },
	};

	const config = stateConfig[call.state];
	const StateIcon = config.icon;

	return (
		<div className={cn("rounded-lg border bg-card p-3", className)}>
			{/* Call info header */}
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className={cn("rounded-full bg-primary/10 p-2", config.color)}>
						<StateIcon className="h-4 w-4" />
					</div>
					<div>
						<p className="text-sm font-medium">
							{call.remoteName || formatPhone(call.remoteNumber)}
						</p>
						<p className={cn("text-xs", config.color)}>{config.label}</p>
					</div>
				</div>
				{call.state === "active" && (
					<Badge variant="outline" className="text-xs tabular-nums">
						{formatDuration(duration)}
					</Badge>
				)}
			</div>

			{/* Call controls */}
			{(call.state === "active" || call.state === "held") && (
				<div className="flex items-center justify-center gap-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant={call.isMuted ? "destructive" : "outline"}
								size="icon"
								className="h-9 w-9 rounded-full"
								onClick={onMute}
							>
								{call.isMuted ? (
									<MicOff className="h-4 w-4" />
								) : (
									<Mic className="h-4 w-4" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>{call.isMuted ? "Unmute" : "Mute"}</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant={call.isHeld ? "secondary" : "outline"}
								size="icon"
								className="h-9 w-9 rounded-full"
								onClick={onHold}
							>
								{call.isHeld ? (
									<Play className="h-4 w-4" />
								) : (
									<Pause className="h-4 w-4" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>{call.isHeld ? "Resume" : "Hold"}</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="destructive"
								size="icon"
								className="h-9 w-9 rounded-full"
								onClick={onEnd}
							>
								<PhoneOff className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>End Call</TooltipContent>
					</Tooltip>
				</div>
			)}

			{/* Connecting/Ringing state */}
			{(call.state === "connecting" || call.state === "ringing") && (
				<div className="flex items-center justify-center gap-2">
					<Button
						variant="destructive"
						size="sm"
						className="gap-2"
						onClick={onEnd}
					>
						<PhoneOff className="h-4 w-4" />
						Cancel
					</Button>
				</div>
			)}
		</div>
	);
}

export function PhoneDropdown({
	companyId,
	companyPhones = [],
	incomingCallsCount,
}: PhoneDropdownProps) {
	const { toast } = useToast();
	const [mounted, setMounted] = useState(false);
	const [isPending, startTransition] = useTransition();

	// Dropdown & customer state
	const [open, setOpen] = useState(false);
	const { customers, isLoading: customersLoading } = useDialerCustomers(open);
	const dialerStore = useDialerStore();

	// Form state
	const [toNumber, setToNumber] = useState("");
	const [fromNumber, setFromNumber] = useState(companyPhones[0]?.number || "");
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
	const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
	const [customerSearchQuery, setCustomerSearchQuery] = useState("");

	// WebRTC state
	const [callMode, setCallMode] = useState<CallMode>("webrtc");
	const [webrtcCredentials, setWebrtcCredentials] = useState<{
		username: string;
		password: string;
	} | null>(null);
	const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
	const [connectionError, setConnectionError] = useState<string | null>(null);
	const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const retryCountRef = useRef(0);
	const maxRetries = 3;

	// Audio element for WebRTC
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Call state from UI store
	const callStatus = useUIStore((s) => s.call.status);
	const caller = useUIStore((s) => s.call.caller);
	const hasIncomingCall = callStatus === "incoming";
	const displayCount = incomingCallsCount ?? (hasIncomingCall ? 1 : 0);

	// WebRTC hook
	const webrtc = useTelnyxWebRTC({
		username: webrtcCredentials?.username || "",
		password: webrtcCredentials?.password || "",
		autoConnect: false,
		debug: process.env.NODE_ENV === "development",
		onIncomingCall: (call) => {
			toast.info(`Incoming call from ${call.remoteName || call.remoteNumber}`);
		},
		onCallEnded: () => {
			toast.info("Call ended");
		},
	});

	// Mount
	useEffect(() => {
		setMounted(true);
		// Create audio element for WebRTC
		if (typeof window !== "undefined" && !audioRef.current) {
			const audio = document.createElement("audio");
			audio.id = "telnyx-remote-audio";
			audio.autoplay = true;
			audio.style.display = "none";
			document.body.appendChild(audio);
			audioRef.current = audio;
		}

		return () => {
			if (audioRef.current) {
				audioRef.current.remove();
				audioRef.current = null;
			}
		};
	}, []);

	// Sync from number
	useEffect(() => {
		if (!fromNumber && companyPhones.length > 0) {
			setFromNumber(companyPhones[0].number);
		}
	}, [companyPhones, fromNumber]);

	// Sync dialer store
	useEffect(() => setOpen(dialerStore.isOpen), [dialerStore.isOpen]);
	useEffect(() => setToNumber(dialerStore.phoneNumber), [dialerStore.phoneNumber]);
	useEffect(() => {
		if (dialerStore.customerId && customers.length > 0) {
			const c = customers.find((x) => x.id === dialerStore.customerId);
			if (c && c.id !== selectedCustomer?.id) setSelectedCustomer(c);
		}
	}, [dialerStore.customerId, customers, selectedCustomer?.id]);

	// Fetch WebRTC credentials on mount
	useEffect(() => {
		if (!mounted) return;

		const fetchCredentials = async () => {
			try {
				const result = await fetchWebRTCCredentialsOnce();
				if (result.success && result.credential) {
					setWebrtcCredentials({
						username: result.credential.username,
						password: result.credential.password,
					});
				} else {
					console.warn("Failed to get WebRTC credentials, using API mode");
					setCallMode("api");
				}
			} catch (error) {
				console.error("Failed to fetch WebRTC credentials:", error);
				setCallMode("api");
			}
		};

		fetchCredentials();
	}, [mounted]);

	// Connect WebRTC when credentials are available
	useEffect(() => {
		if (!webrtcCredentials || callMode !== "webrtc") return;

		const connectWebRTC = async () => {
			// Clear any existing timeout
			if (connectionTimeoutRef.current) {
				clearTimeout(connectionTimeoutRef.current);
			}

			setConnectionStatus("connecting");
			setConnectionError(null);

			// Set connection timeout
			connectionTimeoutRef.current = setTimeout(() => {
				if (connectionStatus === "connecting") {
					setConnectionStatus("error");
					setConnectionError("Connection timeout - WebRTC may require Level 2 verification");

					// Auto-fallback to API mode after timeout
					if (retryCountRef.current >= maxRetries) {
						toast.warning("WebRTC unavailable, switching to API mode");
						setCallMode("api");
					}
				}
			}, WEBRTC_CONNECTION_TIMEOUT);

			try {
				await webrtc.connect();
			} catch (error) {
				console.error("WebRTC connection error:", error);
				setConnectionStatus("error");
				setConnectionError(error instanceof Error ? error.message : "Connection failed");
			}
		};

		connectWebRTC();

		return () => {
			if (connectionTimeoutRef.current) {
				clearTimeout(connectionTimeoutRef.current);
			}
		};
	}, [webrtcCredentials, callMode]);

	// Sync WebRTC connection state
	useEffect(() => {
		if (webrtc.isConnected) {
			if (connectionTimeoutRef.current) {
				clearTimeout(connectionTimeoutRef.current);
			}
			setConnectionStatus("connected");
			setConnectionError(null);
			retryCountRef.current = 0;
		} else if (webrtc.connectionError) {
			setConnectionStatus("error");
			setConnectionError(webrtc.connectionError);
		} else if (webrtc.isConnecting) {
			setConnectionStatus("connecting");
		}
	}, [webrtc.isConnected, webrtc.isConnecting, webrtc.connectionError]);

	// Handlers
	const handleOpenChange = useCallback((newOpen: boolean) => {
		setOpen(newOpen);
		if (newOpen) {
			dialerStore.openDialer();
		} else {
			dialerStore.closeDialer();
			setToNumber("");
			setSelectedCustomer(null);
			setCustomerSearchQuery("");
		}
	}, [dialerStore]);

	const handleCustomerSelect = useCallback((c: Customer | null) => {
		setSelectedCustomer(c);
		if (c?.phone) setToNumber(c.phone);
		setCustomerSearchQuery("");
		setCustomerSearchOpen(false);
	}, []);

	const handleRetryConnection = useCallback(() => {
		retryCountRef.current += 1;

		if (retryCountRef.current > maxRetries) {
			toast.warning("Max retries reached, switching to API mode");
			setCallMode("api");
			return;
		}

		// Reset credentials cache and refetch
		resetWebRTCCredentialsCache();
		setWebrtcCredentials(null);
		setConnectionStatus("disconnected");
		setConnectionError(null);

		// Refetch credentials
		fetchWebRTCCredentialsOnce().then((result) => {
			if (result.success && result.credential) {
				setWebrtcCredentials({
					username: result.credential.username,
					password: result.credential.password,
				});
			}
		});
	}, [toast]);

	const handleModeToggle = useCallback((checked: boolean) => {
		setCallMode(checked ? "webrtc" : "api");
	}, []);

	// Filter customers
	const filteredCustomers = useMemo(() => {
		const q = customerSearchQuery.trim().toLowerCase();
		if (!q) return customers.slice(0, 50);

		const qDigits = q.replace(/\D/g, "");
		return customers.filter((c) => {
			const searchable = [
				c.first_name, c.last_name, c.display_name,
				c.email, c.phone, c.secondary_phone, c.company_name,
			].map((v) => cleanValue(v).toLowerCase());

			if (searchable.some((s) => s.includes(q))) return true;
			if (qDigits) {
				const phones = [c.phone, c.secondary_phone]
					.map((p) => cleanValue(p).replace(/\D/g, ""))
					.filter(Boolean);
				if (phones.some((p) => p.includes(qDigits))) return true;
			}
			return false;
		});
	}, [customers, customerSearchQuery]);

	// Make call via WebRTC
	const handleWebRTCCall = useCallback(async () => {
		const to = toNumber.replace(/\D/g, "");
		if (!to || !webrtc.isConnected) return;

		try {
			await webrtc.makeCall(to, fromNumber);
			toast.success(
				selectedCustomer
					? `Calling ${getCustomerName(selectedCustomer)}`
					: `Calling ${formatPhone(toNumber)}`
			);
		} catch (error) {
			console.error("WebRTC call error:", error);
			toast.error("Failed to start call via WebRTC");

			// Fallback to API
			toast.info("Falling back to API mode...");
			handleAPICall();
		}
	}, [toNumber, fromNumber, selectedCustomer, webrtc, toast]);

	// Make call via API (fallback)
	const handleAPICall = useCallback(async () => {
		if (!companyId || isPending) return;

		const to = toNumber.replace(/\D/g, "");
		if (!to) {
			toast.error("Please enter a valid phone number");
			return;
		}

		if (!fromNumber) {
			toast.error("Please select a company phone number");
			return;
		}

		startTransition(async () => {
			try {
				const result = await makeCall({
					to,
					from: fromNumber,
					companyId,
					customerId: selectedCustomer?.id,
				});

				if (!result.success) {
					toast.error(result.error || "Failed to start call");
					return;
				}

				toast.success(
					selectedCustomer
						? `Calling ${getCustomerName(selectedCustomer)}`
						: `Calling ${formatPhone(toNumber)}`
				);

				// Open call window
				const params = new URLSearchParams({
					callControlId: result.callControlId || "",
					companyId,
					to,
					from: fromNumber,
					direction: "outbound",
					...(selectedCustomer?.id && { customerId: selectedCustomer.id }),
				});

				window.open(`/call-window?${params}`, "_blank", "noopener,noreferrer");

				// Reset
				handleOpenChange(false);
			} catch {
				toast.error("Failed to start call. Please try again.");
			}
		});
	}, [companyId, toNumber, fromNumber, selectedCustomer, isPending, toast, handleOpenChange]);

	// Start call based on mode
	const handleStartCall = useCallback(() => {
		if (callMode === "webrtc" && webrtc.isConnected) {
			handleWebRTCCall();
		} else {
			handleAPICall();
		}
	}, [callMode, webrtc.isConnected, handleWebRTCCall, handleAPICall]);

	// Handle WebRTC call controls
	const handleMuteToggle = useCallback(async () => {
		try {
			if (webrtc.currentCall?.isMuted) {
				await webrtc.unmuteCall();
			} else {
				await webrtc.muteCall();
			}
		} catch (error) {
			console.error("Mute toggle error:", error);
		}
	}, [webrtc]);

	const handleHoldToggle = useCallback(async () => {
		try {
			if (webrtc.currentCall?.isHeld) {
				await webrtc.unholdCall();
			} else {
				await webrtc.holdCall();
			}
		} catch (error) {
			console.error("Hold toggle error:", error);
		}
	}, [webrtc]);

	const handleEndCall = useCallback(async () => {
		try {
			await webrtc.endCall();
		} catch (error) {
			console.error("End call error:", error);
		}
	}, [webrtc]);

	const canCall = Boolean(toNumber.trim() && fromNumber && companyPhones.length > 0);
	const isWebRTCReady = callMode === "webrtc" && connectionStatus === "connected";
	const hasActiveCall = webrtc.currentCall && webrtc.currentCall.state !== "idle" && webrtc.currentCall.state !== "ended";

	// SSR placeholder
	if (!mounted) {
		return (
			<button
				className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent opacity-50"
				disabled
				type="button"
			>
				<Phone className="h-4 w-4" />
			</button>
		);
	}

	return (
		<TooltipProvider delayDuration={200}>
			<DropdownMenu open={open} onOpenChange={handleOpenChange}>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<button
								className={cn(
									"relative flex h-8 w-8 items-center justify-center rounded-md",
									"border border-transparent transition-all",
									"hover:border-primary/20 hover:bg-primary/10 hover:text-primary",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
									hasIncomingCall && "animate-pulse text-primary",
									hasActiveCall && "text-success"
								)}
								type="button"
							>
								{hasActiveCall ? (
									<PhoneCall className="h-4 w-4" />
								) : hasIncomingCall ? (
									<PhoneIncoming className="h-4 w-4" />
								) : (
									<Phone className="h-4 w-4" />
								)}
								{displayCount > 0 && (
									<Badge
										variant="destructive"
										className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
									>
										{displayCount > 9 ? "9+" : displayCount}
									</Badge>
								)}
							</button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						{hasActiveCall ? "Call in Progress" : hasIncomingCall ? "Incoming Call" : "Make a Call"}
					</TooltipContent>
				</Tooltip>

				<DropdownMenuContent align="end" className="w-80 p-0">
					<div className="space-y-3 p-4">
						{/* Header */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
									<PhoneCall className="h-5 w-5 text-primary" />
								</div>
								<div className="min-w-0 flex-1">
									<h3 className="text-sm font-semibold">Make a Call</h3>
									<ConnectionStatusBadge
										status={connectionStatus}
										mode={callMode}
										onRetry={handleRetryConnection}
									/>
								</div>
							</div>
						</div>

						{/* Mode toggle */}
						<div className="flex items-center justify-between rounded-lg border bg-muted/30 p-2">
							<div className="flex items-center gap-2">
								<Server className="h-4 w-4 text-muted-foreground" />
								<span className="text-xs text-muted-foreground">API Mode</span>
							</div>
							<Switch
								checked={callMode === "webrtc"}
								onCheckedChange={handleModeToggle}
								disabled={!webrtcCredentials}
							/>
							<div className="flex items-center gap-2">
								<span className="text-xs text-muted-foreground">Browser Audio</span>
								<Headphones className="h-4 w-4 text-muted-foreground" />
							</div>
						</div>

						{/* Active call card */}
						{hasActiveCall && webrtc.currentCall && (
							<>
								<ActiveCallCard
									call={webrtc.currentCall}
									onMute={handleMuteToggle}
									onHold={handleHoldToggle}
									onEnd={handleEndCall}
								/>
								<DropdownMenuSeparator />
							</>
						)}

						{/* Incoming call alert */}
						{hasIncomingCall && (
							<>
								<div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
									<PhoneIncoming className="h-5 w-5 shrink-0 animate-pulse text-destructive" />
									<div className="min-w-0 flex-1">
										<p className="text-sm font-semibold text-destructive">Incoming Call</p>
										<p className="truncate text-xs text-destructive/80">
											{caller?.name || caller?.number || "Unknown"}
										</p>
									</div>
								</div>
								<DropdownMenuSeparator />
							</>
						)}

						{/* Connection error message */}
						{connectionError && callMode === "webrtc" && (
							<div className="rounded-lg border border-warning/30 bg-warning/10 p-2">
								<p className="text-xs text-warning">{connectionError}</p>
								<p className="mt-1 text-xs text-muted-foreground">
									Calls will use API mode (opens in new window)
								</p>
							</div>
						)}

						{/* Customer search */}
						{!hasActiveCall && (
							<>
								<div className="space-y-1.5">
									<label className="text-xs font-medium text-muted-foreground">
										Customer (optional)
									</label>
									<Popover open={customerSearchOpen} onOpenChange={setCustomerSearchOpen}>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className="h-9 w-full justify-start gap-2 px-3 font-normal"
												disabled={customersLoading}
											>
												<User className="h-4 w-4 shrink-0 text-muted-foreground" />
												<span className="min-w-0 flex-1 truncate text-left">
													{selectedCustomer ? getCustomerName(selectedCustomer) : "Search..."}
												</span>
												{selectedCustomer && (
													<X
														className="h-4 w-4 shrink-0 text-muted-foreground hover:text-foreground"
														onClick={(e) => {
															e.stopPropagation();
															handleCustomerSelect(null);
														}}
													/>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent align="start" className="w-80 p-0" sideOffset={4}>
											<Command shouldFilter={false}>
												<CommandInput
													placeholder="Name, phone, or email..."
													value={customerSearchQuery}
													onValueChange={setCustomerSearchQuery}
												/>
												<CommandList className="max-h-[200px]">
													<CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
														No customers found
													</CommandEmpty>
													<CommandGroup>
														{filteredCustomers.map((c) => (
															<CommandItem
																key={c.id}
																value={c.id}
																onSelect={() => handleCustomerSelect(c)}
																className="flex cursor-pointer items-center gap-2 px-3 py-2"
															>
																<div className="min-w-0 flex-1">
																	<p className="truncate text-sm font-medium">
																		{getCustomerName(c)}
																	</p>
																	{c.phone && (
																		<p className="truncate text-xs text-muted-foreground">
																			{formatPhone(c.phone)}
																		</p>
																	)}
																</div>
																{selectedCustomer?.id === c.id && (
																	<Check className="h-4 w-4 shrink-0 text-primary" />
																)}
															</CommandItem>
														))}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
								</div>

								{/* Phone number */}
								<div className="space-y-1.5">
									<label htmlFor="phone-to" className="text-xs font-medium text-muted-foreground">
										Phone Number
									</label>
									<Input
										id="phone-to"
										placeholder="(555) 123-4567"
										value={toNumber}
										onChange={(e) => setToNumber(e.target.value)}
										className="h-9"
									/>
								</div>

								{/* From number */}
								<div className="space-y-1.5">
									<label htmlFor="phone-from" className="text-xs font-medium text-muted-foreground">
										Your Company Line
									</label>
									<Select value={fromNumber} onValueChange={setFromNumber}>
										<SelectTrigger id="phone-from" className="h-9">
											<SelectValue placeholder="Select line..." />
										</SelectTrigger>
										<SelectContent>
											{companyPhones.map((p) => (
												<SelectItem key={p.id} value={p.number}>
													{p.label || formatPhone(p.number)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{companyPhones.length === 0 && (
										<p className="text-xs text-muted-foreground">
											No phone numbers configured
										</p>
									)}
								</div>

								{/* Call button */}
								<Button
									className="w-full gap-2"
									disabled={!canCall || isPending}
									onClick={handleStartCall}
								>
									{isPending ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Starting...
										</>
									) : isWebRTCReady ? (
										<>
											<Headphones className="h-4 w-4" />
											Call (Browser Audio)
										</>
									) : (
										<>
											<PhoneOutgoing className="h-4 w-4" />
											Call (Opens Window)
										</>
									)}
								</Button>
							</>
						)}

						{/* Quick links */}
						<DropdownMenuSeparator />
						<div className="flex gap-2">
							<Link
								href="/dashboard/communication?filter=calls"
								onClick={() => handleOpenChange(false)}
								className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								<Clock className="h-3.5 w-3.5" />
								History
							</Link>
							<Link
								href="/dashboard/communication"
								onClick={() => handleOpenChange(false)}
								className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								<MessageSquare className="h-3.5 w-3.5" />
								Messages
							</Link>
						</div>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</TooltipProvider>
	);
}
