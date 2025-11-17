import Link from "next/link";
import Script from "next/script";
import { ResourceCard } from "@/components/content/resource-card";
import { Button } from "@/components/ui/button";
import { getResourceItems } from "@/lib/content";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
	title: "Webinars & Events",
	section: "Resources",
	description:
		"Join Thorbis product strategists and operators for live sessions on modern scheduling, automation, and growth tactics for service businesses.",
	path: "/webinars",
	keywords: ["field service webinar", "service business events", "thorbis live training"],
});

type WebinarsPageProps = {
	searchParams?: { tag?: string };
};

export default async function WebinarsPage({ searchParams }: WebinarsPageProps) {
	const activeTag = searchParams?.tag;
	const resourcesResult = await getResourceItems({
		type: "webinar",
		tagSlug: activeTag,
		limit: 24,
	});

	const now = Date.now();
	const upcoming = resourcesResult.data
		.filter((item) => item.eventStartAt && new Date(item.eventStartAt).getTime() >= now)
		.sort(
			(a, b) => new Date(a.eventStartAt ?? 0).getTime() - new Date(b.eventStartAt ?? 0).getTime()
		);
	const onDemand = resourcesResult.data
		.filter((item) => !item.eventStartAt || new Date(item.eventStartAt).getTime() < now)
		.sort(
			(a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
		);

	const tags = Array.from(
		new Map(resourcesResult.data.flatMap((item) => item.tags).map((tag) => [tag.id, tag])).values()
	).sort((a, b) => a.name.localeCompare(b.name));

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Webinars", url: `${siteUrl}/webinars` },
						])
					),
				}}
				id="webinars-breadcrumb-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="mx-auto mb-16 max-w-3xl text-center">
					<span className="border-border text-primary mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase">
						Live Learning
					</span>
					<h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
						Webinars, Workshops, and Product Sessions
					</h1>
					<p className="text-muted-foreground text-lg">
						Learn proven playbooks from Thorbis strategists and operators. Save your seat for
						upcoming sessions or catch up with the on-demand library. All sessions are included with
						the $100/month base subscription and pay-as-you-go usage—no lock-in required.
					</p>
				</header>

				{tags.length ? (
					<div className="mb-10 flex flex-wrap items-center justify-center gap-3">
						<Button asChild size="sm" variant={activeTag ? "outline" : "secondary"}>
							<Link href="/webinars">All topics</Link>
						</Button>
						{tags.map((tag) => {
							const isActive = tag.slug === activeTag;
							return (
								<Button asChild key={tag.id} size="sm" variant={isActive ? "secondary" : "outline"}>
									<Link href={`/webinars?tag=${tag.slug}`}>#{tag.name}</Link>
								</Button>
							);
						})}
					</div>
				) : null}

				<section className="mb-16 space-y-6">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<h2 className="text-2xl font-semibold">Upcoming live sessions</h2>
						<Button asChild>
							<Link href="/register">Create your account</Link>
						</Button>
					</div>
					{upcoming.length ? (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{upcoming.map((item) => (
								<ResourceCard item={item} key={item.id} />
							))}
						</div>
					) : (
						<div className="bg-muted/20 rounded-xl border border-dashed p-8 text-center">
							<h3 className="mb-3 text-lg font-semibold">New live sessions are being scheduled</h3>
							<p className="text-muted-foreground">
								Subscribe to updates and we&apos;ll let you know when the next webinar drops.
							</p>
							<div className="mt-4 flex justify-center gap-3">
								<Button asChild>
									<Link href="/contact">Join the invite list</Link>
								</Button>
								<Button asChild variant="outline">
									<Link href="/blog">Read the latest insights</Link>
								</Button>
							</div>
						</div>
					)}
				</section>

				<section className="space-y-6">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<h2 className="text-2xl font-semibold">On-demand library</h2>
						<span className="text-muted-foreground text-sm">
							{onDemand.length} {onDemand.length === 1 ? "session" : "sessions"} available
						</span>
					</div>
					{onDemand.length ? (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{onDemand.map((item) => (
								<ResourceCard item={item} key={item.id} />
							))}
						</div>
					) : (
						<p className="bg-muted/20 text-muted-foreground rounded-xl border border-dashed p-6 text-center">
							No on-demand sessions yet. Our team is preparing replays from the latest events.
						</p>
					)}
				</section>
			</div>
		</>
	);
}
