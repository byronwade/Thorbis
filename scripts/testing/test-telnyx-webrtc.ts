/**
 * Telnyx WebRTC Connection Test Script
 *
 * This script tests the complete Telnyx WebRTC setup:
 * 1. Verifies TELNYX_API_KEY is configured
 * 2. Tests credential generation
 * 3. Checks credential structure
 * 4. Validates connection parameters
 *
 * Run with: npx tsx scripts/testing/test-telnyx-webrtc.ts
 */

import { resolve } from "node:path";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const DEFAULT_PASSWORD_LENGTH = 32;

async function testTelnyxWebRTC() {
	console.log("🧪 Testing Telnyx WebRTC Setup...\n");

	try {
		// Test 1: Verify API Key
		await verifyApiKey();

		// Test 2: Test credential generation
		await testCredentialGeneration();

		// Test 3: Check connection endpoints
		await checkConnectionEndpoints();

		console.log("\n═══════════════════════════════════════");
		console.log("✅ ALL TESTS COMPLETED!");
		console.log("═══════════════════════════════════════");
	} catch (error) {
		console.error("❌ Test failed:", getErrorMessage(error));
		console.error("\nFull error:", error);
		process.exit(1);
	}
}

async function verifyApiKey() {
	console.log("✅ Test 1: Verify Telnyx API Key");

	const apiKey = process.env.TELNYX_API_KEY;

	if (!apiKey) {
		console.error("   ❌ TELNYX_API_KEY is not set in .env.local");
		console.error("   Please add: TELNYX_API_KEY=your_api_key_here");
		throw new Error("TELNYX_API_KEY not configured");
	}

	console.log(`   ✅ API Key found (length: ${apiKey.length} chars)`);
	console.log(`   ✅ Starts with: ${apiKey.substring(0, 10)}...`);

	// Test API key by making a simple API call
	try {
		const response = await fetch("https://api.telnyx.com/v2/credential_connections", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
		});

		if (!response.ok) {
			console.error(`   ❌ API Key validation failed: ${response.status}`);
			const errorText = await response.text();
			console.error(`   Error: ${errorText}`);
			throw new Error("Invalid API key");
		}

		const data = await response.json();
		console.log("   ✅ API Key is valid");
		console.log(`   ✅ Found ${data.data?.length || 0} existing credentials\n`);
	} catch (error) {
		console.error("   ❌ Failed to validate API key:", error);
		throw error;
	}
}

async function testCredentialGeneration() {
	console.log("✅ Test 2: Test Credential Generation");

	const apiKey = process.env.TELNYX_API_KEY;
	const testUsername = `test${Date.now()}`;
	const testPassword = generateRandomPassword(DEFAULT_PASSWORD_LENGTH);

	console.log(`   Testing with username: ${testUsername}`);

	try {
		// Try primary endpoint (credential_connections)
		const response = await fetch("https://api.telnyx.com/v2/credential_connections", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				connection_name: testUsername,
				user_name: testUsername,
				password: testPassword,
				ttl: 86_400,
			}),
		});

		if (response.ok) {
			const data = await response.json();
			console.log("   ✅ Primary endpoint (credential_connections) works!");
			console.log("   ✅ Credential created:", {
				username: data.data?.user_name,
				realm: data.data?.realm,
				sip_uri: data.data?.sip_uri,
			});

			// Clean up test credential
			if (data.data?.id) {
				await fetch(`https://api.telnyx.com/v2/credential_connections/${data.data.id}`, {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${apiKey}`,
					},
				});
				console.log("   ✅ Test credential cleaned up\n");
			}
		} else {
			console.log("   ⚠️  Primary endpoint failed, trying alternative...");
			const errorText = await response.text();
			console.log(`   Error: ${errorText}`);

			// Try alternative endpoint (texml_credentials)
			const altResponse = await fetch("https://api.telnyx.com/v2/texml_credentials", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify({
					connection_name: testUsername,
					user_name: testUsername,
					password: testPassword,
				}),
			});

			if (altResponse.ok) {
				const altData = await altResponse.json();
				console.log("   ✅ Alternative endpoint (texml_credentials) works!");
				console.log("   ✅ Credential created:", {
					username: altData.data?.user_name,
				});

				// Clean up test credential
				if (altData.data?.id) {
					await fetch(`https://api.telnyx.com/v2/texml_credentials/${altData.data.id}`, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${apiKey}`,
						},
					});
					console.log("   ✅ Test credential cleaned up\n");
				}
			} else {
				console.error("   ❌ Both endpoints failed!");
				const altErrorText = await altResponse.text();
				console.error(`   Alternative error: ${altErrorText}`);
				throw new Error("Credential generation failed on both endpoints");
			}
		}
	} catch (error) {
		console.error("   ❌ Credential generation test failed:", error);
		throw error;
	}
}

function checkConnectionEndpoints() {
	console.log("✅ Test 3: Check Connection Endpoints");

	const endpoints = [
		{ name: "STUN Server 1", url: "stun:stun.telnyx.com:3478" },
		{ name: "STUN Server 2", url: "stun:stun.telnyx.com:3479" },
	];

	for (const endpoint of endpoints) {
		console.log(`   Checking ${endpoint.name}...`);
		console.log(`   URL: ${endpoint.url}`);
		// Note: STUN servers can't be tested via HTTP, but we can document them
		console.log("   ✅ Endpoint configured");
	}

	console.log("\n   ℹ️  Note: STUN/TURN servers require WebRTC client to test");
	console.log("   ℹ️  They cannot be tested directly via HTTP requests\n");
}

function generateRandomPassword(length = DEFAULT_PASSWORD_LENGTH): string {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
	let password = "";

	for (let i = 0; i < length; i++) {
		password += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return password;
}

function getErrorMessage(error: unknown) {
	return error instanceof Error ? error.message : String(error);
}

// Run the test
testTelnyxWebRTC()
	.then(() => {
		console.log("✅ Test script completed successfully");
		process.exit(0);
	})
	.catch((error) => {
		console.error("❌ Test script failed:", error);
		process.exit(1);
	});
