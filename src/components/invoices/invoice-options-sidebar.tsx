/**
 * Invoice Options Sidebar - Right Sidebar
 *
 * Focused on customizing the customer-facing invoice experience.
 * Matches the design patterns of the left sidebar with cards, buttons, and visual hierarchy.
 */

"use client";

import {
	Check,
	ChevronRight,
	CreditCard,
	Download,
	Eye,
	FileText,
	Globe,
	Mail,
	Palette,
	Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// PDF Layout Templates
const PDF_LAYOUTS = [
	{
		id: "modern",
		name: "Modern Clean",
		description: "Minimalist design with clean lines",
		icon: FileText,
	},
	{
		id: "professional",
		name: "Professional",
		description: "Traditional business invoice layout",
		icon: FileText,
	},
	{
		id: "contractor",
		name: "Contractor",
		description: "Optimized for construction/trade work",
		icon: FileText,
	},
	{
		id: "service",
		name: "Service-Based",
		description: "Best for service businesses",
		icon: FileText,
	},
	{
		id: "commercial",
		name: "Commercial",
		description: "Large commercial projects",
		icon: FileText,
	},
	{
		id: "detailed",
		name: "Detailed Breakdown",
		description: "Itemized with material/labor breakdown",
		icon: FileText,
	},
];

const CUSTOMER_VIEW_OPTIONS = [
	{ id: "line-numbers", label: "Line Numbers", icon: Check },
	{ id: "item-codes", label: "Item Codes", icon: Check },
	{ id: "subtotals", label: "Subtotals", icon: Check },
	{ id: "tax-breakdown", label: "Tax Breakdown", icon: Check },
	{ id: "notes", label: "Notes Section", icon: Check },
	{ id: "terms", label: "Terms & Conditions", icon: Check },
];

const PAYMENT_OPTIONS = [
	{ id: "online-payment", label: "Online Payment", icon: CreditCard },
	{ id: "payment-methods", label: "Payment Methods", icon: CreditCard },
	{ id: "partial-payments", label: "Partial Payments", icon: CreditCard },
	{ id: "payment-plan", label: "Payment Plan", icon: CreditCard },
];

export function InvoiceOptionsSidebar() {
	const pathname = usePathname();
	const invoiceId = pathname?.split("/").pop() || "";

	// Design settings state
	const [selectedLayout, setSelectedLayout] = useState("modern");
	const [primaryColor, setPrimaryColor] = useState("#3b82f6");
	const [logoOpacity, setLogoOpacity] = useState([80]);
	const [fontSize, setFontSize] = useState("medium");

	// Customer view settings
	const [enabledOptions, setEnabledOptions] = useState([
		"line-numbers",
		"subtotals",
		"tax-breakdown",
		"notes",
		"terms",
	]);

	// Payment settings
	const [enabledPaymentOptions, setEnabledPaymentOptions] = useState([
		"online-payment",
		"payment-methods",
	]);

	// Email settings
	const [sendEmailOnCreate, setSendEmailOnCreate] = useState(false);

	// Portal settings
	const [enablePortal, setEnablePortal] = useState(true);

	// Handlers
	const handleLayoutChange = (layoutId: string) => {
		setSelectedLayout(layoutId);
		toast.success(`Template changed to ${layoutId}`);
	};

	const toggleOption = (optionId: string) => {
		setEnabledOptions((prev) =>
			prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
		);
	};

	const togglePaymentOption = (optionId: string) => {
		setEnabledPaymentOptions((prev) =>
			prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
		);
	};

	const handleSave = () => {
		toast.success("Customer view settings saved");
	};

	const handlePreview = () => {
		toast.success("Opening customer preview...");
	};

	return (
		<Sidebar collapsible="offcanvas" side="right" variant="inset">
			<SidebarHeader className="border-b">
				<div className="flex items-center justify-between p-4">
					<div>
						<h2 className="text-sm font-semibold">Customer View</h2>
						<p className="text-muted-foreground mt-0.5 text-xs">Customize what customers see</p>
					</div>
					<Button onClick={handlePreview} size="icon" variant="ghost">
						<Eye className="size-4" />
					</Button>
				</div>
			</SidebarHeader>

			<SidebarContent className="gap-0">
				{/* PDF Template */}
				<Collapsible defaultOpen>
					<SidebarGroup>
						<SidebarGroupLabel asChild>
							<CollapsibleTrigger className="group/collapsible hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors">
								PDF Template
								<ChevronRight className="h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<div className="space-y-2 px-2 pt-2">
								{PDF_LAYOUTS.map((layout) => (
									<Card
										className={cn(
											"group hover:border-primary/50 hover:bg-accent/5 cursor-pointer rounded-lg border p-3 transition-all",
											selectedLayout === layout.id && "border-primary bg-primary/5"
										)}
										key={layout.id}
										onClick={() => handleLayoutChange(layout.id)}
									>
										<div className="flex items-start gap-3">
											<div className="mt-0.5">
												<layout.icon className="text-muted-foreground size-4" />
											</div>
											<div className="flex-1 space-y-1">
												<p className="text-sm leading-none font-medium">{layout.name}</p>
												<p className="text-muted-foreground text-xs">{layout.description}</p>
											</div>
											{selectedLayout === layout.id && <Check className="text-primary size-4" />}
										</div>
									</Card>
								))}
							</div>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>

				<Separator className="my-2" />

				{/* Design & Branding */}
				<Collapsible>
					<SidebarGroup>
						<SidebarGroupLabel asChild>
							<CollapsibleTrigger className="group/collapsible hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors">
								<div className="flex items-center gap-2">
									<Palette className="size-3.5" />
									Design & Branding
								</div>
								<ChevronRight className="h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<div className="space-y-3 px-2 pt-1 pb-2">
								<div className="space-y-2">
									<Label className="text-xs">Primary Color</Label>
									<div className="flex items-center gap-2">
										<input
											className="h-8 w-16 cursor-pointer rounded border"
											onChange={(e) => setPrimaryColor(e.target.value)}
											type="color"
											value={primaryColor}
										/>
										<input
											className="bg-background h-8 flex-1 rounded border px-2 text-xs"
											onChange={(e) => setPrimaryColor(e.target.value)}
											type="text"
											value={primaryColor}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label className="text-xs">Logo Opacity</Label>
									<Slider
										className="w-full"
										max={100}
										min={0}
										onValueChange={setLogoOpacity}
										step={10}
										value={logoOpacity}
									/>
									<p className="text-muted-foreground text-xs">{logoOpacity[0]}%</p>
								</div>

								<div className="space-y-2">
									<Label className="text-xs">Font Size</Label>
									<Select onValueChange={setFontSize} value={fontSize}>
										<SelectTrigger className="h-8 text-xs">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="small">Small</SelectItem>
											<SelectItem value="medium">Medium</SelectItem>
											<SelectItem value="large">Large</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>

				<Separator className="my-2" />

				{/* Customer View Options */}
				<Collapsible>
					<SidebarGroup>
						<SidebarGroupLabel asChild>
							<CollapsibleTrigger className="group/collapsible hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors">
								<div className="flex items-center gap-2">
									<Eye className="size-3.5" />
									What Customers See
								</div>
								<ChevronRight className="h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<div className="space-y-1 px-2 pt-2">
								{CUSTOMER_VIEW_OPTIONS.map((option) => {
									const isEnabled = enabledOptions.includes(option.id);
									return (
										<button
											className="hover:bg-accent flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors"
											key={option.id}
											onClick={() => toggleOption(option.id)}
											type="button"
										>
											<span className="flex items-center gap-2">
												{isEnabled && <Check className="text-primary size-3" />}
												<span className={cn("text-xs", isEnabled ? "font-medium" : "")}>
													{option.label}
												</span>
											</span>
											<Switch checked={isEnabled} onCheckedChange={() => toggleOption(option.id)} />
										</button>
									);
								})}
							</div>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>

				<Separator className="my-2" />

				{/* Payment Options */}
				<Collapsible>
					<SidebarGroup>
						<SidebarGroupLabel asChild>
							<CollapsibleTrigger className="group/collapsible hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors">
								<div className="flex items-center gap-2">
									<CreditCard className="size-3.5" />
									Payment Options
								</div>
								<ChevronRight className="h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<div className="space-y-1 px-2 pt-2">
								{PAYMENT_OPTIONS.map((option) => {
									const isEnabled = enabledPaymentOptions.includes(option.id);
									return (
										<button
											className="hover:bg-accent flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors"
											key={option.id}
											onClick={() => togglePaymentOption(option.id)}
											type="button"
										>
											<span className="flex items-center gap-2">
												{isEnabled && <Check className="text-primary size-3" />}
												<span className={cn("text-xs", isEnabled ? "font-medium" : "")}>
													{option.label}
												</span>
											</span>
											<Switch
												checked={isEnabled}
												onCheckedChange={() => togglePaymentOption(option.id)}
											/>
										</button>
									);
								})}
							</div>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>

				<Separator className="my-2" />

				{/* Email Settings */}
				<Collapsible>
					<SidebarGroup>
						<SidebarGroupLabel asChild>
							<CollapsibleTrigger className="group/collapsible hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors">
								<div className="flex items-center gap-2">
									<Mail className="size-3.5" />
									Email Settings
								</div>
								<ChevronRight className="h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<div className="space-y-3 px-2 pt-1 pb-2">
								<Card className="rounded-lg border p-3">
									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<p className="text-xs font-medium">Auto-send on Create</p>
											<p className="text-muted-foreground text-[10px]">
												Automatically email invoice to customer
											</p>
										</div>
										<Switch checked={sendEmailOnCreate} onCheckedChange={setSendEmailOnCreate} />
									</div>
								</Card>

								<Button
									asChild
									className="w-full justify-start gap-2 text-xs"
									size="sm"
									variant="outline"
								>
									<Link href="/dashboard/settings/email-templates">
										<Mail className="size-3" />
										Customize Email Template
									</Link>
								</Button>
							</div>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>

				<Separator className="my-2" />

				{/* Customer Portal */}
				<Collapsible>
					<SidebarGroup>
						<SidebarGroupLabel asChild>
							<CollapsibleTrigger className="group/collapsible hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors">
								<div className="flex items-center gap-2">
									<Globe className="size-3.5" />
									Customer Portal
								</div>
								<ChevronRight className="h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<div className="space-y-2 px-2 pt-2">
								<Card
									className={cn(
										"group hover:border-primary/50 hover:bg-accent/5 cursor-pointer rounded-lg border p-3 transition-all",
										enablePortal && "border-primary bg-primary/5"
									)}
									onClick={() => setEnablePortal(!enablePortal)}
								>
									<div className="flex items-start justify-between gap-2">
										<div className="flex-1 space-y-1">
											<p className="text-sm leading-none font-medium">Portal Access</p>
											<p className="text-muted-foreground text-xs">
												{enablePortal ? "Enabled" : "Disabled"}
											</p>
										</div>
										<Switch checked={enablePortal} onCheckedChange={setEnablePortal} />
									</div>
								</Card>

								<Button
									asChild
									className="w-full justify-start gap-2 text-xs"
									size="sm"
									variant="outline"
								>
									<Link href="/dashboard/settings/customer-portal">
										<Settings className="size-3" />
										Configure Portal Settings
									</Link>
								</Button>
							</div>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>

				<Separator className="my-2" />

				{/* Quick Actions */}
				<SidebarGroup>
					<SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
					<div className="space-y-2 px-2">
						<Button
							className="w-full justify-start gap-2 text-xs"
							onClick={() => window.open(`/api/invoices/${invoiceId}/pdf`, "_blank")}
							size="sm"
							variant="outline"
						>
							<Download className="size-3" />
							Download PDF
						</Button>
						<Button
							asChild
							className="w-full justify-start gap-2 text-xs"
							size="sm"
							variant="outline"
						>
							<Link href={`/invoices/${invoiceId}/preview`}>
								<Eye className="size-3" />
								Preview Customer View
							</Link>
						</Button>
					</div>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="border-t p-3">
				<Button className="w-full gap-2" onClick={handleSave} size="sm" variant="default">
					<Settings className="size-4" />
					Save Settings
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
