import { createClient } from "@/lib/supabase/server";
import { mapResourceItem } from "./transformers";
import type {
	ResourceCollection,
	ResourceItem,
	ResourceQuery,
	ResourceType,
} from "./types";

const RESOURCE_ITEM_SELECT = `
  id,
  slug,
  title,
  excerpt,
  content,
  hero_image_url,
  status,
  type,
  featured,
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
  published_at,
  event_start_at,
  event_end_at,
  registration_url,
  download_url,
  cta_label,
  cta_url,
  seo_title,
  seo_description,
  seo_keywords,
  metadata,
  created_at,
  updated_at,
  tags:resource_item_tags (
    tag:content_tags (
      id,
      slug,
      name,
      description,
      created_at
    )
  )
`;

const RESOURCE_BY_TAG_SELECT = `
  item:resource_items!inner (
    ${RESOURCE_ITEM_SELECT}
  ),
  tag:content_tags!inner (
    slug
  )
`;

const DEFAULT_PAGE_SIZE = 12;

const sanitizeSearch = (value: string): string =>
	value.replace(/[&|!:*<>@()]/g, " ").trim();

const nowUtcIso = (): string => new Date().toISOString();

export async function getResourceItems(
	options: ResourceQuery = {},
): Promise<ResourceCollection> {
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
			.from("resource_item_tags")
			.select(RESOURCE_BY_TAG_SELECT, { count: "exact" })
			.eq("tag.slug", options.tagSlug);

		if (!includeUnpublished) {
			query = query
				.eq("item.status", "published")
				.lte("item.published_at", now);
		}

		if (options.type) {
			const types = Array.isArray(options.type) ? options.type : [options.type];
			query = query.in("item.type", types);
		}

		if (options.featured) {
			query = query.eq("item.featured", true);
		}

		if (options.search) {
			const search = sanitizeSearch(options.search);
			if (search.length > 1) {
				query = query.textSearch("item.search_vector", search, {
					type: "websearch",
				});
			}
		}

		const { data, error, count } = await query
			.order("published_at", {
				ascending: false,
				foreignTable: "resource_items",
				nullsFirst: false,
			})
			.range(from, to);

		if (error) {
			throw error;
		}

		const items =
			data
				?.map((row) => {
					const item = Array.isArray(row.item) ? row.item[0] : row.item;
					return item ? mapResourceItem(item as any) : null;
				})
				.filter((item): item is ResourceItem => Boolean(item)) ?? [];

		return {
			data: items,
			total: count ?? items.length,
			page,
			pageSize: limit,
		};
	}

	let query = supabase
		.from("resource_items")
		.select(RESOURCE_ITEM_SELECT, { count: "exact" });

	if (!includeUnpublished) {
		query = query.eq("status", "published").lte("published_at", now);
	}

	if (options.type) {
		const types = Array.isArray(options.type) ? options.type : [options.type];
		query = query.in("type", types);
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

	const items = data?.map((row) => mapResourceItem(row as any)) ?? [];

	return {
		data: items,
		total: count ?? items.length,
		page,
		pageSize: limit,
	};
}

async function getResourceItemBySlug(
	slug: string,
	options: { includeUnpublished?: boolean } = {},
): Promise<ResourceItem | null> {
	const supabase = await createClient();

	if (!supabase) {
		return null;
	}

	const includeUnpublished = options.includeUnpublished ?? false;
	const now = nowUtcIso();

	let query = supabase
		.from("resource_items")
		.select(RESOURCE_ITEM_SELECT)
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

	return mapResourceItem(data as any);
}

async function getResourceItemsByType(
	type: ResourceType,
	limit = 6,
): Promise<ResourceItem[]> {
	const { data } = await getResourceItems({
		type,
		limit,
	});
	return data;
}

async function getFeaturedResources(limit = 4): Promise<ResourceItem[]> {
	const { data } = await getResourceItems({
		featured: true,
		limit,
	});
	return data;
}
