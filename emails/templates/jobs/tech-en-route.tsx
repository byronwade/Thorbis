/**
 * Tech En Route Email Template - Technician is on the way
 *
 * Features:
 * - Real-time notification
 * - Estimated arrival time
 * - Technician information
 * - Optional tracking link
 */

import { Text } from "@react-email/components";
import type { TechEnRouteProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";
import { EMAIL_COLORS } from "../../theme";

export default function TechEnRouteEmail({
	customerName,
	technicianName,
	estimatedArrival,
	trackingUrl,
	previewText = `${technicianName} is on the way!`,
}: TechEnRouteProps) {
	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>Your Technician is On the Way!</Heading>

			<Text style={paragraph}>Hi {customerName},</Text>

			<Card style={notificationCard}>
				<div style={notificationIcon}>🚗</div>
				<Text style={notificationText}>{technicianName} is heading to your location</Text>
				<Text style={etaText}>Estimated arrival: {estimatedArrival}</Text>
			</Card>

			<Card style={techCard}>
				<Heading level={3}>Your Technician</Heading>
				<Text style={techName}>{technicianName}</Text>
				<Text style={techDesc}>
					{technicianName} is a certified service professional with years of experience. They'll take great care of your
					service needs.
				</Text>
			</Card>

			{trackingUrl && (
				<div style={buttonContainer}>
					<Button href={trackingUrl}>Track in Real-Time</Button>
				</div>
			)}

			<Card style={tipsCard}>
				<Heading level={3}>Quick Tips</Heading>
				<ul style={list}>
					<li style={listItem}>Please ensure someone is available to greet the technician</li>
					<li style={listItem}>Have any specific concerns ready to discuss</li>
					<li style={listItem}>Feel free to ask questions about the service</li>
				</ul>
			</Card>

			<Text style={footerNote}>
				Need to contact us? Call{" "}
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

const notificationCard = {
	background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
	borderRadius: "12px",
	padding: "32px",
	margin: "24px 0",
	textAlign: "center" as const,
};

const notificationIcon = {
	fontSize: "48px",
	margin: "0 0 16px 0",
};

const notificationText = {
	color: EMAIL_COLORS.primaryText,
	fontSize: "20px",
	fontWeight: "600",
	margin: "0 0 8px 0",
};

const etaText = {
	color: EMAIL_COLORS.primaryText,
	fontSize: "24px",
	fontWeight: "700",
	margin: "0",
};

const techCard = {
	backgroundColor: "#f9fafb",
	border: "1px solid #e5e7eb",
	padding: "24px",
	margin: "24px 0",
};

const techName = {
	color: "#111827",
	fontSize: "18px",
	fontWeight: "600",
	margin: "8px 0",
};

const techDesc = {
	color: "#6b7280",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "8px 0 0 0",
};

const tipsCard = {
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
