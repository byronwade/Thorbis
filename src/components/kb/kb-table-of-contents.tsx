/**
 * KB Table of Contents - Server Component
 *
 * Auto-generated table of contents from article headings
 */

import Link from "next/link";
import { extractTableOfContents } from "@/lib/kb/markdown";
import { cn } from "@/lib/utils";

type KBTableOfContentsProps = {
	htmlContent: string;
	className?: string;
};

export function KBTableOfContents({ htmlContent, className }: KBTableOfContentsProps) {
	const toc = extractTableOfContents(htmlContent);

	if (toc.length === 0) {
		return null;
	}

	return (
		<nav aria-label="Table of contents" className={cn("space-y-1", className)}>
			<ul className="space-y-1">
				{toc.map((item) => (
					<li
						className={cn(
							"text-sm",
							item.level === 1 && "font-medium",
							item.level === 2 && "pl-4",
							item.level === 3 && "pl-8",
							item.level >= 4 && "pl-12"
						)}
						key={item.id}
					>
						<Link
							className="block rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-sidebar-accent-foreground"
							href={`#${item.id}`}
						>
							{item.text}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
