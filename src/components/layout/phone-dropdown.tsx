"use client";

/**
 * PhoneDropdown - Telnyx WebRTC Dialer Component
 *
 * Full-featured phone dialer with customer selection and browser audio.
 * Uses Telnyx WebRTC for real-time voice calling through the browser.
 *
 * Client-side features:
 * - WebRTC browser-based calling with microphone/speaker audio
 * - Phone number input with formatting
 * - Customer search and selection (auto-fills phone)
 * - Company phone selection (from number)
 * - Direct call initiation via Telnyx WebRTC
 * - Microphone permission handling
 * - Audio status indicators
 * - Incoming call notifications badge
 * - Quick links to call history and communications
 *
 * Performance:
 * - Uses shadcn/ui DropdownMenu (Radix UI primitives)
 * - Client-only rendering to prevent hydration mismatch
 * - Lazy loads WebRTC credentials on mount
 * - Automatic WebRTC connection management
 */

import {
	AlertCircle,
	Clock,
	Loader2,
	MessageSquare,
	Mic,
	Phone,
	PhoneCall,
	PhoneIncoming,
	PhoneOutgoing,
	User,
	WifiOff,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { getWebRTCCredentials } from "@/actions/telnyx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTelnyxWebRTC } from "@/hooks/use-telnyx-webrtc";
import { useToast } from "@/hooks/use-toast";
import { useUIStore } from "@/lib/stores/ui-store";

type Customer = {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	company_name?: string;
};

type CompanyPhone = {
	id: string;
	number: string;
	label?: string;
};

type PhoneDropdownProps = {
	companyId: string;
	customers?: Customer[];
	companyPhones?: CompanyPhone[];
	incomingCallsCount?: number;
};

export function PhoneDropdown({
	companyId,
	customers = [],
	companyPhones = [],
	incomingCallsCount,
}: PhoneDropdownProps) {
	const { toast } = useToast();
	const [mounted, setMounted] = useState(false);
	const [open, setOpen] = useState(false);
	const [isPending, _startTransition] = useTransition();

	// Dialer state
	const [toNumber, setToNumber] = useState("");
	const [fromNumber, setFromNumber] = useState(companyPhones[0]?.number || "");
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
	const [customerSearchOpen, setCustomerSearchOpen] = useState(false);

	// WebRTC state for browser calling
	const [webrtcCredentials, setWebrtcCredentials] = useState<{
		username: string;
		password: string;
	} | null>(null);
	const [isLoadingWebRTC, setIsLoadingWebRTC] = useState(true);

	// Get call state from UI store
	const callStatus = useUIStore((state) => state.call.status);
	const caller = useUIStore((state) => state.call.caller);

	// Use incoming call count from props or derive from store
	const hasIncomingCall = callStatus === "incoming";
	const displayCount = incomingCallsCount ?? (hasIncomingCall ? 1 : 0);

	// Load WebRTC credentials for browser audio calling
	useEffect(() => {
		async function loadWebRTCCredentials() {
			try {
				const result = await getWebRTCCredentials();

				if (result.success && result.credential) {
					setWebrtcCredentials({
						username: result.credential.username,
						password: result.credential.password,
					});
				} else {
					toast.error(`WebRTC setup failed: ${result.error}`);
				}
			} catch (_error) {
				toast.error("Failed to initialize calling. Please refresh the page.");
			} finally {
				setIsLoadingWebRTC(false);
			}
		}
		loadWebRTCCredentials();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toast.error]); // Only run once on mount - toast is stable but causes re-renders if included

	// Initialize WebRTC for browser calling with microphone/speaker
	const webrtc = useTelnyxWebRTC({
		username: webrtcCredentials?.username || "",
		password: webrtcCredentials?.password || "",
		autoConnect: false, // We'll manually connect when credentials are ready
		debug: true, // Always enable debug for troubleshooting
		onIncomingCall: (_call) => {},
		onCallEnded: (_call) => {},
	});

	// Manually connect when credentials become available
	useEffect(() => {
		if (webrtcCredentials && !webrtc.isConnected && !webrtc.isConnecting) {
			webrtc.connect().catch((_error) => {});
		}
	}, [webrtcCredentials, webrtc]);

	// Log connection state changes for debugging
	useEffect(() => {}, []);

	// Update from number when company phones change
	useEffect(() => {
		if (!fromNumber && companyPhones.length > 0) {
			setFromNumber(companyPhones[0].number);
		}
	}, [companyPhones, fromNumber]);

	// Only render on client to prevent hydration mismatch with Radix UI IDs
	useEffect(() => {
		setMounted(true);
	}, []);

	// Reset form when dropdown opens
	const handleOpenChange = useCallback((newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			// Reset on close
			setToNumber("");
			setSelectedCustomer(null);
		}
	}, []);

	// Handle customer selection
	const handleCustomerSelect = useCallback((customer: Customer | null) => {
		setSelectedCustomer(customer);
		if (customer?.phone) {
			setToNumber(customer.phone);
		}
		setCustomerSearchOpen(false);
	}, []);

	// Handle call initiation using WebRTC for browser audio
	const handleStartCall = useCallback(async () => {
		if (!companyId) {
			toast.error("No company selected. Please select a company to make calls.");
			return;
		}

		// Check WebRTC connection
		if (!webrtc.isConnected) {
			toast.error("Audio calling not ready. Please wait for connection...");
			return;
		}

		if (!(toNumber.trim() && fromNumber) || isPending) {
			return;
		}

		const normalizedTo = toNumber.replace(/\D/g, "");
		if (!normalizedTo) {
			toast.error("Please enter a valid phone number");
			return;
		}

		// Check for microphone permission
		if (navigator.mediaDevices?.getUserMedia) {
			try {
				await navigator.mediaDevices.getUserMedia({ audio: true });

				// Make call using WebRTC for browser audio
				const call = await webrtc.makeCall(normalizedTo, fromNumber);

				const callingMessage = selectedCustomer
					? `Calling ${selectedCustomer.first_name} ${selectedCustomer.last_name}`
					: `Calling ${toNumber}`;
				toast.success(callingMessage);

				const params = new URLSearchParams({
					callId: call.id,
					...(companyId && { companyId }),
					...(selectedCustomer?.id && { customerId: selectedCustomer.id }),
					to: normalizedTo,
					from: fromNumber,
					direction: "outbound",
				});

				const url = `/call-window?${params.toString()}`;

				window.open(url, "_blank", "noopener,noreferrer");

				// Close dropdown and reset
				setOpen(false);
				setToNumber("");
				setSelectedCustomer(null);
			} catch (error) {
				if (error instanceof Error && error.message.includes("permission")) {
					toast.error("Microphone access denied. Please allow microphone access to make calls.");
				} else {
					toast.error("Failed to initiate call. Please try again.");
				}
			}
		} else {
			toast.error("Your browser does not support audio calling.");
		}
	}, [toNumber, fromNumber, companyId, selectedCustomer, isPending, toast, webrtc]);

	// Calculate values needed for rendering (before any returns)
	const hasIncomingCalls = displayCount > 0;
	const canCall = Boolean(
		toNumber.trim() && fromNumber && companyPhones.length > 0 && webrtc.isConnected && !isLoadingWebRTC
	);

	// Debug button state - MUST be before any conditional returns
	useEffect(() => {
		if (open) {
		}
	}, [open]);

	// Early return for SSR - AFTER all hooks are called
	if (!mounted) {
		// Render placeholder button during SSR that matches client button dimensions
		return (
			<div className="relative">
				<button
					className="hover-gradient flex h-8 w-8 items-center justify-center rounded-md border border-transparent outline-none transition-all hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
					disabled
					title="Phone"
					type="button"
				>
					<Phone className="size-4" />
					<span className="sr-only">Phone Menu</span>
				</button>
			</div>
		);
	}

	return (
		<DropdownMenu onOpenChange={handleOpenChange} open={open}>
			<DropdownMenuTrigger asChild>
				<button
					className={`hover-gradient relative flex h-8 w-8 items-center justify-center rounded-md border border-transparent outline-none transition-all hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ${
						hasIncomingCalls ? "animate-pulse text-primary" : ""
					}`}
					title={hasIncomingCalls ? "Incoming Call" : "Phone Dialer"}
					type="button"
				>
					{hasIncomingCalls ? <PhoneIncoming className="size-4" /> : <Phone className="size-4" />}
					<span className="sr-only">Phone Dialer</span>
					{hasIncomingCalls && (
						<Badge
							className="-right-1 -top-1 absolute flex h-5 w-5 items-center justify-center rounded-full p-0 font-semibold text-[10px]"
							variant="destructive"
						>
							{displayCount > 9 ? "9+" : displayCount}
						</Badge>
					)}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80 rounded-lg p-0">
				<div className="space-y-4 p-4">
					{/* Header */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<PhoneCall className="size-5 text-primary" />
							<div>
								<h3 className="font-semibold text-sm">Make a Call</h3>
								<p className="text-muted-foreground text-xs">Browser audio calling</p>
							</div>
						</div>
						{/* WebRTC Status Indicator */}
						<div className="flex items-center gap-1.5">
							{isLoadingWebRTC ? (
								<Loader2 className="size-3 animate-spin text-muted-foreground" />
							) : webrtc.isConnected ? (
								<>
									<Mic className="size-3 text-green-600 dark:text-green-400" />
									<span className="font-medium text-green-600 text-xs dark:text-green-400">Ready</span>
								</>
							) : webrtc.connectionError ? (
								<>
									<AlertCircle className="size-3 text-red-600 dark:text-red-400" />
									<span className="font-medium text-red-600 text-xs dark:text-red-400" title={webrtc.connectionError}>
										Error
									</span>
								</>
							) : webrtc.isConnecting ? (
								<>
									<Loader2 className="size-3 animate-spin text-yellow-600 dark:text-yellow-400" />
									<span className="font-medium text-xs text-yellow-600 dark:text-yellow-400">Connecting...</span>
								</>
							) : (
								<>
									<WifiOff className="size-3 text-gray-600 dark:text-gray-400" />
									<span className="font-medium text-gray-600 text-xs dark:text-gray-400">Disconnected</span>
								</>
							)}
						</div>
					</div>

					{/* Incoming Call Alert */}
					{hasIncomingCalls && (
						<>
							<div className="rounded-md bg-destructive/10 p-3">
								<div className="flex items-center gap-2">
									<PhoneIncoming className="size-4 animate-pulse text-destructive" />
									<div className="flex-1">
										<p className="font-semibold text-destructive text-sm">Incoming Call</p>
										<p className="text-destructive/80 text-xs">{caller?.name || caller?.number || "Unknown"}</p>
									</div>
								</div>
							</div>
							<DropdownMenuSeparator />
						</>
					)}

					{/* Customer Search */}
					<div className="space-y-2">
						<Label className="text-xs">Customer (Optional)</Label>
						<Popover onOpenChange={setCustomerSearchOpen} open={customerSearchOpen}>
							<PopoverTrigger asChild>
								<Button
									className="w-full justify-start text-left font-normal"
									disabled={customers.length === 0}
									variant="outline"
								>
									<User className="mr-2 size-4 shrink-0" />
									<span className="truncate">
										{selectedCustomer
											? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
											: "Select customer..."}
									</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-80 p-0">
								<Command>
									<CommandInput placeholder="Search customers..." />
									<CommandList>
										<CommandEmpty>No customers found.</CommandEmpty>
										<CommandGroup>
											{customers.slice(0, 50).map((customer) => (
												<CommandItem
													key={customer.id}
													onSelect={() => handleCustomerSelect(customer)}
													value={`${customer.first_name} ${customer.last_name} ${customer.email} ${customer.phone}`}
												>
													<div className="flex flex-1 flex-col">
														<span className="font-medium text-sm">
															{customer.first_name} {customer.last_name}
														</span>
														{customer.company_name && (
															<span className="text-muted-foreground text-xs">{customer.company_name}</span>
														)}
														<span className="text-muted-foreground text-xs">{customer.phone || customer.email}</span>
													</div>
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
						{selectedCustomer && (
							<Button className="h-6 text-xs" onClick={() => handleCustomerSelect(null)} size="sm" variant="ghost">
								Clear selection
							</Button>
						)}
					</div>

					{/* To Number */}
					<div className="space-y-2">
						<Label className="text-xs" htmlFor="to-number">
							To
						</Label>
						<Input
							disabled={isPending}
							id="to-number"
							onChange={(e) => setToNumber(e.target.value)}
							placeholder="+1 (555) 123-4567"
							value={toNumber}
						/>
					</div>

					{/* From Number */}
					<div className="space-y-2">
						<Label className="text-xs" htmlFor="from-number">
							From (Company Line)
						</Label>
						<Select disabled={companyPhones.length === 0 || isPending} onValueChange={setFromNumber} value={fromNumber}>
							<SelectTrigger id="from-number">
								<SelectValue placeholder="Select a company line" />
							</SelectTrigger>
							<SelectContent>
								{companyPhones.map((phone) => (
									<SelectItem key={phone.id} value={phone.number}>
										{phone.label ?? phone.number}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{companyPhones.length === 0 && (
							<p className="text-muted-foreground text-xs">No company phone numbers configured</p>
						)}
					</div>

					{/* Call Button */}
					<Button className="w-full" disabled={!canCall || isPending} onClick={handleStartCall}>
						{isPending ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Starting Call...
							</>
						) : (
							<>
								<PhoneOutgoing className="mr-2 size-4" />
								Start Call
							</>
						)}
					</Button>

					{/* Quick Links */}
					<DropdownMenuSeparator />
					<div className="space-y-1">
						<Link
							className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
							href="/dashboard/communication?filter=calls"
							onClick={() => setOpen(false)}
						>
							<Clock className="size-4" />
							<span>Call History</span>
						</Link>
						<Link
							className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
							href="/dashboard/communication"
							onClick={() => setOpen(false)}
						>
							<MessageSquare className="size-4" />
							<span>All Communications</span>
						</Link>
					</div>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
