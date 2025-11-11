/**
 * Import Service
 *
 * Business logic for handling data imports
 */

import type { DataType } from "@/lib/validations/import-schemas";
import { validateImportData } from "@/lib/validations/import-schemas";

export interface ImportOptions {
  dataType: DataType;
  companyId: string;
  userId: string;
  dryRun?: boolean;
  skipErrors?: boolean;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: Array<{ row: number; field: string; error: string }>;
  importId?: string;
}

/**
 * Process import data
 */
export async function processImport(
  rows: unknown[],
  options: ImportOptions
): Promise<ImportResult> {
  const { dataType, dryRun = false, skipErrors = false } = options;

  // Step 1: Validate all rows
  const validation = validateImportData(dataType, rows);

  // Step 2: If dry run, return validation results
  if (dryRun) {
    return {
      success: true,
      totalRows: validation.totalRows,
      successfulRows: validation.validRows,
      failedRows: validation.invalidRows,
      errors: validation.errors,
    };
  }

  // Step 3: If not skipping errors and there are errors, fail
  if (!skipErrors && validation.errors.length > 0) {
    return {
      success: false,
      totalRows: validation.totalRows,
      successfulRows: 0,
      failedRows: validation.errors.length,
      errors: validation.errors,
    };
  }

  // Step 4: Import valid rows
  // TODO: Implement actual database import
  // For now, simulate successful import
  const successfulRows = skipErrors
    ? validation.validRows
    : validation.totalRows;

  return {
    success: true,
    totalRows: validation.totalRows,
    successfulRows,
    failedRows: validation.errors.length,
    errors: validation.errors,
  };
}

/**
 * Create backup before import
 */
export async function createBackup(
  dataType: DataType,
  companyId: string
): Promise<Record<string, unknown>> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  if (!supabase) {
    throw new Error("Database not configured");
  }

  // Map data types to table names
  const tableMap: Record<string, string> = {
    jobs: "jobs",
    invoices: "invoices",
    estimates: "estimates",
    contracts: "contracts",
    "purchase-orders": "purchase_orders",
    customers: "customers",
    pricebook: "price_book_items",
    materials: "materials",
    equipment: "equipment",
  };

  const tableName = tableMap[dataType];
  if (!tableName) {
    return {};
  }

  // Query existing data
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("company_id", companyId);

  if (error) {
    console.error("Backup error:", error);
    return {};
  }

  return {
    table: tableName,
    records: data || [],
    timestamp: new Date().toISOString(),
  };
}

/**
 * Restore from backup
 */
export async function restoreFromBackup(
  backupData: Record<string, unknown>,
  dataType: DataType,
  companyId: string
): Promise<boolean> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  if (!supabase) {
    throw new Error("Database not configured");
  }

  const tableName = backupData.table as string;
  const records = backupData.records as unknown[];

  if (!(tableName && records)) {
    return false;
  }

  // Delete current data
  const { error: deleteError } = await supabase
    .from(tableName)
    .delete()
    .eq("company_id", companyId);

  if (deleteError) {
    console.error("Restore delete error:", deleteError);
    return false;
  }

  // Restore backup data
  if (records.length > 0) {
    const { error: insertError } = await supabase
      .from(tableName)
      .insert(records);

    if (insertError) {
      console.error("Restore insert error:", insertError);
      return false;
    }
  }

  return true;
}

/**
 * Batch insert records
 */
export async function batchInsert(
  records: unknown[],
  dataType: DataType,
  companyId: string,
  batchSize = 100
): Promise<void> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  if (!supabase) {
    throw new Error("Database not configured");
  }

  // Map data types to table names
  const tableMap: Record<string, string> = {
    jobs: "jobs",
    invoices: "invoices",
    estimates: "estimates",
    contracts: "contracts",
    "purchase-orders": "purchase_orders",
    customers: "customers",
    pricebook: "price_book_items",
    materials: "materials",
    equipment: "equipment",
  };

  const tableName = tableMap[dataType];
  if (!tableName) {
    throw new Error(`Unsupported data type: ${dataType}`);
  }

  // Split into chunks
  const chunks = [];
  for (let i = 0; i < records.length; i += batchSize) {
    chunks.push(records.slice(i, i + batchSize));
  }

  // Process each chunk
  for (const chunk of chunks) {
    // Add company_id to each record
    const recordsWithCompany = chunk.map((record) => ({
      ...(record as Record<string, unknown>),
      company_id: companyId,
    }));

    // Insert chunk
    const { error } = await supabase.from(tableName).insert(recordsWithCompany);

    if (error) {
      console.error("Batch insert error:", error);
      throw new Error(`Failed to insert batch: ${error.message}`);
    }
  }
}
