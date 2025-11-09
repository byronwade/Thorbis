/**
 * Virus Scanner Service
 * 
 * Provides virus/malware scanning capabilities for uploaded files
 * Supports multiple scanning backends:
 * - ClamAV (self-hosted)
 * - VirusTotal API (cloud-based)
 * - Mock scanner (development/testing)
 */

import { createClient } from "@/lib/supabase/server";

// ============================================================================
// TYPES
// ============================================================================

export type ScanStatus = 'pending' | 'scanning' | 'clean' | 'infected' | 'failed' | 'skipped';

export interface ScanResult {
  status: ScanStatus;
  threats?: string[];
  scanEngine?: string;
  scanDate?: Date;
  metadata?: Record<string, unknown>;
}

export interface ScannerConfig {
  enabled: boolean;
  backend: 'clamav' | 'virustotal' | 'mock';
  apiKey?: string;
  endpoint?: string;
  timeout?: number;
  skipLargeFiles?: boolean;
  maxFileSize?: number; // Skip files larger than this (in bytes)
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Get scanner configuration from environment
 */
function getScannerConfig(): ScannerConfig {
  return {
    enabled: process.env.VIRUS_SCAN_ENABLED === 'true',
    backend: (process.env.VIRUS_SCAN_BACKEND || 'mock') as ScannerConfig['backend'],
    apiKey: process.env.VIRUSTOTAL_API_KEY,
    endpoint: process.env.CLAMAV_ENDPOINT,
    timeout: Number.parseInt(process.env.VIRUS_SCAN_TIMEOUT || '30000'),
    skipLargeFiles: process.env.VIRUS_SCAN_SKIP_LARGE === 'true',
    maxFileSize: Number.parseInt(process.env.VIRUS_SCAN_MAX_SIZE || '104857600'), // 100MB
  };
}

// ============================================================================
// MAIN SCANNING FUNCTION
// ============================================================================

/**
 * Scan file for viruses/malware
 * 
 * @param file - File to scan (File or Buffer)
 * @param fileName - Original filename
 * @returns Scan result
 */
export async function scanFile(
  file: File | Buffer,
  fileName: string
): Promise<ScanResult> {
  const config = getScannerConfig();

  // Check if scanning is enabled
  if (!config.enabled) {
    return {
      status: 'skipped',
      metadata: { reason: 'Scanning disabled' },
    };
  }

  // Get file size
  const fileSize = file instanceof File ? file.size : file.length;

  // Skip large files if configured
  if (config.skipLargeFiles && config.maxFileSize && fileSize > config.maxFileSize) {
    return {
      status: 'skipped',
      metadata: { reason: 'File too large for scanning', size: fileSize },
    };
  }

  // Route to appropriate scanner
  try {
    switch (config.backend) {
      case 'clamav':
        return await scanWithClamAV(file, fileName, config);
      case 'virustotal':
        return await scanWithVirusTotal(file, fileName, config);
      case 'mock':
        return await mockScan(file, fileName);
      default:
        throw new Error(`Unsupported scan backend: ${config.backend}`);
    }
  } catch (error) {
    console.error('Virus scan error:', error);
    return {
      status: 'failed',
      metadata: {
        error: error instanceof Error ? error.message : 'Scan failed',
      },
    };
  }
}

// ============================================================================
// CLAMAV SCANNER
// ============================================================================

/**
 * Scan file using ClamAV
 */
async function scanWithClamAV(
  file: File | Buffer,
  fileName: string,
  config: ScannerConfig
): Promise<ScanResult> {
  if (!config.endpoint) {
    throw new Error('ClamAV endpoint not configured');
  }

  const fileBuffer = file instanceof File ? await file.arrayBuffer() : file;

  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer as BlobPart]), fileName);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);

  try {
    const response = await fetch(`${config.endpoint}/scan`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ClamAV scan failed: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      status: result.infected ? 'infected' : 'clean',
      threats: result.viruses || [],
      scanEngine: 'ClamAV',
      scanDate: new Date(),
      metadata: result,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ============================================================================
// VIRUSTOTAL SCANNER
// ============================================================================

/**
 * Scan file using VirusTotal API
 */
async function scanWithVirusTotal(
  file: File | Buffer,
  fileName: string,
  config: ScannerConfig
): Promise<ScanResult> {
  if (!config.apiKey) {
    throw new Error('VirusTotal API key not configured');
  }

  const fileBuffer = file instanceof File ? await file.arrayBuffer() : file;

  // Step 1: Upload file
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer as BlobPart]), fileName);

  const uploadResponse = await fetch('https://www.virustotal.com/api/v3/files', {
    method: 'POST',
    headers: {
      'x-apikey': config.apiKey,
    },
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error(`VirusTotal upload failed: ${uploadResponse.statusText}`);
  }

  const uploadResult = await uploadResponse.json();
  const analysisId = uploadResult.data.id;

  // Step 2: Wait for analysis (poll with retries)
  let attempts = 0;
  const maxAttempts = 10;
  const pollInterval = 3000; // 3 seconds

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, pollInterval));

    const analysisResponse = await fetch(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        headers: {
          'x-apikey': config.apiKey,
        },
      }
    );

    if (!analysisResponse.ok) {
      throw new Error(`VirusTotal analysis check failed: ${analysisResponse.statusText}`);
    }

    const analysisResult = await analysisResponse.json();
    const status = analysisResult.data.attributes.status;

    if (status === 'completed') {
      const stats = analysisResult.data.attributes.stats;
      const malicious = stats.malicious || 0;
      const suspicious = stats.suspicious || 0;

      return {
        status: malicious > 0 || suspicious > 0 ? 'infected' : 'clean',
        threats: malicious > 0 || suspicious > 0 ? ['Detected by VirusTotal engines'] : [],
        scanEngine: 'VirusTotal',
        scanDate: new Date(),
        metadata: {
          malicious,
          suspicious,
          undetected: stats.undetected || 0,
          harmless: stats.harmless || 0,
        },
      };
    }

    attempts++;
  }

  // Timeout
  return {
    status: 'failed',
    metadata: { error: 'VirusTotal analysis timeout' },
  };
}

