import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, IntegrationTemplate } from "@/lib/og";

export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export const alt = "Thorbis Integration";

const integrationDescriptions: Record<string, { name: string; description: string }> = {
	quickbooks: {
		name: "QuickBooks",
		description: "Automatic sync keeps your books up to date",
	},
	stripe: {
		name: "Stripe",
		description: "Accept payments anywhere, get paid faster",
	},
	"google-calendar": {
		name: "Google Calendar",
		description: "Sync schedules across your entire team",
	},
	zapier: {
		name: "Zapier",
		description: "Connect to 5,000+ apps automatically",
	},
	twilio: {
		name: "Twilio",
		description: "SMS and voice for customer communication",
	},
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const fonts = await loadOGFonts();

	const integration = integrationDescriptions[slug] || {
		name: slug.charAt(0).toUpperCase() + slug.slice(1),
		description: "Seamless integration for your workflow",
	};

	return new ImageResponse(
		<IntegrationTemplate name={integration.name} description={integration.description} />,
		{
			...size,
			fonts,
		}
	);
}
