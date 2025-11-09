import type {
  BlogAuthor,
  BlogCategory,
  BlogPost,
  ContentTag,
  ResourceItem,
} from "./types";

type RawTag = {
  tag?: {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    created_at?: string | null;
  } | null;
};

type RawAuthor = {
  id: string;
  slug: string;
  name: string;
  title?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
};

type RawCategory = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
};

type RawBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  hero_image_url?: string | null;
  status: string;
  featured?: boolean | null;
  pinned?: boolean | null;
  allow_comments?: boolean | null;
  published_at?: string | null;
  reading_time?: number | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  canonical_url?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
  category?: RawCategory | null;
  author?: RawAuthor | null;
  tags?: RawTag[] | null;
};

type RawResourceItem = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  hero_image_url?: string | null;
  status: string;
  type: string;
  featured?: boolean | null;
  author?: RawAuthor | null;
  published_at?: string | null;
  event_start_at?: string | null;
  event_end_at?: string | null;
  registration_url?: string | null;
  download_url?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
  tags?: RawTag[] | null;
};

export function mapContentTag(raw?: RawTag | null): ContentTag | null {
  if (!raw?.tag) {
    return null;
  }

  return {
    id: raw.tag.id,
    slug: raw.tag.slug,
    name: raw.tag.name,
    description: raw.tag.description ?? null,
    createdAt: raw.tag.created_at ?? undefined,
  };
}

export function mapBlogAuthor(raw?: RawAuthor | null): BlogAuthor | null {
  if (!raw) {
    return null;
  }

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    title: raw.title ?? null,
    bio: raw.bio ?? null,
    avatarUrl: raw.avatar_url ?? null,
    websiteUrl: raw.website_url ?? null,
    linkedinUrl: raw.linkedin_url ?? null,
    twitterUrl: raw.twitter_url ?? null,
  };
}

export function mapBlogCategory(raw?: RawCategory | null): BlogCategory | null {
  if (!raw) {
    return null;
  }

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description ?? null,
    icon: raw.icon ?? null,
    color: raw.color ?? null,
  };
}

export function mapBlogPost(raw: RawBlogPost): BlogPost {
  const tags =
    raw.tags
      ?.map(mapContentTag)
      .filter((tag): tag is ContentTag => Boolean(tag)) ?? [];

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt ?? null,
    content: raw.content,
    heroImageUrl: raw.hero_image_url ?? null,
    status: raw.status as BlogPost["status"],
    featured: Boolean(raw.featured),
    pinned: Boolean(raw.pinned),
    allowComments: raw.allow_comments ?? true,
    publishedAt: raw.published_at ?? null,
    readingTime: raw.reading_time ?? 0,
    seoTitle: raw.seo_title ?? null,
    seoDescription: raw.seo_description ?? null,
    seoKeywords: raw.seo_keywords ?? null,
    canonicalUrl: raw.canonical_url ?? null,
    metadata: raw.metadata ?? {},
    category: mapBlogCategory(raw.category),
    author: mapBlogAuthor(raw.author),
    tags,
    createdAt: raw.created_at ?? undefined,
    updatedAt: raw.updated_at ?? undefined,
  };
}

export function mapResourceItem(raw: RawResourceItem): ResourceItem {
  const tags =
    raw.tags
      ?.map(mapContentTag)
      .filter((tag): tag is ContentTag => Boolean(tag)) ?? [];

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt ?? null,
    content: raw.content ?? null,
    heroImageUrl: raw.hero_image_url ?? null,
    status: raw.status as ResourceItem["status"],
    type: raw.type as ResourceItem["type"],
    featured: Boolean(raw.featured),
    author: mapBlogAuthor(raw.author),
    publishedAt: raw.published_at ?? null,
    eventStartAt: raw.event_start_at ?? null,
    eventEndAt: raw.event_end_at ?? null,
    registrationUrl: raw.registration_url ?? null,
    downloadUrl: raw.download_url ?? null,
    ctaLabel: raw.cta_label ?? null,
    ctaUrl: raw.cta_url ?? null,
    seoTitle: raw.seo_title ?? null,
    seoDescription: raw.seo_description ?? null,
    seoKeywords: raw.seo_keywords ?? null,
    metadata: raw.metadata ?? {},
    tags,
    createdAt: raw.created_at ?? undefined,
    updatedAt: raw.updated_at ?? undefined,
  };
}
