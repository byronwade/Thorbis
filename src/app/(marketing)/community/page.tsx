import Script from "next/script";

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
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
	title: "Thorbis Community",
	description:
		"Join the Thorbis community for webinars, office hours, and peer-led discussions. Share best practices with fellow operators.",
	path: "/community",
	section: "Resources",
	keywords: [
		"thorbis community",
		"field service community",
		"thorbis office hours",
	],
});

const COMMUNITY_PROGRAMS = [
	{
		title: "Monthly operator roundtables",
		description:
			"Live discussions with operations leaders on scheduling, pricing, and adoption tactics. Hosted on the second Thursday of each month.",
	},
	{
		title: "Thorbis University office hours",
		description:
			"All customers can join weekly office hours with our success team for workflow reviews, troubleshooting, and roadmap previews.",
	},
	{
		title: "Partner webinars",
		description:
			"Co-hosted sessions with financing providers, distributors, and marketing experts covering revenue strategies.",
	},
];

export default function CommunityPage() {
	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Community", url: `${siteUrl}/community` },
						]),
					),
				}}
				id="community-breadcrumb-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<section className="max-w-3xl space-y-6">
					<Badge className="tracking-wide uppercase" variant="secondary">
						Thorbis Community
					</Badge>
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
						Learn from operators building the future of service
					</h1>
					<p className="text-muted-foreground text-lg leading-relaxed">
						Join thousands of service professionals who share playbooks,
						automation tips, and growth strategies in the Thorbis community.
						Participate in live sessions or catch on-demand recordings anytime.
					</p>
					<div className="flex flex-wrap gap-3">
						<Button asChild>
							<a href="/webinars">Register for upcoming webinars</a>
						</Button>
						<Button asChild variant="outline">
							<a href="mailto:community@thorbis.com">Suggest a topic</a>
						</Button>
					</div>
				</section>

				<section className="mt-16 space-y-6">
					<h2 className="text-2xl font-semibold">Community programs</h2>
					<div className="grid gap-6 md:grid-cols-3">
						{COMMUNITY_PROGRAMS.map((program) => (
							<Card key={program.title}>
								<CardHeader>
									<CardTitle>{program.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="leading-relaxed">
										{program.description}
									</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section className="mt-16 space-y-4">
					<h2 className="text-2xl font-semibold">Join the conversation</h2>
					<p className="text-muted-foreground text-sm">
						Thorbis community members connect inside our private Slack workspace
						and in-person meetups at industry events. Request an invite to
						collaborate with peers and share best practices.
					</p>
					<Button asChild variant="secondary">
						<a href="mailto:community@thorbis.com?subject=Join%20Thorbis%20Community">
							Request community invite
						</a>
					</Button>
				</section>
			</div>
		</>
	);
}
