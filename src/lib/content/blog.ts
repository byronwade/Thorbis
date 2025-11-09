import { createClient } from "@/lib/supabase/server";
import {
  mapBlogAuthor,
  mapBlogCategory,
  mapBlogPost,
  mapContentTag,
} from "./transformers";
import type {
  BlogAuthor,
  BlogCategory,
  BlogPost,
  BlogPostCollection,
  BlogPostQuery,
  ContentTag,
} from "./types";

const BLOG_POST_SELECT = `
  id,
  slug,
  title,
  excerpt,
  content,
  hero_image_url,
  status,
  featured,
  pinned,
  allow_comments,
  published_at,
  reading_time,
  seo_title,
  seo_description,
  seo_keywords,
  canonical_url,
  metadata,
  created_at,
  updated_at,
  category:blog_categories (
    id,
    slug,
    name,
    description,
    icon,
    color
  ),
  author:blog_authors (
    id,
    slug,
    name,
    title,
    bio,
    avatar_url,
    website_url,
    linkedin_url,
    twitter_url
  ),
  tags:blog_post_tags (
    tag:content_tags (
      id,
      slug,
      name,
      description,
      created_at
    )
  )
`;

const BLOG_POST_BY_TAG_SELECT = `
  post:blog_posts!inner (
    ${BLOG_POST_SELECT}
  ),
  tag:content_tags!inner (
    slug
  )
`;

const DEFAULT_PAGE_SIZE = 10;

const sanitizeSearch = (value: string): string =>
  value.replace(/[&|!:*<>@()]/g, " ").trim();

const nowUtcIso = (): string => new Date().toISOString();

export async function getBlogPosts(
  options: BlogPostQuery = {}
): Promise<BlogPostCollection> {
  const supabase = await createClient();

  if (!supabase) {
    return { data: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE };
  }

  const limit = Math.max(1, options.limit ?? DEFAULT_PAGE_SIZE);
  const page = Math.max(1, options.page ?? 1);
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const includeUnpublished = options.includeUnpublished ?? false;
  const now = nowUtcIso();

  if (options.tagSlug) {
    let query = supabase
      .from("blog_post_tags")
      .select(BLOG_POST_BY_TAG_SELECT, { count: "exact" })
      .eq("tag.slug", options.tagSlug);

    if (!includeUnpublished) {
      query = query
        .eq("post.status", "published")
        .lte("post.published_at", now);
    }

    if (options.categorySlug) {
      query = query.eq("post.category.slug", options.categorySlug);
    }

    if (options.featured) {
      query = query.eq("post.featured", true);
    }

    if (options.search) {
      const search = sanitizeSearch(options.search);
      if (search.length > 1) {
        query = query.textSearch("post.search_vector", search, {
          type: "websearch",
        });
      }
    }

    const { data, error, count } = await query
      .order("published_at", {
        ascending: false,
        foreignTable: "blog_posts",
        nullsFirst: false,
      })
      .range(from, to);

    if (error) {
      throw error;
    }

    const posts =
      data
        ?.map((row) => {
          const post = Array.isArray(row.post) ? row.post[0] : row.post;
          return post ? mapBlogPost(post as any) : null;
        })
        .filter((post): post is BlogPost => Boolean(post)) ?? [];

    return {
      data: posts,
      total: count ?? posts.length,
      page,
      pageSize: limit,
    };
  }

  let query = supabase
    .from("blog_posts")
    .select(BLOG_POST_SELECT, { count: "exact" });

  if (!includeUnpublished) {
    query = query.eq("status", "published").lte("published_at", now);
  }

  if (options.categorySlug) {
    query = query.eq("category.slug", options.categorySlug);
  }

  if (options.featured) {
    query = query.eq("featured", true);
  }

  if (options.search) {
    const search = sanitizeSearch(options.search);
    if (search.length > 1) {
      query = query.textSearch("search_vector", search, {
        type: "websearch",
      });
    }
  }

  const { data, error, count } = await query
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  const posts = data?.map((row) => mapBlogPost(row as any)) ?? [];

  return {
    data: posts,
    total: count ?? posts.length,
    page,
    pageSize: limit,
  };
}

export async function getBlogPostBySlug(
  slug: string,
  options: { includeUnpublished?: boolean } = {}
): Promise<BlogPost | null> {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const includeUnpublished = options.includeUnpublished ?? false;
  const now = nowUtcIso();

  let query = supabase
    .from("blog_posts")
    .select(BLOG_POST_SELECT)
    .eq("slug", slug)
    .limit(1);

  if (!includeUnpublished) {
    query = query.eq("status", "published").lte("published_at", now);
  }

  const { data, error } = await query.single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return mapBlogPost(data as any);
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const supabase = await createClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("blog_categories")
    .select("id, slug, name, description, icon, color")
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data?.map((row) => mapBlogCategory(row)).filter(Boolean) ??
    []) as BlogCategory[];
}

export async function getBlogTags(): Promise<ContentTag[]> {
  const supabase = await createClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("content_tags")
    .select("id, slug, name, description, created_at")
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data?.map((tag) => mapContentTag({ tag })).filter(Boolean) ??
    []) as ContentTag[];
}

export async function getBlogAuthors(): Promise<BlogAuthor[]> {
  const supabase = await createClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("blog_authors")
    .select(
      "id, slug, name, title, bio, avatar_url, website_url, linkedin_url, twitter_url"
    )
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data?.map((author) => mapBlogAuthor(author)).filter(Boolean) ??
    []) as BlogAuthor[];
}

export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
  const { data } = await getBlogPosts({
    limit,
    featured: true,
  });

  return data;
}
