/**
 * Job Confirmation Email Template - Sent when job is scheduled
 *
 * Design:
 * - Company-branded layout (company logo, colors, contact info)
 * - Clean job details
 * - Full-width sections (no cards)
 * - Professional confirmation
 */

import { Text } from "@react-email/components";
import type { JobConfirmationProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Heading } from "../../components/heading";
import { CompanyLayout } from "../../layouts/company-layout";

export default function JobConfirmationEmail({
	customerName,
	jobDate,
	jobTime,
	technicianName,
	jobType,
	address,
	jobNumber,
	viewJobUrl,
	previewText,
	company,
}: JobConfirmationProps) {
	const companyBranding = company || {
		companyName: "Your Company",
		supportEmail: "support@yourcompany.com",
		supportPhone: "(555) 123-4567",
	};

	const defaultPreviewText =
		previewText || `Your ${jobType} appointment is confirmed`;

	return (
		<CompanyLayout company={companyBranding} previewText={defaultPreviewText}>
			<Heading level={1}>Service Appointment Confirmed ✅</Heading>

			<Text style={paragraph}>Hi {customerName},</Text>

			<Text style={paragraph}>
				Great news! Your {jobType} service has been scheduled. Here are the
				details:
			</Text>

			{/* Job Details */}
			<div style={detailsSection}>
				<div style={detailRow}>
					<Text style={detailLabel}>📋 Job Number:</Text>
					<Text style={detailValue}>#{jobNumber}</Text>
				</div>
				<div style={detailRow}>
					<Text style={detailLabel}>🔧 Service Type:</Text>
					<Text style={detailValue}>{jobType}</Text>
				</div>
				<div style={detailRow}>
					<Text style={detailLabel}>📅 Date:</Text>
					<Text style={detailValue}>{jobDate}</Text>
				</div>
				<div style={detailRow}>
					<Text style={detailLabel}>🕐 Time:</Text>
					<Text style={detailValue}>{jobTime}</Text>
				</div>
				<div style={detailRow}>
					<Text style={detailLabel}>👷 Technician:</Text>
					<Text style={detailValue}>{technicianName}</Text>
				</div>
				<div style={detailRow}>
					<Text style={detailLabel}>📍 Location:</Text>
					<Text style={detailValue}>{address}</Text>
				</div>
			</div>

			{/* What to Expect */}
			<div style={infoSection}>
				<Heading level={3}>What to Expect</Heading>
				<ul style={list}>
					<li style={listItem}>
						We'll send you a reminder 24 hours before your appointment
					</li>
					<li style={listItem}>
						You'll receive a notification when the technician is on the way
					</li>
					<li style={listItem}>
						Our technician will arrive during the scheduled time window
					</li>
				</ul>
			</div>

			<div style={buttonContainer}>
				<Button href={viewJobUrl}>View Job Details</Button>
			</div>

			<Text style={footerNote}>
				Need to reschedule? Contact us at{" "}
				<a
					href={`tel:${companyBranding.supportPhone?.replace(/\s/g, "")}`}
					style={link}
				>
					{companyBranding.supportPhone}
				</a>{" "}
				or reply to this email.
			</Text>
		</CompanyLayout>
	);
}

const paragraph = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "26px",
	margin: "0 0 20px 0",
};

const detailsSection = {
	backgroundColor: "#f0f9ff",
	borderLeft: "4px solid #3b82f6",
	padding: "24px",
	margin: "24px 0",
	borderRadius: "4px",
};

const detailRow = {
	display: "flex" as const,
	justifyContent: "space-between",
	alignItems: "center",
	marginBottom: "16px",
	paddingBottom: "16px",
	borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
};

const detailLabel = {
	color: "#6b7280",
	fontSize: "14px",
	fontWeight: "500",
	margin: "0",
};

const detailValue = {
	color: "#111827",
	fontSize: "15px",
	fontWeight: "600",
	margin: "0",
	textAlign: "right" as const,
};

const infoSection = {
	backgroundColor: "#ecfdf5",
	borderLeft: "4px solid #10b981",
	padding: "24px",
	margin: "24px 0",
	borderRadius: "4px",
};

const list = {
	color: "#166534",
	fontSize: "15px",
	lineHeight: "24px",
	margin: "12px 0 0 24px",
	padding: "0",
};

const listItem = {
	margin: "0 0 12px 0",
};

const buttonContainer = {
	margin: "40px 0",
	textAlign: "center" as const,
};

const footerNote = {
	color: "#6b7280",
	fontSize: "14px",
	lineHeight: "22px",
	margin: "32px 0 0 0",
	textAlign: "center" as const,
};

const link = {
	color: "#3b82f6",
	textDecoration: "underline",
	fontWeight: "500",
};
