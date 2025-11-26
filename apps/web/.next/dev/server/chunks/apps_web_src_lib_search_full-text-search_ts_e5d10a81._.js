module.exports = [
"[project]/apps/web/src/lib/search/full-text-search.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Full-Text Search Utilities
 *
 * Provides enterprise-grade PostgreSQL full-text search with:
 * - Weighted ranking (ts_rank) for best match results
 * - Multi-field search across all relevant columns
 * - Fuzzy matching with pg_trgm for typo tolerance
 * - Company-scoped security (RLS enforced)
 *
 * Performance:
 * - Uses GIN indexes for sub-millisecond search
 * - Searches millions of records efficiently
 * - Returns top 50 results by default (configurable)
 *
 * Search Features:
 * - Multi-word queries: "john plumber" matches both words
 * - Phrase search: Use quotes for exact phrases
 * - Fuzzy matching: Handles typos and variations
 * - Weighted fields: Name matches rank higher than notes
 */ __turbopack_context__.s([
    "searchAllEntities",
    ()=>searchAllEntities,
    "searchCustomersFullText",
    ()=>searchCustomersFullText,
    "searchJobsFullText",
    ()=>searchJobsFullText
]);
async function searchCustomersFullText(supabase, companyId, searchTerm, options = {}) {
    const { limit = 50, offset = 0, minSimilarity = 0.3, useFullTextSearch = true, useFuzzyMatch = true } = options;
    if (!searchTerm || searchTerm.trim().length === 0) {
        return [];
    }
    const query = searchTerm.trim();
    // Use full-text search with ranking
    if (useFullTextSearch) {
        const { data, error } = await supabase.rpc("search_customers_ranked", {
            company_id_param: companyId,
            search_query: query,
            result_limit: limit,
            result_offset: offset
        });
        if (!error && data) {
            return data;
        }
    }
    // Fallback to ILIKE search if full-text search not available or fails
    const { data } = await supabase.from("customers").select("*").eq("company_id", companyId).is("deleted_at", null).or(`display_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%,company_name.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%`).order("display_name", {
        ascending: true
    }).limit(limit).range(offset, offset + limit - 1);
    return data || [];
}
async function searchJobsFullText(supabase, companyId, searchTerm, options = {}) {
    const { limit = 50, offset = 0, useFullTextSearch = true } = options;
    if (!searchTerm || searchTerm.trim().length === 0) {
        return [];
    }
    const query = searchTerm.trim();
    // Use full-text search with ranking
    if (useFullTextSearch) {
        const { data, error } = await supabase.rpc("search_jobs_ranked", {
            company_id_param: companyId,
            search_query: query,
            result_limit: limit,
            result_offset: offset
        });
        if (!error && data) {
            return data;
        }
    }
    // Fallback to ILIKE search
    const { data } = await supabase.from("jobs").select("*").eq("company_id", companyId).is("deleted_at", null).or(`job_number.ilike.%${query}%,title.ilike.%${query}%,description.ilike.%${query}%,notes.ilike.%${query}%`).order("created_at", {
        ascending: false
    }).limit(limit).range(offset, offset + limit - 1);
    return data || [];
}
/**
 * Search properties with full-text search and ranking
 *
 * Searches across: name, address, city, state, zip_code, notes
 * Returns results ordered by relevance
 */ async function searchPropertiesFullText(supabase, companyId, searchTerm, options = {}) {
    const { limit = 50, offset = 0, useFullTextSearch = true } = options;
    if (!searchTerm || searchTerm.trim().length === 0) {
        return [];
    }
    const query = searchTerm.trim();
    // Use full-text search with ranking
    if (useFullTextSearch) {
        const { data, error } = await supabase.rpc("search_properties_ranked", {
            company_id_param: companyId,
            search_query: query,
            result_limit: limit,
            result_offset: offset
        });
        if (!error && data) {
            return data;
        }
    }
    // Fallback to ILIKE search
    const { data } = await supabase.from("properties").select("*").eq("company_id", companyId).or(`name.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%,zip_code.ilike.%${query}%`).order("address", {
        ascending: true
    }).limit(limit).range(offset, offset + limit - 1);
    return data || [];
}
/**
 * Search price book items with full-text search and ranking
 *
 * Searches across: name, sku, supplier_sku, description, category, subcategory
 * Returns results ordered by relevance
 */ async function searchPriceBookItemsFullText(supabase, companyId, searchTerm, options = {}) {
    const { limit = 100, offset = 0, useFullTextSearch = true } = options;
    if (!searchTerm || searchTerm.trim().length === 0) {
        return [];
    }
    const query = searchTerm.trim();
    // Use full-text search with ranking
    if (useFullTextSearch) {
        const { data, error } = await supabase.rpc("search_price_book_items_ranked", {
            company_id_param: companyId,
            search_query: query,
            result_limit: limit,
            result_offset: offset
        });
        if (!error && data) {
            return data;
        }
    }
    // Fallback to ILIKE search
    const { data } = await supabase.from("price_book_items").select("*").eq("company_id", companyId).or(`name.ilike.%${query}%,sku.ilike.%${query}%,supplier_sku.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`).order("name", {
        ascending: true
    }).limit(limit).range(offset, offset + limit - 1);
    return data || [];
}
/**
 * Search equipment with full-text search and ranking
 *
 * Searches across: equipment_number, name, type, manufacturer, model, serial_number
 * Returns results ordered by relevance
 */ async function searchEquipmentFullText(supabase, companyId, searchTerm, options = {}) {
    const { limit = 50, offset = 0, useFullTextSearch = true } = options;
    if (!searchTerm || searchTerm.trim().length === 0) {
        return [];
    }
    const query = searchTerm.trim();
    // Use full-text search with ranking
    if (useFullTextSearch) {
        const { data, error } = await supabase.rpc("search_equipment_ranked", {
            company_id_param: companyId,
            search_query: query,
            result_limit: limit,
            result_offset: offset
        });
        if (!error && data) {
            return data;
        }
    }
    // Fallback to ILIKE search
    const { data } = await supabase.from("equipment").select("*").eq("company_id", companyId).is("deleted_at", null).or(`equipment_number.ilike.%${query}%,name.ilike.%${query}%,type.ilike.%${query}%,manufacturer.ilike.%${query}%,model.ilike.%${query}%,serial_number.ilike.%${query}%`).order("name", {
        ascending: true
    }).limit(limit).range(offset, offset + limit - 1);
    return data || [];
}
async function searchAllEntities(supabase, companyId, searchTerm, options = {}) {
    const defaultLimit = options.limit || 10; // Limit per entity
    const [customers, jobs, properties, equipment, priceBookItems] = await Promise.all([
        searchCustomersFullText(supabase, companyId, searchTerm, {
            ...options,
            limit: defaultLimit
        }),
        searchJobsFullText(supabase, companyId, searchTerm, {
            ...options,
            limit: defaultLimit
        }),
        searchPropertiesFullText(supabase, companyId, searchTerm, {
            ...options,
            limit: defaultLimit
        }),
        searchEquipmentFullText(supabase, companyId, searchTerm, {
            ...options,
            limit: defaultLimit
        }),
        searchPriceBookItemsFullText(supabase, companyId, searchTerm, {
            ...options,
            limit: defaultLimit
        })
    ]);
    return {
        customers,
        jobs,
        properties,
        equipment,
        priceBookItems
    };
}
}),
];

//# sourceMappingURL=apps_web_src_lib_search_full-text-search_ts_e5d10a81._.js.map