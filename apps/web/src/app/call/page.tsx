"use client";

/**
 * Call Window Page - Complete Redesign
 *
 * New architecture with:
 * - Top toolbar with call controls and customer info
 * - Left panel: Live transcript with AI analysis (35%)
 * - Right panel: Customer sidebar with collapsibles (65%)
 * - Real Twilio integration
 * - Real customer data from database
 * - AI-powered auto-fill from transcript
 * - No mock data, no separate forms
 * - Keyboard shortcuts for all actions
 * - AI-powered suggestions and sentiment analysis
 * - Accessibility features (skip links, ARIA labels)
 *
 * The customer sidebar collapsibles show existing data or empty states
 * for new customers, with real-time AI auto-fill from the transcript.
 */

import type { WebRTCCall } from "@/hooks/use-twilio-voice";
import { AlertCircle, CalendarDays, MessageSquare } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
	getCustomerCallData,
	getCustomerCallDataById,
} from "@/actions/call-customer-data";
import { endActiveCall } from "@/actions/twilio";
import {
	CallToolbar,
	CallWrapUpDialog,
	KeyboardShortcutsHelp,
	OutgoingCallRinging,
} from "@/components/call";

// Dynamically import video conference to reduce bundle size
const VideoConferenceView = dynamic(
	() =>
		import("@/components/layout/video-conference").then((mod) => ({
			default: mod.VideoConferenceView,
		})),
	{
		loading: () => null,
	},
);
import { CallWindowSkeleton } from "@/components/call/call-skeleton";
import { CSRScheduleView } from "@/components/call/csr-schedule-view";
import { CustomerSidebar } from "@/components/call/customer-sidebar";
import { TranscriptPanel } from "@/components/communication/transcript-panel";
import { SkipLink } from "@/components/layout/skip-link";
import { Button } from "@/components/ui/button";
import { useCallQuality } from "@/hooks/use-call-quality";
import { useCallShortcuts } from "@/hooks/use-call-shortcuts";
import { useTwilioVoice } from "@/hooks/use-twilio-voice";
import { useUIStore } from "@/lib/stores";
import { useTranscriptStore } from "@/lib/stores/transcript-store";
import {
	getCallIdFromUrl,
	isPopOutMessage,
	type PopOutMessage,
	sendToMain,
	verifyMessageOrigin,
} from "@/lib/utils/pop-out-manager";
import type { CustomerCallData } from "@/types/call";

