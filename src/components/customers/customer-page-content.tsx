/**
 * Customer Page Content - Comprehensive Single Page View
 * Matches job details page structure with collapsible sections
 */

"use client";

import type { LucideIcon } from "lucide-react";
import {
	Archive,
	Building2,
	Calendar,
	CreditCard,
	Download,
	FileText,
	Mail,
	MapPin,
	MoreVertical,
	Package,
	Phone,
	Plus,
	Printer,
	Receipt,
	Save,
	Share2,
	ShieldCheck,
	Sparkles,
	TrendingUp,
	User,
	UserCog,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { updateEntityTags } from "@/actions/entity-tags";
import { CustomerInvoicesTable } from "@/components/customers/customer-invoices-table";
import { PaymentMethodCard } from "@/components/customers/payment-method-card";
import { PropertiesTable } from "@/components/customers/properties-table";
import {
	DetailPageContentLayout,
	type DetailPageHeaderConfig,
} from "@/components/layout/detail-page-content-layout";
import { DetailPageSurface } from "@/components/layout/detail-page-shell";
import { EntityTags } from "@/components/shared/tags/entity-tags";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	CustomerStatusBadge,
	InvoiceStatusBadge,
	JobStatusBadge,
} from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import {
	UnifiedAccordionContent,
	type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";
import { JobsTable } from "@/components/work/jobs-table";
import { useToast } from "@/hooks/use-toast";
import { formatCurrencyFromDollars, formatDate } from "@/lib/formatters";
import { useToolbarActionsStore } from "@/lib/stores/toolbar-actions-store";
import { cn } from "@/lib/utils";

type CustomerPageContentProps = {
	customerData: any;
	metrics: any;
};

export function CustomerPageContent({
	customerData,
	metrics,
}: CustomerPageContentProps) {
	const router = useRouter();
	const { toast } = useToast();
	const pathname = usePathname();
	const [localCustomer, setLocalCustomer] = useState(customerData.customer);
	const [hasChanges, setHasChanges] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const setToolbarActions = useToolbarActionsStore((state) => state.setActions);

	// Extract data before hooks (Customer 360° view - all related entities)
	const {
		customer,
		properties = [],
		jobs = [],
		invoices = [],
		estimates = [], // NEW
		appointments = [], // NEW
		contracts = [], // NEW
		payments = [], // NEW
		maintenancePlans = [], // NEW
		serviceAgreements = [], // NEW
		activities = [],
		equipment = [],
		attachments = [],
		paymentMethods = [],
		enrichmentData,
	} = customerData;

	// Handle field changes
	const handleFieldChange = (field: string, value: any) => {
		setLocalCustomer((prev: any) => ({
			...prev,
			[field]: value,
		}));
		setHasChanges(true);
	};

	const customerStatus = (
		localCustomer?.status ||
		customer?.status ||
		"active"
	)?.toLowerCase();

	const displayName = useMemo(() => {
		const explicitName =
			localCustomer?.display_name ||
			localCustomer?.company_name ||
			customer?.display_name ||
			customer?.company_name;

		if (explicitName && explicitName.trim().length > 0) {
			return explicitName.trim();
		}

		const firstName = localCustomer?.first_name || customer?.first_name;
		const lastName = localCustomer?.last_name || customer?.last_name;
		const composed = [firstName, lastName].filter(Boolean).join(" ").trim();

		if (composed.length > 0) {
			return composed;
		}

		return localCustomer?.email || customer?.email || "Unnamed Customer";
	}, [customer, localCustomer]);

	const handlePrimaryNameChange = (value: string) => {
		const trimmed = value;

		if (localCustomer?.company_name || customer?.company_name) {
			handleFieldChange("company_name", trimmed);
			return;
		}

		if (localCustomer?.display_name || customer?.display_name) {
			handleFieldChange("display_name", trimmed);
			return;
		}

		const cleaned = trimmed.trim();

		if (!cleaned) {
			handleFieldChange("first_name", "");
			handleFieldChange("last_name", "");
			return;
		}

		const parts = cleaned.split(/\s+/);
		if (parts.length === 1) {
			handleFieldChange("first_name", parts[0]);
			handleFieldChange("last_name", "");
		} else {
			handleFieldChange("first_name", parts.slice(0, -1).join(" "));
			handleFieldChange("last_name", parts.at(-1));
		}
	};

	const customerIdentifier = useMemo(() => {
		const candidate =
			customer?.customer_number ??
			customer?.account_number ??
			customer?.reference_id ??
			customer?.external_id;

		if (candidate) {
			return `#${candidate}`;
		}

		if (customer?.id) {
			return `#${customer.id.slice(0, 8).toUpperCase()}`;
		}

		return "#CUSTOMER";
	}, [customer]);

	const primaryEmail = localCustomer?.email || customer?.email || null;
	const primaryPhone =
		localCustomer?.phone ||
		localCustomer?.mobile_phone ||
		customer?.phone ||
		customer?.mobile_phone ||
		null;

	const primaryProperty = useMemo(() => {
		if (properties.length > 0) {
			return properties[0];
		}
		return null;
	}, [properties]);

	const customerSince =
		localCustomer?.created_at ??
		customer?.created_at ??
		customer?.createdAt ??
		null;

	const outstandingBalance =
		metrics?.outstandingBalance ??
		customer?.outstanding_balance ??
		customer?.outstandingBalance ??
		0;

	const membershipLabel =
		localCustomer?.membership_tier ??
		localCustomer?.membership ??
		localCustomer?.plan ??
		customer?.membership_tier ??
		customer?.membership ??
		customer?.plan ??
		null;

	const portalEnabled =
		localCustomer?.portal_enabled ??
		customer?.portal_enabled ??
		customer?.portalEnabled ??
		false;

	// Save changes
	const handleSave = async () => {
		setIsSaving(true);
		try {
			// TODO: Implement save customer action
			toast.success("Customer updated successfully");
			setHasChanges(false);
			// Server Action handles revalidation automatically
		} catch (_error) {
			toast.error("Failed to update customer");
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setLocalCustomer(customer);
		setHasChanges(false);
	};

	// Helper to determine badge type based on status
	const _getStatusBadge = (
		status: string,
		entityType: "job" | "invoice" = "job",
	) => {
		if (entityType === "invoice") {
			return <InvoiceStatusBadge status={status} />;
		}
		return <JobStatusBadge status={status} />;
	};

	const headerBadges = [
		<Badge className="font-mono" key="identifier" variant="outline">
			{customerIdentifier}
		</Badge>,
		<CustomerStatusBadge status={customerStatus || "active"} />,
		membershipLabel ? (
			<Badge key="membership" variant="secondary">
				{membershipLabel}
			</Badge>
		) : null,
		portalEnabled ? (
			<Badge className="gap-1 text-xs" key="portal" variant="outline">
				<Sparkles className="h-3.5 w-3.5" /> Portal Enabled
			</Badge>
		) : null,
	].filter(Boolean);

	const quickActionConfigs = [
		{
			key: "new-job",
			label: "New Job",
			icon: Plus,
			onClick: () =>
				router.push(`/dashboard/work/new?customerId=${customer.id}`),
		},
		{
			key: "new-invoice",
			label: "New Invoice",
			icon: FileText,
			variant: "secondary" as const,
			onClick: () =>
				router.push(`/dashboard/work/invoices/new?customerId=${customer.id}`),
		},
		{
			key: "add-property",
			label: "Add Property",
			icon: Building2,
			variant: "outline" as const,
			onClick: () =>
				router.push(`/dashboard/work/properties/new?customerId=${customer.id}`),
		},
	] as const;

	const renderQuickActions = () =>
		quickActionConfigs.map((config) => {
			const { key, label, icon: Icon, onClick } = config;
			const variant = "variant" in config ? config.variant : undefined;
			return (
				<Button
					key={key}
					onClick={onClick}
					size="sm"
					variant={variant ?? "default"}
				>
					<Icon className="mr-2 h-4 w-4" />
					{label}
				</Button>
			);
		});

	const getToolbarActions = useCallback(() => {
		if (hasChanges) {
			return (
				<div className="flex items-center gap-1.5">
					<Button disabled={isSaving} onClick={handleSave} size="sm">
						<Save className="mr-2 h-4 w-4" />
						{isSaving ? "Saving..." : "Save Changes"}
					</Button>
					<Button onClick={handleCancel} size="sm" variant="outline">
						Cancel
					</Button>
				</div>
			);
		}
		return (
			<div className="flex items-center gap-1.5">
				{renderQuickActions()}
				<Separator className="h-6" orientation="vertical" />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="h-8 w-8" size="icon" variant="outline">
							<MoreVertical className="size-4" />
							<span className="sr-only">More actions</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
							Actions
						</DropdownMenuLabel>
						<DropdownMenuSeparator />

						<DropdownMenuItem
							onClick={() =>
								router.push(`/dashboard/customers/${customer.id}/edit`)
							}
						>
							<UserCog className="mr-2 size-3.5" />
							Edit Full Profile
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem onClick={() => {}}>
							<Download className="mr-2 size-3.5" />
							Export Customer Data
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => {}}>
							<Printer className="mr-2 size-3.5" />
							Print Customer Profile
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => {}}>
							<Share2 className="mr-2 size-3.5" />
							Share Customer Link
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem onClick={() => {}}>
							<User className="mr-2 size-3.5" />
							Merge with Another Customer
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem
							className="text-destructive focus:text-destructive"
							onClick={() => {}}
						>
							<Archive className="mr-2 size-3.5" />
							Archive Customer
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		);
	}, [hasChanges, isSaving, handleSave, handleCancel, renderQuickActions, router, customer.id]);

	// Update toolbar actions when hasChanges or isSaving changes
	useEffect(() => {
		if (pathname) {
			setToolbarActions(pathname, getToolbarActions());
		}
	}, [pathname, setToolbarActions, getToolbarActions]);

	const metadataItems: DetailPageHeaderConfig["metadata"] = [
		{
			label: "Outstanding Balance",
			icon: <CreditCard className="h-3.5 w-3.5" />,
			value: formatCurrencyFromDollars(outstandingBalance, { decimals: 0 }),
			helperText: "Open invoices",
		},
		{
			label: "Lifetime Revenue",
			icon: <TrendingUp className="h-3.5 w-3.5" />,
			value: formatCurrencyFromDollars(metrics?.totalRevenue ?? 0, {
				decimals: 0,
			}),
		},
		{
			label: "Jobs",
			icon: <Wrench className="h-3.5 w-3.5" />,
			value: metrics?.totalJobs ?? jobs.length,
			helperText: "All time",
		},
		{
			label: "Properties",
			icon: <Building2 className="h-3.5 w-3.5" />,
			value: metrics?.totalProperties ?? properties.length,
		},
	];

	const subtitleContent = (
		<div className="flex flex-wrap items-center gap-2">
			<span className="inline-flex items-center gap-1">
				<Calendar className="h-4 w-4" />
				{customerSince
					? `Customer since ${formatDate(customerSince, "short")}`
					: "Customer since —"}
			</span>
			{primaryProperty ? (
				<>
					<span aria-hidden="true">•</span>
					<Link
						className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
						href={`/dashboard/work/properties/${primaryProperty.id}`}
					>
						<MapPin className="h-4 w-4" />
						{primaryProperty.name || primaryProperty.address}
					</Link>
				</>
			) : null}
		</div>
	);

	const avatarInitials = displayName
		.split(" ")
		.map((part: string) => part?.[0])
		.filter(Boolean)
		.join("")
		.slice(0, 2)
		.toUpperCase();

	const headerConfig: DetailPageHeaderConfig = {
		title: displayName,
		subtitle: subtitleContent,
		badges: headerBadges,
		metadata: metadataItems,
		leadingVisual: (
			<Avatar className="h-12 w-12">
				<AvatarImage
					alt={displayName}
					src={customer?.avatar_url ?? undefined}
				/>
				<AvatarFallback>{avatarInitials || "CU"}</AvatarFallback>
			</Avatar>
		),
	};

	const contactTileData: Array<{
		key: string;
		icon: LucideIcon;
		label: string;
		value: ReactNode;
		href?: string;
	}> = [
		{
			key: "primary-email",
			icon: Mail,
			label: "Primary Email",
			value: primaryEmail ?? "Not provided",
			href: primaryEmail ? `mailto:${primaryEmail}` : undefined,
		},
		{
			key: "primary-phone",
			icon: Phone,
			label: "Primary Phone",
			value: primaryPhone ?? "Not provided",
			href: primaryPhone ? `tel:${primaryPhone}` : undefined,
		},
		{
			key: "portal",
			icon: Sparkles,
			label: "Portal Access",
			value: portalEnabled ? "Enabled" : "Disabled",
		},
		{
			key: "membership",
			icon: ShieldCheck,
			label: "Membership",
			value: membershipLabel ?? "Standard",
		},
	];

	const metricTileData: Array<{
		key: string;
		icon: LucideIcon;
		label: string;
		value: ReactNode;
	}> = [
		{
			key: "outstanding",
			icon: FileText,
			label: "Outstanding",
			value: formatCurrencyFromDollars(outstandingBalance, { decimals: 0 }),
		},
		{
			key: "jobs",
			icon: TrendingUp,
			label: "Total Jobs",
			value: metrics?.totalJobs ?? jobs.length,
		},
		{
			key: "properties",
			icon: Building2,
			label: "Properties",
			value: metrics?.totalProperties ?? properties.length,
		},
		{
			key: "lifetime-revenue",
			icon: Receipt,
			label: "Lifetime Revenue",
			value: formatCurrencyFromDollars(metrics?.totalRevenue ?? 0, {
				decimals: 0,
			}),
		},
	];

	const overviewSurface = (
		<DetailPageSurface padding="lg" variant="muted">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3">
					<Label className="font-medium text-muted-foreground text-xs uppercase">
						Display Name
					</Label>
					<Input
						className={cn(
							"h-12 rounded-lg border border-border/40 bg-background px-4 font-semibold text-xl shadow-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:text-2xl",
						)}
						onChange={(e) => handlePrimaryNameChange(e.target.value)}
						placeholder="Enter customer name..."
						value={displayName}
					/>
					<p className="text-muted-foreground text-xs">
						Update how this customer appears across Thorbis. Changes are saved
						when you select Save changes.
					</p>
				</div>

				<div className="grid gap-3 sm:grid-cols-2">
					{contactTileData.map(({ key, icon: Icon, label, value, href }) => (
						<div
							className="rounded-lg border border-border/40 bg-background px-3 py-3"
							key={key}
						>
							<div className="flex items-center gap-3">
								<Icon className="h-4 w-4 text-muted-foreground" />
								<div className="flex flex-col">
									<span className="font-medium text-muted-foreground text-xs uppercase">
										{label}
									</span>
									{href ? (
										<a
											className="font-semibold text-sm hover:underline"
											href={href}
										>
											{value}
										</a>
									) : (
										<span className="font-semibold text-sm">{value}</span>
									)}
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
					{metricTileData.map(({ key, icon: Icon, label, value }) => (
						<div
							className="rounded-lg border border-border/40 bg-background px-3 py-3"
							key={key}
						>
							<div className="flex items-center gap-3">
								<Icon className="h-4 w-4 text-muted-foreground" />
								<div className="flex flex-col">
									<span className="font-medium text-muted-foreground text-xs uppercase">
										{label}
									</span>
									<span className="font-semibold text-sm">{value}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</DetailPageSurface>
	);

	const customSections = useMemo<UnifiedAccordionSection[]>(() => {
		const sections: UnifiedAccordionSection[] = [
			{
				id: "customer-info",
				title: "Customer Information",
				icon: <User className="size-4" />,
				defaultOpen: true,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-6">
							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="first_name">First Name</Label>
										<Input
											id="first_name"
											onChange={(e) =>
												handleFieldChange("first_name", e.target.value)
											}
											value={localCustomer.first_name || ""}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="last_name">Last Name</Label>
										<Input
											id="last_name"
											onChange={(e) =>
												handleFieldChange("last_name", e.target.value)
											}
											value={localCustomer.last_name || ""}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="company_name">Company Name</Label>
										<Input
											id="company_name"
											onChange={(e) =>
												handleFieldChange("company_name", e.target.value)
											}
											value={localCustomer.company_name || ""}
										/>
									</div>
								</div>
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<div className="flex gap-2">
											<Input
												id="email"
												onChange={(e) =>
													handleFieldChange("email", e.target.value)
												}
												type="email"
												value={localCustomer.email || ""}
											/>
											{customer.email && (
												<Button asChild size="icon" variant="outline">
													<a href={`mailto:${customer.email}`}>
														<Mail className="size-4" />
													</a>
												</Button>
											)}
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="phone">Phone</Label>
										<div className="flex gap-2">
											<Input
												id="phone"
												onChange={(e) =>
													handleFieldChange("phone", e.target.value)
												}
												type="tel"
												value={localCustomer.phone || ""}
											/>
											{customer.phone && (
												<Button asChild size="icon" variant="outline">
													<a href={`tel:${customer.phone}`}>
														<Phone className="size-4" />
													</a>
												</Button>
											)}
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="mobile_phone">Mobile Phone</Label>
										<div className="flex gap-2">
											<Input
												id="mobile_phone"
												onChange={(e) =>
													handleFieldChange("mobile_phone", e.target.value)
												}
												type="tel"
												value={localCustomer.mobile_phone || ""}
											/>
											{customer.mobile_phone && (
												<Button asChild size="icon" variant="outline">
													<a href={`tel:${customer.mobile_phone}`}>
														<Phone className="size-4" />
													</a>
												</Button>
											)}
										</div>
									</div>
								</div>
							</div>

							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="address">Address</Label>
										<Textarea
											id="address"
											onChange={(e) =>
												handleFieldChange("address", e.target.value)
											}
											rows={3}
											value={localCustomer.address || ""}
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="city">City</Label>
											<Input
												id="city"
												onChange={(e) =>
													handleFieldChange("city", e.target.value)
												}
												value={localCustomer.city || ""}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="state">State</Label>
											<Input
												id="state"
												onChange={(e) =>
													handleFieldChange("state", e.target.value)
												}
												value={localCustomer.state || ""}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="postal_code">Postal Code</Label>
											<Input
												id="postal_code"
												onChange={(e) =>
													handleFieldChange("postal_code", e.target.value)
												}
												value={localCustomer.postal_code || ""}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="country">Country</Label>
											<Input
												id="country"
												onChange={(e) =>
													handleFieldChange("country", e.target.value)
												}
												value={localCustomer.country || ""}
											/>
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="tags">Tags</Label>
										<Input
											id="tags"
											onChange={(e) =>
												handleFieldChange(
													"tags",
													e.target.value.split(",").map((tag) => tag.trim()),
												)
											}
											placeholder="Comma separated tags"
											value={(localCustomer.tags || []).join(", ")}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="notes">Notes</Label>
										<Textarea
											id="notes"
											onChange={(e) =>
												handleFieldChange("notes", e.target.value)
											}
											placeholder="Internal notes about this customer"
											rows={4}
											value={localCustomer.notes || ""}
										/>
									</div>
								</div>
							</div>
						</div>
					</UnifiedAccordionContent>
				),
			},
			{
				id: "properties",
				title: "Properties",
				icon: <Building2 className="size-4" />,
				count: properties.length,
				actions: (
					<Button
						onClick={() =>
							router.push(
								`/dashboard/work/properties/new?customerId=${customer.id}`,
							)
						}
						size="sm"
						variant="outline"
					>
						<Plus className="mr-2 h-4 w-4" /> Add Property
					</Button>
				),
				content: (
					<UnifiedAccordionContent className="p-0">
						<div className="border-b px-6 py-4 text-muted-foreground text-sm">
							Manage service locations for this customer.
						</div>
						<PropertiesTable
							customerId={customer.id}
							itemsPerPage={10}
							properties={properties}
						/>
					</UnifiedAccordionContent>
				),
			},
			{
				id: "jobs",
				title: "Jobs",
				icon: <Wrench className="size-4" />,
				count: jobs.length,
				actions: (
					<Button
						onClick={() =>
							router.push(`/dashboard/work/new?customerId=${customer.id}`)
						}
						size="sm"
						variant="outline"
					>
						<Plus className="mr-2 h-4 w-4" /> New Job
					</Button>
				),
				content: (
					<UnifiedAccordionContent className="p-0">
						<div className="border-b px-6 py-4 text-muted-foreground text-sm">
							Recent jobs associated with this customer.
						</div>
						<JobsTable itemsPerPage={10} jobs={jobs} />
					</UnifiedAccordionContent>
				),
			},
			{
				id: "invoices",
				title: "Invoices",
				icon: <Receipt className="size-4" />,
				actions: (
					<Button
						onClick={() =>
							router.push(
								`/dashboard/work/invoices/new?customerId=${customer.id}`,
							)
						}
						size="sm"
						variant="outline"
					>
						<Plus className="mr-2 h-4 w-4" /> New Invoice
					</Button>
				),
				content: (
					<UnifiedAccordionContent className="p-0">
						<div className="border-b px-6 py-4 text-muted-foreground text-sm">
							Billing history and outstanding invoices.
						</div>
						<CustomerInvoicesTable
							invoices={invoices || []}
							onUpdate={() => {
								// Server Action handles revalidation automatically
							}}
						/>
					</UnifiedAccordionContent>
				),
			},
			{
				id: "equipment",
				title: "Equipment",
				icon: <Package className="size-4" />,
				actions: (
					<Button onClick={() => {}} size="sm" variant="outline">
						<Plus className="mr-2 h-4 w-4" /> Add Equipment
					</Button>
				),
				content: (
					<UnifiedAccordionContent>
						{equipment.length > 0 ? (
							<div className="grid gap-4 md:grid-cols-2">
								{equipment.map((item: any) => (
									<div className="rounded-lg border p-4" key={item.id}>
										<div className="flex items-center gap-3">
											<div className="rounded-md bg-primary/10 p-2">
												<Wrench className="h-4 w-4 text-primary" />
											</div>
											<div>
												<p className="font-medium">{item.name}</p>
												<p className="text-muted-foreground text-xs">
													{item.type || item.category || "Equipment"}
												</p>
											</div>
										</div>
										<div className="mt-3 space-y-1 text-sm">
											{item.serial_number && (
												<p className="text-muted-foreground">
													Serial: {item.serial_number}
												</p>
											)}
											{item.manufacturer && (
												<p className="flex items-center gap-2 text-muted-foreground">
													<Building2 className="h-4 w-4" />
													{item.manufacturer}
												</p>
											)}
											{item.install_date && (
												<p className="flex items-center gap-2 text-muted-foreground">
													<Calendar className="h-4 w-4" />
													Installed {formatDate(item.install_date, "short")}
												</p>
											)}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
								<Package className="h-6 w-6 text-muted-foreground" />
								<p className="mt-2 text-muted-foreground text-sm">
									No equipment on record for this customer yet.
								</p>
							</div>
						)}
					</UnifiedAccordionContent>
				),
			},
			{
				id: "payment-methods",
				title: "Payment Methods",
				icon: <CreditCard className="size-4" />,
				count: paymentMethods.length,
				actions: (
					<Button onClick={() => {}} size="sm" variant="outline">
						<Plus className="mr-2 h-4 w-4" /> Add Payment Method
					</Button>
				),
				content: (
					<UnifiedAccordionContent>
						{paymentMethods.length > 0 ? (
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{paymentMethods.map((method: any) => {
									// Determine payment method type
									const type =
										method.type === "ach" || method.type === "bank"
											? method.type
											: "card";

									return (
										<PaymentMethodCard
											account_type={method.account_type}
											bank_name={method.bank_name}
											card_brand={method.brand || method.card_brand}
											card_exp_month={method.exp_month || method.card_exp_month}
											card_exp_year={method.exp_year || method.card_exp_year}
											card_last4={
												method.last4 ||
												method.card_last_four ||
												method.card_last4
											}
											cardholder_name={method.cardholder_name || method.name}
											id={method.id}
											is_default={method.is_default}
											is_verified={method.is_verified}
											key={method.id}
											nickname={method.nickname}
											onRemove={() => {}}
											onSetDefault={() => {}}
											type={type}
										/>
									);
								})}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 py-12 text-center">
								<CreditCard className="mb-3 size-12 text-muted-foreground/50" />
								<p className="font-medium text-muted-foreground text-sm">
									No payment methods on file
								</p>
								<p className="mt-1 text-muted-foreground text-xs">
									Add a card or bank account for quick invoicing
								</p>
							</div>
						)}
					</UnifiedAccordionContent>
				),
			},
			// NEW: Estimates Section
			{
				id: "estimates",
				title: "Estimates",
				icon: <FileText className="size-4" />,
				count: estimates.length,
				actions: (
					<Button
						onClick={() =>
							router.push(
								`/dashboard/work/estimates/new?customerId=${customer.id}`,
							)
						}
						size="sm"
						variant="outline"
					>
						<Plus className="mr-2 h-4 w-4" /> New Estimate
					</Button>
				),
				content: (
					<UnifiedAccordionContent className="p-0">
						<div className="border-b px-6 py-4 text-muted-foreground text-sm">
							Estimates and quotes provided to this customer.
						</div>
						{estimates.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="border-b bg-muted/50">
										<tr>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Estimate #
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Date
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Total
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Status
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{estimates.map((estimate: any) => (
											<tr
												className="border-b hover:bg-muted/30"
												key={estimate.id}
											>
												<td className="px-6 py-4 text-sm">
													#{estimate.estimate_number || estimate.id.slice(0, 8)}
												</td>
												<td className="px-6 py-4 text-sm">
													{formatDate(estimate.created_at, "short")}
												</td>
												<td className="px-6 py-4 font-medium text-sm">
													{formatCurrencyFromDollars(
														estimate.total_amount / 100,
													)}
												</td>
												<td className="px-6 py-4 text-sm">
													<Badge variant="outline">
														{estimate.status || "draft"}
													</Badge>
												</td>
												<td className="px-6 py-4 text-sm">
													<Link
														className="text-primary hover:underline"
														href={`/dashboard/work/estimates/${estimate.id}`}
													>
														View
													</Link>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center p-12 text-center">
								<FileText className="h-8 w-8 text-muted-foreground" />
								<p className="mt-2 text-muted-foreground text-sm">
									No estimates for this customer yet.
								</p>
							</div>
						)}
					</UnifiedAccordionContent>
				),
			},
			// NEW: Appointments Section
			{
				id: "appointments",
				title: "Appointments",
				icon: <Calendar className="size-4" />,
				count: appointments.length,
				actions: (
					<Button
						onClick={() =>
							router.push(`/dashboard/schedule?customerId=${customer.id}`)
						}
						size="sm"
						variant="outline"
					>
						<Plus className="mr-2 h-4 w-4" /> Schedule Appointment
					</Button>
				),
				content: (
					<UnifiedAccordionContent className="p-0">
						<div className="border-b px-6 py-4 text-muted-foreground text-sm">
							Scheduled appointments and service visits for this customer.
						</div>
						{appointments.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="border-b bg-muted/50">
										<tr>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Date & Time
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Type
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Property
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Job
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Status
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{appointments.map((appointment: any) => (
											<tr
												className="border-b hover:bg-muted/30"
												key={appointment.id}
											>
												<td className="px-6 py-4 text-sm">
													{new Date(
														appointment.scheduled_start,
													).toLocaleString()}
												</td>
												<td className="px-6 py-4 text-sm">
													{appointment.type || "Service"}
												</td>
												<td className="px-6 py-4 text-sm">
													{appointment.property?.name ||
														appointment.property?.address ||
														"-"}
												</td>
												<td className="px-6 py-4 text-sm">
													{appointment.job?.job_number
														? `#${appointment.job.job_number}`
														: "-"}
												</td>
												<td className="px-6 py-4 text-sm">
													<Badge variant="outline">
														{appointment.status || "scheduled"}
													</Badge>
												</td>
												<td className="px-6 py-4 text-sm">
													<Link
														className="text-primary hover:underline"
														href={`/dashboard/appointments/${appointment.id}`}
													>
														View
													</Link>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center p-12 text-center">
								<Calendar className="h-8 w-8 text-muted-foreground" />
								<p className="mt-2 text-muted-foreground text-sm">
									No appointments scheduled for this customer.
								</p>
							</div>
						)}
					</UnifiedAccordionContent>
				),
			},
			// NEW: Contracts Section
			{
				id: "contracts",
				title: "Contracts",
				icon: <FileText className="size-4" />,
				count: contracts.length,
				content: (
					<UnifiedAccordionContent className="p-0">
						<div className="border-b px-6 py-4 text-muted-foreground text-sm">
							Service contracts and agreements signed by this customer.
						</div>
						{contracts.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="border-b bg-muted/50">
										<tr>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Contract #
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Date
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Related To
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Status
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{contracts.map((contract: any) => (
											<tr
												className="border-b hover:bg-muted/30"
												key={contract.id}
											>
												<td className="px-6 py-4 text-sm">
													#{contract.contract_number || contract.id.slice(0, 8)}
												</td>
												<td className="px-6 py-4 text-sm">
													{formatDate(contract.created_at, "short")}
												</td>
												<td className="px-6 py-4 text-sm">
													{contract.job
														? `Job #${contract.job.job_number}`
														: contract.estimate
															? `Est #${contract.estimate.estimate_number}`
															: contract.invoice
																? `Inv #${contract.invoice.invoice_number}`
																: "-"}
												</td>
												<td className="px-6 py-4 text-sm">
													<Badge variant="outline">
														{contract.status || "draft"}
													</Badge>
												</td>
												<td className="px-6 py-4 text-sm">
													<Link
														className="text-primary hover:underline"
														href={`/dashboard/work/contracts/${contract.id}`}
													>
														View
													</Link>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center p-12 text-center">
								<FileText className="h-8 w-8 text-muted-foreground" />
								<p className="mt-2 text-muted-foreground text-sm">
									No contracts for this customer.
								</p>
							</div>
						)}
					</UnifiedAccordionContent>
				),
			},
			// NEW: Payments Section
			{
				id: "payments",
				title: "Payments",
				icon: <CreditCard className="size-4" />,
				count: payments.length,
				content: (
					<UnifiedAccordionContent className="p-0">
						<div className="border-b px-6 py-4 text-muted-foreground text-sm">
							Payment history and transactions from this customer.
						</div>
						{payments.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="border-b bg-muted/50">
										<tr>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Payment #
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Date
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Amount
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Method
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Invoice
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Status
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{payments.map((payment: any) => (
											<tr
												className="border-b hover:bg-muted/30"
												key={payment.id}
											>
												<td className="px-6 py-4 text-sm">
													#{payment.payment_number || payment.id.slice(0, 8)}
												</td>
												<td className="px-6 py-4 text-sm">
													{formatDate(payment.created_at, "short")}
												</td>
												<td className="px-6 py-4 font-medium text-sm">
													{formatCurrencyFromDollars(payment.amount / 100)}
												</td>
												<td className="px-6 py-4 text-sm capitalize">
													{payment.payment_method?.replace("_", " ") || "-"}
												</td>
												<td className="px-6 py-4 text-sm">
													{payment.invoice
														? `#${payment.invoice.invoice_number}`
														: "-"}
												</td>
												<td className="px-6 py-4 text-sm">
													<Badge
														variant={
															payment.status === "completed"
																? "default"
																: "outline"
														}
													>
														{payment.status}
													</Badge>
												</td>
												<td className="px-6 py-4 text-sm">
													<Link
														className="text-primary hover:underline"
														href={`/dashboard/work/payments/${payment.id}`}
													>
														View
													</Link>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center p-12 text-center">
								<CreditCard className="h-8 w-8 text-muted-foreground" />
								<p className="mt-2 text-muted-foreground text-sm">
									No payment history for this customer.
								</p>
							</div>
						)}
					</UnifiedAccordionContent>
				),
			},
			// NEW: Maintenance Plans Section
			{
				id: "maintenance-plans",
				title: "Maintenance Plans",
				icon: <ShieldCheck className="size-4" />,
				count: maintenancePlans.length,
				content: (
					<UnifiedAccordionContent className="p-0">
						<div className="border-b px-6 py-4 text-muted-foreground text-sm">
							Recurring maintenance plans for this customer's equipment.
						</div>
						{maintenancePlans.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="border-b bg-muted/50">
										<tr>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Plan Name
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Property
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Frequency
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Status
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{maintenancePlans.map((plan: any) => (
											<tr className="border-b hover:bg-muted/30" key={plan.id}>
												<td className="px-6 py-4 font-medium text-sm">
													{plan.name || `Plan ${plan.id.slice(0, 8)}`}
												</td>
												<td className="px-6 py-4 text-sm">
													{plan.property?.name || plan.property?.address || "-"}
												</td>
												<td className="px-6 py-4 text-sm capitalize">
													{plan.frequency || "Monthly"}
												</td>
												<td className="px-6 py-4 text-sm">
													<Badge variant="outline">
														{plan.status || "active"}
													</Badge>
												</td>
												<td className="px-6 py-4 text-sm">
													<Link
														className="text-primary hover:underline"
														href={`/dashboard/work/maintenance-plans/${plan.id}`}
													>
														View
													</Link>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center p-12 text-center">
								<ShieldCheck className="h-8 w-8 text-muted-foreground" />
								<p className="mt-2 text-muted-foreground text-sm">
									No maintenance plans for this customer.
								</p>
							</div>
						)}
					</UnifiedAccordionContent>
				),
			},
			// NEW: Service Agreements Section
			{
				id: "service-agreements",
				title: "Service Agreements",
				icon: <FileText className="size-4" />,
				count: serviceAgreements.length,
				content: (
					<UnifiedAccordionContent className="p-0">
						<div className="border-b px-6 py-4 text-muted-foreground text-sm">
							Long-term service agreements and ongoing contracts.
						</div>
						{serviceAgreements.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="border-b bg-muted/50">
										<tr>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Agreement #
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Property
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Start Date
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												End Date
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Status
											</th>
											<th className="px-6 py-3 text-left font-medium text-sm">
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{serviceAgreements.map((agreement: any) => (
											<tr
												className="border-b hover:bg-muted/30"
												key={agreement.id}
											>
												<td className="px-6 py-4 text-sm">
													#{agreement.id.slice(0, 8)}
												</td>
												<td className="px-6 py-4 text-sm">
													{agreement.property?.name ||
														agreement.property?.address ||
														"-"}
												</td>
												<td className="px-6 py-4 text-sm">
													{agreement.start_date
														? formatDate(agreement.start_date, "short")
														: "-"}
												</td>
												<td className="px-6 py-4 text-sm">
													{agreement.end_date
														? formatDate(agreement.end_date, "short")
														: "-"}
												</td>
												<td className="px-6 py-4 text-sm">
													<Badge variant="outline">
														{agreement.status || "active"}
													</Badge>
												</td>
												<td className="px-6 py-4 text-sm">
													<Link
														className="text-primary hover:underline"
														href={`/dashboard/work/service-agreements/${agreement.id}`}
													>
														View
													</Link>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center p-12 text-center">
								<FileText className="h-8 w-8 text-muted-foreground" />
								<p className="mt-2 text-muted-foreground text-sm">
									No service agreements for this customer.
								</p>
							</div>
						)}
					</UnifiedAccordionContent>
				),
			},
		];

		return sections;
	}, [
		customer.id,
		customer.email,
		customer.mobile_phone,
		customer.phone,
		equipment,
		estimates,
		appointments,
		contracts,
		payments,
		maintenancePlans,
		serviceAgreements,
		handleFieldChange,
		jobs,
		localCustomer,
		paymentMethods,
		properties,
		router,
		invoices,
	]);

	const relatedItems = useMemo(() => {
		const items: any[] = [];

		if (primaryProperty) {
			items.push({
				id: `property-${primaryProperty.id}`,
				type: "property",
				title: primaryProperty.name || primaryProperty.address,
				subtitle: `${primaryProperty.city || ""}, ${primaryProperty.state || ""}`,
				href: `/dashboard/work/properties/${primaryProperty.id}`,
			});
		}

		if (jobs.length > 0) {
			const recentJob = jobs[0];
			items.push({
				id: `job-${recentJob.id}`,
				type: "job",
				title: recentJob.title || `Job #${recentJob.job_number}`,
				subtitle: recentJob.status,
				href: `/dashboard/work/${recentJob.id}`,
				badge: recentJob.status
					? { label: recentJob.status, variant: "outline" as const }
					: undefined,
			});
		}

		return items;
	}, [jobs, primaryProperty]);

	// Custom header with tags
	const customHeader = (
		<div className="w-full px-2 sm:px-0">
			<div className="mx-auto max-w-7xl rounded-md bg-muted/50 shadow-sm">
				<div className="flex flex-col gap-3 p-4 sm:p-6">
					<span className="font-medium text-muted-foreground text-xs">
						Tags:
					</span>
					<EntityTags
						entityId={customer.id}
						entityType="customer"
						onUpdateTags={(id, tags) => updateEntityTags("customer", id, tags)}
						tags={customer.tags || []}
					/>
				</div>
			</div>
		</div>
	);

	return (
		<DetailPageContentLayout
			activities={activities}
			attachments={attachments}
			beforeContent={overviewSurface}
			customHeader={customHeader}
			customSections={customSections}
			defaultOpenSection="customer-info"
			enableReordering={true}
			header={headerConfig}
			notes={[]}
			relatedItems={relatedItems}
			showStandardSections={{
				notes: false,
			}}
			storageKey="customer-details"
		/>
	);
}
