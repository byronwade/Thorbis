"use client";

import {
	ArrowRight,
	BookOpen,
	Calendar,
	CheckCircle2,
	ChevronDown,
	Clock,
	DollarSign,
	FileText,
	HelpCircle,
	Mail,
	Pause,
	Play,
	Send,
	X,
} from "lucide-react";
import { useState } from "react";
import {
	type Feature,
	FeatureRoadmap,
} from "@/components/layout/feature-roadmap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface StatusStep {
	status: string;
	icon: React.ComponentType<{ className?: string }>;
	simpleTitle: string;
	whatItMeans: string;
	nextSteps: string[];
	needsInfo: string[];
	example: string;
}

// Simplified workflow - explaining like talking to a 5th grader
const SIMPLE_WORKFLOW: StatusStep[] = [
	{
		status: "quoted",
		icon: FileText,
		simpleTitle: "Getting a Quote",
		whatItMeans: "You're telling the customer how much the job will cost.",
		nextSteps: ["scheduled", "cancelled"],
		needsInfo: ["Customer's name and contact info"],
		example:
			"Like getting an estimate for fixing your bike before you decide to do it.",
	},
	{
		status: "scheduled",
		icon: Calendar,
		simpleTitle: "Job is Scheduled",
		whatItMeans:
			"The customer said yes! You picked a day and time to do the work.",
		nextSteps: ["in_progress", "on_hold", "cancelled"],
		needsInfo: [
			"Customer info",
			"What day you're going",
			"What time you're going",
		],
		example:
			"Like when you make a dentist appointment for next Tuesday at 3pm.",
	},
	{
		status: "in_progress",
		icon: Play,
		simpleTitle: "Working on It",
		whatItMeans: "You're doing the work right now!",
		nextSteps: ["completed", "on_hold", "cancelled"],
		needsInfo: ["Customer info", "Start date", "Who is doing the work"],
		example: "Like when you're actually fixing the bike right now.",
	},
	{
		status: "on_hold",
		icon: Pause,
		simpleTitle: "Paused",
		whatItMeans:
			"You had to stop for a bit. Maybe waiting for parts or the customer to decide something.",
		nextSteps: ["scheduled", "in_progress", "cancelled"],
		needsInfo: ["Customer info"],
		example:
			"Like pausing a video game to go eat dinner. You'll come back to it later.",
	},
	{
		status: "completed",
		icon: CheckCircle2,
		simpleTitle: "Work is Done",
		whatItMeans: "Finished! The work is complete and the customer is happy.",
		nextSteps: ["invoiced"],
		needsInfo: ["Customer info", "When you started"],
		example: "Like when you finish your homework and show it to your teacher.",
	},
	{
		status: "cancelled",
		icon: X,
		simpleTitle: "Cancelled",
		whatItMeans:
			"Not doing this job anymore. Maybe the customer changed their mind.",
		nextSteps: ["quoted", "scheduled"],
		needsInfo: ["Customer info"],
		example: "Like when a birthday party gets cancelled because of rain.",
	},
	{
		status: "invoiced",
		icon: FileText,
		simpleTitle: "Sent the Bill",
		whatItMeans: "Work is done, and you sent the customer the bill to pay.",
		nextSteps: ["paid"],
		needsInfo: ["Customer info", "How much they owe"],
		example:
			"Like when your mom gives you a list of chores you did to earn your allowance.",
	},
	{
		status: "paid",
		icon: DollarSign,
		simpleTitle: "Got Paid",
		whatItMeans: "Yay! The customer paid you. This job is all done!",
		nextSteps: [],
		needsInfo: ["Customer info", "How much they paid"],
		example: "Like when you finally get your allowance money in your hand.",
	},
];

function StatusBadge({
	status,
	size = "default",
}: {
	status: string;
	size?: "default" | "lg";
}) {
	const colors: Record<string, string> = {
		quoted:
			"bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
		scheduled:
			"bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
		in_progress:
			"bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
		on_hold:
			"bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
		completed:
			"bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
		cancelled:
			"bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
		invoiced:
			"bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
		paid: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
	};

	const sizeClasses =
		size === "lg" ? "text-base px-4 py-1.5" : "text-sm px-3 py-1";

	return (
		<Badge
			className={`${colors[status.toLowerCase()] || ""} ${sizeClasses} border font-medium capitalize`}
		>
			{status.replace("_", " ")}
		</Badge>
	);
}

