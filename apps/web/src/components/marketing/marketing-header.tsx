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



// Simple list item for compact menus
function NavLinkCompact({ item }: { item: NavItem }) {
	const Icon = item.icon;
	return (
		<Link
			href={item.href}
			className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
		>
			<Icon className="size-4" />
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
			<SheetContent side="right" className="w-80 border-l border-border bg-background p-0">
				<div className="flex h-full flex-col overflow-y-auto">
					<SheetHeader className="border-b border-border px-6 py-5">
						<SheetTitle className="flex items-center gap-3">
							<Image src="/ThorbisLogo.webp" alt="Thorbis" width={28} height={28} className="object-contain" />
							<span className="text-xl font-bold tracking-tight">Thorbis</span>
						</SheetTitle>
					</SheetHeader>

					<nav className="flex-1 space-y-1 px-4 py-6">
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

						<div className="my-6 border-t border-border" />

						<SheetClose asChild>
							<Link
								href="/pricing"
								className="flex items-center justify-between rounded-lg bg-accent px-4 py-3.5 transition-colors hover:bg-accent/80"
							>
								<span className="text-sm font-semibold">Pricing</span>
								<Badge variant="secondary" className="text-xs font-medium">
									$200/mo + usage
								</Badge>
							</Link>
						</SheetClose>

						<div className="mt-6 space-y-3">
							<SheetClose asChild>
								<Button asChild className="w-full rounded-lg bg-primary text-base font-medium shadow-sm">
									<Link href="/waitlist">
										Join Waitlist
										<ArrowRight className="ml-2 size-4" />
									</Link>
								</Button>
							</SheetClose>
							<SheetClose asChild>
								<Button asChild variant="outline" className="w-full rounded-lg text-base">
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
		<div className="border-b border-border last:border-0">
			<button
				type="button"
				onClick={() => onToggle(id)}
				className="flex w-full items-center justify-between py-4 text-sm font-medium text-foreground transition-colors hover:text-primary"
			>
				{title}
				<svg
					className={cn("size-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>
			<div
				className={cn(
					"grid transition-all duration-200 ease-in-out",
					isOpen ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0"
				)}
			>
				<div className="overflow-hidden">{children}</div>
			</div>
		</div>
	);
}

// Main Header
export function MarketingHeader() {
	return (
		<header className="sticky top-0 z-50 w-full bg-background shadow-sm">
			<div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
					<Image src="/ThorbisLogo.webp" alt="Thorbis" width={32} height={32} className="object-contain" />
					<span className="text-xl font-bold tracking-tight">Thorbis</span>
				</Link>

				{/* Desktop Nav - Centered */}
				<NavigationMenu className="hidden lg:flex">
					<NavigationMenuList className="gap-2">
						{/* Platform */}
						<NavigationMenuItem>
							<NavigationMenuTrigger className="h-10 rounded-lg bg-transparent px-4 text-base font-medium text-foreground transition-colors hover:bg-accent data-[state=open]:bg-accent">
								Platform
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="w-[520px] p-5">
									<div className="mb-4 flex items-center justify-between px-3">
										<h4 className="text-sm font-semibold text-foreground">Platform Features</h4>
										<Link
											href="/solutions"
											className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
										>
											View all
											<ArrowRight className="size-3.5" />
										</Link>
									</div>
									<div className="grid grid-cols-2 gap-2">
										{platformFeatures.map((item) => (
											<NavigationMenuLink key={item.href} asChild>
												<NavLink item={item} />
											</NavigationMenuLink>
										))}
									</div>
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>

						{/* Industries */}
						<NavigationMenuItem>
							<NavigationMenuTrigger className="h-10 rounded-lg bg-transparent px-4 text-base font-medium text-foreground transition-colors hover:bg-accent data-[state=open]:bg-accent">
								Industries
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="w-[640px] p-5">
									<div className="mb-4 px-3">
										<h4 className="text-sm font-semibold text-foreground">Industries We Serve</h4>
									</div>
									<div className="grid grid-cols-2 gap-2">
										{industries.map((item) => (
											<NavigationMenuLink key={item.href} asChild>
												<NavLink item={item} />
											</NavigationMenuLink>
										))}
									</div>
									<div className="mt-5 border-t border-border pt-4">
										<Link
											href="/industries"
											className="group flex items-center justify-between rounded-lg bg-accent/50 px-5 py-4 transition-colors hover:bg-accent"
										>
											<div className="flex items-center gap-3">
												<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
													<Building2 className="size-5" />
												</div>
												<div>
													<div className="text-sm font-semibold">View all industries</div>
													<div className="text-xs text-muted-foreground">See how Thorbis works for your business</div>
												</div>
											</div>
											<ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
										</Link>
									</div>
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>

						{/* Resources */}
						<NavigationMenuItem>
							<NavigationMenuTrigger className="h-10 rounded-lg bg-transparent px-4 text-base font-medium text-foreground transition-colors hover:bg-accent data-[state=open]:bg-accent">
								Resources
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="w-[340px] p-5">
									<div className="mb-4 px-3">
										<h4 className="text-sm font-semibold text-foreground">Resources</h4>
									</div>
									<div className="grid gap-2">
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
							<NavigationMenuTrigger className="h-10 rounded-lg bg-transparent px-4 text-base font-medium text-foreground transition-colors hover:bg-accent data-[state=open]:bg-accent">
								Company
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="w-[300px] p-5">
									<div className="mb-4 px-3">
										<h4 className="text-sm font-semibold text-foreground">Company</h4>
									</div>
									<div className="grid gap-2">
										{company.map((item) => (
											<NavigationMenuLink key={item.href} asChild>
												<NavLink item={item} />
											</NavigationMenuLink>
										))}
									</div>
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>

						{/* Pricing with Badge */}
						<NavigationMenuItem>
							<Link
								href="/pricing"
								className="inline-flex h-10 items-center gap-2 rounded-lg bg-transparent px-4 text-base font-medium text-foreground transition-colors hover:bg-accent"
							>
								Pricing
								<Badge variant="secondary" className="text-xs font-medium">
									$200/mo + usage
								</Badge>
							</Link>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				{/* Actions */}
				<div className="flex items-center gap-3">
					<Button asChild variant="ghost" size="default" className="hidden rounded-lg text-base font-medium sm:inline-flex">
						<Link href="/login">Sign in</Link>
					</Button>
					<Button asChild size="default" className="hidden rounded-lg bg-primary px-6 text-base font-medium shadow-sm transition-all hover:shadow-md sm:inline-flex">
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

// Nav Item Component - Updated for larger, cleaner design
function NavLink({ item }: { item: NavItem }) {
	const Icon = item.icon;
	return (
		<Link
			href={item.href}
			className="group flex items-start gap-4 rounded-lg p-4 transition-colors hover:bg-accent"
		>
			<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
				<Icon className="size-5" />
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold leading-none text-foreground">{item.title}</span>
					{item.badge && (
						<span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
							{item.badge}
						</span>
					)}
				</div>
				<p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
			</div>
		</Link>
	);
}
