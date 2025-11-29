"use client";

/**
 * PhoneDropdown - Enterprise Phone Dialer
 *
 * Full-featured dialer using Twilio API:
 * - Makes calls via Twilio API (server-side)
 * - Opens call window for call management
 * - Customer search and selection
 * - Company phone number selection
 *
 * All calls are initiated through the Twilio API and managed via the call window.
 */
import { makeCall } from "@/actions/twilio";
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
import { useToast } from "@/hooks/use-toast";
import { useDialerStore } from "@/lib/stores/dialer-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";
import {
    Check,
    Clock,
    Loader2,
    MessageSquare,
    Phone,
    PhoneCall,
    PhoneIncoming,
    PhoneOutgoing,
    Server,
    User,
    X
} from "lucide-react";
import Link from "next/link";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    useTransition
} from "react";

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

// Helper functions
const cleanValue = (v?: string | null) => (v ?? "").trim();

const getCustomerName = (c: Customer) => {
	if (c.display_name?.trim()) return c.display_name.trim();
	const name = [c.first_name, c.last_name]
		.map(cleanValue)
		.filter(Boolean)
		.join(" ");
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
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
		null,
	);
	const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
	const [customerSearchQuery, setCustomerSearchQuery] = useState("");

	// Call state from UI store
	const callStatus = useUIStore((s) => s.call.status);
	const caller = useUIStore((s) => s.call.caller);
	const hasIncomingCall = callStatus === "incoming";
	const displayCount = incomingCallsCount ?? (hasIncomingCall ? 1 : 0);

	// Mount
	useEffect(() => {
		setMounted(true);
	}, []);

	// Sync from number
	useEffect(() => {
		if (!fromNumber && companyPhones.length > 0) {
			setFromNumber(companyPhones[0].number);
		}
	}, [companyPhones, fromNumber]);

	// Sync dialer store
	useEffect(() => setOpen(dialerStore.isOpen), [dialerStore.isOpen]);
	useEffect(
		() => setToNumber(dialerStore.phoneNumber),
		[dialerStore.phoneNumber],
	);
	useEffect(() => {
		if (dialerStore.customerId && customers.length > 0) {
			const c = customers.find((x) => x.id === dialerStore.customerId);
			if (c && c.id !== selectedCustomer?.id) setSelectedCustomer(c);
		}
	}, [dialerStore.customerId, customers, selectedCustomer?.id]);







	// Handlers
	const handleOpenChange = useCallback(
		(newOpen: boolean) => {
			setOpen(newOpen);
			if (newOpen) {
				dialerStore.openDialer();
			} else {
				dialerStore.closeDialer();
				setToNumber("");
				setSelectedCustomer(null);
				setCustomerSearchQuery("");
			}
		},
		[dialerStore],
	);

	const handleCustomerSelect = useCallback((c: Customer | null) => {
		setSelectedCustomer(c);
		if (c?.phone) setToNumber(c.phone);
		setCustomerSearchQuery("");
		setCustomerSearchOpen(false);
	}, []);



	// Filter customers
	const filteredCustomers = useMemo(() => {
		const q = customerSearchQuery.trim().toLowerCase();
		if (!q) return customers.slice(0, 50);

		const qDigits = q.replace(/\D/g, "");
		return customers.filter((c) => {
			const searchable = [
				c.first_name,
				c.last_name,
				c.display_name,
				c.email,
				c.phone,
				c.secondary_phone,
				c.company_name,
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

	// Make call via API (used for fallback and API mode)
	const handleAPICall = useCallback(async () => {
		if (isPending) return;

		if (!companyId) {
			toast.error("No company selected. Please select a company first.");
			return;
		}

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
						: `Calling ${formatPhone(toNumber)}`,
				);

				// Open call window
				const params = new URLSearchParams({
					callId: result.callSid || "",
					companyId,
					to,
					from: fromNumber,
					direction: "outbound",
					...(selectedCustomer?.id && { customerId: selectedCustomer.id }),
				});

				window.open(`/call?${params}`, "_blank", "noopener,noreferrer");

				// Reset
				handleOpenChange(false);
			} catch {
				toast.error("Failed to start call. Please try again.");
			}
		});
	}, [
		companyId,
		toNumber,
		fromNumber,
		selectedCustomer,
		isPending,
		toast,
		handleOpenChange,
	]);

	const handleStartCall = useCallback(() => {
		handleAPICall();
	}, [handleAPICall]);

	const canCall = Boolean(
		toNumber.trim() && fromNumber && companyPhones.length > 0,
	);
	const hasActiveCall = false; // Calls are managed in the call window

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
									"focus-visible:ring-ring/50 relative inline-flex h-8 shrink-0 w-8 items-center justify-center rounded-md",
									"transition-all duration-150 outline-none focus-visible:ring-2",
									"disabled:pointer-events-none disabled:opacity-50",
									"text-muted-foreground hover:bg-muted/70 hover:text-foreground",
									hasIncomingCall && "animate-pulse text-primary",
									hasActiveCall && "text-success",
								)}
								type="button"
							>
								{hasIncomingCall ? (
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
						{hasIncomingCall ? "Incoming Call" : "Make a Call"}
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
									<Badge variant="outline" className="gap-1 text-[10px]">
										<Server className="h-3 w-3" />
										Twilio API
									</Badge>
								</div>
							</div>
						</div>





						{/* Incoming call alert */}
						{hasIncomingCall && (
							<>
								<div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
									<PhoneIncoming className="h-5 w-5 shrink-0 animate-pulse text-destructive" />
									<div className="min-w-0 flex-1">
										<p className="text-sm font-semibold text-destructive">
											Incoming Call
										</p>
										<p className="truncate text-xs text-destructive/80">
											{caller?.name || caller?.number || "Unknown"}
										</p>
									</div>
								</div>
								<DropdownMenuSeparator />
							</>
						)}



						{/* Customer search */}
						{!hasActiveCall && (
							<>
								<div className="space-y-1.5">
									<label className="text-xs font-medium text-muted-foreground">
										Customer (optional)
									</label>
									<Popover
										open={customerSearchOpen}
										onOpenChange={setCustomerSearchOpen}
									>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className="h-9 w-full justify-start gap-2 px-3 font-normal"
												disabled={customersLoading}
											>
												<User className="h-4 w-4 shrink-0 text-muted-foreground" />
												<span className="min-w-0 flex-1 truncate text-left">
													{selectedCustomer
														? getCustomerName(selectedCustomer)
														: "Search..."}
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
										<PopoverContent
											align="start"
											className="w-80 p-0"
											sideOffset={4}
										>
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
									<label
										htmlFor="phone-to"
										className="text-xs font-medium text-muted-foreground"
									>
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
									<label
										htmlFor="phone-from"
										className="text-xs font-medium text-muted-foreground"
									>
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
								) : (
									<>
										<PhoneOutgoing className="h-4 w-4" />
										Call
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
