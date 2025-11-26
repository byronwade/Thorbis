"use client";

/**
 * CustomerAutocomplete Component
 *
 * Reusable autocomplete for customer selection in forms.
 * Features:
 * - Instant search with debouncing
 * - Shows customer details (email, phone, company)
 * - Recent customers quick access
 * - Create new customer option
 * - react-hook-form compatible
 * - Keyboard navigation (arrows, enter, escape)
 */

import {
	Building2,
	Check,
	ChevronDown,
	ChevronsUpDown,
	Clock,
	Loader2,
	Mail,
	Phone,
	Plus,
	Search,
	User,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { searchCustomers } from "@/actions/customers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
	type CustomerDisplayData,
	getCustomerDisplayName,
	getCustomerInitials,
} from "@/lib/utils/customer-display";

export type CustomerOption = {
	id: string;
	display_name?: string | null;
	first_name?: string | null;
	last_name?: string | null;
	company_name?: string | null;
	email?: string | null;
	phone?: string | null;
};

interface CustomerAutocompleteProps {
	/** Selected customer ID */
	value?: string | null;
	/** Callback when customer is selected */
	onChange: (
		customerId: string | null,
		customer: CustomerOption | null,
	) => void;
	/** Optional placeholder text */
	placeholder?: string;
	/** Optional className for styling */
	className?: string;
	/** Show recent customers section */
	showRecent?: boolean;
	/** Optional recent customers list */
	recentCustomers?: CustomerOption[];
	/** Show "Create New Customer" option */
	showCreateNew?: boolean;
	/** Callback when "Create New Customer" is clicked */
	onCreateNew?: () => void;
	/** Disabled state */
	disabled?: boolean;
	/** Optional label */
	label?: string;
	/** Show error state */
	error?: boolean;
	/** Error message */
	errorMessage?: string;
}

