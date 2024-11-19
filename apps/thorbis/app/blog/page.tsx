import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function BlogPage() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<main className="container mx-auto px-4 py-8">
				<nav className="mb-8 flex justify-between">
					<Link href="/" className="flex items-center text-primary hover:underline">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Home
					</Link>
					<Link href="/blog" className="flex items-center text-primary hover:underline">
						Go to Blog
						<ArrowRight className="ml-2 h-4 w-4" />
					</Link>
				</nav>

				<article className="prose dark:prose-invert lg:prose-xl mx-auto">
					<h1 className="mb-4 text-4xl font-bold">Blog</h1>
					<div className="mb-8 text-sm text-muted-foreground">By John Doe | Published on June 15, 2023</div>

					<div className="relative w-full h-[400px] mb-8">
						<Image src="https://picsum.photos/800/400" alt="Futuristic web development concept" width={800} height={400} priority className="rounded-lg object-cover mb-8 w-full" />
					</div>

					<p>The landscape of web development is constantly evolving, with new technologies and methodologies emerging at a rapid pace. As we look towards the future, it&apos;s clear that the way we build and interact with websites will undergo significant changes.</p>

					<h2 className="mt-8 mb-4 text-2xl font-semibold">The Rise of AI-Assisted Coding</h2>
					<p>One of the most exciting developments in web development is the integration of artificial intelligence into the coding process. AI-powered tools are becoming increasingly sophisticated, capable of generating code snippets, suggesting optimizations, and even debugging complex issues.</p>

					<blockquote className="border-l-4 border-primary pl-4 italic">&quot;The future of web development lies in the seamless collaboration between human creativity and machine intelligence.&quot; - Jane Smith, Tech Visionary</blockquote>

					<h2 className="mt-8 mb-4 text-2xl font-semibold">The Importance of Accessibility</h2>
					<p>As the web becomes more integral to our daily lives, ensuring that websites are accessible to all users, regardless of their abilities, is paramount. Future web development practices will likely place an even greater emphasis on creating inclusive digital experiences.</p>

					<Card className="my-8">
						<CardContent className="p-6">
							<h3 className="text-xl font-semibold mb-2">Key Takeaways</h3>
							<ul className="list-disc pl-6">
								<li>AI will play a crucial role in streamlining development processes</li>
								<li>Accessibility will become a fundamental aspect of web design</li>
								<li>New frameworks and tools will emerge to support these changes</li>
							</ul>
						</CardContent>
					</Card>

					<p>As we move forward, it&apos;s clear that web developers will need to adapt to these changing trends and technologies. Those who embrace these advancements will be well-positioned to create innovative, accessible, and powerful web experiences.</p>

					<div className="mt-8 flex justify-center">
						<Button size="lg">Read More Articles</Button>
					</div>
				</article>
			</main>
		</div>
	);
}
