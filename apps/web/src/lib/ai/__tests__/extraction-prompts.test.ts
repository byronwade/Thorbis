/**
 * Extraction Prompts Tests
 *
 * Tests for AI call transcript extraction prompts and utilities
 * Verifies prompt formatting, job type detection, and transcript processing
 */

import { describe, it, expect } from "vitest";

import {
	SYSTEM_PROMPT,
	EXTRACTION_PROMPT,
	UPDATE_PROMPT,
	formatTranscriptForExtraction,
} from "../extraction-prompts";

// =============================================================================
// SYSTEM PROMPT TESTS
// =============================================================================

describe("SYSTEM_PROMPT", () => {
	it("should be defined and non-empty", () => {
		expect(SYSTEM_PROMPT).toBeDefined();
		expect(SYSTEM_PROMPT.length).toBeGreaterThan(100);
	});

	it("should describe AI assistant role", () => {
		expect(SYSTEM_PROMPT).toContain("AI assistant");
		expect(SYSTEM_PROMPT).toContain("field service");
	});

	it("should mention customer information extraction", () => {
		expect(SYSTEM_PROMPT).toContain("Customer Information");
		expect(SYSTEM_PROMPT).toContain("name");
		expect(SYSTEM_PROMPT).toContain("email");
		expect(SYSTEM_PROMPT).toContain("phone");
	});

	it("should mention job details extraction", () => {
		expect(SYSTEM_PROMPT).toContain("Job Details");
		expect(SYSTEM_PROMPT).toContain("title");
		expect(SYSTEM_PROMPT).toContain("description");
		expect(SYSTEM_PROMPT).toContain("urgency");
	});

	it("should mention appointment needs extraction", () => {
		expect(SYSTEM_PROMPT).toContain("Appointment Needs");
		expect(SYSTEM_PROMPT).toContain("preferred date");
		expect(SYSTEM_PROMPT).toContain("duration");
	});

	it("should include confidence score instructions", () => {
		expect(SYSTEM_PROMPT).toContain("confidence");
		expect(SYSTEM_PROMPT).toMatch(/0-100|confidence scores/i);
	});

	it("should define expected JSON structure", () => {
		expect(SYSTEM_PROMPT).toContain("customerInfo");
		expect(SYSTEM_PROMPT).toContain("jobDetails");
		expect(SYSTEM_PROMPT).toContain("appointmentNeeds");
		expect(SYSTEM_PROMPT).toContain("callSummary");
		expect(SYSTEM_PROMPT).toContain("sentiment");
		expect(SYSTEM_PROMPT).toContain("tags");
	});

	it("should define urgency levels", () => {
		expect(SYSTEM_PROMPT).toContain("low");
		expect(SYSTEM_PROMPT).toContain("normal");
		expect(SYSTEM_PROMPT).toContain("high");
		expect(SYSTEM_PROMPT).toContain("emergency");
	});

	it("should define time preferences", () => {
		expect(SYSTEM_PROMPT).toContain("morning");
		expect(SYSTEM_PROMPT).toContain("afternoon");
		expect(SYSTEM_PROMPT).toContain("evening");
		expect(SYSTEM_PROMPT).toContain("anytime");
	});

	it("should define sentiment options", () => {
		expect(SYSTEM_PROMPT).toContain("positive");
		expect(SYSTEM_PROMPT).toContain("neutral");
		expect(SYSTEM_PROMPT).toContain("negative");
	});

	it("should include address extraction guidance", () => {
		expect(SYSTEM_PROMPT).toContain("address");
		expect(SYSTEM_PROMPT).toContain("street");
		expect(SYSTEM_PROMPT).toContain("city");
		expect(SYSTEM_PROMPT).toContain("state");
		expect(SYSTEM_PROMPT).toContain("zip");
	});
});

// =============================================================================
// EXTRACTION PROMPT TESTS
// =============================================================================

describe("EXTRACTION_PROMPT", () => {
	it("should be defined and non-empty", () => {
		expect(EXTRACTION_PROMPT).toBeDefined();
		expect(EXTRACTION_PROMPT.length).toBeGreaterThan(50);
	});

	it("should contain transcript placeholder", () => {
		expect(EXTRACTION_PROMPT).toContain("{transcript}");
	});

	it("should mention extraction purpose", () => {
		expect(EXTRACTION_PROMPT.toLowerCase()).toMatch(/analyze|extract/);
	});

	it("should reference customer information", () => {
		expect(EXTRACTION_PROMPT).toContain("customer");
	});

	it("should reference job details", () => {
		expect(EXTRACTION_PROMPT).toContain("job");
	});

	it("should reference appointment needs", () => {
		expect(EXTRACTION_PROMPT).toContain("appointment");
	});

	it("should mention confidence scores", () => {
		expect(EXTRACTION_PROMPT).toContain("confidence");
	});
});

// =============================================================================
// UPDATE PROMPT TESTS
// =============================================================================

