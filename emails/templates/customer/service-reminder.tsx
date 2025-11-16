/**
 * Service Reminder Email Template - Maintenance reminder
 *
 * Features:
 * - Proactive service reminder
 * - Last service information
 * - Easy scheduling
 * - Value proposition
 */

import { Text } from "@react-email/components";
import type { ServiceReminderProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export default function ServiceReminderEmail({
	customerName,
	serviceName,
	lastServiceDate,
	scheduleUrl,
	previewText = `Time for your ${serviceName} service`,
}: ServiceReminderProps) {
	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>It's Time for Service</Heading>

			<Text style={paragraph}>Hi {customerName},</Text>

			<Text style={paragraph}>
				We wanted to remind you that it's time for your scheduled {serviceName} service. Regular maintenance helps
				prevent costly repairs and keeps everything running smoothly.
			</Text>

			<Card style={reminderCard}>
				<div style={calendarIcon}>📅</div>
				<Text style={reminderTitle}>{serviceName}</Text>
				<Text style={lastServiceText}>Last service: {lastServiceDate}</Text>
			</Card>

			<div style={buttonContainer}>
				<Button href={scheduleUrl}>Schedule Service</Button>
			</div>

			<Card style={benefitsCard}>
				<Heading level={3}>Why regular maintenance matters:</Heading>
				<ul style={list}>
					<li style={listItem}>
						<strong>Prevent breakdowns:</strong> Catch small issues before they become big problems
					</li>
					<li style={listItem}>
						<strong>Save money:</strong> Regular maintenance is cheaper than emergency repairs
					</li>
					<li style={listItem}>
						<strong>Extend lifespan:</strong> Keep your equipment running longer
					</li>
					<li style={listItem}>
						<strong>Maintain warranty:</strong> Some warranties require regular service
					</li>
				</ul>
			</Card>

			<Card style={specialOfferCard}>
				<Text style={offerIcon}>🎁</Text>
				<Heading level={3}>Valued Customer Benefit</Heading>
				<Text style={offerText}>
					As a returning customer, you'll receive priority scheduling and our best service rate.
				</Text>
			</Card>

			<Text style={footerNote}>
				Questions about this service reminder? Call us at{" "}
				<a href="tel:+1234567890" style={link}>
					(123) 456-7890
				</a>
			</Text>
		</BaseLayout>
	);
}

const paragraph = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "0 0 16px 0",
};

const reminderCard = {
	backgroundColor: "#f9fafb",
	border: "2px solid hsl(217 91% 60%)",
	borderRadius: "12px",
	padding: "32px",
	margin: "24px 0",
	textAlign: "center" as const,
};

const calendarIcon = {
	fontSize: "64px",
	margin: "0 0 16px 0",
};

const reminderTitle = {
	color: "hsl(217 91% 60%)",
	fontSize: "24px",
	fontWeight: "700",
	margin: "0 0 8px 0",
};

const lastServiceText = {
	color: "#6b7280",
	fontSize: "14px",
	margin: "0",
};

const buttonContainer = {
	margin: "32px 0",
	textAlign: "center" as const,
};

const benefitsCard = {
	backgroundColor: "#f0fdf4",
	border: "1px solid #bbf7d0",
	margin: "24px 0",
};

const list = {
	color: "#166534",
	fontSize: "14px",
	lineHeight: "22px",
	margin: "12px 0 0 20px",
	padding: "0",
};

const listItem = {
	margin: "0 0 12px 0",
};

const specialOfferCard = {
	backgroundColor: "#fffbeb",
	border: "1px solid #fde68a",
	borderRadius: "8px",
	padding: "24px",
	margin: "24px 0",
	textAlign: "center" as const,
};

const offerIcon = {
	fontSize: "48px",
	margin: "0 0 12px 0",
};

const offerText = {
	color: "#92400e",
	fontSize: "15px",
	lineHeight: "22px",
	margin: "12px 0 0 0",
};

const footerNote = {
	color: "#6b7280",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "32px 0 0 0",
	textAlign: "center" as const,
};

const link = {
	color: "hsl(217 91% 60%)",
	textDecoration: "underline",
};
