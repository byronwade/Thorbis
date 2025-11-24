import { Container, Html, Section, Text } from "@react-email/components";

export interface PlainTextEmailProps {
	message: string;
}

/**
 * Plain text email template - renders text with line breaks preserved
 * Keeps the email looking like a simple, natural text message
 */
export const PlainTextEmail = ({ message }: PlainTextEmailProps) => (
	<Html>
		<Container style={container}>
			<Section style={section}>
				{message.split("\n").map((line, index) => (
					<Text key={index} style={text}>
						{line || "\u00A0"}
					</Text>
				))}
			</Section>
		</Container>
	</Html>
);

PlainTextEmail.PreviewText = "New message";

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
	maxWidth: "580px",
};

const section = {
	padding: "0",
};

const text = {
	fontFamily: "Arial, sans-serif",
	fontSize: "14px",
	lineHeight: "24px",
	color: "#333",
	margin: "0",
	padding: "0",
};
