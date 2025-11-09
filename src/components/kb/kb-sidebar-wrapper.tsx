/**
 * KB Sidebar Wrapper - Server Component Wrapper
 *
 * Wraps KB sidebar with SidebarProvider for proper sidebar functionality
 * Uses client component for sidebar state management
 */

import { KBSidebarProvider } from "./kb-sidebar-provider";
import { KBSidebarContent } from "./kb-sidebar";
import type { KBArticleWithRelations } from "@/lib/kb/types";

interface KBSidebarWrapperProps {
  currentCategory?: string;
  currentArticleId?: string;
  htmlContent?: string;
  relatedArticles?: KBArticleWithRelations[];
  children: React.ReactNode;
}

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
        currentCategory={currentCategory}
        currentArticleId={currentArticleId}
        htmlContent={htmlContent}
        relatedArticles={relatedArticles}
      />
      {children}
    </KBSidebarProvider>
  );
}