function WorkflowStep({ step, isLast }: { step: StatusStep; isLast: boolean }) {
	const Icon = step.icon;

	return (
		<div className="space-y-4">
			<div className="flex items-start gap-4">
				<div className="bg-primary/10 border-primary/20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border">
					<Icon className="text-primary h-6 w-6" />
				</div>
				<div className="flex-1 space-y-3">
					<div>
						<h4 className="mb-1 text-lg font-semibold">{step.simpleTitle}</h4>
						<p className="text-muted-foreground text-sm">{step.whatItMeans}</p>
					</div>

					<div className="bg-muted/50 rounded-lg border p-3">
						<div className="mb-2 flex items-center gap-2">
							<HelpCircle className="h-4 w-4" />
							<span className="text-sm font-medium">Real Life Example:</span>
						</div>
						<p className="text-muted-foreground text-sm italic">
							{step.example}
						</p>
					</div>

					{step.needsInfo.length > 0 && (
						<div className="space-y-2">
							<div className="text-sm font-medium">What info do you need?</div>
							<ul className="text-muted-foreground space-y-1 text-sm">
								{step.needsInfo.map((info, idx) => (
									<li key={idx} className="flex items-center gap-2">
										<div className="bg-primary/20 h-1.5 w-1.5 rounded-full" />
										{info}
									</li>
								))}
							</ul>
						</div>
					)}

					{step.nextSteps.length > 0 && (
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<ArrowRight className="h-4 w-4" />
								<span className="text-sm font-medium">
									What can happen next?
								</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{step.nextSteps.map((nextStatus) => (
									<StatusBadge key={nextStatus} status={nextStatus} />
								))}
							</div>
						</div>
					)}

					{step.nextSteps.length === 0 && (
						<div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-500/10 p-3 text-sm dark:border-green-800">
							<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
							<span className="font-medium text-green-700 dark:text-green-400">
								This is the end! Job is complete and paid.
							</span>
						</div>
					)}
				</div>
			</div>

			{!isLast && (
				<div className="border-muted-foreground/20 ml-6 border-l-2 border-dashed py-4 pl-6">
					<div className="text-muted-foreground flex items-center gap-2 text-xs">
						<Clock className="h-3 w-3" />
						<span>Time passes...</span>
					</div>
				</div>
			)}
		</div>
	);
}

function SupportForm() {
	const [formState, setFormState] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus("idle");

		try {
			// TODO: Implement actual support submission
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setSubmitStatus("success");
			setFormState({ name: "", email: "", subject: "", message: "" });
		} catch (error) {
			setSubmitStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange =
		(field: string) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setFormState((prev) => ({ ...prev, [field]: e.target.value }));
		};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-2">
					<label htmlFor="name" className="text-sm font-medium">
						Your Name
					</label>
					<Input
						id="name"
						value={formState.name}
						onChange={handleChange("name")}
						placeholder="John Smith"
						required
					/>
				</div>
				<div className="space-y-2">
					<label htmlFor="email" className="text-sm font-medium">
						Your Email
					</label>
					<Input
						id="email"
						type="email"
						value={formState.email}
						onChange={handleChange("email")}
						placeholder="john@example.com"
						required
					/>
				</div>
			</div>

			<div className="space-y-2">
				<label htmlFor="subject" className="text-sm font-medium">
					What do you need help with?
				</label>
				<Input
					id="subject"
					value={formState.subject}
					onChange={handleChange("subject")}
					placeholder="I have a question about..."
					required
				/>
			</div>

			<div className="space-y-2">
				<label htmlFor="message" className="text-sm font-medium">
					Tell us more
				</label>
				<Textarea
					id="message"
					value={formState.message}
					onChange={handleChange("message")}
					placeholder="Explain your question or problem here..."
					rows={4}
					required
				/>
			</div>

			{submitStatus === "success" && (
				<div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
					<CheckCircle2 className="h-4 w-4" />
					Got it! We'll email you back soon.
				</div>
			)}

			{submitStatus === "error" && (
				<div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
					<HelpCircle className="h-4 w-4" />
					Oops! Something went wrong. Please try again.
				</div>
			)}

			<Button
				type="submit"
				disabled={isSubmitting}
				className="w-full sm:w-auto"
			>
				<Send className="mr-2 h-4 w-4" />
				{isSubmitting ? "Sending..." : "Send Message"}
			</Button>
		</form>
	);
}