// ============================================================================
// MOCK SCANNER (Development/Testing)
// ============================================================================

/**
 * Mock scanner for development and testing
 * Simulates scanning behavior without actual virus detection
 */
async function mockScan(
  file: File | Buffer,
  fileName: string
): Promise<ScanResult> {
  // Simulate scanning delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check for test virus signature (EICAR test file)
  const fileBuffer = file instanceof File ? await file.arrayBuffer() : file;
  const content = new TextDecoder().decode(fileBuffer.slice(0, 100));

  if (content.includes('EICAR-STANDARD-ANTIVIRUS-TEST-FILE')) {
    return {
      status: 'infected',
      threats: ['EICAR-Test-File'],
      scanEngine: 'Mock Scanner',
      scanDate: new Date(),
      metadata: { note: 'This is a test virus signature' },
    };
  }

  // All other files are clean
  return {
    status: 'clean',
    scanEngine: 'Mock Scanner',
    scanDate: new Date(),
    metadata: { note: 'Development mode - real scanning disabled' },
  };
}

// ============================================================================
// DATABASE INTEGRATION
// ============================================================================

/**
 * Update attachment scan status in database
 */
export async function updateScanStatus(
  attachmentId: string,
  result: ScanResult
): Promise<void> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Server configuration error");
  }

  await supabase
    .from('attachments')
    .update({
      virus_scan_status: result.status,
      virus_scan_result: {
        threats: result.threats,
        scanEngine: result.scanEngine,
        scanDate: result.scanDate?.toISOString(),
        metadata: result.metadata,
      },
      virus_scanned_at: new Date().toISOString(),
    })
    .eq('id', attachmentId);
}

/**
 * Quarantine infected file
 */