describe("UPDATE_PROMPT", () => {
	it("should be defined and non-empty", () => {
		expect(UPDATE_PROMPT).toBeDefined();
		expect(UPDATE_PROMPT.length).toBeGreaterThan(50);
	});

	it("should contain previous extraction placeholder", () => {
		expect(UPDATE_PROMPT).toContain("{previousExtraction}");
	});

	it("should contain new transcript placeholder", () => {
		expect(UPDATE_PROMPT).toContain("{newTranscript}");
	});

	it("should mention updating existing extraction", () => {
		expect(UPDATE_PROMPT.toLowerCase()).toMatch(/update|previous/);
	});

	it("should mention confidence scores", () => {
		expect(UPDATE_PROMPT).toContain("confidence");
	});

	it("should mention handling new information", () => {
		expect(UPDATE_PROMPT.toLowerCase()).toMatch(/new.*information|change/);
	});
});

// =============================================================================
// FORMAT TRANSCRIPT FUNCTION TESTS
// =============================================================================

describe("formatTranscriptForExtraction", () => {
	it("should format a single entry", () => {
		const entries = [
			{
				speaker: "csr",
				text: "Hello, how can I help you?",
				timestamp: new Date("2024-01-15T10:30:00"),
			},
		];

		const result = formatTranscriptForExtraction(entries);

		expect(result).toContain("CSR:");
		expect(result).toContain("Hello, how can I help you?");
	});

	it("should format multiple entries", () => {
		const entries = [
			{
				speaker: "csr",
				text: "Hello, how can I help you?",
				timestamp: new Date("2024-01-15T10:30:00"),
			},
			{
				speaker: "customer",
				text: "My furnace stopped working",
				timestamp: new Date("2024-01-15T10:30:30"),
			},
		];

		const result = formatTranscriptForExtraction(entries);

		expect(result).toContain("CSR:");
		expect(result).toContain("Customer:");
		expect(result.split("\n")).toHaveLength(2);
	});

	it("should label CSR speaker correctly", () => {
		const entries = [
			{
				speaker: "csr",
				text: "Test message",
				timestamp: new Date(),
			},
		];

		const result = formatTranscriptForExtraction(entries);

		expect(result).toContain("CSR:");
	});

	it("should label customer speaker correctly", () => {
		const entries = [
			{
				speaker: "customer",
				text: "Test message",
				timestamp: new Date(),
			},
		];

		const result = formatTranscriptForExtraction(entries);

		expect(result).toContain("Customer:");
	});

	it("should include timestamps", () => {
		const timestamp = new Date("2024-01-15T10:30:45");
		const entries = [
			{
				speaker: "csr",
				text: "Test message",
				timestamp,
			},
		];

		const result = formatTranscriptForExtraction(entries);

		// Should include time in format like [10:30:45 AM]
		expect(result).toMatch(/\[\d{1,2}:\d{2}:\d{2}/);
	});

	it("should handle empty array", () => {
		const entries: Array<{ speaker: string; text: string; timestamp: Date }> = [];

		const result = formatTranscriptForExtraction(entries);

		expect(result).toBe("");
	});

	it("should preserve text content exactly", () => {
		const entries = [
			{
				speaker: "customer",
				text: "I need help with my HVAC system at 123 Main St.",
				timestamp: new Date(),
			},
		];

		const result = formatTranscriptForExtraction(entries);

		expect(result).toContain("I need help with my HVAC system at 123 Main St.");
	});

	it("should handle unknown speaker as Customer", () => {
		const entries = [
			{
				speaker: "unknown",
				text: "Hello",
				timestamp: new Date(),
			},
		];

		const result = formatTranscriptForExtraction(entries);

		// Non-CSR speakers are treated as Customer
		expect(result).toContain("Customer:");
	});

	it("should format long conversations correctly", () => {
		const entries = [
			{
				speaker: "csr",
				text: "Thank you for calling ABC Services.",
				timestamp: new Date("2024-01-15T10:30:00"),
			},
			{
				speaker: "customer",
				text: "Hi, I have a problem with my AC.",
				timestamp: new Date("2024-01-15T10:30:15"),
			},
			{
				speaker: "csr",
				text: "I can help you with that.",
				timestamp: new Date("2024-01-15T10:30:30"),
			},
			{
				speaker: "customer",
				text: "It's not cooling at all.",
				timestamp: new Date("2024-01-15T10:30:45"),
			},
			{
				speaker: "csr",
				text: "Let me schedule a technician for you.",
				timestamp: new Date("2024-01-15T10:31:00"),
			},
		];

		const result = formatTranscriptForExtraction(entries);
		const lines = result.split("\n");

		expect(lines).toHaveLength(5);
		expect(lines[0]).toContain("CSR:");
		expect(lines[1]).toContain("Customer:");
		expect(lines[2]).toContain("CSR:");
		expect(lines[3]).toContain("Customer:");
		expect(lines[4]).toContain("CSR:");
	});
});

// =============================================================================
// PROMPT INTEGRATION TESTS
// =============================================================================

describe("Prompt Integration", () => {
	it("should have compatible system and extraction prompts", () => {
		// Both prompts should reference similar concepts
		const systemLower = SYSTEM_PROMPT.toLowerCase();
		const extractLower = EXTRACTION_PROMPT.toLowerCase();

		// Both mention customer
		expect(systemLower).toContain("customer");
		expect(extractLower).toContain("customer");

		// Both mention job
		expect(systemLower).toContain("job");
		expect(extractLower).toContain("job");
	});

	it("should have compatible system and update prompts", () => {
		// Update prompt should work with system prompt output
		const systemLower = SYSTEM_PROMPT.toLowerCase();
		const updateLower = UPDATE_PROMPT.toLowerCase();

		// Both reference extraction
		expect(systemLower).toMatch(/extract/);
		expect(updateLower).toMatch(/extract/);
	});

	it("should have proper placeholder syntax", () => {
		// Placeholders should be consistent format
		const placeholderPattern = /\{[a-zA-Z]+\}/g;

		const extractionPlaceholders = EXTRACTION_PROMPT.match(placeholderPattern);
		const updatePlaceholders = UPDATE_PROMPT.match(placeholderPattern);

		expect(extractionPlaceholders).toContain("{transcript}");
		expect(updatePlaceholders).toContain("{previousExtraction}");
		expect(updatePlaceholders).toContain("{newTranscript}");
	});
});

// =============================================================================
// FIELD SERVICE INDUSTRY CONTEXT TESTS
// =============================================================================

describe("Field Service Industry Context", () => {
	it("should mention field service in system prompt", () => {
		expect(SYSTEM_PROMPT).toContain("field service");
	});

	it("should support HVAC terminology", () => {
		const systemLower = SYSTEM_PROMPT.toLowerCase();
		// System prompt should be general enough to handle HVAC terms
		expect(systemLower).toContain("job type");
	});

	it("should support urgency classification", () => {
		expect(SYSTEM_PROMPT).toContain("urgent");
		expect(SYSTEM_PROMPT).toContain("emergency");
	});

	it("should support appointment scheduling context", () => {
		expect(SYSTEM_PROMPT).toContain("appointment");
		expect(SYSTEM_PROMPT).toContain("preferred");
		expect(SYSTEM_PROMPT).toContain("duration");
	});

	it("should handle address parsing for service calls", () => {
		expect(SYSTEM_PROMPT).toContain("street");
		expect(SYSTEM_PROMPT).toContain("city");
		expect(SYSTEM_PROMPT).toContain("state");
		expect(SYSTEM_PROMPT).toContain("zipCode");
	});
});

// =============================================================================
// JSON SCHEMA VALIDATION TESTS
// =============================================================================

describe("JSON Schema Structure", () => {
	it("should define valid JSON schema in system prompt", () => {
		// Extract JSON-like structure from prompt
		const jsonMatch = SYSTEM_PROMPT.match(/\{[\s\S]*"customerInfo"[\s\S]*\}/);
		expect(jsonMatch).not.toBeNull();
	});

	it("should define nested address object", () => {
		expect(SYSTEM_PROMPT).toContain('"address"');
		expect(SYSTEM_PROMPT).toContain('"street"');
		expect(SYSTEM_PROMPT).toContain('"full"');
	});

	it("should define urgency as enum", () => {
		expect(SYSTEM_PROMPT).toMatch(/"urgency":\s*"low"\s*\|\s*"normal"\s*\|\s*"high"\s*\|\s*"emergency"/);
	});

	it("should define timePreference as enum", () => {
		expect(SYSTEM_PROMPT).toMatch(/"timePreference":\s*"morning"\s*\|\s*"afternoon"\s*\|\s*"evening"\s*\|\s*"anytime"/);
	});

	it("should define sentiment as enum", () => {
		expect(SYSTEM_PROMPT).toMatch(/"sentiment":\s*"positive"\s*\|\s*"neutral"\s*\|\s*"negative"/);
	});

	it("should define tags as array", () => {
		expect(SYSTEM_PROMPT).toMatch(/"tags":\s*string\[\]/);
	});
});

// =============================================================================
// PROMPT QUALITY TESTS
// =============================================================================

describe("Prompt Quality", () => {
	it("should have clear instructions", () => {
		expect(SYSTEM_PROMPT).toContain("IMPORTANT RULES");
	});

	it("should have numbered extraction priorities", () => {
		expect(SYSTEM_PROMPT).toMatch(/1\.\s*Customer Information/);
		expect(SYSTEM_PROMPT).toMatch(/2\.\s*Job Details/);
		expect(SYSTEM_PROMPT).toMatch(/3\.\s*Appointment Needs/);
	});

	it("should emphasize explicit information only", () => {
		expect(SYSTEM_PROMPT.toLowerCase()).toMatch(/only.*explicitly|explicitly.*mentioned/);
	});

	it("should mention ISO format for dates", () => {
		expect(SYSTEM_PROMPT).toContain("ISO format");
	});

	it("should be concise enough for cost-effective models", () => {
		// Prompt should not be excessively long
		expect(SYSTEM_PROMPT.length).toBeLessThan(5000);
	});
});