// Feature roadmap for job DETAILS page - Improvements specific to this page only
const JOB_FEATURES: Feature[] = [
	// Q1 2025 - HIGH Priority (Core Job Details Enhancements)
	{
		id: "inline-editing",
		title: "Inline Field Editing",
		description:
			"Edit job details directly on the page without opening dialogs. Click any field to edit in-place with auto-save. Like Notion or ClickUp - just click and type.",
		status: "planned",
		priority: "high",
		estimatedDate: "Q1 2025",
	},
	{
		id: "job-timeline",
		title: "Visual Job Timeline",
		description:
			"See the complete job lifecycle on a visual timeline. Shows status changes, technician assignments, customer communications, and payments all in chronological order with timestamps.",
		status: "planned",
		priority: "high",
		estimatedDate: "Q1 2025",
	},
	{
		id: "quick-actions",
		title: "Quick Action Shortcuts",
		description:
			"Keyboard shortcuts and quick actions panel for common tasks. Press 'C' to add customer, 'L' to add line item, 'N' for notes, 'P' for payment. Speed up data entry 10x.",
		status: "planned",
		priority: "high",
		estimatedDate: "Q1 2025",
	},
	{
		id: "smart-suggestions",
		title: "AI Smart Suggestions",
		description:
			"Get intelligent suggestions based on job context. Auto-suggest line items based on job type, recommend pricing from similar past jobs, suggest optimal technician based on skills and location.",
		status: "in-progress",
		priority: "high",
		estimatedDate: "Q1 2025",
	},

	// Q2 2025 - MEDIUM Priority (Enhanced Collaboration)
	{
		id: "internal-chat",
		title: "Internal Team Chat",
		description:
			"Built-in team chat sidebar for this job. Discuss details with CSR, technician, and manager without switching apps. Mentions, file sharing, and threaded conversations.",
		status: "planned",
		priority: "medium",
		estimatedDate: "Q2 2025",
	},
	{
		id: "photo-gallery",
		title: "Before/After Photo Gallery",
		description:
			"Dedicated photo gallery with before/after comparison slider, annotations, and automatic organization. Technicians upload from mobile, customers see in portal.",
		status: "planned",
		priority: "medium",
		estimatedDate: "Q2 2025",
	},
	{
		id: "custom-forms",
		title: "Custom Job Forms",
		description:
			"Create custom forms for job-specific data collection. HVAC inspection checklist, plumbing diagnostics form, electrical safety report. Build forms with drag-and-drop, filled out by technicians.",
		status: "planned",
		priority: "medium",
		estimatedDate: "Q2 2025",
	},
	{
		id: "version-history",
		title: "Change History & Rollback",
		description:
			"See who changed what and when. Full audit trail of all job modifications with ability to rollback changes. Like Google Docs revision history but for job data.",
		status: "planned",
		priority: "medium",
		estimatedDate: "Q2 2025",
	},

	// Q3 2025 - LOW Priority (Advanced Features)
	{
		id: "job-templates-details",
		title: "Save as Template",
		description:
			"Turn this job into a reusable template. Save line items, forms, checklists, and settings as a template for future jobs. One-click duplication for recurring work.",
		status: "planned",
		priority: "low",
		estimatedDate: "Q3 2025",
	},
	{
		id: "related-jobs",
		title: "Related Jobs & Recommendations",
		description:
			"Automatically surface related jobs from this customer/property. Show past service history, upcoming maintenance, and upsell opportunities. AI suggests add-on services based on current job.",
		status: "planned",
		priority: "low",
		estimatedDate: "Q3 2025",
	},
	{
		id: "offline-mode",
		title: "Offline Mode",
		description:
			"View and edit job details without internet connection. All changes sync automatically when connection restored. Perfect for field technicians in basements or rural areas.",
		status: "planned",
		priority: "low",
		estimatedDate: "Q3 2025",
	},
	{
		id: "voice-notes",
		title: "Voice-to-Text Notes",
		description:
			"Speak your notes instead of typing. Click microphone, talk, and AI transcribes with automatic punctuation and formatting. Great for technicians wearing gloves or driving.",
		status: "planned",
		priority: "low",
		estimatedDate: "Q3 2025",
	},
];

