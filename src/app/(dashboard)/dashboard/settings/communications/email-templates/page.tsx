/**
 * Email Templates Management Page
 *
 * Features:
 * - View all available email templates
 * - Send test emails
 * - View email send history/logs
 * - Template status and configuration
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const emailTemplates = [
	{
		category: "Authentication",
		templates: [
			{
				id: "welcome",
				name: "Welcome Email",
				description: "Sent to new users after signup",
			},
			{
				id: "email-verification",
				name: "Email Verification",
				description: "Email verification link",
			},
			{
				id: "password-reset",
				name: "Password Reset",
				description: "Password reset link",
			},
			{
				id: "password-changed",
				name: "Password Changed",
				description: "Password change confirmation",
			},
			{
				id: "magic-link",
				name: "Magic Link",
				description: "Passwordless authentication",
			},
		],
	},
	{
		category: "Job Lifecycle",
		templates: [
			{
				id: "job-confirmation",
				name: "Job Confirmation",
				description: "Job scheduled confirmation",
			},
			{
				id: "appointment-reminder",
				name: "Appointment Reminder",
				description: "24h before reminder",
			},
			{
				id: "tech-en-route",
				name: "Tech En Route",
				description: "Technician on the way",
			},
			{
				id: "job-complete",
				name: "Job Complete",
				description: "Service completion notification",
			},
		],
	},
	{
		category: "Billing",
		templates: [
			{
				id: "invoice-sent",
				name: "Invoice Sent",
				description: "Invoice with payment link",
			},
			{
				id: "payment-received",
				name: "Payment Received",
				description: "Payment confirmation",
			},
			{
				id: "payment-reminder",
				name: "Payment Reminder",
				description: "Overdue payment reminder",
			},
			{
				id: "estimate-sent",
				name: "Estimate Sent",
				description: "Quote/estimate delivery",
			},
		],
	},
	{
		category: "Customer Engagement",
		templates: [
			{
				id: "review-request",
				name: "Review Request",
				description: "Post-job review request",
			},
			{
				id: "service-reminder",
				name: "Service Reminder",
				description: "Maintenance reminder",
			},
			{
				id: "welcome-customer",
				name: "Welcome Customer",
				description: "New customer onboarding",
			},
		],
	},
];

export default function EmailTemplatesPage() {
	return (
		<div className="space-y-6 p-8">
			<div>
				<h1 className="font-bold text-4xl">Email Templates</h1>
				<p className="text-muted-foreground">Manage your email templates powered by Resend and React Email</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Template Configuration</CardTitle>
					<CardDescription>
						All email templates are code-based using React Email for maximum flexibility and version control.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4">
						<Badge variant="outline">Resend Integration</Badge>
						<Badge variant="outline">React Email</Badge>
						<Badge variant="outline">16 Templates</Badge>
						<Badge variant="outline">Dark Mode Support</Badge>
					</div>
				</CardContent>
			</Card>

			{emailTemplates.map((category) => (
				<Card key={category.category}>
					<CardHeader>
						<CardTitle>{category.category}</CardTitle>
						<CardDescription>{category.templates.length} templates</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{category.templates.map((template) => (
								<div className="flex items-center justify-between rounded-lg border p-4" key={template.id}>
									<div className="flex-1">
										<h4 className="font-medium">{template.name}</h4>
										<p className="text-muted-foreground text-sm">{template.description}</p>
									</div>
									<div className="flex gap-2">
										<Button asChild size="sm" variant="outline">
											<a href={`/emails/preview/${template.id}`} rel="noopener noreferrer" target="_blank">
												Preview
											</a>
										</Button>
										<Button size="sm" variant="outline">
											Test Send
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			))}

			<Card>
				<CardHeader>
					<CardTitle>Email Logs</CardTitle>
					<CardDescription>View recent email send history and delivery status</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">
						Email logging is configured. View logs in the database or integrate with Resend webhooks for real-time
						delivery tracking.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
