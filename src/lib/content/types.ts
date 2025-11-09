export type ContentStatus = "draft" | "scheduled" | "published" | "archived";

export type ResourceType =
  | "case_study"
  | "webinar"
  | "template"
  | "guide"
  | "community"
  | "status_update";

export type ContentTag = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  createdAt?: string;
};

export type BlogCategory = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
};

export type BlogAuthor = {
  id: string;
  slug: string;
  name: string;
  title?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  heroImageUrl?: string | null;
  status: ContentStatus;
  featured: boolean;
  pinned: boolean;
  allowComments: boolean;
  publishedAt?: string | null;
  readingTime: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[] | null;
  canonicalUrl?: string | null;
  metadata: Record<string, unknown>;
  category?: BlogCategory | null;
  author?: BlogAuthor | null;
  tags: ContentTag[];
  createdAt?: string;
  updatedAt?: string;
};

export type BlogPostQuery = {
  limit?: number;
  page?: number;
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  featured?: boolean;
  includeUnpublished?: boolean;
};

export type BlogPostCollection = {
  data: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
};

export type ResourceItem = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  heroImageUrl?: string | null;
  status: ContentStatus;
  type: ResourceType;
  featured: boolean;
  author?: BlogAuthor | null;
  publishedAt?: string | null;
  eventStartAt?: string | null;
  eventEndAt?: string | null;
  registrationUrl?: string | null;
  downloadUrl?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[] | null;
  metadata: Record<string, unknown>;
  tags: ContentTag[];
  createdAt?: string;
  updatedAt?: string;
};

export type ResourceQuery = {
  limit?: number;
  page?: number;
  type?: ResourceType | ResourceType[];
  tagSlug?: string;
  search?: string;
  featured?: boolean;
  includeUnpublished?: boolean;
};

export type ResourceCollection = {
  data: ResourceItem[];
  total: number;
  page: number;
  pageSize: number;
};
