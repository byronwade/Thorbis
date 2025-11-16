/**
 * Settings > Billing Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
	Activity,
	AlertCircle,
	BarChart3,
	CheckCircle,
	CreditCard,
	DollarSign,
	Download,
	ExternalLink,
	FileText,
	HardDrive,
	HelpCircle,
	Mail,
	MessageCircle,
	MessageSquare,
	Phone,
	Receipt,
	Users,
	Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Pricing Constants
const BASE_FEE = 100;
const PRICING = {
	user: 5.0,
	invoice: 0.15,
	estimate: 0.1,
	apiCall: 0.001,
	sms: 0.02,
	email: 0.005,
	videoMinute: 0.05,
	phoneMinute: 0.02,
	storageGB: 0.5,
	payment: 0.29,
	automatedWorkflow: 0.1,
};

const USAGE = {
	users: 4,
	invoices: 127,
	estimates: 84,
	apiCalls: 15_234,
	sms: 342,
	emails: 1205,
	videoMinutes: 485,
	phoneMinutes: 234,
	storageGB: 12.5,
	payments: 89,
	automatedWorkflows: 456,
};

const COSTS = {
	users: USAGE.users * PRICING.user,
	invoices: USAGE.invoices * PRICING.invoice,
	estimates: USAGE.estimates * PRICING.estimate,
	apiCalls: USAGE.apiCalls * PRICING.apiCall,
	sms: USAGE.sms * PRICING.sms,
	emails: USAGE.emails * PRICING.email,
	videoMinutes: USAGE.videoMinutes * PRICING.videoMinute,
	phoneMinutes: USAGE.phoneMinutes * PRICING.phoneMinute,
	storageGB: USAGE.storageGB * PRICING.storageGB,
	payments: USAGE.payments * PRICING.payment,
	automatedWorkflows: USAGE.automatedWorkflows * PRICING.automatedWorkflow,
};

const TOTAL_USAGE_COST = Object.values(COSTS).reduce((sum, cost) => sum + cost, 0);
const PROJECTED_TOTAL = BASE_FEE + TOTAL_USAGE_COST;

const DAYS_LEFT = 23;
const DAYS_IN_MONTH = 30;
const PERCENT_TO_DECIMAL = 100;
const PERCENT_COMPLETE = ((DAYS_IN_MONTH - DAYS_LEFT) / DAYS_IN_MONTH) * PERCENT_TO_DECIMAL;
const PAYMENT_PERCENTAGE_FEE = 2.9;
const PRICE_DECIMAL_PLACES = 4;
const CURRENCY_DECIMAL_PLACES = 2;

type UsageCategory = {
	name: string;
	icon: typeof Users;
	count: number;
	unit: string;
	priceEach: number;
	totalCost: number;
	explanation: string;
	tooltip: string;
	example: string;
};

export default function BillingPage() {
	const categories: UsageCategory[] = [
		{
			name: "Team Members",
			icon: Users,
			count: USAGE.users,
			unit: "users",
			priceEach: PRICING.user,
			totalCost: COSTS.users,
			explanation: "Each person who can log into your account",
			tooltip: "Team members can access your account based on their role. Each member costs $5/month.",
			example: "You have 4 people on your team (office staff + technicians)",
		},
		{
			name: "Customer Invoices",
			icon: FileText,
			count: USAGE.invoices,
			unit: "invoices",
			priceEach: PRICING.invoice,
			totalCost: COSTS.invoices,
			explanation: "Each bill you send to customers",
			tooltip: "Every invoice you create and send to customers. Includes email delivery and payment tracking.",
			example: "You billed 127 customers this month",
		},
		{
			name: "Price Quotes",
			icon: Receipt,
			count: USAGE.estimates,
			unit: "quotes",
			priceEach: PRICING.estimate,
			totalCost: COSTS.estimates,
			explanation: "Each price quote you send before doing work",
			tooltip: "Estimates and quotes sent to potential customers. Can be converted to invoices once approved.",
			example: "You sent 84 quotes to potential customers",
		},
		{
			name: "Text Messages",
			icon: MessageSquare,
			count: USAGE.sms,
			unit: "texts",
			priceEach: PRICING.sms,
			totalCost: COSTS.sms,
			explanation: "Text messages sent to customers",
			tooltip:
				"SMS messages for appointment reminders, job updates, and customer notifications. Carrier fees included.",
			example: "You sent 342 texts like 'Your technician is 15 minutes away'",
		},
		{
			name: "Emails Sent",
			icon: Mail,
			count: USAGE.emails,
			unit: "emails",
			priceEach: PRICING.email,
			totalCost: COSTS.emails,
			explanation: "Automated emails to customers",
			tooltip:
				"Automated emails including invoice receipts, booking confirmations, appointment reminders, and follow-ups.",
			example: "You sent 1,205 emails like invoice receipts and booking confirmations",
		},
		{
			name: "Video Calls",
			icon: Video,
			count: USAGE.videoMinutes,
			unit: "minutes",
			priceEach: PRICING.videoMinute,
			totalCost: COSTS.videoMinutes,
			explanation: "Video calls with customers or team",
			tooltip:
				"HD video calls for virtual consultations, remote support, and team meetings. Includes recording and screen sharing.",
			example: "You spent 485 minutes (8 hours) on video calls with customers",
		},
		{
			name: "Phone Calls",
			icon: Phone,
			count: USAGE.phoneMinutes,
			unit: "minutes",
			priceEach: PRICING.phoneMinute,
			totalCost: COSTS.phoneMinutes,
			explanation: "Phone calls through the system",
			tooltip:
				"Phone calls made through the platform. Includes call recording, transcription, and automatic logging to customer records.",
			example: "You made 234 minutes (4 hours) of phone calls",
		},
		{
			name: "File Storage",
			icon: HardDrive,
			count: USAGE.storageGB,
			unit: "GB",
			priceEach: PRICING.storageGB,
			totalCost: COSTS.storageGB,
			explanation: "Photos, documents, and files stored",
			tooltip:
				"Secure cloud storage for job photos, signed documents, invoices, and customer files. Includes automatic backups.",
			example: "You're storing 12.5 GB (about 5,000 photos)",
		},
		{
			name: "Payments Collected",
			icon: DollarSign,
			count: USAGE.payments,
			unit: "payments",
			priceEach: PRICING.payment,
			totalCost: COSTS.payments,
			explanation: "Credit card payments from customers",
			tooltip: `Process credit card payments securely. Fee: $${PRICING.payment.toFixed(CURRENCY_DECIMAL_PLACES)} + ${PAYMENT_PERCENTAGE_FEE}% per transaction. Funds deposited to your bank in 2 business days.`,
			example: "Customers paid you 89 times online with credit cards",
		},
		{
			name: "Automated Actions",
			icon: Activity,
			count: USAGE.automatedWorkflows,
			unit: "actions",
			priceEach: PRICING.automatedWorkflow,
			totalCost: COSTS.automatedWorkflows,
			explanation: "Automatic tasks saving you time",
			tooltip:
				"Automated workflows like sending appointment reminders, updating job statuses, auto-creating invoices, and follow-up sequences.",
			example: "The system automatically performed 456 tasks for you",
		},
		{
			name: "API Calls",
			icon: BarChart3,
			count: USAGE.apiCalls,
			unit: "calls",
			priceEach: PRICING.apiCall,
			totalCost: COSTS.apiCalls,
			explanation: "Background system requests",
			tooltip:
				"API requests from mobile apps, third-party integrations, and automated syncing. Essential for real-time updates across all devices.",
			example: "Your team's mobile apps and integrations made 15,234 requests",
		},
	];

	return (
		<TooltipProvider>
			<div className="space-y-8 py-8">
				{/* Header */}
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<h1 className="font-bold text-4xl tracking-tight">Your Bill</h1>
						<Tooltip>
							<TooltipTrigger asChild>
								<button className="flex items-center justify-center rounded-full hover:bg-muted" type="button">
									<HelpCircle className="h-5 w-5 text-muted-foreground" />
								</button>
							</TooltipTrigger>
							<TooltipContent className="max-w-sm">
								<p className="font-semibold">How billing works</p>
								<p className="mt-2 text-sm">
									You pay a ${BASE_FEE} monthly platform fee plus usage charges for everything you actually use. No
									hidden fees, no surprises.
								</p>
							</TooltipContent>
						</Tooltip>
					</div>
					<p className="text-lg text-muted-foreground">
						Simple, transparent pricing - only pay for what you actually use
					</p>
					<div className="flex items-start gap-2 rounded-lg border border-warning bg-warning p-4 dark:border-warning/50 dark:bg-warning/20">
						<AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning dark:text-warning" />
						<p className="text-sm text-warning dark:text-warning">
							All prices are subject to change. We'll notify you at least 30 days in advance of any pricing updates.
						</p>
					</div>
				</div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
					{/* Left Column - Bill Summary (2/3 width on xl) */}
					<div className="space-y-8 xl:col-span-2">
						{/* Current Bill Card */}
						<div className="space-y-6 rounded-xl border bg-card p-8 shadow-sm">
							<div className="flex items-start justify-between">
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<h2 className="font-semibold text-xl">What You'll Pay This Month</h2>
										<Tooltip>
											<TooltipTrigger asChild>
												<button className="flex items-center justify-center" type="button">
													<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
												</button>
											</TooltipTrigger>
											<TooltipContent className="max-w-sm">
												<p className="font-semibold">Your monthly bill</p>
												<p className="mt-2 text-sm">
													This is an estimate based on your current usage. Your final bill on April 1st will reflect
													your actual usage through the end of the month.
												</p>
											</TooltipContent>
										</Tooltip>
									</div>
									<p className="text-muted-foreground text-sm">March 1 - March 31, 2024 • {DAYS_LEFT} days remaining</p>
								</div>
								<Badge className="bg-success px-3 py-1" variant="default">
									Active
								</Badge>
							</div>

							<Separator />

							{/* Estimated Total */}
							<div className="space-y-6">
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<p className="text-muted-foreground text-sm">Estimated Total for This Month</p>
										<Tooltip>
											<TooltipTrigger asChild>
												<button className="flex items-center justify-center" type="button">
													<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
												</button>
											</TooltipTrigger>
											<TooltipContent className="max-w-xs">
												<p className="text-sm">
													Projected total based on your usage so far this month. The actual amount may vary slightly.
												</p>
											</TooltipContent>
										</Tooltip>
									</div>
									<p className="font-bold text-6xl tracking-tight">
										${PROJECTED_TOTAL.toFixed(CURRENCY_DECIMAL_PLACES)}
									</p>
								</div>

								{/* Breakdown */}
								<div className="space-y-3 rounded-lg border bg-muted/30 p-6">
									<div className="flex items-center justify-between text-base">
										<div className="flex items-center gap-2">
											<span className="text-muted-foreground">Monthly Platform Fee</span>
											<Tooltip>
												<TooltipTrigger asChild>
													<button className="flex items-center justify-center" type="button">
														<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
													</button>
												</TooltipTrigger>
												<TooltipContent className="max-w-xs">
													<p className="text-sm">
														Your base subscription fee. This gives you access to the platform and all core features.
													</p>
												</TooltipContent>
											</Tooltip>
										</div>
										<span className="font-semibold">${BASE_FEE.toFixed(CURRENCY_DECIMAL_PLACES)}</span>
									</div>
									<div className="flex items-center justify-between text-base">
										<div className="flex items-center gap-2">
											<span className="text-muted-foreground">What You Used This Month</span>
											<Tooltip>
												<TooltipTrigger asChild>
													<button className="flex items-center justify-center" type="button">
														<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
													</button>
												</TooltipTrigger>
												<TooltipContent className="max-w-xs">
													<p className="text-sm">
														Total cost of all usage-based features (texts, calls, invoices, storage, etc.). See
														breakdown below.
													</p>
												</TooltipContent>
											</Tooltip>
										</div>
										<span className="font-semibold">${TOTAL_USAGE_COST.toFixed(CURRENCY_DECIMAL_PLACES)}</span>
									</div>
									<Separator />
									<div className="flex items-center justify-between">
										<span className="font-semibold text-base">Total</span>
										<span className="font-bold text-2xl">${PROJECTED_TOTAL.toFixed(CURRENCY_DECIMAL_PLACES)}</span>
									</div>
								</div>

								{/* Progress Bar */}
								<div className="space-y-3">
									<div className="flex items-center justify-between text-sm">
										<div className="flex items-center gap-2">
											<span className="text-muted-foreground">Billing cycle progress</span>
											<Tooltip>
												<TooltipTrigger asChild>
													<button className="flex items-center justify-center" type="button">
														<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
													</button>
												</TooltipTrigger>
												<TooltipContent className="max-w-xs">
													<p className="text-sm">
														Shows how far through the monthly billing cycle you are. We bill on the 1st of each month.
													</p>
												</TooltipContent>
											</Tooltip>
										</div>
										<span className="font-medium">{Math.round(PERCENT_COMPLETE)}% complete</span>
									</div>
									<Progress className="h-2" value={PERCENT_COMPLETE} />
									<p className="text-muted-foreground text-sm">
										We'll charge your card on <span className="font-medium text-foreground">April 1, 2024</span> (
										{DAYS_LEFT} days from now)
									</p>
								</div>
							</div>
						</div>

						{/* Trust Message */}
						<div className="rounded-lg border border-success bg-success p-6 dark:border-success/50 dark:bg-success/20">
							<div className="flex gap-4">
								<CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-success dark:text-success" />
								<div className="space-y-1">
									<p className="font-semibold text-success dark:text-success">We believe in honest pricing</p>
									<p className="text-sm text-success dark:text-success">
										Every single thing we charge for is shown below with a clear explanation. No hidden fees, no
										surprises. You only pay for what you actually use.
									</p>
								</div>
							</div>
						</div>

						{/* Usage Breakdown */}
						<div className="space-y-6">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<h2 className="font-semibold text-2xl tracking-tight">What You're Being Charged For</h2>
									<Tooltip>
										<TooltipTrigger asChild>
											<button className="flex items-center justify-center" type="button">
												<HelpCircle className="h-5 w-5 text-muted-foreground" />
											</button>
										</TooltipTrigger>
										<TooltipContent className="max-w-sm">
											<p className="text-sm">
												Detailed breakdown of all usage-based charges. Hover over each item for more information about
												what it includes.
											</p>
										</TooltipContent>
									</Tooltip>
								</div>
								<p className="text-muted-foreground">
									Here's exactly what you used and what it costs - simple breakdown
								</p>
							</div>

							<div className="space-y-4">
								{categories.map((item) => {
									const Icon = item.icon;
									return (
										<div
											className="group rounded-lg border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
											key={item.name}
										>
											<div className="flex items-start justify-between gap-6">
												<div className="flex gap-4">
													<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
														<Icon className="h-5 w-5 text-primary" />
													</div>
													<div className="space-y-2">
														<div>
															<div className="flex items-center gap-2">
																<h3 className="font-semibold text-base">{item.name}</h3>
																<Tooltip>
																	<TooltipTrigger asChild>
																		<button className="flex items-center justify-center" type="button">
																			<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
																		</button>
																	</TooltipTrigger>
																	<TooltipContent className="max-w-sm">
																		<p className="font-semibold">{item.name}</p>
																		<p className="mt-2 text-sm">{item.tooltip}</p>
																		<p className="mt-2 text-muted-foreground text-xs">Example: {item.example}</p>
																	</TooltipContent>
																</Tooltip>
															</div>
															<p className="text-muted-foreground text-sm">{item.explanation}</p>
														</div>
														<div className="flex items-baseline gap-2 rounded-md bg-muted/50 px-3 py-2 font-mono text-sm">
															<span className="font-bold text-lg">{item.count.toLocaleString()}</span>
															<span className="text-muted-foreground">{item.unit}</span>
															<span className="text-muted-foreground">×</span>
															<span className="font-medium">${item.priceEach.toFixed(PRICE_DECIMAL_PLACES)}</span>
															<span className="text-muted-foreground">each</span>
														</div>
													</div>
												</div>
												<div className="shrink-0 text-right">
													<p className="font-bold text-2xl">${item.totalCost.toFixed(CURRENCY_DECIMAL_PLACES)}</p>
												</div>
											</div>
										</div>
									);
								})}
							</div>

							{/* Total Usage */}
							<div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-semibold text-lg">Total Usage Charges This Month</p>
										<p className="text-muted-foreground text-sm">This is everything listed above added together</p>
									</div>
									<p className="font-bold text-4xl">${TOTAL_USAGE_COST.toFixed(CURRENCY_DECIMAL_PLACES)}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column - Payment & History (1/3 width on xl) */}
					<div className="space-y-8">
						{/* Payment Method */}
						<div className="space-y-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<h2 className="font-semibold text-xl tracking-tight">How You Pay</h2>
									<Tooltip>
										<TooltipTrigger asChild>
											<button className="flex items-center justify-center" type="button">
												<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
											</button>
										</TooltipTrigger>
										<TooltipContent className="max-w-xs">
											<p className="text-sm">
												Your payment method is charged automatically on the 1st of each month. You can update it
												anytime.
											</p>
										</TooltipContent>
									</Tooltip>
								</div>
								<p className="text-muted-foreground text-sm">Payment method on file</p>
							</div>

							<div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
								<div className="space-y-4">
									<div className="flex items-center gap-4">
										<div className="flex h-12 w-16 items-center justify-center rounded-md border-2 bg-muted">
											<CreditCard className="h-6 w-6 text-muted-foreground" />
										</div>
										<div className="flex-1">
											<p className="font-semibold">Visa ending in 4242</p>
											<p className="text-muted-foreground text-sm">Expires December 2025</p>
										</div>
										<Badge className="bg-success" variant="default">
											Active
										</Badge>
									</div>
									<Button className="w-full" size="default" type="button" variant="outline">
										Change Card
									</Button>
								</div>

								<Separator />

								<div className="space-y-2 rounded-lg bg-primary p-4 dark:bg-primary/20">
									<p className="font-medium text-sm">Automatic billing on the 1st</p>
									<p className="text-muted-foreground text-xs">
										We'll automatically charge this card monthly for your base fee plus usage. You'll receive a detailed
										email receipt.
									</p>
								</div>
							</div>
						</div>

						{/* Past Bills */}
						<div className="space-y-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<h2 className="font-semibold text-xl tracking-tight">Past Bills</h2>
									<Tooltip>
										<TooltipTrigger asChild>
											<button className="flex items-center justify-center" type="button">
												<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
											</button>
										</TooltipTrigger>
										<TooltipContent className="max-w-xs">
											<p className="text-sm">
												Download PDF receipts for your accounting records. Each receipt includes a detailed usage
												breakdown.
											</p>
										</TooltipContent>
									</Tooltip>
								</div>
								<p className="text-muted-foreground text-sm">Download receipts</p>
							</div>

							<div className="space-y-3">
								{[
									{
										month: "March 2024",
										date: "March 1, 2024",
										amount: 142.73,
									},
									{
										month: "February 2024",
										date: "February 1, 2024",
										amount: 138.92,
									},
									{
										month: "January 2024",
										date: "January 1, 2024",
										amount: 135.48,
									},
								].map((invoice) => (
									<div
										className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:border-primary/50"
										key={invoice.month}
									>
										<div className="flex items-start justify-between gap-3">
											<div className="flex items-start gap-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-success dark:bg-success/30">
													<CheckCircle className="h-4 w-4 text-success dark:text-success" />
												</div>
												<div className="flex-1">
													<p className="font-semibold text-sm">{invoice.month}</p>
													<p className="text-muted-foreground text-xs">Paid {invoice.date}</p>
												</div>
											</div>
											<div className="text-right">
												<p className="font-bold text-base">${invoice.amount.toFixed(CURRENCY_DECIMAL_PLACES)}</p>
												<Button className="mt-2" size="sm" type="button" variant="ghost">
													<Download className="mr-1.5 h-3.5 w-3.5" />
													PDF
												</Button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Help Section */}
						<div className="rounded-lg border bg-card p-6 shadow-sm">
							<div className="space-y-4">
								<div className="flex gap-3">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
										<MessageCircle className="h-5 w-5 text-primary-foreground" />
									</div>
									<div className="space-y-1">
										<h3 className="font-semibold text-base">Need Help?</h3>
										<p className="text-muted-foreground text-sm">
											Questions about your bill? We're here to help explain everything.
										</p>
									</div>
								</div>
								<div className="space-y-2">
									<Button className="w-full bg-primary" size="default">
										<MessageCircle className="mr-2 size-4" />
										Chat With Support
									</Button>
									<Button className="w-full" size="default" variant="outline">
										View Pricing Guide
										<ExternalLink className="ml-2 h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
