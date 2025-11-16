/// <reference lib="deno.ns" />
declare const Deno: typeof globalThis.Deno;

/**
 * Virus Scan Edge Function
 *
 * Asynchronously scans uploaded files for viruses/malware
 * Invoked after file upload to perform background scanning
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

type ScanRequest = {
	attachmentId: string;
	bucket: string;
	path: string;
};

type ScanResult = {
	status: "clean" | "infected" | "failed" | "skipped";
	threats?: string[];
	scanEngine?: string;
	metadata?: Record<string, unknown>;
};

const DEFAULT_MAX_SCAN_SIZE = 104_857_600;
const VIRUSTOTAL_POLL_INTERVAL_MS = 3000;
const VIRUSTOTAL_MAX_ATTEMPTS = 10;
const MOCK_SCAN_DELAY_MS = 500;

const logInfo = (...args: unknown[]) => {
	// biome-ignore lint/suspicious/noConsole: Edge function logging for monitoring
	console.log(...args);
};

const logError = (...args: unknown[]) => {
	// biome-ignore lint/suspicious/noConsole: Edge function logging for monitoring
	console.error(...args);
};

function getEnvVar(name: string): string {
	const value = Deno.env.get(name);
	if (!value) {
		throw new Error(`${name} is not configured`);
	}
	return value;
}

async function delay(ms: number) {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

serve(async (req) => {
	try {
		// Verify authorization
		const authHeader = req.headers.get("Authorization");
		if (!authHeader) {
			return new Response(JSON.stringify({ error: "Missing authorization header" }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Parse request body
		const { attachmentId, bucket, path }: ScanRequest = await req.json();

		if (!(attachmentId && bucket && path)) {
			return new Response(JSON.stringify({ error: "Missing required fields" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Create Supabase client
		const supabaseUrl = getEnvVar("SUPABASE_URL");
		const supabaseServiceKey = getEnvVar("SUPABASE_SERVICE_ROLE_KEY");
		const supabase = createClient(supabaseUrl, supabaseServiceKey);

		// Update status to scanning
		await supabase.from("attachments").update({ virus_scan_status: "scanning" }).eq("id", attachmentId);

		// Get file from storage
		const { data: fileData, error: downloadError } = await supabase.storage.from(bucket).download(path);

		if (downloadError) {
			throw new Error(`Failed to download file: ${downloadError.message}`);
		}

		// Perform scan
		const result = await scanFile(fileData, path);

		// Update database with result
		await supabase
			.from("attachments")
			.update({
				virus_scan_status: result.status,
				virus_scan_result: {
					threats: result.threats,
					scanEngine: result.scanEngine,
					scanDate: new Date().toISOString(),
					metadata: result.metadata,
				},
				virus_scanned_at: new Date().toISOString(),
			})
			.eq("id", attachmentId);

		// If infected, quarantine the file
		if (result.status === "infected") {
			await quarantineFile(supabase, attachmentId, bucket, path);

			// Notify administrators (optional - implement notification system)
			logInfo(`SECURITY ALERT: Infected file detected - ${attachmentId}`);
		}

		return new Response(JSON.stringify({ success: true, result }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		logError("Virus scan error:", error);

		return new Response(
			JSON.stringify({
				error: error instanceof Error ? error.message : "Scan failed",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
});

/**
 * Scan file for viruses
 */
async function scanFile(fileData: Blob, fileName: string): Promise<ScanResult> {
	const scanEnabled = Deno.env.get("VIRUS_SCAN_ENABLED") === "true";
	const scanBackend = Deno.env.get("VIRUS_SCAN_BACKEND") || "mock";

	if (!scanEnabled) {
		return {
			status: "skipped",
			metadata: { reason: "Scanning disabled" },
		};
	}

	// Check file size
	const maxSize = Number.parseInt(Deno.env.get("VIRUS_SCAN_MAX_SIZE") || `${DEFAULT_MAX_SCAN_SIZE}`, 10);
	if (fileData.size > maxSize) {
		return {
			status: "skipped",
			metadata: { reason: "File too large", size: fileData.size },
		};
	}

	switch (scanBackend) {
		case "clamav":
			return await scanWithClamAV(fileData, fileName);
		case "virustotal":
			return await scanWithVirusTotal(fileData, fileName);
		default:
			return await mockScan(fileData, fileName);
	}
}

/**
 * Scan with ClamAV
 */
