module.exports = [
"[project]/apps/web/src/lib/ai/memory-service.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * AI Memory Service - Semantic memory with embeddings (Mem0-style)
 * Based on Mem0 architecture and industry best practices for AI memory systems
 */ __turbopack_context__.s([
    "consolidateMemories",
    ()=>consolidateMemories,
    "decayOldMemories",
    ()=>decayOldMemories,
    "deleteMemory",
    ()=>deleteMemory,
    "extractMemoriesFromConversation",
    ()=>extractMemoriesFromConversation,
    "getEntityMemories",
    ()=>getEntityMemories,
    "getMemoryStatistics",
    ()=>getMemoryStatistics,
    "searchMemories",
    ()=>searchMemories,
    "storeMemories",
    ()=>storeMemories,
    "storeMemory",
    ()=>storeMemory,
    "updateMemoryImportance",
    ()=>updateMemoryImportance
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
/**
 * Generate embeddings using OpenAI API (or other provider)
 * This is a placeholder - replace with actual embedding generation
 */ async function generateEmbedding(text) {
    // In production, call OpenAI or another embedding provider
    // For now, we'll use a simple hash-based approach for testing
    // This should be replaced with actual embedding generation
    // Check if we have OpenAI API key configured
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
        try {
            const response = await fetch("https://api.openai.com/v1/embeddings", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${openaiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "text-embedding-3-small",
                    input: text,
                    dimensions: 1536
                })
            });
            if (response.ok) {
                const data = await response.json();
                return data.data[0].embedding;
            }
        } catch (error) {
            console.error("Failed to generate OpenAI embedding:", error);
        }
    }
    // Fallback: generate a deterministic pseudo-embedding for testing
    // This allows the system to work without an API key for development
    const hash = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(text).digest("hex");
    const embedding = [];
    for(let i = 0; i < 1536; i++){
        // Generate a value between -1 and 1 based on hash
        const charCode = hash.charCodeAt(i % hash.length);
        embedding.push((charCode / 128 - 1) * Math.sin(i));
    }
    // Normalize the vector
    const magnitude = Math.sqrt(embedding.reduce((sum, val)=>sum + val * val, 0));
    return embedding.map((val)=>val / magnitude);
}
async function storeMemory(companyId, userId, memory) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const memoryId = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomUUID();
    // Generate embedding for the content
    const embedding = await generateEmbedding(memory.content);
    // Calculate content hash for deduplication
    const contentHash = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(memory.content).digest("hex");
    // Check for duplicate content
    const { data: existing } = await supabase.from("ai_memory").select("id").eq("company_id", companyId).eq("content_hash", contentHash).maybeSingle();
    if (existing) {
        // Update access count instead of creating duplicate
        await supabase.from("ai_memory").update({
            access_count: supabase.rpc("increment", {
                x: 1
            }),
            last_accessed_at: new Date().toISOString()
        }).eq("id", existing.id);
        return existing.id;
    }
    const { error } = await supabase.from("ai_memory").insert({
        id: memoryId,
        company_id: companyId,
        user_id: userId,
        content: memory.content,
        content_hash: contentHash,
        memory_type: memory.memoryType,
        scope: memory.scope,
        entity_type: memory.entityType,
        entity_id: memory.entityId,
        source_message_id: memory.sourceMessageId,
        source_chat_id: memory.sourceChatId,
        embedding,
        importance: memory.importance || 0.5,
        access_count: 0,
        tags: memory.tags || [],
        metadata: memory.metadata || {},
        created_at: new Date().toISOString()
    });
    if (error) {
        console.error("Failed to store memory:", error);
        throw error;
    }
    return memoryId;
}
async function storeMemories(companyId, userId, memories) {
    const memoryIds = [];
    for (const memory of memories){
        try {
            const id = await storeMemory(companyId, userId, memory);
            memoryIds.push(id);
        } catch (error) {
            console.error("Failed to store memory:", error);
        }
    }
    return memoryIds;
}
async function searchMemories(companyId, query, options) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const limit = options?.limit || 10;
    const minSimilarity = options?.minSimilarity || 0.5;
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    // Use Supabase's vector similarity search
    // This requires a custom RPC function in Supabase
    const { data, error } = await supabase.rpc("vector_memory_search", {
        p_company_id: companyId,
        p_query_embedding: queryEmbedding,
        p_user_id: options?.userId || null,
        p_scope: options?.scope || null,
        p_memory_types: options?.memoryTypes || null,
        p_entity_type: options?.entityType || null,
        p_entity_id: options?.entityId || null,
        p_limit: limit,
        p_min_similarity: minSimilarity
    });
    if (error) {
        console.error("Failed to search memories:", error);
        // Fallback to non-vector search if RPC doesn't exist
        return fallbackSearch(companyId, query, options);
    }
    // Update access counts for retrieved memories
    if (data && data.length > 0) {
        const memoryIds = data.map((m)=>m.id);
        await updateAccessCounts(companyId, memoryIds);
    }
    return (data || []).map((m)=>({
            id: m.id,
            content: m.content,
            memoryType: m.memory_type,
            similarity: m.similarity,
            importance: m.importance,
            createdAt: m.created_at,
            accessCount: m.access_count
        }));
}
/**
 * Fallback search when vector search RPC is not available
 */ async function fallbackSearch(companyId, query, options) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const limit = options?.limit || 10;
    let dbQuery = supabase.from("ai_memory").select("id, content, memory_type, importance, created_at, access_count").eq("company_id", companyId).is("deleted_at", null).order("importance", {
        ascending: false
    }).limit(limit);
    if (options?.userId) {
        dbQuery = dbQuery.eq("user_id", options.userId);
    }
    if (options?.scope) {
        dbQuery = dbQuery.eq("scope", options.scope);
    }
    if (options?.memoryTypes && options.memoryTypes.length > 0) {
        dbQuery = dbQuery.in("memory_type", options.memoryTypes);
    }
    if (options?.entityType) {
        dbQuery = dbQuery.eq("entity_type", options.entityType);
    }
    if (options?.entityId) {
        dbQuery = dbQuery.eq("entity_id", options.entityId);
    }
    // Text search fallback
    dbQuery = dbQuery.ilike("content", `%${query}%`);
    const { data, error } = await dbQuery;
    if (error) {
        console.error("Fallback search failed:", error);
        return [];
    }
    return (data || []).map((m)=>({
            id: m.id,
            content: m.content,
            memoryType: m.memory_type,
            similarity: 0.5,
            importance: m.importance,
            createdAt: m.created_at,
            accessCount: m.access_count
        }));
}
/**
 * Update access counts for retrieved memories
 */ async function updateAccessCounts(companyId, memoryIds) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Update in batches to avoid long-running transactions
    for (const id of memoryIds){
        await supabase.from("ai_memory").update({
            access_count: supabase.sql`access_count + 1`,
            last_accessed_at: new Date().toISOString()
        }).eq("id", id).eq("company_id", companyId);
    }
}
async function getEntityMemories(companyId, entityType, entityId, options) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const limit = options?.limit || 20;
    let query = supabase.from("ai_memory").select("id, content, memory_type, importance, created_at").eq("company_id", companyId).eq("entity_type", entityType).eq("entity_id", entityId).is("deleted_at", null).order("importance", {
        ascending: false
    }).limit(limit);
    if (options?.memoryTypes && options.memoryTypes.length > 0) {
        query = query.in("memory_type", options.memoryTypes);
    }
    const { data, error } = await query;
    if (error) {
        console.error("Failed to get entity memories:", error);
        return [];
    }
    return (data || []).map((m)=>({
            id: m.id,
            content: m.content,
            memoryType: m.memory_type,
            importance: m.importance,
            createdAt: m.created_at
        }));
}
async function updateMemoryImportance(companyId, memoryId, importance) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { error } = await supabase.from("ai_memory").update({
        importance: Math.max(0, Math.min(1, importance))
    }).eq("id", memoryId).eq("company_id", companyId);
    if (error) {
        console.error("Failed to update memory importance:", error);
    }
}
async function deleteMemory(companyId, memoryId) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { error } = await supabase.from("ai_memory").update({
        deleted_at: new Date().toISOString()
    }).eq("id", memoryId).eq("company_id", companyId);
    if (error) {
        console.error("Failed to delete memory:", error);
        return false;
    }
    return true;
}
async function extractMemoriesFromConversation(companyId, userId, chatId, messageId, content, role) {
    // This is a simplified extraction - in production, you might use
    // an LLM to extract structured memories from the conversation
    const memories = [];
    // Store the interaction itself
    memories.push({
        content: content.substring(0, 500),
        memoryType: "interaction",
        scope: userId ? "user" : "company",
        sourceMessageId: messageId,
        sourceChatId: chatId,
        importance: 0.5,
        metadata: {
            role
        }
    });
    // Extract potential facts (very basic - use LLM in production)
    const factPatterns = [
        /(?:remember|note|important)[:\s]+(.+?)(?:\.|$)/gi,
        /(?:always|never|usually)[:\s]+(.+?)(?:\.|$)/gi
    ];
    for (const pattern of factPatterns){
        const matches = content.matchAll(pattern);
        for (const match of matches){
            if (match[1] && match[1].length > 10) {
                memories.push({
                    content: match[1].trim(),
                    memoryType: "fact",
                    scope: userId ? "user" : "company",
                    sourceMessageId: messageId,
                    sourceChatId: chatId,
                    importance: 0.7
                });
            }
        }
    }
    return storeMemories(companyId, userId, memories);
}
async function getMemoryStatistics(companyId) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data, error } = await supabase.from("ai_memory").select("memory_type, scope, importance, access_count, created_at").eq("company_id", companyId).is("deleted_at", null);
    if (error || !data) {
        return {
            totalMemories: 0,
            byType: {},
            byScope: {},
            averageImportance: 0,
            totalAccessCount: 0,
            memoriesLast7Days: 0
        };
    }
    const byType = {};
    const byScope = {};
    let totalImportance = 0;
    let totalAccessCount = 0;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    let memoriesLast7Days = 0;
    for (const memory of data){
        byType[memory.memory_type] = (byType[memory.memory_type] || 0) + 1;
        byScope[memory.scope] = (byScope[memory.scope] || 0) + 1;
        totalImportance += memory.importance;
        totalAccessCount += memory.access_count;
        if (new Date(memory.created_at) > sevenDaysAgo) {
            memoriesLast7Days++;
        }
    }
    return {
        totalMemories: data.length,
        byType,
        byScope,
        averageImportance: data.length > 0 ? totalImportance / data.length : 0,
        totalAccessCount,
        memoriesLast7Days
    };
}
async function consolidateMemories(companyId) {
    // This would use vector similarity to find and merge similar memories
    // For now, we'll just return zeros - implement with actual consolidation logic
    console.log("Memory consolidation for company:", companyId);
    return {
        consolidated: 0,
        deleted: 0
    };
}
async function decayOldMemories(companyId, options) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const maxAge = options?.maxAge || 90; // 90 days default
    const minAccessCount = options?.minAccessCount || 1;
    const cutoffDate = new Date(Date.now() - maxAge * 24 * 60 * 60 * 1000);
    // Find old, unused memories
    const { data, error } = await supabase.from("ai_memory").select("id").eq("company_id", companyId).is("deleted_at", null).lt("created_at", cutoffDate.toISOString()).lte("access_count", minAccessCount);
    if (error || !data) {
        return {
            affected: 0,
            deleted: 0
        };
    }
    if (options?.dryRun) {
        return {
            affected: data.length,
            deleted: 0
        };
    }
    // Soft delete old memories
    const ids = data.map((m)=>m.id);
    if (ids.length > 0) {
        await supabase.from("ai_memory").update({
            deleted_at: new Date().toISOString()
        }).in("id", ids).eq("company_id", companyId);
    }
    return {
        affected: data.length,
        deleted: data.length
    };
}
}),
];

//# sourceMappingURL=apps_web_src_lib_ai_memory-service_ts_be9d7ea7._.js.map