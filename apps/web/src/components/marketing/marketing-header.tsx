/**
 * Marketing Header - Server Component
 *
 * Header component for marketing/public pages:
 * - Homepage, Pricing, Features, Industries
 * - Includes navigation and CTA buttons
 * - Server Component (no "use client")
 */

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
	return (
		<header className="border-border/50 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
			<div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<Link className="flex items-center gap-2" href="/">
					<Image
						alt="Thorbis"
						className="size-8"
						height={32}
						src="/ThorbisLogo.webp"
						width={32}
					/>
					<span className="text-foreground text-xl font-bold">Thorbis</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden items-center gap-6 md:flex">
					<Link
						href="/features"
						className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
					>
						Features
					</Link>
					<Link
						href="/industries"
						className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
					>
						Industries
					</Link>
					<Link
						href="/pricing"
						className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
					>
						Pricing
					</Link>
					<Link
						href="/kb"
						className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
					>
						Resources
					</Link>
				</nav>

				{/* CTA Buttons */}
				<div className="flex items-center gap-3">
					<Button asChild variant="ghost" className="hidden sm:inline-flex">
						<Link href="/login">Sign In</Link>
					</Button>
					<Button asChild>
						<Link href="/signup">Get Started</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
