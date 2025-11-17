/**
 * Job Confirmation Email Template - Sent when job is scheduled
 *
 * Features:
 * - Confirms job details
 * - Technician information
 * - Date, time, and address
 * - Link to view job details
 */

import { Text } from "@react-email/components";
import type { JobConfirmationProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export default function JobConfirmationEmail({
	customerName,
	jobDate,
	jobTime,
	technicianName,
	jobType,
	address,
	jobNumber,
	viewJobUrl,
	previewText = `Your ${jobType} appointment is confirmed`,
}: JobConfirmationProps) {
	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>Your Service Appointment is Confirmed</Heading>

			<Text style={paragraph}>Hi {customerName},</Text>

			<Text style={paragraph}>
				Great news! Your {jobType} service has been scheduled. Here are the details:
			</Text>

			<Card style={detailsCard}>
				<div style={detailRow}>
					<Text style={detailLabel}>Job Number:</Text>
					<Text style={detailValue}>#{jobNumber}</Text>
				</div>
				<div style={detailRow}>
					<Text style={detailLabel}>Service Type:</Text>
					<Text style={detailValue}>{jobType}</Text>
				</div>
				<div style={detailRow}>
					<Text style={detailLabel}>Date:</Text>
					<Text style={detailValue}>{jobDate}</Text>
				</div>
				<div style={detailRow}>
					<Text style={detailLabel}>Time:</Text>
					<Text style={detailValue}>{jobTime}</Text>
				</div>
				<div style={detailRow}>
					<Text style={detailLabel}>Technician:</Text>
					<Text style={detailValue}>{technicianName}</Text>
				</div>
				<div style={detailRow}>
					<Text style={detailLabel}>Location:</Text>
					<Text style={detailValue}>{address}</Text>
				</div>
			</Card>

			<Card style={infoCard}>
				<Heading level={3}>What to expect</Heading>
				<ul style={list}>
					<li style={listItem}>We'll send you a reminder 24 hours before your appointment</li>
					<li style={listItem}>You'll receive a notification when the technician is on the way</li>
					<li style={listItem}>Our technician will arrive during the scheduled time window</li>
				</ul>
			</Card>

			<div style={buttonContainer}>
				<Button href={viewJobUrl}>View Job Details</Button>
			</div>

			<Text style={footerNote}>
				Need to reschedule? Contact us at{" "}
				<a href="tel:+1234567890" style={link}>
					(123) 456-7890
				</a>{" "}
				or reply to this email.
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

const detailsCard = {
	backgroundColor: "#f9fafb",
	border: "1px solid #e5e7eb",
	padding: "24px",
	margin: "24px 0",
};

const detailRow = {
	display: "flex" as const,
	justifyContent: "space-between",
	marginBottom: "12px",
};

const detailLabel = {
	color: "#6b7280",
	fontSize: "14px",
	fontWeight: "500",
	margin: "0",
};

const detailValue = {
	color: "#111827",
	fontSize: "14px",
	fontWeight: "600",
	margin: "0",
	textAlign: "right" as const,
};

const infoCard = {
	backgroundColor: "#eff6ff",
	border: "1px solid #bfdbfe",
	margin: "24px 0",
};

const list = {
	color: "#1e40af",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "12px 0 0 20px",
	padding: "0",
};

const listItem = {
	margin: "0 0 8px 0",
};

const buttonContainer = {
	margin: "32px 0",
	textAlign: "center" as const,
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
