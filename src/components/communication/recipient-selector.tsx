/**
 * Recipient Selector - Command menu for selecting email/SMS recipients
 * 
 * Features:
 * - Search customers by name, email, phone
 * - Search vendors by name, email, phone
 * - Enter custom email or phone number
 * - Opens composer with selected recipient
 */

"use client";

import { searchCustomers } from "@/actions/customers";
import { searchVendors } from "@/actions/vendors";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCommunicationStore } from "@/lib/stores/communication-store";
import { cn } from "@/lib/utils";
import { AtSign, Building2, Loader2, Mail, MessageSquare, Phone, User } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";

type RecipientType = "email" | "sms";

type Customer = {
	id: string;
	display_name: string;
	email?: string | null;
	phone?: string | null;
	company_name?: string | null;
};

type Vendor = {
	id: string;
	name: string;
	display_name?: string | null;
	email?: string | null;
	phone?: string | null;
};

type RecipientOption = 
	| { type: "customer"; data: Customer }
	| { type: "vendor"; data: Vendor }
	| { type: "custom-email"; email: string }
	| { type: "custom-phone"; phone: string };

type RecipientSelectorProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	recipientType: RecipientType;
};

export function RecipientSelector({
	open,
	onOpenChange,
	recipientType,
}: RecipientSelectorProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [customInput, setCustomInput] = useState("");
	const [customInputMode, setCustomInputMode] = useState<"email" | "phone" | null>(null);
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [vendors, setVendors] = useState<Vendor[]>([]);
	const [loading, setLoading] = useState(false);
	const [isPending, startTransition] = useTransition();
	const openComposer = useCommunicationStore((state) => state.openComposer);

	// Search customers and vendors
	useEffect(() => {
		// Don't search if in custom input mode (user is typing email/phone directly)
		if (!open || customInputMode !== null) {
			if (!open) {
				setCustomers([]);
				setVendors([]);
			}
			return;
		}

		if (searchQuery.trim().length < 2) {
			setCustomers([]);
			setVendors([]);
			return;
		}

		const searchTimeout = setTimeout(() => {
			setLoading(true);
			startTransition(async () => {
				try {
					// Search customers
					const customersResult = await searchCustomers(searchQuery, { limit: 20 });
					
					// Handle ActionResult structure: { success: boolean, data?: T, error?: string }
					// Also handle direct array returns (for backward compatibility)
					let customerArray: any[] = [];
					
					if (customersResult.success && customersResult.data) {
						customerArray = Array.isArray(customersResult.data) 
							? customersResult.data 
							: [customersResult.data];
					} else if (Array.isArray(customersResult)) {
						// Handle case where result is directly an array
						customerArray = customersResult;
					} else if (customersResult.error) {
						console.warn("Customer search failed:", customersResult.error);
						setCustomers([]);
						return;
					}
					
					if (customerArray.length > 0) {
						// Map to Customer type - handle different data structures
						const customerData = customerArray.map((c: any) => ({
							id: c.id,
							display_name: c.display_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Customer",
							email: c.email || null,
							phone: c.phone || c.primary_phone || null,
							company_name: c.company_name || null,
						}));
						setCustomers(customerData);
					} else {
						setCustomers([]);
					}

					// Search vendors
					const vendorsResult = await searchVendors(searchQuery);
					
					// Handle ActionResult structure: { success: boolean, data?: T, error?: string }
					if (vendorsResult.success) {
						const vendorArray = Array.isArray(vendorsResult.data) 
							? vendorsResult.data 
							: vendorsResult.data 
								? [vendorsResult.data] 
								: [];
						
						if (vendorArray.length > 0) {
							// Map to Vendor type
							const vendorData = vendorArray.map((v: any) => ({
								id: v.id,
								name: v.name,
								display_name: v.display_name || v.name,
								email: v.email,
								phone: v.phone,
							}));
							setVendors(vendorData);
						} else {
							setVendors([]);
						}
					} else {
						console.warn("Vendor search failed:", vendorsResult.error || "Unknown error");
						setVendors([]);
					}
				} catch (error) {
					console.error("Error searching recipients:", error);
					setCustomers([]);
					setVendors([]);
				} finally {
					setLoading(false);
				}
			});
		}, 300);

		return () => clearTimeout(searchTimeout);
	}, [searchQuery, open, customInputMode]);

	const handleSelectRecipient = useCallback((option: RecipientOption) => {
		if (option.type === "customer") {
			const customer = option.data;
			const email = customer.email || "";
			const phone = customer.phone || "";
			const name = customer.display_name || "Customer";

			if (recipientType === "email" && email) {
				openComposer("email", {
					customerId: customer.id,
					customerName: name,
					email,
				});
			} else if (recipientType === "sms" && phone) {
				openComposer("sms", {
					customerId: customer.id,
					customerName: name,
					phone,
				});
			}
		} else if (option.type === "vendor") {
			const vendor = option.data;
			const email = vendor.email || "";
			const phone = vendor.phone || "";
			const name = vendor.display_name || vendor.name || "Vendor";

			if (recipientType === "email" && email) {
				openComposer("email", {
					customerName: name,
					email,
				});
			} else if (recipientType === "sms" && phone) {
				openComposer("sms", {
					customerName: name,
					phone,
				});
			}
		} else if (option.type === "custom-email") {
			openComposer("email", {
				customerName: option.email,
				email: option.email,
			});
		} else if (option.type === "custom-phone") {
			openComposer("sms", {
				customerName: option.phone,
				phone: option.phone,
			});
		}

		onOpenChange(false);
		// Reset state after a short delay to allow dialog to close
		setTimeout(() => {
			setSearchQuery("");
			setCustomInput("");
			setCustomInputMode(null);
			setCustomers([]);
			setVendors([]);
		}, 200);
	}, [recipientType, openComposer, onOpenChange]);

	// Reset when dialog closes
	useEffect(() => {
		if (!open) {
			setSearchQuery("");
			setCustomInput("");
			setCustomInputMode(null);
			setCustomers([]);
			setVendors([]);
		}
	}, [open]);

	const handleCustomInput = useCallback(() => {
		if (!customInput.trim()) return;

		if (customInputMode === "email") {
			// Validate email
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(customInput.trim())) {
				return;
			}
			handleSelectRecipient({ type: "custom-email", email: customInput.trim() });
		} else if (customInputMode === "phone") {
			// Basic phone validation (at least 10 digits)
			const phoneDigits = customInput.replace(/\D/g, "");
			if (phoneDigits.length < 10) {
				return;
			}
			handleSelectRecipient({ type: "custom-phone", phone: customInput.trim() });
		}
	}, [customInput, customInputMode, handleSelectRecipient]);

	const isValidEmail = customInput.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) !== null;
	const isValidPhone = customInput.replace(/\D/g, "").length >= 10;

	const hasResults = customers.length > 0 || vendors.length > 0;
	const showCustomOptions = (searchQuery.trim().length >= 2 || customInputMode !== null) && !loading;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>
						{recipientType === "email" ? "Send Email To" : "Send Text To"}
					</DialogTitle>
					<DialogDescription>
						Search for a customer or vendor, or enter a custom {recipientType === "email" ? "email address" : "phone number"}
					</DialogDescription>
				</DialogHeader>
				<Command className="rounded-lg border shadow-md" shouldFilter={false}>
					<CommandInput
						placeholder={`Search customers, vendors, or enter ${recipientType === "email" ? "email" : "phone number"}...`}
						value={customInputMode ? customInput : searchQuery}
						onValueChange={(value) => {
						if (customInputMode) {
							// User is in custom input mode, update custom input
							setCustomInput(value);
						} else {
							// Check if user has typed a VALID complete email or phone
							// Only switch to custom mode if it's actually valid
							const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
							const isValidEmail = emailRegex.test(value.trim());
							const phoneDigits = value.replace(/\D/g, "");
							const isValidPhone = phoneDigits.length >= 10;
							
							// Be conservative - only switch to custom mode for VALID inputs
							// This prevents switching mode while typing customer names
							if (isValidEmail && recipientType === "email") {
								// Valid complete email address
								setCustomInputMode("email");
								setCustomInput(value);
								setSearchQuery(""); // Clear search query
							} else if (isValidPhone && recipientType === "sms" && !value.includes("@")) {
								// Valid phone number (10+ digits, no @ symbol)
								setCustomInputMode("phone");
								setCustomInput(value);
								setSearchQuery(""); // Clear search query
							} else {
								// Normal search mode - keep searching
								setSearchQuery(value);
								setCustomInputMode(null);
								setCustomInput("");
							}
						}
					}}
						onKeyDown={(e) => {
							// Handle Enter key to submit custom email/phone
							if (e.key === "Enter") {
								e.preventDefault();
								if (customInputMode === "email" && isValidEmail) {
									handleSelectRecipient({ type: "custom-email", email: customInput.trim() });
								} else if (customInputMode === "phone" && isValidPhone) {
									handleSelectRecipient({ type: "custom-phone", phone: customInput.trim() });
								} else if (!customInputMode && searchQuery.trim().length >= 2) {
									// If typing an email-like string, try to use it as email
									if (recipientType === "email" && searchQuery.includes("@") && searchQuery.includes(".")) {
										const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
										if (emailRegex.test(searchQuery.trim())) {
											handleSelectRecipient({ type: "custom-email", email: searchQuery.trim() });
										}
									} else if (recipientType === "sms") {
										const phoneDigits = searchQuery.replace(/\D/g, "");
										if (phoneDigits.length >= 10) {
											handleSelectRecipient({ type: "custom-phone", phone: searchQuery.trim() });
										}
									}
								}
							}
						}}
					/>
					<CommandList>
						{loading && (
							<div className="flex items-center justify-center py-6">
								<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
								<span className="ml-2 text-sm text-muted-foreground">Searching...</span>
							</div>
						)}
						{!loading && !hasResults && !showCustomOptions && searchQuery.trim().length >= 2 && (
							<CommandEmpty>
								<div className="flex flex-col items-center justify-center py-8 text-center">
									<User className="h-8 w-8 text-muted-foreground mb-2" />
									<p className="text-sm font-medium">No results found</p>
									<p className="text-xs text-muted-foreground mt-1">
										Try a different search term or enter a custom {recipientType === "email" ? "email address" : "phone number"}
									</p>
								</div>
							</CommandEmpty>
						)}
						{!loading && !hasResults && !showCustomOptions && searchQuery.trim().length === 0 && (
							<CommandEmpty>
								<div className="flex flex-col items-center justify-center py-8 text-center">
									<Mail className="h-8 w-8 text-muted-foreground mb-2" />
									<p className="text-sm font-medium">Start typing to search</p>
									<p className="text-xs text-muted-foreground mt-1">
										Search for customers or vendors, or type an {recipientType === "email" ? "email address" : "phone number"} directly
									</p>
								</div>
							</CommandEmpty>
						)}
						
						{/* Custom Input Options */}
						{showCustomOptions && (
							<CommandGroup heading="Custom">
								{customInputMode === "email" && (
									<CommandItem
										onSelect={() => {
											if (isValidEmail) {
												handleSelectRecipient({ type: "custom-email", email: customInput.trim() });
											}
										}}
										disabled={!isValidEmail}
										className={cn(
											"flex items-center gap-2 cursor-pointer",
											!isValidEmail && "opacity-50 cursor-not-allowed"
										)}
									>
										<AtSign className="h-4 w-4" />
										<span className="flex-1">Send to {customInput.trim() || "email address"}</span>
										{isValidEmail && (
											<Badge variant="default" className="text-xs">
												Press Enter
											</Badge>
										)}
										{!isValidEmail && customInput.trim().length > 0 && (
											<Badge variant="outline" className="text-xs">
												Invalid email
											</Badge>
										)}
									</CommandItem>
								)}
								{customInputMode === "phone" && (
									<CommandItem
										onSelect={() => {
											if (isValidPhone) {
												handleSelectRecipient({ type: "custom-phone", phone: customInput.trim() });
											}
										}}
										disabled={!isValidPhone}
										className={cn(
											"flex items-center gap-2 cursor-pointer",
											!isValidPhone && "opacity-50 cursor-not-allowed"
										)}
									>
										<Phone className="h-4 w-4" />
										<span className="flex-1">Send to {customInput.trim() || "phone number"}</span>
										{isValidPhone && (
											<Badge variant="default" className="text-xs">
												Press Enter
											</Badge>
										)}
										{!isValidPhone && customInput.trim().length > 0 && (
											<Badge variant="outline" className="text-xs">
												Invalid phone
											</Badge>
										)}
									</CommandItem>
								)}
								{!customInputMode && searchQuery.trim().length >= 2 && recipientType === "email" && (
									<CommandItem
										onSelect={() => {
											setCustomInputMode("email");
											setCustomInput(searchQuery);
											setSearchQuery("");
										}}
										className="flex items-center gap-2"
									>
										<AtSign className="h-4 w-4" />
										<span>Use "{searchQuery}" as email address</span>
									</CommandItem>
								)}
								{!customInputMode && searchQuery.trim().length >= 2 && recipientType === "sms" && (
									<CommandItem
										onSelect={() => {
											setCustomInputMode("phone");
											setCustomInput(searchQuery);
											setSearchQuery("");
										}}
										className="flex items-center gap-2"
									>
										<Phone className="h-4 w-4" />
										<span>Use "{searchQuery}" as phone number</span>
									</CommandItem>
								)}
							</CommandGroup>
						)}

						{/* Customers */}
						{customers.length > 0 && (
							<CommandGroup heading="Customers">
								{customers.map((customer) => {
									const hasEmail = !!customer.email;
									const hasPhone = !!customer.phone;
									const canUse = recipientType === "email" ? hasEmail : hasPhone;

									return (
										<CommandItem
											key={customer.id}
											onSelect={() => {
												if (canUse) {
													handleSelectRecipient({ type: "customer", data: customer });
												}
											}}
											disabled={!canUse}
											className={cn(
												"flex items-center gap-3",
												!canUse && "opacity-50 cursor-not-allowed"
											)}
										>
											<Avatar className="h-8 w-8">
												<AvatarFallback>
													{customer.display_name
														.split(" ")
														.map((n) => n[0])
														.join("")
														.toUpperCase()
														.slice(0, 2)}
												</AvatarFallback>
											</Avatar>
											<div className="flex flex-1 flex-col">
												<span className="font-medium">{customer.display_name}</span>
												<div className="flex items-center gap-2 text-xs text-muted-foreground">
													{customer.email && (
														<span className="flex items-center gap-1">
															<Mail className="h-3 w-3" />
															{customer.email}
														</span>
													)}
													{customer.phone && (
														<span className="flex items-center gap-1">
															<Phone className="h-3 w-3" />
															{customer.phone}
														</span>
													)}
													{!canUse && (
														<Badge variant="outline" className="text-xs">
															No {recipientType === "email" ? "email" : "phone"}
														</Badge>
													)}
												</div>
											</div>
											{canUse && (
												recipientType === "email" ? (
													<Mail className="h-4 w-4 text-muted-foreground" />
												) : (
													<MessageSquare className="h-4 w-4 text-muted-foreground" />
												)
											)}
										</CommandItem>
									);
								})}
							</CommandGroup>
						)}

						{/* Vendors */}
						{vendors.length > 0 && (
							<CommandGroup heading="Vendors">
								{vendors.map((vendor) => {
									const hasEmail = !!vendor.email;
									const hasPhone = !!vendor.phone;
									const canUse = recipientType === "email" ? hasEmail : hasPhone;

									if (!canUse) return null;

									return (
										<CommandItem
											key={vendor.id}
											onSelect={() => handleSelectRecipient({ type: "vendor", data: vendor })}
											className="flex items-center gap-3"
										>
											<Avatar className="h-8 w-8">
												<AvatarFallback>
													<Building2 className="h-4 w-4" />
												</AvatarFallback>
											</Avatar>
											<div className="flex flex-1 flex-col">
												<span className="font-medium">{vendor.display_name || vendor.name}</span>
												<div className="flex items-center gap-2 text-xs text-muted-foreground">
													{vendor.email && (
														<span className="flex items-center gap-1">
															<Mail className="h-3 w-3" />
															{vendor.email}
														</span>
													)}
													{vendor.phone && (
														<span className="flex items-center gap-1">
															<Phone className="h-3 w-3" />
															{vendor.phone}
														</span>
													)}
												</div>
											</div>
											{recipientType === "email" ? (
												<Mail className="h-4 w-4 text-muted-foreground" />
											) : (
												<MessageSquare className="h-4 w-4 text-muted-foreground" />
											)}
										</CommandItem>
									);
								})}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</DialogContent>
		</Dialog>
	);
}

