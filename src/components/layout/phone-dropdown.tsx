"use client";

/**
 * PhoneDropdown - Telnyx Dialer Component
 *
 * Redesigned phone dialer with:
 * - Clear connection status display
 * - WebRTC browser calling (primary)
 * - Call Control API fallback (when WebRTC unavailable)
 * - Simplified UI with better visual feedback
 * - Customer search with smart filtering
 */

import {
	Check,
	Clock,
	Loader2,
	MessageSquare,
	Mic,
	Phone,
	PhoneCall,
	PhoneIncoming,
	PhoneOutgoing,
	RefreshCw,
	Server,
	User,
	WifiOff,
	X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDialerCustomers } from "@/hooks/use-dialer-customers";
import { useTelnyxWebRTC } from "@/hooks/use-telnyx-webrtc";
import { useToast } from "@/hooks/use-toast";
import { useDialerStore } from "@/lib/stores/dialer-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";
import {
	fetchWebRTCCredentialsOnce,
	resetWebRTCCredentialsCache,
} from "@/lib/telnyx/web-credentials-client";

type Customer = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	display_name: string | null;
	email: string | null;
	phone: string | null;
	secondary_phone?: string | null;
	company_name?: string | null;
	address?: string | null;
	address2?: string | null;
	city?: string | null;
	state?: string | null;
	zip_code?: string | null;
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

type ConnectionMode = "webrtc" | "api" | "disconnected";

const cleanValue = (value?: string | null) => (value ?? "").trim();
const normalizeValue = (value?: string | null) => cleanValue(value).toLowerCase();
const digitsOnly = (value?: string | null) => cleanValue(value).replace(/\D/g, "");

const getCustomerFullName = (customer: Customer) => {
	const displayName = cleanValue(customer.display_name);
	if (displayName) return displayName;

	const nameParts = [
		cleanValue(customer.first_name),
		cleanValue(customer.last_name),
	].filter(Boolean);
	return nameParts.join(" ") || cleanValue(customer.email) || "Unknown Customer";
};

const getCustomerAddressString = (customer: Customer) => {
	const cityState = [cleanValue(customer.city), cleanValue(customer.state)]
		.filter(Boolean)
		.join(", ");
	return [
		cleanValue(customer.address),
		cleanValue(customer.address2),
		cityState,
		cleanValue(customer.zip_code),
	]
		.filter(Boolean)
		.join(", ");
};

const formatPhoneDisplay = (phone: string) => {
	const digits = phone.replace(/\D/g, "");
	if (digits.length === 11 && digits.startsWith("1")) {
		return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
	}
	if (digits.length === 10) {
		return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
	}
	return phone;
};

/**
 * Connection Status Badge - Shows current calling mode
 */
