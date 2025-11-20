
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
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const templateKeywords = generateSemanticKeywords("templates");

export const metadata = generateSEOMetadata({
	title: "Templates & Playbooks",
	section: "Resources",
	description:
		"Download SOP templates, proposal guides, and customer communication playbooks crafted by the Thorbis success team.",
	path: "/templates",
	keywords: [
		"service business templates",
		"field service checklists",
		"proposal templates for contractors",
		"contractor playbooks",
		"field service templates",
		"business templates",
		...templateKeywords.slice(0, 5),
	],
});

type TemplatesPageProps = {
	searchParams?: { tag?: string };
};

export default async function TemplatesPage({
	searchParams,
}: TemplatesPageProps) {
	const activeTag = searchParams?.tag;

	const resourcesResult = await getResourceItems({
		type: "template",
		tagSlug: activeTag,
		limit: 24,
	});

	const templates = resourcesResult.data;
	const tags = Array.from(
		new Map(
			resourcesResult.data
				.flatMap((item) => item.tags)
				.map((tag) => [tag.id, tag]),
		).values(),
	).sort((a, b) => a.name.localeCompare(b.name));

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Templates", url: `${siteUrl}/templates` },
						]),
					),
				}}
				id="templates-breadcrumb-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="mx-auto mb-16 max-w-3xl text-center">
					<span className="border-border text-primary mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase">
						Operations Toolkit
					</span>
					<h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
						Templates Built for Busy Service Leaders
					</h1>
					<p className="text-muted-foreground text-lg">
						Save time with ready-to-use documents for onboarding, quoting,
						customer follow-up, and technician enablement. Each download is
						optimised for Thorbis workflows.
					</p>
				</header>

				{tags.length ? (
					<div className="mb-10 flex flex-wrap items-center justify-center gap-3">
						<Button
							asChild
							size="sm"
							variant={activeTag ? "outline" : "secondary"}
						>
							<Link href="/templates">All resources</Link>
						</Button>
						{tags.map((tag) => {
							const isActive = tag.slug === activeTag;
							return (
								<Button
									asChild
									key={tag.id}
									size="sm"
									variant={isActive ? "secondary" : "outline"}
								>
									<Link href={`/templates?tag=${tag.slug}`}>#{tag.name}</Link>
								</Button>
							);
						})}
					</div>
				) : null}

				{templates.length ? (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{templates.map((item) => (
							<ResourceCard item={item} key={item.id} />
						))}
					</div>
				) : (
					<div className="bg-muted/20 rounded-xl border border-dashed p-12 text-center">
						<h2 className="mb-3 text-xl font-semibold">
							Templates are coming soon
						</h2>
						<p className="text-muted-foreground">
							We&apos;re packaging the exact checklists and SOPs our customers
							use to run Thorbis. Add yourself to the early access list and
							we&apos;ll deliver them to your inbox first.
						</p>
						<div className="mt-6 flex justify-center gap-3">
							<Button asChild>
								<Link href="/contact">Join the release list</Link>
							</Button>
							<Button asChild variant="outline">
								<Link href="/blog">Read our latest playbooks</Link>
							</Button>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
