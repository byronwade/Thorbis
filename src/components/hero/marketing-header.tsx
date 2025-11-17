"use client";

import { ChevronDown, LayoutDashboard, Menu, Plus, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { UserMenu } from "@/components/layout/user-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { UserProfile } from "@/lib/auth/user-data";
import { isOnboardingComplete } from "@/lib/onboarding/status";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const CTA_LINK = { label: "Get Started", href: "/register" } as const;

type NavItem = {
	label: string;
	href: string;
	description: string;
	badge?: string;
};

type NavSection = {
	label: string;
	href: string;
	description?: string;
	items?: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
	{
		label: "Solutions",
		href: "/solutions",
		description: "Complete automation suite for modern service businesses",
		items: [
			{
				label: "AI Assistant",
				href: "/features/ai-assistant",
				description: "24/7 intelligent call handling and booking automation",
				badge: "AI",
			},
			{
				label: "Scheduling & Dispatch",
				href: "/features/scheduling",
				description: "Smart routing and real-time crew coordination",
			},
			{
				label: "Mobile Field App",
				href: "/features/mobile-app",
				description: "Offline-first mobile experience for technicians",
			},
			{
				label: "CRM & Sales",
				href: "/features/crm",
				description: "Customer intelligence and pipeline management",
			},
			{
				label: "Invoicing & Payments",
				href: "/features/invoicing",
				description: "Zero-fee payment processing with instant deposits",
				badge: "0% Fees",
			},
			{
				label: "QuickBooks Sync",
				href: "/features/quickbooks",
				description: "Bidirectional accounting integration",
			},
			{
				label: "Marketing Automation",
				href: "/features/marketing",
				description: "Automated campaigns and review generation",
			},
			{
				label: "Customer Portal",
				href: "/features/customer-portal",
				description: "Branded self-service booking and payments",
			},
		],
	},
	{
		label: "Industries",
		href: "/industries",
		description: "Industry-specific workflows and best practices",
		items: [
			{
				label: "HVAC",
				href: "/industries/hvac",
				description: "Seasonal operations and maintenance contracts",
			},
			{
				label: "Plumbing",
				href: "/industries/plumbing",
				description: "Emergency dispatch and service routing",
			},
			{
				label: "Electrical",
				href: "/industries/electrical",
				description: "Project management and compliance tracking",
			},
			{
				label: "Landscaping",
				href: "/industries/landscaping",
				description: "Route optimization and recurring services",
			},
			{
				label: "Pool Service",
				href: "/industries/pool-service",
				description: "Chemical tracking and maintenance schedules",
			},
			{
				label: "Pest Control",
				href: "/industries/pest-control",
				description: "Treatment plans and renewal automation",
			},
			{
				label: "Cleaning Services",
				href: "/industries/cleaning",
				description: "Quality checklists and team coordination",
			},
			{
				label: "Roofing",
				href: "/industries/roofing",
				description: "Project tracking and progress documentation",
			},
		],
	},
	{
		label: "Resources",
		href: "/free-tools",
		description: "Tools, guides, and community resources",
		items: [
			{
				label: "Blog",
				href: "/blog",
				description: "Industry insights and growth strategies",
			},
			{
				label: "Case Studies",
				href: "/case-studies",
				description: "Real results from service businesses",
			},
			{
				label: "Free Tools",
				href: "/tools/calculators",
				description: "Business calculators and planning tools",
				badge: "Free",
			},
			{
				label: "ROI Calculator",
				href: "/roi",
				description: "Calculate your potential savings",
				badge: "Popular",
			},
			{
				label: "Help Center",
				href: "/help",
				description: "Guides, tutorials, and documentation",
			},
			{
				label: "API Docs",
				href: "/api-docs",
				description: "Developer documentation and webhooks",
			},
			{
				label: "Community",
				href: "/community",
				description: "Connect with other operators",
			},
		],
	},
	{
		label: "Company",
		href: "/about",
		description: "About Thorbis and our mission",
		items: [
			{
				label: "About Us",
				href: "/about",
				description: "Our story and values",
			},
			{
				label: "Careers",
				href: "/careers",
				description: "Join our growing team",
				badge: "Hiring",
			},
			{
				label: "Contact Sales",
				href: "/contact",
				description: "Schedule a personalized demo",
			},
			{
				label: "Security",
				href: "/security",
				description: "Enterprise-grade data protection",
			},
		],
	},
];

function DesktopNavItem({ section }: { section: NavSection }) {
	const [isOpen, setIsOpen] = useState(false);

	if (!section.items || section.items.length === 0) {
		return (
			<Link
				className="group text-foreground/70 hover:bg-accent/50 hover:text-foreground relative inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all"
				href={section.href}
			>
				{section.label}
				<span className="bg-primary absolute inset-x-0 -bottom-px h-0.5 scale-x-0 transition-transform group-hover:scale-x-100" />
			</Link>
		);
	}

	return (
		<div
			className="relative"
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			<button
				className="group text-foreground/70 hover:bg-accent/50 hover:text-foreground relative inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all"
				type="button"
			>
				{section.label}
				<ChevronDown
					className={cn("size-3.5 transition-transform duration-200", isOpen && "rotate-180")}
				/>
				<span className="bg-primary absolute inset-x-0 -bottom-px h-0.5 scale-x-0 transition-transform group-hover:scale-x-100" />
			</button>

			{isOpen && (
				<div className="absolute top-full left-0 z-50 pt-3">
					<div className="fade-in-0 zoom-in-95 slide-in-from-top-2 animate-in border-border/50 bg-background w-[680px] overflow-hidden rounded-2xl border shadow-2xl duration-200">
						{section.description && (
							<div className="border-border/50 from-primary/5 via-primary/3 border-b bg-gradient-to-br to-transparent p-5">
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-primary text-xs font-semibold tracking-wider uppercase">
											{section.label}
										</p>
										<p className="text-muted-foreground mt-1.5 max-w-md text-sm leading-relaxed">
											{section.description}
										</p>
									</div>
									<Link
										className="group border-border/60 bg-background text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold whitespace-nowrap shadow-sm transition-all"
										href={section.href}
									>
										View all
										<ChevronDown className="size-3 -rotate-90 transition-transform group-hover:translate-x-0.5" />
									</Link>
								</div>
							</div>
						)}

						<div className="grid grid-cols-2 gap-1 p-2">
							{section.items.map((item) => (
								<Link
									className="group hover:bg-accent/60 relative overflow-hidden rounded-xl p-3.5 transition-all"
									href={item.href}
									key={item.href}
								>
									<div className="flex items-start justify-between gap-2">
										<div className="flex-1">
											<div className="mb-1 flex items-center gap-2">
												<span className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
													{item.label}
												</span>
												{item.badge && (
													<Badge
														className="h-5 px-1.5 text-[10px] font-semibold"
														variant="secondary"
													>
														{item.badge}
													</Badge>
												)}
											</div>
											<p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
												{item.description}
											</p>
										</div>
										<ChevronDown className="text-muted-foreground/40 group-hover:text-primary size-3.5 -rotate-90 transition-all group-hover:translate-x-0.5" />
									</div>
									<div className="from-primary/0 via-primary/0 to-primary/5 absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100" />
								</Link>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

type UserCompany = {
	id: string;
	name: string;
	plan: string;
	onboardingComplete?: boolean;
	hasPayment?: boolean;
};

export function MarketingHeader() {
	const [scrolled, setScrolled] = useState(false);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
	const [userCompanies, setUserCompanies] = useState<UserCompany[]>([]);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const supabase = createClient();
		if (!supabase) {
			setLoading(false);
			return;
		}

		let cancelled = false;

		const loadProfile = async () => {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (!user) {
					if (!cancelled) {
						setUserProfile(null);
						setLoading(false);
					}
					return;
				}

				const { data: profile } = await supabase
					.from("users")
					.select("*")
					.eq("id", user.id)
					.single();

				if (cancelled) {
					return;
				}

				const fallbackName = user.user_metadata?.name || user.email?.split("@")[0] || "User";
				const fallbackEmail = user.email || profile?.email || "";
				const fallbackAvatar =
					profile?.avatar ||
					user.user_metadata?.avatar_url ||
					`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
						fallbackEmail || fallbackName
					)}&backgroundColor=0ea5e9&textColor=ffffff`;

				setUserProfile({
					id: user.id,
					name: profile?.name || fallbackName,
					email: fallbackEmail,
					avatar: fallbackAvatar,
					bio: profile?.bio || undefined,
					phone: profile?.phone || undefined,
					emailVerified: !!user.email_confirmed_at || profile?.emailVerified,
					createdAt: new Date(profile?.createdAt || user.created_at),
				});

				// Fetch user's companies
				const { data: memberships } = await supabase
					.from("team_members")
					.select(
						`
            company_id,
            companies!inner (
              id,
              name,
              stripe_subscription_status,
              onboarding_progress,
              onboarding_completed_at,
              deleted_at
            )
          `
					)
					.eq("user_id", user.id)
					.eq("status", "active")
					.is("companies.deleted_at", null);

				if (memberships && !cancelled) {
					const companyMap = new Map<string, UserCompany>();
					memberships.forEach((m: any) => {
						const companyId = m.companies.id;
						if (!companyMap.has(companyId)) {
							const subscriptionStatus = m.companies.stripe_subscription_status;
							const hasPayment =
								subscriptionStatus === "active" || subscriptionStatus === "trialing";
							const onboardingProgress =
								(m.companies.onboarding_progress as Record<string, unknown>) || null;
							const onboardingComplete = isOnboardingComplete({
								progress: onboardingProgress,
								completedAt: m.companies.onboarding_completed_at ?? null,
							});

							let planLabel = "Active";
							if (!(hasPayment && onboardingComplete)) {
								planLabel = subscriptionStatus === "incomplete" ? "Incomplete" : "Setup Required";
							}

							companyMap.set(companyId, {
								id: companyId,
								name: m.companies.name,
								plan: planLabel,
								onboardingComplete,
								hasPayment,
							});
						}
					});

					setUserCompanies(Array.from(companyMap.values()));
				}

				setLoading(false);
			} catch (_error) {
				if (!cancelled) {
					setUserProfile(null);
					setLoading(false);
				}
			}
		};

		loadProfile();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (session?.user) {
				loadProfile();
			} else {
				setUserProfile(null);
				setLoading(false);
			}
		});

		return () => {
			cancelled = true;
			subscription.unsubscribe();
		};
	}, []);

	useEffect(() => {
		const onScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const mobileNavSections = useMemo(
		() =>
			NAV_SECTIONS.map((section) => ({
				...section,
				items: section.items ?? [],
			})),
		[]
	);

	const toggleSection = (sectionLabel: string) => {
		setExpandedSections((prev) => {
			const next = new Set(prev);
			if (next.has(sectionLabel)) {
				next.delete(sectionLabel);
			} else {
				next.add(sectionLabel);
			}
			return next;
		});
	};

	if (!mounted) {
		return (
			<header className="border-border/40 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-xl">
				<div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
					<Link
						className="text-foreground flex items-center gap-2.5 text-lg font-bold tracking-tight"
						href="/"
					>
						<div className="from-foreground/10 to-foreground/5 ring-border/50 flex size-8 items-center justify-center rounded-lg bg-gradient-to-br ring-1">
							<Image
								alt="Thorbis"
								className="size-5"
								height={20}
								src="/ThorbisLogo.webp"
								width={20}
							/>
						</div>
						<span className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-transparent">
							Thorbis
						</span>
					</Link>
				</div>
			</header>
		);
	}

	return (
		<header
			className={cn(
				"border-border/40 bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300",
				scrolled && "border-border/60 shadow-lg shadow-black/5"
			)}
		>
			<div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<Link
					className="text-foreground flex items-center gap-2.5 text-lg font-bold tracking-tight transition-opacity hover:opacity-80"
					href="/"
				>
					<div className="from-foreground/10 to-foreground/5 ring-border/50 hover:ring-border flex size-8 items-center justify-center rounded-lg bg-gradient-to-br ring-1 transition-all hover:scale-105">
						<Image
							alt="Thorbis"
							className="size-5"
							height={20}
							src="/ThorbisLogo.webp"
							width={20}
						/>
					</div>
					<span className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-transparent">
						Thorbis
					</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden flex-1 justify-center lg:flex">
					<div className="flex items-center gap-0.5">
						{NAV_SECTIONS.map((section) => (
							<DesktopNavItem key={section.label} section={section} />
						))}
						<Link
							className="group bg-primary/10 text-primary hover:bg-primary/15 relative ml-2 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all"
							href="/pricing"
						>
							Pricing
							<Badge className="bg-primary text-primary-foreground h-4 px-1.5 text-[9px] font-bold">
								$100/mo
							</Badge>
						</Link>
					</div>
				</nav>

				{/* Desktop Actions */}
				<div className="hidden items-center gap-2 lg:flex">
					{!loading && userProfile ? (
						<>
							<Button asChild size="sm" variant="ghost">
								<Link className="font-medium" href="/dashboard">
									<LayoutDashboard className="mr-2 size-4" />
									Dashboard
								</Link>
							</Button>
							<UserMenu
								activeCompanyId={userCompanies[0]?.id || null}
								teams={userCompanies.map((company) => ({
									id: company.id,
									name: company.name,
									logo: Wrench,
									plan: company.plan.toLowerCase(),
								}))}
								user={{
									name: userProfile.name,
									email: userProfile.email ?? "",
									avatar: userProfile.avatar ?? "",
								}}
							/>
						</>
					) : (
						<>
							<Button asChild size="sm" variant="ghost">
								<Link className="font-medium" href="/login">
									Sign in
								</Link>
							</Button>
							<Button asChild className="shadow-primary/20 shadow-lg" size="sm">
								<Link href={CTA_LINK.href}>
									{CTA_LINK.label}
									<ChevronDown className="ml-1.5 size-3.5 -rotate-90" />
								</Link>
							</Button>
						</>
					)}
				</div>

				{/* Mobile Menu */}
				<Sheet onOpenChange={setMobileOpen} open={mobileOpen}>
					<SheetTrigger asChild>
						<Button aria-label="Open navigation" className="lg:hidden" size="icon" variant="ghost">
							<Menu className="size-5" />
						</Button>
					</SheetTrigger>
					<SheetContent className="w-[90vw] overflow-y-auto p-0 sm:max-w-sm" side="right">
						<SheetTitle className="sr-only">Navigation Menu</SheetTitle>

						{/* Mobile Header */}
						<div className="border-border/50 bg-background/95 sticky top-0 z-10 flex items-center gap-2.5 border-b px-5 py-4 backdrop-blur-sm">
							<div className="from-foreground/10 to-foreground/5 ring-border/50 flex size-7 items-center justify-center rounded-lg bg-gradient-to-br ring-1">
								<Image
									alt="Thorbis"
									className="size-4"
									height={16}
									src="/ThorbisLogo.webp"
									width={16}
								/>
							</div>
							<span className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-base font-bold text-transparent">
								Thorbis
							</span>
						</div>

						{/* Mobile Navigation */}
						<div className="space-y-2 p-4">
							{mobileNavSections.map((section) => {
								const isExpanded = expandedSections.has(section.label);
								const hasItems = section.items.length > 0;

								return (
									<div
										className="border-border/50 from-muted/30 to-muted/10 overflow-hidden rounded-xl border bg-gradient-to-br"
										key={section.label}
									>
										<div className="flex items-stretch">
											{hasItems && (
												<button
													className="border-border/50 hover:bg-accent flex items-center justify-center border-r px-3 transition-colors"
													onClick={() => toggleSection(section.label)}
													type="button"
												>
													<ChevronDown
														className={cn(
															"text-muted-foreground size-4 transition-transform duration-200",
															isExpanded && "rotate-180"
														)}
													/>
												</button>
											)}
											<Link
												className="hover:bg-accent flex flex-1 items-center justify-between px-4 py-3 transition-colors"
												href={section.href}
												onClick={() => setMobileOpen(false)}
											>
												<span className="text-foreground text-sm font-semibold">
													{section.label}
												</span>
												<ChevronDown className="text-muted-foreground size-4 -rotate-90" />
											</Link>
										</div>

										{hasItems && isExpanded && (
											<div className="border-border/50 bg-background/50 space-y-1 border-t p-2">
												{section.items.map((item) => (
													<Link
														className="group hover:bg-accent block rounded-lg p-3 transition-all"
														href={item.href}
														key={item.href}
														onClick={() => setMobileOpen(false)}
													>
														<div className="mb-1 flex items-center gap-2">
															<span className="text-foreground group-hover:text-primary text-xs font-semibold transition-colors">
																{item.label}
															</span>
															{item.badge && (
																<Badge
																	className="h-4 px-1.5 text-[9px] font-semibold"
																	variant="secondary"
																>
																	{item.badge}
																</Badge>
															)}
														</div>
														<p className="text-muted-foreground line-clamp-2 text-[11px] leading-relaxed">
															{item.description}
														</p>
													</Link>
												))}
											</div>
										)}
									</div>
								);
							})}

							{/* Pricing Card */}
							<Link
								className="border-primary/30 from-primary/10 via-primary/5 hover:border-primary/50 hover:shadow-primary/10 flex items-center justify-between overflow-hidden rounded-xl border bg-gradient-to-br to-transparent p-4 transition-all hover:shadow-lg"
								href="/pricing"
								onClick={() => setMobileOpen(false)}
							>
								<div>
									<span className="text-foreground text-sm font-semibold">Pricing</span>
									<p className="text-muted-foreground text-[11px]">Flat $100/mo base plus usage</p>
								</div>
								<Badge className="bg-primary text-primary-foreground px-2 py-1 text-xs font-bold">
									$100/mo
								</Badge>
							</Link>
						</div>

						{/* Mobile Footer */}
						<div className="border-border/50 from-background via-background to-background/95 sticky bottom-0 border-t bg-gradient-to-t p-4 backdrop-blur-sm">
							{!loading && userProfile ? (
								<div className="space-y-3">
									<div className="border-border/50 from-muted/50 to-muted/20 rounded-xl border bg-gradient-to-br p-3">
										<p className="text-foreground text-xs font-semibold">{userProfile.name}</p>
										<p className="text-muted-foreground text-[11px]">{userProfile.email}</p>
									</div>
									<Button asChild className="shadow-primary/20 w-full shadow-lg" size="default">
										<Link href="/dashboard" onClick={() => setMobileOpen(false)}>
											<LayoutDashboard className="mr-2 size-4" />
											Go to Dashboard
										</Link>
									</Button>
								</div>
							) : (
								<div className="space-y-2">
									<Button asChild className="w-full" size="default" variant="outline">
										<Link href="/login" onClick={() => setMobileOpen(false)}>
											Sign in
										</Link>
									</Button>
									<Button asChild className="shadow-primary/20 w-full shadow-lg" size="default">
										<Link href={CTA_LINK.href} onClick={() => setMobileOpen(false)}>
											<Plus className="mr-2 size-4" />
											{CTA_LINK.label}
										</Link>
									</Button>
								</div>
							)}
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
