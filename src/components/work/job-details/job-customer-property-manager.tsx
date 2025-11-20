"use client";

import {
	Building2,
	Check,
	ChevronRight,
	ChevronsUpDown,
	Eye,
	LinkIcon,
	Mail,
	MapPin,
	Phone,
	Search,
	Unlink,
	User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Job Customer & Property Manager
 *
 * Advanced search and assignment component for managing customer and property relationships on jobs.
 *
 * Features:
 * - Full-text search across customers (name, email, phone, company, address)
 * - Automatic property loading when customer is selected
 * - Property search within selected customer
 * - Warning dialogs for removing customer/property
 * - Real-time validation (only 1 customer + properties per job)
 * - Server-side search with ranking
 */

type Customer = {
	id: string;
	first_name: string;
	last_name: string;
	display_name: string;
	email: string;
	phone: string;
	company_name?: string;
	type: "residential" | "commercial" | "industrial";
	address?: string;
	city?: string;
	state?: string;
	zip?: string;
};

type Property = {
	id: string;
	customer_id: string;
	address: string;
	address_line2?: string;
	city: string;
	state: string;
	zip: string;
	property_type?: string;
};

type JobCustomerPropertyManagerProps = {
	currentCustomer: Customer | null;
	currentProperty: Property | null;
	onAssignCustomer: (
		customer: Customer,
		property: Property | null,
	) => Promise<void>;
	onRemoveCustomer: () => Promise<void>;
	onRemoveProperty: () => Promise<void>;
	searchCustomers: (query: string) => Promise<Customer[]>;
	getCustomerProperties: (customerId: string) => Promise<Property[]>;
};

export function JobCustomerPropertyManager({
	currentCustomer,
	currentProperty,
	onAssignCustomer,
	onRemoveCustomer,
	onRemoveProperty,
	searchCustomers,
	getCustomerProperties,
}: JobCustomerPropertyManagerProps) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searching, setSearching] = useState(false);
	const [searchResults, setSearchResults] = useState<Customer[]>([]);
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
		null,
	);
	const [customerProperties, setCustomerProperties] = useState<Property[]>([]);
	const [selectedProperty, setSelectedProperty] = useState<Property | null>(
		null,
	);
	const [loadingProperties, setLoadingProperties] = useState(false);
	const [showRemoveCustomerDialog, setShowRemoveCustomerDialog] =
		useState(false);
	const [showRemovePropertyDialog, setShowRemovePropertyDialog] =
		useState(false);
	const [isAssigning, setIsAssigning] = useState(false);

	// Search customers with debounce
	useEffect(() => {
		if (!searchQuery || searchQuery.length < 2) {
			setSearchResults([]);
			return;
		}

		const timer = setTimeout(async () => {
			setSearching(true);
			try {
				const results = await searchCustomers(searchQuery);
				setSearchResults(results);
			} catch (error) {
				console.error("Error searching customers:", error);
				setSearchResults([]);
			} finally {
				setSearching(false);
			}
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery, searchCustomers]);

	// Load properties when customer is selected
	useEffect(() => {
		if (!selectedCustomer) {
			setCustomerProperties([]);
			setSelectedProperty(null);
			return;
		}

		async function loadProperties() {
			setLoadingProperties(true);
			try {
				const properties = await getCustomerProperties(selectedCustomer.id);
				setCustomerProperties(properties);

				// Auto-select if only one property
				if (properties.length === 1) {
					setSelectedProperty(properties[0]);
				}
			} catch (error) {
				console.error("Error loading properties:", error);
				setCustomerProperties([]);
			} finally {
				setLoadingProperties(false);
			}
		}

		loadProperties();
	}, [selectedCustomer, getCustomerProperties]);

	// Format customer display
	const formatCustomerDisplay = (customer: Customer) => {
		if (customer.company_name) {
			return `${customer.display_name} (${customer.company_name})`;
		}
		return customer.display_name;
	};

	// Format property display
	const formatPropertyDisplay = (property: Property) => {
		return `${property.address}${property.address_line2 ? ` ${property.address_line2}` : ""}, ${property.city}, ${property.state} ${property.zip}`;
	};

	// Handle customer selection
	const handleSelectCustomer = (customer: Customer) => {
		setSelectedCustomer(customer);
		setSearchQuery("");
	};

	// Handle assign button
	const handleAssign = async () => {
		if (!selectedCustomer) return;

		setIsAssigning(true);
		try {
			await onAssignCustomer(selectedCustomer, selectedProperty);
			setOpen(false);
			setSelectedCustomer(null);
			setSelectedProperty(null);
			setSearchQuery("");
		} catch (error) {
			console.error("Error assigning customer:", error);
		} finally {
			setIsAssigning(false);
		}
	};

	// Handle removal flows
	const handleRemoveCustomer = async () => {
		try {
			await onRemoveCustomer();
			setShowRemoveCustomerDialog(false);
		} catch (error) {
			console.error("Error removing customer:", error);
		}
	};

	const handleRemoveProperty = async () => {
		try {
			await onRemoveProperty();
			setShowRemovePropertyDialog(false);
		} catch (error) {
			console.error("Error removing property:", error);
		}
	};

	const assignmentButton = (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger asChild>
				<Button
					className={cn(
						"justify-start transition-all",
						currentCustomer ? "px-3" : "w-full",
					)}
					size={currentCustomer ? "sm" : "default"}
					variant={currentCustomer ? "ghost" : "outline"}
				>
					{currentCustomer ? (
						<>
							<User className="mr-2 size-4" />
							<span>Change</span>
						</>
					) : (
						<>
							<User className="text-muted-foreground mr-2 size-4" />
							<span>Assign Customer & Property</span>
							<ChevronsUpDown className="ml-auto size-4 opacity-50" />
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-[650px] p-0 shadow-xl">
				<div className="flex h-[550px] flex-col">
					{/* Header */}
					<div className="bg-muted/30 border-b p-4">
						<h3 className="mb-3 text-base font-semibold">
							Assign Customer & Property
						</h3>
						<div className="space-y-2">
							<div className="text-muted-foreground flex items-center gap-2 text-xs">
								<div className="flex items-center gap-1.5">
									<div className="bg-primary/20 text-primary flex size-5 items-center justify-center rounded-full text-[10px] font-bold">
										1
									</div>
									<span
										className={cn(
											selectedCustomer ? "text-primary font-medium" : "",
										)}
									>
										Select Customer
									</span>
								</div>
								<ChevronRight className="size-3" />
								<div className="flex items-center gap-1.5">
									<div
										className={cn(
											"flex size-5 items-center justify-center rounded-full text-[10px] font-bold",
											selectedCustomer
												? "bg-primary/20 text-primary"
												: "bg-muted text-muted-foreground",
										)}
									>
										2
									</div>
									<span
										className={cn(
											selectedCustomer
												? "text-primary font-medium"
												: "text-muted-foreground",
										)}
									>
										Choose Property
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Step 1: Customer Search */}
					<div className="bg-background border-b p-4">
						<div className="relative">
							<Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
							<input
								className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-11 w-full rounded-lg border px-10 py-2 text-sm transition-shadow file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search by name, email, phone, company, or address..."
								value={searchQuery}
							/>
							{searching && (
								<div className="absolute top-1/2 right-3 -translate-y-1/2">
									<div className="border-primary/30 border-t-primary size-4 animate-spin rounded-full border-2" />
								</div>
							)}
						</div>
					</div>

					{/* Search Results */}
					<div className="flex-1 overflow-y-auto">
						{selectedCustomer ? (
							<div className="bg-primary/5 border-b p-4">
								<div className="flex items-start gap-3">
									<div className="bg-primary/20 text-primary flex size-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold">
										{selectedCustomer.first_name?.[0]}
										{selectedCustomer.last_name?.[0]}
									</div>
									<div className="min-w-0 flex-1">
										<div className="mb-1 flex items-center gap-2">
											<div className="text-sm font-semibold">
												{formatCustomerDisplay(selectedCustomer)}
											</div>
											<Check className="text-primary size-4 flex-shrink-0" />
										</div>
										<div className="text-muted-foreground space-y-0.5 text-xs">
											{selectedCustomer.email && (
												<div className="truncate">{selectedCustomer.email}</div>
											)}
											{selectedCustomer.phone && (
												<div>{selectedCustomer.phone}</div>
											)}
										</div>
									</div>
									<Button
										onClick={() => setSelectedCustomer(null)}
										size="sm"
										variant="ghost"
									>
										Change
									</Button>
								</div>
							</div>
						) : searchQuery.length < 2 ? (
							<div className="flex h-full flex-col items-center justify-center p-8 text-center">
								<Search className="text-muted-foreground mb-3 size-10" />
								<p className="text-muted-foreground text-sm">
									Type at least 2 characters to search
								</p>
							</div>
						) : searchResults.length === 0 && !searching ? (
							<div className="flex h-full flex-col items-center justify-center p-8 text-center">
								<User className="text-muted-foreground mb-3 size-10" />
								<p className="text-muted-foreground text-sm">
									No customers found
								</p>
							</div>
						) : (
							<div className="divide-y">
								{searchResults.map((customer) => (
									<button
										className="hover:bg-muted/50 flex w-full items-start gap-3 p-4 text-left transition-all hover:shadow-sm"
										key={customer.id}
										onClick={() => handleSelectCustomer(customer)}
										type="button"
									>
										<div className="bg-muted/80 flex size-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold">
											{customer.first_name?.[0]}
											{customer.last_name?.[0]}
										</div>
										<div className="min-w-0 flex-1">
											<div className="mb-1 flex items-center gap-2">
												<div className="truncate text-sm font-medium">
													{formatCustomerDisplay(customer)}
												</div>
												<Badge
													className="flex-shrink-0 capitalize"
													variant="outline"
												>
													{customer.type}
												</Badge>
											</div>
											<div className="text-muted-foreground space-y-0.5 text-xs">
												{customer.email && (
													<div className="truncate">{customer.email}</div>
												)}
												{customer.phone && <div>{customer.phone}</div>}
												{customer.address && (
													<div className="truncate text-[11px]">
														{customer.address}, {customer.city},{" "}
														{customer.state}
													</div>
												)}
											</div>
										</div>
										<ChevronRight className="text-muted-foreground mt-2 size-4 flex-shrink-0" />
									</button>
								))}
							</div>
						)}
					</div>

					{/* Step 2: Property Selection */}
					{selectedCustomer && (
						<>
							<div className="bg-muted/30 border-t p-4">
								<div className="space-y-3">
									{loadingProperties ? (
										<div className="space-y-2">
											<Skeleton className="h-16 w-full" />
											<Skeleton className="h-16 w-full" />
										</div>
									) : customerProperties.length === 0 ? (
										<div className="bg-background rounded-lg border border-dashed p-6 text-center">
											<MapPin className="text-muted-foreground mx-auto mb-2 size-10" />
											<p className="text-muted-foreground mb-1 text-sm font-medium">
												No properties found
											</p>
											<p className="text-muted-foreground text-xs">
												You can still assign this customer without a property
											</p>
										</div>
									) : (
										<div className="max-h-[180px] space-y-2 overflow-y-auto pr-1">
											<p className="text-muted-foreground mb-2 text-xs font-medium">
												Select a property (optional)
											</p>
											{customerProperties.map((property) => (
												<button
													className={cn(
														"hover:bg-muted/80 flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all",
														selectedProperty?.id === property.id &&
															"border-primary bg-primary/10 shadow-sm",
													)}
													key={property.id}
													onClick={() => setSelectedProperty(property)}
													type="button"
												>
													<MapPin
														className={cn(
															"mt-0.5 size-4 flex-shrink-0",
															selectedProperty?.id === property.id
																? "text-primary"
																: "text-muted-foreground",
														)}
													/>
													<div className="min-w-0 flex-1 text-sm">
														<div className="truncate font-medium">
															{property.address}
														</div>
														{property.address_line2 && (
															<div className="text-muted-foreground truncate text-xs">
																{property.address_line2}
															</div>
														)}
														<div className="text-muted-foreground truncate text-xs">
															{property.city}, {property.state} {property.zip}
														</div>
													</div>
													{selectedProperty?.id === property.id && (
														<Check className="text-primary size-4 flex-shrink-0" />
													)}
												</button>
											))}
										</div>
									)}
								</div>
							</div>

							{/* Assign Button */}
							<div className="bg-background border-t p-4">
								<Button
									className="h-11 w-full text-base font-medium shadow-sm"
									disabled={isAssigning}
									onClick={handleAssign}
									size="lg"
								>
									{isAssigning ? (
										<>
											<div className="mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
											Assigning...
										</>
									) : (
										<>
											<Check className="mr-2 size-5" />
											Assign to Job
										</>
									)}
								</Button>
							</div>
						</>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);

	return (
		<div className="flex w-full gap-2">
			{currentCustomer ? (
				<div className="flex flex-1 gap-0">
					{/* Customer Info Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								className="flex-1 justify-start rounded-r-none border-r-0"
								size="default"
								variant="outline"
							>
								<User className="mr-2 size-4" />
								<span className="truncate font-medium">
									{formatCustomerDisplay(currentCustomer)}
								</span>
								<ChevronRight className="ml-auto size-4 opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-64">
							<DropdownMenuLabel className="font-normal">
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium leading-none">
										{formatCustomerDisplay(currentCustomer)}
									</p>
									{currentCustomer.type && (
										<Badge
											className="mt-1 w-fit capitalize"
											variant="secondary"
											size="sm"
										>
											{currentCustomer.type}
										</Badge>
									)}
									{currentCustomer.email && (
										<p className="text-muted-foreground text-xs">
											{currentCustomer.email}
										</p>
									)}
									{currentCustomer.phone && (
										<p className="text-muted-foreground text-xs">
											{currentCustomer.phone}
										</p>
									)}
								</div>
							</DropdownMenuLabel>
							{currentProperty && (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-xs font-medium text-muted-foreground">
												Property
											</p>
											<p className="text-sm font-medium leading-none">
												{currentProperty.address}
											</p>
											<p className="text-muted-foreground text-xs">
												{currentProperty.city}, {currentProperty.state}{" "}
												{currentProperty.zip}
											</p>
										</div>
									</DropdownMenuLabel>
								</>
							)}
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link
									href={`/dashboard/customers/${currentCustomer.id}`}
									className="cursor-pointer"
								>
									<Eye className="mr-2 size-4" />
									View Customer Profile
								</Link>
							</DropdownMenuItem>
							{currentProperty && (
								<DropdownMenuItem asChild>
									<Link
										href={`/dashboard/work/properties/${currentProperty.id}`}
										className="cursor-pointer"
									>
										<MapPin className="mr-2 size-4" />
										View Property Details
									</Link>
								</DropdownMenuItem>
							)}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onSelect={(event) => {
									event.preventDefault();
									setOpen(true);
								}}
							>
								<ChevronsUpDown className="mr-2 size-4" />
								Change Customer/Property
							</DropdownMenuItem>
							{currentProperty && (
								<DropdownMenuItem
									onSelect={(event) => {
										event.preventDefault();
										setShowRemovePropertyDialog(true);
									}}
								>
									<Unlink className="mr-2 size-4" />
									Unlink Property
								</DropdownMenuItem>
							)}
							<DropdownMenuItem
								className="text-destructive focus:text-destructive"
								onSelect={(event) => {
									event.preventDefault();
									setShowRemoveCustomerDialog(true);
								}}
							>
								<Unlink className="mr-2 size-4" />
								Unlink Customer
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Unlink Button */}
					<Button
						className="rounded-l-none px-3"
						size="default"
						variant="outline"
						onClick={() => setShowRemoveCustomerDialog(true)}
					>
						<Unlink className="size-4 text-destructive" />
					</Button>
				</div>
			) : (
				assignmentButton
			)}

			{/* Unlink dialogs */}
			<AlertDialog
				onOpenChange={setShowRemoveCustomerDialog}
				open={showRemoveCustomerDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Unlink Customer?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to unlink{" "}
							<strong>{currentCustomer?.display_name}</strong> from this job?
							<br />
							<br />
							This will also unlink any associated property. The customer and
							property records will remain in your system, but this job will no
							longer be associated with them.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleRemoveCustomer}>
							<Unlink className="mr-2 size-4" />
							Unlink Customer
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog
				onOpenChange={setShowRemovePropertyDialog}
				open={showRemovePropertyDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Unlink Property?</AlertDialogTitle>
						<AlertDialogDescription>
							This will unlink <strong>{currentProperty?.address}</strong> from
							this job. The customer will remain assigned. The property record
							will remain in your system.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleRemoveProperty}>
							<Unlink className="mr-2 size-4" />
							Unlink Property
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
