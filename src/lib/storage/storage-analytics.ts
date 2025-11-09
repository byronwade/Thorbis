/**
 * Storage Analytics Service
 * 
 * Track and analyze storage usage:
 * - Company storage quotas
 * - Usage trends
 * - Cost estimation
 * - Quota warnings
 */

import { createClient } from "@/lib/supabase/server";
import { formatFileSize } from "./file-validator";

// ============================================================================
// TYPES
// ============================================================================

export interface StorageUsage {
  companyId: string;
  totalFiles: number;
  totalSize: number;
  sizeByBucket: Record<string, number>;
  sizeByType: Record<string, number>;
  sizeByContext: Record<string, number>;
  averageFileSize: number;
  largestFile: {
    id: string;
    name: string;
    size: number;
  } | null;
}

export interface StorageQuota {
  companyId: string;
  limit: number;
  used: number;
  remaining: number;
  percentUsed: number;
  isNearLimit: boolean;
  isOverLimit: boolean;
}

export interface StorageTrend {
  date: string;
  fileCount: number;
  totalSize: number;
}

export interface StorageCostEstimate {
  storageGb: number;
  monthlyCost: number;
  projectedAnnualCost: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Default quota: 100GB per company
const DEFAULT_QUOTA_BYTES = 100 * 1024 * 1024 * 1024;

// Supabase storage pricing: $0.021 per GB/month
const STORAGE_COST_PER_GB = 0.021;

// Warning threshold: 80% of quota
const WARNING_THRESHOLD = 0.8;

// ============================================================================
// USAGE TRACKING
// ============================================================================

/**
 * Get current storage usage for a company
 */
export async function getStorageUsage(companyId: string): Promise<StorageUsage> {
  const supabase = await createClient();

  // Get all attachments for company
  if (!supabase) {
    throw new Error("Server configuration error");
  }
  const { data: attachments, error } = await supabase
    .from("attachments")
    .select("id, file_name, file_size, storage_bucket, mime_type, entity_type")
    .eq("company_id", companyId)
    .is("deleted_at", null);

  if (error || !attachments) {
    throw new Error(`Failed to fetch storage usage: ${error?.message}`);
  }

  // Calculate totals
  const totalFiles = attachments.length;
  const totalSize = attachments.reduce((sum, file) => sum + file.file_size, 0);

  // Group by bucket
  const sizeByBucket: Record<string, number> = {};
  attachments.forEach((file) => {
    const bucket = file.storage_bucket || "unknown";
    sizeByBucket[bucket] = (sizeByBucket[bucket] || 0) + file.file_size;
  });

  // Group by type (image, document, video, etc.)
  const sizeByType: Record<string, number> = {};
  attachments.forEach((file) => {
    const type = file.mime_type.split("/")[0] || "other";
    sizeByType[type] = (sizeByType[type] || 0) + file.file_size;
  });

  // Group by context (customer, job, etc.)
  const sizeByContext: Record<string, number> = {};
  attachments.forEach((file) => {
    const context = file.entity_type || "general";
    sizeByContext[context] = (sizeByContext[context] || 0) + file.file_size;
  });

  // Find largest file
  const largest = attachments.reduce(
    (max, file) => (file.file_size > max.file_size ? file : max),
    attachments[0]
  );

  return {
    companyId,
    totalFiles,
    totalSize,
    sizeByBucket,
    sizeByType,
    sizeByContext,
    averageFileSize: totalFiles > 0 ? Math.round(totalSize / totalFiles) : 0,
    largestFile: largest
      ? {
          id: largest.id,
          name: largest.file_name,
          size: largest.file_size,
        }
      : null,
  };
}

// ============================================================================
// QUOTA MANAGEMENT
// ============================================================================

/**
 * Get storage quota status for a company
 */
export async function getStorageQuota(companyId: string): Promise<StorageQuota> {
  const usage = await getStorageUsage(companyId);

  // Get custom quota if set (TODO: fetch from companies table)
  const limit = DEFAULT_QUOTA_BYTES;

  const used = usage.totalSize;
  const remaining = Math.max(0, limit - used);
  const percentUsed = limit > 0 ? (used / limit) * 100 : 0;

  return {
    companyId,
    limit,
    used,
    remaining,
    percentUsed,
    isNearLimit: percentUsed >= WARNING_THRESHOLD * 100,
    isOverLimit: used > limit,
  };
}

/**
 * Check if company is over quota
 */
export async function isOverQuota(companyId: string): Promise<boolean> {
  const quota = await getStorageQuota(companyId);
  return quota.isOverLimit;
}

/**
 * Check if company is near quota limit
 */
export async function isNearQuotaLimit(companyId: string): Promise<boolean> {
  const quota = await getStorageQuota(companyId);
  return quota.isNearLimit;
}

// ============================================================================
// TRENDS ANALYSIS
// ============================================================================

/**
 * Get storage usage trends over time
 */
export async function getStorageTrends(
  companyId: string,
  days = 30
): Promise<StorageTrend[]> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Server configuration error");
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("attachments")
    .select("created_at, file_size")
    .eq("company_id", companyId)
    .gte("created_at", startDate.toISOString())
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error || !data) {
    throw new Error(`Failed to fetch storage trends: ${error?.message}`);
  }

  // Group by date
  const trendsByDate = new Map<string, { count: number; size: number }>();

  data.forEach((file) => {
    const date = new Date(file.created_at).toISOString().split("T")[0];
    const existing = trendsByDate.get(date) || { count: 0, size: 0 };
    trendsByDate.set(date, {
      count: existing.count + 1,
      size: existing.size + file.file_size,
    });
  });

  // Convert to array
  return Array.from(trendsByDate.entries())
    .map(([date, stats]) => ({
      date,
      fileCount: stats.count,
      totalSize: stats.size,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get storage growth rate (bytes per day)
 */
export async function getStorageGrowthRate(companyId: string): Promise<number> {
  const trends = await getStorageTrends(companyId, 30);

  if (trends.length < 2) {
    return 0;
  }

  const totalGrowth = trends.reduce((sum, trend) => sum + trend.totalSize, 0);
  const days = trends.length;

  return totalGrowth / days;
}

// ============================================================================
// COST ESTIMATION
// ============================================================================

/**
 * Estimate storage costs
 */
export async function estimateStorageCosts(
  companyId: string
): Promise<StorageCostEstimate> {
  const usage = await getStorageUsage(companyId);

  const storageGb = usage.totalSize / (1024 * 1024 * 1024);
  const monthlyCost = storageGb * STORAGE_COST_PER_GB;
  const projectedAnnualCost = monthlyCost * 12;

  return {
    storageGb,
    monthlyCost,
    projectedAnnualCost,
  };
}

/**
 * Project future storage costs based on growth rate
 */
export async function projectFutureCosts(
  companyId: string,
  months = 12
): Promise<{ month: number; estimatedCost: number }[]> {
  const currentUsage = await getStorageUsage(companyId);
  const growthRate = await getStorageGrowthRate(companyId);

  const projections: { month: number; estimatedCost: number }[] = [];

  for (let month = 1; month <= months; month++) {
    const daysInFuture = month * 30;
    const projectedSize = currentUsage.totalSize + growthRate * daysInFuture;
    const projectedGb = projectedSize / (1024 * 1024 * 1024);
    const estimatedCost = projectedGb * STORAGE_COST_PER_GB;

    projections.push({
      month,
      estimatedCost,
    });
  }

  return projections;
}

// ============================================================================
// CLEANUP RECOMMENDATIONS
// ============================================================================

/**
 * Get recommendations for storage cleanup
 */
export async function getCleanupRecommendations(companyId: string): Promise<{
  oldFiles: { id: string; name: string; size: number; age: number }[];
  duplicates: { id: string; name: string; size: number }[];
  largeFiles: { id: string; name: string; size: number }[];
  potentialSavings: number;
}> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Server configuration error");
  }

  // Get all files
  const { data: files, error } = await supabase
    .from("attachments")
    .select("id, file_name, file_size, created_at, checksum")
    .eq("company_id", companyId)
    .is("deleted_at", null);

  if (error || !files) {
    throw new Error(`Failed to fetch files: ${error?.message}`);
  }

  // Find old files (>1 year)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const oldFiles = files
    .filter((file) => new Date(file.created_at) < oneYearAgo)
    .map((file) => ({
      id: file.id,
      name: file.file_name,
      size: file.file_size,
      age: Math.floor(
        (Date.now() - new Date(file.created_at).getTime()) / (1000 * 60 * 60 * 24)
      ),
    }))
    .sort((a, b) => b.age - a.age)
    .slice(0, 10);

  // Find duplicates (same checksum)
  const checksumMap = new Map<string, typeof files>();
  files.forEach((file) => {
    if (file.checksum) {
      const existing = checksumMap.get(file.checksum) || [];
      checksumMap.set(file.checksum, [...existing, file]);
    }
  });

  const duplicates = Array.from(checksumMap.values())
    .filter((group) => group.length > 1)
    .flatMap((group) =>
      group.slice(1).map((file) => ({
        id: file.id,
        name: file.file_name,
        size: file.file_size,
      }))
    )
    .slice(0, 10);

  // Find large files (>50MB)
  const largeFiles = files
    .filter((file) => file.file_size > 50 * 1024 * 1024)
    .map((file) => ({
      id: file.id,
      name: file.file_name,
      size: file.file_size,
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);

  // Calculate potential savings
  const oldFilesSavings = oldFiles.reduce((sum, f) => sum + f.size, 0);
  const duplicatesSavings = duplicates.reduce((sum, f) => sum + f.size, 0);
  const potentialSavings = oldFilesSavings + duplicatesSavings;

  return {
    oldFiles,
    duplicates,
    largeFiles,
    potentialSavings,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format storage usage for display
 */
export function formatStorageUsage(usage: StorageUsage): string {
  return `${formatFileSize(usage.totalSize)} (${usage.totalFiles} files)`;
}

/**
 * Format quota status for display
 */
export function formatQuotaStatus(quota: StorageQuota): string {
  return `${formatFileSize(quota.used)} / ${formatFileSize(quota.limit)} (${quota.percentUsed.toFixed(1)}%)`;
}

/**
 * Get quota status color
 */
export function getQuotaStatusColor(quota: StorageQuota): "success" | "warning" | "error" {
  if (quota.isOverLimit) return "error";
  if (quota.isNearLimit) return "warning";
  return "success";
}

