/**
 * Pin Board Section - Server Component
 *
 * Main wrapper that fetches data and renders the pin board content.
 * Uses React.cache() for deduped queries.
 */

import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
  getPinBoardCategories,
  getPinBoardPosts,
  getPinBoardCategoryStats,
} from "@/lib/queries/pin-board";
import { PinBoardContent } from "./pin-board-content";

export async function PinBoardSection() {
  const companyId = await getActiveCompanyId();

  if (!companyId) {
    return null;
  }

  // Fetch data in parallel using React.cache()
  const [categories, posts, categoryStats] = await Promise.all([
    getPinBoardCategories(companyId),
    getPinBoardPosts(companyId, { limit: 50 }),
    getPinBoardCategoryStats(companyId),
  ]);

  return (
    <PinBoardContent
      categories={categories}
      posts={posts}
      categoryStats={categoryStats}
      companyId={companyId}
    />
  );
}
