/**
 * KB Sidebar Wrapper - Server Component Wrapper
 *
 * Wraps KB sidebar with SidebarProvider for proper sidebar functionality
 * Uses client component for sidebar state management
 */

import type { KBArticleWithRelations } from "@/lib/kb/types";
import { KBSidebarContent } from "./kb-sidebar";
import { KBSidebarProvider } from "./kb-sidebar-provider";

type KBSidebarWrapperProps = {
  currentCategory?: string;
  currentArticleId?: string;
  htmlContent?: string;
  relatedArticles?: KBArticleWithRelations[];
  children: React.ReactNode;
};

export async function KBSidebarWrapper({
  currentCategory,
  currentArticleId,
  htmlContent,
  relatedArticles,
  children,
}: KBSidebarWrapperProps) {
  return (
    <KBSidebarProvider>
      <KBSidebarContent
        currentArticleId={currentArticleId}
        currentCategory={currentCategory}
        htmlContent={htmlContent}
        relatedArticles={relatedArticles}
      />
      {children}
    </KBSidebarProvider>
  );
}
