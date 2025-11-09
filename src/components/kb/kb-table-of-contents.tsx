/**
 * KB Table of Contents - Server Component
 *
 * Auto-generated table of contents from article headings
 */

import Link from "next/link";
import { extractTableOfContents } from "@/lib/kb/markdown";
import { cn } from "@/lib/utils";

interface KBTableOfContentsProps {
  htmlContent: string;
  className?: string;
}

export function KBTableOfContents({
  htmlContent,
  className,
}: KBTableOfContentsProps) {
  const toc = extractTableOfContents(htmlContent);

  if (toc.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn("space-y-1", className)}
      aria-label="Table of contents"
    >
      <ul className="space-y-1">
        {toc.map((item) => (
          <li
            key={item.id}
            className={cn(
              "text-sm",
              item.level === 1 && "font-medium",
              item.level === 2 && "pl-4",
              item.level === 3 && "pl-8",
              item.level >= 4 && "pl-12"
            )}
          >
            <Link
              href={`#${item.id}`}
              className="text-muted-foreground hover:text-sidebar-accent-foreground block rounded-md px-2 py-1 transition-colors"
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

