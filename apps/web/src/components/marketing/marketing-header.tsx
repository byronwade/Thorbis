"use client";

import {
	ArrowRight,
	BookOpen,
	Bot,
	Building2,
	Calculator,
	Calendar,
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
	Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
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

// Nav Item Component
function NavLink({ item }: { item: NavItem }) {
	const Icon = item.icon;
	return (
		<Link
			href={item.href}
			className="group flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent"
		>
			<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/50 transition-colors group-hover:bg-primary/10">
				<Icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-1.5">
					<span className="text-sm font-medium">{item.title}</span>
					{item.badge && (
						<Badge variant="secondary" className="h-4 px-1 text-[9px]">
							{item.badge}
						</Badge>
					)}
				</div>
				<p className="text-xs text-muted-foreground truncate">{item.description}</p>
			</div>
		</Link>
	);
}

// Simple list item for compact menus
function NavLinkCompact({ item }: { item: NavItem }) {
	const Icon = item.icon;
	return (
		<Link
			href={item.href}
			className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-accent"
		>
			<Icon className="size-4 text-muted-foreground" />
			<span>{item.title}</span>
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
				<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
					<Menu className="size-5" />
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-80 overflow-y-auto">
				<SheetHeader>
					<SheetTitle className="flex items-center gap-2">
						<Image src="/ThorbisLogo.webp" alt="Thorbis" width={24} height={24} />
						Thorbis
					</SheetTitle>
				</SheetHeader>

				<nav className="mt-6 space-y-1">
					<MobileSection title="Platform" id="platform" open={open} onToggle={toggle}>
						{platformFeatures.map((item) => (
							<SheetClose key={item.href} asChild>
								<NavLinkCompact item={item} />
							</SheetClose>
						))}
					</MobileSection>

					<MobileSection title="Industries" id="industries" open={open} onToggle={toggle}>
						<div className="grid grid-cols-2 gap-1">
							{industries.map((item) => (
								<SheetClose key={item.href} asChild>
									<NavLinkCompact item={item} />
								</SheetClose>
							))}
						</div>
					</MobileSection>

					<MobileSection title="Resources" id="resources" open={open} onToggle={toggle}>
						{resources.map((item) => (
							<SheetClose key={item.href} asChild>
								<NavLinkCompact item={item} />
							</SheetClose>
						))}
					</MobileSection>

					<MobileSection title="Company" id="company" open={open} onToggle={toggle}>
						{company.map((item) => (
							<SheetClose key={item.href} asChild>
								<NavLinkCompact item={item} />
							</SheetClose>
						))}
					</MobileSection>

					<Separator className="my-4" />

					<SheetClose asChild>
						<Link
							href="/pricing"
							className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5"
						>
							<span className="text-sm font-medium">Pricing</span>
							<Badge>$200/mo</Badge>
						</Link>
					</SheetClose>

					<div className="pt-4 space-y-2">
						<SheetClose asChild>
							<Button asChild className="w-full">
								<Link href="/waitlist">
									Join Waitlist
									<ArrowRight className="ml-2 size-4" />
								</Link>
							</Button>
						</SheetClose>
						<SheetClose asChild>
							<Button asChild variant="outline" className="w-full">
								<Link href="/login">Sign In</Link>
							</Button>
						</SheetClose>
					</div>
				</nav>
			</SheetContent>
		</Sheet>
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
		<div className="border-b border-border/50">
			<button
				type="button"
				onClick={() => onToggle(id)}
				className="flex w-full items-center justify-between py-3 text-sm font-medium"
			>
				{title}
				<svg
					className={cn("size-4 text-muted-foreground transition-transform", isOpen && "rotate-180")}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>
			{isOpen && <div className="pb-3">{children}</div>}
		</div>
	);
}

// Main Header
export function MarketingHeader() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2.5 font-bold">
					<div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-muted/30">
						<Image src="/ThorbisLogo.webp" alt="Thorbis" width={20} height={20} />
					</div>
					<span>Thorbis</span>
				</Link>

				{/* Desktop Nav */}
				<NavigationMenu className="hidden lg:flex">
					<NavigationMenuList>
						{/* Platform */}
						<NavigationMenuItem>
							<NavigationMenuTrigger>Platform</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="w-[400px] p-3">
									<div className="grid gap-1">
										{platformFeatures.map((item) => (
											<NavigationMenuLink key={item.href} asChild>
												<NavLink item={item} />
											</NavigationMenuLink>
										))}
									</div>
									<Separator className="my-3" />
									<Link
										href="/solutions"
										className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
									>
										<Layers className="size-4" />
										View all features
										<ArrowRight className="ml-auto size-3" />
									</Link>
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>

						{/* Industries */}
						<NavigationMenuItem>
							<NavigationMenuTrigger>Industries</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="w-[480px] p-3">
									<div className="grid grid-cols-2 gap-1">
										{industries.map((item) => (
											<NavigationMenuLink key={item.href} asChild>
												<NavLink item={item} />
											</NavigationMenuLink>
										))}
									</div>
									<Separator className="my-3" />
									<Link
										href="/industries"
										className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
									>
										<Building2 className="size-4" />
										View all industries
										<ArrowRight className="ml-auto size-3" />
									</Link>
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>

						{/* Resources */}
						<NavigationMenuItem>
							<NavigationMenuTrigger>Resources</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="w-[280px] p-3">
									<div className="grid gap-1">
										{resources.map((item) => (
											<NavigationMenuLink key={item.href} asChild>
												<NavLink item={item} />
											</NavigationMenuLink>
										))}
									</div>
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>

						{/* Company */}
						<NavigationMenuItem>
							<NavigationMenuTrigger>Company</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="w-[240px] p-3">
									<div className="grid gap-1">
										{company.map((item) => (
											<NavigationMenuLink key={item.href} asChild>
												<NavLink item={item} />
											</NavigationMenuLink>
										))}
									</div>
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>

						{/* Pricing */}
						<NavigationMenuItem>
							<Link
								href="/pricing"
								className="inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
							>
								Pricing
							</Link>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				{/* Actions */}
				<div className="flex items-center gap-2">
					<Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
						<Link href="/login">Sign in</Link>
					</Button>
					<Button asChild size="sm" className="hidden sm:inline-flex">
						<Link href="/waitlist">
							Get Started
							<ArrowRight className="ml-1.5 size-3.5" />
						</Link>
					</Button>
					<MobileNav />
				</div>
			</div>
		</header>
	);
}
