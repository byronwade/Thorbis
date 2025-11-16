/**
 * Footer - Server Component
 *
 * Comprehensive mega footer with extensive link structure for SEO
 * - Server Component (no "use client")
 * - Static content rendered on server
 * - Organized by Solutions, Industries, Resources, Company, Legal
 */

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
	const currentYear = 2025;

	return (
		<footer className="border-border/50 border-t bg-muted/30">
			<div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
				{/* Main Footer Content */}
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
					{/* Company Info - Takes 2 columns */}
					<div className="lg:col-span-2">
						<Link className="mb-4 flex items-center gap-2" href="/">
							<Image
								alt="Thorbis"
								className="size-8"
								height={32}
								src="/ThorbisLogo.webp"
								width={32}
							/>
							<span className="font-bold text-foreground text-xl">Thorbis</span>
						</Link>
						<p className="mb-6 text-muted-foreground text-sm leading-relaxed">
							The next-generation field service management platform built for
							contractors who demand control, speed, and visibility. Powered by
							AI.
						</p>

						{/* Newsletter */}
						<div className="mb-6">
							<h4 className="mb-3 font-semibold text-foreground text-sm">
								Stay Updated
							</h4>
							<p className="mb-3 text-muted-foreground text-xs">
								Get the latest features and industry insights.
							</p>
							<form className="flex gap-2">
								<Input
									className="h-9 bg-background text-sm"
									placeholder="Enter your email"
									type="email"
								/>
								<Button
									className="h-9 bg-primary text-primary-foreground hover:bg-primary/90"
									size="sm"
								>
									Subscribe
								</Button>
							</form>
						</div>

						{/* Social Links */}
						<div className="flex gap-3">
							<a
								aria-label="LinkedIn"
								className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:bg-muted/60 hover:text-foreground"
								href="https://linkedin.com"
								rel="noopener noreferrer"
								target="_blank"
							>
								<svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
								</svg>
							</a>
							<a
								aria-label="Twitter"
								className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:bg-muted/60 hover:text-foreground"
								href="https://twitter.com"
								rel="noopener noreferrer"
								target="_blank"
							>
								<svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
							</a>
							<a
								aria-label="YouTube"
								className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:bg-muted/60 hover:text-foreground"
								href="https://youtube.com"
								rel="noopener noreferrer"
								target="_blank"
							>
								<svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
								</svg>
							</a>
						</div>

						{/* Mobile Apps - Coming Soon */}
						<div className="mt-6">
							<h4 className="mb-3 font-semibold text-foreground text-sm">
								Mobile Apps Coming Soon
							</h4>
							<div className="flex flex-col gap-2 sm:flex-row">
								<div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 opacity-60">
									<svg
										className="size-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
									</svg>
									<div className="flex flex-col">
										<span className="font-medium text-xs">Coming Soon</span>
										<span className="text-[10px] text-muted-foreground">
											App Store
										</span>
									</div>
								</div>
								<div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 opacity-60">
									<svg
										className="size-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
									</svg>
									<div className="flex flex-col">
										<span className="font-medium text-xs">Coming Soon</span>
										<span className="text-[10px] text-muted-foreground">
											Google Play
										</span>
									</div>
								</div>
							</div>
							<p className="mt-2 text-muted-foreground text-xs">
								iOS & Android apps for iPhone, iPad & tablets launching Q2 2025
							</p>
						</div>
					</div>

					{/* Solutions Column */}
					<div>
						<h4 className="mb-4 font-semibold text-foreground text-sm">
							Solutions
						</h4>
						<ul className="space-y-2.5">
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/solutions"
								>
									Solutions Overview
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/features/ai-assistant"
								>
									AI Assistant
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/features/scheduling"
								>
									Scheduling & Dispatch
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/features/mobile-app"
								>
									Mobile Field App
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/features/crm"
								>
									CRM & Sales
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/features/invoicing"
								>
									Invoicing & Payments
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/features/quickbooks"
								>
									QuickBooks Sync
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/features/marketing"
								>
									Marketing Automation
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/features/customer-portal"
								>
									Customer Portal
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/features"
								>
									All Features →
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/switch"
								>
									Switch to Thorbis
								</Link>
							</li>
						</ul>
					</div>

					{/* Industries Column */}
					<div>
						<h4 className="mb-4 font-semibold text-foreground text-sm">
							Industries
						</h4>
						<ul className="space-y-2.5">
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/industries/hvac"
								>
									HVAC
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/industries/plumbing"
								>
									Plumbing
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/industries/electrical"
								>
									Electrical
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/industries/landscaping"
								>
									Landscaping
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/industries/pool-service"
								>
									Pool Service
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/industries/pest-control"
								>
									Pest Control
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/industries/cleaning"
								>
									Cleaning Services
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/industries/roofing"
								>
									Roofing
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/industries"
								>
									All Industries →
								</Link>
							</li>
						</ul>
					</div>

					{/* Resources Column */}
					<div>
						<h4 className="mb-4 font-semibold text-foreground text-sm">
							Resources
						</h4>
						<ul className="space-y-2.5">
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/blog"
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/case-studies"
								>
									Case Studies
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/tools/calculators"
								>
									Free Tools
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/webinars"
								>
									Webinars & Events
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/integrations"
								>
									Integrations Directory
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/roi"
								>
									ROI Calculator
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/help"
								>
									Help Center
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/api-docs"
								>
									API Documentation
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/community"
								>
									Community Forum
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/templates"
								>
									Templates & Tools
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/free-tools"
								>
									Free Tools Library
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/reviews"
								>
									Reviews & Testimonials
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/status"
								>
									System Status
								</Link>
							</li>
						</ul>
					</div>

					{/* Company Column */}
					<div>
						<h4 className="mb-4 font-semibold text-foreground text-sm">
							Company
						</h4>
						<ul className="space-y-2.5">
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/about"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/pricing"
								>
									Pricing
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/careers"
								>
									Careers
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/partners"
								>
									Partners
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/press"
								>
									Press & Media
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/contact"
								>
									Contact Sales
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/register"
								>
									Create Account
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/implementation"
								>
									Implementation & Success
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/security"
								>
									Security
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Comparison Links Section */}
				<div className="mt-10 border-border/50 border-t pt-8">
					<h4 className="mb-4 font-semibold text-foreground text-sm">
						Compare Thorbis
					</h4>
					<div className="flex flex-wrap gap-x-6 gap-y-2">
						<Link
							className="text-muted-foreground text-xs transition-colors hover:text-foreground"
							href="/vs/servicetitan"
						>
							vs ServiceTitan
						</Link>
						<Link
							className="text-muted-foreground text-xs transition-colors hover:text-foreground"
							href="/vs/housecall-pro"
						>
							vs Housecall Pro
						</Link>
						<Link
							className="text-muted-foreground text-xs transition-colors hover:text-foreground"
							href="/vs/jobber"
						>
							vs Jobber
						</Link>
						<Link
							className="text-muted-foreground text-xs transition-colors hover:text-foreground"
							href="/vs/fieldedge"
						>
							vs FieldEdge
						</Link>
						<Link
							className="text-muted-foreground text-xs transition-colors hover:text-foreground"
							href="/vs/servicem8"
						>
							vs ServiceM8
						</Link>
						<Link
							className="text-muted-foreground text-xs transition-colors hover:text-foreground"
							href="/vs/workiz"
						>
							vs Workiz
						</Link>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-8 border-border/50 border-t pt-8">
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
						<p className="text-muted-foreground text-xs">
							© {currentYear} Thorbis. All rights reserved.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
							<Link
								className="text-muted-foreground text-xs transition-colors hover:text-foreground"
								href="/privacy"
							>
								Privacy Policy
							</Link>
							<Link
								className="text-muted-foreground text-xs transition-colors hover:text-foreground"
								href="/terms"
							>
								Terms of Service
							</Link>
							<Link
								className="text-muted-foreground text-xs transition-colors hover:text-foreground"
								href="/cookies"
							>
								Cookie Policy
							</Link>
							<Link
								className="text-muted-foreground text-xs transition-colors hover:text-foreground"
								href="/gdpr"
							>
								GDPR Compliance
							</Link>
							<Link
								className="text-muted-foreground text-xs transition-colors hover:text-foreground"
								href="/accessibility"
							>
								Accessibility
							</Link>
							<Link
								className="text-muted-foreground text-xs transition-colors hover:text-foreground"
								href="/sitemap"
							>
								Sitemap
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