async function scanWithClamAV(fileData: Blob, fileName: string): Promise<ScanResult> {
	const endpoint = Deno.env.get("CLAMAV_ENDPOINT");
	if (!endpoint) {
		throw new Error("ClamAV endpoint not configured");
	}

	const formData = new FormData();
	formData.append("file", fileData, fileName);

	const response = await fetch(`${endpoint}/scan`, {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		throw new Error(`ClamAV scan failed: ${response.statusText}`);
	}

	const result = await response.json();

	return {
		status: result.infected ? "infected" : "clean",
		threats: result.viruses || [],
		scanEngine: "ClamAV",
		metadata: result,
	};
}

/**
 * Scan with VirusTotal
 */
async function scanWithVirusTotal(fileData: Blob, fileName: string): Promise<ScanResult> {
	const apiKey = getEnvVar("VIRUSTOTAL_API_KEY");

	// Upload file
	const formData = new FormData();
	formData.append("file", fileData, fileName);

	const uploadResponse = await fetch("https://www.virustotal.com/api/v3/files", {
		method: "POST",
		headers: {
			"x-apikey": apiKey,
		},
		body: formData,
	});

	if (!uploadResponse.ok) {
		throw new Error(`VirusTotal upload failed: ${uploadResponse.statusText}`);
	}

	const uploadResult = await uploadResponse.json();
	const analysisId = uploadResult.data.id;

	// Poll for results
	return pollVirusTotalAnalysis(apiKey, analysisId);
}

async function pollVirusTotalAnalysis(apiKey: string, analysisId: string): Promise<ScanResult> {
	for (let attempts = 0; attempts < VIRUSTOTAL_MAX_ATTEMPTS; attempts++) {
		await delay(VIRUSTOTAL_POLL_INTERVAL_MS);

		const analysisResult = await fetchVirusTotalAnalysis(apiKey, analysisId);
		const status = analysisResult.data.attributes.status;

		if (status === "completed") {
			return buildVirusTotalScanResult(analysisResult.data.attributes.stats);
		}
	}

	return {
		status: "failed",
		metadata: { error: "Scan timeout" },
	};
}

async function fetchVirusTotalAnalysis(apiKey: string, analysisId: string) {
	const analysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
		headers: {
			"x-apikey": apiKey,
		},
	});

	if (!analysisResponse.ok) {
		throw new Error(`VirusTotal analysis failed: ${analysisResponse.statusText}`);
	}

	return analysisResponse.json();
}

function buildVirusTotalScanResult(stats: {
	malicious?: number;
	suspicious?: number;
	undetected?: number;
}): ScanResult {
	const malicious = stats.malicious ?? 0;
	const suspicious = stats.suspicious ?? 0;

	return {
		status: malicious > 0 || suspicious > 0 ? "infected" : "clean",
		threats: malicious > 0 || suspicious > 0 ? ["Detected by VirusTotal"] : [],
		scanEngine: "VirusTotal",
		metadata: {
			malicious,
			suspicious,
			undetected: stats.undetected ?? 0,
		},
	};
}

/**
 * Mock scanner for development
 */
async function mockScan(fileData: Blob, _fileName: string): Promise<ScanResult> {
	// Simulate scanning delay
	await delay(MOCK_SCAN_DELAY_MS);

	// Check for EICAR test signature
	const text = await fileData.text();
	if (text.includes("EICAR-STANDARD-ANTIVIRUS-TEST-FILE")) {
		return {
			status: "infected",
			threats: ["EICAR-Test-File"],
			scanEngine: "Mock Scanner",
			metadata: { note: "Test virus detected" },
		};
	}

	return {
		status: "clean",
		scanEngine: "Mock Scanner",
		metadata: { note: "Development mode" },
	};
}

/**
 * Quarantine infected file
 */
async function quarantineFile(
	supabase: SupabaseClient,
	attachmentId: string,
	bucket: string,
	path: string
): Promise<void> {
	try {
		// Get file
		const { data: fileData, error: downloadError } = await supabase.storage.from(bucket).download(path);

		if (downloadError) {
			throw new Error(`Failed to download for quarantine: ${downloadError.message}`);
		}

		// Upload to quarantine
		const quarantinePath = `${attachmentId}/${path}`;
		const { error: uploadError } = await supabase.storage
			.from("quarantine")
			.upload(quarantinePath, fileData, { upsert: true });

		if (uploadError) {
			throw new Error(`Failed to quarantine: ${uploadError.message}`);
		}

		// Remove original
		await supabase.storage.from(bucket).remove([path]);

		// Update database
		await supabase
			.from("attachments")
			.update({
				storage_bucket: "quarantine",
				storage_path: quarantinePath,
				metadata: {
					quarantined_at: new Date().toISOString(),
					original_bucket: bucket,
					original_path: path,
				},
			})
			.eq("id", attachmentId);
	} catch (error) {
		logError("Quarantine failed:", error);
		throw error;
	}
}
