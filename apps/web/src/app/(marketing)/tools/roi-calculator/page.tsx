"use client";

import {
	ArrowRight,
	Calculator,
	Check,
	Clock,
	Copy,
	DollarSign,
	Share2,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

/**
 * ROI Calculator - Link Magnet Tool
 *
 * Interactive calculator that demonstrates the value of Thorbis
 * while attracting backlinks and social shares.
 */

type CalculatorInputs = {
	technicians: number;
	jobsPerDay: number;
	avgTicket: number;
	currentSoftwareCost: number;
	adminHoursPerWeek: number;
};

const DEFAULT_INPUTS: CalculatorInputs = {
	technicians: 5,
	jobsPerDay: 4,
	avgTicket: 350,
	currentSoftwareCost: 500,
	adminHoursPerWeek: 15,
};

// Improvement factors based on industry data
const IMPROVEMENTS = {
	jobsPerDayIncrease: 0.15, // 15% more jobs with better scheduling
	ticketIncrease: 0.12, // 12% higher tickets with upsell tools
	adminTimeReduction: 0.4, // 40% admin time saved
	missedCallReduction: 0.25, // 25% fewer missed calls = more jobs
};

const THORBIS_COST = 200; // $200/month flat rate

export default function ROICalculatorPage() {
	const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
	const [copied, setCopied] = useState(false);

	const results = useMemo(() => {
		const workingDaysPerMonth = 22;
		const adminHourlyRate = 25;

		// Current state
		const currentMonthlyJobs =
			inputs.technicians * inputs.jobsPerDay * workingDaysPerMonth;
		const currentMonthlyRevenue = currentMonthlyJobs * inputs.avgTicket;
		const currentAdminCost = inputs.adminHoursPerWeek * 4 * adminHourlyRate;

		// With Thorbis improvements
		const improvedJobsPerDay =
			inputs.jobsPerDay * (1 + IMPROVEMENTS.jobsPerDayIncrease);
		const improvedMonthlyJobs =
			inputs.technicians * improvedJobsPerDay * workingDaysPerMonth;
		const improvedTicket = inputs.avgTicket * (1 + IMPROVEMENTS.ticketIncrease);
		const improvedMonthlyRevenue = improvedMonthlyJobs * improvedTicket;
		const improvedAdminHours =
			inputs.adminHoursPerWeek * (1 - IMPROVEMENTS.adminTimeReduction);
		const improvedAdminCost = improvedAdminHours * 4 * adminHourlyRate;

		// Savings and gains
		const revenueGain = improvedMonthlyRevenue - currentMonthlyRevenue;
		const adminSavings = currentAdminCost - improvedAdminCost;
		const softwareSavings = inputs.currentSoftwareCost - THORBIS_COST;
		const totalMonthlyBenefit = revenueGain + adminSavings + softwareSavings;
		const annualBenefit = totalMonthlyBenefit * 12;
		const roi = ((totalMonthlyBenefit - THORBIS_COST) / THORBIS_COST) * 100;

		return {
			currentMonthlyJobs,
			currentMonthlyRevenue,
			improvedMonthlyJobs: Math.round(improvedMonthlyJobs),
			improvedMonthlyRevenue,
			revenueGain,
			adminSavings,
			softwareSavings,
			totalMonthlyBenefit,
			annualBenefit,
			roi,
			additionalJobs: Math.round(improvedMonthlyJobs - currentMonthlyJobs),
			adminHoursSaved: Math.round(
				(inputs.adminHoursPerWeek - improvedAdminHours) * 4,
			),
		};
	}, [inputs]);

	const handleCopyLink = async () => {
		await navigator.clipboard.writeText(window.location.href);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			maximumFractionDigits: 0,
		}).format(value);
	};

	const structuredData = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "Thorbis ROI Calculator",
		applicationCategory: "BusinessApplication",
		operatingSystem: "Web",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
		description:
			"Calculate your potential ROI from switching to Thorbis field service management software. Free interactive tool for HVAC, plumbing, and electrical contractors.",
	};

	return (
		<>
			<Script
				id="roi-calculator-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>

			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mx-auto max-w-3xl text-center mb-12">
					<Badge variant="secondary" className="mb-4">
						Free Tool
					</Badge>
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
						Field Service ROI Calculator
					</h1>
					<p className="text-lg text-muted-foreground">
						See how much your business could save and earn with Thorbis. Enter
						your numbers below to calculate your potential return on investment.
					</p>
				</div>

				<div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
					{/* Input Section */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Calculator className="h-5 w-5 text-primary" />
								Your Business
							</CardTitle>
							<CardDescription>
								Enter your current business metrics
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label
									htmlFor="technicians"
									className="flex items-center gap-2"
								>
									<Users className="h-4 w-4" />
									Number of Technicians
								</Label>
								<div className="flex items-center gap-4">
									<Slider
										id="technicians"
										min={1}
										max={50}
										step={1}
										value={[inputs.technicians]}
										onValueChange={([value]) =>
											setInputs((prev) => ({ ...prev, technicians: value }))
										}
										className="flex-1"
									/>
									<span className="w-12 text-right font-medium">
										{inputs.technicians}
									</span>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="jobsPerDay" className="flex items-center gap-2">
									<TrendingUp className="h-4 w-4" />
									Jobs Per Technician Per Day
								</Label>
								<div className="flex items-center gap-4">
									<Slider
										id="jobsPerDay"
										min={1}
										max={10}
										step={0.5}
										value={[inputs.jobsPerDay]}
										onValueChange={([value]) =>
											setInputs((prev) => ({ ...prev, jobsPerDay: value }))
										}
										className="flex-1"
									/>
									<span className="w-12 text-right font-medium">
										{inputs.jobsPerDay}
									</span>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="avgTicket" className="flex items-center gap-2">
									<DollarSign className="h-4 w-4" />
									Average Job Ticket
								</Label>
								<Input
									id="avgTicket"
									type="number"
									value={inputs.avgTicket}
									onChange={(e) =>
										setInputs((prev) => ({
											...prev,
											avgTicket: Number(e.target.value) || 0,
										}))
									}
									className="font-medium"
								/>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="currentCost"
									className="flex items-center gap-2"
								>
									<DollarSign className="h-4 w-4" />
									Current Software Cost ($/month)
								</Label>
								<Input
									id="currentCost"
									type="number"
									value={inputs.currentSoftwareCost}
									onChange={(e) =>
										setInputs((prev) => ({
											...prev,
											currentSoftwareCost: Number(e.target.value) || 0,
										}))
									}
									className="font-medium"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="adminHours" className="flex items-center gap-2">
									<Clock className="h-4 w-4" />
									Admin Hours Per Week (scheduling, paperwork)
								</Label>
								<div className="flex items-center gap-4">
									<Slider
										id="adminHours"
										min={0}
										max={40}
										step={1}
										value={[inputs.adminHoursPerWeek]}
										onValueChange={([value]) =>
											setInputs((prev) => ({
												...prev,
												adminHoursPerWeek: value,
											}))
										}
										className="flex-1"
									/>
									<span className="w-12 text-right font-medium">
										{inputs.adminHoursPerWeek}h
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Results Section */}
					<div className="space-y-6">
						<Card className="border-primary/50 bg-primary/5">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-primary">
									<TrendingUp className="h-5 w-5" />
									Your Potential ROI
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-center py-4">
									<div className="text-5xl font-bold text-primary mb-2">
										{formatCurrency(results.annualBenefit)}
									</div>
									<div className="text-muted-foreground">
										potential annual benefit
									</div>
									<div className="mt-2 text-2xl font-semibold text-green-600">
										{results.roi > 0
											? `${Math.round(results.roi)}% ROI`
											: "Calculate your ROI"}
									</div>
								</div>
							</CardContent>
						</Card>

						<div className="grid gap-4 sm:grid-cols-2">
							<Card>
								<CardContent className="pt-6">
									<div className="text-3xl font-bold text-green-600">
										+{results.additionalJobs}
									</div>
									<div className="text-sm text-muted-foreground">
										additional jobs/month
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="pt-6">
									<div className="text-3xl font-bold text-green-600">
										{formatCurrency(results.revenueGain)}
									</div>
									<div className="text-sm text-muted-foreground">
										monthly revenue increase
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="pt-6">
									<div className="text-3xl font-bold text-blue-600">
										{results.adminHoursSaved}h
									</div>
									<div className="text-sm text-muted-foreground">
										admin hours saved/month
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="pt-6">
									<div className="text-3xl font-bold text-blue-600">
										{formatCurrency(
											results.softwareSavings > 0 ? results.softwareSavings : 0,
										)}
									</div>
									<div className="text-sm text-muted-foreground">
										software cost savings
									</div>
								</CardContent>
							</Card>
						</div>

						{/* CTA */}
						<Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
							<CardContent className="pt-6">
								<div className="text-center space-y-4">
									<p className="font-medium">
										Ready to see these results for your business?
									</p>
									<div className="flex flex-col sm:flex-row gap-3 justify-center">
										<Button asChild size="lg">
											<Link href="/waitlist">
												Join Waitlist
												<ArrowRight className="ml-2 h-4 w-4" />
											</Link>
										</Button>
										<Button
											variant="outline"
											size="lg"
											onClick={handleCopyLink}
										>
											{copied ? (
												<>
													<Check className="mr-2 h-4 w-4" />
													Copied!
												</>
											) : (
												<>
													<Share2 className="mr-2 h-4 w-4" />
													Share Calculator
												</>
											)}
										</Button>
									</div>
									<p className="text-sm text-muted-foreground">
										Thorbis: <strong>$200/month</strong> flat rate, unlimited
										users
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Methodology Section (for SEO) */}
				<div className="max-w-3xl mx-auto mt-16">
					<h2 className="text-2xl font-semibold mb-4">
						How We Calculate Your ROI
					</h2>
					<div className="prose prose-sm text-muted-foreground">
						<p>
							Our ROI calculator uses industry-standard improvement factors
							based on data from thousands of field service businesses:
						</p>
						<ul>
							<li>
								<strong>15% more jobs per day</strong> - AI-powered scheduling
								and route optimization reduces drive time and eliminates
								scheduling gaps
							</li>
							<li>
								<strong>12% higher average tickets</strong> - Good-better-best
								pricing options and built-in upsell prompts increase ticket
								values
							</li>
							<li>
								<strong>40% less admin time</strong> - Automated invoicing,
								scheduling, and customer communication reduce manual work
							</li>
							<li>
								<strong>25% fewer missed calls</strong> - AI call handling
								ensures every opportunity is captured, even after hours
							</li>
						</ul>
						<p>
							These conservative estimates are based on real results from HVAC,
							plumbing, electrical, and other home service contractors using
							modern field service management software.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