function ConnectionStatusBadge({
	mode,
	isConnecting,
	error,
	onRetry,
}: {
	mode: ConnectionMode;
	isConnecting: boolean;
	error?: string | null;
	onRetry?: () => void;
}) {
	if (isConnecting) {
		return (
			<div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 dark:border-yellow-800 dark:bg-yellow-950/30">
				<Loader2 className="h-4 w-4 animate-spin text-yellow-600 dark:text-yellow-400" />
				<div className="flex-1">
					<p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
						Connecting...
					</p>
					<p className="text-[10px] text-yellow-600 dark:text-yellow-400">
						Setting up browser audio
					</p>
				</div>
			</div>
		);
	}

	if (mode === "webrtc") {
		return (
			<div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-800 dark:bg-green-950/30">
				<div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
					<Mic className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
				</div>
				<div className="flex-1">
					<p className="text-xs font-medium text-green-800 dark:text-green-200">
						Browser Audio Ready
					</p>
					<p className="text-[10px] text-green-600 dark:text-green-400">
						Calls use your microphone & speakers
					</p>
				</div>
				<Badge variant="outline" className="border-green-300 text-[10px] text-green-700 dark:border-green-700 dark:text-green-300">
					WebRTC
				</Badge>
			</div>
		);
	}

	if (mode === "api") {
		return (
			<div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-800 dark:bg-blue-950/30">
				<div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
					<Server className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
				</div>
				<div className="flex-1">
					<p className="text-xs font-medium text-blue-800 dark:text-blue-200">
						Server-Side Calling
					</p>
					<p className="text-[10px] text-blue-600 dark:text-blue-400">
						Opens call window to manage calls
					</p>
				</div>
				<Badge variant="outline" className="border-blue-300 text-[10px] text-blue-700 dark:border-blue-700 dark:text-blue-300">
					API
				</Badge>
			</div>
		);
	}

	// Disconnected state with error
	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 dark:border-red-800 dark:bg-red-950/30">
				<div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
					<WifiOff className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
				</div>
				<div className="flex-1">
					<p className="text-xs font-medium text-red-800 dark:text-red-200">
						Connection Failed
					</p>
					<p className="text-[10px] text-red-600 dark:text-red-400">
						{error || "Unable to connect"}
					</p>
				</div>
				{onRetry && (
					<Button
						size="sm"
						variant="ghost"
						className="h-7 gap-1 px-2 text-xs text-red-700 hover:bg-red-100 hover:text-red-800 dark:text-red-300 dark:hover:bg-red-900/50"
						onClick={onRetry}
					>
						<RefreshCw className="h-3 w-3" />
						Retry
					</Button>
				)}
			</div>
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

	// Lazy-load customers only when dropdown opens
	const [open, setOpen] = useState(false);
	const { customers, isLoading: customersLoading } = useDialerCustomers(open);

	// Dialer store state
	const dialerStore = useDialerStore();

	// Dialer state
	const [toNumber, setToNumber] = useState("");
	const [fromNumber, setFromNumber] = useState(companyPhones[0]?.number || "");
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
	const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
	const [customerSearchQuery, setCustomerSearchQuery] = useState("");

	// WebRTC state
	const [webrtcCredentials, setWebrtcCredentials] = useState<{
		username: string;
		password: string;
	} | null>(null);
	const [isLoadingWebRTC, setIsLoadingWebRTC] = useState(false);
	const [webrtcAttempted, setWebrtcAttempted] = useState(false);

	// Get call state from UI store
	const callStatus = useUIStore((state) => state.call.status);
	const caller = useUIStore((state) => state.call.caller);

	const hasIncomingCall = callStatus === "incoming";
	const displayCount = incomingCallsCount ?? (hasIncomingCall ? 1 : 0);

	// Initialize WebRTC when dropdown opens
	useEffect(() => {
		if (!open || webrtcCredentials || webrtcAttempted) return;

		let cancelled = false;
		setIsLoadingWebRTC(true);

		fetchWebRTCCredentialsOnce()
			.then((result) => {
				if (cancelled) return;
				setWebrtcAttempted(true);
				if (result.success && result.credential) {
					setWebrtcCredentials({
						username: result.credential.username,
						password: result.credential.password,
					});
				}
			})
			.catch(() => {
				if (!cancelled) {
					setWebrtcAttempted(true);
					resetWebRTCCredentialsCache();
				}
			})
			.finally(() => {
				if (!cancelled) setIsLoadingWebRTC(false);
			});

		return () => {
			cancelled = true;
		};
	}, [open, webrtcCredentials, webrtcAttempted]);

	// WebRTC hook - only initialize when credentials are available
	const webrtc = useTelnyxWebRTC({
		username: open && webrtcCredentials?.username ? webrtcCredentials.username : "",
		password: open && webrtcCredentials?.password ? webrtcCredentials.password : "",
		autoConnect: false,
		disabled: !open,
		debug: false,
		onIncomingCall: () => {},
		onCallEnded: () => {},
	});

	// Connect WebRTC when credentials become available
	useEffect(() => {
		if (open && webrtcCredentials && !webrtc.isConnected && !webrtc.isConnecting) {
			webrtc.connect().catch(() => {
				// Silent catch - error state is tracked in webrtc.connectionError
			});
		}
	}, [open, webrtcCredentials, webrtc]);

	// Determine connection mode
	const connectionMode: ConnectionMode = useMemo(() => {
		if (webrtc.isConnected) return "webrtc";
		if (webrtcAttempted && !webrtc.isConnecting) return "api"; // Fallback to API mode
		return "disconnected";
	}, [webrtc.isConnected, webrtc.isConnecting, webrtcAttempted]);

	const isConnecting = isLoadingWebRTC || webrtc.isConnecting;

	// Update from number when company phones change
	useEffect(() => {
		if (!fromNumber && companyPhones.length > 0) {
			setFromNumber(companyPhones[0].number);
		}
	}, [companyPhones, fromNumber]);

	// Client-only rendering
	useEffect(() => {
		setMounted(true);
	}, []);

	// Sync dialer store state
	useEffect(() => {
		setOpen(dialerStore.isOpen);
	}, [dialerStore.isOpen]);

	useEffect(() => {
		setToNumber(dialerStore.phoneNumber);
	}, [dialerStore.phoneNumber]);

	useEffect(() => {
		if (dialerStore.customerId && customers.length > 0) {
			const customer = customers.find((c) => c.id === dialerStore.customerId);
			if (customer && customer.id !== selectedCustomer?.id) {
				setSelectedCustomer(customer);
			}
		}
	}, [dialerStore.customerId, customers, selectedCustomer?.id]);

	// Handle dropdown open/close
	const handleOpenChange = useCallback(
		(newOpen: boolean) => {
			setOpen(newOpen);
			if (newOpen) {
				dialerStore.openDialer();
			} else {
				dialerStore.closeDialer();
				setToNumber("");
				setSelectedCustomer(null);
			}
		},
		[dialerStore],
	);

	// Handle customer selection
	const handleCustomerSelect = useCallback((customer: Customer | null) => {
		setSelectedCustomer(customer);
		if (customer) {
			const preferredNumber = customer.phone || customer.secondary_phone || "";
			if (preferredNumber) setToNumber(preferredNumber);
		}
		setCustomerSearchQuery("");
		setCustomerSearchOpen(false);
	}, []);

	// Filter customers
	const filteredCustomers = useMemo(() => {
		const rawQuery = customerSearchQuery.trim();
		if (!rawQuery) return customers;

		const normalizedQuery = rawQuery.toLowerCase();
		const numericQuery = rawQuery.replace(/\D/g, "");

		return customers.filter((customer) => {
			const searchableStrings = [
				customer.first_name,
				customer.last_name,
				`${customer.first_name ?? ""} ${customer.last_name ?? ""}`,
				customer.display_name,
				customer.email,
				customer.company_name,
				customer.phone,
				customer.secondary_phone,
				customer.city,
				customer.state,
				customer.zip_code,
				getCustomerAddressString(customer),
			].map(normalizeValue);

			if (searchableStrings.some((value) => value.includes(normalizedQuery))) {
				return true;
			}

			if (numericQuery) {
				const numericFields = [customer.phone, customer.secondary_phone]
					.map(digitsOnly)
					.filter(Boolean);
				if (numericFields.some((value) => value.includes(numericQuery))) {
					return true;
				}
			}

			return false;
		});
	}, [customers, customerSearchQuery]);

	const displayedCustomers = useMemo(() => {
		const hasSearch = customerSearchQuery.trim().length > 0;
		return hasSearch ? filteredCustomers : filteredCustomers.slice(0, 50);
	}, [filteredCustomers, customerSearchQuery]);

	// Retry WebRTC connection
	const handleRetryConnection = useCallback(() => {
		setWebrtcCredentials(null);
		setWebrtcAttempted(false);
		resetWebRTCCredentialsCache();
	}, []);

	// Handle call initiation
	const handleStartCall = useCallback(async () => {
		if (!companyId) {
			toast.error("No company selected. Please select a company to make calls.");
			return;
		}

		if (!(toNumber.trim() && fromNumber) || isPending) return;

		const normalizedTo = toNumber.replace(/\D/g, "");
		if (!normalizedTo) {
			toast.error("Please enter a valid phone number");
			return;
		}

		// WebRTC mode - browser audio
		if (connectionMode === "webrtc" && webrtc.isConnected) {
			try {
				await navigator.mediaDevices.getUserMedia({ audio: true });

				const call = await webrtc.makeCall(normalizedTo, fromNumber);

				const callingMessage = selectedCustomer
					? `Calling ${getCustomerFullName(selectedCustomer)}`
					: `Calling ${formatPhoneDisplay(toNumber)}`;
				toast.success(callingMessage);

				const params = new URLSearchParams({
					callId: call.id,
					companyId,
					...(selectedCustomer?.id && { customerId: selectedCustomer.id }),
					to: normalizedTo,
					from: fromNumber,
					direction: "outbound",
					mode: "webrtc",
				});

				window.open(`/call-window?${params.toString()}`, "_blank", "noopener,noreferrer");

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
			return;
		}

		// API mode - server-side calling
		startTransition(async () => {
			try {
				const result = await makeCall({
					to: normalizedTo,
					from: fromNumber,
					companyId,
					customerId: selectedCustomer?.id,
				});

				if (!result.success) {
					toast.error(result.error || "Failed to initiate call");
					return;
				}

				const callingMessage = selectedCustomer
					? `Calling ${getCustomerFullName(selectedCustomer)}`
					: `Calling ${formatPhoneDisplay(toNumber)}`;
				toast.success(callingMessage);

				// Open call window to manage the call
				const params = new URLSearchParams({
					callControlId: result.callControlId || "",
					companyId,
					...(selectedCustomer?.id && { customerId: selectedCustomer.id }),
					to: normalizedTo,
					from: fromNumber,
					direction: "outbound",
					mode: "api",
				});

				window.open(`/call-window?${params.toString()}`, "_blank", "noopener,noreferrer");

				setOpen(false);
				setToNumber("");
				setSelectedCustomer(null);
			} catch {
				toast.error("Failed to initiate call. Please try again.");
			}
		});
	}, [
		companyId,
		toNumber,
		fromNumber,
		isPending,
		connectionMode,
		webrtc,
		selectedCustomer,
		toast,
	]);

	// Check if call button should be enabled
	const canCall = Boolean(
		toNumber.trim() &&
			fromNumber &&
			companyPhones.length > 0 &&
			(connectionMode === "webrtc" || connectionMode === "api") &&
			!isConnecting,
	);

	const hasIncomingCalls = displayCount > 0;

	// SSR placeholder
	if (!mounted) {
		return (
			<div className="relative">
				<button
					className="hover-gradient hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-ring/50 flex h-8 w-8 items-center justify-center rounded-md border border-transparent transition-all outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
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
		<TooltipProvider delayDuration={200}>
			<DropdownMenu onOpenChange={handleOpenChange} open={open}>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<button
								className={cn(
									"hover-gradient hover:border-primary/20 hover:bg-primary/10 hover:text-primary",
									"focus-visible:ring-ring/50 relative flex h-8 w-8 items-center justify-center",
									"rounded-md border border-transparent transition-all outline-none focus-visible:ring-2",
									"disabled:pointer-events-none disabled:opacity-50",
									hasIncomingCalls && "text-primary animate-pulse",
								)}
								title={hasIncomingCalls ? "Incoming Call" : "Phone Dialer"}
								type="button"
							>
								{hasIncomingCalls ? (
									<PhoneIncoming className="size-4" />
								) : (
									<Phone className="size-4" />
								)}
								<span className="sr-only">Phone Dialer</span>
								{hasIncomingCalls && (
									<Badge
										className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px] font-semibold"
										variant="destructive"
									>
										{displayCount > 9 ? "9+" : displayCount}
									</Badge>
								)}
							</button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>{hasIncomingCalls ? "Incoming Call" : "Make a Call"}</p>
					</TooltipContent>
				</Tooltip>

				<DropdownMenuContent align="end" className="w-80 rounded-lg p-0">
					<div className="space-y-3 p-4">
						{/* Header */}
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<PhoneCall className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="text-sm font-semibold">Make a Call</h3>
								<p className="text-muted-foreground text-xs">
									{connectionMode === "webrtc"
										? "Browser audio calling"
										: connectionMode === "api"
											? "Server-side calling"
											: "Connecting..."}
								</p>
							</div>
						</div>

						{/* Connection Status */}
						<ConnectionStatusBadge
							mode={connectionMode}
							isConnecting={isConnecting}
							error={webrtc.connectionError}
							onRetry={handleRetryConnection}
						/>

						{/* Incoming Call Alert */}
						{hasIncomingCalls && (
							<>
								<div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
									<PhoneIncoming className="h-5 w-5 animate-pulse text-destructive" />
									<div className="flex-1">
										<p className="text-sm font-semibold text-destructive">
											Incoming Call
										</p>
										<p className="text-xs text-destructive/80">
											{caller?.name || caller?.number || "Unknown"}
										</p>
									</div>
								</div>
								<DropdownMenuSeparator />
							</>
						)}

						{/* Customer Search */}
						<div className="space-y-1.5">
							<label className="text-muted-foreground text-xs font-medium">
								Customer (Optional)
							</label>
							<Popover open={customerSearchOpen} onOpenChange={setCustomerSearchOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-full justify-start text-left font-normal"
										disabled={customersLoading}
									>
										<User className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
										<span className="truncate">
											{selectedCustomer
												? getCustomerFullName(selectedCustomer)
												: "Search customers..."}
										</span>
										{selectedCustomer && (
											<X
												className="ml-auto h-4 w-4 shrink-0 text-muted-foreground hover:text-foreground"
												onClick={(e) => {
													e.stopPropagation();
													handleCustomerSelect(null);
												}}
											/>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent align="start" className="w-80 p-0">
									<Command shouldFilter={false}>
										<CommandInput
											placeholder="Search by name, phone, email..."
											value={customerSearchQuery}
											onValueChange={setCustomerSearchQuery}
										/>
										<CommandList className="max-h-[250px]">
											<CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
												No customers found
											</CommandEmpty>
											<CommandGroup>
												{displayedCustomers.map((customer) => (
													<CommandItem
														key={customer.id}
														value={customer.id}
														onSelect={() => handleCustomerSelect(customer)}
														className="cursor-pointer px-3 py-2"
													>
														<div className="flex flex-1 flex-col gap-0.5">
															<span className="text-sm font-medium">
																{getCustomerFullName(customer)}
															</span>
															{customer.phone && (
																<span className="text-xs text-muted-foreground">
																	{formatPhoneDisplay(customer.phone)}
																</span>
															)}
														</div>
														{selectedCustomer?.id === customer.id && (
															<Check className="h-4 w-4 text-primary" />
														)}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>

						{/* To Number */}
						<div className="space-y-1.5">
							<label className="text-muted-foreground text-xs font-medium" htmlFor="to-number">
								To
							</label>
							<Input
								id="to-number"
								placeholder="+1 (555) 123-4567"
								value={toNumber}
								onChange={(e) => setToNumber(e.target.value)}
								disabled={isPending}
								className="h-9"
							/>
						</div>

						{/* From Number */}
						<div className="space-y-1.5">
							<label className="text-muted-foreground text-xs font-medium" htmlFor="from-number">
								From
							</label>
							<Select
								value={fromNumber}
								onValueChange={setFromNumber}
								disabled={companyPhones.length === 0 || isPending}
							>
								<SelectTrigger id="from-number" className="h-9">
									<SelectValue placeholder="Select company line" />
								</SelectTrigger>
								<SelectContent>
									{companyPhones.map((phone) => (
										<SelectItem key={phone.id} value={phone.number}>
											{phone.label || formatPhoneDisplay(phone.number)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{companyPhones.length === 0 && (
								<p className="text-muted-foreground text-xs">
									No company phone numbers configured
								</p>
							)}
						</div>

						{/* Call Button */}
						<Button
							className="w-full"
							disabled={!canCall || isPending}
							onClick={handleStartCall}
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Starting Call...
								</>
							) : (
								<>
									<PhoneOutgoing className="mr-2 h-4 w-4" />
									{connectionMode === "webrtc" ? "Call with Browser Audio" : "Start Call"}
								</>
							)}
						</Button>

						{/* Quick Links */}
						<DropdownMenuSeparator />
						<div className="flex gap-2">
							<Link
								href="/dashboard/communication?filter=calls"
								className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								onClick={() => setOpen(false)}
							>
								<Clock className="h-3.5 w-3.5" />
								Call History
							</Link>
							<Link
								href="/dashboard/communication"
								className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								onClick={() => setOpen(false)}
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