function CallWindowContent() {
	const searchParams = useSearchParams();
	const callId = searchParams?.get("callId") || getCallIdFromUrl();
	const customerId = searchParams?.get("customerId");
	const direction = searchParams?.get("direction") as
		| "inbound"
		| "outbound"
		| null;

	// Store hooks
	const {
		call,
		answerCall,
		activateCall,
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
		setCustomerData,
		setCallMetadata,
		setTwilioCallState,
	} = useUIStore();

	const { clearTranscript } = useTranscriptStore();

	// WebRTC hook for accessing the actual call object
	const webrtc = useTwilioVoice({
		accessToken: process.env.NEXT_PUBLIC_TWILIO_ACCESS_TOKEN || "",
		autoConnect: false,
	});

	// Real-time call quality monitoring
	const { quality: connectionQuality, metrics: qualityMetrics } =
		useCallQuality({
			call: webrtc.currentCall as WebRTCCall | null,
			updateInterval: 2000, // Update every 2 seconds
		});

	// Local state
	const [_isReady, setIsReady] = useState(false);
	const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [_showTransfer, setShowTransfer] = useState(false);
	const [companyId, setCompanyId] = useState<string | null>(
		searchParams?.get("companyId") ?? null,
	);
	const [leftPanelView, setLeftPanelView] = useState<"transcript" | "schedule">(
		"schedule",
	);

	// Enhanced state for Phase 1 & 2 components
	const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
	const [showWrapUpDialog, setShowWrapUpDialog] = useState(false);
	const [showTransferModal, setShowTransferModal] = useState(false);
	const [holdStartTime, setHoldStartTime] = useState<number | undefined>();
	const [recordingStartTime, setRecordingStartTime] = useState<
		number | undefined
	>();
	const [callNotes, setCallNotes] = useState("");
	const [ringingStartTime] = useState<number>(Date.now());
	const [ringingElapsed, setRingingElapsed] = useState(0);

	// Refs for focus management
	const mainContentRef = useRef<HTMLDivElement>(null);

	// Format call duration
	const formatDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Quick action handlers for CustomerSidebar
	const handleCreateJob = useCallback(() => {
		// Open job creation modal or navigate to job creation
		console.log("Create job for customer");
	}, []);

	const handleScheduleAppointment = useCallback(() => {
		// Open appointment scheduling
		setLeftPanelView("schedule");
	}, []);

	const handleSendSMS = useCallback(() => {
		// Open SMS composer
		console.log("Send SMS to customer");
	}, []);

	const handleSendEmail = useCallback(() => {
		// Open email composer
		console.log("Send email to customer");
	}, []);

	const handleTakePayment = useCallback(() => {
		// Open payment modal
		console.log("Take payment from customer");
	}, []);

	const handleAddNote = useCallback(() => {
		// Focus on notes input
		console.log("Add note");
	}, []);

	// Initialize call window
	useEffect(() => {
		if (!callId) {
			return;
		}

		// Send ready message to main window
		sendToMain({
			type: "CALL_POP_OUT_READY",
			callId,
			timestamp: Date.now(),
		});

		setIsReady(true);

		// Set call metadata
		if (direction) {
			setCallMetadata({
				callControlId: callId,
				callSessionId: callId,
				direction,
			});
		}
	}, [callId, direction, setCallMetadata]);

	// Fetch customer data
	useEffect(() => {
		if (!callId) {
			return;
		}

		const fetchCustomerData = async () => {
			setIsLoadingCustomer(true);

			try {
				// Resolve company ID from URL or cached state
				let resolvedCompanyId =
					companyId ?? searchParams?.get("companyId") ?? null;

				// Update state if we got it from URL params
				if (resolvedCompanyId && !companyId) {
					setCompanyId(resolvedCompanyId);
				}

				// If not in URL, fetch from user session
				if (!resolvedCompanyId) {
					try {
						const { createClient } = await import("@/lib/supabase/client");
						const supabase = createClient();
						if (!supabase) {
							return;
						}
						const {
							data: { user },
							error: userError,
						} = await supabase.auth.getUser();

						if (userError) {
							console.error(
								"Call window: Failed to get user:",
								userError.message,
							);
							return; // Cannot proceed without user
						} else if (user) {
							const { data: teamMembers, error: teamError } = await supabase
								.from("company_memberships")
								.select("company_id, status, joined_at")
								.eq("user_id", user.id)
								.eq("status", "active")
								.order("joined_at", { ascending: false });

							if (teamError) {
								console.error(
									"Call window: Failed to fetch team memberships:",
									teamError.message,
								);
								return; // Cannot proceed without company context
							} else if (Array.isArray(teamMembers) && teamMembers.length > 0) {
								if (teamMembers.length > 1) {
									// User has multiple active memberships - using most recent
									console.info(
										"Call window: User has multiple memberships, using most recent",
									);
								}
								const activeMembership = teamMembers[0];
								if (activeMembership?.company_id) {
									resolvedCompanyId = activeMembership.company_id;
									setCompanyId(activeMembership.company_id);
								} else {
								}
							} else {
							}
						} else {
						}
					} catch (_error) {}
				}

				if (!resolvedCompanyId) {
					setIsLoadingCustomer(false);
					return;
				}

				let result;
				if (customerId) {
					// Outbound call - we know the customer
					result = await getCustomerCallDataById(customerId, resolvedCompanyId);
				} else {
					// Inbound call - lookup by phone number
					const callerNumber = call.caller?.number || searchParams?.get("from");
					if (callerNumber) {
						result = await getCustomerCallData(callerNumber, resolvedCompanyId);
					}
				}

				if (result?.success && result.data) {
					setCustomerData(result.data);
				}
			} catch (_error) {
			} finally {
				setIsLoadingCustomer(false);
			}
		};

		fetchCustomerData();
	}, [
		callId,
		customerId,
		call.caller?.number,
		searchParams,
		setCustomerData,
		companyId,
	]);

	// Sync WebRTC call state to UI store
	useEffect(() => {
		if (!webrtc.currentCall) {
			return;
		}

		// Map WebRTC call state to UI store call status
		if (webrtc.currentCall.state === "active" && call.status !== "active") {
			// Call was just answered - activate the call
			activateCall();
			setTwilioCallState("active");
		} else if (webrtc.currentCall.state === "ended" && call.status !== "ended") {
			setTwilioCallState("ended");
		}
	}, [webrtc.currentCall?.state, call.status, activateCall, setTwilioCallState]);

	// Update call timer
	useEffect(() => {
		if (call.status !== "active" || !call.startTime) {
			return;
		}

		const interval = setInterval(() => {
			setCurrentTime(Math.floor((Date.now() - call.startTime!) / 1000));
		}, 1000);

		return () => clearInterval(interval);
	}, [call.status, call.startTime]);

	// Update ringing timer for outbound calls
	useEffect(() => {
		if (call.status === "active" || direction !== "outbound") {
			return;
		}

		const interval = setInterval(() => {
			setRingingElapsed(Math.floor((Date.now() - ringingStartTime) / 1000));
		}, 1000);

		return () => clearInterval(interval);
	}, [call.status, direction, ringingStartTime]);

	// Handle messages from main window
	useEffect(() => {
		const handleMessage = (event: MessageEvent<PopOutMessage>) => {
			if (!verifyMessageOrigin(event)) {
				return;
			}
			if (!isPopOutMessage(event.data)) {
				return;
			}

			const message = event.data;

			switch (message.type) {
				case "CALL_STATE_SYNC":
					// Sync call state from main window
					if (message.callData) {
						// Call state sync is handled by the call store directly
						// This message type is reserved for future state synchronization needs
						console.debug("Call window: Received state sync", message.callData);
					}
					break;

				case "CALL_ACTION":
					// Handle call actions from main window
					if (message.action === "end") {
						endCall();
						clearTranscript();
					} else if (message.action === "mute") {
						toggleMute();
					} else if (message.action === "unmute") {
						toggleMute();
					}
					break;

				case "TRANSCRIPT_UPDATE":
					// Transcript updates are handled by TranscriptPanel
					break;

				case "CUSTOMER_DATA_UPDATE":
					if (message.customerData) {
						setCustomerData(message.customerData);
					}
					break;
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [endCall, toggleMute, clearTranscript, setCustomerData]);

	// Call action handlers
	const handleCallAction = useCallback(
		async (action: string) => {
			if (!callId) {
				return;
			}

			switch (action) {
				case "mute":
				case "unmute":
					toggleMute();
					sendToMain({
						type: "CALL_ACTION",
						callId,
						action: call.isMuted ? "unmute" : "mute",
						timestamp: Date.now(),
					});
					break;

				case "hold":
				case "unhold":
					// Track hold start time
					if (!call.isOnHold) {
						setHoldStartTime(Date.now());
					} else {
						setHoldStartTime(undefined);
					}
					toggleHold();
					sendToMain({
						type: "CALL_ACTION",
						callId,
						action: call.isOnHold ? "unhold" : "hold",
						timestamp: Date.now(),
					});
					break;

				case "record_start":
				case "record_stop":
					// Track recording start time
					if (!call.isRecording) {
						setRecordingStartTime(Date.now());
					} else {
						setRecordingStartTime(undefined);
					}
					toggleRecording();
					sendToMain({
						type: "CALL_ACTION",
						callId,
						action: call.isRecording ? "record_stop" : "record_start",
						timestamp: Date.now(),
					});
					break;

				case "end":
					// Show wrap-up dialog before ending
					setShowWrapUpDialog(true);
					break;

				case "force_end":
					// Force end without wrap-up (used after completing wrap-up)
					try {
						// Try to disconnect WebRTC call first
						await webrtc.endCall();
					} catch (error) {
						console.debug("WebRTC endCall error (may be normal if not connected):", error);
					}
					
					// End the call on Twilio's servers
					if (companyId && callId) {
						try {
							await endActiveCall({
								companyId,
								callSid: callId,
							});
						} catch (error) {
							console.error("Failed to end call on Twilio:", error);
						}
					}
					
					endCall();
					clearTranscript();
					sendToMain({
						type: "CALL_ACTION",
						callId,
						action: "end",
						timestamp: Date.now(),
					});
					// Close window after a short delay
					setTimeout(() => window.close(), 500);
					break;
			}
		},
		[
			callId,
			call.isMuted,
			call.isOnHold,
			call.isRecording,
			toggleMute,
			toggleHold,
			toggleRecording,
			endCall,
			clearTranscript,
			webrtc,
		],
	);

	// Handle wrap-up completion
	const handleWrapUpComplete = useCallback(
		(data: {
			disposition: string;
			notes: string;
			followUp: {
				enabled: boolean;
				type: string;
				date?: Date;
				notes?: string;
			};
			sendConfirmation: boolean;
			createJob: boolean;
		}) => {
			// Save wrap-up data
			console.log("Call wrap-up data:", data);
			setCallNotes(data.notes);

			// Now actually end the call
			handleCallAction("force_end");
			setShowWrapUpDialog(false);
		},
		[handleCallAction],
	);

	// Handle wrap-up cancel (user wants to continue call)
	const handleWrapUpCancel = useCallback(() => {
		setShowWrapUpDialog(false);
	}, []);

	const handleVideoToggle = useCallback(() => {
		if (!callId) {
			return;
		}

		if (call.videoStatus === "off") {
			requestVideo();
			sendToMain({
				type: "CALL_ACTION",
				callId,
				action: "video_on",
				timestamp: Date.now(),
			});
		} else {
			endVideo();
			sendToMain({
				type: "CALL_ACTION",
				callId,
				action: "video_off",
				timestamp: Date.now(),
			});
		}
	}, [callId, call.videoStatus, requestVideo, endVideo]);

	const handleTransfer = useCallback(() => {
		setShowTransferModal(true);
	}, []);

	const handleCancelCall = useCallback(async () => {
		try {
			// Try to disconnect WebRTC call first
			await webrtc.endCall();
		} catch (error) {
			console.debug("WebRTC endCall error (may be normal if not connected):", error);
		}
		
		// End the call on Twilio's servers
		if (companyId && callId) {
			try {
				await endActiveCall({
					companyId,
					callSid: callId,
				});
			} catch (error) {
				console.error("Failed to end call on Twilio:", error);
			}
		}
		
		endCall();
		clearTranscript();
		if (callId) {
			sendToMain({
				type: "CALL_ACTION",
				callId,
				action: "end",
				timestamp: Date.now(),
			});
		}
		setTimeout(() => window.close(), 500);
	}, [callId, endCall, clearTranscript, webrtc, companyId]);

	const handleClose = useCallback(() => {
		window.close();
	}, []);

	// Keyboard shortcuts
	useCallShortcuts(
		{
			onToggleMute: () => handleCallAction(call.isMuted ? "unmute" : "mute"),
			onToggleHold: () => handleCallAction(call.isOnHold ? "unhold" : "hold"),
			onToggleRecording: () =>
				handleCallAction(call.isRecording ? "record_stop" : "record_start"),
			onEndCall: () => handleCallAction("end"),
			onCreateJob: handleCreateJob,
			onScheduleAppointment: handleScheduleAppointment,
			onSendSMS: handleSendSMS,
			onSendEmail: handleSendEmail,
			onFocusNotes: handleAddNote,
			onShowHelp: () => setShowShortcutsHelp(true),
			onViewTranscript: () => setLeftPanelView("transcript"),
			onViewSchedule: () => setLeftPanelView("schedule"),
			onEscape: () => {
				// Close any open dialogs
				if (showShortcutsHelp) setShowShortcutsHelp(false);
				if (showWrapUpDialog) setShowWrapUpDialog(false);
			},
		},
		{
			enabled: call.status === "active",
		},
	);

	// Error states
	if (!callId) {
		return (
			<div className="bg-background flex h-screen items-center justify-center">
				<div className="text-center">
					<AlertCircle className="text-destructive mx-auto mb-4 h-12 w-12" />
					<h1 className="mb-2 text-2xl font-bold">Invalid Call</h1>
					<p className="text-muted-foreground">No call ID provided</p>
				</div>
			</div>
		);
	}

	const isActive = call.status === "active";
	const isOutboundRinging = direction === "outbound" && !isActive;
	const customerData = call.customerData as CustomerCallData | null;

	// Get caller name from customer data or call data
	const callerName =
		customerData?.customer?.first_name && customerData?.customer?.last_name
			? `${customerData.customer.first_name} ${customerData.customer.last_name}`.trim()
			: customerData?.customer?.first_name
				? customerData.customer.first_name
				: call.caller?.name || "Unknown Caller";

	// Get caller number from customer data or call data
	const callerNumber =
		customerData?.customer?.phone || call.caller?.number || "No number";

	// Get the "to" number from URL params for outbound calls
	const toNumber = searchParams?.get("to") || "";
	const fromNumber = searchParams?.get("from") || "";

	// Show Skype-style ringing screen for outbound calls that haven't connected
	if (isOutboundRinging) {
		return (
			<OutgoingCallRinging
				toNumber={toNumber}
				fromNumber={fromNumber}
				customerData={customerData}
				isLoadingCustomer={isLoadingCustomer}
				onCancel={handleCancelCall}
				onTransfer={handleTransfer}
				onVideoCall={handleVideoToggle}
				elapsedTime={ringingElapsed}
			/>
		);
	}

	// Show video conference view when video is active
	if (
		isActive &&
		(call.videoStatus === "requesting" ||
			call.videoStatus === "ringing" ||
			call.videoStatus === "connected")
	) {
		return (
			<VideoConferenceView
				addReaction={addReaction}
				call={call}
				callDuration={formatDuration(currentTime)}
				caller={{
					name: callerName,
					number: callerNumber,
					avatar: customerData?.customer?.avatar_url,
				}}
				onEndCall={() => handleCallAction("end")}
				onEndVideo={endVideo}
				onToggleLocalVideo={toggleLocalVideo}
				sendChatMessage={sendChatMessage}
				toggleMute={() => handleCallAction(call.isMuted ? "unmute" : "mute")}
				toggleRecording={() =>
					handleCallAction(call.isRecording ? "record_stop" : "record_start")
				}
				toggleScreenShare={toggleScreenShare}
				toggleVirtualBackground={toggleVirtualBackground}
			/>
		);
	}

	return (
		<div className="bg-background flex h-screen flex-col">
			{/* Accessibility: Skip link */}
			<SkipLink />

			{/* Toolbar */}
			<CallToolbar
				callDuration={formatDuration(currentTime)}
				callerName={callerName}
				callerNumber={callerNumber}
				callId={callId}
				connectionQuality={connectionQuality || "unknown"}
				customerData={customerData}
				isActive={isActive}
				isMuted={call.isMuted}
				isOnHold={call.isOnHold}
				isRecording={call.isRecording}
				holdStartTime={holdStartTime}
				recordingStartTime={recordingStartTime}
				onClose={handleClose}
				onEndCall={() => handleCallAction("end")}
				onHoldToggle={() => handleCallAction(call.isOnHold ? "unhold" : "hold")}
				onMuteToggle={() => handleCallAction(call.isMuted ? "unmute" : "mute")}
				onRecordToggle={() =>
					handleCallAction(call.isRecording ? "record_stop" : "record_start")
				}
				onTransfer={handleTransfer}
				onVideoToggle={handleVideoToggle}
				onShowShortcuts={() => setShowShortcutsHelp(true)}
				videoStatus={call.videoStatus}
			/>

			{/* Main Content */}
			<main
				id="main-content"
				ref={mainContentRef}
				className="flex flex-1 overflow-hidden"
				role="main"
				aria-label="Call window main content"
			>
				{/* Left: Transcript/Schedule (35%) */}
				<section
					className="bg-muted/20 flex w-[35%] flex-col"
					aria-label={
						leftPanelView === "transcript" ? "Call transcript" : "Schedule view"
					}
				>
					{/* Toggle Buttons */}
					<div
						className="bg-card/50 flex border-b"
						role="tablist"
						aria-label="View selection"
					>
						<Button
							className="flex-1 rounded-none border-r"
							onClick={() => setLeftPanelView("transcript")}
							size="sm"
							variant={leftPanelView === "transcript" ? "secondary" : "ghost"}
							role="tab"
							aria-selected={leftPanelView === "transcript"}
							aria-controls="left-panel-content"
						>
							<MessageSquare className="mr-2 h-4 w-4" aria-hidden="true" />
							Transcript
							<span className="sr-only">(Press T)</span>
						</Button>
						<Button
							className="flex-1 rounded-none"
							onClick={() => setLeftPanelView("schedule")}
							size="sm"
							variant={leftPanelView === "schedule" ? "secondary" : "ghost"}
							role="tab"
							aria-selected={leftPanelView === "schedule"}
							aria-controls="left-panel-content"
						>
							<CalendarDays className="mr-2 h-4 w-4" aria-hidden="true" />
							Schedule
							<span className="sr-only">(Press S)</span>
						</Button>
					</div>

					{/* Content */}
					<div
						id="left-panel-content"
						className="flex-1 overflow-hidden"
						role="tabpanel"
						aria-label={
							leftPanelView === "transcript"
								? "Call transcript panel"
								: "Schedule panel"
						}
					>
						{leftPanelView === "transcript" ? (
							<TranscriptPanel />
						) : (
							<CSRScheduleView companyId={companyId || undefined} />
						)}
					</div>
				</section>

				{/* Right: Customer Sidebar (65% - Full Height) */}
				<section
					className="flex-1 overflow-hidden"
					aria-label="Customer information"
				>
					<CustomerSidebar
						customerData={customerData}
						isLoading={isLoadingCustomer}
						onCreateJob={handleCreateJob}
						onScheduleAppointment={handleScheduleAppointment}
						onSendSMS={handleSendSMS}
						onSendEmail={handleSendEmail}
						onTakePayment={handleTakePayment}
						onAddNote={handleAddNote}
					/>
				</section>
			</main>

			{/* Dialogs */}
			<KeyboardShortcutsHelp
				open={showShortcutsHelp}
				onOpenChange={setShowShortcutsHelp}
			/>

			<CallWrapUpDialog
				open={showWrapUpDialog}
				onOpenChange={setShowWrapUpDialog}
				onComplete={handleWrapUpComplete}
				onCancel={handleWrapUpCancel}
				callDuration={currentTime}
				customerName={callerName}
				existingNotes={callNotes}
			/>
		</div>
	);
}

export default function CallWindowPage() {
	return (
		<Suspense fallback={<CallWindowSkeleton />}>
			<CallWindowContent />
		</Suspense>
	);
}
