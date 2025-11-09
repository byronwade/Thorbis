/**
 * Server-only markdown utilities
 *
 * This file contains server-only functions that use Node.js APIs.
 * It should NEVER be imported by client components.
 */

import "server-only";
import { parseMarkdown } from "./markdown";
import type { KBArticleFrontmatter } from "./types";

/**
 * Read markdown file from filesystem
 *
 * Server-only function - uses Node.js fs module
 */
export async function readMarkdownFile(filePath: string): Promise<{
  frontmatter: KBArticleFrontmatter;
  content: string;
}> {
  const fs = await import("fs/promises");
  const content = await fs.readFile(filePath, "utf-8");
  return parseMarkdown(content);
}
