/**
 * KB Sidebar Content - Server Component
 *
 * Comprehensive sidebar content for knowledge base pages with:
 * - Table of contents
 * - Category navigation
 * - Related articles
 * - Quick links
 */

import { BookOpen, HelpCircle, Search } from "lucide-react";
import Link from "next/link";
import { getKBArticles, getKBCategories } from "@/actions/kb";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { KBArticleWithRelations } from "@/lib/kb/types";
import { KBTableOfContents } from "./kb-table-of-contents";

type KBSidebarContentProps = {
  currentCategory?: string;
  currentArticleId?: string;
  htmlContent?: string;
  relatedArticles?: KBArticleWithRelations[];
};

export async function KBSidebarContent({
  currentCategory,
  currentArticleId,
  htmlContent,
  relatedArticles,
}: KBSidebarContentProps) {
  const [categoriesResult, popularResult] = await Promise.all([
    getKBCategories(),
    getKBArticles({ featured: true, limit: 5 }),
  ]);

  const categories = categoriesResult.success
    ? categoriesResult.categories || []
    : [];
  const popularArticles =
    popularResult.success && popularResult.articles
      ? popularResult.articles
      : [];

  return (
    <SidebarContent>
      {/* Table of Contents */}
      {htmlContent && (
        <SidebarGroup>
          <SidebarGroupLabel>On This Page</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-1">
              <KBTableOfContents
                className="border-0 bg-transparent p-0 shadow-none"
                htmlContent={htmlContent}
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {/* Category Navigation */}
      <SidebarGroup>
        <SidebarGroupLabel>Categories</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {categories.map((category) => (
              <SidebarMenuItem key={category.id}>
                <SidebarMenuButton
                  asChild
                  isActive={currentCategory === category.slug}
                >
                  <Link href={`/kb/${category.slug}`}>
                    {category.icon && (
                      <span className="mr-2">{category.icon}</span>
                    )}
                    <span>{category.title}</span>
                  </Link>
                </SidebarMenuButton>
                {/* Render children if they exist */}
                {category.children && category.children.length > 0 && (
                  <SidebarMenu>
                    {category.children.map(
                      (child: {
                        id: string;
                        slug: string;
                        title: string;
                        children?: unknown[];
                      }) => (
                        <SidebarMenuItem key={child.id}>
                          <SidebarMenuButton
                            asChild
                            className="pl-8"
                            isActive={currentCategory === child.slug}
                          >
                            <Link href={`/kb/${child.slug}`}>
                              <span>{child.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    )}
                  </SidebarMenu>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel>Related Articles</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2">
              {relatedArticles.map((article) => (
                <Link
                  className="block"
                  href={`/kb/${article.category.slug}/${article.slug}`}
                  key={article.id}
                >
                  <div className="rounded-md border border-sidebar-border bg-sidebar p-3 transition-colors hover:bg-sidebar-accent">
                    <h4 className="line-clamp-2 font-medium text-sm leading-tight">
                      {article.title}
                    </h4>
                    {article.excerpt && (
                      <p className="mt-1 line-clamp-2 text-muted-foreground text-xs">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {/* Popular Articles */}
      {popularArticles.length > 0 && !currentArticleId && (
        <SidebarGroup>
          <SidebarGroupLabel>Popular Articles</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2">
              {popularArticles.map((article) => (
                <Link
                  className="block"
                  href={`/kb/${article.category.slug}/${article.slug}`}
                  key={article.id}
                >
                  <div className="rounded-md border border-sidebar-border bg-sidebar p-3 transition-colors hover:bg-sidebar-accent">
                    <h4 className="line-clamp-2 font-medium text-sm leading-tight">
                      {article.title}
                    </h4>
                    {article.excerpt && (
                      <p className="mt-1 line-clamp-2 text-muted-foreground text-xs">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {/* Quick Links */}
      <SidebarGroup>
        <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/kb">
                  <BookOpen />
                  <span>Knowledge Base</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/kb/search">
                  <Search />
                  <span>Search</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/support">
                  <HelpCircle />
                  <span>Contact Support</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
