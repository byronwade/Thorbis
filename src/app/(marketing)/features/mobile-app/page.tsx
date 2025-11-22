
import {
	Camera,
	CheckCircle2,
	Cloud,
	FileText,
	MapPin,
	Smartphone,
	Wifi,
	WifiOff,
	Zap,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { RelatedContent } from "@/components/seo/related-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getRelatedFeatures } from "@/lib/seo/content-recommendations";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	generateServiceStructuredData,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";
import {
	createFAQSchema,
	createItemListSchema,
} from "@/lib/seo/structured-data";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const mobileAppKeywords = generateSemanticKeywords("mobile app");

export const metadata = generateSEOMetadata({
	title: "Mobile Field Service App - Offline-First | Thorbis",
	section: "Features",
	description:
		"Empower your technicians with a mobile app that works anywhere. Offline checklists, photo capture, digital signatures, and instant sync when back online.",
	path: "/features/mobile-app",
	keywords: [
		"field service mobile app",
		"offline field app",
		"technician mobile software",
		"field service app",
		"mobile work orders",
		...mobileAppKeywords.slice(0, 5),
	],
});

// FAQ Schema - Optimized for AI Overviews
const faqSchema = createFAQSchema([
	{
		question: "Does the Thorbis mobile app work offline?",
		answer:
			"Yes. The Thorbis mobile app is designed with offline-first architecture. Technicians can view job details, complete checklists, take photos, collect signatures, capture payment information, and fill out forms without internet connection. All data is stored locally on the device and automatically syncs to the cloud when connectivity is restored. This ensures your team can work anywhere—in basements, remote areas, or locations with poor cell service.",
	},
	{
		question: "What features are available in the mobile app?",
		answer:
			"The mobile app includes complete job management capabilities: view scheduled jobs with customer details and job history, GPS navigation to job sites, digital checklists and forms, photo and video capture with automatic job attachment, customer signature collection, accept payments on-site with credit card reader integration, real-time job status updates, time tracking with clock in/out, equipment and material inventory tracking, and instant messaging with office staff.",
	},
	{
		question: "Can technicians accept payments on their phone?",
		answer:
			"Yes. Technicians can accept payments directly in the mobile app using credit cards, debit cards, ACH bank transfers, or digital wallets like Apple Pay and Google Pay. The app integrates with Bluetooth card readers for on-site card payments, generates digital receipts instantly, and syncs payment data with invoices automatically. With 0% processing fees, you keep 100% of every payment collected in the field.",
	},
	{
		question: "How does GPS tracking and navigation work?",
		answer:
			"The mobile app includes built-in GPS tracking and navigation. Technicians can see optimized routes to job sites with real-time traffic data, clock in when arriving at the job location, and the office can track technician location in real-time on the dispatch board. Customers receive automated notifications when the technician is en route. GPS tracking runs in the background and respects privacy settings—location is only shared during scheduled work hours.",
	},
	{
		question: "Is the mobile app available for both iPhone and Android?",
		answer:
			"Yes. The Thorbis mobile app is available for both iOS (iPhone/iPad) and Android devices. Download from the Apple App Store or Google Play Store. The app has feature parity across both platforms and works on phones and tablets. Minimum requirements: iOS 14+ for Apple devices, Android 8+ for Android devices. The app is optimized for both phone and tablet screen sizes.",
	},
	{
		question: "How do photos and documents sync from the mobile app?",
		answer:
			"Photos, videos, and documents captured in the mobile app automatically sync to the customer job record in the cloud. When offline, media is stored locally on the device. When internet connection is available, files upload in the background with progress tracking. Photos are automatically compressed for faster upload while maintaining quality. Synced media appears instantly in the office dashboard, customer portal, and can be attached to invoices or estimates.",
	},
]);

// ItemList Schema - Mobile app features
const featuresSchema = createItemListSchema({
	name: "Mobile Field Service App Features",
	description:
		"Complete offline-first mobile app for field technicians with payment processing and GPS tracking",
	items: [
		{
			name: "Offline-First Architecture",
			url: `${siteUrl}/features/mobile-app`,
			description:
				"Work anywhere without internet. Complete jobs, capture photos, collect signatures, and take payments offline. Auto-sync when back online.",
		},
		{
			name: "GPS Navigation & Tracking",
			url: `${siteUrl}/features/mobile-app`,
			description:
				"Optimized routes to job sites, real-time technician tracking on dispatch board, automated customer en-route notifications.",
		},
		{
			name: "Mobile Payment Processing",
			url: `${siteUrl}/features/mobile-app`,
			description:
				"Accept credit cards, ACH, Apple Pay, and Google Pay on-site. Bluetooth card reader integration with 0% processing fees.",
		},
		{
			name: "Photo & Video Capture",
			url: `${siteUrl}/features/mobile-app`,
			description:
				"Take job photos and videos that automatically attach to customer records. Works offline with background sync.",
		},
		{
			name: "Digital Signatures & Forms",
			url: `${siteUrl}/features/mobile-app`,
			description:
				"Collect customer signatures, complete digital checklists, fill out custom forms, and capture job completion details.",
		},
		{
			name: "Real-Time Job Updates",
			url: `${siteUrl}/features/mobile-app`,
			description:
				"Update job status, clock in/out, track time and materials, and communicate with office staff instantly.",
		},
	],
});

export default function MobileAppPage() {
	const serviceStructuredData = generateServiceStructuredData({
		name: "Mobile Field App",
		description: "Offline-first mobile experience for field technicians",
		offers: [
			{
				price: "100",
				currency: "USD",
				description: "Included in Thorbis platform starting at $200/month",
			},
		],
	});

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Features", url: `${siteUrl}/features` },
							{
								name: "Mobile Field App",
								url: `${siteUrl}/features/mobile-app`,
							},
						]),
					),
				}}
				id="mobile-app-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(serviceStructuredData),
				}}
				id="mobile-app-service-ld"
				type="application/ld+json"
			/>

			{/* FAQ Schema - Optimized for AI Overviews */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqSchema),
				}}
				id="mobile-app-faq-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>

			{/* Features List Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(featuresSchema),
				}}
				id="mobile-app-features-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>

			{/* Hero Section - Mobile-First Design */}
			<section className="from-background via-primary/5 to-background relative overflow-hidden bg-gradient-to-b py-20 sm:py-32">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid items-center gap-12 lg:grid-cols-2">
						<div>
							<Badge className="mb-6 gap-1.5 px-3 py-1.5" variant="secondary">
								<Smartphone className="size-3.5" />
								Mobile-First
							</Badge>
							<h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
								Your office in every technician's pocket
							</h1>
							<p className="text-muted-foreground mb-8 text-lg sm:text-xl">
								Everything your field team needs to complete jobs, capture data,
								and get paid—even without internet. Works offline, syncs
								automatically.
							</p>
							<div className="flex flex-wrap items-center gap-4">
								<Button
									asChild
									className="shadow-primary/20 shadow-lg"
									size="lg"
								>
									<Link href="/waitlist">
										Join Waitlist
										<Zap className="ml-2 size-4" />
									</Link>
								</Button>
								<Button asChild size="lg" variant="outline">
									<Link href="/demo">Watch Demo</Link>
								</Button>
							</div>

							{/* App Store Badges */}
							<div className="mt-8 flex flex-wrap items-center gap-4">
								<Badge className="gap-2 px-4 py-2" variant="secondary">
									<Smartphone className="size-4" />
									iOS & Android
								</Badge>
								<Badge className="gap-2 px-4 py-2" variant="secondary">
									<WifiOff className="size-4" />
									Works Offline
								</Badge>
								<Badge className="gap-2 px-4 py-2" variant="secondary">
									<Cloud className="size-4" />
									Auto-Sync
								</Badge>
							</div>
						</div>

						{/* Mobile Phone Mockup */}
						<div className="relative mx-auto w-full max-w-sm lg:max-w-md">
							<div className="relative">
								{/* Phone Frame */}
								<div className="border-foreground/10 bg-background relative overflow-hidden rounded-[3rem] border-8 shadow-2xl">
									<div className="aspect-[9/19.5]">
										{/* Status Bar */}
										<div className="bg-background flex items-center justify-between px-6 py-3">
											<span className="text-xs">9:41 AM</span>
											<div className="flex items-center gap-1">
												<Wifi className="size-3" />
												<span className="text-xs">100%</span>
											</div>
										</div>

										{/* App Content */}
										<div className="from-primary/5 to-background bg-gradient-to-b p-4">
											{/* Job Card */}
											<div className="bg-background mb-4 overflow-hidden rounded-2xl border shadow-lg">
												<div className="bg-primary/5 border-b px-4 py-3">
													<div className="mb-1 flex items-center justify-between">
														<span className="text-sm font-semibold">
															AC Repair
														</span>
														<Badge
															className="h-5 text-[10px]"
															variant="secondary"
														>
															In Progress
														</Badge>
													</div>
													<div className="text-muted-foreground flex items-center gap-1 text-xs">
														<MapPin className="size-3" />
														<span>123 Oak Street, Austin TX</span>
													</div>
												</div>

												<div className="space-y-3 p-4">
													{/* Checklist Items */}
													<div className="space-y-2">
														<div className="flex items-center gap-2">
															<div className="flex size-5 items-center justify-center rounded-full bg-green-500">
																<CheckCircle2 className="size-3 text-white" />
															</div>
															<span className="text-sm line-through opacity-60">
																Inspect unit
															</span>
														</div>
														<div className="flex items-center gap-2">
															<div className="flex size-5 items-center justify-center rounded-full bg-green-500">
																<CheckCircle2 className="size-3 text-white" />
															</div>
															<span className="text-sm line-through opacity-60">
																Check refrigerant
															</span>
														</div>
														<div className="flex items-center gap-2">
															<div className="border-border size-5 rounded-full border-2" />
															<span className="text-sm font-medium">
																Replace filter
															</span>
														</div>
														<div className="flex items-center gap-2">
															<div className="border-border size-5 rounded-full border-2" />
															<span className="text-sm">Test system</span>
														</div>
													</div>

													{/* Photo Grid */}
													<div className="grid grid-cols-3 gap-2">
														<div className="bg-muted aspect-square rounded-lg" />
														<div className="bg-muted aspect-square rounded-lg" />
														<div className="border-border flex aspect-square items-center justify-center rounded-lg border-2 border-dashed">
															<Camera className="text-muted-foreground size-4" />
														</div>
													</div>

													{/* Action Buttons */}
													<div className="grid grid-cols-2 gap-2 pt-2">
														<button
															className="bg-background hover:bg-accent rounded-lg border px-3 py-2 text-xs font-medium transition-colors"
															type="button"
														>
															<Camera className="mx-auto mb-1 size-4" />
															Add Photo
														</button>
														<button
															className="bg-background hover:bg-accent rounded-lg border px-3 py-2 text-xs font-medium transition-colors"
															type="button"
														>
															<FileText className="mx-auto mb-1 size-4" />
															Get Signature
														</button>
													</div>
												</div>
											</div>

											{/* Complete Button */}
											<button
												className="bg-primary text-primary-foreground w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-lg"
												type="button"
											>
												Complete Job
											</button>
										</div>
									</div>
								</div>

								{/* Offline Indicator */}
								<div className="absolute top-20 -right-4 flex items-center gap-2 rounded-full border border-orange-500/50 bg-orange-500/10 px-4 py-2 backdrop-blur-sm">
									<WifiOff className="size-4 text-orange-600 dark:text-orange-400" />
									<span className="text-xs font-semibold text-orange-700 dark:text-orange-400">
										Offline Mode
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="bg-muted/30 border-y py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">100%</div>
							<div className="text-muted-foreground text-sm font-medium">
								Offline Capable
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">45 min</div>
							<div className="text-muted-foreground text-sm font-medium">
								Faster Job Completion
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">95%</div>
							<div className="text-muted-foreground text-sm font-medium">
								Tech Adoption Rate
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">Zero</div>
							<div className="text-muted-foreground text-sm font-medium">
								Paperwork Delays
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
							Built for the field, not the office
						</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
							Every feature designed for technicians working in basements, on
							rooftops, and everywhere in between
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<WifiOff className="text-primary size-6" />
								</div>
								<CardTitle>True Offline Mode</CardTitle>
								<CardDescription>
									Complete jobs, capture data, and process payments without
									internet connectivity
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>All job data cached locally</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Automatic sync when online</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Conflict resolution</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Camera className="text-primary size-6" />
								</div>
								<CardTitle>Photo Documentation</CardTitle>
								<CardDescription>
									Capture before/after photos with automatic organization and
									cloud backup
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Unlimited photo storage</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Auto-compression & upload</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Photo annotations</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<FileText className="text-primary size-6" />
								</div>
								<CardTitle>Digital Signatures</CardTitle>
								<CardDescription>
									Get customer approval instantly with legally binding digital
									signatures
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Touch or stylus support</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Timestamp & GPS stamping</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Instant PDF generation</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<CheckCircle2 className="text-primary size-6" />
								</div>
								<CardTitle>Smart Checklists</CardTitle>
								<CardDescription>
									Customizable checklists that ensure nothing gets missed on
									every job
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Job-type specific templates</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Required vs. optional items</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Conditional logic</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<MapPin className="text-primary size-6" />
								</div>
								<CardTitle>GPS Navigation</CardTitle>
								<CardDescription>
									One-tap navigation to job sites with real-time traffic updates
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Google Maps integration</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Turn-by-turn directions</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Arrival notifications</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Smartphone className="text-primary size-6" />
								</div>
								<CardTitle>Mobile Payments</CardTitle>
								<CardDescription>
									Accept credit cards, checks, and cash right from the mobile
									app
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Tap-to-pay support</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Digital receipts</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Split payments</span>
									</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Related Features Section */}
			<section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<RelatedContent
					title="Explore Related Features"
					description="Discover how these features work together to power your field service business"
					items={getRelatedFeatures("mobile-app", 3)}
					variant="grid"
					showDescription={true}
				/>
			</section>

			{/* CTA Section */}
			<section className="from-primary via-primary to-primary/90 text-primary-foreground bg-gradient-to-br py-20">
				<div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
					<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
						Empower your field team today
					</h2>
					<p className="text-primary-foreground/90 mx-auto mb-8 max-w-2xl text-lg">
						Give your technicians the tools they need to work faster, smarter,
						and more professionally.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-4">
						<Button
							asChild
							className="bg-background text-foreground hover:bg-background/90 shadow-lg"
							size="lg"
						>
							<Link href="/waitlist">
								Join Waitlist
								<Zap className="ml-2 size-4" />
							</Link>
						</Button>
						<Button
							asChild
							className="border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20"
							size="lg"
							variant="outline"
						>
							<Link href="/demo">Watch Demo</Link>
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}