export function JobHelpFooter() {
	const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);

	return (
		<div className="from-muted/30 to-muted/50 border-t bg-gradient-to-b backdrop-blur-sm">
			<div className="container mx-auto space-y-12 px-4 py-16">
				{/* Feature Roadmap */}
				<FeatureRoadmap
					title="Jobs Page Roadmap"
					description="We're constantly improving the jobs experience. Here's what we're working on next."
					features={JOB_FEATURES}
				/>

				{/* Collapsible Help Section */}
				<Collapsible open={isWorkflowOpen} onOpenChange={setIsWorkflowOpen}>
					<div className="text-center">
						<div className="bg-primary/10 text-primary mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
							Need Help?
						</div>
						<h2 className="mb-3 text-3xl font-bold">
							How Jobs Work - The Simple Way
						</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
							Think of a job like making a sandwich. First you decide what to
							make, then you make it, then you eat it! Here's how it works:
						</p>

						<CollapsibleTrigger asChild>
							<Button variant="ghost" className="mt-4" size="sm">
								{isWorkflowOpen ? "Hide Details" : "Show Step-by-Step Guide"}
								<ChevronDown
									className={`ml-2 h-4 w-4 transition-transform ${isWorkflowOpen ? "rotate-180" : ""}`}
								/>
							</Button>
						</CollapsibleTrigger>
					</div>

					<CollapsibleContent>
						<div className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-12">
							{/* Workflow Steps */}
							<div className="space-y-6 lg:col-span-2">
								<div className="flex items-center gap-2">
									<BookOpen className="text-primary h-5 w-5" />
									<h3 className="text-xl font-semibold">Step by Step</h3>
								</div>

								<Card className="border-muted">
									<CardContent className="pt-6">
										<div className="space-y-6">
											{SIMPLE_WORKFLOW.map((step, index) => (
												<WorkflowStep
													key={step.status}
													step={step}
													isLast={index === SIMPLE_WORKFLOW.length - 1}
												/>
											))}
										</div>
									</CardContent>
								</Card>

								{/* Quick Tips */}
								<div className="grid gap-4 sm:grid-cols-2">
									<Card className="border-muted">
										<CardHeader>
											<CardTitle className="flex items-center gap-2 text-base">
												<CheckCircle2 className="text-primary h-4 w-4" />
												Pro Tip
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-muted-foreground text-sm">
												You can't skip steps! Just like you can't eat a sandwich
												before making it, jobs have to go in order.
											</p>
										</CardContent>
									</Card>

									<Card className="border-muted">
										<CardHeader>
											<CardTitle className="flex items-center gap-2 text-base">
												<HelpCircle className="text-primary h-4 w-4" />
												Common Question
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-muted-foreground text-sm">
												"Why can't I skip to 'Paid'?" - Because you need to do
												the work first and send a bill!
											</p>
										</CardContent>
									</Card>
								</div>
							</div>

							{/* Support Form */}
							<div className="space-y-6">
								<div className="flex items-center gap-2">
									<Mail className="text-primary h-5 w-5" />
									<h3 className="text-xl font-semibold">Still Confused?</h3>
								</div>

								<Card className="border-muted">
									<CardHeader>
										<CardTitle>Ask Us!</CardTitle>
										<CardDescription className="text-base">
											No question is too simple. We're here to help you
											understand.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<SupportForm />
									</CardContent>
								</Card>

								<div className="border-muted bg-card space-y-4 rounded-lg border p-4">
									<div className="text-sm font-medium">We usually reply:</div>
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<Clock className="text-primary h-4 w-4" />
											<span className="text-muted-foreground text-sm">
												Within 2-4 hours on weekdays
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Calendar className="text-primary h-4 w-4" />
											<span className="text-muted-foreground text-sm">
												Monday - Friday, 9am - 5pm EST
											</span>
										</div>
									</div>
								</div>

								<Card className="border-primary/20 bg-primary/5">
									<CardContent className="pt-6">
										<div className="space-y-3">
											<div className="text-sm font-medium">
												🎥 Prefer watching videos?
											</div>
											<p className="text-muted-foreground text-xs">
												We have simple video tutorials that show you exactly how
												everything works!
											</p>
											<Button variant="outline" size="sm" className="w-full">
												Watch Video Guides
											</Button>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</div>
		</div>
	);
}
