"use client";

import {
	ArrowRight,
	BookOpen,
	Bot,
	Building2,
	Calculator,
	Calendar,
	ChevronDown,
	CircleDollarSign,
	FileText,
	Flame,
	Hammer,
	HelpCircle,
	Home,
	Layers,
	type LucideIcon,
	Mail,
	Menu,
	Newspaper,
	Rocket,
	Shield,
	Smartphone,
	Sparkles,
	Users,
	Video,
	Wrench,
	X,
	Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Types
type NavItem = {
	title: string;
	href: string;
	description: string;
	icon: LucideIcon;
	badge?: string;
};

// Navigation Data
const platformFeatures: NavItem[] = [
	{
		title: "AI Assistant",
		href: "/features/ai-assistant",
		description: "24/7 intelligent call handling",
		icon: Bot,
		badge: "New",
	},
	{
		title: "Scheduling",
		href: "/features/scheduling",
		description: "Smart dispatch & routing",
		icon: Calendar,
	},
	{
		title: "Mobile App",
		href: "/features/mobile-app",
		description: "Offline-first field app",
		icon: Smartphone,
	},
	{
		title: "CRM",
		href: "/features/crm",
		description: "Customer management",
		icon: Users,
	},
	{
		title: "Invoicing",
		href: "/features/invoicing",
		description: "Payments & billing",
		icon: CircleDollarSign,
	},
	{
		title: "Estimates",
		href: "/features/estimates",
		description: "Quotes & proposals",
		icon: FileText,
	},
];

const industries: NavItem[] = [
	{ title: "HVAC", href: "/industries/hvac", description: "Heating & cooling", icon: Flame },
	{ title: "Plumbing", href: "/industries/plumbing", description: "Pipes & fixtures", icon: Wrench },
	{ title: "Electrical", href: "/industries/electrical", description: "Power & wiring", icon: Zap },
	{ title: "Landscaping", href: "/industries/landscaping", description: "Yards & gardens", icon: Home },
	{ title: "Pool Service", href: "/industries/pool-service", description: "Maintenance", icon: Layers },
	{ title: "Pest Control", href: "/industries/pest-control", description: "Extermination", icon: Shield },
	{ title: "Roofing", href: "/industries/roofing", description: "Repairs & installs", icon: Hammer },
	{ title: "Cleaning", href: "/industries/cleaning", description: "Commercial & residential", icon: Sparkles },
];

const resources: NavItem[] = [
	{ title: "Help Center", href: "/kb", description: "Guides & FAQs", icon: HelpCircle },
	{ title: "Blog", href: "/blog", description: "News & updates", icon: Newspaper },
	{ title: "Webinars", href: "/webinars", description: "Live sessions", icon: Video },
	{ title: "Templates", href: "/templates", description: "Ready-to-use", icon: BookOpen },
	{ title: "Free Tools", href: "/free-tools", description: "Calculators", icon: Calculator },
];

const company: NavItem[] = [
	{ title: "About", href: "/about", description: "Our story", icon: Building2 },
	{ title: "Careers", href: "/careers", description: "Join us", icon: Rocket },
	{ title: "Partners", href: "/partners", description: "Work with us", icon: Users },
	{ title: "Contact", href: "/contact", description: "Get in touch", icon: Mail },
];

// Dropdown Component
function NavDropdown({
	trigger,
	items,
	title,
	showViewAll,
	viewAllHref,
	columns = 1,
}: {
	trigger: React.ReactNode;
	items: NavItem[];
	title?: string;
	showViewAll?: boolean;
	viewAllHref?: string;
	columns?: 1 | 2;
}) {
	const [open, setOpen] = useState(false);
	const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [timeoutId]);

	const handleMouseEnter = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			setTimeoutId(null);
		}
		setOpen(true);
	};

	const handleMouseLeave = () => {
		const id = setTimeout(() => {
			setOpen(false);
		}, 150);
		setTimeoutId(id);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
				<PopoverTrigger asChild>{trigger}</PopoverTrigger>
				<PopoverContent
					align="start"
					className={cn(
						"!w-auto p-0 rounded-xl",
						columns === 2 && "!min-w-[480px]",
						columns === 1 && "!min-w-[240px]"
					)}
					sideOffset={8}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<div className="p-3">
						{title && (
							<div className="mb-2 flex items-center justify-between">
								<h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
									{title}
								</h4>
								{showViewAll && viewAllHref && (
									<Link
										href={viewAllHref}
										className="flex items-center gap-1 text-xs font-medium text-primary transition-all hover:gap-1.5 hover:underline"
									>
										View all
										<ArrowRight className="size-3" />
									</Link>
								)}
							</div>
						)}
						<div className={cn("grid gap-1", columns === 2 ? "grid-cols-2" : "grid-cols-1")}>
							{items.map((item) => (
								<NavDropdownItem key={item.href} item={item} />
							))}
						</div>
						{showViewAll && viewAllHref && title === "Industries We Serve" && (
							<div className="mt-2 border-t border-border pt-2">
								<Link
									href={viewAllHref}
									className="group flex items-center justify-between rounded-lg bg-accent/50 px-3 py-2 transition-all hover:bg-accent"
								>
									<div className="flex items-center gap-3">
										<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
											<Building2 className="size-3.5" />
										</div>
										<div>
											<div className="text-sm font-medium">View all industries</div>
											<div className="text-xs text-muted-foreground">See how Thorbis works for you</div>
										</div>
									</div>
									<ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
								</Link>
							</div>
						)}
					</div>
				</PopoverContent>
			</div>
		</Popover>
	);
}

