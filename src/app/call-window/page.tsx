"use client";

/**
 * Call Window Page - Complete Redesign
 *
 * New architecture with:
 * - Top toolbar with call controls and customer info
 * - Left panel: Live transcript with AI analysis (35%)
 * - Right panel: Customer sidebar with collapsibles (65%)
 * - Real Telnyx integration
 * - Real customer data from database
 * - AI-powered auto-fill from transcript
 * - No mock data, no separate forms
 *
 * The customer sidebar collapsibles show existing data or empty states
 * for new customers, with real-time AI auto-fill from the transcript.
 */

import type { Call as TelnyxCall } from "@telnyx/webrtc";
import { AlertCircle, CalendarDays, MessageSquare } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { getCustomerCallData, getCustomerCallDataById } from "@/actions/call-customer-data";
import { CallToolbar } from "@/components/call-window/call-toolbar";
import { CSRScheduleView } from "@/components/call-window/csr-schedule-view";
import { CustomerSidebar } from "@/components/call-window/customer-sidebar";
import { TranscriptPanel } from "@/components/communication/transcript-panel";
import { Button } from "@/components/ui/button";
import { useCallQuality } from "@/hooks/use-call-quality";
import { useTelnyxWebRTC } from "@/hooks/use-telnyx-webrtc";
import { useUIStore } from "@/lib/stores";
import { useTranscriptStore } from "@/lib/stores/transcript-store";
import {
	getCallIdFromUrl,
	isPopOutMessage,
	type PopOutMessage,
	sendToMain,
	verifyMessageOrigin,
} from "@/lib/window/pop-out-manager";
import type { CustomerCallData } from "@/types/call-window";

function CallWindowContent() {
	const searchParams = useSearchParams();
	const callId = searchParams?.get("callId") || getCallIdFromUrl();
	const customerId = searchParams?.get("customerId");
	const direction = searchParams?.get("direction") as "inbound" | "outbound" | null;

	// Store hooks
	const {
		call,
		answerCall,
		endCall,
		toggleMute,
		toggleHold,
		toggleRecording,
		requestVideo,
		endVideo,
		setCustomerData,
		setCallMetadata,
		setTelnyxCallState,
	} = useUIStore();

	const { clearTranscript } = useTranscriptStore();

	// WebRTC hook for accessing the actual call object
	const webrtc = useTelnyxWebRTC({
		username: process.env.NEXT_PUBLIC_TELNYX_SIP_USERNAME || "",
		password: process.env.NEXT_PUBLIC_TELNYX_SIP_PASSWORD || "",
		autoConnect: false,
	});

	// Real-time call quality monitoring
	const { quality: connectionQuality, metrics: qualityMetrics } = useCallQuality({
		call: webrtc.currentCall as TelnyxCall | null,
		updateInterval: 2000, // Update every 2 seconds
	});

	// Local state
	const [_isReady, setIsReady] = useState(false);
	const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [_showTransfer, setShowTransfer] = useState(false);
	const [companyId, setCompanyId] = useState<string | null>(searchParams?.get("companyId") ?? null);
	const [leftPanelView, setLeftPanelView] = useState<"transcript" | "schedule">("schedule");

	// Format call duration
	const formatDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

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
				let resolvedCompanyId = companyId ?? searchParams?.get("companyId") ?? null;

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
							// TODO: Handle error case
						} else if (user) {
							const { data: teamMembers, error: teamError } = await supabase
								.from("team_members")
								.select("company_id, status, joined_at")
								.eq("user_id", user.id)
								.eq("status", "active")
								.order("joined_at", { ascending: false });

							if (teamError) {
								// TODO: Handle error case
							} else if (Array.isArray(teamMembers) && teamMembers.length > 0) {
								if (teamMembers.length > 1) {
									// TODO: Handle error case
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
	}, [callId, customerId, call.caller?.number, searchParams, setCustomerData, companyId]);

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
						// TODO: Handle error case
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
		(action: string) => {
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
					toggleRecording();
					sendToMain({
						type: "CALL_ACTION",
						callId,
						action: call.isRecording ? "record_stop" : "record_start",
						timestamp: Date.now(),
					});
					break;

				case "end":
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
		]
	);

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
		setShowTransfer(true);
		// Transfer functionality would be implemented here
	}, []);

	const handleClose = useCallback(() => {
		window.close();
	}, []);

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
	const customerData = call.customerData as CustomerCallData | null;

	// Get caller name from customer data or call data
	const callerName =
		customerData?.customer?.first_name && customerData?.customer?.last_name
			? `${customerData.customer.first_name} ${customerData.customer.last_name}`.trim()
			: customerData?.customer?.first_name
				? customerData.customer.first_name
				: call.caller?.name || "Unknown Caller";

	// Get caller number from customer data or call data
	const callerNumber = customerData?.customer?.phone || call.caller?.number || "No number";

	return (
		<div className="bg-background flex h-screen flex-col">
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
				onClose={handleClose}
				onEndCall={() => handleCallAction("end")}
				onHoldToggle={() => handleCallAction(call.isOnHold ? "unhold" : "hold")}
				onMuteToggle={() => handleCallAction(call.isMuted ? "unmute" : "mute")}
				onRecordToggle={() => handleCallAction(call.isRecording ? "record_stop" : "record_start")}
				onTransfer={handleTransfer}
				onVideoToggle={handleVideoToggle}
				videoStatus={call.videoStatus}
			/>

			{/* Main Content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Left: Transcript/Schedule (35%) */}
				<div className="bg-muted/20 flex w-[35%] flex-col">
					{/* Toggle Buttons */}
					<div className="bg-card/50 flex border-b">
						<Button
							className="flex-1 rounded-none border-r"
							onClick={() => setLeftPanelView("transcript")}
							size="sm"
							variant={leftPanelView === "transcript" ? "secondary" : "ghost"}
						>
							<MessageSquare className="mr-2 h-4 w-4" />
							Transcript
						</Button>
						<Button
							className="flex-1 rounded-none"
							onClick={() => setLeftPanelView("schedule")}
							size="sm"
							variant={leftPanelView === "schedule" ? "secondary" : "ghost"}
						>
							<CalendarDays className="mr-2 h-4 w-4" />
							Schedule
						</Button>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-hidden">
						{leftPanelView === "transcript" ? (
							<TranscriptPanel />
						) : (
							<CSRScheduleView companyId={companyId || undefined} />
						)}
					</div>
				</div>

				{/* Right: Customer Sidebar (65% - Full Height) */}
				<div className="flex-1 overflow-hidden">
					<CustomerSidebar customerData={customerData} isLoading={isLoadingCustomer} />
				</div>
			</div>
		</div>
	);
}

export default function CallWindowPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen items-center justify-center">
					<div className="text-center">
						<div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
						<p className="text-muted-foreground">Loading call window...</p>
					</div>
				</div>
			}
		>
			<CallWindowContent />
		</Suspense>
	);
}
