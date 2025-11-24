"use client";

import { searchCustomers } from "@/actions/customers";
import { searchVendors } from "@/actions/vendors";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
	Building2,
	ChevronRight,
	Loader2,
	Mail,
	Plus,
	Search,
	User,
	Users,
	X,
} from "lucide-react";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	useTransition,
} from "react";

export type Recipient = {
	id: string;
	type: "customer" | "vendor" | "team" | "custom";
	name: string;
	email: string;
};

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
};

type Suggestion = {
	id: string;
	type: "customer" | "vendor" | "team" | "custom";
	name: string;
	email: string;
	subtitle?: string;
};

type SuggestionGroup = {
	id: string;
	label: string;
	icon: React.ReactNode;
	action?: () => void;
	suggestions?: Suggestion[];
};

interface RecipientAutocompleteProps {
	value: Recipient[];
	onChange: (recipients: Recipient[]) => void;
	placeholder?: string;
	className?: string;
	/** Pre-populate recent/thread recipients */
	recentRecipients?: Recipient[];
}

export function RecipientAutocomplete({
	value,
	onChange,
	placeholder = "Search or type email...",
	className,
	recentRecipients = [],
}: RecipientAutocompleteProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [inputValue, setInputValue] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const [customers, setCustomers] = useState<Suggestion[]>([]);
	const [vendors, setVendors] = useState<Suggestion[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isPending, startTransition] = useTransition();

	// Filter out already selected recipients
	const selectedEmails = useMemo(
		() => new Set((value || []).map((r) => r.email.toLowerCase())),
		[value]
	);

	// Debounced search
	useEffect(() => {
		if (inputValue.trim().length < 2) {
			setCustomers([]);
			setVendors([]);
			return;
		}

		const timeoutId = setTimeout(() => {
			setLoading(true);
			startTransition(async () => {
				try {
					// Search customers
					const customersResult = await searchCustomers(inputValue, { limit: 5 });
					if (customersResult.success && customersResult.data) {
						const customerArray = Array.isArray(customersResult.data)
							? customersResult.data
							: [customersResult.data];

						const mapped = customerArray
							.filter((c: any) => c.email && !selectedEmails.has(c.email.toLowerCase()))
							.map((c: any) => ({
								id: c.id,
								type: "customer" as const,
								name:
									c.display_name ||
									`${c.first_name || ""} ${c.last_name || ""}`.trim() ||
									"Customer",
								email: c.email,
								subtitle: c.company_name || undefined,
							}));
						setCustomers(mapped);
					} else {
						setCustomers([]);
					}

					// Search vendors
					const vendorsResult = await searchVendors(inputValue);
					if (vendorsResult.success && vendorsResult.data) {
						const vendorArray = Array.isArray(vendorsResult.data)
							? vendorsResult.data
							: [vendorsResult.data];

						const mapped = vendorArray
							.filter((v: any) => v.email && !selectedEmails.has(v.email.toLowerCase()))
							.map((v: any) => ({
								id: v.id,
								type: "vendor" as const,
								name: v.display_name || v.name,
								email: v.email,
							}));
						setVendors(mapped);
					} else {
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
		}, 200);

		return () => clearTimeout(timeoutId);
	}, [inputValue, selectedEmails]);

	// Build suggestion groups
	const suggestionGroups = useMemo<SuggestionGroup[]>(() => {
		const groups: SuggestionGroup[] = [];

		// Custom email option (if valid email typed)
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isValidEmail = emailRegex.test(inputValue.trim());
		if (isValidEmail && !selectedEmails.has(inputValue.trim().toLowerCase())) {
			groups.push({
				id: "custom",
				label: "Add Email",
				icon: <Mail className="h-4 w-4" />,
				suggestions: [
					{
						id: `custom-${inputValue}`,
						type: "custom",
						name: inputValue.trim(),
						email: inputValue.trim(),
					},
				],
			});
		}

		// Recent/Thread recipients (from the email thread)
		const filteredRecent = recentRecipients.filter(
			(r) => !selectedEmails.has(r.email.toLowerCase())
		);
		if (filteredRecent.length > 0 && inputValue.trim().length < 2) {
			groups.push({
				id: "recent",
				label: "From this thread",
				icon: <Mail className="h-4 w-4" />,
				suggestions: filteredRecent.map((r) => ({
					id: r.id,
					type: r.type,
					name: r.name,
					email: r.email,
				})),
			});
		}

		// Customers
		if (customers.length > 0) {
			groups.push({
				id: "customers",
				label: "Customers",
				icon: <User className="h-4 w-4" />,
				suggestions: customers,
			});
		}

		// Vendors
		if (vendors.length > 0) {
			groups.push({
				id: "vendors",
				label: "Vendors",
				icon: <Building2 className="h-4 w-4" />,
				suggestions: vendors,
			});
		}

		return groups;
	}, [inputValue, customers, vendors, recentRecipients, selectedEmails]);

	// Flatten suggestions for keyboard navigation
	const flatSuggestions = useMemo(
		() => suggestionGroups.flatMap((g) => g.suggestions || []),
		[suggestionGroups]
	);

	const addRecipient = useCallback(
		(suggestion: Suggestion) => {
			const newRecipient: Recipient = {
				id: suggestion.id,
				type: suggestion.type,
				name: suggestion.name,
				email: suggestion.email,
			};

			if (!selectedEmails.has(newRecipient.email.toLowerCase())) {
				onChange([...value, newRecipient]);
			}

			setInputValue("");
			setCustomers([]);
			setVendors([]);
			inputRef.current?.focus();
		},
		[value, onChange, selectedEmails]
	);

	const removeRecipient = useCallback(
		(email: string) => {
			onChange((value || []).filter((r) => r.email !== email));
		},
		[value, onChange]
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			const recipients = value || [];
			if (e.key === "Backspace" && inputValue === "" && recipients.length > 0) {
				e.preventDefault();
				removeRecipient(recipients[recipients.length - 1].email);
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				setSelectedIndex((prev) => Math.min(prev + 1, flatSuggestions.length - 1));
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				setSelectedIndex((prev) => Math.max(prev - 1, 0));
			} else if (e.key === "Enter") {
				e.preventDefault();
				if (flatSuggestions.length > 0 && selectedIndex < flatSuggestions.length) {
					addRecipient(flatSuggestions[selectedIndex]);
				} else if (inputValue.trim()) {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (emailRegex.test(inputValue.trim())) {
						addRecipient({
							id: `custom-${inputValue}`,
							type: "custom",
							name: inputValue.trim(),
							email: inputValue.trim(),
						});
					}
				}
			} else if (e.key === "Escape") {
				setIsFocused(false);
			} else if (e.key === "," || e.key === ";" || e.key === "Tab") {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (emailRegex.test(inputValue.trim())) {
					e.preventDefault();
					addRecipient({
						id: `custom-${inputValue}`,
						type: "custom",
						name: inputValue.trim(),
						email: inputValue.trim(),
					});
				}
			}
		},
		[inputValue, value, flatSuggestions, selectedIndex, addRecipient, removeRecipient]
	);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsFocused(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Reset selection when suggestions change
	useEffect(() => {
		setSelectedIndex(0);
	}, [flatSuggestions.length]);

	const showDropdown = isFocused && (suggestionGroups.length > 0 || loading || inputValue.trim().length === 0);

	const getTypeIcon = (type: Recipient["type"]) => {
		switch (type) {
			case "customer":
				return <User className="h-3 w-3" />;
			case "vendor":
				return <Building2 className="h-3 w-3" />;
			case "team":
				return <Users className="h-3 w-3" />;
			default:
				return <Mail className="h-3 w-3" />;
		}
	};

	const getTypeColor = (type: Recipient["type"]) => {
		switch (type) {
			case "customer":
				return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
			case "vendor":
				return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
			case "team":
				return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
			default:
				return "bg-muted text-muted-foreground border-border";
		}
	};

	return (
		<div ref={containerRef} className={cn("relative", className)}>
			{/* Input Container with Chips */}
			<div
				className={cn(
					"flex flex-wrap items-center gap-1.5 min-h-[36px] px-2 py-1.5",
					"rounded-lg border border-input bg-background",
					"transition-colors cursor-text",
					isFocused && "border-primary ring-1 ring-primary/20"
				)}
				onClick={() => inputRef.current?.focus()}
			>
				{/* Recipient Chips */}
				{(value || []).map((recipient) => (
					<div
						key={recipient.email}
						className={cn(
							"flex items-center gap-1.5 h-7 pl-2 pr-1 rounded-md border text-xs font-medium",
							getTypeColor(recipient.type)
						)}
					>
						{getTypeIcon(recipient.type)}
						<span className="max-w-[120px] truncate">{recipient.name}</span>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								removeRecipient(recipient.email);
							}}
							className="ml-0.5 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
						>
							<X className="h-3 w-3" />
						</button>
					</div>
				))}

				{/* Input */}
				<div className="flex-1 min-w-[140px] flex items-center gap-1.5">
					<Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
					<input
						ref={inputRef}
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onFocus={() => setIsFocused(true)}
						onKeyDown={handleKeyDown}
						placeholder={(value || []).length === 0 ? placeholder : "Add more..."}
						className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
					/>
				</div>
			</div>

			{/* Suggestions Dropdown */}
			{showDropdown && (
				<div className="absolute z-50 left-0 right-0 mt-1.5 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
					<ScrollArea className="max-h-[280px]">
						{loading && (
							<div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
								<Loader2 className="h-4 w-4 animate-spin" />
								Searching...
							</div>
						)}

						{!loading && suggestionGroups.length === 0 && inputValue.trim().length >= 2 && (
							<div className="px-3 py-4 text-center">
								<p className="text-sm text-muted-foreground">No results found</p>
								<p className="text-xs text-muted-foreground/70 mt-1">
									Type a valid email to add manually
								</p>
							</div>
						)}

						{/* Quick Actions when no search */}
						{!loading && inputValue.trim().length < 2 && suggestionGroups.length === 0 && (
							<div className="p-2">
								<p className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
									Quick Add
								</p>
								<div className="space-y-0.5">
									<button
										type="button"
										className="flex items-center gap-2 w-full px-2 py-2 text-sm text-left rounded-md hover:bg-accent transition-colors"
										onClick={() => inputRef.current?.focus()}
									>
										<div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/10">
											<User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
										</div>
										<div className="flex-1">
											<span className="font-medium">Search customers</span>
											<p className="text-xs text-muted-foreground">Type to search your customers</p>
										</div>
										<ChevronRight className="h-4 w-4 text-muted-foreground" />
									</button>
									<button
										type="button"
										className="flex items-center gap-2 w-full px-2 py-2 text-sm text-left rounded-md hover:bg-accent transition-colors"
										onClick={() => inputRef.current?.focus()}
									>
										<div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/10">
											<Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
										</div>
										<div className="flex-1">
											<span className="font-medium">Search vendors</span>
											<p className="text-xs text-muted-foreground">Type to search your vendors</p>
										</div>
										<ChevronRight className="h-4 w-4 text-muted-foreground" />
									</button>
								</div>
							</div>
						)}

						{/* Suggestion Groups */}
						{!loading &&
							suggestionGroups.map((group, groupIndex) => (
								<div key={group.id}>
									{groupIndex > 0 && <Separator />}
									<div className="p-1.5">
										<div className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
											{group.icon}
											{group.label}
										</div>
										<div className="space-y-0.5">
											{group.suggestions?.map((suggestion) => {
												const flatIndex = flatSuggestions.findIndex(
													(s) => s.id === suggestion.id
												);
												const isSelected = flatIndex === selectedIndex;

												return (
													<button
														key={suggestion.id}
														type="button"
														onClick={() => addRecipient(suggestion)}
														className={cn(
															"flex items-center gap-2 w-full px-2 py-1.5 text-left rounded-md transition-colors",
															isSelected ? "bg-accent" : "hover:bg-accent/50"
														)}
													>
														<Avatar className="h-7 w-7 shrink-0">
															<AvatarFallback className="text-[10px] bg-muted">
																{suggestion.type === "vendor" ? (
																	<Building2 className="h-3.5 w-3.5" />
																) : suggestion.type === "custom" ? (
																	<Mail className="h-3.5 w-3.5" />
																) : (
																	suggestion.name
																		.split(" ")
																		.map((n) => n[0])
																		.join("")
																		.toUpperCase()
																		.slice(0, 2)
																)}
															</AvatarFallback>
														</Avatar>
														<div className="flex-1 min-w-0">
															<div className="text-sm font-medium truncate">
																{suggestion.name}
															</div>
															<div className="text-xs text-muted-foreground truncate">
																{suggestion.email}
																{suggestion.subtitle && ` • ${suggestion.subtitle}`}
															</div>
														</div>
														<Plus className="h-4 w-4 text-muted-foreground shrink-0" />
													</button>
												);
											})}
										</div>
									</div>
								</div>
							))}
					</ScrollArea>

					{/* Footer hint */}
					<div className="px-3 py-1.5 border-t border-border bg-muted/30">
						<p className="text-[10px] text-muted-foreground">
							<kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">↑↓</kbd> navigate
							<span className="mx-1.5">•</span>
							<kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">Enter</kbd> select
							<span className="mx-1.5">•</span>
							<kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">,</kbd> add email
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