export async function quarantineFile(
  attachmentId: string,
  bucket: string,
  path: string
): Promise<void> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Server configuration error");
  }

  try {
    // Get file from original bucket
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(bucket)
      .download(path);

    if (downloadError) {
      throw new Error(`Failed to download file for quarantine: ${downloadError.message}`);
    }

    // Upload to quarantine bucket
    const quarantinePath = `${attachmentId}/${path}`;
    const { error: uploadError } = await supabase.storage
      .from('quarantine')
      .upload(quarantinePath, fileData, { upsert: true });

    if (uploadError) {
      throw new Error(`Failed to upload to quarantine: ${uploadError.message}`);
    }

    // Remove from original bucket
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (deleteError) {
      console.error('Failed to remove original file:', deleteError);
    }

    // Update database record
    await supabase
      .from('attachments')
      .update({
        storage_bucket: 'quarantine',
        storage_path: quarantinePath,
        metadata: {
          quarantined_at: new Date().toISOString(),
          original_bucket: bucket,
          original_path: path,
        },
      })
      .eq('id', attachmentId);

  } catch (error) {
    console.error('Quarantine failed:', error);
    throw error;
  }
}

// ============================================================================
// BATCH SCANNING
// ============================================================================

/**
 * Scan multiple pending files
 * Useful for cron jobs or batch processing
 */
export async function scanPendingFiles(limit = 10): Promise<{
  scanned: number;
  clean: number;
  infected: number;
  failed: number;
}> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Server configuration error");
  }

  const stats = {
    scanned: 0,
    clean: 0,
    infected: 0,
    failed: 0,
  };

  // Get pending files
  const { data: pendingFiles, error } = await supabase
    .from('attachments')
    .select('id, storage_bucket, storage_path, file_name')
    .eq('virus_scan_status', 'pending')
    .is('deleted_at', null)
    .limit(limit);

  if (error || !pendingFiles) {
    console.error('Failed to fetch pending files:', error);
    return stats;
  }

  // Scan each file
  for (const file of pendingFiles) {
    try {
      // Update status to scanning
      await supabase
        .from('attachments')
        .update({ virus_scan_status: 'scanning' })
        .eq('id', file.id);

      // Download file
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(file.storage_bucket)
        .download(file.storage_path);

      if (downloadError) {
        throw new Error(`Download failed: ${downloadError.message}`);
      }

      // Scan file
      const buffer = Buffer.from(await fileData.arrayBuffer());
      const result = await scanFile(buffer, file.file_name);

      // Update database
      await updateScanStatus(file.id, result);

      // Quarantine if infected
      if (result.status === 'infected') {
        await quarantineFile(file.id, file.storage_bucket, file.storage_path);
        stats.infected++;
      } else if (result.status === 'clean') {
        stats.clean++;
      } else {
        stats.failed++;
      }

      stats.scanned++;

    } catch (error) {
      console.error(`Scan failed for ${file.id}:`, error);
      stats.failed++;

      // Update status to failed
      await supabase
        .from('attachments')
        .update({
          virus_scan_status: 'failed',
          virus_scan_result: {
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        })
        .eq('id', file.id);
    }
  }

  return stats;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if file should be scanned based on type and size
 */
export function shouldScanFile(mimeType: string, fileSize: number): boolean {
  const config = getScannerConfig();

  if (!config.enabled) {
    return false;
  }

  // Skip very large files
  if (config.skipLargeFiles && config.maxFileSize && fileSize > config.maxFileSize) {
    return false;
  }

  // Skip certain safe file types (optional optimization)
  const safeMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  // You can choose to scan everything or skip known-safe image types
  // For maximum security, scan everything
  return true;
}

/**
 * Get scan statistics
 */
export async function getScanStatistics(companyId?: string): Promise<{
  total: number;
  pending: number;
  clean: number;
  infected: number;
  failed: number;
}> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Server configuration error");
  }

  let query = supabase
    .from('attachments')
    .select('virus_scan_status', { count: 'exact' })
    .is('deleted_at', null);

  if (companyId) {
    query = query.eq('company_id', companyId);
  }

  const { count: total } = await query;

  const statusCounts = await Promise.all([
    query.eq('virus_scan_status', 'pending').then(r => r.count || 0),
    query.eq('virus_scan_status', 'clean').then(r => r.count || 0),
    query.eq('virus_scan_status', 'infected').then(r => r.count || 0),
    query.eq('virus_scan_status', 'failed').then(r => r.count || 0),
  ]);

  return {
    total: total || 0,
    pending: statusCounts[0],
    clean: statusCounts[1],
    infected: statusCounts[2],
    failed: statusCounts[3],
  };
}

