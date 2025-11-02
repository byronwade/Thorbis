/**
 * Offline Supabase Client Wrapper
 *
 * Wraps Supabase client to handle offline scenarios transparently.
 * When offline: queues operations and returns optimistic responses
 * When online: makes real requests and caches responses
 *
 * Usage:
 * ```typescript
 * const client = createOfflineClient();
 * const result = await client.insert("jobs", data);
 * ```
 */

"use client";

import { createClient } from "@/lib/supabase/client";
import {
  addRecord,
  deleteRecord,
  generateTempId,
  getAllRecords,
  getRecord,
  isTempId,
  type StoreName,
  updateRecord,
} from "./indexed-db";
import { isOnline } from "./network-status";
import { addToSyncQueue } from "./sync-queue";

export interface OfflineResponse<T = any> {
  data: T | null;
  error: Error | null;
  fromCache?: boolean;
  queued?: boolean;
}

/**
 * Create an offline-capable Supabase client
 */
export function createOfflineClient() {
  const supabase = createClient();

  return {
    /**
     * Insert a record (handles offline automatically)
     */
    async insert<T extends Record<string, any>>(
      table: string,
      data: Omit<T, "id">
    ): Promise<OfflineResponse<T>> {
      if (isOnline() && supabase) {
        try {
          const { data: result, error } = await supabase
            .from(table)
            .insert(data)
            .select()
            .single();

          if (error) {
            return { data: null, error: new Error(error.message) };
          }

          // Cache in IndexedDB
          const storeName = getStoreNameFromTable(table);
          if (storeName && result) {
            await addRecord(storeName, { ...result, synced: true });
          }

          return { data: result as T, error: null };
        } catch (err) {
          return {
            data: null,
            error: err instanceof Error ? err : new Error("Insert failed"),
          };
        }
      } else {
        // Offline: queue operation and return optimistic response
        const tempId = generateTempId();
        const record = { id: tempId, ...data, synced: false } as unknown as T;

        const storeName = getStoreNameFromTable(table);
        if (storeName) {
          await addRecord(storeName, record);
        }

        await addToSyncQueue("INSERT", table, record);

        return { data: record, error: null, queued: true };
      }
    },

    /**
     * Update a record (handles offline automatically)
     */
    async update<T extends Record<string, any>>(
      table: string,
      id: string,
      data: Partial<T>
    ): Promise<OfflineResponse<T>> {
      if (isOnline() && supabase) {
        try {
          const { data: result, error } = await supabase
            .from(table)
            .update(data)
            .eq("id", id)
            .select()
            .single();

          if (error) {
            return { data: null, error: new Error(error.message) };
          }

          // Update in IndexedDB
          const storeName = getStoreNameFromTable(table);
          if (storeName && result) {
            await updateRecord(storeName, { ...result, synced: true });
          }

          return { data: result as T, error: null };
        } catch (err) {
          return {
            data: null,
            error: err instanceof Error ? err : new Error("Update failed"),
          };
        }
      } else {
        // Offline: queue operation and update local record
        const storeName = getStoreNameFromTable(table);
        let localRecord = null;

        if (storeName) {
          localRecord = await getRecord(storeName, id);
          if (localRecord) {
            const updated = { ...localRecord, ...data, synced: false };
            await updateRecord(storeName, updated);
            localRecord = updated;
          }
        }

        await addToSyncQueue("UPDATE", table, { id, ...data });

        return {
          data: localRecord as T,
          error: null,
          queued: true,
        };
      }
    },

    /**
     * Select records (handles offline automatically)
     */
    async select<T extends Record<string, any>>(
      table: string,
      options?: {
        eq?: { column: string; value: any };
        limit?: number;
        orderBy?: { column: string; ascending?: boolean };
      }
    ): Promise<OfflineResponse<T[]>> {
      if (isOnline() && supabase) {
        try {
          let query = supabase.from(table).select("*");

          if (options?.eq) {
            query = query.eq(options.eq.column, options.eq.value);
          }

          if (options?.orderBy) {
            query = query.order(options.orderBy.column, {
              ascending: options.orderBy.ascending ?? true,
            });
          }

          if (options?.limit) {
            query = query.limit(options.limit);
          }

          const { data: result, error } = await query;

          if (error) {
            return { data: null, error: new Error(error.message) };
          }

          // Cache in IndexedDB
          const storeName = getStoreNameFromTable(table);
          if (storeName && result) {
            for (const record of result) {
              const existing = await getRecord(storeName, record.id);
              if (existing) {
                await updateRecord(storeName, { ...record, synced: true });
              } else {
                await addRecord(storeName, { ...record, synced: true });
              }
            }
          }

          return { data: result as T[], error: null };
        } catch (err) {
          return {
            data: null,
            error: err instanceof Error ? err : new Error("Select failed"),
          };
        }
      } else {
        // Offline: return from IndexedDB cache
        const storeName = getStoreNameFromTable(table);
        if (!storeName) {
          return {
            data: [],
            error: new Error(`Table ${table} not cached for offline use`),
            fromCache: true,
          };
        }

        try {
          let records = await getAllRecords<T>(storeName);

          // Apply filters (basic implementation)
          if (options?.eq) {
            records = records.filter(
              (r) => r[options.eq!.column] === options.eq!.value
            );
          }

          // Apply ordering
          if (options?.orderBy) {
            records.sort((a, b) => {
              const aVal = a[options.orderBy!.column];
              const bVal = b[options.orderBy!.column];
              const ascending = options.orderBy!.ascending ?? true;

              if (aVal < bVal) return ascending ? -1 : 1;
              if (aVal > bVal) return ascending ? 1 : -1;
              return 0;
            });
          }

          // Apply limit
          if (options?.limit) {
            records = records.slice(0, options.limit);
          }

          return { data: records, error: null, fromCache: true };
        } catch (err) {
          return {
            data: null,
            error: err instanceof Error ? err : new Error("Cache read failed"),
            fromCache: true,
          };
        }
      }
    },

    /**
     * Delete a record (handles offline automatically)
     */
    async delete(table: string, id: string): Promise<OfflineResponse<void>> {
      if (isOnline() && supabase) {
        try {
          const { error } = await supabase.from(table).delete().eq("id", id);

          if (error) {
            return { data: null, error: new Error(error.message) };
          }

          // Remove from IndexedDB
          const storeName = getStoreNameFromTable(table);
          if (storeName) {
            await deleteRecord(storeName, id);
          }

          return { data: null, error: null };
        } catch (err) {
          return {
            data: null,
            error: err instanceof Error ? err : new Error("Delete failed"),
          };
        }
      } else {
        // Offline: queue operation and mark for deletion locally
        const storeName = getStoreNameFromTable(table);
        if (storeName) {
          // For temporary IDs, just remove immediately
          if (isTempId(id)) {
            await deleteRecord(storeName, id);
          } else {
            // For real IDs, queue for server deletion
            await addToSyncQueue("DELETE", table, { id });
            // Keep in local DB but mark as deleted (could add a 'deleted' flag)
            await deleteRecord(storeName, id);
          }
        }

        return { data: null, error: null, queued: true };
      }
    },

    /**
     * Get a single record by ID
     */
    async getById<T extends Record<string, any>>(
      table: string,
      id: string
    ): Promise<OfflineResponse<T>> {
      if (isOnline() && supabase) {
        try {
          const { data: result, error } = await supabase
            .from(table)
            .select("*")
            .eq("id", id)
            .single();

          if (error) {
            return { data: null, error: new Error(error.message) };
          }

          // Cache in IndexedDB
          const storeName = getStoreNameFromTable(table);
          if (storeName && result) {
            await updateRecord(storeName, { ...result, synced: true });
          }

          return { data: result as T, error: null };
        } catch (err) {
          return {
            data: null,
            error: err instanceof Error ? err : new Error("Get failed"),
          };
        }
      } else {
        // Offline: return from IndexedDB cache
        const storeName = getStoreNameFromTable(table);
        if (!storeName) {
          return {
            data: null,
            error: new Error(`Table ${table} not cached for offline use`),
            fromCache: true,
          };
        }

        try {
          const record = await getRecord<T>(storeName, id);
          return {
            data: record,
            error: record ? null : new Error("Record not found in cache"),
            fromCache: true,
          };
        } catch (err) {
          return {
            data: null,
            error: err instanceof Error ? err : new Error("Cache read failed"),
            fromCache: true,
          };
        }
      }
    },
  };
}

/**
 * Map Supabase table name to IndexedDB store name
 */
function getStoreNameFromTable(table: string): StoreName | null {
  const tableToStore: Record<string, StoreName> = {
    jobs: "jobs",
    invoices: "invoices",
    customers: "customers",
    communications: "communications",
    payments: "payments",
    equipment: "equipment",
    schedules: "schedules",
    tags: "tags",
    attachments: "attachments",
  };
  return tableToStore[table] || null;
}

/**
 * Type-safe offline client methods
 */
export type OfflineClient = ReturnType<typeof createOfflineClient>;