export function CustomerAutocomplete({
	value,
	onChange,
	placeholder = "Search for customer...",
	className,
	showRecent = true,
	recentCustomers = [],
	showCreateNew = true,
	onCreateNew,
	disabled = false,
	label,
	error = false,
	errorMessage,
}: CustomerAutocompleteProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [customers, setCustomers] = useState<CustomerOption[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedCustomer, setSelectedCustomer] =
		useState<CustomerOption | null>(null);

	// Debounced search
	useEffect(() => {
		if (search.trim().length < 2) {
			setCustomers([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		const timeoutId = setTimeout(async () => {
			try {
				const result = await searchCustomers(search, { limit: 10 });
				if (result.success && result.data) {
					const customerArray = Array.isArray(result.data)
						? result.data
						: [result.data];
					setCustomers(customerArray as CustomerOption[]);
				} else {
					setCustomers([]);
				}
			} catch (error) {
				console.error("Customer search error:", error);
				setCustomers([]);
			} finally {
				setLoading(false);
			}
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [search]);

	// Handle customer selection
	const handleSelectCustomer = useCallback(
		(customer: CustomerOption) => {
			setSelectedCustomer(customer);
			onChange(customer.id, customer);
			setOpen(false);
			setSearch("");
		},
		[onChange],
	);

	// Clear selection
	const handleClear = useCallback(() => {
		setSelectedCustomer(null);
		onChange(null, null);
		setSearch("");
	}, [onChange]);

	// Get display name for selected customer
	const displayName = selectedCustomer
		? getCustomerDisplayName(selectedCustomer)
		: placeholder;

	// Combine recent and search results (deduplicate by ID)
	const allCustomers = useMemo(() => {
		const customerMap = new Map<string, CustomerOption>();

		// Add search results first (higher priority)
		customers.forEach((c) => customerMap.set(c.id, c));

		// Add recent customers if no search
		if (search.trim().length < 2 && showRecent) {
			recentCustomers.forEach((c) => customerMap.set(c.id, c));
		}

		return Array.from(customerMap.values());
	}, [customers, recentCustomers, search, showRecent]);

	// Customer list item component
	const CustomerListItem = ({ customer }: { customer: CustomerOption }) => {
		const name = getCustomerDisplayName(customer);
		const initials = getCustomerInitials(customer);
		const isSelected = value === customer.id;

		return (
			<CommandItem
				key={customer.id}
				value={customer.id}
				onSelect={() => handleSelectCustomer(customer)}
				className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
			>
				<Avatar className="h-8 w-8 shrink-0">
					<AvatarFallback className="text-xs font-semibold">
						{initials}
					</AvatarFallback>
				</Avatar>

				<div className="flex-1 min-w-0">
					<p className="font-medium text-sm truncate">{name}</p>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						{customer.email && (
							<span className="flex items-center gap-1 truncate">
								<Mail className="h-3 w-3 shrink-0" />
								{customer.email}
							</span>
						)}
						{customer.phone && (
							<span className="flex items-center gap-1">
								<Phone className="h-3 w-3 shrink-0" />
								{customer.phone}
							</span>
						)}
					</div>
					{customer.company_name && (
						<p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
							<Building2 className="h-3 w-3 shrink-0" />
							{customer.company_name}
						</p>
					)}
				</div>

				{isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
			</CommandItem>
		);
	};

	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			{label && (
				<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
					{label}
				</label>
			)}

			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						disabled={disabled}
						className={cn(
							"w-full justify-between",
							!selectedCustomer && "text-muted-foreground",
							error && "border-destructive focus-visible:ring-destructive",
						)}
					>
						<span className="flex items-center gap-2 truncate">
							{selectedCustomer ? (
								<>
									<User className="h-4 w-4 shrink-0" />
									<span className="truncate">{displayName}</span>
								</>
							) : (
								<>
									<Search className="h-4 w-4 shrink-0" />
									<span>{placeholder}</span>
								</>
							)}
						</span>
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>

				<PopoverContent className="w-[400px] p-0" align="start">
					<Command shouldFilter={false}>
						<CommandInput
							placeholder="Search customers..."
							value={search}
							onValueChange={setSearch}
						/>

						<CommandList>
							{loading ? (
								<div className="flex items-center justify-center py-6">
									<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
								</div>
							) : (
								<>
									{/* Search Results / All Customers */}
									{allCustomers.length > 0 ? (
										<CommandGroup
											heading={
												search.trim().length >= 2
													? "Search Results"
													: showRecent && recentCustomers.length > 0
														? "Recent Customers"
														: "All Customers"
											}
										>
											<ScrollArea className="max-h-[300px]">
												{allCustomers.map((customer) => (
													<CustomerListItem
														key={customer.id}
														customer={customer}
													/>
												))}
											</ScrollArea>
										</CommandGroup>
									) : search.trim().length >= 2 ? (
										<CommandEmpty>No customers found.</CommandEmpty>
									) : showRecent && recentCustomers.length === 0 ? (
										<CommandEmpty>
											Start typing to search for customers...
										</CommandEmpty>
									) : null}

									{/* Create New Customer */}
									{showCreateNew && onCreateNew && (
										<>
											<CommandSeparator />
											<CommandGroup>
												<CommandItem
													onSelect={() => {
														setOpen(false);
														onCreateNew();
													}}
													className="flex items-center gap-2 px-3 py-2.5 cursor-pointer text-primary"
												>
													<Plus className="h-4 w-4" />
													<span className="font-medium">
														Create New Customer
													</span>
												</CommandItem>
											</CommandGroup>
										</>
									)}
								</>
							)}
						</CommandList>

						{/* Clear Selection */}
						{selectedCustomer && !disabled && (
							<div className="border-t p-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={handleClear}
									className="w-full text-muted-foreground hover:text-destructive"
								>
									Clear Selection
								</Button>
							</div>
						)}
					</Command>
				</PopoverContent>
			</Popover>

			{error && errorMessage && (
				<p className="text-sm text-destructive">{errorMessage}</p>
			)}
		</div>
	);
}