// Dropdown Item Component
function NavDropdownItem({ item }: { item: NavItem }) {
	const Icon = item.icon;
	return (
		<Link
			href={item.href}
			className="group flex items-start gap-2.5 rounded-lg p-2 transition-colors hover:bg-accent"
		>
			<div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
				<Icon className="size-3.5" />
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 flex-wrap">
					<span className="text-sm font-medium text-foreground leading-tight">{item.title}</span>
					{item.badge && (
						<span className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
							{item.badge}
						</span>
					)}
				</div>
				<p className="mt-0.5 text-xs text-muted-foreground leading-tight">{item.description}</p>
			</div>
		</Link>
	);
}

// Mobile Navigation
function MobileNav() {
	const [open, setOpen] = useState<string | null>(null);

	const toggle = useCallback((id: string) => {
		setOpen((prev) => (prev === id ? null : id));
	}, []);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="lg:hidden min-h-[44px] min-w-[44px]" aria-label="Menu">
					<Menu className="size-5" />
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-full sm:w-80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-0">
				<div className="flex h-full flex-col overflow-y-auto">
					<SheetHeader className="border-b border-border/40 px-4 sm:px-6 py-5">
						<div className="flex items-center justify-between">
							<SheetTitle className="flex items-center gap-3">
								<Image src="/ThorbisLogo.webp" alt="Thorbis" width={32} height={32} className="object-contain" />
								<span className="text-xl font-bold tracking-tight">Thorbis</span>
							</SheetTitle>
						</div>
					</SheetHeader>

					<nav className="flex-1 space-y-2 px-4 py-4">
						<MobileSection title="Platform" id="platform" open={open} onToggle={toggle}>
							<div className="space-y-1">
								{platformFeatures.map((item) => (
									<SheetClose key={item.href} asChild>
										<MobileNavItem item={item} />
									</SheetClose>
								))}
							</div>
						</MobileSection>

						<MobileSection title="Industries" id="industries" open={open} onToggle={toggle}>
							<div className="grid grid-cols-1 gap-1">
								{industries.map((item) => (
									<SheetClose key={item.href} asChild>
										<MobileNavItem item={item} />
									</SheetClose>
								))}
							</div>
						</MobileSection>

						<MobileSection title="Resources" id="resources" open={open} onToggle={toggle}>
							<div className="space-y-1">
								{resources.map((item) => (
									<SheetClose key={item.href} asChild>
										<MobileNavItem item={item} />
									</SheetClose>
								))}
							</div>
						</MobileSection>

						<MobileSection title="Company" id="company" open={open} onToggle={toggle}>
							<div className="space-y-1">
								{company.map((item) => (
									<SheetClose key={item.href} asChild>
										<MobileNavItem item={item} />
									</SheetClose>
								))}
							</div>
						</MobileSection>

						<SheetClose asChild>
							<Link
								href="/pricing"
								className="flex items-center justify-between rounded-xl bg-accent/50 px-4 py-3 transition-colors hover:bg-accent min-h-[44px]"
							>
								<span className="text-sm font-semibold">Pricing</span>
								<Badge className="bg-primary/15 text-primary hover:bg-primary/20 text-xs font-medium">
									$200/mo + usage
								</Badge>
							</Link>
						</SheetClose>

						<div className="mt-4 space-y-2.5">
							<SheetClose asChild>
								<Button asChild className="w-full rounded-xl bg-primary text-base font-medium shadow-sm hover:shadow-md transition-all min-h-[44px]">
									<Link href="/waitlist" className="flex items-center justify-center">
										Join Waitlist
										<ArrowRight className="ml-2 size-4" />
									</Link>
								</Button>
							</SheetClose>
							<SheetClose asChild>
								<Button asChild variant="outline" className="w-full rounded-xl text-base font-medium min-h-[44px] border-border/40">
									<Link href="/login">Sign In</Link>
								</Button>
							</SheetClose>
						</div>
					</nav>
				</div>
			</SheetContent>
		</Sheet>
	);
}

function MobileNavItem({ item }: { item: NavItem }) {
	const Icon = item.icon;
	return (
		<Link
			href={item.href}
			className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent/70 active:bg-accent min-h-[44px]"
		>
			<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
				<Icon className="size-4" strokeWidth={2} />
			</div>
			<div className="flex flex-col flex-1 min-w-0">
				<span className="leading-tight font-medium">{item.title}</span>
				<span className="text-xs text-muted-foreground leading-tight mt-0.5">{item.description}</span>
			</div>
			{item.badge && (
				<Badge className="bg-primary/10 text-primary text-[10px] font-medium shrink-0">
					{item.badge}
				</Badge>
			)}
		</Link>
	);
}

function MobileSection({
	title,
	id,
	open,
	onToggle,
	children,
}: {
	title: string;
	id: string;
	open: string | null;
	onToggle: (id: string) => void;
	children: React.ReactNode;
}) {
	const isOpen = open === id;
	return (
		<div className="space-y-1">
			<button
				type="button"
				onClick={() => onToggle(id)}
				className="flex w-full items-center justify-between rounded-xl bg-accent/50 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent active:bg-accent min-h-[44px]"
			>
				<span>{title}</span>
				<ChevronDown
					className={cn(
						"size-4 text-muted-foreground transition-transform duration-200",
						isOpen && "rotate-180 text-primary"
					)}
				/>
			</button>
			<div
				className={cn(
					"grid transition-all duration-200 ease-in-out",
					isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
				)}
			>
				<div className="overflow-hidden pt-1">{children}</div>
			</div>
		</div>
	);
}

// Main Header
export function MarketingHeader() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2 sm:gap-3 transition-opacity hover:opacity-80 shrink-0">
					<Image src="/ThorbisLogo.webp" alt="Thorbis" width={32} height={32} className="object-contain size-7 sm:size-8" />
					<span className="text-lg sm:text-xl font-bold tracking-tight">Thorbis</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden lg:flex items-center gap-1">
					<NavDropdown
						trigger={
							<Button
								variant="ghost"
								className="h-10 rounded-lg px-4 text-base font-medium text-foreground transition-colors hover:bg-accent data-[state=open]:bg-accent"
							>
								Platform
								<ChevronDown className="ml-1 size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
							</Button>
						}
						items={platformFeatures}
						title="Platform Features"
						showViewAll
						viewAllHref="/solutions"
						columns={2}
					/>

					<NavDropdown
						trigger={
							<Button
								variant="ghost"
								className="h-10 rounded-lg px-4 text-base font-medium text-foreground transition-colors hover:bg-accent data-[state=open]:bg-accent"
							>
								Industries
								<ChevronDown className="ml-1 size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
							</Button>
						}
						items={industries}
						title="Industries We Serve"
						showViewAll
						viewAllHref="/industries"
						columns={2}
					/>

					<NavDropdown
						trigger={
							<Button
								variant="ghost"
								className="h-10 rounded-lg px-4 text-base font-medium text-foreground transition-colors hover:bg-accent data-[state=open]:bg-accent"
							>
								Resources
								<ChevronDown className="ml-1 size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
							</Button>
						}
						items={resources}
						columns={1}
					/>

					<NavDropdown
						trigger={
							<Button
								variant="ghost"
								className="h-10 rounded-lg px-4 text-base font-medium text-foreground transition-colors hover:bg-accent data-[state=open]:bg-accent"
							>
								Company
								<ChevronDown className="ml-1 size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
							</Button>
						}
						items={company}
						columns={1}
					/>

					<Link
						href="/pricing"
						className="inline-flex h-10 items-center gap-2 rounded-lg px-4 text-base font-medium text-foreground transition-colors hover:bg-accent"
					>
						Pricing
						<Badge className="bg-primary/15 text-primary hover:bg-primary/20 text-xs font-medium">
							$200/mo + usage
						</Badge>
					</Link>
				</nav>

				{/* Actions */}
				<div className="flex items-center gap-2 sm:gap-3 shrink-0">
					<Button asChild variant="ghost" size="default" className="hidden rounded-lg text-sm sm:text-base font-medium md:inline-flex">
						<Link href="/login">Sign in</Link>
					</Button>
					<Button asChild size="default" className="hidden rounded-lg bg-primary px-4 sm:px-6 text-sm sm:text-base font-medium shadow-sm transition-all hover:shadow-md md:inline-flex">
						<Link href="/waitlist">
							Get Started
							<ArrowRight className="ml-2 size-4" />
						</Link>
					</Button>
					<MobileNav />
				</div>
			</div>
		</header>
	);
}
